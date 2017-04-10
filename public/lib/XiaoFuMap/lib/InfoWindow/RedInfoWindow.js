////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------RedInfoWindow对象----------------------------
////----------------创建日期：2012-10-15------------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

//×××××RedInfoWindow对象×××××
XiaoFu.RedInfoWindow = function () {

    //自身
    var _self = this;
    var _isLoad = false;
    this.strArray = null;

    this.init = function (p_layerId) {
        if ($("#myInfoWindow").length) {
            clearInfoWindow();
        } else {
            var m_infoWindow = $("<div></div>")
                .attr("id", "myInfoWindow")
                .css("position", "absolute")
                .css("left", 0)
                .css("top", 0)
                .css("z-index", 307)
                .css("cursor", "default")
                .appendTo($("#MapContainer"));
        }
        _isLoad = true;
        _self.id = p_layerId;
        _self.update();
    }

    this.show = function () {
        if (_isLoad) {
            showInfoWindow();
        }
    }

    this.hide = function () {
        if (_isLoad) {
            clearInfoWindow();
        }
    }

    this.update = function () {
        if (_isLoad) {
            var m_geoPoint = new XiaoFu.GeoPoint(_self.x, _self.y);
            var m_point = map.mapToPoint(m_geoPoint);
            var m_left = m_point.x - 203;
            var m_top = m_point.y - 216;
            $("#custom_info_window_red").css("left", m_left);
            $("#custom_info_window_red").css("top", m_top);
        }
    }

    function clearInfoWindow() {
        $("#myInfoWindow").html("");
    }

    function showInfoWindow() {
        var m_geoPoint = new XiaoFu.GeoPoint(_self.x, _self.y);
        var m_point = map.mapToPoint(m_geoPoint);
        var m_left = m_point.x - 203;
        var m_top = m_point.y - 216;
        var m_iw = $("<div></div>")
            .attr("id", "custom_info_window_red")
            .css("position", "absolute")
            .css("visibility", "visible")
            .css("display", "block")
            .css("width", 400)
            .css("left", m_left)
            .css("top", m_top)
            .appendTo($("#myInfoWindow"));
        var m_iw_div = $("<div></div>")
            .appendTo(m_iw);
        var m_iw_div_tl = $("<div></div>")
            .attr("id", "custom_info_window_red_tl")
            .css("position", "absolute")
            .css("width", 16)
            .css("height", 16)
            .css("top", 0)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_t = $("<div></div>")
            .attr("id", "custom_info_window_red_t")
            .css("position", "absolute")
            .css("width", 374)
            .css("height", 16)
            .css("top", 0)
            .css("left", 16)
            .appendTo(m_iw_div);
        var m_iw_div_tr = $("<div></div>")
            .attr("id", "custom_info_window_red_tr")
            .css("position", "absolute")
            .css("width", 16)
            .css("height", 16)
            .css("top", 0)
            .css("left", 390)
            .appendTo(m_iw_div);
        var m_iw_div_l = $("<div></div>")
            .attr("id", "custom_info_window_red_l")
            .css("position", "absolute")
            .css("width", 3)
            .css("height", 149)
            .css("top", 16)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_r = $("<div></div>")
            .attr("id", "custom_info_window_red_r")
            .css("position", "absolute")
            .css("width", 3)
            .css("height", 149)
            .css("top", 16)
            .css("left", 403)
            .appendTo(m_iw_div);
        var m_iw_div_bl = $("<div></div>")
            .attr("id", "custom_info_window_red_bl")
            .css("position", "absolute")
            .css("width", 16)
            .css("height", 16)
            .css("top", 165)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_b = $("<div></div>")
            .attr("id", "custom_info_window_red_b")
            .css("position", "absolute")
            .css("width", 374)
            .css("height", 16)
            .css("top", 165)
            .css("left", 16)
            .appendTo(m_iw_div);
        var m_iw_div_br = $("<div></div>")
            .attr("id", "custom_info_window_red_br")
            .css("position", "absolute")
            .css("width", 16)
            .css("height", 16)
            .css("top", 165)
            .css("left", 390)
            .appendTo(m_iw_div);
        var m_iw_div_beak = $("<div></div>")
            .attr("id", "custom_info_window_red_beak")
            .css("position", "absolute")
            .css("width", 28)
            .css("height", 38)
            .css("top", 178)
            .css("left", 189)
            .appendTo(m_iw_div);
        var m_iw_div_contents = $("<div></div>")
            .attr("id", "custom_info_window_red_contents")
            .css("position", "absolute")
            .css("display", "block")
            .css("visibility", "visible")
            .css("overflow", "auto")
            .css("width", 400)
            .css("height", 149)
            .css("top", 16)
            .css("left", 3)
            .appendTo(m_iw_div);
        if (_self.title) {
            var m_title = $("<div></div>")
                .addClass("title")
                .html(_self.title)
                .appendTo(m_iw_div_contents);
        }
        if (_self.strArray) {
            var m_nun = false;
            for (var i = 0; i < _self.strArray.length; i++) {
                var m_strHtml = _self.strArray[i];
                var m_class = "section1";
                if (m_nun) {
                    m_class = "section2";
                }
                var m_str = $("<div></div>")
                    .addClass(m_class)
                    .appendTo(m_iw_div_contents);
                var m_p = $("<p></p>")
                    .html(m_strHtml)
                    .appendTo(m_str);
                m_nun = !m_nun;
            }
        } else {
            var m_p = $("<p></p>")
                .html(_self.strHtml)
                .appendTo(m_iw_div_contents);
        }
        var m_iw_div_close = $("<div></div>")
            .attr("id", "custom_info_window_red_close")
            .click(function () {
                $("#myInfoWindow").html("");
            })
            .css("position", "absolute")
            .css("width", 21)
            .css("height", 21)
            .css("top", 3)
            .css("left", 382)
            .appendTo(m_iw_div);
    }
}