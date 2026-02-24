import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import ErrorBoundary from "../../../common/erroBoundryComponent";
import AddRuleCreator from "../addRuleCreator";

const EditRuleModal = (props) => {

    const { showEditRuleModal,
        setShowEditRuleModal, editRuleData, getRulesData } = props;
    return (
        <Modal show={showEditRuleModal} onHide={() => setShowEditRuleModal(false)} size="md">
            <Modal.Header className="border-bottom" closeButton>
                <Modal.Title className="text-dark">
                    Edit Rule
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="create-rule-con">
                <ErrorBoundary>
                    <AddRuleCreator
                        getRulesData={getRulesData}
                        setShowRuleModal={setShowEditRuleModal}
                        showRuleModal={showEditRuleModal} editRuleData={editRuleData} />
                </ErrorBoundary>
            </Modal.Body>
        </Modal>
    )
}

export default EditRuleModal;
