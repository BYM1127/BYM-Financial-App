import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  Essential: '#3b82f6', // blue
  Convenience: '#f59e0b', // amber
  Stress: '#ef4444', // red
  Social: '#10b981', // emerald
  Boredom: '#64748b', // slate
  Treat: '#a855f7' // purple
};

export default function AnalyticsPanel({ refreshTrigger }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, [refreshTrigger]);

  const fetchInsights = async () => {
    try {
      const res = await api.getInsights();
      setData(res);
    } catch (error) {
      console.error("Failed to load insights:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center text-slate-400">Loading insights...</div>;
  }

  if (!data || data.spendByMood.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Spend by Emotion</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.spendByMood}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.spendByMood.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#cbd5e1'} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${Number(value).toFixed(2)}`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
