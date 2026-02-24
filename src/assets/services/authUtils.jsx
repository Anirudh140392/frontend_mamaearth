import axios from 'axios';
import { useNavigate } from 'react-router-dom';
let BASE_URL = 'https://react-api-script.onrender.com';


export const userLogin = async ({userName, password, setNotification}) => {
    const token = await axios.get(`${BASE_URL}/csrfToken/`).then(res => res.data);
    await axios
        .post(`${BASE_URL}/login/`, {
            ...token,
            username: userName,
            password: password,
        })
        .then(res => {
            setNotification('You are successfully login', 'success');
            window.location.href = "/";
        })
        .catch();
}

export const userSignup = async ({ firstName, lastName, userName, password, setNotification, navigate }) => {
    try {
        await axios.post(`https://react-api-script.onrender.com/app/register/`, {
            first_name: firstName,
            last_name: lastName,
            username: userName,
            password: password,
            confirm_password: password
        });

        // Show success notification
        setNotification("Signup successful! Please log in.", "success");

        // Redirect to login page
        const navigate=useNavigate()
        navigate("/login");

    } catch (error) {
        console.error("Signup failed:", error);
        setNotification("Signup failed. Please try again.", "error");
    }
};