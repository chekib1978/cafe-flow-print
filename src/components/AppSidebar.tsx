
import { Coffee, ShoppingCart, Package, BarChart3, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Vente",
    url: "/",
    icon: ShoppingCart,
  },
  {
    title: "Produits",
    url: "/products",
    icon: Package,
  },
  {
    title: "Statistiques",
    url: "/stats",
    icon: BarChart3,
  },
  {
    title: "Paramètres",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border/50">
      <SidebarContent className="bg-gradient-to-b from-blue-50 to-green-50">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-6 text-lg font-bold text-gray-800 flex items-center gap-2">
            <Coffee className="w-6 h-6 text-blue-600" />
            Cafétéria Pro
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="hover:bg-white/60 transition-all duration-200 rounded-lg mx-2 mb-1"
                  >
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
