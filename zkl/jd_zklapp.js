/*
入口 真快乐APP -> 我 -> 0元领鸡蛋

 [task_local]
#养鸡真快乐
0 0 0,10,17 * * ? https://github.com/JDWXX/jd_job/blob/master/qt/jd_zklapp.js, tag=养鸡真快乐, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
*/

const $ = new Env('真快乐APP养鸡');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookieZkl.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let shareUserId = []
//服务端下载校验参数
let jycs = []
//本地填写的校验参数
let ZKLAPP_JY = ''
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
// if (process.env.ZKLAPP_WJ) {
//     if (process.env.ZKLAPP_WJ.indexOf('&') > -1) {
//         shareUserId = process.env.ZKLAPP_WJ.split('&');
//     } else if (process.env.ZKLAPP_WJ.indexOf('\n') > -1) {
//         shareUserId = process.env.ZKLAPP_WJ.split('\n');
//     } else {
//         shareUserId = [process.env.ZKLAPP_WJ];
//     }
// }
if (process.env.ZKLAPP_JY) {
    ZKLAPP_JY = process.env.ZKLAPP_JY
}
!(async () => {
    if (!cookiesArr[0]) {
        console.log('请先通过网页登陆 真快乐APP获取 请求参数中的 【cookie】 整串复制出来，在青龙面板中添加 ZKLAPP ');
        console.log('获取地址 https://login.m.gome.com.cn/login.html?return_url=aHR0cHM6Ly9nYW1lLm0uZ29tZS5jb20uY24vaGFwcHlDaGljay5odG1sP2dhbWVDb2xsZWN0SWQ9MTQ1MDAxJmdhbWVJdGVtPWhhcHB5Q2hpY2smc2hhcmVVc2VySWQ9NzI5MDAwMDAwMDEmZ2FtZUlkPTE0NTAwNyZjbXBpZD1zX2FwcDAxX2NvcHkmdWlkPTcyOTAwMDAwMDAx');
        return;
    }
    console.log('入口 真快乐APP -> 我 -> 0元领鸡蛋 ');
    if(ZKLAPP_JY ==  '' ){
        // console.log('\n请先在环境变量里添加 ZKLAPP_WJ 多个助力号用 & 拼接 \n');
        console.log('为了防止脚本泛滥，请先在环境变量里添加校验参数 ZKLAPP_JY')
        return;
    }else{
        console.log('获取到 校验参数')
        console.log(ZKLAPP_JY)
    }
    //下载校验参数
    await csjy()
    if(jycs.indexOf(ZKLAPP_JY) == 0){
        console.log('校验通过')
    }else{
        console.log('校验失败')
        return;
    }
    // if(shareUserId.length < 1 ){
    //     // console.log('\n请先在环境变量里添加 ZKLAPP_WJ 多个助力号用 & 拼接 \n');
    //     console.log('\n请先在环境变量里添加助力码 ZKLAPP_WJ \n');
    //     return;
    // }else{
    //     console.log('\n获取到 ZKLAPP_WJ \n');
    //     console.log(shareUserId);
    // }
    share_userId=cookiesArr[0].match(/share_userId=([^; ]+)(?=;?)/) && cookiesArr[0].match(/share_userId=([^; ]+)(?=;?)/)[1]
    console.log("账号【1】的助力码 " + share_userId + "，以后账号都会助力此账号");
    shareUserId = [share_userId]
    //下载助力码
    await getAuthorShareCode()
    if(shareUserId.length < 2){
        console.log('服务拥堵，请稍后重试')
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i]
        userId=cookie.match(/share_userId=([^; ]+)(?=;?)/) && cookie.match(/share_userId=([^; ]+)(?=;?)/)[1]
        console.log('账号【' + (i+1) + "】 ")
        console.log(" 喂鸡 ")
        wy(userId)
        console.log(" 助力喂鸡 ")
        if(shareUserId.length > 1){
            helpCoinDozers(shareUserId[1])
            helpCoinDozer(shareUserId[0])
            helpCoinDozers(shareUserId[random(0, shareUserId.length)])
        }else{
            helpCoinDozers(shareUserId[1])
            helpCoinDozer(shareUserId[0])
            helpCoinDozers(shareUserId[random(0, shareUserId.length)])
        }
    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })
function wait(t){return new Promise(e=>setTimeout(e,t))}
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function wy(shareUserId) {
    return new Promise((resolve) => {
        const nm= {
            url: `https://game.mobile.gome.com.cn/wap/game/happyplanet/work`,
            body:'body={"gameCollectId":"145001","operateType":1,"userId":"' + shareUserId + '","gameItem":"happyChick","gameId":"145007"}',
        headers: {
            "cookie": cookie,
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-length": "112",
            "content-type": "application/x-www-form-urlencoded",
            "origin": "https://game.m.gome.com.cn",
            "referer": "https://game.m.gome.com.cn/",
            "sec-ch-ua": '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "Windows",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
        }
    }
        $.post(nm, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        // console.log(data)
                        data = JSON.parse(data);
                        console.log(data.msg)
                    }else if(data.success==false){
                        console.log(data.msg)}
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
function helpCoinDozer(shareUserId) {
    return new Promise((resolve) => {
        const nm= {
            url: `https://game.mobile.gome.com.cn/wap/game/happyplanet/work`,
            body:'body={"gameCollectId":"145001","operateType":2,"userId":"' + shareUserId + '","gameItem":"happyChick","gameId":"145007"}',
            headers: {
                "cookie": cookie,
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-length": "112",
                "content-type": "application/x-www-form-urlencoded",
                "origin": "https://game.m.gome.com.cn",
                "referer": "https://game.m.gome.com.cn/",
                "sec-ch-ua": '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "Windows",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 Edg/96.0.1054.29"
            }
        }
        $.post(nm, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        // console.log(data)
                        data = JSON.parse(data);
                        console.log(data.msg)
                    }else if(data.success==false){
                        console.log(data.msg)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
function helpCoinDozers(shareUserId) {
    return new Promise((resolve) => {
        const nm= {
            url: `https://game.mobile.gome.com.cn/wap/game/happyplanet/work`,
            body:'body={"gameCollectId":"145001","operateType":2,"userId":"' + shareUserId + '","gameItem":"happyChick","gameId":"145007"}',
            headers: {
                "cookie": cookie,
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-length": "112",
                "content-type": "application/x-www-form-urlencoded",
                "origin": "https://game.m.gome.com.cn",
                "referer": "https://game.m.gome.com.cn/",
                "sec-ch-ua": '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "Windows",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 Edg/96.0.1054.29"
            }
        }
        $.post(nm, (err, resp, data) => {
            try {
                if (err) {
                } else {
                    if (safeGet(data)) {
                        // console.log(data)
                        data = JSON.parse(data);
                    }else if(data.success==false){
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function csjy() {
    return new Promise(resolve => {
        $.get({
            url: "http://101.35.80.156:8081/erp/getk/getCodesList?type=109&sx=false",
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
            }
        }, async(err, resp, data) => {
            try {
                if (err) {
                } else {
                    jycs = data.split("@")
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function getAuthorShareCode() {
    return new Promise(resolve => {
        $.get({
            url: "http://101.35.80.156:8081/erp/getk/getCodesList?type=9&sx=false",
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
            }
        }, async(err, resp, data) => {
            try {
                if (err) {
                } else {
                    let zlm = data.split("@")
                    for (let i = 0; i < zlm.length; i++) {
                        shareUserId.push(zlm[i].split("@"))
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function safeGet(data) {
    try {
        if (typeof JSON.parse(data) == "object") {
            return true;
        }
    } catch (e) {
        console.log(e);
        console.log(`访问数据为空，请检查自身设备网络情况`);
        return false;
    }
}
function jsonParse(str) {
    if (typeof str == "string") {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
            return [];
        }
    }
}



function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
