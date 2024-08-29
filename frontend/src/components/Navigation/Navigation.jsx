import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    
    return (
        <ul>
            <li>
                <NavLink to="/">MeetIsHere</NavLink>
            </li>
            <NavLink to="/groups/new">Start a new group</NavLink>
            {isLoaded && (
                <li>
                    <ProfileButton user={sessionUser} />
                </li>
            )}
        </ul>
    );
}

export default Navigation;