import * as React from 'react'

export class ChatHeader extends React.Component<{}> {
  render() {
    return <section className="hero is-primary">
    <div className="hero-body">
      <div className="container">
        <h1 className="title">
          Chat.IO - by Yarom Shoval
        </h1>
        <h2 className="subtitle">
          Build with Node.js | Socket.io | Redis
        </h2>
      </div>
    </div>
  </section>
  }
}
