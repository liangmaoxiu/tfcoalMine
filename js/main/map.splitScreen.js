if (typeof DCI == "undefined") { var DCI = {}; }
DCI.SplitScreen = {

    resizeTimer: null,
    eventTimer: null,
    json: [],
    is_baseMap: false,//记录电子地图是否存在的标识
    /*分屏标识*/
    preSplit: null,
    /*map的目的元素*/
    mapContainer: {
        containerOne: null,
        containerTwo: null,
    },
    /*map对象*/
    objMap: {
        mapOne: null,
        mapTwo: null,
    },
    initialize: function (map) {

        DCI.SplitScreen.mapContainer.containerOne = 'map';
        DCI.SplitScreen.mapContainer.containerTwo = 'map-two';
        //用于标识状态
        DCI.SplitScreen.preSplit = 'one';
        DCI.SplitScreen.objMap.mapOne = map;
        DCI.SplitScreen.loadLayerList();

    },
    /*map元素的下拉框div*/
    creatElement: function () {
        for (obj in DCI.SplitScreen.mapContainer) {
            if (DCI.SplitScreen.mapContainer[obj] && DCI.SplitScreen.mapContainer[obj] != DCI.SplitScreen.mapContainer.containerOne) { //主屏地图不加载select控件切换底图
                var selectHtml = "<select id='select_" + obj + "' style='font-size:13px;'></select>";
                this.elem = document.createElement('div');
                this.elem.setAttribute("class", "map_combobox_" + obj);
                document.getElementById(DCI.SplitScreen.mapContainer[obj]).appendChild(this.elem.cloneNode());
                $(".map_combobox_" + obj).append(selectHtml);
                //加载select图层数据源
                var objselect = document.getElementById('select_' + obj);
                for (var i = 0; i < DCI.SplitScreen.json.length; i++) {
                    objselect.options.add(new Option(DCI.SplitScreen.json[i][0], DCI.SplitScreen.json[i][1])); //这个兼容IE与firefox谷歌 
                    if (objselect.options[i].value.toLowerCase() == MapConfig.arcvecMap.Url.toLowerCase()) {
                        objselect.options[i].selected = true;
                        DCI.SplitScreen.is_baseMap = true;
                        //break;
                    }
                }
                //如果电子地图的底图不存在,则补充上去
                if (!DCI.SplitScreen.is_baseMap) {
                    objselect.options.add(new Option("电子地图", MapConfig.arcvecMap.Url), 0); //这个兼容IE与firefox谷歌 
                    $('#select_' + obj).val(MapConfig.arcvecMap.Url);
                }
                //触发select选择监听事件
                $('#select_' + obj).change(function () {
                    if (this.id.indexOf("One") > 0) {
                        DCI.SplitScreen.setMapState(DCI.SplitScreen.objMap.mapOne, $(this).children('option:selected').val());
                    }
                    else if (this.id.indexOf("Two") > 0) {
                        DCI.SplitScreen.setMapState(DCI.SplitScreen.objMap.mapTwo, $(this).children('option:selected').val());
                    }

                });
            }
        }

    },
    /*加载图层列表*/
    loadLayerList: function () {
        //设置下拉框的地图图层列表数组
        DCI.SplitScreen.json.push(["电子地图", MapConfig.arcvecMap.Url]);
    },
    /*初始化地图*/
    _getNewMap: function (options) {
        var map;
        if (options.container == "map") {
            return;
        } else {
            map = new esri.Map(options.container, { logo: false, lods: MapConfig.mapInitParams.lods, slider: false });//创建一个map对象，然后地图填充在div容器，通过div的ID（map）来关联;{}里面是构造地图的可选参数设置，logo设置图标是否显示，lods是设置瓦片地图的显示级别level有哪些，从配置文件config获取
            var layer = new esri.layers.ArcGISTiledMapServiceLayer(MapConfig.arcvecMap.Url);//创建一个ArcGISTiledMapServiceLayer对象，解析arcgis的瓦片服务图层；MapConfig.arcvecMap.Url是layer对象的参数，请求发布地图服务的url，用来获取地图服务的数据来渲染
            layer.id = "baseimg";//layer的id，用来方便后面获取getLayer（id)图层
            map.addLayer(layer);//layer添加到地图map对象
            var centerPt = DCI.SplitScreen.objMap.mapOne.extent.getCenter();
            var mapZoom = DCI.SplitScreen.objMap.mapOne.getZoom();
            map.centerAndZoom(centerPt, mapZoom);
            
        }
        return map;
    },
    /*公有方法，调用分屏*/
    splitMap: function (splitNum) {
        switch (splitNum) {
            case 'splitOne':
                if (DCI.SplitScreen.preSplit == "one") return;
                DCI.SplitScreen.preSplit = "one";
                this._clearMap("splitOne");
                break;
            case 'splitTwo':
                if (DCI.SplitScreen.preSplit == "two") return;
                DCI.SplitScreen.preSplit = "two";
                this._clearMap("splitTwo");
                this._crearMapObj('two');
                break;
        }

        //地图复位
        DCI.SplitScreen.repositionMap();
        if (splitNum == "splitOne") return;
        this._addclickEvent();
        //加载地图的下拉框控件
        DCI.SplitScreen.creatElement();

    },
    //复位地图
    repositionMap: function () {
        clearTimeout(this.resizeTimer);
        //创建新resize Timer，让它延迟0.6秒触发
        DCI.SplitScreen.resizeTimer = setTimeout(function () {
            for (obj in DCI.SplitScreen.objMap) {
                if (DCI.SplitScreen.objMap[obj] != null) {
                    DCI.SplitScreen.objMap[obj].resize();
                    DCI.SplitScreen.objMap[obj].reposition();                   
                    DCI.SplitScreen.objMap[obj].setExtent(DCI.SplitScreen.objMap.mapOne.extent);
                }
            }
        }, 700);
    },
    /*添加事件*/
    _addclickEvent: function () {
        if (DCI.SplitScreen.objMap.mapOne && !DCI.SplitScreen.clickOne) {
            DCI.SplitScreen.mapOne_handle = DCI.SplitScreen.objMap.mapOne.on('extent-change', DCI.SplitScreen._extentchangeEvent);
            DCI.SplitScreen.mapOne_movehandle = DCI.SplitScreen.objMap.mapOne.on('mouse-move', DCI.SplitScreen._moveEvent);
            DCI.SplitScreen.clickOne = true;
        }
        if (DCI.SplitScreen.objMap.mapTwo && !DCI.SplitScreen.clickTwo) {
            DCI.SplitScreen.mapTwo_handle = DCI.SplitScreen.objMap.mapTwo.on('extent-change', DCI.SplitScreen._extentchangeEvent);
            DCI.SplitScreen.mapTwo_movehandle = DCI.SplitScreen.objMap.mapTwo.on('mouse-move', DCI.SplitScreen._moveEvent);
            DCI.SplitScreen.clickTwo = true;
        }
    },
    // 清除Extentchange事件监听
    clearExtentchange: function () {
        if (DCI.SplitScreen.mapOne_handle)
            DCI.SplitScreen.mapOne_handle.remove();
        if (DCI.SplitScreen.mapTwo_handle)
            DCI.SplitScreen.mapTwo_handle.remove();
    },
    // 清除mousemove事件监听
    clearMousemove: function () {
        if (DCI.SplitScreen.mapOne_movehandle)
            DCI.SplitScreen.mapOne_movehandle.remove();
        if (DCI.SplitScreen.mapTwo_movehandle)
            DCI.SplitScreen.mapTwo_movehandle.remove();
    },
    // 添加Extentchange事件监听
    addEvent: function () {
        if (DCI.SplitScreen.objMap.mapOne)
            DCI.SplitScreen.mapOne_handle = DCI.SplitScreen.objMap.mapOne.on('extent-change', DCI.SplitScreen._extentchangeEvent);
        if (DCI.SplitScreen.objMap.mapTwo)
            DCI.SplitScreen.mapTwo_handle = DCI.SplitScreen.objMap.mapTwo.on('extent-change', DCI.SplitScreen._extentchangeEvent);
    },
    /*地图监听事件handle*/
    mapOne_handle: null,
    mapTwo_handle: null,
    mapOne_movehandle: null,
    mapTwo_movehandle: null,
    /*判断分屏切换时候地图的监听事件是否被激活过标识*/
    clickOne: null,
    clickTwo: null,
    _extentchangeEvent: function (evt) {
        var map = this;
        var extent = evt.extent;
        var mapZoom = map.getZoom();
        DCI.SplitScreen.mapSerView({ extent: extent, zoom: mapZoom, map: map });
    },
    _moveEvent: function (evt) {
        var symbol = new esri.symbol.PictureMarkerSymbol();
        symbol.url = getRootPath() + "Content/images/index/c.png";
        symbol.width = 12;
        symbol.height = 17;
        for (obj in DCI.SplitScreen.objMap) {
            if (DCI.SplitScreen.objMap[obj] && DCI.SplitScreen.objMap[obj]) {
                var gra = DCI.SplitScreen.getCurGraphic(DCI.SplitScreen.objMap[obj].graphics.graphics);
                if (gra)
                    DCI.SplitScreen.objMap[obj].graphics.remove(gra);
                if (DCI.SplitScreen.objMap[obj] == this) {
                    continue;
                }
                var attr = { "title": "cur" };
                var graphic = new esri.Graphic(evt.mapPoint, symbol, attr);
                DCI.SplitScreen.objMap[obj].graphics.add(graphic);
            }
        }
    },
    //获取光标的graphic
    getCurGraphic:function(graphics){
        for (var i = 0; i < graphics.length; i++) {
            if (graphics[i].attributes && graphics[i].attributes.title == "cur")
            {
                return graphics[i];
            }
        }
        return null;
    },
    //清空所有的graphics
    cleargraphics: function () {
        for (obj in DCI.SplitScreen.objMap) {
            if (DCI.SplitScreen.objMap[obj] && DCI.SplitScreen.objMap[obj]) {
                DCI.SplitScreen.objMap[obj].graphics.clear();
            }
        }
    },
    // 设置map的bounds
    mapSerView: function (options) {
        for (obj in DCI.SplitScreen.objMap) {
            if (DCI.SplitScreen.objMap[obj] && DCI.SplitScreen.objMap[obj]) {
                if (DCI.SplitScreen.objMap[obj] == options.map) {
                    continue;
                }
                if (Math.abs(options.extent.xmin - DCI.SplitScreen.objMap[obj].extent.xmin) > 0.0001 ||
                Math.abs(options.extent.ymin - DCI.SplitScreen.objMap[obj].extent.ymin) > 0.0001) {
                    DCI.SplitScreen.objMap[obj].centerAndZoom(options.extent.getCenter(), options.zoom);
                }
            }
        }
        DCI.SplitScreen.clearExtentchange();
        clearTimeout(this.eventTimer);
        //创建新resize Timer，让它延迟0.4秒触发
        DCI.SplitScreen.eventTimer = setTimeout(function () {
            DCI.SplitScreen.addEvent();
        }, 400);
    },
    //实例化map对象
    _crearMapObj: function (splitNun) {
        var two = false;
        switch (splitNun) {
            case 'two':
                two = true;
                break;
        }
        if (!DCI.SplitScreen.objMap.mapTwo && two) {
            DCI.SplitScreen.objMap.mapTwo = this._getNewMap({ container: DCI.SplitScreen.mapContainer.containerTwo });
        }
    },
    /*设置地图的加载状态*/
    setMapState: function (obj, url) {
        var curLyr = new esri.layers.ArcGISTiledMapServiceLayer(url, { id: "splitBaseMapID"});
        var centerPt = DCI.SplitScreen.objMap.mapOne.extent.getCenter();
        var mapZoom = DCI.SplitScreen.objMap.mapOne.getZoom();
        obj.removeAllLayers();
        obj.addLayer(curLyr, 0);
        obj.centerAndZoom(centerPt, mapZoom);
    },
    /*清除之前分屏的状态*/
    _clearMap: function (split) {
        switch (split) {
            case 'splitOne':
                DCI.SplitScreen.cleargraphics();
                break;
            default:
                break;
        }
        DCI.SplitScreen.clickOne = false;
        DCI.SplitScreen.clickTwo = false;
        for (obj in DCI.SplitScreen.objMap) {
            if (DCI.SplitScreen.objMap[obj] && DCI.SplitScreen.objMap[obj] && DCI.SplitScreen.objMap[obj] != DCI.SplitScreen.objMap.mapOne) {
                DCI.SplitScreen.objMap[obj].destroy();
                DCI.SplitScreen.objMap[obj] = null;
            }
        }

        $(".map_combobox_containerOne").remove();
        $("#" + DCI.SplitScreen.mapContainer.containerTwo).children().remove();
        DCI.SplitScreen.clearExtentchange();
        DCI.SplitScreen.clearMousemove();
    }



}
