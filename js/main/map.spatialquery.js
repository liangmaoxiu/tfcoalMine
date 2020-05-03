if (typeof DCI == "undefined") { var DCI = {}; }
DCI.SpatialQuery = {
    /**
     * 空间查询模块的Html部分
    */
    Html: "<!-- 框选菜单部分 -->" +
           "<!-- 查询图层框 -->" +
           "<div class='spatialquery-layer'>" +
               "<fieldset style='width:250px;padding:5px;border:1px solid #1BB0F5;margin-left:1px;margin-top:5px;'>" +
                  "<legend class='querylegend'>空间查询</legend>" +
                  "<div id='spatialquery_selection-collapse'>" +
               "</fieldset>" +
           "</div>" +
           "<!-- 框选设置 -->" +
           "<div class='spatialquery_menu_tool'>" +
               "<ul>" +
                 "<li class='spatialqueryPtool' onclick='DCI.SpatialQuery.extentQuery(\"polygon\")'><a href='javascript:void(0)' class='downloadlayerbg'><span class='bpolylabel'></span>多边形</a></li>" +
                 "<li class='menupubline'></li>" +
                 "<li class='spatialqueryRtool' onclick='DCI.SpatialQuery.extentQuery(\"rectangle\")'><a href='javascript:void(0)' class='downloadlayerbg'><span class='brectanglelabel'></span>矩形</a></li>" +
                 "<li class='menupubline'></li>" +
                 "<li class='spatialqueryCtool' onclick='DCI.SpatialQuery.InitState()'><a href='javascript:void(0)' class='downloadlayerbg'><span class='dellabel'></span>清空</a></li>" +
               "</ul>" +
           "</div>" +
           "<!-- 空间查询获取结果显示 -->" +
           "<div>" +
              "<div id='queryShowList_scroll' class='spatialquery-content'>" +
                 "<div id='queryshowList' style='width:100%;height:100%;margin-left:2px;'></div>" +
              "</div>" +
           "</div>" +
           "<!-- 搜索结果分页div -->" +
           "<div class='Page-content' id='querylistpage'></div>"
           ,
    /**
     * 全局变量
    */
    map: null,//地图对象
    graphicslayer: null,//显示图层
    enableAnalysisLayers: null,//空间分析的图层列表
    layerNames: null,
    allFeatureFields: null,
    type: null,//判断标识,0指定图层空间查询 1所有图层的空间查询
    layerTitles: null,
    sgeometry: null,//保存当前的查询图形
    orgraphicsLayer: null,//框选图形
    drawtool: null,
    pageIndex: 0,
    pageSize: 10,
    spatialQuery: {//空间查询设置条件属性
        returnFields: null,
        layerName: null,
    },//构造参数
    /**
     * 初始化加载部分
    */
    Init: function (map) {
        DCI.SpatialQuery.map = map;
        //创建空间查询结果展示的点图层
        DCI.SpatialQuery.orgraphicsLayer = new esri.layers.GraphicsLayer({ opacity: 1 });
        DCI.SpatialQuery.map.addLayer(DCI.SpatialQuery.orgraphicsLayer);
        //创建框选绘制的面图层
        DCI.SpatialQuery.graphicslayer = new esri.layers.GraphicsLayer();
        DCI.SpatialQuery.map.addLayer(DCI.SpatialQuery.graphicslayer);  //将图层赋给地图
        //监听点图层的点击响应事件
        DCI.SpatialQuery.addGraphicsLayerEvent();
        //初始化绘制图形的draw工具并且激活监听绘制结束事件
        DCI.SpatialQuery.drawtool = new esri.toolbars.Draw(map);
        DCI.SpatialQuery.drawtool.on("draw-end", DCI.SpatialQuery.addToMap);

        //空间查询列表初始化
        DCI.SpatialQuery.enableAnalysisLayers = [{ aliasName: "餐饮图层", allFeatureFields: "NAME", featureLayerName: MapConfig.searchMapUrl + "/0", type: "0" },
                                                 { aliasName: "所有图层", allFeatureFields: "", featureLayerName: MapConfig.searchMapUrl, type: "1" }];
        //动态创建图层列表UI，餐饮图层  所有图层的checkbox
        $("#spatialquery_selection-collapse").html(DCI.SpatialQuery.InitLayerHtml());

    },
    /**
     * 初始化加载查询图层框里面的图层列表
    */
    InitLayerHtml: function () {
        var html = [];
        html.push("<div>");
        if (DCI.SpatialQuery.enableAnalysisLayers && DCI.SpatialQuery.enableAnalysisLayers.length > 0) {
            for (var i = 0; i < DCI.SpatialQuery.enableAnalysisLayers.length; i++) {
                html.push("<div style='float: left;height: auto;width: 240px;'>");
                html.push("<input type='checkbox' style='float:left;cursor: pointer;margin-top:1px;'  name='spaceSearchLayerName' id='spaceSearchLayerName' onclick='DCI.SpatialQuery.checkSelectLayer(this)' value='");
                html.push(DCI.SpatialQuery.enableAnalysisLayers[i].featureLayerName);
                html.push(";");
                html.push(DCI.SpatialQuery.enableAnalysisLayers[i].aliasName);
                html.push(";");
                html.push(DCI.SpatialQuery.enableAnalysisLayers[i].type);
                html.push(";");
                html.push(DCI.SpatialQuery.enableAnalysisLayers[i].allFeatureFields);
                html.push("'>");
                html.push("<a style='float:left;color:black;font-size:13px;margin-top:1px;'>" + DCI.SpatialQuery.enableAnalysisLayers[i].aliasName + "</a>");
                html.push("</input><br/>");
                html.push("</div>");
            }
        }
        html.push("</div>");
        return html.join("");
    },
    /**
     * 添加graphiclayer监听事件
     * 点击图标弹出气泡窗口显示详情
    */
    addGraphicsLayerEvent: function () {
        DCI.SpatialQuery.graphicslayer.on("click", function (evt) {
            DCI.SpatialQuery.map.centerAt(evt.graphic.geometry);
            DCI.SpatialQuery.map.infoWindow.resize(200, 160);
            if (evt.graphic.attributes) {
                DCI.SpatialQuery.map.infoWindow.setTitle(evt.graphic.attributes.title);
                DCI.SpatialQuery.map.infoWindow.setContent(evt.graphic.attributes.content);
            }
            setTimeout(function () {
                DCI.SpatialQuery.map.infoWindow.show(evt.graphic.geometry);
            }, 500);
        });
    },
    /**
     * 选择勾选的图层
     * 设置了只能勾选一项，要么是指定图层餐饮，要么查询所有的图层
    */
    checkSelectLayer: function (obj) {
        var checkList = document.getElementsByName("spaceSearchLayerName");
        for (var i = 0; i < checkList.length; i++) {
            if (checkList[i] != obj)
               checkList[i].checked = false;
        }
        DCI.SpatialQuery.InitCheck();
    },
    /**
     * 初始化勾选的图层
    */
    InitCheck: function () {
        DCI.SpatialQuery.layerNames = [];
        DCI.SpatialQuery.allFeatureFields = [];
        DCI.SpatialQuery.type = [];
        DCI.SpatialQuery.layerTitles = [];

        var checkList = document.getElementsByName("spaceSearchLayerName");
        for (var i = 0; i < checkList.length; i++) {
            if (checkList[i].checked) {
                var layerStr = checkList[i].value;
                var checkLayerInfo = layerStr.split(";");
                DCI.SpatialQuery.layerNames.push(checkLayerInfo[0]);
                DCI.SpatialQuery.layerTitles.push(checkLayerInfo[1]);
                DCI.SpatialQuery.type.push(checkLayerInfo[2]);
                DCI.SpatialQuery.allFeatureFields.push(checkLayerInfo[3]);
            }
        }
    },
    /**
     * 框选画结束drawend函数返回结果
     * 多边形 矩形
    */
    addToMap: function (evt) {
        DCI.SpatialQuery.doSpatial(evt.geometry);
    },
    doSpatial: function (geo) {
        DCI.SpatialQuery.drawtool.deactivate();
        DCI.SpatialQuery.map.setMapCursor("default");
        if (geo)
          DCI.SpatialQuery.doSpatialSearch(geo);
    },
    /**
     * 框选查询
     * 点 线 面 拉框 视野内
    */
    extentQuery: function (type) {
        DCI.SpatialQuery.InitCheck();
        if (DCI.SpatialQuery.layerNames.length == 0) {
           // promptdialog("提示信息", "请选择查询图层!");
            alert("请选择查询图层!");
            return;
        }
        DCI.SpatialQuery.map.setMapCursor("crosshair");
        DCI.SpatialQuery.InitState();
        switch (type) {
            case "point"://点
                DCI.SpatialQuery.drawtool.activate(esri.toolbars.Draw.POINT);
                break;
            case "polyline"://线
                DCI.SpatialQuery.drawtool.activate(esri.toolbars.Draw.POLYLINE);
                break;
            case "polygon"://面
                DCI.SpatialQuery.drawtool.activate(esri.toolbars.Draw.POLYGON);
                break;
            case "rectangle"://拉框
                DCI.SpatialQuery.drawtool.activate(esri.toolbars.Draw.EXTENT);
                break;
        }
    },
    /**
     * 空间查询
     * 多边形 矩形
    */
    doSpatialSearch: function (geometry) {
        DCI.SpatialQuery.sgeometry = geometry;
        DCI.SpatialQuery.pageIndex = 0;
        //其实这里只有一条记录，因为checkbox只会勾选中一项，没有多选
        for (var i = 0; i < DCI.SpatialQuery.layerNames.length; i++) {
            if (DCI.SpatialQuery.type[i] == "0") {//指定图层的空间查询
                DCI.SpatialQuery.spatialQuery.returnFields = DCI.SpatialQuery.allFeatureFields[i];//获取Query空间查询的outfield
                DCI.SpatialQuery.spatialQuery.layerName = DCI.SpatialQuery.layerNames[i];//获取Query空间查询的服务URL
                DCI.SpatialQuery.searchSP(geometry);
            } else if (DCI.SpatialQuery.type[i] == "1") {//所有图层的空间查询
                DCI.SpatialQuery.spatialQuery.layerName = DCI.SpatialQuery.layerNames[i];//获取Identify空间查询的服务URL
                DCI.SpatialQuery.searchIdentify(geometry);
            }
        }
        //地图跳转到指定的范围
        var rExtent = DCI.SpatialQuery.sgeometry.getExtent();
        DCI.SpatialQuery.map.setExtent(rExtent.expand(1.5));
        //添加绘制图形
        var markerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 8, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 69, 0]), 2), new dojo.Color([255, 255, 255, 1]));
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 160, 122]), 2);
        switch (geometry.type) {
            case "point":
                var graphic = new esri.Graphic(geometry, markerSymbol);
                break;
            case "polyline":
                var graphic = new esri.Graphic(geometry, lineSymbol);
                break;
            default:
                var fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 160, 122, 1]), 1), new dojo.Color([0, 0, 255, 0.15]));
                var graphic = new esri.Graphic(geometry, fillSymbol);
        }
        DCI.SpatialQuery.orgraphicsLayer.add(graphic);

    },
    /**
     * 所有图层的空间查询--Identify
    */
    searchIdentify: function (geometry) {
        var identifyTask = new esri.tasks.IdentifyTask(DCI.SpatialQuery.spatialQuery.layerName);//URL
        var identifyParams = new esri.tasks.IdentifyParameters();
        identifyParams.tolerance = 3;//设置绘制框选图形范围的屏幕像素距离，这个值必须要设置，不然查询不到，我用官网在线例子的默认3
        identifyParams.returnGeometry = true;//返回空间查询的geometry，方便把返回值结果以图标形式叠加在地图上
        identifyParams.layerIds = [0, 1, 2, 3, 4, 5];//设置查询图层列表
        identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;//设置查询的模式，我设置了可以查询所有的图层，不管是否可见，其他的模式具体参照api:https://developers.arcgis.com/javascript/3/jsapi/identifyparameters-amd.html
        identifyParams.geometry = geometry;//设置绘制框选图形范围
        identifyParams.mapExtent = DCI.SpatialQuery.map.extent;//设置查询的地图当前范围，也是必须设置的
        identifyTask.execute(identifyParams, DCI.SpatialQuery.identifyInfo);
    },
    /**
     * 所有图层的空间查询获取结果--Identify
    */
    identifyInfo: function (results) {
        //清空graphiclayer
        DCI.SpatialQuery.graphicslayer.clear();
        DCI.SpatialQuery.map.infoWindow.hide();
        var sms = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/plot/point1.png", 11, 13);
        var innerStr = [];
        var featureCount = results.length;
        if (results == null || featureCount == 0) {
            DCI.Poi.addSearchErrorPage("queryshowList");
            $("#querylistpage").css({ display: "none" });
            return;
        }
        //最大的显示页面
        var maxpage = Math.ceil(featureCount / DCI.SpatialQuery.pageSize);
        $("#querylistpage").css({ display: "block" });
        if (results.length > 0) {
            var rExtent = null;
            for (var i = 0; i < DCI.SpatialQuery.pageSize; i++) {
                var iId = i + 1;
                var baseGraphicsymbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/dw" + iId + ".png", 25, 25);
                var infactItem = DCI.SpatialQuery.pageIndex * DCI.SpatialQuery.pageSize + i;
                var tempID = "tempID" + i;
                var pId = "poi_" + iId;
                if (results[infactItem] == undefined) //最后一页没有记录了 跳出循环
                    break;
                var attr = { "title": results[infactItem].feature.attributes.NAME, "content": results[infactItem].feature.attributes.NAME };
                var baseGraphic = new esri.Graphic(results[infactItem].feature.geometry, baseGraphicsymbol, attr);
                baseGraphic.id = tempID;
                DCI.SpatialQuery.graphicslayer.add(baseGraphic);
                innerStr.push('<div class="left_list_li_box" onmouseover="DCI.SpatialQuery.onPOIMouseOverRecord(' + i + ',\'' + tempID + '\')" onmouseout="DCI.SpatialQuery.onPOIMouseOutRecord(' + i + ',\'' + tempID + '\')"  id="' + pId + '">');
                innerStr.push('<div class="left_list_li_box_top">');
                innerStr.push('<div class="left2_box2">');
                innerStr.push('<img class="list_poi_marker" style="" src="' + getRootPath() + 'Content/images/poi/dw' + iId + '.png"></img>');
                innerStr.push('<div class="left_list_li1">');
                innerStr.push('<p>');
                innerStr.push('<a onclick="DCI.SpatialQuery.toLocation(' + i + ',\'' + tempID + '\',\'' + results[infactItem].feature.attributes.NAME + '\')">' + results[infactItem].feature.attributes.NAME + '</a><br/>');
                innerStr.push('</p>');
                innerStr.push('</div>');
                innerStr.push('</div>')
                innerStr.push('</div>');
                innerStr.push('</div>');
                //设置地图显示范围
                if (rExtent == null)
                    rExtent = baseGraphic._extent;
                else {
                    rExtent = rExtent.union(baseGraphic._extent);
                }
            }
            $("#queryshowList").html(innerStr.join(''));

            DCI.SpatialQuery.map.setExtent(rExtent.expand(2));
            DCI.SpatialQuery.map.resize();
            DCI.SpatialQuery.map.reposition();
            //分页工具条        
            $("#querylistpage").PageOperator({
                containerID: "querylistpage",
                count: featureCount,
                pageIndex: DCI.SpatialQuery.pageIndex,
                maxPage: maxpage,
                callback: function (pageIndex) {
                    DCI.SpatialQuery.pageIndex = pageIndex;
                    if (DCI.SpatialQuery.type[0] == "0") {//指定图层的空间查询
                        DCI.SpatialQuery.searchSP(DCI.SpatialQuery.sgeometry);
                    } else if (DCI.SpatialQuery.type[0] == "1") {//所有图层的空间查询
                        DCI.SpatialQuery.searchIdentify(DCI.SpatialQuery.sgeometry);
                    }
                }
            });
        } else {
            alert("搜索不到相关数据");
        }
    },
    /**
     * 指定图层的空间查询--Query
    */
    searchSP: function (geometry) {
        var queryTask = new esri.tasks.QueryTask(DCI.SpatialQuery.spatialQuery.layerName);//URL
        var query = new esri.tasks.Query();
        query.returnGeometry = true;//返回空间查询的geometry，方便把返回值结果以图标形式叠加在地图上
        query.outFields = [DCI.SpatialQuery.spatialQuery.returnFields];//设置返回值的字段
        query.geometry = geometry;//设置绘制框选图形范围
        queryTask.execute(query, DCI.SpatialQuery.navInfo);
    },
    /**
     * 所有图层的空间查询--Query
    */
    navInfo: function (results) {
        //清空graphiclayer
        DCI.SpatialQuery.graphicslayer.clear();
        DCI.SpatialQuery.map.infoWindow.hide();
        var sms = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/plot/point1.png", 11, 13);
        var innerStr = [];
        var featureCount = results.features.length;
        if (results.features == null || featureCount == 0) {
            DCI.Poi.addSearchErrorPage("queryshowList");
            $("#querylistpage").css({ display: "none" });
            return;
        }
        //最大的显示页面
        var maxpage = Math.ceil(featureCount / DCI.SpatialQuery.pageSize);
        $("#querylistpage").css({ display: "block" });
        if (results.features.length > 0) {
            var rExtent = null;
            for (var i = 0; i < DCI.SpatialQuery.pageSize; i++) {
                var iId = i + 1;
                var baseGraphicsymbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/dw" + iId + ".png", 25, 25);
                var infactItem = DCI.SpatialQuery.pageIndex * DCI.SpatialQuery.pageSize + i;
                var tempID = "tempID" + i;
                var pId = "poi_" + iId;
                if (results.features[infactItem] == undefined) //最后一页没有记录了 跳出循环
                    break;
                var attr = { "title": results.features[i].attributes.NAME, "content": results.features[i].attributes.NAME };
                var baseGraphic = new esri.Graphic(results.features[infactItem].geometry, baseGraphicsymbol, attr);
                baseGraphic.id = tempID;
                DCI.SpatialQuery.graphicslayer.add(baseGraphic);
                innerStr.push('<div class="left_list_li_box" onmouseover="DCI.SpatialQuery.onPOIMouseOverRecord(' + i + ',\'' + tempID + '\')" onmouseout="DCI.SpatialQuery.onPOIMouseOutRecord(' + i + ',\'' + tempID + '\')"  id="' + pId + '">');
                innerStr.push('<div class="left_list_li_box_top">');
                innerStr.push('<div class="left2_box2">');
                innerStr.push('<img class="list_poi_marker" style="" src="' + getRootPath() + 'Content/images/poi/dw' + iId + '.png"></img>');
                innerStr.push('<div class="left_list_li1">');
                innerStr.push('<p>');
                innerStr.push('<a onclick="DCI.SpatialQuery.toLocation(' + i + ',\'' + tempID + '\',\'' + results.features[infactItem].attributes.NAME + '\')">' + results.features[infactItem].attributes.NAME + '</a><br/>');
                innerStr.push('</p>');
                innerStr.push('</div>');
                innerStr.push('</div>')
                innerStr.push('</div>');
                innerStr.push('</div>');
                //设置地图显示范围
                if (rExtent == null)
                    rExtent = baseGraphic._extent;
                else {
                    rExtent = rExtent.union(baseGraphic._extent);
                }
            }
            $("#queryshowList").html(innerStr.join(''));


            DCI.SpatialQuery.map.setExtent(rExtent.expand(2));
            DCI.SpatialQuery.map.resize();
            DCI.SpatialQuery.map.reposition();
            //分页工具条        
            $("#querylistpage").PageOperator({
                containerID: "querylistpage",
                count: featureCount,
                pageIndex: DCI.SpatialQuery.pageIndex,
                maxPage: maxpage,
                callback: function (pageIndex) {
                    DCI.SpatialQuery.pageIndex = pageIndex;
                    if (DCI.SpatialQuery.type[0] == "0") {//指定图层的空间查询
                        DCI.SpatialQuery.searchSP(DCI.SpatialQuery.sgeometry);
                    } else if (DCI.SpatialQuery.type[0] == "1") {//所有图层的空间查询
                        DCI.SpatialQuery.searchIdentify(DCI.SpatialQuery.sgeometry);
                    }
                }
            });
        } else {
            alert("搜索不到相关数据");
        }
    },
    //鼠标经过或点击结果列表，改变定位图标
    onPOIMouseOverRecord: function (i, tempID) {
        var graphics = DCI.SpatialQuery.graphicslayer.graphics;
        var grap = null;
        for (var j = 0; j < graphics.length; j++) {
            if (tempID == graphics[j].id) {
                grap = graphics[j];
                break;
            }
        }
        if (grap != null) {
            //判断点线面类型
            switch (grap.geometry.type) {
                case "point":
                    var index = parseInt(i) + 1;
                    var symbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/dw" + index + "x.png", 20, 20);
                    grap.setSymbol(symbol);
                    break;
                case "polyline":
                    var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 1]), 2);
                    grap.setSymbol(symbol);
                    break;
                case "polygon":
                    var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 160, 122, 1]), 1), new dojo.Color([0, 0, 255, 1]));
                    grap.setSymbol(symbol);
                    break;
            }
        }
    },
    //鼠标移开,改变定位图标
    onPOIMouseOutRecord: function (i, tempID) {
        var graphics = DCI.SpatialQuery.graphicslayer.graphics;
        var grap = null;
        for (var j = 0; j < graphics.length; j++) {
            if (tempID == graphics[j].id) {
                grap = graphics[j];
                break;
            }
        }
        if (grap != null) {
            //判断点线面类型
            switch (grap.geometry.type) {
                case "point":
                    var index = parseInt(i) + 1;
                    var symbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/dw" + index + ".png", 20, 20);
                    grap.setSymbol(symbol);
                    break;
                case "polyline":
                    grap.setSymbol(DCI.SpatialQuery.map.lineSymbol);
                    break;
                case "polygon":
                    grap.setSymbol(DCI.SpatialQuery.map.fillSymbol);
                    break;
            }
        }
    },
    //点击查询列表在地图上显示窗口
    toLocation: function (i, tempID, name) {
        var poiName = name;
        var graphics = DCI.SpatialQuery.graphicslayer.graphics;
        var grap = null;
        for (var j = 0; j < graphics.length; j++) {
            if (graphics[j].id == tempID) {
                grap = graphics[j];
                break;
            }
        }
        var zoompoint = null;
        //判断点线面
        if (grap != null) {
            //判断点线面类型
            switch (grap.geometry.type) {
                case "point":
                    zoompoint = grap.geometry;
                    break;
                case "polyline":
                    zoompoint = grap.geometry.getPoint(0, 0);
                    break;
                case "polygon":
                    zoompoint = grap.geometry.getExtent().getCenter();
                    break;
            }
        }
        DCI.SpatialQuery.map.centerAt(zoompoint);
        DCI.SpatialQuery.map.infoWindow.resize(200, 160);
        DCI.SpatialQuery.map.infoWindow.setTitle(grap.attributes.title);
        DCI.SpatialQuery.map.infoWindow.setContent(grap.attributes.content);
        setTimeout(function () {
            DCI.SpatialQuery.map.infoWindow.show(zoompoint);
        }, 500);

    },
    /**
     * 清空
    */
    clear: function () {
        DCI.SpatialQuery.map.graphics.clear();
        DCI.SpatialQuery.graphicslayer.clear();
        DCI.SpatialQuery.orgraphicsLayer.clear();
        DCI.SpatialQuery.map.infoWindow.hide();

    },
    /**
     * 切换到其他模块再回来--默认初始化状态
    */
    InitState: function () {
        //控制显示或隐藏
        DCI.SpatialQuery.clear();
        $("#queryshowList").empty();
        $("#querylistpage").empty();
    },

}