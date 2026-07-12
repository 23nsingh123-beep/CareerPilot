const requestCounts = new Map();

// Simplistic in-memory rate limiter for MVP
exports.chatRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // max 10 requests per minute

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  const rateData = requestCounts.get(ip);
  if (now > rateData.resetTime) {
    // Reset
    rateData.count = 1;
    rateData.resetTime = now + windowMs;
    return next();
  }

  rateData.count += 1;
  if (rateData.count > maxRequests) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  next();
};
