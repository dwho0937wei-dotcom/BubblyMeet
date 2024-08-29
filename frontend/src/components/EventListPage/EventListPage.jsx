import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getAllEvents } from "../../store/event";
import './EventListPage.css';

const EventListPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllEvents())
    }, [dispatch])
    
    const eventListObj = useSelector(state => state.events.eventList);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if (eventListObj) {
            setIsLoaded(true);
        }
    }, [eventListObj, setIsLoaded]);
    const eventListArr = isLoaded && Object.values(eventListObj);

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
                    eventListArr.map(event => (
                        <Link 
                            to={`/events/${event.id}`}
                            key={event.id}
                            className="eventItem"
                        >
                            <li>
                                <h3>{event.startDate}</h3>
                                <h2>{event.name}</h2>
                                <h3>{event.Venue ? `${event.Venue.city}, ${event.Venue.state}` : 'Remote'}</h3>
                                <p>{event.description}</p>
                            </li>
                        </Link>
                ))}
            </ul>
        </>
    )
}

export default EventListPage;