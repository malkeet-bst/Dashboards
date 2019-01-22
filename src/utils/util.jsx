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
    let instance = window.instance
    console.log({instance})
    return instance
  }
  static getUrlFromInstance(instance) {
    let url
    if (instance === "prod") {
      url = "https://appcenter-console.bluestacks.com/manage/"
      //url="http://10.1.174.197:8000/manage/"
    } else {
      //engg
      url = "https://appcenter-console-engg.bluestacks.com/manage/"
      //url="http://10.1.174.197:8000/manage/"
    }
    return url
  }
}