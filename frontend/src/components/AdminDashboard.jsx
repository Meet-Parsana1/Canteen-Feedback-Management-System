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
      Cell,
} from 'recharts';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
      FaFileExcel,
      FaClock,
      FaUtensils,
      FaQrcode,
      FaUserPlus,
      FaSignOutAlt,
      FaTrash,
      FaToggleOn,
      FaToggleOff,
      FaSearch,
      FaUsers,
      FaBuilding,
      FaMapMarkerAlt,
      FaChartLine,
      FaCalendarAlt,
      FaRegSmile,
      FaStar,
      FaInfoCircle,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../utils/api';
import CanteenLoader from './CanteenLoader';
import Toast from './Toast';
import QRCodeManager from './QRCodeManager';

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

      const [adminProfile, setAdminProfile] = useState(null);
      const [canteen, setCanteen] = useState(null);
      const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'feedback', 'qr', 'team'

      const [feedbacks, setFeedbacks] = useState([]);
      const [analyticsData, setAnalyticsData] = useState([]);
      const [monthlyData, setMonthlyData] = useState([]);
      const [weeklyData, setWeeklyData] = useState([]);
      const [foodRatings, setFoodRatings] = useState([]);
      const [sentimentData, setSentimentData] = useState([]);
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
      const [searchQuery, setSearchQuery] = useState('');
      const [selectedFoodFilter, setSelectedFoodFilter] = useState('all');
      const [exporting, setExporting] = useState(false);
      const [error, setError] = useState('');
      const [kpiTimeFilter, setKpiTimeFilter] = useState('all');
      const [kpiTotal, setKpiTotal] = useState(0);
      const [kpiAvgRating, setKpiAvgRating] = useState('—');
      const [kpiBestMeal, setKpiBestMeal] = useState('—');
      const [kpiWorstMeal, setKpiWorstMeal] = useState('—');
      const [kpiWorstColor, setKpiWorstColor] = useState('text-slate-800');
      const [kpiInsight, setKpiInsight] = useState('Awaiting feedback');
      const [toast, setToast] = useState(null);

      // Team / Invite state
      const [teamList, setTeamList] = useState([]);
      const [inviteEmail, setInviteEmail] = useState('');
      const [inviteLoading, setInviteLoading] = useState(false);
      const [generatedInviteLink, setGeneratedInviteLink] = useState('');

      const showToast = (message, type = 'info') => {
            setToast({ message, type });
      };

      useEffect(() => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                  navigate('/admin/login');
                  return;
            }

            fetchMe();
      }, [navigate]);

      const fetchMe = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            try {
                  const res = await fetch(buildApiUrl('/api/admin/auth/me'), {
                        headers: { Authorization: `Bearer ${token}` },
                  });

                  if (res.status === 401) {
                        localStorage.removeItem('adminToken');
                        navigate('/admin/login');
                        return;
                  }

                  const data = await res.json();
                  if (res.ok && data.success) {
                        setAdminProfile(data.admin);
                        setCanteen(data.canteen);
                  }
            } catch (err) {
                  console.error('Fetch admin profile error:', err);
            }
      };

      useEffect(() => {
            fetchFeedback();
      }, [page, timeFilter, selectedFoodFilter, searchQuery]);

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
      }, [analyticsData, kpiTimeFilter]);

      useEffect(() => {
            setMonthlyData(getMonthlyChartData(analyticsData, monthlyRange));
            setMonthlyDateRange(getMonthlyWindowRangeLabel(monthlyRange));
      }, [analyticsData, monthlyRange]);

      useEffect(() => {
            const weekly = getWeeklyChartData(analyticsData);
            setWeeklyData(weekly.data);
            setWeeklyDateRange(weekly.rangeLabel);
      }, [analyticsData]);

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
                  if (isInitialLoad) setLoading(true);
                  else setFeedbackLoading(true);
                  setError('');

                  const token = localStorage.getItem('adminToken');
                  if (!token) {
                        navigate('/admin/login');
                        return;
                  }

                  let feedbackUrl = `/api/admin/feedback?page=${page}&limit=10`;
                  const { start, end } = getTimeRangeDates(timeFilter);
                  if (start) {
                        feedbackUrl += `&startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`;
                  }
                  if (selectedFoodFilter && selectedFoodFilter !== 'all') {
                        feedbackUrl += `&food=${encodeURIComponent(selectedFoodFilter)}`;
                  }
                  if (searchQuery.trim()) {
                        feedbackUrl += `&search=${encodeURIComponent(searchQuery.trim())}`;
                  }

                  const res = await fetch(buildApiUrl(feedbackUrl), {
                        headers: { Authorization: `Bearer ${token}` },
                  });

                  if (res.status === 401) {
                        localStorage.removeItem('adminToken');
                        navigate('/admin/login');
                        return;
                  }

                  if (!res.ok) throw new Error('Failed to fetch tenant feedback');

                  const result = await res.json();
                  setTotal(result.total || 0);
                  setFeedbacks(result.data || []);
                  setTotalPages(result.pages || 1);

                  // Fetch tenant-scoped analytics
                  const analyticsRes = await fetch(buildApiUrl('/api/admin/feedback/analytics'), {
                        headers: { Authorization: `Bearer ${token}` },
                  });

                  if (analyticsRes.ok) {
                        const analytics = await analyticsRes.json();
                        setAnalyticsData(analytics);
                  }

                  initialLoadDone.current = true;
            } catch (err) {
                  console.error(err);
                  setError(err.message || 'Unable to load dashboard data');
            } finally {
                  setLoading(false);
                  setFeedbackLoading(false);
            }
      };

      const fetchTeam = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            try {
                  const res = await fetch(buildApiUrl('/api/admin/canteen/team'), {
                        headers: { Authorization: `Bearer ${token}` },
                  });
                  const data = await res.json();
                  if (res.ok && data.success) {
                        setTeamList(data.team || []);
                  }
            } catch (err) {
                  console.error('Fetch team error:', err);
            }
      };

      const handleInviteManager = async (e) => {
            e.preventDefault();
            if (!inviteEmail.trim()) return;

            setInviteLoading(true);
            const token = localStorage.getItem('adminToken');

            try {
                  const res = await fetch(buildApiUrl('/api/admin/canteen/invite'), {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ email: inviteEmail.trim() }),
                  });

                  const data = await res.json();
                  if (res.ok && data.success) {
                        const link = `${window.location.origin}/admin/invite/${data.invitation.token}`;
                        setGeneratedInviteLink(link);
                        setInviteEmail('');
                        showToast(`Invitation created for ${data.invitation.email}`, 'success');
                  } else {
                        throw new Error(data.message || 'Failed to create invitation');
                  }
            } catch (err) {
                  console.error(err);
                  showToast(err.message || 'Invite failed', 'error');
            } finally {
                  setInviteLoading(false);
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

      const exportExcel = async () => {
            try {
                  setExporting(true);
                  const token = localStorage.getItem('adminToken');
                  if (!token) {
                        navigate('/admin/login');
                        return;
                  }

                  let exportUrl = `/api/admin/feedback?page=1&limit=10000`;
                  const { start, end } = getTimeRangeDates(timeFilter);
                  if (start) {
                        exportUrl += `&startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`;
                  }

                  const res = await fetch(buildApiUrl(exportUrl), {
                        headers: { Authorization: `Bearer ${token}` },
                  });

                  if (!res.ok) throw new Error('Failed to fetch data for export');

                  const result = await res.json();
                  const exportRecords = result.data || [];

                  if (exportRecords.length === 0) {
                        showToast(`No feedback records found to export for "${getTimeFilterLabel(timeFilter)}".`, 'warning');
                        return;
                  }

                  const timeLabel = getTimeFilterLabel(timeFilter);
                  const generationTime = formatDateTime(new Date().toISOString());

                  const metadataHeader = [
                        { 'Enrollment Number': 'CANTEEN:', 'Food Item': canteen?.name || 'Campus Dining' },
                        { 'Enrollment Number': 'INSTITUTION:', 'Food Item': canteen?.institution || 'Campus' },
                        { 'Enrollment Number': 'REPORT TITLE:', 'Food Item': 'CanteenIQ Student Dining Intelligence Report' },
                        { 'Enrollment Number': 'SELECTED PERIOD:', 'Food Item': timeLabel },
                        { 'Enrollment Number': 'GENERATED ON:', 'Food Item': generationTime },
                        { 'Enrollment Number': 'TOTAL FEEDBACKS:', 'Food Item': `${exportRecords.length} student submissions` },
                        {},
                  ];

                  const tableRows = exportRecords.map((fb) => {
                        const avg = ((fb.tasteRating + fb.cleanlinessRating + fb.staffBehaviourRating) / 3).toFixed(1);
                        return {
                              'Enrollment Number': fb.enrollmentNumber,
                              'Student Name': fb.name || 'Anonymous',
                              'Food Item': fb.foodItem,
                              'Taste Rating': `${fb.tasteRating} / 5`,
                              'Cleanliness Rating': `${fb.cleanlinessRating} / 5`,
                              'Staff Behaviour': `${fb.staffBehaviourRating} / 5`,
                              'Average Rating': `${avg} / 5`,
                              'Submitted Date & Time': formatDateTime(fb.createdAt),
                              Comments: fb.comments || 'No comment provided',
                        };
                  });

                  const combinedData = [...metadataHeader, ...tableRows];
                  const worksheet = XLSX.utils.json_to_sheet(combinedData);

                  worksheet['!cols'] = [
                        { wch: 22 }, // Enrollment Number
                        { wch: 18 }, // Student Name
                        { wch: 22 }, // Food Item
                        { wch: 15 }, // Taste
                        { wch: 18 }, // Cleanliness
                        { wch: 18 }, // Staff
                        { wch: 15 }, // Avg
                        { wch: 24 }, // Date
                        { wch: 40 }, // Comments
                  ];

                  const workbook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(workbook, worksheet, `Feedback (${timeLabel.slice(0, 15)})`);

                  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                  const dateStamp = new Date().toISOString().split('T')[0];
                  const cleanCanteenName = (canteen?.slug || 'canteen').replace(/\s+/g, '_');
                  const filename = `CanteenIQ_${cleanCanteenName}_${dateStamp}.xlsx`;

                  saveAs(new Blob([buffer]), filename);
                  showToast(`Feedback report exported successfully for ${canteen?.name}!`, 'success');
            } catch (err) {
                  console.error('Export error:', err);
                  showToast(`Export failed: ${err.message}`, 'error');
            } finally {
                  setExporting(false);
            }
      };

      const deleteFeedback = async (id) => {
            const confirmDelete = window.confirm('Delete this feedback record permanently?');
            if (!confirmDelete) return;

            try {
                  const token = localStorage.getItem('adminToken');
                  const response = await fetch(buildApiUrl(`/api/admin/feedback/${id}`), {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                  });

                  if (response.status === 401) {
                        localStorage.removeItem('adminToken');
                        navigate('/admin/login');
                        return;
                  }

                  if (!response.ok) throw new Error('Failed to delete feedback');

                  showToast('Feedback record deleted.', 'info');
                  if (feedbacks.length === 1 && page > 1) {
                        setPage((curr) => curr - 1);
                  } else {
                        fetchFeedback();
                  }
            } catch (err) {
                  console.error(err);
                  showToast(err.message || 'Unable to delete feedback', 'error');
            }
      };

      if (loading) {
            return (
                  <CanteenLoader
                        fullScreen={true}
                        text="Loading Canteen Command Center..."
                        subtext="Synchronizing dining metrics, feedback streams & table QR tokens..."
                  />
            );
      }

      if (error) {
            return (
                  <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
                        <div className="max-w-xl rounded-2xl bg-white p-6 shadow-lg text-left">
                              <h1 className="text-2xl font-bold text-teal-600 mb-3">Admin dashboard unavailable</h1>
                              <p className="text-gray-600 mb-4">{error}</p>
                              <div className="flex flex-wrap gap-3">
                                    <button onClick={fetchFeedback} className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg text-white font-semibold">
                                          Retry
                                    </button>
                                    <button onClick={logout} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-gray-800 font-semibold">
                                          Back to login
                                    </button>
                              </div>
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
                  {toast && (
                        <Toast
                              message={toast.message}
                              type={toast.type}
                              onClose={() => setToast(null)}
                        />
                  )}

                  {/* TOP CANTEEN HEADER BAR */}
                  <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              {/* Left: Canteen Identity */}
                              <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xl shadow-md">
                                          <FaUtensils />
                                    </div>
                                    <div>
                                          <div className="flex flex-wrap items-center gap-2">
                                                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                                                      {canteen?.name || 'Campus Canteen'}
                                                </h1>
                                                <span
                                                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                                                            canteen?.status === 'active'
                                                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                                                      }`}
                                                >
                                                      {canteen?.status || 'ACTIVE'}
                                                </span>
                                                <span
                                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                            canteen?.feedbackEnabled
                                                                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                      }`}
                                                >
                                                      {canteen?.feedbackEnabled ? '● OPEN' : '○ CLOSED'}
                                                </span>
                                          </div>
                                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400 font-medium mt-0.5">
                                                <span>{canteen?.institution}</span>
                                                <span>&bull;</span>
                                                <span>{adminProfile?.name} ({adminProfile?.role})</span>
                                          </div>
                                    </div>
                              </div>

                              {/* Right: Actions & Navigation */}
                              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                                    <button
                                          onClick={exportExcel}
                                          disabled={exporting}
                                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50"
                                    >
                                          <FaFileExcel />
                                          <span>{exporting ? 'Exporting...' : 'Export Excel'}</span>
                                    </button>

                                    <button
                                          onClick={logout}
                                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition"
                                    >
                                          <FaSignOutAlt />
                                          <span className="hidden sm:inline">Logout</span>
                                    </button>
                              </div>
                        </div>

                        {/* NAV TABS */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 border-t border-slate-100 overflow-x-auto text-xs font-bold">
                              {[
                                    ['overview', 'Overview & Analytics'],
                                    ['feedback', `Feedback Responses (${total})`],
                                    ['qr', 'QR Code & Dining Poster'],
                                    ['team', 'Canteen Team'],
                              ].map(([tabKey, label]) => (
                                    <button
                                          key={tabKey}
                                          onClick={() => {
                                                setActiveTab(tabKey);
                                                if (tabKey === 'team') fetchTeam();
                                          }}
                                          className={`py-3 px-4 border-b-2 transition whitespace-nowrap ${
                                                activeTab === tabKey
                                                      ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                                                      : 'border-transparent text-slate-500 hover:text-slate-900'
                                          }`}
                                    >
                                          {label}
                                    </button>
                              ))}
                        </div>
                  </header>

                  {/* MAIN DASHBOARD VIEW */}
                  <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
                        {/* TAB 1: OVERVIEW & ANALYTICS */}
                        {activeTab === 'overview' && (
                              <>
                                    {/* Empty / Zero-Feedback Welcome Banner */}
                                    {analyticsData.length === 0 && (
                                          <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                                <div className="flex items-start gap-3.5">
                                                      <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl shrink-0 shadow-md shadow-teal-600/20">
                                                            <FaQrcode />
                                                      </div>
                                                      <div>
                                                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                                                  Start Collecting Student Feedback
                                                            </h3>
                                                            <p className="text-xs text-slate-600 mt-0.5 max-w-xl leading-relaxed">
                                                                  No student reviews have been recorded yet. Print and display your canteen QR Code poster on dining tables to start receiving real-time ratings and kitchen analytics.
                                                            </p>
                                                      </div>
                                                </div>
                                                <button
                                                      onClick={() => setActiveTab('qr')}
                                                      className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition shrink-0"
                                                >
                                                      <FaQrcode />
                                                      <span>View Dining Poster</span>
                                                </button>
                                          </div>
                                    )}

                                    {/* KPI Section */}
                                    <div>
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                                <div>
                                                      <h2 className="text-base font-bold text-slate-800">
                                                            Dining Performance Overview
                                                      </h2>
                                                      <p className="text-xs text-slate-400">
                                                            Showing metrics for: <span className="text-teal-600 font-bold">{getTimeFilterLabel(kpiTimeFilter)}</span>
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
                                                <GlassCard title="Total Feedback" value={kpiTotal} badge={getTimeFilterLabel(kpiTimeFilter)} />
                                                <GlassCard title="Average Rating" value={kpiAvgRating} badge={getTimeFilterLabel(kpiTimeFilter)} />
                                                <GlassCard title="Top Rated Item" value={kpiBestMeal} badge={getTimeFilterLabel(kpiTimeFilter)} />
                                                <GlassCard title="Lowest Rated Item" value={kpiWorstMeal} color={kpiWorstColor} badge={getTimeFilterLabel(kpiTimeFilter)} />
                                                <GlassCard title="Operational Insight" value={kpiInsight} badge={getTimeFilterLabel(kpiTimeFilter)} />
                                          </div>
                                    </div>

                                    {/* CHARTS GRID */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
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
                                                            <span>Feedback Sentiment Breakdown</span>
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
                                                            <span>Top Rated Menu Items</span>
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
                                                                  title="No Menu Ratings Yet"
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
                              </>
                        )}

                        {/* TAB 2: FEEDBACK RESPONSES TABLE */}
                        {activeTab === 'feedback' && (
                              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
                                    {/* Table Filters Strip */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                                          {/* Search */}
                                          <div className="relative flex-1 max-w-sm">
                                                <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                                                <input
                                                      type="text"
                                                      placeholder="Search enrollment, food item, or comments..."
                                                      value={searchQuery}
                                                      onChange={(e) => {
                                                            setSearchQuery(e.target.value);
                                                            setPage(1);
                                                      }}
                                                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                                />
                                          </div>

                                          <div className="flex flex-wrap items-center gap-2.5">
                                                {/* Food item filter */}
                                                <select
                                                      value={selectedFoodFilter}
                                                      onChange={(e) => {
                                                            setSelectedFoodFilter(e.target.value);
                                                            setPage(1);
                                                      }}
                                                      className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 outline-none"
                                                >
                                                      <option value="all">All Foods</option>
                                                      <option value="Veg Thali Combo">Veg Thali Combo</option>
                                                      <option value="Special Punjabi Thali">Special Punjabi Thali</option>
                                                      <option value="Masala Dosa">Masala Dosa</option>
                                                      <option value="Paneer Butter Masala">Paneer Butter Masala</option>
                                                      <option value="Samosa & Chutney">Samosa & Chutney</option>
                                                      <option value="Grilled Cheese Sandwich">Grilled Cheese Sandwich</option>
                                                      <option value="Veg Burger">Veg Burger</option>
                                                </select>

                                                {/* Time filter */}
                                                <select
                                                      value={timeFilter}
                                                      onChange={(e) => {
                                                            setTimeFilter(e.target.value);
                                                            setPage(1);
                                                      }}
                                                      className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 outline-none"
                                                >
                                                      <option value="all">All Time</option>
                                                      <option value="today">Today</option>
                                                      <option value="24h">Last 24h</option>
                                                      <option value="7d">Last 7 Days</option>
                                                      <option value="30d">Last 30 Days</option>
                                                </select>
                                          </div>
                                    </div>

                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                          <table className="w-full text-left text-xs">
                                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                                                      <tr>
                                                            <th className="py-3 px-4">Enrollment</th>
                                                            <th className="py-3 px-4">Food Item</th>
                                                            <th className="py-3 px-4 text-center">Taste</th>
                                                            <th className="py-3 px-4 text-center">Cleanliness</th>
                                                            <th className="py-3 px-4 text-center">Staff</th>
                                                            <th className="py-3 px-4">Comment</th>
                                                            <th className="py-3 px-4">Submitted At</th>
                                                            <th className="py-3 px-4 text-right">Action</th>
                                                      </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                      {feedbacks.length === 0 ? (
                                                            <tr>
                                                                  <td colSpan="8" className="text-center py-10 text-slate-400">
                                                                        No student feedback matching this filter.
                                                                  </td>
                                                            </tr>
                                                      ) : (
                                                            feedbacks.map((row) => (
                                                                  <tr key={row._id} className="hover:bg-slate-50/80 transition">
                                                                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                                                                              {row.enrollmentNumber}
                                                                        </td>
                                                                        <td className="py-3 px-4 font-bold text-teal-700">
                                                                              {row.foodItem}
                                                                        </td>
                                                                        <td className="py-3 px-4 text-center font-bold text-amber-500">
                                                                              {row.tasteRating} ★
                                                                        </td>
                                                                        <td className="py-3 px-4 text-center font-bold text-blue-500">
                                                                              {row.cleanlinessRating} ★
                                                                        </td>
                                                                        <td className="py-3 px-4 text-center font-bold text-emerald-500">
                                                                              {row.staffBehaviourRating} ★
                                                                        </td>
                                                                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={row.comments}>
                                                                              {row.comments || <span className="text-slate-300 italic">None</span>}
                                                                        </td>
                                                                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                                                                              {formatDateTime(row.createdAt)}
                                                                        </td>
                                                                        <td className="py-3 px-4 text-right">
                                                                              <button
                                                                                    onClick={() => deleteFeedback(row._id)}
                                                                                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                                                                    title="Delete Record"
                                                                              >
                                                                                    <FaTrash />
                                                                              </button>
                                                                        </td>
                                                                  </tr>
                                                            ))
                                                      )}
                                                </tbody>
                                          </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                                                <span className="text-slate-500">
                                                      Page {page} of {totalPages}
                                                </span>
                                                <div className="flex gap-2">
                                                      <button
                                                            disabled={page <= 1}
                                                            onClick={() => setPage(page - 1)}
                                                            className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition"
                                                      >
                                                            Previous
                                                      </button>
                                                      <button
                                                            disabled={page >= totalPages}
                                                            onClick={() => setPage(page + 1)}
                                                            className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition"
                                                      >
                                                            Next
                                                      </button>
                                                </div>
                                          </div>
                                    )}
                              </div>
                        )}

                        {/* TAB 3: QR CODE & POSTER MANAGER */}
                        {activeTab === 'qr' && (
                              <QRCodeManager
                                    canteen={canteen}
                                    onCanteenUpdate={(updated) => setCanteen(updated)}
                                    showToast={showToast}
                              />
                        )}

                        {/* TAB 4: CANTEEN TEAM & INVITES */}
                        {activeTab === 'team' && (
                              <div className="space-y-6">
                                    {/* Invite Form */}
                                    {adminProfile?.role === 'owner' && (
                                          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                                <h3 className="text-base font-bold text-slate-800 mb-1">
                                                      Invite Manager to {canteen?.name}
                                                </h3>
                                                <p className="text-xs text-slate-400 mb-4">
                                                      Generate a secure registration link to invite dining supervisors to review feedback.
                                                </p>

                                                <form onSubmit={handleInviteManager} className="flex flex-col sm:flex-row gap-3">
                                                      <input
                                                            type="email"
                                                            placeholder="manager@university.edu"
                                                            value={inviteEmail}
                                                            onChange={(e) => setInviteEmail(e.target.value)}
                                                            required
                                                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                                      />
                                                      <button
                                                            type="submit"
                                                            disabled={inviteLoading}
                                                            className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm"
                                                      >
                                                            <FaUserPlus />
                                                            <span>{inviteLoading ? 'Generating...' : 'Generate Invite Link'}</span>
                                                      </button>
                                                </form>

                                                {generatedInviteLink && (
                                                      <div className="mt-4 p-3.5 bg-teal-50 border border-teal-200 rounded-xl">
                                                            <p className="text-xs font-bold text-teal-800 mb-1">
                                                                  Share this invitation link with the manager:
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                  <input
                                                                        type="text"
                                                                        readOnly
                                                                        value={generatedInviteLink}
                                                                        className="w-full bg-white border border-teal-200 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-700 select-all"
                                                                  />
                                                                  <button
                                                                        onClick={() => {
                                                                              navigator.clipboard.writeText(generatedInviteLink);
                                                                              showToast('Invite link copied!', 'success');
                                                                        }}
                                                                        className="bg-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap"
                                                                  >
                                                                        Copy
                                                                  </button>
                                                            </div>
                                                      </div>
                                                )}
                                          </div>
                                    )}

                                    {/* Team Member List */}
                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                          <h3 className="text-base font-bold text-slate-800 mb-4">
                                                Authorized Administrators ({teamList.length})
                                          </h3>

                                          <div className="divide-y divide-slate-100">
                                                {teamList.map((m) => (
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

export default AdminDashboard;
