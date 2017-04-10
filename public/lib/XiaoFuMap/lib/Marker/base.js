﻿function JumpObj(elem, range, startFunc, endFunc) {
    //图片鼠标移上去的动画效果，一流素材网www.16sucai.com
    var curMax = range = range || 6;
    startFunc = startFunc || function () { };
    endFunc = endFunc || function () { };
    var drct = 0;
    var step = 1;

    var m_t = parseInt(elem.style.top);

    init();

    function init() {
        //elem.style.position = 'relative';
        active();
    }
    function active() {
        elem.onmouseover = function (e) {
            if (!drct) {
                jump();
            }
        } 
    }
    function deactive() {
        elem.onmouseover = null 
    }

    function jump() {
        var t = parseInt(elem.style.top);
        if (!drct) {
            motionStart();
        }
        else {
            var nextTop = t - step * drct;
            if (nextTop >= m_t - curMax && nextTop <= m_t) {
                elem.style.top = nextTop + 'px';
            }
            else if (nextTop < m_t - curMax) {
                drct = -1;
            }
            else {
                var nextMax = curMax / 2;
                if (nextMax < 1) {
                    motionOver(); 
                    return;
                }
                curMax = nextMax;
                drct = 1;
            }
        }
        setTimeout(function () {
            jump();
        }, 200 / (curMax + 3) + drct * 3);
    }
    function motionStart() {
        startFunc.apply(this);
        elem.style.top = m_t;
        drct = 1;
    }
    function motionOver() {
        endFunc.apply(this);
        curMax = range;
        drct = 0;
        elem.style.top = m_t;
    }

    this.jump = jump;
    this.active = active;
    this.deactive = deactive;
}