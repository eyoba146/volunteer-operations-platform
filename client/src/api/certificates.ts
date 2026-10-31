import { Certificate } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getCertificatesForUser(userId: string): Promise<Certificate[]> {
  await delay(250, 500);
  const state = store.getState();
  return state.certificates.filter((c) => c.userId === userId);
}

export async function verifyCertificate(
  code: string
): Promise<{ valid: boolean; certificate?: Certificate; message?: string }> {
  await delay(350, 700);
  const state = store.getState();
  const cleaned = code.trim().toUpperCase();

  const cert = state.certificates.find(
    (c) => c.verificationCode.toUpperCase() === cleaned
  );

  if (cert) {
    return {
      valid: true,
      certificate: cert,
    };
  } else {
    return {
      valid: false,
      message: 'No active record was found matching this verification code. Please check the code stamped on the physical or electronic document.',
    };
  }
}

