import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle, FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import "./ProfileButton.css";

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
    const ulClassName = showMenu ? "profile-dropdown" : "hidden"

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

    //! View Groups
    const [viewGroups, setViewGroups] = useState(false);
    const groupClick = (e) => {
        e.preventDefault();
        setViewGroups(true);
    }
    useEffect(() => {
        if (viewGroups) {
            navigate('/groups');
            setViewGroups(false);
            closeMenu();
        }
    }, [navigate, viewGroups, setViewGroups]);

    //! View Events
    const [viewEvents, setViewEvents] = useState(false);
    const eventClick = (e) => {
        e.preventDefault();
        setViewEvents(true);
    }
    useEffect(() => {
        if (viewEvents) {
            navigate('/events');
            setViewEvents(false);
            closeMenu();
        }
    }, [navigate, viewEvents, setViewEvents]);

    return (
        <div className="profile-section">
            <div className="profile-nav-btn">
                <NavLink
                    to={user ? "/groups/new" : ""}
                    className={user ? "navNormal" : "hidden"}
                >
                    Start a new group
                </NavLink>
                <button onClick={toggleMenu}>
                    <FaUserCircle />
                    {showMenu ? <FaAngleUp /> : <FaAngleDown />}
                </button>
            </div>
            <div className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                        <div>Hello, {user.firstName}</div>
                        <div>{user.email}</div>
                        <div>
                            <button onClick={logout}>Log Out</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <OpenModalMenuItem
                                buttonText="Log In"
                                onButtonClick={closeMenu}
                                modalComponent={<LoginFormModal />}
                            />
                        </div>
                        <div>
                            <OpenModalMenuItem
                                buttonText="Sign Up"
                                onButtonClick={closeMenu}
                                modalComponent={<SignupFormModal />}
                            />
                        </div>
                    </>
                )}
                <div>
                    <button onClick={groupClick}>View groups</button>
                </div>
                <div>
                    <button onClick={eventClick}>View events</button>
                </div>
            </div>
        </div>
    );
}

export default ProfileButton;