import firebase from 'firebase'
const fireConfig = {
  apiKey: 'AIzaSyD3mvjHo8PLKpUAzocveRNKxZsp9Hb_3dc',
  authDomain: 'mamanafrica-37f3f.firebaseapp.com',
  databaseURL: 'https://mamanafrica-37f3f.firebaseio.com',
  projectId: 'mamanafrica-37f3f',
  storageBucket: 'mamanafrica-37f3f.appspot.com',
  messagingSenderId: '240491231437'
}

let fireApp
if (!fireApp && firebase.apps.length) {
  fireApp = firebase.initializeApp(fireConfig)
} else {
  fireApp = firebase.app()
}

export default fireApp
