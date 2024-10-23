// @ts-nocheck

import axios from "axios";
import { BaseClient } from "./BaseClient";

const defaultBaseURL =
'115.213.66.146'
// '113.87.173.117' // pan115 bili ali
// 'tv.yiliang.love'
  // '192.168.31.112'
  // '118.212.70.14'
  // '27.199.102.68' // 深蓝的云
  // '114.231.246.27' // 错误
  // '47.99.213.151'
  // '183.6.28.133' // 版本老了 getSecret 数据少

export class TvboxClient extends BaseClient {
  constructor(baseURL = defaultBaseURL) {
    super();
    if (!baseURL.includes('http')) {
      baseURL = `http://${baseURL}:4567`
    }
    this.baseURL = baseURL
    this.axiosInstance.defaults.baseURL = this.baseURL
  }

  // cookie 鉴权不写
  async handleUnauthorized() {
    const token = await this.login()
    return token
  }

  help() {
    return 'getMember | getSize | getSecret | getAliAccounts | getStorages | deleteShare | postNav | postShare'
  }

  async login() {
    try {
      const response = await axios({
        url: `${this.baseURL}/api/accounts/login`,
        method: "post",
        data: {
          username: "admin",
          password: "admin",
          rememberMe: true,
          authenticated: false,
        },
      })
      return response.data.token;
    } catch (error) {
    }
  }

  async getAliAccounts() {
    const response = await this.request({
      url: "/api/ali/accounts",
      method: "get",
    })
    return response
  }

  async getStorages() {
    const response = await this.request({
      url: "/api/storages",
      method: "get",
    })
    return response
  }

  async deleteShare(id) {
    const response = await this.request({
      url: `/shares/${id}`,
      method: "delete",
    })
    return response
  }

  async postNav(data) {
    const response = await this.request({
      url: "/api/nav",
      method: "post",
      data: {
        id: 0,
        name: "2",
        value: "2",
        type: 4,
        show: true,
        reserved: false,
        changed: false,
        expanded: false,
        order: 1,
        parentId: 160,
        children: [],
      },
    });
    return response
  }

  async getPanAccounts() {
    const response = await this.request({
      url: '/api/pan/accounts',
      method: 'get'
    })
    return response
  }

  async getPikpakAccounts() {
    const response = await this.request({
      url: '/api/pikpak/accounts',
      method: 'get'
    })
    return response
  }

  async getSettings() {
    const response = await this.request({
      url: '/api/settings',
      method: 'get'
    })
    return response
  }

  async getSecret() {
    const panTypes = [
      'ali/token',
      'ali/open',
      'quark/cookie',
      'uc/cookie',
      'pan115/cookie',
      // document.cookie ="SESSDATA=xxxx;domain=.bilibili.com;path=/";
      'bili/cookie',
    ]

    const response = {}
    const { ali_secret, alist_username, alist_password } = await this.getSettings() || {}
    if (!ali_secret) return {}

    for (let i = 0; i < panTypes.length; i++) {
      const panType = panTypes[i];
      const secret = await this.request({
        url: `/${panType}/${ali_secret}`,
        method: 'get'
      })
      if (secret) {
        response[panType] = secret
      }
    }
    if (alist_username || alist_password) {
      response['alist/accounts'] = `${alist_username || '-'} ${alist_password || '-'}`
    }
    return response
  }

  /**
   *
   * @returns {
   *   vip: {
   *     type  // 1 大会员, 2 年度大会员
   *     role
   *     status
   *     due_date // 会员到期时间
   *     tv_due_date  // TV到期时间 时间戳+000
   *     tv_vip_pay_type // TV支付类型 1
   *     tv_vip_status // 1 开启 0 未开启
   *   }
   *   vipType // 1 大会员, 2 年度大会员
   * }
   */
  async getBilibili() {
    const response = await this.request({
      url: "/api/bilibili/status",
      method: "get",
    })

    if (!response || !response.isLogin) return {};
    let message = ["普通", "大会员", "年度大会员"][response.vipType];
    if (response.vipType > 0) {
      message += `(${this._formatTime(response.vip.due_date)})`;
    }

    if (response.vip.tv_vip_status) {
      message += `<br/>TV(${this._formatTime(response.vip.tv_due_date)})`;
    }
    response.message = message;
    return response;
  }

  async getBilibiliCookie() {
    const response = await this.request({
      url: '/api/settings/bilibili_cookie',
      method: 'get'
    })
    return response
  }

  async getShares () {
    const response = await this.request({
      url: "/api/shares?page=0&size=20",
      method: "get",
    })
    return response
  }

  async getPan() {
    const panType = {
      2: "quark",
      3: "pan115",
      6: "uc",
    };
    const shares = await this.getShares()
    if (!shares || typeof shares !== 'object') return []
    const pan = shares.content
      .filter((item) => Object.keys(panType).includes(`${item.type}`))
      .map((item) => ({
        ...item,
        type: panType[item.type],
      }));

    return pan
  }

  async getAllPan () {
    const p1 = await this.getPan()
    const p2 = await this.getPanAccounts()
    const p3 = await this.getBilibiliCookie()
    const bili = await this.getBilibili()
    const p4 = await this.getAliAccounts()
    const p5 = await this.getPikpakAccounts()

    let all = []
    if (p1) all = all.concat(p1)
    if (p2) all = all.concat(p2.map(i => ({ ...i, type: i.type.toLowerCase() })))
    if (p3) all = all.concat({...p3, type: 'bili', cookie: p3.value, message: bili.message || ''})
    if (p4) all = all.concat(p4.map(i => ({ ...i, type: 'ali' })))
    if (p5) all = all.concat(p5.map(i => ({ ...i, type: 'pikpak' })))

    return all
  }
}