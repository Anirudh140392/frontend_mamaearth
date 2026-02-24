import React, { useState, useEffect } from "react";
import AuthContext from "./authContext";

const AuthState = (props) => {

    const [username, setUsername] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        if (username) {
            localStorage.setItem("username", username);
        } else {
            localStorage.removeItem("username");
        }
    }, [username]);

    const setUser = (name) => {
        setUsername(name);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setUsername("");
        setIsLoggedIn(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
    };

    return (
        <AuthContext.Provider value={{ username, setUser, isLoggedIn, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthState;