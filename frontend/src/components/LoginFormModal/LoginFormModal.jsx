import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password })).then(closeModal)
        // .catch(async (res) => {
            // const data = await res.json();
            // console.log(data)
            // if (data && data.errors) setErrors(data.errors);
        .catch(async () => {
            setErrors({ credential: "The provided credentials were invalid"})
        });
    };
    
    useEffect(() => {
        setErrors({});
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
            (!emailRegex.test(credential) && credential.length < 4) 
            || password.length < 6
           ) 
        {
            setErrors({ credential: "The provided credentials were invalid" })
        }
    }, [credential, password, setErrors]);

    const loginDemo = (e) => {
        e.preventDefault();
        return dispatch(sessionActions.login({
            credential: "DemoUser",
            password: "randomPassword"
        })).then(closeModal)
        .catch(
            () => {
                return dispatch(sessionActions.signup({ 
                    username: "DemoUser",
                    firstName: "Demo",
                    lastName: "User",
                    email: "demo@user.io",
                    password: "randomPassword"
                })).then(closeModal)
            }
        )
    }

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input 
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required 
                    />
                </label>
                <label>
                    Password
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </label>
                {errors.credential && <p>{errors.credential}</p>}
                <button type="submit" disabled={errors.credential}>Log In</button>
            </form>
            <button onClick={loginDemo}>Log in as Demo User</button>
        </>
    );
}

export default LoginFormModal;