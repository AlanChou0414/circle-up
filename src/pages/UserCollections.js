import React, { useState, useEffect } from 'react'
import { Grid, Item, Header } from 'semantic-ui-react'
import firebase from '../utils/firebase'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

import Post from '../components/Post'

const UserCollections = () => {
  const [posts, setPosts] = useState()

  //get user collections
  useEffect(() => {
    firebase.firestore().collection('posts')
      .where('collectedBy', 'array-contains', firebase.auth().currentUser.uid)
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
      <Header size='huge'>ζηζΆθ</Header>
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

export default UserCollections