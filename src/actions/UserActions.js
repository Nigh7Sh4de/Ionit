import * as Actions from './'
import GoogleSignIn from 'react-native-google-sign-in';

GoogleSignIn.configure({
    // clientID: '516748484660-l7rjdnvd8oafp38e0dut9r3l8ocgcser.apps.googleusercontent.com', //Laptop
    clientID: '516748484660-e1713ne24akk8pk8qd5nhpc1nc25ibl0.apps.googleusercontent.com', //Desktop
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

export function signInSuccess(user) {
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
