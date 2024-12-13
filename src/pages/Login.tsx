import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AuthForm from '../components/AuthForm';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/');
      } else {
        const { confirmationSent } = await signUp(email, password);
        if (confirmationSent) {
          setConfirmationSent(true);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('Email not confirmed')) {
        setConfirmationSent(true);
      } else {
        setError(err instanceof Error ? err.message : '認証エラーが発生しました');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Googleログインでエラーが発生しました');
    }
  };

  if (confirmationSent) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          確認メールを送信しました
        </h2>
        <p className="text-gray-600 text-center">
          ご登録いただいたメールアドレスに確認メールを送信しました。
          メール内のリンクをクリックして、登録を完了してください。
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <AuthForm
        isLogin={isLogin}
        onSubmit={handleSubmit}
        onToggleMode={() => setIsLogin(!isLogin)}
        onGoogleSignIn={handleGoogleSignIn}
        error={error}
      />
    </div>
  );
}