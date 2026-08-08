import React, { useState, useEffect } from 'react';
import { TravelPhrase } from '../types';

interface TravelHelperViewProps {
  city: string;
  onBackClick: () => void;
}

export const TravelHelperView: React.FC<TravelHelperViewProps> = ({
  city,
  onBackClick,
}) => {
  const [phrases, setPhrases] = useState<TravelPhrase[]>([]);
  const [filteredPhrases, setFilteredPhrases] = useState<TravelPhrase[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [localLanguage, setLocalLanguage] = useState<string>('');

  // 초기 데이터 로드
  useEffect(() => {
    loadPhrases();
    loadCategories();
    loadLocalLanguage();
    loadFavorites();
  }, [city]);

  // 구문 필터링
  useEffect(() => {
    filterPhrases();
  }, [phrases, selectedCategory, searchKeyword]);

  const loadPhrases = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/travel-helper/${city}/phrases`
      );
      const data = await response.json();

      if (data.success) {
        setPhrases(data.data);
      } else {
        alert('구문 데이터 로드 실패: ' + data.error);
      }
    } catch (error) {
      console.error('구문 로드 중 오류:', error);
      alert('구문 데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/travel-helper/categories'
      );
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('카테고리 로드 중 오류:', error);
    }
  };

  const loadLocalLanguage = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/travel-helper/${city}/language`
      );
      const data = await response.json();

      if (data.success) {
        setLocalLanguage(data.data.language);
      }
    } catch (error) {
      console.error('현지 언어 로드 중 오류:', error);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem(`favorites_${city}`);
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  };

  const filterPhrases = () => {
    let filtered = phrases;

    // 카테고리 필터
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // 검색 필터
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.korean.toLowerCase().includes(keyword) ||
          p.local.toLowerCase().includes(keyword) ||
          p.pronunciation.toLowerCase().includes(keyword)
      );
    }

    setFilteredPhrases(filtered);
  };

  const toggleFavorite = (phraseId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(phraseId)) {
      newFavorites.delete(phraseId);
    } else {
      newFavorites.add(phraseId);
    }
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${city}`, JSON.stringify([...newFavorites]));
  };

  const speakPronunciation = (text: string) => {
    // 브라우저 Web Speech API 사용
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = localLanguage === 'Japanese' ? 'ja-JP' : localLanguage === 'French' ? 'fr-FR' : 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">로드 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">
              🗣️ 여행 도우미
            </h1>
            <p className="text-lg text-gray-700">
              {city} 여행에서 자주 쓰는 회화 표현을 배워보세요!
            </p>
            <p className="text-sm text-gray-600 mt-1">
              현지 언어: <span className="font-semibold">{localLanguage}</span>
            </p>
          </div>
          <button
            onClick={onBackClick}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            ← 일정으로 돌아가기
          </button>
        </div>

        {/* 검색 및 필터 영역 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* 검색창 */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="한국어 또는 현지 언어로 검색... (예: 감사, hello, 도움)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 text-lg"
            />
          </div>

          {/* 카테고리 필터 */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">📁 카테고리</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                전체
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 구문 카드 그리드 */}
        {filteredPhrases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              일치하는 구문이 없습니다. 다른 검색어를 시도해보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhrases.map((phrase) => {
              const isFavorited = favorites.has(phrase.id);
              return (
                <div
                  key={phrase.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border-l-4 border-indigo-500"
                >
                  {/* 헤더 */}
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 flex justify-between items-start">
                    <div>
                      <p className="text-sm text-indigo-100 font-semibold">
                        {phrase.category}
                      </p>
                      <p className="text-sm text-indigo-50 mt-1">
                        ID: {phrase.id}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(phrase.id)}
                      className="text-2xl transition-transform hover:scale-110"
                    >
                      {isFavorited ? '⭐' : '☆'}
                    </button>
                  </div>

                  {/* 본문 */}
                  <div className="px-6 py-6">
                    {/* 한국어 */}
                    <div className="mb-5">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                        한국어
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        {phrase.korean}
                      </p>
                    </div>

                    {/* 현지 언어 */}
                    <div className="mb-5">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                        {localLanguage}
                      </p>
                      <p className="text-lg font-semibold text-indigo-600">
                        {phrase.local}
                      </p>
                      <button
                        onClick={() => speakPronunciation(phrase.local)}
                        className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded hover:bg-indigo-200 transition-colors font-semibold"
                      >
                        🔊 발음 듣기
                      </button>
                    </div>

                    {/* 발음 */}
                    <div className="mb-5 bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                        발음
                      </p>
                      <p className="text-sm text-gray-700 italic">
                        "{phrase.pronunciation}"
                      </p>
                    </div>

                    {/* 예시 */}
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
                        💡 사용 예시
                      </p>
                      <p className="text-sm text-gray-700">{phrase.example}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 결과 요약 */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-700 font-semibold">
            ✨ 총 <span className="text-indigo-600 text-lg">{filteredPhrases.length}</span>개의 구문을 찾았습니다.
            {favorites.size > 0 && (
              <span>
                {' '}
                (⭐ 즐겨찾기: <span className="text-yellow-500 text-lg">{favorites.size}</span>개)
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
