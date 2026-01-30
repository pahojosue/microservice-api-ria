import React, { useEffect, useState } from 'react';
import MedicalCard from './components/MedicalCard';
import NavBar from '../../components/NavBar';

function MedicalContent() {
  // 1. State to track the active sidebar item
  const [activeCategory, setActiveCategory] = useState("All Articles");

  // Data for the sidebar menu
  const menuItems = [
    { icon: "dashboard", label: "All Articles" },
    { icon: "favorite", label: "Cardiology" },
    { icon: "restaurant", label: "Nutrition" },
    { icon: "psychology", label: "Mental Health" },
    { icon: "child_care", label: "Pediatrics" },
    { icon: "fitness_center", label: "Orthopedics" },
  ];

  
  useEffect(() => {
    console.log(`Changed Category: ${activeCategory}`)
  }, [activeCategory]);

  // Data for the articles
  const articles = [
    {
      id: 1,
      category: "Cardiology",
      categoryColor: "bg-primary",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFl2_Ldnj_hceNi7TaxK1r4aHB2HMg61mCx8qXYwlJySaHWvbBv0uPIq5PWU1YApV2Xgw1JC1NpxX4_LNqxvkc5AeMoPqRArDAwMK07DWfpb31LuF-dRpd1YarSfoPzbU9E7rJIXj-pMzrXwSJ0AsJPYv8xL_JD5z4Zrb1r_emNiiBPccKPqCdFB0oX3bm6uiUqQxDRf4yYl2H8KJHubc6NLbuTxX_B-hP4mzstGjhsc5sPCPHob-sga5CNDY6fgUj3CE_8eZiBT5U",
      title: "Heart Health: 10 Foods to Lower Cholesterol",
      description: "Discover how simple dietary changes can significantly impact your cardiovascular health and longevity through nutrient-rich superfoods.",
      readTime: "5 min read"
    },
    {
      id: 2,
      category: "Mental Health",
      categoryColor: "bg-emerald-500",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUAuLM39Q04Vg_RH3QX1Oz6O4LG0YogwVYPEtoYZ_NJYLQuaDZnivgWLUkbzuj-A5LEs2XmKbhq_n_AH4kOz0-GChHVdMyIRwS04YpX8mt9kZTDXr_qzxbOzOup3R8oZJyczLxzzt_ZHXp7W7NgGPt3n9UaxRe3NoWwDeisfUkcCDuBo8MJ0HjJyCrmOeZw0otoiZ65MMS4eSqJFEJKghnnLLcHZRyS-yRPsmNbJjeqkqPCN5AmjA7m-9gkUD8rWK12uYAxkCWJkPb",
      title: "Stress Management: Yoga and Mindfulness",
      description: "Explore scientifically proven techniques to reduce cortisol levels and find inner balance in a fast-paced modern world.",
      readTime: "8 min read"
    },
    {
      id: 3,
      category: "Nutrition",
      categoryColor: "bg-orange-500",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4Zhfa9DTcWs0yAueg-uBCQWaASqtQuS8vIf5OyBkySKKeAgO3104N8wGYITSXyL0uVCFMgBAzNQULyJyJzJ8bffIHEtilFjAwYaPaB4R5ssHFAgINs1CimglvGOcsVxDRjS4vWqYYw6feUcx_Cld8IVmPH0LoeEeSRU57gJxUZGINHUof2YGrPJtfVRwlLCryL-fADD_hAUHf4t8975bhdpAUFazw6hxGL1DxeCBuz1-lCr0pTtzxgJl_ILLy0qlPcgaMz-BCy1f1",
      title: "Hydration 101: Why Water Matters",
      description: "The critical role of water in metabolic functions, cognitive performance, and skin health that most people overlook.",
      readTime: "4 min read"
    },
    {
      id: 4,
      category: "Pediatrics",
      categoryColor: "bg-indigo-500",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDEARTSxpcokvq99C2HevIFi_DN1ZsDRzzNY645XJUEKGggPq7BQBmKXaRuEYQFMl-KluMudTkiPR1Lc17CRWFOS2t2am_Z7yrGikmShtZmL96YGoYOuEGlyIyEYroiHDn1To1jPjMPMgi7B_IvqDyjKc595XE8AYuQ8oBzdnrF8bE3sszqcLFf3ghP6ErBE0HFQ8Vha1i8N7b5DRe5v1c7yBnyCJLEEeU1fHj6yXA7pCiQFeEV88wCu-ub_VctQAokwMlB0g-IhfU",
      title: "Childhood Immunization: A Parent's Guide",
      description: "Understanding the schedule and safety of essential vaccines for your child's long-term immunity and community health.",
      readTime: "12 min read"
    },
    {
      id: 5,
      category: "Neurology",
      categoryColor: "bg-rose-500",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhc6Vvn8MNW4aFMogpuEbniwgkz94-ncrIw4ISEqD_ZhOb1tNunDiy8Zh9fF1gce14SoxN9-N6gl2kmB4e7GjT5VAHci5UkUauIhaKK8xgh3Be1wU-11uuICCdh3ZU-ZUvf5P4wa3azMK37I6JvQ-XyLxROJNl9ynvjQzOmT3x6GPOxQwiGu90eJOc4fI4gEca_JXigmjY2b5XWqnSkcj_h8pmrj895WYppuypWHuVak6uiK318jBgyMsxqV3fs2nsFWrPEge4Xm4k",
      title: "Brain Training: Focus and Concentration",
      description: "Learn cognitive exercises and lifestyle habits that strengthen neural pathways and improve daily productivity.",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display flex flex-col">
        {/* Header NavBar */}
              <NavBar />
              
      <main className="flex flex-1 flex-col md:flex-row px-4 md:px-10 py-8 gap-8 max-w-[1440px] mx-auto w-full">
        
        {/* Sidebar / Filters */}
        <aside className="w-full md:w-64 flex flex-col gap-8">
          <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">Categories</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">Filter by medical specialty</p>
            </div>
            
            <nav className="flex flex-col gap-1">
              {/* 2. Map through menu items with dynamic styling */}
              {menuItems.map((item) => (
                <div 
                  key={item.label}
                  onClick={() => setActiveCategory(item.label)} // Set active on click
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group ${
                    activeCategory === item.label
                      ? "bg-primary/10 text-primary" // Active Style
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800" // Inactive Style
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <p className={`text-sm leading-normal ${
                    activeCategory === item.label ? "font-semibold" : "font-medium"
                  }`}>
                    {item.label}
                  </p>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Feed */}
        <div className="flex-1 flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-extrabold leading-tight">Medical Content Library</h1>
            <p className="text-slate-500 dark:text-slate-400">Reliable health information reviewed by medical professionals.</p>
          </div>

          <div className="w-full">
            <label className="flex flex-col h-14 w-full shadow-sm">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <div className="text-slate-400 flex items-center justify-center pl-5">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                  className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 px-4 text-base font-normal" 
                  placeholder="Search for symptoms, treatments, or wellness tips..." 
                  type="text"
                />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {articles.map((article) => (
                <MedicalCard article={article} />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

export default MedicalContent;