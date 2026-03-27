import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

function ThankYou() {

      return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primaryLight via-white to-primaryLight p-6">

                  <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center border border-primaryLight">

                        {/* Success Icon */}

                        <div className="flex justify-center mb-6">
                              <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
                        </div>

                        {/* Heading */}

                        <h1 className="text-3xl font-bold text-primary mb-3">
                              Thank You!
                        </h1>

                        {/* Message */}

                        <p className="text-gray-600 mb-8">
                              Your feedback has been submitted successfully.
                              Your response helps us improve the canteen experience.
                        </p>

                        {/* Buttons */}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">

                              {/* Submit Another */}

                              <Link to="/">
                                    <button className="bg-primary text-white px-6 py-3 rounded-xl shadow hover:bg-primaryDark transition w-full sm:w-auto">
                                          Submit Another Response
                                    </button>
                              </Link>

                              {/* View Dashboard */}

                              <Link to="/dashboard">
                                    <button className="border border-primary text-primary px-6 py-3 rounded-xl hover:bg-primaryLight transition w-full sm:w-auto">
                                          View Dashboard
                                    </button>
                              </Link>

                        </div>

                  </div>

            </div>
      );
}

export default ThankYou;