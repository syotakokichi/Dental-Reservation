// src/components/SimpleEventModal.tsx
import { FC, useEffect, useState } from 'react';
import { Event } from '../type/event';
import { getEventDetails } from '../utils/api';
import NextBookingModal from './NextBookingModal'; // 次回予約作成モーダルをインポート
import EditBookingModal from './EditBookingModal'; // 変更モーダルをインポート
import CancelBookingModal from './CancelBookingModal'; // キャンセルモーダルをインポート
import DeleteBookingModal from './DeleteBookingModal'; // 削除モーダルをインポート

interface SimpleEventModalProps {
  isOpen: boolean;
  storeId: number;
  eventId: number | null;
  onClose: () => void;
}

const SimpleEventModal: FC<SimpleEventModalProps> = ({ isOpen, storeId, eventId, onClose }) => {
  const [eventData, setEventData] = useState<Event | null>(null);
  const [isNextBookingModalOpen, setIsNextBookingModalOpen] = useState(false); // 次回予約作成モーダルの状態
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 変更モーダルの状態
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // キャンセルモーダルの状態
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 削除モーダルの状態

  useEffect(() => {
    if (eventId !== null && isOpen) {
      const fetchEventData = async () => {
        try {
          const data = await getEventDetails(storeId, eventId);
          setEventData(data);
        } catch (error) {
          console.error('Failed to fetch event details:', error);
        }
      };

      fetchEventData();
    }
  }, [eventId, isOpen, storeId]);

  if (!isOpen || !eventData) return null;

  const handleNextBookingClick = () => {
    setIsNextBookingModalOpen(true); // 次回予約モーダルを開く
  };

  const handleEdit = () => {
    setIsEditModalOpen(true); // 変更モーダルを開く
  };

  const handleCancel = () => {
    setIsCancelModalOpen(true); // キャンセルモーダルを開く
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true); // 削除モーダルを開く
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose} // モーダル外をクリックで閉じる
      >
        <div
          className="bg-white p-10 rounded-lg shadow-lg max-w-xl w-full h-auto flex flex-col justify-between text-gray-700"
          onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じないようにする
        >
          {/* 閉じるボタン */}
          <div className="flex justify-between items-center mb-6">
            <button className="text-gray-500 hover:text-gray-700 ml-auto" onClick={onClose}>
              ×
            </button>
          </div>

          {/* イベント情報 */}
          <div className="space-y-4 flex-grow pl-10 pb-8">
            <div className="mb-4 flex">
              <strong className="w-1/3">診療内容</strong>
              <span className="w-2/3">{eventData.title || 'N/A'}</span>
            </div>

            <div className="mb-4 flex">
              <strong className="w-1/3">スタッフ</strong>
              <span className="w-2/3">
                {eventData.staffs.map(staff =>
                  Array.isArray(staff.staff_attributes) && staff.staff_attributes.length > 0
                    ? (staff.staff_attributes[0] as any).name
                    : 'スタッフ情報がありません'
                ).join(', ')}
              </span>
            </div>

            <div className="mb-4 flex">
              <strong className="w-1/3">予約日時</strong>
              <span className="w-2/3">{new Date(eventData.from_at).toLocaleString()}</span>
            </div>

            <div className="mb-4 flex">
              <strong className="w-1/3">メモ</strong>
              <span className="w-2/3">{eventData.note || ''}</span>
            </div>
          </div>

          {/* ボタンを横並びに配置 */}
          <div className="flex justify-around mt-4 space-x-4">
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

          {/* 次回予約ボタン */}
          <div className="mt-8 flex flex-col items-center space-y-4">
            <button
              className="border border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-100"
              onClick={handleNextBookingClick} // 次回予約作成モーダルを開く
            >
              次回予約の作成
            </button>
          </div>

          {/* 閉じるボタン */}
          <div className="flex justify-center mt-4 pt-4">
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
          storeId={storeId}
          onClose={() => setIsNextBookingModalOpen(false)} // モーダルを閉じる
        />
      )}

      {/* 変更モーダル */}
      {isEditModalOpen && (
        <EditBookingModal
          isOpen={isEditModalOpen}
          booking={eventData}
          storeId={storeId}
          onClose={() => setIsEditModalOpen(false)} // モーダルを閉じる
        />
      )}

      {/* キャンセルモーダル */}
      {isCancelModalOpen && (
        <CancelBookingModal
          isOpen={isCancelModalOpen}
          booking={eventData}
          onClose={() => setIsCancelModalOpen(false)} // モーダルを閉じる
        />
      )}

      {/* 削除モーダル */}
      {isDeleteModalOpen && (
        <DeleteBookingModal
          isOpen={isDeleteModalOpen}
          booking={eventData}
          onClose={() => setIsDeleteModalOpen(false)} // モーダルを閉じる
        />
      )}
    </>
  );
};

export default SimpleEventModal;