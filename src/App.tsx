import { FormEvent, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  Code2,
  Command,
  Compass,
  Github,
  Mail,
  Menu,
  Network,
  Search,
  Send,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import logoDark from './assets/logo-dark.png'
import logoLight from './assets/logo-light.png'
import { trackEvent } from './analytics'
import CareerOrbit from './components/CareerOrbit'
import ContextDiagram from './components/ContextDiagram'
import HeroMessage from './components/HeroMessage'

type Feature = {
  id: string
  tone: 'navy' | 'coral' | 'teal' | 'blue'
  eyebrow: string
  title: string
  description: string
  benefits: string[]
  icon: typeof Sparkles
}

const features: Feature[] = [
  {
    id: 'identity',
    tone: 'coral',
    eyebrow: 'Professional identity',
    title: 'Your whole career, not just a résumé.',
    description:
      'Turn your experience, projects, skills, and goals into a living profile that gets more useful at every stage of your career.',
    benefits: ['One career source of truth', 'Project-level context', 'Profiles that evolve with you'],
    icon: Code2,
  },
  {
    id: 'opportunities',
    tone: 'blue',
    eyebrow: 'Relevant opportunities',
    title: 'Find the roles that fit your next chapter.',
    description:
      'Bring jobs, referrals, recruiters, and direct company connections into a single opportunity stream built around relevance.',
    benefits: ['Context-rich matching', 'Connected referrals', 'Less noise, better fit'],
    icon: Compass,
  },
  {
    id: 'workspace',
    tone: 'teal',
    eyebrow: 'Career workspace',
    title: 'Keep every moving part in one place.',
    description:
      'Track applications, conversations, interviews, notes, and next steps without another sprawling spreadsheet.',
    benefits: ['Visual career pipeline', 'Follow-up reminders', 'Everything tied to the role'],
    icon: BriefcaseBusiness,
  },
  {
    id: 'one',
    tone: 'navy',
    eyebrow: 'YGrow One',
    title: 'Prepare with context. Show up as yourself.',
    description:
      'Your context-aware career companion connects your real experience to the opportunity, helping you prepare, interview, and reflect.',
    benefits: ['Grounded in your experience', 'Role-specific preparation', 'Continuous interview learning'],
    icon: Sparkles,
  },
]

const journey = [
  { number: '01', title: 'Build your profile', copy: 'Capture the work you have done, the systems you have built, and where you want to go.' },
  { number: '02', title: 'Connect the right signals', copy: 'Bring opportunities, people, companies, and career preferences into one network.' },
  { number: '03', title: 'Move with confidence', copy: 'Organize your search, prepare with YGrow One, and learn from every conversation.' },
  { number: '04', title: 'Grow-and help others grow', copy: 'Build lasting professional relationships through referrals, insight, and community.' },
]

const faqs = [
  {
    q: 'Is YGrow a job board?',
    a: 'Not exactly. Opportunities are one part of YGrow, but the platform connects your professional identity, network, career operations, interviews, and growth in one environment.',
  },
  {
    q: 'What is YGrow One?',
    a: 'YGrow One is a context-aware career and interview companion designed around your actual projects, experience, goals, and the specific opportunity in front of you.',
  },
  {
    q: 'Who is YGrow for?',
    a: 'YGrow is being designed for developers across their career-from first role to engineering leadership-and for the recruiters, companies, coaches, and communities that support them.',
  },
  {
    q: 'Does YGrow apply to jobs automatically?',
    a: 'YGrow is centered on relevance and thoughtful decisions, not blind application volume. It helps you discover, organize, connect, and prepare while you stay in control.',
  },
  {
    q: 'When can I join?',
    a: 'YGrow is currently opening early access. Join the waitlist and we will share product updates and invite details as access expands.',
  },
]

const contactTopics = ['Product question', 'Talent team', 'Community partnership', 'Press and media', 'Something else']

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="group flex items-center gap-0.5" aria-label="YGrow home">
      <img src={light ? logoLight : logoDark} alt="" aria-hidden="true" width="44" height="44" decoding="async" className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11" />
      <span className={`text-[1.35rem] font-extrabold tracking-[-0.05em] ${light ? 'text-white' : 'text-ink'}`}>
        Grow
      </span>
    </a>
  )
}

function DiscordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52c-.21.38-.46.9-.63 1.31a18.3 18.3 0 0 0-5.6 0 13.4 13.4 0 0 0-.64-1.31 19.7 19.7 0 0 0-4.89 1.52C.58 9.09-.26 13.69.17 18.23a19.9 19.9 0 0 0 6 3.03c.48-.66.91-1.37 1.27-2.12a13 13 0 0 1-2-.96l.49-.38c3.86 1.79 8.05 1.79 11.86 0l.49.38c-.64.38-1.31.7-2 .96.36.75.78 1.46 1.27 2.12a19.8 19.8 0 0 0 6-3.03c.5-5.27-.86-9.83-3.23-13.86ZM8.02 15.45c-1.17 0-2.13-1.08-2.13-2.4s.94-2.4 2.13-2.4c1.2 0 2.15 1.09 2.13 2.4 0 1.32-.94 2.4-2.13 2.4Zm7.96 0c-1.17 0-2.13-1.08-2.13-2.4s.94-2.4 2.13-2.4c1.2 0 2.15 1.09 2.13 2.4 0 1.32-.93 2.4-2.13 2.4Z" />
    </svg>
  )
}

function BackgroundFlow({ dark = false, variant = 'platform' }: { dark?: boolean; variant?: 'platform' | 'journey' | 'one' | 'teams' | 'faq' | 'contact' }) {
  return (
    <div className={`background-flow background-flow-${variant} ${dark ? 'background-flow-dark' : ''}`} aria-hidden="true">
      <span className="background-orb background-orb-coral" />
      <span className="background-orb background-orb-teal" />
      <span className="background-orb background-orb-blue" />
      <span className="background-line background-line-1"><i /></span>
      <span className="background-line background-line-2"><i /></span>
      <span className="background-line background-line-3"><i /></span>
    </div>
  )
}

function PageScrollbar() {
  const [metrics, setMetrics] = useState({ height: 48, top: 0, visible: false })
  const dragCleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    let animationFrame = 0
    const update = () => {
      animationFrame = 0
      const root = document.documentElement
      const viewportHeight = window.innerHeight
      const scrollHeight = root.scrollHeight
      const scrollRange = Math.max(scrollHeight - viewportHeight, 0)
      const height = Math.max(48, Math.min(viewportHeight * .35, (viewportHeight / scrollHeight) * viewportHeight))
      const travel = Math.max(viewportHeight - height, 0)
      const top = scrollRange ? (window.scrollY / scrollRange) * travel : 0
      setMetrics({ height, top, visible: scrollRange > 1 })
    }
    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update)
    }
    const resizeObserver = new ResizeObserver(requestUpdate)
    resizeObserver.observe(document.body)
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      dragCleanupRef.current?.()
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  const beginDrag = (event: ReactPointerEvent<HTMLSpanElement>) => {
    event.preventDefault()
    dragCleanupRef.current?.()
    const thumb = event.currentTarget
    const pointerId = event.pointerId
    const startPointerY = event.clientY
    const startScrollY = window.scrollY
    thumb.setPointerCapture(pointerId)
    document.documentElement.classList.add('scrollbar-dragging')

    const move = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return
      moveEvent.preventDefault()
      const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
      const thumbTravel = Math.max(window.innerHeight - metrics.height, 1)
      const nextScrollY = startScrollY + ((moveEvent.clientY - startPointerY) / thumbTravel) * scrollRange
      window.scrollTo(0, nextScrollY)
    }
    const end = (endEvent?: PointerEvent) => {
      if (endEvent && endEvent.pointerId !== pointerId) return
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
      document.documentElement.classList.remove('scrollbar-dragging')
      if (thumb.hasPointerCapture(pointerId)) thumb.releasePointerCapture(pointerId)
      dragCleanupRef.current = null
    }

    dragCleanupRef.current = () => end()
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
  }

  if (!metrics.visible) return null
  return <div className="page-scrollbar" aria-hidden="true"><span className="page-scrollbar-thumb" style={{ height: metrics.height, transform: `translate3d(0, ${metrics.top}px, 0)` }} onPointerDown={beginDrag} /></div>
}

export function DashboardPreview() {
  const [active, setActive] = useState(0)
  const roles = [
    { company: 'Northstar', role: 'Senior Frontend Engineer', fit: 94, color: 'bg-brand-blue' },
    { company: 'Form Labs', role: 'Product Engineer', fit: 88, color: 'bg-brand-teal' },
    { company: 'Lumon', role: 'Full-stack Developer', fit: 82, color: 'bg-brand-coral' },
  ]

  return (
    <div className="dashboard-shell relative mx-auto w-full max-w-[660px]">
      <div className="absolute -left-10 top-20 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-card backdrop-blur md:block float-slow">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-teal/10 text-brand-teal"><Target size={17} /></span>
          <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">Profile strength</p><p className="text-sm font-bold text-ink">92% complete</p></div>
        </div>
      </div>
      <div className="absolute -right-7 bottom-24 z-20 hidden rounded-2xl bg-ink px-4 py-3 text-white shadow-glow md:block float-delay">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-teal opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-teal" /></span>
          <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">YGrow One</p><p className="text-sm font-semibold">Interview ready</p></div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-black/[.07] bg-white shadow-soft">
        <div className="flex h-12 items-center border-b border-slate-100 px-4">
          <div className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-brand-coral" /><i className="h-2.5 w-2.5 rounded-full bg-brand-teal" /><i className="h-2.5 w-2.5 rounded-full bg-brand-blue" /></div>
          <div className="mx-auto rounded-full bg-slate-50 px-16 py-1.5 text-[9px] font-semibold text-slate-400">app.ygrow.com</div>
        </div>
        <div className="surface-panel grid min-h-[430px] grid-cols-[62px_1fr] sm:grid-cols-[145px_1fr]">
          <aside className="border-r border-slate-100 bg-white p-3">
            <div className="mb-7 flex items-center gap-2 px-1">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-[10px] font-black text-white">Y</span>
              <span className="hidden text-xs font-extrabold text-ink sm:inline">YGrow</span>
            </div>
            {[
              [Command, 'Overview'], [Compass, 'Discover'], [BriefcaseBusiness, 'Pipeline'],
              [Users, 'Network'], [Sparkles, 'YGrow One'], [BarChart3, 'Insights'],
            ].map(([Icon, label], index) => (
              <div key={label as string} className={`mb-1 flex w-full items-center gap-2 rounded-lg p-2 text-left text-[10px] font-semibold ${index === 0 ? 'bg-ink text-white' : 'text-slate-500'}`}>
                <Icon size={13} /><span className="hidden sm:inline">{label as string}</span>
              </div>
            ))}
          </aside>
          <div className="min-w-0 p-4 sm:p-5">
            <div className="mb-5 flex items-center justify-between">
              <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-slate-400">Career command center</p><h3 className="mt-1  text-base font-bold text-ink sm:text-lg">Good morning, Maya</h3></div>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-blue text-[10px] font-bold text-white shadow-glow">MK</div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {[['12', 'Opportunities'], ['04', 'Interviews'], ['08', 'Connections']].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className=" text-lg font-bold text-ink sm:text-xl">{value}</p><p className="truncate text-[8px] font-medium text-slate-400 sm:text-[9px]">{label}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 lg:grid-cols-[1.35fr_.9fr]">
              <div className="rounded-2xl border border-slate-100 bg-white p-3.5">
                <div className="mb-3 flex items-center justify-between"><p className="text-[10px] font-bold text-ink">Best-fit opportunities</p><span className="text-[8px] font-bold text-brand-blue">View all</span></div>
                <div className="space-y-2">
                  {roles.map((item, index) => (
                    <button type="button" onClick={() => setActive(index)} key={item.company} className={`flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${active === index ? 'border-brand-blue/35 bg-brand-blue/5' : 'border-transparent bg-slate-50/70 hover:bg-slate-50'}`} aria-pressed={active === index}>
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${item.color} text-[10px] font-bold text-white`}>{item.company[0]}</span>
                      <span className="min-w-0 flex-1"><b className="block truncate text-[9px] text-ink">{item.role}</b><small className="text-[8px] text-slate-400">{item.company} · Remote</small></span>
                      <span className="text-[9px] font-bold text-brand-blue">{item.fit}%</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-ink p-4 text-white">
                  <div className="mb-4 flex items-start justify-between"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white"><Sparkles size={15} /></span><span className="rounded-full bg-white/10 px-2 py-1 text-[7px] font-bold text-white/75">READY</span></div>
                  <p className="text-[9px] font-bold">Technical interview</p><p className="mt-1 text-[8px] text-slate-400">Today · 2:30 PM</p>
                  <div className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg bg-white py-2 text-[8px] font-bold text-ink">Preparation ready <ArrowRight size={10} /></div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-3.5">
                  <div className="flex items-end justify-between"><div><p className="text-[8px] text-slate-400">Career momentum</p><p className="mt-1 text-sm font-bold text-ink">+24%</p></div><BarChart3 size={18} className="text-brand-teal" /></div>
                  <div className="mt-3 flex h-10 items-end gap-1">{[35, 48, 42, 70, 59, 78, 92].map((h, i) => <i key={i} className={`flex-1 rounded-t ${i === 6 ? 'bg-brand-blue' : 'bg-brand-blue/10'}`} style={{ height: `${h}%` }} />)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductVisual({ active }: { active: number }) {
  const feature = features[active]
  const Icon = feature.icon
  return (
    <div className={`feature-theme feature-theme-${feature.tone} product-visual-shell relative min-h-[420px] overflow-hidden rounded-[22px] p-6 text-white sm:p-9 lg:min-h-[560px]`}>
      <div className="visual-enter relative flex h-full min-h-[350px] flex-col lg:min-h-[488px]">
        <div className="flex items-center justify-between">
          <span className="product-visual-icon grid h-12 w-12 place-items-center rounded-2xl"><Icon size={22} /></span>
          <span className="product-visual-badge rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em]">Live workspace</span>
        </div>
        {active === 0 && <ProfileCard />}
        {active === 1 && <MatchCard />}
        {active === 2 && <PipelineCard />}
        {active === 3 && <OneCard />}
      </div>
    </div>
  )
}

function ProfileCard() {
  return <div className="mt-10 rounded-3xl border border-white/10 bg-white/[.07] p-5 backdrop-blur">
    <div className="flex items-center gap-4"><span className="product-accent-solid grid h-12 w-12 place-items-center rounded-full font-bold">AM</span><div><p className="font-bold">Alex Morgan</p><p className="text-xs text-slate-400">Platform engineer · Austin, TX</p></div><span className="product-accent-pill ml-auto rounded-full px-2.5 py-1 text-[9px] font-bold">OPEN TO WORK</span></div>
    <div className="my-5 h-px bg-white/10" />
    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Career context</p><p className="mt-2 text-sm leading-6 text-slate-200">Built reliable cloud platforms for developer teams, with deep ownership across Kubernetes, Go, and distributed systems.</p>
    <div className="mt-5 flex flex-wrap gap-2">{['Go', 'Kubernetes', 'AWS', 'Platform', 'Mentorship'].map(x => <span key={x} className="rounded-lg bg-white/10 px-2.5 py-1.5 text-[10px] text-slate-200">{x}</span>)}</div>
  </div>
}

function MatchCard() {
  return <div className="mt-10 grid gap-3">
    {[['94%', 'Senior Platform Engineer', 'Your systems experience is a strong match'], ['89%', 'Developer Experience Lead', 'Leadership + platform context aligned'], ['84%', 'Staff Backend Engineer', 'Distributed systems overlap']].map(([score, role, desc], i) => <div key={role} className={`rounded-2xl border p-4 ${i === 0 ? 'product-accent-card' : 'border-white/10 bg-white/[.05]'}`}><div className="flex items-center gap-4"><span className={`grid h-11 w-11 place-items-center rounded-full text-xs font-bold ${i === 0 ? 'product-accent-solid' : 'bg-white/10'}`}>{score}</span><div><p className="text-sm font-bold">{role}</p><p className="mt-1 text-[10px] text-slate-400">{desc}</p></div><ArrowRight size={16} className={i === 0 ? 'product-accent-text ml-auto' : 'ml-auto text-slate-500'} /></div></div>)}
  </div>
}

function PipelineCard() {
  const stages = [['Saved', '08', 'w-[38%]'], ['Connected', '05', 'w-[52%]'], ['Interview', '03', 'w-[72%]'], ['Final stage', '01', 'w-[92%]']]
  return <div className="mt-10 rounded-3xl border border-white/10 bg-white/[.06] p-5"><div className="mb-6 flex items-center justify-between"><div><p className="font-bold">Your career pipeline</p><p className="mt-1 text-[10px] text-slate-400">Everything moving, nothing lost.</p></div><span className="product-accent-text text-xs font-bold">17 active</span></div><div className="space-y-4">{stages.map(([stage, count, width]) => <div key={stage}><div className="mb-1.5 flex justify-between text-[10px]"><span className="text-slate-300">{stage}</span><b>{count}</b></div><div className="h-1.5 rounded-full bg-white/10"><div className={`product-accent-fill h-full ${width} rounded-full`} /></div></div>)}</div></div>
}

function OneCard() {
  return <div className="mt-10 rounded-3xl border border-white/10 bg-white/[.06] p-5"><div className="flex items-center gap-3"><span className="product-accent-solid relative grid h-10 w-10 place-items-center rounded-xl"><Sparkles size={18} /><i className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-ink bg-white" /></span><div><p className="font-bold">YGrow One</p><p className="text-[10px] text-slate-400">Context ready · Northstar interview</p></div></div><div className="my-5 rounded-2xl bg-brand-navy/50 p-4"><p className="text-xs leading-5 text-slate-300">“Walk me through a time you improved system reliability.”</p></div><div className="product-accent-card rounded-2xl border p-4"><p className="product-accent-text mb-2 text-[9px] font-bold uppercase tracking-[.16em]">From your experience</p><p className="text-xs leading-5 text-slate-200">Use the Atlas migration: you led the rollout across 14 services and reduced deploy failures by 38%.</p><div className="mt-3 flex items-center gap-2 text-[9px] text-slate-400"><CircleCheck size={12} className="product-accent-text" /> Grounded in your profile</div></div></div>
}

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function subscribe(event: FormEvent) {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setStatus('error'); setMessage('Please enter a valid email address.'); return
    }
    setStatus('loading')
    setMessage('')
    try {
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY
      if (!url || !key) throw new Error('Waitlist service is not configured')

      const supabase = createClient(url, key)
      const { error } = await supabase.from('waitlist').insert({ email: normalizedEmail, source: 'website' })
      if (error && error.code !== '23505') throw error

      const result = error?.code === '23505' ? 'existing' : 'created'
      trackEvent('waitlist_submit', { form_name: 'early_access', form_location: 'footer', result })
      if (result === 'created') trackEvent('generate_lead', { lead_source: 'waitlist', form_location: 'footer' })
      setStatus('success')
      setMessage(error?.code === '23505' ? "You're already on the list." : "You're on the list. We'll be in touch.")
      setEmail('')
    } catch {
      trackEvent('waitlist_submit', { form_name: 'early_access', form_location: 'footer', result: 'error' })
      setStatus('error'); setMessage('Signup is temporarily unavailable. Please email hello@ygrow.org')
    }
  }

  return <div className="footer-waitlist">
    <form onSubmit={subscribe} className="flex max-w-xl flex-col gap-2 sm:flex-row" aria-busy={status === 'loading'}>
      <label className="sr-only" htmlFor="waitlist-email">Work email</label>
      <input id="waitlist-email" name="email" type="email" inputMode="email" autoComplete="email" required disabled={status === 'loading'} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" aria-describedby="waitlist-status" className="min-h-12 min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/15 disabled:cursor-wait disabled:opacity-70" />
      <button type="submit" disabled={status === 'loading'} className="button-primary min-h-12 justify-center disabled:cursor-wait disabled:opacity-60">{status === 'loading' ? 'Joining…' : 'Join early access'} <ArrowRight size={16} /></button>
    </form>
    {message && <p id="waitlist-status" className={`mt-2 pl-3 text-xs ${status === 'success' ? 'text-brand-teal' : 'text-brand-coral'}`} role="status" aria-live="polite">{message}</p>}
  </div>
}

function ContactForm() {
  const [topic, setTopic] = useState(contactTopics[0])
  const [topicOpen, setTopicOpen] = useState(false)
  const [activeTopic, setActiveTopic] = useState(0)
  const topicRootRef = useRef<HTMLDivElement>(null)
  const topicTriggerRef = useRef<HTMLButtonElement>(null)
  const topicOptionRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!topicRootRef.current?.contains(event.target as Node)) setTopicOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress)
  }, [])

  useEffect(() => {
    if (!topicOpen) return
    const frame = window.requestAnimationFrame(() => topicOptionRefs.current[activeTopic]?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [activeTopic, topicOpen])

  function openTopicMenu(index = contactTopics.indexOf(topic)) {
    setActiveTopic(Math.max(index, 0))
    setTopicOpen(true)
  }

  function closeTopicMenu(returnFocus = false) {
    setTopicOpen(false)
    if (returnFocus) window.requestAnimationFrame(() => topicTriggerRef.current?.focus())
  }

  function selectTopic(option: string) {
    setTopic(option)
    closeTopicMenu(true)
  }

  function handleTopicTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const selectedIndex = contactTopics.indexOf(topic)
      openTopicMenu(event.key === 'ArrowDown' ? selectedIndex : Math.max(selectedIndex - 1, 0))
    }
  }

  function handleTopicOptionKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeTopicMenu(true)
      return
    }
    if (event.key === 'Tab') {
      setTopicOpen(false)
      return
    }
    const keyTargets: Record<string, number> = {
      ArrowDown: Math.min(index + 1, contactTopics.length - 1),
      ArrowUp: Math.max(index - 1, 0),
      Home: 0,
      End: contactTopics.length - 1,
    }
    const nextIndex = keyTargets[event.key]
    if (nextIndex === undefined) return
    event.preventDefault()
    setActiveTopic(nextIndex)
  }

  function prepareMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const selectedTopic = String(data.get('topic') ?? '').trim()
    const note = String(data.get('message') ?? '').trim()
    const subject = encodeURIComponent(`YGrow ${selectedTopic} enquiry from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${selectedTopic}\n\n${note}`)

    trackEvent('contact_submit', { form_name: 'contact', contact_topic: selectedTopic })
    trackEvent('generate_lead', { lead_source: 'contact_form', contact_topic: selectedTopic })
    window.location.href = `mailto:hello@ygrow.org?subject=${subject}&body=${body}`
    form.reset()
    setTopic(contactTopics[0])
  }

  return (
    <form className="contact-form" onSubmit={prepareMessage}>
      <div className="contact-form-heading">
        <div>
          <p>Start a conversation</p>
          <h3>Tell us what you’re building.</h3>
        </div>
        <span aria-hidden="true"><Send size={20} /></span>
      </div>
      <div className="contact-form-grid">
        <label className="contact-field">
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" placeholder="Alex Morgan" required />
        </label>
        <label className="contact-field">
          <span>Email</span>
          <input name="email" type="email" inputMode="email" autoComplete="email" placeholder="alex@gmail.com" required />
        </label>
      </div>
      <div className="contact-field">
        <span id="contact-topic-label">What can we help with?</span>
        <div ref={topicRootRef} className="contact-combobox">
          <input type="hidden" name="topic" value={topic} />
          <button
            ref={topicTriggerRef}
            type="button"
            className={`contact-select-trigger ${topicOpen ? 'is-open' : ''}`}
            aria-haspopup="listbox"
            aria-expanded={topicOpen}
            aria-controls="contact-topic-options"
            aria-labelledby="contact-topic-label contact-topic-value"
            onClick={() => topicOpen ? closeTopicMenu() : openTopicMenu()}
            onKeyDown={handleTopicTriggerKeyDown}
          >
            <span id="contact-topic-value">{topic}</span>
            <ChevronDown size={17} aria-hidden="true" />
          </button>
          {topicOpen && <div id="contact-topic-options" className="contact-select-menu" role="listbox" aria-labelledby="contact-topic-label">
            {contactTopics.map((option, index) => <button
              key={option}
              ref={(element) => { topicOptionRefs.current[index] = element }}
              type="button"
              role="option"
              aria-selected={topic === option}
              className={`contact-select-option ${topic === option ? 'is-selected' : ''}`}
              onClick={() => selectTopic(option)}
              onMouseEnter={() => setActiveTopic(index)}
              onKeyDown={(event) => handleTopicOptionKeyDown(event, index)}
            >
              <span>{option}</span>
              {topic === option && <Check size={15} aria-hidden="true" />}
            </button>)}
          </div>}
        </div>
      </div>
      <label className="contact-field">
        <span>Your message</span>
        <textarea name="message" rows={5} placeholder="Share a little context so we can connect you with the right person." required />
      </label>
      <div className="contact-form-actions">
        <button type="submit" className="button-primary">Send message <ArrowRight size={16} /></button>
      </div>
    </form>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [platformProgress, setPlatformProgress] = useState(0)
  const platformStageRef = useRef<HTMLDivElement>(null)
  const trackCta = (ctaName: string, location: string) => trackEvent('cta_click', { cta_name: ctaName, cta_location: location })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('motion-ready')
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
    )
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element))

    return () => {
      revealObserver.disconnect()
      document.documentElement.classList.remove('motion-ready')
    }
  }, [])

  useEffect(() => {
    let animationFrame = 0

    const updatePinnedFeature = () => {
      animationFrame = 0
      const stage = platformStageRef.current
      if (!stage || window.innerWidth < 1024) return

      const bounds = stage.getBoundingClientRect()
      const scrollDistance = Math.max(stage.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(0.9999, Math.max(0, -bounds.top / scrollDistance))
      const nextFeature = Math.min(features.length - 1, Math.round(progress * (features.length - 1)))
      setActiveFeature((current) => current === nextFeature ? current : nextFeature)
      setPlatformProgress((current) => Math.abs(current - progress) < .001 ? current : progress)
    }

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updatePinnedFeature)
    }

    updatePinnedFeature()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div id="top" className="surface-page overflow-x-clip text-ink">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <PageScrollbar />
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'site-header-scrolled py-3 shadow-sm backdrop-blur-xl' : 'bg-transparent py-5'}`}>
        <div className="page-wrap flex items-center justify-between">
          <BrandMark light={!scrolled} />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
            {[['Platform', '#platform'], ['How it works', '#journey'], ['YGrow One', '#one'], ['For teams', '#teams'], ['FAQ', '#faq'], ['Contact', '#contact']].map(([label, href]) => <a key={label} href={href} className={`text-sm font-semibold transition ${scrolled ? 'text-slate-600 hover:text-ink' : 'text-white/75 hover:text-white'}`}>{label}</a>)}
          </nav>
          <div className="hidden items-center lg:flex"><a href="#join" onClick={() => trackCta('join_ygrow', 'header')} className={`button-primary ${scrolled ? '' : 'button-primary-on-dark'}`}>Join YGrow <ArrowRight size={15} /></a></div>
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className={`grid h-10 w-10 place-items-center rounded-full border transition lg:hidden ${scrolled ? 'border-slate-200 text-ink' : 'border-white/25 text-white'}`} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation">{menuOpen ? <X size={18} /> : <Menu size={19} />}</button>
        </div>
        {menuOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="mx-4 mt-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card lg:hidden">{[['Platform', '#platform'], ['How it works', '#journey'], ['YGrow One', '#one'], ['For teams', '#teams'], ['FAQ', '#faq'], ['Contact', '#contact']].map(([label, href]) => <a onClick={() => setMenuOpen(false)} key={label} href={href} className="block rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50">{label}</a>)}<a href="#join" onClick={() => { setMenuOpen(false); trackCta('join_early_access', 'mobile_navigation') }} className="button-primary mt-3 justify-center">Join early access <ArrowRight size={15} /></a></nav>}
      </header>

      <main id="main-content">
        <section className="hero-stage relative flex min-h-[100svh] items-center px-4 pb-20 pt-28 sm:pb-24 sm:pt-32">
          <div className="page-wrap relative z-10">
            <div className="reveal text-left">
              <HeroMessage />
            </div>
          </div>
        </section>

        <section className="network-strip reveal border-y py-11">
          <div className="network-stripes" aria-hidden="true">
            {['navy', 'coral', 'teal', 'blue', 'coral', 'navy', 'blue', 'teal', 'navy', 'coral', 'teal', 'blue'].map((tone, index) => <i key={`${tone}-${index}`} className={`network-stripe network-stripe-${tone} network-stripe-${index + 1}`} />)}
          </div>
          <div className="page-wrap relative z-10"><p className="network-flow-title mb-6 text-center text-[10px] font-bold uppercase tracking-[.22em] text-slate-400">One network for every stage of developer growth</p><div className="grid grid-cols-2 gap-5 text-slate-400 sm:grid-cols-3 lg:grid-cols-6">{[[Code2, 'Developers'], [BriefcaseBusiness, 'Companies'], [Search, 'Recruiters'], [Users, 'Communities'], [Target, 'Coaches'], [Network, 'Universities']].map(([Icon, label], index) => <div key={label as string} className="network-flow-item flex items-center justify-center gap-2 text-sm font-bold" style={{ animationDelay: `${index * 140}ms` }}><Icon size={17} />{label as string}</div>)}</div></div>
        </section>

        <section className="platform-section pt-24 sm:pt-28 lg:pt-36" id="platform">
          <div className="page-wrap px-4 sm:px-6">
            <div className="reveal section-heading"><h2>Your career deserves<br />more than <span className="platform-title-accent">disconnected tools.</span></h2><p>Scroll through one connected journey — from the story you have built to the opportunity ahead.</p></div>
          </div>

          <div ref={platformStageRef} className="platform-pin-stage mt-8 hidden lg:block" style={{ height: `${features.length * 100}vh` }}>
            <div className="platform-pin-frame">
              <BackgroundFlow />
              <div className="page-wrap relative z-10 grid w-full grid-cols-[.95fr_1.05fr] items-center gap-10 px-6">
                <div className="platform-copy-shell">
                  <div className="platform-progress-rail" aria-hidden="true">
                    {features.slice(0, -1).map((feature, index) => <span key={`${feature.id}-segment`} className={`platform-progress-segment feature-theme-${feature.tone} ${activeFeature > index ? 'is-complete' : ''}`} style={{ top: `${(index / (features.length - 1)) * 100}%`, height: `${100 / (features.length - 1)}%` }} />)}
                    {features.map((feature, index) => <span key={feature.id} className={`platform-progress-point feature-theme-${feature.tone} ${activeFeature === index ? 'is-active' : activeFeature > index ? 'is-complete' : ''}`} style={{ top: `${(index / (features.length - 1)) * 100}%` }}><i>0{index + 1}</i><b>{feature.eyebrow}</b></span>)}
                  </div>
                  <div key={features[activeFeature].id} className={`feature-theme feature-theme-${features[activeFeature].tone} platform-copy-enter platform-copy-content`}>
                    <span className="feature-number platform-feature-number text-xs font-semibold tracking-[.14em]">0{activeFeature + 1}</span>
                    <h3 className="feature-title text-[2rem] font-bold leading-[1.15] tracking-[-.04em]">{features[activeFeature].title}</h3>
                    <p className="feature-description mt-5 max-w-md text-base leading-8">{features[activeFeature].description}</p>
                    <div className="mt-7 space-y-3">{features[activeFeature].benefits.map((benefit) => <p key={benefit} className="flex items-center gap-2.5 text-sm font-semibold text-slate-600"><Check size={15} className="feature-check" />{benefit}</p>)}</div>
                  </div>
                </div>
                <div>
                  <CareerOrbit active={activeFeature} progress={platformProgress} />
                  <div className="mt-5 flex items-center justify-between px-2"><p className="text-xs font-semibold text-slate-400">Scroll to move through the platform</p><div className="flex gap-1.5">{features.map((feature, index) => <span key={feature.id} className={`platform-pagination-dot feature-theme-${feature.tone} h-1.5 rounded-full transition-all duration-500 ${activeFeature === index ? 'is-active w-8' : 'w-1.5'}`} />)}</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-wrap mt-16 space-y-10 px-4 pb-24 sm:px-6 sm:pb-28 lg:hidden">
            {features.map((feature, index) => { const Icon = feature.icon; return <article key={feature.id} className={`feature-theme feature-theme-${feature.tone} reveal platform-step`}>
              <div className="platform-step-index">0{index + 1}</div>
              <div className="flex gap-4 sm:gap-5"><span className="feature-icon grid h-12 w-12 shrink-0 place-items-center rounded-xl"><Icon size={20} /></span><div><p className="feature-kicker text-[10px] font-semibold uppercase tracking-[.16em]">{feature.eyebrow}</p><h3 className="feature-title mt-2 text-2xl font-bold leading-tight tracking-tight">{feature.title}</h3><p className="feature-description mt-4 max-w-lg text-sm leading-7 sm:text-base">{feature.description}</p><div className="mt-5 space-y-2">{feature.benefits.map((benefit) => <p key={benefit} className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Check size={14} className="feature-check" />{benefit}</p>)}</div></div></div>
              <div className="mt-7"><ProductVisual active={index} /></div>
            </article> })}
          </div>
        </section>

        <section className="journey-section section-space" id="journey">
          <BackgroundFlow variant="journey" />
          <div className="page-wrap relative z-10">
            <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
              <div className="reveal lg:sticky lg:top-32 lg:self-start">
                <h2 className="section-title mt-6">From ambition<br />to <span className="journey-heading-accent">momentum.</span></h2>
                <p className="section-copy mt-5">Career growth is not a transaction. It is a connected loop that gets stronger with better context, clearer signals, and the right relationships.</p>
                <a href="#join" onClick={() => trackCta('start_your_journey', 'how_it_works')} className="journey-cta mt-8"><span>Start your journey</span><span className="journey-cta-arrow" aria-hidden="true"><ArrowRight size={16} /></span></a>
              </div>
              <div className="journey-stack relative">
                <div className="journey-rail" aria-hidden="true" />
                {journey.map((item, index) => <div key={item.number} style={{ transitionDelay: `${index * 80}ms` }} className="reveal journey-card-wrap">
                  <article className={`journey-card journey-card-${index + 1}`}>
                    <span className="journey-number"><span>{item.number}</span></span>
                    <div className="relative z-10"><div className="mb-3 flex items-center gap-3"><h3 className="text-xl font-semibold text-ink">{item.title}</h3></div><p className="max-w-xl text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">{item.copy}</p></div>
                  </article>
                </div>)}
              </div>
            </div>
          </div>
        </section>

        <section id="one" className="section-space relative bg-ink text-white">
          <BackgroundFlow dark variant="one" />
          <div className="page-wrap relative z-10 grid items-center gap-16 lg:grid-cols-2 lg:gap-24 xl:gap-32">
            <div className="reveal"><h2 className="mt-7 text-4xl font-medium leading-[1.03] tracking-[-.045em] sm:text-6xl">The context you need,<br /><span className="text-brand-teal">right when it matters.</span></h2><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">YGrow One connects the opportunity in front of you with the experience behind you-so preparation feels relevant, interviews feel calmer, and each result sharpens the next move.</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{[['Grounded, not generic', 'Uses your real projects, skills, and responsibilities.'], ['Always connected', 'Works alongside your profile, pipeline, and interview history.'], ['Built to assist', 'Surfaces useful context while your judgment stays in control.'], ['Learns with you', 'Turns interview notes and outcomes into future insight.']].map(([title, copy]) => <div key={title} className="flex gap-3"><CircleCheck size={18} className="mt-0.5 shrink-0 text-brand-teal" /><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{copy}</p></div></div>)}</div></div>
            <div className="reveal reveal-right reveal-delay-1 relative"><ContextDiagram /></div>
          </div>
        </section>

        <section id="teams" className="flow-section flow-section-teams section-space">
          <BackgroundFlow variant="teams" />
          <div className="page-wrap relative z-10"><div className="reveal section-heading"><h2>A stronger network creates<br /><span className="text-brand-coral">better opportunities.</span></h2><p>YGrow is designed to make every side of the developer career ecosystem more human, relevant, and connected.</p></div><div className="mt-14 grid gap-5 md:grid-cols-3">{[
            { icon: Code2, tag: 'For developers', title: 'Build a career, not just a job search.', copy: 'Create a richer professional identity, connect with people who matter, and navigate each opportunity with clarity.', points: ['Career profile', 'Network & referrals', 'Opportunity workspace'] },
            { icon: Search, tag: 'For talent teams', title: 'Discover context beyond keywords.', copy: 'Understand the developer behind the résumé and build stronger candidate relationships from the first conversation.', points: ['Developer discovery', 'Context-rich matching', 'Connected outreach'] },
            { icon: Network, tag: 'For communities', title: 'Turn support into shared momentum.', copy: 'Help members move from learning to opportunity with better profiles, mentorship, and professional connections.', points: ['Member growth', 'Mentorship pathways', 'Career intelligence'] },
          ].map((card, i) => { const Icon = card.icon; return <div key={card.tag} style={{ transitionDelay: `${i * 100}ms` }} className="reveal"><article className={`group h-full rounded-[18px] border p-8 transition duration-300 ease-out hover:-translate-y-2 hover:shadow-xl motion-reduce:hover:transform-none ${i === 1 ? 'border-brand-navy bg-ink text-white hover:rotate-[.65deg]' : 'border-brand-blue/10 bg-white hover:-rotate-[.65deg]'}`}><span className={`grid h-12 w-12 place-items-center rounded-lg ${i === 1 ? 'bg-brand-teal/15 text-brand-teal' : i === 0 ? 'bg-brand-blue/10 text-brand-blue' : 'bg-brand-coral/10 text-brand-coral'}`}><Icon size={21} /></span><p className={`mt-8 text-[10px] font-semibold uppercase tracking-[.17em] ${i === 1 ? 'text-brand-teal' : i === 0 ? 'text-brand-blue' : 'text-brand-coral'}`}>{card.tag}</p><h3 className="mt-3 text-2xl font-medium leading-tight">{card.title}</h3><p className={`mt-4 text-sm leading-6 ${i === 1 ? 'text-slate-300' : 'text-slate-500'}`}>{card.copy}</p><div className={`my-7 h-px ${i === 1 ? 'bg-white/10' : 'bg-brand-blue/10'}`} />{card.points.map(point => <p key={point} className="mb-3 flex items-center gap-2 text-sm font-medium"><Check size={14} className={i === 1 ? 'text-brand-teal' : i === 0 ? 'text-brand-blue' : 'text-brand-coral'} />{point}</p>)}</article></div> })}</div></div>
        </section>

        <section id="faq" className="flow-section flow-section-faq section-space">
          <div className="page-wrap relative z-10 grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
            <div className="reveal">
              <h2 className="section-title mt-6">Good to <span className="text-brand-teal">know.</span></h2>
              <p className="section-copy mt-5">Quick context for the most common questions. Have something else in mind? Reach us at <a className="font-semibold text-brand-teal underline decoration-brand-teal/35 underline-offset-4" href="mailto:hello@ygrow.org">hello@ygrow.org</a>.</p>
            </div>
            <div className="faq-list reveal reveal-right">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index
                return <article key={faq.q} className={`faq-item ${isOpen ? 'is-open' : ''}`} style={{ animationDelay: `${100 + index * 65}ms` }}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => {
                      setOpenFaq(isOpen ? -1 : index)
                      trackEvent('faq_toggle', { faq_index: index + 1, action: isOpen ? 'close' : 'open' })
                    }}
                    className="faq-trigger"
                  >
                    <span className="faq-index">0{index + 1}</span>
                    <span className="faq-question">{faq.q}</span>
                    <span className="faq-toggle" aria-hidden="true"><ChevronDown size={16} /></span>
                  </button>
                  <div id={`faq-answer-${index}`} aria-hidden={!isOpen} className={`faq-answer ${isOpen ? 'is-open' : ''}`}>
                    <div><p>{faq.a}</p></div>
                  </div>
                </article>
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section section-space">
          <BackgroundFlow variant="contact" />
          <div className="page-wrap relative z-10 grid items-center gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
            <div className="reveal">
              <h2 className="contact-title"><span>Contact</span> us</h2>
              <p className="contact-copy">Whether you’re growing your career, building a talent team, or supporting a developer community, we’d love to hear what’s on your mind.</p>
              <div className="contact-details">
                <a href="mailto:hello@ygrow.org" onClick={() => trackEvent('contact_link_click', { link_type: 'email', link_location: 'contact_section' })} className="contact-detail">
                  <span><Mail size={18} /></span>
                  <div><small>Email us</small><strong>hello@ygrow.org</strong></div>
                </a>
                <div className="contact-detail">
                  <span><Clock3 size={18} /></span>
                  <div><small>Response time</small><strong>Within 1–2 business days</strong></div>
                </div>
              </div>
            </div>
            <div className="reveal reveal-right reveal-delay-1"><ContactForm /></div>
          </div>
        </section>
      </main>

      <footer className="site-footer bg-ink px-4 pb-8 pt-16 text-white sm:px-6">
        <div className="page-wrap">
          <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.2fr_.7fr_.7fr_1.4fr]">
            <div><BrandMark light /><p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">A connected career network helping developers build their identity, network, opportunities, and momentum.</p><p className="mt-5 text-xs font-bold uppercase tracking-[.17em] text-brand-teal">Why grow alone?</p></div>
            {[
              { title: 'Explore', links: [['Platform', '#platform'], ['How it works', '#journey'], ['YGrow One', '#one']] },
              { title: 'Learn', links: [['For teams', '#teams'], ['Good to know', '#faq'], ['Contact us', '#contact']] },
            ].map((group) => <nav key={group.title} aria-label={`${group.title} links`}><p className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-slate-500">{group.title}</p>{group.links.map(([label, href]) => <a key={label} href={href} className="mb-3 block text-sm text-slate-300 transition hover:text-white">{label}</a>)}</nav>)}
            <section id="join" className="footer-early-access" aria-labelledby="footer-early-access-title">
              <p id="footer-early-access-title" className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-slate-500">Early access</p>
              <WaitlistForm />
            </section>
          </div>
          <div className="flex flex-col gap-4 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 YGrow. Built for developers who keep growing.</p><nav className="footer-socials" aria-label="YGrow social links">{[
            { label: 'Telegram', href: 'https://t.me/ygrow', icon: Send },
            { label: 'Discord', href: 'https://discord.gg/ygrow', icon: DiscordIcon },
            { label: 'GitHub', href: 'https://github.com/ygrow', icon: Github },
          ].map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('social_click', { social_platform: label.toLowerCase(), link_location: 'footer' })} className="footer-social-link" aria-label={`${label} (opens in a new tab)`} title={label}><Icon size={17} /></a>)}</nav></div>
        </div>
      </footer>
    </div>
  )
}

export default App
