import { useEffect, useRef, useState } from 'react';
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
import { FaFileExcel, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../utils/api';
import CanteenLoader from './CanteenLoader';
import Toast from './Toast';

const TEAL = '#0d9488';

const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());

      return `${day}/${month}/${year}`;
};

const formatDateTime = (dateString) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');

      return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
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

const getTimeRangeDates = (filter) => {
      const now = new Date();
      let start = null;
      let end = now.toISOString();

      if (filter === 'today') {
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            start = todayStart.toISOString();
      } else if (filter === '24h') {
            const d = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            start = d.toISOString();
      } else if (filter === '7d') {
            const d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            start = d.toISOString();
      } else if (filter === '30d') {
            const d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            start = d.toISOString();
      } else if (filter === 'month') {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
            start = monthStart.toISOString();
      } else if (filter === '90d') {
            const d = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            start = d.toISOString();
      }

      return { start, end };
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
      const [weeklyDateRange, setWeeklyDateRange] = useState('');
      const [sentimentDateRange, setSentimentDateRange] = useState('');
      const [topFoodDateRange, setTopFoodDateRange] = useState('');
      const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const [loading, setLoading] = useState(true);
      const [feedbackLoading, setFeedbackLoading] = useState(false);
      const initialLoadDone = useRef(false);
      const [total, setTotal] = useState(0);
      const [monthlyRange, setMonthlyRange] = useState(2);
      const [sentimentRange, setSentimentRange] = useState(7);
      const [topFoodRange, setTopFoodRange] = useState(7);
      const [timeFilter, setTimeFilter] = useState('all');
      const [exporting, setExporting] = useState(false);
      const [error, setError] = useState('');
      const [kpiTimeFilter, setKpiTimeFilter] = useState('all');
      const [kpiTotal, setKpiTotal] = useState(0);
      const [kpiAvgRating, setKpiAvgRating] = useState('0.00');
      const [kpiBestMeal, setKpiBestMeal] = useState('N/A');
      const [kpiWorstMeal, setKpiWorstMeal] = useState('N/A');
      const [kpiInsight, setKpiInsight] = useState('');
      const [toast, setToast] = useState(null);

      useEffect(() => {
            const token = localStorage.getItem('adminToken');

            if (!token) {
                  navigate('/admin/login');
            }
      }, [navigate]);

      useEffect(() => {
            fetchFeedback();
      }, [page, timeFilter]);

      // Recompute KPI cards whenever analyticsData or kpiTimeFilter changes
      useEffect(() => {
            const filtered = getKpiFilteredData(analyticsData, kpiTimeFilter);
            const itemRatings = {};
            let totalRating = 0;

            filtered.forEach((item) => {
                  const avg = (item.tasteRating + item.cleanlinessRating + item.staffBehaviourRating) / 3;
                  totalRating += avg;
                  if (!itemRatings[item.foodItem]) itemRatings[item.foodItem] = [];
                  itemRatings[item.foodItem].push(avg);
            });

            const overallAvg = filtered.length > 0 ? (totalRating / filtered.length).toFixed(2) : '0.00';
            let best = 'N/A';
            let worst = 'N/A';
            let bestAvg = 0;
            let worstAvg = 5;

            for (const item in itemRatings) {
                  const avg = itemRatings[item].reduce((s, r) => s + r, 0) / itemRatings[item].length;
                  if (avg > bestAvg) { bestAvg = avg; best = item; }
                  if (avg < worstAvg) { worstAvg = avg; worst = item; }
            }

            setKpiTotal(filtered.length);
            setKpiAvgRating(overallAvg);
            setKpiBestMeal(best);
            setKpiWorstMeal(worst);
            if (Number(overallAvg) >= 4) setKpiInsight('Excellent performance');
            else if (Number(overallAvg) >= 3) setKpiInsight('Needs improvement');
            else setKpiInsight('Poor performance');
      }, [analyticsData, kpiTimeFilter]);

      useEffect(() => {
            setMonthlyData(getMonthlyChartData(analyticsData, monthlyRange));
            setMonthlyDateRange(getMonthlyWindowRangeLabel(monthlyRange));
      }, [analyticsData, monthlyRange]);

      useEffect(() => {
            const sentimentWindow = getTrailingDaysData(analyticsData, sentimentRange);
            const sentimentSummary = getSentimentSummary(sentimentWindow.data);

            setSentimentData(sentimentSummary);
            setSentimentDateRange(sentimentWindow.rangeLabel);
      }, [analyticsData, sentimentRange]);

      useEffect(() => {
            const topFoodWindow = getTrailingDaysData(analyticsData, topFoodRange);
            setFoodRatings(getTopFoodRatings(topFoodWindow.data));
            setTopFoodDateRange(topFoodWindow.rangeLabel);
      }, [analyticsData, topFoodRange]);

      const fetchFeedback = async () => {
            try {
                  const isInitialLoad = !initialLoadDone.current;
                  if (isInitialLoad) {
                        setLoading(true);
                  } else {
                        setFeedbackLoading(true);
                  }
                  setError('');

                  const token = localStorage.getItem('adminToken');

                  if (!token) {
                        navigate('/admin/login');
                        return;
                  }

                  let feedbackUrl = `/api/feedback?page=${page}&limit=10`;
                  const { start, end } = getTimeRangeDates(timeFilter);
                  if (start) {
                        feedbackUrl += `&startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`;
                  }

                  const res = await fetch(buildApiUrl(feedbackUrl), {
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
                  initialLoadDone.current = true;
            } catch (err) {
                  console.error(err);
                  setError(err.message || 'Unable to load dashboard');
            } finally {
                  setLoading(false);
                  setFeedbackLoading(false);
            }
      };

      const logout = () => {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
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

                  if (!itemRatings[item.foodItem]) {
                        itemRatings[item.foodItem] = [];
                  }

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

                  if (!itemRatings[item.foodItem]) {
                        itemRatings[item.foodItem] = [];
                  }

                  itemRatings[item.foodItem].push(avg);

            });

            setOverallDateRange(getDateRangeLabel(data));
            setMonthlyData(getMonthlyChartData(data, monthlyRange));
            setMonthlyDateRange(getMonthlyWindowRangeLabel(monthlyRange));
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

            setBestMeal(best || 'N/A');
            setWorstMeal(worst || 'N/A');

      };

      const exportExcel = async () => {
            try {
                  setExporting(true);
                  const token = localStorage.getItem('adminToken');
                  if (!token) {
                        navigate('/admin/login');
                        return;
                  }

                  // Fetch ALL feedbacks belonging to the selected time context (up to 10000 records)
                  let exportUrl = `/api/feedback?page=1&limit=10000`;
                  const { start, end } = getTimeRangeDates(timeFilter);
                  if (start) {
                        exportUrl += `&startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`;
                  }

                  const res = await fetch(buildApiUrl(exportUrl), {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });

                  if (!res.ok) {
                        throw new Error('Failed to fetch data for export');
                  }

                  const result = await res.json();
                  const exportRecords = result.data || [];

                  if (exportRecords.length === 0) {
                        setToast({ message: `No feedback records found to export for "${getTimeFilterLabel(timeFilter)}".`, type: "warning" });
                        return;
                  }

                  const timeLabel = getTimeFilterLabel(timeFilter);
                  const generationTime = formatDateTime(new Date().toISOString());

                  // 1. Report Header Metadata Rows with clear time context
                  const metadataHeader = [
                        { 'Enrollment Number': 'REPORT TITLE:', 'Food Item': 'CanteenIQ Student Feedback Report' },
                        { 'Enrollment Number': 'SELECTED TIME FRAME:', 'Food Item': timeLabel },
                        { 'Enrollment Number': 'REPORT GENERATED ON:', 'Food Item': generationTime },
                        { 'Enrollment Number': 'TOTAL FEEDBACKS EXPORTED:', 'Food Item': `${exportRecords.length} student responses` },
                        {}, // Blank separator row
                  ];

                  // 2. Tabular feedback records
                  const tableRows = exportRecords.map((feedback) => {
                        const avg = (
                              (feedback.tasteRating +
                                    feedback.cleanlinessRating +
                                    feedback.staffBehaviourRating) /
                              3
                        ).toFixed(1);

                        return {
                              'Enrollment Number': feedback.enrollmentNumber,
                              'Food Item': feedback.foodItem,
                              'Taste Rating': `${feedback.tasteRating} / 5`,
                              'Cleanliness Rating': `${feedback.cleanlinessRating} / 5`,
                              'Staff Behaviour': `${feedback.staffBehaviourRating} / 5`,
                              'Average Rating': `${avg} / 5`,
                              'Submitted Date & Time': formatDateTime(feedback.createdAt),
                              Comments: feedback.comments || 'No comment provided',
                        };
                  });

                  const combinedData = [...metadataHeader, ...tableRows];
                  const worksheet = XLSX.utils.json_to_sheet(combinedData);

                  // Formatting column widths
                  worksheet['!cols'] = [
                        { wch: 26 }, // Enrollment Number
                        { wch: 22 }, // Food Item
                        { wch: 16 }, // Taste Rating
                        { wch: 18 }, // Cleanliness Rating
                        { wch: 18 }, // Staff Behaviour
                        { wch: 16 }, // Average Rating
                        { wch: 24 }, // Submitted Date & Time
                        { wch: 40 }, // Comments
                  ];

                  const workbook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(workbook, worksheet, `Feedback (${timeLabel.slice(0, 15)})`);

                  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                  const now = new Date();
                  const dateStamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                  const cleanTimeLabel = timeLabel.replace(/\s+/g, '_');
                  const filename = `CanteenIQ_Feedback_${cleanTimeLabel}_${dateStamp}.xlsx`;

                  saveAs(new Blob([buffer]), filename);
                  setToast({ message: `Feedback exported successfully for ${timeLabel}!`, type: 'success' });
            } catch (err) {
                  console.error('Export error:', err);
                  setToast({ message: 'Failed to export feedback: ' + err.message, type: 'error' });
            } finally {
                  setExporting(false);
            }
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
                  <CanteenLoader
                        fullScreen={true}
                        text="Loading Admin Analytics..."
                        subtext="Aggregating student dining feedback, sentiment distributions & reports..."
                  />
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
            <div className="min-h-screen bg-gradient-to-b from-teal-100 via-white to-white px-4 sm:px-6 lg:px-8 py-6 relative">
                  {toast && (
                        <Toast
                              message={toast.message}
                              type={toast.type}
                              onClose={() => setToast(null)}
                        />
                  )}
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
                              <BarChart data={sentimentData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
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
                                          <span>Top Rated Food</span>

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
                              <BarChart layout="vertical" data={foodRatings} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                                    <XAxis type="number" domain={[0, 5]} stroke={TEAL} />
                                    <YAxis type="category" dataKey="food" stroke={TEAL} width={95} tick={{ fontSize: 14 }} />
                                    <Tooltip />
                                    <Bar dataKey="rating" fill={TEAL} radius={[0, 10, 10, 0]} isAnimationActive={false}>
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

                  <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-gray-100">
                              <div>
                                    <div className="flex items-center gap-2.5">
                                          <h2 className="text-xl font-bold text-teal-700">All Feedback</h2>
                                          <span className="text-xs font-bold bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full border border-teal-200">
                                                {total} {total === 1 ? 'Response' : 'Responses'}
                                          </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                          {timeFilter === 'all'
                                                ? 'Showing all-time recorded student feedback'
                                                : `Showing feedback filtered by selected time range`}
                                    </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-3">
                                    {/* Time Filter Context Dropdown */}
                                    <div className="flex items-center gap-2 bg-slate-50 border border-teal-200/90 rounded-xl px-3 py-2 shadow-sm hover:border-teal-400 transition">
                                          <FaClock className="text-teal-600 text-sm shrink-0" />
                                          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Time Range:</span>
                                          <select
                                                value={timeFilter}
                                                onChange={(e) => {
                                                      setTimeFilter(e.target.value);
                                                      setPage(1);
                                                }}
                                                className="bg-transparent text-xs sm:text-sm font-bold text-teal-700 outline-none cursor-pointer pr-1"
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

                                    {/* Export Button with time context label */}
                                    <button
                                          onClick={exportExcel}
                                          disabled={exporting}
                                          title={`Export all feedback for ${getTimeFilterLabel(timeFilter)}`}
                                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-xs sm:text-sm transition shadow-sm hover:shadow ${
                                                exporting
                                                      ? 'bg-teal-400 cursor-not-allowed opacity-80'
                                                      : 'bg-teal-600 hover:bg-teal-700 active:scale-95'
                                          }`}
                                    >
                                          <FaFileExcel className="shrink-0" />
                                          <span>{exporting ? 'Exporting...' : `Export (${getTimeFilterLabel(timeFilter)})`}</span>
                                    </button>
                              </div>
                        </div>

                        <div className="overflow-x-auto">
                              <div className="min-w-[720px] grid grid-cols-6 font-bold text-teal-700 border-b pb-2.5 text-xs sm:text-sm">
                                    <div>Enrollment</div>
                                    <div>Food Item</div>
                                    <div>Rating</div>
                                    <div>Date & Time</div>
                                    <div>Comments</div>
                                    <div>Action</div>
                              </div>

                              <div className={`relative max-h-[420px] overflow-y-auto mt-2 min-w-[720px] ${feedbackLoading ? 'pointer-events-none' : ''}`}>
                                    {feedbackLoading && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-xs z-10">
                                                <span className="text-teal-600 font-bold text-sm animate-pulse">Loading feedback...</span>
                                          </div>
                                    )}

                                    {feedbacks.length === 0 && !feedbackLoading && (
                                          <div className="py-12 text-center text-gray-400 text-sm">
                                                No feedback found for the selected time filter.
                                          </div>
                                    )}

                                    {feedbacks.map((feedback) => (
                                          <div
                                                key={feedback._id}
                                                className="grid grid-cols-6 py-3.5 border-b hover:bg-teal-50/60 transition text-xs sm:text-sm items-center"
                                          >
                                                <div className="font-mono text-slate-800">{feedback.enrollmentNumber}</div>
                                                <div className="font-medium text-slate-800">{feedback.foodItem}</div>

                                                <div className="text-teal-600 font-bold">
                                                      {(
                                                            (feedback.tasteRating +
                                                                  feedback.cleanlinessRating +
                                                                  feedback.staffBehaviourRating) /
                                                            3
                                                      ).toFixed(1)}{' '}
                                                      / 5
                                                </div>

                                                <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
                                                      {formatDateTime(feedback.createdAt)}
                                                </div>

                                                <div className="text-slate-600 pr-2 truncate" title={feedback.comments}>
                                                      {feedback.comments || <span className="text-gray-400 italic">No comment</span>}
                                                </div>

                                                <div>
                                                      <button
                                                            onClick={() => deleteFeedback(feedback._id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold shadow-sm transition"
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
                                    disabled={page === 1 || feedbackLoading}
                                    className={`px-4 py-2 rounded-lg ${
                                          page === 1 || feedbackLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'
                                    }`}
                              >
                                    Previous
                              </button>

                              <span className="font-semibold text-gray-700">
                                    {page} / {totalPages}
                              </span>

                              <button
                                    onClick={() => setPage((currentPage) => Math.min(currentPage + 1, totalPages))}
                                    disabled={page === totalPages || feedbackLoading}
                                    className={`px-4 py-2 rounded-lg ${
                                          page === totalPages || feedbackLoading
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

const GlassCard = ({ title, value, color = 'text-gray-800', badge }) => (
      <div className="bg-white rounded-2xl p-6 text-center shadow hover:-translate-y-2 hover:shadow-xl transition flex flex-col items-center gap-1">
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
