```react
import React, { useState, useEffect } from 'react';

export default function LuminovaLesson() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [animateSlide, setAnimateSlide] = useState(false);

  // تأثير حركي عند تغيير الشريحة
  useEffect(() => {
    setAnimateSlide(true);
    const timer = setTimeout(() => setAnimateSlide(false), 500);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleExitClick = () => setShowExitModal(true);
  
  const confirmExit = () => {
    setShowExitModal(false);
    setCurrentSlide(0);
    setQuizAnswers({});
    setShowFeedback({});
    setIsFinished(false);
  };

  const cancelExit = () => setShowExitModal(false);
  const handleFinish = () => setIsFinished(true);

  const handleQuizAnswer = (slideIndex, isCorrect) => {
    setQuizAnswers(prev => ({ ...prev, [slideIndex]: isCorrect }));
    setShowFeedback(prev => ({ ...prev, [slideIndex]: true }));
  };

  // المحتوى الدسم بالكامل متقسم على الشرايح
  const slides = [
    {
      title: "مقدمة: إيه هو المحتوى الرقمي؟ 🌌",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl font-bold text-cyan-400 mb-4">أهلاً بيك يا صاحبي في عالم لومينوفا! 🚀</p>
          <p>جاهز للرحلة؟ يلا بينا نتكلم عن حاجة أساسية جداً في التعليم دلوقتي، وهي <span className="text-purple-400 font-bold">المحتوى التعليمي الرقمي</span>.</p>
          <p>بص يا سيدي، المحتوى ده مش مجرد كتاب كئيب بنقراه، لأ ده عبارة عن معلومات ومهارات بتتعرض بصور ونصوص وأشكال، وبتتحول لصورة رقمية عشان نستخدمها على أجهزتنا الذكية.</p>
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700 shadow-inner">
            <p>والمحتوى ده بيخلينا نمارس التعليم إلكترونياً ونكتسب مهارات بطريقة إبداعية وتعاونية جداً 😂. وكمان بيخلي التقييم أسهل بكتير، سواء على مستوى الفصل أو المدرسة أو الدولة، عن طريق اختبارات ذكية ومشاريع إلكترونية بتوفر وقت ومجهود.</p>
          </div>
          <p>يعني من الآخر، هو مش مجرد مقرر تقليدي اترمي على النت، ده مزيج من مصادر تفاعلية وأنشطة متصممة صح عشان تدعم أدائك وتخليك مندمج.</p>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "تحدي لومينوفا السريع 🧠⚡",
      question: "هل المحتوى الرقمي مجرد وضع المقرر التقليدي زي ما هو على الإنترنت وبس؟",
      options: [
        { text: "أيوة بالظبط، هو كتاب بس بيتقري على الشاشة.", correct: false },
        { text: "لأ طبعاً، ده مزيج تفاعلي غني بالوسائط والأنشطة.", correct: true }
      ]
    },
    {
      title: "خصائص المحتوى الرقمي (1) ✨",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-cyan-300">تعالى بقى أقولك المحتوى ده بيتميز بإيه، مش مجرد كلام مرصوص وخلاص:</p>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="bg-slate-800/80 p-6 rounded-2xl border-l-4 border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
              <h4 className="text-cyan-400 font-bold text-xl mb-2">إمكانية التعديل 🛠️</h4>
              <p className="text-sm">(Revisable)</p>
              <p className="mt-2">نقدر نعدل في أي حتة فيه من غير ما نبوظ الباقي، وده لأن كل عنصر مستقل ومبني على مخرجات التعلم.</p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-2xl border-l-4 border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
              <h4 className="text-purple-400 font-bold text-xl mb-2">إعادة الاستخدام ♻️</h4>
              <p className="text-sm">(Reusability)</p>
              <p className="mt-2">نقدر نستخدم نفس العنصر في دروس ومقررات كتير تانية بعد ما نجربه على ناس كتير ونتأكد إنه مناسب.</p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-2xl border-l-4 border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all md:col-span-2">
              <h4 className="text-pink-400 font-bold text-xl mb-2">التخصيص 🎛️</h4>
              <p className="text-sm">(Customizable)</p>
              <p className="mt-2">كل طالب ومدرس يقدر يظبطه على مقاسه واحتياجاته الشخصية والمزاجية كمان!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "خصائص المحتوى الرقمي (2) 🚀",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-cyan-300">لسه مكملين مع الخصائص الرهيبة:</p>
          <ul className="space-y-4">
            <li className="flex items-start gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <div className="bg-cyan-500/20 p-3 rounded-lg text-cyan-400">🎯</div>
              <div>
                <strong className="text-cyan-300 block text-xl mb-1">قابلية الاستخدام (Applicable):</strong>
                شغال معاك في كل أغراض التعليم، معالجة، إثراء عمل، واكتساب مهارات في الوقت المناسب.
              </div>
            </li>
            <li className="flex items-start gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <div className="bg-purple-500/20 p-3 rounded-lg text-purple-400">🛡️</div>
              <div>
                <strong className="text-purple-300 block text-xl mb-1">الاستقلالية (Stand-Alone):</strong>
                كل عنصر ليه نتيجته الخاصة، لما تخلصه تحس إنك أنجزت المطلوب منك بجد.
              </div>
            </li>
            <li className="flex items-start gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <div className="bg-pink-500/20 p-3 rounded-lg text-pink-400">📈</div>
              <div>
                <strong className="text-pink-300 block text-xl mb-1">إمكانية التحجيم (Scalable):</strong>
                مبني كسلسلة مترابطة، بياخدك من العام للخاص، ومن السهل للصعب عشان متتعقدش وتكبر معاه 😉.
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "خصائص المحتوى الرقمي (3) 🌟",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-cyan-300">ونختم الخصائص بالحاجات دي:</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
              <strong className="text-cyan-400 block mb-2">🔗 الترابطية (Linkable):</strong> دمج عناصر كتير مع بعض عشان تناسب كل مستويات الطلاب.
            </div>
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
              <strong className="text-purple-400 block mb-2">⏳ الثبات والاستدامة (Durable):</strong> يشتغل معاك مرات كتير، ويتحدث لما المحتوى يتغير.
            </div>
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
              <strong className="text-pink-400 block mb-2">🧠 قابلية التعلم (Learnable):</strong> بيخليك تتعلم بفعالية وتخلص وإنت حاسس بإنجاز.
            </div>
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
              <strong className="text-emerald-400 block mb-2">💻 العمل على كل المنصات (Interoperable):</strong> يشتغل معاك على أي جهاز أو نظام.
            </div>
          </div>
          <div className="mt-6 p-5 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-2xl border border-cyan-800/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-cyan-500"></div>
            <strong className="text-cyan-300">💡 ملاحظة في اللذيذ:</strong> الدكتور الغريب إسماعيل ضاف كمان إن المحتوى ده بيناسب سلوك الطالب، وبيكون في حدود الإمكانيات المتاحة، وبيناسب كل الميول والقدرات بالابتكار والتجديد.
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "شغل الجمجمة ☠️💡",
      question: "يعني إيه خاصية (التحجيم - Scalable) في المحتوى الرقمي؟",
      options: [
        { text: "إن حجم الملف يكون صغير عشان الموبايل وميستهلكش باقة.", correct: false },
        { text: "إن العناصر تكون مرتبطة وتتدرج من العام للخاص ومن السهل للصعب.", correct: true }
      ]
    },
    {
      title: "أنماط المحتوى الرقمي 📚",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p>بنقسم المحتوى الرقمي حسب الوسيط، أو أسلوب التقديم، أو المحتوى نفسه. هنبدأ بحسب الوسيط!</p>
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 inline-block mb-4">
              أولاً: المحتوى الرقمي التعليمي المقروء 📖
            </h3>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <p className="mb-4">ده بقى بيعتمد على النصوص والرسومات عشان يوصل المعلومة. وده بيبقى فعال جداً في شرح الحاجات المعقدة.</p>
              <p><strong className="text-cyan-300 text-xl">الكتب الإلكترونية:</strong> مريحة جداً وسهلة في القراية. وبتخليك في قلب الحدث لأنها بتنظم المحتوى. هي باختصار نصوص زي الكتاب العادي بس عليها تحسينات رقمية بتخلي القراية ممتعة وتفاعلية.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "ليه الكتب الإلكترونية جامدة؟ 🌟",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl text-cyan-300 mb-6">إيه اللي يخلينا نسيب الكتاب الورقي ونمسك الإلكتروني؟ بص يا سيدي:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "بتشيل معلومات كتير جداً من غير ما تاخد مساحة مادية.",
              "سهلة في النشر والتعليقات، والمؤلفين بيجربوا فيها أساليب كتير.",
              "بتزود التفاعل بينك وبين زمايلك وبينك وبين المحتوى.",
              "فيها أنشطة تفاعلية وتغذية راجعة فورية بتثري التعلم.",
              "فيها طرق إبحار وتجول مختلفة جوا الكتاب.",
              "مليانة روابط فائقة (هايبرلينك) بتربط أجزاء الكتاب ببعضها."
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "المقالات والمدونات التعليمية 📝",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl">لسه في المحتوى المقروء، عندنا حاجتين كمان:</p>
          <div className="flex flex-col gap-6 mt-4">
            <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 p-6 rounded-2xl border-r-4 border-cyan-500 relative">
              <h4 className="text-2xl font-bold text-cyan-400 mb-2">المقالات التعليمية 📄</h4>
              <p>دي بتديك الخلاصة والمعلومات الموجزة عن أي موضوع، وبتنفع جداً للمواضيع المعقدة أو الجديدة. كبسولة سريعة كده!</p>
            </div>
            <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 p-6 rounded-2xl border-r-4 border-purple-500 relative">
              <h4 className="text-2xl font-bold text-purple-400 mb-2">المدونات التعليمية 🌐</h4>
              <p>دي بقى حكاية! نظام إدارة محتوى بيتنشر عليه تدوينات مترتبة بالتاريخ من الأحدث للأقدم، وفيها أرشيف كمان. دي بتعتبر وسيلة تواصل اجتماعي ونشر بتخلي المجموعات الصغيرة تتواصل أسهل من الإيميل وتتيح للكل إبداء رأيه.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال للناس الرايقة 🕵️‍♂️",
      question: "إيه هي الوسيلة اللي بتعرض التدوينات مترتبة زمنياً (من الأحدث للأقدم) وبتعتبر شبكة اجتماعية مصغرة؟",
      options: [
        { text: "الكتب الإلكترونية", correct: false },
        { text: "المدونات التعليمية", correct: true },
        { text: "المقالات العلمية", correct: false }
      ]
    },
    {
      title: "ثانياً: المحتوى الرقمي التعليمي المرئي 🎬",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 font-bold mb-6">
            ده بقى اللي بيخطف العين! 🤩
          </p>
          <p>صور ورسومات متحركة وفيديو. ده بيجذب انتباهك ويخليك فاكر المعلومة كويس جداً.</p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-600 hover:border-pink-500 transition-colors group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎥</div>
              <h4 className="text-xl font-bold text-pink-400 mb-2">الفيديو التعليمي</h4>
              <p>لو الكتاب بيروي الحقيقة، الفيديو بيجسدها قدام عينك ويعيشك في الواقع. مفيش أحسن من إنك تشوف الحاجة بتتحرك قدامك.</p>
            </div>
            
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-600 hover:border-purple-500 transition-colors group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎠</div>
              <h4 className="text-xl font-bold text-purple-400 mb-2">الرسومات المتحركة</h4>
              <p>دي بتسهل المفاهيم الصعبة والمكلكعة، وبتخليك تفتكرها أسهل بكتير من مجرد نص أو محاضرة مملة 😂.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "الصور التعليمية 🖼️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl">الصور دي وسيلة قوية جداً لجذب الانتباه وإكساب المتعلم كفاءة تواصلية. هي تمثيل لواقع بتتصور بكاميرا وتتعرض رقمي.</p>
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
            <h4 className="text-cyan-400 font-bold mb-4">خصائصها إيه؟</h4>
            <ul className="grid md:grid-cols-2 gap-x-4 gap-y-3">
              <li className="flex items-center gap-2"><span className="text-cyan-500">✔</span> بتنقل الواقع زي ما هو بدقة.</li>
              <li className="flex items-center gap-2"><span className="text-cyan-500">✔</span> بتقرب المناظر البعيدة والأحداث التاريخية.</li>
              <li className="flex items-center gap-2"><span className="text-cyan-500">✔</span> بتركز على المهم وتتجاهل المشتتات.</li>
              <li className="flex items-center gap-2"><span className="text-cyan-500">✔</span> بتنقل المشاعر والانفعالات.</li>
              <li className="flex items-center gap-2 md:col-span-2 text-purple-300 bg-purple-900/20 p-2 rounded-lg mt-2">
                <span className="text-purple-500 font-bold">✨ الميزة الجامدة:</span> بتكبر الحاجات الصغيرة (زي الخلية) وتصغر الحاجات الكبيرة (زي الكواكب) عشان ندرسها بسهولة.
              </li>
              <li className="flex items-center gap-2"><span className="text-cyan-500">✔</span> متاحة ورخيصة وسهل أي حد ينتجها.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "ثالثاً: المحتوى الرقمي التعليمي المسموع 🎧",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl text-cyan-400 font-bold mb-6">للناس اللي بتحب تسمع وهي في المواصلات أو بتعمل حاجة تانية، الصوت هو الحل! 🎵</p>
          
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="bg-purple-500/20 p-4 rounded-full text-purple-400 text-3xl shrink-0">🎙️</div>
              <div>
                <h4 className="text-xl font-bold text-purple-300 mb-1">التدوين الصوتي (Podcast)</h4>
                <p>ده بيكون حوار بين مضيف وضيف محطوط بصيغة رقمية عشان تسمعه عالموبايل أو اللاب توب وتتعلم مهارات جديدة وإنت حاطط السماعات ومروق.</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="bg-cyan-500/20 p-4 rounded-full text-cyan-400 text-3xl shrink-0">📻</div>
              <div>
                <h4 className="text-xl font-bold text-cyan-300 mb-1">التسجيلات الصوتية</h4>
                <p>بتستخدم كلمات وموسيقى ومؤثرات عشان تأثر في إدراكك عن طريق السمع، زي المحاضرات والمناقشات الدرامية اللي بتشغل الخيال.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "مميزات الصوت وإزاي نستخدمه 🎶",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 p-6 rounded-2xl border-t-4 border-cyan-500">
              <h4 className="text-cyan-400 font-bold text-xl mb-4">المميزات ✨</h4>
              <ul className="space-y-2">
                <li>🔹 التكلفة قليلة والأجهزة متوفرة.</li>
                <li className="text-purple-300 font-bold">🔹 أساسية جداً في تعلم اللغات.</li>
                <li>🔹 فيها مصداقية في نقل الأخبار.</li>
                <li>🔹 بتوسع الخيال (زي قصص الأدب).</li>
                <li>🔹 بتنمي الخبرات للأماكن البعيدة.</li>
              </ul>
            </div>
            <div className="bg-slate-800/40 p-6 rounded-2xl border-t-4 border-pink-500">
              <h4 className="text-pink-400 font-bold text-xl mb-4">عشان نستخدمه صح 🛠️</h4>
              <ul className="space-y-2">
                <li>🔸 نختار البرنامج اللي يناسب المنهج.</li>
                <li>🔸 نهيأ المكان لاستقبال المتعلمين.</li>
                <li>🔸 نناقش الطلاب بعد ما يسمعوا البرنامج.</li>
                <li>🔸 نشجعهم على الاستماع الجيد.</li>
                <li>🔸 نسمع رأيهم في المادة المطروحة.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "فاصل إجباري 🛑😂",
      question: "إيه أكتر مجال بنعتمد فيه على (التسجيلات الصوتية) بشكل أساسي لا غنى عنه؟",
      options: [
        { text: "تعليم الرسم والرياضيات", correct: false },
        { text: "تعليم اللغات", correct: true }
      ]
    },
    {
      title: "رابعاً: المحتوى الرقمي التعليمي التفاعلي 🕹️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500 font-bold mb-6">
            هنا بقى بنشغل الدماغ صح! 🧠🔥
          </p>
          <p>المحتوى ده بيعتمد على ألعاب واختبارات عشان تفهم وتطبق وتبقى متحفز دايماً ومتحسش بملل.</p>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/20 blur-3xl rounded-full"></div>
            <h4 className="text-3xl font-bold text-green-400 mb-4 relative z-10">🎮 الألعاب التعليمية</h4>
            <p className="relative z-10">دي بتخلق بيئة متكاملة بتطور المهارات، وبتحفز التركيز والتفكير، وبتحسن التحصيل الدراسي.</p>
            <p className="mt-4 font-bold text-cyan-300 relative z-10 bg-slate-800/50 p-4 rounded-xl inline-block border border-slate-600">
              "باختصار هي أنشطة منظمة بتمزج التعلم بالترفيه وتخلق جو من التحدي"
            </p>
          </div>
        </div>
      )
    },
    {
      title: "ليه الألعاب التعليمية مهمة أوي؟ 🏆",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">دي من أحسن الوسائل التعليمية على الإطلاق، ليه بقى؟</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 flex gap-4 hover:bg-slate-800/80 transition">
              <div className="text-2xl">🤩</div>
              <p>مشوقة وجذابة جداً وفيها مؤثرات سمعية وبصرية بتشغل كذا حاسة.</p>
            </div>
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 flex gap-4 hover:bg-slate-800/80 transition">
              <div className="text-2xl">🚀</div>
              <p>بتزود الدافعية لأنها بتشبع الميل الفطري وغريزة اللعب عندنا.</p>
            </div>
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 flex gap-4 hover:bg-slate-800/80 transition">
              <div className="text-2xl">🧩</div>
              <p>بتحسن مهارات حل المشكلات وبتناسب كل الأعمار وممكن تتكرر للإتقان.</p>
            </div>
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 flex gap-4 hover:bg-slate-800/80 transition">
              <div className="text-2xl">🧪</div>
              <p>بتوفر مختبرات افتراضية نعمل فيها تجارب كيمياء بسلامة وأمان تام.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "عناصر ومعايير اللعبة التعليمية 🎲",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 p-6 rounded-3xl border border-cyan-500/30 mb-6">
            <h4 className="text-cyan-400 font-bold text-2xl mb-4 flex items-center gap-2"><span>1️⃣</span> عناصر اللعبة:</h4>
            <div className="flex flex-wrap gap-2">
              {['هدف تعليمي', 'قواعد لعب', 'منافسة', 'تحدي', 'خيال', 'ترفيه وتكيف', 'مثيرات', 'تغذية راجعة'].map((tag, i) => (
                <span key={i} className="bg-cyan-900/40 text-cyan-200 px-3 py-1 rounded-full text-sm border border-cyan-700">{tag}</span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 p-6 rounded-3xl border border-purple-500/30">
            <h4 className="text-purple-400 font-bold text-2xl mb-4 flex items-center gap-2"><span>2️⃣</span> معايير اختيارها وتصميمها:</h4>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> عنوان وأهداف واضحة</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> تعليمات وقواعد محددة</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> تراعي الفروق الفردية</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> جذب الانتباه والتشويق</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> سهولة الاستخدام والتفاعل</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> توفير المساعدة والدعم</li>
              <li className="flex items-center gap-2 sm:col-span-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> تحديد نظم الإبحار (خطي - هرمي - شبكي)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "اختبار النينجا 🥷",
      question: "من عناصر اللعبة الرقمية إنها توفر (تغذية راجعة - Feedback)، دي بتبقى إمتى بالظبط؟",
      options: [
        { text: "في بداية اللعبة خالص مع التعليمات.", correct: false },
        { text: "فوراً بعد استجابة الطالب كمكافأة أو تصحيح لمواصلة اللعب.", correct: true }
      ]
    },
    {
      title: "الاختبارات التعليمية الإلكترونية 📝💻",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p>عشان نقيمك، مفيش أسهل من الاختبارات الإلكترونية! دي وسيلة بتخلي المدرس يعمل امتحان يصحح نفسه فوراً بشفافية ومصداقية تامة.</p>
          <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-cyan-500 italic">
            "هي تقييم بكل مراحله (أسئلة، إجابات، تصحيح، رصد درجات) بيتم عن طريق الحاسب مع الحفاظ على السرية."
          </div>
          <h4 className="text-xl font-bold text-cyan-400 mt-6 mb-4">تصنيفاتها إيه؟</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <strong className="text-pink-400 block">🖥️ معتمدة عالكمبيوتر (CBA):</strong> بتشتغل من غير نت.
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <strong className="text-purple-400 block">🌐 معتمدة عالشبكات (NBA):</strong> أونلاين على النت.
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <strong className="text-emerald-400 block">🏛️ رسمية:</strong> زي الميدتيرم، بتبقى وقتها طويل ومن جهات رسمية (الوزارة).
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <strong className="text-amber-400 block">⏱️ قصيرة:</strong> كويزات سريعة نتيجتها بتطلع في لحظتها لتقييم جزء صغير.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "مميزات الاختبارات الإلكترونية 💯",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">الأبحاث بتقول إن مميزاتها خرافية، شوف كده:</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition">
              <div className="text-3xl">✨</div>
              <div><strong className="text-cyan-300">التفاعلية والوسائط:</strong> تجاوب سريع وتوظيف للفيديو والصور جوه الامتحان.</div>
            </li>
            <li className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition">
              <div className="text-3xl">💸</div>
              <div><strong className="text-green-300">سهلة وأقل تكلفة:</strong> بتتبني بسرعة ومفيهاش تكاليف طباعة وورق وتخزين.</div>
            </li>
            <li className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition">
              <div className="text-3xl">🔄</div>
              <div><strong className="text-purple-300">المرونة والتغذية الراجعة:</strong> تمتحن في أي مكان وبتعرف غلطاتك فوراً عشان تعالجها.</div>
            </li>
            <li className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition">
              <div className="text-3xl">📊</div>
              <div><strong className="text-pink-300">دقة البيانات:</strong> تصحيح آلي مفيش أخطاء بشرية، وبيانات متخزنة سهل نحللها للأبحاث وتطوير السياسات.</div>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "التطبيقات التعليمية (تطبيقات جوجل) 📱",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p>التطبيقات دي بتسهل عليك تبادل المعلومات والممارسة في أي وقت ومكان. وأشهرها طبعا <strong>تطبيقات جوجل العظيمة (Google Apps)</strong>.</p>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl border border-slate-700 mt-6 shadow-lg">
            <h4 className="text-2xl font-bold text-white mb-6">دي أدوات تعاونية سحابية. مميزاتها إيه؟</h4>
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400 shrink-0 self-start">🤝</div>
                <div><strong className="text-blue-300 text-xl block">التعاون والتشارك:</strong> بتعدلوا مع بعض في نفس الوقت على مستنداتكم وتتحكموا في مين يشارك براحتكم.</div>
              </div>
              <div className="flex gap-4">
                <div className="bg-red-500/20 p-3 rounded-xl text-red-400 shrink-0 self-start">⚡</div>
                <div><strong className="text-red-300 text-xl block">السرعة:</strong> بتنجز مهام بسرعة وكل المجموعة شايفة التعديلات فوراً من غير إيميلات ولا وجع دماغ.</div>
              </div>
              <div className="flex gap-4">
                <div className="bg-yellow-500/20 p-3 rounded-xl text-yellow-400 shrink-0 self-start">🎯</div>
                <div><strong className="text-yellow-300 text-xl block">سهولة الاستعمال:</strong> واجهتها حلوة ومبتاخدش مساحة وبحساب جوجل واحد تدخل لكل حاجة من أي جهاز.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "أهم تطبيقات جوجل المجانية (1) ☁️",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/60 p-6 rounded-3xl border border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Drive" className="w-8 h-8" />
                <h4 className="text-2xl font-bold text-white">Google Drive</h4>
              </div>
              <p>تخزين سحابي ومزامنة، تشارك ملفاتك ومجلداتك مع أي حد. ممكن تعمل تعليقات، وتفتح ملفات (زي الـ PDF والـ Office ومقاطع الفيديو) وتعدل فيها حتى لو معندكش البرنامج عاللاب.</p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-3xl border border-blue-400/30 hover:shadow-[0_0_20px_rgba(96,165,250,0.2)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg" alt="Docs" className="w-8 h-8" />
                <h4 className="text-2xl font-bold text-white">محرر المستندات</h4>
              </div>
              <p>للورد والنصوص. بتستورد ملفات الوورد، وتعدل وتنسق، وتعزم صحابك يعدلوا معاك وتدردشوا في نفس اللحظة. وتقدر كمان ترجع للنسخ القديمة وتحفظه بأكثر من صيغة وتترجمه.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "أهم تطبيقات جوجل المجانية (2) 📊",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-green-500/30">
              <h4 className="text-xl font-bold text-green-400 mb-2">📈 جداول البيانات (Spreadsheets)</h4>
              <p className="text-sm">زي الإكسيل بالظبط، لتحليل البيانات والمعادلات المتقدمة والمخططات.</p>
            </div>
            
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-yellow-500/30">
              <h4 className="text-xl font-bold text-yellow-400 mb-2">📽️ العروض التقديمية (Presentations)</h4>
              <p className="text-sm">عشان تعمل أحلى شرايح (Slides) وتحط فيها أنيميشن وفيديو وتنشرها عالويب براحتك.</p>
            </div>

            <div className="bg-slate-800/40 p-5 rounded-2xl border border-purple-500/30">
              <h4 className="text-xl font-bold text-purple-400 mb-2">📋 نماذج جوجل (Forms)</h4>
              <p className="text-sm">للاستبيانات والامتحانات. بتبعتها بالإيميل، وتتابعها على إكسيل، وتاخد ملخص بياني. وممكن تحطها جوه موقعك بـ iframe.</p>
            </div>

            <div className="bg-slate-800/40 p-5 rounded-2xl border border-red-500/30">
              <h4 className="text-xl font-bold text-red-400 mb-2">🎨 رسومات جوجل (Drawings)</h4>
              <p className="text-sm">عشان ترسم هياكل تنظيمية ومخططات بشكل تعاوني مع زمايلك وتنزلها كصورة.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'quiz',
      title: "سؤال المليون 💰",
      question: "أي تطبيق من تطبيقات جوجل بستخدمه عشان أعمل (استبيان أو امتحان إلكتروني) بطريقة احترافية؟",
      options: [
        { text: "Google Docs (المستندات)", correct: false },
        { text: "Google Forms (النماذج)", correct: true },
        { text: "Google Drive (درايف)", correct: false }
      ]
    },
    {
      title: "تطبيقات تعليمية تانية جامدة جداً 🔥",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4">بعيداً عن جوجل، في تطبيقات قلبت الدنيا في التعليم:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#58CC02]/20 to-transparent p-5 rounded-2xl border border-[#58CC02]/50">
              <h4 className="text-xl font-bold text-[#58CC02] mb-2 flex items-center gap-2">🦉 Duolingo</h4>
              <p className="text-sm">رقم واحد لتعلم اللغات، بالذات لينا كعرب لأن واجهته عربي بالكامل وبيعلمك إنجليزي وفرنساوي. ولو عايز لغات أكتر حول الواجهة إنجليزي.</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#4255FF]/20 to-transparent p-5 rounded-2xl border border-[#4255FF]/50">
              <h4 className="text-xl font-bold text-[#6a7aff] mb-2 flex items-center gap-2">🗂️ Quizlet</h4>
              <p className="text-sm">موقع بيركز عالتقييم عن طريق إنك تعمل بطاقات تعليمية (Flashcards) وتتعلم عن طريق اللعب.</p>
            </div>

            <div className="bg-gradient-to-br from-[#FFC800]/20 to-transparent p-5 rounded-2xl border border-[#FFC800]/50">
              <h4 className="text-xl font-bold text-[#FFC800] mb-2 flex items-center gap-2">🌼 MemRise</h4>
              <p className="text-sm">برضه للغات بس بطريقة ممتعة جداً بعيد عن ملل الكتب المدرسية التقليدية.</p>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-transparent p-5 rounded-2xl border border-white/30">
              <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">⚡ Brilliant</h4>
              <p className="text-sm">منصة خرافية قايمة على الألعاب لتعلم الرياضيات والعلوم والتكنولوجيا بطريقة إبداعية، ومبنية من خبراء في جوجل ومايكروسوفت.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "أخيراً: تقسيم المحتوى 📌",
      content: (
        <div className="space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="text-xl mb-4 text-cyan-400 font-bold">آخر حاجة معانا يا بطل، تقسيم المحتوى بنبصلو من زاويتين كمان:</p>
          
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 relative">
            <h4 className="text-2xl font-bold text-pink-400 mb-4 border-b border-slate-700 pb-2">ثانياً: حسب أسلوب التقديم 🎭</h4>
            <ul className="space-y-3">
              <li className="flex gap-2"><span className="text-pink-500">▪</span> <strong>المحتوى التقليدي:</strong> شرح وسرد ومحاضرات وكتب مدرسية (الطريقة القديمة).</li>
              <li className="flex gap-2"><span className="text-pink-500">▪</span> <strong>المحتوى النشط:</strong> بيخليك تشارك وتتفاعل زي الألعاب التعليمية والمحاكاة.</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 relative">
            <h4 className="text-2xl font-bold text-purple-400 mb-4 border-b border-slate-700 pb-2">ثالثاً: حسب المحتوى نفسه 📖</h4>
            <ul className="space-y-3">
              <li className="flex gap-2"><span className="text-purple-500">▪</span> <strong>تعليمي أكاديمي:</strong> خاص بالمناهج والكتب المدرسية.</li>
              <li className="flex gap-2"><span className="text-purple-500">▪</span> <strong>تعليمي مهني:</strong> خاص بالمهارات زي الدورات التدريبية والندوات (عشان سوق العمل).</li>
              <li className="flex gap-2"><span className="text-purple-500">▪</span> <strong>تعليمي ترفيهي:</strong> للترفيه والتثقيف مع بعض زي مقاطع الفيديو التعليمية والألعاب اللذيذة.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "النهاية السعيدة 🥳",
      content: (
        <div className="space-y-6 text-lg text-center flex flex-col items-center justify-center min-h-[350px] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent rounded-3xl pointer-events-none"></div>
          <div className="text-6xl mb-4 animate-bounce">🎓</div>
          <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            عاش جداً يا صاحبي! 💪
          </p>
          <p className="text-slate-400 text-xl max-w-lg">إنت كده خلصت ودرست الفصل الأول كله بدسامته من غير ما تسيب فتفوتة، وبقيت معلم في المحتوى الرقمي.</p>
          <p className="text-cyan-500 mt-2 font-bold animate-pulse">لو جاهز تقفل الدرس وتستلم الشهادة، دوس على الزرار اللي تحت! 👇</p>
          
          <button 
            onClick={handleFinish}
            className="mt-8 px-12 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-2xl font-bold rounded-2xl shadow-[0_0_30px_rgba(8,145,178,0.5)] hover:shadow-[0_0_50px_rgba(8,145,178,0.8)] transform transition-all hover:scale-105 active:scale-95 border border-cyan-400/50 z-10"
          >
            إنهاء الكورس 🏁
          </button>
        </div>
      )
    }
  ];

  const currentSlideData = slides[currentSlide];

  if (isFinished) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti effect background simple simulation */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0a0f1c] to-[#0a0f1c]"></div>
        
        <div className="bg-slate-800/60 backdrop-blur-xl p-12 rounded-3xl shadow-[0_0_50px_rgba(8,145,178,0.2)] text-center max-w-xl w-full border border-cyan-500/30 transform transition-all scale-100 relative z-10">
          <div className="text-7xl mb-6">🏆</div>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 drop-shadow-lg">ألف مبروك!</h2>
          <p className="text-2xl text-slate-300 mb-10 leading-relaxed">لقد أتممت دراسة الفصل الأول بنجاح وبقيت أستاذ ورئيس قسم في المحتوى الرقمي! 🚀</p>
          <button 
            onClick={() => {setIsFinished(false); setCurrentSlide(0); setQuizAnswers({}); setShowFeedback({});}}
            className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-cyan-400 rounded-xl font-bold text-xl hover:text-cyan-300 transition-all hover:shadow-[0_0_20px_rgba(8,145,178,0.3)]"
          >
            إعادة الدرس 🔄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#0B1121] text-slate-200 font-sans flex flex-col relative h-screen overflow-hidden selection:bg-cyan-500/30">
      
      {/* Luminova Background Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Exit Modal UI */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1121]/80 backdrop-blur-md p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8 max-w-sm w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <div className="text-6xl mb-4">🚪</div>
            <h3 className="text-2xl font-bold text-white mb-2">متأكد إنك عايز تخرج؟</h3>
            <p className="text-slate-400 mb-8">كل التقدم بتاعك في الدرس هيضيع في الفضاء المظلم يا بطل!</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={confirmExit}
                className="flex-1 py-3 bg-red-600/20 text-red-400 border border-red-500/50 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              >
                أيوه، اخرج
              </button>
              <button 
                onClick={cancelExit}
                className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-all"
              >
                لأ، كمل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header (Glassmorphism) */}
      <div className="flex justify-between items-center p-5 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 z-20 shrink-0 shadow-lg">
        <h1 className="text-lg md:text-2xl font-bold flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.4)]">
            <span className="text-xl text-white">💠</span>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 hidden sm:inline">إدارة التعلم - لومينوفا</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 sm:hidden">الفصل الأول</span>
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full flex items-center gap-2">
            <span className="text-cyan-400 font-bold">{currentSlide + 1}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{slides.length}</span>
          </div>
          <button 
            onClick={handleExitClick}
            className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 rounded-xl font-bold transition-all flex items-center gap-2 text-sm md:text-base hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            خروج 🚪
          </button>
        </div>
      </div>

      {/* Progress Bar (Top) */}
      <div className="absolute top-[72px] left-0 w-full h-1 bg-slate-800 z-30">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        ></div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 custom-scrollbar">
        <div className={`max-w-5xl mx-auto bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 md:p-12 min-h-[60vh] border border-slate-700/50 transition-opacity duration-500 ${animateSlide ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 border-b border-slate-700 pb-6 leading-tight tracking-wide drop-shadow-md">
            {currentSlideData.title}
          </h2>
          
          {currentSlideData.type === 'quiz' ? (
            <div className="bg-[#0B1121]/50 p-6 md:p-10 rounded-3xl border border-cyan-900/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 blur-2xl rounded-full"></div>
              <p className="text-2xl md:text-3xl font-bold mb-10 text-cyan-300 leading-relaxed relative z-10">{currentSlideData.question}</p>
              
              <div className="space-y-5 relative z-10">
                {currentSlideData.options.map((opt, idx) => {
                  const isAnswered = showFeedback[currentSlide];
                  const isThisSelectedAndCorrect = quizAnswers[currentSlide] === true && opt.correct;
                  const isThisSelectedAndWrong = quizAnswers[currentSlide] === false && !opt.correct;
                  
                  let btnClass = "w-full text-right p-6 rounded-2xl font-bold text-xl border-2 transition-all duration-300 focus:outline-none flex items-center justify-between group ";
                  if (!isAnswered) {
                    btnClass += "bg-slate-800/80 border-slate-600 hover:border-cyan-400 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer";
                  } else if (opt.correct) {
                    btnClass += "bg-emerald-900/40 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] transform scale-[1.02]";
                  } else if (isThisSelectedAndWrong) {
                    btnClass += "bg-rose-900/40 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]";
                  } else {
                    btnClass += "bg-slate-900/50 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed";
                  }

                  return (
                    <button 
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleQuizAnswer(currentSlide, opt.correct)}
                      className={btnClass}
                    >
                      <span>{opt.text}</span>
                      {!isAnswered && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">👈</span>}
                      {isAnswered && opt.correct && <span className="text-2xl">✅</span>}
                      {isAnswered && isThisSelectedAndWrong && <span className="text-2xl">❌</span>}
                    </button>
                  );
                })}
              </div>
              
              {showFeedback[currentSlide] && (
                <div className={`mt-8 p-6 rounded-2xl font-bold text-2xl text-center flex items-center justify-center gap-4 animate-fade-in-up border ${quizAnswers[currentSlide] ? 'bg-emerald-900/50 border-emerald-500/50 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-rose-900/50 border-rose-500/50 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]'}`}>
                  {quizAnswers[currentSlide] ? (
                    <><span>عاش جداً! إجابة صحيحة</span> <span className="text-3xl animate-bounce">🏆</span></>
                  ) : (
                    <><span>للأسف إجابة خاطئة! ركز أكتر المرة الجاية</span> <span className="text-3xl">😅</span></>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="relative z-10">
              {currentSlideData.content}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons - Modern Floating Glassmorphism */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-4 bg-slate-900/80 backdrop-blur-xl p-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-slate-700 w-[90%] max-w-md justify-between items-center">
        <button 
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
          className={`flex-1 py-3 px-6 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 ${currentSlide === slides.length - 1 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_15px_rgba(8,145,178,0.5)] hover:shadow-[0_0_25px_rgba(8,145,178,0.8)] active:scale-95'}`}
        >
          <span>التالي</span>
          <span className="text-xl leading-none">&larr;</span>
        </button>
        
        <div className="w-px h-8 bg-slate-700"></div>

        <button 
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className={`flex-1 py-3 px-6 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 ${currentSlide === 0 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600 hover:border-slate-500 active:scale-95'}`}
        >
          <span className="text-xl leading-none">&rarr;</span>
          <span>السابق</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0B1121;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #06b6d4;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}} />
    </div>
  );
}


```
