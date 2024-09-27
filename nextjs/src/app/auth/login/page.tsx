// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';
import { useAuthStore } from '../../../store/authStore';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ログインリクエストを実行
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.access_token;

      if (token) {
        // ローカルストレージにトークンを保存
        localStorage.setItem('token', token);

        // Zustandのストアにログイン情報を保存
        login({ id: '', email, name: '' }); // 状況に応じて適切なユーザーデータを保存

        // /stores 画面に遷移
        router.push('/stores');
      } else {
        console.error('No access token received');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="text-black"
            />
          </div>
          <div className="mb-6">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="text-black"
            />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/auth/password-reset/request" className="text-blue-600 hover:underline">
            パスワードをお忘れですか？
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;