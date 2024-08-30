import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroup } from "../../store/group"
import "./CreateEventFormPage.css";

function CreateEventFormPage() {
    const { groupId } = useParams();

    const [name, setName] = useState('');
    const [type, setType] = useState('Unselected');
    const [privacy, setPrivacy] = useState('Unselected');
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
    function handleSubmit(e) {
        e.preventDefault();
        console.log("You've clicked the button!");
    } 

    return (
        <>
            <h1>Create an event for {isLoaded && group.name}</h1>

            <form onSubmit={handleSubmit}>
                {/* Event Name */}
                <p>What is the name of the event?</p>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="What is your group name?"
                />
                <div className="errors">
                    {errors.name}
                </div>
                <h1>-------------------------------------------</h1>

                {/* Type, Visibility, & Price */}
                <p>Is this an in person or online group?</p>
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

                <p>Is this group private or public?</p>
                <select 
                    name="private" 
                    value={privacy} 
                    onChange={(e) => setPrivacy(e.target.value)}
                    required
                >
                    <option value="Unselected" disabled hidden>(select one)</option>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
                <div className="errors">
                    {errors.private}
                </div>

                <p>What is the price for your event?</p>
                <input
                    id="name"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                />
                <div className="errors">
                    {errors.price}
                </div>
                <h1>-------------------------------------------</h1>

                <p>When does your event start?</p>
                <input
                    id="name"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <div className="errors">
                    {errors.startDate}
                </div>

                <p>When does your event end?</p>
                <input
                    id="name"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <div className="errors">
                    {errors.endDate}
                </div>
                <h1>-------------------------------------------</h1>

                <p>Please add an image url for your group below:</p>
                <input 
                    id="imageUrl"
                    type="url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image Url"
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
                    placeholder="Please include at least 30 characters"
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