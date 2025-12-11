import { verifyAccessToken, verifyRefreshToken } from '../utils/generateToken.js';

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

export const authenticateAccessToken = (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Access token missing' });
    }
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
};

export const authenticateRefreshToken = (req, res, next) => {
  try {
    const token =
      req.body?.refreshToken ||
      req.headers['x-refresh-token'] ||
      req.query?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    const decoded = verifyRefreshToken(token);
    req.userId = decoded.userId;
    req.refreshToken = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

