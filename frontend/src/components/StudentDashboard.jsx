import { useEffect, useState } from 'react';
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

import { FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../utils/api';
import CanteenLoader from './CanteenLoader';

const TEAL = '#0d9488';

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

const getDateRangeLabel = (data) => {
      if (data.length === 0) {
            return 'No feedback data yet';
      }

      const dates = data.map((item) => new Date(item.createdAt));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));

      return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
};

const getMonthlyChartData = (data, rangeInMonths) => {
      const monthly = {};
      const currentDate = new Date();
      const monthLabels = [];

      data.forEach((item) => {
            const date = new Date(item.createdAt);
            const diffMonths =
                  (currentDate.getFullYear() - date.getFullYear()) * 12 + (currentDate.getMonth() - date.getMonth());

            if (diffMonths >= rangeInMonths) {
                  return;
            }

            const month = date.toLocaleString('default', { month: 'short' });
            monthly[month] = (monthly[month] || 0) + 1;
      });

      for (let index = rangeInMonths - 1; index >= 0; index -= 1) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1);
            monthLabels.push(date.toLocaleString('default', { month: 'short' }));
      }

      return monthLabels.map((month) => ({
            month,
            feedback: monthly[month] || 0,
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

            if (date < startDate || date > endDate) {
                  return;
            }

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
      const navigate = useNavigate();

      const [feedbacks, setFeedbacks] = useState([]);
      const [avgRating, setAvgRating] = useState(0);
      const [bestMeal, setBestMeal] = useState('');
      const [worstMeal, setWorstMeal] = useState('');
      const [monthlyData, setMonthlyData] = useState([]);
      const [weeklyData, setWeeklyData] = useState([]);
      const [foodRatings, setFoodRatings] = useState([]);
      const [sentimentData, setSentimentData] = useState([]);
      const [insight, setInsight] = useState('');
      const [overallDateRange, setOverallDateRange] = useState('');
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
      const [kpiAvgRating, setKpiAvgRating] = useState('0.00');
      const [kpiBestMeal, setKpiBestMeal] = useState('');
      const [kpiWorstMeal, setKpiWorstMeal] = useState('');
      const [kpiInsight, setKpiInsight] = useState('');

      useEffect(() => {
            fetchFeedback();
      }, []);

      useEffect(() => {
            setMonthlyData(getMonthlyChartData(feedbacks, range));
            setMonthlyDateRange(getMonthlyWindowRangeLabel(range));
      }, [feedbacks, range]);

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

      // Recompute KPI cards whenever feedbacks or kpiTimeFilter changes
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

            const overallAvg = filtered.length > 0 ? (totalRating / filtered.length).toFixed(2) : '0.00';
            let best = '';
            let worst = '';
            let bestAvg = 0;
            let worstAvg = 5;

            for (const item in itemRatings) {
                  const avg = itemRatings[item].reduce((s, r) => s + r, 0) / itemRatings[item].length;
                  if (avg > bestAvg) { bestAvg = avg; best = item; }
                  if (avg < worstAvg) { worstAvg = avg; worst = item; }
            }

            setKpiTotal(filtered.length);
            setKpiAvgRating(overallAvg);
            setKpiBestMeal(best || '—');
            setKpiWorstMeal(worst || '—');
            if (Number(overallAvg) >= 4) setKpiInsight('Excellent performance');
            else if (Number(overallAvg) >= 3) setKpiInsight('Needs improvement');
            else setKpiInsight('Poor performance');
      }, [feedbacks, kpiTimeFilter]);

      const fetchFeedback = async () => {
            try {
                  setLoading(true);
                  const res = await fetch(buildApiUrl('/api/feedback/analytics'));
                  const data = await res.json();
                  setFeedbacks(data);
                  calculateStats(data);
            } catch (err) {
                  console.error(err);
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

                  if (!itemRatings[item.foodItem]) itemRatings[item.foodItem] = [];
                  itemRatings[item.foodItem].push(avg);
            });

            return Object.keys(itemRatings)
                  .map((food) => ({
                        food,
                        rating: parseFloat(
                              (itemRatings[food].reduce((sum, rating) => sum + rating, 0) / itemRatings[food].length).toFixed(2),
                        ),
                  }))
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 5);
      };

      const calculateStats = (data) => {
            let totalRating = 0;
            const itemRatings = {};

            data.forEach((item) => {
                  const avg = (item.tasteRating + item.cleanlinessRating + item.staffBehaviourRating) / 3;

                  totalRating += avg;

                  if (!itemRatings[item.foodItem]) itemRatings[item.foodItem] = [];
                  itemRatings[item.foodItem].push(avg);

            });

            setOverallDateRange(getDateRangeLabel(data));
            setMonthlyData(getMonthlyChartData(data, range));
            setMonthlyDateRange(getMonthlyWindowRangeLabel(range));
            const weeklyChart = getWeeklyChartData(data);
            setWeeklyData(weeklyChart.data);
            setWeeklyDateRange(weeklyChart.rangeLabel);
            const sentimentWindow = getTrailingDaysData(data, sentimentRange);
            setSentimentData(getSentimentSummary(sentimentWindow.data));
            setSentimentDateRange(sentimentWindow.rangeLabel);
            const topFoodWindow = getTrailingDaysData(data, topFoodRange);
            setFoodRatings(getTopFoodRatings(topFoodWindow.data));
            setTopFoodDateRange(topFoodWindow.rangeLabel);

            const overallAvg = data.length > 0 ? (totalRating / data.length).toFixed(2) : '0.00';
            setAvgRating(overallAvg);

            if (Number(overallAvg) >= 4) setInsight('Excellent performance');
            else if (Number(overallAvg) >= 3) setInsight('Needs improvement');
            else setInsight('Poor performance');

            let best = '';
            let worst = '';
            let bestAvg = 0;
            let worstAvg = 5;

            for (const item in itemRatings) {
                  const avg = itemRatings[item].reduce((sum, rating) => sum + rating, 0) / itemRatings[item].length;

                  if (avg > bestAvg) {
                        bestAvg = avg;
                        best = item;
                  }
                  if (avg < worstAvg) {
                        worstAvg = avg;
                        worst = item;
                  }
            }

            setBestMeal(best);
            setWorstMeal(worst);

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

      if (feedbacks.length === 0) {
            return (
                  <div className="min-h-screen flex items-center justify-center text-teal-600 text-xl">
                        No feedback data available yet
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gradient-to-b from-teal-100 via-white to-white px-4 sm:px-6 lg:px-8 py-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-10">
                        <h1 className="text-2xl sm:text-3xl font-bold text-teal-600">Canteen Dashboard</h1>
                  </div>

                  {/* KPI Cards section with time filter */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                              <h2 className="text-base font-bold text-slate-700">Key Metrics</h2>
                              <p className="text-xs text-gray-400 mt-0.5">
                                    Showing stats for: <span className="text-teal-600 font-semibold">{getTimeFilterLabel(kpiTimeFilter)}</span>
                              </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-teal-200 rounded-xl px-3 py-2 shadow-sm hover:border-teal-400 transition w-fit">
                              <FaClock className="text-teal-500 text-xs shrink-0" />
                              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">KPI Period:</span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        <GlassCard title="Total Feedback" value={kpiTotal} badge={getTimeFilterLabel(kpiTimeFilter)} />
                        <GlassCard title="Average Rating" value={`${kpiAvgRating} / 5`} badge={getTimeFilterLabel(kpiTimeFilter)} />
                        <GlassCard title="Best Meal" value={kpiBestMeal} badge={getTimeFilterLabel(kpiTimeFilter)} />
                        <GlassCard title="Worst Meal" value={kpiWorstMeal} color="text-red-500" badge={getTimeFilterLabel(kpiTimeFilter)} />
                        <GlassCard title="Insight" value={kpiInsight} badge={getTimeFilterLabel(kpiTimeFilter)} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 items-stretch">
                        <ChartCard
                              title={
                                    <div className="flex justify-between items-center">
                                          <span>Monthly Trend</span>

                                          <select
                                                value={range}
                                                onChange={(event) => setRange(Number(event.target.value))}
                                                className="text-sm border rounded-md px-2 py-1"
                                          >
                                                <option value={2}>Last 2 Months</option>
                                                <option value={3}>Last 3 Months</option>
                                                <option value={6}>Last 6 Months</option>
                                                <option value={12}>Last 12 Months</option>
                                          </select>
                                    </div>
                              }
                              subtitle={`Showing data from: ${monthlyDateRange}`}
                        >
                              <LineChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" stroke={TEAL} padding={{ left: 20, right: 20 }} />
                                    <YAxis stroke={TEAL} />
                                    <Tooltip />
                                    <Line dataKey="feedback" stroke={TEAL} strokeWidth={3} dot={{ r: 5 }} />
                              </LineChart>
                        </ChartCard>

                        <ChartCard title="Weekly Trend" subtitle={`Showing data from: ${weeklyDateRange}`}>
                              <LineChart data={weeklyData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" stroke={TEAL} padding={{ left: 20, right: 20 }} />
                                    <YAxis stroke={TEAL} />
                                    <Tooltip />
                                    <Line dataKey="feedback" stroke={TEAL} strokeWidth={3} dot={{ r: 5 }} />
                              </LineChart>
                        </ChartCard>

                        <ChartCard
                              title={
                                    <div className="flex justify-between items-center">
                                          <span>Feedback Sentiment</span>

                                          <select
                                                value={sentimentRange}
                                                onChange={(event) => setSentimentRange(Number(event.target.value))}
                                                className="text-sm border rounded-md px-2 py-1"
                                          >
                                                <option value={7}>Last 7 Days</option>
                                                <option value={15}>Last 15 Days</option>
                                                <option value={30}>Last 1 Month</option>
                                          </select>
                                    </div>
                              }
                              subtitle={`Showing data from: ${sentimentDateRange}`}
                        >
                              <BarChart data={sentimentData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" stroke={TEAL} />
                                    <YAxis stroke={TEAL} domain={[0, 'dataMax + 5']} />
                                    <Tooltip />

                                    <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                                          {sentimentData.map((entry, index) => {
                                                let color =
                                                      entry.name === 'Positive'
                                                            ? '#22c55e'
                                                            : entry.name === 'Negative'
                                                              ? '#ef4444'
                                                              : '#facc15';

                                                return <Cell key={index} fill={color} />;
                                          })}

                                          <LabelList
                                                dataKey="value"
                                                position="top"
                                                offset={10}
                                                style={{ fill: '#000', fontWeight: 'bold' }}
                                          />
                                    </Bar>
                              </BarChart>
                        </ChartCard>

                        <ChartCard
                              title={
                                    <div className="flex justify-between items-center">
                                          <span>Top Rated Foods</span>

                                          <select
                                                value={topFoodRange}
                                                onChange={(event) => setTopFoodRange(Number(event.target.value))}
                                                className="text-sm border rounded-md px-2 py-1"
                                          >
                                                <option value={7}>Last 7 Days</option>
                                                <option value={15}>Last 15 Days</option>
                                                <option value={30}>Last 1 Month</option>
                                          </select>
                                    </div>
                              }
                              subtitle={`Showing data from: ${topFoodDateRange}`}
                        >
                              <BarChart
                                    layout="vertical"
                                    data={foodRatings}
                                    margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
                                    barCategoryGap={20}
                              >
                                    <XAxis type="number" domain={[0, 5]} stroke={TEAL} />
                                    <YAxis
                                          type="category"
                                          dataKey="food"
                                          stroke={TEAL}
                                          width={window.innerWidth < 640 ? 80 : 95}
                                    />
                                    <Tooltip />
                                    <Bar
                                          dataKey="rating"
                                          fill={TEAL}
                                          radius={[0, 10, 10, 0]}
                                          barSize={18}
                                          isAnimationActive={false}
                                    >
                                          <LabelList
                                                dataKey="rating"
                                                position="right"
                                                style={{ fill: '#111', fontWeight: '600' }}
                                          />
                                    </Bar>
                              </BarChart>
                        </ChartCard>
                  </div>
            </div>
      );
}

const GlassCard = ({ title, value, color = 'text-gray-800', badge }) => (
      <div className="bg-white rounded-2xl p-4 sm:p-6 text-center shadow hover:-translate-y-2 hover:shadow-xl transition border border-teal-50 flex flex-col items-center gap-1">
            <p className="text-teal-600 font-semibold text-sm">{title}</p>
            <h2 className={`text-xl font-bold ${color}`}>{value}</h2>
            {badge && (
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold bg-teal-50 text-teal-600 border border-teal-100 px-2 py-0.5 rounded-full">
                        <span>⏱</span> {badge}
                  </span>
            )}
      </div>
);

const ChartCard = ({ title, subtitle, children }) => (
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow hover:shadow-xl transition min-h-[350px] flex flex-col">
            <h2 className="font-semibold text-teal-600">{title}</h2>

            {subtitle && <p className="text-sm text-gray-500 mb-2">{subtitle}</p>}

            <div className="flex-1 min-h-[250px]">
                  <ResponsiveContainer
                        width="100%"
                        height={window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 250 : 300}
                  >
                        {children}
                  </ResponsiveContainer>
            </div>
      </div>
);

export default StudentDashboard;
