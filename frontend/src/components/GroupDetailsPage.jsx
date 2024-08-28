import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { getGroup } from '../store/group';

const GroupDetailsPage = () => {
    const { groupId } = useParams();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getGroup())
    }, [dispatch]);

    const allGroupsObj = useSelector(state => state.group);
    const allGroupsArr = Object.values(allGroupsObj);
    const group = allGroupsArr.find(group => group.id === +groupId);

    return (
        <>
            {/* Group Section */}
            <NavLink to="/groups">Groups</NavLink>
            <h1>{group.name}</h1>
            <h3>{group.city}</h3>
            <h3>## events * {!group.private ? 'Public' : 'Private'}</h3>
            <h3>Organized by {"<Firstname> <Lastname>"}</h3>
            <button>Join this group</button>

            {/* Organizer Section */}
            <h1>Organizer</h1>
            <h3>Firstname Lastname</h3>

            {/* About Section */}
            <h1>What {"we're"} about</h1>
            <p>{group.about}</p>

            {/* Upcoming Event Section */}
            <h1>Upcoming Events (#)</h1>

            {/* Past Event Section */}
            <h1>Past Events (#)</h1>
        </>
    )
}

export default GroupDetailsPage;