import React from 'react'
import { Container, Grid, Header } from 'semantic-ui-react'
import { UserName, UserPhoto, UserPassword } from './user/UpdateModal'

const UserSettings = ({ user }) => {
  return (
    <Grid.Column width={10} textAlign='center'>
      <Header size='huge'>會員資料</Header>
      <Container textAlign='left' style={{ padding: '30px 100px' }} >
        <UserName user={user} />
        <UserPhoto user={user} />
        <UserPassword user={user} />
      </Container>
    </Grid.Column>
  )
}

export default UserSettings