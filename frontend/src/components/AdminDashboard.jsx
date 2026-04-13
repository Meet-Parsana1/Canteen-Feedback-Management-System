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
import { buildApiUrl } from '../utils/api';

const TEAL = '#0d9488';
const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());

      return `${day}/${month}/${year}`;
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

const filterDataByMonths = (data, rangeInMonths) => {
      const currentDate = new Date();

      return data.filter((item) => {
            const date = new Date(item.createdAt);
            const diffMonths =
                  (currentDate.getFullYear() - date.getFullYear()) * 12 + (currentDate.getMonth() - date.getMonth());

            return diffMonths < rangeInMonths;
      });
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

function AdminDashboard() {
      const navigate = useNavigate();

      const [feedbacks, setFeedbacks] = useState([]);
      const [analyticsData, setAnalyticsData] = useState([]);
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
      const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const [loading, setLoading] = useState(true);
      const [total, setTotal] = useState(0);
      const [monthlyRange, setMonthlyRange] = useState(2);
      const [error, setError] = useState('');

      useEffect(() => {
            const token = localStorage.getItem('adminToken');

            if (!token) {
                  navigate('/admin/login');
            }
      }, [navigate]);

      useEffect(() => {
            fetchFeedback();
      }, [page]);

      useEffect(() => {
            setMonthlyData(getMonthlyChartData(analyticsData, monthlyRange));
            setMonthlyDateRange(getMonthlyWindowRangeLabel(monthlyRange));
      }, [analyticsData, monthlyRange]);

      const fetchFeedback = async () => {
            try {
                  setLoading(true);
                  setError('');

                  const token = localStorage.getItem('adminToken');

                  if (!token) {
                        navigate('/admin/login');
                        return;
                  }

                  const res = await fetch(buildApiUrl(`/api/feedback?page=${page}&limit=10`), {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });

                  if (res.status === 401) {
                        localStorage.removeItem('adminToken');
                        navigate('/admin/login');
                        return;
                  }

                  if (!res.ok) {
                        throw new Error('Failed to fetch feedback list');
                  }

                  const result = await res.json();

                  setTotal(result.total);
                  setFeedbacks(result.data);
                  setTotalPages(result.pages || 1);

                  const analyticsRes = await fetch(buildApiUrl('/api/feedback/analytics'), {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });

                  if (!analyticsRes.ok) {
                        throw new Error('Failed to fetch dashboard analytics');
                  }

                  const analytics = await analyticsRes.json();
                  setAnalyticsData(analytics);
                  calculateStats(analytics);
            } catch (err) {
                  console.error(err);
                  setError(err.message || 'Unable to load dashboard');
            } finally {
                  setLoading(false);
            }
      };

      const logout = () => {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
      };

      const calculateStats = (data) => {
            let totalRating = 0;
            const itemRatings = {};
            const weekly = {};

            let positive = 0;
            let negative = 0;
            let neutral = 0;

            data.forEach((item) => {
                  const avg = (item.tasteRating + item.cleanlinessRating + item.staffBehaviourRating) / 3;

                  totalRating += avg;

                  if (avg >= 4) positive += 1;
                  else if (avg < 3) negative += 1;
                  else neutral += 1;

                  if (!itemRatings[item.foodItem]) {
                        itemRatings[item.foodItem] = [];
                  }

                  itemRatings[item.foodItem].push(avg);

                  const date = new Date(item.createdAt);
                  const day = date.toLocaleString('default', { weekday: 'short' });

                  weekly[day] = (weekly[day] || 0) + 1;
            });

            setOverallDateRange(getDateRangeLabel(data));
            setMonthlyData(getMonthlyChartData(data, monthlyRange));
            setMonthlyDateRange(getMonthlyWindowRangeLabel(monthlyRange));

            const sortedWeekly = Object.keys(weekly)
                  .map((day) => ({ day, feedback: weekly[day] }))
                  .sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));

            setWeeklyData(sortedWeekly);
            setSentimentData([
                  { name: 'Positive', value: positive },
                  { name: 'Neutral', value: neutral },
                  { name: 'Negative', value: negative },
            ]);

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

            setBestMeal(best || 'N/A');
            setWorstMeal(worst || 'N/A');

            const foods = Object.keys(itemRatings)
                  .map((food) => ({
                        food,
                        rating: parseFloat(
                              (itemRatings[food].reduce((sum, rating) => sum + rating, 0) / itemRatings[food].length).toFixed(2),
                        ),
                  }))
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 5);

            setFoodRatings(foods);
      };

      const exportExcel = () => {
            const filteredData = feedbacks.map((feedback) => ({
                  'Enrollment Number': feedback.enrollmentNumber,
                  'Food Item': feedback.foodItem,
                  'Taste Rating': feedback.tasteRating,
                  Cleanliness: feedback.cleanlinessRating,
                  'Staff Behaviour': feedback.staffBehaviourRating,
                  Comments: feedback.comments,
            }));

            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            worksheet['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 30 }];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');

            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAs(new Blob([buffer]), 'report.xlsx');
      };

      const deleteFeedback = async (id) => {
            const confirmDelete = window.confirm('Delete this feedback?');
            if (!confirmDelete) return;

            try {
                  const token = localStorage.getItem('adminToken');

                  const response = await fetch(buildApiUrl(`/api/feedback/${id}`), {
                        method: 'DELETE',
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });

                  if (response.status === 401) {
                        localStorage.removeItem('adminToken');
                        navigate('/admin/login');
                        return;
                  }

                  if (!response.ok) {
                        throw new Error('Failed to delete feedback');
                  }

                  if (feedbacks.length === 1 && page > 1) {
                        setPage((currentPage) => currentPage - 1);
                  } else {
                        fetchFeedback();
                  }
            } catch (err) {
                  console.error(err);
                  setError(err.message || 'Unable to delete feedback');
            }
      };

      if (loading) {
            return (
                  <div className="flex items-center justify-center h-screen text-teal-600 text-xl">
                        Loading dashboard...
                  </div>
            );
      }

      if (error) {
            return (
                  <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
                        <div className="max-w-xl rounded-2xl bg-white p-6 shadow-lg text-left">
                              <h1 className="text-2xl font-bold text-teal-600 mb-3">Admin dashboard unavailable</h1>
                              <p className="text-gray-600 mb-4">
                                    {error}. This usually means the admin token expired or the API URL/CORS settings are not
                                    aligned between Vercel and Render.
                              </p>
                              <div className="flex flex-wrap gap-3">
                                    <button
                                          onClick={fetchFeedback}
                                          className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg text-white"
                                    >
                                          Retry
                                    </button>
                                    <button
                                          onClick={logout}
                                          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-gray-800"
                                    >
                                          Back to login
                                    </button>
                              </div>
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gradient-to-b from-teal-100 via-white to-white px-4 sm:px-6 lg:px-8 py-6">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        <GlassCard title="Total Feedback" value={total} />
                        <GlassCard title="Average Rating" value={`${avgRating} / 5`} />
                        <GlassCard title="Best Meal" value={bestMeal} />
                        <GlassCard title="Worst Meal" value={worstMeal} color="text-red-500" />
                        <GlassCard title="Insight" value={insight} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 items-stretch">
                        <ChartCard
                              title={
                                    <div className="flex justify-between items-center">
                                          <span>Monthly Trend</span>

                                          <select
                                                value={monthlyRange}
                                                onChange={(event) => setMonthlyRange(Number(event.target.value))}
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
                              {monthlyData.length === 0 || monthlyData.every((item) => item.feedback === 0) ? (
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

                        <ChartCard title="Weekly Trend" subtitle={`Showing data from: ${overallDateRange}`}>
                              <LineChart data={weeklyData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" stroke={TEAL} padding={{ left: 20, right: 20 }} />
                                    <YAxis stroke={TEAL} />
                                    <Tooltip />
                                    <Line dataKey="feedback" stroke={TEAL} strokeWidth={3} dot={{ r: 5 }} />
                              </LineChart>
                        </ChartCard>

                        <ChartCard title="Feedback Sentiment" subtitle={`Showing data from: ${overallDateRange}`}>
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

                        <ChartCard title="Top Rated Food" subtitle={`Showing data from: ${overallDateRange}`}>
                              <BarChart layout="vertical" data={foodRatings} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                                    <XAxis type="number" domain={[0, 5]} stroke={TEAL} />
                                    <YAxis type="category" dataKey="food" stroke={TEAL} width={95} tick={{ fontSize: 14 }} />
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
                              <div className="min-w-[600px] grid grid-cols-5 font-bold text-teal-600 border-b pb-2">
                                    <div>Enrollment</div>
                                    <div>Food Item</div>
                                    <div>Rating</div>
                                    <div>Comments</div>
                                    <div>Action</div>
                              </div>

                              <div className="max-h-[400px] overflow-y-auto mt-2 min-w-[600px]">
                                    {feedbacks.map((feedback) => (
                                          <div
                                                key={feedback._id}
                                                className="grid grid-cols-5 py-3 border-b hover:bg-teal-50 transition text-sm"
                                          >
                                                <div>{feedback.enrollmentNumber}</div>
                                                <div>{feedback.foodItem}</div>

                                                <div className="text-teal-600 font-semibold">
                                                      {(
                                                            (feedback.tasteRating +
                                                                  feedback.cleanlinessRating +
                                                                  feedback.staffBehaviourRating) /
                                                            3
                                                      ).toFixed(1)}{' '}
                                                      / 5
                                                </div>

                                                <div className="text-gray-600">{feedback.comments}</div>

                                                <div>
                                                      <button
                                                            onClick={() => deleteFeedback(feedback._id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded-lg text-xs"
                                                      >
                                                            Delete
                                                      </button>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>

                        <div className="flex justify-center items-center gap-4 mt-6">
                              <button
                                    onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
                                    disabled={page === 1}
                                    className={`px-4 py-2 rounded-lg ${
                                          page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'
                                    }`}
                              >
                                    Previous
                              </button>

                              <span className="font-semibold text-gray-700">
                                    {page} / {totalPages}
                              </span>

                              <button
                                    onClick={() => setPage((currentPage) => Math.min(currentPage + 1, totalPages))}
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
                        height={window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 250 : 300}
                  >
                        {children}
                  </ResponsiveContainer>
            </div>
      </div>
);

export default AdminDashboard;
