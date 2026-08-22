import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      FaQrcode,
      FaBuilding,
      FaShieldAlt,
      FaSearch,
      FaEye,
      FaArrowUp,
} from 'react-icons/fa';
import {
      ResponsiveContainer,
      AreaChart,
      Area,
      XAxis,
      YAxis,
      Tooltip,
} from 'recharts';

const trendData = [
      { month: 'Jan', satisfaction: 3.8 },
      { month: 'Feb', satisfaction: 3.9 },
      { month: 'Mar', satisfaction: 4.1 },
      { month: 'Apr', satisfaction: 4.0 },
      { month: 'May', satisfaction: 4.3 },
      { month: 'Jun', satisfaction: 4.5 },
      { month: 'Jul', satisfaction: 4.6 },
];

const featureCards = [
      {
            e: '🏢',
            c: 'bg-teal-50 border-teal-200/50',
            t: 'Multi-Canteen Architecture',
            d: 'Every dining hall receives an isolated tenant workspace, custom slug, and authorized administrators.',
      },
      {
            e: '📱',
            c: 'bg-amber-50 border-amber-200/50',
            t: 'Instant QR Code Access',
            d: 'Generate and print custom dining posters with QR codes for fast, zero-friction 45-second table reviews.',
      },
      {
            e: '🛡️',
            c: 'bg-blue-50 border-blue-200/50',
            t: 'Server-Enforced Isolation',
            d: 'Admins only access their own dining feedback with strict JWT server-side authorization boundaries.',
      },
      {
            e: '⏱️',
            c: 'bg-teal-50 border-teal-200/50',
            t: 'Tenant-Aware Anti-Spam',
            d: 'Smart 24-hour rate limiting prevents review flooding per student per canteen without blocking other campus venues.',
      },
      {
            e: '📊',
            c: 'bg-indigo-50 border-indigo-200/50',
            t: 'Real-Time Dining Analytics',
            d: 'Visualize monthly volume, sentiment distributions, and top/bottom food item performers live.',
      },
      {
            e: '⚡',
            c: 'bg-rose-50 border-rose-200/50',
            t: 'Feedback On/Off Controls',
            d: 'Dining supervisors can toggle feedback acceptance on or off during non-operating hours or kitchen maintenance.',
      },
      {
            e: '📑',
            c: 'bg-emerald-50 border-emerald-200/50',
            t: 'Excel Intelligence Export',
            d: 'Export formatted XLSX inspection reports with header metadata for administrative dining review boards.',
      },
      {
            e: '🧪',
            c: 'bg-amber-50 border-amber-200/50',
            t: 'Isolated Sandbox Demos',
            d: 'Explore realistic student and administrator workflows without modifying production database records.',
      },
];

const steps = [
      {
            num: '01',
            icon: '🏢',
            bg: 'bg-teal-100 text-teal-700',
            title: 'Canteen Onboards',
            desc: 'Dining hall registers their institution profile, campus location, and unique custom URL slug.',
            tag: 'Fast setup',
            tc: 'text-teal-700',
      },
      {
            num: '02',
            icon: '📱',
            bg: 'bg-blue-100 text-blue-700',
            title: 'QR Code Generated',
            desc: 'System creates a printable dining poster with encrypted QR code pointing directly to the canteen portal.',
            tag: 'Instant print',
            tc: 'text-blue-700',
      },
      {
            num: '03',
            icon: '💬',
            bg: 'bg-amber-100 text-amber-700',
            title: 'Students Scan & Review',
            desc: 'Diners scan table QR code to submit multi-criteria star ratings on Taste, Cleanliness, and Staff in under 45 seconds.',
            tag: 'Frictionless',
            tc: 'text-amber-700',
      },
      {
            num: '04',
            icon: '📈',
            bg: 'bg-emerald-100 text-emerald-700',
            title: 'Admins Improve Food',
            desc: 'Isolated analytics uncover recurring hygiene bottlenecks, top menu favorites, and data-driven upgrades.',
            tag: 'Measurable ROI',
            tc: 'text-emerald-700',
      },
];

export default function LandingPage() {
      const navigate = useNavigate();
      const [menuOpen, setMenuOpen] = useState(false);
      const [scrolled, setScrolled] = useState(false);
      const [showBackToTop, setShowBackToTop] = useState(false);
      const [canteenCodeInput, setCanteenCodeInput] = useState('');

      useEffect(() => {
            const fn = () => {
                  setScrolled(window.scrollY > 20);
                  setShowBackToTop(window.scrollY > 300);
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

      const handleCanteenJump = (e) => {
            e.preventDefault();
            const clean = canteenCodeInput.trim().toLowerCase().replace(/\s+/g, '-');
            if (clean) {
                  navigate(`/feedback/${clean}`);
            }
      };

      return (
            <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
                  {/* NAVBAR */}
                  <header
                        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                              scrolled
                                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
                                    : 'bg-white/70 backdrop-blur-sm border-b border-slate-100/60 py-4'
                        }`}
                  >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                              <Link to="/" className="flex items-center gap-2.5 group">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                                          <FaUtensils className="text-base" />
                                    </div>
                                    <div className="flex flex-col leading-none">
                                          <div className="flex items-center gap-1.5">
                                                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                                                      Canteen<span className="text-teal-600">IQ</span>
                                                </span>
                                                <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                                                      Multi-Tenant
                                                </span>
                                          </div>
                                          <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                                                Dining Intelligence Platform
                                          </span>
                                    </div>
                              </Link>

                              <nav className="hidden lg:flex items-center gap-8">
                                    {[
                                          ['#how-it-works', 'How It Works'],
                                          ['#features', 'Architecture & Features'],
                                          ['#demo-section', 'Interactive Demos'],
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
                                          to="/demo/student"
                                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all"
                                    >
                                          <FaEye className="text-xs" /> Try Demo
                                    </Link>
                                    <Link
                                          to="/admin/login"
                                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
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

                        {/* Mobile Drawer */}
                        {menuOpen && (
                              <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-lg space-y-3">
                                    <div className="flex flex-col space-y-1">
                                          <a
                                                href="#how-it-works"
                                                onClick={() => setMenuOpen(false)}
                                                className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                                          >
                                                How It Works
                                          </a>
                                          <a
                                                href="#features"
                                                onClick={() => setMenuOpen(false)}
                                                className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                                          >
                                                Architecture & Features
                                          </a>
                                          <Link
                                                to="/demo/student"
                                                onClick={() => setMenuOpen(false)}
                                                className="block px-3 py-2 text-sm font-semibold text-amber-800 bg-amber-50 rounded-lg"
                                          >
                                                Interactive Student Demo
                                          </Link>
                                          <Link
                                                to="/demo/admin"
                                                onClick={() => setMenuOpen(false)}
                                                className="block px-3 py-2 text-sm font-semibold text-teal-800 bg-teal-50 rounded-lg"
                                          >
                                                Interactive Admin Demo
                                          </Link>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                                          <Link
                                                to="/admin/setup"
                                                onClick={() => setMenuOpen(false)}
                                                className="w-full text-center py-2.5 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-xl"
                                          >
                                                Register New Canteen
                                          </Link>
                                          <Link
                                                to="/admin/login"
                                                onClick={() => setMenuOpen(false)}
                                                className="w-full text-center py-2.5 text-xs font-bold text-white bg-teal-600 rounded-xl"
                                          >
                                                Admin Portal Login
                                          </Link>
                                    </div>
                              </div>
                        )}
                  </header>

                  {/* HERO SECTION */}
                  <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-teal-50/80 via-slate-50/60 to-white border-b border-slate-200/60">
                        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
                        <div className="absolute top-1/3 left-10 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                                    {/* Left Text */}
                                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                                          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold shadow-sm">
                                                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                                                Multi-Canteen Feedback Intelligence
                                          </div>

                                          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                                                Students Speak.{' '}
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600">
                                                      Canteens Listen.
                                                </span>{' '}
                                                Data Drives Quality.
                                          </h1>

                                          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                                A modern multi-tenant platform empowering dining halls with unique QR code feedback channels, server-isolated analytics, and actionable kitchen intelligence.
                                          </p>

                                          {/* CTAS */}
                                          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                                                <Link
                                                      to="/demo/student"
                                                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                                >
                                                      <FaRegSmile className="text-base" /> Explore Student Demo
                                                </Link>
                                                <Link
                                                      to="/demo/admin"
                                                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-sm rounded-xl shadow-sm transition-all"
                                                >
                                                      <FaChartBar className="text-amber-600" /> Explore Admin Demo
                                                </Link>
                                                <Link
                                                      to="/admin/login"
                                                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 shadow-sm transition-all"
                                                >
                                                      <FaUserTie className="text-teal-600" /> Admin Portal
                                                </Link>
                                          </div>

                                          {/* Quick Canteen Jump Bar */}
                                          <div className="pt-4 max-w-lg mx-auto lg:mx-0">
                                                <form onSubmit={handleCanteenJump} className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                                      <div className="pl-3 text-slate-400">
                                                            <FaQrcode className="text-sm" />
                                                      </div>
                                                      <input
                                                            type="text"
                                                            placeholder="Enter canteen slug (e.g. mu-main-canteen)"
                                                            value={canteenCodeInput}
                                                            onChange={(e) => setCanteenCodeInput(e.target.value)}
                                                            className="flex-1 px-2 py-1.5 text-xs text-slate-800 outline-none font-medium bg-transparent"
                                                      />
                                                      <button
                                                            type="submit"
                                                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"
                                                      >
                                                            Open Portal
                                                      </button>
                                                </form>
                                                <p className="text-[11px] text-slate-400 mt-1.5 pl-2">
                                                      Have a canteen QR code or link? Enter its slug above or scan the table poster.
                                                </p>
                                          </div>
                                    </div>

                                    {/* Right Visual Card - Platform Dining Intelligence Showcase */}
                                    <div className="lg:col-span-5">
                                          <div className="bg-white/95 border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 relative">
                                                {/* Header */}
                                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                                      <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                                                  <FaChartBar className="text-sm" />
                                                            </div>
                                                            <div>
                                                                  <h4 className="text-xs font-extrabold text-slate-900">
                                                                        Campus Dining Intelligence
                                                                  </h4>
                                                                  <p className="text-[10px] text-slate-400">
                                                                        Real-Time Institutional Aggregation
                                                                  </p>
                                                            </div>
                                                      </div>
                                                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
                                                      </span>
                                                </div>

                                                {/* KPI snapshot */}
                                                <div className="grid grid-cols-3 gap-2 text-center">
                                                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                            <span className="text-[10px] text-slate-400 font-bold block">Avg Rating</span>
                                                            <span className="text-lg font-extrabold text-slate-900">4.7 ★</span>
                                                      </div>
                                                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                            <span className="text-[10px] text-slate-400 font-bold block">Reviews</span>
                                                            <span className="text-lg font-extrabold text-teal-600">24.8k+</span>
                                                      </div>
                                                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                            <span className="text-[10px] text-slate-400 font-bold block">Satisfaction</span>
                                                            <span className="text-lg font-extrabold text-emerald-600">94%</span>
                                                      </div>
                                                </div>

                                                {/* Satisfaction Area Chart */}
                                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                                                            <span>Cross-Campus Dining Trend</span>
                                                            <span className="text-[10px] text-teal-600 font-semibold">+18% Quality ROI</span>
                                                      </div>
                                                      <div className="h-24 w-full">
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                  <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                                                        <XAxis dataKey="month" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                                                                        <YAxis domain={[3.5, 5]} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                                                                        <Area type="monotone" dataKey="satisfaction" stroke="#0d9488" strokeWidth={2} fill="#ccfbf1" />
                                                                  </AreaChart>
                                                            </ResponsiveContainer>
                                                      </div>
                                                </div>

                                                {/* Live Intelligence & Safe Demo CTA */}
                                                <div className="p-3 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 flex items-center justify-between text-xs">
                                                      <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs shrink-0 shadow-sm">
                                                                  <FaEye />
                                                            </div>
                                                            <div>
                                                                  <p className="font-bold text-slate-800 text-[11px]">Interactive Sandbox</p>
                                                                  <p className="text-[10px] text-slate-500">Test rating forms & admin dashboards</p>
                                                            </div>
                                                      </div>
                                                      <Link
                                                            to="/demo/student"
                                                            className="text-[11px] font-bold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition"
                                                      >
                                                            Try Sandbox &rarr;
                                                      </Link>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* HOW IT WORKS SECTION */}
                  <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                                          End-to-End Product Flow
                                    </span>
                                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                          From Table QR Scan to Kitchen Action
                                    </h2>
                                    <p className="text-slate-500 text-sm">
                                          How CanteenIQ provides a seamless dining intelligence lifecycle for students and campus directors.
                                    </p>
                              </div>

                              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {steps.map((s) => (
                                          <div key={s.num} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3 hover:shadow-md transition">
                                                <div className="flex items-center justify-between">
                                                      <span className="text-2xl">{s.icon}</span>
                                                      <span className="text-xs font-extrabold text-slate-400 font-mono">
                                                            {s.num}
                                                      </span>
                                                </div>
                                                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                                                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                                                <span className={`inline-block text-[10px] font-bold uppercase ${s.tc}`}>
                                                      ✓ {s.tag}
                                                </span>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* FEATURES GRID */}
                  <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                                          Platform Capabilities
                                    </span>
                                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                          Enterprise Multi-Canteen Architecture
                                    </h2>
                                    <p className="text-slate-500 text-sm">
                                          Built with strict server-side tenant boundaries, fast QR dispatch, and actionable dining analytics.
                                    </p>
                              </div>

                              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {featureCards.map((f) => (
                                          <div key={f.t} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2.5">
                                                <div className="text-2xl">{f.e}</div>
                                                <h3 className="text-sm font-bold text-slate-900">{f.t}</h3>
                                                <p className="text-xs text-slate-500 leading-relaxed">{f.d}</p>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* DEMO CALLOUT SECTION */}
                  <section id="demo-section" className="py-16 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                              <span className="text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30">
                                    Safe Exploration Sandbox
                              </span>
                              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                    Experience CanteenIQ in Full Interactive Demo Mode
                              </h2>
                              <p className="text-slate-300 text-sm max-w-2xl mx-auto">
                                    Test the complete student rating form and the administrative command center with pre-loaded dining datasets. Zero database impact.
                              </p>

                              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                                    <Link
                                          to="/demo/student"
                                          className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-sm transition shadow-lg"
                                    >
                                          <FaRegSmile /> Student Experience Demo
                                    </Link>
                                    <Link
                                          to="/demo/admin"
                                          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold px-6 py-3.5 rounded-xl text-sm transition shadow-lg"
                                    >
                                          <FaChartBar /> Admin Command Center Demo
                                    </Link>
                                    <Link
                                          to="/admin/setup"
                                          className="inline-flex items-center gap-2 bg-transparent hover:bg-white/5 border border-teal-400 text-teal-300 font-extrabold px-6 py-3.5 rounded-xl text-sm transition"
                                    >
                                          <FaBuilding /> Register Your Canteen
                                    </Link>
                              </div>
                        </div>
                  </section>

                  {/* FOOTER */}
                  <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-900 text-xs">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                    <FaUtensils className="text-teal-500" />
                                    <span className="font-extrabold text-white">CanteenIQ</span>
                                    <span>&bull;</span>
                                    <span>Multi-Tenant Dining Feedback System</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs font-semibold">
                                    <Link to="/demo/student" className="hover:text-white transition">Student Demo</Link>
                                    <Link to="/demo/admin" className="hover:text-white transition">Admin Demo</Link>
                                    <Link to="/admin/login" className="hover:text-white transition">Admin Login</Link>
                                    <Link to="/admin/setup" className="hover:text-white transition">Register Canteen</Link>
                              </div>
                        </div>
                  </footer>

                  {/* BACK TO TOP FLOATING BUTTON */}
                  {showBackToTop && (
                        <button
                              onClick={scrollToTop}
                              className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white shadow-xl shadow-teal-600/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 animate-fadeIn"
                              aria-label="Scroll back to top"
                              title="Back to top"
                        >
                              <FaArrowUp className="text-sm group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                  )}
            </div>
      );
}
