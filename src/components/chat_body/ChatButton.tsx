import * as React from 'react'

interface ChatButtonProps {
  id: string
  text: string
  containerClass: string
  buttonClass: string
}

export class ChatButton extends React.Component<ChatButtonProps, {}> {
  render() {
    return <div className={"control " + this.props.containerClass}>
      <button id={this.props.id} className={"button " + this.props.buttonClass}>{this.props.text}</button>
    </div>
  }
}