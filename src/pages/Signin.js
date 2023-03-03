import React, { useState, useContext } from 'react'
import { Menu, Form, Container, Message, Modal, Header, Button } from 'semantic-ui-react'
import { useNavigate } from 'react-router'
import 'firebase/compat/auth'
import firebase from '../utils/firebase'

import { Context } from 'components/Context'

const Signin = () => {
  const { user } = useContext(Context)
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState('register')
  const [inputData, setInputData] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  //handle onChange
  const handleInputData = (event) => {
    const { name, value } = event.target
    setInputData({
      ...inputData,
      [name]: value
    })
  }

  //handle form submit
  const handleOnSubmit = () => {
    setIsLoading(true)
    const { email, password } = inputData
    activeItem === 'register'
      //signup
      ? firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          setIsAlertOpen(!isAlertOpen)
          setAlertMessage('感謝您的註冊，歡迎光臨！')
          setIsLoading(false)
          setTimeout(() => {
            navigate(-1)
            setIsAlertOpen(false)
          }, 1500);
        })
        .catch(error => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              setErrorMessage('信箱已存在！')
              break
            case 'auth/invalid-email':
              setErrorMessage('信箱格式不正確！')
              break
            case 'auth/weak-password':
              setErrorMessage('密碼強度不足！')
              break
            default:
          }
          setIsLoading(false)
        })
      //login
      : firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
          setIsAlertOpen(!isAlertOpen)
          setAlertMessage('歡迎回來！')
          setIsLoading(false)
          setTimeout(() => {
            navigate(-1)
            setIsAlertOpen(false)
          }, 1500);
        })
        .catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
              setErrorMessage('信箱格式不正確！')
              break
            case 'auth/user-not-found':
              setErrorMessage('信箱不存在！')
              break
            case 'auth/wrong-password':
              setErrorMessage('密碼錯誤！')
              break
            default:
          }
          setIsLoading(false)
        })
  }

  //handle go back
  const handleGoBack = () => (
    navigate(-1)
  )

  return (
    user
      ? (
        <>
          <Modal size='mini' open={isAlertOpen} centered={false}>
            <Modal.Header>訊息</Modal.Header>
            <Modal.Content>
              {
                user?.displayName
                  ? `${user.displayName} ${alertMessage}`
                  : alertMessage
              }
            </Modal.Content>
          </Modal>
          <Container text textAlign='center'>
            <Header size='huge'>登入中</Header>
            <Button size='big' onClick={handleGoBack}>返回上一頁</Button>
          </Container>
        </>
      )
      :
      <Container text>
        <Menu widths='2'>
          <Menu.Item
            active={activeItem === 'register'}
            onClick={() => {
              setActiveItem('register')
              setErrorMessage('')
            }}
          >
            註冊
          </Menu.Item>
          <Menu.Item
            active={activeItem === 'signin'}
            onClick={() => {
              setActiveItem('signin')
              setErrorMessage('')
            }}
          >
            登入
          </Menu.Item>
        </Menu>
        <Container text style={{ padding: '20px 150px' }}>
          <Form onSubmit={handleOnSubmit}>
            <Form.Input
              label='信箱'
              name='email'
              type='email'
              value={inputData.email || ''}
              placeholder='請輸入信箱'
              onChange={handleInputData}
              required
            />
            <Form.Input
              label='密碼'
              name='password'
              type='password'
              value={inputData.password || ''}
              placeholder='請輸入密碼'
              onChange={handleInputData}
              required
            />
            {
              errorMessage && <Message negative>{errorMessage}</Message>
            }
            <Container textAlign='center' style={{ marginTop: 50 }}>
              <Form.Button loading={isLoading} size='large'>
                {activeItem === 'register' ? '註冊' : '登入'}
              </Form.Button>
            </Container>
          </Form>
        </Container>
      </Container >
  )
}

export default Signin