import { supabase } from '../lib/supabase';

export async function logAccess() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: clientIp } = await fetch('https://api.ipify.org?format=json').then(res => res.json());
    
    await supabase.from('access_logs').insert({
      path: window.location.pathname,
      ip: clientIp?.ip,
      user_agent: navigator.userAgent,
      user_id: user?.id,
    });
  } catch (error) {
    console.error('Error logging access:', error);
    // エラーは無視して処理を継続
  }
}