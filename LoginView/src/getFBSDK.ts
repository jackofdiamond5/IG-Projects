(<any>window).fbAsyncInit = () => {
    FB.init({
        appId: '329678091107847',
        // autoLogAppEvents : true,
        cookie: true,
        xfbml: true,
        version: 'v3.1'
    });
};

(function (d, s, id) {
    let js;
    const fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
