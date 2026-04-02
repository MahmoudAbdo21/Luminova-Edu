(function () {
    // ==========================================
    // PART 1: Core Utilities, i18n, Icons, Atoms
    // ==========================================
    var { useState, useEffect, useMemo, useCallback } = window.React;
    var html = window.htm.bind(window.React.createElement);

    window.__LUMINOVA = {};
    const Luminova = window.__LUMINOVA;

    Luminova.FOUNDER = {
        id: 's_founder_hardcoded', nameAr: 'محمود عبد الرحمن عبدالله', nameEn: 'Mahmoud Abdelrahman', isFounder: true, isVIP: true, isVerified: true,
        image: 'img/profile.png', majorAr: 'تكنولوجيا التعليم', majorEn: 'Educational Technology',
        socialLinks: { facebook: 'https://www.facebook.com/mahmoud.abdalrahaman.hagag', instagram: 'https://www.instagram.com/mahmoud_abdelrhman_1', linkedin: 'https://www.linkedin.com/in/mahmoud-hagag-145127346/' }
    };

    Luminova.getStudent = (id, studentsList) => {
        if (!id) return { id: 'unknown', nameAr: 'غير معروف', nameEn: 'Unknown' };
        if (id === Luminova.FOUNDER.id || id === 's_founder' || id === 's_founder_hardcoded') return Luminova.FOUNDER;
        return (studentsList || []).find(s => s.id === id) || { id: 'unknown', nameAr: 'غير معروف', nameEn: 'Unknown' };
    };

    Luminova.i18n = {
        ar: {
            appName: "Luminova Edu", home: "الرئيسية", community: "مجتمع الطلاب", academic: "المكتبة الأكاديمية",
            adminToggle: "الإدارة", founder: "المؤسس", vip: "مميز", verified: "موثوق",
            readMore: "عرض المزيد", readLess: "عرض أقل", searchPlaceholder: "ابحث هنا...", emptyState: "لا يوجد بيانات لعرضها.",
            years: "الفرق الدراسية", semesters: "الفصول الدراسية", subjects: "المواد الدراسية",
            summaries: "التلخيصات", quizzes: "الاختبارات", startQuiz: "بدء الاختبار", questions: "الأسئلة",
            quitWarning: "هل أنت متأكد من الخروج؟ سيتم فقدان التقدم.", score: "الدرجة",
            modelAnswer: "الإجابة النموذجية:", explanation: "التعليل:",
            deleteProtected: "لا يمكن الحذف.. الرجاء مسح المحتويات الداخلية أولاً",
            save: "حفظ", delete: "حذف", cancel: "إلغاء", exportData: "سحب الكود (Export initialData)",
            logout: "خروج الإدارة", passwordPrompt: "أدخل كلمة سر الإدارة:", wrongPassword: "كلمة السر خاطئة!",
            major: "التخصص", correct: "إجابة صحيحة", wrong: "إجابة خاطئة", results: "النتائج",
            topContributors: "شرف المساهمين 🏆", news: "أحدث الأخبار 📢", feed: "الخلاصة 🔥"
        },
        en: {
            appName: "Luminova Edu", home: "Home", community: "Community", academic: "Academic Library",
            adminToggle: "Admin", founder: "Founder", vip: "VIP", verified: "Verified",
            readMore: "Read More", readLess: "Read Less", searchPlaceholder: "Search...", emptyState: "No data available.",
            years: "Academic Years", semesters: "Semesters", subjects: "Subjects",
            summaries: "Summaries", quizzes: "Quizzes", startQuiz: "Start Quiz", questions: "Questions",
            quitWarning: "Are you sure you want to quit? Progress will be lost.", score: "Score",
            modelAnswer: "Model Answer:", explanation: "Explanation:",
            deleteProtected: "Cannot delete. Please remove inner contents first.",
            save: "Save", delete: "Delete", cancel: "Cancel", exportData: "Export initialData Code",
            logout: "Admin Logout", passwordPrompt: "Enter admin password:", wrongPassword: "Wrong password!",
            major: "Major", correct: "Correct", wrong: "Wrong", results: "Results",
            topContributors: "Top Contributors 🏆", news: "Latest News 📢", feed: "The Feed 🔥"
        }
    };

    Luminova.Icons = {
        User: () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        Book: () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`,
        Home: () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
        CheckCircle: () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
        XCircle: () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
        Trash: () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
        Edit: () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        Facebook: () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
        Instagram: () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
        LinkedIn: () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
        VerifiedBlue: () => html`<svg class="w-5 h-5 absolute bottom-0 right-0 z-10 translate-x-1/4 translate-y-1/4 shadow-sm bg-white rounded-full p-[1px]" viewBox="0 0 24 24" fill="#1D9BF0" xmlns="http://www.w3.org/2000/svg"><path d="M22.5 12.5C22.5 11.95 22.05 11.5 21.5 11.5L20.67 11.33C20.62 10.5 20.35 9.72 19.92 9L20.44 8.27C20.76 7.82 20.68 7.18 20.25 6.75L17.25 3.75C16.82 3.32 16.18 3.24 15.73 3.56L15 4.08C14.28 3.65 13.5 3.38 12.67 3.33L12.5 2.5C12.5 1.95 12.05 1.5 11.5 1.5H8.5C7.95 1.5 7.5 1.95 7.5 2.5L7.33 3.33C6.5 3.38 5.72 3.65 5 4.08L4.27 3.56C3.82 3.24 3.18 3.32 2.75 3.75L-0.25 6.75C-0.68 7.18 -0.76 7.82 -0.44 8.27L0.08 9C-0.35 9.72 -0.62 10.5 -0.67 11.33L-0.5 11.5C-0.5 12.05 -0.05 12.5 0.5 12.5H0.67C0.62 13.33 0.89 14.11 1.32 14.84L0.8 15.56C0.48 16.02 0.56 16.65 0.99 17.08L3.99 20.08C4.42 20.51 5.06 20.59 5.51 20.27L6.23 19.75C6.96 20.18 7.74 20.45 8.57 20.5L8.74 21.33C8.74 21.88 9.19 22.33 9.74 22.33H12.74C13.29 22.33 13.74 21.88 13.74 21.33L13.91 20.5C14.74 20.45 15.52 20.18 16.25 19.75L16.97 20.27C17.42 20.59 18.06 20.51 18.49 20.08L21.49 17.08C21.92 16.65 22.01 16.02 21.68 15.56L21.17 14.84C21.59 14.11 21.87 13.33 21.91 12.5H22.5ZM10.54 16.14L6.28 11.88L8.04 10.12L10.54 12.6L16.48 6.66L18.24 8.42L10.54 16.14Z" fill="white"/><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="#1D9BF0"/><path d="M16.966 8.404L10.3702 15L7.03403 11.6667L8.44825 10.2525L10.3702 12.1744L15.5518 6.98978L16.966 8.404Z" fill="white"/></svg>`
    };

    Luminova.Components = {};

    Luminova.Components.GlassCard = ({ children, className = "", onClick = null }) => {
        return html`
        <div onClick=${onClick} className=${`glass-card p-6 rounded-2xl ${onClick ? 'cursor-pointer' : ''} ${className}`}>
            ${children}
        </div>
    `;
    };

    Luminova.Components.SmartText = ({ text, lang = 'ar', maxLength = 150 }) => {
        const [expanded, setExpanded] = useState(false);
        if (!text) return null;
        const isLong = text.length > maxLength;
        return html`
        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            <p className=${`whitespace-pre-line smart-text ${expanded ? 'expanded' : 'collapsed'}`}>
                ${expanded ? text : text.substring(0, maxLength) + (isLong ? '...' : '')}
            </p>
            ${isLong && html`
                <button onClick=${(e) => { e.stopPropagation(); setExpanded(!expanded); }} className="text-brand-DEFAULT hover:text-brand-hover mt-1 font-semibold text-xs transition-colors">
                    ${expanded ? Luminova.i18n[lang].readLess : Luminova.i18n[lang].readMore}
                </button>
            `}
        </div>
    `;
    };

    Luminova.Components.SmartMedia = ({ url }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        if (!url) return null;
        let embedContent = null;
        let isLargeMedia = false;

        const isBase64 = url.startsWith('data:');
        const mimeMatch = isBase64 ? url.match(/data:(.*?);/) : null;
        const mimeType = mimeMatch ? mimeMatch[1] : '';

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1]?.split('?')[0] || url.split('/embed/')[1]?.split('?')[0];
            embedContent = html`<iframe src=${`https://www.youtube.com/embed/${videoId}`} title="YouTube" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" className="w-full h-[400px] border-none rounded-xl shadow-lg" allowFullScreen></iframe>`;
        } else if (url.includes('drive.google.com/file/d/')) {
            const driveId = url.split('/d/')[1]?.split('/')[0];
            embedContent = html`<iframe src=${`https://drive.google.com/file/d/${driveId}/preview`} width="100%" height="480" allow="autoplay" className="rounded-xl shadow-lg border-2 border-brand-DEFAULT/20" allowFullScreen></iframe>`;
        } else if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || (isBase64 && mimeType.startsWith('image/'))) {
            embedContent = html`<div style=${{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }} className="w-full">
                <img src=${url} alt="Smart Media" className="shadow-lg mx-auto" style=${{ maxHeight: '350px', maxWidth: '100%', width: 'auto', objectFit: 'contain' }} loading="lazy" />
            </div>`;
        } else if (url.match(/\.(mp4|webm|ogg)$/i) || (isBase64 && mimeType.startsWith('video/'))) {
            embedContent = html`<video controls className="w-full max-h-[500px] rounded-xl bg-black shadow-lg"><source src=${url} type=${isBase64 ? mimeType : `video/${url.split('.').pop()}`} />متصفحك لا يدعم تشغيل الفيديو.</video>`;
        } else if (url.match(/\.(pdf|html)$/i) || (isBase64 && (mimeType === 'application/pdf' || mimeType === 'text/html'))) {
            isLargeMedia = true;
            embedContent = html`<iframe src=${url} className="w-full h-[600px] border-none rounded-xl shadow-lg bg-white" allowFullScreen></iframe>`;
        } else {
            isLargeMedia = true;
            embedContent = html`<iframe src=${url} className="w-full h-[600px] border-none rounded-xl shadow-lg bg-white dark:bg-gray-900" allowFullScreen></iframe>`;
        }

        if (!isLargeMedia) {
            return html`
            <div className="mt-6 w-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-DEFAULT to-brand-gold opacity-30 rounded-2xl blur transition duration-1000 group-hover:opacity-60 -z-10"></div>
                ${embedContent}
            </div>
            `;
        }

        const containerStyle = !isExpanded ? { maxHeight: '250px', overflow: 'hidden' } : { position: 'relative' };

        return html`
        <div className="mt-6 w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-DEFAULT to-brand-gold opacity-30 rounded-2xl blur transition duration-1000 group-hover:opacity-60 -z-10"></div>
            
            <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" style=${containerStyle}>
                ${embedContent}
                ${!isExpanded && html`
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
                `}
            </div>

            <button 
                onClick=${(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="w-full mt-2 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-brand-DEFAULT hover:text-white dark:hover:bg-brand-DEFAULT transition-colors rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm border border-gray-200 dark:border-gray-700"
            >
                ${isExpanded ?
                html`<span className="text-xl">🗕</span> <span>تصغير العرض (Collapse)</span>` :
                html`<span className="text-xl">⛶</span> <span>عرض الملف الكامل (Expand)</span>`
            }
            </button>
        </div>
    `;
    };

    Luminova.Components.Avatar = ({ name = "", nameEn = "", image = "", isVIP = false, isVerified = false, isFounder = false, size = "w-12 h-12" }) => {
        const getInitials = () => {
            // Enforce pulling from English name strictly if missing image 
            const targetName = (nameEn && nameEn.trim() !== '') ? nameEn : "ST";
            const words = targetName.trim().split(' ').filter(w => w);
            return words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : targetName.substring(0, 2).toUpperCase();
        };
        return html`
        <div className="relative inline-block">
            <div className=${`relative ${size} flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white shadow-lg overflow-hidden
                ${isFounder ? 'founder-card text-brand-gold bg-black' : isVIP ? 'vip-glow bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-gray-500 to-gray-700'}`}>
                ${image ? html`<img src=${image} alt=${name} className="w-full h-full object-cover rounded-full" />` : getInitials()}
            </div>
            ${isVerified && !isFounder && html`<${Luminova.Icons.VerifiedBlue} />`}
        </div>
    `;
    };

    Luminova.Components.Input = ({ label, val, onChange, type = "text", placeholder = "" }) => {
        return html`
        <div className="mb-4 w-full">
            <label className="block text-sm font-black mb-2 opacity-80">${label}</label>
            ${type === 'checkbox' ? html`
                <label className="flex items-center gap-3 cursor-pointer bg-white dark:bg-gray-800 p-3 rounded-xl border dark:border-gray-700 shadow-sm w-max">
                    <input type="checkbox" checked=${val || false} onChange=${(e) => onChange(e.target.checked)} className="w-6 h-6 accent-brand-DEFAULT rounded" />
                    <span className="font-bold">${label}</span>
                </label>
            ` : type === 'textarea' ? html`
                <textarea value=${val || ''} onChange=${(e) => onChange(e.target.value)} placeholder=${placeholder} className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 border-2 dark:border-gray-700 focus:border-brand-DEFAULT outline-none shadow-sm min-h-[120px]" />
            ` : html`
                <input type=${type} value=${val || ''} onChange=${(e) => onChange(e.target.value)} placeholder=${placeholder} className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 border-2 dark:border-gray-700 focus:border-brand-DEFAULT outline-none shadow-sm font-bold text-lg" />
            `}
        </div>
    `;
    };

    Luminova.Components.SocialInput = ({ label, val, onChange }) => {
        return html`
        <div className="mb-4 w-full">
            <label className="block text-sm font-black mb-2 opacity-80">${label}</label>
            <input type="url" value=${val || ''} onChange=${(e) => onChange(e.target.value)} className="w-full p-4 rounded-xl bg-white/50 dark:bg-gray-800 border-2 border-dashed dark:border-gray-700 focus:border-brand-DEFAULT outline-none shadow-sm" placeholder="URL Link" />
        </div>
    `;
    };

    Luminova.Components.FileInput = ({ label, onFileLoaded, accept = "*/*" }) => {
        return html`
        <div className="mb-4 w-full">
            <label className="block text-sm font-black mb-2 opacity-80">${label}</label>
            <input type="file" accept=${accept} onChange=${(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => onFileLoaded(event.target.result);
                reader.readAsDataURL(file);
            }} className="w-full text-sm font-bold p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed dark:border-gray-700 focus:border-brand-DEFAULT outline-none cursor-pointer file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-brand-DEFAULT file:text-white hover:file:bg-brand-hover transition-all shadow-sm" />
        </div>
    `;
    };

    Luminova.Components.Button = ({ children, onClick, variant = 'primary', className = "", disabled = false }) => {
        const variants = {
            primary: "bg-brand-DEFAULT text-white hover:bg-brand-hover",
            danger: "bg-red-500 text-white hover:bg-red-600",
            glass: "glass-card text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
        };
        return html`
        <button disabled=${disabled} onClick=${onClick} className=${`px-4 py-2 rounded-lg font-semibold transition-all shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]} ${className}`}>
            ${children}
        </button>
    `;
    };

    Luminova.formatDate = (dateString, lang) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };
    // END OF PART 1

    // ==========================================
    // PART 2: Feeds & Core Pages (Home, Community, Academics)
    // ==========================================

    Luminova.Components.TimelineFeed = ({ items, students, subjects, lang, onQuizClick }) => {
        if (!items.length) return html`<div className="text-center py-10 opacity-50">${Luminova.i18n[lang].emptyState}</div>`;
        return html`
        <div className="space-y-6 relative border-s border-gray-200 dark:border-gray-700 ml-3 mr-3 px-4">
            ${items.map(item => {
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
                            <${Luminova.Components.SmartMedia} url=${item.mediaUrl} />
                            ${item.isSingleQuestion && html`
                                <div className="mt-4">
                                    <${Luminova.Components.Button} onClick=${() => onQuizClick(item.parentQuiz)}>${Luminova.i18n[lang].startQuiz}</${Luminova.Components.Button}>
                                </div>
                            `}
                        </</${Luminova.Components.GlassCard}>
                    </div>
                `;
        })}
        </div>
    `;
    };

    Luminova.Pages = {};

    Luminova.Pages.HomePage = ({ data, lang, setView, setActiveQuiz }) => {
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

            data.news.forEach(n => {
                const sId = normalizeId(n.studentId);
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
        }, [data.summaries, data.news, data.quizzes, data.students]);

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
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">${Luminova.i18n[lang].news}</h2>
                    <div className="space-y-4">
                        ${data.news.map((n, idx) => {
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
                                <${Luminova.Components.SmartMedia} url=${n.mediaUrl} />
                                <div className="text-xs opacity-50 mt-4">${Luminova.formatDate(n.timestamp, lang)}</div>
                            </${Luminova.Components.GlassCard}>
                        `})}
                    </div>
                </div>
            `}
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">${Luminova.i18n[lang].feed}</h2>
                <${Luminova.Components.TimelineFeed} items=${feedItems} students=${data.students} subjects=${data.subjects} lang=${lang} onQuizClick=${(q) => { setActiveQuiz(q); setView('quiz'); }} />
            </div>
        </div>
    `;
    };

    Luminova.Pages.StudentCommunityPage = ({ data, lang }) => {
        const [selectedStudent, setSelectedStudent] = useState(null);
        const [searchQuery, setSearchQuery] = useState('');

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
                        onClick=${() => setSelectedStudent(student)} 
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
                        
                        <div className="mt-4 flex justify-center gap-4 border-t border-gray-200 dark:border-gray-700 w-full pt-4">
                            ${student.socialLinks?.facebook && html`<a href=${student.socialLinks.facebook} target="_blank" onClick=${e => e.stopPropagation()} className="hover:scale-125 transition-transform"><${Luminova.Icons.Facebook} /></a>`}
                            ${student.socialLinks?.instagram && html`<a href=${student.socialLinks.instagram} target="_blank" onClick=${e => e.stopPropagation()} className="hover:scale-125 transition-transform"><${Luminova.Icons.Instagram} /></a>`}
                            ${student.socialLinks?.linkedin && html`<a href=${student.socialLinks.linkedin} target="_blank" onClick=${e => e.stopPropagation()} className="hover:scale-125 transition-transform"><${Luminova.Icons.LinkedIn} /></a>`}
                        </div>
                    </${Luminova.Components.GlassCard}>
                `)}
            </div>

            ${selectedStudent && html`
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick=${() => setSelectedStudent(null)}>
                    <div className="bg-white dark:bg-gray-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6" onClick=${e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6 border-b pb-4 dark:border-gray-700">
                            <div className="flex gap-6 items-center">
                               <${Luminova.Components.Avatar} name=${selectedStudent.nameAr || selectedStudent.name} image=${selectedStudent.image} isVIP=${selectedStudent.isVIP} isFounder=${selectedStudent.isFounder || selectedStudent.id === 's_founder_hardcoded'} isVerified=${selectedStudent.isVerified} size="w-20 h-20" />
                               <div>
                                   <h2 className="text-3xl font-bold flex items-center gap-2">
                                        ${lang === 'ar' ? (selectedStudent.nameAr || selectedStudent.name) : (selectedStudent.nameEn || selectedStudent.name)}
                                   </h2>
                                   <p className="opacity-90 mt-1 font-bold text-brand-DEFAULT">${selectedStudent[`major${lang === 'ar' ? 'Ar' : 'En'}`] || selectedStudent.majorAr}</p>
                                   <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                       <${Luminova.Components.SmartText} text=${selectedStudent[`bio${lang === 'ar' ? 'Ar' : 'En'}`] || selectedStudent.bioAr} lang=${lang} />
                                   </div>
                               </div>
                            </div>
                            <button onClick=${() => setSelectedStudent(null)} className="opacity-50 hover:opacity-100 p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><${Luminova.Icons.XCircle} /></button>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">${lang === 'ar' ? 'المساهمات' : 'Contributions'}</h3>
                            <${Luminova.Components.TimelineFeed} 
                                items=${(() => {
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
                })()} 
                                students=${data.students} subjects=${data.subjects} lang=${lang} onQuizClick=${() => { alert(lang === 'ar' ? 'قم بالدخول للاختبار الكامل من القسم الأكاديمي' : 'Access full quiz from Academic section'); }} 
                            />
                        </div>
                    </div>
                </div>
            `}
        </div>
    `;
    };

    Luminova.Pages.AcademicHierarchyPage = ({ data, lang, setView, setActiveQuiz }) => {
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
                                <${Luminova.Components.TimelineFeed} items=${summaries} students=${data.students} subjects=${data.subjects} lang=${lang} onQuizClick=${() => { }} />
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
    // PART 3: Quiz Engine Client View
    // ==========================================

    Luminova.Pages.QuizEngine = ({ quiz, data, lang, goBack }) => {
        const questions = useMemo(() => {
            if (!quiz || !quiz.questions) return [];
            let arr = [...quiz.questions];
            if (quiz.isShuffled) {
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
            }
            return arr;
        }, [quiz]);

        const [currentIndex, setCurrentIndex] = useState(0);
        const [answers, setAnswers] = useState({});
        const [isFinished, setIsFinished] = useState(false);
        const [isFeedbackRevealed, setIsFeedbackRevealed] = useState(false);

        if (questions.length === 0) {
            return html`
            <div className="text-center py-20 min-h-[50vh] flex flex-col justify-center items-center">
                <span className="text-4xl opacity-50 mb-4">📭</span>
                <p className="text-xl font-bold opacity-50 mb-6">${lang === 'ar' ? 'الاختبار قيد التجهيز..' : 'Quiz is under construction..'}</p>
                <${Luminova.Components.Button} onClick=${goBack}>${lang === 'ar' ? 'العودة للمادة' : 'Back to Subject'}</${Luminova.Components.Button}>
            </div>
        `;
        }

        const q = questions[currentIndex];
        const maxScore = questions.reduce((sum, curr) => sum + (Number(curr.score) || 0), 0);

        const handleFinish = () => {
            if (confirm(Luminova.i18n[lang].quitWarning.replace('?', '؟'))) setIsFinished(true);
        };

        if (isFinished) {
            let score = 0;
            questions.forEach(que => {
                if (que.type === 'mcq') {
                    if (answers[que.id] === que.correctAnswers?.[0]) score += Number(que.score);
                } else if (que.type === 'multi_select') {
                    const correctStr = [...(que.correctAnswers || [])].sort().join(',');
                    const ansStr = [...(answers[que.id] || [])].sort().join(',');
                    if (correctStr === ansStr) score += Number(que.score);
                }
            });

            return html`
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
                <${Luminova.Components.GlassCard} className="text-center py-16 bg-gradient-to-b from-brand-DEFAULT/10 to-transparent border-t-8 border-t-brand-DEFAULT">
                    <h2 className="text-5xl font-black mb-6 uppercase tracking-wider">${Luminova.i18n[lang].results}</h2>
                    <div className="text-8xl font-black text-brand-DEFAULT drop-shadow-2xl mb-8">${score} <span className="text-4xl opacity-50">/ ${maxScore}</span></div>
                    <${Luminova.Components.Button} onClick=${goBack} className="px-10 py-4 text-xl rounded-full shadow-2xl hover:scale-105">${lang === 'ar' ? 'العودة للمادة' : 'Back to Subject'}</${Luminova.Components.Button}>
                </${Luminova.Components.GlassCard}>
                
                ${questions.map((que, idx) => {
                const qLang = lang === 'ar' ? 'Ar' : 'En';
                let isCorrect = false;
                if (que.type === 'mcq') isCorrect = answers[que.id] === que.correctAnswers?.[0];
                if (que.type === 'multi_select') isCorrect = [...(que.correctAnswers || [])].sort().join(',') === [...(answers[que.id] || [])].sort().join(',');
                const studentProv = data.students.find(s => s.id === que.studentId) || (que.studentId === 's_founder' || que.studentId === Luminova.FOUNDER.id ? Luminova.FOUNDER : null);

                return html`
                        <${Luminova.Components.GlassCard} key=${idx} className=${`border-r-4 ${que.type !== 'essay' ? (isCorrect ? 'border-r-green-500' : 'border-r-red-500') : 'border-r-brand-gold'} relative`}>
                            <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-xl bg-black/10 dark:bg-white/10 font-bold text-sm">
                                ${que.score} ${Luminova.i18n[lang].score}
                            </div>
                            
                            ${studentProv && html`
                                <div className="flex items-center justify-between mb-4 opacity-70 border-b pb-2 dark:border-gray-700 w-full bg-black/5 dark:bg-white/5 rounded-t-xl p-3 -mt-6">
                                    <div className="flex gap-2 items-center">
                                        <span className="text-xs">المساهم بالمعلومة:</span>
                                        <span className="text-sm font-black mx-2 text-brand-gold">${lang === 'ar' ? studentProv.nameAr || studentProv.name : studentProv.nameEn || studentProv.name}</span>
                                        ${studentProv.isVIP && html`<span title="VIP">✨</span>`}
                                        ${studentProv.isVerified && html`<span title="Verified">🔵</span>`}
                                    </div>
                                    <${Luminova.Components.Avatar} name=${studentProv.nameAr || studentProv.name} nameEn=${studentProv.nameEn} image=${studentProv.image} size="w-8 h-8" />
                                </div>
                            `}

                            <h4 className="font-bold text-xl mt-4 mb-4 leading-relaxed">س ${idx + 1}: ${que.text || que.textAr}</h4>
                            
                            ${que.type !== 'essay' && html`
                                <div className="mt-6 p-5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 shadow-inner">
                                    <p className="flex items-start gap-2 mb-2" dangerouslySetInnerHTML=${{ __html: `<span class='font-bold opacity-70 min-w-[120px]'>${Luminova.i18n[lang].correct}:</span> <strong class="text-green-600 dark:text-green-400 font-bold text-lg">${(que.type === 'mcq' ? (que.options || que.optionsAr)[que.correctAnswers[0]] : que.correctAnswers.map(c => (que.options || que.optionsAr)[c]).join(' <span class="text-gray-400">|</span> '))}</strong>` }} />
                                    ${!isCorrect && html`<p className="flex items-start gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2" dangerouslySetInnerHTML=${{ __html: `<span class='font-bold opacity-70 min-w-[120px]'>${Luminova.i18n[lang].wrong}:</span> <strong class="text-red-500 dark:text-red-400 font-bold line-through opacity-80">${(answers[que.id] !== undefined ? (que.type === 'mcq' ? (que.options || que.optionsAr)[answers[que.id]] : (answers[que.id].length ? answers[que.id].map(c => (que.options || que.optionsAr)[c]).join(' | ') : 'بدون إجابة')) : 'بدون إجابة')}</strong>` }} />`}
                                </div>
                            `}

                            ${que.type === 'essay' && html`
                                <div className="mt-6 p-5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 shadow-inner space-y-4">
                                    <div>
                                        <p className="font-black text-brand-gold mb-2">${Luminova.i18n[lang].modelAnswer}</p>
                                        <p className="text-md leading-relaxed p-4 bg-white dark:bg-gray-900 rounded border-l-4 border-l-brand-gold font-medium">${que.modelAnswer || que.modelAnswerAr}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold border-t pt-4 dark:border-gray-700 mb-2">${lang === 'ar' ? 'إجابتك' : 'Your Answer'}:</p>
                                        <p className="text-md text-gray-600 dark:text-gray-400 p-4 bg-white/50 dark:bg-gray-900/50 rounded italic">${answers[que.id] || 'ـ بدون إجابة ـ'}</p>
                                    </div>
                                </div>
                            `}

                            ${(que.explanation || que.explanationAr) && html`
                                <div className="mt-6 p-5 rounded-xl bg-brand-DEFAULT/15 border border-brand-DEFAULT/30 relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 opacity-10 text-8xl text-brand-DEFAULT rotate-12">💡</div>
                                    <p className="font-black text-brand-DEFAULT mb-2 flex items-center gap-2">💡 ${Luminova.i18n[lang].explanation}</p>
                                    <p className="text-md leading-relaxed font-bold z-10 relative">${que.explanation || que.explanationAr}</p>
                                </div>
                            `}
                        </${Luminova.Components.GlassCard}>
                    `;
            })}
            </div>
        `;
        }

        const currentQStudent = data.students.find(s => s.id === q.studentId) || ((q.studentId === 's_founder' || q.studentId === Luminova.FOUNDER.id) ? Luminova.FOUNDER : {});

        return html`
        <div className="max-w-4xl mx-auto min-h-[70vh] flex flex-col pt-10 pb-20">
            <div className="flex justify-between items-center mb-10 bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl shadow-sm backdrop-blur">
                <${Luminova.Components.Button} variant="danger" onClick=${() => { if (confirm(Luminova.i18n[lang].quitWarning)) goBack(); }} className="rounded-full shadow-lg hover:-translate-x-1">
                    <${Luminova.Icons.XCircle} /> <span className="hidden sm:inline">${Luminova.i18n[lang].quitWarning.split('?')[0]}?</span>
                </${Luminova.Components.Button}>
                <div className="flex-1 mx-8 relative">
                    <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-gradient-to-r from-brand-hover to-brand-DEFAULT h-full transition-all duration-500 ease-out" style=${{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                    </div>
                </div>
                <span className="font-black text-2xl text-brand-DEFAULT drop-shadow-sm">${currentIndex + 1} <span className="opacity-40 text-lg">/ ${questions.length}</span></span>
            </div>

            <${Luminova.Components.GlassCard} className="relative overflow-visible mb-10 flex-1 flex flex-col border-t-8 border-t-brand-DEFAULT shadow-2xl">
                ${currentQStudent.id && html`
                    <div className="absolute -top-6 start-8 flex items-center gap-3 bg-white dark:bg-gray-800 shadow-xl p-2 pl-4 rounded-full border border-gray-100 dark:border-gray-700 z-10 animate-fade-in group hover:scale-105 transition-transform">
                        <${Luminova.Components.Avatar} name=${currentQStudent.nameAr || currentQStudent.name} image=${currentQStudent.image} isVerified=${currentQStudent.isVerified} size="w-8 h-8" />
                        <span className="text-sm font-black mx-1 text-brand-DEFAULT group-hover:text-brand-gold">${lang === 'ar' ? currentQStudent.nameAr || currentQStudent.name : currentQStudent.nameEn || currentQStudent.name}</span>
                        ${currentQStudent.isFounder && html`<span className="text-xs bg-brand-gold text-black font-black px-2 py-0.5 rounded-full shadow-md mr-1">${Luminova.i18n[lang].founder}</span>`}
                        <span className="text-xs font-bold opacity-50 ml-2 hidden sm:inline border-r pr-2 dark:border-gray-700">:المساهم بالسؤال</span>
                    </div>
                `}

                <div className="flex-1 mt-6">
                    <div className="flex justify-between items-start mb-8 ${q.mediaUrl ? '' : 'border-b border-gray-200 dark:border-gray-700 pb-6'}">
                        <h3 className="text-3xl font-bold leading-relaxed w-[85%]">${q.text || q.textAr}</h3>
                        <span className="text-xl font-black bg-brand-gold/20 text-brand-gold px-4 py-2 rounded-xl border border-brand-gold/50 shadow-sm shrink-0">${q.score} ${Luminova.i18n[lang].score}</span>
                    </div>
                    ${q.mediaUrl && html`
                        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6 w-full flex justify-center">
                            <div className="w-full max-h-[400px] rounded-2xl shadow-md bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-gray-800 overflow-hidden relative *:max-h-[400px] *:object-contain">
                                <${Luminova.Components.SmartMedia} url=${q.mediaUrl} />
                            </div>
                        </div>
                    `}
                    
                    ${q.type === 'mcq' && html`
                        <div className="space-y-4 max-w-2xl mx-auto">
                            ${(q.options || q.optionsAr || []).map((opt, i) => html`
                                <button key=${i} onClick=${() => !isFeedbackRevealed && setAnswers({ ...answers, [q.id]: i })}
                                    disabled=${isFeedbackRevealed}
                                    className=${`w-full text-start p-5 rounded-2xl border-4 transition-all duration-200 text-lg font-bold shadow-sm ${answers[q.id] === i ? 'border-brand-DEFAULT bg-brand-DEFAULT/10 scale-105 shadow-xl' : 'border-transparent bg-gray-100 dark:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-[1.02]'} ${isFeedbackRevealed ? 'opacity-70 cursor-not-allowed object-none' : ''}`}>
                                    <span className="inline-block w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 text-center leading-8 mr-4 ml-4">${String.fromCharCode(65 + i)}</span>
                                    ${opt}
                                </button>
                            `)}
                        </div>
                    `}

                    ${q.type === 'multi_select' && html`
                        <div className="space-y-4 max-w-2xl mx-auto">
                            ${(q.options || q.optionsAr || []).map((opt, i) => {
            const selected = answers[q.id] || [];
            const isSelected = selected.includes(i);
            return html`
                                    <button key=${i} disabled=${isFeedbackRevealed} onClick=${() => {
                    if (isFeedbackRevealed) return;
                    const next = isSelected ? selected.filter(x => x !== i) : [...selected, i];
                    setAnswers({ ...answers, [q.id]: next });
                }}
                                    className=${`w-full text-start p-5 rounded-2xl border-4 transition-all duration-200 text-lg font-bold shadow-sm flex items-center gap-4 ${isSelected ? 'border-brand-DEFAULT bg-brand-DEFAULT/10 scale-[1.02] shadow-xl' : 'border-transparent bg-gray-100 dark:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600'} ${isFeedbackRevealed ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                        <div className=${`w-8 h-8 rounded-xl flex items-center justify-center border-2 text-xl transition-colors ${isSelected ? 'bg-brand-DEFAULT border-brand-DEFAULT text-white' : 'border-gray-400'}`}>
                                            ${isSelected && '✓'}
                                        </div>
                                        ${opt}
                                    </button>
                                `;
        })}
                        </div>
                    `}

                    ${q.type === 'essay' && html`
                        <div className="max-w-3xl mx-auto">
                            <textarea 
                                disabled=${isFeedbackRevealed}
                                className=${`w-full p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/80 border-4 border-gray-200 dark:border-gray-700 focus:border-brand-DEFAULT focus:bg-white dark:focus:bg-black outline-none min-h-[250px] text-lg transition-all shadow-inner resize-y ${isFeedbackRevealed ? 'opacity-70 font-bold' : ''}`}
                                placeholder=${lang === 'ar' ? 'اكتب إجابتك بتفصيل هنا...' : 'Type your detailed answer here...'}
                                value=${answers[q.id] || ''}
                                onChange=${(e) => !isFeedbackRevealed && setAnswers({ ...answers, [q.id]: e.target.value })}
                            />
                        </div>
                    `}

                    ${(isFeedbackRevealed && quiz.feedbackMode === 'immediate') && html`
                        <div className="mt-10 p-6 rounded-2xl bg-white dark:bg-gray-900 border-2 border-brand-DEFAULT/40 shadow-xl animate-fade-in relative overflow-hidden">
                            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-brand-DEFAULT to-transparent"></div>
                            <h4 className="font-black text-2xl mb-4">نتيجتك في هذا السؤال:</h4>
                            
                            ${q.type !== 'essay' && html`
                                <p className="flex items-start gap-2 mb-4" dangerouslySetInnerHTML=${{ __html: `<span class='font-bold opacity-70 min-w-[120px]'>النموذجية:</span> <strong class="text-green-600 dark:text-green-400 font-bold text-xl">${(q.type === 'mcq' ? (q.options || q.optionsAr)[q.correctAnswers[0]] : (q.correctAnswers || []).map(c => (q.options || q.optionsAr)[c]).join(' <span class="text-gray-400">|</span> '))}</strong>` }} />
                            `}
                            ${q.type === 'essay' && html`
                                <p className="font-bold opacity-70 border-b pb-2 mb-2">الإجابة النموذجية المرجعية:</p>
                                <p className="font-bold text-green-600 dark:text-green-400 text-lg mb-4 leading-relaxed">${q.modelAnswer || q.modelAnswerAr}</p>
                            `}

                            ${(q.explanation || q.explanationAr) && html`
                                <div className="mt-4 p-5 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/30 dark:to-gray-900 border border-amber-200 dark:border-amber-700/30 rounded-xl shadow-inner relative">
                                    <div className="absolute -top-3 -right-2 opacity-20 text-6xl">💡</div>
                                    <h5 className="font-black text-amber-600 dark:text-amber-500 mb-2 flex items-center gap-2">💡 تعليل الإجابة:</h5>
                                    <p className="text-lg leading-relaxed font-bold text-gray-800 dark:text-gray-200">${(q.explanation || q.explanationAr)}</p>
                                </div>
                            `}
                        </div>
                    `}

                </div>
            </${Luminova.Components.GlassCard}>

            <div className="flex justify-between items-center bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl shadow-sm backdrop-blur">
                <${Luminova.Components.Button} variant="glass" disabled=${currentIndex === 0} onClick=${() => { setCurrentIndex(i => i - 1); setIsFeedbackRevealed(false); }} className="px-8 py-3 text-lg rounded-full">
                    ${lang === 'ar' ? 'السابق' : 'Previous'}
                </${Luminova.Components.Button}>
                
                ${quiz.feedbackMode === 'immediate' && !isFeedbackRevealed ? html`
                    <${Luminova.Components.Button} disabled=${answers[q.id] === undefined || (Array.isArray(answers[q.id]) && !answers[q.id].length)} onClick=${() => setIsFeedbackRevealed(true)} 
                        className="px-10 py-3 text-lg bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg shadow-blue-500/30 font-black animate-pulse transition-transform hover:scale-105">
                        ✅ تحقق من الإجابة
                    </${Luminova.Components.Button}>
                ` : currentIndex === questions.length - 1 ? html`
                    <${Luminova.Components.Button} onClick=${handleFinish} className="px-10 py-3 text-lg bg-green-500 hover:bg-green-600 rounded-full shadow-lg shadow-green-500/30 font-black animate-pulse">
                        <${Luminova.Icons.CheckCircle} /> ${lang === 'ar' ? 'إنهاء الاختبار ورؤية النتيجة' : 'Finish & View Results'}
                    </${Luminova.Components.Button}>
                ` : html`
                    <${Luminova.Components.Button} onClick=${() => { setCurrentIndex(i => i + 1); setIsFeedbackRevealed(false); }} className="px-10 py-3 text-lg rounded-full shadow-lg shadow-brand-DEFAULT/30 group">
                        ${lang === 'ar' ? 'التالي' : 'Next'} <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
                    </${Luminova.Components.Button}>
                `}
            </div>
        </div>
    `;
    };

    // ==========================================
    // PART 4: Admin CMS Logic (Bespoke Forms, Crash Proof)
    // ==========================================

    Luminova.Pages.AdminCMS = ({ data, setData, lang, goBack }) => {
        const validTabs = ['news', 'years', 'semesters', 'subjects', 'students', 'summaries', 'quizzes'];
        const [activeTab, setActiveTab] = useState('news');
        const [editingItem, setEditingItem] = useState(null);
        const [subView, setSubView] = useState(''); // '' or 'questions'
        const [qItem, setQItem] = useState(null); // Extracted dynamically to fix rules of hooks crash
        const [cmsSearchQuery, setCmsSearchQuery] = useState('');

        const studentsWithFounder = [Luminova.FOUNDER, ...(data.students || []).filter(s => !s.isFounder)];

        const handleExport = () => {
            const dataString = `window.LUMINOVA_DATA = ${JSON.stringify(data, null, 2)};`;
            navigator.clipboard.writeText(dataString).then(() => {
                alert(lang === 'ar' ? 'تم نسخ الكود بنجاح! الصقه في ملف data.js' : 'Code copied! Paste into data.js');
            });
        };

        const handleDelete = (collection, id) => {
            if (collection === 'years' && data.semesters.some(s => s.yearId === id)) return alert(Luminova.i18n[lang].deleteProtected);
            if (collection === 'semesters' && data.subjects.some(s => s.semesterId === id)) return alert(Luminova.i18n[lang].deleteProtected);
            if (collection === 'subjects' && (data.summaries.some(s => s.subjectId === id) || data.quizzes.some(q => q.subjectId === id))) return alert(Luminova.i18n[lang].deleteProtected);
            if (collection === 'students' && (data.summaries.some(s => s.studentId === id) || data.quizzes.some(q => (q.questions || []).some(qn => qn.studentId === id)))) return alert(Luminova.i18n[lang].deleteProtected);

            if (confirm(lang === 'ar' ? 'تأكيد الحذف؟' : 'Confirm deletion?')) {
                setData(prev => ({ ...prev, [collection]: prev[collection].filter(item => item.id !== id) }));
            }
        };

        const handleSave = () => {
            if (!editingItem) return;
            editingItem.timestamp = editingItem.timestamp || new Date().toISOString();
            setData(prev => {
                const isExisting = prev[activeTab].find(i => i.id === editingItem.id);
                const newList = isExisting
                    ? prev[activeTab].map(i => i.id === editingItem.id ? editingItem : i)
                    : [editingItem, ...prev[activeTab]];
                return { ...prev, [activeTab]: newList };
            });
            setEditingItem(null);
        };

        const handleSubSave = (newQ) => {
            const updatedQ = newQ.id ? editingItem.questions.map(q => q.id === newQ.id ? newQ : q) : [...(editingItem.questions || []), { ...newQ, id: `q_${Date.now()}` }];
            const updatedQuiz = { ...editingItem, questions: updatedQ };
            setEditingItem(updatedQuiz);
            setSubView('questionsList');

            // Auto-save question changes to DB instantly
            setData(prev => {
                const newList = prev[activeTab].map(i => i.id === updatedQuiz.id ? updatedQuiz : i);
                return { ...prev, [activeTab]: newList };
            });
        };

        const getNewTemplate = () => {
            const base = { id: `${activeTab}_${Date.now()}`, timestamp: new Date().toISOString() };
            if (activeTab === 'news') return { ...base, titleAr: '', titleEn: '', contentAr: '', contentEn: '', mediaUrl: '' };
            if (activeTab === 'students') return { ...base, nameAr: 'عبد المنعم حجاج', nameEn: 'Abdelmonem Hagag', majorAr: '', majorEn: '', bioAr: '', bioEn: '', image: '', isVIP: false, isVerified: false, socialLinks: { facebook: '', instagram: '', linkedin: '' } };
            if (activeTab === 'years' || activeTab === 'semesters' || activeTab === 'subjects') return { ...base, nameAr: '', nameEn: '', yearId: '', semesterId: '' };
            if (activeTab === 'summaries') return { ...base, titleAr: '', titleEn: '', contentAr: '', contentEn: '', mediaUrl: '', subjectId: '', studentId: '' };
            if (activeTab === 'quizzes') return { ...base, titleAr: '', titleEn: '', isShuffled: false, feedbackMode: 'end', subjectId: '', publisherId: '', questions: [] };
            return base;
        };

        // Using global Inputs inside AdminCMS to prevent transient React rendering issues Focus Drop.

        // ---------------- QUESTIONS SUB-VIEW BUILDER ----------------
        if (subView === 'questionsList' || subView === 'editQuestion') {

            if (subView === 'editQuestion') {
                const tempQ = qItem || { type: 'mcq', text: '', score: 1, options: ['', '', '', ''], correctAnswers: [0], modelAnswer: '', explanation: '', studentId: Luminova.FOUNDER.id, showExp: false };
                return html`
                <div className="animate-fade-in pb-20 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b">
                        <h2 className="text-3xl font-bold text-brand-DEFAULT">${tempQ.id ? 'تعديل سؤال (Edit)' : 'سؤال جديد (New)'}</h2>
                        <${Luminova.Components.Button} onClick=${() => setSubView('questionsList')}>${Luminova.i18n[lang].cancel}</${Luminova.Components.Button}>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-4">
                             <div className="grid grid-cols-3 gap-4">
                                 <div className="col-span-1">
                                     <label className="block text-sm font-black mb-2 opacity-80">نوع السؤال (Type)</label>
                                     <select value=${tempQ.type || 'mcq'} onChange=${e => setQItem({ ...tempQ, type: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 font-bold outline-none">
                                         <option value="mcq">اختيار من متعدد (إجابة واحدة)</option>
                                         <option value="multi_select">اختيار من متعدد (عدة إجابات)</option>
                                         <option value="essay">مقال / تعليل</option>
                                     </select>
                                 </div>
                                 <div className="col-span-1">
                                     <label className="block text-sm font-black mb-2 opacity-80">درجة السؤال (Score)</label>
                                     <input type="number" value=${tempQ.score || 1} onChange=${e => setQItem({ ...tempQ, score: Number(e.target.value) })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 font-bold outline-none text-center" />
                                 </div>
                                 <div className="col-span-1">
                                    <label className="block text-sm font-black mb-2 opacity-80">المساهم (Author)</label>
                                    <select value=${tempQ.studentId || ''} onChange=${(e) => setQItem({ ...tempQ, studentId: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 font-bold z-50 outline-none">
                                        <option value="">-- بدون مساهم --</option>
                                        ${studentsWithFounder.map(s => html`<option key=${s.id} value=${s.id}>${s.nameAr || s.name}</option>`)}
                                    </select>
                                 </div>
                             </div>
                        </div>
                        
                        <div className="col-span-2 pt-6">
                            <label className="block text-sm font-bold mb-2">السؤال (Question Text)</label>
                            <textarea value=${tempQ.text || tempQ.textAr || ''} onChange=${e => setQItem({ ...tempQ, text: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 outline-none text-lg resize-y min-h-[120px]" placeholder="اكتب نص السؤال هنا..." />
                        </div>
                        <div className="col-span-2 bg-brand-DEFAULT/5 p-4 rounded-xl border-2 border-brand-DEFAULT/20 w-full mt-2">
                            <label className="block text-sm font-black text-brand-DEFAULT mb-2">إرفاق وسائط توضيحية للسؤال (اختياري)</label>
                            <${Luminova.Components.Input} label="رابط الوسائط المباشر (Drive, Image, YouTube URL)" val=${tempQ.mediaUrl} onChange=${v => setQItem({ ...tempQ, mediaUrl: v })} />
                            <${Luminova.Components.FileInput} label="أو رفع صورة توضيحية من الجهاز (سيتم تخزينها Base64)" accept="image/*" onFileLoaded=${dta => setQItem({ ...tempQ, mediaUrl: dta })} />
                        </div>

                        ${tempQ.type !== 'essay' ? html`
                            <div className="col-span-2 space-y-3 pt-6">
                                <label className="block text-sm font-bold mb-2 flex justify-between items-center">
                                    <span>خيارات الإجابة (Options)</span>
                                    <button onClick=${() => setQItem({ ...tempQ, options: [...(tempQ.options || []), ''] })} className="px-3 py-1 bg-brand-DEFAULT text-white text-xs rounded-full font-bold shadow-md hover:scale-105">+ إضافة خيار</button>
                                </label>
                                ${(tempQ.options || ['']).map((opt, idx) => html`
                                    <div key=${idx} className="flex items-center gap-3 bg-white dark:bg-gray-900 border-2 dark:border-gray-800 p-2 rounded-xl focus-within:border-brand-DEFAULT/50 transition-colors">
                                        <div className="pl-2 flex items-center justify-center cursor-pointer" title="تحديد كإجابة صحيحة">
                                            <input type=${tempQ.type === 'mcq' ? 'radio' : 'checkbox'} name="correct" checked=${tempQ.correctAnswers?.includes(idx)} 
                                                onChange=${(e) => {
                        if (tempQ.type === 'mcq') setQItem({ ...tempQ, correctAnswers: [idx] });
                        else {
                            const cur = tempQ.correctAnswers || [];
                            setQItem({ ...tempQ, correctAnswers: e.target.checked ? [...cur, idx] : cur.filter(x => x !== idx) });
                        }
                    }} 
                                                className="w-6 h-6 accent-brand-DEFAULT cursor-pointer" 
                                            />
                                        </div>
                                        <input type="text" value=${opt || ''} 
                                            onChange=${e => { const newOps = [...tempQ.options]; newOps[idx] = e.target.value; setQItem({ ...tempQ, options: newOps }) }} 
                                            className="flex-1 bg-transparent p-2 outline-none font-semibold text-lg" 
                                            placeholder=${`الخيار ${idx + 1}`} 
                                        />
                                        <button onClick=${() => { const newOps = tempQ.options.filter((_, i) => i !== idx); setQItem({ ...tempQ, options: newOps, correctAnswers: [0] }); }} className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg opacity-50 hover:opacity-100 transition-all"><${Luminova.Icons.Trash}/></button>
                                    </div>
                                `)}
                            </div>
                        ` : html`
                            <div className="col-span-2 pt-6">
                                <label className="block text-sm font-bold mb-2">الإجابة النموذجية (Model Answer)</label>
                                <textarea value=${tempQ.modelAnswer || tempQ.modelAnswerAr || ''} onChange=${e => setQItem({ ...tempQ, modelAnswer: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 outline-none min-h-[100px]" placeholder="اكتب الإجابة النموذجية للسؤال المقالي..." />
                            </div>
                        `}

                        <div className="col-span-2 pt-6">
                            <button onClick=${() => setQItem({ ...tempQ, showExp: !tempQ.showExp })} className="text-brand-DEFAULT font-bold bg-brand-DEFAULT/10 px-4 py-2 rounded-xl flex items-center gap-2 w-max">
                                💡 ${tempQ.showExp || tempQ.explanation || tempQ.explanationAr ? 'إخفاء التعليل' : 'إضافة تعليل للإجابة (Explanation)'}
                            </button>
                            ${(tempQ.showExp || tempQ.explanation || tempQ.explanationAr) && html`
                                <textarea value=${tempQ.explanation || tempQ.explanationAr || ''} onChange=${e => setQItem({ ...tempQ, explanation: e.target.value })} className="w-full p-4 mt-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 outline-none min-h-[100px] text-brand-gold" placeholder="اكتب شرحاً أو تعليلاً لسبب الإجابة الصحيحة..." />
                            `}
                        </div>

                        <div className="col-span-2 mt-8 flex gap-4 border-t pt-4">
                            <${Luminova.Components.Button} onClick=${() => handleSubSave(tempQ)} className="w-full text-xl py-3 shadow-[0_5px_30px_-10px_rgba(6,182,212,0.8)]">${Luminova.i18n[lang].save} Question</${Luminova.Components.Button}>
                        </div>
                    </div>
                </div>
            `;
            } // End Edit Question

            return html`
            <div className="animate-fade-in pb-20">
                <div className="flex items-center justify-between mb-8 pb-4 border-b">
                    <div>
                        <h2 className="text-3xl font-black text-brand-gold">Quiz Questions Matrix</h2>
                        <h3 className="text-xl font-bold opacity-70 mt-2">${editingItem.title || editingItem.titleAr || ''}</h3>
                    </div>
                    <div className="flex gap-3">
                        <${Luminova.Components.Button} onClick=${() => { setSubView(''); setEditingItem(null); }} variant="glass">العودة لقائمة الاختبارات</${Luminova.Components.Button}>
                        <${Luminova.Components.Button} onClick=${() => setSubView('')}>رجوع لصفحة الإعدادات</${Luminova.Components.Button}>
                    </div>
                </div>
                
                <div className="mb-6"><${Luminova.Components.Button} onClick=${() => { setQItem(null); setSubView('editQuestion'); }} className="bg-green-500 hover:bg-green-600 shadow-xl shadow-green-500/20 text-xl py-3 px-8">+ Add Question</${Luminova.Components.Button}></div>
                
                <div className="space-y-4">
                    ${(editingItem.questions || []).map((q, idx) => html`
                        <${Luminova.Components.GlassCard} key=${q.id} className="flex justify-between items-center border-l-4 border-brand-DEFAULT">
                            <div>
                                <span className="font-bold mr-4 text-brand-DEFAULT">Q${idx + 1}.</span>
                                <span className="text-lg font-bold">${q.textAr || q.textEn || 'Draft Question'}</span>
                                <div className="text-xs opacity-50 mt-1">${q.type} - Score: ${q.score}</div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick=${() => { setQItem(q); setSubView('editQuestion'); }} className="p-3 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"><${Luminova.Icons.Edit} /></button>
                                <button onClick=${() => {
                    if (confirm('Delete Question?')) {
                        const updatedQ = editingItem.questions.filter(x => x.id !== q.id);
                        const updatedQuiz = { ...editingItem, questions: updatedQ };
                        setEditingItem(updatedQuiz);
                        setData(prev => ({ ...prev, [activeTab]: prev[activeTab].map(i => i.id === updatedQuiz.id ? updatedQuiz : i) }));
                    }
                }} className="p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><${Luminova.Icons.Trash} /></button>
                            </div>
                        </${Luminova.Components.GlassCard}>
                    `)}
                    ${(!editingItem.questions || editingItem.questions.length === 0) && html`
                        <div className="p-10 border-2 border-dashed rounded-2xl text-center font-bold opacity-50">لا يوجد أسئلة.. أضف سؤالاً للاختبار.</div>
                    `}
                </div>
            </div>
        `;
        }

        // Filter logic including Real-Time Search
        let activeTableItems = data[activeTab] ? data[activeTab].filter(item => activeTab !== 'students' || !item.isFounder) : [];
        if (cmsSearchQuery.trim() !== '') {
            const query = cmsSearchQuery.toLowerCase();
            activeTableItems = activeTableItems.filter(item =>
                (item.nameAr || item.titleAr || item.title || item.name || '').toLowerCase().includes(query) ||
                (item.nameEn || item.titleEn || item.title || '').toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query)
            );
        }

        return html`
        <div className="animate-fade-in pb-20 max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center mb-10 border-b-4 border-brand-DEFAULT pb-6 sticky top-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl z-30 pt-4 rounded-b-3xl px-8 shadow-sm">
                <h2 className="text-4xl font-black flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-hover to-brand-gold">⚙️ CMS Control Center</h2>
                <div className="flex gap-4">
                    <${Luminova.Components.Button} onClick=${handleExport} className="bg-brand-gold text-black shadow-lg hover:bg-yellow-500 text-lg px-8"><span className="animate-pulse">💾</span> ${Luminova.i18n[lang].exportData}</${Luminova.Components.Button}>
                    <${Luminova.Components.Button} variant="danger" onClick=${goBack} className="text-lg px-8">${Luminova.i18n[lang].logout}</${Luminova.Components.Button}>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                <div className="w-full xl:w-1/4">
                    <${Luminova.Components.GlassCard} className="p-4 space-y-3 sticky top-40 shadow-xl border-none">
                        ${validTabs.map(key => html`
                            <button key=${key} onClick=${() => { setActiveTab(key); setEditingItem(null); setSubView(''); }}
                                className=${`w-full text-start px-6 py-4 rounded-xl font-bold text-lg transition-all flex justify-between items-center ${activeTab === key ? 'bg-gradient-to-r from-brand-DEFAULT/90 to-brand-hover text-white shadow-xl scale-105' : 'bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-[1.02]'}`}>
                                <span>${Luminova.i18n[lang][key] || key.toUpperCase()}</span>
                                <span className=${`text-sm font-black px-2 py-1 rounded-lg ${activeTab === key ? 'bg-white/20' : 'bg-black/5 dark:bg-white/5'}`}>
                                    ${key === 'students' ? (data.students?.filter(s => !s.isFounder).length || 0) : (data[key]?.length || 0)}
                                </span>
                            </button>
                        `)}
                    </${Luminova.Components.GlassCard}>
                </div>

                <div className="w-full xl:w-3/4">
                    <${Luminova.Components.GlassCard} className="border-none shadow-2xl bg-white/40 dark:bg-black/20 backdrop-blur-3xl min-h-[70vh]">
                        <div className="flex justify-between items-center mb-8 border-b dark:border-gray-700 pb-6 pr-4 pl-4 gap-6">
                            <h3 className="text-4xl font-black text-brand-DEFAULT shrink-0">${Luminova.i18n[lang][activeTab] || activeTab}</h3>
                            ${!editingItem && html`
                                <div className="flex-1 max-w-lg">
                                    <input type="text" placeholder=${lang === 'ar' ? 'البحث السريع والفوري في القائمة...' : 'Quick Real-time Search...'} value=${cmsSearchQuery} onChange=${e => setCmsSearchQuery(e.target.value)} className="w-full p-4 rounded-full bg-white dark:bg-gray-800 border-2 dark:border-gray-700 focus:border-brand-DEFAULT outline-none shadow-sm font-bold placeholder:opacity-50" />
                                </div>
                                <${Luminova.Components.Button} onClick=${() => setEditingItem(getNewTemplate())} className="text-xl px-10 py-4 rounded-full shadow-lg shadow-brand-DEFAULT/30 hover:shadow-brand-DEFAULT/50 transition-all font-black shrink-0">
                                    ${lang === 'ar' ? '+ إضافة جديد' : '+ Add New Entity'}
                                </${Luminova.Components.Button}>
                            `}
                        </div>

                        ${editingItem ? html`
                            <div className="bg-white/70 dark:bg-gray-900/70 p-8 rounded-3xl border-2 border-brand-DEFAULT/20 shadow-inner">
                                <div className="flex justify-between items-center mb-8 border-b dark:border-gray-700 pb-4">
                                    <h4 className="text-2xl font-black text-brand-gold">${editingItem.id.includes(activeTab) ? (lang === 'ar' ? 'إنشاء سجل جديد' : 'Create New Record') : (lang === 'ar' ? 'تعديل السجل' : 'Edit Record')}</h4>
                                    ${activeTab === 'quizzes' && html`
                                        <${Luminova.Components.Button} onClick=${() => setSubView('questionsList')} className="bg-blue-600 hover:bg-blue-700 text-lg px-8 relative overflow-hidden group">
                                            <span className="relative z-10 w-full flex items-center gap-2">📝 Manage Questions Matrix <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">${(editingItem.questions || []).length}</span></span>
                                        </${Luminova.Components.Button}>
                                    `}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                    ${(activeTab === 'semesters' || activeTab === 'subjects' || activeTab === 'summaries' || activeTab === 'quizzes') && html`
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-sm font-black mb-2 opacity-80 text-brand-DEFAULT drop-shadow-sm">الفرقة (Year Hierarchy)</label>
                                            <select value=${editingItem.yearId || ''} onChange=${e => setEditingItem({ ...editingItem, yearId: e.target.value, semesterId: '', subjectId: '' })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-brand-DEFAULT/30 font-bold outline-none ring-0">
                                                <option value="">-- اختار الفرقة --</option>
                                                ${data.years.map(y => html`<option key=${y.id} value=${y.id}>${y.nameAr || y.name}</option>`)}
                                            </select>
                                        </div>
                                    `}
                                    ${(activeTab === 'subjects' || activeTab === 'summaries' || activeTab === 'quizzes') && html`
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-sm font-black mb-2 opacity-80 text-brand-DEFAULT drop-shadow-sm">الترم (Semester Hierarchy)</label>
                                            <select value=${editingItem.semesterId || ''} onChange=${e => setEditingItem({ ...editingItem, semesterId: e.target.value, subjectId: '' })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-brand-DEFAULT/30 font-bold outline-none ring-0">
                                                <option value="">-- اختار الترم --</option>
                                                ${data.semesters.filter(s => !editingItem.yearId || s.yearId === editingItem.yearId).map(s => html`<option key=${s.id} value=${s.id}>${s.nameAr || s.name}</option>`)}
                                            </select>
                                        </div>
                                    `}
                                    ${(activeTab === 'summaries' || activeTab === 'quizzes') && html`
                                        <div className="col-span-2">
                                            <label className="block text-sm font-black mb-2 opacity-80 text-brand-hover drop-shadow-sm">المادة (Subject Link)</label>
                                            <select value=${editingItem.subjectId || ''} onChange=${e => setEditingItem({ ...editingItem, subjectId: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-brand-hover/50 font-bold outline-none ring-0">
                                                <option value="">-- اختار المادة --</option>
                                                ${data.subjects.filter(s => {
                                                    if (editingItem.semesterId) return s.semesterId === editingItem.semesterId;
                                                    if (editingItem.yearId) {
                                                        const validSems = data.semesters.filter(sem => sem.yearId === editingItem.yearId).map(sem => sem.id);
                                                        return validSems.includes(s.semesterId);
                                                    }
                                                    return true;
                                                }).map(s => html`<option key=${s.id} value=${s.id}>${s.nameAr || s.name}</option>`)}
                                            </select>
                                        </div>
                                    `}
                                    ${(activeTab === 'summaries') && html`
                                        <div className="col-span-2">
                                            <label className="block text-sm font-black mb-2 opacity-80 text-brand-gold drop-shadow-sm">الطالب المساهم (Author)</label>
                                            <select value=${editingItem.studentId || ''} onChange=${e => setEditingItem({ ...editingItem, studentId: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-brand-gold/50 font-bold outline-none ring-0">
                                                <option value="">-- اختار الطالب --</option>
                                                ${studentsWithFounder.map(s => html`<option key=${s.id} value=${s.id}>${s.nameAr || s.name}</option>`)}
                                            </select>
                                        </div>
                                    `}

                                    ${activeTab === 'students' ? html`
                                        <div className="col-span-2 flex flex-col md:flex-row gap-4"><div className="w-full"><${Luminova.Components.Input} label="الاسم العربي" val=${editingItem.nameAr} onChange=${v => setEditingItem({ ...editingItem, nameAr: v })} /></div> <div className="w-full"><${Luminova.Components.Input} label="English Name" val=${editingItem.nameEn} onChange=${v => setEditingItem({ ...editingItem, nameEn: v })} /></div></div>
                                        <div className="col-span-2 flex flex-col md:flex-row gap-4"><div className="w-full"><${Luminova.Components.Input} label="التخصص العربي" val=${editingItem.majorAr} onChange=${v => setEditingItem({ ...editingItem, majorAr: v })} /></div> <div className="w-full"><${Luminova.Components.Input} label="English Major" val=${editingItem.majorEn} onChange=${v => setEditingItem({ ...editingItem, majorEn: v })} /></div></div>
                                        <div className="col-span-2 w-full"><${Luminova.Components.Input} type="textarea" label="نبذة عربية" val=${editingItem.bioAr} onChange=${v => setEditingItem({ ...editingItem, bioAr: v })} /></div>
                                        <div className="col-span-2 w-full"><${Luminova.Components.Input} type="textarea" label="English Bio" val=${editingItem.bioEn} onChange=${v => setEditingItem({ ...editingItem, bioEn: v })} /></div>
                                        <div className="col-span-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border border-blue-500/20">
                                            <${Luminova.Components.Input} label="Link Image (رابط الصورة المباشر)" val=${editingItem.image} onChange=${v => setEditingItem({ ...editingItem, image: v })} />
                                            <${Luminova.Components.FileInput} label="Or Upload Image (رفع صورة من الجهاز وحفظها Base64)" accept="image/*" onFileLoaded=${dta => setEditingItem({ ...editingItem, image: dta })} />
                                        </div>
                                        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <${Luminova.Components.SocialInput} label="Facebook Link" val=${editingItem.socialLinks?.facebook} onChange=${v => setEditingItem({ ...editingItem, socialLinks: { ...(editingItem.socialLinks || {}), facebook: v } })} /> 
                                            <${Luminova.Components.SocialInput} label="Instagram Link" val=${editingItem.socialLinks?.instagram} onChange=${v => setEditingItem({ ...editingItem, socialLinks: { ...(editingItem.socialLinks || {}), instagram: v } })} /> 
                                            <${Luminova.Components.SocialInput} label="LinkedIn Link" val=${editingItem.socialLinks?.linkedin} onChange=${v => setEditingItem({ ...editingItem, socialLinks: { ...(editingItem.socialLinks || {}), linkedin: v } })} />
                                        </div>
                                        <div className="col-span-2 flex gap-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <${Luminova.Components.Input} type="checkbox" label="⭐ VIP Member (مميز الإطار الخارجي)" val=${editingItem.isVIP} onChange=${v => { setEditingItem({ ...editingItem, isVIP: v }) }} />
                                            <${Luminova.Components.Input} type="checkbox" label="🔵✔️ Verified (شارة توثيق زرقاء)" val=${editingItem.isVerified} onChange=${v => { setEditingItem({ ...editingItem, isVerified: v }) }} />
                                        </div>
                                    ` : activeTab === 'news' ? html`
                                        <div className="col-span-2">
                                            <label className="block text-sm font-black mb-2 opacity-80 text-brand-DEFAULT drop-shadow-sm">الناشر (Author)</label>
                                            <select value=${editingItem.studentId || ''} onChange=${e => setEditingItem({ ...editingItem, studentId: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-brand-DEFAULT/50 font-bold outline-none ring-0">
                                                <option value="">-- اختار الناشر --</option>
                                                ${studentsWithFounder.map(s => html`<option key=${s.id} value=${s.id}>${s.nameAr || s.name}</option>`)}
                                            </select>
                                        </div>
                                        <div className="col-span-2 w-full"><${Luminova.Components.Input} label="عنوان الخبر" val=${editingItem.titleAr} onChange=${v => setEditingItem({ ...editingItem, titleAr: v })} /></div>
                                        <div className="col-span-2 w-full"><${Luminova.Components.Input} label="News Title" val=${editingItem.titleEn} onChange=${v => setEditingItem({ ...editingItem, titleEn: v })} /></div>
                                        <div className="col-span-2 w-full"><${Luminova.Components.Input} type="textarea" label="التفاصيل (عربي)" val=${editingItem.contentAr} onChange=${v => setEditingItem({ ...editingItem, contentAr: v })} /></div>
                                        <div className="col-span-2 w-full"><${Luminova.Components.Input} type="textarea" label="Details (English)" val=${editingItem.contentEn} onChange=${v => setEditingItem({ ...editingItem, contentEn: v })} /></div>
                                        <div className="col-span-2 bg-purple-500/5 p-4 rounded-xl border border-purple-500/20 w-full">
                                            <${Luminova.Components.Input} label="Media Embed URL (YouTube, Drive, Image...)" val=${editingItem.mediaUrl} onChange=${v => setEditingItem({ ...editingItem, mediaUrl: v })} />
                                            <${Luminova.Components.FileInput} label="Or Upload Image / Video (رفع ميديا من الجهاز وحفظها Base64)" accept="*/*" onFileLoaded=${dta => setEditingItem({ ...editingItem, mediaUrl: dta })} />
                                        </div>
                                    ` : activeTab === 'summaries' ? html`
                                        <div className="col-span-2 w-full"><${Luminova.Components.Input} label="عنوان التلخيص" val=${editingItem.titleAr} onChange=${v => setEditingItem({ ...editingItem, titleAr: v })} /></div>
                                        <div className="col-span-2 w-full"><${Luminova.Components.Input} label="Summary Title" val=${editingItem.titleEn} onChange=${v => setEditingItem({ ...editingItem, titleEn: v })} /></div>
                                        <div className="col-span-2 w-full"><${Luminova.Components.Input} type="textarea" label="نبذة محتوى (عربي)" val=${editingItem.contentAr} onChange=${v => setEditingItem({ ...editingItem, contentAr: v })} /></div>
                                        <div className="col-span-2 w-full"><${Luminova.Components.Input} type="textarea" label="Summary Content (English)" val=${editingItem.contentEn} onChange=${v => setEditingItem({ ...editingItem, contentEn: v })} /></div>
                                        <div className="col-span-2 bg-purple-500/5 p-4 rounded-xl border border-purple-500/20 w-full">
                                            <${Luminova.Components.Input} label="Media Embed URL (Drive PDF, Drive HTML, Image...)" val=${editingItem.mediaUrl} onChange=${v => setEditingItem({ ...editingItem, mediaUrl: v })} />
                                            <${Luminova.Components.FileInput} label="Or Upload Direct Document (رفع ملف PDF أو HTML كـ Base64)" accept=".pdf,.html" onFileLoaded=${dta => setEditingItem({ ...editingItem, mediaUrl: dta })} />
                                        </div>
                                    ` : activeTab === 'quizzes' ? html`
                                        <div className="col-span-2">
                                            <label className="block text-sm font-black mb-2 opacity-80 text-brand-DEFAULT drop-shadow-sm">ناشر الاختبار (Quiz Publisher - للعرض فقط بلا مساهمات)</label>
                                            <select value=${editingItem.publisherId || ''} onChange=${e => setEditingItem({ ...editingItem, publisherId: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-brand-DEFAULT/50 font-bold outline-none ring-0">
                                                <option value="">-- اختار الناشر ليعرض على غلاف الاختبار --</option>
                                                ${studentsWithFounder.map(s => html`<option key=${s.id} value=${s.id}>${s.nameAr || s.name}</option>`)}
                                            </select>
                                        </div>
                                        <div className="col-span-2 w-full flex flex-col md:flex-row gap-4">
                                            <div className="w-full"><${Luminova.Components.Input} label="عنوان الاختبار التفاعلي (عربي)" val=${editingItem.titleAr || editingItem.title || ''} onChange=${v => setEditingItem({ ...editingItem, titleAr: v })} /></div>
                                            <div className="w-full"><${Luminova.Components.Input} label="Interactive Quiz Title (English)" val=${editingItem.titleEn || editingItem.title || ''} onChange=${v => setEditingItem({ ...editingItem, titleEn: v })} /></div>
                                        </div>
                                        <div className="col-span-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white/50 dark:bg-gray-800/50">
                                            <${Luminova.Components.Input} type="checkbox" label="ترتيب عشوائي للأسئلة (Shuffle)" val=${editingItem.isShuffled || false} onChange=${v => setEditingItem({ ...editingItem, isShuffled: v })} />
                                            <p className="text-xs opacity-60 mt-1">يظهر الترتيب بشكل مختلف لكل طالب لزيادة المصداقية.</p>
                                        </div>
                                        <div className="col-span-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white/50 dark:bg-gray-800/50">
                                            <label className="block text-sm font-black mb-2 opacity-80">توقيت ظهور التعليل (Feedback Mode)</label>
                                            <select value=${editingItem.feedbackMode || 'end'} onChange=${e => setEditingItem({ ...editingItem, feedbackMode: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-600 font-bold outline-none shadow-sm">
                                                <option value="end">النتيجة مع التعليل في نهاية الاختبار (At the End)</option>
                                                <option value="immediate">تجميد فور إجابة كل سؤال وإظهار التعليل (Immediate)</option>
                                            </select>
                                        </div>
                                    ` : html`
                                        <div className="w-full"><${Luminova.Components.Input} label="الاسم العربي" val=${editingItem.nameAr} onChange=${v => setEditingItem({ ...editingItem, nameAr: v })} /></div> <div className="w-full"><${Luminova.Components.Input} label="English Name" val=${editingItem.nameEn} onChange=${v => setEditingItem({ ...editingItem, nameEn: v })} /></div>
                                    `}
                                </div>

                                <div className="mt-10 border-t-4 border-gray-200 dark:border-gray-800 pt-6 flex gap-6">
                                    <${Luminova.Components.Button} onClick=${handleSave} className="flex-1 text-xl py-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(6,182,212,0.8)]">${Luminova.i18n[lang].save} Entity To Database</${Luminova.Components.Button}>
                                    <${Luminova.Components.Button} variant="glass" onClick=${() => setEditingItem(null)} className="w-[30%] text-xl py-4 rounded-2xl">${Luminova.i18n[lang].cancel}</${Luminova.Components.Button}>
                                </div>
                            </div>
                        ` : html`
                            <div className="overflow-x-auto p-4">
                                <table className="w-full text-start border-collapse">
                                    <thead>
                                        <tr className="border-b-2 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 uppercase text-xs tracking-wider opacity-70">
                                            <th className="p-4 text-start font-black rounded-tl-xl w-[150px]">ID KEY</th>
                                            <th className="p-4 text-start font-black">ENTITY TITLE / NAME</th>
                                            <th className="p-4 text-start font-black">CREATED ON</th>
                                            <th className="p-4 text-end font-black rounded-tr-xl">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${activeTableItems.map(item => html`
                                            <tr key=${item.id} className="border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                                <td className="p-4 text-xs font-mono opacity-40 group-hover:opacity-100 transition-opacity">${item.id}</td>
                                                <td className="p-4 font-bold text-lg">
                                                    ${activeTab === 'semesters' && item.yearId ? (() => {
                                                        const parentYear = data.years.find(y => y.id === item.yearId);
                                                        return html`
                                                            <span className="text-xs font-bold text-brand-DEFAULT/60 block mb-1 tracking-wide">${parentYear ? (parentYear.nameAr || parentYear.nameEn) : item.yearId}</span>
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="text-brand-DEFAULT/40 text-base">»</span>
                                                                <span>${item.nameAr || item.name || item.nameEn || 'N/A'}</span>
                                                                ${(item.nameEn || item.name) ? html`<span className="text-gray-400 font-normal text-sm mx-1">-</span><span className="opacity-60 text-sm font-normal">${item.nameEn || ''}</span>` : null}
                                                            </span>
                                                        `;
                                                    })() : activeTab === 'subjects' && item.semesterId ? (() => {
                                                        const parentSem = data.semesters.find(s => s.id === item.semesterId);
                                                        const parentYear = parentSem ? data.years.find(y => y.id === parentSem.yearId) : null;
                                                        return html`
                                                            <span className="text-xs font-bold text-brand-DEFAULT/60 block mb-1 tracking-wide">
                                                                ${parentYear ? (parentYear.nameAr || parentYear.nameEn) : ''}
                                                                ${parentYear && parentSem ? html`<span className="opacity-50 mx-1">»</span>` : null}
                                                                ${parentSem ? (parentSem.nameAr || parentSem.nameEn) : ''}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="text-brand-DEFAULT/40 text-base">»</span>
                                                                <span>${item.nameAr || item.name || item.nameEn || 'N/A'}</span>
                                                                ${(item.nameEn || item.name) ? html`<span className="text-gray-400 font-normal text-sm mx-1">-</span><span className="opacity-60 text-sm font-normal">${item.nameEn || ''}</span>` : null}
                                                            </span>
                                                        `;
                                                    })() : html`
                                                        <span>${item.titleAr || item.nameAr || item.name || item.titleEn || item.nameEn || item.title || 'N/A'}</span>
                                                        <span className="text-gray-400 font-normal mx-2">-</span>
                                                        <span className="opacity-70 text-sm font-normal">${item.titleEn || item.nameEn || item.title || ''}</span>
                                                        ${item.isVIP && html`<span className="ml-2 text-brand-DEFAULT" title="VIP">✨</span>`}
                                                        ${item.isVerified && html`<span className="ml-2" title="Verified">🔵✔️</span>`}
                                                    `}
                                                </td>
                                                <td className="p-4 text-sm opacity-60 font-semibold tracking-wider">${Luminova.formatDate(item.timestamp, lang)}</td>
                                                <td className="p-4 flex justify-end gap-3">
                                                    ${activeTab === 'quizzes' && html`
                                                        <button onClick=${() => { setEditingItem({ ...item }); setSubView('questionsList'); }} className="px-4 py-2 bg-brand-DEFAULT/10 text-brand-DEFAULT rounded-lg hover:bg-brand-DEFAULT hover:text-white transition-colors shadow-sm whitespace-nowrap font-bold flex gap-2 items-center md:mr-4 border border-brand-DEFAULT/30 group">
                                                            📝 ${lang === 'ar' ? 'إدارة الأسئلة' : 'Manage Questions'}
                                                            <span className="bg-white/50 dark:bg-black/20 text-xs px-2 py-0.5 rounded-full group-hover:bg-white/20">${(item.questions || []).length}</span>
                                                        </button>
                                                    `}
                                                    <button onClick=${() => setEditingItem({ ...item })} className="p-3 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors shadow-sm"><${Luminova.Icons.Edit} /></button>
                                                    <button onClick=${() => handleDelete(activeTab, item.id)} className="p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-sm"><${Luminova.Icons.Trash} /></button>
                                                </td>
                                            </tr>
                                        `)}
                                    </tbody>
                                </table>
                                ${activeTableItems.length === 0 && html`
                                    <div className="p-20 text-center font-bold text-2xl opacity-30 border-2 border-dashed rounded-3xl mt-4">${Luminova.i18n[lang].emptyState}</div>
                                `}
                            </div>
                        `}
                    </${Luminova.Components.GlassCard}>
                </div>
            </div>
        </div>
    `;
    };

    // ==========================================
    // PART 5: App Mount & Initialization
    // ==========================================

    const App = () => {
        const fallbackData = window.initialData || window.LUMINOVA_DATA || {};

        // الاعتماد الحصري على data.js كمصدر وحيد وتجاهل التخزين المحلي
        const [data, setData] = useState(() => {
            return fallbackData;
        });

        const [lang, setLang] = useState(data.settings?.language || 'ar');
        const [view, setView] = useState('home');
        const [activeQuiz, setActiveQuiz] = useState(null);
        const [clickCount, setClickCount] = useState(0);

        useEffect(() => {
            const root = document.documentElement;
            if (data.settings?.theme === 'dark') root.classList.add('dark');
            else root.classList.remove('dark');

            root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
            root.setAttribute('lang', lang);
        }, [data.settings?.theme, lang]);

        const handleLogoClick = () => {
            setClickCount(prev => prev + 1);
            setTimeout(() => setClickCount(0), 4000);
        };

        useEffect(() => {
            if (clickCount >= 5) {
                setClickCount(0);
                const pwd = prompt(Luminova.i18n[lang].passwordPrompt);
                if (pwd === 'admin') setView('cms');
                else if (pwd !== null) alert(Luminova.i18n[lang].wrongPassword);
            }
        }, [clickCount]);

        const toggleTheme = () => {
            setData(prev => ({ ...prev, settings: { ...prev.settings, theme: prev.settings.theme === 'dark' ? 'light' : 'dark' } }));
        };

        const toggleLang = () => {
            const newLang = lang === 'ar' ? 'en' : 'ar';
            setLang(newLang);
            setData(prev => ({ ...prev, settings: { ...prev.settings, language: newLang } }));
        };

        const renderView = () => {
            switch (view) {
                case 'home': return html`<${Luminova.Pages.HomePage} data=${data} lang=${lang} setView=${setView} setActiveQuiz=${setActiveQuiz} />`;
                case 'community': return html`<${Luminova.Pages.StudentCommunityPage} data=${data} lang=${lang} />`;
                case 'academics': return html`<${Luminova.Pages.AcademicHierarchyPage} data=${data} lang=${lang} setView=${setView} setActiveQuiz=${setActiveQuiz} />`;
                case 'quiz': return html`<${Luminova.Pages.QuizEngine} quiz=${activeQuiz} data=${data} lang=${lang} goBack=${() => setView('academics')} />`;
                case 'cms': return html`<${Luminova.Pages.AdminCMS} data=${data} setData=${setData} lang=${lang} goBack=${() => setView('home')} />`;
                default: return html`<${Luminova.Pages.HomePage} data=${data} lang=${lang} setView=${setView} setActiveQuiz=${setActiveQuiz} />`;
            }
        };

        return html`
        <div className="min-h-screen pb-20">
            <nav className="glass-card sticky top-0 z-40 px-3 sm:px-8 py-3 sm:py-5 mb-10 flex items-center gap-2 rounded-none border-t-0 border-r-0 border-l-0 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">

                <!-- Logo: always visible, text hidden on very small screens -->
                <div className="flex items-center gap-2 cursor-pointer group flex-shrink-0" onClick=${handleLogoClick}>
                    <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-DEFAULT to-brand-gold rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-lg sm:text-2xl shadow-xl group-hover:scale-110 transition-transform flex-shrink-0">L</div>
                    <span className="text-lg sm:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-DEFAULT to-brand-gold drop-shadow-sm hidden sm:inline">
                        Luminova
                    </span>
                </div>

                <!-- Center nav: icons only on mobile, text on md+ -->
                ${view !== 'cms' && view !== 'quiz' && html`
                    <div className="flex items-center gap-1 sm:gap-2 mx-auto">
                        <button onClick=${() => setView('home')} title=${Luminova.i18n[lang].home}
                            className=${`px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200 flex gap-1 sm:gap-3 items-center font-bold text-base sm:text-lg flex-shrink-0 ${view === 'home' ? 'text-brand-DEFAULT bg-brand-DEFAULT/15 shadow-inner' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                            <${Luminova.Icons.Home} />
                            <span className="hidden md:inline">${Luminova.i18n[lang].home}</span>
                        </button>
                        <button onClick=${() => setView('community')} title=${Luminova.i18n[lang].community}
                            className=${`px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200 flex gap-1 sm:gap-3 items-center font-bold text-base sm:text-lg flex-shrink-0 ${view === 'community' ? 'text-brand-DEFAULT bg-brand-DEFAULT/15 shadow-inner' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                            <${Luminova.Icons.User} />
                            <span className="hidden md:inline">${Luminova.i18n[lang].community}</span>
                        </button>
                        <button onClick=${() => setView('academics')} title=${Luminova.i18n[lang].academic}
                            className=${`px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200 flex gap-1 sm:gap-3 items-center font-bold text-base sm:text-lg flex-shrink-0 ${view === 'academics' ? 'text-brand-DEFAULT bg-brand-DEFAULT/15 shadow-inner' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                            <${Luminova.Icons.Book} />
                            <span className="hidden md:inline">${Luminova.i18n[lang].academic}</span>
                        </button>
                    </div>
                `}

                <!-- Right controls: always visible, always flex row, no wrap -->
                <div style=${{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginInlineStart: 'auto' }}>
                    <!-- Language toggle -->
                    <button onClick=${toggleLang}
                        className="font-black text-sm sm:text-base border-2 border-brand-DEFAULT text-brand-DEFAULT px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-brand-DEFAULT hover:text-white transition-all shadow-sm flex-shrink-0">
                        ${lang === 'ar' ? 'EN' : 'AR'}
                    </button>
                    <!-- Theme toggle: always visible on all screen sizes -->
                    <button onClick=${toggleTheme}
                        className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-lg sm:text-xl shadow-inner flex-shrink-0" title="Toggle Theme">
                        ${data.settings?.theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>
            </nav>

            <main className="container mx-auto px-4 sm:px-10 max-w-[1600px]">
                ${renderView()}
            </main>
        </div>
    `;
    };

    const root = window.ReactDOM.createRoot(document.getElementById('root'));
    root.render(html`<${App} />`);

})();

