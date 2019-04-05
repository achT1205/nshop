import firebase from 'firebase'
const config = require('../config')()

let ifireApp, iadminApp

if (!ifireApp && !firebase.apps.length) {
  ifireApp = firebase.initializeApp(config.fireConfig)
  iadminApp = firebase.initializeApp(config.fireConfig, 'fireAdmin')
} else {
  ifireApp = firebase.app()
  iadminApp = firebase.app('fireAdmin')
}

const fireApp = ifireApp
const adminApp = iadminApp
export { fireApp, adminApp }
