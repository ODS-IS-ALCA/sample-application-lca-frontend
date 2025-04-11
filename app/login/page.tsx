'use client';

import { repository } from '@/api/repository';
import LoginForm, { LoginFormData } from '@/components/organisms/LoginForm';
import { setOperatorId } from '@/api/accessToken';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  async function onLoginSubmit(loginFormData: LoginFormData) {
    // API呼び出し時のエラーハンドリングはLoginForm側で実施
    sessionStorage.clear();
    const { operatorId } = await repository.login(loginFormData);
    if (
      typeof operatorId === 'undefined'
    ) {
      throw new Error('Invalid response');
    }
    
    setOperatorId({ operatorId });
    router.push('/parts/');
  }

  return (
    <LoginForm onSubmit={onLoginSubmit} />
  );
}
