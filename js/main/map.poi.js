if (typeof DCI == "undefined") { var DCI = {}; }

($.fn.PageOperator = function (options) {
    var defaults = {
        containerID: "",                //容器ID
        count: "",                      //总记录数
        pageIndex: "",                  //当前页码
        maxPage: "",                    //最大页码
        width: 254,                     //分页控件的宽度
        callback: null,                 //回调函数
    };

    var opt = $.extend(defaults, options);

    //分页工具条
    var ifDisable_head = false; //是否屏蔽首页及上一页;true:是;false:否.
    var ifDisable_foot = false; //是否屏蔽末页及下一页;true:是;false:否.
    var strArr = new Array();
    strArr.push("<div class='showpage' id='ShowPage'>");
    //strArr.push("<table align=center cellspacing='2' border='0' cellpadding='2' style='width:251px; '>");
    strArr.push("<table align=center cellspacing='2' border='0' cellpadding='2' style='width:" + opt.width + "px;'>");
    strArr.push("<tr><td style='font-size:13px;text-align:center;' align='center' >共");
    strArr.push(opt.count);
    strArr.push("条,当前第");
    strArr.push(parseInt(opt.pageIndex) + 1);
    strArr.push("/");
    strArr.push(opt.maxPage);
    strArr.push("页 ");
    strArr.push(" 转到<select id='pageSelector' style='height:18px;'>");
    for (var n = 1; n <= opt.maxPage; n++) {
        var curIndex = opt.pageIndex + 1;
        if (n == curIndex)
            strArr.push("<option selected='true'>" + n + "</option>");
        else
            strArr.push("<option>" + n + "</option>");
    }
    strArr.push("</select>页</td></tr>");
    if (opt.maxPage == 0) {
        strArr.push("<tr><td align='center'>&nbsp;</td></tr></table>");
    } else {
        ifDisable_head = (opt.pageIndex == 0) ? true : false;
        ifDisable_foot = (opt.pageIndex == opt.maxPage - 1) ? true : false;
        strArr.push("<tr><td align='center' id='pageElement'>");
        strArr.push("<a style='color:black;text-decoration:none;font-size:13px;");
        strArr.push((ifDisable_head ? "color:Gray;'" : "cursor:pointer;' value='0'"));
        strArr.push(">首 页</a>&nbsp;");
        strArr.push("<a style='color:black;text-decoration:none;font-size:13px;");
        strArr.push((ifDisable_head ? "color:Gray;'" : "cursor:pointer;' value='1'"));
        strArr.push(">上一页</a>&nbsp;");
        strArr.push("<a style='color:black;text-decoration:none;font-size:13px;");
        strArr.push((ifDisable_foot ? "color:Gray;'" : "cursor:pointer;' value='2'"));
        strArr.push(">下一页</a>&nbsp;");
        strArr.push("<a style='color:black;text-decoration:none;font-size:13px;");
        strArr.push((ifDisable_foot ? "color:Gray;'" : "cursor:pointer;' value='3'"));
        strArr.push(">末 页</a>");
        strArr.push("</td></tr></table>");
    }
    strArr.push("</div>");
    $("#ShowPage").remove();
    $("#" + opt.containerID).append(strArr.join(''));
    //分页功能实现
    $("#pageElement").bind('click', function (e) {
        if (e.target.tagName == "A") {
            if (opt.callback) {
                switch (e.target.innerText) {
                    case "首 页":
                        if (!ifDisable_head)
                            opt.callback(0);
                        break;
                    case "上一页":
                        if (opt.pageIndex > 0)
                            opt.callback(--opt.pageIndex);
                        break;
                    case "下一页":
                        if (opt.pageIndex < --opt.maxPage)
                            opt.callback(++opt.pageIndex);
                        break;
                    case "末 页":
                        if (!ifDisable_foot)
                            opt.callback(--opt.maxPage);
                        break;
                    default:
                        return;
                        break;
                }
            }
        }
    });
    $("#pageSelector").change(function () {
        var Index = $("#pageSelector").val();
        if (opt.callback) {
            opt.callback(--Index);
        }
    });
})($);

DCI.Poi = {
    //地图搜索界面UI,在js文件以字符串形式拼接，方便js动态调用
    InitHtml:"<div id='list_container' style='margin-top:5px;display:block'>" +
                "<!-- 兴趣点搜索 -->" +
                "<div id='querypage' style='height: 100%; display: block'>" +
                 "<!-- 关键字搜索部分 -->" +
                   "<div class='index_search_box'>" +
                        "<input type='text' id='skeyword' placeholder='请输入内容...'  />" +
                        "<div id='swatchQuery' class='watchQuery' style='margin-top:0px;'></div>" +
                    "</div>" +
                    "<!-- 分类搜索部分 -->" +
                    "<div id='showList_bak' class='left_con'>" +
                        "<div class='blank4'></div>" +
                        "<div class='class-lists-item odd'>" +
                        "<div class='img-list-item food'/><span class='text' name='餐饮'>餐饮</span></div>" +
                        "<div class='class-lists-item even'><div class='img-list-item hotel'/><span class='text' name='住宿'>住宿</span></div>" +
                        "<div class='class-lists-item odd'><div class='img-list-item bank'/><span class='text' name='金融服务'>金融服务</span></div>" +
                        "<div class='class-lists-item even'><div class='img-list-item service'/><span class='text' name='购物'>购物</span></div>" +
                        "<div class='class-lists-item odd'><div class='img-list-item education'/><span class='text' name='科研教育'>科研教育</span></div>" +
                        "<div class='class-lists-item even'><div class='img-list-item hospital'/><span class='text' name='医疗服务'>医疗服务</span></div>" +
                    "</div>" +
               "</div>" +
             "</div>" +
                "<!-- 兴趣点搜索结束符 -->"+
              "<div id='searchlines' class='searchline' style='display:none'><div class='searchline_left' id='listCount'></div><div id='closeQueryResults' class='searchline_rt'>返回</div></div><div id='queryShowList_scrolls' class='Landstock-content'><div id='showLists' style='width:100%;height:100%;margin-left:5px;'></div></div>" +
               "<!-- 搜索结果分页div -->" +
               "<div class='Page-content' id='listpages'></div>",

    map: null,//地图对象
    graphicslayer: null,//显示搜索结果的图层
    isTpyeSearch:false,//识别标志,false表示模糊查询,true表示分类查询
    pageIndex: 0,//起始页
    pageSize: 10,//每页记录数目
	keywordType:null,
    Init: function (map) {
        //从map.js传参进来的map对象,方便在该模块调用
        DCI.Poi.map = map;
        //创建GraphicsLayer图层，用于地图搜索获取结果以点符号形式来展示，叠加在地图上
        DCI.Poi.graphicslayer = new esri.layers.GraphicsLayer();
        //将图层赋给地图
        DCI.Poi.map.addLayer(DCI.Poi.graphicslayer);
        //初始化绑定界面控件事件
        function InitEvent() {
            //模糊查询
            $("#swatchQuery").bind("click", function () {
                var keyword = $("#skeyword").val();
                if (keyword == "" || keyword == undefined) {
                    toastr.error("请输入要查找的内容!");
                    return;
                }
                //动态设置界面状态，搜索查询时，切换到另一个div来显示搜索的结果展示
                DCI.Poi.isShowResearchControl();
                //模糊查询标识
                DCI.Poi.isTpyeSearch = false;
                DCI.Poi.pageIndex = 0;
                //模糊查询
                DCI.Poi.search(keyword, DCI.Poi.pageIndex, DCI.Poi.pageSize);
            });

            //光标进入清除内容
            $("#skeyword").bind('focus', function () {
                $("#skeyword").val("");
            });

            //兴趣点输入框的键盘按下键触发事件
            $("#skeyword").bind("keypress", function (event) {
                if (event.keyCode == "13") {
                    var keyword = $("#skeyword").val();
                    if (keyword == "" || keyword == undefined) {
                        toastr.error("请输入要查找的内容!");
                        return;
                    }
                    DCI.Poi.isTpyeSearch = false;
                    //动态设置界面状态，搜索查询时，切换到另一个div来显示搜索的结果展示
                    DCI.Poi.isShowResearchControl();
                    // 起始页
                    DCI.Poi.pageIndex = 0;
                    //模糊查询
                    DCI.Poi.search(keyword, DCI.Poi.pageIndex, DCI.Poi.pageSize);
                }
            });

            //兴趣点分类点击查询
            $(".class-lists-item span").bind("click", function () {
                //动态设置界面状态，搜索查询时，切换到另一个div来显示搜索的结果展示
                DCI.Poi.isShowResearchControl();
                // 起始页
                DCI.Poi.pageIndex = 0;
                DCI.Poi.keywordType = $(this).attr("name");
                DCI.Poi.isTpyeSearch = true;
                DCI.Poi.search(DCI.Poi.keywordType, DCI.Poi.pageIndex, DCI.Poi.pageSize);//分类查询
            });

            //返回
            $("#closeQueryResults").bind("click", function () {
                //控制显示或隐藏          
                $("#querypage").css({ display: "block" });
                $("#searchlines").css({ display: "none" });
                $("#queryShowList_scrolls").css({ display: "none" });
                $("#listpages").css({ display: "none" });
                DCI.Poi.clearAndhide();               
            });
            //点击弹出气泡窗口的详情
            DCI.Poi.graphicslayer.on("click", function (evt) {
                var grap = evt.graphic;
                var zoompoint = null;
                    zoompoint = grap.geometry;
                DCI.Poi.map.centerAt(zoompoint);
                DCI.Poi.map.infoWindow.resize(150, 100);
                DCI.Poi.map.infoWindow.setTitle(grap.attributes.title);
                DCI.Poi.map.infoWindow.setContent(grap.attributes.content);
                setTimeout(function () {
                    DCI.Poi.map.infoWindow.show(zoompoint);
                }, 500);
            });
        };
        InitEvent();//私有方法可以在函数作用域范围内使用
        //绑定自动补全功能
        DCI.Poi.autoComple("skeyword");
    },


    //========自动补全的实现 为有个input 设置自动补全功能方法================
    autoComple: function (elementID) {
        //elementID ：为其设置自动补全的元素
        $("#" + elementID).autocomplete({
            source: function (request, response) {
                var data = [];//初始化结果数组
                var find = new esri.tasks.FindTask(MapConfig.searchMapUrl + "/");
                var params = new esri.tasks.FindParameters();
                params.layerIds = [0, 1, 2, 3, 4, 5];
                params.searchFields = ["NAME"];
                params.searchText = request.term;
                params.returnGeometry = true;
                find.execute(params, navInfoatuo);
                function navInfoatuo(result) {
                    if (result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            if (i == 10) //不够十条
                                break;
                            data.push(result[i].feature.attributes.NAME);

                        }
                    }
                    response(data);
                }
            },
            response: function (event, ui) {
                // event 是当前事件对象
                // ui对象仅有一个content属性，它表示当前用于显示菜单的数组数据
                // 每个元素都是具有label和value属性的对象
                // 你可以对属性进行更改，从而改变显示的菜单内容
                var sourceData = [];

                for (var i = 0; i < ui.content.length; i++) {
                    var text = ui.content[i].label;
                    if ($(this).context.value) {
                        var tempObj = {
                            label: text.replace(
                        new RegExp("(?![^&;]+;)(?!<[^<>]*)([" + $(this).context.value + "])(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong style=\"color\:#3385ff\"'>$1</strong>"),
                            value: text
                        };
                        ui.content[i] = tempObj;
                    }
                }
            },
            focus: function (event, ui) {
                $(this).val(ui.item.value);
                return false;
            },
            select: function (event, ui) {
                // 这里的this指向当前输入框的DOM元素
                // event参数是事件对象
                // ui对象只有一个item属性，对应数据源中被选中的对象
                $(this).context.value = ui.item.value;
                // 必须阻止事件的默认行为，否则autocomplete默认会把ui.item.value设为输入框的value值
                event.preventDefault();
                //选择下拉框值自动搜索
                $("#swatchQuery").click();
            }
        }).autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li>")
            .append("<a style='font-size:12px;'>" + item.label + "</a>")
            .appendTo(ul);
        };

    },
    isShowResearchControl: function () {
        $("#querypage").css({ display: "none" });
        $("#searchlines").css({ display: "block" });
        $("#queryShowList_scrolls").css({ display: "block" });
        $("#listpages").css({ display: "block" });
    },
    /**
     * 公共的属性查询模块
     * FindTask
     * QueryTask
    */
    search: function (keyword, pageIndex, pageSize) {
        $("#showLists").html('<div class="waitpanel"><img src="' + getRootPath() + 'Content/images/index/poi_loading.gif" /></div>');
        $("#listpages").css({ display: "none" });
            //设置代理请求
            // esriConfig.defaults.io.proxyUrl = getRootPath() + "proxy.ashx";
            // esriConfig.defaults.io.alwaysUseProxy = true;
            if (!DCI.Poi.isTpyeSearch) {//FindTask查询
                var find = new esri.tasks.FindTask(MapConfig.searchMapUrl + "/");//URL
                var params = new esri.tasks.FindParameters();
                params.layerIds = [0,1,2,3,4,5]; //设置查询图层列表
                params.searchFields = ["NAME"]; //设置查询图层的字段,根据NAME字段来模糊查询
                params.searchText = keyword;//设置模糊查询的关键词
                params.returnGeometry = true;//返回空间查询的geometry，方便把返回值结果以图标形式叠加在地图上
                find.execute(params, DCI.Poi.findInfo);
            }
            else {//QueryTask查询
                var typeUrl = "";
                var queryTask = "";
                var query = new esri.tasks.Query();
                query.returnGeometry = true;
                // 需要输出的属性字段
                query.outFields = ["FID","NAME"];
                query.where = "1=1";
                switch (keyword)//判断查询服务
                {
                    case "餐饮":
                        typeUrl = MapConfig.searchMapUrl + "/" + 0;
                        break;
                    case "住宿":
                        typeUrl = MapConfig.searchMapUrl + "/" + 1;
                        break;
                    case "金融服务":
                        typeUrl = MapConfig.searchMapUrl + "/" + 2;
                        break;
                    case "购物":
                        typeUrl = MapConfig.searchMapUrl + "/" + 3;
                        break;
                    case "科研教育":
                        typeUrl = MapConfig.searchMapUrl + "/" + 4;
                        break;
                    case "医疗服务":
                        typeUrl = MapConfig.searchMapUrl + "/" + 5;
                        break;

                }
                queryTask = new esri.tasks.QueryTask(typeUrl);
                queryTask.execute(query, DCI.Poi.navInfo);
            }              
    },
    /**
     * 所有图层的属性查询结果--FindTask
    */
    findInfo: function (results) {
        DCI.Poi.clearAndhide();
        var sms = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/plot/point1.png", 11, 13);
        var innerStr = [];

        var featureCount = results.length;
        //最大的显示页面
        var maxpage = Math.ceil(featureCount / DCI.Poi.pageSize);
        if (results.length > 0) {
            var rExtent = null;
            $("#listpages").css({ display: "block" });
            for (var i = 0; i < DCI.Poi.pageSize; i++) {
                var iId = i + 1;
                var baseGraphicsymbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/dw" + iId + ".png", 25, 25);
                var infactItem = DCI.Poi.pageIndex * DCI.Poi.pageSize + i;
                var tempID = "tempID" + i;
                var pId = "poi_" + iId;
                if (results[infactItem] == undefined) //最后一页没有记录了 跳出循环
                    break;

                var attr = { "title": results[infactItem].feature.attributes.NAME, "content": results[infactItem].feature.attributes.NAME };
                var baseGraphic = new esri.Graphic(results[infactItem].feature.geometry, baseGraphicsymbol, attr);
                baseGraphic.id = tempID;
                DCI.Poi.graphicslayer.add(baseGraphic);

                innerStr.push('<div class="left_list_li_box" onmouseover="DCI.Poi.onPOIMouseOverRecord(' + i + ',\'' + tempID + '\')" onmouseout="DCI.Poi.onPOIMouseOutRecord(' + i + ',\'' + tempID + '\')"  id="' + pId + '">');
                innerStr.push('<div class="left_list_li_box_top">');
                innerStr.push('<div class="left2_box2">');
                innerStr.push('<img class="list_poi_marker" style="" src="' + getRootPath() + 'Content/images/poi/dw' + iId + '.png"></img>');
                innerStr.push('<div class="left_list_li1">');
                innerStr.push('<p>');
                innerStr.push('<a onclick="DCI.Poi.toLocationPOI(' + i + ',\'' + tempID + '\',\'' + results[infactItem].feature.attributes.NAME + '\',\'' +  results[infactItem].feature.attributes.FID + '\')">' + results[infactItem].feature.attributes.NAME + '</a><br/>');
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
            $("#showLists").html(innerStr.join(''));

            DCI.Poi.map.setExtent(rExtent.expand(2));
            DCI.Poi.map.resize();
            DCI.Poi.map.reposition();
            //分页工具条        
            $("#listpages").PageOperator({
                containerID: "listpages",
                count: featureCount,
                pageIndex: DCI.Poi.pageIndex,
                maxPage: maxpage,
                callback: function (pageIndex) {
                    var keyword = $("#skeyword").val();
                    DCI.Poi.pageIndex = pageIndex;
                    DCI.Poi.search(keyword, pageIndex, DCI.Poi.pageSize);
                }
            });
        } else {
            toastr.error("搜索不到相关数据");
        }
    },
    /**
     * 指定图层的属性查询--Query
    */
    navInfo: function (results) {
        DCI.Poi.clearAndhide();
        var sms = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/plot/point1.png", 11, 13);
        var innerStr = [];
        var featureCount = results.features.length;
        //最大的显示页面
        var maxpage = Math.ceil(featureCount / DCI.Poi.pageSize);
        if (results.features.length > 0) {
            var rExtent = null;
            $("#listpages").css({ display: "block" });
            for (var i = 0; i < DCI.Poi.pageSize; i++) {
                var iId = i + 1;
                var baseGraphicsymbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/dw" + iId + ".png", 25, 25);
                var infactItem = DCI.Poi.pageIndex * DCI.Poi.pageSize + i;
                var tempID = "tempID" + i;
                var pId = "poi_" + iId;
                if (results.features[infactItem] == undefined) //最后一页没有记录了 跳出循环
                    break;

                var attr = { "title": results.features[i].attributes.NAME, "content": results.features[i].attributes.NAME };
                var baseGraphic = new esri.Graphic(results.features[infactItem].geometry, baseGraphicsymbol, attr);
                baseGraphic.id = tempID;
                DCI.Poi.graphicslayer.add(baseGraphic);

                innerStr.push('<div class="left_list_li_box" onmouseover="DCI.Poi.onPOIMouseOverRecord(' + i + ',\'' + tempID + '\')" onmouseout="DCI.Poi.onPOIMouseOutRecord(' + i + ',\'' + tempID + '\')"  id="' + pId + '">');
                innerStr.push('<div class="left_list_li_box_top">');
                innerStr.push('<div class="left2_box2">');
                innerStr.push('<img class="list_poi_marker" style="" src="' + getRootPath() + 'Content/images/poi/dw' + iId + '.png"></img>');
                innerStr.push('<div class="left_list_li1">');
                innerStr.push('<p>');
                innerStr.push('<a onclick="DCI.Poi.toLocationPOI(' + i + ',\'' + tempID + '\',\'' + results.features[infactItem].attributes.NAME + '\',\'' +  results.features[infactItem].attributes.FID + '\')">' + results.features[infactItem].attributes.NAME + '</a><br/>');
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
            $("#showLists").html(innerStr.join(''));

            DCI.Poi.map.setExtent(rExtent.expand(2));
            DCI.Poi.map.resize();
            DCI.Poi.map.reposition();
            //分页工具条        
            $("#listpages").PageOperator({
                containerID: "listpages",
                count: featureCount,
                pageIndex: DCI.Poi.pageIndex,
                maxPage: maxpage,
                callback: function (pageIndex) {
                    //var keyword = $("#skeyword").val();
                    DCI.Poi.pageIndex = pageIndex;
                    DCI.Poi.search(DCI.Poi.keywordType, pageIndex, DCI.Poi.pageSize);
                }
            });
        } else {
            toastr.error("搜索不到相关数据");
        }
    },

    //清空和隐藏气泡窗口函数
    clearAndhide: function () {
        if (DCI.Poi.graphicslayer)
            DCI.Poi.graphicslayer.clear();
       
        DCI.Poi.map.infoWindow.hide();

    },
    //点击POI查询列表在地图上显示窗口
    toLocationPOI: function (i, tempID,name,id) {

        //var poiName = name;
        var graphics = DCI.Poi.graphicslayer.graphics;
        var grap = null;
        for (var j = 0; j < graphics.length; j++) {
            if (graphics[j].id == tempID) {
                grap = graphics[j];
                break;
            }
        }
        // 调用后台具体逻辑
        DCI.Poi.getInfoById(id, graphics, grap);
    },
    // 根据id调用后台逻辑
    getInfoById:function(id, graphics, grap){
        debugger;
        $.ajax({
            cache: false,
            type: "POST",
            url: backbasePath + '/apia/v1/arcgis/getInfoById',
            dataType: 'json',
            data: {
                id: id,
            },
            async: true,
            success: function (data) {
                // 将返回的responseText 解析出来
                if (data.code == "000000") {
                    // 后台返回的结果
                    var list = data.data;
                    var zoompoint = null;
                    zoompoint = grap.geometry;
                    DCI.Poi.map.centerAt(zoompoint);
                    DCI.Poi.map.infoWindow.resize(250, 130);
                    DCI.Poi.map.infoWindow.setTitle(list[0].title);
                    var content = '<div class="waitpanel" style="position:relative;top:-21px;left:-54px;"><span>名称：'+list[0].content+'</span></div>';
                    DCI.Poi.map.infoWindow.setContent(content);
                    setTimeout(function () {
                        DCI.Poi.map.infoWindow.show(zoompoint);
                    }, 500);
                }
            },
            error:function(data){
                var result="";
                if(data.msg ==''|| data.msg ==null){
                    result="查询数据报错";
                }else{
                    result =data.msg;
                }
                toastr.error(result);
            }
        });
    },
    //鼠标经过或点击结果列表，改变定位图标
    onPOIMouseOverRecord: function (i, tempID) {
        var graphics = DCI.Poi.graphicslayer.graphics;
        //var grapGeo = null;
        var grap = null;
        for (var j = 0; j < graphics.length; j++) {
            if (tempID == graphics[j].id) {
                grap = graphics[j];
                break;
            }
        }

        if (grap != null) {
            //改变颜色
            var index = parseInt(i) + 1;
            var symbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/dw" + index + "x.png", 25, 25);
            grap.setSymbol(symbol);
        }
    },
    //鼠标移开,改变定位图标
    onPOIMouseOutRecord: function (i, tempID) {
        var graphics = DCI.Poi.graphicslayer.graphics;
        var grap = null;
        for (var j = 0; j < graphics.length; j++) {
            if (tempID == graphics[j].id) {
                grap = graphics[j];
                break;
            }
        }
        if (grap != null) {
            var index = parseInt(i) + 1;
            //改变颜色
            var symbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/dw" + index + ".png", 25, 25);
            grap.setSymbol(symbol);
        }
    },
    /**
     * 切换到其他模块再回来--默认初始化状态
    */
    InitState: function () {
        //控制显示或隐藏
        DCI.Poi.clearAndhide();
    },
    //WKT转换Geometry
    WKTToGeometry: function (type, wkt) {
        var geometry = null;
        switch (type) {
            case "multilinestring":
            case "multiline"://多段线
                var json = "{\"paths\":";
                var lineJson = wkt.replace(/\(/g, "[").replace(/\)/g, "]");
                re = /([\d\.]+)\s([\d\.]+)/g;        // 创建正则表达式模式。
                lineJson = lineJson.replace(re, "[$1,$2]");
                json += lineJson;
                json += ",\"spatialReference\":{\"wkid\":" + DCI.Poi.map.wkid + "}}";
                //json = Ext.decode(json);
                json = jQuery.parseJSON(json);
                geometry = new esri.geometry.Polyline(json);
                break;
            case "line":
            case "linestring":
            case "polyline":
                var json = "{\"paths\":[";
                var lineJson = wkt.replace(/\(/g, "[").replace(/\)/g, "]");
                re = /([\d\.]+)\s([\d\.]+)/g;        // 创建正则表达式模式。
                lineJson = lineJson.replace(re, "[$1,$2]");
                json += lineJson;
                json += "],\"spatialReference\":{\"wkid\":" + DCI.Poi.map.spatialReference.wkid + "}}";
                //json = Ext.decode(json);
                json = jQuery.parseJSON(json);
                geometry = new esri.geometry.Polyline(json);
                break;
            case "point":
                var pointJson = wkt.replace(/\(/g, "[").replace(/\)/g, "]");
                re = /([\d\.]+)\s([\d\.]+)/g;        // 创建正则表达式模式。
                pointJson = pointJson.replace(re, "[$1,$2]");
                pointJson = jQuery.parseJSON(pointJson);
                geometry = new esri.geometry.Point(pointJson[0][0], pointJson[0][1], new esri.SpatialReference(DCI.Poi.map.spatialReference.wkid));
                break;
            case "polygon":
                var json = "{\"rings\":";
                var lineJson = wkt.replace(/\(/g, "[").replace(/\)/g, "]");
                re = /([\d\.]+)\s([\d\.]+)/g;        // 创建正则表达式模式。
                lineJson = lineJson.replace(re, "[$1,$2]");
                json += lineJson;
                json += ",\"spatialReference\":{\"wkid\":" + DCI.Poi.map.wkid + "}}";
                json = jQuery.parseJSON(json);
                geometry = new esri.geometry.Polygon(json);
                break;
            case "multipolygon":
                var json = "{\"rings\":[";
                wkt = wkt.substring(wkt.indexOf("(") + 1, wkt.lastIndexOf(")"));
                var lineJson = wkt.replace(/(\({2})/g, "(");
                lineJson = lineJson.replace(/(\){2})/g, ")");
                var lineJson = lineJson.replace(/\(/g, "[").replace(/\)/g, "]");
                re = /([\d\.]+)\s([\d\.]+)/g;        // 创建正则表达式模式。
                lineJson = lineJson.replace(re, "[$1,$2]");
                json += lineJson;
                json += "],\"spatialReference\":{\"wkid\":" + DCI.Poi.map.wkid + "}}";
                json = jQuery.parseJSON(json);
                geometry = new esri.geometry.Polygon(json);
                break;
            default:
                geometry = null;
        }
        return geometry;
    },
    //Geometry转换WKT
    GeometryToWKT: function (geometry) {
        var wkt = "";
        var wkt = new Array();
        switch (geometry.type) {
            case "point":
                wkt.push("POINT(");
                wkt = DCI.Poi.AppendCoordinate(geometry, wkt);
                wkt.push(")");
                break;
            case "extent":
                wkt.push("POLYGON((");
                wkt = DCI.Poi.AppendExtentText(geometry, wkt);
                wkt.push("))");
                break;
            case "polyline":
                wkt.push("LINESTRING(");
                wkt = DCI.Poi.AppendLineStringText(geometry, wkt);
                wkt.push(")");
                break;
            case "polygon":
                wkt.push("POLYGON((");
                wkt = DCI.Poi.AppendPolygonText(geometry, wkt);
                wkt.push("))");
                break;
            default:
                wkt = "";
        }
        wkt = wkt.join("");
        return wkt;
    },
    AppendCoordinate: function (geometry, wkt) {
        wkt.push(geometry.x.toFixed(2));
        wkt.push(" ");
        wkt.push(geometry.y.toFixed(2));
        return wkt;
    },
    AppendExtentText: function (geometry, wkt) {
        wkt.push(geometry.xmin.toFixed(2));
        wkt.push(" ");
        wkt.push(geometry.ymin.toFixed(2));
        wkt.push(",");
        wkt.push(geometry.xmax.toFixed(2));
        wkt.push(" ");
        wkt.push(geometry.ymin.toFixed(2));
        wkt.push(",");
        wkt.push(geometry.xmax.toFixed(2));
        wkt.push(" ");
        wkt.push(geometry.ymax.toFixed(2));
        wkt.push(",");
        wkt.push(geometry.xmin.toFixed(2));
        wkt.push(" ");
        wkt.push(geometry.ymax.toFixed(2));
        wkt.push(",");
        wkt.push(geometry.xmin.toFixed(2));
        wkt.push(" ");
        wkt.push(geometry.ymin.toFixed(2));
        return wkt;
    },
    AppendLineStringText: function (geometry, wkt) {
        if (geometry.paths.length == 1) {
            var path = geometry.paths[0];
            for (var i = 0; i < path.length; i++) {
                wkt.push(path[i][0].toFixed(2));
                wkt.push(" ");
                wkt.push(path[i][1].toFixed(2));
                if (i + 1 < path.length)
                    wkt.push(",");
            }
        }
        return wkt;
    },
    AppendPolygonText: function (geometry, wkt) {
        if (geometry.rings.length == 1) {
            var ring = geometry.rings[0];
            for (var i = 0; i < ring.length; i++) {
                wkt.push(ring[i][0].toFixed(2));
                wkt.push(" ");
                wkt.push(ring[i][1].toFixed(2));
                if (i + 1 < ring.length)
                    wkt.push(",");
            }
        }
        return wkt;
    },
    //查询结果为空或是返回的数据无法处理的情况
    addSearchErrorPage: function (id) {
        $("#" + id).html('<div class="left_list_li_box"><img src="' + getRootPath() + 'Content/images/index/noData.png" class="list_errorimg"/><p>没有查询到结果！</p></div>');
    },
    //网络服务不可用：500
    addServerDisablePage: function (id) {
        $("#" + id).html('<div class="left_list_li_box"><img src="' + getRootPath() + 'Content/images/poi/poiMistake.png"/>网络繁忙，请稍候再试！</div>');
    },


}