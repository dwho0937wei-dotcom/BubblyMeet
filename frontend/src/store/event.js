import { csrfFetch } from "./csrf";

// ------------------------------------ //
//!       Action Types
// ------------------------------------ //
const LOAD_ALL_EVENTS = 'event/LOAD_ALL_EVENTS';


// ------------------------------------ //
//!       Action Creators
// ------------------------------------ //
const loadAllEvent = list => ({
    type: LOAD_ALL_EVENTS,
    list
});


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

// ------------------------------------ //
const initialState = {};

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALL_EVENTS: {
            const eventList = {};
            action.list.Events.forEach(event => {
                eventList[event.id] = event;
            })
            console.log("Event List:", eventList);
            return {
                ...state,
                eventList: {...eventList}
            };
        }
        default:
            return state;
    }
}

export default eventReducer;