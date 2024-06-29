import React from 'react';
import './MasonryLayout.css';

const images = [
  {
    src: 'https://s-media-cache-ak0.pinimg.com/736x/61/4f/1b/614f1b3a481f68b4d492f71c5fe3fc5f.jpg',
    link: 'https://uk.pinterest.com/pin/436286282624249460/',
    alt: 'Img 1'
  },
  {
    src: 'https://s-media-cache-ak0.pinimg.com/736x/1d/6f/2d/1d6f2d4fff0f0d4e83456c28b0645bbd.jpg',
    link: 'https://uk.pinterest.com/pin/481040803922110845/',
    alt: 'Img 2'
  },
  {
    src: 'http://i00.i.aliimg.com/wsphoto/v0/1913341970_3/New-Design-Photo-Frame-Wall-Decals-Memories-Photo-Frame-Vinyl-Wall-Stickers-Home-Decor-Witness-Every.jpg',
    link: 'http://grrlathr.com/woodworkingstand/picture-frame-design-on-walls-plans-diy-free-download-plans-to-build-bunk-beds',
    alt: 'Img 3'
  },
  // Add more image objects as needed
];

const MasonryLayout = () => {
  return (
    <div className="masonry-container">
      {images.map((image, index) => (
        <div className="masonry-item" key={index}>
          <a href={image.link} target="_blank" rel="noopener noreferrer">
            <img src={image.src} alt={image.alt} />
          </a>
          <span>{image.alt}</span>
        </div>
      ))}
    </div>
  );
};

export default MasonryLayout;
