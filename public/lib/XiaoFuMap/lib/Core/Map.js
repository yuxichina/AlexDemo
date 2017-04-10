//名称：Map 对象脚本库
//作者：GIS-Client Team YC
//说明：地图对象
//更新2012-7-9
//2012-7-12
//2012-7-16
//2012-8-2
//2012-10-14  增加手势放大支持
//2012-10-15  增加移动端CSS平移支持，并整合CSS移动和放大功能
//2012-10-16  增加对不支持手势的Android设备的模拟双击放大支持
//            修改CacheLayer和普通Layer判断机制
(function ($, xf) {
    xf.Map = function (_container, _initExtent) {
        xf.Dispatch.apply(this, []);
        /********************************************属性*******************************************/
        /**私有**/
        var _map = this;
        //地图中心
        var _center = null;
        //当前分辨率
        var _resolution = null;
        //当前比例尺级别
        var _level = 0;
        //当前鼠标位置 地理坐标
        var _mouseGeo;
        //当前鼠标位置 像素坐标
        var _mousePoint;
        //添加图层 缓存图层总数
        var _cacheCount = 0;
        //已经完成缓存图层数量
        var _comCacheCount = 0;
        //动作
        var _action = null;
        //LayerContainer
        var _layerContainer = null;
        //鼠标样式
        var _cursor = "auto";
        //拖动控件
        var _dragControl = null;
        //双击放大控件
        var _dblClickZoomControl = null;
        //添加MobileZoom 支持
        var _gestureZoomControl = null
        //layerContainer参数
        var _layerContainerOption = { radio: 1, transform: { x: 0, y: 0 }, angle: 0 };
        /**常量**/
        //图层顺序
        //this.LayerIndexList = { BaseLayer: 100, FeatureLayer: 300, PopupLayer: 400, Control: 500 };
        this.LayerIndexList = { BaseLayer: -500, FeatureLayer: -400, PopupLayer: -300, Control: -100 };
        // 0:初始化 1:初始化完毕 2:平移开始 3：放大开始  4:动态平移中 5:dynamicPanEnd
        this.MapStatus = { init: 0, loaded: 1, panstart: 2, zoomstart: 3, dynamicPan: 4, dynamicPanEnd: 5 };
        /**公有**/
        //地图ID
        this.id = null;
        //窗口大小 { w:100, h:100 }
        this.viewSize = { w: 100, h: 100 };
        //地图容器
        this.container = null;
        //图片大小
        this.tileSize = 256;
        //地图列表 类型XiaoFu.Layer
        this.layers = new Array();
        //控件
        this.controls = new Array();
        //平移参数
        this.panRatio = 1.5;
        //平移间隔
        this.panDuration = 1;
        //平移次数
        this.panRate = 30;
        //是否动态平移
        this.dynamicPan = true;
        //坐标系
        this.projection = "EPSG:4326";
        //地图单位
        this.units = "degrees";
        //是否始终根据中心点进行缩放
        this.zoomByCenter = false;
        //状态 
        this.status = 0;
        //是否缩放突进
        this.zoomByDynamic = false;
        //全部图层最大范围
        this.maxExtent = null;
        //是否显示加载进度条
        this.showLoading = true;
        //进度条Dom对象
        this.loadingContainer = null;
        //地图角度
        this.mapAngle = 0;
        //信息框容器
        this.infoWindowContainer = null;
        //SVG图层容器
        this.svgContainer = null;
        /********************************************事件*******************************************/
        // viewboundschange  mousemove mouseover mouseout click dbclick zoomstart zoomend panstart panend loaded init 
        // vmousedown vmouseover vmouseup vmouseout touchstart touchmove touchend gesturestart gesturechange gestureend        
        /********************************************方法*******************************************/
        /**公有**/
        //获取比例尺
        this.getLevel = function () { return _level; }
        //获取地图中心点
        this.getCenter = function () { return new xf.GeoPoint(_center.x, _center.y, _map.getSpatialReference()); };
        //获取分辨率
        this.getResolution = function () { return _resolution; };
        //设置地图动作
        this.setAction = function (action) {
            if (!action) {
                action = new xf.PanAction();
            }
            //销毁已有动作
            if (_action) {
                _action.destory();
                _action = null;
            }
            _action = action;
            _action._create(_map);
        };
        //添加图层      
        this.addLayer = function (layer) {
            //图层总数
            var layerCount = this.layers.length;
            xf.Console.info("创建图层" + layer.id);
            //图层ID
            var layerId = layer.id || ("layer" + layerCount);
            layer.map = _map;
            //如果是缓存图层
            if (layer.isCacheLayer) {
                _cacheCount++;
                layer.addEventListener("layerstatechange", function (eventType, evt) {
                    //图层状态
                    var status = evt.status;
                    var activeLayer = evt.layer;
                    //图层加载完成
                    if (status == activeLayer.LayerStatus.Loaded) {
                        _comCacheCount++;
                        if (_cacheCount == _comCacheCount) {
                            _map._allCacheComplate();
                        }
                    }
                    else if (status == activeLayer.LayerStatus.FinishInitParam) {
                        //初始化参数加载完成，创建Dom对象
                        if (_map.getCenter()) {
                            activeLayer.create(layerId, _map.getCurrentExtent());
                        }
                        else {
                            activeLayer.create(layerId);
                        }
                        if (activeLayer.isBaseLayer) {
                            var ext = activeLayer.fullExtent, lods = activeLayer.lods;
                            if (_map.maxExtent) {
                                _map.maxExtent = new xf.Extent(
                                            Math.min(_map.maxExtent.minX | ext.minX, ext.minX),
                                            Math.min(_map.maxExtent.minY | ext.minY, ext.minY),
                                        Math.max(_map.maxExtent.maxX | ext.maxX, ext.maxX),
                                        Math.max(_map.maxExtent.maxY | ext.maxY, ext.maxY)
                                        );
                            }
                            else {
                                _map.maxExtent = ext;
                            }
                        }
                    };
                }, "MapAdd");
                layer.addEventListener("layerinit", function (eventType, evt) {
                    if (evt.layer.isBaseLayer) {
                        //初始化完成 可以使用                       
                        _map.dispatchEvent("init", {});
                    }
                }, "MapAdd");
            }
            _map.layers.push(layer);
            if (layer.isCacheLayer && layer.status == layer.LayerStatus.FinishInitParam) {
                if (_center) {
                    layer.create(layerId, _map.getCurrentExtent());
                }
                else {
                    layer.create(layerId, _initExtent);
                }
                if (layer.isBaseLayer) {
                    var ext = layer.fullExtent, lods = layer.lods;
                    if (_map.maxExtent) {
                        _map.maxExtent = new xf.Extent(
                                            Math.min(_map.maxExtent.minX | ext.minX, ext.minX),
                                            Math.min(_map.maxExtent.minY | ext.minY, ext.minY),
                                        Math.max(_map.maxExtent.maxX | ext.maxX, ext.maxX),
                                        Math.max(_map.maxExtent.maxY | ext.maxY, ext.maxY)
                                        );
                    }
                    else {
                        _map.maxExtent = ext;
                    }
                }
            }
            else {
                layer.init(layerId);
            };
        };
        //删除图层 根据图层ID
        this.removeLayer = function (layerId) {
            var newList = new Array();
            var tempLayers = this.layers;
            for (var i = 0; i < tempLayers.length; i++) {
                var item = tempLayers[i];
                if (item.id == layerId) {
                    if (item.isCacheLayer) {
                        _cacheCount--;
                        var ext = item.fullExtent;
                        this.maxExtent = new xf.Extent(
                            Math.min(this.maxExtent.minX | ext.minX, ext.minX),
                            Math.min(this.maxExtent.minY | ext.minY, ext.minY),
                            Math.max(this.maxExtent.maxX | ext.maxX, ext.maxX),
                            Math.max(this.maxExtent.maxY | ext.maxY, ext.maxY)
                        );
                    }
                    item.destory();
                }
                else {
                    newList.push(item);
                }
            }
            _map.layers = newList;
        };
        //根据ID获取图层
        this.getLayerById = function (layerId) {
            var tempLayers = this.layers;
            for (var i = 0; i < tempLayers.length; i++) {
                var item = tempLayers[i];
                if (item.id == layerId) {
                    return item;
                }
            }
            return null;
        };
        //平移 x，y:距离 offsetCache：是否平移缓存 dyPan:是否动态平移 
        this.pan = function (x, y, offsetCache, dyPan) {
            _comCacheCount = 0;
            var res = _map.getResolution();
            if (_map.status == _map.MapStatus.dynamicPan) { }
            else {
                _map._setStatus(_map.MapStatus.panstart);
                _map.dispatchEvent("panstart", []);
                _map.loadingShow();
            }
            var center = _map.getCenter();
            center.x = center.x - x;
            center.y = center.y + y;
            _map._setCenter(center);
            if (offsetCache) {
                for (var index in _map.layers) {
                    var subLayer = _map.layers[index];
                    //if (subLayer instanceof xf.MarkerLayers || subLayer instanceof xf.SVGLayers || subLayer instanceof xf.InfoWindow) {
                    //    subLayer.update();
                    //}
                    //else if (fromCacheLayer(subLayer)) {
                    subLayer.update(_map.getCurrentExtent());
                    //}
                }
            }
            if (_map.status == _map.MapStatus.panstart) {
                var evt = new xf.Event();
                refreshMouse();
                evt.mouseGeoPoint = _mouseGeo;
                _map.dispatchEvent("viewboudnschange", evt);
            }
        };
        //向左平移 _ratio : 地理
        this.panLeft = function (ratio) {
            _map.panBy(ratio, 0);
        };
        //向右平移 _ratio : 地理
        this.panRight = function (ratio) {
            _map.panBy(-ratio, 0);
        };
        //向上平移 _ratio : 地理
        this.panTop = function (ratio) {
            _map.panBy(0, -ratio);
        };
        //向下平移 _ratio : 地理
        this.panBottom = function (ratio) {
            _map.panBy(0, ratio);
        };
        //根据像素平移 地理
        this.panBy = function (ratioX, ratioY) {
            ratioX = -ratioX;
            var res = _map.getResolution();
            if (xf.Utils.isUndefined(ratioX) || xf.Utils.isNull(ratioX)) {
                ratioX = _map.tileSize * _map.panRatio * res;
            }
            if (xf.Utils.isUndefined(ratioY) || xf.Utils.isNull(ratioY)) {
                ratioY = _map.tileSize * _map.panRatio * res;
            }
            if (_map.dynamicPan) {
                var panRate = _map.panRate;
                var subOX = ratioX / panRate;
                var subOY = ratioY / panRate;
                _map._panByDynamic(panRate, 0, subOX, subOY);
            }
            else {
                _map._panByDynamic(1, 0, ratioX, ratioY);
            }
        };
        //平移到某点
        this.panTo = function (toPoint) {
            var center = _map.getCenter();
            var x = toPoint.x - center.x;
            var y = toPoint.y - center.y;
            _map.panBy(x, y);
        };
        //放大 
        this.zoom = function (radio, offset, center) {
            var evt = new xf.Event();
            evt.mouseGeoPoint = _mouseGeo;
            evt.radio = Math.floor(radio);
            evt.fromLevel = parseInt(_map.getBaseLayer().level);
            evt.toLevel = evt.fromLevel + evt.radio;
            evt.offset = offset;
            evt.center = center;
            //判断是否平移出最大比例尺范围
            var includeInLods = _map.getBaseLayer().levelInLods(evt.toLevel);
            if (includeInLods) {
                if (includeInLods.type == "min") { _map.dispatchEvent("_toMinLevel", {}); }
                else if (includeInLods.type == "max") { _map.dispatchEvent("_toMaxLevel", {}); }
                else { _map.dispatchEvent("_toNormalLevel", {}); }
                _map.dispatchEvent("zoomstart", evt);
                _map.loadingShow();
                _map._setStatus(_map.MapStatus.zoomstart);
                _comCacheCount = 0;
                for (var layer in _map.layers) {
                    var subLayer = _map.layers[layer];
                    var level;
                    if (subLayer.isCacheLayer) {
                        if (center) {
                            subLayer.zoom(center, evt.radio, offset);
                        }
                        else {
                            subLayer.zoom(_map.getCenter(), radio, offset);
                        }
                    }
                    else {
                        //if (subLayer instanceof xf.MarkerLayers || subLayer instanceof xf.SVGLayers || subLayer instanceof xf.InfoWindow) {
                        subLayer.update();
                        //}
                    }
                }
                refreshMouse();
            }
        }
        //比例放大
        this.zoomIn = function (radio) {
            if (!radio) { radio = 1; };
            this.zoom(radio);
        };
        //比例缩小
        this.zoomOut = function (radio) {
            if (!radio) { radio = -1; };
            this.zoom(radio);
        };
        //设置可视范围
        this.viewByExtent = function (ext) {
            var g_x = ext.width();
            var g_y = ext.height();
            var p_x = _map.viewSize.w;
            var p_y = _map.viewSize.h;
            var res_x = g_x / p_x;
            var res_y = g_y / p_y;
            var res_x_mix = _map._getMixRes(res_x);
            var res_y_mix = _map._getMixRes(res_y);
            var res_mix = Math.min(res_x_mix, res_y_mix);
            var resIndex = _map._getResIndex(res_mix);
            var nowIndex = _map._getResIndex(_map.getResolution());
            var zoomCenter = ext.center();
            _map.zoom(resIndex - nowIndex, null, zoomCenter);
        };
        //获取基础图层
        this.getBaseLayer = function () {
            for (var index in _map.layers) {
                var l = _map.layers[index];
                if (l.isCacheLayer && l.isBaseLayer) {
                    return l;
                };
            }
            return null;
        };
        //重置大小
        this.resize = function (size, resizeModel) {
            //重置地图大小模式
            //resizeModel //0:左上角点 1：中心点
            var tempSize = new xf.Size(_map.viewSize.w, _map.viewSize.h);
            var currentExtent = _map.getCurrentExtent();
            var center = _map.getCenter();
            var centerPoint = _map.mapToPoint(center);
            var newW = currentExtent.width() * size.w / tempSize.w;
            var newH = currentExtent.height() * size.h / tempSize.h;
            var newCenter = null;
            var newExtent = null;
            newCenter = new xf.GeoPoint(currentExtent.minX + newW / 2, currentExtent.maxY - newH / 2, _map.getSpatialReference());
            newExtent = new xf.Extent(newCenter.x - newW / 2, newCenter.y - newH / 2, newCenter.x + newW / 2, newCenter.y + newH / 2);
            _map.viewSize = size;
            _map._setCenter(newCenter);
            var newCenterPoint = _map.mapToPoint(newCenter);
            $(_map.container)
            .css("width", size.w + "px")
            .css("height", size.h + "px");
            var res = _map.getResolution();
            if (resizeModel == 1) { _map.panTo(center); }
            else { _map.viewByExtent(newExtent); }
        };
        //设置透明度 计划
        this.setOpacity = function (opa) {
            _map.container.css("opacity", opa);
        };
        //获取当前地图可视范围
        this.getCurrentExtent = function () {
            var w = _map.viewSize.w;
            var h = _map.viewSize.h;
            var w_g = w * _map.getResolution();
            var h_g = h * _map.getResolution();
            var center = _map.getCenter();
            var currentExtent = new xf.Extent(
                                center.x - w_g / 2,
                                center.y - h_g / 2,
                                center.x + w_g / 2,
                                center.y + h_g / 2);
            return currentExtent;
        };
        this.getSpatialReference = function () { return _map.getBaseLayer().spatialReference; };
        //像素点转地理坐标
        this.pointToMap = function (point) {
            var ext = _map.getCurrentExtent();
            var res = _map.getResolution();
            if (ext) {
                var geoPointX = point.x * res + ext.minX;
                var geoPointY = ext.maxY - point.y * res;
                var geo = new xf.GeoPoint(geoPointX, geoPointY, _map.getSpatialReference());
                return geo;
            }
            else {
                return null;
            }
        };
        //地理坐标转像素
        this.mapToPoint = function (geoPoint) {
            var ext = _map.getCurrentExtent();
            var res = _map.getResolution();
            var x = (geoPoint.x - ext.minX) / res;
            var y = (ext.maxY - geoPoint.y) / res;
            var point = new xf.Point(x, y);
            return point;
        };
        //销毁地图 计划
        this.destory = function () {
            var layers = _map.layers;
            for (var i in layers) {
                layers[i].destory();
            }
            if (_map.container) {
                _map.container.remove();
            }
        };
        //添加控件
        this.addControl = function (control) {
            control._create(_map);
            _map.controls.push(control);
        };
        //显示加载滚动条
        this.loadingShow = function () {
            if (_map.showLoading && _map.loadingContainer) {
                _map.loadingContainer.show();
            }
        }
        //隐藏加载滚动条
        this.loadingHide = function () {
            if (_map.showLoading && _map.loadingContainer) {
                _map.loadingContainer.hide();
            }
        }
        //距离量算
        this.measureDistance = function (points, spatialReference) {
            if (xf.Utils.isUndefined(spatialReference)) {
                spatialReference = _map.getBaseLayer().spatialReference;
            }
            if (xf.Utils.isArray(points) && points.length > 1) {
                var measure = new xf.Measure();
                return measure.getDistance(points, spatialReference);
            }
            else {
                return null;
            }
        };
        /*私有方法*/
        //设置地图中心点
        this._setCenter = function (value) { if (_center && ((_center.x != value.x || _center.y != value.y) && _map.status != _map.MapStatus.dynamicPan) || (_map.status == _map.MapStatus.zoomstart)) { _map.dispatchEvent("viewboundschange", {}); } _center = new xf.GeoPoint(value.x, value.y, _map.getSpatialReference()); };
        //设置地图分辨率
        this._setResolution = function (value) { _resolution = value; };
        //设置当前比例尺
        this._setLevel = function (value) { _level = value; };
        //所有图片图层加载完毕 +wiki
        this._allCacheComplate = function () {
            if (_map.status == _map.MapStatus.zoomstart) {
                _map._setStatus(_map.MapStatus.loaded);
                _map.dispatchEvent("zoomend", {});
                _map.dispatchEvent("loaded", {});
                _map.loadingHide();
            }
            else if (_map.status == _map.MapStatus.dynamicPanEnd) {
                _map._setStatus(_map.MapStatus.loaded);
                _map.dispatchEvent("panend", {});
                _map.dispatchEvent("loaded", {});
                _map.loadingHide();
            }
            else if (_map.status == _map.MapStatus.panstart) {
                _map._setStatus(_map.MapStatus.loaded);
                _map.dispatchEvent("panend", {});
                _map.dispatchEvent("loaded", {});
                _map.loadingHide();
            }
            else if (_map.status == _map.MapStatus.init) { _map.loadingHide(); }
        };
        //根据分辨率获取最佳分辨率
        this._getMixRes = function (res) {
            var baseLayer = _map.getBaseLayer();
            return baseLayer._getMixRes(res);
        };
        //获取分辨率顺序
        this._getResIndex = function (res) {
            var baseLayer = this.getBaseLayer();
            return baseLayer._getResIndex(res);
        };
        //动态平移
        this._panByDynamic = function (times, nowTimes, subRatioX, subRatioY) {
            if (nowTimes == 0) {
                _map.dispatchEvent("panstart");
                _comCacheCount = 0;
                _map._setStatus(_map.MapStatus.dynamicPan);
            }
            if (nowTimes < times) {
                var center = _map.getCenter();
                var res = _map.getResolution();
                var offsetCenter = new xf.GeoPoint(center.x + subRatioX * res, center.y + subRatioY * res, _map.getSpatialReference());

                if (nowTimes == times - 1) { _map._setStatus(_map.MapStatus.dynamicPanEnd); }
                else {
                    nowTimes++;
                    setTimeout(function () {
                        _map._panByDynamic(times, nowTimes, subRatioX, subRatioY);
                    }, _map.panDuration / times);
                }
                _map.pan(subRatioX, subRatioY, true, true);
            }
        };
        //设置地图状态
        this._setStatus = function (status) {
            _map.status = status;
            _map.dispatchEvent("statuschange", {});
        };
        //拖动控制
        this._setDraggable = function (draggable) {
            if (!_dragControl) {
                _dragControl = {};
                _dragControl.option = {
                    draging: false,
                    dragPoint: null,
                    dragGeometry: null,
                    touches: null,
                    active: false
                };
                if (xf.Touch) {
                    _dragControl.touchstart = function (evt) {
                        evt = evt.originalEvent;
                        //evt.preventDefault();
                        if (evt.touches.length < 3) {
                            _dragControl.option.draging = true;
                            _dragControl.option.touches = evt.touches;
                            var touchPoints = new Array();
                            for (var i = 0; i < evt.touches.length; i++) {
                                var px = evt.touches[i].pageX;
                                var py = evt.touches[i].pageY;
                                touchPoints.push(new xf.Point(px, py));
                            }
                            var tempPoly = new xf.GeoPolygon([touchPoints]);
                            var tempCenter = tempPoly.getExtent().center();
                            //if (event.touches.length <3) {
                            _dragControl.option.dragPoint = new xf.Point(tempCenter.x, tempCenter.y);
                            _dragControl.option.dragGeometry = _map.pointToMap(_dragControl.option.dragPoint);
                            //}
                        }
                    };
                    _dragControl.touchmove = function (evt) {
                        evt = evt.originalEvent;
                        //evt.preventDefault();
                        if (_dragControl.option.draging && evt.touches.length < 3) {
                            _dragControl.option.touches = evt.touches;
                            var touchPoints = new Array();
                            for (var i = 0; i < evt.touches.length; i++) {
                                var px = evt.touches[i].pageX;
                                var py = evt.touches[i].pageY;
                                touchPoints.push(new xf.Point(px, py));
                            }
                            var tempPoly = new xf.GeoPolygon([touchPoints]);
                            var tempCenter = tempPoly.getExtent().center();
                            var offsetX = tempCenter.x - _dragControl.option.dragPoint.x;
                            var offsetY = tempCenter.y - _dragControl.option.dragPoint.y;
                            //_dragControl.option.dragPoint = new xf.Point(tempCenter.x, tempCenter.y);
                            //_dragControl.option.dragGeometry = _map.pointToMap(_dragControl.option.dragPoint);
                            var res = _map.getResolution();
                            _layerContainerOption.transform.x = offsetX;
                            _layerContainerOption.transform.y = offsetY;
                            _layerContainer.css("-webkit-transform", "translate(" + _layerContainerOption.transform.x + "px," + _layerContainerOption.transform.y + "px) scale(" + _layerContainerOption.radio + "," + _layerContainerOption.radio + ")"); // rotate(" + _layerContainerOption.angle + "deg)");
                            //_map.infoWindowContainer.css("-webkit-transform", "translate(" + _layerContainerOption.transform.x + "px," + _layerContainerOption.transform.y + "px) scale(" + _layerContainerOption.radio + "," + _layerContainerOption.radio + ")");
                            // _map.pan(offsetX * res, offsetY * res, true);
                        }
                    };
                    _dragControl.touchend = function (evt) {
                        evt = evt.originalEvent;
                        //evt.preventDefault();
                        if (_dragControl.option.draging && _dragControl.option.touches.length < 3) {
                            var touchPoints = new Array();
                            for (var i = 0; i < _dragControl.option.touches.length; i++) {
                                var px = _dragControl.option.touches[i].pageX;
                                var py = _dragControl.option.touches[i].pageY;
                                touchPoints.push(new xf.Point(px, py));
                            }
                            var tempPoly = new xf.GeoPolygon([touchPoints]);
                            var tempCenter = tempPoly.getExtent().center();
                            var offsetX = tempCenter.x - _dragControl.option.dragPoint.x;
                            var offsetY = tempCenter.y - _dragControl.option.dragPoint.y;
                            // _dragControl.option.dragPoint = new xf.Point(tempCenter.x, tempCenter.y);
                            //  _dragControl.option.dragGeometry = _map.pointToMap(_dragControl.option.dragPoint);
                            var res = _map.getResolution();
                            _layerContainerOption.transform.x = 0;
                            _layerContainerOption.transform.y = 0;
                            //alert(_layerContainerOption.radio);
                            _layerContainer.css("-webkit-transform", "translate(" + _layerContainerOption.transform.x + "px," + _layerContainerOption.transform.y + "px) scale(" + _layerContainerOption.radio + "," + _layerContainerOption.radio + ")"); // rotate(" + _layerContainerOption.angle + "deg)");
                            //_map.infoWindowContainer.css("-webkit-transform", "translate(" + _layerContainerOption.transform.x + "px," + _layerContainerOption.transform.y + "px) scale(" + _layerContainerOption.radio + "," + _layerContainerOption.radio + ")");
                            _map.pan(offsetX * res, offsetY * res, true);
                        }
                        _dragControl.option.draging = false;
                    };
                }
                _dragControl.mousedown = function (evt) {
                    evt.preventDefault();
                    if (!_dragControl.option.draging) {
                        _dragControl.option.draging = true;
                        _dragControl.option.dragPoint = new xf.Point(evt.pageX, evt.pageY);
                        _dragControl.option.dragGeometry = _map.pointToMap(_dragControl.option.dragPoint);
                    }
                };
                _dragControl.mouseup = function (evt) {
                    evt.preventDefault();
                    _dragControl.option.draging = false;
                };
                _dragControl.mousemove = function (evt) {
                    evt.preventDefault();
                    if (_dragControl.option.draging) {
                        var offsetX = evt.pageX - _dragControl.option.dragPoint.x;
                        var offsetY = evt.pageY - _dragControl.option.dragPoint.y;
                        _dragControl.option.dragPoint = new xf.Point(evt.pageX, evt.pageY);
                        _dragControl.option.dragGeometry = _map.pointToMap(_dragControl.option.dragPoint);
                        var res = _map.getResolution();
                        _map.pan(offsetX * res, offsetY * res, true);
                    }
                };
                _dragControl.active = function () { };
            }
            xf.Console.info(draggable);
            if (_dragControl.option.active != draggable) {
                if (!draggable) {
                    $("body").unbind('mousemove', _dragControl.mousemove);
                    _layerContainer.unbind('mousedown', _dragControl.mousedown);
                    $("body").unbind('mouseup', _dragControl.mouseup);
                    if (xf.Touch) {
                        _layerContainer.unbind('touchstart', _dragControl.touchstart);
                        $("body").unbind('touchmove', _dragControl.touchmove);
                        $("body").unbind('touchend', _dragControl.touchend);
                    }
                }
                else {
                    $("body").bind('mousemove', _dragControl.mousemove);
                    _layerContainer.bind('mousedown', _dragControl.mousedown);
                    $("body").bind('mouseup', _dragControl.mouseup);
                    if (xf.Touch) {
                        _layerContainer.bind('touchstart', _dragControl.touchstart);
                        $("body").bind('touchmove', _dragControl.touchmove);
                        $("body").bind('touchend', _dragControl.touchend);
                    }
                }
                _dragControl.option.active = draggable;
            }
        };
        //设置鼠标样式
        this._setCursor = function (cursorName) {
            _cursor = "auto";
            switch (cursorName) {
                case "openhand":
                    _cursor = "url(../image/openhand.cur)";
                    break;
                case "closehand":
                    _cursor = "url(../image/closedhand.cur)";
                    break;
                case "pointer":
                    _cursor = "pointer";
                    break;
                case "wait":
                    _cursor = "wait";
                    break;
                default:
                    break;
            }
            _map.container.css("cursor", _cursor);
        };
        //双击放大
        this._dbClickZoom = function (enable) {
            if (!_dblClickZoomControl) {
                _dblClickZoomControl = {};
                _dblClickZoomControl.option = {
                    point: null,
                    timer: 0,
                    startActive: false,
                    active: false
                };

                _dblClickZoomControl.dblclick = function (evt) {
                    evt.preventDefault();
                    _map.zoom(1, _mouseGeo, _map.getCenter());
                };
                _dblClickZoomControl.touchMove = function (evt) {
                    evt = evt.originalEvent;
                    evt.preventDefault();
                    //if (evt.touches.length == 1) {
                    //_dblClickZoomControl.option.timer = new Date();
                    // }

                    _dblClickZoomControl.option.startActive = false;
                };
                _dblClickZoomControl.touchStart = function (evt) {
                    evt = evt.originalEvent;
                    evt.preventDefault();
                    if (evt.touches.length == 1) {
                        var px = evt.touches[0].pageX;
                        var py = evt.touches[0].pageY;
                        if (_dblClickZoomControl.option.startActive) {
                            //alert("a");
                            var time = new Date();
                            var interval = time - _dblClickZoomControl.option.timer;

                            if (interval < 300) {
                                var offset = _map.container.offset();
                                var point = new xf.Point(px - offset.left, py - offset.top);
                                var pOffsetX = Math.abs(point.x - _dblClickZoomControl.option.point.x);
                                var pOffsetY = Math.abs(point.y - _dblClickZoomControl.option.point.y);
                                //alert(pOffsetX);
                                if (pOffsetX < 40 && pOffsetY < 40) {
                                    var offsetPoint = _map.pointToMap(point);
                                    _map.zoom(1, offsetPoint, _map.getCenter());
                                }
                            }
                            _dblClickZoomControl.option.startActive = false;
                            xf.Console.info(interval);
                        }
                        else {
                            //salert("b");
                            _dblClickZoomControl.option.timer = new Date();
                            var offset = _map.container.offset();
                            _dblClickZoomControl.option.point = new xf.Point(px - offset.left, py - offset.top);
                            _dblClickZoomControl.option.startActive = true;
                        }
                    }
                };
            }
            if (_dblClickZoomControl.option.active != enable) {
                if (enable) {
                    _map.container.bind('dblclick', _dblClickZoomControl.dblclick);
                    if (xf.Touch) {
                        _map.container.bind('touchstart', _dblClickZoomControl.touchStart);
                        _map.container.bind('touchmove', _dblClickZoomControl.touchMove);
                    }
                }
                else {
                    _map.container.unbind('dblclick', _dblClickZoomControl.dblclick);
                    if (xf.Touch) {
                        _map.container.unbind('touchstart', _dblClickZoomControl.touchStart);
                        _map.container.unbind('touchmove', _dblClickZoomControl.touchMove);
                    }
                }
                _dblClickZoomControl.option.active = enable;
            }
        }
        //加载滚轮缩放方法
        this._setWheelZoom = function (wheelZoom) {
            //return;
            if (wheelZoom) {
                _map.container[0].onmousewheel = function (evt) {
                    evt.cancelBubble = true;
                    var delta = evt.wheelDelta;
                    var offset = _map.container.offset();
                    var left = evt.x - offset.left;
                    var top = evt.y - offset.top;
                    var center = _map.getCenter();
                    if (delta > 0) {
                        _map.zoom(1, _mouseGeo, center);
                    }
                    else {
                        _map.zoom(-1, _mouseGeo, center);
                    }
                }
            }
            else {
                _map.container[0].onmousewheel = null;
            }
        };


        //是否支持手势放大
        this._setGestureZoomControl = function (enable) {
            //return;
            if (!_gestureZoomControl) {
                _gestureZoomControl = {};
                _gestureZoomControl.option = {
                    zooming: false,
                    gestureCenter: null,
                    radio: null,
                    startRotation: 0,
                    active: false
                };
                _gestureZoomControl.touchStart = function (evt) {
                    evt = evt.originalEvent;
                    evt.preventDefault();
                    if (evt.touches.length == 2) {
                        _gestureZoomControl.option.zooming = true;
                        _gestureZoomControl.option.startRotation = evt.rotation;
                        var touchPoints = new Array();
                        for (var i = 0; i < evt.touches.length; i++) {
                            var px = evt.touches[i].pageX;
                            var py = evt.touches[i].pageY;
                            touchPoints.push(new XiaoFu.Point(px, py));
                        }
                        var tempPoly = new xf.GeoPolygon([touchPoints]);
                        var tempCenter = tempPoly.getExtent().center();
                        _gestureZoomControl.option.gestureCenter = new XiaoFu.Point(tempCenter.x, tempCenter.y);
                    }
                };
                _gestureZoomControl.touchMove = function (evt) { };
                _gestureZoomControl.touchEnd = function (evt) { };
                _gestureZoomControl.gestureStart = function (evt) {
                    evt = evt.originalEvent;
                    evt.preventDefault();
                    if (evt.touches.length == 2) {
                        _gestureZoomControl.option.startRotation = evt.rotation;
                    }
                };
                _gestureZoomControl.gestureChange = function (evt) {
                    evt = evt.originalEvent;
                    _layerContainerOption.radio = evt.scale;
                    var angle = _map.mapAngle + (_gestureZoomControl.option.startRotation + evt.rotation);
                    angle = 0;
                    if (_gestureZoomControl.option.zooming) {
                        var gX = _gestureZoomControl.option.gestureCenter.x;
                        var gY = _gestureZoomControl.option.gestureCenter.y;
                        var maskX = Math.max(gX, _map.viewSize.w - gX) * 2;
                        var maskY = Math.max(gY, _map.viewSize.h - gY) * 2;
                        var offsetX = gX - maskX / 2;
                        var offsetY = gY - maskY / 2;
                        //alert(_map.mapAngle);
                        // alert(_layerContainerOption.radio);
                        _layerContainer.find(".Mask").css("left", -offsetX).css("top", -offsetY);
                        _layerContainer.width(maskX).height(maskY).css("left", offsetX).css("top", offsetY);
                        _layerContainer.css("-webkit-transform", "translate(" + _layerContainerOption.transform.x + "px," + _layerContainerOption.transform.y + "px) scale(" + _layerContainerOption.radio + "," + _layerContainerOption.radio + ") rotate(" + _layerContainerOption.angle + "deg)");
                       // _map.infoWindowContainer.css("-webkit-transform", "translate(" + _layerContainerOption.transform.x + "px," + _layerContainerOption.transform.y + "px) scale(" + _layerContainerOption.radio + "," + _layerContainerOption.radio + ") rotate(" + _layerContainerOption.angle + "deg)");
                     
                    }
                };
                _gestureZoomControl.gestureEnd = function (evt) {
                    evt = evt.originalEvent;
                    if (_gestureZoomControl.option.zooming) {
                        _gestureZoomControl.option.zooming = false;
                        var angle = _map.mapAngle + (_gestureZoomControl.option.startRotation + evt.rotation);
                        _map.mapAngle = angle;
                        angle = 0;
                        _layerContainer.css("-webkit-transform", "translate(" + _layerContainerOption.transform.x + "px," + _layerContainerOption.transform.y + "px) scale(" + 1 + "," + 1 + ") rotate(" + angle + "deg)");
//_map.infoWindowContainer.css("-webkit-transform", "translate(" + _layerContainerOption.transform.x + "px," + _layerContainerOption.transform.y + "px) scale(" + 1 + "," + 1 + ") rotate(" + angle + "deg)");
                        _layerContainer.find(".Mask").css("left", 0).css("top", 0);
                        _layerContainer.width(_map.viewSize.w).height(_map.viewSize.h).css("left", 0).css("top", 0);
                        var s = evt.scale;
                        if (s <= 1) {
                            s = Math.log(s);
                        }
                        //alert(s);
                        _map.zoom(s, _map.pointToMap(_gestureZoomControl.option.gestureCenter), _map.getCenter());
                        _layerContainerOption.radio = 1;
                    }
                };
            }
            if (_gestureZoomControl.option.active != enable) {
                if (!enable) {
                    _layerContainer.unbind('touchstart', _gestureZoomControl.touchStart);
                    _layerContainer.unbind('touchmove', _gestureZoomControl.touchMove);
                    _layerContainer.unbind('touchend', _gestureZoomControl.touchEnd);
                    _layerContainer.unbind('gesturestart', _gestureZoomControl.gestureStart);
                    _layerContainer.unbind('gesturechange', _gestureZoomControl.gestureChange);
                    _layerContainer.unbind('gestureend', _gestureZoomControl.gestureEnd);
                }
                else {
                    _layerContainer.bind('touchstart', _gestureZoomControl.touchStart);
                    _layerContainer.bind('touchmove', _gestureZoomControl.touchMove);
                    _layerContainer.bind('touchend', _gestureZoomControl.touchEnd);
                    _layerContainer.bind('gesturestart', _gestureZoomControl.gestureStart);
                    _layerContainer.bind('gesturechange', _gestureZoomControl.gestureChange);
                    _layerContainer.bind('gestureend', _gestureZoomControl.gestureEnd);
                }
                _gestureZoomControl.option.active = enable;
            }
        }
        //初始化SVG层
        function initLayerSVG() {
            var m_layerContainer = $("<div></div>")
                .attr("id", 'layer_svgdiv')
                .css("width", "100%")
                .css("height", "100%")
                .addClass("Mask")
                .css("position", "absolute")
                .css("z-index", _map.LayerIndexList.FeatureLayer)
                .appendTo(_layerContainer);
            var svg_layers = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg_layers.setAttribute("id", 'layer_svg');
            var m_body = document.getElementById('layer_svgdiv');
            m_body.appendChild(svg_layers);
            _map.svgContainer = m_layerContainer;
        };
        function initLayerInfoWindow() {
            var m_infoWindow = $("<div></div>")
                .attr("id", "layer_myInfoWindow")
                .css("position", "absolute")
                .css("left", 0)
                .css("top", 0)
                .css("z-index", _map.LayerIndexList.Control - 1)
                .css("cursor", "default")
                .appendTo(_layerContainer);
            _map.infoWindowContainer = m_infoWindow;
        }
        //刷新鼠标位置
        function refreshMouse() {
            if (_mousePoint) {
                _mouseGeo = _map.pointToMap(_mousePoint);
            }
        };
        //初始化地图控件
        function initLayerContainer() {
            var args = _map.constructor.arguments;
            var container = _map.container = args[0];
            //alert("a");
            if (typeof container != "undefined") {
                _map.container = $(container).css("overflow", "hidden");
                _map.viewSize = { w: $(container).width(), h: $(container).height() };
                //alert(_map.viewSize.h);
                _layerContainer = _map._createLayerContainer();
                _map.loadingContainer = _map._createLoadingContainer();
            }
            _map._setCursor(_cursor);
        };
        //创建LoadingContainer
        this._createLoadingContainer = function () {
            var loadingContainer = $("<div></div>")
                .attr("id", "loadingContainer" + "s")
                .css("position", "absolute")
                .css("bottom", "0px")
                .css("left", _map.viewSize.w / 2 - 70)
                .css("background-color", "transparent")
                .appendTo(_map.container);
            var loadingDota = $("<img/>")
                .attr("src", "../image/loadingDota.gif")
                .attr("width", "150px")
                .attr("height", "15px")
                .css("margin-left", "4px")
                .appendTo(loadingContainer);
            return loadingContainer;
        };
        //创建LayerContainer
        this._createLayerContainer = function () {
            return $("<div></div>")
                .attr("id", "layerContainer")
                .css("width", "100%")
                .css("height", "100%")
                .css("position", "absolute")
                .css("z-index", _map.LayerIndexList.Control - 2)
                .bind("mousemove", function (event, ui) {
                    event.preventDefault();
                    //                    var layerCon = _layerContainer;
                    //                    //event.preventDefault();
                    //                    var top = $(_container).position().top;
                    //                    var left = $(_container).position().left;
                    _mousePoint = xf.Utils.getMousePosition(event, _container);
                    //showMessage(_mousePoint.x + "_" + _mousePoint.y);
                    if (_center) {
                        refreshMouse();
                        event.mouseGeoPoint = _mouseGeo;
                    }
                    else {
                        event.mouseGeoPoint = new xf.GeoPoint();
                    }
                    event.mousePoint = _mousePoint;
                    _map.dispatchEvent("mousemove", event);
                })
                .bind("mousedown", function (event) {
                    event.preventDefault();
                    //alert("c");
                    if (_center) {
                        refreshMouse();
                        event.mouseGeoPoint = _mouseGeo;
                    }
                    else {
                        event.mouseGeoPoint = new xf.GeoPoint();
                    }
                    event.mousePoint = _mousePoint;
                    _map.dispatchEvent("mousedown", event);
                    //event.preventDefault();
                })
                .bind("mouseup", function (event) {
                    event.preventDefault();
                    if (_center) {
                        refreshMouse();
                        event.mouseGeoPoint = _mouseGeo;
                    }
                    else {
                        event.mouseGeoPoint = new xf.GeoPoint();
                    }
                    event.mousePoint = _mousePoint;
                    _map.dispatchEvent("mouseup", event);
                })
                    .bind("click", function (event) {
                        event.preventDefault();
                        if (_center) {
                            refreshMouse();
                            event.mouseGeoPoint = _mouseGeo;
                        }
                        else {
                            event.mouseGeoPoint = new xf.GeoPoint();
                        }
                        event.mousePoint = _mousePoint;
                        _map.dispatchEvent("click", event);

                    })
                    .bind("dblclick", function (event) {
                        event.preventDefault();
                        //alert("a");
                        if (_center) {
                            refreshMouse();
                            event.mouseGeoPoint = _mouseGeo;
                        }
                        else {
                            event.mouseGeoPoint = new xf.GeoPoint();
                        }
                        event.mousePoint = _mousePoint;
                        _map.dispatchEvent("dbclick", event);
                        //event.preventDefault();
                    })
                .appendTo(_map.container);
        };

        //初始化
        function create() {
            //创建图层容器
            initLayerContainer();
            //创建SVG图层
            initLayerSVG();
            initLayerInfoWindow();
            //如果是支持Touch的移动设备 增加手势放大功能
            if (xf.Touch) {
                _map._setGestureZoomControl(true);
            }
            //设置地图动作
            _map.setAction();
            //设施滚轮放大
            _map._setWheelZoom(true);
            //设置双击放大
            _map._dbClickZoom(true);
        };
        create();
    };
})(jQuery, XiaoFu);

