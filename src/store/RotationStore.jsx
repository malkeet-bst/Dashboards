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
    this.cloneData = {}
    this.showDetails = false
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
  onClearData=()=>{
    this.cloneData={}
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
  onShowCampaignDetails = (flag) => {
    this.showDetails = flag
  }
  onCloneNotificationData = (index) => {
    this.channelType = 'bell'
    this.apiStatus = ''
    Object.assign(this.cloneData, this.formData)
    this.onSetCurrentView('home', 'new')
    let data = this.allData[index]
    this.cloneData = JSON.parse(data.notification_data)
    this.cloneData.audience = data.audience
    this.cloneData.campaign_id = data.campaign_id
    this.cloneData.campaign_status = data.campaign_status
    if (!data.start_time) {
      this.cloneData.audienceType = 'guid'
    }
    else {
      this.cloneData.audienceType = 'filters'
      this.cloneData.campaign_start_time = data.start_time
      this.cloneData.campaign_end_time = data.end_time
    }
    this.emitChange()
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
      if (!showSaveMessage)
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
      this.apiStatus = { error: 'some error occured, please try again' }
    }
    this.emitChange()
  }
  onViewStats = async (id) => {
    // let url = `${this.apiUrl}rotation_cms`;
    // try {
    //   const data = await this.fetchData(url)
    //   const json = await data.json()
    //   this.allData.forEach((item, index) => {
    //   if(item.campaign_id===id){
    //   item.stats=json
    //   }
    // })
    // } catch (e) {
    //   console.error("Problem", e)
    // }
    this.allData.forEach((item, index) => {
      if (item.campaign_id === id) {
        //item.stats=100
      }
    })
  }
  onSaveDraft = async (formData) => {
    let url = `${this.apiUrl}rotation_cms`;
    try {
      const data = await this.fetchData(url)
      const json = await data.json()
    } catch (e) {
    }
  }
  onSaveAudienceDraft = async (formData) => {
    let url = `${this.apiUrl}rotation_cms`;
    try {
      const data = await this.fetchData(url)
      const json = await data.json()
    } catch (e) {
    }
  }
  onDeleteCampaign = async (id) => {
    this.apiStatus = 'loading'
    var fd = new FormData();
    fd.append('campaign_id', id)
    let url = 'https://notif-v2-dot-bs3-appcenter-engg.appspot.com/notifications/cms/delete/v2'

    let response = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json"
      },
      body: fd
    });
    if (response && (response.status === 200 || response.status === 304)) {
      let user = await response.json();
      if (user && user.success) {
        this.onViewAllData(true)
        this.apiStatus = { success: "Campaign deleted successfully" };
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
  onPublishCampaign = async (audienceData) => {
    this.apiStatus = 'loading'
    let tempData = {}
    Object.assign(tempData, this.formData);
    var fd = new FormData();
    if (tempData && tempData.audienceType) {
      delete tempData.audienceType
    }
    if (audienceData && audienceData[3] && audienceData[3] === 'filters') {
      fd.append('hashtags', audienceData[0])
      this.formData.hashtags = audienceData[0]
      if (audienceData[1]) {
        fd.append('campaign_start_time', audienceData[1][0])
        fd.append('campaign_end_time', audienceData[1][1])
        this.formData.campaign_start_time = audienceData[1][0]
        this.formData.campaign_end_time = audienceData[1][1]
      }
    } else if (audienceData && audienceData[3] && audienceData[3] === 'guid') {
      fd.append('csv', audienceData[2])
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
  }
}


export default FluxApp.instance.createStore(RotationStore, "RotationStore");
