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

import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../utils/api';

const TEAL = '#0d9488';

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
      const [dateRange, setDateRange] = useState('');
      const [range, setRange] = useState(2); // default last 2 months

      useEffect(() => {
            fetchFeedback();
      }, []);

      const fetchFeedback = async () => {
            const res = await fetch(buildApiUrl('/api/feedback/analytics'));

            const data = await res.json();
            setFeedbacks(data);
            calculateStats(data);
      };

      const calculateStats = (data) => {
            let totalRating = 0;
            const itemRatings = {};
            const monthly = {};
            const now = new Date();

            data.forEach((item) => {
                  const date = new Date(item.createdAt);

                  // ✅ FILTER BASED ON SELECTED RANGE
                  const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

                  if (diffMonths >= range) return;

                  const month = date.toLocaleString('default', { month: 'short' });

                  monthly[month] = (monthly[month] || 0) + 1;
            });
            const weekly = {};

            let positive = 0,
                  negative = 0,
                  neutral = 0;

            data.forEach((item) => {
                  const avg = (item.tasteRating + item.cleanlinessRating + item.staffBehaviourRating) / 3;

                  totalRating += avg;

                  if (avg >= 4) positive++;
                  else if (avg < 3) negative++;
                  else neutral++;

                  if (!itemRatings[item.foodItem]) itemRatings[item.foodItem] = [];
                  itemRatings[item.foodItem].push(avg);

                  const date = new Date(item.createdAt);
                  const month = date.toLocaleString('default', { month: 'short' });
                  const day = date.toLocaleString('default', { weekday: 'short' });

                  monthly[month] = (monthly[month] || 0) + 1;
                  weekly[day] = (weekly[day] || 0) + 1;
            });

            if (data.length > 0) {
                  const dates = data.map((d) => new Date(d.createdAt));
                  const min = new Date(Math.min(...dates));
                  const max = new Date(Math.max(...dates));

                  setDateRange(`${min.toLocaleDateString()} - ${max.toLocaleDateString()}`);
            }

            // ✅ SORT MONTHS
            const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const sortedMonthly = Object.keys(monthly)
                  .map((m) => ({ month: m, feedback: monthly[m] }))
                  .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

            setMonthlyData(sortedMonthly);

            // ✅ SORT DAYS
            const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const sortedWeekly = Object.keys(weekly)
                  .map((d) => ({ day: d, feedback: weekly[d] }))
                  .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

            setWeeklyData(sortedWeekly);

            // SENTIMENT
            const sentimentArr = [
                  { name: 'Positive', value: positive },
                  { name: 'Neutral', value: neutral },
                  { name: 'Negative', value: negative },
            ];

            setSentimentData(sentimentArr);

            const overallAvg = (totalRating / data.length).toFixed(2);
            setAvgRating(overallAvg);

            if (overallAvg >= 4) setInsight('🔥 Excellent performance');
            else if (overallAvg >= 3) setInsight('⚠ Needs improvement');
            else setInsight('🚨 Poor performance');

            let best = '',
                  worst = '';
            let bestAvg = 0,
                  worstAvg = 5;

            for (let item in itemRatings) {
                  const avg = itemRatings[item].reduce((a, b) => a + b, 0) / itemRatings[item].length;

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

            const foods = Object.keys(itemRatings)
                  .map((food) => ({
                        food,
                        rating: parseFloat(
                              (itemRatings[food].reduce((a, b) => a + b, 0) / itemRatings[food].length).toFixed(2),
                        ),
                  }))
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 5);

            setFoodRatings(foods);
      };

      if (feedbacks.length === 0) {
            return (
                  <div className="min-h-screen flex items-center justify-center text-teal-600 text-xl">
                        No feedback data available yet
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gradient-to-b from-teal-100 via-white to-white px-4 sm:px-6 lg:px-8 py-6">
                  {/* HEADER */}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-10">
                        <h1 className="text-2xl sm:text-3xl font-bold text-teal-600">Canteen Dashboard</h1>
                  </div>

                  {/* KPI */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        <GlassCard title="Total Feedback" value={feedbacks.length} />
                        <GlassCard title="Average Rating" value={`${avgRating} ⭐`} />
                        <GlassCard title="Best Meal" value={bestMeal} />
                        <GlassCard title="Worst Meal" value={worstMeal} color="text-red-500" />
                        <GlassCard title="Insight" value={insight} />
                  </div>

                  {/* CHARTS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 items-stretch">
                        <ChartCard
                              title={
                                    <div className="flex justify-between items-center">
                                          <span>Monthly Trend</span>

                                          <select
                                                value={range}
                                                onChange={(e) => setRange(Number(e.target.value))}
                                                className="text-sm border rounded-md px-2 py-1"
                                          >
                                                <option value={2}>Last 2 Months</option>
                                                <option value={3}>Last 3 Months</option>
                                                <option value={6}>Last 6 Months</option>
                                                <option value={12}>Last 12 Months</option>
                                          </select>
                                    </div>
                              }
                              subtitle={`Showing data from: ${dateRange}`}
                        >
                              <LineChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" stroke={TEAL} padding={{ left: 20, right: 20 }} />
                                    <YAxis stroke={TEAL} />
                                    <Tooltip />
                                    <Line dataKey="feedback" stroke={TEAL} strokeWidth={3} dot={{ r: 5 }} />
                              </LineChart>
                        </ChartCard>

                        <ChartCard title="Weekly Trend" subtitle={`Showing data from: ${dateRange}`}>
                              <LineChart data={weeklyData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" stroke={TEAL} padding={{ left: 20, right: 20 }} />
                                    <YAxis stroke={TEAL} />
                                    <Tooltip />
                                    <Line dataKey="feedback" stroke={TEAL} strokeWidth={3} dot={{ r: 5 }} />
                              </LineChart>
                        </ChartCard>

                        {/* SENTIMENT */}
                        <ChartCard title="Feedback Sentiment" subtitle={`Showing data from: ${dateRange}`}>
                              <BarChart data={sentimentData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" stroke={TEAL} />
                                    <YAxis stroke={TEAL} domain={[0, 'dataMax + 5']} />
                                    <Tooltip />

                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
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

                        {/* TOP FOODS */}
                        <ChartCard title="Top Rated Foods" subtitle={`Showing data from: ${dateRange}`}>
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
                                    <Bar dataKey="rating" fill={TEAL} radius={[0, 10, 10, 0]} barSize={18}>
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

/* CARD */
const GlassCard = ({ title, value, color = 'text-gray-800' }) => (
      <div className="bg-white rounded-2xl p-4 sm:p-6 text-center shadow hover:-translate-y-2 hover:shadow-xl transition border border-teal-50">
            <p className="text-teal-600 font-semibold">{title}</p>
            <h2 className={`text-xl font-bold ${color}`}>{value}</h2>
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
