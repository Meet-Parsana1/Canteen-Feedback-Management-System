import { useState } from 'react';
import { FaStar, FaUtensils } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DuplicateFeedbackModal from './DuplicateFeedbackModal';
import { buildApiUrl } from '../utils/api';
import CanteenLoader from './CanteenLoader';
import Toast from './Toast';

function FeedbackForm() {
      const navigate = useNavigate();

      const [formData, setFormData] = useState({
            name: '',
            enrollmentNumber: '',
            foodItem: '',
            customFoodItem: '',
            comment: '',
      });

      const [loading, setLoading] = useState(false);
      const [toast, setToast] = useState(null); // { message, type }
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
                  newErrors.enrollment = 'Enrollment number must be exactly 11 digits.';
            }

            if (!formData.foodItem) {
                  newErrors.foodItem = 'Please select a food item.';
            }

            // If other selected, custom food required
            if (formData.foodItem === 'Other' && !formData.customFoodItem) {
                  newErrors.customFoodItem = 'Please enter the food item.';
            }

            if (taste === 0) {
                  newErrors.taste = 'Please rate the taste.';
            }

            if (cleanliness === 0) {
                  newErrors.cleanliness = 'Please rate cleanliness.';
            }

            if (staff === 0) {
                  newErrors.staff = 'Please rate staff behaviour.';
            }

            setErrors(newErrors);

            return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = async (e) => {
            e.preventDefault();

            if (!validateForm()) return;

            const finalFoodItem = formData.foodItem === 'Other' ? formData.customFoodItem : formData.foodItem;

            setLoading(true);

            const submitFeedback = async (retry = false) => {
                  try {
                        const response = await fetch(buildApiUrl('/api/feedback'), {
                              method: 'POST',
                              headers: {
                                    'Content-Type': 'application/json',
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
                              setNextAllowedAt(data.nextAllowedAt);
                              setShowDuplicateModal(true);
                              setLoading(false);
                              return;
                        }

                        if (response.ok) {
                              setToast({
                                    message: 'Feedback submitted successfully! Thank you.',
                                    type: 'success',
                              });

                              // slight delay for UX
                              setTimeout(() => {
                                    navigate('/thank-you');
                              }, 1000);
                        } else {
                              throw new Error(data.message || 'Submission failed');
                        }
                  } catch (error) {
                        console.error(error);

                        if (!retry) {
                              // Retry once automatically
                              return submitFeedback(true);
                        }

                        setToast({
                              message: 'Failed to submit feedback. Please try again.',
                              type: 'error',
                        });

                        setLoading(false);
                  }
            };

            submitFeedback();
      };

      const StarRating = ({ rating, setRating, error }) => {
            const [hover, setHover] = useState(null);

            return (
                  <div>
                        <div className="flex gap-2 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                          key={star}
                                          className={`cursor-pointer text-2xl sm:text-3xl transition-all duration-200 ${
                                                star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                                          }`}
                                          onClick={() => setRating(star)}
                                          onMouseEnter={() => setHover(star)}
                                          onMouseLeave={() => setHover(null)}
                                    />
                              ))}
                        </div>

                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                  </div>
            );
      };

      const inputStyle =
            'w-full border rounded-xl px-4 py-2 sm:py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none';

      return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-6 sm:px-6 lg:px-8 relative">
                  {toast && (
                        <Toast
                              message={toast.message}
                              type={toast.type}
                              onClose={() => setToast(null)}
                        />
                  )}

                  <div className="bg-white shadow-xl rounded-2xl p-5 sm:p-6 lg:p-8 w-full max-w-md sm:max-w-lg">
                        <div className="flex justify-center mb-2">
                              <FaUtensils className="text-teal-600 text-4xl mb-1" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-center text-teal-600 mb-1">
                              CanteenIQ
                        </h1>

                        <p className="text-center text-gray-500 mb-6 text-sm">Canteen Feedback Portal</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                              {/* NAME */}
                              <div>
                                    <label className="text-gray-600 text-sm">
                                          Name <span className="text-gray-400 text-xs">(Optional)</span>
                                    </label>
                                    <input
                                          type="text"
                                          name="name"
                                          placeholder="Enter your name"
                                          value={formData.name}
                                          onChange={handleChange}
                                          className={inputStyle}
                                    />
                              </div>

                              {/* ENROLLMENT */}
                              <div>
                                    <label className="text-gray-600 text-sm">
                                          Enrollment Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                          type="text"
                                          name="enrollmentNumber"
                                          placeholder="11-digit enrollment number"
                                          value={formData.enrollmentNumber}
                                          onChange={handleChange}
                                          className={inputStyle}
                                    />
                                    {errors.enrollment && <p className="text-red-500 text-sm mt-1">{errors.enrollment}</p>}
                              </div>

                              {/* FOOD ITEM */}
                              <div>
                                    <label className="text-gray-600 text-sm">
                                          Food Item <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                          name="foodItem"
                                          value={formData.foodItem}
                                          onChange={handleChange}
                                          className={inputStyle}
                                    >
                                          <option value="">Select food item</option>
                                          <option value="Thali">Thali</option>
                                          <option value="Samosa">Samosa</option>
                                          <option value="Dosa">Dosa</option>
                                          <option value="Sandwich">Sandwich</option>
                                          <option value="Pizza">Pizza</option>
                                          <option value="Burger">Burger</option>
                                          <option value="Tea/Coffee">Tea/Coffee</option>
                                          <option value="Breakfast">Breakfast</option>
                                          <option value="Lunch">Lunch</option>
                                          <option value="Dinner">Dinner</option>
                                          <option value="Other">Other</option>
                                    </select>
                                    {errors.foodItem && <p className="text-red-500 text-sm mt-1">{errors.foodItem}</p>}
                              </div>

                              {/* OTHER FOOD INPUT */}
                              {formData.foodItem === 'Other' && (
                                    <div>
                                          <label className="text-gray-600 text-sm">
                                                Specify Food Item <span className="text-red-500">*</span>
                                          </label>
                                          <input
                                                type="text"
                                                name="customFoodItem"
                                                placeholder="Enter food name"
                                                value={formData.customFoodItem}
                                                onChange={handleChange}
                                                className={inputStyle}
                                          />
                                          {errors.customFoodItem && (
                                                <p className="text-red-500 text-sm mt-1">{errors.customFoodItem}</p>
                                          )}
                                    </div>
                              )}

                              {/* RATINGS */}
                              <div className="space-y-3 pt-2">
                                    <div>
                                          <label className="text-gray-600 text-sm font-medium">
                                                Taste Rating <span className="text-red-500">*</span>
                                          </label>
                                          <StarRating rating={taste} setRating={setTaste} error={errors.taste} />
                                    </div>

                                    <div>
                                          <label className="text-gray-600 text-sm font-medium">
                                                Cleanliness Rating <span className="text-red-500">*</span>
                                          </label>
                                          <StarRating
                                                rating={cleanliness}
                                                setRating={setCleanliness}
                                                error={errors.cleanliness}
                                          />
                                    </div>

                                    <div>
                                          <label className="text-gray-600 text-sm font-medium">
                                                Staff Behaviour Rating <span className="text-red-500">*</span>
                                          </label>
                                          <StarRating rating={staff} setRating={setStaff} error={errors.staff} />
                                    </div>
                              </div>

                              {/* COMMENT */}
                              <div className="pt-2">
                                    <label className="text-gray-600 text-sm">
                                          Comments <span className="text-gray-400 text-xs">(Optional)</span>
                                    </label>
                                    <textarea
                                          name="comment"
                                          rows="3"
                                          placeholder="Share your thoughts..."
                                          value={formData.comment}
                                          onChange={handleChange}
                                          className={inputStyle}
                                    />
                              </div>

                              {/* SUBMIT BUTTON */}
                              <button
                                    type="submit"
                                    disabled={loading || showDuplicateModal}
                                    className={`w-full py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition
       ${loading || showDuplicateModal ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white shadow hover:shadow-md'}`}
                              >
                                    {loading ? 'Submitting...' : 'Submit Feedback'}
                              </button>
                        </form>
                  </div>

                  {loading && (
                        <CanteenLoader
                              fullScreen={true}
                              text="Submitting Your Feedback..."
                              subtext="Recording your taste, cleanliness & service scores..."
                        />
                  )}

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
