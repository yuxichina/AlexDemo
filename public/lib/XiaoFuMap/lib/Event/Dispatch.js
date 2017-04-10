//名称：Dispatch
//作者：GIS-Client Team YC
//说明：Dispatch
//更新
//2012-8-3
(function ($, xf) {
    xf.Dispatch = function () {
        this.type = "XiaoFu.Dispatch";
        //监听Hashtable
        this._listeners = new Array();
        var _dispatch = this;
        //添加监听
        this.addEventListener = function (eventType, eventFun, eventId) {
            if (xf.Utils.isString(eventType) && eventType.length > 0 && xf.Utils.isFunction(eventFun)) {
                if (!eventId || (xf.Utils.isString(eventId) && eventId == "")) {
                    eventId = xf.Utils.random();
                }
                if (!_dispatch._listeners[eventType]) { _dispatch._listeners[eventType] = {}; }
                eventFun.eventId = eventId;
                _dispatch._listeners[eventType][eventId] = eventFun;
            }
        };
        //删除监听
        this.removeEventListener = function (eventType, eventFun) {
            if (xf.Utils.isFunction(eventFun)) {
                eventFun = eventFun.eventId;
            }
            if (_dispatch._listeners[eventType] && _dispatch._listeners[eventType][eventFun]) {
                delete _dispatch._listeners[eventType][eventFun];
            }
        };
        //触发监听
        this.dispatchEvent = function (eventType, data) {
            if (xf.Utils.isString(eventType)) {
                var ls = _dispatch._listeners[eventType];
                if (typeof ls == "object") {
                    for (var l in ls) {
                        ls[l].apply(this, arguments)
                    }
                }
            }
        };
    };
})(jQuery, XiaoFu);