// src/app/stores/[store_id]/me/page.tsx
'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../utils/api';
import { Staff } from '../../../../type/staff';
import Header from '../../../../components/Header';
import { useStore } from '../../../context/StoreContext';

const MyAccountPage = () => {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { selectedStoreId } = useStore();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // ローカルストレージからトークンを取得
        const token = localStorage.getItem('token');
        if (!token) {
          // トークンがない場合はログインページへリダイレクト
          router.push('/auth/login');
          return;
        }

        // トークンを含めてAPIリクエストを実行
        const response = await api.get(`/stores/${selectedStoreId}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Request Headers:', {
          Authorization: `Bearer ${token}`,
        }); // リクエストヘッダーをログに出力
        console.log('API Response:', response.data);
        setStaff(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch account info', error as Error);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error('Error response data:', error.response.data); // エラーレスポンスをログに出力
            if (error.response.data.detail) {
              console.error('Error details:', error.response.data.detail); // エラーディテールをログに出力
            }
          } else {
            console.error('Error message:', error.message); // エラーメッセージをログに出力
          }
        } else {
          console.error('Unexpected error:', error); // 予期しないエラーをログに出力
        }
        // エラー時にはログインページにリダイレクトする処理
        setError('アカウント情報の取得に失敗しました。再度お試しください。');
      }
    };

    fetchStaff();
  }, [router, selectedStoreId]);

  if (!staff) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-6 sm:py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">マイアカウント</h1>
          <div className="space-y-4 text-gray-800">
            <p><span className="font-semibold">Name:</span> {staff.staff_attributes[0].name}</p>
            <p><span className="font-semibold">Name Ruby:</span> {staff.staff_attributes[0].name_ruby}</p>
            <p><span className="font-semibold">Email:</span> {staff.staff_attributes[0].mail_address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;