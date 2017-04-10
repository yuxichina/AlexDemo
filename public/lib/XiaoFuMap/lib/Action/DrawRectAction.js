//名称：Action
//作者：GIS-Client Team YC
//说明：地图动作类
//更新
//2012-8-16
(function ($, xf) {
    xf.DrawRectAction = function () {
        xf.Action.apply(this, []);
        //事件  drawend drawpress
        this.type = "XiaoFu.DrawRectAction";
        //操作地图
        this.map = null;
        //坐标系
        this.spatialReference = null;
        var _action = this;
        var _startGeo = null;
        var _actionStart = false;
        //创建动作
        this._create = function (map) {
            _action.map = map;
            _action.map._setCursor("auto");
            _action.map._setDraggable(false);
            _action.map._dbClickZoom(true);
            _action.spatialReference = map.getSpatialReference();
            _action.map.addEventListener("mousedown", function (eventType, evt) {
                if (!_actionStart) {
                    _action.map._setDraggable(false);
                    _actionStart = true;
                    _startGeo = evt.mouseGeoPoint;
                }
            }, "DrawRectAction");
            _action.map.addEventListener("mouseup", function (eventType, evt) {
                if (_actionStart) {
                    _action.map._setDraggable(true);
                    _actionStart = false;
                    var rect = new xf.GeoPolygon();
                    rect.path = new Array();
                    rect.path[0] = new Array();
                    rect.spatialReference = _action.spatialReference;
                    var endGeo = evt.mouseGeoPoint;
                    rect.path[0][0] = new xf.GeoPoint(_startGeo.x, _startGeo.y, _action.spatialReference);
                    rect.path[0][1] = new xf.GeoPoint(endGeo.x, _startGeo.y, _action.spatialReference);
                    rect.path[0][2] = new xf.GeoPoint(endGeo.x, endGeo.y, _action.spatialReference);
                    rect.path[0][3] = new xf.GeoPoint(_startGeo.x, endGeo.y, _action.spatialReference);
                    rect.path[0][4] = rect.path[0][0];
                    var returnEvt = new xf.Event();
                    returnEvt.geometry = new xf.GeoPolygon(rect.path, _action.spatialReference); ;
                    _startGeo = null;
                    _action.dispatchEvent("drawend", returnEvt);
                }
            }, "DrawRectAction");
            _action.map.addEventListener("mousemove", function (eventType, evt) {
                if (_actionStart) {
                    var rect = new xf.GeoPolygon();
                    rect.path = new Array();
                    rect.path[0] = new Array();
                    rect.spatialReference =  _action.spatialReference;
                    //                    for (var i = 0; i < _rect.path[0].length; i++) {
                    //                        rect.path[0].push(_rect.path[0][i]);
                    //                    }
                    //                    rect.path[0].push(evt.mouseGeoPoint);
                    var endGeo = evt.mouseGeoPoint;
                    rect.path[0][0] = new xf.GeoPoint(_startGeo.x, _startGeo.y, _action.spatialReference);
                    rect.path[0][1] = new xf.GeoPoint(endGeo.x, _startGeo.y, _action.spatialReference);
                    rect.path[0][2] = new xf.GeoPoint(endGeo.x, endGeo.y, _action.spatialReference);
                    rect.path[0][3] = new xf.GeoPoint(_startGeo.x, endGeo.y, _action.spatialReference);
                    rect.path[0][4] = rect.path[0][0];
                    var returnEvt = new xf.Event();
                    returnEvt.geometry = new xf.GeoPolygon(rect.path,_action.spatialReference); ;
                    _action.dispatchEvent("drawprogress", returnEvt);
                }
            }, "DrawRectAction");

        };
        //销毁动作
        this.destory = function () {
            _action.map.removeEventListener("mouseup", "DrawRectAction");
            _action.map.removeEventListener("mousemove", "DrawRectAction");
            _action.map.removeEventListener("mousedown", "DrawRectAction");
        };
    };
})(jQuery, XiaoFu);