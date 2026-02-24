import React from "react";

export default function TrashIcon(props) {

    const {
        iconClass,
        iconWidth,
        iconHeight,
        iconColor } = props;

    return (
        <svg className={iconClass} width={iconWidth} height={iconHeight} viewBox="0 0 18.5 20.5">
            <g transform="translate(-5218.25 -1355.25)">
                <path d="M9.171,4a3,3,0,0,1,5.659,0" transform="translate(5215.5 1354)" fill="none" stroke={iconColor} strokeLinecap="round" strokeWidth="1.5"/>
                <path d="M20.5,6H3.5" transform="translate(5215.5 1354)" fill="none" stroke={iconColor} strokeLinecap="round" strokeWidth="1.5"/>
                <path d="M18.374,15.4c-.177,2.655-.266,3.982-1.131,4.792s-2.2.809-4.856.809h-.773c-2.661,0-3.991,0-4.856-.809S5.8,18.054,5.627,15.4l-.46-6.9m13.667,0-.2,3" transform="translate(5215.5 1354)" fill="none" stroke={iconColor} strokeLinecap="round" strokeWidth="1.5"/>
                <path d="M9.5,11l.5,5" transform="translate(5215.5 1354)" fill="none" stroke={iconColor} strokeLinecap="round" strokeWidth="1.5"/>
                <path d="M14.5,11,14,16" transform="translate(5215.5 1354)" fill="none" stroke={iconColor} strokeLinecap="round" strokeWidth="1.5"/>
            </g>
        </svg>
    )
}