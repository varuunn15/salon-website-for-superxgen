import prisma from '../config/database.js';

// @desc    Fetch all salons
// @route   GET /api/salons
// @access  Public
export const getSalons = async (req, res) => {
  try {
    const { city, category, search, size } = req.query;
    const limit = size ? parseInt(size) : 2200;

    const whereClause = {};
    if (city) {
      whereClause.city = { contains: city, mode: 'insensitive' };
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'all') {
      whereClause.services = {
        some: {
          category: category
        }
      };
    }

    const salons = await prisma.salon.findMany({
      where: whereClause,
      take: limit,
      include: {
        stylists: true,
        services: true,
        reviews: true,
      }
    });

    res.json(salons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get salon by ID
// @route   GET /api/salons/:id
// @access  Public
export const getSalonById = async (req, res) => {
  try {
    const salon = await prisma.salon.findUnique({
      where: { id: req.params.id },
      include: {
        stylists: true,
        services: true,
        reviews: true,
      }
    });

    if (salon) {
      res.json(salon);
    } else {
      res.status(404).json({ message: 'Salon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync/Seed salons
// @route   POST /api/salons/sync
// @access  Private/Admin
export const syncSalons = async (req, res) => {
  try {
    const { salons } = req.body;
    
    // In a real application, this might update or insert
    // This is just a basic implementation to prevent errors
    // Since mockData has IDs, we can use upsert or just ignore
    
    res.json({ message: 'Salons sync recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
