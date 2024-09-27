// components/EventModal.tsx
import { FC, useEffect, useState } from 'react';
import { Booking } from '../type/booking';
import { Staff } from '../type/staff';
import { Customer } from '../type/customer';
import { useRouter } from 'next/navigation';
import NextBookingModal from './NextBookingModal'; // 次回予約作成モーダルをインポート
import EditBookingModal from './EditBookingModal';
import CancelBookingModal from './CancelBookingModal';
import DeleteBookingModal from './DeleteBookingModal';
import api from '../utils/api';

interface EventModalProps {
  isOpen: boolean;
  event: Booking | null;
  onClose: () => void;
}

const EventModal: FC<EventModalProps> = ({ isOpen, event, onClose }) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [isNextBookingModalOpen, setIsNextBookingModalOpen] = useState(false); // 次回予約作成モーダルの状態
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 変更モーダルの状態
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // キャンセルモーダルの状態
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 削除モーダルの状態
  const router = useRouter();

  useEffect(() => {
    const fetchStaffsAndCustomer = async () => {
      if (event) {
        try {
          const response = await api.get(`/stores/${event.store_id}/events/${event.id}`);
          setStaffList(response.data.staffs);

          const customerResponse = await api.get(`/stores/${event.store_id}/customers/${event.customer_id}`);
          setCustomerData(customerResponse.data);
        } catch (error) {
          console.error('Failed to fetch staff or customer information', error);
        }
      }
    };

    fetchStaffsAndCustomer();
  }, [event]);

  if (!isOpen || !event) return null;

  const handleNextBookingClick = () => {
    setIsNextBookingModalOpen(true); // 次回予約モーダルを開く
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCancel = () => {
    setIsCancelModalOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
        onClick={handleOverlayClick}
      >
        <div
          className="bg-white px-20 py-10 rounded-lg shadow-lg max-w-xl w-full h-auto flex flex-col justify-between text-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <button className="text-gray-500 hover:text-gray-700 ml-auto" onClick={onClose}>
              ×
            </button>
          </div>

          {customerData && (
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4 items-center">
                <h2 className="text-xl font-bold">
                  {customerData.customer_attributes[0].name}{'　'}
                  <span className="text-gray-500 text-sm">{customerData.customer_attributes[0].name_ruby}</span>
                </h2>
                <a
                  onClick={() => router.push(`/stores/${event.store_id}/customers/${event.customer_id}/show`)}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  患者情報
                </a>
              </div>
            </div>
          )}

          <div className="space-y-4 flex-grow">
            <div className="mb-4 flex">
              <strong className="w-1/3">診療内容</strong>
              <span className="w-2/3">{event.title || ''}</span>
            </div>

            <div className="mb-4 flex">
              <strong className="w-1/3">スタッフ</strong>
              <span className="w-2/3">
                {staffList.map(staff =>
                  Array.isArray(staff.staff_attributes) && staff.staff_attributes.length > 0
                    ? (staff.staff_attributes[0] as any).name
                    : 'スタッフ情報がありません'
                ).join(', ')}
              </span>
            </div>

            <div className="mb-4 flex">
              <strong className="w-1/3">予約日時</strong>
              <span className="w-2/3">{new Date(event.from_at).toLocaleString()}</span>
            </div>

            <div className="mb-4 flex">
              <strong className="w-1/3">メモ</strong>
              <span className="w-2/3">{event.note || ''}</span>
            </div>
          </div>

          {/* ボタンを横並びに配置 */}
          <div className="flex justify-around mt-4 space-x-4 pt-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              onClick={handleEdit}
            >
              変更
            </button>
            <button
              className="border border-gray-300 text-blue-500 py-2 px-4 rounded-lg hover:bg-gray-100"
              onClick={handleCancel}
            >
              キャンセル
            </button>
            <button
              className="border border-red-500 text-red-500 py-2 px-4 rounded-lg hover:bg-red-100"
              onClick={handleDelete}
            >
              削除
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center space-y-4">
            <button
              className="bg-blue-500 border border-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600"
              onClick={handleNextBookingClick} // 次回予約作成モーダルを開く
            >
              次回予約の作成
            </button>
          </div>

          <div className="flex justify-center mt-4 pt-2">
            <button className="text-blue-500 underline" onClick={onClose}>
              × 閉じる
            </button>
          </div>
        </div>
      </div>

      {/* 次回予約作成モーダル */}
      {isNextBookingModalOpen && (
        <NextBookingModal
          isOpen={isNextBookingModalOpen}
          storeId={event.store_id}
          onClose={() => setIsNextBookingModalOpen(false)} // モーダルを閉じる
        />
      )}

      {/* 変更モーダル */}
      {isEditModalOpen && (
        <EditBookingModal
          isOpen={isEditModalOpen}
          booking={event}
          storeId={event.store_id}
          onClose={() => setIsEditModalOpen(false)} // モーダルを閉じる
        />
      )}

      {/* キャンセルモーダル */}
      {isCancelModalOpen && (
        <CancelBookingModal
          isOpen={isCancelModalOpen}
          booking={event}
          onClose={() => setIsCancelModalOpen(false)}
        />
      )}

      {/* 削除モーダル */}
      {isDeleteModalOpen && (
        <DeleteBookingModal
          isOpen={isDeleteModalOpen}
          booking={event}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
};

export default EventModal;