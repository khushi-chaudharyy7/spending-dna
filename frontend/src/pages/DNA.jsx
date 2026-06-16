import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../utils/api'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const COLORS = ['#34d399', '#6ee7b7', '#fbbf24', '#fb923c', '#a78bfa', '#f472b6', '#38bdf8', '#e879f9']

const HealthRing = ({ score }) => {
  const radius = 68
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#ff6b6b'
  return (
    <div style={{ position: 'relative', width: '176px', height: '176px', margin: '0 auto' }}>
      <svg width="176" height="176" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="88" cy="88" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle cx="88" cy="88" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <div style={{ fontSize: '34px', fontWeight: 800, color, letterSpacing: '-2px' }}>{score}</div>
        <div style={{ fontSize: '11px', color: '#3a404f' }}>/ 100</div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 13px', fontSize: '12px' }}>
        <div style={{ color: '#34d399', fontWeight: 600 }}>{payload[0].name}</div>
        <div style={{ color: '#e2e4ea' }}>₹{payload[0].value?.toLocaleString()}</div>
      </div>
    )
  }
  return null
}

export default function DNA() {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/transactions/analyze')
      .then(res => setAnalysis(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const categoryData = analysis?.category_breakdown ? Object.entries(analysis.category_breakdown).map(([name, value]) => ({ name, value })) : []
  const radarData = analysis ? [
    { subject: 'Consistency', A: Math.max(0, 100 - analysis.spending_spikes * 15) },
    { subject: 'Discipline', A: Math.max(0, 100 - analysis.weekend_spend_ratio) },
    { subject: 'Awareness', A: analysis.health_score },
    { subject: 'Balance', A: Math.max(0, 100 - (analysis.late_night_spend_ratio || 0)) },
    { subject: 'Planning', A: Math.max(0, 100 - (categoryData.length > 0 ? (categoryData[0]?.value / analysis.total_spent * 100) : 0)) },
  ] : []

  const card = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }

  return (
    <div style={{ minHeight: '100vh', background: '#080a0f', color: '#e2e4ea', fontFamily: "'Inter', sans-serif", display: 'flex' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,300&display=swap');`}</style>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, padding: '40px 48px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '5px', color: '#f0f2f6' }}>Your Spending DNA</h1>
          <p style={{ color: '#3a404f', fontSize: '13px', fontWeight: 300 }}>Full behavioral analysis of your financial patterns</p>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '80px', color: '#3a404f', fontSize: '13px', fontWeight: 300 }}>Analyzing your spending patterns...</div>}
        {error && <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.15)', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#ff6b6b', fontSize: '13px' }}>{error === 'No transactions found' ? 'Add some transactions first to see your DNA analysis!' : error}</div>}

        {analysis && !loading && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ ...card, gridColumn: 'span 2', background: 'rgba(52,211,153,0.025)', border: '1px solid rgba(52,211,153,0.1)', display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#34d399', marginBottom: '8px' }}>Spending Personality</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '10px', color: '#f0f2f6' }}>{analysis.personality.type}</div>
                  <div style={{ color: '#4a5568', fontSize: '13px', lineHeight: 1.7, maxWidth: '380px', fontWeight: 300 }}>{analysis.personality.description}</div>
                  <div style={{ display: 'flex', gap: '28px', marginTop: '20px' }}>
                    {[
                      { label: 'Total Spent', value: `₹${analysis.total_spent.toLocaleString()}`, color: '#ff6b6b' },
                      { label: 'Avg Transaction', value: `₹${Math.round(analysis.avg_transaction).toLocaleString()}`, color: '#fbbf24' },
                      { label: 'Weekend Spend', value: `${analysis.weekend_spend_ratio}%`, color: '#38bdf8' },
                    ].map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: '10px', color: '#3a404f', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: s.color, letterSpacing: '-0.5px', lineHeight: 1 }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '10px', color: '#3a404f', marginBottom: '18px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Health Score</div>
                <HealthRing score={analysis.health_score} />
                <div style={{ marginTop: '14px', fontSize: '12px', fontWeight: 600, color: analysis.health_score >= 70 ? '#34d399' : analysis.health_score >= 40 ? '#fbbf24' : '#ff6b6b' }}>
                  {analysis.health_score >= 70 ? 'Great Shape' : analysis.health_score >= 40 ? 'Needs Attention' : 'At Risk'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={card}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#f0f2f6', letterSpacing: '-0.2px' }}>Spending by Category</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie><Tooltip content={<CustomTooltip />} /></PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
                  {categoryData.map((item, i) => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                      <span style={{ color: '#4a5568' }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={card}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#f0f2f6', letterSpacing: '-0.2px' }}>Behavioral Profile</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#3a404f', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="A" stroke="#34d399" fill="#34d399" fillOpacity={0.1} strokeWidth={1.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {categoryData.length > 0 && (
              <div style={{ ...card, marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#f0f2f6', letterSpacing: '-0.2px' }}>Category Breakdown</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={categoryData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fill: '#3a404f', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#3a404f', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                      {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div style={card}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '18px', color: '#f0f2f6', letterSpacing: '-0.2px' }}>Behavioral Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {analysis.insights.map((insight, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '13px 16px', background: 'rgba(52,211,153,0.025)', border: '1px solid rgba(52,211,153,0.08)', borderRadius: '10px' }}>
                    <span style={{ color: '#34d399', fontSize: '13px', marginTop: '1px', flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: '13px', lineHeight: 1.7, color: '#4a5568', fontWeight: 300 }}>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}