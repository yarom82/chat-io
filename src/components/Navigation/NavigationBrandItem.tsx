import * as React from 'react'

interface NavigationBrandItemProps {
  href: string
  class: string
}

export class NavigationBrandItem extends React.Component<NavigationBrandItemProps, {}> {
  render() {
    return <a className="navbar-item is-hidden-desktop" href={this.props.href} target="_blank">
      <span className="icon">
        <i className={"fa fa-lg " + this.props.class}></i>
      </span>
    </a>
  }
}