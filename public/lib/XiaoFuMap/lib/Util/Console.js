//名称：Console
//作者：GIS-Client Team YC
//说明：日志输出
//更新
//2012-7-16
XiaoFu.Console = new function () {
    this.error = function (msg) { XiaoFu.Utils.isUndefined(console) ? null : console.error(msg); }
    this.warn = function (msg) { XiaoFu.Utils.isUndefined(console) ? null : console.warn(msg); }
    this.info = function (msg) { return; if (!console) { alert("a"); } XiaoFu.Utils.isUndefined(console) ? null : console.log(msg); }
};
$(function () {
    $.widget("custom.message", {
        options: {
        },
        _container: null,
        _messageTable: null,
        _timer: null,
        _active: false,
        showMsg: function (msg) {
            if (msg.actionType == "immediately") {
                this._show(msg);
            }
            else if (msg.actionType == "normal") {
                this._messageTable.push(msg);
                this._show();
            }
            else {


            }

        },
        _setCss: function (type) {
            if (type == "warn") {
                this._container.css("background-color", "#FFE8A6");
            }
            else if (type == "error") {
                this._container.css("background-color", "red");
            }
            else {
                this._container.css("background-color", "#C1D5EB");
            }
        },
        _show: function (msg) {
            if (msg) {
                this._active = true;
                var self = this;
                clearTimeout(this._timer);
                //this._container.fadeOut(0, function () {
                self._setCss(msg.type);
                
                self._container.html(msg.message);

                var left = self.element.width() / 2 - self._container.width() / 2;
                self._container.css("left", left);
                self._container.show();
                //    self._container.fadeIn(1000);
                // });
                this._timer = setTimeout(function () {
                    self._active = false;
                    self._show();
                }, msg.timer);
            }
            else {
                if (this._messageTable.length > 0) {
                    if (!this._active) {
                        this._active = true;
                        var self = this;
                        msg = this._messageTable.shift();
                        this._container.fadeOut(1000, function () {
                            self._container.html(msg.message);
                            self._setCss(msg.type);
                            var left = self.element.width() / 2 - self._container.width() / 2;
                            self._container.css("left", left);
                            self._container.fadeIn(1000);
                        });
                        this._timer = setTimeout(function () {
                            self._active = false;
                            self._show();
                        }, msg.timer);
                    }
                }
                else {
                    this._active = false;
                    this._container.hide();
                    this._container.html("");
                }
            }

        },
        _create: function () {
            this._messageTable = new Array();
            this._container = $("<div></div>")
            .attr("id", "mapMessage")
            .css("position", "absolute")
            .css("text-align", "center")
            .css("margin-left", "auto")
            .css("margin-right", "auto")
            .css("min-width", "100px")
            .css("max-width", this.element.width() / 2)
            .css("min-height", "20px")
            .css("top", "30px")
            .css("padding", "3px 5px 0px 5px")
            .css("vertical-align", "middle")
            .css("background-color", "#C1D5EB")
            .css("opacity", .7)
            .css("pointer-events", "none")
            .css("border-radius", "5px")
            .css("white-space", "normal")
            .css("word-break", "break-all")
            .hide()
            .appendTo(this.element);
            this._refresh();
        },
        _refresh: function () {

        },
        _destroy: function () {
        },
        _setOptions: function () {
            $.Widget.prototype._setOptions.apply(this, arguments);

            this._refresh();
        },
        _setOption: function (key, value) {
            //if(key == "
            if (key == "addMessage") {
                this.showMsg(value);
            }
            $.Widget.prototype._setOption.call(this, key, value);
        }
    });
});