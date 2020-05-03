LayerSwitcherToolbar = DObject({
    mapDivId: null,
    map: null,
    flag:null,
    construct: function (map, options,flag) {
	    this.mapDivId = map.id;
	    this.map = map;
	    this.flag = flag;
	    if (this.map) {
	        this.showLayerControl(options);
	    }
    },
    showLayerControl: function (options) {
		var T = this;
		var layerCtl = new LayerContorl(this.mapDivId, options);
		layerCtl.changMap = function () {
			T.changeBaseMap(arguments);
		};
		//默认加载第一项作为底图
		if (options.length > 0) {
			var item = options[0];
			var mapType = item.type;
			var curLyr = null;
			//MapServer切片
			if (mapType == 1) {//mapType为地图类型，0为wmts，1为mapserver切片,2为高德地图矢量，3为高德卫星,4为天地图矢量,5为天地图卫星,6为百度地图矢量，7为百度卫星
				var curLyr = new esri.layers.ArcGISTiledMapServiceLayer(item.url.map, {id: "BaseMapID"});
				T.map.addLayer(curLyr, 0);
				if (item.url.anno != null && item.url.anno != "") {
					var curLyrAnno = new esri.layers.ArcGISTiledMapServiceLayer(item.url.anno, {id: "BaseMapID_Anno"});
					T.map.addLayer(curLyrAnno, 1);
				}
			} else if(mapType==0){
				//WMTS
				curLyr = new WMTSLayer(item.url.map, DUtil.extend({id: "BaseMapID"}, item.extInfo));
				curLyr.esriLayer.id = "BaseMapID";
				T.map.addLayer(curLyr, 0);
				if (item.url.anno != null && item.url.anno != "") {
					var curLyrAnno = new WMTSLayer(item.url.anno, DUtil.extend({id: "BaseMapID_Anno"}, item.extInfo));
					T.map.addLayer(curLyrAnno, 1);
				}
			}else if(mapType==2){
				//高德矢量图层
				curLyr = new GAODELayer({id: "BaseMapID",esriLayerType:"road"});
				curLyr.esriLayer.id = "BaseMapID";
				T.map.addLayer(curLyr.esriLayer, 0);
			}
			else if(mapType==3){
				//高德卫星图层
				curLyr = new GAODELayer({id: "BaseMapID",esriLayerType:"st"});
				curLyr.esriLayer.id = "BaseMapID";
				T.map.addLayer(curLyr.esriLayer, 0);
				var curLyrAnno = new GAODELayer({ id: "BaseMapID_Anno", esriLayerType: "label" });
				curLyrAnno.esriLayer.id = "BaseMapID_Anno";
				T.map.addLayer(curLyrAnno.esriLayer, 1);
			}
			else if(mapType==4){
				//天地图矢量图层
				curLyr = new TDTLayer({id: "BaseMapID",esriLayerType:"vec"});
				curLyr.esriLayer.id = "BaseMapID";
				T.map.addLayer(curLyr.esriLayer, 0);
				var curLyrAnno = new TDTLayer({id: "BaseMapID_Anno",esriLayerType:"cva"});
				curLyrAnno.esriLayer.id = "BaseMapID_Anno";
				T.map.addLayer(curLyrAnno.esriLayer, 1);
			}			
			else if(mapType==5){
				//天地图卫星图层
				curLyr = new TDTLayer({id: "BaseMapID",esriLayerType:"img"});
				curLyr.esriLayer.id = "BaseMapID";
				T.map.addLayer(curLyr.esriLayer, 0);
				var curLyrAnno = new TDTLayer({id: "BaseMapID_Anno",esriLayerType:"cia"});
				curLyrAnno.esriLayer.id = "BaseMapID_Anno";
				T.map.addLayer(curLyrAnno.esriLayer, 1);
			}
			else if (mapType == 6) {
			    //百度矢量图层
			    curLyr = new BDLayer({ id: "BaseMapID", esriLayerType: "bd_vec" });
			    curLyr.esriLayer.id = "BaseMapID";
			    T.map.addLayer(curLyr.esriLayer, 0);
			}
			else if (mapType == 7) {
			    //百度卫星图层
			    curLyr = new BDLayer({ id: "BaseMapID", esriLayerType: "bd_img" });
			    curLyr.esriLayer.id = "BaseMapID";
			    T.map.addLayer(curLyr.esriLayer, 0);
			    var curLyrAnno = new BDLayer({ id: "BaseMapID_Anno", esriLayerType: "bd_cva" });
			    curLyrAnno.esriLayer.id = "BaseMapID_Anno";
			    T.map.addLayer(curLyrAnno.esriLayer, 1);
			}
			
		}
	},
	changeBaseMap: function (arg) {
	    var T = this;
		var service = arg[0];
		var baseMapID = "BaseMapID";
		var baseMapAnnoID = "BaseMapID_Anno";
		var curLyr = T.map.getLayer(baseMapID);
		var curLyrAnno = T.map.getLayer(baseMapAnnoID);
		var mapType = service.type;
		if (curLyr) {
			if(mapType==0||mapType==1){
				if (curLyr.url != service.url.map) {
				    T.map.removeLayer(curLyr);
					if (curLyrAnno) {
					    T.map.removeLayer(curLyrAnno);
					}
					if (T.flag) {
					    //销毁对象map,再重现创建map	    
					    T.createMap(mapType);
					}
					if (mapType == 1) {
						var curLyr = new esri.layers.ArcGISTiledMapServiceLayer(service.url.map, {id: "BaseMapID"});
						T.map.addLayer(curLyr, 0);
						if (service.url.anno != null && service.url.anno != "") {
							var curLyrAnno = new esri.layers.ArcGISTiledMapServiceLayer(service.url.anno, {id: "BaseMapID_Anno"});
							T.map.addLayer(curLyrAnno, 1);
						}
					} else {
						curLyr = new WMTSLayer(service.url.map, DUtil.extend({id: baseMapID}, service.extInfo));
						T.map.addLayer(curLyr, 0);
						if (service.url.anno != null && service.url.anno != "") {
							var curLyrAnno = new WMTSLayer(service.url.anno, DUtil.extend({id: baseMapAnnoID}, service.extInfo));
							T.map.addLayer(curLyrAnno, 1);
						}
					}
				}
			}else{
			    T.map.removeLayer(curLyr);
				if (curLyrAnno) {
				    T.map.removeLayer(curLyrAnno);
				}
				if (T.flag) {
				    //销毁对象map,再重现创建map	    
				    T.createMap(mapType);
				}
				if(mapType==2){
					//高德矢量图层
					curLyr = new GAODELayer({id: "BaseMapID",esriLayerType:"road"});
					curLyr.esriLayer.id = "BaseMapID";
					T.map.addLayer(curLyr.esriLayer, 0);
				}
				else if(mapType==3){
					//高德卫星图层
					curLyr = new GAODELayer({id: "BaseMapID",esriLayerType:"st"});
					curLyr.esriLayer.id = "BaseMapID";
					T.map.addLayer(curLyr.esriLayer, 0);
					var curLyrAnno = new GAODELayer({ id: "BaseMapID_Anno", esriLayerType: "label" });
					curLyrAnno.esriLayer.id = "BaseMapID_Anno";
					T.map.addLayer(curLyrAnno.esriLayer, 1);
				}
				else if(mapType==4){
					//天地图矢量图层
					curLyr = new TDTLayer({id: "BaseMapID",esriLayerType:"vec"});
					curLyr.esriLayer.id = "BaseMapID";
					T.map.addLayer(curLyr.esriLayer, 0);
					var curLyrAnno = new TDTLayer({id: "BaseMapID_Anno",esriLayerType:"cva"});
					curLyrAnno.esriLayer.id = "BaseMapID_Anno";
					T.map.addLayer(curLyrAnno.esriLayer, 1);
				}			
				else if(mapType==5){
					//天地图卫星图层
					curLyr = new TDTLayer({id: "BaseMapID",esriLayerType:"img"});
					curLyr.esriLayer.id = "BaseMapID";
					T.map.addLayer(curLyr.esriLayer, 0);
					var curLyrAnno = new TDTLayer({id: "BaseMapID_Anno",esriLayerType:"cia"});
					curLyrAnno.esriLayer.id = "BaseMapID_Anno";
					T.map.addLayer(curLyrAnno.esriLayer, 1);
				}
				else if (mapType == 6) {
				    //百度矢量图层
				    curLyr = new BDLayer({ id: "BaseMapID", esriLayerType: "bd_vec" });
				    curLyr.esriLayer.id = "BaseMapID";
				    T.map.addLayer(curLyr.esriLayer, 0);
				}
				else if (mapType == 7) {
				    //百度卫星图层
				    curLyr = new BDLayer({ id: "BaseMapID", esriLayerType: "bd_img" });
				    curLyr.esriLayer.id = "BaseMapID";
				    T.map.addLayer(curLyr.esriLayer, 0);
				    var curLyrAnno = new BDLayer({ id: "BaseMapID_Anno", esriLayerType: "bd_cva" });
				    curLyrAnno.esriLayer.id = "BaseMapID_Anno";
				    T.map.addLayer(curLyrAnno.esriLayer, 1);
				}
				
				
			}
		}
		//else {
		//    //销毁对象map,再重现创建map	    
		//    T.createMap(mapType);
		//	if (mapType == 1) {
		//		var curLyr = new esri.layers.ArcGISTiledMapServiceLayer(service.url.map, {id: "BaseMapID"});
		//		T.map.addLayer(curLyr, 0);
		//		if (service.url.anno != null && service.url.anno != "") {
		//			var curLyrAnno = new esri.layers.ArcGISTiledMapServiceLayer(service.url.anno, {id: "BaseMapID_Anno"});
		//			T.map.addLayer(curLyrAnno, 1);
		//		}
		//	} else {
		//		curLyr = new WMTSLayer(service.url.map, DUtil.extend({id: baseMapID}, service.extInfo));
		//		T.map.addLayer(curLyr, 0);
		//		if (service.url.anno != null && service.url.anno != "") {
		//			var curLyrAnno = new WMTSLayer(service.url.anno, DUtil.extend({id: baseMapAnnoID}, service.extInfo));
		//			T.map.addLayer(curLyrAnno, 1);
		//		}
		//	}
		//}
	},
	createMap: function (mapType) {
	    //销毁对象map,再重现创建map	
	    var T = this;
	    T.map.destroy();
	    T.map = new esri.Map(T.mapDivId, { logo: false, slider: false });
	    //设置地图初始范围
	    var initExtent;
	    switch (mapType)//0为wmts，1为mapserver切片,2为高德地图矢量，3为高德卫星,4为天地图矢量,5为天地图卫星,6为百度地图矢量,7为百度卫星
	    {
	        case 0:
	            initExtent = new esri.geometry.Extent({ xmin: MapConfig.mapInitParams.extent.xmin, ymin: MapConfig.mapInitParams.extent.ymin, xmax: MapConfig.mapInitParams.extent.xmax, ymax: MapConfig.mapInitParams.extent.ymax, spatialReference: MapConfig.mapInitParams.spatialReference });
	            break;
	        case 1:
	            initExtent = new esri.geometry.Extent({ xmin: MapConfig.mapInitParams.extent.xmin, ymin: MapConfig.mapInitParams.extent.ymin, xmax: MapConfig.mapInitParams.extent.xmax, ymax: MapConfig.mapInitParams.extent.ymax, spatialReference: MapConfig.mapInitParams.spatialReference });
	            break;
	        case 2:
	            initExtent = new esri.geometry.Extent({ xmin: MapConfig.mapInitParams.gaode_extent.xmin, ymin: MapConfig.mapInitParams.gaode_extent.ymin, xmax: MapConfig.mapInitParams.gaode_extent.xmax, ymax: MapConfig.mapInitParams.gaode_extent.ymax, spatialReference: MapConfig.mapInitParams.gaode_spatialReference });
	            break;
	        case 3:
	            initExtent = new esri.geometry.Extent({ xmin: MapConfig.mapInitParams.gaode_extent.xmin, ymin: MapConfig.mapInitParams.gaode_extent.ymin, xmax: MapConfig.mapInitParams.gaode_extent.xmax, ymax: MapConfig.mapInitParams.gaode_extent.ymax, spatialReference: MapConfig.mapInitParams.gaode_spatialReference });
	            break;
	        case 4:
	            initExtent = new esri.geometry.Extent({ xmin: MapConfig.mapInitParams.extent.xmin, ymin: MapConfig.mapInitParams.extent.ymin, xmax: MapConfig.mapInitParams.extent.xmax, ymax: MapConfig.mapInitParams.extent.ymax, spatialReference: MapConfig.mapInitParams.spatialReference });
	            break;
	        case 5:
	            initExtent = new esri.geometry.Extent({ xmin: MapConfig.mapInitParams.extent.xmin, ymin: MapConfig.mapInitParams.extent.ymin, xmax: MapConfig.mapInitParams.extent.xmax, ymax: MapConfig.mapInitParams.extent.ymax, spatialReference: MapConfig.mapInitParams.spatialReference });
	            break;
	        case 6:
	            initExtent = new esri.geometry.Extent({ xmin: MapConfig.mapInitParams.bd_extent.xmin, ymin: MapConfig.mapInitParams.bd_extent.ymin, xmax: MapConfig.mapInitParams.bd_extent.xmax, ymax: MapConfig.mapInitParams.bd_extent.ymax, spatialReference: MapConfig.mapInitParams.bd_spatialReference });
	            break;
	        case 7:
	            initExtent = new esri.geometry.Extent({ xmin: MapConfig.mapInitParams.bd_extent.xmin, ymin: MapConfig.mapInitParams.bd_extent.ymin, xmax: MapConfig.mapInitParams.bd_extent.xmax, ymax: MapConfig.mapInitParams.bd_extent.ymax, spatialReference: MapConfig.mapInitParams.bd_spatialReference });
	            break;
	    }
	    T.map.setExtent(initExtent);
	    //重新绑定地图鼠标移动事件
	    $("#map_coordinates").remove();
	    var _divID_coordinates = "map_coordinates";
	    coordinatesDiv = document.createElement("div");
	    coordinatesDiv.id = _divID_coordinates;
	    coordinatesDiv.className = "map-coordinates";
	    coordinatesDiv.innerHTML = "";
	    document.getElementById(T.mapDivId).appendChild(coordinatesDiv);
	    dojo.connect(T.map, "onMouseMove", showCoords);
	    dojo.connect(T.map, "onMouseDrag", showCoords);
	    function showCoords(evt) {
	        evt = evt ? evt : (window.event ? window.event : null);
	        var mp = evt.mapPoint;
	        coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;'>" + "横坐标：" + mp.x.toFixed(3) + "&nbsp;纵坐标：" + mp.y.toFixed(3) + "</span>";
	    }

	},
});
LayerContorl = DObject({
    items: [],
    index: 0,
    changMap: null,
    itemsInfo: null,
    construct: function (divId, options) {
        var T = this;
        this.map = map;
        this.itemsInfo = options;
        var pDiv = document.getElementById(divId);
        var ctlDiv = document.createElement("div");
        ctlDiv.id = "mapswitch";
        ctlDiv.className = "map_switch";
        ctlDiv.onmouseover = function () {
            T._itemMouseover(this);
        };
        ctlDiv.onmouseout = function () {
            T._itemMouseout(this);
        };
        pDiv.appendChild(ctlDiv);
        for (var i = 0; i < options.length; i++) {
            var item = options[i];
            //var label = this._drawItem(i, item.label, item.imgUrl);
            var label = this._drawItem(i, item.label, item.imgUrl, item.className);
            label.style.display = i == 0 ? "block" : "none";
            this.items[i] = label;
            ctlDiv.appendChild(label);
        }
    },
    //type: 0地图,1影像，2地形
    _drawItem: function (type, label, imgUrl, className) {
        var T = this;
        var itemDiv = document.createElement("div");
        itemDiv.className = "map_switch_item";
        itemDiv.onclick = function () {
            T._itemClick(this);
        };
        var itemHover = document.createElement("div");
        itemHover.className = "hoverType";
        itemDiv.appendChild(itemHover);
        var itemType = document.createElement("div");
        var itemLabel = document.createElement("div");
        itemLabel.className = "map_bom";
        itemType.className = "vecType";
        itemType.className = className;
        if (imgUrl) {
            itemType.style.background = "url('" + imgUrl + "')";
        }
        if (label) {
            itemLabel.innerText = label;
        }
        itemHover.appendChild(itemType);
        itemHover.appendChild(itemLabel);
        return itemDiv;
    },
    _itemMouseover: function (arg) {
        arg.style.width = "600px";
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].style.display = "block";
        }
    },
    _itemMouseout: function (arg) {
        arg.style.width = "70px";
        for (var i = 0; i < this.items.length; i++) {
            var div = this.items[i];
            if (i == this.index) {
                div.style.display = "block";
            } else {
                div.style.display = "none";
            }
        }
    },
    _itemClick: function (arg) {
        for (var i = 0; i < this.items.length; i++) {
            var div = this.items[i];
            if (arg == div) {
                this.index = i;
                div.style.display = "block";
                this.changMap(this.itemsInfo[i]);
            } else {
                div.style.display = "none";
            }
        }
    }
});
//wmtsLayer扩展
WMTSLayer = DObject({
	url: null,
	esriLayer: null,
	construct: function (url, options) {
		this.url = url;
		var tileUrl = url;
		var stdParams = {
				service: "WMTS",
				request: "GetTile",
				layer: 0,
				style: "default",
				tileMatrixSet: "sss",
				format: MapConfig.params_tile.format
		};
		stdParams = DUtil.extend(stdParams, options);
		dojo.declare("ESRITiledMapServiceLayer", esri.layers.TiledMapServiceLayer, {
			constructor: function () {
				this.url = url;
				this.spatialReference = new esri.SpatialReference(MapConfig.params_tile.spatialReference);
				this.initialExtent = new esri.geometry.Extent({
					xmin: MapConfig.params_tile.initExtent.xmin,
					ymin: MapConfig.params_tile.initExtent.ymin,
					xmax: MapConfig.params_tile.initExtent.xmax,
					ymax: MapConfig.params_tile.initExtent.ymax,
					spatialReference: this.spatialReference
				});
				this.fullExtent = new esri.geometry.Extent({
					xmin: MapConfig.params_tile.fullExtent.xmin,
					ymin: MapConfig.params_tile.fullExtent.ymin,
					xmax: MapConfig.params_tile.fullExtent.xmax,
					ymax: MapConfig.params_tile.fullExtent.ymax,
					spatialReference: this.spatialReference
				});
				this.tileInfo = new esri.layers.TileInfo(MapConfig.params_tile);
				this.loaded = true;
				this.onLoad(this);
				if (stdParams.id != null) {
					this.id = stdParams.id;
				}
			},
			getTileUrl: function (level, row, col) {
				var serviceUrl = encodeURI(tileUrl);
				if (serviceUrl[serviceUrl.length - 1] == "/") {
					serviceUrl = serviceUrl.substring(0, serviceUrl.length - 1);
				}
				stdParams.tileMatrix = level;
				stdParams.tileRow = row;
				stdParams.tileCol = col;
				return encodeURI(serviceUrl) + "?" + dojo.objectToQuery(stdParams);
			}
		});
		this.esriLayer = new ESRITiledMapServiceLayer();
	},
	hide: function () {
		this.esriLayer.hide();
	},
	show: function () {
		this.esriLayer.show();
	}
});
WMSLayer = DObject({
	url: null,
	esriLayer: null,
	standardParams: null,
	construct: function (url, options) {
		this.url = url;
		var wmsUrl = url;
		this.standardParams = DUtil.extend(MapConfig.params_wms.urlParam, options);
		var stdParams = this.standardParams;
		dojo.declare("ESRIWMSLayer", esri.layers.DynamicMapServiceLayer, {
			constructor: function () {
				this.url = url;
				this.spatialReference = new esri.SpatialReference(stdParams.spatialReference);
				this.initialExtent = new esri.geometry.Extent({
					xmin: MapConfig.params_wms.initExtent.xmin,
					ymin: MapConfig.params_wms.initExtent.ymin,
					xmax: MapConfig.params_wms.initExtent.xmax,
					ymax: MapConfig.params_wms.initExtent.ymax,
					spatialReference: this.spatialReference
				});
				this.fullExtent = new esri.geometry.Extent({
					xmin: MapConfig.params_wms.fullExtent.xmin,
					ymin: MapConfig.params_wms.fullExtent.ymin,
					xmax: MapConfig.params_wms.fullExtent.xmax,
					ymax: MapConfig.params_wms.fullExtent.ymax,
					spatialReference: this.spatialReference
				});
				this.loaded = true;
				this.onLoad(this);
				if (stdParams.id != null) {
					this.id = stdParams.id;
				}
			},
			getImageUrl: function (extent, width, height, callback) {
				if (!wmsUrl) {
					alert("esri.layers.DynamicMapServiceLayer: url 不能为空");
					return;
				}
				var lParams = stdParams;
				lParams.bbox = extent.xmin + "," + extent.ymin + "," + extent.xmax + "," + extent.ymax;
				lParams.width = width;
				lParams.height = height;
				callback(encodeURI(wmsUrl) + "?" + dojo.objectToQuery(lParams));
			}
		});
		this.esriLayer = new ESRIWMSLayer();
	},
	getFormat: function () {
		return this.standardParams.format;
	},
	getBgColor: function () {
		return this.standardParams.bgcolor;
	},
	getLayers: function () {
		return this.standardParams.layers;
	},
	getStyles: function () {
		return this.standardParams.styles;
	},
	getSrs: function () {
		return this.standardParams.srs;
	},
	getBBox: function () {
		return this.standardParams.bbox;
	},
	hide: function () {
		this.esriLayer.hide();
	},
	show: function () {
		this.esriLayer.show();
	},
	getVisibility: function () {
		return this.esriLayer.visible;
	},
	setImageTransparency: function (flag) {
		return this.esriLayer.imageTransparency = flag;
	}
});
//高德地图图层扩展
GAODELayer = DObject({
	id:null,
	esriLayer: null,
	esriLayerType:'road',
		construct: function (options) {
			DUtil.extend(this, options);
//			dojo.declare.safeMixin(this, options);
			dojo.declare("GaoDeTiledMapServiceLayer", esri.layers.TiledMapServiceLayer, {
				id:null,
				layertype: "road",//图层类型
				constructor: function (args) {
				    this.spatialReference = new esri.SpatialReference(MapConfig.mapInitParams.gaode_spatialReference);
					DUtil.extend(this, args);
					this.fullExtent = new esri.geometry.Extent({
						xmin: MapConfig.params_gaode.fullExtent.xmin,
						ymin: MapConfig.params_gaode.fullExtent.ymin,
						xmax: MapConfig.params_gaode.fullExtent.xmax,
						ymax: MapConfig.params_gaode.fullExtent.ymax,
						spatialReference: this.spatialReference
					});
					this.initialExtent = this.fullExtent;
					this.tileInfo = new esri.layers.TileInfo(MapConfig.params_gaode);
					this.loaded = true;
					this.onLoad(this);
				},
				/**
				 * 根据不同的layType返回不同的图层
				 * @param level
				 * @param row
				 * @param col
				 * @returns {string}
				 */
				 getTileUrl: function (level, row, col) {
					 var url = "";
					 switch (this.layertype) {
					 case "road"://矢量
						 url = 'http://webrd0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=' + col + '&y=' + row + '&z=' + level;
						 break;
					 case "st"://影像
						 url = 'http://webst0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?style=6&x=' + col + '&y=' + row + '&z=' + level;
						 break;
					 case "label"://影像标
						 url = 'http://webst0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?style=8&x=' + col + '&y=' + row + '&z=' + level;
						 break;
					 default:
						 url = 'http://webrd0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=' + col + '&y=' + row + '&z=' + level;
					 break;
					 }
					 return url;
				 }
			});
			this.esriLayer = new GaoDeTiledMapServiceLayer({id:this.id,layertype:this.esriLayerType});
		},
		hide: function () {
			this.esriLayer.hide();
		},
		show: function () {
			this.esriLayer.show();
		}
});
//百度地图图层扩展
BDLayer = DObject({
    id: null,
    esriLayer: null,
    esriLayerType: 'bd_vec',
    construct: function (options) {
        DUtil.extend(this, options);
        dojo.declare("BDTiledMapServiceLayer", esri.layers.TiledMapServiceLayer, {
            id: null,
            layertype: "bd_vec",//图层类型
            constructor: function (args) {
                this.spatialReference = new esri.SpatialReference(MapConfig.mapInitParams.bd_spatialReference);
                DUtil.extend(this, args);
                this.fullExtent = new esri.geometry.Extent({
                    xmin: MapConfig.params_bd.fullExtent.xmin,
                    ymin: MapConfig.params_bd.fullExtent.ymin,
                    xmax: MapConfig.params_bd.fullExtent.xmax,
                    ymax: MapConfig.params_bd.fullExtent.ymax,
                    spatialReference: this.spatialReference
                });
                this.initialExtent = this.fullExtent;
                this.tileInfo = new esri.layers.TileInfo(MapConfig.params_bd);
                this.loaded = true;
                this.onLoad(this);
            },
            /**
             * 根据不同的layType返回不同的图层
             * @param level
             * @param row
             * @param col
             * @returns {string}
             */
            getTileUrl: function (level, row, col) {
                var zoom = level - 1;
                var offsetX = parseInt(Math.pow(2, zoom));
                var offsetY = offsetX - 1;
                var numX = col - offsetX, numY = (-row) + offsetY;
                var num = (col + row) % 8 + 1;
                var url = "";
                switch (this.layertype) {
                    case "bd_vec"://矢量
                        url = "http://online" + num + ".map.bdimg.com/tile/?qt=tile&x=" + numX + "&y=" + numY + "&z=" + level + "&styles=pl&scaler=1&udt=20141103";
                        break;
                    case "bd_img"://影像
                        url = "http://shangetu" + num + ".map.bdimg.com/it/u=x=" + numX + ";y=" + numY + ";z=" + level + ";v=009;type=sate&fm=46&udt=20141015";
                        break;
                    case "bd_cva"://影像标注
                        url = "http://online" + num + ".map.bdimg.com/tile/?qt=tile&x=" + numX + "&y=" + numY + "&z=" + level + "&styles=sl&udt=20141015";
                        break;
                    default:
                        url = "http://online" + num + ".map.bdimg.com/tile/?qt=tile&x=" + numX + "&y=" + numY + "&z=" + level + "&styles=pl&scaler=1&udt=20141103";
                        break;
                }
                return url;
            }
        });
        this.esriLayer = new BDTiledMapServiceLayer({ id: this.id, layertype: this.esriLayerType });
    },
    hide: function () {
        this.esriLayer.hide();
    },
    show: function () {
        this.esriLayer.show();
    }
});
//天地图图层扩展
TDTLayer = DObject({
	id:null,
	esriLayer: null,
	esriLayerType:'vec',//默认矢量类型
		construct: function (options) {
			DUtil.extend(this, options);
			dojo.declare("TDTTiledMapServiceLayer", esri.layers.TiledMapServiceLayer, {
				id:null,
				layertype: "vec",//图层类型
				constructor: function (args) {
					this.spatialReference = new esri.SpatialReference(MapConfig.mapInitParams.spatialReference);
					DUtil.extend(this, args);
					this.fullExtent = new esri.geometry.Extent({
						xmin: MapConfig.params_tdt.fullExtent.xmin,
						ymin: MapConfig.params_tdt.fullExtent.ymin,
						xmax: MapConfig.params_tdt.fullExtent.xmax,
						ymax: MapConfig.params_tdt.fullExtent.ymax,
						spatialReference: this.spatialReference
					});
					this.initialExtent = this.fullExtent;
					this.tileInfo = new esri.layers.TileInfo(MapConfig.params_tdt);
					this.loaded = true;
					this.onLoad(this);
				},
				/**
				 * 根据不同的layType返回不同的图层
				 * @param level
				 * @param row
				 * @param col
				 * @returns {string}
				 */
				 getTileUrl: function (level, row, col) {
					 var url = "";
					 switch (this.layertype) {
					 case "vec"://矢量类型
						 url = "http://t" + col % 8 + ".tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
						 break;
					 case "cva"://矢量注记类型
						 url = "http://t" + row % 8 + ".tianditu.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
						 break;
					 case "img"://卫星类型
						 url = "http://t" + row % 8 + ".tianditu.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
						 break;	
					 case "cia"://卫星注记类型
						 url = "http://t" + row % 8 + ".tianditu.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
						 break;							 
					 default://矢量类型
						 url = "http://t" + col % 8 + ".tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
					     break;
					 }
					 return url;
				 }
			});
			this.esriLayer = new TDTTiledMapServiceLayer({id:this.id,layertype:this.esriLayerType});
		},
		hide: function () {
			this.esriLayer.hide();
		},
		show: function () {
			this.esriLayer.show();
		}
});

