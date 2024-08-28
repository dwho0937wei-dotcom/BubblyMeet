import { csrfFetch } from "./csrf";

// ------------------------------------ //
//!       Action Types
// ------------------------------------ //
const LOAD_ALL_GROUPS = '/group/LOAD_ALL_GROUPS';
const LOAD_GROUP = '/group/LOAD_GROUP';

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
})

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

// ------------------------------------ //
const initialState = {
    groupList: [],
    currentGroup: {},
};

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
        default: {
            return state;
        }
    }
}

export default groupReducer;