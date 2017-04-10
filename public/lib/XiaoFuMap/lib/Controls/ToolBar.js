//名称：ToolBar
//作者：GIS-Client Team YC
//说明：工具条
//更新
//2012-8-13
(function ($, xf) {
    xf.ToolBar = function () {
        xf.Control.apply(this, []);
        var _control = this;
        var _toolBarImgUrl = "../image/toolbox2.png";
        this.type = "XiaoFu.ToolBar";
        //关联地图
        this.map = null;
        //容器
        this.container = null;
        //工具容器
        this.toolboxContainer = null;
        //添加工具列表
        this.tools = new Array();
        //添加工具
        this.addTool = function (tool) {
            tool._create(_control);
            tool.container.appendTo(_control.toolboxContainer);
        };
        //创建工具条
        this._create = function (map) {
            this.map = map;
            var index = map.LayerIndexList.Control + map.controls.length;
            this.container = $("<div></div>")
                            .attr("id", index + "_Control")
                            .css("position", "absolute")
                            .css("z-index", index)
                            .css("opacity", 1)
                            .css("border-radius", "30px")
                            .css("-moz-border-radius", "30px")
                            .css("background-color", "#C1D5EB")
                            .css("right", "30px")
                            .css("top", "30px")
                            .hover(
                                function () {
                                    _control.show();
                                }, function () {
                                    _control.hide();
                                }
                            )
                                .appendTo(map.container);
            var toolboxContainer = $("<div></div>")
                            .css("padding", "5px")
                            .css("float", "left")
                            .css("border-radius", "30px")
                            .css("-moz-border-radius", "30px")
                            .css("background-color", "#C1D5EB")
                            .css("border", "2px solid white")
                            .appendTo(this.container);
            var toolboxImg = $("<canvas></canvas>")
            .attr("id", "toolImg")
            .attr("width", "30px")
            .attr("height", "30px")
            .appendTo(toolboxContainer);
            var img = new Image();
            img.src = _toolBarImgUrl;
            img.onload = function () {
                var c = document.getElementById("toolImg");
                ctx = c.getContext("2d");
                ctx.drawImage(img, 0, 0, 30, 30);
            };
            this.toolboxContainer = $("<div></div>")
                            .attr("id", "ToolContainer")
                            .css("padding", "7px 3px 0px 3px")
                            .css("float", "left")
                            .css("display", "none")
                            .appendTo(this.container);
        };
        //显示工具
        this.show = function () { _control.toolboxContainer.show(); };
        //隐藏工具
        this.hide = function () { _control.toolboxContainer.hide(); };
        //销毁
        this.destory = function () { };

    };
})(jQuery, XiaoFu);



