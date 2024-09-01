import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    
    return (
        <>
            <div id='NavSection'>
                <NavLink to="/" id="HomeNav">
                    <img src="/favicon.ico" alt="App Academy Favicon" />
                </NavLink>
                <div>
                    {isLoaded && (
                        <ProfileButton user={sessionUser} />
                    )}
                </div>
            </div>
        </>
    );
}

export default Navigation;