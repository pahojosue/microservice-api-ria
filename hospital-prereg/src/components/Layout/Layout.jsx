// src/components/Layout/Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex-1 flex justify-center py-10 px-4">
          <div className="layout-content-container flex flex-col max-w-[800px] w-full gap-8">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;