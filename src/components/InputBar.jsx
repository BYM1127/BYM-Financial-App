import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, X, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function InputBar({ onTransactionAdded }) {
  const [input, setInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedTx, setParsedTx] = useState(null);
  const [error, setError] = useState('');

  const handleParse = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsParsing(true);
    setError('');
    
    try {
      const result = await api.parseTransaction(input);
      // Attach the original input to the result so we can save it
      setParsedTx({ ...result, raw_input: input });
    } catch (err) {
      setError('Failed to understand that. Try again?');
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirm = async () => {
    try {
      // In a real app with Supabase RLS, this will fail without auth.
      // We will catch it and show an error or mock it for demo.
      const saved = await api.saveTransaction(parsedTx);
      onTransactionAdded(saved);
      reset();
    } catch (err) {
      setError('Failed to save transaction. Are you logged in?');
      // For demo purposes, we might just fire the event anyway if we are bypassing auth locally
      console.error(err);
    }
  };

  const reset = () => {
    setInput('');
    setParsedTx(null);
    setError('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-2 transition-all">
      {!parsedTx ? (
        <form onSubmit={handleParse} className="relative flex items-center">
          <div className="absolute left-4 text-blue-500">
            <Sparkles size={20} className={isParsing ? 'animate-pulse' : ''} />
          </div>
          <input
            type="text"
            className="w-full bg-transparent py-4 pl-12 pr-12 text-slate-800 placeholder-slate-400 focus:outline-none text-lg"
            placeholder="Dropped 120 on matcha because I was stressed..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isParsing}
            autoFocus
          />
          <button 
            type="submit" 
            disabled={isParsing || !input.trim()}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl transition-colors"
          >
            {isParsing ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
          </button>
        </form>
      ) : (
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-wrap gap-2 items-center text-sm font-medium">
            <span className="text-2xl font-bold text-slate-900">
              {parsedTx.currency || '$'}{parsedTx.amount}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
              {parsedTx.merchant || parsedTx.category}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
              {parsedTx.mood_tag}
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={reset}
              className="flex-1 sm:flex-none p-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors flex justify-center"
            >
              <X size={20} />
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-emerald-200"
            >
              <Check size={20} /> Confirm
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="px-4 pb-3 text-sm text-red-500 font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
