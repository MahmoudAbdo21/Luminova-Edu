import React, { useState } from 'react';
import {
    CheckCircle2, XCircle, ChevronRight, ChevronLeft,
    LogOut, PlayCircle, Video, Layers,
    Lightbulb, BrainCircuit, Target, Sparkles,
    Settings, PenTool, MonitorPlay, Film,
    Clapperboard, CheckSquare, Presentation,
    Wand2, Music, Shuffle, Move3d, Images
} from 'lucide-react';

export default function App() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // تم استخراج المنهج الأكاديمي كاملاً بدقة وعمق
    const lessonData = [
        {
            type: 'intro',
            title: 'الفصل الرابع: الإنفوجرافيك المتحرك',
            subtitle: 'الرسومات النابضة بالحياة',
            content: 'الإنفوجرافيك المتحرك (Motion Graphics) هو فن دمج الرسومات، البيانات، الأصوات، والحركة لإيصال المعلومات المعقدة بطريقة مبسطة ومرئية جذابة. إنه يجمع بين "قوة التصميم الجرافيكي" و"سلاسة الفيديو" لخلق تجربة مشاهدة ممتعة وتفاعلية تسهل الاستيعاب السريع للبيانات.',
            icon: <PlayCircle className="w-24 h-24 text-purple-400 mb-6 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
        },
        {
            type: 'detailed-list',
            title: 'أساليب الإنفوجرافيك المتحرك',
            icon: <MonitorPlay className="w-12 h-12 text-cyan-400 mb-4" />,
            description: 'ينقسم الإنفوجرافيك المتحرك إلى أسلوبين أساسيين في تصميمه وعرضه:',
            items: [
                { title: 'الرسومات المتحركة (Motion Graphic)', desc: 'تصميم بيانات وتوضيحات بشكل متحرك كامل. يتطلب إبداعاً في اختيار الحركات المعبرة وسيناريو كامل للإخراج. يحتاج لمصممين محترفين يستخدمون برامج متخصصة مثل After Effects.', icon: <Layers className="w-8 h-8 text-cyan-300" /> },
                { title: 'لقطات الفيديو (Video Based Infographic)', desc: 'الأكثر انتشاراً في الويب (باستخدام تقنيات HTML5, CSS3, JS). يعتمد على تصوير فيديو حي ثم يتم وضع البيانات والرسوم المتحركة التوضيحية فوقه لإظهار الحقائق والمفاهيم.', icon: <Film className="w-8 h-8 text-purple-300" /> }
            ]
        },
        {
            type: 'quiz',
            title: 'تطبيق المفاهيم 🧠',
            question: 'معلم علوم قام بتصوير تجربة كيميائية حقيقية بالكاميرا، ثم استخدم المونتاج لإضافة نصوص وأسهم متحركة تظهر فوق التفاعل. أي أسلوب استخدم؟',
            options: [
                'الرسومات المتحركة (Motion Graphic) بالكامل',
                'لقطات الفيديو (Video Based Infographic)',
                'التحريك ثنائي الأبعاد (2D Animation)'
            ],
            correctAnswer: 1,
            feedback: 'إجابة صحيحة! دمج تصوير حي (فيديو حقيقي) مع رسومات توضيحية مركبة فوقه هو جوهر أسلوب (Video Based).'
        },
        {
            type: 'grid',
            title: 'المزايا التعليمية الفعّالة',
            icon: <Sparkles className="w-12 h-12 text-pink-400 mb-4" />,
            description: 'لماذا يعتبر الإنفوجرافيك المتحرك أداة قوية في العملية التعليمية؟',
            items: [
                { title: 'ضغط الواقع وتبسيط المعقد', desc: 'يصغر المشكلات الكبيرة ويوضح المجردات المعقدة ليجعلها سهلة الفهم لغير المتخصصين.' },
                { title: 'جذب الانتباه ومنع الملل', desc: 'الحركة والتغيير المستمران يجعلان المشاهد منخرطاً تماماً في المحتوى.' },
                { title: 'ترسيخ قوة التذكر', desc: 'العقل البشري يتذكر الصور والحركات بشكل أفضل بكثير من النصوص بفضل الروابط البصرية.' },
                { title: 'توفير الوقت والجهد', desc: 'يختصر الكثير من وقت الشرح التقليدي الطويل للمفاهيم الصعبة.' },
                { title: 'تقديم أوصاف دقيقة', desc: 'يعرض مظاهر الأشياء عبر استعمال أشكال وملمس تماثل الأصل بدقة متناهية.' },
                { title: 'مراعاة الفروق الفردية', desc: 'يتيح التنوع والتجديد في الأنشطة مما يعالج الفروق الفردية بين الطلاب.' },
                { title: 'التحفيز والدافعية', desc: 'يستثير دافعية الطلاب ويحفزهم على التعلم بأسلوب مشوق.' },
                { title: 'تنمية الملاحظة والنقد', desc: 'يدرب حواس الطلاب وينشط التفكير النقدي وتنظيم الأفكار ومقارنتها.' }
            ]
        },
        {
            type: 'criteria',
            title: 'معايير تصميم الإنفوجرافيك المتحرك',
            icon: <CheckSquare className="w-12 h-12 text-teal-400 mb-4" />,
            content: 'للحصول على تصميم ناجح، يجب الالتزام بالقواعد الآتية:',
            list: [
                'التصور المبدئي (السيناريو): التخطيط الدقيق على الورق قبل بدء التنفيذ الفعلي على البرامج.',
                'العنوان الجذاب: اختيار عنوان ملفت للنظر ومعبر عن الفكرة الأساسية بوضوح.',
                'التركيز والإيجاز: التركيز على فكرة واحدة، والحد من كثرة البيانات وتداخلها لمنع التشتت.',
                'البساطة وتناسق الألوان: عدم الإسراف في الألوان المعقدة واستخدام خطوط مريحة للعين.',
                'المركز البصري: أن تنبع الفكرة من المنتصف لتسهيل تتبع حركة العناصر وقراءتها.',
                'الإبراز (Highlighting): استخدام التظليل وإبراز العناصر المهمة لتلخيص المحتوى.'
            ]
        },
        {
            type: 'techniques-grid',
            title: 'تقنيات أساسية في إنشاء الإنفوجرافيك المتحرك',
            icon: <Wand2 className="w-12 h-12 text-indigo-400 mb-4" />,
            description: 'يتم استخدام عدة تقنيات للتحريك لتحويل التصميم من ثابت إلى نابض بالحياة:',
            items: [
                { title: 'التحريك الكلاسيكي (Traditional)', desc: 'إنشاء كل إطار (Frame) بشكل فردي ثم عرضها بسرعة. عمل فني عالي الجودة لكنه يتطلب وقتاً وجهداً كبيراً جداً.' },
                { title: 'التحريك بالكمبيوتر (Computer)', desc: 'استخدام برامج الحاسوب لإنشاء الرسوم، مما يوفر مرونة وسرعة هائلة في الإنتاج.' },
                { title: 'التحريك الإطاري (Frame by Frame)', desc: 'يشبه التحريك الكلاسيكي خطوة بخطوة، ولكن يتم بشكل رقمي بالكامل.' },
                { title: 'التحريك البيني (Tweening)', desc: 'يتم إنشاء "إطارين رئيسيين" (Keyframes) البداية والنهاية، ويقوم البرنامج بملء الفراغ والحركة بينهما تلقائياً.' },
                { title: 'التحريك الشكلي (Morphing)', desc: 'تقنية بصرية يتم فيها تحويل شكل كائن إلى شكل آخر بسلاسة وانسيابية تامة.' },
                { title: 'تحريك 2D و 3D', desc: 'الـ 2D للرسوم المسطحة البسيطة، والـ 3D لإنشاء نماذج مجسمة في بيئة ثلاثية الأبعاد تعطي واقعية معقدة.' }
            ]
        },
        {
            type: 'quiz',
            title: 'اختبر استيعابك للتقنيات 🏆',
            question: 'إذا قام المصمم بتحديد "نقطة بداية" لدائرة في يمين الشاشة، و"نقطة نهاية" في يسار الشاشة، وترك البرنامج يحسب مسار حركتها تلقائياً. هذه التقنية تسمى:',
            options: [
                'التحريك الإطاري (Frame by Frame)',
                'التحريك الشكلي (Morphing)',
                'التحريك البيني (Tweening)'
            ],
            correctAnswer: 2,
            feedback: 'أحسنت! التحريك البيني (Tweening) يعتمد على الإطارات الرئيسية ويترك للبرنامج توليد الحركة بينهما لتوفير الوقت.'
        },
        {
            type: 'extra-techniques',
            title: 'تقنيات إضافية ولماذا هي مهمة؟',
            icon: <Shuffle className="w-12 h-12 text-yellow-400 mb-4" />,
            items: [
                { title: 'المؤثرات البصرية (Visual Effects)', desc: 'إضافة تأثيرات خاصة كالضوء، الانفجارات، الدخان لإعطاء طابع سينمائي للمادة التعليمية.', icon: <Sparkles className="w-8 h-8 text-yellow-300" /> },
                { title: 'التصميم الصوتي (Sound Design)', desc: 'الموسيقى الخلفية والمؤثرات الصوتية ضرورية جداً لتعزيز التجربة البصرية وتثبيت المعلومة.', icon: <Music className="w-8 h-8 text-green-300" /> },
                { title: 'الدمج (Live Action)', desc: 'دمج الرسوم الكرتونية مع لقطات حية لأشخاص أو أماكن واقعية لمزيد من الارتباط بالواقع.', icon: <Video className="w-8 h-8 text-blue-300" /> }
            ],
            importance: [
                'التنوع: إتاحة تنوع كبير في الأشكال مما يكسر روتين التعليم الجاف.',
                'التعبير: القدرة الفائقة على تبسيط الأفكار المعقدة المجردة.',
                'التفاعل: إبقاء المشاهد منتبهاً ومتفاعلاً لأطول فترة ممكنة.',
                'الواقعية: تحقيق مستويات عليا من الواقعية باستخدام الـ 3D والمؤثرات.'
            ]
        },
        {
            type: 'tools',
            title: 'برامج احترافية لإنتاج الإنفوجرافيك المتحرك',
            icon: <Settings className="w-12 h-12 text-purple-400 mb-4" />,
            content: 'تتصدر هذه البرامج سوق العمل للمصممين المحترفين:',
            software: [
                { name: 'Adobe After Effects', desc: 'يعتبر أفضل برنامج في هذا المجال. يعتمد على "نظام الطبقات"، ويتيح تحريك العناصر بدقة فائقة ووضع المؤثرات في بيئة 2D و 3D. يتميز بأقوى نظام تكوين (Composition).' },
                { name: 'Cinema 4D', desc: 'برنامج عملاق ومتقدم جداً متخصص بشكل أساسي في إنشاء الرسوم المتحركة ثلاثية الأبعاد (3D Animation).' },
                { name: 'Blender', desc: 'برنامج مجاني مفتوح المصدر بالكامل، ومع ذلك يقدم أدوات في غاية القوة لإنشاء الرسوم المتحركة وعوالم الـ 3D.' },
                { name: 'Adobe Premiere Pro', desc: 'أقوى برنامج لتحرير الفيديو (المونتاج) وإضافة التأثيرات البسيطة ودمج الصوت.' },
                { name: 'Video Scribe', desc: 'متخصص لإنتاج فيديوهات تظهر كأنها "تُرسم باليد" (Whiteboard). مثالي للشروحات التعليمية والمقدمات.' }
            ]
        },
        {
            type: 'tools-simple',
            title: 'برامج سحابية وقوالب جاهزة (سهلة الاستخدام)',
            icon: <Images className="w-12 h-12 text-teal-400 mb-4" />,
            content: 'إذا لم تكن مصمماً محترفاً، فهذه البرامج تقدم لك الحلول السريعة:',
            software: [
                { name: 'Powtoon & Vyond', desc: 'منصات سحابية توفر قوالب متحركة جاهزة، شخصيات كرتونية، وحركات معدة مسبقاً. سهلة الاستخدام جداً بواسطة السحب والإفلات لإنتاج فيديوهات تعليمية جذابة بسرعة.' },
                { name: 'LightWorks', desc: 'برنامج احترافي للمونتاج يتوفر بنسخة مجانية (تخرج دقة 720p/1080p) ونسخة مدفوعة لدقة 4K مع خيارات متقدمة.' },
                { name: 'VideoPad Editor', desc: 'يتميز بالبساطة في دمج المقاطع، إضافة الانتقالات، وتعديل النصوص بطريقة مرنة.' },
                { name: 'iMovie & Movie Maker', desc: 'برامج أساسية ومجانية (iMovie لـ أبل، و Movie Maker لويندوز) تفي بالغرض لعمل تعديلات ومونتاج بسيط وسريع.' }
            ]
        },
        {
            type: 'quiz',
            title: 'تحدي البرمجيات النهائي 🏆',
            question: 'أراد معلم إنتاج فيديو إنفوجرافيك متحرك لشرح درس، ولكنه لا يملك خبرة في التصميم المعقد ويحتاج لقوالب وشخصيات جاهزة سريعة الاستخدام. أي برنامج تنصحه باستخدامه؟',
            options: [
                'Adobe After Effects',
                'Cinema 4D',
                'Powtoon أو Vyond'
            ],
            correctAnswer: 2,
            feedback: 'رائع جداً! منصات Powtoon و Vyond صُممت خصيصاً لغير المحترفين لإنتاج مواد بصرية متحركة رائعة في وقت قصير باستخدام القوالب.'
        },
        {
            type: 'completion',
            title: 'اكتمل الفصل الرابع بتفوق! 🎉',
            content: 'لقد أنهيت دراسة المادة العلمية للفصل الرابع بالكامل. تعرفت على أساليب التحريك، المزايا التعليمية، التقنيات العميقة (Tweening, Morphing)، وأهم البرامج الاحترافية والسحابية.',
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

    return (
        <div className="w-full min-h-screen bg-[#070410] text-white flex items-center justify-center p-4 md:p-8 font-sans overflow-x-hidden" dir="rtl">

            {/* تأثيرات خلفية نيون واسعة */}
            <div className="fixed top-0 right-0 w-[60vw] h-[60vw] rounded-full bg-purple-900/10 blur-[180px] pointer-events-none animate-pulse"></div>
            <div className="fixed bottom-0 left-0 w-[60vw] h-[60vw] rounded-full bg-indigo-900/10 blur-[180px] pointer-events-none"></div>

            {/* الحاوية الرئيسية (تتمدد على شاشات اللابتوب بشكل واسع) */}
            <div className="relative z-10 w-full max-w-7xl bg-[#110c1f]/80 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-[2rem] p-6 md:p-12 flex flex-col min-h-[85vh] transition-all duration-500">

                {/* Header Controls */}
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                    <button onClick={() => console.log('Exit')} className="flex items-center gap-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 px-5 py-2.5 rounded-xl text-sm font-bold border border-transparent hover:border-red-500/30 transition-all">
                        <LogOut className="w-5 h-5" /> خروج من الدرس
                    </button>

                    <div className="flex-1 mr-8 ml-4 max-w-2xl mx-auto">
                        <div className="h-2 w-full bg-[#241a35] rounded-full overflow-hidden shadow-inner relative">
                            <div
                                className="h-full bg-gradient-to-l from-pink-500 via-purple-500 to-indigo-500 transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-white/40 text-xs md:text-sm mt-3 font-medium tracking-wide">
                            <span>الفصل الرابع: الإنفوجرافيك المتحرك</span>
                            <span>شريحة {currentSlide + 1} من {lessonData.length}</span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-center items-center w-full animate-fade-in-up" key={currentSlide}>

                    {/* 1. شريحة المقدمة */}
                    {slide.type === 'intro' && (
                        <div className="text-center flex flex-col items-center max-w-5xl">
                            {slide.icon}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-l from-pink-400 to-indigo-400 mb-6 leading-tight">
                                {slide.title}
                            </h1>
                            <div className="bg-white/5 px-10 py-3 mb-10 rounded-full border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                <h2 className="text-2xl text-purple-200 font-bold tracking-wide">{slide.subtitle}</h2>
                            </div>
                            <p className="text-xl md:text-2xl text-white/80 leading-relaxed bg-[#19132b] p-8 md:p-10 rounded-3xl border border-white/5 shadow-inner">
                                {slide.content}
                            </p>
                        </div>
                    )}

                    {/* 2. شريحة القوائم المفصلة */}
                    {slide.type === 'detailed-list' && (
                        <div className="w-full flex flex-col items-center max-w-6xl">
                            {slide.icon}
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-center">{slide.title}</h2>
                            <p className="text-xl text-cyan-200 mb-10 text-center">{slide.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                {slide.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-6 bg-[#19132b] border border-white/5 p-8 rounded-3xl items-center text-center hover:bg-[#221a3a] hover:border-cyan-400/30 transition-all shadow-xl group">
                                        <div className="p-5 bg-[#221a3a] rounded-2xl group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                                            <p className="text-white/70 text-lg leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. شريحة الشبكة (المزايا) 4 أعمدة في اللابتوب */}
                    {slide.type === 'grid' && (
                        <div className="w-full flex flex-col items-center max-w-7xl">
                            {slide.icon}
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-xl text-pink-200 mb-10 text-center">{slide.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                {slide.items.map((item, idx) => (
                                    <div key={idx} className="bg-[#19132b] border border-pink-500/10 p-6 rounded-3xl hover:bg-[#221a3a] hover:border-pink-400/50 transition-all flex flex-col items-start shadow-md">
                                        <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mb-4">
                                            <Sparkles className="w-5 h-5 text-pink-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-white/60 text-base leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. شريحة المعايير */}
                    {slide.type === 'criteria' && (
                        <div className="w-full flex flex-col items-center max-w-5xl">
                            {slide.icon}
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-xl text-teal-200 mb-10 text-center">{slide.content}</p>

                            <div className="bg-[#19132b] border border-teal-500/20 rounded-[2.5rem] p-10 w-full shadow-2xl">
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {slide.list.map((item, idx) => {
                                        const [title, desc] = item.split(':');
                                        return (
                                            <li key={idx} className="flex items-start gap-4">
                                                <CheckCircle2 className="w-8 h-8 text-teal-400 shrink-0 mt-1" />
                                                <div>
                                                    <span className="font-bold text-teal-300 text-xl block mb-1">{title}</span>
                                                    <span className="text-white/80 text-lg leading-relaxed">{desc}</span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* 5. شريحة التقنيات الأساسية (الجديدة) */}
                    {slide.type === 'techniques-grid' && (
                        <div className="w-full flex flex-col items-center max-w-7xl">
                            {slide.icon}
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-xl text-indigo-200 mb-10 text-center">{slide.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                {slide.items.map((item, idx) => (
                                    <div key={idx} className="relative bg-[#19132b] border border-white/5 p-8 rounded-3xl hover:border-indigo-400/50 transition-all overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-indigo-400 to-purple-500"></div>
                                        <div className="text-5xl font-black text-white/5 absolute bottom-4 left-6 group-hover:scale-110 transition-transform">0{idx + 1}</div>
                                        <h3 className="text-2xl font-bold text-indigo-300 mb-3 relative z-10">{item.title}</h3>
                                        <p className="text-white/70 text-lg leading-relaxed relative z-10">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 6. شريحة التقنيات الإضافية (Live action, VFX) */}
                    {slide.type === 'extra-techniques' && (
                        <div className="w-full flex flex-col items-center max-w-6xl">
                            {slide.icon}
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">{slide.title}</h2>

                            <div className="flex flex-col lg:flex-row gap-10 w-full">
                                {/* العمود الأيمن: التقنيات */}
                                <div className="flex-1 flex flex-col gap-6">
                                    {slide.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-5 bg-[#19132b] p-6 rounded-2xl border border-white/5 hover:bg-[#221a3a] transition-all">
                                            <div className="bg-[#221a3a] p-4 rounded-xl">{item.icon}</div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                                <p className="text-white/70">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* العمود الأيسر: الأهمية */}
                                <div className="flex-1 bg-gradient-to-br from-[#2a203b] to-[#19132b] border border-yellow-500/20 p-10 rounded-3xl shadow-xl">
                                    <h3 className="text-2xl font-bold text-yellow-400 mb-6 border-b border-white/10 pb-4">لماذا هذه التقنيات مهمة؟</h3>
                                    <ul className="space-y-6">
                                        {slide.importance.map((imp, idx) => {
                                            const [title, desc] = imp.split(':');
                                            return (
                                                <li key={idx} className="flex flex-col">
                                                    <span className="font-bold text-yellow-300 text-lg">{title}</span>
                                                    <span className="text-white/80">{desc}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 7. شريحة البرامج الاحترافية والسحابية */}
                    {(slide.type === 'tools' || slide.type === 'tools-simple') && (
                        <div className="w-full flex flex-col items-center max-w-6xl">
                            {slide.icon}
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{slide.title}</h2>
                            <p className="text-xl text-white/60 mb-10 text-center">{slide.content}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                {slide.software.map((sw, idx) => (
                                    <div key={idx} className={`bg-[#19132b] border ${slide.type === 'tools' ? 'border-purple-500/20 hover:border-purple-400' : 'border-teal-500/20 hover:border-teal-400'} p-8 rounded-3xl transition-all shadow-lg`}>
                                        <h3 className={`text-2xl font-black mb-3 ${slide.type === 'tools' ? 'text-purple-300' : 'text-teal-300'}`}>{sw.name}</h3>
                                        <p className="text-white/80 text-lg leading-relaxed">{sw.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 8. شريحة الأسئلة */}
                    {slide.type === 'quiz' && (
                        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-base font-bold mb-10 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                                <Lightbulb className="w-6 h-6 animate-pulse" /> {slide.title}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 leading-relaxed text-center">
                                {slide.question}
                            </h2>
                            <div className="flex flex-col gap-5 w-full">
                                {slide.options.map((option, idx) => {
                                    let btnStateClass = "bg-[#19132b] border-white/5 text-white/80 hover:bg-[#221a3a] hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]";
                                    let icon = <div className="w-8 h-8 rounded-full border border-white/20 flex-shrink-0"></div>;

                                    if (isAnswered) {
                                        if (idx === slide.correctAnswer) {
                                            btnStateClass = "bg-green-500/20 border-green-500/50 text-green-300 shadow-[0_0_30px_rgba(34,197,94,0.2)] scale-[1.02]";
                                            icon = <CheckCircle2 className="w-8 h-8 text-green-400 flex-shrink-0" />;
                                        } else if (idx === selectedAnswer) {
                                            btnStateClass = "bg-red-500/20 border-red-500/50 text-red-300";
                                            icon = <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />;
                                        } else {
                                            btnStateClass = "bg-[#19132b]/50 border-transparent text-white/30 opacity-50";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            disabled={isAnswered}
                                            className={`relative w-full text-right p-6 md:p-8 rounded-2xl border transition-all duration-300 flex justify-between items-center text-xl ${btnStateClass}`}
                                        >
                                            <span className="pl-6 font-medium leading-relaxed">{option}</span>
                                            {icon}
                                        </button>
                                    );
                                })}
                            </div>

                            {isAnswered && (
                                <div className="mt-10 p-8 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-transparent border-r-4 border-cyan-500 text-cyan-100 text-xl font-medium animate-fade-in w-full shadow-lg">
                                    {slide.feedback}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 9. شريحة النهاية */}
                    {slide.type === 'completion' && (
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-10">
                                <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-[80px] animate-pulse"></div>
                                <Clapperboard className="w-40 h-40 text-indigo-400 relative z-10 drop-shadow-[0_0_40px_rgba(99,102,241,0.6)]" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-wide">{slide.title}</h1>
                            <p className="text-2xl text-white/70 mb-16 max-w-2xl leading-relaxed">{slide.content}</p>

                            <div className="bg-[#19132b] border border-indigo-500/30 px-24 py-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-pink-400 via-purple-500 to-indigo-500"></div>
                                <p className="text-white/60 mb-6 text-2xl font-medium">النتيجة النهائية للاختبارات</p>
                                <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 flex items-center justify-center gap-6">
                                    {score} <span className="text-4xl text-white/30 font-medium">من</span> {totalQuizzes}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Navigation */}
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
                        className={`flex items-center gap-3 px-12 py-5 rounded-xl font-bold text-xl transition-all duration-300 ${slide.type === 'quiz' && !isAnswered
                                ? 'bg-[#19132b] text-white/30 cursor-not-allowed border border-transparent'
                                : 'bg-gradient-to-l from-pink-500 to-indigo-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-[1.03] border border-indigo-400/50'
                            }`}
                    >
                        {currentSlide === lessonData.length - 1 ? 'إنهاء الدرس التفاعلي' : 'التالي'}
                        {currentSlide !== lessonData.length - 1 && <ChevronLeft className="w-7 h-7" />}
                    </button>
                </div>

            </div>

            {/* Global CSS for Animations */}
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