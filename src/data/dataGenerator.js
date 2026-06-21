// Seedable LCG Random Generator for Deterministic Datasets
function createRandom(seed = 42) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Indian City Coordinates & Areas
export const INDIAN_CITIES = [
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, areas: ["Indiranagar", "Koramangala", "Jayanagar", "HSR Layout", "MG Road", "Whitefield", "Malleshwaram", "Sadashivanagar"] },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, areas: ["Bandra West", "Juhu", "Andheri West", "Colaba", "Powai", "Worli", "Lokhandwala", "Khar West"] },
  { name: "Delhi", lat: 28.6139, lng: 77.2090, areas: ["Connaught Place", "Greater Kailash", "South Ext", "Vasant Kunj", "Karol Bagh", "Rajouri Garden", "Saket", "Dwarka"] },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867, areas: ["Jubilee Hills", "Banjara Hills", "Gachibowli", "Madhapur", "Begumpet", "Kondapur", "Secunderabad"] },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, areas: ["Nungambakkam", "Adyar", "T-Nagar", "Velachery", "Mylapore", "Anna Nagar", "Besant Nagar"] },
  { name: "Pune", lat: 18.5204, lng: 73.8567, areas: ["Koregaon Park", "Kalyani Nagar", "Aundh", "Viman Nagar", "Baner", "Kothrud", "Camp"] },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, areas: ["Salt Lake", "Park Street", "Ballygunge", "New Town", "Alipore", "Elgin Road", "Gariahat"] },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, areas: ["C-Scheme", "Malviya Nagar", "Vaishali Nagar", "Raja Park", "Mansarovar"] },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, areas: ["Satellite", "C G Road", "Bodakdev", "S G Highway", "Prahlad Nagar"] },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, areas: ["Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar", "Mahanagar"] },
  { name: "Kochi", lat: 9.9312, lng: 76.2673, areas: ["Fort Kochi", "Panampilly Nagar", "Edappally", "Kadavanthra", "Kakkanad"] },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794, areas: ["Sector 17", "Sector 35", "Sector 8", "Sector 9", "Sector 22"] }
];

// Names Pool for generator
const PREFIXES = [
  "Aura", "Royal", "Glow", "Lotus", "Javed", "Lakme", "Kaya", "VLCC", "Bodycraft", "Bounce",
  "Play", "Enrich", "Looks", "Geetanjali", "Affinity", "Mirrors", "Page 3", "Toni & Guy",
  "Limelite", "H2O", "Golden", "Silver", "Orchid", "Rose", "Jasmine", "Elite", "Signature",
  "Nirvana", "Ziva", "Anantara", "Tattva", "Heavenly", "Divine", "Oasis", "Amara", "Serene",
  "Urban", "Truefitt & Hill", "Femina", "BBlunt", "Estetica", "Bespoke", "Velvet", "Plush",
  "Crown", "Monsoon", "Roots", "Gloss", "Miracle", "Sutra", "Soul", "Prana", "Veda"
];

const STYLIST_NAMES = [
  "Vikram Rathore", "Neha Sen", "Karan Joseph", "Rhea Chhabra", "Aron Carter", "Monica D'Souza",
  "Marc de Fontaine", "Anjali Deshmukh", "Roshan Roy", "Elena D'Souza", "Rohan Sawant", "Preeti Verma",
  "Sumit Israni", "Ridhi Kapoor", "Aman Vohra", "Pooja Roy", "Sanjay Kumar", "Elena Vohra",
  "Shiva Prasad", "Srinivas Reddy", "Reece Thomas", "Kavita Rao", "John Devereux", "Priya Nair",
  "Gautam Nair", "Meera Krishnan", "Aditya Patil", "Shreya Shinde", "Didier Dubois", "Nisha Patel",
  "Amit Sharma", "Deepika Roy", "Rahul Verma", "Kriti Joshi", "Rajesh Nair", "Sneha Rao", "Divya Menon"
];

const CUSTOMER_NAMES = [
  "Ridhi Maliah", "Arjun Rao", "Kriti Gowda", "Deepika Padukone", "Shalini Kapoor", "Ranveer S.",
  "Zain Khan", "Pooja Hegde", "Mehak Malhotra", "Varun Malhotra", "Rahul B.", "Naveen Reddy",
  "Shreya G.", "Shruti Raghavan", "Ramya K.", "Piyush Deshmukh", "Varun D.", "Anil Kumar",
  "Sameer Sen", "Pranav Shah", "Kavita Mehta", "Aditi Nair", "Siddharth J.", "Nisha Sharma"
];

const REVIEW_COMMENTS = [
  "The service was outstanding! Standard of hygiene is always top-notch.",
  "Extremely professional staff. My stylist gave me exactly what I wanted.",
  "Highly recommended for premium hair treatments. The ambiance was calming.",
  "Worth every rupee. The staff is polite, and coordinates wait time perfectly.",
  "A bit crowded on weekends, but their booking priority system works well.",
  "Amazing facial! My skin feels completely hydrated and glowing.",
  "The massage was therapeutic. Instant relief from back pain.",
  "Precision styling at its best. Always regular here.",
  "Lovely nail art. The chrome finish is perfect.",
  "Excellent bridal consultation. Extremely happy with the results!"
];

const AMENITIES_POOL = [
  "Air Conditioning", "High-Speed Wi-Fi", "Valet Parking", "Complementary Beverages",
  "Private Treatment Cabins", "Couple Suites", "Shower Facility", "Card/UPI Payments",
  "Wheelchair Accessible", "Locker Room", "Kid Friendly", "Steam Bath"
];

// Service Prototypes by Category
const SERVICE_PROTOTYPES = {
  hair: [
    { name: "Precision Haircut & Style", basePrice: 800, duration: 40 },
    { name: "Signature Haircut by Master Stylist", basePrice: 1500, duration: 45 },
    { name: "Balayage Couture Color & Gloss", basePrice: 5500, duration: 150 },
    { name: "Luxury Moroccanoil Hair Spa", basePrice: 2200, duration: 60 },
    { name: "System Professional Lipid Booster", basePrice: 2800, duration: 45 },
    { name: "Organic Hair Keratin Infusion", basePrice: 6500, duration: 140 },
    { name: "Global High-Shine Hair Coloring", basePrice: 3800, duration: 120 },
    { name: "Deep Conditioning Argan Oil Mask", basePrice: 1800, duration: 40 }
  ],
  spa: [
    { name: "Balinese Full Body Massage", basePrice: 2800, duration: 75 },
    { name: "Hot Stone Aromatherapy Massage", basePrice: 3800, duration: 90 },
    { name: "Swedish Deep Tissue Therapy", basePrice: 2500, duration: 60 },
    { name: "Premium Foot Reflexology Relaxer", basePrice: 1200, duration: 45 },
    { name: "Stress Relief Back & Shoulder Massage", basePrice: 1500, duration: 30 },
    { name: "Sea Salt Botanical Body Scrub", basePrice: 2200, duration: 50 },
    { name: "Detoxifying Herbal Steam Bath", basePrice: 1600, duration: 40 }
  ],
  massage: [
    { name: "Deep Tissue Muscle Massage", basePrice: 2400, duration: 60 },
    { name: "Aromatherapy Foot Massage", basePrice: 1000, duration: 30 },
    { name: "Indian Head Massage (Champi)", basePrice: 600, duration: 30 },
    { name: "Sports Rehabilitation Massage", basePrice: 3000, duration: 75 },
    { name: "Thai Yoga Massage Ritual", basePrice: 2700, duration: 80 },
    { name: "Lympathic Drainage Therapy", basePrice: 3500, duration: 90 }
  ],
  nails: [
    { name: "Gel Manicure with Chrome Finish", basePrice: 1500, duration: 50 },
    { name: "Premium French Spa Pedicure", basePrice: 1200, duration: 50 },
    { name: "Acrylic Nail Extensions Set", basePrice: 2200, duration: 80 },
    { name: "Luxury Gel Extensions & Art", basePrice: 2800, duration: 75 },
    { name: "Nail Gel Overlay & Shine", basePrice: 1000, duration: 40 },
    { name: "Eyelash Extensions Luxe Set", basePrice: 3200, duration: 90 },
    { name: "Gloss Classic Manicure", basePrice: 800, duration: 35 }
  ],
  facial: [
    { name: "Medifacial Brightening Treatment", basePrice: 3800, duration: 60 },
    { name: "Hydrafacial MD Skin Deep Cleanse", basePrice: 4800, duration: 60 },
    { name: "Radiance Fruit Facial Cleanup", basePrice: 1200, duration: 45 },
    { name: "Organic Hydrating Medi-facial", basePrice: 3200, duration: 60 },
    { name: "Luminous Gold Radiance Facial", basePrice: 4200, duration: 70 },
    { name: "Intense Collagen Boosting Facial", basePrice: 5800, duration: 75 },
    { name: "Anti-Ageing Face Firming Treatment", basePrice: 5000, duration: 80 }
  ],
  grooming: [
    { name: "Precision Hair Fade & Trim", basePrice: 500, duration: 30 },
    { name: "Classic Beard Beard Trim & Groom", basePrice: 400, duration: 25 },
    { name: "Hot Towel Charcoal Shave & Groom", basePrice: 600, duration: 35 },
    { name: "VIP Grooming package (Hair + Beard)", basePrice: 1200, duration: 60 },
    { name: "Anti-Pollution Face Charcoal Scrub", basePrice: 800, duration: 30 }
  ],
  makeup: [
    { name: "Bridal HD Makeup Ritual", basePrice: 10000, duration: 180 },
    { name: "Celebrity Photographic HD Makeup", basePrice: 8000, duration: 150 },
    { name: "Party Glam Makeup Ritual", basePrice: 4500, duration: 90 },
    { name: "Engagement Airbrush Makeup", basePrice: 7500, duration: 120 },
    { name: "Classic Eye Styling & Lash Draping", basePrice: 2000, duration: 45 }
  ],
  tattoo: [
    { name: "Small Custom Flash Tattoo", basePrice: 1500, duration: 60 },
    { name: "Half Sleeve Lineart Tattoo", basePrice: 8000, duration: 180 },
    { name: "Premium Ear/Nose Piercing Session", basePrice: 1000, duration: 20 },
    { name: "Calligraphy Custom Lettering Tattoo", basePrice: 3000, duration: 45 }
  ],
  skinClinic: [
    { name: "Advanced Glycolic Chemical Peel", basePrice: 3500, duration: 50 },
    { name: "Carbon Laser Rejuvenation Peel", basePrice: 6500, duration: 60 },
    { name: "Skin Tightening Radiofrequency", basePrice: 8000, duration: 75 },
    { name: "Laser Hair Removal Express Session", basePrice: 2000, duration: 30 }
  ]
};

// Generates simulated business database deterministically
export function generateDatabase(size = 2000, seed = 1337) {
  const rand = createRandom(seed);
  const businesses = [];

  // Determine category targets based on overall size request
  const targets = {
    "Salon": Math.round(size * (500 / 2000)),
    "Spa": Math.round(size * (300 / 2000)),
    "Massage Center": Math.round(size * (250 / 2000)),
    "Nail Studio": Math.round(size * (250 / 2000)),
    "Beauty Parlour": Math.round(size * (200 / 2000)),
    "Makeup Artist": Math.round(size * (200 / 2000)),
    "Bridal Makeup Studio": Math.round(size * (150 / 2000)),
    "Hair Treatment Clinic": Math.round(size * (150 / 2000)),
    "Luxury Wellness Center": Math.round(size * (100 / 2000)),
    "Men's Grooming Lounge": Math.round(size * (100 / 2000)),
    "Tattoo Studio": Math.round(size * (100 / 2000)),
    "Skin Clinic": Math.round(size * (100 / 2000))
  };

  let idCounter = 1;

  Object.entries(targets).forEach(([bizType, count]) => {
    for (let i = 0; i < count; i++) {
      const cityObj = INDIAN_CITIES[Math.floor(rand() * INDIAN_CITIES.length)];
      const area = cityObj.areas[Math.floor(rand() * cityObj.areas.length)];
      const prefix = PREFIXES[Math.floor(rand() * PREFIXES.length)];
      
      let suffix = "Salon & Spa";
      let serviceCategoriesAllowed = [];
      
      switch(bizType) {
        case "Salon":
          suffix = rand() > 0.5 ? "Hair Studio" : "Salon & Spa";
          serviceCategoriesAllowed = ["hair", "facial", "grooming", "nails"];
          break;
        case "Spa":
          suffix = rand() > 0.5 ? "Wellness Spa" : "Aura Spa";
          serviceCategoriesAllowed = ["spa", "facial"];
          break;
        case "Massage Center":
          suffix = rand() > 0.5 ? "Massage Lounge" : "Reflexology Center";
          serviceCategoriesAllowed = ["massage", "spa"];
          break;
        case "Nail Studio":
          suffix = "Nail Art Lounge";
          serviceCategoriesAllowed = ["nails"];
          break;
        case "Beauty Parlour":
          suffix = "Beauty Parlour";
          serviceCategoriesAllowed = ["facial", "hair", "nails"];
          break;
        case "Makeup Artist":
          suffix = `Glam Studio`;
          serviceCategoriesAllowed = ["makeup"];
          break;
        case "Bridal Makeup Studio":
          suffix = "Bridal Couture";
          serviceCategoriesAllowed = ["makeup", "facial"];
          break;
        case "Hair Treatment Clinic":
          suffix = "Hair Clinic";
          serviceCategoriesAllowed = ["hair"];
          break;
        case "Luxury Wellness Center":
          suffix = "VIP Wellness Retreat";
          serviceCategoriesAllowed = ["spa", "facial", "hair", "makeup"];
          break;
        case "Men's Grooming Lounge":
          suffix = "Grooming Lounge";
          serviceCategoriesAllowed = ["grooming", "hair"];
          break;
        case "Tattoo Studio":
          suffix = "Tattoo Art Studio";
          serviceCategoriesAllowed = ["tattoo"];
          break;
        case "Skin Clinic":
          suffix = "Advanced Skin Clinic";
          serviceCategoriesAllowed = ["skinClinic", "facial"];
          break;
      }

      // Business details
      const name = `${prefix} ${suffix}`;
      const isLuxury = bizType === "Luxury Wellness Center" || (rand() > 0.8 && bizType !== "Beauty Parlour");
      const isBudget = !isLuxury && (bizType === "Beauty Parlour" || rand() > 0.7);
      
      let priceCategory;
      let priceMultiplier = 1.2;
      
      if (isLuxury) {
        priceCategory = "$$$$";
        priceMultiplier = 2.2 + rand() * 0.8;
      } else if (isBudget) {
        priceCategory = "$";
        priceMultiplier = 0.5 + rand() * 0.2;
      } else {
        priceCategory = rand() > 0.5 ? "$$" : "$$$";
        priceMultiplier = 0.9 + rand() * 0.4;
      }

      // Geo coordinates around city center
      const latOffset = (rand() - 0.5) * 0.09;
      const lngOffset = (rand() - 0.5) * 0.09;
      const coordinates = {
        lat: Number((cityObj.lat + latOffset).toFixed(5)),
        lng: Number((cityObj.lng + lngOffset).toFixed(5))
      };

      // Stylists / Staff
      const staffCount = 2 + Math.floor(rand() * 4);
      const stylists = [];
      for (let j = 0; j < staffCount; j++) {
        stylists.push({
          id: `st-${idCounter}-${j}`,
          name: STYLIST_NAMES[Math.floor(rand() * STYLIST_NAMES.length)],
          specialty: bizType === "Nail Studio" ? "Nail Artist" : bizType === "Hair Clinic" ? "Trichologist" : "Stylist",
          rating: Number((4.2 + rand() * 0.8).toFixed(1))
        });
      }

      // Services generator
      const services = [];
      serviceCategoriesAllowed.forEach(cat => {
        const prototypes = SERVICE_PROTOTYPES[cat] || [];
        // select 2-4 services per category
        const selectCount = 2 + Math.floor(rand() * 3);
        const shuffled = [...prototypes].sort(() => 0.5 - rand());
        
        shuffled.slice(0, selectCount).forEach((p, idx) => {
          services.push({
            id: `s-${idCounter}-${cat}-${idx}`,
            name: p.name,
            category: cat,
            price: Math.round((p.basePrice * priceMultiplier) / 50) * 50, // round to nearest 50
            duration: p.duration
          });
        });
      });

      // Reviews generator
      const reviewsCount = 10 + Math.floor(rand() * 120);
      const rating = Number((4.1 + rand() * 0.9).toFixed(1));
      const reviews = [];
      const reviewsToShow = Math.min(reviewsCount, 3);
      
      for (let j = 0; j < reviewsToShow; j++) {
        reviews.push({
          author: CUSTOMER_NAMES[Math.floor(rand() * CUSTOMER_NAMES.length)],
          rating: Math.floor(rating) + (rand() > 0.7 ? 1 : 0),
          date: `2026-06-${String(Math.floor(1 + rand() * 19)).padStart(2, '0')}`,
          comment: REVIEW_COMMENTS[Math.floor(rand() * REVIEW_COMMENTS.length)]
        });
      }

      // Amenities selection
      const amenities = [];
      const amenityCount = 3 + Math.floor(rand() * 4);
      const shuffledAmenities = [...AMENITIES_POOL].sort(() => 0.5 - rand());
      for (let j = 0; j < amenityCount; j++) {
        amenities.push(shuffledAmenities[j]);
      }

      // Queue variables (higher in metro or peak times, lower in luxury)
      const isMetro = ["Bangalore", "Mumbai", "Delhi", "Hyderabad"].includes(cityObj.name);
      const queueLength = isLuxury ? Math.floor(rand() * 2) : isMetro ? Math.floor(rand() * 8) : Math.floor(rand() * 4);
      const waitingTime = queueLength * 15; // 15 mins per person in queue
      const occupancy = queueLength >= 5 ? "High" : queueLength >= 2 ? "Medium" : "Low";

      businesses.push({
        id: `biz-${idCounter}`,
        name,
        type: bizType,
        city: cityObj.name,
        rating,
        reviewsCount,
        priceCategory,
        trending: rating >= 4.7 && rand() > 0.5,
        description: `${prefix} offers world-class ${bizType.toLowerCase()} solutions. Specialized in personalized service layouts, premium product suites, and hygienic, relaxing environments. Located in the popular hub of ${area}.`,
        address: `${Math.floor(10 + rand() * 200)} Main Rd, ${area}, ${cityObj.name}`,
        workingHours: isLuxury ? "9:00 AM - 10:00 PM" : "10:00 AM - 8:30 PM",
        imageTheme: getRandomTheme(prefix, rand),
        stylists,
        services,
        reviews,
        amenities,
        coordinates,
        queueLength,
        waitingTime,
        occupancy,
        owner: STYLIST_NAMES[Math.floor(rand() * STYLIST_NAMES.length)].split(' ')[0] + " Enterprise",
        contactDetails: {
          phone: `+91 ${9000000000 + Math.floor(rand() * 999999999)}`,
          email: `contact@${prefix.toLowerCase()}${suffix.toLowerCase().replace(/\s+/g, '')}.in`
        },
        socialLinks: {
          instagram: `@${prefix.toLowerCase()}_${bizType.toLowerCase().replace(/\s+/g, '')}`,
          facebook: `facebook.com/${prefix.toLowerCase()}_${bizType.toLowerCase().replace(/\s+/g, '')}`
        }
      });

      idCounter++;
    }
  });

  return businesses;
}

function getRandomTheme(prefix, rand) {
  const gradients = [
    "linear-gradient(135deg, #1A1A1D 0%, #C5A880 100%)", // Gold obsidian
    "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)", // Deep Teal
    "linear-gradient(135deg, #3A6073 0%, #16222F 100%)", // Deep Slate
    "linear-gradient(135deg, #2D142C 0%, #510A32 50%, #801336 100%)", // Royal Purple Wine
    "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Royal Blue
    "linear-gradient(135deg, #283c86 0%, #45a247 100%)", // Emerald Glow
    "linear-gradient(135deg, #23074d 0%, #cc5333 100%)", // Crimson Violet
    "linear-gradient(135deg, #141e30 0%, #243b55 100%)", // Dark Metallic Blue
    "linear-gradient(135deg, #000000 0%, #533440 100%)", // Champagne Noir
    "linear-gradient(135deg, #004e92 0%, #000428 100%)"  // Sapphire Ocean
  ];
  return gradients[Math.floor(rand() * gradients.length)];
}
