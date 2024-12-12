import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, LogOut, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Calendar className="h-6 w-6 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  ゆるりスケジュール調整所
                </span>
              </Link>
              <Link
                to="/guide"
                className="ml-8 flex items-center text-gray-600 hover:text-gray-900"
              >
                <HelpCircle className="h-5 w-5 mr-1" />
                使い方ガイド
              </Link>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    ログアウト
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  ログイン
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center space-x-4 mb-4">
            <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
              利用規約
            </Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              プライバシーポリシー
            </Link>
          </div>
          <p className="text-center text-sm text-gray-600">
            Powered by{' '}
            <a
              href="https://hitoriasobi.life"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500"
            >
              ひとりあそび研究所
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}