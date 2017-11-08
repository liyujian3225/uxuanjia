// cookies

// const encodeCookiesName = ['nickname']; 
export default{
      getCookie(name){
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        let value = arr[2];
        // if (encodeCookiesName.indexOf(name) >= 0) {
        //     value = unescape(value);
        // }
        return value;
    }
    return null;
},

setCookie(name, value, expireDays){
    let postfix = ';';
    if (expireDays !== undefined) {
        var exp = new Date();
        exp.setTime(exp.getTime() + expireDays * 24 * 60 * 60 * 1000);
        postfix += 'expires=' + exp.toGMTString();
    }
    let finalValue = value;
    // if (encodeCookiesName.indexOf(name) >= 0) {
    //     finalValue = escape(value);
    // }
    document.cookie = name + "=" + finalValue + postfix;
},

clearCookie (name){
    if (name === undefined) {
        return;
    }
    setCookie(name, '', -1);
},

clearCookies(){
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
    }
}
}
