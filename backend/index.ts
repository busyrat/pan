import { Prisma, prisma } from '@/prisma';
import { Hono } from 'hono'
import { TvboxClient } from './TvboxClient';
import axios from 'axios';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    urlStatus = '-1'
  }

  if (urlStatus === '1') {
    try {
      const tvbox = new TvboxClient(url)
      const settings = await tvbox.getSettings()
      if (!settings) {
        urlStatus = '-2'
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      urlStatus = '-2'
    }
  }

  try {
    await prisma.tvbox.create({
      data: {
        url,
        status: urlStatus
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