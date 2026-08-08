import { Request, Response } from 'express';
import { tripService } from '../services/tripService.js';
import { ApiResponse } from '../types.js';

export const tripController = {
  // POST /api/trips - 프로필 생성
  createProfile: (req: Request, res: Response) => {
    try {
      const { country, city, startDate, endDate, budget, styles, companionType, isFirstTrip } =
        req.body;

      // 검증
      if (!country || !city || !startDate || !endDate || !budget) {
        return res.status(400).json({
          success: false,
          error: '필수 항목이 누락되었습니다.',
          statusCode: 400,
        } as ApiResponse<null>);
      }

      const profile = tripService.createProfile({
        country,
        city,
        startDate,
        endDate,
        budget,
        styles: styles || [],
        companionType: companionType || '',
        isFirstTrip: isFirstTrip || false,
      });

      res.status(201).json({
        success: true,
        data: profile,
        statusCode: 201,
      } as ApiResponse<any>);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        statusCode: 500,
      } as ApiResponse<null>);
    }
  },

  // POST /api/trips/:tripId/flight-ocr - 항공권 OCR
  uploadFlightImage: async (req: Request, res: Response) => {
    try {
      const { tripId } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: '파일이 업로드되지 않았습니다.',
          statusCode: 400,
        } as ApiResponse<null>);
      }

      const ocrResult = await tripService.processOcrImage(req.file);

      res.json({
        success: true,
        data: {
          ...ocrResult,
          message: 'OCR 결과를 확인하고 필요시 수정 후 저장하세요.',
        },
        statusCode: 200,
      } as ApiResponse<any>);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        statusCode: 500,
      } as ApiResponse<null>);
    }
  },

  // PUT /api/trips/:tripId/flight-info - 항공편 정보 저장
  updateFlightInfo: (req: Request, res: Response) => {
    try {
      const { tripId } = req.params;
      const flightData = req.body;

      const flight = tripService.saveFlightInfo(tripId, {
        ...flightData,
        isUserVerified: true,
      });

      res.json({
        success: true,
        data: flight,
        statusCode: 200,
      } as ApiResponse<any>);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        statusCode: 500,
      } as ApiResponse<null>);
    }
  },

  // POST /api/trips/:tripId/plan/generate - 일정 생성
  generateItinerary: (req: Request, res: Response) => {
    try {
      const { tripId } = req.params;

      const itinerary = tripService.generateItinerary(tripId);

      res.json({
        success: true,
        data: itinerary,
        statusCode: 200,
      } as ApiResponse<any>);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
        statusCode: 400,
      } as ApiResponse<null>);
    }
  },

  // GET /api/trips/:tripId/plan - 일정 조회 (아직 미구현)
  getItinerary: (req: Request, res: Response) => {
    res.json({
      success: true,
      data: null,
      message: 'Coming soon',
      statusCode: 200,
    } as ApiResponse<null>);
  },
};
