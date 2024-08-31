import { csrfFetch } from "./csrf";

// ------------------------------------ //
//!       Action Types
// ------------------------------------ //
const LOAD_ALL_GROUPS = '/group/LOAD_ALL_GROUPS';
const LOAD_GROUP = '/group/LOAD_GROUP';
const CREATE_GROUP = '/group/CREATE_GROUP';
const UPDATE_GROUP = '/group/UPDATE_GROUP';
const DELETE_GROUP = '/group/DELETE_GROUP';
const ADD_GROUP_IMAGE = '/group/ADD_GROUP_IMAGE';
const REMOVE_GROUP_IMAGE = 'group/REMOVE_GROUP_IMAGE';

// ------------------------------------ //
//!       Action Creators
// ------------------------------------ //
const loadAllGroups = list => ({
    type: LOAD_ALL_GROUPS,
    list
});
const loadGroup = group => ({
    type: LOAD_GROUP,
    group
});
const createGroup = newGroup => ({
    type: CREATE_GROUP,
    newGroup
})
const updateGroup = editedGroup => ({
    type: UPDATE_GROUP,
    editedGroup
})
const deleteGroup = () => ({
    type: DELETE_GROUP
})
const addGroupImage = newGroupPreviewImage => ({
    type: ADD_GROUP_IMAGE,
    newGroupPreviewImage
})
const removeGroupImage = () => ({
    type: REMOVE_GROUP_IMAGE
});

// ------------------------------------ //
//!       Thunk Action Creators
// ------------------------------------ //
export const getAllGroups = () => async dispatch => {
    const response = await csrfFetch(`/api/groups`);

    if (response.ok) {
        const list = await response.json();
        dispatch(loadAllGroups(list));
    }
}
export const getGroup = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`);

    if (response.ok) {
        const group = await response.json();
        dispatch(loadGroup(group));
    }
}
export const createGroupThunk = body => async dispatch => {
    const response = await csrfFetch(`/api/groups`, {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (response.ok) {
        const newGroup = await response.json();
        dispatch(createGroup(newGroup));
        return newGroup;
    }
    else {
        const errors = await response.json();
        console.log(errors.errors);
        return errors;
    }
}
export const updateGroupThunk = (groupId, body) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        body: JSON.stringify(body)
    });

    if (response.ok) {
        const editedGroup = await response.json();
        dispatch(updateGroup(editedGroup));
        return editedGroup;
    }
    else {
        const errors = await response.json();
        console.log(errors.errors);
        return errors;
    }
}
export const deleteGroupThunk = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        dispatch(deleteGroup());
    }
    else {
        const errors = await response.json();
        console.log(errors.errors);
        return errors;
    }
}
export const addGroupImageThunk = (groupId, imgUrl, preview=true) => async dispatch => {
    const body = { url: imgUrl, preview };
    const response = await csrfFetch(`/api/groups/${groupId}/images`, {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (response.ok) {
        const newGroupImage = await response.json();
        dispatch(addGroupImage(newGroupImage));
        return newGroupImage;
    }
    else {
        const errors = await response.json();
        console.log(errors.errors);
        return errors;
    }
}
export const removeGroupImageThunk = imageId => async dispatch => {
    const response = await csrfFetch(`/api/group-images/${imageId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        dispatch(removeGroupImage());
    }
    else {
        const errors = await response.json();
        console.log(errors.errors);
        return errors;
    }
} 

// ------------------------------------ //
const initialState = {};

const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALL_GROUPS: {
            const allGroups = {};
            action.list.Groups.forEach(group => {
                allGroups[group.id] = group;
            });
            return {
                ...state,
                groupList: allGroups,
            };
        }
        case LOAD_GROUP: {
            const group = {...action.group};
            return {
                ...state,
                currentGroup: group
            }
        }
        case CREATE_GROUP: {
            const lastCreatedGroup = {...action.newGroup};
            return {
                ...state,
                lastCreatedGroup
            };
        }
        case ADD_GROUP_IMAGE: {
            const lastAddedGroupImage = {...action.newGroupPreviewImage};
            return {
                ...state,
                lastAddedGroupImage
            }
        }
        case UPDATE_GROUP: {
            const lastUpdatedGroup = {...action.editedGroup};
            return {
                ...state,
                lastUpdatedGroup
            }
        }
        case DELETE_GROUP: {
            return state;
        }
        case REMOVE_GROUP_IMAGE: {
            return state;
        }
        default: {
            return state;
        }
    }
}

export default groupReducer;