import isUrl from 'is-url';
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

    const groupImageFillIn = "https://cdn-icons-png.flaticon.com/256/681/681443.png"


    return (
        <>
            <h1>
                <NavLink to="/events">Events</NavLink>
            </h1>
            <h1>
                <NavLink to="/groups">Groups</NavLink>
            </h1>

                {isLoaded && 
                    allGroupsArr.map(group => (
                        <Link 
                            to={`/groups/${group.id}`}
                            key={group.id}
                            className="groupItem"
                        >
                            <h1>----------------------------------------------</h1>
                            <img src={isUrl(group.previewImage) ? group.previewImage : groupImageFillIn} alt={`${group.name} Preview Image`} />
                            <h2>{group.name}</h2>
                            <h3>{group.city}, {group.state}</h3>
                            <p>{group.about}</p>
                        </Link>
                ))}

        </>
    )
}

export default GroupListPage;