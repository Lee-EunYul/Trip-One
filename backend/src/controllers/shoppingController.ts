import { Request, Response } from 'express';
import { shoppingService } from '../services/shoppingService.js';
import { tripService } from '../services/tripService.js';

export const shoppingController = {
  // 여행지 기반 추천 상품 조회
  getRecommendations: async (req: Request, res: Response) => {
    try {
      const { tripId } = req.params;

      // Trip 정보 조회
      const profile = tripService.getTravelProfile(tripId);
      if (!profile) {
        return res.status(404).json({
          code: 'NOT_FOUND',
          message: 'Trip profile not found',
        });
      }

      // 쇼핑 추천 생성
      const recommendations = await shoppingService.getRecommendations(
        tripId,
        profile.city,
        profile.budget,
        profile.styles
      );

      return res.status(200).json({
        code: 'SUCCESS',
        data: recommendations,
      });
    } catch (error) {
      console.error('쇼핑 추천 조회 실패:', error);
      return res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: (error as Error).message,
      });
    }
  },

  // 환율 조회
  getExchangeRate: async (req: Request, res: Response) => {
    try {
      const { currency } = req.query;

      if (!currency || typeof currency !== 'string') {
        return res.status(400).json({
          code: 'INVALID_REQUEST',
          message: 'Currency is required',
        });
      }

      const rate = await shoppingService.getExchangeRates(
        currency.toUpperCase()
      );

      return res.status(200).json({
        code: 'SUCCESS',
        data: rate,
      });
    } catch (error) {
      console.error('환율 조회 실패:', error);
      return res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: (error as Error).message,
      });
    }
  },

  // 가격 변환
  convertPrice: async (req: Request, res: Response) => {
    try {
      const { amount, currency } = req.body;

      if (!amount || !currency) {
        return res.status(400).json({
          code: 'INVALID_REQUEST',
          message: 'Amount and currency are required',
        });
      }

      const krwAmount = await shoppingService.convertToKRW(amount, currency);

      return res.status(200).json({
        code: 'SUCCESS',
        data: {
          originalAmount: amount,
          originalCurrency: currency,
          krwAmount,
        },
      });
    } catch (error) {
      console.error('가격 변환 실패:', error);
      return res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: (error as Error).message,
      });
    }
  },
};
