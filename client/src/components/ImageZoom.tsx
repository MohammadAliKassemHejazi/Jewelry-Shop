
import { useState } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageZoom = ({ src, alt, className = '' }: ImageZoomProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
          isHovered ? 'scale-150' : 'scale-100'
        }`}
        style={{
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
        }}
      />
      {isHovered && (
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-300" />
      )}
    </div>
  );
};

export default ImageZoom;
