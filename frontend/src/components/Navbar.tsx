'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiLogIn, FiInfo, FiMail, FiUser } from 'react-icons/fi';
import SmartSearch from './SmartSearch';
import { mockProfessionals } from '@/data/mockProfessionals';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const isSearchPage = pathname.startsWith('/search');
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-30">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16 gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600 shrink-0">
                        <FiGrid size={28} className="text-blue-600" />
                        Obralia
                    </Link>

                    {/* Search Bar - Only visible on search page */}
                    {isSearchPage && (
                        <div className="flex-1 max-w-2xl">
                            <SmartSearch professionals={mockProfessionals} variant="compact" />
                        </div>
                    )}

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {!isSearchPage && (
                            <>
                                <Link
                                    href="como-funciona"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                                >
                                    <FiInfo size={18} />
                                    <span>Cómo funciona</span>
                                </Link>
                                <Link
                                    href="contacto"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                                >
                                    <FiMail size={18} />
                                    <span>Contacto</span>
                                </Link>
                            </>
                        )}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700">
                                    {user.firstName} {user.lastName}
                                </span>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                                >
                                    <FiUser size={18} />
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors font-semibold"
                            >
                                <FiLogIn size={18} />
                                <span className="hidden sm:inline">Iniciar Sesión</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-blue-50"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Abrir menú"
                    >
                        <svg
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 animate-fade-in">
                        <div className="flex flex-col space-y-2">
                            {!isSearchPage && (
                                <>
                                    <Link
                                        href="#como-funciona"
                                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FiInfo size={18} />
                                        Cómo funciona
                                    </Link>
                                    <Link
                                        href="#contacto"
                                        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 text-gray-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors font-semibold"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FiMail size={18} />
                                        Contacto
                                    </Link>
                                </>
                            )}
                            {user ? (
                                <div className="flex flex-col space-y-2">
                                    <span className="px-4 py-2 text-gray-700">
                                        {user.firstName} {user.lastName}
                                    </span>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                                    >
                                        <FiUser size={18} />
                                        Cerrar sesión
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-4 py-3 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors font-semibold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <FiLogIn size={18} />
                                    Iniciar Sesión
                                </Link>
                            )}
                            {isSearchPage && (
                                <div className="mt-4 px-2">
                                    <SmartSearch professionals={mockProfessionals} variant="compact" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
} 