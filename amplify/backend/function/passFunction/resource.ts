// amplify/backend/function/myFunction/resource.ts
import { defineFunction, secret } from '@aws-amplify/backend';

export const myFunction = defineFunction({
  environment: {
    NAME: 'World',
    // シークレットを環境変数として定義する（Amplify コンソールでシークレット "MY_API_KEY" を事前に作成しておく必要があります）
    LIFF_ID: secret('LIFFID'),
    PASSWORD: secret('PASSWORD'),
});
