'use client'
import React, { useState } from 'react'
import { Input, Button, message } from 'antd';

const { TextArea } = Input;

export default function Add() {
  const [text, setText] = useState('')
  
  const postItem = async (item: string) => {
    const res = await fetch('/api/tvbox/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: item,
      }),
    })
    if (!res.ok) {
      message.error('超时，请重试')
      return
    }
    const data = await res.json()
    if (!data.status) {
      message.error(data.message)
    } else {
      message.success(data.message)
    }
    return data
  }

  const start = async () => {
    const list = text.split('\n')
    while (list.length > 0) {
      const item = list.pop()
      await postItem(item!)
 
      setText(list.join('\n'))
    }
  }

  return (
    <div className='bg-sky-100 h-full'>
      <TextArea
        rows={20}
        allowClear
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={() => start()}>导入</Button>
    </div>
  )
}
