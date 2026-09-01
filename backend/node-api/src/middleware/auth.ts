import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Missing token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token.' });
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized. User context missing.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};

export const parentReadOnlyGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === 'PARENT') {
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    // Allow parent support request / link endpoints, block direct student project/task editing
    if (isMutation && !req.path.includes('/parent/') && !req.path.includes('/support')) {
      return res.status(403).json({
        success: false,
        message: 'Parent Read-Only Policy: Parents are not permitted to modify student projects, tasks, or quiz data.',
      });
    }
  }
  next();
};
