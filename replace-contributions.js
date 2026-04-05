const fs = require('fs');
const file = 'd:/Luminova-Edu/js/pages/main-views.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove data.news.forEach from topContributors
const newsForEachRegex = /\s*data\.news\.forEach\(\s*n\s*=>\s*\{\s*const\s*sId\s*=\s*normalizeId\(n\.studentId\);\s*if\s*\(sId\)\s*counts\[sId\]\s*=\s*\(counts\[sId\]\s*\|\|\s*0\)\s*\+\s*1;\s*\}\s*\);/g;
content = content.replace(newsForEachRegex, '');

// 2. Remove data.news from the dependency array of topContributors useMemo
content = content.replace(/\[data\.summaries,\s*data\.news,\s*data\.quizzes,\s*data\.students\]/g, '[data.summaries, data.quizzes, data.students]');

// 3. Inject getContributionsCount inside StudentCommunityPage
// Look for where founder object is defined or right before it
const injectLogic = `        const normalizeId = (id) => {
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

        // Founder Hardcoded Data`;

content = content.replace(/\s*\/\/\s*Founder Hardcoded Data/g, '\n' + injectLogic);

// 4. Update the Student Profile View
// Add contribution count into the sub-view profile section
const profileBioRegex = /(\<div className="mt-2 text-gray-600 dark:text-gray-400"\>\s*\<\$\{Luminova\.Components\.SmartText\}.*?\/div\>)/g;

content = content.replace(profileBioRegex, `$1\n                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">\n                            <span className="text-sm opacity-70 block">\${lang === 'ar' ? 'إجمالي المساهمات' : 'Total Contributions'}</span>\n                            <p className="text-2xl font-black text-brand-DEFAULT flex items-center gap-2">🏅 \${getContributionsCount[normalizeId(selectedStudent.id)] || 0}</p>\n                        </div>`);

// 5. Update the Student Card in the directory grid
// Append contribution badge under the major
const studentCardMajorRegex = /(\<p className="text-sm opacity-90 mt-2 font-semibold[^>]*\>\$\{student\[\`major\$\{lang === 'ar' \? 'Ar' : 'En'\}\`\] \|\| student\.majorAr\}\<\/p\>)/g;

content = content.replace(studentCardMajorRegex, `$1\n                        <p className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full mt-2 font-bold opacity-80">\${getContributionsCount[normalizeId(student.id)] || 0} \${lang === 'ar' ? 'مساهمة' : 'Contributions'}</p>`);

fs.writeFileSync(file, content);
console.log("Done updating contributions");
