var mqtt = require('../../utils/xmqtt')
//连接的服务器域名，注意格式！！！ 
const host = 'alis://www.xuhonys.cn:443/mqtt';

Page({
  data: {
    client: null,
    //记录重连的次数
    reconnectCounts: 0,
    //MQTT连接的配置
    options: {
      protocolVersion: 4, //MQTT连接协议版本
      clientId: 'alis Mini',
      myAli: null,
      clean: true,
      password: 'xuhong123',
      username: 'admin',
      reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
    } 
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onReady() {
    // 页面加载完成
  },
  btnConnect() {
    var that = this;

    //开始连接
    this.data.client = mqtt.connect(host, this.data.options);
    this.data.client.on('connect', function (connack) {
      my.showToast({ content: "连接成功", type: 'success' })
    })

    //服务器下发消息的回调
    that.data.client.on("message", function (topic, payload) {
      console.log(" 收到 topic:" + topic + " , payload :" + payload)
      my.showToast({ content: " 收到topic:[" + topic + "], payload :[" + payload + "]", type: 'success' })
    })
 
    //服务器连接异常的回调
    that.data.client.on("error", function (error) {
      console.log(" 服务器 error 的回调" + error)
      my.showToast({ content: "连接服务器失败，错误信息：" + error, type: 'exception', })
    })

    //服务器重连连接异常的回调，一般是域名或者服务器不存在
    that.data.client.on("reconnect", function () {
      console.log(" 服务器 reconnect的回调")
      my.showToast({ content: "连接服务器失败，正在重连...", type: 'exception', })
    })

    //服务器连接异常的回调
    that.data.client.on("offline", function (err) {
      console.log(" 服务器offline的回调"+JSON.stringify(err))
    })
  }, btnSubOne() {
    if (this.data.client && this.data.client.connected) {
      //仅订阅单个主题
      this.data.client.subscribe('Topic0', function (err, granted) {
        if (!err) {
          my.showToast({ content: " 订阅主题成功", type: 'success', })
        } else {
          my.showToast({ content: " 订阅主题失败", type: 'exception', })
        }
      })
    } else {
      my.showToast({ content: '请先连接服务器', type: 'exception', })
    }
  }, btnSubMany() {

    if (this.data.client && this.data.client.connected) {
      //仅订阅多个主题
      this.data.client.subscribe({
        'Topic1': {
          qos: 0
        },
        'Topic2': {
          qos: 1
        }
      }, function (err, granted) {
        if (!err) {
          my.showToast({ content: " 订阅多主题成功", type: 'success', })
        } else {
          my.showToast({ content: " 订阅多主题失败", type: 'exception', })
        }
      })
    } else {
      my.showToast({ content: "订阅失败，请检查是否正常连接？", type: 'exception', })
    }
  }, btnPub() {
    if (this.data.client && this.data.client.connected) {
      this.data.client.publish('/World', 'i am  from alis msg ... ');
      my.showToast({ content: " 发布成功", type: 'success', })
    } else {
      my.showToast({ content: " 请先连接服务器", type: 'exception', })
    }
  },
  btnUnSubOne() {
    if (this.data.client && this.data.client.connected) {
      this.data.client.unsubscribe('Topic1');
    } else {
      my.showToast({ content: " 请先连接服务器", type: 'exception', })
    }
  },
  btnUnSubMany() {
    if (this.data.client && this.data.client.connected) {
      this.data.client.unsubscribe(['Topic1', 'Topic2']);
    } else {
      my.showToast({ content: " 请先连接服务器", type: 'exception', })
    }
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '支付宝小程序连接Mqtt',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
