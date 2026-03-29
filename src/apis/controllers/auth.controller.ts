import { verifyRefreshToken, generateAccessToken } from '../../utils/jwt.util';
import { AccessTokenPayload, RefreshTokenPayload } from '../../types/auth.types';

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
    }

    try {
        const decoded = verifyRefreshToken<RefreshTokenPayload>(refreshToken);

        const newAccessToken = generateAccessToken<AccessTokenPayload>({
            userId: decoded.userId,
            role: 'student' // or fetch role from DB if needed
        });

        return res.json({ "accessToken": newAccessToken });
    } catch (error) {
        return res.status(403).json(error);
    }
};
