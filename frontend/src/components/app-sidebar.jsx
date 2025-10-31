'use client';

import * as Icons from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { TeamSwitcher } from '@/components/team-switcher';
import { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

export function AppSidebar({ ...props }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function loadCategorias() {
      const res = await fetch('http://localhost:8080/categorias/produtos');
      const data = await res.json();
      setCategorias(data);
    }
    loadCategorias();
  }, []);

  const data = {
    teams: [
      {
        name: 'Music House',
        logo: () => (
          <div className="h-10 w-10 aspect-square shrink-0 rounded-full overflow-hidden border border-[#FDF0D5] bg-[#780000] shadow-sm flex-none">
            <img
              src="/catalogo/logoPrincipal.png"
              alt="Logo Music House"
              className="block h-full w-full object-cover"
              draggable={false}
            />
          </div>
        ),
        plan: 'catálogo',
      },
    ],
    navMain: categorias.map((cat) => ({
      title: cat.nome,
      url: `catalogo/categoria/${cat.id}`,
      icon: Icons[cat.iconeSite],
      items: (cat.produtos || []).map((prod) => ({
        title: prod.nome,
        url: `catalogo/produto/${prod.id}`,
      })),
    })),
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}