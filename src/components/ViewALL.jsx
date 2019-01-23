import React from "react";
import If from './common/If'
import { Table } from 'antd';
import GlobalActions from "../actions/GlobalActions";
import RotationStore from "../store/RotationStore"
import { all } from "q";



class ViewAll extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false
    }
    this.columns = [{
      title: 'S No.',
      dataIndex: 'key',
      width: 70
    }, {
      title: 'Campaign Name',
      dataIndex: 'name',
      width: 150
    }, {
      title: 'Campaign Details',
      dataIndex: 'details',
      width: 150
    }, {
      title: 'Campaign Action',
      dataIndex: 'action',
      width: 150,
      render: (text, row) => <div style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}><span onClick={() => this.pause()} className="action-icon glyphicon glyphicon-pause"></span>
        <If condition={false}> <span onClick={() => this.stop()} className="action-icon glyphicon glyphicon-play"></span></If>
        <span onClick={() => this.stop()} className="action-icon glyphicon glyphicon-stop"></span>
        <span onClick={() => this.copy(text, row)} className="action-icon glyphicon glyphicon-duplicate"></span></div>
      ,
    }, {
      title: 'validity',
      dataIndex: 'validity',
      width: 200
    }, {
      title: 'Audience',
      dataIndex: 'audience',
      width: 250
    }, {
      title: 'Status',
      dataIndex: 'status',
      width: 100
    }, {
      title: 'Reports',
      dataIndex: 'reports',
      width: 100
    }];


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
  componentWillMount = () => {
    GlobalActions.viewAllData()
  }
  componentDidMount = () => {
    GlobalActions.viewAllData()
    RotationStore.listen(this.onChange);
  };
  componentWillUnmount = () => {
    RotationStore.unlisten(this.onChange);
  };
  pause = (event) => {
    console.log('event')
  }
  copy = (text, row) => {
    console.log(text, row)
    GlobalActions.copyTemplate(row)
    GlobalActions.setCurrentView('home', 'new')
    GlobalActions.setChannel('bell')
  }
  stop = (event) => {
    console.log('stop')
  }

  render() {
    let { show } = this.props
    let { allData } = this.state.RotationS
    let loading = true
    if (Array.isArray(allData) && allData.length>0) {
      loading = false
    }
    return (
      <div>
        <If condition={show}>
          <div className="view-all">
            <header><h2>View Notification</h2></header>
            <Table columns={this.columns} loading={loading} dataSource={allData} pagination={{ pageSize: 50 }} scroll={{ y: 540 }} />
          </div>
        </If>
      </div>
    );
  }
}

export default ViewAll;
