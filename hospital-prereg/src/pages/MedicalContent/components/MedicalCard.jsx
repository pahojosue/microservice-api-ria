import React from 'react'

const MedicalCard = ({article}) => {
  return (
<div key={article.id} className="flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={article.title} 
                      src={article.image}
                    />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`${article.categoryColor} text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full`}>
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> 
                      {article.readTime}
                    </span>
                    <button className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
  )
}

export default MedicalCard