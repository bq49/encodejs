//  引入函数库
let Utils = require("../../utils/util.js");

// 加载地图
var map = require('../../map/mappos.js');

let page = 1;   // 导航下拉滚动的默认值
let downPage = 1; // 整体数据下拉的默认值
let commonArr = []; // 每次加载的数据
let app = getApp();
let mun = app.globalData.loadOne;

// 数据
let data = {
    commons1: [],    // 加载数据存储省市区,
    commons2: [],    // 加载数据存储业务类型,
    CityData: [],   // 城市的数据
    BusinessData: [],   // 城市的二级的数据
    yw_child_data: [],     // 业务类型的二级数据
    sort_id: "0",            // 排序选中的状态
    navname: "",         // 二级切换的text
    TitleData: ['北京市', '业务类型', '排序', '推荐'],   // 导航
    TitleSort: ['综合', '评价', '价格'],  // 排序
    is_ch: false,     // 控制下拉城市的显示隐藏
    is_yw: false,    //  控制业务类型的显示隐藏
    yw_id: "1",          // 业务类型的选中状态
    yw_child: "",         // 业务类型第二级数据选中状态   
    newNav: "3",       // 导航默认的选中状态
    newCity: "2",      // 城市第一级数据
    newArea: "-1",   // 城市第二级数据选中状态   
    mask: false,   // 排序的弹层
    firstLoad: false,       // 初次加载 
    commonList: [],    // 列表的循环的数据
    Stars: [     // 列表的星星
        "",
        "",
        "",
        "",
        ""
    ],
    city: "",   // 选择区的id
    small: "",   // 选择类型的id
    loading: false,    // 加载中.
    order: "0",   // 排序的id
    Ndata: false,    // 没有数据
    indexData: [   // 底部数据
        {
            text: "首页",
            cls: "icon-home",
            ncls: "",
            id: "1",
        },
        {
            text: "咨询",
            cls: "icon-zixunweixuanzhongzhuangtai",
            ncls: "",
            id: "2",
        },
        {
            text: "找律师",
            cls: "icon-sourencai-weixuanzhong",
            ncls: "icon-sourencai-xuanzhong",
            id: "3",
        },
        {
            text: "我的",
            cls: "icon-tag-wode-weixuanzhong",
            ncls: "",
            id: "4",
        }
    ],
    RecommendData: [         // 推荐律师的列表
        {
            text: "婚姻家庭",
            id: "hycc"
        },
        {
            text: "劳动人事",
            id: "ldrs"
        },
        {
            text: "房产土地",
            id: "fctd"
        },
        {
            text: "交通事故",
            id: "jtsg"
        },
        {
            text: "债权债务",
            id: "zqzw"
        },
        {
            text: "合同纠纷",
            id: "htjf"
        },
        {
            text: "损害赔偿",
            id: "shpc"
        },
        {
            text: "公司设立",
            id: "gssl"
        },
        {
            text: "消费维权",
            id: "xfwq"
        },
        {
            text: "商标注册",
            id: "sbzc"
        },
        {
            text: "保险理赔",
            id: "bxlp"
        },
        {
            text: "医疗纠纷",
            id: "yljf"
        }
    ],
    rec: true               // 推荐律师的显示状态
};
Page({
    data: data,
    onLoad(options) {
      
        // 判断是否是底部菜单进入的页面
        if (options.tab){
            this.setData({ rec:false});
        }else{
            console.log(app.globalData.loadOne)
            if (app.globalData.loadOne == 1) {
                this.setData({ rec: true });
                app.globalData.loadOne++;
            } else {
                this.setData({ rec: false })
            }
        }
        // 不管是加载还是显示都要清空购买律师的详细信息
        Utils.removeStorage("Ldetails");
        const _this = this;
        const positions = wx.getStorageSync("position-type");
        if (!positions || positions == null) {
            this.coordinate().then((data) =>{
                if(data) {
                    _this.loadDatas();
                }
            });    
        }else{
            _this.loadDatas();
        }
    },
    onShow(){
        Utils.removeStorage("Ldetails");
        if (app.globalData.loadOne == 2) {
            app.globalData.loadOne++;
        }else{
             this.setData({ rec: false })
        }
    },
    loadDatas() {            // 默认加载本地储存的数据
        this.BusinessType(); 
        this.Provincial().then((data)=>{
            // console.log('LawyersLibrary.loadDatas data:',data);
            // console.log('LawyersLibrary.loadDatas typeof data:'+typeof data);
            this.oneReqLoads(data);   // 默认加载的数据
            this.setData({ cityData: data});    // 异步获取城市的信息列表
            this.screenCity();
        });
       
    },
    onPullDownRefresh() {     // 解决下拉不能缩放的BUG
        wx.stopPullDownRefresh()
    },
    Provincial() {     // 请求省市区接口数据
        let _this = this;
        let p = new Promise((suss) => {
            Utils.requestFn({
                url: "/index.php/catCity?server=1",
                success(res) {
                    // console.log("LawyerLibrary.Provincial res:",res);
                    if (res.data.status) {
                        _this.setData({ commons1: res.data.data })
                        suss(res.data.data);
                    } else {
                        Utils.showModal("请求数据错误");
                    }
                }
            })
        })

        // console.log("LawyerLibrary.Provincial p:",p);
        // console.log("LawyerLibrary.Provincial typeof p:",typeof p);
        return p;
       
    },
    BusinessType() {   // 请求业务类型的数据接口
        let _this = this;
      
        Utils.requestFn({
            url: "/index.php/getCategorys?server=1",
            success(res) {
                // console.log("LawyerLibrary.BusinessType res:",res);
                if (res.data.status) {
                    _this.setData({ commons2: res.data.data.categorys })
                } else {
                    Utils.showModal("请求数据错误");
                }
            }
        })
    },
    conmmonData(data, id) {    // 公共的处理函数
        let is_ch = this.data.is_ch;           // 显示隐藏城市的下拉
        let cityIndex = this.data.newCity;      // 城市列表的选中状态
        console.log('LawyersLibrary.commonData cityIndex:',cityIndex);
        let is_yw = this.data.is_yw;           // 显示隐藏业务类型的下拉
        let yw_id = this.data.yw_id;

        if (id != "1") {
            this.setData({
                is_ch: !is_ch,
                is_yw: false,
                mask: false,
                CityData: data,
                rec: false
            });
            this.defaultFn(cityIndex, id);
        } else {
            this.setData({
                is_yw: !is_yw,
                is_ch: false,
                mask: false,
                yw_Data: data,
                rec: false
            });
            this.defaultFn(yw_id, id);
        }
        page = 1;
    },
    titleFn(event) {    // 切换导航的事件
        let ID = event.currentTarget.id;
        // console.log('LawyersLibrary.titleFn ID:',ID);
        let mask = this.data.mask;
        let rec = this.data.rec;
        this.setData({ newNav: ID });
        downPage = 1;   // 每次切换的时候恢复默认
        if (ID == "") return false;
        switch (ID) {
            case "0":
                this.conmmonData(this.data.commons1, ID);
                break;
            case "1":
                // console.log('LawyersLibrary.titleFn ID 1 this.data.commons2:',this.data.commons2);
                this.conmmonData(this.data.commons2, ID);
                break;
            case "2":
                this.setData({ is_ch: false, is_yw: false, mask: !mask, rec: false });
                break;
            default: {
                this.setData({ rec: !rec, is_ch: false, mask: false });
                break;
            }
        }
    },
    assignment(id, name, cityChild = '') {   // 每次切换的导航赋值操作
        // 获取二级城市的数据
        let BusinessData = this.data.BusinessData;
        let nametext = id == '0' ? screensCity(cityChild) : name;
        let nav_index_data = this.data.TitleData[id] = nametext;

        let nav_data = this.data.TitleData;
        this.setData({ TitleData: nav_data });

        // 通过城市的二级ID 筛选出对应的内容
        function screensCity(id) {
            let nameTxt;
            BusinessData.forEach((item) => {
                if (item.id == id) {
                    nameTxt = item.name;
                }
            })
            return nameTxt;
        }
    },
    CityFn(event) {   // 点击市获取对应的数据
        let _this = this;
        let ID = event.target.id;
        let _index = this.data.newNav;  // 获取当前nav的选中状态
        let CityData = this.data.CityData;
        let yw_Data = this.data.yw_Data;

        if (_index != '1') {
            let data = _this.HandleData(CityData, ID);
            _this.setData({
                BusinessData: data.small,
                navname: data.navname,
                newCity: ID
            })
        } else {
            let data = _this.HandleData(yw_Data, ID);
            _this.setData({
                yw_child_data: data.small,
                navname: data.navname,
                yw_id: ID
            })
        }
    },
    defaultFn(index, id) {     // 获取二级数据的默认显示
        let _this = this;
        let CityData = this.data.CityData;
        let yw_Data = this.data.yw_Data;

        if (id != '1') {
            let data = _this.HandleData(CityData, index);
            _this.setData({
                BusinessData: data.small,
                navname: data.navname
            })
        } else {
            let data = _this.HandleData(yw_Data, index);
            _this.setData({
                yw_child_data: data.small,
                navname: data.navname
            })
        }
    },
    HandleData(data, index) {    // 处理循环二级的数据
        let json = {};
        data.forEach((item) => {
            let newID = item.id;
            if (newID == index) {
                // 获取二级数据 获取到默认选中的大类
                json.small = item.small;
                json.navname = item.name;
            }
        })
        return json;
    },
    areaFn(event) {   // 点击区的事件处理
        let ID = event.target.id;
        let newNav = this.data.newNav;
        this.setData({ newArea: ID, is_ch: false, commonList: [] });
        let assname = this.data.navname;                // 获取到点击大类的name
        this.assignment(newNav, assname, ID);              // 赋值到当前的导航name

        let city_id = this.data.city; // 选择城市的ID
        let small_id = this.data.small; // 选择类型的ID

        if (newNav != "1") {    // 地区
            this.TransferFn({ city: ID, small: small_id });
            this.setData({ city: ID, is_yw: false });
        } else {    // 业务类型
            this.TransferFn({ small: ID, city: city_id });
            this.setData({ is_yw: false, small: ID })
        };
    },
    MaskTestFn(event) {  // 排序弹层的点击

        let ID = event.target.id;
        let newNav = this.data.newNav;
        let city = this.data.city;
        let small = this.data.small;

        let names = this.data.TitleSort[ID];
        this.assignment(newNav, names);
        downPage = 1;

        this.setData({ mask: false, order: ID, commonList: [], sort_id: ID });
        this.TransferFn({ small: small, city: city, page: downPage, order: ID });

    },
    scroll(event) {
        let data = this.data.commons1;
        let newNav = this.data.newNav;
        let scrollTop = event.detail.scrollTop;
    },
    TransferFn({ order = "", small = "", page = 1, lat = "", lng = "", city = "" } = {}) {
        let _this = this;
        this.setData({ loading: true, Ndata: false })
        Utils.requestFn({ // 请求数据加载页面
            url: "/index.php/layers?server=1",
            data: {
                order: order,
                small: small,
                page: page,
                lat: lat,
                lng: lng,
                city: city,
            },
            success(res) {
                _this.setData({ loading: false })
                // console.log("LawyerLibrary.TransferFn res:",res);
                if (res.data.status) {
                    let resData = res.data.data;
                    let commonList = _this.data.commonList;
                    if (!!resData.length) {
                        _this.setData({ commonList: commonList.concat(resData), Ndata: false })
                    } else {
                        if (page > 1) {
                            Utils.showModal("没有数据了。。");
                        } else {
                            _this.setData({ Ndata: true })
                        }
                        return false;
                    }
                } else {
                    Utils.showModal("请求数据错误");
                }
            }
        })
    },
    onReachBottom() {    // 上拉加载数据
        let newNav = this.data.newNav;
        let city = this.data.city;
        let small = this.data.small;
        let order = this.data.order;
        downPage++;
        this.TransferFn({ small: small, city: city, page: downPage, order: order });
    },
    defaultData() {    // 默认的加载的数据
        this.TransferFn();
    },
    JumpDetails(event) {    // 跳转详情页面

        let details = wx.getStorageSync("login");
        let uid = event.currentTarget.dataset.uid;
        let josn = {
            attid: uid,
            uid: details.uid,
            sdk: details.sdk
        };

        let rec = this.data.rec;                // 判断是否推荐模块显示
        if (rec) { return false; }

        Utils.requestFn({
            url: "/index.php/layerdetail?server=1",
            data: josn,
            success(res) {
                console.log('LawyersLibrary JumpDetails res:',res);
                let rData = res.data;
                if (rData.status) {

                    Utils.setStorage("Ldetails", rData.data);
                    wx.navigateTo({
                        url: `/pages/LawyerDetails/LawyerDetails`
                    })

                } else {
                    Utils.showModal("再刷新一下啦，页面报错啦");
                }
            }
        })
    },
    Jump(url) { // 跳转的公共的方法
        wx.redirectTo({
            url: url
        })
    },
    tabFn(e) {   // 切换链接
        let id = e.currentTarget.id;
        switch (id) {
            case "1":
                this.Jump("/pages/home/home");
                break;
            case "2":
                this.Jump("/pages/Consultation/Consultation");
                break;
            case "3":
                this.Jump("/pages/LawyersLibrary/LawyersLibrary?tab=1");
                break;
            case "4":
                this.MyMessage();
                break;
        }
    },
    MyMessage() {  // 判断有没有登陆的信息
        let login = wx.getStorageSync('login');
        if (login) {
            this.Jump("/pages/myList/myList");
        } else {
            this.Jump("/pages/login/login");
        }
    },
    onShareAppMessage(res) {    // 转发
        return {
            title: '律师帮帮',
            path: '/pages/LawyersLibrary/LawyersLibrary'
        }
    },
    recFn(e) {              // 点击tab切换推荐的nav
        let value = wx.getStorageSync('login');
        let eId = e.currentTarget.id;
        let dataId = this.screenCity();
        let josn = {
            sdk: value.sdk,
            uid: value.uid,
            small: eId,
            city: dataId
        }
        this.request(josn);
    },
    screenCity() {           // 筛选城市
        // 截取获得第一个城市信息
        let getpos = wx.getStorageSync('position-type').split('-')[0];
        // 获取本地储存的城市列表
        let regions = this.data.cityData;
        // 存储对应的ID
        let dataId;
        // 筛选
        regions.forEach((item) => {
            if (item.name.indexOf(getpos) != -1) {
                dataId = item.id
            }
        })
        return dataId;
    },
    request(josn) {         // 一键找推荐律师页面的请求数据
        Utils.requestFn({
            url: "/index.php/quickl?server=1",
            method: "GET",
            data: josn,
            success(res) {
                console.log("LawyersLibrary.request quickl:",res);
                if (res.data.status) {
                    Utils.setStorage("lvs", res.data.data);

                    wx.navigateTo({
                        url: `/pages/RecommendLsv/RecommendLsv?data=${josn.small}`
                    })
                } else {
                    Utils.showModal("请求失败")
                }
            }
        })
    },
    oneReqLoads(datas) {          //   初次加载默认的数据
        // console.log('LawyersLibrary.oneReqLoads datas:',datas);
        // console.log('LawyersLibrary.oneReqLoads typeof datas:'+typeof datas);
        let _this = this;
        let TitleData = this.data.TitleData;    // 获取导航的数据
        let twoCitys = screening();
        TitleData[0] = twoCitys.name;
        // console.log("LawyersLibrary.oneReqLoads twoCitys:",twoCitys);
        if( !twoCitys.id )
        {
            twoCitys.id = 0;
        }
        this.setData({ firstLoad: true, Ndata: false, TitleData: TitleData, city: twoCitys.id })

        // 筛选二级城市
        function screening() {
            // 获取本地的位置
            let pos = wx.getStorageSync('position-type').split("-");
            // console.log("LawyersLibrary.oneReqLoads screening pos:",pos);
            let citys = datas;
            let cityID = {};
            console.log("LawyersLibrary.screening citys len:"+citys.length,citys);
            // console.log("LawyersLibrary.screening typeof citys:"+typeof citys);
            cityID.name = pos[2];
            // console.log("LawyersLibrary.oneReqLoads screening cityID:",cityID);
            // citys.forEach((item) => {
            for( var i = 0; i < citys.length; i++ )
            {
                var item = citys[i];
                // console.log("LawyersLibrary.oneReqLoads item:",item);
                if (item.name.indexOf(pos[1]) != "-1") 
                {
                    // item.small.forEach((item) => 
                    for(var j = 0; j < item.small.length; j++)
                    {
                        var small_item = item.small[j];
                        if (small_item.name.indexOf(pos[2]) != "-1") 
                        {
                            cityID.id = small_item.id;
                            // console.log("LawyersLibrary.oneReqLoads screening cityID 2:",cityID);
                        }
                    }
                    // })
                }
            }
            // })
            // console.log("LawyersLibrary.oneReqLoads screening cityID 3:",cityID);
            return cityID;
        };
        Utils.requestFn({ // 请求数据加载页面
            url: "/index.php/layers?server=1",
            data: {
                order: "",
                small: "",
                page: 1,
                lat: "",
                lng: "",
                city: twoCitys.id,
            },
            success(res) {
                _this.setData({ firstLoad: false })
                console.log("LawyerLibrary.layers res:",res);
                if (res.data.status) {
                    let resData = res.data.data;
                    let commonList = _this.data.commonList;
                    if (!!resData.length) {
                        _this.setData({ commonList: commonList.concat(resData), Ndata: false })
                    } else {
                        if (page > 1) {
                            Utils.showModal("没有数据了。。");
                        } else {
                            _this.setData({ Ndata: true })
                        }
                        return false;
                    }
                } else {
                    Utils.showModal("请求数据错误");
                }
            }
        })
    },
    coordinate() {   // 页面初始的时候请求位置
        let _this = this;
        let p = new Promise((success)=>{
            let qqmapsdk = map.map();
            qqmapsdk.reverseGeocoder({
                complete: function (res) { // 获取位置成功返回
                    console.log('LawyersLibrary.coordinate res:',res);
                    /*
                    message:"query ok"
                    request_id:"a2f1b1cc-8de2-11e9-8a13-5254003ee493"
                    result:{
                        ad_info:{
                            city_code:"458000001"
                            location:{lat: 3.139003, lng: 101.686852}
                            nation_code:"458"
                        }
                        address:"马来西亚吉隆坡PersiaranMahameru"
                        address_component:{
                            ad_level_1:"吉隆坡"
                            ad_level_2:""
                            ad_level_3:""
                            locality:"吉隆坡"
                            nation:"马来西亚"
                            street:"PersiaranMahameru"
                        }
                        location:{lat: 3.139003, lng: 101.686855}
                        status:0
                    }
                    */
                    if (res.result) {
                        // var province = res.result.address_component.province;   // 省
                        // var city = res.result.address_component.city;   // 市
                        // var district = res.result.address_component.district;   // 区
                        // province = province.substring(0, province.length - 1);  // 去掉“省”的后缀
                        // city = city.substring(0, city.length - 1);       // 去掉“市”的后缀

                        // Utils.setStorage("position-type", `${province}-${city}-${district}`);
                        
                        try{
                            var address_component = res.result.address_component;
                            var country = address_component.nation;
                            var lv1 = address_component.ad_level_1;
                            var lv2 = address_component.ad_level_2 ? address_component.ad_level_2 : lv1;
                            var lv3 = address_component.ad_level_3 ? address_component.ad_level_3 : lv1;
                            var loc = address_component.locality;
    
                            // Utils.setStorage("position-type",`${country}-${lv1}-${lv2}-${lv3}-${loc}`);
                            Utils.setStorage("position-type",`${lv1}-${lv2}-${lv3}-${loc}`);
                        }catch(e){
                            console.log('Consultation reverseGeocoder err:',e);
                        }

                        success(true);
                    }
                },
                fail: function (res) {  // 获取位置失败
                    Utils.showModal("获取位置失败网络错误");
                    Utils.setStorage("position-type", "")
                    _this.coordinate();
                }
            })
        })
        return p;
    },
})