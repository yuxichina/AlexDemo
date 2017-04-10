//名称：GoogleCacheLayer
//作者：GIS-Client Team YC
//说明：GoogleCacheLayer
//更新
//2012-7-26
(function ($, xf) {
    // ArcGIS缓存图层
    xf.GoogleCacheLayer = function (url) {
        xf.ImageLayer.apply(this, [url]);
        /*******************************************属性*********************************/
        /*公有*/
        //类型
        this.type = "XiaoFu.GoogleCacheLayer";
        //服务地址
        this.serverUrl = "";
        //图片格式
        this.picFormat = "png";
        //起始点
        this.origin = null;
        //分幅信息
        this.lods = null;
        //单位
        this.units = null;
        this.level = 0;
        //图层状态
        this.LayerStatus = { UnInit: 0, StartCreateContainer: 1, FinishCreateContainer: 2, StartInitParam: 3, FinishInitParam: 4, StartUpdate: 5, FinishUpdate: 6, StartZoom: 7, FinishZoom: 8, Loaded: 9 };
        //状态 0未初始化 1加载Container 2未加载地图 3加载完毕 4更新中 5放大中
        this.status = this.LayerStatus.UnInit;

        this.layerMask = null;
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
            _layer._setLayerStatus(_layer.LayerStatus.StartInitParam);
            _params = new Object();
            _layer.origin = _params.origin = new xf.GeoPoint(-20037508.342789244, 20037508.342789244);
            _layer.currentExtent = new xf.Extent(7142275.922966868, 2338361.569300118, 16926215.54346943, 7230331.379551399);
            _layer.fullExtent = new xf.Extent(-20037508.342789244, -19929239.112930678, 20037508.342789244, 19929239.112930678);
            _layer.spatialReference = "EPSG:900913";
            _layer.level = 3;
            _layer.lods = _params.lods = new Array();
            var res = 20037508.342789244 * 2 / 256;
            for (var i = 0; i < 22; i++) {
                var lod = new Object();
                lod.z = i + 1;
                lod.tileWidth = -_params.origin.x / Math.pow(2.0, i);
                lod.tileHeight = _params.origin.y / Math.pow(2.0, i);
                lod.resolution = res;
                res *= .5;
                _layer.lods.push(lod);
            }
            _layer.resolution = _layer.lods[_layer.level].resolution;
            _layer._setLayerStatus(_layer.LayerStatus.FinishInitParam);
        };
        //获取参数
        this.getParams = function () {
            return _params;
        };
        //初始化
        this.create = function (layerId, resExtent) {
            _layer._setLayerStatus(_layer.LayerStatus.StartCreateContainer);
            _layer.layerMask = $("<div></div>")
                            .attr("id", layerId + "_Mask")
                            .css("width", "100%")
                            .css("height", "100%")
                            .addClass("Mask")
                            .css("position", "absolute")
                            .css("z-index", map.LayerIndexList.BaseLayer + map.layers.length)
                                .appendTo($("#layerContainer"));
            var layerContainer = $("<div></div>")
                                .attr("id", layerId)
                                .css("width", "100%")
                                .css("height", "100%")
                                .css("opacity", _layer.getOpacity())
                                .css("position", "relative")
                                .appendTo(_layer.layerMask);
            this.container = layerContainer;
            if (_layer.getVisiable()) {
                _layer.show();
            }
            else {
                _layer.hide();
            }
            _layer._setLayerStatus(_layer.LayerStatus.FinishCreateContainer);
            if (resExtent) {
                var mix = _layer._getMixParamsByExtent(resExtent);
                _layer.level = mix.level;
                _layer.resolution = mix.res;
                _layer.currentExtent = mix.extent;
                _layer.map._setCenter(_layer.currentExtent.center());
                _layer.map._setResolution(_layer.resolution);
                _layer.map._setLevel(_layer.level);
            }
            _layer.update();
        };
        //图层刷新
        this.update = function (extent) {
            var tempID = _layer.tempID = xf.Utils.random();
            var center = null;
            if (_layer.status <= _layer.LayerStatus.FinishInitParam) {
                center = _layer.getCenter();
            }
            else {
                if (_layer.status == _layer.LayerStatus.StartZoom) {
                    //放大
                }
                else {
                    //其他更新
                    _layer._setLayerStatus(_layer.LayerStatus.StartUpdate);
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
            var offsetX = (maxExtent.minX - extent.minX) / (this.resolution);
            var offsetY = (extent.maxY - maxExtent.maxY) / (this.resolution);
            this.containerOffset = { x: offsetX, y: offsetY };
            var container = this.container.attr("id");
            var level = this.level;
            //清空img
            $("#" + container).find("img").remove();

            _loadedImageCount = 0;

            this.cacheImages = new Array();
            _loadImageCount = numTileCols * numTileRows;
            var cols = new Array();
            ///
            //_layer.layerMask.css("top", Math.round(offsetY))
            //            .css("left", Math.round(offsetX));


            ///


            for (var i = 0; i < numTileCols; i++) {
                var rows = new Array();
                for (var k = 0; k < numTileRows; k++) {
                    var x = startTile.x + i;
                    var y = startTile.y + k;
                    var z = this.level;
                    var imgUrl = this.url;
                    var server = Math.round(Math.random() * 3);
                    imgUrl = imgUrl.replace("{0}", server);
                    imgUrl = imgUrl.replace("{1}", x);
                    imgUrl = imgUrl.replace("{2}", y);
                    imgUrl = imgUrl.replace("{3}", z);
                    var id = this.id + "_" + x + "_" + y + "_" + z + "_" + tempID;
                    var tileExtent = this.getTileExtent(x, y);
                    var fullExtent = this.fullExtent;
                    if (x < 0 || y < 0 || x > Math.pow(2, z) - 1 || y > Math.pow(2, z) - 1) {
                        url = ""; // "http://www.baidu.com/img/baidu_sylogo1.gif";
                        _loadedImageCount++;
                        if (_loadedImageCount == _loadImageCount) {
                            _layer._setLayerStatus(_layer.LayerStatus.Loaded);
                        }
                    }
                    else {
                        var img = _layer.getImgFromCache(id);
                        // img = null;
                        if (img) {
                            $(img).css("width", this.tileSize)
                        .css("height", this.tileSize)
                        .css("position", "absolute")
                        .css("top", Math.round(this.tileSize * k + offsetY))
                           .css("left", Math.round(this.tileSize * i + offsetX))
                        .appendTo($("#" + container));
                            _loadedImageCount++;
                            if (_loadedImageCount == _loadImageCount) {
                                _layer._setLayerStatus(_layer.LayerStatus.Loaded);
                            }
                        }
                        else {
                            img = $("<img/>")
                                    .attr("src", imgUrl)
                                    .attr("id", id)
                                    .css("width", this.tileSize)
                                    .css("height", this.tileSize)
                                    .css("position", "absolute")
                                    .css("top", Math.round(this.tileSize * k + offsetY))
                                    .css("left", Math.round(this.tileSize * i + offsetX))
                                    .css("pointer-events", "none")
                            //.css("border", "1px solid white")
                                    .load(function () {
                                        var cacheZ = this.id.split("_")[3];
                                        var tID = this.id.split("_")[4];
                                        if (_layer == null || _layer.level == null) { return; }
                                        if (cacheZ == _layer.level && tID == _layer.tempID) {
                                            $(this).appendTo($("#" + container));
                                            _layer.addImgToCache(this);
                                            _loadedImageCount++;
                                            if (_loadedImageCount == _loadImageCount) {
                                                _layer._setLayerStatus(_layer.LayerStatus.Loaded);
                                            }
                                        }
                                    })
                                    .bind("error", function () {
                                        var cacheZ = this.id.split("_")[3];
                                        var tID = this.id.split("_")[4];
                                        if (_layer == null || _layer.level == null) { return; }
                                        if (cacheZ == _layer.level && tID == _layer.tempID) {
                                            $(this).appendTo($("#" + container));
                                            _layer.addImgToCache(this);
                                            _loadedImageCount++;
                                            if (_loadedImageCount == _loadImageCount) {
                                                _layer._setLayerStatus(_layer.LayerStatus.Loaded);
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
                    return item;
                }
            }
            return null;
        };
        //从ID中解析Tile信息
        this.getXYZID = function (id) {
            var xyzIDs = id.split("_");
            var xyzID = "";
            for (var i = 0; i < xyzIDs.length - 1; i++) {
                xyzID += xyzIDs[i];
            }
            return xyzID;
        }
        //将图片添加到缓存中
        this.addImgToCache = function (img) {
            if (_cacheImagesList.length > 1000) {
                _cacheImagesList.shift();
            }
            _cacheImagesList.push(img);
        };
        //更新地图空间参数
        this.updateMap = function () {
            if (_layer.status == _layer.LayerStatus.FinishInitParam || _layer.status == _layer.LayerStatus.FinishCreateContainer) {

                if (_layer.isBaseLayer) {
                    _layer.map._setCenter(_layer.getCenter());
                    var evt = new xf.Event();
                    evt.layer = _layer;
                    _layer.dispatchEvent("layerinit", evt);
                }
            }
            if (_layer.isBaseLayer) {
                _layer.map._setResolution(_layer.resolution);
                _layer.map._setLevel(_layer.level);
            }
        };
        //偏移缓存
        this.offsetCache = function (x, y, update) {
            var center = this.getCenter();
            x = -x;
            y = -y;
            _layer.center = center = new xf.GeoPoint(center.x + x * _layer.resolution, center.y - y * _layer.resolution);
            var x_g = $(this.map.container).width() * this.resolution;
            var y_g = $(this.map.container).height() * this.resolution;
            var newExtent = new xf.Extent(center.x - x_g / 2, center.y - y_g / 2, center.x + x_g / 2, center.y + y_g / 2);
            if (update) {
                this.update(newExtent);
            }
        };
        //缩放 缩放中心点 缩放比例  
        this.zoom = function (center, radio, offset) {
            var tempLevel = _layer.level;
            var level = _layer.level + radio;
            if (this.levelInLods(level)) {
                this.level = level;
                var res = _layer.resolution = _layer.lods[_layer.level].resolution;
                var zoomCenter = null;
                if (offset && !map.zoomByCenter) {
                    var nowRes = res;
                    var formatRes = _layer.lods[tempLevel].resolution;
                    var offsetX = (offset.x - center.x) / formatRes;
                    var offsetY = (offset.y - center.y) / formatRes;
                    var newOffsetX = offsetX * nowRes;
                    var newOffsetY = offsetY * nowRes;
                    var nowCenter = new xf.GeoPoint(offset.x - newOffsetX, offset.y - newOffsetY);
                    zoomCenter = nowCenter;
                    _layer.map._setCenter(nowCenter);
                }
                else {
                    zoomCenter = center;
                    _layer.map._setCenter(center);
                }
                var zoomExtent = _layer.getViewExtentByCenter(zoomCenter, res);
                _layer._setLayerStatus(_layer.LayerStatus.StartZoom);
                _layer.update(zoomExtent);
            }
            else {
                _layer._setLayerStatus(_layer.status);
            }
        };
        //Utils
        //级别是否在范围内
        this.levelInLods = function (level) {
            if (_layer.lods && level < _layer.lods.length && level >= 0) {
                if (level == 0) { return { type: "min" }; }
                else if (level == _layer.lods.length - 1) { return { type: "max" }; }
                else {
                    return { type: "normal" };
                }
            }
            else {
                return null;
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
        //获取分幅图片范围
        this.getTileExtent = function (tileX, tileY) {
            var minX = this.origin.x + (tileX * this.tileSize * this.resolution);
            var maxX = minX + (1 * this.tileSize * this.resolution);
            var maxY = this.origin.y - (tileY * this.tileSize * this.resolution);
            var minY = maxY - (1 * this.tileSize * this.resolution);
            return new xf.Extent(minX, minY, maxX, maxY);
        };
        //获取某点的Tile分幅信息
        this.getContainingTileCoords = function (point, res) {
            var w = Math.max(Math.floor((point.x - this.origin.x) / (this.tileSize * res)), 0);
            var h = Math.max(Math.floor((this.origin.y - point.y) / (this.tileSize * res)), 0);
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
        //获取中心点
        this.getCenter = function () {
            var ext = _layer.currentExtent;
            return ext.center();
        };

        //私有方法
        this._setLayerStatus = function (status) {
            _layer.status = status;
            var evt = new xf.Event();
            evt.status = _layer.status;
            evt.layer = _layer;
            _layer.dispatchEvent("layerstatechange", evt);
        };
        this._getMixParamsByExtent = function (resExtent) {
            var geoW = resExtent.width();
            var geoH = resExtent.height();
            var w = _layer.map.viewSize.w;
            var h = _layer.map.viewSize.h;
            var mixWRes = _layer._getMixRes(geoW / w);
            var mixHRes = _layer._getMixRes(geoW / w);
            var mixRes = Math.min(mixWRes, mixHRes);
            var mixLevel = _layer._getResIndex(mixRes);
            var center = resExtent.center();
            var mixExtent = new xf.Extent(center.x - mixRes * w / 2, center.y - mixRes * h / 2, center.x + mixRes * w / 2, center.y + mixRes * h / 2);
            return { extent: mixExtent, level: mixLevel, res: mixRes };
        };
        this._getMixRes = function (res) {
            var baseLayer = _layer;
            var lods = baseLayer.lods;
            var mixRes;
            var mixOffset;
            for (var i in lods) {
                var t_res = lods[i].resolution;
                var offset = Math.abs(res - t_res);
                if (!mixRes) {
                    mixRes = t_res;
                    mixOffset = offset;
                }
                else {
                    if (mixOffset > offset) {
                        mixRes = t_res;
                        mixOffset = offset;
                    }
                }
            }
            return mixRes;
        };
        //获取分辨率顺序
        this._getResIndex = function (res) {
            var baseLayer = _layer;
            var lods = baseLayer.lods;
            var mixRes;
            for (var i in lods) {
                var t_res = lods[i].resolution;
                if (t_res == res) {
                    return parseInt(i);
                }
            }
            return -1;
        };
        this.destory = function () {
            $(_layer.layerMask).remove();
            _layer = null;
            delete _layer;
        };
        /*私有*/
        //初始化Layer
        init = function () {
            var args = _layer.constructor.arguments;
            if (args) {
                if (args[0]) {
                    _layer.setParams(args[0], _layer);
                }
            }
        };
        /************************************************事件***************************************/
        //事件
        this.statusChange = null;
        init();
    };
})(jQuery, XiaoFu);