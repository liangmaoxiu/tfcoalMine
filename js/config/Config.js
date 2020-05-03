/**
 * 初始化配置程序。
 *
 * 添加ArcGIS API之后，首先替换init.js和dojo.js中的主机路径：
 * [HOSTNAME_AND_PATH_TO_JSAPI]dojo→HOSTNAME_AND_PATH_TO_JSAPI + "dojo"
 **/

/**
 * 属性定义
 **/
//var WEBPATH = getRootPath()+"map/";
//var WEBPATH="E:/workspace/api3x";
var frontbasePath = "http://127.0.0.1:8080/";
var backbasePath = "http://127.0.0.1:9010/";
var WEBPATH=frontbasePath+"BaseMap";
// if(window.location.href.indexOf('10.10')>-1||window.location.href.indexOf('localhost')>-1){
// 	var WEBPATH_ARCGIS = 'http://192.168.31.32:8080/arcgis_js_api3x/library/3.32/3.32/';
// }else if(window.location.href.indexOf('10.11.2.103')>-1||window.location.href.indexOf('10.11.5.127')>-1){//济南代理地址
// 	var WEBPATH_ARCGIS = 'http://192.168.31.32:8080/arcgis_js_api3x/library/3.32/3.32/';
// }else{
// 	var WEBPATH_ARCGIS = 'http://192.168.31.32:8080/arcgis_js_api3x/library/3.32/3.32/';
// }https://192.168.31.32:6443/arcgis/rest/services/dlMap/MapServer

//var WEBPATH_ARCGIS = 'https://js.arcgis.com/3.29/';
var WEBPATH_ARCGIS = 'http://192.168.31.32:8080/arcgis_js_api3x/library/3.32/3.32/';

//var HOSTNAME_AND_PATH_TO_JSAPI = getRootPath(true) + 'map/libs/arcgis_js_api/library/3.23/3.23/';
 var REFSRC_ARCGIS = WEBPATH_ARCGIS + "init.js";
 var dojo_PATH=WEBPATH_ARCGIS + "dojo/dojo.js";
 var path=location.pathname.replace(/\/[^/]*$/, "");

/**
 * 网页初始化
 **/
-function htmlInit() {
    document.write('\n'


         + '<script type="text/javascript" src="' + path + '/js/main/drawExtension/tween.js"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/jquery/jquery-1.9.1.min.js"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/jquery/jquery-ui-1.11.4.min.js"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/Content/jquery-ui.min-1.11.4.css"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/Content/map/map-index.css"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/Content/map/map-route.css"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/Content/map/mapcss.css"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/Content/bootstrap.css"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/Content/site.css"></script>' + '\n'
        //  <!--鼠标滚动条-->
         + '<script type="text/javascript" src="' + path + '/js/plugins/jquerymCustomScrollbar/jquery.mCustomScrollbar.css"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/plugins/jquerymCustomScrollbar/jquery.mousewheel.js"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/plugins/jquerymCustomScrollbar/jquery.mCustomScrollbar.js"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/arcgisapi/3.22/dijit/themes/nihilo/nihilo.css"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/arcgisapi/3.22/esri/css/esri.css"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/main/utils.js"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/arcgisapi/3.22/init.js"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/main/map.config.js"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/main/map.js"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/main/map.map2dPanel.js"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/main/measure.js"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/main/control.js"></script>' + '\n'
         + '<script type="text/javascript" src="' + path + '/js/main/map.LayerSwitcherToolbar.js"></script>' + '\n'
        //  <!--地图搜索-->
        + '<script type="text/javascript" src="' + path + '/js/main/map.poi.js"></script>' + '\n'
        // <!--空间查询-->
        + '<script type="text/javascript" src="' + path + '/js/main/map.spatialquery.js"></script>' + '\n'
        // <!--地图标绘-->
        + '<script type="text/javascript" src="' + path + '/js/main/map.plot.js"></script>' + '\n'
        // <!--图层管理器-->
        + '<script type="text/javascript" src="' + path + '/js/main/map.catalog.js"></script>' + '\n'
        // <!--地图分屏-->
        + '<script type="text/javascript" src="' + path + '/js/main/map.splitScreen.js"></script>' + '\n'
        // <!--路径分析-->
        + '<script type="text/javascript" src="' + path + '/js/main/map.route.js"></script>' + '\n'
        + '<script type="text/javascript" src="' + path + '/js/main/ems_route.js"></script>' + '\n'
        // <!--对话框-->
        + '<script type="text/javascript" src="' + path + '/js/plugins/jqueryDialog/jDialog/jDialog.css"></script>' + '\n'
        + '<script type="text/javascript" src="' + path + '/js/plugins/jqueryDialog/jDialog.js"></script>' + '\n'
        // <!--Ztree控件-->
        + '<script type="text/javascript" src="' + path + '/js/plugins/ztree/zTreeStyle/img/zTreeStyle.css"></script>' + '\n'
        + '<script type="text/javascript" src="' + path + '/js/plugins/ztree/jquery.ztree.min.js"></script>' + '\n'
        // <!--上传文件框-->
        + '<script type="text/javascript" src="' + path + '/js/plugins/uploadify3.2.1/uploadify.css"></script>' + '\n'
        + '<script type="text/javascript" src="' + path + '/js/plugins/uploadify3.2.1/jquery.uploadify.js"></script>' + '\n'
        + '<script type="text/javascript" src="' + path + '/js/plugins/bootstrap/css/bootstrap.min.css"></script>' + '\n'
        + '<script type="text/javascript" src="' + path + '/js/plugins/bootstrap/js/bootstrap.min.js"></script>' + '\n'

         

    );
}();


/**
 * 获取Web路径
 *
 * @author:Helsing
 * @param withoutProtocol:不包含协议头
 **/
// function getRootPath(withoutProtocol) {
//     var ret = "";
//     var pathName = window.location.pathname.substring(1);
//     var projectName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/') + 1);
//     if (projectName == "") {
//         if (withoutProtocol) {
//             ret = window.location.host + '/';
//         } else {
//             ret = window.location.protocol + '//' + window.location.host + '/';
//         }
//     }
//     else {
//         ret = window.location.protocol + '//' + window.location.host + '/' + projectName + '/';
//         if (isValidUrl(ret + "index.html")) {
//             if (withoutProtocol) {
//                 ret = window.location.host + '/' + projectName + '/';
//             } else {
//                 ret = window.location.protocol + '//' + window.location.host + '/' + projectName + '/';
//             }
//         }
//         else {
//             if (withoutProtocol) {
//                 ret = window.location.host + '/';
//             } else {
//                 ret = window.location.protocol + '//' + window.location.host + '/';
//             }
//         }

//     }
//     return ret;
// }

/**
 * 判断url地址是否可以访问
 *
 * @author:Helsing
 * @param url:url地址
 **/
// function isValidUrl(url) {
//     var xmlhttp;
//     if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
//         xmlhttp = new XMLHttpRequest();
//         //针对某些特定版本的mozillar浏览器的bug进行修正。
//         if (xmlhttp.overrideMimeType) {
//             xmlhttp.overrideMimeType('text/xml');
//         };
//     }
//     else { // code for IE6, IE5
//         xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//     }
//     //xmlhttp.onreadystatechange = callback;

//     xmlhttp.open("get", url, false);//同步方式
//     xmlhttp.send();
//     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//         return true;
//     }
//     return false;
// }
