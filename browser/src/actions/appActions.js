export const AUTH_CHECK_REQUEST= 'APP_AUTH_CHECK_REQUEST'
export const AUTH_CHECK_SUCCESS= 'APP_AUTH_CHECK_SUCCESS'

export const AUTHENTICATE= 'APP_AUTHENTICATE'
export const AUTHENTICATE_FAILURE= 'APP_AUTHENTICATE_FAILURE'

export const EXIT= 'APP_EXIT'

export function authenticate(data) {
    return {
        type: AUTHENTICATE,
        payload: {
            data,
        }
    }
}

export function exit() {
    return {
        type: EXIT,
    }
}
