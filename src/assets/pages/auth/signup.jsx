import React, {useState} from "react";
import { Link } from "react-router";
import Notification from "../../components/common/notificationComponent";
import AuthFieldComponent from "../../components/functional/auth/authFieldComponent";
import '../../styles/auth/auth.less';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const defaultValue = {
    firstName: '',
    lastName: '',
    userName: '',
    password: ''
}

const Signup = () => {
    const navigate=useNavigate()
    const url="https://react-api-script.onrender.com"
    const [authDetail, setAuthDetail] = useState(defaultValue);
    const [notificationMessageType, setNotificationMessageType] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const setNotification = (message = '', type = 'success') => {
		setNotificationMessage(message);
		setNotificationMessageType(type);
	}

    const [showError, setShowError] = useState({
        firstNameError: false,
        firstNameErrorMessage: '',
        lastNameError: false,
        lastNameErrorMessage: '',
        userNameError: false,
        userNameErrorMessage: '',
        passwordError: false,
        passwordErrorMessage: ''
    });

    const signUp = async (e) => {
        e.preventDefault();
        if(authDetail.firstName === '' || authDetail.firstName === undefined){
            setShowError({
                firstNameError: true,
                firstNameErrorMessage: 'FirstName should not be blank'
            })
        }else if(authDetail.lastName === '' || authDetail.lastName === undefined){
            setShowError({
                lastNameError: true,
                lastNameErrorMessage: 'LastName should not be blank'
            })
        }else if(authDetail.userName === '' || authDetail.userName === undefined){
            setShowError({
                userNameError: true,
                userNameErrorMessage: 'UserName should not be blank'
            })
        }else if(authDetail.password === '' || authDetail.password === undefined){
            setShowError({
                passwordError: true,
                passwordErrorMessage: 'Password should not be blank'
            })
        }else{
            setShowError({
                firstNameError: false,
                firstNameErrorMessage: '',
                lastNameError: false,
                lastNameErrorMessage: '',
                userNameError: false,
                userNameErrorMessage: '',
                passwordError: false,
                passwordErrorMessage: ''
            })
            userSignup(authDetail.firstName, authDetail.lastName,authDetail.userName, authDetail.password,setNotification)
        }
    }

    const userSignup = async (firstName, lastName, userName, password, setNotification) => {
        try {
            await axios.post(`${url}/app/register`, {
                first_name: firstName,
                last_name: lastName,
                username: userName,
                password: password,
                confirm_password: password
            });
            setNotification("Signup successful! Please log in.", "success");
            navigate("/login");
    
        } catch (error) {
            setNotification(error.message, "error");
        }
    };

    return(
        <React.Fragment>
            <Notification
                message={notificationMessage}
				messageType={notificationMessageType}
				clearMessage={setNotification} />
            <div className="login-main-container">
                <div className="text-center mb-3">
                    <img src="../images/logo.png" width="200" className="img-fluid" />
                </div>
                <div className="login-container">
                    <h2 className="text-center">Signup</h2>
                    <form>
                        {/* First Name */}
                        <div className="form-group">
                            <AuthFieldComponent
                                formGroupClass={''}
                                isFieldLabelRequired={true}
                                fieldLabelClass={"h4"}
                                showError={showError}
                                fieldLabelText="First Name"
                                fieldPlaceholder="Type your firstname"
                                fieldType="text"
                                fieldClass={`auth-input ${showError.firstNameError ? 'error' : ''}`}
                                areaLabel="user-name"
                                fieldValue={authDetail.firstName}
                                onChange={(e) => setAuthDetail({...authDetail, firstName: e.target.value})} />
                            {showError.firstNameError &&
                                <span className="field-error-message">{showError.firstNameErrorMessage}</span>
                            }
                        </div>

                        {/* Last Name */}
                        <div className="form-group">
                            <AuthFieldComponent
                                formGroupClass={''}
                                isFieldLabelRequired={true}
                                fieldLabelClass={"h4"}
                                showError={showError}
                                fieldLabelText="Last Name"
                                fieldPlaceholder="Type your lastname"
                                fieldType="text"
                                fieldClass={`auth-input ${showError.lastNameError ? 'error' : ''}`}
                                areaLabel="user-name"
                                fieldValue={authDetail.lastName}
                                onChange={(e) => setAuthDetail({...authDetail, lastName: e.target.value})} />
                            {showError.lastNameError &&
                                <span className="field-error-message">{showError.lastNameErrorMessage}</span>
                            }
                        </div>

                        {/* User Name */}
                        <div className="form-group">
                            <AuthFieldComponent
                                formGroupClass={''}
                                isFieldLabelRequired={true}
                                fieldLabelClass={"h4"}
                                showError={showError}
                                fieldLabelText="User Name"
                                fieldPlaceholder="Type your username"
                                fieldType="text"
                                fieldClass={`auth-input ${showError.userNameError ? 'error' : ''}`}
                                areaLabel="user-name"
                                fieldValue={authDetail.userName}
                                onChange={(e) => setAuthDetail({...authDetail, userName: e.target.value})} />
                            {showError.userNameError &&
                                <span className="field-error-message">{showError.userNameErrorMessage}</span>
                            }
                        </div>

                        {/* Password */}
                        <div className="form-group mb-0">
                            <AuthFieldComponent
                                formGroupClass={'mb-0'}
                                isFieldLabelRequired={true}
                                fieldLabelClass={"h4"}
                                fieldLabelText="Password"
                                fieldType="password"
                                fieldPlaceholder="Type your password"
                                fieldClass={`auth-input mb-0 ${showError.passwordError ? 'error' : ''}`}
                                areaLabel="user-name"
                                fieldValue={authDetail.password}
                                onChange={(e) => setAuthDetail({...authDetail, password: e.target.value})} />
                            {showError.passwordError &&
                                <span className="field-error-message">{showError.passwordErrorMessage}</span>
                            }
                        </div>

                        <button className="auth-button mb-3"
                            onClick={signUp}>SINGUP</button>
                        <p className="small">
                            Already have an account? <Link to="/login">Login</Link>.
                        </p>
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Signup;