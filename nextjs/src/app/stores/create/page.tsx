// app/stores/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import api from '../../../utils/api';
import { StoreCreate } from '../../../type/store';

const CreateStorePage = () => {
  const [name, setName] = useState('');
  const [nameRuby, setNameRuby] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [street, setStreet] = useState('');
  const [address, setAddress] = useState('');
  const [building, setBuilding] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFormValid, setIsFormValid] = useState(false); // フォームが有効かどうかの状態を追加
  const router = useRouter();

  // フォームが有効かを確認する関数
  useEffect(() => {
    const checkFormValid = () => {
      // 全てのフィールドが埋まっているかどうか確認
      if (
        name && nameRuby && postalCode && prefecture && street && address && phoneNumber
      ) {
        setIsFormValid(true); // 全てのフィールドが埋まっていたらtrue
      } else {
        setIsFormValid(false); // そうでなければfalse
      }
    };

    checkFormValid();
  }, [name, nameRuby, postalCode, prefecture, street, address, phoneNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newStore: StoreCreate = {
      name,
      name_ruby: nameRuby,
      postal_code: postalCode,
      prefecture,
      street,
      address,
      building,
      phone_number: phoneNumber,
    };

    try {
      const response = await api.post(`/stores`, newStore);
      console.log('Success:', response.data); // レスポンスを確認
      router.push('/stores'); // 店舗一覧ページにリダイレクト
    } catch (error) {
      console.error('Failed to create store', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <Header />
      <div className="text-left p-10 pl-20 bg-blue-100">
        <h1 className="text-xl font-bold text-black pl-10">新規店舗登録</h1>
      </div>
      <div className="min-h-screen bg-blue-100 py-5 flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-10">
          <h2 className="text-xl text-left mb-4 bg-blue-900 text-white p-3 pl-6 rounded">店舗情報</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* 店舗名 */}
              <div className="grid grid-cols-1 gap-4 pb-4">
                <div className="flex items-center border-b-2 border-gray-300 pb-4 px-10">
                  <label className="block text-sm font-medium text-gray-700 w-1/4">店舗名</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    required
                  />
                </div>

                {/* かな */}
                <div className="flex items-center border-b-2 border-gray-300 pb-4 px-10">
                  <label className="block text-sm font-medium text-gray-700 w-1/4">かな</label>
                  <input
                    type="text"
                    value={nameRuby}
                    onChange={(e) => setNameRuby(e.target.value)}
                    className="mt-1 block w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    required
                  />
                </div>

                {/* 電話番号 */}
                <div className="flex items-center border-b-2 border-gray-300 pb-4 px-10">
                  <label className="block text-sm font-medium text-gray-700 w-1/4">電話番号</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 block w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ご住所セクション */}
            <h2 className="text-xl text-left mb-4 bg-blue-900 text-white p-3 pl-6 rounded">ご住所</h2>
            <div className="space-y-4 pb-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center border-b-2 border-gray-300 pb-4 px-10">
                  <label className="block text-sm font-medium text-gray-700 w-1/4">郵便番号</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="mt-1 block w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    required
                  />
                </div>

                <div className="flex items-center border-b-2 border-gray-300 pb-4 px-10">
                  <label className="block text-sm font-medium text-gray-700 w-1/4">都道府県</label>
                  <input
                    type="text"
                    value={prefecture}
                    onChange={(e) => setPrefecture(e.target.value)}
                    className="mt-1 block w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    required
                  />
                </div>

                <div className="flex items-center border-b-2 border-gray-300 pb-4 px-10">
                  <label className="block text-sm font-medium text-gray-700 w-1/4">市区町村</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="mt-1 block w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    required
                  />
                </div>

                <div className="flex items-center border-b-2 border-gray-300 pb-4 px-10">
                  <label className="block text-sm font-medium text-gray-700 w-1/4">以降の住所</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 block w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    required
                  />
                </div>

                <div className="flex items-center border-b-2 border-gray-300 pb-4 px-10">
                  <label className="block text-sm font-medium text-gray-700 w-1/4">建物名</label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="mt-1 block w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  />
                </div>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex flex-col items-center pt-6">
              <button
                type="submit"
                className={`py-2 px-4 rounded-md transition duration-200 mb-4 ${
                  isFormValid ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-500 text-white'
                }`}
                disabled={!isFormValid} // フォームが有効でなければボタンを無効化
                >
                  この内容で登録する
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  戻る
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default CreateStorePage;