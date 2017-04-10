/*
* Name: Track Vertor Map
* Author: Alex
 * Version: 0.1.1
 */
(function($, undefined) {
    var debug = true;

    var trackMap = window['trackMap'] = {};
    //点 配置
    trackMap.point = {
        width: 10
    }
    //圆形 配置
    trackMap.circle = {
        width: 26
    }
    //线 配置
    trackMap.line = {
        width: 10
    }
    //初始化
    trackMap.init = function(option) {
        option = option || {
                type: 0
            };
        trackMap.type = option.type; //0:订单流转 1：产品销售
        trackMap.container = $('#trackMapContainer');
        trackMap.width = 800;
        trackMap.height = 300;

        trackMap.mapWidth = 1061;
        trackMap.mapHeight = 523;
        //
        trackMap.listUl = $('#trackMapList');
        trackMap.listDuration = 2000;
        trackMap.listStopDuration = 1000;
        //
        var width = trackMap.width = $('.trackMapFrame').width();
        var height = trackMap.height = $('.trackMapFrame').height();
        trackMap.panTo(0, trackMap.mapWidth / 2, trackMap.mapHeight / 2);
        //                trackMap.width = $(window).width();
        //                trackMap.container.css('width',trackMap.width);
    }

    //页面Resize触发
    $(window).resize(function() {
        debug && console.log('a');
        var width = trackMap.width = $('.trackMapFrame').width();
        var height = trackMap.height = $('.trackMapFrame').height();
    })

    //增加矢量点
    trackMap.addPoint = function(color, x, y) {
        //x = x - trackMap.point.width/2;
        //y = y - trackMap.point.width/2;
        color = color || 'red'
        var p = $('<div style="position: absolute; "></div>');
        p.css('left', x - trackMap.point.width / 2);
        p.css('top', y - trackMap.point.width / 2);
        p.css('background-color', color);

        p.addClass('point')
            .appendTo(trackMap.container);

        var c = $('<div style="position: absolute; "></div>');
        c.css('left', x - (trackMap.circle.width) / 2);
        c.css('top', y - (trackMap.circle.width) / 2);
        c.css('border-color', color);
        c.addClass('circle')
            .appendTo(trackMap.container);
    }
    //增加矢量路径
    trackMap.addPath = function(color, x, y, x2, y2, endCB, removeCB) {
        endCB = endCB ||
            function() {};
        removeCB = removeCB ||
            function() {};
        //                x = x + (trackMap.point.width - trackMap.line.width)  / 2
        //                x2 = x2 + (trackMap.point.width - trackMap.line.width)  / 2
        //                y = y + (trackMap.point.width - trackMap.line.width)  / 2
        //                y2 = y2 + (trackMap.point.width - trackMap.line.width)  / 2
        //
        var duration = 3000; //间隔
        var xW = x2 - x;
        var yW = y2 - y;
        debug && console.log(xW);
        debug && console.log(yW)

        var width = Math.sqrt(Math.pow(xW, 2) + Math.pow(yW, 2));
        debug && console.log(width);

        var c = $('<div style="position: absolute; "></div>');

        c.css('width', 6);
        var degree = Math.atan2(yW, xW);
        // degree = 30 * (2*Math.PI)  / 360;
        debug && console.log('degree is %d ',degree);

        // var degree = Math.atan2( yW, xW) * 360;
        // degree = 45;
        // c.css('left', x    )
        //c.css('top', y  -  (yW/Math.abs(yW)) *  Math.sin(degree) *  trackMap.line.width / 2   )
        c.css('left', x - 2);
        c.css('top', y - 5);
        //                c.css('left', x + Math.cos(degree) *  trackMap.line.width / 2  )
        //                c.css('top', y  - Math.sin(degree) *  trackMap.line.width / 2   )
        //                c.css('left', x - Math.cos(degree) * width      )
        //                c.css('top', y +  Math.sin(degree) * width /2   )
        //                c.css('top', y + Math.cos(degree) * width /2   )
        //                c.css('left', x + Math.sin(degree) * width /2   )
        //                c.css('top', y - Math.cos(degree) * width /2 )
        //                c.css('left', x + (trackMap.point.width - trackMap.line.width)  / 2   )
        //                c.css('top', y + (trackMap.point.width - trackMap.line.width) / 2    )
        //                debug && console.log(degree);
        degree = (360 * degree) / (2 * Math.PI);
        debug && console.log('transform degree is %d ',degree);
        c.css('transform', '   rotate(' + degree + 'deg)')
            .css('-ms-transform', '  rotate(' + degree + 'deg)')
            .css('-webkit-transform', '  rotate(' + degree + 'deg)')
            .css('-o-transform', '  rotate(' + degree + 'deg)')
            .css('-moz-transform', '  rotate(' + degree + 'deg)')
            .css('background-color', color)
            .addClass('line')
            .appendTo(trackMap.container);
        c.css('disploy', 'none');
        if (trackMap.type == 0) {
            c.css('disploy', 'block');
            c.animate({
                    width: width
                },
                duration,
                function() {
                    endCB();
                    c.animate({
                            opacity: 0
                        },
                        duration / 4,
                        function() {
                            c.remove();
                            removeCB();
                        })
                })
        }
    }
    //输入列表数据
    trackMap.list = function(data) {
        var item = data && data.shift();
        if (item) {
            trackMap.addItem(item,
                function(preItem) {
                    if (data && data.length > 0) {
                        var _item = data[0];
                        trackMap.panTo(trackMap.listDuration, _item.x, _item.y);
                        trackMap.addPath(item.color, preItem.x, preItem.y, _item.x, _item.y,
                            function() {
                                //                    trackMap.addPoint('blue', 500, 100);
                            });
                    }

                },
                function(preItem) {
                    trackMap.list(data);
                });
        }
    }
    //增加单点数据
    trackMap.addItem = function(item, addCB, endCB) {
        addCB = addCB ||
            function() {

            }
        endCB = endCB ||
            function() {

            }
        var li = $('<li class="list-group-item product-item"></li>');
        li.css('background-color', item.color  || 'white')
            .css('color', item.fontColor || 'white')
            .html('<div class="product-item-container"> </div>');
        var content = $('<span class=" product-content pull-right"></span>');
        content.text(item.text);
        var img = $('<img class=" product-img" src="' + item.url + '" />');
        if (trackMap.type == 1) {
            img = $('<img class="avator" src="' + item.url + '" />');
            var str = "<p><span class='name'>" + item.name + "</span><span class='time'>" + item.time + "</span>" + "</p>";
            str += "<p><span class='ml20'> 购买：</span>";
            for (var i = 0; i < item.products.length; i++) {
                var product = item.products[i];
                str += "<span class='productName'>" + product.name + "</span>";
                str += "×";
                str += "<span class='productCount'>" + product.count + "</span>";
                str += "<span class='ml20'></span>"
            }
            str += "</p>";
            var content = $(str);
        }
        img.appendTo(li.find('.product-item-container'));
        content.appendTo(li.find('.product-item-container'));
        li.hide();
        trackMap.listUl.prepend(li);
        trackMap.addPoint(item.color, item.x, item.y);
        addCB(item);
        $(li).slideDown(trackMap.listDuration,
            function() {
                setTimeout(endCB, trackMap.listStopDuration)
            })
    }
    trackMap.panTo = function(duration, x, y) {
        var offsetX = trackMap.width / 2 - x;
        var offsetY = trackMap.height / 2 - y;
        debug && console.log(offsetX);
        debug && console.log(offsetY);
        //$('#trackMapContainer').css('top', offsetY).css('left', offsetX)
        $('#trackMapContainer').animate({
                top: offsetY + 'px',
                left: offsetX + 'px'
            },
            duration);
    }
    trackMap.init();

})(window.jQuery);