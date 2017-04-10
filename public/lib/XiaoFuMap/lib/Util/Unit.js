//名称：unit
//作者：GIS-Client Team YC
//说明：单位
//更新
//2012-8-13

(function ($, xf) {
    xf.Unit = function () {
        this.type = "XiaoFu.Unit";
        var _unit = this;
        this.SupportType = {
            distance:
                [{ name: "meter", display: "m", cc: "米" },
                { name: "kilometer", display: "km", cc: "公里" },
                { name: "mile", display: "mi", cc: "英里" },
                { name: "foot", display: "ft", cc: "英尺" },
                { name: "inch", display: "in", cc: "英寸" }]
            ,
            area:
                [
                { name: "hectare", display: "hm2", cc: "公顷" },
                { name: "square kilometer", display: "km2", cc: "平方公里" },
                { name: "square meter", display: "m2", cc: "平方米" }
                ]
        };
        this.meterToKilometer = function (meter) {
            return meter / 1000;
        };
        this.meterToMile = function (meter) {
            return meter / 1609.344;
        };
        this.meterToFoot = function (meter) {
            return meter / 0.3048;
        };
        this.meterToInch = function (meter) {
            return meter / 0.0254;
        };
        this.otherToMeter = function (value, unit) {
            var meter = 0;
            switch (unit) {
                case "km":
                    meter = value * 1000;
                    break;
                case "mi":
                    meter = value * 1609.344;
                    break;
                case "ft":
                    meter = value * 0.3048;
                    break;
                case "in":
                    meter = value * 0.0254;
                    break;
                default:
                    meter = value;
                    break;
            }
            return meter;
        };
        this.meterToOther = function (meter, toUnit) {
            var value = 0;
            switch (toUnit) {
                case "km":
                    value = meter / 1000;
                    break;
                case "mi":
                    value = meter / 1609.344;
                    break;
                case "ft":
                    value = meter / 0.3048;
                    break;
                case "in":
                    value = meter / 0.0254;
                    break;
                default:
                    value = meter;
                    break;
            }
            return value;

        };
        this.getAllDistance = function (value, unit) {
            var meter = _unit.otherToMeter(value, unit);
            var result = new Array();
            for (var i = 0; i < _unit.SupportType.distance.length; i++) {
                var u = _unit.SupportType.distance[i];
                var val = _unit.meterToOther(meter, u.display);
                result.push({ value: val, unit: u });
            }
            return result;
        };

    };


})(jQuery, XiaoFu);
