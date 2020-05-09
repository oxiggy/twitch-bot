import { AUTH_CHECK_REQUEST, AUTH_CHECK_SUCCESS } from '../actions/appActions'
import { AUTHENTICATE, AUTHENTICATE_FAILURE } from '../actions/appActions'

export const DEFAULT_STATE= {
    authChecking: false,
    authChecked: false,
    auth: null,

    authenticating: false,
    authenticatingError: null,
}

export default (state= DEFAULT_STATE, { type, payload }) => {
    switch (type) {

        case AUTH_CHECK_REQUEST: {
            return {
                ...state,
                authChecking: true,
                authChecked: false,
                auth: null,
                authenticating: false,
            }
        }

        case AUTH_CHECK_SUCCESS: {
            return {
                ...state,
                authChecking: false,
                authChecked: true,
                auth: payload.auth,
                authenticating: false,
            }
        }

        case AUTHENTICATE: {
            return {
                ...state,
                authenticating: true,
                authenticatingError: null,
            }
        }

        case AUTHENTICATE_FAILURE: {
            return {
                ...state,
                authenticating: false,
                authenticatingError: payload.error,
            }
        }

        default: {
            return state
        }
    }
}
