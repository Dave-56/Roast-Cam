import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export const Loading: React.FC = () => {
  const messages = [
    "Scanning your okrika outfit...",
    "Consulting the Ministry of Vawulence...",
    "Checking if you get urgent 2k...",
    "Wait make I wear my glasses...",
    "Cooking up serious breakfast...",
    "Analysing your sapa level...",
    "This one go loud o...",
    "Gathering receipts...",
  ];

  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-pink-500 blur-3xl opacity-40 animate-pulse rounded-full"></div>
        <Sparkles className="w-20 h-20 text-white animate-bounce relative z-10" />
      </div>
      <h2 className="text-3xl font-extrabold text-white mb-4 animate-pulse">
        {messages[msgIndex]}
      </h2>
      <p className="text-white/60 text-sm font-mono">Powered by Gemini Pro</p>
    </div>
  );
};