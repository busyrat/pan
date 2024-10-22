import { Prisma, prisma } from '@/prisma';
import { Hono } from 'hono'
import { TvboxClient } from './TvboxClient';

export const app = new Hono().basePath('/api')

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

  let urlValid = false
  try {
    const r = await fetch(url)    
    urlValid = r.status === 200
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {}
  
  if (!urlValid) {
    return c.json({
      status: false,
      message: 'url is invalid',
    })
  }

  let urlStatus = false
  try {
    const tvbox = new TvboxClient(url)
    const settings = await tvbox.getSettings()
    urlStatus = !!settings
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    
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
      return c.json({
        status: false,
        code: e.code
      })
    }
  }
  
  return c.json({
    status: true,
    message: 'ok',
  })
})