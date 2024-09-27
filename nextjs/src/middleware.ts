// src/middleware.ts
// import {createMiddlewareClient} from '@supabase/auth-helpers-nextjs'
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
// import {Cache} from 'memory-cache'

// ユーザーデータのキャッシュ
// const userDataCache = new Cache<string, any>();

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    // const supabase = createMiddlewareClient({req, res})

    // const {
    //     data: {session},
    // } = await supabase.auth.getSession()

    // console.log("Session Data:", session);

    // ログイン不要のパスのリスト
    const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/about', '/contact']

    // 現在のパスがpublicPathsに含まれているかチェック
    const isPublicPath = publicPaths.some(path =>
        req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(`${path}/`)
    )

    // const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    // if (!isPublicPath && !token) {
    //     return NextResponse.redirect(new URL('/auth/login', req.url));
    // }

    // デバッグ用ログ
    // console.log('Request path:', req.nextUrl.pathname);
    // console.log('Session:', !!session);
    // console.log('Is public path:', isPublicPath);

    // if (!isPublicPath && !session) {
    //     // セッションがなく、パブリックパスでもない場合、ログインページにリダイレクト
    //     if (req.nextUrl.pathname !== '/auth/login') {
    //         return NextResponse.redirect(new URL('/auth/login', req.url))
    //     }
    // }

    // if (session) {
    //     if (req.nextUrl.pathname === '/auth/login' || req.nextUrl.pathname === '/auth/register') {
    //         // すでにログインしている場合、加盟店一覧にリダイレクト
    //         return NextResponse.redirect(new URL('/stores', req.url))
    //     }

        // const {data: {user}, error} = await supabase.auth.getUser(session.access_token)
        // if (error || !user) {
        //     // トークンが無効な場合、ログアウトしてログインページにリダイレクト
        //     await supabase.auth.signOut()
        //     return NextResponse.redirect(new URL('/auth/login', req.url))
        // }

        // try {
        //     let userData = userDataCache.get(session.user.id)

        //     if (!userData) {
        //         // FastAPIから認可情報を取得
        //         const response = await fetch(`${process.env.API_URL}/auth/me`, {
        //             headers: {
        //                 Authorization: `Bearer ${session.access_token}`
        //             }
        //         });

        //         if (!response.ok) {
        //             throw new Error('Failed to fetch user data');
        //         }

        //         userData = await response.json();
        //         // キャッシュに保存（5分間）
        //         userDataCache.put(session.user.id, userData, 5 * 60 * 1000);
        //     }

            // ユーザーの役割と権限をレスポンスに追加
    //         res.headers.set('X-User-Roles', JSON.stringify(userData.roles));
    //         res.headers.set('X-User-Permissions', JSON.stringify(userData.permissions));

    //         // 権限チェック関数
    //         const hasPermission = (requiredPermission: string) =>
    //             userData.permissions.includes(requiredPermission);

    //         // 管理者のみがアクセスできるパスのリスト
    //         const adminOnlyPaths = ['/admin', '/settings']

    //         // 現在のパスがadminOnlyPathsに含まれているかチェック
    //         const isAdminOnlyPath = adminOnlyPaths.some(path =>
    //             req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(`${path}/`)
    //         )

    //         if (isAdminOnlyPath && !hasPermission('admin_access')) {
    //             // 管理者でない場合、アクセス拒否ページにリダイレクト
    //             return NextResponse.redirect(new URL('/access-denied', req.url))
    //         }

    //     } catch (error) {
    //         console.error('Error fetching user data:', error);
    //         // エラーが発生した場合、ログアウトさせてログインページにリダイレクト
    //         await supabase.auth.signOut();
    //         return NextResponse.redirect(new URL('/auth/login', req.url))
    //     }
    // }

    return res
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}