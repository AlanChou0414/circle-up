import React, { useState } from "react"
import { useNavigate } from 'react-router'
import {
  Button,
  Header,
  Segment,
  Modal,
  Input,
  Image,
  Message
} from 'semantic-ui-react'
import firebase from '../../utils/firebase'
import 'firebase/compat/auth'

export const UserName = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

  //handle update user displayName
  const handleSubmitUserName = () => {
    if (!displayName) return setErrorMessage('請輸入修改名稱！')
    setIsLoading(true)
    const postRef = firebase.firestore().collection('posts').where('author.uid', '==', user.uid)
    postRef.get()
      .then(querySnapshot => {
        querySnapshot.docs.map(docSnapshot => {
          docSnapshot.ref.update({ 'author.displayName': displayName })
          // const commentsRef = docSnapshot.ref.collection('comments').where('author.uid', '==', user.uid)
          // commentsRef.get()
          //   .then(commentsQuerySnapshot => {
          //     console.log(commentsQuerySnapshot.docs());
          //     commentsQuerySnapshot.ref.update({
          //       'author.displayName': displayName 
          //     })
          //   })
        })
      })
    //update user displayName
    user.updateProfile({
      displayName
    }).then(() => {
      setDisplayName('')
      setIsModalOpen(false)
      setIsLoading(false)
      setErrorMessage('')
    })
  }

  //handle cancel button
  const handleCancel = () => {
    setIsModalOpen(!isModalOpen)
    setErrorMessage('')
  }

  return (
    <>
      <Header>
        會員名稱
        <Button
          floated='right'
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          修改
        </Button>
      </Header>
      <Segment vertical>{user?.displayName || '使用者'}</Segment>
      <Modal open={isModalOpen} size='mini'>
        <Modal.Header>修改會員名稱</Modal.Header>
        <Modal.Content>
          <Input
            type='text'
            value={displayName}
            placeholder='輸入新的會員名稱'
            fluid
            onChange={(e) => setDisplayName(e.target.value)}
          />
          {
            errorMessage && <Message negative>{errorMessage}</Message>
          }
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleCancel}>取消</Button>
          <Button onClick={handleSubmitUserName} loading={isLoading}>修改</Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export const UserPhoto = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

  //change file to URL
  const previewImageUrl = file ? URL.createObjectURL(file) : user?.photoURL

  //handle update user photoURL
  const handleSubmitUserPhoto = () => {
    if (!file || file === null || undefined) return setErrorMessage('請上傳照片！')
    setIsLoading(true)
    const fileRef = firebase.storage().ref('user-photos/' + user.uid)
    const metadata = {
      contentType: file.type
    }
    fileRef.put(file, metadata).then(() => {
      fileRef.getDownloadURL().then(imageUrl => {
        //update all user posts info
        const postRef = firebase.firestore().collection('posts').where('author.uid', '==', user.uid)
        postRef.get()
          .then(querySnapshot => {
            querySnapshot.docs.map(docSnapshot => {
              docSnapshot.ref.update({ 'author.photoURL': imageUrl })
              // const commentsRef = docSnapshot.ref.collection('comments').where('author.uid', '==', user.uid)
              // commentsRef.get()
              //   .then(commentsQuerySnapshot => {
              //     commentsQuerySnapshot.ref.update({
              //       'author.photoURL': imageUrl
              //     })
              //   })
            })
          })
        //update user photo
        user.updateProfile({
          photoURL: imageUrl
        }).then(() => {
          setFile(null)
          setIsModalOpen(false)
          setIsLoading(false)
          setErrorMessage('')
        })
      })
    })
  }

  //handle cancel button
  const handleCancel = () => {
    setIsModalOpen(!isModalOpen)
    setErrorMessage('')
  }

  return (
    <>
      <Header>
        會員照片
        <Button
          floated='right'
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          修改
        </Button>
      </Header>
      <Segment vertical>
        <Image src={user?.photoURL
          || 'https://react.semantic-ui.com/images/wireframe/image.png'} avatar />
      </Segment>
      <Modal open={isModalOpen} size='mini'>
        <Modal.Header>修改會員照片</Modal.Header>
        <Modal.Content image>
          <Image src={previewImageUrl} avatar wrapped centered />
          <Modal.Description>
            <Button as='label' htmlFor='post-image'>上傳</Button>
            <Input
              type='file'
              id='post-image'
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Modal.Description>
        </Modal.Content>
        {
          errorMessage && <Message negative>{errorMessage}</Message>
        }
        <Modal.Actions>
          <Button onClick={handleCancel}>取消</Button>
          <Button onClick={handleSubmitUserPhoto} loading={isLoading}>修改</Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export const UserPassword = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [password, setPassword] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

  const navigate = useNavigate()

  //handle input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPassword({
      ...password,
      [name]: value
    })
  }

  //handle update user password
  const handleSubmitUserPassword = () => {
    const { oldPassword, newPassword } = password
    if (!oldPassword || !newPassword) return setErrorMessage('請輸入目前密碼與更換密碼！')
    setIsLoading(true)
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      oldPassword
    )
    //check user password true or false
    user.reauthenticateWithCredential(credential)
      .then(() => {
        user.updatePassword(newPassword)
          .then(() => {
            setPassword({})
            setIsModalOpen(false)
            setIsLoading(false)
            setErrorMessage('')
            setIsAlertOpen(!isAlertOpen)
            setTimeout(() => {
              firebase.auth().signOut()
              navigate('/posts')
              setIsAlertOpen(false)
            }, 2000)
          })
          .catch(error => {
            switch (error.code) {
              case 'auth/weak-password':
                setErrorMessage('密碼強度不足！')
                break
              case 'auth/too-many-requests':
                setErrorMessage(`錯誤次數過多，已鎖定帳號1小時！`)
                break
              default:
            }
            setIsLoading(false)
          })
      }).catch(error => {
        switch (error.code) {
          case 'auth/wrong-password':
            setErrorMessage('密碼錯誤!')
            break
          case 'auth/too-many-requests':
            setErrorMessage(`錯誤次數過多，已鎖定帳號1小時！`)
            break
          default:
        }
        setIsLoading(false)
      })
  }

  //handle cancel button
  const handleCancel = () => {
    setIsModalOpen(!isModalOpen)
    setErrorMessage('')
  }

  return (
    <>
      <Header>
        會員密碼
        <Button
          floated='right'
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          修改
        </Button>
      </Header>
      <Segment vertical>*******</Segment>
      <Modal open={isModalOpen} size='mini'>
        <Modal.Header>修改會員密碼</Modal.Header>
        <Modal.Content>
          <Header>目前密碼</Header>
          <Input
            type='password'
            name='oldPassword'
            value={password?.oldPassword || ''}
            placeholder='輸入舊密碼'
            fluid
            onChange={handlePasswordChange}
          />
          <Header>更改密碼</Header>
          <Input
            type='password'
            name='newPassword'
            value={password?.newPassword || ''}
            placeholder='輸入新密碼'
            fluid
            onChange={handlePasswordChange}
          />
          {
            errorMessage && <Message negative>{errorMessage}</Message>
          }
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleCancel}>取消</Button>
          <Button onClick={handleSubmitUserPassword} loading={isLoading}>修改</Button>
        </Modal.Actions>
      </Modal>

      <Modal open={isAlertOpen} size='mini' centered={false}>
        <Modal.Header>訊息</Modal.Header>
        <Modal.Content>密碼更改成功，請重新登入！</Modal.Content>
      </Modal>
    </>
  )
}