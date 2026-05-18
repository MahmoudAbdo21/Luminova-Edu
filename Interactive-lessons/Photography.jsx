import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, Eye, BrainCircuit, LayoutGrid, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // تم تحويل محتوى الـ PDF بالكامل إلى 20 شريحة مفصلة مع تصميم أشكال توضيحية بالكود
  const slides = [
    {
      id: 1,
      title: "مقدمة: ليه الصورة ليها سحر خاص؟ 📸",
      icon: <ImageIcon className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            أهلاً بيك يا بطل في <span className="text-cyan-400 font-bold">لومينوفا</span>! جاهز نفصص عالم التصوير والإدراك البصري؟
          </p>
          <p>
            تخيل معايا إننا بنتعلم من غير صور؟ الموضوع هيكون جاف وممل جداً. الصورة التعليمية (سواء فوتوغرافية، فيلم، أو فيديو) مش مجرد زينة، دي بتنقل لك <span className="text-blue-300 font-semibold">الحقائق العلمية</span> في شكل بصري وسمعي يخليك تقارن وتتأمل براحتك.
          </p>
          <div className="bg-cyan-950/40 p-4 rounded-xl border border-cyan-800/50 mt-4">
            <h4 className="text-cyan-300 font-bold mb-2">إيه السر في الصورة؟</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-cyan-100">
              <li>بتدي فرصة للناس اللي القراءة المباشرة صعبة عليهم إنهم يفهموا ويستنتجوا.</li>
              <li>عنصر تشويق رهيب بيبسط المعلومات المعقدة.</li>
              <li><span className="text-yellow-400">بتعمل "ريفريش" لدماغك:</span> وأنت بتبص للصورة، عقلك بيستدعي المعلومات القديمة المخزنة ويقارنها بالجديد!</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "قوة الصورة في التعليم 🚀",
      icon: <BrainCircuit className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            الصورة بتنمي قدراتك العقلية زي الإبداع، الإدراك، والتذكر على المدى البعيد. بس عشان ده يحصل، لازم نراعي حجات معينة زي:
            <span className="text-cyan-300 block mt-2 text-base"> (زمن العرض، توظيف الألوان، علاقة الشكل بالخلفية، وعدد العناصر).</span>
          </p>
          <p className="mt-4 font-semibold text-blue-300 border-b border-blue-900 pb-2">دراسات "بافيو" (1975) و"ويليامز" (1995) وغيرهم أثبتوا فوايد الصورة في النقط دي:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
            <div className="bg-white/5 p-3 rounded-lg border-r-4 border-cyan-500">
              <span className="font-bold text-cyan-300">1. جذب الانتباه:</span> بتشد اهتمامك للمادة العلمية.
            </div>
            <div className="bg-white/5 p-3 rounded-lg border-r-4 border-cyan-500">
              <span className="font-bold text-cyan-300">2. الفهم والتخزين:</span> بتسهل حفظ الكلام النظري لأنها بتدمج النص مع الصورة.
            </div>
            <div className="bg-white/5 p-3 rounded-lg border-r-4 border-cyan-500">
              <span className="font-bold text-cyan-300">3. تبسيط المعقد:</span> بتشرح النظريات اللي صعب تتشرح بالكلام بس.
            </div>
            <div className="bg-white/5 p-3 rounded-lg border-r-4 border-cyan-500">
              <span className="font-bold text-cyan-300">4. كفاءة التعلم:</span> التمثيلات البصرية بتتفهم أسرع بكتير من التمثيلات اللفظية.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "تابع: فوايد الصورة التعليمية 🌟",
      icon: <CheckCircle2 className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <span className="bg-blue-600/30 text-blue-300 p-2 rounded-lg mt-1">📸</span>
              <p><strong>الترتيب المتسلسل:</strong> لما نرتب الصور ورا بعض، ده بيساعدك تتتبع الفكرة وتفهم الموضوع من طقطق لسلامو عليكو.</p>
            </li>
            <li className="flex gap-3 items-start">
              <span className="bg-cyan-600/30 text-cyan-300 p-2 rounded-lg mt-1">🎯</span>
              <p><strong>مراعاة الفروق الفردية:</strong> الصورة بتسند جداً مع المتعلمين اللي عندهم ضعف في القراءة، وبتعلي استيعابهم.</p>
            </li>
            <li className="flex gap-3 items-start">
              <span className="bg-blue-600/30 text-blue-300 p-2 rounded-lg mt-1">🗣️</span>
              <p><strong>التفكير النقدي:</strong> كل واحد فينا ممكن يشوف الصورة ويوصفها ويحللها من وجهة نظره، وده بيشغل الدماغ!</p>
            </li>
          </ul>
          <div className="text-center mt-6 p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl border border-white/10 shadow-lg">
            <p className="text-cyan-200 font-bold">الخلاصة: الصور بتناسب كل أحداث التعلم، من أول "استثارة الدافعية" لحد "التقويم والامتحان"!</p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "يعني إيه إدراك بصري؟ 👁️🧠",
      icon: <Eye className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            عشان نفهم دور الصورة، لازم نفهم <span className="text-cyan-400 font-bold">"الإدراك البصري"</span>.
          </p>
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-600 text-center">
            <p className="italic text-xl">
              "هو العملية اللي بنتعرف بيها على بيئتنا من خلال المعلومات البصرية اللي بتتنقل من العين، عشان المخ يفسرها ويفهمها."
            </p>
          </div>
          <p>
            خد دي مفاجأة: إحنا في الحقيقة <span className="text-yellow-400 font-bold">مش بنشوف الأشياء المادية نفسها!</span> إحنا بنشوف الضوء اللي بينعكس منها ويسقط على عينينا.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            الضوء ده بيدخل من حتة اسمها "القزحية" وبينعكس على نقطة صغيرة في الشبكية اسمها "النقرة". تعال الشريحة الجاية أوريك إيه اللي بيحصل جوه!
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: "جيش المستقبلات جوه عينك ⚔️",
      icon: <Eye className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>الشبكية بتاعتك فيها ملايين المستقبلات الضوئية، مقسومة لفريقين أساسيين:</p>
          
          <div className="flex flex-col gap-4 mt-4">
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-700 rounded-full flex items-center justify-center border-2 border-gray-500 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                ⚫⚪
              </div>
              <div>
                <h4 className="text-gray-300 font-bold text-xl">1. القضبان (Rods)</h4>
                <p className="text-sm text-gray-400">دي العساكر المسئولة عن الإضاءة الضعيفة (الضلمة). بتشوف الدنيا أبيض وأسود بس.</p>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-cyan-800 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                🔴🟢🔵
              </div>
              <div>
                <h4 className="text-cyan-300 font-bold text-xl">2. المخاريط (Cones)</h4>
                <p className="text-sm text-gray-400">دي القوات الخاصة بتاعت الإضاءة الساطعة والألوان. متقسمين 3 أنواع (أزرق، أخضر، أحمر) عشان يلقطوا الطيف اللوني كله.</p>
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-cyan-200 text-center">
            *المستقبلات دي بتترجم الضوء لكهربا، تمشي في العصب البصري للمخ، وهناك المخ بيعالج المعلومات دي في الذاكرة!*
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: "مدرسة الجشتالت (ألمانيا 1920) 🇩🇪",
      icon: <BrainCircuit className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            في علم النفس، طلع 3 علماء ألمان (ماكس فيرتهايمر، كورت كوفكا، وولفجانج كوهلر) وعملوا مدرسة اسمها <span className="text-cyan-400 font-bold">"الجشتالت"</span>.
          </p>
          <p>الناس دي حطت قواعد بتفسر "إحنا إزاي بنشوف وننظم الأشكال". أفكارهم أثرت في الفن، العمارة، وحتى تصميم الويب!</p>
          
          <div className="bg-blue-900/30 p-6 rounded-2xl border border-blue-500/50 mt-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
            <h3 className="text-2xl font-extrabold text-blue-300 mb-2">القاعدة الذهبية للجشتالت:</h3>
            <p className="text-3xl text-white font-black drop-shadow-lg">"الكل أكبر من مجموع أجزائه"</p>
            <ul className="mt-4 space-y-2 text-sm text-blue-100 list-disc list-inside">
              <li>يعني إنت بتقرأ الكلمة كاملة، مش بتبص لكل حرف لوحده.</li>
              <li>إدراك الشكل الكلي بيسبق إدراك التفاصيل والأجزاء.</li>
              <li>وظيفة أي جزء بتتغير حسب "الكل" اللي هو موجود فيه.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "قوانين الجشتالت: 1. مبدأ التقارب 🎯",
      icon: <LayoutGrid className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            أول مبدأ هو <span className="text-cyan-400 font-bold">التقارب (Proximity)</span>. 
            المبدأ ده بيقول إن الفرد بيميل إنه يجمع المحفزات البصرية القريبة من بعضها ويشوفها كأنها "مجموعة" واحدة.
          </p>
          
          {/* تصميم يوضح التقارب برمجياً بدون صور خارجية */}
          <div className="flex flex-col items-center justify-center bg-slate-900/50 p-8 rounded-xl border border-white/10 mt-6 h-48">
            <p className="text-sm text-gray-400 mb-4">عينك هتشوف دول كأنهم 3 مجموعات منفصلة (أزواج) مش 6 دوائر عشوائية:</p>
            
            <div className="flex gap-12">
              {/* المجموعة الأولى */}
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]"></div>
                <div className="w-8 h-8 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]"></div>
              </div>
              {/* المجموعة الثانية */}
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]"></div>
                <div className="w-8 h-8 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]"></div>
              </div>
              {/* المجموعة الثالثة */}
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]"></div>
                <div className="w-8 h-8 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]"></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "قوانين الجشتالت: 2. مبدأ التشابه 🔣",
      icon: <LayoutGrid className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            تاني مبدأ هو <span className="text-cyan-400 font-bold">التشابه (Similarity)</span>.
            بنميل نجمع العناصر اللي شبه بعض (في اللون، الشكل، أو الحجم) في شكل منتظم.
          </p>
          
          {/* تصميم يوضح التشابه برمجياً */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-900/50 p-4 rounded-xl flex flex-col items-center border border-white/5">
               <p className="text-xs text-gray-400 mb-2">هنا هتشوفهم "أعمدة" بسبب اللون:</p>
               <div className="grid grid-cols-3 gap-2">
                 {[...Array(9)].map((_, i) => (
                   <div key={`col-${i}`} className={`w-6 h-6 rounded ${i % 3 === 1 ? 'bg-blue-500' : 'bg-cyan-400'}`}></div>
                 ))}
               </div>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl flex flex-col items-center border border-white/5">
               <p className="text-xs text-gray-400 mb-2">هنا هتشوفهم "صفوف" بسبب الشكل:</p>
               <div className="grid grid-cols-3 gap-2">
                 {[...Array(9)].map((_, i) => (
                   <div key={`row-${i}`} className={`w-6 h-6 ${Math.floor(i / 3) === 1 ? 'bg-cyan-400 rounded-full' : 'bg-cyan-400 rounded-sm'}`}></div>
                 ))}
               </div>
            </div>
          </div>
          <p className="text-sm text-center mt-2 text-cyan-200">مخك بيعمل النمط ده تلقائي عشان يسهل على نفسه فهم الصورة!</p>
        </div>
      )
    },
    {
      id: 9,
      title: "قوانين الجشتالت: 3. مبدأ الاستمرارية 〰️",
      icon: <LayoutGrid className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            تالت مبدأ هو <span className="text-cyan-400 font-bold">الاستمرارية (Continuity)</span>.
            عيننا بتحب تمشي مع الخط المكمل في اتجاه واحد (سواء مستقيم أو منحنى)، ومابتحبش التقطيع والتكسير.
          </p>
          
          {/* تصميم يوضح الاستمرارية برمجياً بالـ SVG */}
          <div className="flex flex-col items-center justify-center bg-slate-900/50 p-6 rounded-xl border border-white/10 mt-4 relative">
             <p className="text-sm text-gray-400 mb-4 text-center">إنت بتشوف خط مستقيم (A لـ B) متقاطع مع منحنى (C لـ D)، مش بتشوفهم 4 قطع متكسرين!</p>
             <svg width="200" height="100" viewBox="0 0 200 100" className="overflow-visible">
                {/* الخط المستقيم */}
                <line x1="10" y1="50" x2="190" y2="50" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <text x="0" y="45" fill="#fff" fontSize="14" fontWeight="bold">A</text>
                <text x="190" y="45" fill="#fff" fontSize="14" fontWeight="bold">B</text>
                
                {/* الخط المنحنى */}
                <path d="M 40 10 Q 100 90 160 10" fill="transparent" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <text x="30" y="15" fill="#fff" fontSize="14" fontWeight="bold">C</text>
                <text x="165" y="15" fill="#fff" fontSize="14" fontWeight="bold">D</text>
             </svg>
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: "قوانين الجشتالت: 4. الوحدة والترابط 🔗",
      icon: <LayoutGrid className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            رابع مبدأ: <span className="text-cyan-400 font-bold">الوحدة والترابط (Connectedness)</span>.
            لو في عناصر متوصلة ببعض (بخط مثلاً)، بنشوفها كوحدة واحدة. والمفاجأة إن المبدأ ده <strong className="text-yellow-400">بيكسب وبيتفوق</strong> على مبدأ التقارب والتشابه!
          </p>
          
          <div className="flex flex-col items-center bg-slate-900/50 p-6 rounded-xl border border-white/10 mt-4">
             <p className="text-sm text-gray-400 mb-6 text-center">رغم إن الدوائر دي متوزعة بألوان ومسافات مختلفة، الخط اللي رابطهم خلاك تشوف كل اتنين كأنهم كيان واحد.</p>
             
             <div className="flex gap-8">
                {/* زوج 1 */}
                <div className="relative flex items-center justify-between w-24">
                   <div className="absolute w-full h-1 bg-cyan-400 top-1/2 -translate-y-1/2 z-0"></div>
                   <div className="w-6 h-6 bg-blue-500 rounded-full z-10"></div>
                   <div className="w-6 h-6 bg-cyan-400 rounded-full z-10"></div>
                </div>
                {/* زوج 2 */}
                <div className="relative flex items-center justify-between w-24">
                   <div className="absolute w-full h-1 bg-blue-500 top-1/2 -translate-y-1/2 z-0"></div>
                   <div className="w-6 h-6 bg-cyan-400 rounded-full z-10"></div>
                   <div className="w-6 h-6 bg-cyan-400 rounded-full z-10"></div>
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: "قوانين الجشتالت: 5 و 6. الحركة والتماثل 🔄",
      icon: <LayoutGrid className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <div className="bg-slate-800/60 p-4 rounded-xl border-r-4 border-cyan-500">
            <h4 className="text-cyan-300 font-bold text-xl mb-2">5. مبدأ الحركة (Common Fate)</h4>
            <p>
              بنميل نجمع العناصر اللي بتتحرك في نفس الاتجاه وبنفس السرعة كأنهم مجموعة واحدة.
              <br/>
              <span className="text-sm text-gray-400 italic">مثال: موجة الجماهير في المدرجات في الماتش! بنشوف الموجة ككيان بيتحرك، مش كأفراد.</span>
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border-r-4 border-blue-500 mt-4">
            <h4 className="text-blue-300 font-bold text-xl mb-2">6. مبدأ التماثل (Symmetry)</h4>
            <p>
              الفرد بيميل إنه يجمع العناصر المتماثلة (اللي زي المراية لبعض) ويشوفها كوحدة واحدة.
            </p>
            <div className="flex justify-center gap-6 mt-4 opacity-80">
              <div className="text-4xl text-cyan-400">{"}"} &nbsp;&nbsp;&nbsp; {"{"}</div>
              <div className="text-4xl text-blue-400">[ ]</div>
              <div className="text-4xl text-cyan-400">&gt; &lt;</div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">عينك جمعت الأقواس اللي بتبص لبعض كأنهم شكل واحد.</p>
          </div>
        </div>
      )
    },
    {
      id: 12,
      title: "قوانين الجشتالت: 7. مبدأ الانغلاق ⭕",
      icon: <LayoutGrid className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            سابع وأخر مبدأ هو <span className="text-cyan-400 font-bold">الانغلاق (Closure)</span>.
            مخنا مابيحبش الحاجة الناقصة! لو شفنا محفزات بصرية غير كاملة، مخنا تلقائياً بيملى الفراغات دي عشان يحصل على شكل كامل ليه معنى.
          </p>
          
          <div className="flex justify-center items-center gap-12 bg-slate-900/50 p-8 rounded-xl border border-white/10 mt-6 h-48">
             {/* دائرة مقطعة (الانغلاق) */}
             <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-dashed border-cyan-400 rounded-full animate-[spin_10s_linear_infinite]"></div>
             </div>
             
             {/* مثلث وهمي (مثلث كانيزا المشهور في الانغلاق) */}
             <div className="relative w-32 h-32 flex justify-center items-center">
                <div className="absolute w-12 h-12 bg-blue-500 rounded-full -top-2 -left-2" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 50%, 100% 100%)' }}></div>
                <div className="absolute w-12 h-12 bg-blue-500 rounded-full -top-2 -right-2"></div>
                <div className="absolute w-12 h-12 bg-blue-500 rounded-full bottom-0"></div>
                {/* المثلث المخفي اللي المخ بيكمله */}
                <div className="absolute w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-slate-900 z-10 translate-y-2"></div>
             </div>
          </div>
          <p className="text-sm text-center text-cyan-200">إنت شايف دايرة كاملة ومثلث كامل رغم إن الخطوط مقطعة ومش مقفولة!</p>
        </div>
      )
    },
    {
      id: 13,
      title: "مين البطل ومين الكومبارس؟ (الشكل والخلفية) 🎭",
      icon: <ImageIcon className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            أي صورة في الدنيا بتتكون من حاجتين:
          </p>
          <ul className="list-disc list-inside text-cyan-100">
            <li><strong className="text-cyan-400">الشكل (Figure):</strong> ده البطل، الجزء الإيجابي والأساسي في الصورة.</li>
            <li><strong className="text-blue-400">الأرضية أو الخلفية (Ground):</strong> المساحة السالبة اللي بتحيط بالبطل.</li>
          </ul>
          
          <p>
            أحياناً بيحصل ظاهرة اسمها <strong className="text-yellow-400">"الوهم البصري"</strong>، ومخك ميبقاش قادر يحدد مين البطل ومين الخلفية! 
            تارة الشكل يسيطر وتارة الخلفية تسيطر. أشهر مثال على ده هو "كأس روبين" (Rubin Vase).
          </p>

          {/* محاكاة كأس روبين برمجياً بالـ SVG */}
          <div className="flex flex-col items-center justify-center mt-4">
             <div className="bg-white p-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)]">
               <svg width="150" height="150" viewBox="0 0 100 100">
                 {/* الخلفية البيضاء تمثل الوجوه، والشكل الأسود يمثل الكأس */}
                 <rect width="100" height="100" fill="#fff" />
                 <path d="M 20,0 C 30,10 40,10 40,20 C 40,30 30,35 30,45 C 30,55 40,55 45,65 C 50,75 35,80 30,100 L 70,100 C 65,80 50,75 55,65 C 60,55 70,55 70,45 C 70,35 60,30 60,20 C 60,10 70,10 80,0 Z" fill="#000" />
               </svg>
             </div>
             <p className="text-sm text-gray-400 mt-2">إنت شايف كاس أسود؟ ولا وشين بيض باصين لبعض؟</p>
          </div>
        </div>
      )
    },
    {
      id: 14,
      title: "إزاي نبرز البطل في الصورة؟ 📸✨",
      icon: <Eye className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            عشان الصورة تكون ناجحة، لازم كل عنصر يوصل الرسالة، العشوائية بتعمل تشويش للمتعلم.
            المصمم الشاطر بيستخدم أسس التصميم عشان يبرز البطل:
          </p>
          
          <div className="grid gap-4 mt-4 text-base">
            <div className="bg-white/5 p-4 rounded-xl border-l-4 border-cyan-500">
              <strong className="text-cyan-300 block mb-1">1. التباين (Contrast):</strong>
              زي ما قال "فلوكس 2011"، التباين بين لون وإضاءة البطل والخلفية بيفصلهم عن بعض بوضوح.
            </div>
            <div className="bg-white/5 p-4 rounded-xl border-l-4 border-blue-500">
              <strong className="text-blue-300 block mb-1">2. العزل (Telephoto Lens):</strong>
              نستخدم عدسة تخلي البطل واضح وحاد (Sharp)، والخلفية وراه مزغللة (Blur)، فالعين متروحش غير للبطل.
            </div>
            <div className="bg-white/5 p-4 rounded-xl border-l-4 border-cyan-500">
              <strong className="text-cyan-300 block mb-1">3. الحجم والمكان:</strong>
              العين دايماً بتشوف الأشكال "الأكبر" و"الأقرب" في مقدمة الصورة أولاً قبل الحاجات البعيدة الصغيره.
            </div>
          </div>
          <p className="text-sm text-yellow-300 text-center italic mt-2">
            * ملحوظة: ساعات الخلفية نفسها بتكون هي الموضوع الرئيسي! زي صورة بحر وسحاب وفي شخص صغير جداً، هنا البطل هو الطبيعة مش الشخص.
          </p>
        </div>
      )
    },
    {
      id: 15,
      title: "وهم أوليفيا وتأثير الخبرات السابقة 🧠✨",
      icon: <BrainCircuit className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            الباحثة "أوليفيا 2009" قالت إن الإنسان بيميل لتقريب المعلومات البصرية المجهولة لـ <strong className="text-cyan-400">الأشياء المألوفة ليه</strong> بناءً على تراكم خبراته السابقة.
          </p>

          {/* محاكاة لأشكال وهم أوليفيا برمجياً */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {/* بقرة في الحقل */}
            <div className="flex flex-col items-center p-4 bg-slate-900/50 rounded-xl border border-green-500/30">
               <div className="w-40 h-24 bg-green-700/80 rounded-md flex justify-center items-center overflow-hidden mb-3">
                 <div className="w-12 h-8 bg-[#654321] rounded-full filter blur-[2px]"></div>
               </div>
               <p className="text-sm text-center">خلفية خضراء وبقعة بنية مبهمة = مخك هيقول دي <span className="text-green-400 font-bold">بقرة في حقل</span>.</p>
            </div>

            {/* مركب في البحر */}
            <div className="flex flex-col items-center p-4 bg-slate-900/50 rounded-xl border border-blue-500/30">
               <div className="w-40 h-24 bg-blue-700/80 rounded-md flex justify-center items-center overflow-hidden mb-3">
                 <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-white filter blur-[1px]"></div>
               </div>
               <p className="text-sm text-center">نفس الفكرة لو خلفية زرقاء ومثلث أبيض = مخك هيقول ده <span className="text-blue-400 font-bold">مركب في البحر</span>.</p>
            </div>
          </div>
          <p className="text-center text-cyan-200 mt-2">الأشكال دي ملهاش تفاصيل واضحة، بس خبرتك هي اللي كملتها!</p>
        </div>
      )
    },
    {
      id: 16,
      title: "خصائص الإدراك البصري (الجزء الأول) 🔍",
      icon: <CheckCircle2 className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            دكتور "علي محمد عبد المنعم" (2000) لخص خصائص الإدراك البصري في كام نقطة مهمة للمصممين:
          </p>
          <ul className="space-y-4 mt-4">
            <li className="bg-white/5 p-4 rounded-xl border-r-2 border-cyan-500">
              <strong className="text-cyan-300 text-xl block mb-1">1. نسبي (مش مطلق):</strong>
              إدراك الصورة بيختلف من شخص للتاني، ومن ثقافة لثانية، والطفل غير الكبير. لازم نضيف دلائل توجه المتلقي للمعنى الصح.
            </li>
            <li className="bg-white/5 p-4 rounded-xl border-r-2 border-blue-500">
              <strong className="text-blue-300 text-xl block mb-1">2. اختياري انتقائي:</strong>
              إنت بتفلتر الحاجات اللي بتشوفها. عشان كدا المصمم لازم يقلل الزحمة ويركز على العناصر الهامة بس عشان الانتباه ميتشتتش.
            </li>
            <li className="bg-white/5 p-4 rounded-xl border-r-2 border-cyan-500">
              <strong className="text-cyan-300 text-xl block mb-1">3. منظم:</strong>
              زي ما الجشتالت قالوا، الإدراك عملية منظمة، والمصمم لازم يرتب العناصر عشان يسهل الفهم (استخدام الشكل والأرضية).
            </li>
            <li className="bg-white/5 p-4 rounded-xl border-r-2 border-blue-500">
              <strong className="text-blue-300 text-xl block mb-1">4. هادف:</strong>
              إحنا بندرك الحاجات اللي بتشبع رغباتنا وأهدافنا.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 17,
      title: "خصائص الإدراك البصري (الجزء الثاني) 🚀",
      icon: <CheckCircle2 className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <ul className="space-y-4">
            <li className="bg-white/5 p-4 rounded-xl border-r-2 border-cyan-500">
              <strong className="text-cyan-300 text-xl block mb-1">5. حداثة المثير وأصالته:</strong>
              الأفكار الجديدة الإبداعية بتسهل الإدراك وتلفت الانتباه أكتر من الحاجات التقليدية.
            </li>
            <li className="bg-white/5 p-4 rounded-xl border-r-2 border-blue-500">
              <strong className="text-blue-300 text-xl block mb-1">6. مرتبط بالإطار المرجعي للفرد:</strong>
              لازم نراعي الفروق الفردية بين المتعلمين، لأن كل واحد ليه خلفيته وخبرته اللي بيحكم بيها.
            </li>
            <li className="bg-white/5 p-4 rounded-xl border-r-2 border-cyan-500">
              <strong className="text-cyan-300 text-xl block mb-1">7. عملية دائرية (مش خطية):</strong>
              الإدراك دايرة مقفولة مش خط مستقيم. بيبدأ بـ (الاختيار) {'->'} ثم (التنظيم) {'->'} ثم (التفسير)، وبيلف تاني.
            </li>
            <li className="bg-white/5 p-4 rounded-xl border-r-2 border-yellow-500">
              <strong className="text-yellow-400 text-xl block mb-1">8. سابق للتعلم (نقطة محورية):</strong>
              مستحيل تتعلم معلومة جديدة من صورة من غير ما مخك يدرك المثيرات البصرية الأول. الإدراك هو باب التعلم!
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 18,
      title: "چيم العيون: التدريب الإدراكي (1) 🏋️‍♂️👁️",
      icon: <Eye className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <p>
            حسب كلام "وليد يوسف" (2004)، إحنا نقدر ندرب نفسنا على الإدراك!
            <br/> 
            <span className="text-cyan-400 font-semibold">"التدريب الإدراكي: هو إزاي نساعد الفرد يفكر في اللي بيوصل لمخه من خلال عينه".</span>
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-4 rounded-xl border border-white/10 text-center shadow-lg hover:-translate-y-1 transition-transform">
              <div className="text-3xl mb-2">🎨📐</div>
              <strong className="text-cyan-300 block mb-2">1. خصائص الأشكال</strong>
              <p className="text-gray-400">التعرف على الألوان، الأبعاد، الأحجام، والمواقع بناءً على خبراتك القديمة.</p>
            </div>
            
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-4 rounded-xl border border-white/10 text-center shadow-lg hover:-translate-y-1 transition-transform">
              <div className="text-3xl mb-2">🔍⚖️</div>
              <strong className="text-cyan-300 block mb-2">2. إدراك الاختلافات</strong>
              <p className="text-gray-400">تطلع الفروق بين الأشكال (زي ألعاب طلع الاختلاف)، ده بيعلي دقة الملاحظة جداً.</p>
            </div>

            <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-4 rounded-xl border border-white/10 text-center shadow-lg hover:-translate-y-1 transition-transform">
              <div className="text-3xl mb-2">👯‍♂️✨</div>
              <strong className="text-cyan-300 block mb-2">3. إدراك المتشابهات</strong>
              <p className="text-gray-400">القدرة على تمييز الأشكال اللي شبه بعض، وده عكس اللي فات، بيزود التمحيص والتركيز.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 19,
      title: "چيم العيون: التدريب الإدراكي (2) 🏋️‍♂️🧠",
      icon: <BrainCircuit className="text-cyan-400 w-8 h-8" />,
      content: (
        <div className="space-y-4 text-lg leading-relaxed text-gray-200">
          <ul className="space-y-3 mt-2">
            <li className="flex items-start bg-white/5 p-3 rounded-lg border-r-2 border-blue-400">
              <span className="text-xl ml-3">🔗</span>
              <div>
                <strong className="text-blue-300">4. الربط بين العلاقات:</strong> قدرتك تربط بين السبب والنتيجة في الصورة.
              </div>
            </li>
            <li className="flex items-start bg-white/5 p-3 rounded-lg border-r-2 border-cyan-400">
              <span className="text-xl ml-3">🧩</span>
              <div>
                <strong className="text-cyan-300">5. الإغلاق وعلاقة الكل بالجزء:</strong> إنك تفهم الصورة الكبيرة وتستنتجها من مجرد معلومات جزئية صغيرة متفرقة.
              </div>
            </li>
            <li className="flex items-start bg-white/5 p-3 rounded-lg border-r-2 border-blue-400">
              <span className="text-xl ml-3">🔢</span>
              <div>
                <strong className="text-blue-300">6. تسلسل الأشياء وترتيبها:</strong> ترتيب الصور حسب الحجم، أو ترتيبها كأحداث في الزمن بمنطق معين عشان تستنتج الحكاية.
              </div>
            </li>
            <li className="flex items-start bg-white/5 p-3 rounded-lg border-r-2 border-cyan-400">
              <span className="text-xl ml-3">💾</span>
              <div>
                <strong className="text-cyan-300">7. التذكر البصري:</strong> قدرتك إنك تستدعي المثيرات البصرية اللي لسه شايفها من الذاكرة قريبة المدى.
              </div>
            </li>
            <li className="flex items-start bg-white/5 p-3 rounded-lg border-r-2 border-yellow-400">
              <span className="text-xl ml-3">✍️</span>
              <div>
                <strong className="text-yellow-400">8. التعبير الشكلي:</strong> إنك تترجم اللي فهمته وتتصوره وترسمه أو تشكله بإيدك.
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 20,
      title: "تمت المهمة بنجاح! 🎉",
      icon: <CheckCircle2 className="text-green-400 w-8 h-8" />,
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center text-lg leading-relaxed text-gray-200 mt-8">
          <div className="w-24 h-24 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.6)] animate-bounce">
            <span className="text-5xl">🏆</span>
          </div>
          <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            عاش يا بطل!
          </h3>
          <p className="max-w-md">
            كدا إحنا فصصنا الفصل الأول بالكامل، من أهمية الصورة، لرحلة الضوء، لقوانين الجشتالت، للوهم البصري، لحد ما وصلنا لتمارين العين!
          </p>
          <button 
            onClick={() => setCurrentSlide(0)}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all text-cyan-300 font-bold mt-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
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
      
      {/* Background Glows (Glassmorphism & Neon) */}
      <div className="fixed top-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-cyan-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-blue-700 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>

      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-[#020617]/70 backdrop-blur-xl border-b border-white/10 flex justify-between items-center p-4 lg:px-8">
        <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <X size={18} />
          <span className="hidden sm:inline font-semibold">خروج</span>
        </button>

        <div className="flex-1 max-w-2xl mx-4 sm:mx-8 flex items-center gap-4">
          <span className="text-xs text-cyan-400 font-bold whitespace-nowrap bg-cyan-950/50 px-2 py-1 rounded-md border border-cyan-800/50">
            {currentSlide + 1} / {slides.length}
          </span>
          <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden shadow-inner border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 right-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>

        <h1 className="text-sm sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 truncate max-w-[120px] sm:max-w-[200px]">
          الفصل 1: الإدراك البصري
        </h1>
      </header>

      {/* Main Content Area (Safe Area constraints applied) */}
      <main className="flex-1 pt-28 pb-32 px-4 sm:px-6 md:px-8 w-full max-w-4xl mx-auto flex flex-col justify-center relative z-10 min-h-screen">
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-6 md:p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] transition-all duration-300 relative overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4 relative z-10">
            <div className="p-2 bg-slate-800 rounded-xl shadow-inner border border-white/5">
              {slides[currentSlide].icon}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-[0_2px_15px_rgba(34,211,238,0.3)]">
              {slides[currentSlide].title}
            </h2>
          </div>
          
          <div className="min-h-[350px] relative z-10">
             {slides[currentSlide].content}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 w-full z-50 p-4 lg:px-8 flex justify-between items-center bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent pb-6">
        
        <button 
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="flex items-center gap-2 px-6 py-3.5 bg-cyan-500/20 text-cyan-300 rounded-xl hover:bg-cyan-500/30 transition-all border border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] disabled:opacity-20 disabled:hover:bg-cyan-500/20 disabled:shadow-none"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
          <span className="font-bold text-lg">التالي</span>
        </button>

        <button 
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="flex items-center gap-2 px-6 py-3.5 bg-slate-800/80 backdrop-blur text-gray-300 rounded-xl hover:bg-slate-700 transition-all border border-slate-600 disabled:opacity-20 disabled:hover:bg-slate-800 shadow-lg"
        >
          <span className="font-bold text-lg">السابق</span>
          <ChevronRight size={22} strokeWidth={2.5} />
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