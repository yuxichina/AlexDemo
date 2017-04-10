//名称：Action
//作者：GIS-Client Team YC
//说明：地图动作类-画点
//更新
//2012-8-16
(function ($, xf) {
    xf.DrawPointAction = function () {
        xf.Action.apply(this, []);
        //事件  drawend
        this.type = "XiaoFu.DrawPointAction";
        //操作地图对象
        this.map = null;
        //控件坐标系
        this.spatialReference = null;
        var _action = this;
        var _point;
        //创建对象
        this._create = function (map) {
            _action.map = map;
            _action.map._setCursor("auto");
            _action.map._setDraggable(true);
            _action.spatialReference = map.getSpatialReference();
            _action.map.addEventListener("mousedown", function (eventType, evt) {
                _point = evt.mouseGeoPoint;
            }, "DrawPointAction");
            _action.map.addEventListener("mouseup", function (eventType, evt) {
                var returnEvt = new xf.Event();
                returnEvt.mouseGeoPoint = evt.mouseGeoPoint;
                returnEvt.mousePoint = evt.mousePoint;
                if (_point.x == evt.mouseGeoPoint.x && _point.y == evt.mouseGeoPoint.y) {
                    _action.dispatchEvent("drawend", returnEvt);
                }
            }, "DrawPointAction");

        };
        //销毁对象
        this.destory = function () {
            _action.map.removeEventListener("mousedown", "DrawPointAction");
            _action.map.removeEventListener("mouseup", "DrawPointAction");
        };
    };
})(jQuery, XiaoFu);