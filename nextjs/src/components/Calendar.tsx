// Calendar.tsx

import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Event } from '../type/event';  // Event 型をインポート

const localizer = momentLocalizer(moment);

interface CalendarProps {
  events: Event[];  // Event 型を使用
  onSelectEvent: (event: Event) => void;
}

const MyCalendar: React.FC<CalendarProps> = ({ events, onSelectEvent }) => {
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title || 'No Title',  // titleがない場合はデフォルト値
    start: new Date(event.from_at),    // from_at を Date に変換
    end: new Date(event.to_at),        // to_at を Date に変換
  }));

  return (
    <div style={{ height: '700px' }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(calendarEvent) => onSelectEvent(events.find(event => event.id === calendarEvent.id)!)}  // イベント選択時の処理
      />
    </div>
  );
};

export default MyCalendar;