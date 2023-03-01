import React, { useEffect, useState } from 'react'
import { List } from 'semantic-ui-react'
import { Link, useLocation } from 'react-router-dom'
import firebase from '../utils/firebase'
import 'firebase/compat/firestore'

const Topics = () => {
  const [topics, setTopics] = useState([])

  //get current query name
  const location = useLocation()
  const { search } = location
  const urlSearchParams = new URLSearchParams(search)
  const currentTopic = urlSearchParams.get('topic')

  //get firebase store ==> collection('your hub name').get()
  useEffect(() => {
    firebase.firestore().collection('topics').get()
      .then(collectionSnapshot => {
        //get all label name in hub  ==> .data()
        const data = collectionSnapshot.docs.map(doc => (doc.data()))
        setTopics(data)
      })
  }, [])

  return (
    <List animated selection size='big'>
      {
        topics.map(topic => (
          <List.Item
            key={topic.name}
            as={Link}
            to={`/posts?topic=${topic.name}`}
            style={{ margin: 5 }}
            active={currentTopic === topic.name}
          >
            {topic.name}
          </List.Item>
        ))
      }
    </List>
  )
}

export default Topics