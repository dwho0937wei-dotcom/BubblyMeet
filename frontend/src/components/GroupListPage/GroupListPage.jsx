import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink } from 'react-router-dom'
import { getAllGroups } from "../../store/group";
import './GroupListPage.css';

const GroupListPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllGroups());
    }, [dispatch]);

    const allGroupsObj = useSelector(state => state.groups.groupList);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if (allGroupsObj) {
            setIsLoaded(true);
        }
    }, [allGroupsObj, setIsLoaded]);
    const allGroupsArr = isLoaded && Object.values(allGroupsObj);

    return (
        <>
            <h1>
                <NavLink to="/events">Events</NavLink>
            </h1>
            <h1>
                <NavLink to="/groups">Groups</NavLink>
            </h1>
            <ul>
                {isLoaded && 
                    allGroupsArr.map(group => (
                        <Link 
                            to={`/groups/${group.id}`}
                            key={group.id}
                            className="groupItem"
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