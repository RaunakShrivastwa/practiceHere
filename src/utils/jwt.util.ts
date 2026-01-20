import jwt, { SignOptions } from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d';

if (!ACCESS_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET is missing');
}

if (!REFRESH_SECRET) {
  throw new Error('REFRESH_TOKEN_SECRET is missing');
}


export const generateAccessToken = <T extends object>(payload: T, options?: SignOptions): string => {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES, ...options });
};

export const generateRefreshToken = <T extends object>(payload: T, options?: SignOptions): string => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES, ...options });
};

export const verifyAccessToken = <T>(token: string): T => {
    return jwt.verify(token, ACCESS_SECRET) as T;
};

export const verifyRefreshToken = <T>(token: string): T => {
    return jwt.verify(token, REFRESH_SECRET) as T;
};
