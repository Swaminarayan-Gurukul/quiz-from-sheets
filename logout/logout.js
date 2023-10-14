
localStorage.clear();
sessionStorage.clear()
var sessionTimeout = 1; //hours
var loginDuration = new Date();
loginDuration.setTime(loginDuration.getTime() - 9999999);
document.cookie = "CrewCentreSession=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

window.location.href = "../"