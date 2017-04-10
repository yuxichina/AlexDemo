//名称：ArcGISCacheLayer
//作者：GIS-Client Team YC
//说明：对接ArcGISCache图层
//更新
//2012-7-16
(function ($, xf) {
    // ArcGIS缓存图层
    xf.ArcGISCacheLayer = function (url) {
        xf.ImageLayer.apply(this, [url]);
        /*******************************************属性*********************************/
        /*公有*/
        //类型
        this.type = "XiaoFu.ArcGISCacheLayer";
        //最大可见比例尺
        this.maxScale = null;
        //最小可见比例尺
        this.minScale = null;
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
        //图层状态
        this.LayerStatus = { UnInit: 0, StartCreateContainer: 1, FinishCreateContainer: 2, StartInitParam: 3, FinishInitParam: 4, StartUpdate: 5, FinishUpdate: 6, StartZoom: 7, FinishZoom: 8, Loaded: 9 };
        //状态 0未初始化 1加载Container 2未加载地图 3加载完毕 4更新中 5放大中
        this.status = this.LayerStatus.UnInit;
        /*私有*/
        var _layer = this;
        var _params = null;
        var _cacheImagesList = new Array();
        var _loadImageCount = 0;
        var _loadedImageCount = 0;
        /*****************************************************方法*****************************************/
        /*公有*/
        //设置参数
        this.setParams = function (params) {
            //_layer.status = _layer.LayerStatus.StartInitParam;
            _layer._setLayerStatus(_layer.LayerStatus.StartInitParam);
            _params = params;
            //加载级别
            _layer.level = 3;
            _layer.spatialReference = params.spatialReference;
            _layer.maxScale = params.maxScale;
            _layer.minScale = params.minScale;
            _layer.name = params.mapName;
            _layer.layers = params.layers;
            _layer.tileInfo = params.tileInfo;
            _layer.format = params.format;
            _layer.dpi = params.dpi;
            _layer.origin = _layer.tileInfo.origin;
            _layer.lods = _layer.tileInfo.lods;
            _layer.tileSize = _layer.tileInfo.rows;
            _layer.initialExtent = new xf.Extent(params.initialExtent.xmin, params.initialExtent.ymin, params.initialExtent.xmax, params.initialExtent.ymax);
            _layer.fullExtent = new xf.Extent(params.fullExtent.xmin, params.fullExtent.ymin, params.fullExtent.xmax, params.fullExtent.ymax);
            _layer.units = params.units;
            _layer.resolution = _layer.lods[_layer.level].resolution;
            _layer.center = _layer.initialExtent.center();
            var upperLeft = new xf.GeoPoint(
                   _layer.fullExtent.minX,
                    _layer.fullExtent.minY
                );
            var bottomRight = new xf.GeoPoint(
                   _layer.fullExtent.maxX,
                    _layer.fullExtent.maxY
                );
            for (var i = 0; i < _layer.lods.length; i++) {
                var start = _layer.getContainingTileCoords(upperLeft, _layer.lods[i].resolution);
                _layer.lods[i].startTileCol = start.x;
                _layer.lods[i].startTileRow = start.y;
                var end = _layer.getContainingTileCoords(bottomRight, _layer.lods[i].resolution);
                _layer.lods[i].endTileCol = end.x;
                _layer.lods[i].endTileRow = end.y;
            }
            //this.map._finishBaseLayerInit();
            _layer.currentExtent = _layer.initialExtent;
            //            if (XiaoFu.Utils.isFunction(_layer.paramsLoaded)) {
            //                _layer.paramsLoaded(_layer.fullExtent, _layer.lods);
            //            }
            // _layer.status = _layer.LayerStatus.FinishInitParam;

            _layer._setLayerStatus(_layer.LayerStatus.FinishInitParam);

        };
        //获取参数
        this.getParams = function () {
            return _params;
        };
        //初始化
        this.create = function (layerId, resExtent) {
            this.id = layerId;
            _layer._setLayerStatus(_layer.LayerStatus.StartCreateContainer);
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
                                .css("opacity", _layer.getOpacity())
                                .css("position", "relative")
                                .appendTo(layerMask);
            _layer.container = layerContainer;
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
            //地图容器
            var mapContainer = $(_layer.map.container);
            var x_g = _layer.getGeoViewByRes(_layer.resolution).x;
            var y_g = _layer.getGeoViewByRes(_layer.resolution).y;
            //更新范围
            if (!extent) {
                extent = _layer.currentExtent = new xf.Extent(
                center.x - x_g / 2,
                center.y - y_g / 2,
                center.x + x_g / 2,
                center.y + y_g / 2);
            }
            else {
                _layer.currentExtent = extent;
            }

            //
            var containerX = Math.round(extent.minX / this.resolution);
            var containerY = Math.round(extent.maxY / this.resolution);
            this.container.css("left", -containerX).css("top", containerY);

            //加载最大范围
            var maxExtent = _layer.loadExtent = _layer.getLoadMaxExtent(_layer.resolution);
            var startTile = _layer.getLeftTopTile();
            var stopTile = _layer.getRightBottomTile();
            var numTileCols = (stopTile.x - startTile.x) + 1;
            var numTileRows = (stopTile.y - startTile.y) + 1;
            var offsetX = (maxExtent.minX - extent.minX) / (_layer.resolution);
            var offsetY = (extent.maxY - maxExtent.maxY) / (_layer.resolution);
            _layer.containerOffset = { x: offsetX, y: offsetY };
            var container = _layer.container.attr("id");
            var level = _layer.level;
            //清空img
            //$("#" + container).find("img").remove();
            var imgCache = $("#" + container).find("img");
            var imgLength = imgCache.length;
            for (var i = 0; i < imgLength; i++) {
                var img = $(imgCache[i]);
                var id = img.attr("id");
                var xyz = _layer.getXYZFromID(id);
                var tileExtent = _layer.getTileExtent(xyz.x, xyz.y);
                var include = _layer.incluedExtent(tileExtent, maxExtent);
                if (!include || xyz.z != 'L' + _layer.zeroPad(_layer.level, 2, 10)) {
                    img.remove();
                    //i--;
                    //imgLength--;
                }
            }
            _loadedImageCount = 0;
            _layer.cacheImages = new Array();
            _loadImageCount = numTileCols * numTileRows;
            var cols = new Array();
            for (var i = 0; i < numTileCols; i++) {
                var rows = new Array();
                for (var k = 0; k < numTileRows; k++) {
                    var x = 'C' + _layer.zeroPad(startTile.x + i, 8, 16);
                    var y = 'R' + _layer.zeroPad(startTile.y + k, 8, 16);
                    var z = 'L' + _layer.zeroPad(level, 2, 10);
                    var url = _layer.serverUrl + "/" + z + "/" + y + "/" + x + "." + _layer.picFormat;
                    var id = _layer.id + "_" + x + "_" + y + "_" + z + "_" + tempID;
                    if ($("#" + container).find("#" + id).length == 1) {
                        _loadedImageCount++;
                        if (_loadedImageCount == _loadImageCount) {
                            _layer._setLayerStatus(_layer.LayerStatus.Loaded);
                        }
                        continue;
                    }
                    var tileExtent = _layer.getTileExtent(startTile.x + i, startTile.y + k);
                    var fullExtent = _layer.fullExtent;
                    if (_layer.incluedExtent(tileExtent, fullExtent)) {
                        url = "../image/nocache.png"; // "http://www.baidu.com/img/baidu_sylogo1.gif";
                        _loadedImageCount++;
                        if (_loadedImageCount == _loadImageCount) {
                            _layer._setLayerStatus(_layer.LayerStatus.Loaded);
                        }
                    }
                    else {
                        var img = _layer.getImgFromCache(id);
                        if (img) {
                            $(img).css("width", _layer.tileSize)
                        .css("height", _layer.tileSize)
                        .css("position", "absolute")
                            //.css("top", Math.floor(_layer.tileSize * k + offsetY))
                            //.css("left", Math.floor(_layer.tileSize * i + offsetX))
                          .css("left", Math.round(tileExtent.minX / this.resolution))
                            .css("top", -Math.round(tileExtent.maxY / this.resolution))
                        .appendTo($("#" + container));
                            _loadedImageCount++;
                            if (_loadedImageCount == _loadImageCount) {
                                _layer._setLayerStatus(_layer.LayerStatus.Loaded);
                            }
                        }
                        else {
                            img = $("<img/>")
                                    .attr("src", url)
                                    .attr("id", id)
                                    .css("width", _layer.tileSize + "px")
                                    .css("height", _layer.tileSize + "px")
                                    .css("position", "absolute")
                                   .css("left", Math.round(tileExtent.minX / this.resolution))
                            .css("top", -Math.round(tileExtent.maxY / this.resolution))
                                    .css("border", "0px solid white")
                                    .load(function () {
                                        var idZ = this.id.split("_")[3];
                                        var tID = this.id.split("_")[4];
                                        if (idZ == 'L' + _layer.zeroPad(_layer.level, 2, 16) && tID == _layer.tempID) {
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
            _layer.cacheImages = cols;
            _layer.updateMap();
        };
        //从缓存中获取Img
        this.getImgFromCache = function (id) {
            var img = null;
            for (var i = 0; i < _cacheImagesList.length; i++) {
                var item = _cacheImagesList[i];
                if (item.id == id) {
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
        this.getXYZFromID = function (id) {
            var ids = id.split("_");
            var x = ids[1];
            var y = ids[2];
            var z = ids[3];
            return { x: x, y: y, z: z };
        };
        //添加缓存图片到缓存列表
        this.addImgToCache = function (img) {
            if (_cacheImagesList.length > 1000) {
                _cacheImagesList.shift();
            }
            _cacheImagesList.push(img);
        };

        //更新地图空间参数
        this.updateMap = function () {
            if (_layer.status == _layer.LayerStatus.FinishInitParam || _layer.status == _layer.LayerStatus.FinishCreateContainer) {
                _layer.map._setCenter(_layer.getCenter());
                if (_layer.isBaseLayer) {
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
            var center = _layer.getCenter();
            x = -x;
            y = -y;
            _layer.center = center = new xf.GeoPoint(center.x + x * _layer.resolution, center.y - y * _layer.resolution);
            var x_g = $(_layer.map.container).width() * _layer.resolution;
            var y_g = $(_layer.map.container).height() * _layer.resolution;
            var newExtent = new xf.Extent(center.x - x_g / 2, center.y - y_g / 2, center.x + x_g / 2, center.y + y_g / 2);
            if (update) {
                _layer.update(newExtent);
            }
        };
        //缩放 缩放中心点 缩放比例  
        this.zoom = function (center, radio, offset) {
            var tempLevel = _layer.level;
            var level = _layer.level + radio;
            if (_layer.levelInLods(level)) {
                _layer.level = level;
                var res = _layer.resolution = _layer.lods[_layer.level].resolution;
                if (offset && !_layer.map.zoomByCenter) {
                    var nowRes = res;
                    var formatRes = _layer.lods[tempLevel].resolution;
                    var offsetX = (offset.x - center.x) / formatRes;
                    var offsetY = (offset.y - center.y) / formatRes;
                    var newOffsetX = offsetX * nowRes;
                    var newOffsetY = offsetY * nowRes;
                    var nowCenter = new xf.GeoPoint(offset.x - newOffsetX, offset.y - newOffsetY);
                    _layer.center = nowCenter;
                    _layer.map._setCenter(nowCenter);
                }
                else {
                    _layer.center = center;
                    _layer.map._setCenter(center);
                }
                var zoomExtent = _layer.getViewExtentByCenter(_layer.center, res);
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
            var geoView = _layer.getGeoViewByRes(res);
            var newExtent = new xf.Extent(center.x - geoView.x / 2, center.y - geoView.y / 2, center.x + geoView.x / 2, center.y + geoView.y / 2);
            return newExtent;
        };
        //根据分辨率获取可视范围
        this.getGeoViewByRes = function (res) {
            var x_g = $(_layer.map.container).width() * res;
            var y_g = $(_layer.map.container).height() * res;
            return { x: x_g, y: y_g };
        };
        //获取分幅图片范围
        this.getTileExtent = function (tileX, tileY) {
            var minX = _layer.origin.x + (tileX * _layer.tileSize * _layer.resolution);
            var maxX = minX + (1 * _layer.tileSize * _layer.resolution);
            var maxY = _layer.origin.y - (tileY * _layer.tileSize * _layer.resolution);
            var minY = maxY - (1 * _layer.tileSize * _layer.resolution);
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
            var w = Math.max(Math.floor((point.x - _layer.origin.x) / (_layer.tileSize * res)), 0);
            var h = Math.max(Math.floor((_layer.origin.y - point.y) / (_layer.tileSize * res)), 0);
            return { x: w, y: h };
        };
        //获取左上角Tile信息
        this.getLeftTopTile = function () {
            var lt = new xf.GeoPoint(_layer.currentExtent.minX, _layer.currentExtent.maxY);
            return _layer.getContainingTileCoords(lt, _layer.resolution);
        };
        //获取右下角Tile信息
        this.getRightBottomTile = function () {
            var rb = new xf.GeoPoint(_layer.currentExtent.maxX, _layer.currentExtent.minY);
            return _layer.getContainingTileCoords(rb, _layer.resolution);
        };
        //根据分辨率获取最大加载范围
        this.getLoadMaxExtent = function (resolution) {
            var startTile = _layer.getLeftTopTile();
            var stopTile = _layer.getRightBottomTile();
            var numTileCols = Math.ceil($(_layer.map.container).width() / _layer.tileSize) + 1;
            var numTileRows = Math.ceil($(_layer.map.container).height() / _layer.tileSize) + 1;
            var minX = _layer.origin.x + (startTile.x * _layer.tileSize * resolution);
            var maxX = minX + (numTileCols * _layer.tileSize * resolution);
            var maxY = _layer.origin.y - (startTile.y * _layer.tileSize * resolution);
            var minY = maxY - (numTileRows * _layer.tileSize * resolution);
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
        //完成参数加载
        this.paramsLoaded = null;
        init();
    };
})(jQuery, XiaoFu);