// Put this at the top of index page
if ( ! localStorage.getItem('loggedin001')  != 1 ) {
    location.href = "../index.html";
}

var quizeStore = localStorage;

var handleRequest = function(user, type){
    var ajaxRequest = function(user){
        var scriptURL = "https://script.google.com/macros/s/AKfycbznmIT9u4xUDLTe08GXBoHtlEgDQ9-dvfU-GzILrQbgA4QCZTlmk_PemCughi_5ZLbi/exec";        // user = { data : user };
        $.ajax({
            type: "POST",
            url: scriptURL,
            async: true,
            data: user,
            headers: {
                // 'Content-Type': 'text/plain;charset=utf-8',
                'Content-type': 'application/x-www-form-urlencoded',
                // 'Content-type': 'application/json',
            },
            beforeSuccess: function(){
                setTimeout(function(){ alert("Hello"); }, 5000);
            },
            success: function (data)
            {
                switch(type){
                    case 'login':
                        (quizeStore.getItem('loggedin001') == 'undefined') ? quizeStore.setItem('loggedin001', '0') : '';
                        (quizeStore.getItem('token') == 'undefined') ? quizeStore.setItem('token', '') : '';
                        if(data[type]){
                            quizeStore.setItem('loggedin001', '1');
                            data.token.length && quizeStore.setItem('token', data.token);
                        }
                        return data;

                        break;
                    case 'signup':  
                        (quizeStore.getItem('loggedin001') == 'undefined') ? quizeStore.setItem('loggedin001', '0') : '';
                        (quizeStore.getItem('token') == 'undefined') ? quizeStore.setItem('token', '') : '';
                        console.log(data[type]);
                        if(data.signup){
                            quizeStore.setItem('loggedin001', '1');
                            data.token.length && quizeStore.setItem('token', data.token);
                            window.location.href = "../";
                        }
                        return data;
        
                        break;
                    default:
                        alert("default");
                        console.log('Case default');    
                }
                console.log(data);
            }
        });
    } 
    ajaxRequest(user);
    
    
}
$(document).ready(function(){
    
    /**
     * @param {send request URL} url reqired
     * @param {Type for the request} type reqired
     */
    
    $('.loggedin001-form').submit(function(e){
        e.preventDefault();
        let user = {
            name: 'loggedin001',
            name: $('.loggedin001-form #email').val(),
            phone: $('.loggedin001-form #password').val(),
            action: 'loggedin001',
        } 
        handleRequest(user, 'loggedin001');
    });

    $('.signup-form').submit(function(e){
        e.preventDefault();
        let user = {
            name: $('.signup-form #name').val(),
            phone: $('.signup-form #phone').val(),
            action: "signup",
        } 
        console.log(user);
        let formSubmit = this.querySelector('.form-submit');
        formSubmit.innerText = "Working...";
        formSubmit.setAttribute("disabled", "true")

        handleRequest(user, 'signup');
    });

    
    
});

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token;
    // console.log("ID Token: " + id_token);
    let user = {
        name: "Name not display For security reson"/*profile.getName()*/,
        email: 'GoogleSignin@googleUser.com'/*profile.getEmail()*/,
        id: 'demo44235234543ID'/*profile.getId()*/,
        action: 'googleSignin',
    } 
    console.log(user);

    handleRequest(user, 'loggedin001');

}