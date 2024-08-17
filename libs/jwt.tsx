import jwt from 'jsonwebtoken';
import {jwtDecode} from 'jwt-decode';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

interface JwtPayload {
  sub: string; 
}

export const generateToken = (userId: string): string => {
  const payload = { sub: userId };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};