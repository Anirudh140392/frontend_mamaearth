import React from "react";

const WatchTowerIcon = (props) => {
  const { iconClass, iconWidth, iconHeight, iconColor } = props;

  return (
    <svg
      className={`bi bi-watchtower ${iconClass}`}
      width={iconWidth}
      height={iconHeight}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="10"
        y="10"
        width="4"
        height="10"
        rx="1"
        fill={iconColor}
      />
      <polygon
        points="12,3 7,10 17,10"
        fill={iconColor}
      />
      <path
        d="M18 10c2 2 2 6 0 8M20 7c3 3 3 9 0 12"
        stroke={iconColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default WatchTowerIcon;
