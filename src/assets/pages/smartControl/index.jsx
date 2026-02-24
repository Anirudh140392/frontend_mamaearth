import React, { useEffect, useState } from "react";
import ErrorBoundary from "../../components/common/erroBoundryComponent";
import NewRuleModal from "../../components/functional/smartControl/modal/newRuleModal";
import SmartControlDatatable from "../../components/functional/smartControl/smartControlDatatable";
import '../../styles/smartControl/smartControl.less';
import { useNavigate } from "react-router-dom";

const SmartControl = () => {

    const [showRuleModal, setShowRuleModal] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login")
            window.location.reload()
        }
    })
    return (
        <React.Fragment>
            <NewRuleModal
                showRuleModal={showRuleModal}
                setShowRuleModal={setShowRuleModal} />
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <ErrorBoundary>
                            <SmartControlDatatable />
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default SmartControl;