import React, { useState, useEffect } from 'react';

export default function LuminovaChapterThree() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [animateSlide, setAnimateSlide] = useState(false);

  // تأثير حركي ناعم عند التقليب بين الشرايح
  useEffect(() => {
    setAnimateSlide(true);
    const timer = setTimeout(() => setAnimateSlide(false), 300);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  };

  const handleExitClick = () => setShowExitModal(true);
  
  const confirmExit = () => {
    setShowExitModal(false);
    setCurrentSlide(0);
    setQuizAnswers({});
    setShowFeedback({});
    setIsFinished(false);
  };

  const cancelExit = () => setShowExitModal(false);
  const handleFinish = () => setIsFinished(true);

  const handleQuizAnswer = (slideIndex, isCorrect) => {
    setQuizAnswers(prev => ({ ...prev, [slideIndex]: isCorrect }));
    setShowFeedback(prev => ({ ...prev, [slideIndex]: true }));
  };

  // بيانات الفصل الثالث مقسمة بتفصيل شديد على 26 شريحة
  const slides = [
    {
      title: "مقدمة الفصل الثالث 🌌",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="text-center mb-6"><span className="text-7xl animate-bounce inline-block drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">🚀</span></div>
          <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 text-center">يا هلا بيك يا صاحبي في الفصل الثالث!</p>
          <p className="text-xl text-center">بعد ما فهمنا إيه هو المحتوى الرقمي، جه الوقت نتعمق أكتر في <span className="text-purple-400 font-bold bg-purple-900/30 px-2 py-1 rounded-lg">نظم إدارة التعلم (LMS)</span>. ده بقى "الدينامو" اللي بيحرك التعليم الأونلاين كله!</p>
          
          <div className="p-8 rounded-3xl bg-[#111827]/80 border border-slate-700/80 shadow-2xl mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-pink-500 to-purple-500"></div>
            <h4 className="text-2xl text-pink-400 font-bold mb-6">في الرحلة دي هنعرف:</h4>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center gap-3"><span className="text-cyan-500 text-2xl">💠</span> إيه هي مكونات النظام ده بالظبط؟</li>
              <li className="flex items-center gap-3"><span className="text-cyan-500 text-2xl">💠</span> إيه أدواته (من أول الشات لحد الامتحانات)؟</li>
              <li className="flex items-center gap-3"><span className="text-cyan-500 text-2xl">💠</span> إيه المشاكل والمطبات اللي ممكن تقابلنا فيه؟</li>
              <li className="flex items-center gap-3"><span className="text-cyan-500 text-2xl">💠</span> وأخيراً، إيه أشهر الأنظمة المجانية والمدفوعة في السوق؟</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "إيه هو نظام إدارة التعلم (LMS)؟ 💡",
      content: (
        <div className="space-y-8 text-lg leading-relaxed text-slate-300">
          <p className="text-xl">بص يا سيدي، تخيل إنك عندك كورس جامد وعايز تديه للطلاب في كل حتة.. النظام ده هو <strong className="text-cyan-400 text-2xl">البوابة والمنصة</strong> اللي بتجمعكم سوا!</p>
          <p className="text-xl">هو عبارة عن <strong className="text-purple-400">حزمة برامج متكاملة</strong> بتعمل كل حاجة حرفياً:</p>
          
          <div className="grid sm:grid-cols-3 gap-6 mt-4">
            <div className="bg-[#111827]/60 p-6 rounded-2xl border border-emerald-500/20 text-center hover:bg-[#111827] transition-all hover:border-emerald-500/50 hover:-translate-y-1 shadow-lg">
              <div className="text-5xl mb-4 drop-shadow-lg">💾</div>
              <p className="font-bold text-slate-200">بيسجل بيانات الطلاب ويحفظ ملفاتهم.</p>
            </div>
            <div className="bg-[#111827]/60 p-6 rounded-2xl border border-emerald-500/20 text-center hover:bg-[#111827] transition-all hover:border-emerald-500/50 hover:-translate-y-1 shadow-lg">
              <div className="text-5xl mb-4 drop-shadow-lg">🏫</div>
              <p className="font-bold text-slate-200">بيطرح المقررات ويدير الفصول الافتراضية.</p>
            </div>
            <div className="bg-[#111827]/60 p-6 rounded-2xl border border-emerald-500/20 text-center hover:bg-[#111827] transition-all hover:border-emerald-500/50 hover:-translate-y-1 shadow-lg">
              <div className="text-5xl mb-4 drop-shadow-lg">📊</div>
              <p className="font-bold text-slate-200">بيعمل امتحانات ويطلع تقارير ذكية.</p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-l from-rose-900/30 to-transparent border-r-4 border-rose-500 rounded-xl text-rose-200 text-xl flex items-center gap-4">
            <span className="text-4xl">📌</span>
            <p><strong>الخلاصة:</strong> النظام ده بيركز جداً على "المهام الإدارية" عشان يريح المعلم والطالب، ويخلي التركيز كله في المذاكرة وبس!</p>
          </div>
        </div>
      )
    },
    {
      title: "الأعمدة التلاتة لأي نظام (مكوناته) 🏛️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl text-cyan-300 mb-6 border-b border-slate-700/50 pb-4">أي نظام LMS في الدنيا قايم على 3 أعمدة رئيسية، لو واحد وقع الليلة تبوظ:</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-slate-800/80 to-[#111827] p-8 rounded-3xl border border-cyan-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="text-5xl mb-4 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">👨‍🎓</div>
              <h4 className="text-cyan-400 font-bold text-2xl mb-4">1. إدارة المتعلم</h4>
              <p className="text-base text-slate-400">هنا النظام بيعرض المقررات، وبيسمح للطالب يسجل، ولو الكورس محتاج متطلبات (زي كورس ليفل 1 قبل ليفل 2) النظام بيراجع ده ويظبطه.</p>
            </div>
            
            <div className="bg-gradient-to-b from-slate-800/80 to-[#111827] p-8 rounded-3xl border border-purple-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="text-5xl mb-4 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">📥</div>
              <h4 className="text-purple-400 font-bold text-2xl mb-4">2. توصيل المحتوى</h4>
              <p className="text-base text-slate-400">عن طريق العمود ده، المادة العلمية (ملفات، فيديوهات، نصوص) بتوصل للطالب عشان يقدر يدرسها ويتفاعل معاها بكل سهولة.</p>
            </div>
            
            <div className="bg-gradient-to-b from-slate-800/80 to-[#111827] p-8 rounded-3xl border border-pink-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="text-5xl mb-4 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">⚙️</div>
              <h4 className="text-pink-400 font-bold text-2xl mb-4">3. إدارة التعلم</h4>
              <p className="text-base text-slate-400">بعد ما الطالب يسجل، النظام بيبدأ يدير الفصل نفسه! بيوفر جدول، بيتتبع مستوى الطالب، وبيولد التقارير للمدرس.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال للتسخين 🔥",
      question: "إيه هو العمود المسؤول عن (تسجيل الطلاب ومراجعة المتطلبات السابقة للكورس) في نظام إدارة التعلم؟",
      options: [
        { text: "إدارة التعلم", correct: false },
        { text: "إدارة المتعلم", correct: true },
        { text: "توصيل المحتوى", correct: false }
      ]
    },
    {
      title: "خصائص نظم إدارة التعلم (الجزء 1) ✨",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl text-cyan-300 mb-6">الأنظمة دي مش مجرد مواقع عادية، دي فيها خصائص جبارة، تعالوا نشوف أول 4:</p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#111827]/80 p-6 rounded-3xl border border-slate-700/60 flex flex-col gap-3">
              <div className="bg-cyan-500/20 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-cyan-400 mb-2">🎛️</div>
              <strong className="text-white text-xl">1. التخصيص (Customization)</strong>
              <p className="text-slate-400 text-base">النظام مرن جداً! بيتيح للطالب والمدرس يغيروا اللغة، ويعدلوا طريقة التنبيهات (رسايل أو إيميلات) عشان تناسب مزاجهم.</p>
            </div>
            
            <div className="bg-[#111827]/80 p-6 rounded-3xl border border-slate-700/60 flex flex-col gap-3">
              <div className="bg-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-purple-400 mb-2">📅</div>
              <strong className="text-white text-xl">2. الجدولة (Scheduling)</strong>
              <p className="text-slate-400 text-base">مفيش عشوائية هنا. النظام بيعمل جدولة دقيقة للمقرر وبيحط خطة تدريب واضحة بتمشي عليها خطوة بخطوة.</p>
            </div>
            
            <div className="bg-[#111827]/80 p-6 rounded-3xl border border-slate-700/60 flex flex-col gap-3">
              <div className="bg-pink-500/20 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-pink-400 mb-2">🚀</div>
              <strong className="text-white text-xl">3. التوصيل (Delivery)</strong>
              <p className="text-slate-400 text-base">بيتيح المحتوى للمتعلم فوراً وبطريقة مستقرة عشان يذاكر في أي وقت وأي مكان.</p>
            </div>
            
            <div className="bg-[#111827]/80 p-6 rounded-3xl border border-slate-700/60 flex flex-col gap-3">
              <div className="bg-emerald-500/20 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-emerald-400 mb-2">📈</div>
              <strong className="text-white text-xl">4. تتبع وتقييم الأداء</strong>
              <p className="text-slate-400 text-base">عين المدرس الساهرة! بتتيح للمعلمين تتبع تقدم الطالب في "الوقت الفعلي"، فبيديله ملاحظات فورية تحسن مستواه.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "خصائص نظم إدارة التعلم (الجزء 2) 🌟",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl text-cyan-300 mb-6">ونكمل باقي الخصائص العظيمة اللي بتخلي النظام ممتع:</p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#111827]/80 p-6 rounded-3xl border border-slate-700/60 flex flex-col gap-3">
              <div className="bg-amber-500/20 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-amber-400 mb-2">💬</div>
              <strong className="text-white text-xl">5. الاتصال والتواصل</strong>
              <p className="text-slate-400 text-base">مش مجرد قراية! في دردشات، ومنتديات نقاش، وبريد إلكتروني، ومشاركة شاشات عشان التواصل يفضل مستمر بين الكل.</p>
            </div>
            
            <div className="bg-[#111827]/80 p-6 rounded-3xl border border-slate-700/60 flex flex-col gap-3">
              <div className="bg-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-blue-400 mb-2">📝</div>
              <strong className="text-white text-xl">6. الاختبارات</strong>
              <p className="text-slate-400 text-base">عمل امتحانات إلكترونية وتقييم الطلاب بشكل دقيق ومباشر من غير وجع دماغ وتصحيح الورق! 😂</p>
            </div>
            
            <div className="bg-[#111827]/80 p-6 rounded-3xl border border-slate-700/60 flex flex-col gap-3">
              <div className="bg-rose-500/20 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-rose-400 mb-2">😊</div>
              <strong className="text-white text-xl">7. سهولة الاستخدام</strong>
              <p className="text-slate-400 text-base">إجراءات بسيطة ومحددة بتوفر مرونة، عشان الطالب أو المدرس ميتوهش جوة النظام ويحس إنه معقد.</p>
            </div>
            
            <div className="bg-[#111827]/80 p-6 rounded-3xl border border-slate-700/60 flex flex-col gap-3">
              <div className="bg-teal-500/20 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-teal-400 mb-2">🎨</div>
              <strong className="text-white text-xl">8. تنوع المحتوى</strong>
              <p className="text-slate-400 text-base">صور، نصوص، فيديو، واختبارات تفاعلية بتعمل تجربة تعليمية ممتعة ومشوقة جداً بتكسر أي ملل.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "أدوات ومكونات النظام الأساسية 🛠️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl mb-6">إيه بقى الأدوات اللي لازم تكون جوة أي سيستم محترم؟</p>
          
          <div className="space-y-8">
            <div className="bg-gradient-to-l from-cyan-900/30 to-transparent p-8 rounded-3xl border-l-4 border-cyan-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-cyan-500 text-slate-900 w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl">1</div>
                <h4 className="text-cyan-400 font-bold text-3xl">واجهة النظام (User Interface)</h4>
              </div>
              <p className="text-xl pr-16 text-slate-300">دي واجهة المحل يا صاحبي! بتعكس العنوان الرئيسي للنظام، وفيها بيستعرض كل المكونات اللي بتسمح للمستخدم يتنقل بسهولة ويوصل للمواد المتنوعة من غير ما يتلخبط.</p>
            </div>
            
            <div className="bg-gradient-to-l from-purple-900/30 to-transparent p-8 rounded-3xl border-l-4 border-purple-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-500 text-slate-900 w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl">2</div>
                <h4 className="text-purple-400 font-bold text-3xl">أدوات التأليف للمحتوى (Authoring Tools)</h4>
              </div>
              <p className="text-xl pr-16 text-slate-300">عشان المعلم ميتعبش وميحتاجش يتعلم برمجة! النظام بيوفر أدوات تصميم تعليمي بتساعد المدرس يجهز المحتوى التدريبي من جوة النظام نفسه وبسهولة تامة (زي إنه يضيف فيديو أو سؤال بضغطة زرار).</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "أدوات الاتصال: المتزامن ⏳",
      content: (
        <div className="space-y-8 text-lg leading-relaxed text-slate-300">
          <div className="text-center mb-8">
            <span className="inline-block bg-pink-900/40 text-pink-300 px-8 py-3 rounded-full font-bold border border-pink-500/50 text-2xl shadow-[0_0_20px_rgba(236,72,153,0.3)]">
              الاتصال المتزامن = في نفس اللحظة ⏱️
            </span>
          </div>
          <p className="text-2xl text-center text-slate-400 mb-8">يعني كلنا فاتحين مع بعض وبنتكلم لايف. من أهم أدواته:</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#111827]/80 p-8 rounded-3xl border border-pink-500/30 shadow-lg text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="text-7xl mb-6 text-center drop-shadow-md">💬</div>
              <h4 className="text-3xl font-bold text-pink-400 mb-4">المحادثة (Chat)</h4>
              <p className="text-lg text-slate-300">شات كتابي بين شخصين أو أكتر في نفس الوقت، مع إمكانية إن النظام يحفظ المحادثة دي عشان نرجعلها بعدين كمرجع.</p>
            </div>
            
            <div className="bg-[#111827]/80 p-8 rounded-3xl border border-pink-500/30 shadow-lg text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="text-7xl mb-6 text-center drop-shadow-md">👨‍🏫</div>
              <h4 className="text-3xl font-bold text-pink-400 mb-4">الفصول الافتراضية</h4>
              <p className="text-lg text-slate-300">بيئة خرافية وثرية بالصوت والصورة، المدرس بيشرح لايف، والطالب بيقدر يرفع إيده ويسأل ويشارك وكأنهم في فصل حقيقي!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "أدوات الاتصال: غير المتزامن 🕰️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="text-center mb-8">
            <span className="inline-block bg-blue-900/40 text-blue-300 px-8 py-3 rounded-full font-bold border border-blue-500/50 text-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              الاتصال غير المتزامن = كل واحد في وقته 📅
            </span>
          </div>
          <p className="text-xl text-center text-slate-400 mb-8">يعني أنا أبعتلك رسالة، وإنت ترد عليا لما تفتح وتبقى فاضي. أدواته إيه؟</p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#111827]/60 p-6 rounded-2xl border-l-4 border-blue-500">
              <strong className="text-blue-400 block text-2xl mb-3">📧 البريد الإلكتروني</strong>
              <p className="text-base text-slate-300">وسيلة أساسية لتبادل الأنشطة والواجبات بين المدرس والطلاب.</p>
            </div>
            <div className="bg-[#111827]/60 p-6 rounded-2xl border-l-4 border-blue-500">
              <strong className="text-blue-400 block text-2xl mb-3">🗣️ منتديات المناقشة</strong>
              <p className="text-base text-slate-300">ساحة لطرح المواضيع وتبادل الآراء. وممكن نخصص منتدى معين لكل مقرر دراسي.</p>
            </div>
            <div className="bg-[#111827]/60 p-6 rounded-2xl border-l-4 border-blue-500">
              <strong className="text-blue-400 block text-2xl mb-3">📢 الإعلانات</strong>
              <p className="text-base text-slate-300">لوحة شرف أو شريط أخبار لنشر المستجدات من المعلم للطلاب (زي تأجيل امتحان).</p>
            </div>
            <div className="bg-[#111827]/60 p-6 rounded-2xl border-l-4 border-blue-500">
              <strong className="text-blue-400 block text-2xl mb-3">📁 مشاركة الملفات</strong>
              <p className="text-base text-slate-300">مساحة الطالب يرفع فيها ملفاته (زي الأبحاث) عشان المعلم وزمايله يشوفوها ويحملوها.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "اختبر تركيزك 👀",
      question: "أي من الأدوات التالية يُعتبر من أدوات الاتصال (المتزامن) اللي بيحصل في نفس اللحظة؟",
      options: [
        { text: "البريد الإلكتروني (Email)", correct: false },
        { text: "الفصول الافتراضية (Virtual Classrooms)", correct: true },
        { text: "منتديات المناقشة (Forums)", correct: false }
      ]
    },
    {
      title: "إدارة المقررات والمشاركة الاجتماعية 🤝",
      content: (
        <div className="space-y-8 text-lg leading-relaxed text-slate-300">
          
          <div className="bg-[#111827]/80 p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
            <h4 className="text-emerald-400 font-bold text-3xl mb-4 flex items-center gap-3"><span className="text-4xl">🛠️</span> إدارة المقررات</h4>
            <p className="text-xl">المدرس هنا هو المايسترو! بيتحكم في مين يقدر يوصل للمقرر، بيعمل الأنشطة، بيظبط أوقات التسجيل، وكمان بياخد <span className="text-white font-bold">نسخة احتياطية (Backup)</span> للمقرر عشان لو حاجة باظت يقدر يرجعها بسهولة.</p>
          </div>

          <div className="bg-[#111827]/80 p-8 rounded-3xl border border-amber-500/30 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
            <h4 className="text-amber-400 font-bold text-3xl mb-4 flex items-center gap-3"><span className="text-4xl">🌐</span> أدوات المشاركة الاجتماعية</h4>
            <p className="text-xl mb-4">النظام مش مقفول على نفسه، فيه أدوات تفاعلية بتخلينا مجتمع واحد:</p>
            <ul className="grid sm:grid-cols-3 gap-4 text-base">
              <li className="bg-slate-800/60 p-4 rounded-xl border border-slate-700"><strong>RSS Feed:</strong> بيجيبلك أحدث الأخبار من المواقع اللي إنت مشترك فيها فوراً.</li>
              <li className="bg-slate-800/60 p-4 rounded-xl border border-slate-700"><strong>المدونات (Blogs):</strong> صفحة شخصية للطالب ينشر فيها أفكاره وخبراته.</li>
              <li className="bg-slate-800/60 p-4 rounded-xl border border-slate-700"><strong>الشبكات الاجتماعية:</strong> بيتم إنشاء شبكة تواصل خاصة بالجامعة لزيادة الاجتماعيات.</li>
            </ul>
          </div>

        </div>
      )
    },
    {
      title: "التقويم، الشهادات، والتلعيب (الروقان) 🎮",
      content: (
        <div className="space-y-8 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl text-center mb-8">إزاي بنقيم الطالب ونكافئه جوة النظام؟</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-cyan-900/30 to-[#111827] p-8 rounded-3xl border border-cyan-500/40 text-center shadow-lg hover:-translate-y-2 transition-transform">
              <div className="text-6xl mb-6 drop-shadow-md">📝</div>
              <h4 className="text-cyan-400 font-bold text-2xl mb-4">التقويم والاختبارات</h4>
              <p className="text-base text-slate-300">تصميم أسئلة وتصحيح آلي فوري! وفيها استبيانات لتقييم المقرر، وكل ده بيطلع في تقارير ورسوم بيانية عشان المدرس يحلل المستوى.</p>
            </div>
            
            <div className="bg-gradient-to-b from-purple-900/30 to-[#111827] p-8 rounded-3xl border border-purple-500/40 text-center shadow-lg hover:-translate-y-2 transition-transform">
              <div className="text-6xl mb-6 drop-shadow-md">🎓</div>
              <h4 className="text-purple-400 font-bold text-2xl mb-4">الشهادات</h4>
              <p className="text-base text-slate-300">لما تخلص الكورس وتنجح، النظام بيطبعلك الشهادة والسجل المهاري بتاعك أوتوماتيك من غير ما تروح شؤون الطلبة تقف في طابور 😂.</p>
            </div>

            <div className="bg-gradient-to-b from-pink-900/30 to-[#111827] p-8 rounded-3xl border border-pink-500/40 text-center shadow-lg hover:-translate-y-2 transition-transform">
              <div className="text-6xl mb-6 drop-shadow-md">🏆</div>
              <h4 className="text-pink-400 font-bold text-2xl mb-4">التلعيب (Gamification)</h4>
              <p className="text-base text-slate-300">بنستخدم (نقاط، أوسمة/شارات، مستويات، تحديات) عشان الطالب يتحفز ويتفاعل وينافس زمايله وكأنه بيلعب لعبة بالظبط.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "معوقات ومشاكل نظم إدارة التعلم (1) 🚧",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl text-rose-400 font-bold mb-8 text-center border-b border-rose-500/30 pb-4">بالرغم من حلاوتها، النظم دي فيها شوية مطبات لازم ناخد بالنا منها:</p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-6 bg-[#111827]/80 p-6 rounded-3xl border border-rose-500/30 shadow-md">
              <div className="text-5xl text-rose-500 bg-rose-500/10 p-4 rounded-2xl">🚷</div>
              <div className="pt-2">
                <strong className="text-rose-300 text-2xl block mb-2">1. إهمال الفروق الفردية</strong>
                <p className="text-xl">الأنظمة دي بتقدم نفس المحتوى بنفس الطريقة لكل الطلاب، ومبتميزش بين الطالب السريع والطالب اللي محتاج وقت أكتر عشان يفهم ويستوعب.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6 bg-[#111827]/80 p-6 rounded-3xl border border-rose-500/30 shadow-md">
              <div className="text-5xl text-rose-500 bg-rose-500/10 p-4 rounded-2xl">😴</div>
              <div className="pt-2">
                <strong className="text-rose-300 text-2xl block mb-2">2. التعلم السلبي ومشاكل التصميم</strong>
                <p className="text-xl">لو المدرس رفع ملفات PDF وخلاص (مجرد تقليب صفحات)، الطالب هيمل بسرعة ومش هيتعلم حاجة. لازم التصميم يكون تفاعلي وتربوي!</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "معوقات ومشاكل نظم إدارة التعلم (2) 💥",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-rose-400 font-bold mb-6">لسه مكملين مع المشاكل اللي بتواجهنا:</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#111827]/60 p-6 rounded-3xl border-l-4 border-orange-500 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">📉</div>
                <strong className="text-orange-300 text-xl">3. صعوبة التحفيز</strong>
              </div>
              <p className="text-base text-slate-400">بعض الطلاب بيتوهوا وبيفقدوا الشغف بدون إشراف مباشر و"زن" من المدرس فوق دماغهم عشان يذاكروا 😂.</p>
            </div>
            
            <div className="bg-[#111827]/60 p-6 rounded-3xl border-l-4 border-orange-500 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">🔌</div>
                <strong className="text-orange-300 text-xl">4. المشكلات التقنية</strong>
              </div>
              <p className="text-base text-slate-400">النت يفصل، السيرفر يقع في نص الامتحان، والمشاكل التقنية المعتادة اللي بتعصب وتضيع المجهود!</p>
            </div>
            
            <div className="bg-[#111827]/60 p-6 rounded-3xl border-l-4 border-orange-500 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">👥</div>
                <strong className="text-orange-300 text-xl">5. نقص التفاعل الاجتماعي</strong>
              </div>
              <p className="text-base text-slate-400">مفيش الاحتكاك المباشر والدردشة العفوية ولغة الجسد بتاعت الفصل التقليدي.</p>
            </div>
            
            <div className="bg-[#111827]/60 p-6 rounded-3xl border-l-4 border-orange-500 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">🧪</div>
                <strong className="text-orange-300 text-xl">6. صعوبة التقييم العملي</strong>
              </div>
              <p className="text-base text-slate-400">تقييم المهارات اللي محتاجة تدريب عملي (زي تجارب الكيمياء والتمريض) بيكون صعب جداً نقيمه عن بُعد.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال في الجون ⚽",
      question: "من عيوب نظم إدارة التعلم (LMS) إنها بتعاني من صعوبة في...",
      options: [
        { text: "توصيل المحتوى بسرعة للطلاب.", correct: false },
        { text: "تقييم المهارات العملية (التطبيقية) عن بُعد.", correct: true },
        { text: "عمل امتحانات إلكترونية.", correct: false }
      ]
    },
    {
      title: "معايير تصنيف أنظمة إدارة التعلم 🗂️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl text-cyan-400 font-bold mb-6 text-center border-b border-slate-700/50 pb-4">الأنظمة كتير جداً في السوق، بنقسمها وبنختار بينها بناءً على 5 معايير:</p>
          
          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-5 bg-[#111827]/80 rounded-2xl border border-slate-700 flex flex-col justify-center">
              <strong className="text-cyan-300 text-xl mb-2">🎯 1. الفئة المستهدفة:</strong> 
              <span className="text-slate-400">هل هي لموظفي الشركات (زي نظام Google) ولا للطلاب والجامعات؟</span>
            </div>
            <div className="p-5 bg-[#111827]/80 rounded-2xl border border-slate-700 flex flex-col justify-center">
              <strong className="text-purple-300 text-xl mb-2">💰 2. التكلفة والمصدر:</strong> 
              <span className="text-slate-400">مجانية مفتوحة المصدر؟ ولا تجارية بفلوس غالية ومقفولة؟</span>
            </div>
            <div className="p-5 bg-[#111827]/80 rounded-2xl border border-slate-700 flex flex-col justify-center">
              <strong className="text-pink-300 text-xl mb-2">☁️ 3. طريقة التركيب (Hosting):</strong> 
              <span className="text-slate-400">تتسطب على سيرفرات الجامعة محلياً ولا سحابية على النت (Cloud)؟</span>
            </div>
            <div className="p-5 bg-[#111827]/80 rounded-2xl border border-slate-700 flex flex-col justify-center">
              <strong className="text-emerald-300 text-xl mb-2">📦 4. الجاهزية:</strong> 
              <span className="text-slate-400">جاهزة للاستخدام فوراً ولا الشركة بتطلب نظام يتفصل مخصوص ليها من الصفر؟</span>
            </div>
            <div className="p-5 bg-gradient-to-r from-[#111827] to-slate-800 rounded-2xl border border-amber-500/30 md:col-span-2 text-center">
              <strong className="text-amber-300 text-2xl block mb-2">🧩 5. دعم معيار (SCORM):</strong> 
              <span className="text-slate-300 text-lg">ده معيار عالمي، لو النظام بيدعمه، تقدر تاخد الكورس بتاعك بملفاته تنقله من نظام للتاني بسهولة من غير ما يبوظ.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "الأنظمة مفتوحة المصدر (Open Source) 🔓",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300 h-full flex flex-col justify-center">
          <div className="bg-gradient-to-b from-emerald-900/40 to-[#111827] p-10 rounded-[3rem] border border-emerald-500/40 text-center shadow-2xl">
            <div className="text-7xl mb-6 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">🌍</div>
            <h4 className="text-4xl font-black text-emerald-400 mb-6 tracking-wide">Open Source Systems</h4>
            <p className="leading-loose text-2xl text-slate-200 max-w-3xl mx-auto">
              يعني إيه؟ دي أنظمة <strong className="text-emerald-300 bg-emerald-900/40 px-3 py-1 rounded-xl">مجانية</strong>، الميزة الأكبر فيها إن "الكود البرمجي" بتاعها متاح لأي حد.<br/><br/>
              الجامعة بتنزلها، وتخلي المبرمجين بتوعها يعدلوا ويطوروا فيها براحتهم عشان تفصلها على مقاسها واحتياجاتها بالظبط!
            </p>
          </div>
          <p className="text-center text-3xl text-cyan-300 font-bold animate-pulse mt-8">أشهر الأنظمة دي: Moodle, Canvas, Claroline.</p>
        </div>
      )
    },
    {
      title: "1. نظام موودل (Moodle) 🌟",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="flex items-center justify-center gap-4 mb-8 bg-cyan-900/20 p-6 rounded-3xl border border-cyan-500/20">
            <div className="text-6xl drop-shadow-md">🎓</div>
            <div>
              <p className="text-3xl font-bold text-cyan-400 mb-2">أشهر نظام في العالم! (ظهر سنة 2008)</p>
              <p className="text-xl text-slate-300">بيدير التعليم أونلاين بكفاءة عالية جداً ومرونة ملهاش حدود.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#111827]/80 p-8 rounded-3xl border-t-4 border-cyan-500 shadow-lg">
              <strong className="text-cyan-300 text-2xl block mb-4 flex items-center gap-2"><span className="text-3xl">✅</span> مميزاته الجبارة:</strong>
              <ul className="list-none space-y-3 text-lg">
                <li className="flex gap-2"><span className="text-cyan-500">▪</span> واجبات بوقت محدد وتقييم فوري.</li>
                <li className="flex gap-2"><span className="text-cyan-500">▪</span> تراسل فوري، تقويم دراسي، إعلانات.</li>
                <li className="flex gap-2"><span className="text-cyan-500">▪</span> بيدعم وحدات كتير زي (الدرس، المنتدى، المهام، الموارد).</li>
              </ul>
            </div>
            <div className="bg-[#111827]/80 p-8 rounded-3xl border-t-4 border-rose-500 shadow-lg">
              <strong className="text-rose-400 text-2xl block mb-4 flex items-center gap-2"><span className="text-3xl">❌</span> عيوبه:</strong>
              <ul className="list-none space-y-3 text-lg">
                <li className="flex gap-2"><span className="text-rose-500">▪</span> بطيء شوية لو السيرفر اللي متركب عليه ضعيف.</li>
                <li className="flex gap-2"><span className="text-rose-500">▪</span> صعب يتربط بأنظمة الموارد البشرية (HR) بتاعة المؤسسة.</li>
                <li className="flex gap-2"><span className="text-rose-500">▪</span> محتاج مبرمجين محترفين عشان يطوروه ويديروه.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "2. كانفاس (Canvas) & 3. كلارولاين 🚀",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-900/30 to-[#111827] p-8 rounded-3xl border border-purple-500/30 shadow-[0_10px_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
              <div className="absolute -right-6 -top-6 text-9xl opacity-10">🎨</div>
              <div className="text-5xl mb-4 relative z-10">🎨</div>
              <h4 className="text-3xl font-bold text-purple-400 mb-4 relative z-10">نظام Canvas</h4>
              <p className="text-lg mb-6 text-slate-300 relative z-10">نظام حديث وسريع جداً، وممتاز في الاستخدام على الموبايل.</p>
              <ul className="list-none space-y-3 text-base relative z-10">
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-purple-400"></span> بيربط بسهولة مع (Google Drive, Twitter).</li>
                <li className="flex gap-2 items-start"><span className="w-2 h-2 rounded-full bg-purple-400 mt-2 shrink-0"></span> تكليفات بتعتمد على "مراجعة الأقران" (الطلاب يقيموا بعض).</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-purple-400"></span> بيدعم إعطاء تغذية راجعة صوتية للطالب.</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-pink-900/30 to-[#111827] p-8 rounded-3xl border border-pink-500/30 shadow-[0_10px_30px_rgba(236,72,153,0.15)] relative overflow-hidden">
              <div className="absolute -right-6 -top-6 text-9xl opacity-10">🌐</div>
              <div className="text-5xl mb-4 relative z-10">🌐</div>
              <h4 className="text-3xl font-bold text-pink-400 mb-4 relative z-10">نظام Claroline</h4>
              <p className="text-lg mb-6 text-slate-300 relative z-10">أول نظام يتم تحميله مجاناً! وبيدعم لغات كتير جداً.</p>
              <ul className="list-none space-y-3 text-base relative z-10">
                <li className="flex gap-2 items-start"><span className="w-2 h-2 rounded-full bg-pink-400 mt-2 shrink-0"></span> بيتميز بخاصية <strong>"مجموعات العمل"</strong> وكل مجموعة ليها منتداها.</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-pink-400"></span> تسجيل متكامل وسريع للطلاب بملف واحد.</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-pink-400"></span> مليان قوالب جاهزة عشان يسهل التصميم.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "أنظمة تانية مفتوحة المصدر (في السريع) ⏱️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl mb-6">في أنظمة تانية مشهورة وحلوة جداً ومهم تعرفها:</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#111827]/80 p-6 rounded-2xl border-l-4 border-cyan-500 hover:-translate-y-1 transition-transform shadow-md">
              <strong className="text-cyan-300 text-2xl flex items-center gap-3 mb-3"><span className="text-3xl">🏫</span> Google Classroom</strong>
              <p className="text-slate-400">بسيط جداً، مندمج بالكامل مع (جوجل دوكس ويوتيوب)، والمدرس بيتابع مين سلم الواجب فوراً.</p>
            </div>
            <div className="bg-[#111827]/80 p-6 rounded-2xl border-l-4 border-cyan-500 hover:-translate-y-1 transition-transform shadow-md">
              <strong className="text-cyan-300 text-2xl flex items-center gap-3 mb-3"><span className="text-3xl">☁️</span> Cloud Moodle</strong>
              <p className="text-slate-400">نسخة موودل بس على السحابة، فيها ميزة خرافية وهي مكالمات الفيديو (Big Blue Button) مجاناً.</p>
            </div>
            <div className="bg-[#111827]/80 p-6 rounded-2xl border-l-4 border-cyan-500 hover:-translate-y-1 transition-transform shadow-md">
              <strong className="text-cyan-300 text-2xl flex items-center gap-3 mb-3"><span className="text-3xl">⭐</span> Talent LMS</strong>
              <p className="text-slate-400">شيك جداً، بيدعم استيراد SCORM، وفيه 3 أنواع من المستخدمين بيسهلوا الإدارة (آدمن، مدرب، متعلم).</p>
            </div>
            <div className="bg-[#111827]/80 p-6 rounded-2xl border-l-4 border-cyan-500 hover:-translate-y-1 transition-transform shadow-md">
              <strong className="text-cyan-300 text-2xl flex items-center gap-3 mb-3"><span className="text-3xl">🎥</span> WizIQ & Docebo</strong>
              <p className="text-slate-400">WizIQ بيحاكي الواقع بقوة، و Docebo نظامه (ادفع على قد الاستخدام) وممتاز لتدريب الشركات.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "صحصح معايا 🧠",
      question: "نظام (موودل - Moodle) بيُعتبر من الأنظمة...",
      options: [
        { text: "التجارية مغلقة المصدر (بفلوس).", correct: false },
        { text: "مجانية ومفتوحة المصدر (Open Source).", correct: true }
      ]
    },
    {
      title: "الأنظمة مغلقة المصدر (التجارية) 🔒",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300 h-full flex flex-col justify-center">
          <div className="bg-gradient-to-b from-rose-900/40 to-[#111827] p-10 rounded-[3rem] border border-rose-500/40 text-center shadow-2xl">
            <div className="text-7xl mb-6 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">💳</div>
            <h4 className="text-4xl font-black text-rose-400 mb-6 tracking-wide">Commercial Systems</h4>
            <p className="leading-loose text-2xl text-slate-200 max-w-3xl mx-auto">
              دي بقى أنظمة <strong className="text-rose-300 bg-rose-900/40 px-3 py-1 rounded-xl">بفلوس وغالية</strong>، الشركة اللي برمجتها محتفظة بـ "الكود السري" لنفسها.<br/><br/>
              إنت بتدفع اشتراك (ترخيص) عشان تستخدمها، ومينفعش تلعب أو تعدل في الكود بتاعها أبداً إلا من خلال الشركة الأم فقط.
            </p>
          </div>
          <p className="text-center text-3xl text-cyan-300 font-bold mt-8">أشهرها: Blackboard, Tadarus, Classera.</p>
        </div>
      )
    },
    {
      title: "1. بلاك بورد (Blackboard) & 2. تدارس 🎓",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#111827]/80 p-8 rounded-3xl border-t-4 border-cyan-500 shadow-xl relative overflow-hidden">
              <div className="text-6xl mb-4 opacity-80">🏢</div>
              <h4 className="text-3xl font-bold text-cyan-400 mb-4">نظام Blackboard</h4>
              <p className="text-lg mb-4 text-slate-300">الغول بتاع الأنظمة التجارية في العالم!</p>
              <ul className="list-none space-y-3 text-base">
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> مرن وقابل للتوسع جداً.</li>
                <li className="flex gap-2 items-start"><span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0"></span> بيقدم <strong className="text-white">"معايير إرشادية للتصميم التربوي"</strong>، يعني بيوجه المدرس إزاي يصمم الدرس صح!</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> بيوفر نسخة مجانية صغيرة للمدرسين يجربوها.</li>
              </ul>
            </div>
            
            <div className="bg-[#111827]/80 p-8 rounded-3xl border-t-4 border-amber-500 shadow-xl relative overflow-hidden">
              <div className="text-6xl mb-4 opacity-80">🕌</div>
              <h4 className="text-3xl font-bold text-amber-400 mb-4">نظام تدارس (Tadarus)</h4>
              <p className="text-lg mb-4 text-slate-300">نظام عربي أصيل ومتوافق مع المعايير العالمية (SCORM).</p>
              <ul className="list-none space-y-3 text-base">
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-amber-400"></span> إدارة قبول وتسجيل كاملة للجامعات.</li>
                <li className="flex gap-2 items-start"><span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"></span> بيعمل <strong className="text-white">"ملف إنجاز الطالب (E-portfolio)"</strong> بيضم كل أعماله ومساره.</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-amber-400"></span> فصول افتراضية حية، وإعلانات، ومنتديات.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "3. كلاسيرا (Classera) وفوائد الـ LMS 🤝",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="bg-[#111827]/80 p-8 rounded-3xl border border-emerald-500/30 mb-8 flex gap-6 items-center shadow-lg">
            <div className="text-7xl drop-shadow-md">🕹️</div>
            <div>
              <h4 className="text-3xl font-bold text-emerald-400 mb-3">نظام كلاسيرا (Classera)</h4>
              <p className="text-xl leading-relaxed">الأشهر والأقوى في الشرق الأوسط! منصة ذكية جداً فيها فصول افتراضية وبنوك أسئلة. والميزة الأكبر إنها بتحول الدروس لـ <strong>"ألعاب تعليمية"</strong> بشارات ونقاط عشان تنافس زمايلك.</p>
            </div>
          </div>

          <h4 className="text-2xl font-bold text-cyan-400 mb-6 pl-4 border-l-4 border-cyan-500 inline-block">فوائد الـ LMS العظيمة بشكل عام:</h4>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-slate-800 to-[#111827] p-6 rounded-2xl border border-slate-700 shadow-md">
              <strong className="text-cyan-300 text-2xl block mb-3 flex items-center gap-3"><span className="text-3xl">👨‍🏫</span> للمعلمين:</strong>
              <p className="text-slate-400 text-lg">تخزين سحابي آمن، تقارير أداء آلية، وتوفير وقت مهول كان بيضيع في تحضير الدرجات والغياب والورق!</p>
            </div>
            <div className="bg-gradient-to-r from-slate-800 to-[#111827] p-6 rounded-2xl border border-slate-700 shadow-md">
              <strong className="text-pink-300 text-2xl block mb-3 flex items-center gap-3"><span className="text-3xl">👨‍🎓</span> للطلاب:</strong>
              <p className="text-slate-400 text-lg">تعلم ممتع بسبب التلعيب، تعزيز التعلم الذاتي، ومرونة إنك تذاكر من على سريرك وفي أي وقت!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال المليون 💰",
      question: "أي نظام من الأنظمة التالية بيحول الدروس لـ (ألعاب تعليمية) بشارات ونقاط وهو الأشهر في الشرق الأوسط؟",
      options: [
        { text: "تدارس (Tadarus)", correct: false },
        { text: "بلاك بورد (Blackboard)", correct: false },
        { text: "كلاسيرا (Classera)", correct: true }
      ]
    },
    {
      title: "النهاية السعيدة للفصل الثالث 🥳",
      content: (
        <div className="space-y-6 text-lg text-center flex flex-col items-center justify-center min-h-[400px] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 to-transparent rounded-3xl pointer-events-none"></div>
          <div className="text-8xl mb-6 animate-bounce drop-shadow-xl">🎓</div>
          <p className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-sm">
            ألف مبرووووك يا وحش! 💪
          </p>
          <p className="text-slate-300 text-2xl max-w-2xl mt-6 leading-relaxed">إنت كده لميت الفصل التالت كله من أول مكونات النظام لحد الموودل والبلاك بورد ومسبناش معلومة واحدة!</p>
          <p className="text-emerald-400 mt-6 font-bold animate-pulse text-3xl">دوس على الزرار اللي تحت عشان تقفل الدرس وتستلم شهادتك! 👇</p>
        </div>
      )
    }
  ];

  const currentSlideData = slides[currentSlide];

  // شاشة النهاية
  if (isFinished) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0a0f1c] to-[#0a0f1c]"></div>
        
        <div className="bg-[#111827]/80 backdrop-blur-2xl p-16 rounded-[3rem] shadow-[0_0_80px_rgba(8,145,178,0.2)] text-center max-w-2xl w-full border border-cyan-500/30 transform transition-all scale-100 relative z-10">
          <div className="text-8xl mb-8 drop-shadow-lg">🏆</div>
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8 drop-shadow-lg">إنجاز عظيم!</h2>
          <p className="text-2xl text-slate-300 mb-12 leading-relaxed">لقد أتممت دراسة الفصل الثالث بالكامل، وبقيت خبير معتمد في أنظمة التعلم الإلكتروني! 🚀</p>
          <button 
            onClick={() => {setIsFinished(false); setCurrentSlide(0); setQuizAnswers({}); setShowFeedback({});}}
            className="px-10 py-5 bg-slate-800 hover:bg-slate-700 border border-cyan-500/50 text-cyan-400 rounded-2xl font-bold text-2xl hover:text-cyan-300 transition-all hover:shadow-[0_0_30px_rgba(8,145,178,0.4)]"
          >
            إعادة الدرس 🔄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="h-screen bg-[#0B1121] text-slate-200 font-sans flex flex-col overflow-hidden selection:bg-cyan-500/30 relative">
      
      {/* خلفية لومينوفا التفاعلية الثابتة */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      
      {/* مودال الخروج */}
      {showExitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1121]/90 backdrop-blur-lg p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.6)] p-10 max-w-md w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <div className="text-7xl mb-6 drop-shadow-md">🚪</div>
            <h3 className="text-3xl font-bold text-white mb-4">متأكد إنك عايز تخرج؟</h3>
            <p className="text-slate-400 text-lg mb-10">كل التقدم بتاعك في الفصل التالت هيضيع يا صاحبي!</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={confirmExit}
                className="flex-1 py-4 bg-red-600/10 text-red-400 border border-red-500/30 rounded-2xl font-bold text-lg hover:bg-red-600 hover:text-white transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              >
                أيوه، اخرج
              </button>
              <button 
                onClick={cancelExit}
                className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-slate-700 border border-slate-700 hover:border-slate-500 transition-all"
              >
                لأ، كمل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* الرأس (Header) - ثابت في الأعلى ومضمون عدم التداخل */}
      <header className="flex justify-between items-center p-5 bg-[#0B1121]/90 backdrop-blur-xl border-b border-slate-800/80 z-20 shrink-0 shadow-md relative">
        <h1 className="text-xl md:text-3xl font-extrabold flex items-center gap-4">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.4)] flex items-center justify-center">
            <span className="text-xl text-white leading-none">💠</span>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 hidden sm:inline tracking-wide">إدارة التعلم - لومينوفا</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 sm:hidden tracking-wide">الفصل 3</span>
        </h1>
        <div className="flex items-center gap-5">
          <div className="bg-slate-800/80 border border-slate-700 px-5 py-2 rounded-full flex items-center gap-2 shadow-inner">
            <span className="text-cyan-400 font-bold text-lg">{currentSlide + 1}</span>
            <span className="text-slate-500 text-lg">/</span>
            <span className="text-slate-400 text-lg">{slides.length}</span>
          </div>
          <button 
            onClick={handleExitClick}
            className="px-5 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 rounded-xl font-bold transition-all flex items-center gap-2 text-base shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            خروج 🚪
          </button>
        </div>
      </header>

      {/* شريط التقدم - ثابت تحته */}
      <div className="w-full h-1.5 bg-slate-900 z-20 shrink-0 relative">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.6)]"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        ></div>
      </div>

      {/* منطقة المحتوى الرئيسي (Scrollable Area)
          السر لتجنب أي تداخل: 
          flex-1 بتدي المساحة الباقية للمنطقة دي، 
          و overflow-y-auto بيخلي المنطقة دي بس اللي تعمل سكرول لحد حافة الزراير اللي تحت!
      */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10 relative">
        <div className={`max-w-5xl mx-auto bg-[#111827]/60 backdrop-blur-2xl rounded-[2rem] shadow-2xl p-8 md:p-14 min-h-[60vh] border border-slate-700/50 transition-all duration-300 ${animateSlide ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-10 border-b border-slate-700/80 pb-6 leading-tight tracking-wide drop-shadow-md">
            {currentSlideData.title}
          </h2>
          
          {currentSlideData.type === 'quiz' ? (
            <div className="bg-[#0B1121]/80 p-8 md:p-12 rounded-[2rem] border border-cyan-900/60 relative overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-600/10 blur-3xl rounded-full"></div>
              <p className="text-3xl md:text-4xl font-bold mb-12 text-cyan-300 leading-relaxed relative z-10 drop-shadow-sm">{currentSlideData.question}</p>
              
              <div className="space-y-6 relative z-10">
                {currentSlideData.options.map((opt, idx) => {
                  const isAnswered = showFeedback[currentSlide];
                  const isThisSelectedAndCorrect = quizAnswers[currentSlide] === true && opt.correct;
                  const isThisSelectedAndWrong = quizAnswers[currentSlide] === false && !opt.correct;
                  
                  let btnClass = "w-full text-right p-6 rounded-2xl font-bold text-2xl border-2 transition-all duration-300 focus:outline-none flex items-center justify-between group shadow-sm ";
                  if (!isAnswered) {
                    btnClass += "bg-slate-800/80 border-slate-600 hover:border-cyan-400 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] cursor-pointer";
                  } else if (opt.correct) {
                    btnClass += "bg-emerald-900/40 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] transform scale-[1.02]";
                  } else if (isThisSelectedAndWrong) {
                    btnClass += "bg-rose-900/40 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]";
                  } else {
                    btnClass += "bg-slate-900/50 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed";
                  }

                  return (
                    <button 
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleQuizAnswer(currentSlide, opt.correct)}
                      className={btnClass}
                    >
                      <span>{opt.text}</span>
                      {!isAnswered && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 text-3xl">👈</span>}
                      {isAnswered && opt.correct && <span className="text-3xl">✅</span>}
                      {isAnswered && isThisSelectedAndWrong && <span className="text-3xl">❌</span>}
                    </button>
                  );
                })}
              </div>
              
              {showFeedback[currentSlide] && (
                <div className={`mt-10 p-6 rounded-2xl font-bold text-2xl text-center flex items-center justify-center gap-4 animate-fade-in-up border shadow-lg ${quizAnswers[currentSlide] ? 'bg-emerald-900/60 border-emerald-500/50 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-rose-900/60 border-rose-500/50 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]'}`}>
                  {quizAnswers[currentSlide] ? (
                    <><span>عاش جداً! إجابة صحيحة</span> <span className="text-4xl animate-bounce">🏆</span></>
                  ) : (
                    <><span>للأسف إجابة خاطئة! ركز أكتر المرة الجاية</span> <span className="text-4xl">😅</span></>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="relative z-10 text-slate-200">
              {currentSlideData.content}
            </div>
          )}
        </div>
      </main>

      {/* شريط أزرار التحكم (Footer) - مستحيل يتداخل مع الشرح لأنه shrink-0 جوة الـ Flexbox */}
      <footer className="bg-[#0B1121]/90 backdrop-blur-2xl border-t border-slate-800/80 p-5 z-20 shrink-0 flex justify-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)] relative">
        <div className="flex gap-5 w-full max-w-lg justify-between items-center">
          
          {currentSlide === slides.length - 1 ? (
            <button 
              onClick={handleFinish}
              className="flex-1 py-4 px-6 rounded-2xl font-extrabold flex items-center justify-center gap-3 transition-all duration-300 text-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] active:scale-95 border border-emerald-400/50"
            >
              <span>إنهاء الكورس</span>
              <span className="text-3xl leading-none">🏁</span>
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="flex-1 py-4 px-6 rounded-2xl font-extrabold flex items-center justify-center gap-3 transition-all duration-300 text-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.7)] active:scale-95 border border-cyan-400/30"
            >
              <span>التالي</span>
              <span className="text-3xl leading-none">&larr;</span>
            </button>
          )}
          
          <div className="w-px h-10 bg-slate-700/80"></div>

          <button 
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`flex-1 py-4 px-6 rounded-2xl font-extrabold flex items-center justify-center gap-3 transition-all duration-300 text-xl ${currentSlide === 0 ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-transparent' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600/80 hover:border-slate-400 active:scale-95 shadow-sm hover:shadow-md'}`}
          >
            <span className="text-3xl leading-none">&rarr;</span>
            <span>السابق</span>
          </button>
        </div>
      </footer>

      {/* استايل السكرولر المخصص والأنيميشن */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0B1121;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #06b6d4;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}} />
    </div>
  );
}