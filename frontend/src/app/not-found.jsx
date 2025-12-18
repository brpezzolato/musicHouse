'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <style>{`
        body {
         background-image: url('/notFound/not-found.png'); 
         background-size: cover; 
         background-repeat: no-repeat;
        }
      `}</style>

      <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 py-10 gap-8">
        {/* BLOCO ESQUERDO */}
        <div className=" text-center shadow-md rounded-[var(--borda-padrao)] px-10 py-12 w-full max-w-[420px]">
          <h1 className="text-[120px] sm:text-[150px] font-black text-[var(--vermelho-vivo)] leading-none mb-2">
            404
          </h1>
          <p className="text-[var(--vermelho-vivo)] font-semibold text-lg sm:text-xl">
            opss! página não encontrada
          </p>
          <p className="text-gray-600 text-sm mt-1 mb-6">
            volte para a página anterior
          </p>

          <Button
            onClick={() => router.back()}
            className="bg-[var(--vermelho-vivo)] cursor-pointer hover:bg-[var(--vermelho-vivo)] hover:opacity-[0.9] hover:scale-[1.01] text-white px-8 py-5 rounded-[var(--borda-padrao)] text-base font-semibold"
          >
            Voltar!
          </Button>
        </div>

        {/* IMAGEM DIREITA */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-[280px] sm:w-[340px] md:w-[420px] lg:w-[480px] object-contain"></div>
        </div>
      </div>
    </>
  );
}
