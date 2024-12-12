import React from 'react';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';

export default function Guide() {
  return (
    <div className="space-y-12">
      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">使い方ガイド</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            <Calendar className="inline-block h-6 w-6 mr-2 text-indigo-600" />
            イベントの作成
          </h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-600">
            <li>ログイン後、「新規イベント作成」ボタンをクリックします</li>
            <li>イベント名と説明を入力します</li>
            <li>会場候補を入力します（任意：URLの入力も任意ですし、店舗でないURLでもOKです）</li>
            <li>候補日時を1つ以上入力します</li>
            <li>参加者のメールアドレスを入力します</li>
            <li>「イベントを作成」ボタンをクリックすると、参加者に招待メールが送信されます</li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            <Users className="inline-block h-6 w-6 mr-2 text-indigo-600" />
            参加者の回答方法
          </h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-600">
            <li>招待メールに記載されたURLをクリックします</li>
            <li>名前（任意）を入力します</li>
            <li>各候補日時について、以下の3つから選択します：
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>○：参加可能</li>
                <li>△：調整可能</li>
                <li>×：参加不可</li>
              </ul>
            </li>
            <li>会場候補が複数ある場合は、希望する会場に投票できます</li>
            <li>「回答を送信」ボタンをクリックして完了です</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            <CheckCircle className="inline-block h-6 w-6 mr-2 text-indigo-600" />
            その他の機能
          </h2>
          <ul className="list-disc list-inside space-y-4 text-gray-600">
            <li>回答は何度でも変更可能です</li>
            <li>全員の回答状況はリアルタイムで確認できます</li>
            <li>会場候補への投票状況も確認できます</li>
            <li>全機能なんどでも無料で使えます</li>
          </ul>
        </section>
      </div>
    </div>
  );
}