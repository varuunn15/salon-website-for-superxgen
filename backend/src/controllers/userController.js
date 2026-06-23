import prisma from '../config/database.js';

// @desc    Update user favorites
// @route   POST /api/users/favorites
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const { salonId } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let updatedFavorites = [...user.favorites];
    
    if (updatedFavorites.includes(salonId)) {
      updatedFavorites = updatedFavorites.filter(id => id !== salonId);
    } else {
      updatedFavorites.push(salonId);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { favorites: updatedFavorites },
      select: { favorites: true }
    });

    res.json(updatedUser.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { favorites: true }
    });

    res.json(user?.favorites || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save diagnostics
// @route   PUT /api/users/diagnostics
// @access  Private
export const saveDiagnostics = async (req, res) => {
  try {
    const { diagnostics } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { diagnostics },
      select: { diagnostics: true }
    });

    res.json(updatedUser.diagnostics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
