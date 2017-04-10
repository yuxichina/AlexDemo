//名称：Action
//作者：GIS-Client Team YC
//说明：地图动作类-画线
//更新
//2012-8-16
(function ($, xf) {
    xf.DrawLineAction = function () {
        xf.Action.apply(this, []);
        //事件  drawend drawpress
        this.type = "XiaoFu.DrawLineAction";
        //操作Map对象
        this.map = null;
        //是否在SVG中显示绘图效果
        this.showGeoInSvg = false;
        //坐标系
        this.spatialReference = null;
        //this.lineStyle 
        var _action = this;
        var _line = null;
        var _actionStart = false;
        //创建动作      
        this._create = function (map) {
            _action.map = map;
            _action.map._setCursor("auto");
            _action.map._setDraggable(false);
            _action.map._dbClickZoom(false);
            _action.spatialReference = map.getSpatialReference();
            _action.map.addEventListener("click", function (eventType, evt) {
                //alert("a");
                evt.preventDefault();
                if (!_actionStart) {
                    _actionStart = true;
                    _line = new xf.GeoLine();
                    _line.spatialReference = _action.spatialReference;
                    _line.path = new Array();
                    _line.path[0] = new Array();
                    _line.path[0].push(evt.mouseGeoPoint);
                    //_line.pointerEvents
                    var returnEvt = new xf.Event();
                    returnEvt.geometry = _line;
                    _action.dispatchEvent("drawprogress", returnEvt);
                }
                else {
                    _line.path[0].push(evt.mouseGeoPoint);
                    var returnEvt = new xf.Event();
                    returnEvt.geometry = _line;
                    _action.dispatchEvent("drawprogress", returnEvt);
                }
            }, "DrawLineAction");
            _action.map.addEventListener("dbclick", function (eventType, evt) {
                evt.preventDefault();
                if (_actionStart) {
                    _actionStart = false;
                    //_action.map._setDraggable(true);
                    _line.path[0].push(evt.mouseGeoPoint);
                    var returnEvt = new xf.Event();
                    returnEvt.geometry = _line;
                    _action.dispatchEvent("drawend", returnEvt);
                }
            }, "DrawLineAction");
            _action.map.addEventListener("mousemove", function (eventType, evt) {
                evt.preventDefault();
                if (_actionStart) {
                    var line = new xf.GeoLine();
                    line.path = new Array();
                    line.path[0] = new Array();
                    line.spatialReference = _action.spatialReference;
                    for (var i = 0; i < _line.path[0].length; i++) {
                        line.path[0].push(_line.path[0][i]);
                    }
                    line.path[0].push(evt.mouseGeoPoint);
                    var returnEvt = new xf.Event();
                    returnEvt.geometry = line;
                    _action.dispatchEvent("drawprogress", returnEvt);
                }
            }, "DrawLineAction");

        };

        //销毁对象
        this.destory = function () {

            _action.map.removeEventListener("dbclick", "DrawLineAction");
            _action.map.removeEventListener("mousemove", "DrawLineAction");
            _action.map.removeEventListener("click", "DrawLineAction");
        };

        if (arguments.length > 0) {
            var args = arguments[0];
            _action.showGeoInSvg = args.showGeoInSvg || false;

        }
    };
})(jQuery, XiaoFu);