import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // fallback for compilation, but service key required in runtime
);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { hash, ...userData } = data;

    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN is not configured in environment variables.' }, { status: 500 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not configured in environment variables.' }, { status: 500 });
    }

    // Verify Telegram hash
    // 1. Data-check-string is a concatenation of all received fields, sorted in alphabetical order, in the format key=<value> with a line feed character ('\n', 0x0A) used as separator
    const dataCheckArr = Object.keys(userData)
      .sort()
      .map(key => `${key}=${userData[key]}`);
    const dataCheckString = dataCheckArr.join('\n');

    // 2. For Telegram Login Widget: secret key is SHA256 hash of the bot's token.
    const secretKey = crypto.createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN).digest();
    
    // 3. Compute HMAC-SHA256
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (hmac !== hash) {
      return NextResponse.json({ error: 'Invalid hash' }, { status: 401 });
    }

    // Hash is valid, process user
    const email = `${userData.id}@telegram.auth.local`;
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();

    // 1. First, check if any user has this telegram_id linked
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;
    
    let targetUser = users.find(u => u.user_metadata?.telegram_id == userData.id);
    let userEmailToSignIn = email;

    if (targetUser) {
      userEmailToSignIn = targetUser.email || email;
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, { 
        password: randomPassword
      });
      if (updateError) throw updateError;
    } else {
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
    console.error('Telegram auth error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
