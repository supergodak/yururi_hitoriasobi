import React from 'react';

export default function Terms() {
  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>

      <section className="mb-8">
        <p className="text-gray-600">
          この利用規約（以下、「本規約」といいます。）は、ゆるりスケジュール調整所（以下、「本サービス」といいます。）の利用条件を定めるものです。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">第1条（適用）</h2>
        <p className="text-gray-600">
          本規約は、ユーザーと本サービスの利用に関わる一切の関係に適用されるものとします。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">第2条（利用登録）</h2>
        <p className="text-gray-600">
          登録希望者は本規約に同意の上、本サービスの定める方法によって利用登録を申請し、本サービスがこれを承認することによって、利用登録が完了するものとします。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">第3条（禁止事項）</h2>
        <p className="text-gray-600">
          ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>法令または公序良俗に違反する行為</li>
          <li>犯罪行為に関連する行為</li>
          <li>本サービスの運営を妨害する行為</li>
          <li>他のユーザーに迷惑をかける行為</li>
          <li>他のユーザーの情報を収集する行為</li>
          <li>反社会的勢力に関与する行為</li>
          <li>その他、本サービスが不適切と判断する行為</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">第4条（免責事項）</h2>
        <p className="text-gray-600">
          本サービスは、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
        </p>
      </section>
    </div>
  );
}