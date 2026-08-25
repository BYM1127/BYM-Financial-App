import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Loader2, PieChart as PieChartIcon, BarChart as BarChartIcon, TrendingUp, TrendingDown } from 'lucide-react';

const COLORS = [
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // red
  '#10b981', // emerald
  '#64748b', // slate
  '#a855f7'  // purple
];

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
    return <div className="h-64 flex items-center justify-center text-slate-400"><Loader2 className="animate-spin" /></div>;
  }

  if (!data || !data.spendByMood) {
    return null;
  }

  const moodData = data.spendByMood;
  const categoryData = data.spendByCategory || [];

  return (
    <div className="space-y-6">
      {/* PocketGuard-Style Cash Flow Widget */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">In My Pocket</h2>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            ${(data.in_my_pocket || 0).toFixed(2)}
          </span>
          <span className="text-sm font-medium text-slate-400">safe to spend</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="text-sm font-medium text-emerald-600 mb-1 flex items-center gap-1">
              <TrendingUp size={16} /> Income
            </div>
            <div className="text-2xl font-bold text-emerald-900">
              ${(data.total_income || 0).toFixed(2)}
            </div>
          </div>
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
            <div className="text-sm font-medium text-rose-600 mb-1 flex items-center gap-1">
              <TrendingDown size={16} /> Expenses
            </div>
            <div className="text-2xl font-bold text-rose-900">
              ${(data.total_expenses || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-blue-500" />
            Spend by Mood
          </h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {moodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChartIcon size={20} className="text-purple-500" />
            Top Categories
          </h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={(value) => `$${value}`} stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={80} />
                <Tooltip 
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
