import { useState } from "react";
import { FaStar, FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DuplicateFeedbackModal from "./DuplicateFeedbackModal";

function FeedbackForm() {

      const navigate = useNavigate();

      const [formData, setFormData] = useState({
            name: "",
            enrollmentNumber: "",
            foodItem: "",
            customFoodItem: "",
            comment: "",
      });

      const [taste, setTaste] = useState(0);
      const [cleanliness, setCleanliness] = useState(0);
      const [staff, setStaff] = useState(0);

      const [errors, setErrors] = useState({});

      const [showDuplicateModal, setShowDuplicateModal] = useState(false);
      const [nextAllowedAt, setNextAllowedAt] = useState(null);

      const handleChange = (e) => {
            setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
            });
      };

      const validateForm = () => {
            let newErrors = {};

            // Enrollment validation (exactly 11 digits)
            if (!/^\d{11}$/.test(formData.enrollmentNumber)) {
                  newErrors.enrollment =
                        "Enrollment number must be exactly 11 digits.";
            }

            if (!formData.foodItem) {
                  newErrors.foodItem = "Please select a food item.";
            }

            // If other selected, custom food required
            if (formData.foodItem === "Other" && !formData.customFoodItem) {
                  newErrors.customFoodItem = "Please enter the food item.";
            }

            if (taste === 0) {
                  newErrors.taste = "Please rate the taste.";
            }

            if (cleanliness === 0) {
                  newErrors.cleanliness = "Please rate cleanliness.";
            }

            if (staff === 0) {
                  newErrors.staff = "Please rate staff behaviour.";
            }

            setErrors(newErrors);

            return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = async (e) => {
            e.preventDefault();

            if (!validateForm()) return;

            const finalFoodItem =
                  formData.foodItem === "Other"
                        ? formData.customFoodItem
                        : formData.foodItem;

            try {
                  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`, {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                              name: formData.name,
                              enrollmentNumber: formData.enrollmentNumber,
                              foodItem: finalFoodItem,
                              tasteRating: taste,
                              cleanlinessRating: cleanliness,
                              staffBehaviourRating: staff,
                              comments: formData.comment,
                        }),
                  });

                  const data = await response.json();

                  if (response.status === 400 && data.nextAllowedAt) {
                        // Duplicate feedback detected
                        setNextAllowedAt(data.nextAllowedAt);
                        setShowDuplicateModal(true);
                        return;
                  }

                  if (response.ok) {
                        navigate("/thank-you");
                  } else {
                        alert(data.message || "Failed to submit feedback");
                  }
            } catch (error) {
                  console.error(error);
                  alert("Server error");
            }
      };

      const StarRating = ({ rating, setRating, error }) => {

            const [hover, setHover] = useState(null);

            return (
                  <div>
                        <div className="flex gap-2 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                          key={star}
                                          className={`cursor-pointer text-2xl sm:text-3xl transition-all duration-200 ${star <= (hover || rating)
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                                }`}
                                          onClick={() => setRating(star)}
                                          onMouseEnter={() => setHover(star)}
                                          onMouseLeave={() => setHover(null)}
                                    />
                              ))}
                        </div>

                        {error && (
                              <p className="text-red-500 text-sm mt-1">
                                    {error}
                              </p>
                        )}
                  </div>
            );
      };

      const inputStyle = "w-full border rounded-xl px-4 py-2 sm:py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none";


      return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">

                  <div className="bg-white shadow-xl rounded-2xl p-5 sm:p-6 lg:p-8 w-full max-w-md sm:max-w-lg">
                        <div className="flex justify-center mb-2">
                              <FaUtensils className="text-teal-600 text-4xl mb-1" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-center text-teal-600 mb-2">
                              Marwadi University
                        </h1>

                        <p className="text-center text-gray-500 mb-6">
                              Canteen Feedback Portal
                        </p>

                        <form className="space-y-5" onSubmit={handleSubmit}>

                              {/* Name */}
                              <div>
                                    <label className="block text-sm font-medium mb-1">
                                          Name (Optional)
                                    </label>
                                    <input
                                          type="text"
                                          name="name"
                                          value={formData.name}
                                          onChange={handleChange}
                                          placeholder="Enter your name"
                                          className={`${inputStyle} border-gray-300`}
                                    />
                              </div>

                              {/* Enrollment */}
                              <div>
                                    <label className="block text-sm font-medium mb-1">
                                          Enrollment Number *
                                    </label>
                                    <input
                                          type="text"
                                          name="enrollmentNumber"
                                          value={formData.enrollmentNumber}
                                          onChange={handleChange}
                                          placeholder="Enter 11-digit enrollment number"
                                          className={`${inputStyle} ${errors.enrollment
                                                ? "border-red-500"
                                                : "border-gray-300"
                                                }`}
                                    />
                                    {errors.enrollment && (
                                          <p className="text-red-500 text-sm mt-1">
                                                {errors.enrollment}
                                          </p>
                                    )}
                              </div>

                              {/* Food Item */}
                              <div>
                                    <label className="block text-sm font-medium mb-1">
                                          Food Item
                                    </label>

                                    <select
                                          name="foodItem"
                                          value={formData.foodItem}
                                          onChange={handleChange}
                                          className={`${inputStyle} ${errors.foodItem
                                                ? "border-red-500"
                                                : "border-gray-300"
                                                }`}
                                    >
                                          <option value="">Select Item</option>
                                          <option value="Breakfast">Breakfast</option>
                                          <option value="Lunch">Lunch</option>
                                          <option value="Dinner">Dinner</option>
                                          <option value="Other">Other</option>
                                    </select>

                                    {errors.foodItem && (
                                          <p className="text-red-500 text-sm mt-1">
                                                {errors.foodItem}
                                          </p>
                                    )}
                              </div>

                              {/* Custom Food Input */}
                              {formData.foodItem === "Other" && (
                                    <div>
                                          <input
                                                type="text"
                                                name="customFoodItem"
                                                value={formData.customFoodItem}
                                                onChange={handleChange}
                                                placeholder="Enter food item"
                                                className={`${inputStyle} ${errors.customFoodItem
                                                      ? "border-red-500"
                                                      : "border-gray-300"
                                                      }`}
                                          />
                                          {errors.customFoodItem && (
                                                <p className="text-red-500 text-sm mt-1">
                                                      {errors.customFoodItem}
                                                </p>
                                          )}
                                    </div>
                              )}

                              {/* Taste */}
                              <div>
                                    <label className="block text-sm font-medium">
                                          Taste Rating
                                    </label>
                                    <StarRating
                                          rating={taste}
                                          setRating={setTaste}
                                          error={errors.taste}
                                    />
                              </div>

                              {/* Cleanliness */}
                              <div>
                                    <label className="block text-sm font-medium">
                                          Cleanliness Rating
                                    </label>
                                    <StarRating
                                          rating={cleanliness}
                                          setRating={setCleanliness}
                                          error={errors.cleanliness}
                                    />
                              </div>

                              {/* Staff */}
                              <div>
                                    <label className="block text-sm font-medium">
                                          Staff Behaviour Rating
                                    </label>
                                    <StarRating
                                          rating={staff}
                                          setRating={setStaff}
                                          error={errors.staff}
                                    />
                              </div>

                              {/* Comments */}
                              <div>
                                    <label className="block text-sm font-medium mb-1">
                                          Comments
                                    </label>
                                    <textarea
                                          name="comment"
                                          value={formData.comment}
                                          onChange={handleChange}
                                          placeholder="Write your feedback..."
                                          className={`${inputStyle} border-gray-300 min-h-[100px]`}
                                    />
                              </div>

                              <button
                                    type="submit"
                                    disabled={showDuplicateModal}
                                    className={`w-full py-2.5 sm:py-3 rounded-xl text-sm sm:text-base transition
                                          ${showDuplicateModal
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-teal-600 hover:bg-teal-700 text-white"}`}
                              >
                                    Submit Feedback
                              </button>

                        </form>
                  </div>
                  {showDuplicateModal && (
                        <DuplicateFeedbackModal
                              nextAllowedAt={nextAllowedAt}
                              onClose={() => setShowDuplicateModal(false)}
                        />
                  )}
            </div>
      );
}

export default FeedbackForm;
