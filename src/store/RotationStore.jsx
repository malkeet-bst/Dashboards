import FluxApp from "../utils/FluxApp";
import GlobalActions from "../actions/GlobalActions";
import Utils from "../utils/util";

export class RotationStore {
  constructor() {
    window.RotationStore = this;
    this.apiStatus = null;
    this.channelType = 'dashboard'
    this.currentView = 'new'
    this.allData=null
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
  onClearData = () => {
    this.cloneData = {}
  }
  onSetCurrentView(attr) {
    this.currentView=attr
  }
  onShowCampaignDetails = (flag) => {
    this.showDetails = flag
  }
  onCloneNotificationData = (index) => {
    this.channelType = 'bell'
    this.apiStatus = ''
    Object.assign(this.cloneData, this.formData)
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
    let url = `${this.apiUrl}notifications/cms/history/v2`
    try {
      const data = await this.fetchData(url)
      const json = await data.json()
      if(json.success){
        this.allData = json.results
        if(this.allData && this.allData.length===0){
          this.apiStatus = { success: 'No data found' }
        }
        if (!showSaveMessage && this.allData.length>0)
        this.apiStatus = ''
        if (Array.isArray(this.allData) && this.allData.length > 0) {
          this.allData.forEach((item, index) => {
            item.key = index + 1
            if (item.start_time) {
              item.validity = item.start_time + ' - ' + item.end_time
            } else {
              item.validity = 'One Time'
            }
          })
        }
        
      }else{
        this.apiStatus = { error: 'some error occured, please try again' }
      }

    } catch (e) {
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
    let url = `${this.apiUrl}notifications/cms/delete/v2`

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
    if (tempData) {
      if (tempData.audienceType) {
        delete tempData.audienceType
      }
    }
    if (audienceData && audienceData[0] === 'filters') {
      fd.append('hashtags', audienceData[1])
      this.formData.hashtags = audienceData[1]
      if (audienceData[1]) {
        fd.append('campaign_start_time', audienceData[2][0])
        fd.append('campaign_end_time', audienceData[2][1])
        this.formData.campaign_start_time = audienceData[2][0]
        this.formData.campaign_end_time = audienceData[2][1]
      }
    } else if (audienceData && audienceData[0] === 'guid') {
      fd.append('csv', audienceData[1])
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
    let url = `${this.apiUrl}notifications/cms/send/v2`// 'http://cloud.bluestacks.com/notifications/cms/send'

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
        this.currentView = 'view'
        this.onViewAllData(true)
        this.apiStatus = { success: "Campaign created successfully" };
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

}


export default FluxApp.instance.createStore(RotationStore, "RotationStore");
