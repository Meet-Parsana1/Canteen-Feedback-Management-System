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

            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">

                  <div className="bg-white rounded-2xl shadow-2xl p-8 w-[380px] text-center border border-primaryLight animate-fadeIn">

                        <h2 className="text-2xl font-bold text-red-500 mb-4">
                              Feedback Already Submitted
                        </h2>

                        <p className="text-gray-600 mb-6">
                              You can submit feedback again after 24 hours.
                        </p>

                        <p className="text-gray-500 mb-2">
                              You can submit feedback again in:
                        </p>

                        <div className="text-3xl font-bold text-primary tracking-widest mb-6">
                              {timeLeft}
                        </div>

                        <button
                              onClick={onClose}
                              className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-primaryDark transition"
                        >
                              OK
                        </button>

                  </div>

            </div>

      );
}

export default DuplicateFeedbackModal;