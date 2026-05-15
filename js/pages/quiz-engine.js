(function () {
    "use strict";

    if (!window.__LUMINOVA) return;
    const { useState, useEffect, useMemo, useCallback, useRef } = window.React;
    const html = window.htm.bind(window.React.createElement);
    const Luminova = window.__LUMINOVA;

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
    // ─────────────────────────────────────────────────────────────────

    Luminova.Pages.QuizEngine = ({ quiz, data, lang, goBack }) => {
        // ── GUARDRAIL: Redirect to gateway if critical data is missing ──
        if (!quiz || !data) {
            return html`
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 text-center animate-fade-in border border-white/10">
                    <div className="text-7xl mb-6">⚠️</div>
                    <h2 className="text-2xl font-black text-white mb-4">
                        ${lang === 'ar' ? 'خطأ في تحميل الامتحان' : 'Exam Load Error'}
                    </h2>
                    <p className="text-base font-bold text-fuchsia-100/60 mb-8 leading-relaxed">
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

        const isEvaluation = quiz?.examMode === 'evaluation';
        const [isStarted, setIsStarted] = useState(!isEvaluation);
        const [studentInfo, setStudentInfo] = useState({ name: '', seatNumber: '', department: '', email: '' });
        const [now, setNow] = useState(null);
        
        // ── TRUE CAIRO TIME SYNC ─────────────────────────────────
        // ARCHITECTURE NOTE: The timer is EXCLUSIVELY driven by
        // (Date.now() + cairoOffsetMs).  cairoOffsetMs is set once
        // from a trusted server source.  Bare `new Date()` is NEVER
        // used anywhere in the countdown or deadline logic.
        const [cairoOffsetMs, setCairoOffsetMs] = useState(null);
        const [isTimeSynced, setIsTimeSynced] = useState(false);
        const [timeSyncRetryToken, setTimeSyncRetryToken] = useState(0);
        const [entryTime, setEntryTime] = useState(null);

        useEffect(() => {
            let cancelled = false;
            const fetchTrueTime = async () => {
                try {
                    const offset = await Luminova.Services.GAS.getTrueTimeOffsetMs();
                    if (cancelled) return;
                    setCairoOffsetMs(offset);
                    setNow(new Date(Date.now() + offset));
                    setIsTimeSynced(true);
                    setDebugError(null);
                } catch (error) {
                    if (cancelled) return;
                    setIsTimeSynced(false);
                    setDebugError(error?.message || 'Unable to synchronize server time.');
                    if (isEvaluation) setGatewayError('network_error');
                }
            };
            fetchTrueTime();
            return () => { cancelled = true; };
        }, [isEvaluation, timeSyncRetryToken]);

        const getTrueCairoNow = useCallback(() => {
            if (cairoOffsetMs === null) return null;
            return new Date(Date.now() + cairoOffsetMs);
        }, [cairoOffsetMs]);

        useEffect(() => {
            if (isTimeSynced) setNow(getTrueCairoNow());
        }, [isTimeSynced, getTrueCairoNow]);

        const [isSubmitting, setIsSubmitting] = useState(false);
        const submitLockRef = useRef(false);
        const timeExpiredSubmitRef = useRef(false);
        const [showDrawer, setShowDrawer] = useState(false);

        // ── SUBMIT-AND-VERIFY WATCHDOG REFS ──────────────────────
        const verifyPayloadRef = useRef(null);
        const verifyReasonRef = useRef('completed');

        useEffect(() => {
            window.__LUMINOVA_EXAM_IS_SUBMITTING = false;
            submitLockRef.current = false;
            return () => {
                window.__LUMINOVA_EXAM_IS_SUBMITTING = false;
                submitLockRef.current = false;
            };
        }, [quiz.id]);

        const [currentIndex, setCurrentIndex] = useState(0);
        const [answers, setAnswers] = useState({});
        const [isFinished, setIsFinished] = useState(false);
        const [isFeedbackRevealed, setIsFeedbackRevealed] = useState(false);
        const [revealedQuestions, setRevealedQuestions] = useState(new Set());
        const [cheatWarnings, setCheatWarnings] = useState(0);
        const [isLateSubmission, setIsLateSubmission] = useState(false);
        const [isVerifying, setIsVerifying] = useState(false);
        const [gatewayError, setGatewayError] = useState(null);
        const [debugError, setDebugError] = useState(null);
        const [terminationReason, setTerminationReason] = useState('completed');
        const [modalType, setModalType] = useState(null);
        const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
        const immunityRef = useRef(false);
        const loginTimeRef = useRef(null);

        useEffect(() => {
            if (isEvaluation && (!isStarted || !isFinished) && isTimeSynced) {
                const timer = setInterval(() => setNow(getTrueCairoNow()), 1000);
                return () => clearInterval(timer);
            }
        }, [isEvaluation, isStarted, isFinished, isTimeSynced, getTrueCairoNow]);

        useEffect(() => {
            if (isStarted && !isFinished) {
                const saved = localStorage.getItem('quiz_progress_' + quiz.id);
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        if (parsed.answers) setAnswers(parsed.answers);
                        if (parsed.studentInfo) setStudentInfo(parsed.studentInfo);
                    } catch (e) { }
                }
            }
        }, [isStarted, isFinished, quiz.id]);

        useEffect(() => {
            if (isStarted && !isFinished) {
                localStorage.setItem('quiz_progress_' + quiz.id, JSON.stringify({ answers, studentInfo }));
            }
        }, [answers, studentInfo, isStarted, isFinished, quiz.id]);

        // Task 3: Auto-fullscreen for ALL exam types on start
        useEffect(() => {
            if (isStarted && !isFinished && questions.length > 0) {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                }
            }
        }, [isStarted, questions.length]);

        // Task 3: Helper — safe exit fullscreen
        const safeExitFullscreen = () => {
            try {
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                }
            } catch (e) { /* ignore */ }
        };

        const isExplicitlyTrue = (value) => value === true || value === 'true' || value === 1 || value === '1';

        const isDelayAllowed = () => {
            const settings = quiz.settings || {};
            if (quiz.allowDelay !== undefined || settings.allowDelay !== undefined) {
                return isExplicitlyTrue(quiz.allowDelay) || isExplicitlyTrue(settings.allowDelay);
            }
            return isExplicitlyTrue(quiz.allowLateSubmission) || isExplicitlyTrue(settings.allowLateSubmission);
        };

        const setSubmissionLock = (locked) => {
            submitLockRef.current = locked;
            window.__LUMINOVA_EXAM_IS_SUBMITTING = locked;
            setIsSubmitting(locked);
        };

        const submitExam = async (reason = 'completed') => {
            if (submitLockRef.current || window.__LUMINOVA_EXAM_IS_SUBMITTING === true) return;
            if (!isTimeSynced || cairoOffsetMs === null) {
                setDebugError(lang === 'ar' ? 'تعذر مزامنة وقت الخادم. يرجى إعادة المحاولة بعد استقرار الاتصال.' : 'Server time is not synchronized. Please retry once the connection is stable.');
                setModalType('submission_failed');
                return;
            }
            immunityRef.current = true;
            setSubmissionLock(true);
            setHasAttemptedSubmit(true);
            setModalType(null);
            setTerminationReason(reason);

            const serverNow = getTrueCairoNow();
            if (quiz.endTime && serverNow && serverNow > parseCairoDeadline(quiz.endTime)) {
                setIsLateSubmission(true);
            }

            const getScoreCorrectAnswers = (que) => {
                if (Array.isArray(que.correctAnswers)) return que.correctAnswers;
                if (que.correctAnswer !== null && que.correctAnswer !== undefined) return [que.correctAnswer];
                return [];
            };

            let score = 0;
            questions.forEach(que => {
                const correctAnswers = getScoreCorrectAnswers(que);
                if (que.type === 'mcq') {
                    if (answers[que.id] === correctAnswers[0]) score += Number(que.score);
                } else if (que.type === 'multi_select') {
                    const correctStr = [...correctAnswers].sort().join(',');
                    const ansStr = [...(answers[que.id] || [])].sort().join(',');
                    if (correctStr === ansStr) score += Number(que.score);
                }
                // Essay questions: score = 0 for auto-grading (manual grading by professor)
            });

            if (isEvaluation) {
                // ── SILENT IP TRACKING ───────────────────────────────
                const ipAddress = await Luminova.Services.GAS.getIPAddress();

                // ── IRON-CLAD SANITIZER ──────────────────────────────
                // Aggressively strips DOM nodes, React fibers, events,
                // and any non-primitive object to guarantee clean JSON.
                const sanitizeValue = (val) => {
                    if (val === null || val === undefined) return null;
                    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return val;
                    if (Array.isArray(val)) return val.map(v => sanitizeValue(v));
                    // If it's ANY object (DOM node, Event, React fiber, etc.) — kill it
                    return 'Invalid Format';
                };

                const getQuestionOptions = (que) => {
                    if (Array.isArray(que.options)) return que.options;
                    if (Array.isArray(que.optionsAr)) return que.optionsAr;
                    if (Array.isArray(que.optionsEn)) return que.optionsEn;
                    return [];
                };

                const getCorrectAnswers = (que) => {
                    if (Array.isArray(que.correctAnswers)) return que.correctAnswers;
                    if (que.correctAnswer !== null && que.correctAnswer !== undefined) return [que.correctAnswer];
                    return [];
                };

                const normalizeEmailList = (value) => {
                    if (Array.isArray(value)) return value.filter(Boolean);
                    if (typeof value === 'string') {
                        return value.split(',').map(email => email.trim()).filter(Boolean);
                    }
                    return [];
                };

                const shouldSendStudentReport = () => {
                    const settings = quiz.settings || {};
                    const emailPolicy = String(quiz.emailPolicy || settings.emailPolicy || '').toLowerCase();
                    if (['none', 'off', 'disabled', 'no_report'].includes(emailPolicy)) return false;

                    return settings.studentReport === true
                        || settings.showResultEmail === true
                        || settings.sendDetailedReport === true
                        || quiz.showResultEmail === true
                        || quiz.sendDetailedReport === true
                        || ['full_report', 'student_report', 'detailed_report', 'report'].includes(emailPolicy);
                };

                const resolveCorrectAnswerText = (que) => {
                    if (que.type === 'essay') {
                        return String(que.modelAnswer || que.modelAnswerAr || que.modelAnswerEn || 'Manual Grading');
                    }

                    const opts = getQuestionOptions(que);
                    const correctValues = getCorrectAnswers(que);
                    if (correctValues.length) {
                        return correctValues.map(value => {
                            if (typeof value === 'number' && opts[value] !== undefined) return String(opts[value]);
                            if (typeof value === 'string' && opts[value] !== undefined) return String(opts[value]);
                            return String(value);
                        }).filter(Boolean).join(' | ');
                    }

                    return String(que.modelAnswer || que.modelAnswerAr || que.correctAnswerText || '');
                };

                // ── HUMAN-READABLE ANSWER RESOLVER ──────────────────
                const resolveAnswerText = (que) => {
                    const raw = answers[que.id];
                    if (raw === null || raw === undefined) return 'لم يتم الإجابة';
                    const opts = getQuestionOptions(que);
                    if (que.type === 'mcq') {
                        return typeof raw === 'number' && opts[raw] ? String(opts[raw]) : sanitizeValue(raw);
                    }
                    if (que.type === 'multi_select') {
                        if (Array.isArray(raw)) return raw.map(idx => opts[idx] ? String(opts[idx]) : String(idx)).join(' | ');
                        return sanitizeValue(raw);
                    }
                    // essay or other
                    return sanitizeValue(raw);
                };

                // ── BINARY SCORE (1/0) ───────────────────────────────
                const resolveQuestionScore = (que) => {
                    if (que.type === 'essay') return 0; // Manual grading
                    const correctAnswers = getCorrectAnswers(que);
                    if (que.type === 'mcq') return answers[que.id] === correctAnswers[0] ? 1 : 0;
                    if (que.type === 'multi_select') {
                        const correctStr = [...correctAnswers].sort().join(',');
                        const ansStr = [...(answers[que.id] || [])].sort().join(',');
                        return correctStr === ansStr ? 1 : 0;
                    }
                    return 0;
                };

                // ── DATA INTEGRITY: QUESTION RE-SORTING ─────────────
                // orderedQuestionsForMatrix uses quiz.questions (the ORIGINAL
                // un-shuffled array from exam.js).  Each response carries
                // originalIndex = its position in quiz.questions.  Answers
                // are keyed by que.id, so lookup is shuffle-invariant.
                // The GAS backend sortResponses() sorts by originalIndex,
                // guaranteeing Q1 -> Col L, Q2 -> Col N, etc. in every row.
                const orderedQuestionsForMatrix = Array.isArray(quiz.questions) ? quiz.questions : questions;
                const examKey = String(quiz.id || quiz.titleAr || quiz.title || quiz.titleEn || 'exam').trim().toLowerCase();
                const studentKey = String(studentInfo.email || studentInfo.seatNumber || studentInfo.name || 'student').trim().toLowerCase();
                const submissionId = `${examKey}::${studentKey}`;

                const atomicPayload = {
                    submissionId: submissionId,
                    idempotencyKey: submissionId,
                    // Redundant Root-Level Data (Flattening V2 for GAS compatibility)
                    name: studentInfo?.name || "غير مسجل",
                    email: studentInfo?.email || "غير مسجل",
                    seatNumber: studentInfo?.seatNumber || "غير مسجل",
                    department: studentInfo?.department || "غير مسجل",
                    score: score,
                    maxScore: maxScore,

                    student: {
                        name: studentInfo.name || "غير مسجل",
                        department: studentInfo.department || "غير مسجل",
                        email: studentInfo.email || "غير مسجل",
                        seatNumber: studentInfo.seatNumber || "غير مسجل"
                    },
                    timestamps: {
                        entryTime: entryTime ? entryTime.toISOString() : null,
                        exitTime: getTrueCairoNow()?.toISOString() || null,
                        ipAddress: ipAddress
                    },
                    scoreData: {
                        score: score,
                        maxScore: maxScore
                    },
                    examDetails: {
                        title: String(quiz.titleAr || quiz.title || quiz.titleEn || ''),
                        terminationReason: String(reason)
                    },
                    settings: {
                        // Strictly mapping the CMS flag for V4 Email Engine compatibility
                        studentReport: shouldSendStudentReport(),
                        adminEmails: normalizeEmailList(quiz.settings?.adminEmails || quiz.adminEmails)
                    },
                    responses: orderedQuestionsForMatrix.map((que, originalIndex) => ({
                        questionId: String(que.id ?? originalIndex),
                        originalIndex: originalIndex,
                        question: String(que.text || que.textAr || que.textEn || ''),
                        studentAnswer: resolveAnswerText(que),
                        isCorrect: que.type === 'essay' ? null : (resolveQuestionScore(que) === 1),
                        // Forcefully inject reference data for Matrix Initialization (Row 2 & 3)
                        correctAnswer: resolveCorrectAnswerText(que),
                        explanation: String(que.explanation || que.explanationAr || que.explanationEn || que.rationale || "")
                    }))
                };

                // ── 10-SECOND WATCHDOG (Submit & Verify) ─────────────
                // Cache payload + reason for potential re-submission
                verifyPayloadRef.current = atomicPayload;
                verifyReasonRef.current = reason;
                setModalType('submission_loader');

                const WATCHDOG_TIMEOUT_MS = 10000;
                const TIMEOUT_SENTINEL = Symbol('TIMEOUT');

                try {
                    const url = quiz.webhookUrl || '';
                    const fetchPromise = Luminova.Services.GAS.submitExam(url, atomicPayload);
                    const timeoutPromise = new Promise(resolve =>
                        setTimeout(() => resolve(TIMEOUT_SENTINEL), WATCHDOG_TIMEOUT_MS)
                    );

                    const result = await Promise.race([fetchPromise, timeoutPromise]);

                    if (result === TIMEOUT_SENTINEL) {
                        // ── TIMEOUT: No response within 10s ──────────
                        setSubmissionLock(false);
                        setModalType('verify_timeout');
                        // NOTE: The actual fetch is still in flight.
                        // We do NOT abort it — if the server processes
                        // it late, the idempotency key prevents duplicates.
                        return;
                    }

                    // ── SERVER RESPONDED WITHIN 10s ──────────────────
                    if (result && result.status === 'ok') {
                        safeExitFullscreen();
                        setSubmissionLock(false);
                        setIsFinished(true);
                        setModalType('verify_success');
                        setDebugError(null);
                        localStorage.removeItem('quiz_progress_' + quiz.id);
                    } else {
                        throw new Error('Backend validation failed');
                    }
                } catch (e) {
                    console.error('Submission failed:', e);
                    setDebugError(e?.message || 'Unknown Error');
                    const isNetworkFailure = e?.isNetworkError === true
                        || e?.luminovaNetworkError === true
                        || /network|failed to fetch|timeout|connection|اتصال/i.test(String(e?.message || ''));
                    if (isNetworkFailure) {
                        setSubmissionLock(false);
                        setModalType('submission_failed');
                    }
                    return;
                }
            } else {
                safeExitFullscreen();
                setSubmissionLock(false);
                setIsFinished(true);
                localStorage.removeItem('quiz_progress_' + quiz.id);
            }
        };

        // ── VERIFICATION HANDLER (Step 3 of Watchdog) ────────────
        const handleVerifyDelivery = async () => {
            if (!quiz.webhookUrl) return;
            setModalType('submission_loader');
            try {
                const checkResult = await Luminova.Services.GAS.verifyStudent(
                    quiz.webhookUrl,
                    studentInfo.email
                );
                if (checkResult && checkResult.status === 'exists') {
                    // Data arrived — student is safe
                    safeExitFullscreen();
                    setIsFinished(true);
                    setSubmissionLock(false);
                    setModalType('verify_confirmed');
                    localStorage.removeItem('quiz_progress_' + quiz.id);
                } else {
                    // Data NOT found — auto-retry submission
                    setModalType('verify_retry');
                    // Small delay so the user sees the retry message
                    await new Promise(r => setTimeout(r, 2500));
                    // Re-submit with cached payload
                    setSubmissionLock(false);
                    submitExam(verifyReasonRef.current);
                }
            } catch (verifyErr) {
                console.error('Verification check failed:', verifyErr);
                setDebugError(verifyErr?.message || 'Verification network error');
                setSubmissionLock(false);
                setModalType('submission_failed');
            }
        };

        useEffect(() => {
            if (isStarted && !isFinished && isEvaluation && quiz.endTime && isTimeSynced && now) {
                const deadline = parseCairoDeadline(quiz.endTime);
                if (deadline && now >= deadline) {
                    if (!isDelayAllowed() && !timeExpiredSubmitRef.current) {
                        timeExpiredSubmitRef.current = true;
                        submitExam('time_expired');
                    }
                }
            }
        }, [now, isStarted, isFinished, isEvaluation, isTimeSynced, quiz?.endTime]);

        useEffect(() => {
            if (isStarted && !isFinished && isEvaluation && !hasAttemptedSubmit) {
                const cheatGuard = () => {
                    if (immunityRef.current || isSubmitting) return;
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
                    if (immunityRef.current || !isStarted) return;
                    if (document.hidden) cheatGuard();
                };

                // Window blur (fallback for visibility)
                const handleBlur = () => {
                    if (immunityRef.current || !isStarted) return;
                    cheatGuard();
                };

                // Fullscreen exit detection
                const handleFullscreenChange = () => {
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
        }, [isStarted, isFinished, isEvaluation, isSubmitting, hasAttemptedSubmit, cheatWarnings, submitExam, quiz?.autoSubmitOnCheat]);

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
                <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-zinc-950">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    <div className="relative z-10 max-w-lg w-full bg-zinc-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 animate-fade-in border border-white/10">
                        <div className="text-center mb-8">
                            <svg className="w-20 h-20 mx-auto mb-4 text-white drop-shadow-lg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <h2 className="text-3xl font-black mb-2 text-white">
                                ${lang === 'ar' ? 'تعليمات الامتحان' : 'Exam Instructions'}
                            </h2>
                            <p className="text-sm font-bold text-gray-400">
                                ${lang === 'ar' ? 'يرجى قراءة التعليمات بعناية قبل البدء' : 'Please read the instructions carefully before starting'}
                            </p>
                        </div>
                        <div className="space-y-4 mb-8 text-white">
                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <span className="text-2xl mt-0.5">⏱️</span>
                                <p className="text-sm font-bold text-gray-300 leading-relaxed">
                                    ${lang === 'ar'
                                    ? (quiz.endTime ? 'الامتحان محدد بوقت. سيتم تسليم إجاباتك تلقائياً عند انتهاء الوقت.' : 'لا يوجد حد زمني لهذا الامتحان.')
                                    : (quiz.endTime ? 'This exam is timed. Your answers will be auto-submitted when time runs out.' : 'There is no time limit for this exam.')}
                                </p>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                                <span className="text-2xl mt-0.5">🚫</span>
                                <p className="text-sm font-bold text-gray-300 leading-relaxed">
                                    ${lang === 'ar'
                                    ? 'نظام مراقبة إلكتروني مفعّل. مغادرة شاشة الامتحان (تبديل التطبيقات أو النوافذ) ستمنحك إنذاراً واحداً فقط. عند التكرار، سيتم سحب الامتحان وتسليمه تلقائياً.'
                                    : 'Electronic proctoring is active. Switching tabs or apps will give you ONE warning only. A second violation will auto-submit and terminate your exam.'}
                                </p>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <span className="text-2xl mt-0.5">📝</span>
                                <p className="text-sm font-bold text-gray-300 leading-relaxed">
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
            const isFormValid = studentInfo.name && studentInfo.seatNumber && studentInfo.department && isEmailValid;
            const verifyAndStart = async () => {
                if (!isTimeSynced || cairoOffsetMs === null) {
                    setDebugError(lang === 'ar' ? 'جاري مزامنة وقت الخادم. يرجى المحاولة بعد لحظات.' : 'Server time is still synchronizing. Please try again in a moment.');
                    return;
                }
                if (!quiz.webhookUrl || !quiz.webhookUrl.includes('/macros/s/') || !quiz.webhookUrl.endsWith('/exec')) {
                    setDebugError("INVALID WEBHOOK URL: The URL must be a Web App URL ending in '/exec', not a library or script ID URL.");
                    setGatewayError('network_error');
                    return;
                }
                setIsVerifying(true);
                setGatewayError(null);
                setDebugError(null);
                try {
                    const response = await Luminova.Services.GAS.verifyStudent(quiz.webhookUrl, studentInfo.email);

                    if (response && response.status === 'clear') {
                        setModalType('exam_rules');
                    } else if (response && response.status === 'exists') {
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

            if (!isTimeSynced || !now) {
                timeStatus = 'syncing';
                timeMsg = lang === 'ar' ? 'جاري مزامنة وقت الخادم...' : 'Synchronizing server time...';
            } else if (quiz.startTime && now < parseCairoDeadline(quiz.startTime)) {
                timeStatus = 'early';
                const diff = parseCairoDeadline(quiz.startTime) - now;
                const d = Math.floor(diff / 86400000);
                const h = Math.floor((diff % 86400000) / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                
                const startDate = parseCairoDeadline(quiz.startTime);
                try {
                    dateMsg = new Intl.DateTimeFormat('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric', hour12: true }).format(startDate);
                } catch(e) { dateMsg = startDate.toLocaleString('ar-EG'); }
                
            } else if (quiz.endTime && now > parseCairoDeadline(quiz.endTime)) {
                timeStatus = 'late';
                timeMsg = lang === 'ar' ? '\u0639\u0630\u0631\u0627\u064B\u060C \u0644\u0642\u062F \u0627\u0646\u062A\u0647\u0649 \u0645\u0648\u0639\u062F \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631' : 'Sorry, the exam has ended';
            }

            let gatewayContent;
            if (timeStatus === 'syncing') {
                gatewayContent = html`
                    <div className="text-center p-8 bg-cyan-500/10 rounded-3xl border border-cyan-500/30 mb-6 backdrop-blur-xl">
                        <div className="text-4xl mb-4 text-white">\u23F3</div>
                        <div className="text-lg font-black text-cyan-300">${timeMsg}</div>
                        <p className="text-xs opacity-70 font-bold text-cyan-100 mt-3">${lang === 'ar' ? '\u0644\u0646 \u064A\u0628\u062F\u0623 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0642\u0628\u0644 \u062A\u062B\u0628\u064A\u062A \u0648\u0642\u062A \u0645\u0648\u062B\u0648\u0642 \u0645\u0646 \u0627\u0644\u062E\u0627\u062F\u0645.' : 'The exam will not start until a trusted server clock is available.'}</p>
                    </div>`;
            } else if (timeStatus === 'early') {
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
                    <div className="lmv-countdown-gate text-center p-6 sm:p-8 bg-cyan-500/10 rounded-3xl border border-cyan-500/30 mb-6 backdrop-blur-xl">
                        <div className="lmv-countdown-segments flex items-center justify-center gap-3 sm:gap-5 mb-4">
                            ${countdownDigits.map((seg, i) => html`
                                <${React.Fragment} key=${i}>
                                    <div className="lmv-countdown-segment flex flex-col items-center">
                                        <span className="lmv-countdown-digit text-3xl sm:text-5xl font-black text-cyan-400 tabular-nums leading-none px-3 sm:px-5 py-2 sm:py-3 rounded-2xl bg-black/20 shadow-[0_0_15px_rgba(34,211,238,0.3)] min-w-[3rem] sm:min-w-[4.5rem] text-center">${seg.value}</span>
                                        <span className="lmv-countdown-label text-[0.65rem] sm:text-xs font-bold text-cyan-200/70 mt-1.5 uppercase tracking-wider">${seg.label}</span>
                                    </div>
                                    ${i < countdownDigits.length - 1 ? html`<span className="lmv-countdown-sep text-2xl sm:text-3xl font-black text-cyan-500/50 mt-[-0.75rem] select-none">:</span>` : ''}
                                <//>
                            `)}
                        </div>
                        <p className="text-sm opacity-90 font-bold text-white mb-2">${lang === 'ar' ? '\u064A\u0631\u062C\u0649 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631\u060C \u0633\u064A\u062A\u0645 \u0627\u0644\u062A\u0641\u0639\u064A\u0644 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B' : 'Please wait, will auto-start'}</p>
                        <p className="text-xs opacity-60 font-medium text-cyan-100">${dateMsg}</p>
                    </div>`;
            } else if (timeStatus === 'late') {
                gatewayContent = html`
                    <div className="w-full space-y-4">
                        <div className="text-center p-8 bg-red-500/10 rounded-3xl border border-red-500/30">
                            <svg className="w-16 h-16 mx-auto mb-4 text-red-500 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <div className="text-2xl font-black text-red-500 mb-2">${timeMsg}</div>
                        </div>
                        <div className="text-center">
                            <button onClick=${goBack} className="w-full py-4 bg-zinc-800 text-white rounded-xl font-bold">${lang === 'ar' ? 'العودة' : 'Go Back'}</button>
                        </div>
                    </div>`;
            } else if (gatewayError === 'exists') {
                gatewayContent = html`
                    <div className="w-full text-center p-8 rounded-3xl mb-6 bg-red-500/5 border border-red-500/20">
                        <svg className="w-20 h-20 mx-auto mb-4 text-white drop-shadow-lg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <h2 className="text-2xl font-black text-red-500 mb-3">${lang === 'ar' ? 'عفواً، لا يمكنك الدخول' : 'Access Denied'}</h2>
                        <p className="text-sm font-bold text-gray-400 mb-6 leading-relaxed">
                            ${lang === 'ar' ? 'عذراً، هذا البريد الإلكتروني مسجل بالفعل. لا يمكن أداء الاختبار أكثر من مرة.' : 'This email is already registered. You cannot retake the exam.'}
                        </p>
                        <div className="space-y-3">
                            <button onClick=${() => { setGatewayError(null); setDebugError(null); }} className="w-full py-3 rounded-xl font-bold bg-amber-600 text-white">
                                ${lang === 'ar' ? '🔄 تعديل البيانات' : '🔄 Edit Info'}
                            </button>
                            <button onClick=${goBack} className="w-full py-3 rounded-xl font-bold bg-gray-700 text-white">
                                ${lang === 'ar' ? 'العودة' : 'Go Back'}
                            </button>
                        </div>
                    </div>`;
            } else if (gatewayError === 'invalid_data') {
                gatewayContent = html`
                    <div className="w-full">
                        <div className="text-center p-8 rounded-3xl mb-6 bg-amber-500/5 border border-amber-500/20">
                            <div className="text-7xl mb-4 text-white">⚠️</div>
                            <h2 className="text-2xl font-black text-amber-500 mb-3">${lang === 'ar' ? 'بيانات غير صحيحة' : 'Information Mismatch'}</h2>
                            <p className="text-sm font-bold text-gray-400 mb-2 leading-relaxed">
                                ${lang === 'ar' ? 'لم يتم العثور على بياناتك في السجلات.' : 'Your information was not found in the records.'}
                            </p>
                            <p className="text-sm font-bold text-gray-500 mb-6 leading-relaxed">
                                ${lang === 'ar' ? 'الاسم أو رقم الجلوس أو البريد الإلكتروني الذي أدخلته لا يتطابق مع قاعدة البيانات. يرجى التحقق والمحاولة مرة أخرى.' : 'The Name, Seat Number, or Email you entered does not match the database. Please verify and try again.'}
                            </p>
                            <div className="space-y-3">
                                <button onClick=${() => { setGatewayError(null); setDebugError(null); }} className="w-full py-3 rounded-xl font-bold bg-amber-600 text-white">
                                    ${lang === 'ar' ? '🔄 العودة وتعديل البيانات' : '🔄 Go Back and Edit'}
                                </button>
                                <button onClick=${goBack} className="w-full py-3 rounded-xl font-bold bg-gray-700 text-white">
                                    ${lang === 'ar' ? 'العودة' : 'Go Back'}
                                </button>
                            </div>
                        </div>
                    </div>`;
            } else if (gatewayError === 'network_error') {
                gatewayContent = html`
                    <div className="w-full text-center p-8 bg-orange-900/10 rounded-3xl border border-orange-500/30 mb-6">
                        <div className="text-7xl mb-4 text-white">📡</div>
                        <h2 className="text-xl font-black text-orange-500 mb-2">${lang === 'ar' ? 'فشل الاتصال' : 'Connection Error'}</h2>
                        <p className="text-sm text-gray-400 mb-6">${debugError || 'Network issues detected.'}</p>
                        <button onClick=${() => { setGatewayError(null); setDebugError(null); setCairoOffsetMs(null); setIsTimeSynced(false); setTimeSyncRetryToken(v => v + 1); }} className="w-full py-3 bg-orange-600 text-white rounded-xl mb-3">
                            ${lang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
                        </button>
                        <button onClick=${goBack} className="w-full py-3 bg-zinc-800 text-white rounded-xl">
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
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
                <button onClick=${goBack} className="absolute top-6 left-6 sm:left-10 z-50 bg-white/5 backdrop-blur-2xl hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-black shadow-lg transition-all flex items-center gap-2 border border-white/10 hover:scale-105">
                    <span className="text-xl text-white">🔙</span> ${lang === 'ar' ? 'الخروج' : 'Back'}
                </button>
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10 max-w-lg w-full bg-zinc-900/50 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4 text-white">🎓</div>
                        <h2 className="text-3xl font-black text-white mb-2">${quiz.titleAr || quiz.title || quiz.titleEn}</h2>
                        <p className="text-gray-400 font-bold">${lang === 'ar' ? 'بوابة الدخول للاختبار التقييمي' : 'Evaluation Exam Gateway'}</p>
                    </div>
                    ${gatewayContent}
                </div>
            </div>`;
        }

        const q = questions[currentIndex];

        const handleFinish = () => {
            if (isSubmitting || submitLockRef.current) return;
            setModalType('submit');
        };

        if (isFinished) {
            // ── VERIFICATION MODAL SYSTEM ─────────────────────────
            const verifyModal = (() => {
                if (modalType === 'verify_success') return html`
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style=${{ background: 'rgba(10,5,20,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md border border-white/10 animate-fade-in text-center">
                            <div className="text-7xl mb-6">✅</div>
                            <h2 className="text-3xl font-black text-white mb-4">
                                ${lang === 'ar' ? 'عاش يا بطل!' : 'Submission Verified!'}
                            </h2>
                            <p className="text-lg font-bold text-fuchsia-100/60 mb-8 leading-relaxed">
                                ${lang === 'ar' ? 'تم التسليم والتحقق من وصول إجاباتك بنجاح ✅' : 'Your answers have been submitted and verified successfully ✅'}
                            </p>
                            <button onClick=${() => setModalType(null)} className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-500 text-white shadow-xl transition-all text-xl">
                                ${lang === 'ar' ? 'متابعة' : 'Continue'}
                            </button>
                        </div>
                    </div>
                `;
                if (modalType === 'verify_confirmed') return html`
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style=${{ background: 'rgba(10,5,20,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md border border-emerald-500/20 animate-fade-in text-center">
                            <div className="text-7xl mb-6">🌟</div>
                            <h2 className="text-3xl font-black text-white mb-4">
                                ${lang === 'ar' ? 'اطمن يا هندسة!' : 'You\'re All Good!'}
                            </h2>
                            <p className="text-lg font-bold text-emerald-200/70 mb-8 leading-relaxed">
                                ${lang === 'ar' ? 'نتيجتك وصلت وسجلناها بالفعل! تقدر تخرج دلوقتي وأنت مطمن 🌟' : 'Your result has been received and recorded! You can leave now with full confidence 🌟'}
                            </p>
                            <button onClick=${() => setModalType(null)} className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-500 text-white shadow-xl transition-all text-xl">
                                ${lang === 'ar' ? 'تمام، خلاص' : 'Got It'}
                            </button>
                        </div>
                    </div>
                `;
                return '';
            })();

            if (isEvaluation && String(quiz.showResultsAfter) !== 'true') {
                return html`
                ${verifyModal}
                <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
                    <div className="relative z-10 max-w-md w-full bg-white/2 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 border border-white/10 animate-fade-in text-center">
                        ${isLateSubmission && html`
                            <div className="mb-6 px-4 py-2 bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 rounded-xl font-bold text-sm">
                                ⚠️ ${lang === 'ar' ? 'تم التسليم بنجاح، ولكن تم تسجيل تأخيرك عن الموعد المحدد.' : 'Successfully submitted, but marked as late.'}
                            </div>
                        `}
                        <div className="text-7xl mb-6 ${terminationReason === 'completed' ? 'animate-bounce' : ''}">
                            ${terminationReason === 'completed' ? '✅' : '⛔'}
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">
                            ${terminationReason === 'completed'
                        ? (lang === 'ar' ? 'تم تسليم امتحانك بنجاح!' : 'Your exam has been submitted successfully!')
                        : terminationReason === 'time_expired'
                            ? (lang === 'ar' ? 'انتهى الوقت!' : 'Time Expired!')
                            : (lang === 'ar' ? 'تم سحب الامتحان' : 'Exam Terminated')}
                        </h2>
                        <p className="text-lg font-bold text-fuchsia-100/60 mb-10 leading-relaxed">
                            ${terminationReason === 'completed'
                        ? (lang === 'ar' ? 'شكراً لك، تم حفظ جميع إجاباتك.' : 'Thank you, all your answers have been saved.')
                        : terminationReason === 'time_expired'
                            ? (lang === 'ar' ? 'انتهى الوقت المسموح به، تم حفظ وتسليم إجاباتك تلقائياً.' : 'Time is up. Your answers have been automatically saved and submitted.')
                            : (lang === 'ar' ? 'تم سحب الامتحان وإرساله للإدارة نظراً لمخالفة قواعد المراقبة والخروج من الشاشة أكثر من مرة.' : 'Exam force-submitted and sent to administration due to repeated proctoring violations.')}
                        </p>
                        <${Luminova.Components.Button} onClick=${goBack} className="w-full py-4 text-xl rounded-2xl font-black bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-500 text-white shadow-xl transition-all hover:scale-[1.02]">
                            ${lang === 'ar' ? 'الخروج للمواد' : 'Return to Subjects'}
                        </${Luminova.Components.Button}>
                    </div>
                </div>
                `;
            }

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
            ${verifyModal}
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
                ${terminationReason !== 'completed' && html`
                    <div className="text-center mt-6 px-6 py-4 bg-red-500/20 text-red-600 dark:text-red-500 border border-red-500/50 rounded-2xl font-bold text-lg max-w-xl mx-auto shadow-lg animate-pulse">
                        ⚠️ ${terminationReason === 'time_expired'
                        ? (lang === 'ar' ? 'انتهى الوقت المسموح به، تم حفظ وتسليم إجاباتك تلقائياً.' : 'Time is up. Your answers have been automatically saved and submitted.')
                        : (lang === 'ar' ? 'تم سحب الامتحان وإرساله للإدارة نظراً لمخالفة قواعد المراقبة والخروج من الشاشة أكثر من مرة.' : 'Exam force-submitted and sent to administration due to repeated proctoring violations.')}
                    </div>
                `}
                ${isLateSubmission && html`
                    <div className="text-center mt-6 px-6 py-4 bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 border border-yellow-500/50 rounded-2xl font-bold text-lg max-w-xl mx-auto shadow-lg animate-pulse">
                        ⚠️ ${lang === 'ar' ? 'تم التسليم بنجاح، ولكن تم تسجيل تأخيرك عن الموعد المحدد.' : 'Successfully submitted, but marked as late.'}
                    </div>
                `}
                <${Luminova.Components.GlassCard} className="text-center py-16 bg-gradient-to-b from-rose-500/5 to-transparent border-t-8 border-t-rose-500 rounded-[3rem] shadow-2xl">
                    <h2 className="text-5xl font-black mb-6 uppercase tracking-wider text-white">${Luminova.i18n[lang].results}</h2>
                    <div className="text-8xl font-black text-rose-400 drop-shadow-2xl mb-8">${score} <span className="text-4xl opacity-30 text-white">/ ${maxScore}</span></div>
                    <${Luminova.Components.Button} onClick=${goBack} className="px-10 py-4 text-xl rounded-full shadow-2xl hover:scale-105 bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-500 text-white">${lang === 'ar' ? 'العودة لصفحة الاختبارات' : 'Return to Subjects'}</${Luminova.Components.Button}>
                </${Luminova.Components.GlassCard}>
                
                ${questions.map((que, idx) => {
                            let isCorrect = false;
                            if (que.type === 'mcq') isCorrect = answers[que.id] === que.correctAnswers?.[0];
                            if (que.type === 'multi_select') isCorrect = [...(que.correctAnswers || [])].sort().join(',') === [...(answers[que.id] || [])].sort().join(',');
                            const studentProv = safeStudents.find(s => s.id === que?.studentId) || (que?.studentId === 's_founder' || que?.studentId === Luminova.FOUNDER.id ? Luminova.FOUNDER : null);

                            return html`
                        <${Luminova.Components.GlassCard} key=${que?.id || `result-q-${idx}`} className=${`border-r-4 ${que.type !== 'essay' ? (isCorrect ? 'border-r-green-500' : 'border-r-red-500') : 'border-r-rose-500'} relative`}>
                            <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-xl bg-black/10 dark:bg-white/10 font-bold text-sm">
                                ${que.score} ${Luminova.i18n[lang].score}
                            </div>
                            
                            ${studentProv && html`
                                <div className="flex flex-row justify-between items-center bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 mb-4 w-full">
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-xs text-slate-400">المساهم بالمعلومة:</span>
                                        <span className="text-sm font-bold text-yellow-500">${lang === 'ar' ? studentProv.nameAr || studentProv.name : studentProv.nameEn || studentProv.name}</span>
                                    </div>
                                    <${Luminova.Components.Avatar} name=${studentProv.nameAr || studentProv.name} image=${studentProv.image} size="w-12 h-12 rounded-full border-2 border-slate-600 shadow-sm shrink-0" />
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
                                        <p className="font-black text-rose-400 mb-2">${Luminova.i18n[lang].modelAnswer}</p>
                                        <p className="text-md leading-relaxed p-4 bg-white/2 backdrop-blur-xl rounded border-l-4 border-l-rose-500 font-medium">${que.modelAnswer || que.modelAnswerAr}</p>
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

        // ── UX FIX: Graceful Empty State (Coming Soon) ──
        if (!q) {
            return html`
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-zinc-950">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-indigo-500/10 pointer-events-none"></div>
                <div className="max-w-md w-full backdrop-blur-3xl bg-white/2 border border-white/10 rounded-[2.5rem] p-12 text-center animate-fade-in shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative z-10">
                    <div className="relative mb-8">
                        <div className="text-7xl animate-pulse drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">⏳</div>
                        <div className="absolute -inset-4 bg-rose-500/20 rounded-full blur-2xl animate-pulse -z-10"></div>
                    </div>
                    
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                        ${lang === 'ar' ? 'جاري تحضير الاختبار...' : 'Preparing Exam...'}
                    </h2>
                    
                    <p className="text-lg font-bold text-gray-400 mb-10 leading-relaxed">
                        ${lang === 'ar' ? 'يرجى العودة لاحقاً' : 'Please check back later'}
                    </p>
                    
                    <button onClick=${goBack}
                        className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 shadow-xl backdrop-blur-md">
                        ${lang === 'ar' ? '🔙 العودة للمكتبة' : '🔙 Back to Library'}
                    </button>
                </div>
            </div>
            `;
        }

        const currentQStudent = safeStudents.find(s => s.id === q?.studentId) || ((q?.studentId === 's_founder' || q?.studentId === Luminova.FOUNDER.id) ? Luminova.FOUNDER : {});

        return html`
        <div className="max-w-4xl mx-auto min-h-[70vh] flex flex-col pt-10 pb-20">

            ${/* ── SUBMISSION LOADER (Watchdog Phase 1) ── */
            modalType === 'submission_loader' && html`
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style=${{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(24px)' }}>
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 flex flex-col items-center max-w-md w-full animate-fade-in">
                        <div className="animate-spin text-6xl mb-6 text-cyan-400">⏳</div>
                        <h2 className="text-2xl font-black text-white mb-3 text-center">${lang === 'ar' ? 'جاري إرسال بياناتك وتأمينها...' : 'Submitting and securing your data...'}</h2>
                        <p className="text-sm text-zinc-400 font-bold text-center">${lang === 'ar' ? 'لا تغلق الصفحة' : 'Please do not close this page'}</p>
                    </div>
                </div>
            `}

            ${/* ── VERIFY TIMEOUT (Watchdog Phase 2) ── */
            modalType === 'verify_timeout' && html`
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style=${{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(24px)' }}>
                    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md border border-amber-500/20 animate-fade-in text-center">
                        <div className="text-7xl mb-6">⏱️</div>
                        <h2 className="text-2xl font-black text-white mb-4">${lang === 'ar' ? 'الخادم لم يرد بعد' : 'Server has not responded yet'}</h2>
                        <p className="text-base font-bold text-amber-200/70 mb-8 leading-relaxed">
                            ${lang === 'ar' ? 'ممكن يكون النت بطيء. اضغط الزر ده عشان نتأكد إن إجاباتك وصلت.' : 'The connection may be slow. Click below to verify your answers were received.'}
                        </p>
                        <button onClick=${handleVerifyDelivery} className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-xl transition-all text-xl hover:scale-[1.02] active:scale-[0.98]">
                            ${lang === 'ar' ? 'تأكيد حالة التسليم' : 'Verify Submission Status'}
                        </button>
                    </div>
                </div>
            `}

            ${/* ── VERIFY RETRY (Data not found — auto-resubmitting) ── */
            modalType === 'verify_retry' && html`
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style=${{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(24px)' }}>
                    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md border border-rose-500/20 animate-fade-in text-center">
                        <div className="text-7xl mb-6 animate-pulse">🔄</div>
                        <h2 className="text-2xl font-black text-white mb-4">${lang === 'ar' ? 'إعادة الإرسال تلقائياً' : 'Auto-Resubmitting'}</h2>
                        <p className="text-base font-bold text-rose-200/70 mb-4 leading-relaxed">
                            ${lang === 'ar' ? 'تحققنا ولقينا إن الداتا موصلتش بسبب النت، هنحاول نبعتها تاني فوراً..' : 'We checked and the data did not arrive due to network issues. Re-submitting now...'}
                        </p>
                    </div>
                </div>
            `}

            ${/* ── SUBMISSION FAILED (Network Error — Manual Retry) ── */
            modalType === 'submission_failed' && html`
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style=${{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(24px)' }}>
                    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md border border-red-500/20 animate-fade-in text-center">
                        <div className="text-7xl mb-6 text-red-400">📡</div>
                        <h2 className="text-2xl font-black text-white mb-4">${lang === 'ar' ? 'فشل الإرسال' : 'Submission Failed'}</h2>
                        <p className="text-base font-bold text-zinc-400 mb-4 leading-relaxed">
                            ${lang === 'ar' ? 'حدث خطأ أثناء إرسال إجاباتك. لا تقلق، إجاباتك محفوظة. يرجى المحاولة مرة أخرى.' : 'An error occurred while sending your answers. Don\'t worry, your answers are saved. Please try again.'}
                        </p>
                        ${debugError && html`<div className="p-3 mb-6 bg-red-500/10 text-red-400 rounded-xl text-xs font-mono text-left break-words border border-red-500/20">${debugError}</div>`}
                        <button onClick=${() => submitExam(terminationReason)} disabled=${isSubmitting}
                            className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-500 text-white shadow-xl transition-all text-xl disabled:opacity-50 hover:scale-[1.02]">
                            ${isSubmitting ? (lang === 'ar' ? 'جاري إعادة الإرسال...' : 'Retrying...') : (lang === 'ar' ? 'إعادة إرسال النتيجة' : 'Retry Submission')}
                        </button>
                    </div>
                </div>
            `}

            ${/* ── VERIFY SUCCESS (inline during active exam for force-submit) ── */
            modalType === 'verify_success' && !isFinished && html`
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style=${{ background: 'rgba(10,5,20,0.6)', backdropFilter: 'blur(24px)' }}>
                    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md border border-white/10 animate-fade-in text-center">
                        <div className="text-7xl mb-6">✅</div>
                        <h2 className="text-3xl font-black text-white mb-4">${lang === 'ar' ? 'عاش يا بطل!' : 'Verified!'}</h2>
                        <p className="text-lg font-bold text-fuchsia-100/60 mb-8 leading-relaxed">${lang === 'ar' ? 'تم التسليم والتحقق من وصول إجاباتك بنجاح ✅' : 'Submitted and verified ✅'}</p>
                        <button onClick=${() => setModalType(null)} className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-500 text-white shadow-xl text-xl">
                            ${lang === 'ar' ? 'متابعة' : 'Continue'}
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
                            ${lang === 'ar' ? 'خروج من الامتحان' : 'Leave Exam'}
                        </h2>
                        <p className="text-base font-bold text-gray-500 dark:text-gray-400 mb-7 leading-relaxed">
                            ${isEvaluation
                    ? (lang === 'ar' ? 'تحذير: خروجك الآن سيعتبر تسليماً نهائياً للامتحان.' : 'Warning: Exiting now will count as a final submission.')
                    : (lang === 'ar' ? 'هل أنت متأكد من الخروج من الامتحان؟ الإجابات لن تُحفظ.' : 'Are you sure you want to leave? Your progress will be lost.')}
                        </p>
                        <div className="flex gap-3">
                            <button onClick=${() => setModalType(null)}
                                className="flex-1 py-3.5 rounded-2xl font-black bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 transition-all"
                            >${lang === 'ar' ? 'تراجع' : 'Stay'}</button>
                            <button disabled=${isSubmitting} onClick=${() => {
                    if (isEvaluation) { submitExam(); } else { safeExitFullscreen(); setModalType(null); goBack(); }
                }}
                                className="flex-1 py-3.5 rounded-2xl font-black bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >${isSubmitting ? (lang === 'ar' ? 'جاري التسليم...' : 'Submitting...') : (isEvaluation ? (lang === 'ar' ? 'تسليم وخروج' : 'Submit & Exit') : (lang === 'ar' ? 'نعم، خروج' : 'Yes, Exit'))}</button>
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
                            ${lang === 'ar' ? 'تسليم الامتحان' : 'Submit Exam'}
                        </h2>
                        <p className="text-base font-bold text-gray-500 dark:text-gray-400 mb-7 leading-relaxed">
                            ${lang === 'ar' ? 'هل أنت متأكد من إنهاء الامتحان وتسليم الإجابات؟' : 'Are you sure you want to finish and submit your answers?'}
                        </p>
                        <div className="flex gap-3">
                            <button onClick=${() => setModalType(null)}
                                className="flex-1 py-3.5 rounded-2xl font-black bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 transition-all"
                            >${lang === 'ar' ? 'تراجع' : 'Cancel'}</button>
                            <button disabled=${isSubmitting} onClick=${() => submitExam('completed')}
                                className="flex-1 py-3.5 rounded-2xl font-black bg-gradient-to-r from-brand-DEFAULT to-green-500 text-white shadow-lg shadow-brand-DEFAULT/30 transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                            >${isSubmitting ? (lang === 'ar' ? 'جاري التسليم...' : 'Submitting...') : (lang === 'ar' ? 'نعم، إنهاء وتسليم' : 'Yes, Submit')}</button>
                        </div>
                    </div>
                </div>
            `}

            <!-- Cheat Warning Modal -->
            ${modalType === 'cheat_warning' && html`
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style=${{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(24px)' }}
                >
                    <div className="bg-white/5 backdrop-blur-3xl rounded-3xl p-10 w-full max-w-md border border-rose-500/50 animate-fade-in text-center">
                        <div className="text-7xl mb-6 animate-pulse text-rose-500">🚫</div>
                        <h2 className="text-3xl font-black text-white mb-4">
                            ${lang === 'ar' ? 'إنذار: مخالفة قواعد المراقبة' : 'Warning: Proctored Rule Violation'}
                        </h2>
                        <p className="text-lg font-bold text-zinc-400 mb-8 leading-relaxed">
                            ${lang === 'ar'
                    ? 'لقد قمت بمغادرة شاشة الاختبار. تكرار هذا الإجراء سيؤدي إلى سحب ورقتك وتسليم الامتحان تلقائياً.'
                    : 'You left the exam screen. Repeating this action will force submit your exam automatically.'}
                        </p>
                        <button onClick=${() => setModalType(null)}
                            className="w-full py-4 rounded-2xl font-black bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/30 transition-all text-xl"
                        >${lang === 'ar' ? 'موافق / أوافق على الاستمرار' : 'Understood'}</button>
                    </div>
                </div>
            `}

            <!-- Network Error Modal -->
            ${modalType === 'network_error' && html`
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style=${{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}>
                    <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md border border-white/10 animate-fade-in text-center">
                        <div className="text-7xl mb-6 text-rose-400 drop-shadow-lg">📡</div>
                        <h2 className="text-3xl font-black text-white mb-4">
                            ${lang === 'ar' ? 'خطأ في الاتصال' : 'Network Error'}
                        </h2>
                        <p className="text-zinc-400 font-bold mb-8 leading-relaxed">
                            ${lang === 'ar' 
                            ? 'عذراً، حدث خطأ أثناء الاتصال بالخادم. تأكد من جودة الإنترنت وحاول لاحقاً.' 
                            : 'Sorry, there was an error connecting to the server. Please check your internet and try again.'}
                        </p>
                        ${debugError && html`<div className="p-3 mb-6 bg-red-500/10 text-red-400 rounded-xl text-xs font-mono text-left break-words border border-red-500/20">${debugError}</div>`}
                        <button onClick=${() => setModalType(null)}
                            className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-500 hover:opacity-90 text-white shadow-xl transition-all text-xl"
                        >${lang === 'ar' ? 'إغلاق والمحاولة لاحقاً' : 'Close and Retry'}</button>
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
                            ${lang === 'ar' ? 'عفواً، لا يمكنك الدخول' : 'Access Denied'}
                        </h2>
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                            ${lang === 'ar'
                    ? 'لقد قمت بأداء هذا الاختبار مسبقاً.'
                    : 'You have already submitted this exam.'}
                        </p>
                        <button onClick=${() => setModalType(null)}
                            className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:opacity-90 text-white shadow-xl transition-all text-xl"
                        >${lang === 'ar' ? 'رجوع لتعديل البيانات' : 'Back to Edit Info'}</button>
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
                            ${lang === 'ar' ? 'فشل الإرسال' : 'Submission Failed'}
                        </h2>
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                            ${lang === 'ar'
                    ? 'حدث خطأ أثناء إرسال إجاباتك. لا تقلق، إجاباتك محفوظة. يرجى المحاولة مرة أخرى.'
                    : 'An error occurred while sending your answers. Don\'t worry, your answers are saved. Please try again.'}
                        </p>
                        ${debugError && html`<div className="p-3 mb-6 bg-red-100 text-red-800 rounded-xl text-xs font-mono text-left break-words border border-red-300">${debugError}</div>`}
                        <button onClick=${() => submitExam(terminationReason)}
                            disabled=${isSubmitting}
                            className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-brand-DEFAULT to-brand-gold hover:opacity-90 text-white shadow-xl shadow-brand-gold/30 transition-all text-xl disabled:opacity-50"
                        >
                            ${isSubmitting ? (lang === 'ar' ? 'جاري إعادة الإرسال...' : 'Retrying...') : (lang === 'ar' ? 'إعادة إرسال النتيجة (Retry)' : 'Retry Submission')}
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
                            ${lang === 'ar' ? 'تعذر إكمال الاختبار' : 'Exam Terminated'}
                        </h2>
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                            ${lang === 'ar'
                    ? 'تم إرسال امتحانك تلقائياً نظراً لخروجك أكثر من مرة من شاشة الامتحان.'
                    : 'Your exam has been forcibly submitted due to repeated screen leaving violations.'}
                        </p>
                        <button onClick=${goBack}
                            className="w-full py-4 rounded-2xl font-black bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/30 transition-all text-xl"
                        >${lang === 'ar' ? 'العودة لصفحة الاختبارات' : 'Go Back'}</button>
                    </div>
                </div>
            `}

            ${showDrawer && html`
                <div className="fixed inset-0 z-[8000] flex animate-fade-in">
                    <div className="absolute inset-0 bg-[#0A0514]/60 backdrop-blur-sm" onClick=${() => setShowDrawer(false)}></div>
                    <div className="quiz-side-drawer fixed top-0 bottom-0 end-0 w-[300px] sm:w-[340px] flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)]" style=${{ background: 'rgba(9,9,11,0.95)', backdropFilter: 'blur(40px)', borderInlineStart: '1px solid rgba(255,255,255,0.1)' }}>
                        <!-- Close button -->
                        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
                            <h3 className="font-black text-lg text-rose-400 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                                ${lang === 'ar' ? 'خريطة الأسئلة' : 'Questions Map'}
                            </h3>
                            <button onClick=${() => setShowDrawer(false)} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500/30 flex items-center justify-center text-white/70 hover:text-red-400 transition-all text-base font-black">✕</button>
                        </div>
                        <!-- Progress summary -->
                        <div className="px-5 py-3 flex items-center justify-between text-xs font-bold text-white/50 border-b border-white/5">
                            <span>${lang === 'ar' ? 'تمت الإجابة' : 'Answered'}: <span className="text-green-400">${Object.keys(answers).filter(k => { const v = answers[k]; return v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0); }).length}</span> / ${questions.length}</span>
                            <span className="text-rose-400">${lang === 'ar' ? 'الحالي' : 'Current'}: ${currentIndex + 1}</span>
                        </div>
                        <!-- Question list -->
                        <div className="flex-1 overflow-y-auto px-4 py-3">
                            <div className="flex flex-col gap-2">
                                ${questions.map((qItem, i) => {
                        const isAnswered = answers[qItem?.id] !== undefined && (Array.isArray(answers[qItem?.id]) ? answers[qItem?.id].length > 0 : answers[qItem?.id] !== '');
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
                                        className=${`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-start transition-all duration-300 ${isCurrent ? 'bg-rose-500/20 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)] text-white' : isAnswered ? 'bg-white/5 hover:bg-white/10 border border-white/5 text-white/80' : 'bg-white/2 hover:bg-white/10 border border-transparent text-white/50'} ${isLocked ? 'opacity-30 cursor-not-allowed' : 'active:scale-[0.98]'}`}>
                                        <!-- Number circle -->
                                        <span className=${`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${isCurrent ? 'bg-rose-500 text-white shadow-md' : isAnswered ? 'bg-indigo-500/80 text-white' : 'bg-white/10 text-white/40'}`}>${i + 1}</span>
                                        <!-- Label -->
                                        <span className="flex-1 font-bold text-sm truncate text-white">${qLabel}</span>
                                        <!-- Status indicator -->
                                        ${isAnswered && !isCurrent ? html`<span className="text-indigo-400 text-base shrink-0">✓</span>` : null}
                                        ${isCurrent ? html`<span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0"></span>` : null}
                                    </button>
                                `;
                    })}
                            </div>
                        </div>
                    </div>
                </div>
            `}

            ${(isEvaluation && isStarted && !isFinished && quiz.endTime) ? (() => {
                const allowLate = isDelayAllowed();
                const deadline = parseCairoDeadline(quiz.endTime);
                const rawDiff = deadline && now ? deadline - now : 0;
                const isOvertime = rawDiff < 0;
                let diff = isOvertime ? Math.abs(rawDiff) : rawDiff;
                if (!isOvertime && diff < 0) diff = 0;
                const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                const isUrgent = !isOvertime && diff < 300000;
                if (isOvertime && allowLate) {
                    return html`
                        <div className="sticky top-4 z-50 mx-auto max-w-[calc(100vw-2rem)] px-4 sm:px-6 py-3 rounded-2xl sm:rounded-full border shadow-2xl backdrop-blur-2xl mb-6 font-mono text-xl sm:text-2xl font-black tracking-widest transition-all duration-300 bg-red-500/20 border-red-500 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center leading-none tabular-nums">
                            <span className="text-red-300 text-sm font-black uppercase tracking-widest me-2">${lang === 'ar' ? '+ متأخر' : '+ Late'}</span> ${h}:${m}:${s}
                        </div>
                    `;
                }
                return html`
                    <div className=${`sticky top-4 z-50 mx-auto max-w-[calc(100vw-2rem)] px-4 sm:px-6 py-3 rounded-2xl sm:rounded-full border shadow-2xl backdrop-blur-2xl mb-6 font-mono text-xl sm:text-2xl font-black tracking-widest transition-all duration-300 flex items-center justify-center gap-2 text-center leading-none tabular-nums whitespace-nowrap ${isUrgent ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-white/[0.03] border-white/10 text-white shadow-[0_0_20px_rgba(0,0,0,0.3)]'}`}>
                        ⏳ ${h}:${m}:${s}
                    </div>
                `;
            })() : ''}

            <div className="flex justify-between items-center mb-10 bg-white/[0.03] backdrop-blur-2xl p-4 rounded-2xl shadow-lg border border-white/10">
                <${Luminova.Components.Button} variant="danger" onClick=${() => setModalType('exit')} className="rounded-full shadow-lg hover:-translate-x-1">
                    <${Luminova.Icons.XCircle} /> <span className="hidden sm:inline">${lang === 'ar' ? 'خروج' : 'Quit'}</span>
                </${Luminova.Components.Button}>
                <div className="flex-1 mx-4 sm:mx-8 relative">
                    <div className="bg-white/10 h-3 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-gradient-to-r from-rose-400 to-indigo-500 h-full transition-all duration-500 ease-out" style=${{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                    </div>
                </div>
                <span className="font-black text-xl sm:text-2xl text-rose-400 drop-shadow-sm shrink-0">${currentIndex + 1} <span className="opacity-40 text-lg">/ ${questions.length}</span></span>
                <!-- Drawer trigger button -->
                <button onClick=${() => setShowDrawer(true)} className="ms-3 w-10 h-10 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shrink-0 group" title=${lang === 'ar' ? 'خريطة الأسئلة' : 'Questions Map'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400 group-hover:text-rose-300 transition-colors"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
            </div>

            <${Luminova.Components.GlassCard} className="relative overflow-visible mb-10 flex-1 flex flex-col shadow-2xl">
                ${currentQStudent.id && html`
                    <div className="absolute -top-12 sm:-top-6 start-1/2 -translate-x-1/2 sm:translate-x-0 sm:start-8 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 bg-white/[0.03] backdrop-blur-2xl shadow-xl p-2 sm:p-2 sm:pl-4 rounded-xl sm:rounded-full border border-white/10 z-10 animate-fade-in group hover:scale-105 transition-transform max-w-[90vw] sm:max-w-none text-center sm:text-start mx-auto w-max mb-8 sm:mb-0">
                        <${Luminova.Components.Avatar} name=${currentQStudent.nameAr || currentQStudent.name} image=${currentQStudent.image} isVerified=${currentQStudent.isVerified} size="w-8 h-8 shrink-0" />
                        <span className="text-xs sm:text-sm font-black mx-1 text-rose-400 group-hover:text-fuchsia-400 break-words whitespace-normal transition-colors">${lang === 'ar' ? currentQStudent.nameAr || currentQStudent.name : currentQStudent.nameEn || currentQStudent.name}</span>
                        <span className="text-xs font-bold text-white/40 hidden sm:inline border-r pr-2 border-white/10 shrink-0">:المساهم بالسؤال</span>
                    </div>
                `}

                <div className="flex-1 mt-6">
                    <div className="flex justify-between items-start mb-8 ${q.mediaUrl ? '' : 'border-b border-white/10 pb-6'}">
                        <h3 className="text-3xl font-bold leading-relaxed w-[85%] text-white">${q.text || q.textAr}</h3>
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
                            if (isFeedbackRevealed || (quiz.feedbackMode === 'immediate' && revealedQuestions.has(q.id))) return;
                            setAnswers(prev => ({ ...prev, [q.id]: i }));
                        };
                        return html`
                                <button key=${`opt-${q.id}-${i}`} onClick=${handleMCQClick}
                                    disabled=${isFeedbackRevealed || (quiz.feedbackMode === 'immediate' && revealedQuestions.has(q.id))}
                                    className=${`w-full text-start p-5 rounded-2xl border-2 transition-all duration-300 text-lg font-bold shadow-sm ${answers[q.id] === i ? 'border-rose-500 bg-rose-500/10 scale-[1.02] shadow-rose-500/10' : 'border-white/5 bg-white/2 hover:border-rose-400/30 hover:bg-white/4 hover:scale-[1.01] text-white/80 hover:text-white'} ${(isFeedbackRevealed || revealedQuestions.has(q.id)) ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                    <span className="inline-block w-8 h-8 rounded-full bg-white/5 text-center leading-8 mr-4 ml-4 text-sm">${String.fromCharCode(65 + i)}</span>
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
                    if (isFeedbackRevealed || (quiz.feedbackMode === 'immediate' && revealedQuestions.has(q.id))) return;
                    const next = isSelected ? selected.filter(x => x !== i) : [...selected, i];
                    setAnswers(prev => ({ ...prev, [q.id]: next }));
                };
                return html`
                                    <button key=${`opt-${q.id}-${i}`} disabled=${isFeedbackRevealed || (quiz.feedbackMode === 'immediate' && revealedQuestions.has(q.id))} onClick=${handleMultiClick}
                                    className=${`w-full text-start p-5 rounded-2xl border-2 transition-all duration-300 text-lg font-bold shadow-sm flex items-center gap-4 ${isSelected ? 'border-rose-500 bg-rose-500/10 scale-[1.02] shadow-rose-500/10' : 'border-white/5 bg-white/2 hover:border-rose-400/30 hover:bg-white/4 hover:scale-[1.01] text-white/80 hover:text-white'} ${(isFeedbackRevealed || revealedQuestions.has(q.id)) ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                        <div className=${`w-8 h-8 rounded-xl flex items-center justify-center border-2 text-xl transition-all ${isSelected ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' : 'border-white/20'}`}>
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
                                disabled=${isFeedbackRevealed || (quiz.feedbackMode === 'immediate' && revealedQuestions.has(q.id))}
                                className=${`w-full p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 min-h-[250px] text-lg text-white placeholder-white/30 transition-all shadow-inner resize-y ${(isFeedbackRevealed || revealedQuestions.has(q.id)) ? 'opacity-70 font-bold' : ''}`}
                                placeholder=${lang === 'ar' ? 'اكتب إجابتك بتفصيل هنا...' : 'Type your detailed answer here...'}
                                value=${answers[q.id] || ''}
                                onChange=${(e) => {
                            if (isFeedbackRevealed || (quiz.feedbackMode === 'immediate' && revealedQuestions.has(q.id))) return;
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
                                <p className="flex items-start gap-2 mb-4" dangerouslySetInnerHTML=${{ __html: `<span class='font-bold opacity-70 min-w-[120px]'>النموذجية:</span> <strong class="text-green-600 dark:text-green-400 font-bold text-xl">${(q.type === 'mcq' ? (q.options || q.optionsAr)?.[q.correctAnswers?.[0]] : (q.correctAnswers || []).map(c => (q.options || q.optionsAr)?.[c]).join(' <span class="text-gray-400">|</span> '))}</strong>` }} />
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

            <div className="flex justify-between items-center bg-white/[0.03] backdrop-blur-2xl p-4 rounded-2xl shadow-lg border border-white/10">
                <${Luminova.Components.Button} variant="glass" disabled=${currentIndex === 0 || quiz.allowBackNavigation === false} onClick=${() => { setCurrentIndex(i => i - 1); if (quiz.feedbackMode === 'immediate' && questions[currentIndex - 1] && revealedQuestions.has(questions[currentIndex - 1].id)) { setIsFeedbackRevealed(true); } else { setIsFeedbackRevealed(false); } }} className="px-8 py-3 text-lg rounded-full">
                    ${lang === 'ar' ? 'السابق' : 'Previous'}
                </${Luminova.Components.Button}>
                
                ${quiz.feedbackMode === 'immediate' && !isFeedbackRevealed ? html`
                    <${Luminova.Components.Button} disabled=${answers[q.id] === undefined || (Array.isArray(answers[q.id]) && !answers[q.id].length)} onClick=${() => { setIsFeedbackRevealed(true); setRevealedQuestions(prev => new Set([...prev, q.id])); }} 
                        className="px-10 py-3 text-lg bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg shadow-blue-500/30 font-black animate-pulse transition-transform hover:scale-105">
                        ✅ تحقق من الإجابة
                    </${Luminova.Components.Button}>
                ` : currentIndex === questions.length - 1 ? html`
                    <${Luminova.Components.Button} disabled=${isSubmitting} onClick=${handleFinish} className="px-10 py-3 text-lg bg-green-500 hover:bg-green-600 rounded-full shadow-lg shadow-green-500/30 font-black animate-pulse disabled:opacity-60 disabled:cursor-not-allowed">
                        <${Luminova.Icons.CheckCircle} /> ${isSubmitting ? (lang === 'ar' ? 'جاري التسليم...' : 'Submitting...') : (lang === 'ar' ? 'إنهاء الاختبار' : 'Finish Exam')}
                    </${Luminova.Components.Button}>
                ` : html`
                    <${Luminova.Components.Button} onClick=${() => { setCurrentIndex(i => i + 1); if (quiz.feedbackMode === 'immediate' && questions[currentIndex + 1] && revealedQuestions.has(questions[currentIndex + 1].id)) { setIsFeedbackRevealed(true); } else { setIsFeedbackRevealed(false); } }} className="px-10 py-3 text-lg rounded-full shadow-lg shadow-brand-DEFAULT/30 group">
                        ${lang === 'ar' ? 'التالي' : 'Next'} <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
                    </${Luminova.Components.Button}>
                `}
            </div>
        </div>
    `;
    };

    // ==========================================

})();
