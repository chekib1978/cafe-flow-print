
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
import { Link } from "react-router-dom";

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
          <SidebarGroupLabel className="px-2 sm:px-4 py-4 sm:py-6 text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
            <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span className="hidden sm:inline">Café Pro</span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-1 sm:px-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="hover:bg-white/60 transition-all duration-200 rounded-lg mx-1 sm:mx-2 mb-1 touch-manipulation min-h-[44px]"
                  >
                    <Link to={item.url} className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base hidden sm:inline">{item.title}</span>
                    </Link>
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
