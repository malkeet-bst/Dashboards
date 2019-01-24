import React from "react";
import If from './common/If'
import { Table } from 'antd';
import GlobalActions from "../actions/GlobalActions";
import RotationStore from "../store/RotationStore"
import { Modal, Button } from 'antd';



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
      dataIndex: 'campaign_id',
      width: 150,

    }, {
      title: 'Campaign Details',
      dataIndex: 'details',
      width: 150,
      render: (text, row) => <button type="button" className="btn btn-link" style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }} onClick={() => this.viewDetails(row)}>View Details</button>
    }, {
      title: 'Campaign Action',
      dataIndex: 'action',
      width: 150,
      render: (text, row) => <div style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>
        {/* <span onClick={() => this.pause()} className="action-icon glyphicon glyphicon-pause"></span>
        <If condition={false}> <span onClick={() => this.stop()} className="action-icon glyphicon glyphicon-play"></span></If> */}
        <button type="button" className="btn btn-link"><span onClick={() => this.edit(text, row)} className="action-icon glyphicon glyphicon-edit"></span></button>
        <button type="button" className="btn btn-link"><span onClick={() => this.delete()} className="action-icon glyphicon glyphicon-trash"></span></button>
      </div>
      ,
    }, {
      title: 'validity',
      dataIndex: 'validity',
      width: 200,

    }, {
      title: 'Audience',
      dataIndex: 'audience',
      //width: 250
    }, {
      title: 'Status',
      dataIndex: 'campaign_status',
      width: 100
    }, {
      title: 'Reports',
      dataIndex: 'reports',
      width: 100,
      render: (text, row) => <button type="button" className="btn btn-link" style={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>Download</button >
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
  componentDidMount = () => {
    //GlobalActions.viewAllData()
    RotationStore.listen(this.onChange);
  };
  componentWillUnmount = () => {
    RotationStore.unlisten(this.onChange);
  };
  delete = (event) => {
    console.log('delete')
  }
  edit = (text, row) => {
    GlobalActions.cloneNotificationData(row.key - 1)
    GlobalActions.setCurrentView('home', 'new')
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
      let tdString = tr[i].getElementsByTagName("td")[1].textContent
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

  handleOk = (e) => {
    console.log(e);
    GlobalActions.showCampaignDetails(false);
  }

  handleCancel = (e) => {
    console.log(e);
    GlobalActions.showCampaignDetails(false);
  }
  render() {
    let { show, formData, apiStatus } = this.props
    let { allData, showDetails } = this.state.RotationS
    let loading = true

    console.log({ formData })
    if ((Array.isArray(allData) && allData.length > 0) || (apiStatus && apiStatus.error)) {
      loading = false
    }
    if (apiStatus === 'loading') {
      loading = true
    }
    let messageObject = ''
    if (Object.entries(formData).length !== 0 && formData.constructor === Object && formData.locale_message_map) {
      messageObject = Object.keys(formData.locale_message_map).map((key) => {
        return (
          <div>
            <li class="list-group-item list-group-item-light">Locale : {key}, Title : {formData.locale_message_map[key].title}, Message : {formData.locale_message_map[key].message}
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
              <button onClick={this.refreshData} class="btn btn-info"><span class="glyphicon glyphicon-refresh"></span> Refresh</button>
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
              <p>
                <li class="list-group-item list-group-item-light"><div>Campaign Name : {formData.campaign_id}</div></li>
                <li class="list-group-item list-group-item-light"><div> Campaign Status : {formData.campaign_status}</div></li>
                <li class="list-group-item list-group-item-light"><div>Audience : {formData.audience}</div></li>
                <li class="list-group-item list-group-item-light"><div>Campaign Validity : {formData.campaign_start_time} - {formData.campaign_end_time}</div></li>
                {messageObject}
                <li class="list-group-item list-group-item-light"><div>Ribbon gif url : {formData.gif_url}</div></li>
                <li class="list-group-item list-group-item-light"><div>Action title : {formData.click_action_title}</div></li>
                <li class="list-group-item list-group-item-light"><div>Action type : {formData.click_action_type}</div></li>
                <li class="list-group-item list-group-item-light"><div>Action value : {formData.click_action_value}</div></li>
                <li class="list-group-item list-group-item-light"><div>priority : {formData.priority}</div></li>
                <li class="list-group-item list-group-item-light"><div>Notification mode : {formData.show_at}</div></li>
                <li class="list-group-item list-group-item-light"><div>Package name : {formData.package_name}</div></li>
                <li class="list-group-item list-group-item-light"><div>Action id : {formData.sub_tab_id}</div></li>
                <li class="list-group-item list-group-item-light"><div>Image url : {formData.tile_menu_url}</div></li>

              </p>
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
