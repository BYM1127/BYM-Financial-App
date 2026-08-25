import React, { useState } from 'react';
import { MoreHorizontal, Coffee, ShoppingBag, Zap, Heart, Flame, ShieldAlert, ThumbsUp, ThumbsDown } from 'lucide-react';
import { api } from '../services/api';

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
  
  const [reflection, setReflection] = useState(tx.reflection_status || 'None');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReflect = async (status) => {
    if (status === reflection || isUpdating) return;
    setIsUpdating(true);
    try {
      await api.updateTransaction(tx.id, { reflection_status: status });
      setReflection(status);
    } catch (err) {
      console.error("Reflection failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="group flex flex-col p-4 bg-white border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md rounded-2xl transition-all mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl border ${moodStyle} bg-white`}>
            <Icon size={20} className="opacity-80" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 capitalize">{tx.merchant || tx.category}</h3>
            <p className="text-sm text-slate-500 capitalize">{tx.mood_tag} • {tx.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-700'}`}>
            {tx.type === 'income' ? '+' : '-'}{tx.currency || '$'}{Number(tx.amount).toFixed(2)}
          </div>
          <button 
            onClick={() => onDelete(tx.id)}
            className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
      
      {/* Micro-reflection interface for non-essential moods */}
      {(tx.mood_tag !== 'Essential' || reflection !== 'None') && (
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">How do you feel about this?</span>
          <button 
            onClick={() => handleReflect('WorthIt')}
            disabled={isUpdating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              reflection === 'WorthIt' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <ThumbsUp size={14} /> Worth It
          </button>
          <button 
            onClick={() => handleReflect('Regret')}
            disabled={isUpdating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              reflection === 'Regret' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <ThumbsDown size={14} /> Regret
          </button>
        </div>
      )}
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
