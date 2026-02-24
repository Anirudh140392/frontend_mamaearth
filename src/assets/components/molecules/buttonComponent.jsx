import React from "react";

const ButtonComponent = (props) => {

    const {buttonClass,
        buttonLabel,
        onClick} = props

    return(
        <React.Fragment>
            <button className={buttonClass}
                onClick={onClick}>
                {buttonLabel}
            </button>
        </React.Fragment>
    )
}

export default ButtonComponent;