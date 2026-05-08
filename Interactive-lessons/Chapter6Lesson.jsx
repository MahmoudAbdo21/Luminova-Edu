import React, { useState, useEffect } from 'react';
import {
    CheckCircle2, XCircle, ChevronRight, ChevronLeft,
    LogOut, Layers, BarChart, Eye, Target,
    BookOpen, Network, Map, Sparkles, Lightbulb,
    BrainCircuit, Award, MousePointerClick, Table, PenTool, Layout
} from 'lucide-react';

export default function App() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // استخراج المحتوى الخاص بالفصل السادس فقط بناءً على الصور المرفقة
    const lessonData = [
        {
            type: 'intro',
            title: 'الفصل السادس: الفروق بين الانفوجرافيك والمفاهيم الأخرى',
            subtitle: 'التمييز بين أدوات العرض المرئي',
            content: 'يتداخل مفهوم الانفوجرافيك مع العديد من المفاهيم الأخرى، وذلك نظراً لطبيعته التي تجمع بين التصميم والبيانات والتواصل البصري. في هذا الفصل، سنسلط الضوء على أوجه التشابه والاختلاف بين الانفوجرافيك وأهم المجالات المرتبطة به، لنتمكن من توظيف كل أداة في مكانها الصحيح.',
            icon: <Layers className="w-24 h-24 text-blue-400 mb-6 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)]" />
        },
        {
            type: 'grid-horizontal',
            title: 'أولاً: المفاهيم المتداخلة مع الانفوجرافيك (1)',
            icon: <Network className="w-12 h-12 text-indigo-400 mb-4" />,
            description: 'نستعرض هنا العلاقة بين الانفوجرافيك ومجالي التصميم الجرافيكي وعلم البيانات:',
            sections: [
                {
                    title: '1. التصميم الجرافيكي (Graphic Design)',
                    color: 'text-indigo-300',
                    items: [
                        { t: 'الأساس المشترك:', d: 'يعتبر التصميم الجرافيكي هو الأساس الذي يبنى عليه الانفوجرافيك، حيث يتم استخدام العناصر التصميمية المختلفة مثل الألوان والخطوط والأشكال لتنظيم المعلومات وتقديمها بشكل جذاب.' },
                        { t: 'الاختلاف:', d: 'يركز الانفوجرافيك بشكل أكبر على إيصال المعلومات (Information)، بينما التصميم الجرافيكي قد يشمل جوانب جمالية وإبداعية أوسع لا تقتصر على عرض البيانات.' }
                    ]
                },
                {
                    title: '2. علم البيانات (Data Science)',
                    color: 'text-emerald-300',
                    items: [
                        { t: 'الربط:', d: 'يعتمد الانفوجرافيك على البيانات لتحويلها إلى صور مرئية، لذلك فإنه مرتبط بشكل وثيق بعلم البيانات الذي يزوده بالمادة الخام.' },
                        { t: 'الاختلاف:', d: 'يركز علم البيانات على تحليل البيانات المعقدة واستخراج المعرفة منها رياضياً وإحصائياً، بينما يهتم الانفوجرافيك بتقديم هذه النتائج للجمهور بشكل مبسط ومرئي.' }
                    ]
                }
            ]
        },
        {
            type: 'grid-horizontal',
            title: 'المفاهيم المتداخلة مع الانفوجرافيك (2)',
            icon: <Eye className="w-12 h-12 text-cyan-400 mb-4" />,
            description: 'نستكمل العلاقة مع مجالات التواصل البصري، التسويق، والتعلم:',
            sections: [
                {
                    title: '3. التواصل البصري (Visual Communication)',
                    color: 'text-cyan-300',
                    items: [
                        { t: 'التكامل:', d: 'يعتبر الانفوجرافيك شكلاً تطبيقياً من أشكال التواصل البصري، حيث يتم استخدام الصور والأيقونات لنقل الأفكار والمعاني.' },
                        { t: 'الهدف:', d: 'يهدف كلاهما إلى إيصال الرسالة بشكل فعال، ولكن الانفوجرافيك يركز بشكل محدد على عرض (البيانات والمعلومات) الإحصائية أو العلمية.' }
                    ]
                },
                {
                    title: '4. التسويق الرقمي (Digital Marketing)',
                    color: 'text-amber-300',
                    items: [
                        { t: 'التطبيق:', d: 'يُستخدم الانفوجرافيك بشكل واسع جداً في التسويق الرقمي لجذب الانتباه وتبسيط المعلومات المعقدة للعملاء حول المنتجات.' },
                        { t: 'الهدف:', d: 'يهدف كلاهما إلى تحقيق أهداف تسويقية معينة، مثل زيادة الوعي بالعلامة التجارية، جذب الزوار للموقع، أو تحفيز المبيعات.' }
                    ]
                }
            ]
        },
        {
            type: 'cards-3',
            title: 'المفاهيم المتداخلة مع الانفوجرافيك (3)',
            icon: <BookOpen className="w-12 h-12 text-rose-400 mb-4" />,
            description: 'وأخيراً، علاقته بتحليل البيانات، التعلم، والتحريك:',
            items: [
                { title: '5. التعلم البصري (Visual Learning)', desc: 'الأثر: يستفيد الانفوجرافيك من قدرة الدماغ البشري على معالجة المعلومات المرئية بشكل أسرع وأكثر فعالية من النصوص. الهدف: يساهم بقوة في تسهيل عملية التعلم وتسريع الفهم وتذكر المعلومات التعليمية.' },
                { title: '6. تحليل البيانات (Data Visualization)', desc: 'الهدف المشترك: يهدف كلاهما إلى تحويل البيانات المعقدة إلى صور مرئية لتسهيل فهمها للجمهور. الاختلاف: يركز تحليل البيانات على استخدام الأدوات الإحصائية لتمثيل البيانات بدقة، بينما يركز الانفوجرافيك على تقديم هذه النتائج بشكل جمالي جذاب وقصصي.' },
                { title: '7. الرسوم المتحركة (Animation)', desc: 'التكامل: يمكن دمج الرسوم المتحركة مع الانفوجرافيك لإنشاء محتوى أكثر حيوية وتفاعلية، وهو ما يعرف بـ (الموشن جرافيك - Motion Graphics). الهدف: يهدف كلاهما إلى جذب الانتباه بقوة وإضفاء الحيوية على المحتوى المعروض.' }
            ]
        },
        {
            type: 'quiz',
            title: 'اختبار الفهم 💡',
            question: 'إذا كان لدينا باحث يقوم بجمع ملايين البيانات الرقمية المعقدة ويستخدم خوارزميات إحصائية رياضية لاستخراج علاقات خفية بينها. في أي مجال يعمل هذا الباحث بناءً على الفروق المذكورة؟',
            options: [
                'التصميم الجرافيكي (Graphic Design)',
                'علم البيانات (Data Science)',
                'التسويق الرقمي (Digital Marketing)'
            ],
            correctAnswer: 1,
            feedback: 'إجابة صحيحة! التركيز على "تحليل البيانات الإحصائية المعقدة واستخراج المعرفة منها" هو صميم عمل (علم البيانات)، والذي يوفر المادة التي قد يحولها مصمم الانفوجرافيك لاحقاً إلى صور.'
        },
        {
            type: 'cards-2',
            title: 'ثانياً: الفرق بين الانفوجرافيك والخرائط الذهنية والمفاهيمية',
            icon: <Map className="w-12 h-12 text-fuchsia-400 mb-4" />,
            description: 'تعتبر هذه الأدوات الثلاث من أهم وسائط التمثيل المرئي، ولكن تختلف في بنائها وهدفها:',
            items: [
                { title: 'الإنفوجرافيك (Infographic)', desc: 'يعرض تصويراً عاماً لموضوع أو فكرة من خلال (تصوير قصصي أو رواية تصورية) لمجموعة من الأفكار، والبيانات. يتميز بعرض المعلومات المعقدة بطريقة سلسة وسهلة للقارئ من خلال المثيرات البصرية.' },
                { title: 'الخرائط المفاهيمية والذهنية', desc: 'تستخدم الخرائط الذهنية لإظهار العلاقات بين الأفكار والموضوعات وفروعها (بشكل غير خطي/إبداعي). أما الخرائط المفاهيمية فتكون ذات تنظيم متسلسل هرمي ومتتابع (من العام للخاص) لإظهار مدى ارتباط تلك الأفكار مع بعضها البعض عبر أسهم وكلمات ربط.' }
            ]
        },
        {
            type: 'comparison-table',
            title: 'جدول مقارنة شامل: نقاط الاختلاف الثلاثة',
            icon: <Table className="w-12 h-12 text-orange-400 mb-4" />,
            headers: ['أوجه المقارنة', 'الخرائط المفاهيمية (Concept Map)', 'الخرائط الذهنية (Mind Map)', 'الإنفوجرافيك (Infographic)'],
            rows: [
                ['صاحب الفكرة', 'جوزيف نوفاك (Joseph Novak)', 'توني بوزان (Tony Buzan)', 'كريستوف شاينر (Christoph Scheiner)'],
                ['التعريف', 'رسم على شكل مخطط انسيابي من أعلى إلى أسفل لإظهار العلاقات بين المفهوم والفروع، من خلال أسهم توضح العلاقة فيما بينها.', 'هي تصور عقلي لموضوع متمركز في الوسط يتم فيه ربط الموضوعات أو الأفكار الفرعية باستخدام الخطوط والرموز والصور لإعادة تنظيم المعرفة بطريقة إبداعية.', 'فن تحويل المعلومات والأفكار المعقدة إلى صور ورسوم يمكن فهمها واستيعابها بوضوح وتشويق، وعرضها بطريقة سلسة وسهلة من خلال المثيرات البصرية (قصصية أو روائية).'],
                ['الوظيفة', 'العرض التفصيلي للأفكار أو الموضوعات الفرعية وعلاقتها بالموضوع الرئيسي بطريقة منظمة هرمية.', 'عرض الأفكار أو الموضوعات الفرعية من خلال تسلسل إبداعي وسلس لمجال معين (توليد الأفكار).', 'إظهار العلاقة بطريقة قصة مترابطة، وإبراز الحقائق والموضوعات المعقدة بصورة مبسطة.'],
                ['الاستفادة منها', 'عرض التفاصيل الدقيقة لفكرة معينة للمتعلمين. / عرض فكرة موضوعية بطريقة متتابعة منطقية.', 'رسم تصور شخصي لموضوع معين من قبل المتعلمين. / تدوين الملاحظات وتلخيص الأفكار بطرق إبداعية.', 'توصيل المفاهيم أثناء التعلم الذاتي. / تثبيت المفاهيم أثناء مراجعتها من قبل المتعلمين.'],
                ['وقت الاستخدام', 'عرض التفاصيل الدقيقة والهامة بطريقة شيقة (غالباً بعد الانتهاء من دراسة الموضوع لترتيبه).', 'يستخدمها المتعلمون والمعلمون لتدوين الملاحظات وتنظيم علاقة الأفكار الفرعية ببعضها (أثناء العصف الذهني).', 'استخدام أداة دعم للتعليم، عند تلخيص فكرة أو موضوع رئيسي وإبراز الأفكار فيه بصورة نهائية جذابة.']
            ]
        },
        {
            type: 'quiz',
            title: 'تحدي التفريق 🎯',
            question: 'معلم طلب من تلاميذه استخدام أداة تساعدهم على "توليد أفكار جديدة بحرية، وتدوين الملاحظات أثناء جلسة العصف الذهني بشكل غير خطي". أي أداة تناسب هذا الموقف حسب الجدول السابق؟',
            options: [
                'الخرائط المفاهيمية (Concept Maps)',
                'الإنفوجرافيك التسويقي',
                'الخرائط الذهنية (Mind Maps)'
            ],
            correctAnswer: 2,
            feedback: 'أحسنت! الخرائط الذهنية (صاحبها توني بوزان) هي الأداة الإبداعية الغير خطية المثالية لجلسات العصف الذهني وتوليد الأفكار بحرية.'
        },
        {
            type: 'detailed-list',
            title: 'كيفية تصميم الخرائط (الذهنية والمفاهيمية)',
            icon: <PenTool className="w-12 h-12 text-teal-400 mb-4" />,
            description: 'بالرغم من اختلافهما، إلا أن لكل منهما أدوات وخطوات تصميم محددة تعتمد على طبيعة كل خريطة:',
            items: [
                { title: '1. إنشاء الخرائط الذهنية', desc: 'تعتمد على المركزية والإبداع. الخطوات: تحديد الفكرة المركزية (في المنتصف) -> كتابة الكلمات المفتاحية والأفكار المرتبطة بها -> ربط الكلمات بالمركز باستخدام خطوط وتفرعات منحنية -> استخدام الصور والألوان لجعل الخريطة أكثر جاذبية وسهولة في الفهم -> التصنيف إلى فئات فرعية.', icon: <BrainCircuit className="w-6 h-6 text-teal-300" /> },
                { title: 'أمثلة لأدوات الخرائط الذهنية', desc: 'برامج ومواقع متخصصة مثل: MindMeister, Coggle, XMind, Miro.', icon: <Layout className="w-6 h-6 text-teal-300" /> },
                { title: '2. إنشاء الخرائط المفاهيمية', desc: 'تعتمد على الهرمية والمنطق. الخطوات: تحديد المفاهيم الرئيسية التي تريد ربطها -> إنشاء إطارات (مربعات/دوائر) للمفاهيم -> ربط الإطارات بخطوط وأسهم (من الأعلى للأسفل) -> (خطوة هامة جداً): إضافة علامات وكلمات توضح العلاقة بين المفاهيم على الأسهم (مثل: "هو"، "يسبب"، "يؤدي إلى") -> إضافة تعريفات مختصرة.', icon: <Network className="w-6 h-6 text-emerald-300" /> },
                { title: 'أمثلة لأدوات الخرائط المفاهيمية', desc: 'برامج ومواقع متخصصة مثل: Coggle, MindMeister, Miro, Creately.', icon: <Layout className="w-6 h-6 text-emerald-300" /> }
            ]
        },
        {
            type: 'cards-2',
            title: 'مثال تطبيقي: التفريق بين الأدوات في نفس الموضوع',
            icon: <Target className="w-12 h-12 text-pink-400 mb-4" />,
            description: 'لنفترض أنك تريد شرح مفهوم "التسويق الرقمي". هكذا سيختلف شكل العرض باختلاف الأداة:',
            items: [
                { title: 'باستخدام الخريطة الذهنية / المفاهيمية', desc: 'الخريطة الذهنية: ستضع "التسويق الرقمي" في المركز، وتفرع منه خطوطاً متموجة للشبكات الاجتماعية، البريد، ومحركات البحث مع أيقونات ملونة. / الخريطة المفاهيمية: ستضع "التسويق الرقمي" بالأعلى، وتنزل بأسهم مكتوب عليها "ينقسم إلى"، وتضع تحته المكونات في مربعات منتظمة لإظهار العلاقة المنهجية.' },
                { title: 'باستخدام الإنفوجرافيك', desc: 'سيوضح "نسبة استخدام" مختلف قنوات التسويق الرقمي بالأرقام والمخططات البيانية (مثل: 70% شبكات اجتماعية، 30% بريد إلكتروني)، مع إضافة شخصيات كرتونية ومسار بصري يقود القارئ لنتيجة أو نصيحة تسويقية.' }
            ]
        },
        {
            type: 'quiz',
            title: 'السؤال الختامي 🏆',
            question: 'أراد طالب توضيح العلاقة الدقيقة بين "الماء" و"الأكسجين والهيدروجين". فرسم مربعاً به "الماء" ونزل منه بسهمين للمكونين، وكتب على الأسهم (يتكون من). أي أداة تمثيل بصري استخدم الطالب؟',
            options: [
                'خريطة مفاهيمية (Concept Map)',
                'خريطة ذهنية (Mind Map)',
                'موشن جرافيك (Motion Graphic)'
            ],
            correctAnswer: 0,
            feedback: 'إجابة ممتازة! البناء الهرمي مع وجود (كلمات ربط على الأسهم مثل "يتكون من") لتوضيح العلاقة العلمية هو أهم ما يميز الخرائط المفاهيمية.'
        },
        {
            type: 'completion',
            title: 'تهانينا! اكتمل الفصل السادس بنجاح 🎉',
            content: 'لقد أتممت دراسة الفصل السادس. أصبحت الآن قادراً على التفريق بدقة بين الانفوجرافيك والتصميم الجرافيكي، وعلم البيانات، وتعرفت على الفروق الجوهرية بين الخرائط الذهنية والمفاهيمية وخطوات تصميمها.',
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

    // حقن خط Cairo الأنيق لجمالية القراءة العربية
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    return (
        <div style={{ fontFamily: "'Cairo', sans-serif" }} className="w-full min-h-screen bg-[#070b19] text-slate-100 flex items-center justify-center p-4 md:p-8 overflow-hidden tracking-wide" dir="rtl">

            {/* خلفية ضبابية (Neon Glow) */}
            <div className="fixed top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-blue-900/10 blur-[180px] pointer-events-none animate-pulse"></div>
            <div className="fixed bottom-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-indigo-900/10 blur-[180px] pointer-events-none"></div>

            {/* الحاوية الرئيسية الواسعة للابتوب */}
            <div className="relative z-10 w-full max-w-[95%] xl:max-w-[85%] bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12 flex flex-col min-h-[75vh] max-h-[90vh] transition-all duration-500 overflow-y-auto custom-scrollbar">

                {/* شريط التحكم العلوي */}
                <div className="flex justify-between items-center mb-10 border-b border-slate-700/60 pb-6 shrink-0">
                    <button onClick={() => console.log('Exit')} className="flex items-center gap-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 px-5 py-2.5 rounded-xl text-lg font-bold border border-transparent hover:border-rose-500/30 transition-all">
                        <LogOut className="w-5 h-5" /> إنهاء الدرس
                    </button>

                    <div className="flex-1 mr-8 ml-4 max-w-4xl mx-auto">
                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner relative">
                            <div
                                className="h-full bg-gradient-to-l from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-slate-400 text-sm md:text-base mt-3 font-semibold">
                            <span>الفصل السادس: الفروق بين المفاهيم</span>
                            <span>شريحة {currentSlide + 1} من {lessonData.length}</span>
                        </div>
                    </div>
                </div>

                {/* مساحة عرض المحتوى */}
                <div className="flex-1 flex flex-col justify-center items-center w-full animate-fade-in-up" key={currentSlide}>

                    {/* 1. شريحة المقدمة */}
                    {slide.type === 'intro' && (
                        <div className="text-center flex flex-col items-center max-w-5xl">
                            {slide.icon}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-l from-cyan-300 to-blue-400 mb-8 leading-[1.3]">
                                {slide.title}
                            </h1>
                            <div className="bg-slate-800/50 px-12 py-3 mb-10 rounded-full border border-slate-600 shadow-lg">
                                <h2 className="text-2xl text-blue-200 font-bold">{slide.subtitle}</h2>
                            </div>
                            <p className="text-2xl text-slate-200 leading-[2] bg-slate-800/40 p-10 rounded-[2rem] border border-slate-700/50 shadow-inner">
                                {slide.content}
                            </p>
                        </div>
                    )}

                    {/* 2. شريحة الجريد الأفقي للمفاهيم (Grid Horizontal) */}
                    {slide.type === 'grid-horizontal' && (
                        <div className="w-full flex flex-col items-center max-w-full">
                            <div className="flex items-center gap-4 mb-8">
                                {slide.icon}
                                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">{slide.title}</h2>
                            </div>
                            <p className="text-xl text-slate-300 mb-10 text-center">{slide.description}</p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                                {slide.sections.map((sec, sIdx) => (
                                    <div key={sIdx} className="bg-slate-800/40 border border-slate-700/60 p-8 rounded-[2rem] shadow-xl flex flex-col hover:bg-slate-800/60 transition-colors">
                                        <h3 className={`text-2xl font-bold mb-6 border-b border-slate-700 pb-4 ${sec.color}`}>{sec.title}</h3>
                                        <div className="flex flex-col gap-6 flex-grow">
                                            {sec.items.map((item, iIdx) => (
                                                <div key={iIdx} className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/40">
                                                    <h4 className="text-xl font-bold text-white mb-3">{item.t}</h4>
                                                    <p className="text-slate-300 text-lg leading-[1.8] break-words">{item.d}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. شريحة الكروت (2 أو 3 أعمدة) */}
                    {(slide.type === 'cards-2' || slide.type === 'cards-3') && (
                        <div className="w-full flex flex-col items-center max-w-full">
                            <div className="flex items-center gap-4 mb-6">
                                {slide.icon}
                                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight text-center">{slide.title}</h2>
                            </div>
                            <p className="text-xl text-slate-300 mb-10 text-center max-w-4xl">{slide.description}</p>

                            <div className={`grid grid-cols-1 md:grid-cols-2 ${slide.type === 'cards-3' ? 'lg:grid-cols-3' : ''} gap-6 w-full`}>
                                {slide.items.map((item, idx) => (
                                    <div key={idx} className="bg-slate-800/40 border border-slate-700/60 p-8 rounded-[2rem] hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-lg group flex flex-col">
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-xl font-black text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors shrink-0">
                                                {idx + 1}
                                            </div>
                                            <h3 className="text-2xl font-bold text-white leading-tight">{item.title}</h3>
                                        </div>
                                        <p className="text-slate-300 text-lg leading-[1.9] break-words flex-grow">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. شريحة القوائم المفصلة (للخطوات) */}
                    {slide.type === 'detailed-list' && (
                        <div className="w-full flex flex-col items-center max-w-6xl">
                            <div className="flex items-center gap-4 mb-6">
                                {slide.icon}
                                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">{slide.title}</h2>
                            </div>
                            <p className="text-xl text-cyan-200 mb-8 text-center">{slide.description}</p>

                            <div className="flex flex-col gap-5 w-full">
                                {slide.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-5 bg-slate-800/50 border border-slate-700/50 p-6 rounded-3xl items-start sm:items-center hover:bg-slate-700/50 transition-all">
                                        <div className="p-4 bg-slate-800 rounded-2xl shrink-0 shadow-inner">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 5. شريحة جدول المقارنة (CSS Grid Table الواسع) */}
                    {slide.type === 'comparison-table' && (
                        <div className="w-full flex flex-col items-center max-w-full">
                            <div className="flex items-center gap-4 mb-10">
                                {slide.icon}
                                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">{slide.title}</h2>
                            </div>

                            <div className="w-full overflow-x-auto rounded-3xl border border-slate-700/50 shadow-2xl">
                                <div className="min-w-[1000px] grid grid-cols-4 bg-slate-800 text-lg font-bold text-center border-b-4 border-slate-600">
                                    {slide.headers.map((h, i) => (
                                        <div key={i} className={`p-6 ${i === 0 ? 'text-slate-200' : i === 1 ? 'text-rose-300' : i === 2 ? 'text-amber-300' : 'text-cyan-300'}`}>{h}</div>
                                    ))}
                                </div>
                                {slide.rows.map((row, rIdx) => (
                                    <div key={rIdx} className="min-w-[1000px] grid grid-cols-4 text-base bg-slate-800/30 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                        {row.map((cell, cIdx) => (
                                            <div key={cIdx} className={`p-6 leading-[1.9] border-l border-slate-700/30 last:border-0 ${cIdx === 0 ? 'font-bold text-slate-300 bg-slate-800/50 flex items-center justify-center text-center' : 'text-slate-300'}`}>
                                                {cell}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 6. شريحة الأسئلة التفاعلية */}
                    {slide.type === 'quiz' && (
                        <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
                            <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xl font-bold mb-10">
                                <Lightbulb className="w-6 h-6 animate-pulse" /> {slide.title}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 leading-[1.8] text-center">
                                {slide.question}
                            </h2>
                            <div className="flex flex-col gap-6 w-full">
                                {slide.options.map((option, idx) => {
                                    let btnStateClass = "bg-slate-800/60 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-blue-400/50";
                                    let icon = <div className="w-8 h-8 rounded-full border border-slate-500 flex-shrink-0"></div>;

                                    if (isAnswered) {
                                        if (idx === slide.correctAnswer) {
                                            btnStateClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.15)]";
                                            icon = <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />;
                                        } else if (idx === selectedAnswer) {
                                            btnStateClass = "bg-rose-500/20 border-rose-500/50 text-rose-300";
                                            icon = <XCircle className="w-8 h-8 text-rose-400 flex-shrink-0" />;
                                        } else {
                                            btnStateClass = "bg-slate-800/30 border-transparent text-slate-500 opacity-50";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            disabled={isAnswered}
                                            className={`w-full text-right p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 flex justify-between items-center text-xl font-semibold gap-6 ${btnStateClass}`}
                                        >
                                            <span className="leading-[1.8]">{option}</span>
                                            {icon}
                                        </button>
                                    );
                                })}
                            </div>

                            {isAnswered && (
                                <div className="mt-10 p-8 rounded-2xl bg-blue-500/10 border-r-4 border-blue-500 text-blue-100 text-2xl font-bold animate-fade-in w-full leading-[1.8]">
                                    {slide.feedback}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 7. شريحة النهاية */}
                    {slide.type === 'completion' && (
                        <div className="flex flex-col items-center text-center py-10">
                            <div className="relative mb-12">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[80px] animate-pulse"></div>
                                <Award className="w-48 h-48 text-blue-400 relative z-10 drop-shadow-[0_0_40px_rgba(96,165,250,0.6)]" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-wide">{slide.title}</h1>
                            <p className="text-2xl text-slate-300 mb-16 max-w-3xl leading-[1.8]">{slide.content}</p>

                            <div className="bg-slate-800 border border-blue-500/30 px-24 py-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-cyan-400 via-blue-500 to-indigo-500"></div>
                                <p className="text-slate-300 mb-6 text-2xl font-bold">النتيجة النهائية للاختبارات</p>
                                <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center gap-6">
                                    {score} <span className="text-4xl text-slate-500 font-medium">من</span> {totalQuizzes}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* أزرار التنقل السفلية */}
                <div className="mt-10 flex justify-between items-center pt-8 border-t border-slate-700/60 shrink-0">
                    <button
                        onClick={handlePrev}
                        disabled={currentSlide === 0}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 text-xl ${currentSlide === 0
                                ? 'opacity-0 pointer-events-none'
                                : 'text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-600'
                            }`}
                    >
                        <ChevronRight className="w-6 h-6" /> الشريحة السابقة
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={slide.type === 'quiz' && !isAnswered}
                        className={`flex items-center gap-3 px-12 py-5 rounded-2xl font-bold text-2xl transition-all duration-300 ${slide.type === 'quiz' && !isAnswered
                                ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-transparent'
                                : 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:scale-[1.02] border border-blue-400/50'
                            }`}
                    >
                        {currentSlide === lessonData.length - 1 ? 'العودة للقائمة الرئيسية' : 'التالي'}
                        {currentSlide !== lessonData.length - 1 && <ChevronLeft className="w-7 h-7" />}
                    </button>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.8); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 1); 
        }
      `}} />
        </div>
    );
}