import React from 'react'

const HomeArticleCard = ({title, description, imageUrl, readMinutes}) => {
  return (
    <div className="flex-none w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div 
            className="h-32 bg-cover bg-center" 
            data-alt="Fresh vegetables on a plate" 
            style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div className="p-4 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{title}</span>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-2">{description}</h4>
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="material-symbols-outlined text-xs">schedule</span>
            <span>{readMinutes} min read</span>
            </div>
        </div>
    </div>
  )
}

export default HomeArticleCard