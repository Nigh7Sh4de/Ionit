import * as Actions from './'

const BASE_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'

const stringifyAndKillNulls = object =>
  JSON.stringify(object, (key, value) => 
    value == null ? undefined : value
  )

export function createEvent(event, user) {
  return async (dispatch, getState) => {
    dispatch(actionInProgress())
    try {
      const accessToken = (user || getState().UserReducer.user).accessToken
      const response = await fetch(BASE_URL, {
        method: 'POST',
        body: stringifyAndKillNulls(event),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      })
      if (!response.ok) throw JSON.parse(response._bodyInit).error
      const result = JSON.parse(response._bodyInit)
      console.log('eventCreated', result)
      dispatch(eventCreated(result))
      dispatch(actionSuccess())
    }
    catch(e) { dispatch(actionError(e)) }
  }
}
export function updateEvent(event, user) {
  return async (dispatch, getState) => {
    dispatch(actionInProgress())
    try {
      const accessToken = (user || getState().UserReducer.user).accessToken
      const response = await fetch(BASE_URL + '/' + event.id, {
        method: 'PUT',
        body: stringifyAndKillNulls(event),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      })
      if (!response.ok) throw JSON.parse(response._bodyInit).error
      const result = JSON.parse(response._bodyInit)
      console.log('eventUpdated', result)
      dispatch(eventUpdated(result))
      dispatch(actionSuccess())
    }
    catch(e) { dispatch(actionError(e)) }
  }
}
export function deleteEvent(event, user) {
  return async (dispatch, getState) => {
    dispatch(actionInProgress())
    try {
      const accessToken = (user || getState().UserReducer.user).accessToken 
      const response = await fetch(BASE_URL + '/' + event.id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      })
      if (!response.ok) throw JSON.parse(response._bodyInit).error
      const result = JSON.parse(response._bodyInit)
      console.log('eventDeleted', result)
      dispatch(eventDeleted(result))
      dispatch(actionSuccess())
    }
    catch(e) { dispatch(actionError(e)) }
  }
}
export function editEvent(event) {
  return {
    type: Actions.EDIT_EVENT,
    event
  }
}

export function eventCreated(event) {
  return {
    type: Actions.EVENT_CREATED,
    event
  }
}
export function eventUpdated(event) {
  return {
    type: Actions.EVENT_UPDATED,
    event
  }
}
export function eventDeleted(event) {
  return {
    type: Actions.EVENT_DELETED,
    event
  }
}

export function actionCancelled() {
  return {
    type: Actions.ACTION_CANCELLED
  }
}
export function actionInProgress() {
  return {
    type: Actions.ACTION_LOADING
  }
}
export function actionSuccess() {
  return {
    type: Actions.ACTION_SUCCESS
  }
}
export function actionError(error) {
  console.error(error)
  return {
    type: Actions.ACTION_ERROR,
    error
  }
}

export function getAll(user) {
  return async (dispatch, getState) => {
    dispatch(getAllInProgress())

    const accessToken = (user || getState().UserReducer.user).accessToken
    const min = new Date('2017/11/01').toISOString()
    try {
      const response = await fetch(BASE_URL + '?timeMin=' + min, { 
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })
      if (!response.ok)
        throw JSON.parse(response._bodyInit).error
        
      const list = JSON.parse(response._bodyInit).items.filter(item => (
        item.status != 'cancelled'
      ))
      dispatch(getAllSuccess(list))
    }
    catch(e) { getAllError(e) }
  }
}
export function getAllInProgress() {
  return {
    type: Actions.GET_ALL_LOADING
  }
}
export function getAllSuccess(data) {
  return {
    type: Actions.GET_ALL_SUCCESS,
    data
  }
}
export function getAllError(error) {
  console.error(error)
  return {
    type: Actions.GET_ALL_ERROR,
    error
  }
}