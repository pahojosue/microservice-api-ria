import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-10 py-3">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4 text-primary">
                    <Link to="/">
                        <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">medical_services</span>
                        </div>
                    </Link>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                        <Link to="/">HealthPortal</Link>
                    </h2>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <nav className="hidden md:flex items-center gap-8">
                            <Link to="/appointments" className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors">Appointments</Link>                        
                            <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" to="/medical-content">Medical Content</Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link to="/patient-profile" className="flex items-center justify-center size-10 rounded-full bg-slate-300 dark:bg-slate-700 text-white hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors">
                            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                person
                            </span>
                        </Link>
                    </div>
                </div>
          </div>
    </header>
  )
}

export default NavBar