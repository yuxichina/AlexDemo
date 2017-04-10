//名称：Query
//作者：GIS-Client Team YC
//说明：查询Task
//更新
//2012-7-16
(function ($, xf) {
    xf.Query = function (_url) {
        //类型
        this.type = "query";
        //空间对象
        this.geometry = null;
        //是否返回空间数据
        this.reuturnGeometry = false;
        //允许最大容限
        this.maxAllowableOffset = 0;
        //objectIds
        this.objectIds = [];
        //排序字段
        this.orderByFields = [];
        //返回字段
        this.outFields = [];
        //返回数据坐标系
        this.outSpatiallReference = null;
        //空间关系
        this.spatialRelationship = null;
        //参数
        this.text = "";
        //where
        this.where = "";
        //最大返回数
        this.expectCount = 10;
        //数据类型
        this.dataType = "json";
        var _query = this;
        this.request = function (_successFun, _errorFun) {
            if (_url) {
                var query = _query;
                var data = {};
                for (var key in query) {
                    var item = query[key];
                    if (typeof item != "function" && key != "type") {
                        if (key == "geometry") {
                            if (item) {
                                data[key] = item;
                            }
                            else {
                                data["method"] = "QueryBySQL";
                            }
                        }
                        else {
                            if (!xf.Utils.isNull(item)) {
                                if (xf.Utils.isArray(item)) {
                                    data[key] = item.join(",");
                                }
                                else {
                                    data[key] = item;
                                }
                            }
                            else {
                                data[key] = "";
                            }
                        }
                    }
                }

                xf.Request.apply(_query, []);
                _query.requestType = "jsonp";
                _query.send(_url, data, function (data) {

                }, function (data) {
                    var value = data;
                    if (value.Success) {
                        var evt = new xf.Event();
                        evt.result = new xf.QueryResult();
                        evt.result._fromServer(value.Message);
                        _successFun(evt);
                    }
                    else {
                        _errorFun();
                    }
                },
                function (data) {
                    var value = data;
                    _errorFun();
                });
            }
            else {
                _errorFun({ message: "Url Error!" });
            }
        }

        function getUrl() {



        };

    };
})(jQuery, XiaoFu);
