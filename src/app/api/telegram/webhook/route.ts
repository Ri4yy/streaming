import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID;

async function sendMessage(chatId: string | number, text: string, replyToMessageId?: number) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const payload: any = {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
    };
    if (replyToMessageId) {
        payload.reply_to_message_id = replyToMessageId;
    }

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (e) {
        console.error('Error sending telegram message:', e);
    }
}

export async function POST(req: Request) {
    if (!BOT_TOKEN || !ADMIN_ID) {
        console.error('TELEGRAM_BOT_TOKEN or ADMIN_TELEGRAM_ID is missing');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const update = await req.json();

        // Ensure this is a message
        if (!update.message || !update.message.text) {
            return NextResponse.json({ ok: true });
        }

        const msg = update.message;
        const chatId = msg.chat.id.toString();
        const text = msg.text;

        // Command /start
        if (text === '/start') {
            await sendMessage(chatId, `Привет! 👋\n\nЯ бот-помощник каталога развлечений. 🍿\nТы можешь авторизоваться через меня на сайте, чтобы сохранять свои любимые фильмы, сериалы, аниме и игры!\n\nА еще, если у тебя есть вопросы или предложения — просто напиши сюда, и администратор ответит тебе в ближайшее время! 👇`);
            return NextResponse.json({ ok: true });
        }

        // If the admin is replying to a support message
        if (chatId === ADMIN_ID) {
            if (msg.reply_to_message && msg.reply_to_message.text) {
                // Extract user ID from the original message sent to admin
                // We format the message as: 👤 От: Name\n🆔 ID: 123456\n\nText
                const match = msg.reply_to_message.text.match(/🆔 ID:\s*(\d+)/);
                if (match && match[1]) {
                    const userId = match[1];
                    await sendMessage(userId, `👨‍💻 <b>Ответ поддержки:</b>\n\n${text}`);
                    return NextResponse.json({ ok: true });
                }
            }
            // If admin just types a message without replying, ignore or remind them
            if (!msg.reply_to_message) {
                await sendMessage(ADMIN_ID, `⚠️ Чтобы ответить пользователю, сделайте <b>Reply (Ответить)</b> на его сообщение.`);
            }
            return NextResponse.json({ ok: true });
        }

        // If a normal user sends a message, forward it to the admin
        const userName = msg.from.first_name || 'Пользователь';
        const userUsername = msg.from.username ? `(@${msg.from.username})` : '';
        const adminText = `👤 <b>От:</b> ${userName} ${userUsername}\n🆔 ID: <code>${msg.from.id}</code>\n\n💬 <b>Сообщение:</b>\n${text}`;
        
        await sendMessage(ADMIN_ID, adminText);
        
        // Notify user that the message was sent
        await sendMessage(chatId, `✅ Ваше сообщение отправлено в поддержку. Мы ответим вам в ближайшее время!`);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Telegram webhook error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
