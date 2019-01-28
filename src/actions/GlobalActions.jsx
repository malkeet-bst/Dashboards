import FluxApp from '../utils/FluxApp'

class GlobalActions {
  constructor() {
    this.generateActions(
      'saveDraft',
      'setChannel',
      'setCurrentView',
      'saveAudienceDraft',
      'publishCampaign',
      'copyTemplate',
      'viewAllData',
      'saveFormData',
      'cloneNotificationData',
      'showCampaignDetails',
      'viewStats',
      'deleteCampaign',
      'clearData'
    )
  }
}
new FluxApp()
export default FluxApp.instance.createActions(GlobalActions)
