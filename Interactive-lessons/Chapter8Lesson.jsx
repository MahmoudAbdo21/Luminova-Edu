import React, { useState, useEffect } from 'react';
import {
    CheckCircle2, XCircle, ChevronRight, ChevronLeft,
    LogOut, Layers, Target, Eye, BrainCircuit,
    Map, BarChart, Video, MousePointerClick,
    Table, Image as ImageIcon, Sparkles, BookOpen,
    PenTool, Award, Lightbulb, Laugh, Zap, Clock, ShieldCheck,
    Cpu, FileType, CheckSquare
} from 'lucide-react';

export default function App() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // موسوعة الإجابات النموذجية (28 شريحة دسمة جداً كما طلبت)
    const lessonData = [
        {
            type: 'intro',
            title: 'الموسوعة الذهبية: الإجابات النموذجية',
            subtitle: 'الدليل الشامل لاجتياز التكليفات والاختبارات بامتياز',
            content: 'في هذا العرض التفاعلي الضخم، لن نجاوب على أسئلة التكليف بكلمتين فقط! بل سنفكك كل سؤال، ونغوص في الأعماق الأكاديمية لنقارن بين الخرائط الذهنية والإنفوجرافيك، ونشرح الفروق الجوهرية بين الإنفوجرافيك (الثابت، المتحرك، والتفاعلي) لتكتب إجابة نموذجية تبهر أستاذ المادة.',
            icon: <Award className="w-24 h-24 text-amber-400 mb-6 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
        },
        {
            type: 'cards-2',
            title: 'السؤال الأول: عرّف الخرائط الذهنية والإنفوجرافيك',
            icon: <BookOpen className="w-12 h-12 text-cyan-400 mb-4" />,
            description: 'الإجابة النموذجية لا تقتصر على سطر واحد، بل يجب أن تشمل الماهية والهدف:',
            items: [
                { title: 'تعريف الخرائط الذهنية (Mind Maps)', desc: 'هي أداة تفكير بصري واستراتيجية إبداعية (غير خطية) ابتكرها العالم "توني بوزان". تعتمد على وضع "فكرة مركزية" في منتصف اللوحة، وتتفرع منها الأفكار الثانوية بشكل شعاعي يشبه الخلايا العصبية. تستخدم الكلمات المفتاحية، الألوان، والصور بكثافة لتنشيط شقي الدماغ وتسهيل توليد الأفكار وتدوين الملاحظات.' },
                { title: 'تعريف الإنفوجرافيك (Infographic)', desc: 'هو فن تمثيل البيانات والمعلومات المعقدة مرئياً (Data Visualization). يمزج بين "التصميم الجرافيكي" و"المحتوى النصي الموجز" لتوصيل رسالة محددة أو قصة (Visual Storytelling) بوضوح وسرعة. يهدف إلى تبسيط الإحصائيات، شرح العمليات، وإبراز الحقائق في قالب مصمم بعناية لتسهيل الإدراك البصري.' }
            ]
        },
        {
            type: 'grid-horizontal',
            title: 'السؤال الثاني: ما الفرق بين الخرائط الذهنية والإنفوجرافيك؟',
            icon: <Target className="w-12 h-12 text-rose-400 mb-4" />,
            description: 'لنجيب على هذا السؤال باحترافية، سنقسم الفروق إلى 4 محاور أساسية:',
            sections: [
                {
                    title: '1. من حيث الهيكل والاتجاه',
                    color: 'text-rose-300',
                    items: [
                        { t: 'الخرائط الذهنية:', d: 'تتجه من (المركز إلى الأطراف) بشكل شعاعي حر، لا يوجد بها ترتيب زمني أو منطقي صارم.' },
                        { t: 'الإنفوجرافيك:', d: 'يتجه غالباً بشكل (خطي أو متسلسل)، من الأعلى للأسفل أو من اليمين لليسار، ليقود عين القارئ في مسار محدد.' }
                    ]
                },
                {
                    title: '2. من حيث الغرض الأساسي',
                    color: 'text-emerald-300',
                    items: [
                        { t: 'الخرائط الذهنية:', d: 'تُستخدم (لاستكشاف) الأفكار، العصف الذهني، وتلخيص المذاكرة الشخصية.' },
                        { t: 'الإنفوجرافيك:', d: 'يُستخدم (لعرض) نتائج نهائية، إقناع الجمهور، وتبسيط بيانات معقدة تم الانتهاء من جمعها.' }
                    ]
                }
            ]
        },
        {
            type: 'grid-horizontal',
            title: 'تابع السؤال الثاني: الفروق الجوهرية',
            icon: <Target className="w-12 h-12 text-rose-400 mb-4" />,
            description: 'المحور الثالث والرابع في المقارنة الأكاديمية:',
            sections: [
                {
                    title: '3. من حيث كثافة البيانات',
                    color: 'text-cyan-300',
                    items: [
                        { t: 'الخرائط الذهنية:', d: 'تعتمد على (كلمات مفتاحية) فقط. لا تتحمل نصوصاً طويلة أو فقرات شرحية.' },
                        { t: 'الإنفوجرافيك:', d: 'يتحمل (بيانات كمية ونوعية)، إحصائيات، أرقام، ونصوص توضيحية قصيرة تدعم الرسوم.' }
                    ]
                },
                {
                    title: '4. من حيث الجمهور المستهدف',
                    color: 'text-amber-300',
                    items: [
                        { t: 'الخرائط الذهنية:', d: 'موجهة غالباً (لصانعها) أو لفريق عمل صغير يفهم السياق.' },
                        { t: 'الإنفوجرافيك:', d: 'موجه (للجمهور العام) أو لعملاء لا يملكون خلفية مسبقة عن الموضوع، لذا يجب أن يكون شديد الوضوح.' }
                    ]
                }
            ]
        },
        {
            type: 'comparison-table',
            title: 'الجدول السحري (الخريطة الذهنية vs الإنفوجرافيك)',
            icon: <Table className="w-12 h-12 text-purple-400 mb-4" />,
            description: 'انسخ هذا الجدول في الامتحان لتضمن الدرجة النهائية في سؤال المقارنة:',
            headers: ['وجه المقارنة', 'الخريطة الذهنية (Mind Map)', 'الإنفوجرافيك (Infographic)'],
            rows: [
                ['المؤسس / الرائد', 'العالم "توني بوزان"', 'مصممو البيانات (مثل كريستوف شاينر)'],
                ['طبيعة العمل', 'أداة مسودة، حيوية وقابلة للتعديل المستمر', 'منتج نهائي مُصمم بعناية فائقة للعرض'],
                ['العناصر البصرية', 'كلمات مفتاحية، فروع، رسومات يدوية بسيطة', 'مخططات بيانية، أرقام، تصميم جرافيكي معقد'],
                ['وقت الاستخدام', 'قبل أو أثناء دراسة الموضوع (لتوليد الأفكار)', 'بعد الانتهاء من الدراسة والتحليل (لعرض النتائج)'],
                ['النتيجة النهائية', 'لوحة متشعبة تساعد على الحفظ والفهم الشخصي', 'قصة بصرية (Storytelling) تقنع الجمهور وتوصل رسالة']
            ]
        },
        {
            type: 'quiz',
            title: 'تطبيق عملي سريع 💡',
            question: 'طلب منك مديرك تلخيص الأفكار التي تم طرحها في "اجتماع العصف الذهني" لتقديمها للفريق غداً. أي أداة ستستخدم؟',
            options: [
                'الإنفوجرافيك الإحصائي.',
                'الخريطة الذهنية (Mind Map).',
                'الموشن جرافيك.'
            ],
            correctAnswer: 1,
            feedback: 'أحسنت! الخريطة الذهنية هي الأداة المثالية لترتيب وتدوين أفكار العصف الذهني بشكل غير خطي وسريع.'
        },
        {
            type: 'intro',
            title: 'محور العمالقة: الثابت، المتحرك، والتفاعلي',
            subtitle: 'تفكيك الأسئلة الثالث والرابع من التكليف',
            content: 'الآن ننتقل إلى الجزء الأهم والأكثر دسماً. أسئلة المقارنة بين الإنفوجرافيك (الثابت، المتحرك، والتفاعلي) تتطلب فهماً عميقاً لكيفية تفاعل الدماغ مع كل وسيط، وحجم التكلفة، وأدوات البرمجة. جهز نفسك لتحليل أكاديمي غير مسبوق.',
            icon: <Layers className="w-24 h-24 text-indigo-400 mb-6 drop-shadow-[0_0_20px_rgba(99,102,241,0.8)]" />
        },
        {
            type: 'cards-3',
            title: 'التعريفات الفاصلة (مقدمة المقارنة)',
            icon: <PenTool className="w-12 h-12 text-teal-400 mb-4" />,
            description: 'قبل المقارنة، يجب أن نعرّف كل نوع بدقة علمية:',
            items: [
                { title: '1. الثابت (Static)', desc: 'هو تصميم صامت في صورة واحدة (2D). يعتمد كلياً على هندسة المساحات والألوان لتوجيه عين القارئ من نقطة لأخرى. لا يحتوي على أي عنصر حركي أو صوتي.' },
                { title: '2. المتحرك (Animated)', desc: 'هو عرض زمني (فيديو). يدمج التصميم الجرافيكي مع قوانين الحركة (Animation)، والمؤثرات البصرية (VFX)، والتعليق الصوتي. يعرض المعلومات بتسلسل مفروض على المتلقي.' },
                { title: '3. التفاعلي (Interactive)', desc: 'هو بيئة ويب برمجية متكاملة (HTML5/JS). يدمج الرسوم مع إمكانية تحكم المستخدم. لا تعرض كل المعلومات دفعة واحدة، بل تستجيب لـ (نقر، تمرير، أو إدخال بيانات) من المتعلم.' }
            ]
        },
        {
            type: 'grid-horizontal',
            title: 'السؤال الثالث: قارن بين الإنفوجرافيك الثابت والمتحرك',
            icon: <Cpu className="w-12 h-12 text-blue-400 mb-4" />,
            description: 'إليك الإجابة النموذجية الممتدة للمقارنة بين الثابت والمتحرك:',
            sections: [
                {
                    title: 'من حيث (استهلاك الحواس والانتباه)',
                    color: 'text-blue-300',
                    items: [
                        { t: 'الإنفوجرافيك الثابت:', d: 'يستهلك حاسة (البصر) فقط. يتطلب مجهوداً من القارئ لتتبع مسار المعلومات بعينيه وربطها منطقياً.' },
                        { t: 'الإنفوجرافيك المتحرك:', d: 'يستهلك حاستي (البصر والسمع). الحركة تجذب الانتباه البشري بشكل غريزي، والصوت يدعم المعلومة مما يقلل احتمالية الملل.' }
                    ]
                },
                {
                    title: 'من حيث (التحكم في سرعة التلقي Pacing)',
                    color: 'text-emerald-300',
                    items: [
                        { t: 'الإنفوجرافيك الثابت:', d: 'التحكم بيد (المتلقي). يمكنه التوقف عند معلومة، قراءتها ببطء، أو تجاهل أخرى.' },
                        { t: 'الإنفوجرافيك المتحرك:', d: 'التحكم بيد (المصمم/الفيديو). تُعرض المعلومات بسرعة ثابتة مفروضة، وإذا فاتته معلومة يجب أن يعيد الفيديو.' }
                    ]
                }
            ]
        },
        {
            type: 'grid-horizontal',
            title: 'تابع: مقارنة الثابت والمتحرك (الإنتاج والاستخدام)',
            icon: <Cpu className="w-12 h-12 text-blue-400 mb-4" />,
            description: 'الفرق من الناحية التقنية والتطبيقية:',
            sections: [
                {
                    title: 'من حيث (التكلفة وصعوبة الإنتاج)',
                    color: 'text-rose-300',
                    items: [
                        { t: 'الإنفوجرافيك الثابت:', d: 'منخفض التكلفة، سريع الإنتاج. يحتاج لبرنامج واحد (مثل Illustrator) ومصمم واحد.' },
                        { t: 'الإنفوجرافيك المتحرك:', d: 'عالي التكلفة، يستغرق وقتاً طويلاً. يحتاج لكاتب سيناريو، معلق صوتي، ورسام تحريك (ببرامج مثل After Effects).' }
                    ]
                },
                {
                    title: 'من حيث (أفضل حالات الاستخدام)',
                    color: 'text-amber-300',
                    items: [
                        { t: 'الإنفوجرافيك الثابت:', d: 'مثالي للطباعة، التقارير المكتوبة، التلخيصات السريعة، وعرض الإحصائيات البسيطة.' },
                        { t: 'الإنفوجرافيك المتحرك:', d: 'مثالي للإعلانات التجارية، شرح العمليات المعقدة (كيف يعمل محرك السيارة)، والقصص التاريخية (Storytelling).' }
                    ]
                }
            ]
        },
        {
            type: 'comparison-table',
            title: 'جدول مقارنة: الثابت مقابل المتحرك',
            icon: <Table className="w-12 h-12 text-cyan-400 mb-4" />,
            description: 'للتلخيص في ورقة الإجابة:',
            headers: ['وجه المقارنة', 'الإنفوجرافيك الثابت', 'الإنفوجرافيك المتحرك'],
            rows: [
                ['الصيغ الشائعة', 'JPG, PNG, PDF', 'MP4, GIF, MOV'],
                ['التحديث والتعديل', 'سهل جداً (تعديل الصورة ورفعها)', 'صعب (يحتاج إعادة مونتاج وإخراج)'],
                ['قابلية الطباعة', 'ممتاز ومصمم خصيصاً للطباعة', 'مستحيل (يفقد قيمته عند طباعته كصور)'],
                ['التأثير العاطفي', 'متوسط (يعتمد على الألوان فقط)', 'عالي جداً (تأثير الموسيقى والحركة) भी'],
                ['الحجم التخزيني', 'صغير جداً (كيلوبايت - ميجابايت)', 'كبير جداً (عشرات أو مئات الميجابايت)']
            ]
        },
        {
            type: 'quiz',
            title: 'استراحة العقل 🧠',
            question: 'معلم طلب منك تصميم وسيلة بصرية لشرح "دورة حياة الضفدع" لعرضها على شاشة (البروجكتور) في الفصل لجذب انتباه أطفال في الابتدائية. أيهما ستختار؟',
            options: [
                'الإنفوجرافيك الثابت (لأنه أسهل).',
                'الإنفوجرافيك المتحرك (الموشن جرافيك).',
                'الخريطة الذهنية.'
            ],
            correctAnswer: 1,
            feedback: 'أحسنت! الإنفوجرافيك المتحرك هو السلاح الأقوى لجذب انتباه الأطفال، فشرح "عملية متسلسلة" كدورة الحياة يصبح ساحراً مع الحركة والصوت.'
        },
        {
            type: 'grid-horizontal',
            title: 'السؤال الرابع: قارن بين الإنفوجرافيك المتحرك والتفاعلي',
            icon: <MousePointerClick className="w-12 h-12 text-fuchsia-400 mb-4" />,
            description: 'هنا ننتقل لمستوى الوحش! المقارنة بين نوعين متقدمين جداً:',
            sections: [
                {
                    title: 'من حيث (دور المتلقي / Agency)',
                    color: 'text-fuchsia-300',
                    items: [
                        { t: 'المتحرك (Animated):', d: 'المتلقي هنا (سلبي / Passive). دوره يقتصر على المشاهدة والاستماع فقط من بداية الفيديو لنهايته.' },
                        { t: 'التفاعلي (Interactive):', d: 'المتلقي هنا (إيجابي نشط / Active). هو من يقود التجربة، ينقر هنا، يكبر هناك، ويقرر متى يعرض المعلومة ومتى يخفيها.' }
                    ]
                },
                {
                    title: 'من حيث (كثافة البيانات المخفية)',
                    color: 'text-emerald-300',
                    items: [
                        { t: 'المتحرك (Animated):', d: 'البيانات المعروضة محدودة بوقت الفيديو. لا يمكن حشو الفيديو بمعلومات كثيرة وإلا سيصبح مملاً وطويلاً جداً.' },
                        { t: 'التفاعلي (Interactive):', d: 'يتحمل بيانات (لا نهائية). يمكن وضع خريطة للعالم، وبضغطة زر تظهر آلاف البيانات لكل دولة (بيانات مخفية تظهر عند الطلب On-Demand).' }
                    ]
                }
            ]
        },
        {
            type: 'grid-horizontal',
            title: 'تابع: مقارنة المتحرك والتفاعلي (التقنية والعبء)',
            icon: <MousePointerClick className="w-12 h-12 text-fuchsia-400 mb-4" />,
            description: 'نظرة أعمق على البنية التحتية والعبء المعرفي:',
            sections: [
                {
                    title: 'من حيث (البنية التكنولوجية)',
                    color: 'text-amber-300',
                    items: [
                        { t: 'المتحرك (Animated):', d: 'يعتمد على برامج الرندرة (Rendering) مثل After Effects للخروج بملف فيديو واحد مغلق (MP4).' },
                        { t: 'التفاعلي (Interactive):', d: 'يعتمد على برمجة الويب (HTML5, CSS, JS) وبرامج مثل (Storyline). يتكون من عدة ملفات برمجية وأكواد وقواعد بيانات.' }
                    ]
                },
                {
                    title: 'من حيث (العبء المعرفي - Cognitive Load)',
                    color: 'text-cyan-300',
                    items: [
                        { t: 'المتحرك (Animated):', d: 'قد يسبب (تشتتاً) إذا كانت الحركة سريعة جداً ولم يلحق الطالب بقراءة النص أثناء الحركة.' },
                        { t: 'التفاعلي (Interactive):', d: 'يقلل العبء المعرفي، لأن الطالب يجزئ المعلومات بنفسه (Chunking)، ولا ينتقل للخطوة التالية إلا بعد فهم الأولى.' }
                    ]
                }
            ]
        },
        {
            type: 'comparison-table',
            title: 'جدول مقارنة: المتحرك مقابل التفاعلي',
            icon: <Table className="w-12 h-12 text-pink-400 mb-4" />,
            description: 'لتلخيص الإجابة الرابعة في الامتحان:',
            headers: ['وجه المقارنة', 'المتحرك (Animated)', 'التفاعلي (Interactive)'],
            rows: [
                ['مسار العرض', 'خطي (Linear) إجباري', 'غير خطي (Non-linear) حسب رغبة المستخدم'],
                ['إمكانية الاستكشاف', 'منعدمة (تشاهد ما يُعرض لك فقط)', 'عالية جداً (كالجولات الافتراضية والخرائط)'],
                ['قابلية التتبع والتقييم', 'لا يمكن معرفة ماذا فهم الطالب', 'يمكن دمج (أسئلة واختبارات) داخله تقيم فهم الطالب فوراً'],
                ['تحديث البيانات حياً', 'مستحيل', 'ممكن جداً (بربطه بـ API أو جداول بيانات حية)'],
                ['البرامج المستخدمة', 'Adobe After Effects, Premiere', 'Articulate Storyline, Genially, HTML5']
            ]
        },
        {
            type: 'joke',
            title: 'فاصل فكاهي (عشان نفصل شوية) 😂',
            content: 'عارف إيه الفرق الحقيقي بين الثابت والمتحرك والتفاعلي يوم مناقشة المشروع؟',
            punchline: 'الثابت: الدكاترة بيطلعوا فيه القطط الفطسانة في التصميم. المتحرك: اللاب توب بيهنج ومبيرضاش يشتغل. التفاعلي: الطالب نفسه بينسى هو برمج الزرار ده بيعمل إيه وبيضغط عليه الماوس ينفجر! 🖱️💥',
            icon: <Laugh className="w-24 h-24 text-yellow-400 mb-4 animate-bounce" />
        },
        {
            type: 'mega-table',
            title: 'الجدول الماسي: مقارنة شاملة للأنواع الثلاثة',
            icon: <ShieldCheck className="w-12 h-12 text-emerald-400 mb-4" />,
            description: 'هذا الجدول يختصر الفصل بالكامل (الخلاصة الأكاديمية):',
            headers: ['المعيار', 'الإنفوجرافيك الثابت', 'الإنفوجرافيك المتحرك', 'الإنفوجرافيك التفاعلي'],
            rows: [
                ['التكلفة', 'الأقل تكلفة', 'مرتفعة (رسام، محرك، معلق)', 'الأعلى تكلفة (تصميم + برمجة)'],
                ['التفاعل', 'سلبي تماماً', 'سلبي (مشاهدة فقط)', 'إيجابي ونشط جداً'],
                ['الحواس المستخدمة', 'البصر', 'البصر + السمع', 'البصر + السمع + اللمس (الحركة)'],
                ['مناسبة الويب', 'جيد', 'ممتاز (سوشيال ميديا)', 'ممتاز جداً (منصات التعليم LMS)'],
                ['تحديث المعلومات', 'يتطلب إعادة تصميم', 'يتطلب إعادة مونتاج', 'يمكن تحديثه برمجياً بسهولة']
            ]
        },
        {
            type: 'quiz',
            title: 'اختبار العباقرة النهائي 🏆',
            question: 'شركة صرافة تريد وضع إنفوجرافيك على موقعها يعرض "أسعار العملات" بحيث تتغير الأرقام تلقائياً كل دقيقة حسب السوق العالمي. أي نوع ستسخدم؟',
            options: [
                'المتحرك (لأن الأسعار تتحرك).',
                'الثابت (لأنه أسهل في الرفع على الموقع).',
                'التفاعلي (لقدرته على الارتباط بقواعد بيانات برمجية تتحدث تلقائياً).'
            ],
            correctAnswer: 2,
            feedback: 'إجابة مذهلة! الأرقام التي تتحدث "تلقائياً" (Dynamic Data) لا يمكن عملها إلا برمجياً من خلال الإنفوجرافيك التفاعلي.'
        },
        {
            type: 'cards-2',
            title: 'نصائح لورقة الامتحان (كيف تبهر الدكتورة؟) 📝',
            icon: <Sparkles className="w-12 h-12 text-pink-400 mb-4" />,
            description: 'لكتابة إجابة لا تُنسى وتحصد الدرجة النهائية:',
            items: [
                { title: '1. استخدم المصطلحات الإنجليزية', desc: 'عند كتابة إجابتك، ضع المصطلح الإنجليزي بين قوسين. مثلاً: الخرائط المفاهيمية (Concept Maps)، العبء المعرفي (Cognitive Load). هذا يثبت أنك طالب باحث ومطلع.' },
                { title: '2. لا تكتفِ بالسرد، استخدم الجداول', desc: 'الدكاترة يعشقون الجداول المقارنة. ابدأ إجابتك بتعريف نظري، ثم ارسم جدولاً يلخص الفروق من حيث (التكلفة، التفاعل، الأمثلة). هذا يسهل التصحيح ويضمن الدرجة.' }
            ]
        },
        {
            type: 'completion',
            title: 'أنت جاهز لابتلاع الامتحان! 🎉',
            content: 'لقد أتممت دراسة أضخم ملف إجابات نموذجية. الآن أنت لا تحفظ الفروق فقط، بل تفهمها أكاديمياً وتقنياً وتربوياً. بالتوفيق في التكليفات والاختبارات!',
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
            console.log("تم ضغط زر الخروج");
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

    // حقن خط Cairo
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    return (
        <div style={{ fontFamily: "'Cairo', sans-serif" }} className="w-full min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-4 md:p-8 overflow-hidden tracking-wide" dir="rtl">

            {/* تأثيرات خلفية نيون واسعة */}
            <div className="fixed top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-blue-900/20 blur-[180px] pointer-events-none animate-pulse"></div>
            <div className="fixed bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-emerald-900/10 blur-[180px] pointer-events-none"></div>

            {/* الحاوية الرئيسية الواسعة للابتوب والموبايل */}
            <div className="relative z-10 w-full max-w-[98%] xl:max-w-[92%] bg-slate-900/80 backdrop-blur-3xl border border-slate-700/50 shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-6 md:p-10 flex flex-col min-h-[75vh] max-h-[90vh] transition-all duration-500 overflow-y-auto custom-scrollbar">

                {/* شريط التحكم العلوي */}
                <div className="flex justify-between items-center mb-8 border-b border-slate-700/60 pb-6 shrink-0">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 px-5 py-2.5 rounded-xl text-lg font-bold border border-transparent transition-all">
                        <LogOut className="w-5 h-5" /> إنهاء المذاكرة
                    </button>

                    <div className="flex-1 mr-8 ml-4 max-w-5xl mx-auto">
                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner relative">
                            <div
                                className="h-full bg-gradient-to-l from-emerald-400 via-cyan-500 to-indigo-500 transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-slate-400 text-sm md:text-base mt-3 font-semibold">
                            <span>الإجابات النموذجية (الأسئلة الشاملة)</span>
                            <span>شريحة {currentSlide + 1} من {lessonData.length}</span>
                        </div>
                    </div>
                </div>

                {/* مساحة عرض المحتوى تتمدد لملء الفراغ بدون تداخل */}
                <div className="flex-1 flex flex-col justify-center items-center w-full animate-fade-in-up" key={currentSlide}>

                    {/* 1. المقدمة */}
                    {slide.type === 'intro' && (
                        <div className="text-center flex flex-col items-center max-w-5xl my-auto">
                            {slide.icon}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-l from-emerald-300 to-cyan-400 mb-8 leading-[1.3]">
                                {slide.title}
                            </h1>
                            <div className="bg-slate-800/50 px-10 py-3 mb-10 rounded-full border border-slate-600 shadow-lg inline-block">
                                <h2 className="text-2xl text-cyan-200 font-bold">{slide.subtitle}</h2>
                            </div>
                            <p className="text-2xl text-slate-200 leading-[2.2] bg-slate-800/40 p-10 rounded-[2rem] border border-slate-700/50 shadow-inner w-full">
                                {slide.content}
                            </p>
                        </div>
                    )}

                    {/* 2. الكروت العادية (2 أو 3) */}
                    {(slide.type === 'cards-2' || slide.type === 'cards-3') && (
                        <div className="w-full flex flex-col items-center max-w-full my-auto">
                            <div className="flex items-center gap-4 mb-6">
                                {slide.icon}
                                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight text-center">{slide.title}</h2>
                            </div>
                            <p className="text-xl text-slate-300 mb-10 text-center max-w-4xl">{slide.description}</p>

                            <div className={`grid grid-cols-1 md:grid-cols-2 ${slide.type === 'cards-3' ? 'lg:grid-cols-3' : ''} gap-6 w-full`}>
                                {slide.items.map((item, idx) => (
                                    <div key={idx} className={`bg-slate-800/40 border border-slate-700/60 p-8 rounded-[2rem] hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-lg group flex flex-col items-start`}>
                                        <div className="p-4 bg-slate-700 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                                            {slide.icon.type.name === 'BookOpen' ? <BookOpen className="w-8 h-8 text-cyan-400" /> : <PenTool className="w-8 h-8 text-teal-400" />}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{item.title}</h3>
                                        <p className="text-slate-300 text-lg leading-[2.2] break-words flex-grow">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. الأقسام الأفقية (المقارنات العميقة) */}
                    {slide.type === 'grid-horizontal' && (
                        <div className="w-full flex flex-col items-center max-w-full my-auto">
                            <div className="flex items-center gap-4 mb-8">
                                {slide.icon}
                                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight text-center">{slide.title}</h2>
                            </div>
                            <p className="text-xl text-slate-300 mb-10 text-center max-w-4xl">{slide.description}</p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                                {slide.sections.map((sec, sIdx) => (
                                    <div key={sIdx} className="bg-slate-800/40 border border-slate-700/60 p-8 rounded-[2rem] shadow-xl flex flex-col hover:bg-slate-800/60 transition-colors">
                                        <h3 className={`text-2xl font-bold mb-6 border-b border-slate-700 pb-4 ${sec.color}`}>{sec.title}</h3>
                                        <div className="flex flex-col gap-6 flex-grow">
                                            {sec.items.map((item, iIdx) => (
                                                <div key={iIdx} className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/40">
                                                    <h4 className="text-xl font-bold text-white mb-3">{item.t}</h4>
                                                    <p className="text-slate-300 text-lg leading-[1.9] break-words">{item.d}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. جداول المقارنة (CSS Grid Table) */}
                    {slide.type === 'comparison-table' && (
                        <div className="w-full flex flex-col items-center max-w-full my-auto">
                            <div className="flex items-center gap-4 mb-8">
                                {slide.icon}
                                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight text-center">{slide.title}</h2>
                            </div>
                            <p className="text-xl text-slate-300 mb-8 text-center max-w-4xl">{slide.description}</p>

                            <div className="w-full overflow-x-auto rounded-3xl border border-slate-700/50 shadow-2xl">
                                <div className="min-w-[900px] grid grid-cols-3 bg-slate-800 text-xl font-bold text-center border-b-4 border-slate-600">
                                    {slide.headers.map((h, i) => (
                                        <div key={i} className={`p-6 ${i === 0 ? 'text-slate-200' : i === 1 ? 'text-cyan-300' : 'text-purple-300'}`}>{h}</div>
                                    ))}
                                </div>
                                {slide.rows.map((row, rIdx) => (
                                    <div key={rIdx} className="min-w-[900px] grid grid-cols-3 text-lg bg-slate-800/30 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                        {row.map((cell, cIdx) => (
                                            <div key={cIdx} className={`p-6 leading-[2] border-l border-slate-700/30 last:border-0 ${cIdx === 0 ? 'text-slate-200 font-bold' : cIdx === 1 ? 'text-cyan-100' : 'text-purple-100'}`}>
                                                {cell}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 5. الجدول الماسي الضخم (4 أعمدة) */}
                    {slide.type === 'mega-table' && (
                        <div className="w-full flex flex-col items-center max-w-full my-auto">
                            <div className="flex items-center gap-4 mb-8">
                                {slide.icon}
                                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight text-center">{slide.title}</h2>
                            </div>
                            <p className="text-xl text-slate-300 mb-8 text-center max-w-4xl">{slide.description}</p>

                            <div className="w-full overflow-x-auto rounded-3xl border border-slate-700/50 shadow-2xl">
                                <div className="min-w-[1000px] grid grid-cols-4 bg-slate-800 text-lg font-bold text-center border-b-4 border-slate-600">
                                    {slide.headers.map((h, i) => (
                                        <div key={i} className={`p-6 ${i === 0 ? 'text-slate-200' : i === 1 ? 'text-cyan-300' : i === 2 ? 'text-purple-300' : 'text-emerald-300'}`}>{h}</div>
                                    ))}
                                </div>
                                {slide.rows.map((row, rIdx) => (
                                    <div key={rIdx} className="min-w-[1000px] grid grid-cols-4 text-base lg:text-lg bg-slate-800/30 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                        {row.map((cell, cIdx) => (
                                            <div key={cIdx} className={`p-6 leading-[2] border-l border-slate-700/30 last:border-0 ${cIdx === 0 ? 'text-slate-200 font-bold text-center bg-slate-800/40' : cIdx === 1 ? 'text-cyan-100' : cIdx === 2 ? 'text-purple-100' : 'text-emerald-100'}`}>
                                                {cell}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 6. نكتة / فاصل ترفيهي */}
                    {slide.type === 'joke' && (
                        <div className="text-center flex flex-col items-center max-w-5xl my-auto bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-8 md:p-12 rounded-[3rem] shadow-2xl w-full">
                            {slide.icon}
                            <h2 className="text-3xl md:text-5xl font-black text-amber-400 mb-8 leading-tight">{slide.title}</h2>
                            <p className="text-xl md:text-3xl text-white mb-6 leading-[2] font-semibold">{slide.content}</p>
                            <div className="bg-slate-900/80 p-6 md:p-10 rounded-3xl border border-amber-500/20 w-full mt-4 shadow-inner">
                                <p className="text-2xl md:text-4xl text-amber-200 leading-[1.8] font-black">{slide.punchline}</p>
                            </div>
                        </div>
                    )}

                    {/* 7. شريحة الأسئلة التفاعلية (Quiz) */}
                    {slide.type === 'quiz' && (
                        <div className="flex flex-col items-center w-full max-w-5xl mx-auto my-auto">
                            <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xl font-bold mb-10 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                                <Lightbulb className="w-6 h-6 animate-pulse" /> {slide.title}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 leading-[1.8] text-center">
                                {slide.question}
                            </h2>
                            <div className="flex flex-col gap-6 w-full">
                                {slide.options.map((option, idx) => {
                                    let btnStateClass = "bg-slate-800/60 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]";
                                    let icon = <div className="w-8 h-8 rounded-full border border-slate-500 flex-shrink-0"></div>;

                                    if (isAnswered) {
                                        if (idx === slide.correctAnswer) {
                                            btnStateClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.2)] scale-[1.02]";
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
                                <div className="mt-10 p-8 rounded-2xl bg-cyan-500/10 border-r-4 border-cyan-500 text-cyan-100 text-2xl font-bold animate-fade-in w-full leading-[1.8] shadow-lg">
                                    {slide.feedback}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 8. شريحة النهاية الكبرى */}
                    {slide.type === 'completion' && (
                        <div className="flex flex-col items-center text-center py-10 my-auto">
                            <div className="relative mb-12">
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[80px] animate-pulse"></div>
                                <ShieldCheck className="w-48 h-48 text-emerald-400 relative z-10 drop-shadow-[0_0_40px_rgba(52,211,153,0.6)]" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-wide">{slide.title}</h1>
                            <p className="text-2xl text-slate-300 mb-16 max-w-4xl leading-[2]">{slide.content}</p>

                            <div className="bg-slate-800 border border-emerald-500/30 px-24 py-12 rounded-[3rem] shadow-2xl relative overflow-hidden w-full max-w-3xl">
                                <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-cyan-400 via-emerald-500 to-blue-500"></div>
                                <p className="text-slate-300 mb-6 text-2xl font-bold">علامتك في اختبارات الاستيعاب</p>
                                <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 flex items-center justify-center gap-6">
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
                                : 'bg-emerald-600 text-white shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:bg-emerald-500 hover:scale-[1.02] border border-emerald-400/50'
                            }`}
                    >
                        {currentSlide === lessonData.length - 1 ? 'العودة للقائمة' : 'التالي'}
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
        /* Custom Scrollbar for inner container */
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
          background: rgba(52, 211, 153, 0.8); 
        }
      `}} />
        </div>
    );
}