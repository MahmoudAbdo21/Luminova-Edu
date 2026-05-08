// js/engines/interactive-engine.js
// Standalone Interactive Lesson Engine for Luminova Edu
// Handles: JSX fetching, Babel transpilation, icon stubs, fullscreen lifecycle, orientation gate, cleanup
(function () {
  'use strict';
  var React = window.React;
  var ReactDOM = window.ReactDOM;
  var html = window.html;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useCallback = React.useCallback;
  var useRef = React.useRef;

  // ─── Icon Stub Factory ───
  var ICON_STUBS_CODE = [
    'var _LI=function(p,d){return React.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:p&&p.className||""},d.map(function(c,i){return React.createElement(c[0],Object.assign({key:"i"+i},c[1]))}))};',
    'var CheckCircle2=function(p){return _LI(p||{},[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}],["polyline",{points:"22 4 12 14.01 9 11.01"}]])};',
    'var XCircle=function(p){return _LI(p||{},[["circle",{cx:"12",cy:"12",r:"10"}],["line",{x1:"15",y1:"9",x2:"9",y2:"15"}],["line",{x1:"9",y1:"9",x2:"15",y2:"15"}]])};',
    'var ChevronRight=function(p){return _LI(p||{},[["polyline",{points:"9 18 15 12 9 6"}]])};',
    'var ChevronLeft=function(p){return _LI(p||{},[["polyline",{points:"15 18 9 12 15 6"}]])};',
    'var LogOut=function(p){return _LI(p||{},[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}],["polyline",{points:"16 17 21 12 16 7"}],["line",{x1:"21",y1:"12",x2:"9",y2:"12"}]])};',
    'var Lightbulb=function(p){return _LI(p||{},[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"}],["path",{d:"M9 18h6"}],["path",{d:"M10 22h4"}]])};',
    'var PieChart=function(p){return _LI(p||{},[["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83"}],["path",{d:"M22 12A10 10 0 0 0 12 2v10z"}]])};',
    'var Target=function(p){return _LI(p||{},[["circle",{cx:"12",cy:"12",r:"10"}],["circle",{cx:"12",cy:"12",r:"6"}],["circle",{cx:"12",cy:"12",r:"2"}]])};',
    'var Layers=function(p){return _LI(p||{},[["polygon",{points:"12 2 2 7 12 12 22 7 12 2"}],["polyline",{points:"2 17 12 22 22 17"}],["polyline",{points:"2 12 12 17 22 12"}]])};',
    'var Eye=function(p){return _LI(p||{},[["path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}],["circle",{cx:"12",cy:"12",r:"3"}]])};',
    'var Layout=function(p){return _LI(p||{},[["rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}],["line",{x1:"3",y1:"9",x2:"21",y2:"9"}],["line",{x1:"9",y1:"21",x2:"9",y2:"9"}]])};',
    'var Activity=function(p){return _LI(p||{},[["polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"}]])};',
    'var Palette=function(p){return _LI(p||{},[["circle",{cx:"13.5",cy:"6.5",r:".5"}],["circle",{cx:"17.5",cy:"10.5",r:".5"}],["circle",{cx:"8.5",cy:"7.5",r:".5"}],["circle",{cx:"6.5",cy:"12.5",r:".5"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.7 1.7-1.5 0-.4-.1-.7-.4-1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.7 1.7-1.7H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z"}]])};',
    'var Scale=function(p){return _LI(p||{},[["line",{x1:"12",y1:"3",x2:"12",y2:"21"}],["polyline",{points:"8 8 4 12 8 16"}],["polyline",{points:"16 8 20 12 16 16"}]])};',
    'var ListChecks=function(p){return _LI(p||{},[["path",{d:"m3 17 2 2 4-4"}],["path",{d:"m3 7 2 2 4-4"}],["path",{d:"M13 6h8"}],["path",{d:"M13 12h8"}],["path",{d:"M13 18h8"}]])};',
    'var Brain=function(p){return _LI(p||{},[["path",{d:"M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 5 17.5c0-.38.09-.73.24-1.05A2.5 2.5 0 0 1 4 14c0-1 .59-1.85 1.44-2.25A2.5 2.5 0 0 1 4 9.5a2.5 2.5 0 0 1 2-2.45A2.5 2.5 0 0 1 9.5 2z"}],["path",{d:"M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 19 17.5c0-.38-.09-.73-.24-1.05A2.5 2.5 0 0 0 20 14c0-1-.59-1.85-1.44-2.25A2.5 2.5 0 0 0 20 9.5a2.5 2.5 0 0 0-2-2.45A2.5 2.5 0 0 0 14.5 2z"}]])};',
    'var BarChart=function(p){return _LI(p||{},[["line",{x1:"12",y1:"20",x2:"12",y2:"10"}],["line",{x1:"18",y1:"20",x2:"18",y2:"4"}],["line",{x1:"6",y1:"20",x2:"6",y2:"16"}]])};',
    'var ShieldCheck=function(p){return _LI(p||{},[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"}],["path",{d:"m9 12 2 2 4-4"}]])};',
    'var AlertTriangle=function(p){return _LI(p||{},[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"}],["line",{x1:"12",y1:"9",x2:"12",y2:"13"}],["line",{x1:"12",y1:"17",x2:"12.01",y2:"17"}]])};',
    'var Video=function(p){return _LI(p||{},[["polygon",{points:"23 7 16 12 23 17 23 7"}],["rect",{x:"1",y:"5",width:"15",height:"14",rx:"2",ry:"2"}]])};',
    'var ImageIcon=function(p){return _LI(p||{},[["rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}],["circle",{cx:"8.5",cy:"8.5",r:"1.5"}],["polyline",{points:"21 15 16 10 5 21"}]])};',
    'var Image=ImageIcon;',
    'var MonitorPlay=function(p){return _LI(p||{},[["path",{d:"M10 7.75a.75.75 0 0 1 1.14-.64l3.5 2.25a.75.75 0 0 1 0 1.28l-3.5 2.25A.75.75 0 0 1 10 12.25v-4.5z"}],["rect",{x:"2",y:"3",width:"20",height:"14",rx:"2"}],["path",{d:"M8 21h8"}],["path",{d:"M12 17v4"}]])};',
    'var ListOrdered=function(p){return _LI(p||{},[["line",{x1:"10",y1:"6",x2:"21",y2:"6"}],["line",{x1:"10",y1:"12",x2:"21",y2:"12"}],["line",{x1:"10",y1:"18",x2:"21",y2:"18"}],["path",{d:"M4 6h1v4"}],["path",{d:"M4 10h2"}],["path",{d:"M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"}]])};',
  ].join('\n');

  // ─── Universal Fallback: Proxy catch-all for unknown components ───
  // Injected into the IIFE scope so any capitalized undefined variable
  // returns a placeholder SVG instead of throwing ReferenceError
  var UNIVERSAL_FALLBACK_CODE =
    'var _PLACEHOLDER=function(p){return React.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",className:p&&p.className||"",style:{opacity:0.5}},React.createElement("rect",{key:"r",x:"3",y:"3",width:"18",height:"18",rx:"3",ry:"3"}),React.createElement("line",{key:"l1",x1:"9",y1:"9",x2:"15",y2:"15"}),React.createElement("line",{key:"l2",x1:"15",y1:"9",x2:"9",y2:"15"}))};';

  // ─── React Error Boundary for runtime crashes ───
  var LessonErrorBoundary = (function (_super) {
    function Boundary(props) {
      _super.call(this, props);
      this.state = { hasError: false, errorMsg: '' };
    }
    Boundary.prototype = Object.create(_super.prototype);
    Boundary.prototype.constructor = Boundary;
    Boundary.getDerivedStateFromError = function (error) {
      return { hasError: true, errorMsg: error.message || String(error) };
    };
    Boundary.prototype.componentDidCatch = function (error, info) {
      console.error('[Luminova Engine] Runtime error in lesson component:', error, info);
      this.setState({ hasError: true, errorMsg: error.message || String(error) });
    };
    Boundary.prototype.render = function () {
      if (this.state.hasError) {
        var msg = this.state.errorMsg;
        var compMatch = msg.match(/([A-Z][A-Za-z0-9_$]+)\s+is\s+not\s+defined/);
        var detail = compMatch
          ? 'عنصر مفقود: حاول الدرس استخدام شكل أو أيقونة غير مسجلة في النظام. (' + compMatch[1] + ')'
          : msg;
        return React.createElement('div', {
          style: { position:'fixed',inset:0,zIndex:99999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0a0f1c 0%,#1a0a2e 50%,#0a0f1c 100%)',padding:'24px' }
        },
          React.createElement('div', {
            style: { background:'rgba(255,255,255,0.06)',backdropFilter:'blur(40px)',WebkitBackdropFilter:'blur(40px)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'28px',padding:'48px 40px',maxWidth:'560px',width:'100%',textAlign:'center',boxShadow:'0 32px 64px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1)' }
          },
            React.createElement('svg', { xmlns:"http://www.w3.org/2000/svg", width:"64", height:"64", viewBox:"0 0 24 24", fill:"none", stroke:"#fb7185", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round", style:{ marginBottom:'20px', filter:'drop-shadow(0 0 20px rgba(244,63,94,0.4))' } },
              React.createElement('path', { d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" }),
              React.createElement('line', { x1:"12", y1:"9", x2:"12", y2:"13" }),
              React.createElement('line', { x1:"12", y1:"17", x2:"12.01", y2:"17" })
            ),
            React.createElement('h2', { style: { color:'#fb7185',fontSize:'1.4rem',fontWeight:900,marginBottom:'16px',lineHeight:1.4 } }, 'حدث خطأ أثناء تشغيل الدرس'),
            React.createElement('div', { style: { background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'16px 20px',marginBottom:'24px',direction:'rtl' } },
              React.createElement('p', { style: { color:'rgba(255,255,255,0.6)',fontSize:'0.85rem',fontWeight:600,margin:0,lineHeight:1.7,fontFamily:'monospace',wordBreak:'break-word' } }, detail)
            ),
            React.createElement('button', {
              onClick: function () { window.dispatchEvent(new CustomEvent('luminova:exit')); },
              style: { background:'linear-gradient(135deg,#fb7185,#e879f9)',color:'white',border:'none',borderRadius:'16px',padding:'14px 40px',fontSize:'1rem',fontWeight:900,cursor:'pointer',transition:'all 0.3s ease',boxShadow:'0 8px 24px rgba(244,63,94,0.3)' },
              onMouseOver: function (e) { e.target.style.transform = 'scale(1.05)'; },
              onMouseOut: function (e) { e.target.style.transform = 'scale(1)'; }
            }, 
              React.createElement('svg', { xmlns:"http://www.w3.org/2000/svg", width:"20", height:"20", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2.5", strokeLinecap:"round", strokeLinejoin:"round", style:{ marginRight:'8px', verticalAlign:'middle', display:'inline-block' } },
                React.createElement('path', { d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
                React.createElement('polyline', { points:"16 17 21 12 16 7" }),
                React.createElement('line', { x1:"21", y1:"12", x2:"9", y2:"12" })
              ),
              'خروج من الدرس'
            )
          )
        );
      }
      return this.props.children;
    };
    return Boundary;
  })(React.Component);

  // ─── Preprocessing: Mini-Bundler ───
  function preprocessJSX(rawCode) {
    var code = rawCode;
    // Strip multi-line imports: import { ... } from '...'
    code = code.replace(/import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]*['"];?/g, '');
    // Strip single-line default/named imports
    code = code.replace(/import\s+.*?\s+from\s*['"][^'"]*['"];?/g, '');
    // Strip side-effect imports
    code = code.replace(/import\s*['"][^'"]*['"];?/g, '');

    // Dynamic export default detection & conversion
    // Case 1: export default function Name(...)  →  keep function, assign at end
    var funcMatch = code.match(/export\s+default\s+function\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
    if (funcMatch) {
      code = code.replace(/export\s+default\s+function\s+/, 'function ');
      code += '\nwindow.__LUMINOVA_LESSON = ' + funcMatch[1] + ';';
    } else {
      // Case 2: export default ClassName;
      var namedMatch = code.match(/export\s+default\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*;?/);
      if (namedMatch) {
        code = code.replace(/export\s+default\s+[A-Za-z_$][A-Za-z0-9_$]*\s*;?/g, '');
        code += '\nwindow.__LUMINOVA_LESSON = ' + namedMatch[1] + ';';
      }
    }
    // Strip any remaining named exports
    code = code.replace(/export\s*\{[\s\S]*?\}\s*;?/g, '');
    return code;
  }

  // ─── Compile & Execute ───
  function compileAndExecute(rawJsx) {
    window.__LUMINOVA_LESSON = null;
    var processed = preprocessJSX(rawJsx);
    // Scan for capitalized JSX tags used in the code and generate fallback stubs
    // for any that aren't covered by our known icon stubs
    var knownComponents = [
      'React','CheckCircle2','XCircle','ChevronRight','ChevronLeft','LogOut',
      'Lightbulb','PieChart','Target','Layers','Eye','Layout','Activity',
      'Palette','Scale','ListChecks','Brain','BarChart','ShieldCheck',
      'AlertTriangle','Video','ImageIcon','Image','MonitorPlay','ListOrdered'
    ];
    // Find all capitalized identifiers used as JSX tags: <SomeName
    var jsxTagRegex = /<([A-Z][A-Za-z0-9_$]*)\s/g;
    var match, unknownTags = {};
    while ((match = jsxTagRegex.exec(processed)) !== null) {
      if (knownComponents.indexOf(match[1]) === -1) unknownTags[match[1]] = true;
    }
    // Generate fallback stubs for unknown tags
    var dynamicFallbacks = Object.keys(unknownTags).map(function (name) {
      return 'var ' + name + '=_PLACEHOLDER;';
    }).join('\n');

    var wrapped = '(function(){' +
      'var React=window.React;' +
      'var useState=React.useState,useEffect=React.useEffect,useCallback=React.useCallback,useRef=React.useRef,useMemo=React.useMemo;' +
      UNIVERSAL_FALLBACK_CODE + '\n' +
      ICON_STUBS_CODE + '\n' +
      dynamicFallbacks + '\n' +
      processed +
      '\n})();';
    if (!window.Babel) throw new Error('Babel Standalone is not loaded. Add <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>');
    var compiled = window.Babel.transform(wrapped, { presets: ['env', 'react'], sourceType: 'script' }).code;
    new Function(compiled)();
    if (!window.__LUMINOVA_LESSON) throw new Error('No component exported. Ensure the .jsx file has a default export.');
  }

  // ─── Detect Mobile ───
  function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1024;
  }

  // ─── OrientationGate Component ───
  var OrientationGate = function (props) {
    var _s = useState(window.innerWidth > window.innerHeight), isLandscape = _s[0], setIsLandscape = _s[1];
    useEffect(function () {
      var check = function () {
        var ls = window.innerWidth > window.innerHeight;
        setIsLandscape(ls);
        if (ls && props.onReady) props.onReady();
      };
      check();
      window.addEventListener('resize', check);
      var mql = window.matchMedia('(orientation: landscape)');
      var h = function (e) { setIsLandscape(e.matches); if (e.matches && props.onReady) props.onReady(); };
      mql.addEventListener('change', h);
      return function () { window.removeEventListener('resize', check); mql.removeEventListener('change', h); };
    }, []);
    if (isLandscape) return null;
    return React.createElement('div', {
      style: { position:'fixed',inset:0,zIndex:99999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0a0f1c,#1a0a2e)',padding:'24px' }
    },
      React.createElement('style', null, '@keyframes _lmv_rp{0%,100%{transform:rotate(0deg) scale(1)}30%,70%{transform:rotate(90deg) scale(1.1)}}'),
      React.createElement('svg', { xmlns:"http://www.w3.org/2000/svg", width:"80", height:"80", viewBox:"0 0 24 24", fill:"none", stroke:"white", strokeWidth:"1.5", strokeLinecap:"round", strokeLinejoin:"round", style:{ animation:'_lmv_rp 3s cubic-bezier(0.4,0,0.2,1) infinite', marginBottom:'32px', filter:'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' } },
        React.createElement('rect', { x:"5", y:"2", width:"14", height:"20", rx:"2", ry:"2" }),
        React.createElement('line', { x1:"12", y1:"18", x2:"12.01", y2:"18", strokeWidth:"3" })
      ),
      React.createElement('h2', { style: { color:'white',fontSize:'1.6rem',fontWeight:900,textAlign:'center',marginBottom:'12px',lineHeight:1.4 } }, 'يرجى تدوير هاتفك للوضع الأفقي لبدء الدرس'),
      React.createElement('p', { style: { color:'rgba(255,255,255,0.4)',fontSize:'0.9rem',fontWeight:600 } }, 'سيبدأ الدرس تلقائياً')
    );
  };

  // ─── Error Screen Component ───
  var ErrorScreen = function (props) {
    return React.createElement('div', {
      style: { position:'fixed',inset:0,zIndex:99999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0a0f1c 0%,#1a0a2e 50%,#0a0f1c 100%)',padding:'24px' }
    },
      React.createElement('div', {
        style: { background:'rgba(255,255,255,0.06)',backdropFilter:'blur(40px)',WebkitBackdropFilter:'blur(40px)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'28px',padding:'48px 40px',maxWidth:'520px',width:'100%',textAlign:'center',boxShadow:'0 32px 64px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1)' }
      },
        React.createElement('svg', { xmlns:"http://www.w3.org/2000/svg", width:"64", height:"64", viewBox:"0 0 24 24", fill:"none", stroke:"#fb7185", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round", style:{ marginBottom:'20px', filter:'drop-shadow(0 0 20px rgba(244,63,94,0.4))' } },
          React.createElement('path', { d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" }),
          React.createElement('line', { x1:"12", y1:"9", x2:"12", y2:"13" }),
          React.createElement('line', { x1:"12", y1:"17", x2:"12.01", y2:"17" })
        ),
        React.createElement('h2', { style: { color:'#fb7185',fontSize:'1.5rem',fontWeight:900,marginBottom:'16px',lineHeight:1.4 } }, 'حدث خطأ أثناء تشغيل الدرس'),
        React.createElement('div', { style: { background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'16px 20px',marginBottom:'20px',direction:'rtl' } },
          React.createElement('p', { style: { color:'rgba(255,255,255,0.5)',fontSize:'0.85rem',fontWeight:600,margin:0,lineHeight:1.6,fontFamily:'monospace',wordBreak:'break-all' } }, props.message || 'حدث خطأ أثناء تشغيل الدرس')
        ),
        React.createElement('button', {
          onClick: props.onExit,
          style: { background:'linear-gradient(135deg,#fb7185,#e879f9)',color:'white',border:'none',borderRadius:'16px',padding:'14px 40px',fontSize:'1rem',fontWeight:900,cursor:'pointer',transition:'all 0.3s ease',boxShadow:'0 8px 24px rgba(244,63,94,0.3)' },
          onMouseOver: function (e) { e.target.style.transform = 'scale(1.05)'; },
          onMouseOut: function (e) { e.target.style.transform = 'scale(1)'; }
        }, 
          React.createElement('svg', { xmlns:"http://www.w3.org/2000/svg", width:"20", height:"20", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2.5", strokeLinecap:"round", strokeLinejoin:"round", style:{ marginRight:'8px', verticalAlign:'middle', display:'inline-block' } },
            React.createElement('path', { d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
            React.createElement('polyline', { points:"16 17 21 12 16 7" }),
            React.createElement('line', { x1:"21", y1:"12", x2:"9", y2:"12" })
          ),
          'خروج'
        )
      )
    );
  };

  // ─── Main Engine Component ───
  var InteractiveEngine = function () {
    var _a = useState(false), active = _a[0], setActive = _a[1];
    var _b = useState(null), url = _b[0], setUrl = _b[1];
    var _c = useState(false), loaded = _c[0], setLoaded = _c[1];
    var _d = useState(false), portrait = _d[0], setPortrait = _d[1];
    var _e = useState(false), lsReady = _e[0], setLsReady = _e[1];
    var _f = useState(false), hasErr = _f[0], setHasErr = _f[1];
    var _g = useState(''), errMsg = _g[0], setErrMsg = _g[1];
    var wrapRef = useRef(null);
    var mountRef = useRef(null);
    var lessonRootRef = useRef(null);       // React 18 createRoot reference
    var exitListenerRef = useRef(null);     // Smart Exit click listener reference

    // ─── Exit keyword heuristic regex (Arabic + English) ───
    var EXIT_REGEX = /(خروج|إنهاء|انهاء|رجوع|إغلاق|اغلاق|العودة|exit|close|back|leave|quit|end\s*lesson|finish)/i;

    var cleanup = useCallback(function () {
      // Remove smart exit listener
      if (exitListenerRef.current && mountRef.current) {
        mountRef.current.removeEventListener('click', exitListenerRef.current, true);
        exitListenerRef.current = null;
      }
      // Exit fullscreen
      if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
      // Unmount React 18 root or legacy
      if (lessonRootRef.current) {
        try { lessonRootRef.current.unmount(); } catch (e) {}
        lessonRootRef.current = null;
      } else if (mountRef.current) {
        try { ReactDOM.unmountComponentAtNode(mountRef.current); } catch (e) {}
      }
      // Nullify global
      window.__LUMINOVA_LESSON = null;
      setActive(false); setUrl(null); setLoaded(false);
      setPortrait(false); setLsReady(false);
      setHasErr(false); setErrMsg('');
    }, []);

    var startLesson = useCallback(function (lessonUrl) {
      fetch(lessonUrl + '?t=' + Date.now())
        .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.text(); })
        .then(function (raw) {
          try {
            compileAndExecute(raw);
            setLoaded(true);
          } catch (e) {
            console.error('Luminova Engine: Babel compile error:', e);
            setErrMsg(e.message || String(e)); setHasErr(true);
          }
        })
        .catch(function (e) {
          console.error('Luminova Engine: Fetch error:', e);
          var errorText = e.message || String(e);
          if (errorText.includes('Failed to fetch') && window.location.protocol === 'file:') {
            errorText = 'يرجى تشغيل المنصة باستخدام خادم محلي (Local Web Server) لتعمل الدروس التفاعلية. عذراً! لا يمكن قراءة ملف الدرس مباشرة من الجهاز.';
          }
          setErrMsg(errorText); setHasErr(true);
        });
    }, []);

    // Listen: startInteractiveLesson
    useEffect(function () {
      var handler = function (e) {
        var detail = e.detail || {};
        if (!detail.url) return;
        setActive(true); setUrl(detail.url); setLoaded(false); setHasErr(false); setErrMsg(''); setLsReady(false);
        if (isMobile() && window.innerHeight > window.innerWidth) {
          setPortrait(true);
        } else {
          setPortrait(false); setLsReady(true);
        }
      };
      window.addEventListener('startInteractiveLesson', handler);
      return function () { window.removeEventListener('startInteractiveLesson', handler); };
    }, []);

    // Listen: luminova:exit
    useEffect(function () {
      var handler = function () { cleanup(); };
      window.addEventListener('luminova:exit', handler);
      return function () { window.removeEventListener('luminova:exit', handler); };
    }, [cleanup]);

    // Fullscreen change → cleanup on exit
    useEffect(function () {
      var handler = function () { if (!document.fullscreenElement && active && loaded) cleanup(); };
      document.addEventListener('fullscreenchange', handler);
      return function () { document.removeEventListener('fullscreenchange', handler); };
    }, [active, loaded, cleanup]);

    // Orientation tracking while waiting
    useEffect(function () {
      if (!active || loaded) return;
      var check = function () {
        var p = window.innerHeight > window.innerWidth;
        setPortrait(p);
        if (!p && !lsReady) setLsReady(true);
      };
      window.addEventListener('resize', check);
      return function () { window.removeEventListener('resize', check); };
    }, [active, loaded, lsReady]);

    // Gesture-gated start
    var handleStart = useCallback(function () {
      setLsReady(false);
      var el = wrapRef.current || document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen().catch(function () {});
      startLesson(url);
    }, [url, startLesson]);

    // Render lesson component into mount point once loaded (wrapped in ErrorBoundary)
    // Uses React 18 createRoot when available, falls back to legacy render
    useEffect(function () {
      if (!loaded || !window.__LUMINOVA_LESSON || !mountRef.current) return;
      var Comp = window.__LUMINOVA_LESSON;
      var exitFn = function () { window.dispatchEvent(new CustomEvent('luminova:exit')); };
      var tree = React.createElement(LessonErrorBoundary, null,
        React.createElement(Comp, { onExit: exitFn })
      );

      // React 18 createRoot path
      if (ReactDOM.createRoot) {
        var root = ReactDOM.createRoot(mountRef.current);
        root.render(tree);
        lessonRootRef.current = root;
      } else {
        // Legacy fallback
        ReactDOM.render(tree, mountRef.current);
      }

      // ─── Task 1: Zero-Touch Smart Exit Interceptor ───
      // Capture-phase click delegation on the lesson mount node.
      // Detects exit-intent clicks by matching button/anchor text against
      // Arabic + English exit keywords — no modifications needed in .jsx files.
      var smartExitHandler = function (evt) {
        var target = evt.target;
        // Walk up to find the nearest interactive element
        var el = target.closest ? target.closest('button, a, [role="button"]') : null;
        if (!el) return;
        // Gather all possible text signals
        var text = (el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '') + ' ' + (el.getAttribute('title') || '');
        if (EXIT_REGEX.test(text)) {
          evt.preventDefault();
          evt.stopPropagation();
          // Also call the lesson's own onExit if it was passed via props
          // (for lessons that DO wire it — harmless double-call is guarded by cleanup idempotency)
          window.dispatchEvent(new CustomEvent('luminova:exit'));
        }
      };
      mountRef.current.addEventListener('click', smartExitHandler, true);
      exitListenerRef.current = smartExitHandler;
    }, [loaded]);

    if (!active) return null;

    // Error state
    if (hasErr) return React.createElement(ErrorScreen, { message: errMsg, onExit: cleanup });

    // Portrait gate
    if (portrait && !loaded) {
      return React.createElement(OrientationGate, { onReady: function () { setPortrait(false); setLsReady(true); } });
    }

    // Landscape ready → gesture gate
    if (lsReady && !loaded) {
      return React.createElement('div', { ref: wrapRef, style: { position:'fixed',inset:0,zIndex:99999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0a0f1c 0%,#0f172a 50%,#0a0f1c 100%)',padding:'24px' } },
        React.createElement('div', { style: { background:'rgba(255,255,255,0.05)',backdropFilter:'blur(40px)',WebkitBackdropFilter:'blur(40px)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'28px',padding:'44px 36px',maxWidth:'480px',width:'100%',textAlign:'center',boxShadow:'0 32px 64px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08)' } },
          React.createElement('div', { style: { marginBottom:'16px', display:'flex', justifyContent:'center' } },
            React.createElement('svg', { xmlns:"http://www.w3.org/2000/svg", width:"56", height:"56", viewBox:"0 0 24 24", fill:"none", stroke:"#38bdf8", strokeWidth:"1.5", strokeLinecap:"round", strokeLinejoin:"round", style:{ filter:'drop-shadow(0 0 15px rgba(56,189,248,0.4))' } },
              React.createElement('path', { d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" }),
              React.createElement('path', { d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" }),
              React.createElement('path', { d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" }),
              React.createElement('path', { d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" })
            )
          ),
          React.createElement('h2', { style: { color:'white',fontSize:'1.4rem',fontWeight:900,marginBottom:'10px' } }, 'الدرس جاهز!'),
          React.createElement('p', { style: { color:'rgba(255,255,255,0.5)',fontSize:'0.85rem',fontWeight:600,marginBottom:'28px' } }, 'اضغط للدخول في وضع الشاشة الكاملة وبدء الدرس'),
          React.createElement('button', {
            onClick: handleStart,
            style: { background:'linear-gradient(135deg,#38bdf8,#818cf8)',color:'white',border:'none',borderRadius:'18px',padding:'16px 44px',fontSize:'1.1rem',fontWeight:900,cursor:'pointer',boxShadow:'0 8px 28px rgba(56,189,248,0.35)',display:'inline-flex',alignItems:'center',gap:'10px',transition:'all 0.3s ease' },
            onMouseOver: function (e) { e.target.style.transform = 'scale(1.05)'; },
            onMouseOut: function (e) { e.target.style.transform = 'scale(1)'; }
          }, 
            React.createElement('svg', { xmlns:"http://www.w3.org/2000/svg", width:"22", height:"22", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2.5", strokeLinecap:"round", strokeLinejoin:"round" },
              React.createElement('polygon', { points:"5 3 19 12 5 21 5 3" })
            ),
            'ابدأ الدرس'
          ),
          React.createElement('div', { style: { marginTop:'16px' } },
            React.createElement('button', {
              onClick: cleanup,
              style: { background:'transparent',color:'rgba(255,255,255,0.35)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'10px 28px',fontSize:'0.85rem',fontWeight:700,cursor:'pointer' }
            }, 'إلغاء')
          )
        )
      );
    }

    // Loading spinner
    if (!loaded || !window.__LUMINOVA_LESSON) {
      return React.createElement('div', { style: { position:'fixed',inset:0,zIndex:99999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#0a0f1c' } },
        React.createElement('div', { style: { width:'48px',height:'48px',border:'4px solid #22d3ee',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite',marginBottom:'16px' } }),
        React.createElement('style', null, '@keyframes spin{to{transform:rotate(360deg)}}'),
        React.createElement('p', { style: { color:'rgba(255,255,255,0.5)',fontSize:'0.9rem',fontWeight:700 } }, 'Loading lesson...')
      );
    }

    // Active lesson container
    return React.createElement('div', { ref: wrapRef, style: { position:'fixed',inset:0,zIndex:99999,display:'flex',flexDirection:'column',background:'#0a0f1c' } },
      React.createElement('div', { ref: mountRef, style: { flex:1,width:'100%',position:'relative',overflowY:'auto',overflowX:'hidden',WebkitOverflowScrolling:'touch' } })
    );
  };

  // ─── Mount the Engine (React 18 createRoot or legacy fallback) ───
  var container = document.createElement('div');
  container.id = 'luminova-interactive-engine';
  document.body.appendChild(container);
  if (ReactDOM.createRoot) {
    var engineRoot = ReactDOM.createRoot(container);
    engineRoot.render(React.createElement(InteractiveEngine));
  } else {
    ReactDOM.render(React.createElement(InteractiveEngine), container);
  }

  console.log('%c[Luminova] Interactive Engine v2 loaded ✓', 'color:#22d3ee;font-weight:bold;');
})();
