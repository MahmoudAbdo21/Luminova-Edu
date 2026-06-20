(function () {
  "use strict";

  window.Luminova = window.Luminova || {};
  window.Luminova.Services = window.Luminova.Services || {};

  const base64UrlToBase64 = (value) => {
    let base64 = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return base64;
  };

  const base64UrlToBytes = (value) => {
    const binary = atob(base64UrlToBase64(value));
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  };

  const decodeUtf8 = (bytes) => {
    return new TextDecoder().decode(bytes);
  };

  const unpackQuestion = (q) => ({
    questionId: q?.[0] || "",
    id: q?.[0] || "",
    originalIndex: Number(q?.[1] || 0),
    type: q?.[2] || "mcq",
    questionText: q?.[3] || "",
    text: q?.[3] || "",
    textAr: q?.[3] || "",
    prompt: q?.[3] || "",
    options: Array.isArray(q?.[4])
      ? q[4].map(opt => (Array.isArray(opt) ? (opt[1] || opt[0] || "") : (opt || "")))
      : [],
    maxPoints: Number(q?.[5] || 1),
    score: Number(q?.[5] || 1),
    points: Number(q?.[5] || 1),
    modelAnswer: q?.[6] || "",
    correctAnswerText: q?.[6] || "",
    explanation: q?.[7] || "",
    feedback: q?.[7] || "",
    correctAnswers: Array.isArray(q?.[8]) ? q[8] : [],
    correctOptionIds: Array.isArray(q?.[9]) ? q[9] : [],
    acceptedAnswers: Array.isArray(q?.[10]) ? q[10] : []
  });

  const unpackExam = (e) => {
    const rawStatus = e?.[18] || "";
    const pubStatus = String(rawStatus).trim().toLowerCase();
    const isPub = pubStatus !== "draft" && pubStatus !== "disabled" && pubStatus !== "inactive" && pubStatus !== "false";
    const settings = e?.[19] || {};

    return {
      schemaVersion: 2,
      quizId: e?.[0] || "",
      id: e?.[0] || "",
      code: e?.[0] || "",
      title: e?.[1] || "",
      titleAr: e?.[2] || e?.[1] || "",
      titleEn: e?.[3] || e?.[1] || "",
      examMode: e?.[4] || "practice",
      mode: e?.[4] || "practice",
      webhookUrl: e?.[5] || "",
      resultSpreadsheetId: e?.[6] || "",
      spreadsheetId: e?.[6] || "",
      sheetName: e?.[7] || "",
      schemaHash: e?.[8] || "",
      preparedSchemaHash: e?.[9] || e?.[8] || "",
      expectedQuestionCount: Number(e?.[10] || 0),
      maxScore: Number(e?.[11] || 0),
      questions: Array.isArray(e?.[12]) ? e[12].map(unpackQuestion) : [],
      subjectId: e?.[13] || "",
      subject_id: e?.[13] || "",
      courseId: e?.[13] || "",
      categoryId: e?.[14] || "",
      levelId: e?.[15] || "",
      duration: Number(e?.[16] || 0),
      timeLimit: Number(e?.[16] || 0),
      passingScore: Number(e?.[17] || 0),
      status: rawStatus || "published",
      publishStatus: rawStatus || "published",
      isPublished: isPub,
      published: isPub,
      isActive: isPub,
      active: isPub,
      visible: isPub,
      enabled: isPub,

      // Settings Contract
      duplicatePolicy: settings.duplicatePolicy || "prevent_by_email",
      allowRetakes: settings.allowRetakes !== undefined ? !!settings.allowRetakes : false,
      maxAttempts: settings.maxAttempts !== undefined && settings.maxAttempts !== null ? Number(settings.maxAttempts) : 1,
      showResult: settings.showResult !== undefined ? !!settings.showResult : (settings.showResultsAfter !== undefined ? !!settings.showResultsAfter : true),
      resultDisplayMode: settings.resultDisplayMode || "score_with_answers_and_explanations",
      showScore: settings.showScore !== undefined ? !!settings.showScore : true,
      showPercentage: settings.showPercentage !== undefined ? !!settings.showPercentage : true,
      showCorrectAnswers: settings.showCorrectAnswers !== undefined ? !!settings.showCorrectAnswers : true,
      showModelAnswers: settings.showModelAnswers !== undefined ? !!settings.showModelAnswers : true,
      showExplanations: settings.showExplanations !== undefined ? !!settings.showExplanations : true,
      allowReviewAfterSubmit: settings.allowReviewAfterSubmit !== undefined ? !!settings.allowReviewAfterSubmit : true,
      startTime: settings.startTime || "",
      endTime: settings.endTime || "",
      antiCheat: settings.antiCheat || {},
      latePolicy: settings.latePolicy || "hard_stop"
    };
  };

  const decodeLxp2 = (pack) => {
    if (!pack || pack.v !== 2 || pack.alg !== "luminova-lxp-v2") {
      throw new Error("Invalid Luminova LXP2 exam pack.");
    }

    const chunks = Array.isArray(pack.chunks) ? [...pack.chunks].reverse() : [];
    const payloadBase64 = chunks.join("");

    if (String(payloadBase64.length) !== String(pack.checksum || "")) {
      throw new Error("Invalid Luminova exam pack checksum.");
    }

    const payloadBytes = base64UrlToBytes(payloadBase64);
    const saltBytes = base64UrlToBytes(pack.salt);

    if (!saltBytes.length) {
      throw new Error("Invalid Luminova exam pack salt.");
    }

    for (let i = 0; i < payloadBytes.length; i++) {
      payloadBytes[i] ^= saltBytes[i % saltBytes.length];
    }

    const json = decodeUtf8(payloadBytes);
    const payload = JSON.parse(json);

    if (!Array.isArray(payload) || payload[0] !== "LXP2" || !Array.isArray(payload[1])) {
      throw new Error("Invalid Luminova exam pack payload.");
    }

    return payload[1].map(unpackExam);
  };

  let decodedCache = null;
  let decodedChecksum = null;

  const ExamPackService = {
    decode(pack) {
      const currentChecksum = String(pack?.checksum || "");

      if (decodedCache && decodedChecksum === currentChecksum) {
        return decodedCache;
      }

      decodedCache = decodeLxp2(pack);
      decodedChecksum = currentChecksum;
      return decodedCache;
    }
  };

  window.Luminova = window.Luminova || {};
  window.Luminova.Services = window.Luminova.Services || {};
  window.Luminova.Services.ExamPack = ExamPackService;

  // Direct fallback in case another file overwrites window.Luminova later.
  window.LUMINOVA_EXAM_PACK_SERVICE = ExamPackService;
})();
