import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaStar, FaUtensils, FaMapMarkerAlt, FaUniversity, FaArrowLeft } from 'react-icons/fa';
import DuplicateFeedbackModal from './DuplicateFeedbackModal';
import FeedbackUnavailable from './FeedbackUnavailable';
import CanteenLoader from './CanteenLoader';
import Toast from './Toast';
import { buildApiUrl } from '../utils/api';

export default function CanteenFeedbackPage() {
      const { canteenSlug } = useParams();
      const navigate = useNavigate();

      const [canteen, setCanteen] = useState(null);
      const [pageLoading, setPageLoading] = useState(true);
      const [unavailableState, setUnavailableState] = useState(null); // { code, message, canteenName, institution }

      const [formData, setFormData] = useState({
            name: '',
            enrollmentNumber: '',
            foodItem: '',
            customFoodItem: '',
            comment: '',
      });

      const [loading, setLoading] = useState(false);
      const [toast, setToast] = useState(null);
      const [taste, setTaste] = useState(0);
      const [cleanliness, setCleanliness] = useState(0);
      const [staff, setStaff] = useState(0);
      const [errors, setErrors] = useState({});

      const [showDuplicateModal, setShowDuplicateModal] = useState(false);
      const [nextAllowedAt, setNextAllowedAt] = useState(null);

      useEffect(() => {
            if (!canteenSlug) {
                  setUnavailableState({
                        code: 'CANTEEN_NOT_FOUND',
                        message: 'No canteen identifier specified. Please scan a canteen QR code or choose a valid dining portal.',
                  });
                  setPageLoading(false);
                  return;
            }

            const fetchCanteen = async () => {
                  try {
                        setPageLoading(true);
                        const res = await fetch(buildApiUrl(`/api/canteens/${canteenSlug.toLowerCase().trim()}`));
                        const data = await res.json();

                        if (!res.ok || !data.success) {
                              setUnavailableState({
                                    code: data.code || 'CANTEEN_NOT_FOUND',
                                    message: data.message || 'Canteen not found.',
                                    canteenName: data.canteen?.name,
                                    institution: data.canteen?.institution,
                              });
                              return;
                        }

                        if (!data.canteen.canAcceptFeedback) {
                              setUnavailableState({
                                    code: data.canteen.status === 'pending'
                                          ? 'CANTEEN_PENDING'
                                          : data.canteen.status === 'suspended'
                                          ? 'CANTEEN_SUSPENDED'
                                          : !data.canteen.feedbackEnabled
                                          ? 'FEEDBACK_DISABLED'
                                          : 'CANTEEN_INACTIVE',
                                    message: data.canteen.statusMessage,
                                    canteenName: data.canteen.name,
                                    institution: data.canteen.institution,
                              });
                              return;
                        }

                        setCanteen(data.canteen);
                        setUnavailableState(null);
                  } catch (err) {
                        console.error('Canteen fetch error:', err);
                        setUnavailableState({
                              code: 'NETWORK_ERROR',
                              message: 'We could not connect to the feedback service. Please check your internet connection or try again later.',
                        });
                  } finally {
                        setPageLoading(false);
                  }
            };

            fetchCanteen();
      }, [canteenSlug]);

      const handleChange = (e) => {
            setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
            });
      };

      const validateForm = () => {
            let newErrors = {};

            if (!/^\d{11}$/.test(formData.enrollmentNumber.trim())) {
                  newErrors.enrollment = 'Enrollment number must be exactly 11 digits.';
            }

            if (!formData.foodItem) {
                  newErrors.foodItem = 'Please select a food item.';
            }

            if (formData.foodItem === 'Other' && !formData.customFoodItem.trim()) {
                  newErrors.customFoodItem = 'Please enter the custom food item.';
            }

            if (taste === 0) newErrors.taste = 'Please rate taste.';
            if (cleanliness === 0) newErrors.cleanliness = 'Please rate cleanliness.';
            if (staff === 0) newErrors.staff = 'Please rate staff behaviour.';

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            const finalFoodItem = formData.foodItem === 'Other' ? formData.customFoodItem.trim() : formData.foodItem;

            setLoading(true);

            try {
                  const response = await fetch(buildApiUrl(`/api/canteens/${canteenSlug}/feedback`), {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                              name: formData.name.trim(),
                              enrollmentNumber: formData.enrollmentNumber.trim(),
                              foodItem: finalFoodItem,
                              tasteRating: taste,
                              cleanlinessRating: cleanliness,
                              staffBehaviourRating: staff,
                              comments: formData.comment.trim(),
                        }),
                  });

                  const data = await response.json();

                  if (response.status === 400 && data.code === 'RATE_LIMITED_24H') {
                        setNextAllowedAt(data.nextAllowedAt);
                        setShowDuplicateModal(true);
                        setLoading(false);
                        return;
                  }

                  if (response.ok && data.success) {
                        setToast({
                              message: `Feedback submitted to ${canteen?.name || 'canteen'}! Thank you.`,
                              type: 'success',
                        });

                        setTimeout(() => {
                              navigate(`/thank-you?canteen=${encodeURIComponent(canteenSlug)}&name=${encodeURIComponent(canteen?.name || '')}`);
                        }, 900);
                  } else {
                        throw new Error(data.message || 'Submission failed');
                  }
            } catch (error) {
                  console.error('Submit error:', error);
                  setToast({
                        message: error.message || 'Failed to submit feedback. Please try again.',
                        type: 'error',
                  });
                  setLoading(false);
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
                                          className={`cursor-pointer text-2xl sm:text-3xl transition-all duration-200 ${
                                                star <= (hover || rating) ? 'text-amber-400 scale-105' : 'text-gray-300'
                                          }`}
                                          onClick={() => setRating(star)}
                                          onMouseEnter={() => setHover(star)}
                                          onMouseLeave={() => setHover(null)}
                                    />
                              ))}
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
                  </div>
            );
      };

      const inputStyle =
            'w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2.5 sm:py-3 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition text-sm sm:text-base';

      if (pageLoading) {
            return (
                  <CanteenLoader
                        fullScreen={true}
                        text="Connecting to Canteen Feedback Portal..."
                        subtext="Verifying dining hall credentials and loading menu items..."
                  />
            );
      }

      if (unavailableState) {
            return (
                  <FeedbackUnavailable
                        code={unavailableState.code}
                        message={unavailableState.message}
                        canteenName={unavailableState.canteenName}
                        institution={unavailableState.institution}
                  />
            );
      }

      return (
            <div className="min-h-screen bg-gradient-to-b from-teal-50/80 via-slate-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative">
                  {toast && (
                        <Toast
                              message={toast.message}
                              type={toast.type}
                              onClose={() => setToast(null)}
                        />
                  )}

                  {/* Top Navigation Strip */}
                  <div className="w-full max-w-lg mb-4 flex items-center justify-between">
                        <Link
                              to="/"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition"
                        >
                              <FaArrowLeft className="text-[10px]" /> Back to CanteenIQ Home
                        </Link>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active Feedback Channel
                        </span>
                  </div>

                  <div className="bg-white shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-lg border border-slate-200/90 relative overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-100/50 rounded-full blur-2xl pointer-events-none" />

                        {/* Canteen Identity Header */}
                        <div className="text-center mb-6 pb-5 border-b border-slate-100">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-teal-500/20">
                                    <FaUtensils className="text-xl" />
                              </div>
                              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {canteen?.name}
                              </h1>
                              <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                                    {canteen?.institution && (
                                          <span className="inline-flex items-center gap-1">
                                                <FaUniversity className="text-teal-600" /> {canteen.institution}
                                          </span>
                                    )}
                                    {canteen?.location && (
                                          <span className="inline-flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-teal-600" /> {canteen.location}
                                          </span>
                                    )}
                              </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                              {/* NAME */}
                              <div>
                                    <label className="text-slate-700 text-xs sm:text-sm font-semibold block mb-1">
                                          Your Name <span className="text-slate-400 text-xs font-normal">(Optional)</span>
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
                                    <label className="text-slate-700 text-xs sm:text-sm font-semibold block mb-1">
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
                                    {errors.enrollment && (
                                          <p className="text-red-500 text-xs mt-1 font-medium">{errors.enrollment}</p>
                                    )}
                              </div>

                              {/* FOOD ITEM */}
                              <div>
                                    <label className="text-slate-700 text-xs sm:text-sm font-semibold block mb-1">
                                          Food Item Ordered <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                          name="foodItem"
                                          value={formData.foodItem}
                                          onChange={handleChange}
                                          className={inputStyle}
                                    >
                                          <option value="">Select food item</option>
                                          <option value="Veg Thali Combo">Veg Thali Combo</option>
                                          <option value="Special Punjabi Thali">Special Punjabi Thali</option>
                                          <option value="Masala Dosa">Masala Dosa</option>
                                          <option value="Paneer Butter Masala">Paneer Butter Masala</option>
                                          <option value="Samosa & Chutney">Samosa & Chutney</option>
                                          <option value="Grilled Cheese Sandwich">Grilled Cheese Sandwich</option>
                                          <option value="Veg Burger">Veg Burger</option>
                                          <option value="Farmhouse Pizza">Farmhouse Pizza</option>
                                          <option value="Hot Tea / Filter Coffee">Hot Tea / Filter Coffee</option>
                                          <option value="Breakfast Snacks">Breakfast Snacks</option>
                                          <option value="Lunch Meal">Lunch Meal</option>
                                          <option value="Dinner Meal">Dinner Meal</option>
                                          <option value="Other">Other (Specify)</option>
                                    </select>
                                    {errors.foodItem && (
                                          <p className="text-red-500 text-xs mt-1 font-medium">{errors.foodItem}</p>
                                    )}
                              </div>

                              {/* OTHER FOOD INPUT */}
                              {formData.foodItem === 'Other' && (
                                    <div>
                                          <label className="text-slate-700 text-xs sm:text-sm font-semibold block mb-1">
                                                Specify Food Item <span className="text-red-500">*</span>
                                          </label>
                                          <input
                                                type="text"
                                                name="customFoodItem"
                                                placeholder="Enter food item name"
                                                value={formData.customFoodItem}
                                                onChange={handleChange}
                                                className={inputStyle}
                                          />
                                          {errors.customFoodItem && (
                                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.customFoodItem}</p>
                                          )}
                                    </div>
                              )}

                              {/* RATINGS */}
                              <div className="space-y-3 pt-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
                                    <div>
                                          <label className="text-slate-700 text-xs sm:text-sm font-bold block mb-1">
                                                1. Taste Rating <span className="text-red-500">*</span>
                                          </label>
                                          <StarRating rating={taste} setRating={setTaste} error={errors.taste} />
                                    </div>

                                    <div>
                                          <label className="text-slate-700 text-xs sm:text-sm font-bold block mb-1">
                                                2. Cleanliness Rating <span className="text-red-500">*</span>
                                          </label>
                                          <StarRating
                                                rating={cleanliness}
                                                setRating={setCleanliness}
                                                error={errors.cleanliness}
                                          />
                                    </div>

                                    <div>
                                          <label className="text-slate-700 text-xs sm:text-sm font-bold block mb-1">
                                                3. Staff Behaviour Rating <span className="text-red-500">*</span>
                                          </label>
                                          <StarRating rating={staff} setRating={setStaff} error={errors.staff} />
                                    </div>
                              </div>

                              {/* COMMENT */}
                              <div className="pt-1">
                                    <label className="text-slate-700 text-xs sm:text-sm font-semibold block mb-1">
                                          Comments & Suggestions <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                                    </label>
                                    <textarea
                                          name="comment"
                                          rows="3"
                                          placeholder="Share specific feedback about taste, portion, speed, or staff..."
                                          value={formData.comment}
                                          onChange={handleChange}
                                          className={inputStyle}
                                    />
                              </div>

                              {/* SUBMIT BUTTON */}
                              <button
                                    type="submit"
                                    disabled={loading || showDuplicateModal}
                                    className={`w-full py-3.5 rounded-xl text-sm sm:text-base font-bold transition shadow-lg
                                    ${loading || showDuplicateModal
                                          ? 'bg-slate-400 text-white cursor-not-allowed'
                                          : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25 hover:shadow-xl hover:-translate-y-0.5'}`}
                              >
                                    {loading ? 'Recording Feedback...' : `Submit Feedback to ${canteen?.name}`}
                              </button>
                        </form>
                  </div>

                  {loading && (
                        <CanteenLoader
                              fullScreen={true}
                              text={`Submitting to ${canteen?.name}...`}
                              subtext="Recording your ratings securely with tenant validation..."
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
