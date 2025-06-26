'use client'//When you add "use client" at the top of a file, it tells Next.js to treat that file/component as a client-side component, meaning it will run entirely on the browser.

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
