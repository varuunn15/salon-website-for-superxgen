import prisma from '../config/database.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { salonId, stylistId, services, totalPrice, bookingDate, bookingTime } = req.body;

    if (!services || services.length === 0) {
      return res.status(400).json({ message: 'No services provided' });
    }

    const booking = await prisma.$transaction(async (tx) => {
      // Create the booking
      const newBooking = await tx.booking.create({
        data: {
          userId: req.user.id,
          salonId,
          stylistId,
          totalPrice,
          bookingDate,
          bookingTime,
          status: 'Confirmed',
          canReview: false,
        }
      });

      // Create booking items
      const bookingServicesData = services.map(service => ({
        bookingId: newBooking.id,
        serviceId: service.id,
        price: service.price,
      }));

      await tx.bookingService.createMany({
        data: bookingServicesData
      });

      return newBooking;
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        salon: true,
        stylist: true,
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Format response to match frontend expectations
    const formattedBookings = bookings.map(b => ({
      id: b.id,
      salonId: b.salonId,
      salonName: b.salon.name,
      city: b.salon.city,
      customerName: req.user.name,
      userEmail: req.user.email,
      stylistName: b.stylist ? b.stylist.name : null,
      services: b.services.map(bs => ({
        name: bs.service.name,
        price: bs.price
      })),
      totalPrice: b.totalPrice,
      bookingDate: b.bookingDate,
      bookingTime: b.bookingTime,
      status: b.status,
      canReview: b.canReview,
      reviewed: b.reviewed,
      reviewRating: b.reviewRating
    }));

    res.json(formattedBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id
// @access  Private
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'partner') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { 
        status,
        canReview: status === 'Completed'
      }
    });

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
