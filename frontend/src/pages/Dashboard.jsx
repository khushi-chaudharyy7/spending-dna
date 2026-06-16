import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [form, setForm] = useState({ title: '', amount: '', date: '', type: 'debit', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const [txRes, anlRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/transactions/analyze').catch(() => null)
      ])
      setTransactions(txRes.data)
      if (anlRes) setAnalysis(anlRes.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchData() }, [])

  const handleAdd = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      await api.post('/transactions', { ...form, amount: parseFloat(form.amount) })
      setForm({ title: '', amount: '', date: '', type: 'debit', notes: '' })
      fetchData()
    } catch (err) { setError(err.response?.data?.message || 'Failed to add') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    try { await api.delete(`/transactions/${id}`); fetchData() }
    catch (err) { console.error(err) }
  }

  const totalSpent = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const totalIncome = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)

  const stats = [
    { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, color: '#ff6b6b' },
    { label: 'Total Income', value: `₹${totalIncome.toLocaleString()}`, color: '#34d399' },
    { label: 'Health Score', value: analysis ? `${analysis.health_score}/100` : '—', color: '#34d399' },
    { label: 'Top Category', value: analysis?.top_category || '—', color: '#fbbf24' },
  ]

  const inputStyle = { padding: '10px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e4ea', fontSize: '13px', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', transition: 'border-color 0.2s' }

  return (
    <div style={{ minHeight: '100vh', background: '#080a0f', color: '#e2e4ea', fontFamily: "'Inter', sans-serif", display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,300&display=swap');
        .di:focus { border-color:rgba(52,211,153,0.4) !important; }
        .di::placeholder { color:#3a404f; }
        .stat-card { transition:all 0.25s; }
        .stat-card:hover { transform:translateY(-3px); border-color:rgba(255,255,255,0.12) !important; background:rgba(255,255,255,0.04) !important; }
        .tx-row { transition:background 0.15s; }
        .tx-row:hover { background:rgba(255,255,255,0.025) !important; }
        .del-btn { background:transparent; border:none; color:#3a404f; cursor:pointer; font-size:18px; transition:color 0.2s; padding:0; }
        .del-btn:hover { color:#ff6b6b; }
        .add-btn { width:100%; padding:11px; background:#34d399; border:none; border-radius:8px; color:#080a0f; font-size:13px; font-weight:600; font-family:'Inter',sans-serif; cursor:pointer; transition:all 0.25s; }
        .add-btn:hover { opacity:0.88; transform:translateY(-1px); box-shadow:0 6px 20px rgba(52,211,153,0.25); }
        .add-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        .dna-banner { transition:all 0.25s; }
        .dna-banner:hover { border-color:rgba(52,211,153,0.25) !important; }
      `}</style>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, padding: '40px 48px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '5px', color: '#f0f2f6' }}>
            Hey, {user?.name?.split(' ')[0]}
          </h1>
          <p style={{ color: '#3a404f', fontSize: '13px', fontWeight: 300 }}>Here's your financial overview</p>
        </div>

        <div style={{ display: 'flex', gap: '14px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card" style={{ flex: 1, minWidth: '150px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#3a404f', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>{s.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: s.color, letterSpacing: '-1px', lineHeight: 1 }}>{s.value}</div>
              </div>
              <div style={{ height: '1.5px', width: '36%', borderRadius: '2px', background: s.color, opacity: 0.35, marginTop: '16px' }} />
            </div>
          ))}
        </div>

        {analysis?.personality && (
          <div className="dna-banner" style={{ background: 'rgba(52,211,153,0.03)', border: '1px solid rgba(52,211,153,0.12)', borderRadius: '14px', padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#34d399', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Your Spending DNA</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#f0f2f6', marginBottom: '3px', letterSpacing: '-0.5px' }}>{analysis.personality.type}</div>
              <div style={{ color: '#3a404f', fontSize: '13px', fontWeight: 300 }}>{analysis.personality.description}</div>
            </div>
            <button onClick={() => navigate('/dna')} style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.18)', color: '#34d399', padding: '9px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(52,211,153,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(52,211,153,0.08)'}>
              Full Analysis →
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: '#f0f2f6', letterSpacing: '-0.3px' }}>Add Transaction</h2>
            {error && <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.15)', borderRadius: '8px', padding: '9px 13px', color: '#ff6b6b', fontSize: '12px', marginBottom: '14px' }}>{error}</div>}
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input className="di" placeholder="Title (e.g. Starbucks)" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input className="di" placeholder="Amount (₹)" type="number" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                <input className="di" type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
              </div>
              <select className="di" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                <option value="debit">Debit (Expense)</option>
                <option value="credit">Credit (Income)</option>
              </select>
              <input className="di" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
              <button className="add-btn" type="submit" disabled={loading}>{loading ? 'Adding...' : '+ Add Transaction'}</button>
            </form>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: '#f0f2f6', letterSpacing: '-0.3px' }}>Recent Transactions</h2>
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#3a404f', padding: '40px 0', fontSize: '13px', fontWeight: 300 }}>No transactions yet. Add your first one!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
                {transactions.slice(0, 12).map(t => (
                  <div key={t._id} className="tx-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 13px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '9px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#dde1ea' }}>{t.title}</div>
                      <div style={{ fontSize: '11px', color: '#3a404f', marginTop: '2px' }}>{t.category} · {new Date(t.date).toLocaleDateString('en-IN')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: t.type === 'credit' ? '#34d399' : '#ff6b6b' }}>{t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}</span>
                      <button className="del-btn" onClick={() => handleDelete(t._id)}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}