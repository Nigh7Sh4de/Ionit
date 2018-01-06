import * as Actions from '../actions'

const initialState = {
  data: [],
  data_loading: false,
  data_error: null,

  expanded_id: null,
  expanded_length: undefined,
  expanded_index: undefined
  // loading: false,
}

getExpandedObject = (id, data) => {
  let expanded_id = id,
      expanded_index,
      expanded_length = 140,
      children = 0

  if (id) {
    data.forEach((i, index) => {
      if (i.id === id)
        expanded_index = index
      else if (i.extendedProperties && 
        i.extendedProperties.shared &&
        i.extendedProperties.shared.parent === id)
        children++
    })
    expanded_length += children * 40
  }

  return {
    expanded_id,
    expanded_index,
    expanded_length
  }
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
    case Actions.EVENT_FOCUSED:
      const expanded = getExpandedObject(action.id, state.data)
      return {
        ...state,
        ...expanded
      }
    case Actions.EVENT_UNFOCUSED:
      const collapsed = getExpandedObject(null, state.data)
      return {
        ...state,
        ...collapsed
      }
    default: return state
  }
}