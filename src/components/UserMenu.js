import React, { useEffect, useState } from 'react'
import { List } from 'semantic-ui-react'
import { Link, useLocation } from 'react-router-dom'
import 'firebase/compat/firestore'

const UserMenu = () => {
  const location = useLocation()

  const menuItems = [
    {
      name: '我的文章',
      path: '/user/posts'
    },
    {
      name: '我的收藏',
      path: '/user/collections'
    },
    {
      name: '會員資料',
      path: '/user/settings'
    }
  ]

  return (
    <List animated selection size='big'>
      {
        menuItems.map(menuItem => (
          <List.Item
            as={Link}
            to={menuItem.path}
            key={menuItem.name}
            style={{ marginTop:10 }}
            active={menuItem.path === location.pathname}
          >
            {menuItem.name}
          </List.Item>
        ))
      }
    </List>
  )
}

export default UserMenu