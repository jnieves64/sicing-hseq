'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const ADMIN_LINKS = [
  { label: "Gestión de usuarios", href: "/admin/usuarios", enabled: true },
  { label: "Gestión de documentos", href: "/admin/documentos", enabled: false },
];

export default function AdminSidebar() {

  const pathname = usePathname();
  const { profile } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full p-6 flex flex-col justify-between overflow-y-auto">

      <div>
        <nav className="flex flex-col gap-1">
          {ADMIN_LINKS.map((link) => {

            const active = pathname === link.href;

            if (!link.enabled) {
              return (
                <span
                  key={link.href}
                  className="
                    px-4 py-2 rounded-lg text-sm font-medium
                    text-gray-400 cursor-not-allowed
                  "
                  title="Próximamente"
                >
                  {link.label}
                </span>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? "bg-[#ebbb18]/20 text-black"
                    : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                {link.label}
              </Link>
            );

          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm font-medium text-gray-900">{profile?.nombre}</p>
        <p className="text-xs text-gray-500">{profile?.rol?.nombre}</p>
      </div>

    </aside>
  );
}