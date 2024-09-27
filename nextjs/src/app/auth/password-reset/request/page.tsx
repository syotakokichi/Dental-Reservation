// app/auth/password-reset/request/page.tsx
'use client';

import { useState } from 'react';
import api from '../../../../utils/api';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';

const PasswordResetRequestPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/password/reset', { email });
      setMessage('パスワードリセットのリンクをメールで送信しました。');
    } catch (error) {
      console.error('Password reset request failed', error);
      setMessage('パスワードリセットのリクエストに失敗しました。');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">パスワードリセット</h1>
        <form onSubmit={handlePasswordResetRequest}>
          <div className="mb-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="text-black"
            />
          </div>
          <Button type="submit" className="w-full">リセットリンクを送信</Button>
        </form>
        {message && <p className="mt-4 text-center text-black">{message}</p>}
      </div>
    </div>
  );
};

export default PasswordResetRequestPage;