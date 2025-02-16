/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log("Hello from myFunction!");
  // resource.ts で定義したシークレットは環境変数として利用可能
  const liffId = process.env.LIFF_ID;
  console.log("Retrieved liffId:", liffId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Lambda executed successfully",
      // セキュリティ上、本来はシークレットはレスポンスに返さないことが望ましいですが、検証目的で出力可能
      liffId: liffId,
    }),
  };
};