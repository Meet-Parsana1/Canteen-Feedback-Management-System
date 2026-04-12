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

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileExcel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TEAL = '#0d9488';

function AdminDashboard() {
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
      const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const [loading, setLoading] = useState(true);
      const [total, setTotal] = useState(0);
      const [monthlyRange, setMonthlyRange] = useState(2);

      useEffect(() => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                  navigate('/admin/login');
                  return;
            }
            fetchFeedback();
      }, []);

      const fetchFeedback = async () => {
            try {
                  setLoading(true);

                  const token = localStorage.getItem('adminToken');

                  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback?page=${page}&limit=10`, {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });

                  if (!res.ok) throw new Error('Failed to fetch');

                  const result = await res.json();

                  setTotal(result.total);

                  setFeedbacks(result.data);
                  setTotalPages(result.pages);

                  const analyticsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback/analytics`, {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });
                  const analyticsData = await analyticsRes.json();

                  calculateStats(analyticsData);
            } catch (err) {
                  console.error(err);
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchFeedback();
      }, [page, monthlyRange]);

      const logout = () => {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
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

                  if (diffMonths >= monthlyRange) return;

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
                  const day = date.toLocaleString('default', { weekday: 'short' });

                  weekly[day] = (weekly[day] || 0) + 1;
            });

            // ✅ SORT MONTHS
            const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const lastMonths = [];
            const nowDate = new Date();

            for (let i = monthlyRange - 1; i >= 0; i--) {
                  const d = new Date(nowDate.getFullYear(), nowDate.getMonth() - i, 1);
                  const m = d.toLocaleString('default', { month: 'short' });
                  lastMonths.push(m);
            }

            const sortedMonthly = lastMonths.map((m) => ({
                  month: m,
                  feedback: monthly[m] || 0,
            }));

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

            const end = new Date();
            const start = new Date();
            start.setMonth(end.getMonth() - (monthlyRange - 1));

            const formatDate = (date) => {
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = String(date.getFullYear()).slice(-2); // last 2 digits
                  return `${day}/${month}/${year}`;
            };

            setDateRange(`${formatDate(start)} - ${formatDate(end)}`);
      };

      const exportExcel = () => {
            // ✅ Filter only required fields
            const filteredData = feedbacks.map((f) => ({
                  'Enrollment Number': f.enrollmentNumber,
                  'Food Item': f.foodItem,
                  'Taste Rating': f.tasteRating,
                  Cleanliness: f.cleanlinessRating,
                  'Staff Behaviour': f.staffBehaviourRating,
                  Comments: f.comments,
            }));

            const ws = XLSX.utils.json_to_sheet(filteredData);
            ws['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 30 }];
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Feedback');

            const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            saveAs(new Blob([buf]), 'report.xlsx');
      };

      const deleteFeedback = async (id) => {
            const confirmDelete = window.confirm('Delete this feedback?');
            if (!confirmDelete) return;

            try {
                  const token = localStorage.getItem('adminToken');

                  await fetch(`${import.meta.env.VITE_API_URL}/api/feedback/${id}`, {
                        method: 'DELETE',
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });

                  // ✅ FIX: handle last item deletion on page
                  if (feedbacks.length === 1 && page > 1) {
                        setPage(page - 1);
                  } else {
                        fetchFeedback();
                  }
            } catch (err) {
                  console.error(err);
            }
      };

      if (loading) {
            return (
                  <div className="flex items-center justify-center h-screen text-teal-600 text-xl">
                        Loading dashboard...
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gradient-to-b from-teal-100 via-white to-white px-4 sm:px-6 lg:px-8 py-6">
                  {/* HEADER */}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-10">
                        <h1 className="text-2xl sm:text-3xl font-bold text-teal-600">
                              Canteen Feedback Admin Dashboard
                        </h1>

                        <button
                              onClick={logout}
                              className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg text-white shadow w-fit self-start sm:self-auto text-sm"
                        >
                              Logout
                        </button>
                  </div>

                  {/* KPI */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        <GlassCard title="Total Feedback" value={total} />
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
                                                value={monthlyRange}
                                                onChange={(e) => setMonthlyRange(Number(e.target.value))}
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
                              {monthlyData.length === 0 || monthlyData.every((d) => d.feedback === 0) ? (
                                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                          No data available for selected time range
                                    </div>
                              ) : (
                                    <LineChart data={monthlyData}>
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis dataKey="month" stroke={TEAL} />
                                          <YAxis stroke={TEAL} />
                                          <Tooltip />
                                          <Line dataKey="feedback" stroke={TEAL} strokeWidth={3} />
                                    </LineChart>
                              )}
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
                              <BarChart data={sentimentData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
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
                        <ChartCard title="Top Rated Food" subtitle={`Showing data from: ${dateRange}`}>
                              <BarChart
                                    layout="vertical"
                                    data={foodRatings}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                              >
                                    <XAxis type="number" domain={[0, 5]} stroke={TEAL} />
                                    <YAxis
                                          type="category"
                                          dataKey="food"
                                          stroke={TEAL}
                                          width={95}
                                          tick={{ fontSize: 14 }}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="rating" fill={TEAL} radius={[0, 10, 10, 0]}>
                                          <LabelList
                                                dataKey="rating"
                                                position="right"
                                                offset={10}
                                                style={{ fill: '#000', fontWeight: 'bold' }}
                                          />
                                    </Bar>
                              </BarChart>
                        </ChartCard>
                  </div>

                  {/* TABLE */}
                  <div className="mt-12 bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                              <div>
                                    <h2 className="text-xl font-semibold text-teal-600">All Feedback</h2>
                                    <p className="text-sm text-gray-500">Complete list of student responses</p>
                              </div>

                              <button
                                    onClick={exportExcel}
                                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl text-white w-fit"
                              >
                                    <FaFileExcel /> Export
                              </button>
                        </div>

                        <div className="overflow-x-auto">
                              {/* HEADERS */}
                              <div className="min-w-[600px] grid grid-cols-5 font-bold text-teal-600 border-b pb-2">
                                    <div>Enrollment</div>
                                    <div>Food Item</div>
                                    <div>Rating</div>
                                    <div>Comments</div>
                                    <div>Action</div>
                              </div>

                              <div className="max-h-[400px] overflow-y-auto mt-2 min-w-[600px]">
                                    {feedbacks.map((f, i) => (
                                          <div
                                                key={i}
                                                className="grid grid-cols-5 py-3 border-b hover:bg-teal-50 transition text-sm"
                                          >
                                                <div>{f.enrollmentNumber}</div>
                                                <div>{f.foodItem}</div>

                                                <div className="text-teal-600 font-semibold">
                                                      {(
                                                            (f.tasteRating +
                                                                  f.cleanlinessRating +
                                                                  f.staffBehaviourRating) /
                                                            3
                                                      ).toFixed(1)}{' '}
                                                      ⭐
                                                </div>

                                                <div className="text-gray-600">{f.comments}</div>

                                                <div>
                                                      <button
                                                            onClick={() => deleteFeedback(f._id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded-lg text-xs"
                                                      >
                                                            Delete
                                                      </button>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                        {/* PAGINATION */}
                        <div className="flex justify-center items-center gap-4 mt-6">
                              <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className={`px-4 py-2 rounded-lg ${
                                          page === 1
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-teal-600 hover:bg-teal-700 text-white'
                                    }`}
                              >
                                    Previous
                              </button>

                              <span className="font-semibold text-gray-700">
                                    {page} / {totalPages}
                              </span>

                              <button
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className={`px-4 py-2 rounded-lg ${
                                          page === totalPages
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-teal-600 hover:bg-teal-700 text-white'
                                    }`}
                              >
                                    Next
                              </button>
                        </div>
                  </div>
            </div>
      );
}

/* CARD */
const GlassCard = ({ title, value, color = 'text-gray-800' }) => (
      <div className="bg-white rounded-2xl p-6 text-center shadow hover:-translate-y-2 hover:shadow-xl transition">
            <p className="text-teal-600 font-semibold">{title}</p>
            <h2 className={`text-xl font-bold ${color}`}>{value}</h2>
      </div>
);

const ChartCard = ({ title, subtitle, children }) => (
      <div className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition min-h-[350px] flex flex-col">
            <h2 className="font-semibold text-teal-600">{title}</h2>

            {subtitle && <p className="text-sm text-gray-500 mb-2">{subtitle}</p>}

            <div className="flex-1 min-h-[250px]">
                  <ResponsiveContainer
                        width="100%"
                        height={
                              window.innerWidth < 640
                                    ? 200 // smaller for mobile
                                    : window.innerWidth < 1024
                                      ? 250
                                      : 300
                        }
                  >
                        {children}
                  </ResponsiveContainer>
            </div>
      </div>
);

export default AdminDashboard;
