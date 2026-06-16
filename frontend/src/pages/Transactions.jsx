import { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../utils/api'

const CATEGORIES = ['Food & Beverage', 'Shopping', 'Transport', 'Entertainment', 'Subscriptions', 'Health & Fitness', 'Rent & Utilities', 'Education', 'Travel', 'Other']

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [filtered, setFiltered] = useState([])
  const [form, setForm] = useState({ title: '', amount: '', date: '', type: 'debit', category: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [csvLoading, setCsvLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState({ category: '', type: '' })
  const [search, setSearch] = useState('')
  const fileRef = useRef()

  const fetchTransactions = async () => {
    try { const res = await api.get('/transactions'); setTransactions(res.data); setFiltered(res.data) }
    catch (err) { console.error(err) }
  }

  useEffect(() => { fetchTransactions() }, [])

  useEffect(() => {
    let result = [...transactions]
    if (search) result = result.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    if (filter.category) result = result.filter(t => t.category === filter.category)
    if (filter.type) result = result.filter(t => t.type === filter.type)
    setFiltered(result)
  }, [search, filter, transactions])

  const handleAdd = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      await api.post('/transactions', { ...form, amount: parseFloat(form.amount) })
      setForm({ title: '', amount: '', date: '', type: 'debit', category: '', notes: '' })
      setSuccess('Transaction added!'); setTimeout(() => setSuccess(''), 3000)
      fetchTransactions()
    } catch (err) { setError(err.response?.data?.message || 'Failed to add') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    try { await api.delete(`/transactions/${id}`); fetchTransactions() }
    catch (err) { console.error(err) }
  }

  const handleCSV = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setCsvLoading(true); setError('')
    try {
      const formData = new FormData(); formData.append('file', file)
      const res = await api.post('/transactions/upload-csv', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSuccess(res.data.message); setTimeout(() => setSuccess(''), 4000)
      fetchTransactions()
    } catch (err) { setError(err.response?.data?.message || 'CSV upload failed') }
    finally { setCsvLoading(false); fileRef.current.value = '' }
  }

  const totalSpent = filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const totalIncome = filtered.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const iStyle = { padding: '9px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e4ea', fontSize: '13px', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', width: '100%', transition: 'border-color 0.2s' }

  return (
    <div style={{ minHeight: '100vh', background: '#080a0f', color: '#e2e4ea', fontFamily: "'Inter', sans-serif", display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,300&display=swap');
        .fi:focus { border-color:rgba(52,211,153,0.4) !important; }
        .fi::placeholder { color:#3a404f; }
        .add-btn { width:100%; padding:11px; background:#34d399; border:none; border-radius:8px; color:#080a0f; font-size:13px; font-weight:600; font-family:'Inter',sans-serif; cursor:pointer; transition:all 0.25s; margin-top:4px; }
        .add-btn:hover { opacity:0.88; transform:translateY(-1px); box-shadow:0 6px 20px rgba(52,211,153,0.25); }
        .add-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        .csv-btn { background:rgba(52,211,153,0.07); border:1px solid rgba(52,211,153,0.18); color:#34d399; padding:9px 18px; border-radius:8px; cursor:pointer; font-size:13px; font-family:'Inter',sans-serif; transition:all 0.2s; }
        .csv-btn:hover { background:rgba(52,211,153,0.12); }
        .tx-row { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 36px; padding:13px 18px; align-items:center; border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.15s; }
        .tx-row:last-child { border-bottom:none; }
        .tx-row:hover { background:rgba(255,255,255,0.02); }
        .del-btn { background:transparent; border:none; color:#3a404f; cursor:pointer; font-size:17px; transition:color 0.2s; padding:0; }
        .del-btn:hover { color:#ff6b6b; }
      `}</style>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, padding: '40px 48px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '5px', color: '#f0f2f6' }}>Transactions</h1>
            <p style={{ color: '#3a404f', fontSize: '13px', fontWeight: 300 }}>Manage and filter all your transactions</p>
          </div>
          <div>
            <input type="file" accept=".csv" ref={fileRef} onChange={handleCSV} style={{ display: 'none' }} />
            <button className="csv-btn" onClick={() => fileRef.current.click()} disabled={csvLoading}>{csvLoading ? 'Uploading...' : '↑ Upload CSV'}</button>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.15)', borderRadius: '9px', padding: '10px 14px', color: '#ff6b6b', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.18)', borderRadius: '9px', padding: '10px 14px', color: '#34d399', fontSize: '13px', marginBottom: '16px' }}>{success}</div>}

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '9px', padding: '10px 14px', fontSize: '12px', color: '#3a404f', marginBottom: '28px' }}>
          CSV format: <span style={{ color: '#4a5568' }}>title, amount, date (YYYY-MM-DD), type (debit/credit), category (optional)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '22px', position: 'sticky', top: '40px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '18px', color: '#f0f2f6', letterSpacing: '-0.3px' }}>Add Transaction</h2>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input className="fi" placeholder="Title (e.g. Zomato)" type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={iStyle} />
              <input className="fi" placeholder="Amount (₹)" type="number" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={iStyle} />
              <input className="fi" type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={iStyle} />
              <select className="fi" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={iStyle}>
                <option value="debit">Debit (Expense)</option>
                <option value="credit">Credit (Income)</option>
              </select>
              <select className="fi" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={iStyle}>
                <option value="">Auto-categorize</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="fi" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={iStyle} />
              <button className="add-btn" type="submit" disabled={loading}>{loading ? 'Adding...' : '+ Add Transaction'}</button>
            </form>
          </div>

          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {[
                { label: 'Showing', value: filtered.length, color: '#e2e4ea' },
                { label: 'Spent', value: `₹${totalSpent.toLocaleString()}`, color: '#ff6b6b' },
                { label: 'Income', value: `₹${totalIncome.toLocaleString()}`, color: '#34d399' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '9px', padding: '10px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#3a404f', fontSize: '12px' }}>{s.label}</span>
                  <span style={{ color: s.color, fontWeight: 600, fontSize: '13px' }}>{s.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <input className="fi" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...iStyle, width: '200px' }} />
              <select className="fi" value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })} style={{ ...iStyle, width: '170px' }}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="fi" value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })} style={{ ...iStyle, width: '130px' }}>
                <option value="">All Types</option>
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
              {(search || filter.category || filter.type) && (
                <button onClick={() => { setSearch(''); setFilter({ category: '', type: '' }) }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#4a5568', padding: '9px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontFamily: "'Inter',sans-serif" }}>Clear</button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', color: '#3a404f', fontSize: '13px', fontWeight: 300 }}>No transactions found.</div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 36px', padding: '11px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '10px', color: '#3a404f', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  <span>Title</span><span>Category</span><span>Date</span><span>Amount</span><span></span>
                </div>
                {filtered.map(t => (
                  <div key={t._id} className="tx-row">
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#dde1ea' }}>{t.title}</div>
                      {t.notes && <div style={{ fontSize: '11px', color: '#3a404f', marginTop: '2px' }}>{t.notes}</div>}
                    </div>
                    <div><span style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '5px', padding: '2px 8px', fontSize: '11px', color: '#34d399' }}>{t.category}</span></div>
                    <div style={{ fontSize: '12px', color: '#3a404f' }}>{new Date(t.date).toLocaleDateString('en-IN')}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: t.type === 'credit' ? '#34d399' : '#ff6b6b' }}>{t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}</div>
                    <button className="del-btn" onClick={() => handleDelete(t._id)}>×</button>
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