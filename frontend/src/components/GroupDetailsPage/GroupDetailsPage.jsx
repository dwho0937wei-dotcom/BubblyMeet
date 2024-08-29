import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { getGroup } from '../../store/group';

const GroupDetailsPage = () => {
    const { groupId } = useParams();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getGroup(groupId))
    }, [dispatch, groupId]);

    const [alert, setAlert] = useState({});
    function clickJoin() {
        const newAlert = { joinButton: "Feature Coming Soon..." }
        setAlert(newAlert);
    }

    const group = useSelector(state => state.groups.currentGroup);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if (group) {
            setIsLoaded(true);
        }
    }, [setIsLoaded, group]);

    return (
        <>
            {/* Group Section */}
            <NavLink to="/groups">Groups</NavLink>
            <h1>{isLoaded ? group.name : "Loading..."}</h1>
            <h3>
                {isLoaded ? group.city : "Loading..."}{', '} 
                {isLoaded ? group.state : "Loading..."}
            </h3>
            <h3>## events * {isLoaded && !group.private ? 'Public' : 'Private'}</h3>
            <h3>
                {'Organized by '}
                {isLoaded ? group.Organizer.firstName : "Loading..."}{' '} 
                {isLoaded ? group.Organizer.lastName : "Loading..."}
            </h3>
            <button 
                onClick={clickJoin}
            >
                Join this group
            </button>
            {' '}{alert.joinButton}

            {/* Organizer Section */}
            <h1>Organizer</h1>
            <h3>
                {isLoaded ? group.Organizer.firstName : "Loading..."}{' '} 
                {isLoaded ? group.Organizer.lastName : "Loading..."}
            </h3>

            {/* About Section */}
            <h1>What {"we're"} about</h1>
            <p>{isLoaded ? group.about : "Loading..."}</p>

            {/* Upcoming Event Section */}
            <h1>Upcoming Events (#)</h1>

            {/* Past Event Section */}
            <h1>Past Events (#)</h1>
        </>
    )
}

export default GroupDetailsPage;