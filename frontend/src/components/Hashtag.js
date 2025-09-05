import React from 'react';
export default function Hashtag({ tag, onClick }) {
  return (
    <span role="button"tabIndex={0}onClick={() => onClick(tag)}onKeyDown={(e) => { if (e.key === 'Enter') onClick(tag); }}style={{ cursor: 'pointer', color: 'blue' }}>
      #{tag}
    </span>
  );
}