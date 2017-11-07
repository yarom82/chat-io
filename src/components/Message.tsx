import * as React from 'react'

interface MessageProps {
  username: string,
  senderUsername: string,
  message: string,
  createPrivateMessageFunc: Function
}

export class Message extends React.Component<MessageProps, {}> {
  render() {
    const userStyle = {
      color: stringToColor(this.props.senderUsername)
    }

    return <div>
      <span className='user' onClick={this.props.createPrivateMessageFunc(this.props.senderUsername, this.props.username)}>
        <strong style={userStyle}>{this.props.senderUsername + ":"}<span className="txt">{this.props.message}</span></strong>
      </span>
    </div>
  }
}

const stringToColor = function (str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
