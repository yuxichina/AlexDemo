/*
 * Name: Demo Main Page
 * Author: Alex
 * Version: 0.1.1
 */


//时间轴组件
Vue.component('timeline-item', {
    props: ['timedata'],
    template: '<timeline-item-text v-if="timedata.type==\'text\'" v-bind:timedata="timedata"></timeline-item-text>'
    + '<timeline-item-link v-else-if="timedata.type==\'link\'" v-bind:timedata="timedata"></timeline-item-link>'
    + '<timeline-item-topic v-else-if="timedata.type==\'topic\'" v-bind:timedata="timedata"></timeline-item-topic>'
});
//文本组件
Vue.component('timeline-item-text', {
    props: ['timedata'],
    template: '<li  class="timeline-period">{{ timedata.text }}</li>'
});
//文章组件
Vue.component('timeline-item-topic', {
    props: ['timedata'],
    template: ' <li v-bind:class="timedata.reverse" class="timeline-item " >'
        + '<div class="timeline-dot bg-orange-500 animation-scale-up" '
        + 'data-placement="right" data-toggle="tooltip" data-trigger="hover" data-original-title="9 Days ago"></div>'
        + '<div v-bind:class="timedata.animation" class="timeline-content">'
        + '    <div class="card card-shadow">'
        + '         <div class="card-header cover">'
        + '             <div class="cover-background p-30 " style="background-image: url(/images/topicbg.jpg)">'
        + '                  <blockquote class="blockquote cover-quote white card-blockquote">'
        + '                      {{ timedata.text }}'
        + '                  </blockquote>'
        + '              </div>'
        + '          </div>'
        + '      </div>'
        + '  </div>'
        + '</li>'
});
//外链组件
Vue.component('timeline-item-link', {
    props: ['timedata'],
    template: '<li v-bind:class="timedata.reverse" class="timeline-item ">'
        +'  <div class="timeline-dot" data-placement="right" '
        +'  data-toggle="tooltip" data-trigger="hover" data-original-title="2 Days ago"></div>'
        +'  <div v-bind:class="timedata.animation" class="timeline-content">'
        +'      <div class="card card-shadow">'
        +'          <div class="card-img-top cover">'
        +'              <img class="cover-image" v-bind:src="timedata.pic" alt="..." />'
        +'          </div>'
        +'      <div class="card-block p-30">'
        +'          <h3 class="card-title">{{ timedata.title }}</h3>'
        +'          <p class="card-text">'
        +'              <small>{{ timedata.time }}</small>'
        +'          </p>'
        +'          <p> {{ timedata.text }}</p>'
        +'      </div>'
        +'      <div class="card-block">'
        +'          <a class="btn btn-primary btn-outline card-link waves-effect" v-bind:href="timedata.url" target="_blank">Demo</a>'
        +'      </div>'
        +'      </div>'
        +'  </div>'
        +'</li>'

});
//App
var demo = new Vue({
    el: '#demo',
    data: {
        title: '于汐的前端案例介绍',

        timeDatas: [
                { type: 'text', text:'2012-2014年' },
                {
                    type: 'topic',
                    animation: 'animation-slide-left',
                    text:'2012一年，我基于jQuery，自主开发了一套地图SDK-小付地图SDK，缓存图层采用PostGIS缓存。实现了基础的底图，' +
                    '矢量标记，图形标记以及基于坐标的距离量算算法。 ' +
                    '具体代码地址： /public/lib/XiaoFuMap/'
                },
                {
                    type: 'link',
                    animation: 'animation-slide-right',
                    reverse:'timeline-reverse',
                    url: 'http://www.cbm.travel/map/',
                    pic: '/images/map1.jpeg',
                    title: '长白山易通项目-jQuery',
                    text: '小付地图是基于jQuery写的一个地图类库，长白山易通项目是具体应用, 上线后，没有进行版本更新和维护。',
                    time:"2012-11"
                },
                { type: 'text',  text:'2015年' },
                {
                    type: 'topic',
                    animation: 'animation-slide-left',
                    text:'2015年，我们研发了一系列的艺术类应用，并且配套推出了宣传网站和手机版本应用，' +
                    '以及微信公众号。 主要使用技术为jQuery和bootstrap。后端逐渐开始全面使用Nodejs搭建，下面的Demo' +
                    '后台和服务全部采用Nodejs开发。'
                },

                {
                    type: 'link',
                    title:'公司首页-bootstrap',
                    animation: 'animation-slide-right',
                    reverse:'timeline-reverse' ,
                    url: 'http://www.shangapp.com.cn/',
                    pic: '/images/site1.png',
                    text: '公司宣传页，采用Bootstrap框架搭建，采用Webfolw模板改造。'
                },
                {
                    type: 'link',
                    title:'上艺应用宣传页面-bootstrap',
                    animation: 'animation-slide-left',
                    url: 'http://www.shangapp.com.cn/',
                    pic: '/images/site2.png',
                    text: '手机app配套宣传界面，采用Bootstrap框架搭建，采用Webfolw模板改造。'
                },

                {
                    type: 'link',
                    title:'上艺美术-手机H5版本（简版）-jQueryMobile',
                    animation: 'animation-slide-right',
                    reverse:'timeline-reverse' ,
                    url: 'http://www.shangart.com.cn/',
                    pic: '/images/site3.png',
                    text: '一款技术jQueryMobile开发的手机版艺术应用（简版）'
                },

                { type: 'text', text:'2016年-至今' },
                {
                    type: 'topic',
                    animation: 'animation-slide-left',
                    text:'随着新技术的进步和更多项目的时间，' +
                    '这段时间也尝试了更多新的技术，比如React, AngularJS, Vue等，并且逐步学习了nwjs和react-native' +
                    '将自己的代码能力延伸到桌面App和手机App中。'
                },
                {
                    type: 'link',
                    title:'投票程序-AngularJS',
                    animation: 'animation-slide-right',
                    reverse:'timeline-reverse' ,
                    url: 'http://vote.shangapp.cn/#/home',
                    pic: '/images/site4.jpeg',
                    text: '这个小程序是一个简单项目，主要实现投票和记票功能，并根据规则计算结果。也是angularJS的一个学习练手项目，开发周期1周。 账号/密码：13426218677/123456'
                },
                {
                    type: 'link',
                    title:'Mine-Bootstrap',
                    animation: 'animation-slide-left',
                    url: 'http://mine.yuxichina.xyz/',
                    pic: '/images/site5.png',
                    text: '这个是开发的一个APP的宣传网站，直接采用Bootstrap搭建。后端Nodejs。'
                },
                {
                    type: 'link',
                    title:'企业钱包-React',
                    animation: 'animation-slide-right',
                    reverse:'timeline-reverse' ,
                    url: 'http://115.28.110.211:3001/P',
                    pic: '/images/site6.png',
                    text: '企业钱包项目，是我们目前持续维护项目，使用技术React。 账号/密码：17080132690/123456'
                },
                {
                    type: 'link',
                    title:'矢量地图动画-jQuery',
                    animation: 'animation-slide-left',
                    url: '/trackMap.html',
                    pic: '/images/site7.png',
                    text: '这个小功能，是为了企业钱包项目产品溯源功能使用开发的，实现了一个简单的动画效果。 附带源码。'
                },
                {
                    type: 'topic',
                    animation: 'animation-slide-right',
                    reverse:'timeline-reverse' ,
                    text:'以上是一些作品和工作的简单介绍和罗列，其中大部分为测试版本和演示版本。 PS: 本Demo使用Vue编写。'
                },

        ]


    }
});