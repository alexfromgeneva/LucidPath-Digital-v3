import { o as __toESM, t as __commonJSMin } from "./rolldown-runtime-CE-6LUnI.js";
import { t as require_jsx_runtime } from "./jsx-runtime-CwzbG7ys.js";
import { t as require_react } from "./react-I5hdCSmb.js";
import { t as require_react_dom } from "./react-dom-BK1JUzp1.js";
import { i as getOrCreateAnalyticsSessionId, n as scrubUrl, o as isSyntheticTrafficValue, r as getOrCreateAnalyticsAnonymousId } from "./session-replay-C2ktCnaf.js";
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/analytics-events.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AGENT_NATIVE_LIFECYCLE_EVENTS = {
	appEntered: "app_entered",
	coreActionStarted: "core_action_started",
	coreActionCompleted: "core_action_completed",
	outputViewed: "output_viewed",
	outputShared: "output_shared",
	returnUsage: "return_usage",
	crossAppUsed: "cross_app_used",
	coreActionFailed: "core_action_failed",
	ctaClicked: "cta_clicked"
};
function stringValue(value) {
	if (typeof value !== "string") return void 0;
	return value.trim() || void 0;
}
function normalizeTrackingDimension(value) {
	const normalized = stringValue(value)?.toLowerCase();
	if (!normalized || normalized === "localhost") return void 0;
	return normalized.startsWith("agent-native-") ? normalized.slice(13) : normalized;
}
function withCanonicalTrackingProperties(properties) {
	const next = { ...properties };
	const appName = normalizeTrackingDimension(properties.app_name ?? properties.app);
	if (appName) next.app_name = appName;
	const templateName = normalizeTrackingDimension(properties.template_name ?? properties.template ?? properties.templateId);
	if (templateName) next.template_name = templateName;
	const sessionId = stringValue(properties.session_id ?? properties.sessionId);
	if (sessionId) next.session_id = sessionId;
	return next;
}
function normalizedEventName(value) {
	return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function outputId(properties) {
	for (const key of [
		"output_id",
		"resource_id",
		"recording_id",
		"plan_id",
		"deck_id",
		"document_id",
		"form_id"
	]) {
		const value = stringValue(properties[key]);
		if (value) return value;
	}
}
function outputType(properties) {
	return stringValue(properties.output_type ?? properties.resource_type);
}
var LIFECYCLE_PROPERTY_KEYS = [
	"user_id",
	"user_email",
	"app_name",
	"template_name",
	"session_id",
	"action_name",
	"action_method",
	"action_source",
	"caller",
	"success",
	"failure_type",
	"failure_code",
	"surface",
	"source",
	"referrer",
	"workspace_id",
	"company_domain",
	"share_method",
	"cta_name",
	"link_type",
	"run_id",
	"thread_id",
	"turn_id",
	"chat_tab_id",
	"chat_surface",
	"request_mode",
	"duration_ms",
	"status_code",
	"ref",
	"via"
];
function lifecycleProperties(properties) {
	const next = {};
	for (const key of LIFECYCLE_PROPERTY_KEYS) {
		const value = properties[key];
		if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") next[key] = value;
	}
	const id = outputId(properties);
	if (id) next.output_id = id;
	const type = outputType(properties);
	if (type) next.output_type = type;
	return next;
}
function legacyLifecycleEvent(name, properties) {
	const base = lifecycleProperties(withCanonicalTrackingProperties(properties));
	if (name === "share_link_copied" || name === "share_invite_sent" || name === "share_visibility_change") return {
		name: AGENT_NATIVE_LIFECYCLE_EVENTS.outputShared,
		properties: {
			...base,
			share_method: name === "share_link_copied" ? "copy_link" : name === "share_invite_sent" ? "invite" : "visibility_change"
		}
	};
	if (name === "share_view" || name === "view clip preview" || name === "view plan video preview") return {
		name: AGENT_NATIVE_LIFECYCLE_EVENTS.outputViewed,
		properties: {
			...base,
			...name === "view clip preview" ? { output_type: "clip" } : {},
			...name === "view plan video preview" ? { output_type: "plan" } : {}
		}
	};
	if (name === "app.first_action") {
		const action = stringValue(properties.action);
		if (action === "chat_submit" || action === "recording_start") return {
			name: AGENT_NATIVE_LIFECYCLE_EVENTS.coreActionStarted,
			properties: {
				...base,
				action_name: action
			}
		};
		if (action === "plan_viewed") return {
			name: AGENT_NATIVE_LIFECYCLE_EVENTS.outputViewed,
			properties: {
				...base,
				action_name: action
			}
		};
	}
	if (name === "generate deck") return {
		name: AGENT_NATIVE_LIFECYCLE_EVENTS.ctaClicked,
		properties: {
			...base,
			cta_name: "generate_deck"
		}
	};
	if (name === "share_cta_click") return {
		name: AGENT_NATIVE_LIFECYCLE_EVENTS.ctaClicked,
		properties: {
			...base,
			cta_name: stringValue(properties.cta) ?? "share_cta"
		}
	};
	if (name === "auth.signup_clicked" || name === "auth.login_clicked" || name === "builder connect clicked" || name.startsWith("click ") || name.startsWith("try ") || name.startsWith("choose ") || name === "create your own" || name === "start from scratch") return {
		name: AGENT_NATIVE_LIFECYCLE_EVENTS.ctaClicked,
		properties: {
			...base,
			cta_name: stringValue(properties.cta) ?? normalizedEventName(name)
		}
	};
	return null;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/analytics-platform.js
var ANALYTICS_CLIENT_PLATFORM_HEADER = "X-Agent-Native-Client-Platform";
var ANALYTICS_CLIENT_PLATFORM_PROPERTY = "client_platform";
var ANALYTICS_CLIENT_PLATFORMS = [
	"web",
	"electron",
	"mobile"
];
function normalizeAnalyticsClientPlatform(value) {
	return typeof value === "string" && ANALYTICS_CLIENT_PLATFORMS.includes(value) ? value : void 0;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/llm-connection.js
function normalizeLlmConnection(engine) {
	const value = typeof engine === "string" ? engine.trim() : "";
	if (!value) return "none";
	if (value.startsWith("ai-sdk:")) return value.slice(7) || value;
	return value;
}
function llmConnectionTrackingProperties(status) {
	if (!status) return { llm_connection: "unknown" };
	if (!status.configured || !status.engine) return {
		llm_connection: "none",
		llm_connection_configured: false
	};
	return {
		llm_connection: normalizeLlmConnection(status.engine),
		llm_connection_configured: true,
		llm_engine: status.engine,
		...status.model ? { llm_model: status.model } : {},
		...status.source ? { llm_connection_source: status.source } : {},
		...status.envVar ? { llm_connection_env_var: status.envVar } : {}
	};
}
var QA_TEST_EMAIL_PATTERNS = [
	/\+autoz[^@\s]*@/i,
	/\+qa-test-bot-[^@\s]+@/i,
	/^qa-test-bot-[^@\s]*@/i,
	/^an-e2e-probe-[^@\s]*@/i,
	/@[^@\s]*\.(?:invalid|localhost)$/i,
	/^e2e-[^@\s]*@example\.(?:com|net|org)$/i
];
function isQaTestEmail(value) {
	if (typeof value !== "string") return false;
	const candidate = value.trim();
	if (!candidate) return false;
	return QA_TEST_EMAIL_PATTERNS.some((pattern) => pattern.test(candidate));
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/tracking/redaction.js
/**
* Bounding and redaction helpers shared by every exception emitter.
*
* Kept free of `process.env` and Node built-ins so the browser bundle can use
* the same rules — an exception shaped one way on the server and another way
* in the client is how a leak ships in only one of them.
*/
var MAX_MESSAGE_LENGTH$1 = 1e3;
var SECRET_RE = /\b(?:bearer|basic)\s+[^\s]+/gi;
function redact(value) {
	return value.replace(SECRET_RE, (match) => `${match.split(/\s+/, 1)[0]} <redacted>`).replace(/([A-Za-z0-9_$.-]*(?:authorization|cookie|token|secret|password|passwd|pwd|api[-_]?key|apikey|credential)[A-Za-z0-9_$.-]*\s*[:=]\s*)([^\s,;}]+)/gi, "$1<redacted>");
}
function boundedText(value, max) {
	const safe = redact(typeof value === "string" ? value : String(value ?? ""));
	return safe.length > max ? safe.slice(0, max) : safe;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/tracking/posthog-exception.js
/**
* Build PostHog error-tracking payloads from a raw JS error or from the
* camelCase exception properties the framework's own `captureException()`
* emits.
*
* PostHog's error tracking only groups and renders an issue when the event
* carries `$exception_list` with per-frame stack data. An event named
* `$exception` without it is ingested and displayed as an empty, ungroupable
* issue — which is worse than no event, because the count looks like coverage.
*
* Frame parsing follows posthog-js (itself derived from Sentry's TraceKit
* fork), because PostHog's ingestion is written against that shape:
*   - `Error: …` header lines are skipped, not parsed as frames
*   - lines over 1 KB are skipped (the regexes backtrack)
*   - frames are capped at 50 and reversed to oldest-call-first
*   - an unresolvable function name is `?`, never empty
*
* Runs unchanged in Node and the browser: no `process`, no Node built-ins.
*
* @see https://posthog.com/docs/error-tracking/installation/manual
*/
/** Matches posthog-js's `UNKNOWN_FUNCTION`. */
var UNKNOWN_FUNCTION = "?";
var STACKTRACE_FRAME_LIMIT = 50;
var MAX_STACK_LINE_LENGTH = 1024;
var ERROR_HEADER_RE = /\S*Error: /;
var WEBPACK_ERROR_RE = /\(error: (.*)\)/;
var V8_FRAME_RE = /^\s*at (?:async )?(?:(.+?)\s+\()?(?:(.+?):(\d+):(\d+)|([^)]+))\)?\s*$/;
var GECKO_FRAME_RE = /^\s*(.*?)@(.+?)(?::(\d+))?(?::(\d+))?\s*$/;
function isInAppFrame(filename) {
	if (!filename) return true;
	return !filename.startsWith("node:") && !filename.includes("node_modules") && !filename.includes("/internal/") && filename !== "native";
}
function makeFrame(lang, fn, filename, lineno, colno) {
	return {
		platform: "custom",
		lang,
		function: !fn || fn === "<anonymous>" ? UNKNOWN_FUNCTION : fn,
		...filename ? { filename } : {},
		...lineno !== void 0 && Number.isFinite(lineno) ? { lineno } : {},
		...colno !== void 0 && Number.isFinite(colno) ? { colno } : {},
		in_app: isInAppFrame(filename),
		resolved: false
	};
}
function parseFrameLine(line, lang) {
	const v8 = V8_FRAME_RE.exec(line);
	if (v8) {
		const [, fn, file, lineNo, colNo, bare] = v8;
		const filename = (file ?? bare)?.replace(/^file:\/\//, "");
		return makeFrame(lang, fn ?? UNKNOWN_FUNCTION, filename, lineNo ? Number(lineNo) : void 0, colNo ? Number(colNo) : void 0);
	}
	const gecko = GECKO_FRAME_RE.exec(line);
	if (gecko) {
		const [, fn, file, lineNo, colNo] = gecko;
		return makeFrame(lang, fn || UNKNOWN_FUNCTION, file, lineNo ? Number(lineNo) : void 0, colNo ? Number(colNo) : void 0);
	}
}
/**
* Parse a `error.stack` string into PostHog stack frames, oldest call first.
*
* Returns an empty array when nothing parsed. Callers must treat that as
* "no frames" and omit `stacktrace` entirely rather than sending an empty
* frame list — PostHog renders the latter as a stack that exists and is empty.
*/
function parseStackFrames(stack, lang = "javascript") {
	if (!stack) return [];
	const frames = [];
	for (const rawLine of stack.split("\n")) {
		if (rawLine.length > MAX_STACK_LINE_LENGTH) continue;
		const line = WEBPACK_ERROR_RE.test(rawLine) ? rawLine.replace(WEBPACK_ERROR_RE, "$1") : rawLine;
		if (ERROR_HEADER_RE.test(line)) continue;
		const frame = parseFrameLine(line, lang);
		if (frame) frames.push(frame);
		if (frames.length >= STACKTRACE_FRAME_LIMIT) break;
	}
	frames.reverse();
	return frames;
}
/**
* Build the `$exception_*` properties for a PostHog error-tracking event.
*
* The caller merges these into the event properties alongside `distinct_id`
* and any app dimensions.
*/
function toPostHogExceptionProperties(input) {
	const lang = input.lang ?? "javascript";
	const frames = parseStackFrames(input.stack, lang);
	return {
		$exception_list: [{
			type: boundedText(input.type || "Error", 200),
			value: boundedText(input.value || input.type || "Error", MAX_MESSAGE_LENGTH$1),
			mechanism: {
				handled: input.handled ?? true,
				synthetic: input.synthetic ?? false,
				...input.mechanismType ? { type: boundedText(input.mechanismType, 100) } : {}
			},
			...frames.length ? { stacktrace: {
				type: "raw",
				frames
			} } : {}
		}],
		$exception_level: input.level ?? "error",
		...input.fingerprint ? { $exception_fingerprint: boundedText(input.fingerprint, 200) } : {}
	};
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/analytics-platform.js
function getAnalyticsClientPlatform(configured) {
	if (configured) return configured;
	if (typeof window === "undefined") return "web";
	const platformWindow = window;
	return normalizeAnalyticsClientPlatform(platformWindow.agentNativeDesktop?.analytics?.clientPlatform) ?? normalizeAnalyticsClientPlatform(platformWindow.__AGENT_NATIVE_HOST_PLATFORM__) ?? normalizeAnalyticsClientPlatform(platformWindow.__AGENT_NATIVE_CONFIG__?.clientPlatform) ?? "web";
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/app-config.js
/** The resolved, public app policy injected by the Vite plugin. */
function injectedAgentNativeConfig() {
	return {
		"version": 1,
		"onboarding": { "firstRun": "off" },
		"changelog": { "enabled": false },
		"harness": true
	};
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/build-compatibility.js
var RELOAD_MARKER_KEY = "__agentNativeClientCompatibilityReload";
var BUILD_CACHE_BUSTER_PARAM = "__an_build";
function clientBuildId() {
	return "development";
}
function clientCompatibilityVersion() {
	return "";
}
function readReloadMarker(win) {
	try {
		return win.sessionStorage?.getItem(RELOAD_MARKER_KEY) ?? "";
	} catch {
		return win.__agentNativeClientCompatibilityReload ?? "";
	}
}
function writeReloadMarker(win, marker) {
	win.__agentNativeClientCompatibilityReload = marker;
	try {
		win.sessionStorage?.setItem(RELOAD_MARKER_KEY, marker);
	} catch {}
}
function reloadForClientCompatibilityMismatch(serverBuildId, requiredCompatibility, win = typeof window === "undefined" ? void 0 : window) {
	if (!win?.location) return false;
	const marker = `${requiredCompatibility}:${serverBuildId}`;
	if (readReloadMarker(win) === marker) return false;
	writeReloadMarker(win, marker);
	const target = new URL(win.location.href);
	target.searchParams.set(BUILD_CACHE_BUSTER_PARAM, serverBuildId || "latest");
	win.location.replace(target.href);
	return true;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/use-after-paint.js
var AFTER_PAINT_FALLBACK_MS = 250;
var IDLE_TIMEOUT_MS = 500;
function scheduleAfterPaint(callback) {
	if (typeof window === "undefined" || typeof setTimeout !== "function") return () => {};
	let settled = false;
	const cancels = [];
	const settle = () => {
		if (settled) return;
		settled = true;
		for (const cancel of cancels.splice(0)) cancel();
		callback();
	};
	const fallbackId = setTimeout(settle, AFTER_PAINT_FALLBACK_MS);
	cancels.push(() => clearTimeout(fallbackId));
	const scheduleIdle = () => {
		if (typeof requestIdleCallback === "function") {
			const idleId = requestIdleCallback(settle, { timeout: IDLE_TIMEOUT_MS });
			cancels.push(() => cancelIdleCallback(idleId));
		} else {
			const idleId = setTimeout(settle, 0);
			cancels.push(() => clearTimeout(idleId));
		}
	};
	if (typeof requestAnimationFrame === "function") {
		const scheduleIdleAfterFrame = () => {
			const inner = requestAnimationFrame(() => {
				if (settled) return;
				scheduleIdle();
			});
			cancels.push(() => cancelAnimationFrame(inner));
		};
		const outer = requestAnimationFrame(() => {
			if (settled) return;
			scheduleIdleAfterFrame();
		});
		cancels.push(() => cancelAnimationFrame(outer));
	} else scheduleIdle();
	return () => {
		settled = true;
		for (const cancel of cancels.splice(0)) cancel();
	};
}
/**
* Opt-in deferral for non-visible startup reads. Returns `false` until the
* first paint has happened and the main thread has been idle once, then
* `true` for the rest of the mount. Call sites use it as an `enabled` gate or
* to schedule their first read, keeping the first-paint window for work the
* visitor can actually see.
*/
function useAfterPaint() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => scheduleAfterPaint(() => setReady(true)), []);
	return ready;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/runtime-config.js
/**
* Production configuration diagnostics.
*
* This module deliberately accepts an env-like record instead of reading
* process.env so the same rules can run during a Vite build, on the server,
* and in focused tests without ever exposing secret values to the browser.
*/
/** Parse the truthy spellings accepted by typed runtime configuration flags. */
function isTruthyRuntimeValue(value) {
	if (value === true) return true;
	return typeof value === "string" && [
		"1",
		"true",
		"yes",
		"on"
	].includes(value.trim().toLowerCase());
}
var RUNTIME_CONFIG_ISSUE_CODES = /* @__PURE__ */ new Set([
	"auth-disabled-in-production",
	"missing-auth-secret",
	"weak-auth-secret",
	"missing-a2a-secret",
	"weak-a2a-secret",
	"invalid-auth-url",
	"missing-database-url",
	"local-database-in-production",
	"missing-required-env"
]);
function parseRuntimeConfigReport(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const report = value;
	if (report.status !== "ok" && report.status !== "warning" && report.status !== "error" || report.environment !== "development" && report.environment !== "production" || report.phase !== "build" && report.phase !== "runtime" || !Array.isArray(report.issues) || typeof report.prompt !== "string") return null;
	const issues = report.issues;
	if (typeof report.ok !== "boolean" || !issues.every((issue) => !!issue && typeof issue === "object" && RUNTIME_CONFIG_ISSUE_CODES.has(issue.code) && (issue.severity === "warning" || issue.severity === "error") && typeof issue.title === "string" && typeof issue.message === "string" && Array.isArray(issue.envKeys) && issue.envKeys.every((key) => typeof key === "string"))) return null;
	const expectedStatus = issues.some((issue) => issue.severity === "error") ? "error" : issues.length > 0 ? "warning" : "ok";
	if (report.ok !== (issues.length === 0) || report.status !== expectedStatus) return null;
	return report;
}
var EMBED_TOKEN_QUERY_PARAM = "__an_embed_token";
var EMBED_TARGET_QUERY_PARAM = "__an_embed_target";
var EMBED_MODE_QUERY_PARAM = "embedded";
var MCP_APP_CHAT_BRIDGE_QUERY_PARAM = "__an_mcp_chat_bridge";
var EMBED_TARGET_HEADER = "x-agent-native-embed-target";
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/sign-in-journey.js
/** The clean, user-facing sign-in entry point emitted by current clients. */
var SIGN_IN_ENTRY_PATH = "/sign-in";
/**
* The whole runtime, as one self-contained function.
*
* Self-contained on purpose: `signInJourneyInlineScript()` emits this via
* `Function.prototype.toString()` so the login documents run the identical
* code instead of a hand-transcribed copy. A reference to anything outside
* this function body would be undefined inside the emitted script.
*/
function createSignInJourneyRuntime(basePath, configuredHomePath = "/home") {
	var PARAM = "c";
	var LEGACY_PARAM = "return";
	var ENTRY_PATH = "/sign-in";
	var LEGACY_ENTRY_PATH = "/_agent-native/sign-in";
	var MAX_TOKEN = 512;
	var SENTINEL = "http://an.invalid";
	function normalizeBasePath(raw) {
		if (!raw || raw === "/") return "";
		var trimmed = String(raw).replace(/^\/+/, "").replace(/\/+$/, "");
		return trimmed ? "/" + trimmed : "";
	}
	var base = normalizeBasePath(basePath);
	function hasControlCharacter(value) {
		for (var i = 0; i < value.length; i++) {
			var code = value.charCodeAt(i);
			if (code < 32 || code === 127) return true;
		}
		return false;
	}
	function normalizeHomePath(raw) {
		if (typeof raw !== "string" || !raw) return "/home";
		var value = String(raw).trim();
		if (value === "/") return "/";
		if (value.charAt(0) !== "/" || value.charAt(1) === "/" || value.indexOf("\\") >= 0 || value.indexOf("?") >= 0 || value.indexOf("#") >= 0 || hasControlCharacter(value)) return "/home";
		var parsed;
		try {
			parsed = new URL(value, SENTINEL);
		} catch (e) {
			return "/home";
		}
		if (parsed.origin !== SENTINEL || parsed.pathname !== value || parsed.search || parsed.hash || parsed.pathname.startsWith("//")) return "/home";
		return value;
	}
	function isAuthEntryPath(pathname) {
		if (pathname === ENTRY_PATH || pathname.slice(-8) === ENTRY_PATH || pathname === LEGACY_ENTRY_PATH || pathname.slice(-22) === LEGACY_ENTRY_PATH || pathname === "/login" || pathname.slice(-6) === "/login" || pathname === "/signup" || pathname.slice(-7) === "/signup") return true;
		return false;
	}
	var homePath = normalizeHomePath(configuredHomePath);
	if (isAuthEntryPath(homePath)) homePath = "/home";
	/**
	* The shared validator. Returns a full same-origin app path, or `null` —
	* never `"/"`, so an invalid continuation stays distinguishable from a
	* genuine request for the home page. Callers that want a fallback write it
	* at the call site.
	*/
	function normalizeAppPath(raw) {
		if (typeof raw !== "string" || !raw) return null;
		if (hasControlCharacter(raw)) return null;
		if (raw.charAt(0) !== "/") return null;
		if (raw.charAt(1) === "/" || raw.charAt(1) === "\\") return null;
		var parsed;
		try {
			parsed = new URL(raw, SENTINEL);
		} catch (e) {
			return null;
		}
		if (parsed.origin !== SENTINEL) return null;
		var pathname = parsed.pathname || "/";
		if (pathname.startsWith("//")) return null;
		if (isAuthEntryPath(pathname)) return null;
		if (base && pathname !== base && pathname.slice(0, base.length + 1) !== base + "/") return null;
		return pathname + parsed.search + parsed.hash;
	}
	function encodeContinuation(path) {
		var normalized = normalizeAppPath(path);
		if (!normalized) return "";
		var token;
		try {
			token = btoa(encodeURIComponent(normalized)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
		} catch (e) {
			return "";
		}
		return token.length > MAX_TOKEN ? "" : token;
	}
	function decodeContinuation(token) {
		if (typeof token !== "string" || !token) return null;
		if (token.length > MAX_TOKEN) return null;
		var decoded;
		try {
			var b64 = token.replace(/-/g, "+").replace(/_/g, "/");
			while (b64.length % 4 !== 0) b64 += "=";
			decoded = decodeURIComponent(atob(b64));
		} catch (e) {
			return null;
		}
		return normalizeAppPath(decoded);
	}
	function homeHref() {
		return homePath === "/" ? base || "/" : base + homePath;
	}
	function signInJourney(input) {
		var here = normalizeAppPath(input.at);
		var resume = decodeContinuation(input.continuation) ?? normalizeAppPath(input.legacyReturn) ?? here ?? homeHref();
		var signInHref = null;
		if (here !== null) {
			var token = encodeContinuation(here);
			signInHref = base + ENTRY_PATH + (token ? "?" + PARAM + "=" + token : "");
		}
		return {
			signInHref,
			resumeHref: resume
		};
	}
	/** Read a query param out of a raw `?a=b` / `a=b` search string. */
	function readParam(search, name) {
		try {
			return new URLSearchParams(search || "").get(name);
		} catch (e) {
			return null;
		}
	}
	function journeyForLocation(location) {
		return signInJourney({
			at: (location.pathname || "/") + (location.search || "") + (location.hash || ""),
			continuation: readParam(location.search, PARAM),
			legacyReturn: readParam(location.search, LEGACY_PARAM)
		});
	}
	return {
		PARAM,
		LEGACY_PARAM,
		basePath: base,
		homeHref,
		normalizeAppPath,
		encodeContinuation,
		decodeContinuation,
		signInJourney,
		journeyForLocation
	};
}
var runtimeCache = /* @__PURE__ */ new Map();
function runtime(basePath, homePath = "/home") {
	const key = `${basePath ?? ""}\u0000${homePath}`;
	let cached = runtimeCache.get(key);
	if (!cached) {
		cached = createSignInJourneyRuntime(basePath ?? "", homePath);
		runtimeCache.set(key, cached);
	}
	return cached;
}
function signInJourney(input) {
	return runtime(input.basePath, input.homePath).signInJourney(input);
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/embed-auth.js
var installed = false;
var memoryToken = null;
var mcpChatBridgeActive = false;
var mcpChatBridgeScope = null;
var EMBED_TOKEN_STORAGE_KEY = "agent-native:embed-auth-token";
var MCP_CHAT_BRIDGE_STORAGE_KEY = "agent-native:mcp-chat-bridge";
var AUTH_FAILURE_COOLDOWN_MS = 6e4;
var GUARDED_METHODS = /* @__PURE__ */ new Set(["GET", "HEAD"]);
var AUTH_FAILURE_HEADER = "x-agent-native-auth-circuit-breaker";
var MCP_CHAT_BRIDGE_VIEWPORT_STYLE_ID = "agent-native-mcp-chat-bridge-viewport";
var MCP_CHAT_BRIDGE_VIEWPORT_HEIGHT = 560;
var pendingMcpChatBridgeViewportNotification = null;
var authFailureCache = /* @__PURE__ */ new Map();
var embedAuthFailure = null;
function browserWindow() {
	return typeof window === "undefined" ? null : window;
}
function currentUrl$1(win) {
	try {
		return new URL(win.location.href);
	} catch {
		try {
			return new URL(`${win.location.pathname || "/"}${win.location.search || ""}${win.location.hash || ""}`, win.location.origin || "http://agent-native.invalid");
		} catch {
			return null;
		}
	}
}
function readTokenFromUrl(win) {
	return currentUrl$1(win)?.searchParams.get("__an_embed_token") ?? null;
}
function readEmbedMcpChatBridgeFlagFromUrl() {
	const win = browserWindow();
	if (!win) return false;
	const value = currentUrl$1(win)?.searchParams.get(MCP_APP_CHAT_BRIDGE_QUERY_PARAM);
	return value === "1" || value === "true";
}
function currentMcpChatBridgeScope(win) {
	return readTokenFromUrl(win) ?? memoryToken ?? storedToken(win);
}
function clearMcpChatBridge(win) {
	mcpChatBridgeActive = false;
	mcpChatBridgeScope = null;
	try {
		win.sessionStorage?.removeItem(MCP_CHAT_BRIDGE_STORAGE_KEY);
	} catch {}
}
function markEmbedMcpChatBridgeActive() {
	const win = browserWindow();
	const scope = win ? currentMcpChatBridgeScope(win) : null;
	mcpChatBridgeActive = true;
	mcpChatBridgeScope = scope;
	try {
		if (scope) win?.sessionStorage?.setItem(MCP_CHAT_BRIDGE_STORAGE_KEY, scope);
		else win?.sessionStorage?.removeItem(MCP_CHAT_BRIDGE_STORAGE_KEY);
	} catch {}
}
function isEmbedMcpChatBridgeActive() {
	const win = browserWindow();
	if (!win) return false;
	if (!isEmbedAuthActive()) {
		clearMcpChatBridge(win);
		return false;
	}
	if (readEmbedMcpChatBridgeFlagFromUrl()) {
		markEmbedMcpChatBridgeActive();
		return true;
	}
	const scope = currentMcpChatBridgeScope(win);
	if (mcpChatBridgeActive) {
		if (scope == null) return true;
		if (mcpChatBridgeScope == null || mcpChatBridgeScope === scope) {
			mcpChatBridgeScope = scope;
			return true;
		}
		clearMcpChatBridge(win);
		return false;
	}
	try {
		const storedScope = win.sessionStorage?.getItem(MCP_CHAT_BRIDGE_STORAGE_KEY);
		if (storedScope && (scope == null || storedScope === scope)) {
			mcpChatBridgeActive = true;
			mcpChatBridgeScope = storedScope;
			return true;
		}
		if (storedScope && scope != null && storedScope !== scope) win.sessionStorage?.removeItem(MCP_CHAT_BRIDGE_STORAGE_KEY);
		return false;
	} catch {
		return false;
	}
}
function storedToken(win) {
	try {
		return win.sessionStorage?.getItem(EMBED_TOKEN_STORAGE_KEY) ?? null;
	} catch {
		return null;
	}
}
function storeToken(token, win) {
	memoryToken = token;
	try {
		win.sessionStorage?.setItem(EMBED_TOKEN_STORAGE_KEY, token);
	} catch {}
}
function getEmbedAuthToken() {
	const win = browserWindow();
	if (!win) return null;
	const fromUrl = readTokenFromUrl(win);
	if (fromUrl) {
		storeToken(fromUrl, win);
		return fromUrl;
	}
	return memoryToken ?? storedToken(win);
}
function isEmbedAuthActive() {
	const win = browserWindow();
	if (!win) return false;
	if (getEmbedAuthToken()) return true;
	const mode = currentUrl$1(win)?.searchParams.get(EMBED_MODE_QUERY_PARAM);
	return mode === "1" || mode === "true";
}
function ensureMcpChatBridgeViewportClamp(win) {
	if (!isEmbedMcpChatBridgeActive()) return;
	const doc = win.document;
	if (!doc?.head) return;
	if (!doc.getElementById(MCP_CHAT_BRIDGE_VIEWPORT_STYLE_ID)) {
		const style = doc.createElement("style");
		style.id = MCP_CHAT_BRIDGE_VIEWPORT_STYLE_ID;
		const height = `${MCP_CHAT_BRIDGE_VIEWPORT_HEIGHT}px`;
		style.textContent = `
html,
body {
  min-height: 0 !important;
  height: ${height} !important;
  max-height: ${height} !important;
  overflow: hidden !important;
}

#root,
#__next,
[data-agent-native-app-root] {
  min-height: 0 !important;
  height: ${height} !important;
  max-height: ${height} !important;
  overflow: hidden !important;
}
`;
		doc.head.appendChild(style);
	}
	notifyMcpChatBridgeViewportHeight(win);
}
function notifyMcpChatBridgeViewportHeight(win) {
	const height = MCP_CHAT_BRIDGE_VIEWPORT_HEIGHT;
	const notify = () => {
		try {
			win.openai?.notifyIntrinsicHeight?.({ height });
		} catch {}
		try {
			if (win.parent && win.parent !== win) win.parent.postMessage({
				jsonrpc: "2.0",
				method: "ui/notifications/size-changed",
				params: { height }
			}, "*");
		} catch {}
	};
	const pending = pendingMcpChatBridgeViewportNotification;
	pendingMcpChatBridgeViewportNotification = null;
	if (pending) {
		if (pending.animationFrameId !== null) pending.win.cancelAnimationFrame?.(pending.animationFrameId);
		for (const id of pending.timeoutIds) pending.win.clearTimeout(id);
	}
	notify();
	const nextPending = {
		win,
		animationFrameId: null,
		timeoutIds: []
	};
	pendingMcpChatBridgeViewportNotification = nextPending;
	const notifyIfCurrent = () => {
		if (pendingMcpChatBridgeViewportNotification !== nextPending) return;
		notify();
	};
	try {
		if (win.requestAnimationFrame) nextPending.animationFrameId = win.requestAnimationFrame(notifyIfCurrent);
		if (win.setTimeout) {
			nextPending.timeoutIds.push(win.setTimeout(notifyIfCurrent, 250));
			nextPending.timeoutIds.push(win.setTimeout(notifyIfCurrent, 1e3));
		}
	} catch {}
}
/**
* True when this document runs in an opaque-origin (`origin === "null"`)
* browsing context — e.g. a `sandbox="allow-scripts"` iframe without
* `allow-same-origin`, which is how MCP App embeds always load (the outer host
* iframe's sandbox propagates to nested frames).
*
* It matters for auth: the embed session cookie is keyed to the real app origin
* and is NOT delivered to an opaque context, so a full document reload here
* arrives with neither cookie nor — once stripped — URL token, and the server
* auth guard serves the sign-in page. In that case the URL token is the only
* credential that survives a reload, so it must stay in the URL.
*/
function isOpaqueOriginFrame(win) {
	try {
		return win.location.origin === "null";
	} catch {
		return true;
	}
}
function stripTokenFromUrl(win) {
	if (isOpaqueOriginFrame(win)) return;
	try {
		const url = currentUrl$1(win);
		if (!url) return;
		if (!url.searchParams.has("__an_embed_token")) return;
		url.searchParams.delete(EMBED_TOKEN_QUERY_PARAM);
		win.history.replaceState(win.history.state, "", `${url.pathname}${url.search}${url.hash}`);
	} catch {}
}
function currentEmbedTarget(win) {
	return `${win.location.pathname}${win.location.search}`;
}
function currentAppOrigin(win) {
	const url = currentUrl$1(win);
	if (url?.origin && url.origin !== "null") return url.origin;
	try {
		const origin = win.location.origin;
		return origin && origin !== "null" ? origin : null;
	} catch {
		return null;
	}
}
function inputUrl(input, win) {
	try {
		return input instanceof Request ? new URL(input.url) : new URL(String(input), currentUrl$1(win)?.href ?? win.location.href);
	} catch {
		return null;
	}
}
function sameOrigin(input, win) {
	const url = inputUrl(input, win);
	const origin = currentAppOrigin(win);
	return !!url && !!origin && url.origin === origin;
}
function isAgentNativeRuntimePath(pathname) {
	return pathname === "/_agent-native" || pathname.endsWith("/_agent-native") || pathname.includes("/_agent-native/");
}
function requestMethod(input, init) {
	return (init?.method ?? (input instanceof Request ? input.method : void 0) ?? "GET").toUpperCase();
}
function authFailureKey(method, url) {
	return `${method} ${url.href}`;
}
function isAuthFailureStatus(status) {
	return status === 401 || status === 403;
}
function shouldGuardAuthFailure(method, url) {
	if (!GUARDED_METHODS.has(method)) return false;
	if (url.pathname === "/_agent-native/embed/start") return false;
	if (url.pathname.endsWith("/sign-in") || url.pathname.endsWith("/_agent-native/sign-in")) return false;
	return true;
}
function activeAuthFailure(record) {
	if (!record) return null;
	if (record.expiresAt > Date.now()) return record;
	return null;
}
function getCachedAuthFailure(key, useEmbedWideFailure) {
	const cached = activeAuthFailure(authFailureCache.get(key));
	if (cached) return cached;
	authFailureCache.delete(key);
	if (!useEmbedWideFailure) return null;
	const embedCached = activeAuthFailure(embedAuthFailure);
	if (embedCached) return embedCached;
	embedAuthFailure = null;
	return null;
}
function authFailureResponse(record) {
	const headers = new Headers(record.headers);
	headers.set(AUTH_FAILURE_HEADER, "1");
	if (!headers.has("retry-after")) headers.set("retry-after", String(Math.max(1, Math.ceil((record.expiresAt - Date.now()) / 1e3))));
	return new Response(record.body, {
		status: record.status,
		statusText: record.statusText,
		headers
	});
}
async function recordAuthFailure(key, response, useEmbedWideFailure) {
	let body = null;
	try {
		body = await response.clone().text();
	} catch {
		body = null;
	}
	const headers = [];
	response.headers.forEach((value, name) => {
		const lower = name.toLowerCase();
		if (lower === "content-encoding" || lower === "content-length" || lower === "transfer-encoding") return;
		headers.push([name, value]);
	});
	const record = {
		status: response.status,
		statusText: response.statusText,
		headers,
		body,
		expiresAt: Date.now() + AUTH_FAILURE_COOLDOWN_MS
	};
	authFailureCache.set(key, record);
	if (useEmbedWideFailure) embedAuthFailure = record;
}
function clearAuthFailure(key, useEmbedWideFailure) {
	authFailureCache.delete(key);
	if (useEmbedWideFailure) embedAuthFailure = null;
}
function withEmbedAuthHeaders(input, init, token, win) {
	const method = requestMethod(input, init);
	const url = inputUrl(input, win);
	if (url && sameOrigin(input, win) && GUARDED_METHODS.has(method) && isAgentNativeRuntimePath(url.pathname)) {
		url.searchParams.set(EMBED_TOKEN_QUERY_PARAM, token);
		url.searchParams.set(EMBED_TARGET_QUERY_PARAM, currentEmbedTarget(win));
		return [url.toString(), init];
	}
	const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : void 0));
	if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
	if (!headers.has("x-agent-native-embed-target")) headers.set(EMBED_TARGET_HEADER, currentEmbedTarget(win));
	if (input instanceof Request) return [new Request(input, {
		...init,
		headers
	}), void 0];
	return [input, {
		...init,
		headers
	}];
}
function requestUrlAndKey(input, init, win) {
	const url = inputUrl(input, win);
	const origin = currentAppOrigin(win);
	if (!url || !origin || url.origin !== origin) return void 0;
	const method = requestMethod(input, init);
	return {
		key: authFailureKey(method, url),
		shouldGuard: shouldGuardAuthFailure(method, url)
	};
}
function ensureEmbedAuthFetchInterceptor() {
	const win = browserWindow();
	if (!win) return;
	if (readEmbedMcpChatBridgeFlagFromUrl()) markEmbedMcpChatBridgeActive();
	const urlToken = readTokenFromUrl(win);
	if (urlToken) {
		storeToken(urlToken, win);
		stripTokenFromUrl(win);
	}
	ensureMcpChatBridgeViewportClamp(win);
	if (installed) return;
	if (typeof win.fetch !== "function") return;
	installed = true;
	const originalFetch = win.fetch.bind(win);
	win.fetch = (async (input, init) => {
		const request = requestUrlAndKey(input, init, win);
		const embedMode = isEmbedAuthActive();
		if (request?.shouldGuard) {
			const cached = getCachedAuthFailure(request.key, embedMode);
			if (cached) return authFailureResponse(cached);
		}
		const token = getEmbedAuthToken();
		let fetchInput = input;
		let fetchInit = init;
		if (token && sameOrigin(input, win)) [fetchInput, fetchInit] = withEmbedAuthHeaders(input, init, token, win);
		const response = await originalFetch(fetchInput, fetchInit);
		if (request?.shouldGuard && isAuthFailureStatus(response.status)) await recordAuthFailure(request.key, response, embedMode || !!token);
		else if (request?.shouldGuard && response.ok) clearAuthFailure(request.key, embedMode || !!token);
		return response;
	});
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/route-chunk-recovery.js
var INSTALL_KEY = "__agentNativeRouteChunkRecoveryInstalled";
var INTENDED_NAV_MAX_AGE_MS = 15e3;
var STALE_CHUNK_RELOAD_AT_KEY = "__agentNativeStaleChunkReloadAt";
var STALE_CHUNK_RELOAD_COOLDOWN_MS = 1e4;
function createRouteChunkRecoveryState() {
	return {
		intendedHref: null,
		intendedAt: 0,
		routeModuleFailureAt: 0,
		recoveryHref: null,
		recovering: false
	};
}
function isRouteModuleReloadMessage(value) {
	return typeof value === "string" && /Error loading route module `[^`]+`, reloading page\.\.\./.test(value);
}
function isDynamicImportFailureMessage(value) {
	if (typeof value !== "string") return false;
	const message = value.toLowerCase();
	return message.includes("failed to fetch dynamically imported module") || message.includes("error loading dynamically imported module") || message.includes("importing a module script failed") || message.includes("failed to fetch dynamically imported");
}
function rememberIntendedNavigation(state, href, now = Date.now()) {
	state.intendedHref = href;
	state.intendedAt = now;
}
function getFreshIntendedNavigation(state, currentHref, now = Date.now()) {
	if (!state.intendedHref) return null;
	if (now - state.intendedAt > INTENDED_NAV_MAX_AGE_MS) return null;
	if (state.intendedHref === currentHref) return null;
	return state.intendedHref;
}
function anchorFromTarget(target) {
	let node = target;
	while (node) {
		if (node.tagName?.toUpperCase() === "A" && typeof node.href === "string") return node;
		node = node.parentElement;
	}
	return null;
}
function sameOriginHref(win, href) {
	try {
		const url = new URL(href, win.location.href);
		return url.origin === win.location.origin ? url.href : null;
	} catch {
		return null;
	}
}
function intendedHrefFromClick(win, event) {
	if (event.defaultPrevented) return null;
	if (event.button !== 0) return null;
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
	const anchor = anchorFromTarget(event.target);
	if (!anchor) return null;
	if (anchor.hasAttribute("download")) return null;
	const target = anchor.getAttribute("target");
	if (target && target !== "_self") return null;
	return sameOriginHref(win, anchor.href);
}
function hardNavigate(win, href) {
	try {
		win.location.assign(href);
	} catch {
		win.location.href = href;
	}
}
function isAgentNativeDesktop(win) {
	return /AgentNativeDesktop/i.test(win.navigator?.userAgent || "");
}
function hasViteDevRecovery(win) {
	if (win["__agentNativeViteDevRecoveryInstalled"] === true) return true;
	try {
		const hostname = win.location.hostname;
		if (!(hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "::1")) return false;
		return true;
	} catch (error) {
		return;
	}
}
function isViteOptimizerFailureMessage(message) {
	return message.includes("Outdated Optimize Dep") || message.includes("Optimize Deps Processing Error") || message.includes("/node_modules/.vite/deps/") || message.includes("/@id/") || message.includes("/@fs/");
}
function readStaleChunkReloadAt(win) {
	try {
		const raw = win.sessionStorage?.getItem(STALE_CHUNK_RELOAD_AT_KEY);
		const parsed = raw == null ? NaN : Number(raw);
		if (Number.isFinite(parsed)) return parsed;
	} catch {}
	const mem = win[STALE_CHUNK_RELOAD_AT_KEY];
	return typeof mem === "number" ? mem : 0;
}
function markStaleChunkReload(win, now) {
	win[STALE_CHUNK_RELOAD_AT_KEY] = now;
	try {
		win.sessionStorage?.setItem(STALE_CHUNK_RELOAD_AT_KEY, String(now));
	} catch {}
}
/**
* Last resort when a stale lazy chunk fails to load for the *current* route —
* an old tab whose hashed chunk filenames no longer exist after a deploy — and
* there is no fresh cross-route navigation to recover to. A single guarded
* reload pulls a fresh index.html plus chunk manifest. A sessionStorage cooldown
* prevents a reload loop when the chunk is genuinely unreachable (e.g. offline),
* letting the error surface to Sentry as before in that case.
*
* Returns true when a reload was triggered.
*/
function reloadForStaleChunk(win = typeof window === "undefined" ? void 0 : window, now = Date.now()) {
	if (!win?.location) return false;
	if (isAgentNativeDesktop(win)) return false;
	const lastReloadAt = readStaleChunkReloadAt(win);
	if (lastReloadAt > 0 && now - lastReloadAt <= STALE_CHUNK_RELOAD_COOLDOWN_MS) return false;
	markStaleChunkReload(win, now);
	hardNavigate(win, win.location.href);
	return true;
}
/**
* Recover when a caught error (e.g. a `React.lazy` rejection surfaced to an
* error boundary) is a stale dynamic-import failure. No-op and returns false
* for any other error so callers can fall through to their normal handling.
*/
function recoverFromStaleChunkError(error, win = typeof window === "undefined" ? void 0 : window) {
	if (!isDynamicImportFailureMessage(error instanceof Error ? error.message : String(error ?? ""))) return false;
	return reloadForStaleChunk(win);
}
function recoverToIntendedNavigation(win, state) {
	const target = getFreshIntendedNavigation(state, win.location.href);
	const sameCurrentTarget = isAgentNativeDesktop(win) && !target && state.intendedHref === win.location.href && Date.now() - state.intendedAt <= INTENDED_NAV_MAX_AGE_MS ? state.intendedHref : null;
	const recoveryTarget = target ?? sameCurrentTarget;
	if (!recoveryTarget) return false;
	state.recovering = true;
	state.recoveryHref = recoveryTarget;
	if (isAgentNativeDesktop(win)) {
		hardNavigate(win, recoveryTarget);
		return true;
	}
	try {
		win.history.replaceState(win.history.state, "", recoveryTarget);
	} catch {}
	hardNavigate(win, recoveryTarget);
	return true;
}
function recoverFromDynamicImportFailure(win, state, message) {
	if (!isDynamicImportFailureMessage(message)) return false;
	if (hasViteDevRecovery(win) === true && isViteOptimizerFailureMessage(message)) return false;
	state.routeModuleFailureAt = Date.now();
	if (recoverToIntendedNavigation(win, state)) return true;
	return reloadForStaleChunk(win);
}
function patchHistoryMethod(win, state, method) {
	const original = win.history[method];
	win.history[method] = function patchedHistoryMethod(...args) {
		if (typeof args[2] === "string" || args[2] instanceof URL) {
			const href = sameOriginHref(win, String(args[2]));
			if (href) rememberIntendedNavigation(state, href);
		}
		return original.apply(this, args);
	};
}
function patchReload(win, state) {
	const originalReload = win.location.reload.bind(win.location);
	const patchedReload = function patchedReload() {
		if (Date.now() - state.routeModuleFailureAt <= 1e3) {
			if (state.recovering) return;
			if (hasViteDevRecovery(win) !== true) {
				if (recoverToIntendedNavigation(win, state)) return;
			}
			if (isAgentNativeDesktop(win)) return;
			reloadForStaleChunk(win);
			return;
		}
		originalReload();
	};
	try {
		Object.defineProperty(win.location, "reload", {
			configurable: true,
			value: patchedReload
		});
	} catch {
		try {
			win.location.reload = patchedReload;
		} catch {}
	}
}
function installRouteChunkRecovery(win = typeof window === "undefined" ? void 0 : window) {
	const consoleRef = win?.console;
	if (!win?.document || !win.location || !win.history || typeof win.addEventListener !== "function" || !consoleRef) return;
	const installedTarget = win;
	if (installedTarget[INSTALL_KEY]) return;
	installedTarget[INSTALL_KEY] = true;
	const state = createRouteChunkRecoveryState();
	win.document.addEventListener("click", (event) => {
		const href = intendedHrefFromClick(win, event);
		if (href) rememberIntendedNavigation(state, href);
	}, true);
	patchHistoryMethod(win, state, "pushState");
	patchHistoryMethod(win, state, "replaceState");
	patchReload(win, state);
	win.addEventListener("unhandledrejection", (event) => {
		const reason = event.reason;
		const message = String(reason?.message || reason || "");
		if (recoverFromDynamicImportFailure(win, state, message)) event.preventDefault();
	});
	win.addEventListener("error", (event) => {
		const errorEvent = event;
		const message = String(errorEvent.error?.message || errorEvent.message || "");
		if (recoverFromDynamicImportFailure(win, state, message)) event.preventDefault();
	});
	const originalError = consoleRef.error.bind(consoleRef);
	try {
		consoleRef.error = (...args) => {
			if (args.some(isRouteModuleReloadMessage)) {
				state.routeModuleFailureAt = Date.now();
				if (hasViteDevRecovery(win) !== true) recoverToIntendedNavigation(win, state);
			}
			originalError(...args);
		};
	} catch {}
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/client-bootstrap.js
function initializeAgentNativeClient() {
	ensureEmbedAuthFetchInterceptor();
	installRouteChunkRecovery();
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/api-path.js
var FRAMEWORK_ROUTE_PREFIX = "/_agent-native";
function normalizeBasePath(value) {
	if (!value || value === "/") return "";
	const trimmed = value.trim();
	if (!trimmed || trimmed === "/") return "";
	return `/${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}
function configuredBasePath() {
	const env = clientEnv();
	const value = env?.VITE_APP_BASE_PATH ?? env?.APP_BASE_PATH ?? env?.BASE_URL;
	return typeof value === "string" ? normalizeBasePath(value) : "";
}
function clientEnv() {
	const importMetaEnv = {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"SSR": true
	};
	const processEnv = globalThis.process?.env;
	if (importMetaEnv && processEnv) return {
		...processEnv,
		...importMetaEnv
	};
	return importMetaEnv ?? processEnv;
}
function pathDerivedBasePath() {
	if (typeof window === "undefined") return "";
	const pathname = window.location.pathname;
	const markerIndex = pathname.indexOf(FRAMEWORK_ROUTE_PREFIX);
	if (markerIndex <= 0) return "";
	return normalizeBasePath(pathname.slice(0, markerIndex));
}
function pathMatchesBasePath(pathname, basePath) {
	return pathname === basePath || pathname.startsWith(`${basePath}/`);
}
function isWorkspaceRuntime() {
	const env = clientEnv();
	return typeof window !== "undefined" && window.__AGENT_NATIVE_CONFIG__?.workspaceRuntime === true || isTruthyRuntimeValue(env?.VITE_AGENT_NATIVE_WORKSPACE) || isTruthyRuntimeValue(env?.AGENT_NATIVE_WORKSPACE) || typeof env?.VITE_AGENT_NATIVE_WORKSPACE_APPS_JSON === "string";
}
function workspacePathBasePath() {
	if (typeof window === "undefined" || !isWorkspaceRuntime()) return "";
	const segment = window.location.pathname.split("/").find(Boolean);
	if (!segment || segment === "_agent-native" || segment === "api") return "";
	const basePath = normalizeBasePath(segment);
	const mounts = workspaceAppMountPaths();
	if (mounts && !mounts.has(basePath)) return "";
	return basePath;
}
function externalEmbedTargetBasePath() {
	if (typeof window === "undefined") return "";
	const target = window.__AGENT_NATIVE_EXTERNAL_EMBED?.target;
	if (typeof target !== "string" || !target.startsWith("/")) return "";
	try {
		const url = new URL(target, "http://agent-native.invalid");
		const markerIndex = url.pathname.indexOf(FRAMEWORK_ROUTE_PREFIX);
		if (markerIndex > 0) return normalizeBasePath(url.pathname.slice(0, markerIndex));
		if (isWorkspaceRuntime()) {
			const segment = url.pathname.split("/").find(Boolean);
			if (segment && segment !== "_agent-native" && segment !== "api") return normalizeBasePath(segment);
		}
	} catch {
		return "";
	}
	return "";
}
function appBasePath() {
	initializeAgentNativeClient();
	const externalEmbed = externalEmbedTargetBasePath();
	if (externalEmbed) return externalEmbed;
	const configured = configuredBasePath();
	const derived = pathDerivedBasePath();
	if (!configured) return derived || workspacePathBasePath();
	if (typeof window === "undefined") return configured;
	const pathname = window.location.pathname;
	if (pathMatchesBasePath(pathname, configured)) return configured;
	return derived || workspacePathBasePath() || configured;
}
function workspaceAppMountPaths() {
	const raw = clientEnv()?.VITE_AGENT_NATIVE_WORKSPACE_APPS_JSON;
	if (typeof raw !== "string" || !raw.trim()) return null;
	try {
		const parsed = JSON.parse(raw);
		const entries = Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" && "apps" in parsed ? parsed.apps : null;
		if (!Array.isArray(entries)) return null;
		const paths = entries.map((entry) => {
			if (!entry || typeof entry !== "object") return null;
			const record = entry;
			const rawPath = typeof record.path === "string" ? record.path : typeof record.id === "string" ? `/${record.id}` : null;
			return rawPath?.startsWith("/") ? normalizeBasePath(rawPath) : null;
		}).filter((path) => Boolean(path));
		return paths.length ? new Set(paths) : null;
	} catch {
		return null;
	}
}
/**
* Returns true for a same-origin path mounted at a sibling workspace app.
* React Router treats root paths as local to its basename, so these targets
* must use the browser location instead of the app-local router.
*/
function isWorkspaceAppPath(path) {
	if (typeof window === "undefined" || !path.startsWith("/")) return false;
	if (!isWorkspaceRuntime()) return false;
	const targetPath = path.split(/[?#]/, 1)[0] || "/";
	const basePath = appBasePath();
	if (!basePath) return false;
	if (targetPath === basePath || targetPath.startsWith(`${basePath}/`)) return false;
	const mounts = workspaceAppMountPaths();
	if (!mounts) return false;
	return [...mounts].some((mount) => targetPath === mount || targetPath.startsWith(`${mount}/`));
}
function appPath(path) {
	if (!path.startsWith("/")) return path;
	const basePath = appBasePath();
	if (!basePath) return path;
	if (path === basePath || path.startsWith(`${basePath}/`)) return path;
	return `${basePath}${path}`;
}
function agentNativePath(path) {
	if (!path.startsWith(FRAMEWORK_ROUTE_PREFIX)) return path;
	return appPath(path);
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/api-surface.js
/**
* Some surfaces are framed by a host and carry no agent-native session at all —
* Builder's Design tab frames a canvas that owns no design row and holds no
* credential. Every `/_agent-native/*` call from one is unauthenticated by
* construction, so the client must not make them: a 401 per poll buries real
* failures, and a write can never land.
*/
var disabledReason = null;
function agentNativeApiDisabledReason() {
	return disabledReason;
}
/**
* Thrown rather than resolved: a caller that cannot tell "no backend" from
* "empty result" reports success for work that never happened.
*/
var AgentNativeApiDisabledError = class extends Error {
	reason;
	constructor(detail) {
		const reason = disabledReason ?? "unknown surface";
		super(`agent-native API is disabled on this surface (${reason}): ${detail}`);
		this.name = "AgentNativeApiDisabledError";
		this.reason = reason;
	}
};
function assertAgentNativeApiEnabled(detail) {
	if (disabledReason) throw new AgentNativeApiDisabledError(detail);
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/client-status-requests.js
var RESULT_TTL_MS = 500;
var REQUEST_TIMEOUT_MS = 15e3;
var cache = /* @__PURE__ */ new Map();
var requests = /* @__PURE__ */ new Map();
var requestControllers = /* @__PURE__ */ new Map();
var requestGenerations = /* @__PURE__ */ new Map();
var invalidationListenersInstalled = false;
var generation = 0;
function expireClientStatusCache() {
	generation += 1;
	cache.clear();
}
function installInvalidationListeners() {
	if (invalidationListenersInstalled || typeof window === "undefined" || typeof document === "undefined") return;
	invalidationListenersInstalled = true;
	if (typeof window.addEventListener === "function") {
		window.addEventListener("focus", expireClientStatusCache);
		window.addEventListener("agent-engine:configured-changed", invalidateClientStatusRequests);
	}
	if (typeof document.addEventListener === "function") document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible") expireClientStatusCache();
	});
}
async function fetchClientStatus(path) {
	if (agentNativeApiDisabledReason()) return { state: "unavailable" };
	installInvalidationListeners();
	const url = agentNativePath(path);
	const cached = cache.get(url);
	if (cached && cached.expiresAt > Date.now()) return cached.result;
	cache.delete(url);
	const pending = requests.get(url);
	if (pending) return pending;
	const requestGeneration = generation;
	const requestUrlGeneration = requestGenerations.get(url) ?? 0;
	const controller = typeof AbortController === "undefined" ? null : new AbortController();
	let timeoutId;
	const timeout = new Promise((resolve) => {
		timeoutId = setTimeout(() => {
			controller?.abort();
			resolve({ state: "unavailable" });
		}, REQUEST_TIMEOUT_MS);
	});
	const transport = fetch(url, {
		cache: "no-store",
		credentials: "same-origin",
		...controller ? { signal: controller.signal } : {}
	}).then(async (response) => {
		if (!response.ok) return {
			state: "unavailable",
			status: response.status
		};
		try {
			return {
				state: "available",
				value: await response.json()
			};
		} catch {
			return {
				state: "unavailable",
				status: response.status
			};
		}
	}).catch(() => ({ state: "unavailable" }));
	const request = Promise.race([transport, timeout]).then((result) => {
		if (generation === requestGeneration && (requestGenerations.get(url) ?? 0) === requestUrlGeneration && result.state === "available") cache.set(url, {
			expiresAt: Date.now() + RESULT_TTL_MS,
			result
		});
		return result;
	}).finally(() => {
		if (timeoutId !== void 0) clearTimeout(timeoutId);
		if (requests.get(url) === request) requests.delete(url);
		if (requestControllers.get(url) === controller) requestControllers.delete(url);
	});
	requests.set(url, request);
	if (controller) requestControllers.set(url, controller);
	return request;
}
function invalidateClientStatusRequest(path) {
	const url = agentNativePath(path);
	requestGenerations.set(url, (requestGenerations.get(url) ?? 0) + 1);
	cache.delete(url);
	requestControllers.get(url)?.abort();
	requestControllers.delete(url);
	requests.delete(url);
}
function invalidateClientStatusRequests() {
	generation += 1;
	cache.clear();
	for (const controller of requestControllers.values()) controller.abort();
	requestControllers.clear();
	requests.clear();
}
function fetchAgentEngineStatus() {
	return fetchClientStatus("/_agent-native/agent-engine/status");
}
function fetchAuthSessionStatus() {
	return fetchClientStatus("/_agent-native/auth/session");
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/error-capture.js
/**
* First-party, Sentry-style browser error capture for the Agent-Native
* analytics SDK.
*
* Two responsibilities:
*  1. Automatic capture of uncaught exceptions (`window.onerror`) and
*     unhandled promise rejections (`unhandledrejection`).
*  2. A documented manual API — `captureException(error, context?)` and
*     `captureMessage(message, level?)` — mirroring Sentry's ergonomics.
*
* Captured exceptions are handed to a `send` callback (wired by
* `configureTracking` to the first-party analytics `/track` ingest as a
* dedicated `$exception` event) and are tagged with the current analytics
* session id + session replay id so each error links back to the recording it
* happened in. Everything here is defensive: capture must never throw back into
* the host app, so every path is wrapped and failures are swallowed.
*
* Stack parsing and fingerprinting are intentionally done authoritatively on
* the server (see the analytics template's `server/lib/error-capture.ts`); the
* client sends a compact, bounded payload (type/message/raw stack/context) and
* the server normalizes + groups it. That keeps one tested source of truth for
* grouping instead of duplicating parser logic across the wire.
*/
var MAX_MESSAGE_LENGTH = 1e3;
var MAX_STACK_LENGTH = 8e3;
var ERROR_CAPTURE_STATE_KEY = Symbol.for("agent-native.client.errorCapture");
var SECRET_KEY_FRAGMENT = "(?:authorization|cookie|set[-_]?cookie|token|secret|password|passwd|pwd|api[-_]?key|apikey|session|credential)";
var BEARER_RE = /\b(bearer|basic)\s+[a-z0-9._~+/-]+=*/gi;
var UNQUOTED_SECRET_RE = new RegExp(`(["']?)([A-Za-z0-9_$.-]*${SECRET_KEY_FRAGMENT}[A-Za-z0-9_$.-]*)\\1(\\s*[:=]\\s*)([^"',\\s;}\\]]+)`, "gi");
new RegExp(SECRET_KEY_FRAGMENT, "i");
function redactSecrets(value) {
	return value.replace(BEARER_RE, "$1 <redacted>").replace(UNQUOTED_SECRET_RE, "$1$2$1$3<redacted>");
}
function getRuntime() {
	const g = globalThis;
	if (!g[ERROR_CAPTURE_STATE_KEY]) g[ERROR_CAPTURE_STATE_KEY] = {
		installed: false,
		config: {
			send: () => {},
			captureGlobalErrors: true,
			captureUnhandledRejections: true,
			maxBreadcrumbs: 20,
			dedupeWindowMs: 3e3
		},
		breadcrumbs: [],
		recentSignatures: /* @__PURE__ */ new Map(),
		removeHandlers: null,
		navigationInstalled: false
	};
	return g[ERROR_CAPTURE_STATE_KEY];
}
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function truncate(value, max) {
	return value.length > max ? value.slice(0, max) : value;
}
function currentUrl() {
	try {
		return scrubUrl(window.location.href);
	} catch {
		return;
	}
}
/** Normalize any thrown value into a stable `{ type, message, stack }`. */
function normalizeCapturedError(error) {
	if (error instanceof Error) return {
		type: error.name || "Error",
		message: error.message || String(error),
		stack: typeof error.stack === "string" ? error.stack : void 0
	};
	if (typeof error === "string") return {
		type: "Error",
		message: error
	};
	if (error && typeof error === "object") {
		const record = error;
		const name = typeof record.name === "string" ? record.name : void 0;
		const message = typeof record.message === "string" ? record.message : void 0;
		const stack = typeof record.stack === "string" ? record.stack : void 0;
		if (name || message || stack) return {
			type: name || "Error",
			message: message || safeStringify(error),
			stack
		};
		return {
			type: "Error",
			message: safeStringify(error)
		};
	}
	return {
		type: "Error",
		message: String(error)
	};
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function firstStackLine(stack) {
	if (!stack) return "";
	const lines = stack.split("\n").map((line) => line.trim());
	return lines.find((line) => line.startsWith("at ") || /:\d+:\d+/.test(line)) ?? lines[1] ?? "";
}
/** Cheap client-side signature used only for local dedupe. */
function signatureOf(type, message, stack) {
	return `${type}|${message}|${firstStackLine(stack)}`;
}
function normalizeGlobalErrorEvent(event) {
	const error = event?.error;
	const normalized = error ? normalizeCapturedError(error) : {
		type: "Error",
		message: String(event?.message ?? "Uncaught error")
	};
	if (!normalized.stack && event?.filename) {
		const line = event.lineno ?? 0;
		const col = event.colno ?? 0;
		normalized.stack = `at ${event.filename}:${line}:${col}`;
	}
	return normalized;
}
function shouldIgnoreAutoCapturedError(normalized) {
	const message = (normalized.message || "").trim();
	const stack = normalized.stack || "";
	if (/^ResizeObserver loop (?:limit exceeded|completed with undelivered notifications\.?)$/i.test(message)) return true;
	if (!stack && isDynamicImportFailureMessage(message)) return true;
	if (normalized.type === "InvalidStateError" && /^Transition was aborted because of invalid state$/i.test(message)) return true;
	if (/^This script should only be loaded in a browser extension\.?$/i.test(message)) return true;
	if ((/\b(?:chrome|moz|safari|webkit)-extension:\/\//i.test(stack) || /\binjectScriptAdjust\.js\b/i.test(stack)) && /^(?:TypeError:\s*)?Failed to fetch(?:\s*\([^)]*\))?$/i.test(message)) return true;
	return false;
}
function shouldDedupe(runtime, signature) {
	const now = Date.now();
	const windowMs = runtime.config.dedupeWindowMs;
	if (runtime.recentSignatures.size > 200) {
		for (const [key, ts] of runtime.recentSignatures) if (now - ts > windowMs) runtime.recentSignatures.delete(key);
	}
	const last = runtime.recentSignatures.get(signature);
	runtime.recentSignatures.set(signature, now);
	return last !== void 0 && now - last < windowMs;
}
/** Append a privacy-safe breadcrumb to the bounded ring buffer. */
function addErrorBreadcrumb(breadcrumb) {
	try {
		const runtime = getRuntime();
		runtime.breadcrumbs.push({
			timestamp: nowIso(),
			category: truncate(breadcrumb.category, 60),
			message: truncate(redactSecrets(breadcrumb.message), 300),
			...breadcrumb.level ? { level: breadcrumb.level } : {}
		});
		const max = runtime.config.maxBreadcrumbs;
		if (runtime.breadcrumbs.length > max) runtime.breadcrumbs.splice(0, runtime.breadcrumbs.length - max);
	} catch {}
}
function snapshotBreadcrumbs(runtime) {
	return runtime.breadcrumbs.slice(-runtime.config.maxBreadcrumbs);
}
function installNavigationBreadcrumbs(runtime) {
	if (runtime.navigationInstalled || typeof window === "undefined") return;
	runtime.navigationInstalled = true;
	const record = (navType) => {
		try {
			addErrorBreadcrumb({
				category: "navigation",
				message: `${navType} ${scrubUrl(window.location.href) ?? window.location.pathname}`
			});
		} catch {}
	};
	try {
		const originalPush = window.history.pushState.bind(window.history);
		const originalReplace = window.history.replaceState.bind(window.history);
		window.history.pushState = function pushState(...args) {
			const result = originalPush.apply(this, args);
			record("navigate");
			return result;
		};
		window.history.replaceState = function replaceState(...args) {
			const result = originalReplace.apply(this, args);
			record("replace");
			return result;
		};
		window.addEventListener("popstate", () => record("popstate"));
		record("load");
	} catch {}
}
function buildEvent(runtime, normalized, options) {
	const context = runtime.config.getSessionContext?.() ?? {};
	const stack = normalized.stack ? truncate(redactSecrets(normalized.stack), MAX_STACK_LENGTH) : void 0;
	return {
		type: truncate(normalized.type || "Error", 200),
		message: truncate(redactSecrets(normalized.message || ""), MAX_MESSAGE_LENGTH),
		...stack ? { stack } : {},
		handled: options.handled,
		level: options.level,
		occurredAt: nowIso(),
		...currentUrl() ? { url: currentUrl() } : {},
		...runtime.config.release ? { release: runtime.config.release } : {},
		...runtime.config.environment ? { environment: runtime.config.environment } : {},
		...context.sessionId ? { sessionId: context.sessionId } : {},
		...context.replayId ? { sessionReplayId: context.replayId } : {},
		...context.anonymousId ? { anonymousId: context.anonymousId } : {},
		breadcrumbs: snapshotBreadcrumbs(runtime),
		...options.tags ? { tags: options.tags } : {},
		...options.extra ? { extra: options.extra } : {}
	};
}
function dispatch(runtime, event, emitToReplay) {
	if (shouldDedupe(runtime, signatureOf(event.type, event.message, event.stack))) return;
	try {
		runtime.config.send(event);
	} catch {}
	if (emitToReplay) try {
		runtime.config.emitReplayEvent?.(event);
	} catch {}
	addErrorBreadcrumb({
		category: "exception",
		message: `${event.type}: ${event.message}`,
		level: event.level
	});
}
/**
* Install auto-capture + wire the transport. Idempotent: re-invoking updates
* the config (and (re)installs global handlers) without duplicating listeners.
* Returns a disposer that removes the global handlers.
*/
function installErrorCapture(options) {
	const runtime = getRuntime();
	runtime.config = {
		...runtime.config,
		...options,
		captureGlobalErrors: options.captureGlobalErrors ?? true,
		captureUnhandledRejections: options.captureUnhandledRejections ?? true,
		maxBreadcrumbs: options.maxBreadcrumbs ?? runtime.config.maxBreadcrumbs,
		dedupeWindowMs: options.dedupeWindowMs ?? runtime.config.dedupeWindowMs
	};
	if (typeof window === "undefined") return () => {};
	installNavigationBreadcrumbs(runtime);
	runtime.removeHandlers?.();
	runtime.removeHandlers = null;
	const removers = [];
	if (runtime.config.captureGlobalErrors) {
		const onError = (event) => {
			try {
				if (event.defaultPrevented) return;
				const normalized = normalizeGlobalErrorEvent(event);
				if (shouldIgnoreAutoCapturedError(normalized)) return;
				dispatch(runtime, buildEvent(runtime, normalized, {
					handled: false,
					level: "error"
				}), false);
			} catch {}
		};
		window.addEventListener("error", onError);
		removers.push(() => window.removeEventListener("error", onError));
	}
	if (runtime.config.captureUnhandledRejections) {
		const onRejection = (event) => {
			try {
				if (event.defaultPrevented) return;
				const reason = event?.reason;
				const normalized = normalizeCapturedError(reason);
				if (!normalized.type || normalized.type === "Error") normalized.type = "UnhandledRejection";
				if (shouldIgnoreAutoCapturedError(normalized)) return;
				dispatch(runtime, buildEvent(runtime, normalized, {
					handled: false,
					level: "error"
				}), false);
			} catch {}
		};
		window.addEventListener("unhandledrejection", onRejection);
		removers.push(() => window.removeEventListener("unhandledrejection", onRejection));
	}
	runtime.installed = true;
	runtime.removeHandlers = () => {
		for (const remove of removers) try {
			remove();
		} catch {}
		runtime.removeHandlers = null;
		runtime.installed = false;
	};
	return runtime.removeHandlers;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/analytics.js
var _getDefaultProps = null;
var _configuredAnalyticsClientPlatform = null;
var _agentNativeAnalyticsPublicKey = null;
var _agentNativeAnalyticsEndpoint = null;
var _sentryInitialized = false;
var _sentryModule = null;
var _sentryLoadPromise = null;
var _pendingSentryCaptures = [];
var _llmConnectionStatus = null;
var _llmConnectionRefresh = null;
var _llmConnectionRefreshInstalled = false;
var _llmConnectionBootRefresh = null;
var _trackingIdentity = null;
var _trackingIdentityResolved = false;
var _trackingSessionRefresh = null;
var _trackingSessionRefreshInstalled = false;
var _sessionReplayOptions = null;
var _sessionReplayIdentitySnapshot = null;
var _sessionReplayStartPromise = null;
var _errorCaptureInstalled = false;
var _errorCaptureDisposer = null;
var _sessionReplayModuleForCapture = null;
var _trackingContentCaptureEnabled = true;
var _contentCaptureForPath = null;
var _pendingSentryUser = void 0;
var _pendingSentryOrgId = void 0;
var AGENT_NATIVE_ANALYTICS_DEFAULT_ENDPOINT = "https://analytics.agent-native.com/track";
/**
* Dedicated first-party analytics event name for captured exceptions. The
* analytics server ingest forks events with this name into the error-capture
* tables (error_issues / error_events) while still recording them in
* analytics_events for alerting. Keep in sync with the template server ingest.
*/
var AGENT_NATIVE_EXCEPTION_EVENT_NAME = "$exception";
var PAGEVIEW_TRACKING_STATE_KEY = Symbol.for("agent-native.client.pageviewTracking");
var APP_ENTRY_TRACKING_STATE_KEY = Symbol.for("agent-native.client.appEntryTracking");
var LLM_CONNECTION_STORAGE_KEY = "agent-native.llm_connection_status";
var LLM_CONNECTION_CACHE_TTL_MS = 300 * 1e3;
var FIRST_TOUCH_STORAGE_KEY = "an_attribution";
var FIRST_TOUCH_COOKIE_NAME = "an_ft";
var APP_ENTRY_STORAGE_KEY = "agent-native.app_entry";
var APP_LAST_ENTRY_STORAGE_KEY_PREFIX = "agent-native.app_last_entry";
var RETURN_USAGE_THRESHOLD_MS = 10080 * 60 * 1e3;
var FIRST_TOUCH_COOKIE_MAX_AGE_SECONDS = 2592e3;
var FIRST_TOUCH_MAX_FIELD_LENGTH = 120;
var FIRST_TOUCH_MAX_COOKIE_BYTES = 1500;
var FIRST_TOUCH_QUERY_FIELDS = [
	"ref",
	"via",
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_content",
	"utm_term"
];
var _firstTouchCaptured = false;
function safeStorageGet(key) {
	try {
		return window.localStorage.getItem(key);
	} catch {
		return null;
	}
}
function safeStorageSet(key, value) {
	try {
		window.localStorage.setItem(key, value);
	} catch {}
}
function readCachedLlmConnectionStatus() {
	if (typeof window === "undefined") return null;
	const raw = safeStorageGet(LLM_CONNECTION_STORAGE_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (typeof parsed.cachedAt !== "number" || Date.now() - parsed.cachedAt > LLM_CONNECTION_CACHE_TTL_MS) return null;
		return {
			configured: parsed.configured,
			engine: parsed.engine,
			model: parsed.model,
			source: parsed.source,
			envVar: parsed.envVar
		};
	} catch {
		return null;
	}
}
function cacheLlmConnectionStatus(status) {
	if (typeof window === "undefined") return;
	safeStorageSet(LLM_CONNECTION_STORAGE_KEY, JSON.stringify({
		...status,
		cachedAt: Date.now()
	}));
}
function normalizeAgentEngineStatus(data) {
	const value = data;
	if (!value || value.configured !== true) return { configured: false };
	return {
		configured: true,
		engine: typeof value.engine === "string" ? value.engine : null,
		model: typeof value.model === "string" ? value.model : null,
		source: typeof value.source === "string" ? value.source : null,
		envVar: typeof value.envVar === "string" ? value.envVar : null
	};
}
function refreshLlmConnectionStatus() {
	if (typeof window === "undefined" || typeof fetch !== "function") return Promise.resolve();
	if (_llmConnectionRefresh) return _llmConnectionRefresh;
	_llmConnectionRefresh = fetchAgentEngineStatus().then((result) => {
		if (result.state === "available") {
			_llmConnectionStatus = normalizeAgentEngineStatus(result.value);
			cacheLlmConnectionStatus(_llmConnectionStatus);
		} else if (!_llmConnectionStatus) _llmConnectionStatus = readCachedLlmConnectionStatus();
	}).finally(() => {
		_llmConnectionRefresh = null;
	});
	return _llmConnectionRefresh;
}
function installLlmConnectionRefresh() {
	if (typeof window === "undefined" || _llmConnectionRefreshInstalled) return;
	_llmConnectionRefreshInstalled = true;
	_llmConnectionStatus = readCachedLlmConnectionStatus();
	_llmConnectionBootRefresh = new Promise((resolve) => {
		scheduleAfterPaint(() => {
			Promise.race([refreshLlmConnectionStatus(), new Promise((resolve) => window.setTimeout(resolve, 250))]).finally(resolve);
		});
	});
	window.addEventListener("focus", () => {
		refreshLlmConnectionStatus();
	});
	window.addEventListener("agent-engine:configured-changed", () => {
		refreshLlmConnectionStatus();
	});
}
function readTrackingString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function isQaTrackingIdentity(identity) {
	return Boolean(identity && (isQaTestEmail(identity.userId) || isQaTestEmail(identity.userEmail)));
}
function isQaTrackingUser(user) {
	return Boolean(user && (isQaTestEmail(user.id) || isQaTestEmail(user.email)));
}
function stopSessionReplayForAuthClear(previousIdentity) {
	if (!_sessionReplayOptions?.requireSignedInUser) {
		_sessionReplayIdentitySnapshot = null;
		return;
	}
	if (!previousIdentity?.userEmail) return;
	_sessionReplayIdentitySnapshot = previousIdentity;
	import("./session-replay-C2ktCnaf.js").then((n) => n.t).then((mod) => mod.stopSessionReplay("auth-cleared")).catch(() => {}).finally(() => {
		if (_sessionReplayIdentitySnapshot === previousIdentity) _sessionReplayIdentitySnapshot = null;
	});
}
function clearTrackingIdentity() {
	stopSessionReplayForAuthClear(_trackingIdentity);
	_trackingIdentity = null;
}
function setTrackingIdentityFromSession(data) {
	const session = data;
	if (!session || typeof session !== "object" || session.error) {
		clearTrackingIdentity();
		return;
	}
	const email = readTrackingString(session.email);
	const authUserId = readTrackingString(session.userId);
	const userId = email || authUserId;
	if (!userId) {
		clearTrackingIdentity();
		return;
	}
	const userName = readTrackingString(session.name);
	_trackingIdentity = {
		userId,
		...email ? { userEmail: email } : {},
		...userName ? { userName } : {},
		orgId: readTrackingString(session.orgId) ?? null
	};
}
function refreshTrackingAuthSession() {
	if (typeof window === "undefined" || typeof fetch !== "function") {
		_trackingIdentityResolved = true;
		return Promise.resolve();
	}
	if (_trackingSessionRefresh) return _trackingSessionRefresh;
	_trackingSessionRefresh = fetchAuthSessionStatus().then((result) => {
		if (result.state === "available") setTrackingIdentityFromSession(result.value);
	}).finally(() => {
		_trackingIdentityResolved = true;
		_trackingSessionRefresh = null;
	});
	return _trackingSessionRefresh;
}
function installTrackingAuthSessionRefresh() {
	if (typeof window === "undefined" || _trackingSessionRefreshInstalled) return;
	_trackingSessionRefreshInstalled = true;
	refreshTrackingAuthSession();
	window.addEventListener("focus", () => {
		refreshTrackingAuthSession();
	});
}
function applyTrackingIdentity(properties, identity = _trackingIdentity) {
	if (!identity) return properties;
	let next = properties;
	const assign = (key, value) => {
		if (value !== void 0 && value !== null && next[key] === void 0) {
			if (next === properties) next = { ...properties };
			next[key] = value;
		}
	};
	assign("userId", identity.userId);
	assign("userEmail", identity.userEmail);
	assign("userName", identity.userName);
	assign("orgId", identity.orgId);
	return next;
}
/**
* The signed-in user id used to attribute browser events, or `undefined` when
* signed out. Same value the server attributes its events to (email, falling
* back to the auth user id), so a person is one person across both.
*/
function getTrackingUserId() {
	return _trackingIdentity?.userId;
}
function getAnalyticsIdentityKey() {
	return getTrackingUserId() || getOrCreateAnonymousId();
}
function getOrCreateAnonymousId() {
	return getOrCreateAnalyticsAnonymousId();
}
function getOrCreateSessionId() {
	return getOrCreateAnalyticsSessionId();
}
function truncateFirstTouchField(value) {
	if (!value) return "";
	const trimmed = value.trim();
	if (!trimmed) return "";
	return trimmed.slice(0, FIRST_TOUCH_MAX_FIELD_LENGTH);
}
/**
* Extract just the host of a referrer URL — never the full URL or query
* string (those can carry tokens). Returns "" when there's no usable host or
* the referrer is same-origin (a same-site navigation isn't a referral).
*/
function scrubReferrerHost(referrer) {
	if (!referrer) return "";
	try {
		const host = new URL(referrer).host;
		if (!host) return "";
		if (typeof window !== "undefined" && host.toLowerCase() === window.location.host.toLowerCase()) return "";
		return truncateFirstTouchField(host);
	} catch {
		return "";
	}
}
function buildFirstTouchAttribution() {
	const attribution = {};
	let params = null;
	try {
		params = new URLSearchParams(window.location.search);
	} catch {
		params = null;
	}
	if (params) for (const field of FIRST_TOUCH_QUERY_FIELDS) {
		const value = truncateFirstTouchField(params.get(field));
		if (value) attribution[field] = value;
	}
	const landingPath = truncateFirstTouchField(window.location.pathname);
	if (landingPath) attribution.landing_path = landingPath;
	const landingReferrer = typeof document !== "undefined" ? scrubReferrerHost(document.referrer) : "";
	if (landingReferrer) attribution.landing_referrer = landingReferrer;
	attribution.landed_at = (/* @__PURE__ */ new Date()).toISOString();
	return attribution;
}
function readFirstTouchCookie() {
	if (typeof document === "undefined") return null;
	try {
		const cookies = document.cookie ? document.cookie.split(";") : [];
		for (const part of cookies) {
			const eq = part.indexOf("=");
			if (eq === -1) continue;
			if (part.slice(0, eq).trim() === FIRST_TOUCH_COOKIE_NAME) return part.slice(eq + 1).trim();
		}
	} catch {}
	return null;
}
function writeFirstTouchCookie(encodedValue) {
	if (typeof document === "undefined") return;
	const cookie = `${FIRST_TOUCH_COOKIE_NAME}=${encodedValue}; path=/; max-age=${FIRST_TOUCH_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
	if (cookie.length > FIRST_TOUCH_MAX_COOKIE_BYTES) return;
	try {
		document.cookie = cookie;
	} catch {}
}
/**
* Capture the visitor's first-touch referral attribution exactly once. Reads
* the current URL query params + landing info and, IF no attribution is
* already stored (first-write-wins), persists it to both `localStorage`
* (`an_attribution`) and the first-party `an_ft` cookie. Fully defensive and
* SSR-safe — any failure is swallowed so it can never break app boot.
*/
function captureFirstTouchAttribution() {
	if (_firstTouchCaptured) return;
	_firstTouchCaptured = true;
	if (typeof window === "undefined") return;
	try {
		const existing = safeStorageGet(FIRST_TOUCH_STORAGE_KEY);
		if (existing) {
			if (!readFirstTouchCookie()) try {
				writeFirstTouchCookie(encodeURIComponent(existing));
			} catch {}
			return;
		}
		const attribution = buildFirstTouchAttribution();
		const json = JSON.stringify(attribution);
		safeStorageSet(FIRST_TOUCH_STORAGE_KEY, json);
		writeFirstTouchCookie(encodeURIComponent(json));
	} catch {}
}
/**
* Return the parsed first-touch referral attribution captured for this
* visitor, or `null` when none is stored. Reads from `localStorage`
* (`an_attribution`). SSR-safe and defensive.
*/
function getFirstTouchAttribution() {
	if (typeof window === "undefined") return null;
	try {
		const raw = safeStorageGet(FIRST_TOUCH_STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
		return parsed;
	} catch {
		return null;
	}
}
function isLocalAnalyticsHostname(hostname) {
	const h = (hostname || "").toLowerCase();
	return h === "localhost" || h === "127.0.0.1" || h === "::1" || h === "[::1]" || h.endsWith(".localhost") || h.endsWith(".local");
}
function isSyntheticBrowserTraffic() {
	return typeof window !== "undefined" && isSyntheticTrafficValue(window.__AGENT_NATIVE_SYNTHETIC_TRAFFIC__);
}
function ensureAmplitude() {
	if (isSyntheticBrowserTraffic()) return false;
	return false;
}
function hasBrowserTrackingDestination() {
	const env = {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"SSR": true
	};
	return Boolean(_agentNativeAnalyticsPublicKey || window.__AGENT_NATIVE_CONFIG__?.agentNativeAnalyticsPublicKey || env.VITE_AGENT_NATIVE_ANALYTICS_PUBLIC_KEY || env.VITE_AMPLITUDE_API_KEY);
}
function hasOnlySourcelessFrames(value) {
	const frames = value.stacktrace?.frames ?? [];
	return frames.length === 0 || frames.every((frame) => {
		const filename = String(frame.filename ?? frame.abs_path ?? "").trim().toLowerCase();
		return !String(frame.function ?? "").trim() && (!filename || filename === "undefined" || filename === "<anonymous>");
	});
}
function isAgentNativeDocsUrl(url) {
	if (!url) return false;
	try {
		const parsed = new URL(url);
		return parsed.hostname === "www.agent-native.com" || parsed.hostname === "agent-native.com";
	} catch {
		return false;
	}
}
function isSessionReplayUrl(url) {
	if (!url) return false;
	try {
		const parsed = new URL(url);
		return /^\/sessions\/[^/]+\/?$/.test(parsed.pathname);
	} catch {
		return false;
	}
}
function shouldDropBrowserSentryNoise(event) {
	const exceptionValues = event.exception?.values ?? [];
	const taggedUrl = typeof event.tags?.url === "string" ? event.tags.url : void 0;
	const requestUrl = (event.request?.url ?? taggedUrl ?? "").toLowerCase();
	const isDocsPage = isAgentNativeDocsUrl(requestUrl);
	if (exceptionValues.some((value) => isDynamicImportFailureMessage(`${value.type ?? ""}: ${value.value ?? ""}`))) return true;
	if (event.tags?.context === "agent-native-chat" && event.tags?.errorCode === "run_timeout" && event.tags?.reconnectTimedOut === "false" && event.tags?.reconnectTerminalReason === "run_timeout") return true;
	if (isSessionReplayUrl(requestUrl) && exceptionValues.some((value) => {
		const exceptionValue = String(value.value ?? "").trim().toLowerCase();
		return exceptionValue.includes("notallowederror: play() failed") && exceptionValue.includes("user didn't interact with the document first");
	})) return true;
	if (exceptionValues.some((value) => value.type === "AgentAutoContinueSignal")) return true;
	if (exceptionValues.some((value) => {
		const exceptionType = String(value.type ?? "").trim().toLowerCase();
		const exceptionValue = String(value.value ?? "").trim().toLowerCase();
		return exceptionType === "unauthorizederror" || exceptionType === "unauthenticatederror" || exceptionValue === "unauthorized" || exceptionValue === "unauthenticated";
	})) return true;
	if (exceptionValues.some((value) => {
		const exceptionType = String(value.type ?? "").trim().toLowerCase();
		const exceptionValue = String(value.value ?? "").trim().toLowerCase();
		if (exceptionType !== "referenceerror" || !exceptionValue.includes("emptyranges")) return false;
		return hasOnlySourcelessFrames(value);
	})) return true;
	if (isDocsPage && exceptionValues.some((value) => {
		return String(value.value ?? "").toLowerCase().includes("window.webkit.messagehandlers.scrolleventhandler.postmessage");
	})) return true;
	if (isDocsPage && exceptionValues.some((value) => {
		const exceptionType = String(value.type ?? "").trim().toLowerCase();
		const exceptionValue = String(value.value ?? "").trim().toLowerCase();
		return exceptionType === "rangeerror" && exceptionValue.includes("maximum call stack") && hasOnlySourcelessFrames(value);
	})) return true;
	if (exceptionValues.some((value) => {
		const exceptionType = String(value.type ?? "").trim().toLowerCase();
		const exceptionValue = String(value.value ?? "").trim().toLowerCase();
		return exceptionValue === "the user aborted a request." || exceptionValue === "signal is aborted without reason" || exceptionValue === "aborterror: the user aborted a request." || exceptionValue === "aborterror: signal is aborted without reason" || exceptionType === "aborterror" && (exceptionValue.includes("the user aborted a request") || exceptionValue.includes("signal is aborted without reason"));
	})) return true;
	const combined = `${exceptionValues.map((value) => `${value.type ?? ""} ${value.value ?? ""}`).join(" ").toLowerCase()} ${requestUrl} ${(event.breadcrumbs ?? []).map((crumb) => {
		const data = crumb.data;
		return [
			crumb.category,
			crumb.message,
			typeof data?.url === "string" ? data.url : ""
		].join(" ");
	}).join(" ").toLowerCase()}`;
	return combined.includes("api2.amplitude.com") && (combined.includes("failed to fetch") || combined.includes("networkerror") || combined.includes("load failed"));
}
function firstNonEmpty(...values) {
	for (const value of values) {
		const trimmed = value?.trim();
		if (trimmed) return trimmed;
	}
	return "";
}
function resolveClientSentryDsnFromKeyProject(env) {
	const key = firstNonEmpty(env.VITE_SENTRY_CLIENT_KEY);
	const projectId = firstNonEmpty(env.VITE_SENTRY_PROJECT_ID);
	const host = firstNonEmpty(env.VITE_SENTRY_INGEST_HOST);
	if (!key || !projectId || !host) return void 0;
	return `https://${key}@${host}/${projectId}`;
}
function getClientSentryDsn() {
	const env = {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"SSR": true
	};
	return env.VITE_SENTRY_CLIENT_DSN || env.VITE_SENTRY_DSN || window.__AGENT_NATIVE_CONFIG__?.sentryDsn || resolveClientSentryDsnFromKeyProject(env);
}
function resolveClientDeploymentEnvironment() {
	const env = {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"SSR": true
	};
	return window.__AGENT_NATIVE_CONFIG__?.deploymentEnvironment || injectedAgentNativeConfig().deployment?.environment || env.VITE_AGENT_NATIVE_DEPLOYMENT_ENVIRONMENT || env.VITE_SENTRY_ENVIRONMENT || window.__AGENT_NATIVE_CONFIG__?.sentryEnvironment || env.MODE || "production";
}
/**
* Must match `resolveSentryClientRelease()` in `vite/sentry-source-maps.ts`
* exactly — that's the release name uploaded source maps are attached to, so
* a mismatch here means captured events never resolve against them.
*/
function resolveClientRelease() {
	return `agent-native-client@${clientBuildId() || "development"}`;
}
function captureWithSentry(module, error, context) {
	return module.withScope((scope) => {
		if (context.tags) {
			for (const [k, v] of Object.entries(context.tags)) if (typeof v === "string") scope.setTag(k, v);
		}
		if (context.extra) {
			for (const [k, v] of Object.entries(context.extra)) if (v !== void 0) scope.setExtra(k, v);
		}
		if (context.contexts) for (const [k, v] of Object.entries(context.contexts)) scope.setContext(k, v);
		return module.captureException(error);
	});
}
function ensureSentry(loadWithoutDsn = false) {
	if (isSyntheticBrowserTraffic()) return;
	if (_sentryInitialized || _sentryLoadPromise) return;
	const dsn = getClientSentryDsn();
	if (!dsn && !loadWithoutDsn) return;
	_sentryLoadPromise = import("./dev-CeElLirX.js").then((module) => {
		_sentryModule = module;
		if (!dsn) {
			for (const pending of _pendingSentryCaptures) captureWithSentry(module, pending.error, pending.context);
			_pendingSentryCaptures = [];
			return module;
		}
		module.init({
			dsn,
			environment: resolveClientDeploymentEnvironment(),
			release: resolveClientRelease(),
			beforeSend(event) {
				if (isSyntheticBrowserTraffic()) return null;
				event.tags = {
					...event.tags,
					deployment_environment: resolveClientDeploymentEnvironment()
				};
				if (shouldDropBrowserSentryNoise(event)) return null;
				if (event.request?.url) event.request.url = scrubUrl(event.request.url);
				if (Array.isArray(event.breadcrumbs)) {
					for (const crumb of event.breadcrumbs) if (crumb && typeof crumb === "object" && "data" in crumb) {
						const data = crumb.data;
						if (data && typeof data.url === "string") data.url = scrubUrl(data.url);
						if (data && typeof data.from === "string") data.from = scrubUrl(data.from);
						if (data && typeof data.to === "string") data.to = scrubUrl(data.to);
					}
				}
				return event;
			}
		});
		module.setTag("runtime", "browser");
		module.setTag("deployment_environment", resolveClientDeploymentEnvironment());
		_sentryInitialized = true;
		if (_pendingSentryUser !== void 0) {
			module.setUser(_pendingSentryUser);
			_pendingSentryUser = void 0;
		}
		if (_pendingSentryOrgId !== void 0) {
			module.setTag("orgId", _pendingSentryOrgId);
			_pendingSentryOrgId = void 0;
		}
		for (const pending of _pendingSentryCaptures) captureWithSentry(module, pending.error, pending.context);
		_pendingSentryCaptures = [];
		return module;
	}).catch(() => null).finally(() => {
		_sentryLoadPromise = null;
	});
}
/**
* Attach the current user to Sentry events from the browser. Pass `null` to
* clear (e.g. on logout). If Sentry isn't initialized yet, the value is
* buffered and applied once `ensureSentry()` runs.
*
* Pass `orgId` to also tag events with the active organization ID — useful
* for filtering Sentry by tenant.
*/
function setSentryUser(user, orgId) {
	const previousIdentity = _trackingIdentity;
	const suppressTracking = isQaTrackingUser(user);
	let shouldRetryReplay = false;
	if (user) {
		const userId = user.email || user.id;
		if (userId) _trackingIdentity = {
			userId,
			...user.email ? { userEmail: user.email } : {},
			...user.username ? { userName: user.username } : {},
			orgId: orgId ?? null
		};
		else clearTrackingIdentity();
		shouldRetryReplay = Boolean(user.email) && !suppressTracking;
	} else clearTrackingIdentity();
	if (suppressTracking) {
		_pendingSentryCaptures = [];
		stopSessionReplayForAuthClear(previousIdentity);
	}
	_trackingIdentityResolved = true;
	if (shouldRetryReplay && _trackingContentCaptureEnabled && _sessionReplayOptions?.requireSignedInUser) startConfiguredSessionReplay(_sessionReplayOptions);
	if (_sentryInitialized && _sentryModule) {
		_sentryModule.setUser(suppressTracking ? null : user);
		if (orgId !== void 0) _sentryModule.setTag("orgId", orgId ?? null);
		return;
	}
	_pendingSentryUser = suppressTracking ? null : user;
	if (orgId !== void 0) _pendingSentryOrgId = orgId ?? null;
}
function getPageviewTrackingState() {
	const g = globalThis;
	if (!g[PAGEVIEW_TRACKING_STATE_KEY]) g[PAGEVIEW_TRACKING_STATE_KEY] = {
		installed: false,
		lastPageviewKey: null
	};
	return g[PAGEVIEW_TRACKING_STATE_KEY];
}
function getAppEntryTrackingState() {
	const g = globalThis;
	if (!g[APP_ENTRY_TRACKING_STATE_KEY]) g[APP_ENTRY_TRACKING_STATE_KEY] = { entryKeys: /* @__PURE__ */ new Set() };
	else if (!g[APP_ENTRY_TRACKING_STATE_KEY].entryKeys) {
		const entryKey = g[APP_ENTRY_TRACKING_STATE_KEY].entryKey;
		g[APP_ENTRY_TRACKING_STATE_KEY].entryKeys = entryKey ? /* @__PURE__ */ new Set([entryKey]) : /* @__PURE__ */ new Set();
	}
	return g[APP_ENTRY_TRACKING_STATE_KEY];
}
function configureTracking(options) {
	if (isSyntheticBrowserTraffic()) {
		_trackingContentCaptureEnabled = false;
		return;
	}
	if (options.clientPlatform) _configuredAnalyticsClientPlatform = options.clientPlatform;
	const publicKey = options.key || options.publicKey;
	if (publicKey) _agentNativeAnalyticsPublicKey = publicKey;
	if (options.endpoint) _agentNativeAnalyticsEndpoint = options.endpoint;
	if (options.getDefaultProps) _getDefaultProps = options.getDefaultProps;
	_contentCaptureForPath = options.contentCaptureForPath ?? null;
	_trackingContentCaptureEnabled = _contentCaptureForPath && typeof window !== "undefined" ? _contentCaptureForPath(window.location.pathname) : options.contentCapture !== false;
	if (typeof window !== "undefined") {
		ensureSentry();
		ensureAmplitude();
		captureFirstTouchAttribution();
		if (options.llmConnectionStatus !== false) installLlmConnectionRefresh();
		if (options.authSessionRefresh !== false) installTrackingAuthSessionRefresh();
		if (options.pageviewTracking !== false) installPageviewTracking();
		maybeInstallSessionReplay(options.sessionReplay, {
			endpoint: options.endpoint,
			publicKey
		}, _trackingContentCaptureEnabled);
		maybeInstallErrorCapture(options.errorCapture);
	}
}
function setTrackingContentCaptureEnabled(enabled) {
	if (_trackingContentCaptureEnabled === enabled) return;
	_trackingContentCaptureEnabled = enabled;
	if (enabled) {
		if (_sessionReplayOptions) startConfiguredSessionReplay(_sessionReplayOptions);
	} else stopSessionReplay("content-capture-disabled");
}
function syncTrackingContentCaptureForLocation() {
	if (!_contentCaptureForPath) return;
	setTrackingContentCaptureEnabled(_contentCaptureForPath(window.location.pathname));
}
/**
* Lazily load the session-replay module so error capture can read the active
* replay id and surface manual captures on the replay timeline without a
* static import (which would create an analytics <-> session-replay import
* cycle and pull the replay module into the analytics chunk eagerly).
*/
function loadSessionReplayModuleForCapture() {
	if (_sessionReplayModuleForCapture) return;
	import("./session-replay-C2ktCnaf.js").then((n) => n.t).then((mod) => {
		_sessionReplayModuleForCapture = mod;
	}).catch(() => {});
}
function errorCaptureSessionContext() {
	return {
		sessionId: getOrCreateSessionId(),
		anonymousId: getOrCreateAnonymousId(),
		replayId: _sessionReplayModuleForCapture?.getSessionReplayId?.() ?? void 0
	};
}
function exceptionEventProperties(event) {
	return {
		exceptionType: event.type,
		exceptionMessage: event.message,
		...event.stack ? { exceptionStack: event.stack } : {},
		handled: event.handled,
		level: event.level,
		occurredAt: event.occurredAt,
		...event.url ? { errorUrl: event.url } : {},
		...event.release ? { release: event.release } : {},
		...event.environment ? { environment: event.environment } : {},
		...event.sessionReplayId ? { sessionReplayId: event.sessionReplayId } : {},
		...event.breadcrumbs?.length ? { breadcrumbs: event.breadcrumbs } : {},
		...event.tags ? { exceptionTags: event.tags } : {},
		...event.extra ? { exceptionExtra: event.extra } : {}
	};
}
function amplitudeEventProperties(name, properties) {
	if (name !== "$exception") return properties;
	const { exceptionTags: _exceptionTags, exceptionExtra: _exceptionExtra, ...stableProperties } = properties;
	return stableProperties;
}
/**
* Resolve browser PostHog config, or `undefined` when error capture should not
* reach PostHog. Reads the SSR-injected shell config first, then Vite env for
* static/SPA builds that never render through the SSR handler.
*/
function posthogErrorConfig() {
	const shell = window.__AGENT_NATIVE_CONFIG__;
	if (shell?.posthogErrorTracking === false) return void 0;
	const env = {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"SSR": true
	};
	if (env?.VITE_POSTHOG_ERROR_TRACKING?.trim().toLowerCase() === "false") return;
	const key = shell?.posthogKey || env?.VITE_POSTHOG_KEY;
	if (!key) return void 0;
	return {
		key,
		host: (shell?.posthogHost || env?.VITE_POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/+$/, "")
	};
}
/**
* Send the exception straight to PostHog's event endpoint.
*
* Not relayed through `/_agent-native/track`: that route requires a resolved
* session, so every signed-out crash would be dropped without a trace.
*
* `distinct_id` uses the signed-in user id when we have one so browser events
* join the server's events for the same person; otherwise the stable anonymous
* id, which `$identify` later aliases on login.
*/
function sendPostHogExceptionEvent(event) {
	if (isSyntheticBrowserTraffic()) return;
	const config = posthogErrorConfig();
	if (!config) return;
	try {
		const session = errorCaptureSessionContext();
		const body = JSON.stringify({
			api_key: config.key,
			event: AGENT_NATIVE_EXCEPTION_EVENT_NAME,
			properties: {
				distinct_id: getTrackingUserId() || session.anonymousId || "anonymous",
				...toPostHogExceptionProperties({
					type: event.type,
					value: event.message,
					stack: event.stack,
					handled: event.handled,
					level: event.level
				}),
				$current_url: event.url,
				$session_id: session.sessionId,
				...session.replayId ? { $replay_id: session.replayId } : {},
				...event.release ? { release: event.release } : {},
				...event.environment ? { environment: event.environment } : {},
				...event.tags ? { exceptionTags: event.tags } : {},
				source: "browser"
			},
			timestamp: event.occurredAt
		});
		const endpoint = `${config.host}/i/v0/e/`;
		if (navigator.sendBeacon) {
			const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
			if (navigator.sendBeacon(endpoint, blob)) return;
		}
		fetch(endpoint, {
			method: "POST",
			body,
			keepalive: true,
			headers: { "Content-Type": "text/plain;charset=UTF-8" }
		}).catch(() => {});
	} catch {}
}
function sendExceptionEvent(event) {
	if (isSyntheticBrowserTraffic()) return;
	if (isQaTrackingIdentity(_trackingIdentity)) return;
	trackEvent(AGENT_NATIVE_EXCEPTION_EVENT_NAME, exceptionEventProperties(event));
	sendPostHogExceptionEvent(event);
}
function emitExceptionToReplay(event) {
	if (isSyntheticBrowserTraffic()) return;
	if (isQaTrackingIdentity(_trackingIdentity)) return;
	_sessionReplayModuleForCapture?.emitSessionReplayException?.({
		type: event.type,
		message: event.message,
		level: event.level,
		...event.stack ? { stack: event.stack } : {},
		...event.url ? { url: event.url } : {}
	});
}
function errorCaptureAutoEnabled() {
	return !!(_agentNativeAnalyticsPublicKey || window.__AGENT_NATIVE_CONFIG__?.agentNativeAnalyticsPublicKey || void 0) || !!posthogErrorConfig();
}
function maybeInstallErrorCapture(config) {
	if (typeof window === "undefined") return;
	if (config === false) {
		_errorCaptureDisposer?.();
		_errorCaptureDisposer = null;
		_errorCaptureInstalled = false;
		return;
	}
	if (_errorCaptureInstalled && config === void 0) return;
	if (!(config === void 0 ? errorCaptureAutoEnabled() : true)) return;
	const options = typeof config === "object" ? config : {};
	loadSessionReplayModuleForCapture();
	_errorCaptureDisposer = installErrorCapture({
		send: sendExceptionEvent,
		getSessionContext: errorCaptureSessionContext,
		emitReplayEvent: emitExceptionToReplay,
		environment: options.environment || resolveClientDeploymentEnvironment(),
		...options.release ? { release: options.release } : {},
		...options.captureGlobalErrors !== void 0 ? { captureGlobalErrors: options.captureGlobalErrors } : {},
		...options.captureUnhandledRejections !== void 0 ? { captureUnhandledRejections: options.captureUnhandledRejections } : {},
		...options.maxBreadcrumbs !== void 0 ? { maxBreadcrumbs: options.maxBreadcrumbs } : {}
	});
	_errorCaptureInstalled = true;
}
function sessionReplayEnabledFromEnv() {
	const env = {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"SSR": true
	};
	const value = env.VITE_AGENT_NATIVE_SESSION_REPLAY_ENABLED || env.VITE_SESSION_REPLAY_ENABLED;
	return /^(1|true|yes|on)$/i.test((value ?? "").trim());
}
function sessionReplayRequiresSignedInUserFromEnv() {
	const env = {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"SSR": true
	};
	const normalized = ((env.VITE_AGENT_NATIVE_SESSION_REPLAY_REQUIRE_AUTH || env.VITE_SESSION_REPLAY_REQUIRE_AUTH) ?? "").trim();
	if (!normalized) return void 0;
	if (/^(1|true|yes|on)$/i.test(normalized)) return true;
	if (/^(0|false|no|off)$/i.test(normalized)) return false;
}
function configuredSessionReplayOptions(config, tracking = {}) {
	const env = {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"SSR": true
	};
	const publicKey = tracking.publicKey || _agentNativeAnalyticsPublicKey || env.VITE_AGENT_NATIVE_ANALYTICS_PUBLIC_KEY;
	const trackingEndpoint = tracking.endpoint || _agentNativeAnalyticsEndpoint || env.VITE_AGENT_NATIVE_ANALYTICS_ENDPOINT || (publicKey ? AGENT_NATIVE_ANALYTICS_DEFAULT_ENDPOINT : void 0);
	const endpoint = trackingEndpoint ? replayEndpointFromTrackingEndpoint(trackingEndpoint) : void 0;
	const withTrackingDefaults = (options) => {
		const extraProperties = replayExtraPropertiesWithDefaults(options.extraProperties);
		return {
			...publicKey && !options.publicKey ? { publicKey } : {},
			...endpoint && !options.endpoint ? { endpoint } : {},
			...options,
			onUploadRejected: options.onUploadRejected ?? ((details) => {
				trackEvent("session replay upload rejected", {
					status: details.status,
					restart_attempted: details.restartAttempted,
					restart_succeeded: details.restartSucceeded,
					...details.restartReason ? { restart_reason: details.restartReason } : {}
				});
			}),
			requireSignedInUser: options.requireSignedInUser ?? sessionReplayRequiresSignedInUserFromEnv() ?? true,
			...extraProperties ? { extraProperties } : {}
		};
	};
	if (config === false) return null;
	if (config === true) return withTrackingDefaults({});
	if (config && typeof config === "object") {
		if (config.enabled === false) return null;
		return withTrackingDefaults(config);
	}
	const autoEnabledByAnalyticsKey = !!publicKey && (typeof window === "undefined" || !isLocalAnalyticsHostname(window.location.hostname));
	return sessionReplayEnabledFromEnv() || autoEnabledByAnalyticsKey ? withTrackingDefaults({}) : null;
}
function replayExtraPropertiesWithDefaults(source) {
	return () => {
		const rawProps = typeof source === "function" ? source() : source && typeof source === "object" ? source : {};
		const props = rawProps && typeof rawProps === "object" ? rawProps : {};
		const withDefaults = _getDefaultProps?.("session_replay", props) ?? props;
		const identity = _trackingIdentity ?? _sessionReplayIdentitySnapshot;
		return applyTrackingIdentity(withDefaults, isQaTrackingIdentity(identity) ? null : identity);
	};
}
function replayEndpointFromTrackingEndpoint(value) {
	try {
		const url = new URL(value);
		if (url.pathname.endsWith("/api/analytics/track")) {
			url.pathname = url.pathname.replace(/\/api\/analytics\/track$/, "/api/analytics/replay");
			return url.toString();
		}
		if (url.pathname.endsWith("/track")) {
			url.pathname = url.pathname.replace(/\/track$/, "/api/analytics/replay");
			return url.toString();
		}
	} catch {}
	if (value.endsWith("/api/analytics/track")) return value.replace(/\/api\/analytics\/track$/, "/api/analytics/replay");
	if (value.endsWith("/track")) return value.replace(/\/track$/, "/api/analytics/replay");
}
function maybeInstallSessionReplay(config, tracking, start = true) {
	if (typeof window === "undefined") return;
	const options = configuredSessionReplayOptions(config, tracking);
	_sessionReplayOptions = options;
	if (!options || !start) return;
	startConfiguredSessionReplay(options);
}
async function waitForSessionReplayAuthIfRequired(options) {
	if (isQaTrackingIdentity(_trackingIdentity)) return false;
	if (!options.requireSignedInUser) return true;
	if (_trackingIdentity?.userEmail) return true;
	try {
		if (_trackingSessionRefresh) await _trackingSessionRefresh;
		else if (!_trackingIdentityResolved) await refreshTrackingAuthSession();
	} catch {}
	return !!_trackingIdentity?.userEmail && !isQaTrackingIdentity(_trackingIdentity);
}
async function startConfiguredSessionReplay(options) {
	if (isSyntheticBrowserTraffic()) return {
		started: false,
		reason: "disabled"
	};
	if (_sessionReplayStartPromise) return _sessionReplayStartPromise;
	_sessionReplayStartPromise = (async () => {
		if (!_trackingContentCaptureEnabled) return {
			started: false,
			reason: "disabled"
		};
		if (!await waitForSessionReplayAuthIfRequired(options)) return {
			started: false,
			reason: "missing-user-id"
		};
		if (!_trackingContentCaptureEnabled) return {
			started: false,
			reason: "disabled"
		};
		const mod = await import("./session-replay-C2ktCnaf.js").then((n) => n.t);
		_sessionReplayModuleForCapture = mod;
		if (!_trackingContentCaptureEnabled) return {
			started: false,
			reason: "disabled"
		};
		return mod.startSessionReplay({
			...options,
			shouldStart: () => _trackingContentCaptureEnabled && !isQaTrackingIdentity(_trackingIdentity) && (options.shouldStart?.() ?? true)
		});
	})().catch(() => ({
		started: false,
		reason: "import-failed"
	})).finally(() => {
		_sessionReplayStartPromise = null;
	});
	return _sessionReplayStartPromise;
}
async function stopSessionReplay(reason = "manual") {
	await (await import("./session-replay-C2ktCnaf.js").then((n) => n.t)).stopSessionReplay(reason);
}
function inferTemplateName(properties) {
	const app = typeof properties.app === "string" ? properties.app.trim() : "";
	if (!app || app === "localhost") return null;
	if (app.startsWith("agent-native-")) return app.slice(13);
	return app;
}
function resolveProps(name, params) {
	if (typeof window === "undefined") return { ...params };
	const base = {
		url: window.location.origin + window.location.pathname,
		app: window.location.hostname.split(".")[0] || "localhost",
		...params
	};
	const props = _getDefaultProps ? _getDefaultProps(name, base) : base;
	let withTemplate = props;
	if (withTemplate.template === void 0) {
		const template = inferTemplateName(props);
		if (template) withTemplate = {
			...props,
			template
		};
	}
	const llmProps = llmConnectionTrackingProperties(_llmConnectionStatus);
	const enriched = { ...withTemplate };
	enriched.deployment_environment = resolveClientDeploymentEnvironment();
	for (const [key, value] of Object.entries(llmProps)) if (enriched[key] === void 0) enriched[key] = value;
	const replayProps = sessionReplayTrackingProperties();
	for (const [key, value] of Object.entries(replayProps)) if (enriched[key] === void 0) enriched[key] = value;
	const sessionId = hasBrowserTrackingDestination() ? getOrCreateSessionId() : void 0;
	const withIdentity = applyTrackingIdentity(withCanonicalTrackingProperties({
		...enriched,
		...sessionId ? { session_id: sessionId } : {}
	}));
	const identity = _trackingIdentity;
	return {
		...withIdentity,
		...getTrackingUserId() ? { user_id: getTrackingUserId() } : {},
		...identity?.userEmail ? { user_email: identity.userEmail } : {},
		...identity?.orgId ? { workspace_id: identity.orgId } : {},
		[ANALYTICS_CLIENT_PLATFORM_PROPERTY]: getAnalyticsClientPlatform(_configuredAnalyticsClientPlatform ?? void 0)
	};
}
function sessionReplayTrackingProperties() {
	const module = _sessionReplayModuleForCapture;
	if (!module) return {};
	const context = module.getSessionReplayContext?.();
	if (!context?.active) return {};
	const occurredAt = (/* @__PURE__ */ new Date()).toISOString();
	return {
		sessionReplayId: context.replayId,
		sessionReplayStartedAt: context.startedAt,
		sessionReplayAt: occurredAt,
		...module.getSessionReplayUrl ? { sessionReplayUrl: module.getSessionReplayUrl({ at: occurredAt }) } : {}
	};
}
function pageviewKey() {
	return window.location.href;
}
function pageviewProperties(reason) {
	const properties = {
		url: !_trackingContentCaptureEnabled ? window.location.origin + window.location.pathname : scrubUrl(window.location.href),
		path: window.location.pathname,
		hostname: window.location.hostname,
		navigation_type: reason
	};
	if (_trackingContentCaptureEnabled && window.location.search) properties.search = scrubUrl(window.location.search);
	if (_trackingContentCaptureEnabled && typeof document !== "undefined") {
		if (document.referrer) properties.referrer = scrubUrl(document.referrer);
		if (document.title) properties.title = document.title;
	}
	return properties;
}
function readAppEntryKeys() {
	const stored = safeStorageGet(APP_ENTRY_STORAGE_KEY);
	if (!stored) return [];
	try {
		const parsed = JSON.parse(stored);
		if (Array.isArray(parsed)) return parsed.filter((value) => typeof value === "string").slice(-100);
	} catch {}
	return [stored];
}
function rememberAppEntryKey(entryKey) {
	const state = getAppEntryTrackingState();
	const keys = new Set(state.entryKeys ?? []);
	for (const storedKey of readAppEntryKeys()) keys.add(storedKey);
	if (keys.has(entryKey)) {
		state.entryKeys = new Set([...keys].slice(-100));
		state.entryKey = entryKey;
		return false;
	}
	keys.add(entryKey);
	const boundedKeys = [...keys].slice(-100);
	state.entryKeys = new Set(boundedKeys);
	state.entryKey = entryKey;
	safeStorageSet(APP_ENTRY_STORAGE_KEY, JSON.stringify(boundedKeys));
	return true;
}
function rememberLastAppEntry(appName, now) {
	const key = `${APP_LAST_ENTRY_STORAGE_KEY_PREFIX}:${appName}`;
	const stored = safeStorageGet(key);
	const previous = stored ? Number(stored) : NaN;
	safeStorageSet(key, String(now));
	return Number.isFinite(previous) ? previous : null;
}
var _appEntryAuthRetry = null;
function waitForTrackingIdentityBeforeAppEntry() {
	const pending = _trackingSessionRefresh;
	if (!pending || _trackingIdentityResolved) return false;
	if (!_appEntryAuthRetry) _appEntryAuthRetry = pending.catch(() => {}).then(() => {
		_appEntryAuthRetry = null;
		emitAppEntered();
	});
	return true;
}
function emitAppEntered() {
	if (typeof window === "undefined" || !_getDefaultProps) return;
	if (waitForTrackingIdentityBeforeAppEntry()) return;
	const properties = resolveProps(AGENT_NATIVE_LIFECYCLE_EVENTS.appEntered, { entry_path: window.location.pathname });
	const appName = normalizeTrackingDimension(properties.app_name ?? properties.app);
	const sessionId = typeof properties.session_id === "string" ? properties.session_id : void 0;
	if (!appName) return;
	if (!rememberAppEntryKey(sessionId ? `${appName}:${sessionId}` : appName)) return;
	const now = Date.now();
	const previousEntryAt = rememberLastAppEntry(appName, now);
	const attribution = getFirstTouchAttribution();
	trackEvent(AGENT_NATIVE_LIFECYCLE_EVENTS.appEntered, {
		app_name: appName,
		entry_path: window.location.pathname,
		...attribution?.ref ? { source: attribution.ref } : {},
		...attribution?.landing_referrer ? { referrer: attribution.landing_referrer } : {}
	});
	if (previousEntryAt !== null) {
		const daysSinceLast = Math.floor((now - previousEntryAt) / 864e5);
		if (now - previousEntryAt >= RETURN_USAGE_THRESHOLD_MS) trackEvent(AGENT_NATIVE_LIFECYCLE_EVENTS.returnUsage, {
			app_name: appName,
			days_since_last: daysSinceLast
		});
	}
}
function emitPageview(reason) {
	if (typeof window === "undefined") return;
	if (isLocalAnalyticsHostname(window.location.hostname)) return;
	const state = getPageviewTrackingState();
	const key = pageviewKey();
	if (state.lastPageviewKey === key) return;
	state.lastPageviewKey = key;
	trackEvent("pageview", pageviewProperties(reason));
	emitAppEntered();
}
function schedulePageview(reason) {
	if (!_trackingContentCaptureEnabled) stopSessionReplay("local-plan-privacy");
	const run = () => emitPageview(reason);
	const deferredBootRefresh = _llmConnectionBootRefresh && !_llmConnectionStatus ? _llmConnectionBootRefresh : null;
	const pendingStartupContext = [];
	if (_llmConnectionRefresh && !_llmConnectionStatus) pendingStartupContext.push(_llmConnectionRefresh);
	if (_trackingSessionRefresh && !_trackingIdentityResolved) pendingStartupContext.push(_trackingSessionRefresh);
	if (deferredBootRefresh !== null) {
		if (pendingStartupContext.length > 0) {
			const timeout = new Promise((resolve) => window.setTimeout(resolve, 250));
			Promise.all([deferredBootRefresh, Promise.race([Promise.allSettled(pendingStartupContext), timeout])]).finally(run);
			return;
		}
		deferredBootRefresh.finally(run);
		return;
	}
	if (typeof queueMicrotask === "function") {
		queueMicrotask(run);
		return;
	}
	window.setTimeout(run, 0);
}
function installPageviewTracking() {
	const state = getPageviewTrackingState();
	if (state.installed) return;
	state.installed = true;
	schedulePageview("load");
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	window.history.pushState = function pushState(...args) {
		const result = originalPushState.apply(this, args);
		syncTrackingContentCaptureForLocation();
		schedulePageview("pushState");
		return result;
	};
	window.history.replaceState = function replaceState(...args) {
		const result = originalReplaceState.apply(this, args);
		syncTrackingContentCaptureForLocation();
		schedulePageview("replaceState");
		return result;
	};
	window.addEventListener("popstate", () => {
		syncTrackingContentCaptureForLocation();
		schedulePageview("popstate");
	});
}
function sendAgentNativeAnalytics(name, properties) {
	if (isSyntheticBrowserTraffic()) return;
	if (isLocalAnalyticsHostname(window.location.hostname)) return;
	const publicKey = _agentNativeAnalyticsPublicKey || window.__AGENT_NATIVE_CONFIG__?.agentNativeAnalyticsPublicKey || void 0;
	if (!publicKey) return;
	const endpoint = _agentNativeAnalyticsEndpoint || window.__AGENT_NATIVE_CONFIG__?.agentNativeAnalyticsEndpoint || AGENT_NATIVE_ANALYTICS_DEFAULT_ENDPOINT;
	const userId = typeof properties.userId === "string" ? properties.userId : void 0;
	const body = JSON.stringify({
		publicKey,
		event: name,
		properties,
		userId,
		anonymousId: getOrCreateAnonymousId(),
		sessionId: getOrCreateSessionId(),
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	});
	try {
		if (navigator.sendBeacon) {
			if (navigator.sendBeacon(endpoint, body)) return;
		}
		fetch(endpoint, {
			method: "POST",
			body,
			keepalive: true,
			headers: { "Content-Type": "text/plain;charset=UTF-8" }
		}).catch(() => {});
	} catch {}
}
function trackEvent(name, params) {
	if (typeof window === "undefined") return;
	if (isSyntheticBrowserTraffic()) return;
	if (isQaTrackingIdentity(_trackingIdentity)) return;
	ensureSentry();
	const props = resolveProps(name, params);
	amplitudeEventProperties(name, props);
	window.gtag?.("event", name.replace(/\s+/g, "_"), props);
	if (ensureAmplitude());
	sendAgentNativeAnalytics(name, props);
	const lifecycle = legacyLifecycleEvent(name, props);
	if (lifecycle) trackEvent(lifecycle.name, lifecycle.properties);
}
function trackSessionStatus(signedIn) {
	trackEvent("session status", { signed_in: signedIn });
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/browser-tab-id.js
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var cached;
var STORAGE_KEY = "agent-native:browser-tab-id";
var SAFE_BROWSER_TAB_ID_RE = /^[A-Za-z0-9_-]{1,96}$/;
function generate() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return Math.random().toString(36).slice(2, 10);
}
function shouldReuseStoredTabId() {
	if (typeof performance === "undefined") return true;
	const navigation = performance.getEntriesByType?.("navigation")?.[0];
	if (!navigation) return true;
	return navigation?.type === "reload" || navigation?.type === "back_forward";
}
/**
* Stable id for the current browser tab.
*
* Backed by sessionStorage, so it survives reloads in the same tab. A fresh
* document always claims a new id, even when the browser copied sessionStorage
* while duplicating a tab. Use it to scope agent context to the tab: pass it
* to the navigation-state writer (`useAgentRouteState`/`useNavigationState`)
* and to `AgentSidebar`/`AgentPanel` so a chat reads the screen state of the
* tab it was sent from, not whichever tab wrote the global key last.
*/
function getBrowserTabId() {
	if (cached) return cached;
	if (typeof window === "undefined") {
		cached = generate();
		return cached;
	}
	try {
		const existing = sessionStorage.getItem(STORAGE_KEY);
		if (existing && SAFE_BROWSER_TAB_ID_RE.test(existing) && shouldReuseStoredTabId()) {
			cached = existing;
			return existing;
		}
		const id = generate();
		sessionStorage.setItem(STORAGE_KEY, id);
		cached = id;
		return id;
	} catch {
		cached = generate();
		return cached;
	}
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/application-state.js
var APP_STATE_KEY_PATTERN = /^[a-zA-Z0-9_:-]+$/;
function appStateUrl(key) {
	if (!APP_STATE_KEY_PATTERN.test(key)) throw new TypeError("Application state keys may only contain letters, numbers, underscores, hyphens, and colons.");
	return agentNativePath(`/_agent-native/application-state/${key}`);
}
function buildHeaders(requestSource) {
	const headers = { "Content-Type": "application/json" };
	if (typeof window !== "undefined") headers["X-Agent-Native-Browser-Tab"] = getBrowserTabId();
	if (requestSource) headers["X-Request-Source"] = requestSource;
	return headers;
}
function browserTabHeaders() {
	return typeof window === "undefined" ? void 0 : { "X-Agent-Native-Browser-Tab": getBrowserTabId() };
}
async function parseAppStateResponse(response, operation) {
	let raw = "";
	try {
		raw = await response.text();
	} catch (err) {
		const cause = err instanceof Error ? err.message : String(err);
		const error = /* @__PURE__ */ new Error(`${String(operation)} failed: response body could not be read: ${cause}`);
		error.status = response.status;
		throw error;
	}
	let data = void 0;
	if (raw.length > 0) try {
		data = JSON.parse(raw);
	} catch {
		if (response.ok) {
			const error = /* @__PURE__ */ new Error(`${String(operation)} returned a non-JSON ${response.status} response: ${raw.slice(0, 200)}`);
			error.status = response.status;
			throw error;
		}
	}
	if (!response.ok) {
		const message = data && typeof data === "object" && ("error" in data || "message" in data) && String(data.error ?? data.message) || raw.slice(0, 200) || response.statusText || `HTTP ${response.status}`;
		const error = /* @__PURE__ */ new Error(`${String(operation)} failed: ${String(message)}`);
		error.status = response.status;
		throw error;
	}
	return data ?? null;
}
function jsonBody(value) {
	const body = JSON.stringify(value);
	if (body === void 0) throw new TypeError("Application state values must be JSON-serializable. Use deleteClientAppState or setClientAppState with undefined to clear a key.");
	return body;
}
/** Server caps a batch at 100 keys; stay under it when splitting. */
var MAX_BATCH_KEYS = 100;
async function readClientAppStateMany(keys, options = {}) {
	assertAgentNativeApiEnabled(`read application state [${keys.join(", ")}]`);
	const unique = [...new Set(keys)];
	for (const key of unique) appStateUrl(key);
	if (unique.length === 0) return {
		values: {},
		missing: []
	};
	const merged = {
		values: {},
		missing: []
	};
	for (let i = 0; i < unique.length; i += MAX_BATCH_KEYS) {
		const chunk = unique.slice(i, i + MAX_BATCH_KEYS);
		const browserHeaders = browserTabHeaders();
		const url = `${agentNativePath("/_agent-native/application-state")}?keys=${chunk.map(encodeURIComponent).join(",")}`;
		const batch = await parseAppStateResponse(await fetch(url, {
			method: "GET",
			cache: "no-store",
			...browserHeaders ? { headers: browserHeaders } : {},
			signal: options.signal
		}), `Read application state [${chunk.join(", ")}]`);
		if (!batch || typeof batch !== "object" || !batch.values) throw new Error(`Read application state [${chunk.join(", ")}] returned an unexpected payload.`);
		Object.assign(merged.values, batch.values);
		merged.missing.push(...batch.missing ?? []);
	}
	return merged;
}
var pendingBatch;
function scheduleBatchedRead(key) {
	if (pendingBatch) {
		pendingBatch.keys.add(key);
		return pendingBatch.promise;
	}
	const keys = /* @__PURE__ */ new Set([key]);
	const promise = new Promise((resolve, reject) => {
		setTimeout(() => {
			pendingBatch = void 0;
			readClientAppStateMany([...keys]).then(resolve, reject);
		}, 0);
	});
	pendingBatch = {
		keys,
		promise
	};
	return promise;
}
function awaitWithAbort(promise, signal) {
	if (!signal) return promise;
	const abortReason = () => signal.reason ?? /* @__PURE__ */ new Error("The operation was aborted");
	if (signal.aborted) return Promise.reject(abortReason());
	return new Promise((resolve, reject) => {
		const onAbort = () => {
			cleanup();
			reject(abortReason());
		};
		const cleanup = () => signal.removeEventListener("abort", onAbort);
		signal.addEventListener("abort", onAbort, { once: true });
		promise.then((value) => {
			cleanup();
			if (signal.aborted) reject(abortReason());
			else resolve(value);
		}, (error) => {
			cleanup();
			reject(error);
		});
	});
}
async function readClientAppState(key, options = {}) {
	appStateUrl(key);
	if (options.signal?.aborted) throw options.signal.reason ?? /* @__PURE__ */ new Error("Aborted");
	return (await awaitWithAbort(scheduleBatchedRead(key), options.signal)).values[key] ?? null;
}
async function writeClientAppState(key, value, options = {}) {
	assertAgentNativeApiEnabled(`write application state "${key}"`);
	return parseAppStateResponse(await fetch(appStateUrl(key), {
		method: "PUT",
		headers: buildHeaders(options.requestSource),
		body: jsonBody(value),
		keepalive: options.keepalive,
		signal: options.signal
	}), `Write application state "${key}"`);
}
async function deleteClientAppState(key, options = {}) {
	assertAgentNativeApiEnabled(`delete application state "${key}"`);
	await parseAppStateResponse(await fetch(appStateUrl(key), {
		method: "DELETE",
		headers: {
			"X-Agent-Native-CSRF": "1",
			...browserTabHeaders() ?? {},
			...options.requestSource ? { "X-Request-Source": options.requestSource } : {}
		},
		keepalive: options.keepalive,
		signal: options.signal
	}), `Delete application state "${key}"`);
}
async function setClientAppState(key, value, options = {}) {
	if (value === null || value === void 0) {
		await deleteClientAppState(key, options);
		return null;
	}
	return writeClientAppState(key, value, options);
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/frame.js
/**
* Frame Communication (browser)
*
* Utilities for communicating with the parent frame via postMessage.
* Provides typed request/response patterns and message sending.
*/
/**
* Send a typed message to the parent frame.
* No-op if running at top level (no parent frame).
*/
function sendToFrame(type, data) {
	if (typeof window === "undefined") return;
	const target = window.parent !== window ? window.parent : window;
	const targetOrigin = getFramePostMessageTargetOrigin() || window.location.origin;
	target.postMessage({
		type,
		data
	}, targetOrigin);
}
var _frameOrigin = null;
function normalizeOrigin(value) {
	if (typeof value !== "string") return null;
	if (value === "null") return "null";
	try {
		return new URL(value).origin;
	} catch {
		return null;
	}
}
function getFramePostMessageTargetOrigin() {
	const origin = getFrameOrigin();
	return origin === "null" ? "*" : origin;
}
function isTrustedFrameMessage(event) {
	if (typeof window === "undefined") return false;
	const ownOrigin = window.location.origin;
	if (event.origin === ownOrigin) return true;
	const frameOrigin = getFrameOrigin();
	if (!frameOrigin) return false;
	if (frameOrigin === "null") return event.origin === "null" && (event.source === window.parent || event.source === window);
	if (event.origin !== frameOrigin) return false;
	return event.source === window.parent || event.source === window;
}
var _contentHeightReportingStarted = false;
var _lastReportedContentHeight = 0;
function measureContentHeight() {
	if (typeof document === "undefined") return 0;
	const doc = document.documentElement;
	const body = document.body;
	return Math.ceil(Math.max(doc ? doc.scrollHeight : 0, body ? body.scrollHeight : 0));
}
function reportContentHeight() {
	if (typeof window === "undefined" || window.parent === window) return;
	const height = measureContentHeight();
	if (!height || Math.abs(height - _lastReportedContentHeight) < 2) return;
	_lastReportedContentHeight = height;
	sendToFrame("agentNative.contentHeight", { height });
}
function startContentHeightReporting() {
	if (_contentHeightReportingStarted || typeof window === "undefined") return;
	if (window.parent === window) return;
	_contentHeightReportingStarted = true;
	let scheduled = false;
	const schedule = () => {
		if (typeof window === "undefined") return;
		if (scheduled) return;
		scheduled = true;
		window.requestAnimationFrame(() => {
			scheduled = false;
			if (typeof window === "undefined") return;
			reportContentHeight();
		});
	};
	schedule();
	for (const delay of [
		100,
		300,
		800,
		1500
	]) window.setTimeout(schedule, delay);
	try {
		const observer = new ResizeObserver(schedule);
		if (document.documentElement) observer.observe(document.documentElement);
		if (document.body) observer.observe(document.body);
	} catch {
		window.addEventListener("resize", schedule, { passive: true });
	}
	window.addEventListener("load", schedule, { passive: true });
}
if (typeof window !== "undefined") window.addEventListener("message", (event) => {
	const eventOrigin = normalizeOrigin(event.origin);
	const payloadOrigin = normalizeOrigin(event.data?.origin);
	const origin = eventOrigin ?? payloadOrigin;
	if (event.data?.type === "agentNative.frameOrigin" && origin && (!payloadOrigin || payloadOrigin === origin || origin === "null") && !_frameOrigin && event.source === window.parent) {
		_frameOrigin = origin;
		window.parent.postMessage({ type: "agentNative.embeddedAppReady" }, getFramePostMessageTargetOrigin() ?? window.location.origin);
		startContentHeightReporting();
	}
});
/**
* Get the frame origin (e.g. "http://localhost:3334").
* Returns null if not running inside a frame iframe.
*/
function getFrameOrigin() {
	return _frameOrigin;
}
/**
* Get the origin for OAuth callbacks.
* Always uses the app's own origin (window.location.origin), NOT the frame
* origin. The redirect URI registered in Google Cloud Console (or any OAuth
* provider) must match the template app's direct URL, not the dev frame's
* proxy URL, so this must be consistent regardless of how the app is accessed.
*/
function getCallbackOrigin() {
	return typeof window !== "undefined" ? window.location.origin : "";
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/use-session.js
var SESSION_CACHE_TTL_MS = 3e4;
/**
* How long the resolve loop keeps trying before it tells the visitor the
* server is unreachable: a wall-clock budget, deliberately not an attempt
* count. An attempt count makes patience depend on how the backend fails. A
* hung endpoint bought ~66s of retries, while an endpoint answering 503
* instantly (a session lookup against a cold database, a deploy swap, a
* connection-pool blip) spent every attempt in ~6s and painted the
* "couldn't reach the server" screen over a backend that was about to come
* back. The fast-failing case is the recoverable one, so it must not be the
* impatient one.
*/
var SESSION_RETRY_BUDGET_MS = 3e4;
var SESSION_RETRY_BASE_DELAY_MS = 500;
var SESSION_RETRY_MAX_DELAY_MS = 5e3;
var SESSION_INVALIDATION_STORAGE_KEY = "agent-native:session-invalidated";
var SESSION_STATUS_PATH = "/_agent-native/auth/session";
var cachedSession;
var cachedSessionAt = 0;
var sessionRequest;
var trackedSessionIdentity;
var sessionGeneration = 0;
var sessionInvalidationListenersInstalled = false;
var sessionInvalidationSubscribers = /* @__PURE__ */ new Set();
var signingOut = false;
/** Elapsed-time source for the retry budget; immune to wall-clock jumps. */
function monotonicNow() {
	return performance.now();
}
var RETRY_BUDGET_EXCEEDED = Symbol("retry-budget-exceeded");
/**
* Resolves once `remainingMs` elapses, racing against the actual session
* read so a read starting near the retry budget cannot itself run past that
* budget on the client request timeout. Distinguishable from a genuine
* `SessionRead` so the loser (the still-pending shared request) can be
* abandoned rather than left cached for the next caller to reuse.
*/
function budgetExceededMarker(remainingMs) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(RETRY_BUDGET_EXCEEDED), Math.max(remainingMs, 0));
	});
}
function hasFreshSessionCache() {
	return cachedSession !== void 0 && Date.now() - cachedSessionAt < SESSION_CACHE_TTL_MS;
}
function publishSessionIdentity(session) {
	const identity = session?.userId ?? session?.email ?? null;
	if (trackedSessionIdentity !== identity) {
		trackedSessionIdentity = identity;
		if (session) setSentryUser({
			id: session.userId,
			email: session.email,
			username: session.name
		}, session.orgId ?? null);
		else setSentryUser(null, null);
	}
	trackSessionStatus(Boolean(session));
}
function notifyParentAuthState(status) {
	if (typeof window === "undefined" || window.parent === window) return;
	if (!getFrameOrigin()) return;
	const targetOrigin = getFramePostMessageTargetOrigin();
	if (!targetOrigin) return;
	try {
		window.parent.postMessage({
			type: "agentNative.authState",
			data: { status }
		}, targetOrigin);
	} catch {}
}
function invalidateSessionCache() {
	sessionGeneration += 1;
	cachedSession = void 0;
	cachedSessionAt = 0;
	sessionRequest = void 0;
	invalidateClientStatusRequest(SESSION_STATUS_PATH);
	for (const subscriber of sessionInvalidationSubscribers) subscriber();
}
function installSessionInvalidationListeners() {
	if (sessionInvalidationListenersInstalled || typeof window === "undefined" || typeof document === "undefined") return;
	sessionInvalidationListenersInstalled = true;
	window.addEventListener("focus", invalidateSessionCache);
	window.addEventListener("storage", (event) => {
		if (event.key === SESSION_INVALIDATION_STORAGE_KEY) {
			invalidateSessionCache();
			setTimeout(invalidateSessionCache, SESSION_CACHE_TTL_MS);
		}
	});
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible") invalidateSessionCache();
	});
}
/** Tell mounted session consumers to re-check auth after a logout. */
function notifySessionInvalidated() {
	if (typeof window === "undefined") return;
	installSessionInvalidationListeners();
	invalidateSessionCache();
	try {
		window.localStorage.setItem(SESSION_INVALIDATION_STORAGE_KEY, `${Date.now()}:${Math.random()}`);
	} catch (error) {
		console.warn("Unable to broadcast session invalidation", error);
	}
}
var UNAUTHORIZED_RECHECK_MIN_INTERVAL_MS = 5e3;
var lastUnauthorizedRecheckAt = 0;
/**
* Re-resolve the session because an authenticated request came back 401.
*
* `status` is only written when a session fetch resolves, so a 401 anywhere
* else leaves every mounted consumer holding the previous `"authenticated"`
* answer. The app shell stays mounted over a session the server no longer
* recognises, and each data query paints its own generic load error instead of
* the visitor being sent to sign in — which is what a stale cookie surviving
* logout looks like on screen. Re-reading the session lets the gate reach the
* truth and redirect.
*
* This asks the server rather than forcing `"unauthenticated"` from here: a
* 401 can also come from one request a live session is not allowed to make,
* and assuming otherwise would sign that visitor out of a working session.
* Throttled because one screen can fail many requests at once, and each
* invalidation schedules a fresh read.
*/
function recheckSessionAfterUnauthorized() {
	if (typeof window === "undefined") return;
	if (signingOut) return;
	const now = Date.now();
	if (now - lastUnauthorizedRecheckAt < UNAUTHORIZED_RECHECK_MIN_INTERVAL_MS) return;
	lastUnauthorizedRecheckAt = now;
	installSessionInvalidationListeners();
	invalidateSessionCache();
}
/**
* Enter the terminal `"signing-out"` state for this document.
*
* Call this BEFORE revoking the server session, not after. Invalidating the
* cache instead only asks mounted consumers to re-read, which keeps answering
* `"authenticated"` from the previous read until the network replies — and the
* app shell stays mounted, and its queries 401. Prefer `signOut()` from
* `sign-out.ts`, which sequences this with the revoke and the navigation.
*/
function beginSignOut() {
	signingOut = true;
	publishSessionIdentity(null);
	invalidateSessionCache();
}
/** Notify other browsing contexts after the server has confirmed revocation. */
function completeSignOut() {
	notifyParentAuthState("unauthenticated");
	notifySessionInvalidated();
}
function fetchSharedSession() {
	if (signingOut) return Promise.resolve({
		state: "resolved",
		session: null
	});
	if (agentNativeApiDisabledReason()) return Promise.resolve({
		state: "resolved",
		session: null
	});
	if (hasFreshSessionCache()) return Promise.resolve({
		state: "resolved",
		session: cachedSession ?? null
	});
	if (sessionRequest) return sessionRequest;
	const requestGeneration = sessionGeneration;
	let request;
	request = (async () => {
		try {
			const result = await fetchAuthSessionStatus();
			if (requestGeneration !== sessionGeneration) return { state: "superseded" };
			if (result.state === "unavailable") return { state: "unreadable" };
			const data = result.value;
			const session = data.error ? null : data;
			cachedSession = session;
			cachedSessionAt = Date.now();
			publishSessionIdentity(session);
			return {
				state: "resolved",
				session
			};
		} catch {
			return { state: "unreadable" };
		}
	})().finally(() => {
		if (sessionRequest === request) sessionRequest = void 0;
	});
	sessionRequest = request;
	return sessionRequest;
}
/**
* Client-side hook to get the current auth session.
*
* Fetches the current session from `/_agent-native/auth/session` and returns
* it, or `null` when unauthenticated. This behavior is the same in all
* environments — there is no dev bypass and no `local@localhost` sentinel.
*
* Templates should use this instead of building their own auth context.
*/
function useSession() {
	installSessionInvalidationListeners();
	const cached = hasFreshSessionCache() ? cachedSession ?? null : null;
	const [session, setSession] = (0, import_react.useState)(cached);
	const [status, setStatus] = (0, import_react.useState)(() => {
		if (!hasFreshSessionCache()) return "loading";
		return cached ? "authenticated" : "unauthenticated";
	});
	const [error, setError] = (0, import_react.useState)(null);
	const [retryToken, setRetryToken] = (0, import_react.useState)(0);
	const [invalidationToken, setInvalidationToken] = (0, import_react.useState)(0);
	const retry = (0, import_react.useCallback)(() => {
		setError(null);
		setStatus("loading");
		setRetryToken((token) => token + 1);
	}, []);
	(0, import_react.useEffect)(() => {
		const subscriber = () => {
			setInvalidationToken((token) => token + 1);
		};
		sessionInvalidationSubscribers.add(subscriber);
		return () => {
			sessionInvalidationSubscribers.delete(subscriber);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let retryTimer;
		let failures = 0;
		const startedAt = monotonicNow();
		const resolveSession = async () => {
			const remainingAtStart = SESSION_RETRY_BUDGET_MS - (monotonicNow() - startedAt);
			const raced = await Promise.race([fetchSharedSession(), budgetExceededMarker(remainingAtStart)]);
			if (cancelled) return;
			let read;
			if (raced === RETRY_BUDGET_EXCEEDED) {
				invalidateSessionCache();
				read = { state: "unreadable" };
			} else read = raced;
			if (read.state !== "resolved") {
				if (read.state === "unreadable") failures += 1;
				const remaining = SESSION_RETRY_BUDGET_MS - (monotonicNow() - startedAt);
				if (remaining <= 0) {
					setError(/* @__PURE__ */ new Error(`Could not read the session after ${failures} attempts.`));
					setStatus("unavailable");
					return;
				}
				const delay = read.state === "superseded" ? 0 : Math.min(SESSION_RETRY_BASE_DELAY_MS * 2 ** (failures - 1), SESSION_RETRY_MAX_DELAY_MS, remaining);
				retryTimer = setTimeout(() => {
					resolveSession();
				}, delay);
				return;
			}
			const resolved = read.session;
			setSession(resolved);
			setError(null);
			setStatus(resolved ? "authenticated" : "unauthenticated");
			notifyParentAuthState(resolved ? "authenticated" : "unauthenticated");
		};
		resolveSession();
		return () => {
			cancelled = true;
			if (retryTimer) clearTimeout(retryTimer);
		};
	}, [invalidationToken, retryToken]);
	if (signingOut) return {
		session: null,
		isLoading: true,
		status: "signing-out",
		error: null,
		retry
	};
	return {
		session,
		isLoading: status === "loading" || status === "unavailable",
		status,
		error,
		retry
	};
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/environment-lanes.js
var BETA_OPT_OUT_QUERY_PARAM = "agentNativeBetaOptOut";
var BETA_OPT_OUT_DURATION_MS = 480 * 60 * 1e3;
var BETA_OPT_OUT_STORAGE_KEY = "agent-native:beta-opt-out-until";
var BETA_REDIRECT_DURATION_MS = 720 * 60 * 60 * 1e3;
var BETA_REDIRECT_STORAGE_KEY = "agent-native:beta-redirect-until";
var BETA_REDIRECT_SIGN_OUT_STORAGE_KEY = "agent-native:beta-redirect-signing-out";
var BETA_FORCE_QUERY_PARAM = "force";
var BETA_FORCE_SESSION_STORAGE_KEY = "agent-native:force-production";
/**
* Marks a beta arrival as the lane's own doing rather than the visitor's.
*
* Sessions are per-host, so an automatic production -> beta redirect can land
* on beta's sign-in page and strand someone who just authenticated on
* production. Beta can only undo that if it can tell an automatic arrival from
* a deliberate click through to beta, which must still stay put.
*/
var BETA_LANE_REDIRECT_QUERY_PARAM = "agentNativeLaneRedirect";
/** Beta-side, per tab: the production path an automatic redirect left behind. */
var BETA_LANE_RETURN_STORAGE_KEY = "agent-native:beta-lane-return-to";
/**
* Beta-side, per tab: when the opt-out this tab handed production expires.
* Until then a repeat automatic arrival means production ignored the opt-out,
* so returning again would only ping-pong. After it, a fresh arrival is a
* genuine new redirect and gets its own return.
*/
var BETA_LANE_RETURNED_STORAGE_KEY = "agent-native:beta-lane-returned";
var ENVIRONMENT_BETA_HOSTS = {
	"agent-workspace.builder.io": "beta.agent-workspace.builder.io",
	"builder-agent-native-workspace.netlify.app": "beta.agent-workspace.builder.io",
	"analytics.agent-native.com": "beta.analytics.agent-native.com",
	"assets.agent-native.com": "beta.assets.agent-native.com",
	"brain.agent-native.com": "beta.brain.agent-native.com",
	"calendar.agent-native.com": "beta.calendar.agent-native.com",
	"chat.agent-native.com": "beta.chat.agent-native.com",
	"clips.agent-native.com": "beta.clips.agent-native.com",
	"content.agent-native.com": "beta.content.agent-native.com",
	"crm.agent-native.com": "beta.crm.agent-native.com",
	"design.agent-native.com": "beta.design.agent-native.com",
	"dispatch.agent-native.com": "beta.dispatch.agent-native.com",
	"factory.agent-native.com": "beta.factory.agent-native.com",
	"forms.agent-native.com": "beta.forms.agent-native.com",
	"mail.agent-native.com": "beta.mail.agent-native.com",
	"plan.agent-native.com": "beta.plan.agent-native.com",
	"slides.agent-native.com": "beta.slides.agent-native.com"
};
function resolveEnvironmentTargets(hostname) {
	const normalized = hostname?.trim().toLowerCase().replace(/\.$/, "");
	if (!normalized) return null;
	const productionHost = normalized.replace(/^beta\./, "");
	const betaHost = ENVIRONMENT_BETA_HOSTS[productionHost];
	if (!betaHost) return null;
	return {
		betaHost,
		productionHost
	};
}
function buildEnvironmentUrl(sourceHref, targetHost) {
	try {
		const target = new URL(sourceHref);
		target.protocol = "https:";
		target.hostname = targetHost;
		target.port = "";
		return target.toString();
	} catch {
		return null;
	}
}
/**
* Target for an AUTOMATIC production -> beta redirect, tagged so beta can
* recognise that nobody asked to come here. `buildEnvironmentUrl` stays
* untagged: a visitor who clicks "beta" chose beta and must stay on it.
*/
function buildAutomaticBetaRedirectUrl(sourceHref, betaHost) {
	const targetHref = buildEnvironmentUrl(sourceHref, betaHost);
	if (!targetHref) return null;
	try {
		const target = new URL(targetHref);
		target.searchParams.set(BETA_LANE_REDIRECT_QUERY_PARAM, "1");
		return target.toString();
	} catch {
		return null;
	}
}
function buildEnvironmentOptOutUrl(sourceHref, targetHost, now = Date.now()) {
	const targetHref = buildEnvironmentUrl(sourceHref, targetHost);
	if (!targetHref) return null;
	try {
		const target = new URL(targetHref);
		target.searchParams.set(BETA_OPT_OUT_QUERY_PARAM, String(now + BETA_OPT_OUT_DURATION_MS));
		return target.toString();
	} catch {
		return null;
	}
}
//#endregion
//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function r(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) {
		var o = e.length;
		for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
	} else for (f in e) e[f] && (n && (n += " "), n += f);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
	return n;
}
//#endregion
//#region node_modules/.pnpm/tailwind-merge@3.6.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs
/**
* Concatenates two arrays faster than the array spread operator.
*/
var concatArrays = (array1, array2) => {
	const combinedArray = new Array(array1.length + array2.length);
	for (let i = 0; i < array1.length; i++) combinedArray[i] = array1[i];
	for (let i = 0; i < array2.length; i++) combinedArray[array1.length + i] = array2[i];
	return combinedArray;
};
var createClassValidatorObject = (classGroupId, validator) => ({
	classGroupId,
	validator
});
var createClassPartObject = (nextPart = /* @__PURE__ */ new Map(), validators = null, classGroupId) => ({
	nextPart,
	validators,
	classGroupId
});
var CLASS_PART_SEPARATOR = "-";
var EMPTY_CONFLICTS = [];
var ARBITRARY_PROPERTY_PREFIX = "arbitrary..";
var createClassGroupUtils = (config) => {
	const classMap = createClassMap(config);
	const { conflictingClassGroups, conflictingClassGroupModifiers } = config;
	const getClassGroupId = (className) => {
		if (className.startsWith("[") && className.endsWith("]")) return getGroupIdForArbitraryProperty(className);
		const classParts = className.split(CLASS_PART_SEPARATOR);
		return getGroupRecursive(classParts, classParts[0] === "" && classParts.length > 1 ? 1 : 0, classMap);
	};
	const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
		if (hasPostfixModifier) {
			const modifierConflicts = conflictingClassGroupModifiers[classGroupId];
			const baseConflicts = conflictingClassGroups[classGroupId];
			if (modifierConflicts) {
				if (baseConflicts) return concatArrays(baseConflicts, modifierConflicts);
				return modifierConflicts;
			}
			return baseConflicts || EMPTY_CONFLICTS;
		}
		return conflictingClassGroups[classGroupId] || EMPTY_CONFLICTS;
	};
	return {
		getClassGroupId,
		getConflictingClassGroupIds
	};
};
var getGroupRecursive = (classParts, startIndex, classPartObject) => {
	if (classParts.length - startIndex === 0) return classPartObject.classGroupId;
	const currentClassPart = classParts[startIndex];
	const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
	if (nextClassPartObject) {
		const result = getGroupRecursive(classParts, startIndex + 1, nextClassPartObject);
		if (result) return result;
	}
	const validators = classPartObject.validators;
	if (validators === null) return;
	const classRest = startIndex === 0 ? classParts.join(CLASS_PART_SEPARATOR) : classParts.slice(startIndex).join(CLASS_PART_SEPARATOR);
	const validatorsLength = validators.length;
	for (let i = 0; i < validatorsLength; i++) {
		const validatorObj = validators[i];
		if (validatorObj.validator(classRest)) return validatorObj.classGroupId;
	}
};
/**
* Get the class group ID for an arbitrary property.
*
* @param className - The class name to get the group ID for. Is expected to be string starting with `[` and ending with `]`.
*/
var getGroupIdForArbitraryProperty = (className) => className.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	const content = className.slice(1, -1);
	const colonIndex = content.indexOf(":");
	const property = content.slice(0, colonIndex);
	return property ? ARBITRARY_PROPERTY_PREFIX + property : void 0;
})();
/**
* Exported for testing only
*/
var createClassMap = (config) => {
	const { theme, classGroups } = config;
	return processClassGroups(classGroups, theme);
};
var processClassGroups = (classGroups, theme) => {
	const classMap = createClassPartObject();
	for (const classGroupId in classGroups) {
		const group = classGroups[classGroupId];
		processClassesRecursively(group, classMap, classGroupId, theme);
	}
	return classMap;
};
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
	const len = classGroup.length;
	for (let i = 0; i < len; i++) {
		const classDefinition = classGroup[i];
		processClassDefinition(classDefinition, classPartObject, classGroupId, theme);
	}
};
var processClassDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (typeof classDefinition === "string") {
		processStringDefinition(classDefinition, classPartObject, classGroupId);
		return;
	}
	if (typeof classDefinition === "function") {
		processFunctionDefinition(classDefinition, classPartObject, classGroupId, theme);
		return;
	}
	processObjectDefinition(classDefinition, classPartObject, classGroupId, theme);
};
var processStringDefinition = (classDefinition, classPartObject, classGroupId) => {
	const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
	classPartObjectToEdit.classGroupId = classGroupId;
};
var processFunctionDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (isThemeGetter(classDefinition)) {
		processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
		return;
	}
	if (classPartObject.validators === null) classPartObject.validators = [];
	classPartObject.validators.push(createClassValidatorObject(classGroupId, classDefinition));
};
var processObjectDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	const entries = Object.entries(classDefinition);
	const len = entries.length;
	for (let i = 0; i < len; i++) {
		const [key, value] = entries[i];
		processClassesRecursively(value, getPart(classPartObject, key), classGroupId, theme);
	}
};
var getPart = (classPartObject, path) => {
	let current = classPartObject;
	const parts = path.split(CLASS_PART_SEPARATOR);
	const len = parts.length;
	for (let i = 0; i < len; i++) {
		const part = parts[i];
		let next = current.nextPart.get(part);
		if (!next) {
			next = createClassPartObject();
			current.nextPart.set(part, next);
		}
		current = next;
	}
	return current;
};
var isThemeGetter = (func) => "isThemeGetter" in func && func.isThemeGetter === true;
var createLruCache = (maxCacheSize) => {
	if (maxCacheSize < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let cacheSize = 0;
	let cache = Object.create(null);
	let previousCache = Object.create(null);
	const update = (key, value) => {
		cache[key] = value;
		cacheSize++;
		if (cacheSize > maxCacheSize) {
			cacheSize = 0;
			previousCache = cache;
			cache = Object.create(null);
		}
	};
	return {
		get(key) {
			let value = cache[key];
			if (value !== void 0) return value;
			if ((value = previousCache[key]) !== void 0) {
				update(key, value);
				return value;
			}
		},
		set(key, value) {
			if (key in cache) cache[key] = value;
			else update(key, value);
		}
	};
};
var IMPORTANT_MODIFIER = "!";
var MODIFIER_SEPARATOR = ":";
var EMPTY_MODIFIERS = [];
var createResultObject = (modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition, isExternal) => ({
	modifiers,
	hasImportantModifier,
	baseClassName,
	maybePostfixModifierPosition,
	isExternal
});
var createParseClassName = (config) => {
	const { prefix, experimentalParseClassName } = config;
	/**
	* Parse class name into parts.
	*
	* Inspired by `splitAtTopLevelOnly` used in Tailwind CSS
	* @see https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
	*/
	let parseClassName = (className) => {
		const modifiers = [];
		let bracketDepth = 0;
		let parenDepth = 0;
		let modifierStart = 0;
		let postfixModifierPosition;
		const len = className.length;
		for (let index = 0; index < len; index++) {
			const currentCharacter = className[index];
			if (bracketDepth === 0 && parenDepth === 0) {
				if (currentCharacter === MODIFIER_SEPARATOR) {
					modifiers.push(className.slice(modifierStart, index));
					modifierStart = index + 1;
					continue;
				}
				if (currentCharacter === "/") {
					postfixModifierPosition = index;
					continue;
				}
			}
			if (currentCharacter === "[") bracketDepth++;
			else if (currentCharacter === "]") bracketDepth--;
			else if (currentCharacter === "(") parenDepth++;
			else if (currentCharacter === ")") parenDepth--;
		}
		const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.slice(modifierStart);
		let baseClassName = baseClassNameWithImportantModifier;
		let hasImportantModifier = false;
		if (baseClassNameWithImportantModifier.endsWith(IMPORTANT_MODIFIER)) {
			baseClassName = baseClassNameWithImportantModifier.slice(0, -1);
			hasImportantModifier = true;
		} else if (baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER)) {
			baseClassName = baseClassNameWithImportantModifier.slice(1);
			hasImportantModifier = true;
		}
		const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
		return createResultObject(modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition);
	};
	if (prefix) {
		const fullPrefix = prefix + MODIFIER_SEPARATOR;
		const parseClassNameOriginal = parseClassName;
		parseClassName = (className) => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.slice(fullPrefix.length)) : createResultObject(EMPTY_MODIFIERS, false, className, void 0, true);
	}
	if (experimentalParseClassName) {
		const parseClassNameOriginal = parseClassName;
		parseClassName = (className) => experimentalParseClassName({
			className,
			parseClassName: parseClassNameOriginal
		});
	}
	return parseClassName;
};
/**
* Sorts modifiers according to following schema:
* - Predefined modifiers are sorted alphabetically
* - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
*/
var createSortModifiers = (config) => {
	const modifierWeights = /* @__PURE__ */ new Map();
	config.orderSensitiveModifiers.forEach((mod, index) => {
		modifierWeights.set(mod, 1e6 + index);
	});
	return (modifiers) => {
		const result = [];
		let currentSegment = [];
		for (let i = 0; i < modifiers.length; i++) {
			const modifier = modifiers[i];
			const isArbitrary = modifier[0] === "[";
			const isOrderSensitive = modifierWeights.has(modifier);
			if (isArbitrary || isOrderSensitive) {
				if (currentSegment.length > 0) {
					currentSegment.sort();
					result.push(...currentSegment);
					currentSegment = [];
				}
				result.push(modifier);
			} else currentSegment.push(modifier);
		}
		if (currentSegment.length > 0) {
			currentSegment.sort();
			result.push(...currentSegment);
		}
		return result;
	};
};
var createConfigUtils = (config) => ({
	cache: createLruCache(config.cacheSize),
	parseClassName: createParseClassName(config),
	sortModifiers: createSortModifiers(config),
	postfixLookupClassGroupIds: createPostfixLookupClassGroupIds(config),
	...createClassGroupUtils(config)
});
var createPostfixLookupClassGroupIds = (config) => {
	const lookup = Object.create(null);
	const classGroupIds = config.postfixLookupClassGroups;
	if (classGroupIds) for (let i = 0; i < classGroupIds.length; i++) lookup[classGroupIds[i]] = true;
	return lookup;
};
var SPLIT_CLASSES_REGEX = /\s+/;
var mergeClassList = (classList, configUtils) => {
	const { parseClassName, getClassGroupId, getConflictingClassGroupIds, sortModifiers, postfixLookupClassGroupIds } = configUtils;
	/**
	* Set of classGroupIds in following format:
	* `{importantModifier}{variantModifiers}{classGroupId}`
	* @example 'float'
	* @example 'hover:focus:bg-color'
	* @example 'md:!pr'
	*/
	const classGroupsInConflict = [];
	const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
	let result = "";
	for (let index = classNames.length - 1; index >= 0; index -= 1) {
		const originalClassName = classNames[index];
		const { isExternal, modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } = parseClassName(originalClassName);
		if (isExternal) {
			result = originalClassName + (result.length > 0 ? " " + result : result);
			continue;
		}
		let hasPostfixModifier = !!maybePostfixModifierPosition;
		let classGroupId;
		if (hasPostfixModifier) {
			classGroupId = getClassGroupId(baseClassName.substring(0, maybePostfixModifierPosition));
			const classGroupIdWithPostfix = classGroupId && postfixLookupClassGroupIds[classGroupId] ? getClassGroupId(baseClassName) : void 0;
			if (classGroupIdWithPostfix && classGroupIdWithPostfix !== classGroupId) {
				classGroupId = classGroupIdWithPostfix;
				hasPostfixModifier = false;
			}
		} else classGroupId = getClassGroupId(baseClassName);
		if (!classGroupId) {
			if (!hasPostfixModifier) {
				result = originalClassName + (result.length > 0 ? " " + result : result);
				continue;
			}
			classGroupId = getClassGroupId(baseClassName);
			if (!classGroupId) {
				result = originalClassName + (result.length > 0 ? " " + result : result);
				continue;
			}
			hasPostfixModifier = false;
		}
		const variantModifier = modifiers.length === 0 ? "" : modifiers.length === 1 ? modifiers[0] : sortModifiers(modifiers).join(":");
		const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
		const classId = modifierId + classGroupId;
		if (classGroupsInConflict.indexOf(classId) > -1) continue;
		classGroupsInConflict.push(classId);
		const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
		for (let i = 0; i < conflictGroups.length; ++i) {
			const group = conflictGroups[i];
			classGroupsInConflict.push(modifierId + group);
		}
		result = originalClassName + (result.length > 0 ? " " + result : result);
	}
	return result;
};
/**
* The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
*
* Specifically:
* - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
* - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
*
* Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
*/
var twJoin = (...classLists) => {
	let index = 0;
	let argument;
	let resolvedValue;
	let string = "";
	while (index < classLists.length) if (argument = classLists[index++]) {
		if (resolvedValue = toValue(argument)) {
			string && (string += " ");
			string += resolvedValue;
		}
	}
	return string;
};
var toValue = (mix) => {
	if (typeof mix === "string") return mix;
	let resolvedValue;
	let string = "";
	for (let k = 0; k < mix.length; k++) if (mix[k]) {
		if (resolvedValue = toValue(mix[k])) {
			string && (string += " ");
			string += resolvedValue;
		}
	}
	return string;
};
var createTailwindMerge = (createConfigFirst, ...createConfigRest) => {
	let configUtils;
	let cacheGet;
	let cacheSet;
	let functionToCall;
	const initTailwindMerge = (classList) => {
		configUtils = createConfigUtils(createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst()));
		cacheGet = configUtils.cache.get;
		cacheSet = configUtils.cache.set;
		functionToCall = tailwindMerge;
		return tailwindMerge(classList);
	};
	const tailwindMerge = (classList) => {
		const cachedResult = cacheGet(classList);
		if (cachedResult) return cachedResult;
		const result = mergeClassList(classList, configUtils);
		cacheSet(classList, result);
		return result;
	};
	functionToCall = initTailwindMerge;
	return (...args) => functionToCall(twJoin(...args));
};
var fallbackThemeArr = [];
var fromTheme = (key) => {
	const themeGetter = (theme) => theme[key] || fallbackThemeArr;
	themeGetter.isThemeGetter = true;
	return themeGetter;
};
var arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
var arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
var fractionRegex = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/;
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var isFraction = (value) => fractionRegex.test(value);
var isNumber = (value) => !!value && !Number.isNaN(Number(value));
var isInteger = (value) => !!value && Number.isInteger(Number(value));
var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
var isTshirtSize = (value) => tshirtUnitRegex.test(value);
var isAny = () => true;
var isLengthOnly = (value) => lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
var isNever = () => false;
var isShadow = (value) => shadowRegex.test(value);
var isImage = (value) => imageRegex.test(value);
var isAnyNonArbitrary = (value) => !isArbitraryValue(value) && !isArbitraryVariable(value);
var isNamedContainerQuery = (value) => value.startsWith("@container") && (value[10] === "/" && value[11] !== void 0 || value[11] === "s" && value[16] !== void 0 && value.startsWith("-size/", 10) || value[11] === "n" && value[18] !== void 0 && value.startsWith("-normal/", 10));
var isArbitrarySize = (value) => getIsArbitraryValue(value, isLabelSize, isNever);
var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
var isArbitraryLength = (value) => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
var isArbitraryNumber = (value) => getIsArbitraryValue(value, isLabelNumber, isNumber);
var isArbitraryWeight = (value) => getIsArbitraryValue(value, isLabelWeight, isAny);
var isArbitraryFamilyName = (value) => getIsArbitraryValue(value, isLabelFamilyName, isNever);
var isArbitraryPosition = (value) => getIsArbitraryValue(value, isLabelPosition, isNever);
var isArbitraryImage = (value) => getIsArbitraryValue(value, isLabelImage, isImage);
var isArbitraryShadow = (value) => getIsArbitraryValue(value, isLabelShadow, isShadow);
var isArbitraryVariable = (value) => arbitraryVariableRegex.test(value);
var isArbitraryVariableLength = (value) => getIsArbitraryVariable(value, isLabelLength);
var isArbitraryVariableFamilyName = (value) => getIsArbitraryVariable(value, isLabelFamilyName);
var isArbitraryVariablePosition = (value) => getIsArbitraryVariable(value, isLabelPosition);
var isArbitraryVariableSize = (value) => getIsArbitraryVariable(value, isLabelSize);
var isArbitraryVariableImage = (value) => getIsArbitraryVariable(value, isLabelImage);
var isArbitraryVariableShadow = (value) => getIsArbitraryVariable(value, isLabelShadow, true);
var isArbitraryVariableWeight = (value) => getIsArbitraryVariable(value, isLabelWeight, true);
var getIsArbitraryValue = (value, testLabel, testValue) => {
	const result = arbitraryValueRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return testValue(result[2]);
	}
	return false;
};
var getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
	const result = arbitraryVariableRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return shouldMatchNoLabel;
	}
	return false;
};
var isLabelPosition = (label) => label === "position" || label === "percentage";
var isLabelImage = (label) => label === "image" || label === "url";
var isLabelSize = (label) => label === "length" || label === "size" || label === "bg-size";
var isLabelLength = (label) => label === "length";
var isLabelNumber = (label) => label === "number";
var isLabelFamilyName = (label) => label === "family-name";
var isLabelWeight = (label) => label === "number" || label === "weight";
var isLabelShadow = (label) => label === "shadow";
var getDefaultConfig = () => {
	/**
	* Theme getters for theme variable namespaces
	* @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
	*/
	const themeColor = fromTheme("color");
	const themeFont = fromTheme("font");
	const themeText = fromTheme("text");
	const themeFontWeight = fromTheme("font-weight");
	const themeTracking = fromTheme("tracking");
	const themeLeading = fromTheme("leading");
	const themeBreakpoint = fromTheme("breakpoint");
	const themeContainer = fromTheme("container");
	const themeSpacing = fromTheme("spacing");
	const themeRadius = fromTheme("radius");
	const themeShadow = fromTheme("shadow");
	const themeInsetShadow = fromTheme("inset-shadow");
	const themeTextShadow = fromTheme("text-shadow");
	const themeDropShadow = fromTheme("drop-shadow");
	const themeBlur = fromTheme("blur");
	const themePerspective = fromTheme("perspective");
	const themeAspect = fromTheme("aspect");
	const themeEase = fromTheme("ease");
	const themeAnimate = fromTheme("animate");
	/**
	* Helpers to avoid repeating the same scales
	*
	* We use functions that create a new array every time they're called instead of static arrays.
	* This ensures that users who modify any scale by mutating the array (e.g. with `array.push(element)`) don't accidentally mutate arrays in other parts of the config.
	*/
	const scaleBreak = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	];
	const scalePosition = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	];
	const scalePositionWithArbitrary = () => [
		...scalePosition(),
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleOverflow = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	];
	const scaleOverscroll = () => [
		"auto",
		"contain",
		"none"
	];
	const scaleUnambiguousSpacing = () => [
		isArbitraryVariable,
		isArbitraryValue,
		themeSpacing
	];
	const scaleInset = () => [
		isFraction,
		"full",
		"auto",
		...scaleUnambiguousSpacing()
	];
	const scaleGridTemplateColsRows = () => [
		isInteger,
		"none",
		"subgrid",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartAndEnd = () => [
		"auto",
		{ span: [
			"full",
			isInteger,
			isArbitraryVariable,
			isArbitraryValue
		] },
		isInteger,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartOrEnd = () => [
		isInteger,
		"auto",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridAutoColsRows = () => [
		"auto",
		"min",
		"max",
		"fr",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleAlignPrimaryAxis = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	];
	const scaleAlignSecondaryAxis = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	];
	const scaleMargin = () => ["auto", ...scaleUnambiguousSpacing()];
	const scaleSizing = () => [
		isFraction,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingInline = () => [
		isFraction,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingBlock = () => [
		isFraction,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleColor = () => [
		themeColor,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBgPosition = () => [
		...scalePosition(),
		isArbitraryVariablePosition,
		isArbitraryPosition,
		{ position: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleBgRepeat = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }];
	const scaleBgSize = () => [
		"auto",
		"cover",
		"contain",
		isArbitraryVariableSize,
		isArbitrarySize,
		{ size: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleGradientStopPosition = () => [
		isPercent,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleRadius = () => [
		"",
		"none",
		"full",
		themeRadius,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBorderWidth = () => [
		"",
		isNumber,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleLineStyle = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	];
	const scaleBlendMode = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	];
	const scaleMaskImagePosition = () => [
		isNumber,
		isPercent,
		isArbitraryVariablePosition,
		isArbitraryPosition
	];
	const scaleBlur = () => [
		"",
		"none",
		themeBlur,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleRotate = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleScale = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleSkew = () => [
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleTranslate = () => [
		isFraction,
		"full",
		...scaleUnambiguousSpacing()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [isTshirtSize],
			breakpoint: [isTshirtSize],
			color: [isAny],
			container: [isTshirtSize],
			"drop-shadow": [isTshirtSize],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [isAnyNonArbitrary],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [isTshirtSize],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [isTshirtSize],
			shadow: [isTshirtSize],
			spacing: ["px", isNumber],
			text: [isTshirtSize],
			"text-shadow": [isTshirtSize],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			/**
			* Aspect Ratio
			* @see https://tailwindcss.com/docs/aspect-ratio
			*/
			aspect: [{ aspect: [
				"auto",
				"square",
				isFraction,
				isArbitraryValue,
				isArbitraryVariable,
				themeAspect
			] }],
			/**
			* Container
			* @see https://tailwindcss.com/docs/container
			* @deprecated since Tailwind CSS v4.0.0
			*/
			container: ["container"],
			/**
			* Container Type
			* @see https://tailwindcss.com/docs/responsive-design#container-queries
			*/
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Container Name
			* @see https://tailwindcss.com/docs/responsive-design#named-containers
			*/
			"container-named": [isNamedContainerQuery],
			/**
			* Columns
			* @see https://tailwindcss.com/docs/columns
			*/
			columns: [{ columns: [
				isNumber,
				isArbitraryValue,
				isArbitraryVariable,
				themeContainer
			] }],
			/**
			* Break After
			* @see https://tailwindcss.com/docs/break-after
			*/
			"break-after": [{ "break-after": scaleBreak() }],
			/**
			* Break Before
			* @see https://tailwindcss.com/docs/break-before
			*/
			"break-before": [{ "break-before": scaleBreak() }],
			/**
			* Break Inside
			* @see https://tailwindcss.com/docs/break-inside
			*/
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			/**
			* Box Decoration Break
			* @see https://tailwindcss.com/docs/box-decoration-break
			*/
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			/**
			* Box Sizing
			* @see https://tailwindcss.com/docs/box-sizing
			*/
			box: [{ box: ["border", "content"] }],
			/**
			* Display
			* @see https://tailwindcss.com/docs/display
			*/
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			/**
			* Screen Reader Only
			* @see https://tailwindcss.com/docs/display#screen-reader-only
			*/
			sr: ["sr-only", "not-sr-only"],
			/**
			* Floats
			* @see https://tailwindcss.com/docs/float
			*/
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			/**
			* Clear
			* @see https://tailwindcss.com/docs/clear
			*/
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			/**
			* Isolation
			* @see https://tailwindcss.com/docs/isolation
			*/
			isolation: ["isolate", "isolation-auto"],
			/**
			* Object Fit
			* @see https://tailwindcss.com/docs/object-fit
			*/
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			/**
			* Object Position
			* @see https://tailwindcss.com/docs/object-position
			*/
			"object-position": [{ object: scalePositionWithArbitrary() }],
			/**
			* Overflow
			* @see https://tailwindcss.com/docs/overflow
			*/
			overflow: [{ overflow: scaleOverflow() }],
			/**
			* Overflow X
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-x": [{ "overflow-x": scaleOverflow() }],
			/**
			* Overflow Y
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-y": [{ "overflow-y": scaleOverflow() }],
			/**
			* Overscroll Behavior
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			overscroll: [{ overscroll: scaleOverscroll() }],
			/**
			* Overscroll Behavior X
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-x": [{ "overscroll-x": scaleOverscroll() }],
			/**
			* Overscroll Behavior Y
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-y": [{ "overscroll-y": scaleOverscroll() }],
			/**
			* Position
			* @see https://tailwindcss.com/docs/position
			*/
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			/**
			* Inset
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			inset: [{ inset: scaleInset() }],
			/**
			* Inset Inline
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-x": [{ "inset-x": scaleInset() }],
			/**
			* Inset Block
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-y": [{ "inset-y": scaleInset() }],
			/**
			* Inset Inline Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			* @todo class group will be renamed to `inset-s` in next major release
			*/
			start: [{
				"inset-s": scaleInset(),
				/**
				* @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
				* @see https://github.com/tailwindlabs/tailwindcss/pull/19613
				*/
				start: scaleInset()
			}],
			/**
			* Inset Inline End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			* @todo class group will be renamed to `inset-e` in next major release
			*/
			end: [{
				"inset-e": scaleInset(),
				/**
				* @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
				* @see https://github.com/tailwindlabs/tailwindcss/pull/19613
				*/
				end: scaleInset()
			}],
			/**
			* Inset Block Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-bs": [{ "inset-bs": scaleInset() }],
			/**
			* Inset Block End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-be": [{ "inset-be": scaleInset() }],
			/**
			* Top
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			top: [{ top: scaleInset() }],
			/**
			* Right
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			right: [{ right: scaleInset() }],
			/**
			* Bottom
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			bottom: [{ bottom: scaleInset() }],
			/**
			* Left
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			left: [{ left: scaleInset() }],
			/**
			* Visibility
			* @see https://tailwindcss.com/docs/visibility
			*/
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			/**
			* Z-Index
			* @see https://tailwindcss.com/docs/z-index
			*/
			z: [{ z: [
				isInteger,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Flex Basis
			* @see https://tailwindcss.com/docs/flex-basis
			*/
			basis: [{ basis: [
				isFraction,
				"full",
				"auto",
				themeContainer,
				...scaleUnambiguousSpacing()
			] }],
			/**
			* Flex Direction
			* @see https://tailwindcss.com/docs/flex-direction
			*/
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			/**
			* Flex Wrap
			* @see https://tailwindcss.com/docs/flex-wrap
			*/
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			/**
			* Flex
			* @see https://tailwindcss.com/docs/flex
			*/
			flex: [{ flex: [
				isNumber,
				isFraction,
				"auto",
				"initial",
				"none",
				isArbitraryValue
			] }],
			/**
			* Flex Grow
			* @see https://tailwindcss.com/docs/flex-grow
			*/
			grow: [{ grow: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Flex Shrink
			* @see https://tailwindcss.com/docs/flex-shrink
			*/
			shrink: [{ shrink: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Order
			* @see https://tailwindcss.com/docs/order
			*/
			order: [{ order: [
				isInteger,
				"first",
				"last",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Grid Template Columns
			* @see https://tailwindcss.com/docs/grid-template-columns
			*/
			"grid-cols": [{ "grid-cols": scaleGridTemplateColsRows() }],
			/**
			* Grid Column Start / End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start-end": [{ col: scaleGridColRowStartAndEnd() }],
			/**
			* Grid Column Start
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start": [{ "col-start": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Column End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-end": [{ "col-end": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Template Rows
			* @see https://tailwindcss.com/docs/grid-template-rows
			*/
			"grid-rows": [{ "grid-rows": scaleGridTemplateColsRows() }],
			/**
			* Grid Row Start / End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start-end": [{ row: scaleGridColRowStartAndEnd() }],
			/**
			* Grid Row Start
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start": [{ "row-start": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Row End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-end": [{ "row-end": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Auto Flow
			* @see https://tailwindcss.com/docs/grid-auto-flow
			*/
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			/**
			* Grid Auto Columns
			* @see https://tailwindcss.com/docs/grid-auto-columns
			*/
			"auto-cols": [{ "auto-cols": scaleGridAutoColsRows() }],
			/**
			* Grid Auto Rows
			* @see https://tailwindcss.com/docs/grid-auto-rows
			*/
			"auto-rows": [{ "auto-rows": scaleGridAutoColsRows() }],
			/**
			* Gap
			* @see https://tailwindcss.com/docs/gap
			*/
			gap: [{ gap: scaleUnambiguousSpacing() }],
			/**
			* Gap X
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-x": [{ "gap-x": scaleUnambiguousSpacing() }],
			/**
			* Gap Y
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-y": [{ "gap-y": scaleUnambiguousSpacing() }],
			/**
			* Justify Content
			* @see https://tailwindcss.com/docs/justify-content
			*/
			"justify-content": [{ justify: [...scaleAlignPrimaryAxis(), "normal"] }],
			/**
			* Justify Items
			* @see https://tailwindcss.com/docs/justify-items
			*/
			"justify-items": [{ "justify-items": [...scaleAlignSecondaryAxis(), "normal"] }],
			/**
			* Justify Self
			* @see https://tailwindcss.com/docs/justify-self
			*/
			"justify-self": [{ "justify-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			/**
			* Align Content
			* @see https://tailwindcss.com/docs/align-content
			*/
			"align-content": [{ content: ["normal", ...scaleAlignPrimaryAxis()] }],
			/**
			* Align Items
			* @see https://tailwindcss.com/docs/align-items
			*/
			"align-items": [{ items: [...scaleAlignSecondaryAxis(), { baseline: ["", "last"] }] }],
			/**
			* Align Self
			* @see https://tailwindcss.com/docs/align-self
			*/
			"align-self": [{ self: [
				"auto",
				...scaleAlignSecondaryAxis(),
				{ baseline: ["", "last"] }
			] }],
			/**
			* Place Content
			* @see https://tailwindcss.com/docs/place-content
			*/
			"place-content": [{ "place-content": scaleAlignPrimaryAxis() }],
			/**
			* Place Items
			* @see https://tailwindcss.com/docs/place-items
			*/
			"place-items": [{ "place-items": [...scaleAlignSecondaryAxis(), "baseline"] }],
			/**
			* Place Self
			* @see https://tailwindcss.com/docs/place-self
			*/
			"place-self": [{ "place-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			/**
			* Padding
			* @see https://tailwindcss.com/docs/padding
			*/
			p: [{ p: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline
			* @see https://tailwindcss.com/docs/padding
			*/
			px: [{ px: scaleUnambiguousSpacing() }],
			/**
			* Padding Block
			* @see https://tailwindcss.com/docs/padding
			*/
			py: [{ py: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline Start
			* @see https://tailwindcss.com/docs/padding
			*/
			ps: [{ ps: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline End
			* @see https://tailwindcss.com/docs/padding
			*/
			pe: [{ pe: scaleUnambiguousSpacing() }],
			/**
			* Padding Block Start
			* @see https://tailwindcss.com/docs/padding
			*/
			pbs: [{ pbs: scaleUnambiguousSpacing() }],
			/**
			* Padding Block End
			* @see https://tailwindcss.com/docs/padding
			*/
			pbe: [{ pbe: scaleUnambiguousSpacing() }],
			/**
			* Padding Top
			* @see https://tailwindcss.com/docs/padding
			*/
			pt: [{ pt: scaleUnambiguousSpacing() }],
			/**
			* Padding Right
			* @see https://tailwindcss.com/docs/padding
			*/
			pr: [{ pr: scaleUnambiguousSpacing() }],
			/**
			* Padding Bottom
			* @see https://tailwindcss.com/docs/padding
			*/
			pb: [{ pb: scaleUnambiguousSpacing() }],
			/**
			* Padding Left
			* @see https://tailwindcss.com/docs/padding
			*/
			pl: [{ pl: scaleUnambiguousSpacing() }],
			/**
			* Margin
			* @see https://tailwindcss.com/docs/margin
			*/
			m: [{ m: scaleMargin() }],
			/**
			* Margin Inline
			* @see https://tailwindcss.com/docs/margin
			*/
			mx: [{ mx: scaleMargin() }],
			/**
			* Margin Block
			* @see https://tailwindcss.com/docs/margin
			*/
			my: [{ my: scaleMargin() }],
			/**
			* Margin Inline Start
			* @see https://tailwindcss.com/docs/margin
			*/
			ms: [{ ms: scaleMargin() }],
			/**
			* Margin Inline End
			* @see https://tailwindcss.com/docs/margin
			*/
			me: [{ me: scaleMargin() }],
			/**
			* Margin Block Start
			* @see https://tailwindcss.com/docs/margin
			*/
			mbs: [{ mbs: scaleMargin() }],
			/**
			* Margin Block End
			* @see https://tailwindcss.com/docs/margin
			*/
			mbe: [{ mbe: scaleMargin() }],
			/**
			* Margin Top
			* @see https://tailwindcss.com/docs/margin
			*/
			mt: [{ mt: scaleMargin() }],
			/**
			* Margin Right
			* @see https://tailwindcss.com/docs/margin
			*/
			mr: [{ mr: scaleMargin() }],
			/**
			* Margin Bottom
			* @see https://tailwindcss.com/docs/margin
			*/
			mb: [{ mb: scaleMargin() }],
			/**
			* Margin Left
			* @see https://tailwindcss.com/docs/margin
			*/
			ml: [{ ml: scaleMargin() }],
			/**
			* Space Between X
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-x": [{ "space-x": scaleUnambiguousSpacing() }],
			/**
			* Space Between X Reverse
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-x-reverse": ["space-x-reverse"],
			/**
			* Space Between Y
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-y": [{ "space-y": scaleUnambiguousSpacing() }],
			/**
			* Space Between Y Reverse
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-y-reverse": ["space-y-reverse"],
			/**
			* Size
			* @see https://tailwindcss.com/docs/width#setting-both-width-and-height
			*/
			size: [{ size: scaleSizing() }],
			/**
			* Inline Size
			* @see https://tailwindcss.com/docs/width
			*/
			"inline-size": [{ inline: ["auto", ...scaleSizingInline()] }],
			/**
			* Min-Inline Size
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-inline-size": [{ "min-inline": ["auto", ...scaleSizingInline()] }],
			/**
			* Max-Inline Size
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-inline-size": [{ "max-inline": ["none", ...scaleSizingInline()] }],
			/**
			* Block Size
			* @see https://tailwindcss.com/docs/height
			*/
			"block-size": [{ block: ["auto", ...scaleSizingBlock()] }],
			/**
			* Min-Block Size
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-block-size": [{ "min-block": ["auto", ...scaleSizingBlock()] }],
			/**
			* Max-Block Size
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-block-size": [{ "max-block": ["none", ...scaleSizingBlock()] }],
			/**
			* Width
			* @see https://tailwindcss.com/docs/width
			*/
			w: [{ w: [
				themeContainer,
				"screen",
				...scaleSizing()
			] }],
			/**
			* Min-Width
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-w": [{ "min-w": [
				themeContainer,
				"screen",
				"none",
				...scaleSizing()
			] }],
			/**
			* Max-Width
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-w": [{ "max-w": [
				themeContainer,
				"screen",
				"none",
				"prose",
				{ screen: [themeBreakpoint] },
				...scaleSizing()
			] }],
			/**
			* Height
			* @see https://tailwindcss.com/docs/height
			*/
			h: [{ h: [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			/**
			* Min-Height
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...scaleSizing()
			] }],
			/**
			* Max-Height
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			/**
			* Font Size
			* @see https://tailwindcss.com/docs/font-size
			*/
			"font-size": [{ text: [
				"base",
				themeText,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			/**
			* Font Smoothing
			* @see https://tailwindcss.com/docs/font-smoothing
			*/
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			/**
			* Font Style
			* @see https://tailwindcss.com/docs/font-style
			*/
			"font-style": ["italic", "not-italic"],
			/**
			* Font Weight
			* @see https://tailwindcss.com/docs/font-weight
			*/
			"font-weight": [{ font: [
				themeFontWeight,
				isArbitraryVariableWeight,
				isArbitraryWeight
			] }],
			/**
			* Font Stretch
			* @see https://tailwindcss.com/docs/font-stretch
			*/
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				isPercent,
				isArbitraryValue
			] }],
			/**
			* Font Family
			* @see https://tailwindcss.com/docs/font-family
			*/
			"font-family": [{ font: [
				isArbitraryVariableFamilyName,
				isArbitraryFamilyName,
				themeFont
			] }],
			/**
			* Font Feature Settings
			* @see https://tailwindcss.com/docs/font-feature-settings
			*/
			"font-features": [{ "font-features": [isArbitraryValue] }],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-normal": ["normal-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-ordinal": ["ordinal"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-slashed-zero": ["slashed-zero"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			/**
			* Letter Spacing
			* @see https://tailwindcss.com/docs/letter-spacing
			*/
			tracking: [{ tracking: [
				themeTracking,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Line Clamp
			* @see https://tailwindcss.com/docs/line-clamp
			*/
			"line-clamp": [{ "line-clamp": [
				isNumber,
				"none",
				isArbitraryVariable,
				isArbitraryNumber
			] }],
			/**
			* Line Height
			* @see https://tailwindcss.com/docs/line-height
			*/
			leading: [{ leading: [themeLeading, ...scaleUnambiguousSpacing()] }],
			/**
			* List Style Image
			* @see https://tailwindcss.com/docs/list-style-image
			*/
			"list-image": [{ "list-image": [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* List Style Position
			* @see https://tailwindcss.com/docs/list-style-position
			*/
			"list-style-position": [{ list: ["inside", "outside"] }],
			/**
			* List Style Type
			* @see https://tailwindcss.com/docs/list-style-type
			*/
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Text Alignment
			* @see https://tailwindcss.com/docs/text-align
			*/
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			/**
			* Placeholder Color
			* @deprecated since Tailwind CSS v3.0.0
			* @see https://v3.tailwindcss.com/docs/placeholder-color
			*/
			"placeholder-color": [{ placeholder: scaleColor() }],
			/**
			* Text Color
			* @see https://tailwindcss.com/docs/text-color
			*/
			"text-color": [{ text: scaleColor() }],
			/**
			* Text Decoration
			* @see https://tailwindcss.com/docs/text-decoration
			*/
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			/**
			* Text Decoration Style
			* @see https://tailwindcss.com/docs/text-decoration-style
			*/
			"text-decoration-style": [{ decoration: [...scaleLineStyle(), "wavy"] }],
			/**
			* Text Decoration Thickness
			* @see https://tailwindcss.com/docs/text-decoration-thickness
			*/
			"text-decoration-thickness": [{ decoration: [
				isNumber,
				"from-font",
				"auto",
				isArbitraryVariable,
				isArbitraryLength
			] }],
			/**
			* Text Decoration Color
			* @see https://tailwindcss.com/docs/text-decoration-color
			*/
			"text-decoration-color": [{ decoration: scaleColor() }],
			/**
			* Text Underline Offset
			* @see https://tailwindcss.com/docs/text-underline-offset
			*/
			"underline-offset": [{ "underline-offset": [
				isNumber,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Text Transform
			* @see https://tailwindcss.com/docs/text-transform
			*/
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			/**
			* Text Overflow
			* @see https://tailwindcss.com/docs/text-overflow
			*/
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			/**
			* Text Wrap
			* @see https://tailwindcss.com/docs/text-wrap
			*/
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			/**
			* Text Indent
			* @see https://tailwindcss.com/docs/text-indent
			*/
			indent: [{ indent: scaleUnambiguousSpacing() }],
			/**
			* Tab Size
			* @see https://tailwindcss.com/docs/tab-size
			*/
			"tab-size": [{ tab: [
				isInteger,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Vertical Alignment
			* @see https://tailwindcss.com/docs/vertical-align
			*/
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Whitespace
			* @see https://tailwindcss.com/docs/whitespace
			*/
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			/**
			* Word Break
			* @see https://tailwindcss.com/docs/word-break
			*/
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			/**
			* Overflow Wrap
			* @see https://tailwindcss.com/docs/overflow-wrap
			*/
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			/**
			* Hyphens
			* @see https://tailwindcss.com/docs/hyphens
			*/
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			/**
			* Content
			* @see https://tailwindcss.com/docs/content
			*/
			content: [{ content: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Background Attachment
			* @see https://tailwindcss.com/docs/background-attachment
			*/
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			/**
			* Background Clip
			* @see https://tailwindcss.com/docs/background-clip
			*/
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			/**
			* Background Origin
			* @see https://tailwindcss.com/docs/background-origin
			*/
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			/**
			* Background Position
			* @see https://tailwindcss.com/docs/background-position
			*/
			"bg-position": [{ bg: scaleBgPosition() }],
			/**
			* Background Repeat
			* @see https://tailwindcss.com/docs/background-repeat
			*/
			"bg-repeat": [{ bg: scaleBgRepeat() }],
			/**
			* Background Size
			* @see https://tailwindcss.com/docs/background-size
			*/
			"bg-size": [{ bg: scaleBgSize() }],
			/**
			* Background Image
			* @see https://tailwindcss.com/docs/background-image
			*/
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					],
					radial: [
						"",
						isArbitraryVariable,
						isArbitraryValue
					],
					conic: [
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					]
				},
				isArbitraryVariableImage,
				isArbitraryImage
			] }],
			/**
			* Background Color
			* @see https://tailwindcss.com/docs/background-color
			*/
			"bg-color": [{ bg: scaleColor() }],
			/**
			* Gradient Color Stops From Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from-pos": [{ from: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops Via Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via-pos": [{ via: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops To Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to-pos": [{ to: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops From
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from": [{ from: scaleColor() }],
			/**
			* Gradient Color Stops Via
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via": [{ via: scaleColor() }],
			/**
			* Gradient Color Stops To
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to": [{ to: scaleColor() }],
			/**
			* Border Radius
			* @see https://tailwindcss.com/docs/border-radius
			*/
			rounded: [{ rounded: scaleRadius() }],
			/**
			* Border Radius Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-s": [{ "rounded-s": scaleRadius() }],
			/**
			* Border Radius End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-e": [{ "rounded-e": scaleRadius() }],
			/**
			* Border Radius Top
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-t": [{ "rounded-t": scaleRadius() }],
			/**
			* Border Radius Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-r": [{ "rounded-r": scaleRadius() }],
			/**
			* Border Radius Bottom
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-b": [{ "rounded-b": scaleRadius() }],
			/**
			* Border Radius Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-l": [{ "rounded-l": scaleRadius() }],
			/**
			* Border Radius Start Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ss": [{ "rounded-ss": scaleRadius() }],
			/**
			* Border Radius Start End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-se": [{ "rounded-se": scaleRadius() }],
			/**
			* Border Radius End End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ee": [{ "rounded-ee": scaleRadius() }],
			/**
			* Border Radius End Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-es": [{ "rounded-es": scaleRadius() }],
			/**
			* Border Radius Top Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tl": [{ "rounded-tl": scaleRadius() }],
			/**
			* Border Radius Top Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tr": [{ "rounded-tr": scaleRadius() }],
			/**
			* Border Radius Bottom Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-br": [{ "rounded-br": scaleRadius() }],
			/**
			* Border Radius Bottom Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-bl": [{ "rounded-bl": scaleRadius() }],
			/**
			* Border Width
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w": [{ border: scaleBorderWidth() }],
			/**
			* Border Width Inline
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-x": [{ "border-x": scaleBorderWidth() }],
			/**
			* Border Width Block
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-y": [{ "border-y": scaleBorderWidth() }],
			/**
			* Border Width Inline Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-s": [{ "border-s": scaleBorderWidth() }],
			/**
			* Border Width Inline End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-e": [{ "border-e": scaleBorderWidth() }],
			/**
			* Border Width Block Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-bs": [{ "border-bs": scaleBorderWidth() }],
			/**
			* Border Width Block End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-be": [{ "border-be": scaleBorderWidth() }],
			/**
			* Border Width Top
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-t": [{ "border-t": scaleBorderWidth() }],
			/**
			* Border Width Right
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-r": [{ "border-r": scaleBorderWidth() }],
			/**
			* Border Width Bottom
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-b": [{ "border-b": scaleBorderWidth() }],
			/**
			* Border Width Left
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-l": [{ "border-l": scaleBorderWidth() }],
			/**
			* Divide Width X
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-x": [{ "divide-x": scaleBorderWidth() }],
			/**
			* Divide Width X Reverse
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-x-reverse": ["divide-x-reverse"],
			/**
			* Divide Width Y
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-y": [{ "divide-y": scaleBorderWidth() }],
			/**
			* Divide Width Y Reverse
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-y-reverse": ["divide-y-reverse"],
			/**
			* Border Style
			* @see https://tailwindcss.com/docs/border-style
			*/
			"border-style": [{ border: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			/**
			* Divide Style
			* @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
			*/
			"divide-style": [{ divide: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			/**
			* Border Color
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color": [{ border: scaleColor() }],
			/**
			* Border Color Inline
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-x": [{ "border-x": scaleColor() }],
			/**
			* Border Color Block
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-y": [{ "border-y": scaleColor() }],
			/**
			* Border Color Inline Start
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-s": [{ "border-s": scaleColor() }],
			/**
			* Border Color Inline End
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-e": [{ "border-e": scaleColor() }],
			/**
			* Border Color Block Start
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-bs": [{ "border-bs": scaleColor() }],
			/**
			* Border Color Block End
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-be": [{ "border-be": scaleColor() }],
			/**
			* Border Color Top
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-t": [{ "border-t": scaleColor() }],
			/**
			* Border Color Right
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-r": [{ "border-r": scaleColor() }],
			/**
			* Border Color Bottom
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-b": [{ "border-b": scaleColor() }],
			/**
			* Border Color Left
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-l": [{ "border-l": scaleColor() }],
			/**
			* Divide Color
			* @see https://tailwindcss.com/docs/divide-color
			*/
			"divide-color": [{ divide: scaleColor() }],
			/**
			* Outline Style
			* @see https://tailwindcss.com/docs/outline-style
			*/
			"outline-style": [{ outline: [
				...scaleLineStyle(),
				"none",
				"hidden"
			] }],
			/**
			* Outline Offset
			* @see https://tailwindcss.com/docs/outline-offset
			*/
			"outline-offset": [{ "outline-offset": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Outline Width
			* @see https://tailwindcss.com/docs/outline-width
			*/
			"outline-w": [{ outline: [
				"",
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			/**
			* Outline Color
			* @see https://tailwindcss.com/docs/outline-color
			*/
			"outline-color": [{ outline: scaleColor() }],
			/**
			* Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow
			*/
			shadow: [{ shadow: [
				"",
				"none",
				themeShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
			*/
			"shadow-color": [{ shadow: scaleColor() }],
			/**
			* Inset Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
			*/
			"inset-shadow": [{ "inset-shadow": [
				"none",
				themeInsetShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Inset Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
			*/
			"inset-shadow-color": [{ "inset-shadow": scaleColor() }],
			/**
			* Ring Width
			* @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
			*/
			"ring-w": [{ ring: scaleBorderWidth() }],
			/**
			* Ring Width Inset
			* @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-w-inset": ["ring-inset"],
			/**
			* Ring Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
			*/
			"ring-color": [{ ring: scaleColor() }],
			/**
			* Ring Offset Width
			* @see https://v3.tailwindcss.com/docs/ring-offset-width
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-offset-w": [{ "ring-offset": [isNumber, isArbitraryLength] }],
			/**
			* Ring Offset Color
			* @see https://v3.tailwindcss.com/docs/ring-offset-color
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-offset-color": [{ "ring-offset": scaleColor() }],
			/**
			* Inset Ring Width
			* @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
			*/
			"inset-ring-w": [{ "inset-ring": scaleBorderWidth() }],
			/**
			* Inset Ring Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
			*/
			"inset-ring-color": [{ "inset-ring": scaleColor() }],
			/**
			* Text Shadow
			* @see https://tailwindcss.com/docs/text-shadow
			*/
			"text-shadow": [{ "text-shadow": [
				"none",
				themeTextShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Text Shadow Color
			* @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
			*/
			"text-shadow-color": [{ "text-shadow": scaleColor() }],
			/**
			* Opacity
			* @see https://tailwindcss.com/docs/opacity
			*/
			opacity: [{ opacity: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Mix Blend Mode
			* @see https://tailwindcss.com/docs/mix-blend-mode
			*/
			"mix-blend": [{ "mix-blend": [
				...scaleBlendMode(),
				"plus-darker",
				"plus-lighter"
			] }],
			/**
			* Background Blend Mode
			* @see https://tailwindcss.com/docs/background-blend-mode
			*/
			"bg-blend": [{ "bg-blend": scaleBlendMode() }],
			/**
			* Mask Clip
			* @see https://tailwindcss.com/docs/mask-clip
			*/
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			/**
			* Mask Composite
			* @see https://tailwindcss.com/docs/mask-composite
			*/
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			/**
			* Mask Image
			* @see https://tailwindcss.com/docs/mask-image
			*/
			"mask-image-linear-pos": [{ "mask-linear": [isNumber] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": scaleMaskImagePosition() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": scaleMaskImagePosition() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": scaleColor() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": scaleColor() }],
			"mask-image-t-from-pos": [{ "mask-t-from": scaleMaskImagePosition() }],
			"mask-image-t-to-pos": [{ "mask-t-to": scaleMaskImagePosition() }],
			"mask-image-t-from-color": [{ "mask-t-from": scaleColor() }],
			"mask-image-t-to-color": [{ "mask-t-to": scaleColor() }],
			"mask-image-r-from-pos": [{ "mask-r-from": scaleMaskImagePosition() }],
			"mask-image-r-to-pos": [{ "mask-r-to": scaleMaskImagePosition() }],
			"mask-image-r-from-color": [{ "mask-r-from": scaleColor() }],
			"mask-image-r-to-color": [{ "mask-r-to": scaleColor() }],
			"mask-image-b-from-pos": [{ "mask-b-from": scaleMaskImagePosition() }],
			"mask-image-b-to-pos": [{ "mask-b-to": scaleMaskImagePosition() }],
			"mask-image-b-from-color": [{ "mask-b-from": scaleColor() }],
			"mask-image-b-to-color": [{ "mask-b-to": scaleColor() }],
			"mask-image-l-from-pos": [{ "mask-l-from": scaleMaskImagePosition() }],
			"mask-image-l-to-pos": [{ "mask-l-to": scaleMaskImagePosition() }],
			"mask-image-l-from-color": [{ "mask-l-from": scaleColor() }],
			"mask-image-l-to-color": [{ "mask-l-to": scaleColor() }],
			"mask-image-x-from-pos": [{ "mask-x-from": scaleMaskImagePosition() }],
			"mask-image-x-to-pos": [{ "mask-x-to": scaleMaskImagePosition() }],
			"mask-image-x-from-color": [{ "mask-x-from": scaleColor() }],
			"mask-image-x-to-color": [{ "mask-x-to": scaleColor() }],
			"mask-image-y-from-pos": [{ "mask-y-from": scaleMaskImagePosition() }],
			"mask-image-y-to-pos": [{ "mask-y-to": scaleMaskImagePosition() }],
			"mask-image-y-from-color": [{ "mask-y-from": scaleColor() }],
			"mask-image-y-to-color": [{ "mask-y-to": scaleColor() }],
			"mask-image-radial": [{ "mask-radial": [isArbitraryVariable, isArbitraryValue] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": scaleMaskImagePosition() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": scaleMaskImagePosition() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": scaleColor() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": scaleColor() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": scalePosition() }],
			"mask-image-conic-pos": [{ "mask-conic": [isNumber] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": scaleMaskImagePosition() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": scaleMaskImagePosition() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": scaleColor() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": scaleColor() }],
			/**
			* Mask Mode
			* @see https://tailwindcss.com/docs/mask-mode
			*/
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			/**
			* Mask Origin
			* @see https://tailwindcss.com/docs/mask-origin
			*/
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			/**
			* Mask Position
			* @see https://tailwindcss.com/docs/mask-position
			*/
			"mask-position": [{ mask: scaleBgPosition() }],
			/**
			* Mask Repeat
			* @see https://tailwindcss.com/docs/mask-repeat
			*/
			"mask-repeat": [{ mask: scaleBgRepeat() }],
			/**
			* Mask Size
			* @see https://tailwindcss.com/docs/mask-size
			*/
			"mask-size": [{ mask: scaleBgSize() }],
			/**
			* Mask Type
			* @see https://tailwindcss.com/docs/mask-type
			*/
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			/**
			* Mask Image
			* @see https://tailwindcss.com/docs/mask-image
			*/
			"mask-image": [{ mask: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Filter
			* @see https://tailwindcss.com/docs/filter
			*/
			filter: [{ filter: [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Blur
			* @see https://tailwindcss.com/docs/blur
			*/
			blur: [{ blur: scaleBlur() }],
			/**
			* Brightness
			* @see https://tailwindcss.com/docs/brightness
			*/
			brightness: [{ brightness: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Contrast
			* @see https://tailwindcss.com/docs/contrast
			*/
			contrast: [{ contrast: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Drop Shadow
			* @see https://tailwindcss.com/docs/drop-shadow
			*/
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				themeDropShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Drop Shadow Color
			* @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
			*/
			"drop-shadow-color": [{ "drop-shadow": scaleColor() }],
			/**
			* Grayscale
			* @see https://tailwindcss.com/docs/grayscale
			*/
			grayscale: [{ grayscale: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Hue Rotate
			* @see https://tailwindcss.com/docs/hue-rotate
			*/
			"hue-rotate": [{ "hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Invert
			* @see https://tailwindcss.com/docs/invert
			*/
			invert: [{ invert: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Saturate
			* @see https://tailwindcss.com/docs/saturate
			*/
			saturate: [{ saturate: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Sepia
			* @see https://tailwindcss.com/docs/sepia
			*/
			sepia: [{ sepia: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Filter
			* @see https://tailwindcss.com/docs/backdrop-filter
			*/
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Blur
			* @see https://tailwindcss.com/docs/backdrop-blur
			*/
			"backdrop-blur": [{ "backdrop-blur": scaleBlur() }],
			/**
			* Backdrop Brightness
			* @see https://tailwindcss.com/docs/backdrop-brightness
			*/
			"backdrop-brightness": [{ "backdrop-brightness": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Contrast
			* @see https://tailwindcss.com/docs/backdrop-contrast
			*/
			"backdrop-contrast": [{ "backdrop-contrast": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Grayscale
			* @see https://tailwindcss.com/docs/backdrop-grayscale
			*/
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Hue Rotate
			* @see https://tailwindcss.com/docs/backdrop-hue-rotate
			*/
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Invert
			* @see https://tailwindcss.com/docs/backdrop-invert
			*/
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Opacity
			* @see https://tailwindcss.com/docs/backdrop-opacity
			*/
			"backdrop-opacity": [{ "backdrop-opacity": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Saturate
			* @see https://tailwindcss.com/docs/backdrop-saturate
			*/
			"backdrop-saturate": [{ "backdrop-saturate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Sepia
			* @see https://tailwindcss.com/docs/backdrop-sepia
			*/
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Border Collapse
			* @see https://tailwindcss.com/docs/border-collapse
			*/
			"border-collapse": [{ border: ["collapse", "separate"] }],
			/**
			* Border Spacing
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing": [{ "border-spacing": scaleUnambiguousSpacing() }],
			/**
			* Border Spacing X
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-x": [{ "border-spacing-x": scaleUnambiguousSpacing() }],
			/**
			* Border Spacing Y
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-y": [{ "border-spacing-y": scaleUnambiguousSpacing() }],
			/**
			* Table Layout
			* @see https://tailwindcss.com/docs/table-layout
			*/
			"table-layout": [{ table: ["auto", "fixed"] }],
			/**
			* Caption Side
			* @see https://tailwindcss.com/docs/caption-side
			*/
			caption: [{ caption: ["top", "bottom"] }],
			/**
			* Transition Property
			* @see https://tailwindcss.com/docs/transition-property
			*/
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Behavior
			* @see https://tailwindcss.com/docs/transition-behavior
			*/
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			/**
			* Transition Duration
			* @see https://tailwindcss.com/docs/transition-duration
			*/
			duration: [{ duration: [
				isNumber,
				"initial",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Timing Function
			* @see https://tailwindcss.com/docs/transition-timing-function
			*/
			ease: [{ ease: [
				"linear",
				"initial",
				themeEase,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Delay
			* @see https://tailwindcss.com/docs/transition-delay
			*/
			delay: [{ delay: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Animation
			* @see https://tailwindcss.com/docs/animation
			*/
			animate: [{ animate: [
				"none",
				themeAnimate,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backface Visibility
			* @see https://tailwindcss.com/docs/backface-visibility
			*/
			backface: [{ backface: ["hidden", "visible"] }],
			/**
			* Perspective
			* @see https://tailwindcss.com/docs/perspective
			*/
			perspective: [{ perspective: [
				themePerspective,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Perspective Origin
			* @see https://tailwindcss.com/docs/perspective-origin
			*/
			"perspective-origin": [{ "perspective-origin": scalePositionWithArbitrary() }],
			/**
			* Rotate
			* @see https://tailwindcss.com/docs/rotate
			*/
			rotate: [{ rotate: scaleRotate() }],
			/**
			* Rotate X
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-x": [{ "rotate-x": scaleRotate() }],
			/**
			* Rotate Y
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-y": [{ "rotate-y": scaleRotate() }],
			/**
			* Rotate Z
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-z": [{ "rotate-z": scaleRotate() }],
			/**
			* Scale
			* @see https://tailwindcss.com/docs/scale
			*/
			scale: [{ scale: scaleScale() }],
			/**
			* Scale X
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-x": [{ "scale-x": scaleScale() }],
			/**
			* Scale Y
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-y": [{ "scale-y": scaleScale() }],
			/**
			* Scale Z
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-z": [{ "scale-z": scaleScale() }],
			/**
			* Scale 3D
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-3d": ["scale-3d"],
			/**
			* Skew
			* @see https://tailwindcss.com/docs/skew
			*/
			skew: [{ skew: scaleSkew() }],
			/**
			* Skew X
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-x": [{ "skew-x": scaleSkew() }],
			/**
			* Skew Y
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-y": [{ "skew-y": scaleSkew() }],
			/**
			* Transform
			* @see https://tailwindcss.com/docs/transform
			*/
			transform: [{ transform: [
				isArbitraryVariable,
				isArbitraryValue,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			/**
			* Transform Origin
			* @see https://tailwindcss.com/docs/transform-origin
			*/
			"transform-origin": [{ origin: scalePositionWithArbitrary() }],
			/**
			* Transform Style
			* @see https://tailwindcss.com/docs/transform-style
			*/
			"transform-style": [{ transform: ["3d", "flat"] }],
			/**
			* Translate
			* @see https://tailwindcss.com/docs/translate
			*/
			translate: [{ translate: scaleTranslate() }],
			/**
			* Translate X
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-x": [{ "translate-x": scaleTranslate() }],
			/**
			* Translate Y
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-y": [{ "translate-y": scaleTranslate() }],
			/**
			* Translate Z
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-z": [{ "translate-z": scaleTranslate() }],
			/**
			* Translate None
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-none": ["translate-none"],
			/**
			* Zoom
			* @see https://tailwindcss.com/docs/zoom
			*/
			zoom: [{ zoom: [
				isInteger,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Accent Color
			* @see https://tailwindcss.com/docs/accent-color
			*/
			accent: [{ accent: scaleColor() }],
			/**
			* Appearance
			* @see https://tailwindcss.com/docs/appearance
			*/
			appearance: [{ appearance: ["none", "auto"] }],
			/**
			* Caret Color
			* @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
			*/
			"caret-color": [{ caret: scaleColor() }],
			/**
			* Color Scheme
			* @see https://tailwindcss.com/docs/color-scheme
			*/
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			/**
			* Cursor
			* @see https://tailwindcss.com/docs/cursor
			*/
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Field Sizing
			* @see https://tailwindcss.com/docs/field-sizing
			*/
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			/**
			* Pointer Events
			* @see https://tailwindcss.com/docs/pointer-events
			*/
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			/**
			* Resize
			* @see https://tailwindcss.com/docs/resize
			*/
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			/**
			* Scroll Behavior
			* @see https://tailwindcss.com/docs/scroll-behavior
			*/
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			/**
			* Scrollbar Thumb Color
			* @see https://tailwindcss.com/docs/scrollbar-color
			*/
			"scrollbar-thumb-color": [{ "scrollbar-thumb": scaleColor() }],
			/**
			* Scrollbar Track Color
			* @see https://tailwindcss.com/docs/scrollbar-color
			*/
			"scrollbar-track-color": [{ "scrollbar-track": scaleColor() }],
			/**
			* Scrollbar Gutter
			* @see https://tailwindcss.com/docs/scrollbar-gutter
			*/
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			/**
			* Scrollbar Width
			* @see https://tailwindcss.com/docs/scrollbar-width
			*/
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			/**
			* Scroll Margin
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-m": [{ "scroll-m": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mx": [{ "scroll-mx": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-my": [{ "scroll-my": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ms": [{ "scroll-ms": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-me": [{ "scroll-me": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mbs": [{ "scroll-mbs": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mbe": [{ "scroll-mbe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Top
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mt": [{ "scroll-mt": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Right
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mr": [{ "scroll-mr": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Bottom
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mb": [{ "scroll-mb": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Left
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ml": [{ "scroll-ml": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-p": [{ "scroll-p": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-px": [{ "scroll-px": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-py": [{ "scroll-py": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-ps": [{ "scroll-ps": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pe": [{ "scroll-pe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pbs": [{ "scroll-pbs": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pbe": [{ "scroll-pbe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Top
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pt": [{ "scroll-pt": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Right
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pr": [{ "scroll-pr": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Bottom
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pb": [{ "scroll-pb": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Left
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pl": [{ "scroll-pl": scaleUnambiguousSpacing() }],
			/**
			* Scroll Snap Align
			* @see https://tailwindcss.com/docs/scroll-snap-align
			*/
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			/**
			* Scroll Snap Stop
			* @see https://tailwindcss.com/docs/scroll-snap-stop
			*/
			"snap-stop": [{ snap: ["normal", "always"] }],
			/**
			* Scroll Snap Type
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			/**
			* Scroll Snap Type Strictness
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			/**
			* Touch Action
			* @see https://tailwindcss.com/docs/touch-action
			*/
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			/**
			* Touch Action X
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			/**
			* Touch Action Y
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			/**
			* Touch Action Pinch Zoom
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-pz": ["touch-pinch-zoom"],
			/**
			* User Select
			* @see https://tailwindcss.com/docs/user-select
			*/
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			/**
			* Will Change
			* @see https://tailwindcss.com/docs/will-change
			*/
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Fill
			* @see https://tailwindcss.com/docs/fill
			*/
			fill: [{ fill: ["none", ...scaleColor()] }],
			/**
			* Stroke Width
			* @see https://tailwindcss.com/docs/stroke-width
			*/
			"stroke-w": [{ stroke: [
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength,
				isArbitraryNumber
			] }],
			/**
			* Stroke
			* @see https://tailwindcss.com/docs/stroke
			*/
			stroke: [{ stroke: ["none", ...scaleColor()] }],
			/**
			* Forced Color Adjust
			* @see https://tailwindcss.com/docs/forced-color-adjust
			*/
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
};
var twMerge = /*#__PURE__*/ createTailwindMerge(getDefaultConfig);
//#endregion
//#region node_modules/.pnpm/@agent-native+toolkit@0.20.4_@floating-ui+dom@1.7.6_@tiptap+extension-code-block@3.28.0_0ff20177eefff338d7ce7908b45858f5/node_modules/@agent-native/toolkit/dist/utils.js
function cn$1(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region node_modules/.pnpm/@agent-native+toolkit@0.20.4_@floating-ui+dom@1.7.6_@tiptap+extension-code-block@3.28.0_0ff20177eefff338d7ce7908b45858f5/node_modules/@agent-native/toolkit/dist/ui/cube-loader.js
var CUBE_DELAYS = [
	90,
	180,
	270,
	0,
	90,
	180,
	90,
	180,
	270
];
var CUBE_ANIMATION_DURATION_MS = 650;
function setRef$2(ref, value) {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
}
function setCubeAnimationPhase(svg, ref) {
	if (svg && typeof window !== "undefined") svg.style.setProperty("--an-cube-loader-phase", `${window.performance.now() % CUBE_ANIMATION_DURATION_MS}ms`);
	setRef$2(ref, svg);
}
function CubeLoader({ absoluteStrokeWidth, className, size, stroke, title, width, height, ref, ...props }) {
	const hasRole = Object.prototype.hasOwnProperty.call(props, "role");
	const isAriaHidden = props["aria-hidden"] === true || props["aria-hidden"] === "true";
	const hasExplicitSize = size !== void 0 || width !== void 0 || height !== void 0;
	const ariaLabel = props["aria-label"] ?? title ?? (hasRole || isAriaHidden ? void 0 : "Loading");
	const role = hasRole ? props.role : isAriaHidden ? void 0 : "status";
	const setRefs = (0, import_react.useCallback)((svg) => setCubeAnimationPhase(svg, ref), [ref]);
	const strokeColor = stroke === void 0 ? void 0 : String(stroke);
	return (0, import_jsx_runtime.jsxs)("svg", {
		...props,
		ref: setRefs,
		role,
		"aria-label": ariaLabel,
		width: width ?? size ?? 24,
		height: height ?? size ?? 24,
		viewBox: "0 0 24 24",
		fill: "currentColor",
		stroke: strokeColor,
		vectorEffect: absoluteStrokeWidth ? "non-scaling-stroke" : props.vectorEffect,
		className: cn$1(!hasExplicitSize && "size-4", className),
		"data-agent-native-cube-loader": "true",
		children: [
			title ? (0, import_jsx_runtime.jsx)("title", { children: title }) : null,
			(0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes an-cube-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.95; }
        }
        .an-cube-cell {
          animation: an-cube-pulse 650ms ease-in-out infinite;
          fill: currentColor;
          opacity: 0.15;
        }
        @media (prefers-reduced-motion: reduce) {
          .an-cube-cell { animation: none; }
        }
      ` }),
			CUBE_DELAYS.map((delay, index) => (0, import_jsx_runtime.jsx)("rect", {
				className: "an-cube-cell",
				x: 2.5 + index % 3 * 7,
				y: 2.5 + Math.floor(index / 3) * 7,
				width: 5,
				height: 5,
				rx: 1,
				style: { animationDelay: `calc(${delay}ms - var(--an-cube-loader-phase, 0ms))` }
			}, index))
		]
	});
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/loading-labels.js
var LOADING_LABELS = [
	"Churning",
	"Accomplishing",
	"Actioning",
	"Actualizing",
	"Architecting",
	"Baking",
	"Befuddling",
	"Booping",
	"Brewing",
	"Calculating",
	"Canoodling",
	"Cerebrating",
	"Clauding",
	"Cogitating",
	"Combobulating",
	"Concocting",
	"Considering",
	"Cooking",
	"Crafting",
	"Creating",
	"Crystallizing",
	"Deciphering",
	"Discombobulating",
	"Doodling",
	"Finagling",
	"Flibbertigibbeting",
	"Generating",
	"Gesticulating",
	"Hatching",
	"Hullaballooing",
	"Ideating",
	"Lollygagging",
	"Manifesting",
	"Meandering",
	"Mulling",
	"Noodling",
	"Percolating",
	"Pondering",
	"Pontificating",
	"Puzzling",
	"Razzmatazzing",
	"Recombobulating",
	"Ruminating",
	"Sautéing",
	"Schlepping",
	"Spelunking",
	"Tinkering",
	"Tomfoolering",
	"Topsy-turvying",
	"Vibing",
	"Wibbling",
	"Wrangling",
	"Zigzagging"
];
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/DefaultSpinner.js
var LOADING_LABEL_INTERVAL_MS = 3e3;
var LOADING_SHIMMER_DURATION_MS = 2600;
var useBrowserLayoutEffect = typeof window === "undefined" ? import_react.useEffect : import_react.useLayoutEffect;
function getInitialLoadingLabelIndex() {
	if (typeof window === "undefined") return 0;
	const index = window.__agentNativeLoadingLabelIndex;
	return typeof index === "number" && Number.isInteger(index) && index >= 0 && index < LOADING_LABELS.length ? index : 0;
}
function getRandomLoadingLabelIndex() {
	return Math.floor(Math.random() * LOADING_LABELS.length);
}
/**
* Full-screen loading spinner rendered during SSR and initial hydration.
* Uses inline layout because Tailwind may not be loaded yet on the server.
* Respects the user's OS color scheme so dark-mode users don't get a white flash.
*/
function DefaultSpinner({ ariaLabel = "Loading", height = "var(--agent-native-viewport-height, 100vh)" }) {
	const [loadingLabelIndex, setLoadingLabelIndex] = (0, import_react.useState)(getInitialLoadingLabelIndex);
	const loadingLabelRef = (0, import_react.useRef)(null);
	useBrowserLayoutEffect(() => {
		const loadingLabel = loadingLabelRef.current;
		if (!loadingLabel) return;
		const width = loadingLabel.scrollWidth;
		if (width > 0) loadingLabel.style.width = `${width}px`;
		loadingLabel.style.animationDelay = `-${window.performance.now() % LOADING_SHIMMER_DURATION_MS}ms`;
	}, [loadingLabelIndex]);
	(0, import_react.useEffect)(() => {
		if (window.__agentNativeLoadingLabelInterval !== void 0) {
			window.clearInterval(window.__agentNativeLoadingLabelInterval);
			delete window.__agentNativeLoadingLabelInterval;
		}
		window.__agentNativeLoadingLabelHydrated = true;
		window.__agentNativeLoadingLabelCleanup?.();
		delete window.__agentNativeLoadingLabelCleanup;
		if (typeof window !== "undefined" && window.__agentNativeLoadingLabelIndex === void 0) setLoadingLabelIndex(getRandomLoadingLabelIndex());
		if (typeof window !== "undefined") delete window.__agentNativeLoadingLabelIndex;
		const interval = window.setInterval(() => {
			setLoadingLabelIndex((index) => (index + 1) % LOADING_LABELS.length);
		}, LOADING_LABEL_INTERVAL_MS);
		return () => window.clearInterval(interval);
	}, []);
	return (0, import_jsx_runtime.jsxs)("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			height,
			width: "100%"
		},
		children: [(0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: 12
			},
			children: [(0, import_jsx_runtime.jsx)(CubeLoader, {
				"aria-label": ariaLabel,
				className: "size-6"
			}), (0, import_jsx_runtime.jsx)("span", {
				ref: loadingLabelRef,
				"data-agent-native-loading-label": "true",
				className: "agent-running-shimmer agent-loading-label",
				style: {
					fontFamily: "ui-sans-serif, system-ui, sans-serif",
					fontSize: 16,
					fontWeight: 500,
					opacity: .65
				},
				children: LOADING_LABELS[loadingLabelIndex]
			})]
		}), (0, import_jsx_runtime.jsx)("style", { children: `
        html {
          background: hsl(var(--background, 0 0% 100%));
          color: hsl(var(--foreground, 240 10% 3.9%));
        }
        @media (prefers-color-scheme: dark) {
          html {
            background: hsl(var(--background, 240 10% 3.9%));
            color: hsl(var(--foreground, 0 0% 98%));
          }
        }
      ` })]
	});
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/require-session.js
/**
* Client-side session gate for an authenticated app shell.
*
* Wrap a template's private app shell with <RequireSession> so a logged-out
* visitor is sent to the framework sign-in page instead of being left staring
* at an infinite loading spinner.
*
* Why this exists in addition to the server-side auth guard (`runAuthGuard`,
* which serves the onboarding/sign-in HTML for unauthenticated requests):
* the server guard only protects requests that actually reach the Nitro
* function. A statically-served / CDN-cached SPA shell, or a client-side
* (React Router) navigation made after the session expired, never re-hits the
* guard — so the app boots with no session, every data query 401s, and the UI
* sticks on its loading state forever. This component closes that gap by
* resolving the session on the client and redirecting when there is none.
*
* Place it INSIDE your providers (so the fallback is themed) but AROUND the
* routed app layout:
*
*   <AppProviders ...>
*     <RequireSession>
*       <AppLayout><Outlet /></AppLayout>
*     </RequireSession>
*   </AppProviders>
*
* Templates with public/anonymous routes (share pages, embeds) must NOT wrap
* their whole app — gate only the private subtree, or pass `bypass` for the
* surfaces that authenticate by another mechanism.
*/
/**
* The sign-in journey for the browser's current location.
*
* `basePath` comes from `appBasePath()` and NEVER from the continuation —
* base-path containment is the only control that stops an unsigned path-only
* continuation from redirecting to a sibling app on a shared workspace host.
*/
function currentJourney(returnTo) {
	const { pathname, search, hash } = window.location;
	return signInJourney({
		at: returnTo ?? pathname + search + hash,
		continuation: new URLSearchParams(search).get("c"),
		legacyReturn: new URLSearchParams(search).get("return"),
		basePath: appBasePath(),
		homePath: window.__AGENT_NATIVE_CONFIG__?.appHomePath
	});
}
/**
* Build the framework sign-in URL that returns the visitor to where they are
* now (or to `returnTo`). Emits the opaque `?c=` continuation.
*
* Returns the bare sign-in path — no continuation — when the browser is
* already at an auth entry path, because there is no such thing as signing in
* from the sign-in page. Callers that navigate must use `signInJourney`
* directly and honour its `signInHref: null`.
*/
function buildSignInReturnHref(opts) {
	const base = appPath(SIGN_IN_ENTRY_PATH);
	if (typeof window === "undefined") return base;
	return currentJourney(opts?.returnTo).signInHref ?? base;
}
function RequireSession({ children, fallback, redirect = true, signedOut, bypass = false }) {
	if (bypass) return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return (0, import_jsx_runtime.jsx)(ResolvedSessionGate, {
		fallback,
		redirect,
		signedOut,
		children
	});
}
function ResolvedSessionGate({ children, fallback, redirect = true, signedOut }) {
	const { session, status, retry } = useSession();
	const redirectedRef = (0, import_react.useRef)(false);
	const mustRedirect = status === "unauthenticated" && redirect;
	(0, import_react.useEffect)(() => {
		if (!mustRedirect) return;
		if (redirectedRef.current) return;
		if (typeof window === "undefined") return;
		const { signInHref } = currentJourney();
		if (!signInHref) return;
		redirectedRef.current = true;
		window.location.replace(signInHref);
	}, [mustRedirect]);
	if (status === "loading") return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: fallback ?? (0, import_jsx_runtime.jsx)(DefaultSpinner, {}) });
	if (status === "unavailable") return (0, import_jsx_runtime.jsx)(SessionUnavailableNotice, { retry });
	if (!session) {
		if (redirect) return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: fallback ?? (0, import_jsx_runtime.jsx)(DefaultSpinner, {}) });
		return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: signedOut ?? null });
	}
	return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function SessionUnavailableNotice({ retry }) {
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen w-full flex-col items-center justify-center gap-4 px-6 text-center",
		children: [
			(0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm text-muted-foreground",
				children: "We couldn't reach the server to confirm your session. This is usually temporary."
			}),
			(0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-xs text-muted-foreground",
				children: "Retry connection checks your session here. Reload page starts the app over."
			}),
			(0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [(0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: retry,
					className: "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground",
					children: "Retry connection"
				}), (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => window.location.reload(),
					className: "rounded-md border border-border px-3 py-1.5 text-sm font-medium",
					children: "Reload page"
				})]
			})
		]
	});
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/subscribable.js
var Subscribable = class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Set();
		this.subscribe = this.subscribe.bind(this);
	}
	subscribe(listener) {
		this.listeners.add(listener);
		this.onSubscribe();
		return () => {
			this.listeners.delete(listener);
			this.onUnsubscribe();
		};
	}
	hasListeners() {
		return this.listeners.size > 0;
	}
	onSubscribe() {}
	onUnsubscribe() {}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/focusManager.js
var FocusManager = class extends Subscribable {
	#focused;
	#cleanup;
	#setup;
	constructor() {
		super();
		this.#setup = (onFocus) => {
			if (typeof window !== "undefined" && window.addEventListener) {
				const listener = () => onFocus();
				window.addEventListener("visibilitychange", listener, false);
				return () => {
					window.removeEventListener("visibilitychange", listener);
				};
			}
		};
	}
	onSubscribe() {
		if (!this.#cleanup) this.setEventListener(this.#setup);
	}
	onUnsubscribe() {
		if (!this.hasListeners()) {
			this.#cleanup?.();
			this.#cleanup = void 0;
		}
	}
	setEventListener(setup) {
		this.#setup = setup;
		this.#cleanup?.();
		this.#cleanup = setup((focused) => {
			if (typeof focused === "boolean") this.setFocused(focused);
			else this.onFocus();
		});
	}
	setFocused(focused) {
		if (this.#focused !== focused) {
			this.#focused = focused;
			this.onFocus();
		}
	}
	onFocus() {
		const isFocused = this.isFocused();
		this.listeners.forEach((listener) => {
			listener(isFocused);
		});
	}
	isFocused() {
		if (typeof this.#focused === "boolean") return this.#focused;
		return globalThis.document?.visibilityState !== "hidden";
	}
};
var focusManager = new FocusManager();
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/timeoutManager.js
var defaultTimeoutProvider = {
	setTimeout: (callback, delay) => setTimeout(callback, delay),
	clearTimeout: (timeoutId) => clearTimeout(timeoutId),
	setInterval: (callback, delay) => setInterval(callback, delay),
	clearInterval: (intervalId) => clearInterval(intervalId)
};
var TimeoutManager = class {
	#provider = defaultTimeoutProvider;
	#providerCalled = false;
	setTimeoutProvider(provider) {
		if (process.env.NODE_ENV !== "production") {
			if (this.#providerCalled && provider !== this.#provider) console.error(`[timeoutManager]: Switching provider after calls to previous provider might result in unexpected behavior.`, {
				previous: this.#provider,
				provider
			});
		}
		this.#provider = provider;
		if (process.env.NODE_ENV !== "production") this.#providerCalled = false;
	}
	setTimeout(callback, delay) {
		if (process.env.NODE_ENV !== "production") this.#providerCalled = true;
		return this.#provider.setTimeout(callback, delay);
	}
	clearTimeout(timeoutId) {
		this.#provider.clearTimeout(timeoutId);
	}
	setInterval(callback, delay) {
		if (process.env.NODE_ENV !== "production") this.#providerCalled = true;
		return this.#provider.setInterval(callback, delay);
	}
	clearInterval(intervalId) {
		this.#provider.clearInterval(intervalId);
	}
};
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
	setTimeout(callback, 0);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/utils.js
var isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop$1() {}
function functionalUpdate(updater, input) {
	return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
	return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
	return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
	return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveQueryBoolean(option, query) {
	return typeof option === "function" ? option(query) : option;
}
function matchQuery(filters, query) {
	const { type = "all", exact, fetchStatus, predicate, queryKey, stale } = filters;
	if (queryKey) {
		if (exact) {
			if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) return false;
		} else if (!partialMatchKey(query.queryKey, queryKey)) return false;
	}
	if (type !== "all") {
		const isActive = query.isActive();
		if (type === "active" && !isActive) return false;
		if (type === "inactive" && isActive) return false;
	}
	if (typeof stale === "boolean" && query.isStale() !== stale) return false;
	if (fetchStatus && fetchStatus !== query.state.fetchStatus) return false;
	if (predicate && !predicate(query)) return false;
	return true;
}
function matchMutation(filters, mutation) {
	const { exact, status, predicate, mutationKey } = filters;
	if (mutationKey) {
		if (!mutation.options.mutationKey) return false;
		if (exact) {
			if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) return false;
		} else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) return false;
	}
	if (status && mutation.state.status !== status) return false;
	if (predicate && !predicate(mutation)) return false;
	return true;
}
function hashQueryKeyByOptions(queryKey, options) {
	return (options?.queryKeyHashFn || hashKey)(queryKey);
}
function hashKey(queryKey) {
	return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
		result[key] = val[key];
		return result;
	}, {}) : val);
}
function partialMatchKey(a, b) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (a && b && typeof a === "object" && typeof b === "object") return Object.keys(b).every((key) => partialMatchKey(a[key], b[key]));
	return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
	if (a === b) return a;
	if (depth > 500) return b;
	const array = isPlainArray(a) && isPlainArray(b);
	if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
	const aSize = (array ? a : Object.keys(a)).length;
	const bItems = array ? b : Object.keys(b);
	const bSize = bItems.length;
	const copy = array ? new Array(bSize) : {};
	let equalItems = 0;
	for (let i = 0; i < bSize; i++) {
		const key = array ? i : bItems[i];
		const aItem = a[key];
		const bItem = b[key];
		if (aItem === bItem) {
			copy[key] = aItem;
			if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
			continue;
		}
		if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
			copy[key] = bItem;
			continue;
		}
		const v = replaceEqualDeep(aItem, bItem, depth + 1);
		copy[key] = v;
		if (v === aItem) equalItems++;
	}
	return aSize === bSize && equalItems === aSize ? a : copy;
}
function shallowEqualObjects(a, b) {
	if (!b || Object.keys(a).length !== Object.keys(b).length) return false;
	for (const key in a) if (a[key] !== b[key]) return false;
	return true;
}
function isPlainArray(value) {
	return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
	if (!hasObjectPrototype(o)) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	const prot = ctor.prototype;
	if (!hasObjectPrototype(prot)) return false;
	if (!prot.hasOwnProperty("isPrototypeOf")) return false;
	if (Object.getPrototypeOf(o) !== Object.prototype) return false;
	return true;
}
function hasObjectPrototype(o) {
	return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
	return new Promise((resolve) => {
		timeoutManager.setTimeout(resolve, timeout);
	});
}
function replaceData(prevData, data, options) {
	if (typeof options.structuralSharing === "function") return options.structuralSharing(prevData, data);
	else if (options.structuralSharing !== false) {
		if (process.env.NODE_ENV !== "production") try {
			return replaceEqualDeep(prevData, data);
		} catch (error) {
			console.error(`Structural sharing requires data to be JSON serializable. To fix this, turn off structuralSharing or return JSON-serializable data from your queryFn. [${options.queryHash}]: ${error}`);
			throw error;
		}
		return replaceEqualDeep(prevData, data);
	}
	return data;
}
function addToEnd(items, item, max = 0) {
	const newItems = [...items, item];
	return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
	const newItems = [item, ...items];
	return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = /* @__PURE__ */ Symbol();
function ensureQueryFn(options, fetchOptions) {
	if (process.env.NODE_ENV !== "production") {
		if (options.queryFn === skipToken) console.error(`Attempted to invoke queryFn when set to skipToken. This is likely a configuration error. Query hash: '${options.queryHash}'`);
	}
	if (!options.queryFn && fetchOptions?.initialPromise) return () => fetchOptions.initialPromise;
	if (!options.queryFn || options.queryFn === skipToken) return () => Promise.reject(/* @__PURE__ */ new Error(`Missing queryFn: '${options.queryHash}'`));
	return options.queryFn;
}
function shouldThrowError(throwOnError, params) {
	if (typeof throwOnError === "function") return throwOnError(...params);
	return !!throwOnError;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
	let consumed = false;
	let signal;
	Object.defineProperty(object, "signal", {
		enumerable: true,
		get: () => {
			signal ??= getSignal();
			if (consumed) return signal;
			consumed = true;
			if (signal.aborted) onCancelled();
			else signal.addEventListener("abort", onCancelled, { once: true });
			return signal;
		}
	});
	return object;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/environmentManager.js
var environmentManager = /* @__PURE__ */ (() => {
	let isServerFn = () => isServer;
	return {
		/**
		* Returns whether the current runtime should be treated as a server environment.
		*/
		isServer() {
			return isServerFn();
		},
		/**
		* Overrides the server check globally.
		*/
		setIsServer(isServerValue) {
			isServerFn = isServerValue;
		}
	};
})();
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/thenable.js
function pendingThenable() {
	let resolve;
	let reject;
	const thenable = new Promise((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});
	thenable.status = "pending";
	thenable.catch(() => {});
	function finalize(data) {
		Object.assign(thenable, data);
		delete thenable.resolve;
		delete thenable.reject;
	}
	thenable.resolve = (value) => {
		finalize({
			status: "fulfilled",
			value
		});
		resolve(value);
	};
	thenable.reject = (reason) => {
		finalize({
			status: "rejected",
			reason
		});
		reject(reason);
	};
	return thenable;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/notifyManager.js
var defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
	let queue = [];
	let transactions = 0;
	let notifyFn = (callback) => {
		callback();
	};
	let batchNotifyFn = (callback) => {
		callback();
	};
	let scheduleFn = defaultScheduler;
	const schedule = (callback) => {
		if (transactions) queue.push(callback);
		else scheduleFn(() => {
			notifyFn(callback);
		});
	};
	const flush = () => {
		const originalQueue = queue;
		queue = [];
		if (originalQueue.length) scheduleFn(() => {
			batchNotifyFn(() => {
				originalQueue.forEach((callback) => {
					notifyFn(callback);
				});
			});
		});
	};
	return {
		batch: (callback) => {
			let result;
			transactions++;
			try {
				result = callback();
			} finally {
				transactions--;
				if (!transactions) flush();
			}
			return result;
		},
		/**
		* All calls to the wrapped function will be batched.
		*/
		batchCalls: (callback) => {
			return (...args) => {
				schedule(() => {
					callback(...args);
				});
			};
		},
		schedule,
		/**
		* Use this method to set a custom notify function.
		* This can be used to for example wrap notifications with `React.act` while running tests.
		*/
		setNotifyFunction: (fn) => {
			notifyFn = fn;
		},
		/**
		* Use this method to set a custom function to batch notifications together into a single tick.
		* By default React Query will use the batch function provided by ReactDOM or React Native.
		*/
		setBatchNotifyFunction: (fn) => {
			batchNotifyFn = fn;
		},
		setScheduler: (fn) => {
			scheduleFn = fn;
		}
	};
}
var notifyManager = createNotifyManager();
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/onlineManager.js
var OnlineManager = class extends Subscribable {
	#online = true;
	#cleanup;
	#setup;
	constructor() {
		super();
		this.#setup = (onOnline) => {
			if (typeof window !== "undefined" && window.addEventListener) {
				const onlineListener = () => onOnline(true);
				const offlineListener = () => onOnline(false);
				window.addEventListener("online", onlineListener, false);
				window.addEventListener("offline", offlineListener, false);
				return () => {
					window.removeEventListener("online", onlineListener);
					window.removeEventListener("offline", offlineListener);
				};
			}
		};
	}
	onSubscribe() {
		if (!this.#cleanup) this.setEventListener(this.#setup);
	}
	onUnsubscribe() {
		if (!this.hasListeners()) {
			this.#cleanup?.();
			this.#cleanup = void 0;
		}
	}
	setEventListener(setup) {
		this.#setup = setup;
		this.#cleanup?.();
		this.#cleanup = setup(this.setOnline.bind(this));
	}
	setOnline(online) {
		if (this.#online !== online) {
			this.#online = online;
			this.listeners.forEach((listener) => {
				listener(online);
			});
		}
	}
	isOnline() {
		return this.#online;
	}
};
var onlineManager = new OnlineManager();
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/retryer.js
function defaultRetryDelay(failureCount) {
	return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
	return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
	constructor(options) {
		super("CancelledError");
		this.revert = options?.revert;
		this.silent = options?.silent;
	}
};
function createRetryer(config) {
	let isRetryCancelled = false;
	let failureCount = 0;
	let continueFn;
	const thenable = pendingThenable();
	const isResolved = () => thenable.status !== "pending";
	const cancel = (cancelOptions) => {
		if (!isResolved()) {
			const error = new CancelledError(cancelOptions);
			reject(error);
			config.onCancel?.(error);
		}
	};
	const cancelRetry = () => {
		isRetryCancelled = true;
	};
	const continueRetry = () => {
		isRetryCancelled = false;
	};
	const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
	const canStart = () => canFetch(config.networkMode) && config.canRun();
	const resolve = (value) => {
		if (!isResolved()) {
			continueFn?.();
			thenable.resolve(value);
		}
	};
	const reject = (value) => {
		if (!isResolved()) {
			continueFn?.();
			thenable.reject(value);
		}
	};
	const pause = () => {
		return new Promise((continueResolve) => {
			continueFn = (value) => {
				if (isResolved() || canContinue()) continueResolve(value);
			};
			config.onPause?.();
		}).then(() => {
			continueFn = void 0;
			if (!isResolved()) config.onContinue?.();
		});
	};
	const run = () => {
		if (isResolved()) return;
		let promiseOrValue;
		const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
		try {
			promiseOrValue = initialPromise ?? config.fn();
		} catch (error) {
			promiseOrValue = Promise.reject(error);
		}
		Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
			if (isResolved()) return;
			const retry = config.retry ?? (environmentManager.isServer() ? 0 : 3);
			const retryDelay = config.retryDelay ?? defaultRetryDelay;
			const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
			const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
			if (isRetryCancelled || !shouldRetry) {
				reject(error);
				return;
			}
			failureCount++;
			config.onFail?.(failureCount, error);
			sleep(delay).then(() => {
				return canContinue() ? void 0 : pause();
			}).then(() => {
				if (isRetryCancelled) reject(error);
				else run();
			});
		});
	};
	return {
		promise: thenable,
		status: () => thenable.status,
		cancel,
		continue: () => {
			continueFn?.();
			return thenable;
		},
		cancelRetry,
		continueRetry,
		canStart,
		start: () => {
			if (canStart()) run();
			else pause().then(run);
			return thenable;
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/removable.js
var Removable = class {
	#gcTimeout;
	destroy() {
		this.clearGcTimeout();
	}
	scheduleGc() {
		this.clearGcTimeout();
		if (isValidTimeout(this.gcTime)) this.#gcTimeout = timeoutManager.setTimeout(() => {
			this.optionalRemove();
		}, this.gcTime);
	}
	updateGcTime(newGcTime) {
		this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (environmentManager.isServer() ? Infinity : 300 * 1e3));
	}
	clearGcTimeout() {
		if (this.#gcTimeout !== void 0) {
			timeoutManager.clearTimeout(this.#gcTimeout);
			this.#gcTimeout = void 0;
		}
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js
function infiniteQueryBehavior(pages) {
	return { onFetch: (context, query) => {
		const options = context.options;
		const direction = context.fetchOptions?.meta?.fetchMore?.direction;
		const oldPages = context.state.data?.pages || [];
		const oldPageParams = context.state.data?.pageParams || [];
		let result = {
			pages: [],
			pageParams: []
		};
		let currentPage = 0;
		const fetchFn = async () => {
			let cancelled = false;
			const addSignalProperty = (object) => {
				addConsumeAwareSignal(object, () => context.signal, () => cancelled = true);
			};
			const queryFn = ensureQueryFn(context.options, context.fetchOptions);
			const fetchPage = async (data, param, previous) => {
				if (cancelled) return Promise.reject(context.signal.reason);
				if (param == null && data.pages.length) return Promise.resolve(data);
				const createQueryFnContext = () => {
					const queryFnContext2 = {
						client: context.client,
						queryKey: context.queryKey,
						pageParam: param,
						direction: previous ? "backward" : "forward",
						meta: context.options.meta
					};
					addSignalProperty(queryFnContext2);
					return queryFnContext2;
				};
				const queryFnContext = createQueryFnContext();
				const page = await queryFn(queryFnContext);
				const { maxPages } = context.options;
				const addTo = previous ? addToStart : addToEnd;
				return {
					pages: addTo(data.pages, page, maxPages),
					pageParams: addTo(data.pageParams, param, maxPages)
				};
			};
			if (direction && oldPages.length) {
				const previous = direction === "backward";
				const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
				const oldData = {
					pages: oldPages,
					pageParams: oldPageParams
				};
				result = await fetchPage(oldData, pageParamFn(options, oldData), previous);
			} else {
				const remainingPages = pages ?? oldPages.length;
				do {
					const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
					if (currentPage > 0 && param == null) break;
					result = await fetchPage(result, param);
					currentPage++;
				} while (currentPage < remainingPages);
			}
			return result;
		};
		if (context.options.persister) context.fetchFn = () => {
			return context.options.persister?.(fetchFn, {
				client: context.client,
				queryKey: context.queryKey,
				meta: context.options.meta,
				signal: context.signal
			}, query);
		};
		else context.fetchFn = fetchFn;
	} };
}
function getNextPageParam(options, { pages, pageParams }) {
	const lastIndex = pages.length - 1;
	return pages.length > 0 ? options.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
	return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/query.js
var Query = class extends Removable {
	#queryType;
	#initialState;
	#revertState;
	#cache;
	#client;
	#retryer;
	#defaultOptions;
	#abortSignalConsumed;
	constructor(config) {
		super();
		this.#abortSignalConsumed = false;
		this.#defaultOptions = config.defaultOptions;
		this.setOptions(config.options);
		this.observers = [];
		this.#client = config.client;
		this.#cache = this.#client.getQueryCache();
		this.queryKey = config.queryKey;
		this.queryHash = config.queryHash;
		this.#initialState = getDefaultState$1(this.options);
		this.state = config.state ?? this.#initialState;
		this.scheduleGc();
	}
	get meta() {
		return this.options.meta;
	}
	get queryType() {
		return this.#queryType;
	}
	get promise() {
		return this.#retryer?.promise;
	}
	setOptions(options) {
		this.options = {
			...this.#defaultOptions,
			...options
		};
		if (options?._type) this.#queryType = options._type;
		this.updateGcTime(this.options.gcTime);
		if (this.state && this.state.data === void 0) {
			const defaultState = getDefaultState$1(this.options);
			if (defaultState.data !== void 0) {
				this.setState(successState(defaultState.data, defaultState.dataUpdatedAt));
				this.#initialState = defaultState;
			}
		}
	}
	optionalRemove() {
		if (!this.observers.length && this.state.fetchStatus === "idle") this.#cache.remove(this);
	}
	setData(newData, options) {
		const data = replaceData(this.state.data, newData, this.options);
		this.#dispatch({
			data,
			type: "success",
			dataUpdatedAt: options?.updatedAt,
			manual: options?.manual
		});
		return data;
	}
	setState(state) {
		this.#dispatch({
			type: "setState",
			state
		});
	}
	cancel(options) {
		const promise = this.#retryer?.promise;
		this.#retryer?.cancel(options);
		return promise ? promise.then(noop$1).catch(noop$1) : Promise.resolve();
	}
	destroy() {
		super.destroy();
		this.cancel({ silent: true });
	}
	get resetState() {
		return this.#initialState;
	}
	reset() {
		this.destroy();
		this.setState(this.resetState);
	}
	isActive() {
		return this.observers.some((observer) => resolveQueryBoolean(observer.options.enabled, this) !== false);
	}
	isDisabled() {
		if (this.getObserversCount() > 0) return !this.isActive();
		return this.options.queryFn === skipToken || !this.isFetched();
	}
	isFetched() {
		return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
	}
	isStatic() {
		if (this.getObserversCount() > 0) return this.observers.some((observer) => resolveStaleTime(observer.options.staleTime, this) === "static");
		return false;
	}
	isStale() {
		if (this.getObserversCount() > 0) return this.observers.some((observer) => observer.getCurrentResult().isStale);
		return this.state.data === void 0 || this.state.isInvalidated;
	}
	isStaleByTime(staleTime = 0) {
		if (this.state.data === void 0) return true;
		if (staleTime === "static") return false;
		if (this.state.isInvalidated) return true;
		return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
	}
	onFocus() {
		this.observers.find((x) => x.shouldFetchOnWindowFocus())?.refetch({ cancelRefetch: false });
		this.#retryer?.continue();
	}
	onOnline() {
		this.observers.find((x) => x.shouldFetchOnReconnect())?.refetch({ cancelRefetch: false });
		this.#retryer?.continue();
	}
	addObserver(observer) {
		if (!this.observers.includes(observer)) {
			this.observers.push(observer);
			this.clearGcTimeout();
			this.#cache.notify({
				type: "observerAdded",
				query: this,
				observer
			});
		}
	}
	removeObserver(observer) {
		if (this.observers.includes(observer)) {
			this.observers = this.observers.filter((x) => x !== observer);
			if (!this.observers.length) {
				if (this.#retryer) if (this.#abortSignalConsumed || this.#isInitialPausedFetch()) this.#retryer.cancel({ revert: true });
				else this.#retryer.cancelRetry();
				this.scheduleGc();
			}
			this.#cache.notify({
				type: "observerRemoved",
				query: this,
				observer
			});
		}
	}
	getObserversCount() {
		return this.observers.length;
	}
	#isInitialPausedFetch() {
		return this.state.fetchStatus === "paused" && this.state.status === "pending";
	}
	invalidate() {
		if (!this.state.isInvalidated) this.#dispatch({ type: "invalidate" });
	}
	async fetch(options, fetchOptions) {
		if (this.state.fetchStatus !== "idle" && this.#retryer?.status() !== "rejected") {
			if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) this.cancel({ silent: true });
			else if (this.#retryer) {
				this.#retryer.continueRetry();
				return this.#retryer.promise;
			}
		}
		if (options) this.setOptions(options);
		if (!this.options.queryFn) {
			const observer = this.observers.find((x) => x.options.queryFn);
			if (observer) this.setOptions(observer.options);
		}
		if (process.env.NODE_ENV !== "production") {
			if (!Array.isArray(this.options.queryKey)) console.error(`As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']`);
		}
		const abortController = new AbortController();
		const addSignalProperty = (object) => {
			Object.defineProperty(object, "signal", {
				enumerable: true,
				get: () => {
					this.#abortSignalConsumed = true;
					return abortController.signal;
				}
			});
		};
		const fetchFn = () => {
			const queryFn = ensureQueryFn(this.options, fetchOptions);
			const createQueryFnContext = () => {
				const queryFnContext2 = {
					client: this.#client,
					queryKey: this.queryKey,
					meta: this.meta
				};
				addSignalProperty(queryFnContext2);
				return queryFnContext2;
			};
			const queryFnContext = createQueryFnContext();
			this.#abortSignalConsumed = false;
			if (this.options.persister) return this.options.persister(queryFn, queryFnContext, this);
			return queryFn(queryFnContext);
		};
		const createFetchContext = () => {
			const context2 = {
				fetchOptions,
				options: this.options,
				queryKey: this.queryKey,
				client: this.#client,
				state: this.state,
				fetchFn
			};
			addSignalProperty(context2);
			return context2;
		};
		const context = createFetchContext();
		(this.#queryType === "infinite" ? infiniteQueryBehavior(this.options.pages) : this.options.behavior)?.onFetch(context, this);
		this.#revertState = this.state;
		if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) this.#dispatch({
			type: "fetch",
			meta: context.fetchOptions?.meta
		});
		this.#retryer = createRetryer({
			initialPromise: fetchOptions?.initialPromise,
			fn: context.fetchFn,
			onCancel: (error) => {
				if (error instanceof CancelledError && error.revert) this.setState({
					...this.#revertState,
					fetchStatus: "idle"
				});
				abortController.abort();
			},
			onFail: (failureCount, error) => {
				this.#dispatch({
					type: "failed",
					failureCount,
					error
				});
			},
			onPause: () => {
				this.#dispatch({ type: "pause" });
			},
			onContinue: () => {
				this.#dispatch({ type: "continue" });
			},
			retry: context.options.retry,
			retryDelay: context.options.retryDelay,
			networkMode: context.options.networkMode,
			canRun: () => true
		});
		try {
			const data = await this.#retryer.start();
			if (data === void 0) {
				if (process.env.NODE_ENV !== "production") console.error(`Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: ${this.queryHash}`);
				throw new Error(`${this.queryHash} data is undefined`);
			}
			this.setData(data);
			this.#cache.config.onSuccess?.(data, this);
			this.#cache.config.onSettled?.(data, this.state.error, this);
			return data;
		} catch (error) {
			if (error instanceof CancelledError) {
				if (error.silent) return this.#retryer.promise;
				else if (error.revert) {
					if (this.state.data === void 0) throw error;
					return this.state.data;
				}
			}
			this.#dispatch({
				type: "error",
				error
			});
			this.#cache.config.onError?.(error, this);
			this.#cache.config.onSettled?.(this.state.data, error, this);
			throw error;
		} finally {
			this.scheduleGc();
		}
	}
	#dispatch(action) {
		const reducer = (state) => {
			switch (action.type) {
				case "failed": return {
					...state,
					fetchFailureCount: action.failureCount,
					fetchFailureReason: action.error
				};
				case "pause": return {
					...state,
					fetchStatus: "paused"
				};
				case "continue": return {
					...state,
					fetchStatus: "fetching"
				};
				case "fetch": return {
					...state,
					...fetchState(state.data, this.options),
					fetchMeta: action.meta ?? null
				};
				case "success":
					const newState = {
						...state,
						...successState(action.data, action.dataUpdatedAt),
						dataUpdateCount: state.dataUpdateCount + 1,
						...!action.manual && {
							fetchStatus: "idle",
							fetchFailureCount: 0,
							fetchFailureReason: null
						}
					};
					this.#revertState = action.manual ? newState : void 0;
					return newState;
				case "error":
					const error = action.error;
					return {
						...state,
						error,
						errorUpdateCount: state.errorUpdateCount + 1,
						errorUpdatedAt: Date.now(),
						fetchFailureCount: state.fetchFailureCount + 1,
						fetchFailureReason: error,
						fetchStatus: "idle",
						status: "error",
						isInvalidated: true
					};
				case "invalidate": return {
					...state,
					isInvalidated: true
				};
				case "setState": return {
					...state,
					...action.state
				};
			}
		};
		this.state = reducer(this.state);
		notifyManager.batch(() => {
			this.observers.forEach((observer) => {
				observer.onQueryUpdate();
			});
			this.#cache.notify({
				query: this,
				type: "updated",
				action
			});
		});
	}
};
function fetchState(data, options) {
	return {
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
		...data === void 0 && {
			error: null,
			status: "pending"
		}
	};
}
function successState(data, dataUpdatedAt) {
	return {
		data,
		dataUpdatedAt: dataUpdatedAt ?? Date.now(),
		error: null,
		isInvalidated: false,
		status: "success"
	};
}
function getDefaultState$1(options) {
	const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
	const hasData = data !== void 0;
	const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
	return {
		data,
		dataUpdateCount: 0,
		dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
		error: null,
		errorUpdateCount: 0,
		errorUpdatedAt: 0,
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchMeta: null,
		isInvalidated: false,
		status: hasData ? "success" : "pending",
		fetchStatus: "idle"
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/queryObserver.js
var QueryObserver = class extends Subscribable {
	constructor(client, options) {
		super();
		this.options = options;
		this.#client = client;
		this.#selectError = null;
		this.#currentThenable = pendingThenable();
		this.bindMethods();
		this.setOptions(options);
	}
	#client;
	#currentQuery = void 0;
	#currentQueryInitialState = void 0;
	#currentResult = void 0;
	#currentResultState;
	#currentResultOptions;
	#currentThenable;
	#selectError;
	#selectFn;
	#selectResult;
	#lastQueryWithDefinedData;
	#staleTimeoutId;
	#refetchIntervalId;
	#currentRefetchInterval;
	#trackedProps = /* @__PURE__ */ new Set();
	bindMethods() {
		this.refetch = this.refetch.bind(this);
	}
	onSubscribe() {
		if (this.listeners.size === 1) {
			this.#currentQuery.addObserver(this);
			if (shouldFetchOnMount(this.#currentQuery, this.options)) this.#executeFetch();
			else this.updateResult();
			this.#updateTimers();
		}
	}
	onUnsubscribe() {
		if (!this.hasListeners()) this.destroy();
	}
	shouldFetchOnReconnect() {
		return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnReconnect);
	}
	shouldFetchOnWindowFocus() {
		return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnWindowFocus);
	}
	destroy() {
		this.listeners = /* @__PURE__ */ new Set();
		this.#clearStaleTimeout();
		this.#clearRefetchInterval();
		this.#currentQuery.removeObserver(this);
	}
	setOptions(options) {
		const prevOptions = this.options;
		const prevQuery = this.#currentQuery;
		this.options = this.#client.defaultQueryOptions(options);
		if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveQueryBoolean(this.options.enabled, this.#currentQuery) !== "boolean") throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");
		this.#updateQuery();
		this.#currentQuery.setOptions(this.options);
		if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) this.#client.getQueryCache().notify({
			type: "observerOptionsUpdated",
			query: this.#currentQuery,
			observer: this
		});
		const mounted = this.hasListeners();
		if (mounted && shouldFetchOptionally(this.#currentQuery, prevQuery, this.options, prevOptions)) this.#executeFetch();
		this.updateResult();
		if (mounted && (this.#currentQuery !== prevQuery || resolveQueryBoolean(this.options.enabled, this.#currentQuery) !== resolveQueryBoolean(prevOptions.enabled, this.#currentQuery) || resolveStaleTime(this.options.staleTime, this.#currentQuery) !== resolveStaleTime(prevOptions.staleTime, this.#currentQuery))) this.#updateStaleTimeout();
		const nextRefetchInterval = this.#computeRefetchInterval();
		if (mounted && (this.#currentQuery !== prevQuery || resolveQueryBoolean(this.options.enabled, this.#currentQuery) !== resolveQueryBoolean(prevOptions.enabled, this.#currentQuery) || nextRefetchInterval !== this.#currentRefetchInterval)) this.#updateRefetchInterval(nextRefetchInterval);
	}
	getOptimisticResult(options) {
		const query = this.#client.getQueryCache().build(this.#client, options);
		const result = this.createResult(query, options);
		if (shouldAssignObserverCurrentProperties(this, result)) {
			this.#currentResult = result;
			this.#currentResultOptions = this.options;
			this.#currentResultState = this.#currentQuery.state;
		}
		return result;
	}
	getCurrentResult() {
		return this.#currentResult;
	}
	trackResult(result, onPropTracked) {
		return new Proxy(result, { get: (target, key) => {
			this.trackProp(key);
			onPropTracked?.(key);
			if (key === "promise") {
				this.trackProp("data");
				if (!this.options.experimental_prefetchInRender && this.#currentThenable.status === "pending") this.#currentThenable.reject(/* @__PURE__ */ new Error("experimental_prefetchInRender feature flag is not enabled"));
			}
			return Reflect.get(target, key);
		} });
	}
	trackProp(key) {
		this.#trackedProps.add(key);
	}
	getCurrentQuery() {
		return this.#currentQuery;
	}
	refetch({ ...options } = {}) {
		return this.fetch({ ...options });
	}
	fetchOptimistic(options) {
		const defaultedOptions = this.#client.defaultQueryOptions(options);
		const query = this.#client.getQueryCache().build(this.#client, defaultedOptions);
		return query.fetch().then(() => this.createResult(query, defaultedOptions));
	}
	fetch(fetchOptions) {
		return this.#executeFetch({
			...fetchOptions,
			cancelRefetch: fetchOptions.cancelRefetch ?? true
		}).then(() => {
			this.updateResult();
			return this.#currentResult;
		});
	}
	#executeFetch(fetchOptions) {
		this.#updateQuery();
		let promise = this.#currentQuery.fetch(this.options, fetchOptions);
		if (!fetchOptions?.throwOnError) promise = promise.catch(noop$1);
		return promise;
	}
	#updateStaleTimeout() {
		this.#clearStaleTimeout();
		const staleTime = resolveStaleTime(this.options.staleTime, this.#currentQuery);
		if (environmentManager.isServer() || this.#currentResult.isStale || !isValidTimeout(staleTime)) return;
		const timeout = timeUntilStale(this.#currentResult.dataUpdatedAt, staleTime) + 1;
		this.#staleTimeoutId = timeoutManager.setTimeout(() => {
			if (!this.#currentResult.isStale) this.updateResult();
		}, timeout);
	}
	#computeRefetchInterval() {
		return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(this.#currentQuery) : this.options.refetchInterval) ?? false;
	}
	#updateRefetchInterval(nextInterval) {
		this.#clearRefetchInterval();
		this.#currentRefetchInterval = nextInterval;
		if (environmentManager.isServer() || resolveQueryBoolean(this.options.enabled, this.#currentQuery) === false || !isValidTimeout(this.#currentRefetchInterval) || this.#currentRefetchInterval === 0) return;
		this.#refetchIntervalId = timeoutManager.setInterval(() => {
			if (this.options.refetchIntervalInBackground || focusManager.isFocused()) this.#executeFetch();
		}, this.#currentRefetchInterval);
	}
	#updateTimers() {
		this.#updateStaleTimeout();
		this.#updateRefetchInterval(this.#computeRefetchInterval());
	}
	#clearStaleTimeout() {
		if (this.#staleTimeoutId !== void 0) {
			timeoutManager.clearTimeout(this.#staleTimeoutId);
			this.#staleTimeoutId = void 0;
		}
	}
	#clearRefetchInterval() {
		if (this.#refetchIntervalId !== void 0) {
			timeoutManager.clearInterval(this.#refetchIntervalId);
			this.#refetchIntervalId = void 0;
		}
	}
	createResult(query, options) {
		const prevQuery = this.#currentQuery;
		const prevOptions = this.options;
		const prevResult = this.#currentResult;
		const prevResultState = this.#currentResultState;
		const prevResultOptions = this.#currentResultOptions;
		const queryInitialState = query !== prevQuery ? query.state : this.#currentQueryInitialState;
		const { state } = query;
		let newState = { ...state };
		let isPlaceholderData = false;
		let data;
		if (options._optimisticResults) {
			const mounted = this.hasListeners();
			const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
			const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
			if (fetchOnMount || fetchOptionally) newState = {
				...newState,
				...fetchState(state.data, query.options)
			};
			if (options._optimisticResults === "isRestoring") newState.fetchStatus = "idle";
		}
		let { error, errorUpdatedAt, status } = newState;
		data = newState.data;
		let skipSelect = false;
		if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
			let placeholderData;
			if (prevResult?.isPlaceholderData && options.placeholderData === prevResultOptions?.placeholderData) {
				placeholderData = prevResult.data;
				skipSelect = true;
			} else placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(this.#lastQueryWithDefinedData?.state.data, this.#lastQueryWithDefinedData) : options.placeholderData;
			if (placeholderData !== void 0) {
				status = "success";
				data = replaceData(prevResult?.data, placeholderData, options);
				isPlaceholderData = true;
			}
		}
		if (options.select && data !== void 0 && !skipSelect) if (prevResult && data === prevResultState?.data && options.select === this.#selectFn) data = this.#selectResult;
		else try {
			this.#selectFn = options.select;
			data = options.select(data);
			data = replaceData(prevResult?.data, data, options);
			this.#selectResult = data;
			this.#selectError = null;
		} catch (selectError) {
			this.#selectError = selectError;
		}
		if (this.#selectError) {
			error = this.#selectError;
			data = this.#selectResult;
			errorUpdatedAt = Date.now();
			status = "error";
		}
		const isFetching = newState.fetchStatus === "fetching";
		const isPending = status === "pending";
		const isError = status === "error";
		const isLoading = isPending && isFetching;
		const hasData = data !== void 0;
		const nextResult = {
			status,
			fetchStatus: newState.fetchStatus,
			isPending,
			isSuccess: status === "success",
			isError,
			isInitialLoading: isLoading,
			isLoading,
			data,
			dataUpdatedAt: newState.dataUpdatedAt,
			error,
			errorUpdatedAt,
			failureCount: newState.fetchFailureCount,
			failureReason: newState.fetchFailureReason,
			errorUpdateCount: newState.errorUpdateCount,
			isFetched: query.isFetched(),
			isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
			isFetching,
			isRefetching: isFetching && !isPending,
			isLoadingError: isError && !hasData,
			isPaused: newState.fetchStatus === "paused",
			isPlaceholderData,
			isRefetchError: isError && hasData,
			isStale: isStale(query, options),
			refetch: this.refetch,
			promise: this.#currentThenable,
			isEnabled: resolveQueryBoolean(options.enabled, query) !== false
		};
		if (this.options.experimental_prefetchInRender) {
			const hasResultData = nextResult.data !== void 0;
			const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
			const finalizeThenableIfPossible = (thenable) => {
				if (isErrorWithoutData) thenable.reject(nextResult.error);
				else if (hasResultData) thenable.resolve(nextResult.data);
			};
			const recreateThenable = () => {
				const pending = this.#currentThenable = nextResult.promise = pendingThenable();
				finalizeThenableIfPossible(pending);
			};
			const prevThenable = this.#currentThenable;
			switch (prevThenable.status) {
				case "pending":
					if (query.queryHash === prevQuery.queryHash) finalizeThenableIfPossible(prevThenable);
					break;
				case "fulfilled":
					if (isErrorWithoutData || nextResult.data !== prevThenable.value) recreateThenable();
					break;
				case "rejected":
					if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) recreateThenable();
					break;
			}
		}
		return nextResult;
	}
	updateResult() {
		const prevResult = this.#currentResult;
		const nextResult = this.createResult(this.#currentQuery, this.options);
		this.#currentResultState = this.#currentQuery.state;
		this.#currentResultOptions = this.options;
		if (this.#currentResultState.data !== void 0) this.#lastQueryWithDefinedData = this.#currentQuery;
		if (shallowEqualObjects(nextResult, prevResult)) return;
		this.#currentResult = nextResult;
		const shouldNotifyListeners = () => {
			if (!prevResult) return true;
			const { notifyOnChangeProps } = this.options;
			const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
			if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !this.#trackedProps.size) return true;
			const includedProps = new Set(notifyOnChangePropsValue ?? this.#trackedProps);
			if (this.options.throwOnError) includedProps.add("error");
			return Object.keys(this.#currentResult).some((key) => {
				const typedKey = key;
				return this.#currentResult[typedKey] !== prevResult[typedKey] && includedProps.has(typedKey);
			});
		};
		this.#notify({ listeners: shouldNotifyListeners() });
	}
	#updateQuery() {
		const query = this.#client.getQueryCache().build(this.#client, this.options);
		if (query === this.#currentQuery) return;
		const prevQuery = this.#currentQuery;
		this.#currentQuery = query;
		this.#currentQueryInitialState = query.state;
		if (this.hasListeners()) {
			prevQuery?.removeObserver(this);
			query.addObserver(this);
		}
	}
	onQueryUpdate() {
		this.updateResult();
		if (this.hasListeners()) this.#updateTimers();
	}
	#notify(notifyOptions) {
		notifyManager.batch(() => {
			if (notifyOptions.listeners) this.listeners.forEach((listener) => {
				listener(this.#currentResult);
			});
			this.#client.getQueryCache().notify({
				query: this.#currentQuery,
				type: "observerResultsUpdated"
			});
		});
	}
};
function shouldLoadOnMount(query, options) {
	return resolveQueryBoolean(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && resolveQueryBoolean(options.retryOnMount, query) === false);
}
function shouldFetchOnMount(query, options) {
	return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
	if (resolveQueryBoolean(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
		const value = typeof field === "function" ? field(query) : field;
		return value === "always" || value !== false && isStale(query, options);
	}
	return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
	return (query !== prevQuery || resolveQueryBoolean(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
	return resolveQueryBoolean(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
	if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) return true;
	return false;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/mutation.js
var Mutation = class extends Removable {
	#client;
	#observers;
	#mutationCache;
	#retryer;
	constructor(config) {
		super();
		this.#client = config.client;
		this.mutationId = config.mutationId;
		this.#mutationCache = config.mutationCache;
		this.#observers = [];
		this.state = config.state || getDefaultState();
		this.setOptions(config.options);
		this.scheduleGc();
	}
	setOptions(options) {
		this.options = options;
		this.updateGcTime(this.options.gcTime);
	}
	get meta() {
		return this.options.meta;
	}
	addObserver(observer) {
		if (!this.#observers.includes(observer)) {
			this.#observers.push(observer);
			this.clearGcTimeout();
			this.#mutationCache.notify({
				type: "observerAdded",
				mutation: this,
				observer
			});
		}
	}
	removeObserver(observer) {
		this.#observers = this.#observers.filter((x) => x !== observer);
		this.scheduleGc();
		this.#mutationCache.notify({
			type: "observerRemoved",
			mutation: this,
			observer
		});
	}
	optionalRemove() {
		if (!this.#observers.length) if (this.state.status === "pending") this.scheduleGc();
		else this.#mutationCache.remove(this);
	}
	continue() {
		return this.#retryer?.continue() ?? this.execute(this.state.variables);
	}
	async execute(variables) {
		const onContinue = () => {
			this.#dispatch({ type: "continue" });
		};
		const mutationFnContext = {
			client: this.#client,
			meta: this.options.meta,
			mutationKey: this.options.mutationKey
		};
		this.#retryer = createRetryer({
			fn: () => {
				if (!this.options.mutationFn) return Promise.reject(/* @__PURE__ */ new Error("No mutationFn found"));
				return this.options.mutationFn(variables, mutationFnContext);
			},
			onFail: (failureCount, error) => {
				this.#dispatch({
					type: "failed",
					failureCount,
					error
				});
			},
			onPause: () => {
				this.#dispatch({ type: "pause" });
			},
			onContinue,
			retry: this.options.retry ?? 0,
			retryDelay: this.options.retryDelay,
			networkMode: this.options.networkMode,
			canRun: () => this.#mutationCache.canRun(this)
		});
		const restored = this.state.status === "pending";
		const isPaused = !this.#retryer.canStart();
		try {
			if (restored) onContinue();
			else {
				this.#dispatch({
					type: "pending",
					variables,
					isPaused
				});
				if (this.#mutationCache.config.onMutate) await this.#mutationCache.config.onMutate(variables, this, mutationFnContext);
				const context = await this.options.onMutate?.(variables, mutationFnContext);
				if (context !== this.state.context) this.#dispatch({
					type: "pending",
					context,
					variables,
					isPaused
				});
			}
			const data = await this.#retryer.start();
			await this.#mutationCache.config.onSuccess?.(data, variables, this.state.context, this, mutationFnContext);
			await this.options.onSuccess?.(data, variables, this.state.context, mutationFnContext);
			await this.#mutationCache.config.onSettled?.(data, null, this.state.variables, this.state.context, this, mutationFnContext);
			await this.options.onSettled?.(data, null, variables, this.state.context, mutationFnContext);
			this.#dispatch({
				type: "success",
				data
			});
			return data;
		} catch (error) {
			try {
				await this.#mutationCache.config.onError?.(error, variables, this.state.context, this, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onError?.(error, variables, this.state.context, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.#mutationCache.config.onSettled?.(void 0, error, this.state.variables, this.state.context, this, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onSettled?.(void 0, error, variables, this.state.context, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			this.#dispatch({
				type: "error",
				error
			});
			throw error;
		} finally {
			this.#mutationCache.runNext(this);
		}
	}
	#dispatch(action) {
		const reducer = (state) => {
			switch (action.type) {
				case "failed": return {
					...state,
					failureCount: action.failureCount,
					failureReason: action.error
				};
				case "pause": return {
					...state,
					isPaused: true
				};
				case "continue": return {
					...state,
					isPaused: false
				};
				case "pending": return {
					...state,
					context: action.context,
					data: void 0,
					failureCount: 0,
					failureReason: null,
					error: null,
					isPaused: action.isPaused,
					status: "pending",
					variables: action.variables,
					submittedAt: Date.now()
				};
				case "success": return {
					...state,
					data: action.data,
					failureCount: 0,
					failureReason: null,
					error: null,
					status: "success",
					isPaused: false
				};
				case "error": return {
					...state,
					data: void 0,
					error: action.error,
					failureCount: state.failureCount + 1,
					failureReason: action.error,
					isPaused: false,
					status: "error"
				};
			}
		};
		this.state = reducer(this.state);
		notifyManager.batch(() => {
			this.#observers.forEach((observer) => {
				observer.onMutationUpdate(action);
			});
			this.#mutationCache.notify({
				mutation: this,
				type: "updated",
				action
			});
		});
	}
};
function getDefaultState() {
	return {
		context: void 0,
		data: void 0,
		error: null,
		failureCount: 0,
		failureReason: null,
		isPaused: false,
		status: "idle",
		variables: void 0,
		submittedAt: 0
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+react-query@5.101.2_react@19.2.7/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var QueryClientContext = import_react.createContext(void 0);
var useQueryClient = (queryClient) => {
	const client = import_react.useContext(QueryClientContext);
	if (queryClient) return queryClient;
	if (!client) throw new Error("No QueryClient set, use QueryClientProvider to set one");
	return client;
};
var QueryClientProvider = ({ client, children }) => {
	import_react.useEffect(() => {
		client.mount();
		return () => {
			client.unmount();
		};
	}, [client]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientContext.Provider, {
		value: client,
		children
	});
};
//#endregion
//#region node_modules/.pnpm/@tanstack+react-query@5.101.2_react@19.2.7/node_modules/@tanstack/react-query/build/modern/IsRestoringProvider.js
var IsRestoringContext = import_react.createContext(false);
var useIsRestoring = () => import_react.useContext(IsRestoringContext);
IsRestoringContext.Provider;
//#endregion
//#region node_modules/.pnpm/@tanstack+react-query@5.101.2_react@19.2.7/node_modules/@tanstack/react-query/build/modern/QueryErrorResetBoundary.js
function createValue() {
	let isReset = false;
	return {
		clearReset: () => {
			isReset = false;
		},
		reset: () => {
			isReset = true;
		},
		isReset: () => {
			return isReset;
		}
	};
}
var QueryErrorResetBoundaryContext = import_react.createContext(createValue());
var useQueryErrorResetBoundary = () => import_react.useContext(QueryErrorResetBoundaryContext);
//#endregion
//#region node_modules/.pnpm/@tanstack+react-query@5.101.2_react@19.2.7/node_modules/@tanstack/react-query/build/modern/errorBoundaryUtils.js
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
	const throwOnError = query?.state.error && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
	if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
		if (!errorResetBoundary.isReset()) options.retryOnMount = false;
	}
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
	import_react.useEffect(() => {
		errorResetBoundary.clearReset();
	}, [errorResetBoundary]);
};
var getHasError = ({ result, errorResetBoundary, throwOnError, query, suspense }) => {
	return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
//#endregion
//#region node_modules/.pnpm/@tanstack+react-query@5.101.2_react@19.2.7/node_modules/@tanstack/react-query/build/modern/suspense.js
var ensureSuspenseTimers = (defaultedOptions) => {
	if (defaultedOptions.suspense) {
		const MIN_SUSPENSE_TIME_MS = 1e3;
		const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
		const originalStaleTime = defaultedOptions.staleTime;
		defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
		if (typeof defaultedOptions.gcTime === "number") defaultedOptions.gcTime = Math.max(defaultedOptions.gcTime, MIN_SUSPENSE_TIME_MS);
	}
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => defaultedOptions?.suspense && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
	errorResetBoundary.clearReset();
});
//#endregion
//#region node_modules/.pnpm/@tanstack+react-query@5.101.2_react@19.2.7/node_modules/@tanstack/react-query/build/modern/useBaseQuery.js
function useBaseQuery(options, Observer, queryClient) {
	if (process.env.NODE_ENV !== "production") {
		if (typeof options !== "object" || Array.isArray(options)) throw new Error("Bad argument type. Starting with v5, only the \"Object\" form is allowed when calling query related functions. Please use the error stack to find the culprit call. More info here: https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5#supports-a-single-signature-one-object");
	}
	const isRestoring = useIsRestoring();
	const errorResetBoundary = useQueryErrorResetBoundary();
	const client = useQueryClient(queryClient);
	const defaultedOptions = client.defaultQueryOptions(options);
	client.getDefaultOptions().queries?._experimental_beforeQuery?.(defaultedOptions);
	const query = client.getQueryCache().get(defaultedOptions.queryHash);
	if (process.env.NODE_ENV !== "production") {
		if (!defaultedOptions.queryFn) console.error(`[${defaultedOptions.queryHash}]: No queryFn was passed as an option, and no default queryFn was found. The queryFn parameter is only optional when using a default queryFn. More info here: https://tanstack.com/query/latest/docs/framework/react/guides/default-query-function`);
	}
	const subscribed = options.subscribed !== false;
	defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : subscribed ? "optimistic" : void 0;
	ensureSuspenseTimers(defaultedOptions);
	ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
	useClearResetErrorBoundary(errorResetBoundary);
	const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
	const [observer] = import_react.useState(() => new Observer(client, defaultedOptions));
	const result = observer.getOptimisticResult(defaultedOptions);
	const shouldSubscribe = !isRestoring && subscribed;
	import_react.useSyncExternalStore(import_react.useCallback((onStoreChange) => {
		const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop$1;
		observer.updateResult();
		return unsubscribe;
	}, [observer, shouldSubscribe]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	import_react.useEffect(() => {
		observer.setOptions(defaultedOptions);
	}, [defaultedOptions, observer]);
	if (shouldSuspend(defaultedOptions, result)) throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
	if (getHasError({
		result,
		errorResetBoundary,
		throwOnError: defaultedOptions.throwOnError,
		query,
		suspense: defaultedOptions.suspense
	})) throw result.error;
	client.getDefaultOptions().queries?._experimental_afterQuery?.(defaultedOptions, result);
	if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) (isNewCacheEntry ? fetchOptimistic(defaultedOptions, observer, errorResetBoundary) : query?.promise)?.catch(noop$1).finally(() => {
		observer.updateResult();
	});
	return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+react-query@5.101.2_react@19.2.7/node_modules/@tanstack/react-query/build/modern/useQuery.js
function useQuery(options, queryClient) {
	return useBaseQuery(options, QueryObserver, queryClient);
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/use-action.js
var ACTION_PREFIX = agentNativePath("/_agent-native/actions");
/**
* Upper bound on how long a single action fetch may stay in flight (headers
* AND body). Converts a hung server/proxy/connection into a visible, typed
* failure instead of a UI that spins forever. Generous on purpose: it sits
* above every server-side budget (serverless function limits, hosted run
* wall-clock), so it only fires when something is genuinely stuck.
*/
var DEFAULT_ACTION_TIMEOUT_MS = 6e4;
/**
* Resolve the browser's IANA timezone (e.g. "America/Los_Angeles"). This is
* sent on every action request as `x-user-timezone` so server-side defaults
* like "today" honor the user's local day rather than the server's UTC clock.
*/
function resolveUserTimezone() {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || void 0;
	} catch {
		return;
	}
}
function serializeActionQueryParams(params) {
	const qs = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) appendActionQueryParam(qs, key, value);
	return qs.toString();
}
function appendActionQueryParam(qs, key, value) {
	if (value === null || value === void 0) return;
	if (Array.isArray(value)) {
		for (const item of value) appendActionQueryParam(qs, `${key}[]`, item);
		return;
	}
	if (typeof value === "object") {
		qs.append(key, JSON.stringify(value));
		return;
	}
	qs.append(key, String(value));
}
async function performActionFetch(name, method, params, options) {
	ensureEmbedAuthFetchInterceptor();
	let url = `${ACTION_PREFIX}/${name}`;
	const browserTabId = getBrowserTabId();
	const headers = {
		"Content-Type": "application/json",
		"X-Agent-Native-Browser-Tab": browserTabId,
		"X-Agent-Native-Frontend": "1",
		...options?.includeRequestSource !== false ? { "X-Request-Source": browserTabId } : {}
	};
	const compatibilityVersion = clientCompatibilityVersion();
	if (compatibilityVersion) headers["X-Agent-Native-Client-Compatibility"] = compatibilityVersion;
	const buildId = clientBuildId();
	if (buildId) headers["X-Agent-Native-Build-Id"] = buildId;
	const tz = resolveUserTimezone();
	if (tz) headers["x-user-timezone"] = tz;
	const browserSessionId = getOrCreateAnalyticsSessionId();
	if (browserSessionId) headers["X-Agent-Native-Session-Id"] = browserSessionId;
	headers[ANALYTICS_CLIENT_PLATFORM_HEADER] = getAnalyticsClientPlatform();
	const init = {
		method,
		headers,
		cache: "no-store",
		keepalive: options?.keepalive
	};
	if (method === "GET" && params && Object.keys(params).length > 0) {
		const qs = serializeActionQueryParams(params);
		if (qs) url += `?${qs}`;
	} else if (method !== "GET" && params) init.body = options?.serializedBody ?? JSON.stringify(params);
	const outerSignal = options?.signal;
	const timeoutMs = options?.timeoutMs ?? DEFAULT_ACTION_TIMEOUT_MS;
	const controller = typeof AbortController === "undefined" ? null : new AbortController();
	const onOuterAbort = () => controller?.abort();
	if (outerSignal && controller) if (outerSignal.aborted) controller.abort();
	else outerSignal.addEventListener("abort", onOuterAbort, { once: true });
	let timedOut = false;
	const timeoutError = () => {
		const error = /* @__PURE__ */ new Error(`Action ${name} timed out after ${Math.round(timeoutMs / 1e3)}s`);
		error.timedOut = true;
		error.status = 408;
		return error;
	};
	const throwTimeout = () => {
		throw timeoutError();
	};
	let rejectTimedOut = () => {};
	const timedOutSignal = new Promise((_resolve, reject) => {
		rejectTimedOut = reject;
	});
	const timer = setTimeout(() => {
		timedOut = true;
		controller?.abort();
		rejectTimedOut(timeoutError());
	}, timeoutMs);
	if (controller) init.signal = controller.signal;
	let res;
	let raw = "";
	let readFailed = false;
	let readError;
	try {
		try {
			res = await Promise.race([fetch(url, init), timedOutSignal]);
			options?.onResponse?.(res);
		} catch (err) {
			if (timedOut) throwTimeout();
			if (outerSignal?.aborted) throw err;
			const cause = err instanceof Error ? err.message : String(err);
			throw new Error(`Action ${name} failed: ${cause}`);
		}
		if (res.status === 409 && res.headers.get("X-Agent-Native-Client-Mismatch") === "1") {
			reloadForClientCompatibilityMismatch(res.headers.get("X-Agent-Native-Build-Id") ?? "latest", res.headers.get("X-Agent-Native-Client-Compatibility") ?? "unknown");
			const error = /* @__PURE__ */ new Error(`Action ${name} requires a refreshed browser client`);
			error.status = 409;
			error.code = "client_build_mismatch";
			throw error;
		}
		if (res.status === 204) return null;
		try {
			raw = await Promise.race([res.text(), timedOutSignal]);
		} catch (err) {
			if (timedOut) throwTimeout();
			if (outerSignal?.aborted) throw err;
			readFailed = true;
			readError = err;
		}
	} finally {
		clearTimeout(timer);
		if (outerSignal) outerSignal.removeEventListener("abort", onOuterAbort);
	}
	let data = void 0;
	let parseFailed = false;
	if (raw.length > 0) try {
		data = JSON.parse(raw);
	} catch {
		parseFailed = true;
	}
	if (!res.ok) {
		if (res.status === 401) recheckSessionAfterUnauthorized();
		const authored = typeof data?.error === "string" && data.error ? data.error : typeof data?.message === "string" && data.message ? data.message : void 0;
		const message = authored || raw && raw.slice(0, 200) || res.statusText || `HTTP ${res.status}`;
		if (res.status === 405) {
			const requiredMethod = /\bUse (GET|POST|PUT|DELETE)\b/.exec(message)?.[1];
			const error = /* @__PURE__ */ new Error(`Action ${name} was called with ${method}, but it declares http: { method: "${requiredMethod ?? "?"}" }. Pass { method: "${requiredMethod ?? "..."}" } to this call (or use the hook that defaults to it) to match the action's declared method.`);
			error.status = 405;
			error.code = "action_method_mismatch";
			error.sentMethod = method;
			if (requiredMethod) error.requiredMethod = requiredMethod;
			throw error;
		}
		const error = /* @__PURE__ */ new Error(`Action ${name} failed: ${message}`);
		error.status = res.status;
		if (authored !== void 0) error.actionMessage = authored;
		if (typeof data?.errorCode === "string") error.errorCode = data.errorCode;
		if (data?.details && typeof data.details === "object" && !Array.isArray(data.details)) error.details = data.details;
		throw error;
	}
	if (readFailed) {
		const cause = readError instanceof Error ? readError.message : String(readError);
		const error = /* @__PURE__ */ new Error(`Action ${name} returned ${res.status} but the body could not be read: ${cause}`);
		error.status = res.status;
		throw error;
	}
	if (parseFailed) {
		const error = /* @__PURE__ */ new Error(`Action ${name} returned a non-JSON ${res.status} response: ${raw.slice(0, 200)}`);
		error.status = res.status;
		throw error;
	}
	return data ?? null;
}
function actionTelemetryNow() {
	return typeof performance !== "undefined" ? performance.now() : Date.now();
}
function parseServerTiming(response) {
	const timings = /* @__PURE__ */ new Map();
	const value = response?.headers.get("server-timing");
	if (!value) return timings;
	for (const entry of value.split(",")) {
		const [rawName, ...params] = entry.trim().split(";");
		const name = rawName?.trim();
		if (!name) continue;
		const duration = params.map((param) => /^dur=(.+)$/i.exec(param.trim())?.[1]).find(Boolean);
		const parsed = duration === void 0 ? NaN : Number(duration);
		if (Number.isFinite(parsed)) timings.set(name, parsed);
	}
	return timings;
}
function shouldTrackActionResponse(error, durationMs, response) {
	if (error || durationMs >= 1e3) return true;
	if (response && response.status >= 400 && response.status < 500) return true;
	if (/\bstartup(?:-db)?\s*;/i.test(response?.headers.get("server-timing") ?? "")) return true;
	const parsed = .1;
	return Math.random() < (Number.isFinite(parsed) ? Math.max(0, Math.min(1, parsed)) : .1);
}
async function actionFetch(name, method, params, options) {
	assertAgentNativeApiEnabled(`${method} ${name}`);
	const startedAt = actionTelemetryNow();
	let response;
	let responseAt;
	let error;
	try {
		return await performActionFetch(name, method, params, {
			...options,
			onResponse: (nextResponse) => {
				response = nextResponse;
				responseAt = actionTelemetryNow();
			}
		});
	} catch (caught) {
		error = caught;
		throw caught;
	} finally {
		try {
			const completedAt = actionTelemetryNow();
			const durationMs = Math.max(0, completedAt - startedAt);
			if (shouldTrackActionResponse(error, durationMs, response)) {
				const ttfbMs = responseAt === void 0 ? void 0 : Math.max(0, responseAt - startedAt);
				const serverTiming = parseServerTiming(response);
				const serverDurationMs = serverTiming.get("app");
				const errorStatus = Number(error?.status);
				const statusCode = response?.status ?? (Number.isFinite(errorStatus) ? errorStatus : void 0);
				const timedOut = error?.timedOut === true;
				const cancelled = options?.signal?.aborted === true && !timedOut;
				const contentLength = Number(response?.headers.get("content-length"));
				trackEvent("action.response", {
					request_id: response?.headers.get("x-agent-native-request-id") ?? void 0,
					action: name,
					method,
					status_code: statusCode,
					status_class: statusCode === void 0 ? "network" : `${Math.floor(statusCode / 100)}xx`,
					success: !error,
					outcome: !error ? "success" : timedOut ? "timeout" : cancelled ? "cancelled" : response ? "http-error" : "network-error",
					duration_ms: Math.round(durationMs),
					ttfb_ms: ttfbMs === void 0 ? void 0 : Math.round(ttfbMs),
					body_ms: ttfbMs === void 0 ? void 0 : Math.round(durationMs - ttfbMs),
					server_duration_ms: serverDurationMs === void 0 ? void 0 : Math.round(serverDurationMs),
					network_overhead_ms: ttfbMs === void 0 || serverDurationMs === void 0 ? void 0 : Math.max(0, Math.round(ttfbMs - serverDurationMs)),
					framework_ready_wait_ms: serverTiming.get("startup"),
					db_operation_wall_ms: serverTiming.get("db"),
					db_connect_total_ms: serverTiming.get("db-connect"),
					db_slowest_operation_ms: serverTiming.get("db-slowest"),
					startup_db_operation_wall_ms: serverTiming.get("startup-db"),
					startup_db_connect_total_ms: serverTiming.get("startup-db-connect"),
					response_bytes: Number.isFinite(contentLength) && contentLength >= 0 ? contentLength : void 0
				});
			}
		} catch {}
	}
}
/**
* Imperatively call an action from browser/client code.
*
* Prefer `useActionQuery` / `useActionMutation` in React render flows. Use this
* helper when a hook is not ergonomic; do not hand-write fetch calls to
* `/_agent-native/actions/*` in components.
*/
function callAction(actionName, params, options = {}) {
	return actionFetch(actionName, options.method ?? "POST", params, {
		signal: options.signal,
		timeoutMs: options.timeoutMs,
		includeRequestSource: false
	});
}
typeof window !== "undefined" && window.document && window.document.createElement;
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
	return function handleEvent(event) {
		originalEventHandler?.(event);
		if (checkForDefaultPrevented === false || !event || !event.defaultPrevented) return ourEventHandler?.(event);
	};
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.3_@types+react@19.2.17_react@19.2.7/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
function setRef$1(ref, value) {
	if (typeof ref === "function") return ref(value);
	else if (ref !== null && ref !== void 0) ref.current = value;
}
function composeRefs(...refs) {
	return (node) => {
		let hasCleanup = false;
		const cleanups = refs.map((ref) => {
			const cleanup = setRef$1(ref, node);
			if (!hasCleanup && typeof cleanup == "function") hasCleanup = true;
			return cleanup;
		});
		if (hasCleanup) return () => {
			for (let i = 0; i < cleanups.length; i++) {
				const cleanup = cleanups[i];
				if (typeof cleanup == "function") cleanup();
				else setRef$1(refs[i], null);
			}
		};
	};
}
function useComposedRefs(...refs) {
	return import_react.useCallback(composeRefs(...refs), refs);
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-context@1.2.0_@types+react@19.2.17_react@19.2.7/node_modules/@radix-ui/react-context/dist/index.mjs
function createContextScope(scopeName, createContextScopeDeps = []) {
	let defaultContexts = [];
	function createContext3(rootComponentName, defaultContext) {
		const BaseContext = import_react.createContext(defaultContext);
		BaseContext.displayName = rootComponentName + "Context";
		const index = defaultContexts.length;
		defaultContexts = [...defaultContexts, defaultContext];
		const Provider = (props) => {
			const { scope, children, ...context } = props;
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const value = import_react.useMemo(() => context, Object.values(context));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Context.Provider, {
				value,
				children
			});
		};
		Provider.displayName = rootComponentName + "Provider";
		function useContext2(consumerName, scope, options = {}) {
			const { optional = false } = options;
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const context = import_react.useContext(Context);
			if (context) return context;
			if (defaultContext !== void 0) return defaultContext;
			if (optional) return void 0;
			throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
		}
		return [Provider, useContext2];
	}
	const createScope = () => {
		const scopeContexts = defaultContexts.map((defaultContext) => {
			return import_react.createContext(defaultContext);
		});
		return function useScope(scope) {
			const contexts = scope?.[scopeName] || scopeContexts;
			return import_react.useMemo(() => ({ [`__scope${scopeName}`]: {
				...scope,
				[scopeName]: contexts
			} }), [scope, contexts]);
		};
	};
	createScope.scopeName = scopeName;
	return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
	const baseScope = scopes[0];
	if (scopes.length === 1) return baseScope;
	const createScope = () => {
		const scopeHooks = scopes.map((createScope2) => ({
			useScope: createScope2(),
			scopeName: createScope2.scopeName
		}));
		return function useComposedScopes(overrideScopes) {
			const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
				const currentScope = useScope(overrideScopes)[`__scope${scopeName}`];
				return {
					...nextScopes2,
					...currentScope
				};
			}, {});
			return import_react.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
		};
	};
	createScope.scopeName = baseScope.scopeName;
	return createScope;
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-slot@1.3.0_@types+react@19.2.17_react@19.2.7/node_modules/@radix-ui/react-slot/dist/index.mjs
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
	const Slot2 = import_react.forwardRef((props, forwardedRef) => {
		let { children, ...slotProps } = props;
		let slottableElement = null;
		let hasSlottable = false;
		const newChildren = [];
		if (isLazyComponent(children) && typeof use$1 === "function") children = use$1(children._payload);
		import_react.Children.forEach(children, (maybeSlottable) => {
			if (isSlottable(maybeSlottable)) {
				hasSlottable = true;
				const slottable = maybeSlottable;
				let child = "child" in slottable.props ? slottable.props.child : slottable.props.children;
				if (isLazyComponent(child) && typeof use$1 === "function") child = use$1(child._payload);
				slottableElement = getSlottableElementFromSlottable(slottable, child);
				newChildren.push(slottableElement?.props?.children);
			} else newChildren.push(maybeSlottable);
		});
		if (slottableElement) slottableElement = import_react.cloneElement(slottableElement, void 0, newChildren);
		else if (!hasSlottable && import_react.Children.count(children) === 1 && import_react.isValidElement(children)) slottableElement = children;
		const slottableElementRef = slottableElement ? getElementRef$1(slottableElement) : void 0;
		const composedRef = useComposedRefs(forwardedRef, slottableElementRef);
		if (!slottableElement) {
			if (children || children === 0) throw new Error(hasSlottable ? createSlottableError(ownerName) : createSlotError(ownerName));
			return children;
		}
		const mergedProps = mergeProps(slotProps, slottableElement.props ?? {});
		if (slottableElement.type !== import_react.Fragment) mergedProps.ref = forwardedRef ? composedRef : slottableElementRef;
		return import_react.cloneElement(slottableElement, mergedProps);
	});
	Slot2.displayName = `${ownerName}.Slot`;
	return Slot2;
}
var Slot$1 = /* @__PURE__ */ createSlot("Slot");
var SLOTTABLE_IDENTIFIER = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
	const Slottable2 = (props) => "child" in props ? props.children(props.child) : props.children;
	Slottable2.displayName = `${ownerName}.Slottable`;
	Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
	return Slottable2;
}
var getSlottableElementFromSlottable = (slottable, child) => {
	if ("child" in slottable.props) {
		const child2 = slottable.props.child;
		if (!import_react.isValidElement(child2)) return null;
		return import_react.cloneElement(child2, void 0, slottable.props.children(child2.props.children));
	}
	return import_react.isValidElement(child) ? child : null;
};
function mergeProps(slotProps, childProps) {
	const overrideProps = { ...childProps };
	for (const propName in childProps) {
		const slotPropValue = slotProps[propName];
		const childPropValue = childProps[propName];
		if (/^on[A-Z]/.test(propName)) {
			if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
				const result = childPropValue(...args);
				slotPropValue(...args);
				return result;
			};
			else if (slotPropValue) overrideProps[propName] = slotPropValue;
		} else if (propName === "style") overrideProps[propName] = {
			...slotPropValue,
			...childPropValue
		};
		else if (propName === "className") overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
	}
	return {
		...slotProps,
		...overrideProps
	};
}
function getElementRef$1(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
function isSlottable(child) {
	return import_react.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
function isLazyComponent(element) {
	return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
function isPromiseLike(value) {
	return typeof value === "object" && value !== null && "then" in value;
}
var createSlotError = (ownerName) => {
	return `${ownerName} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`;
};
var createSlottableError = (ownerName) => {
	return `${ownerName} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`;
};
var use$1 = import_react[" use ".trim().toString()];
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-primitive@2.1.7_@types+react-dom@19.2.3_@types+react@19.2.17__@types+re_6d8fb7f79176be78f7d41dc3e06e6146/node_modules/@radix-ui/react-primitive/dist/index.mjs
var Primitive = [
	"a",
	"button",
	"div",
	"form",
	"h2",
	"h3",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"select",
	"span",
	"svg",
	"ul"
].reduce((primitive, node) => {
	const Slot = /* @__PURE__ */ createSlot(`Primitive.${node}`);
	const Node = import_react.forwardRef((props, forwardedRef) => {
		const { asChild, ...primitiveProps } = props;
		const Comp = asChild ? Slot : node;
		if (typeof window !== "undefined") window[Symbol.for("radix-ui")] = true;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
			...primitiveProps,
			ref: forwardedRef
		});
	});
	Node.displayName = `Primitive.${node}`;
	return {
		...primitive,
		[node]: Node
	};
}, {});
function dispatchDiscreteCustomEvent(target, event) {
	if (target) import_react_dom.flushSync(() => target.dispatchEvent(event));
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.2_@types+react@19.2.17_react@19.2.7/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
function useCallbackRef$1(callback) {
	const callbackRef = import_react.useRef(callback);
	import_react.useEffect(() => {
		callbackRef.current = callback;
	});
	return import_react.useMemo(() => ((...args) => callbackRef.current?.(...args)), []);
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-dismissable-layer@1.1.15_@types+react-dom@19.2.3_@types+react@19.2.17___d2630c6c9beec12e5ce95e8b16c8d437/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
var DISMISSABLE_LAYER_NAME = "DismissableLayer";
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = import_react.createContext({
	layers: /* @__PURE__ */ new Set(),
	layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
	branches: /* @__PURE__ */ new Set(),
	dismissableSurfaces: /* @__PURE__ */ new Set()
});
var DismissableLayer = import_react.forwardRef((props, forwardedRef) => {
	const { disableOutsidePointerEvents = false, deferPointerDownOutside = false, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, ...layerProps } = props;
	const context = import_react.useContext(DismissableLayerContext);
	const [node, setNode] = import_react.useState(null);
	const ownerDocument = node?.ownerDocument ?? globalThis?.document;
	const [, force] = import_react.useState({});
	const composedRefs = useComposedRefs(forwardedRef, setNode);
	const layers = Array.from(context.layers);
	const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
	const highestLayerWithOutsidePointerEventsDisabledIndex = highestLayerWithOutsidePointerEventsDisabled ? layers.indexOf(highestLayerWithOutsidePointerEventsDisabled) : -1;
	const index = node ? layers.indexOf(node) : -1;
	const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
	const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
	const isDeferredPointerDownOutsideRef = import_react.useRef(false);
	const pointerDownOutside = usePointerDownOutside((event) => {
		onPointerDownOutside?.(event);
		onInteractOutside?.(event);
		if (!event.defaultPrevented) onDismiss?.();
	}, {
		ownerDocument,
		deferPointerDownOutside,
		isDeferredPointerDownOutsideRef,
		dismissableSurfaces: context.dismissableSurfaces,
		shouldHandlePointerDownOutside: import_react.useCallback((target) => {
			if (!(target instanceof Node)) return false;
			const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
			return isPointerEventsEnabled && !isPointerDownOnBranch;
		}, [context.branches, isPointerEventsEnabled])
	});
	const focusOutside = useFocusOutside((event) => {
		if (deferPointerDownOutside && isDeferredPointerDownOutsideRef.current) return;
		const target = event.target;
		if ([...context.branches].some((branch) => branch.contains(target))) return;
		onFocusOutside?.(event);
		onInteractOutside?.(event);
		if (!event.defaultPrevented) onDismiss?.();
	}, ownerDocument);
	const isHighestLayer = node ? index === layers.length - 1 : false;
	const handleKeyDown = useCallbackRef$1((event) => {
		if (event.key !== "Escape") return;
		onEscapeKeyDown?.(event);
		if (!event.defaultPrevented && onDismiss) {
			event.preventDefault();
			onDismiss();
		}
	});
	import_react.useEffect(() => {
		if (!isHighestLayer) return;
		ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
	}, [
		ownerDocument,
		isHighestLayer,
		handleKeyDown
	]);
	import_react.useEffect(() => {
		if (!node) return;
		if (disableOutsidePointerEvents) {
			if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
				originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
				ownerDocument.body.style.pointerEvents = "none";
			}
			context.layersWithOutsidePointerEventsDisabled.add(node);
		}
		context.layers.add(node);
		dispatchUpdate();
		return () => {
			if (disableOutsidePointerEvents) {
				context.layersWithOutsidePointerEventsDisabled.delete(node);
				if (context.layersWithOutsidePointerEventsDisabled.size === 0) ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
			}
		};
	}, [
		node,
		ownerDocument,
		disableOutsidePointerEvents,
		context
	]);
	import_react.useEffect(() => {
		return () => {
			if (!node) return;
			context.layers.delete(node);
			context.layersWithOutsidePointerEventsDisabled.delete(node);
			dispatchUpdate();
		};
	}, [node, context]);
	import_react.useEffect(() => {
		const handleUpdate = () => force({});
		document.addEventListener(CONTEXT_UPDATE, handleUpdate);
		return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		...layerProps,
		ref: composedRefs,
		style: {
			pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
			...props.style
		},
		onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
		onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
		onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, pointerDownOutside.onPointerDownCapture)
	});
});
DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
var BRANCH_NAME = "DismissableLayerBranch";
var DismissableLayerBranch = import_react.forwardRef((props, forwardedRef) => {
	const context = import_react.useContext(DismissableLayerContext);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	import_react.useEffect(() => {
		const node = ref.current;
		if (node) {
			context.branches.add(node);
			return () => {
				context.branches.delete(node);
			};
		}
	}, [context.branches]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		...props,
		ref: composedRefs
	});
});
DismissableLayerBranch.displayName = BRANCH_NAME;
function useDismissableLayerSurface() {
	const context = import_react.useContext(DismissableLayerContext);
	const [node, setNode] = import_react.useState(null);
	import_react.useEffect(() => {
		if (!node) return;
		context.dismissableSurfaces.add(node);
		return () => {
			context.dismissableSurfaces.delete(node);
		};
	}, [node, context.dismissableSurfaces]);
	return setNode;
}
var IS_TRUE = () => true;
function usePointerDownOutside(onPointerDownOutside, args) {
	const { ownerDocument = globalThis?.document, deferPointerDownOutside = false, isDeferredPointerDownOutsideRef, dismissableSurfaces, shouldHandlePointerDownOutside = IS_TRUE } = args;
	const handlePointerDownOutside = useCallbackRef$1(onPointerDownOutside);
	const isPointerInsideReactTreeRef = import_react.useRef(false);
	const isPointerDownOutsideRef = import_react.useRef(false);
	const interceptedOutsideInteractionEventsRef = import_react.useRef(/* @__PURE__ */ new Map());
	const handleClickRef = import_react.useRef(() => {});
	import_react.useEffect(() => {
		function resetOutsideInteraction() {
			isPointerDownOutsideRef.current = false;
			isDeferredPointerDownOutsideRef.current = false;
			interceptedOutsideInteractionEventsRef.current.clear();
		}
		function isOutsideInteractionIntercepted() {
			return Array.from(interceptedOutsideInteractionEventsRef.current.values()).some(Boolean);
		}
		function handleInteractionCapture(event) {
			if (!isPointerDownOutsideRef.current) return;
			const target = event.target;
			if (!(target instanceof Node && [...dismissableSurfaces].some((surface) => surface.contains(target)))) interceptedOutsideInteractionEventsRef.current.set(event.type, true);
			if (event.type === "click") window.setTimeout(() => {
				if (isPointerDownOutsideRef.current) handleClickRef.current();
			}, 0);
		}
		function handleInteractionBubble(event) {
			if (isPointerDownOutsideRef.current) interceptedOutsideInteractionEventsRef.current.set(event.type, false);
		}
		const handlePointerDown = (event) => {
			if (event.target && !isPointerInsideReactTreeRef.current) {
				let handleAndDispatchPointerDownOutsideEvent2 = function() {
					ownerDocument.removeEventListener("click", handleClickRef.current);
					const wasOutsideInteractionIntercepted = isOutsideInteractionIntercepted();
					resetOutsideInteraction();
					if (!wasOutsideInteractionIntercepted) handleAndDispatchCustomEvent(POINTER_DOWN_OUTSIDE, handlePointerDownOutside, eventDetail, { discrete: true });
				};
				if (!shouldHandlePointerDownOutside(event.target)) {
					ownerDocument.removeEventListener("click", handleClickRef.current);
					resetOutsideInteraction();
					isPointerInsideReactTreeRef.current = false;
					return;
				}
				const eventDetail = { originalEvent: event };
				isPointerDownOutsideRef.current = true;
				isDeferredPointerDownOutsideRef.current = deferPointerDownOutside && event.button === 0;
				interceptedOutsideInteractionEventsRef.current.clear();
				if (!deferPointerDownOutside || event.button !== 0) handleAndDispatchPointerDownOutsideEvent2();
				else {
					ownerDocument.removeEventListener("click", handleClickRef.current);
					handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
					ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
				}
			} else {
				ownerDocument.removeEventListener("click", handleClickRef.current);
				resetOutsideInteraction();
			}
			isPointerInsideReactTreeRef.current = false;
		};
		const outsideInteractionEvents = [
			"pointerup",
			"mousedown",
			"mouseup",
			"touchstart",
			"touchend",
			"click"
		];
		for (const eventName of outsideInteractionEvents) {
			ownerDocument.addEventListener(eventName, handleInteractionCapture, true);
			ownerDocument.addEventListener(eventName, handleInteractionBubble);
		}
		const timerId = window.setTimeout(() => {
			ownerDocument.addEventListener("pointerdown", handlePointerDown);
		}, 0);
		return () => {
			window.clearTimeout(timerId);
			ownerDocument.removeEventListener("pointerdown", handlePointerDown);
			ownerDocument.removeEventListener("click", handleClickRef.current);
			for (const eventName of outsideInteractionEvents) {
				ownerDocument.removeEventListener(eventName, handleInteractionCapture, true);
				ownerDocument.removeEventListener(eventName, handleInteractionBubble);
			}
		};
	}, [
		ownerDocument,
		handlePointerDownOutside,
		deferPointerDownOutside,
		isDeferredPointerDownOutsideRef,
		dismissableSurfaces,
		shouldHandlePointerDownOutside
	]);
	return { onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true };
}
function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
	const handleFocusOutside = useCallbackRef$1(onFocusOutside);
	const isFocusInsideReactTreeRef = import_react.useRef(false);
	import_react.useEffect(() => {
		const handleFocus = (event) => {
			if (event.target && !isFocusInsideReactTreeRef.current) handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, { originalEvent: event }, { discrete: false });
		};
		ownerDocument.addEventListener("focusin", handleFocus);
		return () => ownerDocument.removeEventListener("focusin", handleFocus);
	}, [ownerDocument, handleFocusOutside]);
	return {
		onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
		onBlurCapture: () => isFocusInsideReactTreeRef.current = false
	};
}
function dispatchUpdate() {
	const event = new CustomEvent(CONTEXT_UPDATE);
	document.dispatchEvent(event);
}
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
	const target = detail.originalEvent.target;
	const event = new CustomEvent(name, {
		bubbles: false,
		cancelable: true,
		detail
	});
	if (handler) target.addEventListener(name, handler, { once: true });
	if (discrete) dispatchDiscreteCustomEvent(target, event);
	else target.dispatchEvent(event);
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.1.2_@types+react@19.2.17_react@19.2.7/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
var useLayoutEffect2 = globalThis?.document ? import_react.useLayoutEffect : () => {};
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-id@1.1.2_@types+react@19.2.17_react@19.2.7/node_modules/@radix-ui/react-id/dist/index.mjs
var useReactId = import_react[" useId ".trim().toString()] || (() => void 0);
var count$1 = 0;
function useId(deterministicId) {
	const [id, setId] = import_react.useState(useReactId());
	useLayoutEffect2(() => {
		if (!deterministicId) setId((reactId) => reactId ?? String(count$1++));
	}, [deterministicId]);
	return deterministicId || (id ? `radix-${id}` : "");
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
/**
* Custom positioning reference element.
* @see https://floating-ui.com/docs/virtual-elements
*/
var sides = [
	"top",
	"right",
	"bottom",
	"left"
];
var min = Math.min;
var max = Math.max;
var round = Math.round;
var floor = Math.floor;
var createCoords = (v) => ({
	x: v,
	y: v
});
var oppositeSideMap = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function clamp(start, value, end) {
	return max(start, min(value, end));
}
function evaluate(value, param) {
	return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
	return placement.split("-")[0];
}
function getAlignment(placement) {
	return placement.split("-")[1];
}
function getOppositeAxis(axis) {
	return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
	return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
	const firstChar = placement[0];
	return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
	return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
	if (rtl === void 0) rtl = false;
	const alignment = getAlignment(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const length = getAxisLength(alignmentAxis);
	let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
	if (rects.reference[length] > rects.floating[length]) mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
	return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
	const oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeAlignmentPlacement(placement),
		oppositePlacement,
		getOppositeAlignmentPlacement(oppositePlacement)
	];
}
function getOppositeAlignmentPlacement(placement) {
	return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
var lrPlacement = ["left", "right"];
var rlPlacement = ["right", "left"];
var tbPlacement = ["top", "bottom"];
var btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
	switch (side) {
		case "top":
		case "bottom":
			if (rtl) return isStart ? rlPlacement : lrPlacement;
			return isStart ? lrPlacement : rlPlacement;
		case "left":
		case "right": return isStart ? tbPlacement : btPlacement;
		default: return [];
	}
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
	const alignment = getAlignment(placement);
	let list = getSideList(getSide(placement), direction === "start", rtl);
	if (alignment) {
		list = list.map((side) => side + "-" + alignment);
		if (flipAlignment) list = list.concat(list.map(getOppositeAlignmentPlacement));
	}
	return list;
}
function getOppositePlacement(placement) {
	const side = getSide(placement);
	return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...padding
	};
}
function getPaddingObject(padding) {
	return typeof padding !== "number" ? expandPaddingObject(padding) : {
		top: padding,
		right: padding,
		bottom: padding,
		left: padding
	};
}
function rectToClientRect(rect) {
	const { x, y, width, height } = rect;
	return {
		width,
		height,
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		x,
		y
	};
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+core@1.7.5/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
	let { reference, floating } = _ref;
	const sideAxis = getSideAxis(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const alignLength = getAxisLength(alignmentAxis);
	const side = getSide(placement);
	const isVertical = sideAxis === "y";
	const commonX = reference.x + reference.width / 2 - floating.width / 2;
	const commonY = reference.y + reference.height / 2 - floating.height / 2;
	const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
	let coords;
	switch (side) {
		case "top":
			coords = {
				x: commonX,
				y: reference.y - floating.height
			};
			break;
		case "bottom":
			coords = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case "right":
			coords = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case "left":
			coords = {
				x: reference.x - floating.width,
				y: commonY
			};
			break;
		default: coords = {
			x: reference.x,
			y: reference.y
		};
	}
	switch (getAlignment(placement)) {
		case "start":
			coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
			break;
		case "end":
			coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
			break;
	}
	return coords;
}
/**
* Resolves with an object of overflow side offsets that determine how much the
* element is overflowing a given clipping boundary on each side.
* - positive = overflowing the boundary by that number of pixels
* - negative = how many pixels left before it will overflow
* - 0 = lies flush with the boundary
* @see https://floating-ui.com/docs/detectOverflow
*/
async function detectOverflow(state, options) {
	var _await$platform$isEle;
	if (options === void 0) options = {};
	const { x, y, platform, rects, elements, strategy } = state;
	const { boundary = "clippingAncestors", rootBoundary = "viewport", elementContext = "floating", altBoundary = false, padding = 0 } = evaluate(options, state);
	const paddingObject = getPaddingObject(padding);
	const element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext];
	const clippingClientRect = rectToClientRect(await platform.getClippingRect({
		element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
		boundary,
		rootBoundary,
		strategy
	}));
	const rect = elementContext === "floating" ? {
		x,
		y,
		width: rects.floating.width,
		height: rects.floating.height
	} : rects.reference;
	const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
	const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) ? await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
		x: 1,
		y: 1
	} : {
		x: 1,
		y: 1
	};
	const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements,
		rect,
		offsetParent,
		strategy
	}) : rect);
	return {
		top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
		bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
		left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
		right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
	};
}
var MAX_RESET_COUNT = 50;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*
* This export does not have any `platform` interface logic. You will need to
* write one for the platform you are using Floating UI with.
*/
var computePosition$1 = async (reference, floating, config) => {
	const { placement = "bottom", strategy = "absolute", middleware = [], platform } = config;
	const platformWithDetectOverflow = platform.detectOverflow ? platform : {
		...platform,
		detectOverflow
	};
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
	let rects = await platform.getElementRects({
		reference,
		floating,
		strategy
	});
	let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
	let statefulPlacement = placement;
	let resetCount = 0;
	const middlewareData = {};
	for (let i = 0; i < middleware.length; i++) {
		const currentMiddleware = middleware[i];
		if (!currentMiddleware) continue;
		const { name, fn } = currentMiddleware;
		const { x: nextX, y: nextY, data, reset } = await fn({
			x,
			y,
			initialPlacement: placement,
			placement: statefulPlacement,
			strategy,
			middlewareData,
			rects,
			platform: platformWithDetectOverflow,
			elements: {
				reference,
				floating
			}
		});
		x = nextX != null ? nextX : x;
		y = nextY != null ? nextY : y;
		middlewareData[name] = {
			...middlewareData[name],
			...data
		};
		if (reset && resetCount < MAX_RESET_COUNT) {
			resetCount++;
			if (typeof reset === "object") {
				if (reset.placement) statefulPlacement = reset.placement;
				if (reset.rects) rects = reset.rects === true ? await platform.getElementRects({
					reference,
					floating,
					strategy
				}) : reset.rects;
				({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
			}
			i = -1;
		}
	}
	return {
		x,
		y,
		placement: statefulPlacement,
		strategy,
		middlewareData
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$3 = (options) => ({
	name: "arrow",
	options,
	async fn(state) {
		const { x, y, placement, rects, platform, elements, middlewareData } = state;
		const { element, padding = 0 } = evaluate(options, state) || {};
		if (element == null) return {};
		const paddingObject = getPaddingObject(padding);
		const coords = {
			x,
			y
		};
		const axis = getAlignmentAxis(placement);
		const length = getAxisLength(axis);
		const arrowDimensions = await platform.getDimensions(element);
		const isYAxis = axis === "y";
		const minProp = isYAxis ? "top" : "left";
		const maxProp = isYAxis ? "bottom" : "right";
		const clientProp = isYAxis ? "clientHeight" : "clientWidth";
		const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
		const startDiff = coords[axis] - rects.reference[axis];
		const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
		let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
		if (!clientSize || !await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent))) clientSize = elements.floating[clientProp] || rects.floating[length];
		const centerToReference = endDiff / 2 - startDiff / 2;
		const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
		const minPadding = min(paddingObject[minProp], largestPossiblePadding);
		const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
		const min$1 = minPadding;
		const max = clientSize - arrowDimensions[length] - maxPadding;
		const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
		const offset = clamp(min$1, center, max);
		const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
		const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
		return {
			[axis]: coords[axis] + alignmentOffset,
			data: {
				[axis]: offset,
				centerOffset: center - offset - alignmentOffset,
				...shouldAddOffset && { alignmentOffset }
			},
			reset: shouldAddOffset
		};
	}
});
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "flip",
		options,
		async fn(state) {
			var _middlewareData$arrow, _middlewareData$flip;
			const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = "bestFit", fallbackAxisSideDirection = "none", flipAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
			if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			const side = getSide(placement);
			const initialSideAxis = getSideAxis(initialPlacement);
			const isBasePlacement = getSide(initialPlacement) === initialPlacement;
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
			const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
			const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
			if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
			const placements = [initialPlacement, ...fallbackPlacements];
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const overflows = [];
			let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
			if (checkMainAxis) overflows.push(overflow[side]);
			if (checkCrossAxis) {
				const sides = getAlignmentSides(placement, rects, rtl);
				overflows.push(overflow[sides[0]], overflow[sides[1]]);
			}
			overflowsData = [...overflowsData, {
				placement,
				overflows
			}];
			if (!overflows.every((side) => side <= 0)) {
				var _middlewareData$flip2, _overflowsData$filter;
				const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
				const nextPlacement = placements[nextIndex];
				if (nextPlacement) {
					if (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false) || overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) return {
						data: {
							index: nextIndex,
							overflows: overflowsData
						},
						reset: { placement: nextPlacement }
					};
				}
				let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
				if (!resetPlacement) switch (fallbackStrategy) {
					case "bestFit": {
						var _overflowsData$filter2;
						const placement = (_overflowsData$filter2 = overflowsData.filter((d) => {
							if (hasFallbackAxisSideDirection) {
								const currentSideAxis = getSideAxis(d.placement);
								return currentSideAxis === initialSideAxis || currentSideAxis === "y";
							}
							return true;
						}).map((d) => [d.placement, d.overflows.filter((overflow) => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
						if (placement) resetPlacement = placement;
						break;
					}
					case "initialPlacement":
						resetPlacement = initialPlacement;
						break;
				}
				if (placement !== resetPlacement) return { reset: { placement: resetPlacement } };
			}
			return {};
		}
	};
};
function getSideOffsets(overflow, rect) {
	return {
		top: overflow.top - rect.height,
		right: overflow.right - rect.width,
		bottom: overflow.bottom - rect.height,
		left: overflow.left - rect.width
	};
}
function isAnySideFullyClipped(overflow) {
	return sides.some((side) => overflow[side] >= 0);
}
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "hide",
		options,
		async fn(state) {
			const { rects, platform } = state;
			const { strategy = "referenceHidden", ...detectOverflowOptions } = evaluate(options, state);
			switch (strategy) {
				case "referenceHidden": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						elementContext: "reference"
					}), rects.reference);
					return { data: {
						referenceHiddenOffsets: offsets,
						referenceHidden: isAnySideFullyClipped(offsets)
					} };
				}
				case "escaped": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						altBoundary: true
					}), rects.floating);
					return { data: {
						escapedOffsets: offsets,
						escaped: isAnySideFullyClipped(offsets)
					} };
				}
				default: return {};
			}
		}
	};
};
var originSides = /*#__PURE__*/ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
	const { placement, platform, elements } = state;
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
	const side = getSide(placement);
	const alignment = getAlignment(placement);
	const isVertical = getSideAxis(placement) === "y";
	const mainAxisMulti = originSides.has(side) ? -1 : 1;
	const crossAxisMulti = rtl && isVertical ? -1 : 1;
	const rawValue = evaluate(options, state);
	let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === "number" ? {
		mainAxis: rawValue,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: rawValue.mainAxis || 0,
		crossAxis: rawValue.crossAxis || 0,
		alignmentAxis: rawValue.alignmentAxis
	};
	if (alignment && typeof alignmentAxis === "number") crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
	return isVertical ? {
		x: crossAxis * crossAxisMulti,
		y: mainAxis * mainAxisMulti
	} : {
		x: mainAxis * mainAxisMulti,
		y: crossAxis * crossAxisMulti
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset$2 = function(options) {
	if (options === void 0) options = 0;
	return {
		name: "offset",
		options,
		async fn(state) {
			var _middlewareData$offse, _middlewareData$arrow;
			const { x, y, placement, middlewareData } = state;
			const diffCoords = await convertValueToCoords(state, options);
			if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			return {
				x: x + diffCoords.x,
				y: y + diffCoords.y,
				data: {
					...diffCoords,
					placement
				}
			};
		}
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "shift",
		options,
		async fn(state) {
			const { x, y, placement, platform } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = { fn: (_ref) => {
				let { x, y } = _ref;
				return {
					x,
					y
				};
			} }, ...detectOverflowOptions } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const crossAxis = getSideAxis(getSide(placement));
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			if (checkMainAxis) {
				const minSide = mainAxis === "y" ? "top" : "left";
				const maxSide = mainAxis === "y" ? "bottom" : "right";
				const min = mainAxisCoord + overflow[minSide];
				const max = mainAxisCoord - overflow[maxSide];
				mainAxisCoord = clamp(min, mainAxisCoord, max);
			}
			if (checkCrossAxis) {
				const minSide = crossAxis === "y" ? "top" : "left";
				const maxSide = crossAxis === "y" ? "bottom" : "right";
				const min = crossAxisCoord + overflow[minSide];
				const max = crossAxisCoord - overflow[maxSide];
				crossAxisCoord = clamp(min, crossAxisCoord, max);
			}
			const limitedCoords = limiter.fn({
				...state,
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			});
			return {
				...limitedCoords,
				data: {
					x: limitedCoords.x - x,
					y: limitedCoords.y - y,
					enabled: {
						[mainAxis]: checkMainAxis,
						[crossAxis]: checkCrossAxis
					}
				}
			};
		}
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift$2 = function(options) {
	if (options === void 0) options = {};
	return {
		options,
		fn(state) {
			const { x, y, placement, rects, middlewareData } = state;
			const { offset = 0, mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const rawOffset = evaluate(offset, state);
			const computedOffset = typeof rawOffset === "number" ? {
				mainAxis: rawOffset,
				crossAxis: 0
			} : {
				mainAxis: 0,
				crossAxis: 0,
				...rawOffset
			};
			if (checkMainAxis) {
				const len = mainAxis === "y" ? "height" : "width";
				const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
				const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
				if (mainAxisCoord < limitMin) mainAxisCoord = limitMin;
				else if (mainAxisCoord > limitMax) mainAxisCoord = limitMax;
			}
			if (checkCrossAxis) {
				var _middlewareData$offse, _middlewareData$offse2;
				const len = mainAxis === "y" ? "width" : "height";
				const isOriginSide = originSides.has(getSide(placement));
				const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
				const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
				if (crossAxisCoord < limitMin) crossAxisCoord = limitMin;
				else if (crossAxisCoord > limitMax) crossAxisCoord = limitMax;
			}
			return {
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			};
		}
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "size",
		options,
		async fn(state) {
			var _state$middlewareData, _state$middlewareData2;
			const { placement, rects, platform, elements } = state;
			const { apply = () => {}, ...detectOverflowOptions } = evaluate(options, state);
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const side = getSide(placement);
			const alignment = getAlignment(placement);
			const isYAxis = getSideAxis(placement) === "y";
			const { width, height } = rects.floating;
			let heightSide;
			let widthSide;
			if (side === "top" || side === "bottom") {
				heightSide = side;
				widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
			} else {
				widthSide = side;
				heightSide = alignment === "end" ? "top" : "bottom";
			}
			const maximumClippingHeight = height - overflow.top - overflow.bottom;
			const maximumClippingWidth = width - overflow.left - overflow.right;
			const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
			const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
			const noShift = !state.middlewareData.shift;
			let availableHeight = overflowAvailableHeight;
			let availableWidth = overflowAvailableWidth;
			if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) availableWidth = maximumClippingWidth;
			if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) availableHeight = maximumClippingHeight;
			if (noShift && !alignment) {
				const xMin = max(overflow.left, 0);
				const xMax = max(overflow.right, 0);
				const yMin = max(overflow.top, 0);
				const yMax = max(overflow.bottom, 0);
				if (isYAxis) availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
				else availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
			}
			await apply({
				...state,
				availableWidth,
				availableHeight
			});
			const nextDimensions = await platform.getDimensions(elements.floating);
			if (width !== nextDimensions.width || height !== nextDimensions.height) return { reset: { rects: true } };
			return {};
		}
	};
};
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
	return typeof window !== "undefined";
}
function getNodeName(node) {
	if (isNode(node)) return (node.nodeName || "").toLowerCase();
	return "#document";
}
function getWindow(node) {
	var _node$ownerDocument;
	return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
	var _ref;
	return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
	if (!hasWindow()) return false;
	return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
	if (!hasWindow()) return false;
	return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
	if (!hasWindow()) return false;
	return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
	if (!hasWindow() || typeof ShadowRoot === "undefined") return false;
	return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
	const { overflow, overflowX, overflowY, display } = getComputedStyle$1(element);
	return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
	return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
	try {
		if (element.matches(":popover-open")) return true;
	} catch (_e) {}
	try {
		return element.matches(":modal");
	} catch (_e) {
		return false;
	}
}
var willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
var containRe = /paint|layout|strict|content/;
var isNotNone = (value) => !!value && value !== "none";
var isWebKitValue;
function isContainingBlock(elementOrCss) {
	const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
	return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
	let currentNode = getParentNode(element);
	while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
		if (isContainingBlock(currentNode)) return currentNode;
		else if (isTopLayer(currentNode)) return null;
		currentNode = getParentNode(currentNode);
	}
	return null;
}
function isWebKit() {
	if (isWebKitValue == null) isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
	return isWebKitValue;
}
function isLastTraversableNode(node) {
	return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle$1(element) {
	return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
	if (isElement(element)) return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
	return {
		scrollLeft: element.scrollX,
		scrollTop: element.scrollY
	};
}
function getParentNode(node) {
	if (getNodeName(node) === "html") return node;
	const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
	return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
	const parentNode = getParentNode(node);
	if (isLastTraversableNode(parentNode)) return node.ownerDocument ? node.ownerDocument.body : node.body;
	if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) return parentNode;
	return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
	var _node$ownerDocument2;
	if (list === void 0) list = [];
	if (traverseIframes === void 0) traverseIframes = true;
	const scrollableAncestor = getNearestOverflowAncestor(node);
	const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
	const win = getWindow(scrollableAncestor);
	if (isBody) {
		const frameElement = getFrameElement(win);
		return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
	} else return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
	return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+dom@1.7.6/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
	const css = getComputedStyle$1(element);
	let width = parseFloat(css.width) || 0;
	let height = parseFloat(css.height) || 0;
	const hasOffset = isHTMLElement(element);
	const offsetWidth = hasOffset ? element.offsetWidth : width;
	const offsetHeight = hasOffset ? element.offsetHeight : height;
	const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
	if (shouldFallback) {
		width = offsetWidth;
		height = offsetHeight;
	}
	return {
		width,
		height,
		$: shouldFallback
	};
}
function unwrapElement(element) {
	return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
	const domElement = unwrapElement(element);
	if (!isHTMLElement(domElement)) return createCoords(1);
	const rect = domElement.getBoundingClientRect();
	const { width, height, $ } = getCssDimensions(domElement);
	let x = ($ ? round(rect.width) : rect.width) / width;
	let y = ($ ? round(rect.height) : rect.height) / height;
	if (!x || !Number.isFinite(x)) x = 1;
	if (!y || !Number.isFinite(y)) y = 1;
	return {
		x,
		y
	};
}
var noOffsets = /*#__PURE__*/ createCoords(0);
function getVisualOffsets(element) {
	const win = getWindow(element);
	if (!isWebKit() || !win.visualViewport) return noOffsets;
	return {
		x: win.visualViewport.offsetLeft,
		y: win.visualViewport.offsetTop
	};
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
	if (isFixed === void 0) isFixed = false;
	if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) return false;
	return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	const clientRect = element.getBoundingClientRect();
	const domElement = unwrapElement(element);
	let scale = createCoords(1);
	if (includeScale) if (offsetParent) {
		if (isElement(offsetParent)) scale = getScale(offsetParent);
	} else scale = getScale(element);
	const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
	let x = (clientRect.left + visualOffsets.x) / scale.x;
	let y = (clientRect.top + visualOffsets.y) / scale.y;
	let width = clientRect.width / scale.x;
	let height = clientRect.height / scale.y;
	if (domElement) {
		const win = getWindow(domElement);
		const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
		let currentWin = win;
		let currentIFrame = getFrameElement(currentWin);
		while (currentIFrame && offsetParent && offsetWin !== currentWin) {
			const iframeScale = getScale(currentIFrame);
			const iframeRect = currentIFrame.getBoundingClientRect();
			const css = getComputedStyle$1(currentIFrame);
			const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
			const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
			x *= iframeScale.x;
			y *= iframeScale.y;
			width *= iframeScale.x;
			height *= iframeScale.y;
			x += left;
			y += top;
			currentWin = getWindow(currentIFrame);
			currentIFrame = getFrameElement(currentWin);
		}
	}
	return rectToClientRect({
		width,
		height,
		x,
		y
	});
}
function getWindowScrollBarX(element, rect) {
	const leftScroll = getNodeScroll(element).scrollLeft;
	if (!rect) return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
	return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
	const htmlRect = documentElement.getBoundingClientRect();
	return {
		x: htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect),
		y: htmlRect.top + scroll.scrollTop
	};
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
	let { elements, rect, offsetParent, strategy } = _ref;
	const isFixed = strategy === "fixed";
	const documentElement = getDocumentElement(offsetParent);
	const topLayer = elements ? isTopLayer(elements.floating) : false;
	if (offsetParent === documentElement || topLayer && isFixed) return rect;
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	let scale = createCoords(1);
	const offsets = createCoords(0);
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent);
			scale = getScale(offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		width: rect.width * scale.x,
		height: rect.height * scale.y,
		x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
		y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
	};
}
function getClientRects(element) {
	return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
	const html = getDocumentElement(element);
	const scroll = getNodeScroll(element);
	const body = element.ownerDocument.body;
	const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
	const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
	let x = -scroll.scrollLeft + getWindowScrollBarX(element);
	const y = -scroll.scrollTop;
	if (getComputedStyle$1(body).direction === "rtl") x += max(html.clientWidth, body.clientWidth) - width;
	return {
		width,
		height,
		x,
		y
	};
}
var SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy) {
	const win = getWindow(element);
	const html = getDocumentElement(element);
	const visualViewport = win.visualViewport;
	let width = html.clientWidth;
	let height = html.clientHeight;
	let x = 0;
	let y = 0;
	if (visualViewport) {
		width = visualViewport.width;
		height = visualViewport.height;
		const visualViewportBased = isWebKit();
		if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
			x = visualViewport.offsetLeft;
			y = visualViewport.offsetTop;
		}
	}
	const windowScrollbarX = getWindowScrollBarX(html);
	if (windowScrollbarX <= 0) {
		const doc = html.ownerDocument;
		const body = doc.body;
		const bodyStyles = getComputedStyle(body);
		const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
		const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
		if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) width -= clippingStableScrollbarWidth;
	} else if (windowScrollbarX <= SCROLLBAR_MAX) width += windowScrollbarX;
	return {
		width,
		height,
		x,
		y
	};
}
function getInnerBoundingClientRect(element, strategy) {
	const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
	const top = clientRect.top + element.clientTop;
	const left = clientRect.left + element.clientLeft;
	const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
	return {
		width: element.clientWidth * scale.x,
		height: element.clientHeight * scale.y,
		x: left * scale.x,
		y: top * scale.y
	};
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
	let rect;
	if (clippingAncestor === "viewport") rect = getViewportRect(element, strategy);
	else if (clippingAncestor === "document") rect = getDocumentRect(getDocumentElement(element));
	else if (isElement(clippingAncestor)) rect = getInnerBoundingClientRect(clippingAncestor, strategy);
	else {
		const visualOffsets = getVisualOffsets(element);
		rect = {
			x: clippingAncestor.x - visualOffsets.x,
			y: clippingAncestor.y - visualOffsets.y,
			width: clippingAncestor.width,
			height: clippingAncestor.height
		};
	}
	return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
	const parentNode = getParentNode(element);
	if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) return false;
	return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
	const cachedResult = cache.get(element);
	if (cachedResult) return cachedResult;
	let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
	let currentContainingBlockComputedStyle = null;
	const elementIsFixed = getComputedStyle$1(element).position === "fixed";
	let currentNode = elementIsFixed ? getParentNode(element) : element;
	while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
		const computedStyle = getComputedStyle$1(currentNode);
		const currentNodeIsContaining = isContainingBlock(currentNode);
		if (!currentNodeIsContaining && computedStyle.position === "fixed") currentContainingBlockComputedStyle = null;
		if (elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && (currentContainingBlockComputedStyle.position === "absolute" || currentContainingBlockComputedStyle.position === "fixed") || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode)) result = result.filter((ancestor) => ancestor !== currentNode);
		else currentContainingBlockComputedStyle = computedStyle;
		currentNode = getParentNode(currentNode);
	}
	cache.set(element, result);
	return result;
}
function getClippingRect(_ref) {
	let { element, boundary, rootBoundary, strategy } = _ref;
	const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary];
	const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
	let top = firstRect.top;
	let right = firstRect.right;
	let bottom = firstRect.bottom;
	let left = firstRect.left;
	for (let i = 1; i < clippingAncestors.length; i++) {
		const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
		top = max(rect.top, top);
		right = min(rect.right, right);
		bottom = min(rect.bottom, bottom);
		left = max(rect.left, left);
	}
	return {
		width: right - left,
		height: bottom - top,
		x: left,
		y: top
	};
}
function getDimensions(element) {
	const { width, height } = getCssDimensions(element);
	return {
		width,
		height
	};
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	const documentElement = getDocumentElement(offsetParent);
	const isFixed = strategy === "fixed";
	const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	const offsets = createCoords(0);
	function setLeftRTLScrollbarOffset() {
		offsets.x = getWindowScrollBarX(documentElement);
	}
	if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		} else if (documentElement) setLeftRTLScrollbarOffset();
	}
	if (isFixed && !isOffsetParentAnElement && documentElement) setLeftRTLScrollbarOffset();
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
		y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
		width: rect.width,
		height: rect.height
	};
}
function isStaticPositioned(element) {
	return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
	if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
	if (polyfill) return polyfill(element);
	let rawOffsetParent = element.offsetParent;
	if (getDocumentElement(element) === rawOffsetParent) rawOffsetParent = rawOffsetParent.ownerDocument.body;
	return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
	const win = getWindow(element);
	if (isTopLayer(element)) return win;
	if (!isHTMLElement(element)) {
		let svgOffsetParent = getParentNode(element);
		while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
			if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) return svgOffsetParent;
			svgOffsetParent = getParentNode(svgOffsetParent);
		}
		return win;
	}
	let offsetParent = getTrueOffsetParent(element, polyfill);
	while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) offsetParent = getTrueOffsetParent(offsetParent, polyfill);
	if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) return win;
	return offsetParent || getContainingBlock(element) || win;
}
var getElementRects = async function(data) {
	const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
	const getDimensionsFn = this.getDimensions;
	const floatingDimensions = await getDimensionsFn(data.floating);
	return {
		reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
		floating: {
			x: 0,
			y: 0,
			width: floatingDimensions.width,
			height: floatingDimensions.height
		}
	};
};
function isRTL(element) {
	return getComputedStyle$1(element).direction === "rtl";
}
var platform = {
	convertOffsetParentRelativeRectToViewportRelativeRect,
	getDocumentElement,
	getClippingRect,
	getOffsetParent,
	getElementRects,
	getClientRects,
	getDimensions,
	getScale,
	isElement,
	isRTL
};
function rectsAreEqual(a, b) {
	return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove) {
	let io = null;
	let timeoutId;
	const root = getDocumentElement(element);
	function cleanup() {
		var _io;
		clearTimeout(timeoutId);
		(_io = io) == null || _io.disconnect();
		io = null;
	}
	function refresh(skip, threshold) {
		if (skip === void 0) skip = false;
		if (threshold === void 0) threshold = 1;
		cleanup();
		const elementRectForRootMargin = element.getBoundingClientRect();
		const { left, top, width, height } = elementRectForRootMargin;
		if (!skip) onMove();
		if (!width || !height) return;
		const insetTop = floor(top);
		const insetRight = floor(root.clientWidth - (left + width));
		const insetBottom = floor(root.clientHeight - (top + height));
		const insetLeft = floor(left);
		const options = {
			rootMargin: -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px",
			threshold: max(0, min(1, threshold)) || 1
		};
		let isFirstUpdate = true;
		function handleObserve(entries) {
			const ratio = entries[0].intersectionRatio;
			if (ratio !== threshold) {
				if (!isFirstUpdate) return refresh();
				if (!ratio) timeoutId = setTimeout(() => {
					refresh(false, 1e-7);
				}, 1e3);
				else refresh(false, ratio);
			}
			if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) refresh();
			isFirstUpdate = false;
		}
		try {
			io = new IntersectionObserver(handleObserve, {
				...options,
				root: root.ownerDocument
			});
		} catch (_e) {
			io = new IntersectionObserver(handleObserve, options);
		}
		io.observe(element);
	}
	refresh(true);
	return cleanup;
}
/**
* Automatically updates the position of the floating element when necessary.
* Should only be called when the floating element is mounted on the DOM or
* visible on the screen.
* @returns cleanup function that should be invoked when the floating element is
* removed from the DOM or hidden from the screen.
* @see https://floating-ui.com/docs/autoUpdate
*/
function autoUpdate(reference, floating, update, options) {
	if (options === void 0) options = {};
	const { ancestorScroll = true, ancestorResize = true, elementResize = typeof ResizeObserver === "function", layoutShift = typeof IntersectionObserver === "function", animationFrame = false } = options;
	const referenceEl = unwrapElement(reference);
	const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
	ancestors.forEach((ancestor) => {
		ancestorScroll && ancestor.addEventListener("scroll", update, { passive: true });
		ancestorResize && ancestor.addEventListener("resize", update);
	});
	const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
	let reobserveFrame = -1;
	let resizeObserver = null;
	if (elementResize) {
		resizeObserver = new ResizeObserver((_ref) => {
			let [firstEntry] = _ref;
			if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
				resizeObserver.unobserve(floating);
				cancelAnimationFrame(reobserveFrame);
				reobserveFrame = requestAnimationFrame(() => {
					var _resizeObserver;
					(_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
				});
			}
			update();
		});
		if (referenceEl && !animationFrame) resizeObserver.observe(referenceEl);
		if (floating) resizeObserver.observe(floating);
	}
	let frameId;
	let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
	if (animationFrame) frameLoop();
	function frameLoop() {
		const nextRefRect = getBoundingClientRect(reference);
		if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) update();
		prevRefRect = nextRefRect;
		frameId = requestAnimationFrame(frameLoop);
	}
	update();
	return () => {
		var _resizeObserver2;
		ancestors.forEach((ancestor) => {
			ancestorScroll && ancestor.removeEventListener("scroll", update);
			ancestorResize && ancestor.removeEventListener("resize", update);
		});
		cleanupIo?.();
		(_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
		resizeObserver = null;
		if (animationFrame) cancelAnimationFrame(frameId);
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset$1 = offset$2;
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift$1 = shift$2;
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip$1 = flip$2;
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size$1 = size$2;
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide$1 = hide$2;
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$2 = arrow$3;
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift$1 = limitShift$2;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*/
var computePosition = (reference, floating, options) => {
	const cache = /* @__PURE__ */ new Map();
	const mergedOptions = {
		platform,
		...options
	};
	const platformWithCache = {
		...mergedOptions.platform,
		_c: cache
	};
	return computePosition$1(reference, floating, {
		...mergedOptions,
		platform: platformWithCache
	});
};
//#endregion
//#region node_modules/.pnpm/@floating-ui+react-dom@2.1.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs
var index = typeof document !== "undefined" ? import_react.useLayoutEffect : function noop() {};
function deepEqual(a, b) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (typeof a === "function" && a.toString() === b.toString()) return true;
	let length;
	let i;
	let keys;
	if (a && b && typeof a === "object") {
		if (Array.isArray(a)) {
			length = a.length;
			if (length !== b.length) return false;
			for (i = length; i-- !== 0;) if (!deepEqual(a[i], b[i])) return false;
			return true;
		}
		keys = Object.keys(a);
		length = keys.length;
		if (length !== Object.keys(b).length) return false;
		for (i = length; i-- !== 0;) if (!{}.hasOwnProperty.call(b, keys[i])) return false;
		for (i = length; i-- !== 0;) {
			const key = keys[i];
			if (key === "_owner" && a.$$typeof) continue;
			if (!deepEqual(a[key], b[key])) return false;
		}
		return true;
	}
	return a !== a && b !== b;
}
function getDPR(element) {
	if (typeof window === "undefined") return 1;
	return (element.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function roundByDPR(element, value) {
	const dpr = getDPR(element);
	return Math.round(value * dpr) / dpr;
}
function useLatestRef(value) {
	const ref = import_react.useRef(value);
	index(() => {
		ref.current = value;
	});
	return ref;
}
/**
* Provides data to position a floating element.
* @see https://floating-ui.com/docs/useFloating
*/
function useFloating(options) {
	if (options === void 0) options = {};
	const { placement = "bottom", strategy = "absolute", middleware = [], platform, elements: { reference: externalReference, floating: externalFloating } = {}, transform = true, whileElementsMounted, open } = options;
	const [data, setData] = import_react.useState({
		x: 0,
		y: 0,
		strategy,
		placement,
		middlewareData: {},
		isPositioned: false
	});
	const [latestMiddleware, setLatestMiddleware] = import_react.useState(middleware);
	if (!deepEqual(latestMiddleware, middleware)) setLatestMiddleware(middleware);
	const [_reference, _setReference] = import_react.useState(null);
	const [_floating, _setFloating] = import_react.useState(null);
	const setReference = import_react.useCallback((node) => {
		if (node !== referenceRef.current) {
			referenceRef.current = node;
			_setReference(node);
		}
	}, []);
	const setFloating = import_react.useCallback((node) => {
		if (node !== floatingRef.current) {
			floatingRef.current = node;
			_setFloating(node);
		}
	}, []);
	const referenceEl = externalReference || _reference;
	const floatingEl = externalFloating || _floating;
	const referenceRef = import_react.useRef(null);
	const floatingRef = import_react.useRef(null);
	const dataRef = import_react.useRef(data);
	const hasWhileElementsMounted = whileElementsMounted != null;
	const whileElementsMountedRef = useLatestRef(whileElementsMounted);
	const platformRef = useLatestRef(platform);
	const openRef = useLatestRef(open);
	const update = import_react.useCallback(() => {
		if (!referenceRef.current || !floatingRef.current) return;
		const config = {
			placement,
			strategy,
			middleware: latestMiddleware
		};
		if (platformRef.current) config.platform = platformRef.current;
		computePosition(referenceRef.current, floatingRef.current, config).then((data) => {
			const fullData = {
				...data,
				isPositioned: openRef.current !== false
			};
			if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
				dataRef.current = fullData;
				import_react_dom.flushSync(() => {
					setData(fullData);
				});
			}
		});
	}, [
		latestMiddleware,
		placement,
		strategy,
		platformRef,
		openRef
	]);
	index(() => {
		if (open === false && dataRef.current.isPositioned) {
			dataRef.current.isPositioned = false;
			setData((data) => ({
				...data,
				isPositioned: false
			}));
		}
	}, [open]);
	const isMountedRef = import_react.useRef(false);
	index(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);
	index(() => {
		if (referenceEl) referenceRef.current = referenceEl;
		if (floatingEl) floatingRef.current = floatingEl;
		if (referenceEl && floatingEl) {
			if (whileElementsMountedRef.current) return whileElementsMountedRef.current(referenceEl, floatingEl, update);
			update();
		}
	}, [
		referenceEl,
		floatingEl,
		update,
		whileElementsMountedRef,
		hasWhileElementsMounted
	]);
	const refs = import_react.useMemo(() => ({
		reference: referenceRef,
		floating: floatingRef,
		setReference,
		setFloating
	}), [setReference, setFloating]);
	const elements = import_react.useMemo(() => ({
		reference: referenceEl,
		floating: floatingEl
	}), [referenceEl, floatingEl]);
	const floatingStyles = import_react.useMemo(() => {
		const initialStyles = {
			position: strategy,
			left: 0,
			top: 0
		};
		if (!elements.floating) return initialStyles;
		const x = roundByDPR(elements.floating, data.x);
		const y = roundByDPR(elements.floating, data.y);
		if (transform) return {
			...initialStyles,
			transform: "translate(" + x + "px, " + y + "px)",
			...getDPR(elements.floating) >= 1.5 && { willChange: "transform" }
		};
		return {
			position: strategy,
			left: x,
			top: y
		};
	}, [
		strategy,
		transform,
		elements.floating,
		data.x,
		data.y
	]);
	return import_react.useMemo(() => ({
		...data,
		update,
		refs,
		elements,
		floatingStyles
	}), [
		data,
		update,
		refs,
		elements,
		floatingStyles
	]);
}
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* This wraps the core `arrow` middleware to allow React refs as the element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$1 = (options) => {
	function isRef(value) {
		return {}.hasOwnProperty.call(value, "current");
	}
	return {
		name: "arrow",
		options,
		fn(state) {
			const { element, padding } = typeof options === "function" ? options(state) : options;
			if (element && isRef(element)) {
				if (element.current != null) return arrow$2({
					element: element.current,
					padding
				}).fn(state);
				return {};
			}
			if (element) return arrow$2({
				element,
				padding
			}).fn(state);
			return {};
		}
	};
};
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset = (options, deps) => {
	const result = offset$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift = (options, deps) => {
	const result = shift$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift = (options, deps) => {
	return {
		fn: limitShift$1(options).fn,
		options: [options, deps]
	};
};
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip = (options, deps) => {
	const result = flip$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size = (options, deps) => {
	const result = size$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide = (options, deps) => {
	const result = hide$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* This wraps the core `arrow` middleware to allow React refs as the element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow = (options, deps) => {
	const result = arrow$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-arrow@1.1.11_@types+react-dom@19.2.3_@types+react@19.2.17__@types+react_b508d5a1dc0bf609ea641fa79482cab2/node_modules/@radix-ui/react-arrow/dist/index.mjs
var NAME$1 = "Arrow";
var Arrow$1 = import_react.forwardRef((props, forwardedRef) => {
	const { children, width = 10, height = 5, ...arrowProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.svg, {
		...arrowProps,
		ref: forwardedRef,
		width,
		height,
		viewBox: "0 0 30 10",
		preserveAspectRatio: "none",
		children: props.asChild ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", { points: "0,0 30,0 15,10" })
	});
});
Arrow$1.displayName = NAME$1;
var Root$1 = Arrow$1;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-use-size@1.1.2_@types+react@19.2.17_react@19.2.7/node_modules/@radix-ui/react-use-size/dist/index.mjs
function useSize(element) {
	const [size, setSize] = import_react.useState(void 0);
	useLayoutEffect2(() => {
		if (element) {
			setSize({
				width: element.offsetWidth,
				height: element.offsetHeight
			});
			const resizeObserver = new ResizeObserver((entries) => {
				if (!Array.isArray(entries)) return;
				if (!entries.length) return;
				const entry = entries[0];
				let width;
				let height;
				if ("borderBoxSize" in entry) {
					const borderSizeEntry = entry["borderBoxSize"];
					const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
					width = borderSize["inlineSize"];
					height = borderSize["blockSize"];
				} else {
					width = element.offsetWidth;
					height = element.offsetHeight;
				}
				setSize({
					width,
					height
				});
			});
			resizeObserver.observe(element, { box: "border-box" });
			return () => resizeObserver.unobserve(element);
		} else setSize(void 0);
	}, [element]);
	return size;
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-popper@1.3.3_@types+react-dom@19.2.3_@types+react@19.2.17__@types+react_024cac3bd6fc18a516878162ac49f9a0/node_modules/@radix-ui/react-popper/dist/index.mjs
var POPPER_NAME = "Popper";
var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
var Popper = (props) => {
	const { __scopePopper, children } = props;
	const [anchor, setAnchor] = import_react.useState(null);
	const [placementState, setPlacementState] = import_react.useState(void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopperProvider, {
		scope: __scopePopper,
		anchor,
		onAnchorChange: setAnchor,
		placementState,
		setPlacementState,
		children
	});
};
Popper.displayName = POPPER_NAME;
var ANCHOR_NAME$1 = "PopperAnchor";
var PopperAnchor = import_react.forwardRef((props, forwardedRef) => {
	const { __scopePopper, virtualRef, ...anchorProps } = props;
	const context = usePopperContext(ANCHOR_NAME$1, __scopePopper);
	const ref = import_react.useRef(null);
	const onAnchorChange = context.onAnchorChange;
	const composedRefs = useComposedRefs(forwardedRef, import_react.useCallback((node) => {
		ref.current = node;
		if (node) onAnchorChange(node);
	}, [onAnchorChange]));
	const anchorRef = import_react.useRef(null);
	import_react.useEffect(() => {
		if (!virtualRef) return;
		const previousAnchor = anchorRef.current;
		anchorRef.current = virtualRef.current;
		if (previousAnchor !== anchorRef.current) onAnchorChange(anchorRef.current);
	});
	const sideAndAlign = context.placementState && getSideAndAlignFromPlacement(context.placementState);
	const placedSide = sideAndAlign?.[0];
	const placedAlign = sideAndAlign?.[1];
	return virtualRef ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"data-radix-popper-side": placedSide,
		"data-radix-popper-align": placedAlign,
		...anchorProps,
		ref: composedRefs
	});
});
PopperAnchor.displayName = ANCHOR_NAME$1;
var CONTENT_NAME$2 = "PopperContent";
var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$2);
var PopperContent = import_react.forwardRef((props, forwardedRef) => {
	const { __scopePopper, side = "bottom", sideOffset = 0, align = "center", alignOffset = 0, arrowPadding = 0, avoidCollisions = true, collisionBoundary = [], collisionPadding: collisionPaddingProp = 0, sticky = "partial", hideWhenDetached = false, updatePositionStrategy = "optimized", onPlaced, ...contentProps } = props;
	const context = usePopperContext(CONTENT_NAME$2, __scopePopper);
	const [content, setContent] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, setContent);
	const [arrow$4, setArrow] = import_react.useState(null);
	const arrowSize = useSize(arrow$4);
	const arrowWidth = arrowSize?.width ?? 0;
	const arrowHeight = arrowSize?.height ?? 0;
	const desiredPlacement = side + (align !== "center" ? "-" + align : "");
	const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...collisionPaddingProp
	};
	const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
	const hasExplicitBoundaries = boundary.length > 0;
	const detectOverflowOptions = {
		padding: collisionPadding,
		boundary: boundary.filter(isNotNull),
		altBoundary: hasExplicitBoundaries
	};
	const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
		strategy: "fixed",
		placement: desiredPlacement,
		whileElementsMounted: (...args) => {
			return autoUpdate(...args, { animationFrame: updatePositionStrategy === "always" });
		},
		elements: { reference: context.anchor },
		middleware: [
			offset({
				mainAxis: sideOffset + arrowHeight,
				alignmentAxis: alignOffset
			}),
			avoidCollisions && shift({
				mainAxis: true,
				crossAxis: false,
				limiter: sticky === "partial" ? limitShift() : void 0,
				...detectOverflowOptions
			}),
			avoidCollisions && flip({ ...detectOverflowOptions }),
			size({
				...detectOverflowOptions,
				apply: ({ elements, rects, availableWidth, availableHeight }) => {
					const { width: anchorWidth, height: anchorHeight } = rects.reference;
					const contentStyle = elements.floating.style;
					contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
					contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
					contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
					contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
				}
			}),
			arrow$4 && arrow({
				element: arrow$4,
				padding: arrowPadding
			}),
			transformOrigin({
				arrowWidth,
				arrowHeight
			}),
			hideWhenDetached && hide({
				strategy: "referenceHidden",
				...detectOverflowOptions,
				boundary: hasExplicitBoundaries ? detectOverflowOptions.boundary : void 0
			})
		]
	});
	const setPlacementState = context.setPlacementState;
	useLayoutEffect2(() => {
		setPlacementState(placement);
		return () => {
			setPlacementState(void 0);
		};
	}, [placement, setPlacementState]);
	const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
	const handlePlaced = useCallbackRef$1(onPlaced);
	useLayoutEffect2(() => {
		if (isPositioned) handlePlaced?.();
	}, [isPositioned, handlePlaced]);
	const arrowX = middlewareData.arrow?.x;
	const arrowY = middlewareData.arrow?.y;
	const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
	const [contentZIndex, setContentZIndex] = import_react.useState();
	useLayoutEffect2(() => {
		if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
	}, [content]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: refs.setFloating,
		"data-radix-popper-content-wrapper": "",
		style: {
			...floatingStyles,
			transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: contentZIndex,
			"--radix-popper-transform-origin": [middlewareData.transformOrigin?.x, middlewareData.transformOrigin?.y].join(" "),
			...middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				pointerEvents: "none"
			}
		},
		dir: props.dir,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopperContentProvider, {
			scope: __scopePopper,
			placedSide,
			placedAlign,
			onArrowChange: setArrow,
			arrowX,
			arrowY,
			shouldHideArrow: cannotCenterArrow,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
				"data-side": placedSide,
				"data-align": placedAlign,
				...contentProps,
				ref: composedRefs,
				style: {
					...contentProps.style,
					animation: !isPositioned ? "none" : void 0
				}
			})
		})
	});
});
PopperContent.displayName = CONTENT_NAME$2;
var ARROW_NAME$2 = "PopperArrow";
var OPPOSITE_SIDE = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
};
var PopperArrow = import_react.forwardRef(function PopperArrow2(props, forwardedRef) {
	const { __scopePopper, ...arrowProps } = props;
	const contentContext = useContentContext(ARROW_NAME$2, __scopePopper);
	const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		ref: contentContext.onArrowChange,
		style: {
			position: "absolute",
			left: contentContext.arrowX,
			top: contentContext.arrowY,
			[baseSide]: 0,
			transformOrigin: {
				top: "",
				right: "0 0",
				bottom: "center 0",
				left: "100% 0"
			}[contentContext.placedSide],
			transform: {
				top: "translateY(100%)",
				right: "translateY(50%) rotate(90deg) translateX(-50%)",
				bottom: `rotate(180deg)`,
				left: "translateY(50%) rotate(-90deg) translateX(50%)"
			}[contentContext.placedSide],
			visibility: contentContext.shouldHideArrow ? "hidden" : void 0
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
			...arrowProps,
			ref: forwardedRef,
			style: {
				...arrowProps.style,
				display: "block"
			}
		})
	});
});
PopperArrow.displayName = ARROW_NAME$2;
function isNotNull(value) {
	return value !== null;
}
var transformOrigin = (options) => ({
	name: "transformOrigin",
	options,
	fn(data) {
		const { placement, rects, middlewareData } = data;
		const isArrowHidden = middlewareData.arrow?.centerOffset !== 0;
		const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
		const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
		const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
		const noArrowAlign = {
			start: "0%",
			center: "50%",
			end: "100%"
		}[placedAlign];
		const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
		const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
		let x = "";
		let y = "";
		if (placedSide === "bottom") {
			x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
			y = `${-arrowHeight}px`;
		} else if (placedSide === "top") {
			x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
			y = `${rects.floating.height + arrowHeight}px`;
		} else if (placedSide === "right") {
			x = `${-arrowHeight}px`;
			y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
		} else if (placedSide === "left") {
			x = `${rects.floating.width + arrowHeight}px`;
			y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
		}
		return { data: {
			x,
			y
		} };
	}
});
function getSideAndAlignFromPlacement(placement) {
	const [side, align = "center"] = placement.split("-");
	return [side, align];
}
var Root2$1 = Popper;
var Anchor = PopperAnchor;
var Content = PopperContent;
var Arrow = PopperArrow;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-portal@1.1.13_@types+react-dom@19.2.3_@types+react@19.2.17__@types+reac_9fd48d5b638d9c49f76174408f42dd27/node_modules/@radix-ui/react-portal/dist/index.mjs
var PORTAL_NAME$2 = "Portal";
var Portal$2 = import_react.forwardRef((props, forwardedRef) => {
	const { container: containerProp, ...portalProps } = props;
	const [mounted, setMounted] = import_react.useState(false);
	useLayoutEffect2(() => setMounted(true), []);
	const container = containerProp || mounted && globalThis?.document?.body;
	return container ? import_react_dom.createPortal(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		...portalProps,
		ref: forwardedRef
	}), container) : null;
});
Portal$2.displayName = PORTAL_NAME$2;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-presence@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.17__@types+rea_70f8d4bf81a86157cd5826dc97175ac4/node_modules/@radix-ui/react-presence/dist/index.mjs
function useStateMachine(initialState, machine) {
	return import_react.useReducer((state, event) => {
		return machine[state][event] ?? state;
	}, initialState);
}
var Presence = (props) => {
	const { present, children } = props;
	const presence = usePresence(present);
	const child = typeof children === "function" ? children({ present: presence.isPresent }) : import_react.Children.only(children);
	const ref = useStableComposedRefs(presence.ref, getElementRef(child));
	return typeof children === "function" || presence.isPresent ? import_react.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
	const [node, setNode] = import_react.useState();
	const stylesRef = import_react.useRef(null);
	const prevPresentRef = import_react.useRef(present);
	const prevAnimationNameRef = import_react.useRef("none");
	const mountAnimationNameRef = import_react.useRef(void 0);
	const [state, send] = useStateMachine(present ? "mounted" : "unmounted", {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended"
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted"
		},
		unmounted: { MOUNT: "mounted" }
	});
	import_react.useEffect(() => {
		if (state === "mounted") {
			prevAnimationNameRef.current = mountAnimationNameRef.current ?? getAnimationName(stylesRef.current);
			mountAnimationNameRef.current = void 0;
		} else prevAnimationNameRef.current = "none";
	}, [state]);
	useLayoutEffect2(() => {
		const styles = stylesRef.current;
		const wasPresent = prevPresentRef.current;
		if (wasPresent !== present) {
			const prevAnimationName = prevAnimationNameRef.current;
			const currentAnimationName = getAnimationName(styles);
			if (present) {
				mountAnimationNameRef.current = currentAnimationName;
				send("MOUNT");
			} else if (currentAnimationName === "none" || styles?.display === "none") send("UNMOUNT");
			else if (wasPresent && prevAnimationName !== currentAnimationName) send("ANIMATION_OUT");
			else send("UNMOUNT");
			prevPresentRef.current = present;
		}
	}, [present, send]);
	useLayoutEffect2(() => {
		if (node) {
			let timeoutId;
			const ownerWindow = node.ownerDocument.defaultView ?? window;
			const handleAnimationEnd = (event) => {
				const isCurrentAnimation = getAnimationName(stylesRef.current).includes(CSS.escape(event.animationName));
				if (event.target === node && isCurrentAnimation) {
					send("ANIMATION_END");
					if (!prevPresentRef.current) {
						const currentFillMode = node.style.animationFillMode;
						node.style.animationFillMode = "forwards";
						timeoutId = ownerWindow.setTimeout(() => {
							if (node.style.animationFillMode === "forwards") node.style.animationFillMode = currentFillMode;
						});
					}
				}
			};
			const handleAnimationStart = (event) => {
				if (event.target === node) prevAnimationNameRef.current = getAnimationName(stylesRef.current);
			};
			node.addEventListener("animationstart", handleAnimationStart);
			node.addEventListener("animationcancel", handleAnimationEnd);
			node.addEventListener("animationend", handleAnimationEnd);
			return () => {
				ownerWindow.clearTimeout(timeoutId);
				node.removeEventListener("animationstart", handleAnimationStart);
				node.removeEventListener("animationcancel", handleAnimationEnd);
				node.removeEventListener("animationend", handleAnimationEnd);
			};
		} else send("ANIMATION_END");
	}, [node, send]);
	return {
		isPresent: ["mounted", "unmountSuspended"].includes(state),
		ref: import_react.useCallback((node2) => {
			if (node2) {
				const styles = getComputedStyle(node2);
				stylesRef.current = styles;
				mountAnimationNameRef.current = getAnimationName(styles);
			} else stylesRef.current = null;
			setNode(node2);
		}, [])
	};
}
function setRef(ref, value) {
	if (typeof ref === "function") return ref(value);
	else if (ref !== null && ref !== void 0) ref.current = value;
}
function useStableComposedRefs(...refs) {
	const refsRef = import_react.useRef(refs);
	refsRef.current = refs;
	return import_react.useCallback((node) => {
		const currentRefs = refsRef.current;
		let hasCleanup = false;
		const cleanups = currentRefs.map((ref) => {
			const cleanup = setRef(ref, node);
			if (!hasCleanup && typeof cleanup === "function") hasCleanup = true;
			return cleanup;
		});
		if (hasCleanup) return () => {
			for (let i = 0; i < cleanups.length; i++) {
				const cleanup = cleanups[i];
				if (typeof cleanup === "function") cleanup();
				else setRef(currentRefs[i], null);
			}
		};
	}, []);
}
function getAnimationName(styles) {
	return styles?.animationName || "none";
}
function getElementRef(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-use-controllable-state@1.2.3_@types+react@19.2.17_react@19.2.7/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
var useInsertionEffect = import_react[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({ prop, defaultProp, onChange = () => {}, caller }) {
	const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
		defaultProp,
		onChange
	});
	const isControlled = prop !== void 0;
	const value = isControlled ? prop : uncontrolledProp;
	{
		const isControlledRef = import_react.useRef(prop !== void 0);
		import_react.useEffect(() => {
			const wasControlled = isControlledRef.current;
			if (wasControlled !== isControlled) console.warn(`${caller} is changing from ${wasControlled ? "controlled" : "uncontrolled"} to ${isControlled ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`);
			isControlledRef.current = isControlled;
		}, [isControlled, caller]);
	}
	return [value, import_react.useCallback((nextValue) => {
		if (isControlled) {
			const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
			if (value2 !== prop) onChangeRef.current?.(value2);
		} else setUncontrolledProp(nextValue);
	}, [
		isControlled,
		prop,
		setUncontrolledProp,
		onChangeRef
	])];
}
function useUncontrolledState({ defaultProp, onChange }) {
	const [value, setValue] = import_react.useState(defaultProp);
	const prevValueRef = import_react.useRef(value);
	const onChangeRef = import_react.useRef(onChange);
	useInsertionEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);
	import_react.useEffect(() => {
		if (prevValueRef.current !== value) {
			onChangeRef.current?.(value);
			prevValueRef.current = value;
		}
	}, [value, prevValueRef]);
	return [
		value,
		setValue,
		onChangeRef
	];
}
function isFunction(value) {
	return typeof value === "function";
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-visually-hidden@1.2.7_@types+react-dom@19.2.3_@types+react@19.2.17__@ty_5c9a2e5554327bb90be9977ab54b6749/node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
var VISUALLY_HIDDEN_STYLES = Object.freeze({
	position: "absolute",
	border: 0,
	width: 1,
	height: 1,
	padding: 0,
	margin: -1,
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	wordWrap: "normal"
});
var NAME = "VisuallyHidden";
var VisuallyHidden = import_react.forwardRef((props, forwardedRef) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		...props,
		ref: forwardedRef,
		style: {
			...VISUALLY_HIDDEN_STYLES,
			...props.style
		}
	});
});
VisuallyHidden.displayName = NAME;
var Root = VisuallyHidden;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-tooltip@1.2.12_@types+react-dom@19.2.3_@types+react@19.2.17__@types+rea_7a1ca4bb9efb0be19c4e49a418127f5f/node_modules/@radix-ui/react-tooltip/dist/index.mjs
var [createTooltipContext, createTooltipScope] = createContextScope("Tooltip", [createPopperScope]);
var usePopperScope$1 = createPopperScope();
var PROVIDER_NAME = "TooltipProvider";
var DEFAULT_DELAY_DURATION = 700;
var TOOLTIP_OPEN = "tooltip.open";
var [TooltipProviderContextProvider, useTooltipProviderContext] = createTooltipContext(PROVIDER_NAME);
var TooltipProvider$1 = (props) => {
	const { __scopeTooltip, delayDuration = DEFAULT_DELAY_DURATION, skipDelayDuration = 300, disableHoverableContent = false, children } = props;
	const isOpenDelayedRef = import_react.useRef(true);
	const isPointerInTransitRef = import_react.useRef(false);
	const skipDelayTimerRef = import_react.useRef(0);
	import_react.useEffect(() => {
		const skipDelayTimer = skipDelayTimerRef.current;
		return () => window.clearTimeout(skipDelayTimer);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProviderContextProvider, {
		scope: __scopeTooltip,
		isOpenDelayedRef,
		delayDuration,
		onOpen: import_react.useCallback(() => {
			if (skipDelayDuration <= 0) return;
			window.clearTimeout(skipDelayTimerRef.current);
			isOpenDelayedRef.current = false;
		}, [skipDelayDuration]),
		onClose: import_react.useCallback(() => {
			if (skipDelayDuration <= 0) return;
			window.clearTimeout(skipDelayTimerRef.current);
			skipDelayTimerRef.current = window.setTimeout(() => isOpenDelayedRef.current = true, skipDelayDuration);
		}, [skipDelayDuration]),
		isPointerInTransitRef,
		onPointerInTransitChange: import_react.useCallback((inTransit) => {
			isPointerInTransitRef.current = inTransit;
		}, []),
		disableHoverableContent,
		children
	});
};
TooltipProvider$1.displayName = PROVIDER_NAME;
var TOOLTIP_NAME = "Tooltip";
var [TooltipContextProvider, useTooltipContext] = createTooltipContext(TOOLTIP_NAME);
var Tooltip$1 = (props) => {
	const { __scopeTooltip, children, open: openProp, defaultOpen, onOpenChange, disableHoverableContent: disableHoverableContentProp, delayDuration: delayDurationProp } = props;
	const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip);
	const popperScope = usePopperScope$1(__scopeTooltip);
	const [trigger, setTrigger] = import_react.useState(null);
	const contentId = useId();
	const openTimerRef = import_react.useRef(0);
	const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent;
	const delayDuration = delayDurationProp ?? providerContext.delayDuration;
	const wasOpenDelayedRef = import_react.useRef(false);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: (open2) => {
			if (open2) {
				providerContext.onOpen();
				document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
			} else providerContext.onClose();
			onOpenChange?.(open2);
		},
		caller: TOOLTIP_NAME
	});
	const stateAttribute = import_react.useMemo(() => {
		return open ? wasOpenDelayedRef.current ? "delayed-open" : "instant-open" : "closed";
	}, [open]);
	const handleOpen = import_react.useCallback(() => {
		window.clearTimeout(openTimerRef.current);
		openTimerRef.current = 0;
		wasOpenDelayedRef.current = false;
		setOpen(true);
	}, [setOpen]);
	const handleClose = import_react.useCallback(() => {
		window.clearTimeout(openTimerRef.current);
		openTimerRef.current = 0;
		setOpen(false);
	}, [setOpen]);
	const handleDelayedOpen = import_react.useCallback(() => {
		window.clearTimeout(openTimerRef.current);
		openTimerRef.current = window.setTimeout(() => {
			wasOpenDelayedRef.current = true;
			setOpen(true);
			openTimerRef.current = 0;
		}, delayDuration);
	}, [delayDuration, setOpen]);
	import_react.useEffect(() => {
		return () => {
			if (openTimerRef.current) {
				window.clearTimeout(openTimerRef.current);
				openTimerRef.current = 0;
			}
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2$1, {
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContextProvider, {
			scope: __scopeTooltip,
			contentId,
			open,
			stateAttribute,
			trigger,
			onTriggerChange: setTrigger,
			onTriggerEnter: import_react.useCallback(() => {
				if (providerContext.isOpenDelayedRef.current) handleDelayedOpen();
				else handleOpen();
			}, [
				providerContext.isOpenDelayedRef,
				handleDelayedOpen,
				handleOpen
			]),
			onTriggerLeave: import_react.useCallback(() => {
				if (disableHoverableContent) handleClose();
				else {
					window.clearTimeout(openTimerRef.current);
					openTimerRef.current = 0;
				}
			}, [handleClose, disableHoverableContent]),
			onOpen: handleOpen,
			onClose: handleClose,
			disableHoverableContent,
			children
		})
	});
};
Tooltip$1.displayName = TOOLTIP_NAME;
var TRIGGER_NAME$1 = "TooltipTrigger";
var TooltipTrigger$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeTooltip, ...triggerProps } = props;
	const context = useTooltipContext(TRIGGER_NAME$1, __scopeTooltip);
	const providerContext = useTooltipProviderContext(TRIGGER_NAME$1, __scopeTooltip);
	const popperScope = usePopperScope$1(__scopeTooltip);
	const composedRefs = useComposedRefs(forwardedRef, import_react.useRef(null), context.onTriggerChange);
	const isPointerDownRef = import_react.useRef(false);
	const hasPointerMoveOpenedRef = import_react.useRef(false);
	const handlePointerUp = import_react.useCallback(() => isPointerDownRef.current = false, []);
	import_react.useEffect(() => {
		return () => document.removeEventListener("pointerup", handlePointerUp);
	}, [handlePointerUp]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, {
		asChild: true,
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
			"aria-describedby": context.open ? context.contentId : void 0,
			"data-state": context.stateAttribute,
			...triggerProps,
			ref: composedRefs,
			onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
				if (event.pointerType === "touch") return;
				if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
					context.onTriggerEnter();
					hasPointerMoveOpenedRef.current = true;
				}
			}),
			onPointerLeave: composeEventHandlers(props.onPointerLeave, () => {
				context.onTriggerLeave();
				hasPointerMoveOpenedRef.current = false;
			}),
			onPointerDown: composeEventHandlers(props.onPointerDown, () => {
				if (context.open) context.onClose();
				isPointerDownRef.current = true;
				document.addEventListener("pointerup", handlePointerUp, { once: true });
			}),
			onFocus: composeEventHandlers(props.onFocus, () => {
				if (!isPointerDownRef.current) context.onOpen();
			}),
			onBlur: composeEventHandlers(props.onBlur, context.onClose),
			onClick: composeEventHandlers(props.onClick, context.onClose)
		})
	});
});
TooltipTrigger$1.displayName = TRIGGER_NAME$1;
var PORTAL_NAME$1 = "TooltipPortal";
var [PortalProvider$1, usePortalContext$1] = createTooltipContext(PORTAL_NAME$1, { forceMount: void 0 });
var TooltipPortal = (props) => {
	const { __scopeTooltip, forceMount, children, container } = props;
	const context = useTooltipContext(PORTAL_NAME$1, __scopeTooltip);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalProvider$1, {
		scope: __scopeTooltip,
		forceMount,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$2, {
				asChild: true,
				container,
				children
			})
		})
	});
};
TooltipPortal.displayName = PORTAL_NAME$1;
var CONTENT_NAME$1 = "TooltipContent";
var TooltipContent$1 = import_react.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext$1(CONTENT_NAME$1, props.__scopeTooltip);
	const { forceMount = portalContext.forceMount, side = "top", ...contentProps } = props;
	const context = useTooltipContext(CONTENT_NAME$1, props.__scopeTooltip);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: context.disableHoverableContent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContentImpl, {
			side,
			...contentProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContentHoverable, {
			side,
			...contentProps,
			ref: forwardedRef
		})
	});
});
var TooltipContentHoverable = import_react.forwardRef((props, forwardedRef) => {
	const context = useTooltipContext(CONTENT_NAME$1, props.__scopeTooltip);
	const providerContext = useTooltipProviderContext(CONTENT_NAME$1, props.__scopeTooltip);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const [pointerGraceArea, setPointerGraceArea] = import_react.useState(null);
	const { trigger, onClose } = context;
	const content = ref.current;
	const { onPointerInTransitChange } = providerContext;
	const handleRemoveGraceArea = import_react.useCallback(() => {
		setPointerGraceArea(null);
		onPointerInTransitChange(false);
	}, [onPointerInTransitChange]);
	const handleCreateGraceArea = import_react.useCallback((event, hoverTarget) => {
		const currentTarget = event.currentTarget;
		const exitPoint = {
			x: event.clientX,
			y: event.clientY
		};
		const paddedExitPoints = getPaddedExitPoints(exitPoint, getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect()));
		const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
		const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
		setPointerGraceArea(graceArea);
		onPointerInTransitChange(true);
	}, [onPointerInTransitChange]);
	import_react.useEffect(() => {
		return () => handleRemoveGraceArea();
	}, [handleRemoveGraceArea]);
	import_react.useEffect(() => {
		if (trigger && content) {
			const handleTriggerLeave = (event) => handleCreateGraceArea(event, content);
			const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
			trigger.addEventListener("pointerleave", handleTriggerLeave);
			content.addEventListener("pointerleave", handleContentLeave);
			return () => {
				trigger.removeEventListener("pointerleave", handleTriggerLeave);
				content.removeEventListener("pointerleave", handleContentLeave);
			};
		}
	}, [
		trigger,
		content,
		handleCreateGraceArea,
		handleRemoveGraceArea
	]);
	import_react.useEffect(() => {
		if (pointerGraceArea) {
			const handleTrackPointerGrace = (event) => {
				const target = event.target;
				const pointerPosition = {
					x: event.clientX,
					y: event.clientY
				};
				const hasEnteredTarget = trigger?.contains(target) || content?.contains(target);
				const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
				if (hasEnteredTarget) handleRemoveGraceArea();
				else if (isPointerOutsideGraceArea) {
					handleRemoveGraceArea();
					onClose();
				}
			};
			document.addEventListener("pointermove", handleTrackPointerGrace);
			return () => document.removeEventListener("pointermove", handleTrackPointerGrace);
		}
	}, [
		trigger,
		content,
		pointerGraceArea,
		onClose,
		handleRemoveGraceArea
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContentImpl, {
		...props,
		ref: composedRefs
	});
});
var [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(TOOLTIP_NAME, { isInside: false });
var Slottable = /* @__PURE__ */ createSlottable("TooltipContent");
var TooltipContentImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeTooltip, children, "aria-label": ariaLabel, onEscapeKeyDown, onPointerDownOutside, ...contentProps } = props;
	const context = useTooltipContext(CONTENT_NAME$1, __scopeTooltip);
	const popperScope = usePopperScope$1(__scopeTooltip);
	const { onClose } = context;
	import_react.useEffect(() => {
		document.addEventListener(TOOLTIP_OPEN, onClose);
		return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
	}, [onClose]);
	import_react.useEffect(() => {
		if (context.trigger) {
			const handleScroll = (event) => {
				if (event.target instanceof Node && event.target.contains(context.trigger)) onClose();
			};
			window.addEventListener("scroll", handleScroll, { capture: true });
			return () => window.removeEventListener("scroll", handleScroll, { capture: true });
		}
	}, [context.trigger, onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
		asChild: true,
		disableOutsidePointerEvents: false,
		onEscapeKeyDown,
		onPointerDownOutside,
		onFocusOutside: (event) => event.preventDefault(),
		onDismiss: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
			"data-state": context.stateAttribute,
			...popperScope,
			...contentProps,
			ref: forwardedRef,
			style: {
				...contentProps.style,
				"--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
				"--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
				"--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
				"--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
				"--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slottable, { children }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisuallyHiddenContentContextProvider, {
				scope: __scopeTooltip,
				isInside: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
					id: context.contentId,
					role: "tooltip",
					children: ariaLabel || children
				})
			})]
		})
	});
});
TooltipContent$1.displayName = CONTENT_NAME$1;
var ARROW_NAME$1 = "TooltipArrow";
var TooltipArrow = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeTooltip, ...arrowProps } = props;
	const popperScope = usePopperScope$1(__scopeTooltip);
	return useVisuallyHiddenContentContext(ARROW_NAME$1, __scopeTooltip).isInside ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
		...popperScope,
		...arrowProps,
		ref: forwardedRef
	});
});
TooltipArrow.displayName = ARROW_NAME$1;
function getExitSideFromRect(point, rect) {
	const top = Math.abs(rect.top - point.y);
	const bottom = Math.abs(rect.bottom - point.y);
	const right = Math.abs(rect.right - point.x);
	const left = Math.abs(rect.left - point.x);
	switch (Math.min(top, bottom, right, left)) {
		case left: return "left";
		case right: return "right";
		case top: return "top";
		case bottom: return "bottom";
		default: throw new Error("unreachable");
	}
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
	const paddedExitPoints = [];
	switch (exitSide) {
		case "top":
			paddedExitPoints.push({
				x: exitPoint.x - padding,
				y: exitPoint.y + padding
			}, {
				x: exitPoint.x + padding,
				y: exitPoint.y + padding
			});
			break;
		case "bottom":
			paddedExitPoints.push({
				x: exitPoint.x - padding,
				y: exitPoint.y - padding
			}, {
				x: exitPoint.x + padding,
				y: exitPoint.y - padding
			});
			break;
		case "left":
			paddedExitPoints.push({
				x: exitPoint.x + padding,
				y: exitPoint.y - padding
			}, {
				x: exitPoint.x + padding,
				y: exitPoint.y + padding
			});
			break;
		case "right":
			paddedExitPoints.push({
				x: exitPoint.x - padding,
				y: exitPoint.y - padding
			}, {
				x: exitPoint.x - padding,
				y: exitPoint.y + padding
			});
			break;
	}
	return paddedExitPoints;
}
function getPointsFromRect(rect) {
	const { top, right, bottom, left } = rect;
	return [
		{
			x: left,
			y: top
		},
		{
			x: right,
			y: top
		},
		{
			x: right,
			y: bottom
		},
		{
			x: left,
			y: bottom
		}
	];
}
function isPointInPolygon(point, polygon) {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const ii = polygon[i];
		const jj = polygon[j];
		const xi = ii.x;
		const yi = ii.y;
		const xj = jj.x;
		const yj = jj.y;
		if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
function getHull(points) {
	const newPoints = points.slice();
	newPoints.sort((a, b) => {
		if (a.x < b.x) return -1;
		else if (a.x > b.x) return 1;
		else if (a.y < b.y) return -1;
		else if (a.y > b.y) return 1;
		else return 0;
	});
	return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
	if (points.length <= 1) return points.slice();
	const upperHull = [];
	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		while (upperHull.length >= 2) {
			const q = upperHull[upperHull.length - 1];
			const r = upperHull[upperHull.length - 2];
			if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
			else break;
		}
		upperHull.push(p);
	}
	upperHull.pop();
	const lowerHull = [];
	for (let i = points.length - 1; i >= 0; i--) {
		const p = points[i];
		while (lowerHull.length >= 2) {
			const q = lowerHull[lowerHull.length - 1];
			const r = lowerHull[lowerHull.length - 2];
			if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
			else break;
		}
		lowerHull.push(p);
	}
	lowerHull.pop();
	if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) return upperHull;
	else return upperHull.concat(lowerHull);
}
var Provider = TooltipProvider$1;
var Root3 = Tooltip$1;
var Trigger$1 = TooltipTrigger$1;
var Portal$1 = TooltipPortal;
var Content2$1 = TooltipContent$1;
//#endregion
//#region node_modules/.pnpm/@tabler+icons-react@3.44.0_react@19.2.7/node_modules/@tabler/icons-react/dist/esm/defaultAttributes.mjs
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
	outline: {
		xmlns: "http://www.w3.org/2000/svg",
		width: 24,
		height: 24,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round"
	},
	filled: {
		xmlns: "http://www.w3.org/2000/svg",
		width: 24,
		height: 24,
		viewBox: "0 0 24 24",
		fill: "currentColor",
		stroke: "none"
	}
};
//#endregion
//#region node_modules/.pnpm/@tabler+icons-react@3.44.0_react@19.2.7/node_modules/@tabler/icons-react/dist/esm/createReactComponent.mjs
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var createReactComponent = (type, iconName, iconNamePascal, iconNode) => {
	const Component = (0, import_react.forwardRef)(({ color = "currentColor", size = 24, stroke = 2, title, className, children, ...rest }, ref) => (0, import_react.createElement)("svg", {
		ref,
		...defaultAttributes[type],
		width: size,
		height: size,
		className: [
			`tabler-icon`,
			`tabler-icon-${iconName}`,
			className
		].join(" "),
		...type === "filled" ? { fill: color } : {
			strokeWidth: stroke,
			stroke: color
		},
		...rest
	}, [
		title && (0, import_react.createElement)("title", { key: "svg-title" }, title),
		...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)),
		...Array.isArray(children) ? children : [children]
	]));
	Component.displayName = `${iconNamePascal}`;
	return Component;
};
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconAlertTriangle = createReactComponent("outline", "alert-triangle", "AlertTriangle", [
	["path", {
		"d": "M12 9v4",
		"key": "svg-0"
	}],
	["path", {
		"d": "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0",
		"key": "svg-1"
	}],
	["path", {
		"d": "M12 16h.01",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconBrandGithub = createReactComponent("outline", "brand-github", "BrandGithub", [["path", {
	"d": "M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5",
	"key": "svg-0"
}]]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconCheck = createReactComponent("outline", "check", "Check", [["path", {
	"d": "M5 12l5 5l10 -10",
	"key": "svg-0"
}]]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconCopy = createReactComponent("outline", "copy", "Copy", [["path", {
	"d": "M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666",
	"key": "svg-0"
}], ["path", {
	"d": "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1",
	"key": "svg-1"
}]]);
//#endregion
//#region node_modules/.pnpm/@agent-native+toolkit@0.20.4_@floating-ui+dom@1.7.6_@tiptap+extension-code-block@3.28.0_0ff20177eefff338d7ce7908b45858f5/node_modules/@agent-native/toolkit/dist/ui/tooltip.js
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger$1;
function normalizeTooltipText(text) {
	return text.replace(/\\u([0-9a-fA-F]{4})/g, (_match, hex) => String.fromCharCode(Number.parseInt(hex, 16))).replace(/\b([A-Za-z][A-Za-z ]*?)\((?=(?:⌘|⌃|⌥|⇧|Ctrl|Alt|Shift|Cmd))/g, (_match, label) => `${label.charAt(0).toUpperCase()}${label.slice(1)} (`);
}
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 6, children, container, ...props }, ref) => {
	const normalizedChildren = typeof children === "string" ? normalizeTooltipText(children) : children;
	return (0, import_jsx_runtime.jsx)(Portal$1, {
		container,
		children: (0, import_jsx_runtime.jsx)(Content2$1, {
			ref,
			sideOffset,
			"data-agent-native-tooltip": "true",
			className: cn$1("z-[500] overflow-hidden rounded-md border border-border bg-popover px-2 py-1 text-[11px] text-foreground shadow-md origin-[var(--radix-tooltip-content-transform-origin)] data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=delayed-open]:duration-150 motion-reduce:data-[state=delayed-open]:zoom-in-100", className),
			...props,
			children: normalizedChildren
		})
	});
});
TooltipContent.displayName = Content2$1.displayName;
//#endregion
//#region node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs
/**
* Copyright 2022 Joe Bell. All rights reserved.
*
* This file is licensed to you under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with the
* License. You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR REPRESENTATIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations under
* the License.
*/ var falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
var cx = clsx;
var cva = (base, config) => (props) => {
	var _config_compoundVariants;
	if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
	const { variants, defaultVariants } = config;
	const getVariantClassNames = Object.keys(variants).map((variant) => {
		const variantProp = props === null || props === void 0 ? void 0 : props[variant];
		const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
		if (variantProp === null) return null;
		const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
		return variants[variant][variantKey];
	});
	const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
		let [key, value] = param;
		if (value === void 0) return acc;
		acc[key] = value;
		return acc;
	}, {});
	return cx(base, getVariantClassNames, config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
		let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
		return Object.entries(compoundVariantOptions).every((param) => {
			let [key, value] = param;
			return Array.isArray(value) ? value.includes({
				...defaultVariants,
				...propsWithoutUndefined
			}[key]) : {
				...defaultVariants,
				...propsWithoutUndefined
			}[key] === value;
		}) ? [
			...acc,
			cvClass,
			cvClassName
		] : acc;
	}, []), props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
//#endregion
//#region node_modules/.pnpm/@agent-native+toolkit@0.20.4_@floating-ui+dom@1.7.6_@tiptap+extension-code-block@3.28.0_0ff20177eefff338d7ce7908b45858f5/node_modules/@agent-native/toolkit/dist/design-system/context.js
var DesignSystemContext = (0, import_react.createContext)({});
var LegacyButtonRenderContext = (0, import_react.createContext)(false);
function useDesignSystem() {
	return (0, import_react.useContext)(DesignSystemContext).definition;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+toolkit@0.20.4_@floating-ui+dom@1.7.6_@tiptap+extension-code-block@3.28.0_0ff20177eefff338d7ce7908b45858f5/node_modules/@agent-native/toolkit/dist/design-system/error-boundary.js
var DesignSystemErrorBoundary = class extends import_react.Component {
	state = { failed: false };
	static getDerivedStateFromError() {
		return { failed: true };
	}
	componentDidCatch(error, info) {
		console.error(`[agent-native] Custom design-system component ${this.props.component} failed; rendering the default adapter for this control.`, error, info);
	}
	render() {
		if (this.state.failed) return this.props.fallback;
		return this.props.children;
	}
};
//#endregion
//#region node_modules/.pnpm/@agent-native+toolkit@0.20.4_@floating-ui+dom@1.7.6_@tiptap+extension-code-block@3.28.0_0ff20177eefff338d7ce7908b45858f5/node_modules/@agent-native/toolkit/dist/provider.js
var ToolkitComponentsContext = (0, import_react.createContext)({});
function ToolkitProvider({ children, components, designSystem }) {
	const parent = (0, import_react.useContext)(ToolkitComponentsContext);
	const parentDesignSystem = (0, import_react.useContext)(DesignSystemContext);
	const value = (0, import_react.useMemo)(() => ({
		...parent,
		...components
	}), [parent, components]);
	const mergedDefinition = (0, import_react.useMemo)(() => {
		if (!designSystem) return parentDesignSystem.definition;
		return {
			...parentDesignSystem.definition,
			...designSystem,
			components: {
				...parentDesignSystem.definition?.components,
				...designSystem.components
			}
		};
	}, [designSystem, parentDesignSystem.definition]);
	const legacyActionButton = (0, import_react.useMemo)(() => {
		if (!value.Button) return parentDesignSystem.legacyActionButton;
		const LegacyButton = value.Button;
		return function LegacyActionButton({ children, intent, emphasis, inset, size, pending, leadingIcon, trailingIcon, onPress, onClick, elementRef, ...props }) {
			const variant = inset && emphasis === "ghost" ? "ghost-inset" : emphasis === "ghost" ? "ghost" : emphasis === "outline" ? "outline" : intent === "danger" ? "destructive" : intent === "primary" ? "default" : "secondary";
			const legacySize = size === "compact" ? "sm" : size === "large" ? "lg" : "default";
			return (0, import_jsx_runtime.jsx)(LegacyButtonRenderContext.Provider, {
				value: true,
				children: (0, import_jsx_runtime.jsxs)(LegacyButton, {
					...props,
					ref: elementRef,
					variant,
					size: legacySize,
					disabled: props.disabled || pending,
					"aria-busy": pending || void 0,
					onClick: (event) => {
						onPress?.(event);
						onClick?.(event);
					},
					children: [
						leadingIcon,
						children,
						trailingIcon
					]
				})
			});
		};
	}, [parentDesignSystem.legacyActionButton, value.Button]);
	const designSystemValue = (0, import_react.useMemo)(() => ({
		definition: mergedDefinition,
		legacyActionButton
	}), [legacyActionButton, mergedDefinition]);
	(0, import_react.useEffect)(() => {
		if (!mergedDefinition?.components?.ActionButton || !value.Button) return;
		console.warn("[agent-native] ToolkitProvider received both designSystem.components.ActionButton and legacy components.Button. ActionButton takes precedence.");
	}, [mergedDefinition?.components?.ActionButton, value.Button]);
	return (0, import_jsx_runtime.jsx)(DesignSystemContext.Provider, {
		value: designSystemValue,
		children: (0, import_jsx_runtime.jsx)(ToolkitComponentsContext.Provider, {
			value,
			children
		})
	});
}
function useToolkitComponents() {
	return (0, import_react.useContext)(ToolkitComponentsContext);
}
function useToolkitComponent(name) {
	return useToolkitComponents()[name];
}
//#endregion
//#region node_modules/.pnpm/@agent-native+toolkit@0.20.4_@floating-ui+dom@1.7.6_@tiptap+extension-code-block@3.28.0_0ff20177eefff338d7ce7908b45858f5/node_modules/@agent-native/toolkit/dist/ui/button.js
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-[color,background-color,border-color,box-shadow,transform,scale] duration-150 active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			outline: "bg-accent text-accent-foreground hover:bg-accent/80",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			"ghost-inset": "text-muted-foreground hover:bg-accent/40 hover:text-foreground focus-visible:ring-inset focus-visible:ring-offset-0",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-10 px-4 py-2",
			sm: "h-9 rounded-md px-3",
			lg: "h-11 rounded-md px-8",
			icon: "h-10 w-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var ButtonBase = import_react.forwardRef(({ className, variant, size, asChild = false, intent: _intent, emphasis: _emphasis, ...props }, ref) => {
	return (0, import_jsx_runtime.jsx)(asChild ? Slot$1 : "button", {
		className: cn$1(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
ButtonBase.displayName = "ButtonBase";
var ButtonOverrideRenderContext = import_react.createContext(false);
var Button = import_react.forwardRef(({ variant, size, asChild = false, intent, emphasis, ...props }, ref) => {
	const DesignSystemActionButton = useDesignSystem()?.components?.ActionButton;
	const Override = useToolkitComponent("Button");
	const isRenderingOverride = import_react.useContext(ButtonOverrideRenderContext);
	const isRenderingLegacyButton = import_react.useContext(LegacyButtonRenderContext);
	const fallback = (0, import_jsx_runtime.jsx)(ButtonBase, {
		ref,
		variant,
		size,
		asChild,
		...props
	});
	if (DesignSystemActionButton && !asChild && !isRenderingLegacyButton) {
		const semanticIntent = intent ?? (variant === "destructive" ? "danger" : variant === "default" ? "primary" : "neutral");
		const semanticEmphasis = emphasis === "ghost-inset" ? "ghost" : emphasis ?? (variant === "outline" ? "outline" : variant === "ghost-inset" ? "ghost" : variant === "ghost" || variant === "link" ? "ghost" : "solid");
		const inset = semanticEmphasis === "ghost" && (emphasis === "ghost-inset" || !emphasis && variant === "ghost-inset");
		const semanticSize = size === "sm" ? "compact" : size === "lg" ? "large" : "default";
		return (0, import_jsx_runtime.jsx)(DesignSystemErrorBoundary, {
			component: "ActionButton",
			fallback,
			children: (0, import_jsx_runtime.jsx)(DesignSystemActionButton, {
				className: props.className,
				style: props.style,
				id: props.id,
				"aria-label": props["aria-label"],
				"aria-labelledby": props["aria-labelledby"],
				"aria-describedby": props["aria-describedby"],
				"aria-controls": props["aria-controls"],
				elementRef: ref,
				type: props.type,
				disabled: props.disabled,
				intent: semanticIntent,
				emphasis: semanticEmphasis,
				inset: inset || void 0,
				size: semanticSize,
				onPress: (event) => props.onClick?.(event),
				children: props.children
			})
		});
	}
	if (Override && Override !== Button && !isRenderingOverride) {
		const OverrideButton = Override;
		return (0, import_jsx_runtime.jsx)(DesignSystemErrorBoundary, {
			component: "ActionButton",
			fallback,
			children: (0, import_jsx_runtime.jsx)(ButtonOverrideRenderContext.Provider, {
				value: true,
				children: (0, import_jsx_runtime.jsx)(OverrideButton, {
					ref,
					variant,
					size,
					asChild,
					intent,
					emphasis,
					...props
				})
			})
		});
	}
	return fallback;
});
Button.displayName = "Button";
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-focus-guards@1.1.4_@types+react@19.2.17_react@19.2.7/node_modules/@radix-ui/react-focus-guards/dist/index.mjs
var count = 0;
var guards = null;
function useFocusGuards() {
	import_react.useEffect(() => {
		if (!guards) guards = {
			start: createFocusGuard(),
			end: createFocusGuard()
		};
		const { start, end } = guards;
		if (document.body.firstElementChild !== start) document.body.insertAdjacentElement("afterbegin", start);
		if (document.body.lastElementChild !== end) document.body.insertAdjacentElement("beforeend", end);
		count++;
		return () => {
			if (count === 1) {
				guards?.start.remove();
				guards?.end.remove();
				guards = null;
			}
			count = Math.max(0, count - 1);
		};
	}, []);
}
function createFocusGuard() {
	const element = document.createElement("span");
	element.setAttribute("data-radix-focus-guard", "");
	element.tabIndex = 0;
	element.style.outline = "none";
	element.style.opacity = "0";
	element.style.position = "fixed";
	element.style.pointerEvents = "none";
	return element;
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-focus-scope@1.1.12_@types+react-dom@19.2.3_@types+react@19.2.17__@types_7d8cd400dbf12dff34668e402b760e23/node_modules/@radix-ui/react-focus-scope/dist/index.mjs
var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS = {
	bubbles: false,
	cancelable: true
};
var FOCUS_SCOPE_NAME = "FocusScope";
var FocusScope = import_react.forwardRef((props, forwardedRef) => {
	const { loop = false, trapped = false, onMountAutoFocus: onMountAutoFocusProp, onUnmountAutoFocus: onUnmountAutoFocusProp, ...scopeProps } = props;
	const [container, setContainer] = import_react.useState(null);
	const onMountAutoFocus = useCallbackRef$1(onMountAutoFocusProp);
	const onUnmountAutoFocus = useCallbackRef$1(onUnmountAutoFocusProp);
	const lastFocusedElementRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, setContainer);
	const focusScope = import_react.useRef({
		paused: false,
		pause() {
			this.paused = true;
		},
		resume() {
			this.paused = false;
		}
	}).current;
	import_react.useEffect(() => {
		if (trapped) {
			let handleFocusIn2 = function(event) {
				if (focusScope.paused || !container) return;
				const target = event.target;
				if (container.contains(target)) lastFocusedElementRef.current = target;
				else focus(lastFocusedElementRef.current, { select: true });
			}, handleFocusOut2 = function(event) {
				if (focusScope.paused || !container) return;
				const relatedTarget = event.relatedTarget;
				if (relatedTarget === null) return;
				if (!container.contains(relatedTarget)) focus(lastFocusedElementRef.current, { select: true });
			}, handleMutations2 = function(mutations) {
				if (document.activeElement !== document.body) return;
				for (const mutation of mutations) if (mutation.removedNodes.length > 0) focus(container);
			};
			document.addEventListener("focusin", handleFocusIn2);
			document.addEventListener("focusout", handleFocusOut2);
			const mutationObserver = new MutationObserver(handleMutations2);
			if (container) mutationObserver.observe(container, {
				childList: true,
				subtree: true
			});
			return () => {
				document.removeEventListener("focusin", handleFocusIn2);
				document.removeEventListener("focusout", handleFocusOut2);
				mutationObserver.disconnect();
			};
		}
	}, [
		trapped,
		container,
		focusScope.paused
	]);
	import_react.useEffect(() => {
		if (container) {
			focusScopesStack.add(focusScope);
			const previouslyFocusedElement = document.activeElement;
			if (!container.contains(previouslyFocusedElement)) {
				const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
				container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
				container.dispatchEvent(mountEvent);
				if (!mountEvent.defaultPrevented) {
					focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
					if (document.activeElement === previouslyFocusedElement) focus(container);
				}
			}
			return () => {
				container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
				setTimeout(() => {
					const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
					container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
					container.dispatchEvent(unmountEvent);
					if (!unmountEvent.defaultPrevented) focus(previouslyFocusedElement ?? document.body, { select: true });
					container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
					focusScopesStack.remove(focusScope);
				}, 0);
			};
		}
	}, [
		container,
		onMountAutoFocus,
		onUnmountAutoFocus,
		focusScope
	]);
	const handleKeyDown = import_react.useCallback((event) => {
		if (!loop && !trapped) return;
		if (focusScope.paused) return;
		const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
		const focusedElement = document.activeElement;
		if (isTabKey && focusedElement) {
			const container2 = event.currentTarget;
			const [first, last] = getTabbableEdges(container2);
			if (!(first && last)) {
				if (focusedElement === container2) event.preventDefault();
			} else if (!event.shiftKey && focusedElement === last) {
				event.preventDefault();
				if (loop) focus(first, { select: true });
			} else if (event.shiftKey && focusedElement === first) {
				event.preventDefault();
				if (loop) focus(last, { select: true });
			}
		}
	}, [
		loop,
		trapped,
		focusScope.paused
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		tabIndex: -1,
		...scopeProps,
		ref: composedRefs,
		onKeyDown: handleKeyDown
	});
});
FocusScope.displayName = FOCUS_SCOPE_NAME;
function focusFirst(candidates, { select = false } = {}) {
	const previouslyFocusedElement = document.activeElement;
	for (const candidate of candidates) {
		focus(candidate, { select });
		if (document.activeElement !== previouslyFocusedElement) return;
	}
}
function getTabbableEdges(container) {
	const candidates = getTabbableCandidates(container);
	return [findVisible(candidates, container), findVisible(candidates.reverse(), container)];
}
function getTabbableCandidates(container) {
	const nodes = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
		const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
		if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
		return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	while (walker.nextNode()) nodes.push(walker.currentNode);
	return nodes;
}
function findVisible(elements, container) {
	const canUseCheckVisibility = typeof container.checkVisibility === "function" && container.checkVisibility({ checkVisibilityCSS: true });
	for (const element of elements) if (!(canUseCheckVisibility ? !element.checkVisibility({ checkVisibilityCSS: true }) : isHidden(element, { upTo: container }))) return element;
}
function isHidden(node, { upTo }) {
	if (getComputedStyle(node).visibility === "hidden") return true;
	while (node) {
		if (upTo !== void 0 && node === upTo) return false;
		if (getComputedStyle(node).display === "none") return true;
		node = node.parentElement;
	}
	return false;
}
function isSelectableInput(element) {
	return element instanceof HTMLInputElement && "select" in element;
}
function focus(element, { select = false } = {}) {
	if (element && element.focus) {
		const previouslyFocusedElement = document.activeElement;
		element.focus({ preventScroll: true });
		if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select();
	}
}
var focusScopesStack = createFocusScopesStack();
function createFocusScopesStack() {
	let stack = [];
	return {
		add(focusScope) {
			const activeFocusScope = stack[0];
			if (focusScope !== activeFocusScope) activeFocusScope?.pause();
			stack = arrayRemove(stack, focusScope);
			stack.unshift(focusScope);
		},
		remove(focusScope) {
			stack = arrayRemove(stack, focusScope);
			stack[0]?.resume();
		}
	};
}
function arrayRemove(array, item) {
	const updatedArray = [...array];
	const index = updatedArray.indexOf(item);
	if (index !== -1) updatedArray.splice(index, 1);
	return updatedArray;
}
function removeLinks(items) {
	return items.filter((item) => item.tagName !== "A");
}
//#endregion
//#region node_modules/.pnpm/aria-hidden@1.2.6/node_modules/aria-hidden/dist/es2015/index.js
var getDefaultParent = function(originalTarget) {
	if (typeof document === "undefined") return null;
	return (Array.isArray(originalTarget) ? originalTarget[0] : originalTarget).ownerDocument.body;
};
var counterMap = /* @__PURE__ */ new WeakMap();
var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function(node) {
	return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function(parent, targets) {
	return targets.map(function(target) {
		if (parent.contains(target)) return target;
		var correctedTarget = unwrapHost(target);
		if (correctedTarget && parent.contains(correctedTarget)) return correctedTarget;
		console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
		return null;
	}).filter(function(x) {
		return Boolean(x);
	});
};
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @param {String} [controlAttribute] - html Attribute to control
* @return {Undo} undo command
*/
var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
	var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	if (!markerMap[markerName]) markerMap[markerName] = /* @__PURE__ */ new WeakMap();
	var markerCounter = markerMap[markerName];
	var hiddenNodes = [];
	var elementsToKeep = /* @__PURE__ */ new Set();
	var elementsToStop = new Set(targets);
	var keep = function(el) {
		if (!el || elementsToKeep.has(el)) return;
		elementsToKeep.add(el);
		keep(el.parentNode);
	};
	targets.forEach(keep);
	var deep = function(parent) {
		if (!parent || elementsToStop.has(parent)) return;
		Array.prototype.forEach.call(parent.children, function(node) {
			if (elementsToKeep.has(node)) deep(node);
			else try {
				var attr = node.getAttribute(controlAttribute);
				var alreadyHidden = attr !== null && attr !== "false";
				var counterValue = (counterMap.get(node) || 0) + 1;
				var markerValue = (markerCounter.get(node) || 0) + 1;
				counterMap.set(node, counterValue);
				markerCounter.set(node, markerValue);
				hiddenNodes.push(node);
				if (counterValue === 1 && alreadyHidden) uncontrolledNodes.set(node, true);
				if (markerValue === 1) node.setAttribute(markerName, "true");
				if (!alreadyHidden) node.setAttribute(controlAttribute, "true");
			} catch (e) {
				console.error("aria-hidden: cannot operate on ", node, e);
			}
		});
	};
	deep(parentNode);
	elementsToKeep.clear();
	lockCount++;
	return function() {
		hiddenNodes.forEach(function(node) {
			var counterValue = counterMap.get(node) - 1;
			var markerValue = markerCounter.get(node) - 1;
			counterMap.set(node, counterValue);
			markerCounter.set(node, markerValue);
			if (!counterValue) {
				if (!uncontrolledNodes.has(node)) node.removeAttribute(controlAttribute);
				uncontrolledNodes.delete(node);
			}
			if (!markerValue) node.removeAttribute(markerName);
		});
		lockCount--;
		if (!lockCount) {
			counterMap = /* @__PURE__ */ new WeakMap();
			counterMap = /* @__PURE__ */ new WeakMap();
			uncontrolledNodes = /* @__PURE__ */ new WeakMap();
			markerMap = {};
		}
	};
};
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @return {Undo} undo command
*/
var hideOthers = function(originalTarget, parentNode, markerName) {
	if (markerName === void 0) markerName = "data-aria-hidden";
	var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	var activeParentNode = parentNode || getDefaultParent(originalTarget);
	if (!activeParentNode) return function() {
		return null;
	};
	targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
	return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
};
//#endregion
//#region node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var __assign = function() {
	__assign = Object.assign || function __assign(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
function __spreadArray(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
}
//#endregion
//#region node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var zeroRightClassName = "right-scroll-bar-position";
var fullWidthClassName = "width-before-scroll-bar";
var noScrollbarsClassName = "with-scroll-bars-hidden";
/**
* Name of a CSS variable containing the amount of "hidden" scrollbar
* ! might be undefined ! use will fallback!
*/
var removedBarSizeVariable = "--removed-body-scroll-bar-size";
//#endregion
//#region node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.17_react@19.2.7/node_modules/use-callback-ref/dist/es2015/assignRef.js
/**
* Assigns a value for a given ref, no matter of the ref format
* @param {RefObject} ref - a callback function or ref object
* @param value - a new value
*
* @see https://github.com/theKashey/use-callback-ref#assignref
* @example
* const refObject = useRef();
* const refFn = (ref) => {....}
*
* assignRef(refObject, "refValue");
* assignRef(refFn, "refValue");
*/
function assignRef(ref, value) {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
	return ref;
}
//#endregion
//#region node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.17_react@19.2.7/node_modules/use-callback-ref/dist/es2015/useRef.js
/**
* creates a MutableRef with ref change callback
* @param initialValue - initial ref value
* @param {Function} callback - a callback to run when value changes
*
* @example
* const ref = useCallbackRef(0, (newValue, oldValue) => console.log(oldValue, '->', newValue);
* ref.current = 1;
* // prints 0 -> 1
*
* @see https://reactjs.org/docs/hooks-reference.html#useref
* @see https://github.com/theKashey/use-callback-ref#usecallbackref---to-replace-reactuseref
* @returns {MutableRefObject}
*/
function useCallbackRef(initialValue, callback) {
	var ref = (0, import_react.useState)(function() {
		return {
			value: initialValue,
			callback,
			facade: {
				get current() {
					return ref.value;
				},
				set current(value) {
					var last = ref.value;
					if (last !== value) {
						ref.value = value;
						ref.callback(value, last);
					}
				}
			}
		};
	})[0];
	ref.callback = callback;
	return ref.facade;
}
//#endregion
//#region node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.17_react@19.2.7/node_modules/use-callback-ref/dist/es2015/useMergeRef.js
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
var currentValues = /* @__PURE__ */ new WeakMap();
/**
* Merges two or more refs together providing a single interface to set their value
* @param {RefObject|Ref} refs
* @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
*
* @see {@link mergeRefs} a version without buit-in memoization
* @see https://github.com/theKashey/use-callback-ref#usemergerefs
* @example
* const Component = React.forwardRef((props, ref) => {
*   const ownRef = useRef();
*   const domRef = useMergeRefs([ref, ownRef]); // 👈 merge together
*   return <div ref={domRef}>...</div>
* }
*/
function useMergeRefs(refs, defaultValue) {
	var callbackRef = useCallbackRef(defaultValue || null, function(newValue) {
		return refs.forEach(function(ref) {
			return assignRef(ref, newValue);
		});
	});
	useIsomorphicLayoutEffect(function() {
		var oldValue = currentValues.get(callbackRef);
		if (oldValue) {
			var prevRefs_1 = new Set(oldValue);
			var nextRefs_1 = new Set(refs);
			var current_1 = callbackRef.current;
			prevRefs_1.forEach(function(ref) {
				if (!nextRefs_1.has(ref)) assignRef(ref, null);
			});
			nextRefs_1.forEach(function(ref) {
				if (!prevRefs_1.has(ref)) assignRef(ref, current_1);
			});
		}
		currentValues.set(callbackRef, refs);
	}, [refs]);
	return callbackRef;
}
//#endregion
//#region node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.17_react@19.2.7/node_modules/use-sidecar/dist/es2015/medium.js
function ItoI(a) {
	return a;
}
function innerCreateMedium(defaults, middleware) {
	if (middleware === void 0) middleware = ItoI;
	var buffer = [];
	var assigned = false;
	return {
		read: function() {
			if (assigned) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
			if (buffer.length) return buffer[buffer.length - 1];
			return defaults;
		},
		useMedium: function(data) {
			var item = middleware(data, assigned);
			buffer.push(item);
			return function() {
				buffer = buffer.filter(function(x) {
					return x !== item;
				});
			};
		},
		assignSyncMedium: function(cb) {
			assigned = true;
			while (buffer.length) {
				var cbs = buffer;
				buffer = [];
				cbs.forEach(cb);
			}
			buffer = {
				push: function(x) {
					return cb(x);
				},
				filter: function() {
					return buffer;
				}
			};
		},
		assignMedium: function(cb) {
			assigned = true;
			var pendingQueue = [];
			if (buffer.length) {
				var cbs = buffer;
				buffer = [];
				cbs.forEach(cb);
				pendingQueue = buffer;
			}
			var executeQueue = function() {
				var cbs = pendingQueue;
				pendingQueue = [];
				cbs.forEach(cb);
			};
			var cycle = function() {
				return Promise.resolve().then(executeQueue);
			};
			cycle();
			buffer = {
				push: function(x) {
					pendingQueue.push(x);
					cycle();
				},
				filter: function(filter) {
					pendingQueue = pendingQueue.filter(filter);
					return buffer;
				}
			};
		}
	};
}
function createSidecarMedium(options) {
	if (options === void 0) options = {};
	var medium = innerCreateMedium(null);
	medium.options = __assign({
		async: true,
		ssr: false
	}, options);
	return medium;
}
//#endregion
//#region node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.17_react@19.2.7/node_modules/use-sidecar/dist/es2015/exports.js
var SideCar = function(_a) {
	var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
	if (!sideCar) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
	var Target = sideCar.read();
	if (!Target) throw new Error("Sidecar medium not found");
	return import_react.createElement(Target, __assign({}, rest));
};
SideCar.isSideCarExport = true;
function exportSidecar(medium, exported) {
	medium.useMedium(exported);
	return SideCar;
}
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/medium.js
var effectCar = createSidecarMedium();
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/UI.js
var nothing = function() {};
/**
* Removes scrollbar from the page and contain the scroll within the Lock
*/
var RemoveScroll = import_react.forwardRef(function(props, parentRef) {
	var ref = import_react.useRef(null);
	var _a = import_react.useState({
		onScrollCapture: nothing,
		onWheelCapture: nothing,
		onTouchMoveCapture: nothing
	}), callbacks = _a[0], setCallbacks = _a[1];
	var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, [
		"forwardProps",
		"children",
		"className",
		"removeScrollBar",
		"enabled",
		"shards",
		"sideCar",
		"noRelative",
		"noIsolation",
		"inert",
		"allowPinchZoom",
		"as",
		"gapMode"
	]);
	var SideCar = sideCar;
	var containerRef = useMergeRefs([ref, parentRef]);
	var containerProps = __assign(__assign({}, rest), callbacks);
	return import_react.createElement(import_react.Fragment, null, enabled && import_react.createElement(SideCar, {
		sideCar: effectCar,
		removeScrollBar,
		shards,
		noRelative,
		noIsolation,
		inert,
		setCallbacks,
		allowPinchZoom: !!allowPinchZoom,
		lockRef: ref,
		gapMode
	}), forwardProps ? import_react.cloneElement(import_react.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : import_react.createElement(Container, __assign({}, containerProps, {
		className,
		ref: containerRef
	}), children));
});
RemoveScroll.defaultProps = {
	enabled: true,
	removeScrollBar: true,
	inert: false
};
RemoveScroll.classNames = {
	fullWidth: fullWidthClassName,
	zeroRight: zeroRightClassName
};
//#endregion
//#region node_modules/.pnpm/get-nonce@1.0.1/node_modules/get-nonce/dist/es2015/index.js
var currentNonce;
var getNonce = function() {
	if (currentNonce) return currentNonce;
	if (typeof __webpack_nonce__ !== "undefined") return __webpack_nonce__;
};
//#endregion
//#region node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@19.2.17_react@19.2.7/node_modules/react-style-singleton/dist/es2015/singleton.js
function makeStyleTag() {
	if (!document) return null;
	var tag = document.createElement("style");
	tag.type = "text/css";
	var nonce = getNonce();
	if (nonce) tag.setAttribute("nonce", nonce);
	return tag;
}
function injectStyles(tag, css) {
	if (tag.styleSheet) tag.styleSheet.cssText = css;
	else tag.appendChild(document.createTextNode(css));
}
function insertStyleTag(tag) {
	(document.head || document.getElementsByTagName("head")[0]).appendChild(tag);
}
var stylesheetSingleton = function() {
	var counter = 0;
	var stylesheet = null;
	return {
		add: function(style) {
			if (counter == 0) {
				if (stylesheet = makeStyleTag()) {
					injectStyles(stylesheet, style);
					insertStyleTag(stylesheet);
				}
			}
			counter++;
		},
		remove: function() {
			counter--;
			if (!counter && stylesheet) {
				stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
				stylesheet = null;
			}
		}
	};
};
//#endregion
//#region node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@19.2.17_react@19.2.7/node_modules/react-style-singleton/dist/es2015/hook.js
/**
* creates a hook to control style singleton
* @see {@link styleSingleton} for a safer component version
* @example
* ```tsx
* const useStyle = styleHookSingleton();
* ///
* useStyle('body { overflow: hidden}');
*/
var styleHookSingleton = function() {
	var sheet = stylesheetSingleton();
	return function(styles, isDynamic) {
		import_react.useEffect(function() {
			sheet.add(styles);
			return function() {
				sheet.remove();
			};
		}, [styles && isDynamic]);
	};
};
//#endregion
//#region node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@19.2.17_react@19.2.7/node_modules/react-style-singleton/dist/es2015/component.js
/**
* create a Component to add styles on demand
* - styles are added when first instance is mounted
* - styles are removed when the last instance is unmounted
* - changing styles in runtime does nothing unless dynamic is set. But with multiple components that can lead to the undefined behavior
*/
var styleSingleton = function() {
	var useStyle = styleHookSingleton();
	var Sheet = function(_a) {
		var styles = _a.styles, dynamic = _a.dynamic;
		useStyle(styles, dynamic);
		return null;
	};
	return Sheet;
};
//#endregion
//#region node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll-bar/dist/es2015/utils.js
var zeroGap = {
	left: 0,
	top: 0,
	right: 0,
	gap: 0
};
var parse = function(x) {
	return parseInt(x || "", 10) || 0;
};
var getOffset = function(gapMode) {
	var cs = window.getComputedStyle(document.body);
	var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
	var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
	var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
	return [
		parse(left),
		parse(top),
		parse(right)
	];
};
var getGapWidth = function(gapMode) {
	if (gapMode === void 0) gapMode = "margin";
	if (typeof window === "undefined") return zeroGap;
	var offsets = getOffset(gapMode);
	var documentWidth = document.documentElement.clientWidth;
	var windowWidth = window.innerWidth;
	return {
		left: offsets[0],
		top: offsets[1],
		right: offsets[2],
		gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
	};
};
//#endregion
//#region node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll-bar/dist/es2015/component.js
var Style = styleSingleton();
var lockAttribute = "data-scroll-locked";
var getStyles = function(_a, allowRelative, gapMode, important) {
	var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
	if (gapMode === void 0) gapMode = "margin";
	return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
		allowRelative && "position: relative ".concat(important, ";"),
		gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
		gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
	].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function() {
	var counter = parseInt(document.body.getAttribute("data-scroll-locked") || "0", 10);
	return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function() {
	import_react.useEffect(function() {
		document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
		return function() {
			var newCounter = getCurrentUseCounter() - 1;
			if (newCounter <= 0) document.body.removeAttribute(lockAttribute);
			else document.body.setAttribute(lockAttribute, newCounter.toString());
		};
	}, []);
};
/**
* Removes page scrollbar and blocks page scroll when mounted
*/
var RemoveScrollBar = function(_a) {
	var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
	useLockAttribute();
	var gap = import_react.useMemo(function() {
		return getGapWidth(gapMode);
	}, [gapMode]);
	return import_react.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
};
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js
var passiveSupported = false;
if (typeof window !== "undefined") try {
	var options = Object.defineProperty({}, "passive", { get: function() {
		passiveSupported = true;
		return true;
	} });
	window.addEventListener("test", options, options);
	window.removeEventListener("test", options, options);
} catch (err) {
	passiveSupported = false;
}
var nonPassive = passiveSupported ? { passive: false } : false;
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/handleScroll.js
var alwaysContainsScroll = function(node) {
	return node.tagName === "TEXTAREA";
};
var elementCanBeScrolled = function(node, overflow) {
	if (!(node instanceof Element)) return false;
	var styles = window.getComputedStyle(node);
	return styles[overflow] !== "hidden" && !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible");
};
var elementCouldBeVScrolled = function(node) {
	return elementCanBeScrolled(node, "overflowY");
};
var elementCouldBeHScrolled = function(node) {
	return elementCanBeScrolled(node, "overflowX");
};
var locationCouldBeScrolled = function(axis, node) {
	var ownerDocument = node.ownerDocument;
	var current = node;
	do {
		if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) current = current.host;
		if (elementCouldBeScrolled(axis, current)) {
			var _a = getScrollVariables(axis, current);
			if (_a[1] > _a[2]) return true;
		}
		current = current.parentNode;
	} while (current && current !== ownerDocument.body);
	return false;
};
var getVScrollVariables = function(_a) {
	return [
		_a.scrollTop,
		_a.scrollHeight,
		_a.clientHeight
	];
};
var getHScrollVariables = function(_a) {
	return [
		_a.scrollLeft,
		_a.scrollWidth,
		_a.clientWidth
	];
};
var elementCouldBeScrolled = function(axis, node) {
	return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function(axis, node) {
	return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function(axis, direction) {
	/**
	* If the element's direction is rtl (right-to-left), then scrollLeft is 0 when the scrollbar is at its rightmost position,
	* and then increasingly negative as you scroll towards the end of the content.
	* @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
	*/
	return axis === "h" && direction === "rtl" ? -1 : 1;
};
var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
	var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
	var delta = directionFactor * sourceDelta;
	var target = event.target;
	var targetInLock = endTarget.contains(target);
	var shouldCancelScroll = false;
	var isDeltaPositive = delta > 0;
	var availableScroll = 0;
	var availableScrollTop = 0;
	do {
		if (!target) break;
		var _a = getScrollVariables(axis, target), position = _a[0];
		var elementScroll = _a[1] - _a[2] - directionFactor * position;
		if (position || elementScroll) {
			if (elementCouldBeScrolled(axis, target)) {
				availableScroll += elementScroll;
				availableScrollTop += position;
			}
		}
		var parent_1 = target.parentNode;
		target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
	} while (!targetInLock && target !== document.body || targetInLock && (endTarget.contains(target) || endTarget === target));
	if (isDeltaPositive && (noOverscroll && Math.abs(availableScroll) < 1 || !noOverscroll && delta > availableScroll)) shouldCancelScroll = true;
	else if (!isDeltaPositive && (noOverscroll && Math.abs(availableScrollTop) < 1 || !noOverscroll && -delta > availableScrollTop)) shouldCancelScroll = true;
	return shouldCancelScroll;
};
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/SideEffect.js
var getTouchXY = function(event) {
	return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
};
var getDeltaXY = function(event) {
	return [event.deltaX, event.deltaY];
};
var extractRef = function(ref) {
	return ref && "current" in ref ? ref.current : ref;
};
var deltaCompare = function(x, y) {
	return x[0] === y[0] && x[1] === y[1];
};
var generateStyle = function(id) {
	return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
};
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
	var shouldPreventQueue = import_react.useRef([]);
	var touchStartRef = import_react.useRef([0, 0]);
	var activeAxis = import_react.useRef();
	var id = import_react.useState(idCounter++)[0];
	var Style = import_react.useState(styleSingleton)[0];
	var lastProps = import_react.useRef(props);
	import_react.useEffect(function() {
		lastProps.current = props;
	}, [props]);
	import_react.useEffect(function() {
		if (props.inert) {
			document.body.classList.add("block-interactivity-".concat(id));
			var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
			allow_1.forEach(function(el) {
				return el.classList.add("allow-interactivity-".concat(id));
			});
			return function() {
				document.body.classList.remove("block-interactivity-".concat(id));
				allow_1.forEach(function(el) {
					return el.classList.remove("allow-interactivity-".concat(id));
				});
			};
		}
	}, [
		props.inert,
		props.lockRef.current,
		props.shards
	]);
	var shouldCancelEvent = import_react.useCallback(function(event, parent) {
		if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) return !lastProps.current.allowPinchZoom;
		var touch = getTouchXY(event);
		var touchStart = touchStartRef.current;
		var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
		var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
		var currentAxis;
		var target = event.target;
		var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
		if ("touches" in event && moveDirection === "h" && target.type === "range") return false;
		var selection = window.getSelection();
		var anchorNode = selection && selection.anchorNode;
		if (anchorNode ? anchorNode === target || anchorNode.contains(target) : false) return false;
		var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
		if (!canBeScrolledInMainDirection) return true;
		if (canBeScrolledInMainDirection) currentAxis = moveDirection;
		else {
			currentAxis = moveDirection === "v" ? "h" : "v";
			canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
		}
		if (!canBeScrolledInMainDirection) return false;
		if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) activeAxis.current = currentAxis;
		if (!currentAxis) return true;
		var cancelingAxis = activeAxis.current || currentAxis;
		return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
	}, []);
	var shouldPrevent = import_react.useCallback(function(_event) {
		var event = _event;
		if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) return;
		var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
		var sourceEvent = shouldPreventQueue.current.filter(function(e) {
			return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
		})[0];
		if (sourceEvent && sourceEvent.should) {
			if (event.cancelable) event.preventDefault();
			return;
		}
		if (!sourceEvent) {
			var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
				return node.contains(event.target);
			});
			if (shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation) {
				if (event.cancelable) event.preventDefault();
			}
		}
	}, []);
	var shouldCancel = import_react.useCallback(function(name, delta, target, should) {
		var event = {
			name,
			delta,
			target,
			should,
			shadowParent: getOutermostShadowParent(target)
		};
		shouldPreventQueue.current.push(event);
		setTimeout(function() {
			shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
				return e !== event;
			});
		}, 1);
	}, []);
	var scrollTouchStart = import_react.useCallback(function(event) {
		touchStartRef.current = getTouchXY(event);
		activeAxis.current = void 0;
	}, []);
	var scrollWheel = import_react.useCallback(function(event) {
		shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
	}, []);
	var scrollTouchMove = import_react.useCallback(function(event) {
		shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
	}, []);
	import_react.useEffect(function() {
		lockStack.push(Style);
		props.setCallbacks({
			onScrollCapture: scrollWheel,
			onWheelCapture: scrollWheel,
			onTouchMoveCapture: scrollTouchMove
		});
		document.addEventListener("wheel", shouldPrevent, nonPassive);
		document.addEventListener("touchmove", shouldPrevent, nonPassive);
		document.addEventListener("touchstart", scrollTouchStart, nonPassive);
		return function() {
			lockStack = lockStack.filter(function(inst) {
				return inst !== Style;
			});
			document.removeEventListener("wheel", shouldPrevent, nonPassive);
			document.removeEventListener("touchmove", shouldPrevent, nonPassive);
			document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
		};
	}, []);
	var removeScrollBar = props.removeScrollBar, inert = props.inert;
	return import_react.createElement(import_react.Fragment, null, inert ? import_react.createElement(Style, { styles: generateStyle(id) }) : null, removeScrollBar ? import_react.createElement(RemoveScrollBar, {
		noRelative: props.noRelative,
		gapMode: props.gapMode
	}) : null);
}
function getOutermostShadowParent(node) {
	var shadowParent = null;
	while (node !== null) {
		if (node instanceof ShadowRoot) {
			shadowParent = node.host;
			node = node.host;
		}
		node = node.parentNode;
	}
	return shadowParent;
}
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/sidecar.js
var sidecar_default = exportSidecar(effectCar, RemoveScrollSideCar);
//#endregion
//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.17_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/Combination.js
var ReactRemoveScroll = import_react.forwardRef(function(props, ref) {
	return import_react.createElement(RemoveScroll, __assign({}, props, {
		ref,
		sideCar: sidecar_default
	}));
});
ReactRemoveScroll.classNames = RemoveScroll.classNames;
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-popover@1.1.19_@types+react-dom@19.2.3_@types+react@19.2.17__@types+rea_7588cabd041e7afe38f551ce19350450/node_modules/@radix-ui/react-popover/dist/index.mjs
var POPOVER_NAME = "Popover";
var [createPopoverContext, createPopoverScope] = createContextScope(POPOVER_NAME, [createPopperScope]);
var usePopperScope = createPopperScope();
var [PopoverProvider, usePopoverContext] = createPopoverContext(POPOVER_NAME);
var Popover$1 = (props) => {
	const { __scopePopover, children, open: openProp, defaultOpen, onOpenChange, modal = false } = props;
	const popperScope = usePopperScope(__scopePopover);
	const triggerRef = import_react.useRef(null);
	const [hasCustomAnchor, setHasCustomAnchor] = import_react.useState(false);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: POPOVER_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2$1, {
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverProvider, {
			scope: __scopePopover,
			contentId: useId(),
			triggerRef,
			open,
			onOpenChange: setOpen,
			onOpenToggle: import_react.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
			hasCustomAnchor,
			onCustomAnchorAdd: import_react.useCallback(() => setHasCustomAnchor(true), []),
			onCustomAnchorRemove: import_react.useCallback(() => setHasCustomAnchor(false), []),
			modal,
			children
		})
	});
};
Popover$1.displayName = POPOVER_NAME;
var ANCHOR_NAME = "PopoverAnchor";
var PopoverAnchor = import_react.forwardRef((props, forwardedRef) => {
	const { __scopePopover, ...anchorProps } = props;
	const context = usePopoverContext(ANCHOR_NAME, __scopePopover);
	const popperScope = usePopperScope(__scopePopover);
	const { onCustomAnchorAdd, onCustomAnchorRemove } = context;
	import_react.useEffect(() => {
		onCustomAnchorAdd();
		return () => onCustomAnchorRemove();
	}, [onCustomAnchorAdd, onCustomAnchorRemove]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, {
		...popperScope,
		...anchorProps,
		ref: forwardedRef
	});
});
PopoverAnchor.displayName = ANCHOR_NAME;
var TRIGGER_NAME = "PopoverTrigger";
var PopoverTrigger$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopePopover, ...triggerProps } = props;
	const context = usePopoverContext(TRIGGER_NAME, __scopePopover);
	const popperScope = usePopperScope(__scopePopover);
	const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
	const trigger = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		"aria-haspopup": "dialog",
		"aria-expanded": context.open,
		"aria-controls": context.open ? context.contentId : void 0,
		"data-state": getState(context.open),
		...triggerProps,
		ref: composedTriggerRef,
		onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
	});
	return context.hasCustomAnchor ? trigger : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, {
		asChild: true,
		...popperScope,
		children: trigger
	});
});
PopoverTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "PopoverPortal";
var [PortalProvider, usePortalContext] = createPopoverContext(PORTAL_NAME, { forceMount: void 0 });
var PopoverPortal = (props) => {
	const { __scopePopover, forceMount, children, container } = props;
	const context = usePopoverContext(PORTAL_NAME, __scopePopover);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalProvider, {
		scope: __scopePopover,
		forceMount,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$2, {
				asChild: true,
				container,
				children
			})
		})
	});
};
PopoverPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "PopoverContent";
var PopoverContent$1 = import_react.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext(CONTENT_NAME, props.__scopePopover);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: context.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContentModal, {
			...contentProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContentNonModal, {
			...contentProps,
			ref: forwardedRef
		})
	});
});
PopoverContent$1.displayName = CONTENT_NAME;
var Slot = /* @__PURE__ */ createSlot("PopoverContent.RemoveScroll");
var PopoverContentModal = import_react.forwardRef((props, forwardedRef) => {
	const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
	const contentRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, contentRef);
	const isRightClickOutsideRef = import_react.useRef(false);
	import_react.useEffect(() => {
		const content = contentRef.current;
		if (content) return hideOthers(content);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactRemoveScroll, {
		as: Slot,
		allowPinchZoom: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContentImpl, {
			...props,
			ref: composedRefs,
			trapFocus: context.open,
			disableOutsidePointerEvents: true,
			onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
				event.preventDefault();
				if (!isRightClickOutsideRef.current) context.triggerRef.current?.focus();
			}),
			onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
				const originalEvent = event.detail.originalEvent;
				const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
				const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
				isRightClickOutsideRef.current = isRightClick;
			}, { checkForDefaultPrevented: false }),
			onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault(), { checkForDefaultPrevented: false })
		})
	});
});
var PopoverContentNonModal = import_react.forwardRef((props, forwardedRef) => {
	const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
	const hasInteractedOutsideRef = import_react.useRef(false);
	const hasPointerDownOutsideRef = import_react.useRef(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContentImpl, {
		...props,
		ref: forwardedRef,
		trapFocus: false,
		disableOutsidePointerEvents: false,
		onCloseAutoFocus: (event) => {
			props.onCloseAutoFocus?.(event);
			if (!event.defaultPrevented) {
				if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
				event.preventDefault();
			}
			hasInteractedOutsideRef.current = false;
			hasPointerDownOutsideRef.current = false;
		},
		onInteractOutside: (event) => {
			props.onInteractOutside?.(event);
			if (!event.defaultPrevented) {
				hasInteractedOutsideRef.current = true;
				if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.current = true;
			}
			const target = event.target;
			if (context.triggerRef.current?.contains(target)) event.preventDefault();
			if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) event.preventDefault();
		}
	});
});
var PopoverContentImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopePopover, trapFocus, onOpenAutoFocus, onCloseAutoFocus, disableOutsidePointerEvents, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, ...contentProps } = props;
	const context = usePopoverContext(CONTENT_NAME, __scopePopover);
	const popperScope = usePopperScope(__scopePopover);
	useFocusGuards();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScope, {
		asChild: true,
		loop: true,
		trapped: trapFocus,
		onMountAutoFocus: onOpenAutoFocus,
		onUnmountAutoFocus: onCloseAutoFocus,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
			asChild: true,
			disableOutsidePointerEvents,
			onInteractOutside,
			onEscapeKeyDown,
			onPointerDownOutside,
			onFocusOutside,
			onDismiss: () => context.onOpenChange(false),
			deferPointerDownOutside: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
				"data-state": getState(context.open),
				role: "dialog",
				id: context.contentId,
				...popperScope,
				...contentProps,
				ref: forwardedRef,
				style: {
					...contentProps.style,
					"--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
					"--radix-popover-content-available-width": "var(--radix-popper-available-width)",
					"--radix-popover-content-available-height": "var(--radix-popper-available-height)",
					"--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
					"--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
				}
			})
		})
	});
});
var CLOSE_NAME = "PopoverClose";
var PopoverClose = import_react.forwardRef((props, forwardedRef) => {
	const { __scopePopover, ...closeProps } = props;
	const context = usePopoverContext(CLOSE_NAME, __scopePopover);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		...closeProps,
		ref: forwardedRef,
		onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
	});
});
PopoverClose.displayName = CLOSE_NAME;
var ARROW_NAME = "PopoverArrow";
var PopoverArrow = import_react.forwardRef((props, forwardedRef) => {
	const { __scopePopover, ...arrowProps } = props;
	const popperScope = usePopperScope(__scopePopover);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
		...popperScope,
		...arrowProps,
		ref: forwardedRef
	});
});
PopoverArrow.displayName = ARROW_NAME;
function getState(open) {
	return open ? "open" : "closed";
}
var Root2 = Popover$1;
var Trigger = PopoverTrigger$1;
var Portal = PopoverPortal;
var Content2 = PopoverContent$1;
//#endregion
//#region node_modules/.pnpm/@agent-native+toolkit@0.20.4_@floating-ui+dom@1.7.6_@tiptap+extension-code-block@3.28.0_0ff20177eefff338d7ce7908b45858f5/node_modules/@agent-native/toolkit/dist/ui/popover.js
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, portalled = true, container, ...props }, ref) => {
	const content = (0, import_jsx_runtime.jsx)(Content2, {
		ref,
		align,
		sideOffset,
		className: cn$1("z-[290] w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none origin-[var(--radix-popover-content-transform-origin)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100 motion-reduce:data-[side=bottom]:slide-in-from-top-0 motion-reduce:data-[side=left]:slide-in-from-right-0 motion-reduce:data-[side=right]:slide-in-from-left-0 motion-reduce:data-[side=top]:slide-in-from-bottom-0", className),
		...props
	});
	if (!portalled) return content;
	return (0, import_jsx_runtime.jsx)(Portal, {
		container,
		children: content
	});
});
PopoverContent.displayName = Content2.displayName;
//#endregion
//#region node_modules/.pnpm/i18next@26.3.1_typescript@7.0.2/node_modules/i18next/dist/esm/i18next.js
var isString$1 = (obj) => typeof obj === "string";
var defer = () => {
	let res;
	let rej;
	const promise = new Promise((resolve, reject) => {
		res = resolve;
		rej = reject;
	});
	promise.resolve = res;
	promise.reject = rej;
	return promise;
};
var makeString = (object) => {
	if (object == null) return "";
	return String(object);
};
var copy = (a, s, t) => {
	a.forEach((m) => {
		if (s[m]) t[m] = s[m];
	});
};
var lastOfPathSeparatorRegExp = /###/g;
var cleanKey = (key) => key && key.includes("###") ? key.replace(lastOfPathSeparatorRegExp, ".") : key;
var canNotTraverseDeeper = (object) => !object || isString$1(object);
var getLastOfPath = (object, path, Empty) => {
	const stack = !isString$1(path) ? path : path.split(".");
	let stackIndex = 0;
	while (stackIndex < stack.length - 1) {
		if (canNotTraverseDeeper(object)) return {};
		const key = cleanKey(stack[stackIndex]);
		if (!object[key] && Empty) object[key] = new Empty();
		if (Object.prototype.hasOwnProperty.call(object, key)) object = object[key];
		else object = {};
		++stackIndex;
	}
	if (canNotTraverseDeeper(object)) return {};
	return {
		obj: object,
		k: cleanKey(stack[stackIndex])
	};
};
var setPath = (object, path, newValue) => {
	const { obj, k } = getLastOfPath(object, path, Object);
	if (obj !== void 0 || path.length === 1) {
		obj[k] = newValue;
		return;
	}
	let e = path[path.length - 1];
	let p = path.slice(0, path.length - 1);
	let last = getLastOfPath(object, p, Object);
	while (last.obj === void 0 && p.length) {
		e = `${p[p.length - 1]}.${e}`;
		p = p.slice(0, p.length - 1);
		last = getLastOfPath(object, p, Object);
		if (last?.obj && typeof last.obj[`${last.k}.${e}`] !== "undefined") last.obj = void 0;
	}
	last.obj[`${last.k}.${e}`] = newValue;
};
var pushPath = (object, path, newValue, concat) => {
	const { obj, k } = getLastOfPath(object, path, Object);
	obj[k] = obj[k] || [];
	obj[k].push(newValue);
};
var getPath = (object, path) => {
	const { obj, k } = getLastOfPath(object, path);
	if (!obj) return void 0;
	if (!Object.prototype.hasOwnProperty.call(obj, k)) return void 0;
	return obj[k];
};
var getPathWithDefaults = (data, defaultData, key) => {
	const value = getPath(data, key);
	if (value !== void 0) return value;
	return getPath(defaultData, key);
};
var deepExtend = (target, source, overwrite) => {
	for (const prop in source) if (prop !== "__proto__" && prop !== "constructor") if (prop in target) if (isString$1(target[prop]) || target[prop] instanceof String || isString$1(source[prop]) || source[prop] instanceof String) {
		if (overwrite) target[prop] = source[prop];
	} else deepExtend(target[prop], source[prop], overwrite);
	else target[prop] = source[prop];
	return target;
};
var regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var _entityMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;",
	"/": "&#x2F;"
};
var escape = (data) => {
	if (isString$1(data)) return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
	return data;
};
var RegExpCache = class {
	constructor(capacity) {
		this.capacity = capacity;
		this.regExpMap = /* @__PURE__ */ new Map();
		this.regExpQueue = [];
	}
	getRegExp(pattern) {
		const regExpFromCache = this.regExpMap.get(pattern);
		if (regExpFromCache !== void 0) return regExpFromCache;
		const regExpNew = new RegExp(pattern);
		if (this.regExpQueue.length === this.capacity) this.regExpMap.delete(this.regExpQueue.shift());
		this.regExpMap.set(pattern, regExpNew);
		this.regExpQueue.push(pattern);
		return regExpNew;
	}
};
var chars = [
	" ",
	",",
	"?",
	"!",
	";"
];
var looksLikeObjectPathRegExpCache = new RegExpCache(20);
var looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
	nsSeparator = nsSeparator || "";
	keySeparator = keySeparator || "";
	const possibleChars = chars.filter((c) => !nsSeparator.includes(c) && !keySeparator.includes(c));
	if (possibleChars.length === 0) return true;
	const r = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c) => c === "?" ? "\\?" : c).join("|")})`);
	let matched = !r.test(key);
	if (!matched) {
		const ki = key.indexOf(keySeparator);
		if (ki > 0 && !r.test(key.substring(0, ki))) matched = true;
	}
	return matched;
};
var deepFind = (obj, path, keySeparator = ".") => {
	if (!obj) return void 0;
	if (obj[path]) {
		if (!Object.prototype.hasOwnProperty.call(obj, path)) return void 0;
		return obj[path];
	}
	const tokens = path.split(keySeparator);
	let current = obj;
	for (let i = 0; i < tokens.length;) {
		if (!current || typeof current !== "object") return;
		let next;
		let nextPath = "";
		for (let j = i; j < tokens.length; ++j) {
			if (j !== i) nextPath += keySeparator;
			nextPath += tokens[j];
			next = current[nextPath];
			if (next !== void 0) {
				if ([
					"string",
					"number",
					"boolean"
				].includes(typeof next) && j < tokens.length - 1) continue;
				i += j - i + 1;
				break;
			}
		}
		current = next;
	}
	return current;
};
var getCleanedCode = (code) => code?.replace(/_/g, "-");
var consoleLogger = {
	type: "logger",
	log(args) {
		this.output("log", args);
	},
	warn(args) {
		this.output("warn", args);
	},
	error(args) {
		this.output("error", args);
	},
	output(type, args) {
		console?.[type]?.apply?.(console, args);
	}
};
var baseLogger = new class Logger {
	constructor(concreteLogger, options = {}) {
		this.init(concreteLogger, options);
	}
	init(concreteLogger, options = {}) {
		this.prefix = options.prefix || "i18next:";
		this.logger = concreteLogger || consoleLogger;
		this.options = options;
		this.debug = options.debug;
	}
	log(...args) {
		return this.forward(args, "log", "", true);
	}
	warn(...args) {
		return this.forward(args, "warn", "", true);
	}
	error(...args) {
		return this.forward(args, "error", "");
	}
	deprecate(...args) {
		return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
	}
	forward(args, lvl, prefix, debugOnly) {
		if (debugOnly && !this.debug) return null;
		args = args.map((a) => isString$1(a) ? a.replace(/[\r\n\x00-\x1F\x7F]/g, " ") : a);
		if (isString$1(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
		return this.logger[lvl](args);
	}
	create(moduleName) {
		return new Logger(this.logger, {
			prefix: `${this.prefix}:${moduleName}:`,
			...this.options
		});
	}
	clone(options) {
		options = options || this.options;
		options.prefix = options.prefix || this.prefix;
		return new Logger(this.logger, options);
	}
}();
var EventEmitter = class {
	constructor() {
		this.observers = {};
	}
	on(events, listener) {
		events.split(" ").forEach((event) => {
			if (!this.observers[event]) this.observers[event] = /* @__PURE__ */ new Map();
			const numListeners = this.observers[event].get(listener) || 0;
			this.observers[event].set(listener, numListeners + 1);
		});
		return this;
	}
	off(event, listener) {
		if (!this.observers[event]) return;
		if (!listener) {
			delete this.observers[event];
			return;
		}
		this.observers[event].delete(listener);
	}
	once(event, listener) {
		const wrapper = (...args) => {
			listener(...args);
			this.off(event, wrapper);
		};
		this.on(event, wrapper);
		return this;
	}
	emit(event, ...args) {
		if (this.observers[event]) Array.from(this.observers[event].entries()).forEach(([observer, numTimesAdded]) => {
			for (let i = 0; i < numTimesAdded; i++) observer(...args);
		});
		if (this.observers["*"]) Array.from(this.observers["*"].entries()).forEach(([observer, numTimesAdded]) => {
			for (let i = 0; i < numTimesAdded; i++) observer(event, ...args);
		});
	}
};
var ResourceStore = class extends EventEmitter {
	constructor(data, options = {
		ns: ["translation"],
		defaultNS: "translation"
	}) {
		super();
		this.data = data || {};
		this.options = options;
		if (this.options.keySeparator === void 0) this.options.keySeparator = ".";
		if (this.options.ignoreJSONStructure === void 0) this.options.ignoreJSONStructure = true;
	}
	addNamespaces(ns) {
		if (!this.options.ns.includes(ns)) this.options.ns.push(ns);
	}
	removeNamespaces(ns) {
		const index = this.options.ns.indexOf(ns);
		if (index > -1) this.options.ns.splice(index, 1);
	}
	getResource(lng, ns, key, options = {}) {
		const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
		const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
		let path;
		if (lng.includes(".")) path = lng.split(".");
		else {
			path = [lng, ns];
			if (key) if (Array.isArray(key)) path.push(...key);
			else if (isString$1(key) && keySeparator) path.push(...key.split(keySeparator));
			else path.push(key);
		}
		const result = getPath(this.data, path);
		if (!result && !ns && !key && lng.includes(".")) {
			lng = path[0];
			ns = path[1];
			key = path.slice(2).join(".");
		}
		if (result || !ignoreJSONStructure || !isString$1(key)) return result;
		return deepFind(this.data?.[lng]?.[ns], key, keySeparator);
	}
	addResource(lng, ns, key, value, options = { silent: false }) {
		const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
		let path = [lng, ns];
		if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
		if (lng.includes(".")) {
			path = lng.split(".");
			value = ns;
			ns = path[1];
		}
		this.addNamespaces(ns);
		setPath(this.data, path, value);
		if (!options.silent) this.emit("added", lng, ns, key, value);
	}
	addResources(lng, ns, resources, options = { silent: false }) {
		for (const m in resources) if (isString$1(resources[m]) || Array.isArray(resources[m])) this.addResource(lng, ns, m, resources[m], { silent: true });
		if (!options.silent) this.emit("added", lng, ns, resources);
	}
	addResourceBundle(lng, ns, resources, deep, overwrite, options = {
		silent: false,
		skipCopy: false
	}) {
		let path = [lng, ns];
		if (lng.includes(".")) {
			path = lng.split(".");
			deep = resources;
			resources = ns;
			ns = path[1];
		}
		this.addNamespaces(ns);
		let pack = getPath(this.data, path) || {};
		if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
		if (deep) deepExtend(pack, resources, overwrite);
		else pack = {
			...pack,
			...resources
		};
		setPath(this.data, path, pack);
		if (!options.silent) this.emit("added", lng, ns, resources);
	}
	removeResourceBundle(lng, ns) {
		if (this.hasResourceBundle(lng, ns)) delete this.data[lng][ns];
		this.removeNamespaces(ns);
		this.emit("removed", lng, ns);
	}
	hasResourceBundle(lng, ns) {
		return this.getResource(lng, ns) !== void 0;
	}
	getResourceBundle(lng, ns) {
		if (!ns) ns = this.options.defaultNS;
		return this.getResource(lng, ns);
	}
	getDataByLanguage(lng) {
		return this.data[lng];
	}
	hasLanguageSomeTranslations(lng) {
		const data = this.getDataByLanguage(lng);
		return !!(data && Object.keys(data) || []).find((v) => data[v] && Object.keys(data[v]).length > 0);
	}
	toJSON() {
		return this.data;
	}
};
var postProcessor = {
	processors: {},
	addPostProcessor(module) {
		this.processors[module.name] = module;
	},
	handle(processors, value, key, options, translator) {
		processors.forEach((processor) => {
			value = this.processors[processor]?.process(value, key, options, translator) ?? value;
		});
		return value;
	}
};
var PATH_KEY = Symbol("i18next/PATH_KEY");
function createProxy() {
	const state = [];
	const handler = Object.create(null);
	let proxy;
	handler.get = (target, key) => {
		proxy?.revoke?.();
		if (key === PATH_KEY) return state;
		state.push(key);
		proxy = Proxy.revocable(target, handler);
		return proxy.proxy;
	};
	return Proxy.revocable(Object.create(null), handler).proxy;
}
function keysFromSelector(selector, opts) {
	const { [PATH_KEY]: path } = selector(createProxy());
	const keySeparator = opts?.keySeparator ?? ".";
	const nsSeparator = opts?.nsSeparator ?? ":";
	const strict = opts?.enableSelector === "strict";
	if (path.length > 1 && nsSeparator) {
		const ns = opts?.ns;
		const nsList = strict ? Array.isArray(ns) ? ns : ns ? [ns] : null : Array.isArray(ns) ? ns : null;
		if (nsList) {
			if ((strict ? nsList : nsList.length > 1 ? nsList.slice(1) : []).includes(path[0])) return `${path[0]}${nsSeparator}${path.slice(1).join(keySeparator)}`;
		}
	}
	return path.join(keySeparator);
}
var shouldHandleAsObject = (res) => !isString$1(res) && typeof res !== "boolean" && typeof res !== "number";
var Translator = class Translator extends EventEmitter {
	constructor(services, options = {}) {
		super();
		copy([
			"resourceStore",
			"languageUtils",
			"pluralResolver",
			"interpolator",
			"backendConnector",
			"i18nFormat",
			"utils"
		], services, this);
		this.options = options;
		if (this.options.keySeparator === void 0) this.options.keySeparator = ".";
		this.logger = baseLogger.create("translator");
		this.checkedLoadedFor = {};
	}
	changeLanguage(lng) {
		if (lng) this.language = lng;
	}
	exists(key, o = { interpolation: {} }) {
		const opt = { ...o };
		if (key == null) return false;
		const resolved = this.resolve(key, opt);
		if (resolved?.res === void 0) return false;
		const isObject = shouldHandleAsObject(resolved.res);
		if (opt.returnObjects === false && isObject) return false;
		return true;
	}
	extractFromKey(key, opt) {
		let nsSeparator = opt.nsSeparator !== void 0 ? opt.nsSeparator : this.options.nsSeparator;
		if (nsSeparator === void 0) nsSeparator = ":";
		const keySeparator = opt.keySeparator !== void 0 ? opt.keySeparator : this.options.keySeparator;
		let namespaces = opt.ns || this.options.defaultNS || [];
		const wouldCheckForNsInKey = nsSeparator && key.includes(nsSeparator);
		const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !opt.keySeparator && !this.options.userDefinedNsSeparator && !opt.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
		if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
			const m = key.match(this.interpolator.nestingRegexp);
			if (m && m.length > 0) return {
				key,
				namespaces: isString$1(namespaces) ? [namespaces] : namespaces
			};
			const parts = key.split(nsSeparator);
			if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.includes(parts[0])) namespaces = parts.shift();
			key = parts.join(keySeparator);
		}
		return {
			key,
			namespaces: isString$1(namespaces) ? [namespaces] : namespaces
		};
	}
	translate(keys, o, lastKey) {
		let opt = typeof o === "object" ? { ...o } : o;
		if (typeof opt !== "object" && this.options.overloadTranslationOptionHandler) opt = this.options.overloadTranslationOptionHandler(arguments);
		if (typeof opt === "object") opt = { ...opt };
		if (!opt) opt = {};
		if (keys == null) return "";
		if (typeof keys === "function") keys = keysFromSelector(keys, {
			...this.options,
			...opt
		});
		if (!Array.isArray(keys)) keys = [String(keys)];
		keys = keys.map((k) => typeof k === "function" ? keysFromSelector(k, {
			...this.options,
			...opt
		}) : String(k));
		const returnDetails = opt.returnDetails !== void 0 ? opt.returnDetails : this.options.returnDetails;
		const keySeparator = opt.keySeparator !== void 0 ? opt.keySeparator : this.options.keySeparator;
		const { key, namespaces } = this.extractFromKey(keys[keys.length - 1], opt);
		const namespace = namespaces[namespaces.length - 1];
		let nsSeparator = opt.nsSeparator !== void 0 ? opt.nsSeparator : this.options.nsSeparator;
		if (nsSeparator === void 0) nsSeparator = ":";
		const lng = opt.lng || this.language;
		const appendNamespaceToCIMode = opt.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
		if (lng?.toLowerCase() === "cimode") {
			if (appendNamespaceToCIMode) {
				if (returnDetails) return {
					res: `${namespace}${nsSeparator}${key}`,
					usedKey: key,
					exactUsedKey: key,
					usedLng: lng,
					usedNS: namespace,
					usedParams: this.getUsedParamsDetails(opt)
				};
				return `${namespace}${nsSeparator}${key}`;
			}
			if (returnDetails) return {
				res: key,
				usedKey: key,
				exactUsedKey: key,
				usedLng: lng,
				usedNS: namespace,
				usedParams: this.getUsedParamsDetails(opt)
			};
			return key;
		}
		const resolved = this.resolve(keys, opt);
		let res = resolved?.res;
		const resUsedKey = resolved?.usedKey || key;
		const resExactUsedKey = resolved?.exactUsedKey || key;
		const noObject = [
			"[object Number]",
			"[object Function]",
			"[object RegExp]"
		];
		const joinArrays = opt.joinArrays !== void 0 ? opt.joinArrays : this.options.joinArrays;
		const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
		const needsPluralHandling = opt.count !== void 0 && !isString$1(opt.count);
		const hasDefaultValue = Translator.hasDefaultValue(opt);
		const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, opt) : "";
		const defaultValueSuffixOrdinalFallback = opt.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, { ordinal: false }) : "";
		const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
		const defaultValue = needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] || opt[`defaultValue${defaultValueSuffix}`] || opt[`defaultValue${defaultValueSuffixOrdinalFallback}`] || opt.defaultValue;
		let resForObjHndl = res;
		if (handleAsObjectInI18nFormat && !res && hasDefaultValue) resForObjHndl = defaultValue;
		const handleAsObject = shouldHandleAsObject(resForObjHndl);
		const resType = Object.prototype.toString.apply(resForObjHndl);
		if (handleAsObjectInI18nFormat && resForObjHndl && handleAsObject && !noObject.includes(resType) && !(isString$1(joinArrays) && Array.isArray(resForObjHndl))) {
			if (!opt.returnObjects && !this.options.returnObjects) {
				if (!this.options.returnedObjectHandler) this.logger.warn("accessing an object - but returnObjects options is not enabled!");
				const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, resForObjHndl, {
					...opt,
					ns: namespaces
				}) : `key '${key} (${this.language})' returned an object instead of string.`;
				if (returnDetails) {
					resolved.res = r;
					resolved.usedParams = this.getUsedParamsDetails(opt);
					return resolved;
				}
				return r;
			}
			if (keySeparator) {
				const resTypeIsArray = Array.isArray(resForObjHndl);
				const copy = resTypeIsArray ? [] : {};
				const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
				for (const m in resForObjHndl) if (Object.prototype.hasOwnProperty.call(resForObjHndl, m)) {
					const deepKey = `${newKeyToUse}${keySeparator}${m}`;
					if (hasDefaultValue && !res) copy[m] = this.translate(deepKey, {
						...opt,
						defaultValue: shouldHandleAsObject(defaultValue) ? defaultValue[m] : void 0,
						joinArrays: false,
						ns: namespaces
					});
					else copy[m] = this.translate(deepKey, {
						...opt,
						joinArrays: false,
						ns: namespaces
					});
					if (copy[m] === deepKey) copy[m] = resForObjHndl[m];
				}
				res = copy;
			}
		} else if (handleAsObjectInI18nFormat && isString$1(joinArrays) && Array.isArray(res)) {
			res = res.join(joinArrays);
			if (res) res = this.extendTranslation(res, keys, opt, lastKey);
		} else {
			let usedDefault = false;
			let usedKey = false;
			if (!this.isValidLookup(res) && hasDefaultValue) {
				usedDefault = true;
				res = defaultValue;
			}
			if (!this.isValidLookup(res)) {
				usedKey = true;
				res = key;
			}
			const resForMissing = (opt.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && usedKey ? void 0 : res;
			const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
			if (usedKey || usedDefault || updateMissing) {
				this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, needsPluralHandling && !updateMissing ? `${key}${this.pluralResolver.getSuffix(lng, opt.count, opt)}` : key, updateMissing ? defaultValue : res);
				if (keySeparator) {
					const fk = this.resolve(key, {
						...opt,
						keySeparator: false
					});
					if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
				}
				let lngs = [];
				const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, opt.lng || this.language);
				if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) for (let i = 0; i < fallbackLngs.length; i++) lngs.push(fallbackLngs[i]);
				else if (this.options.saveMissingTo === "all") lngs = this.languageUtils.toResolveHierarchy(opt.lng || this.language);
				else lngs.push(opt.lng || this.language);
				const send = (l, k, specificDefaultValue) => {
					const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
					if (this.options.missingKeyHandler) this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, opt);
					else if (this.backendConnector?.saveMissing) this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, opt);
					this.emit("missingKey", l, namespace, k, res);
				};
				if (this.options.saveMissing) if (this.options.saveMissingPlurals && needsPluralHandling) lngs.forEach((language) => {
					const suffixes = this.pluralResolver.getSuffixes(language, opt);
					if (needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] && !suffixes.includes(`${this.options.pluralSeparator}zero`)) suffixes.push(`${this.options.pluralSeparator}zero`);
					suffixes.forEach((suffix) => {
						send([language], key + suffix, opt[`defaultValue${suffix}`] || defaultValue);
					});
				});
				else send(lngs, key, defaultValue);
			}
			res = this.extendTranslation(res, keys, opt, resolved, lastKey);
			if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${namespace}${nsSeparator}${key}`;
			if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}${nsSeparator}${key}` : key, usedDefault ? res : void 0, opt);
		}
		if (returnDetails) {
			resolved.res = res;
			resolved.usedParams = this.getUsedParamsDetails(opt);
			return resolved;
		}
		return res;
	}
	extendTranslation(res, key, opt, resolved, lastKey) {
		if (this.i18nFormat?.parse) res = this.i18nFormat.parse(res, {
			...this.options.interpolation.defaultVariables,
			...opt
		}, opt.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, { resolved });
		else if (!opt.skipInterpolation) {
			if (opt.interpolation) this.interpolator.init({
				...opt,
				interpolation: {
					...this.options.interpolation,
					...opt.interpolation
				}
			});
			const skipOnVariables = isString$1(res) && (opt?.interpolation?.skipOnVariables !== void 0 ? opt.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
			let nestBef;
			if (skipOnVariables) {
				const nb = res.match(this.interpolator.nestingRegexp);
				nestBef = nb && nb.length;
			}
			let data = opt.replace && !isString$1(opt.replace) ? opt.replace : opt;
			if (this.options.interpolation.defaultVariables) data = {
				...this.options.interpolation.defaultVariables,
				...data
			};
			res = this.interpolator.interpolate(res, data, opt.lng || this.language || resolved.usedLng, opt);
			if (skipOnVariables) {
				const na = res.match(this.interpolator.nestingRegexp);
				const nestAft = na && na.length;
				if (nestBef < nestAft) opt.nest = false;
			}
			if (!opt.lng && resolved && resolved.res) opt.lng = this.language || resolved.usedLng;
			if (opt.nest !== false) res = this.interpolator.nest(res, (...args) => {
				if (lastKey?.[0] === args[0] && !opt.context) {
					this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
					return null;
				}
				return this.translate(...args, key);
			}, opt);
			if (opt.interpolation) this.interpolator.reset();
		}
		const postProcess = opt.postProcess || this.options.postProcess;
		const postProcessorNames = isString$1(postProcess) ? [postProcess] : postProcess;
		if (res != null && postProcessorNames?.length && opt.applyPostProcessor !== false) res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
			i18nResolved: {
				...resolved,
				usedParams: this.getUsedParamsDetails(opt)
			},
			...opt
		} : opt, this);
		return res;
	}
	resolve(keys, opt = {}) {
		let found;
		let usedKey;
		let exactUsedKey;
		let usedLng;
		let usedNS;
		if (isString$1(keys)) keys = [keys];
		if (Array.isArray(keys)) keys = keys.map((k) => typeof k === "function" ? keysFromSelector(k, {
			...this.options,
			...opt
		}) : k);
		keys.forEach((k) => {
			if (this.isValidLookup(found)) return;
			const extracted = this.extractFromKey(k, opt);
			const key = extracted.key;
			usedKey = key;
			let namespaces = extracted.namespaces;
			if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
			const needsPluralHandling = opt.count !== void 0 && !isString$1(opt.count);
			const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
			const needsContextHandling = opt.context !== void 0 && (isString$1(opt.context) || typeof opt.context === "number") && opt.context !== "";
			const codes = opt.lngs ? opt.lngs : this.languageUtils.toResolveHierarchy(opt.lng || this.language, opt.fallbackLng);
			namespaces.forEach((ns) => {
				if (this.isValidLookup(found)) return;
				usedNS = ns;
				if (!this.checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(usedNS)) {
					this.checkedLoadedFor[`${codes[0]}-${ns}`] = true;
					this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
				}
				codes.forEach((code) => {
					if (this.isValidLookup(found)) return;
					usedLng = code;
					const finalKeys = [key];
					if (this.i18nFormat?.addLookupKeys) this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, opt);
					else {
						let pluralSuffix;
						if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, opt.count, opt);
						const zeroSuffix = `${this.options.pluralSeparator}zero`;
						const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
						if (needsPluralHandling) {
							if (opt.ordinal && pluralSuffix.startsWith(ordinalPrefix)) finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
							finalKeys.push(key + pluralSuffix);
							if (needsZeroSuffixLookup) finalKeys.push(key + zeroSuffix);
						}
						if (needsContextHandling) {
							const contextKey = `${key}${this.options.contextSeparator || "_"}${opt.context}`;
							finalKeys.push(contextKey);
							if (needsPluralHandling) {
								if (opt.ordinal && pluralSuffix.startsWith(ordinalPrefix)) finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
								finalKeys.push(contextKey + pluralSuffix);
								if (needsZeroSuffixLookup) finalKeys.push(contextKey + zeroSuffix);
							}
						}
					}
					let possibleKey;
					while (possibleKey = finalKeys.pop()) if (!this.isValidLookup(found)) {
						exactUsedKey = possibleKey;
						found = this.getResource(code, ns, possibleKey, opt);
					}
				});
			});
		});
		return {
			res: found,
			usedKey,
			exactUsedKey,
			usedLng,
			usedNS
		};
	}
	isValidLookup(res) {
		return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
	}
	getResource(code, ns, key, options = {}) {
		if (this.i18nFormat?.getResource) return this.i18nFormat.getResource(code, ns, key, options);
		return this.resourceStore.getResource(code, ns, key, options);
	}
	getUsedParamsDetails(options = {}) {
		const optionsKeys = [
			"defaultValue",
			"ordinal",
			"context",
			"replace",
			"lng",
			"lngs",
			"fallbackLng",
			"ns",
			"keySeparator",
			"nsSeparator",
			"returnObjects",
			"returnDetails",
			"joinArrays",
			"postProcess",
			"interpolation"
		];
		const useOptionsReplaceForData = options.replace && !isString$1(options.replace);
		let data = useOptionsReplaceForData ? options.replace : options;
		if (useOptionsReplaceForData && typeof options.count !== "undefined") data.count = options.count;
		if (this.options.interpolation.defaultVariables) data = {
			...this.options.interpolation.defaultVariables,
			...data
		};
		if (!useOptionsReplaceForData) {
			data = { ...data };
			for (const key of optionsKeys) delete data[key];
		}
		return data;
	}
	static hasDefaultValue(options) {
		const prefix = "defaultValue";
		for (const option in options) if (Object.prototype.hasOwnProperty.call(options, option) && option.startsWith(prefix) && void 0 !== options[option]) return true;
		return false;
	}
};
var LanguageUtil = class {
	constructor(options) {
		this.options = options;
		this.supportedLngs = this.options.supportedLngs || false;
		this.logger = baseLogger.create("languageUtils");
	}
	getScriptPartFromCode(code) {
		code = getCleanedCode(code);
		if (!code || !code.includes("-")) return null;
		const p = code.split("-");
		if (p.length === 2) return null;
		p.pop();
		if (p[p.length - 1].toLowerCase() === "x") return null;
		return this.formatLanguageCode(p.join("-"));
	}
	getLanguagePartFromCode(code) {
		code = getCleanedCode(code);
		if (!code || !code.includes("-")) return code;
		const p = code.split("-");
		return this.formatLanguageCode(p[0]);
	}
	formatLanguageCode(code) {
		if (isString$1(code) && code.includes("-")) {
			let formattedCode;
			try {
				formattedCode = Intl.getCanonicalLocales(code)[0];
			} catch (e) {}
			if (formattedCode && this.options.lowerCaseLng) formattedCode = formattedCode.toLowerCase();
			if (formattedCode) return formattedCode;
			if (this.options.lowerCaseLng) return code.toLowerCase();
			return code;
		}
		return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
	}
	isSupportedCode(code) {
		if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) code = this.getLanguagePartFromCode(code);
		return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.includes(code);
	}
	getBestMatchFromCodes(codes) {
		if (!codes) return null;
		let found;
		codes.forEach((code) => {
			if (found) return;
			const cleanedLng = this.formatLanguageCode(code);
			if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
		});
		if (!found && this.options.supportedLngs) codes.forEach((code) => {
			if (found) return;
			const lngScOnly = this.getScriptPartFromCode(code);
			if (this.isSupportedCode(lngScOnly)) return found = lngScOnly;
			const lngOnly = this.getLanguagePartFromCode(code);
			if (this.isSupportedCode(lngOnly)) return found = lngOnly;
			found = this.options.supportedLngs.find((supportedLng) => {
				if (supportedLng === lngOnly) return true;
				if (!supportedLng.includes("-") && !lngOnly.includes("-")) return false;
				if (supportedLng.includes("-") && !lngOnly.includes("-") && supportedLng.slice(0, supportedLng.indexOf("-")) === lngOnly) return true;
				if (supportedLng.startsWith(lngOnly) && lngOnly.length > 1) return true;
				return false;
			});
		});
		if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
		return found;
	}
	getFallbackCodes(fallbacks, code) {
		if (!fallbacks) return [];
		if (typeof fallbacks === "function") fallbacks = fallbacks(code);
		if (isString$1(fallbacks)) fallbacks = [fallbacks];
		if (Array.isArray(fallbacks)) return fallbacks;
		if (!code) return fallbacks.default || [];
		let found = fallbacks[code];
		if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
		if (!found) found = fallbacks[this.formatLanguageCode(code)];
		if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
		if (!found) found = fallbacks.default;
		return found || [];
	}
	toResolveHierarchy(code, fallbackCode) {
		const fallbackCodes = this.getFallbackCodes((fallbackCode === false ? [] : fallbackCode) || this.options.fallbackLng || [], code);
		const codes = [];
		const addCode = (c) => {
			if (!c) return;
			if (this.isSupportedCode(c)) codes.push(c);
			else this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
		};
		if (isString$1(code) && (code.includes("-") || code.includes("_"))) {
			if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
			if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
			if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
		} else if (isString$1(code)) addCode(this.formatLanguageCode(code));
		fallbackCodes.forEach((fc) => {
			if (!codes.includes(fc)) addCode(this.formatLanguageCode(fc));
		});
		return codes;
	}
};
var suffixesOrder = {
	zero: 0,
	one: 1,
	two: 2,
	few: 3,
	many: 4,
	other: 5
};
var dummyRule = {
	select: (count) => count === 1 ? "one" : "other",
	resolvedOptions: () => ({ pluralCategories: ["one", "other"] })
};
var PluralResolver = class {
	constructor(languageUtils, options = {}) {
		this.languageUtils = languageUtils;
		this.options = options;
		this.logger = baseLogger.create("pluralResolver");
		this.pluralRulesCache = {};
	}
	clearCache() {
		this.pluralRulesCache = {};
	}
	getRule(code, options = {}) {
		const cleanedCode = getCleanedCode(code === "dev" ? "en" : code);
		const type = options.ordinal ? "ordinal" : "cardinal";
		const cacheKey = JSON.stringify({
			cleanedCode,
			type
		});
		if (cacheKey in this.pluralRulesCache) return this.pluralRulesCache[cacheKey];
		let rule;
		try {
			rule = new Intl.PluralRules(cleanedCode, { type });
		} catch (err) {
			if (typeof Intl === "undefined") {
				this.logger.error("No Intl support, please use an Intl polyfill!");
				return dummyRule;
			}
			if (!code.match(/-|_/)) return dummyRule;
			const lngPart = this.languageUtils.getLanguagePartFromCode(code);
			rule = this.getRule(lngPart, options);
		}
		this.pluralRulesCache[cacheKey] = rule;
		return rule;
	}
	needsPlural(code, options = {}) {
		let rule = this.getRule(code, options);
		if (!rule) rule = this.getRule("dev", options);
		return rule?.resolvedOptions().pluralCategories.length > 1;
	}
	getPluralFormsOfKey(code, key, options = {}) {
		return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
	}
	getSuffixes(code, options = {}) {
		let rule = this.getRule(code, options);
		if (!rule) rule = this.getRule("dev", options);
		if (!rule) return [];
		return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
	}
	getSuffix(code, count, options = {}) {
		const rule = this.getRule(code, options);
		if (rule) return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count)}`;
		this.logger.warn(`no plural rule found for: ${code}`);
		return this.getSuffix("dev", count, options);
	}
};
var deepFindWithDefaults = (data, defaultData, key, keySeparator = ".", ignoreJSONStructure = true) => {
	let path = getPathWithDefaults(data, defaultData, key);
	if (!path && ignoreJSONStructure && isString$1(key)) {
		path = deepFind(data, key, keySeparator);
		if (path === void 0) path = deepFind(defaultData, key, keySeparator);
	}
	return path;
};
var regexSafe = (val) => val.replace(/\$/g, "$$$$");
var Interpolator = class {
	constructor(options = {}) {
		this.logger = baseLogger.create("interpolator");
		this.options = options;
		this.format = options?.interpolation?.format || ((value) => value);
		this.init(options);
	}
	init(options = {}) {
		if (!options.interpolation) options.interpolation = { escapeValue: true };
		const { escape: escape$1, escapeValue, useRawValueToEscape, prefix, prefixEscaped, suffix, suffixEscaped, formatSeparator, unescapeSuffix, unescapePrefix, nestingPrefix, nestingPrefixEscaped, nestingSuffix, nestingSuffixEscaped, nestingOptionsSeparator, maxReplaces, alwaysFormat } = options.interpolation;
		this.escape = escape$1 !== void 0 ? escape$1 : escape;
		this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
		this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
		this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || "{{";
		this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || "}}";
		this.formatSeparator = formatSeparator || ",";
		this.unescapePrefix = unescapeSuffix ? "" : unescapePrefix ? regexEscape(unescapePrefix) : "-";
		this.unescapeSuffix = this.unescapePrefix ? "" : unescapeSuffix ? regexEscape(unescapeSuffix) : "";
		this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape("$t(");
		this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(")");
		this.nestingOptionsSeparator = nestingOptionsSeparator || ",";
		this.maxReplaces = maxReplaces || 1e3;
		this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
		this.resetRegExp();
	}
	reset() {
		if (this.options) this.init(this.options);
	}
	resetRegExp() {
		const getOrResetRegExp = (existingRegExp, pattern) => {
			if (existingRegExp?.source === pattern) {
				existingRegExp.lastIndex = 0;
				return existingRegExp;
			}
			return new RegExp(pattern, "g");
		};
		this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
		this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
		this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
	}
	interpolate(str, data, lng, options) {
		let match;
		let value;
		let replaces;
		const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
		const handleFormat = (key) => {
			if (!key.includes(this.formatSeparator)) {
				const path = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
				return this.alwaysFormat ? this.format(path, void 0, lng, {
					...options,
					...data,
					interpolationkey: key
				}) : path;
			}
			const p = key.split(this.formatSeparator);
			const k = p.shift().trim();
			const f = p.join(this.formatSeparator).trim();
			return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
				...options,
				...data,
				interpolationkey: k
			});
		};
		this.resetRegExp();
		if (!this.escapeValue && typeof str === "string" && /\$t\([^)]*\{[^}]*\{\{/.test(str)) this.logger.warn("nesting options string contains interpolated variables with escapeValue: false — if any of those values are attacker-controlled they can inject additional nesting options (e.g. redirect lng/ns). Sanitise untrusted input before passing it to t(), or keep escapeValue: true.");
		const missingInterpolationHandler = options?.missingInterpolationHandler || this.options.missingInterpolationHandler;
		const skipOnVariables = options?.interpolation?.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
		[{
			regex: this.regexpUnescape,
			safeValue: (val) => regexSafe(val)
		}, {
			regex: this.regexp,
			safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
		}].forEach((todo) => {
			replaces = 0;
			while (match = todo.regex.exec(str)) {
				const matchedVar = match[1].trim();
				value = handleFormat(matchedVar);
				if (value === void 0) if (typeof missingInterpolationHandler === "function") {
					const temp = missingInterpolationHandler(str, match, options);
					value = isString$1(temp) ? temp : "";
				} else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) value = "";
				else if (skipOnVariables) {
					value = match[0];
					continue;
				} else {
					this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
					value = "";
				}
				else if (!isString$1(value) && !this.useRawValueToEscape) value = makeString(value);
				const safeValue = todo.safeValue(value);
				str = str.replace(match[0], safeValue);
				if (skipOnVariables) {
					todo.regex.lastIndex += value.length;
					todo.regex.lastIndex -= match[0].length;
				} else todo.regex.lastIndex = 0;
				replaces++;
				if (replaces >= this.maxReplaces) break;
			}
		});
		return str;
	}
	nest(str, fc, options = {}) {
		let match;
		let value;
		let clonedOptions;
		const handleHasOptions = (key, inheritedOptions) => {
			const sep = this.nestingOptionsSeparator;
			if (!key.includes(sep)) return key;
			const c = key.split(new RegExp(`${regexEscape(sep)}[ ]*{`));
			let optionsString = `{${c[1]}`;
			key = c[0];
			optionsString = this.interpolate(optionsString, clonedOptions);
			const matchedSingleQuotes = optionsString.match(/'/g);
			const matchedDoubleQuotes = optionsString.match(/"/g);
			if ((matchedSingleQuotes?.length ?? 0) % 2 === 0 && !matchedDoubleQuotes || (matchedDoubleQuotes?.length ?? 0) % 2 !== 0) optionsString = optionsString.replace(/'/g, "\"");
			try {
				clonedOptions = JSON.parse(optionsString);
				if (inheritedOptions) clonedOptions = {
					...inheritedOptions,
					...clonedOptions
				};
			} catch (e) {
				this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
				return `${key}${sep}${optionsString}`;
			}
			if (clonedOptions.defaultValue && clonedOptions.defaultValue.includes(this.prefix)) delete clonedOptions.defaultValue;
			return key;
		};
		while (match = this.nestingRegexp.exec(str)) {
			let formatters = [];
			clonedOptions = { ...options };
			clonedOptions = clonedOptions.replace && !isString$1(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
			clonedOptions.applyPostProcessor = false;
			delete clonedOptions.defaultValue;
			const keyEndIndex = /{.*}/.test(match[1]) ? match[1].lastIndexOf("}") + 1 : match[1].indexOf(this.formatSeparator);
			if (keyEndIndex !== -1) {
				formatters = match[1].slice(keyEndIndex).split(this.formatSeparator).map((elem) => elem.trim()).filter(Boolean);
				match[1] = match[1].slice(0, keyEndIndex);
			}
			value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
			if (value && match[0] === str && !isString$1(value)) return value;
			if (!isString$1(value)) value = makeString(value);
			if (!value) {
				this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
				value = "";
			}
			if (formatters.length) value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
				...options,
				interpolationkey: match[1].trim()
			}), value.trim());
			str = str.replace(match[0], value);
			this.regexp.lastIndex = 0;
		}
		return str;
	}
};
var parseFormatStr = (formatStr) => {
	let formatName = formatStr.toLowerCase().trim();
	const formatOptions = {};
	if (formatStr.includes("(")) {
		const p = formatStr.split("(");
		formatName = p[0].toLowerCase().trim();
		const optStr = p[1].slice(0, -1);
		if (formatName === "currency" && !optStr.includes(":")) {
			if (!formatOptions.currency) formatOptions.currency = optStr.trim();
		} else if (formatName === "relativetime" && !optStr.includes(":")) {
			if (!formatOptions.range) formatOptions.range = optStr.trim();
		} else optStr.split(";").forEach((opt) => {
			if (opt) {
				const [key, ...rest] = opt.split(":");
				const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
				const trimmedKey = key.trim();
				if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
				if (val === "false") formatOptions[trimmedKey] = false;
				if (val === "true") formatOptions[trimmedKey] = true;
				if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
			}
		});
	}
	return {
		formatName,
		formatOptions
	};
};
var createCachedFormatter = (fn) => {
	const cache = {};
	return (v, l, o) => {
		let optForCache = o;
		if (o && o.interpolationkey && o.formatParams && o.formatParams[o.interpolationkey] && o[o.interpolationkey]) optForCache = {
			...optForCache,
			[o.interpolationkey]: void 0
		};
		const key = l + JSON.stringify(optForCache);
		let frm = cache[key];
		if (!frm) {
			frm = fn(getCleanedCode(l), o);
			cache[key] = frm;
		}
		return frm(v);
	};
};
var createNonCachedFormatter = (fn) => (v, l, o) => fn(getCleanedCode(l), o)(v);
var Formatter = class {
	constructor(options = {}) {
		this.logger = baseLogger.create("formatter");
		this.options = options;
		this.init(options);
	}
	init(services, options = { interpolation: {} }) {
		this.formatSeparator = options.interpolation.formatSeparator || ",";
		const cf = options.cacheInBuiltFormats ? createCachedFormatter : createNonCachedFormatter;
		this.formats = {
			number: cf((lng, opt) => {
				const formatter = new Intl.NumberFormat(lng, { ...opt });
				return (val) => formatter.format(val);
			}),
			currency: cf((lng, opt) => {
				const formatter = new Intl.NumberFormat(lng, {
					...opt,
					style: "currency"
				});
				return (val) => formatter.format(val);
			}),
			datetime: cf((lng, opt) => {
				const formatter = new Intl.DateTimeFormat(lng, { ...opt });
				return (val) => formatter.format(val);
			}),
			relativetime: cf((lng, opt) => {
				const formatter = new Intl.RelativeTimeFormat(lng, { ...opt });
				return (val) => formatter.format(val, opt.range || "day");
			}),
			list: cf((lng, opt) => {
				const formatter = new Intl.ListFormat(lng, { ...opt });
				return (val) => formatter.format(val);
			})
		};
	}
	add(name, fc) {
		this.formats[name.toLowerCase().trim()] = fc;
	}
	addCached(name, fc) {
		this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
	}
	format(value, format, lng, options = {}) {
		if (!format) return value;
		if (value == null) return value;
		const formats = format.split(this.formatSeparator);
		if (formats.length > 1 && formats[0].indexOf("(") > 1 && !formats[0].includes(")") && formats.find((f) => f.includes(")"))) {
			const lastIndex = formats.findIndex((f) => f.includes(")"));
			formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
		}
		return formats.reduce((mem, f) => {
			const { formatName, formatOptions } = parseFormatStr(f);
			if (this.formats[formatName]) {
				let formatted = mem;
				try {
					const valOptions = options?.formatParams?.[options.interpolationkey] || {};
					const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
					formatted = this.formats[formatName](mem, l, {
						...formatOptions,
						...options,
						...valOptions
					});
				} catch (error) {
					this.logger.warn(error);
				}
				return formatted;
			} else this.logger.warn(`there was no format function for ${formatName}`);
			return mem;
		}, value);
	}
};
var removePending = (q, name) => {
	if (q.pending[name] !== void 0) {
		delete q.pending[name];
		q.pendingCount--;
	}
};
var Connector = class extends EventEmitter {
	constructor(backend, store, services, options = {}) {
		super();
		this.backend = backend;
		this.store = store;
		this.services = services;
		this.languageUtils = services.languageUtils;
		this.options = options;
		this.logger = baseLogger.create("backendConnector");
		this.waitingReads = [];
		this.maxParallelReads = options.maxParallelReads || 10;
		this.readingCalls = 0;
		this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
		this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
		this.state = {};
		this.queue = [];
		this.backend?.init?.(services, options.backend, options);
	}
	queueLoad(languages, namespaces, options, callback) {
		const toLoad = {};
		const pending = {};
		const toLoadLanguages = {};
		const toLoadNamespaces = {};
		languages.forEach((lng) => {
			let hasAllNamespaces = true;
			namespaces.forEach((ns) => {
				const name = `${lng}|${ns}`;
				if (!options.reload && this.store.hasResourceBundle(lng, ns)) this.state[name] = 2;
				else if (this.state[name] < 0);
				else if (this.state[name] === 1) {
					if (pending[name] === void 0) pending[name] = true;
				} else {
					this.state[name] = 1;
					hasAllNamespaces = false;
					if (pending[name] === void 0) pending[name] = true;
					if (toLoad[name] === void 0) toLoad[name] = true;
					if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
				}
			});
			if (!hasAllNamespaces) toLoadLanguages[lng] = true;
		});
		if (Object.keys(toLoad).length || Object.keys(pending).length) this.queue.push({
			pending,
			pendingCount: Object.keys(pending).length,
			loaded: {},
			errors: [],
			callback
		});
		return {
			toLoad: Object.keys(toLoad),
			pending: Object.keys(pending),
			toLoadLanguages: Object.keys(toLoadLanguages),
			toLoadNamespaces: Object.keys(toLoadNamespaces)
		};
	}
	loaded(name, err, data) {
		const s = name.split("|");
		const lng = s[0];
		const ns = s[1];
		if (err) this.emit("failedLoading", lng, ns, err);
		if (!err && data) this.store.addResourceBundle(lng, ns, data, void 0, void 0, { skipCopy: true });
		this.state[name] = err ? -1 : 2;
		if (err && data) this.state[name] = 0;
		const loaded = {};
		this.queue.forEach((q) => {
			pushPath(q.loaded, [lng], ns);
			removePending(q, name);
			if (err) q.errors.push(err);
			if (q.pendingCount === 0 && !q.done) {
				Object.keys(q.loaded).forEach((l) => {
					if (!loaded[l]) loaded[l] = {};
					const loadedKeys = q.loaded[l];
					if (loadedKeys.length) loadedKeys.forEach((n) => {
						if (loaded[l][n] === void 0) loaded[l][n] = true;
					});
				});
				q.done = true;
				if (q.errors.length) q.callback(q.errors);
				else q.callback();
			}
		});
		this.emit("loaded", loaded);
		this.queue = this.queue.filter((q) => !q.done);
	}
	read(lng, ns, fcName, tried = 0, wait = this.retryTimeout, callback) {
		if (!lng.length) return callback(null, {});
		if (this.readingCalls >= this.maxParallelReads) {
			this.waitingReads.push({
				lng,
				ns,
				fcName,
				tried,
				wait,
				callback
			});
			return;
		}
		this.readingCalls++;
		const resolver = (err, data) => {
			this.readingCalls--;
			if (this.waitingReads.length > 0) {
				const next = this.waitingReads.shift();
				this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
			}
			if (err && data && tried < this.maxRetries) {
				setTimeout(() => {
					this.read(lng, ns, fcName, tried + 1, wait * 2, callback);
				}, wait);
				return;
			}
			callback(err, data);
		};
		const fc = this.backend[fcName].bind(this.backend);
		if (fc.length === 2) {
			try {
				const r = fc(lng, ns);
				if (r && typeof r.then === "function") r.then((data) => resolver(null, data)).catch(resolver);
				else resolver(null, r);
			} catch (err) {
				resolver(err);
			}
			return;
		}
		return fc(lng, ns, resolver);
	}
	prepareLoading(languages, namespaces, options = {}, callback) {
		if (!this.backend) {
			this.logger.warn("No backend was added via i18next.use. Will not load resources.");
			return callback && callback();
		}
		if (isString$1(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
		if (isString$1(namespaces)) namespaces = [namespaces];
		const toLoad = this.queueLoad(languages, namespaces, options, callback);
		if (!toLoad.toLoad.length) {
			if (!toLoad.pending.length) callback();
			return null;
		}
		toLoad.toLoad.forEach((name) => {
			this.loadOne(name);
		});
	}
	load(languages, namespaces, callback) {
		this.prepareLoading(languages, namespaces, {}, callback);
	}
	reload(languages, namespaces, callback) {
		this.prepareLoading(languages, namespaces, { reload: true }, callback);
	}
	loadOne(name, prefix = "") {
		const s = name.split("|");
		const lng = s[0];
		const ns = s[1];
		this.read(lng, ns, "read", void 0, void 0, (err, data) => {
			if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
			if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
			this.loaded(name, err, data);
		});
	}
	saveMissing(languages, namespace, key, fallbackValue, isUpdate, options = {}, clb = () => {}) {
		if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(namespace)) {
			this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
			return;
		}
		if (key === void 0 || key === null || key === "") return;
		if (this.backend?.create) {
			const opts = {
				...options,
				isUpdate
			};
			const fc = this.backend.create.bind(this.backend);
			if (fc.length < 6) try {
				let r;
				if (fc.length === 5) r = fc(languages, namespace, key, fallbackValue, opts);
				else r = fc(languages, namespace, key, fallbackValue);
				if (r && typeof r.then === "function") r.then((data) => clb(null, data)).catch(clb);
				else clb(null, r);
			} catch (err) {
				clb(err);
			}
			else fc(languages, namespace, key, fallbackValue, clb, opts);
		}
		if (!languages || !languages[0]) return;
		this.store.addResource(languages[0], namespace, key, fallbackValue);
	}
};
var get = () => ({
	debug: false,
	initAsync: true,
	ns: ["translation"],
	defaultNS: ["translation"],
	fallbackLng: ["dev"],
	fallbackNS: false,
	supportedLngs: false,
	nonExplicitSupportedLngs: false,
	load: "all",
	preload: false,
	keySeparator: ".",
	nsSeparator: ":",
	pluralSeparator: "_",
	contextSeparator: "_",
	enableSelector: false,
	partialBundledLanguages: false,
	saveMissing: false,
	updateMissing: false,
	saveMissingTo: "fallback",
	saveMissingPlurals: true,
	missingKeyHandler: false,
	missingInterpolationHandler: false,
	postProcess: false,
	postProcessPassResolved: false,
	returnNull: false,
	returnEmptyString: true,
	returnObjects: false,
	joinArrays: false,
	returnedObjectHandler: false,
	parseMissingKeyHandler: false,
	appendNamespaceToMissingKey: false,
	appendNamespaceToCIMode: false,
	overloadTranslationOptionHandler: (args) => {
		let ret = {};
		if (typeof args[1] === "object") ret = args[1];
		if (isString$1(args[1])) ret.defaultValue = args[1];
		if (isString$1(args[2])) ret.tDescription = args[2];
		if (typeof args[2] === "object" || typeof args[3] === "object") {
			const options = args[3] || args[2];
			Object.keys(options).forEach((key) => {
				ret[key] = options[key];
			});
		}
		return ret;
	},
	interpolation: {
		escapeValue: true,
		prefix: "{{",
		suffix: "}}",
		formatSeparator: ",",
		unescapePrefix: "-",
		nestingPrefix: "$t(",
		nestingSuffix: ")",
		nestingOptionsSeparator: ",",
		maxReplaces: 1e3,
		skipOnVariables: true
	},
	cacheInBuiltFormats: true
});
var transformOptions = (options) => {
	if (isString$1(options.ns)) options.ns = [options.ns];
	if (isString$1(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
	if (isString$1(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
	if (options.supportedLngs && !options.supportedLngs.includes("cimode")) options.supportedLngs = options.supportedLngs.concat(["cimode"]);
	return options;
};
var noop = () => {};
var bindMemberFunctions = (inst) => {
	Object.getOwnPropertyNames(Object.getPrototypeOf(inst)).forEach((mem) => {
		if (typeof inst[mem] === "function") inst[mem] = inst[mem].bind(inst);
	});
};
var instance = class I18n extends EventEmitter {
	constructor(options = {}, callback) {
		super();
		this.options = transformOptions(options);
		this.services = {};
		this.logger = baseLogger;
		this.modules = { external: [] };
		bindMemberFunctions(this);
		if (callback && !this.isInitialized && !options.isClone) {
			if (!this.options.initAsync) {
				this.init(options, callback);
				return this;
			}
			setTimeout(() => {
				this.init(options, callback);
			}, 0);
		}
	}
	init(options = {}, callback) {
		this.isInitializing = true;
		if (typeof options === "function") {
			callback = options;
			options = {};
		}
		if (options.defaultNS == null && options.ns) {
			if (isString$1(options.ns)) options.defaultNS = options.ns;
			else if (!options.ns.includes("translation")) options.defaultNS = options.ns[0];
		}
		const defOpts = get();
		this.options = {
			...defOpts,
			...this.options,
			...transformOptions(options)
		};
		this.options.interpolation = {
			...defOpts.interpolation,
			...this.options.interpolation
		};
		if (options.keySeparator !== void 0) this.options.userDefinedKeySeparator = options.keySeparator;
		if (options.nsSeparator !== void 0) this.options.userDefinedNsSeparator = options.nsSeparator;
		if (typeof this.options.overloadTranslationOptionHandler !== "function") this.options.overloadTranslationOptionHandler = defOpts.overloadTranslationOptionHandler;
		const createClassOnDemand = (ClassOrObject) => {
			if (!ClassOrObject) return null;
			if (typeof ClassOrObject === "function") return new ClassOrObject();
			return ClassOrObject;
		};
		if (!this.options.isClone) {
			if (this.modules.logger) baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
			else baseLogger.init(null, this.options);
			let formatter;
			if (this.modules.formatter) formatter = this.modules.formatter;
			else formatter = Formatter;
			const lu = new LanguageUtil(this.options);
			this.store = new ResourceStore(this.options.resources, this.options);
			const s = this.services;
			s.logger = baseLogger;
			s.resourceStore = this.store;
			s.languageUtils = lu;
			s.pluralResolver = new PluralResolver(lu, { prepend: this.options.pluralSeparator });
			if (formatter) {
				s.formatter = createClassOnDemand(formatter);
				if (s.formatter.init) s.formatter.init(s, this.options);
				this.options.interpolation.format = s.formatter.format.bind(s.formatter);
			}
			s.interpolator = new Interpolator(this.options);
			s.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) };
			s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
			s.backendConnector.on("*", (event, ...args) => {
				this.emit(event, ...args);
			});
			if (this.modules.languageDetector) {
				s.languageDetector = createClassOnDemand(this.modules.languageDetector);
				if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
			}
			if (this.modules.i18nFormat) {
				s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
				if (s.i18nFormat.init) s.i18nFormat.init(this);
			}
			this.translator = new Translator(this.services, this.options);
			this.translator.on("*", (event, ...args) => {
				this.emit(event, ...args);
			});
			this.modules.external.forEach((m) => {
				if (m.init) m.init(this);
			});
		}
		this.format = this.options.interpolation.format;
		if (!callback) callback = noop;
		if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
			const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
			if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
		}
		if (!this.services.languageDetector && !this.options.lng) this.logger.warn("init: no languageDetector is used and no lng is defined");
		[
			"getResource",
			"hasResourceBundle",
			"getResourceBundle",
			"getDataByLanguage"
		].forEach((fcName) => {
			this[fcName] = (...args) => this.store[fcName](...args);
		});
		[
			"addResource",
			"addResources",
			"addResourceBundle",
			"removeResourceBundle"
		].forEach((fcName) => {
			this[fcName] = (...args) => {
				this.store[fcName](...args);
				return this;
			};
		});
		const deferred = defer();
		const load = () => {
			const finish = (err, t) => {
				this.isInitializing = false;
				if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
				this.isInitialized = true;
				if (!this.options.isClone) this.logger.log("initialized", this.options);
				this.emit("initialized", this.options);
				deferred.resolve(t);
				callback(err, t);
			};
			if ((this.languages || this.isLanguageChangingTo) && !this.isInitialized) return finish(null, this.t.bind(this));
			this.changeLanguage(this.options.lng, finish);
		};
		if (this.options.resources || !this.options.initAsync) load();
		else setTimeout(load, 0);
		return deferred;
	}
	loadResources(language, callback = noop) {
		let usedCallback = callback;
		const usedLng = isString$1(language) ? language : this.language;
		if (typeof language === "function") usedCallback = language;
		if (!this.options.resources || this.options.partialBundledLanguages) {
			if (usedLng?.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
			const toLoad = [];
			const append = (lng) => {
				if (!lng) return;
				if (lng === "cimode") return;
				this.services.languageUtils.toResolveHierarchy(lng).forEach((l) => {
					if (l === "cimode") return;
					if (!toLoad.includes(l)) toLoad.push(l);
				});
			};
			if (!usedLng) this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((l) => append(l));
			else append(usedLng);
			this.options.preload?.forEach?.((l) => append(l));
			this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
				if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
				usedCallback(e);
			});
		} else usedCallback(null);
	}
	reloadResources(lngs, ns, callback) {
		const deferred = defer();
		if (typeof lngs === "function") {
			callback = lngs;
			lngs = void 0;
		}
		if (typeof ns === "function") {
			callback = ns;
			ns = void 0;
		}
		if (!lngs) lngs = this.languages;
		if (!ns) ns = this.options.ns;
		if (!callback) callback = noop;
		this.services.backendConnector.reload(lngs, ns, (err) => {
			deferred.resolve();
			callback(err);
		});
		return deferred;
	}
	use(module) {
		if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
		if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
		if (module.type === "backend") this.modules.backend = module;
		if (module.type === "logger" || module.log && module.warn && module.error) this.modules.logger = module;
		if (module.type === "languageDetector") this.modules.languageDetector = module;
		if (module.type === "i18nFormat") this.modules.i18nFormat = module;
		if (module.type === "postProcessor") postProcessor.addPostProcessor(module);
		if (module.type === "formatter") this.modules.formatter = module;
		if (module.type === "3rdParty") this.modules.external.push(module);
		return this;
	}
	setResolvedLanguage(l) {
		if (!l || !this.languages) return;
		if (["cimode", "dev"].includes(l)) return;
		for (let li = 0; li < this.languages.length; li++) {
			const lngInLngs = this.languages[li];
			if (["cimode", "dev"].includes(lngInLngs)) continue;
			if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
				this.resolvedLanguage = lngInLngs;
				break;
			}
		}
		if (!this.resolvedLanguage && !this.languages.includes(l) && this.store.hasLanguageSomeTranslations(l)) {
			this.resolvedLanguage = l;
			this.languages.unshift(l);
		}
	}
	changeLanguage(lng, callback) {
		this.isLanguageChangingTo = lng;
		const deferred = defer();
		this.emit("languageChanging", lng);
		const setLngProps = (l) => {
			this.language = l;
			this.languages = this.services.languageUtils.toResolveHierarchy(l);
			this.resolvedLanguage = void 0;
			this.setResolvedLanguage(l);
		};
		const done = (err, l) => {
			if (l) {
				if (this.isLanguageChangingTo === lng) {
					setLngProps(l);
					this.translator.changeLanguage(l);
					this.isLanguageChangingTo = void 0;
					this.emit("languageChanged", l);
					this.logger.log("languageChanged", l);
				}
			} else this.isLanguageChangingTo = void 0;
			deferred.resolve((...args) => this.t(...args));
			if (callback) callback(err, (...args) => this.t(...args));
		};
		const setLng = (lngs) => {
			if (!lng && !lngs && this.services.languageDetector) lngs = [];
			const fl = isString$1(lngs) ? lngs : lngs && lngs[0];
			const l = this.store.hasLanguageSomeTranslations(fl) ? fl : this.services.languageUtils.getBestMatchFromCodes(isString$1(lngs) ? [lngs] : lngs);
			if (l) {
				if (!this.language) setLngProps(l);
				if (!this.translator.language) this.translator.changeLanguage(l);
				this.services.languageDetector?.cacheUserLanguage?.(l);
			}
			this.loadResources(l, (err) => {
				done(err, l);
			});
		};
		if (!lng && this.services.languageDetector && !this.services.languageDetector.async) setLng(this.services.languageDetector.detect());
		else if (!lng && this.services.languageDetector && this.services.languageDetector.async) if (this.services.languageDetector.detect.length === 0) this.services.languageDetector.detect().then(setLng);
		else this.services.languageDetector.detect(setLng);
		else setLng(lng);
		return deferred;
	}
	getFixedT(lng, ns, keyPrefix, fixedOpts) {
		const scopeNs = fixedOpts?.scopeNs;
		const fixedT = (key, opts, ...rest) => {
			let o;
			if (typeof opts !== "object") o = this.options.overloadTranslationOptionHandler([key, opts].concat(rest));
			else o = { ...opts };
			o.lng = o.lng || fixedT.lng;
			o.lngs = o.lngs || fixedT.lngs;
			const explicitCallNs = o.ns !== void 0 && o.ns !== null;
			o.ns = o.ns || fixedT.ns;
			if (o.keyPrefix !== "") o.keyPrefix = o.keyPrefix || keyPrefix || fixedT.keyPrefix;
			const selectorOpts = {
				...this.options,
				...o
			};
			if (Array.isArray(scopeNs) && !explicitCallNs) selectorOpts.ns = scopeNs;
			if (typeof o.keyPrefix === "function") o.keyPrefix = keysFromSelector(o.keyPrefix, selectorOpts);
			const keySeparator = this.options.keySeparator || ".";
			let resultKey;
			if (o.keyPrefix && Array.isArray(key)) resultKey = key.map((k) => {
				if (typeof k === "function") k = keysFromSelector(k, selectorOpts);
				return `${o.keyPrefix}${keySeparator}${k}`;
			});
			else {
				if (typeof key === "function") key = keysFromSelector(key, selectorOpts);
				resultKey = o.keyPrefix ? `${o.keyPrefix}${keySeparator}${key}` : key;
			}
			return this.t(resultKey, o);
		};
		if (isString$1(lng)) fixedT.lng = lng;
		else fixedT.lngs = lng;
		fixedT.ns = ns;
		fixedT.keyPrefix = keyPrefix;
		return fixedT;
	}
	t(...args) {
		return this.translator?.translate(...args);
	}
	exists(...args) {
		return this.translator?.exists(...args);
	}
	setDefaultNamespace(ns) {
		this.options.defaultNS = ns;
	}
	hasLoadedNamespace(ns, options = {}) {
		if (!this.isInitialized) {
			this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
			return false;
		}
		if (!this.languages || !this.languages.length) {
			this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
			return false;
		}
		const lng = options.lng || this.resolvedLanguage || this.languages[0];
		const fallbackLng = this.options ? this.options.fallbackLng : false;
		const lastLng = this.languages[this.languages.length - 1];
		if (lng.toLowerCase() === "cimode") return true;
		const loadNotPending = (l, n) => {
			const loadState = this.services.backendConnector.state[`${l}|${n}`];
			return loadState === -1 || loadState === 0 || loadState === 2;
		};
		if (options.precheck) {
			const preResult = options.precheck(this, loadNotPending);
			if (preResult !== void 0) return preResult;
		}
		if (this.hasResourceBundle(lng, ns)) return true;
		if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
		if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
		return false;
	}
	loadNamespaces(ns, callback) {
		const deferred = defer();
		if (!this.options.ns) {
			if (callback) callback();
			return Promise.resolve();
		}
		if (isString$1(ns)) ns = [ns];
		ns.forEach((n) => {
			if (!this.options.ns.includes(n)) this.options.ns.push(n);
		});
		this.loadResources((err) => {
			deferred.resolve();
			if (callback) callback(err);
		});
		return deferred;
	}
	loadLanguages(lngs, callback) {
		const deferred = defer();
		if (isString$1(lngs)) lngs = [lngs];
		const preloaded = this.options.preload || [];
		const newLngs = lngs.filter((lng) => !preloaded.includes(lng) && this.services.languageUtils.isSupportedCode(lng));
		if (!newLngs.length) {
			if (callback) callback();
			return Promise.resolve();
		}
		this.options.preload = preloaded.concat(newLngs);
		this.loadResources((err) => {
			deferred.resolve();
			if (callback) callback(err);
		});
		return deferred;
	}
	dir(lng) {
		if (!lng) lng = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language);
		if (!lng) return "rtl";
		try {
			const l = new Intl.Locale(lng);
			if (l && l.getTextInfo) {
				const ti = l.getTextInfo();
				if (ti && ti.direction) return ti.direction;
			}
		} catch (e) {}
		const rtlLngs = [
			"ar",
			"shu",
			"sqr",
			"ssh",
			"xaa",
			"yhd",
			"yud",
			"aao",
			"abh",
			"abv",
			"acm",
			"acq",
			"acw",
			"acx",
			"acy",
			"adf",
			"ads",
			"aeb",
			"aec",
			"afb",
			"ajp",
			"apc",
			"apd",
			"arb",
			"arq",
			"ars",
			"ary",
			"arz",
			"auz",
			"avl",
			"ayh",
			"ayl",
			"ayn",
			"ayp",
			"bbz",
			"pga",
			"he",
			"iw",
			"ps",
			"pbt",
			"pbu",
			"pst",
			"prp",
			"prd",
			"ug",
			"ur",
			"ydd",
			"yds",
			"yih",
			"ji",
			"yi",
			"hbo",
			"men",
			"xmn",
			"fa",
			"jpr",
			"peo",
			"pes",
			"prs",
			"dv",
			"sam",
			"ckb"
		];
		const languageUtils = this.services?.languageUtils || new LanguageUtil(get());
		if (lng.toLowerCase().indexOf("-latn") > 1) return "ltr";
		return rtlLngs.includes(languageUtils.getLanguagePartFromCode(lng)) || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
	}
	static createInstance(options = {}, callback) {
		const instance = new I18n(options, callback);
		instance.createInstance = I18n.createInstance;
		return instance;
	}
	cloneInstance(options = {}, callback = noop) {
		const forkResourceStore = options.forkResourceStore;
		if (forkResourceStore) delete options.forkResourceStore;
		const mergedOptions = {
			...this.options,
			...options,
			isClone: true
		};
		const clone = new I18n(mergedOptions);
		if (options.debug !== void 0 || options.prefix !== void 0) clone.logger = clone.logger.clone(options);
		[
			"store",
			"services",
			"language"
		].forEach((m) => {
			clone[m] = this[m];
		});
		clone.services = { ...this.services };
		clone.services.utils = { hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone) };
		if (forkResourceStore) {
			clone.store = new ResourceStore(Object.keys(this.store.data).reduce((prev, l) => {
				prev[l] = { ...this.store.data[l] };
				prev[l] = Object.keys(prev[l]).reduce((acc, n) => {
					acc[n] = { ...prev[l][n] };
					return acc;
				}, prev[l]);
				return prev;
			}, {}), mergedOptions);
			clone.services.resourceStore = clone.store;
		}
		if (options.interpolation) {
			const mergedInterpolation = {
				...get().interpolation,
				...this.options.interpolation,
				...options.interpolation
			};
			const mergedForInterpolator = {
				...mergedOptions,
				interpolation: mergedInterpolation
			};
			clone.services.interpolator = new Interpolator(mergedForInterpolator);
		}
		clone.translator = new Translator(clone.services, mergedOptions);
		clone.translator.on("*", (event, ...args) => {
			clone.emit(event, ...args);
		});
		clone.init(mergedOptions, callback);
		clone.translator.options = mergedOptions;
		clone.translator.backendConnector.services.utils = { hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone) };
		return clone;
	}
	toJSON() {
		return {
			options: this.options,
			store: this.store,
			language: this.language,
			languages: this.languages,
			resolvedLanguage: this.resolvedLanguage
		};
	}
}.createInstance();
instance.createInstance;
instance.dir;
instance.init;
instance.loadResources;
instance.reloadResources;
instance.use;
instance.changeLanguage;
instance.getFixedT;
instance.t;
instance.exists;
instance.setDefaultNamespace;
instance.hasLoadedNamespace;
instance.loadNamespaces;
instance.loadLanguages;
//#endregion
//#region node_modules/.pnpm/react-i18next@17.0.8_i18next@26.3.1_typescript@7.0.2__react-dom@19.2.7_react@19.2.7__react@19.2.7_typescript@7.0.2/node_modules/react-i18next/dist/es/utils.js
var warn = (i18n, code, msg, rest) => {
	const args = [msg, {
		code,
		...rest || {}
	}];
	if (i18n?.services?.logger?.forward) return i18n.services.logger.forward(args, "warn", "react-i18next::", true);
	if (isString(args[0])) args[0] = `react-i18next:: ${args[0]}`;
	if (i18n?.services?.logger?.warn) i18n.services.logger.warn(...args);
	else if (console?.warn) console.warn(...args);
};
var alreadyWarned = {};
var warnOnce = (i18n, code, msg, rest) => {
	if (isString(msg) && alreadyWarned[msg]) return;
	if (isString(msg)) alreadyWarned[msg] = /* @__PURE__ */ new Date();
	warn(i18n, code, msg, rest);
};
var loadedClb = (i18n, cb) => () => {
	if (i18n.isInitialized) cb();
	else {
		const initialized = () => {
			setTimeout(() => {
				i18n.off("initialized", initialized);
			}, 0);
			cb();
		};
		i18n.on("initialized", initialized);
	}
};
var loadNamespaces = (i18n, ns, cb) => {
	i18n.loadNamespaces(ns, loadedClb(i18n, cb));
};
var loadLanguages = (i18n, lng, ns, cb) => {
	if (isString(ns)) ns = [ns];
	if (i18n.options.preload && i18n.options.preload.indexOf(lng) > -1) return loadNamespaces(i18n, ns, cb);
	ns.forEach((n) => {
		if (i18n.options.ns.indexOf(n) < 0) i18n.options.ns.push(n);
	});
	i18n.loadLanguages(lng, loadedClb(i18n, cb));
};
var hasLoadedNamespace = (ns, i18n, options = {}) => {
	if (!i18n.languages || !i18n.languages.length) {
		warnOnce(i18n, "NO_LANGUAGES", "i18n.languages were undefined or empty", { languages: i18n.languages });
		return true;
	}
	return i18n.hasLoadedNamespace(ns, {
		lng: options.lng,
		precheck: (i18nInstance, loadNotPending) => {
			if (options.bindI18n && options.bindI18n.indexOf("languageChanging") > -1 && i18nInstance.services.backendConnector.backend && i18nInstance.isLanguageChangingTo && !loadNotPending(i18nInstance.isLanguageChangingTo, ns)) return false;
		}
	});
};
var isString = (obj) => typeof obj === "string";
var isObject = (obj) => typeof obj === "object" && obj !== null;
//#endregion
//#region node_modules/.pnpm/react-i18next@17.0.8_i18next@26.3.1_typescript@7.0.2__react-dom@19.2.7_react@19.2.7__react@19.2.7_typescript@7.0.2/node_modules/react-i18next/dist/es/unescape.js
var matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
var htmlEntities = {
	"&amp;": "&",
	"&#38;": "&",
	"&lt;": "<",
	"&#60;": "<",
	"&gt;": ">",
	"&#62;": ">",
	"&apos;": "'",
	"&#39;": "'",
	"&quot;": "\"",
	"&#34;": "\"",
	"&nbsp;": " ",
	"&#160;": " ",
	"&copy;": "©",
	"&#169;": "©",
	"&reg;": "®",
	"&#174;": "®",
	"&hellip;": "…",
	"&#8230;": "…",
	"&#x2F;": "/",
	"&#47;": "/"
};
var unescapeHtmlEntity = (m) => htmlEntities[m];
var unescape = (text) => text.replace(matchHtmlEntity, unescapeHtmlEntity);
//#endregion
//#region node_modules/.pnpm/react-i18next@17.0.8_i18next@26.3.1_typescript@7.0.2__react-dom@19.2.7_react@19.2.7__react@19.2.7_typescript@7.0.2/node_modules/react-i18next/dist/es/defaults.js
var defaultOptions = {
	bindI18n: "languageChanged",
	bindI18nStore: "",
	transEmptyNodeValue: "",
	transSupportBasicHtmlNodes: true,
	transWrapTextNodes: "",
	transKeepBasicHtmlNodesFor: [
		"br",
		"strong",
		"i",
		"p"
	],
	useSuspense: true,
	unescape,
	transDefaultProps: void 0
};
var setDefaults = (options = {}) => {
	defaultOptions = {
		...defaultOptions,
		...options
	};
};
var getDefaults = () => defaultOptions;
//#endregion
//#region node_modules/.pnpm/react-i18next@17.0.8_i18next@26.3.1_typescript@7.0.2__react-dom@19.2.7_react@19.2.7__react@19.2.7_typescript@7.0.2/node_modules/react-i18next/dist/es/i18nInstance.js
var i18nInstance;
var setI18n = (instance) => {
	i18nInstance = instance;
};
var getI18n = () => i18nInstance;
//#endregion
//#region node_modules/.pnpm/react-i18next@17.0.8_i18next@26.3.1_typescript@7.0.2__react-dom@19.2.7_react@19.2.7__react@19.2.7_typescript@7.0.2/node_modules/react-i18next/dist/es/initReactI18next.js
var initReactI18next = {
	type: "3rdParty",
	init(instance) {
		setDefaults(instance.options.react);
		setI18n(instance);
	}
};
//#endregion
//#region node_modules/.pnpm/react-i18next@17.0.8_i18next@26.3.1_typescript@7.0.2__react-dom@19.2.7_react@19.2.7__react@19.2.7_typescript@7.0.2/node_modules/react-i18next/dist/es/context.js
var I18nContext = (0, import_react.createContext)();
var ReportNamespaces = class {
	constructor() {
		this.usedNamespaces = {};
	}
	addUsedNamespaces(namespaces) {
		namespaces.forEach((ns) => {
			if (!this.usedNamespaces[ns]) this.usedNamespaces[ns] = true;
		});
	}
	getUsedNamespaces() {
		return Object.keys(this.usedNamespaces);
	}
};
//#endregion
//#region node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.2.7/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
/**
* @license React
* use-sync-external-store-shim.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_shim_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	var useState = React.useState;
	var useEffect = React.useEffect;
	var useLayoutEffect = React.useLayoutEffect;
	var useDebugValue = React.useDebugValue;
	function useSyncExternalStore$2(subscribe, getSnapshot) {
		var value = getSnapshot(), _useState = useState({ inst: {
			value,
			getSnapshot
		} }), inst = _useState[0].inst, forceUpdate = _useState[1];
		useLayoutEffect(function() {
			inst.value = value;
			inst.getSnapshot = getSnapshot;
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
		}, [
			subscribe,
			value,
			getSnapshot
		]);
		useEffect(function() {
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			return subscribe(function() {
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			});
		}, [subscribe]);
		useDebugValue(value);
		return value;
	}
	function checkIfSnapshotChanged(inst) {
		var latestGetSnapshot = inst.getSnapshot;
		inst = inst.value;
		try {
			var nextValue = latestGetSnapshot();
			return !objectIs(inst, nextValue);
		} catch (error) {
			return !0;
		}
	}
	function useSyncExternalStore$1(subscribe, getSnapshot) {
		return getSnapshot();
	}
	var shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
	exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
}));
//#endregion
//#region node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.2.7/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
/**
* @license React
* use-sync-external-store-shim.development.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_shim_development = /* @__PURE__ */ __commonJSMin(((exports) => {
	"production" !== process.env.NODE_ENV && (function() {
		function is(x, y) {
			return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
		}
		function useSyncExternalStore$2(subscribe, getSnapshot) {
			didWarnOld18Alpha || void 0 === React.startTransition || (didWarnOld18Alpha = !0, console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
			var value = getSnapshot();
			if (!didWarnUncachedGetSnapshot) {
				var cachedValue = getSnapshot();
				objectIs(value, cachedValue) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0);
			}
			cachedValue = useState({ inst: {
				value,
				getSnapshot
			} });
			var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
			useLayoutEffect(function() {
				inst.value = value;
				inst.getSnapshot = getSnapshot;
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			}, [
				subscribe,
				value,
				getSnapshot
			]);
			useEffect(function() {
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
				return subscribe(function() {
					checkIfSnapshotChanged(inst) && forceUpdate({ inst });
				});
			}, [subscribe]);
			useDebugValue(value);
			return value;
		}
		function checkIfSnapshotChanged(inst) {
			var latestGetSnapshot = inst.getSnapshot;
			inst = inst.value;
			try {
				var nextValue = latestGetSnapshot();
				return !objectIs(inst, nextValue);
			} catch (error) {
				return !0;
			}
		}
		function useSyncExternalStore$1(subscribe, getSnapshot) {
			return getSnapshot();
		}
		"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var React = require_react(), objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = !1, didWarnUncachedGetSnapshot = !1, shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
		exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
		"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
}));
//#endregion
//#region node_modules/.pnpm/react-i18next@17.0.8_i18next@26.3.1_typescript@7.0.2__react-dom@19.2.7_react@19.2.7__react@19.2.7_typescript@7.0.2/node_modules/react-i18next/dist/es/useTranslation.js
var import_shim = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	if (process.env.NODE_ENV === "production") module.exports = require_use_sync_external_store_shim_production();
	else module.exports = require_use_sync_external_store_shim_development();
})))();
var notReadyT = (k, optsOrDefaultValue) => {
	if (isString(optsOrDefaultValue)) return optsOrDefaultValue;
	if (isObject(optsOrDefaultValue) && isString(optsOrDefaultValue.defaultValue)) return optsOrDefaultValue.defaultValue;
	if (typeof k === "function") return "";
	if (Array.isArray(k)) {
		const last = k[k.length - 1];
		return typeof last === "function" ? "" : last;
	}
	return k;
};
var notReadySnapshot = {
	t: notReadyT,
	ready: false
};
var dummySubscribe = () => () => {};
var useTranslation = (ns, props = {}) => {
	const { i18n: i18nFromProps } = props;
	const { i18n: i18nFromContext, defaultNS: defaultNSFromContext } = (0, import_react.useContext)(I18nContext) || {};
	const i18n = i18nFromProps || i18nFromContext || getI18n();
	if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();
	if (!i18n) warnOnce(i18n, "NO_I18NEXT_INSTANCE", "useTranslation: You will need to pass in an i18next instance by using initReactI18next");
	const i18nOptions = (0, import_react.useMemo)(() => ({
		...getDefaults(),
		...i18n?.options?.react,
		...props
	}), [i18n, props]);
	const { useSuspense, keyPrefix } = i18nOptions;
	const nsOrContext = ns || defaultNSFromContext || i18n?.options?.defaultNS;
	const unstableNamespaces = isString(nsOrContext) ? [nsOrContext] : nsOrContext || ["translation"];
	const namespaces = (0, import_react.useMemo)(() => unstableNamespaces, unstableNamespaces);
	i18n?.reportNamespaces?.addUsedNamespaces?.(namespaces);
	const revisionRef = (0, import_react.useRef)(0);
	const subscribe = (0, import_react.useCallback)((callback) => {
		if (!i18n) return dummySubscribe;
		const { bindI18n, bindI18nStore } = i18nOptions;
		const wrappedCallback = () => {
			revisionRef.current += 1;
			callback();
		};
		if (bindI18n) i18n.on(bindI18n, wrappedCallback);
		if (bindI18nStore) i18n.store.on(bindI18nStore, wrappedCallback);
		return () => {
			if (bindI18n) bindI18n.split(" ").forEach((e) => i18n.off(e, wrappedCallback));
			if (bindI18nStore) bindI18nStore.split(" ").forEach((e) => i18n.store.off(e, wrappedCallback));
		};
	}, [i18n, i18nOptions]);
	const snapshotRef = (0, import_react.useRef)();
	const getSnapshot = (0, import_react.useCallback)(() => {
		if (!i18n) return notReadySnapshot;
		const calculatedReady = !!(i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every((n) => hasLoadedNamespace(n, i18n, i18nOptions));
		const currentLng = props.lng || i18n.language;
		const currentRevision = revisionRef.current;
		const lastSnapshot = snapshotRef.current;
		if (lastSnapshot && lastSnapshot.ready === calculatedReady && lastSnapshot.lng === currentLng && lastSnapshot.keyPrefix === keyPrefix && lastSnapshot.revision === currentRevision) return lastSnapshot;
		const newSnapshot = {
			t: i18n.getFixedT(currentLng, i18nOptions.nsMode === "fallback" ? namespaces : namespaces[0], keyPrefix, { scopeNs: namespaces }),
			ready: calculatedReady,
			lng: currentLng,
			keyPrefix,
			revision: currentRevision
		};
		snapshotRef.current = newSnapshot;
		return newSnapshot;
	}, [
		i18n,
		namespaces,
		keyPrefix,
		i18nOptions,
		props.lng
	]);
	const [loadCount, setLoadCount] = (0, import_react.useState)(0);
	const { t, ready } = (0, import_shim.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
	(0, import_react.useEffect)(() => {
		if (i18n && !ready && !useSuspense) {
			const onLoaded = () => setLoadCount((c) => c + 1);
			if (props.lng) loadLanguages(i18n, props.lng, namespaces, onLoaded);
			else loadNamespaces(i18n, namespaces, onLoaded);
		}
	}, [
		i18n,
		props.lng,
		namespaces,
		ready,
		useSuspense,
		loadCount
	]);
	const finalI18n = i18n || {};
	const wrapperRef = (0, import_react.useRef)(null);
	const wrapperLangRef = (0, import_react.useRef)();
	const createI18nWrapper = (original) => {
		const descriptors = Object.getOwnPropertyDescriptors(original);
		if (descriptors.__original) delete descriptors.__original;
		const wrapper = Object.create(Object.getPrototypeOf(original), descriptors);
		if (!Object.prototype.hasOwnProperty.call(wrapper, "__original")) try {
			Object.defineProperty(wrapper, "__original", {
				value: original,
				writable: false,
				enumerable: false,
				configurable: false
			});
		} catch (_) {}
		return wrapper;
	};
	const ret = (0, import_react.useMemo)(() => {
		const original = finalI18n;
		const lang = original?.language;
		let i18nWrapper = original;
		if (original) if (wrapperRef.current && wrapperRef.current.__original === original) if (wrapperLangRef.current !== lang) {
			i18nWrapper = createI18nWrapper(original);
			wrapperRef.current = i18nWrapper;
			wrapperLangRef.current = lang;
		} else i18nWrapper = wrapperRef.current;
		else {
			i18nWrapper = createI18nWrapper(original);
			wrapperRef.current = i18nWrapper;
			wrapperLangRef.current = lang;
		}
		const effectiveT = !ready && !useSuspense ? (...args) => {
			warnOnce(i18n, "USE_T_BEFORE_READY", "useTranslation: t was called before ready. When using useSuspense: false, make sure to check the ready flag before using t.");
			return t(...args);
		} : t;
		const arr = [
			effectiveT,
			i18nWrapper,
			ready
		];
		arr.t = effectiveT;
		arr.i18n = i18nWrapper;
		arr.ready = ready;
		return arr;
	}, [
		t,
		finalI18n,
		ready,
		finalI18n.resolvedLanguage,
		finalI18n.language,
		finalI18n.languages
	]);
	if (i18n && useSuspense && !ready) throw new Promise((resolve) => {
		const onLoaded = () => resolve();
		if (props.lng) loadLanguages(i18n, props.lng, namespaces, onLoaded);
		else loadNamespaces(i18n, namespaces, onLoaded);
	});
	return ret;
};
//#endregion
//#region node_modules/.pnpm/react-i18next@17.0.8_i18next@26.3.1_typescript@7.0.2__react-dom@19.2.7_react@19.2.7__react@19.2.7_typescript@7.0.2/node_modules/react-i18next/dist/es/I18nextProvider.js
function I18nextProvider({ i18n, defaultNS, children }) {
	const value = (0, import_react.useMemo)(() => ({
		i18n,
		defaultNS
	}), [i18n, defaultNS]);
	return (0, import_react.createElement)(I18nContext.Provider, { value }, children);
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/localization/core-messages/en-US.js
var messages$1 = {
	"approval.alwaysAllow": "Always allow",
	"approval.alwaysAllowHint": "Approve and always allow this exact command",
	"approval.alwaysAllowAction": "Always allow this action",
	"approval.alwaysAllowActionHint": "Approve and always allow this action",
	"approval.approve": "Approve",
	"approval.approved": "Approved. Re-running {{tool}}...",
	"approval.denied": "Denied. {{tool}} did not run.",
	"approval.deny": "Deny",
	"approval.moreOptions": "More approval options",
	"approval.question": "Approve to run {{tool}}?",
	"auth.expiredDescription": "Your session may have expired. Log out and log back in to reconnect.",
	"auth.expiredTitle": "Session expired",
	"auth.logIn": "Log in",
	"auth.logOut": "Log out",
	"auth.refreshChat": "Refresh chat",
	"auth.refreshDescription": "You're signed in, but this chat connection needs to reconnect.",
	"auth.refreshTitle": "Chat session needs refresh",
	"auth.requiredDescription": "You need to log in to use the agent.",
	"auth.requiredTitle": "Authentication required",
	"commands.act": "Switch back to acting",
	"commands.available": "Available commands",
	"commands.clear": "Start a new chat (keeps current chat in history)",
	"commands.closeHelp": "Close help",
	"commands.help": "Show this list of commands",
	"commands.history": "Browse all chats",
	"commands.mention": "Mention files, agents, or resources",
	"commands.new": "Same as /clear",
	"commands.plan": "Switch to read-only planning",
	"onboarding.back": "Back",
	"onboarding.chooseRole": "Choose your role",
	"onboarding.customizeRole": "Let’s customize this for you.",
	"onboarding.roleQuestion": "What best describes your role?",
	"onboarding.roleProduct": "Product",
	"onboarding.roleDesign": "Design",
	"onboarding.roleDeveloper": "Developer",
	"onboarding.roleMarketing": "Marketing",
	"onboarding.roleSales": "Sales",
	"onboarding.roleOps": "Ops",
	"onboarding.roleIndividual": "Individual",
	"onboarding.roleOther": "Other",
	"onboarding.skipForNow": "Skip for now",
	"onboarding.saveRoleError": "Could not save your role.",
	"onboarding.builderActivateCredits": "Activate Builder.io free credits",
	"onboarding.builderConnectCredits": "Connect Builder.io free credits",
	"onboarding.builderActivateDescription": "Create or reuse your Builder.io account and activate its free credits in one click.",
	"onboarding.builderActiveCredits": "Included with active Builder.io free credits",
	"onboarding.builderCredits": "Included with Builder.io free credits",
	"onboarding.builderActivateTitle": "Activate free credits",
	"onboarding.builderAccountExistsTitle": "You already have a Builder.io account",
	"onboarding.builderAccountExistsDescription": "Log in to connect it.",
	"onboarding.builderActivationDescription": "We'll automatically create your Builder.io account for you in one click.",
	"onboarding.builderCreateAndActivate": "Create and activate",
	"onboarding.builderConsentPrefix": "By continuing, you agree to Builder.io's",
	"onboarding.builderTerms": "Terms",
	"onboarding.builderPrivacy": "Privacy",
	"onboarding.builderConsentAnd": "and",
	"onboarding.builderExistingAccount": "I have a Builder.io account",
	"onboarding.builderActivating": "Activating Builder.io free credits",
	"onboarding.builderConnecting": "Connecting Builder.io free credits",
	"onboarding.builderProvisioningDescription": "Creating or reusing your Builder.io account. This usually takes a few seconds.",
	"onboarding.builderConnectionDescription": "Finish the one-click connection in the new window.",
	"onboarding.builderReadyWithCodeChanges": "AI credits and cloud code changes are ready to use.",
	"onboarding.builderReadyCreditsOnly": "AI credits are ready to use. Cloud code edits require a Builder project in Background Agent settings.",
	"onboarding.openBackgroundAgentSettings": "Open Background Agent settings",
	"onboarding.capability.llm.keySummary": "Connect an AI provider or local model",
	"onboarding.capability.fileStorage.keySummary": "Builder storage or an S3-compatible bucket",
	"onboarding.fileStorage.title": "Choose file storage",
	"onboarding.fileStorage.description": "Choose Builder.io for managed file storage, or use custom storage keys for your own S3-compatible bucket.",
	"onboarding.fileStorage.custom": "Use custom storage keys",
	"onboarding.fileStorage.customDescription": "Configure an S3-compatible bucket with a stable public URL.",
	"onboarding.capability.voiceInput.label": "Voice input",
	"onboarding.capability.voiceInput.keySummary": "Browser speech recognition or speech-to-text",
	"onboarding.capability.voiceInput.why": "Voice input turns spoken requests into text; typing always works without it.",
	"onboarding.capability.embeddings.label": "Embeddings",
	"onboarding.capability.embeddings.keySummary": "Gemini, Cohere, or Voyage key",
	"onboarding.capability.embeddings.why": "Embeddings improve semantic search. Keyword search still works without them.",
	"onboarding.capability.assetsImageGeneration.label": "Image generation",
	"onboarding.capability.assetsImageGeneration.keySummary": "Builder credits or an image provider key",
	"onboarding.capability.assetsImageGeneration.why": "Image generation is the core workflow for creating on-brand assets.",
	"onboarding.capability.assetsVideoGeneration.label": "Video generation",
	"onboarding.capability.assetsVideoGeneration.keySummary": "Gemini API key",
	"onboarding.capability.assetsVideoGeneration.why": "Video generation is optional; the core Assets workflow is image generation.",
	"onboarding.capability.clipsObjectStorage.label": "Object storage",
	"onboarding.capability.clipsObjectStorage.keySummary": "Builder storage or an S3-compatible bucket",
	"onboarding.capability.clipsObjectStorage.why": "Recorded videos need durable object storage before they can be played back or shared.",
	"onboarding.capability.clipsTranscription.keySummary": "Speech-to-text provider key",
	"onboarding.capability.about": "About {{label}}",
	"onboarding.capability.why": "Why {{label}} is needed",
	"onboarding.openAiKeySettings": "Open AI key settings",
	"aboutAgentNative.title": "About Agent-Native",
	"aboutAgentNative.version": "Version",
	"aboutAgentNative.environment": "Environment",
	"aboutAgentNative.build": "Build",
	"aboutAgentNative.copyDiagnostics": "Copy diagnostics",
	"aboutAgentNative.unknown": "Unknown",
	"common.agent": "Agent",
	"agentPanel.mode": "Mode",
	"agentPanel.uiMode": "UI",
	"agentPanel.keyScope": "Key scope",
	"agentPanel.personalKeyScope": "Personal",
	"agentPanel.organizationKeyScope": "Organization",
	"agentPanel.personalKeyInEffect": "Your personal key is in effect.",
	"agentPanel.organizationKeyInEffect": "Organization key is in effect.",
	"agentPanel.sharedKeyInEffect": "A shared key is in effect.",
	"agentPanel.useOrganizationKey": "Use organization key",
	"agentPanel.keyStatusUnavailable": "Key status is unavailable.",
	"agentHostNudge.sidebarTitle": "Use {{agent}}'s chat",
	"agentHostNudge.sidebarDescription": "You're already chatting with {{agent}}. Ask it to work with this app directly.",
	"agentHostNudge.promptTitle": "Ask {{agent}} instead",
	"agentHostNudge.promptDescription": "You can prompt {{agent}} to create or change this here.",
	"agentHostNudge.useThisChat": "Use this chat",
	"agentHostNudge.useThisPrompt": "Use this prompt",
	"common.cancel": "Cancel",
	"common.collapse": "Collapse",
	"common.connect": "Connect",
	"common.continue": "Continue",
	"common.copied": "Copied",
	"common.copy": "Copy",
	"common.details": "Details",
	"common.dismiss": "Dismiss",
	"common.dismissError": "Dismiss error",
	"common.expand": "Expand",
	"common.loading": "Loading...",
	"common.no": "No",
	"common.retry": "Retry",
	"common.save": "Save",
	"agents.hostedAgent": "Hosted agent",
	"agents.provider": "Provider",
	"agents.providerA2A": "A2A (Foundry, Gemini, or custom)",
	"agents.providerAnthropic": "Anthropic Managed Agents",
	"agents.agentId": "Agent ID",
	"agents.agentIdPlaceholder": "agent_...",
	"agents.environmentId": "Environment ID",
	"agents.environmentIdPlaceholder": "env_...",
	"agents.apiBaseUrl": "API base URL (optional)",
	"agents.apiBaseUrlPlaceholder": "https://api.anthropic.com",
	"agents.managedAgentIncomplete": "Complete the Anthropic Managed Agents fields.",
	"agents.managedAgentCheck": "Connection is checked when you delegate from chat.",
	"agents.managedAgentSaved": "Anthropic Managed Agent saved. Delegate to it from chat.",
	"agents.cardUrl": "Agent card URL",
	"agents.cardUrlPlaceholder": "https://host.example/agent-card.json",
	"agents.authType": "Authentication",
	"agents.authNone": "No authentication",
	"agents.authBearer": "Bearer token",
	"agents.authClientCredentials": "OAuth client credentials",
	"agents.chooseCredential": "Choose credential",
	"agents.vault": "Vault",
	"agents.tokenUrl": "Token URL",
	"agents.clientId": "Client ID",
	"agents.scope": "Scope",
	"agents.authIncomplete": "Complete the hosted agent authentication fields.",
	"agents.invalidUrl": "Use HTTPS for agent URLs, except for localhost or loopback development URLs.",
	"agents.statusReachable": "Reachable",
	"agents.statusAuthRejected": "Auth rejected",
	"agents.statusNoJsonRpc": "No JSON-RPC",
	"agents.directoryTab": "Agent directory",
	"agents.directoryPageHint": "Find an agent backend and connect it to your workspace.",
	"agents.directorySearch": "Search providers",
	"agents.directoryProviders": "Providers",
	"agents.directoryManual": "Add by URL",
	"agents.directoryA2A": "A2A",
	"agents.directoryManaged": "Managed API",
	"agents.directoryFoundry": "Microsoft Foundry",
	"agents.directoryFoundryHint": "Connect a Foundry agent over A2A.",
	"agents.directoryGemini": "Gemini Enterprise",
	"agents.directoryGeminiHint": "Connect a Gemini Enterprise agent over A2A.",
	"agents.directoryAnthropic": "Anthropic Managed Agents",
	"agents.directoryAnthropicHint": "Connect sessions and approvals from Anthropic.",
	"agents.directoryNoMatches": "No providers match your search.",
	"agents.directoryRegistry": "Global A2A Registry",
	"agents.directoryRegistryHint": "Browse public Agent Cards, then verify before connecting.",
	"agents.directoryBrowse": "Browse registry",
	"common.saveFailed": "Save failed",
	"common.saveFailedStatus": "Save failed ({{status}})",
	"common.saving": "Saving...",
	"common.settings": "Settings",
	"common.waiting": "Waiting...",
	"common.yes": "Yes",
	"composer.attachmentError": "Attachment could not be processed.",
	"composer.dropToAttach": "Drop to attach",
	"composer.droppedFileError": "Could not add the dropped file. Try a different format.",
	"composer.openDesktop": "Open Desktop to use this chat.",
	"composer.removeAttachment": "Remove {{name}}",
	"composer.scrollToBottom": "Scroll to bottom",
	"composer.suggestedPrompts": "Suggested prompts",
	"composer.stopResponse": "Stop response",
	"composer.subAgentReadOnly": "Send messages to the orchestrator chat — this sub-agent runs automatically",
	"commands.clearShort": "Start a new chat",
	"commands.newShort": "Start a new chat",
	"composer.actDescription": "Use tools and make approved changes",
	"composer.activeAppContext": "Active app context",
	"composer.actMode": "Act mode",
	"composer.add": "Add...",
	"composer.addOwnKeys": "Custom keys",
	"composer.assets.closePicker": "Close image picker",
	"composer.assets.contextTitle": "Image: {{title}}",
	"composer.assets.generatedImage": "Generated image",
	"composer.assets.generateImage": "Generate image",
	"composer.assets.invalidUrl": "The configured image picker URL is not valid.",
	"composer.assets.loadingPicker": "Loading Assets picker",
	"composer.assets.openPicker": "Open Assets image picker",
	"composer.assets.openSecurely": "Open Assets in a new tab to sign in and choose an image securely.",
	"composer.assets.pickerTitle": "Assets image picker",
	"composer.auto": "Auto",
	"composer.builderModelCredits": "Free credits for Claude, OpenAI & Gemini",
	"composer.chatGptSubscription": "ChatGPT subscription",
	"composer.closePreview": "Close preview",
	"composer.configureProviderKeys": "Configure Anthropic, OpenAI, or another provider",
	"composer.connectAbove": "Connect AI above to continue...",
	"composer.connectBuilder": "Connect Builder.io",
	"composer.connectKeys": "Connect keys",
	"composer.connectingBuilder": "Connecting Builder.io…",
	"composer.costHigher": "Higher cost",
	"composer.costLower": "Lower cost",
	"composer.costMedium": "Medium cost",
	"composer.createAutomation": "Create Automation",
	"composer.createAutomationPrefix": "Create an automation: ",
	"composer.createExtension": "Create Extension",
	"composer.createExtensionPrefix": "Create an extension: ",
	"composer.createSkill": "Create Skill",
	"composer.createSkillPrefix": "Create a skill: ",
	"composer.currentDraft": "Current draft",
	"composer.defaultModel": "Default model",
	"composer.describeAutomation": "Describe what you want to automate...",
	"composer.describeExtension": "Describe the interactive extension you want to build...",
	"composer.describeSchedule": "Describe what should happen and when...",
	"composer.describeSkill": "Describe the skill you want to create...",
	"composer.documentTooLarge": "\"{{name}}\" is {{size}} MB. {{label}} are capped at {{maxSize}} MB to stay within message limits. Please reduce the file size or split it into smaller parts.",
	"composer.file": "file",
	"composer.imageModel": "Image model",
	"composer.imagePreview": "Image preview",
	"composer.loadingModels": "Loading models",
	"composer.loadingModelsProgress": "Loading models…",
	"composer.menu.createAutomation": "Create Automation",
	"composer.menu.createAutomationDescription": "Set up a when-X-do-Y rule",
	"composer.menu.createExtension": "Create Extension",
	"composer.menu.createExtensionDescription": "Build a mini app extension",
	"composer.menu.createSkill": "Create Skill",
	"composer.menu.createSkillDescription": "Teach the agent a new ability",
	"composer.menu.generateImage": "Generate Image",
	"composer.menu.generateImageDescription": "Open the Assets image picker",
	"composer.menu.integrations": "Integrations",
	"composer.menu.integrationsDescription": "Connect tools and services to the agent",
	"composer.menu.scheduleTask": "Schedule Task",
	"composer.menu.scheduleTaskDescription": "Run something on a schedule",
	"composer.menu.uploadFile": "Upload File",
	"composer.menu.uploadFileDescription": "Images, PDFs, text/code, JSON, CSV",
	"composer.messageAgent": "Message agent...",
	"composer.model": "Model",
	"composer.needsApiKey": "needs API key",
	"composer.pageTitle": "Page title",
	"composer.pastedImageError": "Could not attach the pasted image. Try a different format.",
	"composer.pastedTextError": "Could not attach the pasted text.",
	"composer.plan": "Plan",
	"composer.planDescription": "Read-only research and approval first",
	"composer.planDesktopRequired": "Open Agent-Native Desktop to use Plan mode.",
	"composer.previewAttachment": "Preview {{name}}",
	"composer.reasoning": "Reasoning",
	"composer.reasoningEffort.auto": "Auto",
	"composer.reasoningEffort.high": "High",
	"composer.reasoningEffort.low": "Low",
	"composer.reasoningEffort.max": "Max",
	"composer.reasoningEffort.medium": "Medium",
	"composer.reasoningEffort.minimal": "Minimal",
	"composer.reasoningEffort.none": "None",
	"composer.reasoningEffort.xhigh": "Extra high",
	"composer.reasoningExtraHighShort": "XHigh",
	"composer.reasoningMediumShort": "Med",
	"composer.reasoningMinimalShort": "Min",
	"composer.removeContext": "Remove {{name}} context",
	"composer.removeReference": "Remove {{name}} reference",
	"composer.route": "Route",
	"composer.scheduleTask": "Schedule Task",
	"composer.scheduleTaskPrefix": "Create a recurring job: ",
	"composer.selectedReferences": "Selected references",
	"composer.sendMessage": "Send message",
	"composer.skill.added": "Skill \"{{name}}\" added",
	"composer.skill.back": "Back",
	"composer.skill.content": "Content",
	"composer.skill.createDescription": "Describe a skill and let the agent draft it",
	"composer.skill.createNew": "Create new skill",
	"composer.skill.name": "Skill name",
	"composer.skill.review": "Review the content from {{name}} before saving.",
	"composer.skill.savedAt": "Saved at",
	"composer.skill.saveFailed": "Failed to save skill file",
	"composer.skill.selectedFile": "the selected file",
	"composer.skill.uploadDescription": "Import an existing SKILL.md file",
	"composer.skill.uploadFailedStatus": "Upload failed ({{status}})",
	"composer.skill.uploadFile": "Upload skill file",
	"composer.upload": "Upload",
	"composer.uploadFailed": "Could not upload the selected file.",
	"composer.useAttachedContext": "Use the attached context.",
	"mentions.commands": "Commands",
	"mentions.learnMore": "Learn more",
	"mentions.noResults": "No results found",
	"mentions.noSkills": "No skills available",
	"mentions.sections.agents": "Agents",
	"mentions.sections.connectedAgents": "Connected Agents",
	"mentions.sections.files": "Files",
	"mentions.sections.other": "Other",
	"mentions.skills": "Skills",
	"mentions.typeToSearch": "Type to search...",
	"pastedText.characters": "{{formattedCount}} chars",
	"pastedText.characters_one": "{{formattedCount}} char",
	"pastedText.characters_other": "{{formattedCount}} chars",
	"pastedText.lines": "{{formattedCount}} lines",
	"pastedText.lines_one": "{{formattedCount}} line",
	"pastedText.lines_other": "{{formattedCount}} lines",
	"pastedText.preview": "Preview pasted text",
	"pastedText.remove": "Remove pasted text",
	"pastedText.title": "Pasted text",
	"voice.dictation.cancel": "Cancel (Esc)",
	"voice.dictation.cancelRecording": "Cancel recording",
	"voice.dictation.start": "Dictate ({{shortcut}})",
	"voice.dictation.stopRecording": "Stop recording",
	"voice.dictation.transcribing": "Transcribing…",
	"voiceMode.connectBuilder": "Connect Builder.io",
	"voiceMode.end": "End voice mode",
	"voiceMode.entryButtonLabel": "Use microphone",
	"voiceMode.errors.channelDisconnected": "The realtime voice control channel disconnected.",
	"voiceMode.errors.connectionFailed": "The realtime voice connection failed.",
	"voiceMode.errors.connectionTimedOut": "The realtime voice connection timed out.",
	"voiceMode.errors.offerFailed": "The browser did not create an audio offer.",
	"voiceMode.errors.responseFailed": "OpenAI could not complete the voice response.",
	"voiceMode.errors.sessionFailed": "The realtime voice session encountered an error.",
	"voiceMode.errors.unsupported": "This browser does not support realtime voice conversations.",
	"voiceMode.hideChat": "Hide chat",
	"voiceMode.keepDictating": "Dictate a message",
	"voiceMode.promptDescription": "Voice mode keeps listening while the agent navigates and takes actions.",
	"voiceMode.promptTitle": "Use your voice",
	"voiceMode.rememberPreference": "Remember my preference",
	"voiceMode.settings.autoLanguage": "Auto",
	"voiceMode.settings.defaultMicrophone": "System default",
	"voiceMode.settings.intelligence": "Intelligence",
	"voiceMode.settings.intelligenceLevels.balanced": "Balanced",
	"voiceMode.settings.intelligenceLevels.deep": "Deep",
	"voiceMode.settings.intelligenceLevels.instant": "Instant",
	"voiceMode.settings.language": "Language",
	"voiceMode.settings.languages.de": "German",
	"voiceMode.settings.languages.en": "English",
	"voiceMode.settings.languages.es": "Spanish",
	"voiceMode.settings.languages.fr": "French",
	"voiceMode.settings.languages.it": "Italian",
	"voiceMode.settings.languages.ja": "Japanese",
	"voiceMode.settings.languages.ko": "Korean",
	"voiceMode.settings.languages.pt": "Portuguese",
	"voiceMode.settings.languages.zh": "Chinese",
	"voiceMode.settings.microphone": "Microphone",
	"voiceMode.settings.microphoneNumber": "Microphone {{number}}",
	"voiceMode.settings.microphoneSwitchFailed": "Could not switch microphones. Your current microphone is still active.",
	"voiceMode.settings.voiceChangePending": "Your new voice will apply next time you start voice mode.",
	"voiceMode.settings.voiceDescriptions.alloy": "Balanced and neutral",
	"voiceMode.settings.voiceDescriptions.ash": "Smooth and confident",
	"voiceMode.settings.voiceDescriptions.ballad": "Warm and expressive",
	"voiceMode.settings.voiceDescriptions.cedar": "Clear and grounded",
	"voiceMode.settings.voiceDescriptions.coral": "Friendly and bright",
	"voiceMode.settings.voiceDescriptions.echo": "Clear and direct",
	"voiceMode.settings.voiceDescriptions.marin": "Warm and natural",
	"voiceMode.settings.voiceDescriptions.sage": "Calm and thoughtful",
	"voiceMode.settings.voiceDescriptions.shimmer": "Light and upbeat",
	"voiceMode.settings.voiceDescriptions.verse": "Expressive and versatile",
	"voiceMode.settings.voiceStyle": "Voice style",
	"voiceMode.setupDescription": "Connect Builder.io to use managed voice with free credits, or add your own keys.",
	"voiceMode.setupTitle": "Set up voice mode",
	"voiceMode.showChat": "Show chat",
	"voiceMode.start": "Start voice chat",
	"voiceMode.startWithOpenAiKey": "Start with OpenAI key",
	"voiceMode.status.connecting": "Connecting",
	"voiceMode.status.ending": "Ending voice mode",
	"voiceMode.status.error": "Voice mode needs attention",
	"voiceMode.status.listening": "Listening",
	"voiceMode.status.speaking": "Speaking",
	"voiceMode.status.working": "Working",
	"voiceMode.useOpenAiKey": "Add your own keys",
	"voiceMode.voiceSettings": "Voice settings",
	"duration.hourShort": "h",
	"duration.minuteShort": "m",
	"duration.secondShort": "s",
	"empty.loadingChat": "Loading chat...",
	"empty.prompt": "How can I help you?",
	"error.afterDuration": "{{headline}} after {{duration}}",
	"error.failed": "The agent hit an error",
	"error.stopped": "The agent stopped before finishing",
	"errorMessages.agentConnection": "The agent connection was interrupted. Check your connection and retry.",
	"errorMessages.attachmentPasswordProtected": "This PDF is password-protected, so it can't be read. Remove the password protection or paste the relevant text, then retry.",
	"errorMessages.builderAuthentication": "Builder rejected the connected credentials. Reconnect Builder.io in Settings, then retry.",
	"errorMessages.builderModelUnauthorized": "The provider behind this model rejected the request. Pick a different model, then retry.",
	"errorMessages.errorPrefix": "Error: {{message}}",
	"errorMessages.gatewayInternalError": "The model gateway hit an internal error before the agent could answer. Retry in a moment, and quote the error id below if it keeps happening.",
	"errorMessages.gatewayNoDetails": "The model gateway returned no error details and the chat couldn't recover. Wait a moment and retry, or start a new chat if it keeps happening.",
	"errorMessages.creditsLimitReached": "You've reached your AI credits limit.",
	"errorMessages.inactivityTimeout": "The agent connection timed out before it could finish. You can continue from the partial work or retry.",
	"errorMessages.invalidToolSchema": "A tool schema was invalid, so the model rejected the request before it started. The invalid tool can be skipped and the request retried.",
	"errorMessages.malformedRequest": "The model provider rejected this request as malformed, so it was not retried. Retry, or start a new chat if it keeps happening.",
	"errorMessages.malformedRequestAttachment": "The model rejected an attached file, so this message was never sent. Remove the attachment and retry — a PDF, a plain-text file, or a JPEG, PNG, GIF, or WebP image is read directly; other formats have to be uploaded and linked instead.",
	"errorMessages.noProviderConnected": "No LLM provider is connected. Open Settings > Agent > AI providers, then connect Builder.io (free tier available) or add a provider key.",
	"errorMessages.openBuilderSpaceSettings": "Open Builder space settings",
	"errorMessages.providerAuthentication": "The model provider rejected the saved API key. Update the key in Settings → Integrations → API keys, then retry.",
	"errorMessages.providerConfiguration": "This model can't use tools with the current settings. Switch models in Settings, then retry.",
	"errorMessages.providerHtml": "The provider returned an HTML error page.",
	"errorMessages.providerNetwork": "The model provider could not be reached. Check your connection and retry.",
	"errorMessages.providerRateLimit": "The model provider is rate-limiting this chat right now. Wait a moment, then retry.",
	"errorMessages.providerTransientRejection": "The AI provider temporarily refused this request. This usually clears within a minute — retry.",
	"errorMessages.startNewChat": "Start new chat",
	"errorMessages.upgradeAtBuilder": "Upgrade at Builder.io",
	"feedback.inaccurate": "Inaccurate",
	"feedback.keyboardHint": "{{shortcut}} Enter to send",
	"feedback.notHelpful": "Not helpful",
	"feedback.placeholder": "Tell us what went wrong...",
	"feedback.submit": "Submit",
	"feedback.submitted": "Feedback submitted",
	"feedback.thumbsDown": "Thumbs down",
	"feedback.thumbsUp": "Thumbs up",
	"feedback.tooSlow": "Too slow",
	"feedback.whatWentWrong": "What went wrong?",
	"feedback.wrongTool": "Wrong tool",
	"header.switchToCli": "Switch to CLI",
	"history.active": "Active",
	"history.empty": "No chats yet",
	"history.loadOlder": "Load older chats",
	"history.noMatches": "No matching chats",
	"history.open": "Open",
	"history.pinned": "Pinned",
	"history.search": "Search chats...",
	"history.searching": "Searching...",
	"history.untitledChat": "Chat",
	"history.yesterday": "Yesterday",
	"integrations.availableSection": "Available integrations",
	"integrations.connectedSection": "Connected",
	"integrations.goToApiKeys": "Go to API keys",
	"integrations.goToIntegrations": "Go to Integrations",
	"integrations.lookingForApiKeys": "Looking for an API key instead?",
	"integrations.lookingForProviders": "Looking for OAuth or MCP providers?",
	"integrations.manage": "Manage",
	"integrations.recommended": "Recommended",
	"integrations.subtitle": "Connect the tools your agent can use.",
	"limit.account": "your account",
	"limit.descriptionAll": "The agent used all available steps. Keep going in a fresh turn, or raise the {{scope}} limit first.",
	"limit.descriptionWithCount": "The agent used {{formattedCount}} steps. Keep going in a fresh turn, or raise the {{scope}} limit first.",
	"limit.descriptionWithCount_one": "The agent used {{formattedCount}} step. Keep going in a fresh turn, or raise the {{scope}} limit first.",
	"limit.descriptionWithCount_other": "The agent used {{formattedCount}} steps. Keep going in a fresh turn, or raise the {{scope}} limit first.",
	"limit.keepGoing": "Keep going",
	"limit.maxSteps": "Max steps",
	"limit.namedOrganization": "{{organization}} organization",
	"limit.organization": "organization",
	"limit.ownerOnly": "Only organization owners and admins can change this limit.",
	"limit.reached": "Step limit reached",
	"limit.saveAndContinue": "Save and keep going",
	"message.actions": "Message actions",
	"message.copyMessage": "Copy message",
	"message.copyRequestId": "Copy request ID",
	"message.requestIdUnavailable": "Request ID unavailable",
	"message.edit": "Edit message",
	"message.forkChat": "Fork chat",
	"message.missingFinal": "The agent stopped without sending a final message. Ask it to continue or retry.",
	"message.messages": "Messages",
	"message.nextBranch": "Next branch",
	"message.noRestoreRun": "This message has no run to restore to.",
	"message.previousBranch": "Previous branch",
	"message.regenerate": "Regenerate response",
	"message.restoreFailed": "Restore failed ({{status}}).",
	"message.restoreQuestion": "Restore to here?",
	"message.restoreRequestFailed": "Restore request failed.",
	"message.threadNotFound": "This chat thread is no longer available. Start a new chat or retry if this was unexpected.",
	"message.restoring": "Restoring...",
	"message.revertHere": "Revert to here",
	"message.sentAt": "Sent {{time}}",
	"contextMeter.ariaLabel": "Context {{percent}}%, {{totalTokens}}{{breakdown}}. Open Context X-Ray.",
	"contextMeter.breakdown": " total: {{systemTokens}} system + {{conversationTokens}} conversation",
	"contextMeter.summary": "Context {{percent}}% · {{totalTokens}}",
	"contextMeter.summaryBreakdown": " ({{systemTokens}} system + {{conversationTokens}} conversation)",
	"contextXray.advisory": "advisory",
	"contextXray.conversation": "{{count}} conversation",
	"contextXray.currentStatus": "current status",
	"contextXray.estimated": "estimated",
	"contextXray.estimatedPrefix": " estimated",
	"contextXray.estimatedSuffix": " · estimated",
	"contextXray.evict": "Evict",
	"contextXray.evicted": "{{count}} evicted",
	"contextXray.evictSegment": "Evict segment",
	"contextXray.framework": "framework",
	"contextXray.free": "{{count}} free",
	"contextXray.governance.inherited": "Inherited",
	"contextXray.governance.required": "Required",
	"contextXray.governance.user": "Your context",
	"contextXray.groups.conversation": "Conversation",
	"contextXray.groups.evicted": "Evicted",
	"contextXray.groups.filesRead": "Files read",
	"contextXray.groups.pinned": "Pinned",
	"contextXray.groups.taskInstructions": "Task & instructions",
	"contextXray.groups.thinking": "Thinking",
	"contextXray.groups.toolResults": "Tool results",
	"contextXray.inspect": "Inspect {{name}}",
	"contextXray.list": "List",
	"contextXray.loading": "Loading context...",
	"contextXray.map": "Map",
	"contextXray.messageIndex": "message index",
	"contextXray.noActiveSegments": "No active segments",
	"contextXray.panelTitle": "Context X-Ray",
	"contextXray.partIndex": "part index",
	"contextXray.pin": "Pin",
	"contextXray.pinned": "{{count}} pinned",
	"contextXray.pinSegment": "Pin segment",
	"contextXray.protectedDescription": "This segment is part of the active turn and cannot be evicted yet.",
	"contextXray.protectedDuringTurn": "Protected during active turn",
	"contextXray.recordEvictionIntent": "Record eviction intent",
	"contextXray.restore": "Restore",
	"contextXray.restoreSegment": "Restore segment",
	"contextXray.segment": "Segment",
	"contextXray.showList": "Show context list",
	"contextXray.showMap": "Show context map",
	"contextXray.status.active": "Active",
	"contextXray.status.evicted": "Evicted",
	"contextXray.status.pinned": "Pinned",
	"contextXray.status.protected": "Protected",
	"contextXray.status.summarized": "Summarized",
	"contextXray.system": "{{count}} system",
	"contextXray.systemOrdered": "System · ordered, not evictable",
	"contextXray.tokens": "tokens",
	"contextXray.tokensShare": "tokens · {{share}}%",
	"contextXray.unpin": "Unpin",
	"contextXray.unpinSegment": "Unpin segment",
	"plan.act": "Act",
	"plan.implement": "Implement",
	"plan.mode": "Plan mode",
	"plan.ready": "Plan ready",
	"plan.switchToAct": "Switch to Act mode",
	"queue.count": "{{count}} queued",
	"queue.followUp": "Send a follow-up...",
	"queue.followUpWithCount": "{{count}} queued — send a follow-up...",
	"queue.remove": "Remove from queue",
	"queue.sendNow": "Send now",
	"queue.sendNowHint": "Send now (stops the current response)",
	"queue.steer": "Steer",
	"queue.steerHint": "Send this message next",
	"queue.moreActions": "More actions",
	"queue.moveToTop": "Move to top",
	"recovery.connectingBuilder": "Connecting Builder.io",
	"recovery.copyDebug": "Copy debug",
	"recovery.copyFailed": "Copy failed",
	"recovery.credentialRejected": "The current Builder.io or model-provider credential was rejected. Reconnect Builder.io, then retry this message.",
	"recovery.diagnoseRetry": "Diagnose and retry",
	"recovery.forkDescription": "Fork this conversation into a separate chat thread.",
	"recovery.forkFailed": "Could not fork this chat. Try starting a new chat.",
	"recovery.forking": "Forking...",
	"recovery.newChatHint": "If retry lands on the same error, start a new chat session and continue from what already changed.",
	"recovery.backgroundTimeout": "The previous background agent run reached its time limit before finishing. The partial work was preserved; continue or retry to pick up from here.",
	"recovery.noProgress": "The previous agent run stopped producing visible progress during recovery, so it was stopped before it could keep looping.",
	"recovery.statusCheckFailed": "Couldn't reach the server to check whether the agent is still working. Send your message again to retry.",
	"recovery.streamEnded": "The previous agent stream ended while the run was recovering. Continue or retry to reconnect to the run.",
	"recovery.reconnectBuilder": "Reconnect Builder.io",
	"secrets.addCustomKeyNamed": "Add “{{name}}” as a custom key",
	"secrets.chooseKey": "Choose a key",
	"secrets.customKey": "Custom key",
	"secrets.customKeyHint": "Add any key by name",
	"secrets.emptyHint": "Add a key to use your own accounts.",
	"secrets.emptyMore": "and {{count}} more under New, or add any custom key",
	"secrets.emptyTitle": "No keys yet.",
	"secrets.fromEnvironment": "Provided by the deployment environment.",
	"secrets.managedInVault": "Managed in the workspace Vault. Every app in this workspace uses this value.",
	"secrets.openVault": "Open Vault",
	"secrets.newKey": "New",
	"secrets.noKeysFound": "No keys found.",
	"secrets.overridesVault": "This personal key overrides the workspace Vault value. Remove it to use the Vault key.",
	"secrets.overridesWorkspace": "This personal key overrides the workspace value. Remove it to use the shared key.",
	"secrets.setForWorkspace": "Set for everyone in this workspace.",
	"secrets.sourceEnvironment": "Environment",
	"secrets.sourceVault": "Vault",
	"secrets.sourceWorkspace": "Workspace",
	"secrets.statusUnavailable": "Unavailable",
	"secrets.required": "Required",
	"secrets.searchKeys": "Search keys...",
	"secrets.usePersonalKey": "Use a personal key instead",
	"selection.attached": "{{formattedCount}} characters of selection attached",
	"selection.attached_one": "{{formattedCount}} character of selection attached",
	"selection.attached_other": "{{formattedCount}} characters of selection attached",
	"selection.clear": "Clear selection context",
	"setup.addOwnKeys": "Add your own keys",
	"setup.builderCredits": "Builder.io includes free credits, or use your own API key.",
	"setup.builderOrOwnKeys": "Use Builder.io (free credits), or add your own provider keys.",
	"setup.connectAi": "Connect AI",
	"setup.connectBuilder": "Connect Builder.io",
	"setup.connectPlaceholder": "Connect AI to start chatting...",
	"setup.connectToChat": "Connect AI to chat",
	"setup.connectToStart": "Connect AI to start chatting",
	"setup.connected": "Connected",
	"setup.connectedOrganization": "Connected — {{organization}}",
	"setup.connectedTo": "Connected to {{organization}}",
	"setup.freeCredits": "Free credits for LLM, hosting, and more — no API key needed",
	"setup.keyProvider": "API key provider",
	"setup.keySaveFailed": "Could not save the key.",
	"setup.storedSecurely": "Stored securely for this app only.",
	"share.add": "Add",
	"share.addPeopleEmail": "Add people by email",
	"share.addPeopleOrganization": "Add people from your organization",
	"share.admin": "Admin",
	"share.adminDescription": "Can edit and manage access",
	"share.commenter": "Commenter",
	"share.commenterDescription": "Can view and add comments",
	"share.advanced": "Advanced",
	"share.advancedAccess": "Advanced access",
	"share.advancedDescription": "Control how organization access appears in search.",
	"share.copied": "Copied",
	"share.copy": "Copy",
	"share.shareWithAgents": "Share with agents",
	"share.agentContext": "Agent context link",
	"share.agentContextDescription": "Read-only context for an external agent.",
	"share.preparingAgentLink": "Preparing agent link...",
	"share.agentLinkUnavailable": "Couldn't create the agent link.",
	"share.retryAgentLink": "Retry",
	"share.editor": "Editor",
	"share.editorDescription": "Can edit",
	"share.generalAccess": "General access",
	"share.hideInSearch": "Hide in search",
	"share.linkCanStillOpen": "People with the link can still open this.",
	"share.loading": "Loading...",
	"share.loadMore": "Load more",
	"share.loadFailed": "Couldn't load sharing settings.",
	"share.loadPeopleFailed": "Could not load people.",
	"share.noAccess": "No one has access yet.",
	"share.noMatches": "No matches.",
	"share.noPeopleFound": "No people found.",
	"share.notifyPeople": "Notify people",
	"share.message": "Message",
	"share.addMessage": "Add a message",
	"share.hideMessage": "Hide message",
	"share.messagePlaceholder": "Add a short note (optional)",
	"share.organization": "Organization",
	"share.organizationDescription": "Anyone in your organization can view",
	"share.owner": "Owner",
	"share.peopleWithAccess": "People with access",
	"share.private": "Private",
	"share.privateDescription": "Only people with access can view",
	"share.public": "Public",
	"share.publicDescription": "Anyone with the link can view",
	"share.remove": "Remove",
	"share.role": "Role",
	"share.searching": "Searching...",
	"share.share": "Share",
	"share.shareLink": "Share link",
	"share.shareOptions": "Share options",
	"share.titleWithResource": "Share \"{{title}}\"",
	"share.titleWithType": "Share {{type}}",
	"share.triggerWithVisibility": "Share ({{visibility}})",
	"share.unknownPerson": "Unknown person",
	"share.viewer": "Viewer",
	"share.viewerDescription": "Can view",
	"share.userGroup": "User group",
	"status.resuming": "Resuming",
	"status.stillWorking": "Still working",
	"status.thinking": "Thinking",
	"status.working": "Working",
	"shell.chat": "Chat",
	"shell.loadingTerminal": "Loading terminal...",
	"shell.toggleAgent": "Toggle agent",
	"status.contactingModel": "Contacting model",
	"status.starting": "Starting {{activity}}...",
	"status.preparing": "Preparing {{activity}}...",
	"status.writing": "Writing {{activity}}...",
	"status.stillGenerating": "Still generating {{activity}}",
	"tabs.allChats": "All chats",
	"tabs.closeTab": "Close tab",
	"tabs.main": "Main",
	"tabs.newChat": "New chat",
	"tabs.subAgent": "Sub-agent...",
	"tool.askedAgent": "Asked {{agent}}",
	"tool.askingAgent": "Asking {{agent}}...",
	"tool.elapsed": "{{duration}} elapsed",
	"tool.askingAgentFailed": "Error asking {{agent}}",
	"tool.input": "Input",
	"tool.inputWithLabel": "Input - {{label}}",
	"tool.interrupted": "Interrupted before this finished reporting — it may or may not have completed. Check before retrying.",
	"tool.longRunning": "Still working. Large updates can take a minute or two.",
	"tool.ranTools": "Ran {{count}} tools",
	"tool.ranTools_one": "Ran {{count}} tool",
	"tool.ranTools_other": "Ran {{count}} tools",
	"tool.rawOutput": "Raw {{tool}} tool call output",
	"tool.repeated": "Repeated {{count}} times",
	"tool.result": "Result",
	"tool.subAgentTask": "Sub-agent task",
	"thinking.collapsed": "Collapsed",
	"thinking.display": "Thinking",
	"thinking.expanded": "Expanded",
	"thinking.hidden": "Hidden",
	"tool.thought": "Thought",
	"tool.thoughtFor": "Thought for {{duration}}",
	"tool.viewOutput": "View {{tool}} output",
	"tool.worked": "Worked",
	"tool.workedFor": "Worked for {{duration}}",
	"widget.chart": "Chart",
	"widget.dataChart": "Data chart",
	"widget.dataInsights": "Data insights",
	"widget.dataTable": "Data table",
	"widget.downloadCsv": "Download CSV",
	"widget.connectProvider": "Connect {{provider}}",
	"widget.loadingToolResult": "Loading tool result",
	"widget.noRows": "No rows",
	"widget.points": "{{formattedCount}} points",
	"widget.points_one": "{{formattedCount}} point",
	"widget.points_other": "{{formattedCount}} points",
	"widget.rows": "{{formattedCount}} rows",
	"widget.rows_one": "{{formattedCount}} row",
	"widget.rows_other": "{{formattedCount}} rows",
	"widget.sampled": "sampled",
	"settings.emailTitle": "Email",
	"settings.emailChange": "Change email",
	"settings.emailChanging": "Sending...",
	"settings.emailChangeSent": "Check your email for instructions to confirm this change.",
	"settings.emailChangeError": "Could not send confirmation.",
	"settings.emailNewLabel": "New email",
	"settings.emailNewPlaceholder": "Enter new email"
};
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/localization/shared.js
var SUPPORTED_LOCALES = [
	"en-US",
	"es-ES",
	"fr-FR",
	"de-DE",
	"pt-BR",
	"zh-CN",
	"zh-TW",
	"ja-JP",
	"ko-KR",
	"hi-IN",
	"ar-SA"
];
var DEFAULT_LOCALE = "en-US";
var LOCALE_STORAGE_KEY = "agent-native:locale-preference";
var LOCALE_HYDRATION_GLOBAL = "__AGENT_NATIVE_LOCALE__";
var LOCALE_METADATA = {
	"en-US": {
		code: "en-US",
		englishName: "English",
		nativeName: "English",
		dir: "ltr"
	},
	"zh-CN": {
		code: "zh-CN",
		englishName: "Chinese (Simplified)",
		nativeName: "简体中文",
		dir: "ltr"
	},
	"zh-TW": {
		code: "zh-TW",
		englishName: "Chinese (Traditional, Taiwan)",
		nativeName: "繁體中文",
		dir: "ltr"
	},
	"es-ES": {
		code: "es-ES",
		englishName: "Spanish",
		nativeName: "Español",
		dir: "ltr"
	},
	"fr-FR": {
		code: "fr-FR",
		englishName: "French",
		nativeName: "Français",
		dir: "ltr"
	},
	"de-DE": {
		code: "de-DE",
		englishName: "German",
		nativeName: "Deutsch",
		dir: "ltr"
	},
	"ja-JP": {
		code: "ja-JP",
		englishName: "Japanese",
		nativeName: "日本語",
		dir: "ltr"
	},
	"ko-KR": {
		code: "ko-KR",
		englishName: "Korean",
		nativeName: "한국어",
		dir: "ltr"
	},
	"pt-BR": {
		code: "pt-BR",
		englishName: "Portuguese (Brazil)",
		nativeName: "Português (Brasil)",
		dir: "ltr"
	},
	"hi-IN": {
		code: "hi-IN",
		englishName: "Hindi",
		nativeName: "हिन्दी",
		dir: "ltr"
	},
	"ar-SA": {
		code: "ar-SA",
		englishName: "Arabic",
		nativeName: "العربية",
		dir: "rtl"
	}
};
function localeMetadataFor(locale, metadata = LOCALE_METADATA) {
	return metadata[locale] ?? LOCALE_METADATA[locale] ?? {
		code: locale,
		englishName: locale,
		nativeName: locale,
		dir: "ltr"
	};
}
var SUPPORTED_LOCALE_SET = new Set(SUPPORTED_LOCALES);
var CHINESE_LOCALE_ALIASES = {
	"zh-cn": "zh-CN",
	"zh-hans": "zh-CN",
	"zh-hans-cn": "zh-CN",
	"zh-hans-sg": "zh-CN",
	"zh-hant": "zh-TW",
	"zh-hant-hk": "zh-TW",
	"zh-hant-mo": "zh-TW",
	"zh-hant-tw": "zh-TW",
	"zh-hk": "zh-TW",
	"zh-mo": "zh-TW",
	"zh-sg": "zh-CN",
	"zh-tw": "zh-TW"
};
function normalizeChineseLocaleAlias(canonical) {
	const normalized = canonical.toLowerCase();
	const alias = CHINESE_LOCALE_ALIASES[normalized];
	if (alias) return alias;
	const parts = normalized.split("-");
	if (parts[0] !== "zh") return null;
	if (parts.includes("hant") || parts.includes("tw") || parts.includes("hk") || parts.includes("mo")) return "zh-TW";
	if (parts.includes("hans") || parts.includes("cn") || parts.includes("sg")) return "zh-CN";
	return null;
}
function isLocaleCode(value) {
	return typeof value === "string" && SUPPORTED_LOCALE_SET.has(value);
}
function canonicalizeLocaleCode(value) {
	if (typeof value !== "string" || value.trim().length === 0) return null;
	try {
		return Intl.getCanonicalLocales(value.trim())[0] ?? null;
	} catch {
		return null;
	}
}
function isValidLocaleCode(value) {
	return canonicalizeLocaleCode(value) !== null;
}
/**
* Resolve a locale against an app's registered list. The default list keeps
* existing callers restricted to the framework's built-in locales.
*/
function normalizeLocaleCode(value, supportedLocales = SUPPORTED_LOCALES) {
	const canonical = canonicalizeLocaleCode(value);
	if (!canonical) return null;
	const canonicalSupported = supportedLocales.map((locale) => canonicalizeLocaleCode(locale)).filter((locale) => locale !== null);
	const exact = canonicalSupported.find((locale) => locale === canonical);
	if (exact) return exact;
	const alias = normalizeChineseLocaleAlias(canonical);
	if (alias && canonicalSupported.includes(alias)) return alias;
	const language = canonical.split("-")[0]?.toLowerCase();
	return canonicalSupported.find((locale) => locale.split("-")[0]?.toLowerCase() === language) ?? null;
}
function normalizeLocalePreference(value, supportedLocales) {
	if (value === "system") return "system";
	const canonical = canonicalizeLocaleCode(value);
	if (!canonical) return null;
	return normalizeLocaleCode(canonical, supportedLocales ?? SUPPORTED_LOCALES) ?? (supportedLocales ? null : canonical);
}
function normalizeTimezonePreference(value) {
	if (typeof value !== "string") return "system";
	const trimmed = value.trim();
	if (!trimmed || trimmed === "system") return "system";
	try {
		new Intl.DateTimeFormat("en-US", { timeZone: trimmed });
	} catch {
		return "system";
	}
	return trimmed;
}
function normalizeLocalizationPreference(value, supportedLocales) {
	if (value && typeof value === "object" && !Array.isArray(value)) {
		const record = value;
		return {
			locale: normalizeLocalePreference(record.locale, supportedLocales) ?? "system",
			timezone: normalizeTimezonePreference(record.timezone)
		};
	}
	return {
		locale: normalizeLocalePreference(value, supportedLocales) ?? "system",
		timezone: "system"
	};
}
function localeDirection(locale, metadata = LOCALE_METADATA) {
	return localeMetadataFor(locale, metadata).dir;
}
function resolveLocaleFromCandidates(candidates, supportedLocales = SUPPORTED_LOCALES) {
	for (const candidate of candidates) {
		const normalized = normalizeLocaleCode(candidate, supportedLocales);
		if (normalized) return normalized;
	}
	return normalizeLocaleCode(supportedLocales[0], supportedLocales) ?? "en-US";
}
function resolveLocaleFromPreference(preference, systemCandidates = [], supportedLocales = SUPPORTED_LOCALES) {
	const normalized = typeof preference === "string" ? normalizeLocalePreference(preference, supportedLocales) : normalizeLocalizationPreference(preference, supportedLocales).locale;
	if (normalized && normalized !== "system") return normalizeLocaleCode(normalized, supportedLocales) ?? resolveLocaleFromCandidates(systemCandidates, supportedLocales);
	return resolveLocaleFromCandidates(systemCandidates, supportedLocales);
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/localization/environment-badge-messages.js
var ENVIRONMENT_BADGE_MESSAGES = {
	"en-US": {
		betaLabel: "beta",
		betaTitle: "You're on Agent-Native {{label}}",
		productionTitle: "You're on Agent-Native Production",
		continuePrompt: "Choose where you want to continue.",
		switchToProduction: "Switch to production",
		goToBeta: "Go to beta",
		hideBadge: "Hide badge",
		openSwitcher: "Open {{title}} switcher",
		localDevelopment: "Local development environment",
		development: "Development environment"
	},
	"es-ES": {
		betaLabel: "beta",
		betaTitle: "Estás en Agent-Native {{label}}",
		productionTitle: "Estás en Agent-Native Production",
		continuePrompt: "Elige dónde quieres continuar.",
		switchToProduction: "Cambiar a producción",
		goToBeta: "Ir a beta",
		hideBadge: "Ocultar insignia",
		openSwitcher: "Abrir el selector de {{title}}",
		localDevelopment: "Entorno de desarrollo local",
		development: "Entorno de desarrollo"
	},
	"fr-FR": {
		betaLabel: "bêta",
		betaTitle: "Vous êtes sur Agent-Native {{label}}",
		productionTitle: "Vous êtes sur Agent-Native Production",
		continuePrompt: "Choisissez où continuer.",
		switchToProduction: "Passer en production",
		goToBeta: "Accéder à la bêta",
		hideBadge: "Masquer le badge",
		openSwitcher: "Ouvrir le sélecteur {{title}}",
		localDevelopment: "Environnement de développement local",
		development: "Environnement de développement"
	},
	"de-DE": {
		betaLabel: "beta",
		betaTitle: "Du verwendest Agent-Native {{label}}",
		productionTitle: "Du verwendest Agent-Native Production",
		continuePrompt: "Wähle aus, wo du fortfahren möchtest.",
		switchToProduction: "Zur Produktionsumgebung wechseln",
		goToBeta: "Zur Beta wechseln",
		hideBadge: "Badge ausblenden",
		openSwitcher: "{{title}}-Umschalter öffnen",
		localDevelopment: "Lokale Entwicklungsumgebung",
		development: "Entwicklungsumgebung"
	},
	"pt-BR": {
		betaLabel: "beta",
		betaTitle: "Você está no Agent-Native {{label}}",
		productionTitle: "Você está no Agent-Native Production",
		continuePrompt: "Escolha onde deseja continuar.",
		switchToProduction: "Mudar para produção",
		goToBeta: "Ir para beta",
		hideBadge: "Ocultar selo",
		openSwitcher: "Abrir o seletor de {{title}}",
		localDevelopment: "Ambiente de desenvolvimento local",
		development: "Ambiente de desenvolvimento"
	},
	"zh-CN": {
		betaLabel: "测试版",
		betaTitle: "你正在使用 Agent-Native {{label}}",
		productionTitle: "你正在使用 Agent-Native 正式版",
		continuePrompt: "选择要继续使用的环境。",
		switchToProduction: "切换到正式版",
		goToBeta: "前往测试版",
		hideBadge: "隐藏标记",
		openSwitcher: "打开 {{title}} 切换器",
		localDevelopment: "本地开发环境",
		development: "开发环境"
	},
	"zh-TW": {
		betaLabel: "測試版",
		betaTitle: "你目前正在使用 Agent-Native {{label}}",
		productionTitle: "你目前正在使用 Agent-Native 正式版",
		continuePrompt: "選擇要繼續使用的環境。",
		switchToProduction: "切換至正式版",
		goToBeta: "前往測試版",
		hideBadge: "隱藏標記",
		openSwitcher: "開啟 {{title}} 切換器",
		localDevelopment: "本機開發環境",
		development: "開發環境"
	},
	"ja-JP": {
		betaLabel: "ベータ",
		betaTitle: "Agent-Native {{label}}を使用中です",
		productionTitle: "Agent-Native 本番環境を使用中です",
		continuePrompt: "続行する環境を選択してください。",
		switchToProduction: "本番環境に切り替え",
		goToBeta: "ベータ版へ移動",
		hideBadge: "バッジを非表示",
		openSwitcher: "{{title}}切り替えを開く",
		localDevelopment: "ローカル開発環境",
		development: "開発環境"
	},
	"ko-KR": {
		betaLabel: "베타",
		betaTitle: "Agent-Native {{label}}를 사용 중입니다",
		productionTitle: "Agent-Native 프로덕션을 사용 중입니다",
		continuePrompt: "계속할 환경을 선택하세요.",
		switchToProduction: "프로덕션으로 전환",
		goToBeta: "베타로 이동",
		hideBadge: "배지 숨기기",
		openSwitcher: "{{title}} 전환기 열기",
		localDevelopment: "로컬 개발 환경",
		development: "개발 환경"
	},
	"hi-IN": {
		betaLabel: "बीटा",
		betaTitle: "आप Agent-Native {{label}} पर हैं",
		productionTitle: "आप Agent-Native प्रोडक्शन पर हैं",
		continuePrompt: "चुनें कि आप कहाँ जारी रखना चाहते हैं।",
		switchToProduction: "प्रोडक्शन पर स्विच करें",
		goToBeta: "बीटा पर जाएँ",
		hideBadge: "बैज छिपाएँ",
		openSwitcher: "{{title}} स्विचर खोलें",
		localDevelopment: "स्थानीय विकास परिवेश",
		development: "विकास परिवेश"
	},
	"ar-SA": {
		betaLabel: "بيتا",
		betaTitle: "أنت على إصدار Agent-Native {{label}}",
		productionTitle: "أنت على إصدار Agent-Native للإنتاج",
		continuePrompt: "اختر أين تريد المتابعة.",
		switchToProduction: "التبديل إلى إصدار الإنتاج",
		goToBeta: "الانتقال إلى الإصدار التجريبي",
		hideBadge: "إخفاء الشارة",
		openSwitcher: "فتح مُبدّل {{title}}",
		localDevelopment: "بيئة التطوير المحلية",
		development: "بيئة التطوير"
	}
};
function environmentBadgeMessagesForLocale(locale) {
	return ENVIRONMENT_BADGE_MESSAGES[isLocaleCode(locale) ? locale : DEFAULT_LOCALE];
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/localization/mcp-settings-messages.js
var MCP_CONNECT_MESSAGES = {
	"en-US": {
		pageTitle: "Connect {appName}",
		authorizeLabel: "Authorize {appName}",
		terminalTitle: "Authorize {appName} from your terminal?",
		assistantTitle: "Use {appName} from your AI assistant",
		signedInAs: "Signed in as",
		deviceCode: "Device code",
		guidesLabel: "MCP URL guides",
		advancedOptions: "Advanced options",
		labelOptional: "Label (optional)",
		labelPlaceholder: "e.g. Claude Code on my laptop",
		expiresInDays: "Expires in (days, 1–365)",
		terminalAlternative: "Terminal alternative",
		existingConnections: "Existing connections",
		checkingConnections: "Checking connections...",
		unavailable: "Unavailable",
		couldNotLoadConnections: "Could not load connections.",
		emptyConnections: "Created connections will appear here for revoking later.",
		unlabeled: "(unlabeled)",
		lastUsed: "last used",
		revoked: "Revoked",
		created: "Created",
		revoke: "Revoke",
		couldNotRevoke: "Could not revoke token.",
		authorizeDevice: "Authorize device",
		createToken: "Create connection token",
		authorizingDevice: "Authorizing device...",
		creatingToken: "Creating token...",
		couldNotAuthorize: "Could not authorize this device code.",
		unknownDeviceCode: "This device code isn't recognized. Restart the connection from your terminal.",
		expiredDeviceCode: "This device code has expired. Restart the connection from your terminal.",
		alreadyUsedDeviceCode: "This device code was already used. Restart the connection from your terminal.",
		finishingConnection: "Finishing connection… you can return to your terminal.",
		deviceAuthorized: "Device authorized",
		connected: "Connected",
		connectedDescription: "This device can now act as you — manage or revoke it below.",
		couldNotCreate: "Could not create token.",
		networkError: "Network error. Please try again.",
		urlTitle: "Your MCP URL"
	},
	"es-ES": {
		pageTitle: "Conectar {appName}",
		authorizeLabel: "Autorizar {appName}",
		terminalTitle: "¿Autorizar {appName} desde tu terminal?",
		assistantTitle: "Usa {appName} desde tu asistente de IA",
		signedInAs: "Sesión iniciada como",
		deviceCode: "Código del dispositivo",
		guidesLabel: "Guías de URL de MCP",
		advancedOptions: "Opciones avanzadas",
		labelOptional: "Etiqueta (opcional)",
		labelPlaceholder: "p. ej., Claude Code en mi portátil",
		expiresInDays: "Caduca en (días, 1–365)",
		terminalAlternative: "Alternativa para la terminal",
		existingConnections: "Conexiones existentes",
		checkingConnections: "Comprobando conexiones...",
		unavailable: "No disponible",
		couldNotLoadConnections: "No se pudieron cargar las conexiones.",
		emptyConnections: "Las conexiones creadas aparecerán aquí para revocarlas más adelante.",
		unlabeled: "(sin etiqueta)",
		lastUsed: "último uso",
		revoked: "Revocado",
		created: "Creado",
		revoke: "Revocar",
		couldNotRevoke: "No se pudo revocar el token.",
		authorizeDevice: "Autorizar dispositivo",
		createToken: "Crear token de conexión",
		authorizingDevice: "Autorizando dispositivo...",
		creatingToken: "Creando token...",
		couldNotAuthorize: "No se pudo autorizar este código de dispositivo.",
		unknownDeviceCode: "No se reconoce este código de dispositivo. Reinicia la conexión desde tu terminal.",
		expiredDeviceCode: "Este código de dispositivo ha caducado. Reinicia la conexión desde tu terminal.",
		alreadyUsedDeviceCode: "Este código de dispositivo ya se usó. Reinicia la conexión desde tu terminal.",
		finishingConnection: "Terminando la conexión… puedes volver a tu terminal.",
		deviceAuthorized: "Dispositivo autorizado",
		connected: "Conectado",
		connectedDescription: "Este dispositivo ya puede actuar como tú; puedes administrarlo o revocarlo abajo.",
		couldNotCreate: "No se pudo crear el token.",
		networkError: "Error de red. Inténtalo de nuevo.",
		urlTitle: "Tu URL de MCP"
	},
	"fr-FR": {
		pageTitle: "Connecter {appName}",
		authorizeLabel: "Autoriser {appName}",
		terminalTitle: "Autoriser {appName} depuis votre terminal ?",
		assistantTitle: "Utiliser {appName} depuis votre assistant IA",
		signedInAs: "Connecté en tant que",
		deviceCode: "Code de l’appareil",
		guidesLabel: "Guides d’URL MCP",
		advancedOptions: "Options avancées",
		labelOptional: "Libellé (facultatif)",
		labelPlaceholder: "ex. Claude Code sur mon ordinateur portable",
		expiresInDays: "Expire dans (jours, 1–365)",
		terminalAlternative: "Alternative terminal",
		existingConnections: "Connexions existantes",
		checkingConnections: "Vérification des connexions...",
		unavailable: "Indisponible",
		couldNotLoadConnections: "Impossible de charger les connexions.",
		emptyConnections: "Les connexions créées apparaîtront ici pour être révoquées plus tard.",
		unlabeled: "(sans libellé)",
		lastUsed: "dernière utilisation",
		revoked: "Révoqué",
		created: "Créé",
		revoke: "Révoquer",
		couldNotRevoke: "Impossible de révoquer le jeton.",
		authorizeDevice: "Autoriser l’appareil",
		createToken: "Créer un jeton de connexion",
		authorizingDevice: "Autorisation de l’appareil...",
		creatingToken: "Création du jeton...",
		couldNotAuthorize: "Impossible d’autoriser ce code d’appareil.",
		unknownDeviceCode: "Ce code d’appareil n’est pas reconnu. Recommencez la connexion depuis votre terminal.",
		expiredDeviceCode: "Ce code d’appareil a expiré. Recommencez la connexion depuis votre terminal.",
		alreadyUsedDeviceCode: "Ce code d’appareil a déjà été utilisé. Recommencez la connexion depuis votre terminal.",
		finishingConnection: "Connexion en cours… vous pouvez retourner à votre terminal.",
		deviceAuthorized: "Appareil autorisé",
		connected: "Connecté",
		connectedDescription: "Cet appareil peut maintenant agir en votre nom. Gérez-le ou révoquez-le ci-dessous.",
		couldNotCreate: "Impossible de créer le jeton.",
		networkError: "Erreur réseau. Réessayez.",
		urlTitle: "Votre URL MCP"
	},
	"de-DE": {
		pageTitle: "{appName} verbinden",
		authorizeLabel: "{appName} autorisieren",
		terminalTitle: "{appName} über dein Terminal autorisieren?",
		assistantTitle: "{appName} mit deinem KI-Assistenten verwenden",
		signedInAs: "Angemeldet als",
		deviceCode: "Gerätecode",
		guidesLabel: "MCP-URL-Anleitungen",
		advancedOptions: "Erweiterte Optionen",
		labelOptional: "Bezeichnung (optional)",
		labelPlaceholder: "z. B. Claude Code auf meinem Laptop",
		expiresInDays: "Läuft ab in (Tagen, 1–365)",
		terminalAlternative: "Terminal-Alternative",
		existingConnections: "Vorhandene Verbindungen",
		checkingConnections: "Verbindungen werden geprüft...",
		unavailable: "Nicht verfügbar",
		couldNotLoadConnections: "Verbindungen konnten nicht geladen werden.",
		emptyConnections: "Erstellte Verbindungen werden hier angezeigt, damit du sie später widerrufen kannst.",
		unlabeled: "(ohne Bezeichnung)",
		lastUsed: "zuletzt verwendet",
		revoked: "Widerrufen",
		created: "Erstellt",
		revoke: "Widerrufen",
		couldNotRevoke: "Token konnte nicht widerrufen werden.",
		authorizeDevice: "Gerät autorisieren",
		createToken: "Verbindungstoken erstellen",
		authorizingDevice: "Gerät wird autorisiert...",
		creatingToken: "Token wird erstellt...",
		couldNotAuthorize: "Dieser Gerätecode konnte nicht autorisiert werden.",
		unknownDeviceCode: "Dieser Gerätecode wurde nicht erkannt. Starte die Verbindung in deinem Terminal neu.",
		expiredDeviceCode: "Dieser Gerätecode ist abgelaufen. Starte die Verbindung in deinem Terminal neu.",
		alreadyUsedDeviceCode: "Dieser Gerätecode wurde bereits verwendet. Starte die Verbindung in deinem Terminal neu.",
		finishingConnection: "Verbindung wird abgeschlossen… du kannst zu deinem Terminal zurückkehren.",
		deviceAuthorized: "Gerät autorisiert",
		connected: "Verbunden",
		connectedDescription: "Dieses Gerät kann jetzt in deinem Namen handeln. Verwalte oder widerrufe es unten.",
		couldNotCreate: "Token konnte nicht erstellt werden.",
		networkError: "Netzwerkfehler. Bitte versuche es erneut.",
		urlTitle: "Deine MCP-URL"
	},
	"pt-BR": {
		pageTitle: "Conectar {appName}",
		authorizeLabel: "Autorizar {appName}",
		terminalTitle: "Autorizar {appName} pelo seu terminal?",
		assistantTitle: "Usar {appName} pelo seu assistente de IA",
		signedInAs: "Sessão iniciada como",
		deviceCode: "Código do dispositivo",
		guidesLabel: "Guias de URL MCP",
		advancedOptions: "Opções avançadas",
		labelOptional: "Rótulo (opcional)",
		labelPlaceholder: "ex.: Claude Code no meu laptop",
		expiresInDays: "Expira em (dias, 1–365)",
		terminalAlternative: "Alternativa pelo terminal",
		existingConnections: "Conexões existentes",
		checkingConnections: "Verificando conexões...",
		unavailable: "Indisponível",
		couldNotLoadConnections: "Não foi possível carregar as conexões.",
		emptyConnections: "As conexões criadas aparecerão aqui para revogação posterior.",
		unlabeled: "(sem rótulo)",
		lastUsed: "último uso",
		revoked: "Revogado",
		created: "Criado",
		revoke: "Revogar",
		couldNotRevoke: "Não foi possível revogar o token.",
		authorizeDevice: "Autorizar dispositivo",
		createToken: "Criar token de conexão",
		authorizingDevice: "Autorizando dispositivo...",
		creatingToken: "Criando token...",
		couldNotAuthorize: "Não foi possível autorizar este código de dispositivo.",
		unknownDeviceCode: "Este código de dispositivo não foi reconhecido. Reinicie a conexão pelo terminal.",
		expiredDeviceCode: "Este código de dispositivo expirou. Reinicie a conexão pelo terminal.",
		alreadyUsedDeviceCode: "Este código de dispositivo já foi usado. Reinicie a conexão pelo terminal.",
		finishingConnection: "Concluindo a conexão… você pode voltar ao seu terminal.",
		deviceAuthorized: "Dispositivo autorizado",
		connected: "Conectado",
		connectedDescription: "Este dispositivo agora pode agir por você. Gerencie ou revogue-o abaixo.",
		couldNotCreate: "Não foi possível criar o token.",
		networkError: "Erro de rede. Tente novamente.",
		urlTitle: "Sua URL MCP"
	},
	"zh-CN": {
		pageTitle: "连接 {appName}",
		authorizeLabel: "授权 {appName}",
		terminalTitle: "要从终端授权 {appName} 吗？",
		assistantTitle: "通过 AI 助手使用 {appName}",
		signedInAs: "已登录为",
		deviceCode: "设备代码",
		guidesLabel: "MCP URL 指南",
		advancedOptions: "高级选项",
		labelOptional: "标签（可选）",
		labelPlaceholder: "例如：我笔记本上的 Claude Code",
		expiresInDays: "有效期（天，1–365）",
		terminalAlternative: "终端替代方案",
		existingConnections: "现有连接",
		checkingConnections: "正在检查连接...",
		unavailable: "不可用",
		couldNotLoadConnections: "无法加载连接。",
		emptyConnections: "创建的连接会显示在这里，方便稍后撤销。",
		unlabeled: "（无标签）",
		lastUsed: "上次使用",
		revoked: "已撤销",
		created: "已创建",
		revoke: "撤销",
		couldNotRevoke: "无法撤销令牌。",
		authorizeDevice: "授权设备",
		createToken: "创建连接令牌",
		authorizingDevice: "正在授权设备...",
		creatingToken: "正在创建令牌...",
		couldNotAuthorize: "无法授权此设备代码。",
		unknownDeviceCode: "无法识别此设备代码。请从终端重新开始连接。",
		expiredDeviceCode: "此设备代码已过期。请从终端重新开始连接。",
		alreadyUsedDeviceCode: "此设备代码已使用过。请从终端重新开始连接。",
		finishingConnection: "正在完成连接…你可以返回终端。",
		deviceAuthorized: "设备已授权",
		connected: "已连接",
		connectedDescription: "此设备现在可以代表你操作，你可以在下方管理或撤销它。",
		couldNotCreate: "无法创建令牌。",
		networkError: "网络错误。请重试。",
		urlTitle: "你的 MCP URL"
	},
	"zh-TW": {
		pageTitle: "連線 {appName}",
		authorizeLabel: "授權 {appName}",
		terminalTitle: "要從終端機授權 {appName} 嗎？",
		assistantTitle: "透過 AI 助理使用 {appName}",
		signedInAs: "已登入為",
		deviceCode: "裝置代碼",
		guidesLabel: "MCP URL 指南",
		advancedOptions: "進階選項",
		labelOptional: "標籤（選填）",
		labelPlaceholder: "例如：我筆記型電腦上的 Claude Code",
		expiresInDays: "有效期限（天，1–365）",
		terminalAlternative: "終端機替代方案",
		existingConnections: "現有連線",
		checkingConnections: "正在檢查連線...",
		unavailable: "無法使用",
		couldNotLoadConnections: "無法載入連線。",
		emptyConnections: "建立的連線會顯示在這裡，方便稍後撤銷。",
		unlabeled: "（無標籤）",
		lastUsed: "上次使用",
		revoked: "已撤銷",
		created: "已建立",
		revoke: "撤銷",
		couldNotRevoke: "無法撤銷權杖。",
		authorizeDevice: "授權裝置",
		createToken: "建立連線權杖",
		authorizingDevice: "正在授權裝置...",
		creatingToken: "正在建立權杖...",
		couldNotAuthorize: "無法授權此裝置代碼。",
		unknownDeviceCode: "無法辨識此裝置代碼。請從終端機重新開始連線。",
		expiredDeviceCode: "此裝置代碼已過期。請從終端機重新開始連線。",
		alreadyUsedDeviceCode: "此裝置代碼已使用過。請從終端機重新開始連線。",
		finishingConnection: "正在完成連線…你可以返回終端機。",
		deviceAuthorized: "裝置已授權",
		connected: "已連線",
		connectedDescription: "此裝置現在可以代表你操作，你可以在下方管理或撤銷它。",
		couldNotCreate: "無法建立權杖。",
		networkError: "網路錯誤。請再試一次。",
		urlTitle: "你的 MCP URL"
	},
	"ja-JP": {
		pageTitle: "{appName} に接続",
		authorizeLabel: "{appName} を承認",
		terminalTitle: "ターミナルから {appName} を承認しますか？",
		assistantTitle: "AI アシスタントで {appName} を使う",
		signedInAs: "ログイン中のアカウント:",
		deviceCode: "デバイスコード",
		guidesLabel: "MCP URL ガイド",
		advancedOptions: "詳細設定",
		labelOptional: "ラベル（任意）",
		labelPlaceholder: "例: ノートパソコンの Claude Code",
		expiresInDays: "有効期限（日数、1–365）",
		terminalAlternative: "ターミナルでの代替方法",
		existingConnections: "既存の接続",
		checkingConnections: "接続を確認中...",
		unavailable: "利用できません",
		couldNotLoadConnections: "接続を読み込めませんでした。",
		emptyConnections: "作成した接続は、後で取り消せるようここに表示されます。",
		unlabeled: "（ラベルなし）",
		lastUsed: "最終使用",
		revoked: "取り消し済み",
		created: "作成済み",
		revoke: "取り消す",
		couldNotRevoke: "トークンを取り消せませんでした。",
		authorizeDevice: "デバイスを承認",
		createToken: "接続トークンを作成",
		authorizingDevice: "デバイスを承認中...",
		creatingToken: "トークンを作成中...",
		couldNotAuthorize: "このデバイスコードを承認できませんでした。",
		unknownDeviceCode: "このデバイスコードは認識されません。ターミナルから接続をやり直してください。",
		expiredDeviceCode: "このデバイスコードは期限切れです。ターミナルから接続をやり直してください。",
		alreadyUsedDeviceCode: "このデバイスコードはすでに使用されています。ターミナルから接続をやり直してください。",
		finishingConnection: "接続を完了しています…ターミナルに戻ることができます。",
		deviceAuthorized: "デバイスを承認しました",
		connected: "接続済み",
		connectedDescription: "このデバイスはあなたの代わりに操作できます。下で管理または取り消しができます。",
		couldNotCreate: "トークンを作成できませんでした。",
		networkError: "ネットワークエラーです。もう一度お試しください。",
		urlTitle: "MCP URL"
	},
	"ko-KR": {
		pageTitle: "{appName} 연결",
		authorizeLabel: "{appName} 승인",
		terminalTitle: "터미널에서 {appName}을(를) 승인하시겠습니까?",
		assistantTitle: "AI 도우미에서 {appName} 사용",
		signedInAs: "로그인 계정",
		deviceCode: "기기 코드",
		guidesLabel: "MCP URL 안내",
		advancedOptions: "고급 옵션",
		labelOptional: "라벨(선택사항)",
		labelPlaceholder: "예: 내 노트북의 Claude Code",
		expiresInDays: "만료 기간(일, 1–365)",
		terminalAlternative: "터미널 대안",
		existingConnections: "기존 연결",
		checkingConnections: "연결 확인 중...",
		unavailable: "사용할 수 없음",
		couldNotLoadConnections: "연결을 불러올 수 없습니다.",
		emptyConnections: "생성된 연결이 나중에 취소할 수 있도록 여기에 표시됩니다.",
		unlabeled: "(라벨 없음)",
		lastUsed: "마지막 사용",
		revoked: "취소됨",
		created: "생성됨",
		revoke: "취소",
		couldNotRevoke: "토큰을 취소할 수 없습니다.",
		authorizeDevice: "기기 승인",
		createToken: "연결 토큰 생성",
		authorizingDevice: "기기 승인 중...",
		creatingToken: "토큰 생성 중...",
		couldNotAuthorize: "이 기기 코드를 승인할 수 없습니다.",
		unknownDeviceCode: "이 기기 코드를 인식할 수 없습니다. 터미널에서 연결을 다시 시작하세요.",
		expiredDeviceCode: "이 기기 코드가 만료되었습니다. 터미널에서 연결을 다시 시작하세요.",
		alreadyUsedDeviceCode: "이 기기 코드는 이미 사용되었습니다. 터미널에서 연결을 다시 시작하세요.",
		finishingConnection: "연결을 완료하는 중… 터미널로 돌아가도 됩니다.",
		deviceAuthorized: "기기 승인됨",
		connected: "연결됨",
		connectedDescription: "이 기기는 이제 사용자를 대신해 작업할 수 있습니다. 아래에서 관리하거나 취소하세요.",
		couldNotCreate: "토큰을 생성할 수 없습니다.",
		networkError: "네트워크 오류입니다. 다시 시도하세요.",
		urlTitle: "MCP URL"
	},
	"hi-IN": {
		pageTitle: "{appName} कनेक्ट करें",
		authorizeLabel: "{appName} को अनुमति दें",
		terminalTitle: "अपने terminal से {appName} को अनुमति दें?",
		assistantTitle: "अपने AI assistant से {appName} का उपयोग करें",
		signedInAs: "इस रूप में साइन इन",
		deviceCode: "डिवाइस कोड",
		guidesLabel: "MCP URL गाइड",
		advancedOptions: "उन्नत विकल्प",
		labelOptional: "लेबल (वैकल्पिक)",
		labelPlaceholder: "उदाहरण: मेरे laptop पर Claude Code",
		expiresInDays: "समाप्ति (दिन, 1–365)",
		terminalAlternative: "Terminal विकल्प",
		existingConnections: "मौजूदा कनेक्शन",
		checkingConnections: "कनेक्शन जाँचे जा रहे हैं...",
		unavailable: "उपलब्ध नहीं",
		couldNotLoadConnections: "कनेक्शन लोड नहीं किए जा सके।",
		emptyConnections: "बाद में revoke करने के लिए बनाए गए कनेक्शन यहाँ दिखेंगे।",
		unlabeled: "(बिना लेबल)",
		lastUsed: "अंतिम उपयोग",
		revoked: "Revoke किया गया",
		created: "बनाया गया",
		revoke: "Revoke करें",
		couldNotRevoke: "Token revoke नहीं किया जा सका।",
		authorizeDevice: "डिवाइस को अनुमति दें",
		createToken: "कनेक्शन token बनाएँ",
		authorizingDevice: "डिवाइस को अनुमति दी जा रही है...",
		creatingToken: "Token बनाया जा रहा है...",
		couldNotAuthorize: "इस डिवाइस कोड को अनुमति नहीं दी जा सकी।",
		unknownDeviceCode: "यह डिवाइस कोड पहचाना नहीं गया। अपने टर्मिनल से कनेक्शन फिर शुरू करें।",
		expiredDeviceCode: "यह डिवाइस कोड समाप्त हो गया है। अपने टर्मिनल से कनेक्शन फिर शुरू करें।",
		alreadyUsedDeviceCode: "यह डिवाइस कोड पहले ही इस्तेमाल हो चुका है। अपने टर्मिनल से कनेक्शन फिर शुरू करें।",
		finishingConnection: "कनेक्शन पूरा हो रहा है… आप terminal पर लौट सकते हैं।",
		deviceAuthorized: "डिवाइस को अनुमति दी गई",
		connected: "कनेक्टेड",
		connectedDescription: "यह डिवाइस अब आपकी ओर से काम कर सकता है। नीचे इसे manage या revoke करें।",
		couldNotCreate: "Token बनाया नहीं जा सका।",
		networkError: "Network error. फिर से कोशिश करें।",
		urlTitle: "आपका MCP URL"
	},
	"ar-SA": {
		pageTitle: "الاتصال بـ {appName}",
		authorizeLabel: "تخويل {appName}",
		terminalTitle: "هل تريد تخويل {appName} من الطرفية؟",
		assistantTitle: "استخدم {appName} من مساعد الذكاء الاصطناعي",
		signedInAs: "تم تسجيل الدخول باسم",
		deviceCode: "رمز الجهاز",
		guidesLabel: "أدلة عنوان MCP",
		advancedOptions: "خيارات متقدمة",
		labelOptional: "التسمية (اختيارية)",
		labelPlaceholder: "مثال: Claude Code على حاسوبي المحمول",
		expiresInDays: "تنتهي الصلاحية خلال (أيام، 1–365)",
		terminalAlternative: "بديل الطرفية",
		existingConnections: "الاتصالات الحالية",
		checkingConnections: "جارٍ التحقق من الاتصالات...",
		unavailable: "غير متاح",
		couldNotLoadConnections: "تعذر تحميل الاتصالات.",
		emptyConnections: "ستظهر الاتصالات التي أنشأتها هنا لإلغائها لاحقًا.",
		unlabeled: "(بلا تسمية)",
		lastUsed: "آخر استخدام",
		revoked: "تم الإلغاء",
		created: "تم الإنشاء",
		revoke: "إلغاء",
		couldNotRevoke: "تعذر إلغاء الرمز.",
		authorizeDevice: "تخويل الجهاز",
		createToken: "إنشاء رمز اتصال",
		authorizingDevice: "جارٍ تخويل الجهاز...",
		creatingToken: "جارٍ إنشاء الرمز...",
		couldNotAuthorize: "تعذر تخويل رمز الجهاز هذا.",
		unknownDeviceCode: "لم يتم التعرف على رمز الجهاز هذا. أعد بدء الاتصال من جهازك الطرفي.",
		expiredDeviceCode: "انتهت صلاحية رمز الجهاز هذا. أعد بدء الاتصال من جهازك الطرفي.",
		alreadyUsedDeviceCode: "تم استخدام رمز الجهاز هذا من قبل. أعد بدء الاتصال من جهازك الطرفي.",
		finishingConnection: "جارٍ إنهاء الاتصال… يمكنك العودة إلى الطرفية.",
		deviceAuthorized: "تم تخويل الجهاز",
		connected: "متصل",
		connectedDescription: "يمكن لهذا الجهاز الآن التصرف نيابةً عنك. يمكنك إدارته أو إلغاءه أدناه.",
		couldNotCreate: "تعذر إنشاء الرمز.",
		networkError: "حدث خطأ في الشبكة. حاول مرة أخرى.",
		urlTitle: "عنوان MCP الخاص بك"
	}
};
var MCP_SETTINGS_MESSAGES = {
	"en-US": {
		mcpTitle: "MCP",
		mcpDescription: "Connect this app to Claude, ChatGPT, Cursor, Codex, or another MCP host.",
		mcpUrlLabel: "MCP server URL",
		mcpUrlHint: "Copy this URL into the AI host you want to use. The canonical path is /mcp.",
		mcpOpenDocs: "Open MCP connection docs",
		a2aAgentCard: "A2A agent card",
		a2aOpenDocs: "Open A2A documentation",
		mcpClientSetup: "Connect an AI host",
		mcpClientSetupDescription: "Choose a host for step-by-step setup, or paste the URL into any MCP-compatible client.",
		mcpChooseAssistant: "Choose your AI assistant",
		mcpCommand: "Command",
		mcpConfig: "MCP config",
		mcpCopy: "Copy",
		mcpCopied: "Copied",
		mcpStaticTokenDescription: "Open the full connect page to create a token for clients that cannot complete OAuth.",
		mcpOpenConnectPage: "Open full connect page",
		mcpConnect: MCP_CONNECT_MESSAGES["en-US"]
	},
	"es-ES": {
		mcpTitle: "MCP",
		mcpDescription: "Conecta esta app con Claude, ChatGPT, Cursor, Codex u otro host MCP.",
		mcpUrlLabel: "URL del servidor MCP",
		mcpUrlHint: "Copia esta URL en el host de IA que quieras usar. La ruta canónica es /mcp.",
		mcpOpenDocs: "Abrir documentación de conexión MCP",
		a2aAgentCard: "Tarjeta de agente A2A",
		a2aOpenDocs: "Abrir documentación de A2A",
		mcpClientSetup: "Conectar un host de IA",
		mcpClientSetupDescription: "Elige un host para ver instrucciones paso a paso o pega la URL en cualquier cliente compatible con MCP.",
		mcpChooseAssistant: "Elige tu asistente de IA",
		mcpCommand: "Comando",
		mcpConfig: "Configuración MCP",
		mcpCopy: "Copiar",
		mcpCopied: "Copiado",
		mcpStaticTokenDescription: "Abre la página completa de conexión para crear un token para clientes que no pueden completar OAuth.",
		mcpOpenConnectPage: "Abrir página completa de conexión",
		mcpConnect: MCP_CONNECT_MESSAGES["es-ES"]
	},
	"fr-FR": {
		mcpTitle: "MCP",
		mcpDescription: "Connectez cette app à Claude, ChatGPT, Cursor, Codex ou un autre hôte MCP.",
		mcpUrlLabel: "URL du serveur MCP",
		mcpUrlHint: "Copiez cette URL dans l’hôte IA de votre choix. Le chemin canonique est /mcp.",
		mcpOpenDocs: "Ouvrir la documentation de connexion MCP",
		a2aAgentCard: "Carte d’agent A2A",
		a2aOpenDocs: "Ouvrir la documentation A2A",
		mcpClientSetup: "Connecter un hôte IA",
		mcpClientSetupDescription: "Choisissez un hôte pour obtenir une configuration pas à pas, ou collez l’URL dans n’importe quel client compatible MCP.",
		mcpChooseAssistant: "Choisissez votre assistant IA",
		mcpCommand: "Commande",
		mcpConfig: "Configuration MCP",
		mcpCopy: "Copier",
		mcpCopied: "Copié",
		mcpStaticTokenDescription: "Ouvrez la page complète de connexion pour créer un jeton pour les clients qui ne peuvent pas terminer OAuth.",
		mcpOpenConnectPage: "Ouvrir la page complète de connexion",
		mcpConnect: MCP_CONNECT_MESSAGES["fr-FR"]
	},
	"de-DE": {
		mcpTitle: "MCP",
		mcpDescription: "Verbinde diese App mit Claude, ChatGPT, Cursor, Codex oder einem anderen MCP-Host.",
		mcpUrlLabel: "MCP-Server-URL",
		mcpUrlHint: "Kopiere diese URL in den gewünschten KI-Host. Der kanonische Pfad ist /mcp.",
		mcpOpenDocs: "MCP-Verbindungsdokumentation öffnen",
		a2aAgentCard: "A2A-Agentenkarte",
		a2aOpenDocs: "A2A-Dokumentation öffnen",
		mcpClientSetup: "Einen KI-Host verbinden",
		mcpClientSetupDescription: "Wähle einen Host für eine Schritt-für-Schritt-Einrichtung oder füge die URL in einen beliebigen MCP-kompatiblen Client ein.",
		mcpChooseAssistant: "Deinen KI-Assistenten auswählen",
		mcpCommand: "Befehl",
		mcpConfig: "MCP-Konfiguration",
		mcpCopy: "Kopieren",
		mcpCopied: "Kopiert",
		mcpStaticTokenDescription: "Öffne die vollständige Verbindungsseite, um ein Token für Clients zu erstellen, die OAuth nicht abschließen können.",
		mcpOpenConnectPage: "Vollständige Verbindungsseite öffnen",
		mcpConnect: MCP_CONNECT_MESSAGES["de-DE"]
	},
	"pt-BR": {
		mcpTitle: "MCP",
		mcpDescription: "Conecte este app ao Claude, ChatGPT, Cursor, Codex ou outro host MCP.",
		mcpUrlLabel: "URL do servidor MCP",
		mcpUrlHint: "Copie esta URL para o host de IA que deseja usar. O caminho canônico é /mcp.",
		mcpOpenDocs: "Abrir documentação de conexão MCP",
		a2aAgentCard: "Cartão do agente A2A",
		a2aOpenDocs: "Abrir documentação do A2A",
		mcpClientSetup: "Conectar um host de IA",
		mcpClientSetupDescription: "Escolha um host para ver a configuração passo a passo ou cole a URL em qualquer cliente compatível com MCP.",
		mcpChooseAssistant: "Escolha seu assistente de IA",
		mcpCommand: "Comando",
		mcpConfig: "Configuração MCP",
		mcpCopy: "Copiar",
		mcpCopied: "Copiado",
		mcpStaticTokenDescription: "Abra a página completa de conexão para criar um token para clientes que não conseguem concluir o OAuth.",
		mcpOpenConnectPage: "Abrir página completa de conexão",
		mcpConnect: MCP_CONNECT_MESSAGES["pt-BR"]
	},
	"zh-CN": {
		mcpTitle: "MCP",
		mcpDescription: "将此应用连接到 Claude、ChatGPT、Cursor、Codex 或其他 MCP 主机。",
		mcpUrlLabel: "MCP 服务器 URL",
		mcpUrlHint: "将此 URL 复制到你要使用的 AI 主机中。规范路径为 /mcp。",
		mcpOpenDocs: "打开 MCP 连接文档",
		a2aAgentCard: "A2A 代理卡",
		a2aOpenDocs: "打开 A2A 文档",
		mcpClientSetup: "连接 AI 主机",
		mcpClientSetupDescription: "选择一个主机查看分步设置，或将 URL 粘贴到任何兼容 MCP 的客户端。",
		mcpChooseAssistant: "选择你的 AI 助手",
		mcpCommand: "命令",
		mcpConfig: "MCP 配置",
		mcpCopy: "复制",
		mcpCopied: "已复制",
		mcpStaticTokenDescription: "打开完整连接页面，为无法完成 OAuth 的客户端创建令牌。",
		mcpOpenConnectPage: "打开完整连接页面",
		mcpConnect: MCP_CONNECT_MESSAGES["zh-CN"]
	},
	"zh-TW": {
		mcpTitle: "MCP",
		mcpDescription: "將此應用程式連線到 Claude、ChatGPT、Cursor、Codex 或其他 MCP 主機。",
		mcpUrlLabel: "MCP 伺服器 URL",
		mcpUrlHint: "將此 URL 複製到你要使用的 AI 主機中。標準路徑為 /mcp。",
		mcpOpenDocs: "開啟 MCP 連線文件",
		a2aAgentCard: "A2A 代理程式卡片",
		a2aOpenDocs: "開啟 A2A 文件",
		mcpClientSetup: "連線 AI 主機",
		mcpClientSetupDescription: "選擇主機查看逐步設定，或將 URL 貼到任何相容 MCP 的用戶端。",
		mcpChooseAssistant: "選擇你的 AI 助理",
		mcpCommand: "指令",
		mcpConfig: "MCP 設定",
		mcpCopy: "複製",
		mcpCopied: "已複製",
		mcpStaticTokenDescription: "開啟完整連線頁面，為無法完成 OAuth 的用戶端建立權杖。",
		mcpOpenConnectPage: "開啟完整連線頁面",
		mcpConnect: MCP_CONNECT_MESSAGES["zh-TW"]
	},
	"ja-JP": {
		mcpTitle: "MCP",
		mcpDescription: "このアプリを Claude、ChatGPT、Cursor、Codex、その他の MCP ホストに接続します。",
		mcpUrlLabel: "MCP サーバー URL",
		mcpUrlHint: "この URL を使用する AI ホストにコピーします。標準パスは /mcp です。",
		mcpOpenDocs: "MCP 接続ドキュメントを開く",
		a2aAgentCard: "A2A エージェントカード",
		a2aOpenDocs: "A2A ドキュメントを開く",
		mcpClientSetup: "AI ホストを接続",
		mcpClientSetupDescription: "ホストを選ぶと手順に沿って設定できます。または、MCP 対応クライアントに URL を貼り付けます。",
		mcpChooseAssistant: "AI アシスタントを選択",
		mcpCommand: "コマンド",
		mcpConfig: "MCP 設定",
		mcpCopy: "コピー",
		mcpCopied: "コピーしました",
		mcpStaticTokenDescription: "完全な接続ページを開いて、OAuth を完了できないクライアント用のトークンを作成します。",
		mcpOpenConnectPage: "完全な接続ページを開く",
		mcpConnect: MCP_CONNECT_MESSAGES["ja-JP"]
	},
	"ko-KR": {
		mcpTitle: "MCP",
		mcpDescription: "이 앱을 Claude, ChatGPT, Cursor, Codex 또는 다른 MCP 호스트에 연결합니다.",
		mcpUrlLabel: "MCP 서버 URL",
		mcpUrlHint: "사용할 AI 호스트에 이 URL을 복사하세요. 표준 경로는 /mcp입니다.",
		mcpOpenDocs: "MCP 연결 문서 열기",
		a2aAgentCard: "A2A 에이전트 카드",
		a2aOpenDocs: "A2A 문서 열기",
		mcpClientSetup: "AI 호스트 연결",
		mcpClientSetupDescription: "호스트를 선택하면 단계별 설정을 확인할 수 있고, 모든 MCP 호환 클라이언트에 URL을 붙여 넣을 수도 있습니다.",
		mcpChooseAssistant: "AI 도우미 선택",
		mcpCommand: "명령",
		mcpConfig: "MCP 구성",
		mcpCopy: "복사",
		mcpCopied: "복사됨",
		mcpStaticTokenDescription: "전체 연결 페이지를 열어 OAuth를 완료할 수 없는 클라이언트용 토큰을 만드세요.",
		mcpOpenConnectPage: "전체 연결 페이지 열기",
		mcpConnect: MCP_CONNECT_MESSAGES["ko-KR"]
	},
	"hi-IN": {
		mcpTitle: "MCP",
		mcpDescription: "इस ऐप को Claude, ChatGPT, Cursor, Codex या किसी अन्य MCP host से कनेक्ट करें।",
		mcpUrlLabel: "MCP server URL",
		mcpUrlHint: "इस URL को उस AI host में कॉपी करें जिसका आप उपयोग करना चाहते हैं। मानक पथ /mcp है।",
		mcpOpenDocs: "MCP कनेक्शन दस्तावेज़ खोलें",
		a2aAgentCard: "A2A agent card",
		a2aOpenDocs: "A2A दस्तावेज़ खोलें",
		mcpClientSetup: "AI host कनेक्ट करें",
		mcpClientSetupDescription: "चरण-दर-चरण सेटअप के लिए कोई host चुनें या किसी भी MCP-compatible client में URL पेस्ट करें।",
		mcpChooseAssistant: "अपना AI assistant चुनें",
		mcpCommand: "कमांड",
		mcpConfig: "MCP config",
		mcpCopy: "कॉपी करें",
		mcpCopied: "कॉपी हो गया",
		mcpStaticTokenDescription: "पूरी कनेक्शन पेज खोलकर उन clients के लिए token बनाएँ जो OAuth पूरा नहीं कर सकते।",
		mcpOpenConnectPage: "पूरी कनेक्शन पेज खोलें",
		mcpConnect: MCP_CONNECT_MESSAGES["hi-IN"]
	},
	"ar-SA": {
		mcpTitle: "MCP",
		mcpDescription: "صِل هذا التطبيق بـ Claude أو ChatGPT أو Cursor أو Codex أو أي مضيف MCP آخر.",
		mcpUrlLabel: "عنوان خادم MCP",
		mcpUrlHint: "انسخ هذا العنوان إلى مضيف الذكاء الاصطناعي الذي تريد استخدامه. المسار القياسي هو /mcp.",
		mcpOpenDocs: "فتح مستندات اتصال MCP",
		a2aAgentCard: "بطاقة وكيل A2A",
		a2aOpenDocs: "فتح وثائق A2A",
		mcpClientSetup: "توصيل مضيف ذكاء اصطناعي",
		mcpClientSetupDescription: "اختر مضيفًا لإعداد خطوة بخطوة، أو الصق العنوان في أي عميل متوافق مع MCP.",
		mcpChooseAssistant: "اختر مساعد الذكاء الاصطناعي",
		mcpCommand: "الأمر",
		mcpConfig: "إعداد MCP",
		mcpCopy: "نسخ",
		mcpCopied: "تم النسخ",
		mcpStaticTokenDescription: "افتح صفحة الاتصال الكاملة لإنشاء رمز مميز للعملاء الذين لا يستطيعون إكمال OAuth.",
		mcpOpenConnectPage: "فتح صفحة الاتصال الكاملة",
		mcpConnect: MCP_CONNECT_MESSAGES["ar-SA"]
	}
};
function mcpSettingsMessagesForLocale(locale) {
	return MCP_SETTINGS_MESSAGES[locale] ?? MCP_SETTINGS_MESSAGES["en-US"];
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/localization/core-messages.js
var englishAgentChatMessages = messages$1;
var legacyAgentChatAliases = [
	["agentPanel.addOwnKeys", "composer.addOwnKeys"],
	["agentPanel.builderModelCredits", "composer.builderModelCredits"],
	["agentPanel.builderOrOwnKeys", "setup.builderOrOwnKeys"],
	["agentPanel.chat", "shell.chat"],
	["agentPanel.closeTab", "tabs.closeTab"],
	["agentPanel.configureProviderKeys", "composer.configureProviderKeys"],
	["agentPanel.connectAi", "setup.connectAi"],
	["agentPanel.connectBuilderIo", "composer.connectBuilder"],
	["agentPanel.connectingBuilder", "composer.connectingBuilder"],
	["agentPanel.loadingTerminal", "shell.loadingTerminal"],
	["agentPanel.newChat", "tabs.newChat"],
	["agentPanel.toggleAgent", "shell.toggleAgent"],
	["agentPanel.voiceMode", "voiceMode"],
	["contextXray", "contextXray"]
];
function getNestedMessage(messages, path) {
	let value = messages;
	for (const part of path.split(".")) {
		if (!value || typeof value !== "object" || Array.isArray(value)) return;
		value = value[part];
	}
	return value;
}
function setNestedMessage(messages, path, value) {
	const parts = path.split(".");
	let cursor = messages;
	for (const part of parts.slice(0, -1)) {
		const nested = cursor[part];
		if (!nested || typeof nested !== "object" || Array.isArray(nested)) cursor[part] = {};
		cursor = cursor[part];
	}
	cursor[parts.at(-1)] = value;
}
function cloneMessages(messages) {
	const cloned = {};
	for (const [key, value] of Object.entries(messages)) cloned[key] = value && typeof value === "object" && !Array.isArray(value) ? cloneMessages(value) : value;
	return cloned;
}
function mergeLegacyMessageValue(legacyValue, modernValue) {
	if (modernValue === void 0) return legacyValue;
	if (legacyValue && modernValue && typeof legacyValue === "object" && typeof modernValue === "object" && !Array.isArray(legacyValue) && !Array.isArray(modernValue)) {
		const merged = { ...legacyValue };
		for (const [key, value] of Object.entries(modernValue)) merged[key] = mergeLegacyMessageValue(merged[key], value);
		return merged;
	}
	return modernValue;
}
function normalizeCoreMessageOverrides(messages) {
	const normalized = cloneMessages(messages);
	for (const [legacyPath, agentChatPath] of legacyAgentChatAliases) {
		const legacyValue = getNestedMessage(normalized, legacyPath);
		const modernPath = `agentChat.${agentChatPath}`;
		if (legacyValue !== void 0) setNestedMessage(normalized, modernPath, mergeLegacyMessageValue(legacyValue, getNestedMessage(normalized, modernPath)));
	}
	return normalized;
}
function nestAgentChatMessages(flatMessages) {
	const agentChat = {};
	for (const [flatKey, message] of Object.entries(flatMessages)) {
		const parts = flatKey.split(".");
		let cursor = agentChat;
		for (const part of parts.slice(0, -1)) {
			const nested = cursor[part];
			if (!nested || typeof nested !== "object" || Array.isArray(nested)) cursor[part] = {};
			cursor = cursor[part];
		}
		cursor[parts.at(-1)] = message;
	}
	const messages = { agentChat };
	for (const [legacyPath, agentChatPath] of legacyAgentChatAliases) {
		const value = getNestedMessage(agentChat, agentChatPath);
		if (value !== void 0) setNestedMessage(messages, legacyPath, value);
	}
	return messages;
}
var coreMessageLoaders = {
	"en-US": async () => ({ default: englishAgentChatMessages }),
	"zh-CN": () => import("./zh-CN-Bv2vs0Ql.js"),
	"zh-TW": () => import("./zh-TW-BxtM81Zn.js"),
	"es-ES": () => import("./es-ES-C2LoYbCZ.js"),
	"fr-FR": () => import("./fr-FR-C_1sNgfu.js"),
	"de-DE": () => import("./de-DE-DjuQRLtq.js"),
	"ja-JP": () => import("./ja-JP-zzORida4.js"),
	"ko-KR": () => import("./ko-KR-z-5MbaA0.js"),
	"pt-BR": () => import("./pt-BR-CzDMSWua.js"),
	"hi-IN": () => import("./hi-IN-WKE9raze.js"),
	"ar-SA": () => import("./ar-SA-cPp9CnMj.js")
};
async function loadAgentChatMessagesForLocale(locale) {
	return (await (isLocaleCode(locale) ? coreMessageLoaders[locale] : coreMessageLoaders[DEFAULT_LOCALE])()).default;
}
async function loadCoreMessagesForLocale(locale) {
	return {
		...nestAgentChatMessages(await loadAgentChatMessagesForLocale(locale)),
		environmentBadge: environmentBadgeMessagesForLocale(locale),
		settings: mcpSettingsMessagesForLocale(locale)
	};
}
var englishCoreMessages = nestAgentChatMessages(englishAgentChatMessages);
function coreMessagesForLocale(locale) {
	return {
		...locale === "en-US" || !isLocaleCode(locale) ? englishCoreMessages : {},
		environmentBadge: environmentBadgeMessagesForLocale(locale),
		settings: mcpSettingsMessagesForLocale(locale)
	};
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/localization/default-messages.js
var messages = {
	environmentBadge: ENVIRONMENT_BADGE_MESSAGES["en-US"],
	workspaceFile: { download: "Download" },
	composer: {
		sendMessage: "Send message",
		queueMessage: "Queue message"
	},
	home: {
		settingsTitle: "Settings",
		settingsDescription: "Language and agent preferences",
		title: "Your app is running",
		intro: "Start building by editing",
		actionCardTitle: "Action-backed data",
		loadingAction: "Loading action result...",
		docsTitle: "Documentation",
		docsDescription: "Learn the framework",
		themeTitle: "Theme",
		themeDescription: "Toggle dark / light"
	},
	common: {
		cancel: "Cancel",
		confirmDisconnect: "Confirm disconnect",
		disconnect: "Disconnect",
		disconnecting: "Disconnecting…"
	},
	onboarding: {
		back: "Back",
		chooseRole: "Choose your role",
		customizeRole: "Let’s customize this for you.",
		roleQuestion: "What best describes your role?",
		roleProduct: "Product",
		roleDesign: "Design",
		roleDeveloper: "Developer",
		roleMarketing: "Marketing",
		roleSales: "Sales",
		roleOps: "Ops",
		roleIndividual: "Individual",
		roleOther: "Other",
		skipForNow: "Skip for now",
		saveRoleError: "Could not save your role.",
		builderReadyWithCodeChanges: "AI credits and cloud code changes are ready to use.",
		builderReadyCreditsOnly: "AI credits are ready to use. Cloud code edits require a Builder project in Background Agent settings.",
		openBackgroundAgentSettings: "Open Background Agent settings",
		fileStorage: {
			title: "Choose file storage",
			description: "Choose Builder.io for managed file storage, or use custom storage keys for your own S3-compatible bucket.",
			custom: "Use custom storage keys",
			customDescription: "Configure an S3-compatible bucket with a stable public URL."
		}
	},
	settings: {
		title: "Settings",
		pageTitle: "Settings",
		description: "Language and workspace preferences for this app.",
		languageTitle: "Language",
		languageDescription: "Choose the interface language. This preference is saved for your account.",
		languageLabel: "Interface language",
		agentTitle: "Manage agent",
		agentDescription: "Manage the agent's model, API keys, automations, voice, and other controls.",
		openAgentSettings: "Manage agent",
		workspaceTitle: "Workspace",
		workspaceDescription: "Manage team access and shared workspace resources.",
		openTeamSettings: "Open team settings",
		openResourceSettings: "Open resource settings",
		backHome: "Back to home",
		builderConnection: { manage: "Manage Builder.io connection" },
		mcpConnectionsTitle: "Agent integrations",
		mcpConnectionsDescription: "Connect tools and services so the agent can use them.",
		openMcpConnections: "Open integrations",
		mcpTitle: "MCP",
		mcpDescription: "Connect this app to Claude, ChatGPT, Cursor, Codex, or another MCP host.",
		mcpUrlLabel: "MCP server URL",
		mcpUrlHint: "Copy this URL into the AI host you want to use. The canonical path is /mcp.",
		mcpOpenDocs: "Open MCP connection docs",
		a2aAgentCard: "A2A agent card",
		a2aOpenDocs: "Open A2A documentation",
		mcpClientSetup: "Connect an AI host",
		mcpClientSetupDescription: "Choose a host for step-by-step setup, or paste the URL into any MCP-compatible client.",
		mcpChooseAssistant: "Choose your AI assistant",
		mcpCommand: "Command",
		mcpConfig: "MCP config",
		mcpCopy: "Copy",
		mcpCopied: "Copied",
		mcpStaticTokenDescription: "Open the full connect page to create a token for clients that cannot complete OAuth.",
		mcpOpenConnectPage: "Open full connect page",
		profileTitle: "Account",
		profileDescription: "Your name, profile photo, and signed-in identity.",
		profileLoading: "Loading...",
		profileSignedOut: "Signed out",
		profilePhotoUpdated: "Photo updated",
		profilePhotoError: "Could not update photo",
		profileUploading: "Uploading...",
		profileChangePhoto: "Change photo",
		profileNameLabel: "Name",
		profileNameEdit: "Edit name",
		profileNamePlaceholder: "Your name",
		profileNameDescription: "This name is used when referring to you across Agent-Native apps.",
		profileSave: "Save changes",
		profileSaving: "Saving...",
		profileSaved: "Profile updated",
		profileSaveError: "Could not update profile",
		emailTitle: "Email",
		emailChange: "Change email",
		emailChanging: "Sending...",
		emailChangeSent: "Check your email for instructions to confirm this change.",
		emailChangeError: "Could not send confirmation.",
		emailNewLabel: "New email",
		emailNewPlaceholder: "Enter new email",
		passwordTitle: "Password",
		passwordDescription: "Add a password for an alternative way to sign in to your account.",
		passwordStatusLoading: "Checking password settings...",
		passwordAdd: "Add password",
		passwordChange: "Change password",
		passwordCurrentLabel: "Current password",
		passwordNewLabel: "New password",
		passwordConfirmLabel: "Confirm new password",
		passwordPlaceholder: "Enter password",
		passwordMinLength: `Choose a password with at least 12 characters.`,
		passwordMismatch: "Passwords do not match",
		passwordSave: "Save password",
		passwordSaving: "Saving...",
		passwordSaved: "Password updated",
		passwordSaveError: "Could not update password",
		profileMenuItem: "Profile",
		manageAgentMenuItem: "Manage agent",
		timezoneLabel: "Timezone",
		timezoneSystem: "Follow this browser ({{zone}})",
		timezoneHint: "Used for timestamps and scheduled automations."
	},
	secrets: {
		scopeLabel: "Scope",
		scopePersonal: "Personal",
		scopeWorkspace: "Workspace",
		testStoredValue: "Test",
		candidateValueWorking: "New value works",
		storedValueWorking: "Working",
		invalid: "Invalid",
		testFailed: "Test failed",
		scopePersonalDescription: "Only your own signed-in sessions use this key. Integration, webhook, scheduled job, automation, and agent-to-agent runs sign in as their owner rather than as you, so they cannot read it.",
		scopeWorkspaceDescription: "Everyone in this workspace uses this key, including integration, webhook, scheduled job, automation, and agent-to-agent runs.",
		sourceVault: "Vault",
		sourceWorkspace: "Workspace",
		sourceEnvironment: "Environment",
		statusUnavailable: "Unavailable",
		managedInVault: "Managed in the workspace Vault. Every app in this workspace uses this value.",
		openVault: "Open Vault",
		setForWorkspace: "Set for everyone in this workspace.",
		fromEnvironment: "Provided by the deployment environment.",
		usePersonalKey: "Use a personal key instead",
		overridesVault: "This personal key overrides the workspace Vault value. Remove it to use the Vault key.",
		overridesWorkspace: "This personal key overrides the workspace value. Remove it to use the shared key.",
		newKey: "New",
		searchKeys: "Search keys...",
		noKeysFound: "No keys found.",
		chooseKey: "Choose a key",
		required: "Required",
		customKey: "Custom key",
		customKeyHint: "Add any key by name",
		addCustomKeyNamed: "Add “{{name}}” as a custom key",
		emptyTitle: "No keys yet.",
		emptyHint: "Add a key to use your own accounts.",
		emptyMore: "and {{count}} more under New, or add any custom key"
	},
	agentResources: {
		openDocs: "Open {{section}} documentation",
		backToResources: "Back to agent resources",
		createFile: {
			nameLabel: "File name",
			namePlaceholder: "notes/ideas",
			menuDescription: "Add a new file by name"
		},
		files: {
			title: "Files",
			description: "Files the agent can read and write."
		},
		instructions: {
			title: "Instructions",
			description: "The rules, preferences, and project guidance that steer the agent."
		},
		agents: {
			title: "Agents",
			description: "Reusable profiles for focused sub-agents and delegated work."
		},
		memory: {
			title: "Memory",
			description: "Durable notes the agent can retrieve across conversations."
		},
		skills: {
			title: "Skills",
			description: "Specialized instructions that give the agent repeatable abilities."
		},
		learnings: {
			title: "Learnings",
			description: "Corrections and patterns worth carrying forward for future work."
		},
		remoteAgents: {
			title: "Remote agents",
			description: "Other agents this agent can call through A2A."
		}
	},
	featureFlags: {
		title: "Feature flags",
		description: "Control staged capabilities without changing a deployment.",
		enableForMe: "Enable for me",
		enabledForMe: "Enabled for you",
		youHaveAccess: "You have access",
		youDoNotHaveAccess: "You don't have access",
		currentUserUnknown: "Your access couldn't be evaluated",
		moreActions: "More actions for {{name}}",
		disableForEveryone: "Disable for everyone",
		disableForEveryoneTitle: "Disable {{name}} for everyone?",
		disableForEveryoneDescription: "This immediately removes access for every targeted person and organization. You can configure a new rollout later.",
		editTargeting: "Edit targeting",
		editTargetingFor: "Edit targeting for {{name}}",
		targetingTitle: "Edit targeting — {{name}}",
		targetingDescription: "Choose who can use this capability. Changes apply immediately.",
		noFlags: "No feature flags are registered for this app.",
		defaultOn: "Code fallback: on",
		defaultOff: "Code fallback: off",
		enabledFor: "Enabled for",
		modeLabel: "Availability",
		emailsLabel: "People",
		orgIdsLabel: "Organization IDs",
		percentageLabel: "Percentage of users",
		targetingRuleHelp: "A person gets access if they match any email, organization, or percentage rule.",
		targetingSummary: "Currently enabled for: {{audience}}.",
		saveRules: "Save changes",
		cancel: "Cancel",
		inherited: "No matching targets",
		off: "Off",
		targeted: "Targeted",
		everyone: "Everyone",
		everyoneAudience: "everyone",
		emailCount_one: "{{count}} email",
		emailCount_other: "{{count}} emails",
		organizationCount_one: "{{count}} organization",
		organizationCount_other: "{{count}} organizations",
		percentageRollout: "{{count}}% rollout",
		lastChanged: "Last changed: {{metadata}}",
		mutationUnverified: "We couldn't verify the change to {{name}}. Reload flags before trying again.",
		mutationUnverifiedGeneric: "We couldn't verify this feature flag change. Reload flags before trying again."
	},
	dispatch: {
		nav: {
			chat: "Chat",
			overview: "Overview",
			apps: "Apps",
			metrics: "Metrics",
			vault: "Vault",
			integrations: "Integrations",
			agents: "Agents",
			resources: "Resources",
			messaging: "Messaging",
			destinations: "Destinations",
			transactionalEmail: "Transactional email",
			identities: "Identities",
			approvals: "Approvals",
			automations: "Automations",
			delivery: "Delivery",
			audit: "Audit",
			dreams: "Dreams",
			threadDebug: "Thread Debug",
			settings: "Settings",
			team: "Team",
			operations: "Operations",
			navigation: "Navigation",
			navigationDescription: "Workspace navigation links"
		},
		sidebar: {
			workspaceControlPlane: "Workspace control plane",
			workspaceSubtitle_one: "Workspace · {{count}} app",
			workspaceSubtitle_other: "Workspace · {{count}} apps",
			search: "Search",
			chats: "Chats",
			newChat: "New chat",
			newDispatchChat: "New Dispatch chat",
			renameChat: "Rename chat",
			renameThread: "Rename {{title}}",
			chatOptions: "Chat options for {{title}}",
			aboutPage: "About {{title}}",
			emptyAgentText: "Create apps, manage vault keys, and route work across the workspace.",
			suggestionBuildApp: "Build a workspace app for X",
			suggestionRouteSlack: "Route Slack mentions to my analytics app",
			suggestionGrantKey: "Grant my OpenAI key to this app"
		},
		transactionalEmail: {
			title: "Transactional email",
			description: "Every transactional email each app in this workspace can send, with its trigger, recipients, and delivery metrics.",
			retentionTitle: "Activity feed retention is short",
			retentionNote: "The email provider's activity feed only retains recent messages, so an empty activity list does not mean nothing was sent.",
			openRatesUnavailable: "Open rates unavailable",
			sharedProviderMetricsUnavailable: "Provider metrics vary by sending app. Expand an app to see its provider data.",
			catalogFanoutFailed: "Could not load app email catalogs",
			retry: "Retry",
			noApps: "No ready apps reported a transactional email catalog.",
			catalogUnreadable: "This app's email catalog could not be read",
			countsUnreadable: "Send counts could not be read",
			appSendsNoEmail: "This app sends no transactional email of its own.",
			emailNotFound: "Email not found",
			emailNotFoundDescription: "This email is not in the app's catalog.",
			sharedTitle: "Shared system email",
			sharedSubtitle: "sent by every app",
			email: "Email",
			trigger: "Trigger",
			sends: "Sends",
			openRate: "Open rate",
			lastSent: "Last sent",
			sendLogUnread: "The send log could not be read, so the number of sends is unknown.",
			failedCount: "{{count}} failed",
			failuresUnknown: "failures unknown",
			noProviderRecord: "The provider reported no record for this email in the window.",
			noDeliveredMail: "No delivered mail yet",
			neverSent: "Never sent",
			lastSentUnknown: "The send log could not be read, so the last send time is unknown.",
			preview: "Preview",
			previewDescription: "Rendered with dummy data. Scripts are disabled in this preview.",
			previewFailed: "Preview could not be rendered",
			previewFrameTitle: "Preview of {{name}}",
			subject: "Subject",
			activityLink: "Activity log",
			activityTitle: "Activity for {{name}}",
			activityUnavailable: "Activity feed unavailable",
			activityEmpty: "No recent activity in the provider's retention window.",
			recipient: "Recipient",
			sender: "Sender",
			status: "Status",
			opens: "Opens",
			lastEvent: "Last event",
			app: "App",
			sendLogTitle: "Send log",
			sendLogTemplate: "Template",
			sendLogProvider: "Provider",
			sendLogResponseStatus: "Response status",
			sendLogError: "Error",
			sendLogTo: "To",
			sendLogFrom: "From",
			sendLogContainsOperator: "contains",
			sendLogExcludeOperator: "exclude",
			sendLogContainsPlaceholder: "e.g. name@example.com",
			sendLogExcludePlaceholder: "e.g. @builder.io",
			sendLogAddressFilterLabel: "{{dimension}} {{operator}}",
			sendLogRemoveAddressFilter: "Remove {{filter}}",
			sendLogAllTemplates: "All templates",
			sendLogSearchTemplates: "Search templates…",
			sendLogNoTemplatesFound: "No templates found.",
			sendLogAllStatuses: "All statuses",
			sendLogSent: "Sent",
			sendLogFailed: "Failed",
			sendLogAllProviders: "All providers",
			sendLogClearFilters: "Clear filters",
			sendLogEmpty: "No sends match these filters in this date range.",
			sendLogTimestamp: "Timestamp",
			sendLogPrevious: "Previous",
			sendLogNext: "Next",
			sendLogBodyHtml: "HTML",
			sendLogBodyText: "Text",
			sendLogBodyFrameTitle: "Sent email body"
		},
		pages: {
			appsDescription: "Open workspace apps and start new app creation from Dispatch.",
			appsDescriptionWithWorkspace: "Apps in the \"{{workspace}}\" workspace. Each app gets its own route under this workspace and shares its database, auth, and agent chat.",
			appsInWorkspace: "Apps in {{workspace}}",
			workspaceApps: "Workspace apps",
			otherApps: "Other apps",
			otherAppsDescription: "Open other apps available to you.",
			availableCount: "{{count}} available",
			activeCount: "{{count}} active",
			pendingCount: "{{count}} pending",
			hiddenCount: "{{count}} hidden",
			createApp: "Create app",
			templates: "Templates",
			checkingTemplates: "Checking available templates",
			templatesAvailable: "{{count}} available to scaffold",
			hide: "Hide",
			show: "Show",
			hiddenApps: "Hidden apps",
			hiddenAppCount: "{{count}} hidden apps",
			pendingApps: "Pending apps",
			pendingAppsDescription: "{{count}} pending apps are hidden by default. Show them only when you need to inspect work in progress.",
			showPendingApps: "Show pending apps",
			hidePendingApps: "Hide pending apps",
			noActiveWorkspaceApps: "No active workspace apps yet",
			noActiveWorkspaceAppsDescription: "Pending apps are hidden by default. Expand Pending apps below to inspect them.",
			appMetadataOwner: "Owner",
			appMetadataTeams: "Teams",
			workspaceAppFallback: "Workspace App",
			workspaceAppDescription: "Open a deployed app or check the status of an app being created.",
			pageNotFound: "Page not found",
			pageNotFoundDescription: "This route is not in the workspace app list yet.",
			browseApps: "Browse apps",
			newApp: "New App",
			newAppDescription: "Create a workspace app from a prompt and apply the workspace vault policy.",
			destinationsDescription: "Saved outbound Slack channels, Telegram chats, and thread targets.",
			savedDestinations: "Saved destinations",
			addDestination: "Add destination",
			quickTestMessage: "Quick test message",
			send: "Send",
			delete: "Delete",
			cancel: "Cancel",
			messageSent: "Message sent",
			unableToSendMessage: "Unable to send message",
			destinationSaved: "Destination saved",
			destinationRemoved: "Destination removed",
			deleteDestinationTitle: "Delete destination?",
			deleteDestinationDescription: "\"{{name}}\" will be removed. Any saved workflows or jobs that target this destination will start failing on the next send.",
			noDestinations: "No destinations saved yet. Add your first Slack channel or Telegram chat on the right.",
			dailyDigestChannel: "Daily digest channel",
			optionalThreadOrTopicId: "Optional thread or topic id",
			destinationNotes: "What should use this destination?",
			saveDestination: "Save destination",
			noWorkspaceApps: "No workspace apps yet",
			noWorkspaceAppsDescription: "Create an app when a workflow needs its own focused place to live.",
			appNotFound: "App not found",
			building: "Building",
			appBuildingPrefix: "This app is being created. It will be available at",
			appBuildingSuffix: "after its branch is merged and the workspace deploy finishes.",
			branch: "Branch: {{branch}}",
			openBuilderBranch: "Open in Builder",
			openingApp: "Opening {{name}}",
			redirectingTo: "Redirecting to",
			openApp: "Open app",
			notDispatchOrWorkspaceApp: " a Dispatch tab or a workspace app in this workspace.",
			agentsDescription: "Dispatch can delegate to the built-in app suite over A2A by default. Add extra agents here only if you want to route work to apps outside that built-in set.",
			simpleAgentsDescription: "Create reusable agents in minutes, or import a setup you already made in Claude or another agent tool.",
			mcpAccessUpdated: "Agent integration access updated",
			selectAppForMcp: "Select at least one app, or expose all apps.",
			mcpUrlCopied: "Agent integration URL copied",
			mcpUrlCopyFailed: "Could not copy agent integration URL",
			unifiedMcpGateway: "Unified agent integration gateway",
			unifiedMcpGatewayDescription: "Connect external agents to Dispatch once, then route to granted workspace apps through",
			allApps: "All apps",
			selectedApps: "Selected apps",
			loading: "Loading",
			grantedCount: "{{count}} granted",
			exposeAllAppsMcp: "Expose all apps through Dispatch",
			copyUrl: "Copy URL",
			metricsUnavailable: "Metrics unavailable",
			unableToLoadUsage: "Unable to load usage.",
			metricsDescriptionBuilder: "Workspace-wide Builder.io credit spend, chat volume, user activity, and app access.",
			metricsDescriptionLlm: "Workspace-wide LLM spend, chat volume, user activity, and app access.",
			appAdoption: "App adoption",
			appAdoptionFor: "{{name}} adoption",
			yourAppActivity: "Your app activity",
			appAdoptionDefinition: "Active means a tracked action. App opens and views are not included.",
			ownerUnavailable: "Owner unavailable",
			dailyActiveUsers: "Daily active",
			weeklyActiveUsers: "Weekly active",
			trackedActions: "Tracked actions",
			trackedActionBreakdown: "Tracked action breakdown",
			noTrackedActions: "No tracked actions in this window.",
			viewAppMetrics: "View app metrics",
			llmCalls: "LLM calls",
			activeUsers: "Active users",
			workspaceAppsStat: "Workspace apps",
			chatThreads: "Chat threads",
			also: "Also",
			workspaceShortcutsAria: "Workspace shortcuts",
			deliveryQueue: "Delivery queue",
			failedLastHour: "{{count}} failed in the last hour",
			processingCount: "{{count}} processing",
			queued: "Queued",
			active: "Active",
			done1h: "Done 1h",
			failed1h: "Failed 1h",
			oldestQueued: "Oldest queued: {{age}}",
			queueAgeNone: "none",
			queueFailureHint: "Check credentials, destinations, and recent queue errors.",
			unknownPlatform: "unknown",
			attemptsCount: "{{count}} attempts",
			noErrorMessage: "(no error message)",
			threadDebugInspectFailure: "Inspect failed run",
			threadDebugFailureCode: "Failure code",
			threadDebugTerminalReason: "Terminal reason",
			threadDebugDispatchMode: "Dispatch mode",
			threadDebugLastStage: "Last stage",
			threadDebugDuration: "Duration",
			threadDebugLastProgress: "Last progress",
			threadDebugTitle: "Thread Debug",
			threadDebugDescription: "Inspect failed agent runs, persisted threads, run events, and AI internals.",
			threadDebugFailedRuns: "Failed runs",
			threadDebugThreads: "Threads",
			threadDebugSource: "Source",
			threadDebugAllSources: "All sources",
			threadDebugOwner: "Owner email",
			threadDebugStatus: "Status",
			threadDebugAllStatuses: "All statuses",
			threadDebugErrored: "Errored",
			threadDebugAborted: "Aborted",
			threadDebugTruncated: "Truncated",
			threadDebugRange: "Time range",
			threadDebugRange24h: "Last 24 hours",
			threadDebugRange7d: "Last 7 days",
			threadDebugRange30d: "Last 30 days",
			threadDebugFailureResults: "failed runs",
			threadDebugCurrentScope: "current scope",
			threadDebugPartialResults: "Partial results",
			threadDebugUnavailableSources: "Unavailable sources:",
			threadDebugDisconnected: "disconnected",
			threadDebugUnsupported: "unsupported",
			threadDebugUnavailable: "unavailable",
			threadDebugRefreshFailures: "Refresh failed runs",
			threadDebugNoFailures: "No failed runs found.",
			threadDebugCurrentDatabase: "Current Dispatch DB",
			threadDebugSearchPlaceholder: "Search threads or email",
			threadDebugSearch: "Search",
			threadDebugLookupPlaceholder: "Paste thread or request/run ID",
			threadDebugInspect: "Inspect",
			threadDebugAdminScope: "admin scope",
			threadDebugOwnScope: "own scope",
			threadDebugResults: "results",
			threadDebugRefreshThreads: "Refresh threads",
			threadDebugNoThreads: "No threads found.",
			threadDebugSelectPrompt: "Select a failed run or thread to inspect.",
			browserChatUnavailableTitle: "Browser chat session unavailable",
			browserChatUnavailableDescription: "Reconnect from the Agent-Native browser extension.",
			browserChatPlaceholder: "Ask about this page…",
			browserChatAttachedPlaceholder: "Ask about {{page}}…",
			browserConnectTitle: "Connect browser chat",
			browserConnectDescription: "Allow the Agent-Native Chrome extension to open this Dispatch chat session. The connection uses a one-time, short-lived ticket.",
			browserConnectInvalid: "This connection request is invalid. Start again from the extension.",
			browserConnectConnected: "Browser chat connected. You can close this tab.",
			browserConnectConnecting: "Connecting…",
			browserConnectButton: "Connect",
			browserConnectOpenFromExtension: "Open this page from the Agent-Native Chrome extension.",
			browserConnectFailed: "The browser extension did not connect."
		}
	},
	agentPanel: {
		uiError: {
			title: "Agent panel hit a glitch",
			description: "The app's still usable. Reset to reload the chat.",
			reset: "Reset agent panel",
			reloading: "Reloading chat…"
		},
		useBuilder: "Use Builder",
		openDesktopToEditCode: "Open Desktop to edit code",
		codeUnavailableDescription: "Source-code changes and CLI access are available in the Agent-Native Desktop app.",
		downloadDesktop: "Download Desktop",
		chatMode: "Chat mode",
		chat: "Chat",
		mode: "Mode",
		uiMode: "UI",
		cliTerminalMode: "CLI terminal mode",
		cli: "CLI",
		workspaceMode: "Files, agents, skills, and tasks",
		workspace: "Resources",
		newChat: "New chat",
		newTerminal: "New terminal",
		loadingTerminal: "Loading terminal...",
		panelOptions: "Agent panel options",
		collapseSidebar: "Collapse sidebar",
		widenChat: "Widen chat",
		returnChatToLayout: "Return chat to layout",
		expandSidebar: "Expand sidebar",
		hideChats: "Hide chats",
		allChats: "All chats",
		settings: "Settings",
		feedback: "Feedback",
		exitFullscreen: "Exit fullscreen",
		fullscreen: "Fullscreen",
		closeTab: "Close tab",
		closeOtherTabs: "Close other tabs",
		closeAllTabs: "Close all tabs",
		clearChat: "Clear chat",
		cliRequiresDevMode: "CLI requires dev mode",
		cliRequiresDevModeDescription: "Run this app locally with pnpm dev or use Builder.io to access the CLI terminal.",
		toggleAgent: "Toggle agent",
		openFullView: "Open full view",
		askAgent: "Ask the agent",
		askAgentTitle: "Ask the agent",
		askAgentPlaceholder: "Tell the agent what you want to do…",
		connectAi: "Connect AI",
		builderOrOwnKeys: "Choose Builder.io or custom keys.",
		connectBuilderIo: "Connect Builder.io",
		connectingBuilder: "Connecting Builder.io…",
		builderModelCredits: "Free credits for Claude, OpenAI & Gemini",
		addOwnKeys: "Custom keys",
		configureProviderKeys: "Choose a provider.",
		chooseProvider: "Choose a provider",
		searchProviders: "Search providers...",
		noProvidersFound: "No providers found.",
		availableProviders: "Available providers",
		configured: "Configured",
		apiKey: "API key",
		localRuntime: "Local",
		keyScope: "Key scope",
		personalKeyScope: "Personal",
		organizationKeyScope: "Organization",
		personalKeyInEffect: "Your personal key is in effect.",
		organizationKeyInEffect: "Organization key is in effect.",
		sharedKeyInEffect: "A shared key is in effect.",
		useOrganizationKey: "Use organization key",
		keyStatusUnavailable: "Key status is unavailable.",
		enterApiKey: "Enter your {{provider}} API key.",
		providerSetupFailed: "Could not configure this provider.",
		noApiKeyNeeded: "No API key required.",
		modelId: "Model ID",
		endpointUrl: "Endpoint URL",
		optional: "Optional",
		ollamaEndpointHint: "Defaults to Ollama at http://localhost:11434.",
		compatibleEndpointHint: "Use this for LiteLLM or another OpenAI-compatible gateway.",
		savingProvider: "Saving...",
		providerSaved: "Connected",
		useProvider: "Use {{provider}}",
		saveAndUseProvider: "Save and use {{provider}}",
		getApiKey: "Get an API key",
		checkingAiConnection: "Checking AI connection...",
		delegatedAgent: {
			asking: "Asking {{name}}...",
			asked: "Asked {{name}}",
			error: "Error asking {{name}}",
			elapsed: "{{duration}} elapsed"
		},
		voiceMode: {
			entryButtonLabel: "Use microphone",
			promptTitle: "Use your voice",
			promptDescription: "Voice mode keeps listening while the agent navigates and takes actions.",
			setupTitle: "Set up voice mode",
			setupDescription: "Connect Builder.io to use managed voice with free credits, or add your own keys.",
			connectBuilder: "Connect Builder.io",
			useOpenAiKey: "Custom keys",
			startWithOpenAiKey: "Start with OpenAI key",
			start: "Start voice chat",
			keepDictating: "Dictate a message",
			rememberPreference: "Remember my preference",
			showChat: "Show chat",
			hideChat: "Hide chat",
			end: "End voice mode",
			voiceSettings: "Voice settings",
			settings: {
				microphone: "Microphone",
				defaultMicrophone: "System default",
				microphoneSwitchFailed: "Could not switch microphones. Your current microphone is still active.",
				language: "Language",
				autoLanguage: "Auto",
				languages: {
					en: "English",
					es: "Spanish",
					fr: "French",
					de: "German",
					it: "Italian",
					pt: "Portuguese",
					ja: "Japanese",
					ko: "Korean",
					zh: "Chinese"
				},
				intelligence: "Intelligence",
				intelligenceLevels: {
					instant: "Instant",
					balanced: "Balanced",
					deep: "Deep"
				},
				voiceStyle: "Voice style",
				voiceChangePending: "Your new voice will apply next time you start voice mode.",
				voiceDescriptions: {
					marin: "Warm and natural",
					cedar: "Clear and grounded",
					coral: "Friendly and bright",
					sage: "Calm and thoughtful",
					verse: "Expressive and versatile",
					alloy: "Balanced and neutral",
					ash: "Smooth and confident",
					ballad: "Warm and expressive",
					echo: "Clear and direct",
					shimmer: "Light and upbeat"
				}
			},
			status: {
				connecting: "Connecting",
				listening: "Listening",
				speaking: "Speaking",
				working: "Working",
				error: "Voice mode needs attention",
				ending: "Ending voice mode"
			},
			errors: {
				unsupported: "This browser does not support realtime voice conversations.",
				responseFailed: "OpenAI could not complete the voice response.",
				sessionFailed: "The realtime voice session encountered an error.",
				channelDisconnected: "The realtime voice control channel disconnected.",
				connectionTimedOut: "The realtime voice connection timed out. Try again after the app finishes loading.",
				connectionFailed: "The realtime voice connection failed.",
				offerFailed: "The browser did not create an audio offer."
			}
		}
	},
	contextXray: {
		provenance: {
			frameworkCore: "Framework",
			actionsPrompt: "Actions",
			template: "Template",
			enterpriseWorkspaceCore: "Enterprise workspace core",
			sqlWorkspace: "Workspace",
			legacyAppDefault: "App defaults",
			organization: "Organization",
			personal: "Personal",
			memory: "Memory",
			dbSchema: "SQL schema",
			tools: "Tools",
			modelOverlay: "Model overlay",
			runtimeContext: "Runtime context"
		},
		governance: {
			required: "Required",
			inherited: "Inherited",
			user: "Your context"
		},
		system: "System",
		conversation: "Conversation",
		free: "free",
		noSystemContext: "No system context is available for this scope yet.",
		panelTitle: "Context X-Ray",
		snapshotsTitle: "Snapshots",
		agent: "Agent",
		headerDescription: "See the system instructions and conversation tokens that shape the agent.",
		whatAgentKnows: "What the agent knows",
		orderedSystemDescription: "Ordered system context is grouped by where it comes from. System sections are visible here but cannot be evicted from a thread.",
		list: "List",
		treemap: "Treemap",
		loadingPreview: "Loading context preview…",
		previewUnavailable: "Context preview is not available yet.",
		noPreview: "No context preview is available for this scope yet.",
		liveThread: "Live thread",
		liveThreadDescription: "The latest thread snapshot, when one exists. This is a single current snapshot, not an append-only history.",
		latestThread: "Latest thread",
		noLiveThread: "No live thread snapshot is available yet.",
		orderedTokensTitle: "Context is ordered tokens, not weighted tokens.",
		orderedTokensDescription: "Required framework and enterprise policy come first, followed by inherited template, workspace, and organization instructions. Personal instructions and memory arrive later and can narrow or override earlier guidance where the prompt permits. These system sections are not evictable; only run-local conversation segments support pin, evict, and restore.",
		systemOrdered: "System · ordered, not evictable"
	},
	jobs: {
		timezone: "Timezone",
		pageTitle: "Automations",
		pageDescription: "Manage agent tasks that run on a schedule, in response to events, or from webhooks.",
		personalDescription: "Scheduled, event-triggered, and webhook-triggered automations that run for you.",
		organizationDescription: "Scheduled, event-triggered, and webhook-triggered automations shared with this organization.",
		organizationMemberNote: "You can manage automations you created.",
		loading: "Loading…",
		loadError: "Could not load all automations.",
		organizationEmptyTitle: "No organization automations yet",
		organizationEmptyDescription: "Describe a scheduled, event-triggered, or webhook-triggered automation for this organization.",
		organizationPrompt: "Create a shared organization automation that does this: ",
		enabled: "Enabled",
		paused: "Paused",
		nextRun: "Next run",
		lastRun: "Last run",
		lastChecked: "Last checked",
		lastStatus: "Last status",
		neverRan: "Never",
		notSet: "—",
		status: "Status",
		trigger: "Trigger",
		scope: "Scope",
		createdBy: "Created by",
		model: "Model",
		blockedTitle: "This automation is not running",
		pastRuns: "Past runs",
		runsLoadError: "Could not load run history.",
		noRuns: "This automation has not executed yet. Only real executions are recorded here.",
		edit: "Edit",
		editScheduleTitle: "Edit schedule — {{name}}",
		editScheduleDescription: "The clock time below is read in the timezone you pick, so 8:00 means 8:00 there.",
		repeat: "Repeat",
		repeatEvery: "Repeat every",
		scheduleUnit: "Unit",
		hours: "hour(s)",
		days: "day(s)",
		day: "day",
		weeks: "week(s)",
		months: "month(s)",
		atMinute: "At minute",
		onDay: "On",
		dayOfMonth: "Day of month",
		atTime: "At",
		weeklyIntervalAdvanced: "Every few weeks needs the Advanced cron editor below.",
		dailyIntervalAdvanced: "Every few days needs the Advanced cron editor below.",
		schedulePreview: "Runs {{time}}.",
		advancedSchedule: "Advanced - cron expression",
		show: "Show",
		hide: "Hide",
		cronExpression: "Cron expression",
		cronFormatHint: "minute hour day-of-month month day-of-week",
		cronFieldCount: "A cron expression needs exactly 5 fields.",
		saveSchedule: "Save schedule",
		details: "Details",
		viewDetails: "View details",
		pause: "Pause",
		resume: "Resume",
		delete: "Delete",
		updateError: "Could not update automation.",
		automationsEmptyTitle: "No automations yet",
		automationsEmptyDescription: "Describe what should happen and when.",
		automationsCreateTitle: "Create an automation",
		newAutomation: "New automation",
		automationPrompt: "Create an automation that does this: ",
		cancel: "Cancel",
		instructions: "Instructions",
		mcpTools: "Connected agent tools",
		automationEventTrigger: "On {{event}}",
		webhook: "Webhook",
		automationWebhookDetails: "Runs when a webhook is received.",
		automationWebhookTrigger: "On webhook",
		schedulePreset: {
			hourly: "Every hour",
			dailyMidnight: "Every day at midnight",
			dailyNoon: "Every day at noon",
			weekdays: "Every weekday",
			weekly: "Every week",
			custom: "Custom",
			customDetail: "Set your own repeat pattern"
		},
		scheduledTrigger: "Scheduled",
		eventTrigger: "Event-triggered",
		webhookTrigger: "Webhook-triggered",
		webhookUrl: "Webhook URL",
		webhookUrlHint: "Paste this URL into a service that sends HTTP POST webhooks.",
		deleteAutomationTitle: "Delete automation?",
		deleteAutomationDescription: "This permanently removes the automation and cannot be undone.",
		runNow: "Run now",
		runNowTitle: "Run automation now?",
		runNowDescription: "This runs the automation's real actions immediately. It may send messages or change data, and it will not change the next scheduled run.",
		automationDetails: "Automation details",
		automationEventDetails: "Runs when {{event}}.",
		condition: "Condition",
		personal: "Personal",
		organization: "Organization",
		settingsSummary: "Manage scheduled, event-triggered, and webhook-triggered agent tasks together from the Automations page.",
		openAutomations: "Open Automations",
		nextRunNeverScheduler: "Never — no scheduler in this deploy",
		nextRunSchedulerUnknown: "{{date}} — unconfirmed, the scheduler check failed",
		nextRunSchedulerUnknownNoDate: "Unknown — the scheduler check failed",
		scheduleUnknownTitle: "Couldn't check whether schedules run here",
		scheduleUnknownDetail: "The scheduler status check failed, so the next run times below are unconfirmed. Reload to check again.",
		scheduleUnavailableTitle: "Schedules won't run in this deploy",
		scheduleUnavailableLocalTitle: "Schedules don't run in local development",
		scheduleUnavailableDisabled: "This app was built with recurring jobs turned off, so no scheduled automation will fire. Event- and webhook-triggered automations and Run now still work.",
		scheduleUnavailableNoScheduler: "This hosting target has no durable scheduler, so no scheduled automation will fire. Event- and webhook-triggered automations and Run now still work.",
		scheduleUnavailableLocal: "Schedules stay off on a dev machine unless you opt in. Event- and webhook-triggered automations and Run now still work.",
		scheduleUnavailableDisabledFix: "To enable recurring jobs, set AGENT_NATIVE_DISABLE_RECURRING_JOBS=false in the build environment.",
		scheduleUnavailableLocalFix: "Set AGENT_NATIVE_ENABLE_LOCAL_RECURRING_JOBS=true to run schedules on this machine.",
		scheduleUnavailableFixLabel: "Show more",
		scheduleUnavailableFixLabelOpen: "Show less"
	},
	share: {
		titleWithResource: "Share \"{{title}}\"",
		titleWithType: "Share {{type}}",
		owner: "Owner: {{name}}",
		close: "Close",
		shareOptions: "Share options",
		link: "Link",
		invite: "Invite",
		embed: "Embed",
		done: "Done",
		generalAccess: "General access",
		shareLink: "Share link",
		addPeopleByEmail: "Add people by email",
		notifyPeople: "Notify people",
		message: "Message",
		addMessage: "Add a message",
		hideMessage: "Hide message",
		messagePlaceholder: "Add a short note (optional)",
		peopleWithAccess: "People with access",
		ownerRole: "Owner",
		remove: "Remove",
		noAccess: "No one has access yet.",
		embedUrl: "Embed URL",
		embedCode: "Embed code",
		copy: "Copy",
		copied: "Copied",
		role: "Role",
		private: "Private",
		privateDescription: "Only people with access can view",
		organization: "Organization",
		organizationDescription: "Anyone in your organization can view",
		public: "Public",
		publicDescription: "Anyone signed in with the link can view",
		viewer: "Viewer",
		viewerDescription: "Can view",
		commenter: "Commenter",
		commenterDescription: "Can view and add comments",
		editor: "Editor",
		editorDescription: "Can edit",
		admin: "Admin",
		adminDescription: "Can edit and manage access"
	},
	runsTray: {
		runs: "Runs",
		agentRuns: "Agent runs",
		activeRun_one: "{{count}} active run",
		activeRun_other: "{{count}} active runs",
		failedRun_one: "{{count}} failed run",
		failedRun_other: "{{count}} failed runs",
		recentRuns: "Recent runs",
		noRecentRuns: "No recent runs",
		ariaAgentRuns: "Agent runs, {{label}}",
		summaryRunning: "{{activeCount}} running",
		summaryRunningRecent: "{{activeCount}} running · {{terminalCount}} recent",
		summaryRecent_one: "{{count}} recent run",
		summaryRecent_other: "{{count}} recent runs",
		noTrackedWorkYet: "No tracked work yet",
		emptyDescription: "Background agent work will appear here while it runs and after it finishes.",
		open: "Open",
		stopRun: "Stop {{title}}",
		hideRun: "Hide {{title}}",
		statusRunning: "Running",
		statusDone: "Done",
		statusFailed: "Failed",
		statusStopped: "Stopped",
		statusNeedsApproval: "Needs approval",
		statusNeedsInput: "Needs input",
		statusPaused: "Paused",
		updatedJustNow: "Updated just now",
		finishedJustNow: "Finished just now",
		updatedMinutes: "Updated {{count}}m ago",
		finishedMinutes: "Finished {{count}}m ago",
		updatedHours: "Updated {{count}}h ago",
		finishedHours: "Finished {{count}}h ago",
		updatedDate: "Updated {{date}}",
		finishedDate: "Finished {{date}}"
	},
	agentTask: {
		spawnedAgent: "Spawned agent",
		stop: "Stop spawned agent",
		openThread: "Open task thread"
	},
	codeRequired: {
		fallbackDetail: "Edit locally or use Builder.io to edit this code in the cloud and continue customizing the app any way you like.",
		defaultFeature: "Make the requested code changes to this app",
		branchError: "Failed to create branch",
		title: "Code changes required",
		subtitleWithFeature: "\"{{feature}}\" creates or modifies source code, which needs Desktop or Builder from this surface.",
		subtitle: "This action creates or modifies source code, which needs Desktop or Builder from this surface.",
		desktopTitle: "Use Agent-Native Desktop",
		desktopDescription: "Open the project in the desktop app to enable source edits and CLI access.",
		builderAgentTitle: "Use Builder.io Agent",
		builderAgentDescription: "Let our cloud agent make the changes for you. You'll get a link to preview and deploy.",
		codeChangeTitle: "This requires a code change",
		codeChangeBadge: "Code change",
		connectBuilderTitle: "Connect Builder.io",
		connectBuilderDescription: "Connect Builder (free tier available) to enable cloud-based code changes from this app.",
		setupRequired: "Setup required",
		branchCreated: "Branch created",
		close: "Close"
	},
	extensions: {
		createPrompt: "Create an extension: {{prompt}}",
		createWidgetPrompt: "Create a new widget that fits in slot \"{{slotId}}\". I'll describe what it should do next.",
		whatShouldItDo: "What should it do?",
		createPlaceholder: "A todo list, API dashboard, calculator...",
		title: "Extensions",
		hiddenShown: "Hiding shown",
		showHidden: "Show hidden",
		newExtension: "New Extension",
		newExtensionTitle: "New extension",
		buildPlaceholder: "Describe what you'd like to build...",
		namePlaceholder: "My Extension",
		descriptionPlaceholder: "What does this extension do?",
		contentPlaceholder: "<html>...</html>",
		emptyTitle: "Create your first extension",
		emptyDescription: "Describe a small app and the agent will build it.",
		hiddenFromEveryone: "Hidden from everyone",
		localFile: "Local file",
		optionsFor: "Options for {{name}}",
		unhideEveryone: "Unhide for everyone",
		hideEveryone: "Hide from everyone",
		localFileDescription: "This extension is backed by {{entryPath}}. Edit or remove it from the workspace.",
		deleteQuestion: "Archive {{name}}?",
		removeQuestion: "Remove {{name}}?",
		hideForYouDescription: "This hides it from your Extensions list without deleting it for anyone else.",
		removeEverywhereDescription: "This archives it everywhere it is shared.",
		cancel: "Cancel",
		remove: "Remove",
		removing: "Removing...",
		delete: "Archive",
		deleting: "Archiving...",
		openFullView: "Open full view",
		removeFromWidgetArea: "Remove from this widget area",
		customBlockSandboxed: "Custom block · sandboxed",
		sandboxedCustomBlock: "Sandboxed SQL custom block",
		sandboxedCustomBlockCreatedBy: "Sandboxed SQL custom block created by {{email}}",
		promoteToAppCode: "Promote to app code",
		historyShowsSourceVersions: "History shows source versions",
		createdByHistoryShowsSourceVersions: "Created by {{email}}. History shows source versions.",
		createdByHistoryShowsSourceVersionsCompact: "Created by {{email}} · History shows source versions",
		deleteExtensionEllipsis: "Archive extension...",
		removeFromMyListEllipsis: "Remove from my list...",
		removeFromWidgetAreaForMe: "Remove from this widget area (for me)",
		deleteEverywhereConfirmation: "This archives the extension everywhere, for everyone it's shared with.",
		addWidget: "Add widget",
		loading: "Loading...",
		noWidgetsAvailable: "No widgets available for this slot yet.",
		buildNewWidget: "Build a new widget",
		contactSidebarWidget: "Contact sidebar widget",
		contactSidebarDescription: "Appears beside the current conversation with contact and thread context.",
		eventDetailWidget: "Event detail widget",
		eventDetailDescription: "Appears below the open calendar event with event and attendee context.",
		addWidgetHere: "Add widget here",
		back: "Back",
		editExtension: "Edit Extension",
		saving: "Saving...",
		save: "Save",
		create: "Create",
		moreOptions: "More options",
		appearsIn: "Appears in",
		noWidgetAreas: "Not installed in any widget areas. Ask the agent to add it somewhere.",
		widgetAreaCount_one: "This extension can render in {{count}} widget area.",
		widgetAreaCount_other: "This extension can render in {{count}} widget areas.",
		nameLabel: "Name",
		descriptionLabel: "Description",
		contentLabel: "Content",
		previewTitle: "Extension preview",
		previewEmpty: "Preview will appear here",
		loadError: "Couldn't load extensions.",
		widgetsLoadError: "Couldn't load widgets.",
		widgetAreasLoadError: "Couldn't load widget areas.",
		historyLoadError: "Couldn't load extension history.",
		versionLoadError: "Couldn't load this extension version.",
		retry: "Retry"
	},
	org: {
		askAdminTitle: "Ask your administrator",
		askAdminDescription: "Ask an administrator for an invitation to join this workspace.",
		appPermissions: "App permissions",
		applications: "Applications",
		applicationsEmpty: "No workspace applications are registered yet.",
		applicationsLoadFailed: "Couldn't load workspace applications.",
		applicationAccess: "Access for {{name}}",
		applicationAccessAll: "All members",
		applicationAccessRestricted: "Restricted",
		applicationAccessDisabled: "Disabled",
		appRolesOptional: "App roles",
		noAppRolesFound: "No roles found.",
		notAssigned: "Not assigned",
		resetToDefaults: "Reset to defaults",
		createTitle: "Create your organization",
		createDescription: "This app organizes your content by team. Create an organization to continue - you can invite teammates afterward.",
		loadErrorTitle: "Couldn't load organization",
		loadErrorFallback: "Couldn't load organization.",
		tryAgain: "Try again",
		sendFeedback: "Send feedback",
		feedbackPlaceholder: "Describe what happened before this organization error appeared.",
		openGitHubIssue: "Open GitHub issue",
		yourOrganization: "Your organization",
		joinYourTeam: "Join your team",
		openToDomainEmails: "Open to @{{domain}} emails",
		joinOrg: "Join {{name}}",
		pendingInvitations: "Pending invitations",
		invitedBy: "from {{name}}",
		accept: "Accept",
		createSeparate: "or create a separate organization",
		organizationName: "Organization name",
		organizationPlaceholder: "Acme Inc.",
		createOrganization: "Create organization",
		create: "Create",
		creating: "Creating...",
		team: "Team",
		createOrgCardTitle: "Create an Organization",
		createOrgCardDescription: "Set up a team to collaborate with your colleagues.",
		createOrgVaultNotice: "Vault keys aren't shared between organizations. A new organization starts with an empty vault, so you'll need to add its own API keys and credentials before connected apps work.",
		acceptInvitationOrgSwitchNotice: "Joining makes {{name}} your active organization. Connected apps will switch to {{name}}'s vault keys, so anything using keys saved in your current organization may stop working until {{name}} has its own.",
		joinDomainOne: "An organization matching your email domain already exists. Join it to collaborate with your teammates.",
		joinDomainMany: "Organizations matching your email domain already exist. Join one to collaborate with your teammates.",
		join: "Join",
		invitedByLabel: "Invited by {{name}}",
		you: "You",
		owner: "Owner",
		admin: "Admin",
		member: "Member",
		workspaceAppsDefaultPrivacy: "New app privacy",
		workspaceAppsDefaultPrivacyDescription: "Choose whether new workspace apps start private to their creator or visible to the organization.",
		workspaceAppsOrganization: "Organization",
		workspaceAppsCreatorOnly: "Creator only",
		members: "Members",
		inviteMembers: "Invite members",
		invited: "Invited",
		role: "Role",
		status: "Status",
		actions: "Actions",
		noMembers: "No members yet.",
		memberCount_one: "{{count}} member",
		memberCount_other: "{{count}} members",
		memberPagination: "Member list pagination",
		previousMemberPage: "Go to previous member page",
		nextMemberPage: "Go to next member page",
		memberPageStatus: "Page {{page}} of {{totalPages}}",
		youAreRole: "You are {{role}}",
		editGroup: "Edit group",
		createGroup: "Create group",
		groupName: "Group name",
		groupMembers: "People",
		searchPeople: "Search people",
		loadingPeople: "Loading people…",
		noPeopleFound: "No people found",
		loadMorePeople: "Load more",
		saveGroup: "Save group",
		groups: "Groups",
		newGroup: "New group",
		editGroupAria: "Edit group {{name}}",
		deleteGroupAria: "Delete group {{name}}",
		deleteGroup: "Delete group?",
		deleteGroupConfirm: "Type {{name}} to confirm.",
		deleting: "Deleting…",
		delete: "Delete",
		noGroups: "No groups yet",
		selectPage: "Select page",
		selectedMembers: "Selected members ({{count}})",
		selectMembers: "Select members",
		addToGroup: "Add to group",
		removeFromGroup: "Remove from group",
		clearSelection: "Clear",
		createGroupForBulk: "Create group",
		changeRole: "Change role",
		removeMember: "Remove member",
		transferTo: "Transfer ownership to",
		cancel: "Cancel",
		remove: "Remove",
		save: "Save",
		loading: "Loading...",
		dangerZone: "Danger zone",
		deleteOrg: "Delete organization",
		deleteOrgDescription: "Permanently deletes this organization, its members, and its pending invitations. Data owned by the organization becomes inaccessible. This cannot be undone.",
		deleteOrgConfirmPrompt: "Type {{name}} to confirm.",
		deleteOrgConfirmPlaceholder: "Organization name",
		deleteOrgConfirmCta: "Delete organization",
		deleteOrgPending: "Deleting…",
		sso: {
			signIn: "Organization sign-in",
			signInHelp: "Choose the sign-in provider members must use.",
			requiredProvider: "Required sign-in provider",
			optional: "Optional",
			google: "Google",
			title: "Single sign-on",
			description: "Connect an OIDC or SAML identity provider.",
			verified: "Verified",
			verifyRequired: "Verification required",
			verify: "Verify",
			remove: "Remove",
			type: "Identity provider type",
			providerId: "Provider ID",
			issuer: "Issuer URL",
			domain: "Organization domain",
			noDomain: "No domain configured",
			clientId: "Client ID",
			clientSecret: "Client secret",
			discoveryEndpoint: "Discovery endpoint (optional)",
			entryPoint: "SAML entry point URL",
			entityId: "IdP entity ID",
			metadata: "Paste IdP metadata XML",
			certificate: "Signing certificate (optional)",
			domainHelp: "The domain must match the organization's verified domain. Submitted secrets and metadata are cleared from this form.",
			saveProvider: "Save provider",
			cancel: "Cancel",
			addProvider: "Add provider"
		},
		scim: {
			title: "Directory provisioning",
			description: "Manage SCIM connections for this organization.",
			revoke: "Revoke",
			copyTokenOnce: "Copy this token now. It will not be shown again.",
			dismissToken: "Dismiss token",
			createConnection: "Create SCIM connection"
		},
		ssoSetup: {
			idpSetup: "Identity provider setup",
			redirectUri: "Redirect URI",
			spMetadataUrl: "Service provider metadata URL",
			dnsRecordName: "DNS TXT record name",
			dnsRecordValue: "DNS TXT record value",
			dnsPropagation: "Allow DNS changes to propagate before verifying."
		},
		ssoConfirm: {
			title: "Require this sign-in provider?",
			description: "Members will need to use this provider the next time they sign in. Current sessions may be revoked.",
			confirm: "Require provider"
		}
	},
	integrations: {
		subtitle: "Connect the tools your agent can use.",
		recommended: "Recommended",
		manage: "Manage",
		connectedSection: "Connected",
		availableSection: "Available integrations",
		webhookUrl: "Webhook URL",
		copyWebhookUrl: "Copy webhook URL",
		webhookUrlLocalOnly: "{{platform}} can't call {{url}} — that address only exists on this machine. Deploy the app, or expose this server through an HTTPS tunnel, then open this page from the public address to get a webhook URL you can paste.",
		notConfigured: "Not configured. Set the required secrets to enable this integration.",
		enable: "Enable",
		disable: "Disable",
		toggling: "...",
		networkError: "Network error reaching the server",
		back: "Back",
		agentEngineRequired: "Agent engine required",
		agentEngineDescription: "Connect Builder.io (free tier available) or an LLM key before {{platform}} can answer.",
		openLlm: "Open LLM",
		setup: "Setup",
		shareDocumentsWith: "Share documents with",
		copyServiceAccountEmail: "Copy service account email",
		requiredSecrets: "Required secrets",
		envHelp: "Set these in your .env file or environment to connect.",
		copy: "Copy",
		documentation: "Documentation",
		clientAvailable: "This agent's A2A endpoint is automatically available. No configuration needed.",
		addChatIntegration: "Add a chat integration",
		chatIntegrations: "Chat Integrations",
		chatIntegrationsDescription: "Talk to this agent from other platforms",
		addIntegration: "Add integration",
		dispatchEntrypoint: "For a central Slack or Telegram entrypoint that can route work across multiple apps, use the",
		sharedMessaging: "Need one shared messaging surface for your workspace? Connect Slack or Telegram to a dispatch app and let it delegate to other agents over A2A.",
		lookingForApiKeys: "Looking for an API key instead?",
		goToApiKeys: "Go to API keys",
		lookingForProviders: "Looking for OAuth or MCP providers?",
		goToIntegrations: "Go to Integrations"
	},
	mcpIntegrations: {
		menuLabel: "Integrations",
		menuDescription: "Connect tools and services to the agent",
		title: "Connect integrations",
		description: "Browse {{count}} agent integrations or add a custom one.",
		searchPlaceholder: "Search integrations",
		addYourOwn: "Add your own",
		noMatches: "No integrations match that search.",
		connected: "Connected",
		connectionError: "Connection error",
		connectionErrorReason: "Reason: {{reason}}",
		reconnect: "Reconnect",
		reconnecting: "Reconnecting…",
		reconnectFailed: "Reconnect failed: {{error}}",
		configure: "Configure",
		connect: "Connect",
		connectWithOAuth: "Connect",
		useApiToken: "Use API token",
		connectSuggestion: "Connect {{name}} to use it in chat",
		connectSuggestionWithApiToken: "Connect {{name}} with an API token to use it in chat",
		dismissSuggestion: "Dismiss integration suggestion",
		backToIntegrations: "Back to integrations",
		customTitle: "Add custom agent integration",
		configureTitle: "Configure {{name}}",
		presetNoAuthDescription: "Preset values are filled in. Test the endpoint or connect it now.",
		presetAuthDescription: "Preset values are filled in. Add any required authorization details before connecting.",
		customDescription: "Paste a Streamable HTTP or SSE endpoint and optional headers.",
		oauthNotice: "This provider usually requires an OAuth setup. Follow the provider docs, or add an Authorization header if your endpoint supports token-based access.",
		providerSetupRequired: "Provider setup required",
		providerSetupDescription: "Complete the required setup in {{name}} first. Then return here to connect your account.",
		providerSetupFormDescription: "Complete provider setup before connecting your account.",
		continueToConnect: "Connect my account",
		setupTitle: "Connect {{name}}",
		personal: "Personal",
		personalConnection: "Personal connection",
		organization: "Organization",
		scopeQuestion: "Who should be able to use this connection?",
		scopeChoiceTitle: "Who should use this?",
		scopeChoiceDescription: "Choose where this connection is available.",
		connectForMe: "Connect for me",
		setUpForWorkspace: "Set up for workspace",
		workspaceAdminRequired: "Workspace owner or admin required.",
		workspaceJoinRequired: "Join a workspace first.",
		personalOnlyDescription: "Only personal connections are supported for this integration.",
		workspaceOnlyDescription: "This integration connects once for the whole workspace, so it cannot be connected to just your account. A workspace owner or admin can set it up.",
		loadingScopeMetadata: "Loading connection scope…",
		retry: "Retry",
		retrying: "Retrying…",
		personalDescription: "Only you can use this connection.",
		sharedWithWorkspace: "Shared with workspace",
		organizationDescription: "Permitted workspace members can use this connection. Provider permissions still apply.",
		serverNameRequired: "Enter an integration name before connecting with OAuth.",
		serverName: "Integration name",
		url: "URL",
		fieldDescription: "Description",
		headers: "Headers",
		serverNamePlaceholder: "Integration name",
		urlPlaceholder: "https://example.com/agent-integration",
		descriptionPlaceholder: "Description (optional)",
		headersPlaceholder: "Authorization: Bearer <token>",
		openSetupDocs: "Open setup docs",
		viewSetup: "Open setup guide",
		test: "Test",
		toolsAvailable_one: "{{count}} tool available",
		toolsAvailable_other: "{{count}} tools available",
		failed: "Failed",
		docsLabel: "View {{name}} docs",
		catalog: {
			context7: {
				description: "Fetch current library docs in agent chats.",
				useCase: "Documentation, technical reference, API docs, framework guides"
			},
			sentry: {
				description: "Inspect issues, events, and debugging data.",
				useCase: "Error monitoring, debugging, performance, crash reports"
			},
			fullstory: {
				description: "Read behavioral analytics and inspect session replays.",
				useCase: "Product analytics, session replay, qualitative behavior, user research",
				setupNote: "FullStory MCP is currently beta and requires StoryAI features plus the Model Context Protocol toggle to be enabled by a FullStory organization admin."
			},
			amplitude: {
				description: "Read and work with Amplitude product analytics.",
				useCase: "Product analytics, charts, dashboards, cohorts, experiments",
				setupNote: "Amplitude MCP uses OAuth over streaming HTTP. The default endpoint is for US data residency; use Amplitude's EU endpoint when the account requires EU residency."
			},
			sigma: {
				description: "Search, explore, and analyze Sigma workbooks and dashboards.",
				useCase: "Analytics, dashboards, workbooks, data exploration, business intelligence",
				setupNote: "Sigma's MCP URL is organization-specific. In Sigma, open Profile > Integrations > Connect Sigma to AI tools, copy the URL, and paste it here. Sigma MCP currently supports search, metadata exploration, and analysis; dashboard or workbook creation and import are not exposed by this connection."
			},
			notion: {
				description: "Search pages and team knowledge.",
				useCase: "Documentation, knowledge management, notes, content creation",
				setupNote: "The Notion integration uses user OAuth. Enterprise workspaces can audit integration usage and allow or block clients; reconnect after admin policy changes."
			},
			granola: {
				description: "Search meeting notes, transcripts, and action items.",
				useCase: "Meeting notes, recordings, transcripts, action items, follow-ups",
				setupNote: "The Granola integration uses browser OAuth. Authorize the signed-in Granola account and review which meeting notes and transcripts the agent can access."
			},
			gong: {
				description: "Search Gong calls and generate account and deal insights.",
				useCase: "Sales calls, transcripts, deal insights, account summaries",
				setupNote: "Gong requires a tech admin to create an MCP integration and choose personal or shared authorization. The generated client ID and secret must be configured before connecting."
			},
			semgrep: {
				description: "Scan code for security findings.",
				useCase: "Security scanning, vulnerability detection, code analysis"
			},
			linear: {
				description: "Read and write Linear issues.",
				useCase: "Project management, issue tracking, planning, bug reports"
			},
			apollo: {
				description: "Search, enrich, and manage Apollo GTM data.",
				useCase: "Prospecting, enrichment, contacts, sequences, account research",
				setupNote: "Apollo MCP uses user OAuth and does not require an Apollo API key. Apollo plan permissions, credits, and the provider's model-training restrictions still apply."
			},
			commonRoom: {
				description: "Research buyer signals, contacts, and organizations.",
				useCase: "Buyer intelligence, product signals, intent, contact enrichment",
				setupNote: "Common Room MCP uses per-user OAuth and respects the authorized user's workspace role. An administrator may need to enable the MCP connection for the instance."
			},
			exa: {
				description: "Search the web and fetch pages with Exa.",
				useCase: "Web search, research, code search, page fetching",
				setupNote: "Exa's remote MCP endpoint supports basic free usage without a key. Add an Exa API key through the provider's header configuration when higher limits or additional tools are needed."
			},
			supabase: {
				description: "Manage data, auth, and backend services.",
				useCase: "Database, authentication, storage, edge functions"
			},
			neon: {
				description: "Work with serverless Postgres projects.",
				useCase: "Database management, serverless Postgres, data storage"
			},
			stripe: {
				description: "Manage payments, subscriptions, and customers.",
				useCase: "Payments, subscriptions, invoicing, customer management"
			},
			atlassian: {
				description: "Read and write Jira issues and Confluence content.",
				useCase: "Project management, issue tracking, documentation, team collaboration",
				setupNote: "Ask your Atlassian admin to allow the Clips app domain and enable Rovo/MCP with Read, Write, and Search permissions for your Jira site."
			},
			cloudflare: {
				description: "Search and operate Cloudflare services through its integration.",
				useCase: "DNS, Workers, domains, security, observability, platform APIs",
				setupNote: "Cloudflare's managed integration directory contains product-specific integrations as well as the broad API integration. Review the scopes and choose the narrowest endpoint that fits your workflow."
			},
			grafana: {
				description: "Query Grafana Cloud metrics, logs, and observability data.",
				useCase: "Observability, metrics, logs, traces, dashboards",
				setupNote: "Grafana Cloud MCP is in public preview and requires Grafana Cloud Assistant MCP access. It is hosted Grafana Cloud only; self-hosted Grafana needs the local MCP server."
			},
			gitlab: {
				description: "Read and manage GitLab projects, issues, and merge requests.",
				useCase: "Repositories, issues, merge requests, CI/CD, code analytics",
				setupNote: "The GitLab integration is currently beta. On GitLab.com, a top-level group admin must allow integration access before OAuth can complete; self-managed instances have an equivalent instance setting."
			},
			figma: {
				description: "Bring Figma design context and canvas actions into an agent.",
				useCase: "Design files, components, variables, design systems, canvas",
				setupNote: "The Figma integration only allows clients listed in Figma's integration catalog, so this remote endpoint cannot connect from Agent-Native yet. Use the Figma REST API fallback with a personal access token for reading file and node context; canvas actions remain unavailable until Figma approves Agent-Native."
			},
			canva: {
				description: "Search, create, and update Canva designs and assets.",
				useCase: "Designs, templates, assets, brand kits, exports, collaboration",
				setupNote: "The Canva integration uses per-user OAuth and requires clients to allow Canva's canva.com and canva.ai domains. Confirm the current redirect and client setup in Canva's integration documentation before connecting."
			},
			vercel: {
				description: "Search Vercel docs and inspect projects, deployments, and logs.",
				useCase: "Deployments, projects, logs, domains, hosting, documentation",
				setupNote: "The Vercel integration only accepts reviewed and approved AI clients. Agent-Native must be added to Vercel's supported-client list before a generic framework connection will work."
			},
			github: {
				description: "Read repositories, issues, pull requests, and code context.",
				useCase: "Repositories, issues, pull requests, code, engineering analytics",
				setupNote: "GitHub's sign-in provider does not let apps register themselves, so the Connect button cannot complete OAuth. Connect with a GitHub personal access token instead, and note that organizations may enforce OAuth App Access Policies."
			},
			slack: {
				description: "Search Slack conversations and take workspace actions through its integration.",
				useCase: "Messages, channels, people, company memory, workflows",
				setupNote: "The Slack integration requires a registered Slack app with a fixed app ID. Dynamic client registration is not supported, and only Slack Marketplace or internal apps may connect. Use Slack's managed messaging OAuth flow for Agent-Native workflows."
			},
			asana: {
				description: "Search and manage Asana tasks, projects, and work graph data.",
				useCase: "Tasks, projects, portfolios, planning, workload",
				setupNote: "Asana's agent integration requires a pre-registered OAuth app and does not support dynamic client registration. Configure an Asana app client before connecting."
			},
			hubspot: {
				description: "Search and update HubSpot CRM records through its integration.",
				useCase: "CRM, contacts, companies, deals, tickets, customer analytics",
				setupNote: "When a workspace-managed HubSpot MCP Auth App is configured, any member can connect a personal HubSpot account with OAuth and PKCE. Otherwise, create the app in the HubSpot Developer Platform before connecting; the existing HubSpot OAuth connector remains available to app actions."
			},
			pylon: {
				description: "Search and update Pylon support data.",
				useCase: "Customer support, issues, accounts, contacts, conversations",
				setupNote: "Enable Pylon MCP access for the relevant users and turn on the MCP server in Pylon before connecting. Pylon requires a Member or Admin seat and uses user OAuth only."
			},
			intercom: {
				description: "Search conversations and customer support knowledge.",
				useCase: "Customer support, conversations, contacts, help center content",
				setupNote: "The Intercom integration uses OAuth and is available for US-hosted workspaces. Confirm the workspace region and requested scopes during authorization."
			},
			monday: {
				description: "Work with boards, items, and team workflows.",
				useCase: "Work management, boards, projects, tasks, team operations",
				setupNote: "The monday.com integration uses OAuth over Streamable HTTP. Choose the workspace and permissions to share during authorization."
			},
			webflow: {
				description: "Read and update Webflow sites and content.",
				useCase: "Websites, CMS, site content, publishing, design workflows",
				setupNote: "The Webflow integration uses OAuth. Designer capabilities may install Webflow's Bridge App during authorization; Data API access is available separately."
			},
			paypal: {
				description: "Work with PayPal payments, invoices, and commerce data.",
				useCase: "Payments, invoices, transactions, merchant operations",
				setupNote: "PayPal exposes OAuth discovery and login for its remote agent integration. Agent-Native uses the currently live /sse endpoint; review the merchant permissions before authorizing."
			},
			box: {
				description: "Search and manage files and folders in Box.",
				useCase: "Files, folders, enterprise content, search, collaboration",
				setupNote: "The Box integration is beta and requires an administrator to enable it. Custom clients also need Box Integration Credentials, a redirect URI, and approved scopes."
			},
			builder: {
				description: "Search Builder Publish and Hybrid Space content.",
				useCase: "Content models, pages, entries, Publish and Hybrid Spaces",
				setupNote: "Builder CMS MCP uses OAuth with dynamic client registration. It only connects to Publish or Hybrid Spaces, and the authorization flow asks you to select the Space."
			},
			netlify: {
				description: "Inspect and operate Netlify sites and deployments.",
				useCase: "Sites, deployments, builds, domains, hosting operations",
				setupNote: "Netlify documents a remote integration setup for supported clients. Review the site and team permissions before completing OAuth."
			},
			zapier: {
				description: "Connect tools to thousands of app actions.",
				useCase: "Automation, workflows, app actions, cross-service operations",
				setupNote: "Zapier's agent integration uses a user-created connection and token for unlisted clients. Create the connection in Zapier, then paste its generated bearer token into the header field."
			}
		},
		auth: {
			none: "No auth",
			headers: "Header",
			oauth: "OAuth"
		},
		status: {
			beta: "Beta",
			setupRequired: "Provider setup",
			clientRestricted: "Approved clients only",
			verified: "Verified",
			preflightOnly: "Preflight only",
			restricted: "Restricted"
		}
	},
	observability: {
		noData: "No data available",
		noConversations: "No conversations recorded yet",
		noEvals: "No eval results recorded yet",
		noExperiments: "No experiments created yet",
		totalRuns: "Total runs",
		totalCost: "Total cost",
		avgLatency: "Avg latency",
		toolSuccess: "Tool success",
		thumbsUp: "Thumbs up",
		avgEvalScore: "Avg eval score",
		run: "Run",
		model: "Model",
		duration: "Duration",
		cost: "Cost",
		tools: "Tools",
		time: "Time",
		failedCount: "({{count}} failed)",
		backToList: "Back to list",
		spans: "Spans",
		type: "Type",
		name: "Name",
		tokens: "Tokens",
		status: "Status",
		totalEvals: "Total evals",
		avgScore: "Avg score",
		scoresByCriteria: "Scores by criteria",
		overview: "Overview",
		conversations: "Conversations",
		evals: "Evals",
		experiments: "Experiments",
		feedback: "Feedback",
		variants: "Variants",
		created: "Created",
		backToExperiments: "Back to experiments",
		metrics: "Metrics",
		level: "Level",
		results: "Results",
		variant: "Variant",
		metric: "Metric",
		value: "Value",
		totalFeedback: "Total feedback",
		thumbsDown: "Thumbs down",
		frustration: "Frustration",
		thumbsUpRate: "Thumbs up rate",
		categories: "Categories"
	},
	error: {
		genericTitle: "Something went wrong",
		genericDetails: "An unexpected error occurred.",
		notFoundTitle: "Page not found",
		notFoundDetails: "This page doesn't exist. It may have been moved or deleted.",
		statusTitle: "{{status}} Error",
		goHome: "Go home"
	},
	runtimeConfig: {
		issue_one: "{{count}} issue",
		issue_other: "{{count}} issues",
		errorTitle: "Configuration error",
		warningTitle: "Configuration warning",
		showDetails: "Show details",
		hideDetails: "Hide details",
		copyPrompt: "Copy prompt",
		copied: "Copied",
		copyFailed: "Copy failed"
	}
};
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/utils.js
/** Merge class names with clsx + tailwind-merge. */
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/i18n.js
function isAgentNativeI18nModuleNamespace(value) {
	return Object.prototype.toString.call(value) === "[object Module]";
}
async function loadAgentNativeI18nLocale(loader) {
	if (!loader) return null;
	const loaded = await loader();
	return isAgentNativeI18nModuleNamespace(loaded) ? loaded.default : loaded;
}
function catalogLocaleMetadata(locales) {
	return Object.fromEntries((locales ?? []).flatMap((metadata) => {
		if (!isValidLocaleCode(metadata.code)) return [];
		const code = normalizeLocaleCode(metadata.code, [metadata.code]);
		return code ? [[code, {
			...metadata,
			code
		}]] : [];
	}));
}
var LocaleContext = globalThis.__AGENT_NATIVE_LOCALE_CONTEXT__ ?? (globalThis.__AGENT_NATIVE_LOCALE_CONTEXT__ = (0, import_react.createContext)(null));
function browserLanguageCandidates() {
	if (typeof navigator === "undefined") return [];
	return navigator.languages?.length ? [...navigator.languages] : navigator.language ? [navigator.language] : [];
}
function readStoredPreference(supportedLocales) {
	if (typeof window === "undefined") return null;
	try {
		return normalizeLocalizationPreference(window.localStorage.getItem(LOCALE_STORAGE_KEY), supportedLocales).locale;
	} catch {
		return null;
	}
}
function writeStoredPreference(preference) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(LOCALE_STORAGE_KEY, preference);
	} catch {}
}
function readHydrationPayload() {
	if (typeof window === "undefined") return {};
	return window["__AGENT_NATIVE_LOCALE__"] ?? {};
}
function resolveInitialState(args) {
	const hydration = readHydrationPayload();
	const preference = normalizeLocalizationPreference(args.initialPreference ?? hydration.preference ?? readStoredPreference(args.supportedLocales), args.supportedLocales).locale;
	return {
		locale: normalizeLocaleCode(args.initialLocale ?? hydration.locale ?? resolveLocaleFromPreference(preference, browserLanguageCandidates(), args.supportedLocales), args.supportedLocales) ?? args.sourceLocale,
		preference
	};
}
function resolveSupportedLocales(args) {
	const configured = injectedAgentNativeConfig().translations?.locales;
	const catalogLocales = args.catalog?.locales?.map(({ code }) => code) ?? [];
	const sourceCandidates = [...configured ?? [...args.catalog?.supportedLocales ?? SUPPORTED_LOCALES, ...catalogLocales], args.sourceLocale];
	const supported = sourceCandidates.map((locale) => normalizeLocaleCode(locale, sourceCandidates)).filter((locale) => locale !== null);
	const sourceLocale = normalizeLocaleCode(args.sourceLocale, sourceCandidates) ?? "en-US";
	return [sourceLocale, ...supported.filter((locale) => locale !== sourceLocale)].filter((locale, index, all) => all.indexOf(locale) === index);
}
function resolveSupportedLocale(locale, supportedLocales, sourceLocale) {
	return supportedLocales.includes(locale) ? locale : sourceLocale;
}
function normalizeLoadedMessages(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const maybeDefault = value.default;
	if (maybeDefault && typeof maybeDefault === "object" && !Array.isArray(maybeDefault)) return maybeDefault;
	return value;
}
function mergeLocaleMessages(base, overrides) {
	if (!overrides) return base;
	const merged = { ...base };
	for (const [key, value] of Object.entries(overrides)) {
		const current = merged[key];
		if (current && value && typeof current === "object" && typeof value === "object" && !Array.isArray(current) && !Array.isArray(value)) merged[key] = mergeLocaleMessages(current, value);
		else merged[key] = value;
	}
	return merged;
}
function composeLocaleMessages(coreMessages, appMessages) {
	return mergeLocaleMessages(mergeLocaleMessages(messages, coreMessages), appMessages ? normalizeCoreMessageOverrides(appMessages) : null);
}
function createI18nInstance(args) {
	const instance$1 = instance.createInstance();
	const resources = { [args.sourceLocale]: { [args.namespace]: composeLocaleMessages(coreMessagesForLocale(args.sourceLocale), args.messages) } };
	if (args.initialLocale !== args.sourceLocale) resources[args.initialLocale] = { [args.namespace]: composeLocaleMessages(coreMessagesForLocale(args.initialLocale), args.initialMessages) };
	instance$1.use(initReactI18next).init({
		resources,
		lng: args.initialLocale,
		fallbackLng: args.sourceLocale,
		defaultNS: args.namespace,
		ns: [args.namespace],
		interpolation: { escapeValue: false },
		react: { useSuspense: false },
		returnNull: false,
		initAsync: false
	});
	return instance$1;
}
/**
* Runtime half of the i18n provider. `sessionAuthenticated` only matters when
* `persistPreference` is true: the preference read and the app-state write
* are authenticated server calls, so a signed-out visitor skips them instead
* of logging 401 console errors on every load.
*/
function I18nRuntime({ children, catalog, initialLocale, initialPreference, initialMessages, persistPreference = true, sessionAuthenticated }) {
	const namespace = catalog?.namespace ?? "translation";
	const sourceLocale = catalog?.sourceLocale ?? "en-US";
	const sourceMessages = catalog?.messages ?? {};
	const loadMessages = catalog?.loadMessages;
	const coreMessageOverrides = catalog?.coreMessageOverrides;
	const localeMetadata = (0, import_react.useMemo)(() => catalogLocaleMetadata(catalog?.locales), [catalog?.locales]);
	const supportedLocales = (0, import_react.useMemo)(() => resolveSupportedLocales({
		catalog,
		sourceLocale
	}), [catalog, sourceLocale]);
	const hydration = readHydrationPayload();
	const initialState = (0, import_react.useMemo)(() => resolveInitialState({
		initialLocale,
		initialPreference,
		sourceLocale,
		supportedLocales
	}), [
		initialLocale,
		initialPreference,
		sourceLocale,
		supportedLocales
	]);
	const [preference, setPreferenceState] = (0, import_react.useState)(initialState.preference);
	const [locale, setLocale] = (0, import_react.useState)(initialState.locale);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const i18nRef = (0, import_react.useRef)(null);
	const appMessagesLoadedRef = (0, import_react.useRef)(null);
	const appMessagesRef = (0, import_react.useRef)(null);
	const coreMessagesLoadedRef = (0, import_react.useRef)(null);
	if (!i18nRef.current) {
		const preloadedMessages = normalizeLoadedMessages(hydration.locale === initialState.locale && hydration.messages ? hydration.messages : initialMessages);
		const resolvedSourceMessages = normalizeCoreMessageOverrides(hydration.locale === sourceLocale && hydration.messages ? hydration.messages : sourceMessages);
		i18nRef.current = createI18nInstance({
			namespace,
			sourceLocale,
			messages: resolvedSourceMessages,
			initialLocale: initialState.locale,
			initialMessages: preloadedMessages
		});
		appMessagesRef.current = /* @__PURE__ */ new Map([[sourceLocale, resolvedSourceMessages]]);
		appMessagesLoadedRef.current = /* @__PURE__ */ new Set([sourceLocale]);
		if (initialState.locale !== sourceLocale && preloadedMessages) {
			appMessagesRef.current.set(initialState.locale, normalizeCoreMessageOverrides(preloadedMessages));
			appMessagesLoadedRef.current.add(initialState.locale);
		}
		coreMessagesLoadedRef.current = new Set([sourceLocale, initialState.locale].filter((candidate) => candidate === DEFAULT_LOCALE));
	}
	const i18n = i18nRef.current;
	(0, import_react.useEffect)(() => {
		if (i18n.hasResourceBundle(sourceLocale, namespace)) {
			const normalizedSourceMessages = normalizeCoreMessageOverrides(sourceMessages);
			appMessagesRef.current?.set(sourceLocale, normalizedSourceMessages);
			i18n.addResourceBundle(sourceLocale, namespace, normalizedSourceMessages, true, true);
		}
	}, [
		i18n,
		namespace,
		sourceLocale,
		sourceMessages
	]);
	(0, import_react.useEffect)(() => {
		const nextLocale = preference === "system" ? resolveLocaleFromCandidates(browserLanguageCandidates(), supportedLocales) : preference;
		setLocale(resolveSupportedLocale(nextLocale, supportedLocales, sourceLocale));
	}, [
		preference,
		sourceLocale,
		supportedLocales
	]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function applyLocale() {
			setLoading(true);
			try {
				const shouldLoadAppMessages = locale !== sourceLocale && !appMessagesLoadedRef.current?.has(locale);
				const shouldLoadCoreMessages = !coreMessagesLoadedRef.current?.has(locale);
				if (shouldLoadAppMessages || shouldLoadCoreMessages) {
					const preloaded = hydration.locale === locale && hydration.messages ? hydration.messages : initialLocale === locale && initialMessages ? initialMessages : null;
					const [coreMessages, loadedAppMessages, loadedCoreOverrides] = await Promise.all([
						shouldLoadCoreMessages ? loadCoreMessagesForLocale(locale) : Promise.resolve({}),
						shouldLoadAppMessages ? Promise.resolve(preloaded ?? loadMessages?.(locale)) : Promise.resolve(null),
						shouldLoadCoreMessages ? loadAgentNativeI18nLocale(coreMessageOverrides?.[locale]) : Promise.resolve(null)
					]);
					const existingMessages = normalizeLoadedMessages(i18n.getResourceBundle(locale, namespace));
					const loadedMessages = normalizeLoadedMessages(loadedAppMessages);
					if (loadedMessages) appMessagesRef.current?.set(locale, normalizeCoreMessageOverrides(loadedMessages));
					const appMessages = appMessagesRef.current?.get(locale) ?? null;
					const resolvedCoreMessages = mergeLocaleMessages(coreMessages, loadedCoreOverrides ? normalizeCoreMessageOverrides(loadedCoreOverrides) : null);
					const nextMessages = shouldLoadCoreMessages ? composeLocaleMessages(resolvedCoreMessages, appMessages) : mergeLocaleMessages(existingMessages ?? {}, appMessages);
					i18n.addResourceBundle(locale, namespace, nextMessages, true, true);
					if (shouldLoadCoreMessages) coreMessagesLoadedRef.current?.add(locale);
					if (shouldLoadAppMessages) appMessagesLoadedRef.current?.add(locale);
				}
				if (!cancelled) await i18n.changeLanguage(locale);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		applyLocale();
		return () => {
			cancelled = true;
		};
	}, [
		hydration.locale,
		hydration.messages,
		i18n,
		initialLocale,
		initialMessages,
		coreMessageOverrides,
		loadMessages,
		localeMetadata,
		locale,
		namespace,
		sourceLocale,
		supportedLocales
	]);
	(0, import_react.useEffect)(() => {
		if (typeof document === "undefined") return;
		const dir = localeDirection(locale, localeMetadata);
		const root = document.documentElement;
		root.setAttribute("lang", locale);
		root.setAttribute("dir", dir);
		root.setAttribute("data-locale", locale);
	}, [locale, localeMetadata]);
	(0, import_react.useEffect)(() => {
		if (!persistPreference || !sessionAuthenticated) return;
		let cancelled = false;
		callAction("get-localization-preference", void 0, { method: "GET" }).then((value) => {
			if (cancelled) return;
			const normalized = normalizeLocalizationPreference(value, supportedLocales).locale;
			setPreferenceState(normalized);
			writeStoredPreference(normalized);
		}).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [
		persistPreference,
		sessionAuthenticated,
		supportedLocales
	]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const onStorage = (event) => {
			if (event.key !== "agent-native:locale-preference" || event.newValue == null) return;
			setPreferenceState(normalizeLocalizationPreference(event.newValue, supportedLocales).locale);
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, [supportedLocales]);
	(0, import_react.useEffect)(() => {
		if (!persistPreference || !sessionAuthenticated) return;
		setClientAppState("localization", {
			locale,
			preference,
			dir: localeDirection(locale, localeMetadata)
		}, { requestSource: "localization" }).catch(() => {});
	}, [
		locale,
		localeMetadata,
		persistPreference,
		preference,
		sessionAuthenticated
	]);
	const setPreference = (0, import_react.useCallback)(async (next) => {
		const normalized = normalizeLocalizationPreference(next, supportedLocales).locale;
		setPreferenceState(normalized);
		writeStoredPreference(normalized);
		if (!persistPreference) return;
		try {
			await callAction("set-localization-preference", { locale: normalized });
		} catch (error) {
			const status = error?.status;
			if (status !== 401 && status !== 403) throw error;
		}
	}, [persistPreference, supportedLocales]);
	const context = (0, import_react.useMemo)(() => ({
		locale,
		sourceLocale,
		preference,
		dir: localeDirection(locale, localeMetadata),
		metadata: localeMetadataFor(locale, localeMetadata),
		localeMetadata,
		setPreference,
		loading,
		supportedLocales
	}), [
		loading,
		locale,
		preference,
		setPreference,
		sourceLocale,
		supportedLocales,
		localeMetadata
	]);
	return (0, import_jsx_runtime.jsx)(LocaleContext.Provider, {
		value: context,
		children: (0, import_jsx_runtime.jsx)(I18nextProvider, {
			i18n,
			children
		})
	});
}
/**
* Session-aware variant: only mounts the session hook (and therefore only
* ever resolves the shared session) on surfaces that persist preferences.
* AppProviders defaults public paths to the non-persisting variant, so a
* public page never resolves the session for localization; a persisting
* surface pays one deduped session probe and skips the preference read and
* app-state write until the session confirms, which is what keeps anonymous
* visits free of localization 401s.
*/
function SessionAwareI18nRuntime(props) {
	const { status } = useSession();
	return (0, import_jsx_runtime.jsx)(I18nRuntime, {
		...props,
		sessionAuthenticated: status === "authenticated"
	});
}
function AgentNativeI18nProvider(props) {
	if (props.persistPreference === false) return (0, import_jsx_runtime.jsx)(I18nRuntime, {
		...props,
		sessionAuthenticated: true
	});
	return (0, import_jsx_runtime.jsx)(SessionAwareI18nRuntime, {
		...props,
		persistPreference: true
	});
}
function useOptionalLocale() {
	return (0, import_react.useContext)(LocaleContext);
}
var CORE_FALLBACK_MESSAGES = {
	...Object.fromEntries(Object.entries(englishAgentChatMessages).map(([key, value]) => [`agentChat.${key}`, value])),
	"runsTray.runs": "Runs",
	"runsTray.agentRuns": "Agent runs",
	"runsTray.activeRun_one": "{{count}} active run",
	"runsTray.activeRun_other": "{{count}} active runs",
	"runsTray.failedRun_one": "{{count}} failed run",
	"runsTray.failedRun_other": "{{count}} failed runs",
	"runsTray.recentRuns": "Recent runs",
	"runsTray.noRecentRuns": "No recent runs",
	"runsTray.ariaAgentRuns": "Agent runs, {{label}}",
	"runsTray.summaryRunning": "{{activeCount}} running",
	"runsTray.summaryRunningRecent": "{{activeCount}} running · {{terminalCount}} recent",
	"runsTray.summaryRecent_one": "{{count}} recent run",
	"runsTray.summaryRecent_other": "{{count}} recent runs",
	"runsTray.noTrackedWorkYet": "No tracked work yet",
	"runsTray.emptyDescription": "Background agent work will appear here while it runs and after it finishes.",
	"runsTray.open": "Open",
	"runsTray.stopRun": "Stop {{title}}",
	"runsTray.hideRun": "Hide {{title}}",
	"runsTray.statusRunning": "Running",
	"runsTray.statusDone": "Done",
	"runsTray.statusFailed": "Failed",
	"runsTray.statusStopped": "Stopped",
	"runsTray.statusNeedsApproval": "Needs approval",
	"runsTray.statusNeedsInput": "Needs input",
	"runsTray.statusPaused": "Paused",
	"runsTray.updatedJustNow": "Updated just now",
	"runsTray.finishedJustNow": "Finished just now",
	"runsTray.updatedMinutes": "Updated {{count}}m ago",
	"runsTray.finishedMinutes": "Finished {{count}}m ago",
	"runsTray.updatedHours": "Updated {{count}}h ago",
	"runsTray.finishedHours": "Finished {{count}}h ago",
	"runsTray.updatedDate": "Updated {{date}}",
	"runsTray.finishedDate": "Finished {{date}}",
	"agentTask.spawnedAgent": "Spawned agent",
	"agentTask.stop": "Stop spawned agent",
	"agentTask.openThread": "Open task thread",
	"codeRequired.fallbackDetail": "Edit locally or use Builder.io to edit this code in the cloud and continue customizing the app any way you like.",
	"codeRequired.defaultFeature": "Make the requested code changes to this app",
	"codeRequired.branchError": "Failed to create branch",
	"codeRequired.title": "Code changes required",
	"codeRequired.subtitleWithFeature": "\"{{feature}}\" creates or modifies source code, which needs Desktop or Builder from this surface.",
	"codeRequired.subtitle": "This action creates or modifies source code, which needs Desktop or Builder from this surface.",
	"codeRequired.desktopTitle": "Use Agent-Native Desktop",
	"codeRequired.desktopDescription": "Open the project in the desktop app to enable source edits and CLI access.",
	"codeRequired.builderAgentTitle": "Use Builder.io Agent",
	"codeRequired.builderAgentDescription": "Let our cloud agent make the changes for you. You'll get a link to preview and deploy.",
	"codeRequired.codeChangeTitle": "This requires a code change",
	"codeRequired.codeChangeBadge": "Code change",
	"codeRequired.connectBuilderTitle": "Connect Builder.io",
	"codeRequired.connectBuilderDescription": "Connect Builder (free tier available) to enable cloud-based code changes from this app.",
	"codeRequired.setupRequired": "Setup required",
	"codeRequired.branchCreated": "Branch created",
	"codeRequired.close": "Close",
	"agentPanel.useBuilder": "Use Builder",
	"agentPanel.openDesktopToEditCode": "Open Desktop to edit code",
	"agentPanel.codeUnavailableDescription": "Source-code changes and CLI access are available in the Agent-Native Desktop app.",
	"agentPanel.downloadDesktop": "Download Desktop",
	"agentPanel.chatMode": "Chat mode",
	"agentPanel.chat": "Chat",
	"agentPanel.cliTerminalMode": "CLI terminal mode",
	"agentPanel.cli": "CLI",
	"agentPanel.workspaceMode": "Files, agents, skills, and tasks",
	"agentPanel.workspace": "Resources",
	"agentPanel.newChat": "New chat",
	"agentPanel.newTerminal": "New terminal",
	"agentPanel.panelOptions": "Agent panel options",
	"agentPanel.collapseSidebar": "Collapse sidebar",
	"agentPanel.hideChats": "Hide chats",
	"agentPanel.allChats": "All chats",
	"agentPanel.settings": "Settings",
	"agentPanel.feedback": "Feedback",
	"agentPanel.exitFullscreen": "Exit fullscreen",
	"agentPanel.fullscreen": "Fullscreen",
	"agentPanel.closeTab": "Close tab",
	"agentPanel.closeOtherTabs": "Close other tabs",
	"agentPanel.closeAllTabs": "Close all tabs",
	"agentPanel.clearChat": "Clear chat",
	"agentPanel.cliRequiresDevMode": "CLI requires dev mode",
	"agentPanel.cliRequiresDevModeDescription": "Run this app locally with pnpm dev or use Builder.io to access the CLI terminal.",
	"agentPanel.toggleAgent": "Toggle agent",
	"runtimeConfig.warningTitle": "Production configuration warning",
	"runtimeConfig.errorTitle": "Production configuration error",
	"runtimeConfig.issue_one": "{{count}} issue",
	"runtimeConfig.issue_other": "{{count}} issues",
	"runtimeConfig.showDetails": "Show configuration details",
	"runtimeConfig.hideDetails": "Hide configuration details",
	"runtimeConfig.copyPrompt": "Copy prompt for AI",
	"runtimeConfig.copied": "Prompt copied",
	"runtimeConfig.copyFailed": "Copy failed"
};
function flattenMessages(value, prefix = "", out = {}) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return out;
	for (const [key, child] of Object.entries(value)) {
		const nextKey = prefix ? `${prefix}.${key}` : key;
		if (typeof child === "string") out[nextKey] = child;
		else flattenMessages(child, nextKey, out);
	}
	return out;
}
var DEFAULT_ENGLISH_MESSAGES = flattenMessages(messages);
function interpolateFallbackMessage(template, options) {
	return template.replace(/\{\{(\w+)\}\}/g, (_, name) => {
		const value = options?.[name];
		return value == null ? "" : String(value);
	});
}
function humanizeFallbackKey(key) {
	const words = (key.split(".").filter(Boolean).pop() ?? key).replace(/[_-]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").trim().toLowerCase();
	return words ? words.charAt(0).toUpperCase() + words.slice(1) : key;
}
function fallbackMessage(key, options) {
	const count = Number(options?.count);
	const pluralKey = Number.isFinite(count) && count === 1 ? `${key}_one` : `${key}_other`;
	const template = DEFAULT_ENGLISH_MESSAGES[pluralKey] ?? DEFAULT_ENGLISH_MESSAGES[key] ?? CORE_FALLBACK_MESSAGES[pluralKey] ?? CORE_FALLBACK_MESSAGES[key];
	return template ? interpolateFallbackMessage(template, options) : humanizeFallbackKey(key);
}
function preserveTranslatedUserValues(translated, options) {
	const defaultValue = options?.defaultValue;
	return typeof defaultValue === "string" && translated === defaultValue ? interpolateFallbackMessage(defaultValue, options) : translated;
}
function useT() {
	const { i18n, t } = useTranslation();
	const sourceLocale = (0, import_react.useContext)(LocaleContext)?.sourceLocale ?? "en-US";
	return (0, import_react.useCallback)((key, options) => {
		const translated = t(key, options);
		if (translated !== key) return preserveTranslatedUserValues(translated, options);
		const getFixedT = i18n.getFixedT;
		const sourceFallback = getFixedT?.(sourceLocale)(key, options);
		if (sourceFallback && sourceFallback !== key) return preserveTranslatedUserValues(sourceFallback, options);
		return fallbackMessage(key, options);
	}, [
		i18n,
		sourceLocale,
		t
	]);
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/onboarding/first-run-enabled.js
var FIRST_RUN_ONBOARDING_ENV_KEY = "VITE_AGENT_NATIVE_FIRST_RUN_ONBOARDING";
var FIRST_RUN_ONBOARDING_SKIP_INTEGRATIONS_ENV_KEY = "VITE_AGENT_NATIVE_FIRST_RUN_ONBOARDING_SKIP_INTEGRATIONS";
function isEnabled(value) {
	return value === true || typeof value === "string" && ["1", "true"].includes(value.trim().toLowerCase());
}
function isFirstRunOnboardingEnabled(env = {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"SSR": true
}, config = injectedAgentNativeConfig()) {
	return resolveFirstRunOnboardingMode(env, config) !== "off";
}
function shouldSkipFirstRunIntegrations(env = {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"SSR": true
}, config = injectedAgentNativeConfig()) {
	if (env[FIRST_RUN_ONBOARDING_SKIP_INTEGRATIONS_ENV_KEY] !== void 0) return isEnabled(env[FIRST_RUN_ONBOARDING_SKIP_INTEGRATIONS_ENV_KEY]);
	return resolveFirstRunOnboardingMode(env, config) === "connect";
}
function resolveFirstRunOnboardingMode(env = {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"SSR": true
}, config = injectedAgentNativeConfig()) {
	const envOnboarding = env[FIRST_RUN_ONBOARDING_ENV_KEY];
	if (envOnboarding !== void 0) {
		if (!isEnabled(envOnboarding)) return "off";
		return isEnabled(env[FIRST_RUN_ONBOARDING_SKIP_INTEGRATIONS_ENV_KEY]) ? "connect" : "connect-and-integrations";
	}
	const configured = config.onboarding?.firstRun;
	if (configured === "connect" || configured === "connect-and-integrations") return isEnabled(env[FIRST_RUN_ONBOARDING_SKIP_INTEGRATIONS_ENV_KEY]) ? "connect" : configured;
	return "off";
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/onboarding/first-run-status.js
var FIRST_RUN_ONBOARDING_STATUS_RESOLVED_EVENT = "agent-native:first-run-status-resolved";
var FIRST_RUN_STATUS_TIMEOUT_MS = 1e4;
var firstRunStatusRequest = null;
function dispatchFirstRunOnboardingStatus(firstRun) {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent(FIRST_RUN_ONBOARDING_STATUS_RESOLVED_EVENT, { detail: { firstRun } }));
}
async function requestFirstRunOnboardingStatus() {
	const controller = typeof AbortController === "undefined" ? null : new AbortController();
	let timeoutId;
	const timeout = new Promise((_, reject) => {
		timeoutId = setTimeout(() => {
			controller?.abort();
			reject(/* @__PURE__ */ new Error("first-run status timed out"));
		}, FIRST_RUN_STATUS_TIMEOUT_MS);
	});
	try {
		const firstRun = await Promise.race([(async () => {
			const response = await fetch(agentNativePath("/_agent-native/onboarding/first-run/status"), {
				cache: "no-store",
				credentials: "same-origin",
				...controller ? { signal: controller.signal } : {}
			});
			if (!response.ok) throw new Error(`first-run status: ${response.status}`);
			return (await response.json()).firstRun === true;
		})(), timeout]);
		dispatchFirstRunOnboardingStatus(firstRun);
		return firstRun;
	} catch (error) {
		dispatchFirstRunOnboardingStatus(false);
		throw error;
	} finally {
		if (timeoutId !== void 0) clearTimeout(timeoutId);
	}
}
/** Save the optional role selected during the shared first-run flow. */
async function saveFirstRunOnboardingRole(role) {
	const response = await fetch(agentNativePath("/_agent-native/onboarding/first-run/role"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ role })
	});
	if (!response.ok) throw new Error(`first-run role save failed: ${response.status}`);
}
/** Fetch the server-owned first-run decision and notify other initial flows. */
function fetchFirstRunOnboardingStatus() {
	if (firstRunStatusRequest) return firstRunStatusRequest;
	firstRunStatusRequest = requestFirstRunOnboardingStatus().finally(() => {
		firstRunStatusRequest = null;
	});
	return firstRunStatusRequest;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/onboarding/use-onboarding.js
var seenOnboardingEvents = /* @__PURE__ */ new Set();
function trackOnboardingEvent(name, properties) {
	if (typeof window === "undefined") return;
	const key = [
		getAnalyticsIdentityKey() ?? "anonymous",
		name,
		properties.flow,
		properties.step_id,
		properties.extension_id,
		properties.integration_id,
		properties.role
	].map((value) => String(value ?? "")).join(":");
	const isRepeatableInteraction = name.startsWith("integration_") || name === "onboarding_method_clicked" || name === "onboarding_dismissed" || name === "onboarding_reopened";
	if (!isRepeatableInteraction && seenOnboardingEvents.has(key)) return;
	if (!isRepeatableInteraction) seenOnboardingEvents.add(key);
	trackEvent(name, properties);
}
function useOnboarding(options = {}) {
	const preview = options.preview === true;
	const initialFirstRun = options.initialFirstRun === true;
	const [steps, setSteps] = (0, import_react.useState)([]);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [dismissed, setDismissed] = (0, import_react.useState)(false);
	const [firstRun, setFirstRun] = (0, import_react.useState)(preview || initialFirstRun);
	const [completeFirstRunError, setCompleteFirstRunError] = (0, import_react.useState)(null);
	const stepsRef = (0, import_react.useRef)([]);
	const mountedRef = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		setFirstRun(preview || initialFirstRun);
	}, [initialFirstRun, preview]);
	const fetchAll = (0, import_react.useCallback)(async () => {
		try {
			const summaryUrl = agentNativePath(preview ? "/_agent-native/onboarding/summary?preview=1" : "/_agent-native/onboarding/summary");
			const firstRunPromise = preview ? Promise.resolve(true).then((value) => {
				dispatchFirstRunOnboardingStatus(value);
				return value;
			}) : initialFirstRun ? Promise.resolve(true) : fetchFirstRunOnboardingStatus();
			const [summaryRes, firstRunRes] = await Promise.all([fetch(summaryUrl), firstRunPromise]);
			if (!mountedRef.current) return;
			if (!summaryRes.ok) throw new Error(`summary: ${summaryRes.status}`);
			const summary = await summaryRes.json();
			const previousSteps = stepsRef.current;
			if (previousSteps.length > 0) for (const [stepIndex, step] of summary.steps.entries()) {
				const previousStep = previousSteps.find((previous) => previous.id === step.id);
				if (step.complete && !previousStep?.complete) trackOnboardingEvent("onboarding_step_completed", {
					flow: "checklist",
					step_id: step.id,
					step_index: stepIndex
				});
			}
			stepsRef.current = summary.steps;
			setSteps(summary.steps);
			setProfile(summary.profile);
			if (preview) setFirstRun(true);
			else if (!initialFirstRun) setFirstRun(firstRunRes === true);
			setDismissed(!!summary.dismissed);
			setError(null);
		} catch (e) {
			if (!mountedRef.current) return;
			setError(e instanceof Error ? e.message : "Failed to load onboarding");
		} finally {
			if (mountedRef.current) setLoading(false);
		}
	}, [preview]);
	(0, import_react.useEffect)(() => {
		mountedRef.current = true;
		let initialFetchRan = false;
		const cancelInitialFetch = scheduleAfterPaint(() => {
			initialFetchRan = true;
			if (mountedRef.current) fetchAll();
		});
		const refetchOnFocus = () => {
			if (!initialFetchRan) {
				initialFetchRan = true;
				cancelInitialFetch();
			}
			fetchAll();
		};
		const onVisibility = () => {
			if (document.visibilityState === "visible") refetchOnFocus();
		};
		const onFocus = () => refetchOnFocus();
		document.addEventListener("visibilitychange", onVisibility);
		window.addEventListener("focus", onFocus);
		return () => {
			mountedRef.current = false;
			cancelInitialFetch();
			document.removeEventListener("visibilitychange", onVisibility);
			window.removeEventListener("focus", onFocus);
		};
	}, [fetchAll]);
	const complete = (0, import_react.useCallback)(async (id) => {
		const response = await fetch(agentNativePath(`/_agent-native/onboarding/steps/${encodeURIComponent(id)}/complete`), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{}"
		});
		if (!response.ok) throw new Error(`onboarding step failed: ${response.status}`);
		trackOnboardingEvent("onboarding_step_completed", {
			flow: "checklist",
			step_id: id
		});
		await fetchAll();
	}, [fetchAll]);
	const dismiss = (0, import_react.useCallback)(async () => {
		setDismissed(true);
		const currentStepIndex = steps.findIndex((step) => !step.complete);
		const currentStep = steps[currentStepIndex];
		trackOnboardingEvent("onboarding_dismissed", {
			flow: "checklist",
			...currentStepIndex >= 0 ? {
				step_id: currentStep?.id,
				step_index: currentStepIndex
			} : {},
			reason: "user_action"
		});
		await fetch(agentNativePath("/_agent-native/onboarding/dismiss"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{}"
		});
		await fetchAll();
	}, [fetchAll, steps]);
	const reopen = (0, import_react.useCallback)(async () => {
		setDismissed(false);
		trackOnboardingEvent("onboarding_reopened", {
			flow: "checklist",
			reason: "user_action"
		});
		await fetch(agentNativePath("/_agent-native/onboarding/reopen"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{}"
		});
		await fetchAll();
	}, [fetchAll]);
	const completeFirstRun = (0, import_react.useCallback)(async () => {
		if (preview) {
			setFirstRun(false);
			if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("agent-native:first-run-completed"));
			return;
		}
		setCompleteFirstRunError(null);
		let response;
		try {
			response = await fetch(agentNativePath("/_agent-native/onboarding/first-run/complete"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: "{}"
			});
		} catch (e) {
			const message = e instanceof Error ? e.message : "first-run completion request failed";
			trackEvent("onboarding_failed", {
				flow: "first_run",
				stage: "complete",
				reason: "network_error"
			});
			setCompleteFirstRunError(message);
			throw e instanceof Error ? e : new Error(message);
		}
		if (!response.ok) {
			const message = `first-run completion failed: ${response.status}`;
			trackEvent("onboarding_failed", {
				flow: "first_run",
				stage: "complete",
				reason: "http_error",
				status_code: response.status
			});
			setCompleteFirstRunError(message);
			throw new Error(message);
		}
		trackOnboardingEvent("onboarding_completed", { flow: "first_run" });
		setFirstRun(false);
		if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("agent-native:first-run-completed"));
		await fetchAll();
	}, [fetchAll, preview]);
	const totalCount = steps.length;
	const completeCount = steps.filter((s) => s.complete).length;
	const allComplete = steps.filter((s) => s.required).every((s) => s.complete);
	return {
		steps,
		profile,
		loading,
		error,
		currentStepId: steps.find((s) => s.required && !s.complete)?.id ?? steps.find((s) => !s.complete)?.id ?? null,
		completeCount,
		totalCount,
		allComplete,
		dismissed,
		refresh: fetchAll,
		complete,
		dismiss,
		reopen,
		firstRun,
		completeFirstRun,
		completeFirstRunError
	};
}
var ONBOARDING_PREVIEW_QUERY_PARAM = "onboarding";
var ONBOARDING_PREVIEW_QUERY_VALUE = "preview";
var ONBOARDING_PREVIEW_STEP_QUERY_PARAM = "step";
var ONBOARDING_PREVIEW_STEPS = [
	"intro",
	"choice",
	"manual",
	"tools",
	"role",
	"connecting",
	"ready",
	"extension",
	"references"
];
function isOnboardingPreviewQuery(search) {
	return new URLSearchParams(search).get(ONBOARDING_PREVIEW_QUERY_PARAM) === ONBOARDING_PREVIEW_QUERY_VALUE;
}
function getOnboardingPreviewStep(search) {
	if (!isOnboardingPreviewQuery(search)) return null;
	const step = new URLSearchParams(search).get(ONBOARDING_PREVIEW_STEP_QUERY_PARAM);
	return ONBOARDING_PREVIEW_STEPS.includes(step) ? step : null;
}
function readPreview() {
	if (typeof window === "undefined") return false;
	if (isOnboardingPreviewQuery(window.location.search)) return true;
	try {
		return JSON.parse(window.localStorage.getItem("agent-native-dev-overlay-option-framework-onboarding-show-as-new-user") || "false") === true;
	} catch {
		return false;
	}
}
function readPreviewStep() {
	if (typeof window === "undefined") return null;
	return getOnboardingPreviewStep(window.location.search);
}
function useOnboardingPreviewMode() {
	const [val, setVal] = (0, import_react.useState)(readPreview);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const onChange = () => setVal(readPreview());
		window.addEventListener("storage", onChange);
		window.addEventListener("agent-native-dev-overlay:changed", onChange);
		return () => {
			window.removeEventListener("storage", onChange);
			window.removeEventListener("agent-native-dev-overlay:changed", onChange);
		};
	}, []);
	return val;
}
function useOnboardingPreviewStep() {
	const search = typeof window === "undefined" ? "" : window.location.search;
	const [step, setStep] = (0, import_react.useState)(() => getOnboardingPreviewStep(search));
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const onChange = () => setStep(readPreviewStep());
		onChange();
		window.addEventListener("popstate", onChange);
		window.addEventListener("storage", onChange);
		window.addEventListener("agent-native-dev-overlay:changed", onChange);
		return () => {
			window.removeEventListener("popstate", onChange);
			window.removeEventListener("storage", onChange);
			window.removeEventListener("agent-native-dev-overlay:changed", onChange);
		};
	}, [search]);
	return step;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+toolkit@0.20.4_@floating-ui+dom@1.7.6_@tiptap+extension-code-block@3.28.0_0ff20177eefff338d7ce7908b45858f5/node_modules/@agent-native/toolkit/dist/clipboard.js
function getDesktopClipboards() {
	const api = globalThis;
	return [api.electronAPI?.clipboard, api.agentNativeDesktop?.clipboard].filter((clipboard) => !!clipboard?.writeText);
}
function writeWithExecCommand(text) {
	if (typeof document === "undefined") return false;
	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.setAttribute("readonly", "");
	textarea.style.position = "fixed";
	textarea.style.left = "-9999px";
	textarea.style.top = "0";
	textarea.style.opacity = "0";
	document.body.appendChild(textarea);
	textarea.select();
	textarea.setSelectionRange(0, text.length);
	try {
		return document.execCommand("copy");
	} catch {
		return false;
	} finally {
		document.body.removeChild(textarea);
	}
}
/**
* Writes text through the strongest clipboard available to the current host.
* Desktop bridges are preferred, then the browser Clipboard API, with the
* synchronous DOM path retained for embedded surfaces that deny async writes.
*/
async function writeClipboardText(text, options) {
	for (const desktopClipboard of getDesktopClipboards()) try {
		if (await desktopClipboard.writeText?.(text) !== false) return true;
	} catch {}
	if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
		const html = options?.html;
		if (html !== void 0 && typeof ClipboardItem !== "undefined" && navigator.clipboard.write) try {
			await navigator.clipboard.write([new ClipboardItem({
				"text/plain": new Blob([text], { type: "text/plain" }),
				"text/html": new Blob([html], { type: "text/html" })
			})]);
			return true;
		} catch {}
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {}
	}
	return writeWithExecCommand(text);
}
//#endregion
export { useCallbackRef$1 as $, isTrustedFrameMessage as $t, ToolkitProvider as A, cn$1 as At, Content2$1 as B, BETA_REDIRECT_SIGN_OUT_STORAGE_KEY as Bt, Root2 as C, scheduleAfterPaint as Cn, shouldThrowError as Ct, FocusScope as D, RequireSession as Dt, hideOthers as E, injectedAgentNativeConfig as En, Subscribable as Et, IconCopy as F, BETA_LANE_RETURN_STORAGE_KEY as Ft, Trigger$1 as G, buildEnvironmentUrl as Gt, Provider as H, ENVIRONMENT_BETA_HOSTS as Ht, IconCheck as I, BETA_OPT_OUT_DURATION_MS as It, Portal$2 as J, completeSignOut as Jt, useControllableState as K, resolveEnvironmentTargets as Kt, IconBrandGithub as L, BETA_OPT_OUT_QUERY_PARAM as Lt, TooltipContent as M, BETA_FORCE_SESSION_STORAGE_KEY as Mt, TooltipProvider as N, BETA_LANE_REDIRECT_QUERY_PARAM as Nt, useFocusGuards as O, buildSignInReturnHref as Ot, TooltipTrigger as P, BETA_LANE_RETURNED_STORAGE_KEY as Pt, useDismissableLayerSurface as Q, getFramePostMessageTargetOrigin as Qt, IconAlertTriangle as R, BETA_OPT_OUT_STORAGE_KEY as Rt, Portal as S, parseRuntimeConfigReport as Sn, shallowEqualObjects as St, ReactRemoveScroll as T, clientBuildId as Tn, focusManager as Tt, Root3 as U, buildAutomaticBetaRedirectUrl as Ut, Portal$1 as V, BETA_REDIRECT_STORAGE_KEY as Vt, TooltipProvider$1 as W, buildEnvironmentOptOutUrl as Wt, useLayoutEffect2 as X, getCallbackOrigin as Xt, useId as Y, useSession as Yt, DismissableLayer as Z, getFrameOrigin as Zt, normalizeLocaleCode as _, markEmbedMcpChatBridgeActive as _n, matchMutation as _t, useOnboarding as a, trackEvent as an, composeEventHandlers as at, PopoverTrigger as b, EMBED_TOKEN_QUERY_PARAM as bn, partialMatchKey as bt, isFirstRunOnboardingEnabled as c, appBasePath as cn, useQueryClient as ct, useOptionalLocale as d, isDynamicImportFailureMessage as dn, Query as dt, deleteClientAppState as en, Primitive as et, useT as f, recoverFromStaleChunkError as fn, onlineManager as ft, LOCALE_STORAGE_KEY as g, isEmbedMcpChatBridgeActive as gn, hashQueryKeyByOptions as gt, LOCALE_HYDRATION_GLOBAL as h, isEmbedAuthActive as hn, hashKey as ht, trackOnboardingEvent as i, configureTracking as in, useComposedRefs as it, Tooltip as j, BETA_FORCE_QUERY_PARAM as jt, Button as k, DefaultSpinner as kt, shouldSkipFirstRunIntegrations as l, appPath as ln, Mutation as lt, DEFAULT_LOCALE as m, getEmbedAuthToken as mn, functionalUpdate as mt, useOnboardingPreviewMode as n, setClientAppState as nn, createContextScope as nt, fetchFirstRunOnboardingStatus as o, agentNativeApiDisabledReason as on, useQuery as ot, cn as p, ensureEmbedAuthFetchInterceptor as pn, notifyManager as pt, Presence as q, beginSignOut as qt, useOnboardingPreviewStep as r, getBrowserTabId as rn, composeRefs as rt, saveFirstRunOnboardingRole as s, agentNativePath as sn, QueryClientProvider as st, writeClipboardText as t, readClientAppState as tn, createSlot as tt, AgentNativeI18nProvider as u, isWorkspaceAppPath as un, getDefaultState as ut, Popover as v, readEmbedMcpChatBridgeFlagFromUrl as vn, matchQuery as vt, Trigger as w, useAfterPaint as wn, skipToken as wt, Content2 as x, MCP_APP_CHAT_BRIDGE_QUERY_PARAM as xn, resolveStaleTime as xt, PopoverContent as y, EMBED_MODE_QUERY_PARAM as yn, noop$1 as yt, createReactComponent as z, BETA_REDIRECT_DURATION_MS as zt };
