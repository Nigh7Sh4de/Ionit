import * as Actions from '../actions'

const initialState = {
  data: [],
  // dataLoaded: false,
  // dataLoading: false,
  // dataError: null,
  data_loading: false,
  data_time_min: null,
  data_time_max: null,
  // error: null
}

const mergeEvents = (a, b) => {
  if (!a.length) return [...b]
  
  const result = []
  let i = 0,
      j = 0,
      r = 0
  for (;i<a.length;i++) {
    result[r++] = a[i]
    for (;j<b.length;j++) {
      if (b[j].id == a[i].id) continue
      const a_time = new Date(a[i].start.date || a[i].start.dateTime)
      const b_time = new Date(b[j].start.date || b[j].start.dateTime)
      if (b_time > a_time)
        break
      else
        result.splice(r++ - 1, 0, b[j])
    }
  }
  // debugger
  return result
}

export default (state = initialState, action) => {
  switch(action.type) {
    case Actions.GET_ALL_LOADING:
      return {
        ...state,
        data_loading: true
      }
    case Actions.GET_ALL_SUCCESS:
      const data = mergeEvents(state.data, action.data)
      // console.log(data)
      return {
        ...state,
        data,
        data_time_min: !data.length ? new Date() : new Date(data[0].start.date || data[0].start.dateTime),
        data_time_max: !data.length ? new Date() : new Date(data[data.length-1].start.date || data[data.length-1].start.dateTime),
        data_loading: false
      }
    case Actions.GET_ALL_ERROR:
      return {
        ...state,
        error: action.error,
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
        data: state.data.map(i=>i.id===action.event.id?action.event:i)
      }
    case Actions.EVENT_DELETED:
      return {
        ...state,
        data: state.data.filter(i => i.id != action.event.id)
      }
    default: return state
  }
}