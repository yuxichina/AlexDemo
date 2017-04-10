//名称：QueryResult
//作者：GIS-Client Team YC
//说明：查询结果
//更新
//2012-7-16
(function ($, xf) {
    xf.QueryResult = function () {
        var _result = this;
        //类型
        this.type = "XiaoFu.QueryResult";
        this.totalCount = 0;
        this.currentCount = 0;
        this.startCount = 0;
        this.resultSets = null;
        this._fromServer = function (serverObj) {
            _result.totalCount = serverObj.TotalCount;
            _result.currentCount = serverObj.CurrentCount;

            var rss = serverObj.RecordSets||[];
            _result.resultSets = serverObj.RecordSets? []: null;
            for (var i = 0; i < rss.length; i++) {
                var srs = rss[i];
                var recordSet = new xf.RecordSet();
                recordSet._fromServer(srs);
                _result.resultSets.push(recordSet);
            }

        };
    };

    xf.RecordSet = function () {
        var _rs = this;
        this.type = "XiaoFu.RecordSet";
        this.layerName = "";
        this.records = null;
        this.returnFields = null;
        this._fromServer = function (serverObj) {
            _rs.layerName = serverObj.LayerName;
            _rs.returnFields = serverObj.ReturnFields || [];

            var rs = serverObj.Records||[];
            _rs.records = serverObj.Records? []:null;
            for (var i = 0; i < rs.length; i++) {
                var sr = rs[i];
                var r = new xf.Record();
                r._fromServer(sr);
                _rs.records.push(r);
            }

        };
    };

    xf.Record = function () {
        var _r = this;
        this.type = "XiaoFu.Record";
        this.fieldValues = null;
        this.geometry = null;
        this.id = null;
        this._fromServer = function (serverObj) {
            _r.id = serverObj.ID;
            _r.fieldValues = serverObj.FieldValues;
            if (serverObj.Geometry) {
                var type = serverObj.Geometry.type;
                if (type == "MultiLineString") {
                    _r.geometry = new xf.GeoLine();
                }
                else if (type == "MultiPolygon") {
                    _r.geometry = new xf.GeoPolygon();
                }
                else if (type == "Point") { _r.geometry = new xf.GeoPoint(); }
                if (_r.geometry) {
                    _r.geometry._fromServer(serverObj.Geometry.coordinates);
                }
            }

        }
    };
})(jQuery, XiaoFu);
