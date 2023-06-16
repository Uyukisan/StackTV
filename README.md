# Stack TV

>  A simple online television.在线解析和观看m3u直播源列表，也可以播放m3u8等格式的在线视频，简单易用，功能不断完善。

## Usage

### 直接使用

| 参数名  | 参数类型 | 默认值 | 参数说明                      |
| ------- | -------- | ------ | ----------------------------- |
| url     | string   | 空     | 直播源列表文件的链接(m3u格式) |
| playUrl | string   | 空     | 在线视频的链接(m3u8、mp4等)   |


```html
//1、使用默认的直播源列表
https://tv.stackblog.cf
//2、使用自定义直播源列表
https://tv.stackblog.cf/?url=https://iptv-org.github.io/iptv/index.m3u
//3、直接播放在线视频
https://tv.stackblog.cf/?playUrl=http://dbiptv.sn.chinamobile.com/PLTV/88888888/224/3221226011/1.m3u8
```

注: 如果两个参数同时设置，只有playUrl有效

### 创建自己的StackTV

| 参数名        | 参数类型 | 默认值 | 参数说明                                                     |
| ------------- | -------- | ------ | ------------------------------------------------------------ |
| selector      | string   | body   | Stack TV的选择器，需要设置宽高                                  |
| autoPlay      | boolean  | true   | 自动播放                                                     |
| autoPlayFirst | boolean  | true   | 自动播放节目列表的第一个节目（视频）                         |
| default_url   | string   | -      | 默认的播放链接                                               |
| default_logo  | string   | -      | 默认的节目（视频）封面                                       |
| fetchTimeOut  | int      | 30000  | 请求远程节目列表文件超时，单位ms（毫秒）                     |
| lazyLoadSize  | int      | 100    | 节目（视频）列表懒加载（防止远程节目列表过大导致页面渲染卡死） |
| maxLog        | int      | 6      | 视频log的最大显示数目                                        |
| showLog       | boolean  | true   | 显示视频log                                                  |
| showAbout     | boolean  | true   | 显示StackTV介绍                                              |
| -             |          |        |                                                              |

```html
<link rel="stylesheet" href="./css/stacktv.css">
<style>
  .container {
    width: 100%;
    height: calc(100vh - 6rem);
  }
</style>
```

```javascript
// $ASTV === AwesomeStackTV
const STACKTV = $ASTV({
	selector: ".container",
  autoPlay: true,
  autoPlayFirst: true,
  default_url: "https://vmcdn.stackblog.ml/video/simplestacktv_1.m3u8",
  default_logo: "https://tv.stackblog.cf/img/logo.png",
  fetchTimeOut: 30000,
	showAbout: false,
	lazyLoadSize: 20,
  maxLog: 4,
	showLog: true,
	showAbout: false
});
//使用1:解析和播放远程直播源列表文件
STACKTV.fetchM3U("https://iptv-org.github.io/iptv/index.m3u");
//使用2:直接播放视频链接
STACKTV.loadUrl("https://vmcdn.stackblog.ml/video/simplestacktv_1.m3u8");
```

```html
<script src="js/hls.min.js"></script>
//hls.min.js是为了防止部分浏览器无法播放m3u8
<script src="js/stacktv.js"></script>
```



## Preview

- [Stack TV1](https://tv.stackblog.cf)
- [Stack TV2](https://stackblog.cf/tv/)

## Thanks

使用到的测试源:
- [iptv-org](https://github.com/iptv-org/iptv)
- [fanmingming](https://github.com/fanmingming/live)