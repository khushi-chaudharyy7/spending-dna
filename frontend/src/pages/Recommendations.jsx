import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../utils/api'

const impactColor = { High: '#ff6b6b', Medium: '#fbbf24', Low: '#34d399' }

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generated, setGenerated] = useState(false)

  const fetchRecommendations = async () => {
    setLoading(true); setError('')
    try {
      const res = await api.get('/recommendations')
      setRecommendations(res.data.recommendations)
      setGenerated(true)
    } catch (err) { setError(err.response?.data?.message || 'Failed to generate') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080a0f', color: '#e2e4ea', fontFamily: "'Inter', sans-serif", display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,300&display=swap');
        .gen-btn { background:#34d399; border:none; color:#080a0f; padding:13px 38px; border-radius:9px; cursor:pointer; font-size:14px; font-weight:600; font-family:'Inter',sans-serif; transition:all 0.3s; }
        .gen-btn:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(52,211,153,0.3); }
        .gen-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        .regen-btn { background:transparent; border:1px solid rgba(255,255,255,0.08); color:#4a5568; padding:8px 18px; border-radius:8px; cursor:pointer; font-size:12px; font-family:'Inter',sans-serif; transition:all 0.2s; }
        .regen-btn:hover { border-color:rgba(255,255,255,0.16); color:#e2e4ea; }
        .rec-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:22px; display:flex; gap:16px; align-items:flex-start; transition:all 0.25s; }
        .rec-card:hover { background:rgba(255,255,255,0.035); border-color:rgba(255,255,255,0.11); transform:translateY(-2px); }
      `}</style>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, padding: '40px 48px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '5px', color: '#f0f2f6' }}>Smart Recommendations</h1>
          <p style={{ color: '#3a404f', fontSize: '13px', fontWeight: 300 }}>AI-powered advice based on your actual spending patterns</p>
        </div>

        {!generated && (
          <div style={{ background: 'rgba(52,211,153,0.02)', border: '1px solid rgba(52,211,153,0.08)', borderRadius: '20px', padding: '72px 48px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: '#f0f2f6', letterSpacing: '-0.8px' }}>Ready to analyze your spending?</h2>
            <p style={{ color: '#3a404f', fontSize: '14px', marginBottom: '36px', maxWidth: '400px', margin: '0 auto 36px', lineHeight: 1.8, fontWeight: 300 }}>
              Our AI will analyze your transaction history and generate personalized recommendations just for you.
            </p>
            <button className="gen-btn" onClick={fetchRecommendations} disabled={loading}>
              {loading ? 'Analyzing your spending...' : 'Generate Recommendations →'}
            </button>
          </div>
        )}

        {error && <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.15)', borderRadius: '10px', padding: '14px 18px', color: '#ff6b6b', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}

        {recommendations.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#3a404f', fontWeight: 300 }}>{recommendations.length} recommendations generated</div>
              <button className="regen-btn" onClick={fetchRecommendations} disabled={loading}>{loading ? 'Regenerating...' : '↺ Regenerate'}</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendations.map((rec, i) => (
                <div key={i} className="rec-card">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f0f2f6', margin: 0, letterSpacing: '-0.3px' }}>{rec.title}</h3>
                      <span style={{
                        background: `rgba(${rec.impact === 'High' ? '255,107,107' : rec.impact === 'Medium' ? '251,191,36' : '52,211,153'},0.08)`,
                        border: `1px solid rgba(${rec.impact === 'High' ? '255,107,107' : rec.impact === 'Medium' ? '251,191,36' : '52,211,153'},0.2)`,
                        color: impactColor[rec.impact], padding: '2px 10px', borderRadius: '100px',
                        fontSize: '10px', fontWeight: 500, letterSpacing: '0.5px'
                      }}>{rec.impact} Impact</span>
                    </div>
                    <p style={{ color: '#4a5568', fontSize: '13px', lineHeight: 1.75, margin: 0, fontWeight: 300 }}>{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}