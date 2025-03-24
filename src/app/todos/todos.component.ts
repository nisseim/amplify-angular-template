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
    if (typeof liff === 'undefined') {
      console.error('LIFF SDK が読み込まれていません。');
      return;
    }
    if (!liff.isInClient()) {
      alert('LINEブラウザからアクセスしてください。');
      window.close();
      return;
    }
  
    const liffId = environment.liffId.split('_')[0];
  
    try {
      await liff.init({ liffId: liffId });
      await liff.ready;                 // ← Promise版を await
  
      console.log('LIFF ready');
  
      if (!liff.isLoggedIn()) {
        console.log('未ログイン: ログイン画面へ遷移します。');
        await liff.login();
        return;
      }
  
      const { friendFlag } = await liff.getFriendship();
      if (!friendFlag) {
        console.error('友達登録がされていません。');
        return;
      }
  
      const accessToken = liff.getAccessToken();
      if (!accessToken) {
        console.error('アクセストークンが取得できませんでした。');
        return;
      }
  
      const response = await axios.get('https://api.myodo-anchor.jp/auth', {
        params: { password: environment.password, access_id: '1' },
        withCredentials: true,
      });
  
      const { cookies, redirectUrl } = response.data;
      for (const key in cookies) {
        document.cookie = `${key}=${cookies[key]}; Domain=.nisseim.co.jp; Path=/; Secure; SameSite=None`;
      }
  
      setTimeout(() => window.location.href = redirectUrl, 50);
    } catch (err) {
      console.error('エラー:', err);
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
