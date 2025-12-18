// "use client";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// // Importando os componentes de gráficos de área da ShadCN.
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "@shadcn/ui/charts";

// export default function RelatorioPage() {
//   const vendasDiarias = [
//     { dia: "01", vendas: 1200 },
//     { dia: "02", vendas: 1500 },
//     { dia: "03", vendas: 1000 },
//     { dia: "04", vendas: 1700 },
//     { dia: "05", vendas: 1400 },
//     { dia: "06", vendas: 1900 },
//     { dia: "07", vendas: 2200 },
//   ];

//   const produtosMaisVendidos = [
//     { nome: "Produto 1", vendas: 400 },
//     { nome: "Produto 2", vendas: 350 },
//     { nome: "Produto 3", vendas: 300 },
//     { nome: "Produto 4", vendas: 280 },
//     { nome: "Produto 5", vendas: 260 },
//   ];

//   const coresPizza = [
//     "#131312",
//     "#780000",
//     "#C1121F",
//     "#003049",
//     "#669BBC",
//     "#FDF0D5",
//     "#FCF9F7",
//     "#22C55E",
//     "#F59E0B",
//     "#EF4444",
//   ];

//   const lucroData = [
//     { periodo: "Dia", valor: 1500 },
//     { periodo: "Semana", valor: 10000 },
//     { periodo: "Mês", valor: 42000 },
//   ];

//   const estoqueCritico = [
//     { produto: "Produto A", estoque: 3 },
//     { produto: "Produto B", estoque: 2 },
//     { produto: "Produto C", estoque: 5 },
//     { produto: "Produto D", estoque: 1 },
//     { produto: "Produto E", estoque: 4 },
//   ];

//   const comparacaoSemanas = [
//     { dia: "Seg", semanaAtual: 1200, semanaAnterior: 1100 },
//     { dia: "Ter", semanaAtual: 1500, semanaAnterior: 1300 },
//     { dia: "Qua", semanaAtual: 1000, semanaAnterior: 900 },
//     { dia: "Qui", semanaAtual: 1700, semanaAnterior: 1600 },
//     { dia: "Sex", semanaAtual: 1400, semanaAnterior: 1200 },
//     { dia: "Sáb", semanaAtual: 1900, semanaAnterior: 1800 },
//     { dia: "Dom", semanaAtual: 2200, semanaAnterior: 2000 },
//   ];

//   return (
//     <div className="p-6 max-w-[1024px] mx-auto space-y-8">
//       <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
//         RELATÓRIO DA FILIAL (Gerente)
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
//         {/* 1. Vendas Diárias */}
//         <Card className="flex flex-col">
//           <CardHeader>
//             <CardTitle className="text-lg">1. Vendas Diárias da Filial</CardTitle>
//             <p className="text-xs text-muted-foreground mt-0.5">
//               Perfeito para acompanhar crescimento.
//             </p>
//           </CardHeader>
//           <CardContent className="flex-grow">
//             <ResponsiveContainer width="100%" height={110}>
//               <AreaChart data={vendasDiarias}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="dia" />
//                 <YAxis />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="vendas"
//                   stroke="#003049"
//                   fill="#003049"
//                   strokeWidth={2}
//                   dot={{ r: 3 }}
//                   activeDot={{ r: 5 }}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* 2. Produtos Mais Vendidos */}
//         <Card className="flex flex-col">
//           <CardHeader>
//             <CardTitle className="text-lg">2. Produtos Mais Vendidos na Filial</CardTitle>
//             <p className="text-xs text-muted-foreground mt-0.5">Top 10 do mês.</p>
//           </CardHeader>

//           <CardContent className="flex-grow flex flex-col items-center">
//             <ResponsiveContainer width="100%" height={110}>
//               <PieChart>
//                 <Pie
//                   data={produtosMaisVendidos}
//                   dataKey="vendas"
//                   nameKey="nome"
//                   outerRadius={45}
//                   innerRadius={22}
//                   paddingAngle={3}
//                   cornerRadius={6}
//                 >
//                   {produtosMaisVendidos.map((entry, index) => (
//                     <Cell
//                       key={index}
//                       fill={coresPizza[index % coresPizza.length]}
//                       stroke="#fff"
//                       strokeWidth={1.5}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>

//             {/* Legenda */}
//             <div className="flex flex-wrap justify-center gap-2 mt-2 max-w-[280px]">
//               {produtosMaisVendidos.map((produto, index) => (
//                 <div key={index} className="flex items-center space-x-1 text-xs select-none">
//                   <span
//                     className="w-3 h-3 rounded-full"
//                     style={{ backgroundColor: coresPizza[index % coresPizza.length] }}
//                   />
//                   <span className="whitespace-nowrap">{produto.nome}</span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* 3. Lucro da Filial */}
//         <Card className="flex flex-col">
//           <CardHeader>
//             <CardTitle className="text-lg">3. Lucro da Filial</CardTitle>
//             <p className="text-xs text-muted-foreground mt-0.5">Dia, semana e mês.</p>
//           </CardHeader>

//           <CardContent className="flex-grow">
//             <ResponsiveContainer width="100%" height={110}>
//               <AreaChart data={lucroData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="periodo" />
//                 <YAxis />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="valor"
//                   stroke="#669BBC"
//                   fill="#669BBC"
//                   strokeWidth={2}
//                   dot={{ r: 3 }}
//                   activeDot={{ r: 5 }}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* 4. Estoque Crítico */}
//         <Card className="flex flex-col">
//           <CardHeader>
//             <CardTitle className="text-lg">4. Estoque Local (Produtos Críticos)</CardTitle>
//             <p className="text-xs text-muted-foreground mt-0.5">
//               Apenas produtos com estoque baixo.
//             </p>
//           </CardHeader>

//           <CardContent className="flex-grow">
//             <ResponsiveContainer width="100%" height={110}>
//               <AreaChart data={estoqueCritico}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="produto" />
//                 <YAxis />
//                 <Tooltip />
//                 <Area
//                   dataKey="estoque"
//                   stroke="#C1121F"
//                   fill="#C1121F"
//                   strokeWidth={2}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* 5. Semana a Semana */}
//       <Card className="flex flex-col">
//         <CardHeader>
//           <CardTitle className="text-lg">5. Comparação Semana a Semana</CardTitle>
//           <p className="text-xs text-muted-foreground mt-0.5">
//             A semana atual vs semana anterior.
//           </p>
//         </CardHeader>

//         <CardContent className="flex-grow">
//           <ResponsiveContainer width="100%" height={200}>
//             <AreaChart data={comparacaoSemanas}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="dia" />
//               <YAxis />
//               <Tooltip />
//               <Legend verticalAlign="top" height={24} />
//               <Area
//                 type="monotone"
//                 dataKey="semanaAtual"
//                 stroke="#22C55E"
//                 fill="#22C55E"
//                 strokeWidth={2}
//                 dot={{ r: 3 }}
//                 activeDot={{ r: 5 }}
//                 name="Semana Atual"
//               />
//               <Area
//                 type="monotone"
//                 dataKey="semanaAnterior"
//                 stroke="#C1121F"
//                 fill="#C112
