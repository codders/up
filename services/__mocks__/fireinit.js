import firebasemock from 'firebase-mock'

export const auth = new firebasemock.MockAuthentication()
export const StoreDB = new firebasemock.MockFirestore()

const mocksdk = new firebasemock.MockFirebaseSdk(
  // use null if your code does not use RTDB
  null,
  // use null if your code does not use AUTHENTICATION
  () => auth,
  // use null if your code does not use FIRESTORE
  () => StoreDB,
  // use null if your code does not use STORAGE
  null,
  null
);

if (global.mocksdk == null) {
  global.mocksdk = mocksdk
  StoreDB.autoFlush()
  mocksdk.initializeApp()
}

export default mocksdk
