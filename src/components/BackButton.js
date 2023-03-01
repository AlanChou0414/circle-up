import React, { useEffect, useState } from 'react'
import { Button } from 'semantic-ui-react'

const BackButton = () => {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleBack = () => {
    window.history.back()
    window.scrollTo(0, scrollPosition)
  }

  return (
    <Button floated='right' onClick={handleBack}>返回</Button>
  )
}

export default BackButton
