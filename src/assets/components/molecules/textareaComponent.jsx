import React from "react";

const TextAreaComponent = (props) => {

    const {isFieldLabelRequired,
        fieldLabelClass,
        fieldLabelText,
        fieldType,
        fieldClass,
        areaLabel,
        fieldValue,
        fieldPlaceholder,
        onChange,
        fieldRows} = props

    return(
        <React.Fragment>
            {isFieldLabelRequired &&
                <label className={fieldLabelClass}>{fieldLabelText}</label>
            }
            <textarea type={fieldType}
                className={fieldClass}
                aria-label={areaLabel}
                rows={fieldRows}
                placeholder={fieldPlaceholder}
                value={fieldValue}
                onChange={onChange}>
            </ textarea>
        </React.Fragment>
    )
}

export default TextAreaComponent;