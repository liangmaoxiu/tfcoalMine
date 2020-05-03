if (typeof DCI == "undefined") { var DCI = {}; }
DCI.map2dTool = {
    map: null,
    is_initialize: null,
    isLegend: false,//判断图例控件标识
    drawtool: null,
    onDrawEnd: null,
    dialog: null,//对话框
    toolbar2dHtml: "<div class='alright_top_rt'>" +
            "<ul>" +
               "<li class='zoomOut' id='zoomOut'><a href='javascript:void(0)' class='zoomOutbg'><span class='zoomOutlabel'></span>放大</a></li>" +
               "<li class='publine'></li>" +
               "<li class='zoomIn' id='zoomIn'><a href='javascript:void(0)' class='zoomInbg'><span class='zoomInlabel'></span>缩小</a></li>" +
               "<li class='publine'></li>" +
               "<li class='panMove' id='panMove'><a href='javascript:void(0)' class='panMovebg'><span class='panMovelabel'></span>漫游</a></li>" +
               "<li class='publine'></li>" +
		       "<li class='PlotlTool' id='bPlot'><a href='javascript:void(0);' class='Pointbg'><span class='Plotlabel'></span>态势标绘</a></li>" +
		       "<li class='publine'></li>" +
		       "<li class='legend' id='legend'><a href='javascript:void(0);' class='legendbg'><span class='legendlabel'></span>图例</a></li>" +
		       "<li class='publine'></li>" +
                "<li class='tool' id='tLi'>" +
                    "<a href='javascript:void(0)' class='toolbg' id='toolType'><span class='toollabel'></span>工具</a><span class='raang_more' id='toolCur'></span>" +
                    "<ul style='display: none;' id='toolDiv'>" +
                        "<li id='bMeasureLine'><a href='javascript:void(0)'><span class='toolcjlabel'></span>测距</a></li>" +
                        "<li id='bMeasureArea'><a href='javascript:void(0)'><span class='toolcmlabel'></span>测面</a></li>" +
                     "</ul>" +
                "</li>" +
                "<li class='publine'></li>" +
                "<li class='delete' id='bClear'><a href='javascript:void(0);' class='deletebg'><span class='dellabel'></span>清空</a></li>" +
                "<li class='publine'></li>" +
                "<li class='mapcompare' id='mapCompare'>" +
                                        "<a href='javascript:void(0)' class='mapcomparebg' id='mapcompareType'><span class='mapcomparelabel'></span>地图对比</a><span class='raang_more' id='toolCur'></span>" +
                                        "<ul style='display: none;' id='mapcompareDiv'>" +
                                            "<li id='one-screen'><a href='javascript:void(0)'><span class='mapcomparelabel'></span>单屏</a></li>" +
                                            "<li id='two-screen'><a href='javascript:void(0)'><span class='mapcomparelabel'></span>二屏</a></li>" +
                                         "</ul>" +
                "</li>"+
            "</ul>" +
        "</div>",
    InitTool: function (map) {
        //初始化量算工具
        DCI.Measure.Init(map);
        var T = this;
        this.map = map;
        DCI.map2dTool.drawtool = new esri.toolbars.Draw(map);
        DCI.map2dTool.drawtool.on("draw-end", DCI.map2dTool.addToMap);
        DCI.map2dTool.drawtool.fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 160, 122]), 2), new dojo.Color([255, 255, 255, 0.5]));
        //加载工具栏
        var child = $("#tool_container").children();
        if (child.length > 0) {
            child.remove();
        }
        $("#tool_container").append(DCI.map2dTool.toolbar2dHtml);
        $("#tLi").bind("mouseover", function () {
            $("#toolDiv").show();
        });
        $("#tLi").bind("mouseout", function () {
            $("#toolDiv").hide();
        });
        //测距
        $("#bMeasureLine").click(function () {
            DCI.Measure.measureDistance();
        });

        //测面积
        $("#bMeasureArea").click(function () {
            DCI.Measure.measureArea();
        });
        //清除
        $("#bClear").click(function () {
            map.graphics.clear();
            for (var i = 0; i < map.graphicsLayerIds.length; i++) {
                var layer = map.getLayer(map.graphicsLayerIds[i]);
                layer.clear();
            }
            map.infoWindow.hide();
        });
        //放大缩小
        $("#zoomOut").click(function () {
            map.setMapCursor("url('" + getRootPath() + "Content/images/index/cursor/zoomin.cur'),auto");
            DCI.map2dTool.drawtool.activate(esri.toolbars.Draw.EXTENT);
            DCI.map2dTool.drawExtent(null, function (geometry) {
                DCI.map2dTool.zoomInByExtent(geometry);
            });
        });
        $("#zoomIn").click(function () {
            map.setMapCursor("url('" + getRootPath() + "Content/images/index/cursor/zoomout.cur'),auto");
            DCI.map2dTool.drawtool.activate(esri.toolbars.Draw.EXTENT);
            DCI.map2dTool.drawExtent(null, function (geometry) {
                DCI.map2dTool.zoomOutByExtent(geometry);
            });
        });

        //漫游
        $("#panMove").click(function () {
            DCI.map2dTool.drawtool.deactivate();
            map.setMapCursor("auto");
            map.enablePan();
        });
        //态势标绘
        $("#bPlot").click(function () {
            //初始化军势标绘接口
            if (!DCI.Plot.isload)
                DCI.Plot.Init(map);
            if (DCI.Plot.dialog)
                DCI.Plot.dialog.close();
            DCI.Plot.dialog = jDialog.dialog({
                title: '态势标绘',
                width: 370,
                height: 200,
                left: 450,
                top: 200,
                modal: false, // 非模态，即不显示遮罩层
                content: DCI.Plot.Html
            });
            DCI.Plot.InitEvent();

        });
        //地图对比
        $("#mapCompare").bind("mouseenter", function () {
            if (!DCI.map2dTool.is_initialize) {//地图对比分屏,初始化加载一次
                DCI.SplitScreen.initialize(map);
                DCI.map2dTool.is_initialize = true;
            }
            $("#mapcompareDiv").show();
        });
        $("#mapCompare").bind("mouseleave", function () { $("#mapcompareDiv").hide(); });
        //地图对比
        $("#mapcompareDiv li").click(function () {
            switch ($(this).index()) {
                case 0://单屏
                    $("#centerPanel").removeClass("map_two");
                    DCI.SplitScreen.splitMap('splitOne');
                    $("#toolBar").show();
                    break;
                case 1://二屏     
                    //动态设置二屏高度
                    var mainmapheight = $("#map").css("height");
                    $("#map-two").css("height", mainmapheight);
                    $("#centerPanel").addClass("map_two");
                    DCI.SplitScreen.splitMap('splitTwo');
                    $("#toolBar").hide();
                    break;
                default:
            }
        });
        //图例
        $("#legend").click(function () {
            if (!DCI.map2dTool.isLegend) {
                DCI.map2dTool.showLegend();
                DCI.map2dTool.isLegend = true;
            }
            else {
                DCI.map2dTool.hideLegend();
                DCI.map2dTool.isLegend = false;
            }
        });


    },
    showLegend:function(){
        $(".mapLegend").show();
    },
    hideLegend: function () {
        $(".mapLegend").hide();
    },
    addToMap: function (evt) {
        DCI.map2dTool.onDrawEnd(evt.geometry);
    },
    drawExtent: function (symbol, onDrawEnd) {
        DCI.map2dTool.onDrawEnd = onDrawEnd;
    },
    //根据拉框范围放大
    zoomInByExtent: function (geometry) {
        DCI.map2dTool.map.setExtent(geometry.getExtent());
    },
    //根据拉框范围缩小
    zoomOutByExtent: function (geometry) {
        if (geometry.xmin != geometry.xmax && geometry.ymin != geometry.ymax) {
            var currExtent = DCI.map2dTool.map.extent;
            var currWidth = Math.abs(currExtent.xmin - currExtent.xmax);
            var boxWidth = Math.abs(geometry.xmin - geometry.xmax);
            var widthFactor = currWidth / boxWidth;

            var currHeight = Math.abs(currExtent.ymin - currExtent.ymax);
            var boxHeight = Math.abs(geometry.ymin - geometry.ymax);
            var heightFactor = currHeight / boxHeight;

            if (widthFactor >= heightFactor) {
                currExtent = currExtent.expand(widthFactor);
            } else {
                currExtent = currExtent.expand(heightFactor);
            }
            DCI.map2dTool.map.setExtent(currExtent);
        } else {
            if (parseInt(DCI.map2dTool.map.getLevel()) > 0) {
                DCI.map2dTool.map.setLevel(parseInt(DCI.map2dTool.map.getLevel()) - 1);
            }
        }
    },


}
