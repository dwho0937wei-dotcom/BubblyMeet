import isUrl from 'is-url';
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllEvents } from "../../store/event";
import './EventListPage.css';
import { TITLE } from "../../index"

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

    //! Sorting the events by dates
    function compareFn(eventA, eventB) {
        if (eventA.endDate < eventB.endDate) {
            return -1;
        } else if (eventA.endDate > eventB.endDate) {
            return 1;
        } else if (eventA.startDate < eventB.startDate) {
            return -1;
        } else if (eventA.startDate > eventB.startDate) {
            return 1;
        }
        return 0;
    }
    function sortDates(events) {
        return events.sort(compareFn);
    }
    const sortedEventListArr = isLoaded && sortDates(eventListArr);

    return (
        <div className='eventListPage'>
            <h3>Events in {`${TITLE}`}</h3>
            {/* <h4>{isLoaded && eventListArr.length} Total Events</h4> */}
            {isLoaded && 
                sortedEventListArr.map(event => {
                    const [startDate, startTime] = event.startDate.split(" ");
                    const [endDate, endTime] = event.endDate.split(" ");
                    return (
                        <Link 
                            to={`/events/${event.id}`}
                            className="eventItem"
                            key={event.id}
                        >
                            <div className='eventImgDetails'>
                                <img src={isUrl(event.previewImage) ? event.previewImage : eventImageFillIn} alt={`${event.name} Preview Image`} />
                                <div>
                                    <h3>START: {startDate} &middot; {startTime}</h3>
                                    <h3>END: {endDate} &middot; {endTime}</h3>
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