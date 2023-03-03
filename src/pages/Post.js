import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  Grid,
  Image,
  Header,
  Segment,
  Icon,
  Comment,
  Form,
  Modal,
  Message,
  Button
} from 'semantic-ui-react'
import firebase from '../utils/firebase'
import 'firebase/compat/storage'
import 'firebase/compat/auth'

import { Context } from 'components/Context'

const Post = () => {
  //get https:// ... /postId?
  const { user } = useContext(Context)
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [commentContent, setCommentContent] = useState('')
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  console.log(user)

  //get firebase storage 'posts'
  useEffect(() => {
    firebase.firestore().collection('posts').doc(postId)
      .onSnapshot(docSnapshot => (
        setPost(docSnapshot.data())
      ))
  }, [])

  //get firebase storage 'posts' ==> 'comments'
  useEffect(() => {
    firebase.firestore().collection('posts').doc(postId)
      .collection('comments')
      .orderBy('createdAt')
      .onSnapshot(collectionSnapshot => {
        const data = collectionSnapshot.docs.map(doc => (
          doc.data()
        ))
        setComments(data)
      })
  }, [])

  //handle collected & liked change
  const handleToggle = (isActive, field) => {
    const user = firebase.auth().currentUser?.uid
    if (!user) {
      setIsAlertOpen(!isAlertOpen)
      setTimeout(() => {
        navigate('/signin')
        setIsAlertOpen(false)
      }, 1500);
    }
    firebase.firestore().collection('posts').doc(postId).update({
      [field]: isActive
        ? firebase.firestore.FieldValue.arrayRemove(user)
        : firebase.firestore.FieldValue.arrayUnion(user)
    })
  }

  //judge is collection?
  const isCollected = post?.collectedBy?.includes(firebase.auth().currentUser?.uid)

  //judge is liked?
  const isLiked = post?.likedBy?.includes(firebase.auth().currentUser?.uid)

  //handle comment submit
  const handleCommentSubmit = () => {
    const user = firebase.auth().currentUser?.uid
    if (!user) {
      setIsAlertOpen(!isAlertOpen)
      setTimeout(() => {
        navigate('/signin')
        setIsAlertOpen(false)
      }, 1500)
      return
    }
    if (!user.photoURL || !user.displayName) {
      setIsAlertOpen(!isAlertOpen)
      setTimeout(() => {
        navigate('/user/settings')
        setIsAlertOpen(false)
      }, 1500);
      return
    }
    if (!commentContent) {
      setErrorMessage('請輸入留言內容！')
      return
    }
    setIsLoading(true)
    const firestore = firebase.firestore()
    const batch = firestore.batch()
    const postRef = firestore.collection('posts').doc(postId)
    const { uid, displayName, photoURL } = firebase.auth().currentUser
    batch.update(postRef, {
      commentsCount: firebase.firestore.FieldValue.increment(1)
    })
    const commentRef = postRef.collection('comments').doc()
    batch.set(commentRef, {
      content: commentContent,
      createdAt: firebase.firestore.Timestamp.now(),
      author: {
        uid,
        displayName: displayName || '使用者',
        photoURL: photoURL || ''
      }
    })
    //clear textarea and change isLoading state
    batch.commit().then(() => {
      setCommentContent('')
      setErrorMessage('')
      setIsLoading(false)
    })
  }

  //handle scroll
  const handleBackPage = () => {
    navigate(-1)
  }

  return (
    <Grid.Column width={10} textAlign='left'>
      <Modal size='mini' open={isAlertOpen} centered={false}>
        <Modal.Header>訊息</Modal.Header>
        <Modal.Content>請先設定會員資料</Modal.Content>
      </Modal>
      {
        post &&
        <>
          <Button onClick={handleBackPage} floated='right'>返回</Button>
          {
            post.author?.photoURL
              ? <Image src={post.author?.photoURL} avatar wrapped />
              : <Icon name='user circle' size='big' />
          }
          {post.author.displayName || '使用者'}
          <Header size='huge'>
            {post.title}
            <Header.Subheader style={{ marginTop: 10 }}>
              {post.topic}{` | `}
              {post.createdAt?.toDate().toLocaleString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
              }).replace(/\//g, '-')}
            </Header.Subheader>
          </Header>
          <Image src={post.imageUrl} size='big' />
          <Segment basic vertical style={{ marginTop: 30, marginBottom: 20 }}>
            {post.content}
          </Segment>
          <Segment basic vertical size='big'>
            留言 {post.commentsCount || 0} ∙ 讚 {post.likedBy?.length || 0} ∙ 收藏 {post.collectedBy?.length || 0}
          </Segment>
          <Segment basic vertical>
            <Icon
              name={isLiked ? 'heart' : 'heart outline'}
              color={isLiked ? 'red' : 'grey'}
              size='large'
              style={{ margin: 10 }}
              link
              onClick={() => handleToggle(isLiked, 'likedBy')}
            />
            <Icon
              name={`${isCollected ? 'bookmark' : 'bookmark outline'}`}
              color={isCollected ? 'blue' : 'grey'}
              size='large'
              style={{ margin: 10 }}
              link
              onClick={() => handleToggle(isCollected, 'collectedBy')}
            />
          </Segment>
          <Comment.Group>
            <Form reply>
              <Form.TextArea
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)} />
              <Form.Button
                onClick={handleCommentSubmit}
                loading={isLoading}
              >
                留言
              </Form.Button>
              {
                errorMessage && <Message negative>{errorMessage}</Message>
              }
            </Form>
            <Header>共 {post.commentsCount || 0} 則留言</Header>
            {
              comments &&
              comments.map((comment, index) => (
                <Comment key={index}>
                  {
                    comment.author?.photoURL
                      ? <Comment.Avatar src={comment.author?.photoURL} />
                      : <Comment.Avatar
                        src='https://react.semantic-ui.com/images/wireframe/image.png' />
                  }
                  <Comment.Content>
                    <Comment.Author as='span'>
                      {comment.author?.displayName || '使用者'}
                    </Comment.Author>
                    <Comment.Metadata>
                      {post.createdAt?.toDate().toLocaleString('zh-TW', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false
                      }).replace(/\//g, '-')}
                    </Comment.Metadata>
                    <Comment.Text>
                      {comment.content}
                    </Comment.Text>
                  </Comment.Content>
                </Comment>
              ))
            }
          </Comment.Group>
        </>
      }
    </Grid.Column>
  )
}

export default Post