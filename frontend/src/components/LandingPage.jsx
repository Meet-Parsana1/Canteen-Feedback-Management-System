import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import {
      FaUtensils,
      FaStar,
      FaChartBar,
      FaCheckCircle,
      FaTimesCircle,
      FaArrowRight,
      FaRegCommentDots,
      FaRegSmile,
      FaUserTie,
      FaLightbulb,
      FaBars,
      FaTimes,
      FaChevronRight,
      FaAward,
      FaArrowUp,
} from 'react-icons/fa';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

const trendData = [
      { month: 'Jan', satisfaction: 3.8 },
      { month: 'Feb', satisfaction: 3.9 },
      { month: 'Mar', satisfaction: 4.1 },
      { month: 'Apr', satisfaction: 4.0 },
      { month: 'May', satisfaction: 4.3 },
      { month: 'Jun', satisfaction: 4.5 },
      { month: 'Jul', satisfaction: 4.6 },
];

const catData = [
      { name: 'Taste', score: 4.5, fill: '#0d9488' },
      { name: 'Cleanliness', score: 4.2, fill: '#0ea5e9' },
      { name: 'Staff', score: 4.6, fill: '#10b981' },
      { name: 'Speed', score: 3.9, fill: '#f59e0b' },
      { name: 'Pricing', score: 4.4, fill: '#6366f1' },
];

const featureCards = [
      {
            e: '\u{1F4AC}',
            c: 'bg-teal-50 border-teal-200/50',
            t: 'Fast Frictionless Feedback',
            d: 'Submit structured ratings in under 45 seconds with instant form validation.',
      },
      {
            e: '\u2B50',
            c: 'bg-amber-50 border-amber-200/50',
            t: 'Multi-Criteria Star Ratings',
            d: 'Capture authentic 5-star ratings alongside qualitative notes for specific food items.',
      },
      {
            e: '\u{1F5C4}\uFE0F',
            c: 'bg-blue-50 border-blue-200/50',
            t: 'Centralized Intelligence Cloud',
            d: 'Consolidate scattered feedback into a unified encrypted repository.',
      },
      {
            e: '\u{1F4CA}',
            c: 'bg-teal-50 border-teal-200/50',
            t: 'Executive Analytics Dashboard',
            d: 'Visualize real-time sentiment, monthly trends, and satisfaction scores dynamically.',
      },
      {
            e: '\u26A0\uFE0F',
            c: 'bg-rose-50 border-rose-200/50',
            t: 'Proactive Issue Detection',
            d: 'Identify recurring hygiene bottlenecks automatically before complaints escalate.',
      },
      {
            e: '\u{1F4A1}',
            c: 'bg-amber-50 border-amber-200/50',
            t: 'Actionable Decision Support',
            d: 'Convert quantitative ratings into clear operational actions for staff.',
      },
      {
            e: '\u{1F4C8}',
            c: 'bg-indigo-50 border-indigo-200/50',
            t: 'Historical Trend Tracking',
            d: 'Monitor quality progress across semesters to evaluate improvement ROI.',
      },
      {
            e: '\u{1F4E5}',
            c: 'bg-emerald-50 border-emerald-200/50',
            t: 'Instant Export Management',
            d: 'Export feedback datasets to Excel for administrative committee reviews.',
      },
];

const steps = [
      {
            num: '01',
            icon: '\u{1F4AC}',
            bg: 'bg-teal-100 text-teal-700',
            title: 'Students Share',
            desc: 'Submit ratings on taste, cleanliness, and staff with comments in under a minute.',
            tag: 'Simple and accessible',
            tc: 'text-teal-700',
      },
      {
            num: '02',
            icon: '\u{1F5C4}\uFE0F',
            bg: 'bg-blue-100 text-blue-700',
            title: 'Feedback Collected',
            desc: 'Responses validated and organized inside the centralized cloud system.',
            tag: 'Real-time processing',
            tc: 'text-blue-700',
      },
      {
            num: '03',
            icon: '\u{1F4CA}',
            bg: 'bg-amber-100 text-amber-700',
            title: 'Admins Analyze',
            desc: 'Management evaluates trends, sentiment scores, and item rankings.',
            tag: 'Automated analytics',
            tc: 'text-amber-700',
      },
      {
            num: '04',
            icon: '\u{1F3C6}',
            bg: 'bg-emerald-100 text-emerald-700',
            title: 'Canteen Improves',
            desc: 'Data translates into kitchen enhancements, menu updates, and higher satisfaction.',
            tag: 'Measurable results',
            tc: 'text-emerald-700',
      },
];

const pillars = [
      {
            num: '01',
            c: 'bg-teal-100 text-teal-700',
            title: 'LISTEN',
            desc: 'Give every student an effortless, instant channel to be heard and valued after every meal.',
      },
      {
            num: '02',
            c: 'bg-blue-100 text-blue-700',
            title: 'UNDERSTAND',
            desc: 'Transform daily ratings into actionable patterns, sentiment analysis, and benchmarks.',
      },
      {
            num: '03',
            c: 'bg-emerald-100 text-emerald-700',
            title: 'IMPROVE',
            desc: 'Use verified data insights to continuously upgrade food quality, hygiene, and student happiness.',
      },
];

export default function LandingPage() {
      const [menuOpen, setMenuOpen] = useState(false);
      const [scrolled, setScrolled] = useState(false);
      const [showBackToTop, setShowBackToTop] = useState(false);
      const [activeTab, setActiveTab] = useState('trends');

      useEffect(() => {
            const fn = () => {
                  setScrolled(window.scrollY > 20);
                  setShowBackToTop(window.scrollY > 350);
            };
            window.addEventListener('scroll', fn);
            return () => window.removeEventListener('scroll', fn);
      }, []);

      const scrollToTop = () => {
            window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
            });
      };

      return (
            <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
                  {/* NAVBAR */}
                  <header
                        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3' : 'bg-white/60 backdrop-blur-sm border-b border-slate-100/60 py-4'}`}
                  >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                              <Link to="/" className="flex items-center gap-2.5 group rounded-lg p-1">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                                          <FaUtensils className="text-base" />
                                    </div>
                                    <div className="flex flex-col leading-none">
                                          <div className="flex items-center gap-1.5">
                                                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                                                      Canteen<span className="text-teal-600">IQ</span>
                                                </span>
                                                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200/60">
                                                      Platform
                                                </span>
                                          </div>
                                          <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                                                Canteen Intelligence System
                                          </span>
                                    </div>
                              </Link>

                              <nav className="hidden lg:flex items-center gap-8">
                                    {[
                                          ['#how-it-works', 'How It Works'],
                                          ['#comparison', 'The Difference'],
                                          ['#features', 'Features'],
                                          ['#analytics-preview', 'Analytics'],
                                          ['#roles', 'Portals'],
                                    ].map(([href, label]) => (
                                          <a
                                                key={href}
                                                href={href}
                                                className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors"
                                          >
                                                {label}
                                          </a>
                                    ))}
                              </nav>

                              <div className="hidden sm:flex items-center gap-3">
                                    <Link
                                          to="/feedback"
                                          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded-xl transition-all"
                                    >
                                          <FaRegCommentDots className="text-xs" /> Student Feedback
                                    </Link>
                                    <Link
                                          to="/admin/login"
                                          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
                                    >
                                          <FaUserTie className="text-xs" /> Admin Portal
                                    </Link>
                              </div>

                              <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    aria-label="Toggle menu"
                              >
                                    {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                              </button>
                        </div>

                        {menuOpen && (
                              <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-lg">
                                    <div className="flex flex-col space-y-1">
                                          {[
                                                ['#how-it-works', 'How It Works'],
                                                ['#comparison', 'The Difference'],
                                                ['#features', 'Features'],
                                                ['#analytics-preview', 'Analytics Preview'],
                                                ['#roles', 'Portals'],
                                          ].map(([href, label]) => (
                                                <a
                                                      key={href}
                                                      href={href}
                                                      onClick={() => setMenuOpen(false)}
                                                      className="block px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                                                >
                                                      {label}
                                                </a>
                                          ))}
                                    </div>
                                    <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col gap-2.5">
                                          <Link
                                                to="/feedback"
                                                onClick={() => setMenuOpen(false)}
                                                className="w-full text-center py-2.5 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-xl"
                                          >
                                                Give Student Feedback
                                          </Link>
                                          <Link
                                                to="/admin/login"
                                                onClick={() => setMenuOpen(false)}
                                                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-xl"
                                          >
                                                Admin Portal Login
                                          </Link>
                                    </div>
                              </div>
                        )}
                  </header>

                  {/* HERO */}
                  <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-teal-50/80 via-slate-50/60 to-white border-b border-slate-200/60">
                        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
                        <div className="absolute top-1/3 left-10 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                                    {/* Left Content */}
                                    <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                                          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold shadow-sm">
                                                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                                                Next-Gen Campus Dining Analytics
                                          </div>

                                          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                                                Turn Student Feedback Into{' '}
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600">
                                                      Better Canteen Experiences.
                                                </span>
                                          </h1>

                                          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                                One centralized platform to collect student ratings, uncover recurring
                                                food and hygiene issues in real time, and empower administrators to make
                                                data-driven decisions.
                                          </p>

                                          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                                <Link
                                                      to="/feedback"
                                                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                                >
                                                      <FaRegSmile className="text-lg" /> Give Feedback{' '}
                                                      <FaArrowRight className="text-xs ml-1 opacity-80" />
                                                </Link>
                                                <Link
                                                      to="/admin/login"
                                                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all"
                                                >
                                                      <FaUserTie className="text-teal-600" /> Admin Portal
                                                </Link>
                                          </div>

                                          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-500 font-medium">
                                                {[
                                                      'Instant 45s Submission',
                                                      'No App Required',
                                                      'Verified Admin Analytics',
                                                ].map((t) => (
                                                      <div key={t} className="flex items-center gap-1.5">
                                                            <FaCheckCircle className="text-teal-600" />
                                                            <span>{t}</span>
                                                      </div>
                                                ))}
                                          </div>
                                    </div>

                                    {/* Right Dashboard Visual */}
                                    <div className="lg:col-span-6 relative">
                                          <div className="relative mx-auto max-w-lg lg:max-w-none bg-white/95 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-slate-300/40">
                                                {/* Widget Header */}
                                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                                      <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                                                  <FaChartBar className="text-sm" />
                                                            </div>
                                                            <div>
                                                                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                                        Live Canteen Intelligence
                                                                  </h4>
                                                                  <p className="text-[11px] text-slate-400">
                                                                        Real-Time Institutional Overview
                                                                  </p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold border border-emerald-200">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{' '}
                                                            Live
                                                      </div>
                                                </div>

                                                {/* KPI Mini Cards */}
                                                <div className="grid grid-cols-3 gap-3 mb-4">
                                                      <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3">
                                                            <span className="text-[11px] font-medium text-slate-500 block">
                                                                  Avg Rating
                                                            </span>
                                                            <div className="flex items-baseline gap-1 mt-1">
                                                                  <span className="text-xl font-extrabold text-slate-900">
                                                                        4.6
                                                                  </span>
                                                                  <span className="text-xs text-slate-400">/ 5</span>
                                                            </div>
                                                            <div className="flex text-amber-400 text-[10px] mt-1 gap-0.5">
                                                                  <FaStar />
                                                                  <FaStar />
                                                                  <FaStar />
                                                                  <FaStar />
                                                                  <FaStar />
                                                            </div>
                                                      </div>
                                                      <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3">
                                                            <span className="text-[11px] font-medium text-slate-500 block">
                                                                  Reviews
                                                            </span>
                                                            <div className="text-xl font-extrabold text-slate-900 mt-1">
                                                                  2,486+
                                                            </div>
                                                            <span className="text-[10px] font-semibold text-emerald-600 block mt-1">
                                                                  up 18% month
                                                            </span>
                                                      </div>
                                                      <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3">
                                                            <span className="text-[11px] font-medium text-slate-500 block">
                                                                  Positive
                                                            </span>
                                                            <div className="text-xl font-extrabold text-teal-600 mt-1">
                                                                  84%
                                                            </div>
                                                            <span className="text-[10px] text-slate-400 block mt-1">
                                                                  5% issues
                                                            </span>
                                                      </div>
                                                </div>

                                                {/* Mini Area Chart */}
                                                <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 mb-4">
                                                      <div className="flex justify-between items-center mb-2">
                                                            <span className="text-xs font-semibold text-slate-700">
                                                                  Monthly Satisfaction Trend
                                                            </span>
                                                            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                                                                  7 months
                                                            </span>
                                                      </div>
                                                      <div className="h-28 w-full">
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                  <AreaChart
                                                                        data={trendData}
                                                                        margin={{
                                                                              top: 5,
                                                                              right: 5,
                                                                              left: -25,
                                                                              bottom: 0,
                                                                        }}
                                                                  >
                                                                        <defs>
                                                                              <linearGradient
                                                                                    id="heroGrad"
                                                                                    x1="0"
                                                                                    y1="0"
                                                                                    x2="0"
                                                                                    y2="1"
                                                                              >
                                                                                    <stop
                                                                                          offset="5%"
                                                                                          stopColor="#0d9488"
                                                                                          stopOpacity={0.4}
                                                                                    />
                                                                                    <stop
                                                                                          offset="95%"
                                                                                          stopColor="#0d9488"
                                                                                          stopOpacity={0}
                                                                                    />
                                                                              </linearGradient>
                                                                        </defs>
                                                                        <XAxis
                                                                              dataKey="month"
                                                                              tick={{ fontSize: 10, fill: '#64748b' }}
                                                                              axisLine={false}
                                                                              tickLine={false}
                                                                        />
                                                                        <YAxis
                                                                              domain={[3.5, 5]}
                                                                              tick={{ fontSize: 10, fill: '#64748b' }}
                                                                              axisLine={false}
                                                                              tickLine={false}
                                                                        />
                                                                        <Tooltip
                                                                              contentStyle={{
                                                                                    backgroundColor: '#1e293b',
                                                                                    borderRadius: '8px',
                                                                                    border: 'none',
                                                                                    color: '#fff',
                                                                                    fontSize: '11px',
                                                                              }}
                                                                              formatter={(v) => [
                                                                                    `${v} / 5.0`,
                                                                                    'Rating',
                                                                              ]}
                                                                        />
                                                                        <Area
                                                                              type="monotone"
                                                                              dataKey="satisfaction"
                                                                              stroke="#0d9488"
                                                                              strokeWidth={2.5}
                                                                              fillOpacity={1}
                                                                              fill="url(#heroGrad)"
                                                                        />
                                                                  </AreaChart>
                                                            </ResponsiveContainer>
                                                      </div>
                                                </div>

                                                {/* Feedback Ticker */}
                                                <div className="flex items-center justify-between p-2.5 bg-teal-50/70 border border-teal-100 rounded-xl text-xs">
                                                      <div className="flex items-center gap-2">
                                                            <span className="text-base">🥪</span>
                                                            <div>
                                                                  <span className="font-semibold text-slate-800 block">
                                                                        Veg Thali Combo
                                                                  </span>
                                                                  <span className="text-[11px] text-slate-500">
                                                                        Warm and crispy roti, swift counter queue!
                                                                  </span>
                                                            </div>
                                                      </div>
                                                      <span className="font-bold text-amber-500 bg-white px-2 py-0.5 rounded border border-amber-200 text-[11px] shrink-0 ml-2">
                                                            5.0 ★
                                                      </span>
                                                </div>

                                                {/* Floating Top-Rated Card */}
                                                <div className="absolute -bottom-5 -right-3 sm:-right-6 bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 max-w-[215px] animate-float hidden sm:block">
                                                      <div className="flex items-start gap-2">
                                                            <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg shrink-0 mt-0.5">
                                                                  <FaStar className="text-sm" />
                                                            </div>
                                                            <div>
                                                                  <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                                                                        Top Rated Today
                                                                  </div>
                                                                  <div className="text-xs font-semibold text-white mt-0.5">
                                                                        Veg Thali Combo
                                                                  </div>
                                                                  <div className="flex items-center gap-1.5 mt-1">
                                                                        <div className="flex gap-0.5">
                                                                              {[1,2,3,4,5].map((s) => (
                                                                                    <span key={s} className="text-amber-400 text-[10px]">★</span>
                                                                              ))}
                                                                        </div>
                                                                        <span className="text-[10px] text-slate-300">4.9 / 5 · 38 reviews</span>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* TRUST STRIP */}
                  <section className="py-7 bg-white border-b border-slate-200/80">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                                    <div className="flex items-center gap-2.5 shrink-0">
                                          <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                                                ✓
                                          </div>
                                          <span className="text-sm font-bold text-slate-800">
                                                Built to make every student voice count.
                                          </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
                                          {[
                                                ['Simple Feedback', 'Under 45s to submit'],
                                                ['Centralized Insights', 'All data unified live'],
                                                ['Data-Driven Decisions', 'No guesswork'],
                                                ['Better Canteen', 'Continuous upgrades'],
                                          ].map(([title, sub]) => (
                                                <div key={title} className="flex items-center gap-2">
                                                      <FaCheckCircle className="text-teal-600 text-sm shrink-0" />
                                                      <div>
                                                            <h4 className="text-xs font-bold text-slate-800">
                                                                  {title}
                                                            </h4>
                                                            <p className="text-[11px] text-slate-500">{sub}</p>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* THE PROBLEM */}
                  <section id="comparison" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200/80">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/70">
                                          The Problem We Solve
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                          Feedback should not disappear into a suggestion box.
                                    </h2>
                                    <p className="text-slate-600 text-base sm:text-lg">
                                          Traditional campus feedback methods fail students and leave administrators in
                                          the dark.
                                    </p>
                              </div>
                              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                                    {/* Traditional Way Card */}
                                    <div className="bg-white rounded-2xl p-7 sm:p-9 border border-rose-100 shadow-sm">
                                          <div className="flex items-center gap-2 mb-5">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                                                      <FaTimesCircle /> Traditional Way
                                                </span>
                                          </div>
                                          <h3 className="text-xl font-bold text-slate-900 mb-5">
                                                Scattered, Ignored and Unactionable
                                          </h3>
                                          <ul className="space-y-4 text-sm text-slate-600">
                                                {[
                                                      [
                                                            'Physical Suggestion Boxes',
                                                            'Paper notes accumulate dust and are rarely reviewed.',
                                                      ],
                                                      [
                                                            'Informal Student Complaints',
                                                            'Students complain informally with zero track record.',
                                                      ],
                                                      [
                                                            'Zero Data Analytics',
                                                            'Admins make adjustments based on guesswork.',
                                                      ],
                                                      [
                                                            'Delayed Action',
                                                            'Recurring hygiene issues continue for months.',
                                                      ],
                                                ].map(([title, desc]) => (
                                                      <li key={title} className="flex items-start gap-3">
                                                            <FaTimesCircle className="text-rose-500 text-base mt-0.5 shrink-0" />
                                                            <div>
                                                                  <strong className="text-slate-800 block">
                                                                        {title}:
                                                                  </strong>
                                                                  {desc}
                                                            </div>
                                                      </li>
                                                ))}
                                          </ul>
                                    </div>

                                    {/* CanteenIQ Approach Card */}
                                    <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-7 sm:p-9 shadow-xl border border-teal-800/60">
                                          <div className="flex items-center gap-2 mb-5">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold">
                                                      <FaCheckCircle /> The CanteenIQ Approach
                                                </span>
                                          </div>
                                          <h3 className="text-xl font-bold text-white mb-5">
                                                Centralized, Transparent and Intelligent
                                          </h3>
                                          <ul className="space-y-4 text-sm text-slate-200">
                                                {[
                                                      [
                                                            'Instant Mobile Feedback',
                                                            'Frictionless 45-second ratings on any phone or laptop.',
                                                      ],
                                                      [
                                                            'Real-Time Data Aggregation',
                                                            'Responses organized into structured charts automatically.',
                                                      ],
                                                      [
                                                            'Automated Issue Detection',
                                                            'Instant alerts on hygiene or pricing issues.',
                                                      ],
                                                      [
                                                            'Proven Operational Improvement',
                                                            'Verifiable quality improvements visible to everyone.',
                                                      ],
                                                ].map(([title, desc]) => (
                                                      <li key={title} className="flex items-start gap-3">
                                                            <FaCheckCircle className="text-teal-400 text-base mt-0.5 shrink-0" />
                                                            <div>
                                                                  <strong className="text-white block">{title}:</strong>
                                                                  {desc}
                                                            </div>
                                                      </li>
                                                ))}
                                          </ul>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* HOW IT WORKS */}
                  <section id="how-it-works" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/70">
                                          Simple 4-Step Process
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                          From Feedback to Action.
                                    </h2>
                                    <p className="text-slate-600 text-base sm:text-lg">
                                          A seamless pipeline that turns student reviews into measurable canteen
                                          upgrades.
                                    </p>
                              </div>
                              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {steps.map((step) => (
                                          <div
                                                key={step.num}
                                                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-teal-300 transition-all group"
                                          >
                                                <div className="space-y-4">
                                                      <div className="flex items-center justify-between">
                                                            <span className="text-3xl font-black text-slate-200 group-hover:text-teal-600 transition-colors">
                                                                  {step.num}
                                                            </span>
                                                            <div
                                                                  className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center text-base`}
                                                            >
                                                                  {step.icon}
                                                            </div>
                                                      </div>
                                                      <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                                                      <p className="text-sm text-slate-600 leading-relaxed">
                                                            {step.desc}
                                                      </p>
                                                </div>
                                                <div
                                                      className={`pt-4 mt-4 border-t border-slate-200/60 text-xs font-semibold ${step.tc} flex items-center gap-1`}
                                                >
                                                      {step.tag} <FaArrowRight className="text-[10px]" />
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* ROLE SELECTION */}
                  <section id="roles" className="py-20 md:py-28 bg-slate-100/70 border-b border-slate-200/80">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/70">
                                          Dedicated Portals
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                          Built for Everyone in the Canteen Ecosystem.
                                    </h2>
                                    <p className="text-slate-600 text-base sm:text-lg">
                                          Select your role to access your dedicated experience.
                                    </p>
                              </div>
                              <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
                                    {/* Student Card */}
                                    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group hover:border-teal-400">
                                          <div className="space-y-5">
                                                <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                      🎓
                                                </div>
                                                <div>
                                                      <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                                                            For Students
                                                      </span>
                                                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                                                            Your Experience Matters.
                                                      </h3>
                                                </div>
                                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                                      Share dining thoughts in seconds. Rate meal taste, hygiene, and
                                                      staff hospitality, report counter issues, and help make your
                                                      canteen better every day.
                                                </p>
                                                <div className="space-y-2 pt-2">
                                                      {[
                                                            'Instant 3-step rating process',
                                                            'Rate specific menu items and meals',
                                                            'Track campus-wide feedback trends',
                                                      ].map((f) => (
                                                            <div
                                                                  key={f}
                                                                  className="flex items-center gap-2 text-xs font-medium text-slate-700"
                                                            >
                                                                  <FaCheckCircle className="text-teal-600 shrink-0" />
                                                                  <span>{f}</span>
                                                            </div>
                                                      ))}
                                                </div>
                                          </div>
                                          <div className="pt-7 mt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                                                <Link
                                                      to="/feedback"
                                                      className="w-full text-center py-3.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                                                >
                                                      Give Feedback <FaArrowRight className="text-xs" />
                                                </Link>
                                                <Link
                                                      to="/dashboard"
                                                      className="w-full text-center py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all flex items-center justify-center"
                                                >
                                                      View Dashboard
                                                </Link>
                                          </div>
                                    </div>

                                    {/* Admin Card */}
                                    <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group">
                                          <div className="space-y-5">
                                                <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                      👔
                                                </div>
                                                <div>
                                                      <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                                                            For Administrators
                                                      </span>
                                                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                                                            Turn Feedback Into Insights.
                                                      </h3>
                                                </div>
                                                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                                      Monitor real-time student satisfaction, pinpoint food
                                                      deficiencies, export Excel reports, and make proactive decisions
                                                      backed by reliable analytics.
                                                </p>
                                                <div className="space-y-2 pt-2">
                                                      {[
                                                            'Real-time sentiment and rating distribution',
                                                            'Recurring issue detection and alert flags',
                                                            'One-click Excel report export',
                                                      ].map((f) => (
                                                            <div
                                                                  key={f}
                                                                  className="flex items-center gap-2 text-xs font-medium text-slate-300"
                                                            >
                                                                  <FaCheckCircle className="text-teal-400 shrink-0" />
                                                                  <span>{f}</span>
                                                            </div>
                                                      ))}
                                                </div>
                                          </div>
                                          <div className="pt-7 mt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                                                <Link
                                                      to="/admin/login"
                                                      className="w-full text-center py-3.5 px-6 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                                                >
                                                      Open Admin Portal <FaArrowRight className="text-xs" />
                                                </Link>
                                                <Link
                                                      to="/admin/signup"
                                                      className="w-full text-center py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 transition-all flex items-center justify-center"
                                                >
                                                      Admin Signup
                                                </Link>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* FEATURES GRID */}
                  <section id="features" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/70">
                                          Engineered for Campus Dining
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                          Everything You Need to Understand Your Canteen.
                                    </h2>
                                    <p className="text-slate-600 text-base sm:text-lg">
                                          A comprehensive feedback and analytics suite to elevate dining standards.
                                    </p>
                              </div>
                              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {featureCards.map((item, idx) => (
                                          <div
                                                key={idx}
                                                className="bg-slate-50 hover:bg-white border border-slate-200/70 hover:border-teal-300 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
                                          >
                                                <div
                                                      className={`w-12 h-12 rounded-xl ${item.c} border flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}
                                                >
                                                      {item.e}
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-2">{item.t}</h3>
                                                <p className="text-xs text-slate-600 leading-relaxed">{item.d}</p>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* ANALYTICS PREVIEW */}
                  <section
                        id="analytics-preview"
                        className="py-20 md:py-28 bg-slate-900 text-white border-b border-slate-800"
                  >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/70 px-3 py-1 rounded-full border border-teal-800">
                                          Institutional Intelligence
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                          Intelligence at a Glance: The Admin Experience.
                                    </h2>
                                    <p className="text-slate-400 text-base sm:text-lg">
                                          CanteenIQ helps administrators understand what the feedback really means.
                                    </p>
                              </div>

                              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
                                    {/* Mockup Toolbar */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-7">
                                          <div className="flex items-center gap-2.5">
                                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline">
                                                      admin.canteeniq.university.edu/dashboard
                                                </span>
                                          </div>
                                          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                                                {[
                                                      ['trends', 'Satisfaction Trends'],
                                                      ['categories', 'Category Performance'],
                                                ].map(([key, label]) => (
                                                      <button
                                                            key={key}
                                                            onClick={() => setActiveTab(key)}
                                                            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${activeTab === key ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                                                      >
                                                            {label}
                                                      </button>
                                                ))}
                                          </div>
                                    </div>

                                    {/* KPI Stats */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                                          {[
                                                {
                                                      l: 'Total Feedback',
                                                      v: '2,486',
                                                      s: 'up 18% vs Last Month',
                                                      sc: 'text-emerald-400',
                                                },
                                                {
                                                      l: 'Average Rating',
                                                      v: '4.2 / 5',
                                                      s: 'Excellent score',
                                                      sc: 'text-amber-400',
                                                },
                                                {
                                                      l: 'Positive Sentiment',
                                                      v: '78%',
                                                      s: '1,940 Satisfied',
                                                      sc: 'text-slate-400',
                                                },
                                                {
                                                      l: 'Issues Identified',
                                                      v: '124',
                                                      s: '98% Resolved',
                                                      sc: 'text-emerald-400',
                                                },
                                          ].map((kpi) => (
                                                <div
                                                      key={kpi.l}
                                                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5"
                                                >
                                                      <span className="text-xs text-slate-400 font-medium block">
                                                            {kpi.l}
                                                      </span>
                                                      <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                                                            {kpi.v}
                                                      </div>
                                                      <span
                                                            className={`text-[11px] font-semibold block mt-1 ${kpi.sc}`}
                                                      >
                                                            {kpi.s}
                                                      </span>
                                                </div>
                                          ))}
                                    </div>

                                    {/* Chart Panel */}
                                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-7">
                                          <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-sm font-bold text-slate-200">
                                                      {activeTab === 'trends'
                                                            ? 'Monthly Satisfaction Trajectory'
                                                            : 'Category Performance (out of 5.0)'}
                                                </h4>
                                                <span className="text-[11px] text-teal-400 font-mono">
                                                      Live Data Model
                                                </span>
                                          </div>
                                          <div className="h-60 w-full">
                                                {activeTab === 'trends' ? (
                                                      <ResponsiveContainer width="100%" height="100%">
                                                            <AreaChart
                                                                  data={trendData}
                                                                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                                            >
                                                                  <defs>
                                                                        <linearGradient
                                                                              id="previewGrad"
                                                                              x1="0"
                                                                              y1="0"
                                                                              x2="0"
                                                                              y2="1"
                                                                        >
                                                                              <stop
                                                                                    offset="5%"
                                                                                    stopColor="#0d9488"
                                                                                    stopOpacity={0.6}
                                                                              />
                                                                              <stop
                                                                                    offset="95%"
                                                                                    stopColor="#0d9488"
                                                                                    stopOpacity={0}
                                                                              />
                                                                        </linearGradient>
                                                                  </defs>
                                                                  <XAxis
                                                                        dataKey="month"
                                                                        stroke="#64748b"
                                                                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                                                                  />
                                                                  <YAxis
                                                                        domain={[3.5, 5]}
                                                                        stroke="#64748b"
                                                                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                                                                  />
                                                                  <Tooltip
                                                                        contentStyle={{
                                                                              backgroundColor: '#020617',
                                                                              borderColor: '#334155',
                                                                              borderRadius: '10px',
                                                                              color: '#fff',
                                                                        }}
                                                                  />
                                                                  <Area
                                                                        type="monotone"
                                                                        dataKey="satisfaction"
                                                                        stroke="#14b8a6"
                                                                        strokeWidth={3}
                                                                        fill="url(#previewGrad)"
                                                                  />
                                                            </AreaChart>
                                                      </ResponsiveContainer>
                                                ) : (
                                                      <ResponsiveContainer width="100%" height="100%">
                                                            <BarChart
                                                                  data={catData}
                                                                  layout="vertical"
                                                                  margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
                                                            >
                                                                  <XAxis
                                                                        type="number"
                                                                        domain={[0, 5]}
                                                                        stroke="#64748b"
                                                                        tick={{ fill: '#94a3b8' }}
                                                                  />
                                                                  <YAxis
                                                                        dataKey="name"
                                                                        type="category"
                                                                        stroke="#64748b"
                                                                        tick={{ fill: '#cbd5e1', fontSize: 12 }}
                                                                  />
                                                                  <Tooltip
                                                                        contentStyle={{
                                                                              backgroundColor: '#020617',
                                                                              borderColor: '#334155',
                                                                              borderRadius: '10px',
                                                                              color: '#fff',
                                                                        }}
                                                                  />
                                                                  <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                                                                        {catData.map((entry, i) => (
                                                                              <Cell key={i} fill={entry.fill} />
                                                                        ))}
                                                                  </Bar>
                                                            </BarChart>
                                                      </ResponsiveContainer>
                                                )}
                                          </div>
                                    </div>

                                    {/* Insight Banner */}
                                    <div className="bg-gradient-to-r from-teal-950 to-slate-900 border border-teal-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                          <div className="flex items-center gap-3.5">
                                                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                                                      <FaLightbulb className="text-lg" />
                                                </div>
                                                <div>
                                                      <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                                                            Smart Institutional Insight
                                                      </span>
                                                      <p className="text-sm font-medium text-slate-200 mt-0.5">
                                                            Cleanliness ratings in Block B decreased 8% this week.
                                                            Recommend midday inspection protocol.
                                                      </p>
                                                </div>
                                          </div>
                                          <Link
                                                to="/admin/login"
                                                className="shrink-0 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
                                          >
                                                View Live Portal
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* WHY THIS SYSTEM */}
                  <section id="why-canteen-iq" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200/80">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/70">
                                          Core Philosophy
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                          Small Feedback. Meaningful Change.
                                    </h2>
                                    <p className="text-slate-600 text-base sm:text-lg">
                                          The continuous three-step cycle that ensures student voices directly improve
                                          campus dining.
                                    </p>
                              </div>
                              <div className="grid md:grid-cols-3 gap-8">
                                    {pillars.map((p) => (
                                          <div
                                                key={p.num}
                                                className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-300 transition-all text-center space-y-4"
                                          >
                                                <div
                                                      className={`w-14 h-14 mx-auto rounded-2xl ${p.c} flex items-center justify-center text-2xl font-black`}
                                                >
                                                      {p.num}
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                                                <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* FINAL CTA */}
                  <section className="py-20 md:py-28 bg-gradient-to-tr from-teal-900 via-teal-800 to-slate-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
                                    <FaAward /> Make Every Voice Count
                              </span>
                              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
                                    Your Feedback Can Make a Real Difference.
                              </h2>
                              <p className="text-slate-200 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
                                    Whether you are here to share your dining experience or optimize canteen management
                                    with analytics, CanteenIQ gives you the power to act.
                              </p>
                              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link
                                          to="/feedback"
                                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-base rounded-xl shadow-xl hover:shadow-2xl transition-all"
                                    >
                                          <FaRegSmile className="text-lg" /> Give Student Feedback
                                    </Link>
                                    <Link
                                          to="/admin/login"
                                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-xl border border-white/20 transition-all"
                                    >
                                          <FaUserTie className="text-teal-300" /> Admin Portal
                                    </Link>
                              </div>
                        </div>
                  </section>

                  {/* FOOTER */}
                  <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
                                    <div className="lg:col-span-2 space-y-4">
                                          <Link to="/" className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                                                      <FaUtensils className="text-sm" />
                                                </div>
                                                <span className="text-xl font-black text-white tracking-tight">
                                                      Canteen<span className="text-teal-400">IQ</span>
                                                </span>
                                          </Link>
                                          <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                                                A data-driven feedback and decision-support platform engineered to
                                                continuously improve university canteen dining standards.
                                          </p>
                                          <div className="flex items-center gap-2 text-xs text-emerald-400">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span>All Systems Operational</span>
                                          </div>
                                    </div>

                                    <div className="space-y-3">
                                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                                Navigation
                                          </h4>
                                          <ul className="space-y-2 text-xs">
                                                {[
                                                      ['#', 'Home'],
                                                      ['#how-it-works', 'How It Works'],
                                                      ['#comparison', 'The Difference'],
                                                      ['#features', 'Features'],
                                                      ['#analytics-preview', 'Analytics Preview'],
                                                ].map(([href, label]) => (
                                                      <li key={label}>
                                                            <a
                                                                  href={href}
                                                                  className="hover:text-teal-400 transition-colors"
                                                            >
                                                                  {label}
                                                            </a>
                                                      </li>
                                                ))}
                                          </ul>
                                    </div>

                                    <div className="space-y-3">
                                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                                For Students
                                          </h4>
                                          <ul className="space-y-2 text-xs">
                                                <li>
                                                      <Link
                                                            to="/feedback"
                                                            className="hover:text-teal-400 transition-colors flex items-center gap-1"
                                                      >
                                                            Give Feedback <FaChevronRight className="text-[9px]" />
                                                      </Link>
                                                </li>
                                                <li>
                                                      <Link
                                                            to="/dashboard"
                                                            className="hover:text-teal-400 transition-colors"
                                                      >
                                                            Public Dining Dashboard
                                                      </Link>
                                                </li>
                                                <li>
                                                      <Link
                                                            to="/thank-you"
                                                            className="hover:text-teal-400 transition-colors"
                                                      >
                                                            Submission Confirmation
                                                      </Link>
                                                </li>
                                          </ul>
                                    </div>

                                    <div className="space-y-3">
                                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                                For Administrators
                                          </h4>
                                          <ul className="space-y-2 text-xs">
                                                <li>
                                                      <Link
                                                            to="/admin/login"
                                                            className="hover:text-teal-400 transition-colors flex items-center gap-1"
                                                      >
                                                            Admin Login <FaChevronRight className="text-[9px]" />
                                                      </Link>
                                                </li>
                                                <li>
                                                      <Link
                                                            to="/admin/signup"
                                                            className="hover:text-teal-400 transition-colors"
                                                      >
                                                            Register Admin Account
                                                      </Link>
                                                </li>
                                                <li>
                                                      <Link
                                                            to="/admin"
                                                            className="hover:text-teal-400 transition-colors"
                                                      >
                                                            Analytics Console
                                                      </Link>
                                                </li>
                                          </ul>
                                    </div>
                              </div>

                              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                                    <p>
                                          Copyright 2026 CanteenIQ. Canteen Feedback Management System. All rights
                                          reserved.
                                    </p>
                                    <div className="flex items-center gap-4">
                                          <span>Privacy Compliant</span>
                                          <span>·</span>
                                          <span>Secure Institutional Access</span>
                                    </div>
                              </div>
                        </div>
                  </footer>

                  {/* FLOATING BACK TO TOP BUTTON */}
                  <button
                        onClick={scrollToTop}
                        aria-label="Back to top"
                        title="Back to top"
                        className={`fixed bottom-6 right-6 z-40 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white shadow-xl shadow-teal-600/30 hover:shadow-2xl hover:shadow-teal-500/40 border border-teal-400/40 transition-all duration-300 hover:-translate-y-1 active:scale-95 group flex items-center justify-center ${
                              showBackToTop
                                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                                    : 'opacity-0 translate-y-6 pointer-events-none'
                        }`}
                  >
                        <FaArrowUp className="text-base sm:text-lg group-hover:-translate-y-0.5 transition-transform" />
                        <span className="sr-only">Scroll to top</span>
                  </button>
            </div>
      );
}
