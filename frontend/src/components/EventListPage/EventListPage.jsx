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
        <div className='eventListPage'>
            <h3>Events in MeetIsHere</h3>
            {/* <h4>{isLoaded && eventListArr.length} Total Events</h4> */}
            {isLoaded && 
                eventListArr.map(event => {
                    const [startDate, startTime] = event.startDate.split(" ");
                    return (
                        <Link 
                            to={`/events/${event.id}`}
                            className="eventItem"
                            key={event.id}
                        >
                            <div className='eventImgDetails'>
                                <img src={isUrl(event.previewImage) ? event.previewImage : eventImageFillIn} alt={`${event.name} Preview Image`} />
                                <div>
                                    <h3>{startDate} &middot; {startTime}</h3>
                                    <h2>{event.name}</h2>
                                    <h3>{event.Venue ? `${event.Venue.city}, ${event.Venue.state}` : 'Remote'}</h3>
                                </div>
                            </div>
                            <p>{event.description}</p>
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default EventListPage;