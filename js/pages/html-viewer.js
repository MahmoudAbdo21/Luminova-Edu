(function () {
    "use strict";

    if (!window.__LUMINOVA || !window.React || !window.ReactDOM) return;

    const { useState, useEffect } = window.React;
    const html = window.htm.bind(window.React.createElement);

    // ─── Mount FullscreenViewer as an INDEPENDENT React root ─────────────────
    // This avoids all timing/mounting issues with the App component.
    // The viewer manages its own state and listens globally for 'openFullscreen'.
    // ──────────────────────────────────────────────────────────────────────────

    const FullscreenViewerApp = () => {
        const [url, setUrl] = useState(null);
        const [lang, setLang] = useState('ar');

        useEffect(() => {
            // Sync language from main app
            const syncLang = () => {
                const root = document.documentElement;
                setLang(root.getAttribute('lang') === 'en' ? 'en' : 'ar');
            };
            syncLang();

            const observer = new MutationObserver(syncLang);
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

            const handleOpen = (e) => {
                if (e.detail) setUrl(e.detail);
            };
            window.addEventListener('openFullscreen', handleOpen);

            return () => {
                window.removeEventListener('openFullscreen', handleOpen);
                observer.disconnect();
            };
        }, []);

        if (!url) return null;

        const isLocal = url.startsWith('file://') ||
            (!url.startsWith('http') && !url.startsWith('data:') &&
             !url.startsWith('blob:') && !url.startsWith('//'));

        const close = () => setUrl(null);

        return html`
        <div
            style=${{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 999999,
                background: 'rgba(0,0,0,0.78)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                fontFamily: 'Cairo, sans-serif'
            }}
            onClick=${(e) => { if (e.target === e.currentTarget) close(); }}
        >
            <div style=${{
                background: '#fff',
                width: '95vw',
                height: '90vh',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            }}>

                <!-- Top header bar -->
                <div style=${{
                    background: '#0f172a',
                    height: '58px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    flexShrink: 0,
                    gap: '12px'
                }}>
                    <span style=${{ color: '#94a3b8', fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        ${lang === 'ar' ? '📄 عارض الملف' : '📄 File Viewer'}
                    </span>
                    <button
                        onClick=${close}
                        style=${{
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 18px',
                            borderRadius: '10px',
                            fontWeight: 900,
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexShrink: 0,
                            transition: 'background 0.15s'
                        }}
                    >
                        ✖ ${lang === 'ar' ? 'رجوع' : 'Close'}
                    </button>
                </div>

                <!-- Content -->
                ${isLocal ? html`
                    <div style=${{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
                        padding: '32px',
                        textAlign: 'center'
                    }}>
                        <div style=${{ fontSize: '72px', lineHeight: 1, filter: 'grayscale(0.3)' }}>📄</div>

                        <div>
                            <h2 style=${{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b', margin: '0 0 8px' }}>
                                ${lang === 'ar' ? 'عرض الملف' : 'View File'}
                            </h2>
                            <p style=${{ color: '#64748b', fontWeight: 600, maxWidth: '420px', lineHeight: 1.7, fontSize: '0.9rem', margin: 0 }}>
                                ${lang === 'ar'
                                    ? 'المتصفح لا يسمح بتضمين الملفات المحلية داخل الصفحة. اضغط الزر أدناه لفتح الملف في تبويب جديد.'
                                    : 'The browser cannot embed local files inside the page. Click below to open the file in a new tab.'}
                            </p>
                        </div>

                        <a
                            href=${url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style=${{
                                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                color: '#fff',
                                padding: '14px 36px',
                                borderRadius: '14px',
                                fontWeight: 900,
                                fontSize: '1.05rem',
                                textDecoration: 'none',
                                boxShadow: '0 8px 24px rgba(6,182,212,0.35)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <span>↗</span>
                            <span>${lang === 'ar' ? 'فتح الملف في المتصفح' : 'Open File in Browser'}</span>
                        </a>

                        <p style=${{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, maxWidth: '380px', margin: 0 }}>
                            💡 ${lang === 'ar'
                                ? 'على GitHub Pages سيُعرض الملف هنا مباشرةً داخل النافذة'
                                : 'On GitHub Pages the file will be displayed here directly'}
                        </p>
                    </div>
                ` : html`
                    <iframe
                        src=${url}
                        style=${{ width: '100%', flex: 1, border: 'none', background: '#fff' }}
                        sandbox="allow-scripts allow-popups allow-same-origin allow-forms allow-downloads"
                    ></iframe>
                `}
            </div>
        </div>
        `;
    };

    // Mount independently — completely separate from the main App React tree
    const container = document.createElement('div');
    container.id = 'luminova-viewer-portal';
    document.body.appendChild(container);
    window.ReactDOM.createRoot(container).render(html`<${FullscreenViewerApp} />`);

    // Keep backward compat reference (not used for mounting anymore)
    window.__LUMINOVA.Pages.FullscreenViewer = FullscreenViewerApp;

})();
