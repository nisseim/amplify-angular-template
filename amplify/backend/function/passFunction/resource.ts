// amplify/backend/function/myFunction/resource.ts
import { defineFunction, secret } from '@aws-amplify/backend';

export const myFunction = defineFunction({
  environment: {
    NAME: 'World',
    // シークレットを環境変数として定義する（Amplify コンソールでシークレット "MY_API_KEY" を事前に作成しておく必要があります）
    LIFF_ID: secret('LIFFID'),
    LIFF_ID2: secret('LIFFID2'),
    LIFF_ID3: secret('LIFFID3'),
    PASSWORD: secret('PASSWORD'),
});
