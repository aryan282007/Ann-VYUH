import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/admin/stats-overview');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Mock data for the area chart
  const chartData = [
    { time: '06:00', queue: 5 },
    { time: '09:00', queue: 25 },
    { time: '12:00', queue: 45 },
    { time: '15:00', queue: 30 },
    { time: '18:00', queue: 10 },
  ];

  if (loading) return <div className="text-center p-10 animate-pulse">डेटा लोड हो रहा है...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Hero Section */}
      <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-primary-dark to-primary p-8 text-white shadow-md">
        {/* If we had hero-countryside.png, it would be an absolute img here with mix-blend-overlay */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">नमस्ते, व्यवस्थापक!</h2>
            <p className="text-primary-light">आज की खरीद स्थिति की निगरानी करें और स्मार्ट पूर्वानुमान का उपयोग करें।</p>
          </div>
          <button className="bg-white text-primary-dark px-4 py-2 rounded-md font-bold shadow-sm hover:bg-gray-50 transition-colors">
            + नया खरीद केंद्र
          </button>
        </div>
      </div>

      {/* 5 Live KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="आज की कुल खरीद" value={`${stats?.totals?.completed || 0} टन`} icon="🌾" />
        <KPICard title="सक्रिय केंद्र" value={stats?.totals?.totalCentres || 0} icon="🏢" />
        <KPICard title="कतार में किसान" value={stats?.totals?.waiting || 0} icon="👨‍🌾" color="text-accent-dark" />
        <KPICard title="औसत प्रतीक्षा" value="45 मिनट" icon="⏱️" />
        <KPICard title="भुगतान लंबित" value="₹18.6 लाख" icon="💸" color="text-danger" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Chart & Table) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-lg p-6 shadow-sm border border-border">
            <h3 className="font-bold text-ink mb-4">कतार और भीड़ की स्थिति (Queue & Congestion)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorQueue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#5B6B5B'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#5B6B5B'}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="queue" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorQueue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-ink">सक्रिय केंद्र (Live Centres)</h3>
              <button className="text-primary text-sm font-bold">सभी देखें &rarr;</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-paper text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">केंद्र का नाम</th>
                    <th className="px-4 py-3 font-medium">जिला</th>
                    <th className="px-4 py-3 font-medium">कतार</th>
                    <th className="px-4 py-3 font-medium">स्थिति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats?.centres?.slice(0, 5).map((c) => (
                    <tr key={c.centre._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-ink">{c.centre.name}</td>
                      <td className="px-4 py-3 text-muted">{c.centre.district}</td>
                      <td className="px-4 py-3 font-bold text-ink">{c.waiting}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          c.waiting > 20 ? 'bg-danger/10 text-danger' : 
                          c.waiting > 10 ? 'bg-accent-light text-accent-dark' : 'bg-primary-light text-primary-dark'
                        }`}>
                          {c.waiting > 20 ? 'अत्यधिक भीड़' : c.waiting > 10 ? 'भीड़ अधिक' : 'सामान्य'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6">
          
          <div className="bg-primary-light rounded-lg p-6 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🤖</div>
            <h3 className="font-bold text-primary-dark mb-2 flex items-center gap-2">
              <span>✨</span> स्मार्ट पूर्वानुमान
            </h3>
            <p className="text-sm text-ink mb-4">
              "Bhopal मंडी" में अगले 60 मिनट में भीड़ बढ़ने की संभावना है। 1 अतिरिक्त तौल कांटा सक्रिय करने की सिफारिश की जाती है।
            </p>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-white py-2 rounded-md font-bold shadow-sm hover:bg-primary-dark transition-colors">
                मंजूर करें (Approve)
              </button>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-6 shadow-sm border border-border">
            <h3 className="font-bold text-ink mb-4">आज की खरीद प्रगति (Funnel)</h3>
            <div className="space-y-4">
              <FunnelStep label="स्लॉट बुक किए गए" value={stats?.totals?.totalBooked || 0} max={stats?.totals?.totalBooked || 1} color="bg-gray-200" />
              <FunnelStep label="केंद्र पहुंचे" value={stats?.totals?.waiting + stats?.totals?.completed} max={stats?.totals?.totalBooked || 1} color="bg-accent" />
              <FunnelStep label="खरीद पूर्ण" value={stats?.totals?.completed || 0} max={stats?.totals?.totalBooked || 1} color="bg-primary" />
            </div>
          </div>

          <div className="bg-surface rounded-lg p-6 shadow-sm border border-border">
            <h3 className="font-bold text-ink mb-4">हाल की गतिविधियाँ (Recent Activity)</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              <ActivityItem text="टोकन MP-BHO-012 की खरीद पूरी हुई" time="अभी" type="success" />
              <ActivityItem text="DelayFlag: इंदौर केंद्र में वजन में देरी" time="10 मिनट पहले" type="danger" />
              <ActivityItem text="नया किसान पंजीकरण (राजेश कुमार)" time="25 मिनट पहले" type="info" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, color = 'text-primary-dark' }) {
  return (
    <div className="bg-surface rounded-lg p-4 shadow-sm border border-border flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs text-muted font-medium mb-1">{title}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  );
}

function FunnelStep({ label, value, max, color }) {
  const percent = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-ink">{label}</span>
        <span className="font-bold text-muted">{value}</span>
      </div>
      <div className="h-2 w-full bg-paper rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function ActivityItem({ text, time, type }) {
  const colors = {
    success: 'bg-primary',
    danger: 'bg-danger',
    info: 'bg-accent'
  };
  return (
    <div className="relative flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${colors[type]} z-10 flex-shrink-0 ml-1.5`}></div>
      <div>
        <p className="text-sm text-ink">{text}</p>
        <p className="text-xs text-muted">{time}</p>
      </div>
    </div>
  );
}
