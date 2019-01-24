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
    let { activeTab, channelType, currentView, formData, apiStatus } = this.props
    return (
      <div className="right-panel">
        <NewNotification channelType={channelType} currentView={currentView} apiStatus={apiStatus} show={activeTab === 'new'} type={channelType} formData={formData} />
        <ViewAll show={activeTab === 'view'} formData={formData} apiStatus={apiStatus} />
        <If condition={apiStatus != null && apiStatus.success != null}>
          <div className="success-message">
            <div className="alert alert-success" style={{ 'marginTop': '30px' }}>
              <strong>Success!</strong> {apiStatus && apiStatus.success}
            </div>
          </div>
        </If>
      </div>
    );
  }
}

export default MainContent;
