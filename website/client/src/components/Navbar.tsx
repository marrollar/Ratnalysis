"use client";

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Router } from "next/router";
import { useEffect, useState } from "react";

const Navbar = () => {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const [whichIsLoading, setWhichIsLoading] = useState("/")

    // TODO: no effect
    useEffect(() => {
        const handleRouteChangeStart = () => {
            console.log("changing")
            setLoading(true)
        };
        const handleRouteChangeComplete = () => {
            console.log("finished changing")
            setLoading(false)
        };

        Router.events.on("routeChangeStart", handleRouteChangeStart);
        Router.events.on("routeChangeComplete", handleRouteChangeComplete);

        return () => {
            Router.events.off("routeChangeStart", handleRouteChangeStart);
            Router.events.off("routeChangeComplete", handleRouteChangeComplete);
        };
    }, []);

    const handleLinkClick = (e: React.MouseEvent, path: string) => {
        setWhichIsLoading(path)
    }

    return (
        <div className='flex w-full'>
            <nav className="w-full bg-gray-800 p-2 border border-gray-500 ">
                <div className="container mx-auto">
                    <ul className="flex justify-center items-center space-x-4 pt-0.5">
                        <li>
                            <Link href="/" onClick={(e) => handleLinkClick(e, "/")}>
                                <div className={clsx(
                                    "font-bold text-white hover:text-gray-300 border-b-4 hover:border-gray-500",
                                    {
                                        "border-gray-500 text-gray-300": pathname === "/",
                                        "border-transparent": pathname !== "/",
                                        // "border-red-500 text-red-500": (whichIsLoading === "/" && pathname !== "/")
                                    }
                                )}
                                > Home </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/geomap" onClick={(e) => handleLinkClick(e, "/geomap")}>
                                <div className={clsx(
                                    "font-bold text-white hover:text-gray-300 border-b-4 hover:border-gray-500",
                                    {
                                        "border-gray-500 text-gray-300": pathname === "/geomap",
                                        "border-transparent": pathname !== "/geomap",
                                        // "border-red-500 text-red-500": (whichIsLoading === "/geomap" && pathname !== "/geomap")
                                    }
                                )}> GeoMap </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/charts" onClick={(e) => handleLinkClick(e, "/charts")}>
                                <div className={clsx(
                                    "font-bold text-white hover:text-gray-300 border-b-4 hover:border-gray-500",
                                    {
                                        "border-gray-500 text-gray-300": pathname === "/charts",
                                        "border-transparent": pathname !== "/charts",
                                        // "border-red-500 text-red-500": (whichIsLoading === "/charts" && pathname !== "/charts")
                                    }
                                )}> Charts</div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;