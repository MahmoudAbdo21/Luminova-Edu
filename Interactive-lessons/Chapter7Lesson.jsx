import React, { useState, useEffect } from 'react';
import {
    ChevronRight, ChevronLeft, LogOut,
    Image as ImageIcon, Video, MousePointerClick,
    Layers, Clock, Brain, Database, CheckCircle2, XCircle,
    Laugh, Sparkles, Target, Zap, ShieldCheck
} from 'lucide-react';

export default function App() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    // المادة العلمية الشاملة (من المنهج + تحليلات ذكية إضافية)
    const lessonData = [
        {
            type: 'intro',
            title: 'المعركة الثلاثية: أنواع الإنفوجرافيك',
            subtitle: 'دليلك الشامل للتفريق بين الثابت، المتحرك، والتفاعلي',
            content: 'في هذا الدرس، لن نكتفي بالتعريفات السطحية. سنغوص في الأعماق لنفهم كيف يتعامل العقل البشري مع كل نوع، متى نستخدم كل منها، وما هي الفروق الجوهرية من حيث (كثافة البيانات، التحكم، والتكلفة). مستعد؟ دعنا نبدأ!',
            icon: <Layers className="w-24 h-24 text-blue-400 mb-6 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)]" />
        },
        {
            type: 'definitions',
            title: 'أولاً: التعريفات الجوهرية',
            description: 'قبل المقارنة، دعنا نضع أساساً واضحاً لكل نوع:',
            items: [
                {
                    title: 'الإنفوجرافيك الثابت (Static)',
                    desc: 'هو تصميم صامت في صورة واحدة لا تتحرك ولا تتغير. يعتمد كلياً على ترتيب العناصر، الألوان، والأسهم لتوجيه عين القارئ من نقطة البداية للنهاية. مخرجاته تقتصر على "الصورة والنص".',
                    icon: <ImageIcon className="w-12 h-12 text-cyan-400" />,
                    color: 'border-cyan-500/30 bg-cyan-500/10'
                },
                {
                    title: 'الإنفوجرافيك المتحرك (Animated)',
                    desc: 'هو فيديو زمني (Time-based). يدمج التصميم الجرافيكي مع الحركة، والمؤثرات البصرية، والتعليق الصوتي. يعرض المعلومات بشكل متسلسل زمنياً يجبر المشاهد على المتابعة من البداية للنهاية.',
                    icon: <Video className="w-12 h-12 text-purple-400" />,
                    color: 'border-purple-500/30 bg-purple-500/10'
                },
                {
                    title: 'الإنفوجرافيك التفاعلي (Interactive)',
                    desc: 'هو بيئة ويب برمجية متكاملة. لا يتحرك من تلقاء نفسه، بل ينتظر أمر المستخدم (النقر، التمرير، التكبير). يعرض جزءاً من المعلومات ويخفي الباقي خلف الأزرار والروابط.',
                    icon: <MousePointerClick className="w-12 h-12 text-emerald-400" />,
                    color: 'border-emerald-500/30 bg-emerald-500/10'
                }
            ]
        },
        {
            type: 'advanced-analysis',
            title: 'ثانياً: التحليل العميق (خارج الصندوق)',
            description: 'هذه الفروق التحليلية ستجعلك تتفوق في أي نقاش أكاديمي:',
            items: [
                {
                    title: '1. التحكم في سرعة العرض (Pacing)',
                    icon: <Clock className="w-8 h-8 text-amber-400 mb-4" />,
                    static: 'التحكم بيد (المشاهد): يقرأ بسرعة أو ببطء كما يشاء.',
                    animated: 'التحكم بيد (المصمم): الفيديو يفرض سرعته على المشاهد.',
                    interactive: 'التحكم (مشترك): المشاهد يتحكم، ولكن ضمن المسارات التي برمجها المصمم.'
                },
                {
                    title: '2. كثافة البيانات (Data Density)',
                    icon: <Database className="w-8 h-8 text-blue-400 mb-4" />,
                    static: 'محدودة: المساحة مقيدة بأبعاد الصورة، الزحام يفسد التصميم.',
                    animated: 'متوسطة: مقيدة بمدة الفيديو الزمني لكي لا يمل المشاهد.',
                    interactive: 'لا نهائية: يمكن إخفاء ملايين البيانات خلف أزرار (اقرأ المزيد) أو قوائم منسدلة.'
                },
                {
                    title: '3. العبء المعرفي على الدماغ',
                    icon: <Brain className="w-8 h-8 text-rose-400 mb-4" />,
                    static: 'يعتمد على مجهود الطالب في تتبع الأسهم وحل الرموز.',
                    animated: 'منخفض جداً (استقبال سلبي)، فالمعلومة تُقدم جاهزة بالصوت والصورة.',
                    interactive: 'ينشط الدماغ (استقبال إيجابي/نشط) لأن الطالب يتخذ قرارات لاستكشاف المعلومة.'
                }
            ]
        },
        {
            type: 'joke',
            title: 'استراحة محارب (فاصل فكاهي) 😂',
            content: 'سألوا طالب تكنولوجيا تعليم: إيه الفرق بين الإنفوجرافيك الثابت والمتحرك والتفاعلي؟',
            punchline: 'قالهم: الثابت.. ده اللي بنذاكر منه وإحنا قاعدين على السرير. المتحرك.. ده اللي بنشوفه ليلة الامتحان وإحنا بنجري وبنلطم. التفاعلي.. ده اللي بنفضل نضغط على زرايره عشان نهرب من المذاكرة أصلاً! 🏃‍♂️💨',
            icon: <Laugh className="w-24 h-24 text-yellow-400 mb-6 animate-bounce" />
        },
        {
            type: 'comparison-table',
            title: 'ثالثاً: المقارنة الشاملة المجدولة',
            description: 'جدول دقيق يجمع كل الفروق التقنية والتربوية لسهولة الحفظ:',
            headers: ['وجه المقارنة', 'الثابت (Static)', 'المتحرك (Animated)', 'التفاعلي (Interactive)'],
            rows: [
                ['صيغة المخرجات', 'JPG, PNG, PDF', 'MP4, GIF', 'HTML5, Web Links'],
                ['طريقة الاستهلاك', 'قراءة وتأمل بصري', 'مشاهدة واستماع', 'استكشاف، نقر، وتجول'],
                ['تكلفة وسرعة الإنتاج', 'منخفضة التكلفة، سريع جداً', 'عالية التكلفة، يحتاج وقت للمونتاج', 'الأعلى تكلفة، يحتاج وقت للتصميم والبرمجة'],
                ['التحديث والتعديل', 'سهل (تعديل الصورة وإعادة رفعها)', 'صعب (يحتاج إعادة مونتاج ورندرة للفيديو)', 'سهل جداً (يمكن ربطه بقواعد بيانات حية تتحدث تلقائياً)'],
                ['الاستخدام الأمثل', 'التقارير المطبوعة، السيرة الذاتية، التلخيص السريع', 'شرح العمليات المعقدة، القصص التاريخية، إعلانات السوشيال ميديا', 'الخرائط الجغرافية الضخمة، الإحصائيات المتغيرة، الدروس التي تقيس استجابة الطالب']
            ]
        },
        {
            type: 'quiz',
            title: 'اختبر فهمك العميق 💡',
            question: 'وزارة الصحة تريد نشر خريطة للعالم، بحيث عندما يمرر المستخدم "الماوس" فوق أي دولة، يظهر له نافذة صغيرة بها عدد المستشفيات في تلك الدولة، وتتحدث هذه الأرقام يومياً تلقائياً من سيرفر الوزارة. أي نوع هو الأنسب؟',
            options: [
                'الإنفوجرافيك الثابت (لأنه أسرع في النشر على الإنترنت).',
                'الإنفوجرافيك المتحرك (لأن ظهور النوافذ يعتبر حركة).',
                'الإنفوجرافيك التفاعلي (لأنه يقبل البرمجة، وقواعد البيانات الحية، وقابلية النقر).'
            ],
            correctAnswer: 2,
            feedback: 'إجابة عبقرية! قدرة الإنفوجرافيك التفاعلي على استيعاب (بيانات ضخمة مخفية) والاتصال بـ (قواعد بيانات حية تتحدث تلقائياً) تجعله الحل الوحيد الممكن لهذا السيناريو.'
        },
        {
            type: 'completion',
            title: 'أنت الآن خبير في الإنفوجرافيك! 🎉',
            content: 'لقد أتممت دراسة الفروق بين أنواع الإنفوجرافيك بمستوى احترافي يفوق التوقعات. لم تعد تعرف التعريفات فحسب، بل أصبحت تدرك الأبعاد المعرفية والتقنية لكل نوع لتختار الأداة المناسبة في الوقت المناسب.',
        }
    ];

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

    // حقن خط Cairo الأنيق لجمالية القراءة العربية
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    return (
        <div style={{ fontFamily: "'Cairo', sans-serif" }} className="w-full min-h-screen bg-[#050b14] text-slate-100 flex items-center justify-center p-4 md:p-8 overflow-hidden tracking-wide" dir="rtl">

            {/* تأثيرات الإضاءة المحيطية */}
            <div className="fixed top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none animate-pulse"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none"></div>

            {/* الحاوية الرئيسية (Flex-based لمنع تداخل النصوص تماماً) */}
            <div className="relative z-10 w-full max-w-[98%] xl:max-w-[90%] bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-6 md:p-10 flex flex-col min-h-[75vh] max-h-[90vh] transition-all duration-500 overflow-y-auto custom-scrollbar">

                {/* Header - شريط التحكم العلوي */}
                <div className="flex justify-between items-center mb-8 border-b border-slate-700/60 pb-6 shrink-0">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 px-4 py-2 rounded-xl text-lg font-bold border border-transparent transition-all">
                        <LogOut className="w-5 h-5" /> خروج
                    </button>

                    <div className="flex-1 mr-8 ml-4 max-w-4xl mx-auto">
                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner relative">
                            <div
                                className="h-full bg-gradient-to-l from-cyan-400 via-blue-500 to-purple-500 transition-all duration-700 ease-out"
                                style={{ width: `${((currentSlide + 1) / lessonData.length) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-slate-400 text-sm md:text-base mt-2 font-semibold">
                            <span>الفروق الجوهرية (ثابت، متحرك، تفاعلي)</span>
                            <span>شريحة {currentSlide + 1} من {lessonData.length}</span>
                        </div>
                    </div>
                </div>

                {/* Content Area - مساحة عرض المحتوى (Flex-grow) */}
                <div className="flex-1 flex flex-col justify-center items-center w-full animate-fade-in-up" key={currentSlide}>

                    {/* 1. المقدمة */}
                    {slide.type === 'intro' && (
                        <div className="text-center flex flex-col items-center max-w-5xl my-auto">
                            {slide.icon}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-l from-cyan-300 to-blue-500 mb-8 leading-[1.3]">
                                {slide.title}
                            </h1>
                            <div className="bg-slate-800/50 px-8 py-3 mb-10 rounded-full border border-slate-600 shadow-lg inline-block">
                                <h2 className="text-2xl text-blue-200 font-bold">{slide.subtitle}</h2>
                            </div>
                            <p className="text-2xl text-slate-200 leading-[2] bg-slate-800/40 p-8 md:p-12 rounded-[2rem] border border-slate-700/50 shadow-inner w-full">
                                {slide.content}
                            </p>
                        </div>
                    )}

                    {/* 2. التعريفات الأساسية (كروت) */}
                    {slide.type === 'definitions' && (
                        <div className="w-full flex flex-col items-center max-w-full my-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center">{slide.title}</h2>
                            <p className="text-xl text-slate-300 mb-10 text-center">{slide.description}</p>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                                {slide.items.map((item, idx) => (
                                    <div key={idx} className={`border ${item.color} p-8 rounded-[2rem] flex flex-col items-center text-center hover:-translate-y-2 transition-transform shadow-xl`}>
                                        <div className="p-4 bg-slate-800 rounded-2xl mb-6 shadow-inner">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                                        <p className="text-slate-200 text-lg leading-[2]">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. التحليل العميق (رؤية خارج الصندوق) */}
                    {slide.type === 'advanced-analysis' && (
                        <div className="w-full flex flex-col items-center max-w-full my-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center">{slide.title}</h2>
                            <p className="text-xl text-rose-200 mb-10 text-center">{slide.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                {slide.items.map((item, idx) => (
                                    <div key={idx} className="bg-slate-800/50 border border-slate-700/60 p-8 rounded-[2rem] flex flex-col hover:bg-slate-800 transition-colors shadow-lg">
                                        <div className="flex flex-col items-center text-center border-b border-slate-700 pb-6 mb-6">
                                            {item.icon}
                                            <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                                        </div>
                                        <div className="flex flex-col gap-5 flex-grow">
                                            <div className="flex items-start gap-3">
                                                <ImageIcon className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
                                                <p className="text-slate-300 text-lg leading-[1.8]"><span className="font-bold text-cyan-300">الثابت:</span> {item.static}</p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Video className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                                                <p className="text-slate-300 text-lg leading-[1.8]"><span className="font-bold text-purple-300">المتحرك:</span> {item.animated}</p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MousePointerClick className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                                                <p className="text-slate-300 text-lg leading-[1.8]"><span className="font-bold text-emerald-300">التفاعلي:</span> {item.interactive}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. الاستراحة الفكاهية (النكتة) */}
                    {slide.type === 'joke' && (
                        <div className="text-center flex flex-col items-center max-w-4xl my-auto bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 p-12 rounded-[3rem] shadow-2xl">
                            {slide.icon}
                            <h2 className="text-4xl md:text-5xl font-black text-yellow-400 mb-8">{slide.title}</h2>
                            <p className="text-2xl text-white mb-6 leading-[2] font-semibold">{slide.content}</p>
                            <div className="bg-slate-900/80 p-8 rounded-3xl border border-yellow-500/20 w-full mt-4">
                                <p className="text-3xl text-yellow-200 leading-[2] font-black">{slide.punchline}</p>
                            </div>
                        </div>
                    )}

                    {/* 5. جدول المقارنة (CSS Grid متجاوب) */}
                    {slide.type === 'comparison-table' && (
                        <div className="w-full flex flex-col items-center max-w-full my-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-center">{slide.title}</h2>
                            <p className="text-xl text-slate-300 mb-8 text-center">{slide.description}</p>

                            <div className="w-full overflow-x-auto rounded-3xl border border-slate-700/50 shadow-2xl">
                                <div className="min-w-[900px] grid grid-cols-4 bg-slate-800 text-xl font-bold text-center border-b-4 border-slate-600">
                                    {slide.headers.map((h, i) => (
                                        <div key={i} className={`p-6 ${i === 0 ? 'text-slate-200' : i === 1 ? 'text-cyan-300' : i === 2 ? 'text-purple-300' : 'text-emerald-300'}`}>{h}</div>
                                    ))}
                                </div>
                                {slide.rows.map((row, rIdx) => (
                                    <div key={rIdx} className="min-w-[900px] grid grid-cols-4 text-lg bg-slate-800/30 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                        {row.map((cell, cIdx) => (
                                            <div key={cIdx} className={`p-6 leading-[1.9] border-l border-slate-700/30 last:border-0 ${cIdx === 0 ? 'font-bold text-slate-300 bg-slate-800/50 flex items-center justify-center text-center' : 'text-slate-200'}`}>
                                                {cell}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 6. شريحة السؤال التفاعلي */}
                    {slide.type === 'quiz' && (
                        <div className="flex flex-col items-center w-full max-w-5xl mx-auto my-auto">
                            <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xl font-bold mb-8">
                                <Target className="w-6 h-6 animate-pulse" /> {slide.title}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 leading-[1.8] text-center">
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
                                <div className="mt-8 p-8 rounded-2xl bg-blue-500/10 border-r-4 border-blue-500 text-blue-100 text-2xl font-bold animate-fade-in w-full leading-[1.8] shadow-lg">
                                    {slide.feedback}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 7. النهاية */}
                    {slide.type === 'completion' && (
                        <div className="flex flex-col items-center text-center py-10 my-auto">
                            <div className="relative mb-12">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[80px] animate-pulse"></div>
                                <ShieldCheck className="w-48 h-48 text-blue-400 relative z-10 drop-shadow-[0_0_40px_rgba(96,165,250,0.6)]" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-wide">{slide.title}</h1>
                            <p className="text-2xl text-slate-300 mb-16 max-w-4xl leading-[2]">{slide.content}</p>
                        </div>
                    )}

                </div>

                {/* Footer Navigation - ثابتة في الأسفل */}
                <div className="mt-10 flex justify-between items-center pt-8 border-t border-slate-700/60 shrink-0">
                    <button
                        onClick={handlePrev}
                        disabled={currentSlide === 0}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 text-xl ${currentSlide === 0
                                ? 'opacity-0 pointer-events-none'
                                : 'text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-600'
                            }`}
                    >
                        <ChevronRight className="w-6 h-6" /> السابق
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={slide.type === 'quiz' && !isAnswered}
                        className={`flex items-center gap-3 px-12 py-5 rounded-2xl font-bold text-2xl transition-all duration-300 ${slide.type === 'quiz' && !isAnswered
                                ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-transparent'
                                : 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:scale-[1.02] border border-blue-400/50'
                            }`}
                    >
                        {currentSlide === lessonData.length - 1 ? 'إنهاء الدرس' : 'التالي'}
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
        /* تصميم شريط التمرير (Scrollbar) ليكون أنيقاً ومتماشياً مع التصميم */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.8); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(96, 165, 250, 0.8); 
        }
      `}} />
        </div>
    );
}