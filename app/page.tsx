"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import PageHeader from "./components/PageHeader";
import PageMain from "./components/PageMain";

export default function Home() {
  const { status, data: session } = useSession();

  if (status === "authenticated") {
    const fullName = session.user?.name?.split(" ");
    const firstName = fullName[0];

    return (
      <>
        <PageHeader>Olá, {firstName}!</PageHeader>
        <PageMain>Main content</PageMain>
      </>
    );
  } else {
    return (
      <>
        <PageHeader>
          <div className="flex w-full align-middle justify-center text-center">
            Seja bem-vindo(a)!
          </div>
        </PageHeader>
        <PageMain>
          <div className="flex flex-col text-center align-middle justify-center">
            <p>
              Esse é o Artist Scheduler. Clique no botão abaixo para fazer
              login.{" "}
            </p>
            <Link
              href="/api/auth/signin"
              className="bg-violet-600 text-white mt-6 rounded-md py-4"
            >
              Entrar
            </Link>
          </div>
        </PageMain>
      </>
    );
  }
}
