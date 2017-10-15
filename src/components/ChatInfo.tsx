import * as React from 'react'

interface ChatInfoProps {
  className: string
}

export class ChatInfo extends React.Component<ChatInfoProps, {}> {
  render() {
    return <div className={"chat-info control " + this.props.className}></div>
  }
}
