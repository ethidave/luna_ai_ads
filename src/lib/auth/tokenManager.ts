import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  image?: string;
  iat: number;
  exp: number;
  jti: string;
}

export class TokenManager {
  private static readonly SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';
  private static readonly EXPIRES_IN = '7d';

  /**
   * Generate a new JWT token
   */
  static generateToken(payload: Omit<TokenPayload, 'iat' | 'exp' | 'jti'>): string {
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload: Omit<TokenPayload, 'exp'> = {
      ...payload,
      iat: now,
      jti: `${payload.id}-${now}`, // Unique token ID
    };

    return jwt.sign(tokenPayload, this.SECRET, {
      expiresIn: this.EXPIRES_IN,
      issuer: 'luna-ai',
      audience: 'luna-ai-users',
    });
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.SECRET, {
        issuer: 'luna-ai',
        audience: 'luna-ai-users',
      }) as TokenPayload;

      // Additional expiration check
      if (Date.now() >= decoded.exp * 1000) {
        return null;
      }

      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as TokenPayload;
      if (!decoded || !decoded.exp) return true;
      
      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      return true;
    }
  }

  /**
   * Extract token from request headers
   */
  static extractTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  /**
   * Get token expiration time in milliseconds
   */
  static getTokenExpirationTime(token: string): number | null {
    try {
      const decoded = jwt.decode(token) as TokenPayload;
      return decoded?.exp ? decoded.exp * 1000 : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get time until token expires in milliseconds
   */
  static getTimeUntilExpiration(token: string): number | null {
    const expirationTime = this.getTokenExpirationTime(token);
    if (!expirationTime) return null;
    
    const timeUntilExpiration = expirationTime - Date.now();
    return timeUntilExpiration > 0 ? timeUntilExpiration : 0;
  }

  /**
   * Check if token needs refresh (expires in less than 24 hours)
   */
  static needsRefresh(token: string): boolean {
    const timeUntilExpiration = this.getTimeUntilExpiration(token);
    if (!timeUntilExpiration) return true;
    
    // Refresh if expires in less than 24 hours
    return timeUntilExpiration < (24 * 60 * 60 * 1000);
  }

  /**
   * Create a refresh token (longer lived)
   */
  static generateRefreshToken(userId: string): string {
    const payload = {
      userId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, this.SECRET, {
      expiresIn: '30d',
      issuer: 'luna-ai',
      audience: 'luna-ai-refresh',
    });
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.SECRET, {
        issuer: 'luna-ai',
        audience: 'luna-ai-refresh',
      }) as any;

      if (decoded.type !== 'refresh') {
        return null;
      }

      return { userId: decoded.userId };
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }
}
