import React from "react";

export default function  KeyIcon(props) {

    const {iconClass,
        iconWidth,
        iconHeight,
        iconColor} = props;

    return(
        <svg className={iconClass} height={iconHeight} width={iconWidth} viewBox="0 0 15.819 15.819">
            <path d="M13.447,1.928A4.947,4.947,0,0,0,8.586,7.777L2.571,13.793v2.966a.989.989,0,0,0,.989.989h.989v-.989H6.526V14.781H8.5V12.8H10.48l1.283-1.283a4.944,4.944,0,1,0,1.683-9.593Zm1.481,4.946A1.483,1.483,0,1,1,16.411,5.39,1.483,1.483,0,0,1,14.928,6.874Z" transform="translate(-2.571 -1.928)" fill={iconColor}></path>
        </svg>
    )
}