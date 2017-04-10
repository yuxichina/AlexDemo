//名称：GoogleCacheLayer
//作者：GIS-Client Team YC
//说明：GoogleCacheLayer
//更新
//2012-7-26
(function ($, xf) {
    // ArcGIS缓存图层
    xf.BaiDuCacheLayer = function (url) {
        xf.ImageLayer.apply(this, [url]);
        /*******************************************属性*********************************/
        /*公有*/
        //类型
        this.type = "XiaoFu.BaiDuCacheLayer";
        //服务地址
        this.serverUrl = "";
        //最大可见比例尺
        this.maxScale = null;
        //最小可见比例尺
        this.minScale = null;
        //名称
        this.name = null;
        //服务端图层列表
        this.layers = null;
        //分幅信息
        this.tileInfo = null;
        //图片格式
        this.picFormat = "png";
        //Dpi
        this.dpi = null
        //起始点
        this.origin = null;
        //分幅信息
        this.lods = null;
        //单位
        this.units = null;
        //分幅大小
        this.tileSize = 256;
        //状态 0未初始化 1加载Container 2未加载地图 3加载完毕 4更新中 5放大中
        this.status = 0;
        //当前范围
        this.currentExtent = null;
        //加载范围 
        this.loadExtent = null;
        //当前分辨率
        this.resolution = null;
        //加载比例尺
        this.level = 3;
        //Layer Container的偏移
        this.containerOffset = null;
        //图层中心点
        this.center = null;
        //地图
        this.map = null;
        //加载图片对象
        this.cacheImages = new Array();
        //
        this.tempID = "";
        /*私有*/
        var _layer = this;
        var _params = null;
        var _cacheImagesList = new Array();
        var _loadImageCount = 0;
        var _loadedImageCount = 0;
        /*****************************************************方法*****************************************/

        /*公有*/
        //设置参数
        this.setParams = function () {
            _params = new Object();
            _layer.origin = _params.origin = new xf.GeoPoint(0, 0);
            _layer.currentExtent = _layer.fullExtent = new xf.Extent(-180, -90, 180, 90);
            _layer.center = _params.center = _layer.currentExtent.center();
            _layer.level = 3;
            _layer.lods = _params.lods = new Array();
            for (var i = 0; i < 12; i++) {
                var lod = new Object();
                lod.z = i;

                //lod.resolution = lod.tileWidth / _layer.tileSize;
                //1 0.232808
                //lod.resolution = 1 / lod.resolution;
                //if (i == 0) { 1.185365 1.177427
                lod.resolution = 1.185365 / Math.pow(2, i);
                lod.tileWidth = _layer.tileSize * lod.resolution;
                lod.tileHeight = _layer.tileSize * lod.resolution;
                //}
                //else if (i == 1) {
                //   lod.resolution = 0.588714;
                //}
                // else if (i == 2) {
                //    lod.resolution = 0.294356;
                // }
                _layer.lods.push(lod);
            }
            _layer.resolution = _layer.lods[_layer.level].resolution;
        };
        //获取参数
        this.getParams = function () {
            return _params;
        };
        //获取中心点
        this.getCenter = function () {
            var ext = _layer.currentExtent;
            return ext.center();
        };
        //初始化
        this.init = function (layerId) {
            this.status = 1;
            var layerMask = $("<div></div>")
                            .attr("id", layerId + "_Mask")
                            .css("width", "100%")
                            .css("height", "100%")
                            .css("position", "absolute")
                            .css("z-index", map.LayerIndexList.BaseLayer + map.layers.length)
                                .appendTo($("#layerContainer"));
            var layerContainer = $("<div></div>")
                                .attr("id", layerId)
                                .css("width", "100%")
                                .css("height", "100%")
                                .css("position", "relative")
                                .appendTo(layerMask);
            this.container = layerContainer;
            if (_params) {
                this.update();
            }
        };
        //图层刷新
        this.update = function (extent) {
            var tempID = _layer.tempID = Math.round(Math.random() * 1000);
            var center = null;
            if (_layer.status == 1) {
                _layer.status = 2;
                center = this.getCenter();
            }
            else {
                if (_layer.status == 5) { }
                else {
                    _layer.status = 4;
                }
                center = _layer.map.getCenter();
            }
            //地图中心点

            //地图容器
            var mapContainer = $(this.map.container);
            var x_g = this.getGeoViewByRes(this.resolution).x;
            var y_g = this.getGeoViewByRes(this.resolution).y;
            //更新范围
            if (!extent) {
                extent = this.currentExtent = new xf.Extent(
                center.x - x_g / 2,
                center.y - y_g / 2,
                center.x + x_g / 2,
                center.y + y_g / 2);
            }
            else {
                this.currentExtent = extent;
            }
            //加载最大范围
            var maxExtent = this.loadExtent = this.getLoadMaxExtent(this.resolution);
            var startTile = this.getLeftTopTile();
            var stopTile = this.getRightBottomTile();
            var numTileCols = (stopTile.x - startTile.x) + 1;
            var numTileRows = (stopTile.y - startTile.y) + 1;
            //showMsg(stopTile.x + "," + stopTile.y + "," + startTile.x + "," + startTile.y);
            var offsetX = (maxExtent.minX - extent.minX) / (this.resolution);
            var offsetY = (extent.maxY - maxExtent.maxY) / (this.resolution);
            this.containerOffset = { x: offsetX, y: offsetY };
            var container = this.container.attr("id");
            var level = this.level;
            //清空img
            $("#" + container).find("img").remove();

            _loadedImageCount = 0;
            if (xf.Utils.isFunction(_layer.statusChange)) {
                _layer.statusChange(_layer.status);
            }
            this.cacheImages = new Array();
            _loadImageCount = numTileCols * numTileRows;
            //_loadImageCount = 0;
            var cols = new Array();
            for (var i = 0; i < numTileCols; i++) {
                var rows = new Array();
                for (var k = 0; k < numTileRows; k++) {
                    var x = startTile.x + i;
                    var y = startTile.y + k;
                    var z = this.level;

                    var offsetX2 = Math.pow(2, z - 2);
                    var offsetY2 = offsetX2 - 1;
                    showMsg(offsetX2);
                    // 2    -3
                    // 4    -1
                    // 8    -1
                    // x = x - offsetX2;
                    //                    if (offsetX2 == 2) {
                    //                        y = -y + offsetY2 - 2;
                    //                    }
                    //                    else if (offsetX2 == 4) {
                    //                        y = -y + offsetY2 - 4;
                    //                    }
                    //                    else if (offsetX2 == 8) {
                    //                        y = -y + offsetY2 - 8;
                    //                    }
                    //                    else {
                    y = -1 - y;
                    // }

                    // y = -1 - y;
                    x = x.toString().replace("-", "M");
                    y = y.toString().replace("-", "M");
                    var imgUrl = this.url;
                    var server = Math.round(Math.random() * 3) + 1;
                    imgUrl = imgUrl.replace("{0}", server);
                    imgUrl = imgUrl.replace("{1}", x);
                    imgUrl = imgUrl.replace("{2}", y);
                    imgUrl = imgUrl.replace("{3}", z + 1);
                    var id = this.id + "_" + x + "_" + y + "_" + z + "_" + tempID;
                    var tileExtent = this.getTileExtent(x, y);
                    var fullExtent = this.fullExtent;
                    if (this.incluedExtent(tileExtent, fullExtent) && 2 > 3) {
                        url = ""; // "http://www.baidu.com/img/baidu_sylogo1.gif";
                        _loadedImageCount++;
                        if (_loadedImageCount == _loadImageCount) {
                            _layer.status = 3;
                            if (xf.Utils.isFunction(_layer.statusChange)) {
                                _layer.statusChange(_layer.status);
                            }
                        }
                    }
                    else {
                        var img = _layer.getImgFromCache(id);
                        if (img) {
                            $(img).css("width", this.tileSize)
                        .css("height", this.tileSize)
                        .css("position", "absolute")
                        .css("top", Math.floor(this.tileSize * k + offsetY))
                        .css("left", Math.floor(this.tileSize * i + offsetX))
                        .appendTo($("#" + container));
                            _loadedImageCount++;
                            if (_loadedImageCount == _loadImageCount) {
                                _layer.status = 3;
                                if (xf.Utils.isFunction(_layer.statusChange)) {
                                    _layer.statusChange(_layer.status);
                                }
                            }
                        }
                        else {
                            img = $("<img/>")
                                    .attr("src", imgUrl)
                                    .attr("id", id)
                                    .css("width", this.tileSize)
                                    .css("height", this.tileSize)
                                    .css("position", "absolute")
                                  .css("top", Math.floor(this.tileSize * k + offsetY))
                        .css("left", Math.floor(this.tileSize * i + offsetX))
                                    .css("border", "0px solid white")
                                    .load(function () {
                                        var cacheZ = this.id.split("_")[3];
                                        var tID = this.id.split("_")[4];
                                        if (cacheZ == _layer.level && tID == _layer.tempID) {
                                            $(this).appendTo($("#" + container));
                                            _layer.addImgToCache(this);
                                            _loadedImageCount++;
                                            if (_loadedImageCount == _loadImageCount) {
                                                _layer.status = 3;
                                                if (xf.Utils.isFunction(_layer.statusChange)) {
                                                    _layer.statusChange(_layer.status);
                                                }
                                            }
                                        }
                                    });
                        }
                    }
                    rows.push({ url: url, id: id, extent: tileExtent, img: img });
                }
                cols.push(rows);
            }

            this.cacheImages = cols;
            this.updateMap();
        };
        //从缓存中获取Img
        this.getImgFromCache = function (id) {
            var img = null;
            var valueId = _layer.getXYZID(id);

            for (var i = 0; i < _cacheImagesList.length; i++) {
                var item = _cacheImagesList[i];
                var itemID = _layer.getXYZID(item.id);

                if (itemID == valueId) {
                    return null;
                }
            }
            return null;
        };
        this.getXYZID = function (id) {
            var xyzIDs = id.split("_");
            var xyzID = "";
            for (var i = 0; i < xyzIDs.length - 1; i++) {
                xyzID += xyzIDs[i];
            }
            return xyzID;
        }
        this.addImgToCache = function (img) {
            if (_cacheImagesList.length > 1000) {
                _cacheImagesList.shift();
            }
            _cacheImagesList.push(img);
        };
        //更新地图空间参数
        this.updateMap = function () {
            //alert(_layer.status);
            if (_layer.status == 2 || _layer.status == 5) {
                this.map._setCenter(this.getCenter());
                this.map._finishBaseLayerInit();
            }
            this.map._setResolution(this.resolution);
            //this.map._setExtent(this.currentExtent);
        };
        //偏移缓存
        this.offsetCache = function (x, y, update) {
            var center = this.getCenter();
            x = -x;
            y = -y;
            this.center = center = new xf.GeoPoint(center.x + x * this.resolution, center.y - y * this.resolution);
            var x_g = $(this.map.container).width() * this.resolution;
            var y_g = $(this.map.container).height() * this.resolution;
            var newExtent = new xf.Extent(center.x - x_g / 2, center.y - y_g / 2, center.x + x_g / 2, center.y + y_g / 2);
            if (update) {
                this.update(newExtent);
            }
        };
        //缩放 缩放中心点 缩放比例  
        this.zoom = function (center, radio, offset) {
            var tempLevel = this.level;
            var level = this.level + radio;
            if (this.levelInLods(level)) {
                this.level = level;
                var res = this.resolution = this.lods[this.level].resolution;
                if (offset && !map.zoomByCenter) {
                    var nowRes = res;
                    var formatRes = this.lods[tempLevel].resolution;
                    var offsetX = (offset.x - center.x) / formatRes;
                    var offsetY = (offset.y - center.y) / formatRes;
                    var newOffsetX = offsetX * nowRes;
                    var newOffsetY = offsetY * nowRes;
                    var nowCenter = new xf.GeoPoint(offset.x - newOffsetX, offset.y - newOffsetY);
                    this.center = nowCenter;
                    this.map._setCenter(nowCenter);
                }
                else {
                    this.center = center;
                }
                var zoomExtent = this.getViewExtentByCenter(this.center, res);
                this.status = 5;
                this.update(zoomExtent);

                //this.updateMap();
            }
            else {
                if (xf.Utils.isFunction(_layer.statusChange)) {
                    _layer.statusChange(_layer.status);
                }
            }
        };
        //Utils
        //级别是否在范围内
        this.levelInLods = function (level) {
            if (this.lods && level < this.lods.length && level >= 0) {
                return true;
            }
            else {
                return false;
            }
        };
        //根据中心点和分辨率 获取可视范围
        this.getViewExtentByCenter = function (center, res) {
            var geoView = this.getGeoViewByRes(res);
            var newExtent = new xf.Extent(center.x - geoView.x / 2, center.y - geoView.y / 2, center.x + geoView.x / 2, center.y + geoView.y / 2);
            return newExtent;
        };
        //根据分辨率获取可视范围
        this.getGeoViewByRes = function (res) {
            var x_g = $(this.map.container).width() * res;
            var y_g = $(this.map.container).height() * res;
            return { x: x_g, y: y_g };
        };
        //是否包含
        this.incluedExtent = function (e1, e2) {
            if (e1.maxX < e2.minX || e1.minX > e2.maxX || e1.minY > e2.maxY || e1.maxY < e2.minY) {
                return true;
            }
            else {
                return false;
            }
        };
        //获取分幅图片范围
        this.getTileExtent = function (tileX, tileY) {
            var minX = this.origin.x + (tileX * this.tileSize * this.resolution);
            var maxX = minX + (1 * this.tileSize * this.resolution);
            var maxY = this.origin.y - (tileY * this.tileSize * this.resolution);
            var minY = maxY - (1 * this.tileSize * this.resolution);
            return new xf.Extent(minX, minY, maxX, maxY);
        };
        //10转16
        this.zeroPad = function (num, len, radix) {
            var str = num.toString(radix || 10);
            while (str.length < len) {
                str = "0" + str;
            }
            return str;
        };
        //获取某点的Tile分幅信息
        this.getContainingTileCoords = function (point, res) {
            var w = Math.floor((point.x - this.origin.x) / (this.tileSize * res));
            var h = Math.floor((this.origin.y - point.y) / (this.tileSize * res));
            return { x: w, y: h };
        };
        //获取左上角Tile信息
        this.getLeftTopTile = function () {
            var lt = new xf.GeoPoint(this.currentExtent.minX, this.currentExtent.maxY);
            return this.getContainingTileCoords(lt, this.resolution);
        };
        //获取右下角Tile信息
        this.getRightBottomTile = function () {
            var rb = new xf.GeoPoint(this.currentExtent.maxX, this.currentExtent.minY);
            return this.getContainingTileCoords(rb, this.resolution);
        };
        //根据分辨率获取最大加载范围
        this.getLoadMaxExtent = function (resolution) {
            var startTile = this.getLeftTopTile();
            var stopTile = this.getRightBottomTile();
            var numTileCols = Math.ceil($(this.map.container).width() / this.tileSize) + 1;
            var numTileRows = Math.ceil($(this.map.container).height() / this.tileSize) + 1;
            var minX = this.origin.x + (startTile.x * this.tileSize * resolution);
            var maxX = minX + (numTileCols * this.tileSize * resolution);
            var maxY = this.origin.y - (startTile.y * this.tileSize * resolution);
            var minY = maxY - (numTileRows * this.tileSize * resolution);
            return new xf.Extent(minX, minY, maxX, maxY);
        };
        /*私有*/
        //初始化Layer
        init = function () {
            var args = _layer.constructor.arguments;
            if (args) {
                if (args[0]) {
                    if (xf.Utils.isString(args[0])) {
                        _layer.url = args[0];
                        initLayer(_layer);
                    }
                    else {
                        _layer.setParams(args[0], _layer);
                        if (_layer.container) {
                            _layer.update();
                        }
                    }
                }
            }
        };
        initLayer = function () {
            //            $.ajax({
            //                url: _layer.url,
            //                dataType: "json",
            //                success: function (data) {
            _layer.setParams();
            if (_layer.container) {
                _layer.update();
            }
            //                }
            //            });
        };
        /************************************************事件***************************************/
        //事件
        this.statusChange = null;
        init();
    };
})(jQuery, XiaoFu);