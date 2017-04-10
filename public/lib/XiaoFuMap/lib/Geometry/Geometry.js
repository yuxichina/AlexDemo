//名称：Geometry
//作者：GIS-Client Team YC
//说明：空间对象基类
//更新
//2012-7-16
(function ($, xf) {
    xf.Geometry = function () {
        this.type = "XiaoFu.Geometry";
        this.spatialReference = null;

        this._fromServer = function () { };
    };
})(jQuery, XiaoFu);