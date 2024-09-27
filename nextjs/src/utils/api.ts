// src/app/utils/api.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { Event } from '../type/event';

// 型定義：ユーザーロールを定義します。管理者(admin)、スタッフ(staff)、ユーザー(user)の3つのロールがあります。
export type UserRole = 'admin' | 'manager' | 'general' | 'user' | null;
// 基本設定：APIホストとAPIキーを環境変数から取得し、デフォルト値を設定します。
const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Axiosインスタンスを作成し、API呼び出しの基本設定を行います。
const api: AxiosInstance = axios.create({
  baseURL: API_HOST,
});

// Supabaseクライアントの作成：Supabaseの認証ヘルパーを利用してクライアントを作成します。
// const supabase = createClientComponentClient();

// リクエストインターセプター：API呼び出し前に毎回実行される関数を設定します。
// ここでは、APIキーをヘッダーに追加し、さらに認証トークンがあればそれも追加します。
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  config.headers['X-API-Key'] = API_KEY;
  if (!config.headers['Accept']) {
    config.headers['Accept'] = 'application/json';
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Supabaseセッション情報を取得（今後使用する予定）
  // const { data: { session } } = await supabase.auth.getSession();
  // if (session) {
  //   config.headers.Authorization = `Bearer ${session.access_token}`;
  // }

  return config;
});

// エラーハンドリング関数：APIエラーが発生した場合に処理を行うユーティリティ関数です。
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.data);
  } else {
    console.error('Unexpected error:', error);
  }
  throw error;
};


// 認証関連関数（Supabaseはコメントアウト）
export const logout = async (): Promise<{ error: Error | null }> => {
    try {
        // const { error } = await supabase.auth.signOut();
        // return { error };
        localStorage.removeItem('token');
        return { error: null };
    } catch (error) {
        console.error('Logout failed:', error);
        return { error: error as Error };
    }
};

// ログイン状態を確認する関数：現在ログインしているかどうかを返します。
export const isLoggedIn = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    return !!token;
};

// 現在のユーザー情報を取得する関数：Supabaseから現在のユーザー情報を取得します。（今後使用予定）
export const getCurrentUser = async (): Promise<User | null> => {
  // const { data: { user } } = await supabase.auth.getUser();
  // return user;
  return null; // 現時点ではnullを返す
};

// 認証状態の変更を監視する関数：認証状態が変更されたときにコールバックを呼び出します。
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  // const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
  //   callback(session?.user ?? null);
  // });
  // return subscription;
};

// 権限関連の関数

// ユーザーロールを取得する関数：現在のユーザーロールを取得します。
export const getUserRole = async (): Promise<UserRole> => {
  const user = await getCurrentUser();
  return (user?.user_metadata?.role as UserRole) || 'user';
};

// ユーザーの権限リストを取得する関数
export const getUserPermissions = async (store_id: number): Promise<string[]> => {
  try {
    const response = await api.get(`/stores/${store_id}/me`);
    return response.data.permissions || [];
  } catch (error) {
    console.error('Failed to get user permissions:', error);
    return [];
  }
};

// 管理者アクセスをチェックする関数
export const checkAdminAccess = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'admin';
};

// 指定された権限を持っているか確認する関数
export const hasPermission = async (requiredPermission: string, storeId: number): Promise<boolean> => {
    const permissions = await getUserPermissions(storeId);
    return permissions.includes(requiredPermission);
};
// パスワードリセットリクエストを送信する関数
export const requestPasswordReset = async (email: string) => {
    try {
      await api.post('/auth/password/reset', { email });
    } catch (error) {
      handleApiError(error);
    }
  };

// パスワードリセットを確認する関数
export const verifyPasswordReset = async (email: string, newPassword: string) => {
    try {
      await api.post('/auth/password/verify', { email, newPassword });
    } catch (error) {
      handleApiError(error);
    }
  };

export const getEventDetails = async (store_id: number, event_id: number): Promise<Event> => {
    const response = await api.get<Event>(`/stores/${store_id}/events/${event_id}`);
    return response.data;
  };

export default api;