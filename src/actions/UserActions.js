import * as Actions from './'
import { getAll } from './EventActions'
import GoogleSignIn from 'react-native-google-sign-in';

GoogleSignIn.configure({
    // clientID: ' 516748484660-3bibe4sloi0cd9l1dfecqcn871nf8ie2.apps.googleusercontent.com ', //Debug
    clientID: '516748484660-e1713ne24akk8pk8qd5nhpc1nc25ibl0.apps.googleusercontent.com', //Release
    scopes: [
      'https://www.googleapis.com/auth/calendar'
    ]
  });

export function signIn() {
    return async dispatch => {
        dispatch(signInLoading())
        try {
            const user = await GoogleSignIn.signInPromise()
            dispatch(signInSuccess(user))
        }
        catch(e) { signInError(e) }
    }
}

export function signInSilently() {
    return async dispatch => {
        dispatch(signInLoading())
        try {
            const user = await GoogleSignIn.signInSilentlyPromise()
            dispatch(signInSuccess(user))
        }
        catch(e) { signInError(e) }
    }
}

export function signInSuccess(user) {
    return dispatch => {
        dispatch(signInUpdated(user))
        dispatch(getAll(user))
    }
}

export function signOut() {
    GoogleSignIn.signOut()
    return {
        type: Actions.USER_LOGOUT
    }
}

export function signInLoading() {
    return {
        type: Actions.USER_LOGIN_LOADING
    }
}

export function signInUpdated(user) {
    return {
        type: Actions.USER_LOGIN_SUCCESS,
        user
    }
}

export function signInError(error) {
    return {
        type: Actions.USER_LOGIN_ERROR,
        error
    }
}
