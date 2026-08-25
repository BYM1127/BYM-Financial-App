import React from 'react';
import { MoreHorizontal, Coffee, ShoppingBag, Zap, Heart, Flame, ShieldAlert } from 'lucide-react';

// A simple mood-to-color mapping for badges
const MOOD_STYLES = {
  Essential: 'bg-blue-100 text-blue-700 border-blue-200',
  Convenience: 'bg-amber-100 text-amber-700 border-amber-200',
  Stress: 'bg-red-100 text-red-700 border-red-200',
  Social: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Boredom: 'bg-slate-100 text-slate-700 border-slate-200',
  Treat: 'bg-purple-100 text-purple-700 border-purple-200'
};

const MOOD_ICONS = {
  Essential: ShieldAlert,
  Convenience: Zap,
  Stress: Flame,
  Social: Heart,
  Boredom: Coffee,
  Treat: ShoppingBag
};

function TransactionItem({ tx, onDelete }) {
  const Icon = MOOD_ICONS[tx.mood_tag] || Coffee;
  const moodStyle = MOOD_STYLES[tx.mood_tag] || MOOD_STYLES.Boredom;

  return (
    <div className="group flex items-center justify-between p-4 bg-white border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md rounded-2xl transition-all mb-3">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl border ${moodStyle} bg-white`}>
          <Icon size={20} className="opacity-80" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{tx.merchant || tx.category}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${moodStyle}`}>
              {tx.mood_tag}
            </span>
            <span className="text-xs text-slate-400 capitalize">
              • {tx.category}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg text-slate-900">
          {tx.currency || '$'}{Number(tx.amount).toFixed(2)}
        </span>
        <button 
          onClick={() => onDelete(tx.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}

export default function TransactionFeed({ transactions, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Coffee size={24} />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No transactions yet</h3>
        <p className="text-slate-500">Log your first expense above to see your feed.</p>
      </div>
    );
  }

  // Group transactions by date (simplified for this iteration)
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
      </div>
      
      <div className="space-y-1">
        {transactions.map(tx => (
          <TransactionItem key={tx.id} tx={tx} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
