import React from "react";

const TextFieldComponent = (props) => {

    const {isFieldLabelRequired,
        fieldLabelClass,
        fieldLabelText,
        fieldType,
        fieldClass,
        areaLabel,
        fieldValue,
        fieldPlaceholder,
        onChange} = props

    return(
        <React.Fragment>
            {isFieldLabelRequired &&
                <label className={fieldLabelClass}>{fieldLabelText}</label>
            }
            <input type={fieldType}
                className={fieldClass}
                aria-label={areaLabel}
                placeholder={fieldPlaceholder}
                value={fieldValue}
                onChange={onChange} />
        </React.Fragment>
    )
}

export default TextFieldComponent;