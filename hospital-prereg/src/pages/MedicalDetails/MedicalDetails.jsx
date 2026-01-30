import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function MedicalDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Attempt to get data passed from the previous page
  // If not found, fallback to the hardcoded HTML content you provided
  const articleData = location.state?.article || {
    id: 1,
    title: "Heart Health: 10 Foods to Lower Cholesterol Naturally",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFl2_Ldnj_hceNi7TaxK1r4aHB2HMg61mCx8qXYwlJySaHWvbBv0uPIq5PWU1YApV2Xgw1JC1NpxX4_LNqxvkc5AeMoPqRArDAwMK07DWfpb31LuF-dRpd1YarSfoPzbU9E7rJIXj-pMzrXwSJ0AsJPYv8xL_JD5z4Zrb1r_emNiiBPccKPqCdFB0oX3bm6uiUqQxDRf4yYl2H8KJHubc6NLbuTxX_B-hP4mzstGjhsc5sPCPHob-sga5CNDY6fgUj3CE_8eZiBT5U",
    category: "Cardiology",
    author: "Dr. Sarah Mitchell, MD",
    authorRole: "Senior Cardiologist",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcwBSUkzJiZakD9eiJdX26HDLrndgRtTMWV7PaNfv8i2moOx6D_aWmLd9uGguy6sRasQI-13TnTCPspkO3jEVD7s2YaQWDqdQiNr8RS0swRdgWyCurzLvd1vaQm0Okk3YBLvjfQhPzNE-OYLmCeb1fBI16u2oedR8_GBObrYgG804h8BvUp6m_dnY2xYt2j6dxRzYcGFlBPVU-65YeD3kkfGf3prWSvGC5r7S0CGbMMxvhOK5WSZT2tnFtrFWXmYdJpvOFkCu-IJP4",
    date: "Oct 24, 2023",
    readTime: "8 min read",
    // This simulates the body content. In a real app, this might be HTML or Markdown.
    content: "html" 
  };

  // Mock data for Related Articles sidebar
  const relatedArticles = [
    { title: "Understanding Blood Pressure Readings", readTime: "4 min read", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUAuLM39Q04Vg_RH3QX1Oz6O4LG0YogwVYPEtoYZ_NJYLQuaDZnivgWLUkbzuj-A5LEs2XmKbhq_n_AH4kOz0-GChHVdMyIRwS04YpX8mt9kZTDXr_qzxbOzOup3R8oZJyczLxzzt_ZHXp7W7NgGPt3n9UaxRe3NoWwDeisfUkcCDuBo8MJ0HjJyCrmOeZw0otoiZ65MMS4eSqJFEJKghnnLLcHZRyS-yRPsmNbJjeqkqPCN5AmjA7m-9gkUD8rWK12uYAxkCWJkPb" },
    { title: "The Mediterranean Diet 101", readTime: "6 min read", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4Zhfa9DTcWs0yAueg-uBCQWaASqtQuS8vIf5OyBkySKKeAgO3104N8wGYITSXyL0uVCFMgBAzNQULyJyJzJ8bffIHEtilFjAwYaPaB4R5ssHFAgINs1CimglvGOcsVxDRjS4vWqYYw6feUcx_Cld8IVmPH0LoeEeSRU57gJxUZGINHUof2YGrPJtfVRwlLCryL-fADD_hAUHf4t8975bhdpAUFazw6hxGL1DxeCBuz1-lCr0pTtzxgJl_ILLy0qlPcgaMz-BCy1f1" },
    { title: "Exercises for a Stronger Heart", readTime: "5 min read", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhc6Vvn8MNW4aFMogpuEbniwgkz94-ncrIw4ISEqD_ZhOb1tNunDiy8Zh9fF1gce14SoxN9-N6gl2kmB4e7GjT5VAHci5UkUauIhaKK8xgh3Be1wU-11uuICCdh3ZU-ZUvf5P4wa3azMK37I6JvQ-XyLxROJNl9ynvjQzOmT3x6GPOxQwiGu90eJOc4fI4gEca_JXigmjY2b5XWqnSkcj_h8pmrj895WYppuypWHuVak6uiK318jBgyMsxqV3fs2nsFWrPEge4Xm4k" }
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display flex flex-col">
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-10 py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <button onClick={() => navigate(-1)} className="hover:text-primary transition-colors">
            Learning Hub
          </button>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <button onClick={() => navigate(-1)} className="hover:text-primary transition-colors">
            {articleData.category}
          </button>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">Article View</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Article Content */}
          <article className="flex-1 min-w-0">
            {/* Hero Image */}
            <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-8 shadow-sm">
              <img 
                alt={articleData.title} 
                className="w-full h-full object-cover" 
                src={articleData.image}
              />
            </div>

            {/* Header Info */}
            <div className="mb-8">
              <h1 className="text-slate-900 dark:text-white text-4xl md:text-4xl font-extrabold leading-tight mb-6">
                {articleData.title}
              </h1>
              
              <div className="flex items-center gap-4 py-6 border-y border-slate-100 dark:border-slate-800">
                <div className="size-12 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
                  <img 
                    alt={articleData.author} 
                    className="w-full h-full object-cover" 
                    src={articleData.authorImage}
                  />
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-bold">{articleData.author}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {articleData.authorRole} • Published {articleData.date} • {articleData.readTime}
                  </p>
                </div>
                <div className="ml-auto flex gap-2">
                  <button className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-slate-600 dark:text-slate-400">bookmark</span>
                  </button>
                  <button className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-slate-600 dark:text-slate-400">share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Article Body - Using standard Tailwind classes for typography */}
            <div className="prose max-w-none">
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-8">
                Understanding how nutrition impacts your cardiovascular health is the first step toward a longer, healthier life. High cholesterol remains a leading risk factor for heart disease, but the good news is that your diet can be a powerful tool in managing it.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">The Science of Soluble Fiber</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-lg">
                Soluble fiber can reduce the absorption of cholesterol into your bloodstream. It's found in such foods as oatmeal, kidney beans, Brussels sprouts, apples, and pears. Five to 10 grams or more of soluble fiber a day decreases your LDL cholesterol. One serving of a breakfast cereal with oatmeal or oat bran provides 3 to 4 grams of fiber.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Healthy Fats: Beyond the Basics</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-lg">
                Not all fats are created equal. While saturated fats found in red meat and full-fat dairy products raise your total cholesterol, unsaturated fats can actually help lower your "bad" LDL cholesterol and raise your "good" HDL cholesterol.
              </p>

              <ul className="list-disc pl-6 mb-6 text-slate-600 dark:text-slate-300 text-lg">
                <li className="mb-2"><strong>Avocados:</strong> Rich in monounsaturated fatty acids and fiber.</li>
                <li className="mb-2"><strong>Walnuts:</strong> High in omega-3 fatty acids, which are essential for heart rhythm stability.</li>
                <li className="mb-2"><strong>Olive Oil:</strong> Use it in place of butter for a heart-healthy alternative.</li>
              </ul>

              {/* Doctor's Note Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-6 my-8 rounded-r-xl">
                <p className="text-primary font-bold mb-2">Doctor's Note:</p>
                <p className="text-slate-700 dark:text-slate-300 italic mb-0">
                  "Small, consistent changes in your daily meals often yield more sustainable results than drastic, short-term diets. Start by swapping one processed snack for a handful of almonds."
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Conclusion</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-lg">
                Managing cholesterol isn't about restriction; it's about making better choices. By incorporating these 10 nutrient-dense foods into your weekly routine, you're building a stronger foundation for your cardiovascular system.
              </p>
            </div>

            {/* Read Completion Action */}
            <div className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest">Finished reading?</p>
              <button className="flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                <span className="material-symbols-outlined">check_circle</span>
                Mark as Read & Earn Progress
              </button>
            </div>
          </article>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-80 flex flex-col gap-8">
            
            {/* Related Articles */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Related Articles</h3>
              <div className="flex flex-col gap-6">
                {relatedArticles.map((item, index) => (
                  <a key={index} className="group flex gap-3 cursor-pointer">
                    <div className="size-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      <img alt={item.title} className="w-full h-full object-cover" src={item.image} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[12px] text-slate-500 mt-1">{item.readTime}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Article Categories</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5">
                  <span className="text-sm text-primary font-semibold">{articleData.category}</span>
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5">
                  <span className="text-sm text-primary font-semibold">Essential Read</span>
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["#hearthealth", "#cholesterol", "#dietary"].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-md hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Footer (Can be removed if you include this component in a Layout) */}
      <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 py-10 px-10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">medical_services</span>
            <span className="font-bold text-slate-800 dark:text-white">MedLibrary</span>
            <span className="text-slate-400 text-sm ml-2">© 2024 Health Learning Hub</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 dark:text-slate-400">
            <a className="hover:text-primary transition-colors" href="#">Terms</a>
            <a className="hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="hover:text-primary transition-colors" href="#">Cookie Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MedicalDetails;