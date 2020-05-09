import { createStore } from 'redux-dynamic-modules'
import { getSagaExtension } from 'redux-dynamic-modules-saga'
import { getThunkExtension } from 'redux-dynamic-modules-thunk'

import app from './reducers/appReducer'
import appSaga from './sagas/appSaga'

export default createStore({
        initialState: {},
        enhancers: [],
        extensions: [
            getSagaExtension(),
            getThunkExtension(),
        ],
    },
    {
        id: 'app',
        reducerMap: {
            app
        },
        sagas: [
            appSaga
        ],
    },
)
