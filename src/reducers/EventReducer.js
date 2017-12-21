import * as Actions from '../actions'

const initialState = {
  data: [],
  data_loading: false,
  data_error: null
  // loading: false,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case Actions.GET_ALL_LOADING:
      return {
        ...state,
        data: [],
        data_loading: true
      }
    case Actions.GET_ALL_SUCCESS:
      return {
        ...state,
        data: action.data,
        data_loading: false
      }
    case Actions.GET_ALL_ERROR:
      return {
        ...state,
        data_error: action.error,
        data_loading: false
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