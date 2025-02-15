// src/app/parameter.service.ts

/*
import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  // 使用するリージョンを指定
  private region = 'ap-northeast-3';

  constructor() {}

  // Amplify Auth 経由で取得した認証情報を用い、
  //SSM の /line/password パラメータを取得する

  async getLinePassword(): Promise<string | undefined> {
    try {
      // Cognito Identity Pool 経由で認証情報を取得
      const credentials = await Auth.currentCredentials();

      // SSM クライアントの生成
      const ssmClient = new SSMClient({
        region: this.region,
        credentials: Auth.essentialCredentials(credentials),
      });

      // GetParameter コマンドの作成
      const command = new GetParameterCommand({
        Name: '/line/password',
        WithDecryption: true, // 暗号化パラメータの場合
      });

      // コマンドの実行
      const response = await ssmClient.send(command);
      return response.Parameter?.Value;
    } catch (error) {
      console.error('Error fetching /line/password:', error);
      throw error;
    }
  }
}
*/
