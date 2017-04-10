//名称：Measure
//作者：GIS-Client Team YC
//说明：量算
//更新
//2012-8-13
(function ($, xf) {
    xf.Measure = function () {
        this.type = "XiaoFu.MeasureResult";
        var measure = this;
        //获取距离
        this.getDistance = function (points, spatialReference) {
            var transform = new xf.Transform();
            var totalLength = 0;
            var result;
            if (points && points.length > 1) {
                for (var i = 0; i < points.length - 1; i++) {
                    var sourceProj = new xf.Projection(spatialReference);
                    var destProj = new xf.Projection("WGS84");
                    var ftPoint = transform.transform(sourceProj, destProj, [points[i], points[i + 1]]);
                    var fPoint = ftPoint[0];
                    var tPoint = ftPoint[1];
                    totalLength += measure._getDistanceBetweenTwoPoints(fPoint, tPoint);
                }
                result = new xf.MeasureResult();
                result.type = result.ResultType.Distance;
                var unit = new xf.Unit();
                result.result = unit.getAllDistance(totalLength, "m");
            }
            else {
                result = null;
            }
            return result;
        };
        //从服务器获取距离
        this.getDistanceByServer = function (points, spatialReference, furl, fun) {
            var m_length = 0;
            var m_isback = 0;
            var m_isalert = true;
            var totalLength = 0;
            if (points && points.length > 1) {
                var m_array = points[0];
                m_isback = m_array.length - 1;
                for (var i = 0; i < m_array.length - 1; i++) {
                    var m_strPoint = m_array[i].x + "," + m_array[i].y + ";" + m_array[i + 1].x + "," + m_array[i + 1].y;
                    //var m_url = "http://192.168.0.23/gismapserver/query.ashx?method=MeasureDistance&points=116.398,39.919;121.48,31.23&srid=4143";
                    var m_url = furl + '?method=MeasureDistance&points=' + m_strPoint + '&srid=' + spatialReference;
                    $.ajax({
                        url: m_url,
                        dataType: "jsonp",
                        error: function (jqXHR, textStatus, errorThrown) {
                            m_length++;
                            if (textStatus == "timeout") {
                                if (m_isalert) {
                                    alert('抱歉！请求超时，请重试！或请检查您的网络状况！');
                                    m_isalert = false;
                                }
                            } else if (textStatus == "error" || textStatus == "parsererror") {
                                if (m_isalert) {
                                    alert('抱歉！系统发生错误，请重试！');
                                    m_isalert = false;
                                }
                            } else if (textStatus == "abort") {
                                if (m_isalert) {
                                    alert('抱歉！程序发生中断，请重试！');
                                    m_isalert = false;
                                }
                            }
                            if (m_length == m_isback) {
                                fun(null);
                            }
                        },
                        success: function (data) {
                            m_length++;
                            if (data.Success) {
                                totalLength += parseInt(data.Message);
                                if (m_length == m_isback) {
                                    var result = new xf.MeasureResult();
                                    result.type = result.ResultType.Distance;
                                    var unit = new xf.Unit();
                                    result.result = unit.getAllDistance(totalLength, "m");
                                    fun(result);
                                }
                            } else {
                                if (m_isalert) {
                                    alert('抱歉！有一段距离丢失！');
                                    m_isalert = false;
                                }
                            }
                        }
                    });
                }
            }
            else {
                fun(null);
            }
        };
        //获取面积
        this.getArea = function () { };
        //从服务器获取面积
        this.getAreaByServer = function () { };
        //获取两点间的距离
        this._getDistanceBetweenTwoPoints = function (fPoint, tPoint) {
            var fX = xf.Utils.getAngleRadians(fPoint.x);
            var fY = xf.Utils.getAngleRadians(fPoint.y);
            var tX = xf.Utils.getAngleRadians(tPoint.x);
            var tY = xf.Utils.getAngleRadians(tPoint.y);
            return xf.Params.EarthRadius * Math.acos((Math.sin(fY) * Math.sin(tY) + Math.cos(fY) * Math.cos(tY) * Math.cos(fX - tX)));
        };
        this.destroy = function () { };
    };
})(jQuery, XiaoFu);