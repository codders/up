import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyAKjfV-PFotzvI9a3UHTLfnkITGpb-3G4Q',
  authDomain: 'up-now-a6da8.firebaseapp.com',
  databaseURL: 'https://up-now-a6da8.firebaseio.com',
  projectId: 'up-now-a6da8',
  storageBucket: 'up-now-a6da8.appspot.com',
  messagingSenderId: '884424894711'
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const StoreDB = firebase.firestore()
export default firebase
