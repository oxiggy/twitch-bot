import { take, takeLatest, put, fork, call } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { AUTH_CHECK_REQUEST, AUTH_CHECK_SUCCESS } from '../actions/appActions'
import { AUTHENTICATE, AUTHENTICATE_FAILURE } from '../actions/appActions'
import { EXIT } from '../actions/appActions'

import db from '../db'

export default function * () {
    yield fork(firebaseAuthStateListener)
    yield takeLatest(AUTHENTICATE, onAuthenticate)
    yield takeLatest(EXIT, onExit)
}

function * firebaseAuthStateListener() {
    yield put({ type:AUTH_CHECK_REQUEST })
    const channel = new eventChannel(emiter => {
        const unsubscribe= db.auth().onAuthStateChanged(function (auth) {
            emiter({ auth })
        })
        return () => {
            unsubscribe()
        }
    })
    while (true) {
        const { auth } = yield take(channel)
        yield put({ type:AUTH_CHECK_SUCCESS, payload:{ auth } })
    }
}

function * onAuthenticate({ payload:{ data } }) {
    try {
        yield db.auth().signInWithEmailAndPassword(data.email, data.password)
    } catch (error) {
        yield put({ type:AUTHENTICATE_FAILURE, payload:{ error } })
    }
}

function * onExit() {
    yield db.auth().signOut()
}
