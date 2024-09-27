// app/components/EditBookingModal.tsx
import { FC, useEffect, useState } from 'react';
import { Staff } from '../type/staff';
import { Customer } from '../type/customer';
import { Booking } from '../type/booking';
import api from '../utils/api';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: number;
  booking: Booking | null; // 編集する予約情報を渡す
}

const EditBookingModal: FC<EditBookingModalProps> = ({ isOpen, onClose, storeId, booking }) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff[]>([]);
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>('');
  const [duration, setDuration] = useState<number>(15);
  const [note, setNote] = useState<string>('');
  const [isCustomerSelected, setIsCustomerSelected] = useState<boolean>(false);
  const [showStaffList, setShowStaffList] = useState<boolean>(false); // スタッフ一覧の表示/非表示

  useEffect(() => {
    if (isOpen && booking) {
      // スタッフリストを取得
      const fetchStaffs = async () => {
        try {
          const response = await api.get(`/stores/${storeId}/staffs`);
          setStaffList(response.data);
          setSelectedStaff(
            response.data.filter((staff: Staff) =>
              booking.staff_ids.some((s: number) => s === staff.id)
            )
          );
        } catch (error) {
          console.error('Failed to fetch staff information', error);
        }
      };

      // 予約に関連する顧客データを取得
      const fetchCustomer = async () => {
        try {
          const response = await api.get(`/stores/${storeId}/customers/${booking.customer_id}`);
          setCustomerData(response.data);
          setIsCustomerSelected(true);
        } catch (error) {
          console.error('Failed to fetch customer information', error);
        }
      };

      // 予約情報を反映させる
      setTitle(booking.title || '');
      setAppointmentDate(new Date(booking.from_at));
      setDuration(booking.duration_by_minutes || 15);
      setNote(booking.note || '');

      fetchStaffs();
      fetchCustomer();
    }
  }, [isOpen, booking, storeId]);

  const handleStaffSelection = (staffId: number) => {
    const isSelected = selectedStaff.some(staff => staff.id === staffId);
    if (isSelected) {
      // すでに選択されている場合は、選択を解除する
      setSelectedStaff(selectedStaff.filter(staff => staff.id !== staffId));
    } else {
      // 選択されていない場合は、追加する
      const selected = staffList.find(staff => staff.id === staffId);
      if (selected) {
        setSelectedStaff([...selectedStaff, selected]);
      }
    }
  };

  const handleUpdateBooking = async () => {
    const fromAt = appointmentDate ? appointmentDate.toISOString() : '';
    const toAt = appointmentDate ? new Date(appointmentDate.getTime() + duration * 60000).toISOString() : '';

    const updatedBooking = {
      title,
      from_at: fromAt,
      to_at: toAt,
      duration_by_minutes: duration,
      note,
      staff_ids: selectedStaff.map(staff => staff.id),
      status: "active",
    };

    try {
      await api.put(`/stores/${storeId}/bookings/${booking?.id}`, updatedBooking); // 予約を更新
      onClose();
    } catch (error) {
      console.error('Failed to update booking', error);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // モーダル外をクリックで閉じる
    >
      <div
        className="bg-white px-20 py-10 rounded-lg shadow-lg max-w-xl w-full h-auto flex flex-col justify-between text-gray-700"
        onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じないようにする
      >
        {/* 閉じるボタン */}
        <div className="flex justify-between items-center mb-6">
          <button className="text-gray-500 hover:text-gray-700 ml-auto" onClick={onClose}>
            ×
          </button>
        </div>

        {/* タイトル */}
        <h1 className="text-xl font-bold mb-4 pb-6">予約を編集する</h1>

        {/* 患者情報 */}
        <div className="mb-4 flex">
          <strong className="w-1/3">患者</strong>
          <span className="w-2/3">
            {customerData ? (
              <>
                {customerData.customer_attributes[0].name} <br />
                患者ID: {customerData.id}
              </>
            ) : (
              '患者情報がありません'
            )}
          </span>
        </div>

        {/* 診療内容 */}
        <div className="mb-4 flex">
          <strong className="w-1/3">診療内容</strong>
          <input
            type="text"
            className="w-2/3 border border-gray-300 p-2 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* スタッフ選択 */}
        <div className="mb-4 flex flex-col">
          <div className="flex w-full">
            <strong className="w-1/3">スタッフ</strong>
            <button
              className="w-2/3 border border-gray-300 p-2 rounded-lg"
              onClick={() => setShowStaffList(!showStaffList)}
            >
              スタッフを選択
            </button>
          </div>

          {showStaffList && (
            <ul className="w-2/3 mt-2 border p-2 rounded-lg ml-auto">
              {staffList.map(staff => (
                <li key={staff.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStaff.some(s => s.id === staff.id)}
                    onChange={() => handleStaffSelection(staff.id)}
                  />
                  <span className="ml-2">{(staff.staff_attributes as any)[0].name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 予約日時 */}
        <div className="mb-4 flex">
          <strong className="w-1/3">予約日時</strong>
          <input
            type="datetime-local"
            className="w-2/3 border border-gray-300 p-2 rounded-lg"
            value={appointmentDate ? new Date(appointmentDate).toISOString().substring(0, 16) : ''}
            onChange={(e) => setAppointmentDate(new Date(e.target.value))}
            required
          />
        </div>

        {/* 診療時間 */}
        <div className="mb-4 flex">
          <strong className="w-1/3">診療時間</strong>
          <input
            type="number"
            className="w-2/3 border border-gray-300 p-2 rounded-lg"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
            min={5}
          />
        </div>

        {/* メモ */}
        <div className="mb-4 flex">
          <strong className="w-1/3">メモ</strong>
          <textarea
            className="w-2/3 border border-gray-300 p-2 rounded-lg"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="メモを入力"
          />
        </div>

        {/* アクションボタン */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            onClick={handleUpdateBooking}
          >
            更新
          </button>
        </div>

        {/* 閉じるボタン */}
        <div className="flex justify-center mt-4">
          <button className="text-blue-500 underline" onClick={onClose}>
            × 閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;