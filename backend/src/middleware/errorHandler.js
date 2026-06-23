export const errorHandler = (err, req, res, next) => {
  console.error('[Error]:', err.message);

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A record with that value already exists.'
    });
  }
  
  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Record not found in the database.'
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
