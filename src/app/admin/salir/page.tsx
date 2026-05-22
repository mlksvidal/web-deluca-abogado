import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";

export const metadata: Metadata = {
  title: "Cerrar sesión — Admin",
  robots: { index: false, follow: false },
};

/**
 * Página de logout para Basic Auth.
 *
 * Basic Auth no tiene un mecanismo de logout estándar — el navegador
 * mantiene las credenciales mientras la pestaña esté abierta.
 * La única forma de "cerrar sesión" es cerrar la pestaña/ventana
 * o usar un truco de credencial inválida (que puede dar UX inconsistente).
 *
 * Instrucción: el usuario debe cerrar la pestaña del navegador.
 */
export default function AdminSalirPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
        style={{ background: "var(--color-marino-subtle)" }}
        aria-hidden="true"
      >
        <LogOut size={24} className="text-marino" />
      </div>

      <h1 className="font-serif text-2xl font-semibold text-marino mb-3">Para cerrar sesión</h1>

      <p className="font-body text-base text-carbon-soft max-w-sm mb-2">
        El acceso administrativo utiliza autenticación básica del navegador.
      </p>

      <p className="font-body text-base text-text-secondary max-w-sm mb-8">
        Para finalizar la sesión completamente,{" "}
        <strong className="text-marino">cerrá esta pestaña del navegador</strong>. El navegador
        olvidará las credenciales al cerrar la pestaña o ventana.
      </p>

      <div
        className="rounded-[8px] border px-5 py-4 max-w-sm text-left mb-8"
        style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg)" }}
      >
        <p className="font-ui text-xs font-semibold text-marino uppercase tracking-wide mb-2">
          Alternativa (Chrome / Firefox / Edge)
        </p>
        <ol className="list-decimal list-inside space-y-1">
          {[
            "Menú → Configuración → Privacidad y seguridad",
            "Borrar datos de navegación",
            'Seleccionar "Contraseñas y otros datos de inicio de sesión"',
            "Confirmar borrado",
          ].map((step, i) => (
            <li key={i} className="font-body text-xs text-carbon-soft">
              {step}
            </li>
          ))}
        </ol>
      </div>

      <Link
        href="/"
        className="font-ui text-sm font-medium text-marino underline underline-offset-2 hover:text-dorado-deep transition-colors"
      >
        Volver al sitio público
      </Link>
    </div>
  );
}
