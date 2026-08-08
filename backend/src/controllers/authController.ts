import { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { SignUpRequest, SignInRequest, ApiResponse, AuthResponse } from '../types.js';

export const authController = {
  // 회원가입
  signUp: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body as SignUpRequest;

      // 유효성 검사
      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          error: '이메일, 비밀번호, 이름은 필수입니다',
          statusCode: 400,
        } as ApiResponse<null>);
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          error: '비밀번호는 최소 6자 이상이어야 합니다',
          statusCode: 400,
        } as ApiResponse<null>);
        return;
      }

      const response = await authService.signUp({
        email,
        password,
        name,
      });

      res.status(201).json({
        success: true,
        data: response,
        statusCode: 201,
      } as ApiResponse<AuthResponse>);
    } catch (error) {
      const message = error instanceof Error ? error.message : '회원가입 실패';
      res.status(400).json({
        success: false,
        error: message,
        statusCode: 400,
      } as ApiResponse<null>);
    }
  },

  // 로그인
  signIn: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body as SignInRequest;

      // 유효성 검사
      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: '이메일과 비밀번호는 필수입니다',
          statusCode: 400,
        } as ApiResponse<null>);
        return;
      }

      const response = await authService.signIn({
        email,
        password,
      });

      res.status(200).json({
        success: true,
        data: response,
        statusCode: 200,
      } as ApiResponse<AuthResponse>);
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그인 실패';
      res.status(401).json({
        success: false,
        error: message,
        statusCode: 401,
      } as ApiResponse<null>);
    }
  },

  // 현재 사용자 조회 (토큰 검증)
  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(401).json({
          success: false,
          error: '토큰이 없습니다',
          statusCode: 401,
        } as ApiResponse<null>);
        return;
      }

      const user = authService.getUserFromToken(token);

      if (!user) {
        res.status(401).json({
          success: false,
          error: '유효하지 않은 토큰입니다',
          statusCode: 401,
        } as ApiResponse<null>);
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        statusCode: 200,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '사용자 조회 실패';
      res.status(500).json({
        success: false,
        error: message,
        statusCode: 500,
      } as ApiResponse<null>);
    }
  },
};
