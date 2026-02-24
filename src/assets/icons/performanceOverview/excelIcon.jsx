import React from "react";

const ExcelIcon = (props) => {

    const {iconClass,
        iconWidth,
        iconHeight,
        iconColor} = props;

    return(
        <svg width={iconWidth} height={iconHeight} className={iconClass} viewBox="0 0 25 31">
            <g>
                <g transform="translate(7.468 13.452)">
                    <path d="M58.065,72.488h-2.61L52.938,68.4l-2.516,4.089H48l3.585-5.567L48.22,61.7h2.516l2.327,3.869L55.328,61.7h2.453l-3.4,5.347Z" transform="translate(-48 -61.7)" fill={iconColor ? iconColor : "#007732"} />
                </g>
                <g transform="translate(0 0)">
                    <path d="M36.5,33h-20A2.507,2.507,0,0,1,14,30.5V4.5A2.507,2.507,0,0,1,16.5,2H26.675a2.474,2.474,0,0,1,1.775.725l9.825,9.825A2.474,2.474,0,0,1,39,14.325V30.5A2.507,2.507,0,0,1,36.5,33ZM16.5,3A1.5,1.5,0,0,0,15,4.5v26A1.5,1.5,0,0,0,16.5,32h20A1.5,1.5,0,0,0,38,30.5V14.325a1.4,1.4,0,0,0-.45-1.05L27.725,3.45A1.4,1.4,0,0,0,26.675,3Z" transform="translate(-14 -2)" fill={iconColor ? iconColor : "#007732"} />
                </g>
            </g>
        </svg>
    )
}

export default ExcelIcon;