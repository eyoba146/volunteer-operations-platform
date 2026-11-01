import React from 'react';

interface TopoBackdropProps {
  color?: string;
  opacity?: number;
  className?: string;
}

export const TopoBackdrop: React.FC<TopoBackdropProps> = ({
  color = '#15803D',
  opacity = 0.07,
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className} `}
      style={{ opacity }}
    >
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Topographic Contour Loops */}
        <path
          d="M-50,180 C120,120 220,240 380,190 C540,140 680,260 840,210 C960,170 1050,220 1100,200"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M-50,220 C100,160 250,280 410,230 C570,180 710,300 870,250 C980,210 1060,260 1100,240"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M-50,260 C80,200 280,320 440,270 C600,220 740,340 900,290 C1000,250 1070,300 1100,280"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M-50,300 C60,240 310,360 470,310 C630,260 770,380 930,330 C1020,290 1080,340 1100,320"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M-50,140 C140,80 190,200 350,150 C510,100 650,220 810,170 C940,130 1040,180 1100,160"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M-50,100 C160,40 160,160 320,110 C480,60 620,180 780,130 C920,90 1030,140 1100,120"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Closed Ridge Contour Rings */}
        <path
          d="M320,260 C360,240 420,250 440,290 C460,330 400,370 350,360 C300,350 280,280 320,260 Z"
          stroke={color}
          strokeWidth="1.5"
        />
        <path
          d="M340,280 C365,265 405,272 418,298 C432,324 390,350 360,342 C330,334 315,295 340,280 Z"
          stroke={color}
          strokeWidth="1.5"
        />
        <path
          d="M720,120 C760,100 830,110 850,150 C870,190 820,240 770,230 C720,220 680,140 720,120 Z"
          stroke={color}
          strokeWidth="1.5"
        />
        <path
          d="M740,140 C765,125 815,132 828,160 C842,188 805,220 775,212 C745,204 715,155 740,140 Z"
          stroke={color}
          strokeWidth="1.5"
        />

        {/* Southwest Hill Contours */}
        <path
          d="M100,380 C150,340 240,360 260,420 C280,480 200,530 140,510 C80,490 50,420 100,380 Z"
          stroke={color}
          strokeWidth="1.5"
        />
        <path
          d="M125,405 C160,375 220,390 235,435 C250,480 185,510 145,495 C105,480 90,435 125,405 Z"
          stroke={color}
          strokeWidth="1.5"
        />

        {/* East Range Elevation Loops */}
        <path
          d="M860,340 C910,310 990,330 1010,380 C1030,430 960,480 900,470 C840,460 810,370 860,340 Z"
          stroke={color}
          strokeWidth="1.5"
        />
        <path
          d="M885,365 C920,342 975,355 988,392 C1002,428 950,460 910,452 C870,444 850,388 885,365 Z"
          stroke={color}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

