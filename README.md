# Stack TV

>  A simple online television.在线解析和观看m3u直播源列表，也可以播放m3u8等格式的在线视频

## Usage

```html
//1、使用默认的直播源列表
https://tv.stackblog.cf
//2、使用自定义直播源列表
https://tv.stackblog.cf/?url=https://iptv-org.github.io/iptv/index.m3u
//3、直接播放在线视频
https://tv.stackblog.cf/?playUrl=http://dbiptv.sn.chinamobile.com/PLTV/88888888/224/3221226011/1.m3u8
```

| 参数名  | 参数类型 | 默认值 | 参数说明                      |
| ------- | -------- | ------ | ----------------------------- |
| url     | string   | 空     | 直播源列表文件的链接(m3u格式) |
| playUrl | string   | 空     | 在线视频的链接(m3u8、mp4等)   |

注: 如果两个参数同时设置，只有playUrl有效

## Preview

- [Stack TV1](https://tv.stackblog.cf)
- [Stack TV2](https://stackblog.cf/tv/)

## Thanks

使用到的测试源:
- [iptv-org](https://github.com/iptv-org/iptv)
- [fanmingming](https://github.com/fanmingming/live)