import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import { useDispatch } from "react-redux";

function ProfileButton({ user }) {
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const dispatch = useDispatch();

    const toggleMenu = e => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    }

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    }

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = e => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const hidden = showMenu ? "" : "hidden";

    return (
        <>
            <button onClick={toggleMenu}>
                <FaUserCircle />
            </button>
            <ul ref={ulRef} hidden={hidden}>
                <li>{user.username}</li>
                <li>{user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
                <li>
                <button onClick={logout}>Log Out</button>
                </li>
            </ul>
        </>
    );
}

export default ProfileButton;