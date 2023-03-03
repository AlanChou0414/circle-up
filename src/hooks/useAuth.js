import { useState, useEffect } from 'react'
import firebase from 'utils/firebase'
import 'firebase/compat/auth'

const useAuth = () => {
  const [user, setUser] = useState(null)

  //listen user is login?
  useEffect(() => {
    firebase.auth().onAuthStateChanged(currentUser => {
      setUser(currentUser)
    })
  }, [])
  
  return { user, setUser }
}

export default useAuth