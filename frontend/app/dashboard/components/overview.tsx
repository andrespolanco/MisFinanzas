"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
  transactionByMonth: { name: string; total: number }[];
}

export function Overview({ transactionByMonth }: OverviewProps) {
  console.log("Datos para el gráfico en Overview:", transactionByMonth);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={transactionByMonth}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `S/. ${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}