import React from "react";
import If from './common/If'
import { Form, Icon, Select, DatePicker, Tooltip, Input } from "antd";
import moment from "moment";
import GlobalActions from "../actions/GlobalActions";
import { confirmAlert } from 'react-confirm-alert';
import ButtonBar from './common/ButtonBar'
import "antd/dist/antd.css";

const { TextArea } = Input;
const RangePicker = DatePicker.RangePicker;
const tooltipText = <div>
  Hashtags Examples :- <br />
  <br /> #country_US_CA: only for US,CA countries
<br />
  #installedapp_com.supercell.clashofclans : clashofclans is
installed <br /> #pikapoints-current_1000_9999999999 :
current pika points min 1000 max 9999999999 <br />
  #pikapoints-alltime_1000_9999999999 : alltime pika points
min 1000 max 9999999999 <br /> #age-day_0_0: Show on Day0
      of User
<br />
  #age-day_1_999: Show from Day1 to Day999 of User <br />
  #email_present: Show if email present. <br />{" "}
  #email_absent: Show if email absent. <br />{" "}
  #premium_user_present: Show to premium users <br />{" "}
  #premium_user_absent: Not Show to premium users
</div>

class Audience extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      audience: "",
      apiStatus: '',
      validity: '',
      startTime: '',
      endTime: '',
      audienceType: 'filters'
    }
  }
  componentDidMount = () => {
    let copyData = this.props.cloneData
    if (copyData) {
      if (copyData.audienceType) {
        this.setState({ audienceType: copyData.audienceType })
      }
      if (copyData.audienceType) {
        this.setState({ audience: copyData.audience })
      }
      if (copyData.campaign_start_time) {
        this.setState({
          validity: [moment(copyData.campaign_start_time),
          moment(copyData.campaign_end_time)],
          time:[copyData.campaign_start_time,copyData.campaign_end_time]
      })
    }
  }

  }
  onChange = (date, dateString) => {
    this.setState({ validity: date, apiStatus: '',time:dateString});
  }
  changeTab = () => {
    document.getElementById('notification-form').style.display = 'block'
    document.getElementById('audience').style.display = 'none'
  }
  sendClick = () => {
    confirmAlert({
      title: ``,
      message: 'Are you sure you want to schedule this campaign ?',
      buttons: [
        {
          label: 'yes',
          onClick: () => this.publishCamp()
        },
        {
          label: 'No'
        }
      ]
    })
  }
  uploadCsv = event => {
    this.setState({ csv_file: event.target.files[0], apiStatus: '' });
  };
  updateval = (name, event) => {
    this.setState({ audience: event.target.value, apiStatus: '' });
  };
  saveDraft = () => {
    GlobalActions.saveAudienceDraft()
  }
  publishCamp = () => {

    if (this.state.audienceType === 'filters') {
      if (!this.state.audience) {
        this.setState({ apiStatus: { error: "Enter audience and validity" } })
      } else if (this.state.audience && (!this.state.time || !this.state.time[0])) {
        this.setState({ apiStatus: { error: "Validity is mandatory for creating filter" } })
      } else {
        GlobalActions.publishCampaign(this.state.audienceType,this.state.audience, this.state.time,)
      }
    } else if (this.state.audienceType === 'guid') {
      var csv_data
      var fileInput = document.getElementById('csv_uploader');
      if (fileInput && fileInput.files[0]) {
        var reader = new FileReader();
        reader.readAsBinaryString(fileInput.files[0]);
        reader.onload = () => {
          csv_data = reader.result.split(/\r\n|\n/);
          GlobalActions.publishCampaign(this.state.audienceType,JSON.stringify(csv_data))
        }
      } else {
        this.setState({ apiStatus: { error: "Upload guid file" } })
      }
    }

  }
  onModeChanged = (param) => {
    this.setState({ audienceType: param })
  }
  render() {
    let { audience, audienceType,validity } = this.state;

    let { apiStatus, cloneData } = this.props
    if (this.state.apiStatus) {
      apiStatus = this.state.apiStatus
    }
    let cloneValidity
    if (cloneData && cloneData.campaign_start_time) {
      cloneValidity =
      [moment(cloneData.campaign_start_time),
      moment(cloneData.campaign_end_time)]
    }
    if(validity){
      cloneValidity=validity
    }
    return <div id="audience">
      <If condition={apiStatus != null && apiStatus.error != null}>
        <div className="alert alert-warning">
          <strong>Warning!</strong> {apiStatus && apiStatus.error}
        </div>
      </If>
      <section>
        <h4> Define Audience</h4>
        <div style={{ 'textAlign': 'center', 'marginBottom': '20px' }}> <label className="radio-inline">
          <input type="radio" name="site_name" value="ribbon" checked={audienceType === "filters"} onChange={() => this.onModeChanged("filters")} />
          Enter Audience
            </label>
          <label className="radio-inline">
            <input type="radio" name="site_name" value="sticky" checked={audienceType === "guid"} onChange={() => this.onModeChanged("guid")} />
            Upload Guids
            </label></div>
        <form className="form-horizontal">
          <If condition={audienceType === 'filters'}>
            <div className="form-group required">
              <label className="control-label col-sm-3 ">
                {" "}
                Enter audience{" "}
              </label>
              <div className="col-sm-6">
                <TextArea className="hashtags_input form-control"  value={audience} onChange={this.updateval.bind(this, "audience")} placeholder="Enter hashtags seperated by comma like #country_US,#age-day_0_0 without any spaces in between" />
                <Tooltip title={tooltipText}>
                  <button type="button" className="btn btn-link">
                    Filter ?
                  </button>
                </Tooltip>
              </div>
            </div>

            <div className="form-group required">
              <label className="control-label col-sm-3 ">validity </label>

              <div className="col-sm-6">
                <RangePicker onChange={this.onChange} placeholder={["Start Time", "End Time"]} disabled={audienceType === 'guid'}
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  defaultValue={cloneValidity}  />
                  
              </div>
            </div>
          </If>
          <If condition={audienceType === 'guid'}>
            <div className="form-group required">
              <label className="control-label col-sm-3 ">
                Upload GUID File{" "}
              </label>
              <div className="col-sm-6">
                <input type="file" id="csv_uploader" name="csv_uploader" onChange={this.uploadCsv} accept=".xlsx, .xls, .csv" />
              </div>
              {/* <div className="col-sm-3">
                <button
                  type="button"
                  onClick={this.saveDraft}
                  className="btn btn-warning btn-md"
                >
                  <span> Test Csv</span>
                </button>
                </div> */}
            </div>
          </If>
          <If condition={apiStatus==''}>
          <ButtonBar nextString="Send" backClick={this.changeTab} saveClick={this.saveDraft} nextClick={() => this.sendClick("audience")} />
          </If>
        </form>
      </section>
    </div>;
  }
}

export default Audience;
