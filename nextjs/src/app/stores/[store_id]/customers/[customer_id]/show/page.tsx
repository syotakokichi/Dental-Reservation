// src/app/stores/[store_id]/customers/[customer_id]/show/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../../../../components/Header';
import api from '../../../../../../utils/api';
import { Customer } from '../../../../../../type/customer';
import { Booking } from '../../../../../../type/booking';
import SimpleEventModal from '../../../../../../components/SimpleEventModal'; // 新しいモーダルをインポート

const CustomerDetailPage = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null); // 選択された予約を管理する状態
  const router = useRouter();
  const params = useParams();
  const { store_id, customer_id } = params as { store_id: string; customer_id: string };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`/stores/${store_id}/customers/${customer_id}`);
        setCustomer(response.data);
      } catch (error) {
        console.error('Failed to fetch customer', error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await api.get(`/stores/${store_id}/bookings`);
        const filteredBookings = response.data.filter((booking: Booking) => booking.customer_id === parseInt(customer_id));
        setBookings(filteredBookings);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      }
    };

    fetchCustomer();
    fetchBookings();
  }, [store_id, customer_id]);

  if (!customer) {
    return <div>Loading...</div>;
  }

  const { customer_attributes } = customer;
  const customerAttribute = customer_attributes[0];

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-blue-100 py-6 px-6">
        <div className="container mx-auto">
          <div className="mb-12 mt-6 px-10">
            <h1 className="text-3xl font-bold text-gray-800">
              {customerAttribute.name} <span className="ml-4 text-xl text-gray-500">{customerAttribute.name_ruby}</span>
            </h1>
          </div>

          <div className="flex space-x-4 px-10">
            {/* 予約一覧 */}
            <div className="w-3/5">
              <h2 className="text-2xl font-bold mb-4 text-gray-700 pb-4">予約一覧</h2>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer transition-all duration-200 text-gray-700"
                    onClick={() => setSelectedBooking(booking)} // 予約をクリックするとモーダルを開く
                  >
                    <div className="flex space-x-4">
                      <p className="text-lg font-semibold">{new Date(booking.from_at).toLocaleString()}</p>
                      <p>{booking.title || '診療内容がありません'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center">予約中のものがありません。</p>
              )}
            </div>

            {/* プロフィール */}
            <div className="w-2/5 bg-white p-10 rounded-lg shadow-md text-gray-700 relative">
              <h2 className="text-2xl font-bold mb-4 pb-3">プロフィール</h2>
              <button
                className="absolute top-10 right-8 border border-black text-blue-500 py-1.5 px-6 rounded-lg"
                onClick={() => router.push(`/stores/${store_id}/customers/${customer_id}/edit`)}
              >
                編集
              </button>
              <p className="mb-4 flex"><strong className="w-1/3">患者ID</strong> <span className="w-2/3">{customer.id}</span></p>
              <p className="mb-4 flex"><strong className="w-1/3">氏名</strong> <span className="w-2/3">{customerAttribute.name}</span></p>
              <p className="mb-4 flex"><strong className="w-1/3">カナ</strong> <span className="w-2/3">{customerAttribute.name_ruby}</span></p>
              <p className="mb-4 flex"><strong className="w-1/3">メールアドレス</strong> <span className="w-2/3">{customerAttribute.mail_address}</span></p>
              <p className="mb-4 flex"><strong className="w-1/3">電話番号</strong> <span className="w-2/3">{customerAttribute.phone_number}</span></p>
              <p className="mb-4 flex">
                <strong className="w-1/3">住所</strong>
                <span className="w-2/3">〒{customerAttribute.postal_code} {customerAttribute.prefecture} {customerAttribute.street} {customerAttribute.address} {customerAttribute.building}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SimpleEventModal: シンプルな予約詳細のモーダル */}
      {selectedBooking && (
        <SimpleEventModal
          isOpen={!!selectedBooking}
          eventId={selectedBooking.id} // APIから取得したイベントデータを渡す
          storeId={parseInt(store_id)}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default CustomerDetailPage;