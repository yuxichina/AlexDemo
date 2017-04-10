//名称：GeoPoint
//作者：GIS-Client Team YC
//说明：空间坐标点
//更新
//2012-7-16
(function ($, xf) {
    xf.GeoPoint = function (x, y, spatialReference) {
        xf.Geometry.apply(this, []);
        this.x = 0;
        this.y = 0;
        var _gp = this;
        this.type = "XiaoFu.GeoPoint";
        this.getExtent = function () { return new xf.Extent(_gp.x, _gp.y, _gp.x, _gp.y); };
        this.toJson = function () { return "[" + _gp.x + "," + _gp.y + "]"; };
        this._fromServer = function (serverObj) { _gp.x = serverObj[0]; _gp.y = serverObj[1]; };
        if (xf.Utils.isNumber(x)) {
            this.x = x;
        }
        if (xf.Utils.isNumber(y)) {
            this.y = y;
        }
        if (spatialReference != "undefined") {
            this.spatialReference = spatialReference;
        }

    };
})(jQuery, XiaoFu);
