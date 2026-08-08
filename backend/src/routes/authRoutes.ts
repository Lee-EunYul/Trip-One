import express, { Router } from 'express';
import { authController } from '../controllers/authController.js';

const router: Router = express.Router();

// 회원가입: POST /api/auth/signup
router.post('/signup', authController.signUp);

// 로그인: POST /api/auth/signin
router.post('/signin', authController.signIn);

// 현재 사용자 조회: GET /api/auth/me
router.get('/me', authController.getCurrentUser);

export default router;
