////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------Marker—string对象----------------------------
////----------------创建日期：2012-9-4------------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

//×××××Marker—string对象×××××
//p_id（点id）
//p_str（string内容）
XiaoFu.Marker_String = function (p_id, p_str, p_x, p_y) {
    XiaoFu.Dispatch.apply(this, []);
    this.id = null;
    this.x = null;
    this.y = null;
    this.str = null;
    //需要关联的数据
    this.data = null;
    //是否可见
    this.visiable = true;
    //自身
    var _self = this;

    init = function (p_self) {
        p_self.id = p_id;
        p_self.x = p_x;
        p_self.y = p_y;
        p_self.str = p_str;
    }

    this.addMarker = function (p_point, p_id) {
        if (!_self.visiable)
            return;
        var m_iw = $("<div></div>")
            .attr("id", "marker_string_" + _self.id)
            .css("position", "absolute")
            .css("left", p_point.x)
            .css("top", p_point.y)
            .html(_self.str)
            .appendTo($("#" + p_id));
    }

    this.updataMarker = function (p_point) {
        if (!_self.visiable) {
            _self.deleteMarker();
            return;
        }
        $("#marker_string_" + _self.id).css("top", p_point.y);
        $("#marker_string_" + _self.id).css("left", p_point.x);
    }

    this.deleteMarker = function () {
        try {
            var ob = document.getElementById("marker_string_" + _self.id);
            ob.parentNode.removeChild(ob);
        }
        catch (e) {

        }
    }

    init(this);
};