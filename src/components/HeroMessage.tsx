import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'

type HeroAnimation = 'slide' | 'flicker' | 'focus' | 'type' | 'split'

type HeroTopic = {
  lines: [string, string]
  animation: HeroAnimation
  description: string
  copyDelay: number
}

const heroTopics: HeroTopic[] = [
  {
    lines: ['GROW', 'TOGETHER'],
    animation: 'slide',
    description: 'Build your professional identity, discover better opportunities, and move forward with the right people and YGrow One beside you.',
    copyDelay: 950,
  },
  {
    lines: ['BUILD', 'YOUR STORY'],
    animation: 'flicker',
    description: 'Turn projects, skills, decisions, and goals into a living career story that grows more useful with every chapter.',
    copyDelay: 1150,
  },
  {
    lines: ['FIND', 'YOUR FIT'],
    animation: 'focus',
    description: 'Discover roles, people, and companies aligned with your experience - not just the keywords on a resume.',
    copyDelay: 1050,
  },
  {
    lines: ['MOVE', 'FORWARD'],
    animation: 'type',
    description: 'Keep opportunities, conversations, interviews, and next steps connected so your career momentum never gets lost.',
    copyDelay: 1400,
  },
  {
    lines: ['RISE', 'TOGETHER'],
    animation: 'split',
    description: 'Learn from every move, support the people around you, and turn shared context into lasting career growth.',
    copyDelay: 1050,
  },
]

type CircleTone = 'navy' | 'coral' | 'teal' | 'blue' | 'white'
type HeroCircle = [CircleTone, number, number, number, number, number, number, number, number]

// tone, x, y, size, delay, entry x/y, idle x/y. The array order is the visual story.
const heroScenes: HeroCircle[][] = [
  // Grow together: one shared center expands into a wider network.
  [
    ['teal', 41, 41, 18, 0, 0, 0, 2, -3],
    ['coral', 29, 34, 13, 150, 90, 55, -3, -2],
    ['blue', 59, 35, 15, 300, -88, 54, 3, -2],
    ['white', 54, 58, 12, 450, -52, -85, 2, 3],
    ['navy', 31, 58, 16, 600, 83, -83, -2, 3],
    ['teal', 12, 44, 10, 760, 210, 25, -4, 1],
    ['white', 44, 15, 11, 920, 15, 185, 1, -4],
    ['coral', 77, 48, 10, 1080, -215, 0, 4, 1],
    ['blue', 62, 77, 13, 1240, -90, -200, 3, 4],
    ['navy', 22, 76, 10, 1400, 170, -195, -3, 4],
    ['teal', 78, 21, 8, 1560, -215, 175, 4, -3],
    ['white', 14, 17, 7, 1720, 220, 185, -4, -3],
  ],
  // Build your story: chapters rise along a deliberate path.
  [
    ['navy', 15, 77, 17, 0, -55, 90, -3, 3],
    ['coral', 31, 69, 11, 170, -75, 90, 2, 3],
    ['white', 42, 61, 15, 340, -65, 90, -2, 3],
    ['teal', 57, 68, 10, 510, -45, 85, 3, 3],
    ['blue', 66, 55, 16, 680, -55, 95, 3, 2],
    ['navy', 52, 46, 11, 850, 40, 90, -2, 3],
    ['coral', 38, 39, 14, 1020, 55, 90, -3, 2],
    ['white', 48, 27, 10, 1190, 25, 95, 2, -3],
    ['teal', 60, 18, 15, 1360, -45, 105, 3, -3],
    ['blue', 76, 10, 9, 1530, -75, 105, 3, -3],
  ],
  // Find your fit: two sets converge and resolve into one clear match.
  [
    ['navy', 13, 21, 14, 0, -110, 0, -3, -2],
    ['teal', 73, 19, 12, 130, 110, 0, 3, -2],
    ['coral', 20, 43, 10, 300, -120, 0, -3, 1],
    ['blue', 72, 42, 16, 430, 120, 0, 3, 1],
    ['white', 14, 67, 16, 600, -120, 0, -3, 3],
    ['navy', 76, 70, 9, 730, 110, 0, 3, 3],
    ['teal', 34, 31, 12, 900, -85, 25, -2, -2],
    ['coral', 56, 60, 11, 1040, 85, -25, 2, 2],
    ['white', 38, 57, 9, 1190, -70, -40, -2, 2],
    ['blue', 45, 42, 18, 1380, 0, 0, 1, -2],
  ],
  // Move forward: momentum travels left to right in three paced lanes.
  [
    ['navy', 8, 18, 12, 0, -130, 0, 3, -1],
    ['teal', 29, 16, 15, 140, -150, 0, 4, -1],
    ['white', 55, 20, 10, 280, -170, 0, 3, -1],
    ['blue', 76, 16, 15, 420, -190, 0, 4, -1],
    ['coral', 15, 44, 10, 620, -140, 0, 3, 0],
    ['navy', 35, 39, 18, 760, -160, 0, 4, 0],
    ['teal', 64, 43, 12, 900, -180, 0, 3, 0],
    ['white', 82, 45, 8, 1040, -200, 0, 4, 0],
    ['blue', 8, 71, 15, 1240, -140, 0, 3, 1],
    ['white', 36, 73, 10, 1380, -160, 0, 4, 1],
    ['coral', 58, 68, 16, 1520, -180, 0, 3, 1],
    ['teal', 82, 72, 10, 1660, -200, 0, 4, 1],
  ],
  // Rise together: the foundation appears first, then every level lifts upward.
  [
    ['navy', 34, 80, 18, 0, 0, 130, -2, 3],
    ['white', 53, 82, 12, 150, 0, 130, 2, 3],
    ['blue', 23, 68, 14, 320, 0, 125, -3, 3],
    ['teal', 46, 65, 17, 470, 0, 125, 2, 3],
    ['coral', 67, 68, 10, 620, 0, 125, 3, 3],
    ['navy', 31, 49, 12, 790, 0, 120, -3, 2],
    ['white', 52, 47, 15, 940, 0, 120, 2, 2],
    ['teal', 70, 46, 11, 1090, 0, 120, 3, 2],
    ['coral', 42, 31, 14, 1260, 0, 115, -2, -3],
    ['blue', 62, 27, 11, 1410, 0, 115, 3, -3],
    ['teal', 50, 10, 13, 1580, 0, 115, 1, -4],
  ],
]

function AnimatedTitle({ topic }: { topic: HeroTopic }) {
  if (topic.animation === 'type') {
    return <>{topic.lines.map((line, lineIndex) => {
      const delayOffset = lineIndex === 0 ? 0 : topic.lines[0].length * 65 + 140
      return <span key={line} className="hero-topic-line hero-type-line" aria-hidden="true">
        {Array.from(line).map((letter, letterIndex) => <span key={`${letter}-${letterIndex}`} className="hero-type-letter" style={{ animationDelay: `${delayOffset + letterIndex * 65}ms` }}>{letter === ' ' ? '\u00a0' : letter}</span>)}
      </span>
    })}</>
  }

  return <>{topic.lines.map((line, index) => <span key={line} className={`hero-topic-line ${index === 1 ? 'hero-topic-line-delay' : ''}`} aria-hidden="true">{line}</span>)}</>
}

function TypedCopy({ text, delay }: { text: string; delay: number }) {
  const [visibleCharacters, setVisibleCharacters] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleCharacters(text.length)
      setHasStarted(false)
      return
    }

    let characterIndex = 0
    let timeoutId: number

    const revealNextCharacter = () => {
      characterIndex += 1
      setHasStarted(true)
      setVisibleCharacters(characterIndex)

      if (characterIndex >= text.length) return

      const typedCharacter = text[characterIndex - 1]
      const typingDelay = typedCharacter === ' '
        ? 105
        : /[,.!?;:]/.test(typedCharacter)
          ? 190
          : 28 + (characterIndex % 4) * 5

      timeoutId = window.setTimeout(revealNextCharacter, typingDelay)
    }

    setVisibleCharacters(0)
    setHasStarted(false)
    timeoutId = window.setTimeout(revealNextCharacter, delay)

    return () => window.clearTimeout(timeoutId)
  }, [delay, text])

  return (
    <p className="hero-topic-copy mt-8 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl" aria-label={text}>
      <span className="hero-copy-text" aria-hidden="true">{text.slice(0, visibleCharacters)}</span>
      {hasStarted && <span className="hero-copy-cursor" aria-hidden="true" />}
    </p>
  )
}

function HeroKineticScene({ activeTopic }: { activeTopic: number }) {
  return (
    <div className="hero-kinetic-wrap" aria-hidden="true">
      <div key={activeTopic} className={`hero-kinetic-scene hero-kinetic-scene-${activeTopic + 1}`}>
        {heroScenes[activeTopic].map(([tone, x, y, size, delay, enterX, enterY, floatX, floatY], index) => (
          <span
            key={`${activeTopic}-${index}`}
            className="hero-circle-slot"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}%`,
              '--circle-delay': `${Math.round(delay * 1.35)}ms`,
              '--circle-float-delay': `${Math.round(delay * 1.35) + 600}ms`,
              '--circle-duration': `${3800 + (index % 4) * 420}ms`,
              '--circle-enter-x': `${enterX}px`,
              '--circle-enter-y': `${enterY}px`,
              '--circle-float-x': `${floatX}px`,
              '--circle-float-y': `${floatY}px`,
            } as CSSProperties}
          >
            <i className={`hero-circle hero-circle-${tone}`} />
          </span>
        ))}
      </div>
      <span className="hero-scene-label">0{activeTopic + 1} / 05</span>
    </div>
  )
}

export default function HeroMessage({ children }: { children?: ReactNode }) {
  const [activeTopic, setActiveTopic] = useState(0)
  const topic = heroTopics[activeTopic]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => {
      setActiveTopic((current) => (current + 1) % heroTopics.length)
    }, 8000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="hero-experience">
      <div className="hero-message-column">
        <div key={activeTopic} className="hero-message-cycle">
          <h1
            aria-label={topic.lines.join(' ')}
            className={`hero-topic-heading hero-topic-${topic.animation} text-[clamp(3.3rem,6.5vw,6.6rem)] font-medium leading-[.88] tracking-[-.04em] text-white`}
          >
            <AnimatedTitle topic={topic} />
          </h1>
          <TypedCopy text={topic.description} delay={topic.copyDelay} />
        </div>
        {children}
      </div>
      <HeroKineticScene activeTopic={activeTopic} />
    </div>
  )
}
