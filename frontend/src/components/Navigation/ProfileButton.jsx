import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
    //! Menu
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const toggleMenu = e => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    }
    useEffect(() => {
        if (!showMenu) return;
        const closeMenu = e => {
            if (!ulRef.current?.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);
    const closeMenu = () => setShowMenu(false);
    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    //! Logout
    const [isLogout, setIsLogout] = useState(false);
    const navigate = useNavigate();
    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        setIsLogout(true);
        closeMenu();
    }
    useEffect(() => {
        if (isLogout) {
            navigate('/');
            setIsLogout(false);
        }
    }, [navigate, isLogout, setIsLogout]);

    //! View Group
    const [viewGroup, setViewGroup] = useState(false);
    const groupClick = (e) => {
        e.preventDefault();
        setViewGroup(true);
    }
    useEffect(() => {
        if (viewGroup) {
            navigate('/groups');
            setViewGroup(false);
        }
    }, [navigate, viewGroup, setViewGroup]);

    return (
        <>
            <button onClick={toggleMenu}>
                <FaUserCircle />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                        <li>Hello, {user.firstName}</li>
                        <li>{user.email}</li>
                        <li>
                            <button onClick={logout}>Log Out</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <OpenModalMenuItem
                                buttonText="Log In"
                                onButtonClick={closeMenu}
                                modalComponent={<LoginFormModal />}
                            />
                        </li>
                        <li>
                            <OpenModalMenuItem
                                buttonText="Sign Up"
                                onButtonClick={closeMenu}
                                modalComponent={<SignupFormModal />}
                            />
                        </li>
                        <li>
                            <button onClick={groupClick}>View groups</button>
                        </li>
                    </>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;