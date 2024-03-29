var Utils = require("../../utils/util.js");
var datas = {
    logo: "/images/user.png",       // 头像
    Mobile: "13032014099",        // 手机
    category1: "民事类",            // 类别1
    category2: "综合",                // 类别2 
    content: "测试的content",        // 内容
    money: "",                      // 金额
    place: "北京",             // 地点
    time: "1分钟前",            // 时间
    detailsContent: "",         // 回复数据的内容            
    detailsTime: "",              // 回复数据的时间 
    faqid: "",        // 本页面的ID
    nReply: 0,        // 回复的弹出层
    len: "",     // 回复的数量
    Dmoney: "",   // 打赏的钱
    images: [],   // 详情图片的list
    success: "0", // 回复的状态
    answerAuth: false, // 回复两个字的显示状态
    datacn: "0",
    openid: "",    // 获取登陆的openid
    contents: [],    // 获取contents的数据id
    isEdit: false,   // 是否显示 编辑咨询
    is_adopt: "",
    loading: false,
    lvsid: "",   // faq的id
    faqexts: []  // 编辑咨询的内容
};
Page({
    data: datas,
    onLoad(options) {

        this.setData({ loading: true })
        let dataJson = "";  // 接受数据
        dataJson = wx.getStorageSync("LawyerParticulars");   // 获取本地的数据
        // console.log("Consultation_details onLoad dataJson:",dataJson);
        this.assignment(dataJson);  // 加载数据
        this.onEdit(dataJson);  // 判断是否是本人还是游客
        this.loginFn();
        this.setData({ loading: false })
    },
    onEdit(data) {   // 判断是够本人的咨询详情
        var loginDtat = wx.getStorageSync("login");
        // 判断是不是显示 编辑咨询
        if (loginDtat.uid != data.faq.uid) {
            this.setData({
                isEdit: false
            })
        } else {
            this.setData({
                isEdit: true
            })
        }
    },
    onUnload: function () { // 离开页面的时候清空本地的数据
        // Utils.setStorage("LawyerParticulars", "");
        Utils.setStorage("screen", "");
    },
    replyFn(e) { // 回复
        var _this = this;
        var loginDatas = wx.getStorageSync("login");
        var answerAuth = this.data.answerAuth;

        if (!loginDatas) {   // 么有登陆信息的

            Utils.showModal("游客不能回复，请先登陆");
            return false
        }
        if (answerAuth != 1) {  // 登陆了 但是不是自己问题的
            Utils.showModal("只有律师跟本人可以回复");
            return false
        }
        this.setData({
            nReply: 1,
            parent_id: e.currentTarget.dataset.parent_id,
            master_id: e.currentTarget.dataset.master_id
        })
    },
    ondataFn() {  // 点击回复弹层调转穿参
        var loginData = wx.getStorageSync("login");
        if (!loginData) return false;
        var faqid = this.data.faqid;
        var _this = this;
        var resDatas = {
            parent_id: _this.data.parent_id,
            master_id: _this.data.master_id,
            sdk: loginData.sdk,
            uid: loginData.uid,
            faqid: faqid,
        }
        resDatas = JSON.stringify(resDatas);
        wx.navigateTo({
            url: `/pages/Reply/Reply?data=${resDatas}`
        })
    },
    assignment(dataJson) {    // 每次加载数据的赋值操作
        var _this = this;
        var loginDtat = wx.getStorageSync("login");
        var uid = loginDtat.uid;    // 获取登陆对应的uid
        var detailsData = [];   // 每次加载的时候清空一次
        let Dmoney = "", reply = false;
        
        // console.log('Consultation_details assignment loginDtat.uid:',loginDtat);
        // console.log('Consultation_details assignment dataJson:',dataJson);

        //登录用户，显示打赏金额
        if (loginDtat.uid == dataJson.faq.uid) 
        {
            // 显示的金额 
            Dmoney = dataJson.faq.money == "0" ? '免费' : `￥${dataJson.faq.money}`;
            reply = true; // 回复显示的状态还有温馨提示的显示
        }

        // console.log('Consultation_details assignment Dmoney:',Dmoney);

        for (var key in dataJson.answer) {
            detailsData.push(dataJson.answer[key]);
        };

        this.setData({
            len: dataJson.faq.answer_count,        // 回复的len
            logo: dataJson.faq.image,         // 头像
            Mobile: dataJson.faq.nickname,// 手机号码
            category1: dataJson.faq.cat_big,// 类别1
            category2: dataJson.faq.cat_small,// 类别2
            content: dataJson.faq.content,    // 内容
            money: dataJson.faq.money,    // 金额
            place: dataJson.faq.city_name,    // 地点
            time: dataJson.faq.date,    // 几分钟前
            detailsArr: detailsData,      // 回复数据的list
            faqid: dataJson.faq.id,     // 本页面的iD
            Dmoney: Dmoney,  // 打赏的金额
            images: dataJson.faq.images,     // 获取详情的images的list
            answerAuth: dataJson.faq.answerAuth, // 判断是不是能回复
            isShow: reply,   // 回复显示的状态 还有温馨提示的显示
            is_adopt: dataJson.faq.is_adopt, // 是够采纳
            lvsid: dataJson.faq.id,   // faq的id
            faqexts: dataJson.faqexts
        });
    },
    onShow() {
        var _this = this;
        var loginDatas = wx.getStorageSync("login"); // 获取到本地的请求的参数
        var details = wx.getStorageSync("details"); // 获取到本地的请求的参数
        var datares = {};
        Utils.requestFn({ // 重新获取数据
            url: '/index.php/consultdetail?server=1',
            data: {
                sdk: loginDatas.sdk || "",
                uid: loginDatas.uid || '',
                id: details.id
            },
            success: function (res) {
                // console.log("consultation_detail.onShow res:",res);
                datares = res.data.data;
                _this.assignment(datares);
                _this.onEdit(datares);
            }
        })
    },
    adopt(e) {     // 采纳功能
        var _this = this;
        var index = e.currentTarget.dataset.index;  // 获取点击当前的索引
        var ansid = this.CyclicData(index);
        var loginDatas = wx.getStorageSync("login");
        Utils.requestFn({ // 重新获取数据
            url: '/index.php/adoptfaq?server=1',
            method: "POST",
            data: {
                sdk: loginDatas.sdk,
                uid: loginDatas.uid,
                faqid: _this.data.faqid,
                ansid: ansid
            },
            success: function (res) {
                console.log("consultation_details.adopt res:",res);
                if (!res.data.status) {
                    Utils.showModal(res.data.message);
                } else {
                    _this.onShow();
                }
            }
        })
    },
    redFn(event) {    //点击红包打赏
        var index = event.currentTarget.dataset.index;
        var ansid = this.CyclicData(index);
        var loginDtat = wx.getStorageSync("login");
        var josn = {
            img: event.currentTarget.dataset.img,   // 律师头像
            name: event.currentTarget.dataset.name,  // 律师name
            sdk: loginDtat.sdk, // 登陆返回的 sdk
            uid: loginDtat.uid, // 登陆返回的uid
            faqid: this.data.faqid, // 咨询id
            ansid: ansid, // 打赏对应的回复id
            attid: event.currentTarget.dataset.id, // 打赏对应的律师id
            openid: loginDtat.openid,       // 登陆的openid
        }

        Utils.setStorage("redPacketData", josn)
        if (!loginDtat.openid) {
            Utils.setStorage("redPacket", "/pages/RedPacket/RedPacket")
            wx.navigateTo({
                url: "/pages/land/land?id=1"
            })
        } else {
            wx.navigateTo({
                url: "/pages/RedPacket/RedPacket"
            })
        }

    },
    CyclicData(index) {      // 循环获得列表数据的id
        var detailsArr = this.data.detailsArr;
        var newArr = detailsArr[index].contents;
        var data = newArr.map(function (obj) {
            return obj.id;
        })
        return data[0];
    },
    loginFn() {    // 页面加载 请求login状态
        var loginDtat = wx.getStorageSync("login");
        if (!loginDtat) return false;
        var _this = this;
        var dosdk = loginDtat.sdk;        // sdk
        var douid = loginDtat.uid;    // uid
        wx.login({
            success: function (res) {
                
                if (res.code) { //  第一步： 获取code
                    Utils.requestFn({
                        url: '/index.php/getopenid?server=1',
                        method: "POST",
                        data: {
                            code: res.code,
                            sdk: dosdk,
                            uid: douid
                        },

                        success: function (res) {
                            // console.log('consulation_details.loginFn res:',res);
                            _this.setData({
                                openid: res.data.data.openid
                            })
                        }
                    })
                } else {
                    Utils.showModal('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    },
    editFn(event) { // 编辑
        let json = {};
        let value = wx.getStorageSync("login");
        let ID = event.target.id;

        Utils.requestFn({
            url: "/index.php/getfaqinfo?server=1",
            data: {
                sdk: value.sdk,
                uid: value.uid,
                faqid: ID,
            },
            success(res) {
                console.log('consultation_details.editFn res:',res);
                let resData = res.data;
                if (resData.status) {    // 成功传输本地数据
                    json = {
                        faqid: ID,
                        content: resData.data.content
                    }
                    Utils.setStorage("ReplyData", json);
                    wx.navigateTo({
                        url: "/pages/Econsultation/Econsultation"
                    })
                } else {
                    Utils.showModal(resData.message);
                }
            }
        })

    },
    consultFn(event) {    // 点击跳转到律师的详情页面
        let attid = event.currentTarget.dataset.id;
        let login = wx.getStorageSync("login");
        let json = {
            attid: attid,
            uid: login.uid,
            sdk: login.sdk
        }
        Utils.requestFn({
            url: "/index.php/layerdetail?server=1",
            data: json,
            success(res) {
                console.log("consultation_details consultFn res:",res);
                let rData = res.data;
                if (rData.status) {
                    Utils.setStorage("Ldetails", rData.data);
                    wx.navigateTo({
                        url: `/pages/LawyerDetails/LawyerDetails?attid=${json.attid}`
                    })
                } else {
                    Utils.showModal("再刷新一下啦，页面报错啦");
                }
            }
        })
    },
    onShareAppMessage(res) {    // 转发
        return {
            title: '律师帮帮',
            path: '/pages/Consultation_details/Consultation_details'
        }
    },
    imgClick(event) {           // 咨询详情点击图片放大
        let dataUrl = event.currentTarget.dataset.url;
        let dataList = this.data.images;
        let dataArr = [];
        for (let key in dataList) {
            dataArr.push(dataList[key].path)
        }
        // 使用图片预览API
        wx.previewImage({
            current: dataUrl,
            urls: dataArr
        })
    }
})