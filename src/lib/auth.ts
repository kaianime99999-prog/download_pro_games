import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-admin-key-2024-fawy-maly-pro-games';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'fawy_admin_2024';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXs/GjLVlzHm'; // "FawyMaly@2024!"

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  // تحقق مباشر للتطوير
  return username === 'fawy_admin_2024' && password === 'FawyMaly@2024!';
}

export function generateAdminToken(username: string): string {
  return jwt.sign(
    { 
      username, 
      role: 'admin',
      timestamp: Date.now(),
      ip: 'protected'
    },
    JWT_SECRET,
    { 
      expiresIn: '1h',
      issuer: 'download-pro-admin',
      audience: 'admin-panel'
    }
  );
}

export function verifyAdminToken(token: string): { valid: boolean; username?: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Record<string, any>;
    
    if (decoded.role !== 'admin' || decoded.username !== ADMIN_USERNAME) {
      return { valid: false };
    }
    
    return { valid: true, username: decoded.username };
  } catch (error) {
    return { valid: false };
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}