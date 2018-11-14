# whistle.show-frames
用来在whistle中显示TCP/Socket请求的数据包，该插件不做中转服务，只是把接收到的数据展示到whistle的Network界面的Frames面板里面。

# 安装
```
npm i -g whistle whistle.show-frames
```

# 使用
如果是Node应用可以借助[socketx](https://github.com/avwo/socketx)(与whistle建立tunnel代理)、[simpleproto](https://github.com/avwo/simpleproto)(简单的长连接传输协议，whistle.show-frames是按照这个协议接收请求)实现：
```
// 与whistle建立长连接
const { connect } = require('socketx');
const { encode } = require('simpleproto');

(async () => {
	const proxy = {
		host: '127.0.0.1', // whistle所在机器IP，根据实际情况填写
		port: 8899, // whistle默认端口，根据实际情况填写
		headers: {
			'x-whistle-show-frames': 1, // 必填，插件会根据此代理请求头转到服务
		}
	};
	const client = await connect({
		host: 'www.test.com', // 显示在whistle请求列表的标识，任意Latin字母字符串都可以
		port: 1234, // 显示在whistle请求列表的标识，任意数字都可以
		proxy,
	});
	// 断开要重连
	client.on('close', () => {});
	client.on('error', (e) => console.error(e));
	let index = 0;
	setInterval(() => {
		++index;
    // req和res自动都是可选，分别会在Frames里面展示发送和接收状态的数据，空则不显示
		const data = `{"req": "${index}. request data", "res": "${index}. response data"}`;
		console.log('send data length:', data.length);
		client.write(encode(data));
	}, 3000);
})();
```
![show-frames](https://user-images.githubusercontent.com/11450939/48461442-b6de2c80-e80e-11e8-8412-3ad71b22f3cc.gif)

# 应用
可以作为展示长连接数据包的服务，这个行为是异步进行的，不影响正常的收发请求。
![架构图](https://user-images.githubusercontent.com/11450939/48462022-64523f80-e811-11e8-9464-ea9288ceb290.png)
