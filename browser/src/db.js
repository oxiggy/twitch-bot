import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

const { FIREBASE_CONFIG } = process.env

firebase.initializeApp(FIREBASE_CONFIG)

export default firebase
