export default class Utils {
  static GmApiAvailable = window.GmApi != null && window.GmApi.isAvailable
  static clientVersion
  static engineVersion
  static oem
  static guid
  static locale
  static app_pkg
  static urlParams = new URLSearchParams(window.location.search)

  static getCloudInstance() {
    let instance = this.urlParams.get('instance')
    console.log(instance)
    return instance
  }
  static getUrlFromInstance(instance) {
    let url
    if (instance === "prod") {
      url = "https://notif-v2-dot-bluestacks-cloud.appspot.com/"
    } else {
      //engg
      url = "https://notif-v2-dot-bs3-appcenter-engg.appspot.com/"
    }
    return url
  }
}