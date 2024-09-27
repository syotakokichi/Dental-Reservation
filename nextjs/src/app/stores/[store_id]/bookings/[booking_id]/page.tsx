// stores/[store_id]/bookings/[booking_id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../../../components/Header';
import api from '../../../../../utils/api';
import { Booking } from '../../../../../type/booking';  // Booking型をインポート

const BookingDetailPage = () => {
  const [booking, setBooking] = useState<Booking | null>(null);  // Booking型を指定
  const params = useParams();  // 型は自動で推測される
  const router = useRouter();

  // store_idとbooking_idの型を安全に取得
  const store_id = params?.store_id as string | undefined;
  const booking_id = params?.booking_id as string | undefined;

  useEffect(() => {
    if (!store_id || !booking_id) {
      router.push('/stores');
      return;
    }

    // APIを使ってデータを取得
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/stores/${store_id}/bookings/${booking_id}`);
        setBooking(response.data);
      } catch (error) {
        console.error('Failed to fetch booking', error);
      }
    };

    fetchBooking();
  }, [store_id, booking_id, router]);

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">予約詳細</h1>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-lg text-black">
              <p><strong>Title:</strong> {booking.title}</p>
              <p><strong>From:</strong> {new Date(booking.from_at).toLocaleString()}</p>
              <p><strong>To:</strong> {new Date(booking.to_at).toLocaleString()}</p>
              <p><strong>Duration:</strong> {booking.duration_by_minutes} minutes</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Note:</strong> {booking.note}</p>
              <p><strong>Details:</strong> {booking.details?.overview}</p>
            </div>
            <div className="mt-8 flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => router.push(`/stores/${store_id}/bookings`)}
              >
                Back to Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingDetailPage;