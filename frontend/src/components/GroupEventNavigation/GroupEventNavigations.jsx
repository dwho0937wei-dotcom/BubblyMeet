import { NavLink } from "react-router-dom"
import { Outlet } from "react-router-dom";
import "./GroupEventNavigation.css";

function GroupEventNavigations() {
    return (
        <>
            <nav className="GroupEventNav">
                <h1>
                    <NavLink 
                        to="/events"
                        className={({ isActive }) => isActive ? 'teal' : 'gray'}
                    >
                        Events
                    </NavLink>
                </h1>
                <h1>
                    <NavLink 
                        to="/groups"
                        className={({ isActive }) => isActive ? 'teal' : 'gray'}
                    >
                        Groups
                    </NavLink>
                </h1>
            </nav>

            {<Outlet />}
        </>
    )
}

export default GroupEventNavigations;