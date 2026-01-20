import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    (req as any).user = decoded;

    console.log(`\n\n\nDecode - `, decoded, `\n\n`);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
