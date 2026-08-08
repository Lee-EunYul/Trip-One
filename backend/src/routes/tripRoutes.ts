import { Router } from 'express';
import { tripController } from '../controllers/tripController.js';

const router = Router();

// 여행 프로필 생성
router.post('/trips', tripController.createProfile);

// 항공권 OCR 업로드
router.post('/trips/:tripId/flight-ocr', tripController.uploadFlightImage);

// 항공편 정보 저장
router.put('/trips/:tripId/flight-info', tripController.updateFlightInfo);

// 일정 생성
router.post('/trips/:tripId/plan/generate', tripController.generateItinerary);

// 일정 조회
router.get('/trips/:tripId/plan', tripController.getItinerary);

export default router;
