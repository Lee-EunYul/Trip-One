// 여행 프로필 타입
export interface TravelProfile {
  id?: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  budget: number;
  styles: string[]; // 액티비티, 힐링, 쇼핑, 먹방, 문화체험, 자연
  companionType: string; // 혼자, 친구, 가족, 연인
  isFirstTrip: boolean;
  createdAt?: string;
}

// 항공권 정보
export interface FlightInfo {
  id?: string;
  tripProfileId?: string;
  departureCountry: string;
  departureAirport: string;
  arrivalCountry: string;
  arrivalAirport: string;
  outboundDateTime: string;
  inboundDateTime: string;
  airline: string;
  flightNumber: string;
  terminal: string;
  ocrConfidence?: number;
  isUserVerified?: boolean;
}

// 일정 항목
export interface ItineraryItem {
  time: string; // HH:MM
  title: string;
  description: string;
  duration: number; // 분
  cost: number; // USD
  reason: string; // 추천 이유
}

// 일일 일정
export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  availableHours: {
    start: string; // HH:MM
    end: string; // HH:MM
  };
  items: ItineraryItem[];
  totalCost: number;
  note: string;
}

// 전체 일정
export interface Itinerary {
  tripId: string;
  days: ItineraryDay[];
  totalCost: number;
  budgetRemaining: number;
  recommendations: string[];
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// OCR 결과
export interface OcrResult {
  confidence: number;
  fields: {
    [key: string]: {
      value: string;
      confidence: number;
    };
  };
}
