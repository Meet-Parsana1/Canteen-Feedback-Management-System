import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Canteen from '../models/Canteen.js';
import Feedback from '../models/Feedback.js';

dotenv.config();

const sampleStudents = [
      { name: 'Aarav Sharma', prefix: '921001' },
      { name: 'Priya Patel', prefix: '921002' },
      { name: 'Rohan Mehta', prefix: '921003' },
      { name: 'Ananya Desai', prefix: '921004' },
      { name: 'Devansh Joshi', prefix: '921005' },
      { name: 'Sneha Trivedi', prefix: '921006' },
      { name: 'Aditya Rao', prefix: '921007' },
      { name: 'Kavya Shah', prefix: '921008' },
      { name: 'Manish Verma', prefix: '921009' },
      { name: 'Ishita Kapoor', prefix: '921010' },
      { name: 'Karan Dave', prefix: '921011' },
      { name: 'Pooja Vaghela', prefix: '921012' },
      { name: 'Siddharth Iyer', prefix: '921013' },
      { name: 'Tanvi Nair', prefix: '921014' },
      { name: 'Yash Solanki', prefix: '921015' },
];

const sampleDishes = [
      {
            foodItem: 'Lunch Thali Combo',
            tasteRange: [4, 5],
            cleanRange: [4, 5],
            staffRange: [4, 5],
            comments: [
                  'Great variety of sabzis and fresh warm chapatis today!',
                  'Unlimited dal and rice refill was very helpful during rush hour.',
                  'Very hygienic tray and wholesome meal.',
                  'Good value for money.',
            ],
      },
      {
            foodItem: 'Paneer Butter Masala with Naan',
            tasteRange: [4, 5],
            cleanRange: [4, 5],
            staffRange: [4, 5],
            comments: [
                  'Paneer was super soft and gravy had the perfect mild spices.',
                  'Best dish on the weekend menu. Highly recommended!',
                  'Delicious meal, fresh butter naan served piping hot.',
            ],
      },
      {
            foodItem: 'Masala Dosa & Sambar',
            tasteRange: [4, 5],
            cleanRange: [4, 5],
            staffRange: [3, 5],
            comments: [
                  'Crispy golden dosa with aromatic coconut chutney.',
                  'Sambar taste was authentic South Indian style.',
                  'Quick breakfast counter service.',
            ],
      },
      {
            foodItem: 'Veg Dum Biryani',
            tasteRange: [3, 5],
            cleanRange: [4, 5],
            staffRange: [4, 5],
            comments: [
                  'Fragrant basmati rice with nice raita accompaniment.',
                  'Good portion size for lunch.',
                  'Spices were well-balanced.',
            ],
      },
      {
            foodItem: 'Pav Bhaji Special',
            tasteRange: [4, 5],
            cleanRange: [3, 4],
            staffRange: [4, 5],
            comments: [
                  'Butter toasted pav with rich bhaji, loved the extra lemon & onion salad.',
                  'Taste was street-style authentic, counter was crowded.',
            ],
      },
      {
            foodItem: 'Chole Bhature',
            tasteRange: [3, 4],
            cleanRange: [3, 4],
            staffRange: [3, 4],
            comments: [
                  'Fluffy bhature, chole had good flavour though slightly spicy.',
                  'Pickle and onions complemented the dish well.',
            ],
      },
      {
            foodItem: 'Cold Coffee with Ice Cream',
            tasteRange: [4, 5],
            cleanRange: [5, 5],
            staffRange: [4, 5],
            comments: [
                  'Thick and refreshing after evening classes.',
                  'Best beverage counter item, great consistency.',
            ],
      },
      {
            foodItem: 'Grilled Veg Cheese Sandwich',
            tasteRange: [3, 4],
            cleanRange: [4, 5],
            staffRange: [4, 5],
            comments: [
                  'Quick snack, cheese was melted nicely with green chutney.',
                  'Crispy crust and clean packaging.',
            ],
      },
      {
            foodItem: 'Samosa Chaat',
            tasteRange: [3, 4],
            cleanRange: [3, 4],
            staffRange: [3, 4],
            comments: [
                  'Sweet and tangy tamarind chutney with hot samosa.',
                  'Crispy sev on top was fresh.',
            ],
      },
      {
            foodItem: 'Idli Vada Sambar Combo',
            tasteRange: [4, 5],
            cleanRange: [4, 5],
            staffRange: [4, 5],
            comments: [
                  'Soft steaming idlis and crunchy medu vada.',
                  'Very clean preparation at morning breakfast counter.',
            ],
      },
];

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
}

async function generateSampleFeedback() {
      try {
            console.log('Connecting to MongoDB Atlas...');
            await mongoose.connect(process.env.MONGO_URI);
            console.log('Connected to database.');

            // Find or create default canteen
            let canteen = await Canteen.findOne({ slug: 'mu-main-canteen' });
            if (!canteen) {
                  canteen = new Canteen({
                        name: 'MU Main Canteen',
                        institution: 'Marwadi University',
                        location: 'Main Campus Food Court, Block A',
                        slug: 'mu-main-canteen',
                        status: 'active',
                        feedbackEnabled: true,
                  });
                  await canteen.save();
                  console.log('Created default canteen: MU Main Canteen');
            }

            console.log(`Populating realistic 60-day feedback history for "${canteen.name}" (${canteen.slug})...`);

            const recordsToInsert = [];
            const now = new Date();
            const totalDays = 60; // 2 months back

            // Distribute ~75 feedbacks across the last 60 days
            for (let dayOffset = totalDays; dayOffset >= 0; dayOffset--) {
                  // Determine how many reviews on this day (e.g. 0 to 3 reviews per day)
                  const reviewsToday = dayOffset === 0 ? getRandomInt(2, 4) : getRandomInt(0, 2);

                  for (let r = 0; r < reviewsToday; r++) {
                        const student = getRandomItem(sampleStudents);
                        const enrollment = `${student.prefix}${getRandomInt(100, 999)}`;
                        const dish = getRandomItem(sampleDishes);

                        const taste = getRandomInt(dish.tasteRange[0], dish.tasteRange[1]);
                        const clean = getRandomInt(dish.cleanRange[0], dish.cleanRange[1]);
                        const staff = getRandomInt(dish.staffRange[0], dish.staffRange[1]);
                        const comment = getRandomItem(dish.comments);

                        // Generate realistic time during lunch/dinner hours on that date
                        const recordDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
                        const hour = getRandomItem([11, 12, 13, 14, 17, 18, 19, 20]);
                        const minute = getRandomInt(5, 55);
                        recordDate.setHours(hour, minute, getRandomInt(0, 59), 0);

                        recordsToInsert.push({
                              canteenId: canteen._id,
                              name: student.name,
                              enrollmentNumber: enrollment,
                              foodItem: dish.foodItem,
                              tasteRating: taste,
                              cleanlinessRating: clean,
                              staffBehaviourRating: staff,
                              comments: comment,
                              createdAt: recordDate,
                              updatedAt: recordDate,
                        });
                  }
            }

            // Insert records
            const inserted = await Feedback.insertMany(recordsToInsert);
            console.log(`\nSuccessfully inserted ${inserted.length} sample feedback records over the past 2 months!`);

            // Verify total feedback count for this canteen
            const totalCanteenCount = await Feedback.countDocuments({ canteenId: canteen._id });
            console.log(`Total feedback records now in "${canteen.name}": ${totalCanteenCount}`);

            console.log('\n--- Test Analytics Ready ---');
            console.log(`Student Public Analytics: http://localhost:5173/dashboard/${canteen.slug}`);
            console.log(`Admin Dashboard:          http://localhost:5173/admin`);

            process.exit(0);
      } catch (err) {
            console.error('Generation error:', err);
            process.exit(1);
      }
}

generateSampleFeedback();
