import React, { useState, useEffect } from 'react';
import { Wallet, LogOut } from 'lucide-react';
import InputBar from '../components/InputBar';
import TransactionFeed from '../components/TransactionFeed';
import AnalyticsPanel from '../components/AnalyticsPanel';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await api.getTransactions();
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionAdded = (newTx) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTransaction(id);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      <button 
        onClick={handleLogout}
        className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white/80 backdrop-blur border border-slate-200 rounded-full shadow-sm hover:shadow transition-all"
      >
        <LogOut size={16} /> Logout
      </button>

      {/* Decorative background blur */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50 to-slate-50 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/40 blur-[120px] pointer-events-none" />
      <div className="absolute top-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-200/40 blur-[100px] pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 pt-16 pb-24">
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top-4">
          <div className="mx-auto w-16 h-16 bg-white shadow-sm border border-slate-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 rotate-3">
            <Wallet size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            FlowSpend
          </h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto font-medium">
            Just type what you spent. We'll handle the categorization, you handle the reflection.
          </p>
        </header>

        <InputBar onTransactionAdded={handleTransactionAdded} />

        {isLoading ? (
          <div className="mt-12 text-center text-slate-400">Loading feed...</div>
        ) : (
          <>
            <AnalyticsPanel refreshTrigger={transactions} />
            <TransactionFeed 
              transactions={transactions} 
              onDelete={handleDelete}
            />
          </>
        )}
      </main>
    </div>
  );
}
