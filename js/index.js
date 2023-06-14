(function(window) {
	try{
		const MGC = $MGC({
			icon: "./img/logo.png",
			name: "Stack TV",
			info: "A simple television.\n如果你有好的直播源推荐，请向我提交。",
			z_index: 9999,
			blur: ".container",
			lang: "zh-CN",
			mini: true,
			darkmode: 2,
			maxWidth: "30rem",
			defaultClosed: true,
			hitokoto:{
				enable: true
			},
			links: [{
				"title": "我的博客",
				"url": "https://stackblog.cf/",
				"type": "primary"
			}, {
				"title": "Stack TV Usage",
				"url": "https://github.com/Uyukisan/StackTV"
			}]
		});
	}catch(e){
		console.error("MGC加载失败");
	}
	const STACKTV = $STV({
		"selector": ".container",
		"showAbout":false
	});
	let url = new URL(location.href).searchParams.get("url") || "";
	let playUrl = new URL(location.href).searchParams.get("playUrl") || "";
	url = url.trim();
	playUrl = playUrl.trim();
	if(playUrl.length > 0){
		try{
			STACKTV.loadUrl(playUrl);
			console.info("准备播放节目："+playUrl);
		}catch(err){
			console.error("请求发生错误:"+playUrl);
			console.error(err)
		}
		
		return;
	}
	STACKTV.log("正在请求远程数据...");
	fetch(`https://livetv.stackblog.cf?url=${url}`).then(res => res.json()).then(data => {
		STACKTV.log("远程数据请求成功...");
		STACKTV.loadTVList(data['data']);
		console.info("准备播放节目列表："+url);
	}).catch(err => {
		STACKTV.log("远程数据请求失败");
		console.error("请求发生错误:"+url);
		console.error(err)
	});
})(window)
