import mjCutout from '/img/player/jordanc.png'
import kobeCutout from '/img/player/kobec.png'
import curryCutout from '/img/player/curryc.png'
import durantCutout from '/img/player/durantc.png'
import irvingCutout from '/img/player/irvingc.png'

import mj from '/img/player/jordan.jpg'
import kobe from '/img/player/kobe.jpg'
import curry from '/img/player/curry.jpg'
import durant from '/img/player/durant.jpg'
import irving from '/img/player/irving.jpg'

export const players = [
  {
    id: 'jordan',
    name: "MICHAEL JORDAN",
    alias: "AIR JORDAN",
    number: "23",
    team: "CHICAGO BULLS",
    cutoutImg: mjCutout,
    cardBg: mj,
    height: "6'6\"", weight: "216 LBS", positions: ['SG'],
    quote: "I've failed over and over and over again in my life. And that is why I succeed.",
    stats: [
      { label: 'PTS', value: 32292, avg: '30.1' },
      { label: 'REB', value: 6672, avg: '6.2' },
      { label: 'AST', value: 5633, avg: '5.3' },
      { label: 'STL', value: 2514, avg: '2.3' }
    ],
    honors: ["6届 NBA总冠军", "6次 总决赛MVP", "5次 常规赛MVP", "1988年 最佳防守球员"],
    moments: [
        { date: "1998.06.14", event: "世纪绝杀 (The Last Shot)", desc: "对阵爵士晃倒拉塞尔投中制胜球，拿下第六冠。" },
        { date: "1997.06.11", event: "流感之战", desc: "带病出战总决赛G5狂砍38分，意志力的极致体现。" },
        { date: "1988.02.06", event: "罚球线起飞", desc: "在扣篮大赛中击败威尔金斯，上演经典的罚球线扣篮。" },
        { date: "1986.04.20", event: "上帝降临", desc: "季后赛面对伯德率领的凯尔特人轰下63分。" }
    ]
  },
  {
    id: 'kobe',
    name: "KOBE BRYANT",
    alias: "BLACK MAMBA",
    number: "24",
    team: "L.A. LAKERS",
    cutoutImg: kobeCutout,
    cardBg: kobe,
    height: "6'6\"", weight: "212 LBS", positions: ['SG', 'SF'],
    quote: "Mamba Mentality is all about focusing on the process and trusting in the hard work.",
    stats: [
      { label: 'PTS', value: 33643, avg: '25.0' },
      { label: 'REB', value: 7047, avg: '5.2' },
      { label: 'AST', value: 6306, avg: '4.7' },
      { label: 'STL', value: 1944, avg: '1.4' }
    ],
    honors: ["5届 NBA总冠军", "2次 总决赛MVP", "1次 常规赛MVP", "18次 入选全明星"],
    moments: [
        { date: "2006.01.22", event: "单场81分", desc: "NBA历史上单场得分第二高的神迹。" },
        { date: "2016.04.13", event: "曼巴谢幕 (Mamba Out)", desc: "退役战狂砍60分，完美的告别演出。" },
        { date: "2010.06.17", event: "复仇绿军", desc: "抢七大战击败凯尔特人，成功卫冕总冠军。" },
        { date: "2000.06.04", event: "OK连线", desc: "西部决赛标志性空接传球给奥尼尔，逆转开拓者。" }
    ]
  },
  {
    id: 'curry',
    name: "STEPHEN CURRY",
    alias: "CHEF CURRY",
    number: "30",
    team: "GOLDEN STATE WARRIORS",
    cutoutImg: curryCutout,
    cardBg: curry,
    height: "6'2\"", weight: "185 LBS", positions: ['PG'],
    quote: "I can do all things through Christ who strengthens me.",
    stats: [
      { label: 'PTS', value: 23000, avg: '24.8' },
      { label: '3PM', value: 3700, avg: '3.9' },
      { label: 'AST', value: 6000, avg: '6.4' },
      { label: 'FT%', value: 91.0, avg: '91.0' }
    ],
    honors: ["4届 NBA总冠军", "2次 常规赛MVP", "1次 总决赛MVP", "历史三分王"],
    moments: [
        { date: "2016.02.27", event: "超远绝杀雷霆", desc: "半场超远三分绝杀，追平单赛季三分记录。" },
        { date: "2016.05.10", event: "全票MVP", desc: "成为NBA历史上首位且唯一的全票常规赛MVP。" },
        { date: "2022.06.16", event: "晚安安 (Night Night)", desc: "击败凯尔特人夺得第四冠，并荣膺首个FMVP。" },
        { date: "2021.12.14", event: "加冕三分王", desc: "超越雷·阿伦，成为NBA历史三分命中数第一人。" }
    ]
  },
  {
    id: 'durant',
    name: "KEVIN DURANT",
    alias: "SLIM REAPER",
    number: "35",
    team: "PHOENIX SUNS",
    cutoutImg: durantCutout,
    cardBg: durant,
    height: "6'11\"", weight: "240 LBS", positions: ['SF', 'PF'],
    quote: "Hard work beats talent when talent fails to work hard.",
    stats: [
      { label: 'PTS', value: 28000, avg: '27.3' },
      { label: 'REB', value: 7000, avg: '7.0' },
      { label: 'FG%', value: 50.1, avg: '50.1' },
      { label: 'FT%', value: 88.6, avg: '88.6' }
    ],
    honors: ["2届 NBA总冠军", "2次 总决赛MVP", "1次 常规赛MVP", "4次 得分王"],
    moments: [
        { date: "2017.06.07", event: "死神降临", desc: "总决赛G3迎着詹姆斯干拔三分，锁定胜局。" },
        { date: "2014.05.06", event: "真正的MVP", desc: "感人的MVP获奖感言，将荣誉献给母亲。" },
        { date: "2021.06.15", event: "天王山之战", desc: "打满48分钟，狂砍49分17篮板10助攻的大三双。" },
        { date: "2012.02.19", event: "洛克公园传说", desc: "在洛克公园狂砍66分，成为街球传说。" }
    ]
  },
  {
    id: 'irving',
    name: "KYRIE IRVING",
    alias: "UNCLE DREW",
    number: "11",
    team: "DALLAS MAVERICKS",
    cutoutImg: irvingCutout,
    cardBg: irving,
    height: "6'2\"", weight: "195 LBS", positions: ['PG', 'SG'],
    quote: "I don't believe in pressure. Pressure is created by the ego.",
    stats: [
      { label: 'PTS', value: 17000, avg: '23.6' },
      { label: 'AST', value: 4300, avg: '5.7' },
      { label: 'FG%', value: 47.5, avg: '47.5' },
      { label: '3P%', value: 39.3, avg: '39.3' }
    ],
    honors: ["1届 NBA总冠军", "8次 入选全明星", "最佳新秀", "三分大赛冠军"],
    moments: [
        { date: "2016.06.19", event: "抢七绝杀", desc: "总决赛G7面对库里投中价值连城的制胜三分。" },
        { date: "2015.01.28", event: "单场55分", desc: "对阵开拓者轰下55分，其中包括创纪录的11记三分。" },
        { date: "2024.03.17", event: "左手神仙球", desc: "面对约基奇防守，左手超远勾手压哨绝杀。" },
        { date: "2014.02.16", event: "全明星MVP", desc: "展示华丽运球和终结能力，荣膺全明星MVP。" }
    ]
  }
]
