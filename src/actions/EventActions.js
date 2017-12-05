import * as Actions from './'

const BASE_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'

export function getAll(user) {
  return async (dispatch) => {
    dispatch(getAllInProgress())

    const headers = {
      Authorization: 'Bearer ' + user.accessToken
    }
    const min = new Date('2017/11/01').toISOString()
    
    try {
      const response = await fetch(BASE_URL + '?timeMin=' + min, { headers })
      if (response.status != '200')
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
  return {
    type: Actions.GET_ALL_ERROR,
    error
  }
}