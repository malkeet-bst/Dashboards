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
    this.templateData=''
    this.activeTab='new'
    this.allData = [];
    this.apiUrl = Utils.getUrlFromInstance(Utils.getCloudInstance());
    this.bindActions(GlobalActions);
    window.RotationStore = this;
  }

  onSetChannel(type) {
    this.channelType = type;
  }
  onSetCurrentView(attr) {
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
    console.log({formData})
    let url = `${this.apiUrl}rotation_cms`;
    try {
      const data = await this.fetchData(url)
      const json = await data.json()
      console.log(json)
    } catch(e) {
      console.error("Problem", e)
    }
  }
  onSaveAudienceDraft = async (formData) => {
    console.log({formData})
    let url = `${this.apiUrl}rotation_cms`;
    try {
      const data = await this.fetchData(url)
      const json = await data.json()
      console.log(json)
    } catch(e) {
      console.error("Problem", e)
    }
  }
  onPublishCampaign=async () => {
    console.log('published')
  }
  onCopyTemplate=(data)=>{
    this.templateData=data
    console.log(this.templateData)
  }
}


export default FluxApp.instance.createStore(RotationStore, "RotationStore");
