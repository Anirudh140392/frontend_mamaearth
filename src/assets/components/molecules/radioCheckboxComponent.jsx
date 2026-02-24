import React from "react";

const RadioCheckboxComponent = (props) => {
    const {labelClass,
        fieldType,
        fieldLabel,
        fieldName,
        fieldValue,
        ariaLabel,
        fieldChecked,
        onChange} = props;
    return(
        <React.Fragment>
            <label className={labelClass}>
                <input type={fieldType} 
                    className="me-2 checkbox-align" 
                    name={fieldName}
                    aria-label={ariaLabel}
                    value={fieldValue}
                    checked={fieldChecked}
                    onChange={onChange} /> {fieldLabel}
            </label>
        </React.Fragment>
    )
}

export default RadioCheckboxComponent;