import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import './index.css';

/* ─── Typewriter ─── */
const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) { setDisplayText((prev) => prev + text.charAt(i)); i++; }
      else clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, [text]);
  return <span>{displayText}</span>;
};

/* ─── Floating Orbs ─── */
const FloatingOrbs = () => (
  <div className="orbs-container" aria-hidden="true">
    {[
      { size: 420, x: '8%',  y: '4%',  color: 'rgba(0,255,136,0.07)', dur: 18 },
      { size: 300, x: '68%', y: '12%', color: 'rgba(0,195,255,0.05)', dur: 22 },
      { size: 250, x: '48%', y: '58%', color: 'rgba(0,255,136,0.04)', dur: 26 },
      { size: 180, x: '82%', y: '68%', color: 'rgba(120,80,255,0.06)', dur: 20 },
    ].map((orb, i) => (
      <motion.div
        key={i}
        className="orb"
        style={{
          width: orb.size, height: orb.size,
          left: orb.x, top: orb.y,
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
        }}
        animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 2 }}
      />
    ))}
  </div>
);

/* ─── Particle Grid ─── */
const ParticleGrid = () => (
  <div className="particle-grid" aria-hidden="true">
    {Array.from({ length: 28 }).map((_, i) => (
      <motion.div
        key={i}
        className="particle-dot"
        animate={{ opacity: [0.08, 0.45, 0.08], scale: [1, 1.5, 1] }}
        transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: (i * 0.31) % 5 }}
      />
    ))}
  </div>
);

/* ─── Bottom Nav ─── */
const NAV_ITEMS = [
  {
    id: 'professional', label: 'Home',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    id: 'resume', label: 'Resume',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    id: 'contact', label: 'Contact',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  },
];

const BottomNav = ({ activePage, setActivePage }) => (
  <motion.nav
    className="bottom-nav"
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, delay: 0.9, type: 'spring', stiffness: 200, damping: 25 }}
  >
    {NAV_ITEMS.map((item) => {
      const isActive = activePage === item.id;
      return (
        <motion.button
          key={item.id}
          className={`bottom-nav-item${isActive ? ' active' : ''}`}
          onClick={() => setActivePage(item.id)}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.91 }}
        >
          {isActive && (
            <motion.div
              layoutId="bottom-pill"
              className="bottom-nav-pill"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </motion.button>
      );
    })}
  </motion.nav>
);

/* ─── Scroll-triggered fade-up ─── */
const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

/* ─── App ─── */
function App() {
  const [activePage, setActivePage] = useState('professional');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="app">
      {/* Scroll progress bar */}
      <motion.div style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'var(--accent-green)', transformOrigin: '0%', zIndex: 10000 }} />

      {/* Top-level ambient layers */}
      <FloatingOrbs />
      <ParticleGrid />

      <div className="container">
        {/* Header */}
        <motion.header
          className="header"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="logo">Gowtham <span className="logo-dot"></span></div>
          <nav className="nav-links">
            {['professional','contact'].map((page) => (
              <a key={page} href={`#${page}`} style={{ position: 'relative' }}
                className={activePage === page ? 'active text-green' : ''}
                onClick={(e) => { e.preventDefault(); setActivePage(page); }}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
                {activePage === page && (
                  <motion.div layoutId="nav-pill" style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '2px', background: 'var(--accent-green)' }} />
                )}
              </a>
            ))}
            <button className="lang-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              English
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </nav>
        </motion.header>

        <AnimatePresence mode="wait">

          {/* ══ Professional ══ */}
          {activePage === 'professional' && (
            <motion.div key="professional" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>

              {/* Hero */}
              <section className="hero">
                <div className="hero-content">
                  <motion.div className="hero-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
                    Software Engineer &amp; AI Enthusiast
                  </motion.div>
                  <motion.h1 className="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}>
                    Hello I'm<br />
                    <span className="text-green"><TypewriterText text="Gowtham Reddy" /></span>
                  </motion.h1>
                  <motion.p className="hero-desc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.52 }}>
                    CS Undergraduate @ Amrita Vishwa Vidyapeetham | AI/ML, NLP &amp; Full-Stack Web Development | Passionate about solving practical problems using scalable and intelligent technologies.
                  </motion.p>
                  <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.66 }}>
                    <motion.button className="btn-outline" onClick={() => setActivePage('resume')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                      VIEW CV &gt;
                    </motion.button>
                    <div className="social-icons">
                      {[
                        { href: 'https://www.linkedin.com/in/gowtham-reddy-peddireddy-5038bb319/', label: 'IN' },
                        { href: 'https://github.com/gowthamreddy285', label: 'GH' },
                      ].map((s, i) => (
                        <motion.a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-icon"
                          whileHover={{ y: -4, rotate: 8 }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.76 + i * 0.1, type: 'spring', stiffness: 300 }}
                        >{s.label}</motion.a>
                      ))}
                      <motion.a href="mailto:gowthamreddy285@gmail.com" className="social-icon"
                        whileHover={{ y: -4, rotate: 8 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.96, type: 'spring', stiffness: 300 }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </motion.a>
                    </div>
                  </motion.div>
                </div>

                <motion.div className="hero-graphic"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="hero-circle"></div>
                  <div className="hero-inner-circle">
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
                    </svg>
                  </div>
                </motion.div>
              </section>

              {/* Stats */}
              <FadeUp>
                <div className="stats-row">
                  {[['4+','Major Projects\nBuilt'],['5+','Languages &\nFrameworks'],['3+','AI & ML\nSystems']].map(([num, label], i) => (
                    <motion.div key={i} className="stat-item"
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                    >
                      <span className="stat-number">{num}</span>
                      <span className="stat-label">{label.replace('\\n','\n')}</span>
                    </motion.div>
                  ))}
                </div>
              </FadeUp>

              {/* Bento */}
              <FadeUp delay={0.1}><h2 className="section-title-center">Short Profile</h2></FadeUp>
              <div className="bento-grid">
                <motion.div className="bento-card col-2" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,255,136,0.08)', borderColor: 'rgba(0,255,136,0.3)' }}
                >
                  <div style={{ padding: '2rem', position: 'relative', zIndex: 2 }}>
                    <h3 style={{ fontSize: '2rem', maxWidth: '450px', marginBottom: '2rem' }}>Building intelligent AI systems and scalable full-stack applications.</h3>
                    <div>
                      <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Core Interests</p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        {['Artificial Intelligence & Machine Learning','Natural Language Processing (NLP)','Retrieval-Augmented Generation (RAG)','Distributed Systems & Web Architecture'].map((item, i) => (
                          <li key={i} style={{ marginBottom: i < 3 ? '0.5rem' : 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: 'var(--accent-green)' }}>▹</span> {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <svg className="abstract-graphic" width="250" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.3, zIndex: 1 }} fill="none" stroke="var(--accent-green)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M100 20 L180 60 L180 140 L100 180 L20 140 L20 60 Z" strokeWidth="2"/>
                    {[['100','20'],['180','60'],['180','140'],['100','180'],['20','140'],['20','60']].map(([x,y],i) => (
                      <g key={i}><line x1={x} y1={y} x2="100" y2="100"/><circle cx={x} cy={y} r="5" fill="var(--accent-green)"/></g>
                    ))}
                    <circle cx="100" cy="100" r="10" fill="var(--accent-green)"/>
                  </svg>
                  <div style={{ background: 'linear-gradient(180deg, transparent, rgba(0, 255, 136, 0.15))', height: '200px', marginTop: 'auto', position: 'relative', zIndex: 2 }}></div>
                </motion.div>

                <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                >
                  <motion.div className="bento-card" whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,255,136,0.08)', borderColor: 'rgba(0,255,136,0.3)' }}><h3>Fluent in English</h3><p className="text-muted">Professional working proficiency.</p></motion.div>
                  <motion.div className="bento-card" style={{ flexGrow: 1 }} whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,255,136,0.08)', borderColor: 'rgba(0,255,136,0.3)' }}>
                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>Comprehensive Tech Stack</p>
                    {[['Python','Java','C++'],['PyTorch','NLP','RAG','OpenCV'],['React','Flask','JS/HTML/CSS']].map((row, i) => (
                      <div key={i} className="pill-group" style={{ marginBottom: i < 2 ? '0.5rem' : 0 }}>
                        {row.map(p => <span key={p} className="pill">{p}</span>)}
                      </div>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div className="bento-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                  whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,255,136,0.08)', borderColor: 'rgba(0,255,136,0.3)' }}
                >
                  <h3>AI/ML Developer &amp; Web Engineer</h3>
                  <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: '40%', height: '8px', background: 'var(--text-secondary)', borderRadius: '4px', marginBottom: '8px' }}></div>
                    <div style={{ width: '80%', height: '8px', background: 'var(--border-color)', borderRadius: '4px' }}></div>
                  </div>
                </motion.div>

                <motion.div className="bento-card col-2" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                  whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,255,136,0.08)', borderColor: 'rgba(0,255,136,0.3)' }}
                >
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>The Inside Scoop</p>
                  <h3>Developing NLP models, RAG architectures,<br/> exploring what's next</h3>
                  <div style={{ marginTop: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#a0a5b5', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                    <span style={{ color: '#8b949e' }}>// Architecting AI & Web solutions</span><br/>
                    <span style={{ color: '#ff7b72' }}>import</span> {'{'} <span style={{ color: '#d2a8ff' }}>NLP, RAG</span> {'}'} <span style={{ color: '#ff7b72' }}>from</span> <span style={{ color: '#a5d6ff' }}>'machine-learning'</span>;<br/>
                    <span style={{ color: '#ff7b72' }}>import</span> {'{'} <span style={{ color: '#d2a8ff' }}>React</span> {'}'} <span style={{ color: '#ff7b72' }}>from</span> <span style={{ color: '#a5d6ff' }}>'frontend'</span>;<br/>
                  </div>
                </motion.div>

                <motion.div className="bento-card col-2 bg-gradient" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <h3>Do you want to ask a question?</h3>
                  <motion.button className="btn-outline"
                    onClick={() => navigator.clipboard.writeText('gowthamreddy285@gmail.com')}
                    style={{ background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy my email address
                  </motion.button>
                </motion.div>

                <motion.div className="bento-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                  whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,255,136,0.08)', borderColor: 'rgba(0,255,136,0.3)' }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <h3 style={{ marginTop: '1rem' }}>Available for internships</h3>
                  </div>
                </motion.div>
              </div>

              {/* Experience */}
              <FadeUp delay={0.1}><h2 className="section-title-center">Education &amp; <span className="text-green">Experience</span></h2></FadeUp>
              <div className="experience-grid">
                {[
                  { icon: '🎓', title: 'B.Tech Computer Science', desc: 'Amrita Vishwa Vidyapeetham, Coimbatore (2023 - 2027). CGPA of 6.5, focusing on AI and software engineering.', glow: '' },
                  { icon: '🛡️', title: 'Cybersecurity Analyst', desc: 'Completed a Cybersecurity Analyst Job Simulation, gaining practical skills in network security, threat monitoring, and vulnerability assessment.', glow: 'alt' },
                  { icon: '🌟', title: 'Event Coordinator', desc: 'Coordinated the Gokulashtami Event in 2025, demonstrating strong leadership, organization, and teamwork skills outside of technical domains.', glow: 'alt' },
                  { icon: '🔬', title: 'Research Intern @ DRDO', desc: 'DRDL Hyderabad (Present). Actively developing advanced Retrieval-Augmented Generation (RAG) systems as part of an AI research internship.', glow: '' },
                ].map((card, i) => (
                  <motion.div key={i} className="experience-card"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5, borderColor: 'rgba(0,255,136,0.3)', boxShadow: '0 16px 40px rgba(0,255,136,0.06)' }}
                  >
                    <div className={`glow-effect ${card.glow}`}></div>
                    <div className="experience-icon">{card.icon}</div>
                    <div className="experience-info"><h3>{card.title}</h3><p>{card.desc}</p></div>
                  </motion.div>
                ))}
              </div>

              {/* Projects */}
              <FadeUp delay={0.1}><h2 className="projects-header">A selection of <span className="text-green">recent projects</span></h2></FadeUp>
              <div className="projects-grid">
                {[
                  { title: 'Evalify -- AI Mock Interview Platform', desc: 'An AI-driven platform evaluating candidate responses using NLP techniques, grammar, clarity, and communication metrics. Features automated feedback generation and customized interviews.', icons: ['AI','NL','Py'], link: 'https://github.com/gowthamreddy285/Evalify' },
                  { title: 'Equipoise -- RAG Claim Verification', desc: 'Built a RAG system for biomedical scientific claim verification using Dense Retrieval, BM25, and Hybrid Search. Implemented semantic search, reranking, and structured evidence synthesis.', icons: ['Py','RG','ML'], link: 'https://github.com/kireeti-ai/equipoise-rag' },
                  { title: 'Shadow Canvas', desc: 'Collaborative digital workspace supporting concurrent multi-user editing with low-latency synchronization, distributed state management, and real-time communication.', icons: ['Re','Js','Nd'], link: 'https://github.com/Dinesh-1208/shadowCanvas' },
                  { title: 'Smart Industry Helmet', desc: 'Designed a smart helmet using STM32 to improve worker safety by detecting falls, monitoring hazardous gases, and generating real-time Bluetooth alerts.', icons: ['C++','IoT','BT'], link: null },
                ].map((proj, i) => (
                  <motion.div key={i} className="project-card"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(0,255,136,0.1)', borderColor: 'rgba(0,255,136,0.4)' }}
                  >
                    <div className="project-info">
                      <h3 className="project-title">{proj.title}</h3>
                      <p className="project-desc">{proj.desc}</p>
                      <div className="project-footer">
                        <div className="tech-icons">{proj.icons.map(ic => <span key={ic} className="tech-icon">{ic}</span>)}</div>
                        {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="project-link">Github <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══ Contact ══ */}
          {activePage === 'contact' && (
            <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="contact-form">
              <h2>Get in Touch</h2>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Name</label><input type="text" className="form-input" placeholder="Your secret identity" /></div>
                <div className="form-group"><label className="form-label">Email Address</label><input type="email" className="form-input" placeholder="I promise I won't spam you" /></div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}><label className="form-label">Content</label><textarea className="form-input" rows="6" placeholder="Your message goes here. Ask me anything 👀"></textarea></div>
              <motion.button className="btn-submit" whileHover={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }} whileTap={{ scale: 0.98 }}>Send Email &rarr;</motion.button>
              <div className="email-copy-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Email: gowthamreddy285@gmail.com
                </div>
                <button className="icon-btn" aria-label="Copy Email" onClick={() => navigator.clipboard.writeText('gowthamreddy285@gmail.com')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* ══ Resume ══ */}
          {activePage === 'resume' && (
            <motion.div key="resume" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="resume-page">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <motion.button className="back-btn" style={{ marginBottom: 0 }} onClick={() => setActivePage('professional')} whileHover={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>&larr; Back to Portfolio</motion.button>
                <a href="/resume.pdf" download="Gowtham_Reddy_Resume.pdf" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download Original PDF
                </a>
              </div>
              <div className="resume-header">
                <h1>Gowtham Reddy Peddireddy</h1>
                <p>B.Tech Student in Computer Science | Amrita Vishwa Vidyapeetham</p>
                <div className="resume-contact">
                  <a href="mailto:gowthamreddy285@gmail.com">gowthamreddy285@gmail.com</a>
                  <span>6362406260</span>
                  <a href="https://www.linkedin.com/in/gowtham-reddy-peddireddy-5038bb319/" target="_blank" rel="noreferrer">LinkedIn</a>
                  <a href="https://github.com/gowthamreddy285" target="_blank" rel="noreferrer">GitHub</a>
                </div>
              </div>
              <div className="resume-section"><h2>Summary</h2><p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Computer Science undergraduate at Amrita Vishwa Vidyapeetham with strong interest in Artificial Intelligence, Machine Learning, and Software Development. Skilled in Python, Java, Data Structures and Algorithms, and full-stack web development. Currently building AI-powered systems involving NLP, Retrieval-Augmented Generation (RAG), semantic evaluation, and real-time collaboration platforms.</p></div>
              <div className="resume-section"><h2>Experience</h2><div className="resume-item"><div className="resume-item-header"><span className="resume-item-title">Research Intern &ndash; DRDO (DRDL Hyderabad)</span><span className="resume-item-date">Present</span></div><p>Working as a research intern focusing on Artificial Intelligence. Actively developing and implementing advanced RAG architectures to improve information retrieval and semantic understanding.</p></div></div>
              <div className="resume-section"><h2>Education</h2>
                <div className="resume-item"><div className="resume-item-header"><span className="resume-item-title">Amrita Vishwa Vidyapeetham, Coimbatore</span><span className="resume-item-date">2023 &ndash; 2027 (Expected)</span></div><div className="resume-item-subtitle">Bachelor of Technology in Computer Science</div><p>CGPA: 6.5</p></div>
                <div className="resume-item"><div className="resume-item-header"><span className="resume-item-title">FIITJEE Junior College</span><span className="resume-item-date">2021 &ndash; 2023</span></div><div className="resume-item-subtitle">Intermediate Education (Science and Mathematics)</div><p>Percentage: 92.4%</p></div>
                <div className="resume-item"><div className="resume-item-header"><span className="resume-item-title">Coorg Public School, Gonikoppal</span><span className="resume-item-date">Completed 2021</span></div><div className="resume-item-subtitle">Secondary Education (CISCE Class X)</div><p>Percentage: 89.5%</p></div>
              </div>
              <div className="resume-section"><h2>Skills</h2><div className="resume-skills-grid">
                <div><div className="resume-skill-category">Programming Languages</div><div className="resume-skill-list">Python, Java, C++</div></div>
                <div><div className="resume-skill-category">Web Development</div><div className="resume-skill-list">HTML, CSS, JavaScript, React, Flask</div></div>
                <div><div className="resume-skill-category">AI / ML</div><div className="resume-skill-list">NLP, RAG, Sentence Transformers</div></div>
                <div><div className="resume-skill-category">Libraries / Frameworks</div><div className="resume-skill-list">PyTorch, OpenCV</div></div>
                <div><div className="resume-skill-category">Core Concepts</div><div className="resume-skill-list">Data Structures, Algorithms, Computer Networks</div></div>
                <div><div className="resume-skill-category">Developer Tools</div><div className="resume-skill-list">Git, GitHub, VS Code</div></div>
              </div></div>
              <div className="resume-section"><h2>Projects</h2>
                <div className="resume-item"><div className="resume-item-header"><span className="resume-item-title">Evalify &ndash; AI-Powered Mock Interview Platform</span></div><p>AI-driven mock interview platform evaluating responses using NLP with metrics for grammar, correctness, clarity, and communication quality.</p></div>
                <div className="resume-item"><div className="resume-item-header"><span className="resume-item-title">Equipoise &ndash; Biomedical Claim Verification using RAG</span></div><p>RAG system for biomedical claim verification using the SciFact dataset with Dense Retrieval, BM25, Hybrid Search, and Query Reformulation.</p></div>
                <div className="resume-item"><div className="resume-item-header"><span className="resume-item-title">Smart Industry Helmet Using STM32</span></div><p>Smart helmet for worker safety detecting falls, monitoring hazardous gas levels, and sending real-time alerts via buzzer, vibration, and Bluetooth.</p></div>
                <div className="resume-item"><div className="resume-item-header"><span className="resume-item-title">Shadow Canvas &ndash; Real-Time Collaborative Workspace</span></div><p>Collaborative workspace with concurrent multi-user editing, low-latency synchronization, and real-time communication.</p></div>
              </div>
              <div className="resume-section"><h2>Extracurricular &amp; Certifications</h2>
                <div className="resume-item"><div className="resume-item-header"><span className="resume-item-title">Gokulashtami Event Coordinator</span><span className="resume-item-date">2025</span></div></div>
                <div className="resume-item"><div className="resume-item-header"><span className="resume-item-title">Cybersecurity Analyst Job Simulation</span></div></div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Bottom Navigation Dock ── */}
      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}

export default App;