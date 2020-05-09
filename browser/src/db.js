import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

const { REACT_APP_FIREBASE_CONFIG } = process.env

firebase.initializeApp(JSON.parse(REACT_APP_FIREBASE_CONFIG))

export default firebase
