import React from 'react';
import useSWR from 'swr';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function App() {
  const { data: result, error } = useSWR(
    '/api/v0/chart?start_date=2021-06-01&end_date=2021-12-31',
    (req) => {
      return fetch(req).then(async (res) => {
        const fetchJson = await res.json();
        return fetchJson;
      });
    },
  );

  if (!error && !result) {
    return <></>;
  }

  return (
    <AreaChart
      width={500}
      height={400}
      data={result.data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      {
        result.meta.keys.map((key) => (
          <Area
            key={key.reference}
            type="monotone"
            dataKey={key.reference}
            stackId="1"
            stroke={key.colour}
            fill={key.colour}
          />
        ))
      }
    </AreaChart>
  );
}
