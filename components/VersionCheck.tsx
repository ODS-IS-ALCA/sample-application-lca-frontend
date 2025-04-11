//表示しているURLの変更を検知し、サーバー上のversion.txtを取得して一致しない場合、ページをリロードする。
//一覧ページでのページ遷移やAPI操作などURLが変わらない振る舞い時や、
//表示・操作中のページで自動で動くことはしない。

'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import packageInfo from '@/package.json';

const VersionCheck = () => {

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      if (packageInfo.version) {
        const res = await fetch(`/version.txt`, {
          method: 'get',
          headers: {
            'pragma': 'no-cache',
            'Cache-Control': 'no-cache',
          }
        });
        if (res.ok) {
          const serverVersion = await res.text();
          if (serverVersion === packageInfo.version) {
            // バージョンが一致するためOK、何もしない
          } else {
            // バージョンが一致しないためリロード
            // データを保持せず完全なリロードを行うためwindow.location.hrefを再設定する
            window.location.href = window.location.href;
          }
        } else {
          // ローカル開発などは存在しないので無視
        }
      }
    })();
  }, [pathname, searchParams]);
  return null; // このコンポーネントはUIを描画しない
};

export default VersionCheck;
