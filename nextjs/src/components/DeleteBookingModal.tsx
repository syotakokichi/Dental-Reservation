// components/DeleteBookingModal.tsx
import { FC } from 'react';
import api from '../utils/api';
import { Booking } from '../type/booking';

interface DeleteBookingModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
}

const DeleteBookingModal: FC<DeleteBookingModalProps> = ({ isOpen, booking, onClose }) => {
  if (!isOpen || !booking) return null;

  const handleDeleteBooking = async () => {
    try {
      // APIリクエストで予約を削除
      await api.delete(`/stores/${booking.store_id}/bookings/${booking.id}`);

      // 削除完了後、モーダルを閉じる
      onClose();
    } catch (error) {
      console.error('予約の削除に失敗しました', error);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <button className="text-gray-500 hover:text-gray-700 ml-auto" onClick={onClose}>
            ×
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4 pl-2 pb-4 text-center text-black">予約の削除</h2>

        <p className="mb-4 text-center text-gray-700">「{booking.title}」を削除しますか？</p>
        <p className="text-sm text-gray-500 mb-4 text-center pb-4">削除した場合、患者さまに通知されません。</p>

        <div className="flex flex-col items-center space-y-4 pb-2">
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            onClick={handleDeleteBooking}
          >
            はい
          </button>
          <button className="text-blue-500 underline" onClick={onClose}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookingModal;