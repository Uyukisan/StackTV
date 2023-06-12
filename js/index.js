(function(window) {
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
			"title": "我的GitHub",
			"url": "http://github.com/Uyukisan"
		}]
	});
	const STACKTV = $STV({
		"selector": ".container",
		"hls": false,
		"default_logo": "./img/logo.png"
	});
	let url = new URL(location.href).searchParams.get("url") || "";
	fetch(`https://livetv.stackblog.cf?url=${url}`).then(res => res.json()).then(data => {
		STACKTV.loadTVList(data['data']);
	}).catch(err => {
		console.error(err);
		alert("请求发生错误！");
	});
})(window)
