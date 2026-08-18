import { useEffect, useState } from 'react'

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

export default function HeroMessage() {
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
    <div key={activeTopic} className="hero-message-cycle">
      <h1
        aria-label={topic.lines.join(' ')}
        className={`hero-topic-heading hero-topic-${topic.animation} text-[clamp(3.7rem,9vw,7.5rem)] font-medium leading-[.9] tracking-[-.04em] text-white`}
      >
        <AnimatedTitle topic={topic} />
      </h1>
      <TypedCopy text={topic.description} delay={topic.copyDelay} />
    </div>
  )
}
