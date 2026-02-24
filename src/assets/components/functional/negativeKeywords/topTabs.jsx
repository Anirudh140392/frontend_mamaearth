import React from "react";
import { NEGATIVETABS } from "../../../lib/constant";

const TabList = ({ setValue, showActiveTab, setShowActiveTab, tabText }) => {
    return (
        <li className={showActiveTab === setValue ? 'active' : ''}
            onClick={() => setShowActiveTab(setValue)}>
            {tabText}
        </li>
    )
}

const TopTabs = (props) => {

    const { setShowActiveTab,
        showActiveTab,
        operatorName } = props;

    return (
        <React.Fragment>
            <div className="top-tabs-con">

                <ul>
                    {['Amazon','Zepto','Blinkit','Swiggy','Flipkart'].includes(operatorName) && <TabList
                        isShowCount={false}
                        tabText="Suggested Keywords"
                        showActiveTab={showActiveTab}
                        setShowActiveTab={setShowActiveTab}
                        setValue={NEGATIVETABS.SUGGESTED} />
                    }
                    {['Amazon'].includes(operatorName) &&
                        <TabList
                            isShowCount={true}
                            tabText="Exisiting Keywords"
                            showActiveTab={showActiveTab}
                            setShowActiveTab={setShowActiveTab}
                            setValue={NEGATIVETABS.EXISTING} />
                    }
                </ul>
            </div>
        </React.Fragment>
    )
}

export default TopTabs;