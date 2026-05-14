import React, { useState, useEffect } from 'react';

export default function SmartLearningChapter5() {
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

  // تم تحديث الدالة لحفظ رقم الإجابة المختارة لتمييزها بشكل صحيح
  const handleQuizAnswer = (slideIndex, optIndex, isCorrect) => {
    setQuizAnswers(prev => ({ ...prev, [slideIndex]: { isCorrect, selectedIndex: optIndex } }));
    setShowFeedback(prev => ({ ...prev, [slideIndex]: true }));
  };

  // بيانات الفصل الخامس - منظمة للفهم العميق وبدون حشو ممل
  const slides = [
    {
      title: "مقدمة الفصل الخامس 🚀",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="text-center mb-6"><span className="text-7xl animate-pulse inline-block drop-shadow-lg">📏</span></div>
          <p className="text-3xl font-bold text-cyan-400 mb-6 text-center">أهلاً بيك يا بطل في عالم "المعايير"!</p>
          <p>في الفصل ده هنتكلم عن <strong className="text-purple-400 text-xl bg-purple-900/30 px-2 rounded">معايير تصميم نظم إدارة التعلم الرقمي</strong>. يعني إيه الكلام المكلكع ده؟</p>
          <p>ببساطة، إحنا محتاجين "لغة مشتركة" عشان لو عملت كورس على سيستم، تقدر تنقله على سيستم تاني من غير ما يبوظ. المعايير دي هي اللغة المشتركة.</p>
          
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-md mt-6">
            <h4 className="text-xl text-emerald-400 font-bold mb-4">في الفصل ده هنفهم:</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3"><span className="text-cyan-500">💠</span> يعني إيه كلمة "معيار" أساساً في التعليم الإلكتروني؟</li>
              <li className="flex items-center gap-3"><span className="text-cyan-500">💠</span> سحر معيار (SCORM) وعلاقته بالسيستم.</li>
              <li className="flex items-center gap-3"><span className="text-cyan-500">💠</span> إزاي بنبني كورس متوافق مع SCORM؟</li>
              <li className="flex items-center gap-3"><span className="text-cyan-500">💠</span> إيه هو معيار (IMS) وأهدافه ومكوناته؟</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "ليه محتاجين معايير في التعليم الإلكتروني؟ 🤔",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p>المحتوى الرقمي وأنظمة الإدارة هما أهم حاجة في التعليم الأونلاين. عشان كده لازم المطورين يفهرسوا المحتوى ده ويعرفوه بـ <strong>مواصفات خاصة</strong> عشان الأنظمة المختلفة تقدر تقراه.</p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-800/60 p-5 rounded-2xl border-l-4 border-emerald-500 shadow-sm">
              <strong className="text-emerald-400 text-xl block mb-2">💰 توفير للفلوس والمجهود</strong>
              <p className="text-sm">بدل ما تعيد برمجة الكورس عشان يشتغل على سيستم جديد، المعايير بتخليك تعمله مرة واحدة ويشتغل في أي حتة!</p>
            </div>
            <div className="bg-slate-800/60 p-5 rounded-2xl border-l-4 border-emerald-500 shadow-sm">
              <strong className="text-emerald-400 text-xl block mb-2">🔄 تبادل سهل للمحتوى</strong>
              <p className="text-sm">تسهيل تبادل ونقل المقررات الإلكترونية (اللي هي اللبنة الأولى في التعلم) بين الأنظمة المختلفة بسلاسة.</p>
            </div>
            <div className="bg-slate-800/60 p-5 rounded-2xl border-l-4 border-emerald-500 shadow-sm md:col-span-2">
              <strong className="text-emerald-400 text-xl block mb-2">⏳ كسر حاجز التزامن</strong>
              <p className="text-sm">المعايير ساهمت في عدم الحاجة للتزامن (يعني نقدر نوصل الكورس ونراقبه من غير ما الطلاب يكونوا متجمعين في نفس الوقت).</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "يعني إيه كلمة (معايير Standards)؟ 📚",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-purple-400 font-bold mb-4">ببساطة: هي دستور وقواعد بنمشي عليها عشان شغلنا يبقى قياسي ومعترف بيه.</p>
          
          <div className="bg-[#111827]/80 p-6 rounded-2xl border border-slate-700/60 flex items-start gap-4">
            <div className="text-4xl text-cyan-400 mt-1">⚖️</div>
            <div>
              <strong className="text-cyan-300 text-xl block mb-1">تعريف لجنة (US-NSPAC):</strong>
              <p className="text-base">هي مجموعة محددة مسبقاً من القواعد والشروط لتعريف المصطلحات، وتصنيف المكونات، وتحديد الجودة. الوثيقة دي لازم هيئة معترف بيها تصادق عليها وتُستخدم بشكل متكرر.</p>
            </div>
          </div>

          <div className="bg-rose-900/20 p-5 rounded-2xl border-r-4 border-rose-500 shadow-sm mt-4">
            <strong className="text-rose-400 text-xl block mb-2">⚠️ حقيقة صادمة:</strong>
            <p className="text-slate-300">لحد اللحظة دي، مفيش معايير في التعليم الإلكتروني مصادق عليها بشكل نهائي من منظمة الـ ISO! ليه؟ لأن المجال <strong>لسه بينمو بسرعة جداً</strong> وفيه تغييرات متلاحقة، والمعيار بيشترط فيه "الثبات والاستقرار". حالياً هي مجرد "مواصفات وإرشادات".</p>
          </div>
        </div>
      )
    },
    {
      title: "أشهر المعايير العالمية 🌍",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">بالرغم من عدم وجود معيار ثابت من الـ ISO، إلا إن في مؤسسات بدأت من بدري تحط إرشادات قوية جداً (زي جميعة AICC سنة 1988).</p>
          
          <p className="mb-4">من أشهر المعايير اللي ظهرت ومتشابهة في متطلباتها:</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="bg-gradient-to-br from-cyan-900/50 to-slate-800 p-6 rounded-2xl border border-cyan-500/50 text-center min-w-[200px]">
              <h4 className="text-3xl font-bold text-cyan-400">SCORM</h4>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-slate-800 p-6 rounded-2xl border border-purple-500/50 text-center min-w-[200px]">
              <h4 className="text-3xl font-bold text-purple-400">IMS</h4>
            </div>
            <div className="bg-gradient-to-br from-pink-900/50 to-slate-800 p-6 rounded-2xl border border-pink-500/50 text-center min-w-[200px]">
              <h4 className="text-3xl font-bold text-pink-400">IEEE</h4>
            </div>
          </div>
          <p className="text-center mt-6 text-cyan-300 font-bold">هنتكلم بالتفصيل عن (SCORM) و (IMS) في الشرايح الجاية!</p>
        </div>
      )
    },
    {
      title: "1. معيار سكورم (SCORM) 📦",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl text-purple-400 font-bold mb-4 border-b border-slate-700 pb-2">نجم الشباك في التعلم الإلكتروني!</p>
          
          <div className="bg-gradient-to-l from-purple-900/30 to-slate-900 p-6 rounded-2xl border border-purple-500/50 shadow-md mb-6">
            <p className="text-slate-300">هو اختصار لـ <strong>Sharable Content Object Reference Model</strong> (نموذج مشاركة المحتوى والكائنات). تم تطويره سنة 1997 بواسطة وكالة أمريكية تابعة لوزارة الدفاع (ADL) عشان يوفروا نفقات التدريب.</p>
          </div>

          <div className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-xl border-l-4 border-cyan-500">
            <div className="text-4xl text-cyan-400 mt-1">🔌</div>
            <div>
              <strong className="text-white text-xl block mb-1">يعني إيه سكورم بالبلدي؟</strong>
              <p className="text-base text-slate-400">هو "بروتوكول قياسي" بيعتبر <strong className="text-cyan-300">واجهة الربط (الكابل)</strong> بين المادة التعليمية المنفردة (SCO) وبين نظام إدارة التعلم (LMS). هو إطار متأسس على لغة <strong>XML</strong> عشان الأجهزة تفهم البيانات وتتبادلها.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "أهداف معيار سكورم العظيمة 🎯",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">ليه العالم كله بيستخدم SCORM؟ عشان بيحقق 6 أهداف أساسية:</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <strong className="text-cyan-400 text-lg block mb-1">🔍 1. سهولة الوصول</strong>
              <p className="text-sm">تقدر تحدد موقع المحتوى وتوصله في أي وقت بفضل الفهرسة السهلة، بغض النظر عن النظام.</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <strong className="text-cyan-400 text-lg block mb-1">🤝 2. التوافق</strong>
              <p className="text-sm">الكورس يشتغل على أنواع أجهزة وأنظمة تشغيل (ويندوز/ماك) وأنظمة LMS مختلفة.</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <strong className="text-cyan-400 text-lg block mb-1">🧩 3. القابلية للتكيف</strong>
              <p className="text-sm">تحويل المادة لمادة متوافقة مع احتياجات المؤسسات المختلفة.</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <strong className="text-cyan-400 text-lg block mb-1">💪 4. المتانة (Durability)</strong>
              <p className="text-sm">تطور المحتوى مرة واحدة، ويشتغل كذا مرة على أنظمة مختلفة بأقل مجهود (استثمار آمن).</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <strong className="text-cyan-400 text-lg block mb-1">♻️ 5. إعادة الاستخدام</strong>
              <p className="text-sm">تاخد محتوى متصمم قبل كده، وتدمجه عشان تطلع كورس جديد من غير ما تبدأ من الصفر.</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <strong className="text-cyan-400 text-lg block mb-1">⏳ 6. الاستمرار</strong>
              <p className="text-sm">المحتوى يعيش ويتطور، حتى لو البرامج اللي اتصمم بيها أصلًا اختفت من السوق.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "صحصح معايا 🧠",
      question: "إيه هو المعيار اللي بيُعتبر (بروتوكول قياسي وإطار متأسس على لغة XML) لربط المادة التعليمية بنظام الـ LMS؟",
      options: [
        { text: "معيار (IMS)", correct: false },
        { text: "معيار سكورم (SCORM)", correct: true },
        { text: "معيار (IEEE)", correct: false }
      ]
    },
    {
      title: "مكونات سكورم (Technical Books) 📚",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">سكورم عبارة عن مجموعة مواصفات متراكمة (مرجع فني للمطورين) متقسمة لكتب (Books):</p>
          
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border-r-4 border-purple-500">
              <strong className="text-purple-300 text-xl block mb-1">1. النظرة الكلية (Overview)</strong>
              <p className="text-sm">بيديك رؤية عامة عن سكورم وعلاقته بالباقي.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border-r-4 border-emerald-500">
              <strong className="text-emerald-300 text-xl block mb-1">2. نموذج تجميع المحتوى (CAM)</strong>
              <p className="text-sm">بيوصف إزاي هنجمع العناصر ونحزمها (في ملف مضغوط) عشان ننقلها بين الأنظمة، وإزاي نوصفها عشان البحث، وتعريف قواعد تسلسلها (الطالب يدرس إيه قبل إيه).</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border-r-4 border-cyan-500">
              <strong className="text-cyan-300 text-xl block mb-1">3. بيئة التشغيل (RTE)</strong>
              <p className="text-sm">الواجهة اللي بتأمن جلسة الحوار بين الـ LMS وسكورم. فيها (Launch) عشان تشغل المحتوى، و(API) اللي هو كابل الاتصال اللي بينفذ الإجراءات المتفق عليها.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border-r-4 border-amber-500">
              <strong className="text-amber-300 text-xl block mb-1">4. التصفح والتتابع (SN)</strong>
              <p className="text-sm">بيوصف إزاي بيحصل تعاقب بين الأنشطة (بعد ما تخلص الدرس تروح للامتحان)، وإزاي نتابع تقدمك.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "مصطلحات مهمة في عالم سكورم 📖",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">عشان تبقى فاهم المبرمجين بيقولوا إيه، لازم تعرف المصطلحات دي:</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#111827]/80 p-4 rounded-xl border border-slate-700">
              <strong className="text-white text-lg block mb-1">🔹 الموجودات (Assets)</strong>
              <p className="text-sm text-slate-400">أي معلومة بنوصلها للطالب (نص، صورة، صفحة ويب، صوت، فيديو).</p>
            </div>
            <div className="bg-[#111827]/80 p-4 rounded-xl border border-slate-700">
              <strong className="text-white text-lg block mb-1">🔹 كائن المحتوى القابل للمشاركة (SCO)</strong>
              <p className="text-sm text-slate-400">أدنى مستوى لمصادر التعلم يقدر الـ LMS يستخدمه، وهو عبارة عن تجميع لمجموعة موجودات (Assets).</p>
            </div>
            <div className="bg-[#111827]/80 p-4 rounded-xl border border-slate-700">
              <strong className="text-white text-lg block mb-1">🔹 كائن التعلم (LO)</strong>
              <p className="text-sm text-slate-400">محتوى منفصل بيحقق "هدف تعليمي خاص". لازم يكون مستقل ومكتفي بذاته عشان نقدر ندمجه مع حاجات تانية.</p>
            </div>
            <div className="bg-[#111827]/80 p-4 rounded-xl border border-slate-700">
              <strong className="text-white text-lg block mb-1">🔹 حزمة المحتوى (Content Package)</strong>
              <p className="text-sm text-slate-400">ملف مضغوط فيه كل أغراض المحتوى + ملف (Manifest) بيشرح إزاي نعالجها.</p>
            </div>
          </div>
          <div className="bg-rose-900/20 p-3 rounded-lg border-l-4 border-rose-500 mt-2">
            <strong className="text-rose-400">لغة XML:</strong> لغة ترميز قابلة للامتداد بنستخدمها عشان نوصف الداتا، وأهم هدف ليها "الفصل بين شكل المحتوى وشكل العرض".
          </div>
        </div>
      )
    },
    {
      title: "العلاقة بين سكورم ونظام الإدارة وقاعدة البيانات 🔄",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">ازاي الكورس بيسمّع في السيستم؟</p>
          
          <div className="bg-gradient-to-r from-blue-900/30 to-slate-900 p-6 rounded-2xl border border-blue-500/30 shadow-md text-center mb-6">
            <p className="text-white text-lg leading-loose">
              المادة التعليمية (الكورس) <strong className="text-rose-400">مبتقدرش تكلم قاعدة البيانات مباشرة!</strong><br />
              بتروح تسأل الـ LMS الأول من خلال (بروتوكول سكورم) عشان تجيب المعلومة.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 text-xl font-bold">
            <div className="bg-emerald-900/50 border border-emerald-400 text-emerald-300 px-6 py-3 rounded-xl w-64 text-center">المادة التعليمية (SCO)</div>
            <div className="text-slate-400 flex flex-col items-center">
              <span>تتحدث بلغة</span>
              <span className="text-cyan-400 text-2xl">⬇️ SCORM ⬇️</span>
            </div>
            <div className="bg-cyan-900/50 border border-cyan-400 text-cyan-300 px-6 py-3 rounded-xl w-64 text-center">نظام الإدارة (LMS)</div>
            <div className="text-slate-400 text-2xl">⬇️</div>
            <div className="bg-purple-900/50 border border-purple-400 text-purple-300 px-6 py-3 rounded-xl w-64 text-center">قاعدة البيانات (DB)</div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال عالطاير 🦅",
      question: "حسب معيار سكورم، إيه هو الجزء المسؤول عن (تأمين جلسة الحوار بين الـ LMS وسكورم عشان نشغل المحتوى)؟",
      options: [
        { text: "نموذج تجميع المحتوى (CAM)", correct: false },
        { text: "بيئة التشغيل للوحدات التعليمية (RTE)", correct: true },
        { text: "التصفح والتتابع (SN)", correct: false }
      ]
    },
    {
      title: "إزاي نصمم كورس متوافق مع سكورم؟ (الخطوات) 🛠️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-cyan-400 font-bold mb-4">بما إن المادة مبتكلمش السيستم مباشرة، بنعمل إيه كـ "مصممين تعليميين"؟</p>
          <p>بنمشي على خطوات عشان نحول الكورس الورقي لـ سكورم:</p>

          <ol className="list-decimal list-inside space-y-4">
            <li className="bg-slate-800/40 p-3 rounded-lg"><strong className="text-white">تحويل لورق:</strong> نحول المحتوى من ورق لمستند (Word).</li>
            <li className="bg-slate-800/40 p-3 rounded-lg"><strong className="text-white">تجزئة المحتوى (تهيئة):</strong> نقطعه لـ "كائنات تعليمية Learning Objects" صغيرة. كل كائن ليه هدف تعليمي مميز ومستقل.</li>
          </ol>

          <div className="bg-slate-800/80 p-4 rounded-xl border-r-4 border-cyan-500 mt-4">
            <strong className="text-cyan-300 block mb-2">أي كائن تعليمي (LO) بيتكون من 3 أجزاء:</strong>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><strong className="text-white">التعلم:</strong> عرض المادة المراد تعلمها.</li>
              <li><strong className="text-white">التطبيق:</strong> ربط المعلومة بتطبيق مباشر عشان يفهم.</li>
              <li><strong className="text-white">الاختبار الذاتي:</strong> عشان الطالب يختبر استيعابه للهدف.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "باقي خطوات تصميم كورس سكورم ⚙️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <ol className="list-decimal list-inside space-y-4" start="3">
            <li className="bg-slate-800/40 p-4 rounded-lg">
              <strong className="text-white block mb-1">تهيئة المحتوى بعد التجزئة:</strong> 
              نحول الـ Word لملفات (HTML)، ونظبط الصور والفيديو، ونعمل التمارين. <br />
              <span className="text-sm text-slate-400">هنحتاج برامج زي: DreamWeaver (للـ HTML)، Flash (للتمارين)، و Photoshop للفيديو والصور، ومهارات برمجة زي JavaScript.</span>
            </li>
            
            <li className="bg-slate-800/40 p-4 rounded-lg border border-purple-500/50">
              <strong className="text-purple-300 block mb-1">التحزيم (Content Packaging):</strong> 
              كده بقى عندنا مئات الملفات (صور، نصوص، فلاش)! بنلمهم كلهم في <strong>ملف واحد مضغوط (ZIP)</strong>. الملف ده مش بس فيه الدرس، ده فيه ملفات (XML) بتفهرس المحتوى وبتقول للـ LMS يتعامل معاه إزاي.
            </li>

            <li className="bg-slate-800/40 p-4 rounded-lg">
              <strong className="text-white block mb-1">التركيب:</strong> 
              بنعمل Import (استيراد) للملف المضغوط ده جوة أي نظام LMS متوافق مع سكورم.
            </li>
            
            <li className="bg-slate-800/40 p-4 rounded-lg">
              <strong className="text-white block mb-1">التقييم:</strong> 
              المدرس بيقيم الشغل، وبكده الدائرة اكتملت.
            </li>
          </ol>
        </div>
      )
    },
    {
      title: "مميزات استخدام سكورم 🏆",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">ليه التعب ده كله؟ عشان لما بنستخدم سكورم بناخد الميزات دي:</p>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 text-center">
              <div className="text-3xl text-cyan-400 mb-2">🌐</div>
              <p className="text-sm">نشر المحتوى وجزئياته بأي نظام تعلم بسهولة.</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 text-center">
              <div className="text-3xl text-emerald-400 mb-2">♻️</div>
              <p className="text-sm">إعادة استخدام المحتوى بأشكال مختلفة كذا مرة.</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 text-center">
              <div className="text-3xl text-amber-400 mb-2">📊</div>
              <p className="text-sm">متابعة أداء الطالب بدقة (الوقت والتقييم).</p>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 text-center">
              <div className="text-3xl text-pink-400 mb-2">🧩</div>
              <p className="text-sm">ضم جزئيات عشان نطلع بمحتوى ليه تتابع ملائم للمتطلبات.</p>
            </div>
          </div>

          <div className="bg-blue-900/20 p-4 rounded-xl border-l-4 border-blue-500 text-sm">
            <strong className="text-blue-300 block mb-1">المحتوى التعليمي لسكورم بيتكون من جزئيات متداخلة زي:</strong>
            (نصوص، رسومات وصور، تسجيلات ومؤثرات صوتية، فيديو ورسوم متحركة، خرائط توضيحية).
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال للناس اللي مركزة 🕵️‍♂️",
      question: "لما بنجهز كورس متوافق مع سكورم، بنقطع المحتوى لأجزاء صغيرة مستقلة ليها هدف تعليمي واحد. الأجزاء دي اسمها إيه؟",
      options: [
        { text: "بيئة التشغيل (RTE)", correct: false },
        { text: "كائنات التعلم (Learning Objects - LO)", correct: true },
        { text: "الموجودات (Assets)", correct: false }
      ]
    },
    {
      title: "2. معيار (IMS) 🌐",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl font-bold text-emerald-400 mb-4 border-b border-slate-700 pb-2">المعيار التاني المشهور معانا!</p>
          
          <div className="bg-emerald-900/20 p-5 rounded-2xl border border-emerald-500/30 mb-6">
            <p className="text-slate-300">هو اختصار لـ <strong>Instructional Management System Global Consortium</strong>.<br />دي جمعية دولية أمريكية لمزودي الجامعات، بتعتمد على لغة (XML) عشان توصف خصائص المقررات والدروس والتقييم الخاص بأنظمة الـ LMS.</p>
          </div>

          <h4 className="text-xl font-bold text-white mb-3">أهداف معيار IMS (هدفين بس):</h4>
          <ul className="list-disc list-inside space-y-3 pl-2">
            <li className="bg-slate-800/40 p-3 rounded-lg border border-slate-700">
              <strong className="text-emerald-300">1. القابلية البينية للتشغيل (Interoperability):</strong> بيحطوا إرشادات تضمن إن التطبيقات والخدمات التعليمية تقدر تشتغل وتتفاهم مع بعضها بدون مشاكل.
            </li>
            <li className="bg-slate-800/40 p-3 rounded-lg border border-slate-700">
              <strong className="text-emerald-300">2. دعم دولي:</strong> دعم تطبيق التوجيهات دي في المنتجات والخدمات على مستوى العالم.
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "مكونات معيار (IMS) 🧩",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">معيار IMS بيتكون من 5 عناصر رئيسية بيكملوا بعض:</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-cyan-500">
              <strong className="text-cyan-300 text-lg block mb-1">1. المعلومات الوصفية (Metadata)</strong>
              <p className="text-sm">ده العنصر الرئيسي اللي بنوصف بيه المواد والكائنات التعليمية عشان البحث.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-cyan-500">
              <strong className="text-cyan-300 text-lg block mb-1">2. حزم المحتوى (Content Packaging)</strong>
              <p className="text-sm">بيوصف إزاي بنجمع المصادر التعليمية في المقرر أو أجزائه.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-cyan-500">
              <strong className="text-cyan-300 text-lg block mb-1">3. تصميم التعلم (Learning Design)</strong>
              <p className="text-sm">لغة بتنمذج وحدات التعليم وبتساند استراتيجيات المدرس.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-cyan-500">
              <strong className="text-cyan-300 text-lg block mb-1">4. التسلسل (Simple Sequencing)</strong>
              <p className="text-sm">بيوصف إزاي هننظم الكائنات (LOs) ونقدمها للطالب ورا بعض.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-purple-500 md:col-span-2">
              <strong className="text-purple-300 text-lg block mb-1">5. القابلية البينية للأسئلة (QTI)</strong>
              <p className="text-sm">إرشادات عشان نشارك الاختبارات والبيانات، وبتسمح نعرض أنماط كتير من الأسئلة والتغذية الراجعة والنتيجة.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال مسك الختام 🏆",
      question: "في معيار (IMS)، إيه هو العنصر المسؤول عن وصف المشاركة في الاختبارات وعرض التغذية الراجعة؟",
      options: [
        { text: "المعلومات الوصفية (Metadata)", correct: false },
        { text: "القابلية البينية للاختبارات (QTI)", correct: true },
        { text: "التسلسل (Simple Sequencing)", correct: false }
      ]
    },
    {
      title: "النهاية السعيدة للفصل الخامس 🥳",
      content: (
        <div className="space-y-6 text-lg text-center flex flex-col items-center justify-center min-h-[350px] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 to-transparent rounded-3xl pointer-events-none"></div>
          <div className="text-8xl mb-6 animate-bounce drop-shadow-xl">🎓</div>
          <p className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-sm">
            ألف مبرووووك يا وحش! 💪
          </p>
          <p className="text-slate-300 text-2xl max-w-2xl mt-6 leading-relaxed">إنت كده خلصت الفصل الخامس وفهمت لغة المعايير (SCORM و IMS) وازاي بنبني كورسات متوافقة ومظبوطة.</p>
          <p className="text-emerald-400 mt-6 font-bold animate-pulse text-3xl">دوس على الزرار اللي تحت عشان تقفل الدرس ! 👇</p>
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
          <div className="text-7xl mb-6 drop-shadow-md">🏆</div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">إنجاز عظيم!</h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">لقد أتممت دراسة الفصل الخامس بالكامل، وفهمت أسرار تصميم المحتوى المعياري! 🚀</p>
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
            <p className="text-slate-400 mb-8">كل التقدم بتاعك في الفصل الخامس هيضيع!</p>
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
          <span className="text-2xl text-cyan-400">📏</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">المعايير - الفصل 5</span>
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

      {/* مساحة الشرح (Main Content) - بتعمل سكرول لوحدها */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0B1121] custom-scrollbar relative">
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
                  const answerData = quizAnswers[currentSlide];
                  const isSelected = isAnswered && answerData?.selectedIndex === idx;
                  
                  let btnClass = "w-full text-right p-4 rounded-xl font-bold text-lg border-2 transition-all flex justify-between items-center ";
                  if (!isAnswered) {
                    btnClass += "bg-slate-800 border-slate-600 hover:border-cyan-400 text-slate-200";
                  } else if (isCorrect) {
                    btnClass += "bg-emerald-900/40 border-emerald-500 text-emerald-300";
                  } else if (isSelected && !isCorrect) {
                    btnClass += "bg-rose-900/40 border-rose-500 text-rose-300";
                  } else {
                    btnClass += "bg-slate-800 border-slate-700 text-slate-600 opacity-50 cursor-not-allowed";
                  }

                  return (
                    <button key={idx} disabled={isAnswered} onClick={() => handleQuizAnswer(currentSlide, idx, isCorrect)} className={btnClass}>
                      <span>{opt.text}</span>
                      {!isAnswered && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 text-3xl">👈</span>}
                      {isAnswered && isCorrect && <span className="text-3xl">✅</span>}
                      {isAnswered && isSelected && !isCorrect && <span className="text-3xl">❌</span>}
                    </button>
                  );
                })}
              </div>
              {showFeedback[currentSlide] && (
                <div className={`mt-6 p-4 rounded-xl font-bold text-xl text-center flex items-center justify-center gap-3 ${quizAnswers[currentSlide]?.isCorrect ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30' : 'bg-rose-900/40 text-rose-400 border border-rose-500/30'}`}>
                  {quizAnswers[currentSlide]?.isCorrect ? <>عاش يا بطل! إجابة صحيحة 👏</> : <>للأسف غلط! ركز أكتر المرة الجاية 😅</>}
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

      {/* الفوتر (أزرار التحكم) - ثابت في الأسفل */}
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
          
          <button onClick={handlePrev} disabled={currentSlide === 0} className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg transition-all ${currentSlide === 0 ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-transparent' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'}`}>
            <span className="text-xl">&rarr;</span> <span>السابق</span>
          </button>
        </div>
      </footer>

      {/* استايل السكرولر */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
      `}} />
    </div>
  );
}