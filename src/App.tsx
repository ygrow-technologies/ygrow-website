import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleCheck,
  Code2,
  Command,
  Compass,
  Menu,
  MessageSquareText,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

type Feature = {
  id: string
  eyebrow: string
  title: string
  description: string
  benefits: string[]
  icon: typeof Sparkles
}

const features: Feature[] = [
  {
    id: 'identity',
    eyebrow: 'Professional identity',
    title: 'Your whole career, not just a résumé.',
    description:
      'Turn your experience, projects, skills, and goals into a living profile that gets more useful at every stage of your career.',
    benefits: ['One career source of truth', 'Project-level context', 'Profiles that evolve with you'],
    icon: Code2,
  },
  {
    id: 'opportunities',
    eyebrow: 'Relevant opportunities',
    title: 'Find the roles that fit your next chapter.',
    description:
      'Bring jobs, referrals, recruiters, and direct company connections into a single opportunity stream built around relevance.',
    benefits: ['Context-rich matching', 'Connected referrals', 'Less noise, better fit'],
    icon: Compass,
  },
  {
    id: 'workspace',
    eyebrow: 'Career workspace',
    title: 'Keep every moving part in one place.',
    description:
      'Track applications, conversations, interviews, notes, and next steps without another sprawling spreadsheet.',
    benefits: ['Visual career pipeline', 'Follow-up reminders', 'Everything tied to the role'],
    icon: BriefcaseBusiness,
  },
  {
    id: 'one',
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
  { number: '04', title: 'Grow—and help others grow', copy: 'Build lasting professional relationships through referrals, insight, and community.' },
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
    a: 'YGrow is being designed for developers across their career—from first role to engineering leadership—and for the recruiters, companies, coaches, and communities that support them.',
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

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="group flex items-center gap-2.5" aria-label="YGrow home">
      <span className={`logo-crop ${light ? 'logo-crop-light' : ''}`}>
        <img src="/brand/logo.png" alt="" aria-hidden="true" />
      </span>
      <span className={`font-display text-[1.35rem] font-extrabold tracking-[-0.05em] ${light ? 'text-white' : 'text-ink'}`}>
        YGrow
      </span>
    </a>
  )
}

function AmbientGrid({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`ambient-grid ${dark ? 'ambient-grid-dark' : ''}`} aria-hidden="true">
      <span className="grid-line grid-line-v grid-line-1"><i /></span>
      <span className="grid-line grid-line-h grid-line-2"><i /></span>
      <span className="grid-line grid-line-v grid-line-3"><i /></span>
      <span className="grid-line grid-line-h grid-line-4"><i /></span>
      <span className="grid-line grid-line-v grid-line-5"><i /></span>
    </div>
  )
}

function DashboardPreview() {
  const [active, setActive] = useState(0)
  const roles = [
    { company: 'Northstar', role: 'Senior Frontend Engineer', fit: 94, color: 'bg-black' },
    { company: 'Form Labs', role: 'Product Engineer', fit: 88, color: 'bg-neutral-600' },
    { company: 'Lumon', role: 'Full-stack Developer', fit: 82, color: 'bg-neutral-400' },
  ]

  return (
    <div className="dashboard-shell relative mx-auto w-full max-w-[660px]">
      <div className="absolute -left-10 top-20 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-card backdrop-blur md:block float-slow">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-neutral-100 text-neutral-700"><Target size={17} /></span>
          <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">Profile strength</p><p className="text-sm font-bold text-ink">92% complete</p></div>
        </div>
      </div>
      <div className="absolute -right-7 bottom-24 z-20 hidden rounded-2xl bg-ink px-4 py-3 text-white shadow-glow md:block float-delay">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky" /></span>
          <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">YGrow One</p><p className="text-sm font-semibold">Interview ready</p></div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-black/[.07] bg-white shadow-soft">
        <div className="flex h-12 items-center border-b border-slate-100 px-4">
          <div className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-neutral-300" /><i className="h-2.5 w-2.5 rounded-full bg-neutral-500" /><i className="h-2.5 w-2.5 rounded-full bg-neutral-800" /></div>
          <div className="mx-auto rounded-full bg-slate-50 px-16 py-1.5 text-[9px] font-semibold text-slate-400">app.ygrow.com</div>
        </div>
        <div className="grid min-h-[430px] grid-cols-[62px_1fr] bg-[#f5f5f2] sm:grid-cols-[145px_1fr]">
          <aside className="border-r border-slate-100 bg-white p-3">
            <div className="mb-7 flex items-center gap-2 px-1">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-[10px] font-black text-white">Y</span>
              <span className="hidden text-xs font-extrabold text-ink sm:inline">YGrow</span>
            </div>
            {[
              [Command, 'Overview'], [Compass, 'Discover'], [BriefcaseBusiness, 'Pipeline'],
              [Users, 'Network'], [Sparkles, 'YGrow One'], [BarChart3, 'Insights'],
            ].map(([Icon, label], index) => (
              <button key={label as string} className={`mb-1 flex w-full items-center gap-2 rounded-lg p-2 text-left text-[10px] font-semibold transition ${index === 0 ? 'bg-ink text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                <Icon size={13} /><span className="hidden sm:inline">{label as string}</span>
              </button>
            ))}
          </aside>
          <main className="min-w-0 p-4 sm:p-5">
            <div className="mb-5 flex items-center justify-between">
              <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-slate-400">Career command center</p><h3 className="mt-1 font-display text-base font-bold text-ink sm:text-lg">Good morning, Maya</h3></div>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-neutral-500 to-black text-[10px] font-bold text-white">MK</div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {[['12', 'Opportunities'], ['04', 'Interviews'], ['08', 'Connections']].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="font-display text-lg font-bold text-ink sm:text-xl">{value}</p><p className="truncate text-[8px] font-medium text-slate-400 sm:text-[9px]">{label}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 lg:grid-cols-[1.35fr_.9fr]">
              <div className="rounded-2xl border border-slate-100 bg-white p-3.5">
                <div className="mb-3 flex items-center justify-between"><p className="text-[10px] font-bold text-ink">Best-fit opportunities</p><span className="text-[8px] font-bold text-black/60">View all</span></div>
                <div className="space-y-2">
                  {roles.map((item, index) => (
                    <button onClick={() => setActive(index)} key={item.company} className={`flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${active === index ? 'border-black/20 bg-black/[.035]' : 'border-transparent bg-slate-50/70 hover:bg-slate-50'}`}>
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${item.color} text-[10px] font-bold text-white`}>{item.company[0]}</span>
                      <span className="min-w-0 flex-1"><b className="block truncate text-[9px] text-ink">{item.role}</b><small className="text-[8px] text-slate-400">{item.company} · Remote</small></span>
                      <span className="text-[9px] font-bold text-black/65">{item.fit}%</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-ink p-4 text-white">
                  <div className="mb-4 flex items-start justify-between"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white"><Sparkles size={15} /></span><span className="rounded-full bg-white/10 px-2 py-1 text-[7px] font-bold text-white/75">READY</span></div>
                  <p className="text-[9px] font-bold">Technical interview</p><p className="mt-1 text-[8px] text-slate-400">Today · 2:30 PM</p>
                  <button className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg bg-white py-2 text-[8px] font-bold text-ink">Open preparation <ArrowRight size={10} /></button>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-3.5">
                  <div className="flex items-end justify-between"><div><p className="text-[8px] text-slate-400">Career momentum</p><p className="mt-1 text-sm font-bold text-ink">+24%</p></div><BarChart3 size={18} className="text-black/60" /></div>
                  <div className="mt-3 flex h-10 items-end gap-1">{[35, 48, 42, 70, 59, 78, 92].map((h, i) => <i key={i} className="flex-1 rounded-t bg-neutral-200" style={{ height: `${h}%`, backgroundColor: i === 6 ? '#181818' : undefined }} />)}</div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function ProductVisual({ active }: { active: number }) {
  const Icon = features[active].icon
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[22px] bg-ink p-6 text-white sm:p-9 lg:min-h-[560px]">
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="visual-enter relative flex h-full min-h-[350px] flex-col lg:min-h-[488px]">
        <div className="flex items-center justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-sky"><Icon size={22} /></span>
          <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-slate-300">Live workspace</span>
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
    <div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-neutral-400 to-neutral-700 font-bold">AM</span><div><p className="font-display font-bold">Alex Morgan</p><p className="text-xs text-slate-400">Platform engineer · Austin, TX</p></div><span className="ml-auto rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold text-white/75">OPEN TO WORK</span></div>
    <div className="my-5 h-px bg-white/10" />
    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Career context</p><p className="mt-2 text-sm leading-6 text-slate-200">Built reliable cloud platforms for developer teams, with deep ownership across Kubernetes, Go, and distributed systems.</p>
    <div className="mt-5 flex flex-wrap gap-2">{['Go', 'Kubernetes', 'AWS', 'Platform', 'Mentorship'].map(x => <span key={x} className="rounded-lg bg-white/10 px-2.5 py-1.5 text-[10px] text-slate-200">{x}</span>)}</div>
  </div>
}

function MatchCard() {
  return <div className="mt-10 grid gap-3">
    {[['94%', 'Senior Platform Engineer', 'Your systems experience is a strong match'], ['89%', 'Developer Experience Lead', 'Leadership + platform context aligned'], ['84%', 'Staff Backend Engineer', 'Distributed systems overlap']].map(([score, role, desc], i) => <div key={role} className={`rounded-2xl border p-4 ${i === 0 ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/[.05]'}`}><div className="flex items-center gap-4"><span className={`grid h-11 w-11 place-items-center rounded-full text-xs font-bold ${i === 0 ? 'bg-white text-ink' : 'bg-white/10'}`}>{score}</span><div><p className="text-sm font-bold">{role}</p><p className="mt-1 text-[10px] text-slate-400">{desc}</p></div><ArrowRight size={16} className="ml-auto text-slate-500" /></div></div>)}
  </div>
}

function PipelineCard() {
  const stages = [['Saved', '08', 'w-[38%]'], ['Connected', '05', 'w-[52%]'], ['Interview', '03', 'w-[72%]'], ['Final stage', '01', 'w-[92%]']]
  return <div className="mt-10 rounded-3xl border border-white/10 bg-white/[.06] p-5"><div className="mb-6 flex items-center justify-between"><div><p className="font-display font-bold">Your career pipeline</p><p className="mt-1 text-[10px] text-slate-400">Everything moving, nothing lost.</p></div><span className="text-xs font-bold text-white/70">17 active</span></div><div className="space-y-4">{stages.map(([stage, count, width]) => <div key={stage}><div className="mb-1.5 flex justify-between text-[10px]"><span className="text-slate-300">{stage}</span><b>{count}</b></div><div className="h-1.5 rounded-full bg-white/10"><div className={`h-full ${width} rounded-full bg-gradient-to-r from-neutral-600 to-white`} /></div></div>)}</div></div>
}

function OneCard() {
  return <div className="mt-10 rounded-3xl border border-white/10 bg-white/[.06] p-5"><div className="flex items-center gap-3"><span className="relative grid h-10 w-10 place-items-center rounded-xl bg-white text-ink"><Sparkles size={18} /><i className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-ink bg-white" /></span><div><p className="font-display font-bold">YGrow One</p><p className="text-[10px] text-slate-400">Context ready · Northstar interview</p></div></div><div className="my-5 rounded-2xl bg-black/35 p-4"><p className="text-xs leading-5 text-slate-300">“Walk me through a time you improved system reliability.”</p></div><div className="rounded-2xl border border-white/15 bg-white/[.06] p-4"><p className="mb-2 text-[9px] font-bold uppercase tracking-[.16em] text-white/70">From your experience</p><p className="text-xs leading-5 text-slate-200">Use the Atlas migration: you led the rollout across 14 services and reduced deploy failures by 38%.</p><div className="mt-3 flex items-center gap-2 text-[9px] text-slate-400"><CircleCheck size={12} className="text-white" /> Grounded in your profile</div></div></div>
}

function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function subscribe(event: FormEvent) {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error'); setMessage('Please enter a valid email address.'); return
    }
    setStatus('loading')
    try {
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY
      if (url && key) {
        const supabase = createClient(url, key)
        const { error } = await supabase.from('waitlist').insert({ email, source: 'website' })
        if (error && error.code !== '23505') throw error
      } else {
        const saved = JSON.parse(localStorage.getItem('ygrow_waitlist') || '[]') as string[]
        localStorage.setItem('ygrow_waitlist', JSON.stringify([...new Set([...saved, email])]))
      }
      setStatus('success'); setMessage("You're on the list. We'll be in touch."); setEmail('')
    } catch {
      setStatus('error'); setMessage('Something went wrong. Please try again.')
    }
  }

  return <div>
    <form onSubmit={subscribe} className={`flex ${compact ? 'max-w-lg' : 'max-w-xl'} flex-col gap-2 sm:flex-row`}>
      <label className="sr-only" htmlFor={`email-${compact ? 'footer' : 'hero'}`}>Work email</label>
      <input id={`email-${compact ? 'footer' : 'hero'}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="min-h-12 min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-sky focus:ring-4 focus:ring-sky/15" />
      <button disabled={status === 'loading'} className="button-primary min-h-12 justify-center disabled:opacity-60">{status === 'loading' ? 'Joining…' : 'Join early access'} <ArrowRight size={16} /></button>
    </form>
    {message && <p className={`mt-2 pl-3 text-xs ${status === 'success' ? 'text-black/65' : 'text-rose-600'}`} role="status">{message}</p>}
  </div>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const platformStageRef = useRef<HTMLDivElement>(null)

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
      const nextFeature = Math.min(features.length - 1, Math.floor(progress * features.length))
      setActiveFeature((current) => current === nextFeature ? current : nextFeature)
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
    <div id="top" className="overflow-x-clip bg-[#f7f7f5] text-ink">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-slate-100 bg-white/90 py-3 shadow-sm backdrop-blur-xl' : 'bg-transparent py-5'}`}>
        <div className="page-wrap flex items-center justify-between">
          <BrandMark />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
            {[['Platform', '#platform'], ['How it works', '#journey'], ['YGrow One', '#one'], ['For teams', '#teams'], ['FAQ', '#faq']].map(([label, href]) => <a key={label} href={href} className="text-sm font-semibold text-slate-600 transition hover:text-ink">{label}</a>)}
          </nav>
          <div className="hidden items-center gap-3 lg:flex"><a href="#faq" className="px-3 text-sm font-semibold text-slate-600 hover:text-ink">Sign in</a><a href="#join" className="button-primary">Join YGrow <ArrowRight size={15} /></a></div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 lg:hidden" aria-label="Toggle navigation">{menuOpen ? <X size={18} /> : <Menu size={19} />}</button>
        </div>
        {menuOpen && <div className="mx-4 mt-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card lg:hidden">{[['Platform', '#platform'], ['How it works', '#journey'], ['YGrow One', '#one'], ['For teams', '#teams'], ['FAQ', '#faq']].map(([label, href]) => <a onClick={() => setMenuOpen(false)} key={label} href={href} className="block rounded-xl px-3 py-3 text-sm font-semibold hover:bg-slate-50">{label}</a>)}<a href="#join" onClick={() => setMenuOpen(false)} className="button-primary mt-3 justify-center">Join early access <ArrowRight size={15} /></a></div>}
      </header>

      <main>
        <section className="hero-grid relative px-4 pb-28 pt-40 sm:pb-32 sm:pt-48 lg:min-h-[880px] lg:pb-40 lg:pt-52">
          <AmbientGrid />
          <div className="orb orb-one" /><div className="orb orb-two" />
          <div className="page-wrap relative z-10 grid items-center gap-20 lg:grid-cols-[.88fr_1.12fr] lg:gap-20">
            <div className="reveal max-w-2xl">
              <div className="eyebrow"><Sparkles size={13} /> The career network built for developers</div>
              <h1 className="mt-8 font-display text-[clamp(3.7rem,7.4vw,7rem)] font-medium leading-[.91] tracking-[-.07em] text-ink">Why grow<br /><span className="text-gradient">alone?</span></h1>
              <p className="mt-9 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">Build your professional identity, discover better opportunities, and move your career forward with the right people—and <strong className="font-semibold text-ink">YGrow One</strong>—beside you.</p>
              <div id="join" className="mt-11"><WaitlistForm /></div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500"><span className="flex items-center gap-1.5"><Check size={13} className="text-black/55" /> Free to join</span><span className="flex items-center gap-1.5"><Check size={13} className="text-black/55" /> Built developer-first</span><span className="flex items-center gap-1.5"><Check size={13} className="text-black/55" /> You stay in control</span></div>
            </div>
            <div className="reveal reveal-right reveal-delay-2"><DashboardPreview /></div>
          </div>
        </section>

        <section className="reveal border-y border-black/[.06] bg-white/70 py-11">
          <div className="page-wrap"><p className="mb-6 text-center text-[10px] font-bold uppercase tracking-[.22em] text-slate-400">One network for every stage of developer growth</p><div className="grid grid-cols-2 gap-5 text-slate-400 sm:grid-cols-3 lg:grid-cols-6">{[[Code2, 'Developers'], [BriefcaseBusiness, 'Companies'], [Search, 'Recruiters'], [Users, 'Communities'], [Target, 'Coaches'], [Network, 'Universities']].map(([Icon, label]) => <div key={label as string} className="flex items-center justify-center gap-2 text-sm font-bold"><Icon size={17} />{label as string}</div>)}</div></div>
        </section>

        <section className="bg-white pt-24 sm:pt-28 lg:pt-36" id="platform">
          <div className="page-wrap px-4 sm:px-6">
            <div className="reveal section-heading"><div className="eyebrow"><Command size={13} /> One connected platform</div><h2>Your career deserves<br />more than disconnected tools.</h2><p>Scroll through one connected journey—from the story you have built to the opportunity ahead.</p></div>
          </div>

          <div ref={platformStageRef} className="platform-pin-stage mt-8 hidden lg:block" style={{ height: `${features.length * 100}vh` }}>
            <div className="platform-pin-frame">
              <AmbientGrid />
              <div className="page-wrap relative z-10 grid w-full grid-cols-[.78fr_1.22fr] items-center gap-16 px-6">
                <div className="platform-copy-shell">
                  <div className="platform-progress-rail" aria-hidden="true">
                    <span className="platform-progress-fill" style={{ height: `${(activeFeature / (features.length - 1)) * 100}%` }} />
                    {features.map((feature, index) => <i key={feature.id} className={activeFeature === index ? 'is-active' : activeFeature > index ? 'is-complete' : ''} style={{ top: `${(index / (features.length - 1)) * 100}%` }} />)}
                  </div>
                  <div key={features[activeFeature].id} className="platform-copy-enter pl-14">
                    {(() => { const Icon = features[activeFeature].icon; return <>
                      <div className="mb-7 flex items-center justify-between"><span className="grid h-14 w-14 place-items-center rounded-xl bg-ink text-white"><Icon size={21} /></span><span className="font-display text-xs font-semibold tracking-[.14em] text-black/55">0{activeFeature + 1}</span></div>
                      <p className="text-[10px] font-semibold uppercase tracking-[.17em] text-black/55">{features[activeFeature].eyebrow}</p>
                      <h3 className="mt-3 font-display text-[2rem] font-bold leading-[1.15] tracking-[-.04em] text-ink">{features[activeFeature].title}</h3>
                      <p className="mt-5 max-w-md text-base leading-8 text-slate-500">{features[activeFeature].description}</p>
                      <div className="mt-7 space-y-3">{features[activeFeature].benefits.map((benefit) => <p key={benefit} className="flex items-center gap-2.5 text-sm font-semibold text-slate-600"><Check size={15} className="text-black/55" />{benefit}</p>)}</div>
                    </> })()}
                  </div>
                </div>
                <div>
                  <div key={features[activeFeature].id}><ProductVisual active={activeFeature} /></div>
                  <div className="mt-5 flex items-center justify-between px-2"><p className="text-xs font-semibold text-slate-400">Scroll to move through the platform</p><div className="flex gap-1.5">{features.map((feature, index) => <span key={feature.id} className={`h-1.5 rounded-full transition-all duration-500 ${activeFeature === index ? 'w-8 bg-black' : activeFeature > index ? 'w-1.5 bg-neutral-500' : 'w-1.5 bg-slate-200'}`} />)}</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-wrap mt-16 space-y-10 px-4 pb-24 sm:px-6 sm:pb-28 lg:hidden">
            {features.map((feature, index) => { const Icon = feature.icon; return <article key={feature.id} className="reveal platform-step">
              <div className="platform-step-index">0{index + 1}</div>
              <div className="flex gap-4 sm:gap-5"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink text-white"><Icon size={20} /></span><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-black/55">{feature.eyebrow}</p><h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-ink">{feature.title}</h3><p className="mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">{feature.description}</p><div className="mt-5 space-y-2">{feature.benefits.map((benefit) => <p key={benefit} className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Check size={14} className="text-black/55" />{benefit}</p>)}</div></div></div>
              <div className="mt-7"><ProductVisual active={index} /></div>
            </article> })}
          </div>
        </section>

        <section className="section-space bg-[#f2f2ef]" id="journey">
          <div className="page-wrap">
            <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
              <div className="reveal lg:sticky lg:top-32 lg:self-start"><div className="eyebrow"><Zap size={13} /> A better career rhythm</div><h2 className="section-title mt-6">From ambition<br />to momentum.</h2><p className="section-copy mt-5">Career growth is not a transaction. It is a connected loop that gets stronger with better context, clearer signals, and the right relationships.</p><a href="#join" className="button-secondary mt-8">Start your journey <ArrowRight size={15} /></a></div>
              <div className="relative">
                <div className="absolute bottom-10 left-[23px] top-10 w-px bg-gradient-to-b from-black/40 via-black/10 to-transparent sm:left-[35px]" />
                {journey.map((item, index) => <div key={item.number} style={{ transitionDelay: `${index * 80}ms` }} className="reveal relative mb-4 grid grid-cols-[48px_1fr] gap-4 rounded-[18px] border border-black/10 bg-white p-5 sm:grid-cols-[70px_1fr] sm:p-7"><span className="relative z-10 grid h-12 w-12 place-items-center rounded-lg bg-ink font-display text-xs font-semibold text-white sm:h-14 sm:w-14">{item.number}</span><div><div className="mb-3 flex items-center gap-3"><h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>{index === 3 && <Sparkles size={16} className="text-black/60" />}</div><p className="max-w-xl text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">{item.copy}</p></div></div>)}
              </div>
            </div>
          </div>
        </section>

        <section id="one" className="section-space relative bg-ink text-white">
          <div className="absolute inset-0 one-grid opacity-20" />
          <AmbientGrid dark />
          <div className="page-wrap relative z-10 grid items-center gap-14 lg:grid-cols-2">
            <div className="reveal"><div className="eyebrow eyebrow-dark"><Sparkles size={13} /> Meet YGrow One</div><h2 className="mt-7 font-display text-4xl font-medium leading-[1.03] tracking-[-.045em] sm:text-6xl">The context you need,<br /><span className="text-sky">right when it matters.</span></h2><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">YGrow One connects the opportunity in front of you with the experience behind you—so preparation feels relevant, interviews feel calmer, and each result sharpens the next move.</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{[['Grounded, not generic', 'Uses your real projects, skills, and responsibilities.'], ['Always connected', 'Works alongside your profile, pipeline, and interview history.'], ['Built to assist', 'Surfaces useful context while your judgment stays in control.'], ['Learns with you', 'Turns interview notes and outcomes into future insight.']].map(([title, copy]) => <div key={title} className="flex gap-3"><CircleCheck size={18} className="mt-0.5 shrink-0 text-sky" /><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{copy}</p></div></div>)}</div></div>
            <div className="reveal reveal-right reveal-delay-1 relative"><div className="absolute inset-10 rounded-full bg-white/10 blur-[90px]" /><div className="relative rounded-[20px] border border-white/15 bg-white/[.055] p-5 backdrop-blur sm:p-7"><div className="flex items-center justify-between border-b border-white/10 pb-5"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-ink"><Sparkles size={20} /></span><div><p className="font-display font-bold">YGrow One</p><p className="text-xs text-slate-400">Interview companion</p></div></div><span className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[9px] font-bold text-white/70"><i className="h-1.5 w-1.5 rounded-full bg-white" /> CONTEXT READY</span></div><div className="my-5 flex gap-3 rounded-xl bg-black/35 p-4"><MessageSquareText size={17} className="mt-0.5 shrink-0 text-white/80" /><p className="text-sm leading-6 text-slate-200">Tell me about a technical decision you changed after receiving feedback.</p></div><div className="space-y-3">{[['Best example', 'The observability rollout at Orbit'], ['Why it fits', 'Shows technical judgment + cross-team collaboration'], ['Key result', 'Alert noise reduced 46% in six weeks']].map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-white/[.04] p-3.5"><p className="text-[9px] font-bold uppercase tracking-[.15em] text-slate-500">{label}</p><p className="mt-1.5 text-sm text-slate-200">{value}</p></div>)}</div><div className="mt-5 flex items-center gap-2 text-[10px] text-slate-500"><ShieldCheck size={13} className="text-white/70" /> Built around your context. You stay in control.</div></div></div>
          </div>
        </section>

        <section id="teams" className="section-space">
          <div className="page-wrap"><div className="reveal section-heading"><div className="eyebrow"><Users size={13} /> Grow together</div><h2>A stronger network creates<br />better opportunities.</h2><p>YGrow is designed to make every side of the developer career ecosystem more human, relevant, and connected.</p></div><div className="mt-14 grid gap-5 md:grid-cols-3">{[
            { icon: Code2, tag: 'For developers', title: 'Build a career, not just a job search.', copy: 'Create a richer professional identity, connect with people who matter, and navigate each opportunity with clarity.', points: ['Career profile', 'Network & referrals', 'Opportunity workspace'] },
            { icon: Search, tag: 'For talent teams', title: 'Discover context beyond keywords.', copy: 'Understand the developer behind the résumé and build stronger candidate relationships from the first conversation.', points: ['Developer discovery', 'Context-rich matching', 'Connected outreach'] },
            { icon: Network, tag: 'For communities', title: 'Turn support into shared momentum.', copy: 'Help members move from learning to opportunity with better profiles, mentorship, and professional connections.', points: ['Member growth', 'Mentorship pathways', 'Career intelligence'] },
          ].map((card, i) => { const Icon = card.icon; return <article key={card.tag} style={{ transitionDelay: `${i * 100}ms` }} className={`reveal group rounded-[18px] border p-8 transition duration-300 hover:-translate-y-1 ${i === 1 ? 'border-ink bg-ink text-white' : 'border-black/10 bg-white'}`}><span className={`grid h-12 w-12 place-items-center rounded-lg ${i === 1 ? 'bg-white/10 text-white' : 'bg-neutral-100 text-black'}`}><Icon size={21} /></span><p className={`mt-8 text-[10px] font-semibold uppercase tracking-[.17em] ${i === 1 ? 'text-white/60' : 'text-black/55'}`}>{card.tag}</p><h3 className="mt-3 font-display text-2xl font-medium leading-tight">{card.title}</h3><p className={`mt-4 text-sm leading-6 ${i === 1 ? 'text-slate-300' : 'text-slate-500'}`}>{card.copy}</p><div className={`my-7 h-px ${i === 1 ? 'bg-white/10' : 'bg-black/[.07]'}`} />{card.points.map(point => <p key={point} className="mb-3 flex items-center gap-2 text-sm font-medium"><Check size={14} className={i === 1 ? 'text-white/70' : 'text-black/55'} />{point}</p>)}</article> })}</div></div>
        </section>

        <section id="faq" className="section-space bg-[#f2f2ef]">
          <div className="page-wrap grid gap-12 lg:grid-cols-[.65fr_1.35fr] lg:gap-20"><div className="reveal"><div className="eyebrow"><MessageSquareText size={13} /> Questions, answered</div><h2 className="section-title mt-6">Good to know.</h2><p className="section-copy mt-5">Have something else in mind? Reach us at <a className="font-semibold text-ink underline decoration-black/40 underline-offset-4" href="mailto:hello@ygrow.com">hello@ygrow.com</a>.</p></div><div className="reveal reveal-right divide-y divide-slate-200">{faqs.map((faq, index) => <div key={faq.q}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left"><span className="font-display text-lg font-bold text-ink">{faq.q}</span><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200 transition ${openFaq === index ? 'rotate-180 bg-ink text-white' : 'bg-white'}`}><ChevronDown size={15} /></span></button><div className={`grid transition-[grid-template-rows] duration-300 ${openFaq === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}><div className="overflow-hidden"><p className="max-w-2xl pb-6 pr-12 text-sm leading-7 text-slate-500 sm:text-base">{faq.a}</p></div></div></div>)}</div></div>
        </section>

        <section className="px-4 py-6 sm:px-6">
          <div className="reveal cta-panel page-wrap relative overflow-hidden rounded-[18px] bg-ink px-6 py-16 text-center text-white sm:px-10 sm:py-20"><div className="absolute left-[-5%] top-[-30%] h-80 w-80 rounded-full bg-white/10 blur-[90px]" /><div className="absolute bottom-[-40%] right-[-5%] h-80 w-80 rounded-full bg-white/[.06] blur-[90px]" /><div className="relative mx-auto max-w-3xl"><div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-lg border border-white/15 bg-white/[.06] text-white"><Sparkles size={23} /></div><h2 className="font-display text-4xl font-medium tracking-[-.045em] sm:text-6xl">Your career is yours.<br /><span className="text-white/60">The path can be shared.</span></h2><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Join the developer network built to turn profiles, people, opportunities, and context into lasting career momentum.</p><div className="mx-auto mt-9 max-w-xl"><WaitlistForm compact /></div></div></div>
        </section>
      </main>

      <footer className="bg-ink px-4 pb-8 pt-16 text-white sm:px-6">
        <div className="page-wrap"><div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]"><div><BrandMark light /><p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">A connected career network helping developers build their identity, network, opportunities, and momentum.</p><p className="mt-5 text-xs font-bold uppercase tracking-[.17em] text-sky">Why grow alone?</p></div>{[
          ['Platform', ['Developer profile', 'Opportunities', 'Career workspace', 'YGrow One']],
          ['Community', ['For developers', 'For companies', 'For recruiters', 'Partnerships']],
          ['Company', ['About', 'Blog', 'Help center', 'Contact']],
        ].map(([title, links]) => <div key={title as string}><p className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-slate-500">{title as string}</p>{(links as string[]).map(link => <a key={link} href="#join" className="mb-3 block text-sm text-slate-300 transition hover:text-white">{link}</a>)}</div>)}</div><div className="flex flex-col gap-4 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 YGrow. Built for developers who keep growing.</p><div className="flex gap-5"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a><a href="#" className="hover:text-white">Responsible AI</a></div></div></div>
      </footer>
    </div>
  )
}

export default App
