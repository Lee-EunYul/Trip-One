import React, { useState } from 'react';
import { TravelProfile } from '../types/index';

interface TravelProfileFormProps {
  onNext: (profile: TravelProfile) => void;
}

export const TravelProfileForm: React.FC<TravelProfileFormProps> = ({ onNext }) => {
  const [profile, setProfile] = useState<TravelProfile>({
    country: 'Japan',
    city: 'Tokyo',
    startDate: '2024-10-22',
    endDate: '2024-10-26',
    budget: 3500,
    styles: [],
    companionType: '',
    isFirstTrip: true,
  });

  const travelStyles = [
    '🏃 액티비티',
    '🧘 힐링',
    '🛍️ 쇼핑',
    '🍽️ 먹방',
    '🎭 문화체험',
    '🌲 자연',
  ];

  const companionTypes = ['혼자', '친구', '가족', '연인'];

  const handleStyleToggle = (style: string) => {
    setProfile((prev) => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter((s) => s !== style)
        : [...prev.styles, style],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수값 검증
    if (!profile.country || !profile.city || !profile.startDate || !profile.endDate) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    onNext(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 여행지 선택 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">국가</label>
          <input
            type="text"
            placeholder="Japan"
            className="input-field"
            value={profile.country}
            onChange={(e) => setProfile({ ...profile, country: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">도시</label>
          <input
            type="text"
            placeholder="Tokyo"
            className="input-field"
            value={profile.city}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
          />
        </div>
      </div>

      {/* 여행 날짜 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">여행 기간</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="input-field flex-1"
            value={profile.startDate}
            onChange={(e) => setProfile({ ...profile, startDate: e.target.value })}
          />
          <span className="text-gray-500">~</span>
          <input
            type="date"
            className="input-field flex-1"
            value={profile.endDate}
            onChange={(e) => setProfile({ ...profile, endDate: e.target.value })}
          />
        </div>
      </div>

      {/* 예산 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">예산 (USD)</label>
        <input
          type="number"
          placeholder="3500"
          className="input-field"
          value={profile.budget}
          onChange={(e) => setProfile({ ...profile, budget: Number(e.target.value) })}
        />
      </div>

      {/* 여행 스타일 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">여행 스타일</label>
        <div className="flex flex-wrap gap-2">
          {travelStyles.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => handleStyleToggle(style)}
              className={`px-3 py-1 rounded-full border transition ${
                profile.styles.includes(style)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* 동행 유형 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">동행 유형</label>
        <div className="flex gap-2">
          {companionTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setProfile({ ...profile, companionType: type })}
              className={`px-4 py-2 rounded border transition ${
                profile.companionType === type
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 첫 해외여행 여부 */}
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={profile.isFirstTrip}
            onChange={(e) => setProfile({ ...profile, isFirstTrip: e.target.checked })}
          />
          <span className="text-gray-700">첫 해외여행입니다</span>
        </label>
      </div>

      <button type="submit" className="btn-primary w-full py-3 text-lg font-semibold">
        다음: 항공권 등록
      </button>
    </form>
  );
};
