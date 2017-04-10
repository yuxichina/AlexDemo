//名称：Point
//作者：GIS-Client Team YC
//说明：像素坐标点
//更新
//2012-7-16
(function ($, xf) {
    xf.Point = function (_x, _y) {
        this.type = "XiaoFu.Point";
        //像素坐标
        this.x = null;
        this.y = null;
        if (xf.Utils.isNumber(_x)) {
            this.x = _x;
        }
        if (xf.Utils.isNumber(_y)) {
            this.y = _y;
        }
    };
})(jQuery, XiaoFu);