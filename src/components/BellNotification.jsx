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

const localeList = ['us', 'kr', 'vi', 'jp'];


class BellNotification extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      errorObj: {},
      packageNameError: '',
      tileMenuUrlError: '',
      actionTitleError: '',
      gifUrlError: '',
      locale_message_map: {
        en: {
          message: '',
          title: ''
        }
      },
      newData: {
        'click_action_title': "",
        'click_action_type': "InstallPlay",
        //'click_action_value': "MY_APP_TEXT",
        'priority': 'Normal',
        'gif_url': "",
        'package_name': "",
        'show_at': "ribbon",
        // 'sub_tab_id': "home",
        'tile_menu_url': ""
      },
      localeCount: ['en'],
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
    let newData = this.state.newData;
    let copyData = this.props.cloneData
    if (Object.entries(copyData).length !== 0 && copyData.constructor === Object) {
      for (var prop in newData) {
        if (copyData[prop])
          newData[prop] = copyData[prop]
      }
    }
    if (copyData && copyData.locale_list) {
      this.setState({ localeCount: copyData.locale_list, locale_message_map: copyData.locale_message_map })
    }
    this.setState({ newData })
  }
  updatevalue = (name, event) => {
    let newData = this.state.newData;
    newData[name] = event.target.value;
    if (name === 'click_action_type') {
      if (event.target.value === 'HomeAppTab') {
        newData['click_action_value'] = 'MY_APP_TEXT'
      }
      else if (event.target.value === 'SettingsMenu') {
        newData['click_action_value'] = 'DISPLAY_SETTINGS_TEXT'
        delete newData['sub_tab_id']
      } else if (event.target.value === 'InstallCDN' || event.target.value === 'UserBrowser') {
        newData['click_action_value'] = ''
        delete newData['sub_tab_id']
      } else
        if (event.target.value !== 'HomeAppTab' && event.target.value !== 'SettingsMenu') {
          delete newData['click_action_value']
          delete newData['sub_tab_id']
        }
    }
    if (name === 'click_action_value') {
      newData['sub_tab_id'] = 'home'
    }
    this.setState({ newData });
    if (name === 'package_name')
      this.validatePackage()
    if (name === 'tile_menu_url')
      this.validateTileUrl()
    if (name === 'click_action_title')
      this.validateActionTitle()
    if (name === 'gif_url')
      this.validateGifUrl()
    if (name === 'click_action_value')
      this.validateActionValue()
  };
  uploadImage = (event, name) => {

    let { newData } = this.state;
    newData[name] = event.target.files[0];
    if (name === 'gif_file') {
      document.getElementById('gif_url').setAttribute('disabled', 'disabled')
      this.setState({ newData: newData, removeGifImage: true })
    } else {
      document.getElementById('title_menu_url').setAttribute('disabled', 'disabled')
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
  backClick = () => {
    if (document.getElementById('notification-form')) {
      document.getElementById('notification-form').style.display = 'none'
    }
    GlobalActions.setChannel('dashboard')
  }
  addLocaleRow = () => {
    this.setState(prevState => ({
      localeCount: [...prevState.localeCount, '']
    }))
    // const { locale_message_map } = this.state;
    // let messageMap={}
    // Object.assign(messageMap, locale_message_map);
    // messageMap['s']={title:'',message:''};
    // console.log({messageMap})
    // this.setState({locale_message_map,messageMap})
    // console.log(this.state)
  }
  validatePackage = () => {
    let newData = this.state.newData;
    let packageNameError = newData.package_name.length === 0 ? 'Package name cannot be empty' : newData.package_name.startsWith('com.') ? null : 'Package name should start with com.'
    this.setState({
      packageNameError: packageNameError
    });
  }
  validateTileUrl = () => {
    let newData = this.state.newData;
    this.setState({
      tileMenuUrlError: newData.tile_menu_url.length > 0 ? null : 'Tile menu url cannot be empty'
    });
  }
  validateActionTitle = () => {
    let newData = this.state.newData;
    this.setState({
      actionTitleError: newData.click_action_title.length > 0 ? null : 'Click action title cannot be empty'
    });
  }
  validateActionValue = () => {
    let newData = this.state.newData;
    this.setState({
      actionValueError: newData.click_action_value && newData.click_action_value.length > 0 ? null : 'Click action value cannot be empty'
    });
  }
  validateGifUrl = () => {
    let newData = this.state.newData;
    this.setState({
      gifUrlError: newData.gif_url.length > 0 ? null : 'Ribbon gif url cannot be empty'
    });
  }
  removeLocalerow = (index) => {
    var elem = document.getElementById(`removeClass${index}`);
    elem.parentNode.removeChild(elem);
  }
  onModeChanged = (param) => {
    let newData = this.state.newData;
    newData.show_at = param
    this.setState({ newData });
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
    newData['notificationMessage'] = localeObj;
    this.setState({ newData });

    //GlobalActions.saveDraft(newData)
  }
  nextClick = (view) => {
    let data = this.state.newData
    this.validateActionTitle()
    this.validateActionValue()
    this.validateGifUrl()
    this.validatePackage()
    this.validateTileUrl()
    let { packageNameError } = this.state
    if (packageNameError) {
      return
    }
    for (var prop in data) {
      if (!data[prop]) {
        //this.setState({ errorObj: { error: `Fields marked with * are mandatory` } });
        return
      }
    }
    this.setState({ errorObj: '' });
    document.getElementById("notification-form").style.display = "none";
    document.getElementById("audience").style.display = "block";
    this.saveDraft();
    GlobalActions.saveFormData(this.state.newData);
  }

  render() {

    let { formData, apiStatus, cloneData } = this.props;

    let { newData, removeGifImage, removeTileImage, errorObj, localeCount, locale_message_map } = this.state
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
                defaultValue={locale_message_map[item] ? locale_message_map[item].title : ''}
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
                defaultValue={locale_message_map[item] ? locale_message_map[item].message : ''}
                //onChange={this.updateparam.bind(this, "")}
                className="form-control"
              />
            </div>
            <div className="col-sm-2">
              {index === 0 && <input
                type="text"
                id={`locale${index}`}
                defaultValue={item}
                disabled="disabled"
                className="form-control"
                placeholder="Locale"
              />}
              {index !== 0 && <input
                type="text"
                id={`locale${index}`}
                defaultValue={item}
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
          <label className="control-label col-sm-3">Ribbon gif URL</label>
          <div className="col-sm-6">
            <input type="text" id="gif_url" autoComplete="off" value={newData.gif_url} onChange={this.updatevalue.bind(this, "gif_url")} className={`form-control ${this.state.gifUrlError ? 'is-invalid' : ''}`} />
            <div className='invalid-feedback'>{this.state.gifUrlError}</div>
          </div>
          {/* <div className="col-sm-3">
            <input type="file" name="" id="gifImageUploader" onChange={(e) => this.uploadImage(e, 'gif_file')} />
            <If condition={removeGifImage}>
              <button style={{ position: "absolute", right: "0px", width: "30px", height: "30px" }} type="button" onClick={this.removeGifImageAction} className="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </If>
          </div> */}
        </div>
        <div className="form-group required">
          <label className="control-label col-sm-3">Click Action Type</label>
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
        <If condition={newData.click_action_type === 'SettingsMenu'}>
          <div className="form-group required">
            <label className="control-label col-sm-3 ">
              Click Action Value
              </label>
            <div className="col-sm-6">
              <select className="form-control" value={newData.click_action_value} id="click_action_type" onChange={this.updatevalue.bind(this, "click_action_value")} name="click_action_value" required>
                {/* <option value="">Select Action</option> */}
                <option value="DISPLAY_SETTINGS_TEXT">DISPLAY_SETTINGS_TEXT</option>
                <option value="ENGINE_SETTING_TEXT">ENGINE_SETTING_TEXT</option>
                <option value="BOSSKEY_SETTING_TEXT">BOSSKEY_SETTING_TEXT</option>
                <option value="Notification Text">Notification Text</option>
                <option value="PREFERENCES_TEXT">PREFERENCES_TEXT</option>
                <option value="BACKUPRESTORE_SETTING_TEXT">BACKUPRESTORE_SETTING_TEXT</option>
                <option value="UPDATE_SETTING_TEXT">UPDATE_SETTING_TEXT</option>
                <option value="ABOUT_SETTING_TEXT">ABOUT_SETTING_TEXT</option>
              </select>
              {/* <input type="text" value={newData.click_action_value} onChange={this.updatevalue.bind(this, "click_action_value")} className="form-control" /> */}
            </div>
            <br />
          </div>
        </If>
        <If condition={newData.click_action_type === 'HomeAppTab'}>
          <div className="form-group required">
            <label className="control-label col-sm-3 ">
              Click Action Value
              </label>
            <div className="col-sm-6">
              <select className="form-control" value={newData.click_action_value} id="click_action_type" onChange={this.updatevalue.bind(this, "click_action_value")} name="click_action_value" required>
                {/* <option value="">Select Action</option> */}
                <option value="MY_APP_TEXT">MY_APP_TEXT</option>
                <option value="APP_CENTER_TEXT">APP_CENTER_TEXT</option>
              </select>
              {/* <input type="text" value={newData.click_action_value} onChange={this.updatevalue.bind(this, "click_action_value")} className="form-control" /> */}
            </div>
            <br />
          </div>
        </If>
        <If condition={newData.click_action_type === 'InstallCDN' || newData.click_action_type === 'UserBrowser'}>
          <div className="form-group required">
            <label className="control-label col-sm-3 ">
              Click Action Value
              </label>
            <div className="col-sm-6">
              <input type="text" autoComplete="off" value={newData.click_action_value} onChange={this.updatevalue.bind(this, "click_action_value")} className={`form-control ${this.state.actionValueError ? 'is-invalid' : ''}`} />
              <div className='invalid-feedback'>{this.state.actionValueError}</div>
            </div>
            <br />
          </div>
        </If>
        <If condition={newData.click_action_type === 'HomeAppTab' && newData.click_action_value === 'APP_CENTER_TEXT'}>
          <div className="form-group required">
            <label className="control-label col-sm-3 ">
              Sub tab id
              </label>
            <div className="col-sm-6">
              <select className="form-control" value={newData.sub_tab_id} id="click_action_type" onChange={this.updatevalue.bind(this, "sub_tab_id")} name="sub_tab_id" required>
                <option value="home">home</option>
                <option value="applist">applist</option>
                <option value="topics">topics</option>
                <option value="preregistration">preregistration</option>
                <option value="forum">forum</option>
                <option value="GIFT_TEXT">GIFT_TEXT</option>
                <option value="FEEDBACK_TEXT">FEEDBACK_TEXT</option>
                <option value="MAPS_TEXT">MAPS_TEXT</option>
              </select>
            </div>
            <br />
          </div>
        </If>

        <div className="form-group required">
          <label className="control-label col-sm-3 ">Click Action Title </label>
          <div className="col-sm-6">
            <input type="text" autoComplete="off" value={newData.click_action_title} onChange={this.updatevalue.bind(this, "click_action_title")} className={`form-control ${this.state.actionTitleError ? 'is-invalid' : ''}`} />
            <div className='invalid-feedback'>{this.state.actionTitleError}</div>
          </div>
          <br />
        </div>
        <div className="form-group required">
          <label className="control-label col-sm-3">Priority</label>
          <div className="col-sm-6">
            <select className="form-control" id="click_action_type" value={newData.priority} onChange={this.updatevalue.bind(this, "priority")} name="priority" required>
              <option value="Normal">Normal</option>
              <option value="Important">Important</option>
            </select>
          </div>
          <br />
        </div>
        <div className="form-group required">
          <label className="control-label col-sm-3">Show at</label>
          <div id="notificationMode" className="col-sm-6">
            <label className="radio-inline">
              <input type="radio" name="site_name"
                value="ribbon"
                checked={newData.show_at === 'ribbon'}
                onChange={() => this.onModeChanged('ribbon')} />Ribbon
                </label>
            <label className="radio-inline">
              <input type="radio" name="site_name"
                value="sticky"
                checked={newData.show_at === 'dropdown'}
                onChange={() => this.onModeChanged('dropdown')} />Dropdown
                </label>
            <label className="radio-inline">
              <input type="radio" name="site_name"
                value="both"
                checked={newData.show_at === 'both'}
                onChange={() => this.onModeChanged('both')} /> Both
                </label>
          </div>
        </div>
        <div className="form-group required">
          <label className="control-label col-sm-3">Tile menu url</label>
          <div className="col-sm-6">
            <input type="text" id="title_menu_url" autoComplete="off" className={`form-control ${this.state.tileMenuUrlError ? 'is-invalid' : ''}`} value={newData.tile_menu_url} onChange={this.updatevalue.bind(this, "tile_menu_url")} />
            <div className='invalid-feedback'>{this.state.tileMenuUrlError}</div>
            {/* <div style={{ height: "137px", marginTop: "12px" }}>
                <img src={newData.image_url} alt="" />
              </div> */}
          </div>

          {/* <div className="col-sm-3">
            <input type="file" name="" id="tileImageUploader" onChange={(e) => this.uploadImage(e, 'tile_menu_file')} />
            <div style={{ height: "137px", marginTop: "12px" }}>
                <img id="uploadedImage" src="#" alt="" />
              </div> 
            <If condition={removeTileImage}>
              <button style={{ position: "absolute", right: "0px", width: "30px", height: "30px" }} type="button" onClick={this.removeTileImageAction} className="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </If>
          </div> */}
        </div>
        <div className="form-group required">
          <label className="control-label col-sm-3 ">
            Package Name
              </label>
          <div className="col-sm-6">
            <input type="text" autoComplete="off" onChange={this.updatevalue.bind(this, "package_name")} value={newData.package_name} className={`form-control ${this.state.packageNameError ? 'is-invalid' : ''}`} />
            <div className='invalid-feedback'>{this.state.packageNameError}</div>

          </div>
          <br />
        </div>
        <If condition={errorObj != null && errorObj.error != null}>
          <div className="alert alert-warning">
            <strong>Warning!</strong> {errorObj && errorObj.error}
          </div>
        </If>
        <ButtonBar backClick={this.backClick} saveClick={this.saveDraft} nextClick={() => this.nextClick("audience")} />
      </form>
      <Audience apiStatus={apiStatus} formData={formData} cloneData={cloneData} />
    </div>;
  }
}

export default BellNotification;
