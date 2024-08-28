import { NavLink } from "react-router-dom";

const LandingPage = () => {
    return (
        <>
            <h1>Welcome to the Landing Page!</h1>
            <NavLink to="/group">See all groups</NavLink>
        </>
    )
}

export default LandingPage;