import { ArrowRight, BriefcaseBusiness, CircleCheck, Code2, Network, Sparkles, Target } from 'lucide-react'

const inputs = [
  { className: 'context-node-opportunity', icon: BriefcaseBusiness, label: 'Opportunity', detail: 'Role + team signals' },
  { className: 'context-node-profile', icon: CircleCheck, label: 'Your profile', detail: 'Skills + direction' },
  { className: 'context-node-experience', icon: Code2, label: 'Experience', detail: 'Projects + decisions' },
]

const outcomes = [
  { className: 'context-node-prepare', icon: Target, label: 'Focused prep', detail: 'The right examples' },
  { className: 'context-node-interview', icon: Network, label: 'Calmer interview', detail: 'Connected context' },
  { className: 'context-node-insight', icon: ArrowRight, label: 'Sharper next move', detail: 'Learning carried forward' },
]

export default function ContextDiagram() {
  return (
    <figure className="context-diagram" aria-label="YGrow One connects opportunity, profile, and experience context to better preparation, calmer interviews, and sharper career decisions.">
      <svg className="context-diagram-lines" viewBox="0 0 640 520" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="1" className="context-path context-route-1 context-path-coral" d="M92 62 C92 142 220 160 276 210" />
        <path pathLength="1" className="context-path context-route-2 context-path-teal" d="M320 62 C320 124 320 158 320 184" />
        <path pathLength="1" className="context-path context-route-3 context-path-blue" d="M548 62 C548 142 420 160 364 210" />
        <path pathLength="1" className="context-path context-route-4 context-path-teal" d="M276 310 C220 358 92 370 92 448" />
        <path pathLength="1" className="context-path context-route-5 context-path-coral" d="M320 336 C320 370 320 408 320 448" />
        <path pathLength="1" className="context-path context-route-6 context-path-blue" d="M364 310 C420 358 548 370 548 448" />
        <circle className="context-junction context-junction-coral" cx="92" cy="62" r="4" />
        <circle className="context-junction context-junction-teal" cx="320" cy="62" r="4" />
        <circle className="context-junction context-junction-blue" cx="548" cy="62" r="4" />
        <circle className="context-junction context-junction-teal" cx="92" cy="448" r="4" />
        <circle className="context-junction context-junction-coral" cx="320" cy="448" r="4" />
        <circle className="context-junction context-junction-blue" cx="548" cy="448" r="4" />
      </svg>

      <div className="context-diagram-label context-diagram-label-inputs">Your context</div>
      <div className="context-diagram-label context-diagram-label-outcomes">What it unlocks</div>

      {inputs.map(({ className, icon: Icon, label, detail }) => (
        <div key={label} className={`context-node ${className}`}>
          <span className="context-node-orb"><Icon size={19} /></span>
          <p>{label}</p>
          <small>{detail}</small>
        </div>
      ))}

      <div className="context-hub">
        <span className="context-hub-mark"><Sparkles size={25} /></span>
        <strong>YGrow One</strong>
        <small>Context engine</small>
      </div>

      {outcomes.map(({ className, icon: Icon, label, detail }) => (
        <div key={label} className={`context-node ${className}`}>
          <span className="context-node-orb"><Icon size={19} /></span>
          <p>{label}</p>
          <small>{detail}</small>
        </div>
      ))}
    </figure>
  )
}
