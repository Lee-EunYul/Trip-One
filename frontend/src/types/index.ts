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
