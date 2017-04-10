//名称：Action
//作者：GIS-Client Team YC
//说明：地图动作类
//更新
//2012-8-16
(function ($, xf) {
    xf.Action = function () {
        xf.Dispatch.apply(this, []);
        this.type = "XiaoFu.Action";
        this.map = null;
        this.spatialReference = null;
        this._create = function () { };
        this.destory = function () { };
    };
})(jQuery, XiaoFu);