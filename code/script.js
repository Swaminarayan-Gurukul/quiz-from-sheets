var date = new Date();
date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
document.querySelector('#code').innerHTML= date.getFullYear() + (date.getMonth() + 1) + date.getDate();

