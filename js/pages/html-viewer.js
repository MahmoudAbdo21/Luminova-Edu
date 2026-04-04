(function () { "use strict";

    if (!window.__LUMINOVA) return;

    const { useState, useEffect } = window.React;
    const html = window.htm.bind(window.React.createElement);
    const Luminova = window.__LUMINOVA;

    Luminova.Pages.FullscreenViewer = ({ lang = 'ar' }) => {
        const [url, setUrl] = useState(null);

        useEffect(() => {
            const handleEvent = (e) => { if (e.detail) setUrl(e.detail); };
            window.addEventListener('openFullscreen', handleEvent);
            return () => window.removeEventListener('openFullscreen', handleEvent);
        }, []);

        if (!url) return null;

        // Detect local file:// URLs that can't be embedded in iframe
        const isLocal = url.startsWith('file://') ||
            (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('blob:') && !url.startsWith('//'));

        return html`
        <div style=${{ position:'fixed', inset:0, zIndex:99999, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>

            <div style=${{ background:'white', width:'95vw', height:'90vh', borderRadius:'16px', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 25px 60px rgba(0,0,0,0.4)', position:'relative' }}>

                <!-- Header bar -->
                <div style=${{ background:'#0f172a', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', flexShrink:0 }}>
                    <span style=${{ color:'white', fontWeight:'900', opacity:0.9, fontSize:'1rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'60%' }}>
                        ${lang === 'ar' ? 'عارض الملف' : 'File Viewer'}
                    </span>
                    <button
                        onClick=${() => setUrl(null)}
                        style=${{ background:'#ef4444', color:'white', border:'none', padding:'8px 20px', borderRadius:'10px', fontWeight:'900', cursor:'pointer', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'8px', transition:'background 0.2s' }}
                        onMouseEnter=${e => e.target.style.background='#dc2626'}
                        onMouseLeave=${e => e.target.style.background='#ef4444'}
                    >
                        ${lang === 'ar' ? '✖ رجوع' : '✖ Close'}
                    </button>
                </div>

                <!-- Content -->
                ${isLocal ? html`
                    <div style=${{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'24px', background:'linear-gradient(135deg, #f8fafc, #eef2ff)', padding:'32px', textAlign:'center' }}>

                        <div style=${{ fontSize:'80px', lineHeight:1, opacity:0.5 }}>📄</div>

                        <div>
                            <h2 style=${{ fontSize:'1.5rem', fontWeight:'900', color:'#1e293b', marginBottom:'8px' }}>
                                ${lang === 'ar' ? 'عرض الملف المحلي' : 'View Local File'}
                            </h2>
                            <p style=${{ color:'#64748b', fontWeight:'600', maxWidth:'460px', lineHeight:'1.6', fontSize:'0.95rem' }}>
                                ${lang === 'ar'
                                    ? 'لا يمكن للمتصفح تضمين الملفات المحلية مباشرة داخل الصفحة. انقر الزر أدناه لفتح الملف في تبويب جديد — سيتحمل بشكل طبيعي.'
                                    : 'The browser cannot embed local files directly inside the page. Click below to open the file in a new tab — it will load normally.'
                                }
                            </p>
                        </div>

                        <a
                            href=${url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style=${{ background:'linear-gradient(135deg, #06b6d4, #0891b2)', color:'white', padding:'16px 40px', borderRadius:'16px', fontWeight:'900', fontSize:'1.1rem', textDecoration:'none', boxShadow:'0 8px 24px rgba(6,182,212,0.35)', display:'flex', alignItems:'center', gap:'12px', transition:'transform 0.2s, box-shadow 0.2s' }}
                            onMouseEnter=${e => { e.currentTarget.style.transform='scale(1.03)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(6,182,212,0.5)'; }}
                            onMouseLeave=${e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(6,182,212,0.35)'; }}
                        >
                            <span style=${{ fontSize:'1.3rem' }}>↗</span>
                            <span>${lang === 'ar' ? 'فتح الملف في المتصفح' : 'Open File in Browser'}</span>
                        </a>

                        <p style=${{ fontSize:'0.75rem', color:'#94a3b8', fontWeight:'600', maxWidth:'400px' }}>
                            ${lang === 'ar'
                                ? '💡 عند رفع المشروع على GitHub Pages سيُعرض الملف مدمجاً هنا مباشرة دون الحاجة لفتح تبويب جديد'
                                : '💡 When hosted on GitHub Pages, the file will be embedded here directly without needing a new tab'
                            }
                        </p>
                    </div>
                ` : html`
                    <iframe
                        src=${url}
                        style=${{ width:'100%', flex:1, border:'none', background:'white' }}
                        sandbox="allow-scripts allow-popups allow-same-origin allow-forms"
                    ></iframe>
                `}

            </div>
        </div>
        `;
    };

})();
