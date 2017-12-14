import * as Actions from '../actions'

const initialState = {
  data: [],
  // dataLoaded: false,
  // dataLoading: false,
  // dataError: null,
  // loading: false,
  // error: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case Actions.GET_ALL_LOADING:
      return {
        ...state,
        data: [],
        // dataLoaded: false,
        // dataLoading: true
      }
    case Actions.GET_ALL_SUCCESS:
      return {
        ...state,
        // dataLoaded: true,
        // dataLoading: false,
        data: action.data
      }
    case Actions.GET_ALL_ERROR:
      return {
        ...state,
        // dataLoaded: false,
        // dataLoading: false,
        // dataError: action.error
      }
    case Actions.ACTION_LOADING:
      return {
        ...state,
        // loading: true
      }
    case Actions.ACTION_ERROR:
      return {
        ...state,
        // loading: false,
      }
    case Actions.ACTION_SUCCESS: 
      return {
        ...state,
        // loading: false,
      }
    case Actions.EVENT_CREATED:
    case Actions.EVENT_UPDATED:
      return {
        ...state,
        data: state.data.filter(i => i.id != action.event.id).concat([action.event])
      }
    case Actions.EVENT_DELETED:
      return {
        ...state,
        data: state.data.filter(i => i.id != action.event.id)
      }
    default: return state
  }
}