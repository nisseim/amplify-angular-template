import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { liff } from '@line/liff';
import axios, { AxiosError } from 'axios';
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
      const accessIdParam = params.get('access_id');
      const accessId: number = accessIdParam ? parseInt(accessIdParam, 10) : 1; // デフォルト値を1に設定

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
        console.log('LIFF初期化完了, LIFF ID:', liffId);

        if (!liff.isLoggedIn()) {
          console.log('未ログイン: ログイン画面へ遷移します。');
          // 未ログインの場合はログイン画面へリダイレクト
          await liff.login();
        } else {
          // 友だち登録状態を確認
          const friend_ship = await liff.getFriendship();
          console.log('友達登録状態:', friend_ship['friendFlag']);

          if (friend_ship['friendFlag'] === true) {
            console.log('友達登録済み');

            // ログイン済みの場合、アクセストークンを取得
            const accessToken = await liff.getAccessToken();
            const passwordValue = environment.password;
            
            console.log('アクセストークン取得成功');
            if (accessToken) {
              try {
                const URL = 'https://api.myodo-anchor.jp/auth';
                console.log('認証エンドポイント呼び出し:', URL);

                // API Gateway のエンドポイントに GET リクエスト（LIFF access tokenを含める）
                const response = await axios.get(URL, {
                  params: {
                    password: passwordValue,
                    access_id: accessId,
                    liff_access_token: accessToken  // LIFF access tokenを追加
                  },
                  // クロスサイトリクエストの場合、withCredentials オプションが必要
                  withCredentials: true,
                });

                // レスポンスボディからクッキー情報とリダイレクト先 URL を取得
                const { message, cookies, redirectUrl, userSaveResult } = response.data;
                console.log('Lambda応答:', { message, redirectUrl, userSaveResult });
                console.log('Lambda完全応答:', response);

                // 各クッキーを document.cookie にセット
                if (cookies && typeof cookies === 'object') {
                  for (const key in cookies) {
                    if (cookies.hasOwnProperty(key)) {
                      // Domain は全サブドメインで共有するため、".myodo-anchor.jp" を指定
                      const cookieStr = `${key}=${cookies[key]}; Domain=.myodo-anchor.jp; Path=/; Secure; SameSite=None`;
                      document.cookie = cookieStr;
                      console.log('クッキー設定:', key, 'Value:', cookies[key]);
                    }
                  }
                }

                // ユーザー保存結果をログ出力
                if (userSaveResult) {
                  if (userSaveResult.action === 'created') {
                    console.log('新規ユーザーをDynamoDBに保存しました:', userSaveResult.userId);
                  } else if (userSaveResult.action === 'updated') {
                    console.log('既存ユーザーの情報を更新しました:', userSaveResult.userId);
                  } else if (userSaveResult.action === 'error') {
                    console.error('ユーザー保存エラー:', userSaveResult.error);
                  }
                }

                // リダイレクトURLの詳細確認
                console.log('=== リダイレクト処理開始 ===');
                
                // 遷移先URLにリダイレクト
                if (redirectUrl && typeof redirectUrl === 'string' && redirectUrl.length > 0) {
                  alert(`リダイレクト実行: ${redirectUrl}`);
                  
                  // 即座にリダイレクト実行
                  setTimeout(() => {
                    console.log('リダイレクト実行中:', redirectUrl);
                    window.location.href = redirectUrl;
                  }, 100);
                  
                } else {
                  alert(`リダイレクトURL無効: ${redirectUrl} (型: ${typeof redirectUrl})`);
                }
              } catch (error) {
                console.error('認証エンドポイントエラー:', error);
                if (axios.isAxiosError(error)) {
                  console.error('エラー詳細:', error.response?.data);
                }
              }
            } else {
              console.error('アクセストークンが取得できませんでした。');
            }
          } else {
            console.error('友達登録がされていません。友達追加してください。');
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