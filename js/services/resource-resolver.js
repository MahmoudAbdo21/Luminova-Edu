(function () {
    "use strict";

    window.Luminova = window.Luminova || {};
    window.Luminova.Services = window.Luminova.Services || {};

    const ResourceResolver = {
        resolveType(resourceOrUrl) {
            if (!resourceOrUrl) return "unknown";
            const urlStr = typeof resourceOrUrl === 'string' ? resourceOrUrl : String(resourceOrUrl.url || '');
            if (!urlStr) return "unknown";

            const isBase64 = urlStr.startsWith('data:');
            const mimeMatch = isBase64 ? urlStr.match(/data:(.*?);/) : null;
            const mimeType = mimeMatch ? mimeMatch[1] : '';

            // Check for interactive lesson first
            if (urlStr.match(/\.jsx(\?.*)?$/i) || urlStr.includes('/Interactive-lessons/') || urlStr.includes('Interactive-lessons/')) {
                return "interactive";
            }
            if (urlStr.includes('drive.google.com/drive/folders/') || urlStr.includes('drive.google.com/folders/') || urlStr.includes('/folders/')) {
                return "google_drive_folder";
            }
            if (urlStr.includes('drive.google.com')) {
                return "google_drive";
            }
            if (urlStr.includes('youtube.com') || urlStr.includes('youtu.be')) {
                return "youtube";
            }
            if (urlStr.includes('classroom.google.com')) {
                return "google_classroom";
            }
            if (urlStr.includes('docs.google.com/forms')) {
                return "google_form";
            }
            if (urlStr.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i) || (isBase64 && mimeType.startsWith('image/'))) {
                return "image";
            }
            if (urlStr.match(/\.(mp3|wav|ogg)(\?.*)?$/i) || (isBase64 && mimeType.startsWith('audio/'))) {
                return "audio";
            }
            if (urlStr.match(/\.(mp4|webm)(\?.*)?$/i) || (isBase64 && mimeType.startsWith('video/'))) {
                return "video";
            }
            if (urlStr.match(/\.pdf(\?.*)?$/i) || (isBase64 && mimeType === 'application/pdf')) {
                return "pdf";
            }
            if (urlStr.match(/\.html?(?:[?#].*)?$/i) || (isBase64 && mimeType === 'text/html')) {
                const isExternal = urlStr.startsWith('http') || urlStr.startsWith('file://') || urlStr.startsWith('//');
                if (isExternal) {
                    return "external_link";
                }
                return "html";
            }
            
            // Check if it is a local path or external link
            if (!urlStr.startsWith('http') && !urlStr.startsWith('data:') && !urlStr.startsWith('blob:') && !urlStr.startsWith('file://')) {
                return "local_path";
            }
            if (urlStr.startsWith('http') || urlStr.startsWith('file://')) {
                return "external_link";
            }
            return "unknown";
        },

        extractDriveId(url) {
            if (!url) return "";
            const urlStr = typeof url === 'string' ? url : String(url.url || '');
            const patterns = [
                /\/file\/d\/([^/?#]+)/i,
                /[?&]id=([^&#]+)/i
            ];
            for (const pattern of patterns) {
                const match = urlStr.match(pattern);
                if (match && match[1]) return match[1];
            }
            return "";
        },

        extractDriveFolderId(url) {
            if (!url) return "";
            const urlStr = typeof url === 'string' ? url : String(url.url || '');
            const match = urlStr.match(/\/folders\/([^/?#]+)/i);
            if (match && match[1]) return match[1];
            return "";
        },

        buildDrivePreviewUrl(id) {
            return id ? `https://drive.google.com/file/d/${id}/preview` : "";
        },

        canEmbed(resourceOrUrl) {
            const type = this.resolveType(resourceOrUrl);
            if (type === "google_classroom" || type === "google_drive_folder" || type === "external_link" || type === "unknown") {
                return false;
            }
            if (type === "google_drive") {
                const id = this.extractDriveId(resourceOrUrl);
                return !!(id && id.match(/^[-\w]{25,}$/));
            }
            return true;
        },

        getExternalUrl(resourceOrUrl) {
            if (!resourceOrUrl) return "";
            return typeof resourceOrUrl === 'string' ? resourceOrUrl : String(resourceOrUrl.url || '');
        },

        isSafeExternalUrl(rawUrl) {
            try {
                const parsed = new URL(rawUrl, window.location.href);
                return parsed.protocol === "https:" || parsed.protocol === "http:";
            } catch {
                return false;
            }
        },

        getExternalPlatformInfo(rawUrl) {
            try {
                const url = new URL(rawUrl, window.location.href);
                const hostname = url.hostname.replace(/^www\./i, "");

                const knownPlatforms = {
                    "canvas.instructure.com": {
                        name: "Canvas",
                        icon: "🎓",
                        description: "هذا المحتوى متاح على منصة Canvas التعليمية."
                    },
                    "instructure.com": {
                        name: "Canvas",
                        icon: "🎓",
                        description: "هذا المحتوى متاح على منصة Canvas التعليمية."
                    },
                    "moodle.org": {
                        name: "Moodle",
                        icon: "🎓",
                        description: "هذا المحتوى متاح على منصة Moodle التعليمية."
                    },
                    "youtube.com": {
                        name: "YouTube",
                        icon: "▶️",
                        description: "هذا المحتوى متاح على منصة YouTube."
                    },
                    "youtu.be": {
                        name: "YouTube",
                        icon: "▶️",
                        description: "هذا المحتوى متاح على منصة YouTube."
                    },
                    "vimeo.com": {
                        name: "Vimeo",
                        icon: "🎬",
                        description: "هذا المحتوى متاح على منصة Vimeo."
                    },
                    "github.com": {
                        name: "GitHub",
                        icon: "💻",
                        description: "هذا المحتوى متاح على منصة GitHub."
                    }
                };

                const matchedKey = Object.keys(knownPlatforms).find(
                    key => hostname === key || hostname.endsWith("." + key)
                );

                if (matchedKey) {
                    return {
                        ...knownPlatforms[matchedKey],
                        hostname,
                        url: url.href
                    };
                }

                const readableName = hostname
                    .split(".")
                    .filter(Boolean)
                    .slice(0, -1)
                    .join(" ")
                    .replace(/[-_]+/g, " ")
                    .replace(/\b\w/g, char => char.toUpperCase());

                return {
                    name: readableName || hostname,
                    hostname,
                    icon: "🌐",
                    description: `هذا المحتوى متاح على منصة خارجية: ${hostname}`,
                    url: url.href
                };
            } catch {
                return null;
            }
        },

        getFallbackMessage(resourceOrUrl, lang) {
            const type = this.resolveType(resourceOrUrl);
            if (type === "google_classroom") {
                return lang === 'ar'
                    ? 'هذا المحتوى موجود على Google Classroom. اضغط لفتحه في نافذة جديدة.'
                    : 'This content is available on Google Classroom. Click to open in a new window.';
            }
            if (type === "google_drive") {
                return lang === 'ar'
                    ? 'تعذر ضمان عرض الملف داخل المنصة. يمكنك فتحه مباشرة في Google Drive.'
                    : 'Trouble viewing this file? You can open it in Google Drive directly.';
            }
            return lang === 'ar'
                ? 'تعذر عرض هذا المحتوى حاليًا. افتح الرابط خارجيًا أو راجع صلاحية الملف.'
                : 'Unable to display this content currently. Open link externally or check file permissions.';
        }
    };

    window.Luminova.Services.ResourceResolver = ResourceResolver;
    window.LuminovaResourceResolver = ResourceResolver;
})();
