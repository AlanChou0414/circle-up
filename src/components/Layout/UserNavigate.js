import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Grid, Container } from 'semantic-ui-react'

import UserMenu from 'components/UserMenu'
import UserPosts from 'pages/UserPosts'
import UserCollections from 'pages/UserCollections'
import UserSettings from 'pages/UserSettings'

const UserNavigate = ({ user }) => {
  return (
    user
      ?
      <Container>
        <Grid textAlign='center'>
          <Grid.Row>
            <Grid.Column width={2}>
              <UserMenu />
            </Grid.Column>
            <Grid.Column width={10}>
              <Routes>
                <Route path='/collections' element={<UserCollections user={user} />} exact />
                <Route path='/posts' element={<UserPosts user={user} />} exact />
                <Route path='/settings' element={<UserSettings user={user} />} exact />
              </Routes>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container >
      : window.location = '/signin'
  )
}

export default UserNavigate