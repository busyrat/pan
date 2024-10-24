
'use client'
import React from 'react';
import { Table, Tag } from 'antd';
import {
  useQuery,
} from '@tanstack/react-query'
import { Tvbox } from '@prisma/client';

type ListResponse = {
  message: Tvbox[]
}

export default function Home() {
  const { isPending, error, data } = useQuery<ListResponse>({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('/api/tvbox/list').then((res) => res.json()
    ),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  
  return (
    <div className="bg-sky-100 h-full">
      <Table rowKey="id"  dataSource={data.message} columns={[
        {
          width: 100,
          title: 'id',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: 'url',
          dataIndex: 'url',
          key: 'url',
          render: (_, { url }) => <a href={url} target="_blank">{url}</a>
        },
        {
          width: 300,
          title: 'status',
          dataIndex: 'status',
          key: 'status',
          sorter: (a, b) => Number(a.status) - Number(b.status),
          render: (_, { status }) => {
            return {
              '1': <Tag color='green' key={1}>有效</Tag>,
              '-1': <Tag color='volcano' key={0}>无效</Tag>,
              '-2': <Tag color='green' key={1}>密码不为默认</Tag>,
            }[status]
          }
        }
      ]} />;
    </div>
  );
}