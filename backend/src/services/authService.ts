import * as crypto from 'crypto';
import { User, SignUpRequest, SignInRequest, AuthResponse } from '../types.js';

// 간단한 비밀번호 해싱 (실제 프로덕션에서는 bcrypt 권장)
const hashPassword = (password: string): string => {
  return crypto
    .createHash('sha256')
    .update(password + 'salt_trip_one')
    .digest('hex');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// 간단한 JWT 토큰 생성 (실제는 jsonwebtoken 라이브러리 권장)
const generateToken = (userId: string): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7일
    })
  ).toString('base64');
  
  const signature = crypto
    .createHmac('sha256', 'secret_key_trip_one')
    .update(`${header}.${payload}`)
    .digest('base64');
  
  return `${header}.${payload}.${signature}`;
};

// Mock 사용자 저장소
const users = new Map<string, User>();

export const authService = {
  // 회원가입
  signUp: async (req: SignUpRequest): Promise<AuthResponse> => {
    // 이메일 중복 확인
    const existingUser = Array.from(users.values()).find(
      (u) => u.email === req.email
    );
    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다');
    }

    // 새 사용자 생성
    const now = new Date().toISOString();
    const userId = `user_${Date.now()}`;
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

    console.log(`✅ 회원가입 성공: ${req.email}`);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  },

  // 로그인
  signIn: async (req: SignInRequest): Promise<AuthResponse> => {
    const user = Array.from(users.values()).find(
      (u) => u.email === req.email
    );

    if (!user) {
      throw new Error('이메일 또는 비밀번호가 잘못되었습니다');
    }

    if (!verifyPassword(req.password, user.password)) {
      throw new Error('이메일 또는 비밀번호가 잘못되었습니다');
    }

    const token = generateToken(user.id);

    console.log(`✅ 로그인 성공: ${req.email}`);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  },

  // 토큰으로 사용자 조회
  getUserFromToken: (token: string): User | null => {
    try {
      // 간단한 토큰 검증 (실제는 jsonwebtoken 라이브러리 사용)
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString('utf-8')
      );

      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null; // 토큰 만료
      }

      const user = users.get(payload.sub);
      return user || null;
    } catch {
      return null;
    }
  },
};
