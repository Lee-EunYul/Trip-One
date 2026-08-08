import { Router } from 'express';
import { TravelHelperController } from '../controllers/travelHelperController';

const router = Router();

// 도시별 모든 구문 조회
// GET /api/travel-helper/:city/phrases
router.get('/:city/phrases', TravelHelperController.getPhrases);

// 카테고리별 구문 조회
// GET /api/travel-helper/:city/category/:category
router.get('/:city/category/:category', TravelHelperController.getPhrasesByCategory);

// 구문 검색
// GET /api/travel-helper/search?city=Tokyo&keyword=hello
router.get('/search', TravelHelperController.searchPhrases);

// 카테고리 목록 조회
// GET /api/travel-helper/categories
router.get('/categories', TravelHelperController.getCategories);

// 도시별 현지 언어 조회
// GET /api/travel-helper/:city/language
router.get('/:city/language', TravelHelperController.getLocalLanguage);

// 발음 정보 조회
// GET /api/travel-helper/pronunciation?city=Tokyo&phraseId=greet_1
router.get(
  '/pronunciation',
  TravelHelperController.getPronunciation
);

export default router;
