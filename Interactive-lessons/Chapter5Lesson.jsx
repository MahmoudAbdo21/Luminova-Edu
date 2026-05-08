import React, { useState, useEffect } from 'react';
import {
    CheckCircle2, XCircle, ChevronRight, ChevronLeft,
    LogOut, MousePointerClick, Layers, MonitorPlay,
    MessageSquare, Users, BrainCircuit, Target,
    CheckSquare, Globe, Laptop, Sparkles, Layout,
    Settings, PenTool, Focus, RefreshCw, Award
} from 'lucide-react';

export default function App() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // استخراج المحتوى العلمي بالكامل بدقة متناهية
    const lessonData = [
        {
            type: 'intro',
            title: 'الفصل الخامس: الإنفوجرافيك التفاعلي',
            subtitle: 'مستقبل عرض البيانات والمعلومات',
            content: 'عبارة عن تمثيل بصري للمعلومات والبيانات المعقدة، يمزج بين النصوص والرسومات والصور ليسهل فهمها بوضوح وتشويق. يتميز بإضافة أدوات التحكم والأكواد والأزرار ليجعل الإنفوجرافيك تفاعلياً، حيث يسمح للمستخدم بالتحكم في عرض المعلومات وتسلسلها، مما يوفر الكثير من المساحة ويتيح عرض كمية كبيرة من البيانات بطريقة منظمة.',
            icon: <MousePointerClick className="w-24 h-24 text-emerald-400 mb-6 drop-shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
        },
        {
            type: 'split-features',
            title: 'أنواع وخصائص الإنفوجرافيك التفاعلي',
            icon: <Layers className="w-12 h-12 text-cyan-400 mb-4" />,
            types: [
                { name: 'شبه تفاعلي', desc: 'يتيح الوصول إلى بيانات ومعلومات إضافية من مصادر أخرى (ملفات فيديو، كتب، صوتيات، نصوص).' },
                { name: 'تفاعلي بالكامل', desc: 'يتمتع بخصائص الشبه تفاعلي، بالإضافة إلى السماح للطالب بعرض المعلومات بناءً على استجابته ومدى رغبته في التقدم.' }
            ],
            features: [
                'يساعد التفاعل على الاحتفاظ بالمعلومات بشكل أفضل.',
                'يوفر كميات كبيرة من المعلومات، ويمكن للمتعلم عرض واختيار ما يحتاج إليه فقط.',
                'يمتلك خاصية التأثير والإقناع بجمع العناصر البصرية والحركية.',
                'سهولة إعادة التطبيق والتحديث، وتغيير وإضافة مزيد من المعلومات.',
                'تنوع الأنشطة وتوافر التعلم الذاتي والتحكم في التجول داخل المحتوى.'
            ]
        },
        {
            type: 'process',
            title: 'تصميم الإنفوجرافيك كعملية اتصال',
            description: 'يعتمد نجاح الإنفوجرافيك في إيصال الرسالة على تكامل أربعة عناصر أساسية:',
            icon: <MessageSquare className="w-12 h-12 text-purple-400 mb-6" />,
            steps: [
                { title: '1. المصمم (المرسل)', desc: 'مصدر الرسالة. يجب أن يمتلك هدفاً واضحاً وأن يكون تصميمه جيداً وجذاباً ومنظماً لمساعدة المتلقي على الفهم.' },
                { title: '2. الرسالة (المحتوى)', desc: 'الهدف الأساسي. تتكون من نصوص، خرائط، صور، فيديو، أيقونات. يجب التأكد من صدق المحتوى ودقته.' },
                { title: '3. الوسيلة', desc: 'الوسيط الناقل للرسالة. يجب أن تلائم هدف الإنفوجرافيك، والمراحل العمرية للمتلقين، ومستوى التطور التكنولوجي.' },
                { title: '4. المتلقي (المتفاعل)', desc: 'الشخص الموجه له الرسالة. يقوم بفهم المحتوى وتحليل رموزه، وهو من يقيس نجاح المصمم في إيصال رسالته.' }
            ]
        },
        {
            type: 'quiz',
            title: 'سؤال في الصميم 💡',
            question: 'عندما نتحدث عن ضرورة "ملاءمة التطور التكنولوجي وتناسب المرحلة العمرية للطلاب" عند تصميم الإنفوجرافيك، فنحن نشير إلى أي عنصر من عناصر الاتصال؟',
            options: [
                'المرسل (المصمم)',
                'الرسالة (المحتوى)',
                'الوسيلة (الوسيط الناقل)'
            ],
            correctAnswer: 2,
            feedback: 'إجابة دقيقة! الوسيلة هي الأداة أو الوسيط الناقل الذي يجب أن يتم اختياره بعناية ليناسب قدرات وأعمار المتلقين.'
        },
        {
            type: 'theories',
            title: 'الأسس النظريـة للتدريس بالإنفوجرافيك التفاعلي',
            icon: <BrainCircuit className="w-12 h-12 text-yellow-400 mb-4" />,
            content: 'يعتمد التصميم التفاعلي على نظريات علم النفس المعرفي والإدراك البصري:',
            items: [
                { title: 'نظرية الجشطالت', desc: 'تتبنى مبادئ الإدراك للعالم الخارجي بتنظيم الجانب البصري بمنطقية. تركز على كيفية تجميع الأجزاء المنفصلة لتشكل (كلاً متكاملاً). التعلم هو إدراك المواقف بإعادة تنظيم أجزائها لتعطي الفهم الكامل للموقف.' },
                { title: 'نظرية الترميز الثنائي (بافيو)', desc: 'تعالج المعلومات بنظامين مختلفين: (الترميز اللفظي) و (الترميز غير اللفظي/التصوري). يقوم كل منهما بالمعالجة بشكل مستقل، ولكن توجد روابط تتيح المعالجة المزدوجة في الوقت نفسه، مما يدعم التخزين القوي في البنية المعرفية للعقل.' }
            ]
        },
        {
            type: 'steps-teaching',
            title: 'خطوات توظيف الإنفوجرافيك في التدريس',
            icon: <Target className="w-12 h-12 text-pink-400 mb-6" />,
            description: 'يمر التدريس باستخدام الإنفوجرافيك التفاعلي بأربع خطوات أساسية:',
            steps: [
                { title: 'تحديد الأهداف', desc: 'وضوح الأهداف وارتباطها بدروس المادة وصياغتها في صورة أهداف سلوكية.' },
                { title: 'الاستكشاف', desc: 'تفاعل الطلبة واستكشافهم للأنشطة التي يقدمها الإنفوجرافيك (فردياً أو في مجموعات).' },
                { title: 'التفسير', desc: 'توجيه الطلبة للانخراط في المحتوى، تحليل العلاقات، استنتاج الأفكار والتأكد من دقتها.' },
                { title: 'التقويم', desc: 'الاستخدام الميداني، والتطبيق على المؤسسات التعليمية للتأكد من تحقق الأهداف.' }
            ]
        },
        {
            type: 'stages',
            title: 'مراحل تصميم الإنفوجرافيك التفاعلي',
            icon: <RefreshCw className="w-12 h-12 text-emerald-400 mb-6" />,
            description: 'يتطلب التصميم المرور بـ 5 مراحل منهجية متسلسلة:',
            stages: [
                { title: '1. الدراسة والتحليل', desc: 'تحليل الاحتياجات، تحليل الأهداف، تحليل المحتوى، وتحليل خصائص الطلبة.' },
                { title: '2. التصميم', desc: 'صياغة الأهداف الإجرائية، تصميم المحتوى، تحديد الخطوط/الألوان/الصور، وتخطيط عناصر التفاعل.' },
                { title: '3. الإنتاج', desc: 'كتابة السيناريو، تجميع العناصر البصرية، تحديد أماكن الأزرار والروابط، اختيار المؤثرات، والبدء في الإخراج النهائي.' },
                { title: '4. التقويم والتجريب', desc: 'التحكيم من الخبراء، التجريب على عينة استطلاعية، ثم التطبيق الجمعي النهائي.' },
                { title: '5. التقويم المستمر', desc: 'المتابعة الميدانية أثناء التطبيق في المؤسسات التعليمية لضمان استمرار الفاعلية والتنقيح.' }
            ]
        },
        {
            type: 'quiz',
            title: 'موقف تطبيقي 🎯',
            question: 'مصمم إنفوجرافيك يقوم حالياً بـ "كتابة السيناريو، وتحديد أماكن الأزرار والروابط التفاعلية على الشاشة، وتجميع المؤثرات الصوتية". في أي مرحلة من مراحل التصميم هو الآن؟',
            options: [
                'مرحلة التصميم',
                'مرحلة الإنتاج',
                'مرحلة الدراسة والتحليل'
            ],
            correctAnswer: 1,
            feedback: 'إجابة ممتازة! مرحلة "الإنتاج" هي المرحلة التنفيذية الفعلية التي يتم فيها تجميع العناصر وبناء السيناريو وربط الأزرار.'
        },
        {
            type: 'standards-grid',
            title: 'معايير تصميم الإنفوجرافيك التفاعلي',
            icon: <CheckSquare className="w-12 h-12 text-indigo-400 mb-4" />,
            content: 'ينقسم التصميم إلى بعدين أساسيين: البعد التربوي والبعد الفني.',
            cols: [
                {
                    title: 'البعد التربوي',
                    items: [
                        { title: 'تنظيم المحتوى', desc: 'يحقق الأهداف، يراعي الدقة العلمية، يتوافق مع خصائص المتعلمين، ويخلو من الأخطاء.' },
                        { title: 'الأنشطة التعليمية', desc: 'تثير الاهتمام، تسهم في التفاعل، وتتصف بالتنوع الإثرائي.' },
                        { title: 'التفاعلية', desc: 'تناسب خصائص المتعلمين، تشتمل على أنماط مختلفة، وتسمح بمراجعة الإطارات السابقة.' },
                        { title: 'الحقوق الفكرية', desc: 'عرض المراجع والمصادر المستخدمة في البناء.' }
                    ]
                },
                {
                    title: 'البعد الفني',
                    items: [
                        { title: 'معيار الوحدة', desc: 'توحيد الألوان، أحجام الخطوط وأنواعها، وتوحيد أماكن عرض الصور والأشكال.' },
                        { title: 'معيار التوازن', desc: 'ترك هوامش كافية لراحة العين، وتوزيع الكتل بمركز الشاشة بشكل منتظم.' },
                        { title: 'معيار التباين', desc: 'التباين العالي بين الألوان والخلفيات، وتكامل النصوص مع الصور، والتباين لتوضيح العلاقة بين الشكل والأرضية.' }
                    ]
                }
            ]
        },
        {
            type: 'software-list',
            title: 'أولاً: البرامج المكتبية (Desktop)',
            icon: <Laptop className="w-12 h-12 text-blue-400 mb-4" />,
            description: 'برامج احترافية يتم تثبيتها على أجهزة الكمبيوتر:',
            software: [
                { name: 'Microsoft PowerPoint', desc: 'وسيلة تصميم وفق سيناريو محدد، يتيح شرائح عالية التنسيق، خيارات كبيرة من الأشكال والفيديو، وإمكانية عمل روابط تفاعلية وأزرار.' },
                { name: 'Articulate Storyline', desc: 'متخصص في الدروس التعليمية والاختبارات التفاعلية وعروض الشرائح. يسمح بنشر المحتوى على (نظم إدارة التعلم LMS) والإنترنت أو الأقراص الصلبة.' },
                { name: 'Adobe Flash / Animate', desc: 'برنامج شائع لإنشاء بيئات تفاعلية غنية بالفيديو والصوت. يتيح تصميم حركات معقدة وبرمجة تفاعلية باستخدام لغة (Action Script).' }
            ]
        },
        {
            type: 'software-list',
            title: 'ثانياً: المواقع المعتمدة على الويب (Cloud)',
            icon: <Globe className="w-12 h-12 text-teal-400 mb-4" />,
            description: 'منصات سحابية تتيح التصميم التفاعلي مباشرة عبر الإنترنت:',
            software: [
                { name: 'Genially', desc: 'لإنشاء ملصقات وعروض تفاعلية. يتيح استيراد شرائح PowerPoint وتحويلها لإبداعات تفاعلية بفضل القوالب الجاهزة.' },
                { name: 'Visme', desc: 'لتوسيع نطاق العرض التقديمي، وتحويل البيانات لرسوم بيانية تفاعلية، مع تركيز الموارد على إعطاء مظهر احترافي.' },
                { name: 'Infogram', desc: 'متخصص في البيانات والإحصائيات. يوفر أكثر من 35 مخططاً، و 500 خريطة، و 20 قالباً جاهزاً مع محرر السحب والإفلات.' },
                { name: 'Edraw Max', desc: 'منصة شاملة للمخططات التنظيمية، خرائط التدفق (Flowcharts)، الخرائط الذهنية، ومخططات عظم السمكة، بأدوات تخصيص متقدمة.' },
                { name: 'Canva', desc: 'الأداة الأشهر والأسهل بمحرر السحب والإفلات. تحتوي مكتبتها على ملايين الصور، الفيديوهات، والموسيقى لإنشاء تصميمات سريعة.' },
                { name: 'Thinglink', desc: 'محرر وسائط تفاعلي لإنشاء (جولات افتراضية) ونقاط اتصال على الصور والفيديو والنماذج ثلاثية الأبعاد (3D).' },
                { name: 'ION Rockcontent', desc: 'موقع لإنشاء تجارب تفاعلية بدون قوالب جاهزة (من لوحة فارغة)، كحسابات العائد على الاستثمار والاختبارات.' },
                { name: 'Am a chart', desc: 'أداة للرسوم البيانية التفاعلية، تتضمن أكواد (HTML5, JavaScript) ورسوم فلاشية (Flash).' }
            ]
        },
        {
            type: 'quiz',
            title: 'اختبار دقة المعلومات 🏆',
            question: 'أستاذ جامعي يريد تصميم اختبارات ودروس تفاعلية لرفعها مباشرة على (نظام إدارة التعلم LMS) الخاص بالجامعة، أي برنامج مكتبي هو الأنسب لذلك؟',
            options: [
                'Microsoft PowerPoint',
                'Adobe Flash',
                'Articulate Storyline'
            ],
            correctAnswer: 2,
            feedback: 'رائع وممتاز! برنامج Articulate Storyline هو الرائد عالمياً في تصميم الدروس والاختبارات المتوافقة مع نظم إدارة التعلم (LMS) مثل Moodle و Blackboard.'
        },
        {
            type: 'completion',
            title: 'اكتمل الفصل الخامس بنجاح! 🎉',
            content: 'لقد أتممت دراسة "الإنفوجرافيك التفاعلي". تعرفت على عملية الاتصال، نظريات الترميز والجشطالت، مراحل التصميم الخمسة، المعايير التربوية والفنية، ومكتبة ضخمة من البرامج والأدوات.',
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

    // حقن خط Cairo لتحسين مظهر اللغة العربية
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    return (
        <div style={{ fontFamily: "'Cairo', sans-serif" }} className="w-full min-h-screen bg-[#050b14] text-white flex items-center justify-center p-4 md:p-8 overflow-x-hidden tracking-wide" dir="rtl">

            {/* تأثيرات الإضاءة المحيطية (Neon Glow) */}
            <div className="fixed top-0 right-0 w-[70vw] h-[70vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none animate-pulse"></div>
            <div className="fixed bottom-0 left-0 w-[70vw] h-[70vw] rounded-full bg-cyan-900/10 blur-[150px] pointer-events-none"></div>

            {/* الحاوية الرئيسية الواسعة للابتوب */}
            <div className="relative z-10 w-full max-w-7xl bg-[#0a1120]/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] rounded-[2.5rem] p-6 md:p-12 flex flex-col min-h-[85vh] transition-all duration-500">

                {/* شريط التقدم وأزرار التحكم العليا */}
                <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                    <button onClick={() => console.log('Exit')} className="flex items-center gap-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 px-5 py-2.5 rounded-xl text-base font-bold border border-transparent hover:border-red-500/30 transition-all">
                        <LogOut className="w-5 h-5" /> إنهاء الدرس
                    </button>

                    <div className="flex-1 mr-8 ml-4 max-w-3xl mx-auto">
                        <div className="h-2.5 w-full bg-[#152033] rounded-full overflow-hidden shadow-inner relative">
                            <div
                                className="h-full bg-gradient-to-l from-emerald-400 via-cyan-500 to-blue-600 transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-white/50 text-sm mt-3 font-semibold">
                            <span>الفصل الخامس: الإنفوجرافيك التفاعلي</span>
                            <span>شريحة {currentSlide + 1} من {lessonData.length}</span>
                        </div>
                    </div>
                </div>

                {/* مساحة عرض المحتوى الديناميكية */}
                <div className="flex-1 flex flex-col justify-center items-center w-full animate-fade-in-up" key={currentSlide}>

                    {/* 1. المقدمة */}
                    {slide.type === 'intro' && (
                        <div className="text-center flex flex-col items-center max-w-5xl">
                            {slide.icon}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-l from-emerald-300 to-cyan-400 mb-8 leading-tight">
                                {slide.title}
                            </h1>
                            <div className="bg-white/5 px-12 py-3 mb-10 rounded-full border border-white/10 shadow-lg">
                                <h2 className="text-2xl text-cyan-200 font-bold">{slide.subtitle}</h2>
                            </div>
                            <p className="text-2xl text-white/85 leading-loose bg-[#0f172a]/60 p-10 rounded-3xl border border-white/5 shadow-inner">
                                {slide.content}
                            </p>
                        </div>
                    )}

                    {/* 2. أنواع وخصائص (Split Features) */}
                    {slide.type === 'split-features' && (
                        <div className="w-full flex flex-col items-center max-w-7xl">
                            {slide.icon}
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">{slide.title}</h2>

                            <div className="flex flex-col lg:flex-row gap-8 w-full">
                                {/* الأنواع */}
                                <div className="flex-1 bg-[#0f172a]/80 p-8 rounded-3xl border border-cyan-500/20">
                                    <h3 className="text-2xl font-bold text-cyan-400 mb-6 border-b border-white/10 pb-4">الأنواع والتصنيفات</h3>
                                    <div className="space-y-6">
                                        {slide.types.map((type, idx) => (
                                            <div key={idx} className="bg-white/5 p-6 rounded-2xl">
                                                <h4 className="text-xl font-bold text-white mb-2">{type.name}</h4>
                                                <p className="text-white/70 leading-relaxed text-lg">{type.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* الخصائص */}
                                <div className="flex-1 bg-gradient-to-br from-[#0f172a] to-[#0a202a] p-8 rounded-3xl border border-emerald-500/20 shadow-xl">
                                    <h3 className="text-2xl font-bold text-emerald-400 mb-6 border-b border-white/10 pb-4">المميزات والخصائص</h3>
                                    <ul className="space-y-5">
                                        {slide.features.map((feat, idx) => (
                                            <li key={idx} className="flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                                                <span className="text-white/85 text-lg leading-relaxed">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. عملية الاتصال (Process Flow) */}
                    {slide.type === 'process' && (
                        <div className="w-full flex flex-col items-center max-w-7xl">
                            {slide.icon}
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-xl text-purple-200 mb-12 text-center">{slide.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full relative">
                                {/* خط الاتصال (للشاشات الكبيرة) */}
                                <div className="hidden lg:block absolute top-12 left-20 right-20 h-1.5 bg-gradient-to-r from-purple-500/20 via-purple-500/80 to-purple-500/20 -z-10 rounded-full"></div>

                                {slide.steps.map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center relative group">
                                        <div className="w-24 h-24 rounded-full bg-[#0a1120] flex items-center justify-center text-3xl font-black text-purple-400 border-4 border-purple-500/50 z-10 mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                            {idx + 1}
                                        </div>
                                        <div className="bg-[#0f172a]/90 border border-white/10 p-8 rounded-3xl text-center w-full h-full hover:border-purple-500/50 transition-all shadow-lg">
                                            <h3 className="text-2xl font-bold text-white mb-4">{step.title.split('.')[1]}</h3>
                                            <p className="text-white/70 text-lg leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. النظريات (Theories) */}
                    {slide.type === 'theories' && (
                        <div className="w-full flex flex-col items-center max-w-5xl">
                            {slide.icon}
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{slide.title}</h2>
                            <p className="text-2xl text-yellow-200 mb-10 text-center">{slide.content}</p>

                            <div className="flex flex-col gap-8 w-full">
                                {slide.items.map((item, idx) => (
                                    <div key={idx} className="relative bg-[#0f172a] p-10 rounded-3xl border border-white/5 hover:border-yellow-400/50 transition-all overflow-hidden group shadow-xl">
                                        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-yellow-400 to-orange-500"></div>
                                        <h3 className="text-3xl font-bold text-yellow-300 mb-4 relative z-10 flex items-center gap-3">
                                            <Award className="w-8 h-8" /> {item.title}
                                        </h3>
                                        <p className="text-white/80 text-xl leading-loose relative z-10 pr-11">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 5. خطوات التدريس و 6. مراحل التصميم (استخدام Timeline / Steps) */}
                    {(slide.type === 'steps-teaching' || slide.type === 'stages') && (
                        <div className="w-full flex flex-col items-center max-w-7xl">
                            {slide.icon}
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-xl text-white/60 mb-12 text-center">{slide.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
                                {slide[slide.type === 'stages' ? 'stages' : 'steps'].map((step, idx) => (
                                    <div key={idx} className="bg-[#0f172a] border border-white/5 p-8 rounded-3xl hover:-translate-y-2 transition-transform shadow-lg group">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold mb-6 text-white ${slide.type === 'stages' ? 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-pink-500/20 text-pink-400 group-hover:bg-pink-500 group-hover:text-white'} transition-colors`}>
                                            {idx + 1}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4 leading-normal">
                                            {slide.type === 'stages' ? step.title.split('. ')[1] : step.title}
                                        </h3>
                                        <p className="text-white/60 text-base leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 7. المعايير (Grid عملاق للابتوب) */}
                    {slide.type === 'standards-grid' && (
                        <div className="w-full flex flex-col items-center max-w-7xl">
                            {slide.icon}
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-xl text-indigo-200 mb-10 text-center">{slide.content}</p>

                            <div className="flex flex-col lg:flex-row gap-8 w-full">
                                {slide.cols.map((col, cIdx) => (
                                    <div key={cIdx} className="flex-1 bg-[#0f172a] p-8 rounded-[2.5rem] border border-indigo-500/20 shadow-2xl">
                                        <h3 className="text-3xl font-black text-indigo-300 mb-8 text-center border-b border-white/10 pb-4">{col.title}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {col.items.map((item, iIdx) => (
                                                <div key={iIdx} className="bg-white/5 p-6 rounded-2xl hover:bg-indigo-500/10 transition-colors">
                                                    <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div> {item.title}
                                                    </h4>
                                                    <p className="text-white/70 leading-relaxed">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 8. البرامج (Desktop & Cloud) */}
                    {slide.type === 'software-list' && (
                        <div className="w-full flex flex-col items-center max-w-7xl">
                            {slide.icon}
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-xl text-white/60 mb-10 text-center">{slide.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                                {slide.software.map((sw, idx) => (
                                    <div key={idx} className="bg-gradient-to-b from-[#0f172a] to-[#0a1120] border border-white/10 p-8 rounded-3xl hover:border-blue-400/50 transition-all flex flex-col group shadow-lg">
                                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300 mb-4 group-hover:scale-105 transition-transform origin-right">
                                            {sw.name}
                                        </h3>
                                        <p className="text-white/75 text-lg leading-loose">{sw.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 9. الأسئلة التفاعلية */}
                    {slide.type === 'quiz' && (
                        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-lg font-bold mb-10 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                                <Lightbulb className="w-6 h-6 animate-pulse" /> {slide.title}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 leading-loose text-center">
                                {slide.question}
                            </h2>
                            <div className="flex flex-col gap-6 w-full">
                                {slide.options.map((option, idx) => {
                                    let btnStateClass = "bg-[#0f172a] border-white/5 text-white/80 hover:bg-[#152033] hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]";
                                    let icon = <div className="w-8 h-8 rounded-full border border-white/20 flex-shrink-0"></div>;

                                    if (isAnswered) {
                                        if (idx === slide.correctAnswer) {
                                            btnStateClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.2)] scale-[1.02]";
                                            icon = <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />;
                                        } else if (idx === selectedAnswer) {
                                            btnStateClass = "bg-red-500/20 border-red-500/50 text-red-300";
                                            icon = <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />;
                                        } else {
                                            btnStateClass = "bg-[#0f172a]/50 border-transparent text-white/30 opacity-50";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            disabled={isAnswered}
                                            className={`relative w-full text-right p-6 md:p-8 rounded-2xl border transition-all duration-300 flex justify-between items-center text-xl font-semibold ${btnStateClass}`}
                                        >
                                            <span className="pl-6 leading-relaxed">{option}</span>
                                            {icon}
                                        </button>
                                    );
                                })}
                            </div>

                            {isAnswered && (
                                <div className="mt-10 p-8 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-transparent border-r-4 border-cyan-500 text-cyan-100 text-xl font-bold animate-fade-in w-full shadow-lg leading-loose">
                                    {slide.feedback}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 10. النهاية */}
                    {slide.type === 'completion' && (
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-10">
                                <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-[80px] animate-pulse"></div>
                                <Award className="w-40 h-40 text-emerald-400 relative z-10 drop-shadow-[0_0_40px_rgba(52,211,153,0.6)]" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-wide">{slide.title}</h1>
                            <p className="text-2xl text-white/70 mb-16 max-w-2xl leading-relaxed">{slide.content}</p>

                            <div className="bg-[#0f172a] border border-emerald-500/30 px-24 py-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-cyan-400 via-emerald-500 to-blue-500"></div>
                                <p className="text-white/60 mb-6 text-2xl font-bold">النتيجة النهائية للاختبارات</p>
                                <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 flex items-center justify-center gap-6">
                                    {score} <span className="text-4xl text-white/30 font-medium">من</span> {totalQuizzes}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* أزرار التنقل السفلية */}
                <div className="mt-12 flex justify-between items-center pt-8 border-t border-white/10">
                    <button
                        onClick={handlePrev}
                        disabled={currentSlide === 0}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 text-lg ${currentSlide === 0
                                ? 'opacity-0 pointer-events-none'
                                : 'text-white/70 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                    >
                        <ChevronRight className="w-6 h-6" /> الشريحة السابقة
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={slide.type === 'quiz' && !isAnswered}
                        className={`flex items-center gap-3 px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 ${slide.type === 'quiz' && !isAnswered
                                ? 'bg-[#0f172a] text-white/30 cursor-not-allowed border border-transparent'
                                : 'bg-gradient-to-l from-emerald-500 to-cyan-600 text-white shadow-[0_0_30px_rgba(52,211,153,0.4)] hover:shadow-[0_0_40px_rgba(52,211,153,0.6)] hover:scale-[1.03] border border-cyan-400/50'
                            }`}
                    >
                        {currentSlide === lessonData.length - 1 ? 'إنهاء الدرس التفاعلي' : 'التالي'}
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
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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