//名称：Request
//作者：GIS-Client Team YC
//说明：异步通讯参数基类
//更新
//2012-7-16
(function ($, xf) {
    xf.Request = function () {
        //所属地图
        this.map = null;
        //类型
        this.type = "request";
        //Id
        this.id = "";
        //代理
        this.proxy = "";
        //类型
        this.requestType = "get";
        //
        this.url = "";
        //
        this.data = null;
        var request = this;

        this.send = function (_url, _data, _complate, _success, _error) {
            var ajaxType = "get";
            if (request.requestType == "post") {
                ajaxType = "post";
            }
            var dataType = "json";
            if (request.requestType == "jsonp") {
                dataType = "jsonp";
            }
            request.url = _url;
            var round = Math.round(Math.random() * 100000);
            $.ajax({
                url: _url,
                error: _error,
                success: _success,
                complete: _complate,
                data: _data,
                dataType: dataType,
                type: ajaxType,
                jsonpCallback: "xiaofu" + round
            });
        }
    };
})(jQuery, XiaoFu);
