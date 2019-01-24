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

  fetchData = async (url) => {
    return fetch(url)
  }
  onViewAllData = () => {
    setTimeout(() => {
      for (let i = 0; i < 100; i++) {
        this.allData.push({
          key: i,
          name: `Pubg ${i}`,
          details: 'View Details',
          action: `London, Park Lane no. ${i}`,
          validity: 'one time',
          audience: '#Geos_US_JP',
          status: 'Live',
          reports: 'Download'
        });
      }
      this.emitChange();
    }, 3000)
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
    if (audienceData && audienceData[0]) {
      if (audienceData[0]) {
        fd.append('filters', audienceData[0])
        if (audienceData[1]) {
          fd.append('campaign_start_time', audienceData[1][0])
          fd.append('campaign_end_time', audienceData[1][1])
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
    let url = 'https://notif-v2-dot-bs3-appcenter-engg.appspot.com/notifications/cms/send'// 'http://cloud.bluestacks.com/notifications/cms/send'

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
        this.apiStatus = { success: "Campaign created successfully" };
        this.currentView = ''
        this.channelType = ''
        this.activeTab = 'new'
      } else {
        this.apiStatus = { error: user.message };
      }
    } else {
      this.apiStatus = { error: "some error occured" };
    }
    // setTimeout(() => {
    //   this.apiStatus = ''
    //   this.emitChange();
    // }, 4000)
    this.emitChange();

  }
  onCopyTemplate = (data) => {
    this.templateData = data
    console.log(this.templateData)
  }
}


export default FluxApp.instance.createStore(RotationStore, "RotationStore");
