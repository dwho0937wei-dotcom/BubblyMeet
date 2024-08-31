import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteEventThunk } from "../../store/event";

function DeleteEventFormModal({ navigate, eventId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const deleteEvent = e => {
        e.preventDefault();
        return dispatch(deleteEventThunk(eventId))
            .then(() => {
                navigate('/events');
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
                <button onClick={deleteEvent}>Yes (Delete Event)</button>
            </div>
            <div>
                <button onClick={keepEvent}>No (Keep Event)</button>
            </div>
        </>
    )
}

export default DeleteEventFormModal