import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Camera, Palette, Maximize, Video, Layout, BrainCircuit, Target, CheckCircle2, AlertCircle } from 'lucide-react';

// مكون الأسئلة التفاعلية
const QuizQuestion = ({ question, options, correctAnswerIndex, explanation }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-white/10 mt-6 shadow-[0_0_20px_rgba(34,211,238,0.1)] w-full">
      <h3 className="text-lg sm:text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
        <BrainCircuit className="text-yellow-400 shrink-0" /> <span className="leading-tight">سؤال عالماشي شغل دماغك!</span>
      </h3>
      <p className="text-base sm:text-lg text-white mb-6 leading-relaxed">{question}</p>
      <div className="space-y-3">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            disabled={selected !== null}
            className={`w-full text-right p-3 sm:p-4 rounded-xl border transition-all duration-300 text-sm sm:text-base ${
              selected === null 
                ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-cyan-400' 
                : idx === correctAnswerIndex
                  ? 'bg-green-900/50 border-green-500 text-green-200'
                  : selected === idx
                    ? 'bg-red-900/50 border-red-500 text-red-200'
                    : 'bg-slate-800 border-slate-700 opacity-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className={`mt-6 p-4 rounded-xl border ${selected === correctAnswerIndex ? 'bg-green-950/50 border-green-500/50' : 'bg-red-950/50 border-red-500/50'}`}>
          <div className="flex items-start gap-3">
            {selected === correctAnswerIndex ? <CheckCircle2 className="text-green-400 shrink-0 mt-1" /> : <AlertCircle className="text-red-400 shrink-0 mt-1" />}
            <div>
              <p className={`font-bold ${selected === correctAnswerIndex ? 'text-green-400' : 'text-red-400'}`}>
                {selected === correctAnswerIndex ? 'عاش يا بطل! إجابة صحيحة' : 'للأسف غلط.. بس ولا يهمك نتعلم!'}
              </p>
              <p className="text-gray-300 mt-2 text-xs sm:text-sm leading-relaxed">{explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "يعني إيه صورة رقمية؟ 🖥️",
      icon: <Camera className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>
            أهلاً بيك في الفصل التاني! المرة دي هندخل جوه الكاميرا والكمبيوتر. العالم "أنج" (2008) عرف الصورة الرقمية ببساطة:
          </p>
          <div className="p-4 bg-cyan-950/40 rounded-xl border border-cyan-800/50 text-center">
             <p className="text-cyan-200 font-bold">"هي صورة بتتكون من نقط صغيرة جداً اسمها البكسل (Pixels)"</p>
          </div>
          <p>
            كل نقطة (بكسل) ليها عنوان أو إحداثيات (X, Y) عشان نحدد مكانها بالظبط (أفقي ورأسي). 
            ولأن الكمبيوتر مبيفهمش غير لغة الأرقام، كل بكسل بيتعبر عنه بـ <span className="text-yellow-400 font-bold">رقم ثنائي (0 و 1)</span> بيحدد مكان النقطة ودرجة اللون والإضاءة بتاعتها.
          </p>
          
          {/* محاكاة برمجية للبكسلات متجاوبة */}
          <div className="mt-6 flex flex-col items-center">
            <p className="text-sm text-gray-400 mb-2 text-center">لو عملنا زووم قوي على أي صورة، هنشوف المربعات دي (البكسلات):</p>
            <div className="w-full max-w-[250px] aspect-square grid grid-cols-5 gap-0.5 border border-white/20 p-1 bg-black">
              {[...Array(25)].map((_, i) => (
                <div key={i} className={`w-full h-full ${i%2 === 0 ? 'bg-cyan-500' : i%3===0 ? 'bg-blue-600' : 'bg-cyan-200'}`}></div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "مراحل إنتاج الصورة الرقمية 🎬",
      icon: <Video className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>عشان نطلع صورة رقمية نستخدمها في التعليم، بنمر بـ 3 مراحل أساسية:</p>
          <ul className="space-y-4 mt-4">
            <li className="bg-white/5 p-4 rounded-xl border-r-4 border-cyan-500">
              <strong className="text-cyan-300 text-lg sm:text-xl block mb-2">1. التقاط الصورة (بـ 3 طرق):</strong>
              <ul className="list-disc list-inside text-sm space-y-2 text-gray-300 pr-2 sm:pr-4">
                <li>نصور بكاميرا فيلم عادية (قديمة)، ونحمض الفيلم، وبعدين نعمله Scan (مسح ضوئي) ليتحول لبكسلات.</li>
                <li>نصور بكاميرا رقمية (Digital) ودي بتحول الضوء مباشرة لبكسلات.</li>
                <li>نصور فيديو بكاميرا (ويفضل رقمية)، وننقله للكمبيوتر، وناخد منه لقطات ثابتة (Screenshots) ببرامج المونتاج. (بس جودة الصورة هنا أقل شوية).</li>
              </ul>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 3,
      title: "تابع: مراحل إنتاج الصورة 💻",
      icon: <Video className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <ul className="space-y-4">
            <li className="bg-white/5 p-4 rounded-xl border-r-4 border-blue-500">
              <strong className="text-blue-300 text-lg sm:text-xl block mb-2">2. معالجة الصورة:</strong>
              <p className="text-sm text-gray-300">
                يا إما بنعدل الألوان والإضاءة جوه الكاميرا نفسها، يا إما ننقل الصورة للكمبيوتر (بصيغة زي Jpg أو Bitmap) ونعدلها ببرامج زي فوتوشوب (ودي بتدي خيارات أكتر بكتير وتظبط الجودة).
              </p>
            </li>
            <li className="bg-white/5 p-4 rounded-xl border-r-4 border-green-500">
              <strong className="text-green-300 text-lg sm:text-xl block mb-2">3. إخراج الصورة وتوظيفها:</strong>
              <p className="text-sm text-gray-300">
                بعد ما ظبطنا الصورة، نقدر نطبعها، نبعتها إيميل، نحطها في موقع ويب، كتاب إلكتروني، أو نخزنها على CD. الميزة إنها مبتفقدش جودتها!
              </p>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 4,
      title: "أنواع الصور الرقمية: الأبيض والأسود ⚪⚫",
      icon: <Palette className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>الصور الرقمية نوعين، أول نوع هو الأبيض والأسود (Grayscale).</p>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-gray-600">
            <p>
              الصورة هنا مش أبيض وأسود بس! دي بتتكون من تدرج رمادي بيبدأ من الأسود التام للأبيض الناصع. 
              عدد الدرجات دي بالظبط <strong className="text-yellow-400">256 درجة رمادي</strong>.
            </p>
            <p className="text-sm text-cyan-200 mt-2">
              بما إن عين الإنسان بتقدر تميز حوالي 200 درجة رمادي، فالصور دي بتبان واضحة جداً وعينينا بتشوف كل تفاصيلها.
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center w-full">
             <p className="text-xs text-gray-400 mb-2 text-center">التدرج الـ 256 من الأسود للأبيض (كل بكسل بياخد 8 بت أو 1 بايت بس في الذاكرة):</p>
             <div className="w-full h-12 rounded-lg bg-gradient-to-r from-black to-white border border-gray-500"></div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "أنواع الصور الرقمية: الملونة (RGB) 🔴🟢🔵",
      icon: <Palette className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>النوع التاني هو الصور الملونة، وهنا الشغل بيحلو!</p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>كل بكسل بيتعبر عنه بـ 3 أرقام للألوان الأساسية (أحمر Red، أخضر Green، أزرق Blue) ودي اسمها <strong className="text-cyan-300">الألوان الإضافية</strong> بتاعت الضوء.</li>
            <li><span className="text-gray-400 italic">عكس الألوان المطروحة بتاعت الدهانات والطباعة (سيان، ماجنتا، أصفر).</span></li>
            <li>كل لون من الـ 3 دول ليه 256 درجة!</li>
          </ul>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4 p-4 bg-white/5 rounded-xl border border-white/10 w-full">
            {/* دوائر متجاوبة */}
            <div className="relative w-32 h-32 shrink-0">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-red-500 rounded-full mix-blend-screen opacity-90"></div>
               <div className="absolute bottom-2 left-2 w-20 h-20 bg-green-500 rounded-full mix-blend-screen opacity-90"></div>
               <div className="absolute bottom-2 right-2 w-20 h-20 bg-blue-500 rounded-full mix-blend-screen opacity-90"></div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-yellow-400 font-bold text-xl">16.7 مليون لون!</p>
              <p className="text-sm mt-1">
                لما نضرب 256 (أحمر) × 256 (أخضر) × 256 (أزرق) = يدينا 16.7 مليون لون مختلف.
                عشان كدا البكسل الملون بياخد <strong className="text-cyan-300">3 بايت (24 بت)</strong> في الذاكرة.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "سؤال تفاعلي (1) 🎯",
      icon: <BrainCircuit className="text-cyan-400 w-8 h-8" />,
      content: (
        <QuizQuestion 
          question="بناءً على اللي فات.. لو عندك صورة أبيض وأسود، وصورة ملونة، والاتنين نفس الحجم والمقاس.. مساحة التخزين هتكون إزاي؟"
          options={[
            "الصورة الأبيض والأسود هتاخد مساحة أكبر.",
            "الاتنين هياخدوا نفس المساحة عشان نفس الحجم.",
            "الصورة الملونة هتاخد مساحة أكبر 3 مرات من الأبيض والأسود.",
            "الصورة الملونة هتاخد مساحة أكبر 24 مرة."
          ]}
          correctAnswerIndex={2}
          explanation="عاش! البكسل الأبيض والأسود بيتخزن في 1 بايت (8 بت)، بينما البكسل الملون محتاج 3 أرقام (أحمر، أخضر، أزرق) فبيتخزن في 3 بايت (24 بت). يعني الصورة الملونة تقيلة ومساحتها 3 أضعاف!"
        />
      )
    },
    {
      id: 7,
      title: "الأساسيات التربوية للصورة: 1 و 2 📚",
      icon: <Layout className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>
            الصورة بتتكون من بعدين (طول وعرض)، البعد التالت (العمق) المصور الشاطر هو اللي بيعمله! العالم جلبنز (2008) حط شوية اعتبارات لازم نفكر فيها قبل ما ندوس على زرار الكاميرا:
          </p>
          
          <div className="bg-slate-800/80 p-4 rounded-xl border-r-4 border-cyan-500 mb-4 mt-4">
            <h4 className="text-cyan-300 font-bold text-lg sm:text-xl mb-2">1. الهدف من التصوير</h4>
            <p className="text-sm">الهدف هو اللي بيخليك تاخد قرارات زي: الكادر إيه؟ الزاوية إيه؟ الإضاءة عاملة إزاي؟ (هل بتسجل ذكرى، ولا بتشرح نظرية علمية، ولا بورتريه لشخص؟)</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border-r-4 border-blue-500">
            <h4 className="text-blue-300 font-bold text-lg sm:text-xl mb-2">2. خصائص المتلقي</h4>
            <p className="text-sm">لازم تعرف مين اللي هيشوف الصورة (طفل، ولا طالب جامعة، ولا خبير؟) عشان تعرف هو هيقرأ عناصر الصورة إزاي ويفهمها ولا لأ.</p>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "الأساسيات التربوية للصورة: 3 و 4 📚",
      icon: <Layout className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <div className="bg-slate-800/80 p-4 rounded-xl border-r-4 border-green-500 mb-4">
            <h4 className="text-green-300 font-bold text-lg sm:text-xl mb-2">3. الموضوع المصور</h4>
            <p className="text-sm">بتصور موقف؟ حالة عاطفية؟ هنا لازم تحدد إيه "العنصر الأهم" وتحطه في دايرة الاهتمام، وإيه العناصر الفرعية، وإيه اللي <strong className="text-yellow-400">لازم تستبعده</strong> وتطلعه بره الكادر خالص عشان ميشتتش الطالب.</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border-r-4 border-purple-500">
            <h4 className="text-purple-300 font-bold text-lg sm:text-xl mb-2">4. نقل معنى أو مفهوم</h4>
            <p className="text-sm">العين بتتحد مع العقل وخبراتك القديمة. المصور الشاطر بيلتقط الزاوية والإضاءة اللي بتظهر تفاصيل إحنا كبشر ممكن منخدش بالنا منها بعنينا المجردة في الواقع!</p>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "الأساسيات التربوية للصورة: 5 ، 6 و 7 🎯",
      icon: <Layout className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-3 text-sm sm:text-base leading-relaxed text-gray-200">
          <div className="bg-white/5 p-4 rounded-lg">
             <strong className="text-cyan-300 text-base sm:text-lg block mb-1">5. نقطة الاتصال المرئي (التركيز):</strong>
             <p>دي النقطة اللي عينك هتروح عليها أول ما تبص. لو حطيت أكتر من نقطة تركيز ده هيدي "عمق" بس ممكن يشتت المتلقي! فخلي بالك من اختيار العدسة وعمق الميدان.</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
             <strong className="text-blue-300 text-base sm:text-lg block mb-1">6. إضاءة الموضوع:</strong>
             <p>من غير نور مفيش صورة! لو النور ضعيف، الكاميرا هتعوض ده وتخلي الصورة "مغبشة" (Noise). فكر: محتاج فلاش صناعي؟ محتاج حامل (Tripod) عشان الكاميرا متهتزش؟</p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
             <strong className="text-green-300 text-base sm:text-lg block mb-1">7. التكلفة الفعلية للصورة:</strong>
             <p>في الديجيتال، التكلفة مش فلوس تحميض! التكلفة هي "وقتك ومجهودك" في التفكير، التكوين، نقلها للكمبيوتر، وتعديلها. بس عشان الصورة بتوصل معاني يعجز عنها الكلام، فهي تستحق التعب.</p>
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: "الأسس الفنية للصورة: 1. الوحدة والهيمنة 👑",
      icon: <Target className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>إزاي نبني صورة فنية صح؟ أول أساس هو <strong className="text-cyan-300">الوحدة والهيمنة</strong>. وليه 3 اعتبارات:</p>
          <p><strong className="text-yellow-400">الاعتبار الأول: حجم العنصر بالنسبة للي حواليه.</strong></p>
          <p className="text-sm">كل ما حجم العنصر الرئيسي كبر، كل ما سيطرته زادت والتركيز عليه بقى أقوى. لو صغير في بيئة زحمة، هيتوه والمشاهد هيقعد يخمن فين البطل!</p>
          
          {/* محاكاة برمجية متجاوبة للحجم والهيمنة */}
          <div className="grid grid-cols-2 gap-4 mt-4 w-full">
             <div className="flex flex-col items-center w-full">
               <p className="text-xs text-gray-400 mb-1 text-center">عنصر مهمل</p>
               <div className="w-full aspect-video bg-slate-800 border border-slate-600 rounded flex justify-center items-center relative overflow-hidden">
                 {/* بيئة زحمة */}
                 <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="20" cy="30" r="5" fill="white"/>
                    <rect x="70" y="60" width="15" height="20" fill="gray"/>
                    <polygon points="10,80 30,80 20,60" fill="#bfdbfe"/>
                 </svg>
                 <div className="w-[10%] aspect-square bg-red-500 rounded-full z-10"></div>
               </div>
             </div>

             <div className="flex flex-col items-center w-full">
               <p className="text-xs text-gray-400 mb-1 text-center">عنصر مهيمن</p>
               <div className="w-full aspect-video bg-slate-800 border border-slate-600 rounded flex justify-center items-center relative">
                 <div className="w-[60%] aspect-square max-w-full max-h-full bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)] z-10"></div>
               </div>
             </div>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: "تابع الوحدة والهيمنة: الاكتمال والوضع 🔄",
      icon: <Target className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p><strong className="text-yellow-400">الاعتبار التاني: اكتمال الأشكال.</strong></p>
          <p className="text-sm mb-4">
            مينفعش تقطع حتة من وش حد وإنت بتصوره (زي إنك تقطع ذقنه أو عينه)، الصورة هتبقى قبيحة! الأفضل تصور الشخص كامل وتاخد جزء من الأوضة معاه.
          </p>

          <p><strong className="text-yellow-400">الاعتبار التالت: الوضع الأفقي ولا الرأسي للكاميرا؟</strong></p>
          <div className="flex justify-around items-end mt-4 w-full">
            <div className="flex flex-col items-center gap-2 w-[45%]">
              <div className="w-full aspect-video border-2 border-cyan-400 rounded-md flex justify-center items-center bg-cyan-900/20 relative">
                 <svg viewBox="0 0 100 100" className="w-1/3 h-full">
                    <circle cx="50" cy="40" r="20" fill="white" opacity="0.8"/>
                    <rect x="30" y="65" width="40" height="35" fill="white" opacity="0.8"/>
                 </svg>
              </div>
              <span className="text-xs sm:text-sm text-center">أفقي (لبيان الفراغ)</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 w-[30%]">
              <div className="w-full aspect-[9/16] border-2 border-blue-400 rounded-md flex justify-center items-center bg-blue-900/20 relative">
                 <svg viewBox="0 0 100 100" className="w-2/3 h-full">
                    <circle cx="50" cy="30" r="25" fill="white" opacity="0.8"/>
                    <rect x="15" y="60" width="70" height="50" fill="white" opacity="0.8" rx="10"/>
                 </svg>
              </div>
              <span className="text-xs sm:text-sm text-center">رأسي (للتركيز)</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 12,
      title: "الأسس الفنية: 2. استخدام الخطوط 〰️",
      icon: <Layout className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>الخطوط هي اللي بتحرك عين المتلقي جوه الصورة. وكل خط ليه تأثير نفسي:</p>
          <div className="grid grid-cols-2 gap-3 text-sm mt-4 w-full">
            <div className="bg-slate-800/80 p-3 rounded-lg text-center flex flex-col items-center justify-center aspect-video w-full">
              <div className="w-1/2 h-1 bg-cyan-400 mb-2"></div>
              <strong className="text-cyan-300 text-xs sm:text-sm">أفقية: هدوء، راحة</strong>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg text-center flex flex-col items-center justify-center aspect-video w-full">
              <div className="w-1 h-1/2 bg-red-400 mb-2"></div>
              <strong className="text-red-300 text-xs sm:text-sm">رأسية: قوة، شموخ</strong>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg text-center flex flex-col items-center justify-center aspect-video w-full">
              <div className="w-1/2 h-1 bg-yellow-400 mb-2 -rotate-45"></div>
              <strong className="text-yellow-300 text-xs sm:text-sm">مائلة: حركة، تغير</strong>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg text-center flex flex-col items-center justify-center aspect-video w-full">
              <svg viewBox="0 0 40 20" className="w-1/2 h-auto mb-2"><path d="M 0 10 Q 10 0 20 10 T 40 10" fill="none" stroke="#a855f7" strokeWidth="3"/></svg>
              <strong className="text-purple-300 text-xs sm:text-sm">منحنية: رقة، نعومة</strong>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 13,
      title: "الأسس الفنية: 3. نقطة التركيز البصرية 🎯",
      icon: <Target className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>
            أي صورة فيها "نقطة تركيز"، بنعملها إزاي؟ عن طريق (الألوان، الظل والنور، أو ترتيب الأشكال). 
            <strong className="text-yellow-400">ومش شرط أبداً تكون في النص!</strong>
          </p>
          <p className="text-sm">الألوان المشبعة القوية وحركة الخطوط بتقدر تغير نقطة التركيز وتشد عينك لأطراف الصورة.</p>

          {/* محاكاة لنقطة التركيز متجاوبة */}
          <div className="mt-4 flex justify-center w-full">
            <div className="w-full aspect-video bg-slate-800 rounded-xl border border-white/20 relative overflow-hidden">
               {/* عناصر رمادية باهتة متجاوبة */}
               <div className="absolute top-[10%] left-[10%] w-[15%] aspect-square bg-gray-500 rounded-full blur-[2px]"></div>
               <div className="absolute bottom-[10%] right-[30%] w-[20%] aspect-square bg-gray-600 rounded-md rotate-12 blur-[2px]"></div>
               <div className="absolute top-[40%] left-[50%] w-[12%] aspect-square bg-gray-400 rounded-full blur-[2px]"></div>
               
               {/* نقطة التركيز بلون مشبع على الطرف */}
               <div className="absolute bottom-[10%] left-[10%] w-[15%] aspect-square bg-red-500 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.8)] z-10 flex justify-center items-center animate-pulse">
               </div>
            </div>
          </div>
          <p className="text-xs text-center mt-2 text-gray-400">العنصر الأحمر على الطرف يمثل نقطة تركيز قوية تسحب العين فوراً.</p>
        </div>
      )
    },
    {
      id: 14,
      title: "سؤال تفاعلي (2) 🎯",
      icon: <BrainCircuit className="text-cyan-400 w-8 h-8" />,
      content: (
        <QuizQuestion 
          question="لو عايز تصور عمارة ضخمة أو رئيس شركة وعايز تدي إحساس للمشاهد بـ 'القوة والسلطة والشموخ'، هتركز على أي نوع من الخطوط في تكوين صورتك؟"
          options={[
            "الخطوط الأفقية (Horizontal).",
            "الخطوط الرأسية (Vertical).",
            "الخطوط المنحنية (Curved).",
            "الخطوط المتعرجة."
          ]}
          correctAnswerIndex={1}
          explanation="ممتاز! الخطوط الرأسية والعمودية دايماً بتدي إيحاء نفسي بالقوة والسلطة والوقار (زي العمدان الضخمة)، بينما الأفقية بتدي هدوء واتساع، والمنحنية بتدي رقة."
        />
      )
    },
    {
      id: 15,
      title: "الأسس الفنية: 4. الاتزان (Balance) ⚖️",
      icon: <Layout className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>
            الاتزان بيحصل لما نوزع "ثقل" العناصر (أحجامها، ألوانها، إضاءتها) بشكل مريح للعين. وليه أنواع:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center w-full flex flex-col items-center">
               <h4 className="text-cyan-300 font-bold mb-2 text-sm sm:text-base">1. الاتزان المحوري</h4>
               <p className="text-xs text-gray-400 mb-4">اليمين زي الشمال. متماثل وبيدي أمان.</p>
               <svg viewBox="0 0 100 50" className="w-3/4 h-auto">
                  <rect x="10" y="10" width="30" height="30" fill="#06b6d4" />
                  <line x1="50" y1="0" x2="50" y2="50" stroke="white" strokeWidth="2" strokeDasharray="4" opacity="0.3"/>
                  <rect x="60" y="10" width="30" height="30" fill="#06b6d4" />
               </svg>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center w-full flex flex-col items-center">
               <h4 className="text-yellow-300 font-bold mb-2 text-sm sm:text-base">2. الاتزان الوهمي</h4>
               <p className="text-xs text-gray-400 mb-4">عنصر كبير يُوزن بعناصر صغيرة. إبداعي.</p>
               <svg viewBox="0 0 100 50" className="w-3/4 h-auto">
                  <circle cx="25" cy="25" r="20" fill="#eab308" />
                  <line x1="50" y1="0" x2="50" y2="50" stroke="white" strokeWidth="2" strokeDasharray="4" opacity="0.3"/>
                  <rect x="65" y="5" width="15" height="15" fill="#f87171" />
                  <rect x="65" y="30" width="15" height="15" fill="#60a5fa" />
               </svg>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 16,
      title: "الأسس الفنية: 5 و 6. الحركة والإيقاع 🏃‍♂️🎶",
      icon: <Video className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p><strong className="text-cyan-300">5. الحركة:</strong> نقدر نعملها بطريقتين:</p>
          <ul className="list-disc list-inside text-sm text-gray-300 mb-4">
            <li>حركة طبيعية: نصور شخص بيجري، ونخلي الخلفية مموهة (Blur) وهو واضح، أو العكس!</li>
            <li>حركة بالترتيب: نرتب العناصر لتوحي بحركة العين (مسار).</li>
          </ul>

          <p><strong className="text-blue-300">6. الإيقاع والتكرار (Rhythm):</strong></p>
          <p className="text-sm text-gray-300 mb-2">تكرار منتظم لعنصر. وعشان منزهقش، بنكسر التكرار ده بحاجة مميزة.</p>
          
          {/* محاكاة متجاوبة للتكرار وكسر الملل بالـ SVG */}
          <div className="w-full h-auto bg-green-900/20 border-b-2 border-green-800 rounded-t-xl p-4 flex justify-center">
            <svg viewBox="0 0 200 50" className="w-full max-w-sm h-auto">
               {[...Array(7)].map((_, i) => (
                 <rect 
                   key={i} 
                   x={10 + i * 28} 
                   y={i === 4 ? 0 : 15} 
                   width="15" 
                   height={i === 4 ? 50 : 35} 
                   fill={i === 4 ? "#A0522D" : "#8B4513"} 
                   transform={i === 4 ? `rotate(10 120 25)` : ""}
                 />
               ))}
            </svg>
          </div>
          <p className="text-xs text-center mt-1 text-gray-400">عمود سور مختلف في الطول والزاوية بيكسر ملل التكرار.</p>
        </div>
      )
    },
    {
      id: 17,
      title: "الأسس الفنية: 7. اللون وخصائصه 🎨",
      icon: <Palette className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>
            اللون عنصر خطير! بنستخدمه عشان نعمل "انسجام" أو "تباين". أي لون بنوصفه بـ 3 حاجات:
          </p>
          <div className="space-y-3 mt-4 text-sm w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="flex gap-1 shrink-0"><div className="w-6 h-6 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div><div className="w-6 h-6 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div></div>
              <div><strong className="text-cyan-300">أصل اللون (Hue):</strong> اسم اللون نفسه (أحمر، أخضر، إلخ).</div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="w-full sm:w-16 h-4 bg-gradient-to-r from-blue-900 to-blue-200 rounded shrink-0"></div>
              <div><strong className="text-blue-300">قيمة اللون (Value):</strong> اللون فاتح ولا غامق؟ (درجة النصوع).</div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="w-full sm:w-16 h-4 bg-gradient-to-r from-gray-400 to-red-600 rounded shrink-0"></div>
              <div><strong className="text-red-300">شدة اللون (Saturation):</strong> اللون متشبع وصارخ، ولا مبهت ورمادي؟</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 18,
      title: "التركيبات اللونية (الانسجام) 🌈",
      icon: <Palette className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>إزاي نركب ألوان تليق على بعض وتعمل <strong className="text-cyan-400">انسجام وتوافق</strong>؟</p>
          
          <div className="bg-slate-800/80 p-4 rounded-xl mb-4 w-full">
            <h4 className="text-cyan-300 font-bold mb-2">1. أحادية اللون (Monochromatic)</h4>
            <p className="text-sm mb-2">لون واحد (مثلاً أزرق) وتلعب في درجته بالفاتح والغامق.</p>
            <div className="flex h-6 w-full rounded overflow-hidden">
               <div className="flex-1 bg-blue-900"></div><div className="flex-1 bg-blue-700"></div><div className="flex-1 bg-blue-500"></div><div className="flex-1 bg-blue-300"></div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl w-full">
            <h4 className="text-green-300 font-bold mb-2">2. الألوان المتقاربة (Analogous)</h4>
            <p className="text-sm mb-2">لونين جيران جنب بعض في دايرة الألوان (زي الأصفر والأخضر). بيدوا تناغم مريح جداً.</p>
            <div className="flex h-6 w-full rounded overflow-hidden">
               <div className="flex-1 bg-yellow-400"></div><div className="flex-1 bg-[#9ACD32]"></div><div className="flex-1 bg-green-500"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 19,
      title: "التركيبات اللونية (التباين والحرارة) 🔥❄️",
      icon: <Palette className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          
          <div className="bg-slate-800/80 p-4 rounded-xl mb-4 border-l-4 border-purple-500 w-full">
            <h4 className="text-purple-300 font-bold mb-2">3. الألوان المكملة (Complementary)</h4>
            <p className="text-sm mb-2">لونين عكس بعض تماماً في الدايرة (أخضر وبنفسجي، أو أصفر وأزرق). دول بيعملوا <strong className="text-white">تباين قوي جداً</strong>!</p>
            <div className="flex justify-center gap-2 h-8 w-full">
               <div className="w-1/4 max-w-[100px] h-full bg-yellow-400 rounded"></div><div className="w-1/4 max-w-[100px] h-full bg-purple-600 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="bg-red-900/30 p-3 rounded-xl border border-red-500/50 text-center">
              <h4 className="text-red-400 font-bold mb-1">🔥 ألوان دافئة</h4>
              <p className="text-xs text-red-200 mb-2">أصفر، أحمر، برتقالي.</p>
              <div className="h-4 w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded"></div>
            </div>
            <div className="bg-blue-900/30 p-3 rounded-xl border border-blue-500/50 text-center">
              <h4 className="text-blue-400 font-bold mb-1">❄️ ألوان باردة</h4>
              <p className="text-xs text-blue-200 mb-2">أزرق، بنفسجي، أخضر.</p>
              <div className="h-4 w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 20,
      title: "سؤال تفاعلي (3) 🎯",
      icon: <BrainCircuit className="text-cyan-400 w-8 h-8" />,
      content: (
        <QuizQuestion 
          question="لو عايز تخلي التصميم بتاعك صارخ وبيلفت الانتباه جداً، إيه التركيبة اللونية اللي تستخدمها عشان تحقق أعلى نسبة 'تباين' (Contrast)؟"
          options={[
            "ألوان متقاربة (زي الأزرق واللبني).",
            "ألوان أحادية اللون.",
            "ألوان مكملة (زي الأصفر قصاد الأزرق/البنفسجي).",
            "ألوان باردة كلها."
          ]}
          correctAnswerIndex={2}
          explanation="الله ينور! الألوان المكملة (اللي قصاد بعض في دايرة الألوان) بتعمل أعلى تباين ممكن، والأصفر بيبدو أكثر كثافة وإشراقاً لما يتحط جنب لونه المكمل البنفسجي أو الأزرق."
        />
      )
    },
    {
      id: 21,
      title: "الأسس الفنية: 8. المساحة الموجبة والسالبة ☯️",
      icon: <Layout className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>توازن الصورة بيعتمد على مساحتين:</p>
          <ul className="list-disc list-inside text-sm mb-4">
            <li><strong className="text-cyan-300">مساحة موجبة:</strong> دي الأشكال (العنصر نفسه).</li>
            <li><strong className="text-blue-300">مساحة سالبة:</strong> دي المساحة الفارغة (الخلفية).</li>
          </ul>
          
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10 w-full">
            <h4 className="font-bold text-yellow-400 mb-2">وظيفة المساحة السالبة:</h4>
            <p className="text-sm">بتعمل توازن، وبتخلق علاقة بين الشكل والبيئة. ممكن تكون على الأطراف، أو في النص كإطار.</p>
          </div>

          {/* محاكاة متجاوبة للمساحات بالـ SVG */}
          <div className="grid grid-cols-2 gap-4 mt-4 w-full">
            <div className="text-center w-full">
              <p className="text-xs text-gray-400 mb-1">مساحة سالبة ضيقة</p>
              <svg viewBox="0 0 100 100" className="w-full aspect-square max-w-[150px] mx-auto bg-red-800 rounded">
                 <circle cx="50" cy="50" r="45" fill="white" opacity="0.9" />
              </svg>
            </div>
            <div className="text-center w-full">
              <p className="text-xs text-gray-400 mb-1">مساحة سالبة مريحة</p>
              <svg viewBox="0 0 100 100" className="w-full aspect-square max-w-[150px] mx-auto bg-red-800 rounded">
                 <rect x="15" y="45" width="30" height="40" fill="white" opacity="0.9" rx="5" transform="rotate(15 30 65)" />
              </svg>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 22,
      title: "الأسس الفنية: 9. القطع الذهبي 📐",
      icon: <Layout className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>
            قاعدة <strong className="text-yellow-400">القطع الذهبي (قاعدة الأثلاث)</strong> بتقول: عشان تحط البطل في أفضل مكان يشد العين، متتوسطوش!
          </p>
          <p className="text-sm">
            اقسم الصورة 3 أثلاث بالطول و 3 بالعرض. حط العنصر الرئيسي على واحدة من نقط التقاطع.
          </p>

          {/* محاكاة متجاوبة لقاعدة الأثلاث بالـ SVG للحفاظ على النسبة بدقة */}
          <div className="flex flex-col items-center mt-6 w-full">
             <svg viewBox="0 0 161.8 100" className="w-full max-w-[400px] h-auto bg-slate-800 border-2 border-white/20 rounded">
                {/* خطوط الشبكة (الأثلاث) */}
                <line x1="0" y1="33.33" x2="161.8" y2="33.33" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <line x1="0" y1="66.66" x2="161.8" y2="66.66" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <line x1="53.93" y1="0" x2="53.93" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <line x1="107.86" y1="0" x2="107.86" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                
                {/* نقطة الجذب والعنصر الرئيسي */}
                <circle cx="53.93" cy="66.66" r="4" fill="#22d3ee" className="animate-pulse" />
                <rect x="43.93" y="46.66" width="20" height="53.34" fill="#164e63" stroke="#22d3ee" strokeWidth="1" rx="2" />
             </svg>
             <p className="text-xs text-gray-400 mt-2 text-center">المستطيل يمثل إطار الكاميرا (بنسبة قريبة للذهبية 1.618)، والعنصر موضوع على ثلث الشاشة.</p>
          </div>
        </div>
      )
    },
    {
      id: 23,
      title: "الأسس الفنية: 10. الرمزية 🎭",
      icon: <Target className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>
            المصور بيعبر عن معاني من غير كلام بـ <strong className="text-cyan-300">الرمزية</strong> (الألوان والزوايا).
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 w-full">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 w-full">
              <h4 className="font-bold text-yellow-400 mb-2">رمزية الألوان:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>🔴 الأحمر = امتلاك وانتماء</li>
                <li>⚫ الأسود = موت أو حداد</li>
                <li>⚪ الأبيض = زواج <span className="text-gray-500 text-xs">(في الهند للموت)</span></li>
              </ul>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 w-full">
              <h4 className="font-bold text-yellow-400 mb-2">رمزية الزوايا:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>⬆️ منخفضة (من تحت) = تدي سلطة وهيبة.</li>
                <li>⬇️ عليا (من فوق) = تدي إحساس بالضعف.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 24,
      title: "الأسس الفنية: 11 و 12 (الملمس والتأطير) 🌳",
      icon: <Layout className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <div className="bg-slate-800/80 p-4 rounded-xl border-l-4 border-cyan-500 mb-4 w-full">
            <h4 className="text-cyan-300 font-bold text-lg sm:text-xl mb-2">11. الإحساس باللمس (Texture)</h4>
            <p className="text-sm">
              ده بيحصل من تفاعل <strong className="text-yellow-400">الضوء والظل</strong> على السطح، فبيقولك إن السطح ده خشن أو ناعم في صورة مسطحة!
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border-l-4 border-blue-500 w-full">
            <h4 className="text-blue-300 font-bold text-lg sm:text-xl mb-2">12. التأطير (Framing)</h4>
            <p className="text-sm mb-2">
              إنك تلاقي حاجة (زي فروع شجر، نافذة) وتحطها كإطار حوالين الموضوع بتاعك. ده بيعزز العمق وبيحبس نقطة الاهتمام وميخليش العين تسرح.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 25,
      title: "الأسس الفنية: 13. التباين (Contrast) 🌓",
      icon: <Palette className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>التباين هو أهم أساس في التصميم لإبراز العناصر!</p>
          <ul className="list-disc list-inside text-sm space-y-1 mb-4 text-cyan-100">
            <li>تباين في المكان (قريب/بعيد).</li>
            <li>تباين في التفاصيل (حاد/مموه).</li>
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm w-full">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 w-full">
              <strong className="text-yellow-400 block mb-1">التباين في التون (Grayscale):</strong>
              <p className="text-xs text-gray-300">
                <span className="text-white">عالي:</span> أبيض وأسود صريح. <span className="text-gray-400">منخفض:</span> رمادي كتير (مرتبط بالتعريض).
              </p>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 w-full">
              <strong className="text-yellow-400 block mb-1">التباين اللوني والحجم:</strong>
              <p className="text-xs text-gray-300">
                <span className="text-red-400 font-bold">ملحوظة خطيرة:</span> عشان ينجح التباين اللوني، لازم لون ياخد مساحة كبيرة ولون مساحة صغيرة! لو المساحتين قد بعض، التركيز هيضيع.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 26,
      title: "أحجام اللقطات وزوايا التصوير 🎥",
      icon: <Video className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center text-lg leading-relaxed text-gray-200">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-cyan-900 to-blue-900 rounded-2xl flex items-center justify-center border border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] shrink-0">
            <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-300" />
          </div>
          <p className="max-w-md w-full">
            المخرج بيحقق الأسس اللي فاتت دي كلها عن طريق حاجتين:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
             <div className="flex-1 bg-cyan-950/50 p-4 rounded-xl border border-cyan-800 text-cyan-200 font-bold">1. حجم اللقطة</div>
             <div className="flex-1 bg-blue-950/50 p-4 rounded-xl border border-blue-800 text-blue-200 font-bold">2. زاوية التصوير</div>
          </div>
        </div>
      )
    },
    {
      id: 27,
      title: "أحجام اللقطات: 1 و 2 (بعيدة وعامة) 🧍‍♂️",
      icon: <Maximize className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p className="text-sm text-gray-300 mb-2">استخدمت رسومات متجاوبة لتوضيح نسبة حجم الشخص للكادر بدقة.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-white/10 w-full">
            {/* SVG متجاوب 100% للقطة البعيدة جداً */}
            <div className="w-full max-w-[120px] aspect-square shrink-0">
               <svg viewBox="0 0 100 100" className="w-full h-full bg-gray-800 border-2 border-gray-600">
                  <text x="5" y="10" fill="#9ca3af" fontSize="8">Extreme Long</text>
                  {/* ديكور/جبال */}
                  <polygon points="0,100 40,40 80,100" fill="#374151" />
                  <polygon points="50,100 80,50 100,100" fill="#4b5563" />
                  {/* شخص صغير جداً */}
                  <circle cx="50" cy="85" r="2" fill="#fde68a" />
                  <rect x="48" y="87" width="4" height="8" fill="#1e40af" />
                  <rect x="49" y="95" width="2" height="5" fill="#334155" />
               </svg>
            </div>
            <div className="text-center sm:text-right">
              <h4 className="text-cyan-300 font-bold mb-1 text-base sm:text-lg">1. اللقطة البعيدة (Extreme Long)</h4>
              <p className="text-xs sm:text-sm">الشخص صغير جداً. تُسمى "اللقطة التأسيسية" لاستعراض المكان، وتوحي بأن الشخصية <strong className="text-red-400">وحدانية أو ضائعة</strong>.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-white/10 mt-4 w-full">
            {/* SVG للقطة العامة */}
            <div className="w-full max-w-[120px] aspect-square shrink-0">
               <svg viewBox="0 0 100 100" className="w-full h-full bg-gray-800 border-2 border-gray-600">
                  <text x="5" y="10" fill="#9ca3af" fontSize="8">Long Shot</text>
                  <line x1="0" y1="90" x2="100" y2="90" stroke="#4b5563" strokeWidth="2" />
                  {/* شخص بكامل هيئته */}
                  <circle cx="50" cy="40" r="5" fill="#fde68a" />
                  <rect x="44" y="46" width="12" height="25" fill="#1e40af" rx="2" />
                  <rect x="45" y="71" width="4" height="19" fill="#334155" />
                  <rect x="51" y="71" width="4" height="19" fill="#334155" />
               </svg>
            </div>
            <div className="text-center sm:text-right">
              <h4 className="text-blue-300 font-bold mb-1 text-base sm:text-lg">2. اللقطة العامة (Long Shot)</h4>
              <p className="text-xs sm:text-sm">يظهر الشخص بكامل هيئته (من القدم للرأس) مع جزء من المكان. هنا يبدأ المشاهد بالانتباه لحركات جسم الممثل.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 28,
      title: "أحجام اللقطات: 3 و 4 (متوسطة وأمريكية) 🧍‍♂️",
      icon: <Maximize className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-white/10 w-full">
            {/* SVG للقطة الأمريكية (مقطوعة من الركبة) */}
            <div className="w-full max-w-[120px] aspect-square shrink-0">
               <svg viewBox="0 0 100 100" className="w-full h-full bg-gray-800 border-2 border-gray-600">
                  <text x="5" y="10" fill="#9ca3af" fontSize="8">American Shot</text>
                  <circle cx="50" cy="20" r="10" fill="#fde68a" />
                  <rect x="35" y="32" width="30" height="40" fill="#1e40af" rx="4" />
                  <rect x="37" y="72" width="10" height="30" fill="#334155" />
                  <rect x="53" y="72" width="10" height="30" fill="#334155" />
               </svg>
            </div>
            <div className="text-center sm:text-right">
              <h4 className="text-cyan-300 font-bold mb-1 text-base sm:text-lg">3. اللقطة العامة المتوسطة (American)</h4>
              <p className="text-xs sm:text-sm">من <strong className="text-yellow-400">الركبة (أو أسفلها بقليل)</strong> إلى الرأس. هي أول لقطة يقطع فيها إطار الكادر جزءاً من جسم الممثل الأساسي.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-white/10 mt-4 w-full">
            {/* SVG للقطة المتوسطة (مقطوعة من الخصر) */}
            <div className="w-full max-w-[120px] aspect-square shrink-0">
               <svg viewBox="0 0 100 100" className="w-full h-full bg-gray-800 border-2 border-gray-600">
                  <text x="5" y="10" fill="#9ca3af" fontSize="8">Medium Shot</text>
                  <circle cx="50" cy="25" r="15" fill="#fde68a" />
                  <rect x="30" y="42" width="40" height="60" fill="#1e40af" rx="5" />
               </svg>
            </div>
            <div className="text-center sm:text-right">
              <h4 className="text-blue-300 font-bold mb-1 text-base sm:text-lg">4. اللقطة المتوسطة (Medium)</h4>
              <p className="text-xs sm:text-sm">من <strong className="text-yellow-400">الخصر (الوسط)</strong> للرأس. تبرز تفاصيل أكثر مثل عمر الشخص ولون شعره ونوع ملابسه.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 29,
      title: "أحجام اللقطات: 5 و 6 (قريبة وشديدة القرب) 👁️",
      icon: <Maximize className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-white/10 w-full">
            {/* SVG للقطة القريبة */}
            <div className="w-full max-w-[120px] aspect-square shrink-0">
               <svg viewBox="0 0 100 100" className="w-full h-full bg-gray-800 border-2 border-gray-600">
                  <text x="5" y="10" fill="#9ca3af" fontSize="8">Close-Up</text>
                  <circle cx="50" cy="45" r="30" fill="#fde68a" />
                  <rect x="20" y="80" width="60" height="30" fill="#1e40af" rx="10" />
               </svg>
            </div>
            <div className="text-center sm:text-right">
              <h4 className="text-cyan-300 font-bold mb-1 text-base sm:text-lg">5. اللقطة القريبة (Close-Up)</h4>
              <p className="text-xs sm:text-sm">تقطع من أسفل الذقن/الأكتاف وتظهر الوجه بشكل أساسي. تُستخدم <strong className="text-yellow-400">للتأكيد</strong> على انفعالات الشخص بقوة.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-white/10 mt-4 w-full">
            {/* SVG للقطة شديدة القرب (عين) */}
            <div className="w-full max-w-[120px] aspect-square shrink-0">
               <svg viewBox="0 0 100 100" className="w-full h-full bg-fde68a border-2 border-gray-600" style={{backgroundColor: '#fde68a'}}>
                  <text x="5" y="10" fill="#9ca3af" fontSize="8">Extreme CU</text>
                  {/* رسم عين بسيطة لتملأ الكادر */}
                  <path d="M 10 50 Q 50 20 90 50 Q 50 80 10 50" fill="white" stroke="#92400e" strokeWidth="2" />
                  <circle cx="50" cy="50" r="15" fill="#3b82f6" />
                  <circle cx="50" cy="50" r="5" fill="black" />
               </svg>
            </div>
            <div className="text-center sm:text-right">
              <h4 className="text-blue-300 font-bold mb-1 text-base sm:text-lg">6. اللقطة شديدة القرب (Extreme Close-Up)</h4>
              <p className="text-xs sm:text-sm">تعزل جزءاً دقيقاً (عين، فم، إصبع) لتوضيح <strong className="text-red-400">أدق المشاعر والتوترات</strong> بتركيز شديد.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 30,
      title: "سؤال تفاعلي (4) 🎯",
      icon: <BrainCircuit className="text-cyan-400 w-8 h-8" />,
      content: (
        <QuizQuestion 
          question="في فيلم أكشن، البطل طلع مسدس من جيبه وعايزين نركز أوي على حركة صباعه على الزناد وهو بيترعش. المخرج المفروض يطلب أي لقطة من المصور؟"
          options={[
            "اللقطة العامة المتوسطة (American Shot).",
            "اللقطة القريبة (Close-Up).",
            "اللقطة شديدة القرب (Extreme Close-Up).",
            "اللقطة العامة (Long Shot)."
          ]}
          correctAnswerIndex={2}
          explanation="عظيم! اللقطة شديدة القرب (Extreme Close-Up) بتعزل حتة صغيرة جداً من الجسم (زي العين، أو هنا صباع الإيد) عشان تأكد وتبرز المشاعر والتوتر الدقيق جداً."
        />
      )
    },
    {
      id: 31,
      title: "زوايا التصوير: 1. الرأسية (Vertical) 📐",
      icon: <Camera className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>زاوية الكاميرا الرأسية. هنا استخدمت منظور SVG لتوضيح الفكرة بدقة وبدون تشوهات:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm text-center w-full">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-white/10 flex flex-col items-center w-full">
               <svg viewBox="0 0 100 100" className="w-1/2 max-w-[80px] h-auto mb-2">
                 <rect x="30" y="20" width="40" height="60" fill="#06b6d4" />
                 <line x1="10" y1="50" x2="90" y2="50" stroke="white" strokeWidth="2" strokeDasharray="4"/>
               </svg>
               <strong className="text-cyan-300">1. مستوى العين (Eye-level)</strong>
               <p className="text-xs text-gray-400 mt-1">الزاوية القياسية، ارتفاع <strong className="text-white">170 سم</strong> من الأرض (مستوى نظر عادي).</p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-white/10 flex flex-col items-center w-full">
               <svg viewBox="0 0 100 100" className="w-1/2 max-w-[80px] h-auto mb-2">
                 {/* منظور من أسفل: القاعدة عريضة والرأس يضيق */}
                 <polygon points="40,10 60,10 80,90 20,90" fill="#3b82f6" />
               </svg>
               <strong className="text-blue-300">2. زاوية منخفضة (Low-angle)</strong>
               <p className="text-xs text-gray-400 mt-1">الكاميرا تحت الممثل. يبدو كعملاق وليه سلطة وقوة.</p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-white/10 flex flex-col items-center w-full">
               <svg viewBox="0 0 100 100" className="w-1/2 max-w-[80px] h-auto mb-2">
                 {/* منظور من أعلى: الرأس عريض والقاعدة تضيق */}
                 <polygon points="20,10 80,10 60,90 40,90" fill="#ef4444" />
               </svg>
               <strong className="text-red-300">3. زاوية عليا (High-angle)</strong>
               <p className="text-xs text-gray-400 mt-1">الكاميرا فوق. بتقزم الشخص وتخليه ضعيف ومسلوب الإرادة.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 32,
      title: "زوايا التصوير: 2. الأفقية (Horizontal) 🔄",
      icon: <Camera className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>الزاوية الأفقية للتحكم في "العمق". (الرسومات توضح اتجاه نظر الكاميرا للرأس من أعلى):</p>
          
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-center w-full">
            <div className="bg-white/5 p-3 rounded-xl flex flex-col items-center">
               <strong className="text-gray-300 block mb-1">مواجهة (Full front)</strong>
               <svg viewBox="0 0 50 50" className="w-12 h-12 mb-1">
                 <circle cx="25" cy="25" r="20" fill="gray" />
                 <path d="M 15 20 Q 25 35 35 20" stroke="white" fill="none" strokeWidth="2"/> {/* يمثل الوجه */}
               </svg>
               <p className="text-xs">تسطح الصورة ويفضل تجنبها.</p>
            </div>
            
            <div className="bg-white/5 p-3 rounded-xl border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] flex flex-col items-center">
               <strong className="text-cyan-300 block mb-1">3/4 مواجهة (3/4 Front)</strong>
               <svg viewBox="0 0 50 50" className="w-12 h-12 mb-1">
                 <circle cx="25" cy="25" r="20" fill="#0369a1" />
                 <path d="M 5 20 Q 20 35 30 20" stroke="white" fill="none" strokeWidth="2"/>
               </svg>
               <p className="text-xs"><strong className="text-white">الأفضل!</strong> تظهر جانبين وتصنع عمقاً.</p>
            </div>

            <div className="bg-white/5 p-3 rounded-xl flex flex-col items-center">
               <strong className="text-gray-300 block mb-1">جانبية (Side angle)</strong>
               <svg viewBox="0 0 50 50" className="w-12 h-12 mb-1">
                 <circle cx="25" cy="25" r="20" fill="gray" />
                 <path d="M -5 25 Q 10 25 10 10" stroke="white" fill="none" strokeWidth="2"/>
               </svg>
               <p className="text-xs">تسطح الصورة وتفصل المتفرج عاطفياً.</p>
            </div>

            <div className="bg-white/5 p-3 rounded-xl flex flex-col items-center">
               <strong className="text-gray-300 block mb-1">خلفية (Full rear)</strong>
               <svg viewBox="0 0 50 50" className="w-12 h-12 mb-1">
                 <circle cx="25" cy="25" r="20" fill="#1f2937" />
                 {/* لا يوجد وجه مرسوم */}
               </svg>
               <p className="text-xs">تظهر الجانب الخلفي تماماً للشخص.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 33,
      title: "زوايا التصوير: 3. الكاميرا المنحرفة 📐",
      icon: <Camera className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-200">
          <p>
            النوع الأخير هو <strong className="text-yellow-400">الزاوية المنحرفة (Oblique / Dutch Angle)</strong>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-6 bg-slate-900/50 p-6 rounded-2xl border border-white/10 w-full">
            {/* SVG متجاوب يعبر عن الكادر المائل بدون استخدام CSS Transform الخارجي لضمان ثبات التجاوب */}
            <div className="w-full max-w-[200px] aspect-video shrink-0">
               <svg viewBox="0 0 100 60" className="w-full h-full overflow-visible">
                 <g transform="rotate(-15 50 30)">
                   <rect x="0" y="0" width="100" height="60" fill="#1e293b" stroke="#22d3ee" strokeWidth="3" />
                   <circle cx="30" cy="25" r="10" fill="#facc15" />
                   <rect x="25" y="35" width="10" height="25" fill="#3b82f6" />
                 </g>
               </svg>
            </div>
            
            <div className="flex-1 space-y-2 text-center sm:text-right mt-4 sm:mt-0">
              <p className="text-sm text-cyan-200">هنا الكاميرا نفسها مائلة! فالأشياء تظهر مائلة داخل الكادر.</p>
              <p className="text-sm">
                المشاهد يشعر بعدم الاتزان، لذا يستخدمها المخرج للتعبير عن <strong className="text-red-400">حالة غير طبيعية</strong> للشخصية (ارتباك، سُكر، خطر، جنون).
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 34,
      title: "سؤال تفاعلي (5) والأخير! 🎯",
      icon: <BrainCircuit className="text-cyan-400 w-8 h-8" />,
      content: (
        <QuizQuestion 
          question="عايزين نظهر البطل في صورة البوستر كأنه 'أسطورة' وليه هيبة وسلطة تخوف المشاهد.. الكاميرا تترص إزاي؟"
          options={[
            "كاميرا في مستوى العين (Eye-level) وزاوية مواجهة.",
            "زاوية عليا (High-angle) عشان نجيب تفاصيله كلها من فوق.",
            "زاوية منخفضة (Low-angle) مع وضع 3/4 مواجهة.",
            "زاوية منحرفة (Oblique) عشان نشد الانتباه."
          ]}
          correctAnswerIndex={2}
          explanation="عظمة! الزاوية المنخفضة (من تحت لفوق) بتخلي الشخص عملاق وليه سلطة وهيبة. والـ 3/4 مواجهة بتدي عمق للصورة وتكوين قوي أحسن من المواجهة المسطحة."
        />
      )
    },
    {
      id: 35,
      title: "ختام الفصل التاني 🎉",
      icon: <CheckCircle2 className="text-green-400 w-8 h-8" />,
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center text-base sm:text-lg leading-relaxed text-gray-200 mt-4 w-full">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.6)] animate-pulse shrink-0">
            <span className="text-4xl sm:text-5xl">🎓</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            تمت المهمة يا هندسة!
          </h3>
          <p className="max-w-md text-sm text-gray-300">
            فصصنا الفصل التاني بالكامل: البكسلات والـ RGB، الأسس التربوية والفنية لتصميم الصورة، وأخيراً أحجام اللقطات وزوايا التصوير بدقة هندسية متجاوبة. 
            أنت كدا جاهز تبقى مخرج ومصمم محترف!
          </p>
          <button 
            onClick={() => setCurrentSlide(0)}
            className="px-6 py-2 sm:px-8 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all text-cyan-300 font-bold mt-4 shadow-[0_0_15px_rgba(255,255,255,0.1)] text-sm sm:text-base"
          >
            إعادة الدرس من البداية 🔄
          </button>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617] text-slate-100 font-sans overflow-x-hidden relative selection:bg-cyan-500 selection:text-white flex flex-col">
      
      {/* Background Glows (Luminova Vibe) */}
      <div className="fixed top-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-cyan-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-blue-700 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>

      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center p-3 sm:p-4 lg:px-8">
        <button className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <X size={16} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline font-semibold">خروج</span>
        </button>

        <div className="flex-1 max-w-2xl mx-2 sm:mx-8 flex items-center gap-2 sm:gap-4">
          <span className="text-[10px] sm:text-xs text-cyan-400 font-bold whitespace-nowrap bg-cyan-950/50 px-2 py-1 rounded-md border border-cyan-800/50 shadow-inner">
            {currentSlide + 1} / {slides.length}
          </span>
          <div className="w-full h-1.5 sm:h-2.5 bg-slate-800/80 rounded-full overflow-hidden shadow-inner border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 right-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>

        <h1 className="text-xs sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 truncate max-w-[80px] sm:max-w-[200px]">
          الأسس التصميمية
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-28 sm:pt-28 sm:pb-32 px-4 sm:px-6 md:px-8 w-full max-w-4xl mx-auto flex flex-col justify-start sm:justify-center relative z-10 min-h-screen">
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] transition-all duration-300 relative overflow-y-auto max-h-[85vh] sm:max-h-[80vh] scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent w-full">
          
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-2xl sm:rounded-3xl"></div>
          
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 border-b border-white/10 pb-3 sm:pb-4 relative z-10">
            <div className="p-1.5 sm:p-2 bg-slate-800 rounded-xl shadow-inner border border-white/5 shrink-0">
              {slides[currentSlide].icon}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white drop-shadow-[0_2px_15px_rgba(34,211,238,0.3)] leading-snug">
              {slides[currentSlide].title}
            </h2>
          </div>
          
          <div className="relative z-10 w-full">
             {slides[currentSlide].content}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 w-full z-50 p-3 sm:p-4 lg:px-8 flex justify-between items-center bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent pb-4 sm:pb-6">
        
        <button 
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="flex items-center gap-1 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3.5 bg-cyan-500/20 text-cyan-300 rounded-xl hover:bg-cyan-500/30 transition-all border border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] disabled:opacity-20 disabled:shadow-none"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
          <span className="font-bold text-sm sm:text-lg">التالي</span>
        </button>

        <button 
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="flex items-center gap-1 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3.5 bg-slate-800/80 backdrop-blur text-gray-300 rounded-xl hover:bg-slate-700 transition-all border border-slate-600 disabled:opacity-20 shadow-lg"
        >
          <span className="font-bold text-sm sm:text-lg">السابق</span>
          <ChevronRight size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
        </button>

      </footer>

      {/* Styles for custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </div>
  );
}