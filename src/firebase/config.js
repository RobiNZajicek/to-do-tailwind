import firebase from "firebase/app"
import "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyDHpLS_9TwcAlLcl0Fez4lqe9iJdA45qBw",
    authDomain: "to-do-tailwind.firebaseapp.com",
    projectId: "to-do-tailwind",
    storageBucket: "to-do-tailwind.appspot.com",
    messagingSenderId: "701022286328",
    appId: "1:701022286328:web:422552a3e06d006b56660d"
  };


// počáteční nastavení firebase (init)
firebase.initializeApp(firebaseConfig)


// počáteční nastavení služeb (services)
const projectFirestore = firebase.firestore()


export { projectFirestore }