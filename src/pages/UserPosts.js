import React, { useState, useEffect } from 'react'
import { Grid, Item, Header } from 'semantic-ui-react'
import firebase from '../utils/firebase'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

import Post from '../components/Post'

const UserPosts = () => {
  const [posts, setPosts] = useState()

  //get user post
  useEffect(() => {
    firebase.firestore().collection('posts')
      .where('author.uid', '==', firebase.auth().currentUser.uid)
      .get()
      .then(collectionSnapshot => {
        const data = collectionSnapshot.docs.map(docSnapshot => {
          //get post uuid
          const { id } = docSnapshot
          return { ...docSnapshot.data(), id }
        })
        setPosts(data)
      })
  }, [])

  return (
    <Grid.Column width={10}>
      <Header size='huge'>我的文章</Header>
      <Item.Group>
        {
          posts &&
          posts.map(post => (
            <Post key={post.id} post={post} />
          ))
        }
      </Item.Group>
    </Grid.Column>
  )
}

export default UserPosts