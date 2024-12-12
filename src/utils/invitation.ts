import { InvitationToken } from '../types';

const INVITATION_EXPIRY_HOURS = 72; // トークンの有効期限（時間）

export function generateInvitationToken(email: string, eventId: string): string {
  const token: InvitationToken = {
    email,
    eventId,
    expires: Date.now() + INVITATION_EXPIRY_HOURS * 60 * 60 * 1000,
  };
  return btoa(JSON.stringify(token));
}

export function verifyInvitationToken(token: string): InvitationToken | null {
  try {
    const decoded = JSON.parse(atob(token)) as InvitationToken;
    if (Date.now() > decoded.expires) {
      return null; // トークンの有効期限切れ
    }
    return decoded;
  } catch {
    return null; // 不正なトークン
  }
}