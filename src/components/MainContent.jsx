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
    let { activeTab, channelType, currentView ,formData, apiStatus} = this.props
    return (
      <div className="right-panel">
        <NewNotification channelType={channelType} currentView={currentView} apiStatus={apiStatus} show={activeTab === 'new'} type={channelType} formData={formData}/>
        <ViewAll show={activeTab === 'view'} formData={formData}/>
      </div>
    );
  }
}

export default MainContent;