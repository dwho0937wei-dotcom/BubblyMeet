import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom'
import { getGroup } from "../../store/group";
import './GroupListPage.css';

const GroupListPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroup());
    }, [dispatch]);

    const allGroupsObj = useSelector(state => state.group);
    const allGroupsArr = Object.values(allGroupsObj);

    return (
        <>
            <h1>Welcome to the Group List Page!</h1>
            <ul>
                {allGroupsArr.map(group => (
                    <Link 
                        to={`/group/${group.id}`}
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