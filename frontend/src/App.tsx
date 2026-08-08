import React, { useState } from 'react';
import { TravelProfile, FlightInfo } from './types/index';
import { TravelProfileForm } from './components/TravelProfileForm';
import { FlightOcrForm } from './components/FlightOcrForm';

type Step = 'profile' | 'flight' | 'preview';

function App() {
  const [step, setStep] = useState<Step>('profile');
  const [profile, setProfile] = useState<TravelProfile | null>(null);
  const [flightInfo, setFlightInfo] = useState<FlightInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [tripId] = useState('trip_' + Date.now()); // Mock trip ID

  const handleProfileNext = (newProfile: TravelProfile) => {
    setProfile(newProfile);
    setStep('flight');
  };

  const handleFlightVerified = (flight: FlightInfo) => {
    setFlightInfo(flight);
    setStep('preview');
  };

  const handleGenerateItinerary = () => {
    if (profile && flightInfo) {
      // API 호출로 일정 생성 (현재는 Mock)
      alert('일정이 생성되었습니다!\n지도와 추천 관광지는 다음 단계에서 표시됩니다.');
      // 실제로는 여기서 일정 페이지로 이동
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">✈️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Trip One</h1>
          </div>
          <div className="text-sm text-gray-600">
            <button className="text-blue-600 hover:underline mr-4">이미 여행 중인가요?</button>
            <button className="text-blue-600 hover:underline">로그인</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-12">
          {[
            { id: 'profile', label: 'Preferences', number: 1 },
            { id: 'flight', label: 'Flights', number: 2 },
            { id: 'preview', label: 'Preview', number: 3 },
          ].map((s) => (
            <div key={s.id} className="flex items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  step === s.id || (step === 'preview' && s.id !== 'preview')
                    ? 'bg-blue-600 text-white'
                    : step === 'preview'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s.number}
              </div>
              <p
                className={`text-sm font-medium ml-2 ${
                  step === s.id ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {s.label}
              </p>
              {s.id !== 'preview' && (
                <div className={`flex-1 h-1 mx-4 ${step !== 'profile' ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {step === 'profile' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                나만의 여행 프로필 만들기
              </h2>
              <p className="text-gray-600 mb-8">
                여행지, 일정, 예산, 스타일을 입력하면 AI가 맞춤형 일정을 추천해드립니다.
              </p>
              <TravelProfileForm onNext={handleProfileNext} />
            </div>
          )}

          {step === 'flight' && profile && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">항공권 등록</h2>
              <p className="text-gray-600 mb-8">
                항공권 이미지를 업로드하면 OCR이 자동으로 정보를 추출합니다.
                <br />
                정확한 도착/출국 시간으로 현실적인 일정을 추천해드립니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <FlightOcrForm
                    tripId={tripId}
                    onVerified={handleFlightVerified}
                    onLoading={setLoading}
                  />
                </div>

                {/* Summary */}
                <div className="card border-l-4 border-blue-600 h-fit">
                  <h3 className="font-semibold text-gray-800 mb-4">프로필 요약</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="text-gray-600">여행지:</span>
                      <span className="font-medium ml-2">
                        {profile.city}, {profile.country}
                      </span>
                    </li>
                    <li>
                      <span className="text-gray-600">일정:</span>
                      <span className="font-medium ml-2">
                        {profile.startDate} ~ {profile.endDate}
                      </span>
                    </li>
                    <li>
                      <span className="text-gray-600">예산:</span>
                      <span className="font-medium ml-2">${profile.budget}</span>
                    </li>
                    <li>
                      <span className="text-gray-600">스타일:</span>
                      <span className="font-medium ml-2">{profile.styles.length}개</span>
                    </li>
                  </ul>
                </div>
              </div>

              {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-8 text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full mb-4"></div>
                    <p className="text-gray-800">항공권 정보를 추출 중입니다...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'preview' && profile && flightInfo && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">여행 정보 확인</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* 프로필 요약 */}
                <div className="card">
                  <h3 className="font-semibold text-gray-800 mb-4">여행 프로필</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">여행지:</dt>
                      <dd className="font-medium">
                        {profile.city}, {profile.country}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">일정:</dt>
                      <dd className="font-medium">
                        {profile.startDate} ~ {profile.endDate}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">예산:</dt>
                      <dd className="font-medium">${profile.budget}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">동행:</dt>
                      <dd className="font-medium">{profile.companionType}</dd>
                    </div>
                  </dl>
                </div>

                {/* 항공편 요약 */}
                <div className="card">
                  <h3 className="font-semibold text-gray-800 mb-4">항공편 정보</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">항공편:</dt>
                      <dd className="font-medium">{flightInfo.flightNumber}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">출발:</dt>
                      <dd className="font-medium">{flightInfo.departureAirport}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">도착:</dt>
                      <dd className="font-medium">{flightInfo.arrivalAirport}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">출국 시간:</dt>
                      <dd className="font-medium">{flightInfo.outboundDateTime}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">귀국 시간:</dt>
                      <dd className="font-medium">{flightInfo.inboundDateTime}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-700">
                  ℹ️ 수집된 정보를 바탕으로 AI가 {profile.startDate}부터 현실적인 여행 일정을 생성합니다.
                  <br />
                  항공편 도착 시간과 공항 이동 시간을 자동으로 반영한 일정을 추천받을 준비가 되었습니다.
                </p>
              </div>

              <button
                onClick={handleGenerateItinerary}
                className="btn-primary w-full py-3 text-lg font-semibold"
              >
                AI 일정 생성하기 ✨
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2024 Trip One AI. Reliable Exploration.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="text-blue-600 hover:underline">
              Privacy
            </a>
            <a href="#" className="text-blue-600 hover:underline">
              Terms
            </a>
            <a href="#" className="text-blue-600 hover:underline">
              Safety
            </a>
            <a href="#" className="text-blue-600 hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
