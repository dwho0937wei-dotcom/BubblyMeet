import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from 'react-icons/fa';

function ProfileButton({ user }) {
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = e => {
        e.stopPropagation();
        setShowMenu(!showMenu);
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
            </ul>
        </>
    );
}

export default ProfileButton;