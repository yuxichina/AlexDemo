//名称：Projection
//作者：GIS-Client Team YC
//说明：坐标系
//更新
//2012-8-13
(function ($, xf) {
    xf.Projection = function (proj) {
        this.type = "XiaoFu.Projection";
        //坐标系代码
        this.code = "";
        //坐标系单位
        this.unit = "";
        this.projInstance = null;
        var _proj = this;
        //创建坐标系
        function create() {
            if (Proj4js) {
                if (xf.Utils.isString(proj)) {
                    _proj.projInstance = new Proj4js.Proj(proj);
                    _proj.code = _proj.projInstance.srsCode;
                    _proj.unit = _proj.projInstance.unit;
                }
                else if (proj.type == this.type) {
                    _proj.projInstance = proj.projInstance;
                    _proj.code = proj.code;
                    _proj.unit = proj.unit;
                }
            }
        };
        create();
    };
})(jQuery, XiaoFu);