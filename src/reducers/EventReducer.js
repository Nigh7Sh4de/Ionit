import * as Actions from '../actions'

const initialState = {
  data: [],
  loaded: false,
  isLoading: false,
  error: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case Actions.GET_ALL_LOADING:
      return {
        ...state,
        data: [],
        loaded: false,
        isLoading: true
      }
    case Actions.GET_ALL_SUCCESS:
      return {
        ...state,
        loaded: true,
        isLoading: false,
        data: action.data
      }
    case Actions.GET_ALL_ERROR:
      return {
        ...state,
        loaded: false,
        isLoading: false,
        error: action.error
      }
    default: return state
  }
}