import isUrl from 'is-url';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { getEventDetails } from "../../store/event";

const EventDetailsPage = () => {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getEventDetails(eventId)).catch(errors => errors.json());
    }, [dispatch, eventId]);

    const event = useSelector(state => state.events.currentEvent);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if (event) {
            setIsLoaded(true);
        }
    }, [event, setIsLoaded])

    //! Extracting the event preview image or filling a default one in
    const previewImage = isLoaded && event.EventImages.find(img => img.preview);
    let eventImageUrl;
    if (previewImage && isUrl(previewImage.url)) {
        eventImageUrl = previewImage.url;
    }
    else {
        eventImageUrl = "https://static.vecteezy.com/system/resources/thumbnails/021/957/793/small_2x/event-outline-icons-simple-stock-illustration-stock-vector.jpg"
    }

    return (
        <>
            <NavLink to="/events">Events</NavLink>
            {/* Top Section */}
            <div>
                <img 
                    src={eventImageUrl} 
                    alt={eventImageUrl} 
                />
            </div>
            <h1>{isLoaded && event.name}</h1>
            <h3>Hosted by {`${isLoaded && event.eventHost.firstName} ${isLoaded && event.eventHost.lastName}`}</h3>

            {/* GroupBox */}
            <h3>Host Group: {isLoaded && event.Group.name}</h3>
            <h3>
                {"Visibility: "} 
                {isLoaded && 
                    (event.Group.private ? "Private" : "Public")
                }
            </h3>

            {/* Time, Price, & Type Box */}
            <div>
                <h3>Start Date: {isLoaded && event.startDate}</h3>
                <h3>End Date: {isLoaded && event.endDate}</h3>
            </div>
            <h3>
                Price: {
                        isLoaded && 
                            (event.price === 0 ? "FREE" : event.price)
                      }
            </h3>
            <h3>Type: {isLoaded && event.type}</h3>

            {/* Description Box */}
            <div>
                <h1>Details</h1>
                <p>{isLoaded && event.description}</p>
            </div>

        </>
    )
}

export default EventDetailsPage;