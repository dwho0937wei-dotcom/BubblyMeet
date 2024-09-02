import isUrl from 'is-url';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getEventDetails } from "../../store/event";
import OpenModalMenuItem from '../OpenModalButton';
import DeleteEventFormModal from '../DeleteEventFormModal';
import "./EventDetailsPage.css";

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

    //! Display the update/delete event buttons for the creator of this event
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const displayEventButtons = () => {
        const creator = event.eventHost;
        if (user && user.id === creator.id) {
            return (
                <OpenModalMenuItem
                    buttonText="Delete"
                    modalComponent={<DeleteEventFormModal navigate={navigate} eventId={eventId}/>}
                    className="deleteBtn"
                />
            )
        }
    }

    return (
        <>
            {'< '}<NavLink to="/events">Events</NavLink>
            {/* Top Section */}
            <h1>{isLoaded && event.name}</h1>
            <h3>Hosted by {`${isLoaded && event.eventHost.firstName} ${isLoaded && event.eventHost.lastName}`}</h3>
            
            <div className="BottomSection">
                {/* Event Image */}
                <div className='ImgInfo'>
                    <img 
                        src={eventImageUrl} 
                        alt={eventImageUrl} 
                    />

                    <div>
                        {/* Group Info Box */}
                        <div className="InfoBox">
                            <h3>Host Group: {isLoaded && event.Group.name}</h3>
                            <h3>
                                {"Visibility: "} 
                                {isLoaded && 
                                    (event.Group.private ? "Private" : "Public")
                                }
                            </h3>
                        </div>

                        {/* Event Info Box (Time, Price, & Type) */}
                        <div className="InfoBox">
                            <div className="DateTime">
                                <span className="fa-solid fa-clock"></span> 
                                <div className="StartEnd">
                                    <h3>
                                        {" "}START{" "}
                                        {isLoaded && event.startDate}
                                    </h3>
                                    <h3>{" "}END{" "}
                                        {isLoaded && event.endDate}
                                    </h3>
                                </div>
                            </div>
                            <h3>
                                <div className='DateTime'>
                                    <span className="fa-solid fa-dollar-sign"></span>
                                    {
                                        isLoaded && 
                                            (event.price === 0 ? "FREE" : event.price)
                                    }
                                </div>
                            </h3>
                            <div className='TypeWithDelete'>
                                <div>
                                    <span className="fa-solid fa-map-pin"></span>
                                    <h3>{isLoaded && event.type}</h3>
                                </div>
                                {/* Buttons for updating/deleting the event */}
                                {isLoaded && displayEventButtons()}
                            </div>
                        </div>
                    </div>
                </div>
                

                {/* Description Box */}
                <div>
                    <h1>Details</h1>
                    <p>{isLoaded && event.description}</p>
                </div>
            </div>
        </>
    )
}

export default EventDetailsPage;