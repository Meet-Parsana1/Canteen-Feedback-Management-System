import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
      LineChart,
      Line,
      BarChart,
      Bar,
      XAxis,
      YAxis,
      Tooltip,
      ResponsiveContainer,
      CartesianGrid,
      LabelList,
      Cell,
} from 'recharts';
import {
      FaClock,
      FaUtensils,
      FaArrowLeft,
      FaEye,
      FaChartLine,
      FaCalendarAlt,
      FaRegSmile,
      FaStar,
} from 'react-icons/fa';
import { buildApiUrl } from '../utils/api';
import CanteenLoader from './CanteenLoader';

const TEAL = '#0d9488';

const EmptyChartState = ({ icon: Icon, title, message }) => (
      <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-center p-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-teal-600 mb-2">
                  <Icon className="text-base" />
            </div>
            <p className="text-xs font-bold text-slate-800">{title}</p>
            <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-relaxed">{message}</p>
      </div>
);

const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());
      return `${day}/${month}/${year}`;
};

const getTimeFilterLabel = (filter) => {
      switch (filter) {
            case 'today': return 'Today';
            case '24h': return 'Last 24 Hours';
            case '7d': return 'Last 7 Days';
            case '30d': return 'Last 30 Days';
            case 'month': return 'This Month';
            case '90d': return 'Last 3 Months';
            default: return 'All Time';
      }
};

const getKpiFilteredData = (data, filter) => {
      if (filter === 'all') return data;
      const now = new Date();
      let start;

      if (filter === 'today') {
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      } else if (filter === '24h') {
            start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (filter === '7d') {
            start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (filter === '30d') {
            start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (filter === 'month') {
            start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      } else if (filter === '90d') {
            start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }

      return data.filter((item) => new Date(item.createdAt) >= start);
};

const getMonthlyChartData = (data, rangeInMonths) => {
      const monthly = {};
      const currentDate = new Date();
      const monthLabels = [];

      // Build the ordered list of year+month keys within range
      for (let index = rangeInMonths - 1; index >= 0; index--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            const label = date.toLocaleString('default', { month: 'short', year: rangeInMonths > 6 ? '2-digit' : undefined });
            monthLabels.push({ key, label });
            monthly[key] = 0;
      }

      data.forEach((item) => {
            const date = new Date(item.createdAt);
            const diffMonths =
                  (currentDate.getFullYear() - date.getFullYear()) * 12 +
                  (currentDate.getMonth() - date.getMonth());
            if (diffMonths >= rangeInMonths) return;
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            if (monthly[key] !== undefined) monthly[key] += 1;
      });

      return monthLabels.map(({ key, label }) => ({
            month: label,
            feedback: monthly[key] || 0,
      }));
};

const getMonthlyWindowRangeLabel = (rangeInMonths) => {
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - (rangeInMonths - 1));
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

const getWeeklyChartData = (data) => {
      const labels = [];
      const counts = {};
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      for (let offset = 0; offset < 7; offset += 1) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + offset);

            const label = date.toLocaleString('default', { weekday: 'short' });
            labels.push({ label, dateKey: date.toDateString() });
            counts[date.toDateString()] = 0;
      }

      data.forEach((item) => {
            const date = new Date(item.createdAt);
            if (date < startDate || date > endDate) return;
            const dateKey = date.toDateString();
            counts[dateKey] = (counts[dateKey] || 0) + 1;
      });

      return {
            data: labels.map(({ label, dateKey }) => ({
                  day: label,
                  feedback: counts[dateKey] || 0,
            })),
            rangeLabel: `${formatDate(startDate)} - ${formatDate(endDate)}`,
      };
};

const getTrailingDaysData = (data, days) => {
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - (days - 1));
      startDate.setHours(0, 0, 0, 0);

      return {
            data: data.filter((item) => {
                  const date = new Date(item.createdAt);
                  return date >= startDate && date <= endDate;
            }),
            rangeLabel: `${formatDate(startDate)} - ${formatDate(endDate)}`,
      };
};

function StudentDashboard() {
      const { canteenSlug } = useParams();
      const targetSlug = canteenSlug || 'mu-main-canteen';

      const [canteenInfo, setCanteenInfo] = useState(null);
      const [feedbacks, setFeedbacks] = useState([]);
      const [monthlyData, setMonthlyData] = useState([]);
      const [weeklyData, setWeeklyData] = useState([]);
      const [foodRatings, setFoodRatings] = useState([]);
      const [sentimentData, setSentimentData] = useState([]);
      const [monthlyDateRange, setMonthlyDateRange] = useState('');
      const [weeklyDateRange, setWeeklyDateRange] = useState('');
      const [sentimentDateRange, setSentimentDateRange] = useState('');
      const [sentimentRange, setSentimentRange] = useState(7);
      const [topFoodDateRange, setTopFoodDateRange] = useState('');
      const [topFoodRange, setTopFoodRange] = useState(7);
      const [loading, setLoading] = useState(true);
      const [range, setRange] = useState(2);
      const [kpiTimeFilter, setKpiTimeFilter] = useState('all');
      const [kpiTotal, setKpiTotal] = useState(0);
      const [kpiAvgRating, setKpiAvgRating] = useState('—');
      const [kpiBestMeal, setKpiBestMeal] = useState('—');
      const [kpiWorstMeal, setKpiWorstMeal] = useState('—');
      const [kpiWorstColor, setKpiWorstColor] = useState('text-slate-800');
      const [kpiInsight, setKpiInsight] = useState('Awaiting feedback');

      useEffect(() => {
            fetchFeedback();
      }, [targetSlug]);

      useEffect(() => {
            setMonthlyData(getMonthlyChartData(feedbacks, range));
            setMonthlyDateRange(getMonthlyWindowRangeLabel(range));
      }, [feedbacks, range]);

      useEffect(() => {
            const weekly = getWeeklyChartData(feedbacks);
            setWeeklyData(weekly.data);
            setWeeklyDateRange(weekly.rangeLabel);
      }, [feedbacks]);

      useEffect(() => {
            const sentimentWindow = getTrailingDaysData(feedbacks, sentimentRange);
            const sentimentSummary = getSentimentSummary(sentimentWindow.data);
            setSentimentData(sentimentSummary);
            setSentimentDateRange(sentimentWindow.rangeLabel);
      }, [feedbacks, sentimentRange]);

      useEffect(() => {
            const topFoodWindow = getTrailingDaysData(feedbacks, topFoodRange);
            setFoodRatings(getTopFoodRatings(topFoodWindow.data));
            setTopFoodDateRange(topFoodWindow.rangeLabel);
      }, [feedbacks, topFoodRange]);

      useEffect(() => {
            const filtered = getKpiFilteredData(feedbacks, kpiTimeFilter);
            const itemRatings = {};
            let totalRating = 0;

            filtered.forEach((item) => {
                  const avg = (item.tasteRating + item.cleanlinessRating + item.staffBehaviourRating) / 3;
                  totalRating += avg;
                  if (!itemRatings[item.foodItem]) itemRatings[item.foodItem] = [];
                  itemRatings[item.foodItem].push(avg);
            });

            const uniqueFoods = Object.keys(itemRatings);

            if (filtered.length === 0) {
                  setKpiTotal(0);
                  setKpiAvgRating('—');
                  setKpiBestMeal('—');
                  setKpiWorstMeal('—');
                  setKpiWorstColor('text-slate-800');
                  setKpiInsight('Awaiting feedback');
                  return;
            }

            const overallAvg = (totalRating / filtered.length).toFixed(2);
            let best = '—';
            let worst = '—';
            let bestAvg = 0;
            let worstAvg = 5;

            uniqueFoods.forEach((item) => {
                  const avg = itemRatings[item].reduce((s, r) => s + r, 0) / itemRatings[item].length;
                  if (avg > bestAvg) { bestAvg = avg; best = item; }
                  if (avg < worstAvg) { worstAvg = avg; worst = item; }
            });

            setKpiTotal(filtered.length);
            setKpiAvgRating(`${overallAvg} / 5`);
            setKpiBestMeal(best);

            if (uniqueFoods.length <= 1) {
                  setKpiWorstMeal('—');
                  setKpiWorstColor('text-slate-800');
            } else {
                  setKpiWorstMeal(worst);
                  setKpiWorstColor(worstAvg < 3.0 ? 'text-red-500' : worstAvg < 3.8 ? 'text-amber-600' : 'text-slate-800');
            }

            if (Number(overallAvg) >= 4.0) setKpiInsight('Excellent performance');
            else if (Number(overallAvg) >= 3.0) setKpiInsight('Needs improvement');
            else setKpiInsight('Poor performance');
      }, [feedbacks, kpiTimeFilter]);

      const fetchFeedback = async () => {
            try {
                  setLoading(true);
                  const res = await fetch(buildApiUrl(`/api/canteens/${targetSlug}/analytics`));
                  const data = await res.json();

                  if (res.ok && data.success) {
                        setCanteenInfo(data.canteen);
                        setFeedbacks(data.data || []);
                  } else {
                        setFeedbacks([]);
                  }
            } catch (err) {
                  console.error('Fetch student analytics error:', err);
                  setFeedbacks([]);
            } finally {
                  setLoading(false);
            }
      };

      const getSentimentSummary = (data) => {
            let positive = 0;
            let negative = 0;
            let neutral = 0;

            data.forEach((item) => {
                  const avg = (item.tasteRating + item.cleanlinessRating + item.staffBehaviourRating) / 3;
                  if (avg >= 4) positive += 1;
                  else if (avg < 3) negative += 1;
                  else neutral += 1;
            });

            return [
                  { name: 'Positive', value: positive },
                  { name: 'Neutral', value: neutral },
                  { name: 'Negative', value: negative },
            ];
      };

      const getTopFoodRatings = (data) => {
            const itemRatings = {};

            data.forEach((item) => {
                  const avg = (item.tasteRating + item.cleanlinessRating + item.staffBehaviourRating) / 3;
                  if (!itemRatings[item.foodItem]) itemRatings[item.foodItem] = { ratings: [], count: 0 };
                  itemRatings[item.foodItem].ratings.push(avg);
                  itemRatings[item.foodItem].count += 1;
            });

            return Object.keys(itemRatings)
                  .map((food) => {
                        const total = itemRatings[food].ratings.reduce((sum, rating) => sum + rating, 0);
                        const count = itemRatings[food].count;
                        const avg = parseFloat((total / count).toFixed(2));
                        return {
                              food,
                              rating: avg,
                              count,
                        };
                  })
                  .sort((a, b) => b.rating - a.rating || b.count - a.count)
                  .slice(0, 5);
      };

      if (loading) {
            return (
                  <CanteenLoader
                        fullScreen={true}
                        text="Loading Campus Dining Dashboard..."
                        subtext="Compiling food ratings, satisfaction trends & sentiment analytics..."
                  />
            );
      }

      return (
            <div className="min-h-screen bg-slate-50 text-slate-800 px-4 sm:px-6 lg:px-8 py-6">
                  {/* Top Bar */}
                  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                              <Link
                                    to="/"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition mb-2"
                              >
                                    <FaArrowLeft className="text-[10px]" /> Back to Home
                              </Link>
                              <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                                          {canteenInfo?.name || 'Campus Dining'} Analytics
                                    </h1>
                                    <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                                          Public Transparency
                                    </span>
                              </div>
                              {canteenInfo?.institution && (
                                    <p className="text-xs text-slate-400 mt-0.5">{canteenInfo.institution}</p>
                              )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                              <Link
                                    to={`/feedback/${targetSlug}`}
                                    className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
                              >
                                    <FaUtensils /> Give Feedback
                              </Link>
                              <Link
                                    to="/demo/student"
                                    className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-bold px-3.5 py-2 rounded-xl text-xs transition"
                              >
                                    <FaEye /> View Demo
                              </Link>
                        </div>
                  </div>

                  <div className="max-w-7xl mx-auto space-y-6">
                        {/* Zero-Feedback Welcome Banner */}
                        {feedbacks.length === 0 && (
                              <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200/80 rounded-2xl p-6 shadow-sm text-center max-w-2xl mx-auto space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl mx-auto shadow-inner">
                                          <FaUtensils />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">
                                          Be the First to Rate {canteenInfo?.name || 'This Canteen'}!
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                                          No student reviews have been submitted for this dining hall yet. Share your ratings on taste, cleanliness, and service to kickstart live dining transparency!
                                    </p>
                                    <Link
                                          to={`/feedback/${targetSlug}`}
                                          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition hover:-translate-y-0.5"
                                    >
                                          <FaUtensils />
                                          <span>Give Feedback Now</span>
                                    </Link>
                              </div>
                        )}

                        {/* KPI Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                    <h2 className="text-sm font-bold text-slate-700">Dining Quality Indicators</h2>
                                    <p className="text-xs text-slate-400">
                                          Aggregate stats for: <span className="text-teal-600 font-bold">{getTimeFilterLabel(kpiTimeFilter)}</span>
                                    </p>
                              </div>
                              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm w-fit">
                                    <FaClock className="text-teal-600 text-xs shrink-0" />
                                    <span className="text-xs font-bold text-slate-600">Period:</span>
                                    <select
                                          value={kpiTimeFilter}
                                          onChange={(e) => setKpiTimeFilter(e.target.value)}
                                          className="bg-transparent text-xs font-bold text-teal-700 outline-none cursor-pointer"
                                    >
                                          <option value="all">All Time</option>
                                          <option value="today">Today</option>
                                          <option value="24h">Last 24 Hours</option>
                                          <option value="7d">Last 7 Days</option>
                                          <option value="30d">Last 30 Days</option>
                                          <option value="month">This Month</option>
                                          <option value="90d">Last 3 Months</option>
                                    </select>
                              </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                              <GlassCard title="Total Reviews" value={kpiTotal} badge={getTimeFilterLabel(kpiTimeFilter)} />
                              <GlassCard title="Average Rating" value={kpiAvgRating} badge={getTimeFilterLabel(kpiTimeFilter)} />
                              <GlassCard title="Top Meal" value={kpiBestMeal} badge={getTimeFilterLabel(kpiTimeFilter)} />
                              <GlassCard title="Lowest Meal" value={kpiWorstMeal} color={kpiWorstColor} badge={getTimeFilterLabel(kpiTimeFilter)} />
                              <GlassCard title="Overall Pulse" value={kpiInsight} badge={getTimeFilterLabel(kpiTimeFilter)} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
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
                                    subtitle={`Data window: ${monthlyDateRange}`}
                              >
                                    {monthlyData.length === 0 || monthlyData.every((item) => item.feedback === 0) ? (
                                          <EmptyChartState
                                                icon={FaChartLine}
                                                title="No Monthly Submissions"
                                                message="Monthly volume trends will be graphed here over time."
                                          />
                                    ) : (
                                          <div className="w-full h-[240px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                      <LineChart data={monthlyData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                            <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                                                            <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                                                            <Tooltip />
                                                            <Line type="monotone" dataKey="feedback" stroke={TEAL} strokeWidth={3} dot={{ r: 4 }} />
                                                      </LineChart>
                                                </ResponsiveContainer>
                                          </div>
                                    )}
                              </ChartCard>

                              <ChartCard title="Weekly Feedback Volume" subtitle={`Data window: ${weeklyDateRange}`}>
                                    {weeklyData.length === 0 || weeklyData.every((item) => item.feedback === 0) ? (
                                          <EmptyChartState
                                                icon={FaCalendarAlt}
                                                title="No Weekly Feedback Recorded"
                                                message="Daily feedback volume from Monday to Sunday will populate here."
                                          />
                                    ) : (
                                          <div className="w-full h-[240px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                      <LineChart data={weeklyData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                            <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                                                            <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                                                            <Tooltip />
                                                            <Line type="monotone" dataKey="feedback" stroke={TEAL} strokeWidth={3} dot={{ r: 4 }} />
                                                      </LineChart>
                                                </ResponsiveContainer>
                                          </div>
                                    )}
                              </ChartCard>

                              <ChartCard
                                    title={
                                          <div className="flex justify-between items-center">
                                                <span>Sentiment Ratio</span>
                                                <select
                                                      value={sentimentRange}
                                                      onChange={(e) => setSentimentRange(Number(e.target.value))}
                                                      className="text-xs font-semibold border rounded-lg px-2 py-1 bg-slate-50"
                                                >
                                                      <option value={7}>Last 7 Days</option>
                                                      <option value={15}>Last 15 Days</option>
                                                      <option value={30}>Last 30 Days</option>
                                                </select>
                                          </div>
                                    }
                                    subtitle={`Data window: ${sentimentDateRange}`}
                              >
                                    {sentimentData.length === 0 || sentimentData.every((item) => item.value === 0) ? (
                                          <EmptyChartState
                                                icon={FaRegSmile}
                                                title="No Sentiment Breakdown"
                                                message="Positive, neutral, and critical feedback distribution will appear here."
                                          />
                                    ) : (
                                          <div className="w-full h-[240px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                      <BarChart data={sentimentData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                            <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                                            <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                                                            <Tooltip />
                                                            <Bar dataKey="value" maxBarSize={48} radius={[6, 6, 0, 0]}>
                                                                  {sentimentData.map((entry, index) => {
                                                                        const color = entry.name === 'Positive' ? '#22c55e' : entry.name === 'Negative' ? '#ef4444' : '#facc15';
                                                                        return <Cell key={index} fill={color} />;
                                                                  })}
                                                            </Bar>
                                                      </BarChart>
                                                </ResponsiveContainer>
                                          </div>
                                    )}
                              </ChartCard>

                              <ChartCard
                                    title={
                                          <div className="flex justify-between items-center">
                                                <span>Top Rated Foods</span>
                                                <select
                                                      value={topFoodRange}
                                                      onChange={(e) => setTopFoodRange(Number(e.target.value))}
                                                      className="text-xs font-semibold border rounded-lg px-2 py-1 bg-slate-50"
                                                >
                                                      <option value={7}>Last 7 Days</option>
                                                      <option value={15}>Last 15 Days</option>
                                                      <option value={30}>Last 30 Days</option>
                                                </select>
                                          </div>
                                    }
                                    subtitle={`Data window: ${topFoodDateRange}`}
                              >
                                    <div className="w-full flex-1 flex flex-col justify-start space-y-2.5 py-1">
                                          {foodRatings.length === 0 ? (
                                                <EmptyChartState
                                                      icon={FaUtensils}
                                                      title="No Food Items Rated Yet"
                                                      message="Menu items rated by students in this timeframe will appear ranked here."
                                                />
                                          ) : (
                                                foodRatings.map((item, idx) => (
                                                      <div
                                                            key={item.food}
                                                            className="w-full p-3 rounded-xl bg-slate-50/90 hover:bg-slate-100/80 border border-slate-100 transition space-y-2"
                                                      >
                                                            <div className="flex items-center justify-between">
                                                                  <div className="flex items-center gap-2.5">
                                                                        <span
                                                                              className={`w-6 h-6 rounded-lg text-[11px] font-extrabold flex items-center justify-center shadow-xs ${
                                                                                    idx === 0
                                                                                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                                                          : idx === 1
                                                                                          ? 'bg-slate-200 text-slate-700 border border-slate-300'
                                                                                          : idx === 2
                                                                                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                                              }`}
                                                                        >
                                                                              #{idx + 1}
                                                                        </span>
                                                                        <div>
                                                                              <p className="text-xs font-bold text-slate-800">
                                                                                    {item.food}
                                                                              </p>
                                                                              <p className="text-[10px] text-slate-400 font-medium">
                                                                                    {item.count} {item.count === 1 ? 'student rating' : 'student ratings'}
                                                                              </p>
                                                                        </div>
                                                                  </div>
                                                                  <span className="text-xs font-extrabold text-amber-600 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-xs flex items-center gap-1">
                                                                        {item.rating} <FaStar className="text-[10px] text-amber-500" />
                                                                  </span>
                                                            </div>
                                                            {/* Rating visual score bar */}
                                                            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                                                                  <div
                                                                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                                                                        style={{ width: `${Math.min(100, Math.round((item.rating / 5) * 100))}%` }}
                                                                  />
                                                            </div>
                                                      </div>
                                                ))
                                          )}
                                    </div>
                              </ChartCard>
                        </div>
                  </div>
            </div>
      );
}

const GlassCard = ({ title, value, color = 'text-slate-800', badge }) => (
      <div className="bg-white rounded-2xl p-4 sm:p-5 text-center shadow-sm hover:shadow-md transition border border-slate-200 flex flex-col items-center justify-between min-h-[115px]">
            <p className="text-teal-700 font-bold text-xs">{title}</p>
            <h2 className={`text-xl font-extrabold truncate max-w-full px-1 ${color}`} title={typeof value === 'string' ? value : ''}>
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

export default StudentDashboard;
