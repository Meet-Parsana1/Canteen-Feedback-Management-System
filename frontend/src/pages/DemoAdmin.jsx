import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
      FaStar, FaUtensils, FaFileExcel, FaQrcode, FaUsers,
      FaClock, FaChartLine, FaCalendarAlt, FaRegSmile, FaSearch,
      FaChevronLeft, FaChevronRight,
} from 'react-icons/fa';
import {
      ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
      Tooltip, CartesianGrid, Cell,
} from 'recharts';
import Toast from '../components/Toast';

const TEAL = '#0d9488';

// ─── Static Demo Data ─────────────────────────────────────────────────────────
const DEMO_MONTHLY = [
      { month: 'Mar', feedback: 18 },
      { month: 'Apr', feedback: 31 },
      { month: 'May', feedback: 47 },
      { month: 'Jun', feedback: 63 },
      { month: 'Jul', feedback: 58 },
      { month: 'Aug', feedback: 72 },
];

const DEMO_WEEKLY = [
      { day: 'Sun', feedback: 8 },
      { day: 'Mon', feedback: 19 },
      { day: 'Tue', feedback: 24 },
      { day: 'Wed', feedback: 31 },
      { day: 'Thu', feedback: 22 },
      { day: 'Fri', feedback: 28 },
      { day: 'Sat', feedback: 13 },
];

const DEMO_SENTIMENT = [
      { name: 'Positive', value: 218 },
      { name: 'Neutral', value: 47 },
      { name: 'Negative', value: 24 },
];

const DEMO_TOP_FOODS = [
      { food: 'Lunch Thali Combo', rating: 4.85, count: 68 },
      { food: 'Paneer Butter Masala', rating: 4.72, count: 54 },
      { food: 'Masala Dosa & Sambar', rating: 4.61, count: 47 },
      { food: 'Veg Dum Biryani', rating: 4.44, count: 39 },
      { food: 'Cold Coffee with Ice Cream', rating: 4.31, count: 29 },
];

const DEMO_TABLE = [
      { id: 1, enrollment: '92100145892', name: 'Aarav Sharma', food: 'Lunch Thali Combo', taste: 5, clean: 5, staff: 5, date: '22 Aug 2026, 12:30', comment: 'Outstanding quality, very hygienic plating.' },
      { id: 2, enrollment: '92100874125', name: 'Priya Patel', food: 'Masala Dosa & Sambar', taste: 5, clean: 4, staff: 5, date: '22 Aug 2026, 11:45', comment: 'Sambhar was authentic and piping hot.' },
      { id: 3, enrollment: '92100652398', name: 'Rohan Mehta', food: 'Paneer Butter Masala', taste: 4, clean: 4, staff: 4, date: '22 Aug 2026, 10:15', comment: 'Good portion size, naan was soft.' },
      { id: 4, enrollment: '92100321456', name: 'Ananya Desai', food: 'Veg Dum Biryani', taste: 4, clean: 5, staff: 4, date: '21 Aug 2026, 13:20', comment: 'Fragrant basmati, perfectly spiced raita.' },
      { id: 5, enrollment: '92100998877', name: 'Devansh Joshi', food: 'Cold Coffee with Ice Cream', taste: 5, clean: 5, staff: 5, date: '21 Aug 2026, 15:10', comment: 'Best beverage item, very refreshing.' },
      { id: 6, enrollment: '92100567234', name: 'Sneha Trivedi', food: 'Samosa Chaat', taste: 3, clean: 3, staff: 4, date: '21 Aug 2026, 09:40', comment: 'A bit too oily, chutney was good.' },
      { id: 7, enrollment: '92100765432', name: 'Karan Dave', food: 'Chole Bhature', taste: 4, clean: 4, staff: 3, date: '20 Aug 2026, 13:00', comment: 'Bhature were fluffy, chole a bit spicy.' },
      { id: 8, enrollment: '92100234561', name: 'Tanvi Nair', food: 'Idli Vada Sambar Combo', taste: 5, clean: 5, staff: 5, date: '20 Aug 2026, 08:55', comment: 'Soft idli and crunchy vada, clean breakfast counter.' },
];

const MONTH_RANGE = 'Mar 2026 – Aug 2026';
const WEEK_RANGE = '16/08/2026 – 22/08/2026';
const SENTIMENT_RANGE = '16/08/2026 – 22/08/2026';
const TOP_FOOD_RANGE = '16/08/2026 – 22/08/2026';

const TABS = [
      { id: 'overview', label: 'Overview & Analytics' },
      { id: 'feedback', label: 'Feedback Responses' },
      { id: 'qr', label: 'QR Code & Dining Poster' },
      { id: 'team', label: 'Canteen Team' },
];

// ─── Sub-Components ─────────────────────────────────────────────────────────────
const GlassCard = ({ title, value, color = 'text-slate-800', badge }) => (
      <div className="bg-white rounded-2xl p-4 sm:p-5 text-center shadow-sm hover:shadow-md transition border border-slate-200 flex flex-col items-center justify-between min-h-[115px]">
            <p className="text-teal-700 font-bold text-xs">{title}</p>
            <h2 className={`text-xl font-extrabold truncate max-w-full px-1 ${color}`} title={value}>
                  {value}
            </h2>
            {badge && (
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">
                        ⏱ {badge}
                  </span>
            )}
      </div>
);

const ChartCard = ({ title, subtitle, children }) => (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 min-h-[360px] flex flex-col justify-between">
            <div>
                  <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
                  {subtitle && <p className="text-xs text-slate-400 mb-3">{subtitle}</p>}
            </div>
            <div className="w-full flex-1 min-h-[250px] flex flex-col justify-center">
                  {children}
            </div>
      </div>
);

const StarBadge = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

export default function DemoAdmin() {
      const [activeTab, setActiveTab] = useState('overview');
      const [monthlyRange, setMonthlyRange] = useState(6);
      const [toast, setToast] = useState(null);
      const [search, setSearch] = useState('');

      const filtered = DEMO_TABLE.filter(
            (r) =>
                  r.enrollment.includes(search) ||
                  r.food.toLowerCase().includes(search.toLowerCase()) ||
                  r.name.toLowerCase().includes(search.toLowerCase())
      );

      return (
            <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
                  {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

                  {/* Demo Banner */}
                  <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white px-4 py-2.5 shadow-md flex items-center text-xs sm:text-sm font-semibold sticky top-0 z-50">
                        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
                              <div className="flex items-center gap-2">
                                    <span className="bg-white text-amber-800 uppercase font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                                          DEMO MODE · READ ONLY
                                    </span>
                                    <span>Exploring the <strong>Admin Intelligence Dashboard</strong> with sample data.</span>
                              </div>
                              <div className="flex items-center gap-2">
                                    <Link to="/admin/login" className="bg-white text-teal-800 hover:bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold transition shadow-sm">
                                          Go to Real Admin
                                    </Link>
                                    <Link to="/" className="text-white/90 hover:text-white text-xs font-semibold px-2 py-1">Exit</Link>
                              </div>
                        </div>
                  </div>

                  {/* Top Header */}
                  <header className="bg-white border-b border-slate-200 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xl shadow-md">
                                                <FaUtensils />
                                          </div>
                                          <div>
                                                <div className="flex items-center gap-2">
                                                      <h1 className="text-xl font-extrabold text-slate-900">Campus Central Dining</h1>
                                                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">ACTIVE</span>
                                                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">● OPEN</span>
                                                </div>
                                                <p className="text-xs text-slate-400">Marwadi University, Rajkot · <span className="text-teal-600 font-semibold">DemoAdmin (owner)</span></p>
                                          </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                          <button
                                                onClick={() => setToast({ message: 'Excel Export simulated! Real admins generate a full .xlsx report.', type: 'success' })}
                                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
                                          >
                                                <FaFileExcel /> Export Excel
                                          </button>
                                          <Link to="/demo/student" className="inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold px-3.5 py-2 rounded-xl text-xs transition">
                                                Student View
                                          </Link>
                                    </div>
                              </div>

                              {/* Tabs */}
                              <div className="flex gap-1 mt-4 border-b border-slate-200 -mb-px">
                                    {TABS.map((tab) => (
                                          <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                                                      activeTab === tab.id
                                                            ? 'border-teal-600 text-teal-700'
                                                            : 'border-transparent text-slate-500 hover:text-slate-800'
                                                }`}
                                          >
                                                {tab.label}
                                                {tab.id === 'feedback' && (
                                                      <span className="ml-1.5 bg-teal-100 text-teal-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                                                            {DEMO_TABLE.length}
                                                      </span>
                                                )}
                                          </button>
                                    ))}
                              </div>
                        </div>
                  </header>

                  {/* Tab Content */}
                  <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6">

                        {/* ── OVERVIEW TAB ─────────────────────────────── */}
                        {activeTab === 'overview' && (
                              <div className="space-y-6">
                                    {/* KPI Filter Row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                          <div>
                                                <h2 className="text-sm font-bold text-slate-700">Dining Performance Overview</h2>
                                                <p className="text-xs text-slate-400">
                                                      Aggregate stats for: <span className="text-teal-600 font-bold">All Time</span>
                                                </p>
                                          </div>
                                          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm w-fit">
                                                <FaClock className="text-teal-600 text-xs" />
                                                <span className="text-xs font-bold text-slate-600">Period:</span>
                                                <span className="text-xs font-bold text-teal-700">All Time</span>
                                          </div>
                                    </div>

                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                          <GlassCard title="Total Feedback" value={289} badge="All Time" />
                                          <GlassCard title="Average Rating" value="4.27 / 5" badge="All Time" />
                                          <GlassCard title="Top Rated Item" value="Lunch Thali Combo" badge="All Time" />
                                          <GlassCard title="Lowest Rated Item" value="Samosa Chaat" color="text-amber-600" badge="All Time" />
                                          <GlassCard title="Operational Insight" value="Excellent performance" badge="All Time" />
                                    </div>

                                    {/* Charts Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                                          {/* Monthly */}
                                          <ChartCard
                                                title={
                                                      <div className="flex justify-between items-center">
                                                            <span>Monthly Feedback Trend</span>
                                                            <select
                                                                  value={monthlyRange}
                                                                  onChange={(e) => setMonthlyRange(Number(e.target.value))}
                                                                  className="text-xs font-semibold border rounded-lg px-2 py-1 bg-slate-50"
                                                            >
                                                                  <option value={2}>Last 2 Months</option>
                                                                  <option value={3}>Last 3 Months</option>
                                                                  <option value={6}>Last 6 Months</option>
                                                                  <option value={12}>Last 12 Months</option>
                                                            </select>
                                                      </div>
                                                }
                                                subtitle={`Data window: ${MONTH_RANGE}`}
                                          >
                                                <div className="w-full h-[240px]">
                                                      <ResponsiveContainer width="100%" height="100%">
                                                            <LineChart data={DEMO_MONTHLY.slice(-monthlyRange)} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                                                                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                                                                  <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                                                                  <Tooltip />
                                                                  <Line type="monotone" dataKey="feedback" stroke={TEAL} strokeWidth={3} dot={{ r: 4 }} />
                                                            </LineChart>
                                                      </ResponsiveContainer>
                                                </div>
                                          </ChartCard>

                                          {/* Weekly */}
                                          <ChartCard title="Weekly Feedback Volume" subtitle={`Data window: ${WEEK_RANGE}`}>
                                                <div className="w-full h-[240px]">
                                                      <ResponsiveContainer width="100%" height="100%">
                                                            <LineChart data={DEMO_WEEKLY} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                                                                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                                                                  <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                                                                  <Tooltip />
                                                                  <Line type="monotone" dataKey="feedback" stroke={TEAL} strokeWidth={3} dot={{ r: 4 }} />
                                                            </LineChart>
                                                      </ResponsiveContainer>
                                                </div>
                                          </ChartCard>

                                          {/* Sentiment */}
                                          <ChartCard
                                                title={
                                                      <div className="flex justify-between items-center">
                                                            <span>Feedback Sentiment Breakdown</span>
                                                            <span className="text-xs font-semibold border rounded-lg px-2 py-1 bg-slate-50 text-slate-500">Last 7 Days</span>
                                                      </div>
                                                }
                                                subtitle={`Data window: ${SENTIMENT_RANGE}`}
                                          >
                                                <div className="w-full h-[240px]">
                                                      <ResponsiveContainer width="100%" height="100%">
                                                            <BarChart data={DEMO_SENTIMENT} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                                                                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                                                  <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                                                                  <Tooltip />
                                                                  <Bar dataKey="value" maxBarSize={48} radius={[6, 6, 0, 0]}>
                                                                        {DEMO_SENTIMENT.map((entry, index) => {
                                                                              const color = entry.name === 'Positive' ? '#22c55e' : entry.name === 'Negative' ? '#ef4444' : '#facc15';
                                                                              return <Cell key={index} fill={color} />;
                                                                        })}
                                                                  </Bar>
                                                            </BarChart>
                                                      </ResponsiveContainer>
                                                </div>
                                          </ChartCard>

                                          {/* Top Rated */}
                                          <ChartCard
                                                title={
                                                      <div className="flex justify-between items-center">
                                                            <span>Top Rated Menu Items</span>
                                                            <span className="text-xs font-semibold border rounded-lg px-2 py-1 bg-slate-50 text-slate-500">Last 7 Days</span>
                                                      </div>
                                                }
                                                subtitle={`Data window: ${TOP_FOOD_RANGE}`}
                                          >
                                                <div className="w-full flex-1 flex flex-col justify-start space-y-2.5 py-1">
                                                      {DEMO_TOP_FOODS.map((item, idx) => (
                                                            <div key={item.food} className="w-full p-3 rounded-xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-100 transition space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2.5">
                                                                              <span className={`w-6 h-6 rounded-lg text-[11px] font-extrabold flex items-center justify-center ${
                                                                                    idx === 0 ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                                                    : idx === 1 ? 'bg-slate-200 text-slate-700 border border-slate-300'
                                                                                    : idx === 2 ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                                              }`}>
                                                                                    #{idx + 1}
                                                                              </span>
                                                                              <div>
                                                                                    <p className="text-xs font-bold text-slate-800">{item.food}</p>
                                                                                    <p className="text-[10px] text-slate-400 font-medium">{item.count} student ratings</p>
                                                                              </div>
                                                                        </div>
                                                                        <span className="text-xs font-extrabold text-amber-600 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-xs flex items-center gap-1">
                                                                              {item.rating} <FaStar className="text-[10px] text-amber-500" />
                                                                        </span>
                                                                  </div>
                                                                  <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                                                                        <div
                                                                              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full"
                                                                              style={{ width: `${Math.round((item.rating / 5) * 100)}%` }}
                                                                        />
                                                                  </div>
                                                            </div>
                                                      ))}
                                                </div>
                                          </ChartCard>
                                    </div>
                              </div>
                        )}

                        {/* ── FEEDBACK TABLE TAB ─────────────────────────── */}
                        {activeTab === 'feedback' && (
                              <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                          <div>
                                                <h2 className="text-sm font-bold text-slate-800">Feedback Responses ({DEMO_TABLE.length})</h2>
                                                <p className="text-xs text-slate-400">Sample dataset — demonstrating search, filter, and rating inspection.</p>
                                          </div>
                                          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm w-full sm:w-64">
                                                <FaSearch className="text-slate-400 text-xs" />
                                                <input
                                                      placeholder="Search by name, food, enrollment..."
                                                      value={search}
                                                      onChange={(e) => setSearch(e.target.value)}
                                                      className="bg-transparent outline-none text-xs w-full text-slate-700 placeholder-slate-400"
                                                />
                                          </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                          <div className="overflow-x-auto">
                                                <table className="w-full text-left text-xs">
                                                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                                                            <tr>
                                                                  <th className="py-3.5 px-4">Enrollment</th>
                                                                  <th className="py-3.5 px-4">Student</th>
                                                                  <th className="py-3.5 px-4">Food Item</th>
                                                                  <th className="py-3.5 px-4 text-center">Taste</th>
                                                                  <th className="py-3.5 px-4 text-center">Cleanliness</th>
                                                                  <th className="py-3.5 px-4 text-center">Staff</th>
                                                                  <th className="py-3.5 px-4">Comment</th>
                                                                  <th className="py-3.5 px-4">Date</th>
                                                            </tr>
                                                      </thead>
                                                      <tbody className="divide-y divide-slate-100">
                                                            {filtered.map((row) => (
                                                                  <tr key={row.id} className="hover:bg-slate-50/80 transition">
                                                                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">{row.enrollment}</td>
                                                                        <td className="py-3 px-4 font-semibold text-slate-800">{row.name}</td>
                                                                        <td className="py-3 px-4 font-bold text-teal-700">{row.food}</td>
                                                                        <td className="py-3 px-4 text-center font-bold text-amber-500">{row.taste} ★</td>
                                                                        <td className="py-3 px-4 text-center font-bold text-blue-500">{row.clean} ★</td>
                                                                        <td className="py-3 px-4 text-center font-bold text-emerald-500">{row.staff} ★</td>
                                                                        <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">{row.comment}</td>
                                                                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{row.date}</td>
                                                                  </tr>
                                                            ))}
                                                      </tbody>
                                                </table>
                                                {filtered.length === 0 && (
                                                      <p className="text-xs text-slate-400 text-center py-8">No results match your search.</p>
                                                )}
                                          </div>
                                    </div>
                              </div>
                        )}

                        {/* ── QR CODE TAB ────────────────────────────────── */}
                        {activeTab === 'qr' && (
                              <div className="max-w-2xl mx-auto">
                                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-5">
                                          <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner">
                                                <FaQrcode />
                                          </div>
                                          <div>
                                                <h2 className="text-lg font-extrabold text-slate-900 mb-1">Dining Poster & QR Code Manager</h2>
                                                <p className="text-xs text-slate-500 max-w-md mx-auto">
                                                      In the real admin console, you can generate a branded dining feedback poster with a scannable QR code, download it as a high-resolution PDF, and print it for display at your canteen tables.
                                                </p>
                                          </div>
                                          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50 flex flex-col items-center gap-3">
                                                <div className="w-36 h-36 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                                                      <FaQrcode className="text-6xl opacity-40" />
                                                </div>
                                                <p className="text-xs font-semibold text-slate-500">QR Code Preview (Demo)</p>
                                                <p className="text-[10px] text-slate-400">Scan would link to: /feedback/campus-central-dining</p>
                                          </div>
                                          <button
                                                onClick={() => setToast({ message: 'QR Poster download simulated! Real admin generates a print-ready PDF.', type: 'success' })}
                                                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-md"
                                          >
                                                <FaQrcode /> Download Dining Poster (Demo)
                                          </button>
                                    </div>
                              </div>
                        )}

                        {/* ── TEAM TAB ───────────────────────────────────── */}
                        {activeTab === 'team' && (
                              <div className="max-w-2xl mx-auto space-y-4">
                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                          <h3 className="text-base font-bold text-slate-800 mb-1">Invite Manager to Campus Central Dining</h3>
                                          <p className="text-xs text-slate-400 mb-4">
                                                Generate a secure registration link to invite dining supervisors to review feedback.
                                          </p>
                                          <div className="flex gap-3">
                                                <input
                                                      type="email"
                                                      placeholder="manager@university.edu"
                                                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                                      readOnly
                                                />
                                                <button
                                                      onClick={() => setToast({ message: 'Invite link generation simulated! Real admins send secure email invitations.', type: 'success' })}
                                                      className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm"
                                                >
                                                      <FaUsers /> Generate Link
                                                </button>
                                          </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                          <h3 className="text-sm font-bold text-slate-800 mb-4">Active Team Members</h3>
                                          <div className="divide-y divide-slate-100">
                                                {[
                                                      { name: 'Demo Admin', email: 'admin@canteen.iq', role: 'owner' },
                                                      { name: 'Ravi Patel', email: 'ravi@mu.edu', role: 'manager' },
                                                ].map((m) => (
                                                      <div key={m.email} className="py-3 flex items-center justify-between">
                                                            <div>
                                                                  <p className="text-sm font-bold text-slate-800">{m.name}</p>
                                                                  <p className="text-xs text-slate-400">{m.email}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                  <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                                                                        {m.role}
                                                                  </span>
                                                                  <span className="text-[11px] text-emerald-600 font-semibold">Active</span>
                                                            </div>
                                                      </div>
                                                ))}
                                          </div>
                                    </div>
                              </div>
                        )}

                  </main>
            </div>
      );
}
