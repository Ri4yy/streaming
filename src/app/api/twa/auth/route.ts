import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { initData } = await req.json();

    if (!initData) {
      return NextResponse.json({ error: 'Missing initData' }, { status: 400 });
    }

    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN is not configured.' }, { status: 500 });
    }

    // Parse initData
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    
    // Sort params alphabetically
    const keys = Array.from(urlParams.keys()).sort();
    const dataCheckString = keys.map(key => `${key}=${urlParams.get(key)}`).join('\n');

    // Validation for Telegram Mini App
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(process.env.TELEGRAM_BOT_TOKEN).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (hmac !== hash) {
      return NextResponse.json({ error: 'Invalid hash' }, { status: 401 });
    }

    // Parse user data
    const userStr = urlParams.get('user');
    if (!userStr) {
      return NextResponse.json({ error: 'No user data in initData' }, { status: 400 });
    }
    
    const userData = JSON.parse(userStr);

    const email = `${userData.id}@telegram.auth.local`;
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();

    // 1. First, check if any user has this telegram_id linked
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;
    
    let targetUser = users.find(u => u.user_metadata?.telegram_id == userData.id);
    let userEmailToSignIn = email;

    if (targetUser) {
      // User with linked telegram account found!
      userEmailToSignIn = targetUser.email || email;
      
      // Update their password so we can sign in
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, { 
        password: randomPassword
      });
      if (updateError) throw updateError;
    } else {
      // No linked user found, try to create a new one (or update existing by generated email)
      let { data: { user }, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: randomPassword,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          telegram_id: userData.id,
          avatar_url: userData.photo_url || null,
          provider: 'telegram'
        }
      });

      // If user already exists by email, update their password
      if (createError && (createError.message.includes('already registered') || createError.status === 422)) {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, { 
            password: randomPassword,
            user_metadata: {
              ...existingUser.user_metadata,
              full_name: fullName,
              telegram_id: userData.id,
              avatar_url: userData.photo_url || null,
              provider: 'telegram'
            }
          });
          if (updateError) throw updateError;
          userEmailToSignIn = existingUser.email || email;
        } else {
           throw new Error("User exists but could not be found");
        }
      } else if (createError) {
        throw createError;
      }
    }

    // Now sign in the user to get session tokens
    const { data: sessionData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: userEmailToSignIn,
      password: randomPassword
    });

    if (signInError) throw signInError;

    return NextResponse.json({ session: sessionData.session });

  } catch (error: any) {
    console.error('TWA auth error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
