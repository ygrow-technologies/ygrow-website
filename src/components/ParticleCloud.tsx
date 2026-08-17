import { useEffect, useRef } from 'react'
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

type ParticleShape = 'circle' | 'square' | 'bar'

type ParticleGroup = {
  geometry: BufferGeometry
  interaction: Float32Array
  life: Float32Array
  material: ShaderMaterial
  opacity: number
  points: Points
  route: Float32Array
  velocity: Float32Array
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

const smoothStep = (edgeStart: number, edgeEnd: number, value: number) => {
  const progress = clamp01((value - edgeStart) / Math.max(edgeEnd - edgeStart, 0.0001))
  return progress * progress * (3 - 2 * progress)
}

const easeInFadeOut = (progress: number, fadeFraction: number) => {
  const fadeProgress = clamp01((progress - (1 - fadeFraction)) / fadeFraction)
  return 1 - Math.pow(fadeProgress, 2.4)
}

const writeRoutePosition = (
  route: Float32Array,
  life: Float32Array,
  particleIndex: number,
  progress: number,
  positions: Float32Array,
) => {
  const routeOffset = particleIndex * 12
  const lifeOffset = particleIndex * 8
  const positionOffset = particleIndex * 3

  if (life[lifeOffset + 7] > 0.5) {
    const direction = route[routeOffset + 9]
    const angle = life[lifeOffset + 5] + progress * Math.PI * 2 * direction
    const cosine = Math.cos(angle)
    const sine = Math.sin(angle)
    for (let axis = 0; axis < 3; axis += 1) {
      positions[positionOffset + axis] =
        route[routeOffset + axis] +
        route[routeOffset + 3 + axis] * cosine +
        route[routeOffset + 6 + axis] * sine
    }
    return
  }

  const inverse = 1 - progress
  const startWeight = inverse * inverse * inverse
  const controlOneWeight = 3 * inverse * inverse * progress
  const controlTwoWeight = 3 * inverse * progress * progress
  const endWeight = progress * progress * progress

  for (let axis = 0; axis < 3; axis += 1) {
    positions[positionOffset + axis] =
      route[routeOffset + axis] * startWeight +
      route[routeOffset + 3 + axis] * controlOneWeight +
      route[routeOffset + 6 + axis] * controlTwoWeight +
      route[routeOffset + 9 + axis] * endWeight
  }
}

const particleVertexShader = `
  attribute float aAlpha;
  uniform float uPixelRatio;
  uniform float uSize;
  varying float vAlpha;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * uPixelRatio * (320.0 / max(1.0, -viewPosition.z));
    vAlpha = aAlpha;
  }
`

const particleFragmentShader = `
  uniform vec3 uColor;
  uniform sampler2D uMap;
  uniform float uReveal;
  varying float vAlpha;

  void main() {
    vec4 particle = texture2D(uMap, gl_PointCoord);
    if (particle.a < 0.05) discard;
    gl_FragColor = vec4(uColor, particle.a * vAlpha * uReveal);
  }
`

function createParticleTexture(shape: ParticleShape) {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')
  if (!context) return new CanvasTexture(canvas)

  context.clearRect(0, 0, 64, 64)
  context.fillStyle = '#ffffff'
  if (shape === 'circle') {
    context.beginPath()
    context.arc(32, 32, 18, 0, Math.PI * 2)
    context.fill()
  } else if (shape === 'square') {
    context.fillRect(15, 15, 34, 34)
  } else {
    context.fillRect(10, 25, 44, 14)
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export default function ParticleCloud() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new Scene()
    const camera = new PerspectiveCamera(46, 1, 0.1, 30)
    camera.position.z = 6

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch {
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    renderer.outputColorSpace = SRGBColorSpace
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.appendChild(renderer.domElement)

    const isSmall = window.innerWidth < 768
    const definitions: Array<{ count: number; opacity: number; shape: ParticleShape; size: number }> = [
      { count: isSmall ? 960 : 1920, opacity: 1, shape: 'circle', size: 0.065 },
      { count: isSmall ? 900 : 1800, opacity: 1, shape: 'square', size: 0.052 },
      { count: isSmall ? 580 : 160, opacity: 1, shape: 'bar', size: 0.068 },
    ]

    const textures: CanvasTexture[] = []
    const groups: ParticleGroup[] = []
    const radius = 3

    const resetParticle = (
      route: Float32Array,
      life: Float32Array,
      positions: Float32Array,
      velocity: Float32Array,
      particleIndex: number,
      initial: boolean,
    ) => {
      const positionOffset = particleIndex * 3
      const routeOffset = particleIndex * 12
      const lifeOffset = particleIndex * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const directionX = Math.sin(phi) * Math.cos(theta)
      const directionY = Math.cos(phi)
      const directionZ = Math.sin(phi) * Math.sin(theta)

      let randomX = Math.random() * 2 - 1
      let randomY = Math.random() * 2 - 1
      let randomZ = Math.random() * 2 - 1
      let tangentX = directionY * randomZ - directionZ * randomY
      let tangentY = directionZ * randomX - directionX * randomZ
      let tangentZ = directionX * randomY - directionY * randomX
      let tangentLength = Math.hypot(tangentX, tangentY, tangentZ)
      if (tangentLength < 0.001) {
        randomX = 0
        randomY = 1
        randomZ = 0
        tangentX = directionY * randomZ - directionZ * randomY
        tangentY = directionZ * randomX - directionX * randomZ
        tangentZ = directionX * randomY - directionY * randomX
        tangentLength = Math.hypot(tangentX, tangentY, tangentZ)
      }
      tangentX /= tangentLength
      tangentY /= tangentLength
      tangentZ /= tangentLength

      const bitangentX = directionY * tangentZ - directionZ * tangentY
      const bitangentY = directionZ * tangentX - directionX * tangentZ
      const bitangentZ = directionX * tangentY - directionY * tangentX

      // Routes are local micro-movements. Their radius never exceeds 5% of the
      // cloud radius; changing the emission center only happens while invisible.
      const boundaryEmission = Math.random() < 0.72
      const centerDistance = boundaryEmission
        ? radius * (0.72 + Math.random() * 0.23)
        : radius * (0.16 + Math.cbrt(Math.random()) * 0.54)
      const centerX = directionX * centerDistance
      const centerY = directionY * centerDistance
      const centerZ = directionZ * centerDistance
      const localRadius = radius * (0.018 + Math.random() * 0.032)
      const routeRoll = Math.random()
      const useOrbit = routeRoll < 0.05
      const useSRoute = routeRoll >= 0.05 && routeRoll < 0.1

      if (useOrbit) {
        route[routeOffset] = centerX
        route[routeOffset + 1] = centerY
        route[routeOffset + 2] = centerZ
        route[routeOffset + 3] = tangentX * localRadius
        route[routeOffset + 4] = tangentY * localRadius
        route[routeOffset + 5] = tangentZ * localRadius
        route[routeOffset + 6] = bitangentX * localRadius
        route[routeOffset + 7] = bitangentY * localRadius
        route[routeOffset + 8] = bitangentZ * localRadius
        route[routeOffset + 9] = Math.random() < 0.5 ? -1 : 1
        route[routeOffset + 10] = 0
        route[routeOffset + 11] = 0
      } else if (useSRoute) {
        const directionSign = Math.random() < 0.5 ? -1 : 1
        const alongX = tangentX * localRadius * directionSign
        const alongY = tangentY * localRadius * directionSign
        const alongZ = tangentZ * localRadius * directionSign
        const bend = localRadius * (0.58 + Math.random() * 0.32)

        route[routeOffset] = centerX - alongX
        route[routeOffset + 1] = centerY - alongY
        route[routeOffset + 2] = centerZ - alongZ
        route[routeOffset + 3] = centerX - alongX * 0.34 + bitangentX * bend
        route[routeOffset + 4] = centerY - alongY * 0.34 + bitangentY * bend
        route[routeOffset + 5] = centerZ - alongZ * 0.34 + bitangentZ * bend
        route[routeOffset + 6] = centerX + alongX * 0.34 - bitangentX * bend
        route[routeOffset + 7] = centerY + alongY * 0.34 - bitangentY * bend
        route[routeOffset + 8] = centerZ + alongZ * 0.34 - bitangentZ * bend
        route[routeOffset + 9] = centerX + alongX
        route[routeOffset + 10] = centerY + alongY
        route[routeOffset + 11] = centerZ + alongZ
      } else {
        // Most particles follow a shallow curve whose heading only leans inward
        // or outward. The dominant tangent keeps the route organic, not radial.
        const directionalRadius = localRadius * 2
        const inwardOutwardSign = Math.random() < 0.5 ? -1 : 1
        const radialLean = inwardOutwardSign * (0.22 + Math.random() * 0.28)
        const headingAngle = Math.random() * Math.PI * 2
        const tangentWeight = Math.cos(headingAngle)
        const bitangentWeight = Math.sin(headingAngle)
        let headingX = directionX * radialLean + tangentX * tangentWeight + bitangentX * bitangentWeight
        let headingY = directionY * radialLean + tangentY * tangentWeight + bitangentY * bitangentWeight
        let headingZ = directionZ * radialLean + tangentZ * tangentWeight + bitangentZ * bitangentWeight
        const headingLength = Math.hypot(headingX, headingY, headingZ)
        headingX /= headingLength
        headingY /= headingLength
        headingZ /= headingLength

        const curveX = -tangentX * bitangentWeight + bitangentX * tangentWeight
        const curveY = -tangentY * bitangentWeight + bitangentY * tangentWeight
        const curveZ = -tangentZ * bitangentWeight + bitangentZ * tangentWeight
        const bend = directionalRadius * (0.18 + Math.random() * 0.2)
        const alongX = headingX * directionalRadius
        const alongY = headingY * directionalRadius
        const alongZ = headingZ * directionalRadius

        route[routeOffset] = centerX - alongX
        route[routeOffset + 1] = centerY - alongY
        route[routeOffset + 2] = centerZ - alongZ
        route[routeOffset + 3] = centerX - alongX * 0.32 + curveX * bend
        route[routeOffset + 4] = centerY - alongY * 0.32 + curveY * bend
        route[routeOffset + 5] = centerZ - alongZ * 0.32 + curveZ * bend
        route[routeOffset + 6] = centerX + alongX * 0.32 + curveX * bend
        route[routeOffset + 7] = centerY + alongY * 0.32 + curveY * bend
        route[routeOffset + 8] = centerZ + alongZ * 0.32 + curveZ * bend
        route[routeOffset + 9] = centerX + alongX
        route[routeOffset + 10] = centerY + alongY
        route[routeOffset + 11] = centerZ + alongZ
      }

      const timingVariance = () => 0.85 + Math.random() * 0.3
      const duration = 2.1 * timingVariance()
      life[lifeOffset] = initial ? Math.random() * duration : 0
      life[lifeOffset + 1] = duration
      life[lifeOffset + 2] = initial ? 0 : 0.2 * timingVariance()
      life[lifeOffset + 3] = 0.14 * timingVariance()
      life[lifeOffset + 4] = 0.2
      life[lifeOffset + 5] = Math.random() * Math.PI * 2
      life[lifeOffset + 6] = 0.58 + Math.random() * 0.42
      life[lifeOffset + 7] = useOrbit ? 1 : 0

      const initialProgress = life[lifeOffset] / duration
      writeRoutePosition(route, life, particleIndex, initialProgress, positions)
      velocity[positionOffset] = 0
      velocity[positionOffset + 1] = 0
      velocity[positionOffset + 2] = 0
    }

    definitions.forEach((definition) => {
      const texture = createParticleTexture(definition.shape)
      textures.push(texture)
      const positions = new Float32Array(definition.count * 3)
      const velocity = new Float32Array(definition.count * 3)
      const route = new Float32Array(definition.count * 12)
      const life = new Float32Array(definition.count * 8)
      const interaction = new Float32Array(definition.count * 3)
      const alpha = new Float32Array(definition.count)

      for (let index = 0; index < definition.count; index += 1) {
        resetParticle(route, life, positions, velocity, index, true)
        const lifeOffset = index * 8
        const interactionOffset = index * 3
        interaction[interactionOffset] = 1.65 + Math.random() * 0.75
        interaction[interactionOffset + 1] = 1.6 + Math.random() * 0.85
        const interactionRoute = Math.random()
        interaction[interactionOffset + 2] =
          interactionRoute < 0.45
            ? (Math.random() - 0.5) * 0.22
            : (interactionRoute < 0.725 ? 1 : -1) * (1.35 + Math.random() * 0.65)
        const progress = life[lifeOffset] / life[lifeOffset + 1]
        const fadeIn = smoothStep(0, life[lifeOffset + 3], progress)
        const fadeOut = easeInFadeOut(progress, life[lifeOffset + 4])
        alpha[index] = definition.opacity * life[lifeOffset + 6] * fadeIn * fadeOut
      }

      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new BufferAttribute(positions, 3))
      geometry.setAttribute('aAlpha', new BufferAttribute(alpha, 1))
      geometry.setDrawRange(0, reducedMotion ? definition.count : 0)
      const material = new ShaderMaterial({
        depthWrite: false,
        fragmentShader: particleFragmentShader,
        transparent: true,
        uniforms: {
          uColor: { value: new Color(0x0a1433) },
          uMap: { value: texture },
          uPixelRatio: { value: renderer.getPixelRatio() },
          uReveal: { value: reducedMotion ? 1 : 0 },
          uSize: { value: definition.size },
        },
        vertexShader: particleVertexShader,
      })
      const points = new Points(geometry, material)
      scene.add(points)
      groups.push({ geometry, interaction, life, material, opacity: definition.opacity, points, route, velocity })
    })

    const pointer = new Vector2(10, 10)
    const pointerWorld = new Vector3(10, 10, 0)
    const unprojected = new Vector3()
    const direction = new Vector3()
    let pointerActive = false
    let pointerEnergy = 0
    let pointerEnergyTarget = 0
    let previousPointerX = 0
    let previousPointerY = 0
    let previousPointerTime = performance.now()
    let cloudOffsetX = 0
    let animationFrame = 0
    let previousFrame = performance.now()
    const revealStartedAt = previousFrame
    const revealDuration = 1800

    const updatePointerWorld = () => {
      unprojected.set(pointer.x, pointer.y, 0.5).unproject(camera)
      direction.copy(unprojected).sub(camera.position).normalize()
      const distance = -camera.position.z / direction.z
      pointerWorld.copy(camera.position).add(direction.multiplyScalar(distance))
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect()
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom
      pointerActive = inside
      if (!inside) return

      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      updatePointerWorld()

      const now = performance.now()
      const elapsed = Math.max(now - previousPointerTime, 8)
      const velocity = Math.hypot(event.clientX - previousPointerX, event.clientY - previousPointerY) / elapsed
      pointerEnergyTarget = Math.min(2.8, velocity * 1.8)
      previousPointerX = event.clientX
      previousPointerY = event.clientY
      previousPointerTime = now
    }

    const handlePointerLeave = () => {
      pointerActive = false
      pointerEnergyTarget = 0
    }

    const resize = () => {
      const bounds = host.getBoundingClientRect()
      const width = Math.max(bounds.width, 1)
      const height = Math.max(bounds.height, 1)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      cloudOffsetX = width >= 1024 ? 0.4 : 0
      groups.forEach((group) => {
        group.points.position.x = cloudOffsetX
        group.material.uniforms.uPixelRatio.value = renderer.getPixelRatio()
      })
      updatePointerWorld()
    }

    const renderFrame = (now: number) => {
      const frameScale = Math.min((now - previousFrame) / 16.67, 2)
      previousFrame = now
      const revealProgress = clamp01((now - revealStartedAt) / revealDuration)
      const revealCountProgress = revealProgress * revealProgress * (3 - 2 * revealProgress)
      const revealOpacity = smoothStep(0, 0.32, revealProgress)
      pointerEnergy += (pointerEnergyTarget - pointerEnergy) * 0.075
      pointerEnergyTarget *= 0.94
      const cursorRadius = 0.275 + pointerEnergy * 0.08
      const frameSeconds = frameScale / 60

      groups.forEach((group, groupIndex) => {
        const positions = group.geometry.attributes.position.array as Float32Array
        const alphas = group.geometry.attributes.aAlpha.array as Float32Array
        const particleCount = positions.length / 3
        group.geometry.setDrawRange(0, Math.ceil(particleCount * revealCountProgress))
        group.material.uniforms.uReveal.value = revealOpacity
        for (let index = 0; index < positions.length; index += 3) {
          const particleIndex = index / 3
          const lifeOffset = particleIndex * 8
          const routeOffset = particleIndex * 12

          if (group.life[lifeOffset + 2] > 0) {
            group.life[lifeOffset + 2] -= frameSeconds
            alphas[particleIndex] = 0
            continue
          }

          group.life[lifeOffset] += frameSeconds
          if (group.life[lifeOffset] >= group.life[lifeOffset + 1]) {
            resetParticle(group.route, group.life, positions, group.velocity, particleIndex, false)
            alphas[particleIndex] = 0
            continue
          }

          const progress = group.life[lifeOffset] / group.life[lifeOffset + 1]
          const routePhase = group.life[lifeOffset + 5]
          const speedVariation = Math.sin(progress * Math.PI * 5 + routePhase) * 0.014 * Math.sin(progress * Math.PI)
          const routeProgress = clamp01(progress + speedVariation)
          let targetX: number
          let targetY: number
          let targetZ: number

          if (group.life[lifeOffset + 7] > 0.5) {
            const directionSign = group.route[routeOffset + 9]
            const angle = routePhase + routeProgress * Math.PI * 2 * directionSign
            const cosine = Math.cos(angle)
            const sine = Math.sin(angle)
            targetX = group.route[routeOffset] + group.route[routeOffset + 3] * cosine + group.route[routeOffset + 6] * sine
            targetY = group.route[routeOffset + 1] + group.route[routeOffset + 4] * cosine + group.route[routeOffset + 7] * sine
            targetZ = group.route[routeOffset + 2] + group.route[routeOffset + 5] * cosine + group.route[routeOffset + 8] * sine
          } else {
            const inverse = 1 - routeProgress
            const startWeight = inverse * inverse * inverse
            const controlOneWeight = 3 * inverse * inverse * routeProgress
            const controlTwoWeight = 3 * inverse * routeProgress * routeProgress
            const endWeight = routeProgress * routeProgress * routeProgress
            targetX =
              group.route[routeOffset] * startWeight +
              group.route[routeOffset + 3] * controlOneWeight +
              group.route[routeOffset + 6] * controlTwoWeight +
              group.route[routeOffset + 9] * endWeight
            targetY =
              group.route[routeOffset + 1] * startWeight +
              group.route[routeOffset + 4] * controlOneWeight +
              group.route[routeOffset + 7] * controlTwoWeight +
              group.route[routeOffset + 10] * endWeight
            targetZ =
              group.route[routeOffset + 2] * startWeight +
              group.route[routeOffset + 5] * controlOneWeight +
              group.route[routeOffset + 8] * controlTwoWeight +
              group.route[routeOffset + 11] * endWeight
          }

          group.velocity[index] += (targetX - positions[index]) * 0.06 * frameScale
          group.velocity[index + 1] += (targetY - positions[index + 1]) * 0.06 * frameScale
          group.velocity[index + 2] += (targetZ - positions[index + 2]) * 0.052 * frameScale

          if (pointerActive) {
            const depthPerspective = 1 + positions[index + 2] * 0.05
            const deltaX = (positions[index] + cloudOffsetX) * depthPerspective - pointerWorld.x
            const deltaY = positions[index + 1] * depthPerspective - pointerWorld.y
            const distanceSquared = deltaX * deltaX + deltaY * deltaY
            const interactionOffset = particleIndex * 3
            const particleCursorRadius = cursorRadius * group.interaction[interactionOffset]
            if (distanceSquared < particleCursorRadius * particleCursorRadius) {
              const distance = Math.sqrt(distanceSquared) + 0.001
              const proximity = smoothStep(0, 1, 1 - distance / particleCursorRadius)
              const responseSpeed = group.interaction[interactionOffset + 1]
              const curl =
                group.interaction[interactionOffset + 2] +
                Math.sin(routePhase + progress * Math.PI * 2) * 0.1
              const normalX = deltaX / distance
              const normalY = deltaY / distance
              const routeX = normalX - normalY * curl
              const routeY = normalY + normalX * curl
              const routeLength = Math.hypot(routeX, routeY)
              const impulse = proximity * (0.00115 + pointerEnergy * 0.006) * responseSpeed
              group.velocity[index] += (routeX / routeLength) * impulse * frameScale
              group.velocity[index + 1] += (routeY / routeLength) * impulse * frameScale
              group.velocity[index + 2] += Math.sin(index + groupIndex) * impulse * 0.22
            }
          }

          const damping = Math.pow(0.82, frameScale)
          group.velocity[index] *= damping
          group.velocity[index + 1] *= damping
          group.velocity[index + 2] *= damping
          positions[index] += group.velocity[index] * frameScale
          positions[index + 1] += group.velocity[index + 1] * frameScale
          positions[index + 2] += group.velocity[index + 2] * frameScale

          const fadeIn = smoothStep(0, group.life[lifeOffset + 3], progress)
          const fadeOut = easeInFadeOut(progress, group.life[lifeOffset + 4])
          alphas[particleIndex] = group.opacity * group.life[lifeOffset + 6] * fadeIn * fadeOut
        }
        group.geometry.attributes.position.needsUpdate = true
        group.geometry.attributes.aAlpha.needsUpdate = true
      })

      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(renderFrame)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    resize()

    if (reducedMotion) {
      renderer.render(scene, camera)
    } else {
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      window.addEventListener('blur', handlePointerLeave)
      document.addEventListener('mouseleave', handlePointerLeave)
      animationFrame = window.requestAnimationFrame(renderFrame)
    }

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', handlePointerLeave)
      document.removeEventListener('mouseleave', handlePointerLeave)
      groups.forEach((group) => {
        scene.remove(group.points)
        group.geometry.dispose()
        group.material.dispose()
      })
      textures.forEach((texture) => texture.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} className="particle-cloud" aria-hidden="true" />
}
