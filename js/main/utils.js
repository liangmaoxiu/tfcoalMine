/**
 * js获取项目根路径，如： http://localhost/GGFW/
*/
function getRootPath() {
    //获取当前网址，如： http://localhost/GGFW/
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    if (projectName == "")
        projectName = pathName;
        var path=location.pathname.replace(/\/[^/]*$/, "");
    // return (localhostPaht + projectName + "/");
    return (path + "/");
}
function getServerPath() {
    //获取当前网址，如： http://localhost/GGFW/
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址
    var localhostPaht = curWwwPath.substring(0, pos);
    localhostPaht = localhostPaht.replace('http://', '');
    //获取带"/"的项目名
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    if (projectName == "")
        projectName = pathName;
    return (localhostPaht + projectName + "/");
}
var arcgisapiPath = getRootPath() + "js/arcgisapi/3.22/dojo";
/*提示对话框信息-----------------------------------------------------------------------------------------------------------------开始*/
/**
 * 提示对话框信息,自动关闭
*/
function promptdialog(title, content) {
    var dialog = jDialog.dialog({
        title: title,
        modal: true,         // 非模态，即不显示遮罩层
        autoClose: 1000,
        content: content
    });
    return dialog;
}

DUtil = {};
DUtil.extend = function (destination, source) {
    destination = destination || {};
    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }
        var sourceIsEvt = typeof window.Event == "function" && source instanceof window.Event;
        if (!sourceIsEvt && source.hasOwnProperty && source.hasOwnProperty('toString')) {
            destination.toString = source.toString;
        }
    }
    return destination;
};
DUtil.getDistanceInEarth = function (point1, point2) {
    var d = new Number(0);
    //1度等于0.0174532925199432957692222222222弧度
    //var radPerDegree=0.0174532925199432957692222222222;
    var radPerDegree = Math.PI / 180.0;
    if (DCI.Measure.map.spatialReference.wkid == "4326") {
        //		var dlon = (point2.x - point1.x) * radPerDegree;
        //		var dlat = (point2.y - point1.y) * radPerDegree;
        //		var len_geo = Math.pow(Math.sin(dlat/2),2) + Math.cos(point1.y) * Math.cos(point2.y) * Math.pow(Math.sin(dlon/2),2);
        //		len_geo = Math.abs(Math.min(1,len_geo));
        //		var c = 2 * Math.atan2(Math.sqrt(len_geo),Math.sqrt(1-len_geo));
        //		d = c * 6371008.77141506;
        var latLength1 = Math.abs(this.translateLonLatToDistance({ x: point1.x, y: point2.y }).x - this.translateLonLatToDistance({ x: point2.x, y: point2.y }).x);
        var latLength2 = Math.abs(this.translateLonLatToDistance({ x: point1.x, y: point1.y }).x - this.translateLonLatToDistance({ x: point2.x, y: point1.y }).x);
        var lonLength = Math.abs(this.translateLonLatToDistance({ x: point1.x, y: point2.y }).y - this.translateLonLatToDistance({ x: point1.x, y: point1.y }).y);
        d = Math.sqrt(Math.pow(lonLength, 2) - Math.pow(Math.abs(latLength1 - latLength2) / 2, 2) + Math.pow(Math.abs(latLength1 - latLength2) / 2 + Math.min(latLength1, latLength2), 2));
    }
    else {
        var len_prj = Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y), 2);
        d = Math.sqrt(len_prj);
    }
    d = Math.ceil(d);
    return d;
};
DUtil.translateLonLatToDistance = function (point) {
    var d = new Number(0);
    //1度等于0.0174532925199432957692222222222弧度
    //var radPerDegree=0.0174532925199432957692222222222;
    var radPerDegree = Math.PI / 180.0;
    var equatorialCircumference = Math.PI * 2 * 6378137;

    return {
        x: Math.cos(point.y * radPerDegree) * equatorialCircumference * Math.abs(point.x / 360),
        y: equatorialCircumference * Math.abs(point.y / 360)
    };
};
//******求三角形面积****
DUtil.getTriangleArea = function (point1, point2, point3) {
    var area = 0;

    if (!point1 || !point2 || !point3) {
        return 0;
    }

    if (DCI.Measure.map.spatialReference.wkid == "4326") {

        point1 = this.translateLonLatToDistance(point1);
        point2 = this.translateLonLatToDistance(point2);
        point3 = this.translateLonLatToDistance(point3);
        //        var edge1 = Math.sqrt(Math.pow((point2.x - point1.x),2) + Math.pow((point2.y - point1.y),2));
        //        var edge2 = Math.sqrt(Math.pow((point3.x - point2.x),2) + Math.pow((point3.y - point2.y),2));
        //        var edge3 = Math.sqrt(Math.pow((point1.x - point3.x),2) + Math.pow((point1.y - point3.y),2));
    }
    //point1 = pointAreaProj, point2 = pointAreaArrProj[clickAreaNum], point3 = pointAreaArrProj[0]

    //area = (point1.x - point2.x) * (point1.y + point2.y) / 2 + (point3.x - point1.x) * (point3.y + point1.y) / 2;
    area = ((point1.x * point2.y - point2.x * point1.y) + (point2.x * point3.y - point3.x * point2.y) + (point3.x * point1.y - point1.x * point3.y)) / 2;

    return area;
};
DObject = function () {
    var Class = function () {
        if (arguments && arguments[0] != null) {
            this.construct.apply(this, arguments);
        }
    };
    var extended = {};
    var parent;
    for (var i = 0, len = arguments.length; i < len; ++i) {
        if (typeof arguments[i] == "function") {
            parent = arguments[i].prototype;
        } else {
            parent = arguments[i];
        }
        DUtil.extend(extended, parent);
    }
    Class.prototype = extended;
    return Class;
};



