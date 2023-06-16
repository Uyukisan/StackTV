(function (window) {
	try {
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
			hitokoto: {
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
	} catch (e) {
		console.error("MGC加载失败");
	}
	const STACKTV = $ASTV({
		selector: ".container",
		showAbout: false,
		lazyLoadSize: 20,
		autoPlay: true,
		// showLog: false
	});
	let url = new URL(location.href).searchParams.get("url") || "https://iptv-org.github.io/iptv/index.m3u";
	let playUrl = new URL(location.href).searchParams.get("playUrl") || "";
	url = url.trim();
	playUrl = playUrl.trim();
	if (playUrl.length > 0) {
		try {
			STACKTV.loadUrl(playUrl);
			console.info("准备播放节目：" + playUrl);
		} catch (err) {
			console.error("请求发生错误:" + playUrl);
			console.error(err)
		}

		return;
	}
	STACKTV.fetchM3U(url);
})(window)
