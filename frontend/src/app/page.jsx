import FormLogin from "@/components/formLogin/formLogin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
  const cookiesList = cookies();

  // Faz a requisição para verificar o usuário autenticado
  const requestUser = await fetch("http://localhost:8080/auth/auth-check", {
    method:'POST',
    headers: {
      cookie: cookiesList.toString(),
    },
    cache: "no-store",
    credentials: "include",
  });

  const user =  await requestUser.json();
  console.log(user)

  // // Se a resposta for OK, extrai o JSON
  // if (requestUser.ok) {
  //   const user = await requestUser.json();
  //   console.log(user)
    
  //   // Verifica o nível de credencial do usuário
  //   if (user.credencial === 1) {
  //     return redirect("/matriz");
  //   } else if (user.credencial === 2) {
  //     return redirect("/afilial");
  //   } else if(user.credencial ===3) {
  //     return redirect("/pdv");
  //   }
  // }

  // Se não estiver autenticado, exibe o formulário de login
  return <FormLogin />;
}
