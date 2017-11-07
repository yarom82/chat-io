import * as React from 'react'

interface UsersInfoProps {
  count: number
}

export class UsersInfo extends React.Component<UsersInfoProps, {}> {
  render() {
    return <div className='tags has-addons'>
      <span className='tag'>Users</span>
      <span className='tag is-info'>{this.props.count}</span>
    </div>
  }
}
