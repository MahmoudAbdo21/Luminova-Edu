# Luminova Edu Production Bugfix Report - 2026-05-14

## Frontend changes applied

- `js/pages/quiz-engine.js`
  - Added a hard submit lock using React state, a ref, and `window.__LUMINOVA_EXAM_IS_SUBMITTING`.
  - Auto-submit now fires immediately when the exam reaches `00:00` unless delay is explicitly allowed.
  - `allowDelay: false` blocks overtime even if older config keys exist.
  - Overtime counting only appears when `allowDelay` is explicitly `true`; legacy `allowLateSubmission` is only used when `allowDelay` is not present.
  - Submission buttons disable immediately and show `جاري التسليم...`.
  - The lock resets only for network-style failures, so repeated clicks cannot create duplicate rows.
  - Response payloads now use the master `quiz.questions` order and include `questionId` plus `originalIndex`.
  - Added `submissionId` / `idempotencyKey` to each payload for backend duplicate protection.
  - Countdown display was rebuilt with responsive width, tabular numbers, separated label/time layout, and mobile-safe wrapping.

- `js/services/gas-service.js`
  - Removed the unsafe local-time fallback.
  - Time sync now tries trusted Date-header endpoints first, then standard timezone APIs for `Africa/Cairo`.
  - Egypt DST is handled by converting Cairo wall-clock time to UTC before calculating the device offset.
  - If trusted time cannot be reached, the exam gate stays blocked until retry.

## Verification

```powershell
node --check js\pages\quiz-engine.js
node --check js\services\gas-service.js
```

Both syntax checks passed.

## Copyable Google Apps Script V5

Copy this whole block into the Apps Script web app deployment. It keeps the Matrix layout stable, adds idempotency, exposes an admin page at the web app URL, includes a Gmail sent-mail link, and provides a button to send all reports to students.

```javascript
/**
 * Luminova Edu - Matrix Engine V5.1
 * Matrix rows + RTL reports + idempotent submissions + admin bulk sender.
 */

function doGet() {
  var webAppUrl = ScriptApp.getService().getUrl();
  var html = ''
    + '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>Luminova Edu Admin</title>'
    + '<style>'
    + 'body{margin:0;background:#eef2ff;font-family:Arial,Tahoma,sans-serif;color:#0f172a;}'
    + '.wrap{max-width:760px;margin:0 auto;padding:28px 14px;}'
    + '.panel{background:#fff;border:1px solid #dbeafe;border-radius:22px;box-shadow:0 24px 70px rgba(15,23,42,.14);overflow:hidden;}'
    + '.head{background:linear-gradient(135deg,#0891b2,#4f46e5);color:#fff;padding:28px;text-align:center;}'
    + '.body{padding:26px;line-height:1.8;}'
    + 'button,a.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:14px;padding:13px 18px;font-weight:900;text-decoration:none;cursor:pointer;}'
    + 'button{background:#10b981;color:#fff;}button:disabled{opacity:.6;cursor:not-allowed;}'
    + '.gmail{background:#ef4444;color:#fff;}.muted{color:#64748b;font-size:13px}.result{margin-top:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:14px;white-space:pre-wrap;direction:ltr;text-align:left;}'
    + '</style></head><body><div class="wrap"><div class="panel">'
    + '<div class="head"><div style="font-weight:900;font-size:13px;opacity:.9">Luminova Edu</div><h1 style="margin:8px 0 0;font-size:26px">لوحة إرسال التقارير</h1></div>'
    + '<div class="body"><p>استخدم الزر التالي لإرسال جميع تقارير الطلاب من ورقة النتائج الحالية.</p>'
    + '<div style="display:flex;gap:10px;flex-wrap:wrap">'
    + '<button id="sendBtn" onclick="sendReports()">إرسال كل التقارير للطلاب</button>'
    + '<a class="btn gmail" target="_blank" rel="noopener" href="https://mail.google.com/mail/u/0/#sent">فتح Gmail - الرسائل المرسلة</a>'
    + '</div><p class="muted">Web App URL: ' + escapeHtml(webAppUrl) + '</p><div id="result" class="result" style="display:none"></div>'
    + '</div></div></div><script>'
    + 'function sendReports(){var b=document.getElementById("sendBtn"),r=document.getElementById("result");b.disabled=true;b.textContent="جاري الإرسال...";r.style.display="block";r.textContent="Working...";'
    + 'fetch(location.href,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"bulk_send_reports"})})'
    + '.then(function(x){return x.json()}).then(function(data){r.textContent=JSON.stringify(data,null,2);b.textContent="تم التنفيذ";})'
    + '.catch(function(e){r.textContent=e && e.message ? e.message : String(e);b.disabled=false;b.textContent="إعادة المحاولة";});}'
    + '</script></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('Luminova Edu Admin');
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    var data = JSON.parse((e.postData && e.postData.contents) || "{}");
    var action = data.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getTargetSheet(ss, data);

    if (action === "check_duplicate") return handleCheckDuplicate(sheet, data);
    if (action === "submit_exam") return handleSubmitExam(sheet, data);
    if (action === "bulk_send_reports") return handleBulkReports(ss, data);

    throw new Error("Action not recognized: " + action);
  } catch (err) {
    return jsonResponse({ status: "error", message: err && err.toString ? err.toString() : String(err) });
  } finally {
    try { lock.releaseLock(); } catch (releaseErr) {}
  }
}

function handleSubmitExam(sheet, data) {
  var now = new Date();
  var student = data.student || {};
  var settings = data.settings || {};
  var scoreData = data.scoreData || {};
  var timestamps = data.timestamps || {};
  var examDetails = data.examDetails || {};
  var responses = sortResponses(Array.isArray(data.responses) ? data.responses : []);

  ensureMatrix(sheet, responses);

  var name = data.name || student.name || "غير معروف";
  var email = data.email || student.email || "";
  var seat = data.seatNumber || student.seatNumber || "---";
  var dept = data.department || student.department || "---";
  var score = data.score !== undefined ? data.score : (scoreData.score || 0);
  var maxScore = data.maxScore !== undefined ? data.maxScore : (scoreData.maxScore || 0);
  var title = examDetails.title || data.title || "اختبار Luminova";
  var reason = examDetails.terminationReason || "completed";
  var submissionId = normalizeSubmissionId(data.submissionId || data.idempotencyKey || buildSubmissionId(title, email, seat));

  if (isDuplicateSubmission(sheet, submissionId, email, title)) {
    return jsonResponse({ status: "ok", duplicate: true, message: "تم تجاهل تسليم مكرر بنفس Submission ID" });
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var qStart = getQuestionStartIndex(headers);
  var row = buildBaseRow(headers, qStart, {
    timestamp: now,
    submissionId: submissionId,
    name: name,
    seat: seat,
    email: email,
    department: dept,
    score: score,
    maxScore: maxScore,
    entryTime: timestamps.entryTime || "---",
    exitTime: timestamps.exitTime || "---",
    ipAddress: timestamps.ipAddress || "---",
    reason: reason,
    title: title
  });

  responses.forEach(function(r) {
    row.push(safeText(r.studentAnswer, "---"));
    row.push(statusIcon(r.isCorrect));
  });

  sheet.appendRow(row);

  var studentSent = false;
  if (settings.studentReport === true && isValidEmail(email)) {
    sendStudentReportV5(email, name, title, score, maxScore, responses);
    studentSent = true;
  }

  var adminEmails = normalizeEmailList(settings.adminEmails || data.adminEmails);
  if (adminEmails.length) {
    sendAdminSummaryV5(adminEmails, { name: name, email: email, seat: seat, department: dept, title: title, score: score, maxScore: maxScore, reason: reason, timestamp: now });
  }

  return jsonResponse({ status: "ok", message: "تم التسليم وتحديث مصفوفة V5.1", submissionId: submissionId, studentEmailSent: studentSent, adminEmailsSent: adminEmails.length });
}

function ensureMatrix(sheet, responses) {
  if (sheet.getLastRow() > 0) return;

  var headers = ["Timestamp", "Submission ID", "Name", "Seat Number", "Email", "Department", "Score", "Max Score", "Entry Time", "Exit Time", "IP Address", "Termination Reason", "Exam Title"];
  var explanations = ["", "", "", "", "", "", "", "", "", "", "", "التعليل (Explanation)", ""];
  var modelAnswers = ["", "", "", "", "", "", "", "", "", "", "", "الإجابة النموذجية (Model Answer)", ""];

  responses.forEach(function(r, i) {
    headers.push("Q" + (i + 1) + ": " + safeText(r.question, "Question"));
    headers.push("Status " + (i + 1));
    explanations.push(safeText(r.explanation, "---"));
    explanations.push("");
    modelAnswers.push(safeText(r.correctAnswer, "---"));
    modelAnswers.push("");
  });

  sheet.appendRow(headers);
  sheet.appendRow(explanations);
  sheet.appendRow(modelAnswers);
  sheet.getRange(1, 1, 1, headers.length).setBackground("#0f172a").setFontColor("#ffffff").setFontWeight("bold");
  sheet.getRange(2, 1, 1, explanations.length).setBackground("#f1f5f9").setFontStyle("italic").setFontColor("#475569");
  sheet.getRange(3, 1, 1, modelAnswers.length).setBackground("#f8fafc").setFontStyle("italic").setFontColor("#1e40af");
  sheet.setFrozenRows(3);
}

function handleBulkReports(ss, data) {
  var sheet = getTargetSheet(ss, data);
  var values = sheet.getDataRange().getValues();
  if (values.length < 4) return jsonResponse({ status: "ok", message: "لا توجد صفوف طلاب لإرسال التقارير", sent: 0, skipped: 0, errors: [] });

  var settings = data.settings || {};
  var adminEmails = normalizeEmailList(settings.adminEmails || data.adminEmails);
  var title = (data.examDetails && data.examDetails.title) || data.title || settings.examTitle || sheet.getName() || "اختبار Luminova";
  var requestedRows = Array.isArray(data.rowNumbers) ? data.rowNumbers.map(Number) : null;
  var requestedEmails = normalizeEmailList(data.emails).map(function(email) { return email.toLowerCase(); });
  var headers = values[0];
  var explanations = values[1];
  var modelAnswers = values[2];
  var sent = 0;
  var skipped = 0;
  var errors = [];

  for (var r = 3; r < values.length; r++) {
    var sheetRowNumber = r + 1;
    var row = values[r];
    var emailCol = getHeaderIndex(headers, "Email", 4);
    var email = safeText(row[emailCol], "");

    if (requestedRows && requestedRows.indexOf(sheetRowNumber) === -1) { skipped++; continue; }
    if (requestedEmails.length && requestedEmails.indexOf(email.toLowerCase()) === -1) { skipped++; continue; }
    if (!isValidEmail(email)) { skipped++; continue; }

    try {
      var responses = buildResponsesFromMatrix(headers, explanations, modelAnswers, row);
      sendStudentReportV5(email, safeText(row[getHeaderIndex(headers, "Name", 2)], "طالب Luminova"), title, Number(row[getHeaderIndex(headers, "Score", 6)]) || 0, Number(row[getHeaderIndex(headers, "Max Score", 7)]) || 0, responses);
      sent++;
    } catch (err) {
      errors.push({ row: sheetRowNumber, email: email, message: err && err.toString ? err.toString() : String(err) });
    }
  }

  if (adminEmails.length) sendBulkAdminSummaryV5(adminEmails, { title: title, sheetName: sheet.getName(), sent: sent, skipped: skipped, errors: errors.length });
  return jsonResponse({ status: "ok", message: "اكتمل إرسال التقارير الجماعية", sent: sent, skipped: skipped, errors: errors });
}

function handleCheckDuplicate(sheet, data) {
  var email = safeText(data.email, "").toLowerCase();
  if (!email) return jsonResponse({ status: "clear" });
  var values = sheet.getDataRange().getValues();
  if (!values.length) return jsonResponse({ status: "clear" });
  var headers = values[0];
  var emailCol = getHeaderIndex(headers, "Email", 4);
  for (var i = 3; i < values.length; i++) {
    if (safeText(values[i][emailCol], "").toLowerCase() === email) return jsonResponse({ status: "exists" });
  }
  return jsonResponse({ status: "clear" });
}

function buildResponsesFromMatrix(headers, explanations, modelAnswers, row) {
  var responses = [];
  var qStart = getQuestionStartIndex(headers);
  for (var c = qStart; c < headers.length; c += 2) {
    var rawQuestion = safeText(headers[c], "Question");
    var question = rawQuestion.replace(/^Q\d+:\s*/i, "");
    var status = safeText(row[c + 1], "");
    responses.push({ question: question, studentAnswer: safeText(row[c], "---"), isCorrect: status.indexOf("✅") !== -1 ? true : (status.indexOf("❌") !== -1 ? false : null), correctAnswer: safeText(modelAnswers[c], "---"), explanation: safeText(explanations[c], "") });
  }
  return responses;
}

function sendStudentReportV5(to, name, examTitle, score, max, responses) {
  var safeMax = Number(max) || 0;
  var safeScore = Number(score) || 0;
  var percentage = safeMax > 0 ? ((safeScore / safeMax) * 100) : 0;
  var percentageText = percentage.toFixed(1) + "%";
  var passed = percentage >= 50;
  var accent = passed ? "#10b981" : "#ef4444";
  var performanceText = passed ? "أداء موفق" : "فرصة ممتازة للمراجعة والتحسن";
  var rows = "";

  responses.forEach(function(r, i) {
    var icon = statusIcon(r.isCorrect);
    var answerColor = r.isCorrect === true ? "#047857" : (r.isCorrect === false ? "#dc2626" : "#475569");
    var correctBlock = r.isCorrect === false && r.correctAnswer
      ? '<div style="margin-top:10px;padding:10px 12px;border-radius:10px;background:#ecfeff;color:#0e7490;font-size:14px;"><b>الإجابة النموذجية:</b> ' + escapeHtml(r.correctAnswer) + '</div>'
      : "";
    var explanationBlock = r.explanation
      ? '<div style="margin-top:10px;padding:12px;border-radius:10px;background:#f8fafc;color:#475569;font-size:13px;line-height:1.8;border:1px solid #e2e8f0;"><b style="color:#334155;">التعليل:</b> ' + escapeHtml(r.explanation) + '</div>'
      : "";
    rows += '<tr><td style="padding:18px 0;border-bottom:1px solid #e2e8f0;">'
      + '<div style="font-size:15px;font-weight:800;color:#0f172a;line-height:1.8;">' + (i + 1) + '. ' + escapeHtml(r.question) + ' <span>' + icon + '</span></div>'
      + '<div style="margin-top:8px;font-size:14px;color:#64748b;">إجابتك: <span style="font-weight:800;color:' + answerColor + ';">' + escapeHtml(r.studentAnswer) + '</span></div>'
      + correctBlock + explanationBlock + '</td></tr>';
  });

  var htmlBody = '<div dir="rtl" style="margin:0;padding:0;background:#eef2ff;font-family:Arial,Tahoma,sans-serif;color:#0f172a;">'
    + '<div style="max-width:680px;margin:0 auto;padding:24px 14px;"><div style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(15,23,42,0.14);border:1px solid #dbeafe;">'
    + '<div style="padding:34px 28px;background:linear-gradient(135deg,#0891b2,#7c3aed);color:#ffffff;text-align:center;"><div style="font-size:13px;font-weight:800;letter-spacing:.5px;opacity:.9;">Luminova Edu</div><h1 style="margin:12px 0 6px;font-size:26px;line-height:1.4;">تقرير نتيجة الاختبار</h1><div style="font-size:15px;opacity:.92;">' + escapeHtml(examTitle) + '</div></div>'
    + '<div style="padding:28px;"><p style="font-size:18px;line-height:1.8;margin:0 0 18px;">مرحباً <b>' + escapeHtml(name) + '</b>، هذا تقريرك التفصيلي بعد تسليم الاختبار.</p>'
    + '<div style="border-radius:20px;background:#f8fafc;border:1px solid #e2e8f0;padding:22px;text-align:center;margin:18px 0 24px;"><div style="font-size:54px;font-weight:900;color:' + accent + ';line-height:1;">' + percentageText + '</div><div style="margin-top:10px;font-size:16px;color:#475569;">حصلت على <b>' + safeScore + '</b> من <b>' + safeMax + '</b></div><div style="display:inline-block;margin-top:14px;padding:8px 14px;border-radius:999px;background:' + accent + '1a;color:' + accent + ';font-weight:800;font-size:13px;">' + performanceText + '</div></div>'
    + '<table style="width:100%;border-collapse:collapse;">' + rows + '</table></div>'
    + '<div style="padding:18px 24px;background:#f8fafc;color:#94a3b8;text-align:center;font-size:12px;line-height:1.7;">تم إرسال هذا التقرير آلياً من منصة Luminova Edu</div>'
    + '</div></div></div>';

  MailApp.sendEmail({ to: to, subject: "نتيجتك في اختبار: " + examTitle, htmlBody: htmlBody });
}

function sendAdminSummaryV5(adminEmails, info) {
  var percentage = Number(info.maxScore) > 0 ? ((Number(info.score) / Number(info.maxScore)) * 100).toFixed(1) + "%" : "0%";
  var htmlBody = '<div dir="rtl" style="font-family:Arial,Tahoma,sans-serif;background:#f8fafc;padding:20px;color:#0f172a;"><div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;"><div style="background:#0f172a;color:#ffffff;padding:20px 24px;"><h2 style="margin:0;font-size:20px;">تقرير تسليم جديد</h2><div style="opacity:.75;margin-top:6px;font-size:13px;">Luminova Edu Admin Notification</div></div><div style="padding:22px 24px;line-height:1.9;font-size:15px;"><p style="margin:0 0 14px;">تم تسجيل نتيجة جديدة في اختبار <b>' + escapeHtml(info.title) + '</b>.</p><table style="width:100%;border-collapse:collapse;">' + adminRow("الطالب", info.name) + adminRow("البريد", info.email) + adminRow("رقم الجلوس", info.seat) + adminRow("القسم", info.department) + adminRow("الدرجة", info.score + " / " + info.maxScore + " (" + percentage + ")") + adminRow("سبب الإنهاء", info.reason) + '</table></div></div></div>';
  MailApp.sendEmail({ to: adminEmails.join(","), subject: "تقرير جديد: " + info.name + " حصل على " + info.score + "/" + info.maxScore + " في " + info.title, htmlBody: htmlBody });
}

function sendBulkAdminSummaryV5(adminEmails, info) {
  var htmlBody = '<div dir="rtl" style="font-family:Arial,Tahoma,sans-serif;background:#f8fafc;padding:20px;color:#0f172a;"><div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;"><div style="background:#1e40af;color:#ffffff;padding:20px 24px;"><h2 style="margin:0;font-size:20px;">ملخص إرسال التقارير الجماعية</h2></div><div style="padding:22px 24px;line-height:1.9;font-size:15px;"><table style="width:100%;border-collapse:collapse;">' + adminRow("الاختبار", info.title) + adminRow("ورقة البيانات", info.sheetName) + adminRow("تم الإرسال", info.sent) + adminRow("تم التخطي", info.skipped) + adminRow("أخطاء", info.errors) + '</table></div></div></div>';
  MailApp.sendEmail({ to: adminEmails.join(","), subject: "ملخص إرسال التقارير الجماعية: " + info.title, htmlBody: htmlBody });
}

function sortResponses(responses) {
  return responses.slice().sort(function(a, b) {
    var ai = Number(a.originalIndex);
    var bi = Number(b.originalIndex);
    if (isFinite(ai) && isFinite(bi) && ai !== bi) return ai - bi;
    return 0;
  });
}

function buildBaseRow(headers, qStart, info) {
  var row = [];
  for (var i = 0; i < qStart; i++) {
    var h = String(headers[i] || "").toLowerCase();
    if (h === "timestamp") row.push(info.timestamp);
    else if (h === "submission id") row.push(info.submissionId);
    else if (h === "name") row.push(info.name);
    else if (h === "seat number") row.push(info.seat);
    else if (h === "email") row.push(info.email);
    else if (h === "department") row.push(info.department);
    else if (h === "score") row.push(info.score);
    else if (h === "max score") row.push(info.maxScore);
    else if (h === "entry time") row.push(info.entryTime);
    else if (h === "exit time") row.push(info.exitTime);
    else if (h === "ip address") row.push(info.ipAddress);
    else if (h === "termination reason") row.push(info.reason);
    else if (h === "exam title") row.push(info.title);
    else row.push("");
  }
  return row;
}

function isDuplicateSubmission(sheet, submissionId, email, title) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 4) return false;
  var headers = values[0];
  var submissionCol = getHeaderIndex(headers, "Submission ID", -1);
  var emailCol = getHeaderIndex(headers, "Email", 4);
  var titleCol = getHeaderIndex(headers, "Exam Title", -1);
  for (var i = 3; i < values.length; i++) {
    if (submissionCol >= 0 && normalizeSubmissionId(values[i][submissionCol]) === submissionId) return true;
    if (submissionCol < 0 && email && safeText(values[i][emailCol], "").toLowerCase() === safeText(email, "").toLowerCase()) {
      if (titleCol < 0 || safeText(values[i][titleCol], "") === safeText(title, "")) return true;
    }
  }
  return false;
}

function getQuestionStartIndex(headers) {
  for (var i = 0; i < headers.length; i++) {
    if (/^Q\d+:/i.test(String(headers[i] || ""))) return i;
  }
  return headers.length;
}

function getHeaderIndex(headers, name, fallbackZeroBased) {
  var target = String(name).toLowerCase();
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i] || "").toLowerCase() === target) return i;
  }
  return fallbackZeroBased;
}

function getTargetSheet(ss, data) {
  if (data.sheetName) {
    var namedSheet = ss.getSheetByName(data.sheetName);
    if (!namedSheet) throw new Error("Sheet not found: " + data.sheetName);
    return namedSheet;
  }
  return ss.getActiveSheet();
}

function buildSubmissionId(title, email, seat) {
  return [title || "exam", email || seat || "student"].join("::");
}

function normalizeSubmissionId(value) {
  return safeText(value, "").trim().toLowerCase();
}

function normalizeEmailList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(function(email) { return safeText(email, "").trim(); }).filter(isValidEmail);
  if (typeof value === "string") return value.split(",").map(function(email) { return email.trim(); }).filter(isValidEmail);
  return [];
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeText(email, ""));
}

function statusIcon(isCorrect) {
  if (isCorrect === true) return "✅";
  if (isCorrect === false) return "❌";
  return "📝";
}

function adminRow(label, value) {
  return '<tr><td style="padding:9px 0;color:#64748b;width:35%;border-bottom:1px solid #f1f5f9;">' + escapeHtml(label) + '</td><td style="padding:9px 0;font-weight:800;border-bottom:1px solid #f1f5f9;">' + escapeHtml(value) + '</td></tr>';
}

function safeText(value, fallback) {
  if (value === null || value === undefined || value === "") return fallback || "";
  return String(value);
}

function escapeHtml(value) {
  return safeText(value, "").replace(/[&<>"']/g, function(ch) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
  });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

## Deployment notes

1. Deploy the Apps Script as a Web App with access set to the students/users who submit exams.
2. Use the `/exec` URL in the exam CMS `webhookUrl`.
3. Open the same Web App URL in a browser to access the admin panel and the bulk report button.
4. The Gmail link in the admin panel opens Gmail sent mail for quick verification after bulk sending.
