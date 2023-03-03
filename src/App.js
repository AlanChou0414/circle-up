import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

//context & custom hook
import { Context } from 'components/Context'
import useAuth from 'hooks/useAuth'

//protect router
import ProtectRouter from 'utils/ProtectRouter'

const App = () => {
  const { user, setUser } = useAuth()

  return (
    <BrowserRouter>
      <Context.Provider value={{ user, setUser }} >
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/posts/*' element={<PostNavigate />} end />
            <Route path='/user/*' element={<UserNavigate />} end />
            <Route path='/new-post' element={
              <ProtectRouter>
                <NewPost />
              </ProtectRouter>
            } />
            <Route path='/signin' element={<Signin />} />
            <Route path='*' element={<NotFind />} />
          </Route>
        </Routes>
      </Context.Provider>
    </BrowserRouter>
  )
}

export default App