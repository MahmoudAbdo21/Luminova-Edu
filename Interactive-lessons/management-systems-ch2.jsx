import React, { useState, useEffect } from 'react';

export default function LuminovaChapterTwo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [animateSlide, setAnimateSlide] = useState(false);

  // تأثير حركي عند تغيير الشريحة
  useEffect(() => {
    setAnimateSlide(true);
    const timer = setTimeout(() => setAnimateSlide(false), 500);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
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

  // بيانات الفصل الثاني كاملة ومقسمة بالتفصيل الممل على 28 شريحة
  const slides = [
    {
      title: "مقدمة الفصل الثاني 🌌",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-3xl font-bold text-cyan-400 mb-6 drop-shadow-md">أهلاً بيك يا بطل في الفصل الثاني! 🚀</p>
          <p>بعد ما فرمنا المحتوى الرقمي في الفصل الأول، جه الوقت نتكلم عن <span className="text-purple-400 font-bold">نظم إدارة التعلم الرقمي الإلكتروني</span>. يعني باختصار، السيستم اللي بيشغل الليلة دي كلها!</p>
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-inner">
            <h4 className="text-xl text-pink-400 font-bold mb-4">هنتكلم عن إيه في الفصل ده؟ 🤔</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2"><span className="text-cyan-500">💠</span> مفهوم نظم إدارة التعلم ووظائفها.</li>
              <li className="flex items-center gap-2"><span className="text-cyan-500">💠</span> مكونات وأنماط النظم دي.</li>
              <li className="flex items-center gap-2"><span className="text-cyan-500">💠</span> نظام إدارة المحتوى (CMS) ونظام إدارة المقرر.</li>
              <li className="flex items-center gap-2"><span className="text-cyan-500">💠</span> إمكانيات ومعوقات كل نظام، وتخطيط المدارس زي نظام (سكوليرا).</li>
            </ul>
          </div>
          <p className="text-cyan-300 font-bold animate-pulse">اربط الحزام ويلا بينا نبدأ الرحلة! 🛸</p>
        </div>
      )
    },
    {
      title: "يعني إيه نظم إدارة التعلم؟ 💡",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p>نظم إدارة التعلم دي تعتبر <span className="text-red-400 font-bold text-xl">"القلب النابض"</span> في التعلم الإلكتروني! ❤️</p>
          <p>هي منصة الإطلاق والبوابة اللي بيتقابل فيها المعلمون والمتعلمون. أي نظام تعلم محتاج تطبيق عشان يسجل الطلاب، يوصلهم المحتوى، يتابعهم، ويقيمهم، ويطلع تقارير كمان.</p>
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl border-r-4 border-cyan-500">
            <p className="font-bold text-cyan-300 mb-2">الدكتور محمد عطية خميس (2018) عرفها وقال:</p>
            <p className="italic text-slate-400">"هي حزمة برمجية بتقدم بيئة تعليمية إلكترونية متكاملة عبر الشبكات، بنستخدمها عشان ننشئ المحتوى، نديره، وندير عمليات التعلم والتفاعل والتقويم، وهي العمود الفقري للتعلم الإلكتروني."</p>
          </div>
          <p>من الآخر هي "الوعاء" اللي بنحط فيه المحتوى والامتحانات والمنتديات عشان نوصل لهدفنا 😂.</p>
        </div>
      )
    },
    {
      title: "أسماء نظم الإدارة (عشان متتوهش) 🏷️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p>النظم دي ليها أسماء واختصارات كتير، لازم تكون عارفهم عشان تبقى بريمو في مجالك:</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-cyan-500 transition-colors">
              <strong className="text-cyan-400 block mb-1">CMS</strong> نظام إدارة المحتوى (Content)
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors">
              <strong className="text-purple-400 block mb-1">CMS</strong> نظام إدارة المقرر (Course) <span className="text-sm text-slate-500">(نفس الاختصار بس المعنى غير)</span>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-pink-500 transition-colors">
              <strong className="text-pink-400 block mb-1">LMS</strong> نظام إدارة التعلم (Learning)
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors">
              <strong className="text-emerald-400 block mb-1">LCMS</strong> نظام إدارة محتوى التعلم (Learning Content)
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-amber-500 transition-colors">
              <strong className="text-amber-400 block mb-1">LAMS</strong> نظام إدارة نشاط التعلم (Activity)
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
              <strong className="text-blue-400 block mb-1">SEMS</strong> نظم التعلم الذكية (Smart)
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "تحدي لومينوفا السريع 🧠⚡",
      question: "حسب تعريف د. محمد عطية خميس، تعتبر نظم إدارة التعلم بمثابة إيه في التعلم الإلكتروني؟",
      options: [
        { text: "مجرد مستودع بنرمي فيه الملفات للطلاب.", correct: false },
        { text: "العمود الفقري والقلب النابض للتعلم الإلكتروني.", correct: true },
        { text: "أداة لعمل الامتحانات فقط.", correct: false }
      ]
    },
    {
      title: "وظائف نظم إدارة التعلم (الجزء الأول) ⚙️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-cyan-300">النظم دي مش مجرد مخزن، دي بتعمل بلاوي! 😂 شوف وظائفها:</p>
          <ul className="space-y-4">
            <li className="bg-slate-800/40 p-5 rounded-2xl border-r-4 border-cyan-500">
              <strong className="text-cyan-400 text-xl block mb-2">1. التسجيل وإدارة المتعلمين 📝</strong>
              بتسمح للمرخص ليهم بس بالدخول. بتسجل الطلاب، تقسمهم لمجموعات، تزودهم بالمقررات، وتدير كل موارد الفصل وأدوات الدعم زي التدريبات.
            </li>
            <li className="bg-slate-800/40 p-5 rounded-2xl border-r-4 border-purple-500">
              <strong className="text-purple-400 text-xl block mb-2">2. تخطيط وإنشاء المقررات 🛠️</strong>
              بتساعد المدرسين يرفعوا ملفاتهم زي (Word, PDF, PowerPoint) بسهولة من غير ما يحتاجوا يحولوها لكود HTML.
            </li>
            <li className="bg-slate-800/40 p-5 rounded-2xl border-r-4 border-pink-500">
              <strong className="text-pink-400 text-xl block mb-2">3. توصيل المقررات 🚀</strong>
              بتوصل المحتوى للطالب بشكل سريع وسهل جداً وفي أي وقت.
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "وظائف نظم إدارة التعلم (الجزء الثاني) ⚙️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-cyan-300">مكملين مع وظائف السيستم الخرافي ده:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
              <strong className="text-emerald-400 block text-xl mb-2">4. إدارة المقررات 🗂️</strong>
              إضافة، تعديل، حذف! وتنظيم المقررات في فهارس سهل تبحث فيها، وتوزيع المحتوى للأفراد أو المجموعات.
            </div>
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
              <strong className="text-amber-400 block text-xl mb-2">5. تسهيل التعليم والتعلم 🤝</strong>
              مش بس مخزن، ده بيوجه المتعلم، يدعم التعلم الذاتي، ويسهل التفاعل بين المدرس والطلاب.
            </div>
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
              <strong className="text-blue-400 block text-xl mb-2">6. الاتصال والتشارك 💬</strong>
              اتصال بين (المدير والطالب)، (المعلم والطالب)، (الطالب والمحتوى)، و(الطالب وزميله).
            </div>
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
              <strong className="text-rose-400 block text-xl mb-2">7 & 8. التقويم والتتبع 📊</strong>
              تقويم بنائي، كويزات، ملفات إنجاز، امتحانات نهائية. وتتبع تقدم الطالب وطلع تقارير بحالته.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "مين اللي بيستخدم النظم دي؟ (الأدوار) 👥",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p>عندنا 3 أبطال رئيسيين في القصة دي، وكل واحد ليه دوره:</p>
          <div className="space-y-4">
            <div className="flex gap-4 items-start bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <div className="text-4xl">👨‍🎓</div>
              <div>
                <strong className="text-cyan-400 text-xl block mb-1">1. المتعلمون (الطلاب)</strong>
                هما الأساس! بيسجلوا دخول، يسجلوا في المقررات، يحملوا الواجبات، ياخدوا المصادر التعليمية، ويشاركوا في المناقشات.
              </div>
            </div>
            <div className="flex gap-4 items-start bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <div className="text-4xl">👨‍🏫</div>
              <div>
                <strong className="text-purple-400 text-xl block mb-1">2. المعلمون</strong>
                بيشرفوا ويدعموا الطلاب. بيسجلوا دخول، يضيفوا مقررات ومصادر، يعملوا امتحانات، يديروا المقرر، يفتحوا نقاشات، ويقيموا الطلاب ويدوهم تغذية راجعة.
              </div>
            </div>
            <div className="flex gap-4 items-start bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <div className="text-4xl">👨‍💻</div>
              <div>
                <strong className="text-pink-400 text-xl block mb-1">3. الإداريون (الآدمن)</strong>
                دول الدعم الفني واللوجستي. بيراجعوا التسجيل، يخصصوا الحسابات، ويدعموا كل المستخدمين.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "مميزات نظم إدارة التعلم (1) 🌟",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4 text-cyan-300">ليه العالم كله بيتجه للنظم دي؟ بص يا سيدي على المميزات (12 ميزة):</p>
          <ul className="grid sm:grid-cols-2 gap-4">
            <li className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-cyan-500">
              <strong className="text-cyan-400">1. الإتاحة والوصول:</strong> شغالة 24 ساعة، ادخل من أي مكان.
            </li>
            <li className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-purple-500">
              <strong className="text-purple-400">2. المرونة:</strong> مرونة في الوقت والمكان واختيار الأنشطة والمقرر.
            </li>
            <li className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-pink-500">
              <strong className="text-pink-400">3. تحكم المتعلم:</strong> المسئولية عليك يا بطل، إنت اللي بتختار مسارك وتتابع محتواك.
            </li>
            <li className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-emerald-500">
              <strong className="text-emerald-400">4. تعدد المتعلمين:</strong> مفيش سقف للعدد زي الفصل العادي، بتشيل آلاف الطلاب.
            </li>
            <li className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-amber-500">
              <strong className="text-amber-400">5. تنوع المصادر:</strong> مصادر مقروءة، مسموعة، مرئية، وروابط خارجية بتثري التعلم.
            </li>
            <li className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-blue-500">
              <strong className="text-blue-400">6. تخصيص البرامج:</strong> تتفصل على مقاس واحتياجات الطلاب.
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "مميزات نظم إدارة التعلم (2) 🚀",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4 text-cyan-300">باقي الـ 12 ميزة العظيمة:</p>
          <ul className="grid sm:grid-cols-2 gap-4">
            <li className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-rose-500">
              <strong className="text-rose-400">7. سهولة التوصيل:</strong> المحتوى بيوصلك بسرعة البرق.
            </li>
            <li className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-teal-500">
              <strong className="text-teal-400">8. توسيع التفاعلات:</strong> تفاعلات متزامنة وغير متزامنة بين كل الأطراف.
            </li>
            <li className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-indigo-500">
              <strong className="text-indigo-400">9. دعم التعلم التعاوني:</strong> بتوفر تكنولوجيا للتشارك بين الطلاب.
            </li>
            <li className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-yellow-500">
              <strong className="text-yellow-400">10. تنمية العلاقات:</strong> بتقوي الروابط بين المعلم والطلاب وبين الطلاب وبعضهم.
            </li>
            <li className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-fuchsia-500">
              <strong className="text-fuchsia-400">11. خفض الاعتمادية:</strong> بتدعم استقلاليتك وتخليك تعتمد على نفسك.
            </li>
            <li className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-cyan-500 md:col-span-2">
              <strong className="text-cyan-400">12. جمع البيانات والتحليلات:</strong> بتجمع داتا عن كل فتفوتة بتحصل عشان تحلل وتطور وتحسن النظام.
            </li>
          </ul>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "صحصح معايا 👀",
      question: "من مميزات نظم إدارة التعلم (تعدد المتعلمين)، ده معناه إيه؟",
      options: [
        { text: "إنها بتسمح بعدد محدد جداً زي الفصل العادي عشان التركيز.", correct: false },
        { text: "إنها متصممة تشيل عدد كبير جداً من المتعلمين بدون قيود على العدد.", correct: true }
      ]
    },
    {
      title: "أنواع نظم إدارة التعلم الستة 🧩",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-cyan-400 font-bold">عندنا 6 أنواع رئيسية، وكل واحد ليه شغلانته:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700"><strong className="text-cyan-300">1. نظام إدارة المحتوى (CMS):</strong> لإنشاء وتخزين المحتوى كـ كائنات تعلم.</div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700"><strong className="text-purple-300">2. نظام إدارة المقرر (CMS):</strong> للمواقف الأكاديمية زي الجامعات (أعقد شوية).</div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700"><strong className="text-pink-300">3. نظام إدارة التعلم (LMS):</strong> للوظائف الإدارية، وصول، تسجيل، تقارير.</div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700"><strong className="text-emerald-300">4. نظام إدارة محتوى التعلم (LCMS):</strong> ميكس بين الـ CMS والـ LMS.</div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700"><strong className="text-amber-300">5. نظم التعلم الذكية (SEMS):</strong> فيها ذكاء اصطناعي وتحليل بيانات ضخمة وتوجيه فردي.</div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700"><strong className="text-blue-300">6. نظام إدارة المؤسسة (ERP School):</strong> ده بقى بتاع الإدارة الشاملة (موارد بشرية، مالية، مخازن).</div>
          </div>
        </div>
      )
    },
    {
      title: "أولاً: نظام إدارة المحتوى (CMS) 📁",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl font-bold text-cyan-400 mb-4">Content Management System</p>
          <p>تطبيقات ويب بتديك القدرة تدير محتوى موقعك (تنشئ، تعدل، تنشر، تأرشف) <span className="text-pink-400 font-bold">من غير ما تكون مبرمج!</span></p>
          <p>فيها <strong>مستودعات (Repositories)</strong> بنخزن فيها <strong>كائنات التعلم (Objects)</strong> عشان نعيد استخدامها براحتنا لتسهيل الإدارة (حسب Irlbeck & Mowat 2007).</p>
          <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-cyan-500">
            <p><strong>التركيز الأساسي:</strong> النظام ده بيركز على <em>المحتوى التعليمي</em> (تخزين، بحث، توصيل) مش على إدارة المتعلم. وممكن يكون فيه منتديات ومحادثة.</p>
            <p className="mt-2 text-sm text-slate-400">ملحوظة: في بداياته كان بتاع الناشرين والبوابات الإخبارية (Ninoriya et al., 2011).</p>
          </div>
          <p><strong>الخلاصة (حسب Kohan 2017):</strong> مجموعة مستخدمين بيديروا أجزاء مختلفة من موقع واحد بصلاحيات محددة.</p>
        </div>
      )
    },
    {
      title: "مكونات نظام إدارة المحتوى (CMS) 🧩",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p>النظام ده بيدعم إنشاء وحدات صغيرة مكتفية بذاتها (كائنات تعلم) ويديرها وينشرها. المكونات هي:</p>
          <div className="flex flex-wrap justify-center gap-4 my-6">
            <span className="bg-cyan-900/40 border border-cyan-500 text-cyan-200 px-4 py-2 rounded-full font-bold">1. إنشاء المحتوى</span>
            <span className="text-2xl text-slate-500">⬅️</span>
            <span className="bg-purple-900/40 border border-purple-500 text-purple-200 px-4 py-2 rounded-full font-bold">2. مستودع المحتوى وإدارته</span>
            <span className="text-2xl text-slate-500">⬅️</span>
            <span className="bg-pink-900/40 border border-pink-500 text-pink-200 px-4 py-2 rounded-full font-bold">3. شخصنة المحتوى</span>
            <span className="text-2xl text-slate-500">⬅️</span>
            <span className="bg-emerald-900/40 border border-emerald-500 text-emerald-200 px-4 py-2 rounded-full font-bold">4. مستخدمو المحتوى</span>
          </div>
          <div className="text-center mb-6">
            <span className="bg-amber-900/40 border border-amber-500 text-amber-200 px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]">⬆️ توسيع المحتوى ⬆️</span>
          </div>
          <p className="text-rose-400 font-bold bg-rose-900/20 p-3 rounded-lg border border-rose-500/30 text-center">
            زي ما إنت شايف، النظام ده "معني بتوصيل المحتوى بس"، مش بيدير المتعلمين ولا عمليات التعلم!
          </p>
        </div>
      )
    },
    {
      title: "مميزات أنظمة إدارة المحتوى CMS (الجزء الأول) ✨",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <ul className="space-y-4">
            <li className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 hover:border-cyan-500 transition">
              <strong className="text-cyan-400 block text-xl mb-1">1. لا تحتاج معرفة برمجية:</strong>
              اعمل موقع وخصص تصميمه وضيف إضافات من غير ما تكتب سطر كود واحد! ولو حبيت تضيف كود، برضه بيسمحلك.
            </li>
            <li className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 hover:border-purple-500 transition">
              <strong className="text-purple-400 block text-xl mb-1">2. تصنيف المحتوى (Content Type):</strong>
              تقدر تقسم المقالات في أقسام وتصنيفات عشان تنظم الموقع وتسهل الوصول.
            </li>
            <li className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 hover:border-pink-500 transition">
              <strong className="text-pink-400 block text-xl mb-1">3. سهولة تحرير المحتوى (Content Editor):</strong>
              زمان عشان تعمل صفحة كنت محتاج مبرمج HTML، دلوقتي لو بتعرف تستخدم (Word) هتقدر تضيف مقالات وأخبار بسهولة، سواء جوه النظام الأساسي زي ووردبريس أو بإضافة زي دروبال.
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "مميزات أنظمة إدارة المحتوى CMS (الجزء الثاني) 🚀",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <ul className="space-y-4">
            <li className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-emerald-400 block text-xl mb-1">4. الحقول المخصصة (Content Element):</strong>
              المقالة متقسمة حقول في الداتا بيز (عنوان لوحده، صورة لوحدها). وتقدر كشخص عادي تعمل حقول جديدة (زي حقل "بلد الصنع" لمتجر الكتروني) وتبني صفحات مخصصة احترافية.
            </li>
            <li className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-amber-400 block text-xl mb-1">5. سهولة التعاون:</strong>
              المستخدمين يكتبوا مقالات، والمطورين يظبطوا الواجهة الخلفية، وكلهم شغالين في نفس الصفحة في نفس الوقت!
            </li>
            <li className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-blue-400 block text-xl mb-1">6. دعم الإضافات (Plugins/Addons):</strong>
              مفيش نظام كامل، عشان كده في إضافات بتتركب اختياري (زي ووردبريس اللي فيه أكتر من 10 آلاف إضافة) بتوسع دائرة استخدامه جداً.
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "مميزات أنظمة إدارة المحتوى CMS (الجزء الثالث) 📈",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <ul className="space-y-4">
            <li className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-rose-400 block text-xl mb-2">7. تحسين محركات البحث (SEO):</strong>
              عشان موقعك يظهر في جوجل! بيوفرلك: (تخصيص عناوين وأوصاف، خرائط XML، نص بديل للصور، إعادة توجيه Redirects، تحسين سرعة الصفحة).
            </li>
            <li className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-teal-400 block text-xl mb-2">8. قوالب مصممة مسبقاً:</strong>
              قوالب جاهزة تختار منها وتعدلها زي قوالب الووردبريس، وبتكون "متجاوبة" يعني بتشتغل حلو عالموبايل واللاب من غير برمجة.
            </li>
            <li className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-indigo-400 block text-xl mb-2">9. تحديث المحتوى ديناميكياً:</strong>
              تضيف صور أو محتوى أو إضافات ويشتغلوا في لحظتها، وبواجهات سهلة للمبتدئ والخبير.
            </li>
          </ul>
          <p className="text-sm text-slate-400 mt-2">محمد عطية خميس (2013) أضاف إن النظام بيدعم: استيراد مواد رقمية، تحديد أدوار المستخدمين، تعيين صلاحيات، ونشر المحتوى لمستودع.</p>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "اصحى للكلام ☕",
      question: "ميزة (الحقول المخصصة - Content Element) في الـ CMS بتسمحلي أعمل إيه؟",
      options: [
        { text: "أعمل حقول جديدة في الداتا بيز (زي حقل لبلد الصنع) من غير ما أكون مبرمج.", correct: true },
        { text: "تخلي الموقع يظهر أسرع في محركات البحث.", correct: false }
      ]
    },
    {
      title: "الأدوار والمسؤوليات الأساسية في الـ CMS 🎭",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">في الـ CMS، مين بيعمل إيه؟</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-cyan-900/40 to-slate-900 p-4 rounded-xl border border-cyan-500/30">
              <div className="text-3xl mb-2">✍️</div>
              <strong className="text-cyan-400 text-lg">1. منشئ المحتوى:</strong> مسؤول عن إنشاء وتعديل المحتوى.
            </div>
            <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 p-4 rounded-xl border border-purple-500/30">
              <div className="text-3xl mb-2">🧐</div>
              <strong className="text-purple-400 text-lg">2. المحرر:</strong> يضبط رسالة المحتوى وأسلوب التسليم، والترجمة والتعريب.
            </div>
            <div className="bg-gradient-to-br from-pink-900/40 to-slate-900 p-4 rounded-xl border border-pink-500/30">
              <div className="text-3xl mb-2">📢</div>
              <strong className="text-pink-400 text-lg">3. الناشر:</strong> مسؤول عن الإفراج عن المحتوى عشان الناس تستخدمه.
            </div>
            <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 p-4 rounded-xl border border-emerald-500/30">
              <div className="text-3xl mb-2">⚙️</div>
              <strong className="text-emerald-400 text-lg">4. المسؤول (Admin):</strong> يدير أذونات الوصول ويدعم المستخدمين.
            </div>
            <div className="bg-gradient-to-br from-amber-900/40 to-slate-900 p-4 rounded-xl border border-amber-500/30 md:col-span-2">
              <div className="text-3xl mb-2">👀</div>
              <strong className="text-amber-400 text-lg">5. المستهلك / الضيف:</strong> الشخص اللي بيقرأ المحتوى بعد ما يتنشر.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "تصنيفات أنظمة إدارة المحتوى 🗂️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl">الـ CMS ليها تصنيفات حسب استخدام الموقع، وكل نوع ليه أمثلة مشهورة ومفتوحة المصدر:</p>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-cyan-500">
              <strong className="text-cyan-400">1. البوابات الإلكترونية العامة:</strong> لمواقع المعلومات والأخبار الكبيرة. <br/>
              <span className="text-slate-400 text-sm">أمثلة: Drupal, Joomla, TYPO3</span>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-purple-500">
              <strong className="text-purple-400">2. أنظمة المدونات:</strong> للمقالات المترتبة زمنياً. <br/>
              <span className="text-slate-400 text-sm">أمثلة: WordPress (أشهر واحد), Dotclear, FlatPress</span>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-pink-500">
              <strong className="text-pink-400">3. أنظمة المنتديات:</strong> لتبادل النقاش والحوار. <br/>
              <span className="text-slate-400 text-sm">أمثلة: vBulletin, MyBB, miniBB</span>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-emerald-500">
              <strong className="text-emerald-400">4. أنظمة المتاجر الإلكترونية:</strong> لبيع المنتجات (رقمية أو ملموسة). <br/>
              <span className="text-slate-400 text-sm">أمثلة: OpenCart, Zen Cart, osCommerce</span>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-amber-500">
              <strong className="text-amber-400">5. أنظمة الويكي Wiki:</strong> بتعتمد على المشاركة الجماعية في كتابة وتعديل المحتوى. <br/>
              <span className="text-slate-400 text-sm">أمثلة: ويكيبيديا (الموقع)، وأنظمة زي MediaWiki, Tiki Wiki, phpWiki</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "ثانياً: نظام إدارة المقرر (Course MS) 🎓",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl font-bold text-purple-400 mb-4">Course Management System</p>
          <p>النظام ده متاح عالويب ومصمم خصيصاً لدعم المواقف الأكاديمية (جامعات ومعاهد).</p>
          <div className="bg-purple-900/20 p-5 rounded-2xl border border-purple-500/30">
            <p className="font-bold text-white mb-2">هو أكثر تعقيداً وتطوراً من نظام إدارة المحتوى (CMS Content)، ليه؟</p>
            <p>لأنه بيشمل: توصيل المحتوى + اتصال + أنشطة تعلم + عمل تشاركي + تغذية راجعة + اختبارات + أدوات إدارة للمعلم (د. محمد عطية خميس، 2018).</p>
          </div>
          <p>بيسمح للمعلم ينشئ مقرر بسهولة بقوالب جاهزة أو يحمل ملفاته (HTML).</p>
          <h4 className="text-xl font-bold text-cyan-400 mt-4">إمكانياته إيه؟</h4>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm mt-2">
            <li className="bg-slate-800 p-2 rounded">✅ وضع المقرر عالنت (أزرار، جدول، مواد).</li>
            <li className="bg-slate-800 p-2 rounded">✅ تتبع تقدم الطالب (كويزات ودفتر درجات).</li>
            <li className="bg-slate-800 p-2 rounded">✅ لوحة مناقشة (بين المعلم والطلاب).</li>
            <li className="bg-slate-800 p-2 rounded">✅ أدوات اتصال للإعلانات.</li>
            <li className="bg-slate-800 p-2 rounded">✅ إحصائيات عن استخدام المقرر.</li>
          </ul>
        </div>
      )
    },
    {
      title: "معوقات نظام إدارة المقرر والتصميم 🚧",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="bg-rose-900/20 p-5 rounded-2xl border border-rose-500/30 mb-6">
            <h4 className="text-rose-400 font-bold text-xl mb-3">بالرغم من سهولته، بيواجه 4 معوقات:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>مش مرن كفاية في التصميم (محدود بقوالب معينة).</li>
              <li>محدود في التعلم التفاعلي.</li>
              <li>محدود في الاختبارات (ناقصه معايير أمن وسرية للتأكد من شخصية الطالب).</li>
              <li>محدود في حفظ السجلات (رغم إن بعضه بينقل الدرجات لأنظمة تانية).</li>
            </ol>
          </div>

          <h4 className="text-cyan-400 font-bold text-xl mb-3">معايير تصميم المقررات الإلكترونية:</h4>
          <p>عشان تتغلب على ده، لازم تمشي على معايير:</p>
          <ul className="space-y-2">
            <li><strong className="text-white">1. المحتوى:</strong> صحيح، دقيق، سياقه مناسب، بنيته واضحة، وتنظيمه جيد (ينقسم لفصول ووحدات).</li>
            <li><strong className="text-white">2. الإبحار:</strong> أدوات إبحار تعليمية، مساعدة إجرائية، وتتبع للمتعلم عشان نساعده.</li>
          </ul>
        </div>
      )
    },
    {
      title: "معايير التصميم التعليمي للمقرر 📐",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-300">
          <p className="text-lg text-cyan-300 mb-2">لازم توفر أنشطة متصممة صح، وهي 14 معيار:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">1. وضوح الأهداف (أهداف رئيسية وفرعية وتصنيف بلوم).</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">2. مراعاة خصائص المتعلمين المستهدفين.</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">3. تعدد الأنشطة (عشان يفضلوا منشغلين).</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">4. تعليمات وتوجيهات واضحة (لأن التعلم فردي مستقل).</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">5. تعدد المسارات (تناسب قدرات مختلفة).</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">6. الاعتماد المستقل (الطالب بيخطط لتعلمه ويختار مساره).</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-purple-500">7. تقويم بنائي مستمر (أسئلة قصيرة بعد كل فكرة).</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-purple-500">8. رجع مناسب (تغذية راجعة للإجابات).</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-purple-500">9. تكرار وملخصات (نلخص الفكرة بعد عرضها).</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-purple-500">10. المرونة والتكيف (في بنية المحتوى والجدول).</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-pink-500">11. المسافات (النص ياخد 25-40% بس من الشاشة).</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-pink-500">12. تمييز النصوص (خط سميك/مائل بشكل معتدل عشان التشتت).</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-pink-500">13. التوازن والتناسق (عناصر متوزعة صح).</div>
            <div className="bg-slate-800/50 p-2 rounded border-l-2 border-pink-500">14. الألوان (استخدام وظيفي لتسهيل التذكر).</div>
          </div>
        </div>
      )
    },
    {
      title: "إيه الفرق بين إدارة المحتوى وإدارة المقرر؟ ⚖️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300 flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-xl text-center mb-6">ناس كتير بتتلخبط وتستخدم الكلمتين كأنهم حاجة واحدة، بس الفرق واضح جداً:</p>
          
          <div className="flex flex-col md:flex-row w-full gap-6">
            <div className="flex-1 bg-gradient-to-b from-cyan-900/40 to-slate-900 p-6 rounded-2xl border border-cyan-500 text-center relative overflow-hidden">
              <div className="text-4xl mb-3">📁</div>
              <h4 className="text-2xl font-bold text-cyan-400 mb-3">نظام إدارة المحتوى (CMS)</h4>
              <p>بيركز على <strong className="text-white">إنشاء المحتوى</strong> وتخزينه والبحث فيه.</p>
            </div>
            
            <div className="flex items-center justify-center text-4xl text-slate-500 font-bold">VS</div>

            <div className="flex-1 bg-gradient-to-b from-purple-900/40 to-slate-900 p-6 rounded-2xl border border-purple-500 text-center relative overflow-hidden">
              <div className="text-4xl mb-3">🎓</div>
              <h4 className="text-2xl font-bold text-purple-400 mb-3">نظام إدارة المقرر (Course MS)</h4>
              <p>أكثر تطوراً! بيركز على <strong className="text-white">إدارة المقررات التعليمية والأنشطة</strong>، وفيه أدوات اتصال وتشارك واختبارات.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال على السريع 🏃‍♂️",
      question: "مين فيهم النظام الأكتر تطوراً واللي بيشمل أدوات تقييم واختبارات وعمل تشاركي؟",
      options: [
        { text: "نظام إدارة المحتوى (CMS - Content)", correct: false },
        { text: "نظام إدارة المقرر (CMS - Course)", correct: true }
      ]
    },
    {
      title: "ثالثاً: نظام إدارة محتوى التعلم (LCMS) 🧩",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-3xl font-bold text-emerald-400 mb-4">Learning Content Management System</p>
          <div className="bg-emerald-900/20 p-5 rounded-2xl border border-emerald-500/30">
            <p>من اسمه، ده "الخلاط" اللي جمع بين المحتوى والتعلم! بيئة متعددة المستخدمين لإنشاء وتخزين واستخدام وإعادة استخدام المحتوى التعليمي.</p>
          </div>
          <p><strong>بيدي قدرة لمين؟</strong> (للمؤلفين، والمصممين التعليميين، وخبراء المادة). بيعملولنا <strong>مستودع (Repository)</strong> فيه العناصر التعليمية (Learning Objects) عشان نتحكم فيها ونجمعها حسب أداء المتعلم.</p>
          <p className="text-emerald-300">والميزة كمان إنه ممكن يخلي المتعلمين يضيفوا للمحتوى ويتبادلوا المعرفة، وفيه تفاعلية تكسر الملل.</p>
          <h4 className="text-xl font-bold text-cyan-400 mt-4">وظائفه الأساسية:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm md:text-base columns-1 sm:columns-2">
            <li>قوالب تطوير وتطوير تشاركي.</li>
            <li>تسهيلات إدارة المحتوى.</li>
            <li>النشر وتوصيل المحتوى.</li>
            <li>تكامل خطة سير العمل.</li>
            <li>الربط بواجهة إدارة التعلم.</li>
          </ul>
        </div>
      )
    },
    {
      title: "الملامح الرئيسية لـ (LCMS) 🌟",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">النظام ده بيتميز بـ 4 تطبيقات أساسية:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-emerald-500">
              <strong className="text-emerald-400 block mb-1">1. مستودع كائنات التعلم (LOR):</strong>
              قاعدة بيانات مركزية لتخزين الكائنات وإدارتها. نقدر نستخدمها لوحدها أو جوه موديول أكبر كذا مرة.
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-cyan-500">
              <strong className="text-cyan-400 block mb-1">2. تطبيق التأليف الآلي:</strong>
              بيدي المؤلفين قوالب ولوحات أحداث عشان يصمموا محتوى باستخدام الكائنات اللي في المستودع أو يعملوا جديد.
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-purple-500">
              <strong className="text-purple-400 block mb-1">3. واجهة التوصيل الديناميكية:</strong>
              تخدم كائنات التعلم بناءً على البروفايل بتاع الطالب واختباراته، وبتوصله بمصادر وتقويم مناسبين ليه.
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border-t-2 border-pink-500">
              <strong className="text-pink-400 block mb-1">4. التطبيق الإداري:</strong>
              بيدير سجلات الطلاب، يطلق المقررات، يتبع التقدم، ويطلع تقارير.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "رابعاً: نظام تخطيط المؤسسات (ERP School) 🏢",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-3xl font-bold text-blue-400 mb-4">Enterprise Resource Planning</p>
          <p>لو بصينا للمدرسة كـ "مؤسسة كاملة"، فهنحتاج نظام يدير كل حاجة مش بس التعليم! ده اللي بيعمله الـ ERP.</p>
          <div className="bg-blue-900/20 p-5 rounded-2xl border border-blue-500/30">
            <p><strong>الهدف منه:</strong> تلبية أهداف المؤسسة بإدارة شاملة لكل الأقسام، وتبسيط العمليات وتوفير كفاءة.</p>
          </div>
          <p className="font-bold text-cyan-300">الـ ERP بيدير إيه بالظبط؟</p>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <li className="flex items-center gap-2"><span className="text-blue-500">✔️</span> تسجيل وقبول الطلاب (أونلاين).</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">✔️</span> شئون الطلاب (غياب ومتابعة).</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">✔️</span> حسابات ومصروفات الطالب.</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">✔️</span> الحسابات العامة والميزانية.</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">✔️</span> شئون الموظفين (HR).</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">✔️</span> الكنترول والامتحانات.</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">✔️</span> المكتبة والعيادة والمخازن.</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">✔️</span> النقل (أتوبيسات المدرسة).</li>
          </ul>
        </div>
      )
    },
    {
      title: "مزايا الـ ERP ونموذج (سكوليرا Skolera) 🏫",
      content: (
        <div className="space-y-4 text-sm md:text-base leading-relaxed text-slate-300">
          <p className="text-cyan-300 font-bold text-lg">إيه مزايا الـ ERP؟</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800/40 p-3 rounded-lg border-r-2 border-cyan-500"><strong>إدارة الغياب:</strong> إلكتروني بدل الدفاتر اللي بتضيع وقت وتتلف.</div>
            <div className="bg-slate-800/40 p-3 rounded-lg border-r-2 border-purple-500"><strong>تواصل أولياء الأمور:</strong> رسايل وإيميلات بتسد الفجوة وتعرفهم كل جديد.</div>
            <div className="bg-slate-800/40 p-3 rounded-lg border-r-2 border-pink-500"><strong>إدارة بيانات الطالب:</strong> من قبل ما يسجل لحد ما يتخرج (صحة، مديونية، خصومات).</div>
            <div className="bg-slate-800/40 p-3 rounded-lg border-r-2 border-emerald-500"><strong>إدارة الامتحانات:</strong> أونلاين برا أو جوه الفصل، وتصحيح وإرسال النتيجة فوراً.</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 p-5 rounded-2xl border border-blue-500 shadow-lg mt-6">
            <h4 className="text-2xl font-bold text-blue-400 mb-2 flex items-center gap-2"><span>💠</span> نظام سكوليرا Skolera</h4>
            <p>نموذج جامد جداً لنظام الـ ERP. بيدير المؤسسة والعمليات اليومية (مخازن، أولياء أمور، أرباح، موظفين، حسابات)، وبيخلي المدرسة تشتغل بكفاءة عالية جداً.</p>
          </div>
        </div>
      )
    },
    {
      title: "إمكانيات نظام سكوليرا (أدوات إدارية) 🛠️",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-300">
          <p className="text-lg text-blue-300 font-bold mb-2">النظام ده متوحش إدارياً، بص بيعمل إيه:</p>
          <ul className="space-y-2">
            <li className="bg-slate-800/60 p-3 rounded-xl"><strong className="text-white">📱 تطبيق الجوال:</strong> شغال على iOS و Android بوصلات متعددة اللغات.</li>
            <li className="bg-slate-800/60 p-3 rounded-xl"><strong className="text-white">👁️ إشراف مستمر:</strong> رؤساء الأقسام بيشوفوا التقارير والدرجات ويقيموا المدرسين والطلاب.</li>
            <li className="bg-slate-800/60 p-3 rounded-xl"><strong className="text-white">🧩 تصميم مناهج تفاعلية:</strong> أدوات زي محرر محتوى، ميديا، ومصادر تعليمية.</li>
            <li className="bg-slate-800/60 p-3 rounded-xl"><strong className="text-white">🏢 تخطيط وإدارة القسم والمدرسة:</strong> تحديث بيانات المدرسة، الأقسام، والفصول بسهولة.</li>
            <li className="bg-slate-800/60 p-3 rounded-xl"><strong className="text-white">👥 إدارة بيانات المستخدمين:</strong> تعيين باسوورد، تنشيط حسابات، وتوزيع في فئات.</li>
            <li className="bg-slate-800/60 p-3 rounded-xl"><strong className="text-white">📋 سجلات الطلاب والجدول:</strong> تبسيط الحضور والدرجات. وإنشاء الجداول الزمنية تلقائي.</li>
            <li className="bg-slate-800/60 p-3 rounded-xl"><strong className="text-white">💰 الرسوم والفواتير والرواتب:</strong> إشراف كامل على مالية المدرسة والنفقات.</li>
          </ul>
        </div>
      )
    },
    {
      title: "إمكانيات سكوليرا (أدوات التعليم والتعلم) 📚",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-300">
          <p className="text-lg text-emerald-300 font-bold mb-2">بالنسبة بقى للتدريس، فيه أدوات رهيبة:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-slate-800/40 p-3 rounded-xl border border-emerald-500/20"><strong className="text-emerald-400">🎮 الألعاب:</strong> شارات (Badges) لتحفيز الطلاب في بيئة تنافسية.</div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-emerald-500/20"><strong className="text-emerald-400">💯 دفتر الدرجات:</strong> بيحسب تلقائي المهام والاختبارات وبيوريه للكل عشان يتابعوا التقدم.</div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-emerald-500/20"><strong className="text-emerald-400">🤝 مجموعة النشاط:</strong> طلاب ومعلمين بيشاركوا أفكار ويخططوا لأنشطة سوا.</div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-emerald-500/20"><strong className="text-emerald-400">📅 خطة الدورة:</strong> خطة للسنة كلها بنوزع عليها المحتوى والتقييمات.</div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-emerald-500/20"><strong className="text-emerald-400">📈 تقديم الدورة:</strong> رصد أداء وموقف وحضور الفصل من قبل المعلم.</div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-emerald-500/20"><strong className="text-emerald-400">📁 مشاركة المحتوى:</strong> المدرس يرفع ملفات والطالب يحملها.</div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-emerald-500/20"><strong className="text-emerald-400">📝 خطة الدرس:</strong> أهداف، منهجيات، مفردات، وتقييم.</div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-emerald-500/20"><strong className="text-emerald-400">✅ إدارة عمل الطلاب:</strong> بتجمع المهام والمشاريع والاختبارات للطالب عشان ميتوهش.</div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-emerald-500/20 sm:col-span-2 text-center"><strong className="text-emerald-400">🗺️ مخطط الدورة:</strong> الطالب بيشوف المنهج الحالي والسابق والقادم لكل وحدة.</div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال مسك الختام 🏆",
      question: "نظام سكوليرا (Skolera) بيعتبر مثال على أي نوع من الأنظمة اللي بتدير المؤسسة التعليمية بكافة قطاعاتها (حسابات، مخازن، شؤون طلاب)؟",
      options: [
        { text: "نظام إدارة المحتوى (CMS)", correct: false },
        { text: "نظام تخطيط موارد المؤسسات التعليمية (ERP School)", correct: true }
      ]
    },
    {
      title: "النهاية السعيدة للفصل الثاني 🥳",
      content: (
        <div className="space-y-6 text-lg text-center flex flex-col items-center justify-center min-h-[350px] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent rounded-3xl pointer-events-none"></div>
          <div className="text-7xl mb-4 animate-bounce">🎓</div>
          <p className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            ألف مبرووووك يا وحش! 💪
          </p>
          <p className="text-slate-400 text-xl max-w-lg">فرمنا الفصل الثاني كله، عرفنا الأنظمة كلها من الـ CMS لحد الـ ERP وسكوليرا ومسبناش معلومة واحدة!</p>
          <p className="text-cyan-500 mt-2 font-bold animate-pulse">دوس على الزرار اللي تحت عشان تقفل الدرس وتستلم شهادتك! 👇</p>
          
          <button 
            onClick={handleFinish}
            className="mt-8 px-12 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-2xl font-bold rounded-2xl shadow-[0_0_30px_rgba(8,145,178,0.5)] hover:shadow-[0_0_50px_rgba(8,145,178,0.8)] transform transition-all hover:scale-105 active:scale-95 border border-cyan-400/50 z-10"
          >
            إنهاء الكورس 🏁
          </button>
        </div>
      )
    }
  ];

  const currentSlideData = slides[currentSlide];

  if (isFinished) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0a0f1c] to-[#0a0f1c]"></div>
        
        <div className="bg-slate-800/60 backdrop-blur-xl p-12 rounded-3xl shadow-[0_0_50px_rgba(8,145,178,0.2)] text-center max-w-xl w-full border border-cyan-500/30 transform transition-all scale-100 relative z-10">
          <div className="text-7xl mb-6">🏆</div>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 drop-shadow-lg">إنجاز عظيم!</h2>
          <p className="text-2xl text-slate-300 mb-10 leading-relaxed">لقد أتممت دراسة الفصل الثاني بالكامل، وبقيت خبير في نظم إدارة التعلم الرقمي! 🚀</p>
          <button 
            onClick={() => {setIsFinished(false); setCurrentSlide(0); setQuizAnswers({}); setShowFeedback({});}}
            className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-cyan-400 rounded-xl font-bold text-xl hover:text-cyan-300 transition-all hover:shadow-[0_0_20px_rgba(8,145,178,0.3)]"
          >
            إعادة الدرس 🔄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#0B1121] text-slate-200 font-sans flex flex-col relative h-screen overflow-hidden selection:bg-cyan-500/30">
      
      {/* خلفية لومينوفا التفاعلية */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* مودال الخروج */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1121]/80 backdrop-blur-md p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8 max-w-sm w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <div className="text-6xl mb-4">🚪</div>
            <h3 className="text-2xl font-bold text-white mb-2">متأكد إنك عايز تخرج؟</h3>
            <p className="text-slate-400 mb-8">كل التقدم بتاعك في الفصل الثاني هيضيع يا بطل!</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={confirmExit}
                className="flex-1 py-3 bg-red-600/20 text-red-400 border border-red-500/50 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              >
                أيوه، اخرج
              </button>
              <button 
                onClick={cancelExit}
                className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-all"
              >
                لأ، كمل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* الرأس (Header) */}
      <div className="flex justify-between items-center p-5 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 z-20 shrink-0 shadow-lg">
        <h1 className="text-lg md:text-2xl font-bold flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.4)]">
            <span className="text-xl text-white">💠</span>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 hidden sm:inline">إدارة التعلم - لومينوفا</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 sm:hidden">الفصل الثاني</span>
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full flex items-center gap-2">
            <span className="text-cyan-400 font-bold">{currentSlide + 1}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{slides.length}</span>
          </div>
          <button 
            onClick={handleExitClick}
            className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 rounded-xl font-bold transition-all flex items-center gap-2 text-sm md:text-base hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            خروج 🚪
          </button>
        </div>
      </div>

      {/* شريط التقدم */}
      <div className="absolute top-[72px] left-0 w-full h-1 bg-slate-800 z-30">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        ></div>
      </div>

      {/* محتوى الشريحة مع سكرولر مخصص */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 custom-scrollbar">
        <div className={`max-w-5xl mx-auto bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 md:p-12 min-h-[60vh] border border-slate-700/50 transition-opacity duration-500 ${animateSlide ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 border-b border-slate-700 pb-6 leading-tight tracking-wide drop-shadow-md">
            {currentSlideData.title}
          </h2>
          
          {currentSlideData.type === 'quiz' ? (
            <div className="bg-[#0B1121]/50 p-6 md:p-10 rounded-3xl border border-cyan-900/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 blur-2xl rounded-full"></div>
              <p className="text-2xl md:text-3xl font-bold mb-10 text-cyan-300 leading-relaxed relative z-10">{currentSlideData.question}</p>
              
              <div className="space-y-5 relative z-10">
                {currentSlideData.options.map((opt, idx) => {
                  const isAnswered = showFeedback[currentSlide];
                  const isThisSelectedAndCorrect = quizAnswers[currentSlide] === true && opt.correct;
                  const isThisSelectedAndWrong = quizAnswers[currentSlide] === false && !opt.correct;
                  
                  let btnClass = "w-full text-right p-6 rounded-2xl font-bold text-xl border-2 transition-all duration-300 focus:outline-none flex items-center justify-between group ";
                  if (!isAnswered) {
                    btnClass += "bg-slate-800/80 border-slate-600 hover:border-cyan-400 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer";
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
                      {!isAnswered && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">👈</span>}
                      {isAnswered && opt.correct && <span className="text-2xl">✅</span>}
                      {isAnswered && isThisSelectedAndWrong && <span className="text-2xl">❌</span>}
                    </button>
                  );
                })}
              </div>
              
              {showFeedback[currentSlide] && (
                <div className={`mt-8 p-6 rounded-2xl font-bold text-2xl text-center flex items-center justify-center gap-4 animate-fade-in-up border ${quizAnswers[currentSlide] ? 'bg-emerald-900/50 border-emerald-500/50 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-rose-900/50 border-rose-500/50 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]'}`}>
                  {quizAnswers[currentSlide] ? (
                    <><span>عاش جداً! إجابة صحيحة</span> <span className="text-3xl animate-bounce">🏆</span></>
                  ) : (
                    <><span>للأسف إجابة خاطئة! ركز أكتر المرة الجاية</span> <span className="text-3xl">😅</span></>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="relative z-10">
              {currentSlideData.content}
            </div>
          )}
        </div>
      </div>

      {/* أزرار التحكم - ثابتة في الأسفل */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-4 bg-slate-900/80 backdrop-blur-xl p-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-slate-700 w-[90%] max-w-md justify-between items-center">
        <button 
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
          className={`flex-1 py-3 px-6 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 ${currentSlide === slides.length - 1 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_15px_rgba(8,145,178,0.5)] hover:shadow-[0_0_25px_rgba(8,145,178,0.8)] active:scale-95'}`}
        >
          <span>التالي</span>
          <span className="text-xl leading-none">&larr;</span>
        </button>
        
        <div className="w-px h-8 bg-slate-700"></div>

        <button 
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className={`flex-1 py-3 px-6 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 ${currentSlide === 0 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600 hover:border-slate-500 active:scale-95'}`}
        >
          <span className="text-xl leading-none">&rarr;</span>
          <span>السابق</span>
        </button>
      </div>

      {/* استايل السكرولر المخصص */}
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