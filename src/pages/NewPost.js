import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Container, Dropdown, Form, Header, Image, Input, TextArea, Modal } from 'semantic-ui-react'
import firebase from '../utils/firebase'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

const NewPost = ({ user }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [inputData, setInputData] = useState({})
  const [topics, setTopics] = useState([])
  const [topicName, setTopicName] = useState('')
  const [file, setFile] = useState(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  //get firebase store topics
  useEffect(() => {
    firebase.firestore().collection('topics').get()
      .then(collectionSnapshot => {
        const data = collectionSnapshot.docs.map(doc => (doc.data()))
        setTopics(data)
      })
  }, [])

  //handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setInputData({
      ...inputData,
      [name]: value,
    })
  }

  //handle form submit
  const handleSubmit = () => {
    //create or selected hub name ==> 'posts'
    const { displayName, photoURL, uid, email } = firebase.auth().currentUser
    if (displayName === null) {
      setIsAlertOpen(!isAlertOpen)
      setTimeout(() => {
        navigate('/user/settings')
        setIsAlertOpen(false)
      }, 1500)
      return
    }
    const documentRef = firebase.firestore().collection('posts').doc()
    const fileRef = firebase.storage().ref('post-images/' + documentRef.id)
    //file content type
    const metadata = {
      contentType: file.type
    }
    //set hub info and file
    //file & info
    setIsLoading(true)
    fileRef.put(file, metadata)
      .then(() => {
        fileRef.getDownloadURL()
          .then(imageUrl => {
            documentRef.set({
              imageUrl,
              title: inputData.title,
              content: inputData.content,
              topic: topicName,
              createdAt: firebase.firestore.Timestamp.now(),
              author: {
                displayName: displayName || '',
                photoURL: photoURL || '',
                uid,
                email
              },
            })
              .then(() => {
                setIsLoading(false)
                navigate('/posts')
              })
          })
      })
  }

  //topics ==> Form.Dropdown options
  const options = topics.map(topic => ({ text: topic.name, value: topic.name }))

  //create image url
  const previewUrl = file
    ? URL.createObjectURL(file)
    : 'https://react.semantic-ui.com/images/wireframe/image.png'

  return (
    user
      ?
      <>
        <Modal size='mini' open={isAlertOpen} centered={false}>
          <Modal.Header>訊息</Modal.Header>
          <Modal.Content>請先設定會員資料</Modal.Content>
        </Modal>
        <Container text>
          <Header textAlign='center' size='huge'>發表文章</Header>
          <Form onSubmit={handleSubmit}>
            <Container text textAlign='center'>
              <Image
                src={previewUrl}
                size='medium'
                centered
              />
              <Button basic as='label' htmlFor='post-image' size='large' style={{ margin: 20 }} >
                上傳文章圖片
              </Button>
              <Form.Field
                control={Input}
                id='post-image'
                name='image'
                type='file'
                style={{ display: 'none' }}
                onChange={e => setFile(e.target.files[0])}
                accept="image/*"
                required
              />
            </Container>
            <Container text textAlign='center'>
              <Form.Field
                name='title'
                control={Input}
                type='text'
                value={inputData.title || ''}
                onChange={handleInputChange}
                placeholder='輸入文章標題'
                required
              />
              <Form.Field
                name='content'
                control={TextArea}
                value={inputData.content || ''}
                onChange={handleInputChange}
                placeholder='輸入文章內容'
                required
                rows={5}
              />
              <Form.Field
                value={topicName}
                control={Dropdown}
                type='select'
                onChange={(event, { value }) => setTopicName(value)}
                options={options}
                placeholder='選擇文章主體'
                selection
                required
              />
              <Form.Button loading={isLoading} size='large'>送出</Form.Button>
            </Container>
          </Form>
        </Container >
      </>
      : (
        user?.displayName === null
          ? window.location = '/user/settings'
          : ''
      )
  )
}

export default NewPost