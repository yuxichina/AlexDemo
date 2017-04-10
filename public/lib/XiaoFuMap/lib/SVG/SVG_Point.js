////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------SVGLayers—点对象----------------------------
////----------------创建日期：2012-7-6------------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

//×××××SVGLayers—点对象×××××
//p_id（点id）
//p_name（名称）
//p_x（x坐标）
//p_y（y坐标）
XiaoFu.SVG_Point = function (p_id, p_name, p_x, p_y) {
    XiaoFu.Dispatch.apply(this, []);
    this.id = null;
    this.x = null;
    this.y = null;
    this.name = null;
    //简介
    this.description = "";
    //半径
    this.r = 6;
    //颜色
    this.fill = "#ee9900";
    //透明度
    this.fillOpacity = 1;
    //边框的颜色
    this.stroke = "#ee9900";
    //名称文字大小
    this.nameSize = 10;
    //名称文字颜色
    this.nameColor = "red";
    //需要关联的数据
    this.data = null;
    //是否可见
    this.visiable = true;
    //点击事件
    //this.onclick = null;
    init = function (p_self) {
        p_self.id = p_id;
        p_self.x = p_x;
        p_self.y = p_y;
        p_self.name = p_name;
    }
    init(this);
    return this;
};