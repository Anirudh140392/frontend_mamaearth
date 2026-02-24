import React from "react";

const AdImpressionImageIcon = (props) => {

    const {iconClass,
        iconWidth,
        iconHeight,
        callback} = props;

    return(
        <svg className={iconClass} width={iconWidth} height={iconHeight} viewBox="0 0 1846 651">
            <defs>
                <clipPath id="clip-Web_1920_1">
                    <rect width="1846" height="651"/>
                </clipPath>
            </defs>
            <g clip-path="url(#clip-Web_1920_1)">
                <rect width="1846" height="651" fill="#fff"/>
                <g transform="translate(-24 -201)">
                    <g transform="translate(44.514 218.216)" className="clickable"
                        onClick={() => callback('Impressions')}>
                        <path d="M-30,0H621L590.389,160H.611Z" className="rev-primary-color shape-primary" transform="translate(30)"/>
                        <g>
                            <text text-anchor="middle" transform="translate(325 60)" fill="#fff" fontSize="45" fontFamily="Noto Sans, sans-serif">
                                Impressions
                            </text>
                            <text text-anchor="middle" transform="translate(325 120)" fill="#fff" fontSize="38" fontFamily="Noto Sans, sans-serif">
                                0
                            </text>
                        </g>
                        <g transform="translate(500 50)">
                            <path d="M25,0,50,43H0Z" className="bigUpArrow" transform="rotate(90) translate(0 -35)"/>
                            <text text-anchor="middle" fill="#fff" fontSize="30" fontFamily="Noto Sans, sans-serif" transform="translate(30 80)">
                                0%
                            </text>
                        </g>
                    </g>
                    <g transform="translate(257 437)" className="clickable"
                        onClick={() => callback('Clicks')}>
                        <path d="M-30,0H621L590.389,160H.611Z" className="rev-primary-color shape-primary" transform="translate(30)"/>
                        <g>
                            <text text-anchor="middle" transform="translate(325 60)" fill="#fff" fontSize="45" fontFamily="Noto Sans, sans-serif">
                                Clicks
                            </text>
                            <text text-anchor="middle" id="click_value" transform="translate(325 120)" fill="#fff" fontSize="38" fontFamily="Noto Sans, sans-serif">
                                0
                            </text>
                        </g>
                        <g transform="translate(500 50)">
                            <path d="M25,0,50,43H0Z" className="bigDownArrow" transform="rotate(90) translate(0 -35)"/>
                            <text text-anchor="middle" fill="#fff" fontSize="30" fontFamily="Noto Sans, sans-serif" transform="translate(30 80)">
                                0%
                            </text>
                        </g>
                    </g>
                    <g transform="translate(529 652)" className="clickable"
                        onClick={() => callback('Orders')}>
                        <path d="M-30,0H415.407L394.463,160H-9.056Z" className="rev-primary-color shape-primary" transform="translate(30)"/>
                        <g transform="translate(220 60)">
                            <text text-anchor="middle" fill="#fff" fontSize="45" fontFamily="Noto Sans, sans-serif">
                                Orders
                            </text>
                            <text text-anchor="middle" transform="translate(0 60)" fill="#fff" fontSize="38" fontFamily="Noto Sans, sans-serif">
                                0
                            </text>
                        </g>
                        <g transform="translate(325 50)">
                            <path d="M25,0,50,43H0Z" className="bigUpArrow" transform="rotate(90) translate(0 -35)"/>
                            <text text-anchor="middle" fill="#fff" fontSize="30" fontFamily="Noto Sans, sans-serif" transform="translate(30 80)">
                                0%
                            </text>
                        </g>
                    </g>
                    <g transform="translate(1200 450)" className="clickable"
                        onClick={() => callback('AdSpends')}>
                        <rect width="525" height="140" rx="10" transform="translate(170 25)" className="rev-primary-color shape-primary"/>
                        <g transform="translate(420 80)">
                            <text text-anchor="middle" fill="#fff" fontSize="45" fontFamily="Noto Sans, sans-serif">
                                Ad Spends
                            </text>
                            <text text-anchor="middle" transform="translate(0 60)" fill="#fff" fontSize="38" fontFamily="Noto Sans, sans-serif">
                                0
                            </text>
                        </g>
                        <g transform="translate(575 70)">
                            <path d="M25,0,50,43H0Z" className="bigUpArrow" transform="rotate(90) translate(0 -35)"/>
                            <text text-anchor="middle" fill="#fff" fontSize="30" fontFamily="Noto Sans, sans-serif" transform="translate(30 80)">
                                0%
                            </text>
                        </g>
                    </g>
                    <g transform="translate(1200 625)" className="clickable"
                        onClick={() => callback('AdSales')}>
                        <rect width="525" height="140" rx="10" transform="translate(170 25)" className="rev-primary-color shape-primary"/>
                        <g transform="translate(420 80)">
                            <text text-anchor="middle" fill="#fff" fontSize="45" fontFamily="Noto Sans, sans-serif">
                                Ad Sales
                            </text>
                            <text text-anchor="middle" transform="translate(0 60)" fill="#fff" fontSize="38" fontFamily="Noto Sans, sans-serif">
                                0
                            </text>
                        </g>
                        <g transform="translate(575 70)">
                            <path d="M25,0,50,43H0Z" className="bigDownArrow" transform="rotate(90) translate(0 -35)"/>
                            <text text-anchor="middle" fill="#fff" fontSize="30" fontFamily="Noto Sans, sans-serif" transform="translate(30 80)">
                                0%
                            </text>
                        </g>
                    </g>
                    <g className="clickable-inverse" transform="translate(1517 81)"
                        onClick={() => callback('ACoS')}>
                        <g transform="translate(0 120)" fill="#fff" className="rev-primary-color-stroke shape-primary-inverse-stroke" strokeWidth="5">
                            <circle cx="98" cy="98" r="98" stroke="none"/>
                            <circle cx="98" cy="98" r="95.5" fill="none"/>
                        </g>
                        <g transform="translate(100 180)">
                            <text text-anchor="middle" fill="#0d0d0d" fontSize="30" fontFamily="Noto Sans, sans-serif">
                                ACoS
                            </text>
                            <text text-anchor="middle" fill="#0d0d0d" transform="translate(10 40)" fontSize="30" fontFamily="Noto Sans, sans-serif" fontWeight="700">
                                0%
                            </text>
                        </g>
                        <g transform="translate(85 230)">
                            <path transform="rotate(90) translate(0 -35)" className="smallUpArrow" d="M16.5,0,33,28H0Z"/>
                            <text text-anchor="middle" transform="translate(20 60)" fontSize="30" fontFamily="Noto Sans, sans-serif">
                                0%
                            </text>
                        </g>
                    </g>
                    <g className="clickable-inverse" transform="translate(250 520)"
                        onClick={() => callback('CVR')}>
                        <g transform="translate(0 120)" className="rev-primary-color-stroke shape-primary-inverse-stroke" fill="#fff" strokeWidth="5">
                            <circle cx="98" cy="98" r="98" stroke="none"/>
                            <circle cx="98" cy="98" r="95.5" fill="none"/>
                        </g>
                        <g transform="translate(100 180)">
                            <text text-anchor="middle" fill="#0d0d0d" fontSize="30" fontFamily="Noto Sans, sans-serif">
                                CVR
                            </text>
                            <text text-anchor="middle" fill="#0d0d0d" transform="translate(10 40)" fontSize="30" fontFamily="Noto Sans, sans-serif" fontWeight="700">
                                0%
                            </text>
                        </g>
                        <g transform="translate(85 230)">
                            <path d="M16.5,0,33,28H0Z" className="smallUpArrow" transform="rotate(90) translate(0 -35)"/>
                            <text text-anchor="middle" transform="translate(20 60)" fontSize="30" fontFamily="Noto Sans, sans-serif">
                                0%
                            </text>
                        </g>
                    </g>
                    <g className="clickable-inverse" transform="translate(25 310)"
                        onClick={() => callback('CTR')}>
                        <g transform="translate(0 120)" className="rev-primary-color-stroke shape-primary-inverse-stroke" fill="#fff" strokeWidth="5">
                            <circle cx="98" cy="98" r="98" stroke="none"/>
                            <circle cx="98" cy="98" r="95.5" fill="none"/>
                        </g>
                        <g transform="translate(100 180)">
                            <text text-anchor="middle" id="ctr" fill="#0d0d0d" fontSize="30" fontFamily="Noto Sans, sans-serif">
                                CTR
                            </text>
                            <text text-anchor="middle" fill="#0d0d0d" transform="translate(10 40)" fontSize="30" fontFamily="Noto Sans, sans-serif" fontWeight="700">
                                0%
                            </text>
                        </g>
                        <g transform="translate(85 230)">
                            <path d="M16.5,0,33,28H0Z" className="smallDownArrow" transform="rotate(90) translate(0 -35)"/>
                            <text text-anchor="middle" transform="translate(20 60)" fontSize="30" fontFamily="Noto Sans, sans-serif">
                                0%
                            </text>
                        </g>
                    </g>
                    <g className="clickable-inverse" transform="translate(1040 290)"
                        onClick={() => callback('CPC')}>
                        <g transform="translate(0 120)" fill="#fff" className="rev-primary-color-stroke shape-primary-inverse-stroke" strokeWidth="5">
                            <circle cx="98" cy="98" r="98" stroke="none"/>
                            <circle cx="98" cy="98" r="95.5" fill="none"/>
                        </g>
                        <g transform="translate(100 180)">
                            <text text-anchor="middle" fill="#0d0d0d" fontSize="30" fontFamily="Noto Sans, sans-serif">
                                CPC
                            </text>
                            <text text-anchor="middle" fill="#0d0d0d" transform="translate(0 40)" fontSize="30" fontFamily="Noto Sans, sans-serif" fontWeight="700">
                                0
                            </text>
                        </g>
                        <g transform="translate(85 230)">
                            <path d="M16.5,0,33,28H0Z" className="smallUpArrow" transform="rotate(90) translate(0 -35)"/>
                            <text text-anchor="middle" transform="translate(20 60)" fontSize="30" fontFamily="Noto Sans, sans-serif">
                                0%
                            </text>
                        </g>
                    </g>
                    <g className="clickable-inverse" transform="translate(1040 520)"
                        onClick={() => callback('AOV')}>
                        <g transform="translate(0 120)" fill="#fff" className="rev-primary-color-stroke shape-primary-inverse-stroke" strokeWidth="5">
                            <circle cx="98" cy="98" r="98" stroke="none"/>
                            <circle cx="98" cy="98" r="95.5" fill="none"/>
                        </g>
                        <g transform="translate(100 180)">
                            <text text-anchor="middle" fill="#0d0d0d" fontSize="30" fontFamily="Noto Sans, sans-serif">
                                AOV
                            </text>
                            <text text-anchor="middle" fill="#0d0d0d" transform="translate(0 40)" fontSize="30" fontFamily="Noto Sans, sans-serif" fontWeight="700">
                                0
                            </text>
                        </g>
                        <g transform="translate(85 230)">
                            <path d="M16.5,0,33,28H0Z" className="smallUpArrow" transform="rotate(90) translate(0 -35)"/>
                            <text text-anchor="middle" transform="translate(20 60)" fontSize="30" fontFamily="Noto Sans, sans-serif">
                                0%
                            </text>
                        </g>
                    </g>
                    <rect width="4" height="57" transform="translate(118 375)" className="rev-primary-color"/>
                    <rect width="4" height="50" transform="translate(347 595)" className="rev-primary-color"/>
                    <rect width="5" height="63" transform="translate(277 502) rotate(90)" className="rev-primary-color"/>
                    <rect width="5" height="100" transform="translate(540 727) rotate(90)" className="rev-primary-color"/>
                    <rect width="4" height="147" transform="translate(1038 508) rotate(90)" className="rev-primary-color"/>
                    <rect width="4" height="144" transform="translate(1378 528) rotate(90)" className="rev-primary-color"/>
                    <rect width="5" height="80" transform="translate(1045 718) rotate(90)" className="rev-primary-color"/>
                    <rect width="4" height="144" transform="translate(1378 718) rotate(90)" className="rev-primary-color"/>
                    <g transform="translate(31 68.854)">
                        <rect width="65" height="11" transform="translate(1552 349.146)"/>
                        <rect width="65" height="12" transform="translate(1552 368.146)"/>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export default AdImpressionImageIcon;