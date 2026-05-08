/**
 * Luminova Edu — Interactive Lesson: Chapter One
 * ================================================
 * ARCHITECTURE: This file is dynamically compiled at runtime by the Luminova
 * SmartWrapper using Babel Standalone. DO NOT use import/export statements.
 * React, useState, and all lucide-react icons (CheckCircle2, XCircle, etc.)
 * are injected into scope globally by the SmartWrapper before compilation.
 */

const ChapterOneLesson = ({ onExit = () => console.log("Exit clicked") }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // تم تفريغ كافة محتويات الصور بدقة في هذه المصفوفة
    const lessonData = [
        {
            type: 'intro',
            title: 'الفصل الأول: المعلومات المصورة ومعايير تصميمها',
            subtitle: 'ما هي المعلومات المصورة (Infographic)؟',
            content: 'يتكون الإنفوجرافيك من مقطعين: Information (معلومات) و Graphic (رسومات). يُطلق عليه أيضاً التصاميم المعلوماتية (Information Design) والبيانات التصويرية التفاعلية (Data Visualization).',
            icon: <Lightbulb className="w-24 h-24 text-yellow-400 mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
        },
        {
            type: 'content',
            title: 'مفهوم المعلومات المصورة',
            icon: <PieChart className="w-12 h-12 text-cyan-400 mb-4" />,
            sections: [
                {
                    title: 'ما هو؟',
                    text: 'هو مخطط رسومي يتكون من مجموعة من الصور، والبيانات (مثل المخططات الدائرية والرسوم الشريطية)، مع وجود عدد قليل من الكلمات.'
                },
                {
                    title: 'الهدف منه',
                    text: 'يوفر نظرة عامة سهلة الفهم عن موضوع ما. ببساطة هو "تمثيل مرئي للمعلومات والبيانات".'
                },
                {
                    title: 'أهميته',
                    text: 'يجمع بين عناصر الصورة النصية والرسم البياني. ويُعد أداة فعالة (مثل مقاطع الفيديو) لعرض البيانات وشرح المشكلات المعقدة بطريقة تؤدي بسرعة إلى الفهم الأفضل.'
                }
            ]
        },
        {
            type: 'quiz',
            title: 'سؤال تفاعلي 🧠',
            question: 'أي من المصطلحات التالية يُطلق أيضاً على الإنفوجرافيك؟',
            options: [
                'التصاميم النصية المعقدة',
                'البيانات التصويرية التفاعلية (Data Visualization)',
                'الرسومات غير المنظمة'
            ],
            correctAnswer: 1,
            feedback: 'إجابة صحيحة! الإنفوجرافيك هو أداة لتحويل البيانات إلى تمثيل بصري تفاعلي.'
        },
        {
            type: 'content',
            title: 'استخدامات المعلومات المصورة',
            icon: <Target className="w-12 h-12 text-purple-400 mb-4" />,
            description: 'الإنفوجرافيك ممتع، جذاب، وسهل المشاركة. لديه فوائد لجميع صناع المحتوى:',
            bullets: [
                'للمسوقين: جذب المزيد من حركة الزوار على الموقع، زيادة الرؤية والوعي بالعلامة التجارية، وتعزيز المشاركة.',
                'للمعلمين والمدربين: شرح المفاهيم الصعبة أو تحليل المعلومات المعقدة لتسهيل فهمها.',
                'للمنظمات غير الربحية: نشر الوعي حول قضية اجتماعية معينة.'
            ]
        },
        {
            type: 'content',
            title: 'نصائح لإنشاء معلومات مصورة بشكل صحيح',
            icon: <ListChecks className="w-12 h-12 text-green-400 mb-4" />,
            bullets: [
                'التركيز على الجمهور المستهدف والرسالة الأساسية.',
                'البدء بعنوان قوي: (أثبتت دراسة في معهد ماساتشوستس للتكنولوجيا أن العناوين الجيدة هي مفتاح الاحتفاظ بالجمهور وتجعلهم فضوليين).',
                'التوازن: الوظيفة الأولى هي إظهار البيانات، لذا يجب تحقيق التوازن بين الرسوم البيانية والعناصر المرئية.',
                'البساطة: هي الشيء الأساسي! إذا لم تعرف كيف تصممه بشكل معقد، فأفضل نصيحة هي إبقاؤه بسيطاً لعدم إجهاد القارئ.'
            ]
        },
        {
            type: 'content',
            title: 'أنواع المعلومات المصورة',
            icon: <Layers className="w-12 h-12 text-cyan-400 mb-4" />,
            sections: [
                { title: 'الإحصائية', text: 'تستخدم الرسوم البيانية الإحصائية لتقديم الأبحاث والحقائق والأرقام بطريقة مرئية.' },
                { title: 'العملية', text: 'تستخدم المخططات الانسيابية لتوجيه القراء خلال سلسلة خطوات أو لتبسيط عملية اتخاذ القرار.' },
                { title: 'الزمنية', text: 'مفيدة لعرض المعلومات بترتيب زمني (مثل سجل علامة تجارية أو تطور شيء بمرور الوقت).' },
                { title: 'التشريحية', text: 'تساعد في إبراز وشرح المكونات وأجزاء المنتج وخصائصه.' },
                { title: 'الهرمية', text: 'تحتوي عادة على هرم للمساعدة في عرض مستويات مختلفة من المعلومات.' }
            ]
        },
        {
            type: 'quiz',
            title: 'تطبيق عملي 🎯',
            question: 'إذا أردت شرح "خطوات التسجيل في المنصة التعليمية"، ما هو أفضل نوع إنفوجرافيك تستخدمه؟',
            options: [
                'الإنفوجرافيك الإحصائي',
                'الإنفوجرافيك العملي (المخططات الانسيابية)',
                'الإنفوجرافيك التشريحي'
            ],
            correctAnswer: 1,
            feedback: 'ممتاز! الإنفوجرافيك العملي هو الأنسب لشرح تسلسل الخطوات والإجراءات.'
        },
        {
            type: 'content',
            title: 'معايير تصميم الرسوم - (الشكل والوضوح)',
            icon: <Eye className="w-12 h-12 text-blue-400 mb-4" />,
            sections: [
                {
                    title: 'أولاً: الشكل',
                    text: 'هو المنظر الخارجي المحدد بحدود، ويتغير منظوره (أمامي، جانبي، أعلى، أسفل). يجب أن يكون الرسم في "منطقة الأمان" بترك هامش (2 إلى 2.5 سم) في الحواف حتى لا تصل لمجال الرؤية.'
                },
                {
                    title: 'ثانياً: الوضوح',
                    text: 'أن تكون العناصر والكتابة واضحة بخط كبير يتناسب مع الرسم. مساحة الرسم يجب ألا تقل عن 1/4 مساحة اللوحة.'
                },
                {
                    title: 'التركيز',
                    text: 'تركز الصورة على فكرة واحدة فقط، وتُستبعد التفاصيل غير الملائمة المشتتة للانتباه. وإذا لزم الأمر، تُقسم لأكثر من صورة.'
                }
            ]
        },
        {
            type: 'content',
            title: 'معايير التصميم - (التركيب والتنظيم)',
            icon: <Layout className="w-12 h-12 text-pink-400 mb-4" />,
            sections: [
                {
                    title: 'رابعاً: التركيب',
                    text: 'ترتيب العناصر لجذب الانتباه. في الثقافة العربية منطقة جذب الانتباه تبدأ من (أعلى اليمين، ثم الأسفل، ثم المركز). يمكن استخدام الأسهم والخطوط والألوان لذلك.'
                },
                {
                    title: 'خامساً: التناسق',
                    text: 'تناسق وانسجام الألوان بين جميع عناصر الصورة لتأكيد الأفكار الأساسية.'
                },
                {
                    title: 'سادساً: التنظيم أو الترتيب',
                    text: 'ترتيب العناصر بطريقة منطقية تساعد على تتبع الفكرة (مثل استخدام الأسهم في دورة حياة الفراشة).'
                }
            ]
        },
        {
            type: 'content',
            title: 'معايير التصميم - (التوازن)',
            icon: <Scale className="w-12 h-12 text-orange-400 mb-4" />,
            description: 'سابعاً التوازن: توزيع العناصر بشكل متوازن يُشعر المشاهد بالراحة.',
            bullets: [
                'التوازن النمطي: يعطي إحساساً بالثبات.',
                'التوازن غير النمطي: يسمح بالابتكار وفيه حيوية أكبر.',
                'قاعدة هامة: وضع العناصر المترابطة بشكل متجاور لتُدرك ككتلة واحدة (لتكوين الفكرة الكلية)، والعناصر غير المترابطة توضع متباعدة ليُسهل إدراكها كعناصر مستقلة.'
            ]
        },
        {
            type: 'content',
            title: 'معايير التصميم - (الألوان والتباين)',
            icon: <Palette className="w-12 h-12 text-indigo-400 mb-4" />,
            sections: [
                {
                    title: 'تاسعاً: توظيف الألوان',
                    text: 'تعبر بشكل صحيح عن الفكرة. تنقسم إلى:\n1. ألوان أساسية (أحمر، أصفر، أزرق).\n2. ألوان ثانوية: دمج لونين أساسيين (أحمر+أزرق=بنفسجي/أرجواني، أصفر+أزرق=أخضر، أحمر+أصفر=برتقالي).\n3. ألوان هجينة: دمج أساسي مع ثانوي.'
                },
                {
                    title: 'عاشراً: التباين',
                    text: '(الشكل والأرضية) يقصد بها وضع عناصر الصورة بشكل واضح. ويكون التباين بين العناصر وبعضها، أو بين الشكل والأرضية (الخلفية).'
                }
            ]
        },
        {
            type: 'quiz',
            title: 'السؤال الأخير للتأكيد 🏆',
            question: 'حسب الثقافة العربية ومعيار "التركيب"، أين تقع منطقة جذب الانتباه الأولى للمشاهد؟',
            options: [
                'في المركز (المنتصف) مباشرة',
                'أعلى اليسار',
                'أعلى اليمين'
            ],
            correctAnswer: 2,
            feedback: 'رائع جداً! بسبب اتجاه القراءة باللغة العربية، تنجذب العين دائماً لأعلى اليمين أولاً.'
        },
        {
            type: 'completion',
            title: 'أكملت الفصل الأول بنجاح! 🎉',
            content: 'لقد أتممت دراسة كل ما يخص المعلومات المصورة ومعايير تصميمها الاحترافية.',
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
        } else {
            if (onExit) onExit();
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

    // حساب عدد الأسئلة الإجمالي لمعرفة الدرجة النهائية
    const totalQuizzes = lessonData.filter(s => s.type === 'quiz').length;

    return (
        <div className="w-full min-h-screen bg-[#0a0f1c] text-white flex items-center justify-center p-4 sm:p-8 font-sans overflow-hidden" dir="rtl">

            {/* دوائر إضاءة في الخلفية لتعزيز تأثير الـ Neon */}
            <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>

            {/* الحاوية الزجاجية الرئيسية */}
            <div className="relative z-10 w-full max-w-5xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl p-6 sm:p-10 flex flex-col min-h-[70vh] transition-all duration-500">

                {/* شريط التقدم وزر الخروج */}
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                    <button
                        onClick={onExit}
                        className="flex items-center gap-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 px-5 py-2.5 rounded-xl text-sm font-bold border border-white/5 transition-all"
                    >
                        <LogOut className="w-4 h-4" /> إنهاء الدرس
                    </button>

                    <div className="flex-1 mr-8 ml-4">
                        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-l from-cyan-400 via-blue-500 to-purple-600 transition-all duration-700 ease-out relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-white/40 text-xs mt-2 font-medium">
                            <span>البداية</span>
                            <span>شريحة {currentSlide + 1} من {lessonData.length}</span>
                        </div>
                    </div>
                </div>

                {/* مساحة العرض المتغيرة */}
                <div className="flex-1 flex flex-col justify-center items-center w-full animate-fade-in-up" key={currentSlide}>

                    {/* تصميم شريحة المقدمة */}
                    {slide.type === 'intro' && (
                        <div className="text-center flex flex-col items-center">
                            {slide.icon}
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-cyan-300 to-purple-400 mb-6 leading-tight">
                                {slide.title}
                            </h1>
                            <h2 className="text-2xl text-cyan-100 mb-6 font-medium bg-white/5 px-6 py-2 rounded-full border border-white/10">{slide.subtitle}</h2>
                            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">{slide.content}</p>
                        </div>
                    )}

                    {/* تصميم شريحة المحتوى (نصوص وأقسام) */}
                    {slide.type === 'content' && (
                        <div className="w-full flex flex-col items-center">
                            <div className="flex items-center gap-4 mb-8">
                                {slide.icon}
                                <h2 className="text-3xl font-bold text-white drop-shadow-md">{slide.title}</h2>
                            </div>

                            {slide.description && (
                                <p className="text-xl text-cyan-200 mb-6 text-center">{slide.description}</p>
                            )}

                            {/* عرض الأقسام إن وجدت (كروت شبكية) */}
                            {slide.sections && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    {slide.sections.map((sec, idx) => (
                                        <div key={idx} className={`bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all ${slide.sections.length % 2 !== 0 && idx === slide.sections.length - 1 ? 'md:col-span-2' : ''}`}>
                                            <h3 className="text-lg font-bold text-cyan-300 mb-2 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,1)]"></div>
                                                {sec.title}
                                            </h3>
                                            <p className="text-white/80 leading-relaxed text-sm whitespace-pre-line">{sec.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* عرض النقاط إن وجدت (قائمة) */}
                            {slide.bullets && (
                                <div className="flex flex-col gap-3 w-full max-w-4xl">
                                    {slide.bullets.map((bullet, idx) => (
                                        <div key={idx} className="flex items-start gap-4 bg-gradient-to-r from-white/5 to-transparent p-4 rounded-xl border-r-4 border-cyan-500">
                                            <div className="mt-1.5 min-w-[8px] h-[8px] rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                                            <p className="text-white/85 text-lg leading-relaxed">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* تصميم شريحة الأسئلة */}
                    {slide.type === 'quiz' && (
                        <div className="flex flex-col items-center w-full max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm font-bold mb-8 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                <Activity className="w-4 h-4" /> {slide.title}
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 leading-relaxed text-center">
                                {slide.question}
                            </h2>

                            <div className="flex flex-col gap-4 w-full">
                                {slide.options.map((option, idx) => {
                                    let btnStateClass = "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/30 hover:scale-[1.01]";
                                    let icon = <div className="w-6 h-6 rounded-full border border-white/20 flex-shrink-0"></div>;

                                    if (isAnswered) {
                                        if (idx === slide.correctAnswer) {
                                            btnStateClass = "bg-green-500/20 border-green-500/50 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] scale-[1.02]";
                                            icon = <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />;
                                        } else if (idx === selectedAnswer) {
                                            btnStateClass = "bg-red-500/20 border-red-500/50 text-red-300";
                                            icon = <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />;
                                        } else {
                                            btnStateClass = "bg-white/5 border-white/5 text-white/30 opacity-50";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            disabled={isAnswered}
                                            className={`relative w-full text-right p-5 rounded-2xl border transition-all duration-300 flex justify-between items-center text-lg shadow-lg ${btnStateClass}`}
                                        >
                                            <span className="pl-4">{option}</span>
                                            {icon}
                                        </button>
                                    );
                                })}
                            </div>

                            {isAnswered && (
                                <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-100 text-lg font-medium animate-fade-in w-full text-center shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                                    {slide.feedback}
                                </div>
                            )}
                        </div>
                    )}

                    {/* تصميم شريحة النهاية */}
                    {slide.type === 'completion' && (
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-green-500/30 rounded-full blur-[40px] animate-pulse"></div>
                                <CheckCircle2 className="w-32 h-32 text-green-400 relative z-10 drop-shadow-[0_0_15px_rgba(74,222,128,1)]" />
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 drop-shadow-lg">{slide.title}</h1>
                            <p className="text-xl text-white/70 mb-10 max-w-lg">{slide.content}</p>

                            <div className="bg-white/5 border border-white/10 px-10 py-6 rounded-3xl backdrop-blur-md shadow-2xl">
                                <p className="text-white/60 mb-2">نتيجتك في التقييم التفاعلي</p>
                                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                                    {score} <span className="text-2xl text-white/40">من</span> {totalQuizzes}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* أزرار التحكم السفلية */}
                <div className="mt-10 flex justify-between items-center pt-6 border-t border-white/10">
                    <button
                        onClick={handlePrev}
                        disabled={currentSlide === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${currentSlide === 0
                                ? 'opacity-0 pointer-events-none'
                                : 'text-white/80 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                            }`}
                    >
                        <ChevronRight className="w-5 h-5" /> السابق
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={slide.type === 'quiz' && !isAnswered}
                        className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-lg transition-all duration-300 ${slide.type === 'quiz' && !isAnswered
                                ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-white/5'
                                : 'bg-gradient-to-l from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:scale-105 border border-cyan-400/50'
                            }`}
                    >
                        {currentSlide === lessonData.length - 1 ? 'إنهاء الدرس والعودة' : 'التالي'}
                        {currentSlide !== lessonData.length - 1 && <ChevronLeft className="w-6 h-6" />}
                    </button>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
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
};

