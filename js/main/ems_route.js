if (typeof ems == "undefined") { var ems = {}; }
/**
 * 路径分析公共模板
 */  
ems.route = {
		map:null,
		graphicslayer:null,
		incidentsGraphicsLayer:null,
		facilitiesGraphicsLayer:null,
		routeGraphicLayer:null,
		closestFacilityTask:null,
		params:null,
		closestFacilityTask:null,
		isload:false,
		intervalId:null,
        dialog:null,
        wholedialog: null,
        drawtool: null,
        pageIndex: 0,
        pageSize: 10,
        sgeometry:null,
        accidentPosition: {//默认事故对象模版
            eventName: "xx仓库气体泄漏",
            ocrTime: "2016-8-4 13:54",
            x: "",
            y: ""
        },
        html: "<div class='route_serch_left'>" +
              "<span>点击地图：</span>" +
              '<input  value="" type="text" style="width:130px;height:27px" id="pointTxt">' +
              "<input type='button' class='route_point' id='point' style='float:right;'>" +
              "</div>"+
              "<div class='route_serch_left'>" +
              "<span>分析半径：</span>" +
              '<input id="radius" value="1000" type="number" style="width:100px;height:27px"> 米' +
              '<button class="btn btn-default btn-xs" id="analysis"  style="margin-left:5px;height:25px;">查询</button>' +
              "</div>"+
           "<!-- 空间查询获取结果显示 -->" +
           "<div>" +
              "<div id='queryShowList_scrollroute' class='spatialquery-content' style='margin-top: 30px;'>" +
                 "<div id='queryshowListroute' style='width:100%;height:100%;margin-left:2px;'></div>" +
              "</div>" +
           "</div>" +
           "<!-- 搜索结果分页div -->" +
           "<div class='Page-content' id='querylistpageroute'></div>",
		//模块初始化函数
		Init:function(map){
			ems.route.map = map;
			ems.route.isload = true;
			//初始化事故点以及应急资源图层
			ems.route.params = new esri.tasks.ClosestFacilityParameters();      
			ems.route.params.defaultCutoff= 7.0;
			ems.route.params.defaultTargetFacilityCount = 6.0;
			ems.route.params.returnFacilities=true;
			ems.route.params.returnIncidents=true;
			ems.route.params.returnRoutes=true;
			ems.route.params.returnDirections=true;
			ems.route.closestFacilityTask = new esri.tasks.ClosestFacilityTask(MapConfig.routeUrl);

			ems.route.bufferLayer = new esri.layers.GraphicsLayer();
			ems.route.map.addLayer(ems.route.bufferLayer);//将图层赋给地图
			//道路图层
			//var routePolylineSymbol = new esri.symbols.SimpleLineSymbol(
			//		esri.symbols.SimpleLineSymbol.STYLE_SOLID, 
			//          new esri.Color([255,255,4]), 
			//          6.0
		    //        );
			var routePolylineSymbol = new esri.symbols.SimpleLineSymbol(
					esri.symbols.SimpleLineSymbol.STYLE_SOLID,
			          new esri.Color([0, 255, 0]),
			          6.0
			        );
			ems.route.routeGraphicLayer = new esri.layers.GraphicsLayer();
			ems.route.routeGraphicLayer.id = "routeGraphicLayer";
			var routeRenderer = new esri.renderers.SimpleRenderer(routePolylineSymbol);
			ems.route.routeGraphicLayer.setRenderer(routeRenderer);
			ems.route.map.addLayer(ems.route.routeGraphicLayer);  //将图层赋给地图

			//事故点图层
			var incidentPointSymbol = new esri.symbols.SimpleMarkerSymbol(esri.symbols.SimpleMarkerSymbol.STYLE_CIRCLE, 15,
					new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID,
							new esri.Color([255,0,0]), 1),
							new esri.Color([255,0,0,1]));  
			ems.route.incidentsGraphicsLayer = new esri.layers.GraphicsLayer();
			ems.route.incidentsGraphicsLayer.id = "incidentsGraphicsLayer";
			var incidentsRenderer = new esri.renderers.SimpleRenderer(incidentPointSymbol);
			ems.route.incidentsGraphicsLayer.setRenderer(incidentsRenderer);
			ems.route.map.addLayer(ems.route.incidentsGraphicsLayer);  //将图层赋给地图
			//ems.route.incidentsGraphicsLayer.hide();
			//应急资源图层
			var facilityPointSymbol = new esri.symbols.SimpleMarkerSymbol(esri.symbols.SimpleMarkerSymbol.STYLE_CIRCLE, 15,
					new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID,
							new esri.Color([0,0,255]), 1),
							new esri.Color([0,0,255,1]));
			ems.route.facilitiesGraphicsLayer = new esri.layers.GraphicsLayer();
			ems.route.facilitiesGraphicsLayer.id = "facilitiesGraphicsLayer";
			var facilityRenderer = new esri.renderers.SimpleRenderer(facilityPointSymbol);
			ems.route.facilitiesGraphicsLayer.setRenderer(facilityRenderer);
			ems.route.map.addLayer(ems.route.facilitiesGraphicsLayer);  //将图层赋给地图	
			ems.route.facilitiesGraphicsLayer.hide();
			ems.route.facilitiesGraphicsLayer.on("click", function(evt){
				var htmlstr = "<div class='monitorinforwin_Container' style='width: 330px;border: 0.5px solid #ABADCE;' id='inforwin_Container'>"+
				"<div class='syn_tit' style='border-bottom: 1px solid #C6CBCE;'>"+
				"<span style='margin-left: 5px;'>"+evt.graphic.attributes.Name+"</span>"+
				   "<div id='infoClose' class='closeButton' style='margin-right: 4px;'></div>"+
				"</div>"+

				"<div class='route_tit'>";
				htmlstr +="<label>数量:</label><label>" + evt.graphic.attributes.num + "</label></br>";
				htmlstr +="<label>用途:</label><label>" + evt.graphic.attributes.route + "</label></br>";
				htmlstr +="<label>类型:</label><label>" + evt.graphic.attributes.size + "</label></br>";
				//htmlstr +="<label>编号:</label><label>" + evt.graphic.attributes.ID + "</label></br>";
				htmlstr +="</div>"+	                	   
				"<div style='border-top: 1px solid #C6CBCE;height:40px;' class='route_tit'>"+
				"<button id='routeInfoButton' style='height:28px;width:90px;float:right;margin-right:5px;margin-top:5px' class='btn btn-default btn-sm' ><i style='margin-right:3px' class='glyphicon glyphicon-search'></i>路线详情</button>"+				
				"</div>"+

				"</div>";
				//var pt = new esri.geometry.Point(array [0],array [1],ems.route.map.spatialReference);
				var pt = evt.mapPoint;
                ems.route.map.infoWindow.resize(350, 200);
                ems.route.map.infoWindow.setContent(htmlstr);
                setTimeout(function () {
                	ems.route.map.infoWindow.show(pt);
                }, 500);
                $("#infoClose").click(function () {
                	ems.route.map.infoWindow.hide();
                });
                //救援路线详情
                $("#routeInfoButton").click(function () {
                	//ems.route.id = evt.graphic.attributes.ID;
                    //点击的资源
    				ems.route.initState();
                	var resources = [];
                	var resource = {};
                	resource.name = evt.graphic.attributes.Name;
                	resource.num = evt.graphic.attributes.num;
                	resource.route = evt.graphic.attributes.route;
                	resource.size = evt.graphic.attributes.size;
                	resource.x = evt.graphic.geometry.x;
                	resource.y = evt.graphic.geometry.y;
                	resources.push(resource);
                	//执行一对一两点的救援路径
					ems.route.InitRoute(ems.drill.accidentPosition,resources,1);
                });	
                
			});
			//底图图层
		    //var highlightSymbol = new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0,255,255],1), 6.5);
			//var highlightSymbol = new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0, 255, 255]), 6.5);
			var highlightSymbol = new esri.symbols.SimpleLineSymbol(
					esri.symbols.SimpleLineSymbol.STYLE_SOLID,
			          new esri.Color([255, 255, 4]),
			          6.0
			        );
			ems.route.graphicslayer = new esri.layers.GraphicsLayer();
			ems.route.graphicslayer.id = "route";
			var baseRenderer = new esri.renderers.SimpleRenderer(highlightSymbol);
			ems.route.graphicslayer.setRenderer(baseRenderer);
			ems.route.map.addLayer(ems.route.graphicslayer);  //将图层赋给地图
			//车辆图层
			ems.route.carGraphicslayer = new esri.layers.GraphicsLayer();
			ems.route.carGraphicslayer.id = "ems_car";
			ems.route.map.addLayer(ems.route.carGraphicslayer);  //将图层赋给地图

			ems.route.pointlayer = new esri.layers.GraphicsLayer();
			ems.route.map.addLayer(ems.route.pointlayer);//将图层赋给地图
			ems.route.drawtool = new esri.toolbars.Draw(map, { showTooltips: true });
			ems.route.drawtool.on("draw-end", ems.route.addToMap);
		    //起点位置添加事件
			$("#point").bind("click", function (event) {
			    if (ems.route.dialog)
			        ems.route.dialog.close();
			    if (ems.route.wholedialog)
			        ems.route.wholedialog.close();
			    ems.route.incidentsGraphicsLayer.clear();
			    ems.route.routeGraphicLayer.clear();
			    ems.route.bufferLayer.clear();
			    ems.route.graphicslayer.clear();
			    ems.route.pointlayer.clear();
			    ems.route.carGraphicslayer.clear();
			    $("#queryshowListroute").empty();
			    $("#querylistpageroute").empty();

			    $("#pointTxt").val("");
			    ems.route.map.setMapCursor('crosshair');
			    ems.route.drawtool.activate(esri.toolbars.Draw.POINT);
			})
		    //查询
			$("#analysis").bind("click", function (event) {
			    ems.route.map.infoWindow.hide();
			    ems.route.bufferLayer.clear();
			    var radius = $("#radius").val();
			    if (radius.toString().trim().length > 0) {
			        var point = new esri.geometry.Point(ems.route.accidentPosition.x, ems.route.accidentPosition.y, ems.route.map.spatialReference);
			        //定义要画的图形的线条颜色68, 97, 157
			        var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([68, 97, 157, 0.3]));
			        var circle = new esri.geometry.Circle({
			            center: point,
			            geodesic: false,
			            radius: radius
			        });
			        var graphic = new esri.Graphic(circle, symbol);
			        ems.route.bufferLayer.add(graphic);
			        ems.route.map.setExtent(graphic._extent.expand(1.5));
			        ems.route.pageIndex = 0;
			        ems.route.sgeometry = graphic.geometry;
			        ems.route.searchSP(graphic.geometry);
			    } else { return; }
			})
			
		},
       /*
        *根据坐标点获取地名
        */
		addToMap: function (evt) {
		    var stopSymbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/poiLocation.png", 30, 30);
		    var graphic = new esri.Graphic(evt.geometry, stopSymbol);
		    ems.route.incidentsGraphicsLayer.add(graphic);
		    ems.route.drawtool.deactivate();
		    ems.route.map.setMapCursor('auto');
		    ems.route.accidentPosition.x = evt.geometry.x;
		    ems.route.accidentPosition.y = evt.geometry.y;
		    $("#pointTxt").val(evt.geometry.x.toFixed(3) + "," + evt.geometry.y.toFixed(3));
		},
    /**
     * 指定图层的空间查询--Query
    */
		searchSP: function (geometry) {
		    var queryTask = new esri.tasks.QueryTask(MapConfig.searchMapUrl + "/" + 0);//URL
		    var query = new esri.tasks.Query();
		    query.returnGeometry = true;//返回空间查询的geometry，方便把返回值结果以图标形式叠加在地图上
		    query.outFields = ["NAME"];//设置返回值的字段
		    query.geometry = geometry;//设置绘制框选图形范围
		    queryTask.execute(query, ems.route.navInfo);
		},
    /**
     * 所有图层的空间查询--Query
    */
		navInfo: function (results) {
		    //清空graphiclayer
		    ems.route.pointlayer.clear();
		    ems.route.map.infoWindow.hide();
		    var sms = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/plot/point1.png", 11, 13);
		    var innerStr = [];
		    var featureCount = results.features.length;
		    if (results.features == null || featureCount == 0) {
		        DCI.Poi.addSearchErrorPage("queryshowListroute");
		        $("#querylistpageroute").css({ display: "none" });
		        return;
		    }
		    //最大的显示页面
		    var maxpage = Math.ceil(featureCount / ems.route.pageSize);
		    $("#querylistpageroute").css({ display: "block" });
		    if (results.features.length > 0) {
		        var resources = [];//设置closest的数据源
		        for (var i = 0; i < ems.route.pageSize; i++) {
		            var rExtent = null;
		            var iId = i + 1;
		            var baseGraphicsymbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/dw" + iId + ".png", 25, 25);
		            var infactItem = ems.route.pageIndex * ems.route.pageSize + i;
		            var tempID = "tempID" + i;
		            var pId = "poi_" + iId;
		            if (results.features[infactItem] == undefined) //最后一页没有记录了 跳出循环
		                break;
		            var attr = { "title": results.features[i].attributes.NAME, "content": results.features[i].attributes.NAME };
		            var baseGraphic = new esri.Graphic(results.features[infactItem].geometry, baseGraphicsymbol, attr);
		            baseGraphic.id = tempID;
		            ems.route.pointlayer.add(baseGraphic);
		            //设置路径分析的数据源
		            var resource = {};
		            resource.name = results.features[i].attributes.NAME;
		            resource.x = baseGraphic.geometry.x;
		            resource.y = baseGraphic.geometry.y;
		            resources.push(resource);

		            innerStr.push('<div class="left_list_li_box"   id="' + pId + '">');
		            innerStr.push('<div class="left_list_li_box_top">');
		            innerStr.push('<div class="left2_box2">');
		            innerStr.push('<img class="list_poi_marker" style="" src="' + getRootPath() + 'Content/images/poi/dw' + iId + '.png"></img>');
		            innerStr.push('<div class="left_list_li1">');
		            innerStr.push('<p>');
		            innerStr.push('<a>' + results.features[infactItem].attributes.NAME + '</a><br/>');
		            innerStr.push('</p>');
		            innerStr.push('</div>');
		            innerStr.push('</div>')
		            innerStr.push('</div>');
		            innerStr.push('</div>');
		        }
		        ems.route.InitRoute(ems.route.accidentPosition, resources);
		        $("#queryshowListroute").html(innerStr.join(''));

		        //设置地图显示范围
		        if (rExtent == null)
		            rExtent = baseGraphic._extent;
		        else {
		            rExtent = rExtent.union(baseGraphic._extent);
		        }

		        ems.route.map.setExtent(rExtent.expand(2));
		        ems.route.map.resize();
		        ems.route.map.reposition();
		        //分页工具条        
		        $("#querylistpageroute").PageOperator({
		            containerID: "querylistpageroute",
		            count: featureCount,
		            pageIndex: ems.route.pageIndex,
		            maxPage: maxpage,
		            callback: function (pageIndex) {
		                ems.route.pageIndex = pageIndex;
		                ems.route.searchSP(ems.route.sgeometry);
		            }
		        });
		    } else {
		        alert("搜索不到相关数据");
		    }
		},


		/**
		 * 恢复原始状态
		 */ 
		initState:function(){
			ems.route.graphicslayer.clear();
			ems.route.carGraphicslayer.clear();
			if(ems.route.intervalId){
				window.clearInterval(ems.route.intervalId);
			}			
		},
		/**
		 * 救援路线详情
		 * 一对一
		 * @id 路线编号id
		 * @type 0代表救援跟踪可见 1代表不可见
		 */ 
		routeInfo:function(graphic){
			//type=type||0; 
            //弹出窗口
			var htmlstr = "<div class='monitorinforwin_Container' style='width: 330px' id='inforwin_Container'>"+
			"<div class='syn_tit' style='border-bottom: 1px solid #C6CBCE;'>"+
			"<span style='margin-left: 5px;'>路线详情如下:</span>"+
			"</div>"+

			"<div class='route_tit'>";
			for(var i=0;i<graphic.attributes.length;i++){
	            var fileName = ems.route.getImgFileName(graphic.attributes[i][1]);
	            var imgpath = getRootPath() + "Content/images/route/" + fileName;
				if(i != graphic.attributes.length-1 && i != graphic.attributes.length-2 && i != graphic.attributes.length-3)
				    //htmlstr += "<label>" + (i + 1) + ":</label><img src='" + imgpath + "'alt='' class='route_img' style='float:right;' /><label id='roueID" + i + "'>" + graphic.attributes[i][0] + "</label><div id='roueIMG" + i + "' class='routeid_img'></div></br>";
				    htmlstr += "<label>" + (i + 1) + ":</label><label id='roueID" + i + "'>" + graphic.attributes[i][0] + "</label><img src='" + imgpath + "'alt='' class='route_img' style='float:right;' /<div id='roueIMG" + i + "' class='routeid_img'></div></br>";
			}
			htmlstr +="</div>"+	                	   
			"<div style='border-top: 1px solid #C6CBCE;height:65px;' class='route_tit'>"+
			"<label>总时间:</label><label>" + graphic.attributes[i-1].toFixed(3)+ "分钟</label></br><label>总距离:</label><label>" + graphic.attributes[i-2].toFixed(3) + "米</label></br>"+
			"<button id='routeButton' style='height:28px;width:90px;float:right;margin-right:5px;margin-bottom:10px;'  class='btn btn-default btn-sm' ><i style='margin-right:3px' class='glyphicon glyphicon-search'></i>救援跟踪</button>" +
			"</div>"+

			"</div>";

        	if (ems.route.dialog)
        		ems.route.dialog.close();
        	ems.route.dialog = jDialog.dialog({
        		title: '',
        		width: 350,                   
        		modal: false, // 非模态，即不显示遮罩层
        		showTitle:false,
        		//divid:'route_dialog',
        		left:document.body.scrollWidth-360,
        		top:document.body.scrollHeight*0.35,
        		content:htmlstr
        	});
    		
        	ems.route.dialog.bind("close", function () {
        		ems.route.initState();
            });

			//var highlightGraphic = new esri.Graphic(graphic.geometry);
        	//ems.route.graphicslayer.add(graphic);
            //救援路线轨迹移动模拟
            $("#routeButton").click(function () {
    			var routejsonData=[];
    			//调用等距分点函数
    			for(var i=0;i<graphic.geometry.paths.length;i++){
    				var array = graphic.geometry.paths[i];
    				for(var j=0;j<array.length;j++){
    					if(j<array.length-1){//倒数第二个结束
    		    			var pt1 = new esri.geometry.Point(array[j][0],array[j][1],ems.route.map.spatialReference);
    		    			var pt2 = new esri.geometry.Point(array[j+1][0],array[j+1][1],ems.route.map.spatialReference);
    		    			routejsonData = routejsonData.concat(ems.route.equidistantPoints(pt1,pt2,245,j));
    					}
    				}
    			}
        		if(routejsonData.length<=0){
           		    promptdialog("提示信息","暂无轨迹点数据");
        			return;
        		}
            	if(ems.route.intervalId){
         		   window.clearInterval(ems.route.intervalId);
            	}
            	var num =0;
    			ems.route.routesTrajectory(routejsonData[num]);
    			num++;
            	ems.route.intervalId = window.setInterval(function(){
            		if(num<routejsonData.length){                			                   	
            			ems.route.routesTrajectory(routejsonData[num]);
            			num++;
            		}else{
            			window.clearInterval(ems.route.intervalId);
            		}
        		}, 500); 
            });				
		},
		/**
		 * 救援路线轨迹移动模拟
		 */  
		routesTrajectory:function(json){
			ems.route.carGraphicslayer.clear();
    		var symbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/plot/car/XFC.png", 28, 28);
    		symbol.setAngle(json.angle);
        	var pt = new esri.geometry.Point(json.point.x,json.point.y,ems.route.map.spatialReference);
        	var graphic = new esri.Graphic(pt, symbol);
        	ems.route.carGraphicslayer.add(graphic);
		},
		/**
		 * 初始化执行救援路线的参数条件
		 * @eventjson 事故点
		 * @resourcejson 应急物资
		 * @type 0代表多对一的路线;1代表一对一路线;默认为0（多对一)
		 */ 
		InitRoute:function(eventjson,resourcejson,type){
			if(eventjson && resourcejson){
				type=type||0; 
				ems.route.clearGraphics(type);
				var extent = null;
				//加载事故点
				var eventattr = { Name: eventjson.eventName};
				var eventPoint = new esri.geometry.Point(eventjson.x,eventjson.y,ems.route.map.spatialReference);
				var location = new esri.Graphic(eventPoint);
				location.setAttributes(eventattr);
				ems.route.incidentsGraphicsLayer.add(location);       	
				for(var i=0;i<resourcejson.length;i++){
					//var rattr = { Name: resourcejson[i].name,num: resourcejson[i].num,route: resourcejson[i].route,size: resourcejson[i].size,ID:resourcejson[i].ID};
					var rattr = { Name:resourcejson[i].name};
					var rpoint = new esri.geometry.Point(resourcejson[i].x,resourcejson[i].y,ems.route.map.spatialReference);
					var graphic = new esri.Graphic(rpoint);					
					graphic.setAttributes(rattr);
					
	        		switch (type) {
	        		case 0://多对一路线
						ems.route.facilitiesGraphicsLayer.add(graphic);   
	        			break;
	        		case 1://一对一路线	        			
	        			ems.route.graphicslayer.add(graphic);
	        			break;
	        		} 
         	
					//设置地图显示范围
					if (extent == null)
						extent = graphic._extent;
					else {
						extent = extent.union(graphic._extent);
					}
				}
				if(extent)
				   ems.route.map.setExtent(extent.expand(2.5)); 
				//执行救援路线      	
				ems.route.rescueRoutes(location,type);
			}else{
				promptdialog("提示信息","请先在地图上选择事故点,并且执行周边分析之后,才能响应救援路径分析");
			}
		},
		/**
		 * 救援资源路线分配
		 * @location 事故点
		 * @type 0代表多对一的路线;1代表一对一路线
		 */  
		rescueRoutes:function(location,type){
			var features = [];
			features.push(location);
			var incidents = new esri.tasks.FeatureSet();
			incidents.features = features;
			ems.route.params.incidents = incidents;
	        var facilities = new esri.tasks.FeatureSet();
	        //facilities.features = ems.route.facilitiesGraphicsLayer.graphics;
    		switch (type) {
    		case 0://多对一路线
    			facilities.features = ems.route.facilitiesGraphicsLayer.graphics; 
    			break;
    		case 1://一对一路线	        			
    			facilities.features = ems.route.graphicslayer.graphics;
    			break;
    		} 
    		
	        ems.route.params.facilities = facilities;
	        ems.route.params.outSpatialReference = ems.route.map.spatialReference;
	        //solve 
		    // esriConfig.defaults.io.proxyUrl = getRootPath() + "pages/map/print/proxy.jsp";
	        esriConfig.defaults.io.proxyUrl = getRootPath() + "proxy.ashx";
            esriConfig.defaults.io.alwaysUseProxy = true;
	        ems.route.closestFacilityTask.solve(ems.route.params, function(solveResult){
	          if(solveResult.routes.length>0){
	        	  for(var i=0;i<solveResult.routes.length;i++){
		        	  var attr =[];
		        	  for(var j=0;j<solveResult.directions[i].features.length;j++){
		        		  attr.push([solveResult.directions[i].features[j].attributes.text,solveResult.directions[i].features[j].attributes.maneuverType]);	        			
		        	  }
		        	  attr.push(solveResult.directions[i].routeName);	        		
		        	  attr.push(solveResult.directions[i].totalLength);
		        	  attr.push(solveResult.directions[i].totalTime);
		        	  solveResult.routes[i].setAttributes(attr);
	        		  switch (type) {
	        		  case 0://多对一路线
	        			  ems.route.routeGraphicLayer.add(solveResult.routes[i]);
	        			  break;
	        		  case 1://一对一路线		        		
	        			  //ems.route.graphicslayer.add(solveResult.routes[i]);
	        			  ems.route.routeInfo(solveResult.routes[i]);//显示路线详情	
	        			  break;
	        		  }  
	        	  }
	        	  if(type ==0)
	        		  ems.route.closestFacilityRoutes(solveResult.routes);
	          }else{
	  			promptdialog("提示信息","搜索不到相关的资源分配路线");			        	  
	          }    
	        },ems.route.routeError);			
		},
		/**
		 * 显示各个救援路线窗口
		 * @routes 救援路线数组
		 */  
		closestFacilityRoutes:function(routes){
            //弹出窗口
  			var htmlstr = "<div class='monitorinforwin_Container' style='width: 360px;' id='inforwin_Container'>"+
  			"<div class='syn_tit' style='border-bottom: 0px solid #cccccc;'>"+
  			"<span style='margin-left: 5px;'>方案路线如下:</span>"+
  			"</div>";
        	for(var i=0;i<routes.length;i++){
        		//
        		htmlstr +="<div style='border-top: 1px solid #C6CBCE;height:110px;' class='route_tit'>"+
        		"<label>路线"+(i+1)+":</label><label>" + routes[i].attributes[routes[i].attributes.length-3]+ "</label></br>"+
        		"<label>总时间:</label><label>" + routes[i].attributes[routes[i].attributes.length-1].toFixed(3)+ "分钟</label></br>"+
        		"<label>总距离:</label><label>" + routes[i].attributes[routes[i].attributes.length-2].toFixed(3) + "米</label>"+
        		"<button id='routeinfo_Button"+i+"' style='height:28px;width:90px;float:right;margin-right:5px'  class='btn btn-default btn-sm' ><i style='margin-right:3px' class='glyphicon glyphicon-search'></i>路线详情</button>"+				
        		"</div>"; 
        	}
        	htmlstr +="</div>";
        	if (ems.route.wholedialog)
        		ems.route.wholedialog.close();
        	ems.route.wholedialog = jDialog.dialog({
        		//title: '测试',
        		width: 380,                   
        		modal: false, // 非模态，即不显示遮罩层
        		//showTitle:false,
        		left:329,
        		top:119,
        		content:htmlstr
        	});
            //查看详情监听
         	for(var i=0;i<routes.length;i++){
         		$("#routeinfo_Button"+i).click(function () {
         			//promptdialog("提示信息",this.id);
         			var id=this.id.replace("routeinfo_Button","");
         			//ems.route.graphicslayer.add(routes[id]);
         			ems.route.routeInfo(routes[id]);//显示路线详情	
         		});
         	}
        	
		},
		/**
		 * 路线分析失败
		 */  
		routeError:function(){
			promptdialog("提示信息","路径分析执行发生错误");			
		},
		/**
		 * 清空
		 * @type 0代表多对一的路线;1代表一对一路线
		 */  
		clearGraphics:function(type){
			switch (type) {
			case 0://多对一路线
				if(ems.route.facilitiesGraphicsLayer)
					ems.route.facilitiesGraphicsLayer.clear();
				if(ems.route.routeGraphicLayer)
					ems.route.routeGraphicLayer.clear();
				break;
			case 1://一对一路线	        			
				break;
			} 
			if(ems.route.map)
				ems.route.map.infoWindow.hide();
			if(ems.route.incidentsGraphicsLayer)
				ems.route.incidentsGraphicsLayer.clear();
			if(ems.route.graphicslayer)
				ems.route.graphicslayer.clear();
			if(ems.route.carGraphicslayer)
				ems.route.carGraphicslayer.clear();
		},		
	    /*
	     *获取路线提示的图片文件名
	     */
	    getImgFileName: function (maneuverType) {
	        var fileName="";
	        switch (maneuverType) { 
	            case "esriDMTStop":							 
	                fileName = "NAEndLocx.png";
	                break;
	            case "esriDMTStraight":
	                fileName="straight.png";
	                break;
	            case "esriDMTBearLeft":
	                fileName = "bear-left.png";
	                break;
	            case "esriDMTBearRight":
	                fileName = "bear-right.png";
	                break;
	            case "esriDMTTurnLeft":
	                fileName = "left.png";
	                break;
	            case "esriDMTTurnRight":
	                fileName = "right.png";
	                break;
	            case "esriDMTSharpLeft":
	                fileName = "sharp-left.png";
	                break;
	            case "esriDMTSharpRight":
	                fileName = "sharp-right.png";
	                break;
	            case "esriDMTUTurn":
	                fileName = "uturn.png";
	                break;
	            case "esriDMTFerry":
	                fileName = "ferry.png";
	                break;
	            case "esriDMTRoundabout":
	                fileName = "round-about.png";
	                break;
	            case "esriDMTHighwayMerge":
	                fileName = "highway-merge.png";
	                break;
	            case "esriDMTHighwayExit":
	                fileName = "highway-exit.png";
	                break;
	            case "esriDMTHighwayChange":
	                fileName = "highway-change.png";
	                break;
	            case "esriDMTForkCenter":
	                fileName = "fork-center.png";
	                break;
	            case "esriDMTForkLeft":
	                fileName = "fork-left.png";
	                break;
	            case "esriDMTForkRight":
	                fileName = "fork-right.png";
	                break;
	            case "esriDMTDepart":
	                fileName = "NAStartLocx.png";
	                break;
	            case "esriDMTTripItem":
	                fileName = "trip-item.png";
	                break;
	            case "esriDMTEndOfFerry":
	                fileName = "end-of-ferry.png";
	                break;
	            case "esriDMTTurnLeftRight":
	                fileName = "left-right.png";
	                break;
	            case "esriDMTTurnLeftLeft":
	                fileName = "left-left.png";
	                break;
	            case "esriDMTTurnRightLeft":
	                fileName = "right-left.png";
	                break;
	            case "esriDMTTurnRightRight":
	                fileName = "right-right.png";
	                break;
						
	        }
	        return fileName;
	    },		
	    /**
	     * @point1   第一个坐标点
	     * @point2   第二个坐标点
	     * @distance 等分点距离,默认10米
	     * @angle    车辆图标默认的角度
	     * @routeID  道路编号
	     * @return 	 两点之间等距分点集合
	     */
	    equidistantPoints:function (point1, point2,angle,routeID,distance) {
	    	distance=distance||10.0;//默认10.0米 
	    	var points=[];
	        var d = new Number(0);
	    	if (ems.route.map.spatialReference.wkid == "4326") {	
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
	        d = Math.abs(d);
	        d=parseFloat(d);
	        //获取方位角
	        var angle = ems.route.pointAngle(point1,point2,angle);
	        //构造起点
        	points.push({point:point1,angle:angle,routeID:routeID});
	        if(d>distance){//大于等距值才进行等距分值
	        	var num = Math.ceil(d/distance);
	        	if((point2.x - point1.x)>=0){//第二个点x位于第一个点x的右方
	        		if((point2.y - point1.y)>=0){//第二个点y位于第一个点y的上方
	        			var offx = parseFloat((point2.x - point1.x))/parseFloat(num);
	        			var offy = parseFloat((point2.y - point1.y))/parseFloat(num);
	        			for(var i=1;i<num;i++){
	        			    var pt = new esri.geometry.Point(point1.x+i*offx,point1.y+i*offy,ems.route.map.spatialReference);
		    	        	//points.push(pt);
	        	        	points.push({point:pt,angle:angle,routeID:routeID});
	        			}
	        		}else{//第二个点y位于第一个点y的下方
	        			var offx = parseFloat((point2.x - point1.x))/parseFloat(num);
	        			var offy = parseFloat((point1.y - point2.y))/parseFloat(num);
	        			for(var i=1;i<num;i++){
	        			    var pt = new esri.geometry.Point(point1.x+i*offx,point1.y-i*offy,ems.route.map.spatialReference);
	        	        	points.push({point:pt,angle:angle,routeID:routeID});
	        			}	        			
	        		}
	        	}else{//第二个点位于第一个点的左方
	        		if((point2.y - point1.y)>=0){//第二个点y位于第一个点y的上方
	        			var offx = parseFloat((point1.x - point2.x))/parseFloat(num);
	        			var offy = parseFloat((point2.y - point1.y))/parseFloat(num);
	        			for(var i=1;i<num;i++){
	        			    var pt = new esri.geometry.Point(point1.x-i*offx,point1.y+i*offy,ems.route.map.spatialReference);
	        	        	points.push({point:pt,angle:angle,routeID:routeID});
	        			}	        			
	        		}else{//第二个点y位于第一个点y的下方
	        			var offx = parseFloat((point1.x - point2.x))/parseFloat(num);
	        			var offy = parseFloat((point1.y - point2.y))/parseFloat(num);
	        			for(var i=1;i<num;i++){
	        			    var pt = new esri.geometry.Point(point1.x-i*offx,point1.y-i*offy,ems.route.map.spatialReference);
	        	        	points.push({point:pt,angle:angle,routeID:routeID});
	        			}		        			
	        		}	        		
	        	}
	        }
	        //构造终点
        	points.push({point:point2,angle:angle,routeID:routeID});
	        return points;
	    },
	    /**
	     * @point    经纬度坐标点
	     * @return 	 经纬度转换米
	     */
	    translateLonLatToDistance:function (point) {
	        var d = new Number(0);
	        var radPerDegree = Math.PI / 180.0;
	        var equatorialCircumference = Math.PI * 2 * 6378137;

	        return {
	            x: Math.cos(point.y * radPerDegree) * equatorialCircumference * Math.abs(point.x / 360),
	            y: equatorialCircumference * Math.abs(point.y / 360)
	        };
	    },
	    /**
	     * @point1   第一个坐标点
	     * @point2   第二个坐标点
	     * @angle_m  车辆图标默认的角度
	     * @return 	 返回两点的方位角
	     */
	    pointAngle:function (point1, point2,angle_m) {
	    	var angle=0;
        	if((point2.x - point1.x)>=0){//第二个点x位于第一个点x的右方
        		if((point2.y - point1.y)>=0){//第二个点y位于第一个点y的上方
        			var offx = parseFloat((point2.x - point1.x));
        			var offy = parseFloat((point2.y - point1.y));
                    var tan_angle = offy/offx;
                    angle = Math.atan(tan_angle);
                	angle = 90-angle*180.0/Math.PI+360-angle_m;
        		}else{//第二个点y位于第一个点y的下方
        			var offx = parseFloat((point2.x - point1.x));
        			var offy = parseFloat((point1.y - point2.y));
                    var tan_angle = offy/offx;
                    angle = Math.atan(tan_angle);
                	angle = angle*180.0/Math.PI+90+360-angle_m;
        		}
        	}else{//第二个点位于第一个点的左方
        		if((point2.y - point1.y)>=0){//第二个点y位于第一个点y的上方
        			var offx = parseFloat((point1.x - point2.x));
        			var offy = parseFloat((point2.y - point1.y));
                    var tan_angle = offy/offx;
                    angle = Math.atan(tan_angle);
                	angle = angle*180.0/Math.PI+360-angle_m-90;
        		}else{//第二个点y位于第一个点y的下方
        			var offx = parseFloat((point1.x - point2.x));
        			var offy = parseFloat((point1.y - point2.y));
                    var tan_angle = offy/offx;
                    angle = Math.atan(tan_angle);
                	angle = 360-angle_m+180+angle*180.0/Math.PI;
        		}	        		
        	}
        	return angle;
	    },
        /**
         * 切换到其他模块再回来--默认初始化状态
         */
	    InitState: function () {
	        if (ems.route.dialog)
	            ems.route.dialog.close();
	        if (ems.route.wholedialog)
	            ems.route.wholedialog.close();
	        //控制显示或隐藏
	        $("#pointTxt").val("");
	        $("#queryshowListroute").empty();
	        $("#querylistpageroute").empty();
	    },
	    
		
}