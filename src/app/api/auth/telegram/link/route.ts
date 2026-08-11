import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { hash, ...userData } = data;

    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN is not configured.' }, { status: 500 });
    }

    // Verify Telegram hash
    const dataCheckArr = Object.keys(userData)
      .sort()
      .map(key => `${key}=${userData[key]}`);
    const dataCheckString = dataCheckArr.join('\n');

    const secretKey = crypto.createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (hmac !== hash) {
      return NextResponse.json({ error: 'Неверная подпись от Telegram' }, { status: 401 });
    }

    // Get current user session
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Пользователь не авторизован' }, { status: 401 });
    }

    // Check if another user already has this telegram_id
    // This is optional but good practice to prevent stealing TG accounts
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (!listError) {
      const existingUser = users.find(u => u.user_metadata?.telegram_id == userData.id && u.id !== user.id);
      if (existingUser) {
        return NextResponse.json({ error: 'Этот Telegram-аккаунт уже привязан к другому профилю' }, { status: 400 });
      }
    }

    // Update user metadata
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        telegram_id: userData.id,
      }
    });

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Telegram link error:', error);
    return NextResponse.json({ error: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
