import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { Grid, Item } from 'semantic-ui-react'
import firebase from '../utils/firebase'
import 'firebase/compat/storage'

//components
import Post from '../components/Post'

//library
import { Waypoint } from 'react-waypoint'

const Posts = ({ user }) => {
  const [posts, setPosts] = useState()
  const location = useLocation()
  const { search } = location
  const urlSearchParams = new URLSearchParams(search)
  const currentTopic = urlSearchParams.get('topic')

  //save post length
  const lastPostSnapshotRef = useRef()

  //get users posts
  useEffect(() => {
    currentTopic
      ?
      firebase.firestore().collection('posts')
        .where('topic', '==', currentTopic)
        .orderBy('createdAt', 'desc')
        .limit(4)
        .get()
        .then(collectionSnapshot => {
          const data = collectionSnapshot.docs.map(docSnapshot => {
            //get post uuid
            const { id } = docSnapshot
            return { ...docSnapshot.data(), id }
          })
          //to save current post length
          lastPostSnapshotRef.current =
            collectionSnapshot.docs[collectionSnapshot.docs.length - 1]
          setPosts(data)
        })
        .catch(error => {
          console.log(error)
        })
      :
      firebase.firestore().collection('posts')
        .orderBy('createdAt', 'desc')
        //only get 2 posts
        .limit(4)
        .get()
        .then(collectionSnapshot => {
          const data = collectionSnapshot.docs.map(docSnapshot => {
            //get post uuid
            const { id } = docSnapshot
            return { ...docSnapshot.data(), id }
          })
          //to save current post length
          lastPostSnapshotRef.current =
            collectionSnapshot.docs[collectionSnapshot.docs.length - 1]
          setPosts(data)
        })
        .catch(error => {
          console.log(error)
        })
  }, [currentTopic])

  //handle window scroll
  // useEffect(() => {
  //   window.scrollTo(0,localStorage.getItem('userScroll'))
  //   const handleScroll = () => {
  //     localStorage.setItem('userScroll', window.scrollY)
  //   }
  //   window.addEventListener('scroll', handleScroll)
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [])

  return (
    <>
      <Grid.Column width={10}>
        <Item.Group>
          {
            posts &&
            posts.map(post => (
              <Post key={post.id} post={post} user={user} />
            ))
          }
        </Item.Group>
        <Waypoint
          onEnter={() => {
            if (lastPostSnapshotRef.current) {
              currentTopic
                ?
                firebase.firestore().collection('posts')
                  .where('topic', '==', currentTopic)
                  .orderBy('createdAt', 'desc')
                  .startAfter(lastPostSnapshotRef.current)
                  .limit(4)
                  .get()
                  .then(collectionSnapshot => {
                    const data = collectionSnapshot.docs.map(docSnapshot => {
                      //get post uuid
                      const { id } = docSnapshot
                      return { ...docSnapshot.data(), id }
                    })
                    //to save current post length
                    lastPostSnapshotRef.current =
                      collectionSnapshot.docs[collectionSnapshot.docs.length - 1]
                    //return current posts + data
                    setPosts([...posts, ...data])
                  })
                  .catch(error => {
                    console.log(error)
                  })
                :
                firebase.firestore().collection('posts')
                  .orderBy('createdAt', 'desc')
                  .startAfter(lastPostSnapshotRef.current)
                  .limit(4)
                  .get()
                  .then(collectionSnapshot => {
                    const data = collectionSnapshot.docs.map(docSnapshot => {
                      //get post uuid
                      const { id } = docSnapshot
                      return { ...docSnapshot.data(), id }
                    })
                    //to save current post length
                    lastPostSnapshotRef.current =
                      collectionSnapshot.docs[collectionSnapshot.docs.length - 1]
                    //return current posts + data
                    setPosts([...posts, ...data])
                  })
                  .catch(error => {
                    console.log(error)
                  })
            }
          }} />
      </Grid.Column>
    </>
  )
}

export default Posts