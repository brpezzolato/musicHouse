'use client'

import VerChamado from '@/components/VerChamado/VerChamado'
import 'swiper/css';
import { Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next/client';
import Select from 'react-select';

const selectStyle = {
  control: (base, state) => ({
    ...base,
    borderRadius: '99999px',
    borderColor: '#d4a017',
    padding: '2px',
    minHeight: '40px',
    transition: 'all 300ms ease',
    outline: 'none',
    boxShadow: state.isFocused
      ? '0 0 20px 6px rgba(171,129,18,0.25)'
      : 'none',
    '&:hover': { borderColor: '#d4a017' },
    backgroundColor: '#ffffff',
  }),

  menu: (base) => ({
    ...base,
    overflowX: 'visible',
    overflowY: 'visible',
  }),

  menuList: (base) => ({
    ...base,
    overflowX: 'visible',
    overflowY: 'visible',
  }),

  singleValue: (base) => ({
    ...base,
    color: '#697b85',
  }),

  placeholder: (base) => ({
    ...base,
    color: '#b5b5b5',
  }),

  option: (base, { isFocused, isSelected }) => ({
    ...base,
    transition: 'all 200ms ease',
    WebkitTapHighlightColor: 'transparent',
    backgroundColor: isSelected
      ? '#d4a017'
      : isFocused
        ? '#bf8c06'
        : 'white',
    color: isFocused || isSelected ? 'white' : '#003049',
    ...(isFocused && {
      backgroundColor: 'rgba(212,160,23,0.15)',
      color: '#003049',
      transform: 'scale(1.02)',
      boxShadow: '0 0 8px rgba(212,160,23,0.4)',
    }),
    cursor: 'pointer',
    ':active': {
      backgroundColor: 'rgba(212,160,23,0.25) !important',
      color: '#003049',
      outline: 'none !important',
    },
    ':focus': {
      outline: 'none !important',
    },
  }),
};

export default function Page() {
  const [user, setUser] = useState({});
  const [tiket, setTiket] = useState('');
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState(null);
  const [prioridade, setPrioridade] = useState(null);
  const [recarregar, setRecarregar] = useState(false);
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoriaOptions = [
    { value: 'Sistema', label: 'Sistema' },
    { value: 'Financeiro', label: 'Financeiro' },
    { value: 'Produto', label: 'Produto' },
    { value: 'Estoque', label: 'Estoque' },
    { value: 'Venda', label: 'Venda' },
    { value: 'Funcionário', label: 'Funcionário' },
    { value: 'Outros', label: 'Outros' },
  ];

  const prioridadeOptions = [
    { value: 'Baixa', label: 'Baixa' },
    { value: 'Média', label: 'Média' },
    { value: 'Alta', label: 'Alta' },
    { value: 'Crítica', label: 'Crítica' },
  ];

  async function pegarDados() {
    const cookieStore = getCookie('token');

    const requestUser = await fetch("http://localhost:8080/auth/auth-check", {
      method: "GET",
      headers: {
        cookie: cookieStore,
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await requestUser.json();
    setUser(data.funcionario);
  }

  useEffect(() => {
    pegarDados();
  }, []);

  async function carregarMeusChamados() {
    try {
      const response = await fetch("http://localhost:8080/chamados/meus", {
        cache: 'no-store',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setChamados(data);
      } else {
        console.log("Erro ao carregar seus chamados");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  useEffect(() => {
    carregarMeusChamados();
  }, [recarregar])

  async function enviar() {
    try {
      setLoading(true);
      setRecarregar(false);

      const info = {
        id_franquia: user.filial,
        id_funcionario: user.id_registro,
        email: user.email,
        nome_func: user.nome,
        titulo,
        descricao: tiket,
        categoria: categoria?.value,
        prioridade: prioridade?.value,
      };

      const response = await fetch("http://localhost:8080/chamados", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      });

      const data = await response.json();

      if (response.ok) {
        setTiket('');
        setTitulo('');
        setCategoria(null);
        setPrioridade(null);
        setRecarregar(true);
      } else {
        alert('Erro ao enviar o chamado');
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <img
        src="/chamado/chamadoTop.png"
        alt="Banner Chamado"
        className="w-full max-h-[1050px] object-cover "
        draggable={false}
      />

      <section className="py-14 px-6 lg:px-20">
        <VerChamado chamados={chamados} />
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 max-[1273px]:!grid-cols-1">
            <div className='lg:-mt-13'>
              <h4 className="text-[#ab8112] text-sm font-medium mb-2">
                Entre em Contato
              </h4>

              <h2 className="text-[#D4A017] font-manrope text-3xl font-semibold mb-4">
                Abrir Chamado
              </h2>

              <input
                type="text"
                value={user.email || 'Carregando...'}
                readOnly
                className="w-full h-12 text-gray-400 bg-white cursor-default placeholder-gray-500 text-base rounded-full border border-[#D4A017] px-4 mb-3"
              />

              <input
                type="email"
                value={user.nome || 'Carregando...'}
                readOnly
                className="w-full h-12 text-gray-400 bg-white cursor-default placeholder-gray-500 text-base rounded-full border border-[#D4A017] px-4 mb-3"
              />

              <div className="flex space-x-4 mb-3">
                <div className="w-1/2">
                  <Select
                    options={categoriaOptions}
                    value={categoria}
                    onChange={(option) => setCategoria(option)}
                    styles={selectStyle}
                    placeholder="Categoria"
                  />
                </div>
                <div className="w-1/2">
                  <Select
                    options={prioridadeOptions}
                    value={prioridade}
                    onChange={(option) => setPrioridade(option)}
                    styles={selectStyle}
                    placeholder="Prioridade"
                  />
                </div>
              </div>

              <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => { setTitulo(e.target.value) }}
                className="w-full resize-none text-gray-600 bg-white placeholder-gray-400 text-base rounded-xl border border-[#D4A017] px-4 py-3 mb-3 
                  focus:outline-none focus:[box-shadow:0_0_20px_6px_rgba(171,129,18,0.25)]    transition-all duration-300"
              />

              <textarea
                placeholder="Descreva seu problema"
                className="w-full h-40 resize-none text-gray-600 bg-white placeholder-gray-400 text-base rounded-xl border border-[#D4A017] px-4 py-3 mb-3 
                  focus:outline-none focus:[box-shadow:0_0_20px_6px_rgba(171,129,18,0.25)]    transition-all duration-300"
                value={tiket}
                onChange={(e) => setTiket(e.target.value)}
              />

              {
                loading ? (
                  <button
                    disabled
                    className="w-full h-12 text-white bg-[#D4A017] opacity-75 rounded-full font-medium"
                  >
                    Enviando...
                  </button>
                ) :
                  (!titulo || !tiket || !categoria || !prioridade ? (
                    <button
                      disabled
                      className="w-full h-12 text-white bg-[#D4A017] opacity-75 rounded-full font-medium"
                    >
                      Preencha todos os campos
                    </button>
                  ) : (
                    <button
                      onClick={enviar}
                      className="w-full h-12 text-white bg-[#D4A017] cursor-pointer rounded-full font-medium hover:bg-[#ab8112] transition-all duration-300"
                    >
                      Enviar Chamado
                    </button>
                  ))
              }

            </div>

            <div className="h-[490px] flex items-center justify-center bg-[url('/chamado/fundoForm.png')] bg-cover bg-center rounded-xl p-6 pl-9 pr-9 mb-20">
              <div className="w-full max-w-sm bg-[#fcf9f7] shadow-xl rounded-2xl p-7 border border-[#e7e2df]">
                <h3 className="text-2xl font-semibold text-[#D4A017] mb-3 text-center leading-tight">
                  Precisa de ajuda?
                </h3>

                <p className="text-[#D4A017] text-sm font-medium text-center mb-4">
                  Estamos aqui para resolver sua demanda.
                </p>

                <p className="text-[#4b4b4b] text-[15px] leading-6 text-center">
                  Se você encontrou algum problema no sistema, basta preencher o
                  formulário ao lado para abrir um chamado.
                </p>

                <p className="text-[#4b4b4b] text-[15px] leading-6 text-center mt-3">
                  Nossa equipe retornará com uma atualização
                  <span className="font-semibold"> em até 1 dia útil.</span>
                </p>

                <div className="mt-6 pt-4 border-t border-[#ded8d5] space-y-3">
                  <div className="flex items-center text-[#D4A017]">
                    <Mail className="w-5 h-5 mr-3" />
                    <span className="text-sm break-words max-[475px]:text-sm max-[475px]:break-all">
                      central.de.suporte@musichouse.br
                    </span>
                  </div>

                  <div className="flex items-center text-[#D4A017]">
                    <Phone className="w-5 h-5 mr-3" />
                    <span className="text-sm">(11) 99930-0806</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
