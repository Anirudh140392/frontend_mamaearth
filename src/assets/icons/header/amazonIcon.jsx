import React from "react";

export default function AmazonIcon(props) {

    const {
        iconClass,
        iconWidth,
        iconHeight,
        iconColor } = props;

    return (
        <svg width={iconWidth} height={iconHeight} className={iconClass} viewBox="0 0 30 21">
            <path d="M7.5,78.3A1.5,1.5,0,0,1,9,76.8H28.5a1.5,1.5,0,0,1,0,3H9A1.5,1.5,0,0,1,7.5,78.3Zm21,7.5H1.5a1.5,1.5,0,0,0,0,3h27a1.5,1.5,0,0,0,0-3Zm0,9H15a1.5,1.5,0,1,0,0,3H28.5a1.5,1.5,0,0,0,0-3Z" transform="translate(0 -76.8)" fill={iconColor} />
        </svg>
    )
}