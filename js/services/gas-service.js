/**
 * ============================================================
 * Luminova GAS Service Layer (gas-service.js)
 * ============================================================
 * Enterprise-grade API service for all Google Apps Script
 * communication. Decouples network logic from UI components.
 * 
 * CORE FEATURES:
 * - text/plain CORS Bypass & strict mode:'cors' fetching
 * - Response Normalizer to shield UI from backend inconsistencies
 * - Multi-tiered Time API Fallback
 * - Silent IP Tracking for submissions
 * ============================================================
 */
(function () {
    "use strict";

    if (!window.__LUMINOVA) return;
    const Luminova = window.__LUMINOVA;

    // Initialize Services namespace
    if (!Luminova.Services) Luminova.Services = {};

    const LUMINOVA_DEBUG = false;
    const debugLog = (...args) => { if (LUMINOVA_DEBUG) window.console.log(...args); };
    const debugWarn = (...args) => { if (LUMINOVA_DEBUG) window.console.warn(...args); };


    function _networkError(message, cause) {
        const err = new Error(message);
        err.isNetworkError = true;
        err.luminovaNetworkError = true;
        if (cause) err.cause = cause;
        return err;
    }

    function _getTimeZoneOffsetMs(timeZone, utcMs) {
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
    }

    function _cairoWallClockToUtcMs(value) {
        const text = String(value || '').trim();
        const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/);
        if (!match) return NaN;
        const wallAsUtc = Date.UTC(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3]),
            Number(match[4] || 0),
            Number(match[5] || 0),
            Number(match[6] || 0)
        );
        const firstOffset = _getTimeZoneOffsetMs('Africa/Cairo', wallAsUtc);
        const correctedUtc = wallAsUtc - firstOffset;
        const secondOffset = _getTimeZoneOffsetMs('Africa/Cairo', correctedUtc);
        return wallAsUtc - secondOffset;
    }

    async function _fetchDateHeaderOffset(url) {
        const before = Date.now();
        const res = await fetch(url, { method: 'HEAD', mode: 'cors', cache: 'no-store', credentials: 'omit' });
        const after = Date.now();
        if (!res.ok) throw new Error('Time HEAD failed: ' + res.status);
        const dateHeader = res.headers.get('date');
        if (!dateHeader) throw new Error('Missing Date header');
        const serverMs = Date.parse(dateHeader);
        if (!Number.isFinite(serverMs)) throw new Error('Invalid Date header');
        return serverMs - Math.round((before + after) / 2);
    }

    async function _fetchJsonTimeOffset(url, resolver) {
        const before = Date.now();
        const res = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store', credentials: 'omit' });
        const after = Date.now();
        if (!res.ok) throw new Error('Time API failed: ' + res.status);
        const data = await res.json();
        const serverMs = resolver(data);
        if (!Number.isFinite(serverMs)) throw new Error('Invalid Time API response');
        return serverMs - Math.round((before + after) / 2);
    }

    // ─── Internal fetch wrapper ───────────────────────────────
    // Single point of truth for ALL outbound requests to GAS.
    async function _gasFetch(url, payload) {
        window.__LUMINOVA_GAS_DEBUG__ = window.__LUMINOVA_GAS_DEBUG__ || {
            count: 0,
            actions: [],
            lastPayload: null
        };
        window.__LUMINOVA_GAS_DEBUG__.count += 1;
        window.__LUMINOVA_GAS_DEBUG__.actions.push(payload.action);
        window.__LUMINOVA_GAS_DEBUG__.lastPayload = {
            action: payload.action,
            quizId: payload.quizId,
            schemaHash: payload.schemaHash,
            spreadsheetId: payload.spreadsheetId,
            sheetName: payload.sheetName,
            submissionId: payload.submissionId,
            answersCount: Array.isArray(payload.answers) ? payload.answers.length : undefined
        };

        debugLog("[GAS Request]", payload.action, payload);
        debugLog("[Luminova GAS Fetch Start]", {
            action: payload?.action,
            url: url,
            protocol: window.location.protocol
        });
        if (window.location.protocol === 'file:') {
            debugWarn("[Luminova GAS Fetch Protocol Check] BLOCKED — file:// protocol detected");
            throw new Error("لا يمكن إجراء الاتصال. التطبيق يعمل محلياً بدون خادم (file://).");
        }

        if (!url || !url.includes('/macros/s/') || !url.endsWith('/exec')) {
            throw new Error("رابط Webhook غير صالح (يجب أن ينتهي بـ /exec).");
        }

        let response;
        try {
            const controller = new AbortController();
            // 60s hard abort — UX-facing timeout is 10s (Promise.race in quiz-engine)
            const timeoutId = setTimeout(() => controller.abort(), 60000); 
            response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
        } catch (fetchError) {
            const errName = fetchError?.name ?? 'Network_Drop';
            const networkMessage = fetchError?.message ?? 'Network request failed';
            if (errName === 'AbortError') {
                throw _networkError('Request timed out. Please check the internet connection and try again.', fetchError);
            }
            throw _networkError('Connection error: the exam could not reach the database. Details: ' + networkMessage, fetchError);
        }

        if (!response.ok) {
            throw new Error(`خطأ في الخادم! الرمز: ${response.status}`);
        }

        // The Smart Response Normalizer: Intercept HTML Workspace Security Block
        const contentType = response.headers.get("content-type");
        debugLog("[Luminova GAS Fetch Response]", {
            action: payload?.action,
            status: response.status,
            ok: response.ok,
            contentType: contentType
        });

        let text;
        try {
            text = await response.text();
        } catch (readErr) {
            throw new Error("حدث خطأ أثناء قراءة استجابة الخادم.");
        }

        debugLog("[Luminova GAS Fetch Raw Preview]", {
            action: payload?.action,
            textPreview: (text || '').slice(0, 300)
        });

        // Detect HTML login/redirect pages (Workspace Security Block)
        const trimmed = (text || '').trim().toLowerCase();
        if (trimmed.startsWith("<!doctype") || trimmed.startsWith("<html")) {
            console.error("[Luminova] Workspace Security Block Detected. Response is HTML, not JSON.", (text || '').slice(0, 300));
            throw new Error("فشل الاتصال بقاعدة البيانات. (يرجى نشر السكربت عبر حساب Gmail شخصي وليس مؤسسي).");
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error("[Luminova GAS Parse Error]", { contentType, textPreview: (text || '').slice(0, 300) });
            throw new Error("حدث خطأ أثناء معالجة بيانات الخادم.");
        }

        debugLog("[Luminova GAS Fetch Parsed]", {
            action: payload?.action,
            parsedStatus: data?.status,
            keys: Object.keys(data || {})
        });

        // Catch backend-thrown errors gracefully (Tagged to isolate source)
        if (data && (data.status === "error" || data.status === "schema_mismatch" || data.status === "submission_conflict" || data.status === "verification_hash_mismatch")) {
            let code = data.code || data.status || null;
            let message = data.message || "";

            // Map text messages to standard codes if code is not present
            if (!code && message) {
                if (message.indexOf("Submission ID already exists with different hash") !== -1) {
                    code = "submission_conflict";
                } else if (message.indexOf("Verification hash mismatch") !== -1) {
                    code = "verification_hash_mismatch";
                } else if (message.indexOf("Prepared schema was not found") !== -1) {
                    code = "schema_mismatch";
                }
            }

            // Generate fallback friendly message based on code to avoid unknown server error
            if (!message) {
                if (code === "submission_conflict") {
                    message = "Submission ID already exists with different hash.";
                } else if (code === "verification_hash_mismatch") {
                    message = "Verification hash mismatch.";
                } else if (code === "schema_mismatch") {
                    message = "Prepared schema was not found.";
                }
            }

            const friendlyMessage = message || "حدث خطأ غير معروف في الخادم.";
            const err = new Error("[Backend Error] " + friendlyMessage);
            err.code = code;
            err.backendResponse = data;
            err.serverResponse = data;
            throw err;
        }

        // Normalizing legacy vs modern Duplicate Check responses
        if (payload.action === 'check_duplicate') {
            if (data.status === 'exists' || data.isDuplicate === true) {
                return { status: 'exists' };
            }
            return { status: 'clear' };
        }

        return data; // Return clean data for submit_exam
    }

    function normalizeGasResponse(result) {
        const response = result || {};

        return {
            raw: response,
            ok: response.status === "ok",
            status: response.status,
            code: response.code || "",
            verified: response.verified === true,
            accepted: response.accepted === true,
            alreadySubmitted: response.alreadySubmitted === true,
            needsRepair: response.needsRepair === true,
            repaired: response.repaired === true,
            rowNumber: response.rowNumber,
            sheetName: response.sheetName,
            score: response.score,
            maxScore: response.maxScore,
            percentage: response.percentage,
            resultStatus: response.resultStatus,
            terminationReason: response.terminationReason,
            expectedAnswerCount: response.expectedAnswerCount,
            recordedAnswerCount: response.recordedAnswerCount,
            student: response.student || null
        };
    }

    // ─── Public API ───────────────────────────────────────────

    Luminova.Services.GAS = {

        /**
         * PRE-EXAM GATEKEEPER — Verify if a student has already submitted.
         */
        verifyStudent: async function (webhookUrl, params) {
            const payload = { 
                action: 'check_duplicate', 
                quizId: params.quizId, 
                schemaHash: params.schemaHash || '',
                email: params.studentEmail || '',
                studentEmail: params.studentEmail || '',
                studentName: params.studentName || '',
                seatNumber: params.seatNumber || '',
                student: {
                    email: params.studentEmail || '',
                    name: params.studentName || '',
                    seatNumber: params.seatNumber || '',
                    department: params.department || ''
                },
                duplicatePolicy: params.duplicatePolicy || 'prevent_success_by_email_when_no_retakes',
                allowRetakes: params.allowRetakes !== undefined ? params.allowRetakes : false,
                maxAttempts: params.maxAttempts !== undefined ? params.maxAttempts : 1,
                spreadsheetId: params.spreadsheetId || ''
            };
            return await _gasFetch(webhookUrl, payload);
        },

        /**
         * EXAM SUBMISSION — Send the student's completed exam to the backend.
         */
        submitExam: async function (webhookUrl, atomicPayload) {
            const payload = { action: 'submit_exam', ...atomicPayload };
            const res = await _gasFetch(webhookUrl, payload);
            return normalizeGasResponse(res);
        },

        /**
         * SUBMISSION VERIFICATION — Confirm the ledger has the exact payload receipt.
         */
        verifySubmission: async function (webhookUrl, verificationPayload) {
            const payload = { action: 'verify_submission', ...verificationPayload };
            const res = await _gasFetch(webhookUrl, payload);
            return normalizeGasResponse(res);
        },

        /**
         * RETRY VERIFICATION — Lightweight check after a network failure.
         */
        retryVerifySubmission: async function (webhookUrl, params) {
            const payload = { action: 'retry_verify_submission', ...params };
            const res = await _gasFetch(webhookUrl, payload);
            return normalizeGasResponse(res);
        },

        /**
         * REPAIR SUBMISSION — Repair missing answer cells safely using a lock.
         */
        repairSubmissionAnswers: async function (webhookUrl, atomicPayload) {
            const payload = { action: 'repair_submission_answers', ...atomicPayload };
            const res = await _gasFetch(webhookUrl, payload);
            return normalizeGasResponse(res);
        },

        /**
         * SILENT IP TRACKER — Fetches user IP autonomously.
         */
        getIPAddress: async function() {
            try {
                const res = await fetch('https://api.ipify.org?format=json');
                if (res.ok) {
                    const data = await res.json();
                    return data.ip;
                }
            } catch (e) {
                debugWarn('IP tracking failed silently');
            }
            return 'unknown';
        },

        /**
         * MULTI-TIERED TIME SYNC — Resilient True Cairo Time offset.
         */
        getTrueTimeOffsetMs: async function(webhookUrl, quizId) {
            debugLog("[Luminova getTrueTimeOffsetMs Enter]", JSON.stringify({
                webhookUrl: webhookUrl || "MISSING",
                quizId: quizId || "MISSING",
                hasWebhook: !!webhookUrl,
                webhookType: typeof webhookUrl
            }, null, 2));
            let primaryErrorDetail = null;
            const attempts = [
                // Primary: GAS Backend (V5.2) Time Sync
                async () => {
                    if (!webhookUrl) {
                        debugWarn("[Luminova Time Sync] webhookUrl is falsy — skipping GAS fetch", { webhookUrl, type: typeof webhookUrl });
                        const err = new Error("time_sync_failed_missing_webhook");
                        err.diagnosticReason = "time_sync_failed_missing_webhook";
                        throw err;
                    }
                    const before = Date.now();
                    let data;
                    try {
                        data = await _gasFetch(webhookUrl, { action: 'get_time' });
                    } catch (fetchErr) {
                        let reason = "time_sync_failed_network";
                        const msg = fetchErr.message || "";
                        if (msg.includes("Gmail") || msg.includes("Content-Type") || msg.includes("JSON")) {
                            reason = "time_sync_failed_html_response";
                        } else if (msg.includes("معالجة بيانات") || msg.includes("parse")) {
                            reason = "time_sync_failed_invalid_json";
                        } else if (msg.includes("Action not recognized") || msg.includes("not recognized")) {
                            reason = "time_sync_failed_old_deployment";
                        }
                        fetchErr.diagnosticReason = reason;
                        throw fetchErr;
                    }
                    const after = Date.now();
                    
                    if (data && data.cairoTime) {
                        debugLog("[Luminova Time Sync] Cairo server time is:", data.cairoTime);
                    }
                    
                    let serverMs = data.timestamp || data.serverTime || data.time || data.now || data.iso;
                    if (typeof serverMs === 'string') {
                        const parsed = Date.parse(serverMs);
                        if (!Number.isNaN(parsed)) serverMs = parsed;
                    }
                    
                    if (!Number.isFinite(serverMs)) {
                        const err = new Error("Invalid GAS backend time response");
                        err.diagnosticReason = "time_sync_failed_missing_timestamp";
                        throw err;
                    }
                    
                    return serverMs - Math.round((before + after) / 2);
                },
                // Secondary: CORS-compliant enterprise API
                () => _fetchJsonTimeOffset('https://timeapi.io/api/Time/current/zone?timeZone=Africa/Cairo', data => {
                    if (data.dateTime) return _cairoWallClockToUtcMs(data.dateTime);
                    if (data.year && data.month && data.day) {
                        const stamp = `${data.year}-${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')}T${String(data.hour || 0).padStart(2, '0')}:${String(data.minute || 0).padStart(2, '0')}:${String(data.seconds || data.second || 0).padStart(2, '0')}`;
                        return _cairoWallClockToUtcMs(stamp);
                    }
                    return NaN;
                }),
                // Tertiary: NTP-over-HTTP fallback (Microsoft / Cloudflare / Google)
                () => _fetchDateHeaderOffset('https://www.microsoft.com'),
                () => _fetchDateHeaderOffset('https://www.cloudflare.com/cdn-cgi/trace'),
                () => _fetchDateHeaderOffset('https://www.google.com/generate_204')
            ];

            const errors = [];
            for (let i = 0; i < attempts.length; i++) {
                try {
                    const offset = await attempts[i]();
                    if (Number.isFinite(offset)) return offset;
                } catch (error) {
                    errors.push(error?.message || String(error));
                    if (i === 0) {
                        primaryErrorDetail = {
                            reason: error.diagnosticReason || "time_sync_failed_network",
                            message: error.message || String(error),
                            status: error.code || null
                        };
                    }
                }
            }

            if (primaryErrorDetail) {
                debugWarn("[Luminova Time Sync Failed]", {
                    quizId: quizId || "unknown",
                    webhookUrl: webhookUrl || "none",
                    reason: primaryErrorDetail.reason,
                    responseStatus: primaryErrorDetail.status || "error",
                    responseTextPreview: primaryErrorDetail.message.substring(0, 200),
                    parsedData: null
                });
            }

            console.error("[Luminova] Trusted time sync failed:", errors);
            throw _networkError("تعذر التحقق من وقت الخادم. برجاء المحاولة مرة أخرى.");
        }
    };
})();
