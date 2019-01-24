import FluxApp from "../utils/FluxApp";
import GlobalActions from "../actions/GlobalActions";
import Utils from "../utils/util";

export class RotationStore {
  constructor() {
    window.RotationStore = this;
    this.rotationData = null;
    this.partnerList = null;
    this.apiStatus = null;
    this.currentView = ''
    this.channelType = ''
    this.templateData = ''
    this.activeTab = 'new'
    this.allData = [];
    this.formData = {}
    this.showDetails=false
    this.apiUrl = Utils.getUrlFromInstance(Utils.getCloudInstance());
    this.bindActions(GlobalActions);
    window.RotationStore = this;
  }

  onSetChannel(type) {
    this.channelType = type;
    this.apiStatus = ''
  }
  onSaveFormData = (data) => {
    this.formData = data
  }
  onSetCurrentView(attr) {
    this.apiStatus = ''
    if (typeof attr == 'object') {
      this.currentView = attr[0];
      this.activeTab = attr[1];
    } else {
      this.currentView = attr;
    }
  }
  onSetSelectedPartner = partner => {
    this.selectedPartner = partner;
  };
  onShowCampaignDetails=(flag)=>{
    this.showDetails = flag
  }
  onCloneNotificationData=(index)=>{
    this.channelType = 'bell'
    this.apiStatus = ''
    this.onSetCurrentView('home', 'new')
    let data=this.allData[index]
    this.formData=JSON.parse(data.notification_data)
    this.formData.audience=data.audience
    this.formData.campaign_start_time=data.start_time
    this.formData.campaign_end_time=data.end_time
    this.formData.campaign_id=data.campaign_id
    this.formData.campaign_status=data.campaign_status
    console.log(data)
  }
  fetchData = async (url) => {
    return fetch(url)
  }
  onViewAllData = async (showSaveMessage) => {
    this.apiStatus = 'loading'
    let url = 'https://notif-v2-dot-bs3-appcenter-engg.appspot.com/notifications/cms/history/v2'
    try {
      const data = await this.fetchData(url)
      const json = await data.json()
      this.allData = json.results
      if(!showSaveMessage)
      this.apiStatus = ''
      this.allData.forEach((item, index) => {
        item.key = index + 1
        if (item.start_time) {
          item.validity = item.start_time + ' - ' + item.end_time
        } else {
          item.validity = 'One Time'
        }
      })
    } catch (e) {
      console.error("Problem", e)
      this.apiStatus = ''
      this.apiStatus = {error:'some error occured, please try again'}
    }
    this.emitChange()
  }
  onSaveDraft = async (formData) => {
    console.log({ formData })
    let url = `${this.apiUrl}rotation_cms`;
    try {
      const data = await this.fetchData(url)
      const json = await data.json()
      console.log(json)
    } catch (e) {
      console.error("Problem", e)
    }
  }
  onSaveAudienceDraft = async (formData) => {
    console.log({ formData })
    let url = `${this.apiUrl}rotation_cms`;
    try {
      const data = await this.fetchData(url)
      const json = await data.json()
      console.log(json)
    } catch (e) {
      console.error("Problem", e)
    }
  }
  onPublishCampaign = async (audienceData) => {
    this.apiStatus = 'loading'
    let tempData = {}
    Object.assign(tempData, this.formData);
    var fd = new FormData();
    if (audienceData) {
      if (audienceData[0]) {
        fd.append('hashtags', audienceData[0])
        this.formData.hashtags = audienceData[0]
        if (audienceData[1]) {
          fd.append('campaign_start_time', "2018-03-09 00:00:00")
          fd.append('campaign_end_time', "2018-03-09 00:00:00")
          this.formData.campaign_start_time = audienceData[1][0]
          this.formData.campaign_end_time = audienceData[1][1]
        }
      } else {
        fd.append('csv', audienceData[2])
      }
    }

    tempData.notificationMessage.forEach(element => {
      fd.append('title[]', element.title)
      fd.append('message[]', element.message)
      fd.append('locale[]', element.locale)
    });
    delete tempData.notificationMessage
    for (var property in tempData) {
      fd.append(property, tempData[property]);
    }
    fd.append('env', 'prod')
    let url = 'https://notif-v2-dot-bs3-appcenter-engg.appspot.com/notifications/cms/send/v2'// 'http://cloud.bluestacks.com/notifications/cms/send'

    let response = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json"
      },
      body: fd
    });
    if (response && (response.status === 200 || response.status === 304)) {
      let user = await response.json();
      console.log({ user })
      if (user && user.success) {
        
        // this.currentView = ''
        // this.channelType = ''
        this.activeTab = 'view'
        this.onViewAllData(true)
        this.apiStatus = { success: "Campaign created successfully" };
        // this.onSetCurrentView('dashboard','view')
      } else {
        this.apiStatus = { error: user.message || 'some error occured' };
      }
    } else {
      this.apiStatus = { error: "some error occured" };
    }
    setTimeout(() => {
      this.apiStatus = ''
      this.emitChange();
    }, 4000)
    this.emitChange();

  }
  onCopyTemplate = (data) => {
    this.templateData = data
    console.log(this.templateData)
  }
}


export default FluxApp.instance.createStore(RotationStore, "RotationStore");
