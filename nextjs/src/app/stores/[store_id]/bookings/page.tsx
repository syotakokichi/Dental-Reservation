// src/app/stores/[store_id]/bookings/page.tsx

'use client';
import { useEffect, useState, useCallback, Fragment, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Header from '../../../../components/Header';
import api from '../../../../utils/api';
import { Event } from '../../../../type/event';
import { Customer } from '../../../../type/customer';
import { Staff } from '../../../../type/staff';
import EventModal from '../../../../components/EventModal';
import MyCalendar from '../../../../components/Calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Calendar } from 'antd';
import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import locale from 'antd/es/date-picker/locale/ja_JP';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

dayjs.locale('ja');

const BookingsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { store_id } = useParams() as { store_id: string };
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const router = useRouter();

  const view = searchParams?.get('view') || 'list'; // デフォルトで 'list' を表示
  const dateParam = searchParams?.get('date');
  const [currentDate, setCurrentDate] = useState<Date>(dateParam ? new Date(dateParam) : new Date());
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [yearVisible, setYearVisible] = useState(false);
  const [monthVisible, setMonthVisible] = useState(false);
  const [isStaffToggleOpen, setIsStaffToggleOpen] = useState(false);

  useEffect(() => {
    if (!store_id) {
      router.push('/stores');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await api.get(`/stores/${store_id}/bookings`);
        const eventsData = response.data.map((event: any) => ({
          ...event,
          created_at: new Date(event.created_at),
          staff_ids: event.staff_ids || [],
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await api.get(`/stores/${store_id}/customers`);
        setCustomers(response.data);
      } catch (error) {
        console.error('Failed to fetch customers', error);
      }
    };

    const fetchStaffs = async () => {
      try {
        const response = await api.get(`/stores/${store_id}/staffs`);
        setStaffList(response.data);
      } catch (error) {
        console.error('Failed to fetch staffs', error);
      }
    };

    fetchEvents();
    fetchCustomers();
    fetchStaffs();
  }, [store_id, router]);

  const getCustomerName = useCallback((customerId: number): string => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.customer_attributes[0]?.name || '名前がありません' : '名前がありません';
  }, [customers]);

  useEffect(() => {
    const filtered = events.filter(event => {
      const customerName = getCustomerName(event.customer_id);
      return customerName.includes(searchTerm);
    });
    setFilteredEvents(filtered);
  }, [searchTerm, events, getCustomerName]);

  const handleViewChange = (newView: string) => {
    router.push(`/stores/${store_id}/bookings?view=${newView}`);
  };

  const handleTodayClick = () => {
    const today = dayjs();
    setCurrentDate(today.toDate());
    setSelectedDate(today); // カレンダーの表示と一致させるために選択日付も更新
  };

  const handlePrevDayClick = (days: number) => {
    setSelectedDate((prevDate) => (prevDate ? prevDate.subtract(days, 'day') : dayjs(currentDate).subtract(days, 'day')));
    setCurrentDate((prevDate) => dayjs(prevDate).subtract(days, 'day').toDate());
  };

  const handleNextDayClick = (days: number) => {
    setSelectedDate((prevDate) => (prevDate ? prevDate.add(days, 'day') : dayjs(currentDate).add(days, 'day')));
    setCurrentDate((prevDate) => dayjs(prevDate).add(days, 'day').toDate());
  };

  const handlePrevWeekClick = (weeks: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - (weeks * 7)); // 1週間前に移動
    setCurrentDate(newDate);
  };

  const handleNextWeekClick = (weeks: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (weeks * 7)); // 1週間後に移動
    setCurrentDate(newDate);
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(dayjs(date));
    setCurrentDate(date);
  };

  const handleMonthChange = (month: number) => {
    setCurrentDate(dayjs(currentDate).month(month).toDate());
    setSelectedDate(dayjs(currentDate).month(month));
    setMonthVisible(false); // 月選択モードを閉じる
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(dayjs(currentDate).year(year).toDate());
    setYearVisible(false); // 年選択モードを閉じる
  };

  const nextMonth = () => {
    setCurrentDate(dayjs(currentDate).add(1, 'month').toDate());
  };

  const prevMonth = () => {
    setCurrentDate(dayjs(currentDate).subtract(1, 'month').toDate());
  };

  const handleStaffToggle = (staffId: number) => {
    setSelectedStaff((prevSelectedStaff) => {
      if (prevSelectedStaff.some(staff => staff.id === staffId)) {
        return prevSelectedStaff.filter(staff => staff.id !== staffId);
      } else {
        const newStaff = staffList.find(staff => staff.id === staffId);
        return newStaff ? [...prevSelectedStaff, newStaff] : prevSelectedStaff;
      }
    });
  };

  const handleStaffToggleAll = () => {
    if (selectedStaff.length === staffList.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(staffList);
    }
  };

  const isAllStaffSelected = selectedStaff.length === staffList.length;
  const allStaffCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (allStaffCheckboxRef.current) {
      allStaffCheckboxRef.current.indeterminate = selectedStaff.length > 0 && selectedStaff.length < staffList.length;
    }
  }, [selectedStaff, staffList]);

  return (
    <>
      <Header />
      <div className="flex justify-between items-center bg-blue-100 p-4 text-black">
        {view !== 'list' ? (
          <div className="flex items-center pl-8">
            <select
              className="border border-gray-100 rounded-lg p-2 mr-4"
              value={view}
              onChange={(e) => handleViewChange(e.target.value)}
            >
              <option value="day">日</option>
              <option value="week">週</option>
            </select>
            <h2 className="font-bold pl-6 text-xl pt-2 pl-2">
              {view === 'day'
                ? currentDate.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                  })
                : `${currentDate.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                  })}`}
            </h2>

            {/* 今日ボタン */}
            <button onClick={handleTodayClick} className="ml-4 bg-blue-500 text-white py-1 px-3 rounded">今日</button>

            {/* 前へ・次へボタン */}
            {view === 'day' ? (
              <>
                <button onClick={() => handlePrevDayClick(1)} className="ml-2 bg-gray-300 text-black py-1 px-3 rounded">{'<'}</button>
                <button onClick={() => handleNextDayClick(1)} className="ml-2 bg-gray-300 text-black py-1 px-3 rounded">{'>'}</button>
              </>
            ) : (
              <>
                <button onClick={() => handlePrevWeekClick(1)} className="ml-2 bg-gray-300 text-black py-1 px-3 rounded">{'<'}</button>
                <button onClick={() => handleNextWeekClick(1)} className="ml-2 bg-gray-300 text-black py-1 px-3 rounded">{'>'}</button>
              </>
            )}
          </div>
          ) : (
          <h2 className="pl-10 text-2xl font-bold p-2">予約</h2>
        )}

        {/* 右側のアイコン */}
        <div className="flex items-center space-x-4 pr-8">
          <button
            onClick={() => handleViewChange('day')}
            className={view === 'day' ? 'text-blue-500' : 'text-gray-500'}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="text-xl" />
          </button>
          <button
            onClick={() => handleViewChange('list')}
            className={view === 'list' ? 'text-blue-500' : 'text-gray-500'}
          >
            <FontAwesomeIcon icon={faList} className="text-xl" />
          </button>
        </div>
      </div>

      <div className={`flex ${view === 'list' ? '' : 'bg-white p-4'} text-black`}>
        {view !== 'list' && (
          <div className="flex flex-col space-y-4 pr-4" style={{ width: '250px' }}>
            {/* スタッフのトグル */}
            <div className="p-4 relative bg-white text-black">
              <button
                onClick={() => setIsStaffToggleOpen(!isStaffToggleOpen)}
                className="flex items-center bg-white border border-gray-300 text-blue-500 py-2 px-4 rounded"
              >
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={isAllStaffSelected}
                  ref={allStaffCheckboxRef}
                  onChange={handleStaffToggleAll}
                />
                スタッフ
                <svg
                  className={`ml-3 w-5 h-5 text-gray-500 transition-transform duration-200 ${isStaffToggleOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {isStaffToggleOpen && (
                <div className="absolute mt-2 bg-white p-4 rounded-lg shadow-lg z-10">
                  <div className="flex flex-col space-y-2">
                    {staffList.map(staff => (
                      <label key={staff.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedStaff.some(s => s.id === staff.id)}
                          onChange={() => handleStaffToggle(staff.id)}
                        />
                        <span>{staff.staff_attributes?.[0]?.name || '名前がありません'}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-2 rounded-lg shadow-md" style={{ width: '250px', height: '330px' }}>
              <Calendar
                fullscreen={false}
                locale={locale}
                value={selectedDate || dayjs(currentDate)}
                headerRender={() => {
                  return (
                    <div className="flex justify-between items-center mb-4">
                      {/* 前月へ */}
                      <button onClick={prevMonth}>
                        <LeftOutlined />
                      </button>

                      {/* 月選択ボタン */}
                      <span
                        onClick={() => setMonthVisible(!monthVisible)}
                        className="cursor-pointer"
                      >
                        {dayjs(currentDate).format('M')}月
                      </span>

                      {/* 年選択ボタン */}
                      <span
                        onClick={() => setYearVisible(!yearVisible)}
                        className="cursor-pointer ml-2"
                      >
                        {dayjs(currentDate).year()}
                      </span>

                      {/* 次月へ */}
                      <button onClick={nextMonth}>
                        <RightOutlined />
                      </button>

                      {/* 年選択モード */}
                      {yearVisible && (
                        <div className="absolute z-10 bg-white shadow-md p-2 rounded w-50" style={{ top: '330px' }}>
                          {Array.from({ length: 12 }, (_, i) => (
                            <div
                              key={i}
                              className="cursor-pointer p-2"
                              onClick={() => {
                                handleYearChange(dayjs(currentDate).year() - 6 + i);
                              }}
                            >
                              {dayjs(currentDate).year() - 6 + i}年
                            </div>
                          )).reduce<JSX.Element[][]>((acc, curr, index) => {
                            if (index % 3 === 0) acc.push([]);
                            acc[acc.length - 1].push(curr);
                            return acc;
                          }, []).map((row, rowIndex) => (
                            <div key={rowIndex} className="flex justify-between">
                              {row}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 月選択モード */}
                      {monthVisible && (
                        <div className="absolute z-10 bg-white shadow-md p-2 rounded w-48" style={{ top: '330px' }}>
                          {Array.from({ length: 12 }, (_, i) => (
                            <div
                              key={i}
                              className="cursor-pointer p-2"
                              onClick={() => {
                                handleMonthChange(i);
                              }}
                            >
                              {i + 1}月
                            </div>
                          )).reduce<JSX.Element[][]>((acc, curr, index) => {
                            if (index % 3 === 0) acc.push([]);
                            acc[acc.length - 1].push(curr);
                            return acc;
                          }, []).map((row, rowIndex) => (
                            <div key={rowIndex} className="flex justify-between">
                              {row}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }}
                onSelect={(date) => handleDateChange(date.toDate())}
              />
            </div>
          </div>
        )}

        {/* カレンダー表示 */}
        {view !== 'list' && (
          <div className="flex-1 min-h-screen text-black bg-white p-4">
            <div className="container mx-auto">
              {view === 'day' && (
                <div className="relative">
                  {selectedStaff.length === 0 ? (
                    // スタッフが選択されていない場合のメッセージ
                    <div className="text-center text-gray-500 py-20">
                      表示したいスタッフを選択してください。
                    </div>
                  ) : (
                    <div className="flex">
                      {/* 左側の固定された時間表記 */}
                      <div className="w-10 border-r bg-white text-gray-500 text-sm">
                        <div className="flex flex-col h-full relative" style={{ paddingTop: '40px' }}>
                          {Array.from({ length: 96 }, (_, i) => (
                            <div
                              key={`time-${i}`}
                              className="h-4 flex items-center justify-center"
                              style={{
                                marginTop: i % 4 === 0 ? '1px' : '0', // 時間表示の間隔を調整
                                marginBottom: i % 4 === 0 ? '15px' : '0',
                              }}
                            >
                              {i !== 0 && i % 4 === 0 ? `${i / 4}時` : ''}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 右側の横スクロール可能なスタッフのスケジュール */}
                      <div className="flex-1 overflow-x-auto">
                        <div className="flex min-w-[800px] sticky top-1 z-10">
                          {selectedStaff.map(staff => {
                            const staffEvents = events.filter(event =>
                              event.staffs.some(s => s.id === staff.id) && dayjs(event.from_at).isSame(currentDate, 'day')
                            );

                            return (
                              <div key={staff.id} className="border p-4 min-w-[200px] max-w-[500px] flex-grow">
                                <h3 className="text-center font-bold">{staff.staff_attributes?.[0]?.name || '名前がありません'}</h3>
                                <div className="flex flex-col h-full relative">
                                  {Array.from({ length: 96 }, (_, i) => (
                                    <div
                                      key={`${staff.id}-${i}`}
                                      className={`h-5 items-center justify-center relative`}
                                    >
                                      <div
                                        className={`${i % 4 === 0 ? 'border-t-2 border-gray-300' : i % 2 === 0 ? 'border-t border-gray-100' : ''}`}
                                        style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}
                                      ></div>
                                      {/* スケジュールの時間枠 */}
                                      {staffEvents.map(event => {
                                        const eventStart = dayjs(event.from_at);
                                        const eventEnd = dayjs(event.to_at);
                                        const eventStartSlot = (eventStart.hour() * 60 + eventStart.minute()) / 15; // 開始時間をスロットに変換
                                        const eventEndSlot = (eventEnd.hour() * 60 + eventEnd.minute()) / 15; // 終了時間をスロットに変換
                                        // 1度だけ描画する条件を設定 (一回の描画)
                                        if (i === eventStartSlot) {
                                          const eventTop = (eventStart.minute() % 15) / 15 * 5; // 15分ごとの高さ調整
                                          const eventHeight = (eventEndSlot - eventStartSlot) * 20; // イベントの高さを計算

                                          return (
                                            <div
                                              key={event.id}
                                              className="bg-blue-500 text-white p-2 rounded"
                                              style={{
                                                top: `${eventTop}px`,
                                                height: `${eventHeight}px`,
                                                width: '100%',
                                                position: 'absolute',
                                                zIndex: 2,
                                                left: '0%',
                                              }}
                                              onClick={() => setSelectedEvent(event)}
                                            >
                                              {event.title}
                                            </div>
                                          );
                                        }
                                        return null; // 該当しない時間枠には描画しない
                                      })}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {view === 'week' && (
                <MyCalendar
                  events={events}
                  onSelectEvent={(event) =>
                    setSelectedEvent(events.find((e) => e.id === event.id) || null)
                  }
                />
              )}
            </div>
          </div>
        )}

        {view === 'list' && (
          <div className="min-h-screen flex-1 text-black bg-blue-100 p-4">
            <div className="container mx-auto px-20">
              {/* リスト表示 */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="氏名で検索"
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* ラベル行 */}
              <div className="flex justify-between items-center mb-2 px-4 py-2 text-blue-500">
                <div className="w-1/4">氏名</div>
                <div className="w-1/4">診療内容</div>
                <div className="w-1/4">予約日時</div>
                <div className="w-1/4">予約作成日時</div>
              </div>
              {/* 予約リスト */}
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer transition-all duration-200"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="w-1/4 text-gray-800">
                      {getCustomerName(event.customer_id)}
                    </div>
                    <div className="w-1/4 text-gray-800">{event.title || '診療内容がありません'}</div>
                    <div className="w-1/4 text-gray-800">
                      {new Date(event.from_at).toLocaleString()}
                    </div>
                    <div className="w-1/4 text-gray-800">
                      {new Date(event.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* イベント詳細モーダル */}
        {selectedEvent && (
          <EventModal
            isOpen={!!selectedEvent}
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </>
  );
};

export default BookingsPage;