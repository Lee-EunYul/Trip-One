import { Request, Response } from 'express';
import { travelHelperService } from '../services/travelHelperService';
import { ApiResponse } from '../types';

export class TravelHelperController {
  // 도시별 모든 회화 구문 조회
  static async getPhrases(req: Request, res: Response): Promise<void> {
    try {
      const { city } = req.params;

      if (!city) {
        res.status(400).json({
          success: false,
          error: '도시 정보가 필요합니다.',
          statusCode: 400,
        });
        return;
      }

      const phrases = travelHelperService.getPhrasesByCity(city);

      if (phrases.length === 0) {
        res.status(404).json({
          success: false,
          error: `${city}에 대한 구문 데이터가 없습니다.`,
          statusCode: 404,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: phrases,
        statusCode: 200,
      });
    } catch (error) {
      console.error('구문 조회 중 오류:', error);
      res.status(500).json({
        success: false,
        error: '구문 조회 실패',
        statusCode: 500,
      });
    }
  }

  // 카테고리별 구문 조회
  static async getPhrasesByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { city, category } = req.params;

      if (!city || !category) {
        res.status(400).json({
          success: false,
          error: '도시와 카테고리 정보가 필요합니다.',
          statusCode: 400,
        });
        return;
      }

      const phrases = travelHelperService.getPhrasesByCategory(city, category);

      res.status(200).json({
        success: true,
        data: phrases,
        statusCode: 200,
      });
    } catch (error) {
      console.error('카테고리별 구문 조회 중 오류:', error);
      res.status(500).json({
        success: false,
        error: '카테고리별 구문 조회 실패',
        statusCode: 500,
      });
    }
  }

  // 구문 검색
  static async searchPhrases(req: Request, res: Response): Promise<void> {
    try {
      const { city, keyword } = req.query;

      if (!city || !keyword) {
        res.status(400).json({
          success: false,
          error: '도시와 검색어가 필요합니다.',
          statusCode: 400,
        });
        return;
      }

      const phrases = travelHelperService.searchPhrases(
        city as string,
        keyword as string
      );

      res.status(200).json({
        success: true,
        data: phrases,
        statusCode: 200,
      });
    } catch (error) {
      console.error('구문 검색 중 오류:', error);
      res.status(500).json({
        success: false,
        error: '구문 검색 실패',
        statusCode: 500,
      });
    }
  }

  // 카테고리 목록 조회
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = travelHelperService.getCategories();

      res.status(200).json({
        success: true,
        data: categories,
        statusCode: 200,
      });
    } catch (error) {
      console.error('카테고리 목록 조회 중 오류:', error);
      res.status(500).json({
        success: false,
        error: '카테고리 목록 조회 실패',
        statusCode: 500,
      });
    }
  }

  // 도시별 현지 언어 정보 조회
  static async getLocalLanguage(req: Request, res: Response): Promise<void> {
    try {
      const { city } = req.params;

      if (!city) {
        res.status(400).json({
          success: false,
          error: '도시 정보가 필요합니다.',
          statusCode: 400,
        });
        return;
      }

      const language = travelHelperService.getLocalLanguage(city);

      res.status(200).json({
        success: true,
        data: { language },
        statusCode: 200,
      });
    } catch (error) {
      console.error('현지 언어 조회 중 오류:', error);
      res.status(500).json({
        success: false,
        error: '현지 언어 조회 실패',
        statusCode: 500,
      });
    }
  }

  // 발음 정보 조회
  static async getPronunciation(req: Request, res: Response): Promise<void> {
    try {
      const { city, phraseId } = req.query;

      if (!city || !phraseId) {
        res.status(400).json({
          success: false,
          error: '도시와 구문 ID가 필요합니다.',
          statusCode: 400,
        });
        return;
      }

      const pronunciation = travelHelperService.getPhrasePronunciation(
        city as string,
        phraseId as string
      );

      if (!pronunciation) {
        res.status(404).json({
          success: false,
          error: '구문을 찾을 수 없습니다.',
          statusCode: 404,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: pronunciation,
        statusCode: 200,
      });
    } catch (error) {
      console.error('발음 정보 조회 중 오류:', error);
      res.status(500).json({
        success: false,
        error: '발음 정보 조회 실패',
        statusCode: 500,
      });
    }
  }
}
