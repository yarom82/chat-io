import * as React from 'react'

interface UserInfoProps {
  username: string
}

export class UserInfo extends React.Component<UserInfoProps, {}> {
  render() {
    return <div className='tags has-addons'>
      <span className='tag is-primary'>Hello</span>
      <span className='tag my-username is-white'>{this.props.username}</span>
    </div>
  }
}
