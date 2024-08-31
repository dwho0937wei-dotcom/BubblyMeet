import { NavLink } from "react-router-dom";

const LandingPage = () => {
    return (
        <>
            <h1>Welcome to the Landing Page!</h1>
            <NavLink to="/groups">See all groups</NavLink>
            <NavLink to="/groups/new">Start a new group</NavLink>
        </>
    )
}

export default LandingPage;