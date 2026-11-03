import { DemoSmsMessage } from '../types';
import { store } from './store';

export async function getSmsMessages(): Promise<DemoSmsMessage[]> {
  const state = store.getState();
  return state.smsMessages || [];
}

export async function sendSms(
  toPhone: string,
  toName: string,
  body: string,
  category: DemoSmsMessage['category'] = 'activity'
): Promise<DemoSmsMessage> {
  const id = `sms-${Date.now()}`;
  const now = new Date().toISOString();

  const msg: DemoSmsMessage = {
    id,
    toPhone,
    toName,
    body,
    category,
    sentAt: now,
    read: false,
  };

  store.setState((prev) => ({
    ...prev,
    smsMessages: [msg, ...(prev.smsMessages || [])],
  }));

  return msg;
}

export async function markSmsRead(id: string): Promise<void> {
  store.setState((prev) => ({
    ...prev,
    smsMessages: (prev.smsMessages || []).map((m) => (m.id === id ? { ...m, read: true } : m)),
  }));
}
