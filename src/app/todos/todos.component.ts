import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { liff } from '@line/liff';
import axios from 'axios';
import { environment } from '../../environments/environment';

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
    alert("test0")

    // LIFF SDK を利用して LINE ログイン状態の確認とアクセストークンの取得を行う
    if (typeof liff !== 'undefined') {
      const isInClient = liff.isInClient();

      // LINEブラウザでなければエラーで終了
      if (!isInClient) {
        alert('LINEブラウザからアクセスしてください。');
        window.close();
        return;
      }

      alert("test")

      // const liffId = environment.liffid.split('_')[0];
      const liffId = environment.liffid;

      try {
        // LIFF の初期化（liffId は実際のものに置き換えてください）
        await liff.init({ liffId: liffId });
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
          // console.log('friend_ship:', friend_ship['friendFlag']);

          if (friend_ship['friendFlag'] === true) {
            console.log('友達登録済');

            // ログイン済みの場合、アクセストークンを取得
            const accessToken = await liff.getAccessToken();
            const passwordValue = environment.password;
            // console.log('accessToken:', accessToken);
            if (accessToken) {
              try {
                const URL = 'https://api.myodo-anchor.jp/auth';
                console.log('Requesting auth endpoint:', URL);

                // API Gateway のエンドポイントに GET リクエスト
                const response = await axios.get(URL, {
                  params: {
                    password: passwordValue,
                  },
                  // クロスサイトリクエストの場合、withCredentials オプションが必要
                  withCredentials: true,
                });

                // レスポンスボディからクッキー情報とリダイレクト先 URL を取得
                const { message, cookies, redirectUrl } = response.data;
                // console.log('Response body:', { message, cookies, redirectUrl });

                // 各クッキーを document.cookie にセット
                for (const key in cookies) {
                  if (cookies.hasOwnProperty(key)) {
                    // Domain は全サブドメインで共有するため、".nisseim.co.jp" を指定
                    const cookieStr = `${key}=${cookies[key]}; Domain=.nisseim.co.jp; Path=/; Secure; SameSite=None`;
                    document.cookie = cookieStr;
                    console.log('Set cookie:');
                  }
                }

                // 遷移先URLにリダイレクト
                setTimeout(() => {
                  console.log('Redirecting to:', redirectUrl);
                  window.location.href = redirectUrl;
                }, 50);
              } catch (error) {
                console.error('Error calling the auth endpoint:', error);
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
