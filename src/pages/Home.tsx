import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, CheckCircle, Users, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import EventList from '../components/EventList';

export default function Home() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="space-y-16">
        {/* ヒーローセクション */}
        <div className="relative text-center space-y-8 py-16">
          {/* 背景画像 */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <img
              src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1469&ixlib=rb-4.0.3"
              alt="背景"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <Calendar className="h-16 w-16 text-indigo-600 mx-auto relative" />
          <h1 className="text-4xl font-bold text-gray-900 relative">
            ゆるりスケジュール調整所
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto relative">
            複数人の予定調整を、もっとシンプルに。
            <br />
            食事会や会議の日程調整をスマートに解決します。
          </p>
          <div className="flex justify-center gap-4 relative">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              無料で始める
            </Link>
          </div>
        </div>

        {/* 特徴セクション */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            主な機能
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <CheckCircle className="h-8 w-8 text-indigo-600 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">
                シンプルな操作
              </h3>
              <p className="text-gray-600">
                直感的なUIで、誰でも簡単に予定調整を始められます。
              </p>
            </div>
            <div className="text-center space-y-4">
              <Users className="h-8 w-8 text-indigo-600 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">
                参加者管理
              </h3>
              <p className="text-gray-600">
                メールアドレスで簡単に参加者を招待。会員登録不要で回答できます。
              </p>
            </div>
            <div className="text-center space-y-4">
              <Clock className="h-8 w-8 text-indigo-600 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">
                リアルタイム更新
              </h3>
              <p className="text-gray-600">
                参加者の回答状況をリアルタイムで確認できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">イベント一覧</h1>
        <Link
          to="/events/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          新規イベント作成
        </Link>
      </div>
      <EventList />
    </div>
  );
}