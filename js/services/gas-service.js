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
        if (window.location.protocol === 'file:') {
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
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Workspace Security Block Detected. Response is not JSON.");
            throw new Error("فشل الاتصال بقاعدة البيانات. (يرجى نشر السكربت عبر حساب Gmail شخصي وليس مؤسسي).");
        }

        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            throw new Error("حدث خطأ أثناء معالجة بيانات الخادم.");
        }

        // Catch backend-thrown errors gracefully (Tagged to isolate source)
        if (data && data.status === "error") {
            throw new Error("[Backend Error] " + (data.message || "حدث خطأ غير معروف في الخادم."));
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

    // ─── Public API ───────────────────────────────────────────

    Luminova.Services.GAS = {

        /**
         * PRE-EXAM GATEKEEPER — Verify if a student has already submitted.
         */
        verifyStudent: async function (webhookUrl, email) {
            const payload = { action: 'check_duplicate', email: email };
            return await _gasFetch(webhookUrl, payload);
        },

        /**
         * EXAM SUBMISSION — Send the student's completed exam to the backend.
         */
        submitExam: async function (webhookUrl, atomicPayload) {
            const payload = { action: 'submit_exam', ...atomicPayload };
            return await _gasFetch(webhookUrl, payload);
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
                console.warn('IP tracking failed silently');
            }
            return 'unknown';
        },

        /**
         * MULTI-TIERED TIME SYNC — Resilient True Cairo Time offset.
         */
        getTrueTimeOffsetMs: async function() {
            const attempts = [
                () => _fetchDateHeaderOffset('https://www.google.com/generate_204'),
                () => _fetchDateHeaderOffset('https://www.cloudflare.com/cdn-cgi/trace'),
                () => _fetchJsonTimeOffset('https://worldtimeapi.org/api/timezone/Africa/Cairo', data => Date.parse(data.utc_datetime || data.datetime)),
                () => _fetchJsonTimeOffset('https://timeapi.io/api/Time/current/zone?timeZone=Africa/Cairo', data => {
                    if (data.dateTime) return _cairoWallClockToUtcMs(data.dateTime);
                    if (data.year && data.month && data.day) {
                        const stamp = `${data.year}-${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')}T${String(data.hour || 0).padStart(2, '0')}:${String(data.minute || 0).padStart(2, '0')}:${String(data.seconds || data.second || 0).padStart(2, '0')}`;
                        return _cairoWallClockToUtcMs(stamp);
                    }
                    return NaN;
                })
            ];

            const errors = [];
            for (const attempt of attempts) {
                try {
                    const offset = await attempt();
                    if (Number.isFinite(offset)) return offset;
                } catch (error) {
                    errors.push(error?.message || String(error));
                }
            }

            console.error("[Luminova] Trusted time sync failed:", errors);
            throw _networkError("Trusted server time could not be synchronized. The exam is blocked until the connection stabilizes.");
        }
    };
})();
