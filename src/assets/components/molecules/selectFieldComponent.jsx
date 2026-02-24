import React from "react";

const SelectFieldComponent = (props) => {

    const { isFieldLabelRequired,
        fieldLabelClass,
        fieldLabelText,
        fieldClass,
        areaLabel,
        isDisabled,
        onChange,
        options,
        selectLabel,
        value
    } = props;

    return (
        <React.Fragment>
            {isFieldLabelRequired &&
                <label className={fieldLabelClass}>{fieldLabelText}</label>
            }
            <select className={fieldClass}
                aria-label={areaLabel}
                disabled={isDisabled}
                onChange={onChange}
                value={value}
            >
                <option disabled={false} value=''>{selectLabel ? selectLabel : 'Select'}</option>
                {options.map((option, idx) => {
                    return (
                        <option key={idx} value={option.value}>{option.label}</option>
                    )
                })}
            </select>
        </React.Fragment>
    )
}

export default SelectFieldComponent;