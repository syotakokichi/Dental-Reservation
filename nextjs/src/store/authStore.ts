// src/app/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCurrentUser, logout, checkAdminAccess } from '../utils/api';

// 型定義
interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

// Zustandのストアを作成
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      // ログイン時にユーザー情報をセット
      login: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      // ログアウト処理
      logout: async () => {
        await logout();
        set({ user: null, isAuthenticated: false, isAdmin: false });
        localStorage.removeItem('auth-storage'); // ログアウト時にストレージから削除
      },

      // 認証ステータスの確認
      checkAuthStatus: async () => {
        try {
          console.log('Checking authentication status...');
          const user = await getCurrentUser();
          if (!user) {
            throw new Error('User not found');
          }

          // user_metadataからnameを取得（必要に応じて）
          const name = user.user_metadata?.name || "No Name";
          const formattedUser: User = {
            id: user.id,
            email: user.email || "No Email",
            name,  // nameをセット
          };

          console.log('User data:', formattedUser);
          const isAdmin = await checkAdminAccess();
          console.log('Is Admin:', isAdmin);
          set({
            user: formattedUser,
            isAuthenticated: true, // ユーザーが存在すれば認証状態をtrueに
            isAdmin,
          });
        } catch (error) {
          console.error('Error checking authentication status:', error);
          // 認証チェックに失敗した場合はログアウト状態にする
          set({ user: null, isAuthenticated: false, isAdmin: false });
          localStorage.removeItem('auth-storage');
        }
      },
    }),
    {
      name: 'auth-storage', // ローカルストレージに保存するキー名
      getStorage: () => localStorage, // ローカルストレージを指定
    }
  )
);