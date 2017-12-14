import * as Actions from '../actions'

const initialState = {
    user: null,
    error: null,
    loading: false
}

export default (state = initialState, action) => {
  switch(action.type) {
    case Actions.USER_LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user,
        loading: false
      }
    case Actions.USER_LOGIN_ERROR:
      return {
        ...state,
        user: null,
        error: action.error,
        loading: false
      }
    case Actions.USER_LOGIN_LOADING:
      return {
        ...state,
        user: null,
        error: null,
        loading: true
      }
    case Actions.USER_LOGOUT:
      return {
        ...state,
        user: null
      }
    default: return state
  }
}