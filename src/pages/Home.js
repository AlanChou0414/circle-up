import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Header, Icon, Grid, Message } from 'semantic-ui-react'

const fullText = `歡迎來到 Circle Up！這裡是一個讓你能夠分享自己的文章、發現其他人的內容、收藏你喜愛的文章、以及和其他人互動的平台。\n我們相信每個人都有自己的故事和經驗，透過 Circle Up，\n你可以把這些分享給更多的人，也能夠從其他人的故事中獲得啟發和共鳴。\n\n除了發表文章外，你還可以用讚和收藏來表達對其他人的支持和喜愛，\n同時也能夠透過留言與其他用戶互動，建立更深層次的交流和連繫。\n\nCircle Up 是一個開放、自由的平台，我們鼓勵用戶以正面、建設性的方式\n進行交流和互動，並且尊重他人的意見和觀點。無論你是想要分享自己的故事、\n學習新知識、或是建立社群，Circle Up 都是一個適合你的地方。\n現在就加入我們，和其他有趣的人一起 Circle Up 吧！`;

const Home = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const intervalId = setInterval(() => {
      const index = text.length;
      setText(fullText.slice(0, index + 1));
      if (fullText[index] === ',') {
        setText(text + '\n');
      }
    }, 100)
    return () => clearInterval(intervalId)
  }, [text])

  const handleIconClick = () => (
    navigate('/posts')
  )

  return (
    <Grid verticalAlign="middle" centered style={{ height: 0 }}>
      <Grid.Row>
        <Grid.Column>
          <Header as='h2' icon textAlign='center'>
            <Icon
              name='circle notched'
              loading={true}
              onClick={handleIconClick}
              circular
              style={{ cursor: 'pointer' }}
            />
            <Header>Circle Up</Header>
          </Header>
          <Header style={{ lineHeight: 2 }}>
            <Container text>
              <Message size='big'>
                {text}
              </Message>
            </Container>
          </Header>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default Home