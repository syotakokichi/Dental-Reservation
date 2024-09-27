// src/app/stores/[store_id]/customers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '../../../../utils/api';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import Header from '../../../../components/Header';
import { Customer } from '../../../../type/customer';
import { useCustomerStore } from '../../../../store/customerStore';

const CustomersPage = () => {
  const { customers, setCustomers, setSelectedCustomer } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState(''); // 検索文字列の管理
  const router = useRouter();
  const { selectedStoreId } = useStore();

  useEffect(() => {
    if (!selectedStoreId) {
      router.push('/stores');
      return;
    }

    const fetchCustomers = async () => {
      try {
        const response = await api.get(`/stores/${selectedStoreId}/customers`);
        console.log('API Response:', response.data);
        setCustomers(response.data);
      } catch (error) {
        console.error('Failed to fetch customers', error);
      }
    };

    fetchCustomers();
  }, [selectedStoreId, router, setCustomers]);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    router.push(`/stores/${selectedStoreId}/customers/${customer.id}/show`);
  };

  // 検索バーの入力に基づいて顧客リストをフィルタリング
  const filteredCustomers = customers.filter((customer) => {
    const customerName = customer.customer_attributes[0]?.name || '';
    return customerName.includes(searchTerm);
  });

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-blue-100 py-10">
        <div className="container mx-auto px-20">
          {/* ページヘッダー */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">患者</h1>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              onClick={() => router.push(`/stores/${selectedStoreId}/customers/create`)}
            >
              + 新規患者
            </button>
          </div>

          {/* 検索バー */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="患者名で検索"
              className="w-full p-2 border border-gray-300 rounded-lg text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // 検索文字列の更新
            />
          </div>

          {/* ラベル行 */}
          <div className="flex justify-between items-center mb-2 px-4 py-2 text-blue-500">
            <div className="w-1/4">氏名</div>
            <div className="w-1/4">電話番号</div>
            <div className="w-1/4">患者ID</div>
            <div className="w-1/4">登録日</div>
          </div>

          {/* 患者リスト */}
          <div className="space-y-4"> {/* リスト間に余白を追加 */}
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer transition-all duration-200"
                onClick={() => handleCustomerClick(customer)} // リストクリックで詳細画面に遷移
              >
                <div className="w-1/4 text-gray-800">{customer.customer_attributes[0]?.name || '名前がありません'}</div>
                <div className="w-1/4 text-gray-800">{customer.customer_attributes[0]?.phone_number || '電話番号がありません'}</div>
                <div className="w-1/4 text-gray-800">{customer.id}</div>
                <div className="w-1/4 text-gray-800">{new Date(customer.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;