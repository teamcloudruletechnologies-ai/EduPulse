import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'edtech_super_secret_jwt_key_2026';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'edtech_refresh_secret_key_2026';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  studentId?: string;
  parentId?: string;
  institutionId?: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
};
