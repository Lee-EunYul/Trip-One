import { Router } from 'express';
import { shoppingController } from '../controllers/shoppingController.js';

const router = Router();

// 여행지 기반 추천 상품 조회
router.get('/:tripId/recommendations', shoppingController.getRecommendations);

// 환율 조회
router.get('/exchange-rates', shoppingController.getExchangeRate);

// 가격 변환
router.post('/convert-price', shoppingController.convertPrice);

export default router;
