import * as React from 'react'

import { NavigationBrand } from './NavigationBrand'
import { NavigationBarMenu } from './NavigationBarMenu'

export class NavigationBar extends React.Component<{}> {
  render() {
    return <nav className='navbar'>
      <NavigationBrand />
      <NavigationBarMenu />
    </nav>
  }
}