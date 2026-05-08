import React, { useState } from 'react';
import {
    CheckCircle2, XCircle, ChevronRight, ChevronLeft,
    LogOut, Lightbulb, Brain, Eye, Layers,
    BarChart, Target, ShieldCheck, AlertTriangle,
    Video, Image as ImageIcon, MonitorPlay, ListOrdered
} from 'lucide-react';

export default function App() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // تم استخراج المحتوى حرفياً وتنسيقه ليتناسب مع العرض التفاعلي
    const lessonData = [
        {
            type: 'intro',
            title: 'الفصل الثاني: الرسم المعلوماتي (الانفوجرافيك)',
            subtitle: 'محتوى شامل ومفصل',
            content: 'مصطلح تعليمي وتسويقي يشير إلى توظيف العنصر المرئي (Graphic) لتوضيح المعلومات (Information) وتوصيلها بأسلوب واضح ومبسط وجذاب. هل أنت مستعد للغوص في عالم الإنفوجرافيك؟',
            icon: <MonitorPlay className="w-24 h-24 text-cyan-400 mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
        },
        {
            type: 'stats',
            title: 'لماذا التعلم البصري؟ (إحصائيات وحقائق)',
            content: 'التعلم البصري هو التركيز على استخدام حاسة البصر أكثر من غيرها. إليك هذه الحقائق المذهلة من أبحاث الدماغ:',
            stats: [
                { num: '60,000x', text: 'العقل يعالج الصور أسرع بـ 60 ألف مرة من النص', color: 'text-cyan-400' },
                { num: '90%', text: 'من المعلومات التي تنتقل للمخ مصورة', color: 'text-purple-400' },
                { num: '70%', text: 'من اعتماد البشر يكون على حاسة الإبصار', color: 'text-pink-400' },
                { num: '1/10', text: 'من الثانية يكفي لالتقاط العين للصورة', color: 'text-yellow-400' }
            ]
        },
        {
            type: 'pyramid',
            title: 'هرم التعلم وتذكر المعلومات',
            content: 'دلت الدراسات أننا نتعلم: 83% بالبصر، 11% بالسمع، 3.5% بالشم، 1.5% باللمس، 1% بالذوق. ولكن ماذا نتذكر؟',
            items: [
                { percentage: '10%', text: 'مما نقرأه', width: 'w-1/5', bg: 'bg-red-500' },
                { percentage: '20%', text: 'مما نسمعه', width: 'w-2/5', bg: 'bg-orange-500' },
                { percentage: '30%', text: 'مما نراه', width: 'w-3/5', bg: 'bg-yellow-500' },
                { percentage: '50%', text: 'مما نفعله', width: 'w-4/5', bg: 'bg-green-500' },
                { percentage: '80%', text: 'مما نقوله', width: 'w-11/12', bg: 'bg-cyan-500' },
                { percentage: '90%', text: 'مما نقوله ونفعله في آن واحد', width: 'w-full', bg: 'bg-purple-500' },
            ]
        },
        {
            type: 'content-grid',
            title: 'مكونات وخصائص الإنفوجرافيك',
            icon: <Layers className="w-12 h-12 text-blue-400 mb-4" />,
            cards: [
                { title: 'المكونات الثلاثة', text: '1. العنصر البصري (خطوط، ألوان، أشكال).\n2. المحتوى النصي (موجز ومرتبط).\n3. المعرفة (طريقة التقديم لضمان الفهم).' },
                { title: 'الترميز والاختصار', text: 'تحويل المعلومات لرموز بصرية، واختزال صفحات عديدة في تصميم واحد يسهل استيعابه.' },
                { title: 'التداول والانتشار', text: 'سريع الفهم وقابل للمشاركة عبر شبكات التواصل، مما يزيد الوعي والزوار.' },
                { title: 'القدرة الإثرائية', text: 'إمكانية إضافة روابط، مراجع، وكتب للاستزادة حول الموضوع.' }
            ]
        },
        {
            type: 'quiz',
            title: 'اختبر تركيزك 🎯',
            question: 'وفقاً لنظريات التعلم، ما هي النسبة التي يتذكرها الإنسان مما "يقوله ويفعله في آن واحد"؟',
            options: ['30%', '50%', '90%', '10%'],
            correctAnswer: 2,
            feedback: 'صحيح! المشاركة الفعالة (القول والفعل) ترفع نسبة التذكر إلى 90%.'
        },
        {
            type: 'content-grid',
            title: 'أنواع الإنفوجرافيك (من حيث العرض والبعد)',
            icon: <MonitorPlay className="w-12 h-12 text-indigo-400 mb-4" />,
            cards: [
                { title: '1. الثابت (Static)', text: 'الأكثر انتشاراً، يقتصر نشاط المستخدم على القراءة. أنواعه: (مصمت، قابل للنقر، أفقي للأحداث التاريخية، رأسي وهو الأنسب للويب).' },
                { title: '2. المتحرك (Motion)', text: 'إما (فيديو عادي داخله إنفوجرافيك) يحتاج لمخرج ومصور، أو (موشن جرافيك كامل) تصميم متحرك بالكامل بسيناريو.' },
                { title: '3. التفاعلي (Interactive)', text: 'يتحكم فيه المشاهد عن طريق أزرار وبرمجة موضوعة داخل التصميم.' },
                { title: 'من حيث البعد', text: 'إما ثنائي الأبعاد (2D) يعتمد على الإيحاء بالعمق، أو ثلاثي الأبعاد (3D) يعتمد على إحداثيات (x,y,z) ويمكن تدويره.' }
            ]
        },
        {
            type: 'content-grid',
            title: 'أنواع الإنفوجرافيك (من حيث الغرض)',
            icon: <Target className="w-12 h-12 text-pink-400 mb-4" />,
            cards: [
                { title: 'الاستقصائي', text: 'عرض كم كبير من الحقائق بالتفصيل (يتدرج من العام للخاص)، ينتهي بنصيحة وتكثر فيه الألوان والرسوم البيانية.' },
                { title: 'التفسيري', text: 'يشبه الاستقصائي ولكنه يقدم "تفسيراً أعمق" للمخططات البيانية بصورة مستفيضة.' },
                { title: 'الحواري / النقاشي', text: 'يعطي فكرة عامة في نقاط مختصرة دون تفاصيل معقدة، وينتهي بتوجيه لمنتج أو بديل أنسب.' },
                { title: 'الدعائي والعلاقات العامة', text: 'الدعائي: يروج لمنتج ويقارنه بالمنافسين.\nالعلاقات العامة: يركز على قضايا وحملات إنسانية ويعتمد على الصور أكثر من النص ليبقى في الذاكرة.' }
            ]
        },
        {
            type: 'comparison',
            title: 'مفاهيم: جرافيك أم إنفوجرافيك أم موشن؟',
            items: [
                { name: 'الجرافيك', desc: 'أي شكل أو رمز لتوضيح أمر محدد. لا يشرح تفاصيل.', icon: <ImageIcon className="w-10 h-10 text-gray-400" /> },
                { name: 'الإنفوجرافيك', desc: 'مزيج (صور + نصوص + رسوم بيانية) في قالب صامت لتقديم معلومات تفصيلية عن موضوع.', icon: <BarChart className="w-10 h-10 text-cyan-400" /> },
                { name: 'الموشن جرافيك', desc: 'الإنفوجرافيك ذاته ولكن مضاف إليه (حركة + صوت/موسيقى) في فيديو.', icon: <Video className="w-10 h-10 text-purple-400" /> }
            ]
        },
        {
            type: 'quiz',
            title: 'سؤال للتمييز 🧐',
            question: 'أي نوع من الإنفوجرافيك يُفضل استخدامه لعرض وتسلسل الأحداث والوقائع التاريخية؟',
            options: ['الإنفوجرافيك الثابت الأفقي', 'الإنفوجرافيك الدعائي', 'الإنفوجرافيك الثابت الرأسي'],
            correctAnswer: 0,
            feedback: 'ممتاز! الإنفوجرافيك الأفقي يعطي مساحة عرضية مناسبة جداً لترتيب الخطوط الزمنية (Timelines).'
        },
        {
            type: 'theory',
            title: 'الأسس النظريـة للإنفوجرافيك (أبحاث الدماغ)',
            content: 'تعتمد قوة الإنفوجرافيك على نظريات علم النفس وعمليات التفكير البصري:',
            theories: [
                { name: '1. نظرية الجشطالت', desc: 'كيف ينظم الدماغ المعلومات لإنشاء معنى متكامل (قانون القرب، الشبه، الإغلاق).' },
                { name: '2. النظرية البنائية', desc: 'المعرفة لا تُنقل بسلبية، بل تُبنى بنشاط (الاستكشاف والتفاعل).' },
                { name: '3. معالجة المعلومات', desc: 'تشرح كيف يعالج الدماغ ويخزن في الذاكرة (تُطبق بتبسيط المعلومات المعقدة).' },
                { name: '4. التعلم البصري', desc: 'الصور تساعد على الفهم والتذكر أكثر من أي حاسة أخرى.' }
            ]
        },
        {
            type: 'pros-cons',
            title: 'مميزات وعيوب الإنفوجرافيك',
            pros: [
                'سهل الفهم والتذكر ولا يحتمل التأويل الخاطئ.',
                'جاذبية بصرية وقابلية عالية للمشاركة.',
                'يغطي كافة المجالات.',
                'يختصر وقت التعلم ويستبعد التفاصيل غير الضرورية.'
            ],
            cons: [
                'يستهلك الكثير من الوقت لجمع وصياغة المعلومات بدقة.',
                'تكلفة إضافية لتوظيف مصممين محترفين.',
                'هامش واسع لعدم النجاح إذا كان التصميم أو التسويق سيئاً.'
            ]
        },
        {
            type: 'steps',
            title: 'خطوات تصميم إنفوجرافيك احترافي',
            steps: [
                { num: 1, text: 'تحديد الهدف', sub: 'ما الذي تريد تحقيقه؟' },
                { num: 2, text: 'الجمهور المستهدف', sub: 'تحديد الألوان والأسلوب.' },
                { num: 3, text: 'جمع المعلومات', sub: 'صحيحة، دقيقة، ومفيدة.' },
                { num: 4, text: 'رسم المسودة', sub: 'توزيع كروكي على الورق.' },
                { num: 5, text: 'اختيار العناصر', sub: 'الألوان والخطوط.' },
                { num: 6, text: 'التنفيذ بالبرامج', sub: 'استخدام برامج التصميم.' }
            ]
        },
        {
            type: 'quiz',
            title: 'سؤال أخير للعباقرة 🏆',
            question: 'حسب نظرية الجشطالت، تصميم إنفوجرافيك يضع العناصر المرتبطة ببعضها في مساحات متقاربة يعتمد على قانون:',
            options: ['قانون الاستمرارية', 'قانون الإغلاق', 'قانون القرب'],
            correctAnswer: 2,
            feedback: 'أنت رائع! قانون القرب (Proximity) يجعل العين تدرك العناصر المتقاربة ككتلة معلوماتية واحدة.'
        },
        {
            type: 'completion',
            title: 'لقد أنهيت الفصل الثاني بتفوق! 🎉',
            content: 'الآن أصبحت تملك فهماً شاملاً وعميقاً لكل ما يخص الإنفوجرافيك، أنواعه، أسسه النفسية، وخطوات تصميمه.',
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
            console.log("تم ضغط زر الخروج / الإنهاء");
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
        <div className="w-full min-h-screen bg-[#070b14] text-white flex items-center justify-center p-4 sm:p-8 font-sans overflow-hidden" dir="rtl">

            {/* Background Gradients */}
            <div className="fixed top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none"></div>
            <div className="fixed bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none"></div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-6xl bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-3xl p-6 sm:p-10 flex flex-col min-h-[80vh] transition-all duration-500">

                {/* Header Controls */}
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                    <button onClick={() => console.log('Exit')} className="flex items-center gap-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 px-5 py-2.5 rounded-xl text-sm font-bold border border-transparent hover:border-red-500/30 transition-all">
                        <LogOut className="w-4 h-4" /> خروج
                    </button>

                    <div className="flex-1 mr-8 ml-4">
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner relative">
                            <div
                                className="h-full bg-gradient-to-l from-cyan-400 via-blue-500 to-purple-600 transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-white/40 text-xs mt-2 font-medium">
                            <span>الفصل الثاني</span>
                            <span>شريحة {currentSlide + 1} من {lessonData.length}</span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-center items-center w-full animate-fade-in-up" key={currentSlide}>

                    {/* Intro Slide */}
                    {slide.type === 'intro' && (
                        <div className="text-center flex flex-col items-center max-w-3xl">
                            {slide.icon}
                            <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-cyan-300 to-indigo-400 mb-6 leading-tight">
                                {slide.title}
                            </h1>
                            <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-8">
                                <h2 className="text-xl text-cyan-200 font-medium">{slide.subtitle}</h2>
                            </div>
                            <p className="text-xl text-white/70 leading-relaxed bg-[#0a0f1c]/50 p-6 rounded-2xl border border-white/5">{slide.content}</p>
                        </div>
                    )}

                    {/* Statistics Visual Slide */}
                    {slide.type === 'stats' && (
                        <div className="w-full flex flex-col items-center">
                            <h2 className="text-3xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-lg text-cyan-200 mb-10 text-center max-w-2xl">{slide.content}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                                {slide.stats.map((stat, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all hover:-translate-y-2 group">
                                        <div className={`text-4xl sm:text-5xl font-black ${stat.color} mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform`}>
                                            {stat.num}
                                        </div>
                                        <p className="text-white/80 font-medium">{stat.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Custom Pyramid/Bars Slide */}
                    {slide.type === 'pyramid' && (
                        <div className="w-full flex flex-col items-center max-w-4xl">
                            <h2 className="text-3xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-lg text-white/60 mb-10 text-center">{slide.content}</p>

                            <div className="w-full flex flex-col gap-3">
                                {slide.items.map((item, idx) => (
                                    <div key={idx} className="w-full flex items-center gap-4">
                                        <div className="w-16 text-left font-bold text-cyan-300">{item.percentage}</div>
                                        <div className="flex-1 h-12 bg-white/5 rounded-r-full rounded-l-md overflow-hidden relative border border-white/5">
                                            <div className={`absolute right-0 top-0 bottom-0 ${item.width} ${item.bg} opacity-80 flex items-center px-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                                                <span className="text-white font-bold text-sm whitespace-nowrap z-10">{item.text}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cards Grid Slide */}
                    {slide.type === 'content-grid' && (
                        <div className="w-full flex flex-col items-center">
                            {slide.icon}
                            <h2 className="text-3xl font-bold text-white mb-8">{slide.title}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                                {slide.cards.map((card, idx) => (
                                    <div key={idx} className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-6 rounded-2xl hover:border-cyan-500/50 transition-all">
                                        <h3 className="text-xl font-bold text-cyan-300 mb-3 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                            {card.title}
                                        </h3>
                                        <p className="text-white/70 leading-relaxed whitespace-pre-line">{card.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comparison Slide */}
                    {slide.type === 'comparison' && (
                        <div className="w-full flex flex-col items-center">
                            <h2 className="text-3xl font-bold text-white mb-10">{slide.title}</h2>
                            <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                                {slide.items.map((item, idx) => (
                                    <div key={idx} className="flex-1 bg-[#162032] border border-white/10 p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group hover:border-white/30 transition-all">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                                        {item.icon}
                                        <h3 className="text-2xl font-bold text-white mt-6 mb-4">{item.name}</h3>
                                        <p className="text-white/60 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Theory / Accordion style visually */}
                    {slide.type === 'theory' && (
                        <div className="w-full flex flex-col items-center max-w-4xl">
                            <Brain className="w-12 h-12 text-pink-400 mb-4" />
                            <h2 className="text-3xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-lg text-white/60 mb-8 text-center">{slide.content}</p>
                            <div className="flex flex-col gap-4 w-full">
                                {slide.theories.map((theory, idx) => (
                                    <div key={idx} className="flex gap-6 bg-white/5 p-5 rounded-2xl border border-white/5 items-center hover:bg-white/10 transition-colors">
                                        <div className="text-4xl font-black text-white/10">{idx + 1}</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-pink-300 mb-2">{theory.name}</h3>
                                            <p className="text-white/70">{theory.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pros and Cons Slide */}
                    {slide.type === 'pros-cons' && (
                        <div className="w-full flex flex-col items-center">
                            <h2 className="text-3xl font-bold text-white mb-10">{slide.title}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                                {/* Pros */}
                                <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-green-500/20 rounded-xl"><CheckCircle2 className="w-8 h-8 text-green-400" /></div>
                                        <h3 className="text-2xl font-bold text-green-400">الإيجابيات والمميزات</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {slide.pros.map((pro, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-white/80">
                                                <div className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                                <span>{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Cons */}
                                <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-red-500/20 rounded-xl"><AlertTriangle className="w-8 h-8 text-red-400" /></div>
                                        <h3 className="text-2xl font-bold text-red-400">السلبيات والعقبات</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {slide.cons.map((con, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-white/80">
                                                <div className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                                                <span>{con}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Process Steps Slide */}
                    {slide.type === 'steps' && (
                        <div className="w-full flex flex-col items-center">
                            <ListOrdered className="w-12 h-12 text-yellow-400 mb-4" />
                            <h2 className="text-3xl font-bold text-white mb-10">{slide.title}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                                {slide.steps.map((step, idx) => (
                                    <div key={idx} className="relative bg-[#162032] border border-white/10 p-6 rounded-2xl pt-10 mt-6 hover:border-yellow-500/30 transition-all">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl font-bold text-white shadow-[0_0_15px_rgba(250,204,21,0.5)] border-4 border-[#070b14]">
                                            {step.num}
                                        </div>
                                        <h3 className="text-xl font-bold text-center text-white mb-3">{step.text}</h3>
                                        <p className="text-center text-white/60 text-sm leading-relaxed">{step.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quiz Slide */}
                    {slide.type === 'quiz' && (
                        <div className="flex flex-col items-center w-full max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-sm font-bold mb-8 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                <Brain className="w-4 h-4" /> {slide.title}
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 leading-relaxed text-center">
                                {slide.question}
                            </h2>
                            <div className="flex flex-col gap-4 w-full">
                                {slide.options.map((option, idx) => {
                                    let btnStateClass = "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/30";
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
                                            className={`relative w-full text-right p-5 rounded-2xl border transition-all duration-300 flex justify-between items-center text-lg ${btnStateClass}`}
                                        >
                                            <span className="pl-4">{option}</span>
                                            {icon}
                                        </button>
                                    );
                                })}
                            </div>

                            {isAnswered && (
                                <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-transparent border-r-4 border-cyan-500 text-cyan-100 text-lg font-medium animate-fade-in w-full shadow-[0_0_20px_rgba(34,211,238,0.05)]">
                                    {slide.feedback}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Completion Slide */}
                    {slide.type === 'completion' && (
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-[50px] animate-pulse"></div>
                                <CheckCircle2 className="w-32 h-32 text-cyan-400 relative z-10 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]" />
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">{slide.title}</h1>
                            <p className="text-xl text-white/70 mb-10 max-w-lg">{slide.content}</p>

                            <div className="bg-[#162032] border border-white/10 px-12 py-8 rounded-3xl shadow-2xl">
                                <p className="text-white/60 mb-3 text-lg">نتيجتك في التقييم التفاعلي</p>
                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                                    {score} <span className="text-2xl text-white/40">من</span> {totalQuizzes}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Navigation Controls */}
                <div className="mt-10 flex justify-between items-center pt-6 border-t border-white/10">
                    <button
                        onClick={handlePrev}
                        disabled={currentSlide === 0}
                        className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 ${currentSlide === 0
                                ? 'opacity-0 pointer-events-none'
                                : 'text-white/70 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                    >
                        <ChevronRight className="w-5 h-5" /> الشريحة السابقة
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={slide.type === 'quiz' && !isAnswered}
                        className={`flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${slide.type === 'quiz' && !isAnswered
                                ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-white/5'
                                : 'bg-gradient-to-l from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-[1.02] border border-cyan-400/50'
                            }`}
                    >
                        {currentSlide === lessonData.length - 1 ? 'إنهاء الدرس التفاعلي' : 'التالي'}
                        {currentSlide !== lessonData.length - 1 && <ChevronLeft className="w-6 h-6" />}
                    </button>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
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
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}} />
        </div>
    );
}