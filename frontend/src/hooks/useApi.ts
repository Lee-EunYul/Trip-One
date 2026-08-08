import { TravelProfile, FlightInfo } from '../types/index';

// Mock API 서비스
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const tripApi = {
  // 여행 프로필 생성
  createProfile: async (profile: TravelProfile) => {
    try {
      const response = await fetch(`${API_BASE}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      return await response.json();
    } catch (error) {
      console.error('프로필 생성 실패:', error);
      throw error;
    }
  },

  // 항공권 OCR
  uploadFlightImage: async (tripId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/trips/${tripId}/flight-ocr`, {
        method: 'POST',
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error('항공권 OCR 실패:', error);
      throw error;
    }
  },

  // 항공편 정보 저장
  updateFlightInfo: async (tripId: string, flightInfo: FlightInfo) => {
    try {
      const response = await fetch(`${API_BASE}/trips/${tripId}/flight-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flightInfo),
      });
      return await response.json();
    } catch (error) {
      console.error('항공편 정보 저장 실패:', error);
      throw error;
    }
  },

  // 일정 생성
  generateItinerary: async (tripId: string) => {
    try {
      const response = await fetch(`${API_BASE}/trips/${tripId}/plan/generate`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('일정 생성 실패:', error);
      throw error;
    }
  },
};
