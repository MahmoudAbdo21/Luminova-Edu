const fs = require('fs');
const file = 'd:/Luminova-Edu/js/pages/main-views.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /const \[selectedStudent, setSelectedStudent\] = useState\(null\);/g,
    `const [selectedStudent, setSelectedStudent] = useState(null);\n        const [visibleCount, setVisibleCount] = useState(5);`
);

content = content.replace(
    /onClick=\$\{\(\) => setSelectedStudent\(student\)\}/g,
    `onClick=\${() => { setSelectedStudent(student); setVisibleCount(5); }}`
);

const subViewLogic = `
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

            return html\`
                <div className="animate-fade-in space-y-6">
                    <div className="flex justify-between items-center mb-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <\${Luminova.Components.Avatar} name=\${selectedStudent.nameAr || selectedStudent.name} image=\${selectedStudent.image} isVIP=\${selectedStudent.isVIP} isFounder=\${selectedStudent.isFounder || selectedStudent.id === 's_founder_hardcoded'} isVerified=\${selectedStudent.isVerified} size="w-12 h-12" />
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                \${lang === 'ar' ? (selectedStudent.nameAr || selectedStudent.name) : (selectedStudent.nameEn || selectedStudent.name)}
                            </h2>
                        </div>
                        <button onClick=\${() => setSelectedStudent(null)} className="font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500/20">✖ \${lang === 'ar' ? 'رجوع للطلاب' : 'Back to Students'}</button>
                    </div>

                    <div className="bg-white/50 dark:bg-gray-900/50 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                        <p className="opacity-90 font-bold text-brand-DEFAULT text-lg">\${selectedStudent[\`major\${lang === 'ar' ? 'Ar' : 'En'}\`] || selectedStudent.majorAr}</p>
                        <div className="mt-2 text-gray-600 dark:text-gray-400">
                            <\${Luminova.Components.SmartText} text=\${selectedStudent[\`bio\${lang === 'ar' ? 'Ar' : 'En'}\`] || selectedStudent.bioAr} lang=\${lang} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">\${lang === 'ar' ? 'المساهمات' : 'Contributions'}</h3>
                        <\${Luminova.Components.TimelineFeed} 
                            items=\${displayedPosts} 
                            students=\${data.students} subjects=\${data.subjects} lang=\${lang} onQuizClick=\${() => { alert(lang === 'ar' ? 'قم بالدخول للاختبار الكامل من القسم الأكاديمي' : 'Access full quiz from Academic section'); }} onSummaryClick=\${(item) => { setActiveSummary(item); setView('summaryDetail'); }}
                        />
                        \${visibleCount < studentPosts.length && html\`
                            <div className="pt-2 pb-8">
                                <button onClick=\${() => setVisibleCount(prev => prev + 5)} className="w-full sm:w-auto mx-auto block mt-6 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all">
                                    \${lang === 'ar' ? 'عرض المزيد ➕' : 'Load More ➕'}
                                </button>
                            </div>
                        \`}
                    </div>
                </div>
            \`;
        }\n\n`;

content = content.replace(
    /return html\`\s*\<div className="animate-fade-in"\>\s*\<h2 className="text-3xl font-bold mb-8 text-center"\>\$\{Luminova\.i18n\[lang\]\.community\}\<\/h2\>/g,
    subViewLogic + '        return html\`\n        <div className="animate-fade-in">\n             <h2 className="text-3xl font-bold mb-8 text-center">${Luminova.i18n[lang].community}</h2>'
);

const modalRegex = /\\$\\{selectedStudent && html\`[\\s\\S]*?Access full quiz from Academic section[\\s\\S]*?\\}\\}\\s*\/>\\s*<\/div>\\s*<\/div>\\s*<\/div>\\s*\`\\}/g;
content = content.replace(modalRegex, '');

fs.writeFileSync(file, content);
console.log("Done replace2");
