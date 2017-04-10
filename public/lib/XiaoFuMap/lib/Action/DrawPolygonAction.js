//名称：Action
//作者：GIS-Client Team YC
//说明：地图动作类
//更新
//2012-8-16
(function ($, xf) {
    xf.DrawPolygonAction = function () {
        xf.Action.apply(this, []);
        //事件  drawend drawpress
        this.type = "XiaoFu.DrawPolygonAction";
        //操作地图
        this.map = null;
        //坐标系
        this.spatialReference = null;
        var _action = this;
        var _polygon = null;
        var _actionStart = false;
        //创建动作
        this._create = function (map) {
            _action.map = map;
            _action.map._setCursor("auto");
            _action.map._setDraggable(true);
            _action.map._dbClickZoom(false);
            _action.spatialReference = map.getSpatialReference();
            _action.map.addEventListener("click", function (eventType, evt) {
                if (!_actionStart) {
                    _actionStart = true;
                    _polygon = new xf.GeoPolygon();
                    _polygon.path = new Array();
                    _polygon.path[0] = new Array();
                    _polygon.path[0].push(evt.mouseGeoPoint);
                    _polygon.spatialReference = _action.spatialReference;
                    var returnEvt = new xf.Event();
                    returnEvt.geometry = new xf.GeoPolygon(_polygon.path, _action.spatialReference);
                    _action.dispatchEvent("drawprogress", returnEvt);
                }
                else {
                    _polygon.path[0].push(evt.mouseGeoPoint);
                    var returnEvt = new xf.Event();
                    returnEvt.geometry = new xf.GeoPolygon(_polygon.path, _action.spatialReference); ;
                    _action.dispatchEvent("drawprogress", returnEvt);
                }
            }, "DrawPolygonAction");
            _action.map.addEventListener("dbclick", function (eventType, evt) {
                if (_actionStart) {
                    _actionStart = false;
                    _polygon.path[0].push(evt.mouseGeoPoint);
                    var returnEvt = new xf.Event();
                    returnEvt.geometry = new xf.GeoPolygon(_polygon.path, _action.spatialReference);
                    _action.dispatchEvent("drawend", returnEvt);
                }
            }, "DrawPolygonAction");
            _action.map.addEventListener("mousemove", function (eventType, evt) {
                if (_actionStart) {
                    var polygon = new xf.GeoPolygon();
                    polygon.path = new Array();
                    polygon.path[0] = new Array();
                    polygon.spatialReference = _action.spatialReference;
                    for (var i = 0; i < _polygon.path[0].length; i++) {
                        polygon.path[0].push(_polygon.path[0][i]);
                    }
                    polygon.path[0].push(evt.mouseGeoPoint);
                    var returnEvt = new xf.Event();
                    returnEvt.geometry = new xf.GeoPolygon(polygon.path, _action.spatialReference); ;
                    _action.dispatchEvent("drawprogress", returnEvt);
                }
            }, "DrawPolygonAction");

        };
        //销毁动作
        this.destory = function () {
            _action.map.removeEventListener("dbclick", "DrawPolygonAction");
            _action.map.removeEventListener("mousemove", "DrawPolygonAction");
            _action.map.removeEventListener("click", "DrawPolygonAction");
        };
    };
})(jQuery, XiaoFu);