import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
  onToggleMode: () => void;
  onGoogleSignIn: () => Promise<void>;
  error: string | null;
}

export default function AuthForm({
  isLogin,
  onSubmit,
  onToggleMode,
  onGoogleSignIn,
  error,
}: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !agreedToTerms) {
      alert('利用規約とプライバシーポリシーに同意してください');
      return;
    }
    onSubmit(email, password);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'ログイン' : '新規登録'}
      </h2>
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        {!isLogin && (
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
              <Link to="/terms" target="_blank" className="text-indigo-600 hover:text-indigo-500">
                利用規約
              </Link>
              と
              <Link to="/privacy" target="_blank" className="text-indigo-600 hover:text-indigo-500">
                プライバシーポリシー
              </Link>
              に同意します
            </label>
          </div>
        )}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLogin ? 'ログイン' : '登録'}
        </button>
      </form>
      <button
        onClick={onGoogleSignIn}
        className="mt-4 w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Mail className="h-5 w-5 mr-2" />
        Googleでログイン
      </button>
      <button
        onClick={onToggleMode}
        className="mt-4 w-full text-sm text-indigo-600 hover:text-indigo-500"
      >
        {isLogin ? 'アカウントをお持ちでない方' : 'すでにアカウントをお持ちの方'}
      </button>
    </div>
  );
}