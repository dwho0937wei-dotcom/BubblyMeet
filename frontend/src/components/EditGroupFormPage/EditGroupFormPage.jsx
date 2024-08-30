import { useParams, useSearchParams } from "react-router-dom"
import { getGroup, updateGroupThunk, addGroupImageThunk } from "../../store/group"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function EditGroupFormPage() {
    const [isLoaded, setIsLoaded] = useState(false);

    //! Loading the group to pre-populate values
    const { groupId } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getGroup(groupId));
    }, [dispatch, groupId]);
    const group = useSelector(state => state.groups.currentGroup);

    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('Unselected');
    const [privacy, setPrivacy] = useState('Unselected');
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState({});

    //! Verify that everything is loaded and begin pre-populating
    useEffect(() => {
        if (group) {
            setLocation(`${group.city}, ${group.state}`);
            setName(group.name);
            setAbout(group.about);
            setType(group.type);
            setPrivacy(group.private);
            const groupPreviewImage = group.GroupImages.find(groupImage => groupImage.preview);
            setImageUrl(groupPreviewImage.url);
            setIsLoaded(true)
        }
    }, [group]);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("You've clicked the submit button!");
    } 

    return (
        <>
            {/* Header */}
            <h4>{"UPDATE YOUR GROUP'S INFORMATION"}</h4>
            <h2>{"We'll"} walk you through a few steps to update your {"group's"} information</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    {/* Location */}
                    <h2>First, set your {"group's"} location.</h2>
                    <p>MeetIsHere groups meet locally, in-person and online. {"We'll"} connect you with people in your area, and more can join you online.</p>
                    <input
                        id="location"
                        className="singleLineTextBox"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <div className="errors">
                        {errors.location || errors.city || errors.state}
                    </div>
                </div>

                <div>
                    {/* Group Name */}
                    <h2>What will your {"group's"} name be?</h2>
                    <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative!</p>
                    <input
                        id="name"
                        className="singleLineTextBox"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className="errors">
                        {errors.name}
                    </div>
                </div>

                <div>
                    {/* Group Description */}
                    <h2>Now describe what your group will be about</h2>
                    <p>People will see this when we promote your group, but {"you'll"} be able to add to it later, too.</p>
                    <ol>
                        <li>
                            <p>{"What's"} the purpose of the group?</p>
                        </li>
                        <li>
                            <p>Who should join?</p>
                        </li>
                        <li>
                            <p>What will you do at your events?</p>
                        </li>
                    </ol>
                    <textarea 
                        id="about"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                    <div className="errors">
                        {errors.about}
                    </div>
                </div>

                <div>
                    {/* Type, Private?, Preview Image */}
                    <h2>Final steps...</h2>
                    <dl>
                        <dt>Is this an in person or online group?</dt>
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

                        <dt>Is this group private or public?</dt>
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

                        <dt>Please add an image url for your group below:</dt>
                        <input 
                            id="imageUrl"
                            className="singleLineTextBox"
                            type="text" 
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <div className="errors">
                            {errors.imageUrl}
                        </div>
                    </dl>
                </div>

                <button>Update group</button>
            </form>
        </>
    )
}

export default EditGroupFormPage