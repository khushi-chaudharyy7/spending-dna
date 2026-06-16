import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Dashboard', icon: '▦', path: '/dashboard' },
  { label: 'Transactions', icon: '↕', path: '/transactions' },
  { label: 'My DNA', icon: '◈', path: '/dna' },
  { label: 'Recommendations', icon: '✦', path: '/recommendations' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div style={{ width: '220px', minHeight: '100vh', background: 'rgba(255,255,255,0.015)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '28px 14px', boxSizing: 'border-box', position: 'fixed', top: 0, left: 0, zIndex: 100, backdropFilter: 'blur(12px)', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ fontSize: '16px', fontWeight: 700, padding: '0 10px', marginBottom: '36px', color: '#f0f2f6', letterSpacing: '-0.5px' }}>
        spending<span style={{ color: '#34d399' }}>DNA</span>
      </div>
      <nav style={{ flex: 1 }}>
        {navItems.map(item => {
          const active = location.pathname === item.path
          return (
            <div key={item.path} onClick={() => navigate(item.path)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '9px', marginBottom: '3px', cursor: 'pointer', background: active ? 'rgba(52,211,153,0.08)' : 'transparent', color: active ? '#34d399' : '#4a5568', fontSize: '13px', fontWeight: active ? 500 : 400, border: active ? '1px solid rgba(52,211,153,0.15)' : '1px solid transparent', transition: 'all 0.2s' }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#e2e4ea' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#4a5568' }}>
              <span style={{ fontSize: '13px', opacity: 0.7 }}>{item.icon}</span>
              {item.label}
            </div>
          )
        })}
      </nav>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
        <div style={{ padding: '0 10px', marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', color: '#e2e4ea', fontWeight: 500 }}>{user?.name}</div>
          <div style={{ fontSize: '11px', color: '#3a404f', marginTop: '2px' }}>{user?.email}</div>
        </div>
        <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '9px', cursor: 'pointer', color: '#4a5568', fontSize: '13px', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'}
          onMouseLeave={e => e.currentTarget.style.color = '#4a5568'}>
          <span>→</span> Logout
        </div>
      </div>
    </div>
  )
}