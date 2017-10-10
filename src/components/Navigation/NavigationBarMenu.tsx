import * as React from 'react'

export class NavigationBarMenu extends React.Component<{}> {
  render() {
    return <div className="navbar-menu">
        <div className="navbar-end">
          <a className="navbar-item is-hidden-desktop" href="https://github.com/yarom82" target="_blank">
            <span className="icon" /*style="color: #333;"*/>
              <i className="fa fa-lg fa-github"></i>
            </span>
          </a>
          <a className="navbar-item is-hidden-desktop" href="https://facebook.com/yarom.shoval" target="_blank">
            <span className="icon" /*style="color: #3b5998"*/>
              <i className="fa fa-lg fa-facebook"></i>
            </span>
          </a>
          <a className="navbar-item is-hidden-desktop" href="https://www.youtube.com/user/yarom82" target="_blank">
            <span className="icon" /*style="color: #F00;"*/>
              <i className="fa fa-lg fa-youtube"></i>
            </span>
          </a>
          <div className="navbar-item">
            <div className="field is-grouped">
              <p className="control">
                <a className="button" href="https://github.com/yarom82" target="_blank">
                  <span className="icon">
                    <i className="fa fa-github"></i>
                  </span>
                  <span>GitHub</span>
                </a>
              </p>
            </div>
            <div className="field is-grouped">
              <p className="control">
                <a className="button" href="https://facebook.com/yarom.shoval" target="_blank">
                  <span className="icon" /*style="color: #3b5998"*/>
                    <i className="fa fa-facebook"></i>
                  </span>
                  <span>facebook</span>
                </a>
              </p>
            </div>
            <div id="youtube-large"></div>
            <div className="field is-grouped">
              <p className="control">
                <a className="button" href="https://youtube.com/user/yarom82" target="_blank">
                  <span className="icon" /*style="color: #F00"*/>
                    <i className="fa fa-youtube"></i>
                  </span>
                  <span>YouTube</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
  }
}