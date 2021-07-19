import React from 'react';
import useSWR from 'swr';
import format from 'date-fns/format';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function Chart(props) {
  const {
    width,
    height,
    startDate = new Date('2021-06-14'),
    endDate = new Date('2021-12-14'),
    aggregatePaymentType = 'true',
  } = props;

  const fmt = (date) => {
    return format(date, 'yyyy-MM-dd');
  };

  const { data: result, error } = useSWR(
    `/api/v0/chart?start_date=${fmt(startDate)}&end_date=${fmt(endDate)}&aggregate_payment_type=${aggregatePaymentType}`,
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
      width={width}
      height={height}
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
      <Legend verticalAlign="top" height={36}/>
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
