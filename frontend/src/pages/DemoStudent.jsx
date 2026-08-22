import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
      FaStar, FaUtensils, FaArrowLeft, FaEye, FaChartLine, FaCalendarAlt, FaRegSmile, FaClock,
} from 'react-icons/fa';
import {
      ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
      Tooltip, CartesianGrid, Cell,
} from 'recharts';

const TEAL = '#0d9488';

// ─── Static Demo Data ──────────────────────────────────────────────────────────
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

const KPI = {
      total: 289,
      avgRating: '4.27 / 5',
      bestMeal: 'Lunch Thali Combo',
      worstMeal: 'Samosa Chaat',
      pulse: 'Excellent performance',
};

const MONTH_RANGE = 'Mar 2026 – Aug 2026';
const WEEK_RANGE = '16/08/2026 – 22/08/2026';
const SENTIMENT_RANGE = '16/08/2026 – 22/08/2026';
const TOP_FOOD_RANGE = '16/08/2026 – 22/08/2026';

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

export default function DemoStudent() {
      const [range, setRange] = useState(6);

      return (
            <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">

                  {/* Demo Banner */}
                  <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white px-4 py-2.5 shadow-md flex items-center text-xs sm:text-sm font-semibold sticky top-0 z-50">
                        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
                              <div className="flex items-center gap-2">
                                    <span className="bg-white text-amber-800 uppercase font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                                          DEMO MODE
                                    </span>
                                    <span>You are viewing the <strong>Student Analytics Demo</strong> with sample data. No real records are shown.</span>
                              </div>
                              <Link to="/" className="hidden sm:inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-xs font-bold transition">
                                    Exit Demo
                              </Link>
                        </div>
                  </div>

                  {/* Page Header */}
                  <div className="bg-white border-b border-slate-200 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition mb-2">
                                                <FaArrowLeft className="text-[10px]" /> Back to Home
                                          </Link>
                                          <div className="flex items-center gap-2">
                                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                                      Campus Central Dining Analytics
                                                </h1>
                                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                                                      Public Transparency
                                                </span>
                                          </div>
                                          <p className="text-xs text-slate-400 mt-0.5">Marwadi University, Rajkot</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                          <Link to="/demo/admin" className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-bold px-3.5 py-2 rounded-xl text-xs transition">
                                                <FaEye /> View Admin Demo
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </div>

                  {/* Main */}
                  <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">

                        {/* KPI Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                    <h2 className="text-sm font-bold text-slate-700">Dining Quality Indicators</h2>
                                    <p className="text-xs text-slate-400">
                                          Aggregate stats for: <span className="text-teal-600 font-bold">All Time</span>
                                    </p>
                              </div>
                              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm w-fit">
                                    <FaClock className="text-teal-600 text-xs shrink-0" />
                                    <span className="text-xs font-bold text-slate-600">Period:</span>
                                    <span className="text-xs font-bold text-teal-700">All Time</span>
                              </div>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                              <GlassCard title="Total Reviews" value={KPI.total} badge="All Time" />
                              <GlassCard title="Average Rating" value={KPI.avgRating} badge="All Time" />
                              <GlassCard title="Top Meal" value={KPI.bestMeal} badge="All Time" />
                              <GlassCard title="Lowest Meal" value={KPI.worstMeal} color="text-amber-600" badge="All Time" />
                              <GlassCard title="Overall Pulse" value={KPI.pulse} badge="All Time" />
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                              {/* Monthly Trend */}
                              <ChartCard
                                    title={
                                          <div className="flex justify-between items-center">
                                                <span>Monthly Trend</span>
                                                <select
                                                      value={range}
                                                      onChange={(e) => setRange(Number(e.target.value))}
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
                                                <LineChart data={DEMO_MONTHLY.slice(-range)} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                                                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                                                      <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                                                      <Tooltip />
                                                      <Line type="monotone" dataKey="feedback" stroke={TEAL} strokeWidth={3} dot={{ r: 4 }} />
                                                </LineChart>
                                          </ResponsiveContainer>
                                    </div>
                              </ChartCard>

                              {/* Weekly Volume */}
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

                              {/* Sentiment Ratio */}
                              <ChartCard
                                    title={
                                          <div className="flex justify-between items-center">
                                                <span>Sentiment Ratio</span>
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

                              {/* Top Rated Foods */}
                              <ChartCard
                                    title={
                                          <div className="flex justify-between items-center">
                                                <span>Top Rated Foods</span>
                                                <span className="text-xs font-semibold border rounded-lg px-2 py-1 bg-slate-50 text-slate-500">Last 7 Days</span>
                                          </div>
                                    }
                                    subtitle={`Data window: ${TOP_FOOD_RANGE}`}
                              >
                                    <div className="w-full flex-1 flex flex-col justify-start space-y-2.5 py-1">
                                          {DEMO_TOP_FOODS.map((item, idx) => (
                                                <div
                                                      key={item.food}
                                                      className="w-full p-3 rounded-xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-100 transition space-y-2"
                                                >
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
                                                                        <p className="text-[10px] text-slate-400 font-medium">
                                                                              {item.count} student ratings
                                                                        </p>
                                                                  </div>
                                                            </div>
                                                            <span className="text-xs font-extrabold text-amber-600 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-xs flex items-center gap-1">
                                                                  {item.rating} <FaStar className="text-[10px] text-amber-500" />
                                                            </span>
                                                      </div>
                                                      <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                                                            <div
                                                                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                                                                  style={{ width: `${Math.min(100, Math.round((item.rating / 5) * 100))}%` }}
                                                            />
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              </ChartCard>

                        </div>
                  </div>
            </div>
      );
}
