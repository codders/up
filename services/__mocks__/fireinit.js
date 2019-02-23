import firebasemock from 'firebase-mock'

const auth = new firebasemock.MockAuthentication()
const StoreDB = new firebasemock.MockFirestore()

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

StoreDB.autoFlush()
mocksdk.initializeApp()

export { auth, StoreDB }
export default mocksdk
