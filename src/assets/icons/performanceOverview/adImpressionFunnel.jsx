import React from "react";

const AdImpressionFunnel = (props) => {

    const {iconClass,
        iconWidth,
        iconHeight,
        callback} = props;

    return(
        <svg className={iconClass} height={iconHeight} width={iconWidth} viewBox="350 500 2096 2096">
            <g transform="translate(44.514 218.216)" className="clickable active anim"
                onClick={() => callback('Impressions')}>
                <path fillRule="nonzero" fill="rgb(184, 172, 212)" fillOpacity="1" d="M 724.320312 334.949219 L 859.058594 696.359375 L 859.066406 696.359375 C 859.066406 723.578125 1100.359375 745.648438 1398 745.648438 C 1695.648438 745.648438 1936.941406 723.578125 1936.941406 696.359375 L 2071.679688 334.949219 L 724.320312 334.949219 "></path>
                <path fillRule="nonzero" fill="rgba(55, 28, 75)" fillOpacity="1" d="M 2071.679688 334.949219 C 2071.679688 368.980469 1770.070312 396.558594 1398 396.558594 C 1025.941406 396.558594 724.328125 368.980469 724.328125 334.949219 C 724.328125 300.921875 1025.941406 273.339844 1398 273.339844 C 1770.070312 273.339844 2071.679688 300.921875 2071.679688 334.949219 "></path>
                <text textAnchor="middle" x="1400" y="500" fill="#222" fontSize="80" fontFamily="Noto Sans, sans-serif">
                    Impressions
                </text>
                <text textAnchor="middle" x="1400" y="600" fill="#222" fontSize="80" fontFamily="Noto Sans, sans-serif">6.28M
                </text>
            </g>
            <g transform="translate(44.514 218.216)" className="clickable active anim"
                onClick={() => callback('Clicks')}>
                <path fillRule="nonzero" fill="rgb(209, 206, 237)" fillOpacity="1" d="M 1128.53125 1725.480469 L 1263.269531 2086.878906 C 1263.269531 2093.691406 1323.589844 2099.210938 1398 2099.210938 C 1472.410156 2099.210938 1532.738281 2093.691406 1532.738281 2086.878906 L 1667.480469 1725.480469 L 1128.53125 1725.480469 "></path>
                <path fillRule="nonzero" fill="rgb(55, 28, 75)" fillOpacity="1" d="M 1667.480469 1725.480469 C 1667.480469 1739.089844 1546.828125 1750.121094 1398 1750.121094 C 1249.179688 1750.121094 1128.53125 1739.089844 1128.53125 1725.480469 C 1128.53125 1711.859375 1249.179688 1700.828125 1398 1700.828125 C 1546.828125 1700.828125 1667.480469 1711.859375 1667.480469 1725.480469 "></path>
                <text textAnchor="middle" x="1400" y="1830" fill="#222" fontSize="70" fontFamily="Noto Sans, sans-serif">
                    Clicks
                </text>
                <text textAnchor="middle" x="1400" y="1930" fill="#222" fontSize="70" fontFamily="Noto Sans, sans-serif">29.2K
                </text>
            </g>
            <g transform="translate(44.514 218.216)" className="clickable active anim"
                onClick={() => callback('AdSpends')}>
                <path fillRule="nonzero" fill="rgb(217, 213, 246)" fillOpacity="1" d="M 993.792969 1286.609375 L 1128.53125 1648.019531 C 1128.53125 1661.628906 1249.179688 1672.660156 1398 1672.660156 C 1546.828125 1672.660156 1667.480469 1661.628906 1667.480469 1648.019531 L 1802.210938 1286.609375 L 993.792969 1286.609375 "></path>
                <path fillRule="nonzero" fill="rgb(55, 28, 75)" fillOpacity="1" d="M 1802.210938 1286.609375 C 1802.210938 1307.03125 1621.238281 1323.578125 1398 1323.578125 C 1174.769531 1323.578125 993.800781 1307.03125 993.800781 1286.609375 C 993.800781 1266.191406 1174.769531 1249.640625 1398 1249.640625 C 1621.238281 1249.640625 1802.210938 1266.191406 1802.210938 1286.609375 "></path>
                <text textAnchor="middle" x="1400" y="1410" fill="#222" fontSize="60" fontFamily="Noto Sans, sans-serif">
                    Ad Spends
                </text>
                <text textAnchor="middle" x="1400" y="1510" fill="#222" fontSize="60" fontFamily="Noto Sans, sans-serif">660K
                </text>
            </g>
            <g transform="translate(44.514 218.216)" className="clickable active anim"
                onClick={() => callback('AdSales')}>
                <path fillRule="nonzero" fill="rgb(225, 222, 253)" fillOpacity="1" d="M 859.058594 823.109375 L 993.792969 1184.511719 L 993.800781 1184.511719 C 993.800781 1204.921875 1174.769531 1221.46875 1398 1221.46875 C 1621.238281 1221.46875 1802.210938 1204.921875 1802.210938 1184.511719 L 1936.941406 823.109375 L 859.058594 823.109375 "></path>
                <path fillRule="nonzero" fill="rgb(55, 28, 75)" fillOpacity="1" d="M 1936.941406 823.109375 C 1936.941406 850.328125 1695.648438 872.390625 1398 872.390625 C 1100.359375 872.390625 859.066406 850.328125 859.066406 823.109375 C 859.066406 795.878906 1100.359375 773.820312 1398 773.820312 C 1695.648438 773.820312 1936.941406 795.878906 1936.941406 823.109375 "></path>
                <text textAnchor="middle" x="1400" y="970" fill="#222" fontSize="70" fontFamily="Noto Sans, sans-serif">
                    Ad Sales
                </text>
                <text textAnchor="middle" x="1400" y="1070" fill="#222" fontSize="70" fontFamily="Noto Sans, sans-serif">1.46M
                </text>
            </g>  
            <g transform="translate(44.514 218.216)" className="clickable active anim"
                onClick={() => callback('Orders')}>
                <path fillRule="nonzero" fill="rgb(237, 234, 255)" fillOpacity="1" d="M 1532.738281 2139.699219 L 1398 2501.101562 L 1263.269531 2139.699219 Z M 1532.738281 2139.699219 "></path>
                <path fillRule="nonzero" fill="rgb(55, 28, 75)" fillOpacity="1" d="M 1532.738281 2139.699219 C 1532.738281 2146.5 1472.410156 2152.019531 1398 2152.019531 C 1323.589844 2152.019531 1263.269531 2146.5 1263.269531 2139.699219 C 1263.269531 2132.890625 1323.589844 2127.371094 1398 2127.371094 C 1472.410156 2127.371094 1532.738281 2132.890625 1532.738281 2139.699219 "></path>
                <text textAnchor="middle" x="1400" y="2250" fill="#222" fontSize="50" fontFamily="Noto Sans, sans-serif">
                    Orders
                </text>
                <text textAnchor="middle" x="1400" y="2350" fill="#222" fontSize="50" fontFamily="Noto Sans, sans-serif">4.58K
                </text>
            </g>    
        </svg>
    )
}

export default AdImpressionFunnel;