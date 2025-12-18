import React, { useState } from 'react';

const Tooltip = ({ desconto }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex justify-center items-center text-zinc-600 text-sm font-bold"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className={`absolute top-0 left-0 z-10 opacity-100 translate-y-0 duration-300 skew-y-0 shadow-md`}
          style={{ transform: 'translateY(-100%)' }}
        >
          <div className="bg-lime-200 flex items-center gap-1 p-2 rounded-md">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="20px"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-zinc-600"
            >
              <circle strokeLinejoin="round" r={9} cy={12} cx={12} />
              <path strokeLinejoin="round" d="M12 3C12 3 8.5 6 8.5 12C8.5 18 12 21 12 21" />
              <path strokeLinejoin="round" d="M12 3C12 3 15.5 6 15.5 12C15.5 18 12 21 12 21" />
              <path strokeLinejoin="round" d="M3 12H21" />
              <path strokeLinejoin="round" d="M19.5 7.5H4.5" />
              <g filter="url(#filter0_d_15_556)">
                <path strokeLinejoin="round" d="M19.5 16.5H4.5" />
              </g>
              <defs>
                <filter
                  colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse"
                  height={3}
                  width={17}
                  y={16}
                  x="3.5"
                  id="filter0_d_15_556"
                >
                  <feFlood result="BackgroundImageFix" floodOpacity={0} />
                  <feColorMatrix
                    result="hardAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    type="matrix"
                    in="SourceAlpha"
                  />
                  <feOffset dy={1} />
                  <feGaussianBlur stdDeviation="0.5" />
                  <feColorMatrix
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    type="matrix"
                  />
                  <feBlend result="effect1_dropShadow_15_556" in2="BackgroundImageFix" mode="normal" />
                  <feBlend result="shape" in2="effect1_dropShadow_15_556" in="SourceGraphic" mode="normal" />
                </filter>
              </defs>
            </svg>
            <span>{desconto}</span>
          </div>
          <div className="shadow-md bg-lime-200 absolute bottom-0 translate-y-1/2 left-1/2 translate-x-full rotate-45 p-1" />
          <div className="rounded-md bg-white absolute top-0 left-0 w-full h-full"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
