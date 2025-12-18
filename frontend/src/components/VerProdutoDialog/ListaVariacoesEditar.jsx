import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { HexColorInput } from 'react-colorful';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';


export default function ListaVariacoes({ produtoId, page, setPage }) {
  const [variacoes, setVariacoes] = useState([]);
  const [variacao, setVariacao] = useState(null);
  const [desc, setDesc] = useState(true);

  const [preco, setPreco] = useState(0);
  const [custo, setCusto] = useState(0);
  const [desconto, setDesconto] = useState('');
  const [nomeCor, setNomeCor] = useState('');

  const [cor, setCor] = useState('#ffffff');
  const [imagemVariacao, setImagemVariacao] = useState(null);
  const [enviando, setEnviando] = useState(false);


  const cssButton = 'bg-[var(--azul-marinho)] hover:bg-[var(--azul-marinho)]';

  async function pegarVariacoes() {
    try {
      const response = await fetch(
        `http://localhost:8080/produtos/variacao/${produtoId}`
      );
      const data = await response.json();
      if (response.ok) {
        setVariacoes(data);
      } else {
        alert('Erro');
      }
    } catch (error) {
      console.error('Erro ao buscar variacoes por id produto:', error);
    }
  }

  function formatarMoedaBR(valor) {
    if (!valor) return '';
    valor = valor.replace(/\D/g, '');
    let numero = (parseInt(valor, 10) / 100).toFixed(2);
    numero = numero.replace('.', ',');
    numero = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return numero;
  }

  useEffect(() => {
    if (variacao) {
      setPreco(variacao.valor);
      setCusto(variacao.custo_producao);
      setDesconto(variacao.desconto);
      setNomeCor(variacao.nome_cor);
      setCor(variacao.cor);
    }
  }, [variacao]);

  async function obterDadosVariacaoPorId(id) {
    try {
      const response = await fetch(
        `http://localhost:8080/produtos/variacao/detalhe/${id}`
      );
      const data = await response.json();
      if (response.ok) {
        setVariacao(data);
        setImagemVariacao(null);
      } else {
        alert('Erro');
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  }

  async function salvarVariacao() {
    try {
      setEnviando(true);
      const precoLimpo = preco.toString().replace(/\D/g, '');
      const precoFinal = precoLimpo.replace(/(\d+)(\d{2})$/, '$1.$2');
      const custoLimpo = custo.toString().replace(/\D/g, '');
      const custoFinal = custoLimpo.replace(/(\d+)(\d{2})$/, '$1.$2');

      const formData = new FormData();

      formData.append('valor', precoFinal);
      formData.append('custo_producao', custoFinal);

      if (desc && desconto !== null && desconto !== undefined && desconto !== '') {
        formData.append('desconto', desconto);
      } else if (desc && desconto === '') {
        formData.append('desconto', '');
      } else if (!desc) {
        formData.append('desconto', '0');
      }

      formData.append('nome_cor', nomeCor);
      formData.append('cor', cor);

      if (imagemVariacao && imagemVariacao.length > 0) {
        for (let i = 0; i < imagemVariacao.length; i++) {
          formData.append('imagem', imagemVariacao[i]);
        }
      }

      const response = await fetch(
        `http://localhost:8080/produtos/variacao/${variacao.id_variacao}`,
        {
          method: 'PUT',
          cache: 'no-store',
          credentials: 'include',
          body: formData,
        }
      );

      if (response.ok) {
        setPage(page - 1);
      } else {
        alert('Erro ao salvar variação');
      }
    } catch (error) {
      console.error('Erro ao editar variação:', error);
    } finally {
      setEnviando(false);
    }
  }
  useEffect(() => {
    pegarVariacoes();
  }, [produtoId, page]);

  const listCss = 'cursor-pointer underline';
  const cssInput =
    'border-2 border-[#d9d9db] focus:ring-transparent focus-visible:ring-transparent focus:outline-none focus-visible:outline-none rounded-[15px] py-[5px] px-3';

  return (
    <>
      {page === 4 ? (
        <>
          <div className="flex flex-col gap-y-10">
            {variacoes.length > 0 ? (
              variacoes.map((cada, index) => (
                <div key={index}>
                  <p
                    onClick={() => {
                      obterDadosVariacaoPorId(cada.id_variacao);
                      setPage(5);
                    }}
                    className={listCss}
                  >
                    -{''}
                    {cada.nome_cor
                      .toLowerCase()
                      .replace(/\b\w/g, (letra) => letra.toUpperCase())}
                  </p>
                </div>
              ))
            ) : (
              <>
                <h1>
                  Ainda não existem variações criadas para este produto. Você
                  pode adicionar as primeiras.
                </h1>
                <div className="flex justify-center items-center mb-7">
                  <img src="/matriz/semVariacao.png" alt="" className="w-60" />
                </div>
              </>
            )}
          </div>
        </>
      ) : page === 5 ? (
        variacao && (
          <>
            <div className="flex gap-3 flex-col w-full mb-3">
              <div className="flex w-full gap-3">
                <div className="flex flex-col w-1/2">
                  <label className="mb-1">Preço:</label>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                      R$
                    </span>
                    <input
                      type="text"
                      className={`${cssInput} w-full pl-10`}
                      value={formatarMoedaBR(preco)}
                      onChange={(e) => setPreco(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col w-1/2">
                  <label className="mb-1">Custo de Produção:</label>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                      R$
                    </span>
                    <input
                      type="text"
                      className={`${cssInput} w-full pl-10`}
                      value={formatarMoedaBR(custo)}
                      onChange={(e) => setCusto(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>


            <div className="flex flex-col w-full mt-4 mb-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="subscribe"
                  className="border-2 border-gray shadow data-[state=checked]:bg-[var(--azul-marinho)] data-[state=checked]:text-white data-[state=checked]:border-[var(--azul-marinho)]"
                  checked={desc}
                  onCheckedChange={setDesc}
                />
                <span>Desconto{desc === false ? ' ?' : ':'}</span>
              </div>
              {desc && (
                <div className="flex flex-col mt-3">
                  <input
                    type="text"
                    className={`${cssInput} w-full`}
                    value={desconto}
                    onChange={(e) => setDesconto(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 flex-col w-full">
              <div className="flex gap-3 w-full">
                <div className="flex flex-col w-1/2">
                  <label>Escreva o Hex *:</label>
                  <HexColorInput
                    color={cor}
                    onChange={setCor}
                    className={`${cssInput} w-full`}
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label>Nome da cor *:</label>
                  <input
                    type="text"
                    className={`${cssInput} w-full`}
                    value={nomeCor}
                    onChange={(e) => setNomeCor(e.target.value)}
                  />
                </div>
              </div>


              <div className="flex flex-col mt-4">
                <label className="mb-1">Imagens da Variação (Opcional):</label>
                <input
                  type="file"
                  multiple
                  className={cssInput}
                  onChange={(e) => setImagemVariacao(e.target.files)}
                />
              </div>

            </div>




            <DialogFooter className="mt-5">
              <Button className={cssButton} onClick={() => setPage(page - 1)}>
                Voltar
              </Button>

              {enviando ? (
                <Button
                  className={`${cssButton} w-auto flex justify-between`}
                  disabled
                  type="button"
                >
                  <Spinner className="size-4" />
                  Salvando...
                </Button>
              ) : (
                <Button
                  className={`${cssButton} w-auto flex justify-center`}
                  type="button"
                  onClick={() => {
                    salvarVariacao();
                  }}
                  disabled={!preco || !custo || !nomeCor || !cor}
                >
                  {!preco || !custo || !nomeCor || !cor
                    ? 'Preencha todos *'
                    : 'Salvar'}
                </Button>
              )}
            </DialogFooter>
          </>
        )
      ) : (
        ''
      )}
    </>
  );
}