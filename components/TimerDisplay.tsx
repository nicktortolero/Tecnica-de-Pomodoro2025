import React from 'react';

interface TimerDisplayProps {
  time: number;
  activeTime: number;
  progressColorClass: string;
  activeTaskName: string;
  timerStateText: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  time,
  activeTime,
  progressColorClass,
  activeTaskName,
  timerStateText,
}) => {
  const minutes = Math.floor(time / 60).toString().padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = activeTime === 0 ? 0 : ((activeTime - time) / activeTime) * circumference;
  const strokeDashoffset = circumference - progressPercentage;

  return (
    <div className="relative flex justify-center my-6">
      <div className="relative">
        <svg className="w-64 h-64" viewBox="0 0 100 100">
          <circle
            className="stroke-gray-700"
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            id="progress-circle"
            className={`${progressColorClass} transition-all duration-500 ease-linear`}
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
              strokeDashoffset: strokeDashoffset,
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-mono font-bold">{minutes}:{seconds}</div>
          <div className="mt-2 text-center max-w-xs px-4 py-1 bg-gray-700/50 rounded-full text-sm">
            <span className="truncate">{activeTaskName}</span>
          </div>
          <div className="mt-2 text-gray-400">{timerStateText}</div>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;