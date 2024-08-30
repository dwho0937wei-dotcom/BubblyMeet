import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getGroup } from "../../store/group"
import { createEventThunk, addEventImageThunk } from "../../store/event";
import "./CreateEventFormPage.css";

function CreateEventFormPage() {
    const { groupId } = useParams();

    const [name, setName] = useState('');
    const [type, setType] = useState('Unselected');
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [errors, setErrors] = useState({});

    //! Dispatching the necessary data
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getGroup(groupId));
    }, [dispatch, groupId]);
    const group = useSelector(state => state.groups.currentGroup);

    //! Verify that everything has been loaded
    useEffect(() => {
        if (group) {
            setIsLoaded(true);
        }
    }, [group, setIsLoaded])

    //! Event for submitting
    const navigate = useNavigate();
    async function handleSubmit(event) {
        event.preventDefault();

        const validateErrors = {};
        if (
            !imageUrl.endsWith('.png') &&
            !imageUrl.endsWith('.jpg') &&
            !imageUrl.endsWith('.jpeg')
        ) {
            validateErrors.imageUrl = "Image URL must end in .png, .jpg, or .jpeg";
        }
        const noValidateErrors = Object.keys(validateErrors).length === 0;

        const payload = {
            venueId: null,
            name,
            type,
            capacity: Infinity,
            price,
            description,
            startDate,
            endDate
        }
        const newEvent = await dispatch(createEventThunk(groupId, payload)).catch(errors => errors.json());

        if (!newEvent.errors && noValidateErrors) {
            dispatch(addEventImageThunk(newEvent.id, imageUrl));
            navigate(`/events/${newEvent.id}`)
        }
        else {
            setErrors({...newEvent.errors, ...validateErrors});
        }
    } 

    return (
        <>
            <h1>Create an event for {isLoaded && group.name}</h1>

            <form onSubmit={handleSubmit}>
                {/* Event Name */}
                <p>What is the name of the event?</p>
                <input
                    id="name"
                    className="singleLineTextBox"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Event Name"
                />
                <div className="errors">
                    {errors.name}
                </div>
                <h1>-------------------------------------------</h1>

                {/* Type & Price */}
                <p>Is this an in-person or online event?</p>
                <select 
                    name="type" 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required 
                >
                    <option value="Unselected" disabled hidden>(select one)</option>
                    <option value="In person">In person</option>
                    <option value="Online">Online</option>
                </select>
                <div className="errors">
                    {errors.type}
                </div>

                <p>What is the price for your event?</p>
                <input
                    id="price"
                    className="singleLineTextBox"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={0}
                />
                <div className="errors">
                    {errors.price}
                </div>
                <h1>-------------------------------------------</h1>

                <p>When does your event start?</p>
                <input
                    id="startDate"
                    className="singleLineTextBox"
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="MM/DD/YYYY HH/mm AM"
                />
                <div className="errors">
                    {errors.startDate}
                </div>

                <p>When does your event end?</p>
                <input
                    id="endDate"
                    className="singleLineTextBox"
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="MM/DD/YYYY HH/mm PM"
                />
                <div className="errors">
                    {errors.endDate}
                </div>
                <h1>-------------------------------------------</h1>

                <p>Please add an image url for your event below:</p>
                <input 
                    id="imageUrl"
                    className="singleLineTextBox"
                    type="text" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL"
                />
                <div className="errors">
                    {errors.imageUrl}
                </div>
                <h1>-------------------------------------------</h1>

                <p>Please describe your event:</p>
                <textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please include at least 30 characters."
                />
                <div className="errors">
                    {errors.description}
                </div>

                <button>Create Event</button>
            </form>
        </>
    )
}

export default CreateEventFormPage;