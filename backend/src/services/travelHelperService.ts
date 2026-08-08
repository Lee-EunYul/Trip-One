import { TravelPhrase, TravelHelperResponse } from '../types';

// 도시별 회화 구문 데이터베이스
const phraseDatabase: Record<string, TravelPhrase[]> = {
  Tokyo: [
    // 인사 (Greetings)
    {
      id: 'greet_1',
      category: 'Greetings',
      korean: '안녕하세요',
      local: 'こんにちは',
      localLang: 'Japanese',
      pronunciation: 'Konnichiwa',
      example: '호텔 직원을 만날 때 사용합니다.',
    },
    {
      id: 'greet_2',
      category: 'Greetings',
      korean: '감사합니다',
      local: 'ありがとうございます',
      localLang: 'Japanese',
      pronunciation: 'Arigatou gozaimasu',
      example: '음식을 받을 때 또는 도움을 받을 때 사용합니다.',
    },
    {
      id: 'greet_3',
      category: 'Greetings',
      korean: '죄송합니다',
      local: 'すみません',
      localLang: 'Japanese',
      pronunciation: 'Sumimasen',
      example: '주목을 끌거나 도움을 청할 때 사용합니다.',
    },
    // 음식 (Dining)
    {
      id: 'food_1',
      category: 'Dining',
      korean: '물 한 잔 주세요',
      local: '水をください',
      localLang: 'Japanese',
      pronunciation: 'Mizu wo kudasai',
      example: '레스토랑에서 물을 주문할 때',
    },
    {
      id: 'food_2',
      category: 'Dining',
      korean: '이것을 추천하세요',
      local: 'これをお勧めします',
      localLang: 'Japanese',
      pronunciation: 'Kore wo osusume shimasu',
      example: '점원에게 추천 음식을 물어볼 때',
    },
    {
      id: 'food_3',
      category: 'Dining',
      korean: '알레르기가 있습니다',
      local: 'アレルギーがあります',
      localLang: 'Japanese',
      pronunciation: 'Arerugii ga arimasu',
      example: '음식 알레르기를 알릴 때',
    },
    {
      id: 'food_4',
      category: 'Dining',
      korean: '계산서를 주세요',
      local: 'お会計をください',
      localLang: 'Japanese',
      pronunciation: 'Okaikei wo kudasai',
      example: '레스토랑에서 계산할 때',
    },
    // 길찾기 (Directions)
    {
      id: 'dir_1',
      category: 'Directions',
      korean: '역은 어디입니까?',
      local: '駅はどこですか？',
      localLang: 'Japanese',
      pronunciation: 'Eki wa doko desu ka?',
      example: '지하철역을 찾을 때',
    },
    {
      id: 'dir_2',
      category: 'Directions',
      korean: '호텔로 가는 길을 알려주세요',
      local: 'ホテルへの行き方を教えてください',
      localLang: 'Japanese',
      pronunciation: 'Hoteru e no ikimichi wo oshiete kudasai',
      example: '길을 잃었을 때 호텔 위치를 물어볼 때',
    },
    {
      id: 'dir_3',
      category: 'Directions',
      korean: '버스 정류장은 어디입니까?',
      local: 'バス停はどこですか？',
      localLang: 'Japanese',
      pronunciation: 'Basutei wa doko desu ka?',
      example: '버스 정류장을 찾을 때',
    },
    // 긴급 (Emergency)
    {
      id: 'emerg_1',
      category: 'Emergency',
      korean: '도와주세요!',
      local: '助けてください！',
      localLang: 'Japanese',
      pronunciation: 'Tasukete kudasai!',
      example: '긴급 상황에서 도움을 청할 때',
    },
    {
      id: 'emerg_2',
      category: 'Emergency',
      korean: '경찰을 불러주세요',
      local: '警察を呼んでください',
      localLang: 'Japanese',
      pronunciation: 'Keisatsu wo yonde kudasai',
      example: '심각한 상황에서 경찰에 신고할 때',
    },
    {
      id: 'emerg_3',
      category: 'Emergency',
      korean: '병원이 필요합니다',
      local: '病院が必要です',
      localLang: 'Japanese',
      pronunciation: 'Byouin ga hitsuyou desu',
      example: '의료 지원이 필요할 때',
    },
    // 쇼핑 (Shopping)
    {
      id: 'shop_1',
      category: 'Shopping',
      korean: '얼마입니까?',
      local: 'いくらですか？',
      localLang: 'Japanese',
      pronunciation: 'Ikura desu ka?',
      example: '물건 가격을 물어볼 때',
    },
    {
      id: 'shop_2',
      category: 'Shopping',
      korean: '이것을 입어봐도 되나요?',
      local: 'これを試着できますか？',
      localLang: 'Japanese',
      pronunciation: 'Kore wo shichakudekimasu ka?',
      example: '의류를 입어볼 때',
    },
    {
      id: 'shop_3',
      category: 'Shopping',
      korean: '다른 사이즈가 있습니까?',
      local: '別のサイズはありますか？',
      localLang: 'Japanese',
      pronunciation: 'Betsu no saizu wa arimasu ka?',
      example: '다른 사이즈를 찾을 때',
    },
    {
      id: 'shop_4',
      category: 'Shopping',
      korean: '세금 면제를 받을 수 있습니까?',
      local: '免税を受けられますか？',
      localLang: 'Japanese',
      pronunciation: 'Menzei wo ukerareru masu ka?',
      example: '면세 혜택을 물어볼 때',
    },
    // 문화 (Cultural)
    {
      id: 'culture_1',
      category: 'Cultural',
      korean: '이것의 역사는 무엇입니까?',
      local: 'これの歴史は何ですか？',
      localLang: 'Japanese',
      pronunciation: 'Kore no rekishi wa nani desu ka?',
      example: '관광지의 배경을 알고 싶을 때',
    },
    {
      id: 'culture_2',
      category: 'Cultural',
      korean: '사진을 찍어도 되나요?',
      local: '写真を撮っていいですか？',
      localLang: 'Japanese',
      pronunciation: 'Shashin wo totte ii desu ka?',
      example: '신사나 사원에서 사진 촬영을 물어볼 때',
    },
    {
      id: 'culture_3',
      category: 'Cultural',
      korean: '이 축제는 언제입니까?',
      local: 'このお祭りはいつですか？',
      localLang: 'Japanese',
      pronunciation: 'Kono omatsuri wa itsu desu ka?',
      example: '현지 축제 일정을 물어볼 때',
    },
  ],
  Paris: [
    // 인사
    {
      id: 'greet_1',
      category: 'Greetings',
      korean: '안녕하세요',
      local: 'Bonjour',
      localLang: 'French',
      pronunciation: 'Bohn-zhoor',
      example: '호텔 직원을 만날 때 사용합니다.',
    },
    {
      id: 'greet_2',
      category: 'Greetings',
      korean: '감사합니다',
      local: 'Merci beaucoup',
      localLang: 'French',
      pronunciation: 'Mare-see boh-koo',
      example: '음식을 받을 때 또는 도움을 받을 때 사용합니다.',
    },
    {
      id: 'greet_3',
      category: 'Greetings',
      korean: '죄송합니다',
      local: 'Excusez-moi',
      localLang: 'French',
      pronunciation: 'Ex-kew-zay-mwah',
      example: '주목을 끌거나 도움을 청할 때 사용합니다.',
    },
    // 음식
    {
      id: 'food_1',
      category: 'Dining',
      korean: '물 한 잔 주세요',
      local: 'Un verre d\'eau, s\'il vous plaît',
      localLang: 'French',
      pronunciation: 'Un vair doh, seel voo pleh',
      example: '레스토랑에서 물을 주문할 때',
    },
    {
      id: 'food_2',
      category: 'Dining',
      korean: '메뉴를 보여주세요',
      local: 'Le menu, s\'il vous plaît',
      localLang: 'French',
      pronunciation: 'Luh men-oo, seel voo pleh',
      example: '카페나 식당에서 메뉴를 청할 때',
    },
    {
      id: 'food_3',
      category: 'Dining',
      korean: '이것을 추천하세요',
      local: 'Qu\'est-ce que vous recommandez?',
      localLang: 'French',
      pronunciation: 'Kess-kuh voo reh-kohm-ahn-day?',
      example: '점원에게 추천 음식을 물어볼 때',
    },
    {
      id: 'food_4',
      category: 'Dining',
      korean: '계산서를 주세요',
      local: 'L\'addition, s\'il vous plaît',
      localLang: 'French',
      pronunciation: 'Lad-dees-yohn, seel voo pleh',
      example: '레스토랑에서 계산할 때',
    },
    // 길찾기
    {
      id: 'dir_1',
      category: 'Directions',
      korean: '에펠탑은 어디입니까?',
      local: 'Où est la Tour Eiffel?',
      localLang: 'French',
      pronunciation: 'Oo eh la tour eye-fell?',
      example: '주요 관광지를 찾을 때',
    },
    {
      id: 'dir_2',
      category: 'Directions',
      korean: '호텔로 가는 길을 알려주세요',
      local: 'Comment puis-je aller à mon hôtel?',
      localLang: 'French',
      pronunciation: 'Kohm-ahn pwee-zhuh ah-lay ah mohn oh-tell?',
      example: '길을 잃었을 때 호텔 위치를 물어볼 때',
    },
    {
      id: 'dir_3',
      category: 'Directions',
      korean: '지하철역은 어디입니까?',
      local: 'Où est la gare?',
      localLang: 'French',
      pronunciation: 'Oo eh lah gar?',
      example: '지하철역을 찾을 때',
    },
    // 긴급
    {
      id: 'emerg_1',
      category: 'Emergency',
      korean: '도와주세요!',
      local: 'Aidez-moi!',
      localLang: 'French',
      pronunciation: 'Ay-day-mwah!',
      example: '긴급 상황에서 도움을 청할 때',
    },
    {
      id: 'emerg_2',
      category: 'Emergency',
      korean: '경찰을 불러주세요',
      local: 'Appelez la police!',
      localLang: 'French',
      pronunciation: 'Ah-puh-lay lah poh-lease!',
      example: '심각한 상황에서 경찰에 신고할 때',
    },
    // 쇼핑
    {
      id: 'shop_1',
      category: 'Shopping',
      korean: '얼마입니까?',
      local: 'Combien ça coûte?',
      localLang: 'French',
      pronunciation: 'Kohm-bee-ahn sah koot?',
      example: '물건 가격을 물어볼 때',
    },
    {
      id: 'shop_2',
      category: 'Shopping',
      korean: '다른 사이즈가 있습니까?',
      local: 'Avez-vous une autre taille?',
      localLang: 'French',
      pronunciation: 'Ah-vay-voo oon oh-truh tye?',
      example: '다른 사이즈를 찾을 때',
    },
  ],
  'New York': [
    // 인사
    {
      id: 'greet_1',
      category: 'Greetings',
      korean: '안녕하세요',
      local: 'Hello',
      localLang: 'English',
      pronunciation: 'Huh-LOH',
      example: '호텔 직원을 만날 때 사용합니다.',
    },
    {
      id: 'greet_2',
      category: 'Greetings',
      korean: '감사합니다',
      local: 'Thank you very much',
      localLang: 'English',
      pronunciation: 'THANK you VERY much',
      example: '음식을 받을 때 또는 도움을 받을 때 사용합니다.',
    },
    {
      id: 'greet_3',
      category: 'Greetings',
      korean: '죄송합니다',
      local: 'Excuse me',
      localLang: 'English',
      pronunciation: 'Ik-SKYOOZ me',
      example: '주목을 끌거나 도움을 청할 때 사용합니다.',
    },
    // 음식
    {
      id: 'food_1',
      category: 'Dining',
      korean: '물 한 잔 주세요',
      local: 'A glass of water, please',
      localLang: 'English',
      pronunciation: 'A GLASS of WAH-tur, PLEASE',
      example: '레스토랑에서 물을 주문할 때',
    },
    {
      id: 'food_2',
      category: 'Dining',
      korean: '메뉴를 보여주세요',
      local: 'Can I see the menu?',
      localLang: 'English',
      pronunciation: 'Can I SEE the MEN-yoo?',
      example: '카페나 식당에서 메뉴를 청할 때',
    },
    {
      id: 'food_3',
      category: 'Dining',
      korean: '이것을 추천하세요',
      local: 'What do you recommend?',
      localLang: 'English',
      pronunciation: 'What do you REC-uh-mend?',
      example: '점원에게 추천 음식을 물어볼 때',
    },
    {
      id: 'food_4',
      category: 'Dining',
      korean: '계산서를 주세요',
      local: 'Check, please',
      localLang: 'English',
      pronunciation: 'CHECK, PLEASE',
      example: '레스토랑에서 계산할 때',
    },
    // 길찾기
    {
      id: 'dir_1',
      category: 'Directions',
      korean: '타임스 스퀘어는 어디입니까?',
      local: 'Where is Times Square?',
      localLang: 'English',
      pronunciation: 'Where is TIMES SQUARE?',
      example: '주요 관광지를 찾을 때',
    },
    {
      id: 'dir_2',
      category: 'Directions',
      korean: '호텔로 가는 길을 알려주세요',
      local: 'How do I get to my hotel?',
      localLang: 'English',
      pronunciation: 'How do I GET to my HO-tel?',
      example: '길을 잃었을 때 호텔 위치를 물어볼 때',
    },
    {
      id: 'dir_3',
      category: 'Directions',
      korean: '지하철역은 어디입니까?',
      local: 'Where is the subway station?',
      localLang: 'English',
      pronunciation: 'Where is the SUB-way STA-shun?',
      example: '지하철역을 찾을 때',
    },
    // 긴급
    {
      id: 'emerg_1',
      category: 'Emergency',
      korean: '도와주세요!',
      local: 'Help!',
      localLang: 'English',
      pronunciation: 'HELP!',
      example: '긴급 상황에서 도움을 청할 때',
    },
    {
      id: 'emerg_2',
      category: 'Emergency',
      korean: '경찰을 불러주세요',
      local: 'Call the police!',
      localLang: 'English',
      pronunciation: 'CALL the po-LEES!',
      example: '심각한 상황에서 경찰에 신고할 때',
    },
    // 쇼핑
    {
      id: 'shop_1',
      category: 'Shopping',
      korean: '얼마입니까?',
      local: 'How much is this?',
      localLang: 'English',
      pronunciation: 'How MUCH is THIS?',
      example: '물건 가격을 물어볼 때',
    },
    {
      id: 'shop_2',
      category: 'Shopping',
      korean: '다른 사이즈가 있습니까?',
      local: 'Do you have another size?',
      localLang: 'English',
      pronunciation: 'Do you HAVE a-NUH-ther SIZE?',
      example: '다른 사이즈를 찾을 때',
    },
  ],
};

// 카테고리 목록
const categories = [
  'Greetings',
  'Dining',
  'Directions',
  'Emergency',
  'Shopping',
  'Cultural',
];

export class TravelHelperService {
  // 도시별 모든 구문 조회
  getPhrasesByCity(city: string): TravelPhrase[] {
    return phraseDatabase[city] || [];
  }

  // 카테고리별 구문 필터링
  getPhrasesByCategory(city: string, category: string): TravelPhrase[] {
    const phrases = phraseDatabase[city] || [];
    return phrases.filter((p) => p.category === category);
  }

  // 검색 기능 (한국어 또는 현지 언어로 검색)
  searchPhrases(city: string, keyword: string): TravelPhrase[] {
    const phrases = phraseDatabase[city] || [];
    const lowerKeyword = keyword.toLowerCase();

    return phrases.filter(
      (p) =>
        p.korean.toLowerCase().includes(lowerKeyword) ||
        p.local.toLowerCase().includes(lowerKeyword) ||
        p.pronunciation.toLowerCase().includes(lowerKeyword)
    );
  }

  // 카테고리 목록 반환
  getCategories(): string[] {
    return categories;
  }

  // 도시별 현지 언어 반환
  getLocalLanguage(city: string): string {
    const phrases = phraseDatabase[city];
    if (!phrases || phrases.length === 0) return 'Unknown';
    return phrases[0].localLang;
  }

  // 발음 정보 반환
  getPhrasePronunciation(
    city: string,
    phraseId: string
  ): { korean: string; local: string; pronunciation: string } | null {
    const phrases = phraseDatabase[city] || [];
    const phrase = phrases.find((p) => p.id === phraseId);

    if (!phrase) return null;

    return {
      korean: phrase.korean,
      local: phrase.local,
      pronunciation: phrase.pronunciation,
    };
  }
}

// 싱글톤 인스턴스
export const travelHelperService = new TravelHelperService();
