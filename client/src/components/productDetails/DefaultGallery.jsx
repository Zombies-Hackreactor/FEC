import React from 'react';
import MainImage from './MainImage.jsx';

const { useState, useEffect } = React;

function DefaultGallery({ photoUrls }) {
  const [count, setCount] = useState(0);
  const { length } = photoUrls;

  const nextImage = () => {
    setCount(count === length - 1 ? 0 : count + 1);
  };

  const prevImage = () => {
    setCount(count === 0 ? length - 1 : count - 1);
  };
  return (
    <div>
      {count === 0 ? null : <button type="button" onClick={prevImage}>Previous</button>}
      {count === photoUrls.length - 1 ? null : <button type="button" onClick={nextImage}>Next</button>}
      {photoUrls.map((url, index) => {
        const key = url.split('-');
        return (
          <div key={key[1]}>
            {index === count && (
            <MainImage imageUrl={url} />
            )}
          </div>
        );
      })}
    </div>
  );
}
export default DefaultGallery;
