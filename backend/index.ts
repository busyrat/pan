import { Prisma, prisma } from '@/prisma';
import { Hono } from 'hono'
import { TvboxClient } from './TvboxClient';
import axios from 'axios';
import { Ali } from '@prisma/client';


export const app = new Hono().basePath('/api')

const request = axios.create({
  timeout: 2000,
})

app.get('/tvbox/list', async (c) => {
  const all = await prisma.tvbox.findMany()
  return c.json({
    message: all,
  })
})


app.post('/tvbox/add', async (c) => {
  const { url } = await c.req.json()

  if (!url) {
    return c.json({
      status: false,
      message: 'url is required'
    })
  }

  let urlStatus = '1'
  try {
    const r = await request(url)
    if (r.status !== 200) {
      urlStatus = '-1'
    }
  } catch (error) {
    console.log(error);
    urlStatus = '-1'
  }

  let setting
  if (urlStatus === '1') {
    try {
      const tvbox = new TvboxClient(url)
      setting = await tvbox.getSettings()
      if (!setting) {
        urlStatus = '-2'
      }
    } catch (error) {
      console.log(error);
      urlStatus = '-2'
    }
  }

  try {
    await prisma.tvbox.create({
      data: {
        url,
        status: urlStatus,
        setting: {
          create: setting
        }
      }
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return c.json({
          status: false,
          message: '地址已存在'
        })
      }
      return c.json({
        status: false,
        code: e.code,
        message: e.message
      })
    }
  }
  
  return c.json({
    status: true,
    message: {
      '1': '添加成功',
      '-1': '地址无效',
      '-2': '密码不为默认',
    }[urlStatus],
  })
})

app.post('/tvbox/add/ali', async (c) => {
  const { url } = await c.req.json()
  const tvbox = new TvboxClient(url)

  const accounts = await tvbox.getAliAccounts()
  
  if (!accounts) {
    return c.json({
      status: false,
      message: '获取失败'
    })
  }

  try {    
    await prisma.ali.createMany({
      data: accounts.map((row: Ali) => {
        const { nickname, refreshToken, refreshTokenTime, openToken, openTokenTime, openAccessToken, openAccessTokenTime } = row
        return { url, nickname, refreshToken, refreshTokenTime, openToken, openTokenTime, openAccessToken, openAccessTokenTime }
      })
    })
  } catch (error) {
    console.log(error, accounts);
    return c.json({
      status: false,
      message: '保存失败'
    })
  }

  return c.json(accounts)
})

app.get('/tvbox', async (c) => {
  const { url } = c.req.query()

  const data = await prisma.tvbox.findUnique({
    where: {
      url
    },
    include: {
      alis: true
    }
  })

  return c.json(data)
})
