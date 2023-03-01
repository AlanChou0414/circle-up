import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Grid, Container } from 'semantic-ui-react'

import Post from 'pages/Post'
import Posts from 'pages/Posts'
import Topics from 'components/Topics'

const PostNavigate = ({ user }) => {
  return (
    <Container>
      <Grid textAlign='center'>
        <Grid.Row>
          <Grid.Column width={2}>
            <Topics />
          </Grid.Column>
          <Routes>
            <Route path='*' element={<Posts user={user} />} exact />
            <Route path=':postId' element={<Post user={user} />} exact />
          </Routes>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default PostNavigate