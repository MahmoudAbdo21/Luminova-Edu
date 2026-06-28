(function () {
    "use strict";

    if (!window.__LUMINOVA) return;
    const { useState, useEffect, useMemo, useCallback, useRef } = window.React;
    const html = window.htm.bind(window.React.createElement);
    const Luminova = window.__LUMINOVA;
    if (!Luminova.FOUNDER) {
        Luminova.FOUNDER = {
            id: 's_founder_hardcoded',
            nameAr: 'محمود عبدالرحمن (مؤسس المنصة)',
            nameEn: 'Mahmoud Abdelrahman',
            isFounder: true,
            isVIP: true,
            isVerified: true
        };
    }
    const SUPPORT_WHATSAPP_NUMBER = "201061473606";
    const SUPPORT_WHATSAPP_MESSAGE = "مرحبًا، أحتاج مساعدة في تأكيد تسليم الاختبار.";
    const SUPPORT_WHATSAPP_URL = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(SUPPORT_WHATSAPP_MESSAGE)}`;
    const LUMINOVA_DEBUG = false;
    const debugLog = (...args) => { if (LUMINOVA_DEBUG) window.console.log(...args); };
    const debugWarn = (...args) => { if (LUMINOVA_DEBUG) window.console.warn(...args); };
    const debugErr = (...args) => { if (LUMINOVA_DEBUG) window.console.error(...args); };

    // ── DST-SAFE TIME HELPERS (Cairo timezone) ──────────────────────
    const getTimeZoneOffsetMs = (timeZone, utcMs) => {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const parts = formatter.formatToParts(new Date(utcMs)).reduce((acc, part) => {
            if (part.type !== 'literal') acc[part.type] = Number(part.value);
            return acc;
        }, {});
        const hour = parts.hour === 24 ? 0 : parts.hour;
        return Date.UTC(parts.year, parts.month - 1, parts.day, hour, parts.minute, parts.second) - utcMs;
    };

    const parseCairoDeadline = (dateStr) => {
        if (!dateStr) return null;
        const text = String(dateStr).trim();
        if (/[zZ]|[+-]\d{2}:\d{2}$/.test(text)) {
            const absoluteDate = new Date(text);
            return isNaN(absoluteDate) ? null : absoluteDate;
        }

        const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/);
        if (!match) {
            const fallbackDate = new Date(text);
            return isNaN(fallbackDate) ? null : fallbackDate;
        }

        const y = Number(match[1]);
        const mo = Number(match[2]) - 1;
        const d = Number(match[3]);
        const h = Number(match[4] || 0);
        const mi = Number(match[5] || 0);
        const sec = Number(match[6] || 0);
        const cairoWallTimeAsUtc = Date.UTC(y, mo, d, h, mi, sec);
        const firstOffset = getTimeZoneOffsetMs('Africa/Cairo', cairoWallTimeAsUtc);
        const correctedUtc = cairoWallTimeAsUtc - firstOffset;
        const secondOffset = getTimeZoneOffsetMs('Africa/Cairo', correctedUtc);
        return new Date(cairoWallTimeAsUtc - secondOffset);
    };
    const SUBMIT_STATES = {
        IDLE: "idle",
        PREPARING: "preparing",
        SENDING: "sending",
        VERIFYING: "verifying",
        SUCCESS: "success",
        UNCERTAIN: "uncertain",
        RETRYING_VERIFY: "retrying_verify",
        RETRYING_SEND: "retrying_send",
        CONFLICT: "conflict",
        FAILED: "failed"
    };

    const SUBMIT_EXAM_WATCHDOG_MS = 60000;
    const VERIFY_WATCHDOG_MS = 20000;
    const UNCERTAIN_VERIFY_DELAY_MS = 3000;
    const UNCERTAIN_VERIFY_MAX_RETRIES = 3;

    function normalizeArabicAnswer(value) {
      return String(value ?? "")
        .normalize("NFKC")
        .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
        .replace(/\u00A0/g, " ")
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
        .replace(/\u0640/g, "")
        .replace(/[أإآٱ]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/[.,\/#!$%\^&\*;:{}=\-_~‑()?'"،؟«»“”]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    function resolveCorrectAnswerSource(question) {
      if (
        Array.isArray(question.correctAnswers) &&
        question.correctAnswers.length > 0
      ) {
        return {
          sourceField: "correctAnswers",
          values: question.correctAnswers
        };
      }

      if (
        question.correctAnswer !== undefined &&
        question.correctAnswer !== null
      ) {
        return {
          sourceField: "correctAnswer",
          values: [question.correctAnswer]
        };
      }

      if (
        question.answer !== undefined &&
        question.answer !== null
      ) {
        return {
          sourceField: "answer",
          values: Array.isArray(question.answer)
            ? question.answer
            : [question.answer]
        };
      }

      return {
        sourceField: null,
        values: []
      };
    }

    function canonicalIndex(value) {
      if (
        typeof value === "number" &&
        Number.isInteger(value)
      ) {
        return String(value);
      }

      if (
        typeof value === "string" &&
        /^\d+$/.test(value.trim())
      ) {
        return String(Number(value.trim()));
      }

      return null;
    }

    function canonicalId(value) {
      if (value === null || value === undefined) {
        return null;
      }
      const normalized = String(value).trim();
      return normalized || null;
    }

    const optionToText = (option) => {
        if (option && typeof option === 'object') {
            return String(option.text || option.textAr || option.textEn || option.label || option.value || '');
        }
        return option === undefined || option === null ? '' : String(option);
    };

    const getOptionsSafe = (que) => {
        if (!que) return [];
        if (Array.isArray(que.options)) return que.options;
        if (Array.isArray(que.optionsAr)) return que.optionsAr;
        if (Array.isArray(que.optionsEn)) return que.optionsEn;
        return [];
    };

    function resolveTextToIndex(val, options) {
      if (val === null || val === undefined) return null;
      const normVal = normalizeArabicAnswer(val);
      for (let i = 0; i < options.length; i++) {
        if (normalizeArabicAnswer(options[i]) === normVal) {
          return String(i);
        }
      }
      return null;
    }

    function isNumericIndex(val, optsCount) {
      if (val === null || val === undefined) return false;
      const str = String(val).trim();
      if (/^\d+$/.test(str)) {
        const num = Number(str);
        return num >= 0 && num < optsCount;
      }
      return false;
    }

    function determineComparisonMode(question, correctValues) {
      const opts = getOptionsSafe(question);
      const optsCount = opts.length;
      const hasOptionIds = Array.isArray(question.optionIds) && question.optionIds.length > 0;
      
      if (question.type === 'multi_select') {
        if (correctValues.length > 0) {
          if (hasOptionIds && correctValues.every(val => question.optionIds.includes(String(val).trim()))) {
            return 'MULTI_SELECT_ID_SET';
          }
          if (correctValues.every(val => isNumericIndex(val, optsCount))) {
            return 'MULTI_SELECT_INDEX_SET';
          }
        }
        return 'MULTI_SELECT_TEXT_SET';
      } else if (question.type === 'mcq' || question.type === 'true_false') {
        if (correctValues.length > 0) {
          if (hasOptionIds && correctValues.every(val => question.optionIds.includes(String(val).trim()))) {
            return 'OPTION_ID';
          }
          if (correctValues.every(val => isNumericIndex(val, optsCount))) {
            return 'ORIGINAL_INDEX';
          }
        }
        return 'NORMALIZED_TEXT';
      } else if (question.type === 'essay') {
        return 'ESSAY_ACCEPTED_TEXT';
      }
      return 'NORMALIZED_TEXT';
    }

    function getDisplayValue(question, rawValue) {
      if (rawValue === null || rawValue === undefined || rawValue === '') {
        return '';
      }
      const opts = getOptionsSafe(question);
      
      // Check if optionIds exists and match
      if (Array.isArray(question.optionIds)) {
        const idx = question.optionIds.indexOf(String(rawValue).trim());
        if (idx !== -1 && idx < opts.length) {
          return optionToText(opts[idx]);
        }
      }

      // Check if rawValue is a numeric index
      const idx = canonicalIndex(rawValue);
      if (idx !== null) {
        const num = Number(idx);
        if (num >= 0 && num < opts.length) {
          return optionToText(opts[num]);
        }
      }
      // Check if it's a text string matching an option
      if (typeof rawValue === 'string') {
        const matchedIdx = resolveTextToIndex(rawValue, opts);
        if (matchedIdx !== null) {
          return optionToText(opts[Number(matchedIdx)]);
        }
      }
      return String(rawValue);
    }

    function getDisplayValuesMulti(question, rawValues, htmlSeparator = false) {
      if (!Array.isArray(rawValues)) {
        return getDisplayValue(question, rawValues);
      }
      const sep = ' | ';
      return rawValues.map(v => getDisplayValue(question, v)).filter(Boolean).join(sep);
    }

    function canonicalSet(values, canonicalize) {
      return [
        ...new Set(
          values
            .map(canonicalize)
            .filter(value => value !== null)
        )
      ].sort();
    }

    function resolveQuestionPoints(question) {
        const raw =
            question.maxPoints ??
            question.points ??
            question.score ??
            1;
        const points = Number(raw);
        return Number.isFinite(points) && points >= 0 ? points : 0;
    }

    function isQuestionUnanswered(question, selectedAnswer) {
        if (selectedAnswer === null || selectedAnswer === undefined) {
            return true;
        }

        if (typeof selectedAnswer === "string") {
            return selectedAnswer.trim() === "";
        }

        if (Array.isArray(selectedAnswer)) {
            return selectedAnswer.length === 0;
        }

        return false;
    }

    function gradeQuestionAnswer(question, selectedAnswer, context = {}) {
        const questionId = question.questionId || question.id || "";
        const questionType = question.type || "mcq";
        const isAutoGradable = questionType !== 'essay';
        
        if (questionType === 'mcq' || questionType === 'true_false' || questionType === 'essay') {
            if (Array.isArray(selectedAnswer)) {
                selectedAnswer = selectedAnswer.length > 0 ? selectedAnswer[0] : null;
            }
        }
        
        // 1. Resolve correct-answer source
        const { sourceField: correctSourceField, values: correctValues } = resolveCorrectAnswerSource(question);
        
        // 2. Handle empty states
        const hasCorrect = correctValues.length > 0;
        
        if (isQuestionUnanswered(question, selectedAnswer)) {
            const correctDisplay = questionType === 'multi_select'
                ? getDisplayValuesMulti(question, correctValues, !!context.htmlSeparator)
                : getDisplayValue(question, correctValues[0]);
                
            return {
                status: "UNANSWERED",
                isCorrect: false,
                isAnswered: false,
                isAutoGradable,
                awardedPoints: 0,
                questionId,
                questionType,
                comparisonMode: determineComparisonMode(question, correctValues),
                correctSourceField,
                selectedRaw: selectedAnswer,
                selectedCanonical: null,
                selectedDisplay: "لم يتم تسجيل إجابة",
                correctRaw: correctValues,
                correctCanonical: null,
                correctDisplay,
                modelAnswerDisplay: question.modelAnswer || question.modelAnswerAr || "",
                explanationDisplay: question.explanation || question.feedback || question.explanationAr || "",
                diagnosticCode: "NO_SELECTION"
            };
        }
        
        if (!isAutoGradable) {
            return {
                status: "PENDING_REVIEW",
                isCorrect: false,
                isAnswered: true,
                isAutoGradable: false,
                awardedPoints: 0,
                questionId,
                questionType,
                comparisonMode: "MANUAL",
                correctSourceField: null,
                selectedRaw: selectedAnswer,
                selectedCanonical: null,
                selectedDisplay: String(selectedAnswer),
                correctRaw: null,
                correctCanonical: null,
                correctDisplay: "",
                modelAnswerDisplay: question.modelAnswer || question.modelAnswerAr || "",
                explanationDisplay: question.explanation || question.feedback || question.explanationAr || "",
                diagnosticCode: "MANUAL_REVIEW"
            };
        }
        
        if (!hasCorrect) {
            return {
                status: "INCORRECT",
                isCorrect: false,
                isAnswered: true,
                isAutoGradable,
                awardedPoints: 0,
                questionId,
                questionType,
                comparisonMode: "UNKNOWN",
                correctSourceField,
                selectedRaw: selectedAnswer,
                selectedCanonical: null,
                selectedDisplay: String(selectedAnswer),
                correctRaw: null,
                correctCanonical: null,
                correctDisplay: "",
                modelAnswerDisplay: question.modelAnswer || question.modelAnswerAr || "",
                explanationDisplay: question.explanation || question.feedback || question.explanationAr || "",
                diagnosticCode: "NO_CORRECT_ANSWER"
            };
        }
        
        // 3. Determine comparison mode
        const comparisonMode = determineComparisonMode(question, correctValues);
        const opts = getOptionsSafe(question);
        const htmlSeparator = !!context.htmlSeparator;
        
        // Log trace logic
        if (context.debug === true || (window && window.__LUMINOVA_DEBUG_GRADING === true)) {
            window.console.log("[LUMINOVA GRADING TRACE]", {
                questionId,
                questionType,
                comparisonMode,
                correctSourceField,
                selectedRaw: selectedAnswer,
                correctRaw: correctValues
            });
        }
        
        // 4. Perform comparison based on mode
        if (comparisonMode === 'ORIGINAL_INDEX') {
            const correctCanonical = canonicalIndex(correctValues[0]);
            
            let selectedCanonical = canonicalIndex(selectedAnswer);
            if (selectedCanonical === null && typeof selectedAnswer === 'string') {
                selectedCanonical = resolveTextToIndex(selectedAnswer, opts);
            }
            
            const isCorrect = (selectedCanonical !== null && selectedCanonical === correctCanonical);
            
            return {
                status: isCorrect ? "CORRECT" : "INCORRECT",
                isCorrect,
                isAnswered: true,
                isAutoGradable,
                awardedPoints: isCorrect ? resolveQuestionPoints(question) : 0,
                questionId,
                questionType,
                comparisonMode,
                correctSourceField,
                selectedRaw: selectedAnswer,
                selectedCanonical,
                selectedDisplay: getDisplayValue(question, selectedAnswer),
                correctRaw: correctValues[0],
                correctCanonical,
                correctDisplay: getDisplayValue(question, correctValues[0]),
                modelAnswerDisplay: question.modelAnswer || question.modelAnswerAr || "",
                explanationDisplay: question.explanation || question.feedback || question.explanationAr || "",
                diagnosticCode: isCorrect ? "MATCH" : "MISMATCH"
            };
        }
        
        if (comparisonMode === 'OPTION_ID') {
            const correctCanonical = canonicalId(correctValues[0]);
            let selectedCanonical = canonicalId(selectedAnswer);
            const selIdx = canonicalIndex(selectedAnswer);
            if (selIdx !== null && Array.isArray(question.optionIds)) {
                const num = Number(selIdx);
                if (num >= 0 && num < question.optionIds.length) {
                    selectedCanonical = canonicalId(question.optionIds[num]);
                }
            }
            
            const isCorrect = (selectedCanonical !== null && selectedCanonical === correctCanonical);
            
            return {
                status: isCorrect ? "CORRECT" : "INCORRECT",
                isCorrect,
                isAnswered: true,
                isAutoGradable,
                awardedPoints: isCorrect ? resolveQuestionPoints(question) : 0,
                questionId,
                questionType,
                comparisonMode,
                correctSourceField,
                selectedRaw: selectedAnswer,
                selectedCanonical,
                selectedDisplay: getDisplayValue(question, selectedAnswer),
                correctRaw: correctValues[0],
                correctCanonical,
                correctDisplay: getDisplayValue(question, correctValues[0]),
                modelAnswerDisplay: question.modelAnswer || question.modelAnswerAr || "",
                explanationDisplay: question.explanation || question.feedback || question.explanationAr || "",
                diagnosticCode: isCorrect ? "MATCH" : "MISMATCH"
            };
        }
        
        if (comparisonMode === 'NORMALIZED_TEXT' || comparisonMode === 'ESSAY_ACCEPTED_TEXT') {
            const correctCanonical = normalizeArabicAnswer(correctValues[0]);
            
            let selectedCanonical = "";
            const selIdx = canonicalIndex(selectedAnswer);
            if (selIdx !== null) {
                const num = Number(selIdx);
                if (num >= 0 && num < opts.length) {
                    selectedCanonical = normalizeArabicAnswer(opts[num]);
                } else {
                    selectedCanonical = normalizeArabicAnswer(selectedAnswer);
                }
            } else {
                selectedCanonical = normalizeArabicAnswer(selectedAnswer);
            }
            
            const isCorrect = (selectedCanonical === correctCanonical);
            
            return {
                status: isCorrect ? "CORRECT" : "INCORRECT",
                isCorrect,
                isAnswered: true,
                isAutoGradable,
                awardedPoints: isCorrect ? resolveQuestionPoints(question) : 0,
                questionId,
                questionType,
                comparisonMode,
                correctSourceField,
                selectedRaw: selectedAnswer,
                selectedCanonical,
                selectedDisplay: getDisplayValue(question, selectedAnswer),
                correctRaw: correctValues[0],
                correctCanonical,
                correctDisplay: getDisplayValue(question, correctValues[0]),
                modelAnswerDisplay: question.modelAnswer || question.modelAnswerAr || "",
                explanationDisplay: question.explanation || question.feedback || question.explanationAr || "",
                diagnosticCode: isCorrect ? "MATCH" : "MISMATCH"
            };
        }
        
        if (comparisonMode === 'MULTI_SELECT_INDEX_SET') {
            const canonicalizeIdx = (val) => {
                const idx = canonicalIndex(val);
                if (idx !== null) return idx;
                if (typeof val === 'string') {
                    const textIdx = resolveTextToIndex(val, opts);
                    if (textIdx !== null) return textIdx;
                }
                return null;
            };
            
            const correctSet = canonicalSet(correctValues, canonicalizeIdx);
            const selectedArr = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
            const selectedSet = canonicalSet(selectedArr, canonicalizeIdx);
            
            const isCorrect = (correctSet.length === selectedSet.length && correctSet.every((val, i) => val === selectedSet[i]));
            
            return {
                status: isCorrect ? "CORRECT" : "INCORRECT",
                isCorrect,
                isAnswered: true,
                isAutoGradable,
                awardedPoints: isCorrect ? resolveQuestionPoints(question) : 0,
                questionId,
                questionType,
                comparisonMode,
                correctSourceField,
                selectedRaw: selectedAnswer,
                selectedCanonical: selectedSet,
                selectedDisplay: getDisplayValuesMulti(question, selectedArr, htmlSeparator),
                correctRaw: correctValues,
                correctCanonical: correctSet,
                correctDisplay: getDisplayValuesMulti(question, correctValues, htmlSeparator),
                modelAnswerDisplay: question.modelAnswer || question.modelAnswerAr || "",
                explanationDisplay: question.explanation || question.feedback || question.explanationAr || "",
                diagnosticCode: isCorrect ? "MATCH" : "MISMATCH"
            };
        }
        
        if (comparisonMode === 'MULTI_SELECT_ID_SET') {
            const canonicalizeIdVal = (val) => {
                const selIdx = canonicalIndex(val);
                if (selIdx !== null && Array.isArray(question.optionIds)) {
                    const num = Number(selIdx);
                    if (num >= 0 && num < question.optionIds.length) {
                        return canonicalId(question.optionIds[num]);
                    }
                }
                return canonicalId(val);
            };
            
            const correctSet = canonicalSet(correctValues, canonicalizeIdVal);
            const selectedArr = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
            const selectedSet = canonicalSet(selectedArr, canonicalizeIdVal);
            
            const isCorrect = (correctSet.length === selectedSet.length && correctSet.every((val, i) => val === selectedSet[i]));
            
            return {
                status: isCorrect ? "CORRECT" : "INCORRECT",
                isCorrect,
                isAnswered: true,
                isAutoGradable,
                awardedPoints: isCorrect ? resolveQuestionPoints(question) : 0,
                questionId,
                questionType,
                comparisonMode,
                correctSourceField,
                selectedRaw: selectedAnswer,
                selectedCanonical: selectedSet,
                selectedDisplay: getDisplayValuesMulti(question, selectedArr, htmlSeparator),
                correctRaw: correctValues,
                correctCanonical: correctSet,
                correctDisplay: getDisplayValuesMulti(question, correctValues, htmlSeparator),
                modelAnswerDisplay: question.modelAnswer || question.modelAnswerAr || "",
                explanationDisplay: question.explanation || question.feedback || question.explanationAr || "",
                diagnosticCode: isCorrect ? "MATCH" : "MISMATCH"
            };
        }
        
        if (comparisonMode === 'MULTI_SELECT_TEXT_SET') {
            const canonicalizeTxt = (val) => {
                const idx = canonicalIndex(val);
                if (idx !== null) {
                    const num = Number(idx);
                    if (num >= 0 && num < opts.length) {
                        return normalizeArabicAnswer(opts[num]);
                    }
                }
                return normalizeArabicAnswer(val);
            };
            
            const correctSet = canonicalSet(correctValues, canonicalizeTxt);
            const selectedArr = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
            const selectedSet = canonicalSet(selectedArr, canonicalizeTxt);
            
            const isCorrect = (correctSet.length === selectedSet.length && correctSet.every((val, i) => val === selectedSet[i]));
            
            return {
                status: isCorrect ? "CORRECT" : "INCORRECT",
                isCorrect,
                isAnswered: true,
                isAutoGradable,
                awardedPoints: isCorrect ? resolveQuestionPoints(question) : 0,
                questionId,
                questionType,
                comparisonMode,
                correctSourceField,
                selectedRaw: selectedAnswer,
                selectedCanonical: selectedSet,
                selectedDisplay: getDisplayValuesMulti(question, selectedArr, htmlSeparator),
                correctRaw: correctValues,
                correctCanonical: correctSet,
                correctDisplay: getDisplayValuesMulti(question, correctValues, htmlSeparator),
                modelAnswerDisplay: question.modelAnswer || question.modelAnswerAr || "",
                explanationDisplay: question.explanation || question.feedback || question.explanationAr || "",
                diagnosticCode: isCorrect ? "MATCH" : "MISMATCH"
            };
        }
        
        return {
            status: "INCORRECT",
            isCorrect: false,
            isAnswered: true,
            isAutoGradable,
            awardedPoints: 0,
            questionId,
            questionType,
            comparisonMode,
            correctSourceField,
            selectedRaw: selectedAnswer,
            selectedCanonical: null,
            selectedDisplay: String(selectedAnswer),
            correctRaw: correctValues,
            correctCanonical: null,
            correctDisplay: String(correctValues),
            modelAnswerDisplay: question.modelAnswer || question.modelAnswerAr || "",
            explanationDisplay: question.explanation || question.feedback || question.explanationAr || "",
            diagnosticCode: "SCHEMA_UNSUPPORTED"
        };
    }

    Luminova.Pages.QuizEngine = ({ quiz, data, lang, goBack }) => {
        // ── GUARDRAIL: Redirect to gateway if critical data is missing ──
        if (!quiz || !data) {
            return html`
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 text-center animate-fade-in border border-zinc-200 dark:border-white/10">
                    <div className="text-7xl mb-6">⚠️</div>
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">
                        ${lang === 'ar' ? 'خطأ في تحميل الامتحان' : 'Exam Load Error'}
                    </h2>
                    <p className="text-base font-bold text-zinc-650 dark:text-fuchsia-100/60 mb-8 leading-relaxed">
                        ${lang === 'ar' ? 'لم يتم العثور على بيانات الامتحان أو بيانات المنصة. يرجى العودة والمحاولة مرة أخرى.' : 'Exam data or platform data is missing. Please go back and try again.'}
                    </p>
                    <button onClick=${goBack}
                        className="w-full py-4 rounded-2xl font-black text-lg text-white shadow-xl transition-all hover:scale-[1.02] bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                        ${lang === 'ar' ? '🔙 العودة' : '🔙 Go Back'}
                    </button>
                </div>
            </div>
            `;
        }

        // ── SAFE DATA ACCESSOR ──
        const safeStudents = data?.students || [];

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

        const maxScore = questions.reduce((sum, curr) => sum + (Number(curr.score) || 0), 0);

        const getExamMode = () => String(quiz?.examMode || quiz?.mode || quiz?.type || 'practice').toLowerCase();
        const isEvaluationExam = () => {
            const mode = getExamMode();
            return mode === 'evaluation' || mode === 'evaluative' || mode === 'official';
        };
        const isEvaluation = isEvaluationExam();

        const isAnswerFilled = (value) => {
            if (value === undefined || value === null || value === '') return false;
            if (Array.isArray(value)) return value.length > 0;
            return true;
        };
        const asArraySafe = (value) => {
            if (Array.isArray(value)) return value;
            if (value === undefined || value === null || value === '') return [];
            return [value];
        };
        const formatStudentAnswerForDisplay = (que, value, lang = 'ar') => {
            const emptyText = lang === 'ar' ? 'بدون إجابة' : 'No answer';
            if (!isAnswerFilled(value)) return emptyText;
            const result = gradeQuestionAnswer(que, value);
            return result.selectedDisplay || emptyText;
        };
        const formatCorrectAnswerForDisplay = (que, lang = 'ar', htmlSeparator = false) => {
            const emptyText = lang === 'ar' ? 'غير متوفر' : 'Not available';
            const result = gradeQuestionAnswer(que, null, { htmlSeparator });
            return result.correctDisplay || emptyText;
        };

        const [isStarted, setIsStarted] = useState(!isEvaluation);
        const [studentInfo, setStudentInfo] = useState({ name: '', seatNumber: '', department: '', email: '' });
        const [isConflict, setIsConflict] = useState(false);
        const [isCorrupt, setIsCorrupt] = useState(false);
        const [isPageReload, setIsPageReload] = useState(false);
        const [now, setNow] = useState(null);
        const deadline = quiz.endTime ? parseCairoDeadline(quiz.endTime) : null;
        const timeLeft = (deadline && now) ? (deadline.getTime() - now.getTime()) : null;
        
        // ── TRUE CAIRO TIME SYNC ─────────────────────────────────
        // ARCHITECTURE NOTE: The timer is EXCLUSIVELY driven by
        // (Date.now() + cairoOffsetMs).  cairoOffsetMs is set once
        // from a trusted server source.  Bare `new Date()` is NEVER
        // used anywhere in the countdown or deadline logic.
        const [cairoOffsetMs, setCairoOffsetMs] = useState(null);
        const [isTimeSynced, setIsTimeSynced] = useState(false);
        const [timeSyncStatus, setTimeSyncStatus] = useState('PENDING');
        const [timeSyncRetryToken, setTimeSyncRetryToken] = useState(0);
        const [entryTime, setEntryTime] = useState(null);

        useEffect(() => {
            if (window.__LUMINOVA_GAS_DEBUG__) {
                window.__LUMINOVA_GAS_DEBUG__.count = 0;
                window.__LUMINOVA_GAS_DEBUG__.actions = [];
                window.__LUMINOVA_GAS_DEBUG__.lastPayload = null;
            }
        }, [quiz?.id]);

        useEffect(() => {
            if (!quiz) return;
            if (!isEvaluationExam()) {
                debugLog('[Luminova Practice Mode] Skipping server time sync.');
                return;
            }
            let cancelled = false;
            const fetchTrueTime = async () => {
                debugLog("[Luminova Time Sync Start JSON]", JSON.stringify({
                    quizId: quiz?.id || quiz?.quizId,
                    webhookUrl: quiz?.webhookUrl,
                    retryToken: timeSyncRetryToken,
                    currentStatus: timeSyncStatus,
                    currentOffset: cairoOffsetMs
                }, null, 2));

                // ── GAS SERVICE REFERENCE CHECK ──
                const gasService = window.__LUMINOVA?.Services?.GAS;
                debugLog("[Luminova GAS Service Ref]", JSON.stringify({
                    hasLuminova: !!window.__LUMINOVA,
                    hasServices: !!window.__LUMINOVA?.Services,
                    hasGAS: !!gasService,
                    getTrueTimeOffsetMsType: typeof gasService?.getTrueTimeOffsetMs,
                    gasKeys: Object.keys(gasService || {})
                }, null, 2));

                if (!gasService || typeof gasService.getTrueTimeOffsetMs !== 'function') {
                    console.error("[Luminova] GAS Service is NOT available. Cannot sync time.");
                    setIsTimeSynced(false);
                    setDebugError('GAS Service unavailable — time_sync_failed_gas_service_unavailable');
                    setTimeSyncStatus('FAILED');
                    return;
                }

                try {
                    setTimeSyncStatus('PENDING');
                    const offset = await gasService.getTrueTimeOffsetMs(quiz?.webhookUrl, quiz?.id || quiz?.quizId);
                    if (cancelled) return;
                    debugLog("[Luminova Time Sync Success]", JSON.stringify({
                        quizId: quiz?.id || quiz?.quizId,
                        offsetMs: offset,
                        isFiniteOffset: Number.isFinite(offset)
                    }, null, 2));
                    setCairoOffsetMs(offset);
                    setNow(new Date(Date.now() + offset));
                    setIsTimeSynced(true);
                    setDebugError(null);
                    setTimeSyncStatus('SUCCESS');
                } catch (error) {
                    if (cancelled) return;
                    debugWarn("[Luminova Time Sync Failed In Engine JSON]", JSON.stringify({
                        quizId: quiz?.id || quiz?.quizId,
                        webhookUrl: quiz?.webhookUrl,
                        errorName: error?.name,
                        errorMessage: error?.message,
                        diagnosticReason: error?.diagnosticReason,
                        stack: error?.stack
                    }, null, 2));
                    setIsTimeSynced(false);
                    setDebugError(error?.message || 'Unable to synchronize server time.');
                    setTimeSyncStatus('FAILED');
                }
            };
            fetchTrueTime();
            return () => { cancelled = true; };
        }, [quiz, timeSyncRetryToken]);

        const getTrueCairoNow = useCallback(() => {
            if (cairoOffsetMs === null) return null;
            return new Date(Date.now() + cairoOffsetMs);
        }, [cairoOffsetMs]);

        useEffect(() => {
            if (isTimeSynced) setNow(getTrueCairoNow());
        }, [isTimeSynced, getTrueCairoNow]);

        const [submitState, setSubmitState] = useState(SUBMIT_STATES.IDLE);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [submissionStep, setSubmissionStep] = useState(null); // 'preparing', 'sending', 'verifying', 'success', 'error', 'conflict'
        const [isSubmissionBusy, setIsSubmissionBusy] = useState(false);
        const submitLockRef = useRef(false);
        const timeExpiredSubmitRef = useRef(false);
        const recoveryLockRef = useRef(false);
        const [showDrawer, setShowDrawer] = useState(false);

        // ── SUBMIT-AND-VERIFY WATCHDOG REFS ──────────────────────
        const verifyPayloadRef = useRef(null);
        const verifyReasonRef = useRef('completed');
        const currentSubmitAttemptRef = useRef(null);

        useEffect(() => {
            try {
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (
                        key.includes(`_sub_id_${quiz.id}_`) ||
                        key.includes(`_emergency_sub_${quiz.id}_`) ||
                        key === `quiz_progress_${quiz.id}`
                    )) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(k => localStorage.removeItem(k));
            } catch (err) {
                console.error("[Luminova Mount Cleanup Error]", err);
            }
        }, [quiz.id]);

        useEffect(() => {
            window.__LUMINOVA_EXAM_IS_SUBMITTING = false;
            submitLockRef.current = false;
            recoveryLockRef.current = false;
            setIsSubmissionBusy(false);
            setSubmissionStep(null);
            return () => {
                window.__LUMINOVA_EXAM_IS_SUBMITTING = false;
                submitLockRef.current = false;
                recoveryLockRef.current = false;
            };
        }, [quiz.id]);

        const [currentIndex, setCurrentIndex] = useState(0);
        const [answers, setAnswers] = useState({});
        const [isFinished, setIsFinished] = useState(false);
        const [serverScore, setServerScore] = useState(null);
        const [serverMaxScore, setServerMaxScore] = useState(null);
        const [serverPercentage, setServerPercentage] = useState(null);
        const [isFeedbackRevealed, setIsFeedbackRevealed] = useState(false);
        const [revealedQuestions, setRevealedQuestions] = useState(new Set());
        const [cheatWarnings, setCheatWarnings] = useState(0);
        const [isLateSubmission, setIsLateSubmission] = useState(false);
        const [isVerifying, setIsVerifying] = useState(false);
        const [gatewayError, setGatewayError] = useState(null);
        const [debugError, setDebugError] = useState(null);
        const [isValidationFailed, setIsValidationFailed] = useState(false);
        const [terminationReason, setTerminationReason] = useState('completed');
        const [modalType, setModalType] = useState(null);
        const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
        const immunityRef = useRef(false);
        const loginTimeRef = useRef(null);
        const finalSubmitStartedRef = useRef(false);
        const isFinalSubmitFlowActive = () => {
            return (
                finalSubmitStartedRef.current === true ||
                window.__LUMINOVA_EXAM_IS_SUBMITTING === true ||
                submitState !== SUBMIT_STATES.IDLE
            );
        };

        useEffect(() => {
            if ((isEvaluation || quiz.endTime) && (!isStarted || !isFinished) && isTimeSynced) {
                const timer = setInterval(() => setNow(getTrueCairoNow()), 1000);
                return () => clearInterval(timer);
            }
        }, [isEvaluation, isStarted, isFinished, isTimeSynced, getTrueCairoNow, quiz.endTime]);

        useEffect(() => {
            const saved = localStorage.getItem('quiz_progress_' + quiz.id);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.studentInfo) setStudentInfo(parsed.studentInfo);
                    if (parsed.answers) {
                        const loadedAnswers = { ...parsed.answers };
                        questions.forEach(q => {
                            if (q && q.id && !(q.id in loadedAnswers)) {
                                loadedAnswers[q.id] = null;
                            }
                        });
                        setAnswers(loadedAnswers);
                    }
                } catch (e) {}
            } else {
                const initialAnswers = {};
                questions.forEach(q => { if (q && q.id) initialAnswers[q.id] = null; });
                setAnswers(initialAnswers);
            }
        }, [quiz.id, questions]);

        useEffect(() => {
            if (isStarted && !isFinished) {
                localStorage.setItem('quiz_progress_' + quiz.id, JSON.stringify({ answers, studentInfo }));
            }
        }, [answers, studentInfo, isStarted, isFinished, quiz.id]);



        // Task 3: Helper — safe exit fullscreen
        const safelyExitFullscreen_ = async () => {
            try {
                if (document.fullscreenElement && document.exitFullscreen) {
                    await document.exitFullscreen();
                }
            } catch (e) {
                // Do not block submission.
            }
        };

        const safeExitFullscreen = () => {
            safelyExitFullscreen_();
        };

        const isExplicitlyTrue = (value) => value === true || value === 'true' || value === 1 || value === '1';

        const isDelayAllowed = () => {
            const settings = quiz.settings || {};
            if (quiz.allowDelay !== undefined || settings.allowDelay !== undefined) {
                return isExplicitlyTrue(quiz.allowDelay) || isExplicitlyTrue(settings.allowDelay);
            }
            return isExplicitlyTrue(quiz.allowLateSubmission) || isExplicitlyTrue(settings.allowLateSubmission);
        };

        const isForceSubmitPolicy = useMemo(() => {
            if (quiz.timeoutPolicy === 'hard-stop') return true;
            if (quiz.timeoutPolicy === 'grace_period') return false;
            if (!quiz.timeoutPolicy) {
                return !isDelayAllowed();
            }
            return quiz.timeoutPolicy === 'force_submit' || quiz.timeoutPolicy === 'منع تسليم';
        }, [quiz.timeoutPolicy, quiz.settings]);

        const setSubmissionLock = (locked) => {
            submitLockRef.current = locked;
            window.__LUMINOVA_EXAM_IS_SUBMITTING = locked;
            setIsSubmitting(locked);
        };

        const safeStorageStudentKey = () => String(studentInfo.email || studentInfo.seatNumber || studentInfo.name || 'student').trim().toLowerCase() || 'student';
        const getSubmissionIdKey = () => `luminova_sub_id_${quiz.id}_${safeStorageStudentKey()}`;
        const getEmergencySubmissionKey = (subId) => {
            const sId = subId || localStorage.getItem(getSubmissionIdKey()) || 'no_sub';
            const sHash = String(quiz.schemaHash || quiz.preparedSchemaHash || 'no_hash');
            return `luminova_emergency_sub_${quiz.id}_${sHash}_${sId}`;
        };

        const readEmergencySubmission = () => {
            try {
                const subId = localStorage.getItem(getSubmissionIdKey());
                if (!subId) return null;
                const key = getEmergencySubmissionKey(subId);
                const raw = localStorage.getItem(key);
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                
                let wrapper = null;
                // Support version 2 structure
                if (parsed && parsed.version === 2 && parsed.payload) {
                    wrapper = parsed;
                } else if (parsed && parsed.timestamp && parsed.payload) {
                    // Normalize old wrapper { timestamp, payload }
                    wrapper = {
                        version: 2,
                        savedAt: new Date(parsed.timestamp).toISOString(),
                        reason: "submit_started",
                        payload: parsed.payload
                    };
                } else if (parsed && parsed.submissionId) {
                    // Normalize raw payload
                    wrapper = {
                        version: 2,
                        savedAt: new Date().toISOString(),
                        reason: "submit_started",
                        payload: parsed
                    };
                }
                
                if (!wrapper || !wrapper.payload) return null;

                // 24 hours TTL: 24 * 60 * 60 * 1000 = 86400000 ms
                const age = Date.now() - new Date(wrapper.savedAt).getTime();
                if (age > 86400000) {
                    debugLog('[Luminova] Stale emergency submission expired via TTL. Removing.');
                    localStorage.removeItem(key);
                    return null;
                }
                return wrapper.payload;
            } catch (error) {
                debugWarn('Unable to parse emergency submission payload:', error);
                return null;
            }
        };

        const writeEmergencySubmission = (payload) => {
            const wrapper = {
                version: 2,
                savedAt: new Date().toISOString(),
                reason: "submit_started",
                payload: payload
            };
            const key = getEmergencySubmissionKey(payload.submissionId);
            const serialized = JSON.stringify(wrapper);
            localStorage.setItem(key, serialized);
            return JSON.stringify(payload);
        };

        const clearSubmissionCaches = () => {
            const subId = localStorage.getItem(getSubmissionIdKey());
            if (subId) {
                localStorage.removeItem(getEmergencySubmissionKey(subId));
            }
            localStorage.removeItem(getSubmissionIdKey());
            localStorage.removeItem('quiz_progress_' + quiz.id);
        };

        const createSubmissionId = () => {
            if (window.crypto && window.crypto.randomUUID) {
                return `SUB_${Date.now()}_${window.crypto.randomUUID().slice(0, 8)}`;
            }
            return `SUB_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        };

        const getOrCreateSubmissionId = () => {
            const existing = localStorage.getItem(getSubmissionIdKey());
            if (existing) return existing;
            const submissionId = createSubmissionId();
            localStorage.setItem(getSubmissionIdKey(), submissionId);
            return submissionId;
        };

        const canonicalSerialize = (value) => {
            if (value === null || typeof value !== 'object') return JSON.stringify(value);
            if (Array.isArray(value)) return '[' + value.map(item => canonicalSerialize(item)).join(',') + ']';
            return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonicalSerialize(value[key])).join(',') + '}';
        };

        const deterministicFallbackHash = (text) => {
            let h1 = 0xdeadbeef;
            let h2 = 0x41c6ce57;
            for (let i = 0; i < text.length; i++) {
                const ch = text.charCodeAt(i);
                h1 = Math.imul(h1 ^ ch, 2654435761);
                h2 = Math.imul(h2 ^ ch, 1597334677);
            }
            h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
            h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
            return 'fallback-' + (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
        };

        const hashText = async (text) => {
            if (window.crypto?.subtle && window.TextEncoder) {
                const bytes = new TextEncoder().encode(text);
                const digest = await window.crypto.subtle.digest('SHA-256', bytes);
                return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
            }
            return deterministicFallbackHash(text);
        };

        const withWatchdog = async (promise, timeoutMs, label) => {
            const timeout = new Promise((_, reject) => {
                setTimeout(() => reject(new Error(label || 'Request watchdog timeout')), timeoutMs);
            });
            return Promise.race([promise, timeout]);
        };

        const showSubmissionFailure = (error) => {
            const code = error?.code || error?.status || '';
            const detail = error?.message || String(error || '');

            if (code === 'submission_conflict' || code === 'verification_hash_mismatch') {
                setIsConflict(true);
                setDebugError(lang === 'ar' 
                    ? 'تعذر تأكيد التسليم بسبب تعارض في بيانات التحقق. يرجى التواصل مع الإدارة.' 
                    : 'Submission verification failed due to verification mismatch or conflict. Please contact administration.');
                setSubmissionLock(false);
                setModalType('submission_failed');
                return;
            }

            setDebugError(code === 'DATA_INCOMPLETE'
                ? (lang === 'ar' ? `DATA_INCOMPLETE: عدد الإجابات غير مكتمل أو لا يطابق عدد الأسئلة. ${detail}` : `DATA_INCOMPLETE: response count mismatch. ${detail}`)
                : detail);
            setSubmissionLock(false);
            setModalType('submission_failed');
        };

        const markVerified = () => {
            safeExitFullscreen();
            setIsFinished(true);
            setSubmissionLock(false);
            setDebugError(null);
            clearSubmissionCaches();
            setModalType('verify_success');
        };

        const verifyImmutablePayload = async (payload, options = {}) => {
            if (!payload || !payload.submissionId || !payload.verificationHash || !payload.payloadHash) {
                throw new Error('Missing immutable verification metadata.');
            }

            setModalType('submission_progress');
            setSubmitState('verifying');
            const maxPolls = options.manual ? 1 : 8;

            try {
                for (let attempt = 1; attempt <= maxPolls; attempt++) {
                    const result = await withWatchdog(
                        Luminova.Services.GAS.verifySubmission(quiz.webhookUrl, {
                            submissionId: payload.submissionId,
                            verificationHash: payload.verificationHash,
                            payloadHash: payload.payloadHash,
                            responseCount: payload.responseCount,
                            expectedQuestionCount: payload.expectedQuestionCount,
                            quizId: payload.quizId,
                            schemaHash: payload.schemaHash,
                            spreadsheetId: payload.spreadsheetId,
                            sheetName: payload.sheetName
                        }),
                        VERIFY_WATCHDOG_MS,
                        'Verification watchdog timeout'
                    );

                    debugLog("[Luminova Verify Response]", result);

                    if (result.ok && result.verified) {
                        if (result.score !== undefined && result.score !== null) setServerScore(result.score);
                        if (result.maxScore !== undefined && result.maxScore !== null) setServerMaxScore(result.maxScore);
                        if (result.percentage !== undefined && result.percentage !== null) setServerPercentage(result.percentage);
                        setSubmitState('success');
                        await new Promise(r => setTimeout(r, 1500));
                        currentSubmitAttemptRef.current = null;
                        markVerified();
                        return true;
                    }

                    if (result.code === 'verification_hash_mismatch' || result.code === 'submission_conflict') {
                        setSubmitState('conflict');
                        setIsConflict(true);
                        setSubmissionLock(false);
                        setIsSubmissionBusy(false);
                        setModalType('submission_failed');
                        return false;
                    }

                    if (result.status === 'error') {
                        throw new Error(result.raw?.message || 'Server returned error status');
                    }

                    const isNotFound = (result.ok && !result.verified && result.code === 'submission_not_found');
                    if (!isNotFound) {
                        throw new Error(result.raw?.message || `Unexpected verification status: ${result.status || 'empty'}`);
                    }

                    if (attempt < maxPolls) {
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                }

                setSubmitState('failed');
                setSubmissionLock(false);
                setIsSubmissionBusy(false);
                setModalType('submission_failed');
                return false;
            } catch (error) {
                console.error("[Luminova Verification Loop Error]", error);
                setSubmissionLock(false);
                setIsSubmissionBusy(false);
                const isConflictErr = error?.code === 'submission_conflict' || error?.code === 'verification_hash_mismatch';
                if (isConflictErr) {
                    setSubmitState('conflict');
                    setIsConflict(true);
                } else {
                    setSubmitState('failed');
                }
                setModalType('submission_failed');
                return false;
            }
        };

        const submitImmutablePayload = async (payload) => {
            if (!payload || !payload.submissionId) throw new Error('Missing cached submission payload.');
            verifyPayloadRef.current = payload;
            setSubmissionLock(true);
            setHasAttemptedSubmit(true);
            setModalType('submission_loader');

            const result = await withWatchdog(
                Luminova.Services.GAS.submitExam(quiz.webhookUrl || '', JSON.parse(JSON.stringify(payload))),
                SUBMIT_EXAM_WATCHDOG_MS,
                'Submit watchdog timeout'
            );

            debugLog("[Luminova Submit Response]", result);

            if (!result.ok || !result.accepted) {
                const err = new Error(result.raw?.message || `Submit rejected: ${result.status || 'empty'}`);
                err.code = result.code;
                err.status = result.status;
                throw err;
            }

            if (result.score !== undefined && result.score !== null) setServerScore(result.score);
            if (result.maxScore !== undefined && result.maxScore !== null) setServerMaxScore(result.maxScore);
            if (result.percentage !== undefined && result.percentage !== null) setServerPercentage(result.percentage);

            if (result.verified) {
                markVerified();
            } else {
                await verifyImmutablePayload(payload);
            }
        };

        const getCurrentSchemaContext = () => ({
            quizId: String(quiz.quizId || quiz.examId || quiz.examCode || quiz.code || quiz.id || ''),
            schemaHash: String(quiz.schemaHash || quiz.preparedSchemaHash || ''),
            spreadsheetId: String(quiz.spreadsheetId || quiz.resultSpreadsheetId || '')
        });

        const validateCachedPayload = (cachedPayload) => {
            if (!cachedPayload) return { ok: false, reason: 'missing' };

            const ctx = getCurrentSchemaContext();

            if (!cachedPayload.submissionId || 
                !cachedPayload.quizId || 
                !cachedPayload.schemaHash || 
                !cachedPayload.payloadHash || 
                !cachedPayload.verificationHash || 
                !Array.isArray(cachedPayload.answers)) {
                return { ok: false, reason: 'missing_keys' };
            }

            if (ctx.spreadsheetId && !cachedPayload.spreadsheetId) {
                return { ok: false, reason: 'missing_spreadsheetId' };
            }
            if (quiz.sheetName && !cachedPayload.sheetName) {
                return { ok: false, reason: 'missing_sheetName' };
            }

            if (String(cachedPayload.quizId || '') !== ctx.quizId) {
                return { ok: false, reason: 'quizId_mismatch' };
            }
            if (String(cachedPayload.schemaHash || '') !== ctx.schemaHash) {
                return { ok: false, reason: 'schemaHash_mismatch' };
            }
            if (ctx.spreadsheetId && String(cachedPayload.spreadsheetId || '') !== ctx.spreadsheetId) {
                return { ok: false, reason: 'spreadsheetId_mismatch' };
            }

            const expectedCount = Number(cachedPayload.expectedQuestionCount || 0);
            const expectedCountAlt = Number(cachedPayload.expectedAnswerCount || 0);
            const ansLength = cachedPayload.answers.length;

            if (ansLength !== expectedCount && ansLength !== expectedCountAlt) {
                return { ok: false, reason: 'answers_length_mismatch' };
            }

            return { ok: true, ctx };
        };

        const retrySubmissionSync = async () => {
            if (submitLockRef.current || isSubmissionBusy) return;

            // Set final submit guards synchronously at the top of retry (before any async call)
            finalSubmitStartedRef.current = true;
            window.__LUMINOVA_EXAM_IS_SUBMITTING = true;
            setSubmissionLock(true);
            setIsSubmissionBusy(true);
            setModalType('submission_progress');
            setSubmitState(SUBMIT_STATES.RETRYING_VERIFY);
            setIsConflict(false);

            const cachedAttempt = currentSubmitAttemptRef.current;
            const cachedPayload = cachedAttempt?.immutablePayload;
            if (!cachedAttempt || !cachedPayload) {
                setIsCorrupt(true);
                setSubmitState(SUBMIT_STATES.FAILED);
                setModalType('submission_failed');
                setSubmissionLock(false);
                setIsSubmissionBusy(false);
                window.__LUMINOVA_EXAM_IS_SUBMITTING = false;
                return;
            }
            const validation = validateCachedPayload(cachedPayload);
            if (!validation.ok) {
                setIsCorrupt(true);
                setSubmitState(SUBMIT_STATES.FAILED);
                setModalType('submission_failed');
                setSubmissionLock(false);
                setIsSubmissionBusy(false);
                window.__LUMINOVA_EXAM_IS_SUBMITTING = false;
                return;
            }

            const isLockErr = (err) => {
                const msg = err?.message || "";
                return msg.includes("مهلة التأمين") || msg.includes("تؤجل التأمين") || msg.includes("Lock timeout") || msg.includes("lock");
            };

            try {
                // 1. Retry starts with verification only (Correction 8)
                const verifyResult = await withWatchdog(
                    Luminova.Services.GAS.retryVerifySubmission(quiz.webhookUrl, {
                        spreadsheetId: cachedPayload.spreadsheetId,
                        submissionId: cachedPayload.submissionId,
                        quizId: cachedPayload.quizId,
                        schemaHash: cachedPayload.schemaHash,
                        sheetName: cachedPayload.sheetName,
                        payloadHash: cachedPayload.payloadHash,
                        verificationHash: cachedPayload.verificationHash,
                        expectedAnswerCount: cachedPayload.expectedQuestionCount,
                        expectedQuestionCount: cachedPayload.expectedQuestionCount
                    }),
                    VERIFY_WATCHDOG_MS,
                    'Verification watchdog timeout'
                );

                debugLog("[Luminova Retry Verify Response]", verifyResult);

                if (verifyResult.ok && verifyResult.verified) {
                    if (verifyResult.score !== undefined && verifyResult.score !== null) setServerScore(verifyResult.score);
                    if (verifyResult.maxScore !== undefined && verifyResult.maxScore !== null) setServerMaxScore(verifyResult.maxScore);
                    if (verifyResult.percentage !== undefined && verifyResult.percentage !== null) setServerPercentage(verifyResult.percentage);
                    
                    setSubmitState(SUBMIT_STATES.SUCCESS);
                    await new Promise(r => setTimeout(r, 1500));
                    currentSubmitAttemptRef.current = null;
                    markVerified();
                    return;
                }

                if (verifyResult.code === 'submission_conflict' || verifyResult.code === 'verification_hash_mismatch') {
                    setSubmitState(SUBMIT_STATES.CONFLICT);
                    setIsConflict(true);
                    setSubmissionLock(false);
                    setIsSubmissionBusy(false);
                    setModalType('submission_failed');
                    return;
                }

                if (verifyResult.status === 'error') {
                    const err = new Error(verifyResult.raw?.message || 'Server returned error status');
                    err.code = verifyResult.code;
                    err.status = verifyResult.status;
                    throw err;
                }

                // 2. If it needs repair (answer count mismatch)
                if (verifyResult.ok && verifyResult.needsRepair && verifyResult.code === 'answer_count_mismatch') {
                    setSubmitState(SUBMIT_STATES.SENDING);
                    const repairResult = await withWatchdog(
                        Luminova.Services.GAS.repairSubmissionAnswers(quiz.webhookUrl, cachedPayload),
                        15000,
                        'Repair watchdog timeout'
                    );

                    debugLog("[Luminova Repair Response]", repairResult);

                    if (repairResult.ok && repairResult.repaired) {
                        setSubmitState(SUBMIT_STATES.RETRYING_VERIFY);
                        const finalVerify = await withWatchdog(
                            Luminova.Services.GAS.retryVerifySubmission(quiz.webhookUrl, {
                                spreadsheetId: cachedPayload.spreadsheetId,
                                submissionId: cachedPayload.submissionId,
                                quizId: cachedPayload.quizId,
                                schemaHash: cachedPayload.schemaHash,
                                sheetName: cachedPayload.sheetName,
                                payloadHash: cachedPayload.payloadHash,
                                verificationHash: cachedPayload.verificationHash,
                                expectedAnswerCount: cachedPayload.expectedQuestionCount,
                                expectedQuestionCount: cachedPayload.expectedQuestionCount
                            }),
                            VERIFY_WATCHDOG_MS,
                            'Verification watchdog timeout'
                        );

                        debugLog("[Luminova Final Verify Response]", finalVerify);

                        if (finalVerify.ok && finalVerify.verified) {
                            if (finalVerify.score !== undefined && finalVerify.score !== null) setServerScore(finalVerify.score);
                            if (finalVerify.maxScore !== undefined && finalVerify.maxScore !== null) setServerMaxScore(finalVerify.maxScore);
                            if (finalVerify.percentage !== undefined && finalVerify.percentage !== null) setServerPercentage(finalVerify.percentage);
                            
                            setSubmitState(SUBMIT_STATES.SUCCESS);
                            await new Promise(r => setTimeout(r, 1500));
                            currentSubmitAttemptRef.current = null;
                            markVerified();
                            return;
                        }
                    }
                    throw new Error("Repair failed or unverified");
                }

                // 3. If submission_not_found, then no server lock is active, and it is safe to resubmit (Correction 9)
                if (verifyResult.ok && !verifyResult.verified && verifyResult.code === 'submission_not_found') {
                    setSubmitState(SUBMIT_STATES.SENDING);
                    const submitResult = await withWatchdog(
                        Luminova.Services.GAS.submitExam(quiz.webhookUrl || '', JSON.parse(JSON.stringify(cachedPayload))),
                        SUBMIT_EXAM_WATCHDOG_MS,
                        'Submit watchdog timeout'
                    );

                    debugLog("[Luminova Submit Response during recovery]", submitResult);

                    if (submitResult.ok && submitResult.accepted) {
                        if (submitResult.score !== undefined && submitResult.score !== null) setServerScore(submitResult.score);
                        if (submitResult.maxScore !== undefined && submitResult.maxScore !== null) setServerMaxScore(submitResult.maxScore);
                        if (submitResult.percentage !== undefined && submitResult.percentage !== null) setServerPercentage(submitResult.percentage);

                        if (submitResult.verified) {
                            setSubmitState(SUBMIT_STATES.SUCCESS);
                            await new Promise(r => setTimeout(r, 1500));
                            currentSubmitAttemptRef.current = null;
                            markVerified();
                            return;
                        } else {
                            setSubmitState(SUBMIT_STATES.VERIFYING);
                            await verifyImmutablePayload(cachedPayload);
                            return;
                        }
                    } else {
                        const err = new Error(submitResult.raw?.message || `Submit rejected: ${submitResult.status || 'empty'}`);
                        err.code = submitResult.code;
                        err.status = submitResult.status;
                        throw err;
                    }
                }

                throw new Error("Verification check returned unhandled status");

            } catch (error) {
                console.error("[Luminova Retry Error]", error);
                
                const isConflictErr = error?.code === 'submission_conflict' || error?.code === 'verification_hash_mismatch';
                const isLock = isLockErr(error) || error?.message?.includes("watchdog");

                if (isConflictErr) {
                    setSubmitState(SUBMIT_STATES.CONFLICT);
                    setIsConflict(true);
                    setSubmissionLock(false);
                    setIsSubmissionBusy(false);
                    setModalType('submission_failed');
                } else if (isLock) {
                    // Treat as busy/pending, run uncertain check
                    await runUncertainVerificationCheck(cachedPayload, 3);
                } else {
                    setSubmitState(SUBMIT_STATES.FAILED);
                    setSubmissionLock(false);
                    setIsSubmissionBusy(false);
                    setModalType('submission_failed');
                }
            }
        };

        // Auto-recovery on mount/load has been disabled to ensure page reloads start clean from the beginning.

        const clearLocalAttempt = () => {
            clearSubmissionCaches();
            setDebugError(null);
            setModalType(null);
            setSubmissionLock(false);
            setIsSubmitting(false);
            setIsConflict(false);
            setIsSubmissionBusy(false);
            setSubmissionStep(null);
            recoveryLockRef.current = false;
        };

        const runUncertainVerificationCheck = async (cachedPayload, maxRetries = UNCERTAIN_VERIFY_MAX_RETRIES) => {
            setSubmitState(SUBMIT_STATES.UNCERTAIN);
            setModalType('submission_progress');
            setIsSubmissionBusy(true);

            const isLockErr = (err) => {
                const msg = err?.message || "";
                return msg.includes("مهلة التأمين") || msg.includes("تؤجل التأمين") || msg.includes("Lock timeout") || msg.includes("lock");
            };

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    // Backoff delay: wait UNCERTAIN_VERIFY_DELAY_MS before checking
                    await new Promise(r => setTimeout(r, UNCERTAIN_VERIFY_DELAY_MS));

                    setSubmitState(SUBMIT_STATES.RETRYING_VERIFY);
                    const verifyResult = await withWatchdog(
                        Luminova.Services.GAS.retryVerifySubmission(quiz.webhookUrl, {
                            spreadsheetId: cachedPayload.spreadsheetId,
                            submissionId: cachedPayload.submissionId,
                            quizId: cachedPayload.quizId,
                            schemaHash: cachedPayload.schemaHash,
                            sheetName: cachedPayload.sheetName,
                            payloadHash: cachedPayload.payloadHash,
                            verificationHash: cachedPayload.verificationHash,
                            expectedAnswerCount: cachedPayload.expectedQuestionCount,
                            expectedQuestionCount: cachedPayload.expectedQuestionCount
                        }),
                        VERIFY_WATCHDOG_MS,
                        'Verification watchdog timeout'
                    );

                    debugLog("[Luminova Uncertain Verification Check]", attempt, verifyResult);

                    if (verifyResult.ok && verifyResult.verified) {
                        if (verifyResult.score !== undefined && verifyResult.score !== null) setServerScore(verifyResult.score);
                        if (verifyResult.maxScore !== undefined && verifyResult.maxScore !== null) setServerMaxScore(verifyResult.maxScore);
                        if (verifyResult.percentage !== undefined && verifyResult.percentage !== null) setServerPercentage(verifyResult.percentage);
                        
                        setSubmitState(SUBMIT_STATES.SUCCESS);
                        await new Promise(r => setTimeout(r, 1500));
                        currentSubmitAttemptRef.current = null;
                        markVerified();
                        return true;
                    }

                    if (verifyResult.code === 'submission_conflict' || verifyResult.code === 'verification_hash_mismatch') {
                        setSubmitState(SUBMIT_STATES.CONFLICT);
                        setIsConflict(true);
                        setSubmissionLock(false);
                        setIsSubmissionBusy(false);
                        setModalType('submission_failed');
                        return false;
                    }

                    // For submission_not_found or busy/lock, keep verifying in the loop
                    setSubmitState(SUBMIT_STATES.UNCERTAIN);

                } catch (err) {
                    console.error("[Luminova Uncertain Verification Exception]", attempt, err);
                    if (err?.code === 'submission_conflict' || err?.code === 'verification_hash_mismatch') {
                        setSubmitState(SUBMIT_STATES.CONFLICT);
                        setIsConflict(true);
                        setSubmissionLock(false);
                        setIsSubmissionBusy(false);
                        setModalType('submission_failed');
                        return false;
                    }
                    if (!isLockErr(err) && !err?.message?.includes("watchdog")) {
                        setSubmitState(SUBMIT_STATES.FAILED);
                        setSubmissionLock(false);
                        setIsSubmissionBusy(false);
                        setModalType('submission_failed');
                        return false;
                    }
                    setSubmitState(SUBMIT_STATES.UNCERTAIN);
                }
            }

            setSubmitState(SUBMIT_STATES.FAILED);
            setSubmissionLock(false);
            setIsSubmissionBusy(false);
            setModalType('submission_failed');
            return false;
        };

        const submitExam = async (reason = 'completed') => {
            if (submitLockRef.current || window.__LUMINOVA_EXAM_IS_SUBMITTING === true || isSubmissionBusy) return;
            
            // Set final submit guards synchronously at the very top of submitExam before any other logic or async operations
            finalSubmitStartedRef.current = true;
            window.__LUMINOVA_EXAM_IS_SUBMITTING = true;
            setHasAttemptedSubmit(true);
            setSubmitState(SUBMIT_STATES.PREPARING);
            setModalType('submission_progress');
            setSubmissionStep('preparing');
            setSubmissionLock(true);
            setIsSubmissionBusy(true);

            setIsValidationFailed(false);

            if (!isEvaluationExam()) {
                safeExitFullscreen();
                clearLocalAttempt();
                setIsFinished(true);
                setTerminationReason(reason);
                return;
            }

            if (!isTimeSynced || cairoOffsetMs === null) {
                setSubmitState(SUBMIT_STATES.FAILED);
                setModalType('submission_failed');
                setSubmissionLock(false);
                setIsSubmissionBusy(false);
                window.__LUMINOVA_EXAM_IS_SUBMITTING = false;
                return;
            }

            // Synchronous Exit Fullscreen immediately from user gesture path
            await safelyExitFullscreen_();

            // 1. Build and validate answers array strictly
            const orderedQuestionsForMatrix = Array.isArray(quiz.questions) ? quiz.questions : questions;
            const expectedQuestionCount = orderedQuestionsForMatrix.length;

            const resolveQuestionScore = (que) => {
                if (que.type === 'essay') return 0;
                const result = gradeQuestionAnswer(que, answers[que.id]);
                const qPoints = Number(que.maxPoints ?? que.points ?? que.score ?? 1);
                return result.isCorrect ? qPoints : 0;
            };

            const getQuestionOptions = (que) => {
                if (Array.isArray(que.options)) return que.options;
                if (Array.isArray(que.optionsAr)) return que.optionsAr;
                if (Array.isArray(que.optionsEn)) return que.optionsEn;
                return [];
            };

            const sanitizeValue = (val) => {
                if (val === null || val === undefined) return null;
                if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return val;
                if (Array.isArray(val)) return val.map(v => sanitizeValue(v));
                return 'Invalid Format';
            };

            const resolveAnswerText = (que) => {
                const raw = answers[que.id];
                if (raw === null || raw === undefined || raw === '') return '';
                if (Array.isArray(raw) && raw.length === 0) return '';
                const opts = getQuestionOptions(que);
                if (que.type === 'mcq' || que.type === 'true_false') {
                    return typeof raw === 'number' && opts[raw] !== undefined ? optionToText(opts[raw]) : sanitizeValue(raw);
                }
                if (que.type === 'multi_select') {
                    if (Array.isArray(raw)) return raw.map(idx => opts[idx] !== undefined ? optionToText(opts[idx]) : String(idx)).join(' | ');
                    return sanitizeValue(raw);
                }
                return sanitizeValue(raw);
            };

            const orderedAnswers = orderedQuestionsForMatrix.map((que, originalIndex) => {
                const canonicalOriginalIndex = Number(que.originalIndex ?? que.original_index ?? originalIndex);
                const questionId = String(que.questionId ?? que.id ?? que.uuid ?? "");
                const rawAns = answers[que.id];
                const hasAnswer = rawAns !== undefined && rawAns !== null && rawAns !== '' && !(Array.isArray(rawAns) && rawAns.length === 0);
                
                let status = "blank";
                const earnedPoints = Number(resolveQuestionScore(que) || 0);
                const maxPoints = Number(que.maxPoints ?? que.points ?? que.score ?? 1);
                
                if (hasAnswer) {
                    if (que.type === "essay") {
                        status = "pending";
                    } else if (earnedPoints >= maxPoints && maxPoints > 0) {
                        status = "correct";
                    } else if (earnedPoints > 0) {
                        status = "partial";
                    } else {
                        status = "wrong";
                    }
                }

                const ansText = resolveAnswerText(que) || "";
                return {
                    questionId: questionId || String(originalIndex),
                    originalIndex: canonicalOriginalIndex,
                    studentAnswer: ansText,
                    answer: ansText,
                    status: status,
                    earnedPoints: earnedPoints
                };
            });

            const submissionId = getOrCreateSubmissionId();
            const spreadsheetId = String(quiz.spreadsheetId || quiz.resultSpreadsheetId || "");
            const sheetName = String(quiz.sheetName || '');
            const canonicalQuizId = String(quiz.quizId || quiz.examId || quiz.examCode || quiz.code || quiz.id || "");
            const schemaHash = String(quiz.schemaHash || quiz.preparedSchemaHash || '');

            // Proceed with snapshot generation
            const serverNow = getTrueCairoNow();
            if (quiz.endTime && serverNow && serverNow > parseCairoDeadline(quiz.endTime)) {
                setIsLateSubmission(true);
            }

            let score = 0;
            questions.forEach(que => {
                if (que.type === 'essay') return;
                const result = gradeQuestionAnswer(que, answers[que.id]);
                if (result.isCorrect) score += Number(que.score);
            });

            const ipAddress = await Luminova.Services.GAS.getIPAddress();
            const payloadSnapshot = {
                student: {
                    name: studentInfo.name || "غير مسجل",
                    department: studentInfo.department || "غير مسجل",
                    email: studentInfo.email || "غير مسجل",
                    seatNumber: studentInfo.seatNumber || "غير مسجل"
                },
                quizId: canonicalQuizId,
                attempt: {
                    submissionId: submissionId,
                    entryTime: entryTime ? entryTime.toISOString() : null,
                    exitTime: getTrueCairoNow()?.toISOString() || null,
                    terminationReason: String(reason),
                    isLateSubmission: isLateSubmission || (quiz.endTime && serverNow && serverNow > parseCairoDeadline(quiz.endTime)) || false
                },
                answers: orderedAnswers,
                expectedQuestionCount: expectedQuestionCount,
                responseCount: expectedQuestionCount
            };

            const payloadHash = await hashText(canonicalSerialize(payloadSnapshot));
            const verificationHash = await hashText(canonicalSerialize({
                submissionId: submissionId,
                quizId: canonicalQuizId,
                studentEmail: String(studentInfo.email || '').trim().toLowerCase(),
                payloadHash: payloadHash,
                responseCount: expectedQuestionCount,
                expectedQuestionCount: expectedQuestionCount
            }));

            // Full Payload Validation (Section 7)
            const validationErrors = [];
            if (orderedAnswers.length !== expectedQuestionCount) {
                validationErrors.push("expectedAnswerCount mismatch");
            }
            orderedAnswers.forEach((ans, idx) => {
                if (!ans.questionId) {
                    validationErrors.push(`Missing questionId for question at index ${idx}`);
                }
            });

            if (!submissionId) validationErrors.push("Missing submissionId");
            if ((quiz.spreadsheetId || quiz.resultSpreadsheetId) && !spreadsheetId) {
                validationErrors.push("Missing spreadsheetId");
            }
            if (quiz.sheetName && !sheetName) {
                validationErrors.push("Missing sheetName");
            }
            if (!canonicalQuizId) validationErrors.push("Missing quizId");
            if (!schemaHash) validationErrors.push("Missing schemaHash");
            if (!payloadHash) validationErrors.push("Missing payloadHash");
            if (!verificationHash) validationErrors.push("Missing verificationHash");

            if (validationErrors.length > 0) {
                if (LUMINOVA_DEBUG) {
                    window.console.warn("[Luminova Submit Validation Failed]", {
                        errors: validationErrors,
                        quizId: canonicalQuizId,
                        schemaHash: schemaHash,
                        spreadsheetIdPresent: !!spreadsheetId,
                        sheetName: sheetName,
                        submissionId: submissionId,
                        expectedQuestionCount: expectedQuestionCount,
                        expectedAnswerCount: expectedQuestionCount,
                        answersCount: orderedAnswers?.length,
                        payloadHashPresent: !!payloadHash,
                        verificationHashPresent: !!verificationHash
                    });
                }
                console.error("[Luminova Submit Validation Failed]", validationErrors);
                setSubmissionLock(false);
                setIsSubmissionBusy(false);
                setSubmissionStep('error');
                setIsValidationFailed(true);
                setModalType('submission_failed');
                return;
            }

            const atomicPayload = {
                action: "submit_exam",
                schemaVersion: 2,
                quizId: canonicalQuizId,
                schemaHash: schemaHash,
                spreadsheetId: spreadsheetId,
                sheetName: sheetName,
                submissionId: submissionId,
                student: {
                    name: studentInfo.name || "غير مسجل",
                    email: studentInfo.email || "غير مسجل",
                    seatNumber: studentInfo.seatNumber || "غير مسجل",
                    department: studentInfo.department || "غير مسجل",
                    entryTime: entryTime ? entryTime.toISOString() : null,
                    exitTime: getTrueCairoNow()?.toISOString() || null,
                    ipAddress: ipAddress,
                    terminationReason: String(reason),
                    lateSubmission: String(isLateSubmission || (quiz.endTime && serverNow && serverNow > parseCairoDeadline(quiz.endTime)) || false)
                },
                score: score,
                maxScore: maxScore,
                answers: orderedAnswers,
                displayedOrder: questions.map(q => String(q.questionId ?? q.id ?? "")),
                payloadHash: payloadHash,
                verificationHash: verificationHash,
                responseCount: expectedQuestionCount,
                expectedQuestionCount: expectedQuestionCount
            };

            // Developer logs strictly kept in console
            debugLog("[Luminova Submit Payload]", {
                action: atomicPayload.action,
                quizId: atomicPayload.quizId,
                schemaHash: atomicPayload.schemaHash,
                submissionId: atomicPayload.submissionId,
                spreadsheetIdPresent: !!atomicPayload.spreadsheetId,
                sheetName: atomicPayload.sheetName,
                expectedQuestionCount: atomicPayload.expectedQuestionCount,
                expectedAnswerCount: atomicPayload.expectedQuestionCount,
                answersCount: Array.isArray(atomicPayload.answers) ? atomicPayload.answers.length : 0
            });

            const immutablePayload = JSON.parse(JSON.stringify(atomicPayload));
            
            currentSubmitAttemptRef.current = {
                submissionId: submissionId,
                payloadHash: payloadHash,
                immutablePayload: immutablePayload,
                createdAt: Date.now()
            };
            writeEmergencySubmission(immutablePayload);
            verifyPayloadRef.current = immutablePayload;
            verifyReasonRef.current = reason;

            try {
                setSubmissionStep('sending');
                setSubmitState(SUBMIT_STATES.SENDING);
                const result = await withWatchdog(
                    Luminova.Services.GAS.submitExam(quiz.webhookUrl || '', JSON.parse(JSON.stringify(immutablePayload))),
                    SUBMIT_EXAM_WATCHDOG_MS,
                    'Submit watchdog timeout'
                );

                debugLog("[Luminova Submit Response]", result);

                if (!result.ok || !result.accepted) {
                    const err = new Error(result.raw?.message || `Submit rejected: ${result.status || 'empty'}`);
                    err.code = result.code;
                    err.status = result.status;
                    throw err;
                }

                if (result.score !== undefined && result.score !== null) setServerScore(result.score);
                if (result.maxScore !== undefined && result.maxScore !== null) setServerMaxScore(result.maxScore);
                if (result.percentage !== undefined && result.percentage !== null) setServerPercentage(result.percentage);

                if (result.verified) {
                    setSubmissionStep('success');
                    setSubmitState(SUBMIT_STATES.SUCCESS);
                    await new Promise(r => setTimeout(r, 1500));
                    markVerified();
                } else {
                    setSubmissionStep('verifying');
                    setSubmitState(SUBMIT_STATES.VERIFYING);
                    await verifyImmutablePayload(immutablePayload);
                }
            } catch (error) {
                console.error("[Luminova Submit Error]", error);
                
                const isConflictErr = error?.code === 'submission_conflict' || error?.code === 'verification_hash_mismatch';
                const isLock = error?.message && (
                    error.message.includes("مهلة التأمين") ||
                    error.message.includes("تؤجل التأمين") ||
                    error.message.includes("Lock timeout") ||
                    error.message.includes("lock")
                );
                const isWatchdogTimeout = error?.message && error.message.includes("Submit watchdog timeout");

                if (isConflictErr) {
                    setIsConflict(true);
                    setSubmissionStep('conflict');
                    setSubmitState(SUBMIT_STATES.CONFLICT);
                    setSubmissionLock(false);
                    setIsSubmissionBusy(false);
                    setModalType('submission_failed');
                } else if (isWatchdogTimeout || isLock) {
                    // Watchdog timeout or Server Lock
                    // Transition: SENDING -> UNCERTAIN -> RETRYING_VERIFY
                    // Do not call submit_exam again while the first submit may still be running.
                    debugLog("[Luminova Submit] Watchdog/Lock error caught, running uncertain verification check...");
                    const success = await runUncertainVerificationCheck(immutablePayload, 3);
                    if (!success) {
                        setSubmissionStep('error');
                        setSubmitState(SUBMIT_STATES.FAILED);
                        setSubmissionLock(false);
                        setIsSubmissionBusy(false);
                        setModalType('submission_failed');
                    }
                } else {
                    setSubmissionStep('error');
                    setSubmitState(SUBMIT_STATES.FAILED);
                    setSubmissionLock(false);
                    setIsSubmissionBusy(false);
                    setModalType('submission_failed');
                }
            }
        };

        const handleVerifyDelivery = async () => {
            if (!quiz.webhookUrl || submitLockRef.current) return;
            const cachedPayload = readEmergencySubmission() || verifyPayloadRef.current;
            if (!cachedPayload) {
                setDebugError(lang === 'ar' ? 'لا يوجد ملف إجابات محفوظ للتحقق منه.' : 'No cached submission payload is available to verify.');
                setModalType('submission_failed');
                return;
            }
            setSubmissionLock(true);
            try {
                await verifyImmutablePayload(cachedPayload, { manual: true });
            } catch (verifyErr) {
                console.error('Verification check failed:', verifyErr);
                setDebugError(verifyErr?.message || 'Verification network error');
                setSubmissionLock(false);
                setModalType('verification_mismatch');
            }
        };

        useEffect(() => {
            if (isStarted && !isFinished && isEvaluation && quiz.endTime && isTimeSynced && now) {
                const deadline = parseCairoDeadline(quiz.endTime);
                if (deadline && now >= deadline) {
                    if (isForceSubmitPolicy) {
                        if (!timeExpiredSubmitRef.current) {
                            timeExpiredSubmitRef.current = true;
                            submitExam('time_expired_force');
                        }
                    } else {
                        if (!isLateSubmission) {
                            setIsLateSubmission(true);
                        }
                    }
                }
            }
        }, [now, isStarted, isFinished, isEvaluation, isTimeSynced, quiz?.endTime, isForceSubmitPolicy, isLateSubmission]);

        useEffect(() => {
            if (isStarted && !isFinished && isEvaluation && !hasAttemptedSubmit && submitState === SUBMIT_STATES.IDLE) {
                const cheatGuard = () => {
                    if (isFinalSubmitFlowActive()) return;
                    if (immunityRef.current || isSubmitting || submitState !== SUBMIT_STATES.IDLE) return;
                    if (!isStarted || hasAttemptedSubmit) return;
                    if (cheatWarnings === 0) {
                        setCheatWarnings(1);
                        setModalType('cheat_warning');
                    } else {
                        submitExam('anti_cheat_violation');
                    }
                };

                // Tab switch / app switch
                const handleVisibility = () => {
                    if (isFinalSubmitFlowActive()) return;
                    if (immunityRef.current || !isStarted) return;
                    if (document.hidden) cheatGuard();
                };

                // Window blur (fallback for visibility)
                const handleBlur = () => {
                    if (isFinalSubmitFlowActive()) return;
                    if (immunityRef.current || !isStarted) return;
                    cheatGuard();
                };

                // Fullscreen exit detection
                const handleFullscreenChange = () => {
                    if (isFinalSubmitFlowActive()) return;
                    if (immunityRef.current || !isStarted) return;
                    if (!document.fullscreenElement && isStarted && !isFinished) {
                        cheatGuard();
                    }
                };

                const handleBeforeUnload = (e) => {
                    e.preventDefault();
                    e.returnValue = '';
                };

                document.addEventListener('visibilitychange', handleVisibility);
                window.addEventListener('blur', handleBlur);
                document.addEventListener('fullscreenchange', handleFullscreenChange);
                window.addEventListener('beforeunload', handleBeforeUnload);

                return () => {
                    document.removeEventListener('visibilitychange', handleVisibility);
                    window.removeEventListener('blur', handleBlur);
                    document.removeEventListener('fullscreenchange', handleFullscreenChange);
                    window.removeEventListener('beforeunload', handleBeforeUnload);
                };
            }
        }, [isStarted, isFinished, isEvaluation, isSubmitting, hasAttemptedSubmit, cheatWarnings, submitExam, quiz?.autoSubmitOnCheat, submitState]);

        if (!isStarted) {
            // ── EXAM RULES MODAL (Post-Verification, Pre-Start) ──────
            if (modalType === 'exam_rules') {
                const startExamNow = () => {
                    if (!isTimeSynced || cairoOffsetMs === null) return;
                    // Force fullscreen for proctored environment
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(() => {});
                    }
                    loginTimeRef.current = getTrueCairoNow()?.toISOString() || null;
                    setEntryTime(getTrueCairoNow());
                    setModalType(null);
                    setIsStarted(true);
                };

                return html`
                <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#F3EFFB] dark:bg-zinc-950">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    <div className="relative z-10 max-w-lg w-full bg-white/80 dark:bg-zinc-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 animate-fade-in border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white">
                        <div className="text-center mb-8">
                            <svg className="w-20 h-20 mx-auto mb-4 text-zinc-900 dark:text-white drop-shadow-lg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <h2 className="text-3xl font-black mb-2 text-zinc-900 dark:text-white">
                                ${lang === 'ar' ? 'تعليمات الامتحان' : 'Exam Instructions'}
                            </h2>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                ${lang === 'ar' ? 'يرجى قراءة التعليمات بعناية قبل البدء' : 'Please read the instructions carefully before starting'}
                            </p>
                        </div>
                        <div className="space-y-4 mb-8 text-zinc-900 dark:text-white">
                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                                <span className="text-2xl mt-0.5">⏱️</span>
                                <p className="text-sm font-bold text-zinc-700 dark:text-gray-300 leading-relaxed">
                                    ${lang === 'ar'
                                    ? (quiz.endTime ? 'الامتحان محدد بوقت. سيتم تسليم إجاباتك تلقائياً عند انتهاء الوقت.' : 'لا يوجد حد زمني لهذا الامتحان.')
                                    : (quiz.endTime ? 'This exam is timed. Your answers will be auto-submitted when time runs out.' : 'There is no time limit for this exam.')}
                                </p>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                                <span className="text-2xl mt-0.5">🚫</span>
                                <p className="text-sm font-bold text-zinc-800 dark:text-gray-300 leading-relaxed">
                                    ${lang === 'ar'
                                    ? 'نظام مراقبة إلكتروني مفعّل. مغادرة شاشة الامتحان (تبديل التطبيقات أو النوافذ) ستمنحك إنذاراً واحداً فقط. عند التكرار، سيتم سحب الامتحان وتسليمه تلقائياً.'
                                    : 'Electronic proctoring is active. Switching tabs or apps will give you ONE warning only. A second violation will auto-submit and terminate your exam.'}
                                </p>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                                <span className="text-2xl mt-0.5">📝</span>
                                <p className="text-sm font-bold text-zinc-700 dark:text-gray-300 leading-relaxed">
                                    ${lang === 'ar'
                                    ? 'لا يمكنك إعادة الامتحان بعد التسليم. تأكد من مراجعة إجاباتك قبل الضغط على زر الإنهاء.'
                                    : 'You cannot retake the exam after submission. Make sure to review your answers before finishing.'}
                                </p>
                            </div>
                        </div>
                        <button onClick=${startExamNow} className="w-full py-4 rounded-2xl font-black text-xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all hover:scale-[1.02]">
                            ${lang === 'ar' ? '🚀 ابدأ الامتحان الآن' : '🚀 Start Exam Now'}
                        </button>
                    </div>
                </div>`;
            }

            const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentInfo.email);
            const verifyAndStart = async () => {
                // Determine if this is a fresh entry (no active progress and no emergency payload)
                const hasSavedProgress = !!localStorage.getItem('quiz_progress_' + quiz.id);
                const cachedPayload = readEmergencySubmission();
                if (!hasSavedProgress && !cachedPayload) {
                    // Safe to clear stale submission ID (no active/recoverable attempt exists)
                    localStorage.removeItem(getSubmissionIdKey());
                }

                if (!isEvaluationExam()) {
                    setEntryTime(getTrueCairoNow() || new Date());
                    setModalType('exam_rules');
                    return;
                }
                if (!isTimeSynced || cairoOffsetMs === null) {
                    setDebugError(lang === 'ar' ? 'جاري مزامنة وقت الخادم. يرجى المحاولة بعد لحظات.' : 'Server time is still synchronizing. Please try again in a moment.');
                    return;
                }
                if (!quiz.webhookUrl || !quiz.webhookUrl.includes('/macros/s/') || !quiz.webhookUrl.endsWith('/exec')) {
                    setDebugError("INVALID WEBHOOK URL: The URL must be a Web App URL ending in '/exec', not a library or script ID URL.");
                    setGatewayError('network_error');
                    return;
                }

                const shouldCheckDuplicate = (qz) => {
                    const policy = String(qz.duplicatePolicy || "prevent_by_email").trim();
                    if (policy === "allow" || policy === "allow_multiple_entries") {
                        return false;
                    }
                    return true;
                };

                if (!shouldCheckDuplicate(quiz)) {
                    debugLog("[Luminova Duplicate Check] SKIPPED — duplicatePolicy:", quiz.duplicatePolicy);
                    setEntryTime(getTrueCairoNow() || new Date());
                    setModalType('exam_rules');
                    return;
                }

                setIsVerifying(true);
                setGatewayError(null);
                setDebugError(null);
                try {
                    const canonicalQuizId = String(quiz.quizId || quiz.examId || quiz.examCode || quiz.code || quiz.id || "");
                    const spreadsheetId = String(quiz.spreadsheetId || quiz.resultSpreadsheetId || "");
                    const schemaHash = String(quiz.schemaHash || quiz.preparedSchemaHash || "");
                    const duplicatePolicy = quiz.duplicatePolicy || "prevent_by_email";
                    const allowRetakes = quiz.allowRetakes !== undefined ? quiz.allowRetakes : false;
                    const maxAttempts = quiz.maxAttempts !== undefined ? quiz.maxAttempts : 1;
                    debugLog("[Luminova Duplicate Check]", JSON.stringify({
                        quizId: canonicalQuizId,
                        spreadsheetId,
                        schemaHash,
                        duplicatePolicy,
                        allowRetakes,
                        maxAttempts
                    }, null, 2));
                    const response = await Luminova.Services.GAS.verifyStudent(quiz.webhookUrl, {
                        quizId: canonicalQuizId,
                        schemaHash,
                        studentName: studentInfo.name || '',
                        studentEmail: studentInfo.email || '',
                        seatNumber: studentInfo.seatNumber || '',
                        duplicatePolicy,
                        allowRetakes,
                        maxAttempts,
                        spreadsheetId
                    });

                    if (response && response.status === 'clear') {
                        setEntryTime(getTrueCairoNow() || new Date());
                        setModalType('exam_rules');
                    } else if (response && response.status === 'exists') {
                        setDebugError(lang === 'ar' ? 'تم تسجيل تسليم سابق بهذا البريد في نفس الاختبار. لا يسمح بإعادة الدخول أو إعادة التسليم.' : 'A previous submission exists for this email in the same exam. Re-entry or resubmission is not allowed.');
                        setGatewayError('exists');
                    } else if (response && (response.status === 'not_found' || response.status === 'invalid')) {
                        setGatewayError('invalid_data');
                    } else {
                        throw new Error('Invalid response from server');
                    }
                } catch (error) {
                    console.error('Verification failed:', error);
                    setDebugError(error?.message || 'Unknown Error');
                    setGatewayError('network_error');
                } finally {
                    setIsVerifying(false);
                }
            };

            let timeStatus = 'open';
            let timeMsg = '';
            let dateMsg = '';

            if (timeSyncStatus === 'FAILED') {
                timeStatus = 'failed';
                debugWarn("[Luminova Time Gate Screen JSON]", JSON.stringify({
                    quizId: quiz?.id || quiz?.quizId,
                    timeSyncStatus,
                    cairoOffsetMs,
                    isFiniteOffset: Number.isFinite(cairoOffsetMs),
                    isTimeSynced,
                    timeStatus: 'failed'
                }, null, 2));
            } else if (!isTimeSynced || !now) {
                timeStatus = 'syncing';
                timeMsg = lang === 'ar' ? 'جاري مزامنة وقت الخادم...' : 'Synchronizing server time...';
            } else if (quiz.startTime && now < parseCairoDeadline(quiz.startTime)) {
                timeStatus = 'early';
                const startDate = parseCairoDeadline(quiz.startTime);
                try {
                    dateMsg = new Intl.DateTimeFormat('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric', hour12: true }).format(startDate);
                } catch(e) { dateMsg = startDate.toLocaleString('ar-EG'); }
                
            } else if (quiz.endTime && now > parseCairoDeadline(quiz.endTime)) {
                timeStatus = 'late';
                timeMsg = lang === 'ar' ? 'عذراً، لقد انتهى موعد الاختبار' : 'Sorry, the exam has ended';
            }

            let gatewayContent;
            if (timeStatus === 'failed') {
                gatewayContent = html`
                    <div className="w-full text-center p-8 bg-zinc-100/95 dark:bg-black/20 rounded-[2.5rem] border border-zinc-200 dark:border-white/10 mb-6 backdrop-blur-3xl shadow-[0_32px_64px_rgba(0,0,0,0.05)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
                        <div className="text-7xl mb-6 text-red-500 animate-pulse drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">⏳</div>
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">${lang === 'ar' ? 'عفواً، هناك مشكلة في مزامنة التوقيت العالمي الآن.' : 'Global Time Synchronization Failed'}</h2>
                        <p className="text-sm font-bold text-zinc-600 dark:text-gray-400 mb-8 leading-relaxed px-4">
                            ${lang === 'ar' ? 'لا يمكن فتح الامتحان إلا بعد التحقق من الوقت الفعلي لضمان العدالة.' : 'The exam cannot be opened until real time is verified to ensure fairness.'}
                        </p>
                        <div className="space-y-4">
                            <button onClick=${() => { setTimeSyncStatus('PENDING'); setTimeSyncRetryToken(v => v + 1); }} className="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl transition-all hover:scale-[1.02] border border-zinc-200 dark:border-white/10">
                                ${lang === 'ar' ? '🔄 إعادة المحاولة' : '🔄 Retry Sync'}
                            </button>
                            <button onClick=${goBack} className="w-full py-4 rounded-2xl font-black text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-all border border-zinc-200 dark:border-white/10">
                                ${lang === 'ar' ? 'الخروج' : 'Exit'}
                            </button>
                        </div>
                    </div>`;
            } else if (timeStatus === 'syncing') {
                gatewayContent = html`
                    <div className="text-center p-8 bg-cyan-500/10 rounded-3xl border border-cyan-500/30 mb-6 backdrop-blur-xl">
                        <div className="text-4xl mb-4 text-zinc-900 dark:text-white">\u23F3</div>
                        <div className="text-lg font-black text-cyan-800 dark:text-cyan-300">${timeMsg}</div>
                        <p className="text-xs opacity-70 font-bold text-cyan-900 dark:text-cyan-100 mt-3">${lang === 'ar' ? '\u0644\u0646 \u064A\u0628\u062F\u0623 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0642\u0628\u0644 \u062A\u062B\u0628\u064A\u062A \u0648\u0642\u062A \u0645\u0648\u062B\u0648\u0642 \u0645\u0646 \u0627\u0644\u062E\u0627\u062F\u0645.' : 'The exam will not start until a trusted server clock is available.'}</p>
                    </div>`;
            } else if (timeStatus === 'early') {
                const diff = parseCairoDeadline(quiz.startTime) - now;
                const d = Math.floor(diff / 86400000);
                const h = Math.floor((diff % 86400000) / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);

                const countdownDigits = d > 0
                    ? [
                        { value: String(d), label: lang === 'ar' ? '\u064A\u0648\u0645' : 'Days' },
                        { value: String(h), label: lang === 'ar' ? '\u0633\u0627\u0639\u0629' : 'Hrs' },
                        { value: String(m).padStart(2, '0'), label: lang === 'ar' ? '\u062F\u0642\u064A\u0642\u0629' : 'Min' }
                      ]
                    : [
                        { value: String(h).padStart(2, '0'), label: lang === 'ar' ? '\u0633\u0627\u0639\u0629' : 'Hrs' },
                        { value: String(m).padStart(2, '0'), label: lang === 'ar' ? '\u062F\u0642\u064A\u0642\u0629' : 'Min' },
                        { value: String(s).padStart(2, '0'), label: lang === 'ar' ? '\u062B\u0627\u0646\u064A\u0629' : 'Sec' }
                      ];
                gatewayContent = html`
                    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-brand-ice/10 bg-white/80 dark:bg-[#020C1B]/60 shadow-[inset_0_4px_24px_rgba(0,0,0,0.05),_0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_4px_24px_rgba(0,0,0,0.85),_0_20px_50px_rgba(0,0,0,0.5)] mb-6 select-none">
                        <div className="relative p-6 sm:p-8 text-center bg-transparent">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.02),transparent_75%)] pointer-events-none"></div>
                            <div className="relative z-10">
                                <div className="lmv-countdown-segments flex items-center justify-center gap-3 sm:gap-5 mb-4">
                                    ${countdownDigits.map((seg, i) => html`
                                        <div key=${`countdown-${i}`} className="flex items-center gap-3 sm:gap-5">
                                            <div className="lmv-countdown-segment flex flex-col items-center">
                                                <span className="lmv-countdown-digit flex flex-row flex-nowrap items-center justify-center w-12 sm:w-16 text-3xl sm:text-5xl font-mono font-black text-[#856424] dark:text-brand-DEFAULT tabular-nums leading-none px-3 sm:px-5 py-2 sm:py-3 rounded-2xl bg-zinc-100 dark:bg-[#0B132B]/90 shadow-[0_0_15px_rgba(197,160,89,0.05)] dark:shadow-[0_0_15px_rgba(197,160,89,0.2)] border border-zinc-200 dark:border-brand-ice/30 text-center" style=${{ whiteSpace: 'nowrap' }}>${seg.value}</span>
                                                <span className="lmv-countdown-label text-[0.65rem] sm:text-xs font-bold text-[#856424]/70 dark:text-brand-DEFAULT/70 mt-1.5 uppercase tracking-wider">${seg.label}</span>
                                            </div>
                                            ${i < countdownDigits.length - 1 ? html`<span className="lmv-countdown-sep text-2xl sm:text-3xl font-mono font-black text-[#856424] dark:text-brand-DEFAULT mt-[-0.75rem] select-none animate-[proctor-gold-blink_1.5s_infinite]">:</span>` : ''}
                                        </div>
                                    `)}
                                </div>
                                <p className="text-sm opacity-90 font-bold text-zinc-800 dark:text-white mb-2">${lang === 'ar' ? 'يرجى الانتظار، سيتم التفعيل تلقائياً' : 'Please wait, will auto-start'}</p>
                                <p className="text-xs opacity-60 font-medium text-[#856424]/70 dark:text-brand-DEFAULT/70">${dateMsg}</p>
                            </div>
                        </div>
                    </div>`;
            } else if (timeStatus === 'late') {
                gatewayContent = html`
                    <div className="w-full space-y-4">
                        <div className="text-center p-8 bg-red-500/10 rounded-3xl border border-red-500/30">
                            <svg className="w-16 h-16 mx-auto mb-4 text-red-500 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <div className="text-2xl font-black text-red-500 mb-2">${timeMsg}</div>
                        </div>
                        <div className="text-center">
                            <button onClick=${goBack} className="w-full py-4 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl font-bold">${lang === 'ar' ? 'العودة' : 'Go Back'}</button>
                        </div>
                    </div>`;
            } else if (gatewayError === 'exists') {
                gatewayContent = html`
                    <div className="w-full text-center p-8 rounded-3xl mb-6 bg-red-500/5 border border-red-500/20">
                        <svg className="w-20 h-20 mx-auto mb-4 text-zinc-900 dark:text-white drop-shadow-lg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <h2 className="text-2xl font-black text-red-500 mb-3">${lang === 'ar' ? 'عفواً، لا يمكنك الدخول' : 'Access Denied'}</h2>
                        <p className="text-sm font-bold text-zinc-600 dark:text-gray-400 mb-6 leading-relaxed">
                            ${lang === 'ar' ? 'عذراً، هذا البريد الإلكتروني مسجل بالفعل. لا يمكن أداء الاختبار أكثر من مرة.' : 'This email is already registered. You cannot retake the exam.'}
                        </p>
                        <div className="space-y-3">
                            <button onClick=${() => { setGatewayError(null); setDebugError(null); }} className="w-full py-3 rounded-xl font-bold bg-amber-600 text-white">
                                ${lang === 'ar' ? '🔄 تعديل البيانات' : '🔄 Edit Info'}
                            </button>
                            <button onClick=${goBack} className="w-full py-3 rounded-xl font-bold bg-zinc-200 dark:bg-gray-700 text-zinc-900 dark:text-white">
                                ${lang === 'ar' ? 'العودة' : 'Go Back'}
                            </button>
                        </div>
                    </div>`;
            } else if (gatewayError === 'invalid_data') {
                gatewayContent = html`
                    <div className="w-full">
                        <div className="text-center p-8 rounded-3xl mb-6 bg-amber-500/5 border border-amber-500/20">
                            <div className="text-7xl mb-4 text-zinc-900 dark:text-white">⚠️</div>
                            <h2 className="text-2xl font-black text-amber-500 mb-3">${lang === 'ar' ? 'بيانات غير صحيحة' : 'Information Mismatch'}</h2>
                            <p className="text-sm font-bold text-zinc-600 dark:text-gray-400 mb-2 leading-relaxed">
                                ${lang === 'ar' ? 'لم يتم العثور على بياناتك في السجلات.' : 'Your information was not found in the records.'}
                            </p>
                            <p className="text-sm font-bold text-zinc-600 dark:text-gray-500 mb-6 leading-relaxed">
                                ${lang === 'ar' ? 'الاسم أو رقم الجلوس أو البريد الإلكتروني الذي أدخلته لا يتطابق مع قاعدة البيانات. يرجى التحقق والمحاولة مرة أخرى.' : 'The Name, Seat Number, or Email you entered does not match the database. Please verify and try again.'}
                            </p>
                            <div className="space-y-3">
                                <button onClick=${() => { setGatewayError(null); setDebugError(null); }} className="w-full py-3 rounded-xl font-bold bg-amber-600 text-white">
                                    ${lang === 'ar' ? '🔄 العودة وتعديل البيانات' : '🔄 Go Back and Edit'}
                                </button>
                                <button onClick=${goBack} className="w-full py-3 rounded-xl font-bold bg-zinc-200 dark:bg-gray-700 text-zinc-900 dark:text-white">
                                    ${lang === 'ar' ? 'العودة' : 'Go Back'}
                                </button>
                            </div>
                        </div>
                    </div>`;
            } else if (gatewayError === 'network_error') {
                gatewayContent = html`
                    <div className="w-full text-center p-8 bg-orange-900/10 rounded-3xl border border-orange-500/30 mb-6">
                        <div className="text-7xl mb-4 text-zinc-900 dark:text-white">📡</div>
                        <h2 className="text-xl font-black text-orange-500 mb-2">${lang === 'ar' ? 'فشل الاتصال' : 'Connection Error'}</h2>
                        <p className="text-sm font-bold text-zinc-600 dark:text-gray-400 mb-6">
                            ${lang === 'ar' 
                                ? 'حدث خطأ في الاتصال بالخادم. يرجى التأكد من اتصال الإنترنت ثم إعادة المحاولة.' 
                                : 'A connection error occurred. Please check your internet connection and try again.'}
                        </p>
                        <button onClick=${() => { setGatewayError(null); setDebugError(null); setCairoOffsetMs(null); setIsTimeSynced(false); setTimeSyncRetryToken(v => v + 1); }} className="w-full py-3 bg-orange-600 text-white rounded-xl mb-3">
                            ${lang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
                        </button>
                        <button onClick=${goBack} className="w-full py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl">
                            ${lang === 'ar' ? 'العودة' : 'Go Back'}
                        </button>
                    </div>`;
            } else {
                gatewayContent = html`
                    <div className="space-y-4">
                        <${Luminova.Components.Input} label=${lang === 'ar' ? 'الاسم الرباعي' : 'Full Name'} val=${studentInfo.name} onChange=${v => setStudentInfo({ ...studentInfo, name: v })} />
                        <${Luminova.Components.Input} label=${lang === 'ar' ? 'رقم الجلوس (اختياري)' : 'Seat Number (Optional)'} val=${studentInfo.seatNumber} onChange=${v => setStudentInfo({ ...studentInfo, seatNumber: v })} />
                        <${Luminova.Components.Input} label=${lang === 'ar' ? 'الشعبة / القسم' : 'Department'} val=${studentInfo.department} onChange=${v => setStudentInfo({ ...studentInfo, department: v })} />
                        <${Luminova.Components.Input} label=${lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} val=${studentInfo.email} onChange=${v => setStudentInfo({ ...studentInfo, email: v })} />
                        <button disabled=${!(studentInfo.name && studentInfo.department && isEmailValid) || isVerifying || !isTimeSynced} onClick=${verifyAndStart} className="w-full py-4 mt-6 rounded-2xl font-black text-xl text-white bg-blue-600 shadow-lg transition-transform disabled:opacity-50 hover:scale-[1.02]">
                            ${!isTimeSynced ? (lang === 'ar' ? '⏳ جاري مزامنة الوقت...' : '⏳ Syncing Time...') : isVerifying ? (lang === 'ar' ? '⏳ جاري التحقق...' : '⏳ Verifying...') : (lang === 'ar' ? 'دخول الاختبار' : 'Enter Exam')}
                        </button>
                    </div>`;
            }

            return html`
            <div className="min-h-screen flex items-center justify-center bg-[#F3EFFB] dark:bg-zinc-950 p-4 relative overflow-hidden">
                <button onClick=${goBack} className="absolute top-6 left-6 sm:left-10 z-50 bg-zinc-50 dark:bg-white/5 backdrop-blur-2xl hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-900 dark:text-white px-6 py-3 rounded-2xl font-black shadow-lg transition-all flex items-center gap-2 border border-zinc-200 dark:border-white/10 hover:scale-105">
                    <span className="text-xl text-zinc-900 dark:text-white">🔙</span> ${lang === 'ar' ? 'الخروج' : 'Back'}
                </button>
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10 max-w-lg w-full bg-white/80 dark:bg-zinc-900/50 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 p-8 rounded-3xl shadow-2xl text-zinc-900 dark:text-white">
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4 text-zinc-900 dark:text-white">🎓</div>
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">${quiz.titleAr || quiz.title || quiz.titleEn}</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold">${lang === 'ar' ? 'بوابة الدخول للاختبار التقييمي' : 'Evaluation Exam Gateway'}</p>
                    </div>
                    ${gatewayContent}
                </div>
            </div>`;
        }

        const q = questions[currentIndex];
        if (!q) {
            return html`
                <div className="p-6 text-center text-zinc-900 dark:text-white font-bold">
                    جاري تحميل السؤال...
                </div>
            `;
        }
        const currentQStudent = q ? (safeStudents.find(s => s.id === q?.studentId) || (q?.studentId === 's_founder' || q?.studentId === Luminova.FOUNDER.id ? Luminova.FOUNDER : {})) : {};

        const handleFinish = () => {
            if (isSubmitting || submitLockRef.current) return;
            
            // Check for unanswered questions (exclude null, empty string, empty array)
            const unansweredCount = questions.filter(que => {
                const ans = answers[que.id];
                return ans === undefined || ans === null || ans === '' || (Array.isArray(ans) && ans.length === 0);
            }).length;

            if (unansweredCount > 0) {
                setModalType('unanswered_warning');
            } else {
                setModalType('submit');
            }
        };

        if (isFinished) {
            // ── VERIFICATION MODAL SYSTEM ─────────────────────────
            const verifyModal = (() => {
                if (modalType === 'verify_success') return html`
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style=${{ background: 'rgba(10,5,20,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                        <div className="bg-white dark:bg-[#0B132B]/90 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md animate-fade-in text-center text-zinc-900 dark:text-white">
                            <div className="text-7xl mb-6">✅</div>
                            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">
                                تم تسليم الاختبار بنجاح.
                            </h2>
                            <p className="text-lg font-bold text-zinc-650 dark:text-fuchsia-100/60 mb-8 leading-relaxed">
                                شكرًا لك، يمكنك الآن مراجعة نتيجتك.
                            </p>
                            <button onClick=${() => setModalType(null)} className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-500 text-white shadow-xl transition-all text-xl">
                                متابعة
                            </button>
                        </div>
                    </div>
                `;
                if (modalType === 'verify_confirmed') return html`
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style=${{ background: 'rgba(10,5,20,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                        <div className="bg-white dark:bg-[#0B132B]/90 border border-emerald-200 dark:border-emerald-500/20 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md animate-fade-in text-center text-zinc-900 dark:text-white">
                            <div className="text-7xl mb-6">🌟</div>
                            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">
                                اطمن يا هندسة!
                            </h2>
                            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-200/70 mb-8 leading-relaxed">
                                نتيجتك وصلت وسجلناها بالفعل! تقدر تخرج دلوقتي وأنت مطمن 🌟
                            </p>
                            <button onClick=${() => setModalType(null)} className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-500 text-white shadow-xl transition-all text-xl">
                                تمام، خلاص
                            </button>
                        </div>
                    </div>
                `;
                return '';
            })();

            // Generate grading results once
            const gradingResults = {};
            questions.forEach(que => {
                const qId = que.questionId || que.id;
                gradingResults[qId] = gradeQuestionAnswer(que, answers[que.id], { htmlSeparator: false });
            });

            const resolvedQuizTitle =
              lang === 'ar'
                ? (quiz?.titleAr || quiz?.title || quiz?.titleEn || Luminova.i18n[lang].results)
                : (quiz?.titleEn || quiz?.title || quiz?.titleAr || Luminova.i18n[lang].results);
            const resolvedHeading = lang === 'ar' ? `نتائج اختبار: ${resolvedQuizTitle}` : `Quiz Results: ${resolvedQuizTitle}`;

            // ── RESULT VISIBILITY SETTINGS ──────────────────────────
            const showResult = isEvaluation ? (quiz.showResult !== undefined ? !!quiz.showResult : (String(quiz.showResultsAfter) === 'true')) : true;
            const resultDisplayMode = isEvaluation ? (quiz.resultDisplayMode || 'hidden') : 'score_with_answers_and_explanations';
            const canShowScore = !isEvaluation || (showResult && resultDisplayMode !== 'hidden' && (quiz.showScore !== false));
            const canShowPercentage = !isEvaluation || (showResult && resultDisplayMode !== 'hidden' && (quiz.showPercentage !== false));
            const canShowAnswers = !isEvaluation || (showResult && (resultDisplayMode === 'score_with_answers' || resultDisplayMode === 'score_with_answers_and_explanations'));
            const canShowCorrectAnswers = !isEvaluation || (canShowAnswers && quiz.showCorrectAnswers !== false);
            const canShowModelAnswers = !isEvaluation || (canShowAnswers && quiz.showModelAnswers !== false);
            const canShowExplanations = !isEvaluation || (showResult && resultDisplayMode === 'score_with_answers_and_explanations' && quiz.showExplanations !== false);
            const canReview = !isEvaluation || (showResult && quiz.allowReviewAfterSubmit !== false && canShowAnswers);

            // For official exams, prefer server-computed scores; for practice, use client
            const displayScore = isEvaluation && serverScore !== null ? serverScore : (() => {
                let s = 0;
                questions.forEach(que => {
                    if (que.type === 'essay') return;
                    const qId = que.questionId || que.id;
                    const result = gradingResults[qId];
                    s += result.awardedPoints;
                });
                return s;
            })();
            const displayMaxScore = isEvaluation && serverMaxScore !== null ? serverMaxScore : maxScore;
            const displayPercentage = isEvaluation && serverPercentage !== null ? serverPercentage : (displayMaxScore > 0 ? Math.round((displayScore / displayMaxScore) * 100) : 0);

            // Calculate summary counters for auto-gradable questions
            let correctCount = 0;
            let incorrectCount = 0;
            let unansweredCount = 0;
            questions.forEach(que => {
                if (que.type === 'essay') return;
                const qId = que.questionId || que.id;
                const result = gradingResults[qId];
                if (result.status === 'CORRECT') {
                    correctCount++;
                } else if (result.status === 'UNANSWERED') {
                    unansweredCount++;
                } else {
                    incorrectCount++;
                }
            });

            // Hidden mode or showResult is false: show only submission confirmation
            if (isEvaluation && (!showResult || resultDisplayMode === 'hidden')) {
                return html`
                <div className="w-full">
                    ${verifyModal}
                    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F3EFFB] dark:bg-zinc-950 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
                        <div className="relative z-10 max-w-md w-full bg-white/85 dark:bg-white/2 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 border border-zinc-200 dark:border-white/10 animate-fade-in text-center text-zinc-900 dark:text-white">
                            ${isLateSubmission && html`
                                <div className="mb-6 px-4 py-2 bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 rounded-xl font-bold text-sm">
                                    ⚠️ ${lang === 'ar' ? 'تم التسليم بنجاح، ولكن تم تسجيل تأخيرك عن الموعد المحدد.' : 'Successfully submitted, but marked as late.'}
                                </div>
                            `}
                            <div className="text-7xl mb-6 ${terminationReason === 'completed' ? 'animate-bounce' : ''}">
                                ${terminationReason === 'completed' ? '✅' : '⛔'}
                            </div>
                            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">
                                ${terminationReason === 'completed'
                            ? (lang === 'ar' ? 'تم تسليم امتحانك بنجاح!' : 'Your exam has been submitted successfully!')
                            : (terminationReason === 'time_expired' || terminationReason === 'time_expired_force')
                                ? (lang === 'ar' ? 'انتهى الوقت!' : 'Time Expired!')
                                : (lang === 'ar' ? 'تم سحب الامتحان' : 'Exam Terminated')}
                            </h2>
                            <p className="text-lg font-bold text-zinc-650 dark:text-fuchsia-100/60 mb-10 leading-relaxed">
                                ${terminationReason === 'completed'
                            ? (lang === 'ar' ? 'شكراً لك، تم حفظ جميع إجاباتك.' : 'Thank you, all your answers have been saved.')
                            : (terminationReason === 'time_expired' || terminationReason === 'time_expired_force')
                                ? (lang === 'ar' 
                                    ? (isForceSubmitPolicy || terminationReason === 'time_expired_force'
                                        ? 'انتهى الوقت المحدد لك، وتم سحب وتسجيل إجاباتك إجبارياً بنجاح.' 
                                        : 'انتهى الوقت المسموح به، تم حفظ وتسليم إجاباتك تلقائياً.') 
                                    : 'Time is up. Your answers have been automatically saved and submitted.')
                                : (lang === 'ar' ? 'تم سحب الامتحان وإرساله للإدارة نظراً لمخالفة قواعد المراقبة والخروج من الشاشة أكثر من مرة.' : 'Exam force-submitted and sent to administration due to repeated proctoring violations.')}
                            </p>
                            <button onClick=${goBack} className="w-full py-4 text-xl rounded-2xl font-black bg-gradient-to-r from-[#BA964F] to-[#C5A059] text-[#020C1B] shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                ${lang === 'ar' ? 'الخروج للمواد' : 'Return to Subjects'}
                            </button>
                        </div>
                    </div>
                </div>
                `;
            }

            return html`
            <div className="w-full">
                ${verifyModal}
                <div className="min-h-screen flex items-center justify-center p-4 bg-[#F3EFFB] dark:bg-zinc-950 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
                    <div className="relative z-10 max-w-4xl w-full flex flex-col pt-10 pb-20">
                        ${isLateSubmission && html`
                            <div className="text-center mt-6 px-6 py-4 bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 border border-yellow-500/50 rounded-2xl font-bold text-lg max-w-xl mx-auto shadow-lg animate-pulse">
                                ⚠️ ${lang === 'ar' ? 'تم التسليم بنجاح، ولكن تم تسجيل تأخيرك عن الموعد المحدد.' : 'Successfully submitted, but marked as late.'}
                            </div>
                        `}
                        <div className="glass-card p-6 rounded-2xl text-center py-16 bg-gradient-to-b from-rose-500/5 to-transparent border-t-8 border-t-rose-500 rounded-[3rem] shadow-2xl">
                            <div className="w-full flex flex-col items-center">
                                <h2 className="text-5xl font-black mb-6 uppercase tracking-wider text-zinc-900 dark:text-white">${resolvedHeading}</h2>
                                ${canShowScore && html`
                                    <div className="text-8xl font-black text-rose-400 drop-shadow-2xl mb-4">${displayScore} <span className="text-4xl opacity-30 text-zinc-900 dark:text-white">/ ${displayMaxScore}</span></div>
                                `}
                                ${canShowPercentage && html`
                                    <div className="text-2xl font-black text-fuchsia-700 dark:text-fuchsia-300/80 mb-4">${displayPercentage}%</div>
                                `}
                                ${canShowScore && html`
                                    <div className="grid grid-cols-3 gap-4 max-w-md w-full mt-6 mb-8">
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
                                            <div className="text-xs font-bold text-green-600 dark:text-green-400 mb-1">${lang === 'ar' ? 'إجابات صحيحة' : 'Correct'}</div>
                                            <div className="text-3xl font-black text-green-600 dark:text-green-400">${correctCount}</div>
                                        </div>
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
                                            <div className="text-xs font-bold text-red-500 dark:text-red-400 mb-1">${lang === 'ar' ? 'إجابات خاطئة' : 'Incorrect'}</div>
                                            <div className="text-3xl font-black text-red-500 dark:text-red-400">${incorrectCount}</div>
                                        </div>
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
                                            <div className="text-xs font-bold text-amber-600 dark:text-amber-500 mb-1">${lang === 'ar' ? 'لم تتم الإجابة' : 'Unanswered'}</div>
                                            <div className="text-3xl font-black text-amber-600 dark:text-amber-500">${unansweredCount}</div>
                                        </div>
                                    </div>
                                `}
                                ${!canShowScore && !canShowPercentage && html`
                                    <p className="text-lg font-bold text-zinc-550 dark:text-gray-400 mb-8">${lang === 'ar' ? 'تم تسليم الامتحان بنجاح ✅' : 'Exam submitted successfully ✅'}</p>
                                `}
                                <button onClick=${goBack} className="px-10 py-4 text-xl rounded-full shadow-2xl hover:scale-105 bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">${lang === 'ar' ? 'العودة لصفحة الاختبارات' : 'Return to Subjects'}</button>
                            </div>
                        </div>
                        
                        ${canReview && questions.map((que, idx) => {
                                const qId = que.questionId || que.id;
                                const result = gradingResults[qId];
                                const studentProv = safeStudents.find(s => s.id === que?.studentId) || (que?.studentId === 's_founder' || que?.studentId === Luminova.FOUNDER.id ? Luminova.FOUNDER : null);

                                const borderClass = canShowCorrectAnswers
                                    ? (que.type === 'essay' 
                                        ? 'border-r-rose-500' 
                                        : (result.status === 'CORRECT' 
                                            ? 'border-r-green-500' 
                                            : (result.status === 'UNANSWERED' 
                                                ? 'border-r-amber-500' 
                                                : 'border-r-red-500')))
                                    : 'border-r-slate-500';

                                // Single-root outer div to avoid htm's {key,className} wrapper bug
                                return html`
                                <div key=${`result-q-${idx}`} className="mb-8">
                                    <div className=${`glass-card p-6 rounded-2xl border-r-4 ${borderClass} relative`}>
                                        <div className="w-full flex flex-col">
                                            <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-xl bg-black/10 dark:bg-white/10 font-bold text-sm">
                                                ${resolveQuestionPoints(que)} ${Luminova.i18n[lang].score}
                                            </div>
                                            
                                            ${studentProv && html`
                                                <div className="flex flex-row justify-between items-center bg-zinc-100/80 dark:bg-slate-800/40 p-3 rounded-xl border border-zinc-200 dark:border-slate-700/50 mb-4 w-full">
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span className="text-xs text-zinc-550 dark:text-slate-400">المساهم بالمعلومة:</span>
                                                        <span className="text-sm font-bold text-yellow-600 dark:text-yellow-500">${lang === 'ar' ? studentProv.nameAr || studentProv.name : studentProv.nameEn || studentProv.name}</span>
                                                    </div>
                                                    <div className="relative inline-block">
                                                        <div className="relative w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white shadow-lg overflow-hidden border-2 border-slate-600 shadow-sm shrink-0 bg-zinc-600">
                                                            ${studentProv.image ? html`<img src=${studentProv.image} alt=${studentProv.name} className="w-full h-full object-cover rounded-full" />` : (studentProv.nameEn || studentProv.name || "ST").trim().substring(0, 2).toUpperCase()}
                                                        </div>
                                                    </div>
                                                </div>
                                            `}

                                            <h4 className="font-bold text-xl mt-4 mb-4 leading-relaxed">س: ${que.text || que.textAr}</h4>
                                            
                                            ${que.type !== 'essay' ? (
                                                result.status === 'CORRECT' ? html`
                                                    <div className="mt-6 p-5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 shadow-inner">
                                                        <p className="flex items-start gap-2 mb-2">
                                                            <span className="font-bold opacity-70 min-w-[120px]">${lang === 'ar' ? 'الحالة' : 'Status'}:</span>
                                                            <strong className="text-green-600 dark:text-green-400 font-bold text-lg">${lang === 'ar' ? 'إجابة صحيحة' : 'Correct'}</strong>
                                                        </p>
                                                        <p className="flex items-start gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                                            <span className="font-bold opacity-70 min-w-[120px]">${lang === 'ar' ? 'إجابتك' : 'Your Answer'}:</span>
                                                            <strong className="text-green-600 dark:text-green-400 font-bold text-lg">${result.selectedDisplay}</strong>
                                                        </p>
                                                    </div>
                                                ` : result.status === 'INCORRECT' ? html`
                                                    <div className="mt-6 p-5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 shadow-inner">
                                                        <p className="flex items-start gap-2 mb-2">
                                                            <span className="font-bold opacity-70 min-w-[120px]">${lang === 'ar' ? 'الحالة' : 'Status'}:</span>
                                                            <strong className="text-red-500 dark:text-red-400 font-bold text-lg">${lang === 'ar' ? 'إجابة خاطئة' : 'Incorrect'}</strong>
                                                        </p>
                                                        <p className="flex items-start gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                                            <span className="font-bold opacity-70 min-w-[120px]">${lang === 'ar' ? 'إجابتك' : 'Your Answer'}:</span>
                                                            <strong className="text-red-500 dark:text-red-400 font-bold line-through opacity-80">${result.selectedDisplay}</strong>
                                                        </p>
                                                        ${canShowCorrectAnswers && html`
                                                            <p className="flex items-start gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                                                <span className="font-bold opacity-70 min-w-[120px]">${lang === 'ar' ? 'الإجابة الصحيحة' : 'Correct Answer'}:</span>
                                                                <strong className="text-green-600 dark:text-green-400 font-bold text-lg">${result.correctDisplay}</strong>
                                                            </p>
                                                        `}
                                                    </div>
                                                ` : html`
                                                    <div className="mt-6 p-5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 shadow-inner">
                                                        <p className="flex items-start gap-2 mb-2">
                                                            <span className="font-bold opacity-70 min-w-[120px]">${lang === 'ar' ? 'الحالة' : 'Status'}:</span>
                                                            <strong className="text-amber-500 dark:text-amber-400 font-bold text-lg">${lang === 'ar' ? 'لم تتم الإجابة' : 'Unanswered'}</strong>
                                                        </p>
                                                        <p className="flex items-start gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                                            <span className="font-bold opacity-70 min-w-[120px]">${lang === 'ar' ? 'إجابة الطالب' : 'Student Answer'}:</span>
                                                            <strong className="text-slate-500 dark:text-slate-400 font-bold text-lg">${result.selectedDisplay}</strong>
                                                        </p>
                                                        ${canShowCorrectAnswers && html`
                                                            <p className="flex items-start gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                                                <span className="font-bold opacity-70 min-w-[120px]">${lang === 'ar' ? 'الإجابة الصحيحة' : 'Correct Answer'}:</span>
                                                                <strong className="text-green-600 dark:text-green-400 font-bold text-lg">${result.correctDisplay}</strong>
                                                            </p>
                                                        `}
                                                    </div>
                                                `
                                            ) : (
                                                result.status === 'UNANSWERED' ? html`
                                                    <div className="mt-6 p-5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 shadow-inner space-y-4">
                                                        <p className="flex items-start gap-2 mb-2">
                                                            <span className="font-bold opacity-70 min-w-[120px]">${lang === 'ar' ? 'الحالة' : 'Status'}:</span>
                                                            <strong className="text-amber-500 dark:text-amber-400 font-bold text-lg">${lang === 'ar' ? 'لم تتم الإجابة' : 'Unanswered'}</strong>
                                                        </p>
                                                        <p className="flex items-start gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                                            <span className="font-bold opacity-70 min-w-[120px]">${lang === 'ar' ? 'إجابة الطالب' : 'Student Answer'}:</span>
                                                            <strong className="text-slate-500 dark:text-slate-400 font-bold text-lg">${result.selectedDisplay}</strong>
                                                        </p>
                                                        ${canShowModelAnswers && (que.modelAnswer || que.modelAnswerAr) && html`
                                                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                                                <p className="font-black text-rose-650 dark:text-rose-400 mb-2">${Luminova.i18n[lang].modelAnswer}</p>
                                                                <p className="text-md leading-relaxed p-4 bg-white/90 dark:bg-white/2 backdrop-blur-xl rounded border-l-4 border-l-rose-500 font-medium">${que.modelAnswer || que.modelAnswerAr}</p>
                                                            </div>
                                                        `}
                                                    </div>
                                                ` : html`
                                                    <div className="mt-6 p-5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 shadow-inner space-y-4">
                                                        ${canShowModelAnswers && (que.modelAnswer || que.modelAnswerAr) && html`
                                                            <div>
                                                                <p className="font-black text-rose-650 dark:text-rose-400 mb-2">${Luminova.i18n[lang].modelAnswer}</p>
                                                                <p className="text-md leading-relaxed p-4 bg-white/90 dark:bg-white/2 backdrop-blur-xl rounded border-l-4 border-l-rose-500 font-medium">${que.modelAnswer || que.modelAnswerAr}</p>
                                                            </div>
                                                        `}
                                                        <div>
                                                            <p className="font-bold border-t pt-4 dark:border-gray-700 mb-2">${lang === 'ar' ? 'إجابتك' : 'Your Answer'}:</p>
                                                            <p className="text-md text-gray-600 dark:text-gray-400 p-4 bg-white/50 dark:bg-gray-900/50 rounded italic">${answers[que.id] || 'ـ بدون إجابة ـ'}</p>
                                                        </div>
                                                    </div>
                                                `
                                            )}

                                            ${canShowExplanations && (que.explanation || que.explanationAr) && html`
                                                <div className="mt-6 p-5 rounded-xl bg-brand-DEFAULT/15 border border-brand-DEFAULT/30 relative overflow-hidden">
                                                    <div className="absolute -right-4 -top-4 opacity-10 text-8xl text-brand-DEFAULT rotate-12">💡</div>
                                                    <p className="font-black text-brand-DEFAULT mb-2 flex items-center gap-2">💡 ${Luminova.i18n[lang].explanation}</p>
                                                    <p className="text-md leading-relaxed font-bold z-10 relative">${que.explanation || que.explanationAr}</p>
                                                </div>
                                            `}
                                        </div>
                                    </div>
                                </div>
                                `;
                            })}
                    </div>
                </div>
            </div>`;
        }


        if (!q) {
            return html`
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#F3EFFB] dark:bg-zinc-950">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-indigo-500/10 pointer-events-none"></div>
                <div className="max-w-md w-full backdrop-blur-3xl bg-white/80 dark:bg-white/2 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-12 text-center animate-fade-in shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative z-10 text-zinc-900 dark:text-white">
                    <div className="relative mb-8">
                        <div className="text-7xl animate-pulse drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">⏳</div>
                        <div className="absolute -inset-4 bg-rose-500/20 rounded-full blur-2xl animate-pulse -z-10"></div>
                    </div>
                    
                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
                        ${lang === 'ar' ? 'جاري تحضير الاختبار...' : 'Preparing Exam...'}
                    </h2>
                    
                    <p className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
                        ${lang === 'ar' ? 'يرجى العودة لاحقاً' : 'Please check back later'}
                    </p>
                    
                    <button onClick=${goBack}
                        className="w-full py-4 rounded-2xl font-black text-lg text-zinc-850 dark:text-white transition-all hover:scale-[1.02] active:scale-[0.98] bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 border border-zinc-200 dark:border-white/20 shadow-xl backdrop-blur-md">
                        ${lang === 'ar' ? '🔙 العودة للمكتبة' : '🔙 Back to Library'}
                    </button>
                </div>
            </div>
            `;
        }

        return html`
        <div className="max-w-4xl mx-auto min-h-[70vh] flex flex-col pt-10 pb-20">

            ${/* ── SUBMISSION PROGRESS STEPPER OVERLAY ── */
            modalType === 'submission_progress' && html`
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-2xl animate-fade-in pointer-events-auto">
                    <div className="bg-white dark:bg-[#0B132B]/90 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center max-w-md w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.02),transparent_80%)] pointer-events-none"></div>
                        
                        <div className="relative mb-6">
                            <div className="animate-spin rounded-full h-14 w-14 border-4 border-zinc-200 dark:border-white/10 border-t-[#BA964F]"></div>
                        </div>

                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 text-center font-sans">
                            جاري تسليم الاختبار
                        </h2>
                        
                        <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 text-center mb-8 leading-relaxed max-w-xs font-sans">
                            من فضلك انتظر قليلًا ولا تغلق الصفحة.
                            <br />
                            نقوم الآن بحفظ إجاباتك والتأكد من وصولها بنجاح.
                        </p>

                        <div className="w-full space-y-6 text-start px-4">
                            ${(() => {
                                const steps = [
                                    {
                                        id: 'prep',
                                        num: '1',
                                        title: '1. تجهيز الإجابات',
                                        active: submitState === SUBMIT_STATES.PREPARING,
                                        completed: ['sending', 'verifying', 'uncertain', 'retrying_verify', 'retrying_send', 'success'].includes(submitState),
                                        subtext: submitState === SUBMIT_STATES.PREPARING ? 'جاري تجهيز إجابات الاختبار...' : ''
                                    },
                                    {
                                        id: 'send',
                                        num: '2',
                                        title: '2. إرسال الاختبار',
                                        active: submitState === SUBMIT_STATES.SENDING || submitState === SUBMIT_STATES.RETRYING_SEND,
                                        completed: ['verifying', 'uncertain', 'retrying_verify', 'success'].includes(submitState),
                                        subtext: (submitState === SUBMIT_STATES.SENDING || submitState === SUBMIT_STATES.RETRYING_SEND) ? 'جاري إرسال الإجابات بأمان...' : ''
                                    },
                                    {
                                        id: 'verify',
                                        num: '3',
                                        title: '3. تأكيد التسليم',
                                        active: ['verifying', 'uncertain', 'retrying_verify'].includes(submitState),
                                        completed: submitState === SUBMIT_STATES.SUCCESS,
                                        subtext: ['verifying', 'uncertain', 'retrying_verify'].includes(submitState)
                                            ? 'ما زلنا نتحقق من حالة التسليم. من فضلك انتظر قليلًا، قد تستغرق العملية لحظات إضافية.'
                                            : ''
                                    },
                                    {
                                        id: 'success',
                                        num: '4',
                                        title: '4. تم التسليم بنجاح',
                                        active: submitState === SUBMIT_STATES.SUCCESS,
                                        completed: submitState === SUBMIT_STATES.SUCCESS,
                                        subtext: submitState === SUBMIT_STATES.SUCCESS ? 'تم تسليم الاختبار بنجاح. شكرًا لك، يمكنك الآن مراجعة نتيجتك.' : ''
                                    }
                                ];
                                return steps.map((s) => {
                                    const isCurrent = s.active;
                                    const isDone = s.completed;
                                    const circleClass = `w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                                        isCurrent
                                            ? 'bg-[#BA964F] border-[#BA964F] text-white animate-pulse'
                                            : (isDone
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-zinc-300 dark:border-white/10 text-zinc-400')
                                    }`;
                                    return html`
                                        <div key=${`stepper-step-${s.id}`} className="flex items-center gap-4">
                                            <div className=${circleClass}>
                                                ${isDone ? '✓' : s.num}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-zinc-900 dark:text-white">${s.title}</span>
                                                ${s.subtext && html`
                                                    <span className="text-xs text-zinc-550 dark:text-[#C5A059] font-bold">${s.subtext}</span>
                                                `}
                                            </div>
                                        </div>
                                    `;
                                });
                            })()}
                        </div>
                    </div>
                </div>
            `}

            ${/* ── SUBMISSION FAILED OR RECOVERY SCREEN ── */
            modalType === 'submission_failed' && html`
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-2xl animate-fade-in pointer-events-auto">
                    <div className="bg-white dark:bg-[#0B132B]/90 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-10 w-full max-w-md shadow-2xl relative overflow-hidden text-center text-zinc-900 dark:text-white">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.02),transparent_80%)] pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="text-6xl mb-6 text-brand-DEFAULT animate-pulse">📡</div>
                            
                            <h2 className="text-2xl font-black mb-4">
                                ${isCorrupt 
                                    ? 'تعذر استكمال محاولة التسليم الحالية'
                                    : isConflict 
                                        ? 'تعذر تأكيد التسليم'
                                        : isValidationFailed
                                            ? 'خطأ في تجهيز البيانات'
                                            : 'تعذر تأكيد تسليم الاختبار'}
                            </h2>
                            
                            <p className="text-base font-bold text-zinc-750 dark:text-brand-ice/80 mb-6 leading-relaxed">
                                ${isCorrupt 
                                    ? 'تعذر استكمال محاولة التسليم الحالية. من فضلك تواصل مع الدعم.'
                                    : isConflict 
                                        ? 'توجد مشكلة في مطابقة بيانات التسليم. يرجى التواصل مع الدعم.'
                                        : isValidationFailed
                                            ? 'فشل التحقق من الإجابات المحفوظة. يرجى إعادة المحاولة.'
                                            : 'تعذر الاتصال مؤقتًا. تأكد من اتصال الإنترنت ثم اضغط إعادة محاولة التسليم.'}
                            </p>

                            <div className="space-y-4">
                                ${(!isConflict && !isCorrupt) && html`
                                    <button onClick=${retrySubmissionSync} 
                                        disabled=${isSubmissionBusy}
                                        className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-[#BA964F] to-[#C5A059] text-[#020C1B] shadow-xl hover:shadow-[0_0_30px_rgba(197,160,89,0.3)] transition-all text-xl disabled:opacity-50 active:scale-[0.98]">
                                        ${isSubmissionBusy 
                                            ? 'جاري تأكيد التسليم...' 
                                            : 'إعادة محاولة التسليم'}
                                    </button>
                                `}
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/10 text-center">
                                <p className="text-sm font-black text-zinc-900 dark:text-white mb-1">
                                    تحتاج مساعدة؟
                                </p>
                                <p className="text-xs font-bold text-zinc-550 dark:text-zinc-400 mb-3">
                                    إذا استمرت المشكلة، يمكنك التواصل مع الدعم عبر واتساب.
                                </p>
                                <a href=${SUPPORT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] dark:text-[#25D366] font-bold py-2 px-4 rounded-xl transition-all text-xs cursor-pointer">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.031 14.067.993 11.453.991c-5.434 0-9.858 4.37-9.862 9.8-.001 1.761.463 3.478 1.347 4.981L1.874 20.33l4.773-1.176zm13.12-5.405c-.333-.167-1.972-.974-2.277-1.086-.306-.113-.528-.168-.75.168-.222.334-.861 1.086-1.055 1.309-.195.223-.39.247-.723.08-1.503-.756-2.617-1.314-3.666-3.127-.268-.46-.07-.708.097-.876.15-.15.333-.39.5-.584.167-.195.222-.334.333-.556.111-.222.056-.417-.028-.584-.083-.167-.75-1.81-.994-2.4-.244-.572-.49-.494-.673-.503-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.972-.806 2.25-1.583.278-.777.278-1.443.195-1.584-.083-.14-.306-.223-.639-.39z" />
                                    </svg>
                                    تواصل عبر واتساب
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `}

            ${/* ── VERIFY SUCCESS (inline during active exam for force-submit) ── */
            modalType === 'verify_success' && !isFinished && html`
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style=${{ background: 'rgba(10,5,20,0.6)', backdropFilter: 'blur(24px)' }}>
                    <div className="bg-white dark:bg-[#0B132B]/90 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md animate-fade-in text-center text-zinc-900 dark:text-white">
                        <div className="text-7xl mb-6">✅</div>
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">تم تسليم الاختبار بنجاح.</h2>
                        <p className="text-lg font-bold text-zinc-650 dark:text-fuchsia-100/60 mb-8 leading-relaxed">شكرًا لك، يمكنك الآن مراجعة نتيجتك.</p>
                        <button onClick=${() => setModalType(null)} className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-500 text-white shadow-xl text-xl">
                            متابعة
                        </button>
                    </div>
                </div>
            `}

            <!-- Exit Modal -->
            ${modalType === 'exit' && html`
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style=${{ background: 'rgba(127,29,29,0.25)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
                >
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.35)] p-8 w-full max-w-sm border border-red-200/40 dark:border-red-900/40 animate-fade-in text-center">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                            خروج من الامتحان
                        </h2>
                        <p className="text-base font-bold text-gray-500 dark:text-gray-400 mb-7 leading-relaxed">
                            ${isEvaluation
                                ? 'تحذير: خروجك الآن سيعتبر تسليماً نهائياً للامتحان.'
                                : 'هل أنت متأكد من الخروج من الامتحان؟ الإجابات لن تُحفظ.'}
                        </p>
                        <div className="flex gap-3">
                            <button onClick=${() => setModalType(null)}
                                className="flex-1 py-3.5 rounded-2xl font-black bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 transition-all"
                            >تراجع</button>
                            <button disabled=${isSubmitting} onClick=${() => {
                                if (isEvaluation) { submitExam(); } else { safeExitFullscreen(); setModalType(null); goBack(); }
                            }}
                                className="flex-1 py-3.5 rounded-2xl font-black bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >${isSubmitting ? 'جاري التسليم...' : (isEvaluation ? 'تسليم وخروج' : 'نعم، خروج')}</button>
                        </div>
                    </div>
                </div>
            `}

            <!-- Unanswered Questions Warning Modal -->
            ${modalType === 'unanswered_warning' && html`
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style=${{ background: 'rgba(251,191,36,0.15)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                >
                    <div className="bg-[#0B132B]/95 backdrop-blur-3xl rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.5)] p-8 w-full max-w-md border border-amber-500/30 animate-fade-in text-center">
                        <div className="text-6xl mb-4 animate-pulse">⚠️</div>
                        <h2 className="text-2xl font-black text-white mb-3">
                            أسئلة غير مجابة!
                        </h2>
                        <p className="text-base font-bold text-amber-200/80 mb-6 leading-relaxed">
                            لديك ${questions.filter(que => {
                                const ans = answers[que.id];
                                return ans === undefined || ans === null || ans === '' || (Array.isArray(ans) && ans.length === 0);
                            }).length} سؤالاً لم تقم بالإجابة عليها بعد. هل ترغب في العودة للمراجعة أم إنهاء وتسليم الاختبار؟
                        </p>
                        <div className="flex flex-col gap-3">
                            <button onClick=${() => setModalType(null)}
                                className="w-full py-3.5 rounded-2xl font-black bg-[#BA964F]/20 border border-[#BA964F]/40 text-[#BA964F] hover:bg-[#BA964F]/30 transition-all"
                            >العودة للمراجعة</button>
                            <button disabled=${isSubmitting} onClick=${() => { setModalType('submit'); }}
                                className="w-full py-3.5 rounded-2xl font-black bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                            >إنهاء وتسليم الاختبار على أي حال</button>
                        </div>
                    </div>
                </div>
            `}

            <!-- Submit Modal -->
            ${modalType === 'submit' && html`
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style=${{ background: 'rgba(6,78,59,0.2)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
                >
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.35)] p-8 w-full max-w-sm border border-green-200/40 dark:border-green-900/40 animate-fade-in text-center">
                        <div className="text-5xl mb-4">📝</div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                            تسليم الامتحان
                        </h2>
                        <p className="text-base font-bold text-gray-500 dark:text-gray-400 mb-7 leading-relaxed">
                            هل أنت متأكد من إنهاء الامتحان وتسليم الإجابات؟
                        </p>
                        <div className="flex gap-3">
                            <button onClick=${() => setModalType(null)}
                                className="flex-1 py-3.5 rounded-2xl font-black bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 transition-all"
                            >تراجع</button>
                            <button disabled=${isSubmitting} onClick=${() => submitExam('completed')}
                                className="flex-1 py-3.5 rounded-2xl font-black bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed border border-emerald-700 dark:border-emerald-500/30"
                            >${isSubmitting ? 'جاري التسليم...' : 'نعم، إنهاء وتسليم'}</button>
                        </div>
                    </div>
                </div>
            `}

            ${modalType === 'cheat_warning' && html`
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style=${{ background: 'rgba(2,12,27,0.9)', backdropFilter: 'blur(30px) saturate(140%)' }}
                >
                    <div className="bg-[#020C1B]/95 backdrop-blur-3xl rounded-[2rem] p-8 sm:p-10 w-full max-w-md border border-brand-crisp text-brand-crisp shadow-[0_0_50px_rgba(255,0,85,0.4)] animate-fade-in text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-crisp to-transparent"></div>
                        <div className="text-7xl mb-6 animate-[pulse_1.5s_infinite] drop-shadow-[0_0_15px_rgba(255,0,85,0.6)]">⚠️</div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-wide uppercase">
                            إنذار: مخالفة قواعد المراقبة
                        </h2>
                        <p className="text-base sm:text-lg font-bold text-zinc-300 mb-8 leading-relaxed">
                            لقد قمت بمغادرة شاشة الاختبار. تكرار هذا الإجراء سيؤدي إلى سحب ورقتك وتسليم الامتحان تلقائياً.
                        </p>
                        <button onClick=${() => setModalType(null)}
                            className="w-full py-4 rounded-2xl font-black bg-brand-crisp hover:bg-brand-crisp/90 text-white shadow-[0_4px_25px_rgba(255,0,85,0.45)] transition-all text-lg sm:text-xl active:scale-[0.98]"
                        >موافق / أوافق على الاستمرار</button>
                    </div>
                </div>
            `}

            <!-- Network Error Modal -->
            ${modalType === 'network_error' && html`
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style=${{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}>
                    <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md border border-white/10 animate-fade-in text-center">
                        <div className="text-7xl mb-6 text-rose-400 drop-shadow-lg">📡</div>
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4">
                            خطأ في الاتصال
                        </h2>
                        <p className="text-zinc-400 font-bold mb-8 leading-relaxed">
                            عذراً، حدث خطأ أثناء الاتصال بالخادم. تأكد من جودة الإنترنت وحاول لاحقاً.
                        </p>

                        <button onClick=${() => setModalType(null)}
                            className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-500 hover:opacity-90 text-white shadow-xl transition-all text-xl"
                        >إغلاق والمحاولة لاحقاً</button>
                    </div>
                </div>
            `}

            <!-- Already Submitted Modal (Gatekeeper) -->
            ${modalType === 'already_submitted' && html`
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style=${{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                >
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl rounded-3xl shadow-[0_32px_80px_rgba(250,204,21,0.2)] p-10 w-full max-w-md border border-brand-gold/50 animate-fade-in text-center">
                        <div className="text-7xl mb-6 text-brand-gold drop-shadow-lg">🛑</div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                            عفواً، لا يمكنك الدخول
                        </h2>
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                            لقد قمت بأداء هذا الاختبار مسبقاً.
                        </p>
                        <button onClick=${() => setModalType(null)}
                            className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:opacity-90 text-white shadow-xl transition-all text-xl"
                        >رجوع لتعديل البيانات</button>
                    </div>
                </div>
            `}

            <!-- Submit Error Modal (Final Submission) -->
            ${modalType === 'submit_error' && html`
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style=${{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                >
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl rounded-3xl shadow-[0_32px_80px_rgba(250,204,21,0.2)] p-10 w-full max-w-md border border-brand-gold/50 animate-fade-in text-center">
                        <div className="text-7xl mb-6 text-brand-gold drop-shadow-lg">⚠️</div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                            فشل الإرسال
                        </h2>
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                            حدث خطأ أثناء إرسال إجاباتك. لا تقلق، إجاباتك محفوظة. يرجى المحاولة مرة أخرى.
                        </p>

                        <button onClick=${retrySubmissionSync}
                            disabled=${isSubmitting}
                            className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-brand-DEFAULT to-brand-gold hover:opacity-90 text-white shadow-xl shadow-brand-gold/30 transition-all text-xl disabled:opacity-50"
                        >
                            ${isSubmitting ? 'جاري إعادة المزامنة...' : 'إعادة المزامنة'}
                        </button>
                    </div>
                </div>
            `}

            <!-- Force Submitted Modal -->
            ${modalType === 'force_submitted' && html`
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style=${{ background: 'rgba(127,29,29,0.5)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
                >
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.5)] p-10 w-full max-w-md border-2 border-red-500/50 animate-fade-in text-center">
                        <div className="text-7xl mb-6 text-red-500">⛔</div>
                        <h2 className="text-3xl font-black text-red-600 dark:text-red-500 mb-4">
                            تعذر إكمال الاختبار
                        </h2>
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                            تم إرسال امتحانك تلقائياً نظراً لخروجك أكثر من مرة من شاشة الامتحان.
                        </p>
                        <button onClick=${goBack}
                            className="w-full py-4 rounded-2xl font-black bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/30 transition-all text-xl"
                        >العودة لصفحة الاختبارات</button>
                    </div>
                </div>
            `}

            ${showDrawer && html`
                <div className="fixed inset-0 z-[8000] flex animate-fade-in">
                    <div className="absolute inset-0 bg-[#0A0514]/60 backdrop-blur-sm" onClick=${() => setShowDrawer(false)}></div>
                    <div className="quiz-side-drawer fixed top-0 bottom-0 end-0 w-[300px] sm:w-[340px] flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.25)] dark:shadow-[0_0_60px_rgba(0,0,0,0.65)] bg-white/95 dark:bg-[#09090b]/95 border-s border-zinc-200 dark:border-white/10">
                        <!-- Close button -->
                        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-200 dark:border-white/10">
                            <h3 className="font-black text-lg text-rose-400 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                                ${lang === 'ar' ? 'خريطة الأسئلة' : 'Questions Map'}
                            </h3>
                            <button onClick=${() => setShowDrawer(false)} className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-white/10 hover:bg-red-500/30 flex items-center justify-center text-zinc-500 dark:text-white/70 hover:text-red-400 transition-all text-base font-black">✕</button>
                        </div>
                        <!-- Progress summary -->
                        <div className="px-5 py-3 flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-white/50 border-b border-zinc-200 dark:border-white/5">
                            <span>${lang === 'ar' ? 'تمت الإجابة' : 'Answered'}: <span className="text-green-400">${Object.keys(answers).filter(k => isAnswerFilled(answers[k])).length}</span> / ${questions.length}</span>
                            <span className="text-rose-400">${lang === 'ar' ? 'الحالي' : 'Current'}: ${currentIndex + 1}</span>
                        </div>
                        <!-- Question list -->
                        <div className="flex-1 overflow-y-auto px-4 py-3">
                            <div className="flex flex-col gap-2">
                                ${questions.map((qItem, i) => {
                        const isAnswered = isAnswerFilled(answers[qItem?.id]);
                        const isCurrent = currentIndex === i;
                        const isLocked = quiz.allowBackNavigation === false && i < currentIndex;
                        const qLabel = lang === 'ar' ? `السؤال ${(i + 1).toLocaleString('ar-EG')}` : `Question ${i + 1}`;
                        return html`
                                    <button key=${qItem?.id || `nav-q-${i}`} 
                                        onClick=${() => {
                                if (!isLocked) {
                                    setCurrentIndex(i);
                                    setShowDrawer(false);
                                    if (quiz.feedbackMode === 'immediate' && revealedQuestions.has(qItem?.id)) {
                                        setIsFeedbackRevealed(true);
                                    } else {
                                        setIsFeedbackRevealed(false);
                                    }
                                }
                            }}
                                        disabled=${isLocked}
                                        className=${`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-start transition-all duration-300 ${
                                            isCurrent 
                                                ? 'bg-rose-500/20 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)] text-zinc-900 dark:text-white font-bold' 
                                                : isAnswered 
                                                    ? 'bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 text-zinc-800 dark:text-zinc-200 hover:bg-emerald-500/25 dark:hover:bg-emerald-500/20' 
                                                    : 'bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
                                        } ${isLocked ? 'opacity-30 cursor-not-allowed' : 'active:scale-[0.98]'}`}>
                                        <!-- Number circle & Checkmark wrapper -->
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className=${`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                                                isCurrent 
                                                    ? 'bg-rose-500 text-white' 
                                                    : isAnswered 
                                                        ? 'bg-emerald-500 text-white' 
                                                        : 'bg-zinc-300 dark:bg-white/15 text-zinc-800 dark:text-zinc-200'
                                            }`}>
                                                ${i + 1}
                                            </span>
                                            ${isAnswered ? html`<span className="text-emerald-500 text-base font-bold shrink-0">✅</span>` : ''}
                                        </div>
                                        <!-- Label -->
                                        <span className="flex-1 font-bold text-sm truncate text-zinc-900 dark:text-white">${qLabel}</span>
                                        <!-- Status indicator -->
                                        ${isCurrent ? html`<span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0"></span>` : ''}
                                    </button>
                                `;
                            })}
                            </div>
                        </div>
                    </div>
                </div>
            `}

            <!-- Countdown / Timer -->
            ${quiz.endTime && timeLeft !== null ? (() => {
                const isOvertime = timeLeft < 0;
                const diff = Math.abs(timeLeft);
                const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                const isUrgent = !isOvertime && diff < 300000;
                
                let timerClass = "bg-white/80 dark:bg-[#0B132B]/60 border border-zinc-200 dark:border-brand-ice/10 text-zinc-900 dark:text-brand-DEFAULT font-mono px-4 py-2 rounded-xl shadow-lg";
                if (isOvertime) {
                    timerClass = "bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400 font-mono px-4 py-2 rounded-xl shadow-lg animate-pulse";
                } else if (isUrgent) {
                    timerClass = "bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-400 font-mono px-4 py-2 rounded-xl shadow-lg animate-pulse";
                }

                return html`
                    <div className="sticky top-4 z-50 mx-auto max-w-max mb-6 font-mono text-lg sm:text-xl font-bold tracking-wider transition-all duration-300">
                        <div className=${timerClass} style=${{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                            ${isOvertime 
                                ? (lang === 'ar' ? `\u26A0\uFE0F \u0645\u062A\u0623\u062E\u0631: + ${h}:${m}:${s}` : `\u26A0\uFE0F Late: + ${h}:${m}:${s}`)
                                : `\u23F3 ${h}:${m}:${s}`}
                        </div>
                    </div>
                `;
            })() : ''}

            <div className="flex justify-between items-center mb-10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl p-4 rounded-2xl shadow-lg border border-zinc-200 dark:border-white/10">
                <${Luminova.Components.Button} variant="danger" disabled=${isSubmitting || submitLockRef.current} onClick=${() => { if (isSubmitting || submitLockRef.current) return; setModalType('exit'); }} className="rounded-full shadow-lg hover:-translate-x-1">
                    <${Luminova.Icons.XCircle} /> <span className="hidden sm:inline">${lang === 'ar' ? 'خروج' : 'Quit'}</span>
                </${Luminova.Components.Button}>
                <div className="flex-1 mx-4 sm:mx-8 relative">
                    <div className="bg-white/10 dark:bg-white/10 h-3 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-gradient-to-r from-rose-400 to-indigo-500 h-full transition-all duration-500 ease-out" style=${{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                    </div>
                </div>
                <span className="font-black text-xl sm:text-2xl text-rose-400 drop-shadow-sm shrink-0">${currentIndex + 1} <span className="opacity-40 text-lg">/ ${questions.length}</span></span>
                <!-- Drawer trigger button -->
                <button disabled=${isSubmitting || submitLockRef.current} onClick=${() => { if (isSubmitting || submitLockRef.current) return; setShowDrawer(true); }} className="ms-3 w-10 h-10 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shrink-0 group disabled:opacity-50 disabled:cursor-not-allowed" title=${lang === 'ar' ? 'خريطة الأسئلة' : 'Questions Map'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400 group-hover:text-rose-300 transition-colors"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
            </div>

            <${Luminova.Components.GlassCard} className="relative overflow-visible mb-10 flex-1 flex flex-col shadow-2xl">
                <div className="w-full flex flex-col h-full">
                    ${currentQStudent.id && html`
                        <div className="absolute -top-12 sm:-top-6 start-1/2 -translate-x-1/2 sm:translate-x-0 sm:start-8 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 bg-white/90 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl p-2 sm:p-2 sm:pl-4 rounded-xl sm:rounded-full border border-zinc-200 dark:border-white/10 z-10 animate-fade-in group hover:scale-105 transition-transform max-w-[90vw] sm:max-w-none text-center sm:text-start mx-auto w-max mb-8 sm:mb-0">
                            <${Luminova.Components.Avatar} name=${currentQStudent.nameAr || currentQStudent.name} image=${currentQStudent.image} isVerified=${currentQStudent.isVerified} size="w-8 h-8 shrink-0" />
                            <span className="text-xs sm:text-sm font-black mx-1 text-rose-400 group-hover:text-fuchsia-400 break-words whitespace-normal transition-colors">${lang === 'ar' ? currentQStudent.nameAr || currentQStudent.name : currentQStudent.nameEn || currentQStudent.name}</span>
                            <span className="text-xs font-bold text-zinc-550 dark:text-white/40 hidden sm:inline border-r pr-2 border-zinc-200 dark:border-white/10 shrink-0">:المساهم بالسؤال</span>
                        </div>
                    `}

                    <div className="flex-1 mt-6">
                    <div className="flex justify-between items-start mb-8 ${q.mediaUrl ? '' : 'border-b border-zinc-200 dark:border-white/10 pb-6'}">
                        <h3 className="text-3xl font-bold leading-relaxed w-[85%] text-zinc-900 dark:text-white">${q.text || q.textAr}</h3>
                        <span className="text-xl font-black bg-rose-500/10 text-rose-400 px-4 py-2 rounded-xl border border-rose-500/30 shadow-sm shrink-0">${q.score} ${Luminova.i18n[lang].score}</span>
                    </div>
                    ${q.mediaUrl && html`
                        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6 w-full flex justify-center">
                            <div className="w-full max-h-[400px] rounded-2xl shadow-md bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-gray-800 overflow-hidden relative *:max-h-[400px] *:object-contain">
                                <${Luminova.Components.SmartMedia} url=${q.mediaUrl} lang=${lang} />
                            </div>
                        </div>
                    `}
                    
                    ${q.type === 'mcq' && html`
                        <div className="space-y-4 max-w-2xl mx-auto">
                            ${(q.options || q.optionsAr || []).map((opt, i) => {
                        const handleMCQClick = () => {
                            if (isSubmitting || isFeedbackRevealed || (quiz.feedbackMode === 'immediate' && revealedQuestions.has(q.id))) return;
                            setAnswers(prev => ({ ...prev, [q.id]: i }));
                        };
                        const isSelected = answers[q.id] === i;
                        const btnClass = `w-full text-start p-5 rounded-2xl border-2 transition-all duration-300 text-lg font-bold shadow-sm flex items-center gap-4 ${
                            isSelected 
                                ? 'bg-[#C5A059]/20 text-[#1E293B] border-[#BA964F] shadow-[0_0_20px_rgba(197,160,89,0.15)] dark:bg-[#C5A059] dark:text-[#020C1B] dark:border-[#C5A059] dark:shadow-[0_0_25px_rgba(197,160,89,0.3)] scale-[1.02]' 
                                : 'bg-white/80 border-zinc-200 text-[#1E293B] hover:bg-zinc-100/90 hover:text-[#0f172a] hover:border-zinc-300 dark:bg-[#0B132B]/40 dark:border-[#A5C4D4]/10 dark:text-slate-200 dark:hover:bg-[#0B132B]/60 dark:hover:text-white dark:hover:border-[#A5C4D4]/30 shadow-sm hover:scale-[1.01]'
                        } ${
                            (isSubmitting || isFeedbackRevealed || revealedQuestions.has(q.id)) 
                                ? 'opacity-70 cursor-not-allowed' 
                                : ''
                        }`;
                        return html`
                            <button 
                                key=${`opt-${q.id}-${i}`}
                                onClick=${handleMCQClick}
                                disabled=${isSubmitting || isFeedbackRevealed || (quiz.feedbackMode === 'immediate' && revealedQuestions.has(q.id))}
                                className=${btnClass}
                            >
                                <span className="inline-block w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/5 text-center leading-8 mr-4 ml-4 text-sm">${String.fromCharCode(65 + i)}</span>
                                ${opt}
                            </button>
                        `;
                        })}
                        </div>
                    `}

                    ${q.type === 'multi_select' && html`
                        <div className="space-y-4 max-w-2xl mx-auto">
                            ${(q.options || q.optionsAr || []).map((opt, i) => {
                const selected = answers[q.id] || [];
                const isSelected = selected.includes(i);
                const handleMultiClick = () => {
                    if (isSubmitting || isFeedbackRevealed || (quiz.feedbackMode === 'immediate' && revealedQuestions.has(q.id))) return;
                    const next = isSelected ? selected.filter(x => x !== i) : [...selected, i];
                    setAnswers(prev => ({ ...prev, [q.id]: next }));
                };
                const btnClass = `w-full text-start p-5 rounded-2xl border-2 transition-all duration-300 text-lg font-bold shadow-sm flex items-center gap-4 ${
                    isSelected 
                        ? 'bg-[#C5A059]/20 text-[#1E293B] border-[#BA964F] shadow-[0_0_20px_rgba(197,160,89,0.15)] dark:bg-[#C5A059] dark:text-[#020C1B] dark:border-[#C5A059] dark:shadow-[0_0_25px_rgba(197,160,89,0.3)] scale-[1.02]' 
                        : 'bg-white/80 border-zinc-200 text-[#1E293B] hover:bg-zinc-100/90 hover:text-[#0f172a] hover:border-zinc-300 dark:bg-[#0B132B]/40 dark:border-[#A5C4D4]/10 dark:text-slate-200 dark:hover:bg-[#0B132B]/60 dark:hover:text-white dark:hover:border-[#A5C4D4]/30 shadow-sm hover:scale-[1.01]'
                } ${
                    (isSubmitting || isFeedbackRevealed || revealedQuestions.has(q.id)) 
                        ? 'opacity-70 cursor-not-allowed' 
                        : ''
                }`;
                const checkboxClass = `w-8 h-8 rounded-xl flex items-center justify-center border-2 text-xl transition-all ${
                    isSelected 
                        ? 'bg-[#1E293B] border-[#1E293B] text-white shadow-md dark:bg-[#020C1B] dark:border-[#020C1B] dark:text-[#C5A059]' 
                        : 'border-zinc-300 dark:border-[#A5C4D4]/20'
                }`;
                return html`
                    <button 
                        key=${`opt-${q.id}-${i}`}
                        disabled=${isSubmitting || isFeedbackRevealed || (quiz.feedbackMode === 'immediate' && revealedQuestions.has(q.id))}
                        onClick=${handleMultiClick}
                        className=${btnClass}
                    >
                        <div className=${checkboxClass}>
                            ${isSelected && '\u2713'}
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
                                disabled=${isSubmitting || isFeedbackRevealed || (quiz.feedbackMode === 'immediate' && revealedQuestions.has(q.id))}
                                className="w-full p-5 rounded-2xl border transition-all shadow-inner resize-y min-h-[250px] text-lg bg-white text-[#1E293B] placeholder-zinc-500 border-zinc-300 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] dark:bg-[#0B132B]/80 dark:text-white dark:placeholder-[#A5C4D4]/43 dark:border-white/10"
                                placeholder=${lang === 'ar' ? 'اكتب إجابتك بتفصيل هنا...' : 'Type your detailed answer here...'}
                                value=${answers[q.id] || ''}
                                onChange=${(e) => {
                            if (isSubmitting || isFeedbackRevealed || (quiz.feedbackMode === 'immediate' && revealedQuestions.has(q.id))) return;
                            const val = e.target.value;
                            setAnswers(prev => ({ ...prev, [q.id]: val }));
                        }}
                            />
                        </div>
                    `}

                    ${(isFeedbackRevealed && quiz.feedbackMode === 'immediate') && html`
                        <div className="mt-10 p-6 rounded-2xl bg-white dark:bg-gray-900 border-2 border-brand-DEFAULT/40 shadow-xl animate-fade-in relative overflow-hidden">
                            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-brand-DEFAULT to-transparent"></div>
                            <h4 className="font-black text-2xl mb-4">نتيجتك في هذا السؤال:</h4>
                            
                            ${q.type !== 'essay' && html`
                                <p className="flex items-start gap-2 mb-4" dangerouslySetInnerHTML=${{ __html: `<span class='font-bold opacity-70 min-w-[120px]'>النموذجية:</span> <strong class="text-green-600 dark:text-green-400 font-bold text-xl">${formatCorrectAnswerForDisplay(q, lang, true)}</strong>` }} />
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
                </div>
            </${Luminova.Components.GlassCard}>

            <div className="flex justify-between items-center bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl p-4 rounded-2xl shadow-lg border border-zinc-200 dark:border-white/10">
                <${Luminova.Components.Button} variant="glass" disabled=${currentIndex === 0 || quiz.allowBackNavigation === false || isSubmitting || submitLockRef.current} onClick=${() => { if (isSubmitting || submitLockRef.current) return; setCurrentIndex(i => i - 1); if (quiz.feedbackMode === 'immediate' && questions[currentIndex - 1] && revealedQuestions.has(questions[currentIndex - 1].id)) { setIsFeedbackRevealed(true); } else { setIsFeedbackRevealed(false); } }} className="px-8 py-3 text-lg rounded-full">
                    ${lang === 'ar' ? 'السابق' : 'Previous'}
                </${Luminova.Components.Button}>
                
                ${quiz.feedbackMode === 'immediate' && !isFeedbackRevealed ? html`
                    <${Luminova.Components.Button} disabled=${!isAnswerFilled(answers[q.id]) || isSubmitting || submitLockRef.current} onClick=${() => { if (isSubmitting || submitLockRef.current) return; setIsFeedbackRevealed(true); setRevealedQuestions(prev => new Set([...prev, q.id])); }} 
                        className="px-10 py-3 text-lg bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg shadow-blue-500/30 font-black animate-pulse transition-transform hover:scale-105">
                        ✅ تحقق من الإجابة
                    </${Luminova.Components.Button}>
                ` : currentIndex === questions.length - 1 ? html`
                    <${Luminova.Components.Button} variant="success" disabled=${isSubmitting || submitLockRef.current} onClick=${handleFinish} className="px-10 py-3.5 text-lg rounded-full animate-pulse disabled:opacity-60 disabled:cursor-not-allowed">
                        <${Luminova.Icons.CheckCircle} /> ${isSubmitting || submitLockRef.current ? (lang === 'ar' ? 'جاري التسليم...' : 'Submitting...') : (lang === 'ar' ? 'إنهاء الاختبار' : 'Finish Exam')}
                    </${Luminova.Components.Button}>
                ` : html`
                    <${Luminova.Components.Button} disabled=${isSubmitting || submitLockRef.current} onClick=${() => { if (isSubmitting || submitLockRef.current) return; setCurrentIndex(i => i + 1); if (quiz.feedbackMode === 'immediate' && questions[currentIndex + 1] && revealedQuestions.has(questions[currentIndex + 1].id)) { setIsFeedbackRevealed(true); } else { setIsFeedbackRevealed(false); } }} className="px-10 py-3 text-lg rounded-full shadow-lg shadow-brand-DEFAULT/30 group">
                        ${lang === 'ar' ? 'التالي' : 'Next'} <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
                    </${Luminova.Components.Button}>
                `}
            </div>
        </div>
    `;
    };

    // ==========================================

})();



