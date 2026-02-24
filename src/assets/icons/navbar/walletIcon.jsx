import React from "react";

const WalletIcon = (props) => {

    const {iconClass,
        iconWidth,
        iconHeight,
        iconColor} = props;

    return(
        <svg className={iconClass} stroke={iconColor} fill={iconColor} strokeWidth="0" viewBox="0 0 512 512" height={iconHeight} width={iconWidth}>
            <rect width="416" height="288" x="48" y="144" fill="none" strokeLinejoin="round" strokeWidth="32" rx="48" ry="48"></rect><path fill="none" strokeLinejoin="round" strokeWidth="32" d="M411.36 144v-30A50 50 0 00352 64.9L88.64 109.85A50 50 0 0048 159v49"></path><path d="M368 320a32 32 0 1132-32 32 32 0 01-32 32z"></path>
        </svg>
    )
}

export default WalletIcon;