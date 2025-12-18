import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { getCookie } from 'cookies-next';

export default function FecharCaixa({ numFuncionario }) {
  const [id_registro, setRegistro] = useState();
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setRegistro(numFuncionario);
  }, [numFuncionario]);

  async function verificarUsuario() {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id_registro, senha }),
      });

      console.log({ id_registro, senha });
      const data = await response.json();

      const cookie = getCookie('token');
      if (response.ok) {
        await fetch('http://localhost:8080/caixas/fechar', {
          method: 'PUT',
          headers: {
            cookie: cookie,
          },
          credentials: 'include',
        });

        await fetch('http://localhost:8080/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        router.replace('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Erro ao enviar informações de login:', error);
    }
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="bg-[var(--vermelho-vivo)] w-full hover:bg-[var(--vermelho-vivo)] hover:opacity-[0.9] cursor-pointer text-white text-base sm:text-md font-semibold rounded-[15px] py-5 transition-all">
            FECHAR CAIXA
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-3xl">Fechar o caixa</DialogTitle>
            <DialogDescription className="">
              Digite suas informações para fechar o caixa
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <label>Número de registro:</label>
              <input
                value={numFuncionario}
                className="rounded-[15px] border-1 p-2 pl-4"
                disabled
                onChange={(e) => setRegistro(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <label>Senha: </label>
              <input
                type="password"
                className="rounded-[15px] border-1 p-2 pl-4 focus:"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {error && (
                <p className="text-[var(--vermelho-vivo)] -mt-2 pl-1 text-sm">
                  * {error}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                verificarUsuario();
              }}
              className="bg-[var(--vermelho-vivo)] rounded-[15px] w-full text-white h-10 hover:bg-[#CCc1121] cursor-pointer"
            >
              Confirmar Fechamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
