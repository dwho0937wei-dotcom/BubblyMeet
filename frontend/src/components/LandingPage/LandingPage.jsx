import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import "./LandingPage.css"

const LandingPage = () => {
    const user = useSelector(state => state.session.user);


    return (
        <>
            <div className="landingPage">
                <div className="section" id="section_1">
                    <div id="title-intro">
                        <h1 id="title">MeetIsHere</h1>
                        <p id="introText">Welcome to a place where many interesting and inspiring meetings shall take place!</p>
                    </div>
                    <div>
                        <img src="https://as1.ftcdn.net/v2/jpg/05/32/20/68/1000_F_532206814_6fN5LdfZL8y33yXWehezCMDT19Gbbs1I.jpg" alt="Meeting Infographic" />
                    </div>
                </div>

                <p>-------------------------------------------------------</p>

                <div className="section" id="section_2">
                    <h2>How Does MeetIsHere works</h2>
                    <p>Simply look at the following three self-explanatory options</p>
                </div>

                <p>-------------------------------------------------------</p>
 
                <nav className="section" id="section_3">
                    <div className="option">
                        <span className="fa-solid fa-user-group"></span>
                        <NavLink 
                            to="/groups"
                            className="navNormal"
                        >
                            See all groups
                        </NavLink>
                    </div>

                    <div className="option">
                        <span className="fa-regular fa-calendar-days"></span>
                        <NavLink 
                            to="/events"
                            className="navNormal"
                        >
                            Find an event
                        </NavLink>
                    </div>

                    <div className="option">
                        <span className="fa-solid fa-plus"></span>
                        <NavLink 
                            to={user ? "/groups/new" : ""}
                            className={user ? "navNormal" : "disabled"}
                        >
                            Start a new group
                        </NavLink>
                    </div>
                </nav>

                <p>-------------------------------------------------------</p>

                <div className="section" id="section_4">
                    <button>Join MeetIsHere</button>
                </div>
            </div>
        </>
    )
}

export default LandingPage;