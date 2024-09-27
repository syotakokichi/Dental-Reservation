// app/auth/password-reset/verify/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../utils/api';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';

const PasswordResetVerifyPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handlePasswordResetVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/password/verify', { email, newPassword });
      setMessage('パスワードがリセットされました。');
      router.push('/auth/login');
    } catch (error) {
      console.error('Password reset verification failed', error);
      setMessage('パスワードリセットの確認に失敗しました。');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">パスワードリセット確認</h1>
        <form onSubmit={handlePasswordResetVerify}>
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
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="text-black"
            />
          </div>
          <Button type="submit" className="w-full">パスワードをリセット</Button>
        </form>
        {message && <p className="mt-4 text-center text-black">{message}</p>}
      </div>
    </div>
  );
};

export default PasswordResetVerifyPage;