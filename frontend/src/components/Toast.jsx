import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'info', duration = 3500, onClose }) {
      const [visible, setVisible] = useState(false);

      useEffect(() => {
            const enterTimer = setTimeout(() => setVisible(true), 10);
            let leaveTimer;
            if (duration > 0) {
                  leaveTimer = setTimeout(() => {
                        setVisible(false);
                        setTimeout(onClose, 300);
                  }, duration);
            }
            return () => {
                  clearTimeout(enterTimer);
                  clearTimeout(leaveTimer);
            };
      }, [duration, onClose]);

      const variants = {
            success: {
                  bar: 'bg-teal-500',
                  icon: '✓',
                  iconBg: 'bg-teal-100 text-teal-700',
                  title: 'Success',
                  titleColor: 'text-teal-700',
            },
            error: {
                  bar: 'bg-red-500',
                  icon: '✕',
                  iconBg: 'bg-red-100 text-red-600',
                  title: 'Error',
                  titleColor: 'text-red-600',
            },
            warning: {
                  bar: 'bg-amber-400',
                  icon: '!',
                  iconBg: 'bg-amber-100 text-amber-700',
                  title: 'Warning',
                  titleColor: 'text-amber-700',
            },
            info: {
                  bar: 'bg-blue-500',
                  icon: 'i',
                  iconBg: 'bg-blue-100 text-blue-700',
                  title: 'Notice',
                  titleColor: 'text-blue-700',
            },
      };

      const v = variants[type] || variants.info;

      return (
            <div
                  className={`fixed top-5 right-5 z-[9999] w-[320px] max-w-[calc(100vw-2rem)]
                        bg-white rounded-2xl shadow-2xl border border-slate-100
                        flex flex-col overflow-hidden
                        transform transition-all duration-300
                        ${visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
            >
                  <div className={`h-1 w-full ${v.bar}`} />
                  <div className="flex items-start gap-3 px-4 py-4">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${v.iconBg}`}>
                              {v.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[10px] font-black text-teal-600 tracking-widest uppercase">
                                          CanteenIQ
                                    </span>
                                    <span className="text-slate-300 text-xs">·</span>
                                    <span className={`text-[11px] font-bold ${v.titleColor}`}>{v.title}</span>
                              </div>
                              <p className="text-sm text-slate-700 leading-snug">{message}</p>
                        </div>
                        <button
                              onClick={() => {
                                    setVisible(false);
                                    setTimeout(onClose, 300);
                              }}
                              className="text-slate-400 hover:text-slate-600 transition text-lg leading-none shrink-0 mt-0.5"
                              aria-label="Close"
                        >
                              ×
                        </button>
                  </div>
            </div>
      );
}
