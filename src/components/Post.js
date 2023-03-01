import React from 'react'
import { Link } from 'react-router-dom'
import { Item, Image, Icon } from 'semantic-ui-react'

const Post = ({ post }) => {
  return (
    <>
      <Item key={post.id}>
        <Item.Content>
          <Item.Image
            src={post.imageUrl ||
              'https://react.semantic-ui.com/images/wireframe/image.png'}
            size='medium'
            alt='文章圖片'
            style={{ width: 400, margin: 10 }}
            as={Link}
            to={{ pathname: `/posts/${post.id}` }}
            centered
          />
          <Item.Meta>
            {
              post.author.photoURL
                ? <Image src={post.author.photoURL} avatar style={{ marginRight: 5 }} />
                : <Icon name='user circle' size='big' style={{ marginRight: 5 }} />
            }
            {post.topic} | {post.author.displayName || '使用者'}
          </Item.Meta>
          <Item.Header
            as={Link}
            to={{ pathname: `/posts/${post.id}` }}
          >
            {post.title}
          </Item.Header>
          <Item.Extra>
            留言 {post.commentsCount || 0} ∙ 讚 {post.likedBy?.length || 0} ∙ 收藏 {post.collectedBy?.length || 0}
          </Item.Extra>
          <div style={{ padding: .8, background: '#e3e3e3', margin: 10 }} />
        </Item.Content>
      </Item>
    </>
  )
}

export default Post