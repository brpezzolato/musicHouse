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
import SkeletonNav from './Skeleton/Nav';

export function AppSidebar({ ...props }) {
  const [navBar, setNavBar] = useState([]);
  const [loading, setLoading] = useState(true);

  async function caregarItens() {
    try {
      const response = await fetch('http://localhost:8080/navbar');

      if (response.ok) {
        const data = await response.json();
        const icones = data.map((item, index) => ({
          ...item,
          icon: Icons[item.icon] || Icons.Circle,
          isActive: index === 0,
        }));
        setNavBar(icones);
        setLoading(false);
      } else {
        console.log('Erro ao carregar categorias');
      }
    } catch (error) {
      console.log('Erro ao carregar categorias:', error);
    }
  }

  useEffect(() => {
    caregarItens();
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
    navMain: navBar,
  };

  return (
    <>
      {loading === true ? (
        <>
          <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
              <TeamSwitcher teams={data.teams} />
            </SidebarHeader>

            <SkeletonNav />

            <SidebarRail />
          </Sidebar>
        </>
      ) : (
        <Sidebar collapsible="icon" {...props}>
          <SidebarHeader>
            <TeamSwitcher teams={data.teams} />
          </SidebarHeader>

          <SidebarContent>
            <NavMain items={data.navMain} />
          </SidebarContent>

          <SidebarRail />
        </Sidebar>
      )}
    </>
  );
}
