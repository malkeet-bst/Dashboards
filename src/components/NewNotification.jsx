import React from "react";
import If from "./common/If";
import GlobalActions from "../actions/GlobalActions";

import BellNotification from "./BellNotification";


class NewNotification extends React.Component {

  onChannelSelection = () => {
    GlobalActions.setCurrentView('home')
    GlobalActions.setChannel('bell')
  }
  render() {
    let { show, channelType, currentView } = this.props;
    return (
      <div>
        <If condition={show}>
          <div className="new">
            <header><h2>Create New Notification</h2></header>
            <If condition={currentView === 'dashboard' || currentView===''}>
              <section>
                <h4> Select Channel</h4>
                <article className="channel-box">
                  <div className="channel" onClick={() => this.onChannelSelection('bell')}>
                    <h5>Bell Notifications</h5>
                    <span>Send out Bell/ribbon Notifications based on specific Profile Attributes of the User</span>
                  </div>
                  <div className="channel">
                    <h5>Dormant Message</h5>
                    <span>Coming Soon</span>
                  </div>
                </article>
              </section>
            </If>
          </div>
          <If condition={channelType === 'bell'}>
            <BellNotification currentView={currentView} />
          </If>
        </If>
      </div>
    );
  }
}

export default NewNotification;
