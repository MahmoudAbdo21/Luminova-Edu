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
            const timeoutId = setTimeout(() => controller.abort(), 30000); 
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
            // Strategy #2: Volatile Exception Normalization
            // Treat fetchError as a hostile, potentially undefined object.
            const errName = fetchError?.name ?? 'Network_Drop';
            const errMsg = fetchError?.message ?? 'فشل الاتصال بالخادم';

            if (errName === 'AbortError') {
                throw new Error('انتهى وقت الطلب (Timeout). يرجى التحقق من جودة الإنترنت والمحاولة مرة أخرى.');
            }
            
            throw new Error(
                'خطأ في الاتصال: لم نتمكن من الوصول لقاعدة البيانات. ' +
                'يرجى التأكد من اتصالك بالإنترنت والمحاولة مجدداً. ' +
                '(تفاصيل: ' + errMsg + ')'
            );
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
            // Attempt 1: timeapi.io
            try {
                const res1 = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Africa/Cairo');
                if (res1.ok) {
                    const data1 = await res1.json();
                    return new Date(data1.dateTime).getTime() - Date.now();
                }
            } catch (e) {}

            // Attempt 2: timeapi.world
            try {
                const res2 = await fetch('https://timeapi.world/api/timezone/Africa/Cairo');
                if (res2.ok) {
                    const data2 = await res2.json();
                    return new Date(data2.datetime || data2.dateTime).getTime() - Date.now();
                }
            } catch (e) {}
            
            // Ultimate Fallback
            console.warn("[Luminova] Network Time APIs failed, falling back to local device time.");
            return 0; 
        }
    };
})();
