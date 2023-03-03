import React, { useContext } from 'react'
import { Navigate, useLocation } from "react-router-dom"
import { Context } from "components/Context"

const ProtectRouter = ({ children }) => {
  const { user } = useContext(Context)
  const location = useLocation
  const { pathname } = location
  if (!user) return <Navigate to='/signin' replace />

  return children
}

export default ProtectRouter