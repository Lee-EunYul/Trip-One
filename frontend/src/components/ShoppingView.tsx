import React, { useState, useEffect } from 'react';
import { ShoppingRecommendation, Product, ExchangeRate } from '../types';

interface ShoppingViewProps {
  recommendation: ShoppingRecommendation;
  onBackClick: () => void;
  onTravelHelperClick?: () => void;
}

export const ShoppingView: React.FC<ShoppingViewProps> = ({
  recommendation,
  onBackClick,
  onTravelHelperClick,
}) => {
  const [shoppingList, setShoppingList] = useState<Set<string>>(new Set());
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(false);

  // 첫 상품의 현지 통화로 환율 조회
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        if (recommendation.recommendedProducts.length === 0) return;

        const currency = recommendation.recommendedProducts[0].localCurrency;
        const response = await fetch(
          `/api/shopping/exchange-rates?currency=${currency}`
        );
        const result = await response.json();

        if (result.code === 'SUCCESS') {
          setExchangeRate(result.data);
        }
      } catch (error) {
        console.error('환율 조회 실패:', error);
      }
    };

    fetchExchangeRate();
  }, [recommendation]);

  const handleToggleProduct = (productId: string) => {
    const newSet = new Set(shoppingList);
    if (newSet.has(productId)) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);
    }
    setShoppingList(newSet);
  };

  // 선택된 상품의 총 비용 계산
  const selectedProducts = recommendation.recommendedProducts.filter((p) =>
    shoppingList.has(p.id)
  );
  const totalSelectedKRW = selectedProducts.reduce(
    (sum, p) => sum + p.koreanWonEstimate,
    0
  );

  // 카테고리별 진행도 계산
  const getCategoryProgress = (category: string) => {
    const budget = recommendation.categoryBudget[category] || 0;
    const spent = selectedProducts
      .filter((p) => p.category === category)
      .reduce((sum, p) => sum + p.koreanWonEstimate, 0);
    return Math.round((spent / budget) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🛍️ 스마트 쇼핑 가이드
            </h1>
            <p className="text-gray-600">
              {recommendation.city}에서 추천하는 쇼핑 리스트
            </p>
          </div>
          <button
            onClick={onBackClick}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            ← 일정으로 돌아가기
          </button>
        </div>

        {/* 환율 정보 */}
        {exchangeRate && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  환율 정보 (업데이트: {new Date(exchangeRate.lastUpdated).toLocaleTimeString()})
                </p>
                <p className="text-2xl font-bold text-green-600">
                  1 {exchangeRate.from} = ₩{exchangeRate.rate.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">여행 예산</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₩{recommendation.budget.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 예산 분배 (카테고리별) */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 카테고리별 예산 분배
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(recommendation.categoryBudget).map(
              ([category, budget]) => (
                <div key={category} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">{category}</p>
                  <p className="text-lg font-bold text-gray-800">
                    ₩{budget.toLocaleString()}
                  </p>
                  <div className="w-full bg-gray-300 rounded-full h-2 mt-3">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        getCategoryProgress(category) > 90
                          ? 'bg-red-500'
                          : getCategoryProgress(category) > 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(getCategoryProgress(category), 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {getCategoryProgress(category)}% 사용
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* 추천 상품 리스트 */}
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          ✨ 추천 상품 ({recommendation.recommendedProducts.length}개)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {recommendation.recommendedProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition transform hover:scale-105 ${
                shoppingList.has(product.id) ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => handleToggleProduct(product.id)}
            >
              {/* 체크박스 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={shoppingList.has(product.id)}
                    onChange={() => handleToggleProduct(product.id)}
                    className="w-6 h-6 rounded cursor-pointer"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">{product.storeName}</p>
                  </div>
                </div>
                {product.taxFree && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded">
                    면세
                  </span>
                )}
              </div>

              {/* 카테고리 */}
              <div className="mb-4">
                <span className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1 rounded">
                  {product.category}
                </span>
              </div>

              {/* 설명 */}
              <p className="text-gray-700 text-sm mb-4">{product.description}</p>

              {/* 추천 이유 */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                <p className="text-xs text-gray-600">💡 왜 추천할까?</p>
                <p className="text-sm text-gray-800 font-medium">{product.reason}</p>
              </div>

              {/* 가격 정보 */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm">현지 가격</span>
                  <span className="font-bold text-lg text-gray-800">
                    {product.localPrice} {product.localCurrency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">한국 원화</span>
                  <span className="font-bold text-xl text-green-600">
                    ₩{product.koreanWonEstimate.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 쇼핑리스트 요약 */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">📋 쇼핑리스트 요약</h2>

          {shoppingList.size > 0 ? (
            <>
              {/* 선택된 상품 리스트 */}
              <div className="mb-6 max-h-48 overflow-y-auto">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between bg-white bg-opacity-20 rounded p-3 mb-2"
                  >
                    <span>{product.name}</span>
                    <span className="font-bold">₩{product.koreanWonEstimate.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* 요약 */}
              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg">예상 지출액</span>
                  <span className="text-2xl font-bold">
                    ₩{totalSelectedKRW.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg">여행 예산</span>
                  <span className="text-xl">
                    ₩{recommendation.budget.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-white border-opacity-50 pt-2 flex justify-between items-center">
                  <span className="text-lg font-bold">남은 예산</span>
                  <span
                    className={`text-2xl font-bold ${
                      recommendation.budget - totalSelectedKRW >= 0
                        ? 'text-green-300'
                        : 'text-red-300'
                    }`}
                  >
                    ₩{(recommendation.budget - totalSelectedKRW).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 진행도 */}
              <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full transition-all ${
                    totalSelectedKRW > recommendation.budget
                      ? 'bg-red-400'
                      : 'bg-green-300'
                  }`}
                  style={{
                    width: `${Math.min((totalSelectedKRW / recommendation.budget) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-opacity-90 text-white">
                예산의 {Math.round((totalSelectedKRW / recommendation.budget) * 100)}% 사용 중
              </p>
            </>
          ) : (
            <p className="text-lg opacity-90">
              위의 상품을 클릭하거나 체크박스를 선택해 쇼핑리스트에 추가하세요.
            </p>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="max-w-5xl mx-auto px-4 mt-8 pb-8 flex gap-4">
        <button
          onClick={onBackClick}
          className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition"
        >
          ← 일정으로 돌아가기
        </button>
        {onTravelHelperClick && (
          <button
            onClick={onTravelHelperClick}
            className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 transition"
          >
            🗣️ 여행 도우미 →
          </button>
        )}
      </div>
    </div>
  );
};

export default ShoppingView;
