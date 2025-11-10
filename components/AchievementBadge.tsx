import React from 'react';

interface AchievementBadgeProps {
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  name,
  description,
  icon,
  isUnlocked,
}) => {
  const badgeClasses = isUnlocked
    ? 'bg-gradient-to-br from-amber-500 to-amber-700 achievement-badge'
    : 'bg-gradient-to-br from-gray-500 to-gray-700 opacity-50';

  const iconBgClasses = isUnlocked
    ? 'bg-amber-400'
    : 'bg-gray-400';

  return (
    <div className={`${badgeClasses} p-3 rounded-lg flex items-center`}>
      <div className={`w-10 h-10 rounded-full ${iconBgClasses} flex items-center justify-center mr-3`}>
        <i className={`${icon} text-white`}></i>
      </div>
      <div>
        <div className="font-bold">{name}</div>
        <div className="text-xs">{description}</div>
      </div>
    </div>
  );
};

export default AchievementBadge;