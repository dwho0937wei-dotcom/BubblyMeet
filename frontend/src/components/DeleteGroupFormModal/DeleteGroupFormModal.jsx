import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteGroupThunk } from "../../store/group";
import "./DeleteGroupFormModal.css";

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
        <div className="deleteGroupModal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this group?</p>
            <div className="btns">
                <button onClick={deleteGroup} className="red">Yes (Delete Group)</button>

                <button onClick={keepGroup} className="darkGrey">No (Keep Group)</button>
            </div>
        </div>
    )
}

export default DeleteGroupFormModal