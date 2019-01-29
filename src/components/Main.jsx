import React from "react"
import "react-confirm-alert/src/react-confirm-alert.css"
import Utils from "../utils/util"
import BsIcon from "../images/bluestack_icon.png"
import RotationStore from "../store/RotationStore"
import SideBar from './SideBar'
import GlobalActions from "../actions/GlobalActions"
import If from "./common/If"
import MainContent from "./MainContent"

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.getUpdatedState();
  }

  getUpdatedState = () => {
    return {
      RotationS: RotationStore.getState()
    };
  };
  onChange = () => {
    this.setState(this.getUpdatedState());
  };
  changeTab = (tab) => {
    if(tab==='view'){
      GlobalActions.viewAllData()
    }
    GlobalActions.setCurrentView(tab)
    GlobalActions.setChannel('dashboard')
  }

  componentDidMount = () => {
    RotationStore.listen(this.onChange);
  };
  componentWillUnmount = () => {
    RotationStore.unlisten(this.onChange);
  };
  render() {
    let { currentView,channelType,formData,apiStatus,cloneData } = this.state.RotationS
    return <div className="notification-container" >
      <SideBar currentView={currentView} changeTab={this.changeTab} />
      <MainContent channelType={channelType} currentView={currentView} cloneData={cloneData} formData={formData} apiStatus={apiStatus}/>
    </div>
  }
}

export default Main;
