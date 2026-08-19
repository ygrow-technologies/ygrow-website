import { ClipboardList, RotateCw, Sparkles, Target, UserRound } from 'lucide-react'
import logoMono from '../assets/logo-dark.png'

const orbitItems = [
  { label: 'Profile', tone: 'coral', icon: UserRound, tilt: -14 },
  { label: 'Match', tone: 'blue', icon: Target, tilt: 7 },
  { label: 'Context', tone: 'teal', icon: ClipboardList, tilt: -5 },
  { label: 'YGrow One', tone: 'navy', icon: Sparkles, tilt: 9 },
]

type CareerOrbitProps = {
  active: number
  progress: number
}

export default function CareerOrbit({ active, progress }: CareerOrbitProps) {
  const rotation = progress * 270

  return (
    <div className="career-orbit-shell" aria-hidden="true">
      <div className="career-orbit-hint"><RotateCw size={15} /> Scroll to rotate</div>
      <div className="career-orbit-track" style={{ transform: `rotate(${-rotation}deg)` }}>
        {orbitItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={item.label} className={`career-orbit-tile career-orbit-${item.tone} career-orbit-position-${index + 1} ${active === index ? 'is-active' : ''}`}>
              <div className="career-orbit-content-frame" style={{ transform: `rotate(${rotation - item.tilt}deg)` }}>
                <div className="career-orbit-tile-content">
                  <span className="career-orbit-stage">Stage 0{index + 1}</span>
                  <span className="career-orbit-icon"><Icon size={25} strokeWidth={1.8} /></span>
                  <strong>{item.label}</strong>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="career-orbit-core">
        <img className="career-orbit-core-logo" src={logoMono} alt="" />
      </div>
    </div>
  )
}
