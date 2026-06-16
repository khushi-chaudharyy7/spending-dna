import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await api.post('/auth/signup', form)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) { setError(err.response?.data?.message || 'Something went wrong') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: '24px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,300&display=swap');
        .auth-input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:9px; color:#e2e4ea; font-size:14px; outline:none; box-sizing:border-box; font-family:'Inter',sans-serif; transition:border-color 0.2s; }
        .auth-input:focus { border-color:rgba(52,211,153,0.4); }
        .auth-input::placeholder { color:#3a404f; }
        .auth-btn { width:100%; padding:13px; background:#34d399; border:none; border-radius:9px; color:#080a0f; font-size:14px; font-weight:600; font-family:'Inter',sans-serif; cursor:pointer; transition:all 0.25s; }
        .auth-btn:hover { opacity:0.88; transform:translateY(-1px); box-shadow:0 6px 24px rgba(52,211,153,0.25); }
        .auth-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
      `}</style>
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div onClick={() => navigate('/')} style={{ fontSize: '20px', fontWeight: 700, cursor: 'pointer', display: 'inline-block', color: '#f0f2f6', letterSpacing: '-0.5px' }}>
            spending<span style={{ color: '#34d399' }}>DNA</span>
          </div>
          <p style={{ color: '#3a404f', marginTop: '8px', fontSize: '13px', fontWeight: 300 }}>Discover your financial personality</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '36px' }}>
          {error && <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.15)', borderRadius: '8px', padding: '10px 14px', color: '#ff6b6b', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map((field, i) => (
              <div key={field.key} style={{ marginBottom: i === 2 ? '28px' : '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#4a5568', marginBottom: '7px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{field.label}</label>
                <input className="auth-input" type={field.type} required value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} />
              </div>
            ))}
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account →'}</button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#3a404f', fontSize: '13px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}