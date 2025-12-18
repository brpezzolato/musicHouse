'use client';

import { useEffect } from 'react';

export default function CopyrightPage() {
  useEffect(() => {
    document.title = 'Direitos Autorais | MusicHouse';
  }, []);

  return (
    <div className="bg-[#f3f3f3] text-[#131312] min-h-screen w-full overflow-x-hidden">

      <section className="w-full flex flex-col items-center justify-center py-16 bg-[#f3f3f3] border-b border-[#c1121f]/30">
        <h1 className="text-4xl md:text-5xl font-bold text-[#c1121f] uppercase tracking-wide text-center">
          © 2025 MusicHouse
        </h1>
        <p className="text-[#131312]/80 text-lg mt-3 text-center">
          Todos os direitos reservados · Página oficial de direitos autorais
        </p>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-10 leading-relaxed text-[#131312] text-justify">

        <section>
          <h2 className="text-2xl font-bold text-[#669BBC] mb-4">
            Direitos Autorais e Propriedade Intelectual
          </h2>
          <p>
            Todo o conteúdo disponível neste site — incluindo textos, imagens,
            vídeos, sons, logotipos, código-fonte e design — é propriedade
            exclusiva da <strong>MusicHouse S.A.</strong>, protegida pelas Leis
            nº 9.610/98 (Direitos Autorais) e nº 9.279/96 (Propriedade Industrial).
            O uso não autorizado poderá resultar em responsabilização civil e criminal.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#669BBC] mb-4">
            Marca Registrada
          </h2>
          <p>
            “MusicHouse” e seu logotipo são marcas registradas no
            <strong> INPI</strong> sob o número 924.556.203-1. É proibido o uso
            sem autorização prévia.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#669BBC] mb-4">
            Termos de Uso e Privacidade
          </h2>
          <p>
            O uso deste site implica aceitação integral dos Termos de Uso e da
            Política de Privacidade, conforme a Lei nº 13.709/2018 (LGPD). A MusicHouse
            garante que dados pessoais não são compartilhados sem consentimento.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#669BBC] mb-4">
            Responsabilidade e Isenção de Garantias
          </h2>
          <p>
            A MusicHouse se exime de responsabilidade por falhas técnicas, indisponibilidade
            do servidor ou conteúdos de terceiros em links externos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#669BBC] mb-4">
            Direitos de Imagem e Conteúdos de Terceiros
          </h2>
          <p>
            Algumas imagens e sons podem ser licenciados ou de domínio público.
            Caso encontre algo que viole direitos, entre em contato para remoção imediata.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#669BBC] mb-4">
            Informações Legais e Contato
          </h2>
          <div className="text-[#131312]/90 text-sm space-y-1">
            <p><strong>Razão social:</strong> MusicHouse S.A.</p>
            <p><strong>CNPJ:</strong> 45.112.987/0001-32</p>
            <p><strong>Endereço:</strong> Rua das Cordas, 512 – São Paulo/SP, CEP 01020-000</p>
            <p><strong>Telefone:</strong> (11) 91234-5678</p>
            <p><strong>E-mail:</strong> contato@musichouse.com.br</p>
            <p><strong>Responsável Legal:</strong> Fabio Almeida (Diretor de Operações)</p>
          </div>
        </section>

        <section className="border-t border-[#c1121f]/40 pt-6 text-sm text-[#131312]/70 text-center">
          <p>
            Última atualização: Outubro de 2025 · Versão 2.0 <br />
            Desenvolvido pela equipe <strong>MusicHouse DevLab</strong> 🎸
          </p>
        </section>

      </main>

    </div>
  );
}
