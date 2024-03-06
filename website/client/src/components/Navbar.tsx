"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const Navbar = () => {
    const pathname = usePathname();

    return (
        <div className='p-2'>
            <nav className="w-full bg-gray-800 p-2 rounded-md border border-gray-500 ">
                <div className="container mx-auto">
                    <ul className="flex justify-center items-center space-x-4 pt-0.5">
                        <li>
                            <Link href="/">
                                <div className={clsx(
                                    "font-bold text-white hover:text-gray-300 border-b-4 hover:border-gray-500",
                                    {
                                        "border-gray-500 text-gray-300": pathname === "/",
                                        "border-transparent": pathname !== "/",
                                    }
                                )}
                                > Home </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/geomap">
                                <div className={clsx(
                                    "font-bold text-white hover:text-gray-300 border-b-4 hover:border-gray-500",
                                    {
                                        "border-gray-500 text-gray-300": pathname === "/geomap",
                                        "border-transparent": pathname !== "/geomap",
                                    }
                                )}> GeoMap </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/charts">
                                <div className={clsx(
                                    "font-bold text-white hover:text-gray-300 border-b-4 hover:border-gray-500",
                                    {
                                        "border-gray-500 text-gray-300": pathname === "/charts",
                                        "border-transparent": pathname !== "/charts",
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