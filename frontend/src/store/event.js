import { csrfFetch } from "./csrf";

// ------------------------------------ //
//!       Action Types
// ------------------------------------ //
const LOAD_ALL_EVENTS = 'event/LOAD_ALL_EVENTS';
const LOAD_EVENT_DETAILS = 'event/LOAD_EVENT_DETAILS';

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
        default:
            return state;
    }
}

export default eventReducer;