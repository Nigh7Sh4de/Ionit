import storage from 'redux-persist/lib/storage';
import * as Actions from '../actions'
import persistReducer from 'redux-persist/lib/persistReducer';
import createTransform from 'redux-persist/lib/createTransform';
import createMigrate from 'redux-persist/lib/createMigrate';

const initialState = {
  data: [],
  data_loading: false,
  data_error: null,
  
  filtered_data: [],

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
        filtered_data: [],
        data_loading: true
      }
    case Actions.GET_ALL_SUCCESS:
      return {
        ...state,
        data: action.data,
        filtered_data: action.data,
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
        data: state.data.filter(i => i.id != action.event.id).concat([action.event]),
        filtered_data: state.filtered_data.filter(i => i.id != action.event.id).concat([action.event])
      }
    case Actions.EVENT_DELETED:
      return {
        ...state,
        data: state.data.filter(i => i.id != action.event.id),
        filtered_data: state.filtered_data.filter(i => i.id != action.event.id)
      }
    case Actions.EVENT_FOCUSED:
      let filtered_data = state.filtered_data
      if (!filtered_data.find(i=>i.id===action.id))
        filtered_data = [...state.data]
    
      const expanded = getExpandedObject(action.id, filtered_data)

      return {
        ...state,
        ...expanded,
        filtered_data
      }
    case Actions.EVENT_UNFOCUSED:
      const collapsed = getExpandedObject(null, state.data)
      return {
        ...state,
        ...collapsed
      }
    case Actions.FILTER_UPDATED:
      return {
        ...state,
        filtered_data: state.data.filter(i => (
          !(action.filter.master && i.extendedProperties && i.extendedProperties.shared.parent) &&
          !(action.filter.search && i.summary.toLocaleLowerCase().indexOf(action.filter.search.toLocaleLowerCase()))
        )),
      }
    default: return state
  }
}