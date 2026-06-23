export const CITIES = [
  "All Cities",
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Chennai",
  "Pune"
];

export const SERVICES_CATEGORIES = [
  { id: "all", name: "All Services", icon: "Sparkles" },
  { id: "hair", name: "Hair Care", icon: "Scissors" },
  { id: "makeup", name: "Makeup", icon: "Palette" },
  { id: "spa", name: "Spa & Massage", icon: "Flower2" },
  { id: "nails", name: "Nails & Art", icon: "Sparkles" },
  { id: "facial", name: "Facial & Skin", icon: "Heart" },
  { id: "grooming", name: "Grooming", icon: "Smile" }
];

export const SALONS = [
  // BANGALORE SALONS
  {
    id: "b1",
    name: "Bodycraft Salon & Spa",
    city: "Bangalore",
    rating: 4.8,
    reviewsCount: 384,
    priceCategory: "$$$",
    trending: true,
    description: "Bangalore's premier luxury salon and wellness spa. Catering to skincare, advanced hair styling, and holistic wellness therapies using cutting-edge international standards.",
    address: "100 Feet Rd, Indiranagar, Bangalore",
    workingHours: "9:00 AM - 9:00 PM",
    imageTheme: "linear-gradient(135deg, #1A1A1D, #C5A880)",
    stylists: [
      { id: "st-b1-1", name: "Vikram Rathore", specialty: "Senior Hair Architect", rating: 4.9 },
      { id: "st-b1-2", name: "Neha Sen", specialty: "Advanced Medi-Facials", rating: 4.8 }
    ],
    services: [
      { id: "s1", name: "Signature Haircut by Master Stylist", category: "hair", price: 1500, duration: 45 },
      { id: "s2", name: "Balayage Couture Color & Gloss", category: "hair", price: 6500, duration: 150 },
      { id: "s3", name: "Medifacial Brightening Treatment", category: "facial", price: 4200, duration: 60 },
      { id: "s4", name: "Balinese Full Body Massage", category: "spa", price: 3200, duration: 75 },
      { id: "s5", name: "Gel Manicure with Chrome Finish", category: "nails", price: 1800, duration: 50 },
      { id: "s6", name: "Bridal HD Makeup Ritual", category: "makeup", price: 12000, duration: 180 }
    ],
    reviews: [
      { author: "Ridhi Maliah", rating: 5, date: "2026-06-12", comment: "The Balinese massage is therapeutic! Standard of service is always excellent." },
      { author: "Arjun Rao", rating: 4, date: "2026-06-08", comment: "Master stylist did a fantastic job with my hair re-styling. Clean and safe protocols." }
    ]
  },
  {
    id: "b2",
    name: "Bounce Salon & Spa",
    city: "Bangalore",
    rating: 4.7,
    reviewsCount: 295,
    priceCategory: "$$$",
    trending: false,
    description: "Known for fashion-forward cuts and expert colorists, Bounce offers an unmatched bespoke experience in hair design, luxury pedicures, and nail art.",
    address: "Vittal Mallya Road, D'Souza Layout, Bangalore",
    workingHours: "10:00 AM - 8:30 PM",
    imageTheme: "linear-gradient(135deg, #0F2027, #2C5364)",
    stylists: [
      { id: "st-b2-1", name: "Karan Joseph", specialty: "Precision Cutting", rating: 4.7 },
      { id: "st-b2-2", name: "Rhea Chhabra", specialty: "Chrome Nail Art", rating: 4.8 }
    ],
    services: [
      { id: "s7", name: "Precision Haircut & Blow Dry", category: "hair", price: 1200, duration: 45 },
      { id: "s8", name: "Luxury Moroccanoil Hair Spa", category: "hair", price: 2500, duration: 60 },
      { id: "s9", name: "System Professional Lipid Booster", category: "hair", price: 3000, duration: 40 },
      { id: "s10", name: "Express Botanical Facial", category: "facial", price: 2800, duration: 45 },
      { id: "s11", name: "Premium French Spa Pedicure", category: "nails", price: 1400, duration: 50 }
    ],
    reviews: [
      { author: "Kriti Gowda", rating: 5, date: "2026-06-15", comment: "Exceptional service! Moroccanoil Spa completely revived my dry hair." }
    ]
  },
  {
    id: "b3",
    name: "Play Salon",
    city: "Bangalore",
    rating: 4.6,
    reviewsCount: 172,
    priceCategory: "$$",
    trending: false,
    description: "A trendy boutique destination for high-end coloring, global hair smooth treatments, express spa relief, and custom nail extension arts.",
    address: "Koramangala 3rd Block, Bangalore",
    workingHours: "10:00 AM - 8:30 PM",
    imageTheme: "linear-gradient(135deg, #3A6073, #16222F)",
    stylists: [
      { id: "st-b3-1", name: "Aron Carter", specialty: "Creative Color", rating: 4.6 },
      { id: "st-b3-2", name: "Monica D'Souza", specialty: "Nail Extensions Specialist", rating: 4.7 }
    ],
    services: [
      { id: "s101", name: "Creative Hair Coloring & Highlights", category: "hair", price: 3800, duration: 110 },
      { id: "s102", name: "L'Oreal Hair Spa Ritual", category: "hair", price: 1800, duration: 50 },
      { id: "s103", name: "Aromatherapy Foot Massager", category: "spa", price: 1200, duration: 30 },
      { id: "s104", name: "Acrylic Nail Extensions Set", category: "nails", price: 2200, duration: 80 }
    ],
    reviews: [
      { author: "Deepika Padukone", rating: 5, date: "2026-06-12", comment: "Play Salon is my absolute favorite for express nail work. Fast and clean!" }
    ]
  },

  // MUMBAI SALONS
  {
    id: "m1",
    name: "Jean-Claude Biguine Salon & Spa",
    city: "Mumbai",
    rating: 4.9,
    reviewsCount: 512,
    priceCategory: "$$$$",
    trending: true,
    description: "Bringing French elegance and elite European styling directly to Mumbai. Jean-Claude Biguine (JCB) is the gold standard for global styles, premium spa rituals, and editorial makeup.",
    address: "Bandra West, off Linking Road, Mumbai",
    workingHours: "9:00 AM - 9:00 PM",
    imageTheme: "linear-gradient(135deg, #2D142C, #510A32)",
    stylists: [
      { id: "st-m1-1", name: "Marc de Fontaine", specialty: "European Balayage", rating: 5.0 },
      { id: "st-m1-2", name: "Anjali Deshmukh", specialty: "Editorial Makeup", rating: 4.9 }
    ],
    services: [
      { id: "s12", name: "French Balayage Signature", category: "hair", price: 8500, duration: 180 },
      { id: "s13", name: "Olga Keratin Gold Infusion", category: "hair", price: 9500, duration: 150 },
      { id: "s14", name: "JCB Organic Anti-Ageing Facial", category: "facial", price: 5500, duration: 75 },
      { id: "s15", name: "Hot Stone Aromatherapy Massage", category: "spa", price: 4500, duration: 90 },
      { id: "s16", name: "Luxury Gel Extensions with Custom Art", category: "nails", price: 3000, duration: 75 }
    ],
    reviews: [
      { author: "Shalini Kapoor", rating: 5, date: "2026-06-16", comment: "JCB Bandra is amazing. The French styling techniques they use are super precise." },
      { author: "Ranveer S.", rating: 5, date: "2026-06-14", comment: "Top-notch service, extremely hygienic. Always my go-to place in Mumbai." }
    ]
  },
  {
    id: "m2",
    name: "BBLUNT Salon",
    city: "Mumbai",
    rating: 4.6,
    reviewsCount: 418,
    priceCategory: "$$$",
    trending: false,
    description: "India's destination for Bollywood-ready hair. Founded by Adhuna Bhabani, BBLUNT is famous for street-smart styling, dramatic color transformations, and high-energy makeovers.",
    address: "Juhu Tara Road, Juhu, Mumbai",
    workingHours: "10:00 AM - 9:00 PM",
    imageTheme: "linear-gradient(135deg, #1F1C2C, #928DAB)",
    stylists: [
      { id: "st-m2-1", name: "Roshan Roy", specialty: "Creative Cuts", rating: 4.6 },
      { id: "st-m2-2", name: "Elena D'Souza", specialty: "Global Colorist", rating: 4.7 }
    ],
    services: [
      { id: "s17", name: "BBLUNT Precision Styling Cut", category: "hair", price: 1400, duration: 45 },
      { id: "s18", name: "Global High-Shine Hair Coloring", category: "hair", price: 4000, duration: 120 },
      { id: "s19", name: "Bespoke System Hair Keratin", category: "hair", price: 7000, duration: 150 },
      { id: "s20", name: "Classic Beard Beard Trim & Groom", category: "grooming", price: 600, duration: 30 }
    ],
    reviews: [
      { author: "Zain Khan", rating: 5, date: "2026-06-11", comment: "BBLUNT never disappoints. Got a complete haircut makeover and absolutely loved it." }
    ]
  },
  {
    id: "m3",
    name: "Enrich Salon",
    city: "Mumbai",
    rating: 4.5,
    reviewsCount: 228,
    priceCategory: "$$",
    trending: false,
    description: "Mumbai's most trusted neighborhood beauty salon chain. Known for efficient skin cleanups, classic pedicures, and modern hair color services.",
    address: "Lokhandwala Complex, Andheri West, Mumbai",
    workingHours: "10:00 AM - 8:30 PM",
    imageTheme: "linear-gradient(135deg, #654EA3, #EAAFC8)",
    stylists: [
      { id: "st-m3-1", name: "Rohan Sawant", specialty: "Color Specialist", rating: 4.5 },
      { id: "st-m3-2", name: "Preeti Verma", specialty: "Esthetician facials", rating: 4.6 }
    ],
    services: [
      { id: "s105", name: "Classic Hair Highlights", category: "hair", price: 2800, duration: 90 },
      { id: "s106", name: "Radiance Fruit Facial Cleanup", category: "facial", price: 1500, duration: 45 },
      { id: "s107", name: "Gel Overlay Pedicure", category: "nails", price: 1200, duration: 40 },
      { id: "s108", name: "Bespoke Beard Styling Shave", category: "grooming", price: 450, duration: 25 }
    ],
    reviews: [
      { author: "Pooja Hegde", rating: 4, date: "2026-06-12", comment: "Conveniently located and very pocket friendly. Pedicure was done with detail." }
    ]
  },

  // DELHI SALONS
  {
    id: "d1",
    name: "Geetanjali Salon",
    city: "Delhi",
    rating: 4.8,
    reviewsCount: 620,
    priceCategory: "$$$",
    trending: true,
    description: "Co-founded by Sumit Israni, Geetanjali Salon is a luxurious family salon chain offering highly customized hair coloring, global keratin therapies, and spectacular bridal lookbook designs.",
    address: "M-Block Market, Greater Kailash 2, New Delhi",
    workingHours: "9:30 AM - 8:30 PM",
    imageTheme: "linear-gradient(135deg, #111, #444)",
    stylists: [
      { id: "st-d1-1", name: "Sumit Israni (Founder Associate)", specialty: "Hair Transformations", rating: 4.9 },
      { id: "st-d1-2", name: "Ridhi Kapoor", specialty: "Luminous Facials", rating: 4.8 }
    ],
    services: [
      { id: "s21", name: "Redken Acidic Bonding Concentrate Spa", category: "hair", price: 3500, duration: 60 },
      { id: "s22", name: "Signature Haircut by Master Associate", category: "hair", price: 1800, duration: 50 },
      { id: "s23", name: "Luminous Gold Radiance Facial", category: "facial", price: 4500, duration: 70 },
      { id: "s24", name: "Bridal Airbrush Masterclass Makeup", category: "makeup", price: 15000, duration: 180 },
      { id: "s25", name: "Foot Reflexology Relaxer", category: "spa", price: 1800, duration: 45 }
    ],
    reviews: [
      { author: "Mehak Malhotra", rating: 5, date: "2026-06-15", comment: "Geetanjali is a class apart. The GK-2 branch is beautiful and the Redken Spa was incredibly relaxing." }
    ]
  },
  {
    id: "d2",
    name: "Looks Salon",
    city: "Delhi",
    rating: 4.7,
    reviewsCount: 531,
    priceCategory: "$$$",
    trending: false,
    description: "One of Delhi's most iconic and reliable premium salon groups. Looks is highly recognized for signature cuts, trendy styling, luxury nail extensions, and precision skin treatments.",
    address: "Inner Circle, Connaught Place, New Delhi",
    workingHours: "9:00 AM - 9:00 PM",
    imageTheme: "linear-gradient(135deg, #243B55, #141E30)",
    stylists: [
      { id: "st-d2-1", name: "Aman Vohra", specialty: "Smartbond Stylist", rating: 4.7 },
      { id: "st-d2-2", name: "Pooja Roy", specialty: "Acrylic Nails", rating: 4.7 }
    ],
    services: [
      { id: "s26", name: "Precision Cut & Blow Dry", category: "hair", price: 1000, duration: 40 },
      { id: "s27", name: "L'Oreal Professionnel Smartbond treatment", category: "hair", price: 2800, duration: 65 },
      { id: "s28", name: "Hydrafacial MD Skin Deep Cleanse", category: "facial", price: 5000, duration: 60 },
      { id: "s29", name: "Gel Polish Nails & Glitter Overlay", category: "nails", price: 1600, duration: 45 }
    ],
    reviews: [
      { author: "Varun Malhotra", rating: 4, date: "2026-06-10", comment: "Excellent stylists at Looks CP. Clean facility and polite staff." }
    ]
  },
  {
    id: "d3",
    name: "Affinity Salon",
    city: "Delhi",
    rating: 4.6,
    reviewsCount: 190,
    priceCategory: "$$$",
    trending: false,
    description: "A premium hair salon chain known for its sophisticated interiors, personalized hair treatments, and top-tier grooming services.",
    address: "Green Park Market, New Delhi",
    workingHours: "9:30 AM - 8:30 PM",
    imageTheme: "linear-gradient(135deg, #EAECC6, #2BC0E4)",
    stylists: [
      { id: "st-d3-1", name: "Sanjay Kumar", specialty: "Cut Architect", rating: 4.6 },
      { id: "st-d3-2", name: "Elena Vohra", specialty: "Nails & Lash Design", rating: 4.7 }
    ],
    services: [
      { id: "s109", name: "Custom Balayage Hair coloring", category: "hair", price: 5500, duration: 130 },
      { id: "s110", name: "Deep Conditioning Argan oil Mask", category: "hair", price: 2200, duration: 45 },
      { id: "s111", name: "Eyelash extensions Luxe set", category: "nails", price: 3500, duration: 90 },
      { id: "s112", name: "Stress Relief Back Massage", category: "spa", price: 1600, duration: 30 }
    ],
    reviews: [
      { author: "Rahul B.", rating: 5, date: "2026-06-08", comment: "Affinity Green Park is outstanding. Best Argan spa in South Delhi." }
    ]
  },

  // HYDERABAD SALONS
  {
    id: "h1",
    name: "Mirrors Luxury Salons",
    city: "Hyderabad",
    rating: 4.9,
    reviewsCount: 342,
    priceCategory: "$$$$",
    trending: true,
    description: "Mirrors is the epitome of absolute luxury in Hyderabad. A celebrity hub specializing in bespoke aesthetic styling, advanced hair treatments, and VIP spa suites.",
    address: "Road No. 36, Jubilee Hills, Hyderabad",
    workingHours: "10:00 AM - 8:30 PM",
    imageTheme: "linear-gradient(135deg, #6441A5, #2A0845)",
    stylists: [
      { id: "st-h1-1", name: "Shiva Prasad", specialty: "Chronologiste Caviar Spa", rating: 4.9 },
      { id: "st-h1-2", name: "Srinivas Reddy", specialty: "VIP Grooming", rating: 4.8 }
    ],
    services: [
      { id: "s30", name: "Kérastase Chronologiste Caviar Ritual", category: "hair", price: 6000, duration: 90 },
      { id: "s31", name: "Master Cut & Beard Detail Stylist", category: "hair", price: 1800, duration: 60 },
      { id: "s32", name: "Intense Collagen Boosting Facial", category: "facial", price: 6500, duration: 75 },
      { id: "s33", name: "Celebrity Photographic HD Makeup", category: "makeup", price: 10000, duration: 150 }
    ],
    reviews: [
      { author: "Naveen Reddy", rating: 5, date: "2026-06-13", comment: "Unparalleled hospitality and luxury. The Kérastase caviar spa treatment is worth every rupee." }
    ]
  },
  {
    id: "h2",
    name: "Page 3 Luxury Salon",
    city: "Hyderabad",
    rating: 4.7,
    reviewsCount: 165,
    priceCategory: "$$$",
    trending: false,
    description: "A premium lifestyle salon chain presenting high-fashion hair designs, luxury makeup masterclasses, and specialized skin therapy protocols.",
    address: "Road No. 45, Jubilee Hills, Hyderabad",
    workingHours: "10:00 AM - 9:00 PM",
    imageTheme: "linear-gradient(135deg, #F0C27B, #4B1248)",
    stylists: [
      { id: "st-h2-1", name: "Reece Thomas", specialty: "Master Stylist", rating: 4.8 },
      { id: "st-h2-2", name: "Kavita Rao", specialty: "Medi-facial Therapist", rating: 4.7 }
    ],
    services: [
      { id: "s113", name: "Keratin Deep Fusion styling", category: "hair", price: 6500, duration: 140 },
      { id: "s114", name: "Organic Hydrating Medi-facial", category: "facial", price: 3800, duration: 60 },
      { id: "s115", name: "Party Glam Makeup Ritual", category: "makeup", price: 5000, duration: 90 }
    ],
    reviews: [
      { author: "Shreya G.", rating: 5, date: "2026-06-11", comment: "Page 3 Jubilee Hills has a beautiful aesthetic. Extremely premium service." }
    ]
  },

  // CHENNAI SALONS
  {
    id: "c1",
    name: "Toni & Guy Salon",
    city: "Chennai",
    rating: 4.8,
    reviewsCount: 421,
    priceCategory: "$$$",
    trending: true,
    description: "An internationally acclaimed British salon brand in Nungambakkam. Toni & Guy is famous for creative precision cuts, fashion styling, and luxury personal grooming services.",
    address: "Khader Nawaz Khan Road, Nungambakkam, Chennai",
    workingHours: "9:00 AM - 9:00 PM",
    imageTheme: "linear-gradient(135deg, #000428, #004e92)",
    stylists: [
      { id: "st-c1-1", name: "John Devereux", specialty: "Academy Hair Design", rating: 4.9 },
      { id: "st-c1-2", name: "Priya Nair", specialty: "Bridal Styling", rating: 4.8 }
    ],
    services: [
      { id: "s34", name: "Toni & Guy Academy Precision Cut", category: "hair", price: 1600, duration: 50 },
      { id: "s35", name: "Label.m Honey & Oat Hair Spa", category: "hair", price: 2400, duration: 60 },
      { id: "s36", name: "Dermalogica Skin Brightening Cleanse", category: "facial", price: 3500, duration: 60 },
      { id: "s37", name: "Traditional South Indian Silk Makeup", category: "makeup", price: 11000, duration: 150 }
    ],
    reviews: [
      { author: "Shruti Raghavan", rating: 5, date: "2026-06-14", comment: "Perfect precision cut! Toni & Guy KNK Road is highly recommended for hair design." }
    ]
  },
  {
    id: "c2",
    name: "Limelite Salon & Spa",
    city: "Chennai",
    rating: 4.6,
    reviewsCount: 154,
    priceCategory: "$$",
    trending: false,
    description: "Indulgent skin therapies and signature styling cuts. Limelite provides a calm, rejuvenating space with organic botanicals for custom beauty services.",
    address: "Adyar Main Road, Chennai",
    workingHours: "9:30 AM - 8:30 PM",
    imageTheme: "linear-gradient(135deg, #56AB2F, #A8E063)",
    stylists: [
      { id: "st-c2-1", name: "Gautam Nair", specialty: "Styling Architect", rating: 4.6 },
      { id: "st-c2-2", name: "Meera Krishnan", specialty: "Organic Skin Expert", rating: 4.7 }
    ],
    services: [
      { id: "s116", name: "Sea Salt Botanical Face Scrub", category: "facial", price: 1900, duration: 40 },
      { id: "s117", name: "Relaxing Herbal Oil head massage", category: "spa", price: 1200, duration: 30 },
      { id: "s118", name: "Precision Hair trim & Blowdry", category: "hair", price: 900, duration: 35 }
    ],
    reviews: [
      { author: "Ramya K.", rating: 5, date: "2026-06-12", comment: "Limelite Adyar is my regular spot. Their herbal head massage is exceptionally soothing." }
    ]
  },

  // PUNE SALONS
  {
    id: "p1",
    name: "H2O Hair & Beauty Salon",
    city: "Pune",
    rating: 4.7,
    reviewsCount: 260,
    priceCategory: "$$$",
    trending: false,
    description: "Pune's elite fashion salon. Delivering signature hairstyles, organic body wellness rituals, and professional cosmetics solutions to Koregaon Park residents.",
    address: "Lane 6, Koregaon Park, Pune",
    workingHours: "9:30 AM - 8:30 PM",
    imageTheme: "linear-gradient(135deg, #1e3c72, #2a5298)",
    stylists: [
      { id: "st-p1-1", name: "Aditya Patil", specialty: "Texture Crop & Fades", rating: 4.8 },
      { id: "st-p1-2", name: "Shreya Shinde", specialty: "Organic Body Wellness", rating: 4.7 }
    ],
    services: [
      { id: "s38", name: "Signature Haircut & Spa Finish", category: "hair", price: 1100, duration: 45 },
      { id: "s39", name: "Premium De-stress Hot Oil Massage", category: "spa", price: 2800, duration: 60 },
      { id: "s40", name: "H2O Glow Infusion Facial", category: "facial", price: 3200, duration: 55 },
      { id: "s41", name: "Classic French Manicure & Massage", category: "nails", price: 1300, duration: 40 }
    ],
    reviews: [
      { author: "Piyush Deshmukh", rating: 5, date: "2026-06-09", comment: "Superb haircut and extremely friendly staff. H2O is the best in Koregaon Park." }
    ]
  },
  {
    id: "p2",
    name: "Jean-Claude Biguine Salon & Spa",
    city: "Pune",
    rating: 4.8,
    reviewsCount: 198,
    priceCategory: "$$$$",
    trending: true,
    description: "Bringing elite French styling, organic spa therapeutics, and master aesthetics cosmetology to Pune's upscale Kalyani Nagar area.",
    address: "Kalyani Nagar, Pune",
    workingHours: "9:00 AM - 9:00 PM",
    imageTheme: "linear-gradient(135deg, #D3CBB8, #6D604F)",
    stylists: [
      { id: "st-p2-1", name: "Didier Dubois", specialty: "Senior French Stylist", rating: 4.9 },
      { id: "st-p2-2", name: "Nisha Patel", specialty: "European Medi-facials", rating: 4.8 }
    ],
    services: [
      { id: "s119", name: "Signature French Blowdry & Style", category: "hair", price: 2500, duration: 50 },
      { id: "s120", name: "Olay Collagen Infused Facial", category: "facial", price: 5000, duration: 70 },
      { id: "s121", name: "Aromatherapy Deep Stress Reliever", category: "spa", price: 3500, duration: 60 }
    ],
    reviews: [
      { author: "Varun D.", rating: 5, date: "2026-06-15", comment: "JCB Kalyani Nagar is stunning. Didier Dubois gave me the best style I've had in years." }
    ]
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: "bkg-1",
    salonId: "b1",
    salonName: "Bodycraft Salon & Spa",
    city: "Bangalore",
    customerName: "Rohan Deshmukh",
    stylistName: "Vikram Rathore",
    services: [
      { name: "Signature Haircut by Master Stylist", price: 1500 },
      { name: "Medifacial Brightening Treatment", price: 4200 }
    ],
    totalPrice: 5700,
    bookingDate: "2026-06-18",
    bookingTime: "11:30 AM",
    status: "Confirmed",
    canReview: false
  },
  {
    id: "bkg-2",
    salonId: "m1",
    salonName: "Jean-Claude Biguine Salon & Spa",
    city: "Mumbai",
    customerName: "Aishwarya Rai",
    stylistName: "Marc de Fontaine",
    services: [
      { name: "French Balayage Signature", price: 8500 }
    ],
    totalPrice: 8500,
    bookingDate: "2026-06-15",
    bookingTime: "03:00 PM",
    status: "Completed",
    canReview: true,
    reviewed: false
  },
  {
    id: "bkg-3",
    salonId: "b1",
    salonName: "Bodycraft Salon & Spa",
    city: "Bangalore",
    customerName: "Preeti Sinha",
    stylistName: "Neha Sen",
    services: [
      { name: "Gel Manicure with Chrome Finish", price: 1800 }
    ],
    totalPrice: 1800,
    bookingDate: "2026-06-16",
    bookingTime: "04:30 PM",
    status: "Completed",
    canReview: true,
    reviewed: true,
    reviewRating: 5
  }
];

export const SOCIAL_BOOKINGS = [
  { user: "Ridhi M.", city: "Bangalore", salonName: "Bodycraft Salon", action: "booked a Balinese Massage", time: "2 mins ago" },
  { user: "Karan J.", city: "Delhi", salonName: "Looks Salon", action: "booked a Precision Cut", time: "5 mins ago" },
  { user: "Sneha K.", city: "Mumbai", salonName: "Jean-Claude Biguine", action: "booked a French Balayage", time: "8 mins ago" },
  { user: "Nisha R.", city: "Hyderabad", salonName: "Mirrors Salon", action: "booked a VIP Caviar Spa", time: "12 mins ago" },
  { user: "Priya N.", city: "Chennai", salonName: "Toni & Guy", action: "booked a Bridal Silk Styling", time: "17 mins ago" },
  { user: "Aditya P.", city: "Pune", salonName: "H2O Hair", action: "booked a Fades Texture Cut", time: "22 mins ago" }
];
