import * as React from 'react'
import { NavigationBrandItem } from './NavigationBrandItem'

export class NavigationBrand extends React.Component<{}> {
  render() {
    return <div className="navbar-brand">
        <a className="navbar-item">
          <img src="icons/chat-io-logo.png" alt="Chat.io - a modren chat app"/>
          Chat.IO
        </a>
        <NavigationBrandItem href="https://github.com/yarom82" class="fa-github" />
        <NavigationBrandItem href="https://facebook.com/yarom.shoval" class="fa-facebook" />
        <NavigationBrandItem href="https://youtube.com/user/yarom82" class="fa-youtube" />
      </div>
  }
}