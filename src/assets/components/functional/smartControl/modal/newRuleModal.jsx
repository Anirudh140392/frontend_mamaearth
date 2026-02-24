import React from "react";
import { Modal } from "react-bootstrap";
import ErrorBoundary from "../../../common/erroBoundryComponent";
import AddRuleCreator from "../addRuleCreator";

const NewRuleModal = (props) => {

    const {showRuleModal,
        setShowRuleModal} = props;

    return(
        <Modal show={showRuleModal} onHide={() => setShowRuleModal(false)} size="md">
            <Modal.Header className="border-bottom" closeButton>
                <Modal.Title className="text-dark">
                    Add a Rule
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="create-rule-con">
                <ErrorBoundary>
                    <AddRuleCreator
                        setShowRuleModal={setShowRuleModal}
                        showRuleModal={showRuleModal} />
                </ErrorBoundary>
            </Modal.Body>
        </Modal>
    )
}

export default NewRuleModal;