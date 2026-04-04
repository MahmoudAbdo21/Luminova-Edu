(function () {
    "use strict";

    if (!window.__LUMINOVA || !window.React || !window.ReactDOM) return;

    const { useState, useEffect } = window.React;
    const html = window.htm.bind(window.React.createElement);

    const FullscreenViewerApp = () => {
        const [url, setUrl] = useState(null);
        const [lang, setLang] = useState('ar');
        const [winH, setWinH] = useState(window.innerHeight);
        const [winW, setWinW] = useState(window.innerWidth);

        useEffect(() => {
            // Sync lang
            const syncLang = () => setLang(document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar');
            syncLang();
            const obs = new MutationObserver(syncLang);
            obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

            // Update dimensions on resize / orientation change
            const onResize = () => { setWinH(window.innerHeight); setWinW(window.innerWidth); };
            window.addEventListener('resize', onResize);
            window.addEventListener('orientationchange', () => setTimeout(onResize, 300));

            // Listen for open requests
            const handleOpen = (e) => {
                if (!e.detail) return;
                const isMobile = window.innerWidth < 768;
                if (isMobile) {
                    // On mobile: open directly in a new tab — best UX for HTML files
                    window.open(e.detail, '_blank', 'noopener,noreferrer');
                } else {
                    setUrl(e.detail);
                }
            };
            window.addEventListener('openFullscreen', handleOpen);

            return () => {
                window.removeEventListener('openFullscreen', handleOpen);
                window.removeEventListener('resize', onResize);
                obs.disconnect();
            };
        }, []);

        // Nothing to render on mobile (file opens in new tab)
        if (!url) return null;

        // ── Desktop Modal ────────────────────────────────────────────────────
        const HEADER_H = 56;
        const modalH = Math.round(winH * 0.90);
        const modalW = Math.round(Math.min(winW * 0.95, 1400));
        const contentH = modalH - HEADER_H;

        const isLocal = url.startsWith('file://') ||
            (!url.startsWith('http') && !url.startsWith('data:') &&
             !url.startsWith('blob:') && !url.startsWith('//'));

        const close = () => setUrl(null);

        return html`
        <div
            style=${{
                position: 'fixed', top: 0, left: 0,
                width: winW + 'px', height: winH + 'px',
                zIndex: 999999,
                background: 'rgba(0,0,0,0.80)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Cairo, sans-serif',
            }}
            onClick=${(e) => { if (e.target === e.currentTarget) close(); }}
        >
            <div style=${{
                width: modalW + 'px', height: modalH + 'px',
                background: '#fff',
                borderRadius: '18px',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            }}>

                <!-- Header bar -->
                <div style=${{
                    height: HEADER_H + 'px', background: '#0f172a',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 20px', boxSizing: 'border-box', flexShrink: 0, gap: '12px',
                }}>
                    <span style=${{ color: '#94a3b8', fontWeight: 700, fontSize: '0.85rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        📄 ${lang === 'ar' ? 'عارض الملف' : 'File Viewer'}
                    </span>
                    <button onClick=${close}
                        style=${{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '9px', fontWeight: 900, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        ✖ ${lang === 'ar' ? 'رجوع' : 'Close'}
                    </button>
                </div>

                <!-- Content: local file notice OR live iframe -->
                ${isLocal ? html`
                    <div style=${{
                        width: '100%', height: contentH + 'px', boxSizing: 'border-box',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: '20px', padding: '32px', background: 'linear-gradient(135deg, #f8fafc, #eef2ff)', textAlign: 'center',
                    }}>
                        <div style=${{ fontSize: '64px', lineHeight: 1 }}>📄</div>
                        <div>
                            <h2 style=${{ fontSize: '1.35rem', fontWeight: 900, color: '#1e293b', margin: '0 0 8px' }}>
                                ${lang === 'ar' ? 'ملف محلي' : 'Local File'}
                            </h2>
                            <p style=${{ color: '#64748b', fontWeight: 600, lineHeight: 1.7, fontSize: '0.9rem', margin: 0 }}>
                                ${lang === 'ar'
                                    ? 'لا يمكن للمتصفح تضمين الملفات المحلية. اضغط أدناه لفتحه في تبويب جديد.'
                                    : 'The browser cannot embed local files. Click below to open in a new tab.'}
                            </p>
                        </div>
                        <a href=${url} target="_blank" rel="noopener noreferrer"
                            style=${{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff', padding: '13px 32px', borderRadius: '13px', fontWeight: 900, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 6px 20px rgba(6,182,212,0.35)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <span>↗</span><span>${lang === 'ar' ? 'فتح في المتصفح' : 'Open in Browser'}</span>
                        </a>
                    </div>
                ` : html`
                    <iframe
                        src=${url}
                        style=${{ display: 'block', width: modalW + 'px', height: contentH + 'px', border: 'none', flexShrink: 0 }}
                        width=${modalW}
                        height=${contentH}
                        sandbox="allow-scripts allow-popups allow-same-origin allow-forms allow-downloads"
                    ></iframe>
                `}
            </div>
        </div>
        `;
    };

    const container = document.createElement('div');
    container.id = 'luminova-viewer-portal';
    document.body.appendChild(container);
    window.ReactDOM.createRoot(container).render(html`<${FullscreenViewerApp} />`);
    window.__LUMINOVA.Pages.FullscreenViewer = FullscreenViewerApp;

})();
