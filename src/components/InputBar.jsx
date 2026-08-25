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
      const saved = await api.saveTransaction({ ...result, raw_input: input });
      onTransactionAdded(saved);
      setInput('');
    } catch (err) {
      setError('Failed to process that. Try again?');
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-2 transition-all">
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
      
      {error && (
        <div className="px-4 pb-3 text-sm text-red-500 font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
