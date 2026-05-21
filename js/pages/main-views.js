(function () {
    "use strict";
    if (!window.__LUMINOVA) return;
    const { useState, useEffect, useMemo, useCallback } = window.React;
    const html = window.htm.bind(window.React.createElement);
    const Luminova = window.__LUMINOVA;

Luminova.Components.TimelineFeed = ({ items, students, subjects, lang, onQuizClick, onSummaryClick }) => {
        const PAGE_SIZE_INIT = 10;
        const PAGE_SIZE_MORE = 5;
        const [visibleCount, setVisibleCount] = useState(PAGE_SIZE_INIT);

        if (!items.length) return html`<div className="text-center py-10 opacity-50">${Luminova.i18n[lang].emptyState}</div>`;

        const visibleItems = items.slice(0, visibleCount);
        const hasMore = visibleCount < items.length;

        return html`
        <div className="space-y-6 relative border-s border-zinc-200 dark:border-zinc-800 ml-3 mr-3 px-4">
            ${visibleItems.map(item => {
            const student = Luminova.getStudent(item.studentId, students);
            const subject = subjects.find(s => s.id === item.subjectId) || {};
            const isQuizItem = item.isSingleQuestion;
            return html`
                    <div key=${item.id} className="relative">
                        <span className="absolute flex items-center justify-center w-9 h-9 bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 rounded-full -start-[18px] ring-8 ring-[#0A0514] mt-2 shadow-[0_0_15px_rgba(217,70,239,0.2)] z-10 transition-transform hover:scale-110">
                            ${isQuizItem ? Luminova.Icons.CheckCircle() : Luminova.Icons.Book()}
                        </span>
                        <${Luminova.Components.GlassCard} className="ms-6">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <${Luminova.Components.Avatar} name=${student.nameAr || student.name} image=${student.image} isVIP=${student.isVIP} isVerified=${student.isVerified} isFounder=${student.isFounder || (student.id === 's_founder')} size="w-10 h-10" />
                                <h4 className="font-bold whitespace-normal break-words flex items-center gap-1.5 flex-wrap flex-1 min-w-0" style=${{ wordBreak: 'normal', overflowWrap: 'anywhere' }}>
                                    ${lang === 'ar' ? (student.nameAr || student.name) : (student.nameEn || student.name)}
                                    ${student.isVIP && html`<span className="text-xs text-brand-DEFAULT bg-brand-DEFAULT/10 px-2 py-0.5 rounded-full shrink-0">VIP ✨</span>`}
                                    ${!student.isFounder && student.role === 'doctor' && html`<span className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full font-black shrink-0">🎓 ${lang === 'ar' ? 'دكتور' : 'Doctor'}</span>`}
                                </h4>
                            </div>
                            <div className="flex items-center justify-between gap-2 mb-4 px-1">
                                <p className="text-xs font-bold opacity-70 flex-1 min-w-0 truncate">${subject[`name${lang === 'ar' ? 'Ar' : 'En'}`] || subject.nameAr || subject.nameEn}</p>
                                <span className="text-xs opacity-50 shrink-0">${Luminova.formatDate(item.timestamp, lang)}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">${item[`title${lang === 'ar' ? 'Ar' : 'En'}`] || item.titleAr || item.titleEn}</h3>
                            <${Luminova.Components.SmartText} text=${item[`content${lang === 'ar' ? 'Ar' : 'En'}`] || item.contentAr || item.contentEn} lang=${lang} />
                            ${((item.mediaUrls && item.mediaUrls.length > 0) || item.mediaUrl) ? html`
                                <div className="mt-4">
                                    <button onClick=${() => onSummaryClick && onSummaryClick(item.id)} className="w-full py-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-white transition-all duration-300 rounded-2xl font-black flex items-center justify-center gap-3 border border-cyan-500/30 shadow-sm group/btn">
                                        <span className="text-xl">📎</span>
                                        <span className="tracking-widest uppercase text-xs">${lang === 'ar' ? 'عرض المرفقات والشرح' : 'View Attachments'}</span>
                                    </button>
                                </div>
                            ` : null}
                            ${item.isSingleQuestion && html`
                                <div className="mt-4">
                                    <${Luminova.Components.Button} onClick=${() => onQuizClick(item.parentQuiz)}>${Luminova.i18n[lang].startQuiz}</${Luminova.Components.Button}>
                                </div>
                            `}
                        </${Luminova.Components.GlassCard}>
                    </div>
                `;
            })}

            ${hasMore && html`
                <div className="flex justify-center pt-4 pb-2">
                    <button
                        onClick=${() => setVisibleCount(prev => prev + PAGE_SIZE_MORE)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all block mx-auto mt-6 w-full sm:w-auto text-center"
                    >
                        <span>${lang === 'ar' ? 'عرض المزيد' : 'Load More'}</span>
                        <span className="opacity-50 text-sm">(${items.length - visibleCount} ${lang === 'ar' ? 'متبقية' : 'remaining'})</span>
                    </button>
                </div>
            `}
        </div>
    `;
    };

    Luminova.Pages = {};

    Luminova.Pages.HomePage = ({ data, lang, setView, setActiveSummary }) => {
        if (!data || !data.summaries || !data.quizzes || !data.news || !data.students) {
            return html`
                <div className="flex items-center justify-center min-h-[60vh] p-4">
                    <div className="bg-white/5 backdrop-blur-2xl p-12 text-center max-w-md animate-fade-in border border-white/10 rounded-[2.5rem] shadow-sm">
                        <div className="text-7xl mb-8 animate-bounce">⚠️</div>
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight">
                            ${lang === 'ar' ? 'خطأ في تحميل البيانات' : 'Data Load Error'}
                        </h2>
                        <p className="text-zinc-500 dark:text-white/50 font-bold mb-10 leading-relaxed text-lg">
                            ${lang === 'ar' 
                                ? 'حدث خطأ غير متوقع أثناء تحميل ملفات النظام. يرجى إعادة تحميل التطبيق.' 
                                : 'An unexpected error occurred while loading system files. Please reload the application.'}
                        </p>
                        <button onClick=${() => window.location.reload()} 
                            className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all text-lg">
                            ${lang === 'ar' ? 'تحديث النظام الآن ↻' : 'Reload System Now ↻'}
                        </button>
                    </div>
                </div>
            `;
        }

        const [newsVisibleCount, setNewsVisibleCount] = window.React.useState(8);
        const [latestCert, setLatestCert] = window.React.useState(null);
        const [newsSearchQuery, setNewsSearchQuery] = window.React.useState('');
        const [showSearch, setShowSearch] = window.React.useState(false);

        window.React.useEffect(() => {
            const handleCerts = (certs) => {
                if (!certs || !certs.length) return;
                let featured = certs.filter(c => c.isFeatured);
                featured.sort((a,b) => new Date(b.date) - new Date(a.date));
                if (featured.length > 0) {
                    setLatestCert(featured[0]);
                } else {
                    const allSorted = [...certs].sort((a,b) => new Date(b.date) - new Date(a.date));
                    setLatestCert(allSorted[0]);
                }
            };

            // Ensure loadCertificatesData exists (from certificate-engine.js)
            if (window.loadCertificatesData) {
                window.loadCertificatesData().then((certs) => {
                    handleCerts(certs);
                });
            } else {
                // If it wasn't loaded yet, try to load it dynamically
                const script = document.createElement('script');
                script.src = 'js/pages/certificate-engine.js?t=' + new Date().getTime();
                script.onload = () => {
                    if(window.loadCertificatesData) {
                        window.loadCertificatesData().then((certs) => {
                            handleCerts(certs);
                        });
                    }
                };
                document.body.appendChild(script);
            }
        }, []);

        const topContributors = useMemo(() => {
            // Count contributions from: summaries + news + quiz questions + quiz creation
            const counts = {};

            const normalizeId = (id) => {
                if (!id) return null;
                if (id === 's_founder' || id === 's_founder_hardcoded' || id === 'founder_1') return Luminova.FOUNDER.id;
                return id;
            };

            data.summaries.forEach(s => {
                const sId = normalizeId(s.studentId);
                if (sId) counts[sId] = (counts[sId] || 0) + 1;
            });

            data.quizzes.forEach(quiz => {
                let authorCounts = {};
                (quiz.questions || []).forEach(q => {
                    const sId = normalizeId(q.studentId);
                    if (sId) authorCounts[sId] = (authorCounts[sId] || 0) + 1;
                });

                let maxQuestions = Math.max(0, ...Object.values(authorCounts));

                for (const [studentId, count] of Object.entries(authorCounts)) {
                    let earnedPoints = (count === maxQuestions && maxQuestions > 0) ? 2 : 1;
                    counts[studentId] = (counts[studentId] || 0) + earnedPoints;
                }
            });

            if (!counts[Luminova.FOUNDER.id]) {
                counts[Luminova.FOUNDER.id] = 0;
            }
            counts[Luminova.FOUNDER.id] = (counts[Luminova.FOUNDER.id] || 0) + 1;

            const sorted = Object.entries(counts)
                .map(([id, score]) => ({ id, score }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);

            return sorted
                .map(st => ({ student: Luminova.getStudent(st.id, data.students), score: st.score }))
                .filter(x => x.student && x.student.id !== 'unknown');
        }, [data.summaries, data.quizzes, data.students]);

        // Sorting official news newest first
        const sortedNews = [...(data.news || [])].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        const filteredNews = newsSearchQuery.trim() ? sortedNews.filter(n => {
            const tAr = n.titleAr || n.title || '';
            const tEn = n.titleEn || n.title || '';
            const query = newsSearchQuery.toLowerCase();
            return tAr.toLowerCase().includes(query) || tEn.toLowerCase().includes(query);
        }) : sortedNews;
        const visibleNews = newsSearchQuery.trim() ? filteredNews : filteredNews.slice(0, newsVisibleCount);

        return html`
        <div className="space-y-12 animate-fade-in pb-10">
            <!-- Section 1: Honor Roll -->
            ${topContributors.length > 0 && html`
                <div className="mb-10">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-white">${Luminova.i18n[lang].topContributors}</h2>
                    <div className="honor-roll-container flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-6 w-full px-4">
                        ${topContributors.map((c, i) => html`
                            <${Luminova.Components.GlassCard} key=${c.student.id} className="honor-roll-card min-w-[140px] sm:min-w-[180px] flex-shrink-0 snap-center text-center flex flex-col items-center border-b-4 border-b-fuchsia-500/50 hover:border-b-cyan-400 transition-all duration-500 p-3 sm:p-5">
                                <div className="absolute top-2 right-2 text-xl font-black opacity-10 italic">#${i + 1}</div>
                                <${Luminova.Components.Avatar} name=${c.student.nameAr || c.student.name} image=${c.student.image} isVIP=${c.student.isVIP} isFounder=${c.student.isFounder || c.student.id === 's_founder'} isVerified=${c.student.isVerified} size="w-12 h-12 sm:w-20 sm:h-20 mb-2 sm:mb-4 shadow-xl shadow-fuchsia-500/10" />
                                <h3 className="font-black text-sm sm:text-base text-zinc-900 dark:text-white">${lang === 'ar' ? (c.student.nameAr || c.student.name) : (c.student.nameEn || c.student.name)}</h3>
                                <div className="text-[10px] sm:text-xs font-bold text-fuchsia-400 mt-1 sm:mt-2 uppercase tracking-widest">${c.score} ${lang === 'ar' ? 'مساهمة' : 'Contributions'}</div>
                            </${Luminova.Components.GlassCard}>
                        `)}
                    </div>
                </div>
            `}

            <!-- Section 2: Honor Roll Spotlight (Certificates) -->
            ${latestCert && Luminova.Components.CertificateImage && html`
                <div className="mb-10 w-full animate-fade-in">
                    <div className="relative overflow-hidden bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/10 p-10 pt-12">
                        <!-- Decorative bg -->
                        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            
                            <!-- Content Side (RTL native: right on Desktop) -->
                            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-start space-y-6">
                                <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white">
                                    ${lang === 'ar' ? 'نتوج التميز الأكاديمي' : 'Crowning Academic Excellence'}
                                </h2>
                                <p className="text-zinc-400 text-base md:text-lg font-medium leading-relaxed max-w-lg">
                                    ${lang === 'ar' 
                                        ? 'نقدر ونوثق جهود طلابنا الاستثنائية. كل شهادة هي قصة نجاح موثقة ومحفوظة في اللوحة الشرفية للمنصة عبر نظام تشفير متقدم يعتمد على الاستجابة السريعة (QR Code).' 
                                        : 'We appreciate and document our students\' exceptional efforts. Each certificate is a success story, permanently archived via advanced QR cryptographic systems.'}
                                </p>
                                <button
                                    onClick=${() => setView('certificates')}
                                    className="inline-flex flex-row items-center justify-center gap-3 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-black py-4 px-8 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 text-lg sm:text-xl w-full sm:w-auto">
                                    <span>🏆</span>
                                    <span>${lang === 'ar' ? 'تصفح لوحة الشرف والشهادات' : 'Browse Honor Roll & Archive'}</span>
                                </button>
                            </div>

                            <!-- Showcase Side (Image) -->
                            <div className="w-full md:max-w-md">
                                <div className="bg-white/5 p-2 rounded-[24px] backdrop-blur-md border border-white/10 shadow-sm rotate-1 hover:rotate-0 transition-transform duration-300">
                                    <${Luminova.Components.CertificateImage} 
                                        certificate=${latestCert} 
                                        lang=${lang} 
                                        mode="thumb" 
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            `}

            <!-- Section 3: Official News -->


            ${sortedNews.length > 0 && html`
                <div className="mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <h2 className="text-3xl font-black flex items-center gap-2">${Luminova.i18n[lang].news}</h2>
                        
                        <div className="relative w-full sm:w-[350px]">
                            <span className="absolute inset-y-0 start-4 flex items-center opacity-40 text-xl pointer-events-none">🔍</span>
                            <input 
                                type="text" 
                                value=${newsSearchQuery} 
                                onChange=${(e) => setNewsSearchQuery(e.target.value)} 
                                placeholder=${lang === 'ar' ? 'بحث في الأخبار...' : 'Search news...'} 
                                className="w-full px-12 py-3.5 text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 bg-zinc-100 dark:bg-zinc-900 backdrop-blur-xl rounded-full outline-none focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 shadow-inner transition-all duration-300" 
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${visibleNews.map((n) => {
                            const author = Luminova.getStudent(n.studentId, data.students);
                            return html`
                                <${Luminova.Components.GlassCard} key=${n.id || n.timestamp || Math.random().toString(36)} className=${`border-l-4 ${n === sortedNews[0] ? 'border-l-zinc-400 dark:border-l-zinc-600' : 'border-l-zinc-300 dark:border-l-zinc-700'}`}>
                                    ${n.studentId && html`
                                        <div className="flex items-center gap-3 mb-4 opacity-80 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                                            <${Luminova.Components.Avatar} name=${author.nameAr || author.name} nameEn=${author.nameEn} image=${author.image} isVerified=${author.isVerified} isFounder=${author.isFounder} size="w-8 h-8" />
                                            <div className="text-sm font-bold flex items-center gap-2 flex-wrap">
                                                <span>${lang === 'ar' ? 'الناشر:' : 'Publisher:'}</span>
                                                <span className="whitespace-normal break-words" style=${{ wordBreak: 'normal', overflowWrap: 'anywhere' }}>${lang === 'ar' ? (author.nameAr || author.name) : (author.nameEn || author.name)}</span>
                                                ${author.isVIP && html`<span className="text-xs text-brand-DEFAULT">✨</span>`}
                                                ${author.isFounder && html`<span className="text-[10px] bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white px-2.5 py-0.5 rounded-full font-black tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.3)]">${Luminova.i18n[lang].founder}</span>`}
                                                ${!author.isFounder && author.role === 'doctor' && html`<span className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full font-black">🎓 ${lang === 'ar' ? 'دكتور' : 'Doctor'}</span>`}
                                            </div>
                                        </div>
                                    `}
                                    <h3 className="text-xl font-bold mb-2">${n[`title${lang === 'ar' ? 'Ar' : 'En'}`] || n.titleAr || n.titleEn}</h3>
                                    <${Luminova.Components.SmartText} text=${n[`content${lang === 'ar' ? 'Ar' : 'En'}`] || n.contentAr || n.contentEn} lang=${lang} />
                                    ${((n.mediaUrls && n.mediaUrls.length > 0) || n.mediaUrl) ? html`
                                        <div className="mt-4">
                                            <button onClick=${() => { setActiveSummary(n.id); setView('summaryDetail'); }} className="w-full py-3.5 bg-brand-DEFAULT/10 hover:bg-brand-DEFAULT text-brand-DEFAULT hover:text-white transition-all rounded-2xl font-black flex items-center justify-center gap-3 border border-brand-DEFAULT/20 shadow-sm">
                                                <span className="text-2xl">📎</span>
                                                <span className="tracking-wide uppercase text-sm">${lang === 'ar' ? 'عرض المرفقات المنشورة' : 'View Attachments'}</span>
                                            </button>
                                        </div>
                                    ` : null}
                                    <div className="text-xs opacity-50 mt-4 font-semibold">${Luminova.formatDate(n.timestamp, lang)}</div>
                                </${Luminova.Components.GlassCard}>
                            `;
                        })}
                        
                        ${visibleNews.length === 0 && newsSearchQuery.trim() !== '' && html`
                            <div className="col-span-full text-center py-10 opacity-50 font-bold text-lg dark:text-gray-300">
                                ${lang === 'ar' ? 'لا توجد أخبار مطابقة لبحثك' : 'No news matches your search'}
                            </div>
                        `}

                        <div className="col-span-full flex justify-center items-center mt-6">
                            ${(!newsSearchQuery.trim()) && (visibleNews.length < sortedNews.length) && html`
                                <button onClick=${() => setNewsVisibleCount(prev => prev + 5)} className="w-full sm:w-auto px-8 py-3 bg-brand-DEFAULT hover:bg-brand-hover text-white font-bold rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                                    <span>${lang === 'ar' ? 'عرض المزيد' : 'Load More'}</span>
                                    <span className="opacity-70 text-sm font-normal">(${sortedNews.length - newsVisibleCount} ${lang === 'ar' ? 'متبقية' : 'remaining'})</span>
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `}
        </div>
    `;
    };

    Luminova.Pages.AcademicHierarchyPage = ({ data, lang, setView, setActiveQuiz, setActiveSummary }) => {
        if (!data || !data.years || !data.semesters || !data.subjects || !data.summaries || !data.quizzes || !data.students) {
            return html`
                <div className="flex items-center justify-center min-h-[60vh] p-4 text-center">
                    <div className="bg-white/5 backdrop-blur-2xl p-12 border border-white/10 rounded-[2.5rem] shadow-sm max-w-md animate-fade-in">
                        <div className="text-7xl mb-8">📂</div>
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">
                            ${lang === 'ar' ? 'فشل تحميل المكتبة' : 'Library Load Failed'}
                        </h2>
                        <p className="text-zinc-500 dark:text-white/50 font-bold mb-8">
                            ${lang === 'ar' ? 'ملفات البيانات تالفة أو مفقودة. يرجى العودة للرئيسية.' : 'Data files are corrupted or missing. Please return home.'}
                        </p>
                        <button onClick=${() => setView('home')} className="w-full py-4 bg-white text-zinc-900 rounded-2xl font-black shadow-sm">
                            ${lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                        </button>
                    </div>
                </div>
            `;
        }

        const [selectedYear, setSelectedYear] = useState(data.years?.[0] || null);
        const [selectedSem, setSelectedSem] = useState(data.semesters?.find(s => s.yearId === data.years?.[0]?.id) || null);
        const [selectedSub, setSelectedSub] = useState(null);
        const [selectedSummaryId, setSelectedSummaryId] = useState(null);
        const [selectedCategory, setSelectedCategory] = useState(null);
        const [selectedChapter, setSelectedChapter] = useState('all');
        const [searchQuery, setSearchQuery] = useState('');
        const [selectedAuthor, setSelectedAuthor] = useState(null);
        const [isAuthorOpen, setIsAuthorOpen] = useState(false);
        const [visibleCount, setVisibleCount] = useState(6);

        useEffect(() => {
            if (data.semesters && selectedYear) {
                const sems = data.semesters.filter(s => s.yearId === selectedYear.id);
                setSelectedSem(sems.length > 0 ? sems[0] : null);
            }
        }, [selectedYear?.id, data.semesters]);

        useEffect(() => {
            if (selectedSub) {
                setSearchQuery('');
                setSelectedAuthor(null);
                setSelectedCategory(null);
                setSelectedChapter('all');
                window.history.pushState({ lmv: 'academics-subject' }, '', '');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, [selectedSub?.id]);

        useEffect(() => {
            if (selectedSummaryId) {
                window.history.pushState({ lmv: 'academics-summary' }, '', '');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, [selectedSummaryId]);

        useEffect(() => {
            const onPop = () => {
                if (selectedSummaryId) {
                    setSelectedSummaryId(null);
                } else if (selectedSub) {
                    setSelectedSub(null);
                }
            };
            window.addEventListener('popstate', onPop);
            return () => window.removeEventListener('popstate', onPop);
        }, [selectedSub, selectedSummaryId]);

        const semesters = selectedYear ? data.semesters.filter(s => s.yearId === selectedYear.id) : [];
        const subjects = selectedSem ? data.subjects.filter(s => s.semesterId === selectedSem.id) : [];
        
        const rawSummaries = selectedSub ? data.summaries.filter(s => s.subjectId === selectedSub.id) : [];
        const rawQuizzes = selectedSub ? data.quizzes.filter(q => q.subjectId === selectedSub.id) : [];

        const authors = useMemo(() => {
            const list = new Set();
            rawSummaries.forEach(s => {
                const author = Luminova.getStudent(s.studentId, data.students);
                const name = lang === 'ar' ? (author.nameAr || author.name) : (author.nameEn || author.name);
                if (name && name !== 'غير معروف' && name !== 'Unknown') list.add(name);
            });
            rawQuizzes.forEach(q => {
                const author = Luminova.getStudent(q.publisherId, data.students);
                const name = lang === 'ar' ? (author.nameAr || author.name) : (author.nameEn || author.name);
                if (name && name !== 'غير معروف' && name !== 'Unknown') list.add(name);
            });
            return Array.from(list).sort();
        }, [rawSummaries, rawQuizzes, data.students, lang]);

        const filteredSummaries = useMemo(() => {
            return rawSummaries.filter(s => {
                const author = Luminova.getStudent(s.studentId, data.students);
                const authorName = lang === 'ar' ? (author.nameAr || author.name) : (author.nameEn || author.name);
                const matchesAuthor = !selectedAuthor || selectedAuthor === authorName;
                const q = searchQuery.toLowerCase();
                const title = (s[`title${lang === 'ar' ? 'Ar' : 'En'}`] || s.titleAr || s.titleEn || '').toLowerCase();
                const content = (s[`content${lang === 'ar' ? 'Ar' : 'En'}`] || s.contentAr || s.contentEn || '').toLowerCase();
                const matchesSearch = title.includes(q) || content.includes(q);
                return matchesAuthor && matchesSearch;
            }).sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        }, [rawSummaries, selectedAuthor, searchQuery, data.students, lang]);

        const filteredQuizzes = useMemo(() => {
            return rawQuizzes.filter(q => {
                const author = Luminova.getStudent(q.publisherId, data.students);
                const authorName = lang === 'ar' ? (author.nameAr || author.name) : (author.nameEn || author.name);
                const matchesAuthor = !selectedAuthor || selectedAuthor === authorName;
                const search = searchQuery.toLowerCase();
                const title = (q[`title${lang === 'ar' ? 'Ar' : 'En'}`] || q.titleAr || q.titleEn || q.title || '').toLowerCase();
                const matchesSearch = title.includes(search);
                return matchesAuthor && matchesSearch;
            }).sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        }, [rawQuizzes, selectedAuthor, searchQuery, data.students, lang]);

        if (selectedSummaryId) {
            const targetSummary = (data.summaries || []).find(s => s.id === selectedSummaryId) || (data.news || []).find(s => s.id === selectedSummaryId);
            if (!targetSummary) return null;
            const author = Luminova.getStudent(targetSummary.studentId, data.students);
            return html`
                <div className="animate-fade-in w-full max-w-4xl mx-auto space-y-6">
                    <button onClick=${() => window.history.back()} 
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-xl font-bold transition-all shadow-sm w-fit">
                        ✖ ${lang === 'ar' ? 'رجوع للتلخيص' : 'Back to Summary'}
                    </button>
                    <${Luminova.Components.GlassCard} className="!p-8">
                        <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-6">
                            <${Luminova.Components.Avatar} name=${author.nameAr || author.name} image=${author.image} isVIP=${author.isVIP} isFounder=${author.isFounder || author.id === 's_founder'} isVerified=${author.isVerified} size="w-14 h-14" />
                            <div>
                                <h3 className="font-bold text-lg">${lang === 'ar' ? (author.nameAr || author.name) : (author.nameEn || author.name)}</h3>
                                <span className="text-sm opacity-60">${Luminova.formatDate(targetSummary.timestamp, lang)}</span>
                            </div>
                        </div>
                        <h2 className="text-3xl font-black mb-4">${targetSummary[`title${lang === 'ar' ? 'Ar' : 'En'}`] || targetSummary.titleAr || targetSummary.titleEn}</h2>
                        <div className="text-lg opacity-90 mb-8 whitespace-pre-wrap"><${Luminova.Components.SmartText} text=${targetSummary[`content${lang === 'ar' ? 'Ar' : 'En'}`] || targetSummary.contentAr || targetSummary.contentEn} lang=${lang} /></div>
                        
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4">${lang === 'ar' ? 'المرفقات' : 'Attachments'}</h4>
                            <${Luminova.Components.SmartMedia} url=${targetSummary.mediaUrls || targetSummary.mediaUrl} lang=${lang} />
                        </div>
                    </</${Luminova.Components.GlassCard}>
                </div>
            `;
        }

        if (selectedSub) {
            const allCombinedContent = (() => {
                const combined = [];
                filteredSummaries.forEach(s => {
                    combined.push({
                        ...s,
                        itemType: 'summary',
                        displayTitle: s[`title${lang === 'ar' ? 'Ar' : 'En'}`] || s.titleAr || s.titleEn,
                        displayDesc: s.briefDescription || s[`content${lang === 'ar' ? 'Ar' : 'En'}`] || s.contentAr || s.contentEn || '',
                        displayDate: s.timestamp
                    });
                });

                filteredQuizzes.forEach(q => {
                    combined.push({
                        ...q,
                        itemType: 'quiz',
                        displayTitle: q[`title${lang === 'ar' ? 'Ar' : 'En'}`] || q.titleAr || q.titleEn || q.title || 'بدون عنوان',
                        displayDesc: q.briefDescription || `${(q.questions || []).length} ${Luminova.i18n[lang].questions}`,
                        displayDate: q.timestamp,
                        mediaType: q.mediaType || 'quiz'
                    });
                });



                return combined.sort((a, b) => new Date(b.displayDate || 0) - new Date(a.displayDate || 0));
            })();

            const availableChapters = Array.from(new Set(allCombinedContent.map(i => i.chapterTag).filter(Boolean)));
            const chapterOptions = [
                { value: 'all', label: lang === 'ar' ? 'الكل (أرشيف)' : 'All (Archive)' },
                ...availableChapters.map(tag => ({ value: tag, label: tag }))
            ];

            const renderItemCard = (item) => {
                const isQuiz = item.itemType === 'quiz';
                const isInteractive = item.mediaType === 'interactive';
                const iconMap = {
                    'reel': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
                    'pdf': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
                    'video': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
                    'image': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
                    'quiz': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15h6"></path><path d="M9 11h6"></path><path d="M9 19h6"></path><path d="M14 2v6h6"></path></svg>`,
                    'interactive': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>`,
                    'exam': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15h6"></path><path d="M9 11h6"></path><path d="M9 19h6"></path><path d="M14 2v6h6"></path></svg>`
                };
                const defaultIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`;
                const icon = iconMap[item.mediaType] || (isQuiz ? iconMap['quiz'] : defaultIcon);
                
                return html`
                    <${Luminova.Components.GlassCard} key=${item.id} className=${`relative group hover:scale-[1.02] transition-transform flex flex-col h-full border-t-4 ${isInteractive ? 'border-t-cyan-400/70 shadow-[0_0_25px_rgba(34,211,238,0.15)]' : 'border-t-fuchsia-500/50'} hover:shadow-[0_0_20px_rgba(217,70,239,0.2)]`}>
                        <div className="absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} text-3xl opacity-80 group-hover:scale-125 group-hover:rotate-6 transition-all drop-shadow-md">${icon}</div>
                        ${isInteractive && html`<span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-cyan-400 border border-cyan-500/30 mb-3 w-max">${Luminova.i18n[lang].interactiveTag}</span>`}
                        <h4 className="text-xl font-black mb-3 ${lang === 'ar' ? 'pl-10' : 'pr-10'} leading-tight text-zinc-900 dark:text-white">${item.displayTitle}</h4>
                        <p className="text-sm opacity-80 mb-6 flex-1 line-clamp-3 text-zinc-600 dark:text-zinc-400">${item.displayDesc}</p>
                        
                        <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
                            ${isInteractive ? html`
                                <button onClick=${() => {
                                    window.dispatchEvent(new CustomEvent('startInteractiveLesson', { detail: { url: item.lessonUrl || item.mediaUrls?.[0]?.url || item.mediaUrls?.[0], title: item.displayTitle } }));
                                }} className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-white transition-all duration-300 rounded-xl font-black flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-95 border border-cyan-400/40" style=${{ animation: 'pulse 2.5s infinite' }}>
                                    <span className="text-base">${Luminova.i18n[lang].startInteractiveLesson}</span>
                                </button>
                            ` : isQuiz ? html`
                                <${Luminova.Components.Button} onClick=${() => { 
                                    setActiveQuiz(item); setView('quiz'); 
                                }} className="w-full text-base py-3 rounded-xl shadow-md font-bold group-hover:bg-fuchsia-500 transition-colors">
                                    ${Luminova.i18n[lang].startQuiz}
                                </${Luminova.Components.Button}>
                            ` : html`
                                <button onClick=${() => {
                                    setSelectedSummaryId(item.id);
                                }} className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-all duration-300 rounded-xl font-black flex items-center justify-center gap-2 shadow-sm border border-cyan-500/30">
                                    <span className="uppercase text-sm tracking-widest">${lang === 'ar' ? 'عرض المحتوى' : 'View Content'}</span>
                                </button>
                            `}
                        </div>
                    </${Luminova.Components.GlassCard}>
                `;
            };

            // Timeline node renderer for capsule view
            const renderTimelineNode = (item, idx) => {
                const isInteractive = item.mediaType === 'interactive';
                const isQuiz = item.itemType === 'quiz';
                const iconMap = {
                    'reel': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
                    'pdf': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
                    'video': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
                    'image': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
                    'quiz': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15h6"></path><path d="M9 11h6"></path><path d="M9 19h6"></path><path d="M14 2v6h6"></path></svg>`,
                    'interactive': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>`,
                    'exam': html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15h6"></path><path d="M9 11h6"></path><path d="M9 19h6"></path><path d="M14 2v6h6"></path></svg>`
                };
                const defaultIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`;
                const icon = iconMap[item.mediaType] || (isQuiz ? iconMap['quiz'] : defaultIcon);
                const student = Luminova.getStudent(item.studentId, data.students);
                const date = item.displayDate ? new Date(item.displayDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

                return html`
                    <div key=${item.id} className="relative flex gap-4 sm:gap-6 group" style=${{ paddingBottom: '2rem' }}>
                        <!-- Timeline line -->
                        <div className="flex flex-col items-center" style=${{ minWidth: '40px' }}>
                            <div className=${`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold z-10 shrink-0 transition-all shadow-lg ${isInteractive ? 'bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white shadow-cyan-500/40' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-2 border-zinc-300 dark:border-zinc-600'}`}>
                                ${icon}
                            </div>
                            <div className="w-0.5 flex-1 bg-gradient-to-b from-fuchsia-500/40 to-transparent mt-1"></div>
                        </div>
                        <!-- Content card -->
                        <div className=${`flex-1 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border rounded-2xl p-5 transition-all hover:shadow-lg ${isInteractive ? 'border-cyan-500/30 hover:shadow-cyan-500/10' : 'border-zinc-200 dark:border-zinc-800 hover:shadow-fuchsia-500/10'}`}>
                            <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                                <div className="flex-1">
                                    ${isInteractive && html`<span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-cyan-400 border border-cyan-500/30 mb-2">${Luminova.i18n[lang].interactiveTag}</span>`}
                                    <h4 className="text-lg font-black text-zinc-900 dark:text-white leading-snug">${item.displayTitle}</h4>
                                </div>
                                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold shrink-0 mt-1">${date}</span>
                            </div>
                            ${item.displayDesc && html`<p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">${item.displayDesc}</p>`}
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5 flex-wrap">
                                    ${lang === 'ar' ? (student.nameAr || student.name || '') : (student.nameEn || student.name || '')}
                                    ${student.isFounder ? html`<span className="text-[10px] bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white px-2 py-0.5 rounded-sm font-black shadow-sm">${Luminova.i18n[lang].founder}</span>` : 
                                      student.role === 'doctor' ? html`<span className="text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-sm font-black">🎓 ${lang === 'ar' ? 'دكتور' : 'Doctor'}</span>` : 
                                      html`<span className="text-[10px] bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-sm font-black">🎒 ${lang === 'ar' ? 'طالب' : 'Student'}</span>`}
                                </span>
                                ${isInteractive ? html`
                                    <button onClick=${() => {
                                        window.dispatchEvent(new CustomEvent('startInteractiveLesson', { detail: { url: item.lessonUrl || item.mediaUrls?.[0]?.url || item.mediaUrls?.[0], title: item.displayTitle } }));
                                    }} className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-white transition-all duration-300 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 text-sm border border-cyan-400/40" style=${{ animation: 'pulse 2.5s infinite' }}>
                                        ${Luminova.i18n[lang].startInteractiveLesson}
                                    </button>
                                ` : isQuiz ? html`
                                    <${Luminova.Components.Button} onClick=${() => { setActiveQuiz(item); setView('quiz'); }} className="text-sm py-2 px-5 rounded-xl shadow-md font-bold">
                                        ${Luminova.i18n[lang].startQuiz}
                                    </${Luminova.Components.Button}>
                                ` : html`
                                    <button onClick=${() => setSelectedSummaryId(item.id)} className="px-5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 transition-all rounded-xl font-black text-sm border border-cyan-500/30">
                                        ${lang === 'ar' ? 'عرض المحتوى' : 'View Content'}
                                    </button>
                                `}
                            </div>
                        </div>
                    </div>
                `;
            };

            const renderCategoryContent = () => {
                let filtered = [];
                if (selectedCategory === 'capsule') {
                    if (selectedChapter === '__archive__') {
                        filtered = allCombinedContent.filter(item => !item.chapterTag || !item.mediaType);
                    } else if (selectedChapter !== 'all') {
                        filtered = allCombinedContent.filter(item => item.chapterTag === selectedChapter);
                    } else {
                        filtered = allCombinedContent;
                    }
                    
                    filtered = filtered.sort((a, b) => new Date(b.displayDate || 0) - new Date(a.displayDate || 0));
                    const paged = filtered.slice(0, visibleCount);
                    const hasMore = paged.length < filtered.length;

                    return html`
                        <div className="w-full space-y-8">
                            <!-- Vertical Timeline -->
                            <div className="max-w-3xl mx-auto">
                                ${paged.map((item, idx) => renderTimelineNode(item, idx))}
                            </div>
                            
                            ${paged.length === 0 && html`
                                <div className="text-center py-24 opacity-60 border-2 border-dashed rounded-3xl border-zinc-300 dark:border-zinc-700 font-bold text-xl bg-white/5 backdrop-blur-sm">
                                    <div className="text-6xl mb-4 opacity-50">🧭</div>
                                    ${Luminova.i18n[lang].emptyState}
                                </div>
                            `}
                            
                            ${hasMore && html`
                                <div className="flex justify-center mt-8 w-full">
                                    <button onClick=${() => setVisibleCount(v => v + 6)} 
                                        className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-zinc-300 dark:border-zinc-700 rounded-2xl transition-all font-black shadow-sm text-zinc-900 dark:text-white hover:scale-105 active:scale-95 group">
                                        <span>${lang === 'ar' ? 'عرض المزيد' : 'Load More'}</span>
                                        <span className="text-xl group-hover:translate-y-1 transition-transform">⬇️</span>
                                    </button>
                                </div>
                            `}
                        </div>
                    `;
                } else {
                    const catMap = { 'reels': 'reel', 'pdfs': 'pdf', 'videos': 'video', 'images': 'image', 'quizzes': 'quiz', 'interactive': 'interactive', 'exams': 'exam' };
                    const targetType = catMap[selectedCategory];
                    filtered = allCombinedContent.filter(item => {
                        if (selectedCategory === 'exams') {
                            return item.mediaType === 'exam' || item.itemType === 'exam' || item.mediaType === 'quiz' || item.itemType === 'quiz';
                        }
                        return item.mediaType === targetType;
                    });
                    
                    filtered = filtered.sort((a, b) => new Date(b.displayDate || 0) - new Date(a.displayDate || 0));
                    
                    const paged = filtered.slice(0, visibleCount);
                    const hasMore = paged.length < filtered.length;

                    return html`
                        <div className="w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                ${paged.length > 0 ? paged.map(item => renderItemCard(item)) : html`
                                    <div className="col-span-full text-center py-24 opacity-60 border-2 border-dashed rounded-3xl border-zinc-300 dark:border-zinc-700 font-bold text-xl bg-white/5 backdrop-blur-sm">
                                        <div className="text-6xl mb-4 opacity-50">🧭</div>
                                        ${Luminova.i18n[lang].emptyState}
                                    </div>
                                `}
                            </div>
                            
                            ${hasMore && html`
                                <div className="flex justify-center mt-8 w-full">
                                    <button onClick=${() => setVisibleCount(v => v + 6)} 
                                        className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-zinc-300 dark:border-zinc-700 rounded-2xl transition-all font-black shadow-sm text-zinc-900 dark:text-white hover:scale-105 active:scale-95 group">
                                        <span>${lang === 'ar' ? 'عرض المزيد' : 'Load More'}</span>
                                        <span className="text-xl group-hover:translate-y-1 transition-transform">⬇️</span>
                                    </button>
                                </div>
                            `}
                        </div>
                    `;
                }
            };

            return html`
                <div className="animate-fade-in space-y-8 max-w-7xl mx-auto">
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-8 px-2">
                        <div className="w-full md:w-auto flex items-center justify-between gap-4">
                             <button onClick=${() => window.history.back()} 
                                className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-2xl transition-all font-black backdrop-blur-xl shadow-lg shadow-cyan-500/10 hover:scale-105 active:scale-95 group">
                                <span className="group-hover:translate-x-1 transition-transform duration-300 text-xl">➔</span>
                                <span className="tracking-widest uppercase text-xs">${lang === 'ar' ? 'الرجوع للمواد' : 'Back to Semester'}</span>
                            </button>
                            <h2 className="md:hidden text-xl font-black text-zinc-900 dark:text-white truncate max-w-[150px]">
                                ${selectedSub[`name${lang === 'ar' ? 'Ar' : 'En'}`] || selectedSub.nameAr}
                            </h2>
                        </div>

                        <div className="w-full md:flex-1 relative group">
                            <span className="absolute inset-y-0 start-4 flex items-center opacity-40 text-lg group-focus-within:text-rose-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            </span>
                            <input 
                                type="text" 
                                value=${searchQuery} 
                                onChange=${(e) => setSearchQuery(e.target.value)} 
                                placeholder=${lang === 'ar' ? 'بحث في المحتوى...' : 'Search content...'} 
                                className="w-full pl-14 pr-6 py-4 bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl text-white placeholder-zinc-500 outline-none transition-all focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 font-black shadow-inner"
                            />
                        </div>

                        <div className="w-full md:w-auto relative">
                            <button 
                                onClick=${() => setIsAuthorOpen(!isAuthorOpen)}
                                onBlur=${() => setTimeout(() => setIsAuthorOpen(false), 200)}
                                className=${`w-full md:w-auto flex items-center justify-between gap-4 px-6 py-3 rounded-2xl border transition-all duration-300 backdrop-blur-2xl shadow-sm font-bold ${isAuthorOpen ? 'bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">👤</span>
                                    <span className="truncate max-w-[150px]">
                                        ${selectedAuthor ? `${lang === 'ar' ? 'بواسطة: ' : 'By: '}${selectedAuthor}` : (lang === 'ar' ? 'تصفية بالمؤلف' : 'Filter by Author')}
                                    </span>
                                </div>
                                <span className=${`transition-transform duration-300 ${isAuthorOpen ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            ${isAuthorOpen ? html`
                                <div className="absolute top-full left-0 right-0 mt-3 z-[100] animate-fade-in backdrop-blur-3xl bg-zinc-950/95 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden min-w-[200px]">
                                    <ul className="py-2 max-h-[300px] overflow-y-auto m-0 p-0">
                                        <li 
                                            onClick=${() => { setSelectedAuthor(null); setIsAuthorOpen(false); }}
                                            className=${`px-6 py-4 cursor-pointer transition-all flex items-center justify-between font-bold ${!selectedAuthor ? 'text-white bg-white/10' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <span>${lang === 'ar' ? 'الجميع' : 'All Authors'}</span>
                                            ${!selectedAuthor ? html`<span className="text-rose-400">✓</span>` : null}
                                        </li>
                                        ${authors.map(author => html`
                                            <li 
                                                key=${author}
                                                onClick=${() => { setSelectedAuthor(author); setIsAuthorOpen(false); }}
                                                className=${`px-6 py-4 cursor-pointer transition-all flex items-center justify-between font-bold ${selectedAuthor === author ? 'text-white bg-white/10' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
                                            >
                                                <span className="truncate">${author}</span>
                                                ${selectedAuthor === author ? html`<span className="text-rose-400">✓</span>` : null}
                                            </li>
                                        `)}
                                    </ul>
                                </div>
                            ` : null}
                        </div>
                    </div>

                    ${selectedCategory === null ? html`
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6 max-w-4xl mx-auto w-full px-4 mb-10">
                            ${[
                                { id: 'capsule', icon: '💎', titleAr: 'الخُلاصة', titleEn: 'The Core', gradient: 'from-fuchsia-500/20 to-purple-500/20', hoverClass: 'hover:border-brand-purple/50 hover:shadow-[0_0_25px_rgba(189,0,255,0.3)]' },
                                { id: 'videos', icon: '🎬', titleAr: 'فيديوهات شرح', titleEn: 'Video Explanations', gradient: 'from-rose-500/20 to-orange-500/20', hoverClass: 'hover:border-brand-crisp/50 hover:shadow-[0_0_25px_rgba(255,0,85,0.3)]' },
                                { id: 'pdfs', icon: '📚', titleAr: 'مذكرات و PDF', titleEn: 'PDFs/Notes', gradient: 'from-blue-500/20 to-cyan-500/20', hoverClass: 'hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]' },
                                { id: 'reels', icon: '📱', titleAr: 'فيديوهات قصيرة', titleEn: 'Reels/Shorts', gradient: 'from-emerald-500/20 to-green-500/20', hoverClass: 'hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]' },
                                { id: 'interactive', icon: '💻', titleAr: 'شرح تفاعلي', titleEn: 'Interactive', gradient: 'from-amber-500/20 to-yellow-500/20', hoverClass: 'hover:border-brand-DEFAULT/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.3)]' },
                                { id: 'exams', icon: '📝', titleAr: 'الاختبارات', titleEn: 'Exams', gradient: 'from-indigo-500/20 to-blue-500/20', hoverClass: 'hover:border-indigo-500/50 hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]' }
                            ].map(cat => html`
                                <button key=${cat.id} onClick=${() => { setSelectedCategory(cat.id); setVisibleCount(6); }}
                                    className=${`group relative flex flex-col items-center justify-center min-h-[120px] md:min-h-[160px] p-4 md:p-6 rounded-[2rem] bg-gradient-to-br ${cat.gradient} bg-white/5 backdrop-blur-2xl border border-white/10 ${cat.hoverClass} transition-all duration-500 hover:-translate-y-2 overflow-hidden [-webkit-tap-highlight-color:transparent] active:scale-[0.95] active:brightness-125`}>
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500"></div>
                                    <div className="text-4xl md:text-5xl mb-2 md:mb-4 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-xl">
                                        ${cat.icon}
                                    </div>
                                    <h3 className="text-sm md:text-lg font-black text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-white/90 tracking-wide z-10 text-center">
                                        ${lang === 'ar' ? cat.titleAr : cat.titleEn}
                                    </h3>
                                </button>
                            `)}
                        </div>
                    ` : html`
                        <div className="w-full flex flex-col gap-6 animate-fade-in">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <button onClick=${() => setSelectedCategory(null)} 
                                    className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-2xl transition-all font-black shadow-sm hover:scale-105 active:scale-95 group">
                                    <span className="text-xl">🔙</span>
                                    <span className="tracking-widest uppercase text-sm">${lang === 'ar' ? 'الرجوع لأقسام المادة' : 'Back to Categories'}</span>
                                </button>
                                
                                ${selectedCategory === 'capsule' ? html`
                                    <div className="flex-1 relative z-20 items-center gap-2 pb-2" style=${{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', maxWidth: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        <!-- All tab -->
                                        <button onClick=${() => setSelectedChapter('all')}
                                            className=${`px-4 py-2 rounded-full text-sm font-black transition-all whitespace-nowrap border ${selectedChapter === 'all' ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50 shadow-[0_0_12px_rgba(217,70,239,0.2)]' : 'bg-white/5 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10'}`}
                                            style=${{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                                            ${lang === 'ar' ? 'الكل' : 'All'}
                                        </button>
                                        <!-- Chapter tabs -->
                                        ${availableChapters.map(tag => html`
                                            <button key=${tag} onClick=${() => setSelectedChapter(tag)}
                                                className=${`px-4 py-2 rounded-full text-sm font-black transition-all whitespace-nowrap border ${selectedChapter === tag ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50 shadow-[0_0_12px_rgba(217,70,239,0.2)]' : 'bg-white/5 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10'}`}
                                                style=${{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                                                ${tag}
                                            </button>
                                        `)}
                                        <!-- Archive button -->
                                        <button onClick=${() => setSelectedChapter('__archive__')}
                                            className=${`px-4 py-2 rounded-full text-sm font-black transition-all whitespace-nowrap border ${selectedChapter === '__archive__' ? 'bg-zinc-500/20 text-zinc-300 border-zinc-500/50 shadow-[0_0_12px_rgba(161,161,170,0.15)]' : 'bg-white/5 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-500 border-zinc-300 dark:border-zinc-700 hover:border-zinc-500/40 hover:bg-zinc-500/10'}`}
                                            style=${{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                                            ${Luminova.i18n[lang].archiveTab}
                                        </button>
                                    </div>
                                ` : null}
                            </div>
                            
                            ${renderCategoryContent()}
                        </div>
                    `}
                </div>
            `;
        }

        return html`
            <div className="animate-fade-in space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-4xl mx-auto">
                    <div className="relative z-20">
                        <${Luminova.Components.CustomDropdown}
                            value=${selectedYear?.id || ''}
                            onChange=${(val) => {
                                const year = data.years.find(y => y.id === val);
                                setSelectedYear(year);
                            }}
                            options=${data.years.map(y => ({ value: y.id, label: y[`name${lang === 'ar' ? 'Ar' : 'En'}`] || y.nameAr || y.nameEn }))}
                            placeholder=${lang === 'ar' ? 'اختر الفرقة' : 'Select Year'}
                        />
                    </div>

                    ${selectedYear && semesters.length > 0 ? html`
                        <div className="relative animate-fade-in z-10">
                            <${Luminova.Components.CustomDropdown}
                                value=${selectedSem?.id || ''}
                                onChange=${(val) => {
                                    const sem = semesters.find(s => s.id === val);
                                    setSelectedSem(sem);
                                }}
                                options=${semesters.map(s => ({ value: s.id, label: s[`name${lang === 'ar' ? 'Ar' : 'En'}`] || s.nameAr || s.nameEn }))}
                                placeholder=${lang === 'ar' ? 'اختر الترم' : 'Select Semester'}
                            />
                        </div>
                    ` : null}
                </div>

                ${subjects.length > 0 ? html`
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
                        ${subjects.map(s => html`
                            <button key=${s.id} onClick=${() => setSelectedSub(s)} 
                                className="group relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-start flex flex-col justify-between min-h-[200px] shadow-sm hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-400 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="relative z-10">
                                     <div className="w-14 h-14 bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-fuchsia-500/20 transition-all duration-500 shadow-lg shadow-fuchsia-500/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white leading-tight mb-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors duration-300">
                                        ${s[`name${lang === 'ar' ? 'Ar' : 'En'}`] || s.nameAr || s.nameEn}
                                    </h3>
                                </div>
                                
                                <div className="mt-6 flex items-center justify-between text-sm font-black text-zinc-500 dark:text-cyan-500/80 group-hover:text-cyan-500 transition-colors">
                                    <span className="uppercase tracking-widest">${lang === 'ar' ? 'عرض المحتوى' : 'View Content'}</span>
                                    <span className="transform group-hover:translate-x-3 transition-transform duration-500 text-xl">➔</span>
                                </div>
                            </button>
                        `)}
                    </div>
                ` : html`
                    <div className="flex flex-col items-center justify-center py-20 opacity-50 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl bg-zinc-50/50 dark:bg-zinc-950/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="mt-4 text-xl font-bold">${lang === 'ar' ? 'لا توجد مواد متاحة في هذا الفصل الدراسي' : 'No subjects available in this semester'}</p>
                    </div>
                `}
            </div>
        `;
    };

    // ==========================================



Luminova.Pages.StudentCommunityPage = ({ data, lang, setView, setActiveSummary }) => {
        const [selectedStudent, setSelectedStudent] = useState(null);
        const [visibleCount, setVisibleCount] = useState(5);
        const [studentsVisibleCount, setStudentsVisibleCount] = useState(15);
        const [searchQuery, setSearchQuery] = useState('');
        const normalizeId = (id) => {
            if (!id) return null;
            if (id === 's_founder' || id === 's_founder_hardcoded' || id === 'founder_1') return Luminova.FOUNDER.id;
            return id;
        };

        const getContributionsCount = useMemo(() => {
            const counts = {};
            data.summaries.forEach(s => {
                const sId = normalizeId(s.studentId);
                if (sId) counts[sId] = (counts[sId] || 0) + 1;
            });
            data.quizzes.forEach(q => {
                const questionCounts = {};
                (q.questions || []).forEach(qn => {
                    const sId = normalizeId(qn.studentId);
                    if (sId) questionCounts[sId] = (questionCounts[sId] || 0) + 1;
                });
                
                let maxQuestions = 0;
                for (const sId in questionCounts) {
                    if (questionCounts[sId] > maxQuestions) {
                        maxQuestions = questionCounts[sId];
                    }
                }
                
                for (const sId in questionCounts) {
                    if (questionCounts[sId] === maxQuestions && maxQuestions > 0) {
                        counts[sId] = (counts[sId] || 0) + 2;
                    } else {
                        counts[sId] = (counts[sId] || 0) + 1;
                    }
                }
            });
            return counts;
        }, [data.summaries, data.quizzes]);

        // Founder Hardcoded Data per strictly required specs
        const founder = {
            id: 's_founder_hardcoded',
            nameAr: 'محمود عبد الرحمن عبدالله',
            nameEn: 'Mahmoud Abdelrahman',
            majorAr: 'تكنولوجيا التعليم - جامعة حلوان',
            majorEn: 'Educational Technology - Helwan University',
            bioAr: 'مؤسس منصة Luminova Edu التعليمية. مطور المنصة والمشرف العام.',
            bioEn: 'Founder of Luminova Edu Platform. Lead Developer and Administrator.',
            image: 'img/profile.png', // Fallback avatar for founder if needed
            isFounder: true,
            socialLinks: {
                facebook: 'https://www.facebook.com/mahmoud.abdalrahaman.hagag',
                instagram: 'https://www.instagram.com/mahmoud_abdelrhman_1',
                linkedin: 'https://www.linkedin.com/in/mahmoud-hagag-145127346/'
            }
        };

        // Regular students (filter out any potential accidental founder in DB)
        const sortedStudents = data.students.filter(s => !s.isFounder && s.id !== 's_founder').sort((a, b) => {
            if (a.role === 'doctor' && b.role !== 'doctor') return -1;
            if (b.role === 'doctor' && a.role !== 'doctor') return 1;
            return b.isVIP - a.isVIP;
        });

        // Prepend Founder to always be Index 0
        let allStudentsList = [founder, ...sortedStudents];
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            allStudentsList = allStudentsList.filter(student =>
                (student.nameAr || student.name || '').toLowerCase().includes(query) ||
                (student.nameEn || '').toLowerCase().includes(query)
            );
        }

        // Shallow History for student profile sub-view
        useEffect(() => {
            if (selectedStudent !== null) {
                window.history.pushState({ lmv: 'community-student' }, '', '');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, [selectedStudent?.id]);

        useEffect(() => {
            const onPop = () => {
                if (selectedStudent !== null) {
                    setSelectedStudent(null);
                }
            };
            window.addEventListener('popstate', onPop);
            return () => window.removeEventListener('popstate', onPop);
        }, [selectedStudent]);
        
        if (selectedStudent !== null) {
            const studentPosts = (() => {
                    const userQuestionsMap = {};
                    data.quizzes.forEach(q => {
                        (q.questions || []).forEach(qn => {
                            const sId = (qn.studentId === 's_founder' || qn.studentId === 's_founder_hardcoded') ? Luminova.FOUNDER.id : qn.studentId;
                            if (sId === selectedStudent.id) {
                                const groupId = `${q.id}_${sId}`;
                                if (!userQuestionsMap[groupId]) {
                                    userQuestionsMap[groupId] = {
                                        id: `group_${groupId}`,
                                        titleAr: `أضاف أسئلة في اختبار: ${q.titleAr || q.titleEn || q.title || 'اختبار'}`,
                                        titleEn: `Contributed questions to Quiz: ${q.titleEn || q.titleAr || q.title || 'Quiz'}`,
                                        contentAr: `مساهمة لإضافة أسئلة تفاعلية في هذا الاختبار.`,
                                        contentEn: `Contribution adding interactive questions to this quiz.`,
                                        timestamp: qn.timestamp || q.timestamp || new Date().toISOString(),
                                        studentId: qn.studentId,
                                        subjectId: q.subjectId,
                                        isSingleQuestion: true,
                                        parentQuiz: q
                                    };
                                } else {
                                    if (new Date(qn.timestamp) > new Date(userQuestionsMap[groupId].timestamp)) {
                                        userQuestionsMap[groupId].timestamp = qn.timestamp;
                                    }
                                }
                            }
                        });
                    });
                    const userSummaries = data.summaries.filter(i => {
                        const sId = (i.studentId === 's_founder' || i.studentId === 's_founder_hardcoded') ? Luminova.FOUNDER.id : i.studentId;
                        return sId === selectedStudent.id;
                    });
                    return [...userSummaries, ...Object.values(userQuestionsMap)].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            })();

            const displayedPosts = studentPosts.slice(0, visibleCount);

            return html`
                <div className="animate-fade-in space-y-6">
                    <div className="flex justify-between items-center mb-8 bg-slate-100/50 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[2rem] shadow-xl border border-white/5">
                        <div className="flex items-center gap-5 flex-wrap">
                            <${Luminova.Components.Avatar} name=${selectedStudent.nameAr || selectedStudent.name} image=${selectedStudent.image} isVIP=${selectedStudent.isVIP} isFounder=${selectedStudent.isFounder || selectedStudent.id === 's_founder_hardcoded'} isVerified=${selectedStudent.isVerified} size="w-16 h-16 shadow-lg shadow-cyan-500/20" />
                            <h2 className="text-3xl font-black flex items-center gap-3 flex-wrap whitespace-normal break-words text-zinc-900 dark:text-white" style=${{ wordBreak: 'normal', overflowWrap: 'anywhere' }}>
                                ${lang === 'ar' ? (selectedStudent.nameAr || selectedStudent.name) : (selectedStudent.nameEn || selectedStudent.name)}
                                ${selectedStudent.isFounder && html`<span className="text-[10px] bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.3)]">${lang === 'ar' ? 'المؤسس' : 'Founder'}</span>`}
                                ${!selectedStudent.isFounder && selectedStudent.role === 'doctor' && html`<span className="text-[10px] bg-teal-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg">🎓 ${lang === 'ar' ? 'دكتور' : 'Doctor'}</span>`}
                            </h2>
                        </div>
                        <button onClick=${() => window.history.back()} className="font-black text-white bg-red-500 hover:bg-red-600 transition-all px-6 py-3 rounded-2xl shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 flex items-center gap-3 text-xs tracking-widest uppercase">
                            <span className="text-lg">✖</span>
                            <span>${lang === 'ar' ? 'الرجوع للطلاب' : 'Back to Students'}</span>
                        </button>
                    </div>

                    <div className="bg-white/50 dark:bg-zinc-900/50 rounded-2xl p-6 mb-6 border border-zinc-200 dark:border-zinc-800">
                        <p className="opacity-90 font-bold text-brand-DEFAULT text-lg">${selectedStudent[`major${lang === 'ar' ? 'Ar' : 'En'}`] || selectedStudent.majorAr}</p>
                        <div className="mt-2 text-zinc-600 dark:text-zinc-400">
                            <${Luminova.Components.SmartText} text=${selectedStudent[`bio${lang === 'ar' ? 'Ar' : 'En'}`] || selectedStudent.bioAr} lang=${lang} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">${lang === 'ar' ? 'المساهمات' : 'Contributions'}</h3>
                        <${Luminova.Components.TimelineFeed} 
                            items=${displayedPosts} 
                            students=${data.students} subjects=${data.subjects} lang=${lang} onQuizClick=${() => { alert(lang === 'ar' ? 'قم بالدخول للاختبار الكامل من القسم الأكاديمي' : 'Access full quiz from Academic section'); }} onSummaryClick=${(item) => { setActiveSummary(item); setView('summaryDetail'); }}
                        />
                        ${visibleCount < studentPosts.length && html`
                            <div className="pt-2 pb-8">
                                <button onClick=${() => setVisibleCount(prev => prev + 5)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all block mx-auto mt-6 w-full sm:w-auto text-center">
                                    ${lang === 'ar' ? 'عرض المزيد ➕' : 'Load More ➕'}
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            `;
        }

        return html`
        <div className="animate-fade-in">
             <h2 className="text-3xl font-bold mb-8 text-center">${Luminova.i18n[lang].community}</h2>
             <div className="max-w-2xl mx-auto mb-10">
                 <input type="text" placeholder=${lang === 'ar' ? 'البحث عن زميل (بالاسم العربي أو الإنجليزي)...' : 'Search for a peer...'} value=${searchQuery} onChange=${e => setSearchQuery(e.target.value)} className="w-full p-5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-2 border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 shadow-sm outline-none font-bold text-lg text-center transition-all" />
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                ${allStudentsList.slice(0, studentsVisibleCount).map((student) => html`
                    <${Luminova.Components.GlassCard} 
                        key=${student.id} 
                        onClick=${() => { setSelectedStudent(student); setVisibleCount(5); }} 
                        className=${`text-center flex flex-col items-center ${student.isFounder || student.id === 's_founder_hardcoded' ? 'scale-105 relative z-10 bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-300 dark:border-zinc-700 shadow-md text-zinc-900 dark:text-zinc-100' : student.isVIP ? 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm' : ''}`}
                    >
                        <div className="mb-4">
                            <${Luminova.Components.Avatar} name=${student.nameAr || student.name} nameEn=${student.nameEn} image=${student.image} isVIP=${student.isVIP} isFounder=${student.isFounder || student.id === 's_founder_hardcoded'} isVerified=${student.isVerified} size="w-24 h-24" />
                        </div>
                        <h3 className="text-xl font-black flex flex-wrap items-center justify-center gap-2 whitespace-normal break-words text-zinc-900 dark:text-white" style=${{ wordBreak: 'normal', overflowWrap: 'anywhere' }}>
                            ${lang === 'ar' ? (student.nameAr || student.name) : (student.nameEn || student.name)}
                        </h3>
                        ${(student.isFounder || student.id === 's_founder_hardcoded') && html`<span className="text-[10px] bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 text-white font-black px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.3)] mt-3 mb-1 uppercase tracking-widest block w-max mx-auto border-none">${Luminova.i18n[lang].founder}</span>`}
                        ${(!student.isFounder && student.id !== 's_founder_hardcoded') && student.role === 'doctor' && html`<span className="text-[10px] bg-teal-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg mt-3 mb-1 block w-max mx-auto uppercase tracking-widest">🎓 ${lang === 'ar' ? 'دكتور' : 'Doctor'}</span>`}
                        <p className="text-sm font-black mt-3 ${(student.isFounder || student.id === 's_founder_hardcoded') ? 'text-rose-400 drop-shadow-sm' : 'text-zinc-500'} tracking-tight">${student[`major${lang === 'ar' ? 'Ar' : 'En'}`] || student.majorAr}</p>
                        <p className="text-[10px] bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full mt-3 font-black uppercase tracking-widest border border-rose-500/20">${getContributionsCount[normalizeId(student.id)] || 0} ${lang === 'ar' ? 'مساهمة' : 'Contributions'}</p>
                        
                        <div className="mt-4 flex justify-center gap-4 border-t border-zinc-200 dark:border-zinc-700 w-full pt-4">
                            ${student.socialLinks?.facebook && html`<a href=${student.socialLinks.facebook} target="_blank" onClick=${e => e.stopPropagation()} className="hover:scale-125 transition-transform"><${Luminova.Icons.Facebook} /></a>`}
                            ${student.socialLinks?.instagram && html`<a href=${student.socialLinks.instagram} target="_blank" onClick=${e => e.stopPropagation()} className="hover:scale-125 transition-transform"><${Luminova.Icons.Instagram} /></a>`}
                            ${student.socialLinks?.linkedin && html`<a href=${student.socialLinks.linkedin} target="_blank" onClick=${e => e.stopPropagation()} className="hover:scale-125 transition-transform"><${Luminova.Icons.LinkedIn} /></a>`}
                        </div>
                    </${Luminova.Components.GlassCard}>
                `)}
            </div>

            ${studentsVisibleCount < allStudentsList.length && html`
                <div className="flex justify-center pt-8 pb-4">
                    <button onClick=${() => setStudentsVisibleCount(prev => prev + 5)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all">
                        ${lang === 'ar' ? 'عرض المزيد ➕' : 'Load More ➕'}
                    </button>
                </div>
            `}
        </div>
    `;
    };


})();


