import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteEventThunk } from "../../store/event";
import './DeleteEventFormModal.css';

function DeleteEventFormModal({ navigate, eventId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    
    const hostGroupId = useSelector(state => state.events.currentEvent.Group.id);
    const deleteEvent = e => {
        e.preventDefault();
        return dispatch(deleteEventThunk(eventId))
            .then(() => {
                navigate(`/groups/${hostGroupId}`);
                closeModal();
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data?.errors) {
                    console.log(data.errors);
                }
            });
    }
    const keepEvent = e => {
        e.preventDefault();
        closeModal();
    }

    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this event?</p>
            <div>
                <button onClick={deleteEvent} className="red">Yes (Delete Event)</button>
            </div>
            <div>
                <button onClick={keepEvent} className="darkGrey">No (Keep Event)</button>
            </div>
        </>
    )
}

export default DeleteEventFormModal