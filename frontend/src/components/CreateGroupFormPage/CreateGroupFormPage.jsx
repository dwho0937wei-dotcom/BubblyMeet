import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createGroupThunk } from "../../store/group";
import './CreateGroupFormPage.css';

function CreateGroupFormPage() {
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('Unselected');
    const [privacy, setPrivacy] = useState('Unselected');
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        const [city, state] = location.split(', ');
        const payload = {
            name,
            about,
            type,
            private: privacy,
            city,
            state
        }

        const newGroup = await dispatch(createGroupThunk(payload));
        if (!newGroup.errors) {
            navigate(`/groups/${newGroup.id}`);
        }
        else {
            setErrors(newGroup.errors);
        }
    }

    return (
        <>
            {/* Header */}
            <h4>BECOME AN ORGANIZER</h4>
            <h2>{"We'll"} walk you through a few steps to build your local community</h2>
            
            <form onSubmit={handleSubmit}>
                <div>
                    {/* Location */}
                    <h2>First, set your {"group's"} location.</h2>
                    <p>MeetIsHere groups meet locally, in person and online. {"We'll"} connect you with people in your area, and more can join you online.</p>
                    <input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, STATE"
                    />
                </div>
                <div>
                    {/* Group Name */}
                    <h2>What will your {"group's"} name be?</h2>
                    <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="What is your group name?"
                    />
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
                        placeholder="Please write at least 30 characters"
                    />
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

                        <dt>Please add an image url for your group below:</dt>
                        <input 
                            id="imageUrl"
                            type="text" 
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Image Url"
                        />
                    </dl>
                </div>
                <button>Create group</button>
            </form>
        </>
    )
}

export default CreateGroupFormPage;