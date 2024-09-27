// components/CustomToolbar.tsx
import React from 'react';

const CustomToolbar = (toolbar: any) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button onClick={() => toolbar.onNavigate('PREV')}>前月</button>
        <button onClick={() => toolbar.onNavigate('TODAY')}>今日</button>
        <button onClick={() => toolbar.onNavigate('NEXT')}>次月</button>
      </span>
      <span className="rbc-toolbar-label">{toolbar.label}</span>
      <span className="rbc-btn-group">
        <button onClick={() => toolbar.onView('month')}>月</button>
        <button onClick={() => toolbar.onView('week')}>週</button>
        <button onClick={() => toolbar.onView('day')}>日</button>
        <button onClick={() => toolbar.onView('agenda')}>アジェンダ</button>
      </span>
    </div>
  );
};

export default CustomToolbar;