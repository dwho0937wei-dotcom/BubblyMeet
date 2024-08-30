import { csrfFetch } from "./csrf";

// ------------------------------------ //
//!       Action Types
// ------------------------------------ //
const LOAD_ALL_EVENTS = 'event/LOAD_ALL_EVENTS';
const LOAD_EVENT_DETAILS = 'event/LOAD_EVENT_DETAILS';
const LOAD_ALL_GROUP_EVENTS = '/group/LOAD_ALL_GROUP_EVENTS';
const CREATE_EVENT = '/group/CREATE_EVENT';

// ------------------------------------ //
//!       Action Creators
// ------------------------------------ //
const loadAllEvent = list => ({
    type: LOAD_ALL_EVENTS,
    list
});
const loadEventDetails = event => ({
    type: LOAD_EVENT_DETAILS,
    event
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
export const getAllEvents = () => async dispatch => {
    const response = await csrfFetch(`/api/events`);

    if (response.ok) {
        const list = await response.json();
        dispatch(loadAllEvent(list));
    }
}
export const getEventDetails = eventId => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`);

    if (response.ok) {
        const event = await response.json();
        dispatch(loadEventDetails(event));
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

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALL_EVENTS: {
            const eventList = {};
            action.list.Events.forEach(event => {
                eventList[event.id] = event;
            })
            return {
                ...state,
                eventList: {...eventList}
            };
        }
        case LOAD_EVENT_DETAILS: {
            const event = {...action.event}
            return {
                ...state,
                currentEvent: event
            }
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
        default:
            return state;
    }
}

export default eventReducer;