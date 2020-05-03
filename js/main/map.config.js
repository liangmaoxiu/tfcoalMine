/* --------------------------------地图初始信息配置-------------------------------- */
function MapConfig() { }
MapConfig.mapInitParams = {
    fullExtent: {//全图范围
        xmin: -180,
        ymin: -90,
        xmax: 180,
        ymax: 90
    },
    extent: {//初始化范围12491733.419,2579457.273,12724713.481,2700839.274
        xmin: 120.8696333,
        ymin: 38.65953686,
        xmax: 123.6199347,
        ymax: 40.202622
    },
    spatialReference: {
        wkid: 4326
    },
    arcgis_lods: [//ArcGIS的lods
      { "level": 0, "resolution": 0.005499319857156722, "scale": 2311162 },
      { "level": 1, "resolution": 0.002749659928578361, "scale": 1155581 },
      { "level": 2, "resolution": 0.0013748287745586776, "scale": 577790 },
      { "level": 3, "resolution": 6.874143872793388E-4, "scale": 288895 },
      { "level": 4, "resolution": 3.437060039091665E-4, "scale": 144447 },
      { "level": 5, "resolution": 1.7185181222408033E-4, "scale": 72223 },
      { "level": 6, "resolution": 8.592471638153725E-5, "scale": 36111 },
      { "level": 7, "resolution": 4.296116846026571E-5, "scale": 18055 },
      { "level": 8, "resolution": 2.147939449962994E-5, "scale": 9027 },
      { "level": 9, "resolution": 1.0738507519312054E-5, "scale": 4513 }
    ],

}
/*导航条配置参数*/
MapConfig.sliderConfig = {
    targetId: "mapDiv",
    minValue: 0,     
    maxValue: 9,    
    startValue: 2,  
    toolbarCss: ["toolBar", "toolBar_button", "toolBar_slider", "toolBar_mark"],
    marksShow: {
        countryLevel: null,
        provinceLevel: null,
        cityLevel: null,
        streetLevel: null
    }
};
// 调用后台路径
var backbasePath = "http://127.0.0.1:9010/";
/*地图调用*/
MapConfig.searchMapUrl = "https://192.168.31.32:6443/arcgis/rest/services/dlsearch/MapServer";//搜索查询地图服务
MapConfig.locatorUrl = "https://192.168.31.32:6443/arcgis/rest/services/poiLocator/GeocodeServer";//地理编码服务
MapConfig.routetaskUrl = "https://192.168.31.32:6443/arcgis/rest/services/dlroad/NAServer/Route";//路网服务
MapConfig.routeUrl = "https://192.168.31.32:6080/arcgis/rest/services/dlClosestFacility/NAServer/Closest%20Facility";//Closest Facility服务
/*地图配置服务信息说明
 *type为地图类型，0为wmts，1为mapserver切片,2为高德地图矢量，3为高德卫星,4为天地图矢量,5为天地图卫星,6为百度地图矢量,7为百度卫星
 */
MapConfig.arcvecMap = { Url: "https://192.168.31.32:6443/arcgis/rest/services/dlMap/MapServer", labelUrl: "矢量", type: 1 };//大连矢量底图服务-ArcGIS切片格式
MapConfig.arcimgMap = { Url: "https://192.168.31.32/arcgis/rest/services/dlImgMap/MapServer", labelUrl: "影像", type: 1 };//大连影像底图服务-ArcGIS切片格式
var WEBPATH="http://127.0.0.1:8080/BaseMap/";
/*图层目录构造*/
MapConfig.zNodes = [
    { id: 1, pId: 0, name: "图层目录", checked: false, iconOpen: "" + WEBPATH + "Content/images/legend/1_open.png", iconClose: "" + WEBPATH + "Content/images/legend/1_close.png" },
    { id: 11, pId: 1, name: "餐饮", layerurl: MapConfig.searchMapUrl, layerid: "layer0", checked: false, icon: "" + WEBPATH + "Content/images/legend/0.png" },
    { id: 12, pId: 1, name: "购物", layerurl: MapConfig.searchMapUrl, layerid: "layer3", checked: false, icon: "" + WEBPATH + "Content/images/legend/3.png" },
    { id: 13, pId: 1, name: "金融服务", layerurl: MapConfig.searchMapUrl, layerid: "layer2", checked: false, icon: "" + WEBPATH + "Content/images/legend/2.png" },
    { id: 14, pId: 1, name: "科研教育", layerurl: MapConfig.searchMapUrl, layerid: "layer4", checked: false, icon: "" + WEBPATH + "Content/images/legend/4.png" },
    { id: 15, pId: 1, name: "医疗服务", layerurl: MapConfig.searchMapUrl, layerid: "layer5", checked: false, icon: "" + WEBPATH + "Content/images/legend/5.png" },
    { id: 16, pId: 1, name: "住宿", layerurl: MapConfig.searchMapUrl, layerid: "layer1", checked: false, icon: "" + WEBPATH + "Content/images/legend/1.png" }
];



