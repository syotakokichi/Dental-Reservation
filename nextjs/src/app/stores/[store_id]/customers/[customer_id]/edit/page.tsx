// app/stores/[store_id]/customers/[customer_id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../../../../../components/Header';
import api from '../../../../../../utils/api';

const EditCustomerPage = () => {
  const params = useParams();
  const { store_id, customer_id } = params as { store_id: string; customer_id: string };
  const [name, setName] = useState('');
  const [nameRuby, setNameRuby] = useState('');
  const [mailAddress, setMailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | 'unknown'>('male');
  const [postalCode, setPostalCode] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [street, setStreet] = useState('');
  const [address, setAddress] = useState('');
  const [building, setBuilding] = useState('');
  const [isFormValid, setIsFormValid] = useState(false); // フォームが有効かどうかの状態を追加
  const router = useRouter();

  // 初期値をAPIから取得し、フォームにセットする
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`/stores/${store_id}/customers/${customer_id}`);
        const customer = response.data.customer_attributes[0]; // 顧客データを取得
        setName(customer.name);
        setNameRuby(customer.name_ruby);
        setMailAddress(customer.mail_address);
        setPhoneNumber(customer.phone_number);
        setSex(customer.sex);
        setPostalCode(customer.postal_code);
        setPrefecture(customer.prefecture);
        setStreet(customer.street);
        setAddress(customer.address);
        setBuilding(customer.building);
      } catch (error) {
        console.error('Failed to fetch customer', error);
      }
    };

    fetchCustomer();
  }, [store_id, customer_id]);

  // フォームが有効かを確認する関数
  useEffect(() => {
    const checkFormValid = () => {
      // 全てのフィールドが埋まっているかどうか確認
      if (
        name && nameRuby && mailAddress && phoneNumber &&
        postalCode && prefecture && street && address
      ) {
        setIsFormValid(true); // 全てのフィールドが埋まっていたらtrue
      } else {
        setIsFormValid(false); // そうでなければfalse
      }
    };

    checkFormValid();
  }, [name, nameRuby, mailAddress, phoneNumber, postalCode, prefecture, street, address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedCustomer = {
      customer_attributes: {
        name,
        name_ruby: nameRuby,
        mail_address: mailAddress,
        phone_number: phoneNumber,
        sex,
        postal_code: postalCode,
        prefecture,
        street,
        address,
        building,
      },
    };

    try {
      const response = await api.put(`/stores/${store_id}/customers/${customer_id}`, updatedCustomer);
      console.log('Success:', response.data); // レスポンスを確認
      router.push(`/stores/${store_id}/customers`); // 顧客一覧ページにリダイレクト
    } catch (error) {
      console.error('Failed to update customer', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/stores/${store_id}/customers/${customer_id}`);
      router.push(`/stores/${store_id}/customers`); // 顧客一覧ページにリダイレクト
    } catch (error) {
      console.error('Failed to delete customer', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="text-left p-10 pl-20 bg-blue-100">
        <h1 className="text-xl font-bold text-black pl-10">患者さま情報編集</h1>
      </div>
      <div className="min-h-screen bg-blue-100 py-5 flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-10">
          <h2 className="text-xl text-left mb-4 bg-blue-900 text-white p-3 pl-6 rounded">患者さま情報</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* 氏名 */}
              <div className="grid grid-cols-1 gap-4 pb-4">
                <div className="flex items-center border-b-2 border-gray-300 pb-4 px-10">
                  <label className="block text-sm font-medium text-gray-700 w-1/4">氏名</label>
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

                {/* 性別 */}
                <div className="flex items-center border-b-2 border-gray-300 pb-4 px-10">
                  <label className="block text-sm font-medium text-gray-700 w-1/4">性別</label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value as 'male' | 'female' | 'unknown')}
                    className="mt-1 block w-3/4 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  >
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                    <option value="unknown">不明</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ご連絡セクション */}
            <h2 className="text-xl text-left mb-4 bg-blue-900 text-white p-3 pl-6 rounded">ご連絡先</h2>
            <div className="space-y-4 pb-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center border-b-2 border-gray-300 pb-4 px-10">
                  <label className="block text-sm font-medium text-gray-700 w-1/4">メールアドレス</label>
                  <input
                    type="email"
                    value={mailAddress}
                    onChange={(e) => setMailAddress(e.target.value)}
                    className="mt-1 block w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    required
                  />
                </div>

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
                <div className="flex items-center border-b-2 border-gray-300 pb-4 px-                  10">
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
                この内容で変更する
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200 mb-4"
              >
                戻る
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
              >
                患者さま情報を削除
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerPage;