
// 函数库
var Utils = require("../../utils/util.js");

var datalist = {
        doJson: {},            // 获取本地存储的login数据
        openid: "",             // 页面的oppenid
        arr: [8, 18, 38, 58, 68, 88],
        citysData: "", // 请求的数据
        province: "",  // 数组省
        city: "", // 数组市
        area: "", // 数组区
        valueArr: [0, 0, 0],  // 默认值
        name: " ", // 赋值
        maskDis: 0,   // 控制遮罩层的显示隐藏 => 省市区
        latitude: "",        // 维度
        longitude: "",       // 经度
        pos: 0,      // 判断是否在加载中 =>省市区
        Dtype: [],  // 大类
        Xtype: [],   // 小类
        typeArr: [0, 0],    // 默认值
        record: "",   // 存放数据
        typeName: "",   // 显示
        typeID: "",   // 显示ID,
        maskDis1: 0,     // 控制遮罩层的显示隐藏 => 业务类型
        disabled: false,  // 点击发布之后禁用
};

Page({
        data: datalist,
        onLoad: function (options) {        // 页面加载
                this.DefaultMoney();    // 默认加载的金额
                this.getStorage();  // 获取login数据
                this.loadData();  // 加载本地的数据 区域、类型
                this.posFn();       // 获取本地存储位置
        },
        loadData() {             // 加载本地的数据 区域、类型
                // 判断本地存储没有 【所在区域】【业务类型】
                const region = wx.getStorageSync("region");
                const Business = wx.getStorageSync("Business");
                if (!region) {
                        this.request();
                } else {
                        this.setData({ citysData: region })
                }
                if (!Business) {
                        this.typeRequest();
                } else {
                        this.setData({ record: Business })
                        this.loadTypeFn();
                }
        },
        posFn: function () {
                var pos = wx.getStorageSync("position-type");
                const nams = `${pos.split("-")[1]}-${pos.split("-")[2]}`;

                if (pos) {
                        this.setData({ name: nams, pos: 1 })
                } else {
                        this.setData({ name: "定位失败", pos: 0 })
                }
        },
        getStorage: function () {// 取得存储的login数据
                var _this = this;
                var getSto = wx.getStorageSync("login");
                _this.setData({   // 存储返回的login的本地数据
                        doJson: getSto
                })
                _this.loginFn(_this.data.doJson);  // 调取login的状态
        },
        request: function () { // 请求省市区的接口
                var _this = this;
                Utils.requestFn({
                        url: '/index.php/getAreas?server=1',
                        success: function (res) {
                                console.log("question request res:",res);
                                if (!res.data.status) return false;
                                var dataJson = res.data.data;
                                Utils.setStorage("region", dataJson);
                                _this.setData({ citysData: dataJson })
                        }
                })
        },
        loginFn: function (obj) {    // 页面加载 请求login状态 获取openid
                const region = wx.getStorageSync("login");
                this.setData({ openid: region.openid });
        },
        initFn: function () {  // 初始化
                var nPos = this.data.pos;
                if (nPos != 1) return false;    // 如果pos = 0 的话 那么就是还在加载中、不能点击
                this.onloadFn();
        },
        onloadFn: function () {        // 加载省市区
                var aProvince = [];     // 存储省
                var citys = [];              //存储 市
                var areas = [];          //存储 区

                var citysData = this.data.citysData;
                console.log('questions.onloadFn citysData:',citysData);
                var oProvince = citysData[this.data.valueArr[0]];
                console.log('questions.onloadFn this.data.valueArr:',this.data.valueArr);
                console.log('questions.onloadFn oProvince:',oProvince);

                citysData.forEach(function (province, i) {
                        aProvince.push(province.name);
                })
                oProvince.citys.forEach(function (res) {
                        citys.push(res.name)
                })
                areas = oProvince.citys[this.data.valueArr[1]].areas;
                console.log('questions.onloadFn areas:',areas);
                var pos = this.data.valueArr;
                this.setData({
                        maskDis: 1,
                        province: aProvince,
                        city: citys,
                        area: areas
                })
        },
        bindChange: function (e) {          // 滑动省市区
                var citysData = this.data.citysData;        // 获取到总数据
                var posValue = this.data.valueArr;          // 获取到默认值的array
                var curentValue = e.detail.value;            // 获取到滚动的array
                var oProvince = {};     // 省份的数据
                var aCitys = [];         // 城市的数组list
                var oCitys = {};        // 城市的数据
                oProvince = citysData[curentValue[0]];          // 获取到省份

                if (posValue[0] != curentValue[0]) {    // 如果省份默认值与省份滚动值不相等，那么就是滚动的省份
                        oProvince.citys.forEach(function (data) { // 利用省份获取对应子集的市区数组
                                aCitys.push(data.name);
                        })
                        oCitys = oProvince.citys[0];    // 显示市区数组第一个
                        console.log(oCitys)
                        this.setData({
                                city: aCitys,   // 赋值对应市区数组
                                area: oCitys.areas,             // 区域数组
                                valueArr: [curentValue[0], 0, 0]  // 赋值第一个省份
                        })
                } else if (this.data.valueArr[1] != curentValue[1]) {      // 以此判断市
                        if (curentValue[1] >= oProvince.citys.length) return;  // 数据不存在
                        oCitys = oProvince.citys[curentValue[1]];
                        this.setData({
                                area: oCitys.areas,
                                valueArr: [curentValue[0], curentValue[1], 0]
                        })
                }
                this.setData({
                        name: `${oProvince.name}-${oCitys.name}`
                })
        },
        CloseFn: function () { // 关闭遮罩层 
                this.setData({
                        maskDis: 0,
                        maskDis1: 0
                })
        },
        typeRequest: function () { // 加载业务类型的数据请求
                var _this = this;
                Utils.requestFn({
                        url: '/index.php/getCategorys?server=1',
                        success: function (res) {
                                console.log('questions typeRequest res:',res);
                                if (!res.data.status) return false;
                                var res = res.data.data.categorys;
                                // console.log('questions typeRequest res2:',res);
                                // 优化接口 存储到本地 加载一次接口就行
                                Utils.setStorage("Business", res)
                                _this.setData({ record: res })
                                _this.loadTypeFn();
                        }
                })
        },
        typeFn: function () {  // 点击业务类型获取数据
                this.loadTypeFn();
                this.setData({
                        maskDis1: 1
                })
        },
        loadTypeFn: function () {  // 默认 点击加载业务类型数据
                var _this = this;

                var record = _this.data.record;
                console.log('questions loadTypeFn record:',record);
                var center = record[this.data.typeArr[0]];
                console.log('questions loadTypeFn this.data.typeArr[0]:'+this.data.typeArr[0]+" typeArr:",this.data.typeArr);
                console.log('questions loadTypeFn center:',center);
                var valArr = _this.data.typeArr;
                console.log('questions loadTypeFn valArr:',valArr);

                var Dtype = [];     // 存储的大类
                var Xtype = [];     // 存储的小类

                record.forEach(function (obj) {
                        // console.log('questions loadTypeFn forEach obj:',obj);
                        Dtype.push(obj)
                })
                center.child.forEach(function (obj) {
                        Xtype.push(obj)
                })
                _this.setData({
                        Dtype: Dtype,
                        Xtype: Xtype,
                        typeName: `${Dtype[valArr[0]].name}-${Xtype[valArr[1]].name}`,
                        typeID: `${Dtype[valArr[0]].id}-${Xtype[valArr[1]].id}`
                })
        },
        change: function (e) { // 滚动获取值 ==> 业务类型
                var _this = this;

                var record = _this.data.record;
                var valArr = _this.data.typeArr;
                var curentValue = e.detail.value;

                var Xtype = [];

                var prem = record[curentValue[0]];

                if (valArr[0] != curentValue[0]) {

                        prem.child.forEach(function (obj) {
                                Xtype.push(obj);
                        })
                        _this.setData({
                                Xtype: Xtype,
                                typeArr: [curentValue[0], 0]
                        })
                } else {
                        var datas = this.data.Xtype;
                        this.setData({
                                typeArr: curentValue
                        })
                }
                this.setData({
                        typeName: `${prem.name}--${prem.child[curentValue[1]].name}`,
                        typeID: `${prem.id}-${prem.child[curentValue[1]].id}`
                })
        },
        thisVal: function (ev) {  // 点击价格获取当前的价格
                this.setData({
                        value: ev.target.id
                });
        },
        DefaultMoney: function () {    // 默认的金额
                this.setData({ value: 1 });
        },
        releaseFn: function () {  // 提交数据

                let money = this.data.arr[this.data.value];  // 点击的时候能获取到打赏金额
                this.commonPayment(money, function (res) {
                        console.log("questions releaseFn res:",res)
                        if (res.data.status) {
                                let payModel = res.data.data
                                //  获取微信支付的数据
                                
                                wx.requestPayment({
                                        'timeStamp': payModel.timeStamp,
                                        'nonceStr': payModel.nonceStr,
                                        'package': payModel.package,
                                        'signType': 'MD5',
                                        'paySign': payModel.paySign,
                                        "total_fee": "8",
                                        'success': function (res) {   // 成功的状态
                                                Utils.reLaunch("支付成功", "/pages/Consultation/Consultation")
                                                return false;
                                        },
                                        'fail': function (res) {      // 失败的状态
                                                Utils.reLaunch("支付失败", "/pages/Consultation/Consultation")
                                                return false;
                                        }
                                })
                                
                                //测试用支付成功
                                // Utils.reLaunch("支付成功", "/pages/Consultation/Consultation")
                        }
                })

        },
        detailed: function () { // 点击打赏金额的详情
                wx.navigateTo({
                        url: '/pages/static/moneyDetailed/moneyDetailed'
                })
        },
        gratis() {   // 免费发布的时候请求的接口
                let _this = this;
                wx.showModal({
                        title: '提示',
                        content: '设置打赏金额咨询的话，律师优先回复...',
                        success: function (res) {
                                if (res.confirm) {
                                        _this.commonPayment("0", function (res) {
                                                console.log('questions gratis res:',res);
                                                let resData = res.data;
                                                if (resData.status) {
                                                        Utils.reLaunch("发布成功", "/pages/Consultation/Consultation")
                                                } else {
                                                        Utils.reLaunch("发布失败", "/pages/Consultation/Consultation")
                                                }
                                        })
                                } else if (res.cancel) {
                                        console.log('用户点击取消')
                                }
                        }
                })
        },
        commonPayment(money, success) {    // 发布的时候方法的重用

                var _this = this;
                var resData = wx.getStorageSync('login');   // 获取登陆的信息
                var twData = wx.getStorageSync('tw');   // 获取登陆的信息
                var City = _this.data.name.split("-")[1];               // 城市
                var typeID = {
                        catalog_big: _this.data.typeID.split("-")[0],
                        catalog_small: _this.data.typeID.split("-")[1]
                };

                this.setData({ disabled: true })// 点击发布之后禁用按钮 防止重复点击

                Utils.requestFn({
                        url: '/index.php/faqprepay?server=1',
                        method: "POST",
                        data: {
                                sdk: resData.sdk,    // 登陆的sdk
                                uid: resData.uid,    // 登陆的uid
                                title: twData.textareaVal, // 快速咨询的val
                                content: twData.textareaVal,// 快速咨询的val
                                catalog_big: typeID.catalog_big, // 大类
                                catalog_small: typeID.catalog_small, // 小类
                                city: City,       // 城市
                                pay_type: "1", // 支付方式
                                money: money,      // 价格
                                img1: twData.url[0] || "",         // 上传的img1
                                img2: twData.url[1] || "",        // 上传的img2
                                img3: twData.url[2] || "",        // 上传的img3
                                img4: twData.url[3] || "",         // 上传的img4
                                openid: resData.openid  // openid
                        },
                        success: success
                })
                this.setData({ disabled: false })// 点击发布之后禁用按钮 防止重复点击
        }
})