import React, { useState, useContext } from "react";
import AuthFieldComponent from "../../components/functional/auth/authFieldComponent";
import "../../styles/auth/auth.less";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import authContext from "../../../store/auth/authContext";
import { CircularProgress, Snackbar, Alert } from "@mui/material";

const defaultValue = {
    userName: "",
    password: "",
};

const Login = () => {
    const authCtx = useContext(authContext);
    const { setUser } = authCtx;
    const [authDetail, setAuthDetail] = useState(defaultValue);
    const url = "https://react-api-script.onrender.com";
    const navigate = useNavigate();
    const [showError, setShowError] = useState({
        userNameError: false,
        userNameErrorMessage: "",
        passwordError: false,
        passwordErrorMessage: "",
    });
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const userLogin = async (userName, password) => {
        setIsLoggingIn(true);

        try {
            const res = await axios.post(`${url}/mamaearth/login`, {
                username: userName,
                password: password,
            });

            const { access } = res.data.token;
            const name = res.data.username || userName;
            setUser(name);
            // Persist immediately so Navbar fallback can read it on first render
            localStorage.setItem("username", name);
            localStorage.setItem("accessToken", access);
            navigate("/?operator=Flipkart");
        } catch (error) {
            handleSnackbarOpen("Failed to login.", "error");
        } finally {
            setIsLoggingIn(false);
        }
    };

    const signIn = async (e) => {
        e.preventDefault();
        if (authDetail.userName === "" || authDetail.userName === undefined) {
            setShowError({
                userNameError: true,
                userNameErrorMessage: "UserName should not be blank",
            });
        } else if (
            authDetail.password === "" ||
            authDetail.password === undefined
        ) {
            setShowError({
                passwordError: true,
                passwordErrorMessage: "Password should not be blank",
            });
        } else {
            setShowError({
                userNameError: false,
                userNameErrorMessage: "",
                passwordError: false,
                passwordErrorMessage: "",
            });
            userLogin(authDetail.userName, authDetail.password);
        }
    };

    const handleSnackbarOpen = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <React.Fragment>
            <div className="login-main-container">
                <div className="text-center mb-3">
                    <img src="../images/logo.png" width="200" className="img-fluid" />
                </div>
                <div className="login-container">
                    <h2 className="text-center">Login</h2>
                    <form>
                        {/* User Name */}
                        <div className="form-group">
                            <AuthFieldComponent
                                formGroupClass={""}
                                isFieldLabelRequired={true}
                                fieldLabelClass={"h4"}
                                showError={showError}
                                fieldLabelText="User Name"
                                fieldPlaceholder="Type your username"
                                fieldType="text"
                                fieldClass={`auth-input ${showError.userNameError ? "error" : ""
                                    }`}
                                areaLabel="user-name"
                                fieldValue={authDetail.userName}
                                onChange={(e) =>
                                    setAuthDetail({ ...authDetail, userName: e.target.value })
                                }
                            />
                            {showError.userNameError && (
                                <span className="field-error-message">
                                    {showError.userNameErrorMessage}
                                </span>
                            )}
                        </div>

                        {/* Password */}
                        <div className="form-group mb-0">
                            <AuthFieldComponent
                                formGroupClass={"mb-0"}
                                isFieldLabelRequired={true}
                                fieldLabelClass={"h4"}
                                fieldLabelText="Password"
                                fieldType="password"
                                fieldPlaceholder="Type your password"
                                fieldClass={`auth-input mb-0 ${showError.passwordError ? "error" : ""
                                    }`}
                                areaLabel="user-name"
                                fieldValue={authDetail.password}
                                onChange={(e) =>
                                    setAuthDetail({ ...authDetail, password: e.target.value })
                                }
                            />
                            {showError.passwordError && (
                                <span className="field-error-message">
                                    {showError.passwordErrorMessage}
                                </span>
                            )}
                        </div>
                        {/*<div className="text-end">
                            <Link to="/forgot-password" className="redirect-text">
                                Forgot Password
                            </Link>
                        </div>*/}
                        <button className="auth-button mb-3" onClick={signIn}>
                            {isLoggingIn ? (
                                <CircularProgress size={"16px"} sx={{ color: "#000000" }} />
                            ) : (
                                "LOGIN"
                            )}
                        </button>
                        {/*<p className="small">
                            Not a registered user? <Link to="/signup">Sign Up</Link>.
                        </p>*/}
                    </form>
                </div>
            </div>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
};

export default Login;
