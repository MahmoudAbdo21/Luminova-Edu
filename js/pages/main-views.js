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
        <div className="space-y-6 relative border-s border-gray-200 dark:border-gray-700 ml-3 mr-3 px-4">
            ${visibleItems.map(item => {
            const student = Luminova.getStudent(item.studentId, students);
            const subject = subjects.find(s => s.id === item.subjectId) || {};
            const isQuizItem = item.isSingleQuestion;
            return html`
                    <div key=${item.id} className="relative">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-brand-DEFAULT rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 mt-2 text-white">
                            ${isQuizItem ? Luminova.Icons.CheckCircle() : Luminova.Icons.Book()}
                        </span>
                        <${Luminova.Components.GlassCard} className="ms-6">
                            <div className="flex items-start gap-4 mb-4">
                                <${Luminova.Components.Avatar} name=${student.nameAr || student.name} image=${student.image} isVIP=${student.isVIP} isVerified=${student.isVerified} isFounder=${student.isFounder || (student.id === 's_founder')} size="w-10 h-10" />
                                <div className="flex-1">
                                    <h4 className="font-bold whitespace-pre-wrap flex items-center gap-1">
                                        ${lang === 'ar' ? (student.nameAr || student.name) : (student.nameEn || student.name)}
                                        ${student.isVIP && html`<span className="text-xs text-brand-DEFAULT bg-brand-DEFAULT/10 px-2 py-0.5 rounded-full ml-2">VIP ✨</span>`}
                                    </h4>
                                    <p className="text-xs opacity-70">${subject[`name${lang === 'ar' ? 'Ar' : 'En'}`] || subject.nameAr || subject.nameEn}</p>
                                </div>
                                <div className="text-xs opacity-50">${Luminova.formatDate(item.timestamp, lang)}</div>
                            </div>
                            <h3 className="text-xl font-bold mb-2">${item[`title${lang === 'ar' ? 'Ar' : 'En'}`] || item.titleAr || item.titleEn}</h3>
                            <${Luminova.Components.SmartText} text=${item[`content${lang === 'ar' ? 'Ar' : 'En'}`] || item.contentAr || item.contentEn} lang=${lang} />
                            ${((item.mediaUrls && item.mediaUrls.length > 0) || item.mediaUrl) ? html`
                                <div className="mt-4">
                                    <button onClick=${() => onSummaryClick && onSummaryClick(item)} className="w-full py-3 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-600 dark:text-indigo-400 hover:text-white transition-all rounded-xl font-bold flex items-center justify-center gap-2 border border-indigo-500/20 shadow-sm">
                                        <span className="text-xl">📎</span>
                                        <span>${lang === 'ar' ? 'عرض المرفقات والشرح' : 'View Attachments'}</span>
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
                        className="px-8 py-3 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur border border-brand-DEFAULT/30 text-brand-DEFAULT font-bold hover:bg-brand-DEFAULT hover:text-white transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105 flex items-center gap-2"
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

    Luminova.Pages.HomePage = ({ data, lang, setView, setActiveQuiz, setActiveSummary }) => {
        const [expandedView, setExpandedView] = window.React.useState(null);
        const [visibleCount, setVisibleCount] = window.React.useState(10);

        const feedItems = useMemo(() => {
            const allQuestions = [];
            data.quizzes.forEach(q => {
                (q.questions || []).forEach(qn => {
                    allQuestions.push({
                        id: qn.id,
                        titleAr: 'سؤال تفاعلي في: ' + (q.titleAr || q.titleEn || q.title || 'اختبار'),
                        titleEn: 'Interactive Question in: ' + (q.titleEn || q.titleAr || q.title || 'Quiz'),
                        contentAr: qn.textAr || qn.text,
                        contentEn: qn.textEn || qn.text,
                        mediaUrl: qn.mediaUrl,
                        timestamp: qn.timestamp || q.timestamp || new Date().toISOString(),
                        studentId: qn.studentId,
                        subjectId: q.subjectId,
                        isSingleQuestion: true,
                        parentQuiz: q
                    });
                });
            });
            return [...data.summaries, ...allQuestions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }, [data.summaries, data.quizzes]);

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

            data.quizzes.forEach(q => {
                // Count each question's author only (quiz creation itself is excluded)
                (q.questions || []).forEach(qn => {
                    const sId = normalizeId(qn.studentId);
                    if (sId) counts[sId] = (counts[sId] || 0) + 1;
                });
            });

            // Always include Founder with at least a base score so leaderboard is never empty
            if (!counts[Luminova.FOUNDER.id]) {
                counts[Luminova.FOUNDER.id] = 0;
            }
            // Give founder a base contribution for founding the platform
            counts[Luminova.FOUNDER.id] = (counts[Luminova.FOUNDER.id] || 0) + 1;

            const sorted = Object.entries(counts)
                .map(([id, score]) => ({ id, score }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);

            return sorted
                .map(st => ({ student: Luminova.getStudent(st.id, data.students), score: st.score }))
                .filter(x => x.student && x.student.id !== 'unknown');
        }, [data.summaries, data.quizzes, data.students]);

        if (expandedView !== null) {
            const isNews = expandedView === 'news';
            const subData = isNews ? data.news : feedItems;
            
            return html`
                <div className="animate-fade-in space-y-6">
                    <div className="flex justify-between items-center mb-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold">${isNews ? Luminova.i18n[lang].news : Luminova.i18n[lang].feed}</h2>
                        <button onClick=${() => setExpandedView(null)} className="font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500/20">✖ ${lang === 'ar' ? 'رجوع للرئيسية' : 'Back to Home'}</button>
                    </div>
                    
                    ${isNews ? html`
                        <div className="space-y-4">
                            ${subData.slice(0, visibleCount).map((n, idx) => {
                                const author = Luminova.getStudent(n.studentId, data.students);
                                return html`
                                    <${Luminova.Components.GlassCard} key=${idx} className=${`border-l-4 border-l-brand-DEFAULT`}>
                                        ${n.studentId && html`
                                            <div className="flex items-center gap-3 mb-4 opacity-80 border-b border-gray-200 dark:border-gray-700 pb-3">
                                                <${Luminova.Components.Avatar} name=${author.nameAr || author.name} nameEn=${author.nameEn} image=${author.image} isVerified=${author.isVerified} isFounder=${author.isFounder} size="w-8 h-8" />
                                                <div className="text-sm font-bold flex items-center gap-2">
                                                    <span>${lang === 'ar' ? 'الناشر:' : 'Publisher:'}</span>
                                                    <span>${lang === 'ar' ? (author.nameAr || author.name) : (author.nameEn || author.name)}</span>
                                                    ${author.isVIP && html`<span className="text-xs text-brand-DEFAULT">✨</span>`}
                                                    ${author.isFounder && html`<span className="text-xs bg-brand-gold text-black px-2 py-0.5 rounded-full">${Luminova.i18n[lang].founder}</span>`}
                                                </div>
                                            </div>
                                        `}
                                        <h3 className="text-xl font-bold mb-2">${n[`title${lang === 'ar' ? 'Ar' : 'En'}`] || n.titleAr || n.titleEn}</h3>
                                        <${Luminova.Components.SmartText} text=${n[`content${lang === 'ar' ? 'Ar' : 'En'}`] || n.contentAr || n.contentEn} lang=${lang} />
                                        ${((n.mediaUrls && n.mediaUrls.length > 0) || n.mediaUrl) ? html`
                                            <div className="mt-4">
                                                <button onClick=${() => { setActiveSummary(n); setView('summaryDetail'); }} className="w-full py-3 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-600 dark:text-indigo-400 hover:text-white transition-all rounded-xl font-bold flex items-center justify-center gap-2 border border-indigo-500/20 shadow-sm">
                                                    <span className="text-xl">📎</span>
                                                    <span>${lang === 'ar' ? 'عرض المرفقات المنشورة' : 'View Attachments'}</span>
                                                </button>
                                            </div>
                                        ` : null}
                                        <div className="text-xs opacity-50 mt-4 font-semibold">${Luminova.formatDate(n.timestamp, lang)}</div>
                                    </${Luminova.Components.GlassCard}>
                                `;
                            })}
                        </div>
                        ${visibleCount < subData.length && html`
                            <div className="pt-2 pb-8">
                                <button onClick=${() => setVisibleCount(prev => prev + 10)} className="w-full sm:w-auto mx-auto block mt-6 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all">
                                    ${lang === 'ar' ? 'عرض المزيد ➕' : 'Load More ➕'}
                                </button>
                            </div>
                        `}
                    ` : html`
                        <${Luminova.Components.TimelineFeed} items=${subData} students=${data.students} subjects=${data.subjects} lang=${lang} onQuizClick=${(q) => { setActiveQuiz(q); setView('quiz'); }} onSummaryClick=${(item) => { setActiveSummary(item); setView('summaryDetail'); }} />
                    `}
                </div>
            `;
        }

        return html`
        <div className="space-y-12 animate-fade-in">
            ${topContributors.length > 0 && html`
                <div className="mb-10">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-brand-gold">${Luminova.i18n[lang].topContributors}</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                        ${topContributors.map((c, i) => html`
                            <${Luminova.Components.GlassCard} key=${c.student.id} className="min-w-[200px] flex-shrink-0 text-center flex flex-col items-center snap-center bg-gradient-to-b from-transparent to-brand-gold/5 border-b-4 border-b-brand-gold">
                                <div className="absolute top-2 right-2 text-xl font-black opacity-30">#${i + 1}</div>
                                <${Luminova.Components.Avatar} name=${c.student.nameAr || c.student.name} image=${c.student.image} isVIP=${c.student.isVIP} isFounder=${c.student.isFounder || c.student.id === 's_founder'} isVerified=${c.student.isVerified} size="w-16 h-16 mb-2" />
                                <h3 className="font-bold text-sm">${lang === 'ar' ? (c.student.nameAr || c.student.name) : (c.student.nameEn || c.student.name)}</h3>
                                <div className="text-xs opacity-70 mt-1">${c.score} ${lang === 'ar' ? 'مساهمة' : 'Contributions'}</div>
                            </${Luminova.Components.GlassCard}>
                        `)}
                    </div>
                </div>
            `}

            ${data.news.length > 0 && html`
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">${Luminova.i18n[lang].news}</h2>
                        <button onClick=${() => { setExpandedView('news'); setVisibleCount(10); }} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">${lang === 'ar' ? 'عرض الكل ➔' : 'View All ➔'}</button>
                    </div>
                    <div className="space-y-4">
                        ${data.news.slice(0, 3).map((n, idx) => {
            const author = Luminova.getStudent(n.studentId, data.students);
            return html`
                            <${Luminova.Components.GlassCard} key=${idx} className=${`border-l-4 ${idx === 0 ? 'border-l-brand-gold bg-brand-gold/5' : 'border-l-brand-DEFAULT'}`}>
                                ${n.studentId && html`
                                    <div className="flex items-center gap-3 mb-4 opacity-80 border-b border-gray-200 dark:border-gray-700 pb-3">
                                        <${Luminova.Components.Avatar} name=${author.nameAr || author.name} nameEn=${author.nameEn} image=${author.image} isVerified=${author.isVerified} isFounder=${author.isFounder} size="w-8 h-8" />
                                        <div className="text-sm font-bold flex items-center gap-2">
                                            <span>${lang === 'ar' ? 'الناشر:' : 'Publisher:'}</span>
                                            <span>${lang === 'ar' ? (author.nameAr || author.name) : (author.nameEn || author.name)}</span>
                                            ${author.isVIP && html`<span className="text-xs text-brand-DEFAULT">✨</span>`}
                                            ${author.isFounder && html`<span className="text-xs bg-brand-gold text-black px-2 py-0.5 rounded-full">${Luminova.i18n[lang].founder}</span>`}
                                        </div>
                                    </div>
                                `}
                                <h3 className="text-xl font-bold mb-2">${n[`title${lang === 'ar' ? 'Ar' : 'En'}`] || n.titleAr || n.titleEn}</h3>
                                <${Luminova.Components.SmartText} text=${n[`content${lang === 'ar' ? 'Ar' : 'En'}`] || n.contentAr || n.contentEn} lang=${lang} />
                                ${((n.mediaUrls && n.mediaUrls.length > 0) || n.mediaUrl) ? html`
                                    <div className="mt-4">
                                        <button onClick=${() => { setActiveSummary(n); setView('summaryDetail'); }} className="w-full py-3 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-600 dark:text-indigo-400 hover:text-white transition-all rounded-xl font-bold flex items-center justify-center gap-2 border border-indigo-500/20 shadow-sm">
                                            <span className="text-xl">📎</span>
                                            <span>${lang === 'ar' ? 'عرض المرفقات المنشورة' : 'View Attachments'}</span>
                                        </button>
                                    </div>
                                ` : null}
                                <div className="text-xs opacity-50 mt-4 font-semibold">${Luminova.formatDate(n.timestamp, lang)}</div>
                            </${Luminova.Components.GlassCard}>
                        `})}
                    </div>
                </div>
            `}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">${Luminova.i18n[lang].feed}</h2>
                    <button onClick=${() => { setExpandedView('summaries'); setVisibleCount(10); }} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">${lang === 'ar' ? 'عرض الكل ➔' : 'View All ➔'}</button>
                </div>
                <${Luminova.Components.TimelineFeed} items=${feedItems.slice(0, 5)} students=${data.students} subjects=${data.subjects} lang=${lang} onQuizClick=${(q) => { setActiveQuiz(q); setView('quiz'); }} onSummaryClick=${(item) => { setActiveSummary(item); setView('summaryDetail'); }} />
            </div>
        </div>
    `;
    };



Luminova.Pages.AcademicHierarchyPage = ({ data, lang, setView, setActiveQuiz, setActiveSummary }) => {
        const [selectedYear, setSelectedYear] = useState(null);
        const [selectedSem, setSelectedSem] = useState(null);
        const [selectedSub, setSelectedSub] = useState(null);
        const [activeTab, setActiveTab] = useState('summaries');

        const semesters = data.semesters.filter(s => s.yearId === selectedYear?.id);
        const subjects = data.subjects.filter(s => s.semesterId === selectedSem?.id);
        const summaries = data.summaries.filter(s => s.subjectId === selectedSub?.id);
        const quizzes = data.quizzes.filter(q => q.subjectId === selectedSub?.id);

        return html`
        <div className="animate-fade-in flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <${Luminova.Components.GlassCard}>
                    <h3 className="font-bold mb-4">${Luminova.i18n[lang].years}</h3>
                    <div className="space-y-2">
                        ${data.years.map(y => html`
                            <button key=${y.id} onClick=${() => { setSelectedYear(y); setSelectedSem(null); setSelectedSub(null); }} 
                                className=${`w-full text-start px-4 py-3 rounded-xl transition-colors font-semibold ${selectedYear?.id === y.id ? 'bg-brand-DEFAULT text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                ${y[`name${lang === 'ar' ? 'Ar' : 'En'}`] || y.nameAr || y.nameEn}
                            </button>
                        `)}
                    </div>
                </${Luminova.Components.GlassCard}>

                ${selectedYear && html`
                    <${Luminova.Components.GlassCard} className="animate-fade-in">
                        <h3 className="font-bold mb-4">${Luminova.i18n[lang].semesters}</h3>
                        <div className="space-y-2">
                            ${semesters.map(s => html`
                                <button key=${s.id} onClick=${() => { setSelectedSem(s); setSelectedSub(null); }} 
                                    className=${`w-full text-start px-4 py-3 rounded-xl transition-colors font-semibold ${selectedSem?.id === s.id ? 'bg-brand-DEFAULT text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                    ${s[`name${lang === 'ar' ? 'Ar' : 'En'}`] || s.nameAr || s.nameEn}
                                </button>
                            `)}
                        </div>
                    </${Luminova.Components.GlassCard}>
                `}

                ${selectedSem && html`
                    <${Luminova.Components.GlassCard} className="animate-fade-in border-l-4 border-l-brand-DEFAULT">
                        <h3 className="font-bold mb-4">${Luminova.i18n[lang].subjects}</h3>
                        <div className="space-y-2">
                            ${subjects.map(s => html`
                                <button key=${s.id} onClick=${() => setSelectedSub(s)} 
                                    className=${`w-full text-start px-4 py-3 rounded-xl transition-colors font-bold ${selectedSub?.id === s.id ? 'bg-brand-DEFAULT text-white shadow-lg scale-105' : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    ${s[`name${lang === 'ar' ? 'Ar' : 'En'}`] || s.nameAr || s.nameEn}
                                </button>
                            `)}
                        </div>
                    </${Luminova.Components.GlassCard}>
                `}
            </div>

            <div className="w-full md:w-2/3">
                ${selectedSub ? html`
                    <div className="animate-fade-in min-h-[50vh]">
                        <h2 className="text-4xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-brand-DEFAULT to-brand-gold pb-2">${selectedSub[`name${lang === 'ar' ? 'Ar' : 'En'}`] || selectedSub.nameAr}</h2>
                        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 sticky top-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10 pt-4">
                            <button onClick=${() => setActiveTab('summaries')} className=${`px-8 py-4 font-bold border-b-4 transition-colors text-lg ${activeTab === 'summaries' ? 'border-brand-DEFAULT text-brand-DEFAULT' : 'border-transparent opacity-50 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-white/5 rounded-t-lg'}`}>
                                ${Luminova.i18n[lang].summaries} (${summaries.length})
                            </button>
                            <button onClick=${() => setActiveTab('quizzes')} className=${`px-8 py-4 font-bold border-b-4 transition-colors text-lg ${activeTab === 'quizzes' ? 'border-brand-DEFAULT text-brand-DEFAULT' : 'border-transparent opacity-50 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-white/5 rounded-t-lg'}`}>
                                ${Luminova.i18n[lang].quizzes} (${quizzes.length})
                            </button>
                        </div>
                        <div className="pt-4">
                            ${activeTab === 'summaries' ? html`
                                <${Luminova.Components.TimelineFeed} items=${summaries} students=${data.students} subjects=${data.subjects} lang=${lang} onQuizClick=${() => { }} onSummaryClick=${(item) => { setActiveSummary(item); setView('summaryDetail'); }} />
                            ` : html`
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    ${quizzes.map(q => html`
                                        <${Luminova.Components.GlassCard} key=${q.id} className="border-t-4 border-t-brand-gold hover:scale-[1.02] transition-transform">
                                            ${q.publisherId && html`
                                                <div className="flex items-center gap-3 mb-4 bg-gray-50 dark:bg-gray-800/80 p-3 rounded-xl border border-gray-100 dark:border-gray-700 w-fit shrink-0">
                                                    <${Luminova.Components.Avatar} name=${Luminova.getStudent(q.publisherId, data.students).nameAr || Luminova.getStudent(q.publisherId, data.students).name} image=${Luminova.getStudent(q.publisherId, data.students).image} isVIP=${Luminova.getStudent(q.publisherId, data.students).isVIP} isFounder=${Luminova.getStudent(q.publisherId, data.students).isFounder || q.publisherId === 's_founder_hardcoded'} isVerified=${Luminova.getStudent(q.publisherId, data.students).isVerified} size="w-8 h-8" />
                                                    <div>
                                                        <span className="text-xs opacity-50 block leading-tight font-bold">نُشر بواسطة:</span>
                                                        <span className="text-sm font-black flex items-center gap-1">${lang === 'ar' ? (Luminova.getStudent(q.publisherId, data.students).nameAr || Luminova.getStudent(q.publisherId, data.students).name) : (Luminova.getStudent(q.publisherId, data.students).nameEn || Luminova.getStudent(q.publisherId, data.students).name)}</span>
                                                    </div>
                                                </div>
                                            `}
                                            <h3 className="text-2xl font-bold mb-3">${q[`title${lang === 'ar' ? 'Ar' : 'En'}`] || q.titleAr || q.titleEn || q.title || 'بدون عنوان'}</h3>
                                            <p className="text-sm opacity-70 mb-6 bg-black/5 dark:bg-white/5 inline-block px-3 py-1 rounded-full">${(q.questions || []).length} ${Luminova.i18n[lang].questions}</p>
                                            <${Luminova.Components.Button} onClick=${() => { setActiveQuiz(q); setView('quiz'); }} className="w-full text-lg py-3">
                                                ${Luminova.i18n[lang].startQuiz}
                                            </${Luminova.Components.Button}>
                                        </${Luminova.Components.GlassCard}>
                                    `)}
                                    ${quizzes.length === 0 ? html`
                                        <div className="col-span-2 text-center py-20 opacity-50 border-2 border-dashed rounded-2xl dark:border-gray-700">${Luminova.i18n[lang].emptyState}</div>
                                    ` : null}
                                </div>
                            `}
                        </div>
                    </div>
                ` : html`
                    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] opacity-50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl bg-gray-50/50 dark:bg-gray-900/20">
                        <${Luminova.Icons.Book} />
                        <p className="mt-4 text-xl font-bold">${lang === 'ar' ? 'الرجاء اختيار مادة لعرض المحتوى' : 'Please select a subject to view content'}</p>
                    </div>
                `}
            </div>
        </div>
    `;
    };

    // ==========================================



Luminova.Pages.StudentCommunityPage = ({ data, lang, setView, setActiveSummary }) => {
        const [selectedStudent, setSelectedStudent] = useState(null);
        const [visibleCount, setVisibleCount] = useState(5);
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
                (q.questions || []).forEach(qn => {
                    const sId = normalizeId(qn.studentId);
                    if (sId) counts[sId] = (counts[sId] || 0) + 1;
                });
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
        const sortedStudents = data.students.filter(s => !s.isFounder && s.id !== 's_founder').sort((a, b) => b.isVIP - a.isVIP);

        // Prepend Founder to always be Index 0
        let allStudentsList = [founder, ...sortedStudents];
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            allStudentsList = allStudentsList.filter(student =>
                (student.nameAr || student.name || '').toLowerCase().includes(query) ||
                (student.nameEn || '').toLowerCase().includes(query)
            );
        }

        
        if (selectedStudent !== null) {
            const studentPosts = (() => {
                    const userQuestions = [];
                    data.quizzes.forEach(q => {
                        (q.questions || []).forEach(qn => {
                            const sId = (qn.studentId === 's_founder' || qn.studentId === 's_founder_hardcoded') ? Luminova.FOUNDER.id : qn.studentId;
                            if (sId === selectedStudent.id) {
                                userQuestions.push({
                                    id: qn.id,
                                    titleAr: 'سؤال تفاعلي في: ' + (q.titleAr || q.titleEn || q.title || 'اختبار'),
                                    titleEn: 'Interactive Question in: ' + (q.titleEn || q.titleAr || q.title || 'Quiz'),
                                    contentAr: qn.textAr || qn.text,
                                    contentEn: qn.textEn || qn.text,
                                    mediaUrl: qn.mediaUrl,
                                    timestamp: qn.timestamp || q.timestamp || new Date().toISOString(),
                                    studentId: qn.studentId,
                                    subjectId: q.subjectId,
                                    isSingleQuestion: true,
                                    parentQuiz: q
                                });
                            }
                        });
                    });
                    const userSummaries = data.summaries.filter(i => {
                        const sId = (i.studentId === 's_founder' || i.studentId === 's_founder_hardcoded') ? Luminova.FOUNDER.id : i.studentId;
                        return sId === selectedStudent.id;
                    });
                    return [...userSummaries, ...userQuestions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            })();

            const displayedPosts = studentPosts.slice(0, visibleCount);

            return html`
                <div className="animate-fade-in space-y-6">
                    <div className="flex justify-between items-center mb-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <${Luminova.Components.Avatar} name=${selectedStudent.nameAr || selectedStudent.name} image=${selectedStudent.image} isVIP=${selectedStudent.isVIP} isFounder=${selectedStudent.isFounder || selectedStudent.id === 's_founder_hardcoded'} isVerified=${selectedStudent.isVerified} size="w-12 h-12" />
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                ${lang === 'ar' ? (selectedStudent.nameAr || selectedStudent.name) : (selectedStudent.nameEn || selectedStudent.name)}
                            </h2>
                        </div>
                        <button onClick=${() => setSelectedStudent(null)} className="font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500/20">✖ ${lang === 'ar' ? 'رجوع للطلاب' : 'Back to Students'}</button>
                    </div>

                    <div className="bg-white/50 dark:bg-gray-900/50 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                        <p className="opacity-90 font-bold text-brand-DEFAULT text-lg">${selectedStudent[`major${lang === 'ar' ? 'Ar' : 'En'}`] || selectedStudent.majorAr}</p>
                        <div className="mt-2 text-gray-600 dark:text-gray-400">
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
                                <button onClick=${() => setVisibleCount(prev => prev + 5)} className="w-full sm:w-auto mx-auto block mt-6 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all">
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
                 <input type="text" placeholder=${lang === 'ar' ? 'البحث عن زميل (بالاسم العربي أو الإنجليزي)...' : 'Search for a peer...'} value=${searchQuery} onChange=${e => setSearchQuery(e.target.value)} className="w-full p-5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur border-2 dark:border-gray-700 focus:border-brand-DEFAULT shadow-xl outline-none font-bold text-lg text-center transition-all" />
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                ${allStudentsList.map((student, idx) => html`
                    <${Luminova.Components.GlassCard} 
                        key=${student.id} 
                        onClick=${() => { setSelectedStudent(student); setVisibleCount(5); }} 
                        className=${`text-center flex flex-col items-center ${idx === 0 ? 'scale-105 relative z-10 bg-gradient-to-br from-yellow-50 to-white dark:from-gray-900 dark:to-black border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)] text-gray-900 dark:text-gray-100' : student.isVIP ? 'bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/40 border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : ''}`}
                    >
                        <div className="mb-4">
                            <${Luminova.Components.Avatar} name=${student.nameAr || student.name} nameEn=${student.nameEn} image=${student.image} isVIP=${student.isVIP} isFounder=${idx === 0} isVerified=${student.isVerified} size="w-24 h-24" />
                        </div>
                        <h3 className="text-xl font-bold flex flex-wrap items-center justify-center gap-2">
                            ${lang === 'ar' ? (student.nameAr || student.name) : (student.nameEn || student.name)}
                        </h3>
                        ${idx === 0 && html`<span className="text-xs bg-brand-gold text-black font-black px-3 py-1 rounded-full shadow-lg mt-2 mb-1 border border-yellow-500 block w-max mx-auto">${Luminova.i18n[lang].founder}</span>`}
                        <p className="text-sm opacity-90 mt-2 font-semibold ${idx === 0 ? 'text-brand-gold drop-shadow-sm' : ''}">${student[`major${lang === 'ar' ? 'Ar' : 'En'}`] || student.majorAr}</p>
                        <p className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full mt-2 font-bold opacity-80">${getContributionsCount[normalizeId(student.id)] || 0} ${lang === 'ar' ? 'مساهمة' : 'Contributions'}</p>
                        
                        <div className="mt-4 flex justify-center gap-4 border-t border-gray-200 dark:border-gray-700 w-full pt-4">
                            ${student.socialLinks?.facebook && html`<a href=${student.socialLinks.facebook} target="_blank" onClick=${e => e.stopPropagation()} className="hover:scale-125 transition-transform"><${Luminova.Icons.Facebook} /></a>`}
                            ${student.socialLinks?.instagram && html`<a href=${student.socialLinks.instagram} target="_blank" onClick=${e => e.stopPropagation()} className="hover:scale-125 transition-transform"><${Luminova.Icons.Instagram} /></a>`}
                            ${student.socialLinks?.linkedin && html`<a href=${student.socialLinks.linkedin} target="_blank" onClick=${e => e.stopPropagation()} className="hover:scale-125 transition-transform"><${Luminova.Icons.LinkedIn} /></a>`}
                        </div>
                    </${Luminova.Components.GlassCard}>
                `)}
            </div>

            
        </div>
    `;
    };


})();


