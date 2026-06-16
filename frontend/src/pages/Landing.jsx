import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const canvasRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setVisible(true), 120)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight
    let animId
    const blobs = [
      { x: 0.15, y: 0.25, vx: 0.0005, vy: 0.0003, r: 0.42, h: 220, s: 0.08, l: 0.12 },
      { x: 0.78, y: 0.5,  vx: -0.0004, vy: 0.0005, r: 0.38, h: 230, s: 0.06, l: 0.10 },
      { x: 0.5,  y: 0.85, vx: 0.0003,  vy: -0.0004, r: 0.35, h: 210, s: 0.07, l: 0.11 },
      { x: 0.88, y: 0.12, vx: -0.0006, vy: 0.0004,  r: 0.28, h: 225, s: 0.05, l: 0.09 },
    ]
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      blobs.forEach(b => {
        b.x += b.vx; b.y += b.vy
        if (b.x < 0 || b.x > 1) b.vx *= -1
        if (b.y < 0 || b.y > 1) b.vy *= -1
        const cx = b.x * width, cy = b.y * height, r = b.r * Math.max(width, height)
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, `hsla(${b.h},${b.s*100}%,${b.l*100}%,0.75)`)
        g.addColorStop(0.5, `hsla(${b.h},${b.s*100}%,${b.l*100}%,0.2)`)
        g.addColorStop(1, `hsla(${b.h},${b.s*100}%,${b.l*100}%,0)`)
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => {
    const reveals = sectionRef.current?.querySelectorAll('.reveal')
    if (!reveals) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    reveals.forEach(r => obs.observe(r))
    return () => obs.disconnect()
  }, [])

  const profiles = [
    { type: 'Impulse Spender', desc: 'High-frequency unplanned purchases driven by emotion' },
    { type: 'Night Owl Spender', desc: 'Late-night purchase patterns, often impulse-driven' },
    { type: 'Balanced Saver', desc: 'Consistent, mindful spending with long-term awareness' },
    { type: 'Subscription Hoarder', desc: 'Recurring charges accumulating silently each month' },
    { type: 'Weekend Overspender', desc: 'Spending spikes concentrated on weekends' },
    { type: 'Lifestyle Buyer', desc: 'Identity-driven purchasing behavior and brand affinity' },
  ]

  const f = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0px)' : 'translateY(24px)',
    transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`
  })

  return (
    <div style={{ minHeight: '100vh', background: '#080a0f', color: '#e2e4ea', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,300;1,14..32,400&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        ::selection { background:rgba(52,211,153,0.15); }
        .nbtn { background:transparent; border:1px solid rgba(255,255,255,0.1); color:#6b7280; padding:8px 18px; border-radius:7px; cursor:pointer; font-size:13px; font-family:'Inter',sans-serif; font-weight:400; transition:all 0.25s; }
        .nbtn:hover { border-color:rgba(52,211,153,0.4); color:#34d399; }
        .nbtn-s { background:#34d399; border:none; color:#080a0f; padding:8px 18px; border-radius:7px; cursor:pointer; font-size:13px; font-weight:600; font-family:'Inter',sans-serif; transition:all 0.25s; }
        .nbtn-s:hover { opacity:0.88; transform:translateY(-1px); box-shadow:0 4px 20px rgba(52,211,153,0.3); }
        .hbtn { background:#34d399; border:none; color:#080a0f; padding:13px 34px; border-radius:9px; cursor:pointer; font-size:14px; font-weight:600; font-family:'Inter',sans-serif; transition:all 0.3s; }
        .hbtn:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(52,211,153,0.3); }
        .hbtn-g { background:transparent; border:1px solid rgba(255,255,255,0.1); color:#6b7280; padding:13px 34px; border-radius:9px; cursor:pointer; font-size:14px; font-family:'Inter',sans-serif; transition:all 0.25s; }
        .hbtn-g:hover { border-color:rgba(255,255,255,0.2); color:#e2e4ea; transform:translateY(-1px); }
        .stat-box { flex:1; padding:24px 20px; text-align:center; border-right:1px solid rgba(255,255,255,0.06); transition:background 0.2s; }
        .stat-box:last-child { border-right:none; }
        .stat-box:hover { background:rgba(52,211,153,0.04); }
        .stats-wrap { transition:transform 0.3s, box-shadow 0.3s; }
        .stats-wrap:hover { transform:translateY(-2px); box-shadow:0 8px 40px rgba(52,211,153,0.07); }
        .profile-card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:14px; padding:22px 20px; cursor:default; position:relative; overflow:hidden; transition:all 0.35s cubic-bezier(0.16,1,0.3,1); }
        .profile-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#34d399,#10b981); transform:scaleX(0); transform-origin:left; transition:transform 0.35s cubic-bezier(0.16,1,0.3,1); }
        .profile-card:hover { background:rgba(52,211,153,0.04); border-color:rgba(52,211,153,0.2); transform:translateY(-4px) scale(1.01); box-shadow:0 12px 32px rgba(0,0,0,0.3); }
        .profile-card:hover::after { transform:scaleX(1); }
        .reveal { opacity:0; transform:translateY(24px) scale(0.98); transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
        .reveal.visible { opacity:1; transform:translateY(0) scale(1); }
        .cta-block { transition:transform 0.3s, box-shadow 0.3s; }
        .cta-block:hover { transform:translateY(-2px); }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 60px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,10,15,0.8)', backdropFilter: 'blur(16px)' }}>
        <div style={{ ...f(0), fontSize: '17px', fontWeight: 700, letterSpacing: '-0.5px', color: '#f0f2f6' }}>
          spending<span style={{ color: '#34d399' }}>DNA</span>
        </div>
        <div style={{ ...f(0.05), display: 'flex', gap: '8px' }}>
          <button className="nbtn" onClick={() => navigate('/login')}>Sign in</button>
          <button className="nbtn-s" onClick={() => navigate('/signup')}>Get started</button>
        </div>
      </nav>

      <section style={{ position: 'relative', zIndex: 10, maxWidth: '820px', margin: '0 auto', padding: '100px 48px 110px', textAlign: 'center' }}>
        <div style={{ ...f(0.15), display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.18)', borderRadius: '100px', padding: '5px 16px', marginBottom: '40px', fontSize: '10px', color: '#34d399', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500 }}>
          Behavioral finance intelligence
        </div>

        <h1 style={{ ...f(0.25), fontSize: 'clamp(44px, 7vw, 72px)', lineHeight: 1.04, letterSpacing: '-3px', marginBottom: '24px' }}>
          <span style={{ fontWeight: 800, color: '#f0f2f6' }}>Your spending</span><br />
          <span style={{ fontWeight: 300, color: '#4a5568' }}>has a pattern.</span><br />
          <span style={{ fontWeight: 800, color: '#34d399' }}>We found it.</span>
        </h1>

        <p style={{ ...f(0.35), fontSize: '15px', lineHeight: 1.9, color: '#454c5e', maxWidth: '440px', margin: '0 auto 48px', fontWeight: 300 }}>
          Behind every transaction is a behavior. Spending DNA maps yours — revealing the financial personality you didn't know you had.
        </p>

        <div style={{ ...f(0.42), display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
           <button className="hbtn" onClick={() => navigate('/signup')}>See your pattern →</button>
           <button className="hbtn-g" onClick={() => navigate('/login')}>Sign in</button>
        </div>

        <div className="stats-wrap" style={{ ...f(0.55), display: 'flex', marginTop: '80px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          {[
            { value: '94%', label: 'Categorization accuracy' },
            { value: '6', label: 'Personality profiles' },
            { value: 'Live', label: 'Behavioral insights' },
          ].map((s, i) => (
            <div key={s.label} className="stat-box">
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#f0f2f6', letterSpacing: '-1px', lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#3a404f', letterSpacing: '0.3px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section ref={sectionRef} style={{ position: 'relative', zIndex: 10, maxWidth: '1060px', margin: '0 auto', padding: '20px 48px 120px' }}>
        <div style={{ marginBottom: '52px' }}>
          <h2 className="reveal" style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, color: '#f0f2f6', marginBottom: '10px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Which spender are you?
          </h2>
          <p className="reveal" style={{ color: '#3a404f', fontSize: '13px', fontWeight: 300, transitionDelay: '0.08s' }}>
            Our engine classifies you into one of six behavioral profiles
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '12px' }}>
          {profiles.map((p, i) => (
            <div key={p.type} className="profile-card reveal" style={{ transitionDelay: `${i * 0.07 + 0.1}s` }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#dde1ea', marginBottom: '7px', letterSpacing: '-0.2px' }}>{p.type}</div>
              <div style={{ fontSize: '13px', color: '#3a404f', lineHeight: 1.75, fontWeight: 300 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        <div className="cta-block reveal" style={{ textAlign: 'center', marginTop: '80px', padding: '64px 48px', background: 'rgba(52,211,153,0.02)', border: '1px solid rgba(52,211,153,0.08)', borderRadius: '20px', transitionDelay: '0.3s' }}>
          <h3 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 800, color: '#f0f2f6', marginBottom: '14px', letterSpacing: '-1px' }}>
            Ready to decode your spending?
          </h3>
          <p style={{ color: '#3a404f', fontSize: '14px', lineHeight: 1.8, marginBottom: '36px', fontWeight: 300 }}>
            Upload your transactions and get your financial DNA in seconds.
          </p>
          <button className="hbtn" onClick={() => navigate('/signup')}>Get started free</button>
        </div>
      </section>
    </div>
  )
}