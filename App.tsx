import { useEffect, useRef, useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

type Project = {
  number: string
  title: string[]
  description: string
  tech: string
  reverse?: boolean
}

const PROJECTS: Project[] = [
  {
    number: '01',
    title: ['BADMINTON', 'TOURNAMENT', 'MANAGEMENT'],
    description:
      'A tournament administration platform for managing players, draws, schedules, match results and rankings, with a public read-only competition website.',
    tech: 'Python / React / Vite / GitHub API',
  },
  {
    number: '02',
    title: ['REAL-TIME', 'CHAT SYSTEM'],
    description:
      'A real-time communication system built around live messaging and modern web technologies.',
    tech: 'ASP.NET Core / React / SignalR / PostgreSQL',
    reverse: true,
  },
  {
    number: '03',
    title: ['LEARNING', 'SUPPORT', 'SYSTEM'],
    description:
      'A web-based learning support platform with authentication, APIs and structured backend architecture.',
    tech: 'REST API / Spring Security / MySQL',
  },
]

const TIMELINE = [
  {
    year: '2025 —',
    role: 'Software Engineering Internship',
    group: 'Internship / Professional Experience',
    desc: 'Worked on backend services and internal tooling, contributing to production code within an existing system architecture.',
  },
  {
    year: '2024',
    role: 'Badminton Tournament Management Platform',
    group: 'Software Projects',
    desc: 'Designed and built a tournament administration system end to end, from data model to public results website.',
  },
  {
    year: '2024',
    role: 'Real-Time Chat System',
    group: 'Software Projects',
    desc: 'Built a live messaging application using SignalR and a relational backend to explore real-time architecture.',
  },
  {
    year: '2023',
    role: 'B.Eng. Software Engineering',
    group: 'Education',
    desc: 'Studied software engineering fundamentals — data structures, systems design and applied programming.',
  },
  {
    year: '2022 —',
    role: 'Japanese Language Study',
    group: 'Japanese Language Study',
    desc: 'Ongoing study of Japanese, aimed at working effectively with Japanese engineering teams.',
  },
]

const TOOLS = [
  { group: 'Backend', items: ['C#', 'Java', 'ASP.NET Core', 'PHP'] },
  { group: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Flutter', 'Kotlin'] },
  { group: 'Data', items: ['PostgreSQL', 'MySQL'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'REST API', 'Vite'] },
]

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

/** Reveals an element with a class toggle once it enters the viewport. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  })
}

/** Tracks which top-level section is currently in view for nav highlighting. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids])
  return active
}

type MagicParticle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  rotation: number
  color: string
}

/** A lightweight canvas trail with a softly delayed custom cursor. */
function MagicCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reducedMotion.matches) return

    const canvasNode = canvasRef.current
    const dotNode = dotRef.current
    const ringNode = ringRef.current
    if (!canvasNode || !dotNode || !ringNode) return
    const canvasContext = canvasNode.getContext('2d')
    if (!canvasContext) return

    const canvas: HTMLCanvasElement = canvasNode
    const dot: HTMLSpanElement = dotNode
    const ring: HTMLSpanElement = ringNode
    const context: CanvasRenderingContext2D = canvasContext

    const particles: MagicParticle[] = []
    const colors = ['#E85135', '#F4A261', '#161616', '#F3F1EC']
    let pointerX = -100
    let pointerY = -100
    let ringX = -100
    let ringY = -100
    let lastParticleX = -100
    let lastParticleY = -100
    let frame = 0

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    function addParticle(x: number, y: number) {
      const maxLife = 36 + Math.random() * 20
      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -0.35 - Math.random() * 0.8,
        size: 2.4 + Math.random() * 3.6,
        life: maxLife,
        maxLife,
        rotation: Math.random() * Math.PI,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
      if (particles.length > 70) particles.shift()
    }

    function drawSparkle(particle: MagicParticle) {
      const alpha = Math.max(0, particle.life / particle.maxLife)
      context.save()
      context.translate(particle.x, particle.y)
      context.rotate(particle.rotation)
      context.globalAlpha = alpha
      context.fillStyle = particle.color
      context.shadowBlur = 9 * alpha
      context.shadowColor = particle.color
      context.beginPath()
      context.moveTo(0, -particle.size)
      context.lineTo(particle.size * 0.28, -particle.size * 0.28)
      context.lineTo(particle.size, 0)
      context.lineTo(particle.size * 0.28, particle.size * 0.28)
      context.lineTo(0, particle.size)
      context.lineTo(-particle.size * 0.28, particle.size * 0.28)
      context.lineTo(-particle.size, 0)
      context.lineTo(-particle.size * 0.28, -particle.size * 0.28)
      context.closePath()
      context.fill()
      context.restore()
    }

    function render() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

      ringX += (pointerX - ringX) * 0.16
      ringY += (pointerY - ringY) * 0.16
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i]
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.018
        particle.rotation += 0.035
        particle.life -= 1
        drawSparkle(particle)
        if (particle.life <= 0) particles.splice(i, 1)
      }

      frame = window.requestAnimationFrame(render)
    }

    function onPointerMove(event: PointerEvent) {
      pointerX = event.clientX
      pointerY = event.clientY
      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`
      dot.classList.add('is-visible')
      ring.classList.add('is-visible')

      const distance = Math.hypot(pointerX - lastParticleX, pointerY - lastParticleY)
      if (distance > 9) {
        addParticle(pointerX, pointerY)
        addParticle(pointerX, pointerY)
        if (Math.random() > 0.45) addParticle(pointerX, pointerY)
        lastParticleX = pointerX
        lastParticleY = pointerY
      }
    }

    function onPointerOver(event: PointerEvent) {
      const target = event.target as HTMLElement | null
      ring.classList.toggle(
        'is-interactive',
        Boolean(target?.closest('a, button, input, textarea, select, [role="button"]')),
      )
    }

    function onPointerLeave() {
      dot.classList.remove('is-visible')
      ring.classList.remove('is-visible')
    }

    resizeCanvas()
    document.documentElement.classList.add('magic-cursor-enabled')
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerover', onPointerOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onPointerLeave)
    frame = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(frame)
      document.documentElement.classList.remove('magic-cursor-enabled')
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerover', onPointerOver)
      document.documentElement.removeEventListener('mouseleave', onPointerLeave)
    }
  }, [])

  return (
    <div className="magic-cursor" aria-hidden="true">
      <canvas ref={canvasRef} className="magic-cursor-trail" />
      <span ref={ringRef} className="magic-cursor-ring" />
      <span ref={dotRef} className="magic-cursor-dot" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [cvOpen, setCvOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(['about', 'work', 'experience', 'contact'])
  useReveal()

  const cvRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (cvRef.current && !cvRef.current.contains(e.target as Node)) {
        setCvOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <MagicCursor />
      <Header
        active={active}
        scrollTo={scrollTo}
        cvOpen={cvOpen}
        setCvOpen={setCvOpen}
        cvRef={cvRef}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main>
        <Hero scrollTo={scrollTo} />
        <About />
        <Work />
        <Experience />
        <Tools />
        <Contact />
      </main>
      <Footer scrollTo={scrollTo} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Header                                                              */
/* ------------------------------------------------------------------ */

function Header({
  active,
  scrollTo,
  cvOpen,
  setCvOpen,
  cvRef,
  menuOpen,
  setMenuOpen,
}: {
  active: string
  scrollTo: (id: string) => void
  cvOpen: boolean
  setCvOpen: (v: boolean) => void
  cvRef: React.RefObject<HTMLDivElement>
  menuOpen: boolean
  setMenuOpen: (v: boolean) => void
}) {
  return (
    <header className="header">
      <div className="header-inner">
        <a
          className="logo"
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          BO.
        </a>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              className={`nav-link ${active === link.id ? 'is-active' : ''}`}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="header-right">
          <div className="cv-wrap" ref={cvRef}>
            <button className="cv-btn" onClick={() => setCvOpen(!cvOpen)}>
              CV <span className="arrow">↓</span>
            </button>
            {cvOpen && (
              <div className="cv-dropdown">
                <a className="cv-item" href="/cv/ngo-quoc-bo-jp.pdf" target="_blank" rel="noreferrer">
                  <span className="cv-lang">日本語</span>
                  <span className="cv-desc">Japanese CV</span>
                  <span className="cv-link">PDF ↗</span>
                </a>
                <a className="cv-item" href="/cv/ngo-quoc-bo-en.pdf" target="_blank" rel="noreferrer">
                  <span className="cv-lang">ENGLISH</span>
                  <span className="cv-desc">English CV</span>
                  <span className="cv-link">PDF ↗</span>
                </a>
              </div>
            )}
          </div>

          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero({ scrollTo }: { scrollTo: (id: string) => void }) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0, moveX: 0, moveY: 0 })

  function onMouseMove(e: React.MouseEvent) {
    const el = sceneRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({
      x: py * -4,
      y: px * 7,
      moveX: px * 12,
      moveY: py * 8,
    })
  }

  function onMouseLeave() {
    setTilt({ x: 0, y: 0, moveX: 0, moveY: 0 })
  }

  return (
    <section id="top" className="hero">
      <div className="hero-grid">
        <div className="hero-left">
          <p className="eyebrow reveal">Software Engineer — Vietnam</p>
          <h1 className="hero-name reveal">
            LE NGO
            <br />
            QUOC BO
          </h1>
           <p>レー・ゴー・クオック・ボー</p>
          <p className="hero-desc reveal">
            Backend-focused software developer building practical web applications and
            software systems.
          </p>
          <div className="hero-actions reveal">
            <button className="btn-primary" onClick={() => scrollTo('work')}>
              View selected work <span>↘</span>
            </button>
            <button className="btn-ghost" onClick={() => scrollTo('contact')}>
              CV <span>↓</span>
            </button>
          </div>
          <p className="tech-line reveal">
            C# · Java · ASP.NET · React · TypeScript · Flutter · Kotlin
          </p>
        </div>

        <div
          className="hero-right"
          ref={sceneRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <span className="hero-bg-number" aria-hidden="true">
            01
          </span>

          <div
            className="scene"
            style={{
              transform: `translate3d(${tilt.moveX}px, ${tilt.moveY}px, 0) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          >
            <img
              className="hero-illustration"
              src="/assets/developer-hero.png"
              alt="Stylized illustration of a software engineer working at a dual-monitor desk"
              width={1254}
              height={1254}
              loading="eager"
              decoding="async"
              draggable={false}
            />
          </div>

          <p className="drag-label">Move cursor to explore ↔</p>
        </div>
      </div>

      <button className="scroll-cue" onClick={() => scrollTo('about')}>
        Scroll to explore ↓
      </button>
    </section>
  )
}

/** Stylized low-poly placeholder scene — swap for a Three.js / R3F canvas later. */
function DeveloperScene() {
  return (
    <svg
      className="scene-svg"
      viewBox="0 0 480 480"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a developer sitting at a desk with a laptop"
    >
      {/* desk */}
      <rect x="70" y="330" width="340" height="14" rx="2" fill="#D8D5CE" />
      <rect x="96" y="344" width="14" height="86" fill="#D8D5CE" />
      <rect x="370" y="344" width="14" height="86" fill="#D8D5CE" />

      {/* monitor */}
      <rect x="150" y="220" width="140" height="94" rx="4" fill="#161616" />
      <rect x="160" y="230" width="120" height="74" rx="2" fill="#F3F1EC" />
      <rect x="172" y="242" width="60" height="6" fill="#D8D5CE" />
      <rect x="172" y="254" width="80" height="6" fill="#D8D5CE" />
      <rect x="172" y="266" width="40" height="6" fill="#E85135" />
      <rect x="208" y="314" width="24" height="14" fill="#161616" />
      <rect x="192" y="328" width="56" height="6" rx="2" fill="#161616" />

      {/* laptop */}
      <rect x="290" y="300" width="80" height="6" rx="2" fill="#161616" />
      <path d="M292 300 L302 262 L366 262 L372 300 Z" fill="#73716C" />
      <rect x="306" y="266" width="56" height="30" fill="#F3F1EC" />

      {/* chair */}
      <rect x="180" y="330" width="10" height="60" fill="#D8D5CE" />
      <circle cx="185" cy="392" r="8" fill="#D8D5CE" />

      {/* figure */}
      <circle cx="205" cy="200" r="22" fill="#E8DCC8" />
      <path d="M183 210 Q205 232 227 210 L227 236 Q205 248 183 236 Z" fill="#161616" />
      <path
        d="M175 236 Q205 260 235 236 L240 330 L170 330 Z"
        fill="#161616"
      />
      <path d="M175 236 L150 280 L160 288 L188 250 Z" fill="#161616" />
      <path d="M235 236 L262 272 L252 282 L226 250 Z" fill="#161616" />
      <circle cx="150" cy="284" r="7" fill="#E8DCC8" />
      <circle cx="255" cy="278" r="7" fill="#E8DCC8" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  About                                                               */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="about" className="about">
      <p className="section-label reveal">01 — About</p>
      <h2 className="section-headline reveal">
        I BUILD THINGS
        <br />
        THAT ACTUALLY WORK.
      </h2>

      <div className="about-grid">
        <div className="about-left reveal">
          <p className="about-heading">Backend-minded.
            <br />Detail-driven.
            <br />Vietnam-based.</p>
        </div>
        <div className="about-right reveal">
          <p>
            I'm Ngo Quoc Bo, a software developer from Vietnam focused on backend
            development, web applications and software systems.
          </p>
          <p>
            I enjoy understanding how systems work, solving practical problems and
            turning ideas into working products.
          </p>

          <div className="focus-block">
            <p className="focus-label">Current focus</p>
            <div className="focus-list">
              <span>Backend Development</span>
              <span>Web Applications</span>
              <span>System Design</span>
              <span>AI Integration</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Selected Work                                                       */
/* ------------------------------------------------------------------ */

function Work() {
  return (
    <section id="work" className="work">
      <p className="section-label reveal">02 — Selected work</p>
      <h2 className="section-headline reveal">
        PROJECTS
        <br />
        I'M PROUD OF.
      </h2>

      <div className="project-list">
        {PROJECTS.map((p) => (
          <ProjectRow key={p.number} project={p} />
        ))}
      </div>
    </section>
  )
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className={`project reveal ${project.reverse ? 'project-reverse' : ''}`}>
      <div className="project-info">
        <span className="project-number">{project.number}</span>
        <h3 className="project-title">
          {project.title.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </h3>
        <p className="project-desc">{project.description}</p>
        <p className="project-tech">{project.tech}</p>
        <a className="project-link" href="#">
          View project <span>↗</span>
        </a>
      </div>

      <div className="project-frame">
        <div className="browser-frame">
          <div className="browser-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="browser-body">Project screenshot</div>
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/*  Experience                                                          */
/* ------------------------------------------------------------------ */

function Experience() {
  return (
    <section id="experience" className="experience">
      <p className="section-label reveal">03 — Experience</p>
      <h2 className="section-headline reveal">
        WHERE I'VE
        <br />
        BEEN BUILDING.
      </h2>

      <div className="timeline">
        {TIMELINE.map((item, i) => (
          <div className="timeline-row reveal" key={i}>
            <span className="timeline-year">{item.year}</span>
            <div className="timeline-content">
              <p className="timeline-group">{item.group}</p>
              <p className="timeline-role">{item.role}</p>
              <p className="timeline-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Tools                                                               */
/* ------------------------------------------------------------------ */

function Tools() {
  return (
    <section id="tools" className="tools">
      <p className="section-label reveal">04 — Tools</p>
      <h2 className="section-headline reveal">
        TOOLS I USE
        <br />
        TO BUILD.
      </h2>

      <div className="tools-grid">
        {TOOLS.map((col) => (
          <div className="tools-col reveal" key={col.group}>
            <p className="tools-col-label">{col.group}</p>
            <ul>
              {col.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Contact                                                             */
/* ------------------------------------------------------------------ */

function Contact() {
  return (
    <section id="contact" className="contact">
      <p className="section-label reveal">05 — Contact</p>
      <h2 className="contact-headline reveal">
        LET'S BUILD
        <br />
        SOMETHING
        <br />
        USEFUL.
      </h2>
      <p className="contact-sub reveal">
        Available for software development opportunities and interesting projects.
      </p>

      <div className="contact-links reveal">
        <a href="mailto:hello@ngoquocbo.dev">Email ↗</a>
        <a href="https://github.com/" target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
      </div>

      <div className="resume-block reveal">
        <p className="resume-label">Resume / CV</p>
        <div className="resume-grid">
          <a className="resume-item" href="/cv/ngo-quoc-bo-jp.pdf" target="_blank" rel="noreferrer">
            <span className="resume-lang">日本語</span>
            <span className="resume-desc">Japanese CV</span>
            <span className="resume-download">Download PDF ↗</span>
          </a>
          <a className="resume-item" href="/cv/ngo-quoc-bo-en.pdf" target="_blank" rel="noreferrer">
            <span className="resume-lang">English</span>
            <span className="resume-desc">English CV</span>
            <span className="resume-download">Download PDF ↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <footer className="footer">
      <p>© 2026 Ngo Quoc Bo</p>
      <p className="footer-center">
        Software Engineer
        <br />
        Vietnam
      </p>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top ↑
      </button>
    </footer>
  )
}
