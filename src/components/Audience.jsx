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


class Audience extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      filters: "",
      validity: '',
      audienceData:{}
    }
  }
  onChange = (date, dateString) => {
    console.log(date, dateString)
    let audienceData = this.state.audienceData;
    audienceData.validity = dateString;
    this.setState({ audienceData });
  }
  changeTab = () => {
    GlobalActions.setCurrentView('home')
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
    let { audienceData } = this.state;
    audienceData.csv_file = event.target.files[0];
    this.setState({ audienceData: audienceData, showCloseImageIcon: true });
  };
  updateval = (name, event) => {
    let audienceData = this.state.audienceData;
    audienceData[name] = event.target.value;
    this.setState({ audienceData });
  };
  saveDraft = () => {
   GlobalActions.saveAudienceDraft(this.state.audienceData)
  }
  publishCamp = () => {
    GlobalActions.publishCampaign()
  }
  render() {
    let { audienceData, validity } = this.state;
    validity = [moment('2018-01-11T12:32:26.551Z'),
    moment('2018-02-19T12:32:26.551Z')]

    return (
      <div>

        <section>
          <h4> Define Audience</h4>
          <form className="form-horizontal">

            <div className="form-group required">
              <label className="control-label col-sm-3 "> Select Filters </label>
              <div className="col-sm-6">
                <TextArea
                  className="hashtags_input form-control"
                  defaultValue={this.props.hashTags}
                  disabled={this.props.isDefaultBanners}
                  value={audienceData.filters}
                  onChange={this.updateval.bind(this, "filters")}
                  placeholder="Enter hashtags seperated by comma like #country_US,#age-day_0_0 without any spaces in between"
                />
                <div style={{ 'marginTop': '6px' }}><a href="/" target="view_window">Filters ?</a></div>
              </div>
            </div>
            <div className="form-group required">
              <label className="control-label col-sm-3 ">Upload GUID File </label>
              <div className="col-sm-6">
                <input
                  type="file"
                  id="csv_uploader"
                  name="csv_uploader"
                  onChange={this.uploadCsv}
                  accept=".xlsx, .xls, .csv">
                </input>
              </div>
              <div className="col-sm-3">
                <button
                  type="button"
                  onClick={this.saveDraft}
                  className="btn btn-warning btn-md"
                >
                  <span> Test Csv</span>
                </button></div>
            </div>
            <div className="form-group required">
              <label className="control-label col-sm-3 ">validity </label>
              <div className="col-sm-6">
                <RangePicker onChange={this.onChange} defaultValue={
                  validity
                } />
              </div>
            </div>
            <ButtonBar nextString="Send" backClick={this.changeTab} saveClick={this.saveDraft} nextClick={() => this.sendClick('audience')} />
          </form>
        </section>
      </div>
    );
  }
}

export default Audience;
