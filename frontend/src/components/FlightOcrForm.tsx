import React, { useState, useRef } from 'react';
import { FlightInfo } from '../types/index';

interface FlightOcrFormProps {
  tripId: string;
  onVerified: (flightInfo: FlightInfo) => void;
  onLoading?: (loading: boolean) => void;
}

export const FlightOcrForm: React.FC<FlightOcrFormProps> = ({
  tripId,
  onVerified,
  onLoading,
}) => {
  const [ocrResult, setOcrResult] = useState<FlightInfo | null>(null);
  const [manualInput, setManualInput] = useState<FlightInfo>({
    departureCountry: '',
    departureAirport: '',
    arrivalCountry: '',
    arrivalAirport: '',
    outboundDateTime: '',
    inboundDateTime: '',
    airline: '',
    flightNumber: '',
    terminal: '',
    isUserVerified: false,
  });
  const [showManualForm, setShowManualForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock OCR 결과 (실제로는 API 호출)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onLoading?.(true);

    // Mock OCR 결과
    setTimeout(() => {
      setOcrResult({
        departureCountry: 'United States',
        departureAirport: 'San Francisco (SFO)',
        arrivalCountry: 'Japan',
        arrivalAirport: 'Haneda Intl (HND)',
        outboundDateTime: '2024-10-22 12:45 PM',
        inboundDateTime: '2024-10-26 02:30 PM',
        airline: 'Japan Airlines',
        flightNumber: 'JL 12',
        terminal: 'Terminal 3',
        ocrConfidence: 0.95,
      });
      onLoading?.(false);
    }, 2000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !manualInput.flightNumber ||
      !manualInput.departureAirport ||
      !manualInput.arrivalAirport
    ) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    onVerified({ ...manualInput, isUserVerified: true });
  };

  const handleOcrConfirm = () => {
    if (!ocrResult) return;
    onVerified({ ...ocrResult, isUserVerified: true });
  };

  const handleEditOcrField = (field: keyof FlightInfo, value: string) => {
    setOcrResult((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-8 text-center border-2 border-dashed border-blue-300">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">항공권 이미지 업로드</h3>
        <p className="text-gray-600 mb-4">
          PDF 또는 이미지(JPG, PNG)를 드래그하거나 클릭하여 업로드하세요.
        </p>
        <p className="text-sm text-gray-500 mb-4">지원 형식: PDF, JPG, PNG (최대 5MB)</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary"
        >
          파일 선택
        </button>
      </div>

      {/* OCR 결과 표시 */}
      {ocrResult && (
        <div className="card border-2 border-green-200 bg-green-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-green-600">✓</span> 추출된 정보 (신뢰도:{' '}
              {Math.round((ocrResult.ocrConfidence || 0) * 100)}%)
            </h3>
            <button
              type="button"
              onClick={() => setShowManualForm(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              수정하기
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'flightNumber' as const, label: '항공편명' },
              { key: 'departureAirport' as const, label: '출발지' },
              { key: 'arrivalAirport' as const, label: '도착지' },
              { key: 'outboundDateTime' as const, label: '출국 날짜/시간' },
              { key: 'inboundDateTime' as const, label: '귀국 날짜/시간' },
              { key: 'terminal' as const, label: '터미널' },
            ].map(({ key, label }) => (
              <div key={key}>
                <p className="text-sm text-gray-600">{label}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-medium text-gray-800">{ocrResult[key]}</p>
                  <button
                    type="button"
                    onClick={() => handleEditOcrField(key, '')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOcrConfirm}
            className="btn-primary w-full mt-6"
          >
            정보 확인 및 저장
          </button>
        </div>
      )}

      {/* 수동 입력 폼 */}
      {showManualForm && (
        <form onSubmit={handleManualSubmit} className="card border-l-4 border-blue-600">
          <h3 className="text-lg font-semibold mb-4">항공권 정보 수동 입력</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="항공편명 (예: JL 12)"
              className="input-field"
              value={manualInput.flightNumber}
              onChange={(e) => setManualInput({ ...manualInput, flightNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="항공사 (예: Japan Airlines)"
              className="input-field"
              value={manualInput.airline}
              onChange={(e) => setManualInput({ ...manualInput, airline: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="출발지 공항"
              className="input-field"
              value={manualInput.departureAirport}
              onChange={(e) => setManualInput({ ...manualInput, departureAirport: e.target.value })}
            />
            <input
              type="text"
              placeholder="도착지 공항"
              className="input-field"
              value={manualInput.arrivalAirport}
              onChange={(e) => setManualInput({ ...manualInput, arrivalAirport: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="datetime-local"
              className="input-field"
              value={manualInput.outboundDateTime}
              onChange={(e) => setManualInput({ ...manualInput, outboundDateTime: e.target.value })}
            />
            <input
              type="datetime-local"
              className="input-field"
              value={manualInput.inboundDateTime}
              onChange={(e) => setManualInput({ ...manualInput, inboundDateTime: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            저장하고 계속
          </button>
        </form>
      )}

      {!ocrResult && !showManualForm && (
        <button
          type="button"
          onClick={() => setShowManualForm(true)}
          className="btn-secondary w-full py-2"
        >
          또는 항공권 정보 수동 입력
        </button>
      )}
    </div>
  );
};
