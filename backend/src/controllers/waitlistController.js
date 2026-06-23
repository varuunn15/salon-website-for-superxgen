import prisma from '../config/database.js';

// @desc    Join waitlist
// @route   POST /api/waitlist
// @access  Private
export const joinWaitlist = async (req, res) => {
  try {
    const { salonId } = req.body;

    // Check if already waitlisted
    const existingWaitlist = await prisma.waitlist.findFirst({
      where: { 
        userId: req.user.id,
        salonId,
        status: 'Waitlisted'
      }
    });

    if (existingWaitlist) {
      return res.status(400).json({ message: 'You are already on the waitlist for this salon' });
    }

    const waitlist = await prisma.waitlist.create({
      data: {
        userId: req.user.id,
        userEmail: req.user.email,
        salonId,
        status: 'Waitlisted'
      }
    });

    res.status(201).json(waitlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
