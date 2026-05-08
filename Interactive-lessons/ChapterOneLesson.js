(function () {
    "use strict";
    const { useState } = window.React;
    const html = window.htm.bind(window.React.createElement);

    // Simple SVG icon helpers
    const IconCheck = ({ size = 24, color = 'currentColor' }) => html`<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    const IconX = ({ size = 24, color = 'currentColor' }) => html`<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    const IconLogOut = ({ size = 16 }) => html`<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`;
    const IconChevronR = () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
    const IconChevronL = () => html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

    const slideIcons = { 'PieChart': '📊', 'Target': '🎯', 'ListChecks': '✅', 'Layers': '📚', 'Eye': '👁️', 'Layout': '📐', 'Scale': '⚖️', 'Palette': '🎨' };
    const SlideIcon = ({ name, cls }) => html`<span className=${cls || "text-4xl mb-4 block"}>${slideIcons[name] || '📄'}</span>`;

    const ChapterOneLesson = ({ onExit }) => {
        const [currentSlide, setCurrentSlide] = useState(0);
        const [score, setScore] = useState(0);
        const [selectedAnswer, setSelectedAnswer] = useState(null);
        const [isAnswered, setIsAnswered] = useState(false);

        const handleExit = () => {
            window.dispatchEvent(new CustomEvent('luminova:exit'));
            if (onExit) onExit();
        };

        const lessonData = [
            { type: 'intro', title: 'الفصل الأول: المعلومات المصورة ومعايير تصميمها', subtitle: 'ما هي المعلومات المصورة (Infographic)؟', content: 'يتكون الإنفوجرافيك من مقطعين: Information (معلومات) و Graphic (رسومات). يُطلق عليه أيضاً التصاميم المعلوماتية (Information Design) والبيانات التصويرية التفاعلية (Data Visualization).' },
            { type: 'content', title: 'مفهوم المعلومات المصورة', icon: 'PieChart', sections: [
                { title: 'ما هو؟', text: 'هو مخطط رسومي يتكون من مجموعة من الصور، والبيانات (مثل المخططات الدائرية والرسوم الشريطية)، مع وجود عدد قليل من الكلمات.' },
                { title: 'الهدف منه', text: 'يوفر نظرة عامة سهلة الفهم عن موضوع ما. ببساطة هو "تمثيل مرئي للمعلومات والبيانات".' },
                { title: 'أهميته', text: 'يجمع بين عناصر الصورة النصية والرسم البياني. ويُعد أداة فعالة لعرض البيانات وشرح المشكلات المعقدة بطريقة تؤدي بسرعة إلى الفهم الأفضل.' }
            ]},
            { type: 'quiz', title: 'سؤال تفاعلي 🧠', question: 'أي من المصطلحات التالية يُطلق أيضاً على الإنفوجرافيك؟', options: ['التصاميم النصية المعقدة', 'البيانات التصويرية التفاعلية (Data Visualization)', 'الرسومات غير المنظمة'], correctAnswer: 1, feedback: 'إجابة صحيحة! الإنفوجرافيك هو أداة لتحويل البيانات إلى تمثيل بصري تفاعلي.' },
            { type: 'content', title: 'استخدامات المعلومات المصورة', icon: 'Target', description: 'الإنفوجرافيك ممتع، جذاب، وسهل المشاركة. لديه فوائد لجميع صناع المحتوى:', bullets: [
                'للمسوقين: جذب المزيد من حركة الزوار على الموقع، زيادة الرؤية والوعي بالعلامة التجارية.',
                'للمعلمين والمدربين: شرح المفاهيم الصعبة أو تحليل المعلومات المعقدة لتسهيل فهمها.',
                'للمنظمات غير الربحية: نشر الوعي حول قضية اجتماعية معينة.'
            ]},
            { type: 'content', title: 'نصائح لإنشاء معلومات مصورة بشكل صحيح', icon: 'ListChecks', bullets: [
                'التركيز على الجمهور المستهدف والرسالة الأساسية.',
                'البدء بعنوان قوي: العناوين الجيدة هي مفتاح الاحتفاظ بالجمهور.',
                'التوازن: تحقيق التوازن بين الرسوم البيانية والعناصر المرئية.',
                'البساطة: إبقاؤه بسيطاً لعدم إجهاد القارئ.'
            ]},
            { type: 'content', title: 'أنواع المعلومات المصورة', icon: 'Layers', sections: [
                { title: 'الإحصائية', text: 'تستخدم الرسوم البيانية الإحصائية لتقديم الأبحاث والحقائق والأرقام بطريقة مرئية.' },
                { title: 'العملية', text: 'تستخدم المخططات الانسيابية لتوجيه القراء خلال سلسلة خطوات أو لتبسيط عملية اتخاذ القرار.' },
                { title: 'الزمنية', text: 'مفيدة لعرض المعلومات بترتيب زمني (مثل تطور شيء بمرور الوقت).' },
                { title: 'التشريحية', text: 'تساعد في إبراز وشرح المكونات وأجزاء المنتج وخصائصه.' },
                { title: 'الهرمية', text: 'تحتوي عادة على هرم للمساعدة في عرض مستويات مختلفة من المعلومات.' }
            ]},
            { type: 'quiz', title: 'تطبيق عملي 🎯', question: 'إذا أردت شرح "خطوات التسجيل في المنصة التعليمية"، ما هو أفضل نوع إنفوجرافيك تستخدمه؟', options: ['الإنفوجرافيك الإحصائي', 'الإنفوجرافيك العملي (المخططات الانسيابية)', 'الإنفوجرافيك التشريحي'], correctAnswer: 1, feedback: 'ممتاز! الإنفوجرافيك العملي هو الأنسب لشرح تسلسل الخطوات والإجراءات.' },
            { type: 'content', title: 'معايير تصميم الرسوم - (الشكل والوضوح)', icon: 'Eye', sections: [
                { title: 'أولاً: الشكل', text: 'هو المنظر الخارجي المحدد بحدود. يجب أن يكون الرسم في "منطقة الأمان" بترك هامش (2 إلى 2.5 سم) في الحواف.' },
                { title: 'ثانياً: الوضوح', text: 'أن تكون العناصر والكتابة واضحة بخط كبير يتناسب مع الرسم. مساحة الرسم يجب ألا تقل عن 1/4 مساحة اللوحة.' },
                { title: 'التركيز', text: 'تركز الصورة على فكرة واحدة فقط، وتُستبعد التفاصيل غير الملائمة المشتتة للانتباه.' }
            ]},
            { type: 'content', title: 'معايير التصميم - (التركيب والتنظيم)', icon: 'Layout', sections: [
                { title: 'رابعاً: التركيب', text: 'ترتيب العناصر لجذب الانتباه. في الثقافة العربية منطقة جذب الانتباه تبدأ من أعلى اليمين.' },
                { title: 'خامساً: التناسق', text: 'تناسق وانسجام الألوان بين جميع عناصر الصورة لتأكيد الأفكار الأساسية.' },
                { title: 'سادساً: التنظيم', text: 'ترتيب العناصر بطريقة منطقية تساعد على تتبع الفكرة (مثل استخدام الأسهم في دورة حياة الفراشة).' }
            ]},
            { type: 'content', title: 'معايير التصميم - (التوازن)', icon: 'Scale', description: 'سابعاً التوازن: توزيع العناصر بشكل متوازن يُشعر المشاهد بالراحة.', bullets: [
                'التوازن النمطي: يعطي إحساساً بالثبات.',
                'التوازن غير النمطي: يسمح بالابتكار وفيه حيوية أكبر.',
                'قاعدة: وضع العناصر المترابطة بشكل متجاور لتُدرك ككتلة واحدة.'
            ]},
            { type: 'content', title: 'معايير التصميم - (الألوان والتباين)', icon: 'Palette', sections: [
                { title: 'تاسعاً: توظيف الألوان', text: 'ألوان أساسية (أحمر، أصفر، أزرق). ألوان ثانوية: دمج لونين أساسيين. ألوان هجينة: دمج أساسي مع ثانوي.' },
                { title: 'عاشراً: التباين', text: '(الشكل والأرضية) وضع عناصر الصورة بشكل واضح. ويكون التباين بين العناصر وبعضها، أو بين الشكل والخلفية.' }
            ]},
            { type: 'quiz', title: 'السؤال الأخير 🏆', question: 'حسب الثقافة العربية ومعيار "التركيب"، أين تقع منطقة جذب الانتباه الأولى للمشاهد؟', options: ['في المركز مباشرة', 'أعلى اليسار', 'أعلى اليمين'], correctAnswer: 2, feedback: 'رائع جداً! بسبب اتجاه القراءة باللغة العربية، تنجذب العين دائماً لأعلى اليمين أولاً.' },
            { type: 'completion', title: 'أكملت الفصل الأول بنجاح! 🎉', content: 'لقد أتممت دراسة كل ما يخص المعلومات المصورة ومعايير تصميمها الاحترافية.' }
        ];

        const handleAnswer = (index) => {
            if (isAnswered) return;
            setSelectedAnswer(index);
            setIsAnswered(true);
            if (index === lessonData[currentSlide].correctAnswer) setScore(s => s + 1);
        };

        const handleNext = () => {
            if (currentSlide < lessonData.length - 1) {
                setCurrentSlide(currentSlide + 1);
                setSelectedAnswer(null);
                setIsAnswered(false);
            } else {
                handleExit();
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

        const renderSections = (sections) => html`
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                ${sections.map((sec, idx) => html`
                    <div key=${idx} className=${`bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all ${sections.length % 2 !== 0 && idx === sections.length - 1 ? 'md:col-span-2' : ''}`}>
                        <h3 className="text-lg font-bold text-cyan-300 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,1)]"></div>
                            ${sec.title}
                        </h3>
                        <p className="text-white/80 leading-relaxed text-sm whitespace-pre-line">${sec.text}</p>
                    </div>
                `)}
            </div>`;

        const renderBullets = (bullets) => html`
            <div className="flex flex-col gap-3 w-full max-w-4xl">
                ${bullets.map((bullet, idx) => html`
                    <div key=${idx} className="flex items-start gap-4 bg-gradient-to-r from-white/5 to-transparent p-4 rounded-xl border-r-4 border-cyan-500">
                        <div className="mt-1.5 min-w-[8px] h-[8px] rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                        <p className="text-white/85 text-lg leading-relaxed">${bullet}</p>
                    </div>
                `)}
            </div>`;

        return html`
            <div className="w-full min-h-screen bg-[#0a0f1c] text-white flex items-center justify-center p-4 sm:p-8 overflow-hidden" dir="rtl" style=${{ fontFamily: "'Cairo', 'Segoe UI', sans-serif" }}>
                <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none"></div>
                <div className="fixed bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-5xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl p-6 sm:p-10 flex flex-col min-h-[70vh] transition-all duration-500">

                    <!-- Progress bar & exit -->
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                        <button onClick=${handleExit} className="flex items-center gap-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 px-5 py-2.5 rounded-xl text-sm font-bold border border-white/5 transition-all">
                            <${IconLogOut} /> إنهاء الدرس
                        </button>
                        <div className="flex-1 mr-8 ml-4">
                            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-gradient-to-l from-cyan-400 via-blue-500 to-purple-600 transition-all duration-700 ease-out" style=${{ width: progress + '%' }}></div>
                            </div>
                            <div className="flex justify-between text-white/40 text-xs mt-2 font-medium">
                                <span>البداية</span>
                                <span>شريحة ${currentSlide + 1} من ${lessonData.length}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Slide content -->
                    <div className="flex-1 flex flex-col justify-center items-center w-full" key=${currentSlide}>

                        ${slide.type === 'intro' && html`
                            <div className="text-center flex flex-col items-center animate-fade-in">
                                <span className="text-8xl mb-6 drop-shadow-xl">💡</span>
                                <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-cyan-300 to-purple-400 mb-6 leading-tight">${slide.title}</h1>
                                <h2 className="text-xl text-cyan-100 mb-6 font-medium bg-white/5 px-6 py-2 rounded-full border border-white/10">${slide.subtitle}</h2>
                                <p className="text-lg text-white/70 max-w-2xl leading-relaxed">${slide.content}</p>
                            </div>
                        `}

                        ${slide.type === 'content' && html`
                            <div className="w-full flex flex-col items-center animate-fade-in">
                                <div className="flex items-center gap-4 mb-8">
                                    <${SlideIcon} name=${slide.icon} cls="text-5xl" />
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">${slide.title}</h2>
                                </div>
                                ${slide.description && html`<p className="text-xl text-cyan-200 mb-6 text-center">${slide.description}</p>`}
                                ${slide.sections && renderSections(slide.sections)}
                                ${slide.bullets && renderBullets(slide.bullets)}
                            </div>
                        `}

                        ${slide.type === 'quiz' && html`
                            <div className="flex flex-col items-center w-full max-w-3xl animate-fade-in">
                                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm font-bold mb-8 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                    ⚡ ${slide.title}
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 leading-relaxed text-center">${slide.question}</h2>
                                <div className="flex flex-col gap-4 w-full">
                                    ${slide.options.map((option, idx) => {
                                        let cls = "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/30";
                                        let icon = html`<div className="w-6 h-6 rounded-full border border-white/20 flex-shrink-0"></div>`;
                                        if (isAnswered) {
                                            if (idx === slide.correctAnswer) {
                                                cls = "bg-green-500/20 border-green-500/50 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] scale-[1.02]";
                                                icon = html`<${IconCheck} size=${24} color="#4ade80" />`;
                                            } else if (idx === selectedAnswer) {
                                                cls = "bg-red-500/20 border-red-500/50 text-red-300";
                                                icon = html`<${IconX} size=${24} color="#f87171" />`;
                                            } else {
                                                cls = "bg-white/5 border-white/5 text-white/30 opacity-50";
                                            }
                                        }
                                        return html`
                                            <button key=${idx} onClick=${() => handleAnswer(idx)} disabled=${isAnswered}
                                                className=${`w-full text-right p-5 rounded-2xl border transition-all duration-300 flex justify-between items-center text-lg shadow-lg ${cls}`}>
                                                <span className="pl-4">${option}</span>
                                                ${icon}
                                            </button>`;
                                    })}
                                </div>
                                ${isAnswered && html`
                                    <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-100 text-lg font-medium w-full text-center shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                                        ${slide.feedback}
                                    </div>
                                `}
                            </div>
                        `}

                        ${slide.type === 'completion' && html`
                            <div className="flex flex-col items-center text-center animate-fade-in">
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-green-500/30 rounded-full blur-[40px] animate-pulse"></div>
                                    <span className="text-8xl relative z-10 drop-shadow-xl block">✅</span>
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 drop-shadow-lg">${slide.title}</h1>
                                <p className="text-xl text-white/70 mb-10 max-w-lg">${slide.content}</p>
                                <div className="bg-white/5 border border-white/10 px-10 py-6 rounded-3xl backdrop-blur-md shadow-2xl">
                                    <p className="text-white/60 mb-2">نتيجتك في التقييم التفاعلي</p>
                                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                                        ${score} <span className="text-2xl text-white/40">من</span> ${totalQuizzes}
                                    </div>
                                </div>
                            </div>
                        `}
                    </div>

                    <!-- Navigation -->
                    <div className="mt-10 flex justify-between items-center pt-6 border-t border-white/10">
                        <button onClick=${handlePrev} disabled=${currentSlide === 0}
                            className=${`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'text-white/80 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10'}`}>
                            <${IconChevronR} /> السابق
                        </button>
                        <button onClick=${handleNext} disabled=${slide.type === 'quiz' && !isAnswered}
                            className=${`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-lg transition-all duration-300 ${slide.type === 'quiz' && !isAnswered ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-white/5' : 'bg-gradient-to-l from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 border border-cyan-400/50'}`}>
                            ${currentSlide === lessonData.length - 1 ? 'إنهاء الدرس والعودة' : 'التالي'}
                            ${currentSlide !== lessonData.length - 1 && html`<${IconChevronL} />`}
                        </button>
                    </div>
                </div>
            </div>
        `;
    };

    // Register for dynamic loading by SmartWrapper
    window.__LUMINOVA_ACTIVE_LESSON = ChapterOneLesson;

})();
