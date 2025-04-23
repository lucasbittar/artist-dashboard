"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import classnames from "classnames";
import { useSession, SessionProvider } from "next-auth/react";

import { PiMoonStars } from "react-icons/pi";
import { HiMenu } from "react-icons/hi";
import { RiCloseFill } from "react-icons/ri";

const NavBar = () => {
  const navItems = [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Agendamentos",
      href: "/appointments",
    },
    {
      label: "Estabelecimentos",
      href: "/places",
    },
  ];

  const currentPath = usePathname();
  const { status, data: session } = useSession();

  // console.log("SESSION", session);

  const [mobileNavState, setMobileNavState] = useState(false);
  const [dropdownNavState, setDropdownNavState] = useState(false);

  return (
    <SessionProvider>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PiMoonStars className="text-3xl text-violet-400" />
              </div>
              {status === "authenticated" && (
                <div className="hidden md:block">
                  <ul className="ml-10 flex items-baseline space-x-4">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={classnames({
                            "bg-gray-900 text-white": currentPath.includes(
                              item.href
                            ),
                            "text-gray-300 hover:bg-gray-700 hover:text-white":
                              !currentPath.includes(item.href),
                            "rounded-md px-3 py-2 text-sm font-medium": true,
                          })}
                          aria-current="page"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {status === "authenticated" && (
              <>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <div className="relative ml-3">
                      <div>
                        <button
                          type="button"
                          className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                          onClick={() => setDropdownNavState(!dropdownNavState)}
                          id="user-menu-button"
                          aria-expanded="false"
                          aria-haspopup="true"
                        >
                          <span className="absolute -inset-1.5"></span>
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={session.user?.image}
                            alt=""
                          />
                        </button>
                      </div>

                      <div
                        style={{ display: dropdownNavState ? "block" : "none" }}
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        {status === "authenticated" && (
                          <Link
                            href="/api/auth/signout"
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            Sair
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <button
                    type="button"
                    className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    aria-controls="mobile-menu"
                    onClick={() => setMobileNavState(!mobileNavState)}
                    aria-expanded="false"
                  >
                    <span className="absolute -inset-0.5"></span>
                    <span className="sr-only">Open main menu</span>
                    {!mobileNavState && <HiMenu className="text-xl" />}
                    {mobileNavState && <RiCloseFill className="text-xl" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          className="md:hidden"
          style={{ display: mobileNavState ? "block" : "none" }}
          id="mobile-menu"
        >
          <ul className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={classnames({
                    "bg-gray-900 text-white": currentPath.includes(item.href),
                    "text-gray-300 hover:bg-gray-700 hover:text-white":
                      !currentPath.includes(item.href),
                    "block rounded-md px-3 py-2 text-base font-medium": true,
                  })}
                  aria-current="page"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-700 pb-3 pt-4">
            {status === "authenticated" && (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={session.user?.image!}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {session.user?.name}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-400">
                    {session.user?.email}
                  </div>
                </div>
              </div>
            )}
            <div className="mt-3 space-y-1 px-2">
              {status === "authenticated" && (
                <Link
                  href="/api/auth/signout"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  Sair
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </SessionProvider>
  );
};

export default NavBar;
