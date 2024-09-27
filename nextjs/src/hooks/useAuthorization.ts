// src/app/hooks/useAuthorization.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, getUserRole } from '../utils/api'; // 認証関連のユーティリティ関数をインポート

const useAuthorization = (requiredRole: string = '') => {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const user = await getCurrentUser();

        if (!user) {
          // ユーザーが存在しない場合はログインページへリダイレクト
          router.push('/auth/login');
          return;
        }

        if (requiredRole) {
          const userRole = await getUserRole();
          if (userRole !== requiredRole) {
            // 権限が不足している場合はアクセス拒否ページへリダイレクト
            router.push('/access-denied');
            return;
          }
        }

        // 認証および権限チェックが成功した場合
        setAuthorized(true);
      } catch (error) {
        console.error('Authorization error:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [requiredRole, router]);

  return { authorized, loading };
};

export default useAuthorization;