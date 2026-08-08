# Trip One - 첫 해외여행객을 위한 AI 맞춤형 통합 여행 플랫폼

여행 초보자가 여러 앱을 오가지 않고도 여행 준비를 끝낼 수 있도록 돕는 통합 웹 플랫폼입니다.
핵심은 사용자 여행 프로필과 항공권 이미지 OCR 결과를 결합해, 실제 현지 체류 가능 시간에 맞춘 현실적인 일정/쇼핑/의사소통 지원을 제공하는 것입니다.

## 🌟 핵심 기능

- ✈️ **항공권 OCR**: 이미지만으로 자동 정보 추출
- 📅 **AI 맞춤 일정**: 항공편 시간을 반영한 현실적인 일정
- 💳 **스마트 쇼핑**: 예산 기반 추천과 실시간 환율
- 🗣️ **Travel Helper**: 회화, 번역, 문화 가이드

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 1. 프론트엔드 설치 및 실행

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 2. 백엔드 설치 및 실행

```bash
cd backend
npm install
npm run dev
```

API 서버는 `http://localhost:3000` 에서 실행됨

## 📁 프로젝트 구조

```
Trip-One/
├── frontend/           # React + TypeScript + Tailwind UI
│   ├── src/
│   │   ├── components/ # UI 컴포넌트
│   │   ├── pages/      # 페이지
│   │   ├── types/      # TypeScript 타입
│   │   ├── hooks/      # API 훅
│   │   └── App.tsx     # 메인 앱
│   └── package.json
│
├── backend/            # Node.js + Express API
│   ├── src/
│   │   ├── routes/     # API 라우트
│   │   ├── controllers/# 비즈니스 로직
│   │   ├── services/   # 도메인 서비스
│   │   ├── types.ts    # 타입 정의
│   │   └── app.ts      # Express 메인
│   └── package.json
│
├── prd.md      # 제품 기획 문서
├── agent.md    # 개발 에이전트 지침
└── README.md   # 이 파일
```

## 🎯 개발 단계 (MVP)

1. ✅ 프로필 입력 화면
2. ✅ 항공권 OCR + 검수
3. 🔄 일정 생성 엔진
4. 🔄 여행 플래너 UI
5. 🔄 쇼핑 가이드 + 환율
6. 🔄 Travel Helper

## 📝 API 엔드포인트

### 프로필 관리
- `POST /api/trips` - 여행 프로필 생성
- `GET /api/trips/:tripId` - 프로필 조회

### 항공편
- `POST /api/trips/:tripId/flight-ocr` - 항공권 OCR 처리
- `PUT /api/trips/:tripId/flight-info` - 항공편 정보 저장

### 일정
- `POST /api/trips/:tripId/plan/generate` - 일정 생성
- `GET /api/trips/:tripId/plan` - 일정 조회

## 📚 문서

- [PRD (제품 기획서)](./prd.md) - 요구사항, 기능 명세, 데이터 모델
- [Agent Guide (개발 지침)](./agent.md) - 바이브 코딩 운영 원칙, 역할 정의

---

**Made with ❤️ by Trip One Team** 
