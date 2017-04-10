//名称：Projection
//作者：GIS-Client Team YC
//说明：坐标系
//更新
//2012-8-13
(function ($, xf) {
    xf.Transform = function () {
        this.type = "XiaoFu.Transform";
        //坐标转换
        this.transform = function (sourceProj, destProj, points) {
            var resultPoints = new Array();
            if (!xf.Utils.isNull(sourceProj) && !xf.Utils.isNull(destProj) && xf.Utils.isArray(points)) {
                var sourceProj4j = sourceProj.projInstance;
                var destProj4j = destProj.projInstance;
                for (var i = 0; i < points.length; i++) {
                    var subPoint = points[i];
                    var pointSource = new Proj4js.Point(subPoint.x, subPoint.y);
                    var resultPoint = Proj4js.transform(sourceProj4j, destProj4j, pointSource);
                    resultPoints.push(resultPoint);
                }
            }
            return resultPoints;
        };
    };
})(jQuery, XiaoFu);