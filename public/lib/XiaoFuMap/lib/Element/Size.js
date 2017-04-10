//名称：Size 
//作者：GIS-Client Team YC
//说明：Size对象，像素宽高
//更新：
//2012-7-16
(function ($, xf) {
    xf.Size = function (_w, _h) {
        this.type = "XiaoFu.Size";
        //像素宽度
        this.w = null;
        //像素高度
        this.h = null;
        if (xf.Utils.isNumber(_w)) {
            this.w = _w;
        }
        if (xf.Utils.isNumber(_h)) {
            this.h = _h;
        }
    };
})(jQuery, XiaoFu);