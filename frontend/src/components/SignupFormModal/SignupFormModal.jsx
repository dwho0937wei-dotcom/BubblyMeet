import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isDisabled, setIsDisabled] = useState(true);
    const { closeModal } = useModal();

    useEffect(() => {
        if (
            email.length === 0 ||
            username.length < 4 ||
            firstName.length === 0 ||
            lastName.length === 0 ||
            password.length < 6 ||
            password !== confirmPassword
        ) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [email, username, firstName, lastName, password, confirmPassword])

    const handleSubmit = e => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data?.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };

    return (
        <>
            <h1 className="signUpElements">Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label className="signUpElements">
                    Email
                    <input 
                        type="text" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {errors.email && <p className='errors'>{errors.email}</p>}
                <label className="signUpElements">
                    Username
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                {errors.username && <p className='errors'>{errors.username}</p>}
                <label className="signUpElements">
                    First Name
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                    {errors.firstName && <p className='errors'>{errors.firstName}</p>}
                <label className="signUpElements">
                    Last Name
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                    {errors.lastName && <p className='errors'>{errors.lastName}</p>}
                <label className="signUpElements">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                    {errors.password && <p className='errors'>{errors.password}</p>}
                <label className="signUpElements">
                    Confirm Password
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                    {errors.confirmPassword && <p className='errors'>{errors.confirmPassword}</p>}
                <button type="submit" disabled={isDisabled} className="signUpElements">Sign Up</button>
            </form>
        </>
    );
}

export default SignupFormModal;