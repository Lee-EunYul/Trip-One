# 로컬 개발 시작 가이드 (5분)

이 가이드를 따르면 5분 내에 Trip One을 로컬에서 실행할 수 있습니다.

## 1️⃣ 프런트엔드 시작 (2분)

```bash
# 1. 프런트엔드 폴더로 이동
cd frontend

# 2. 의존성 설치
npm install

# 3. 개발 서버 시작
npm run dev
```

**결과**: 브라우저 자동 열림 → `http://localhost:5173`

### 현재 동작하는 화면
- ✅ Step 1: 여행 프로필 입력 (국가, 도시, 날짜, 예산, 스타일)
- ✅ Step 2: 항공권 OCR (이미지 업로드 → Mock 데이터)
- ✅ Step 3: 정보 확인 및 일정 생성 버튼

### 테스트 플로우
1. 프로필 정보 입력 (모두 채워도 되고 기본값 사용 가능)
2. "다음: 항공권 등록" 클릭
3. "파일 선택" 클릭 (아무 이미지 선택 가능, 2초 후 Mock 결과 표시)
4. "정보 확인 및 저장" 클릭
5. 최종 확인 화면에서 "AI 일정 생성하기" 클릭

---

## 2️⃣ 백엔드 시작 (2분)

```bash
# 1. 백엔드 폴더로 이동 (새 터미널)
cd backend

# 2. 의존성 설치
npm install

# 3. 개발 서버 시작
npm run dev
```

**결과**: 
```
✅ Trip One API Server running on http://localhost:3000
```

### 현재 동작하는 API
- `POST /api/trips` - 프로필 생성
- `POST /api/trips/{tripId}/flight-ocr` - OCR Mock
- `PUT /api/trips/{tripId}/flight-info` - 항공편 정보 저장
- `POST /api/trips/{tripId}/plan/generate` - 일정 생성 Mock

### cURL로 테스트
```bash
# 프로필 생성
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "country": "Japan",
    "city": "Tokyo",
    "startDate": "2024-10-22",
    "endDate": "2024-10-26",
    "budget": 3500,
    "styles": ["Shopping", "Food"],
    "companionType": "Friend",
    "isFirstTrip": true
  }'
```

---

## 3️⃣ 통합 테스트 (1분)

프런트엔드와 백엔드가 모두 실행 중일 때:

1. 프런트엔드에서 프로필 입력
2. "다음: 항공권 등록" 클릭
3. 파일 업로드 (백엔드의 `/api/trips/{tripId}/flight-ocr` 호출 → 2초 로딩)
4. "정보 확인 및 저장" 클릭 (백엔드의 `/api/trips/{tripId}/flight-info` 호출)
5. 최종 화면에서 "AI 일정 생성하기" (백엔드의 `/api/trips/{tripId}/plan/generate` 호출)

✅ 이 플로우가 끝까지 작동하면 전체 통합이 정상입니다.

---

## 🔧 문제 해결

### "포트 3000이 이미 사용 중입니다"
```bash
# 포트 확인
netstat -ano | findstr :3000

# 다른 프로세스가 사용 중이면 백엔드 .env에서 변경
PORT=3001
```

### "npm install 실패"
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### "프런트엔드에서 API 호출이 작동 안 함"
1. 백엔드 서버가 실행 중인지 확인: `http://localhost:3000/health`
2. 프런트엔드의 vite.config.ts에서 proxy 설정 확인

---

## 📁 주요 파일 위치

### 프런트엔드
- 메인 앱: `frontend/src/App.tsx`
- 프로필 폼: `frontend/src/components/TravelProfileForm.tsx`
- 항공권 폼: `frontend/src/components/FlightOcrForm.tsx`
- 타입: `frontend/src/types/index.ts`

### 백엔드
- Express 앱: `backend/src/app.ts`
- API 라우트: `backend/src/routes/tripRoutes.ts`
- 컨트롤러: `backend/src/controllers/tripController.ts`
- 서비스 로직: `backend/src/services/tripService.ts`

---

## 🎯 다음 단계

### 지금 바로 할 수 있는 것
1. 프런트엔드/백엔드 둘 다 실행 확인
2. 전체 플로우 수동 테스트
3. 브라우저 DevTools에서 네트워크 탭 확인

### 다음에 할 일
1. **일정 생성 엔진 고도화** (첫날/마지막날 시간 보정)
2. **여행 플래너 UI 구현** (지도, 타임라인)
3. **API 통합 테스트 자동화**

---

## 💡 팁

### 빠른 개발을 위한 팁
- 프런트엔드 개발 중: `npm run dev` 자동 핫 리로드
- 백엔드 개발 중: `npm run dev` tsx watch로 자동 재시작
- 동시 개발: 2개 터미널 열고 각각 `npm run dev` 실행

### 코드 스타일
- 모든 컴포넌트는 TypeScript 타입 포함
- API 요청은 `useApi.ts`의 `tripApi` 객체 사용
- 에러 처리는 try-catch + 사용자 메시지 표시

### Git 커밋 규칙
```
feat(component): 새 기능
fix(api): 버그 수정
docs(readme): 문서
style(ui): 스타일만
refactor(service): 리팩토링
```

---

**개발을 시작하세요! 🚀**

모든 파일이 준비되었습니다. 이제 위 단계를 따라 프런트엔드와 백엔드를 실행하고, 
전체 플로우가 작동하는 것을 확인하세요.
