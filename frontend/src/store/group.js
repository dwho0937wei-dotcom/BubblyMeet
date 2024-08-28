import { csrfFetch } from "./csrf";

// ------------------------------------ //
//!       Action Types
// ------------------------------------ //
const LOAD_GROUP = 'group/LOAD_GROUP';

// ------------------------------------ //
//!       Action Creators
// ------------------------------------ //
const loadGroup = list => ({
    type: LOAD_GROUP,
    list
});

// ------------------------------------ //
//!       Thunk Action Creators
// ------------------------------------ //
export const getGroup = () => async dispatch => {
    const response = await csrfFetch(`/api/groups`);

    if (response.ok) {
        const list = await response.json();
        dispatch(loadGroup(list));
    }
}

// ------------------------------------ //

const initialState = {};

const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GROUP: {
            const allGroups = {};
            action.list.Groups.forEach(group => {
                allGroups[group.id] = group;
            });
            return {
                ...allGroups,
                ...initialState
            };
        }
        default: 
            return state;
    }
}

export default groupReducer;