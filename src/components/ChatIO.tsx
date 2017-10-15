import * as React from 'react'

import { NavigationBar } from './navigation/NavigationBar'
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
      <ChatInfo className='is-pulled-left user-info'/>
      <ChatInfo className='is-pulled-right users-info'/>      
      <ChatBody />
    </div>
  }
}