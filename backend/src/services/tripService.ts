import { v4 as uuidv4 } from 'uuid';
import { TravelProfile, FlightInfo } from '../types.js';

// Mock 데이터 저장소 (실제로는 DB 사용)
export const tripProfiles = new Map<string, TravelProfile>();
export const flightInfos = new Map<string, FlightInfo>();

export const tripService = {
  // 여행 프로필 생성
  createProfile: (data: Omit<TravelProfile, 'id' | 'createdAt' | 'updatedAt'>): TravelProfile => {
    const now = new Date().toISOString();
    const profile: TravelProfile = {
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    tripProfiles.set(profile.id, profile);
    console.log(`✅ 프로필 생성: ${profile.id}`);
    return profile;
  },

  // 프로필 조회
  getProfile: (id: string): TravelProfile | null => {
    return tripProfiles.get(id) || null;
  },

  // 항공편 정보 저장
  saveFlightInfo: (
    tripId: string,
    data: Omit<FlightInfo, 'id' | 'tripProfileId' | 'createdAt' | 'updatedAt'>
  ): FlightInfo => {
    const now = new Date().toISOString();
    const flight: FlightInfo = {
      id: uuidv4(),
      tripProfileId: tripId,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    flightInfos.set(tripId, flight);
    console.log(`✅ 항공편 정보 저장: ${tripId}`);
    return flight;
  },

  // 항공편 정보 조회
  getFlightInfo: (tripId: string): FlightInfo | null => {
    return flightInfos.get(tripId) || null;
  },

  // Mock OCR 처리
  processOcrImage: async (
    file: Express.Multer.File
  ): Promise<{
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    outboundDateTime: string;
    inboundDateTime: string;
    terminal: string;
    confidence: number;
  }> => {
    // 실제로는 Google Vision API 또는 Azure Document Intelligence 사용
    console.log(`📸 OCR 처리 중: ${file.originalname}`);

    // Mock 결과 (2초 후)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          flightNumber: 'JL 12',
          departureAirport: 'San Francisco (SFO)',
          arrivalAirport: 'Haneda Intl (HND)',
          outboundDateTime: '2024-10-22 12:45 PM',
          inboundDateTime: '2024-10-26 02:30 PM',
          terminal: 'Terminal 3',
          confidence: 0.95,
        });
      }, 2000);
    });
  },

  // 일정 생성 (규칙 기반)
  generateItinerary: (tripId: string) => {
    const profile = tripProfiles.get(tripId);
    const flight = flightInfos.get(tripId);

    if (!profile || !flight) {
      throw new Error('프로필 또는 항공편 정보가 없습니다.');
    }

    // Mock 일정 생성
    console.log(`📅 일정 생성: ${tripId}`);
    return {
      tripId,
      days: [
        {
          day: 1,
          title: `도착 & ${profile.city}`,
          activities: [
            { time: '18:00', activity: '공항 도착' },
            { time: '19:00', activity: '숙소 체크인' },
            { time: '20:00', activity: '저녁 식사 & 야경 명소' },
          ],
        },
        {
          day: 2,
          title: `${profile.city} 핵심 관광`,
          activities: [
            { time: '09:00', activity: '관광지 1' },
            { time: '12:00', activity: '점심' },
            { time: '14:00', activity: '관광지 2' },
          ],
        },
      ],
      totalBudget: profile.budget,
      estimatedSpend: Math.round(profile.budget * 0.8),
    };
  },
};
