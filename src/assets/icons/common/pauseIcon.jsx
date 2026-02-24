import React from "react";

export default function PauseIcon(props) {

    const {
        iconClass,
        iconWidth,
        iconHeight,
        iconColor,
        onClick } = props;

    return (
        <svg stroke={iconColor} fill={iconColor} onClick={onClick} strokeWidth="0" viewBox="0 0 448 512" className={iconClass} height={iconHeight} width={iconWidth}>
            <path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"></path>
        </svg>
    )
}