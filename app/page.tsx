"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

const floatingCards = [
  {
    quote: "Be strong and courageous. Do not be afraid.",
    reference: "Joshua 1:9",
    type: "scripture",
    position: { top: "18%", left: "4%" },
    delay: "0s",
  },
  {
    quote: "Discipline is the bridge between goals and accomplishment.",
    reference: "Jim Rohn",
    type: "quote",
    position: { top: "14%", right: "4%" },
    delay: "0.6s",
  },
  {
    quote: "As iron sharpens iron, so one man sharpens another.",
    reference: "Proverbs 27:17",
    type: "scripture",
    position: { top: "55%", left: "2%" },
    delay: "1.2s",
  },
  {
    quote: "The most important thing a father can do for his children is to love their mother.",
    reference: "Theodore Hesburgh",
    type: "quote",
    position: { top: "62%", right: "3%" },
    delay: "0.3s",
  },
  {
    quote: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13",
    type: "scripture",
    position: { top: "80%", left: "6%" },
    delay: "0.9s",
  },
  {
    quote: "Hard times create strong men.",
    reference: "G. Michael Hopf",
    type: "quote",
    position: { top: "78%", right: "5%" },
    delay: "1.5s",
  },
]

const features = [
  {
    icon: "📖",
    title: "Bible Tracker",
    description: "Log every chapter you read, build a daily streak, and watch your consistency compound over time.",
  },
  {
    icon: "🙏",
    title: "Prayer Log",
    description: "Record your prayers and mark them answered. A living record of God's faithfulness in your life.",
  },
  {
    icon: "🎯",
    title: "Goals Board",
    description: "Set goals across every area of life — spiritual, financial, health, relationships — and move them through a Kanban board.",
  },
  {
    icon: "📓",
    title: "Journal",
    description: "A private space to reflect, process, and write. No distractions, just you and the page.",
  },
  {
    icon: "💪",
    title: "Fitness Log",
    description: "Track your workouts and stay physically sharp. A strong body supports a strong mind and spirit.",
  },
]

const pillars = [
  {
    icon: "⚔️",
    title: "Accountability",
    description: "Data doesn't lie. Seeing your actual consistency — Bible readings, workouts, goals — cuts through self-deception and keeps you honest with yourself.",
  },
  {
    icon: "🔥",
    title: "Consistency",
    description: "Small daily actions compound into transformation. This app is built around streaks, weekly reviews, and monthly recaps to keep momentum alive.",
  },
  {
    icon: "✝️",
    title: "Purpose",
    description: "Growth without direction is just noise. Every feature here is built around becoming the man God designed you to be — in faith, character, and action.",
  },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--app-bg)', color: 'var(--app-text)' }}>
      <style>{`
        * { box-sizing: border-box; }

        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }

        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }

        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-14px) rotate(1deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(2deg); }
        }

        .float-a { animation: floatA 7s ease-in-out infinite; }
        .float-b { animation: floatB 9s ease-in-out infinite; }
        .float-c { animation: floatC 6s ease-in-out infinite; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.9s ease forwards;
        }

        .card-scripture {
          background: var(--gold-bg-subtle);
          border: 1px solid var(--gold-border-subtle);
          backdrop-filter: blur(12px);
        }

        .card-quote {
          background: var(--card-bg);
          border: 1px solid var(--border-default);
          backdrop-filter: blur(12px);
        }

        .gold { color: var(--app-gold); }

        .btn-primary {
          background: linear-gradient(135deg, var(--app-gold), #b8962e);
          color: var(--app-bg);
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.3s ease;
          box-shadow: 0 0 30px var(--gold-bg-strong);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 50px var(--gold-bg-strong);
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid var(--border-medium);
          color: var(--text-soft);
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          border-color: var(--gold-border);
          color: var(--app-gold);
          transform: translateY(-2px);
        }

        .nav-link {
          color: var(--text-soft);
          transition: color 0.2s;
          font-size: 0.875rem;
          letter-spacing: 0.02em;
        }
        .nav-link:hover { color: var(--app-text); }

        .feature-card {
          background: var(--card-bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          background: var(--gold-bg-subtle);
          border-color: var(--gold-border-subtle);
          transform: translateY(-4px);
        }

        .pillar-card {
          background: var(--card-bg);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 36px 32px;
        }

        .section-divider {
          border: none;
          border-top: 1px solid var(--border-subtle);
          margin: 0 32px;
        }

        .headline-muted { color: var(--text-faint); }
      `}</style>

      {/* Grain overlay */}
      <div className="grain" />

      {/* Background orbs */}
      <div className="glow-orb w-[600px] h-[600px] bg-amber-600/10 top-[-100px] left-[20%]" />
      <div className="glow-orb w-[400px] h-[400px] bg-amber-500/8 bottom-[10%] right-[10%]" />
      <div className="glow-orb w-[300px] h-[300px] bg-yellow-700/10 top-[40%] left-[-5%]" />

      {/* Navbar */}
      <nav className="font-body relative z-50 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg, var(--app-gold), #b8962e)' }}>
            ✝
          </div>
          <span className="font-medium tracking-wide text-sm" style={{ color: 'var(--app-text)' }}>FaithGrowth</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#scripture" className="nav-link">Scripture</a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="btn-secondary font-body text-sm px-5 py-2 rounded-full">
            Log In
          </Link>
        </div>
      </nav>

      {/* Floating Quote Cards */}
      {floatingCards.map((card, i) => (
        <div
          key={i}
          className={`absolute z-20 hidden 2xl:block ${i % 3 === 0 ? 'float-a' : i % 3 === 1 ? 'float-b' : 'float-c'} ${card.type === 'scripture' ? 'card-scripture' : 'card-quote'} rounded-2xl p-4 max-w-[200px] fade-in-up`}
          style={{
            ...card.position,
            animationDelay: card.delay,
            animationFillMode: 'forwards',
          }}
        >
          {card.type === 'scripture' && (
            <span className="text-[10px] gold font-body uppercase tracking-widest mb-2 block">Scripture</span>
          )}
          <p className="font-display text-sm leading-relaxed italic" style={{ color: 'var(--text-soft)' }}>"{card.quote}"</p>
          <p className="font-body text-[11px] mt-2" style={{ color: card.type === 'scripture' ? 'var(--app-gold)' : 'var(--text-dim)' }}>
            — {card.reference}
          </p>
        </div>
      ))}

      {/* Hero Section */}
      <section className="relative z-30 flex flex-col items-center text-center px-6 pt-16 pb-32 max-w-4xl mx-auto">
        <div
          className="font-body fade-in-up mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase"
          style={{
            animationDelay: '0.1s',
            animationFillMode: 'forwards',
            background: 'var(--gold-bg-subtle)',
            border: '1px solid var(--gold-border-subtle)',
            color: 'var(--app-gold)',
          }}
        >
          <span>✝</span> Faith · Discipline · Purpose
        </div>

        <h1
          className="font-display fade-in-up"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            animationDelay: '0.2s',
            animationFillMode: 'forwards',
          }}
        >
          Become the Man<br />
          <span className="headline-muted">God Called</span><br />
          You to Be
        </h1>

        <p
          className="font-body fade-in-up mt-8 max-w-lg text-base leading-relaxed"
          style={{
            color: 'var(--text-soft)',
            animationDelay: '0.35s',
            animationFillMode: 'forwards',
          }}
        >
          Track your Bible reading, prayers, goals, and fitness — all in one place. Built for men who take their faith and growth seriously.
        </p>

        <div
          className="font-body fade-in-up flex flex-col sm:flex-row items-center gap-4 mt-10"
          style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
        >
          <Link href="/login" className="btn-primary px-8 py-3.5 rounded-full text-sm">
            Get Started — It's Free
          </Link>
          <a href="#features" className="btn-secondary px-8 py-3.5 rounded-full text-sm">
            See Features
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-30 px-8 pb-32 max-w-6xl mx-auto">
        <hr className="section-divider mb-20" />

        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-widest gold mb-4">Everything you need</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold">
            Built around your growth
          </h2>
          <p className="font-body mt-4 max-w-md mx-auto text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Five focused tools, one dashboard. No fluff, no distraction — just the disciplines that matter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="text-3xl mb-5">{f.icon}</div>
              <h3 className="font-display text-2xl font-semibold mb-3">{f.title}</h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                {f.description}
              </p>
            </div>
          ))}

          {/* CTA card */}
          <div className="feature-card flex flex-col items-start justify-between" style={{ background: 'var(--gold-bg-subtle)', borderColor: 'var(--gold-border-faint)' }}>
            <div>
              <div className="text-3xl mb-5">⚔️</div>
              <h3 className="font-display text-2xl font-semibold mb-3">Monthly Review</h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                At the end of every month, get a full breakdown of your progress and earn your tier — Warrior, Soldier, Recruit, or Apprentice.
              </p>
            </div>
            <Link href="/login" className="btn-primary font-body text-sm px-6 py-2.5 rounded-full mt-8 inline-block">
              Start tracking →
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-30 px-8 pb-32 max-w-6xl mx-auto">
        <hr className="section-divider mb-20" />

        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-widest gold mb-4">Why it works</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold">
            Structure creates freedom
          </h2>
          <p className="font-body mt-4 max-w-md mx-auto text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            The men who grow the most aren't the most talented — they're the most consistent. This app is built on that truth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <div key={i} className="pillar-card">
              <div className="text-3xl mb-6">{p.icon}</div>
              <h3 className="font-display text-2xl font-semibold mb-4">{p.title}</h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Scripture Strip */}
      <section
        id="scripture"
        className="relative z-30 px-8 pt-16 pb-20 text-center"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <p
          className="font-display text-2xl md:text-3xl italic max-w-2xl mx-auto"
          style={{ color: 'var(--text-medium)', lineHeight: 1.6 }}
        >
          "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you."
        </p>
        <p className="font-body text-sm mt-4 gold tracking-widest uppercase">Jeremiah 29:11</p>

        <div className="mt-12 flex flex-col items-center gap-4">
          <Link href="/login" className="btn-primary font-body text-sm px-8 py-3.5 rounded-full">
            Begin your journey →
          </Link>
          <p className="font-body text-xs" style={{ color: 'var(--text-faint)' }}>
            Free to use. No credit card required.
          </p>
        </div>
      </section>
    </div>
  )
}
