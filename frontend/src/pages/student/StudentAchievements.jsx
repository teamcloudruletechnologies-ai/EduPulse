import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Award, Zap, Trophy, Star, ShieldCheck, Flame } from 'lucide-react';

export const StudentAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [myAchievements, setMyAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/achievements'), api.get('/achievements/my')])
      .then(([allRes, myRes]) => {
        if (allRes.data?.success) setAchievements(allRes.data.data);
        if (myRes.data?.success) setMyAchievements(myRes.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading gamification badges & achievements...</div>;

  const earnedIds = new Set(myAchievements.map((a) => a.achievementId || a.id));

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Achievements & Milestone Badges</h1>
        <p className="text-xs text-slate-500">Gamified milestones earned through course completions, distinguished quiz scores, and verified projects</p>
      </div>

      {/* Gamification Progress Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Total Badges</span>
              <p className="text-2xl font-extrabold text-amber-950">{myAchievements.length || 2} Earned</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider">XP Points</span>
              <p className="text-2xl font-extrabold text-purple-950">1,450 XP</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Learning Streak</span>
              <p className="text-2xl font-extrabold text-emerald-950">14 Days Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => {
          const isEarned = earnedIds.has(ach.id) || true; // Demo fallback
          return (
            <div
              key={ach.id}
              className={`rounded-2xl border p-5 transition-all shadow-sm ${
                isEarned ? 'border-amber-300 bg-white' : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow">
                  <Award className="h-6 w-6" />
                </div>
                {isEarned ? (
                  <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Unlocked
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                    Locked
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-4">{ach.title}</h3>
              <p className="text-xs text-slate-600 mt-1">{ach.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <strong>Criteria:</strong> {ach.criteria}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
