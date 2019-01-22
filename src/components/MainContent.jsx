import React from "react";
import If from './common/If'
import NewNotification from "./NewNotification"
import ViewAll from "./ViewALL"

class MainContent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    }
  }

  render() {
    let { activeTab, channelType, currentView } = this.props
    return (
      <div className="right-panel">
        <NewNotification channelType={channelType} currentView={currentView} show={activeTab === 'new'} type={channelType} />
        <ViewAll show={activeTab === 'view'} />
      </div>
    );
  }
}

export default MainContent;
