// 관광지 데이터 (POI - Points of Interest)
interface POI {
  id: string;
  name: string;
  category: 'museum' | 'park' | 'restaurant' | 'shopping' | 'temple' | 'nature';
  duration: number; // 분
  cost: number; // USD
  intensity: 'low' | 'medium' | 'high'; // 강도
  operatingHours: { open: string; close: string };
}

// 도시별 POI 데이터 (Mock)
const poiDatabase: { [city: string]: POI[] } = {
  Tokyo: [
    {
      id: 'poi_1',
      name: 'Tokyo Disneyland',
      category: 'park',
      duration: 480,
      cost: 80,
      intensity: 'high',
      operatingHours: { open: '08:00', close: '22:00' },
    },
    {
      id: 'poi_2',
      name: 'Senso-ji Temple',
      category: 'temple',
      duration: 120,
      cost: 0,
      intensity: 'low',
      operatingHours: { open: '06:00', close: '17:00' },
    },
    {
      id: 'poi_3',
      name: 'Shibuya Crossing',
      category: 'shopping',
      duration: 180,
      cost: 50,
      intensity: 'medium',
      operatingHours: { open: '10:00', close: '22:00' },
    },
    {
      id: 'poi_4',
      name: 'Meiji Shrine',
      category: 'nature',
      duration: 90,
      cost: 0,
      intensity: 'low',
      operatingHours: { open: '09:00', close: '16:00' },
    },
    {
      id: 'poi_5',
      name: 'Tsukiji Fish Market',
      category: 'restaurant',
      duration: 120,
      cost: 30,
      intensity: 'low',
      operatingHours: { open: '05:00', close: '14:00' },
    },
  ],
  Paris: [
    {
      id: 'poi_6',
      name: 'Eiffel Tower',
      category: 'park',
      duration: 180,
      cost: 15,
      intensity: 'medium',
      operatingHours: { open: '09:00', close: '00:45' },
    },
    {
      id: 'poi_7',
      name: 'Louvre Museum',
      category: 'museum',
      duration: 240,
      cost: 17,
      intensity: 'high',
      operatingHours: { open: '09:00', close: '18:00' },
    },
    {
      id: 'poi_8',
      name: 'Notre-Dame Cathedral',
      category: 'temple',
      duration: 120,
      cost: 0,
      intensity: 'low',
      operatingHours: { open: '08:00', close: '18:45' },
    },
  ],
  'New York': [
    {
      id: 'poi_9',
      name: 'Statue of Liberty',
      category: 'park',
      duration: 240,
      cost: 24,
      intensity: 'medium',
      operatingHours: { open: '09:00', close: '17:00' },
    },
    {
      id: 'poi_10',
      name: 'Central Park',
      category: 'nature',
      duration: 180,
      cost: 0,
      intensity: 'low',
      operatingHours: { open: '06:00', close: '01:00' },
    },
    {
      id: 'poi_11',
      name: 'Broadway Show',
      category: 'shopping',
      duration: 180,
      cost: 100,
      intensity: 'medium',
      operatingHours: { open: '19:00', close: '23:00' },
    },
  ],
};

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

// 시간 계산 헬퍼
const parseTime = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const addMinutesToTime = (time: string, minutes: number): string => {
  const totalMinutes = parseTime(time) + minutes;
  return minutesToTime(totalMinutes % (24 * 60));
};

export const itineraryService = {
  // 일정 생성 (규칙 기반)
  generateItinerary: (input: {
    city: string;
    startDate: string;
    endDate: string;
    budget: number;
    styles: string[];
    companionType: string;
    outboundDateTime: string; // 출국 날짜/시간
    inboundDateTime: string; // 귀국 날짜/시간
  }): Itinerary => {
    const pois = poiDatabase[input.city] || [];

    // 일정 기간 계산
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    const daysCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // 출국/귀국 시간 파싱
    const [outboundDate, outboundTime] = input.outboundDateTime.split(' ');
    const [inboundDate, inboundTime] = input.inboundDateTime.split(' ');

    console.log(`📅 일정 생성: ${input.city}, ${daysCount}박 ${daysCount + 1}일`);
    console.log(`✈️  출국: ${outboundTime}, 귀국: ${inboundTime}`);

    const days: ItineraryDay[] = [];
    let totalCost = 0;

    // 각 일차별 일정 생성
    for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + dayIndex);
      const dateStr = currentDate.toISOString().split('T')[0];

      let availableStart = '06:00'; // 기본: 아침 6시
      let availableEnd = '23:00'; // 기본: 밤 11시
      let dayTitle = `Day ${dayIndex + 1}: ${input.city}`;
      let note = '';

      // ===== 규칙 1: 첫날 (도착일) =====
      if (dayIndex === 0) {
        dayTitle = `Day 1: Arrival in ${input.city}`;

        const outboundTimeNum = parseTime(outboundTime);

        // 늦은 도착 (18:00 이후)
        if (outboundTimeNum >= 18 * 60) {
          availableStart = '19:00'; // 저녁 7시부터 시작
          availableEnd = '22:00'; // 밤 10시에 끝
          note = '✈️ 늦은 도착으로 저강도 야간 일정만 배치되었습니다.';
        }
        // 오후 도착 (12:00 ~ 18:00)
        else if (outboundTimeNum >= 12 * 60) {
          availableStart = '15:00'; // 오후 3시부터
          availableEnd = '22:00';
          note = '✈️ 오후 도착으로 중간 강도 일정이 배치되었습니다.';
        }
        // 오전 도착 (전)
        else {
          availableStart = '11:00'; // 오전 11시부터 (짐 보관 후)
          availableEnd = '22:00';
          note = '✈️ 오전 도착으로 핵심 관광지를 추가했습니다.';
        }
      }

      // ===== 규칙 2: 마지막날 (출국일) =====
      if (dayIndex === daysCount - 1) {
        dayTitle = `Day ${dayIndex + 1}: Departure from ${input.city}`;

        const inboundTimeNum = parseTime(inboundTime);

        // 이른 출국 (12:00 이전)
        if (inboundTimeNum < 12 * 60) {
          availableStart = '06:00';
          availableEnd = '09:00'; // 공항 이동 필요 (2~3시간 전)
          note = '🛫 이른 출국으로 공항 이동이 우선입니다. 추가 활동은 제한됩니다.';
        }
        // 늦은 출국 (18:00 이후)
        else if (inboundTimeNum >= 18 * 60) {
          availableStart = '08:00';
          availableEnd = '16:00'; // 공항 이동 (2~3시간 전)
          note = '🛫 늦은 출국으로 반나절 활동이 가능합니다.';
        }
        // 오후 출국 (12:00 ~ 18:00)
        else {
          availableStart = '08:00';
          availableEnd = '12:00';
          note = '🛫 오후 출국으로 오전 활동만 가능합니다.';
        }
      }

      // 일정 항목 생성
      const items: ItineraryItem[] = [];
      let currentTime = availableStart;
      let dayCost = 0;

      // POI 필터링 (스타일별)
      let filteredPois = pois;
      if (input.styles.includes('Shopping')) {
        filteredPois = filteredPois.filter((p) => p.category === 'shopping');
      } else if (input.styles.includes('Food')) {
        filteredPois = filteredPois.filter((p) => p.category === 'restaurant');
      } else if (input.styles.includes('Nature')) {
        filteredPois = filteredPois.filter((p) => p.category === 'nature');
      }

      // 가용 시간에 맞춰서 일정 배치
      const availableMinutes = parseTime(availableEnd) - parseTime(availableStart);
      let usedMinutes = 0;

      for (const poi of filteredPois) {
        if (usedMinutes + poi.duration > availableMinutes) break;

        items.push({
          time: currentTime,
          title: poi.name,
          description: `카테고리: ${poi.category}`,
          duration: poi.duration,
          cost: poi.cost,
          reason: `${input.styles.join('/')} 스타일에 맞춘 추천`,
        });

        dayCost += poi.cost;
        usedMinutes += poi.duration + 30; // 30분 버퍼
        currentTime = minutesToTime(parseTime(availableStart) + usedMinutes);
      }

      // 첫날/마지막날 기본 항목 추가
      if (dayIndex === 0 && items.length === 0) {
        items.unshift({
          time: availableStart,
          title: '숙소 체크인',
          description: '공항에서 숙소로 이동',
          duration: 180,
          cost: 0,
          reason: '도착 시간을 고려한 필수 활동',
        });
        dayCost += 0;
      }

      if (dayIndex === daysCount - 1 && items.length === 0) {
        items.unshift({
          time: availableStart,
          title: '숙소 체크아웃',
          description: '공항으로 이동',
          duration: 180,
          cost: 0,
          reason: '출국 시간을 고려한 필수 활동',
        });
        dayCost += 0;
      }

      totalCost += dayCost;

      days.push({
        day: dayIndex + 1,
        date: dateStr,
        title: dayTitle,
        availableHours: {
          start: availableStart,
          end: availableEnd,
        },
        items,
        totalCost: dayCost,
        note,
      });
    }

    const budgetRemaining = input.budget - totalCost;

    return {
      tripId: 'trip_temp',
      days,
      totalCost,
      budgetRemaining,
      recommendations: [
        budgetRemaining > 0
          ? `✅ 예산 범위 내입니다. 남은 예산: $${budgetRemaining}`
          : `⚠️ 예산 초과: $${Math.abs(budgetRemaining)}`,
        '💡 추천: 첫날 야간 활동은 저강도 코스로 선택했습니다.',
        `🎯 마지막날은 출국 시간(${inboundTime})을 반영했습니다.`,
        `👥 동행: ${input.companionType}과(와) 함께하는 여행입니다.`,
      ],
    };
  },
};
