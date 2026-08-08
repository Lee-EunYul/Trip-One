import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  category: 'Fashion' | 'Electronics' | 'Beauty' | 'Souvenirs' | 'Food';
  localPrice: number; // 현지 통화
  koreanWonEstimate: number; // 한국 원화 예상가
  localCurrency: string; // 'JPY', 'EUR', 'USD' 등
  storeName: string;
  taxFree: boolean;
  description: string;
  reason: string; // 추천 이유
}

export interface ShoppingRecommendation {
  tripId: string;
  city: string;
  budget: number;
  recommendedProducts: Product[];
  categoryBudget: {
    [key: string]: number;
  };
  totalEstimatedKRW: number;
  budgetRemaining: number;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

// 도시별 추천 상품 데이터베이스
const productDatabase: { [city: string]: Product[] } = {
  Tokyo: [
    {
      id: 'tokyo-001',
      name: '유니클로 울트라라이트 다운',
      category: 'Fashion',
      localPrice: 3990,
      koreanWonEstimate: 35910,
      localCurrency: 'JPY',
      storeName: '유니클로 (전국)',
      taxFree: true,
      description: '가볍고 얇은 다운 재킷. 여행 필수 아이템.',
      reason: '일본 명품 겨울옷. 한국보다 20% 저렴.',
    },
    {
      id: 'tokyo-002',
      name: 'SK-II 에센셜 아이크림',
      category: 'Beauty',
      localPrice: 14000,
      koreanWonEstimate: 126000,
      localCurrency: 'JPY',
      storeName: '드럭스토어 (신주쿠)',
      taxFree: true,
      description: '일본 고급 스킨케어 제품. 타겟 뷰티.',
      reason: '일본 면세점 필수 상품. 한국 대비 30% 저렴.',
    },
    {
      id: 'tokyo-003',
      name: '도쿄 소우베니어 세트',
      category: 'Souvenirs',
      localPrice: 2000,
      koreanWonEstimate: 18000,
      localCurrency: 'JPY',
      storeName: '기념품점 (아메요코)',
      taxFree: false,
      description: '전형적인 도쿄 기념품 세트.',
      reason: '친구 선물용. 가성비 좋음.',
    },
    {
      id: 'tokyo-004',
      name: 'Sony WH-CH720 이어폰',
      category: 'Electronics',
      localPrice: 8000,
      koreanWonEstimate: 72000,
      localCurrency: 'JPY',
      storeName: 'Bic Camera (신주쿠)',
      taxFree: true,
      description: '소니 무선 이어폰. 최신형.',
      reason: '일본이 가장 저렴. 한국보다 25% 싼 편.',
    },
    {
      id: 'tokyo-005',
      name: '도쿄 라멘 쿠폰북',
      category: 'Food',
      localPrice: 1500,
      koreanWonEstimate: 13500,
      localCurrency: 'JPY',
      storeName: '편의점 (전국)',
      taxFree: false,
      description: '유명 라멘점 할인권.',
      reason: '현지 음식 경험. 저렴함.',
    },
    {
      id: 'tokyo-006',
      name: '카시오 G-SHOCK 시계',
      category: 'Electronics',
      localPrice: 15000,
      koreanWonEstimate: 135000,
      localCurrency: 'JPY',
      storeName: '카시오 직매장 (신주쿠)',
      taxFree: true,
      description: '일본 유명 G-SHOCK 시계. 내구성 강함.',
      reason: '일본산이 가장 저렴. 한국보다 20% 저렴.',
    },
    {
      id: 'tokyo-007',
      name: '무지 스킨케어 세트',
      category: 'Beauty',
      localPrice: 4500,
      koreanWonEstimate: 40500,
      localCurrency: 'JPY',
      storeName: '무지 스토어 (하라주쿠)',
      taxFree: false,
      description: '무지 미니멀 스킨케어 3종 세트.',
      reason: '깔끔한 포장. 선물용 추천.',
    },
    {
      id: 'tokyo-008',
      name: '나가노 사과 선물 세트',
      category: 'Food',
      localPrice: 3000,
      koreanWonEstimate: 27000,
      localCurrency: 'JPY',
      storeName: '디파트 지하 식품관',
      taxFree: false,
      description: '나가노산 고급 사과 5개 선물 세트.',
      reason: '일본 프리미엄 과일. 명절 선물.',
    },
    {
      id: 'tokyo-009',
      name: '기모노 패턴 손수건',
      category: 'Souvenirs',
      localPrice: 800,
      koreanWonEstimate: 7200,
      localCurrency: 'JPY',
      storeName: '기념품점 (아사쿠사)',
      taxFree: false,
      description: '전통 기모노 패턴 목면 손수건.',
      reason: '도쿄 전통 공예품. 가벼운 선물.',
    },
    {
      id: 'tokyo-010',
      name: '후지필름 인스탁스 필름',
      category: 'Electronics',
      localPrice: 600,
      koreanWonEstimate: 5400,
      localCurrency: 'JPY',
      storeName: '빅카메라 (전국)',
      taxFree: true,
      description: '인스탁스 카메라용 필름 10매.',
      reason: '소비품 필수구매. 한국보다 10% 저렴.',
    },
  ],
  Paris: [
    {
      id: 'paris-001',
      name: '샤넬 No.5 향수',
      category: 'Beauty',
      localPrice: 95,
      koreanWonEstimate: 135000,
      localCurrency: 'EUR',
      storeName: '갤러리 라파예트 (오스만)',
      taxFree: true,
      description: '프랑스 명품 향수. 면세점 할인 가능.',
      reason: '파리가 가장 저렴. 한국 대비 40% 싼 편.',
    },
    {
      id: 'paris-002',
      name: '루이비통 에피 지갑',
      category: 'Fashion',
      localPrice: 450,
      koreanWonEstimate: 640000,
      localCurrency: 'EUR',
      storeName: '루이비통 부티크 (마레)',
      taxFree: true,
      description: '루이비통 가죽 지갑. 프랑스 한정 디자인.',
      reason: '파리 명품 최저가. 구매 권장.',
    },
    {
      id: 'paris-003',
      name: '머카도르 예술용품 세트',
      category: 'Souvenirs',
      localPrice: 25,
      koreanWonEstimate: 35000,
      localCurrency: 'EUR',
      storeName: '미술용품점 (라탱지구)',
      taxFree: false,
      description: '프랑스 전통 미술용품.',
      reason: '예술가 선물. 파리스러움.',
    },
    {
      id: 'paris-004',
      name: 'Boulanger 전자레인지',
      category: 'Electronics',
      localPrice: 60,
      koreanWonEstimate: 85000,
      localCurrency: 'EUR',
      storeName: 'Fnac (센터)',
      taxFree: false,
      description: '프랑스 가전제품.',
      reason: '가성비. 작은 선물용.',
    },
    {
      id: 'paris-005',
      name: '마카롱 선물 세트',
      category: 'Food',
      localPrice: 18,
      koreanWonEstimate: 25000,
      localCurrency: 'EUR',
      storeName: '라뒤레 (샹젤리제)',
      taxFree: false,
      description: '프랑스 전통 마카롱.',
      reason: '파리 명물. 선물 필수.',
    },
  ],
  'New York': [
    {
      id: 'nyc-001',
      name: 'Coach 핸드백',
      category: 'Fashion',
      localPrice: 250,
      koreanWonEstimate: 330000,
      localCurrency: 'USD',
      storeName: 'Coach Store (타임스퀘어)',
      taxFree: false,
      description: '미국 럭셔리 브랜드 핸드백.',
      reason: '뉴욕 최저가. 한국보다 20% 저렴.',
    },
    {
      id: 'nyc-002',
      name: 'Mac Lipstick (Red)',
      category: 'Beauty',
      localPrice: 18,
      koreanWonEstimate: 24000,
      localCurrency: 'USD',
      storeName: 'Ulta Beauty (5번가)',
      taxFree: false,
      description: '맥 립스틱 클래식 레드.',
      reason: '미국 뷰티 필수. 저렴함.',
    },
    {
      id: 'nyc-003',
      name: 'NYC 타임스퀘어 기념품',
      category: 'Souvenirs',
      localPrice: 10,
      koreanWonEstimate: 13000,
      localCurrency: 'USD',
      storeName: '기념품점 (타임스퀘어)',
      taxFree: false,
      description: '뉴욕 시티 기념품 티셔츠/머그컵.',
      reason: '미국식 기념품. 저렴함.',
    },
    {
      id: 'nyc-004',
      name: 'Apple AirPods Pro',
      category: 'Electronics',
      localPrice: 249,
      koreanWonEstimate: 330000,
      localCurrency: 'USD',
      storeName: 'Apple Store (5번가)',
      taxFree: false,
      description: '애플 최신 이어폰.',
      reason: '미국 정가 구매. 한국과 비슷.',
    },
    {
      id: 'nyc-005',
      name: '뉴욕 핫초콜릿 믹스',
      category: 'Food',
      localPrice: 12,
      koreanWonEstimate: 16000,
      localCurrency: 'USD',
      storeName: '카페/식료품점 (소호)',
      taxFree: false,
      description: '뉴욕식 핫초콜릿 믹스.',
      reason: '뉴욕 카페 감성. 기념품으로도 좋음.',
    },
  ],
};

// 환율 조회 (Mock - 실제로는 exchangerate.host API 사용)
// 현지 통화 → KRW 환율
const exchangeRates: { [key: string]: number } = {
  'JPY': 9,        // 1 JPY = 9 KRW
  'EUR': 1340,     // 1 EUR = 1,340 KRW
  'USD': 1320,     // 1 USD = 1,320 KRW
};

export const shoppingService = {
  // 한글 스타일을 영문으로 변환
  normalizeStyles: (styles: string[]): string[] => {
    const styleMap: { [key: string]: string } = {
      '🏃 액티비티': 'Activity',
      '🧘 힐링': 'Healing',
      '🛍️ 쇼핑': 'Shopping',
      '🍽️ 먹방': 'Food',
      '🎭 문화체험': 'Culture',
      '🌲 자연': 'Nature',
      // 이미 영문인 경우 그대로
      'Activity': 'Activity',
      'Healing': 'Healing',
      'Shopping': 'Shopping',
      'Food': 'Food',
      'Culture': 'Culture',
      'Nature': 'Nature',
    };
    return styles.map((s) => styleMap[s] || s);
  },

  // 여행지 기반 추천 상품 조회
  getRecommendations: async (
    tripId: string,
    city: string,
    budget: number,
    styles: string[]
  ): Promise<ShoppingRecommendation> => {
    // 스타일 정규화 (한글 → 영문)
    const normalizedStyles = shoppingService.normalizeStyles(styles);

    // 도시에서 추천 상품 가져오기
    const products = productDatabase[city] || [];

    // 스타일 필터링 (쇼핑이 포함되어 있으면 모든 상품 추천)
    let filtered = products;
    if (!normalizedStyles.includes('Shopping')) {
      // Shopping 스타일이 없으면 카테고리 필터링
      const allowedCategories: { [key: string]: string[] } = {
        Activity: ['Electronics', 'Souvenirs'],
        Food: ['Food', 'Souvenirs'],
        Nature: ['Electronics'],
      };
      const allowedCats = new Set<string>();
      normalizedStyles.forEach((style) => {
        (allowedCategories[style] || []).forEach((cat) => allowedCats.add(cat));
      });
      filtered = products.filter((p) => allowedCats.has(p.category));
    }

    // 한국 원화 기준으로 정렬 (가격순)
    filtered.sort((a, b) => a.koreanWonEstimate - b.koreanWonEstimate);

    // 상위 5개 선택
    const recommended = filtered.slice(0, 5);

    // 카테고리별 예산 분배
    const categories = [...new Set(recommended.map((p) => p.category))];
    const categoryBudget: { [key: string]: number } = {};
    categories.forEach((cat) => {
      const catProducts = recommended.filter((p) => p.category === cat);
      const ratio = catProducts.length / recommended.length;
      categoryBudget[cat] = Math.round(budget * ratio);
    });

    // 총 예상 비용
    const totalEstimatedKRW = recommended.reduce(
      (sum, p) => sum + p.koreanWonEstimate,
      0
    );

    return {
      tripId,
      city,
      budget,
      recommendedProducts: recommended,
      categoryBudget,
      totalEstimatedKRW,
      budgetRemaining: Math.max(0, budget - totalEstimatedKRW),
    };
  },

  // 실시간 환율 조회
  getExchangeRates: async (targetCurrency: string): Promise<ExchangeRate> => {
    try {
      // MVP용 Mock 데이터 (실제 API는 나중에 연동)
      const rate = exchangeRates[targetCurrency] || 1320; // 기본값 USD
      return {
        from: targetCurrency,
        to: 'KRW',
        rate: rate, // 직접 환율 반환 (예: 1 JPY = 9 KRW)
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('환율 조회 실패:', error);
      throw new Error('환율을 조회할 수 없습니다.');
    }
  },

  // 가격 변환 (현지 통화 -> 한국 원화)
  convertToKRW: async (
    amount: number,
    currency: string
  ): Promise<number> => {
    const rate = exchangeRates[currency] || 1320; // 기본값 USD
    return Math.round(amount * rate);
  },
};
