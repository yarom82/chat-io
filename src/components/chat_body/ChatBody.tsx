import * as React from 'react'
import { ChatButton } from './ChatButton'

export class ChatBody extends React.Component<{}> {
  render() {
    return <div className="chat tile is-ancestor">
      <div className="tile is-8 box">
        <section className="hero is-small">
          <div className="hero-body messages-body">
            <div className="container messages"></div>
          </div>
          <br />
          <div className="hero-footer">
            <div className="field">
              <div className="control">
                <input name="message" id="message" className="input is-primary is-medium" type="text" placeholder="Enter your message..."></input>
              </div>
            </div>
            <ChatButton id="send-message" text="Send Message" containerClass="is-pulled-left" buttonClass="is-primary fa fa-paper-plane-o" />
            <ChatButton id="leave-chat" text="Leave Chat" containerClass="is-pulled-right" buttonClass="is-danger fa fa-sign-out" />
          </div>
        </section>
      </div>
      <div className="tile box">
        <div id="private-messages"></div>
      </div>
    </div>
  }
}
