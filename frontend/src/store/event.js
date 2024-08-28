import { csrfFetch } from "./csrf";

// ------------------------------------ //
//!       Action Types
// ------------------------------------ //
const LOAD_EVENT = 'event/LOAD_EVENT';

// ------------------------------------ //
//!       Action Creators
// ------------------------------------ //
const loadEvent = list => {
    type: LOAD_EVENT,
    list
}

// ------------------------------------ //
//!       Thunk Action Creators
// ------------------------------------ //
export const getEvent = () => async dispatch => {
    const response = await csrfFetch(`/api/events`);

    if (response.ok) {
        const list = await response.json();
        dispatch(loadEvent(list));
    }
}

// ------------------------------------ //
const initialState = {};

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_EVENT: {
            const allEvents = {};
            console.log(action);
        }
    }
}