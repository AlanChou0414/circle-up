import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Grid, Container } from 'semantic-ui-react'

import UserMenu from 'components/UserMenu'
import UserPosts from 'pages/UserPosts'
import UserCollections from 'pages/UserCollections'
import UserSettings from 'pages/UserSettings'
import ProtectRouter from 'utils/ProtectRouter'

const UserNavigate = () => {
  return (
    <ProtectRouter>
      <Container>
        <Grid textAlign='center'>
          <Grid.Row>
            <Grid.Column width={2}>
              <UserMenu />
            </Grid.Column>
            <Grid.Column width={10}>
              <Routes>
                <Route path='/collections' element={<UserCollections />} exact />
                <Route path='/posts' element={<UserPosts />} exact />
                <Route path='/settings' element={<UserSettings />} exact />
              </Routes>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container >
    </ProtectRouter>
  )
}

export default UserNavigate