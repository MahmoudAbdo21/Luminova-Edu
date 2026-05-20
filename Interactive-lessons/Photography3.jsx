import React, { useState, useEffect, useRef } from 'react';
import { Camera, Aperture, Maximize, Zap, Sliders, Monitor, XCircle, ChevronLeft, ChevronRight, CheckCircle, Eye, Focus, Sun, Battery, HardDrive, Edit3, Image as ImageIcon, BookOpen, Layers, Scissors, MousePointer2, Type, Grid } from 'lucide-react';

// --- مكون الكتابة الذكية باللغة العربية ---
const SmartArabicWriter = ({ text, onComplete, speed = 15 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (onComplete) setTimeout(onComplete, 300);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="relative inline-block text-right w-full" dir="rtl">
      <div className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed drop-shadow-md whitespace-pre-wrap">
        {displayedText}
        {isTyping && <span className="inline-block w-2 h-5 bg-cyan-400 animate-pulse mr-1 align-middle"></span>}
      </div>
    </div>
  );
};

export default function UltimatePhotographyLesson() {
  const [stage, setStage] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [lessonActive, setLessonActive] = useState(true);

  // --- حالات المحاكيات المختلفة ---
  const [dslrCapturing, setDslrCapturing] = useState(false);
  const [parallaxDistance, setParallaxDistance] = useState(100);
  const [focalLength, setFocalLength] = useState(50);
  const [aperture, setAperture] = useState(5.6);
  const [focusTarget, setFocusTarget] = useState('window');
  const [shutterSpeed, setShutterSpeed] = useState(125);
  const [iso, setIso] = useState(100);
  const [exposureLevel, setExposureLevel] = useState(10); // 5 under, 10 good, 20 over
  const [whiteBalance, setWhiteBalance] = useState('daylight');
  const [cameraMode, setCameraMode] = useState('AUTO');
  const [gimpTool, setGimpTool] = useState('rect');

  // --- محتوى الفصل الثالث بالكامل ---
  const lessonStages = [
    {
      id: "intro", icon: <Camera />, title: "مفهوم الكاميرا الرقمية",
      text: "الكاميرات عامة (تقليدية أو رقمية) هي عبارة عن صندوق أسود لا ينفذ فيه الضوء إلا من مكان واحد هو العدسة. تستقبل الأشعة الضوئية المنعكسة وتسمح بنفاذها إلى وعاء التخزين (الفيلم الحساس، أو الشريحة Sensor).\nتصنف الكاميرات وفقاً لمتطلبات المصور ودرجة احترافه إلى عدة أنواع سنستعرضها الآن."
    },
    {
      id: "dslr", icon: <Monitor />, title: "1. الكاميرا أحادية العدسة العاكسة (DSLR)",
      text: "تسمح بتأطير الصورة قبل التقاطها. يمر الضوء من العدسة ليسقط على مرآة تعكسه للمنشور ثم إلى محدد الرؤية (لترى المساحة الحقيقية).\nعند الالتقاط، تتحرك المرآة العاكسة (ترتفع) ليفتح الغالق ويتعرض مستشعر الصورة للضوء. وتتيح تغيير العدسات.\n(اضغط التقاط لترى الحركة الميكانيكية)."
    },
    {
      id: "rangefinder", icon: <Eye />, title: "2. كاميرا محدد المدى (Range Finder)",
      text: "لا تمد المصور بالقدرة على رؤية الموضوع من خلال العدسة، بل تعتمد على نظام يطابق صورتين لتركيز دقيق.\nميزتها: عدم وجود مرآة عاكسة يخفف من اهتزاز الكاميرا بشكل كبير، وتتميز بصغر حجمها وخفة وزنها."
    },
    {
      id: "pointshoot", icon: <Camera />, title: "3. الكاميرا المدمجة (Point and Shoot)",
      text: "صغيرة الحجم، تسمى (صوّب وصوّر) لأنها لا تتطلب تعديل إعدادات. عدستها مدمجة لا تفصل، وبها فلاش مدمج.\nتفصل هذه الكاميرا بين مسار العدسة ومحدد الرؤية، مما يسبب ما يسمى (عيب البرالكس Parallax) حيث يختلف ما تراه العين عما تصوره العدسة، ويظهر بشدة عند الاقتراب من الهدف.\n(حرك الهدف لترى عيب البرالكس)."
    },
    {
      id: "lens_parts", icon: <Aperture />, title: "مكونات الكاميرا: العدسة وأنواع زجاجها",
      text: "العدسة مجموعة من القطع الزجاجية لتجميع الأشعة وتكوين صورة مصغرة مقلوبة على المستشعر.\nليست قطعة واحدة، بل تشمل قطعاً: محدبة، مقعرة، هلالية (محدبة مقعرة)، مستوية محدبة، وعدسة فريزنل.\n(شاهد التشكيل الهندسي للعدسات)."
    },
    {
      id: "focal_length", icon: <Maximize />, title: "البعد البؤري وحجم الصورة",
      text: "البعد البؤري (Focal Length): هو المسافة بين المركز البصري للعدسة وسطح المستشعر ويقاس بالـ (mm).\n- عدسة طويلة (Telephoto): أكبر من 50mm، تكبر حجم الصورة (زاوية ضيقة).\n- عدسة قصيرة (Wide Angle): أقل من 50mm، تصغر الصورة (زاوية واسعة).\n- عدسة متحركة (Zoom): تغير البعد البؤري.\n(غير البعد البؤري ولاحظ التكبير)."
    },
    {
      id: "angle_of_view", icon: <Eye />, title: "زاوية الرؤية (Angle of View)",
      text: "هي الزاوية المحصورة بين أقصى شعاعين يمران بالمركز البصري. عدسة 35mm ترى بزاوية 63 درجة، وعدسة 50mm ترى بزاوية 46 درجة.\nتأثير البعد البؤري يظهر جلياً في اتساع المنظر المصور، وهو ما يوضح العلاقة بين العناصر القريبة والبعيدة (المنظور).\n(لاحظ تغير زاوية الرؤية على المشهد)."
    },
    {
      id: "aperture", icon: <Aperture />, title: "فتحة العدسة وعمق الميدان (Aperture)",
      text: "تتحكم في كمية الضوء الساقط على المستشعر وفي (عمق الميدان). يحدد اتساعها بالرقم البؤري (f-stop).\n- رقم صغير (f/2.8): فتحة واسعة، إضاءة أكثر، عمق ميدان ضحل (يعزل الخلفية).\n- رقم كبير (f/16): فتحة ضيقة، إضاءة أقل، عمق ميدان عالي (تفاصيل واضحة للكل).\n(غير الفتحة ولاحظ عزل الخلفية في محاكي الشباك)."
    },
    {
      id: "autofocus", icon: <Focus />, title: "ضبط حدة الصورة (Auto Focusing)",
      text: "يتم قياس أعلى تباين لحافة الصورة. تستخدم الكاميرات أشعة تحت حمراء أو ضوء مساعد لقياس المسافة.\nتحذير للمصور: يجب ألا يغطي بأصبعه مستشعرات الضوء. وأيضاً قد تتشتت الكاميرا بين التركيز على جسم قريب (كإطار نافذة) أو المنظر الطبيعي خلفه.\n(جرب تشتيت الفوكس)."
    },
    {
      id: "lens_types", icon: <Layers />, title: "أنواع العدسات (Lens Types)",
      text: "1. طويلة البعد البؤري (Telephoto): تضغط المسافة وتكبر الأشياء (للتصوير الرياضي وعزل الخلفية بقوة).\n2. قصيرة البعد البؤري (Wide Angle): زاوية واسعة وعمق ميدان كبير (لتصوير المناظر وإظهار الخلفية بوضوح).\n3. عدسة الزوم (Zoom Lens): تغير البعد البؤري.\n4. القياسية (Normal): 50mm تعطي منظوراً يطابق عين الإنسان."
    },
    {
      id: "shutter", icon: <Zap />, title: "الغالق وسرعة الغالق (Shutter)",
      text: "الغالق أداة للتحكم في زمن مرور الضوء (سرعة التعريض). أنواعه:\n- غالق بين العدسات (شرائح معدنية).\n- مستوى بؤري (ستارتين).\n- إلكتروني بصري، أو الشريحة الحساسة نفسها كغالق.\nالسرعة العالية (1/1000) تجمد الحركة، والبطيئة (1/15) تظهر حركة ضبابية.\n(غير سرعة الغالق لمشاهدة الحركة)."
    },
    {
      id: "sensor_types", icon: <Grid />, title: "الشريحة الحساسة (Image Sensor)",
      text: "رقاقة تحول الضوء لشحنات كهربية. لالتقاط الألوان توضع فوقها 3 رقائق منفصلة لمرشحات (أحمر، أخضر، أزرق RGB).\nالأنواع:\n- CCD: قيم الفولت تنشأ صفاً بصف (كل عنصر يسجل لون واحد).\n- CMOS: قيم الفولت لكل عنصر يتم إنشاؤها معاً في نفس الوقت."
    },
    {
      id: "iso", icon: <Sun />, title: "حساسية الأيزو (ISO)",
      text: "ترمز لمدى حساسية الشريحة للضوء. التصوير الليلي يحتاج لرقم أيزو كبير (مثل 800 أو 1600 أو 3200).\nكلما زاد رقم الـ ISO زادت حساسية الكاميرا للضوء، ولكن ذلك يقلل من جودة الصورة ويزيد من التشويش (Noise).\n(ارفع الأيزو ولاحظ التشويش في المشهد)."
    },
    {
      id: "exposure", icon: <Image />, title: "التعريض (Exposure)",
      text: "يعتمد على سرعة الغالق وفتحة العدسة (ويتم أوتوماتيكياً أو يدوياً). له 3 حالات رئيسية:\n1. تعريض ناقص (5 Units): صورة مظلمة.\n2. تعريض جيد (10 Units): إضاءة مثالية.\n3. تعريض زائد (20 Units): صورة ساطعة وفقدان للتفاصيل.\n(تحكم في التعريض)."
    },
    {
      id: "white_balance", icon: <Sun />, title: "توازن اللون الأبيض (White Balance)",
      text: "موازنة الألوان للحصول على إضاءة طبيعية دون أن يطغى قناع لوني (أحمر أو أزرق) على الصورة.\nمصادر الضوء تختلف في درجة الحرارة (الكلفن): ضوء النهار 5600K، التنجستين (أصفر ساخن)، الفلورسنت، الغيوم، الظل.\n(غير إضاءة المشهد ولاحظ كيف يتغير التوازن اللوني)."
    },
    {
      id: "flash_battery", icon: <Battery />, title: "الفلاش والبطاريات",
      text: "الفلاش: يعالج ضعف الإضاءة (يستهلك البطارية بكثرة). مؤشر الفلاش (أحمر ثابت=جاهز، وامض=يشحن، مطفأ=مغلق). يمكن استخدامه نهاراً لإنارة الظل (Fill Flash).\nالبطاريات: Alkaline (تنفد بسرعة)، NiMH (تشحن لـ 1000 مرة، تفرغ تلقائياً)، Lithium (ممتازة للبرد، غالية)."
    },
    {
      id: "memory_cards", icon: <HardDrive />, title: "كروت الذاكرة (Memory Cards)",
      text: "ترتبط بجودة تفاصيل الصورة وحجمها (بالميجابايت). أنواعها: SD, XD, CF, Memory Sticks.\nحجم الكارت يحدد عدد الصور بناءً على عدد البيكسلات. نقل الصور يستغرق وقتاً أطول كلما زادت حدة التفاصيل."
    },
    {
      id: "camera_modes", icon: <Sliders />, title: "أوضاع الكاميرا (Camera Modes)",
      text: "1. AUTO: أوتوماتيكي بالكامل.\n2. Portrait: فتحة واسعة לעزل الخلفية.\n3. Macro: للأشياء الدقيقة كالحشرات.\n4. Landscape: فتحة ضيقة وعمق ميدان كبير.\n5. Sport: سرعة غالق عالية لتجميد الحركة.\n6. Night: سرعة غالق بطيئة.\n7. P (مبرمج)، 8. S (أولوية غالق)، 9. A (أولوية فتحة)، 10. M (يدوي كامل)."
    },
    {
      id: "gimp_intro", icon: <Edit3 />, title: "معالجة الصورة الرقمية (GIMP)",
      text: "عملية تحسين الجودة بمجرد تخزينها رقمياً (0,1). \nأهميتها: تقليل/زيادة حجم الملف، تحقيق الغرض الجمالي، التوضيح، وتجنب التزييف العلمي.\nخطواتها: نقل الصور، إعادة تسميتها، النسخ الاحتياطي، الاستعراض والحذف، التدوير، العمل على نسخة، الاقتصاص، وتصحيح الألوان."
    },
    {
      id: "gimp_software", icon: <Monitor />, title: "برامج المعالجة وأنواعها",
      text: "1. احترافية: Adobe Photoshop (CMYK، 16bit)، Corel Photo Painter، Apple Aperture، Lightroom.\n2. شبه احترافية: Paint Shop Pro، GIMP (رسم وتلوين وتحرير الصور مجاناً)، Adobe Elements.\n3. للمبتدئين: MS Picture It."
    },
    {
      id: "gimp_tools", icon: <Scissors />, title: "واجهة وأدوات التحديد في GIMP",
      text: "واجهة GIMP تضم: القوائم، منطقة العمل، صندوق الأدوات، خصائص الأدوات، الطبقات.\nأدوات التحديد: \n- مستطيل (Rectangle)، بيضاوي (Ellipse).\n- تحديد حر (Free Select / Lasso).\n- التحديد الضبابي/العصا السحرية (Fuzzy Select - للألوان المتجانسة المتصلة).\n- تحديد لوني (Select by Color - للمنفصلة)، مقص (Scissors)."
    },
    {
      id: "gimp_edits", icon: <Layers />, title: "عمليات التعديل في GIMP",
      text: "- التحجيم (Scale): تغيير الطول والعرض مع الحفاظ على التناسب.\n- الانعكاس (Transform): قلب الصورة رأسياً أو أفقياً.\n- النصوص (Text): إضافة كلمات وضبط حجمها ولونها.\n- الدمج: إزالة خلفية (Alpha Channel) ووضع صورة فوق أخرى.\n- الفلاتر: إضافة مؤثرات خاصة للصور."
    },
    {
      id: "publishing", icon: <BookOpen />, title: "معايير تصميم وتوظيف الصور",
      text: "عند استخدام الصورة في بوستر أو كتاب إلكتروني:\n1. توظيف أسس التصميم (الوحدة، الاتزان، الحركة).\n2. الارتباط بالمحتوى التعليمي (النص شارح للصورة).\n3. القرائية والتعبير عن المضمون المباشر.\n4. الأمانة العلمية وعدم الزيف.\n5. جودة الصورة (حدة التفاصيل وتشبع الألوان)، ووضعها في إطار لجذب الانتباه."
    }
  ];

  const handleNext = () => { if (stage < lessonStages.length - 1) { setStage(s => s + 1); setTypingDone(false); } };
  const handlePrev = () => { if (stage > 0) { setStage(s => s - 1); setTypingDone(false); } };

  if (!lessonActive) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-slate-800 p-8 rounded-3xl text-center shadow-2xl max-w-md border border-slate-700">
          <CheckCircle className="w-20 h-20 mx-auto text-green-400 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">تم إنهاء الفصل الثالث بنجاح</h2>
          <p className="text-slate-400 mb-8">لقد أتممت دراسة تكنولوجيا إنتاج الصورة الرقمية بالكامل (23 مختبراً).</p>
          <button onClick={() => {setStage(0); setTypingDone(false); setLessonActive(true);}} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold transition-all">العودة للأكاديمية</button>
        </div>
      </div>
    );
  }

  const currentData = lessonStages[stage];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-hidden relative text-slate-200" dir="rtl">
      {/* خلفية فنية معمارية نقية بالـ CSS */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900 via-slate-950 to-slate-950">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <header className="w-full flex justify-between items-center p-4 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-700 p-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Camera className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wider">أكاديمية التصوير الرقمي | الفصل 3</h1>
            <div className="flex gap-1 mt-1">
              {lessonStages.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === stage ? 'w-6 bg-cyan-400' : idx < stage ? 'w-3 bg-cyan-800' : 'w-1.5 bg-slate-800'}`}></div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => setLessonActive(false)} className="flex items-center gap-2 bg-red-950/30 text-red-400 hover:bg-red-900/50 px-3 py-1.5 rounded-lg border border-red-900/30 font-bold transition-all">
          <XCircle className="w-4 h-4" /> <span className="hidden md:inline">خروج</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-6 z-10 overflow-hidden h-full">
        
        {/* اللوحة اليمنى: الشرح */}
        <aside className="w-full lg:w-1/3 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="inline-flex items-center gap-2 text-cyan-300 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-800/50 mb-4">
              {currentData.icon} <span className="text-sm font-bold">مرحلة {stage + 1} / {lessonStages.length}</span>
            </div>
            
            <h2 className="text-2xl font-black text-white mb-4 border-b border-slate-700/50 pb-3">{currentData.title}</h2>
            
            <div className="min-h-[180px] mb-6">
              <SmartArabicWriter key={stage} text={currentData.text} onComplete={() => setTypingDone(true)} speed={10} />
            </div>

            {/* أدوات التحكم لكل مرحلة */}
            <div className={`transition-all duration-1000 ${typingDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
              
              {currentData.id === 'dslr' && (
                <button onClick={() => {setDslrCapturing(true); setTimeout(() => setDslrCapturing(false), 800);}} className="w-full bg-cyan-900/50 hover:bg-cyan-800 text-cyan-300 font-bold py-3 rounded-xl border border-cyan-700 transition-all flex items-center justify-center gap-2">
                  <Aperture className={dslrCapturing ? 'animate-spin' : ''} /> التقاط صورة ومراقبة المرآة
                </button>
              )}

              {currentData.id === 'pointshoot' && (
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <label className="block text-sm text-cyan-400 mb-2 font-bold">المسافة للهدف: {parallaxDistance}متر</label>
                  <input type="range" min="1" max="100" value={parallaxDistance} onChange={e => setParallaxDistance(e.target.value)} className="w-full accent-cyan-500" dir="ltr" />
                  <p className="text-xs text-slate-400 mt-2">اسحب للتقريب ولاحظ اختلاف مسار الرؤية (البرالكس).</p>
                </div>
              )}

              {(currentData.id === 'focal_length' || currentData.id === 'angle_of_view') && (
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <label className="block text-sm text-cyan-400 mb-2 font-bold">البعد البؤري: {focalLength} mm</label>
                  <input type="range" min="18" max="135" value={focalLength} onChange={e => setFocalLength(e.target.value)} className="w-full accent-cyan-500" dir="ltr" />
                  <div className="flex justify-between text-xs text-slate-500 mt-1"><span>Wide (18)</span><span>Tele (135)</span></div>
                </div>
              )}

              {currentData.id === 'aperture' && (
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <label className="block text-sm text-cyan-400 mb-2 font-bold">فتحة العدسة (Aperture): f/{aperture}</label>
                  <input type="range" min="1.4" max="22" step="0.5" value={aperture} onChange={e => setAperture(e.target.value)} className="w-full accent-cyan-500" dir="ltr" />
                  <div className="flex justify-between text-xs text-slate-500 mt-1"><span>واسعة (عزل)</span><span>ضيقة (واضحة)</span></div>
                </div>
              )}

              {currentData.id === 'autofocus' && (
                <div className="flex gap-2">
                  <button onClick={() => setFocusTarget('window')} className={`flex-1 py-2 rounded-lg font-bold border transition-all ${focusTarget==='window'?'bg-cyan-600 text-white border-cyan-400':'bg-slate-800 text-slate-400 border-slate-700'}`}>فوكس النافذة</button>
                  <button onClick={() => setFocusTarget('landscape')} className={`flex-1 py-2 rounded-lg font-bold border transition-all ${focusTarget==='landscape'?'bg-cyan-600 text-white border-cyan-400':'bg-slate-800 text-slate-400 border-slate-700'}`}>فوكس المنظر</button>
                </div>
              )}

              {currentData.id === 'shutter' && (
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <label className="block text-sm text-cyan-400 mb-2 font-bold">السرعة (Shutter): 1/{shutterSpeed}s</label>
                  <input type="range" min="15" max="1000" step="50" value={shutterSpeed} onChange={e => setShutterSpeed(e.target.value)} className="w-full accent-cyan-500" dir="ltr" />
                  <div className="flex justify-between text-xs text-slate-500 mt-1"><span>بطيء (ضبابي)</span><span>سريع (تجميد)</span></div>
                </div>
              )}

              {currentData.id === 'iso' && (
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <label className="block text-sm text-cyan-400 mb-2 font-bold">ISO حساسية: {iso}</label>
                  <input type="range" min="100" max="3200" step="100" value={iso} onChange={e => setIso(e.target.value)} className="w-full accent-cyan-500" dir="ltr"/>
                </div>
              )}

              {currentData.id === 'exposure' && (
                <div className="flex gap-2">
                  <button onClick={() => setExposureLevel(5)} className={`flex-1 py-2 rounded-lg font-bold border transition-all ${exposureLevel===5?'bg-slate-600 text-white border-slate-400':'bg-slate-800 text-slate-400 border-slate-700'}`}>ناقص (5)</button>
                  <button onClick={() => setExposureLevel(10)} className={`flex-1 py-2 rounded-lg font-bold border transition-all ${exposureLevel===10?'bg-green-600 text-white border-green-400':'bg-slate-800 text-slate-400 border-slate-700'}`}>جيد (10)</button>
                  <button onClick={() => setExposureLevel(20)} className={`flex-1 py-2 rounded-lg font-bold border transition-all ${exposureLevel===20?'bg-yellow-600 text-white border-yellow-400':'bg-slate-800 text-slate-400 border-slate-700'}`}>زائد (20)</button>
                </div>
              )}

              {currentData.id === 'white_balance' && (
                <div className="grid grid-cols-2 gap-2">
                  {[{id: 'daylight', label: 'ضوء نهار 5600K', c: 'text-yellow-100'}, {id: 'tungsten', label: 'تنجستين (ساخن)', c: 'text-orange-400'}, {id: 'fluorescent', label: 'فلورسنت (بارد)', c: 'text-blue-300'}, {id: 'cloudy', label: 'غيوم (دافئ)', c: 'text-slate-300'}].map(wb => (
                    <button key={wb.id} onClick={() => setWhiteBalance(wb.id)} className={`py-2 text-sm font-bold border rounded-lg transition-all ${whiteBalance === wb.id ? 'bg-slate-700 border-cyan-400' : 'bg-slate-800 border-slate-700'} ${wb.c}`}>{wb.label}</button>
                  ))}
                </div>
              )}

              {currentData.id === 'camera_modes' && (
                <div className="grid grid-cols-3 gap-2">
                  {['AUTO', 'Portrait', 'Macro', 'Land', 'Sport', 'Night', 'P', 'S', 'A', 'M'].map(m => (
                    <button key={m} onClick={() => setCameraMode(m)} className={`py-1.5 rounded-lg text-sm font-bold border transition-all ${cameraMode === m ? 'bg-cyan-600 text-white border-cyan-300' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{m}</button>
                  ))}
                </div>
              )}

              {currentData.id === 'gimp_tools' && (
                <div className="grid grid-cols-3 gap-2">
                  {['rect', 'ellipse', 'free', 'fuzzy', 'color', 'scissors'].map(t => (
                    <button key={t} onClick={() => setGimpTool(t)} className={`py-1.5 rounded-lg text-sm font-bold border transition-all ${gimpTool === t ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{t}</button>
                  ))}
                </div>
              )}

            </div>
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700/50 shrink-0">
            <button onClick={handleNext} disabled={stage === lessonStages.length - 1} className="flex-1 bg-gradient-to-l from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
              التالي <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handlePrev} disabled={stage === 0} className="px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center transition-all border border-slate-700">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* اللوحة اليسرى: مسرح العمليات المرئي (100% SVG/CSS) */}
        <section className="flex-1 bg-black/60 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden relative flex items-center justify-center min-h-[400px]">
          
          {currentData.id === 'intro' && (
            <div className="text-center animate-[fadeIn_1s_ease-out]">
              <div className="w-64 h-48 bg-slate-900 border-4 border-slate-700 rounded-xl relative shadow-2xl flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-8 border-slate-800 bg-black absolute -left-10 shadow-inner flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-900/50 shadow-[inset_0_0_15px_#06b6d4]"></div>
                </div>
                <span className="text-slate-600 font-mono tracking-widest text-xl opacity-50">BLACK BOX</span>
              </div>
            </div>
          )}

          {currentData.id === 'dslr' && (
            <svg viewBox="0 0 800 500" className="w-full h-full max-w-2xl">
              <path d="M 250 100 L 600 100 L 600 400 L 250 400 Z" fill="#1e293b" stroke="#334155" strokeWidth="6" rx="20" />
              <polygon points="350,100 450,40 500,100" fill="#334155" stroke="#475569" strokeWidth="4" />
              <rect x="230" y="60" width="80" height="50" fill="#0f172a" stroke="#475569" strokeWidth="4" rx="5" />
              <path d="M 250 150 L 50 130 L 50 370 L 250 350 Z" fill="#0f172a" stroke="#334155" strokeWidth="6" />
              <path d="M 120 140 Q 150 250 120 360" fill="none" stroke="#38bdf8" strokeWidth="4" opacity="0.4" />
              <rect x="550" y="150" width="15" height="200" fill="#10b981" rx="5" />
              <line x1="400" y1="350" x2={dslrCapturing ? 400 : 260} y2={dslrCapturing ? 200 : 200} stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" className="transition-all duration-300" />
              {dslrCapturing ? (
                <line x1="0" y1="250" x2="550" y2="250" stroke="#facc15" strokeWidth="6" className="animate-pulse" />
              ) : (
                <path d="M 0 250 L 330 250 L 330 85 L 230 85" fill="none" stroke="#facc15" strokeWidth="4" strokeDasharray="10,10" className="animate-[dash_1s_linear_infinite]" />
              )}
            </svg>
          )}

          {currentData.id === 'rangefinder' && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-80 h-48 bg-slate-300 rounded-xl relative shadow-2xl flex flex-col items-center justify-center border-4 border-slate-400">
                <div className="absolute top-4 right-4 w-12 h-8 bg-black rounded flex items-center justify-center"><div className="w-4 h-4 rounded-full bg-white/20"></div></div>
                <div className="absolute top-4 left-4 w-8 h-8 bg-black rounded flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-white/20"></div></div>
                <div className="w-24 h-24 rounded-full border-8 border-slate-500 bg-slate-900 mt-4 flex items-center justify-center">
                   <div className="w-12 h-12 rounded-full bg-blue-900/40"></div>
                </div>
                <div className="absolute -bottom-10 text-cyan-400 font-bold">لا توجد مرآة عاكسة (أخف وزناً)</div>
              </div>
            </div>
          )}

          {currentData.id === 'pointshoot' && (
            <div className="w-full h-full relative bg-slate-900 flex px-8 gap-8 items-center">
              <div className="w-1/4 flex flex-col items-end relative h-64">
                 <div className="w-full h-1 bg-red-500/50 absolute top-[25%] right-0"></div>
                 <div className="w-full h-1 bg-cyan-500/50 absolute top-[75%] right-0"></div>
                 <div className="bg-slate-700 w-32 h-full rounded-xl border-4 border-slate-600 flex flex-col items-center justify-around py-4 z-10">
                   <div className="w-12 h-8 bg-black rounded border-2 border-slate-500 relative"><span className="absolute -top-6 -right-2 text-xs text-red-400 whitespace-nowrap">محدد الرؤية</span></div>
                   <div className="w-16 h-16 bg-black rounded-full border-4 border-slate-500 relative flex items-center justify-center"><div className="w-8 h-8 bg-slate-800 rounded-full"></div><span className="absolute -bottom-6 -right-2 text-xs text-cyan-400 whitespace-nowrap">العدسة</span></div>
                 </div>
              </div>
              <div className="flex-1 relative h-64 border-l-2 border-dashed border-slate-600 flex items-center">
                <div className="absolute w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-slate-900 font-black text-xl transition-all duration-300 z-10" style={{ right: `${parallaxDistance}%`, top: '40%' }}>الهدف</div>
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                   <line x1="100%" y1="25%" x2={`${parallaxDistance}%`} y2="50%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
                   <line x1="100%" y1="75%" x2={`${parallaxDistance}%`} y2="50%" stroke="#06b6d4" strokeWidth="2" />
                </svg>
              </div>
            </div>
          )}

          {currentData.id === 'lens_parts' && (
            <div className="w-full h-full flex flex-col items-center justify-center gap-8">
               <h3 className="text-cyan-400 font-bold">أنواع القطع العدسية (الشكل 49)</h3>
               <div className="flex gap-8 items-end">
                 <div className="flex flex-col items-center gap-2">
                   <div className="w-10 h-32 bg-blue-400/30 border-2 border-blue-400 rounded-[50px_50px_50px_50px]"></div>
                   <span className="text-xs text-slate-400">محدبة</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                   <div className="w-10 h-32 bg-blue-400/30 border-2 border-blue-400 rounded-none relative overflow-hidden" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 70% 50%, 100% 100%, 0% 100%, 30% 50%)' }}></div>
                   <span className="text-xs text-slate-400">مقعرة</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-32 bg-blue-400/30 border-2 border-blue-400 rounded-[50px_0_0_50px] relative overflow-hidden" style={{ clipPath: 'ellipse(100% 50% at 0% 50%)' }}></div>
                   <span className="text-xs text-slate-400">هلالية</span>
                 </div>
               </div>
            </div>
          )}

          {(currentData.id === 'focal_length' || currentData.id === 'angle_of_view') && (
            <div className="w-full h-full overflow-hidden relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out" style={{ transform: `scale(${focalLength / 25})` }}>
                {/* رسم SVG كامل للمشهد الطبيعي ليحل محل الصور الخارجية */}
                <svg viewBox="0 0 1000 800" className="w-[1000px] h-[800px] bg-sky-200">
                  <rect x="0" y="500" width="1000" height="300" fill="#22c55e" /> {/* عشب */}
                  <polygon points="0,500 300,200 600,500" fill="#64748b" /> {/* جبل 1 */}
                  <polygon points="400,500 700,100 1000,500" fill="#475569" /> {/* جبل 2 */}
                  <circle cx="200" cy="150" r="80" fill="#eab308" /> {/* شمس */}
                  <rect x="480" y="400" width="40" height="150" fill="#78350f" /> {/* جذع شجرة */}
                  <circle cx="500" cy="350" r="100" fill="#15803d" /> {/* أوراق شجرة */}
                  <path d="M 0 600 Q 500 500 1000 700 L 1000 800 L 0 800 Z" fill="#3b82f6" opacity="0.6"/> {/* نهر */}
                </svg>
              </div>
              <div className="absolute inset-0 border-[40px] border-black/90 pointer-events-none"></div>
              <div className="absolute inset-0 border-2 border-white/20 m-[40px] pointer-events-none flex flex-col items-center justify-between py-2">
                <span className="text-white bg-black/50 px-2 rounded font-mono text-xs">Angle: {Math.round(100 - focalLength/2)}°</span>
                <div className="w-10 h-10 border border-white/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          )}

          {currentData.id === 'aperture' && (
            <div className="w-full h-full relative overflow-hidden bg-sky-100 flex items-center justify-center">
              {/* رسم SVG للمشهد */}
              <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full transition-all duration-500" style={{ filter: `blur(${Math.max(0, (16 - aperture) * 1.2)}px)` }}>
                 <rect x="0" y="300" width="800" height="300" fill="#4ade80"/>
                 <polygon points="100,300 300,100 500,300" fill="#94a3b8"/>
                 <circle cx="600" cy="150" r="50" fill="#facc15"/>
              </svg>
              {/* شخصية في المقدمة */}
              <svg viewBox="0 0 200 300" className="absolute bottom-0 w-48 h-64 z-10 filter drop-shadow-2xl">
                 <circle cx="100" cy="80" r="50" fill="#f87171"/>
                 <rect x="50" y="140" width="100" height="160" rx="20" fill="#ef4444"/>
              </svg>
            </div>
          )}

          {currentData.id === 'autofocus' && (
            <div className="w-full h-full relative overflow-hidden bg-sky-200">
               {/* المنظر الخارجي */}
               <svg viewBox="0 0 800 600" className={`absolute inset-0 w-full h-full transition-all duration-700 ${focusTarget === 'window' ? 'blur-md scale-105' : 'blur-0 scale-100'}`}>
                 <rect x="0" y="400" width="800" height="200" fill="#22c55e"/>
                 <circle cx="600" cy="200" r="80" fill="#facc15"/>
                 <polygon points="200,400 400,150 600,400" fill="#64748b"/>
               </svg>
               {/* النافذة القريبة */}
               <div className={`absolute inset-0 border-[60px] border-[#8B4513] transition-all duration-700 ${focusTarget === 'landscape' ? 'blur-sm' : 'blur-0'}`}>
                 <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                   <div className="border-b-8 border-r-8 border-[#8B4513] relative"><div className="absolute top-1/2 left-1/4 w-4 h-6 bg-white/40 rounded-full rotate-12"></div></div>
                   <div className="border-b-8 border-[#8B4513]"></div>
                   <div className="border-r-8 border-[#8B4513] relative"><div className="absolute top-1/4 right-1/4 w-3 h-5 bg-white/40 rounded-full -rotate-12"></div></div>
                   <div></div>
                 </div>
               </div>
               {/* مربع الفوكس */}
               <div className={`absolute w-16 h-16 border-2 border-green-500 transition-all duration-500 ${focusTarget === 'window' ? 'top-12 left-12' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}`}></div>
            </div>
          )}

          {currentData.id === 'lens_types' && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                {[
                  { n: 'Telephoto', d: 'زاوية ضيقة، تكبير عالٍ' },
                  { n: 'Wide Angle', d: 'زاوية واسعة، مساحة كبيرة' },
                  { n: 'Zoom Lens', d: 'بعد بؤري متغير' },
                  { n: 'Normal Lens', d: '50mm عين الإنسان' }
                ].map(l => (
                  <div key={l.n} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-black rounded-full border-4 border-slate-600 mb-2 flex items-center justify-center"><div className="w-6 h-6 bg-cyan-900/50 rounded-full"></div></div>
                    <span className="text-cyan-400 font-bold">{l.n}</span>
                    <span className="text-xs text-slate-400">{l.d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentData.id === 'shutter' && (
            <div className="w-full h-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
              <svg viewBox="0 0 800 200" className="absolute bottom-10 w-full h-32">
                <line x1="0" y1="100" x2="800" y2="100" stroke="#475569" strokeWidth="4" strokeDasharray="20,20"/>
              </svg>
              <div 
                className="w-32 h-16 bg-red-500 rounded-xl flex items-center justify-center text-white font-bold"
                style={{
                  filter: `blur(${shutterSpeed < 200 ? (200 - shutterSpeed) / 10 : 0}px)`,
                  animation: `driveX ${2000 / Math.max(50, shutterSpeed)}s infinite alternate linear`
                }}
              >
                CAR
              </div>
              <style dangerouslySetInnerHTML={{__html: `@keyframes driveX { 0% { transform: translateX(-200px); } 100% { transform: translateX(200px); } }`}} />
            </div>
          )}

          {currentData.id === 'sensor_types' && (
            <div className="w-full h-full flex gap-8 items-center justify-center p-8 bg-slate-900">
              <div className="flex-1 flex flex-col items-center">
                <h3 className="text-cyan-400 font-bold mb-4">CCD</h3>
                <div className="w-40 h-40 bg-slate-800 grid grid-cols-5 grid-rows-5 gap-1 p-1">
                  {Array.from({length: 25}).map((_, i) => (
                     <div key={i} className={`w-full h-full bg-blue-500 animate-[ccdRead_2.5s_linear_infinite]`} style={{ animationDelay: `${Math.floor(i/5)*0.5}s` }}></div>
                  ))}
                </div>
                <span className="text-xs text-slate-400 mt-2">قراءة صف بصف</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <h3 className="text-green-400 font-bold mb-4">CMOS</h3>
                <div className="w-40 h-40 bg-slate-800 grid grid-cols-5 grid-rows-5 gap-1 p-1">
                   {Array.from({length: 25}).map((_, i) => (
                     <div key={i} className={`w-full h-full bg-green-500 animate-pulse`} style={{ animationDuration: '0.5s' }}></div>
                  ))}
                </div>
                <span className="text-xs text-slate-400 mt-2">معالجة فورية للكل</span>
              </div>
              <style dangerouslySetInnerHTML={{__html: `@keyframes ccdRead { 0%, 10% { opacity: 0.2; } 20%, 80% { opacity: 1; } 90%, 100% { opacity: 0.2; } }`}} />
            </div>
          )}

          {currentData.id === 'iso' && (
            <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
              <svg width="0" height="0">
                <filter id="isoNoise">
                  <feTurbulence type="fractalNoise" baseFrequency={iso / 1500} numOctaves="2" stitchTiles="stitch"/>
                  <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.5 0" />
                </filter>
              </svg>
              {/* رسم مشهد ليلي بـ SVG */}
              <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full">
                <rect width="800" height="600" fill="#0f172a" />
                <circle cx="600" cy="150" r="50" fill="#fef08a" opacity="0.8"/>
                <polygon points="0,600 300,300 600,600" fill="#1e293b" />
                <polygon points="400,600 700,200 1000,600" fill="#0f172a" />
              </svg>
              {/* طبقة الضوضاء */}
              <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 transition-opacity duration-300"
                   style={{ opacity: (iso - 100) / 3200, backdropFilter: 'url(#isoNoise)' }}>
              </div>
            </div>
          )}

          {currentData.id === 'exposure' && (
            <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
               <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full transition-all duration-300"
                    style={{ filter: `brightness(${exposureLevel / 10})` }}>
                  <rect width="800" height="600" fill="#38bdf8"/>
                  <circle cx="400" cy="300" r="100" fill="#facc15"/>
                  <rect x="0" y="400" width="800" height="200" fill="#22c55e"/>
               </svg>
               <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded font-mono">EV: {exposureLevel} Units</div>
            </div>
          )}

          {currentData.id === 'white_balance' && (
            <div className="w-full h-full relative overflow-hidden">
              {/* رسم سلة فواكه بـ SVG */}
              <svg viewBox="0 0 800 600" className="w-full h-full bg-slate-200">
                <path d="M 200 400 Q 400 500 600 400 L 550 300 L 250 300 Z" fill="#8B4513"/> {/* سلة */}
                <circle cx="350" cy="320" r="60" fill="#ef4444"/> {/* تفاحة أحمر */}
                <circle cx="450" cy="340" r="50" fill="#eab308"/> {/* برتقالة */}
                <circle cx="400" cy="280" r="40" fill="#84cc16"/> {/* عنب */}
                <circle cx="430" cy="260" r="30" fill="#84cc16"/>
                <circle cx="370" cy="250" r="30" fill="#84cc16"/>
              </svg>
              {/* فلتر الإضاءة لتمثيل توازن اللون الأبيض */}
              <div className="absolute inset-0 mix-blend-color transition-colors duration-700"
                   style={{ backgroundColor: 
                     whiteBalance === 'daylight' ? 'rgba(255,255,255,0)' :
                     whiteBalance === 'tungsten' ? 'rgba(0,100,255,0.3)' : // تصحيح اصفرار
                     whiteBalance === 'fluorescent' ? 'rgba(255,150,150,0.2)' : // تصحيح زرقة
                     'rgba(255,200,100,0.3)' // غيوم
                   }}>
              </div>
            </div>
          )}

          {currentData.id === 'flash_battery' && (
            <div className="w-full h-full bg-slate-900 p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <div className="flex gap-4">
                <div className="bg-slate-800 p-4 rounded-xl flex-1 border border-slate-700">
                  <h3 className="text-cyan-400 font-bold mb-2">أنواع البطاريات</h3>
                  <table className="w-full text-sm text-right text-slate-300">
                    <tr className="border-b border-slate-700"><td className="py-2">Alkaline</td><td className="text-red-400">تنفد بسرعة</td></tr>
                    <tr className="border-b border-slate-700"><td className="py-2">NiMH</td><td className="text-green-400">تشحن 1000 مرة</td></tr>
                    <tr><td className="py-2">Lithium</td><td className="text-yellow-400">قوية ولكن غالية</td></tr>
                  </table>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl flex-1 border border-slate-700 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]"></div>
                  </div>
                  <span className="text-sm font-bold text-white">يومض = يشحن الفلاش</span>
                </div>
              </div>
            </div>
          )}

          {currentData.id === 'memory_cards' && (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 p-8">
               <div className="w-64 h-80 bg-black rounded-xl border-2 border-slate-700 relative flex flex-col p-4 shadow-2xl">
                 <div className="w-full flex justify-end"><div className="w-8 h-4 bg-yellow-600 rounded-b"></div></div>
                 <div className="flex-1 mt-4 border-2 border-dashed border-slate-700 flex items-center justify-center flex-col">
                   <HardDrive className="w-12 h-12 text-cyan-400 mb-2"/>
                   <span className="font-black text-2xl text-white">64 GB</span>
                   <span className="text-slate-500 font-mono">SD Card</span>
                 </div>
               </div>
            </div>
          )}

          {currentData.id === 'camera_modes' && (
             <div className="w-full h-full flex items-center justify-center bg-slate-900">
                <div className="relative w-64 h-64 rounded-full bg-slate-800 border-[16px] border-black flex items-center justify-center shadow-2xl transition-transform duration-500"
                     style={{ transform: `rotate(${['AUTO', 'Portrait', 'Macro', 'Land', 'Sport', 'Night', 'P', 'S', 'A', 'M'].indexOf(cameraMode) * -36}deg)` }}>
                   {['AUTO', 'Port', 'Macro', 'Land', 'Sport', 'Night', 'P', 'S', 'A', 'M'].map((m, i) => (
                     <div key={m} className="absolute font-black text-sm" style={{ transform: `rotate(${i * 36}deg) translateY(-100px)`, color: m === 'AUTO' ? '#4ade80' : 'white' }}>{m}</div>
                   ))}
                   <div className="w-32 h-32 bg-slate-900 rounded-full border-4 border-slate-700 shadow-inner"></div>
                </div>
             </div>
          )}

          {currentData.id === 'gimp_intro' && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
               <div className="text-6xl text-purple-500 drop-shadow-[0_0_20px_purple] font-black">GIMP</div>
               <p className="text-slate-400 mt-4 text-center px-12">برنامج معالجة الصور الرقمية لتحسين الجودة<br/>(زيادة الوضوح، تعديل الألوان، حذف عناصر)</p>
            </div>
          )}

          {currentData.id === 'gimp_software' && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-8 gap-4">
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl w-full max-w-md flex justify-between items-center">
                <span className="text-red-400 font-bold">احترافي</span><span>Photoshop, Corel</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl w-full max-w-md flex justify-between items-center">
                <span className="text-purple-400 font-bold">شبه احترافي</span><span>GIMP, Paint Shop</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl w-full max-w-md flex justify-between items-center">
                <span className="text-green-400 font-bold">للمبتدئين</span><span>MS Picture It</span>
              </div>
            </div>
          )}

          {currentData.id === 'gimp_tools' && (
            <div className="w-full h-full bg-[#333] flex">
              <div className="w-16 bg-[#222] border-l border-[#444] flex flex-col p-2 gap-2">
                 <div className={`w-full aspect-square rounded flex items-center justify-center ${gimpTool==='rect'?'bg-purple-600':'bg-[#444]'}`}><div className="w-6 h-4 border border-white border-dashed"></div></div>
                 <div className={`w-full aspect-square rounded flex items-center justify-center ${gimpTool==='ellipse'?'bg-purple-600':'bg-[#444]'}`}><div className="w-6 h-4 border border-white border-dashed rounded-full"></div></div>
                 <div className={`w-full aspect-square rounded flex items-center justify-center ${gimpTool==='free'?'bg-purple-600':'bg-[#444]'}`}><MousePointer2 className="w-5 h-5 text-white"/></div>
                 <div className={`w-full aspect-square rounded flex items-center justify-center ${gimpTool==='fuzzy'?'bg-purple-600':'bg-[#444]'}`}>🪄</div>
                 <div className={`w-full aspect-square rounded flex items-center justify-center ${gimpTool==='color'?'bg-purple-600':'bg-[#444]'}`}>💧</div>
                 <div className={`w-full aspect-square rounded flex items-center justify-center ${gimpTool==='scissors'?'bg-purple-600':'bg-[#444]'}`}><Scissors className="w-5 h-5 text-white"/></div>
              </div>
              <div className="flex-1 p-8 flex items-center justify-center relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgfALEAgf///8EGGBkZ8CkwYBRgZCCzAUbTGkZTA8hoGNKDM3nFkAEAz0c0xItR0d4AAAAASUVORK5CYII=')]">
                 {/* رسمة قطة / شجرة بـ SVG */}
                 <svg viewBox="0 0 200 200" className="w-64 h-64">
                   <circle cx="100" cy="100" r="80" fill="#4ade80"/>
                   <rect x="80" y="100" width="40" height="100" fill="#78350f"/>
                 </svg>
                 {gimpTool === 'rect' && <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-white bg-blue-500/20 animate-pulse"></div>}
                 {gimpTool === 'ellipse' && <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-white rounded-full bg-blue-500/20 animate-pulse"></div>}
                 {gimpTool === 'fuzzy' && <div className="absolute top-[30%] left-[30%] w-16 h-16 border-2 border-dashed border-white rounded-full bg-blue-500/20 animate-pulse"></div>}
              </div>
            </div>
          )}

          {currentData.id === 'gimp_edits' && (
            <div className="w-full h-full bg-[#333] flex items-center justify-center gap-8 relative overflow-hidden">
               <div className="w-32 h-32 bg-blue-500 flex items-center justify-center text-white font-bold text-2xl transition-transform duration-1000 animate-[pulse_2s_infinite]">Scale</div>
               <div className="w-32 h-32 bg-green-500 flex items-center justify-center text-white font-bold text-2xl transition-transform duration-1000 rotate-180">Flip</div>
               <Type className="absolute top-10 left-10 text-white w-12 h-12 opacity-50"/>
               <Layers className="absolute bottom-10 right-10 text-white w-12 h-12 opacity-50"/>
            </div>
          )}

          {currentData.id === 'publishing' && (
            <div className="w-full h-full bg-slate-100 p-8 flex items-center justify-center">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm">
                <h3 className="text-xl font-black text-slate-800 mb-4 border-b-2 border-cyan-500 pb-2">معايير النشر</h3>
                <ul className="space-y-3 text-slate-700 text-sm">
                  <li className="flex gap-2"><CheckCircle className="text-green-500 w-5 h-5 shrink-0"/> التوظيف الفني (الوحدة والاتزان).</li>
                  <li className="flex gap-2"><CheckCircle className="text-green-500 w-5 h-5 shrink-0"/> الارتباط بالمحتوى (النص يشرح الصورة).</li>
                  <li className="flex gap-2"><CheckCircle className="text-green-500 w-5 h-5 shrink-0"/> القرائية (مناسبة للفئة العمرية).</li>
                  <li className="flex gap-2"><CheckCircle className="text-green-500 w-5 h-5 shrink-0"/> الأمانة العلمية (تجنب التزييف).</li>
                  <li className="flex gap-2"><CheckCircle className="text-green-500 w-5 h-5 shrink-0"/> جودة حادة وألوان مشبعة.</li>
                </ul>
              </div>
            </div>
          )}

        </section>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        @keyframes dash { to { stroke-dashoffset: -20; } }
      `}} />
    </div>
  );
}