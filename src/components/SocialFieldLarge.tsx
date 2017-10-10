import * as React from "react"

/*
<div class="field is-grouped" style="margin-bottom: 0;">
    <p class="control">
    <a class="button" href="https://youtube.com/user/yarom82" target="_blank">
        <span class="icon" style="color: #F00">
        <i class="fa fa-youtube"></i>
        </span>
        <span>YouTube</span>
    </a>
    </p>
</div>
*/
export interface SocialProps {
  href: string
  color: string
}

export class SocialFieldLarge extends React.Component<SocialProps, {}> {
    render() {
        return <h1>Hello from {this.props.href} and {this.props.color}!</h1>
    }
}

/*
export interface SocialProps { href: string; color: string; }

export const SocialFieldLarge = (props: SocialProps) => <h1>Hello from {props.href} and {props.color}!</h1>
*/


/*
const SocialFieldLarge = () =>
  <div className="field is-grouped" style="margin-bottom: 0;">
    <p className="control">
      <a className="button" href="this.props.href" target="_blank">
        <span className="icon" style="color: {this.props.color}">
          <i className="fa fa-this.props.socialName"></i>
        </span>
      </a>
    </p>
  </div>

export default SocialFieldLarge
*/