import * as React from 'react'

interface PrivateMessageProps {
  username: string,
  to: string,
  sendPrivateMessageFunc: Function
}

export class PrivateMessage extends React.Component<PrivateMessageProps, {}> {
  render() {
    const toStyle = {
      backgroundColor: stringToColor(this.props.to)
    }

    return <article>
        <div className='message-header'>
          <p>{this.props.to}</p>
          <button className='delete' aria-label='delete' onClick={() => $(this).parents('article').first().remove()} />
        </div>
        <div className='message-body'>
          <div>
            <textarea className='textarea is-small' id={'pm-' + this.props.to} rows={4} cols={45} disabled >
            </textarea>
            <input className='input is-small' id={'pm-input-' + this.props.to} >
            </input>
            <button className='button is-small' type='button' 
              onClick={() => sendMessage(this.props.sendPrivateMessageFunc, this.props.to, this.props.username)} >
            </button>
          </div>
        </div>
      </article>
  }
}

const sendMessage = function(sendPrivateMessageFunc: Function, to: string, username: string) {
  var $messageTextarea = $('#pm-' + to)
  var $messageInput = $('#pm-input-' + to)

  sendPrivateMessageFunc(to, username, $messageInput.val());
  
  $messageTextarea.scrollTop($messageTextarea[0].scrollHeight)
  $messageInput.val('')
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
