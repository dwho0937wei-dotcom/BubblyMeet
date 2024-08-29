import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { getEventDetails } from "../../store/event";

const EventDetailsPage = () => {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getEventDetails(eventId));
    }, [dispatch, eventId]);

    const event = useSelector(state => state.events.currentEvent);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if (event) {
            setIsLoaded(true);
        }
    }, [event, setIsLoaded])

    return (
        <>
            {/* Top Section */}
            <NavLink to="/events">Events</NavLink>
            <h1>{isLoaded && event.name}</h1>
            <h3>Hosted by {"<Firstname> <Lastname>"}</h3>

            {/* GroupBox */}
            <h3>{isLoaded && event.Group.name}</h3>
            <h3>
                {isLoaded && 
                    (event.Group.private ? "Private" : "Public")
                }
            </h3>

            {/* Time, Price, & Type Box */}
            <div>
                <h3>START {isLoaded && event.startDate}</h3>
                <h3>END {isLoaded && event.endDate}</h3>
            </div>
            <h3>
                PRICE {
                        isLoaded && 
                            (event.price === 0 ? "FREE" : event.price)
                      }
            </h3>
            <h3>TYPE {isLoaded && event.type}</h3>

            {/* Description Box */}
            <div>
                <h1>Details</h1>
                <p>{isLoaded && event.description}</p>
            </div>

        </>
    )
}

export default EventDetailsPage;