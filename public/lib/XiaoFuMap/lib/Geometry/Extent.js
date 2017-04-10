//名称：Extent 
//作者：GIS-Client Team YC
//说明：地图范围对象
//更新
//2012-7-16
(function ($, xf) {
    xf.Extent = function (minx, miny, maxx, maxy, spatialReference) {
        xf.Geometry.apply(this, []);
        var ex = this;
        this.type = "XiaoFu.Extent";
        //坐标系
        this.spatialReference = null;
        //横向最小点        
        this.minX = null;
        //纵向最小
        this.minY = null;
        //横向最大
        this.maxX = null;
        //纵向最大
        this.maxY = null;
        //获取宽度
        this.width = function () { return this.maxX - this.minX; };
        //获取高度
        this.height = function () { return this.maxY - this.minY; };
        //获取中心点
        this.center = function () {
            var centerX = this.minX + this.width() / 2;
            var centerY = this.minY + this.height() / 2;
            return new xf.GeoPoint(centerX, centerY, this.spatialReference);
        };
        this.toJson = function () {
            var json = "";
            var path = [minx, miny, maxx, maxy];
            for (var i = 0; i < path.length; i++) {
                if (json != "") {
                    json += ",";
                }
                json += path[i].toJson();
            }
            return "[" + json + "]";
        };
        if (xf.Utils.isNumber(minx)) {
            this.minX = minx;
        }
        if (xf.Utils.isNumber(miny)) {
            this.minY = miny;
        }
        if (xf.Utils.isNumber(maxx)) {
            this.maxX = maxx;
        }
        if (xf.Utils.isNumber(maxy)) {
            this.maxY = maxy;
        }
        if (spatialReference != "undefined") {
            this.spatialReference = spatialReference;
        }

    };
})(jQuery, XiaoFu);