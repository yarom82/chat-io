import * as React from 'react'
import { Message } from './Message'

interface MessagesProps {
  username: string,
  messages: any,
  createPrivateMessageFunc: Function
}

export class Messages extends React.Component<MessagesProps, {}> {
  render() {
    return <div>
      {
        this.props.messages.map(function(messageInfo: any) {
          const senderUsername = messageInfo['sender']
          const message = messageInfo['message']

          return <Message username={this.props.username} senderUsername={senderUsername}
                    message={message} createPrivateMessageFunc={this.props.createPrivateMessageFunc} />
        })
      }
    </div>
  }
}
