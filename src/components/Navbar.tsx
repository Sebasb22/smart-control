import React, { useState } from "react";
import type { User } from "firebase/auth";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaChartLine,
  FaPiggyBank,
  FaMoneyBillWave, // <-- Icono para Deudas
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

interface NavbarProps {
  currentUser: User & { nombre?: string | null };
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Barra superior */}
      <nav className="bg-white text-blue-700 px-6 py-3 flex items-center justify-between shadow-sm border-b border-blue-100">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleMenu}
            className="focus:outline-none hover:text-blue-500 transition"
          >
            <FaBars className="w-7 h-7" />
          </button>
          <img
            src="/logo.svg"
            alt="Smart Control Logo"
            className="h-8 w-auto"
          />
        </div>

        {/* Usuario */}
        <div className="flex items-center space-x-3">
          {currentUser?.photoURL && !imageError ? (
            <img
              src={currentUser.photoURL}
              alt="Avatar"
              className="w-9 h-9 rounded-full border-2 border-blue-200 shadow-sm object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <FaUserCircle className="w-9 h-9 text-blue-200" />
          )}
          <span className="hidden md:block font-medium text-blue-700">
            {currentUser.nombre || currentUser.displayName || "Usuario"}
          </span>
        </div>
      </nav>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50"
            >
              {/* Header del menú */}
              <div className="flex justify-between items-center px-4 py-4 border-b bg-blue-50">
                <h2 className="text-lg font-semibold text-blue-700">Menú</h2>
                <button
                  onClick={toggleMenu}
                  className="focus:outline-none hover:text-blue-500 transition"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              {/* Opciones de navegación */}
              <div className="p-4 space-y-3">
                {[
                  {
                    label: "Dashboard",
                    icon: <FaTachometerAlt className="text-blue-600 w-5 h-5" />,
                    path: "/",
                  },
                  {
                    label: "Inversión",
                    icon: <FaChartLine className="text-green-600 w-5 h-5" />,
                    path: "/projection",
                  },
                  {
                    label: "Ahorros",
                    icon: <FaPiggyBank className="text-yellow-600 w-5 h-5" />,
                    path: "/savings",
                  },
                  {
                    label: "Deudas",
                    icon: <FaMoneyBillWave className="text-red-500 w-5 h-5" />,
                    path: "/debts", // <-- Nueva ruta
                  },
                  {
                    label: "Configuración",
                    icon: <FaCog className="text-blue-600 w-5 h-5" />,
                    path: "/settings", // <-- Nueva ruta para configuración
                  },
                  {
                    label: "Cerrar sesión",
                    icon: <FaSignOutAlt className="w-5 h-5" />,
                    action: onLogout,
                    isLogout: true,
                  },
                ].map((item, idx) => {
                  const handleClick = () => {
                    if (item.path) {
                      navigate(item.path);
                    } else if (item.action) {
                      item.action();
                    }
                    setIsOpen(false);
                  };

                  return (
                    <motion.button
                      key={idx}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        item.isLogout
                          ? "hover:bg-red-100 text-red-600"
                          : "hover:bg-blue-100 text-gray-700"
                      }`}
                      onClick={handleClick}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Overlay oscuro */}
            <motion.div
              onClick={toggleMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
