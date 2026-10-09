import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SupabaseClient, User } from '@supabase/supabase-js';

export interface AdminPayload {
  role: 'admin';
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminPayload;
  user?: User;
}

/**
 * Middleware to require a valid Admin JWT token in the Authorization header.
 * Header format: Bearer <token>
 */
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('[Auth Middleware] JWT_SECRET is not configured on the server.');
    res.status(500).json({ error: 'Server authentication configuration error.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as AdminPayload;
    if (decoded.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: Admin privileges required.' });
      return;
    }
    req.admin = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Unauthorized: Session expired. Please log in again.' });
      return;
    }
    res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    return;
  }
};

/**
 * Factory middleware to require a valid Supabase customer user session.
 * Header format: Bearer <supabase_access_token>
 */
export const createRequireUser = (supabase: SupabaseClient | null) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!supabase) {
      res.status(503).json({ error: 'Supabase client is not configured on backend.' });
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header.' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        res.status(401).json({ error: 'Unauthorized: Invalid user session.' });
        return;
      }

      req.user = data.user;
      next();
    } catch (err: any) {
      console.error('[User Auth Middleware] Error validating token:', err);
      res.status(401).json({ error: 'Unauthorized: Authentication failed.' });
      return;
    }
  };
};
