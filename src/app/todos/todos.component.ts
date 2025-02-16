import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { liff } from '@line/liff';
// import { ParameterService } from '../parameter.service';
import axios from 'axios';

const client = generateClient<Schema>();

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
  /*
  password: string | undefined;

  constructor(private parameterService: ParameterService) {}
  

  async getLinePassword(): Promise<any> {
    try {
      const response = await API.get(this.apiName, this.path, {});
      console.log('Parameter Store response:', response);

      return response;
    } catch (error) {
      console.error('Error fetching line password:', error);
      throw error;
    }
  }
  */

  todos: any[] = [];

  async ngOnInit(): Promise<void> {
    // LIFF SDK を利用して LINE ログイン状態の確認とアクセストークンの取得を行う
    if (typeof liff !== 'undefined') {
      try {
        const URL = 'https://api.nisseim.co.jp/auth';
        console.log('Requesting auth endpoint:', URL);

        // API Gateway のエンドポイントに GET リクエスト
        const response = await axios.get(URL, {
          // クロスサイトリクエストの場合、withCredentials オプションが必要
          withCredentials: true,
        });

        // ヘッダーからの Set-Cookie（ブラウザの場合はアクセスできない可能性があるため、body の cookies を利用）
        console.log('Response headers:', response.headers['set-cookie']);

        // レスポンスボディからクッキー情報とリダイレクト先 URL を取得
        const { message, cookies, redirectUrl } = response.data;
        console.log('Response body:', { message, cookies, redirectUrl });

        // 各クッキーを document.cookie にセット
        // cookies オブジェクトの例:
        // {
        //   "CloudFront-Key-Pair-Id": "K39TH33PKVYUIM",
        //   "CloudFront-Policy": "eyJTdGF0ZW1lbnQiOlt7...",
        //   "CloudFront-Signature": "i3EgM8EZtc6VDFhDB12x~..."
        // }
        for (const key in cookies) {
          if (cookies.hasOwnProperty(key)) {
            // Domain は全サブドメインで共有するため、".nisseim.co.jp" を指定
            const cookieStr = `${key}=${cookies[key]}; Domain=.nisseim.co.jp; Path=/; Secure; SameSite=None`;
            document.cookie = cookieStr;
            console.log(`Set cookie: ${cookieStr}`);
          }
        }

        // 遷移先URLにリダイレクト
        console.log('Redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
      } catch (error) {
        console.error('Error calling the auth endpoint:', error);
      }
    }
    /*
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
              const API_URL = 'https://api.nisseim.co.jp';

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
                    try {
                      // API Gateway のカスタムドメインのエンドポイントにGETリクエスト
                      const response = await axios.get(
                        'https://api.nisseim.co.jp/auth',
                        {
                          // Node.js の axios では withCredentials は不要（ブラウザ向けオプション）
                          // 必要に応じて追加のヘッダーを設定できます
                        }
                      );

                      // set-cookie ヘッダーを取得（複数ある場合は配列で返される）
                      const cookies = response.headers['set-cookie'];
                      console.log('Received Cookies:', cookies);

                      // レスポンスボディも出力
                      console.log('Response Body:', response.data);
                    } catch (error) {
                      console.error('Error calling the auth endpoint:', error);
                    }
                  }
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
      */
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
