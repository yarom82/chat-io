import * as React from 'react'

export class JoinChat extends React.Component<{}> {
  constructor() {
    super()
    this.state = {newFriend: ''}
  }

  updateUsername = (e : any) => {
    this.setState({
      newFriend: e.target.value
    })
  }
  
  render() {
    return <section className="hero is-medium join-chat">
      <div className="hero-body">
        <div className="columns">
          <div className="column is-half is-offset-one-quarter">
            <div className="field">
              <label className="label">Username</label>
              <div className="control has-icons-left has-icons-right">
                <input id="username" name="username" className="input is-success" type="text" 
                  placeholder="User Name" onChange={this.updateUsername} />
                <span className="icon is-small is-left">
                  <i className="fa fa-user"></i>
                </span>
                <span className="icon is-small is-right">
                  <i className="fa fa-check"></i>
                </span>
              </div>
              <p className="help is-success">This username is available</p>
            </div>
            <div className="control">
              <button id="join-chat" className="button is-primary">Join Chat</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  }
}