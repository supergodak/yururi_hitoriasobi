import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AuthForm from '../components/AuthForm';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (email: string, password: string) => {
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '認証エラーが発生しました');
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