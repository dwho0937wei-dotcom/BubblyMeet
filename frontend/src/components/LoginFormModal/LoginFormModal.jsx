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
    const [isDisabled, setIsDisabled] = useState(true);
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
            setErrors({ credential: "The provided credentials were invalid" })
        });
    };
    
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
            (!emailRegex.test(credential) && credential.length < 4) 
            || password.length < 6
           ) 
        {
            setIsDisabled(true);
        }
        else {
            setIsDisabled(false);
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
            <div className="login">
                <h1>Log In</h1>
            </div>
            <div className="login">
                {errors.credential && <p id="errorMessage">{errors.credential}</p>}
            </div>
            <form onSubmit={handleSubmit}>
                <label>
                    <div className="login">
                        Username or Email
                    </div>
                    <div className="login">
                        <input 
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required 
                        />
                    </div>
                </label>
                <div className="login">
                    <label>
                        <div className="login">
                            Password
                        </div>
                        <div className="login">
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                    </label>
                </div>
                <div className="login">
                    <button type="submit" disabled={isDisabled}>Log In</button>
                </div>
            </form>
            <div className="login">
                <button onClick={loginDemo}>Log in as Demo User</button>
            </div>
        </>
    );
}

export default LoginFormModal;