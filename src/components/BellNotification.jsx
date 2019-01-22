import React from "react";
import If from './common/If'
import GlobalActions from "../actions/GlobalActions";
import Audience from "./Audience";
import ButtonBar from "./common/ButtonBar"

// const localeList = [
//   { value: "en", label: "en" },
//   { value: "kr", label: "kr" },
//   { value: "tw", label: "tw" },
//   { value: "vi", label: "vi" }
// ];
var room = 1
const localeList = ['us', 'kr', 'vi', 'jp'];
class BellNotification extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      newData: {},
      localeCount: [1],
      showCloseImageIcon: false
    };
    this.removeLocalerow = this.removeLocalerow.bind(this)
  }
  updatevalue = (name, event) => {
    let newData = this.state.newData;
    newData[name] = event.target.value;
    this.setState({ newData });
  };
  uploadImage = event => {

    let { newData } = this.state;
    newData.image_file = event.target.files[0];
    this.setState({ newData: newData, showCloseImageIcon: true });
    this.setImgPreview(event)
  };
  setImgPreview = (input) => {
    if (input && input.target && input.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('uploadedImage').setAttribute("src", e.target.result);
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  }
  removeImage = () => {
    let { newData } = this.state;
    document.getElementById('uploadedImage').setAttribute("src", '');
    document.getElementById('imageUploader').value = ''
    newData.image_file = '';
    this.setState({ newData: newData, showCloseImageIcon: false });
  }
  handleActionChange = selectedAction => {
    let newData = this.state.newData;
    newData.action = selectedAction.value;
    this.setState({ selectedAction, newData });
  };
  changeTab = () => {
    GlobalActions.setCurrentView('dashboard')
  }
  addLocaleRow = () => {
    //   this.setState(prevState => {
    //     return {localeCount: prevState.localeCount.push(1)}
    //  })
    this.setState(prevState => ({
      localeCount: [...prevState.localeCount, room++]
    }))
  }
  removeLocalerow = (index) => {
    var elem = document.getElementById(`removeClass${index}`);
    elem.parentNode.removeChild(elem);
  }
  saveDraft = () => {
    let localeObj = []
    let titles = document.querySelectorAll('*[id^="title"]');
    let desc = document.querySelectorAll('*[id^="description"]');
    let locales = document.querySelectorAll('*[id^="localeSelector"]');
    titles.forEach((item, index) => {
      localeObj.push({ 'title': item.value, 'desc': desc[index].value, locale: locales[index].value })
    })
    let newData = this.state.newData;
    newData['notificationObject'] = localeObj;
    this.setState({ newData });
    GlobalActions.saveDraft(newData)
  }
  nextClick = (view) => {
    GlobalActions.setCurrentView(view)
  }

  render() {
    let { currentView } = this.props;
    //currentView='audience'
    let { newData, showCloseImageIcon, localeCount } = this.state
    let options = localeList.map(item => (
      <option>{item}</option>
    ))
    let notificationObject = localeCount.map((item, index) => {
      return (
        <div key={index} id={`removeClass${index}`} style={{ 'borderBottom': '1px dotted saddlebrown', 'marginBottom': '11px' }}>
          <div className={"form-group required"}>
            <label className="control-label col-sm-3 "> Title</label>
            <div className="col-sm-3">
              <input
                type="text"
                id={`titleInput${index}`}
                //onChange={this.updateparam.bind(this, `title${index}`)}
                className="form-control"
                placeholder="Enter Title"
              />
            </div>
            {/* <label className="control-label col-sm-1">Select Locale</label> */}
            <div className="col-sm-3">
              <select
                id={`localeSelector${index}`}
                onChange={this.handleActionChange}
                placeholder="select locale"
              >{options}</select>
            </div>
            <div className="col-sm-2">
              {index === 0 && <button type="button" onClick={this.addLocaleRow} className="btn btn-info"><span className="glyphicon glyphicon-plus"></span></button>}
              {index > 0 && <button className="btn btn-danger" type="button" onClick={() => this.removeLocalerow(index)} >
                <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
              </button>}
            </div>
          </div>
          <div className="form-group required">
            <label className="control-label col-sm-3 ">Description </label>
            <div className="col-sm-6">
              <input
                type="text"
                id={`description${index}`}
                //onChange={this.updateparam.bind(this, "")}
                className="form-control"
              />
            </div>
            <br />
          </div>
        </div>
      )
    })
    console.log({ currentView })
    return (
      <div>
        <If condition={currentView === 'home'}>
          <form >
            {notificationObject}
            <div className="form-group required">
              <label className="control-label col-sm-3 ">CTA Title </label>
              <div className="col-sm-6">
                <input
                  type="text"
                  onChange={this.updatevalue.bind(this, "cta_title")}
                  className="form-control"
                />
              </div>
              <br />
            </div>

            <div className="form-group required">
              <label className="control-label col-sm-3">Action</label>
              <div className="col-sm-6">
                <select className="form-control" id="click_action_type" onChange={this.updatevalue.bind(this, "action")} name="click_action_type" required>
                  <option value=''>Select Action</option>
                  <option value='InstallPlay'>Install Play</option>
                  <option value='InstallCDN'>Install CDN</option>
                  <option value='ApplicationBrowser'>Application Browser</option>
                  <option value='UserBrowser'>User Browser</option>
                  <option value='AppCenter'>AppCenter</option>
                  <option value='SettingsMenu'>Setting Menu</option>
                  <option value='HomeAppTab'>Home App Tab</option>
                  <option value='None'>None</option>

                </select>
              </div>
              <br />
            </div>
            <div className="form-group required">
              <label className="control-label col-sm-3 ">Action Value </label>
              <div className="col-sm-6">
                <input
                  type="text"
                  onChange={this.updatevalue.bind(this, "action_value")}
                  className="form-control"
                />
              </div>
              <br />
            </div>
            <div className="form-group required">
              <label className="control-label col-sm-3 ">Action Id </label>
              <div className="col-sm-6">
                <input
                  type="text"
                  onChange={this.updatevalue.bind(this, "action_id")}
                  className="form-control"
                />
              </div>
              <br />
            </div>
            <div className="form-group required">
              <label className="control-label col-sm-3">Image url</label>
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  onChange={this.updatevalue.bind(this, "image_url")}
                />
                <div style={{ 'height': '137px', 'marginTop': '12px' }}><img src={newData.image_url} alt="" /></div>
              </div>
              <div className="col-sm-3">
                <input type="file" name="" id="imageUploader" onChange={this.uploadImage} />
                <div style={{ 'height': '137px', 'marginTop': '12px' }}><img id="uploadedImage" src="#" alt="" /></div>
                <If condition={showCloseImageIcon}>
                  <button style={{ 'position': 'absolute', 'right': '0px', 'width': '30px', 'height': '30px' }} type="button" onClick={this.removeImage} className="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </If>
              </div>
            </div>
            <ButtonBar backClick={this.changeTab} saveClick={this.saveDraft} nextClick={() => this.nextClick('audience')} />
          </form></If>
        <If condition={currentView === 'audience'}>
          <Audience />
        </If>
      </div>
    );
  }
}

export default BellNotification;
