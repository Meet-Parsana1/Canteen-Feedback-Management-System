import { useEffect, useState } from "react";

function DuplicateFeedbackModal({ nextAllowedAt, onClose }) {

      const [timeLeft, setTimeLeft] = useState("");

      useEffect(() => {

            const updateTimer = () => {

                  const now = new Date().getTime();
                  const target = new Date(nextAllowedAt).getTime();

                  const difference = target - now;

                  if (difference <= 0) {
                        setTimeLeft("00:00:00");
                        onClose();   // automatically close modal
                        return;
                  }

                  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                  const minutes = Math.floor((difference / (1000 * 60)) % 60);
                  const seconds = Math.floor((difference / 1000) % 60);

                  const formatted =
                        String(hours).padStart(2, "0") +
                        ":" +
                        String(minutes).padStart(2, "0") +
                        ":" +
                        String(seconds).padStart(2, "0");

                  setTimeLeft(formatted);
            };

            updateTimer();

            const timer = setInterval(updateTimer, 1000);

            return () => clearInterval(timer);

      }, [nextAllowedAt]);

      return (

            <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4 animate-fadeIn">
                  <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-sm text-center border border-teal-100 animate-scaleUp">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-xl mx-auto mb-3 shadow-inner">
                              ⏱
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
                              Feedback Already Submitted
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">
                              You have already reviewed this canteen today. To prevent review flooding, you can submit again in:
                        </p>
                        <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 font-mono tracking-widest bg-teal-50 py-3 px-4 rounded-2xl border border-teal-200/80 mb-6 shadow-inner">
                              {timeLeft}
                        </div>
                        <button
                              onClick={onClose}
                              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-md hover:shadow-lg"
                        >
                              Understood
                        </button>
                  </div>
            </div>

      );
}

export default DuplicateFeedbackModal;