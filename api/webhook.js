import { Client } from '@line/bot-sdk';

// LINE Bot設定
const config = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

const client = new Client(config);

// Vercelのサーバーレス関数
export default async function handler(req, res) {
  // POSTリクエストのみ受け付ける
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const events = req.body.events;

    // イベント処理
    await Promise.all(
      events.map(async (event) => {
        return handleEvent(event);
      })
    );

    res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// イベント処理関数
async function handleEvent(event) {
  // メッセージイベント以外は無視
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null;
  }

  // ユーザーからのメッセージ
  const userMessage = event.message.text;

  // 返信メッセージを作成
  let replyText;

  if (userMessage === 'こんにちは') {
    replyText = 'こんにちは！何かお手伝いできることはありますか？';
  } else if (userMessage === 'ヘルプ') {
    replyText = '利用可能なコマンド:\n・こんにちは\n・ヘルプ\n・天気';
  } else if (userMessage === '天気') {
    replyText = '今日は晴れです☀️';
  } else {
    // オウム返し
    replyText = `あなたのメッセージ: ${userMessage}`;
  }

  // 返信を送信
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText,
  });
}
