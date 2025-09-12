import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { liff } from '@line/liff';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';

const client = generateClient<Schema>();

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
  async ngOnInit(): Promise<void> {
    // LIFF SDK を利用して LINE ログイン状態の確認とアクセストークンの取得を行う
    if (typeof liff !== 'undefined') {
      const isInClient = liff.isInClient();

      // LINEブラウザでなければエラーで終了
      if (!isInClient) {
        alert('LINEブラウザからアクセスしてください。');
        window.close();
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const accessId = Number(params.get('access_id')) || 1;

      // LIFF IDのマッピング（Lambda側と同じロジック）
      const liffIdMap: Record<number, string> = {
        1: "2006654492-V29yE2A0",
        2: "2006654492-J8WgB7qm", 
        3: "2006654492-aWNRDwl7"
      };
      
      const liffId = liffIdMap[accessId] || liffIdMap[1];

      try {
        // LIFF の初期化
        await liff.init({ liffId: liffId });
        // LIFF の初期化完了後に ready を待つ
        await liff.ready;
        console.log('LIFF初期化完了');

        if (!liff.isLoggedIn()) {
          console.log('未ログイン: ログイン画面へ遷移します。');
          // 未ログインの場合はログイン画面へリダイレクト
          await liff.login();
        } else {
          // 友だち登録状態を確認
          const friend_ship = await liff.getFriendship();

          if (friend_ship['friendFlag'] === true) {
            console.log('友達登録済');

            // ログイン済みの場合、アクセストークンを取得
            const accessToken = await liff.getAccessToken();
            const passwordValue = environment.password;
            
            if (accessToken) {
              try {
                const URL = 'https://api.myodo-anchor.jp/auth';
                console.log('Requesting auth endpoint:', URL);

                // デバッグ用アラート
                alert('API呼び出し開始');

                // API Gateway のエンドポイントに GET リクエスト（LIFF access tokenを追加）
                const response = await axios.get(URL, {
                  params: {
                    password: passwordValue,
                    access_id: accessId,
                    liff_access_token: accessToken  // ← これが重要！
                  },
                  timeout: 30000, // 30秒タイムアウト
                  // withCredentials: true, // 一時的にコメントアウトしてCORS問題を回避
                });

                // レスポンス受信確認
                alert(`API応答受信: ${response.status}`);

                // レスポンスボディからクッキー情報とリダイレクト先 URL を取得
                const { message, cookies, redirectUrl } = response.data;
                console.log('Response body:', { message, cookies, redirectUrl });

                alert(`リダイレクトURL: ${redirectUrl}`);

                // 各クッキーを document.cookie にセット
                if (cookies) {
                  for (const key in cookies) {
                    if (cookies.hasOwnProperty(key)) {
                      // Domain は全サブドメインで共有するため、".myodo-anchor.jp" を指定
                      const cookieStr = `${key}=${cookies[key]}; Domain=.myodo-anchor.jp; Path=/; Secure; SameSite=None`;
                      document.cookie = cookieStr;
                      console.log('Set cookie:', key);
                    }
                  }
                }

                // LIFF専用リダイレクト
                if (redirectUrl) {
                  alert('リダイレクト実行中...');
                  try {
                    // LIFF内部ブラウザを閉じて外部ブラウザで開く
                    liff.openWindow({
                      url: redirectUrl,
                      external: true
                    });
                    alert('LIFF openWindow 成功');
                  } catch (liffError) {
                    console.log('LIFF openWindow failed, using standard redirectt');
                    alert('通常リダイレクト実行中...');
                    // 通常のリダイレクト
                    setTimeout(() => {
                      console.log('Redirecting to:', redirectUrl);
                      window.location.href = redirectUrl;
                    }, 50);
                  }
                } else {
                  alert('リダイレクトURLが空です');
                }
              } catch (error: unknown) {
                console.error('Error calling the auth endpoint:', error);
                
                // 詳細なエラー情報をアラート表示
                if (error && typeof error === 'object' && 'response' in error) {
                  const axiosError = error as { response?: { status?: number, statusText?: string } };
                  alert(`APIエラー: ${axiosError.response?.status} - ${axiosError.response?.statusText}`);
                } else if (error && typeof error === 'object' && 'request' in error) {
                  alert(`ネットワークエラー: レスポンスなし`);
                } else {
                  const errorMessage = error instanceof Error ? error.message : String(error);
                  alert(`エラー: ${errorMessage}`);
                }
              }
            } else {
              console.error('アクセストークンが取得できませんでした。');
            }
          } else {
            console.error('友達登録がされていません。');
          }
        }
      } catch (err) {
        console.error('LIFF 初期化エラー:', err);
      }
    } else {
      console.error('LIFF SDK が読み込まれていません。');
    }
  }

  createTodo() {
    // 今は使用しない
  }
}