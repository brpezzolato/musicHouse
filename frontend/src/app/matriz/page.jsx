'use client';

import BrasilMap from '@/components/MapaFiliais/MapaFiliais';
import { consumeDynamicAccess } from 'next/dist/server/app-render/dynamic-rendering';
import { useRouter } from 'next/navigation';

export default function DashMatriz() {
  const router = useRouter();
  async function logout() {
    try {
      const response = await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      router.replace('/');
    } catch (error) {
      console.log('Erro ao realizar o logout');
    }
  }
  return (
    <>
      <div>
        <button onClick={logout}>Sair</button>
      </div>


      <div className="flex flex-col w-1/2">
        <BrasilMap />
      </div>
      
    </>
  );
}
