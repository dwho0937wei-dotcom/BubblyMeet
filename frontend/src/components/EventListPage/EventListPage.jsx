import isUrl from 'is-url';
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

    const eventImageFillIn = "https://static.vecteezy.com/system/resources/thumbnails/021/957/793/small_2x/event-outline-icons-simple-stock-illustration-stock-vector.jpg"

    return (
        <>
            <h3>Events in MeetIsHere</h3>
            {isLoaded && 
                eventListArr.map(event => (
                    <Link 
                        to={`/events/${event.id}`}
                        key={event.id}
                        className="eventItem"
                    >
                        <h1>----------------------------------------------</h1>
                        <h3>{event.startDate}</h3>
                        <img src={isUrl(event.previewImage) ? event.previewImage : eventImageFillIn} alt={`${event.name} Preview Image`} />
                        <h2>{event.name}</h2>
                        <h3>{event.Venue ? `${event.Venue.city}, ${event.Venue.state}` : 'Remote'}</h3>
                        <p>{event.description}</p>
                    </Link>
            ))}
        </>
    )
}

export default EventListPage;