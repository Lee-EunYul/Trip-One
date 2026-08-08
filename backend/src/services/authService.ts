import * as crypto from 'crypto';
import { SignUpRequest, SignInRequest, AuthResponse, User } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

// 임시: 메모리 저장소 (MongoDB 설정 후 대체)
const users = new Map<string, User>();

const hashPassword = (password: string): string => {
  return crypto
    .createHash('sha256')
    .update(password + 'salt_trip_one')
    .digest('hex');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

const generateToken = (userId: string): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    })
  ).toString('base64');
  
  const signature = crypto
    .createHmac('sha256', 'secret_key_trip_one')
    .update(`${header}.${payload}`)
    .digest('base64');
  
  return `${header}.${payload}.${signature}`;
};

export const authService = {
  signUp: (req: SignUpRequest): AuthResponse => {
    try {
      const existingUser = Array.from(users.values()).find(u => u.email === req.email);
      if (existingUser) {
        throw new Error('이미 존재하는 이메일입니다');
      }

      const userId = uuidv4();
      const now = new Date().toISOString();
      const user: User = {
        id: userId,
        email: req.email,
        password: hashPassword(req.password),
        name: req.name,
        createdAt: now,
        updatedAt: now,
      };

      users.set(userId, user);
      const token = generateToken(userId);

      console.log(`✅ 회원가입: ${req.email}`);

      return {
        token,
        user: {
          id: userId,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      console.error('회원가입 오류:', error);
      throw error;
    }
  },

  signIn: (req: SignInRequest): AuthResponse => {
    try {
      const user = Array.from(users.values()).find(u => u.email === req.email);

      if (!user) {
        throw new Error('이메일 또는 비밀번호가 잘못되었습니다');
      }

      if (!verifyPassword(req.password, user.password)) {
        throw new Error('이메일 또는 비밀번호가 잘못되었습니다');
      }

      const token = generateToken(user.id);

      console.log(`✅ 로그인: ${req.email}`);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    }
  },

  getUserFromToken: (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString('utf-8')
      );

      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      const user = users.get(payload.sub);
      return user || null;
    } catch (error) {
      console.error('토큰 오류:', error);
      return null;
    }
  },
};
