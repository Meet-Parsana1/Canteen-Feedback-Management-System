import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
      FaQrcode,
      FaCopy,
      FaDownload,
      FaPrint,
      FaCheck,
      FaExternalLinkAlt,
      FaToggleOn,
      FaToggleOff,
      FaUtensils,
      FaInfoCircle,
} from 'react-icons/fa';
import { buildApiUrl } from '../utils/api';

export default function QRCodeManager({
      canteen,
      onCanteenUpdate,
      showToast,
}) {
      const [copied, setCopied] = useState(false);
      const [toggling, setToggling] = useState(false);
      const qrCanvasRef = useRef(null);

      const feedbackUrl = `${window.location.origin}/feedback/${canteen?.slug || ''}`;

      const handleCopy = () => {
            navigator.clipboard.writeText(feedbackUrl);
            setCopied(true);
            showToast?.('Feedback URL copied to clipboard!', 'success');
            setTimeout(() => setCopied(false), 2500);
      };

      const handleDownloadQR = () => {
            const canvas = document.getElementById('canteen-qr-canvas');
            if (!canvas) return;

            const pngUrl = canvas
                  .toDataURL('image/png')
                  .replace('image/png', 'image/octet-stream');

            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `CanteenIQ_QR_${canteen?.slug || 'canteen'}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            showToast?.('QR Code downloaded as PNG image!', 'success');
      };

      const handlePrintPoster = () => {
            const canvas = document.getElementById('canteen-qr-canvas');
            const qrImage = canvas ? canvas.toDataURL('image/png') : '';

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                        <title>Print QR Poster - ${canteen?.name}</title>
                        <style>
                              @page { size: A4 portrait; margin: 0; }
                              body {
                                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                                    margin: 0;
                                    padding: 40px;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    min-height: 90vh;
                                    text-align: center;
                                    background-color: #ffffff;
                                    color: #0f172a;
                              }
                              .poster-card {
                                    border: 3px solid #0d9488;
                                    border-radius: 28px;
                                    padding: 48px;
                                    max-width: 540px;
                                    width: 100%;
                                    box-shadow: 0 10px 25px rgba(0,0,0,0.06);
                              }
                              .brand-badge {
                                    display: inline-block;
                                    background: #f0fdfa;
                                    color: #0f766e;
                                    border: 1px solid #99f6e4;
                                    padding: 6px 16px;
                                    border-radius: 999px;
                                    font-size: 13px;
                                    font-weight: 700;
                                    text-transform: uppercase;
                                    letter-spacing: 1px;
                                    margin-bottom: 20px;
                              }
                              h1 {
                                    font-size: 32px;
                                    font-weight: 800;
                                    margin: 0 0 8px 0;
                                    color: #0f172a;
                              }
                              .institution {
                                    font-size: 16px;
                                    color: #0d9488;
                                    font-weight: 600;
                                    margin-bottom: 24px;
                              }
                              .qr-box {
                                    padding: 20px;
                                    background: #ffffff;
                                    border: 2px dashed #ccfbf1;
                                    border-radius: 20px;
                                    display: inline-block;
                                    margin-bottom: 24px;
                              }
                              .qr-img {
                                    width: 260px;
                                    height: 260px;
                                    display: block;
                              }
                              h2 {
                                    font-size: 22px;
                                    font-weight: 700;
                                    margin: 0 0 8px 0;
                                    color: #1e293b;
                              }
                              p.instructions {
                                    font-size: 14px;
                                    color: #64748b;
                                    margin: 0 0 24px 0;
                                    line-height: 1.5;
                              }
                              .url-text {
                                    font-family: monospace;
                                    font-size: 12px;
                                    color: #475569;
                                    background: #f8fafc;
                                    padding: 8px 12px;
                                    border-radius: 8px;
                                    border: 1px solid #e2e8f0;
                              }
                              .footer {
                                    margin-top: 24px;
                                    font-size: 11px;
                                    color: #94a3b8;
                                    font-weight: 500;
                              }
                        </style>
                  </head>
                  <body>
                        <div class="poster-card">
                              <div class="brand-badge">CanteenIQ Dining Intelligence</div>
                              <h1>${canteen?.name || 'Campus Canteen'}</h1>
                              <div class="institution">${canteen?.institution || 'Campus Dining'} &bull; ${canteen?.location || 'Main Hall'}</div>
                              
                              <div class="qr-box">
                                    <img class="qr-img" src="${qrImage}" alt="Scan QR Code" />
                              </div>

                              <h2>Scan to Rate Your Meal</h2>
                              <p class="instructions">Open your phone camera & scan this QR code to share your feedback on Taste, Cleanliness & Staff Service.</p>
                              
                              <div class="url-text">${feedbackUrl}</div>
                              <div class="footer">Powered by CanteenIQ &bull; Student Voice Drives Improvement</div>
                        </div>
                        <script>
                              window.onload = function() {
                                    window.print();
                              }
                        </script>
                  </body>
                  </html>
            `);
            printWindow.document.close();
      };

      const handleToggleFeedback = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            setToggling(true);
            try {
                  const newStatus = !canteen?.feedbackEnabled;
                  const res = await fetch(buildApiUrl('/api/admin/canteen/settings'), {
                        method: 'PATCH',
                        headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                              feedbackEnabled: newStatus,
                        }),
                  });

                  const data = await res.json();
                  if (res.ok && data.success) {
                        onCanteenUpdate?.(data.canteen);
                        showToast?.(
                              newStatus
                                    ? 'Feedback collection is now OPEN for students.'
                                    : 'Feedback collection is now PAUSED.',
                              'success'
                        );
                  } else {
                        throw new Error(data.message || 'Failed to update feedback settings');
                  }
            } catch (err) {
                  console.error(err);
                  showToast?.(err.message || 'Failed to update toggle', 'error');
            } finally {
                  setToggling(false);
            }
      };

      return (
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-teal-100/80 shadow-md">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl shadow-sm">
                                    <FaQrcode />
                              </div>
                              <div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                          QR Code & Feedback Channel
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                          Unique entry portal for {canteen?.name}
                                    </p>
                              </div>
                        </div>

                        {/* Acceptance Toggle */}
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl self-start sm:self-auto">
                              <span className="text-xs font-bold text-slate-700">
                                    Accept Feedback:
                              </span>
                              <button
                                    onClick={handleToggleFeedback}
                                    disabled={toggling}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                                          canteen?.feedbackEnabled
                                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                    }`}
                              >
                                    {canteen?.feedbackEnabled ? (
                                          <>
                                                <FaToggleOn className="text-base text-emerald-600" /> OPEN
                                          </>
                                    ) : (
                                          <>
                                                <FaToggleOff className="text-base text-rose-600" /> CLOSED
                                          </>
                                    )}
                              </button>
                        </div>
                  </div>

                  {/* Body Layout */}
                  <div className="grid md:grid-cols-12 gap-6 mt-6 items-center">
                        {/* QR Canvas Display */}
                        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                              <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200">
                                    <QRCodeCanvas
                                          id="canteen-qr-canvas"
                                          value={feedbackUrl}
                                          size={190}
                                          level="H"
                                          includeMargin={true}
                                    />
                              </div>
                              <span className="text-[11px] font-semibold text-slate-500 mt-2.5 flex items-center gap-1">
                                    <FaUtensils className="text-[9px] text-teal-600" /> {canteen?.name}
                              </span>
                        </div>

                        {/* QR Details & Action Buttons */}
                        <div className="md:col-span-7 space-y-4">
                              <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                                          Dedicated Feedback URL
                                    </label>
                                    <div className="flex items-center gap-2">
                                          <input
                                                type="text"
                                                readOnly
                                                value={feedbackUrl}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 outline-none select-all"
                                          />
                                          <button
                                                onClick={handleCopy}
                                                className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition"
                                          >
                                                {copied ? <FaCheck /> : <FaCopy />}
                                                <span>{copied ? 'Copied!' : 'Copy'}</span>
                                          </button>
                                          <a
                                                href={feedbackUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs shrink-0 transition"
                                                title="Open in new tab"
                                          >
                                                <FaExternalLinkAlt />
                                          </a>
                                    </div>
                              </div>

                              <div className="flex flex-wrap gap-2.5 pt-2">
                                    <button
                                          onClick={handleDownloadQR}
                                          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
                                    >
                                          <FaDownload className="text-teal-400" />
                                          <span>Download QR (PNG)</span>
                                    </button>

                                    <button
                                          onClick={handlePrintPoster}
                                          className="inline-flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-4 py-2.5 rounded-xl text-xs font-bold transition"
                                    >
                                          <FaPrint className="text-teal-600" />
                                          <span>Print Dining Poster</span>
                                    </button>
                              </div>

                              <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                                    <FaInfoCircle className="text-teal-600 text-sm mt-0.5 shrink-0" />
                                    <span>
                                          Print and place this QR code on dining tables, counter registers, and tray return stations for seamless 45-second student reviews.
                                    </span>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
