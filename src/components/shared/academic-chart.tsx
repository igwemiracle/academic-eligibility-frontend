"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AcademicChartProps {
  data: {
    level: number;
    unitsCarried: number;
    unitsEarned: number;
    gpa: number;
  }[];
}

export function AcademicChart({ data }: AcademicChartProps) {
  const chartData = data.map((item) => ({
    name: `${item.level} Level`,
    "Units Earned": item.unitsEarned,
    "Units Carried": item.unitsCarried,
    "GPA (x10)": Number((item.gpa * 10).toFixed(1)),
    gpaActual: item.gpa.toFixed(2),
  }));

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Academic Progression</CardTitle>
          <CardDescription>Credit units and GPA progression across levels</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          No semester results registered yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">
              Progression Across Study Levels
            </CardTitle>
            <CardDescription className="text-xs">
              Credit units earned and grade point average (GPA) by academic level
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const current = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-popover p-3 shadow-md text-xs space-y-1">
                        <p className="font-semibold text-foreground">{label}</p>
                        <div className="flex justify-between gap-4 text-muted-foreground">
                          <span>Units Earned:</span>
                          <span className="font-medium text-foreground">{current["Units Earned"]}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-muted-foreground">
                          <span>Units Carried:</span>
                          <span className="font-medium text-foreground">{current["Units Carried"]}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-muted-foreground">
                          <span>Level GPA:</span>
                          <span className="font-semibold text-primary">{current.gpaActual} / 5.00</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: "10px", fontSize: "12px" }}
              />
              <Bar
                dataKey="Units Earned"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="Units Carried"
                fill="hsl(var(--muted-foreground) / 0.3)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
