import React from "react";

class SideBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    }
  }

  render() {
    let { currentView } = this.props
    return (
      <div className="left-panel">
        <button onClick={() => this.props.changeTab('new')} className={'btn btn-link ' + (currentView === 'new' ? 'active' : '')}><span className="glyphicon glyphicon-pencil"></span> Create New</button>
        <button onClick={() => this.props.changeTab('view')} className={'btn btn-link ' + (currentView === 'view' ? 'active' : '')}><span className="glyphicon glyphicon-list-alt"></span> View All</button>
      </div>
    );
  }
}

export default SideBar;
