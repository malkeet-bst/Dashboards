import React from "react";
import If from './common/If'
import { Table } from 'antd';
import GlobalActions from "../actions/GlobalActions";
import RotationStore from "../store/RotationStore"
import { Modal, Button } from 'antd';
import { confirmAlert } from 'react-confirm-alert';


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
      title: 'Campaign Id',
      dataIndex: 'campaign_id',
      width: 150

    }, {
      title: 'Campaign Name',
      dataIndex: 'campaign_name',
      width: 100,
      //render: (text, row) => <div style={{'textAlign':'left'}}>name</div>

    }, {
      title: 'Campaign Details',
      dataIndex: 'details',
      width: 150,
      render: (text, row) => <button type="button" className="btn btn-link" style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }} onClick={() => this.viewDetails(row)}>View Details</button>
    }, {
      title: 'Campaign Action',
      dataIndex: 'action',
      width: 150,
      render: (text, row) => <div style={{ 'textAlign': 'left', 'display': 'flex', 'justifyContent': 'space-evenly' }}>
        {/* <span onClick={() => this.pause()} className="action-icon glyphicon glyphicon-pause"></span>
        <If condition={false}> <span onClick={() => this.stop()} className="action-icon glyphicon glyphicon-play"></span></If> */}
        <button type="button" className="btn btn-link"><span onClick={() => this.edit(text, row)} className="action-icon glyphicon glyphicon-edit"></span></button>
        <button type="button" className="btn btn-link"><span onClick={() => this.delete(row)} className="action-icon glyphicon glyphicon-trash"></span></button>
      </div>
      ,
    }, {
      title: 'validity',
      dataIndex: 'validity',
      width: 200

    }, {
      title: 'Audience',
      dataIndex: 'audience',
      width: 250
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'campaign_status',
    //   width: 100
    // },
    {
      title: <button type="button" className="btn btn-link" onClick={() => this.downloadStats()} style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>View Report</button >,
      dataIndex: 'stats',
      width: 250,
      render: (text, row) => <div style={{ 'textAlign': 'left' }}>
        <If condition={row && typeof (row.stats) == "object"}><div style={{ 'display': 'flex', 'flexDirection': 'column' }}>
          {row && row.stats && <span>Bell clicks : {row.stats.NotificationDrawerItemClicked}</span>}
          {row && row.stats && <span>Ribbon clicks : {row.stats.RibbonClicked}</span>}
          {row && row.stats && <span>Ribbon Impression : {row.stats.RibbonShown}</span>}
        </div>
        </If>
        <If condition={row && typeof (row.stats) != "object"}>NA
      {/* <button type="button" className="btn btn-link" onClick={() => this.downloadStats(row)} style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>Download</button > */}
        </If>
      </div>
    }
    ];


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
  componentDidMount = () => {
    //GlobalActions.viewAllData()
    RotationStore.listen(this.onChange);
  };
  componentWillUnmount = () => {
    RotationStore.unlisten(this.onChange);
  };
  delete = (row) => {
    confirmAlert({
      title: ``,
      message: 'Are you sure you want to delete this campaign ?',
      buttons: [
        {
          label: 'yes',
          onClick: () => GlobalActions.deleteCampaign(row.campaign_id)
        },
        {
          label: 'No'
        }
      ]
    })

  }
  edit = (text, row) => {
    GlobalActions.cloneNotificationData(row.key - 1)
    GlobalActions.setCurrentView('new')
    GlobalActions.setChannel('bell')
  }
  viewDetails = (row) => {
    GlobalActions.cloneNotificationData(row.key - 1)
    GlobalActions.showCampaignDetails(true)
  }
  searchFilter = () => {
    let input, filter, table, tr, i;
    input = document.getElementById("searchText");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
      let tdString = tr[i].getElementsByTagName("td")[2].textContent
      if (tdString.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
  refreshData = () => {
    GlobalActions.viewAllData()
  }
  downloadStats = () => {
    GlobalActions.viewStats()
  }
  handleOk = (e) => {
    GlobalActions.showCampaignDetails(false);
  }

  handleCancel = (e) => {
    GlobalActions.showCampaignDetails(false);
  }
  render() {
    let { show, cloneData, apiStatus } = this.props
    let { allData, showDetails } = this.state.RotationS
    let loading = true

    if ((Array.isArray(allData) && allData.length > 0) || (apiStatus && (apiStatus.error)) || (apiStatus && (apiStatus.success))) {
      loading = false
    }
    if (apiStatus === 'loading') {
      loading = true
    }
    let messageObject = ''
    if (cloneData && Object.entries(cloneData).length !== 0 && cloneData.constructor === Object && cloneData.locale_message_map) {
      messageObject = Object.keys(cloneData.locale_message_map).map((key, index) => {
        return (
          <div key={index}>
            <li className="list-group-item list-group-item-light">Locale : {key}, Title : {cloneData.locale_message_map[key].title}, Message : {cloneData.locale_message_map[key].message}
            </li>
          </div>
        )
      })
    }
    return (
      <div>
        <If condition={show}>
          <div className="view-all">
            <header style={{ 'paddingBottom': '30px' }}><h2>View Notification</h2></header>

            <div className="search-filter">
              <button onClick={this.refreshData} className="btn btn-info"><span className="glyphicon glyphicon-refresh"></span> Refresh</button>
              <input
                type="text"
                onKeyUp={this.searchFilter}
                className="form-control "
                placeholder="search by campaign name"
                id="searchText"
              /></div>
            <Modal
              title="Campaign Details"
              visible={showDetails}
              centered
              maskClosable={true}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="submit" type="primary" onClick={this.handleOk}>
                  Ok
                </Button>,
              ]}
            >
              <ul style={{ 'paddingLeft': '0' }}>
                <li className="list-group-item list-group-item-light"><div>Campaign Name : {cloneData.campaign_name}</div></li>
                <li className="list-group-item list-group-item-light"><div>Campaign Id : {cloneData.campaign_id}</div></li>
                <li className="list-group-item list-group-item-light"><div> Campaign Status : {cloneData.campaign_status}</div></li>
                <If condition={cloneData.audience != ''}>
                  <li className="list-group-item list-group-item-light"><div>Audience : {cloneData.audience}</div></li>
                  <li className="list-group-item list-group-item-light"><div>Campaign Validity : {cloneData.campaign_start_time} - {cloneData.campaign_end_time}</div></li>
                </If>
                {messageObject}
                <li className="list-group-item list-group-item-light"><div>Ribbon gif url :<img styles={{ 'height': '50px' }} src={cloneData.gif_url} alt={cloneData.gif_url} /></div></li>
                <li className="list-group-item list-group-item-light"><div>Action title : {cloneData.click_action_title}</div></li>
                <li className="list-group-item list-group-item-light"><div>Action type : {cloneData.click_action_type}</div></li>
                <If condition={cloneData.click_action_type === 'SettingsMenu' || cloneData.click_action_type === 'HomeAppTab' || cloneData.click_action_type === 'UserBrowser' || cloneData.click_action_type === 'InstallCDN'}>
                  <li className="list-group-item list-group-item-light"><div>Action value : {cloneData.click_action_value}</div></li>
                </If>
                <li className="list-group-item list-group-item-light"><div>priority : {cloneData.priority}</div></li>
                <li className="list-group-item list-group-item-light"><div>Notification mode : {cloneData.show_at}</div></li>
                <li className="list-group-item list-group-item-light"><div>Package name : {cloneData.package_name}</div></li>
                <If condition={cloneData.click_action_value === 'APP_CENTER_TEXT' && cloneData.click_action_type === 'HomeAppTab'}>
                  <li className="list-group-item list-group-item-light"><div>Action id : {cloneData.sub_tab_id}</div></li>
                </If>
                <li className="list-group-item list-group-item-light"><div>Image url : <img styles={{ 'height': '50px' }} src={cloneData.tile_menu_url} alt={cloneData.tile_menu_url} /></div></li>

              </ul>
            </Modal>
            <If condition={apiStatus != null && apiStatus.error != null}>
              <div className="alert alert-danger">
                <strong>Failed!</strong> {apiStatus && apiStatus.error}
              </div>
            </If>
            <Table id="myTable" columns={this.columns} loading={loading} dataSource={allData} pagination={{ pageSize: 50 }} scroll={{ y: 500 }} />
          </div>
        </If>
      </div>
    );
  }
}

export default ViewAll;
