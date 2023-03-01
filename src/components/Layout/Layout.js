import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
import { Container } from 'semantic-ui-react'

const Layout = ({ user }) => {
  return (
    <>
      <Header user={user} />
      <Container style={{ marginTop: 100 }}>
        <Outlet />
      </Container>
    </>
  )
}

export default Layout