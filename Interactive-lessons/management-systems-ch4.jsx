import React, { useState, useEffect } from 'react';

export default function SmartLearningChapter4() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [animateSlide, setAnimateSlide] = useState(false);

  // تأثير حركي ناعم وسريع عند التقليب
  useEffect(() => {
    setAnimateSlide(true);
    const timer = setTimeout(() => setAnimateSlide(false), 250);
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

  // بيانات الفصل الرابع - منظمة للفهم العميق وبدون حشو ممل
  const slides = [
    {
      title: "مقدمة الفصل الرابع 🚀",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="text-center mb-6"><span className="text-7xl animate-pulse inline-block drop-shadow-lg">🧠</span></div>
          <p className="text-3xl font-bold text-cyan-400 mb-6 text-center">أهلاً بيك في عالم المستقبل!</p>
          <p>في الفصول اللي فاتت اتكلمنا عن الأنظمة العادية اللي بتدير الكورسات. هنا بقى إحنا داخلين منطقة تانية خالص.. منطقة <strong className="text-purple-400 text-xl bg-purple-900/30 px-2 rounded">نظم إدارة التعليم الذكية (SEMS)</strong>.</p>
          
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-md mt-6">
            <h4 className="text-xl text-emerald-400 font-bold mb-4">في الفصل ده هنفهم (مش هنحفظ):</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3"><span className="text-cyan-500">💠</span> يعني إيه سيستم "ذكي" وإيه اللي بيميزه؟</li>
              <li className="flex items-center gap-3"><span className="text-cyan-500">💠</span> إزاي الذكاء الاصطناعي بيتدخل في الجداول، الغياب، والدرجات؟</li>
              <li className="flex items-center gap-3"><span className="text-cyan-500">💠</span> إزاي بنحمي الداتا دي كلها (أمن سيبراني)؟</li>
              <li className="flex items-center gap-3"><span className="text-cyan-500">💠</span> المقارنة الجوهرية: إيه الفرق بين SEMS و ERP؟</li>
            </ul>
          </div>
          <p className="text-center text-cyan-300 font-bold mt-4">جاهز نشغل الدماغ؟ يلا بينا! 😉</p>
        </div>
      )
    },
    {
      title: "إيه هي نظم التعليم الذكية (SEMS)؟ 💡",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p>تخيل إن السيستم مش مجرد موقع بتفتح عليه الكورسات.. لأ، ده سيستم <strong className="text-cyan-400 text-xl">بيفهمك، بيحلل بياناتك، وبيتوقع تصرفاتك!</strong></p>
          
          <div className="bg-slate-800/60 p-5 rounded-2xl border-r-4 border-emerald-500 shadow-sm">
            <strong className="text-emerald-400 text-xl block mb-2">التعريف الأكاديمي:</strong>
            <p>هي بيئة تكنولوجية بتستخدم (التحليلات البيانية والذكاء الاصطناعي AI) عشان تفحص بياناتك التعليمية، وتحدد نمط التعلم المناسب ليك، وتوفرلك <strong>توجيه فردي مخصوص</strong> عشان تحسن نتيجتك.</p>
          </div>

          <h4 className="text-xl font-bold text-white mt-4">وظائفها الأساسية الـ 4:</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-cyan-300 block mb-1">1. توجيه التعلم</strong>
              <p className="text-sm">بيفهم احتياجاتك ويوجهك لمصادر متفصلة عليك.</p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-cyan-300 block mb-1">2. تقييم الطالب (وتدخل)</strong>
              <p className="text-sm">بيديك تقارير تفصيلية وبيتدخل لو لقاك محتاج مساعدة.</p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-cyan-300 block mb-1">3. تحسين الأداء</strong>
              <p className="text-sm">بيحسن طرق التدريس نفسها بناءً على تحليل الداتا.</p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-cyan-300 block mb-1">4. تكامل التكنولوجيا</strong>
              <p className="text-sm">بيعتمد على البيانات الضخمة (Big Data) والـ AI.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "1. التسجيل وإدارة المتقدمين (النسخة الذكية) 📝",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-purple-400 font-bold mb-4">أي سيستم بيبدأ بالتسجيل، بس هنا التسجيل مش مجرد داتا إنتري!</p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <div className="text-3xl text-cyan-400">📊</div>
              <div>
                <strong className="text-cyan-300 text-xl block mb-1">تحليل البيانات والتقارير</strong>
                <p className="text-base">النظام بيجمع ويحلل بيانات المتقدمين عشان الإدارة تاخد قرارات صح (مثلاً: نعرف أكتر طلاب بيقدموا من أي منطقة أو أي مدرسة عشان نستهدفهم صح).</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <div className="text-3xl text-purple-400">🌍</div>
              <div>
                <strong className="text-purple-300 text-xl block mb-1">دعم متعدد اللغات</strong>
                <p className="text-base">لو الجامعة دولية، واجهة التسجيل بتتغير تلقائي للغة الطالب عشان تعزز تجربته وميحسش بغربة.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <div className="text-3xl text-emerald-400">🔗</div>
              <div>
                <strong className="text-emerald-300 text-xl block mb-1">التكامل (Integration) المباشر</strong>
                <p className="text-base">بمجرد ما الطالب يتقبل، بياناته بتترمي <strong>أوتوماتيك</strong> في نظام الطلاب، ونظام الدعم الفني، والإيميلات.. مفيش حاجة اسمها إدخال يدوي يضيع الوقت!</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "2. إدارة الفصول والجداول 📅",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">تنظيم الوقت والمكان من غير أي لخبطة:</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-xl border-t-2 border-cyan-500">
              <strong className="text-white text-lg block mb-1">🏫 إدارة الفصول والمقررات</strong>
              <p className="text-sm">تحديد اسم المقرر، وحداته، مواضيعه، وتخصيص المدرس المناسب لكل فصل بتفاصيل دقيقة.</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border-t-2 border-cyan-500">
              <strong className="text-white text-lg block mb-1">⏱️ تحديد الجدول الزمني</strong>
              <p className="text-sm">تحديد أوقات الحصص، العملي، الورش، والامتحانات، وربطها بنظام التسجيل عشان الطالب يشوف متاح إيه.</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border-t-2 border-cyan-500">
              <strong className="text-white text-lg block mb-1">🏢 إدارة القاعات والموارد</strong>
              <p className="text-sm">حجز المعامل والمرافق حسب النشاط، عشان نتجنب إن دكتورين يحجزوا نفس القاعة في نفس الوقت!</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border-t-2 border-cyan-500">
              <strong className="text-white text-lg block mb-1">📱 معلومات للطالب</strong>
              <p className="text-sm">واجهة للطالب يشوف فيها جدوله، أهداف المقرر، المراجع، وإشعارات لو حصل أي تحديث.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "سحر الذكاء الاصطناعي في الجداول ✨",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl text-purple-400 font-bold mb-4 border-b border-slate-700 pb-2">هنا بتظهر "الذكاء" الحقيقي في السيستم:</p>
          
          <div className="bg-gradient-to-l from-purple-900/30 to-slate-900 p-6 rounded-2xl border border-purple-500/50 shadow-md mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">🔮</div>
              <h4 className="text-xl font-bold text-white">التنبؤ بالازدحام (Crowd Prediction)</h4>
            </div>
            <p className="text-base text-slate-300">النظام يقدر <strong>يتوقع</strong> إن الكورس الفلاني هيبقى عليه إقبال تاريخي الترم ده، فيقوم يحددله قاعة أكبر، أو يغير ميعاده عشان يتجنب التداخل والزحمة من قبل ما تحصل!</p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <span className="text-emerald-400 text-xl">🚦</span>
              <div><strong className="text-white">التحكم في السعة:</strong> بيحدد سعة كل فصل، ويبعت تحذير لو العدد زاد عن حده.</div>
            </li>
            <li className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <span className="text-emerald-400 text-xl">🔔</span>
              <div><strong className="text-white">تحديث دوري وإشعارات:</strong> لو الدكتور غاب والجدول اتغير، بيتبعت إشعار فوراً للطلاب.</div>
            </li>
            <li className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <span className="text-emerald-400 text-xl">📊</span>
              <div><strong className="text-white">تقارير التحليل:</strong> بيحلل استخدام القاعات عشان الجامعة تستفيد من مساحاتها صح.</div>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "3. التقييم والتقويم (أعمق من مجرد امتحان) 📝",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">إزاي بنمتحن ونقيم في النظام الذكي؟ الموضوع مش ورقة وقلم:</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <strong className="text-cyan-400 text-lg block mb-1">🎯 الأهداف والمقررات</strong>
              <p className="text-sm">إدراج تفاصيل شاملة حول الأهداف، المحتوى، والمهارات المستهدفة.</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <strong className="text-pink-400 text-lg block mb-1">💻 الواجبات والمشروعات</strong>
              <p className="text-sm">تحديد مواعيد تسليم، وزن التكليف من الدرجة، وآليات لتقييم العمل الجماعي والعملي.</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <strong className="text-emerald-400 text-lg block mb-1">✅ الاختبارات والتصحيح</strong>
              <p className="text-sm">إعداد اختبارات إلكترونية وتوفير توجيهات وتصحيح "آلي" لتسريع عملية التقييم.</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <strong className="text-amber-400 text-lg block mb-1">🧮 إعداد نظام الدرجات</strong>
              <p className="text-sm">تحديد أنظمة درجات مختلفة (نسب مئوية أو رقمية) وتوفير حاسبة تلقائية لحساب المعادلات.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "الذكاء الاصطناعي في التقييم (المنقذ) 🦸‍♂️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-rose-400 font-bold mb-4">أهم حتة في التقييم الذكي.. النظام مش بيسيبك تغرق!</p>
          
          <div className="bg-rose-900/20 p-5 rounded-2xl border-l-4 border-rose-500 shadow-md mb-4">
            <h4 className="text-xl font-bold text-rose-300 mb-2 flex items-center gap-2"><span>🆘</span> تكامل مع أنظمة الدعم الطلابي</h4>
            <p className="text-slate-300 text-base">لو النظام حلل درجاتك ولقاك بتقع، بيبعت <strong className="text-white bg-rose-500/50 px-1 rounded">إشعار تلقائي للمرشد الأكاديمي</strong> يقوله "الحق الطالب ده بيواجه صعوبات"، عشان يتدخل ويساعدك قبل ما تسقط!</p>
          </div>

          <ul className="space-y-3 text-base">
            <li className="bg-slate-800/40 p-3 rounded-lg border border-slate-700">
              <strong className="text-cyan-300">💬 توفير تعليقات فورية:</strong> النظام يتيح للمدرسين تقديم تعليقات فورية للطالب لتصحيح أخطائه.
            </li>
            <li className="bg-slate-800/40 p-3 rounded-lg border border-slate-700">
              <strong className="text-cyan-300">📈 تقارير أداء:</strong> تقارير تفصيلية لتتبع تقدم الطالب على مدار الوقت.
            </li>
            <li className="bg-slate-800/40 p-3 rounded-lg border border-slate-700">
              <strong className="text-cyan-300">🧠 تقارير تحليلية للإدارة:</strong> بيحلل الداتا عشان يقول للمدرس "الموضوع الفلاني الطلاب مش فاهماه، محتاجين نعيد شرحه أو نطوره".
            </li>
          </ul>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال للناس المركزة 🧠",
      question: "لو سيستم الجامعة لاحظ إن في طالب درجاته بتقل جداً، فقام باعت رسالة تحذير للمرشد الأكاديمي عشان يلحقه. دي بتعتبر وظيفة إيه؟",
      options: [
        { text: "التنبؤ بالازدحام في الجداول.", correct: false },
        { text: "التكامل مع أنظمة الدعم الطلابي.", correct: true },
        { text: "حاسبة الدرجات التلقائية.", correct: false }
      ]
    },
    {
      title: "4. أنظمة التواصل والتفاعل 💬",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">عشان الطالب ميحسش إنه بيكلم ماكينة، لازم بيئة تفاعلية حية:</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-slate-800/50 p-3 rounded-xl text-center border border-slate-700">
              <div className="text-2xl mb-1 text-cyan-400">💬</div>
              <strong className="text-white block text-sm">منصات دردشة ومنتديات</strong>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl text-center border border-slate-700">
              <div className="text-2xl mb-1 text-purple-400">📧</div>
              <strong className="text-white block text-sm">رسائل وإشعارات فورية</strong>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl text-center border border-slate-700">
              <div className="text-2xl mb-1 text-blue-400">🌐</div>
              <strong className="text-white block text-sm">منصات تواصل اجتماعي</strong>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl text-center border border-slate-700">
              <div className="text-2xl mb-1 text-yellow-400">⭐</div>
              <strong className="text-white block text-sm">نظام تعليقات وتقييم</strong>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl text-center border border-slate-700">
              <div className="text-2xl mb-1 text-rose-400">🎥</div>
              <strong className="text-white block text-sm">دروس افتراضية وندوات</strong>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl text-center border border-slate-700">
              <div className="text-2xl mb-1 text-emerald-400">📁</div>
              <strong className="text-white block text-sm">تقاسم الملفات والموارد</strong>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "إضافات مميزة جداً في التواصل 🌟",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">النظام الذكي بيقدم حبشتكنات تانية بتفرق جداً في التجربة:</p>
          
          <div className="space-y-4">
            <div className="bg-slate-800/60 p-4 rounded-2xl border-r-4 border-cyan-500 flex gap-4 items-center">
              <div className="text-3xl text-cyan-400">📅</div>
              <div>
                <strong className="text-white text-lg block">التقويم الأكاديمي المشترك (Calendar)</strong>
                <p className="text-sm text-slate-400">نتيجة واحدة ظاهرة للدفعة كلها، عليها مواعيد الامتحانات والمشاريع، عشان محدش يقول "مكونتش أعرف!".</p>
              </div>
            </div>
            
            <div className="bg-slate-800/60 p-4 rounded-2xl border-r-4 border-purple-500 flex gap-4 items-center">
              <div className="text-3xl text-purple-400">🎨</div>
              <div>
                <strong className="text-white text-lg block">مساحات للتعبير الفني</strong>
                <p className="text-sm text-slate-400">مكان مخصص للإبداع، عشان نحفز الطلاب يشاركوا مواهبهم وإبداعاتهم برا المنهج الدراسي.</p>
              </div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border-r-4 border-emerald-500 flex gap-4 items-center">
              <div className="text-3xl text-emerald-400">📞</div>
              <div>
                <strong className="text-white text-lg block">تواصل صوتي وفيديو فوري</strong>
                <p className="text-sm text-slate-400">مكالمات فيديو سريعة للمناقشات الجماعية، مع توفير تقارير وتحليلات حول استخدام أنظمة التواصل لتحديد التحسينات.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "5. الإدارة المالية (الفلوس) 💰",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">الإدارة المالية دي مش مجرد دفع مصاريف. دي سيستم كامل بيتابع كل مليم داخل وطالع للمؤسسة:</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-emerald-400 text-lg block mb-1">📊 نظام الميزانية ومتابعة التكاليف</strong>
              <p className="text-sm">إدارة ميزانية كل قسم/كلية، وتسجيل ومتابعة التكاليف (أبحاث، بنية تحتية) لتقديم تقارير دورية.</p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-emerald-400 text-lg block mb-1">💳 إدارة أموال الطلاب والرسوم</strong>
              <p className="text-sm">تحديد الرسوم، سياسات الخصم، وتوفير وسائل دفع وتسجيل إلكتروني آمن وفعال.</p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-emerald-400 text-lg block mb-1">🎓 تقديم المنح والمساعدات</strong>
              <p className="text-sm">نظام بيتحقق من "أهلية" الطالب (هل يستحق منحة ولا لأ؟) وبيدير العملية بالكامل.</p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <strong className="text-emerald-400 text-lg block mb-1">📄 العقود والأجور والإيرادات</strong>
              <p className="text-sm">تتبع المشتريات، وتحديد رواتب الدكاترة إلكترونياً، ومراقبة مصادر الدخل (رسوم، تبرعات).</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "6. المكتبات والموارد 📚",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300 flex flex-col justify-center h-full">
          <div className="bg-gradient-to-r from-amber-900/30 to-slate-900 p-8 rounded-3xl border border-amber-500/30 shadow-lg relative overflow-hidden">
            <div className="absolute left-4 top-4 text-8xl opacity-10">📖</div>
            <h4 className="text-3xl font-bold text-amber-400 mb-4">المكتبة الرقمية وإدارة الموارد</h4>
            <ul className="space-y-3 text-base">
              <li className="flex items-center gap-2"><span className="text-amber-500">✔️</span> تنظيم الكتب والمقالات الرقمية بواجهة بحث سهلة.</li>
              <li className="flex items-center gap-2"><span className="text-amber-500">✔️</span> تسجيل الإصدارات والنسخ المتاحة وتحديثها تلقائياً.</li>
              <li className="flex items-center gap-2"><span className="text-amber-500">✔️</span> <strong>نظام الإعارة والاستعارة:</strong> تتبع الكتب المعارة للطلاب والدكاترة وتحديد فترات الإعادة.</li>
              <li className="flex items-center gap-2"><span className="text-amber-500">✔️</span> تنظيم المحتوى التعليمي الرقمي وتتبع تقدم الطالب فيه.</li>
              <li className="flex items-center gap-2"><span className="text-amber-500">✔️</span> إدارة البيانات والأرشفة للوصول السريع للمعلومات.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "7. تتبع الحضور والغياب (التقيل كله) ⏱️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-700 pb-2">زمن كشف الغياب الورقي ومين قال "حاضر" انتهى! هنا الحضور تقني جداً:</p>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
              <div className="text-3xl text-cyan-400">✍️</div>
              <div>
                <strong className="text-white block">التسجيل والتوقيع الرقمي</strong>
                <p className="text-sm text-slate-400">التحقق من هوية الطالب اللي بيحضر.</p>
              </div>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
              <div className="text-3xl text-rose-400">🔕</div>
              <div>
                <strong className="text-white block">تنبيهات الغياب</strong>
                <p className="text-sm text-slate-400">إشعار تلقائي للطالب لو متسجلش حاضر.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 p-5 rounded-2xl border-l-4 border-blue-500 shadow-md">
            <strong className="text-blue-300 text-xl block mb-2 flex items-center gap-2"><span>📍</span> تكنولوجيا الموقع الجغرافي (Geolocation)</strong>
            <p className="text-slate-300 text-base">مفيش حاجة اسمها "اكتبني حاضر معاك وأنا في البيت". النظام بيستخدم الـ GPS أو البطاقات الذكية عشان يتأكد إن الطالب <strong>دخل فعلياً مبنى الجامعة</strong> أو قاعة المحاضرات قبل ما يسجله حاضر!</p>
          </div>
        </div>
      )
    },
    {
      title: "الذكاء الاصطناعي في الغياب! 🤖",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">الموضوع مش مجرد تسجيل، ده تحليل للمستقبل:</p>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="text-3xl text-purple-400 mt-1">🔮</div>
              <div>
                <strong className="text-purple-300 text-lg block mb-1">تقنيات الذكاء الاصطناعي للتحليل (التنبؤ)</strong>
                <p className="text-sm text-slate-400">بيحلل نمط غيابك، ويقدر <strong className="text-white">"يتنبأ"</strong> إنك احتمال تسقط أو تسيب الكورس، فبينبه المدرس!</p>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="text-3xl text-emerald-400 mt-1">🛡️</div>
              <div>
                <strong className="text-emerald-300 text-lg block mb-1">الخصوصية والأمان</strong>
                <p className="text-sm text-slate-400">عشان الـ GPS بيجمع بيانات مكانك الشخصية، النظام بياخد إجراءات أمان قوية جداً لحمايتها.</p>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="text-3xl text-pink-400 mt-1">🔴</div>
              <div>
                <strong className="text-pink-300 text-lg block mb-1">تقارير حية (Live) وتكامل</strong>
                <p className="text-sm text-slate-400">المدرس شايف تقارير فورية على الشاشة بمين حاضر في اللحظة دي، مربوط بجدول المحاضرات.</p>
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال عالطاير 🦅",
      question: "عشان الجامعة تتأكد إن الطالب مبيغشش في الحضور وموجود فعلاً في المبنى، النظام الذكي بيستخدم إيه؟",
      options: [
        { text: "تشفير البيانات (Encryption)", correct: false },
        { text: "التوقيع الرقمي وتكنولوجيا الـ GPS", correct: true },
        { text: "تسجيل النشاطات (Logs)", correct: false }
      ]
    },
    {
      title: "8. الأمان وحماية البيانات (أمن سيبراني) 🛡️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-cyan-300 font-bold mb-4">كل الداتا الخطيرة دي (درجات، فلوس، مواقع جغرافية) لازم تتحمي بحديد. إزاي؟</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <strong className="text-white text-lg block mb-1">🔐 تشفير البيانات</strong>
              <p className="text-sm text-slate-400">تشفير قواعد البيانات والملفات أثناء النقل والحفظ عشان تفضل سرية.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <strong className="text-white text-lg block mb-1">🔑 صلاحيات الوصول</strong>
              <p className="text-sm text-slate-400">مش أي حد يشوف أي حاجة. كل مستخدم ليه صلاحيات دقيقة حسب دوره.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <strong className="text-white text-lg block mb-1">📜 تسجيل النشاطات (Logs)</strong>
              <p className="text-sm text-slate-400">النظام بيسجل كل حركة بتحصل، عشان لو حصل اختراق نعرف مين عمل إيه وإمتى.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <strong className="text-white text-lg block mb-1">🦠 الحماية والتحديثات</strong>
              <p className="text-sm text-slate-400">برامج مكافحة فيروسات، وتحديث النظام باستمرار لتصحيح أي ثغرة أمنية.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 md:col-span-2">
              <strong className="text-white text-lg block mb-1">⚖️ الامتثال للقوانين</strong>
              <p className="text-sm text-slate-400">الالتزام بقوانين حماية البيانات الدولية وحقوق النشر.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "المقارنة الكبرى: مين بيعمل إيه؟ (CMS vs LMS) ⚖️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-rose-400 font-bold mb-4 text-center">ركز معايا في الحتة دي عشان دي الخلاصة اللي بتيجي في الامتحانات:</p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border-t-4 border-cyan-500 shadow-md text-center">
              <h4 className="text-cyan-400 font-bold text-lg mb-2">1. إدارة المحتوى (CMS)</h4>
              <p className="text-slate-300 text-sm">بيركز على <strong className="text-white">تأليف وإنشاء المحتوى</strong> وتخزينه. ملوش دعوة بإدارة الطالب ولا التقييم.</p>
            </div>
            
            <div className="bg-slate-800/80 p-5 rounded-2xl border-t-4 border-purple-500 shadow-md text-center">
              <h4 className="text-purple-400 font-bold text-lg mb-2">2. إدارة التعلم (LMS)</h4>
              <p className="text-slate-300 text-sm">عكس اللي قبله! بيركز على <strong className="text-white">إدارة الطلاب والعملية التعليمية</strong> وتوصيل المحتوى، بس مبيمتلكش أدوات تأليف.</p>
            </div>
            
            <div className="bg-slate-800/80 p-5 rounded-2xl border-t-4 border-pink-500 shadow-md text-center">
              <h4 className="text-pink-400 font-bold text-lg mb-2">3. إدارة محتوى التعلم (LCMS)</h4>
              <p className="text-slate-300 text-sm">الخلاط! بيجمع بين الميزتين. <strong className="text-white">بينشئ المحتوى + بيدير العملية</strong>. (مظلة بتغطي الاتنين).</p>
            </div>
          </div>
          
          <div className="mt-4 text-center text-rose-400 font-bold bg-rose-900/20 py-2 rounded-lg text-sm">
            (ملحوظة هامة: لا يجوز فصل الـ CMS عن الـ LMS عند التطبيق الفعلي، هما بيكملوا بعض).
          </div>
        </div>
      )
    },
    {
      title: "المقارنة الكبرى: SEMS و ERP والمستقبل 🚀",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-slate-800 p-6 rounded-2xl border border-blue-500/40 shadow-md">
              <h4 className="text-blue-400 font-bold text-xl mb-3 flex items-center gap-2"><span>🧠</span> النظم الذكية (SEMS)</h4>
              <p className="text-slate-300 text-sm">اللي بيميزها عن أي نظام تاني هو <strong className="text-white">الذكاء الاصطناعي وتحليل البيانات</strong>. بتهدف لتعزيز التعلم بتوجيه فردي وتوقعات للمستقبل.</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-900/30 to-slate-800 p-6 rounded-2xl border border-amber-500/40 shadow-md">
              <h4 className="text-amber-400 font-bold text-xl mb-3 flex items-center gap-2"><span>🏢</span> نظام المؤسسات (ERP)</h4>
              <p className="text-slate-300 text-sm">ينفرد بالتركيز على <strong className="text-white">إدارة الموارد والعمليات</strong> (ماليات، موظفين، مخازن) عشان يضمن تشغيل المؤسسة ككل بكفاءة.</p>
            </div>
          </div>
          
          <div className="bg-emerald-900/20 p-5 rounded-2xl border-l-4 border-emerald-500 shadow-sm">
            <strong className="text-emerald-400 text-xl block mb-2">🌟 المستقبل والتكامل (EDUWAVE)</strong>
            <p className="text-slate-300 text-base">ممكن النظامين يتعاونوا سوا. وظهرت أنظمة حديثة وشاملة بتجمع بين (الـ LMS، والـ ERP، والذكاء الاصطناعي) في <strong className="text-white bg-emerald-500/30 px-1 rounded">نظام واحد شامل</strong> بيتفصل حسب حاجة المؤسسة.. من أشهر أمثلتها نظام <strong>(EDUWAVE)</strong>.</p>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال مسك الختام 🏆",
      question: "أي نظام من الأنظمة دي يعتبر 'نظام شامل' بيجمع بين الـ LMS والـ ERP والذكاء الاصطناعي مع بعض؟",
      options: [
        { text: "نظام موودل (Moodle)", correct: false },
        { text: "نظام (EDUWAVE)", correct: true },
        { text: "نظام إدارة المحتوى (CMS)", correct: false }
      ]
    },
    {
      title: "النهاية السعيدة للفصل الرابع 🥳",
      content: (
        <div className="space-y-6 text-lg text-center flex flex-col items-center justify-center min-h-[300px] relative">
          <div className="text-7xl mb-4 animate-bounce drop-shadow-lg">🏆</div>
          <p className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-sm">
            عاش جداً يا وحش! 💪
          </p>
          <p className="text-slate-300 text-xl max-w-2xl mt-4 leading-relaxed">إنت كده خلصت الفصل الرابع وفهمت الأنظمة الذكية كلها والفرق الجوهري بينها وبين الأنظمة التقليدية (ERP, CMS, LMS).</p>
          <p className="text-emerald-400 mt-4 font-bold animate-pulse text-2xl">الرحلة خلصت هنا، دوس على الزرار اللي تحت وقفل الكورس وإنت مطمن! 👇</p>
        </div>
      )
    }
  ];

  const currentSlideData = slides[currentSlide];

  // شاشة النهاية (بعد إتمام الكورس)
  if (isFinished) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#0a0f1c] to-[#0a0f1c]"></div>
        <div className="bg-[#111827]/90 backdrop-blur-xl p-10 md:p-16 rounded-[2rem] shadow-[0_0_50px_rgba(8,145,178,0.2)] text-center max-w-2xl w-full border border-cyan-500/30 relative z-10">
          <div className="text-7xl mb-6 drop-shadow-md">🎓</div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">ألف مبروك!</h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">لقد أتممت دراسة الفصل الرابع بتركيز وفهم عميق للأنظمة الذكية! 🚀</p>
          <button 
            onClick={() => {setIsFinished(false); setCurrentSlide(0); setQuizAnswers({}); setShowFeedback({});}}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-cyan-500/50 text-cyan-400 rounded-xl font-bold text-xl transition-all shadow-md hover:shadow-cyan-500/30"
          >
            إعادة الدرس 🔄
          </button>
        </div>
      </div>
    );
  }

  // الهيكل الرئيسي للشاشة (Flexbox يمنع أي تداخل)
  return (
    <div dir="rtl" className="flex flex-col h-screen bg-[#0B1121] text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30">
      
      {/* مودال الخروج التأكيدي */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1121]/90 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="text-6xl mb-4">🚪</div>
            <h3 className="text-2xl font-bold text-white mb-2">متأكد إنك عايز تخرج؟</h3>
            <p className="text-slate-400 mb-8">كل التقدم بتاعك في الفصل الرابع هيضيع!</p>
            <div className="flex gap-4 justify-center">
              <button onClick={confirmExit} className="flex-1 py-3 bg-red-600/10 text-red-400 border border-red-500/30 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all">أيوه، اخرج</button>
              <button onClick={cancelExit} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 border border-slate-600 transition-all">لأ، كمل</button>
            </div>
          </div>
        </div>
      )}

      {/* الرأس (Header) - ثابت في الأعلى */}
      <header className="shrink-0 h-20 bg-[#0B1121]/95 border-b border-slate-800 flex justify-between items-center px-4 md:px-8 z-20">
        <h1 className="text-lg md:text-2xl font-bold flex items-center gap-3">
          <span className="text-2xl text-cyan-400">🧠</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">الأنظمة الذكية - الفصل 4</span>
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 border border-slate-700 px-4 py-1 rounded-full text-sm font-bold">
            <span className="text-cyan-400">{currentSlide + 1}</span> <span className="text-slate-500">/</span> <span className="text-slate-400">{slides.length}</span>
          </div>
          <button onClick={handleExitClick} className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
            خروج 🚪
          </button>
        </div>
      </header>

      {/* شريط التقدم */}
      <div className="shrink-0 h-1 bg-slate-900 w-full">
        <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-300" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}></div>
      </div>

      {/* مساحة الشرح (Main Content) - بتعمل سكرول لوحدها ومستحيل تنزل تحت الفوتر بفضل flex-1 overflow-y-auto */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0B1121] custom-scrollbar">
        <div className={`max-w-4xl mx-auto bg-[#111827]/80 rounded-3xl p-6 md:p-10 border border-slate-700/50 shadow-xl transition-all duration-300 ${animateSlide ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-slate-700/80 pb-4">
            {currentSlideData.title}
          </h2>
          
          {/* محتوى الشريحة أو الكويز */}
          {currentSlideData.type === 'quiz' ? (
            <div className="bg-slate-900/80 p-6 md:p-8 rounded-2xl border border-cyan-900/50">
              <p className="text-xl md:text-2xl font-bold mb-8 text-cyan-300 leading-relaxed">{currentSlideData.question}</p>
              <div className="space-y-4">
                {currentSlideData.options.map((opt, idx) => {
                  const isAnswered = showFeedback[currentSlide];
                  const isCorrect = opt.correct;
                  const isSelectedCorrect = quizAnswers[currentSlide] === true && isCorrect;
                  const isSelectedWrong = quizAnswers[currentSlide] === false && !isCorrect;
                  
                  let btnClass = "w-full text-right p-4 rounded-xl font-bold text-lg border-2 transition-all flex justify-between items-center ";
                  if (!isAnswered) {
                    btnClass += "bg-slate-800 border-slate-600 hover:border-cyan-400 text-slate-200";
                  } else if (isCorrect) {
                    btnClass += "bg-emerald-900/40 border-emerald-500 text-emerald-300";
                  } else if (isSelectedWrong) {
                    btnClass += "bg-rose-900/40 border-rose-500 text-rose-300";
                  } else {
                    btnClass += "bg-slate-800 border-slate-700 text-slate-600 opacity-50 cursor-not-allowed";
                  }

                  return (
                    <button key={idx} disabled={isAnswered} onClick={() => handleQuizAnswer(currentSlide, isCorrect)} className={btnClass}>
                      <span>{opt.text}</span>
                      {isAnswered && isCorrect && <span className="text-2xl">✅</span>}
                      {isAnswered && isSelectedWrong && <span className="text-2xl">❌</span>}
                    </button>
                  );
                })}
              </div>
              {showFeedback[currentSlide] && (
                <div className={`mt-6 p-4 rounded-xl font-bold text-xl text-center flex items-center justify-center gap-3 ${quizAnswers[currentSlide] ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30' : 'bg-rose-900/40 text-rose-400 border border-rose-500/30'}`}>
                  {quizAnswers[currentSlide] ? <>عاش يا بطل! إجابة صحيحة 👏</> : <>للأسف غلط! ركز أكتر المرة الجاية 😅</>}
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-200">
              {currentSlideData.content}
            </div>
          )}
        </div>
      </main>

      {/* الفوتر (أزرار التحكم) - ثابت في الأسفل وحجمه أنيق ومعقول */}
      <footer className="shrink-0 h-24 bg-[#0B1121] border-t border-slate-800 flex items-center justify-center px-4 z-20">
        <div className="flex gap-4 w-full max-w-md">
          {currentSlide === slides.length - 1 ? (
            <button onClick={handleFinish} className="flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all">
              <span>إنهاء الكورس</span> <span className="text-xl">🏁</span>
            </button>
          ) : (
            <button onClick={handleNext} className="flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-all">
              <span>التالي</span> <span className="text-xl">&larr;</span>
            </button>
          )}
          
          <button onClick={handlePrev} disabled={currentSlide === 0} className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg transition-all ${currentSlide === 0 ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'}`}>
            <span className="text-xl">&rarr;</span> <span>السابق</span>
          </button>
        </div>
      </footer>

      {/* استايل السكرولر المخصص */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
      `}} />
    </div>
  );
}