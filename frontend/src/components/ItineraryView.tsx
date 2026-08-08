import React from 'react';
import { Itinerary, ItineraryDay } from '../types/index';

interface ItineraryViewProps {
  itinerary: Itinerary;
  onBackClick: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, onBackClick }) => {
  const [expandedDay, setExpandedDay] = React.useState<number | null>(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBackClick}
            className="text-blue-600 hover:underline font-medium mb-4 flex items-center gap-2"
          >
            ← 뒤로 가기
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI 여행 일정</h1>
          <p className="text-gray-600">맞춤형 일정이 생성되었습니다! 클릭하여 자세한 내용을 확인하세요.</p>
        </div>

        {/* 추천 사항 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="font-bold text-blue-800 mb-4">💡 생성된 일정 요약</h2>
          <ul className="space-y-2">
            {itinerary.recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* 예산 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">예상 지출</p>
            <p className="text-3xl font-bold text-blue-600">${itinerary.totalCost}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">예산</p>
            <p className="text-3xl font-bold text-gray-800">${itinerary.totalCost + itinerary.budgetRemaining}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">남은 예산</p>
            <p className={`text-3xl font-bold ${itinerary.budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${itinerary.budgetRemaining}
            </p>
          </div>
        </div>

        {/* 일정 타임라인 */}
        <div className="space-y-4">
          {itinerary.days.map((day: ItineraryDay) => (
            <div
              key={day.day}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Day Header */}
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-gray-800">{day.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-600">
                      📅 {day.date}
                    </span>
                    <span className="text-sm text-gray-600">
                      ⏰ {day.availableHours.start} ~ {day.availableHours.end}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      💰 ${day.totalCost}
                    </span>
                  </div>
                  {day.note && (
                    <p className="text-sm text-blue-600 mt-2">{day.note}</p>
                  )}
                </div>
                <div className="text-2xl">
                  {expandedDay === day.day ? '▼' : '▶'}
                </div>
              </button>

              {/* Day Content */}
              {expandedDay === day.day && (
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <div className="space-y-3">
                    {day.items.length === 0 ? (
                      <p className="text-gray-600 text-sm">일정이 없습니다.</p>
                    ) : (
                      day.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          {/* Timeline */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {idx + 1}
                            </div>
                            {idx < day.items.length - 1 && (
                              <div className="w-0.5 h-12 bg-blue-200 mt-1"></div>
                            )}
                          </div>

                          {/* Activity Details */}
                          <div className="flex-1 pb-4">
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                  <p className="text-xs text-blue-600 mt-2 italic">💡 {item.reason}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg text-gray-800">{item.time}</p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {Math.round(item.duration / 60)}분
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                <span className="text-xs text-gray-600">예상 비용</span>
                                <span className="font-semibold text-blue-600">${item.cost}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex gap-4 justify-center">
          <button
            onClick={onBackClick}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            일정 수정하기
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            일정 저장하기 ✅
          </button>
        </div>
      </div>
    </div>
  );
};
