// Put this at the top of index page
if ( ! localStorage.getItem('loggedin')  != 1 ) {
    location.href = "../index.html";
}

var quizeStore = localStorage;

var handleRequest = function(user, type){
    var ajaxRequest = function(user){
        var scriptURL = "https://script.google.com/macros/s/AKfycbzFXMdEMIwNM0iSUTFH1gicogVPEvTNMiozKzlCV87J0j4FUCi6QiFtY4VDqxr5SXvi/exec";        // user = { data : user };
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
                        (quizeStore.getItem('loggedin') == 'undefined') ? quizeStore.setItem('loggedin', '0') : '';
                        (quizeStore.getItem('token') == 'undefined') ? quizeStore.setItem('token', '') : '';
                        if(data[type]){
                            quizeStore.setItem('loggedin', '1');
                            data.token.length && quizeStore.setItem('token', data.token);
                        }
                        alert(data.result);
                        return data;

                        break;
                    case 'signup':  
                        (quizeStore.getItem('loggedin') == 'undefined') ? quizeStore.setItem('loggedin', '0') : '';
                        (quizeStore.getItem('token') == 'undefined') ? quizeStore.setItem('token', '') : '';
                        console.log(data[type]);
                        if(data.signup){
                            quizeStore.setItem('loggedin', '1');
                            data.token.length && quizeStore.setItem('token', data.token);
                            window.location.href = "../";
                        }
                        return data;
        
                        break;
                    default:
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
    
    $('.loggedin-form').submit(function(e){
        e.preventDefault();
        let user = {
            name: 'loggedin',
            name: $('.loggedin-form #email').val(),
            phone: $('.loggedin-form #password').val(),
            action: 'loggedin',
        } 
        handleRequest(user, 'loggedin');
    });

    $('.signup-form').submit(function(e){
        e.preventDefault();
        let user = {
            name: $('.signup-form #name').val(),
            phone: $('.signup-form #phone').val(),
            birthday: $('.signup-form #birthday').val(),
            anniversary: $('.signup-form #anniversary').val(),
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

    handleRequest(user, 'loggedin');

}