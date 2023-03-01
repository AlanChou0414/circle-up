import { useEffect } from 'react'
import { useLocation } from 'react-router'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  //handle if window location change and reset window scroll to top
  useEffect(() => {
    pathname !== '/posts' &&
      window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default ScrollToTop