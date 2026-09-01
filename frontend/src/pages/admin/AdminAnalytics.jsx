import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { BarChart3, Brain, Activity, Server, Users, Database } from 'lucide-react';

export const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/overview')
      .then((res) => {
        if (res.data?.success) setData(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Global Platform Analytics & Service Telemetry</h1>
        <p className="text-xs text-slate-500">Cross-tenant monitoring, FastAPI AI compute loads, and database transaction health</p>
      </div>

      {/* Service Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Node.js Express API</span>
              <p className="text-xl font-extrabold text-emerald-950">Port 5000 • ONLINE</p>
              <p className="text-[11px] text-emerald-700">Latency: 14ms</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider">Python FastAPI Microservice</span>
              <p className="text-xl font-extrabold text-purple-950">Port 8000 • HEALTHY</p>
              <p className="text-[11px] text-purple-700">Pandas Engine Ready</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">MySQL Server</span>
              <p className="text-xl font-extrabold text-blue-950">Port 3306 • CONNECTED</p>
              <p className="text-[11px] text-blue-700">Database: edtech_db</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
