import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  navigateTo: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar, navigateTo }) => {
  const menuItems = [
    { name: 'Text to Video Generation', page: 'text-to-video' as Page },
    { name: 'Video Editor', page: 'editor' as Page },
    { name: 'Harga (Pricing)', page: 'pricing' as Page },
    { name: 'Bantuan & Dukungan', page: 'support' as Page },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
      ></div>
      <div
        className={`fixed top-0 left-0 h-full w-72 max-w-[80vw] bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Menu</h2>
          <button onClick={closeSidebar} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => navigateTo(item.page)}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;