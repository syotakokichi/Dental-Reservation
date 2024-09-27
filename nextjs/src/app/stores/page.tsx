// src/app/stores/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';
import { useStore } from '../context/StoreContext';  // 追加
import Header from '../../components/Header';

const StoresPage = () => {
  const [stores, setStores] = useState<{ id: number; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // 検索文字列の管理
  const router = useRouter();
  const { setSelectedStoreId } = useStore();  // 追加

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get('/stores');
        setStores(response.data);
      } catch (error) {
        console.error('Failed to fetch stores', error);
      }
    };

    fetchStores();
  }, []);

  const handleStoreSelect = (storeId: number) => {
    setSelectedStoreId(storeId);  // 追加: 選択された加盟店IDを保存
    router.push(`/stores/${storeId}/customers`);
  };

  // 検索バーの入力に基づいて加盟店リストをフィルタリング
  const filteredStores = stores.filter((store) => {
    return store.name.includes(searchTerm);
  });

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-blue-100 py-10">
        <div className="container mx-auto px-20">
          {/* ページヘッダー */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">加盟店</h1>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              onClick={() => router.push('/stores/create')}
            >
              + 新規加盟店
            </button>
          </div>

          {/* 検索バー */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="加盟店名で検索"
              className="w-full p-2 border border-gray-300 rounded-lg text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // 検索文字列の更新
            />
          </div>

          {/* ラベル行 */}
          <div className="flex justify-between items-center mb-2 px-4 py-2 text-blue-500">
            <div className="w-1/4">加盟店名</div>
            <div className="w-1/4">加盟店ID</div>
          </div>

          {/* 加盟店リスト */}
          <div className="space-y-4"> {/* リスト間に余白を追加 */}
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer transition-all duration-200"
                onClick={() => handleStoreSelect(store.id)} // リストクリックで詳細画面に遷移
              >
                <div className="w-1/4 text-gray-800">{store.name}</div>
                <div className="w-1/4 text-gray-800">{store.id}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoresPage;