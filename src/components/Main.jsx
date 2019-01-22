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
    console.log('hey',tab)
    GlobalActions.setCurrentView('dashboard',tab)
  }

  componentDidMount = () => {
    RotationStore.listen(this.onChange);
  };
  componentWillUnmount = () => {
    RotationStore.unlisten(this.onChange);
  };
  render() {
    let { activeTab,channelType, currentView } = this.state.RotationS
    console.log({activeTab})
    return <div className="notification-container" >
      <SideBar activeTab={activeTab} changeTab={this.changeTab} />
      <MainContent channelType={channelType} currentView={currentView} activeTab={activeTab} />
    </div>
  }
}

export default Main;
