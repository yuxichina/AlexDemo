////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------Marker—jQuery对象----------------------------
////----------------创建日期：2012-9-10------------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

//×××××Marker—jQuery对象×××××
//p_id（点id）
//p_jQuery（jQuery内容）
XiaoFu.Marker_jQuery = function (p_id, p_jQuery, p_x, p_y) {
    XiaoFu.Dispatch.apply(this, []);
    this.id = null;
    this.x = null;
    this.y = null;
    this.jQuery = null;
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
        p_self.jQuery = p_jQuery;
    }

    this.addMarker = function (p_point, p_id) {
        if (!_self.visiable)
            return;
        _self.jQuery.attr("id", "marker_jQuery_" + _self.id);
        _self.jQuery.css("left", p_point.x);
        _self.jQuery.css("top", p_point.y);
        _self.jQuery.appendTo($("#" + p_id));
    }

    this.updataMarker = function (p_point) {
        if (!_self.visiable) {
            _self.deleteMarker();
            return;
        }
        $("#marker_jQuery_" + _self.id).css("left", p_point.x);
        $("#marker_jQuery_" + _self.id).css("top", p_point.y);
    }

    this.deleteMarker = function () {
        try {
            var ob = document.getElementById("marker_jQuery_" + _self.id);
            ob.parentNode.removeChild(ob);
        }
        catch (e) {

        }
    }
    init(this);
};