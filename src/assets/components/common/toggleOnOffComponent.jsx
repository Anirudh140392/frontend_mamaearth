import React from "react";
import DataTable from "react-data-table-component";

const ToggleOnOffComponent = (props) => {

    const {onChange,
        statusToggle} = props;

    return(
        <React.Fragment>
            <span className={`toggle-onoff-button ${statusToggle ? 'on' : 'off'}`}>
                <input type="checkbox" 
                    className="toggle-checkbox"
                    onChange={onChange} />
                <span className={`toggle-on-btn ${statusToggle ? 'on' : 'off'}`}></span>
            </span>
        </React.Fragment>
    )
}

export default ToggleOnOffComponent;