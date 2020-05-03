if (typeof DCI == "undefined") { var DCI = {}; }
DCI.Catalog = {
    Html: "<div></div>"
        + "<div style=' height:5px;'></div>"
        + "<div id='CatalogTree'style='height:98%;'><ul id='ztreeThemeServerOfCatalog' class='ztree'><ul></div>",
    map: null,//地图对象
    treeObj: null,//保留tree对象
    Init: function (map) {
        DCI.Catalog.map = map;
        //setTimeout(function () {
        //    DCI.Catalog.LoadAllTree(MapConfig.zNodes);
        //}, 500);
        DCI.Catalog.InitTree();
    },
    /**
     * 初始化加载目录树
     */
    LoadAllTree: function (json) {
        for (var i = 0; i < json.length; i++) {
            if(json[i].layerid)
                DCI.Catalog.loadServerTypeMap("mapservice", json[i].layerurl, json[i].layerid);
        }
    },
    /**
     * 初始化加载目录树
     */
    InitTree: function () {
        var setting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onCheck: function (e, treeId, treeNode) {
                    if (treeNode.checked) {//勾选状态下,加载底图
                        if (treeNode.children) { //勾选专题目录
                            for (var i = 0; i < treeNode.children.length; i++) {
                                DCI.Catalog.loadServerTypeMap("mapservice", treeNode.children[i].layerurl, treeNode.children[i].layerid);

                            }
                        }
                        else {//勾选叶节点
                            DCI.Catalog.loadServerTypeMap("mapservice", treeNode.layerurl, treeNode.layerid);

                        }
                    }
                    else { //去掉勾选框,去掉底图
                        if (treeNode.children) { //专题目录
                            for (var i = 0; i < treeNode.children.length; i++) {
                                DCI.Catalog.deleteServerTypeMap(treeNode.children[i].layerid);
                            }
                        }
                        else {//叶节点
                            DCI.Catalog.deleteServerTypeMap(treeNode.layerid);
                        }
                    }
                }
            }
        };
        var ztreeRoleAuth = $("#ztreeThemeServerOfCatalog");
        var ztree = $.fn.zTree.init(ztreeRoleAuth, setting, MapConfig.zNodes);
        DCI.Catalog.treeObj = $.fn.zTree.getZTreeObj("ztreeThemeServerOfCatalog");
        DCI.Catalog.treeObj.expandAll(true);
    },
    /**
     * 删除指定ID的图层
     */
    deleteServerTypeMap: function (layerid) {
        //切换的服务图层对象
        var curLyr = DCI.Catalog.map.getLayer(layerid);
        if (curLyr)
            DCI.Catalog.map.removeLayer(curLyr);
    },
    /**
     * 加载不同类型地图服务的底图
     @ servertype 地图服务类型
     @ url 地图服务的url
     @ layerid 地图图层的id
     */
    loadServerTypeMap: function (servertype, url, layerid) {
        var curLyr;//切换的服务图层对象
        var visible=[];
        var ids = layerid.replace('layer', '');
        ids = parseInt(ids);
        visible.push(ids);
        switch (servertype.toLowerCase()) {//统一转换小写判断
            case 'mapserver_t':
                curLyr = new esri.layers.ArcGISTiledMapServiceLayer(url);
                curLyr.id = layerid;
                curLyr.setVisibleLayers(visible);
                break;
            case 'mapservice':
                var imageParameters = new esri.layers.ImageParameters();
                imageParameters.layerIds = [ids];
                imageParameters.layerOption = esri.layers.ImageParameters.LAYER_OPTION_SHOW;
                imageParameters.transparent = true;
                curLyr = new esri.layers.ArcGISDynamicMapServiceLayer(url,
                    {
                        "imageParameters": imageParameters
                        //"infoTemplates": {
                        //    0: {
                        //        "infoTemplate": new esri.InfoTemplate("${NAME}", "${NAME}")
                        //    }
                        //}
                    });
                curLyr.id = layerid;
                curLyr.setVisibleLayers(visible);
                break;
            default://默认
                promptdialog("提示信息", "二维地图模式下,勾选图层中出现识别不到的地图服务类型,请检查是否符合正确的地图服务类型标准!");
                break;
        }
        if (curLyr)
            DCI.Catalog.map.addLayer(curLyr);

    },



}