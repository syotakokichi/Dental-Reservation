import { FC, useState } from 'react';
import api from '../utils/api';
import { Booking } from '../type/booking';

interface CancelBookingModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
}

const CancelBookingModal: FC<CancelBookingModalProps> = ({ isOpen, booking, onClose }) => {
  const [notifyPatient, setNotifyPatient] = useState(true); // チェックボックスの状態

  if (!isOpen || !booking) return null;

  const handleCancelBooking = async () => {
    try {
      // 予約ステータスをキャンセルに変更
      const updatedBooking = {
        ...booking,
        status: 'canceled',
      };

      // APIリクエストで予約を更新
      await api.put(`/stores/${booking.store_id}/bookings/${booking.id}`, updatedBooking);

      // キャンセル完了後、モーダルを閉じる
      onClose();
    } catch (error) {
      console.error('予約のキャンセルに失敗しました', error);
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
        <h2 className="text-xl font-bold mb-4 pl-2 pb-4 text-center text-black">予約のキャンセル</h2>

        <p className="mb-4 text-gray-700 text-center">「{booking.title}」をキャンセルしますか？</p>

        <div className="mb-4">
          <label className="flex items-center space-x-2 p-2 pl-20 text-gray-700">
            <input
              type="checkbox"
              checked={notifyPatient}
              onChange={() => setNotifyPatient(!notifyPatient)}
            />
            <span className="text-gray-700 text-center pl-1 text-sm">
              患者さまにキャンセルを通知する
            </span>
          </label>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            onClick={handleCancelBooking}
          >
            はい
          </button>
          <button className="text-blue-500 underline pb-2" onClick={onClose}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;