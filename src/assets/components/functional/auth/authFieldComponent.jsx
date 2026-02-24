import React, {useState} from "react";
import AvatarIcon from "../../../icons/navbar/avatarIcon";
import CloseEyeIcon from "../../../icons/auth/closeEyeIcon";
import KeyIcon from "../../../icons/auth/keyIcon";
import OpenEyeIcon from "../../../icons/auth/openEyeIcon";

const AuthFieldComponent = (props) => {
    const {isFieldLabelRequired,
        fieldLabelText,
        fieldType,
        fieldClass,
        areaLabel,
        fieldPlaceholder,
        fieldValue,
        onChange,} = props;
    
    const [showPassword, setShowPassword] = useState(false);
    
    return(
        <React.Fragment>
            <>
                {isFieldLabelRequired &&
                    <label className="">{fieldLabelText}</label>
                }
                <div className="position-relative">
                    {fieldLabelText === 'User Name' || 
                    fieldLabelText === 'First Name' ||
                    fieldLabelText === 'Last Name' ?
                        <AvatarIcon
                            iconClass="left-auth-icon"
                            iconWidth="15"
                            iconHeight="15"
                            iconColor="#8d8d8d" /> : 
                    fieldLabelText === 'Password' ? 
                        <KeyIcon
                            iconClass="left-auth-icon"
                            iconWidth="15"
                            iconHeight="15"
                            iconColor="#8d8d8d" /> : ''
                    }
                    <input type={fieldType !== 'password' ? fieldType : 
                        !showPassword ? 'password' : 'text'}
                        className={fieldClass}
                        aria-label={areaLabel}
                        value={fieldValue}
                        placeholder={fieldPlaceholder}
                        onChange={onChange} />
                    {fieldLabelText === 'Password' && (
                        <span className="right-auth-icon"
                            onClick={() => setShowPassword(!showPassword)}>
                            <span className="position-absolute top-0 start-0 end-0 bottom-0 zIndex1"></span>
                            {!showPassword ? 
                            <CloseEyeIcon
                                iconClass="cursor-pointer"
                                iconWidth="15"
                                iconHeight="15"
                                iconColor="#8d8d8d" /> : 
                            <OpenEyeIcon
                                iconClass="cursor-pointer"
                                iconWidth="15"
                                iconHeight="15"
                                iconColor="#8d8d8d" /> }
                        </span>
                    )}
                    
                </div>
            </>
        </React.Fragment>
    )
}

export default AuthFieldComponent