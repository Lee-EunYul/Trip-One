// 사용자 타입
export interface User {
  id: string;
  email: string;
  password: string; // 암호화됨
  name: string;
  createdAt: string;
  updatedAt: string;
}

// 회원가입 요청
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

// 로그인 요청
export interface SignInRequest {
  email: string;
  password: string;
}

// 인증 응답 (JWT 토큰 포함)
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// 여행 프로필 타입 (백엔드)
export interface TravelProfile {
  id: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  budget: number;
  styles: string[];
  companionType: string;
  isFirstTrip: boolean;
  createdAt: string;
  updatedAt: string;
}

// 항공편 정보
export interface FlightInfo {
  id: string;
  tripProfileId: string;
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
  isUserVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// API 응답
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}
