import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import firebase from 'utils/firebase'
import 'firebase/compat/auth'

//pages
import Signin from 'pages/Signin'
import NewPost from 'pages/NewPost'
import Layout from 'components/Layout/Layout'
import PostNavigate from 'components/Layout/PostNavigate'
import UserNavigate from 'components/Layout/UserNavigate'
import NotFind from 'pages/NotFind'

//components
import ScrollToTop from 'components/ScrollToTop'
import Home from 'pages/Home'

const App = () => {
  const [user, setUser] = useState(null)

  //listen user is login?
  useEffect(() => {
    firebase.auth().onAuthStateChanged(currentUser => {
      setUser(currentUser)
    })
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Layout user={user} />}>
          <Route index element={<Home />} />
          <Route path='/posts/*' element={<PostNavigate user={user} />} end />
          <Route path='/user/*' element={<UserNavigate user={user} />} end />
          <Route path='/new-post' element={<NewPost user={user} />} />
          <Route path='/signin' element={<Signin user={user} />} />
          <Route path='*' element={<NotFind />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App