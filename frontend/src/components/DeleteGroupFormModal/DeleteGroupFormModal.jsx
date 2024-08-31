import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteGroupThunk } from "../../store/group";

function DeleteGroupFormModal({ navigate, groupId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const deleteGroup = e => {
        e.preventDefault();
        return dispatch(deleteGroupThunk(groupId))
            .then(() => {
                navigate('/groups');
                closeModal();
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data?.errors) {
                    console.log(data.errors);
                }
            });
    }
    const keepGroup = e => {
        e.preventDefault();
        closeModal();
    }

    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this group?</p>
            <div>
                <button onClick={deleteGroup}>Yes (Delete Group)</button>
            </div>
            <div>
                <button onClick={keepGroup}>No (Keep Group)</button>
            </div>
        </>
    )
}

export default DeleteGroupFormModal