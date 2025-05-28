'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiLogIn, FiInfo, FiMail, FiUser, FiChevronDown, FiSettings, FiLogOut, FiHome } from 'react-icons/fi';
import SmartSearch from './SmartSearch';
import { mockProfessionals } from '@/data/mockProfessionals';
import { useAuth } from '../contexts/AuthContext';

function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ("00" + value.toString(16)).slice(-2);
    }
    return color;
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isSearchPage = pathname.startsWith('/search');
    const { user, logout } = useAuth();

    // Cerrar el dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

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
                                    href="/como-funciona"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                                >
                                    <FiInfo size={18} />
                                    <span>Cómo funciona</span>
                                </Link>
                                <Link
                                    href="/contacto"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                                >
                                    <FiMail size={18} />
                                    <span>Contacto</span>
                                </Link>
                            </>
                        )}
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    onClick={() => setIsDropdownOpen((v) => !v)}
                                    aria-label="Abrir menú de usuario"
                                >
                                    {user.profilePictureUrl ? (
                                        <img
                                            src={user.profilePictureUrl}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-blue-200"
                                        />
                                    ) : (
                                        <span
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                            style={{ background: stringToColor(user.name) }}
                                        >
                                            {user.name[0].toUpperCase()}
                                        </span>
                                    )}
                                    <span className="font-semibold text-gray-700 max-w-[120px] truncate">
                                        {user.name}
                                    </span>
                                    <FiChevronDown className={`ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border animate-fade-in">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-gray-700 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <FiUser /> Mi perfil
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-gray-700 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <FiHome /> Dashboard
                                        </Link>
                                        <Link
                                            href="/configuracion"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-gray-700 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <FiSettings /> Configuración
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-red-50 text-red-600 transition-colors"
                                        >
                                            <FiLogOut /> Cerrar sesión
                                        </button>
                                    </div>
                                )}
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
                                        href="/como-funciona"
                                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FiInfo size={18} /> Cómo funciona
                                    </Link>
                                    <Link
                                        href="/contacto"
                                        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 text-gray-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors font-semibold"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FiMail size={18} /> Contacto
                                    </Link>
                                </>
                            )}
                            {user ? (
                                <div className="flex flex-col space-y-2">
                                    <button
                                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors font-semibold"
                                        onClick={() => {
                                            setIsDropdownOpen((v) => !v);
                                        }}
                                    >
                                        {user.profilePictureUrl ? (
                                            <img
                                                src={user.profilePictureUrl}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full object-cover border-2 border-blue-200"
                                            />
                                        ) : (
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                                style={{ background: stringToColor(user.name) }}
                                            >
                                                {user.name[0].toUpperCase()}
                                            </span>
                                        )}
                                        <span className="font-semibold text-gray-700 max-w-[120px] truncate">
                                            {user.name}
                                        </span>
                                        <FiChevronDown className={`ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`} />
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="bg-white rounded-lg shadow-lg py-2 border mt-2 animate-fade-in">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-gray-700 transition-colors"
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                <FiUser /> Mi perfil
                                            </Link>
                                            <Link
                                                href="/dashboard"
                                                className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-gray-700 transition-colors"
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                <FiHome /> Dashboard
                                            </Link>
                                            <Link
                                                href="/configuracion"
                                                className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-gray-700 transition-colors"
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                <FiSettings /> Configuración
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsDropdownOpen(false);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-red-50 text-red-600 transition-colors"
                                            >
                                                <FiLogOut /> Cerrar sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-4 py-3 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors font-semibold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <FiLogIn size={18} /> Iniciar Sesión
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