import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink } from 'react-router-dom'
import { getAllGroups } from "../../store/group";
import './GroupListPage.css';

const GroupListPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllGroups());
    }, [dispatch]);

    const allGroupsObj = useSelector(state => state.group.groupList);
    const allGroupsArr = Object.values(allGroupsObj);

    return (
        <>
            <h1>
                <NavLink to="/events">Events</NavLink>
            </h1>
            <h1>
                <NavLink to="/groups">Groups</NavLink>
            </h1>
            <ul>
                {allGroupsArr.map(group => (
                    <Link 
                        to={`/groups/${group.id}`}
                        key={group.id}
                        className="item"
                    >
                        <li>
                            <h2>{group.name}</h2>
                            <p>{group.about}</p>
                        </li>
                    </Link>
                ))}
            </ul>
        </>
    )
}

export default GroupListPage;