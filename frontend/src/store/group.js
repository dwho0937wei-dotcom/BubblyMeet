import { csrfFetch } from "./csrf";

// ------------------------------------ //
//!       Action Types
// ------------------------------------ //
const LOAD_ALL_GROUPS = '/group/LOAD_ALL_GROUPS';
const LOAD_GROUP = '/group/LOAD_GROUP';
const CREATE_GROUP = '/group/CREATE_GROUP';
const LOAD_ALL_GROUP_EVENTS = '/group/LOAD_ALL_GROUP_EVENTS';
const CREATE_EVENT = '/group/CREATE_EVENT';

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
const loadAllGroupEvents = events => ({
    type: LOAD_ALL_GROUP_EVENTS,
    events
});
const createEvent = newEvent => ({
    type: CREATE_EVENT,
    newEvent
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
export const getAllGroupEvents = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`);

    if (response.ok) {
        const groupEvents = await response.json();
        dispatch(loadAllGroupEvents(groupEvents));
        return groupEvents;
    }
}
export const createEventThunk = (groupId, body) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (response.ok) {
        const newEvent = await response.json();
        dispatch(createEvent(newEvent));
        return newEvent;
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
        case LOAD_ALL_GROUP_EVENTS: {
            const currentGroupEvents = [...action.events.Events];
            return {
                ...state,
                currentGroupEvents
            }
        }
        case CREATE_EVENT: {
            const lastCreatedEvent = {...action.newEvent};
            return {
                ...state,
                lastCreatedEvent
            };
        }
        default: {
            return state;
        }
    }
}

export default groupReducer;