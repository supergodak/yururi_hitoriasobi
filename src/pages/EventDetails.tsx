import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import EventDetailsComponent from '../components/EventDetails';
import { verifyInvitationToken } from '../utils/invitation';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { fetchEventDetails } = useEventStore();
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEventDetails(id);
      
      // トークンの検証
      const token = searchParams.get('token');
      if (token) {
        const invitation = verifyInvitationToken(token);
        if (invitation && invitation.eventId === id) {
          setInvitedEmail(invitation.email);
        }
      }
    }
  }, [id, searchParams, fetchEventDetails]);

  if (!id) {
    return <div>イベントが見つかりません</div>;
  }

  return <EventDetailsComponent eventId={id} invitedEmail={invitedEmail} />;
}