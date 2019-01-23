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
      mode: 'ribbon',
      // newData: {
      //   'click_action_title': "",
      //   'click_action_type': "InstallPlay",
      //   'click_action_value': "",
      //   'priority':'normal',
      //   'gif_url': "",
      //   'package_name': "",
      //   'show_at': "ribbon",
      //   'sub_tab_id': "",
      //   'tile_menu_url': ""
      // },
      newData: {
        'click_action_title': "d",
        'click_action_type': "InstallPlay",
        'click_action_value': "sd",
        'priority':'normal',
        'gif_url': "ds",
        'package_name': "d",
        'show_at': "ribbon",
        'sub_tab_id': "sd",
        'tile_menu_url': "dsds"
      },
      localeCount: [1],
      removeGifImage: false,
      removeTileImage: false
    };
    this.removeLocalerow = this.removeLocalerow.bind(this)
  }
  componentDidMount = () => {
    if (document.getElementById('notification-form')) {
      document.getElementById('notification-form').style.display = 'block'
    }
    if (document.getElementById('audience')) {
      document.getElementById('audience').style.display = 'none'
    }
  }
  updatevalue = (name, event) => {
    let newData = this.state.newData;
    newData[name] = event.target.value;
    this.setState({ newData });
  };
  uploadImage = (event, name) => {

    let { newData } = this.state;
    newData[name] = event.target.files[0];
    if (name === 'gif_file') {
      document.getElementById('gif_url').setAttribute('disabled','disabled')
      this.setState({ newData: newData, removeGifImage: true })
    } else {
      document.getElementById('title_menu_url').setAttribute('disabled','disabled')
      this.setState({ newData: newData, removeTileImage: true })
    }
    //this.setImgPreview(event)
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
  removeGifImageAction = () => {
    let { newData } = this.state;
    document.getElementById('gif_url').removeAttribute('disabled')
    document.getElementById('gifImageUploader').value = ''
    this.setState({ newData: newData, removeGifImage: false });
  }
  removeTileImageAction = () => {
    let { newData } = this.state;
    document.getElementById('title_menu_url').removeAttribute('disabled')
    document.getElementById('tileImageUploader').value = ''
    this.setState({ newData: newData, removeTileImage: false });
  }
  handleActionChange = selectedAction => {
    let newData = this.state.newData;
    newData.action = selectedAction.value;
    this.setState({ selectedAction, newData });
  };
  changeTab = () => {
    if (document.getElementById('notification-form')) {
      document.getElementById('notification-form').style.display = 'none'
    }
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
  onModeChanged = (param) => {
    this.setState({
      mode: param
    });
  }
  saveDraft = () => {
    let localeObj = []
    let titles = document.querySelectorAll('*[id^="notifTitle"]');
    let desc = document.querySelectorAll('*[id^="message"]');
     titles = document.querySelectorAll('*[id^="notifTitle"]');
    let locales = document.querySelectorAll('*[id^="locale"]');
    titles.forEach((item, index) => {
      localeObj.push({ 'title': item.value, 'message': desc[index].value, locale: locales[index].value })
    })
    let newData = this.state.newData;
    // newData.title=localeObj.title
    // newData.message=localeObj.desc
    // newData.locale=localeObj.locale
    newData['notificationMessage'] = localeObj;
    newData.show_at = this.state.mode
    this.setState({ newData });
    //GlobalActions.saveDraft(newData)
  }
  nextClick = (view) => {
    document.getElementById('notification-form').style.display = 'none'
    document.getElementById('audience').style.display = 'block'
    this.saveDraft()
    GlobalActions.saveFormData(this.state.newData)
    GlobalActions.setCurrentView(view)
  }

  render() {

    let { currentView, formData,apiStatus } = this.props;

    let { newData, removeGifImage, removeTileImage, localeCount, mode } = this.state

    let options = localeList.map(item => (
      <option>{item}</option>
    ))
    let notificationObject = localeCount.map((item, index) => {
      return (
        <div key={index} id={`removeClass${index}`} style={{ 'marginBottom': '11px' }}>
          <div className={"form-group "}>
            <label className="control-label col-sm-3 "> {index === 0 && 'Title'}</label>
            <div className="col-sm-2">
              <input
                type="text"
                id={`notifTitle${index}`}

                //onChange={this.updateparam.bind(this, `title${index}`)}
                className="form-control"
                placeholder="Title"
              />
            </div>
            {/* <label className="control-label col-sm-1">Select Locale</label> */}
            {/* <div className="col-sm-3">
              <select
                id={`locale${index}`}
                onChange={this.handleActionChange}
                placeholder="select locale"
              >{options}</select>
            </div> */}
            <div className="col-sm-2">
              <input
                type="text"
                id={`message${index}`}
                placeholder="Message"
                //onChange={this.updateparam.bind(this, "")}
                className="form-control"
              />
            </div>
            <div className="col-sm-2">
            {index === 0 &&  <input
                type="text"
                id={`locale${index}`}
                value="en"
                disabled="disabled"
                className="form-control"
                placeholder="Locale"
              />}
              {index !== 0 &&  <input
                type="text"
                id={`locale${index}`}
                className="form-control"
                placeholder="Locale"
              />}
            </div>
            <div className="col-sm-2">
              {index === 0 && <button type="button" onClick={this.addLocaleRow} className="btn btn-info"><span className="glyphicon glyphicon-plus"></span></button>}
              {index > 0 && <button className="btn btn-danger" type="button" onClick={() => this.removeLocalerow(index)} >
                <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
              </button>}
            </div>
          </div>
          {/* <div className="form-group required">
            <label className="control-label col-sm-3 ">Description </label>
            <div className="col-sm-6">
              <input
                type="text"
                id={`message${index}`}
                //onChange={this.updateparam.bind(this, "")}
                className="form-control"
              />
            </div>
            <br />
          </div> */}
        </div>
      )
    })
    return <div>

      <form id="notification-form">
        {notificationObject}
        <div className="form-group required">
          <label className="control-label col-sm-3">Ribbon gif url</label>
          <div className="col-sm-6">
            <input type="text" id="gif_url" className="form-control" value={newData.gif_url} onChange={this.updatevalue.bind(this, "gif_url")} />
          </div>
          <div className="col-sm-3">
            <input type="file" name="" id="gifImageUploader" onChange={(e) => this.uploadImage(e, 'gif_file')} />
            <If condition={removeGifImage}>
              <button style={{ position: "absolute", right: "0px", width: "30px", height: "30px" }} type="button" onClick={this.removeGifImageAction} className="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </If>
          </div>
        </div>
        <div className="form-group required">
          <label className="control-label col-sm-3">Action</label>
          <div className="col-sm-6">
            <select className="form-control" value={newData.click_action_type} id="click_action_type" onChange={this.updatevalue.bind(this, "click_action_type")} name="click_action_type" required>
              {/* <option value="">Select Action</option> */}
              <option value="InstallPlay">Install Play</option>
              <option value="InstallCDN">Install CDN</option>
              <option value="ApplicationBrowser">Application Browser</option>
              <option value="UserBrowser">User Browser</option>
              <option value="AppCenter">AppCenter</option>
              <option value="SettingsMenu">Setting Menu</option>
              <option value="HomeAppTab">Home App Tab</option>
              <option value="None">None</option>
            </select>
          </div>
          <br />
        </div>
        <div className="form-group required">
          <label className="control-label col-sm-3 ">
            Action Value
              </label>
          <div className="col-sm-6">
            <input type="text" value={newData.click_action_value} onChange={this.updatevalue.bind(this, "click_action_value")} className="form-control" />
          </div>
          <br />
        </div>
        <div className="form-group required">
          <label className="control-label col-sm-3 ">Action Id </label>
          <div className="col-sm-6">
            <input type="text" value={newData.sub_tab_id} onChange={this.updatevalue.bind(this, "sub_tab_id")} className="form-control" />
          </div>
          <br />
        </div>

        <div className="form-group required">
          <label className="control-label col-sm-3 ">CTA Title </label>
          <div className="col-sm-6">
            <input type="text" value={newData.click_action_title} onChange={this.updatevalue.bind(this, "click_action_title")} className="form-control" />
          </div>
          <br />
        </div>
        <div className="form-group required">
          <label className="control-label col-sm-3">Priority</label>
          <div className="col-sm-6">
            <select className="form-control" id="click_action_type" value={newData.priority} onChange={this.updatevalue.bind(this, "priority")} name="priority" required>
              <option value="normal">Normal</option>
              <option value="important">Important</option>
            </select>
          </div>
          <br />
        </div>
        <div className="form-group required">
          <label className="control-label col-sm-3">Select Notification mode</label>
          <div id="notificationMode" className="col-sm-6">
            <label className="radio-inline">
              <input type="radio" name="site_name"
                value="ribbon"
                checked={mode === 'ribbon'}
                onChange={() => this.onModeChanged('ribbon')} />Ribbon
                </label>
            <label className="radio-inline">
              <input type="radio" name="site_name"
                value="sticky"
                checked={mode === 'sticky'}
                onChange={() => this.onModeChanged('sticky')} />Sticky
                </label>
            <label className="radio-inline">
              <input type="radio" name="site_name"
                value="both"
                checked={mode === 'both'}
                onChange={() => this.onModeChanged('both')} /> Both
                </label>
          </div>
        </div>
        <div className="form-group required">
          <label className="control-label col-sm-3">Image url</label>
          <div className="col-sm-6">
            <input type="text" id="title_menu_url" className="form-control" value={newData.tile_menu_url} onChange={this.updatevalue.bind(this, "tile_menu_url")} />
            {/* <div style={{ height: "137px", marginTop: "12px" }}>
                <img src={newData.image_url} alt="" />
              </div> */}
          </div>

          <div className="col-sm-3">
            <input type="file" name="" id="tileImageUploader" onChange={(e) => this.uploadImage(e, 'tile_menu_file')} />
            {/* <div style={{ height: "137px", marginTop: "12px" }}>
                <img id="uploadedImage" src="#" alt="" />
              </div> */}
            <If condition={removeTileImage}>
              <button style={{ position: "absolute", right: "0px", width: "30px", height: "30px" }} type="button" onClick={this.removeTileImageAction} className="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </If>
          </div>
        </div>
        <div className="form-group required">
          <label className="control-label col-sm-3 ">
            Package Name
              </label>
          <div className="col-sm-6">
            <input type="text" onChange={this.updatevalue.bind(this, "package_name")} value={newData.package_name} className="form-control" />
          </div>
          <br />
        </div>

        <ButtonBar backClick={this.changeTab} saveClick={this.saveDraft} nextClick={() => this.nextClick("audience")} />
      </form>

      {/* <If condition={currentView === "audience"}> */}
      <Audience apiStatus={apiStatus} />
      {/* </If> */}
    </div>;
  }
}

export default BellNotification;