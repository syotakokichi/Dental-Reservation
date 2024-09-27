// Header.tsx
'use client';

import Link from 'next/link';
import { useStore } from '../app/context/StoreContext';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // 人型アイコンのためにreact-iconsを使用

const Header = () => {
    const { selectedStoreId, user, storeName } = useStore(); // storeNameとuserを取得
    const router = useRouter();
    const pathname = usePathname() ?? ''; // pathnameがnullの可能性を考慮
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleBookingsClick = () => {
        if (!selectedStoreId) {
            router.push('/stores');  // store_idが選択されていない場合、加盟店選択ページへリダイレクト
            return;
        }
        router.push(`/stores/${selectedStoreId}/bookings?view=day`);  // dayビューにリダイレクト
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen); // ドロップダウンの表示/非表示を切り替え
    };

    // ドロップダウン外をクリックした場合、メニューを閉じる処理
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isDropdownOpen && !(event.target as HTMLElement).closest('.dropdown-menu')) {
                setDropdownOpen(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [isDropdownOpen]);

    const handleLogout = () => {
        router.push('/'); // ログアウト処理
    };

    // 現在のページが加盟店選択ページかどうかのチェック
    const isStoreSelectionPage = pathname === '/stores';

    return (
        <header className="bg-white shadow-md p-6">
            <div className="container mx-auto flex justify-between items-center">
                 {/* 左側: タイトルと患者、予約 */}
                <div className="flex space-x-9 items-center mt-1 pl-10">
                    <h1 className="text-blue-900 text-3xl font-bold">予約システム</h1> {/* 追加したタイトル */}
                    {!isStoreSelectionPage && selectedStoreId && (
                        <nav className="flex space-x-8 font-2xl">
                            <Link href={`/stores/${selectedStoreId}/customers`} className={`text-black ${pathname.includes('customers') ? 'border-b-2 border-black' : ''}`}>
                                患者
                            </Link>
                            <button
                                onClick={handleBookingsClick}
                                className={`text-black ${pathname.includes('bookings') ? 'border-b-2 border-black' : ''}`}
                            >
                                予約
                            </button>
                        </nav>
                    )}
                </div>

                {/* 右側: ユーザーアイコンとドロップダウンメニュー */}
                <div className="relative">
                    <button onClick={toggleDropdown} className="text-gray-700 text-2xl focus:outline-none dropdown-menu">
                        <FaUserCircle />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 dropdown-menu">
                            <ul className="py-1">
                                {/* 加盟店名を表示 */}
                                {storeName && (
                                    <li className="px-4 py-2 font-bold text-black">{storeName}</li>
                                )}
                                {/* ユーザー情報 */}
                                {user && (
                                    <li className="px-4 py-2">
                                        <div className="text-black">{user.name}</div>
                                        <div className="text-gray-600">{user.email}</div>
                                    </li>
                                )}
                                <li>
                                    <Link href={`/stores/${selectedStoreId}/me`} className="block px-4 py-2 text-black hover:bg-gray-100">マイアカウント</Link>
                                </li>
                                <li>
                                    <Link href="/stores" className="block px-4 py-2 text-black hover:bg-gray-100">加盟店選択</Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100">ログアウト</button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;