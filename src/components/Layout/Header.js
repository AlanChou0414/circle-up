import React, { useState, useEffect } from 'react'
import { Container, Menu, Search, Modal } from 'semantic-ui-react'
import { Link, useNavigate } from 'react-router-dom'
import firebase from '../../utils/firebase'
import 'firebase/compat/auth'

const Header = ({ user }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  //handle user sign out
  const handleUserSignOut = () => {
    setIsAlertOpen(!isAlertOpen)
    setErrorMessage('已登出！')
    setTimeout(() => {
      firebase.auth().signOut()
      navigate('/signin')
      setIsAlertOpen(false)
      setErrorMessage('')
    }, 1500);
  }

  //handle new user want to post
  const handleNewPost = () => {
    const { displayName } = user
    if (displayName === null) {
      setIsAlertOpen(!isAlertOpen)
      setErrorMessage('請先設定會員資料')
      setTimeout(() => {
        navigate('/user/settings')
        setIsAlertOpen(false)
        setErrorMessage('')
      }, 1500)
      return
    }
    navigate('/new-post')
  }

  return (
    <Menu size='large' inverted fixed='top'>
      <Container>
        <Modal size='mini' open={isAlertOpen} centered={false}>
          <Modal.Header>訊息</Modal.Header>
          <Modal.Content>{errorMessage}</Modal.Content>
        </Modal>
        <Menu.Item as={Link} to='/posts' style={{ fontSize: 20 }}>
          Circle Up
        </Menu.Item>
        {/* <Menu.Item >
          <Search size='mini' />
        </Menu.Item> */}
        <Menu.Menu position='right'>
          {
            user
              ?
              <>
                <Menu.Item onClick={handleNewPost}>
                  發表文章
                </Menu.Item>
                <Menu.Item as={Link} to='/user/posts'>
                  會員
                </Menu.Item>
                <Menu.Item onClick={handleUserSignOut} >
                  登出
                </Menu.Item>
              </>
              :
              <Menu.Item as={Link} to='/signin'>
                註冊／登入
              </Menu.Item>
          }
        </Menu.Menu>
      </Container>
    </Menu>
  )
}

export default Header