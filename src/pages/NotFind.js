import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Container, Header } from 'semantic-ui-react'

const NotFind = () => {
  const navigate = useNavigate()

  //handle go back
  const handleGoBack = () => (
    navigate(-1)
  )

  return (
    <Container text textAlign='center'>
      <Header size='huge'>404 找不到頁面</Header>
      <Button size='big' onClick={handleGoBack}>返回上一頁</Button>
    </Container>
  )
}

export default NotFind