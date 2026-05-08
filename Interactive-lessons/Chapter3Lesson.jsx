import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, ChevronRight, ChevronLeft, 
  LogOut, GraduationCap, Eye, Type, Layout, 
  MonitorPlay, Layers, PieChart, PenTool, Globe, 
  Lightbulb, BrainCircuit, Target, Sparkles, Map, Network, 
  Table, Image as ImageIcon, Video, MousePointerClick, 
  BookOpen, BarChart, CheckSquare
} from 'lucide-react';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // استخراج المحتوى العلمي كاملاً بعمق وبدون إشارات لأشخاص
  const lessonData = [
    {
      type: 'intro',
      title: 'الفصل الثالث: الإنفوجرافيك في التعليم',
      subtitle: 'مفاهيم، نظريات، وتطبيقات عملية',
      content: 'يُعرّف الإنفوجرافيك في التعليم بأنه أسلوب تحويل المعلومات المطلوب توصيلها للمتلقي إلى صور ورسوم ونصوص ملفتة وممتعة، والتي ينتج عنها تيسير عملية الفهم. فهو ليس مجرد أداة جمالية، بل وسيلة لترجمة الحقائق العلمية إلى رسائل بصرية سهلة الاستيعاب.',
      icon: <GraduationCap className="w-24 h-24 text-cyan-400 mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
    },
    {
      type: 'cards',
      title: 'مكونات الإنفوجرافيك التعليمي',
      icon: <Layers className="w-12 h-12 text-purple-400 mb-4" />,
      description: 'يتكون أي تصميم تعليمي ناجح من تضافر 3 عناصر أساسية:',
      items: [
        { title: 'العامل البصري', desc: 'يشمل إدخال الألوان والرسوم التي تتمثل في الأسهم، الأشكال التلقائية، والرموز لتوجيه عين المتعلم.', icon: <Eye className="w-8 h-8 text-cyan-300" /> },
        { title: 'المضمون النصي', desc: 'يعني النصوص المكتوبة، والتي من المفترض أن تكون مختصرة جداً، وترتبط ارتباطاً وثيقاً بالألوان والرسوم لتوضيحها.', icon: <Type className="w-8 h-8 text-pink-300" /> },
        { title: 'أسلوب التقديم', desc: 'تعتبر الطريقة والأسلوب التي يتم بها تقديم الإنفوجرافيك طريقة خاصة تتمثل في المعنى والمعرفة المطلوب نقلها للمتعلم.', icon: <Layout className="w-8 h-8 text-yellow-300" /> }
      ]
    },
    {
      type: 'detailed-list',
      title: 'تصنيف الإنفوجرافيك (طبقاً لطريقة العرض)',
      icon: <MonitorPlay className="w-12 h-12 text-cyan-400 mb-4" />,
      description: 'يمكن تصنيف الإنفوجرافيك إلى ثلاثة أنواع رئيسية حسب كيفية عرضه وتفاعل المتعلم معه:',
      items: [
        { title: 'الإنفوجرافيك الثابت (Static)', desc: 'تصميم في صورة واحدة لا تتغير. ممتاز للمطبوعات، التلخيصات، والمقالات. يتيح للمتعلم قراءة المعلومات وتحليلها بسرعته الخاصة دون تشتيت.', icon: <ImageIcon className="w-6 h-6 text-cyan-300" /> },
        { title: 'الإنفوجرافيك المتحرك (فيديو / موشن جرافيك)', desc: 'يدمج بين الرسوم، الحركة، والمؤثرات الصوتية. مثالي لشرح العمليات التي تحتاج إلى تسلسل زمني ومؤثرات لجذب الانتباه (مثل شرح الظواهر الطبيعية).', icon: <Video className="w-6 h-6 text-purple-300" /> },
        { title: 'الإنفوجرافيك التفاعلي (Interactive)', desc: 'يسمح للمتعلم بالتحكم في العرض (الضغط على أزرار، فتح نوافذ، تكبير أجزاء). يطبق مبدأ "التعلم النشط" ويجعل الطالب مستكشفاً للمعلومة.', icon: <MousePointerClick className="w-6 h-6 text-pink-300" /> }
      ]
    },
    {
      type: 'detailed-list',
      title: 'تصنيف الإنفوجرافيك (طبقاً للشكل)',
      icon: <PieChart className="w-12 h-12 text-green-400 mb-4" />,
      description: 'يأخذ الإنفوجرافيك أشكالاً مختلفة تناسب نوع البيانات المراد تقديمها:',
      items: [
        { title: 'الجداول', desc: 'تُستخدم للمقارنات المباشرة وتصنيف المعلومات ليسهل تتبعها.', icon: <Table className="w-6 h-6 text-green-300" /> },
        { title: 'الرسوم التوضيحية', desc: 'لشرح أجزاء ومكونات شيء معين (مثل تشريح كائن حي أو أجزاء آلة).', icon: <PenTool className="w-6 h-6 text-yellow-300" /> },
        { title: 'المخططات البيانية', desc: 'لترجمة الأرقام والإحصائيات المعقدة إلى نسب مرئية سهلة الفهم.', icon: <BarChart className="w-6 h-6 text-orange-300" /> },
        { title: 'الخرائط', desc: 'لتوضيح التوزيعات المكانية والجغرافية لأي ظاهرة تعليمية.', icon: <Map className="w-6 h-6 text-blue-300" /> },
        { title: 'العلاقات', desc: 'الخرائط الذهنية التي توضح الروابط بين الأفكار الرئيسية والفرعية.', icon: <Network className="w-6 h-6 text-red-300" /> }
      ]
    },
    {
      type: 'quiz',
      title: 'سؤال استنتاجي 🧠',
      question: 'معلم تاريخ يريد أن يعرض لطلابه "نسب توزيع السكان في الإمبراطوريات القديمة" بطريقة بصرية سريعة الفهم. ما هو الشكل الأنسب لاستخدامه؟',
      options: [
        'الرسوم التوضيحية التشريحية',
        'المخططات البيانية والخرائط',
        'الإنفوجرافيك التفاعلي فقط'
      ],
      correctAnswer: 1,
      feedback: 'ممتاز! المخططات البيانية تبرز "النسب"، والخرائط تبرز "التوزيع المكاني"، وهما الأنسب لتحقيق هذا الهدف التعليمي.'
    },
    {
      type: 'theory',
      title: 'نظريات علم النفس في تصميم الإنفوجرافيك',
      icon: <BrainCircuit className="w-12 h-12 text-yellow-400 mb-4" />,
      content: 'تصميم الإنفوجرافيك يعتمد بشكل وثيق على نظريات التعلم وعلم النفس لضمان بقاء أثر التعلم:',
      items: [
        { title: 'الإقناع البصري والتأثير السلوكي', desc: 'يتم التعبير عن الرسالة بطريقة فعالة باستخدام الألوان الحقيقية التي تؤثر في نفس وسلوك المتلقي، حيث يعمل اللون المناسب على إعطاء انطباعات مرغوبة.' },
        { title: 'نظرية الارتباط الاشتراطي', desc: 'يجب أن يحدث ارتباط شرطي بين الصور والرسومات والمعلومات. هذا الارتباط يساعد على بقاء المعلومة في الذاكرة لفترة أطول وسهولة استدعائها لاحقاً.' },
        { title: 'منحنى التعلم (هيرمان إيبنجهاوس)', desc: 'يتوافق الإنفوجرافيك مع نظرية منحنى التعلم لإيبنجهاوس، حيث تعمل تقوية الروابط بين الصور والبيانات على زيادة منحنى الاستدعاء المستقبلي للمعلومات وتقليل النسيان.' }
      ]
    },
    {
      type: 'ratios',
      title: 'قواعد ومعايير النسب في التصميم',
      content: 'لتحقيق تصميم أكاديمي متزن، أشار الخبراء إلى ضرورة الالتزام بنسب محددة لتوزيع الألوان والعناصر كالتالي:',
      ratios1: {
        title: 'قاعدة تقسيم الألوان (الإقناع البصري)',
        data: [
          { label: 'للموضوعات الرئيسية', percent: 60, color: 'bg-indigo-500' },
          { label: 'للموضوعات الفرعية', percent: 30, color: 'bg-purple-400' },
          { label: 'للشروحات والتوضيحات', percent: 10, color: 'bg-pink-400' }
        ]
      },
      ratios2: {
        title: 'قاعدة توزيع عناصر التصميم',
        data: [
          { label: 'الصور', percent: 60, color: 'bg-cyan-500' },
          { label: 'الرموز والأسهم', percent: 28, color: 'bg-blue-400' },
          { label: 'الكتابة والنصوص', percent: 12, color: 'bg-teal-400' }
        ]
      }
    },
    {
      type: 'quiz',
      title: 'سؤال امتحاني هام 🎯',
      question: 'حسب المعايير الدقيقة لتصميم الإنفوجرافيك، كم يجب أن تبلغ نسبة "الكتابة والنصوص" داخل التصميم الكلي لتجنب إرهاق المتعلم؟',
      options: ['30%', '12%', '28%', '60%'],
      correctAnswer: 1,
      feedback: 'رائع ومركز! الكتابة يجب أن تكون مختصرة جداً وتمثل 12% فقط، بينما تستحوذ الصور على 60% والرموز على 28%.'
    },
    {
      type: 'steps',
      title: 'خطوات تصميم الإنفوجرافيك التعليمي',
      icon: <PenTool className="w-12 h-12 text-pink-400 mb-4" />,
      steps: [
        { title: 'اختيار الفكرة أو الموضوع', desc: 'تحديد الغرض الذي سيصمم على أساسه (وحدة دراسية كاملة، درس، أو جزء من درس يتم التركيز عليه).' },
        { title: 'البحث عن الفكرة', desc: 'الاستعانة بمعلومات وافرة من مرجع معين أو البحث عنها بعمق عبر شبكة الإنترنت.' },
        { title: 'رسم كروكي (رسم القصة)', desc: 'عمل التخطيط المبدئي يدوياً بالورق والاستعانة ببعض الألوان لتخيل ترتيب العناصر.' },
        { title: 'اختيار التصميم الأمثل', desc: 'تنفيذ الشكل الورقي باستخدام برامج الرسم الاحترافية أو المواقع الجاهزة عبر الإنترنت.' }
      ]
    },
    {
      type: 'criteria',
      title: 'شروط ومعايير التصميم الجيد',
      icon: <CheckSquare className="w-12 h-12 text-teal-400 mb-4" />,
      content: 'يجب أن تخضع عملية التصميم لعدة شروط لضمان جودتها التعليمية:',
      list: [
        'الموضوع: التركيز على موضوع واحد وعمل تحليل دقيق للمضمون والتأكد من صحة المعلومات.',
        'العنوان: اختيار عنوان مميز وجذاب لموضوع الإنفوجرافيك.',
        'البساطة والوضوح: دمج الصور والنصوص ببساطة، الميل إلى عدم التعقيد، والابتعاد عن الجمل الطويلة.',
        'التوثيق: القيام بتوثيق مصادر المعلومات المدرجة.',
        'التصميم المنظم: مراعاة تسلسل المعلومات وتتابعها، واستخدام علامات الترقيم والتنقيط.',
        'الألوان: انتقاء ألوان جذابة تتناسب مع الفكرة وتبرز العلاقات بين المعلومات بطريقة جذابة.'
      ]
    },
    {
      type: 'grid',
      title: 'مزايا الإنفوجرافيك في العملية التعليمية',
      icon: <Sparkles className="w-12 h-12 text-indigo-400 mb-4" />,
      items: [
        { title: 'الاختصار والتلخيص', desc: 'يختزل الكثير من الكتابات في شكل بسيط يعقد المعلومات بشكل أقل ويضغط الواقع لتسهيل الفهم.' },
        { title: 'قليل التكلفة', desc: 'يتميز بانخفاض تكاليفه مقارنة بإنتاج الفيديو التعليمي أو الوسائل الأخرى.' },
        { title: 'سهولة الإنتاج', desc: 'لا يحتاج لبرامج معقدة دائماً، لوجود العديد من البرامج مفتوحة المصدر (Open Sources) والمواقع المجانية.' },
        { title: 'سرعة الانتشار', desc: 'أوسع انتشاراً عبر المطبوعات العلمية وشبكات التواصل من أي أداة تعليمية أخرى.' },
        { title: 'إيصال الفكرة', desc: 'يساعد على توصيل الفكرة بشكل أسرع وفي وقت أقل بطريقة مبسطة وسهلة.' },
        { title: 'دور الألوان', desc: 'الألوان تثير اهتمام المتلقي، تركز انتباهه للمقارنات، وتجذب الانتباه المنظم لتحقيق الأهداف.' },
        { title: 'البساطة والاسترجاع', desc: 'تقديم المعلومة ببساطة يجعلها أدوم في الذاكرة ويسهل عملية تذكرها واسترجاعها عند الحاجة.' },
        { title: 'إثارة الدافعية', desc: 'يجعل عملية التعليم أكثر تشويقاً، ويثير دافعية المتعلم نحو المادة العلمية.' },
        { title: 'الابتكار', desc: 'يولد لدى المتعلم القدرة على توليد أفكار جديدة وعلاقات مختلفة بين المحتوى.' }
      ]
    },
    {
      type: 'tools',
      title: 'البرامج والمواقع المستخدمة لإنشاء الإنفوجرافيك',
      icon: <Globe className="w-12 h-12 text-teal-400 mb-4" />,
      content: 'تتعدد الأدوات المتاحة للمصممين والمعلمين بين برمجيات احترافية ومنصات ويب تقدم قوالب جاهزة:',
      software: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe After Effects', 'Adobe Animate', 'Motion', 'Inscape', 'Tableau'],
      websites: ['piktochart.com', 'canva.com', 'easel.ly', 'visual.ly', 'infogr.am', 'powtoon.com', 'goanimate.com']
    },
    {
      type: 'quiz',
      title: 'تحدي الذاكرة النهائي 🏆',
      question: 'وفقاً للنظريات المذكورة، أي من العلماء ارتبط اسمه بـ "منحنى التعلم" الذي يفسر كيف يقلل الإنفوجرافيك من نسبة النسيان بمرور الوقت؟',
      options: [
        'العالم بياجيه',
        'هيرمان إيبنجهاوس',
        'جون ديوي'
      ],
      correctAnswer: 1,
      feedback: 'إجابة ممتازة! "هيرمان إيبنجهاوس" هو صاحب نظرية منحنى التعلم وتقوية روابط الاستدعاء في الذاكرة.'
    },
    {
      type: 'completion',
      title: 'تهانينا! أتممت الفصل بنجاح 🎉',
      content: 'لقد تعمقت الآن في فهم الإنفوجرافيك التعليمي، تصنيفاته الدقيقة، نظرياته النفسية المتقدمة، خطواته العملية، وأهم أدواته.',
    }
  ];

  // Logic Handlers
  const handleAnswer = (index) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === lessonData[currentSlide].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < lessonData.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      console.log("Exit Triggered");
      // يمكن ربطها بدالة onExit الخاصة بالمنصة هنا
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const slide = lessonData[currentSlide];
  const progress = ((currentSlide + 1) / lessonData.length) * 100;
  const totalQuizzes = lessonData.filter(s => s.type === 'quiz').length;

  return (
    <div className="w-full min-h-screen bg-[#060b14] text-white flex items-center justify-center p-4 sm:p-8 font-sans overflow-hidden" dir="rtl">
      
      {/* تأثيرات الإضاءة في الخلفية */}
      <div className="fixed top-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-700/10 blur-[160px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-700/10 blur-[160px] pointer-events-none"></div>

      {/* الحاوية الرئيسية الزجاجية */}
      <div className="relative z-10 w-full max-w-6xl bg-[#0f172a]/70 backdrop-blur-3xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)] rounded-[2rem] p-6 sm:p-10 flex flex-col min-h-[85vh] transition-all duration-500">
        
        {/* شريط التقدم وزر الخروج */}
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <button onClick={() => console.log('Exit')} className="flex items-center gap-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 px-5 py-2.5 rounded-xl text-sm font-bold border border-transparent hover:border-red-500/30 transition-all">
            <LogOut className="w-4 h-4" /> خروج من الدرس
          </button>
          
          <div className="flex-1 mr-8 ml-4">
            <div className="h-2.5 w-full bg-[#1e293b] rounded-full overflow-hidden shadow-inner relative">
              <div 
                className="h-full bg-gradient-to-l from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              >
                 <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/10 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-white/40 text-xs mt-3 font-medium tracking-wide">
              <span>الفصل الثالث: الإنفوجرافيك في التعليم</span>
              <span>شريحة {currentSlide + 1} من {lessonData.length}</span>
            </div>
          </div>
        </div>

        {/* مساحة عرض المحتوى المتغيرة */}
        <div className="flex-1 flex flex-col justify-center items-center w-full animate-fade-in-up" key={currentSlide}>
          
          {/* شريحة المقدمة */}
          {slide.type === 'intro' && (
            <div className="text-center flex flex-col items-center max-w-4xl">
              {slide.icon}
              <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-l from-cyan-300 to-indigo-400 mb-6 leading-tight">
                {slide.title}
              </h1>
              <div className="bg-gradient-to-r from-transparent via-white/10 to-transparent px-10 py-3 mb-8">
                <h2 className="text-2xl text-cyan-200 font-bold">{slide.subtitle}</h2>
              </div>
              <p className="text-2xl text-white/80 leading-relaxed bg-[#0f172a] p-8 rounded-3xl border border-white/5 shadow-inner">
                {slide.content}
              </p>
            </div>
          )}

          {/* شريحة المكونات الأساسية */}
          {slide.type === 'cards' && (
            <div className="w-full flex flex-col items-center">
              {slide.icon}
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{slide.title}</h2>
              <p className="text-lg text-white/60 mb-10">{slide.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {slide.items.map((card, idx) => (
                  <div key={idx} className="bg-[#1e293b]/50 border border-white/10 p-8 rounded-3xl hover:bg-[#1e293b] hover:border-cyan-400/50 hover:-translate-y-2 transition-all group flex flex-col items-center text-center">
                    <div className="p-4 bg-white/5 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                      {card.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                    <p className="text-white/70 leading-relaxed text-sm md:text-base">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* شريحة التصنيفات (قوائم مفصلة) */}
          {slide.type === 'detailed-list' && (
            <div className="w-full flex flex-col items-center max-w-5xl">
              {slide.icon}
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">{slide.title}</h2>
              <p className="text-lg text-cyan-200 mb-8 text-center">{slide.description}</p>
              
              <div className="flex flex-col gap-4 w-full">
                {slide.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-4 bg-[#1e293b]/40 border border-white/5 p-6 rounded-2xl items-start sm:items-center hover:bg-[#1e293b]/80 hover:border-white/20 transition-all">
                    <div className="p-3 bg-white/5 rounded-xl shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* شريحة النظريات */}
          {slide.type === 'theory' && (
            <div className="w-full flex flex-col items-center max-w-4xl">
              {slide.icon}
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{slide.title}</h2>
              <p className="text-xl text-yellow-200 mb-10 text-center bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">{slide.content}</p>
              
              <div className="flex flex-col gap-6 w-full">
                {slide.items.map((item, idx) => (
                  <div key={idx} className="relative bg-[#1e293b]/50 p-8 rounded-2xl border border-white/10 hover:border-yellow-400/50 transition-all overflow-hidden group">
                    <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-yellow-400 to-orange-500"></div>
                    <h3 className="text-2xl font-bold text-yellow-300 mb-3">{item.title}</h3>
                    <p className="text-white/80 text-lg leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* شريحة النسب (أشرطة تقدم بصرية) */}
          {slide.type === 'ratios' && (
            <div className="w-full flex flex-col items-center max-w-5xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{slide.title}</h2>
              <p className="text-xl text-cyan-200 mb-10 text-center">{slide.content}</p>
              
              <div className="flex flex-col md:flex-row gap-10 w-full">
                {/* النسب الأولى */}
                <div className="flex-1 bg-white/5 border border-white/10 p-8 rounded-3xl">
                  <h3 className="text-xl font-bold text-white mb-6 text-center">{slide.ratios1.title}</h3>
                  <div className="w-full h-8 rounded-full overflow-hidden flex mb-6 shadow-inner border border-white/5">
                    {slide.ratios1.data.map((d, i) => (
                      <div key={i} style={{width: `${d.percent}%`}} className={`h-full ${d.color} flex items-center justify-center text-xs font-bold text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]`}>
                        {d.percent}%
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {slide.ratios1.data.map((d, i) => (
                      <div key={i} className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${d.color}`}></div>
                          <span className="text-white/80">{d.label}</span>
                        </div>
                        <span className="font-bold text-white">{d.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* النسب الثانية */}
                <div className="flex-1 bg-white/5 border border-white/10 p-8 rounded-3xl">
                  <h3 className="text-xl font-bold text-white mb-6 text-center">{slide.ratios2.title}</h3>
                  <div className="w-full h-8 rounded-full overflow-hidden flex mb-6 shadow-inner border border-white/5">
                    {slide.ratios2.data.map((d, i) => (
                      <div key={i} style={{width: `${d.percent}%`}} className={`h-full ${d.color} flex items-center justify-center text-xs font-bold text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]`}>
                        {d.percent}%
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {slide.ratios2.data.map((d, i) => (
                      <div key={i} className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${d.color}`}></div>
                          <span className="text-white/80">{d.label}</span>
                        </div>
                        <span className="font-bold text-white">{d.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* شريحة الخطوات */}
          {slide.type === 'steps' && (
            <div className="w-full flex flex-col items-center max-w-5xl">
              {slide.icon}
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">{slide.title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full relative">
                <div className="hidden md:block absolute top-8 left-10 right-10 h-1 bg-gradient-to-r from-pink-500/20 via-purple-500/50 to-pink-500/20 -z-10"></div>
                
                {slide.steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center relative group">
                    <div className="w-16 h-16 rounded-full bg-[#0f172a] flex items-center justify-center text-2xl font-black text-pink-400 border-4 border-pink-500/50 z-10 mb-6 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                      {idx + 1}
                    </div>
                    <div className="bg-[#1e293b]/60 border border-white/5 p-6 rounded-2xl text-center w-full h-full hover:border-pink-500/40 hover:bg-[#1e293b] transition-all">
                      <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* شريحة المعايير والمميزات */}
          {(slide.type === 'grid' || slide.type === 'criteria') && (
            <div className="w-full flex flex-col items-center max-w-5xl">
              {slide.icon}
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10">{slide.title}</h2>
              {slide.content && <p className="text-xl text-teal-200 mb-8 text-center">{slide.content}</p>}
              
              <div className={`grid grid-cols-1 ${slide.type === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 gap-5' : 'gap-4'} w-full`}>
                {slide.items ? slide.items.map((item, idx) => (
                  <div key={idx} className="bg-[#1e293b]/40 border border-indigo-500/10 p-6 rounded-2xl hover:bg-[#1e293b] hover:border-indigo-400/50 transition-all flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="w-6 h-6 text-indigo-400 shrink-0" />
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                )) : slide.list.map((item, idx) => {
                  const [title, desc] = item.split(':');
                  return (
                    <div key={idx} className="flex items-start gap-4 bg-[#1e293b]/40 border border-white/5 p-4 rounded-xl">
                      <CheckCircle2 className="w-6 h-6 text-teal-400 shrink-0 mt-1" />
                      <div>
                        <span className="font-bold text-teal-300 text-lg">{title}: </span>
                        <span className="text-white/80 text-lg">{desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* شريحة البرامج والأدوات */}
          {slide.type === 'tools' && (
            <div className="w-full flex flex-col items-center max-w-5xl">
              {slide.icon}
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{slide.title}</h2>
              <p className="text-lg text-teal-200 mb-10 text-center">{slide.content}</p>
              
              <div className="flex flex-col md:flex-row gap-8 w-full">
                <div className="flex-1 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] border border-indigo-500/30 p-8 rounded-3xl relative overflow-hidden group">
                  <div className="absolute -bottom-10 -right-10 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700"><MonitorPlay className="w-48 h-48" /></div>
                  <h3 className="text-2xl font-bold text-indigo-300 mb-6 relative z-10 flex items-center gap-2">
                    <PenTool className="w-6 h-6" /> برمجيات احترافية
                  </h3>
                  <div className="flex flex-wrap gap-3 relative z-10">
                    {slide.software.map((sw, i) => (
                      <span key={i} className="px-4 py-2 bg-[#0f172a]/80 text-indigo-100 rounded-lg border border-indigo-500/30 text-sm font-semibold hover:bg-indigo-500 hover:text-white transition-colors cursor-default">{sw}</span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 bg-gradient-to-br from-[#0f172a] to-[#064e3b] border border-teal-500/30 p-8 rounded-3xl relative overflow-hidden group">
                  <div className="absolute -bottom-10 -left-10 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700"><Globe className="w-48 h-48" /></div>
                  <h3 className="text-2xl font-bold text-teal-300 mb-6 relative z-10 flex items-center gap-2">
                    <Globe className="w-6 h-6" /> منصات سحابية (مواقع)
                  </h3>
                  <div className="flex flex-wrap gap-3 relative z-10">
                    {slide.websites.map((web, i) => (
                      <span key={i} className="px-4 py-2 bg-[#0f172a]/80 text-teal-100 rounded-lg border border-teal-500/30 text-sm font-semibold hover:bg-teal-500 hover:text-white transition-colors cursor-default">{web}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* شريحة الأسئلة التفاعلية */}
          {slide.type === 'quiz' && (
            <div className="flex flex-col items-center w-full max-w-3xl">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-sm font-bold mb-8 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                <Lightbulb className="w-5 h-5 animate-pulse" /> {slide.title}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 leading-relaxed text-center">
                {slide.question}
              </h2>
              <div className="flex flex-col gap-4 w-full">
                {slide.options.map((option, idx) => {
                  let btnStateClass = "bg-[#1e293b]/60 border-white/10 text-white/80 hover:bg-[#1e293b] hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]";
                  let icon = <div className="w-6 h-6 rounded-full border border-white/20 flex-shrink-0"></div>;

                  if (isAnswered) {
                    if (idx === slide.correctAnswer) {
                      btnStateClass = "bg-green-500/20 border-green-500/50 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] scale-[1.02]";
                      icon = <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />;
                    } else if (idx === selectedAnswer) {
                      btnStateClass = "bg-red-500/20 border-red-500/50 text-red-300";
                      icon = <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />;
                    } else {
                      btnStateClass = "bg-[#1e293b]/30 border-white/5 text-white/30 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={isAnswered}
                      className={`relative w-full text-right p-6 rounded-2xl border transition-all duration-300 flex justify-between items-center text-lg ${btnStateClass}`}
                    >
                      <span className="pl-4 font-medium leading-relaxed">{option}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-transparent border-r-4 border-cyan-500 text-cyan-100 text-lg font-medium animate-fade-in w-full">
                  {slide.feedback}
                </div>
              )}
            </div>
          )}

          {/* شريحة النهاية والنتيجة */}
          {slide.type === 'completion' && (
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-[60px] animate-pulse"></div>
                <GraduationCap className="w-32 h-32 text-indigo-400 relative z-10 drop-shadow-[0_0_30px_rgba(99,102,241,0.6)]" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-wide">{slide.title}</h1>
              <p className="text-xl text-white/70 mb-12 max-w-lg leading-relaxed">{slide.content}</p>
              
              <div className="bg-[#1e293b]/80 border border-indigo-500/30 px-20 py-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-l from-cyan-400 via-indigo-500 to-purple-500"></div>
                <p className="text-white/60 mb-6 text-xl font-medium">نتيجة الاختبارات التفاعلية</p>
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 flex items-center justify-center gap-4">
                  {score} <span className="text-3xl text-white/30 font-medium">من</span> {totalQuizzes}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* أزرار التنقل السفلية */}
        <div className="mt-12 flex justify-between items-center pt-6 border-t border-white/10">
          <button 
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 ${
              currentSlide === 0 
              ? 'opacity-0 pointer-events-none' 
              : 'text-white/70 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <ChevronRight className="w-5 h-5" /> الشريحة السابقة
          </button>

          <button 
            onClick={handleNext}
            disabled={slide.type === 'quiz' && !isAnswered}
            className={`flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              slide.type === 'quiz' && !isAnswered
              ? 'bg-[#1e293b]/50 text-white/30 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-l from-cyan-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-[1.02] border border-indigo-400/50'
            }`}
          >
            {currentSlide === lessonData.length - 1 ? 'إنهاء الدرس التفاعلي' : 'التالي'} 
            {currentSlide !== lessonData.length - 1 && <ChevronLeft className="w-6 h-6" />}
          </button>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
}