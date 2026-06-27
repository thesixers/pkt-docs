import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Package, Zap, Cpu, ArrowRight, GitBranch, Book, CheckCircle, ChevronRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* ── Floating chips in the background ── */
const floatingCommands = [
  'pkt add react', 'pkt run dev', 'pkt add numpy', 'pkt run build',
  'pkt add serde', 'pkt run test', 'pkt add gin', 'pkt mv @src @lib',
  'pkt cp @config .', 'pkt list', 'pkt update', 'pkt run start',
];

const FloatingChips = () => (
  <div className="floating-chips" aria-hidden="true">
    {floatingCommands.map((cmd, i) => (
      <span
        key={i}
        className="chip"
        style={{
          '--delay': `${(i * 1.3) % 12}s`,
          '--duration': `${14 + (i % 7)}s`,
          '--start-x': `${(i * 17) % 90}%`,
          '--size': `${0.75 + (i % 3) * 0.1}`,
        }}
      >
        {cmd}
      </span>
    ))}
  </div>
);

/* ── Cycling typewriter for hero ── */
const oldCommands = ['npm install', 'pip install', 'cargo add', 'go get'];
const TypewriterHero = () => {
  const [phase, setPhase] = useState(0); // 0=typing old, 1=deleting old, 2=showing pkt
  const [displayed, setDisplayed] = useState('');
  const [oldIdx, setOldIdx] = useState(0);
  const current = oldCommands[oldIdx];

  useEffect(() => {
    let timeout;
    if (phase === 0) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setPhase(1), 1200);
      }
    } else if (phase === 1) {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        timeout = setTimeout(() => setPhase(2), 200);
      }
    } else if (phase === 2) {
      timeout = setTimeout(() => {
        setOldIdx((oldIdx + 1) % oldCommands.length);
        setDisplayed('');
        setPhase(0);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [phase, displayed, current, oldIdx]);

  return (
    <div className="typewriter-block">
      <div className={`tw-line old ${phase === 2 ? 'hidden' : ''}`}>
        <span className="tw-dollar">$</span>
        <span className="tw-text strike">{displayed}</span>
        <span className="tw-cursor">|</span>
      </div>
      <div className={`tw-line new ${phase === 2 ? 'visible' : ''}`}>
        <span className="tw-dollar pkt-dollar">$</span>
        <span className="tw-text pkt-green">pkt add</span>
        <span className="tw-cursor pkt-cursor">|</span>
      </div>
    </div>
  );
};

/* ── Language tabs ── */
const tabs = [
  {
    lang: 'Node.js',
    before: 'npm install express\nnpm run dev\nnpm run build',
    after:  'pkt add express\npkt run dev\npkt run build',
  },
  {
    lang: 'Python',
    before: 'pip install flask\npython -m flask run\npip freeze > req.txt',
    after:  'pkt add flask\npkt run dev\npkt run freeze',
  },
  {
    lang: 'Rust',
    before: 'cargo add serde\ncargo run\ncargo build --release',
    after:  'pkt add serde\npkt run\npkt run release',
  },
  {
    lang: 'Go',
    before: 'go get github.com/gin-gonic/gin\ngo run main.go\ngo build .',
    after:  'pkt add gin\npkt run\npkt run build',
  },
];

const LangTabs = () => {
  const [active, setActive] = useState(0);
  return (
    <div className="lang-tabs-section">
      <div className="section-label">Works Everywhere</div>
      <h2 className="section-title">One command, <span className="text-gradient">any language</span></h2>
      <p className="section-sub">Stop memorising each ecosystem's CLI. PKT speaks them all.</p>
      <div className="lang-tabs">
        {tabs.map((t, i) => (
          <button key={i} className={`lang-tab ${active === i ? 'active' : ''}`} onClick={() => setActive(i)}>
            {t.lang}
          </button>
        ))}
      </div>
      <div className="lang-compare">
        <div className="compare-panel before-panel">
          <div className="compare-label">Before</div>
          <pre><code>{tabs[active].before}</code></pre>
        </div>
        <div className="compare-arrow"><ChevronRight size={28} /></div>
        <div className="compare-panel after-panel">
          <div className="compare-label">With PKT</div>
          <pre><code>{tabs[active].after}</code></pre>
        </div>
      </div>
    </div>
  );
};

/* ── Animated stat counter ── */
const StatCounter = ({ end, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = Math.ceil(end / 40);
          const interval = setInterval(() => {
            start = Math.min(start + step, end);
            setCount(start);
            if (start >= end) clearInterval(interval);
          }, 30);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-number">{count}+</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

/* ── Main Page ── */
const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="landing-page">
      <FloatingChips />

      {/* Top Nav */}
      <nav className="landing-nav glass-panel">
        <div className="nav-brand">
          <div className="logo-icon">PKT</div>
        </div>
        <div className="nav-links">
          <Link to="/docs/index" className="nav-item">Documentation</Link>
          <a href="https://github.com/thesixers/pkt" target="_blank" rel="noreferrer" className="nav-item flex-center gap-2"><GitBranch size={16} /> GitHub</a>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link to="/docs/getting-started" className="btn btn-primary nav-cta">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-eyebrow"><CheckCircle size={14}/> v1.2.5 </div>
        <h1 className="hero-mega-title">
          Stop juggling<br />
          <span className="text-gradient">package managers</span>
        </h1>
        <p className="hero-mega-sub">
          npm, pip, cargo, go mod — same syntax, one tool.
        </p>
        <TypewriterHero />
        <div className="hero-ctas">
          <Link to="/docs/getting-started" className="btn btn-primary btn-lg">
            Get Started <ArrowRight size={20} />
          </Link>
          <Link to="/docs/index" className="btn btn-ghost btn-lg">
            <Book size={18} /> Read the Docs
          </Link>
        </div>
      </section>

      {/* Stats strip */}
      <div className="stats-strip">
        <StatCounter end={6} label="Runtimes Supported" />
        <div className="stats-div" />
        <StatCounter end={50} label="Commands Unified" />
        <div className="stats-div" />
        <StatCounter end={100} label="Projects Managed" />
      </div>

      {/* Language Tabs */}
      <LangTabs />

      {/* Feature Bento */}
      <section className="features-section">
        <div className="section-label">Features</div>
        <h2 className="section-title">Everything you need, <span className="text-gradient">nothing you don't</span></h2>
        <div className="bento-grid">
          <div className="bento-card bento-large glass-panel">
            <div className="bento-card-inner">
              <div className="feature-icon"><Package size={30} /></div>
              <h3>Universal Package Management</h3>
              <p>
                `pkt add` works everywhere. We translate it to npm, pip, cargo, or go get automatically.
                Python virtual environments are handled transparently — no manual `venv` activation ever again.
              </p>
              <div className="bento-tag">npm • pip • cargo • go mod</div>
            </div>
          </div>

          <div className="bento-card glass-panel">
            <div className="feature-icon"><Terminal size={24} /></div>
            <h3>Unified Execution</h3>
            <p>`pkt run dev` across every language. No more memorising `python -m`, `cargo run`, or `go run`.</p>
          </div>

          <div className="bento-card glass-panel">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3>@ Path Routing</h3>
            <p>Move files instantly with `@` syntax. `pkt mv @src/auth @lib` — no relative path math needed.</p>
          </div>

          <div className="bento-card bento-wide glass-panel">
            <div className="bento-flex">
              <div className="bento-wide-icon"><Cpu size={40} /></div>
              <div>
                <h3>Built for AI Agents</h3>
                <p>PKT exposes a rich context layer that lets AI coding assistants understand your project structure, track dependencies, and safely execute workspace operations — without ambiguity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner glass-panel">
        <h2>Ready to simplify your workflow?</h2>
        <p>Get up and running in seconds. No config required.</p>
        <div className="cta-row">
          <div className="install-block">
            <code>curl -fsSL https://pkt.dev/install | sh</code>
          </div>
          <Link to="/docs/getting-started" className="btn btn-primary btn-lg">
            Read the guide <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-icon small">PKT</div>
            <span className="footer-copyright">© 2026 PKT Open Source</span>
          </div>
          <div className="footer-links">
            <Link to="/docs/index">Docs</Link>
            <Link to="/docs/getting-started">Installation</Link>
            <a href="https://github.com/thesixers/pkt" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
