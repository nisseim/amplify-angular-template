import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { liff } from '@line/liff';

const client = generateClient<Schema>();

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
  todos: any[] = [];

  async ngOnInit(): Promise<void> {
    // LIFF SDK を利用して LINE ログイン状態の確認とアクセストークンの取得を行う
    if (typeof liff !== 'undefined') {
      try {
        // LIFF の初期化（liffId は実際のものに置き換えてください）
        await liff.init({ liffId: '2006654492-9JpX7adv' });
        // LIFF の初期化完了後に ready を待つ
        await liff.ready;
        console.log('LIFF初期化完了');

        if (!liff.isLoggedIn()) {
          console.log('未ログイン: ログイン画面へ遷移します。');
          // 未ログインの場合はログイン画面へリダイレクト（この後のコードは実行されません）
          await liff.login();
        } else {
          // 友だち登録状態を確認
          const friend_ship = await liff.getFriendship();
          console.log('friend_ship:', friend_ship['friendFlag']);

          if (friend_ship['friendFlag'] === true) {
            console.log('友達登録済');
            // ログイン済みの場合、アクセストークンを取得
            const accessToken = await liff.getAccessToken();
            console.log('accessToken:', accessToken);
            if (accessToken) {
              console.log('start:');

              // CloudFront の URL にアクセストークンをクエリパラメータとして付与してリダイレクトする API を呼び出す
              const API_URL = 'https://api.nisseim.co.jp/auth';

              // 送信する JSON データ（lineAccessToken を含む）
              const data = {
                lineAccessToken: accessToken,
                password: 'O5tLFIOVcSdk6NVj2NJrLJRk2ExY3m286iKDHnEuxAtI5PFMdc',
              };

              // fetch API を利用して POST リクエストを送信
              fetch(API_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include', // クロスサイトの場合、クッキー送信を有効にする
                body: JSON.stringify(data),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
                })
                .then((result) => {
                  console.log('Success:', result);

                  if (result['message'] === 'Login successful') {
                    console.log('ログイン成功');
                    // デバッグ用の Cookie を一旦セット

                    console.log('Debug Cookies:', result.debug_cookies);

                    const cookies = result['debug_cookies'];
                    // 固定ドメインを指定
                    const domain = '.nisseim.co.jp';

                    // Cookie 設定の文字列を組み立てる
                    let policyCookie = `CloudFront-Policy=${cookies['CloudFront-Policy']}; path=/;`;
                    let signatureCookie = `CloudFront-Signature=${cookies['CloudFront-Signature']}; path=/;`;
                    let keyPairCookie = `CloudFront-Key-Pair-Id=${cookies['CloudFront-Key-Pair-Id']}; path=/;`;

                    if (domain) {
                      policyCookie += ` domain=${domain};`;
                      signatureCookie += ` domain=${domain};`;
                      keyPairCookie += ` domain=${domain};`;
                    }

                    // Secure と SameSite=None を付加
                    policyCookie += ' Secure; SameSite=None';
                    signatureCookie += ' Secure; SameSite=None';
                    keyPairCookie += ' Secure; SameSite=None';

                    document.cookie = policyCookie;
                    document.cookie = signatureCookie;
                    document.cookie = keyPairCookie;

                    console.log('Set Cookies:', document.cookie);

                    // Cookie 設定後、少し待ってからリダイレクト
                    setTimeout(() => {
                      window.location.href = 'https://cdn.nisseim.co.jp';
                    }, 200);
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
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

  /*
  listTodos() {
    try {
      client.models.Todo.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.todos = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }
  */

  createTodo() {
    /*
    try {
      client.models.Todo.create({
        content: window.prompt('Todo content'),
      });
      this.listTodos();
    } catch (error) {
      console.error('error creating todos', error);
    }
    */
  }
}
