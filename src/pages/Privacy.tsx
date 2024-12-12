import React from 'react';

export default function Privacy() {
  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>

      <section className="mb-8">
        <p className="text-gray-600">
          ゆるりスケジュール調整所（以下、「本サービス」といいます。）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 収集する情報</h2>
        <p className="text-gray-600">本サービスは、以下の情報を収集します：</p>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>メールアドレス</li>
          <li>氏名（任意）</li>
          <li>イベント参加可否情報</li>
          <li>その他本サービスの利用に付随して生じる情報</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 利用目的</h2>
        <p className="text-gray-600">収集した情報は、以下の目的で利用します：</p>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>本サービスの提供・運営</li>
          <li>ユーザーの認証</li>
          <li>イベント参加者への通知</li>
          <li>本サービスの改善・新機能の開発</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 情報の管理</h2>
        <p className="text-gray-600">
          本サービスは、収集した情報の管理について、以下の対策を実施します：
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>不正アクセス防止のためのセキュリティ対策</li>
          <li>個人情報の漏洩防止</li>
          <li>その他の安全管理措置</li>
        </ul>
      </section>
    </div>
  );
}