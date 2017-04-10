//名称：PanAction
//作者：GIS-Client Team YC
//说明：平移动作类
//更新
//2012-8-16
(function ($, xf) {
    xf.PanAction = function () {
        xf.Action.apply(this, []);
        this.type = "XiaoFu.PanAction";
        //操作地图
        this.map = null;
        var _action = this;
        var _panStart = false;
        //创建动作
        this._create = function (map) {
            _action.map = map;
            _action.map._setDraggable(false);
            _action.map._setDraggable(true);
            _action.map._setCursor("openhand");
//            _action.map._dbClickZoom(false);
            _action.map._dbClickZoom(true);
            _action.map.addEventListener("mousedown", function () {
                _action.map._setCursor("closehand");
                _panStart = true;

            }, "PanAction");
            _action.map.addEventListener("mousemove", function (event) {
                if (_panStart) {
                    //_action.map._setCursor("closehand");
                }
                else {
                    //_action.map._setCursor("openhand");

                }
            }, "PanAction");
            _action.map.addEventListener("mouseup", function () {
                _panStart = false;
                _action.map._setCursor("openhand");
                
            }, "PanAction");
            _action.map.addEventListener("dragstop", function () {
                _panStart = false;
                _action.map._setCursor("openhand");
            }, "PanAction");

        };
        //销毁动作
        this.destory = function () {
            _action.map.removeEventListener("mousedown", "PanAction");
            _action.map.removeEventListener("mousemove", "PanAction");
            _action.map.removeEventListener("mouseup", "PanAction");
            _action.map.removeEventListener("dragstop", "PanAction");
            //_action.map = null;
            _action = null;
        };
    };
})(jQuery, XiaoFu);