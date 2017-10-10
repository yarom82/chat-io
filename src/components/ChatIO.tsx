import * as React from 'react'

import { NavigationBar } from './Navigation/NavigationBar'
import { ChatHeader } from './ChatHeader'
import { JoinChat } from './JoinChat'
import { ChatInfo } from './ChatInfo'
import { ChatBody } from './chat_body/ChatBody'

export class ChatIO extends React.Component<{}> {
  render() {
    return <div className='container'>
      <NavigationBar />
      <ChatHeader />
      <JoinChat />
      <ChatInfo />
      <ChatBody />
    </div>
  }
}