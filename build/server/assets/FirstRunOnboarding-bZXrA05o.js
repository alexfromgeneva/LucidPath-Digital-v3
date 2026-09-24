import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.js";
import { t as require_jsx_runtime } from "./jsx-runtime-CwzbG7ys.js";
import { t as require_react } from "./react-I5hdCSmb.js";
import { $t as isTrustedFrameMessage, At as cn, Bt as BETA_REDIRECT_SIGN_OUT_STORAGE_KEY, Cn as scheduleAfterPaint, Ct as shouldThrowError, D as FocusScope, E as hideOthers, En as injectedAgentNativeConfig, Et as Subscribable, F as IconCopy, I as IconCheck, J as Portal, Jt as completeSignOut, K as useControllableState, L as IconBrandGithub, M as TooltipContent, O as useFocusGuards, Ot as buildSignInReturnHref, P as TooltipTrigger, Q as useDismissableLayerSurface, Qt as getFramePostMessageTargetOrigin, R as IconAlertTriangle, St as shallowEqualObjects, T as ReactRemoveScroll, Tn as clientBuildId, Vt as BETA_REDIRECT_STORAGE_KEY, Xt as getCallbackOrigin, Y as useId$1, Z as DismissableLayer, Zt as getFrameOrigin, _n as markEmbedMcpChatBridgeActive, a as useOnboarding, an as trackEvent, at as composeEventHandlers, b as PopoverTrigger, ct as useQueryClient, d as useOptionalLocale, et as Primitive, f as useT, gn as isEmbedMcpChatBridgeActive, hn as isEmbedAuthActive, ht as hashKey, i as trackOnboardingEvent, it as useComposedRefs, j as Tooltip, k as Button, l as shouldSkipFirstRunIntegrations, ln as appPath, mn as getEmbedAuthToken, n as useOnboardingPreviewMode, nt as createContextScope, ot as useQuery, p as cn$1, pt as notifyManager, q as Presence, qt as beginSignOut, r as useOnboardingPreviewStep, rt as composeRefs, s as saveFirstRunOnboardingRole, sn as agentNativePath, t as writeClipboardText, tt as createSlot, ut as getDefaultState, v as Popover, vn as readEmbedMcpChatBridgeFlagFromUrl, wn as useAfterPaint, y as PopoverContent, yt as noop, z as createReactComponent } from "./clipboard-BI9Wd5rV.js";
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/sign-out.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* The one client-side sign-out.
*
* Every surface used to hand-roll the same three steps — POST the logout route,
* then navigate — and every copy had the same gap between them: the app shell
* stayed mounted and authenticated while the cookie was already gone, so its
* queries 401ed and painted a load failure over the app the user was trying to
* leave. A hard refresh looked fine because a fresh document has no stale
* client state to disagree with.
*
* Ordering is the whole point and it is not symmetric:
*
*  1. `beginSignOut()` first, so no surface renders authenticated UI or issues
*     an authenticated request for the rest of this document's life. Doing this
*     after the request leaves that window open; invalidating a cache instead
*     only schedules a re-read, which answers "authenticated" until it lands.
*  2. Revoke the server session, and WAIT for it. Navigating first can abandon
*     the request and leave the session live — the user would be silently
*     signed back in on their next visit.
*  3. On success, leave with a full location change so the next document
*     re-runs the server auth guard from scratch. On failure, reload the
*     current document so it can re-read the still-authoritative session.
*/
var LOGOUT_PATH = "/_agent-native/auth/logout";
var SIGN_OUT_REQUEST_TIMEOUT_MS = 15e3;
var SIGN_OUT_SEARCH_TERMS = [
	"log out",
	"log-out",
	"logout",
	"sign out",
	"sign-out",
	"signout"
];
var signOutOperation = null;
function setBetaRedirectSignOutSignal() {
	const signOutWindow = window;
	signOutWindow.__agentNativeBetaRedirectSignOutStarted = true;
	try {
		window.sessionStorage.setItem(BETA_REDIRECT_SIGN_OUT_STORAGE_KEY, "1");
	} catch {}
}
function clearBetaRedirectSignOutSignal() {
	const signOutWindow = window;
	signOutWindow.__agentNativeBetaRedirectSignOutStarted = false;
	try {
		window.sessionStorage.removeItem(BETA_REDIRECT_SIGN_OUT_STORAGE_KEY);
	} catch {}
}
function clearBetaRedirectMarker() {
	try {
		window.localStorage.removeItem(BETA_REDIRECT_STORAGE_KEY);
	} catch {}
}
/**
* Sign the current user out and leave for the sign-in page when revocation
* succeeds. A failed revoke reloads the current document instead.
*
* Resolves only if the navigation did not take effect, so callers should treat
* it as terminal and not render anything afterwards.
*/
function signOut(options = {}) {
	if (signOutOperation) return signOutOperation;
	signOutOperation = signOutFlow(options);
	return signOutOperation;
}
async function signOutFlow(options) {
	setBetaRedirectSignOutSignal();
	beginSignOut();
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), SIGN_OUT_REQUEST_TIMEOUT_MS);
	let revoked = false;
	try {
		const response = await fetch(agentNativePath(LOGOUT_PATH), {
			method: "POST",
			credentials: "include",
			signal: controller.signal
		});
		if (!response.ok) console.warn("Sign-out request returned an error", response.status);
		else revoked = true;
	} catch (error) {
		console.warn("Unable to complete the sign-out request", error);
	} finally {
		clearTimeout(timeout);
	}
	if (!revoked) {
		clearBetaRedirectSignOutSignal();
		clearBetaRedirectMarker();
		window.location.reload();
		return;
	}
	completeSignOut();
	clearBetaRedirectSignOutSignal();
	clearBetaRedirectMarker();
	window.location.replace(options.redirectTo ?? buildSignInReturnHref());
}
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.101.2/node_modules/@tanstack/query-core/build/modern/mutationObserver.js
var MutationObserver = class extends Subscribable {
	#client;
	#currentResult = void 0;
	#currentMutation;
	#mutateOptions;
	constructor(client, options) {
		super();
		this.#client = client;
		this.setOptions(options);
		this.bindMethods();
		this.#updateResult();
	}
	bindMethods() {
		this.mutate = this.mutate.bind(this);
		this.reset = this.reset.bind(this);
	}
	setOptions(options) {
		const prevOptions = this.options;
		this.options = this.#client.defaultMutationOptions(options);
		if (!shallowEqualObjects(this.options, prevOptions)) this.#client.getMutationCache().notify({
			type: "observerOptionsUpdated",
			mutation: this.#currentMutation,
			observer: this
		});
		if (prevOptions?.mutationKey && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) this.reset();
		else if (this.#currentMutation?.state.status === "pending") this.#currentMutation.setOptions(this.options);
	}
	onUnsubscribe() {
		if (!this.hasListeners()) this.#currentMutation?.removeObserver(this);
	}
	onMutationUpdate(action) {
		this.#updateResult();
		this.#notify(action);
	}
	getCurrentResult() {
		return this.#currentResult;
	}
	reset() {
		this.#currentMutation?.removeObserver(this);
		this.#currentMutation = void 0;
		this.#updateResult();
		this.#notify();
	}
	mutate(variables, options) {
		this.#mutateOptions = options;
		this.#currentMutation?.removeObserver(this);
		this.#currentMutation = this.#client.getMutationCache().build(this.#client, this.options);
		this.#currentMutation.addObserver(this);
		return this.#currentMutation.execute(variables);
	}
	#updateResult() {
		const state = this.#currentMutation?.state ?? getDefaultState();
		this.#currentResult = {
			...state,
			isPending: state.status === "pending",
			isSuccess: state.status === "success",
			isError: state.status === "error",
			isIdle: state.status === "idle",
			mutate: this.mutate,
			reset: this.reset
		};
	}
	#notify(action) {
		notifyManager.batch(() => {
			if (this.#mutateOptions && this.hasListeners()) {
				const variables = this.#currentResult.variables;
				const onMutateResult = this.#currentResult.context;
				const context = {
					client: this.#client,
					meta: this.options.meta,
					mutationKey: this.options.mutationKey
				};
				if (action?.type === "success") {
					try {
						this.#mutateOptions.onSuccess?.(action.data, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						this.#mutateOptions.onSettled?.(action.data, null, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
				} else if (action?.type === "error") {
					try {
						this.#mutateOptions.onError?.(action.error, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						this.#mutateOptions.onSettled?.(void 0, action.error, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
				}
			}
			this.listeners.forEach((listener) => {
				listener(this.#currentResult);
			});
		});
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+react-query@5.101.2_react@19.2.7/node_modules/@tanstack/react-query/build/modern/useMutation.js
function useMutation(options, queryClient) {
	const client = useQueryClient(queryClient);
	const [observer] = import_react.useState(() => new MutationObserver(client, options));
	import_react.useEffect(() => {
		observer.setOptions(options);
	}, [observer, options]);
	const result = import_react.useSyncExternalStore(import_react.useCallback((onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)), [observer]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	const mutate = import_react.useCallback((variables, mutateOptions) => {
		observer.mutate(variables, mutateOptions).catch(noop);
	}, [observer]);
	if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) throw result.error;
	return {
		...result,
		mutate,
		mutateAsync: result.mutate
	};
}
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconArrowLeft = createReactComponent("outline", "arrow-left", "ArrowLeft", [
	["path", {
		"d": "M5 12l14 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M5 12l6 6",
		"key": "svg-1"
	}],
	["path", {
		"d": "M5 12l6 -6",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconArrowRight = createReactComponent("outline", "arrow-right", "ArrowRight", [
	["path", {
		"d": "M5 12l14 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M13 18l6 -6",
		"key": "svg-1"
	}],
	["path", {
		"d": "M13 6l6 6",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconBook2 = createReactComponent("outline", "book-2", "Book2", [
	["path", {
		"d": "M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12",
		"key": "svg-0"
	}],
	["path", {
		"d": "M19 16h-12a2 2 0 0 0 -2 2",
		"key": "svg-1"
	}],
	["path", {
		"d": "M9 8h6",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconCode = createReactComponent("outline", "code", "Code", [
	["path", {
		"d": "M7 8l-4 4l4 4",
		"key": "svg-0"
	}],
	["path", {
		"d": "M17 8l4 4l-4 4",
		"key": "svg-1"
	}],
	["path", {
		"d": "M14 4l-4 16",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconDots = createReactComponent("outline", "dots", "Dots", [
	["path", {
		"d": "M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
		"key": "svg-1"
	}],
	["path", {
		"d": "M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconExternalLink = createReactComponent("outline", "external-link", "ExternalLink", [
	["path", {
		"d": "M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6",
		"key": "svg-0"
	}],
	["path", {
		"d": "M11 13l9 -9",
		"key": "svg-1"
	}],
	["path", {
		"d": "M15 4h5v5",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconHistory = createReactComponent("outline", "history", "History", [["path", {
	"d": "M12 8l0 4l2 2",
	"key": "svg-0"
}], ["path", {
	"d": "M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconInfoCircle = createReactComponent("outline", "info-circle", "InfoCircle", [
	["path", {
		"d": "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M12 9h.01",
		"key": "svg-1"
	}],
	["path", {
		"d": "M11 12h1v4h1",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconKey = createReactComponent("outline", "key", "Key", [["path", {
	"d": "M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0",
	"key": "svg-0"
}], ["path", {
	"d": "M15 9h.01",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconLoader2 = createReactComponent("outline", "loader-2", "Loader2", [["path", {
	"d": "M12 3a9 9 0 1 0 9 9",
	"key": "svg-0"
}]]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconLogout = createReactComponent("outline", "logout", "Logout", [
	["path", {
		"d": "M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2",
		"key": "svg-0"
	}],
	["path", {
		"d": "M9 12h12l-3 -3",
		"key": "svg-1"
	}],
	["path", {
		"d": "M18 15l3 -3",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconMessage = createReactComponent("outline", "message", "Message", [
	["path", {
		"d": "M8 9h8",
		"key": "svg-0"
	}],
	["path", {
		"d": "M8 13h6",
		"key": "svg-1"
	}],
	["path", {
		"d": "M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconPlus = createReactComponent("outline", "plus", "Plus", [["path", {
	"d": "M12 5l0 14",
	"key": "svg-0"
}], ["path", {
	"d": "M5 12l14 0",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconSearch = createReactComponent("outline", "search", "Search", [["path", {
	"d": "M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0",
	"key": "svg-0"
}], ["path", {
	"d": "M21 21l-6 -6",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconUser = createReactComponent("outline", "user", "User", [["path", {
	"d": "M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0",
	"key": "svg-0"
}], ["path", {
	"d": "M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconUsersGroup = createReactComponent("outline", "users-group", "UsersGroup", [
	["path", {
		"d": "M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1",
		"key": "svg-1"
	}],
	["path", {
		"d": "M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0",
		"key": "svg-2"
	}],
	["path", {
		"d": "M17 10h2a2 2 0 0 1 2 2v1",
		"key": "svg-3"
	}],
	["path", {
		"d": "M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0",
		"key": "svg-4"
	}],
	["path", {
		"d": "M3 13v-1a2 2 0 0 1 2 -2h2",
		"key": "svg-5"
	}]
]);
/**
* @license @tabler/icons-react v3.44.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconX = createReactComponent("outline", "x", "X", [["path", {
	"d": "M18 6l-12 12",
	"key": "svg-0"
}], ["path", {
	"d": "M6 6l12 12",
	"key": "svg-1"
}]]);
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-dialog@1.1.19_@types+react-dom@19.2.3_@types+react@19.2.17__@types+reac_8c2acd1036ebe22ffa260e976b7bebf3/node_modules/@radix-ui/react-dialog/dist/index.mjs
var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog$1 = (props) => {
	const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
	const triggerRef = import_react.useRef(null);
	const contentRef = import_react.useRef(null);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: DIALOG_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogProvider, {
		scope: __scopeDialog,
		triggerRef,
		contentRef,
		contentId: useId$1(),
		titleId: useId$1(),
		descriptionId: useId$1(),
		open,
		onOpenChange: setOpen,
		onOpenToggle: import_react.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
		modal,
		children
	});
};
Dialog$1.displayName = DIALOG_NAME;
var TRIGGER_NAME = "DialogTrigger";
var DialogTrigger = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...triggerProps } = props;
	const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
	const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		"aria-haspopup": "dialog",
		"aria-expanded": context.open,
		"aria-controls": context.open ? context.contentId : void 0,
		"data-state": getState(context.open),
		...triggerProps,
		ref: composedTriggerRef,
		onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
	});
});
DialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME, { forceMount: void 0 });
var DialogPortal$1 = (props) => {
	const { __scopeDialog, forceMount, children, container } = props;
	const context = useDialogContext(PORTAL_NAME, __scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalProvider, {
		scope: __scopeDialog,
		forceMount,
		children: import_react.Children.map(children, (child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, {
				asChild: true,
				container,
				children: child
			})
		}))
	});
};
DialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay$1 = import_react.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
	const { forceMount = portalContext.forceMount, ...overlayProps } = props;
	const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
	return context.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlayImpl, {
			...overlayProps,
			ref: forwardedRef
		})
	}) : null;
});
DialogOverlay$1.displayName = OVERLAY_NAME;
var Slot = createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...overlayProps } = props;
	const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
	const composedRefs = useComposedRefs(forwardedRef, useDismissableLayerSurface());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactRemoveScroll, {
		as: Slot,
		allowPinchZoom: true,
		shards: [context.contentRef],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			"data-state": getState(context.open),
			...overlayProps,
			ref: composedRefs,
			style: {
				pointerEvents: "auto",
				...overlayProps.style
			}
		})
	});
});
var CONTENT_NAME = "DialogContent";
var DialogContent$1 = import_react.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: context.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentModal, {
			...contentProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentNonModal, {
			...contentProps,
			ref: forwardedRef
		})
	});
});
DialogContent$1.displayName = CONTENT_NAME;
var DialogContentModal = import_react.forwardRef((props, forwardedRef) => {
	const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
	const contentRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
	import_react.useEffect(() => {
		const content = contentRef.current;
		if (content) return hideOthers(content);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentImpl, {
		...props,
		ref: composedRefs,
		trapFocus: context.open,
		disableOutsidePointerEvents: context.open,
		onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
			event.preventDefault();
			context.triggerRef.current?.focus();
		}),
		onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
			const originalEvent = event.detail.originalEvent;
			const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
			if (originalEvent.button === 2 || ctrlLeftClick) event.preventDefault();
		}),
		onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault())
	});
});
var DialogContentNonModal = import_react.forwardRef((props, forwardedRef) => {
	const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
	const hasInteractedOutsideRef = import_react.useRef(false);
	const hasPointerDownOutsideRef = import_react.useRef(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentImpl, {
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
var DialogContentImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
	const context = useDialogContext(CONTENT_NAME, __scopeDialog);
	useFocusGuards();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScope, {
		asChild: true,
		loop: true,
		trapped: trapFocus,
		onMountAutoFocus: onOpenAutoFocus,
		onUnmountAutoFocus: onCloseAutoFocus,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
			role: "dialog",
			id: context.contentId,
			"aria-describedby": context.descriptionId,
			"aria-labelledby": context.titleId,
			"data-state": getState(context.open),
			...contentProps,
			ref: forwardedRef,
			deferPointerDownOutside: true,
			onDismiss: () => context.onOpenChange(false)
		})
	}) });
});
var TITLE_NAME = "DialogTitle";
var DialogTitle$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...titleProps } = props;
	const context = useDialogContext(TITLE_NAME, __scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.h2, {
		id: context.titleId,
		...titleProps,
		ref: forwardedRef
	});
});
DialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...descriptionProps } = props;
	const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.p, {
		id: context.descriptionId,
		...descriptionProps,
		ref: forwardedRef
	});
});
DialogDescription$1.displayName = DESCRIPTION_NAME;
var CLOSE_NAME = "DialogClose";
var DialogClose = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...closeProps } = props;
	const context = useDialogContext(CLOSE_NAME, __scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		...closeProps,
		ref: forwardedRef,
		onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
	});
});
DialogClose.displayName = CLOSE_NAME;
function getState(open) {
	return open ? "open" : "closed";
}
//#endregion
//#region node_modules/.pnpm/@agent-native+toolkit@0.20.4_@floating-ui+dom@1.7.6_@tiptap+extension-code-block@3.28.0_0ff20177eefff338d7ce7908b45858f5/node_modules/@agent-native/toolkit/dist/ui/dialog.js
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, motion = "default", ...props }, ref) => (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-[270] bg-background/45 backdrop-blur-[1px]", motion === "default" && "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", motion === "instant" && "transition-[backdrop-filter] duration-[1000ms] ease-[var(--ease-out-strong)] starting:[backdrop-filter:blur(0px)] motion-reduce:transition-none", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, hideClose, motion = "default", container, closeLabel = "Close", overlayClassName, overlayStyle, ...props }, ref) => (0, import_jsx_runtime.jsxs)(DialogPortal, {
	container,
	children: [(0, import_jsx_runtime.jsx)(DialogOverlay, {
		motion,
		className: overlayClassName,
		style: overlayStyle
	}), (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		ref,
		className: cn("fixed left-1/2 top-1/2 z-[280] grid max-h-[min(760px,calc(100vh-32px))] w-[calc(100vw-24px)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto overflow-x-hidden rounded-lg border border-border bg-background p-6 text-foreground shadow-lg outline-none", motion === "default" && "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-150 data-[state=open]:duration-200 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props,
		children: [children, !hideClose && (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
			children: [(0, import_jsx_runtime.jsx)(IconX, { className: "h-4 w-4" }), (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: closeLabel
			})]
		})]
	})]
}));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-start", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight text-foreground", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
//#endregion
//#region node_modules/.pnpm/@agent-native+toolkit@0.20.4_@floating-ui+dom@1.7.6_@tiptap+extension-code-block@3.28.0_0ff20177eefff338d7ce7908b45858f5/node_modules/@agent-native/toolkit/dist/ui/skeleton.js
function Skeleton({ className, ...props }) {
	return (0, import_jsx_runtime.jsx)("div", {
		className: cn("skeleton-shimmer rounded-md bg-muted", className),
		...props
	});
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/poll-engine.js
/**
* Shared recurring-poll engine used by both `usePollLoop` (client) and
* `startIntervalJob` (server) so every polling loop in the codebase gets the
* same three properties for free instead of hand-rolling them per call site:
*
* 1. Never overlaps: the next attempt is scheduled via `setTimeout` only
*    after the current one settles, not on a fixed `setInterval` cadence.
*    This also avoids the latency `setInterval` + skip-if-busy introduces —
*    a skipped tick there means waiting a full extra cadence before the next
*    retry; here the gap after completion is always exactly `intervalMs`.
* 2. Never stalls silently: every attempt is bounded by a timeout (paired
*    with an `AbortController` so a `fetch` can actually cancel, not just be
*    abandoned), and that timeout reports through `onError` the moment it
*    fires. An attempt that ignores its `signal` keeps holding the loop —
*    reported, not hidden — because releasing the slot to the next attempt
*    would trade a visible stall for a silent overlap.
* 3. Never double-fires: a single internal in-flight flag, owned by this
*    engine rather than duplicated in every caller.
*/
var DEFAULT_TIMEOUT_FLOOR_MS = 1e4;
function resolve(value) {
	return typeof value === "function" ? value() : value;
}
function maybeUnref(timer) {
	if (timer && typeof timer === "object" && "unref" in timer && typeof timer.unref === "function") timer.unref();
}
function createPollEngine(attempt, options) {
	const timeoutFloorMs = options.timeoutFloorMs ?? DEFAULT_TIMEOUT_FLOOR_MS;
	const getTimeoutMs = () => options.timeoutMs != null ? resolve(options.timeoutMs) : Math.max(timeoutFloorMs, resolve(options.intervalMs) * 4);
	const onError = options.onError ?? (() => {});
	const leading = options.leading ?? true;
	let generation = 0;
	let running = false;
	let inFlight = false;
	let timer = null;
	let activeController = null;
	function clearTimer() {
		if (timer != null) {
			clearTimeout(timer);
			timer = null;
		}
	}
	function schedule(gen) {
		clearTimer();
		timer = setTimeout(() => {
			timer = null;
			tick(gen);
		}, resolve(options.intervalMs));
		maybeUnref(timer);
	}
	async function tick(gen) {
		if (gen !== generation || !running) return;
		if (inFlight) {
			schedule(gen);
			return;
		}
		inFlight = true;
		const controller = new AbortController();
		activeController = controller;
		const timeoutMs = getTimeoutMs();
		const abortTimer = setTimeout(() => controller.abort(), timeoutMs);
		maybeUnref(abortTimer);
		let reported = false;
		const report = (err) => {
			if (reported) return;
			reported = true;
			onError(err);
		};
		const settled = Promise.resolve().then(() => attempt(controller.signal)).then(() => {}, (err) => report(err));
		try {
			await Promise.race([settled, new Promise((_, reject) => {
				controller.signal.addEventListener("abort", () => reject(/* @__PURE__ */ new Error(`poll attempt timed out after ${timeoutMs}ms`)), { once: true });
			})]);
		} catch (err) {
			report(err);
		} finally {
			await settled;
			clearTimeout(abortTimer);
			if (activeController === controller) activeController = null;
			inFlight = false;
			if (gen === generation && running) schedule(gen);
		}
	}
	return {
		start() {
			if (running) return;
			running = true;
			generation++;
			const gen = generation;
			if (leading) tick(gen);
			else schedule(gen);
		},
		stop() {
			running = false;
			generation++;
			clearTimer();
			activeController?.abort();
		},
		pollNow() {
			if (!running || inFlight) return;
			clearTimer();
			tick(generation);
		},
		reschedule() {
			if (!running || inFlight || timer == null) return;
			schedule(generation);
		},
		get isRunning() {
			return running;
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/use-poll-loop.js
var HIDDEN_INTERVAL_FLOOR_MS = 1e4;
function isDocumentHidden() {
	return typeof document !== "undefined" && document.visibilityState === "hidden";
}
/**
* Poll a network endpoint on a recurring cadence without hand-rolling a
* visibility check, an in-flight guard, or a request timeout — see
* `createPollEngine` for the underlying guarantees. `attempt` receives an
* `AbortSignal`; pass it to `fetch` for real cancellation on timeout.
*
* Supersedes `usePausingInterval`, which pauses/resumes on visibility but has
* no request timeout and schedules via `setInterval` rather than a
* settle-then-reschedule loop.
*/
function usePollLoop(attempt, options) {
	const attemptRef = (0, import_react.useRef)(attempt);
	attemptRef.current = attempt;
	const pollNowRef = (0, import_react.useRef)(() => {});
	const { intervalMs, timeoutMs, timeoutFloorMs, onError, leading, enabled = true, pauseWhenHidden = false, hiddenIntervalFloorMs = HIDDEN_INTERVAL_FLOOR_MS } = options;
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		const engine = createPollEngine((signal) => attemptRef.current(signal), {
			intervalMs: pauseWhenHidden ? intervalMs : () => isDocumentHidden() ? Math.max(intervalMs, hiddenIntervalFloorMs) : intervalMs,
			timeoutMs,
			timeoutFloorMs,
			onError,
			leading
		});
		pollNowRef.current = () => engine.pollNow();
		if (!pauseWhenHidden || !isDocumentHidden()) engine.start();
		const onVisibilityChange = () => {
			if (isDocumentHidden()) if (pauseWhenHidden) engine.stop();
			else engine.reschedule();
			else if (pauseWhenHidden) engine.start();
			else engine.pollNow();
		};
		document.addEventListener("visibilitychange", onVisibilityChange);
		return () => {
			engine.stop();
			pollNowRef.current = () => {};
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, [
		intervalMs,
		timeoutMs,
		timeoutFloorMs,
		onError,
		leading,
		enabled,
		pauseWhenHidden,
		hiddenIntervalFloorMs
	]);
	return { pollNow: () => pollNowRef.current() };
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/docs-url.js
/**
* Absolute links into the public Agent-Native docs site.
*
* Call `docsUrl("content-slug")` at call sites so the path is visible inline
* (`docsUrl("template-design")` → `/docs/template-design`). Relative
* `/docs/...` paths resolve against the app origin and 404 — always use this
* helper for outbound docs links.
*/
var AGENT_NATIVE_DOCS_ORIGIN = "https://www.agent-native.com";
function applyDocsUtm(params, options) {
	if (!(options.medium != null || options.campaign != null || options.content != null)) return;
	params.set("utm_source", "agent-native");
	params.set("utm_medium", options.medium ?? "product");
	params.set("utm_campaign", options.campaign ?? "docs");
	if (options.content) params.set("utm_content", options.content);
}
/**
* Build an absolute docs URL for a content slug (the MDX stem under
* `packages/core/docs/content/`).
*
* `getting-started` maps to `/docs` (the docs home).
*/
function docsUrl(slug, options = {}) {
	const normalized = slug.replace(/^\/+/, "").replace(/\/+$/, "");
	const path = normalized === "" || normalized === "getting-started" ? "/docs" : `/docs/${normalized}`;
	const url = new URL(path, AGENT_NATIVE_DOCS_ORIGIN);
	applyDocsUtm(url.searchParams, options);
	if (options.hash) url.hash = options.hash.replace(/^#/, "");
	return url.toString();
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/agent/types.js
var AGENT_ACTION_SCOPE_MAX_BYTES = 8 * 1024;
var AGENT_ACTION_SCOPE_MAX_DEPTH = 8;
var AGENT_ACTION_SCOPE_MAX_NODES = 256;
function cloneAgentActionScopeValue(value, depth, state) {
	state.nodes += 1;
	if (depth > AGENT_ACTION_SCOPE_MAX_DEPTH || state.nodes > AGENT_ACTION_SCOPE_MAX_NODES) throw new TypeError("actionScope exceeds its structural limits");
	if (value === null || typeof value === "boolean" || typeof value === "string") return value;
	if (typeof value === "number") {
		if (!Number.isFinite(value)) throw new TypeError("actionScope must contain only JSON values");
		return value;
	}
	if (Array.isArray(value)) {
		if (Reflect.ownKeys(value).some((key) => typeof key !== "string" || key !== "length" && (String(Number(key)) !== key || Number(key) >= value.length)) || Object.keys(value).length !== value.length) throw new TypeError("actionScope must contain only JSON arrays");
		return Array.from(value, (item) => cloneAgentActionScopeValue(item, depth + 1, state));
	}
	if (typeof value !== "object") throw new TypeError("actionScope must contain only JSON values");
	const prototype = Object.getPrototypeOf(value);
	if (prototype !== Object.prototype && prototype !== null) throw new TypeError("actionScope must contain only JSON objects");
	const object = value;
	if (Reflect.ownKeys(object).some((key) => {
		if (typeof key !== "string") return true;
		const descriptor = Object.getOwnPropertyDescriptor(object, key);
		return !descriptor?.enumerable || !("value" in descriptor);
	})) throw new TypeError("actionScope must contain only JSON values");
	return Object.fromEntries(Object.entries(object).map(([key, item]) => [key, cloneAgentActionScopeValue(item, depth + 1, state)]));
}
/** Validate and clone an untrusted action scope into bounded JSON data. */
function normalizeAgentActionScope(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new TypeError("actionScope must be a JSON object");
	const cloned = cloneAgentActionScopeValue(value, 0, { nodes: 0 });
	if (new TextEncoder().encode(JSON.stringify(cloned)).byteLength > 8192) throw new TypeError(`actionScope must be at most ${AGENT_ACTION_SCOPE_MAX_BYTES} bytes`);
	return cloned;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/builder-frame.js
function normalizeOrigin(value) {
	if (typeof value !== "string" || !value.trim()) return null;
	try {
		return new URL(value).origin;
	} catch {
		return null;
	}
}
function ancestorOrigin() {
	if (typeof window === "undefined" || window.parent === window) return null;
	const first = window.location.ancestorOrigins?.[0];
	const fromAncestor = normalizeOrigin(first);
	if (fromAncestor) return fromAncestor;
	return normalizeOrigin(document.referrer);
}
function isStrictBuilderHost(origin) {
	if (!origin) return false;
	try {
		const hostname = new URL(origin).hostname.toLowerCase();
		if (hostname === "agent-workspace.builder.io" || hostname === "beta.agent-workspace.builder.io") return false;
		return hostname === "builder.io" || hostname.endsWith(".builder.io") || hostname === "builder.my" || hostname.endsWith(".builder.my");
	} catch {
		return false;
	}
}
function isBuilderLikeOrigin(origin) {
	if (!origin) return false;
	if (isStrictBuilderHost(origin)) return true;
	try {
		const hostname = new URL(origin).hostname.toLowerCase();
		return hostname === "localhost" || hostname === "127.0.0.1";
	} catch {
		return false;
	}
}
function hasBuilderPreviewParams() {
	if (typeof window === "undefined") return false;
	const params = new URLSearchParams(window.location.search);
	return params.has("builder.space") || params.has("builder.preview") || params.has("builder.frameEditing") || params.has("builder.user.permissions") || params.has("builder.user.role.name") || params.has("__builder_editing__");
}
var builderFrameDetected = false;
var builderParentOrigin = null;
/**
* For Builder-owned editor hosts the parent origin alone is sufficient. The
* hosted Dispatch shell is also under `*.builder.io`, so it is excluded above.
* For localhost we still require the legacy `?builder.*` query params, because
* "parent is localhost" can mean anything in dev. The params check existed
* historically as a belt-and-suspenders signal, but Builder's Interact mode
* tunnels straight to the iframe URL without appending them, so requiring them
* everywhere caused `isInBuilderFrame()` to return false for real Builder
* editor sessions and `HomeChatPanel` submissions silently fell through to
* `agentNative.submitChat` (which Builder ignores).
*/
function detectBuilderParentOrigin() {
	const frameOrigin = getFrameOrigin();
	if (frameOrigin) {
		if (isStrictBuilderHost(frameOrigin)) return frameOrigin;
		if (isBuilderLikeOrigin(frameOrigin) && hasBuilderPreviewParams()) return frameOrigin;
	}
	const origin = ancestorOrigin();
	if (origin) {
		if (isStrictBuilderHost(origin)) return origin;
		if (isBuilderLikeOrigin(origin) && hasBuilderPreviewParams()) return origin;
	}
	return null;
}
function getBuilderParentOrigin() {
	const detectedOrigin = detectBuilderParentOrigin();
	if (detectedOrigin) builderParentOrigin = detectedOrigin;
	return detectedOrigin ?? builderParentOrigin;
}
if (typeof window !== "undefined") builderFrameDetected = getBuilderParentOrigin() !== null || hasBuilderPreviewParams();
function isInBuilderFrame() {
	if (typeof window === "undefined") return false;
	if (builderFrameDetected) return true;
	builderFrameDetected = getBuilderParentOrigin() !== null || hasBuilderPreviewParams();
	return builderFrameDetected;
}
function isTrustedBuilderMessage(event) {
	if (typeof window === "undefined") return false;
	const origin = getBuilderParentOrigin();
	if (!origin) return false;
	return event.origin === origin && event.source === window.parent;
}
function sendToBuilderChat(opts) {
	if (typeof window === "undefined" || !opts.message?.trim()) return false;
	const hasParentFrame = window.parent !== window;
	const targetOrigin = opts.targetOrigin ?? getBuilderParentOrigin() ?? "*";
	const payload = {
		type: "builder.submitChat",
		data: {
			message: opts.message,
			context: opts.context,
			submit: opts.submit,
			...opts.mode ? { mode: opts.mode } : {},
			...opts.requestMode ? { requestMode: opts.requestMode } : {}
		}
	};
	if (hasParentFrame) window.parent.postMessage(payload, targetOrigin);
	else try {
		console.log("BUILDER_PARENT_MESSAGE:" + JSON.stringify({
			message: payload,
			targetOrigin
		}));
	} catch {}
	return true;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/mcp-app-host.js
var AGENT_NATIVE_MCP_APP_HOST_MESSAGE_TYPES = {
	HOST_CONTEXT: "agentNative.mcpHostContext",
	UPDATE_MODEL_CONTEXT: "agentNative.mcpHost.updateModelContext",
	OPEN_LINK: "agentNative.mcpHost.openLink",
	REQUEST_DISPLAY_MODE: "agentNative.mcpHost.requestDisplayMode",
	RESPONSE: "agentNative.mcpHost.response"
};
var REQUEST_TIMEOUT_MS = 5e3;
var DIRECT_MCP_APP_PROTOCOL_VERSION = "2026-01-26";
var snapshot = {
	context: null,
	capabilities: null,
	version: null
};
var listeners = /* @__PURE__ */ new Set();
var pending = /* @__PURE__ */ new Map();
var jsonRpcPending = /* @__PURE__ */ new Map();
var directMcpAppInit = null;
var listenerInstalled = false;
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function isBrowserWindow() {
	return typeof window !== "undefined" && typeof window.postMessage === "function";
}
function isInChildFrame() {
	if (!isBrowserWindow()) return false;
	try {
		return window.parent !== window;
	} catch {
		return false;
	}
}
function isMcpAppBridgeEnabled() {
	if (!isBrowserWindow()) return false;
	if (readEmbedMcpChatBridgeFlagFromUrl()) markEmbedMcpChatBridgeActive();
	if (isEmbedMcpChatBridgeActive() && isEmbedAuthActive()) return true;
	const params = new URLSearchParams(window.location.search || "");
	return params.get("embedded") === "1" && (params.has("__an_embed_token") || Boolean(getEmbedAuthToken())) && params.get("__an_mcp_chat_bridge") === "1";
}
function isClaudeMcpContentHost() {
	if (!isBrowserWindow()) return false;
	try {
		return /(^|\.)claudemcpcontent\.com$/i.test(window.location.hostname || "");
	} catch {
		return false;
	}
}
function hasWrapperBridge() {
	if (!isBrowserWindow()) return false;
	const params = new URLSearchParams(window.location.search || "");
	const mode = params.get("embedMode") ?? params.get("renderMode") ?? params.get("embed_mode") ?? "";
	if (mode === "iframe" || mode === "nested") return true;
	if (params.get("nested") === "1" || params.get("frame") === "iframe") return true;
	if (isClaudeMcpContentHost()) return false;
	return Boolean(getFrameOrigin());
}
function isTrustedParentMessage(event) {
	if (!isInChildFrame()) return false;
	if (event.source !== window.parent) return false;
	const expectedOrigin = getFrameOrigin();
	if (expectedOrigin && expectedOrigin !== "null") return event.origin === expectedOrigin;
	return true;
}
function requestId() {
	return `mcp-host-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function jsonRpcRequestId() {
	return `mcp-ui-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function notify() {
	for (const listener of listeners) listener();
}
function updateSnapshot(data) {
	if (!isRecord(data)) return;
	const nextSnapshot = {
		context: isRecord(data.context) ? data.context : snapshot.context,
		capabilities: isRecord(data.capabilities) ? data.capabilities : snapshot.capabilities,
		version: data.version !== void 0 ? data.version : snapshot.version
	};
	const hostInfo = isRecord(data.hostInfo) ? data.hostInfo : snapshot.hostInfo;
	if (hostInfo) nextSnapshot.hostInfo = hostInfo;
	snapshot = nextSnapshot;
	notify();
}
function updateSnapshotFromInitialize(result) {
	if (!isRecord(result)) return;
	updateSnapshot({
		context: result.hostContext,
		capabilities: result.hostCapabilities,
		version: result.protocolVersion,
		hostInfo: result.hostInfo
	});
}
function updateSnapshotFromOpenAiBridge(bridge) {
	updateSnapshot({
		context: {
			displayMode: bridge.displayMode,
			availableDisplayModes: typeof bridge.requestDisplayMode === "function" ? [
				"inline",
				"fullscreen",
				"pip"
			] : [],
			maxHeight: bridge.maxHeight,
			locale: bridge.locale,
			theme: bridge.theme,
			view: bridge.view
		},
		capabilities: {
			updateModelContext: typeof bridge.setWidgetState === "function",
			openLink: typeof bridge.openExternal === "function",
			displayModes: typeof bridge.requestDisplayMode === "function" ? [
				"inline",
				"fullscreen",
				"pip"
			] : [],
			openai: true
		},
		version: bridge.userAgent
	});
}
function resolvePending(data) {
	if (!isRecord(data) || typeof data.requestId !== "string") return;
	const request = pending.get(data.requestId);
	if (!request) return;
	pending.delete(data.requestId);
	clearTimeout(request.timeout);
	request.resolve(data.ok === true);
}
function resolveJsonRpc(data) {
	const id = typeof data.id === "string" ? data.id : String(data.id ?? "");
	if (!id) return;
	const request = jsonRpcPending.get(id);
	if (!request) return;
	jsonRpcPending.delete(id);
	clearTimeout(request.timeout);
	if (isRecord(data.error)) {
		const message = typeof data.error.message === "string" ? data.error.message : "MCP Apps host request failed.";
		request.reject(new Error(message));
		return;
	}
	request.resolve(data.result ?? {});
}
function handleJsonRpcNotification(message) {
	if (message.method !== "ui/notifications/host-context-changed") return;
	updateSnapshot({ context: isRecord(message.params) ? message.params : void 0 });
}
function onMessage(event) {
	if (!isTrustedParentMessage(event)) return;
	const message = event.data;
	if (!isRecord(message)) return;
	if (message.type === AGENT_NATIVE_MCP_APP_HOST_MESSAGE_TYPES.HOST_CONTEXT) {
		updateSnapshot(message.data);
		return;
	}
	if (message.type === AGENT_NATIVE_MCP_APP_HOST_MESSAGE_TYPES.RESPONSE) {
		resolvePending(message.data);
		return;
	}
	if (message.jsonrpc === "2.0") {
		if ("id" in message && ("result" in message || "error" in message)) {
			resolveJsonRpc(message);
			return;
		}
		if (typeof message.method === "string") handleJsonRpcNotification(message);
	}
}
function ensureListener() {
	if (!isBrowserWindow() || listenerInstalled) return;
	window.addEventListener("message", onMessage);
	listenerInstalled = true;
}
function postHostRequest(type, data) {
	ensureListener();
	if (!isInChildFrame() || !isMcpAppBridgeEnabled()) return false;
	if (!hasWrapperBridge()) return postDirectHostRequest(type, data);
	const id = typeof data.requestId === "string" && data.requestId ? data.requestId : requestId();
	const payload = {
		...data,
		requestId: id
	};
	return new Promise((resolve) => {
		const timeout = setTimeout(() => {
			pending.delete(id);
			resolve(false);
		}, REQUEST_TIMEOUT_MS);
		pending.set(id, {
			resolve,
			timeout
		});
		try {
			window.parent.postMessage({
				type,
				data: payload
			}, "*");
		} catch {
			pending.delete(id);
			clearTimeout(timeout);
			resolve(false);
		}
	});
}
function postWrapperHostChat(chat) {
	ensureListener();
	const id = requestId();
	const requestMode = normalizeMcpAppHostRequestMode(chat.requestMode ?? chat.mode);
	return new Promise((resolve) => {
		const timeout = setTimeout(() => {
			pending.delete(id);
			resolve(false);
		}, REQUEST_TIMEOUT_MS);
		pending.set(id, {
			resolve,
			timeout
		});
		try {
			window.parent.postMessage({
				type: "agentNative.submitChat",
				data: {
					requestId: id,
					message: chat.message,
					context: chat.context?.trim() || "",
					submit: true,
					...requestMode ? {
						mode: requestMode,
						requestMode
					} : {},
					...chat.content?.length ? { content: chat.content } : {},
					...chat.structuredContent !== void 0 ? { structuredContent: chat.structuredContent } : {}
				}
			}, "*");
		} catch {
			pending.delete(id);
			clearTimeout(timeout);
			resolve(false);
		}
	});
}
function readOpenAiBridge() {
	if (!isBrowserWindow()) return null;
	const bridge = window.openai;
	return bridge && typeof bridge === "object" ? bridge : null;
}
function objectValue(value) {
	return isRecord(value) ? value : {};
}
function normalizeMcpAppHostRequestMode(value) {
	return value === "act" || value === "plan" ? value : void 0;
}
function postJsonRpcNotification(method, params) {
	if (!isInChildFrame()) return;
	try {
		window.parent.postMessage({
			jsonrpc: "2.0",
			method,
			params
		}, "*");
	} catch {}
}
function waitForHostLifecycleTurn() {
	return new Promise((resolve) => window.setTimeout(resolve, 0));
}
function postJsonRpcRequest(method, params) {
	ensureListener();
	if (!isInChildFrame()) return false;
	const id = jsonRpcRequestId();
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			jsonRpcPending.delete(id);
			reject(/* @__PURE__ */ new Error("MCP Apps host did not respond."));
		}, REQUEST_TIMEOUT_MS);
		jsonRpcPending.set(id, {
			resolve,
			reject,
			timeout
		});
		try {
			window.parent.postMessage({
				jsonrpc: "2.0",
				id,
				method,
				params
			}, "*");
		} catch (err) {
			jsonRpcPending.delete(id);
			clearTimeout(timeout);
			reject(err instanceof Error ? err : new Error(String(err)));
		}
	});
}
async function ensureDirectMcpAppInitialized() {
	if (!isInChildFrame() || !isMcpAppBridgeEnabled()) return false;
	if (hasWrapperBridge()) return true;
	const openAiBridge = readOpenAiBridge();
	if (openAiBridge) {
		updateSnapshotFromOpenAiBridge(openAiBridge);
		return true;
	}
	if (!directMcpAppInit) directMcpAppInit = (async () => {
		updateSnapshotFromInitialize(await postJsonRpcRequest("ui/initialize", {
			protocolVersion: DIRECT_MCP_APP_PROTOCOL_VERSION,
			appInfo: {
				name: "Agent-Native App",
				version: "1.0.0"
			},
			appCapabilities: { availableDisplayModes: [
				"inline",
				"fullscreen",
				"pip"
			] }
		}));
		postJsonRpcNotification("ui/notifications/initialized", {});
		await waitForHostLifecycleTurn();
		await waitForHostLifecycleTurn();
		return true;
	})().catch(() => {
		directMcpAppInit = null;
		return false;
	});
	return directMcpAppInit;
}
async function waitForDirectMcpAppInitialized() {
	if (!await ensureDirectMcpAppInitialized()) throw new Error("MCP Apps host bridge is not available.");
}
async function postDirectHostRequest(type, data) {
	const openAiBridge = readOpenAiBridge();
	if (openAiBridge) {
		updateSnapshotFromOpenAiBridge(openAiBridge);
		if (type === AGENT_NATIVE_MCP_APP_HOST_MESSAGE_TYPES.UPDATE_MODEL_CONTEXT && typeof openAiBridge.setWidgetState === "function") {
			openAiBridge.setWidgetState({
				...objectValue(openAiBridge.widgetState),
				agentNativeModelContext: {
					...Array.isArray(data.content) ? { content: data.content } : {},
					...data.structuredContent !== void 0 ? { structuredContent: data.structuredContent } : {}
				}
			});
			return true;
		}
		if (type === AGENT_NATIVE_MCP_APP_HOST_MESSAGE_TYPES.OPEN_LINK && typeof openAiBridge.openExternal === "function" && typeof data.url === "string") {
			await openAiBridge.openExternal({
				href: data.url,
				redirectUrl: false
			});
			return true;
		}
		if (type === AGENT_NATIVE_MCP_APP_HOST_MESSAGE_TYPES.REQUEST_DISPLAY_MODE && typeof openAiBridge.requestDisplayMode === "function" && typeof data.mode === "string") {
			await openAiBridge.requestDisplayMode({ mode: data.mode });
			updateSnapshotFromOpenAiBridge(openAiBridge);
			return true;
		}
	}
	await waitForDirectMcpAppInitialized();
	await postJsonRpcRequest(type === AGENT_NATIVE_MCP_APP_HOST_MESSAGE_TYPES.UPDATE_MODEL_CONTEXT ? "ui/update-model-context" : type === AGENT_NATIVE_MCP_APP_HOST_MESSAGE_TYPES.OPEN_LINK ? "ui/open-link" : "ui/request-display-mode", data);
	return true;
}
function sendMcpAppHostMessage(chat) {
	if (!chat.message.trim() || !isInChildFrame() || !isMcpAppBridgeEnabled()) return false;
	if (hasWrapperBridge()) return postWrapperHostChat(chat);
	return (async () => {
		const openAiBridge = readOpenAiBridge();
		const context = chat.context?.trim() || null;
		const requestMode = normalizeMcpAppHostRequestMode(chat.requestMode ?? chat.mode);
		const requestModePayload = requestMode ? {
			mode: requestMode,
			requestMode
		} : {};
		const content = chat.content?.length ? chat.content : [{
			type: "text",
			text: chat.message
		}];
		const contextContent = context ? [{
			type: "text",
			text: context
		}, ...content.filter((part) => part && part.type !== "text")] : content.filter((part) => part && part.type !== "text");
		if (openAiBridge && typeof openAiBridge.sendFollowUpMessage === "function") {
			updateSnapshotFromOpenAiBridge(openAiBridge);
			if (typeof openAiBridge.setWidgetState === "function") openAiBridge.setWidgetState({
				...objectValue(openAiBridge.widgetState),
				agentNativeChatContext: context,
				agentNativeModelContext: {
					content: contextContent,
					...requestModePayload,
					...chat.structuredContent !== void 0 ? { structuredContent: chat.structuredContent } : {}
				}
			});
			await openAiBridge.sendFollowUpMessage({
				prompt: chat.message,
				scrollToBottom: true,
				...requestModePayload
			});
			return true;
		}
		await waitForDirectMcpAppInitialized();
		try {
			await postJsonRpcRequest("ui/update-model-context", {
				content: contextContent,
				...requestModePayload,
				...chat.structuredContent !== void 0 ? { structuredContent: chat.structuredContent } : {}
			});
		} catch {}
		await postJsonRpcRequest("ui/message", {
			role: "user",
			content,
			...requestModePayload
		});
		return true;
	})().catch(() => false);
}
function openMcpAppHostLink(url) {
	if (!url) return false;
	return postHostRequest(AGENT_NATIVE_MCP_APP_HOST_MESSAGE_TYPES.OPEN_LINK, { url });
}
ensureListener();
if (isBrowserWindow()) window.addEventListener("openai:set_globals", () => {
	const bridge = readOpenAiBridge();
	if (bridge) updateSnapshotFromOpenAiBridge(bridge);
}, { passive: true });
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/agent-chat.js
/**
* Agent Chat Bridge (browser)
*
* Sends structured messages to the agent chat from UI interactions.
* Messages are sent via postMessage to the parent window (or self if top-level).
* Builder frames are special: code requests go to Builder, but content prompts
* stay inside the embedded app so its own AgentSidebar can receive them.
*/
var AGENT_CHAT_MESSAGE_TYPE = "agentNative.submitChat";
var AGENT_CHAT_EXEC_MODE_KEY = "agent-native-exec-mode";
var AGENT_PANEL_PREPARE_EVENT = "agent-panel:prepare";
/**
* Listen for chatRunning messages from the frame (postMessage)
* and re-dispatch as a CustomEvent so hooks like useAgentChatGenerating() work.
*/
if (typeof window !== "undefined") window.addEventListener("message", (event) => {
	if (!isTrustedFrameMessage(event) && !isTrustedBuilderMessage(event)) return;
	if (event.data?.type === "agentNative.chatRunning" || event.data?.type === "builder.chatRunning") window.dispatchEvent(new CustomEvent("agentNative.chatRunning", { detail: event.data.detail ?? event.data.data }));
});
/** Generate a unique tab ID */
function generateTabId() {
	return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
/** Unique id for one submitted message, used to dedup live + replayed sends. */
function generateAgentChatSubmitMessageId() {
	return `submit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
var SELF_SUBMIT_BUFFER_TTL_MS = 8e3;
var bufferedSelfSubmits = [];
var claimedSubmitIds = /* @__PURE__ */ new Set();
function pruneSelfSubmitBuffer(now) {
	for (let i = bufferedSelfSubmits.length - 1; i >= 0; i -= 1) if (now - bufferedSelfSubmits[i].at > SELF_SUBMIT_BUFFER_TTL_MS) {
		const [removed] = bufferedSelfSubmits.splice(i, 1);
		if (removed) claimedSubmitIds.delete(removed.id);
	}
}
function bufferSelfSubmit(data) {
	const id = typeof data.submitMessageId === "string" ? data.submitMessageId : void 0;
	if (!id) return;
	const now = Date.now();
	pruneSelfSubmitBuffer(now);
	bufferedSelfSubmits.push({
		id,
		data,
		at: now
	});
}
function isMcpAppChatBridgeEnabled() {
	if (typeof window === "undefined" || window.parent === window) return false;
	if (readEmbedMcpChatBridgeFlagFromUrl()) markEmbedMcpChatBridgeActive();
	return isEmbedMcpChatBridgeActive() && isEmbedAuthActive();
}
function isDirectMcpAppEmbedSession() {
	if (typeof window === "undefined" || window.parent === window) return false;
	if (readEmbedMcpChatBridgeFlagFromUrl()) markEmbedMcpChatBridgeActive();
	return isEmbedAuthActive() && !isEmbedMcpChatBridgeActive();
}
function dispatchAgentChatRunning(isRunning, tabId) {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent("agentNative.chatRunning", { detail: {
		isRunning,
		...tabId ? { tabId } : {}
	} }));
}
function normalizeAgentChatRequestMode(value) {
	return value === "act" || value === "plan" ? value : void 0;
}
function normalizeStoredAgentChatExecMode(value) {
	if (value === "plan") return "plan";
	if (value === "build" || value === "act") return "act";
}
function readStoredAgentChatRequestMode() {
	if (typeof window === "undefined") return void 0;
	try {
		const storage = window.localStorage;
		const saved = normalizeStoredAgentChatExecMode(storage.getItem(AGENT_CHAT_EXEC_MODE_KEY));
		if (saved) return saved;
		const scopedModes = [];
		for (let index = 0; index < storage.length; index += 1) {
			const key = storage.key(index);
			if (!key?.startsWith(`${AGENT_CHAT_EXEC_MODE_KEY}:`)) continue;
			const scopedSaved = normalizeStoredAgentChatExecMode(storage.getItem(key));
			if (scopedSaved) scopedModes.push(scopedSaved);
		}
		if (scopedModes.length === 1) return scopedModes[0];
	} catch {}
}
/**
* Send a message to the agent chat via postMessage.
* Returns the stable tabId for tracking this chat run.
*/
function sendToAgentChat(opts) {
	const tabId = opts.tabId ?? generateTabId();
	const actionScope = opts.actionScope === void 0 ? void 0 : normalizeAgentActionScope(opts.actionScope);
	const isCodeRequest = opts.type === "code" || opts.requiresCode === true;
	const localChatTarget = opts.chatTarget === "local";
	const requestMode = normalizeAgentChatRequestMode(opts.requestMode ?? opts.mode) ?? readStoredAgentChatRequestMode();
	if (opts.submit !== false && opts.message.trim()) trackEvent("app.first_action", {
		action: "chat_submit",
		surface: opts.preset ?? "chat",
		request_mode: requestMode ?? "default",
		chat_target: opts.chatTarget ?? "auto",
		background: opts.background === true
	});
	if (isCodeRequest && isInBuilderFrame()) {
		sendToBuilderChat({
			message: opts.message,
			context: opts.context,
			submit: opts.submit,
			...requestMode ? {
				mode: requestMode,
				requestMode
			} : {}
		});
		return tabId;
	}
	const submitMessageId = opts.submitMessageId ?? generateAgentChatSubmitMessageId();
	const payload = {
		type: AGENT_CHAT_MESSAGE_TYPE,
		data: {
			...opts,
			...actionScope ? { actionScope } : {},
			tabId,
			submitMessageId,
			...requestMode ? {
				mode: requestMode,
				requestMode
			} : {}
		}
	};
	if (opts.submit !== false && !localChatTarget && isMcpAppChatBridgeEnabled()) {
		if (opts.attachments?.length || opts.usageLabel || actionScope) {
			window.parent.postMessage(payload, getFramePostMessageTargetOrigin() || "*");
			return tabId;
		}
		const directHostMessage = sendMcpAppHostMessage({
			message: opts.message,
			context: opts.context,
			...requestMode ? {
				mode: requestMode,
				requestMode
			} : {}
		});
		if (directHostMessage) {
			Promise.resolve(directHostMessage).then((ok) => {
				if (!ok) window.parent.postMessage(payload, getFramePostMessageTargetOrigin() || "*");
			}).finally(() => {
				dispatchAgentChatRunning(false, tabId);
			});
			return tabId;
		}
		window.parent.postMessage(payload, getFramePostMessageTargetOrigin() || "*");
		return tabId;
	}
	const shouldOpenSidebar = opts.openSidebar !== false && !opts.background;
	const targetSelf = !isCodeRequest && (localChatTarget || isInBuilderFrame() || isDirectMcpAppEmbedSession());
	const target = targetSelf ? window : window.parent !== window ? window.parent : window;
	const targetOrigin = targetSelf ? window.location.origin : getFramePostMessageTargetOrigin() || window.location.origin;
	if (shouldOpenSidebar) {
		window.dispatchEvent(new CustomEvent("agent-panel:set-mode", { detail: { mode: "chat" } }));
		window.dispatchEvent(new CustomEvent("agent-panel:open"));
	} else if (!isCodeRequest) window.dispatchEvent(new CustomEvent(AGENT_PANEL_PREPARE_EVENT));
	const postToTarget = () => target.postMessage(payload, targetOrigin);
	if (!isCodeRequest && target === window) {
		bufferSelfSubmit(payload.data);
		setTimeout(postToTarget, 0);
	} else postToTarget();
	return tabId;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/settings/BuilderConnectPopover.js
function BuilderConnectPopover({ flow, children, onConnect, onTriggerClick, defaultProvisionAccount = false, contentTestId, primaryTestId, secondaryTestId }) {
	const t = useT();
	const [open, setOpen] = (0, import_react.useState)(false);
	const capabilityResolved = flow.statusResolved === true;
	const showPopover = defaultProvisionAccount && !capabilityResolved || capabilityResolved && flow.agentNativeProvisioningEnabled === true;
	const accountExists = capabilityResolved && flow.accountExists;
	const initiatedByThisTriggerRef = (0, import_react.useRef)(false);
	const [queuedClick, setQueuedClick] = (0, import_react.useState)(null);
	const settledCount = flow.statusReadSettledCount ?? 0;
	(0, import_react.useEffect)(() => {
		if (accountExists && initiatedByThisTriggerRef.current) {
			initiatedByThisTriggerRef.current = false;
			setOpen(true);
		}
	}, [accountExists]);
	const start = (provisionAccount) => {
		initiatedByThisTriggerRef.current = true;
		setOpen(false);
		if (onConnect) {
			onConnect(provisionAccount);
			return;
		}
		flow.start({ provisionAccount });
	};
	const openQueuedPopoverRef = (0, import_react.useRef)(() => {});
	openQueuedPopoverRef.current = () => {
		setQueuedClick(null);
		if (showPopover) setOpen(true);
	};
	(0, import_react.useEffect)(() => {
		if (!queuedClick) return;
		if (capabilityResolved) {
			openQueuedPopoverRef.current();
			return;
		}
		if (settledCount !== queuedClick.settledAt) setQueuedClick(null);
	}, [
		queuedClick,
		capabilityResolved,
		settledCount
	]);
	const trigger = import_react.cloneElement(children, {
		"aria-busy": queuedClick ? true : void 0,
		onClick: (event) => {
			if (flow.connecting) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}
			if (!capabilityResolved) {
				event.preventDefault();
				event.stopPropagation();
				if (defaultProvisionAccount) {
					setOpen(true);
					return;
				}
				if (queuedClick) return;
				if (flow.retry?.() === true) setQueuedClick({ settledAt: settledCount });
				return;
			}
			children.props.onClick?.(event);
			onTriggerClick?.(event);
			if (!showPopover && !event.defaultPrevented) start(false);
		}
	});
	if (!showPopover) return trigger;
	return (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [(0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: trigger
		}), (0, import_jsx_runtime.jsx)(PopoverContent, {
			align: "end",
			side: "bottom",
			sideOffset: -40,
			"aria-labelledby": "builder-connect-popover-title",
			"data-testid": contentTestId,
			className: "z-[110] w-80 max-w-[calc(100vw-2rem)] p-3 text-left",
			children: (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2.5",
				children: [
					(0, import_jsx_runtime.jsx)("h2", {
						id: "builder-connect-popover-title",
						className: "text-sm font-semibold text-foreground",
						children: accountExists ? t("agentChat.onboarding.builderAccountExistsTitle") : t("agentChat.onboarding.builderActivateTitle")
					}),
					(0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-5 text-muted-foreground",
						children: accountExists ? t("agentChat.onboarding.builderAccountExistsDescription") : t("agentChat.onboarding.builderActivationDescription")
					}),
					(0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": primaryTestId,
						className: cn$1("inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait disabled:opacity-60"),
						onClick: () => start(accountExists ? false : true),
						disabled: flow.connecting,
						children: [
							flow.connecting ? (0, import_jsx_runtime.jsx)(IconLoader2, {
								size: 14,
								className: "animate-spin"
							}) : null,
							accountExists ? t("agentChat.auth.logIn") : flow.connecting ? t("agentChat.onboarding.builderActivating") : t("agentChat.onboarding.builderCreateAndActivate"),
							!accountExists && !flow.connecting ? (0, import_jsx_runtime.jsx)(IconArrowRight, { size: 15 }) : null
						]
					}),
					!accountExists && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] leading-4 text-muted-foreground",
						children: [
							t("agentChat.onboarding.builderConsentPrefix"),
							" ",
							(0, import_jsx_runtime.jsx)("a", {
								href: "https://www.builder.io/legal/terms",
								target: "_blank",
								rel: "noreferrer",
								className: "text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								children: t("agentChat.onboarding.builderTerms")
							}),
							" ",
							t("agentChat.onboarding.builderConsentAnd"),
							" ",
							(0, import_jsx_runtime.jsx)("a", {
								href: "https://www.builder.io/legal/privacy",
								target: "_blank",
								rel: "noreferrer",
								className: "text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								children: t("agentChat.onboarding.builderPrivacy")
							}),
							"."
						]
					}), (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-testid": secondaryTestId,
						className: "inline-flex min-h-9 w-full items-center justify-center rounded-lg px-4 text-xs font-normal text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait disabled:opacity-60",
						onClick: () => start(false),
						disabled: flow.connecting,
						children: t("agentChat.onboarding.builderExistingAccount")
					})] })
				]
			})
		})]
	});
}
//#endregion
//#region node_modules/.pnpm/cmdk@1.1.1_@types+react-dom@19.2.3_@types+react@19.2.17__@types+react@19.2.17_react-dom_bc1678d6d5a7ffb92aa41dc7846a5030/node_modules/cmdk/dist/chunk-NZJY6EH4.mjs
var U = 1;
var Y$1 = .9;
var H = .8;
var J = .17;
var p = .1;
var u = .999;
var $ = .9999;
var k$1 = .99;
var m = /[\\\/_+.#"@\[\(\{&]/;
var B$1 = /[\\\/_+.#"@\[\(\{&]/g;
var K$1 = /[\s-]/;
var X = /[\s-]/g;
function G(_, C, h, P, A, f, O) {
	if (f === C.length) return A === _.length ? U : k$1;
	var T = `${A},${f}`;
	if (O[T] !== void 0) return O[T];
	for (var L = P.charAt(f), c = h.indexOf(L, A), S = 0, E, N, R, M; c >= 0;) E = G(_, C, h, P, c + 1, f + 1, O), E > S && (c === A ? E *= U : m.test(_.charAt(c - 1)) ? (E *= H, R = _.slice(A, c - 1).match(B$1), R && A > 0 && (E *= Math.pow(u, R.length))) : K$1.test(_.charAt(c - 1)) ? (E *= Y$1, M = _.slice(A, c - 1).match(X), M && A > 0 && (E *= Math.pow(u, M.length))) : (E *= J, A > 0 && (E *= Math.pow(u, c - A))), _.charAt(c) !== C.charAt(f) && (E *= $)), (E < p && h.charAt(c - 1) === P.charAt(f + 1) || P.charAt(f + 1) === P.charAt(f) && h.charAt(c - 1) !== P.charAt(f)) && (N = G(_, C, h, P, c + 1, f + 2, O), N * p > E && (E = N * p)), E > S && (S = E), c = h.indexOf(L, c + 1);
	return O[T] = S, S;
}
function D(_) {
	return _.toLowerCase().replace(X, " ");
}
function W(_, C, h) {
	return _ = h && h.length > 0 ? `${_ + " " + h.join(" ")}` : _, G(_, C, D(_), D(C), 0, 0, {});
}
//#endregion
//#region node_modules/.pnpm/cmdk@1.1.1_@types+react-dom@19.2.3_@types+react@19.2.17__@types+react@19.2.17_react-dom_bc1678d6d5a7ffb92aa41dc7846a5030/node_modules/cmdk/dist/index.mjs
var N = "[cmdk-group=\"\"]";
var Y = "[cmdk-group-items=\"\"]";
var be = "[cmdk-group-heading=\"\"]";
var le = "[cmdk-item=\"\"]";
var ce = `${le}:not([aria-disabled="true"])`;
var Z = "cmdk-item-select";
var T = "data-value";
var Re = (r, o, n) => W(r, o, n);
var ue = import_react.createContext(void 0);
var K = () => import_react.useContext(ue);
var de = import_react.createContext(void 0);
var ee = () => import_react.useContext(de);
var fe = import_react.createContext(void 0);
var me = import_react.forwardRef((r, o) => {
	let n = L(() => {
		var e, a;
		return {
			search: "",
			value: (a = (e = r.value) != null ? e : r.defaultValue) != null ? a : "",
			selectedItemId: void 0,
			filtered: {
				count: 0,
				items: /* @__PURE__ */ new Map(),
				groups: /* @__PURE__ */ new Set()
			}
		};
	}), u = L(() => /* @__PURE__ */ new Set()), c = L(() => /* @__PURE__ */ new Map()), d = L(() => /* @__PURE__ */ new Map()), f = L(() => /* @__PURE__ */ new Set()), p = pe(r), { label: b, children: m, value: R, onValueChange: x, filter: C, shouldFilter: S, loop: A, disablePointerSelection: ge = !1, vimBindings: j = !0, ...O } = r, $ = useId$1(), q = useId$1(), _ = useId$1(), I = import_react.useRef(null), v = ke();
	k(() => {
		if (R !== void 0) {
			let e = R.trim();
			n.current.value = e, E.emit();
		}
	}, [R]), k(() => {
		v(6, ne);
	}, []);
	let E = import_react.useMemo(() => ({
		subscribe: (e) => (f.current.add(e), () => f.current.delete(e)),
		snapshot: () => n.current,
		setState: (e, a, s) => {
			var i, l, g, y;
			if (!Object.is(n.current[e], a)) {
				if (n.current[e] = a, e === "search") J(), z(), v(1, W);
				else if (e === "value") {
					if (document.activeElement.hasAttribute("cmdk-input") || document.activeElement.hasAttribute("cmdk-root")) {
						let h = document.getElementById(_);
						h ? h.focus() : (i = document.getElementById($)) == null || i.focus();
					}
					if (v(7, () => {
						var h;
						n.current.selectedItemId = (h = M()) == null ? void 0 : h.id, E.emit();
					}), s || v(5, ne), ((l = p.current) == null ? void 0 : l.value) !== void 0) {
						let h = a != null ? a : "";
						(y = (g = p.current).onValueChange) == null || y.call(g, h);
						return;
					}
				}
				E.emit();
			}
		},
		emit: () => {
			f.current.forEach((e) => e());
		}
	}), []), U = import_react.useMemo(() => ({
		value: (e, a, s) => {
			var i;
			a !== ((i = d.current.get(e)) == null ? void 0 : i.value) && (d.current.set(e, {
				value: a,
				keywords: s
			}), n.current.filtered.items.set(e, te(a, s)), v(2, () => {
				z(), E.emit();
			}));
		},
		item: (e, a) => (u.current.add(e), a && (c.current.has(a) ? c.current.get(a).add(e) : c.current.set(a, /* @__PURE__ */ new Set([e]))), v(3, () => {
			J(), z(), n.current.value || W(), E.emit();
		}), () => {
			d.current.delete(e), u.current.delete(e), n.current.filtered.items.delete(e);
			let s = M();
			v(4, () => {
				J(), (s == null ? void 0 : s.getAttribute("id")) === e && W(), E.emit();
			});
		}),
		group: (e) => (c.current.has(e) || c.current.set(e, /* @__PURE__ */ new Set()), () => {
			d.current.delete(e), c.current.delete(e);
		}),
		filter: () => p.current.shouldFilter,
		label: b || r["aria-label"],
		getDisablePointerSelection: () => p.current.disablePointerSelection,
		listId: $,
		inputId: _,
		labelId: q,
		listInnerRef: I
	}), []);
	function te(e, a) {
		var i, l;
		let s = (l = (i = p.current) == null ? void 0 : i.filter) != null ? l : Re;
		return e ? s(e, n.current.search, a) : 0;
	}
	function z() {
		if (!n.current.search || p.current.shouldFilter === !1) return;
		let e = n.current.filtered.items, a = [];
		n.current.filtered.groups.forEach((i) => {
			let l = c.current.get(i), g = 0;
			l.forEach((y) => {
				let h = e.get(y);
				g = Math.max(h, g);
			}), a.push([i, g]);
		});
		let s = I.current;
		V().sort((i, l) => {
			var h, F;
			let g = i.getAttribute("id"), y = l.getAttribute("id");
			return ((h = e.get(y)) != null ? h : 0) - ((F = e.get(g)) != null ? F : 0);
		}).forEach((i) => {
			let l = i.closest(Y);
			l ? l.appendChild(i.parentElement === l ? i : i.closest(`${Y} > *`)) : s.appendChild(i.parentElement === s ? i : i.closest(`${Y} > *`));
		}), a.sort((i, l) => l[1] - i[1]).forEach((i) => {
			var g;
			let l = (g = I.current) == null ? void 0 : g.querySelector(`${N}[${T}="${encodeURIComponent(i[0])}"]`);
			l?.parentElement.appendChild(l);
		});
	}
	function W() {
		let e = V().find((s) => s.getAttribute("aria-disabled") !== "true"), a = e == null ? void 0 : e.getAttribute(T);
		E.setState("value", a || void 0);
	}
	function J() {
		var a, s, i, l;
		if (!n.current.search || p.current.shouldFilter === !1) {
			n.current.filtered.count = u.current.size;
			return;
		}
		n.current.filtered.groups = /* @__PURE__ */ new Set();
		let e = 0;
		for (let g of u.current) {
			let F = te((s = (a = d.current.get(g)) == null ? void 0 : a.value) != null ? s : "", (l = (i = d.current.get(g)) == null ? void 0 : i.keywords) != null ? l : []);
			n.current.filtered.items.set(g, F), F > 0 && e++;
		}
		for (let [g, y] of c.current) for (let h of y) if (n.current.filtered.items.get(h) > 0) {
			n.current.filtered.groups.add(g);
			break;
		}
		n.current.filtered.count = e;
	}
	function ne() {
		var a, s, i;
		let e = M();
		e && (((a = e.parentElement) == null ? void 0 : a.firstChild) === e && ((i = (s = e.closest(N)) == null ? void 0 : s.querySelector(be)) == null || i.scrollIntoView({ block: "nearest" })), e.scrollIntoView({ block: "nearest" }));
	}
	function M() {
		var e;
		return (e = I.current) == null ? void 0 : e.querySelector(`${le}[aria-selected="true"]`);
	}
	function V() {
		var e;
		return Array.from(((e = I.current) == null ? void 0 : e.querySelectorAll(ce)) || []);
	}
	function X(e) {
		let s = V()[e];
		s && E.setState("value", s.getAttribute(T));
	}
	function Q(e) {
		var g;
		let a = M(), s = V(), i = s.findIndex((y) => y === a), l = s[i + e];
		(g = p.current) != null && g.loop && (l = i + e < 0 ? s[s.length - 1] : i + e === s.length ? s[0] : s[i + e]), l && E.setState("value", l.getAttribute(T));
	}
	function re(e) {
		let a = M(), s = a == null ? void 0 : a.closest(N), i;
		for (; s && !i;) s = e > 0 ? we(s, N) : De(s, N), i = s == null ? void 0 : s.querySelector(ce);
		i ? E.setState("value", i.getAttribute(T)) : Q(e);
	}
	let oe = () => X(V().length - 1), ie = (e) => {
		e.preventDefault(), e.metaKey ? oe() : e.altKey ? re(1) : Q(1);
	}, se = (e) => {
		e.preventDefault(), e.metaKey ? X(0) : e.altKey ? re(-1) : Q(-1);
	};
	return import_react.createElement(Primitive.div, {
		ref: o,
		tabIndex: -1,
		...O,
		"cmdk-root": "",
		onKeyDown: (e) => {
			var s;
			(s = O.onKeyDown) == null || s.call(O, e);
			let a = e.nativeEvent.isComposing || e.keyCode === 229;
			if (!(e.defaultPrevented || a)) switch (e.key) {
				case "n":
				case "j":
					j && e.ctrlKey && ie(e);
					break;
				case "ArrowDown":
					ie(e);
					break;
				case "p":
				case "k":
					j && e.ctrlKey && se(e);
					break;
				case "ArrowUp":
					se(e);
					break;
				case "Home":
					e.preventDefault(), X(0);
					break;
				case "End":
					e.preventDefault(), oe();
					break;
				case "Enter": {
					e.preventDefault();
					let i = M();
					if (i) {
						let l = new Event(Z);
						i.dispatchEvent(l);
					}
				}
			}
		}
	}, import_react.createElement("label", {
		"cmdk-label": "",
		htmlFor: U.inputId,
		id: U.labelId,
		style: Te
	}, b), B(r, (e) => import_react.createElement(de.Provider, { value: E }, import_react.createElement(ue.Provider, { value: U }, e))));
});
var he = import_react.forwardRef((r, o) => {
	var _, I;
	let n = useId$1(), u = import_react.useRef(null), c = import_react.useContext(fe), d = K(), f = pe(r), p = (I = (_ = f.current) == null ? void 0 : _.forceMount) != null ? I : c == null ? void 0 : c.forceMount;
	k(() => {
		if (!p) return d.item(n, c == null ? void 0 : c.id);
	}, [p]);
	let b = ve(n, u, [
		r.value,
		r.children,
		u
	], r.keywords), m = ee(), R = P((v) => v.value && v.value === b.current), x = P((v) => p || d.filter() === !1 ? !0 : v.search ? v.filtered.items.get(n) > 0 : !0);
	import_react.useEffect(() => {
		let v = u.current;
		if (!(!v || r.disabled)) return v.addEventListener(Z, C), () => v.removeEventListener(Z, C);
	}, [
		x,
		r.onSelect,
		r.disabled
	]);
	function C() {
		var v, E;
		S(), (E = (v = f.current).onSelect) == null || E.call(v, b.current);
	}
	function S() {
		m.setState("value", b.current, !0);
	}
	if (!x) return null;
	let { disabled: A, value: ge, onSelect: j, forceMount: O, keywords: $, ...q } = r;
	return import_react.createElement(Primitive.div, {
		ref: composeRefs(u, o),
		...q,
		id: n,
		"cmdk-item": "",
		role: "option",
		"aria-disabled": !!A,
		"aria-selected": !!R,
		"data-disabled": !!A,
		"data-selected": !!R,
		onPointerMove: A || d.getDisablePointerSelection() ? void 0 : S,
		onClick: A ? void 0 : C
	}, r.children);
});
var Ee = import_react.forwardRef((r, o) => {
	let { heading: n, children: u, forceMount: c, ...d } = r, f = useId$1(), p = import_react.useRef(null), b = import_react.useRef(null), m = useId$1(), R = K(), x = P((S) => c || R.filter() === !1 ? !0 : S.search ? S.filtered.groups.has(f) : !0);
	k(() => R.group(f), []), ve(f, p, [
		r.value,
		r.heading,
		b
	]);
	let C = import_react.useMemo(() => ({
		id: f,
		forceMount: c
	}), [c]);
	return import_react.createElement(Primitive.div, {
		ref: composeRefs(p, o),
		...d,
		"cmdk-group": "",
		role: "presentation",
		hidden: x ? void 0 : !0
	}, n && import_react.createElement("div", {
		ref: b,
		"cmdk-group-heading": "",
		"aria-hidden": !0,
		id: m
	}, n), B(r, (S) => import_react.createElement("div", {
		"cmdk-group-items": "",
		role: "group",
		"aria-labelledby": n ? m : void 0
	}, import_react.createElement(fe.Provider, { value: C }, S))));
});
var ye = import_react.forwardRef((r, o) => {
	let { alwaysRender: n, ...u } = r, c = import_react.useRef(null), d = P((f) => !f.search);
	return !n && !d ? null : import_react.createElement(Primitive.div, {
		ref: composeRefs(c, o),
		...u,
		"cmdk-separator": "",
		role: "separator"
	});
});
var Se = import_react.forwardRef((r, o) => {
	let { onValueChange: n, ...u } = r, c = r.value != null, d = ee(), f = P((m) => m.search), p = P((m) => m.selectedItemId), b = K();
	return import_react.useEffect(() => {
		r.value != null && d.setState("search", r.value);
	}, [r.value]), import_react.createElement(Primitive.input, {
		ref: o,
		...u,
		"cmdk-input": "",
		autoComplete: "off",
		autoCorrect: "off",
		spellCheck: !1,
		"aria-autocomplete": "list",
		role: "combobox",
		"aria-expanded": !0,
		"aria-controls": b.listId,
		"aria-labelledby": b.labelId,
		"aria-activedescendant": p,
		id: b.inputId,
		type: "text",
		value: c ? r.value : f,
		onChange: (m) => {
			c || d.setState("search", m.target.value), n?.(m.target.value);
		}
	});
});
var Ce = import_react.forwardRef((r, o) => {
	let { children: n, label: u = "Suggestions", ...c } = r, d = import_react.useRef(null), f = import_react.useRef(null), p = P((m) => m.selectedItemId), b = K();
	return import_react.useEffect(() => {
		if (f.current && d.current) {
			let m = f.current, R = d.current, x, C = new ResizeObserver(() => {
				x = requestAnimationFrame(() => {
					let S = m.offsetHeight;
					R.style.setProperty("--cmdk-list-height", S.toFixed(1) + "px");
				});
			});
			return C.observe(m), () => {
				cancelAnimationFrame(x), C.unobserve(m);
			};
		}
	}, []), import_react.createElement(Primitive.div, {
		ref: composeRefs(d, o),
		...c,
		"cmdk-list": "",
		role: "listbox",
		tabIndex: -1,
		"aria-activedescendant": p,
		"aria-label": u,
		id: b.listId
	}, B(r, (m) => import_react.createElement("div", {
		ref: composeRefs(f, b.listInnerRef),
		"cmdk-list-sizer": ""
	}, m)));
});
var xe = import_react.forwardRef((r, o) => {
	let { open: n, onOpenChange: u, overlayClassName: c, contentClassName: d, container: f, ...p } = r;
	return import_react.createElement(Dialog$1, {
		open: n,
		onOpenChange: u
	}, import_react.createElement(DialogPortal$1, { container: f }, import_react.createElement(DialogOverlay$1, {
		"cmdk-overlay": "",
		className: c
	}), import_react.createElement(DialogContent$1, {
		"aria-label": r.label,
		"cmdk-dialog": "",
		className: d
	}, import_react.createElement(me, {
		ref: o,
		...p
	}))));
});
var Ie = import_react.forwardRef((r, o) => P((u) => u.filtered.count === 0) ? import_react.createElement(Primitive.div, {
	ref: o,
	...r,
	"cmdk-empty": "",
	role: "presentation"
}) : null);
var Pe = import_react.forwardRef((r, o) => {
	let { progress: n, children: u, label: c = "Loading...", ...d } = r;
	return import_react.createElement(Primitive.div, {
		ref: o,
		...d,
		"cmdk-loading": "",
		role: "progressbar",
		"aria-valuenow": n,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-label": c
	}, B(r, (f) => import_react.createElement("div", { "aria-hidden": !0 }, f)));
});
var _e = Object.assign(me, {
	List: Ce,
	Item: he,
	Input: Se,
	Group: Ee,
	Separator: ye,
	Dialog: xe,
	Empty: Ie,
	Loading: Pe
});
function we(r, o) {
	let n = r.nextElementSibling;
	for (; n;) {
		if (n.matches(o)) return n;
		n = n.nextElementSibling;
	}
}
function De(r, o) {
	let n = r.previousElementSibling;
	for (; n;) {
		if (n.matches(o)) return n;
		n = n.previousElementSibling;
	}
}
function pe(r) {
	let o = import_react.useRef(r);
	return k(() => {
		o.current = r;
	}), o;
}
var k = typeof window == "undefined" ? import_react.useEffect : import_react.useLayoutEffect;
function L(r) {
	let o = import_react.useRef();
	return o.current === void 0 && (o.current = r()), o;
}
function P(r) {
	let o = ee(), n = () => r(o.snapshot());
	return import_react.useSyncExternalStore(o.subscribe, n, n);
}
function ve(r, o, n, u = []) {
	let c = import_react.useRef(), d = K();
	return k(() => {
		var b;
		let f = (() => {
			var m;
			for (let R of n) {
				if (typeof R == "string") return R.trim();
				if (typeof R == "object" && "current" in R) return R.current ? (m = R.current.textContent) == null ? void 0 : m.trim() : c.current;
			}
		})(), p = u.map((m) => m.trim());
		d.value(r, f, p), (b = o.current) == null || b.setAttribute(T, f), c.current = f;
	}), c;
}
var ke = () => {
	let [r, o] = import_react.useState(), n = L(() => /* @__PURE__ */ new Map());
	return k(() => {
		n.current.forEach((u) => u()), n.current = /* @__PURE__ */ new Map();
	}, [r]), (u, c) => {
		n.current.set(u, c), o({});
	};
};
function Me(r) {
	let o = r.type;
	return typeof o == "function" ? o(r.props) : "render" in o ? o.render(r.props) : r;
}
function B({ asChild: r, children: o }, n) {
	return r && import_react.isValidElement(o) ? import_react.cloneElement(Me(o), { ref: o.ref }, n(o.props.children)) : n(o);
}
var Te = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	borderWidth: "0"
};
//#endregion
//#region node_modules/.pnpm/@agent-native+toolkit@0.20.4_@floating-ui+dom@1.7.6_@tiptap+extension-code-block@3.28.0_0ff20177eefff338d7ce7908b45858f5/node_modules/@agent-native/toolkit/dist/ui/command.js
var Command = import_react.forwardRef(({ className, ...props }, ref) => (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [(0, import_jsx_runtime.jsx)(IconSearch, { className: "me-2 h-4 w-4 shrink-0 opacity-50" }), (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup$1 = import_react.forwardRef(({ className, ...props }, ref) => (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup$1.displayName = _e.Group.displayName;
var CommandSeparator$1 = import_react.forwardRef(({ className, ...props }, ref) => (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator$1.displayName = _e.Separator.displayName;
var CommandItem$1 = import_react.forwardRef(({ className, ...props }, ref) => (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50", className),
	...props
}));
CommandItem$1.displayName = _e.Item.displayName;
var CommandShortcut$1 = ({ className, ...props }) => {
	return (0, import_jsx_runtime.jsx)("span", {
		className: cn("ms-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut$1.displayName = "CommandShortcut";
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/builder-link-tracking.js
var BUILDER_UTM_SOURCE = "agent-native";
function applyBuilderUtmTrackingParams(params, options = {}) {
	params.set("utm_source", BUILDER_UTM_SOURCE);
	params.set("utm_medium", options.medium ?? "product");
	params.set("utm_campaign", options.campaign ?? "onboarding");
	if (options.content) params.set("utm_content", options.content);
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/oauth-popup.js
function oauthPopupWaitingUrl() {
	if (typeof window === "undefined") return "";
	return new URL(agentNativePath("/_agent-native/oauth/popup"), window.location.href).href;
}
function openOAuthPopup({ initialUrl, features } = {}) {
	if (typeof window === "undefined") return null;
	const url = new URL(initialUrl || oauthPopupWaitingUrl(), window.location.href);
	if (url.protocol !== "http:" && url.protocol !== "https:") return null;
	return window.open(url.href, "_blank", features);
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/settings/useBuilderStatus.js
var POLL_INTERVAL_MS = 2e3;
var POLL_TIMEOUT_MS = 300 * 1e3;
var POPUP_CLOSED_CONFIRMATION_GRACE_MS = 2e4;
var POPUP_LOAD_TIMEOUT_MS = 2e4;
var STATUS_FETCH_ABORT_MS = 1e4;
var BUILDER_STATUS_UNAVAILABLE_MESSAGE = "Couldn't reach Builder to check your account. Retrying.";
var CALLBACK_SUCCESS_STATUS_RETRY_MS = 500;
var CALLBACK_SUCCESS_STATUS_RETRIES = 10;
var BUILDER_CONNECT_PARAM = "_an_connect";
var BUILDER_CONNECT_MODE_PARAM = "_an_mode";
var BUILDER_AGENT_NATIVE_PROVISION_MODE = "agent-native";
var BUILDER_PROVISIONING_TOKEN_PARAM = "_an_provision";
var BUILDER_CONNECT_ATTEMPT_PARAM = "_an_connect_attempt";
var BUILDER_SIGNUP_SOURCE_PARAM = "signupSource";
var BUILDER_AGENT_NATIVE_FLOW_PARAM = "agentNativeFlow";
var BUILDER_AGENT_NATIVE_CONNECT_SOURCE_PARAM = "agentNativeConnectSource";
var BUILDER_AGENT_NATIVE_APP_PARAM = "agentNativeApp";
var BUILDER_AGENT_NATIVE_TEMPLATE_PARAM = "agentNativeTemplate";
var BUILDER_SIGNUP_SOURCE = "agent-native";
var STATUS_CONNECT_URL_TTL_MS = 540 * 1e3;
function cleanTrackingParam(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed.slice(0, 120) : null;
}
function inferBuilderConnectTrackingFlow(source) {
	const normalized = source?.toLowerCase() ?? "";
	if (normalized.includes("background_agent")) return "background_agent";
	if (normalized.includes("code_required") || normalized.includes("code_access") || normalized.includes("connect_builder_card")) return "background_agent";
	if (normalized.includes("browser")) return "browser_automation";
	if (normalized.includes("voice") || normalized.includes("transcription")) return "voice_transcription";
	if (normalized.includes("upload")) return "file_upload";
	if (normalized.includes("hosting")) return "hosting";
	if (normalized.includes("database")) return "database";
	if (normalized.includes("auth_settings")) return "auth";
	return "connect_llm";
}
function normalizeTrackingSlug(value) {
	const trimmed = value?.trim();
	if (!trimmed) return null;
	return (trimmed.startsWith("@") ? trimmed.split("/").pop() ?? trimmed : trimmed).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || null;
}
function inferBuilderConnectTrackingIdentity(options) {
	const env = {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"SSR": true
	};
	const app = normalizeTrackingSlug(options.app) ?? normalizeTrackingSlug(env.VITE_AGENT_NATIVE_APP) ?? (typeof window !== "undefined" ? normalizeTrackingSlug(window.location.hostname.split(".")[0]) : null);
	return {
		app,
		template: normalizeTrackingSlug(options.template) ?? normalizeTrackingSlug(env.VITE_AGENT_NATIVE_TEMPLATE) ?? normalizeTrackingSlug(env.VITE_APP_TEMPLATE) ?? (app?.startsWith("agent-native-") ? normalizeTrackingSlug(app.slice(13)) : app && app !== "localhost" ? app : null)
	};
}
function applyBuilderConnectTrackingParams(params, tracking) {
	params.set(BUILDER_SIGNUP_SOURCE_PARAM, BUILDER_SIGNUP_SOURCE);
	params.set(BUILDER_AGENT_NATIVE_FLOW_PARAM, tracking.flow);
	if (tracking.source) params.set(BUILDER_AGENT_NATIVE_CONNECT_SOURCE_PARAM, tracking.source);
	if (tracking.app) params.set(BUILDER_AGENT_NATIVE_APP_PARAM, tracking.app);
	if (tracking.template) params.set(BUILDER_AGENT_NATIVE_TEMPLATE_PARAM, tracking.template);
}
function withBuilderConnectTrackingParams(url, options = {}) {
	const source = cleanTrackingParam(options.source);
	const flow = cleanTrackingParam(options.flow) ?? inferBuilderConnectTrackingFlow(source ?? void 0);
	const { app, template } = inferBuilderConnectTrackingIdentity(options);
	const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
	try {
		const parsed = new URL(url, origin);
		applyBuilderConnectTrackingParams(parsed.searchParams, {
			source,
			flow,
			app,
			template
		});
		const redirectUrl = parsed.searchParams.get("redirect_url");
		if (redirectUrl) {
			const parsedRedirect = new URL(redirectUrl);
			applyBuilderConnectTrackingParams(parsedRedirect.searchParams, {
				source,
				flow,
				app,
				template
			});
			parsed.searchParams.set("redirect_url", parsedRedirect.toString());
		}
		applyBuilderUtmTrackingParams(parsed.searchParams, { content: source });
		return parsed.toString();
	} catch {
		return url;
	}
}
function isAgentNativeDesktop() {
	if (typeof navigator === "undefined") return false;
	return /AgentNativeDesktop/i.test(navigator.userAgent || "");
}
function hasSignedConnectToken(url) {
	if (!url || typeof window === "undefined") return false;
	try {
		return new URL(url, window.location.origin).searchParams.has(BUILDER_CONNECT_PARAM);
	} catch {
		return false;
	}
}
function isFreshSignedConnectUrl(url, fetchedAt) {
	return hasSignedConnectToken(url) && typeof fetchedAt === "number" && Date.now() - fetchedAt < STATUS_CONNECT_URL_TTL_MS;
}
function createBuilderConnectAttemptId() {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function isCurrentConnectError(error, startedAt) {
	if (!error?.message) return false;
	if (!startedAt) return true;
	return typeof error.at !== "number" || error.at >= startedAt - 1e3;
}
function isCodeChangeConfigured(status) {
	return !!status?.privateKeyConfigured && !!status?.publicKeyConfigured;
}
function showBuilderConnectPopupPlaceholder(opened) {
	try {
		opened.document.title = "Opening Builder.io";
		opened.document.body.style.margin = "0";
		opened.document.body.style.background = "#111";
		opened.document.body.style.color = "#ddd";
		opened.document.body.style.fontFamily = "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";
		opened.document.body.style.display = "flex";
		opened.document.body.style.alignItems = "center";
		opened.document.body.style.justifyContent = "center";
		opened.document.body.style.height = "100vh";
		opened.document.body.textContent = "Opening Builder.io...";
	} catch {}
}
function navigateBuilderConnectPopup(opened, url) {
	try {
		opened.location.href = url;
		return true;
	} catch {
		try {
			opened.close();
		} catch {}
		return false;
	}
}
function waitForBuilderConnectPopupLoad(opened, shouldCancel) {
	return new Promise((resolve) => {
		let settled = false;
		let cancellationTimer = null;
		let timeoutId = null;
		const onLoad = () => finish(true);
		const finish = (ready) => {
			if (settled) return;
			settled = true;
			if (cancellationTimer !== null) clearInterval(cancellationTimer);
			if (timeoutId !== null) clearTimeout(timeoutId);
			try {
				opened.removeEventListener("load", onLoad);
			} catch {}
			resolve(ready);
		};
		try {
			if (shouldCancel()) {
				finish(false);
				return;
			}
			cancellationTimer = setInterval(() => {
				if (shouldCancel()) finish(false);
			}, POLL_INTERVAL_MS);
			timeoutId = setTimeout(() => finish(false), POPUP_LOAD_TIMEOUT_MS);
			opened.addEventListener("load", onLoad);
		} catch {
			finish(false);
		}
	});
}
function isPopupClosed(popup) {
	if (!popup) return false;
	try {
		return popup.closed === true;
	} catch {
		return false;
	}
}
function isEmbeddedWindow() {
	if (typeof window === "undefined") return false;
	try {
		return window.self !== window.top;
	} catch {
		return true;
	}
}
async function openBuilderConnectViaMcpHost(url) {
	const request = openMcpAppHostLink(url);
	if (!request) return false;
	try {
		return await request;
	} catch {
		return false;
	}
}
function notifyAgentEngineConfiguredChanged(source) {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent("agent-engine:configured-changed", { detail: { source } }));
}
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function isTrustedBuilderConnectMessageOrigin(origin) {
	if (typeof window !== "undefined" && origin === window.location.origin) return true;
	try {
		const hostname = new URL(origin).hostname.toLowerCase();
		return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "builder.io" || hostname.endsWith(".builder.io") || hostname === "builder.my" || hostname.endsWith(".builder.my") || hostname === "builderio.xyz" || hostname.endsWith(".builderio.xyz") || hostname === "builderio.dev" || hostname.endsWith(".builderio.dev") || hostname === "builder.codes" || hostname.endsWith(".builder.codes") || hostname === "agent-native.com" || hostname.endsWith(".agent-native.com");
	} catch {
		return false;
	}
}
function openBuilderConnectPopup({ url, source = "builder_connect", flow, features = "noopener,noreferrer" } = {}) {
	if (typeof window === "undefined") return null;
	const origin = getCallbackOrigin() || window.location.origin;
	const href = url ?? new URL(agentNativePath("/_agent-native/builder/connect"), origin).href;
	const trackedHref = href === "about:blank" ? href : withBuilderConnectTrackingParams(href, {
		source,
		flow
	});
	const connectUrlKind = url ? "provided" : "default";
	const trackingFlow = cleanTrackingParam(flow) ?? inferBuilderConnectTrackingFlow(source);
	trackEvent("builder connect clicked", {
		feature: "builder",
		stage: "client",
		source,
		flow: trackingFlow,
		connect_url_kind: connectUrlKind
	});
	try {
		const opened = window.open(trackedHref, "_blank", features);
		if (!opened && !/AgentNativeDesktop/i.test(navigator.userAgent || "")) trackEvent("builder connect popup blocked", {
			feature: "builder",
			stage: "client",
			source,
			flow: trackingFlow,
			connect_url_kind: connectUrlKind
		});
		return opened;
	} catch {
		trackEvent("builder connect failed", {
			feature: "builder",
			stage: "client",
			reason: "popup_open_exception",
			source,
			flow: trackingFlow,
			connect_url_kind: connectUrlKind
		});
		return null;
	}
}
function useBuilderConnectFlow(opts = {}) {
	const { enabled = true, popupUrl, provisionAccount = false, trackingSource = "builder_connect_flow", trackingFlow, onConnected } = opts;
	const [configured, setConfigured] = (0, import_react.useState)(false);
	const [codeChangeConfigured, setCodeChangeConfigured] = (0, import_react.useState)(false);
	const [envManaged, setEnvManaged] = (0, import_react.useState)(false);
	const [credentialSource, setCredentialSource] = (0, import_react.useState)(null);
	const [canDisconnect, setCanDisconnect] = (0, import_react.useState)(false);
	const [agentNativeProvisioningEnabled, setAgentNativeProvisioningEnabled] = (0, import_react.useState)(false);
	const [agentNativeProvisioningToken, setAgentNativeProvisioningToken] = (0, import_react.useState)(null);
	const [builderEnabled, setBuilderEnabled] = (0, import_react.useState)(false);
	const [orgName, setOrgName] = (0, import_react.useState)(null);
	const [connecting, setConnecting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [accountExists, setAccountExists] = (0, import_react.useState)(false);
	const [hasFetchedStatus, setHasFetchedStatus] = (0, import_react.useState)(false);
	const [statusResolved, setStatusResolved] = (0, import_react.useState)(false);
	const [statusReadSettledCount, setStatusReadSettledCount] = (0, import_react.useState)(0);
	const [statusConnectUrl, setStatusConnectUrl] = (0, import_react.useState)(null);
	const statusConnectUrlAtRef = (0, import_react.useRef)(null);
	const connectStartedAtRef = (0, import_react.useRef)(null);
	const connectAttemptIdRef = (0, import_react.useRef)(null);
	const activePopupRef = (0, import_react.useRef)(null);
	const popupClosedAtRef = (0, import_react.useRef)(null);
	const callbackSuccessStartedAtRef = (0, import_react.useRef)(null);
	const retryStatusRef = (0, import_react.useRef)(() => false);
	const statusUnavailableRef = (0, import_react.useRef)(false);
	const mountedRef = (0, import_react.useRef)(true);
	const notifiedConnectedRef = (0, import_react.useRef)(false);
	const onConnectedRef = (0, import_react.useRef)(onConnected);
	onConnectedRef.current = onConnected;
	const activeTrackingRef = (0, import_react.useRef)({
		source: trackingSource,
		flow: trackingFlow
	});
	const fetchStatus = (0, import_react.useCallback)(async (signal, connectAttemptId) => {
		if (!enabled) return null;
		const origin = getCallbackOrigin() || window.location.origin;
		const ownController = !signal && typeof AbortController !== "undefined" ? new AbortController() : null;
		const timeoutId = ownController ? setTimeout(() => ownController.abort(), STATUS_FETCH_ABORT_MS) : null;
		try {
			const statusUrl = new URL(agentNativePath("/_agent-native/connection-status/builder"), origin);
			if (connectAttemptId) statusUrl.searchParams.set(BUILDER_CONNECT_ATTEMPT_PARAM, connectAttemptId);
			const r = await fetch(statusUrl.href, { signal: signal ?? ownController?.signal });
			if (!r.ok) return null;
			return await r.json();
		} catch {
			return null;
		} finally {
			if (timeoutId) clearTimeout(timeoutId);
		}
	}, [enabled]);
	(0, import_react.useEffect)(() => {
		if (!enabled) {
			setConfigured(false);
			setCodeChangeConfigured(false);
			setEnvManaged(false);
			setCredentialSource(null);
			setCanDisconnect(false);
			setAgentNativeProvisioningEnabled(false);
			setAgentNativeProvisioningToken(null);
			setBuilderEnabled(false);
			setOrgName(null);
			setConnecting(false);
			setError(null);
			setAccountExists(false);
			setHasFetchedStatus(false);
			setStatusResolved(false);
			setStatusReadSettledCount(0);
			setStatusConnectUrl(null);
			statusConnectUrlAtRef.current = null;
			connectAttemptIdRef.current = null;
			retryStatusRef.current = () => false;
			return;
		}
		mountedRef.current = true;
		let cancelled = false;
		let refreshGeneration = 0;
		const refresh = async () => {
			const generation = ++refreshGeneration;
			const isCurrentRefresh = () => generation === refreshGeneration;
			const s = await fetchStatus();
			if (cancelled || !mountedRef.current || !isCurrentRefresh()) return;
			setHasFetchedStatus(true);
			setStatusReadSettledCount((count) => count + 1);
			if (!s) {
				statusUnavailableRef.current = true;
				setError(BUILDER_STATUS_UNAVAILABLE_MESSAGE);
				return;
			}
			if (statusUnavailableRef.current) {
				statusUnavailableRef.current = false;
				setError(null);
			}
			setStatusResolved(true);
			setConfigured(!!s.configured);
			setCodeChangeConfigured(isCodeChangeConfigured(s));
			setEnvManaged(!!s.envManaged);
			setCredentialSource(s.credentialSource ?? null);
			setCanDisconnect(!!s.canDisconnect);
			setAgentNativeProvisioningEnabled(!!s.agentNativeProvisioningEnabled);
			setAgentNativeProvisioningToken(s.agentNativeProvisioningToken ?? null);
			setAccountExists(s.connectError?.code === "account_exists");
			setBuilderEnabled(!!s.builderEnabled);
			const nextConnectUrl = s.connectUrl ?? null;
			setStatusConnectUrl(nextConnectUrl);
			statusConnectUrlAtRef.current = nextConnectUrl ? Date.now() : null;
			const org = s.orgName ?? null;
			setOrgName(org);
			if (s.configured) connectStartedAtRef.current = null;
			if (s.configured && !notifiedConnectedRef.current) {
				notifiedConnectedRef.current = true;
				notifyAgentEngineConfiguredChanged("builder-status");
				try {
					await onConnectedRef.current?.({ orgName: org });
				} catch {}
			} else if (!s.configured) notifiedConnectedRef.current = false;
			const activeConnectStartedAt = connectStartedAtRef.current;
			if (isCurrentConnectError(s.connectError, activeConnectStartedAt)) setError(s.connectError.message);
			else if (!activeConnectStartedAt && s.authError?.message) setError(s.authError.message);
			else if (s.configured) setError(null);
		};
		retryStatusRef.current = () => {
			refresh();
			return true;
		};
		let initialRefreshRan = false;
		const cancelInitialRefresh = scheduleAfterPaint(() => {
			initialRefreshRan = true;
			refresh();
		});
		const refreshNow = () => {
			if (!initialRefreshRan) {
				initialRefreshRan = true;
				cancelInitialRefresh();
			}
			refresh();
		};
		const onVisible = () => {
			if (document.visibilityState === "visible") refreshNow();
		};
		window.addEventListener("focus", refreshNow);
		document.addEventListener("visibilitychange", onVisible);
		window.addEventListener("agent-engine:configured-changed", refreshNow);
		return () => {
			cancelled = true;
			mountedRef.current = false;
			cancelInitialRefresh();
			retryStatusRef.current = () => false;
			window.removeEventListener("focus", refreshNow);
			document.removeEventListener("visibilitychange", onVisible);
			window.removeEventListener("agent-engine:configured-changed", refreshNow);
		};
	}, [enabled, fetchStatus]);
	const retry = (0, import_react.useCallback)(() => retryStatusRef.current(), []);
	const start = (0, import_react.useCallback)((startOptions) => {
		if (!enabled) return;
		const started = Date.now();
		const connectAttemptId = createBuilderConnectAttemptId();
		const clickTrackingSource = startOptions?.trackingSource ?? trackingSource;
		const clickTrackingFlow = startOptions?.trackingFlow ?? trackingFlow;
		const provisionAccountForStart = startOptions?.provisionAccount ?? provisionAccount;
		connectStartedAtRef.current = started;
		connectAttemptIdRef.current = connectAttemptId;
		callbackSuccessStartedAtRef.current = null;
		activePopupRef.current = null;
		popupClosedAtRef.current = null;
		activeTrackingRef.current = {
			source: clickTrackingSource,
			flow: clickTrackingFlow
		};
		setConnecting(true);
		setError(null);
		setAccountExists(false);
		const origin = getCallbackOrigin() || window.location.origin;
		const cachedFreshUrl = isFreshSignedConnectUrl(statusConnectUrl, statusConnectUrlAtRef.current) ? statusConnectUrl : null;
		const signedPropUrl = hasSignedConnectToken(popupUrl) ? popupUrl : null;
		const fallbackUrl = new URL(agentNativePath("/_agent-native/builder/connect"), origin).href;
		const withProvisionMode = (url, provisioningEnabled = agentNativeProvisioningEnabled, provisioningToken = agentNativeProvisioningToken) => {
			const connectUrl = new URL(url, origin);
			connectUrl.searchParams.set(BUILDER_CONNECT_ATTEMPT_PARAM, connectAttemptId);
			if (!provisionAccountForStart || !provisioningEnabled || !provisioningToken) return connectUrl.toString();
			connectUrl.searchParams.set(BUILDER_CONNECT_MODE_PARAM, BUILDER_AGENT_NATIVE_PROVISION_MODE);
			connectUrl.searchParams.set(BUILDER_PROVISIONING_TOKEN_PARAM, provisioningToken);
			return connectUrl.toString();
		};
		const directUrl = withProvisionMode(cachedFreshUrl ?? signedPropUrl ?? fallbackUrl);
		if (isAgentNativeDesktop()) {
			const opened = openBuilderConnectPopup({
				url: directUrl,
				source: clickTrackingSource,
				flow: clickTrackingFlow
			});
			if (opened) activePopupRef.current = opened;
			if (!opened) {}
		} else {
			const embeddedWindow = isEmbeddedWindow();
			const opened = openBuilderConnectPopup({
				url: embeddedWindow ? oauthPopupWaitingUrl() : "about:blank",
				source: clickTrackingSource,
				flow: clickTrackingFlow,
				features: "width=600,height=700"
			});
			if (opened) activePopupRef.current = opened;
			if (!opened) {
				if (!embeddedWindow) {
					connectStartedAtRef.current = null;
					setConnecting(false);
					setError("Couldn't open Builder. Allow popups and try again.");
					return;
				}
				(async () => {
					const s = await fetchStatus(void 0, connectAttemptId);
					if (!mountedRef.current) return;
					if (s) {
						setHasFetchedStatus(true);
						setStatusResolved(true);
						setConfigured(!!s.configured);
						setCodeChangeConfigured(isCodeChangeConfigured(s));
						setEnvManaged(!!s.envManaged);
						setCredentialSource(s.credentialSource ?? null);
						setCanDisconnect(!!s.canDisconnect);
						setAgentNativeProvisioningEnabled(!!s.agentNativeProvisioningEnabled);
						setAgentNativeProvisioningToken(s.agentNativeProvisioningToken ?? null);
						setAccountExists(s.connectError?.code === "account_exists");
						setBuilderEnabled(!!s.builderEnabled);
						const nextConnectUrl = s.connectUrl ?? null;
						setStatusConnectUrl(nextConnectUrl);
						statusConnectUrlAtRef.current = nextConnectUrl ? Date.now() : null;
						setOrgName(s.orgName ?? null);
					}
					const openedByHost = await openBuilderConnectViaMcpHost(withBuilderConnectTrackingParams(withProvisionMode(s?.connectUrl ?? cachedFreshUrl ?? directUrl, !!s?.agentNativeProvisioningEnabled, s?.agentNativeProvisioningToken ?? null), {
						source: clickTrackingSource,
						flow: clickTrackingFlow
					}));
					if (!mountedRef.current || openedByHost) return;
					connectStartedAtRef.current = null;
					setConnecting(false);
					setError("Couldn't open Builder from this chat host. Open this app in a browser tab and try Connect Builder (free tier available) again.");
				})();
			} else {
				const isCurrentConnectAttempt = () => mountedRef.current && connectAttemptIdRef.current === connectAttemptId && connectStartedAtRef.current === started;
				const popupReady = embeddedWindow ? waitForBuilderConnectPopupLoad(opened, () => !isCurrentConnectAttempt() || isPopupClosed(opened)) : Promise.resolve(true);
				showBuilderConnectPopupPlaceholder(opened);
				(async () => {
					const s = await fetchStatus(void 0, connectAttemptId);
					if (!isCurrentConnectAttempt()) {
						try {
							opened.close();
						} catch {}
						return;
					}
					if (s) {
						setHasFetchedStatus(true);
						setStatusResolved(true);
						setConfigured(!!s.configured);
						setCodeChangeConfigured(isCodeChangeConfigured(s));
						setEnvManaged(!!s.envManaged);
						setCredentialSource(s.credentialSource ?? null);
						setCanDisconnect(!!s.canDisconnect);
						setAgentNativeProvisioningEnabled(!!s.agentNativeProvisioningEnabled);
						setAgentNativeProvisioningToken(s.agentNativeProvisioningToken ?? null);
						setAccountExists(s.connectError?.code === "account_exists");
						setBuilderEnabled(!!s.builderEnabled);
						const nextConnectUrl = s.connectUrl ?? null;
						setStatusConnectUrl(nextConnectUrl);
						statusConnectUrlAtRef.current = nextConnectUrl ? Date.now() : null;
						setOrgName(s.orgName ?? null);
					}
					const freshUrl = withProvisionMode(s?.connectUrl ?? cachedFreshUrl ?? signedPropUrl ?? fallbackUrl, !!s?.agentNativeProvisioningEnabled, s?.agentNativeProvisioningToken ?? null);
					if (!freshUrl) {
						try {
							opened.close();
						} catch {}
						connectStartedAtRef.current = null;
						setConnecting(false);
						setError("Couldn't start Builder connect. Refresh this page and try again.");
						return;
					}
					const popupLoaded = await popupReady;
					if (!isCurrentConnectAttempt()) {
						try {
							opened.close();
						} catch {}
						return;
					}
					if (!popupLoaded) {
						try {
							opened.close();
						} catch {}
						connectStartedAtRef.current = null;
						setConnecting(false);
						setError("Couldn't navigate the Builder popup. Allow popups and try again.");
						return;
					}
					const trackedFreshUrl = withBuilderConnectTrackingParams(freshUrl, {
						source: clickTrackingSource,
						flow: clickTrackingFlow
					});
					if (!navigateBuilderConnectPopup(opened, trackedFreshUrl)) {
						connectStartedAtRef.current = null;
						setConnecting(false);
						setError("Couldn't navigate the Builder popup. Allow popups and try again.");
					}
				})();
			}
		}
	}, [
		enabled,
		fetchStatus,
		agentNativeProvisioningEnabled,
		agentNativeProvisioningToken,
		provisionAccount,
		popupUrl,
		statusConnectUrl,
		trackingFlow,
		trackingSource
	]);
	usePollLoop(async (signal) => {
		const started = connectStartedAtRef.current;
		if (started == null) return;
		const s = await fetchStatus(signal, connectAttemptIdRef.current ?? void 0);
		if (!mountedRef.current) return;
		if (s) setStatusResolved(true);
		if (s?.configured) {
			setConfigured(true);
			setCodeChangeConfigured(isCodeChangeConfigured(s));
			setEnvManaged(!!s.envManaged);
			setCredentialSource(s.credentialSource ?? null);
			setCanDisconnect(!!s.canDisconnect);
			setAgentNativeProvisioningEnabled(!!s.agentNativeProvisioningEnabled);
			setAgentNativeProvisioningToken(s.agentNativeProvisioningToken ?? null);
			setAccountExists(false);
			setBuilderEnabled(!!s.builderEnabled);
			const nextConnectUrl = s.connectUrl ?? null;
			setStatusConnectUrl(nextConnectUrl);
			statusConnectUrlAtRef.current = nextConnectUrl ? Date.now() : null;
			const org = s.orgName ?? null;
			setOrgName(org);
			setConnecting(false);
			connectStartedAtRef.current = null;
			notifiedConnectedRef.current = true;
			notifyAgentEngineConfiguredChanged("builder-connect");
			try {
				await onConnectedRef.current?.({ orgName: org });
			} catch {}
		} else if (isCurrentConnectError(s?.connectError, started)) {
			connectStartedAtRef.current = null;
			setConnecting(false);
			setAccountExists(s.connectError.code === "account_exists");
			setError(s.connectError.code === "account_exists" ? null : `Couldn't save Builder credentials: ${s.connectError.message}. Try again or contact support.`);
		} else if (isPopupClosed(activePopupRef.current) && callbackSuccessStartedAtRef.current !== started) {
			popupClosedAtRef.current ??= Date.now();
			if (Date.now() - popupClosedAtRef.current > POPUP_CLOSED_CONFIRMATION_GRACE_MS) {
				connectStartedAtRef.current = null;
				setConnecting(false);
				const { source, flow } = activeTrackingRef.current;
				trackEvent("builder connect failed", {
					feature: "builder",
					stage: "client",
					reason: "popup_closed_without_status",
					source,
					flow: cleanTrackingParam(flow) ?? inferBuilderConnectTrackingFlow(source)
				});
				setError("Didn't finish connecting to Builder.io. Try again, or use your own keys.");
			}
		} else if (Date.now() - started > POLL_TIMEOUT_MS) {
			connectStartedAtRef.current = null;
			setConnecting(false);
			const { source, flow } = activeTrackingRef.current;
			trackEvent("builder connect failed", {
				feature: "builder",
				stage: "client",
				reason: "timeout",
				source,
				flow: cleanTrackingParam(flow) ?? inferBuilderConnectTrackingFlow(source)
			});
			setError("Didn't hear back from Builder in 5 minutes. Allow popups and try again.");
		}
	}, {
		intervalMs: POLL_INTERVAL_MS,
		leading: false,
		enabled: enabled && connecting
	});
	(0, import_react.useEffect)(() => {
		let channel = null;
		const isCurrentConnectAttempt = (attemptId) => typeof attemptId === "string" && attemptId === connectAttemptIdRef.current && connectStartedAtRef.current !== null;
		const handleError = (message, code, attemptId) => {
			if (!isCurrentConnectAttempt(attemptId)) return;
			connectStartedAtRef.current = null;
			setConnecting(false);
			setAccountExists(code === "account_exists");
			setError(code === "account_exists" ? null : `Couldn't save Builder credentials: ${message}.`);
		};
		const handleSuccess = async (attemptId) => {
			if (!isCurrentConnectAttempt(attemptId)) return;
			const started = connectStartedAtRef.current;
			if (started == null || callbackSuccessStartedAtRef.current === started) return;
			callbackSuccessStartedAtRef.current = started;
			let s = null;
			for (let i = 0; i < CALLBACK_SUCCESS_STATUS_RETRIES; i += 1) {
				s = await fetchStatus(void 0, connectAttemptIdRef.current ?? void 0);
				if (!mountedRef.current || connectStartedAtRef.current !== started) return;
				if (s?.configured || isCurrentConnectError(s?.connectError, started)) break;
				if (i < CALLBACK_SUCCESS_STATUS_RETRIES - 1) await delay(CALLBACK_SUCCESS_STATUS_RETRY_MS);
			}
			if (!mountedRef.current || connectStartedAtRef.current !== started) return;
			if (!s) return;
			if (!s.configured) {
				const connectError = isCurrentConnectError(s?.connectError, started) ? s?.connectError : null;
				setHasFetchedStatus(true);
				if (s) {
					setStatusResolved(true);
					setConfigured(false);
					setCodeChangeConfigured(false);
					setEnvManaged(!!s.envManaged);
					setCredentialSource(s.credentialSource ?? null);
					setCanDisconnect(!!s.canDisconnect);
					setAgentNativeProvisioningEnabled(!!s.agentNativeProvisioningEnabled);
					setAgentNativeProvisioningToken(s.agentNativeProvisioningToken ?? null);
					setAccountExists(s.connectError?.code === "account_exists");
					setBuilderEnabled(!!s.builderEnabled);
					const nextConnectUrl = s.connectUrl ?? null;
					setStatusConnectUrl(nextConnectUrl);
					statusConnectUrlAtRef.current = nextConnectUrl ? Date.now() : null;
					setOrgName(s.orgName ?? null);
				}
				if (connectError) {
					connectStartedAtRef.current = null;
					setConnecting(false);
					setAccountExists(connectError.code === "account_exists");
					setError(connectError.code === "account_exists" ? null : `Couldn't save Builder credentials: ${connectError.message}. Try again or contact support.`);
				}
				return;
			}
			setHasFetchedStatus(true);
			setStatusResolved(true);
			setConfigured(true);
			setCodeChangeConfigured(isCodeChangeConfigured(s));
			setEnvManaged(!!s.envManaged);
			setCredentialSource(s.credentialSource ?? null);
			setCanDisconnect(!!s.canDisconnect);
			setAgentNativeProvisioningEnabled(!!s.agentNativeProvisioningEnabled);
			setAgentNativeProvisioningToken(s.agentNativeProvisioningToken ?? null);
			setAccountExists(false);
			setBuilderEnabled(!!s.builderEnabled);
			const nextConnectUrl = s.connectUrl ?? null;
			setStatusConnectUrl(nextConnectUrl);
			statusConnectUrlAtRef.current = nextConnectUrl ? Date.now() : null;
			const org = s.orgName ?? null;
			setOrgName(org);
			setConnecting(false);
			connectStartedAtRef.current = null;
			notifiedConnectedRef.current = true;
			notifyAgentEngineConfiguredChanged("builder-connect-message");
			try {
				await onConnectedRef.current?.({ orgName: org });
			} catch {}
		};
		try {
			channel = new BroadcastChannel(`builder-connect:${window.location.host}`);
			channel.onmessage = (e) => {
				const data = e.data;
				if (data?.type === "builder-connect-success") {
					handleSuccess(data.attemptId);
					return;
				}
				if (data?.type === "builder-connect-error") {
					if (typeof data.message !== "string" || !data.message) return;
					handleError(data.message, data.code, data.attemptId);
				}
			};
		} catch {}
		const handler = (e) => {
			if (!isTrustedBuilderConnectMessageOrigin(e.origin)) return;
			const data = e.data;
			if (data?.type === "builder-connect-success") {
				handleSuccess(data.attemptId);
				return;
			}
			if (data?.type === "builder-connect-error") {
				if (typeof data.message !== "string" || !data.message) return;
				handleError(data.message, data.code, data.attemptId);
			}
		};
		window.addEventListener("message", handler);
		return () => {
			channel?.close();
			window.removeEventListener("message", handler);
		};
	}, [fetchStatus]);
	return {
		configured,
		codeChangeConfigured,
		statusResolved,
		statusReadSettledCount,
		envManaged,
		credentialSource,
		canDisconnect,
		agentNativeProvisioningEnabled,
		builderEnabled,
		orgName,
		connecting,
		error,
		accountExists,
		hasFetchedStatus,
		start,
		retry
	};
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/mcp-integration-config.js
function cleanIds(value) {
	if (!Array.isArray(value)) return [];
	const ids = /* @__PURE__ */ new Set();
	for (const item of value) {
		if (typeof item !== "string") continue;
		const id = item.trim().toLowerCase();
		if (id) ids.add(id);
	}
	return [...ids];
}
function normalizeMcpIntegrationsConfig(input = true) {
	if (input === false || input && typeof input === "object" && input.enabled === false) return {
		enabled: false,
		custom: false,
		defaults: {
			enabled: false,
			exclude: []
		}
	};
	if (input === true || input === void 0) return {
		enabled: true,
		custom: true,
		defaults: {
			enabled: true,
			exclude: []
		}
	};
	const defaults = input.defaults;
	const custom = input.custom !== false;
	const defaultsEnabled = defaults && typeof defaults === "object" ? defaults.enabled !== false : defaults !== false;
	if (!defaultsEnabled) return {
		enabled: custom,
		custom,
		defaults: {
			enabled: false,
			exclude: []
		}
	};
	const include = defaults && typeof defaults === "object" ? cleanIds(defaults.include) : [];
	const exclude = defaults && typeof defaults === "object" ? cleanIds(defaults.exclude) : [];
	return {
		enabled: true,
		custom,
		defaults: {
			enabled: defaultsEnabled,
			...include.length > 0 ? { include } : {},
			exclude
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/mcp-provider-hosts.js
/**
* Provider host matching shared by the client integration catalog and the
* server-side connected-provider lookup.
*
* This lives outside `client/resources/mcp-integration-catalog.ts` because that
* module imports the inlined base64 logo table; pulling it into a server path
* would put megabytes of icon data in the deployed bundle.
*/
var MCP_LINK_HOSTS = {
	amplitude: ["amplitude.com"],
	apollo: ["apollo.io"],
	"common-room": ["commonroom.io"],
	context7: ["context7.com"],
	exa: ["exa.ai"],
	sentry: ["sentry.io", "sentry.dev"],
	gong: ["gong.io"],
	grafana: ["grafana.com", "grafana.net"],
	"builder-cms": ["builder.io"],
	sigma: ["sigmacomputing.com"],
	notion: [
		"notion.com",
		"notion.so",
		"notion.site"
	],
	granola: ["granola.ai"],
	semgrep: ["semgrep.dev", "semgrep.com"],
	canva: ["canva.com", "canva.ai"],
	figma: ["figma.com"],
	linear: ["linear.app"],
	atlassian: [
		"atlassian.com",
		"atlassian.net",
		"jira.com",
		"confluence.com"
	],
	supabase: ["supabase.com"],
	neon: ["neon.tech"],
	stripe: ["stripe.com"],
	cloudflare: ["cloudflare.com"],
	github: ["github.com", "github.dev"],
	gitlab: ["gitlab.com"],
	slack: ["slack.com"],
	asana: ["asana.com"],
	hubspot: ["hubspot.com"],
	intercom: ["intercom.com"],
	pylon: ["usepylon.com", "pylon.com"],
	monday: ["monday.com"],
	webflow: ["webflow.com"],
	paypal: ["paypal.com"],
	box: ["box.com"],
	netlify: ["netlify.com"],
	vercel: ["vercel.com"],
	zapier: ["zapier.com"]
};
function hostMatches(hostname, domain) {
	return hostname === domain || hostname.endsWith(`.${domain}`);
}
function normalizeMcpUrl(value) {
	try {
		const url = new URL(value.trim());
		url.hash = "";
		return url.toString().replace(/\/+$/, "");
	} catch {
		return value.trim().replace(/\/+$/, "");
	}
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/shared/merge-by-id.js
function mergeDefinitionsById(defaults, overrides = []) {
	const merged = new Map(defaults.map((definition) => [definition.id, definition]));
	for (const override of overrides) merged.set(override.id, override);
	return [...merged.values()];
}
var MCP_OAUTH_FLOW_TTL_MS = 600 * 1e3;
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/resources/mcp-connection-refresh.js
/**
* Tracks the window between starting an MCP OAuth authorization and observing
* its result, so the shared `["mcp-servers"]` list can be revalidated when the
* user comes back.
*
* The OAuth callback redirects the *popup* to the app return URL and never
* touches the opener, so without this marker the opener keeps rendering the
* pre-authorization list forever: every consumer of `useMcpServers()` shows
* "Connect" for an integration that is already connected. React Query's
* `refetchOnWindowFocus` is deliberately off across this repo, so the refresh
* has to be bounded and explicit rather than global.
*
* The in-memory marker is authoritative for this tab; sessionStorage only
* extends it across a reload. A storage failure therefore degrades the window
* to memory-only, which is never worse than not having the marker at all.
*/
var PENDING_STORAGE_KEY = "agent-native:mcp-connection-pending";
/** Exactly as long as the server will still accept the authorization. Anything
*  shorter leaves a stretch where a consent succeeds but this window has
*  stopped revalidating; anything longer only refetches for a flow the server
*  has already rejected. */
var PENDING_TTL_MS = MCP_OAUTH_FLOW_TTL_MS;
var memoryPendingStartedAt = null;
function readStoredStartedAt() {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.sessionStorage.getItem(PENDING_STORAGE_KEY);
		if (raw === null) return null;
		const parsed = Number(raw);
		return Number.isFinite(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function writeStoredStartedAt(startedAt) {
	if (typeof window === "undefined") return;
	try {
		if (startedAt === null) {
			window.sessionStorage.removeItem(PENDING_STORAGE_KEY);
			return;
		}
		window.sessionStorage.setItem(PENDING_STORAGE_KEY, String(startedAt));
	} catch {
		return;
	}
}
function markMcpConnectionPending(now = Date.now()) {
	memoryPendingStartedAt = now;
	writeStoredStartedAt(now);
}
function clearMcpConnectionPending() {
	memoryPendingStartedAt = null;
	writeStoredStartedAt(null);
}
/**
* True while an authorization started recently enough that its result may not
* be reflected in the cached server list yet. Expired markers are cleared so a
* stale tab stops refetching on focus.
*/
function hasPendingMcpConnection(now = Date.now()) {
	const startedAt = memoryPendingStartedAt ?? readStoredStartedAt();
	if (startedAt === null) return false;
	if (now - startedAt > PENDING_TTL_MS) {
		clearMcpConnectionPending();
		return false;
	}
	return true;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/resources/mcp-integration-logos.js
var LOGOS = {
	context7: {
		mime: "image/vnd.microsoft.icon",
		data: "iVBORw0KGgoAAAANSUhEUgAAAEoAAABLCAYAAADXjBHUAAAACXBIWXMAAAsTAAALEwEAmpwYAAABaWlDQ1BEaXNwbGF5IFAzAAB4nHWQvUvDUBTFT6tS0DqIDh0cMolD1NIKdnFoKxRFMFQFq1OafgltfCQpUnETVyn4H1jBWXCwiFRwcXAQRAcR3Zw6KbhoeN6XVNoi3sfl/Ticc7lcwBtQGSv2AijplpFMxKS11Lrke4OHnlOqZrKooiwK/v276/PR9d5PiFlNu3YQ2U9cl84ul3aeAlN//V3Vn8maGv3f1EGNGRbgkYmVbYsJ3iUeMWgp4qrgvMvHgtMunzuelWSc+JZY0gpqhrhJLKc79HwHl4plrbWD2N6f1VeXxRzqUcxhEyYYilBRgQQF4X/8044/ji1yV2BQLo8CLMpESRETssTz0KFhEjJxCEHqkLhz634PrfvJbW3vFZhtcM4v2tpCAzidoZPV29p4BBgaAG7qTDVUR+qh9uZywPsJMJgChu8os2HmwiF3e38M6Hvh/GMM8B0CdpXzryPO7RqFn4Er/QcXKWq8MSlPPgAABA5JREFUeAHtmzFME2EUgB+GQXCgGCSBpeiICRjERROKoYtG4kANC6kDasLCAgNLO+BcBxgYxIHiZhkgRJcahcgmJB1k1HaBBBLtomHTezXVu/+u9N3de03Q9yUM/cPlb7/+79279/9tap4bfwdKXZqtv2FQ6nIOFBIqioiKIqKiiKgoIiqKiIoioqKIqCgiKoqIiiKioog0Q0hil3th+cEU+GX78z5M5pZ8XZObmIX+7ij4JbGagcJhEcIQWhTS034J/FIKcE2kpTXQXHhdWDT0iKgoIqFDr3BYguK3Y0dIlKzXK7tbp16H/+OX7N4WbFm57TSS12Ou9xJkLpPQoson3+GRlZTzj9N/xqLWGy2f/IDFndfASbaO/NRIwpXDxl5mKl9kWFhCD7/lmc2sY+zZvSTErvRCo+jv7oF0POEYe/o2B4WDInDAlqMWrNVjhsWLxBREzl8AaXCO3MSMY2x9/yPM53PABWsyx7oIQ64KhmAqPgbS4BxmyM1urgAnrKIwaS58cOal6Vt3ob+rB6TALwPnsIMhx5GX7LCXB4s7bxyrCslY+UqK9EjCNVYv6QeBXRTeBbO77x1jmNQlVhWuJiwH7KAk7tWEiBScG1YiNUkODAE3nqtpj381ISKiCgclV/glB4eBmyGP8qNeQRoUEVEYfqWvR46xyPlW1roKuxbmnU5KEiL2rIePNiZ9jHmqzyowTUoCuamKmCivhHqty38vqRa4oihzciEmqlR2v+kgTbdaePWYzuSK8oLzcSYaoIEXhoaKamvhExVpkX+GtNPUPDf+E5S6aIeTiIoioqKIqCgiKooIywaoF1jneFXPXE/3yYGYa2z7y75YdS4mCh+AsWduBytnLlGpuHvHZfLVkiXqDLVZ/kXERLV5PK5whgX2vFxzClbrYqJ62jtcY1x7bEipfOSeM9IBUoiJikY6XWOYbLnw6ndFL3aCFGKivFoqXh8uKBuf3H15zn6XiYgoLA282rScOQrbzWbrtzJvRKb9IiLKqzcusde27rHbM3r1BkggImr65h3Ha876yc6qJd/c7bnfOwgSsIvCarzfaPxzHpawg+FnbuHjapY4RcMuytw+l1pNVXAL38x9KY+N0bCwisLt7UatpirVg2x2cEV5PQuGgU1U5YiP8U3iiTvJ1VQF737m6b7M6MNAJ4hrwSZqbWLGdXZyPr8GjQLnsocg7kwvJ/yff68FiyhcSfaQQ0nx5/OVsGgUONfvOf/eBTEEuY4chd6Fwbtc/kna93UYLvjB/IAHaoPc0QYX5kL/cuG/aLPoLxcaiIoiEroVXCwfB6qVpH65wDWXiW6pE9HQI6KiiKgoIiqKiIoioqKIqCgiKoqIiiKiooioKCIqiojVPWi6DUpdfgE8wFukKedIwQAAAABJRU5ErkJggg=="
	},
	semgrep: {
		mime: "image/x-icon",
		data: "AAABAAMAMDAAAAEAIACoJQAANgAAACAgAAABACAAqBAAAN4lAAAQEAAAAQAgAGgEAACGNgAAKAAAADAAAABgAAAAAQAgAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhANIS4QOCEuEHIhLhCoIS4Q0SEuEOshLhD6IS4Q/yEuEP8hLhD7IS4Q7CEuENIhLhCpIS4QcyEuEDohLhAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhACIS4QKSEuEHUhLhC/IS4Q6yEuEP0hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/SEuEOwhLhDAIS4QdyEuECohLhADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QASEuEC8hLhCTIS4Q5CEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEOUhLhCVIS4QMSEuEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhAWIS4QfyEuEOUhLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q5iEuEIIhLhAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEuEDwhLhDCIS4Q/iEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP4hLhDEIS4QPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhAEIS4QYCEuEOUhLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q5yEuEGQhLhAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEuEAUhLhB0IS4Q8iEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEPMhLhB4IS4QBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QAyEuEHQhLhD2IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD3IS4QeCEuEAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QYCEuEPIhLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q8yEuEGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhA8IS4Q5CEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEOYhLhBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEuEBYhLhDAIS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhDEIS4QGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEuEH0hLhD+IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4QggAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QLiEuEOIhLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q5SEuEDEAAAAAAAAAAAAAAAAhLhABIS4QkCEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEu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EP8hLhD/IS4Q/yEuEP8hLhD/IC4Q/x8sEP8fKxD/HysQ/x8rEP8fKxD/HywQ/yAuEP8hLhD/IS4Q/yEuEP8hLhD/IC0Q/x8sEP8fKxD/HywQ/x8rEP8fKxD/IC0Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhB1AAAAAAAAAAAhLhAmIS4Q4CEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEOMhLhApAAAAAAAAAAAAAAAAIS4QjiEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEJMhLhABAAAAAAAAAAAAAAAAIS4QLCEuEOEhLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q4yEuEDAAAAAAAAAAAAAAAAAAAAAAAAAAACEuEHohLhD+IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4QfwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEuEBUhLhC9IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhDBIS4QFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhA5IS4Q4iEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEOQhLhA9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QXCEuEPEhLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q8iEuEGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QAyEuEHAhLhD0IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD2IS4QdCEuEAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEuEAUhLhBwIS4Q8SEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEPIhLhB0IS4QBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhADIS4QXCEuEOIhLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q5CEuEF8hLhAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEuEDkhLhC+IS4Q/SEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP0hLhDBIS4QOwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhAUIS4QeiEuEOIhLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q4yEuEH0hLhAWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QASEuECshLhCOIS4Q4SEuEP4hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/iEuEOIhLhCRIS4QLSEuEAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhACIS4QJSEuEHAhLhC7IS4Q6SEuEPwhLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/SEuEOohLhC8IS4QciEuECchLhACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhALIS4QNCEuEGwhLhCiIS4QyyEuEOchLhD3IS4Q/iEuEP4hLhD3IS4Q5yEuEMwhLhCjIS4QbSEuEDUhLhAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//4Af//wAA//8AAP//AAD/+AAAH/8AAP/wAAAH/wAA/8AAAAP/AAD/gAAAAf8AAP8AAAAA/wAA/gAAAAB/AAD8AAAAAD8AAPgAAAAAHwAA8AAAAAAPAADwAAAAAAcAAOAAAAAABwAAwAAAAAADAADAAAAAAAMAAMAAAAAAAwAAgAAAAAABAACAAAAAAAEAAIAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAEAAIAAAAAAAQAAgAAAAAABAADAAAAAAAMAAMAAAAAAAwAAwAAAAAADAADgAAAAAAcAAPAAAAAADwAA8AAAAAAPAAD4AAAAAB8AAPwAAAAAPwAA/gAAAAB/AAD/AAAAAP8AAP+AAAAB/wAA/8AAAAP/AAD/8AAAD/8AAP/4AAAf/wAA//8AAP//AAD//+AH//8AACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhAEIS4QKiEuEG4hLhCvIS4Q3CEuEPUhLhD/IS4Q/yEuEPUhLhDdIS4QsCEuEG8hLhArIS4QBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhADIS4QOCEuEJkhLhDhIS4Q/CEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/CEuEOEhLhCaIS4QOSEuEAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QGiEuEIshLhDrIS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhDsIS4QjSEuEBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEuEDYhLhDEIS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4QxiEuEDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhLhBCIS4Q2iEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q3CEuEEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QNyEuENohLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q3CEuEDkAAAAAAAAAAAAAAAAAAAAAAAAAACEuEBohLhDDIS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4QxSEuEBwAAAAAAAAAAAAAAAAhLhACIS4QiiEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4QjSEuEAIAAAAAAAAAACEuEDchLhDqIS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEu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EP8hLhD/IC0Q/yAtEP8gLRD/IC0Q/yEuEP8hLhD/IS4Q/yEuEP8gLRD/IC0Q/yAtEP8gLRD/IS4Q/yEuEP8hLhD/IS4Q/yEuEJkhLhACAAAAACEuEDYhLhDpIS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhDqIS4QOQAAAAAAAAAAIS4QASEuEIghLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEIshLhACAAAAAAAAAAAAAAAAIS4QGSEuEMEhLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhDDIS4QGwAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QNSEuENghLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q2iEuEDcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QQCEuENkhLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuENohLhBCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QNCEuEMIhLhD+IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhD/IS4Q/yEuEP8hLhDDIS4QNgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIS4QGSEuEIghLhDqIS4Q/yEuEP8hLhD/IS4Q/yEu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"
	},
	slack: {
		mime: "image/vnd.microsoft.icon",
		data: "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RakAAAAAAAAAAHesK7B2rCv/dqwr/3asK/92rCv/d60r7ICzTQoAAAAAdq0sxHasK/92rCv/dqwr/3asK/92rCv/dqwtbOC/RL/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/4L5F/ObMTQr///8Bdq0r/nasK/92rCv/dqwr/3asK/92rCv/fLEuJwAAAAB2rSzEdqwr/3asK/92rCv/dqwr/3asK/93rSvJ4L9Fy9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/5MlRE4CAgAJ2rCv/dqwr/3asK/92rCv/dqwr/3asK/94rTA1AAAAAHesK7B2rCv/dqwr/3asK/92rCv/dqwr/3esK9XgwEWF375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/+C+RcwAAAAAgICAAnasK/92rCv/dqwr/3asK/92rCv/dqwr/3itMDUAAAAAd6wsaXasK/92rCv/dqwr/3asK/92rCv/d6wrjuPGVQngv0S+375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fv0Xi4r9GLAAAAACAgIACdqwr/3asK/92rCv/dqwr/3asK/92rCv/eK0wNQAAAACA/4ACd6wsqXasK/92rCv/dqwr/3atLMSAv0AMAAAAAP///wHhvkVD38BGceG+RXbhvkV24b5FduG+RXbhvkV24b5FduG+RXbhvkV24L5HU+vETg0AAAAAAAAAAICAgAJ2rCv/dqwr/3asK/92rCv/dqwr/3asK/94rTA1AAAAAAAAAAAAAAAAea0rO3esLGl2rixFgP+AAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICAAnasK/92rCv/dqwr/3asK/92rCv/dqwr/3itMDUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+/gATgvkVy379FuuC+RM3gvkTN4L5EzeK/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K/92rCv/dqwr/3asK/92rCv/dqwr/3evLFwAAAAAAAAAAHmuLyZ2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK+eAuDkS4MBGdd++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/+G/Rl8AAAAAAAAAAHutLT52rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3atK+UAAAAAAAAAAHmuLyZ2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/93rS2D4L9ErN++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/+C+RJYAAAAAAAAAAHeuLl52rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/+An0AIAAAAAHmuLyZ2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/93rSy64L9Evt++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9+/RKgAAAAAAAAAAHitLHN2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/+ArzAQAAAAAHm2MRV2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/93rSzM4L9FjN++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/+G+RXYAAAAAAAAAAHitLHN2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/94tC0RAAAAAAAAAAB2rSzidqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/93rCua379FMOC/RPvfvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/4L5F9ODBRiEAAAAAAAAAAHitLHN2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/94tC0RAAAAAAAAAAB4rSuCdqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3esK/15rSs7AAAAAN+/RHjfvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/gv0T+4L9FZAAAAAAAAAAAAAAAAHitLHN2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/94tC0RAAAAAAAAAACZzDMFd60ryXasK/92rCv/dqwr/3asK/92rCv/dqwr/3itLIYAAAAAAAAAAAAAAADhv0ZM4L9F1+C/RP7fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/4L5F/eC/Rc/jvkU/AAAAAAAAAAAAAAAAAAAAAHitLHN2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/94tC0RAAAAAAAAAAAAAAAAgNVVBnitLIZ2rSvrdqwr/3asK/93rCvbd68sVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO7MRA/gwUkx4MJHMuDCRzLgwkcy4MJHMuDCRzLgwkcy4MJHMuDCRzLgwkcy4MJHMuDCRzLfv0Uw6r9VDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHitLHN2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/94tC0RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAd7MzHni0LREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHitLHN2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/94tC0RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wHixUkj4r9FNOK/RTTiv0U04r9FNOHERysAAAAAAAAAAHitLHN2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/94tC0RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADmzE0K379FkOC/RO/fvkT/375E/9++RP/fvkT/375E/9+/RNIAAAAAAAAAAHitLHN2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/94tC0RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOPGVQngv0XT375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9+/RNIAAAAAAAAAAHitLHN2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/94tC0RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOG/Ro/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9+/RNIAAAAAAAAAAHitLHN2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/94tC0RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOC/Re7fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9+/RNIAAAAAAAAAAHitLHN2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/94tC0RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA379IIN++RP/fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/9++RNEAAAAAAAAAAHmsLXJ2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/+ArzAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7sxED+C/RP7fvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/+C/Ra4AAAAAAAAAAHiuLVt2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3asK/+A1VUGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOC/RdffvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/375E/+G+RXYAAAAAAAAAAHmuLTl2rCv/dqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3atLNwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOG/RkzfvkT/375E/9++RP/fvkT/375E/9++RP/fvkT/4L9F3+q/VQwAAAAAAAAAAID/gAJ3rSzKdqwr/3asK/92rCv/dqwr/3asK/92rCv/dqwr/3etLEsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADfv0R4379E+t++RP/fvkT/375E/9++RP/gv0Xf4r9FNAAAAAAAAAAAAAAAAAAAAAB4rzAgd60sx3asK/92rCv/dqwr/3asK/92rCz2d60sbQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA379FMOC/RYzgv0S+4L9ErODARnXqv1UMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgP+AAnuxMTR4ri1VeK4sYnirL0aAuToWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8f+P//AAD//AfgP/8AAP/8A8A//wAA//gDwB//AAD/+APAH/8AAP/4AcAf/wAA//gBwB//AAD/+AHAH/8AAP/4AcA//wAA//gBwH//AAD/+AH///8AAP/4Af///wAA//gB////AADg+AHwAAcAAIB4AeAAAwAAgDgBwAABAACAOAGAAAAAAIA4AYAAAAAAgDgDgAAAAACAOAPAAAEAAIA8A8AAAQAAwD4H4AADAAD////4AA8AAP///////wAA////////AADwAB/4/A8AAMAAB+A8AwAAgAADwDwBAACAAAPAHAAAAAAAAcAcAAAAAAABwBwAAAAAAAPAHAAAAIAAA8AcAQAAwAAHwB4BAADgAA/AHwcAAP///8Af/wAA////wB//AAD////AH/8AAP/+AcAf/wAA//wBwB//AAD/+AHAH/8AAP/4AcAf/wAA//gBwB//AAD/+AHAH/8AAP/4A8Af/wAA//wDwD//AAD//gfgf/8AAP//H////wAAiVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAgAElEQVR4nO3deZhU9Z0u8Pc9VU13Aw2CO7ImyhJ2MBHiBgRBUGRpWhO3JDN3zNU4c51MAi5EO2oUNTM3cR5nbpxMxiVxa7tBcAMUEAEhyiKLCJgAgoAgojTQdHfVee8fNAht03RXnVO/qurv53l4Hno5v99b29tVp079DmCMabLoOkC2G7lwS0+/WkMA9hLUjUBnCa0IFQCAwHIS+wRsJrge0Bovh/NnXdRprePooRj16qO52+Ofnhap1KnxCPMU83M9KAKoKh5lpSeW5wJ7Ro9/YG8x6bvOm+2sAEIw4q3N35WvGyWMA3BmgsN8SmI6PT41+9LOi4PMl0oDZxY3r4xVXClf34M4DNC5DdqQqCSwhOJc5URfXTP21++FHLVJsgII0Ij5W8bI14OCegY5LsG19HjH7CGdZgY5bpj6lN45IC7/nwAVAmqZ7HgkPyT5RKtIm/9YNHZyeRAZjRVAIIbP2zQIwMMQLg51IuJtAJPeGNplSajzJKHPjCld4tXV9wP6ART8/YvgbkL3Nuv8zd8vO/8n1UGP39RYASThqiWfnnmwouIxSIUpnZgs9Zrl3TL7wrN2pXTeegycWXxaZXXFFPm4GVCzsOcj8Vd4vHP1uKklJBX2fNnKCiBBl83b1A/ADAkdHEX4mMTYOUO7rHQ0/1E9S+8cCsRLIJ2a6rlJvNoiv/kPlo4u3pfqubOB5zpAJho5d3MhxEUOH/wA0BHiopFzN6f22UctvV6cfDMRn+3iwQ8AEkYfqKhYMuCl2xu2c9Ecx54BNNJlc7fcLaoYUnpcd6QoFs8Z1uneVE47ZF5x9LPPD/5Owi2pnLcen0ci0atXjX/gTddBMok9A2iEy+Zu/png/yptHvwAIFHwf3XZ3M0/S9WURXohsntPxYw0evADQFvfj7/ep3TSRNdBMokVQAONmL95FIBHXOeox8Mj5226PBUTrStb9n8BjUrFXI0hKeqDT/YpvXOA6yyZIn3+kqWxEfM2dfeFJQBau85yEl96xKDZQ7t8GNYEvcsm/4Pv6/Gwxg8CyW35efnffveK4p2us6Q7ewZwEsPf+7y1wJlI/wc/ALQWMGP4e5+HkrV36eRL5OuxMMYOkqT2FYcqpo169dFc11nSnRXASXjl+6ZIDTx8NQ1IOM8r3zcl6HEHzpncWlCJgJygxw6DpEHbKj6Z6jpHurMCqMfwhds7SvpH1zkaywduHb5we8cgx6zcx8kSzghyzLD5wi29S2//husc6cwKoD5VlfcJyLynkVIeqirvC2q4vjPvOgfybwtqvNRRM0G/dp0inVkBnMDlC7b2IXi96xyJInj95Qu29glirHhV7FcC8oMYK9UEXdN72u0DXedIV1YAJxCPxe8RlLHXjyAvFo/fnew4vcom9YD0owAiuSHQj/sPuY6RrjL2Dh6m8Uu3nQroStc5kkVpzMjFW9smM4bk3SIgElQmR77Xq2xSD9ch0pEVQB3KK6qvFhD6J9rCJqBZvCp2TaLbD3zv9zmA//0gMzkj7wbXEdKRFUBdxNGuIwQmictyaPPfhkE4Lcg47ijhIsxmVgC1FEkRSpe4zhEUSpcUSQk9hfeIYUHncUXSN/qX3tXJdY50YwVQy/4FW/oIaOU6R1AEtNq/YEtC7wZIypoCAIAYq7Pq8gTBCqCWaiDrdhbFpO6JbCeid9BZXJLv9XOdId1YAdRCqZvrDEGj0OjLVLS2uBmUgQdB1YfZd9smywqgFvo823WGwIntGrvJ9o8OZteDH0CDlyRvQqwAahFR4DpD0BK5TAf85pn+3v/XCDzFdYZ0YwVQi4Ck17BPN4lcpurqLLxvKPvKPVnZdyMniUKV6wxBYwJH8rWIVmbhYjHhL1eeaawAaqPsrDMA4jlVWVgAgNJpPcc0YAVQC+HtdZ3BmFSxAqhN2ug6gjGpYgVQi8D1rjMYkypWALW0bBFZCTvXnGkirABqmXZB+z2UVrnOYUwqWAHUhXzDdQRjUsEKoA4Res+7zmBMKlgB1OH1IR3fJRna2XWMSRdWACek37lOYEzYrABO4EJ0/gOADa5zGBMmK4ATKB7KGCK8w3UOY8JkBVCPNy7tXAbyHdc5jAmLFcBJeB5+TtB3ncOYMFgBnMTsSzsvFjHZdQ5jwmAF0ABvDO38GxJPus5hTNCsABoo2r7zT2x/gMk2VgAN9Np5rGyenz+e5EeusxgTFCuARpgx6MxPvdzIBSTfdJ3FmCBYATTSrO92+PxCdLqc5GOusxiTLCuABBQPZWzO0M63kt7/JrJvEVHTdFgBJGHO0E6/Z4TdCT5ri4iYTGQFkKTZl3beNGdY52sjEZxv+wZMprECCMisSzovnzO083DCG07gBZCHXGcy5mSirgNkmznDOr0J4M3h733e2iv/chTEYT50KcFzBVnhmrRiBRCSN85v+yWA52r+4UfzNuVt86LnefI7Q2olsCVTdPZdedycinlM5rECSJEnhnY5BGB1zT9j0oI9JTWmCbMCMKYJswIwpgmzAjCmCbMCMKYJswIwpgmzAjCmCbMCMKYJswIwpgmzAjCmCbMCMKYJswIwpgkL5cNARVJk/4ItfaqBHpS60efZIgoEFACIhDFnpqHggzggoZyePiO5XnGuz2uVs2Lm+e0Ous5nwjXq1UdzP6na0Q9+vLsvrxugMyAUgGghoIJAOYQ99LABwvpW0bYrFo2dXB50DgY10MjFW9vGq2LXQBxN6RIBrYIauykhUCViqQfOzonymVcu7vQ3FzkGzvyX0w5VRna7mDtMawof8uho+bY+pZPa+/J+IPgjAV4IKK+h25KMAXhP4BxPfGb1xAc/DCJT0gVw+YKtfWLx+N2UxghoFkQocwxyIT08OOfSzq+mclorgOD0LrvjUsmfImEYAloUhuS7JB9ZPWFqSVLjJLrh8IXbO6Kq8j6C19tKNylAzo9EIpNnXdLhL6mYzgogeX3K7uzlKz5V0hWhTUL+xaM3afWEB99KaPPGbnB4qat9UyT9o5CaFW3MV0iWNIvy9rBfGlgBJK7/S8XtqmMV90v4YVB/8U+G5Cs5EW/SinEPftCY7RoVbsS8Td1Zvu89X/q5PfjdkFRUVe2vuOytzaNdZzFf17ds8kXV1RUrJf04VQ9+AJB0RXUs/l6v0tuvacx2DQ44Yv7mUb6wRNK5jY9ngiSgFeKYOXze5p+7zmK+0qt00t/HfLwp6HQX8wvIl/znepdOvk9Sg57dN6gALpu7+Wfy8TKA1kklNIER5EF6ZPjcTU+O2ih7NuZQkV6I9Cqb/FsJfwDkfEe4L03pXTa5rM+sR1qc7HdPWgDD5225R9C/2o6+tHVj9bYtpcWy28eVdWXv/Y98/R/XOY4lYVx8/2evF60trreQ6r3TjJi3ZSKge4KNZgInXbF4/paHXMdoinqWTp4k4QbXOeokXbRuXcV/1vcrJyyAy+Zt6ifpSTTwtYRxy5d+PvKtLTe6ztGU9Cq740oID7rOUR9Bf9ezdNJtJ/p5nQVw1ZJPzwQwQ1Dz0JKZwPlx//HL528e7DpHU9B/+h3fkuLPpHJPf6Io/Kbni5NH1vWzOsMfrKh4TEKHcGOZoAnIjQt/LlrrfkdUNpPEqpj/JwgFrrM0hIAIgacvfOmhr+X9WgEMn7dpEKTC1EQzQZPUZe+uzbe4zpHN+ky741pA/V3naAxBp38R2/uL2t+v6xnAwynIY8IkThm1ZI99GCsERWuLm/nS/a5zJILyf/btV4rPOvZ7xxXAiPlbxkC4OLWxTPB0auzg/ttdp8hGH64/9FNInV3nSISAFhWHKoqP/d5xBSBfab1H0zScqNtqduaagPSZ9UgLX7rLdY4k/f2Al24/ejTv0QK4bO6WCwX1dJPJBE7Kr6iouN51jGwSP/BZIaRTXedIhqRoVUw/PvL1V88A6KfnwQwmcZLdpkHylRXHWUi4/shnBbxjvjnOXSQTBgF9r3h7yzdc58gG/aYVnwJwqOscwVDH3jOmDARqCmDkwi09AdjrxSxUHVOW3Gndiqvi0kw46KehFIsNA2oKwK/WEKdpTGgEDHGdISsoy67HmstT02js5TCKCZfdtgFQll2PpHoBNQUgqJvbOCY0QteGLg5h6pNdjxEB7QfOLG7uAQCBzo7zmJAIaj526a4zXOfIZEV6ISKgvescgRJYWX2w0+FnALI1/LNZRWWV3b5J2Dj9gwIouHNopAvPi7SqeQagjPhUk0lMFPGWrjNkshirs/LxobgKsuZtDROsZjkFvusMQSMZS2hJcDFrP15dsxOQgZ9zzKQP3480+vatqEDWFQAAu58fgxGWH34JQOxzHcaER81yGn375h7IvgIQZPfzY/h+fF/NMwBsdpzFhITgwVnfPbPRZ/jJPwdVYeRxiXY//wqh3JzmW2p2AnK96zwmJMSGRF73zhtyTyWBeBiRXBFg9/MaBLYtG1N8sGYnoNa4jWNClNBtS1IgNwYdxiWCdj+vIR2+LjwA8HI432kaExoC8xPeWEp82zTESBLXRbbh4evCA4BZF3VaC+BTl3lMSDzMTXRTel7C26YbgrtXjZ1qzwBqMBqdCxyzHgCJ6e7imDAQeH/2pZ03Jbp987y8WQQqgszkioDpYZ8WPHPw49VX3b8MOLYAPD7lLpAJR3K36dLRxfuE7PjDEPVg9+8aJP50pAyPFsDsSzsvJrjWXSwTJIIH85vn/znpcSLe40HkcYsfrBw/dZHrFOmAZAxezh+PfH3cocD0eEfqI5lQePjtjEFnJr1fZ834qfMJzg4ikiuehzvt6f9R/71m/P1/PfLFcQUwe0inmSDeTn0mEyjys2heQWBnC45GIpNBZOQDiMSi1RMeesl1jnRA4EB+Xn7xsd+r68NAk1ITx4SF4P2vDTo1sMNeV45/YCXFpF9OOBGh3Z9riN6/vXtF8c5jv/e1AnhjaJclIEtTF8sEieSmU87oWO854RORw+gUEJVBjxsmktPWjHtosesc6YDErlOibR6p/f06Pw7sNcu7BcDHoacygSJQKejakp4M/Dj+FYW/3gJ4twY9blhIbkM0crPrHOmAQFzijYvGTv7apyHrLIDZF561i8RYggfDj2eC4kW8m94Y2mVJWOOvLZz6B8J7NKzxg0LyoIfI2DVjH7CD2wCI+PnaiQ/NqutnJ1wQZM7QLis94EbY3tMMwUdmXdop9Pe6exQO+BnJOWHPkzBCJH+0qvCB5a6jpAOCf1xb+PBvT/TzelcEmjWscynF4sBTmWCRr1w0tFNKzgZcwqvjzOU1IDekYr7GIrx7V0+YWuI6R1ogF/bokV/vy6CTLgk2Z1inewn+C8Gs+mhotiDxZE77ToXFZMoW8Fh95dS9EeZfTCKNDq6hT4+/WFM4tdh1knRAclqk5WmXl/Qsrnd/UIPWBJwzrPO/edSVAL4MJJ1JGkEf5C/mDO3yo9fOY8r3zq+aULyrR/fmw0j+T6rn/jru8+CNWTPhod+4TpIOPPL+1ROmFq4a+YsDJ/vdRi11PGLepu4CZkg4L/F4JlkE9iHCH8y5tPOrrrMAQO8XJ/9M0MMCIqmfnR/R01VrJjy8LqwZek2b8k3Fqz4Ka/ygEKgAvR+vKZz6fEO3adSqwLOHdvlQBa2/7ZG/AXmo8RFNUkgReKFZjtc/XR78ALB64kP/Ri9yMcHUvedOVJL415xI/rfDfPBnCgIvw8PAxjz4a7ZLzPCF2zuiqvI+gtcri86amrbI+VF6k14f0vFd11Hq0/vFO8aJ/oOSuoczA31Sf85Bzi8PH5sQvvR+BsClHjFpdeFDCxLaOtnpL1+wtU8sHr+b0hgBWbt+uhOH34JdRA8PptNf/JMZMq84uufzQ38n6DZJPYIZlVUEXpaHe9dOeOj9YMZsmHQsAJLvetDDqwoffjGpcYIKNHLx1rbxqtg1EEdTukSw040lgkAVgCUiZ+dG+ewrF3f6m+tMyej10l3nozp2jaDhIPo27hRb3EfibYGvtiCf/8uEB/eEl/TE0qEASMYAvStyjud7z66e+OCHgYwbxCC1FUmR/Qu29IlJ3Sl0g9hORIGAlnSyoygNCQJxQEI5qd30uEFxrs9rlbNi5vntsvIIzMGvF7c9UFHVP+773SCdC6INgQJIuSD3SyiHhx2esN6Lcl3XqwasKuHVzt9+Hlh659mHFP/vVMxFSgIPEigH9RnBjfS8Dwt4ysq6DuU1xhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0zTEsqHgYw5EUncUXZhR9/TufDZxme8APCa07f7IgCQfpXveeWeUC4PW9q3zt3IofNDW3wnlCt9Ve8fdI8fig0S1RXEeRDOFNSSYksxNZ8G9ODd23/DC0+mYq4T0ZDi6Mrd6/rHq+Pfjng4V8I3JZxGqCXEfFAVAveT3EPqo7iPj6I5fK/v6T2Xc35xzGX2oEhFkW3Tt14sYTilYRD7Ccp3nStTEPBFbqL0FjzORXO+1uHydz4PcPzkqbjYW/Xs2iEx+TdQGC3gjCDGTQaB/zNgY2nKT2KxaciP8r7cUX6V7/M6EMMktWzsGCT3Q5onen9u267FS13mP5Fxy6/tnHFJl+qqyltEXAfhbNd5skgVyVcg/aHDxKVJLxKTVAGoqCiyYpX/Qwh3S+iUbJggpboA1vYsallVrX/xhX8G1Dq4kfklqd/l5niP9Fxbsj+4ccOxfeaQ0+LVlVPk+zfDVogKF7koEuGkc8a9k/BajAkXwMruE6/045gqqGeiY4QpVQWgIcXRFTvW/gN83SPozLDmIbCLxL39Ck59nMserw5rnkRtnzmmuV+1+zZfmgxbDSqlSEyPyLuj3cR3Gr1KUKML4P0e1/SKx2OPSbiksdumUioKYEXXq0dL8d8KqVsmneBHBG/rv7HklVTNeTKfvDS4v1+t6YI6us7SVBGMg7izQ+GShxuzXaNW813ZtWh8PB5fku4P/lRYdl7RXVL85VQ++AFA0LmCP3N5t4m/TOW8J7KtbHCRH/MX2oPfLUERSQ9tLb3gKb06Kreh2zW4AJafN3GKL79UUovEImaHrYOL8pd3nfgs4N8vR2+jCqB83bus68Tntw+8qbmTDBK3lg4qlvznJTjJYL5Owg3bDu59a9crQ85qyO+ftAAO3+ELnxN0n6s7fLpY2bXonF179Lak77vOAgCQrt6xb8/b7/e5rn1qpxW3lQ1+WtI9atQqvyYVBF1Qeaji3Z0zLulyst+ttwAkcfdnekrCNcHFy0wfdvu7Al+aBWmg6yy1DIgfOjR74wXXpWzH27aywfdIui5V85nGk9C+urpqxu6XLiyo7/fqLYCV3YruFjQx2GiZR8XF3gF/3zPp+o6HhB7lew89q+Li0M/QtK1scBGgu8OexyRPUq+KWPxP0onvFyf8wfLuVxdKuiecaJllxTNrHgB0pesc9ZEwevmzax4Kc45PXhrcX/KfsKf9GUS6atu0Wb8+0Y/rLIDlXa/pq3j8qab+mh8AVnSbeJ0Ov7ed/nz9fHnXohvCGHr7zDHN/WpNtx1+mUe+f/u2ssF1/gE7wTOA+OOA3dCrel/bRsK/u87RKPIfXduzqG3Qw/qVu//Z3urLXJIekYq+9jmcrxXAim4TiyR9JzWx0lt1VdWdktq4ztEYAk6prPbvCnLM7TOHnOZDk4Ic06SWpO6flH3897W/f1wBaOBNOfLxQOpipa+1PYs6wsetrnMkRPjp8h7XBvbZjHh15RTY4b0ZzweKt88cc9wz++MKYGX5npsEnZvaWOmpslr3AcpznSMRAnIZr7o/iLF2zrikS80He0ymE872K3f/87HfOloAGnhTjsS0OLzUtRU9rj0PwvWucyRD0nXvdyvqluw41VWVt8A+1Zc1fOjWY/cFHC2AFfv3jgrz02wZxa/8oaDQ31MPkwDGpR8mNYaKIiLsgJ/scta26VtHHPniqzu579/oJE6akURl+F//IyRdLynht3I/Kdt+iS3mkX0U/+rIXg84/Jl2kCPdRUofq3tc3SvdFjdJQoeVXa/um+jGPuPfCzKMSQ8Ehh/5vwcAK3au/XYiS1dlo7gwzHWGIPn0hya6LaWsui7MYYLO2VZ2UVfgyDMA6WK3kdKHfD/LrgsmdHkkEWK/oNOY9OCjegBQUwAUvuU2Thph1l0XCV2eHWUXdrTVe7MXxW7AV88Akn67KBuoqCgC8JuucwTsG4nsCBT8lK50ZFLuPOCrdwHOcRgkbXzwAU6XlF3veUs5H/S6OqfRm5EZdQi0abQ2wJGXAEC9iwY0FVV+TlZeD61aNf5kLD582ymc1Q7v9D/8EoCwGxuAh3hWFsC+fY0vAA9s8MKSJgPp8O3r1XyRduvMJ4tERWO3UdyPhpHFtUisoPH7AKi0PwmJScp+4OhLAJW7zRI8gVl3mVLJU8Suv2zGw4/5w88AiC+chgmByKy7TKnkUztcZzDhEbgDOPouAP/qMkwoovjIdYRM1qJli/WuM5jwUFoPHD0OAFl1Y5OsGvAtbHKdI5O1veyNL0HYs4AsFYlE1gE1BeBRK93GCZakNSwpibvOkekILHKdwQSPYDw3t/USoKYAos1y5rqNFDCP2XV5HKHsesxKxLJTR7+2D6gpgN5rnttKYKPbVMGhYHfcAEQieI2EXOcwgXv1yH+OLghCDy+4yRIwYk9uDt90HSMbnD1+yWYJC13nMMFq5nl/OvJ/76v/eE+7iRM0Pt9zbUmV6xRZw/OecB3BBOrtM8cvPvqu39EC6Lu+ZD3BOW4yBYOgH4nqP1znyCYdOvZ+GszCt4mbKM+LFB/39XFf5Ggykbmv+Qg82e+D0rWuc2QTnv94dQQI9EQjxg2Sr7efsPi4/WPHFUC/D0pXAHg2pakCw0Nefq6dtTYE7Sa88wKA91znMIkj4CP69XNcfm3pa0Zy7iKZca+hSfyu76o/b3OdIxuRlMeonRosg4n4U4exS1fV/v7XCqD/h89tBjLrhJgEd7N5y6muc2Sz9oWL5oF4ynUOk5Cd+dHoHXX9oM6TX+Tm8E6Si8PNFBCyGhEW9V/5hH34J2Qd8tveRHCp6xymEchKRjnu9LGLttf14zoLoOfakqqcZjkTAGwNNVwQhH8c8GHJW65jNAUc/Vplbn7eOBL2UitDePD+ocO4JScs7ROe/qr3mmc/9eBdBeBgKMmCQD42cOOLv3cdoyk544r5OyMexhFs9IIrJrVIPty+cHG9x/fUe/67/htLVgK8AUQs2GjJI/n6gHa9bnOdoylqN37pMs/T2GxcRyJbkPz39hMur/N1/7FOegLMgRtfLIswMgLEnmCiJY/g/+vfrtcYzi9Ou2JqKs6ZsHROJBodRGKD6yzmONUe8ZMOhUv+iSz2T/bLDToDbr/1L8zLQe53CH6QfL4kEDGP/OmAjS/ebA9+984Zu2h9Sy//AgCzXWcxAInPwMjw9oVLH2/oNg0+BXafDc/8rbnXahDAlxOLlxySn0fpjey/4UU71DeNtBk//4sOhR1H08O9tl/AIXJOTk7udzoWLl7QmM0aXAAA0H39H8sHbnxxjOfxaoIpWXKLZBU9PtoCOd36ri+xj/mmIbIk3mHC0nvyciLnkvxvgrYYS4oQXBHxMKJj4ZIRZ121oNGrYCV87ngNvClnZfmemyTcLeCMRMc5EQIC+VwUzab02fDM34Ievy4ruxZ9Jy4/697nbuG1btV9/R9TtsrvjukXf6s6Xv0gpKtSNWcTtIkef9l+/DvPkEz48zsJF8ARa3sWtTwU0y2UfiShR7LjkdwPoCwSifyu77rnlyc7XmNYAQTr09KLvlGF2A0Avi+pe6rnzzrkXkIve+BT7SZcPrchO/lOOmQQuY5Y1r1oIKXR8DFMwCBAeQ0LwY9EzY0QbzK3+St9Vz19IMhcDWUFEJ7dL13Y7pAfG6Y4B5DoBuA8QG0EFkCysxDVIBgXtJ/EPoEfU1pPcK0X0Vtnjxu1IogH/fHzhURFRZE167zOsSp1A/x2PlRAsqWASoLlkPaC+qg5Wq93fec8wgrAjcNnL/5VaPfFTBL0A/xkQjsVVs2qvH+t+WfMCdW8hs3YdSgyWaPeBTDGZBcrAGOaMCsAY5owKwBjmjArAGOaMCsAY5owKwBjmjArAGOaMCsAY5owKwBjmjArAGOasNA+C2Aym1QU2TX9k86pmMuHH4+rRfk5ec32c/RrlamY0xxmBWDqtOHl3W3y4/GUrPp02H5sPQhsfXHQ56DWE/zQJxfmUHPPHr9kc+pyNC1WACatCGoLYbCgwZB+XA3g49JB6zzwaUZy/nTOuAXpf7KaDGL7AEz6k3r48h/wY1WbtpZe8PvdpRef7TpStrACMBlDUETCTYdQ9dG20kH37Xl1VCvXmTKdFYDJOBKa+9KUgwf3fvTxtME/cJ0nk1kBmIwl6HTE/We2lg1+UCq2+3IC7EozGU++f/vWsten737pwgLXWTKNFYDJDtKYQ7H44m2lQ9q7jpJJrABM1pDUS6qYuXPWiBaus2QKKwCTVQT0q96/78nDS42bk7ECMFlHUuG2aYOKXefIBFYAJjsJv9xaOni86xjpzgrAZCUJhPRbzRvSoNPTNVVWACZrCeq4dW/lra5zpDMrAJPdpDu/ePmiNq5jpCsrAJPdpDblVdV3uI6RrqwATPbzeevnc4a3dh0jHVkBmKwnKP/Avv1FrnOkIysA01Rc7zpAOrICME3FhbvmDWnpOkS6sQIwTYKkaOUXhy52nSPdWAGYJoM+B7vOkG6sAEyTIai76wzpxgrANB1CN9cR0o0VgGkyBJ3hOkO6sQIwTQYBWzKsFiuAY/j0fdcZwvAZPmv0Ni2qIwohiltEc9cR0o0VwLGi3kHXEcKQ1/KseGO3admsMvvKUDzkOkK6sQI4Rg4j5a4zhKH1GbmNLgD/YF72FQCRlbdvMqwAjnFqbqs9rjOE4dyWO2ON3SaGWKNLI90JyMrbNxlWAMdot+zxgyQ/cdUenAMAAARwSURBVJ0jUMQOlpQ0+sH88d6u2XeabmmD6wjpxgqgFgHrXWcIEsWELs/5P3m8mmRWPWUmE7suspkVQC2E/uI6Q5AIJHF59G5wSdKAsuu2DYIVQC2MeHNdZwhSMpeHYtZcFyREr+V81znSjRVALWc2b7MIYIXrHMHgITbLXZjo1opwTpBpXBKwvP2EN20nYC1WALUc3hGI6a5zBIKY0XfV0wcS3bzD+Hf+AvKvQUZyxROfcZ0hHVkB1O1p1wGC4IlPJTsGs+C6IBhvlp9nBVAHK4A69L+21yySq1znSNKaftf1fC3ZQXLo/SfB/UEEckXE02dcMX+n6xzpyAqgDiwu9kVOdp0jGR4jk1lcnPTRfGdNWLwL4CNBZHKDhyKRZne7TpGurABOYOD6ktfBzNwLTnB+/w0vvBrUeDkFBf8K8tOgxkslEo+eM27BVtc50pUVQD1ITSaQcZ+K8wJ+9nLWyNkHPKI4yDFTgtzb0st70HWMdGYFUI8B60vfE/Gk6xyNQfKpfhtKAj/g5Zw2eX8g8X7Q44aK/GWb8fO/cB0jnVkBnMQZp3q3gFzmOkcDLT+roO3NYQzMofNjUY/jyAQWF3CBeKrjhHcecx0j3VkBnESHd0oqIuBYEDtcZ6kXuTOanze23bLHQ1vT4OzxSzYLkUIA1WHNEQQSSzrkt73JdY5MYAXQAP02lHwSFcYD6bmgBIHKaCQyvu+qP28Le66OhYsX0ONPw54nUSS25eblj+fo17Lv04whsAJooL4bS5d6Hm4kkFZ3LJJVnocb+657fkmq5uwwYcl/weOvUzVfQ5HcRS8yxt7zbzi6DpBplncvGoy4pgk603UWArvoRSb0X//CIhfzbysb9ENf+D2kXBfzH4vE+5FmOVe1G7PwY9dZMokVQAJW9/p+h6rK2EuA+rvKQOL93Bzvqp5rS5ze4beVfXewL38a5K4QCZblFLS68ayRsxP+3ENTZQWQoO0Db2q+c9+e/xJwbarnJvlcJC//fyXzQZ8gfTL9kg5+rKpE0AWpnJdkDMD97Se8cy/JjDteIx1YASRpZdeii3zpYUGpOO/ckig5qe+GF99OwVyNIolbp3/3+4j7vwbQJez5SLwI4c4OE5duDHuubGYFEJBl502cAOIBSIGfforEBniROwd8+EJp0GMHTWuLmm1b9/HNIKZIOC3o8Um+hQgmdxi3ZGnQYzdFVgAB0pDi6Ps7Vk+IizcCGgkhmvBgRAzgrAj1VN+ze5dxfnGjV/Z1ac+ro1odqPj8egI3SBiUzFgE94sq8xB9on3honlBZTRWAKFZ1/3GUw/p4DD5GCbgAhJdJbU40e+TPCBhA4Gl9DC3uXLmddvwbGYcdXcSO6YN6hzz+T1AQwUMgHQugJwT/T7BzwF8CGKhxLnR3NPebjdmZlaetMU1K4AU0pDi6Ef5eyK7v9jpNatqw6pme3X6KWf551acGs+0v/DJkETMH5q7G4hGY9FIeeUhr6VXEK+OxONnntq5iuc/ntZHGmaT/w9g8LSnJu1SGAAAAABJRU5ErkJggg=="
	},
	monday: {
		mime: "image/x-icon",
		data: "AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wD///8c////af///4z///9r////I////0H///+D////hP///0T///8h////Z////4z///9s////H////wD///8t////wv////7//////////f///93////u///////////////w////3P////z//////////////8j///80////rP/////Wyf7/ooX8/9PF/f//////7/z//47o//+L6P//7fv////////c88L/suR2/9ryvf//////////uP///+r18v//eFD6/0sU+f9rPvr/6Nz+/6Tv//8DzP//Acz//37l///1/PD/j9c6/2nKAP+L1jL/9fvs//////P////j+ff//4Re+/9OGPn/Txn5/5l1+/+u6v//Cs7//wDM//8X0P//v/H2/6TeWP9xzQP/ndxR//j98//////p////kP////3Rw/3/XSv5/08a+f9ZJvn/wLb9/13h//8Ay///AMv//03b///l+Oj/2vK8//H65v/////8////kf///x/////J/f3//5+C/P9QGvn/Txn5/3lN+v+/3/7/IdP//wDL//8Fzf//lur////////////4////lP///xX///8A////U/////Tq5P7/cUb6/08Z+f9QG/n/sZn8/4/r//8DzP//AMv//yvU///l+v//////5P///yT///8A////AP///wf///+e/////8Ow/f9YJfn/Txn5/6+V/P/v/v//R9r//wDL//8o1P//4vn//////+L///8h////AP///wD///8A////Kv///9v6+f//xLL9/7ag/P/x7f///////9j3//+L6P//v/L///7///////+t////CP///wAAAAAA////AP///wD///9V////4f//////////////7v///8z////2//////////7////K////Mv///wD///8AAAAAAAAAAAD///8A////Af///yz///9s////df///z7///8T////TP///3f///9g////HP///wD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AACAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAEAAIABAADAAQAA4AMAAOAHAAD//wAA//8AAA=="
	},
	sentry: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjMzYyRDU5IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+U2VudHJ5PC90aXRsZT48cGF0aCBkPSJNMTMuOTEgMi41MDVjLS44NzMtMS40NDgtMi45NzItMS40NDgtMy44NDQgMEw2LjkwNCA3LjkyYTE1LjQ3OCAxNS40NzggMCAwIDEgOC41MyAxMi44MTFoLTIuMjIxQTEzLjMwMSAxMy4zMDEgMCAwIDAgNS43ODQgOS44MTRsLTIuOTI2IDUuMDZhNy42NSA3LjY1IDAgMCAxIDQuNDM1IDUuODQ4SDIuMTk0YS4zNjUuMzY1IDAgMCAxLS4yOTgtLjUzNGwxLjQxMy0yLjQwMmE1LjE2IDUuMTYgMCAwIDAtMS42MTQtLjkxM0wuMjk2IDE5LjI3NWEyLjE4MiAyLjE4MiAwIDAgMCAuODEyIDIuOTk5IDIuMjQgMi4yNCAwIDAgMCAxLjA4Ni4yODhoNi45ODNhOS4zMjIgOS4zMjIgMCAwIDAtMy44NDUtOC4zMThsMS4xMS0xLjkyMmExMS40NyAxMS40NyAwIDAgMSA0Ljk1IDEwLjI0aDUuOTE1YTE3LjI0MiAxNy4yNDIgMCAwIDAtNy44ODUtMTUuMjhsMi4yNDQtMy44NDVhLjM3LjM3IDAgMCAxIC41MDQtLjEzYy4yNTUuMTQgOS43NSAxNi43MDggOS45MjggMTYuOWEuMzY1LjM2NSAwIDAgMS0uMzI3LjU0M2gtMi4yODdjLjAyOS42MTIuMDI5IDEuMjIzIDAgMS44MzFoMi4yOTdhMi4yMDYgMi4yMDYgMCAwIDAgMS45MjItMy4zMXoiLz48L3N2Zz4="
	},
	fullstory: {
		mime: "image/svg+xml",
		data: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMyZjgwZWQiLz48cGF0aCBkPSJNNyAxMmMxLjgtMyA0LTQuNSA1LTQuNXMzLjIgMS41IDUgNC41Yy0xLjggMy00IDQuNS01IDQuNVM4LjggMTUgNyAxMloiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIyIiBmaWxsPSIjMmY4MGVkIi8+PC9zdmc+"
	},
	notion: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjMDAwMDAwIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+Tm90aW9uPC90aXRsZT48cGF0aCBkPSJNNC40NTkgNC4yMDhjLjc0Ni42MDYgMS4wMjYuNTYgMi40MjguNDY2bDEzLjIxNS0uNzkzYy4yOCAwIC4wNDctLjI4LS4wNDYtLjMyNkwxNy44NiAxLjk2OGMtLjQyLS4zMjYtLjk4MS0uNy0yLjA1NS0uNjA3TDMuMDEgMi4yOTVjLS40NjYuMDQ2LS41Ni4yOC0uMzc0LjQ2NnptLjc5MyAzLjA4djEzLjkwNGMwIC43NDcuMzczIDEuMDI3IDEuMjE0Ljk4bDE0LjUyMy0uODRjLjg0MS0uMDQ2LjkzNS0uNTYuOTM1LTEuMTY3VjYuMzU0YzAtLjYwNi0uMjMzLS45MzMtLjc0OC0uODg3bC0xNS4xNzcuODg3Yy0uNTYuMDQ3LS43NDcuMzI3LS43NDcuOTMzem0xNC4zMzcuNzQ1Yy4wOTMuNDIgMCAuODQtLjQyLjg4OGwtLjcuMTR2MTAuMjY0Yy0uNjA4LjMyNy0xLjE2OC41MTQtMS42MzUuNTE0LS43NDggMC0uOTM1LS4yMzQtMS40OTUtLjkzM2wtNC41NzctNy4xODZ2Ni45NTJMMTIuMjEgMTlzMCAuODQtMS4xNjguODRsLTMuMjIyLjE4NmMtLjA5My0uMTg2IDAtLjY1My4zMjctLjc0NmwuODQtLjIzM1Y5Ljg1NEw3LjgyMiA5Ljc2Yy0uMDk0LS40Mi4xNC0xLjAyNi43OTMtMS4wNzNsMy40NTYtLjIzMyA0Ljc2NCA3LjI3OXYtNi40NGwtMS4yMTUtLjEzOWMtLjA5My0uNTE0LjI4LS44ODcuNzQ3LS45MzN6TTEuOTM2IDEuMDM1bDEzLjMxLS45OGMxLjYzNC0uMTQgMi4wNTUtLjA0NyAzLjA4Mi43bDQuMjQ5IDIuOTg2Yy43LjUxMy45MzQuNjUzLjkzNCAxLjIxM3YxNi4zNzhjMCAxLjAyNi0uMzczIDEuNjM0LTEuNjggMS43MjZsLTE1LjQ1OC45MzRjLS45OC4wNDctMS40NDgtLjA5My0xLjk2Mi0uNzQ3bC0zLjEyOS00LjA2Yy0uNTYtLjc0Ny0uNzkzLTEuMzA2LS43OTMtMS45NlYyLjY2N2MwLS44MzkuMzc0LTEuNTQgMS40NDctMS42MzJ6Ii8+PC9zdmc+"
	},
	granola: {
		mime: "image/png",
		data: "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"
	},
	linear: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjNUU2QUQyIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+TGluZWFyPC90aXRsZT48cGF0aCBkPSJNMi44ODYgNC4xOEExMS45ODIgMTEuOTgyIDAgMCAxIDExLjk5IDBDMTguNjI0IDAgMjQgNS4zNzYgMjQgMTIuMDA5YzAgMy42NC0xLjYyIDYuOTAzLTQuMTggOS4xMDVMMi44ODcgNC4xOFpNMS44MTcgNS42MjZsMTYuNTU2IDE2LjU1NmMtLjUyNC4zMy0xLjA3NS42Mi0xLjY1Ljg2NkwuOTUxIDcuMjc3Yy4yNDctLjU3NS41MzctMS4xMjYuODY2LTEuNjVaTS4zMjIgOS4xNjNsMTQuNTE1IDE0LjUxNWMtLjcxLjE3Mi0xLjQ0My4yODItMi4xOTUuMzIyTDAgMTEuMzU4YTEyIDEyIDAgMCAxIC4zMjItMi4xOTVabS0uMTcgNC44NjIgOS44MjMgOS44MjRhMTIuMDIgMTIuMDIgMCAwIDEtOS44MjQtOS44MjRaIi8+PC9zdmc+"
	},
	atlassian: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjMDA1MkNDIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+QXRsYXNzaWFuPC90aXRsZT48cGF0aCBkPSJNNy4xMiAxMS4wODRhLjY4My42ODMgMCAwMC0xLjE2LjEyNkwuMDc1IDIyLjk3NGEuNzAzLjcwMyAwIDAwLjYzIDEuMDE4aDguMTlhLjY3OC42NzggMCAwMC42My0uMzljMS43NjctMy42NS42OTYtOS4yMDMtMi40MDYtMTIuNTJ6TTExLjQzNC4zODZhMTUuNTE1IDE1LjUxNSAwIDAwLS45MDYgMTUuMzE3bDMuOTUgNy45YS43MDMuNzAzIDAgMDAuNjI4LjM4OGg4LjE5YS43MDMuNzAzIDAgMDAuNjMtMS4wMTdMMTIuNjMuMzhhLjY2NC42NjQgMCAwMC0xLjE5Ni4wMDZ6Ii8+PC9zdmc+"
	},
	supabase: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjM0ZDRjhFIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+U3VwYWJhc2U8L3RpdGxlPjxwYXRoIGQ9Ik0xMS45IDEuMDM2Yy0uMDE1LS45ODYtMS4yNi0xLjQxLTEuODc0LS42MzdMLjc2NCAxMi4wNUMtLjMzIDEzLjQyNy42NSAxNS40NTUgMi40MDkgMTUuNDU1aDkuNTc5bC4xMTMgNy41MWMuMDE0Ljk4NSAxLjI1OSAxLjQwOCAxLjg3My42MzZsOS4yNjItMTEuNjUzYzEuMDkzLTEuMzc1LjExMy0zLjQwMy0xLjY0NS0zLjQwM2gtOS42NDJ6Ii8+PC9zdmc+"
	},
	neon: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjMzRENTlBIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+TmVvbjwvdGl0bGU+PHBhdGggZD0iTTI0IDBWMjRsLTkuMzY1LTguMDQ1VjI0SDBWMFpNMi45NDIgMjEuMDg3aDguNzUxVjkuNTYzbDkuMzY1IDguMjA0VjIuOTE5TDIuOTQyIDIuOTE0WiIvPjwvc3ZnPg=="
	},
	stripe: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjNjM1QkZGIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+U3RyaXBlPC90aXRsZT48cGF0aCBkPSJNMTMuOTc2IDkuMTVjLTIuMTcyLS44MDYtMy4zNTYtMS40MjYtMy4zNTYtMi40MDkgMC0uODMxLjY4My0xLjMwNSAxLjkwMS0xLjMwNSAyLjIyNyAwIDQuNTE1Ljg1OCA2LjA5IDEuNjMxbC44OS01LjQ5NEMxOC4yNTIuOTc1IDE1LjY5NyAwIDEyLjE2NSAwIDkuNjY3IDAgNy41ODkuNjU0IDYuMTA0IDEuODcyIDQuNTYgMy4xNDcgMy43NTcgNC45OTIgMy43NTcgNy4yMThjMCA0LjAzOSAyLjQ2NyA1Ljc2IDYuNDc2IDcuMjE5IDIuNTg1LjkyIDMuNDQ1IDEuNTc0IDMuNDQ1IDIuNTgzIDAgLjk4LS44NCAxLjU0NS0yLjM1NCAxLjU0NS0xLjg3NSAwLTQuOTY1LS45MjEtNi45OS0yLjEwOWwtLjkgNS41NTVDNS4xNzUgMjIuOTkgOC4zODUgMjQgMTEuNzE0IDI0YzIuNjQxIDAgNC44NDMtLjYyNCA2LjMyOC0xLjgxMyAxLjY2NC0xLjMwNSAyLjUyNS0zLjIzNiAyLjUyNS01LjczMiAwLTQuMTI4LTIuNTI0LTUuODUxLTYuNTk0LTcuMzA1aC4wMDN6Ii8+PC9zdmc+"
	},
	cloudflare: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjRjM4MDIwIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+Q2xvdWRmbGFyZTwvdGl0bGU+PHBhdGggZD0iTTE2LjUwODggMTYuODQ0N2MuMTQ3NS0uNTA2OC4wOTA4LS45NzA3LS4xNTUzLTEuMzE1NC0uMjI0Ni0uMzE2NC0uNjA0NS0uNDk5LTEuMDYxNS0uNTIwNWwtOC42NTkyLS4xMTIzYS4xNTU5LjE1NTkgMCAwIDEtLjEzMzMtLjA3MTNjLS4wMjgzLS4wNDItLjAzNTEtLjA5ODYtLjAyMS0uMTU1My4wMjc4LS4wODQuMTEyMy0uMTQ4NC4yMDM2LS4xNTYybDguNzM1OS0uMTEyM2MxLjAzNTEtLjA0ODkgMi4xNjAxLS44ODY4IDIuNTUzNy0xLjkxMzZsLjQ5OS0xLjMwMTNjLjAyMTUtLjA1NjEuMDI5My0uMTEyOC4wMTQ3LS4xNjgtLjU2MjUtMi41NDYzLTIuODM1LTQuNDQ1My01LjU0OTktNC40NDUzLTIuNTAzOSAwLTQuNjI4NCAxLjYxNzctNS4zODc2IDMuODYxNC0uNDkyNy0uMzY1OC0xLjExODctLjU2MjUtMS43OTQtLjQ5OS0xLjIwMjYuMTE5LTIuMTY2NSAxLjA4My0yLjI4NjEgMi4yODU2LS4wMjgzLjMxLS4wMDY5LjYxMjguMDYzNS44OTRDMS41NjgzIDEzLjE3MSAwIDE0Ljc3NTQgMCAxNi43NTJjMCAuMTc0OC4wMTQyLjM1MTUuMDM1Mi41MjczLjAxNDEuMDgzLjA4NDQuMTQ3NS4xNjg5LjE0NzVoMTUuOTgxNGMuMDkwOSAwIC4xNzU4LS4wNjQ1LjIwMzItLjE1NTNsLjEyLS40MjY4em0yLjc1NjgtNS41NjM0Yy0uMDc3MSAwLS4xNjExIDAtLjIzODMuMDExMi0uMDU2NiAwLS4xMDU0LjA0MTUtLjEyNy4wOTc2bC0uMzM3OCAxLjE3NDRjLS4xNDc1LjUwNjgtLjA5MTguOTcwNy4xNTQzIDEuMzE2NC4yMjU2LjMxNjQuNjA1NS40OTggMS4wNjI1LjUxOTVsMS44NDM3LjExMzNjLjA1NTcgMCAuMTA1NS4wMjYzLjEzMjkuMDcwMy4wMjgzLjA0My4wMzUxLjEwNzQuMDIxNC4xNTYyLS4wMjgzLjA4NC0uMTEzMi4xNDg1LS4yMDQuMTU1M2wtMS45MjEuMTEyM2MtMS4wNDEuMDQ4OC0yLjE1ODIuODg2Ny0yLjU1MjcgMS45MTRsLS4xNDA2LjM1ODVjLS4wMjgzLjA3MTMuMDIxNS4xNDE2LjA5ODYuMTQxNmg2LjU5NzdjLjA3NzEgMCAuMTQ3NC0uMDQ4OS4xNjktLjEyNi4xMTIyLS40MDgyLjE3NTctLjgzNy4xNzU3LTEuMjgwMyAwLTIuNjAyNS0yLjEyNS00LjcyNy00LjczNDQtNC43MjciLz48L3N2Zz4="
	},
	gitlab: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjRkM2RDI2IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R2l0TGFiPC90aXRsZT48cGF0aCBkPSJtMjMuNjAwNCA5LjU5MjctLjAzMzctLjA4NjJMMjAuMy45ODE0YS44NTEuODUxIDAgMCAwLS4zMzYyLS40MDUuODc0OC44NzQ4IDAgMCAwLS45OTk3LjA1MzkuODc0OC44NzQ4IDAgMCAwLS4yOS40Mzk5bC0yLjIwNTUgNi43NDhINy41Mzc1bC0yLjIwNTctNi43NDhhLjg1NzMuODU3MyAwIDAgMC0uMjktLjQ0MTIuODc0OC44NzQ4IDAgMCAwLS45OTk3LS4wNTM3Ljg1ODUuODU4NSAwIDAgMC0uMzM2Mi40MDQ5TC40MzMyIDkuNTAxNWwtLjAzMjUuMDg2MmE2LjA2NTcgNi4wNjU3IDAgMCAwIDIuMDExOSA3LjAxMDVsLjAxMTMuMDA4Ny4wMy4wMjEzIDQuOTc2IDMuNzI2NCAyLjQ2MiAxLjg2MzMgMS40OTk1IDEuMTMyMWExLjAwODUgMS4wMDg1IDAgMCAwIDEuMjE5NyAwbDEuNDk5NS0xLjEzMjEgMi40NjE5LTEuODYzMyA1LjAwNi0zLjc0ODkuMDEyNS0uMDFhNi4wNjgyIDYuMDY4MiAwIDAgMCAyLjAwOTQtNy4wMDN6Ii8+PC9zdmc+"
	},
	canva: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjMDBDNENDIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+Q2FudmE8L3RpdGxlPjxwYXRoIGQ9Ik0xMiAwQzUuMzczIDAgMCA1LjM3MyAwIDEyczUuMzczIDEyIDEyIDEyIDEyLTUuMzczIDEyLTEyUzE4LjYyNyAwIDEyIDB6TTYuOTYyIDcuNjhjLjc1NCAwIDEuMzM3LjU0OSAxLjQwNSAxLjIuMDY5LjU4My0uMTcxIDEuMDk3LS44MjIgMS40MDYtLjM0My4xNzEtLjQ4LjE3Mi0uNTQ5LjA2OS0uMDM0LS4wNjkgMC0uMTM3LjA2OS0uMjA2LjYxNy0uNTE0LjYxNy0uOTI2LjU0OC0xLjUwOC0uMDM0LS4zNzgtLjMwOC0uNjE4LS41ODMtLjYxOC0xLjIgMC0yLjkxNCAyLjY3NC0yLjY3NCA0LjYyOS4xMDMuNzU0LjU0OSAxLjY0NiAxLjUwOSAxLjY0Ni4zMDggMCAuNjUtLjEwMy45Ni0uMjQuNS0uMjY0Ljc5OS0uNDcgMS4wOTctLjgtLjA3My0uODg1LjcwNC0yLjA0NiAxLjg1MS0yLjA0Ni41MTUgMCAuOTI2LjIwNS45Ni41ODMuMDY4LjUxNC0uMzc3LjU4Mi0uNTE0LjU4MnMtLjM3OC0uMDM0LS4zNzgtLjE3Yy0uMDM0LS4xMzguMzA5LS4wNy4yNzUtLjM3OC0uMDM1LS4yMDYtLjI0LS4yNzQtLjQ0Ni0uMjc0LS43MiAwLTEuMTMxLjk5NC0xLjAyOSAxLjYxMS4wMzUuMjc1LjE3Mi41NDkuNDQ3LjU0OS4yMDUgMCAuNTE0LS4zMS42MTctLjc1NS4wNjgtLjMwOC4zNDMtLjUxNC41ODMtLjUxNC4xMDIgMCAuMTcuMDM0LjIwNS4xNzF2LjEzOGMtLjAzNC4xMzctLjEzNy41NDgtLjEwMi42NTEgMCAuMDY5LjAzNC4xNzEuMTcuMTcxLjA5MiAwIC40MzYtLjE4Ljc3Ny0uNDU5LjExNy0uNTkuMjUzLTEuMjk4LjI1My0xLjM1Ny4wMzQtLjI0LjEzNy0uNDguNjE3LS40OC4xMDMgMCAuMTcxLjAzNC4yMDUuMTcxdi4xMzhsLS4xMzYuNjE3Yy40NDUtLjU4MyAxLjA5Ny0uOTk0IDEuNTA4LS45OTQuMTcyIDAgLjMwOS4xMDIuMzA5LjI3NCAwIC4xMDMgMCAuMjc0LS4wNjkuNDQ2LS4xMzcuMzc3LS4zMDkuOTYtLjQxMiAxLjQ3NCAwIC4xMzcuMDM1LjI3NC4yMDcuMjc0LjE3MSAwIC42ODUtLjIwNiAxLjA5Ni0uNzU0bC4wMDctLjAwNGMtLjAwMi0uMDY4LS4wMDctLjEzNC0uMDA3LS4yMDIgMC0uNDExLjAzNS0uNzU0LjEwNC0uOTk0LjA2OC0uMjc0LjQxMS0uNTE0LjYxNy0uNTE0LjEwMyAwIC4yMDUuMDY5LjIwNS4xNzEgMCAuMDM1IDAgLjEwMy0uMDM0LjEzNy0uMTM3LjQ0Ni0uMjQuODU3LS4yNCAxLjI2OSAwIC4yNC4wMzQuNTgyLjEwMi43ODggMCAuMDM0LjAzNS4wNjkuMDcuMDY5LjA2OCAwIC41NDgtLjQ0NS44OS0xLjAyOC0uMzA4LS4yMDYtLjQ4LS41NDktLjQ4LS45NiAwLS43Mi40NDYtMS4wOTcuODU4LTEuMDk3LjM0MyAwIC42MTcuMjQuNjE3LjcyIDAgLjMwOC0uMTAzLjY1LS4yNzQuOTZoLjEwMmEuNzcuNzcgMCAwIDAgLjU4NC0uMjQuMjkzLjI5MyAwIDAgMSAuMTM0LS4xMTdjLjMzNS0uNDI1LjgzLS43NCAxLjQxLS43NC40OCAwIC45MjQuMjA1Ljk1OS41ODIuMDY4LjUxNS0uMzc4LjYxOC0uNTE1LjYxOGwtLjAwMi0uMDAyYy0uMTM4IDAtLjM3Ny0uMDM1LS4zNzctLjE3MiAwLS4xMzcuMzA5LS4wNjguMjc0LS4zNzYtLjAzNC0uMjA2LS4yNC0uMjc1LS40NDYtLjI3NS0uNjg2IDAtMS4xMy44OTEtMS4wMjggMS42MTEuMDM0LjI3NS4xNzEuNTgzLjQ0NS41ODMuMjA2IDAgLjUxNS0uMzA4LjY1Mi0uNzU0LjA2OC0uMjc0LjM0My0uNTE0LjU4My0uNTE0LjEwMyAwIC4xNy4wMzQuMjA1LjE3MSAwIC4wNjkgMCAuMjA2LS4xMzcuNjUyLS4xNy4zMDgtLjE3MS40OC0uMTM3LjYxNy4wMzQuMjc0LjE3MS40OC4zMDkuNTgzLjAzNC4wMzQuMDY4LjEwMi4wNjguMTAyIDAgLjA2OS0uMDM0LjEzOC0uMTM3LjEzOC0uMDM0IDAtLjA2OCAwLS4xMDMtLjAzNS0uNTE0LS4yMDUtLjcyLS41NDgtLjc4OS0uODkxLS4yMDUuMjQtLjQ0NS4zNzctLjcyLjM3Ny0uNDQ1IDAtLjg5LS40MTEtLjk2LS45MjZhMS42MDkgMS42MDkgMCAwIDEgLjA3NS0uNjQ5Yy0uMjAzLjEzLS40MjIuMjAzLS42MjMuMjAzaC0uMTdjLS40NDcuNjUyLS45MjcgMS4wOTgtMS4yNyAxLjMwM2EuODk2Ljg5NiAwIDAgMS0uMzc3LjEwNGMtLjA2OCAwLS4xNzEtLjAzNS0uMjA1LS4xMDQtLjA5NS0uMTUyLS4xNTYtLjM5Mi0uMTkzLS42NjctLjQ4MS41MjctMS4xNDUuODA1LTEuNDUzLjgwNS0uMzQzIDAtLjU0OC0uMjA2LS41ODItLjU1di0uMzc2Yy4xMDItLjc1NC4zNzctMS4yLjM3Ny0xLjMzN2EuMDc0LjA3NCAwIDAgMC0uMDY5LS4wN2MtLjI0IDAtMS4wMjguODI0LTEuMTY2IDEuMzczbC0uMTAzLjQ0NWMtLjA2OC4zMDktLjM3Ny41MTUtLjU4Mi41MTUtLjEwMyAwLS4xNzItLjAzNS0uMjA2LS4xNzJ2LS4xMzdsLjA0Ni0uMjMzYy0uNDM1LjMxLS44Ny41MDgtMS4wNzUuNTA4LS4zMDggMC0uNDgtLjE3Mi0uNTE0LS40MTItLjIwNi4yNzQtLjQ0NS40MTItLjc1NC40MTItLjM1MiAwLS42OTYtLjI0LS44NjItLjU5My0uMjQ0LjI3NS0uNTIzLjU1My0uODUyLjc2NC0uNDguMzA5LTEuMDI4LjU0OS0xLjY4LjU0OS0uNTgyIDAtMS4wOTctLjMwOS0xLjM3MS0uNTgzLS40MTItLjM3Ny0uNjUxLS45Ni0uNjg2LTEuNTA5LS4yMDUtMS42OC44MjMtMy44NCAyLjQtNC44LjM3OC0uMjA1Ljc1NS0uMzQzIDEuMTMyLS4zNDN6bTkuNzcgMy4yOTFjLS4xMDQtLjEwNC0uMTcyLjE3Mi0uMTcyLjM0MyAwIC4yNzQuMTM3LjU4My4zMDkuNzU1YTEuNzQgMS43NCAwIDAgMCAuMTAyLS41ODNjMC0uMzQzLS4xMzctLjUxNS0uMjQtLjUxNXoiLz48L3N2Zz4="
	},
	figma: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjRjI0RTFFIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+RmlnbWE8L3RpdGxlPjxwYXRoIGQ9Ik0xNS44NTIgOC45ODFoLTQuNTg4VjBoNC41ODhjMi40NzYgMCA0LjQ5IDIuMDE0IDQuNDkgNC40OXMtMi4wMTQgNC40OTEtNC40OSA0LjQ5MXpNMTIuNzM1IDcuNTFoMy4xMTdjMS42NjUgMCAzLjAxOS0xLjM1NSAzLjAxOS0zLjAxOXMtMS4zNTUtMy4wMTktMy4wMTktMy4wMTloLTMuMTE3VjcuNTF6bTAgMS40NzFIOC4xNDhjLTIuNDc2IDAtNC40OS0yLjAxNC00LjQ5LTQuNDlTNS42NzIgMCA4LjE0OCAwaDQuNTg4djguOTgxem0tNC41ODctNy41MWMtMS42NjUgMC0zLjAxOSAxLjM1NS0zLjAxOSAzLjAxOXMxLjM1NCAzLjAyIDMuMDE5IDMuMDJoMy4xMTdWMS40NzFIOC4xNDh6bTQuNTg3IDE1LjAxOUg4LjE0OGMtMi40NzYgMC00LjQ5LTIuMDE0LTQuNDktNC40OXMyLjAxNC00LjQ5IDQuNDktNC40OWg0LjU4OHY4Ljk4ek04LjE0OCA4Ljk4MWMtMS42NjUgMC0zLjAxOSAxLjM1NS0zLjAxOSAzLjAxOXMxLjM1NSAzLjAxOSAzLjAxOSAzLjAxOWgzLjExN1Y4Ljk4MUg4LjE0OHpNOC4xNzIgMjRjLTIuNDg5IDAtNC41MTUtMi4wMTQtNC41MTUtNC40OXMyLjAxNC00LjQ5IDQuNDktNC40OWg0LjU4OHY0LjQ0MWMwIDIuNTAzLTIuMDQ3IDQuNTM5LTQuNTYzIDQuNTM5em0tLjAyNC03LjUxYTMuMDIzIDMuMDIzIDAgMCAwLTMuMDE5IDMuMDE5YzAgMS42NjUgMS4zNjUgMy4wMTkgMy4wNDQgMy4wMTkgMS43MDUgMCAzLjA5My0xLjM3NiAzLjA5My0zLjA2OHYtMi45N0g4LjE0OHptNy43MDQgMGgtLjA5OGMtMi40NzYgMC00LjQ5LTIuMDE0LTQuNDktNC40OXMyLjAxNC00LjQ5IDQuNDktNC40OWguMDk4YzIuNDc2IDAgNC40OSAyLjAxNCA0LjQ5IDQuNDlzLTIuMDE0IDQuNDktNC40OSA0LjQ5em0tLjA5Ny03LjUwOWMtMS42NjUgMC0zLjAxOSAxLjM1NS0zLjAxOSAzLjAxOXMxLjM1NSAzLjAxOSAzLjAxOSAzLjAxOWguMDk4YzEuNjY1IDAgMy4wMTktMS4zNTUgMy4wMTktMy4wMTlzLTEuMzU1LTMuMDE5LTMuMDE5LTMuMDE5aC0uMDk4eiIvPjwvc3ZnPg=="
	},
	vercel: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjMDAwMDAwIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+VmVyY2VsPC90aXRsZT48cGF0aCBkPSJtMTIgMS42MDggMTIgMjAuNzg0SDBaIi8+PC9zdmc+"
	},
	github: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjMTgxNzE3IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R2l0SHViPC90aXRsZT48cGF0aCBkPSJNMTIgLjI5N2MtNi42MyAwLTEyIDUuMzczLTEyIDEyIDAgNS4zMDMgMy40MzggOS44IDguMjA1IDExLjM4NS42LjExMy44Mi0uMjU4LjgyLS41NzcgMC0uMjg1LS4wMS0xLjA0LS4wMTUtMi4wNC0zLjMzOC43MjQtNC4wNDItMS42MS00LjA0Mi0xLjYxQzQuNDIyIDE4LjA3IDMuNjMzIDE3LjcgMy42MzMgMTcuN2MtMS4wODctLjc0NC4wODQtLjcyOS4wODQtLjcyOSAxLjIwNS4wODQgMS44MzggMS4yMzYgMS44MzggMS4yMzYgMS4wNyAxLjgzNSAyLjgwOSAxLjMwNSAzLjQ5NS45OTguMTA4LS43NzYuNDE3LTEuMzA1Ljc2LTEuNjA1LTIuNjY1LS4zLTUuNDY2LTEuMzMyLTUuNDY2LTUuOTMgMC0xLjMxLjQ2NS0yLjM4IDEuMjM1LTMuMjItLjEzNS0uMzAzLS41NC0xLjUyMy4xMDUtMy4xNzYgMCAwIDEuMDA1LS4zMjIgMy4zIDEuMjMuOTYtLjI2NyAxLjk4LS4zOTkgMy0uNDA1IDEuMDIuMDA2IDIuMDQuMTM4IDMgLjQwNSAyLjI4LTEuNTUyIDMuMjg1LTEuMjMgMy4yODUtMS4yMy42NDUgMS42NTMuMjQgMi44NzMuMTIgMy4xNzYuNzY1Ljg0IDEuMjMgMS45MSAxLjIzIDMuMjIgMCA0LjYxLTIuODA1IDUuNjI1LTUuNDc1IDUuOTIuNDIuMzYuODEgMS4wOTYuODEgMi4yMiAwIDEuNjA2LS4wMTUgMi44OTYtLjAxNSAzLjI4NiAwIC4zMTUuMjEuNjkuODI1LjU3QzIwLjU2NSAyMi4wOTIgMjQgMTcuNTkyIDI0IDEyLjI5N2MwLTYuNjI3LTUuMzczLTEyLTEyLTEyIi8+PC9zdmc+"
	},
	asana: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjRjA2QTZBIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+QXNhbmE8L3RpdGxlPjxwYXRoIGQ9Ik0xOC43OCAxMi42NTNjLTIuODgyIDAtNS4yMiAyLjMzNi01LjIyIDUuMjJzMi4zMzggNS4yMiA1LjIyIDUuMjIgNS4yMi0yLjM0IDUuMjItNS4yMi0yLjMzNi01LjIyLTUuMjItNS4yMnptLTEzLjU2IDBjLTIuODggMC01LjIyIDIuMzM3LTUuMjIgNS4yMnMyLjMzOCA1LjIyIDUuMjIgNS4yMiA1LjIyLTIuMzM4IDUuMjItNS4yMi0yLjMzNi01LjIyLTUuMjItNS4yMnptMTItNi41MjVjMCAyLjg4My0yLjMzNyA1LjIyLTUuMjIgNS4yMi0yLjg4MiAwLTUuMjItMi4zMzctNS4yMi01LjIyIDAtMi44OCAyLjMzOC01LjIyIDUuMjItNS4yMiAyLjg4MyAwIDUuMjIgMi4zNCA1LjIyIDUuMjJ6Ii8+PC9zdmc+"
	},
	hubspot: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjRkY3QTU5IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+SHViU3BvdDwvdGl0bGU+PHBhdGggZD0iTTE4LjE2NCA3LjkzVjUuMDg0YTIuMTk4IDIuMTk4IDAgMDAxLjI2Ny0xLjk3OHYtLjA2N0EyLjIgMi4yIDAgMDAxNy4yMzguODQ1aC0uMDY3YTIuMiAyLjIgMCAwMC0yLjE5MyAyLjE5M3YuMDY3YTIuMTk2IDIuMTk2IDAgMDAxLjI1MiAxLjk3M2wuMDEzLjAwNnYyLjg1MmE2LjIyIDYuMjIgMCAwMC0yLjk2OSAxLjMxbC4wMTItLjAxLTcuODI4LTYuMDk1QTIuNDk3IDIuNDk3IDAgMTA0LjMgNC42NTZsLS4wMTIuMDA2IDcuNjk3IDUuOTkxYTYuMTc2IDYuMTc2IDAgMDAtMS4wMzggMy40NDZjMCAxLjM0My40MjUgMi41ODggMS4xNDcgMy42MDdsLS4wMTMtLjAyLTIuMzQyIDIuMzQzYTEuOTY4IDEuOTY4IDAgMDAtLjU4LS4wOTVoLS4wMDJhMi4wMzMgMi4wMzMgMCAxMDIuMDMzIDIuMDMzIDEuOTc4IDEuOTc4IDAgMDAtLjEtLjU5NWwuMDA1LjAxNCAyLjMxNy0yLjMxN2E2LjI0NyA2LjI0NyAwIDEwNC43ODItMTEuMTM0bC0uMDM2LS4wMDV6bS0uOTY0IDkuMzc4YTMuMjA2IDMuMjA2IDAgMTEzLjIxNS0zLjIwN3YuMDAyYTMuMjA2IDMuMjA2IDAgMDEtMy4yMDcgMy4yMDd6Ii8+PC9zdmc+"
	},
	intercom: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjNkFGREVGIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+SW50ZXJjb208L3RpdGxlPjxwYXRoIGQ9Ik0yMSAwSDNDMS4zNDMgMCAwIDEuMzQzIDAgM3YxOGMwIDEuNjU4IDEuMzQzIDMgMyAzaDE4YzEuNjU4IDAgMy0xLjM0MiAzLTNWM2MwLTEuNjU3LTEuMzQyLTMtMy0zem0tNS44MDEgNC4zOTljMC0uNDQuMzYtLjguODAyLS44LjQ0IDAgLjguMzYuOC44djEwLjY4OGMwIC40NDItLjM2LjgwMS0uOC44MDEtLjQ0MyAwLS44MDItLjM1OS0uODAyLS44MDFWNC4zOTl6TTExLjIgMy45OTRjMC0uNDQuMzU3LS43OTkuOC0uNzk5cy44LjM1OS44Ljc5OXYxMS42MDJjMCAuNDQtLjM1Ny44LS44LjhzLS44LS4zNi0uOC0uOFYzLjk5NHptLTQgLjQwNWMwLS40NC4zNTktLjguNzk5LS44LjQ0MyAwIC44MDIuMzYuODAyLjh2MTAuNjg4YzAgLjQ0Mi0uMzYuODAxLS44MDIuODAxLS40NCAwLS43OTktLjM1OS0uNzk5LS44MDFWNC4zOTl6TTMuMTk5IDZjMC0uNDQyLjM2LS44LjgwMi0uOC40NCAwIC43OTkuMzU4Ljc5OS44djcuMTk1YzAgLjQ0MS0uMzU5LjgtLjc5OS44LS40NDMgMC0uODAyLS4zNi0uODAyLS44VjZ6TTIwLjUyIDE4LjIwMmMtLjEyMy4xMDUtMy4wODYgMi41OTMtOC41MiAyLjU5My01LjQzMyAwLTguMzk3LTIuNDg2LTguNTIxLTIuNTkzLS4zMzUtLjI4OC0uMzc1LS43OTItLjA4Ni0xLjEyOC4yODUtLjMzNC43OS0uMzc1IDEuMTI1LS4wOS4wNDcuMDQxIDIuNjkzIDIuMjExIDcuNDgxIDIuMjExIDQuODQ4IDAgNy40NTYtMi4xODYgNy40NzktMi4yMDcuMzM0LS4yODkuODM5LS4yNSAxLjEyOC4wODYuMjg5LjMzNi4yNS44NC0uMDg2IDEuMTI4em0uMjgxLTUuMDA3YzAgLjQ0MS0uMzYuOC0uODAxLjgtLjQ0MSAwLS44MDEtLjM2LS44MDEtLjhWNmMwLS40NDIuMzYxLS44LjgwMS0uOC40NDEgMCAuODAxLjM1Ny44MDEuOHY3LjE5NXoiLz48L3N2Zz4="
	},
	webflow: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjMTQ2RUY1IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+V2ViZmxvdzwvdGl0bGU+PHBhdGggZD0ibTI0IDQuNTE1LTcuNjU4IDE0Ljk3SDkuMTQ5bDMuMjA1LTYuMjA0aC0uMTQ0QzkuNTY2IDE2LjcxMyA1LjYyMSAxOC45NzMgMCAxOS40ODV2LTYuMTE4czMuNTk2LS4yMTMgNS43MS0yLjQzNUgwVjQuNTE1aDYuNDE3djUuMjc4bC4xNDQtLjAwMSAyLjYyMi01LjI3N2g0Ljg1NHY1LjI0NGguMTQ0bDIuNzItNS4yNDRIMjRaIi8+PC9zdmc+"
	},
	paypal: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjMDAyOTkxIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+UGF5UGFsPC90aXRsZT48cGF0aCBkPSJNMTUuNjA3IDQuNjUzSDguOTQxTDYuNjQ1IDE5LjI1MUgxLjgyTDQuODYyIDBoNy45OTVjMy43NTQgMCA2LjM3NSAyLjI5NCA2LjQ3MyA1LjUxMy0uNjQ4LS40NzgtMi4xMDUtLjg2LTMuNzIyLS44Nm02LjU3IDUuNTQ2YzAgMy40MS0zLjAxIDYuODUzLTYuOTU4IDYuODUzaC0yLjQ5M0wxMS41OTUgMjRINi43NGwxLjg0NS0xMS41MzhoMy41OTJjNC4yMDggMCA3LjM0Ni0zLjYzNCA3LjE1My02Ljk0OWE1LjI0IDUuMjQgMCAwIDEgMi44NDggNC42ODZNOS42NTMgNS41NDZoNi40MDhjLjkwNyAwIDEuOTQyLjIyMiAyLjM2My41NDEtLjE5NSAyLjc0MS0yLjY1NSA1LjQ4My02LjQ0MSA1LjQ4M0g4LjcxNFoiLz48L3N2Zz4="
	},
	box: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjMDA2MUQ1IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+Qm94PC90aXRsZT48cGF0aCBkPSJNLjk1OSA1LjUyM2MtLjU0IDAtLjk1OS40Mi0uOTU5Ljg5OXY3LjU0OWE0LjU5IDQuNTkgMCAwMDQuNjEzIDQuNDk0IDQuNzE3IDQuNzE3IDAgMDA0LjEzNS0yLjQ1N2MuNzc5IDEuNDM4IDIuMzM3IDIuNDU3IDQuMDc0IDIuNDU3IDIuNTc3IDAgNC42NzQtMi4wMzcgNC42NzQtNC42MTMuMDYtMi40NTctMi4wMzctNC40OTUtNC42MTMtNC40OTUtMS43MzggMC0zLjI5NS45NTktNC4wNzQgMi4zOTctLjc4LTEuNDM4LTIuMzM4LTIuMzk3LTQuMTM1LTIuMzk3LTEuMDc5IDAtMi4wMzguMzYtMi44MTcuODk5VjYuNDIyYS45Mi45MiAwIDAwLS44OTgtLjg5OXpNMTcuNjAyIDkuMjZhLjk1Ljk1IDAgMDAtLjcwNC4xNThjLS4zNi4zLS40NzkuODk5LS4xOCAxLjMxOGwyLjM5NyAzLjExNi0yLjM5NiAzLjExNWMtLjMuNDItLjI0Ljk2LjE4IDEuMjYuNDE5LjMgMS4wMTYuMjk4IDEuMzE2LS4xMjJsMi4wMzktMi42MzYgMi4wOTYgMi42OTdjLjMuMzYuODk5LjQxOSAxLjMxOC4xMi4zNi0uMy40Mi0uODQuMTIxLTEuMjU5bC0yLjMzOC0zLjExNSAyLjMzOC0zLjA1N2MuMy0uNDE5LjI5OC0xLjAxOC0uMTIxLTEuMzE4LS40OC0uMy0xLjAxOS0uMjQtMS4zMTguMThsLTIuMDk2IDIuNTc2LTIuMDQtMi42OTVjLS4xNDktLjE4LS4zNzMtLjMtLjYxMi0uMzM4ek00LjYxMyAxMS4xNTRjMS41NTggMCAyLjgxNyAxLjI2IDIuODE3IDIuNzU4IDAgMS41NTgtMS4yNTkgMi43NTYtMi44MTcgMi43NTYtMS41NTggMC0yLjgxNi0xLjE5OC0yLjgxNi0yLjc1NiAwLTEuNDk4IDEuMjU4LTIuNzU4IDIuODE2LTIuNzU4em04LjI3IDBjMS41NTggMCAyLjgxNiAxLjI2IDIuODE2IDIuNzU4LS4wNiAxLjU1OC0xLjMxOCAyLjc1Ni0yLjgxNiAyLjc1Ni0xLjU1OCAwLTIuODE3LTEuMTk4LTIuODE3LTIuNzU2IDAtMS40OTggMS4yNTktMi43NTggMi44MTctMi43NThaIi8+PC9zdmc+"
	},
	netlify: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjMDBDN0I3IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+TmV0bGlmeTwvdGl0bGU+PHBhdGggZD0iTTYuNDkgMTkuMDRoLS4yM0w1LjEzIDE3Ljl2LS4yM2wxLjczLTEuNzFoMS4ybC4xNS4xNXYxLjJMNi41IDE5LjA0Wk01LjEzIDYuMzFWNi4xbDEuMTMtMS4xM2guMjNMOC4yIDYuNjh2MS4ybC0uMTUuMTVoLTEuMkw1LjEzIDYuMzFabTkuOTYgOS4wOWgtMS42NWwtLjE0LS4xM3YtMy44M2MwLS42OC0uMjctMS4yLTEuMS0xLjIzLS40MiAwLS45IDAtMS40My4wMmwtLjA3LjA4djQuOTZsLS4xNC4xNEg4LjlsLS4xMy0uMTRWOC43M2wuMTMtLjE0aDMuN2EyLjYgMi42IDAgMCAxIDIuNjEgMi42djQuMDhsLS4xMy4xNFptLTguMzctMi40NEguMTRMMCAxMi44MnYtMS42NGwuMTQtLjE0aDYuNThsLjE0LjE0djEuNjRsLS4xNC4xNFptMTcuMTQgMGgtNi41OGwtLjE0LS4xNHYtMS42NGwuMTQtLjE0aDYuNThsLjE0LjE0djEuNjRsLS4xNC4xNFpNMTEuMDUgNi41NVYxLjY0bC4xNC0uMTRoMS42NWwuMTQuMTR2NC45bC0uMTQuMTRoLTEuNjVsLS4xNC0uMTNabTAgMTUuODF2LTQuOWwuMTQtLjE0aDEuNjVsLjE0LjEzdjQuOTFsLS4xNC4xNGgtMS42NWwtLjE0LS4xNFoiLz48L3N2Zz4="
	},
	zapier: {
		mime: "image/svg+xml",
		data: "PHN2ZyBmaWxsPSIjRkY0RjAwIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+WmFwaWVyPC90aXRsZT48cGF0aCBkPSJNNC4xNTcgMEE0LjE1MSA0LjE1MSAwIDAgMCAwIDQuMTYxdjE1LjY3OEE0LjE1MSA0LjE1MSAwIDAgMCA0LjE1NyAyNGgxNS42ODJBNC4xNTIgNC4xNTIgMCAwIDAgMjQgMTkuODM5VjQuMTYxQTQuMTUyIDQuMTUyIDAgMCAwIDE5LjgzOSAwSDQuMTU3Wm0xMC42MSA4Ljc2MWguMDNhLjU3Ny41NzcgMCAwIDEgLjIzLjAzOC41ODUuNTg1IDAgMCAxIC4yMDEuMTI0LjYzLjYzIDAgMCAxIC4xNjIuNDMxLjYxMi42MTIgMCAwIDEtLjE2Mi40MzUuNTguNTggMCAwIDEtLjIwMS4xMjguNTguNTggMCAwIDEtLjIzLjA0Mi41MjkuNTI5IDAgMCAxLS4yMzUtLjA0Mi41ODUuNTg1IDAgMCAxLS4zMzItLjMyOC41NTkuNTU5IDAgMCAxLS4wMzgtLjIzNS42MTMuNjEzIDAgMCAxIC4xNy0uNDMxLjU5LjU5IDAgMCAxIC40MDUtLjE2MlptMi44NTMgMS41NzJjLjAzLjAwNC4wNjEuMDA0LjA5NS4wMDQuMzI1LS4wMTEuNjQ2LjA2NC45MzcuMjE5LjIzOC4xNDQuNDMxLjM1NS41NTIuNjA5LjEyOC4yNzkuMTg5LjU4Mi4xODUuODg4di4xOTNhMiAyIDAgMCAxIDAgLjIxOWgtMi40OThjLjAwMy4yMjcuMDc1LjQ1LjIwNC42NDJhLjc4Ljc4IDAgMCAwIC42NDYuMjY1LjcxNC43MTQgMCAwIDAgLjQ4NC0uMTM2LjY0Mi42NDIgMCAwIDAgLjIzLS4zMThsLjkxNS4yNTdhMS4zOTggMS4zOTggMCAwIDEtLjI4LjUzN2MtLjE0LjE1OS0uMzIxLjI4NC0uNTIxLjM1NWEyLjIzNCAyLjIzNCAwIDAgMS0uODM2LjEzNiAxLjkyMyAxLjkyMyAwIDAgMS0xLjAwMS0uMjQ1IDEuNjE4IDEuNjE4IDAgMCAxLS42NjUtLjcwMyAyLjIyMSAyLjIyMSAwIDAgMS0uMjI3LTEuMDM2IDEuOTUgMS45NSAwIDAgMSAuNDgtMS4zOTggMS45IDEuOSAwIDAgMSAxLjMtLjQ4OFptLTkuNjA3LjAyM2MuMTYyLjAwNC4zMjUuMDI2LjQ4LjA3OS4yMDcuMDY1LjQuMTc0LjU2My4zMTQuMjYuMzAyLjM5My42OTIuMzY2IDEuMDg4djIuMjc2SDguNTNsLS4xMDktLjcxMWgtLjA2NWMtLjA2NC4xNjMtLjE1NS4zMS0uMjcyLjQzOWExLjEyMiAxLjEyMiAwIDAgMS0uMzc0LjI2NCAxLjAyMyAxLjAyMyAwIDAgMS0uNDUzLjA4MyAxLjMzNCAxLjMzNCAwIDAgMS0uODY2LS4yNjQuOTY1Ljk2NSAwIDAgMS0uMzI5LS44MDEuOTkzLjk5MyAwIDAgMSAuMDc2LS40MzEgMS4wMiAxLjAyIDAgMCAxIC4yNDItLjM2MyAxLjQ3OCAxLjQ3OCAwIDAgMSAxLjA0My0uMzAzaC45NTJ2LS4xODFhLjY5Ni42OTYgMCAwIDAtLjEzNi0uNDU0LjU1My41NTMgMCAwIDAtLjQzOC0uMTU0LjY5NS42OTUgMCAwIDAtLjM3OC4wODYuNDguNDggMCAwIDAtLjE5My4yNTRsLS45OS0uMTQ0YTEuMjYgMS4yNiAwIDAgMSAuMjU3LS41NjNjLjE0LS4xNzQuMzIxLS4zMDIuNTMzLS4zNzguMjYxLS4wOTEuNTQtLjEzNi44Mi0uMTI5LjA1My0uMDAzLjEwNi0uMDA3LjE2My0uMDA3Wm00LjM4NC4wMDdjLjE3NCAwIC4zNDcuMDM4LjUwNi4xMTQuMTgyLjA4My4zNC4yMTEuNDU4LjM3NC4yNTcuNDIzLjM3Ny45MTEuMzUxIDEuNDA2YTIuNTMgMi41MyAwIDAgMS0uMzU1IDEuNDQ4IDEuMTQ4IDEuMTQ4IDAgMCAxLTEuMDA5LjUxN2MtLjIwNCAwLS40MDEtLjA0NS0uNTgyLS4xMzZhMS4wNTIgMS4wNTIgMCAwIDEtLjQ4LS40NTcgMS4yOTggMS4yOTggMCAwIDEtLjExNC0uMjM0aC0uMDQ1bC4wMDQgMS43ODRoLTEuMDU5di00LjcxM2guOTA0bC4xMTcuODA1aC4wNTdjLjA2OC0uMjA4LjE3Ny0uNDAxLjMyOC0uNTZhMS4xMjkgMS4xMjkgMCAwIDEgLjg0My0uMzQ0aC4wNzZ2LS4wMDRabTcuNTU5LjA4NGguOTAzbC4xMTMuODA1aC4wNTNhMS4zNyAxLjM3IDAgMCAxIC4yMzUtLjQ4NC44MTMuODEzIDAgMCAxIC4zMTMtLjI0Mi44Mi44MiAwIDAgMSAuMzktLjA3NmguMjM0djEuMDUxaC0uNDAxYS42NjIuNjYyIDAgMCAwLS4zMTMuMDA4LjYyMy42MjMgMCAwIDAtLjI3Mi4xNTUuNjYzLjY2MyAwIDAgMC0uMTc0LjI2LjY4My42ODMgMCAwIDAtLjAyNy4zMTR2MS44NzVoLTEuMDU0di0zLjY2NlptLTE3LjUxNS4wMDNoMy4yNjJ2Ljg5NkwzLjczIDEzLjEwNGwuMDM0LjExM2gxLjk3M2wuMDQyLjlIMi40di0uOWwxLjkzMS0xLjc1NC0uMDQ1LS4xMTdIMi40NDF2LS44OTZabTExLjgxNSAwaDEuMDU1djMuNjU5aC0xLjA1NVYxMC40NVptMy40NDMuNjg0LjAxOS4wMTZhLjY5LjY5IDAgMCAwLS4zNTEuMDQ1Ljc1Ni43NTYgMCAwIDAtLjI4Ny4yMDRjLS4xMS4xNTUtLjE3NC4zMzYtLjE4OS41MjJoMS41NDVjLS4wMzQtLjUyNi0uMjU3LS43ODctLjc0LS43ODdoLjAwM1ptLTUuNzE4LjE2M2MtLjAyNiAwLS4wNTcgMC0uMDgzLjAwNGEuNzguNzggMCAwIDAtLjMxLjA1My43NDYuNzQ2IDAgMCAwLS4yNTcuMTg5IDEuMDE2IDEuMDE2IDAgMCAwLS4yMDQuNjk1di4wNjRjLS4wMTUuMjU3LjA1Ny41MDcuMjA0LjcxMWEuNjM0LjYzNCAwIDAgMCAuMjUzLjE5Ni42MzguNjM4IDAgMCAwIC4zMTQuMDYxLjY0NC42NDQgMCAwIDAgLjU3OC0uMjY1Yy4xNC0uMjIzLjIwNC0uNDguMTg5LS43NGExLjIxNiAxLjIxNiAwIDAgMC0uMTgxLS43MTEuNjc3LjY3NyAwIDAgMC0uNTAzLS4yNTdabS00LjUwOSAxLjI2NmEuNDY0LjQ2NCAwIDAgMC0uMjY4LjEwMi4zNzMuMzczIDAgMCAwLS4xMTQuMjc2YzAgLjA1My4wMDguMTA2LjAyNy4xNTVhLjM3NS4zNzUgMCAwIDAgLjA4Ny4xMzIuNTc2LjU3NiAwIDAgMCAuMzk3LjExdi4wMDRhLjg2My44NjMgMCAwIDAgLjU2My0uMTgyLjU3My41NzMgMCAwIDAgLjIxMS0uNDU3di0uMTRoLS45MDNaIi8+PC9zdmc+"
	},
	sigma: {
		mime: "image/svg+xml",
		data: "PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzNSAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+U2lnbWE8L3RpdGxlPjxwYXRoIGQ9Ik0xNC40NTIzIDE1LjM1MjRMMCAwLjgzMzI1MkwyMS40NTg3IDcuNzc5ODdMMTQuNDUyMyAxNS4zNTI0WiIgZmlsbD0iIzE3MTcxNyIvPjxwYXRoIGQ9Ik0xNS4yOTk3IDE2LjE5MDVMMjYuOTEzMSAzMC42MjQ2TDIyLjI5NTYgOC42MDYwNEwxNS4yOTk3IDE2LjE5MDVaIiBmaWxsPSIjMTcxNzE3Ii8+PHBhdGggZD0iTTI1LjQ5NzEgMzAuNzUxTDkuMDg5NTQgMjMuNTM5OUwxOS42OTY5IDIzLjU0MzVMMjUuNDk3MSAzMC43NTFaIiBmaWxsPSIjMTcxNzE3Ii8+PHBhdGggZD0iTTI3Ljg0IDAuOTg4NzY5TDIyLjQxODQgNi44NTU4N0wxNy4xOTI0IDUuMTYxMDdMMjcuODQgMC45ODg3NjlaIiBmaWxsPSIjMTcxNzE3Ii8+PHBhdGggZD0iTTI1LjkyMTMgNC42NDk0M0wyOC45OTI3IDEuNDkxOTdMMzQuMjg0NCA0LjgwMTM4TDI1LjkyMTMgNC42NDk0M1oiIGZpbGwgPSIjMTcxNzE3Ii8+PC9zdmc+"
	},
	amplitude: {
		mime: "image/png",
		data: "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"
	},
	apollo: {
		mime: "image/png",
		data: "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"
	},
	"common-room": {
		mime: "image/svg+xml",
		data: "PHN2ZyB3aWR0aD0iMTAxIiBoZWlnaHQ9IjEwMSIgdmlld0JveD0iMCAwIDEwMSAxMDEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xNy41ODQgNTIuMDM2NUw0Ni4yOTQzIDE2Ljk5NjNDNDkuNTM0NiAxOS4wMzA5IDU2LjA2MDQgMjMuMjM1OCA1Ni4yNDEyIDIzLjc3ODNDNTYuNDY3MyAyNC40NTY1IDc1LjkwOSA0NS4wMjg1IDc2LjEzNSA0Ni44MzdDNzYuMzYxMSA0OC42NDU2IDczLjY0ODMgNjcuNjM1MSA3MS44Mzk4IDcyLjM4MjVDNzAuMzkzIDc2LjE4MDQgNTYuMDE1MiA4My45MTE4IDQ5LjAwNzEgODcuMzAyOEwxNy41ODQgNTIuMDM2NVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik05NS42Nzc2IDM5LjE2OTZMNjEuMDgzMyA0LjU3NTAyQzU1LjA4NDEgLTEuNDI0MjYgNDUuMjcwNyAtMS40MjQyNiAzOS4yNzE1IDQuNTc1MDJMNC42NzcxNiAzOS4xNjk2Qy0xLjMyMjA3IDQ1LjE2ODggLTEuMzIyMDcgNTQuOTgyMyA0LjY3NzE2IDYwLjk4MTZMMzkuMjcxNSA5NS41NzYxQzQ1LjI3MDcgMTAxLjU3NSA1NS4wODk2IDEwMS41NzUgNjEuMDg4OSA5NS41NzYxTDk1LjY4MzIgNjAuOTgxNkMxMDEuNjc3IDU0Ljk4MjMgMTAxLjY3NyA0NS4xNjg4IDk1LjY3NzYgMzkuMTY5NlpNNjQuMTE5MSA2NC4wMTczTDUwLjE4MDIgNzcuOTU2NEwyMi4zMDIzIDUwLjA3ODNMNTAuMTgwMiAyMi4yMDAzTDY0LjExOTEgMzYuMTM5M0w1MC4xODAyIDUwLjA3ODNMNjQuMTE5MSA2NC4wMTczWiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg=="
	},
	exa: {
		mime: "image/png",
		data: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACgUlEQVR42u2XXUiTYRTHf8/euem7V6sbQcFMsgyJQoigizDqIuhDiW6iksBISrGS7MsP3JhWlBUqWnThjX2RBGlSRCREF0UEkURkGWYSUhCpe7e5ue3pQmaY6Eq3hNq5ex8O5/lxzvn/eR+Ruu6bZA7DwBxHFCAKYAyVUF+hkb06ZkbFS07pdD4bnR2AGieYFy8YdEhudHhCXmo2wZ5tsSgG0F1y9h0Ixvx4QW+/n1v3p4ewH7agGOB6h4fnXb7w7ICU0NPnx3ZIZUmqMmXexrUm8nLNvOnxY2twhW8JpYQim44AGq0acWYxKScp0cCZUgtOl6TYruPxyvCqoLvXT80lF0sXKVQUqhPnqEBDpcaCBMHRs04+fPJHRoYtbR7udnrZlWMmZ4Np/PxIvsqq5Uaab49w77E3sj5QftFJ/0CAmhILKUkG1mTFULAjlldvfZy+7Aq/D/waw7rkYLVOa10CjVUayYkGHE5JoVVn1EdkAISAq7XxE850t2RFhhEpYW+Zg89fAv+oFQdluLvUMf6dlWmktS6Brm4fyYkGLpRpbN43NKMu/HEHEjRBfYWG2yMpsukU253EWwRNVo0Y418YQXD7g2p4+nKUKzdHWLnMyMn9amQB8nLNbF1v4lq7h/ZHP/V+vtnFi9c+8rfHsinbFBmAjDSF8gMq7z76qW6aqHefH4rtOt+HJeeOWVi8UAkvgBDQWKUhgSKrjtsz2ecHvgY4UevEogoaKjXMJhFegPRUhao6F+/7pvb5B0+8tLR5yExXqCpWw+uEgw5JWorC8YLpC4/6JP4A7Nxi5s7D0P8EIQFcbsmQQyIYK/o7oTvHRqSpoccgoi+jKMB/D/ADRpbjdBgK8S0AAAAASUVORK5CYII="
	},
	gong: {
		mime: "image/svg+xml",
		data: "PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iODUuMzMzMyIgZmlsbD0iIzgwMzlERiIvPgo8cmVjdCB4PSI1My40NDQ2IiB5PSI1My40NDQ2IiB3aWR0aD0iMjEuMzMzMyIgaGVpZ2h0PSIyMS4zMzMzIiBmaWxsPSIjM0UwMDc1Ii8+CjxyZWN0IHg9IjQzNy4zMzMiIHk9IjUzLjMzMzMiIHdpZHRoPSIyMS4zMzMzIiBoZWlnaHQ9IjIxLjMzMzMiIGZpbGw9IiMzRTAwNzUiLz4KPHJlY3QgeD0iNDM3LjMzMyIgeT0iNDM3LjMzMyIgd2lkdGg9IjIxLjMzMzMiIGhlaWdodD0iMjEuMzMzMyIgZmlsbD0iIzNFMDA3NSIvPgo8cmVjdCB4PSI1My4zMzMzIiB5PSI0MzcuMzMzIiB3aWR0aD0iMjEuMzMzMyIgaGVpZ2h0PSIyMS4zMzMzIiBmaWxsPSIjM0UwMDc1Ii8+CjxwYXRoIGQ9Ik00MjcuMiAyMjkuODE0SDMyOC4xNDZDMzIyLjY3NyAyMjkuODE0IDMxOC40MjMgMjM1Ljg4NyAzMjAuMjQ2IDI0MC43NDVMMzQzLjk0NiAzMDIuMDc1QzM0NS4xNjIgMzA0LjUwNCAzNDIuNzMxIDMwNy41NCAzMzkuNjkzIDMwNy41NEwzMDkuMzA4IDMwNS43MTlDMzA4LjA5MyAzMDUuNzE5IDMwNi44NzcgMzA2LjMyNiAzMDUuNjYyIDMwNy41NEwyODIuNTcgMzQwLjkzOEMyODEuMzU0IDM0Mi43NiAyNzguOTI0IDM0My4zNjcgMjc2LjQ5MyAzNDIuMTUzTDI0MS4yNDcgMzE4LjQ3MUMyNDAuMDMxIDMxNy4yNTYgMjM4LjIwOCAzMTcuMjU2IDIzNi4zODUgMzE4LjQ3MUwxODcuNzcgMzUxLjI2MUMxODQuNzMyIDM1My42OSAxODAuNDc4IDM1MC42NTQgMTgxLjY5MyAzNDcuMDExTDE5NS42NyAyOTguNDMyQzE5Ni4yNzggMjk2LjYxIDE5NS4wNjIgMjk0LjE4MSAxOTMuMjM5IDI5My41NzRMMTY3LjcxNiAyODMuMjUxQzE2NS4yODUgMjgyLjAzNyAxNjQuMDcgMjc5IDE2NS44OTMgMjc3LjE3OUwxODguMzc4IDI0OS4yNDZDMTg5LjU5MyAyNDguMDMxIDE4OS41OTMgMjQ1LjYwMiAxODguMzc4IDI0NC4zODhMMTY5LjUzOSAyMTcuMDYyQzE2Ny43MTYgMjE0LjYzNCAxNjkuNTM5IDIxMC45OSAxNzIuNTc4IDIxMC45OUwyMDIuMzU1IDIwOC41NjFDMjA0Ljc4NSAyMDguNTYxIDIwNi4wMDEgMjA2Ljc0IDIwNi4wMDEgMjA0LjMxMUwyMDMuNTcgMTYzLjAxOUMyMDMuNTcgMTU5Ljk4MiAyMDYuNjA4IDE1OC4xNjEgMjA5LjAzOSAxNTguNzY4TDI0NS41MDEgMTczLjk0OUMyNDcuMzI0IDE3NC41NTYgMjQ5LjE0NyAxNzMuOTQ5IDI1MC4zNjIgMTcyLjczNEwyNzUuODg1IDE0NC44MDJDMjc3LjcwOCAxNDIuMzczIDI4MS4zNTQgMTQyLjk4IDI4Mi41NyAxNDYuMDE2TDI5Ny43NjIgMTg0Ljg3OUMyOTkuNTg1IDE4OS43MzcgMzA1LjY2MiAxOTEuNTU5IDMwOS45MTYgMTg4LjUyMkwzNjkuNDY5IDE0NC4xOTRDMzc2LjE1NCAxMzkuMzM3IDM3MS45IDEyOC40MDYgMzYzLjM5MiAxMjkuNjIxTDMyNS4xMDggMTM0LjQ3OUMzMjMuMjg1IDEzNC40NzkgMzIxLjQ2MiAxMzMuODcxIDMyMC44NTQgMTMyLjA1TDMwMC4xOTMgNzkuMjIwM0MyOTcuNzYyIDczLjc1NTIgMjkxLjA3NyA3Mi41NDA4IDI4Ni44MjMgNzYuNzkxNEwyNDEuODU0IDEyNS4zN0MyNDAuNjM5IDEyNi41ODUgMjM4LjgxNiAxMjcuMTkyIDIzNi45OTMgMTI2LjU4NUwxNzguMDQ3IDEwMS42ODhDMTcyLjU3OCA5OS4yNTkxIDE2Ny4xMDkgMTAyLjkwMiAxNjYuNTAxIDEwOC45NzVMMTY0LjA3IDE2OS42OThDMTY0LjA3IDE3Mi4xMjcgMTYyLjI0NyAxNzMuMzQyIDE2MC40MjQgMTczLjM0MkwxMDYuMzM5IDE3Ni45ODVDMTAwLjI2MyAxNzcuNTkyIDk2LjYxNjQgMTg0LjI3MiAxMDAuMjYzIDE4OS43MzdMMTM2LjExNiAyNDIuNTY2QzEzNy4zMzIgMjQzLjc4MSAxMzcuMzMyIDI0Ni4yMSAxMzYuMTE2IDI0Ny40MjRMOTkuNjU0OSAyODkuMzIzQzk2LjYxNjQgMjkyLjM2IDk4LjQzOTUgMjk5LjAzOSAxMDMuMzAxIDMwMC44NjFMMTQ1LjIzMiAzMTkuMDc4QzE0Ny4wNTUgMzE5LjY4NSAxNDguMjcgMzIyLjExNCAxNDcuNjYyIDMyMy45MzZMMTIwLjkyNCA0MjcuNzczQzExOS4xMDEgNDM1LjA2IDEyNy42MDkgNDQwLjUyNSAxMzMuNjg2IDQzNi4yNzRMMjMzLjk1NCAzNjQuNjJDMjM1LjE3IDM2My40MDYgMjM2Ljk5MyAzNjMuNDA2IDIzOC44MTYgMzY0LjYyTDI4NC4zOTMgMzk2LjgwNEMyODguMDM5IDM5OS4yMzMgMjkzLjUwOCAzOTguNjI2IDI5NS45MzkgMzk0LjM3NUwzMjQuNSAzNTAuNjU0QzMyNS4xMDggMzQ5LjQ0IDMyNi45MzEgMzQ4LjgzMiAzMjguMTQ2IDM0OC44MzJMMzk2LjIwOCAzNTcuMzM0QzQwMS42NzcgMzU3Ljk0MSA0MDcuMTQ2IDM1My42OSA0MDUuMzIzIDM0OC4yMjVMMzc2Ljc2MiAyNzQuNzVDMzc2LjE1NCAyNzIuOTI4IDM3Ni43NjIgMjcwLjQ5OSAzNzkuMTkyIDI2OS4yODVMNDMwLjg0NiAyNDQuOTk1QzQzOC4xMzggMjQxLjM1MiA0MzUuNzA4IDIyOS44MTQgNDI3LjIgMjI5LjgxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="
	},
	grafana: {
		mime: "image/x-icon",
		data: "AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAACnA+AApuvgAKcH4RSnB+FkpwPgcJ8H4Bii/+BEpwfhHKMP40yjD+KQpv/gGKcH4AAAAAAAAAAAAAAAAAAAAAAAqufgAKrn4Biq7+LQqu/j8Krr4zSq5+LAquvjMKrv46Sq7+P8qu/jmKrr4Kiq6+AAw0vgAAAAAAAAAAAAAAAAALLP3ACyz9wYssfe1LLH3/yyx9/8ssff/LLH3+Syx9/Qssff9LLH3/iyw96ErrPcSK633AAAAAAAAAAAALbD3ACuk9gArpPYmK6f21Cun9v8rqPbjK6r3hCus90Irrfc2K6v3ayuo99grp/b9K6b2pCuj9kgsofUKLJj1ACuY9RIsmvVbLJ31vCye9f8snvXZLKH2PSWX8wArlfQZLJb1LiuS9A0sofY5LJ714Sye9f8snvXhLJ71LSuQ9CUrk/S1K5T0+yuU9P8rlPT5K5b0XiuS9AArkfRGK5T0kyuX9ForlvQtKYbzACuV9JArlPT/K5X0liyc9QYsjfQ+LIv06SyL9P8si/T/LIv01SuN9Bgsh/MLLIv0pyuN9DgsjPQAK4/0ACyL9AAsi/RuLIv0/yyL9Fgsi/QALYr0AyyD83QsgfPyLIHz/yyB874sgfMHLILzFSyB87osf/MsLIDzACt88wArefMELIDznCyB8/MsgvM4LIX0ACt98wAqhPQDLHjyeSx38v8sd/LMLHXyECuA8wQsePKjLHXyoCxx8iIscfIdLHTydCx38vMsePKlLHbyICx08jUAAAAALG3yACxt8jgsbPLyLGzy7yxq8jcsbfIALHDyLixu8sQsa/LfLGvy4Cxs8vIsbvKsLHHyHixq8lcsbfJTK1rxACtg8QArX/FOK2Dx9ith8f8rX/GZK1jxBith8QArZ/EaK2bxWStl8WwrZvFEK2ryCitc8SgrYPGqK2TxJita8QArWfEBK1rxnita8f8rWvH/K1rx9Sta8XwrWvEQK1rxACta8QArV/EAK1TxAita8TgrWvHAK1rxeitU8QArWvEAK1rxCSta8b0rWvH/K1rx/yta8f8rWvH6K1rxwyta8YArWvFiK1rxbCta8aMrWvHsK1rxvCta8RErWvEAK1rxACta8QIrWvFFK1rxgSta8XwrWvF1K1rxySta8forWvH/K1rx/yta8fgrWvHlK1rx+Cta8Y4rWvEAK1rxAAAAAAAAAAAAAAAAAAAAAAArWvEAK1rxACta8RQrWvGqK1rx/yta8d4rWvFSK1rxICta8T0rWvEjK1rxACta8QAAAAAAAAAAAAAAAAAAAAAAAAAAACta8QArWvEAK1rxNSta8dErWvFsK1rxACta8QAAAAAAAAAAAAAAAAAAAAAA4AcAAOAHAADgAwAA4AAAAIAAAAACEAAAAFEAAABhAACAAAAAwgAAAMEAAACA4QAAgAEAAIADAAD8AwAA/h8AAA=="
	},
	"google-workspace": {
		mime: "image/png",
		data: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAADN0lEQVQ4jZ2US2icVRTHf+d+r3k0GZXYGAwzbRBFlDYQcCNIFbFUUExLXVTqA6QI3SSFUlAQEXQjqbgtWVSkokELPgo2YhMEpWIXQZSWWkiMFpOaNI/JZOab7373uJgkbZKRUg/czeF/fpz/PedeoUnooZ6AP/K9pGYv0I3QBSYGueZMdN6QniGOh2R01G6slU2w/Y/0kngDWLONenBDpgLigwQ4L0TFjGPkiP/VZ1/8J1Bfe+g4sd9HHMBSCPWwAVJpSCUEE64CQTxAXvG/PPXhKsOswT7YOkDbch9hCq0xZBPwLKgDtAJcRxzKutJhbzH49OamDICeDZ/jnmo/7VXIptBWg9Z6max7G9/bLsMjLTL8XRth1CFijoEsgDvjRcmzMnqyts6yDuHRGl1hISxxLd+wWon+ZCq7SwZ/GW86tGf2F+m48285cSLZNBT9OXoaK1+zbGA+gGW/TlV2yKGZy81gtwqfIDiA78AHwgRmdVAOLv4vGICvWn8Y8RFfIAfYdLCZsPtddc3yRh1uZVkyWu8z6upFFBCDGoHOysXb6cghII0Tm6BkNimqhdztAJEbq+wwvg9MovaOVJU6ik3TB4Efm5SOKgqkgNdgQRdQXH0fAtN+Cr86Z3fUcCwqVFQPNAOOvS5PbMztfMedFqG4llAmjHN8PK9Qdo45VWZUXv3kp+j+Wzl94L3qduvFe6xYEhPjcE6Eb0WH8M4XuTKtlCoqJPhcVX/y93ph18nHpyaawToHf7vLxuZsKtITJVsI0wxRkj938Vj2SSPPk6rQDzCjhnHn8Y8GxVmTH9t57tE37x3Z07lGGnlrS3j6/RdmspculPN/9cTh4ppZMfrGyj02YuAHMzDpcv3zRCxohsu2iyXNs0QLqYZl6/LXnYYlTQpQ64SkgNhWgqRArtoxMHX4vqPrgAD7vm8/vqi5viVyXLUl6uSINYNiUDxSF6JpHhe3g22BtAWJt360fPCplxFRuOn7Avj8sekjVc3sm3MtExYh1nBleAZVQcRiTA0RC+rPitQOL7+4+6VV2KYOV6PnQk8wPretN5XcXpBukC7AojKFRmMuLXxTNnefYvfRysbafwFOiFhxqOMpZwAAAABJRU5ErkJggg=="
	},
	pylon: {
		mime: "image/png",
		data: "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAHlBMVEVHcExbDv9bDv9bDv9bDv9bDv9bDv9bDf9bDf9bDv+pPS6zAAAACXRSTlMAVfTGGuCHNaEilxe2AAAD/ElEQVR4nO1b2XbjIAw1u/3/Pzw4aVJrAcRiqw+j9iU5AV20IUDatn7yPhkTdxeCPTLZ4NwejUneD0zWz91kzm/GByCbgezmXgzeRIfYYrIu3gUiL73B/AviDkGk5tqRHNJK7t44OfMPuXViMD2Lv4rBrOA+tPqFUkgT7F8Q5mzBxzDH/zhCnBCCmWb/gjBsClK/b5Hdh9i3tG+LHyiNWIKpzGnPzSdev4nn5lRD0a2GWJwtxLzvnQjx/HmPLNus7bNFv5eW/htiCYAXlUP23oHAF9S/p8skPIDXpsWPdmIEiRUkdugSgK0YPoLQFFnzp/GkAqAEQeYMHH+706FVAHkaLopIEHgGOjuuAYBfSWjaAWN/BQ9qAsh6oHO1LJHxv5LY2gBYITS8kWIuDpAA4BYUa/xJ/LXln4sAMCHVVqJywj+u7aRCAMyeXnYFrLEaWDEAKlZX+iXWVz1yiQHQyFrIDzBSW48acgBEtbxkcQRqZVIdAIgdsPEIeWBV/70AiHQZ50KKqvjfCAC8PGpeOARb16QuANjCSUg2ByKbD/xH7Q9QGwBaIdHw5AFIkHMmJIKGANYDwGYAhpSSwKUAEBNgBbVDwDIAKB4BK5gVgPDcAT3hYgWpMO1qACjW/MYCmobcAwAx+sa6aRMUA4D7zdcMp01QfvaM7KjCUeoOAB6M+skLPPSOICQ7AgAu1r51AKKgNV5IfbvhhxKDG+hFfoQdAwAN/u0HzFf3AUDLfWECQpFf5gwCAEHPkquWIJ5oFMAW8Dhgl3INDAMAOtixVXRMNAoAjMs2D6Jj4yiwBABwxJyfg89yJxwHAESeVww2gp471VEAwOhyVgLm6bDBcQARDoyj8wwDQEsGAolGTsPIE1Q68ELbQccoAOB3bj4fnQWw5FGk7zb+uuawrXkVGQZgtyX8xwEc/wHoA1A3QnU3fB7AX4uEw5vRPgoAbUbq27F6QgLmeTwlywPVk1L1tFz9YKJ+NNM/nKofz9UvKPSvaNAl1ZYhSP7XXVJBIwjtt5o3EWMSEXdNp35RqXZV+30xUL+sVr+u13+weOrJBgrg+nCn/mil/myn/nD5yNMtVDOu45gUQffjNR1BCli6bqnaAJAC6K6LK02aUy4uYNAv4dAvYlEv46F5Qb38sKOQCRt48QSoXcr1UDFbTbXa5XxcalKsiL6loJHbE54t6Vxc1ErTjPbBhynrtU+W9eoXNhcQPFjarV/cPlven6bL+8sInmpw2O5o8ehiv61ucmmmNww12nxgTnhDm8+m3ui06bd66Te7bertficpNzy+IWi2fJ6k3fR6Ul/b77G47fdFyo3PPxg0W7+/ID7N74T3/c3vHww/7f9uRfv/P8Ai/iCGtYjKAAAAAElFTkSuQmCC"
	},
	"builder-cms": {
		mime: "image/png",
		data: "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAKPUlEQVRogdWae2yUVRrGf+e7zHwzbWkpNKBYL0C5FIQEEaQp0BuIDQULhGBJCbIGcQ2GGDExZuO6uhpD4h/WLkrKahZjL4hbAQV1JeUi2obYbUpKJXRpsZ2gU4Zepp3pzHfZP6YzW4S209J12Sc5aebr+c73POc95z3nvO8R3AKxsbGYpgngBBYDq4GlwFQgAZBv9d4YwAA6gCbgDHAUqAZ6JUnC6/Xe9IL49QOn0wmgAsuA3wOZwPj/EuHh4AGqgL8AJwG9t7f3hgoRAQ6HAyEEwERgN7CdUG/fCegA9gF7gHbTNPH7/UD/UBhAPhkoBrYBjv8J1VtDA5YAKcB3QoguRVHQdT0kwGazQajni4F13GJo3QEQwGzgPuCEEKI3GAwi9495BfgD8DvuTPIDMav/b5WqqqboF5ADVDDEZDUMIzzMxgT9Xg5ZlkfT7nVgI/APhZCr3MEQ5CVJIisri+zs7LCXui309fXhcrk4f/48dXV1uN1uhBAjETK+n/NZhZCfzxispmma5OfnU1RUxPjxY+tNfT4fjY2NlJaWUlpaitvtRpajXmIygcWyqqo7gezBatlsNl555RXmzZsHhAT19fVhmuaoC4Ssqqoqd911F1lZWSxYsIDGxkZcLle0lnAA1xQgfbia4Y9CyPyHDh3i2LFjeL3ekfRYBJqmMX36dDIyMnjkkUdwOp1kZmZSUlLCjh07qK6ujrbddJxOZ7vT6bQGK3a73SooKLC8Xq8VRnd3t3Xo0CErMzPT0jTNUhTFstlsIy4TJ060Nm/ebDU0NETarq6utlJSUixN0wblNKC0y6qq/hmQBpMoSRKXLl0iLi6OxYsXI4TAZrMxe/Zs8vLyuPfee2ltbaW9vR0hBLIsI0lSVCUQCHD+/HlqampYtGgRkyZNYsqUKei6TlVVVTQWsMmqqv5puFq6rlNbW8uMGTOYOXNm5LnD4WDhwoWsWrWKmJgYmpub6ezsjNqjCCGQJIm2tjauXLnCqlWrcDgcJCcn89VXX0W80xCQZFVV/xjNh3p6eqivr2f58uUkJSUBYFkWQggSEhJYtmwZGRkZ6LrO5cuX8fl8SNKghr2RhSTR0tJCSkoK8+fPZ9y4cfz444/U1NQM20ZUAsIfcbvddHd38+ijj6IoCp2dnXz77bdMnDgRTdOYPHkyK1eu5KGHHsLj8fDTTz8RDAajEhIMBlFVlbVr1yJJEteuXeOLL74Ynlc05AeKOHz4MN988w0QOjd8+umnFBYWcuLECQKBADabjZycHA4cOEBxcTELFy4EbvRkt4IQgkuXLtHZ2QnAlClT0DQNy7KGfC9qC4Q/4vf7CQaD5OXlYbPZCAaDvP322xw5coSWlhaSk5NJSkpC0zTmzZtHbm4uEyZMoLm5GY/HM+T8iI+PZ/PmzcTGxnL16lXKysoIBAJDzoMRCQiL8Hg8rFy5kkmTJhETE8Pnn3+Oy+WitraW48eP09XVxdSpU4mPjyc2NpYlS5awYsUKZFnm8uXLeL3em4SYpskDDzzAli1b0DSNxsZGysvLMQxjSD4jGkJhAe3t7dTU1AAwefJkUlNTsSwLWZZpbW3lzTffZN26dZSUlHD9+nWEEMycOZO33nqL8vJy1q9fj8PhuIGcZVk8+OCDxMfHA9DU1BQ5tIypAAi51bq6OgBUVSU1NTXSm5IkIYSgvr6e559/nieeeIKjR4/i9/tRFIW0tDRKSkrYv38/S5cuRZIkdF0nPj6e/Px8hBDous7Zs2eH7f1RCwBobm6mr68PgPvvv/+mpV+WZQzDoKqqiq1bt7J9+3aqq6sxDAOHw8Hjjz9OeXk5e/bsYc6cORQUFLB8+XIALly4wJkzZ6LyXspoyAshuH79On6/H7vdTlJSEqqqEgwGb6oryzK9vb1UVFRw8uRJNm3axFNPPcX06dNJTExkx44drF69GqfTid1uJxgMsn//flwuV1QCRm2BsDeCUCRjqM1XeIvhdrt55513WLt2LUVFRfT09ABwzz33kJiYCMCRI0f4+OOPoz4bjFrAnYJRC9A0DVVVAejt7R1ywlmWhWEYJCUl8dxzz/HZZ5+xc+dOYmJiAGhtbcXj8QCQl5dHQUHBsAvYbQmwLIvExEQ0TQPA7XbfcvxD6CztdDrZuHEjFRUVvPHGG6SkpETWk/fee481a9bw+uuvEwgEUFWVbdu2cffddw+7esMoJzHAfffdh91uB0IeyTCMG+aBYRjYbDaWLl3Ks88+y4oVKyKCfT4fX375JcXFxXz//fcEAgHa2trIzc0lJyeH1NRU0tPTKSsrG3Yij0qAoijMnz8fCG3CGhoaIiY3TRMhBHPnzuXpp59mw4YNkbO0ruvU1NRQXFzM8ePH6enpQZZlFEWho6ODyspKsrOzI+vFwYMHh+cyUvKWZZGUlMSiRYsA+Pnnn2loaEAIgWEYJCcnU1hYyJNPPklycnLknYsXL7Jv3z4qKipwu91IknSDxYQQ1NXV0dXVRXx8PNOmTUPTtMhaM2YCDMMgLS0tcrA5d+4czc3NJCQkkJ+fzzPPPMPcuXMjpr969SofffQRH3zwAU1NTTcRHyigq6sLn88X2UMpioLf7x/SpY5IgGVZxMXFUVhYiN1uR9d1vv76azIzM9m1axfp6enhMCXd3d0cPnyYvXv3Ultbi2maQ64VlmWhaVrk/XDkYziMSIBpmqxZs4asrCwAvF4v69at4+GHH2bcuHEABAIBTp06xbvvvktVVRV+vz9yTh4KlmWRkpISaaetrW3Y3h+RAMMwmDVrFrt37454k4SEBLKzsyPi6uvr2bt3L5WVlXR0dCDLctRhF7vdTm5uLooSonTu3DmCwWDk920JME2TCRMm8OqrrzJ79uyb/t/S0sKHH37IgQMHaG1tHXScDwZd18nJySE3NxcILWxVVVVRb+b04YTYbDZeeOEF8vLybnju8Xj45JNPeP/997lw4ULkTBAtwiv0ggULeO2110hICOVTDh48yMWLF6MRoI9JYEuW5TENbM2YMSPqwJZCKKE2YTCJmqaxadOmyL7F5/NRWVnJsWPHiIuL47HHHou6xwe2OW3aNDIzMyOhRYDGxkZefPFFWlpaorVkk0IoG7hoqFoDTWm329mwYQMbN24cdb7g13PEMAxOnz7Nyy+/zA8//DCSYXhGIZTK3Aok3qpGX18fpaWlpKWlMX78eCRJinih28XA8HpZWRm//PLLSMhfA44KZ8h+fwPWD1ZTkiQyMjLIycnB4bj93F8gEMDlclFfXz/aBAfAIWDL/32KSe4/lFwhlBNOY5AkXzjaMFYlHKEeBXkLKLIs669CCFPuj0mawD+B6YRSmXcy/g68JITw9vb2hvLEiqIghOgFviOUh53JnZduNQmR3wVctSzrP4luXdfDIrqAE4TIzyGUIb8T0AEUAS/RT97n8wGDX/ZQgOWELntkMIiL/Q0w8LLHKSA46GWPgdA0Lbx4Dbxukw5M47e5bvMv4DQDrtsMvOAxEP8G3aOTIXn3fNsAAAAASUVORK5CYII="
	},
	openai: {
		mime: "image/png",
		data: "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"
	},
	anthropic: {
		mime: "image/png",
		data: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAIBUExURQAAAPr69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/r69/v7+Pz8+fn59urq5+fn5O7u7PHx7/39+tDQzUhISD09PDs7O2hoZ+/v7f7++8HBv0JCQjw8PIeHhRQUFBYWFhUVFiIiIsHBvv///OXl4j8/P0JCQRkZGRUVFXh4doaGha6urB0dHRgYGBcXFzc3N97e283NyioqKfb282RkY05OTTU1NZ+fnvX18l9fX2NjYtDQziwsKx4eHrGxr3l5d1ZWVfHx7qqqqBwcHPv794uLiUNDQuvr6L6+vCIiISUlJcTEwuTk4j8/Punp5kVFRO3t601NTHx8eoKCgbKysCoqKs/Pzf///peXlTo6OuDg3srKxygoJ/f39GdnZjY2NpmZl6Ghn6KioCAgIBoaGqOjovT08VxcW9PT0C4uLVlZWfPz8KampBsbG4+PjScnJsfHxeLi3zw8O+rq6EhIR1BQT4GBgICAf319ezQ0NICAfn5+fbW1sx8fHyMjIsDAvv///YWFhOPj4MbGxCYmJhISEhMTE09PTu/v7MrKyKWlo/Ly71hYV+Pj4V1dXEVFRaOjoXR0c0REREREQ4SEg/j49aysqkZGRe3t6u7u6////0HD2UMAAAAadFJOUwAOdNj7/Np4EJX6mnX5fNfd/f7Z33mAnxLhUGH5OQAAAAFiS0dEqr4GV74AAAAHdElNRQfqCQoVAigEyLuyAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI2LTA5LTEwVDIxOjAyOjQwKzAwOjAwm8+pAwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNi0wOS0xMFQyMTowMjo0MCswMDowMOqSEb8AAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjYtMDktMTBUMjE6MDI6NDArMDA6MDC9hzBgAAAB50lEQVQ4y4XS+1sMURgH8BMbayNKkjmnhlPZDtoXQ+eo5hW5Vuta7tqlyG1zp0So3Euhoqjcrf/SNDJm25r9/jLPeefznPc9z/MSkjZnrk+bMenz5vsJSVsQ0GaNL8NPFi7SPBLIJIs1zywhPm+QRbQUcQHKGKPOJxnQ/AJdX0npKl0vyKczAF5YVLw6WCLWrF1XVMiTAWWlIVi/YaOxaXMoVPq/iQOYXgZSqi0aKwco01kSEBWVppS4tcrYth0rK8R0QKt3KNy5C+VusWevUjXVdBrgtXUY3rdfqQMHjUOHsa6WJ4J63oBw5Oix43jipHHqNGADr08ArDECUM6jZwDOUtYEEGlkCUA0h/Hc+ZaWCyZcvGRcvoLhZuEGNNaq8Oq16zeabpq3bos7d5VqjVEX4G3tKKVpWg+V6l6HuP8A29u4G3SiBGUHzYePjMddgJ0uwLp7AJ88fWbl+QuEl4y+AujpZg4QvX34un+AWxFvAIrfGu8Gsa9X/AM0Fhwafv/BHoqPDIbMUfHx0/BQ0B5zErCx8YnI578taceXr9++/+A/f02MjzHnhmg8OvUqS8TjJVbp91TJnoFOxlkM++CUUi9tirXPJku9QQ5ZFvD678sl/gyPJunL8wjxZ+Zkz9J/RW4e+QMV0qj7xErqJwAAAABJRU5ErkJggg=="
	},
	openrouter: {
		mime: "image/x-icon",
		data: "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"
	},
	"google-gemini": {
		mime: "image/png",
		data: "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAABiVBMVEVHcEyPl5iTkKTatS6Pv1/pZFjocVDxpyGS0Vyw0Uk/i/BLlOjmvSTZxS43iP3ubEf3bDzewi82iP83iP0xhv8vvmPjxSjyUE31SkoluXXTyzVIvnX1SksRuWYbtIA0v2b2mCJyy2PwfzSKfs03o8msc6tph+kxhv8yh/82h/89h/01if07ke44i/k4jfVHifk7leVViPE7mdo7nc5nh+X2vhgUuWc6ocPdW2zrUlrwTVF3hNlGqaz4RUQlsoUdtnR9yWfnWF5QspX0sxuFgs2SfMHqxyNdvIBEpbn0SUvTYHliwXUwqaisdKdWt4pHjfLKZoQ0u3Jwxm3Ba480pbWgeLQrrpeh0VOLy162b5w+tYdCrp5xwXJTraDXzTFLwHDC0D7rmSxdj+Spwkt2jtHaaW5NmduohKNRn8jkfUu/eo3rijbDwzrTd3HXpzl1p5t1m7p2uHezmXNkl9LGh3VfpLO9tUXQmE6UhrnXiVWjsGCtj4+Kkbhpsoq6pViSpIeMsHSUmZ5HcEz0t47pAAAAg3RSTlMACQP9/v7+/P7+Q/79+qZEH2YfbN4gpWykbzBJ2aHa4uatrbGwYN//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ADoltewAAAh5SURBVHic7Zv5VxJrGMeHAbeUgFvulrdu97IobhiaFpiYS6lImSnuoqgEYm64ov7n93neZWZYVFRm5tx7+pKnc/rl83m/z/vOjECC8Du/85+OaK2rs+opYP0A0dFArEOBOv0EBOR/GNOPb6UC+s2glvDHanUTaCL8sSa9+AZawFifQSeBWsbv02sGdAJ9fX06zcDKC3j3Tp9zUCfx3+lzLZL5H3v14NeyDYD8Xj224ZiigN7P2vMtEr8X+J8tmgs0KdYPAlNa8y1jfAN8JPwprStoYnw6gKmpb3Pa8i3yAaD8b3N/ayrA188EgD83oSW/Vp4/G8DcxISGFYjy+j8z/tzE9++iZgJ10v7jGwD53//Sim/J6p/xP316opFAHv4E8oeGNMGLdWT8uXwQ0GQIlpv5/f0aDMFA6r+B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"
	},
	groq: {
		mime: "image/png",
		data: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAFNUExURfQ+AfQ+AfQ/AfI+AfQ9AfQ+AfQ9APQ/AfU+AfRAAfU9AfE9AfM9AfQ7AfQ+AfU+AfQ6AfQ+A/Q8AfQ+AfQ/AfQ8AfQ+A/Y+AfU+AfQ+APVqOvVaJvqvlvRBBvvPwfiYePiXdv////d2TPViMP749v79/PVWIPZECfzaz/7w6/RBBfmkiP/+//zSxPRsPv77+vqvl/Y+APRIDv3j2v7///iMaPqwmf///f/9//mni/Z2S/VlNfRUH/RGDPR3TP7//P/+/v79/f76+f3u6fzf1fZnN/ROFv3q5Pu8p/Q/AvQ+Avu9qfRNFPVmNv739f7+/PZ1SvRAA/RECfRQGfVgLvZxRfmihP///vQ8AP3i2fiulf77+fZqPPzQwvmihvQ/APRABP3w6/zYzPVVIPz39fdjMPd1Sv/+/PiWdfQ/A/iXd/vOv/qulfVYI/Q9AX5uIuoAAAATdFJOU9jt7e3o6Ojo6Ojo6M7i4uLi4uLoG0ZpAAAAAWJLR0QhxGwNFgAAAAd0SU1FB+oJChUCKATIu7IAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjYtMDktMTBUMjE6MDI6NDArMDA6MDCbz6kDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI2LTA5LTEwVDIxOjAyOjQwKzAwOjAw6pIRvwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNi0wOS0xMFQyMTowMjo0MCswMDowML2HMGAAAAGpSURBVDjLVVNlV8NAEAwQHIqc5IovUCiluDvFiktxd5f//5Hzu8x77SW7cztrCYKiOIrtU0kJ/wuCEGEkQJAF1SaBUk4wIDEWR8QQCYOQiCvmTlIdTBoi/sQJ8vTcTQg5EyvTEsySmltiMjwCRcjjtLa1Gx1DsKlhkUwHdJoUZW6CQLwcurpTPYh6ojKCiKnee9PQl9E5YmkTfaAuZn8WBkytylyuqtBdGBwCGI4VISRG7MvoGGTHJ8xdlVuo+0CEwiTA1PTM7Nz8QkaQIhJpAlVpLS6BxHJuZXVtXeXNQjesjTw4bG75jZLY3vH8+V2/k1TWsJfO7+cOlD91aCuTEfRkjwrHJ6dnAOfQotxYEioQukja+eIJmIbLUWI3w5umwhXA9Y2cCxO1UyvBtOgtZO+Qu4NVFfd2Sx8e4amARtxKKQmGcCRN9Dn18ioHh/VGcAL2V/nt/UMcn1wl8htlFOjXd8Z9BSKVyqDKu8/Yz683STGl0CfwStbtegr8ocgk6VV2oX2yGcnqoMxFIEyvGtFhqD/NOOyHFAY1tQmLOv6rb0g4S2Oi5h9Hgl0TeMZ19gAAAABJRU5ErkJggg=="
	},
	mistral: {
		mime: "image/x-icon",
		data: "AAABAAEAAAAAAAEAIAAlCAAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAEAAAABAAgGAAAAXHKoZgAAAAFvck5UAc+id5oAAAffSURBVHja7d1NiF3lHcfx586ZF2NyZkZDW5qMaUGR0YDgwlV3ZaaF1hptI9ZYcSHYVVxJsQoFZyRgCwWl0HZTF6114VuM4q4b585NJFKLpr6sTOILRScqRZzJnZfj/9zMWDdFXNz7HJjPF35kec8857mfTFZJSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkZa16ptWwpd6U4S48Gjsa7+DphtyFpy9M/QegFbs4VmbeDgBkvAt/jD3b+9KNNOAulPEcwwAYDAD1l//PsROxTqa9FPttdTSNxJTjLjzxxX34QcZ7sLUXY9fVz6P+A1BufvmrzHs+vvxjAMh0F5774j78ogF3YX0TIi9mQAB0GvDSjwGgEQAcasBd6MZmAQAAAUAAEAAEAAFAABAABAABQAAQAAQAAUAAEAAEAAFAABAABAABQAAQAAQAAUAAEAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPB1ADgWAPxlKFVzw4PfA7HDRW/Z3keOn/vLexIA2wuAR4p6ZWyherioYqtZ9kixXv2+OFPNDz8eF/GxDKs/96FqvtgVyw3AzZvPk+Mc/lo9NNyO97EWW820+rOXYzP1/VQ/L9wDvb/5ylgnVmXfXNa9Wc0Vu2O5ATiS+RyqBtyFbmy2vp/q/4UrY53sly7/TjUEgAe9iwBgLgCYAwAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAABAAAAAAAQAAAAAAAAAAAAC4dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANBKA+eF6ZawTq7b5Xqt+15pcvX1X6t44kWXrh3fU72PeuwgA5gOAeQD0tY37RuuVG78ebceq2Po2XbVx7+hb8eX/XvfAxNXxZdyfZddPTm/cM/aneCdVbH0bbyU2U99P9bHuz8brlbGFWBVb3aZb6/50/Hx8CT+KLcXOZdpSPMen3YPxPAfjubbn6p99OTYT8yXtKwAXfvUsY51YZdaQdWOz9f0UAAwAAoABQAAwAAgABgABwAAgABgABAADgABgABAADAACgAFAADAACAAGAAHAACAAGAAAAAADAABcPAMAAMwAAAAzAADADAAAMAMAAMwAAAAzAADADAAAMAMAAMwAAAAzAADADAAAMAMAAMwA0LxWfjQeK8v4cyFWxVYzbe389ePL3a3/IjvHf8t9YOLjlR+Pd+tnyXoOPxn/tJvvvyhfOn/DxH8z/vyrm+e/HJup76f62HuXDNUrY+1YFVvPtOr9bxb/WP5heW33pon9cREHurWbJ6/6+JqLDrx3afFRPMtGznP4z97hh+N5pgd9Br1zuGVy+oPvjvwq48+/tZXYTH0/1cfODPdWxjqxKvOefSWl4c9my61/mgxs564eS2+ndFU8w1L2cyjSfUvTYyn+Jh74OXx4+Wg6PZRubcBd6MZm6/upfgIw0lsZ68SqzDt2ZjSNxXKdw/7YuQacw/2nx1J6Z8Bn8P7/zuFQA86gG5utn0cAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4P/2Qrqit+NpKr2c9gx8TQUg0zk0CoCzqTXQM3grlY0EIMf34mTamxbSvrSYLusvAIu9D9mX2vFBCxl2ovXt9MlFacfZkbQYqzLvaHVJKjqtPQM/h1eGLk3vjqTpuHCf5L78cQ73/6uYzHInXi0m0jsj6ZYG3IVuPMf3Xx2ayPK9qNfeXF+rlYmV8UEHYrfFDg16x9OeO/9d7HrjjeLi9dhqpm2cKsqTnTR1R44zqPdy6xu/PD3SejS+hI9l3N9fL3b+pp323ZrjDOIu/jww/EO8j7WMd6H+7JV/Du0+Uj9PhnO4bXNX9h2Adu9v/31XxAe9Hass606103d2n2x9a+tX4YGvE796xnM86F00YocBsM0AWAwA6n+S5Wrz104AAMAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAAAAAMAAAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA1wTgrAPPvtcbAsAR76IRu3tQAEzFBz0VOx7rWJadiP0tNt73l/7VANwVe8k7yb6DAwCg98KHFtNlO2OlZd3OF9PeViwbAIsX7sOYd5F/7TQ1upimBgJA78Vb/i3EC1/o90v/agC8iwYsAOhNkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkqTt3OfAM2k08EfPrgAAAABJRU5ErkJggg=="
	},
	cohere: {
		mime: "image/png",
		data: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAHXUExURQAAADFSQjZSRjVRRjVRRjVRRTVRRzVSRy5GRjNNMzVQRjVSRTVQRjZMQTpRRjVRRjVRRThQSDZSRjZRQzVSRjRQRjRQRjVQSDVQRUBAQDVRRjVRRjNQRTRRRjVTRzZRRjZQRTNTRjJRSzVRRjZURzVRRTZRRzJQRjNVRDVQRjVRRjRRRjdSSTVRRTVRRjVRRTVSRipVVTNNTTVSRzVRRjROSM+P39CO4tGO4tGO4tKN4tCN4dKQ4jVVSjVRRjVRRTZRRjVRRjVRRjZRSCBAQNuS29KP4NCO4dGO4tSV3ypVKjtOTgBVVdON5dGP4tGO49GO4dGS5P+AgP92Wf93Wf93Wf92WP+AANKP49GO4oCA//92W/94Wf92Wf92WNGN4NKQ5P90Xf93Wf93Wf+ATdGN39GO4tCO4f92WP92WdKO49GO4/93Wf93WdKO4/93Wf93Wb+A39GO4v92Wf92Wf8A/9GO4tGP4/94Wf94WdGO49GP4/93Wf92WNCN4tGO4dSA//91U/93WP93Wf98XdGO49CN4c2L3v91V/92Wf93V+aZ/9GP4tKO49OL3v94Vf93Wf93Wf93Wv94WtOR49GO4tGN49GO4TVRRtGO4v93WdGO4f///2X4nuUAAACYdFJOUwAfgMfw9spzCwqP+t4vFs3rILUm+mZ/Q/4E8vxGzFaKuCgpuj2epjMP2OiEHNL+v1cGCoz4JzCMxNnKmD4YdLz83aRVCAdbxbcYBg0DHYbp3xwCUJivTgJ2+AIcyMYahFUL19QKOP60fXmq6tbS7fv3CO/++gH2vebivmSemlfYBiX18yGz8C5M9EkKsdcuJP3lnCJR7u69P414bAAAAAFiS0dEnHG8wicAAAAHdElNRQfqCQoVAigEyLuyAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI2LTA5LTEwVDIxOjAyOjQwKzAwOjAwm8+pAwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNi0wOS0xMFQyMTowMjo0MCswMDowMOqSEb8AAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjYtMDktMTBUMjE6MDI6NDArMDA6MDC9hzBgAAABYUlEQVQ4y32RZVcCQRhGH1FEsUCxu7u7W7C7u7sLG7u7ZuHPuuPiCruw98uemXtnzp53AIqDzNGJCJA7K1zA4ap0IzZx9/j1nl7EHio1PW/fE+LNBkoihQ/UGsnAFzJJT/zgKB0o4CQd+CNA0rsHIkjKB4cAoRJeHsaOIdy+j4ikg46y9xPRMeanirVlNXHx+CMhUaSTklNgQUqqlU1Lz8iENVnZObxWZeeyO3n5BYVFxSX/SWlZuYqQisqq6hqgtk7LcOjqLe9paGyin+aWVoanrZ1udXR2dXf19HJZXz9jiXYAGBwyUoZHqB9lBIxhfMLIMTkFTM8Ig1nMGf+YBxaEnlnEEh8sAyuiYAarfLCGdZFnNrDJB1vY3hEFu9DzwR6wLwoOcMgHR8Cx0J8YcHpm9ucXwPaltb+6ZmdzwxW3d3RQ9w+W/vHpd7rPh/qX17d385N86D5NVJq+vg8M7PoH+sfWprlYK/IAAAAASUVORK5CYII="
	},
	posthog: {
		mime: "image/svg+xml",
		data: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMwMDAiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzMgMTc5LjM3OUw3Mi4wMDM4IDIxOC4zM0gzM1YxNzkuMzc5Wk0zMyAxNjkuNjQxTDgxLjc1NDggMjE4LjMzSDEyMC43NTlMMzMgMTMwLjY4OVYxNjkuNjQxWk0zMyAxMjAuOTUxTDEzMC41MSAyMTguMzNIMTY5LjUxM0wzMyA4MlYxMjAuOTUxWk04MS43NTQ4IDEyMC45NTFMMTc5LjI2NCAyMTguMzNWMTc5LjM3OUw4MS43NTQ4IDgyVjEyMC45NTFaTTEzMC41MSA4MlYxMjAuOTUxTDE3OS4yNjQgMTY5LjY0MVYxMzAuNjg5TDEzMC41MSA4MloiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjY2Ljg2MyAyMDMuMTc0QzI1Ni44NyAyMDMuMTc0IDI0Ny4yOTEgMTk5LjIwOCAyNDAuMjMxIDE5Mi4xNThMMTg2IDEzOFYyMTguNzU0SDI2Ni44NjNWMjAzLjE3NFoiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMjA5LjU2MyAyMDIuNzVDMjEzLjg3MSAyMDIuNzUgMjE3LjM2MyAxOTkuMjYyIDIxNy4zNjMgMTk0Ljk1OUMyMTcuMzYzIDE5MC42NTcgMjEzLjg3MSAxODcuMTY5IDIwOS41NjMgMTg3LjE2OUMyMDUuMjU0IDE4Ny4xNjkgMjAxLjc2MiAxOTAuNjU3IDIwMS43NjIgMTk0Ljk1OUMyMDEuNzYyIDE5OS4yNjIgMjA1LjI1NCAyMDIuNzUgMjA5LjU2MyAyMDIuNzVaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTMzIDIxOC4zM0g3Mi4wMDM4TDMzIDE3OS4zNzlWMjE4LjMzWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik04MS43NTQ4IDEzMC42ODlMMzMgODJWMTIwLjk1MUw4MS43NTQ4IDE2OS42NDFWMTMwLjY4OVoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzMgMTMwLjY4OVYxNjkuNjQxTDgxLjc1NDggMjE4LjMzVjE3OS4zNzlMMzMgMTMwLjY4OVoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTMwLjUxIDEzMC42ODlMODEuNzU0OCA4MlYxMjAuOTUxTDEzMC41MSAxNjkuNjQxVjEzMC42ODlaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTgxLjc1NDggMjE4LjMzSDEyMC43NTlMODEuNzU0OCAxNzkuMzc5VjIxOC4zM1oiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNODEuNzU0OCAxMzAuNjg5VjE2OS42NDFMMTMwLjUxIDIxOC4zM1YxNzkuMzc5TDgxLjc1NDggMTMwLjY4OVoiLz48L3N2Zz4="
	},
	brave: {
		mime: "image/png",
		data: "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjYtMDktMTBUMjE6MDI6NDArMDA6MDCbz6kDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI2LTA5LTEwVDIxOjAyOjQwKzAwOjAw6pIRvwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNi0wOS0xMFQyMTowMjo0MCswMDowML2HMGAAAARsSURBVEjHddZrjFVXFQfw3773zgzMUCjTYcAWKaWxbXxU+KA2NpKYNGrT8qi0GP0giVKr9kHVxGjrBxMxDWljY4LYxDS+YmM/kEhNLUUsQVtAkWKnpAQcwQmB6Qx9DAx0Hnf23n44596ZW+pKTs7a66y9Hv+19l4nKCnfEUoGCfUMt0l+I+mWSnlseYYlX5L9xXiY/l4hHMsULHldKLiArKaqqmKFYIug2/+nXtmjog+LqoIqmCJfWwQc8l2hiLoeqObVkg2SNjFfK/pgM6NYbBRnZDnVlPVJYUA0IXoSO8VCp3DQLpiwXrJV0iNmOucz6zJG3mRyku6rWPoRYuZ4H8ODVNqZ08PICCPnSIFoUPRNJ/IfLA2lAxbIdkmWi5lZc7lnKx9aydAAY6O8/wYWLCnCf32AgWN0zWPR1bz0PI98iwsXiYHkgORWjNQKoLwtO4blKhVWbWLlF8mZK66k2taK/OIPFM9UvViv3sCJYzz5k4bGa+rOaadWdk4HeqTMis+w9tuMDLH71xw9QNd8blrFJ9eSEnu38+KzjI5y483cvoGN36Pvn+zbi9CrpkM2Xik9XkdeYVYnqx6k63K638fn7ubWrzF2ke0/ZeKdAq6nHy8c3fkN1nyV7l7m9/DlTXR0kH1MsIxGBoxjUo6cP1tIQoV5C/jE7Sy+nj/9go5OalPc+CnWb2Lhklbo3jpLTjBR2tTIYIBw1OQEv32Yl3e2bjy8mzmXU63RPovZXRx6oVXnhR1s/SH1OsER2elpB9E7+LsQOHuKJ+7lyN5i49gF9vyeWjsxEqeoVNn1FBNjhc6+Xfz4foYGCQH2q5nQnjW6qBBSVwltBk/wxH38YAeLlrHmPnb+koN/Lg5YpY1199Ixm5NHeeR+zpyiGojGBAcoDm9NyoWH7FWcwdUCRt+mPllEuPIurv84P/8OtQ7u2cKCxcW3yYlCt1Kebk7hKKhmlbC9xDA4jSOUiguX0jujiPN6mD2HzrkF36CrrmHRkoZxeEU2JBD6GzWoI5osYSqkg/0c/0fRjv8+xGNf4dBu9v2RLXfT/0rRMX37OfPf6XYJ9quZkhtL5M+XFx63yJ6RzBYzC5dxzXJGz/HRT3PzHYXDPds5/Dc653HkEKcGGvfQaHlFvCQR+nNZXs15cKVsj+S65kzoXcJDT3PDTe9q3b/y0BcYfJ0cGvOhT3KL4GzLPGhSMISXm+sK3jzN7zZz8tVpveOH+dVm3hp+t4WDxr0xU1CbYZwoYgfWoa2QRfY/y+n/sHFL0Vnbvs/J/gasDRoXPKNLnlHwGRCtVaRKl+xxyUYph5Zh03kZU5nzFwrjzSEUkuRnou8KxsXpkRlmhpDXlMXO5koekPODkisa06nlHZsOhqXwmGib7KJMeG06tVYE5YaD8+TNsvWyFy/Nt0l7BHcK1UcFF1VQacXt0i3It5VM8SfRK3lA8vVmNtGwaFsJyxtiaexfl9p6TweQP2u6iEmQrZb8SDIleljwnMnpQMLB97bzPwuX3nRSOpZBAAAAAElFTkSuQmCC"
	},
	tavily: {
		mime: "image/x-icon",
		data: "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"
	},
	firecrawl: {
		mime: "image/png",
		data: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAE7UExURf/////Ls//n3f+edP9SB/+je//7+v+2lv9NAP+ET/+2l/+lff+ccv9VC//w6v9kIf+8oP+yj/+dc//ayf9UCf+TZP/p3/9fGf+fdf/7+f+9of/6+P/38/9tLv+xj/94Pf9RBf/8+/+WaP9ZEf9OAv/s5f/i1v9QBP+0lP9jIP/49f9zNv+ogv/+/v9eGP9uL/9XDf/z7v/bzP/9+/9bFP+ddP+/ov9NAf+7nv99RP+lfv9gGv/Bpf95Pv+SY/9oJv9pJ//69/+5mv99Rf9nJP9TCP/Yx//czP95QP9OAf+9oP/l2v9UCv+QYf+heP+hef/h1P+8n/+wjf+4mv/e0P9xM//8+v/y7f9WDP/w6f+FUP+QYP/r4//dzv9rKv/28v9dFv/Zyf/Bpv9nJf/o3v/q4f/j1//by//y7EUWmokAAAABYktHRACIBR1IAAAAB3RJTUUH6gkKFQIoBMi7sgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wOS0xMFQyMTowMjo0MCswMDowMJvPqQMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDktMTBUMjE6MDI6NDArMDA6MDDqkhG/AAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTA5LTEwVDIxOjAyOjQwKzAwOjAwvYcwYAAAAQtJREFUOMu9kddWAjEURYMCHhHFLiAgRWwIVlQQxUYZBWEECzbs+v9f4CRxlqxMZnjjPu11937JDSG9Hltfl6Df7nBaBgPAoGXhAjBkFbi1YHjE3Ds9WoBR82CMeoyb+olJFkyZ+ekZ5uH1+WdlPhDkHqG5cEQWRP88YpiPS/zCIv5nSRJ4OzyWV4xBojPAqsEnU0ys8ZdifUPwm1vbTKR3dnmxJwSZ7D7b55IHPDgUgjxfHx2TE06nQnDGtoUiISUeZISgTJfKuUYXSoVyVQgu6bJGqa5eUW4IQVMBrm84394BlZZ4h3tA1fkBcBsO9ZjCk84qntvGU5deXnV8e/+Qfffnl07fP6SX8wvWvhz83wa/agAAAABJRU5ErkJggg=="
	},
	salesforce: {
		mime: "image/png",
		data: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACU0lEQVRYhe3XP4hUVxTH8c95DIOFhEVEREQWZ5EgEoJYiJWlhYhYWsloISFlCrGykCBWKSwsZIoUQcRKxEJEQpAUFiIiIsuOyBLCEiQsiywyDHss7tt1V/cfjs40/uBV9973+57z7r3nvMjMMEJVozT/BgCNtQaiM1URW9DEAnpkL9sTC18SID7ehNHpVthKjhM/Ym8ByBfES0xnuzX3YZ6xOpAeOStjPs+2Ng25AqBEbQ9xEuex78PU7NcAN3CvNj5aP7swjQd4hMlst+Y/A6C7A5dq87X0P/mcGMMPq4w/xq81zGKWYB5vs70yO0sA0ek2yRP4vf72g+iv8h5N7CMRr/EEk+Sbxb20HGCsXnR8QPP1NIVbtc9UtlsLy49hE0e+ojlM4CIuYDef3gODpn6zOoPT0ek2lgP0MTkkAFIb2yuWjt82ZacOR2ECB+sMxHb8jANDAyj6vlFutDxFnFc24jDVr9Agzo3AHJ5WqOTQUw+vpRcVSYwk+uvCbEUs4N/heudN/JHtVr9Sav3tIRm/whXisixBR2ZGdLr7lTJ7+Mv65V0Rc+T8smL0BG8Wq+JiR/QSv5A/EceUS2lAc3dFXCVniD7mMLtOOZ6qiHGMK4ViN07i0AZWM3imHONttdF93FEak3frLV69JUtNYStO4Jr1i9RN/FYbN5WaMrNatJsC+AhmJ84pHdKuFYOpJzzEFfyd7VZ/I7PVtGZXXJv8R14T8UjJxgGlxZoWHuBP/PO55myQgaVJnW4D32GLVAk9vMW7zaR5YICvqZH/GX0DeA+7dNwMD/MVCgAAAABJRU5ErkJggg=="
	},
	jira: {
		mime: "image/png",
		data: "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADo0lEQVRoge2Yy28bVRSHv3Pu2I4or/JSARlXapyQhsCyEhJSERvYAi1QirpwpK66bFKlCUyREBtWIMFfgEAskdgh2kqFFbBBFbFdHmKRIkFBiiIRiD2HhZ100vgxdzwDG5/NlebeOef3+Xcfcw3jGMc4xvF/huSWOTSdCvgMY1+jzVFCifIoo3kkBZgKeA14FuGpqQLH86qTiwMHQ5soOeomPNJ99H2jxWN5uJCLAyXH6Zh4gJlqwEt51MoFwITTtz4TWCG0zOtlnrD6ph0BZnp05eJC5gCinOzbByt8Yi7LenlMoacH9M1UG9nuSJkCzL1t++k9feJxIUsXMgX4p8WRYTkFqtVmdmshU4AIKokGGmFWLmQKIPBgwnGZuZDtIlbuSzpULJsdKetdyOdT4dHpBi+PWjDbKRSx6TM+gjeOhhaMUjNTABM2fMYLVK+PeDqnBzh2tagvfPshz3+zFBP0g2+aUV1IDVAIWvPi9IQ6fYsXv54HkIhV3zyjupDuPvBcs1Tc/3fTzMoWRZjZZrvNkw/NPVG/PeAPoOSZsd6YYpbj0vaVksqB2+6PaupcWVVR51DViSCQ99dC/gKupEg5Pd3klTRa/B040yzt26BpUVQ2M7oOYFFEO7KThx6fO4Dxjm9ag+bDLQ5fCqXl8563A3duFmqqWu7+8tsOIM7hAj0vW3wEbPnmFaheL/ifC34Ax64WVWRht3iHdFtVN/PLtdWDAp/6CgGIjNd9dyQvgHsfuKumgauouph47YjvtiZ6qq285ye9EwLVtcBvLSQGmA2tKC5YjIu9Vbw6RZ0+c21JLotx2R8BwM+FxAA31m/UnLqK9hIda53TQxO1HysoF9LpZ9LHhUQAs6EVVd1iXKwMgCiqHq6fl4sGl1JCJHYhEcD65sa8Oq0kEa9OcaoV6F7i00ViF4YCTJ6xkqieSyq+szbkAEBjWa7k7cJQgOjurZpzrjxcvNtpxbmdw0iV5ZQAk2sFTowEMPmulTTQc/3Fu1irXfGKEuwcZPUl+RK4mArBWBnmwkAAXadz6u4Ru1v0LvHq0AI/x/OIjrAWhrjQF2A2tCKwgAiiukfsHvEa26HEfRfP1XXhi1QIQ1zoC9By1Ij9TSIig8W7nan126933NPoUWiUHelVbwATzvZ6LiK9nbi5Lj6mxxfl6rJ8BXyeCgEW+nUMWgMDr4fb00q2ITrT53fR4IN+70TCIvDncL174qcU74xjHOMYx38Q/wIvAO8wp0890AAAAABJRU5ErkJggg=="
	}
};
var DARK_MODE_FILTER_LOGO_IDS = /* @__PURE__ */ new Set([
	"common-room",
	"github",
	"notion",
	"sigma",
	"vercel"
]);
function mcpIntegrationLogoNeedsDarkModeFilter(id) {
	return DARK_MODE_FILTER_LOGO_IDS.has(id);
}
function mcpIntegrationLogo(id) {
	const logo = LOGOS[id];
	if (!logo) return "";
	return `data:${logo.mime};base64,${logo.data}`;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/resources/mcp-integration-catalog.js
var DEFAULT_MCP_INTEGRATIONS = [
	{
		id: "context7",
		name: "Context7",
		provider: "context7",
		description: "Fetch current library docs in agent chats.",
		descriptionKey: "mcpIntegrations.catalog.context7.description",
		useCase: "documentation, technical reference, API docs, framework guides",
		useCaseKey: "mcpIntegrations.catalog.context7.useCase",
		url: "https://mcp.context7.com/mcp",
		authMode: "none",
		connectionMode: "direct",
		availability: "ready",
		verification: "verified",
		logoUrl: mcpIntegrationLogo("context7"),
		supportsOrganizationScope: true,
		docsUrl: "https://context7.com/",
		keywords: [
			"docs",
			"documentation",
			"libraries",
			"frameworks"
		]
	},
	{
		id: "sentry",
		name: "Sentry",
		provider: "sentry",
		description: "Inspect issues, events, and debugging data.",
		descriptionKey: "mcpIntegrations.catalog.sentry.description",
		useCase: "error monitoring, debugging, performance, crash reports",
		useCaseKey: "mcpIntegrations.catalog.sentry.useCase",
		url: "https://mcp.sentry.dev/mcp",
		authMode: "headers",
		connectionMode: "headers",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("sentry"),
		docsUrl: "https://docs.sentry.io/product/sentry-mcp/",
		headerPlaceholder: "Authorization: Bearer <sentry-token>",
		keywords: [
			"errors",
			"monitoring",
			"debugging",
			"issues"
		]
	},
	{
		id: "fullstory",
		name: "FullStory",
		provider: "fullstory",
		description: "Read behavioral analytics and inspect session replays.",
		descriptionKey: "mcpIntegrations.catalog.fullstory.description",
		useCase: "product analytics, session replay, qualitative behavior, user research",
		useCaseKey: "mcpIntegrations.catalog.fullstory.useCase",
		url: "https://api.fullstory.com/mcp/fullstory",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("fullstory"),
		docsUrl: "https://developer.fullstory.com/mcp/introduction/",
		setupNoteKey: "mcpIntegrations.catalog.fullstory.setupNote",
		keywords: [
			"product analytics",
			"session replay",
			"behavior",
			"user research",
			"sessions",
			"prompts",
			"screenshots"
		]
	},
	{
		id: "amplitude",
		name: "Amplitude",
		provider: "amplitude",
		description: "Read and work with Amplitude product analytics.",
		descriptionKey: "mcpIntegrations.catalog.amplitude.description",
		useCase: "product analytics, charts, dashboards, cohorts, experiments",
		useCaseKey: "mcpIntegrations.catalog.amplitude.useCase",
		url: "https://mcp.amplitude.com/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("amplitude"),
		docsUrl: "https://amplitude.com/docs/amplitude-ai/amplitude-mcp/other-clients",
		setupNoteKey: "mcpIntegrations.catalog.amplitude.setupNote",
		keywords: [
			"analytics",
			"product analytics",
			"charts",
			"dashboards",
			"cohorts",
			"experiments"
		]
	},
	{
		id: "sigma",
		name: "Sigma",
		provider: "sigma",
		description: "Search, explore, and analyze Sigma workbooks and dashboards.",
		descriptionKey: "mcpIntegrations.catalog.sigma.description",
		useCase: "analytics, dashboards, workbooks, data exploration, business intelligence",
		useCaseKey: "mcpIntegrations.catalog.sigma.useCase",
		url: "",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("sigma"),
		docsUrl: "https://help.sigmacomputing.com/docs/use-sigma-mcp-server",
		setupNoteKey: "mcpIntegrations.catalog.sigma.setupNote",
		keywords: [
			"analytics",
			"business intelligence",
			"dashboards",
			"data",
			"exploration",
			"workbooks"
		],
		promptAliases: [
			"Connect Sigma",
			"Sigma Computing",
			"Sigma dashboard",
			"Sigma dashboards",
			"Sigma workbook",
			"Sigma workbooks"
		]
	},
	{
		id: "notion",
		name: "Notion",
		provider: "notion",
		description: "Search pages and team knowledge.",
		descriptionKey: "mcpIntegrations.catalog.notion.description",
		useCase: "documentation, knowledge management, notes, content creation",
		useCaseKey: "mcpIntegrations.catalog.notion.useCase",
		url: "https://mcp.notion.com/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("notion"),
		docsUrl: "https://developers.notion.com/guides/mcp/get-started-with-mcp",
		setupNoteKey: "mcpIntegrations.catalog.notion.setupNote",
		keywords: [
			"docs",
			"knowledge",
			"notes",
			"pages"
		]
	},
	{
		id: "granola",
		name: "Granola",
		provider: "granola",
		description: "Search meeting notes, transcripts, and action items.",
		descriptionKey: "mcpIntegrations.catalog.granola.description",
		useCase: "meeting notes, recordings, transcripts, action items, follow-ups",
		useCaseKey: "mcpIntegrations.catalog.granola.useCase",
		url: "https://mcp.granola.ai/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("granola"),
		docsUrl: "https://docs.granola.ai/help-center/sharing/integrations/mcp",
		setupNoteKey: "mcpIntegrations.catalog.granola.setupNote",
		keywords: [
			"meetings",
			"meeting notes",
			"recordings",
			"transcripts",
			"action items",
			"follow-ups",
			"decisions"
		]
	},
	{
		id: "gong",
		name: "Gong",
		provider: "gong",
		description: "Search Gong calls and generate account and deal insights.",
		descriptionKey: "mcpIntegrations.catalog.gong.description",
		useCase: "sales calls, transcripts, deal insights, account summaries",
		useCaseKey: "mcpIntegrations.catalog.gong.useCase",
		url: "https://mcp.gong.io/mcp",
		authMode: "oauth",
		connectionMode: "manual",
		availability: "provider-setup",
		verification: "restricted",
		logoUrl: mcpIntegrationLogo("gong"),
		supportsOrganizationScope: true,
		docsUrl: "https://help.gong.io/docs/create-an-integration-to-connect-to-the-mcp-server",
		setupNoteKey: "mcpIntegrations.catalog.gong.setupNote",
		keywords: [
			"sales calls",
			"calls",
			"transcripts",
			"deals",
			"accounts",
			"revenue intelligence"
		]
	},
	{
		id: "semgrep",
		name: "Semgrep",
		provider: "semgrep",
		description: "Scan code for security findings.",
		descriptionKey: "mcpIntegrations.catalog.semgrep.description",
		useCase: "security scanning, vulnerability detection, code analysis",
		useCaseKey: "mcpIntegrations.catalog.semgrep.useCase",
		url: "https://mcp.semgrep.ai/mcp",
		authMode: "none",
		connectionMode: "direct",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("semgrep"),
		supportsOrganizationScope: true,
		docsUrl: "https://github.com/semgrep/mcp#readme",
		keywords: [
			"security",
			"sast",
			"code scanning",
			"vulnerabilities"
		]
	},
	{
		id: "linear",
		name: "Linear",
		provider: "linear",
		description: "Read and write Linear issues.",
		descriptionKey: "mcpIntegrations.catalog.linear.description",
		useCase: "project management, issue tracking, planning, bug reports",
		useCaseKey: "mcpIntegrations.catalog.linear.useCase",
		url: "https://mcp.linear.app/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("linear"),
		docsUrl: "https://linear.app/docs/mcp",
		keywords: [
			"issues",
			"tickets",
			"planning",
			"project management"
		]
	},
	{
		id: "apollo",
		name: "Apollo",
		provider: "apollo",
		description: "Search, enrich, and manage Apollo GTM data.",
		descriptionKey: "mcpIntegrations.catalog.apollo.description",
		useCase: "prospecting, enrichment, contacts, sequences, account research",
		useCaseKey: "mcpIntegrations.catalog.apollo.useCase",
		url: "https://mcp.apollo.io/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("apollo"),
		docsUrl: "https://docs.apollo.io/docs/apollo-mcp",
		setupNoteKey: "mcpIntegrations.catalog.apollo.setupNote",
		keywords: [
			"prospecting",
			"enrichment",
			"contacts",
			"sequences",
			"accounts",
			"GTM"
		]
	},
	{
		id: "common-room",
		name: "Common Room",
		provider: "common-room",
		description: "Research buyer signals, contacts, and organizations.",
		descriptionKey: "mcpIntegrations.catalog.commonRoom.description",
		useCase: "buyer intelligence, product signals, intent, contact enrichment",
		useCaseKey: "mcpIntegrations.catalog.commonRoom.useCase",
		url: "https://mcp.commonroom.io/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("common-room"),
		docsUrl: "https://www.commonroom.io/docs/using-common-room/mcp-server/",
		setupNoteKey: "mcpIntegrations.catalog.commonRoom.setupNote",
		keywords: [
			"buyer intelligence",
			"intent",
			"signals",
			"contacts",
			"organizations",
			"GTM"
		]
	},
	{
		id: "exa",
		name: "Exa",
		provider: "exa",
		description: "Search the web and fetch pages with Exa.",
		descriptionKey: "mcpIntegrations.catalog.exa.description",
		useCase: "web search, research, code search, page fetching",
		useCaseKey: "mcpIntegrations.catalog.exa.useCase",
		url: "https://mcp.exa.ai/mcp",
		authMode: "none",
		connectionMode: "direct",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("exa"),
		supportsOrganizationScope: true,
		docsUrl: "https://exa.ai/docs/reference/exa-mcp",
		setupNoteKey: "mcpIntegrations.catalog.exa.setupNote",
		keywords: [
			"web search",
			"research",
			"code search",
			"crawl",
			"fetch",
			"web"
		]
	},
	{
		id: "atlassian",
		name: "Jira",
		provider: "atlassian",
		description: "Read and write Jira issues and Confluence content.",
		descriptionKey: "mcpIntegrations.catalog.atlassian.description",
		useCase: "project management, issue tracking, documentation, team collaboration",
		useCaseKey: "mcpIntegrations.catalog.atlassian.useCase",
		url: "https://mcp.atlassian.com/v1/mcp/authv2",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "provider-setup",
		verification: "restricted",
		logoUrl: mcpIntegrationLogo("atlassian"),
		docsUrl: "https://developer.atlassian.com/cloud/rovo-mcp/guides/getting-started/",
		setupNoteKey: "mcpIntegrations.catalog.atlassian.setupNote",
		brandAliases: [
			"Jira",
			"Confluence",
			"Rovo"
		],
		keywords: [
			"atlassian",
			"jira",
			"confluence",
			"issues",
			"tickets"
		]
	},
	{
		id: "supabase",
		name: "Supabase",
		provider: "supabase",
		description: "Manage data, auth, and backend services.",
		descriptionKey: "mcpIntegrations.catalog.supabase.description",
		useCase: "database, authentication, storage, edge functions",
		useCaseKey: "mcpIntegrations.catalog.supabase.useCase",
		url: "https://mcp.supabase.com/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("supabase"),
		docsUrl: "https://www.builder.io/c/docs/fusion-connect-to-supabase?utm_source=agent-native&utm_medium=product&utm_campaign=integrations&utm_content=fusion_connect_supabase",
		keywords: [
			"database",
			"auth",
			"postgres",
			"storage"
		]
	},
	{
		id: "neon",
		name: "Neon",
		provider: "neon",
		description: "Work with serverless Postgres projects.",
		descriptionKey: "mcpIntegrations.catalog.neon.description",
		useCase: "database management, serverless postgres, data storage",
		useCaseKey: "mcpIntegrations.catalog.neon.useCase",
		url: "https://mcp.neon.tech/sse",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("neon"),
		docsUrl: "https://www.builder.io/c/docs/fusion-connect-to-neon?utm_source=agent-native&utm_medium=product&utm_campaign=integrations&utm_content=fusion_connect_neon",
		keywords: [
			"database",
			"postgres",
			"serverless",
			"backend"
		]
	},
	{
		id: "stripe",
		name: "Stripe",
		provider: "stripe",
		description: "Manage payments, subscriptions, and customers.",
		descriptionKey: "mcpIntegrations.catalog.stripe.description",
		useCase: "payments, subscriptions, invoicing, customer management",
		useCaseKey: "mcpIntegrations.catalog.stripe.useCase",
		url: "https://mcp.stripe.com",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("stripe"),
		docsUrl: "https://docs.stripe.com/mcp",
		keywords: [
			"payments",
			"billing",
			"subscriptions",
			"customers"
		]
	},
	{
		id: "cloudflare",
		name: "Cloudflare",
		provider: "cloudflare",
		description: "Search and operate Cloudflare services.",
		descriptionKey: "mcpIntegrations.catalog.cloudflare.description",
		useCase: "DNS, Workers, domains, security, observability, platform APIs",
		useCaseKey: "mcpIntegrations.catalog.cloudflare.useCase",
		url: "https://mcp.cloudflare.com/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("cloudflare"),
		docsUrl: "https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/",
		setupNoteKey: "mcpIntegrations.catalog.cloudflare.setupNote",
		keywords: [
			"cloud",
			"workers",
			"dns",
			"security",
			"observability"
		]
	},
	{
		id: "grafana",
		name: "Grafana",
		provider: "grafana",
		description: "Query Grafana Cloud metrics, logs, and observability data.",
		descriptionKey: "mcpIntegrations.catalog.grafana.description",
		useCase: "observability, metrics, logs, traces, dashboards",
		useCaseKey: "mcpIntegrations.catalog.grafana.useCase",
		url: "https://mcp.grafana.com/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "beta",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("grafana"),
		docsUrl: "https://grafana.com/docs/grafana-cloud/ai-tools/mcp-servers/cloud-mcp/",
		setupNoteKey: "mcpIntegrations.catalog.grafana.setupNote",
		keywords: [
			"observability",
			"metrics",
			"logs",
			"traces",
			"dashboards",
			"Grafana Cloud"
		]
	},
	{
		id: "gitlab",
		name: "GitLab",
		provider: "gitlab",
		description: "Read and manage GitLab projects, issues, and merge requests.",
		descriptionKey: "mcpIntegrations.catalog.gitlab.description",
		useCase: "repositories, issues, merge requests, CI/CD, code analytics",
		useCaseKey: "mcpIntegrations.catalog.gitlab.useCase",
		url: "https://gitlab.com/api/v4/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "beta",
		verification: "restricted",
		logoUrl: mcpIntegrationLogo("gitlab"),
		docsUrl: "https://docs.gitlab.com/user/model_context_protocol/mcp_server/",
		setupNoteKey: "mcpIntegrations.catalog.gitlab.setupNote",
		keywords: [
			"git",
			"repositories",
			"issues",
			"merge requests",
			"ci"
		]
	},
	{
		id: "figma",
		name: "Figma",
		provider: "figma",
		description: "Bring Figma design context and canvas actions into an agent.",
		descriptionKey: "mcpIntegrations.catalog.figma.description",
		useCase: "design files, components, variables, design systems, canvas",
		useCaseKey: "mcpIntegrations.catalog.figma.useCase",
		url: "https://mcp.figma.com/mcp",
		authMode: "oauth",
		connectionMode: "manual",
		availability: "client-restricted",
		verification: "restricted",
		logoUrl: mcpIntegrationLogo("figma"),
		docsUrl: "https://developers.figma.com/docs/figma-mcp-server/",
		setupNoteKey: "mcpIntegrations.catalog.figma.setupNote",
		apiFallback: {
			secretKey: "FIGMA_ACCESS_TOKEN",
			docsUrl: "https://developers.figma.com/docs/rest-api/personal-access-tokens/",
			templateUses: ["design"]
		},
		keywords: [
			"design",
			"figjam",
			"components",
			"variables",
			"canvas"
		]
	},
	{
		id: "canva",
		name: "Canva",
		provider: "canva",
		description: "Search, create, and update Canva designs and assets.",
		descriptionKey: "mcpIntegrations.catalog.canva.description",
		useCase: "designs, templates, assets, brand kits, exports, collaboration",
		useCaseKey: "mcpIntegrations.catalog.canva.useCase",
		url: "https://mcp.canva.com/mcp",
		authMode: "oauth",
		connectionMode: "manual",
		availability: "client-restricted",
		verification: "restricted",
		logoUrl: mcpIntegrationLogo("canva"),
		docsUrl: "https://www.canva.dev/docs/mcp/",
		setupNoteKey: "mcpIntegrations.catalog.canva.setupNote",
		keywords: [
			"design",
			"templates",
			"assets",
			"brand",
			"exports"
		]
	},
	{
		id: "vercel",
		name: "Vercel",
		provider: "vercel",
		description: "Search Vercel docs and inspect projects, deployments, and logs.",
		descriptionKey: "mcpIntegrations.catalog.vercel.description",
		useCase: "deployments, projects, logs, domains, hosting, documentation",
		useCaseKey: "mcpIntegrations.catalog.vercel.useCase",
		url: "https://mcp.vercel.com",
		authMode: "oauth",
		connectionMode: "manual",
		availability: "client-restricted",
		verification: "restricted",
		logoUrl: mcpIntegrationLogo("vercel"),
		docsUrl: "https://vercel.com/docs/agent-resources/vercel-mcp",
		setupNoteKey: "mcpIntegrations.catalog.vercel.setupNote",
		keywords: [
			"deployments",
			"hosting",
			"projects",
			"logs",
			"domains"
		]
	},
	{
		id: "github",
		name: "GitHub",
		provider: "github",
		description: "Read repositories, issues, pull requests, and code context.",
		descriptionKey: "mcpIntegrations.catalog.github.description",
		useCase: "repositories, issues, pull requests, code, engineering analytics",
		useCaseKey: "mcpIntegrations.catalog.github.useCase",
		url: "https://api.githubcopilot.com/mcp/",
		authMode: "headers",
		connectionMode: "headers",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("github"),
		docsUrl: "https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md",
		setupNoteKey: "mcpIntegrations.catalog.github.setupNote",
		headerPlaceholder: "Authorization: Bearer <github-token>",
		keywords: [
			"git",
			"repositories",
			"issues",
			"pull requests",
			"code"
		]
	},
	{
		id: "slack",
		name: "Slack",
		provider: "slack",
		description: "Search Slack conversations and take workspace actions.",
		descriptionKey: "mcpIntegrations.catalog.slack.description",
		useCase: "messages, channels, people, company memory, workflows",
		useCaseKey: "mcpIntegrations.catalog.slack.useCase",
		url: "https://mcp.slack.com/mcp",
		authMode: "oauth",
		connectionMode: "manual",
		availability: "client-restricted",
		verification: "restricted",
		logoUrl: mcpIntegrationLogo("slack"),
		docsUrl: "https://docs.slack.dev/ai/slack-mcp-server/",
		setupNoteKey: "mcpIntegrations.catalog.slack.setupNote",
		keywords: [
			"messages",
			"channels",
			"search",
			"people",
			"chat"
		]
	},
	{
		id: "asana",
		name: "Asana",
		provider: "asana",
		description: "Search and manage Asana tasks, projects, and work graph data.",
		descriptionKey: "mcpIntegrations.catalog.asana.description",
		useCase: "tasks, projects, portfolios, planning, workload",
		useCaseKey: "mcpIntegrations.catalog.asana.useCase",
		url: "https://mcp.asana.com/v2/mcp",
		authMode: "oauth",
		connectionMode: "manual",
		availability: "provider-setup",
		verification: "restricted",
		logoUrl: mcpIntegrationLogo("asana"),
		docsUrl: "https://developers.asana.com/docs/integrating-with-asanas-mcp-server",
		setupNoteKey: "mcpIntegrations.catalog.asana.setupNote",
		keywords: [
			"tasks",
			"projects",
			"planning",
			"workload",
			"portfolios"
		]
	},
	{
		id: "hubspot",
		name: "HubSpot",
		provider: "hubspot",
		description: "Search and update HubSpot CRM records.",
		descriptionKey: "mcpIntegrations.catalog.hubspot.description",
		useCase: "CRM, contacts, companies, deals, tickets, customer analytics",
		useCaseKey: "mcpIntegrations.catalog.hubspot.useCase",
		url: "https://mcp.hubspot.com",
		authMode: "oauth",
		connectionMode: "manual",
		availability: "provider-setup",
		verification: "restricted",
		logoUrl: mcpIntegrationLogo("hubspot"),
		managedOAuth: true,
		docsUrl: "https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server",
		setupNoteKey: "mcpIntegrations.catalog.hubspot.setupNote",
		keywords: [
			"crm",
			"contacts",
			"companies",
			"deals",
			"tickets"
		]
	},
	{
		id: "pylon",
		name: "Pylon",
		provider: "pylon",
		description: "Search and update Pylon support data.",
		descriptionKey: "mcpIntegrations.catalog.pylon.description",
		useCase: "customer support, issues, accounts, contacts, conversations",
		useCaseKey: "mcpIntegrations.catalog.pylon.useCase",
		url: "https://mcp.usepylon.com/",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "provider-setup",
		verification: "restricted",
		logoUrl: mcpIntegrationLogo("pylon"),
		docsUrl: "https://www.usepylon.com/integrations/mcp",
		setupNoteKey: "mcpIntegrations.catalog.pylon.setupNote",
		keywords: [
			"support",
			"issues",
			"accounts",
			"contacts",
			"conversations",
			"customer support"
		]
	},
	{
		id: "intercom",
		name: "Intercom",
		provider: "intercom",
		description: "Search conversations and customer support knowledge.",
		descriptionKey: "mcpIntegrations.catalog.intercom.description",
		useCase: "customer support, conversations, contacts, help center content",
		useCaseKey: "mcpIntegrations.catalog.intercom.useCase",
		url: "https://mcp.intercom.com/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("intercom"),
		docsUrl: "https://developers.intercom.com/docs/guides/mcp",
		setupNoteKey: "mcpIntegrations.catalog.intercom.setupNote",
		keywords: [
			"support",
			"conversations",
			"customers",
			"help center"
		]
	},
	{
		id: "monday",
		name: "monday.com",
		provider: "monday",
		description: "Work with boards, items, and team workflows.",
		descriptionKey: "mcpIntegrations.catalog.monday.description",
		useCase: "work management, boards, projects, tasks, team operations",
		useCaseKey: "mcpIntegrations.catalog.monday.useCase",
		url: "https://mcp.monday.com/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("monday"),
		docsUrl: "https://developer.monday.com/api-reference/docs/build-on-monday-with-ai",
		setupNoteKey: "mcpIntegrations.catalog.monday.setupNote",
		keywords: [
			"work management",
			"boards",
			"projects",
			"tasks",
			"teams"
		]
	},
	{
		id: "webflow",
		name: "Webflow",
		provider: "webflow",
		description: "Read and update Webflow sites and content.",
		descriptionKey: "mcpIntegrations.catalog.webflow.description",
		useCase: "websites, CMS, site content, publishing, design workflows",
		useCaseKey: "mcpIntegrations.catalog.webflow.useCase",
		url: "https://mcp.webflow.com/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("webflow"),
		docsUrl: "https://developers.webflow.com/mcp/reference/getting-started",
		setupNoteKey: "mcpIntegrations.catalog.webflow.setupNote",
		keywords: [
			"websites",
			"cms",
			"content",
			"publishing",
			"design"
		]
	},
	{
		id: "paypal",
		name: "PayPal",
		provider: "paypal",
		description: "Work with PayPal payments, invoices, and commerce data.",
		descriptionKey: "mcpIntegrations.catalog.paypal.description",
		useCase: "payments, invoices, transactions, merchant operations",
		useCaseKey: "mcpIntegrations.catalog.paypal.useCase",
		url: "https://mcp.paypal.com/sse",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("paypal"),
		docsUrl: "https://developer.paypal.com/ai-tools/mcp-server/",
		setupNoteKey: "mcpIntegrations.catalog.paypal.setupNote",
		keywords: [
			"payments",
			"invoices",
			"transactions",
			"commerce"
		]
	},
	{
		id: "box",
		name: "Box",
		provider: "box",
		description: "Search and manage files and folders in Box.",
		descriptionKey: "mcpIntegrations.catalog.box.description",
		useCase: "files, folders, enterprise content, search, collaboration",
		useCaseKey: "mcpIntegrations.catalog.box.useCase",
		url: "https://mcp.box.com",
		authMode: "oauth",
		connectionMode: "manual",
		availability: "provider-setup",
		verification: "restricted",
		logoUrl: mcpIntegrationLogo("box"),
		docsUrl: "https://developer.box.com/guides/box-mcp",
		setupNoteKey: "mcpIntegrations.catalog.box.setupNote",
		keywords: [
			"files",
			"folders",
			"documents",
			"enterprise content"
		],
		promptAliases: [
			"Box.com",
			"Box file",
			"Box files",
			"Box folder",
			"Box folders",
			"Box drive"
		]
	},
	{
		id: "builder-cms",
		name: "Builder.io Publish",
		provider: "builder",
		description: "Search Builder Publish and Hybrid Space content.",
		descriptionKey: "mcpIntegrations.catalog.builder.description",
		useCase: "content models, pages, entries, Publish and Hybrid Spaces",
		useCaseKey: "mcpIntegrations.catalog.builder.useCase",
		url: "https://mcp.builder.io/mcp/publish",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		supportsOrganizationScope: true,
		logoUrl: mcpIntegrationLogo("builder-cms"),
		docsUrl: "https://www.builder.io/c/docs/mcp-builder-server/",
		setupNoteKey: "mcpIntegrations.catalog.builder.setupNote",
		organizationScopeOnly: true,
		keywords: [
			"Builder",
			"content",
			"CMS",
			"pages",
			"models",
			"Publish",
			"Hybrid"
		]
	},
	{
		id: "netlify",
		name: "Netlify",
		provider: "netlify",
		description: "Inspect and operate Netlify sites and deployments.",
		descriptionKey: "mcpIntegrations.catalog.netlify.description",
		useCase: "sites, deployments, builds, domains, hosting operations",
		useCaseKey: "mcpIntegrations.catalog.netlify.useCase",
		url: "https://netlify-mcp.netlify.app/mcp",
		authMode: "oauth",
		connectionMode: "oauth",
		availability: "ready",
		verification: "preflight-only",
		logoUrl: mcpIntegrationLogo("netlify"),
		docsUrl: "https://docs.netlify.com/build/build-with-ai/agent-setup-guides/agent-setup-overview/",
		setupNoteKey: "mcpIntegrations.catalog.netlify.setupNote",
		keywords: [
			"deployments",
			"builds",
			"sites",
			"hosting",
			"domains"
		]
	},
	{
		id: "zapier",
		name: "Zapier",
		provider: "zapier",
		description: "Connect tools to thousands of app actions.",
		descriptionKey: "mcpIntegrations.catalog.zapier.description",
		useCase: "automation, workflows, app actions, cross-service operations",
		useCaseKey: "mcpIntegrations.catalog.zapier.useCase",
		url: "https://mcp.zapier.com/api/v1/connect",
		authMode: "headers",
		connectionMode: "headers",
		availability: "ready",
		verification: "restricted",
		logoUrl: mcpIntegrationLogo("zapier"),
		docsUrl: "https://help.zapier.com/hc/en-us/articles/36265392843917-Use-Zapier-MCP-with-your-client",
		setupNoteKey: "mcpIntegrations.catalog.zapier.setupNote",
		headerPlaceholder: "Authorization: Bearer <zapier-mcp-token>",
		keywords: [
			"automation",
			"workflows",
			"actions",
			"apps",
			"integrations"
		]
	}
];
function readRuntimeMcpIntegrationsConfig() {
	try {
		return normalizeMcpIntegrationsConfig({
			"enabled": true,
			"custom": true,
			"defaults": {
				"enabled": true,
				"exclude": []
			}
		});
	} catch {}
	return normalizeMcpIntegrationsConfig();
}
function normalizeTemplateName(value) {
	if (typeof value !== "string") return null;
	return value.trim().toLowerCase() || null;
}
function getActiveTemplateName() {
	try {
		const compiledTemplate = normalizeTemplateName("");
		if (compiledTemplate) return compiledTemplate;
	} catch {}
	const runtimeConfig = globalThis.__AGENT_NATIVE_CONFIG__;
	return normalizeTemplateName(runtimeConfig?.template);
}
function getMcpIntegrationApiFallback(integration, templateName = getActiveTemplateName()) {
	const fallback = integration.apiFallback;
	if (!fallback) return null;
	if (!fallback.templateUses?.length) return fallback;
	if (!templateName) return null;
	return fallback.templateUses.includes(templateName) ? fallback : null;
}
function normalizePresetConfig(config) {
	if (config === void 0) return readRuntimeMcpIntegrationsConfig();
	return normalizeMcpIntegrationsConfig(config);
}
function getDefaultMcpIntegrations(config, overrides = []) {
	const normalized = normalizePresetConfig(config);
	if (!normalized.enabled || !normalized.defaults.enabled) return [];
	const include = normalized.defaults.include ? new Set(normalized.defaults.include) : null;
	const exclude = new Set(normalized.defaults.exclude);
	return mergeDefaultMcpIntegrations(overrides).filter((integration) => {
		const id = integration.id.toLowerCase();
		if (include && !include.has(id)) return false;
		return !exclude.has(id);
	});
}
function mergeDefaultMcpIntegrations(overrides = []) {
	return mergeDefinitionsById(DEFAULT_MCP_INTEGRATIONS, overrides);
}
function isCustomMcpIntegrationEnabled(config) {
	const normalized = normalizePresetConfig(config);
	return normalized.enabled && normalized.custom;
}
/**
* Mirrors `resolveMcpOAuthScope` on the server, which keys its org-only rule on
* the server URL rather than on a catalog entry. Matching by URL also covers
* custom servers pasted by hand, which have no catalog entry to carry a flag.
*/
function mcpUrlRequiresOrganizationScope(rawUrl) {
	if (!URL.canParse(rawUrl)) return false;
	const url = new URL(rawUrl);
	return url.origin === "https://mcp.builder.io" && url.pathname.replace(/\/+$/, "") === "/mcp/publish" && !url.search && !url.hash;
}
function buildMcpOAuthStartUrl({ name, url, description, scope, returnUrl, trackingFlow, trackingIntegrationId }) {
	const params = new URLSearchParams({
		name,
		url,
		description,
		scope: mcpUrlRequiresOrganizationScope(url) ? "org" : scope,
		return: returnUrl,
		...trackingFlow ? { tracking_flow: trackingFlow } : {},
		...trackingIntegrationId ? { tracking_integration_id: trackingIntegrationId } : {}
	});
	return `${agentNativePath("/_agent-native/mcp/servers/oauth/start")}?${params.toString()}`;
}
function navigateToMcpOAuthStart(url) {
	if (typeof window === "undefined") return false;
	try {
		const popup = openOAuthPopup({
			initialUrl: url,
			features: "width=640,height=760"
		});
		if (!popup) return false;
		popup.opener = null;
		markMcpConnectionPending();
		return true;
	} catch (error) {
		console.error("Failed to open MCP OAuth popup.", error);
		return false;
	}
}
function resolveMcpIntegrationScope(defaultScope, hasOrg, canCreateOrgMcp, supportsOrganizationScope = true) {
	return defaultScope === "org" && hasOrg && canCreateOrgMcp && supportsOrganizationScope ? "org" : "user";
}
function shouldOfferMcpOrganizationScope(hasOrg, canCreateOrgMcp) {
	return hasOrg && canCreateOrgMcp;
}
function supportsMcpIntegrationOrganizationScope(integration) {
	return integration.supportsOrganizationScope === true && integration.managedOAuth !== true;
}
/**
* Mirrors the server's org-only rule in `resolveMcpOAuthScope`. Offering a
* personal connection the server will reject is what produced the misleading
* scope error users hit on Builder.io.
*/
function requiresMcpIntegrationOrganizationScope(integration) {
	return integration.organizationScopeOnly === true || mcpUrlRequiresOrganizationScope(integration.url);
}
function allowsMcpIntegrationPersonalScope(integration) {
	return !requiresMcpIntegrationOrganizationScope(integration);
}
function shouldOfferMcpIntegrationOrganizationScope(integration, hasOrg, canCreateOrgMcp) {
	return shouldOfferMcpOrganizationScope(hasOrg, canCreateOrgMcp) && supportsMcpIntegrationOrganizationScope(integration);
}
function filterMcpIntegrations(query, integrations = getDefaultMcpIntegrations()) {
	const needle = query.trim().toLowerCase();
	if (!needle) return integrations;
	return integrations.filter((integration) => {
		return [
			integration.name,
			integration.provider,
			integration.description,
			integration.useCase,
			integration.url,
			...integration.brandAliases ?? [],
			...integration.aliases ?? [],
			...integration.keywords
		].join(" ").toLowerCase().includes(needle);
	});
}
function isMcpIntegrationUrl(integration, serverUrl) {
	if (integration.url.trim()) return normalizeMcpUrl(integration.url) === normalizeMcpUrl(serverUrl);
	try {
		const hostname = new URL(serverUrl.trim()).hostname.toLowerCase();
		return (MCP_LINK_HOSTS[integration.id] ?? []).some((domain) => hostMatches(hostname, domain));
	} catch {
		return false;
	}
}
function createMcpIntegrationFormDefaults(integration) {
	if (!integration) return {
		name: "",
		url: "",
		description: "",
		headersText: ""
	};
	return {
		name: integration.name,
		url: integration.url,
		description: integration.description,
		headersText: ""
	};
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/resources/mcp-connection-resume.js
var MCP_CONNECTION_RESUME_EVENT = "agent-native:mcp-connection-complete";
function addMcpConnectionCompleteListener(listener) {
	if (typeof window === "undefined") return () => {};
	window.addEventListener(MCP_CONNECTION_RESUME_EVENT, listener);
	return () => window.removeEventListener(MCP_CONNECTION_RESUME_EVENT, listener);
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/resources/use-mcp-servers.js
/**
* React-query hooks for remote MCP servers surfaced inside the Workspace
* tab as a virtual `mcp-servers/` folder.
*
* MCP servers live in the settings store (user- and org-scope), not the
* resources table. These hooks wrap the existing `/_agent-native/mcp/servers`
* endpoints so the Workspace UI can list, create, and delete them with the
* same keys/invalidations the old Settings panel used.
*/
var ENDPOINT = agentNativePath("/_agent-native/mcp/servers");
var LIST_KEY = ["mcp-servers"];
var McpServersApiContext = (0, import_react.createContext)(null);
function useMcpServersApi() {
	return (0, import_react.useContext)(McpServersApiContext) ?? defaultMcpServersApi;
}
async function listMcpServers() {
	const res = await fetch(ENDPOINT, { credentials: "include" });
	if (!res.ok) throw new Error(`Failed to load (${res.status})`);
	return await res.json();
}
async function createMcpServer(args) {
	const res = await fetch(ENDPOINT, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(args)
	});
	const body = await res.json().catch((error) => {
		throw new Error("MCP create returned invalid JSON.", { cause: error });
	});
	if (!res.ok || !body.ok) throw new Error(body.error || `Create failed (${res.status})`);
	return body.server;
}
async function deleteMcpServer(args) {
	const res = await fetch(`${ENDPOINT}/${encodeURIComponent(args.id)}?scope=${args.scope}`, {
		method: "DELETE",
		credentials: "include",
		headers: { "Content-Type": "application/json" }
	});
	const body = await res.json().catch((error) => {
		throw new Error("MCP delete returned invalid JSON.", { cause: error });
	});
	if (!res.ok || !body.ok) throw new Error(body.error || `Delete failed (${res.status})`);
}
async function reconnectMcpServer(args) {
	const res = await fetch(reconnectMcpServerUrl(args), {
		method: "POST",
		credentials: "include"
	});
	const body = await readMcpMutationBody(res);
	const error = typeof body?.error === "string" && body.error.trim() ? body.error.trim() : void 0;
	if (!res.ok || body?.ok !== true) throw new Error(error || `Reconnect failed (${res.status})`);
}
async function testExistingMcpServer(args) {
	const res = await fetch(agentNativePath(`/_agent-native/mcp/servers/${encodeURIComponent(args.id)}/test?scope=${args.scope}`), {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" }
	});
	const body = await res.json().catch((error) => {
		throw new Error("MCP test returned invalid JSON.", { cause: error });
	});
	return res.ok ? body : {
		ok: false,
		error: body.error
	};
}
var defaultMcpServersApi = {
	list: listMcpServers,
	create: createMcpServer,
	delete: deleteMcpServer,
	reconnect: reconnectMcpServer,
	test: testMcpServerUrl,
	testExisting: testExistingMcpServer
};
function useMcpServers(options = {}) {
	const api = useMcpServersApi();
	const defer = options.defer === true;
	const afterPaint = useAfterPaint();
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const revalidate = () => {
			if (!hasPendingMcpConnection()) return;
			qc.invalidateQueries({ queryKey: LIST_KEY });
		};
		const onVisibility = () => {
			if (document.visibilityState === "visible") revalidate();
		};
		window.addEventListener("focus", revalidate);
		document.addEventListener("visibilitychange", onVisibility);
		const removeCompleteListener = addMcpConnectionCompleteListener(revalidate);
		return () => {
			window.removeEventListener("focus", revalidate);
			document.removeEventListener("visibilitychange", onVisibility);
			removeCompleteListener();
		};
	}, [qc]);
	return useQuery({
		queryKey: LIST_KEY,
		queryFn: api.list,
		staleTime: 1e4,
		enabled: defer ? afterPaint : true
	});
}
function useCreateMcpServer() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: useMcpServersApi().create,
		onSuccess: () => qc.invalidateQueries({ queryKey: LIST_KEY })
	});
}
async function readMcpMutationBody(res) {
	const text = (await res.text()).trim();
	if (!text) return null;
	try {
		return JSON.parse(text);
	} catch (cause) {
		throw new Error(`Reconnect response was not valid JSON (HTTP ${res.status}).`, { cause });
	}
}
function reconnectMcpServerUrl(args) {
	return `${ENDPOINT}/${encodeURIComponent(args.id)}/reconnect?scope=${args.scope}`;
}
function getMcpUrlValidationError(rawUrl) {
	const trimmed = rawUrl.trim();
	if (!trimmed) return "Enter the Streamable HTTP agent integration URL.";
	let url;
	try {
		url = new URL(trimmed);
	} catch {
		return "Enter a full URL, including https://.";
	}
	if (url.protocol !== "https:" && url.protocol !== "http:") return "Agent integration URLs must start with https://.";
	if (url.protocol === "http:" && !["localhost", "127.0.0.1"].includes(url.hostname)) return "Use https:// for remote agent integrations. Plain http:// is only allowed for localhost.";
	return null;
}
function formatMcpServerError(error) {
	const text = (typeof error === "string" ? error : error instanceof Error ? error.message : String(error ?? "")).trim();
	if (!text) return "Could not connect to that agent integration.";
	if (/<!doctype|<html[\s>]|<\/html>|unexpected token '<'|is not valid json/i.test(text)) return "That URL returned a web page instead of an MCP response. Check that you pasted the Streamable HTTP endpoint, often ending in /mcp.";
	if (/streamable http/i.test(text) && /error|failed|non-200|status/i.test(text)) return "The server did not complete the Streamable HTTP MCP handshake. Check the URL and any required authorization headers.";
	if (/failed to fetch|fetch failed|networkerror|econnrefused|enotfound|timed out/i.test(text)) return "Could not reach that agent integration. Check the URL and make sure it is publicly reachable from this app.";
	if (/401|403|unauthorized|forbidden/i.test(text)) return "The agent integration rejected the request. Add or update the required Authorization header.";
	if (/404|not found|405|method not allowed/i.test(text)) return "That URL is reachable, but it does not look like the MCP endpoint. Check the server's Streamable HTTP path.";
	return text.length > 240 ? `${text.slice(0, 237).trimEnd()}...` : text;
}
function formatMcpServersLoadError(error) {
	const text = (typeof error === "string" ? error : error instanceof Error ? error.message : String(error ?? "")).trim();
	if (!text) return "Could not load agent integrations.";
	if (/401|unauthorized|signed-in workspace app|workspace app/i.test(text)) return "Sign in to a workspace app, then retry loading agent integrations.";
	return text.length > 240 ? `${text.slice(0, 237).trimEnd()}...` : text;
}
async function testMcpServerUrl(url, headers) {
	const validationError = getMcpUrlValidationError(url);
	if (validationError) return {
		ok: false,
		error: validationError
	};
	const res = await fetch(`${ENDPOINT}/test`, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			url,
			headers
		})
	});
	const body = await res.json().catch(() => ({}));
	if (!res.ok) return {
		ok: false,
		error: formatMcpServerError(body.error || "Test failed")
	};
	return body.ok === false ? {
		...body,
		error: formatMcpServerError(body.error)
	} : body;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/changelog/parse.js
var ISO_DATE = /(\d{4}-\d{2}-\d{2})/;
/** Lowercase, hyphenate, and strip to a URL/id-safe slug. */
function changelogSlug(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}
/**
* Parse a CHANGELOG.md document into structured release entries.
*
* Tolerant by design: an empty or malformed file yields an empty list rather
* than throwing, so a missing/partial changelog never breaks the UI.
*/
function parseChangelog(markdown) {
	if (!markdown || typeof markdown !== "string") return [];
	const lines = markdown.split(/\r?\n/);
	const entries = [];
	const seenIds = /* @__PURE__ */ new Set();
	let currentTitle = null;
	let bodyLines = [];
	const flush = () => {
		if (currentTitle === null) return;
		const title = currentTitle.trim();
		const date = title.match(ISO_DATE)?.[1];
		const version = title.match(/v?\d+\.\d+(?:\.\d+)?/)?.[0];
		let base = changelogSlug(title) || "entry";
		let id = base;
		let n = 2;
		while (seenIds.has(id)) id = `${base}-${n++}`;
		seenIds.add(id);
		entries.push({
			id,
			title,
			date,
			version: version && version !== date ? version : void 0,
			body: bodyLines.join("\n").trim()
		});
		currentTitle = null;
		bodyLines = [];
	};
	for (const line of lines) {
		const match = /^##\s+(?!#)(.+?)\s*$/.exec(line);
		if (match) {
			flush();
			currentTitle = stripBrackets(match[1]);
			continue;
		}
		if (currentTitle === null) continue;
		bodyLines.push(line);
	}
	flush();
	return entries;
}
/** `## [1.2.0]` → `1.2.0`; leaves un-bracketed headings untouched. */
function stripBrackets(title) {
	return title.replace(/^\[(.+?)\]\s*/, "$1 ").trim();
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/agent-native-version.js
function readPackageVersions(value) {
	if (!value || typeof value !== "object") return {};
	return Object.fromEntries(Object.entries(value).filter(([name, version]) => name.startsWith("@agent-native/") && typeof version === "string" && version.trim().length > 0).map(([name, version]) => [name, version.trim()]));
}
function injectedPackageVersions() {
	return readPackageVersions({
		"@agent-native/core": "0.182.1",
		"@agent-native/recap-cli": "0.5.34",
		"@agent-native/toolkit": "0.20.4"
	});
}
function getAgentNativePackageVersions() {
	return Object.entries(injectedPackageVersions()).sort(([left], [right]) => left.localeCompare(right)).map(([name, version]) => ({
		name,
		version
	}));
}
function getAgentNativeDiagnostics() {
	return {
		buildId: clientBuildId() || "development",
		environment: injectedAgentNativeConfig().deployment?.environment ?? "unknown",
		packages: Object.fromEntries(getAgentNativePackageVersions().map(({ name, version }) => [name, version]))
	};
}
function formatAgentNativeDiagnostics() {
	return JSON.stringify(getAgentNativeDiagnostics(), null, 2);
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/AboutAgentNativeDialog.js
function AboutAgentNativeDialog({ open, onOpenChange }) {
	const t = useT();
	const [copyState, setCopyState] = (0, import_react.useState)("idle");
	const copyResetTimer = (0, import_react.useRef)(null);
	const packageVersions = getAgentNativePackageVersions();
	const diagnostics = (0, import_react.useMemo)(() => formatAgentNativeDiagnostics(), []);
	const { buildId, environment } = getAgentNativeDiagnostics();
	(0, import_react.useEffect)(() => {
		if (!open) setCopyState("idle");
	}, [open]);
	(0, import_react.useEffect)(() => () => {
		if (copyResetTimer.current !== null) window.clearTimeout(copyResetTimer.current);
	}, []);
	const handleCopy = async () => {
		const didCopy = await writeClipboardText(diagnostics);
		setCopyState(didCopy ? "copied" : "failed");
		if (copyResetTimer.current !== null) window.clearTimeout(copyResetTimer.current);
		copyResetTimer.current = window.setTimeout(() => {
			setCopyState("idle");
			copyResetTimer.current = null;
		}, 1600);
	};
	return (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: (0, import_jsx_runtime.jsxs)(DialogContent, {
			"aria-describedby": void 0,
			className: "max-w-md gap-5",
			children: [
				(0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2 text-base",
					children: [(0, import_jsx_runtime.jsx)(IconCode, { className: "size-4 text-muted-foreground" }), t("agentChat.aboutAgentNative.title", { defaultValue: "About Agent-Native" })]
				}),
				(0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-md border border-border",
					children: packageVersions.length > 0 ? packageVersions.map(({ name, version }) => (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 border-b border-border px-3 py-2 last:border-b-0",
						children: [(0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 truncate font-mono text-xs text-foreground",
							children: name
						}), (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 font-mono text-xs text-muted-foreground",
							children: [(0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: t("agentChat.aboutAgentNative.version", { defaultValue: "Version" })
							}), version]
						})]
					}, name)) : (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 py-2 font-mono text-xs text-muted-foreground",
						children: [
							"@agent-native/core -",
							" ",
							t("agentChat.aboutAgentNative.unknown", { defaultValue: "Unknown" })
						]
					})
				}),
				(0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-2 text-xs",
					children: [(0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4",
						children: [(0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: t("agentChat.aboutAgentNative.environment", { defaultValue: "Environment" })
						}), (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono text-foreground",
							children: environment
						})]
					}), (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4",
						children: [(0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: t("agentChat.aboutAgentNative.build", { defaultValue: "Build" })
						}), (0, import_jsx_runtime.jsx)("dd", {
							className: "max-w-[16rem] truncate font-mono text-foreground",
							children: buildId
						})]
					})]
				}),
				(0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					onClick: () => void handleCopy(),
					type: "button",
					variant: "outline",
					children: [copyState === "copied" ? (0, import_jsx_runtime.jsx)(IconCheck, {}) : copyState === "failed" ? (0, import_jsx_runtime.jsx)(IconX, {}) : (0, import_jsx_runtime.jsx)(IconCopy, {}), copyState === "copied" ? t("agentChat.common.copied", { defaultValue: "Copied" }) : copyState === "failed" ? t("agentChat.recovery.copyFailed", { defaultValue: "Copy failed" }) : t("agentChat.aboutAgentNative.copyDiagnostics", { defaultValue: "Copy diagnostics" })]
				})
			]
		})
	});
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/HighlightedCodeBlock.js
/**
* Shared debounced syntax-highlighted code block.
*
* Performance characteristics vs the old per-site implementations:
* - While code is still growing (streaming), Shiki re-highlight is debounced
*   to ~150 ms (trailing).  Between debounce fires the previous highlighted
*   HTML is kept — no blank flash.
* - A content hash gate means identical re-renders never re-invoke Shiki.
* - A final highlight is triggered immediately when streaming ends (caller
*   passes streaming=false).
* - Non-streaming first paint waits for Shiki (invisible placeholder reserves
*   space) so the UI never snaps from plain text to highlighted HTML.
*
* Usage:
*   <HighlightedCodeBlock code={code} lang="typescript" containerClass="agent-markdown-shiki" />
*/
var LANG_ALIASES = {
	js: "javascript",
	ts: "typescript",
	sh: "bash",
	shell: "bash",
	zsh: "bash",
	py: "python",
	yml: "yaml",
	md: "markdown",
	bq: "sql",
	bigquery: "sql"
};
var DEBOUNCE_MS = 150;
function hashString(s) {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
	return h;
}
function HighlightedCodeBlock$1({ code, lang, containerClass, streaming = false, loadHighlighter }) {
	const [html, setHtml] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const renderedHashRef = (0, import_react.useRef)(null);
	const debounceTimerRef = (0, import_react.useRef)(null);
	const cancelledRef = (0, import_react.useRef)(false);
	const hasPaintedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		cancelledRef.current = false;
		return () => {
			cancelledRef.current = true;
			if (debounceTimerRef.current !== null) {
				clearTimeout(debounceTimerRef.current);
				debounceTimerRef.current = null;
			}
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const contentHash = hashString(lang + "\0" + code);
		if (renderedHashRef.current === contentHash) return;
		const doHighlight = () => {
			loadHighlighter().then((highlighter) => {
				const requested = (lang || "text").toLowerCase();
				const resolved = LANG_ALIASES[requested] ?? requested;
				const finalLang = highlighter.getLoadedLanguages().includes(resolved) ? resolved : "text";
				return highlighter.codeToHtml(code, {
					lang: finalLang,
					themes: {
						light: "github-light-default",
						dark: "github-dark-default"
					},
					defaultColor: false
				});
			}).then((out) => {
				if (!cancelledRef.current) {
					renderedHashRef.current = contentHash;
					setFailed(false);
					setHtml(out);
				}
			}).catch(() => {
				if (!cancelledRef.current) {
					renderedHashRef.current = contentHash;
					setFailed(true);
					setHtml(null);
				}
			});
		};
		if (debounceTimerRef.current !== null) {
			clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = null;
		}
		if (streaming) debounceTimerRef.current = setTimeout(() => {
			debounceTimerRef.current = null;
			doHighlight();
		}, DEBOUNCE_MS);
		else doHighlight();
	}, [
		code,
		lang,
		streaming,
		loadHighlighter
	]);
	if (html) {
		hasPaintedRef.current = true;
		return (0, import_jsx_runtime.jsx)("div", {
			className: containerClass,
			dangerouslySetInnerHTML: { __html: html }
		});
	}
	const showPlain = streaming || failed || hasPaintedRef.current;
	if (showPlain) hasPaintedRef.current = true;
	return (0, import_jsx_runtime.jsx)("div", {
		className: containerClass,
		"aria-busy": !showPlain && !failed,
		children: (0, import_jsx_runtime.jsx)("pre", { children: (0, import_jsx_runtime.jsx)("code", {
			className: lang ? `language-${lang}` : void 0,
			style: showPlain ? void 0 : { visibility: "hidden" },
			children: code
		}) })
	});
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/IframeEmbed.js
var ALLOWED_ASPECTS = /* @__PURE__ */ new Set([
	"16/9",
	"4/3",
	"1/1",
	"21/9",
	"3/2",
	"2/1"
]);
function isSameOriginSrc(src) {
	if (typeof window === "undefined") return false;
	const trimmed = src.trim();
	if (!trimmed) return false;
	if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:")) return false;
	if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
	if (trimmed.startsWith("./") || trimmed.startsWith("../")) return true;
	try {
		return new URL(trimmed, window.location.origin).origin === window.location.origin;
	} catch {
		return false;
	}
}
function aspectToPaddingBottom(aspect) {
	const [w, h] = aspect.split("/").map((n) => Number(n.trim()));
	if (!w || !h) return "56.25%";
	return `${h / w * 100}%`;
}
/**
* Parses the body of a ```embed fenced block. Accepts simple `key: value`
* lines, ignoring blanks and unknown keys. No YAML — keeps the surface small.
*/
function parseEmbedBody(body) {
	const out = {};
	for (const raw of body.split(/\r?\n/)) {
		const line = raw.trim();
		if (!line || line.startsWith("#")) continue;
		const idx = line.indexOf(":");
		if (idx <= 0) continue;
		const key = line.slice(0, idx).trim().toLowerCase();
		const value = line.slice(idx + 1).trim();
		if (!value) continue;
		if (key === "src") out.src = value;
		else if (key === "aspect") out.aspect = value;
		else if (key === "title") out.title = value;
		else if (key === "height") {
			const n = Number(value);
			if (Number.isFinite(n) && n > 0) out.height = n;
		}
	}
	return out;
}
function BlockedEmbed({ reason, src }) {
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "my-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground flex items-start gap-2",
		children: [(0, import_jsx_runtime.jsx)(IconAlertTriangle, { className: "h-3.5 w-3.5 shrink-0 mt-0.5" }), (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				(0, import_jsx_runtime.jsx)("div", {
					className: "font-medium text-foreground",
					children: "Embed blocked"
				}),
				(0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5",
					children: reason
				}),
				src && (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 font-mono text-[10px] truncate",
					children: src
				})
			]
		})]
	});
}
/**
* Inline iframe embed for assistant chat. Rendered from a ```embed fenced
* code block. Same-origin paths only; sandboxed.
*/
function IframeEmbed({ src, aspect, title, height }) {
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const iframeRef = (0, import_react.useRef)(null);
	const resolvedAspect = aspect && ALLOWED_ASPECTS.has(aspect) ? aspect : "16/9";
	const displayTitle = title?.trim() || "Embedded content";
	const paddingBottom = (0, import_react.useMemo)(() => aspectToPaddingBottom(resolvedAspect), [resolvedAspect]);
	(0, import_react.useEffect)(() => {
		function onMessage(e) {
			if (e.origin !== window.location.origin) return;
			const iframe = iframeRef.current;
			if (!iframe || e.source !== iframe.contentWindow) return;
			const data = e.data;
			if (!data || data.type !== "agent-native:navigate") return;
			if (typeof data.path !== "string" || !data.path.startsWith("/")) return;
			if (data.path.startsWith("//")) return;
			window.history.pushState({}, "", data.path);
			window.dispatchEvent(new PopStateEvent("popstate"));
		}
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	}, []);
	if (!src) return (0, import_jsx_runtime.jsx)(BlockedEmbed, { reason: "Missing src" });
	if (!isSameOriginSrc(src)) return (0, import_jsx_runtime.jsx)(BlockedEmbed, {
		reason: "Cross-origin URL not allowed",
		src
	});
	const style = height ? { height: `${height}px` } : { paddingBottom };
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "my-2 w-full overflow-hidden rounded-lg border border-border bg-background/60",
		children: [(0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-8 items-center gap-2 border-b border-border bg-muted/30 px-3 py-1.5",
			children: [
				(0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 text-[10px] font-medium uppercase text-muted-foreground",
					children: "Preview"
				}),
				(0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "h-3 w-px shrink-0 bg-border"
				}),
				(0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground",
					title: displayTitle,
					children: displayTitle
				})
			]
		}), (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full bg-muted/20",
			style,
			children: [!loaded && (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 animate-pulse bg-muted/40" }), (0, import_jsx_runtime.jsx)("iframe", {
				ref: iframeRef,
				src,
				title: displayTitle,
				sandbox: "allow-scripts allow-same-origin allow-forms allow-popups",
				referrerPolicy: "same-origin",
				loading: "lazy",
				onLoad: () => setLoaded(true),
				className: "absolute inset-0 h-full w-full border-0 bg-transparent"
			})]
		})]
	});
}
var LEGACY_CHART_PALETTE = [
	"#6366f1",
	"#22c55e",
	"#f59e0b",
	"#ef4444",
	"#0ea5e9",
	"#a855f7"
];
var SAFE_HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;
var BACKSLASH = String.fromCharCode(92);
var MAX_LINE_LENGTH = 2e4;
var MAX_LABELS = 60;
var MAX_SERIES = 6;
function extractBalancedArrayAt(text, startIndex) {
	if (text[startIndex] !== "[") return null;
	let depth = 0;
	let inString = false;
	for (let idx = startIndex; idx < text.length; idx++) {
		const ch = text[idx];
		if (inString) {
			if (ch === "\\") idx++;
			else if (ch === "\"") inString = false;
			continue;
		}
		if (ch === "\"") inString = true;
		else if (ch === "[" || ch === "{") depth++;
		else if (ch === "]" || ch === "}") {
			depth--;
			if (depth === 0) return text.slice(startIndex, idx + 1);
		}
	}
	return null;
}
function computeStringMask(text) {
	const mask = new Array(text.length).fill(false);
	let inString = false;
	for (let i = 0; i < text.length; i++) {
		mask[i] = inString;
		const ch = text[i];
		if (inString) {
			if (ch === BACKSLASH) {
				i++;
				if (i < text.length) mask[i] = true;
				continue;
			}
			if (ch === "\"") inString = false;
		} else if (ch === "\"") inString = true;
	}
	return mask;
}
function extractArrayForKey(text, key) {
	const mask = computeStringMask(text);
	const re = new RegExp(`\\b${key}=`, "g");
	let match;
	while (match = re.exec(text)) {
		if (mask[match.index]) continue;
		let idx = match.index + match[0].length;
		while (idx < text.length && /\s/.test(text[idx])) idx++;
		const arr = extractBalancedArrayAt(text, idx);
		if (arr) return arr;
	}
	return null;
}
function extractLegacyChartTitle(text) {
	const match = /\btitle=/.exec(text);
	if (!match) return "";
	let idx = match.index + match[0].length;
	const quoteChar = text[idx];
	if (quoteChar !== "\"" && quoteChar !== "'") return "";
	idx++;
	let result = "";
	while (idx < text.length) {
		const ch = text[idx];
		if (ch === BACKSLASH && idx + 1 < text.length) {
			const next = text[idx + 1];
			if (next === quoteChar || next === BACKSLASH) {
				result += next;
				idx += 2;
				continue;
			}
		}
		if (ch === quoteChar) return result;
		result += ch;
		idx++;
	}
	return "";
}
/**
* Cheap-ish pre-check so callers can skip the full parse on ordinary text.
* Requires `labels=`/`data=` to actually resolve to bracketed arrays (not
* just appear as substrings) so unrelated slash commands or API paths that
* happen to mention both words aren't diverted out of normal markdown
* rendering.
*/
function looksLikeLegacyChartShorthand(line) {
	const trimmed = line.trim();
	if (trimmed.length === 0 || trimmed.length > MAX_LINE_LENGTH) return false;
	if (!/^\/[a-zA-Z][\w-]*\b/.test(trimmed)) return false;
	if (!/\blabels=/.test(trimmed) || !/\bdata=/.test(trimmed)) return false;
	return extractArrayForKey(trimmed, "labels") !== null && extractArrayForKey(trimmed, "data") !== null;
}
function parseLegacyChartShorthand(rawLine) {
	const trimmed = rawLine.trim();
	if (!looksLikeLegacyChartShorthand(trimmed)) return null;
	const chartType = trimmed.match(/\btype=(bar|line|area)\b/i)?.[1].toLowerCase() || "bar";
	const chartTitle = extractLegacyChartTitle(trimmed);
	const labelsRaw = extractArrayForKey(trimmed, "labels");
	const dataRaw = extractArrayForKey(trimmed, "data");
	if (!labelsRaw || !dataRaw) return null;
	let parsedLabels;
	let parsedData;
	try {
		parsedLabels = JSON.parse(labelsRaw);
		parsedData = JSON.parse(dataRaw);
	} catch {
		return null;
	}
	if (!Array.isArray(parsedLabels) || parsedLabels.length === 0 || parsedLabels.length > MAX_LABELS || !parsedLabels.every((l) => [
		"string",
		"number",
		"boolean"
	].includes(typeof l))) return null;
	const safeLabels = parsedLabels.map((l) => String(l));
	const isValidSeriesData = (values) => Array.isArray(values) && values.length === safeLabels.length && values.every((v) => typeof v === "number" && Number.isFinite(v) && v >= 0);
	const colorMatch = trimmed.match(/(?:^|\s)color=(#[0-9a-fA-F]{3,8})\b/);
	const topLevelColor = colorMatch && SAFE_HEX_COLOR.test(colorMatch[1]) ? colorMatch[1] : void 0;
	let chartSeries;
	if (isValidSeriesData(parsedData)) chartSeries = [{
		label: chartTitle || "Value",
		data: parsedData,
		color: topLevelColor
	}];
	else if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData.length <= MAX_SERIES && parsedData.every((d) => d && typeof d === "object" && isValidSeriesData(d.data))) chartSeries = parsedData.map((d, idx) => ({
		label: typeof d.label === "string" ? d.label : `Series ${idx + 1}`,
		data: d.data,
		color: typeof d.color === "string" && SAFE_HEX_COLOR.test(d.color) ? d.color : void 0
	}));
	else return null;
	if (chartSeries.length === 0) return null;
	return {
		type: chartType,
		title: chartTitle,
		labels: safeLabels,
		series: chartSeries
	};
}
function wrapLegacyChartShorthandLines(markdown) {
	if (!markdown.includes("labels=") || !markdown.includes("data=")) return markdown;
	let fenceMarker = "";
	const lines = markdown.split("\n");
	const out = [];
	for (const line of lines) {
		if (/^(?: {4}|\t)/.test(line)) {
			out.push(line);
			continue;
		}
		const trimmed = line.trimStart();
		if (fenceMarker) {
			out.push(line);
			const closeMatch = /^(`{3,}|~{3,})\s*$/.exec(trimmed);
			if (closeMatch && closeMatch[1].charAt(0) === fenceMarker.charAt(0) && closeMatch[1].length >= fenceMarker.length) fenceMarker = "";
			continue;
		}
		const openMatch = /^(`{3,}|~{3,})/.exec(trimmed);
		if (openMatch) {
			fenceMarker = openMatch[1].charAt(0).repeat(openMatch[1].length);
			out.push(line);
			continue;
		}
		if (looksLikeLegacyChartShorthand(line)) {
			const leadingWs = line.match(/^\s*/)?.[0] ?? "";
			out.push(leadingWs + "```chart-shorthand", leadingWs + line.trim(), leadingWs + "```");
			continue;
		}
		out.push(line);
	}
	return out.join("\n");
}
function LegacyChartShorthandFallback({ text }) {
	return (0, import_jsx_runtime.jsx)("span", {
		style: { whiteSpace: "pre-wrap" },
		children: text
	});
}
function LegacyChartShorthandChart({ parsed }) {
	const { title, labels, series, type } = parsed;
	const width = 640;
	const height = 280;
	const padding = {
		top: 16,
		right: 16,
		bottom: 44,
		left: 48
	};
	const innerW = width - padding.left - padding.right;
	const innerH = height - padding.top - padding.bottom;
	const maxVal = Math.max(1, series.reduce((acc, s) => s.data.reduce((seriesAcc, v) => Math.max(seriesAcc, v), acc), 0));
	const groupW = innerW / labels.length;
	const gridLineCount = 4;
	const gridLines = Array.from({ length: 5 }, (_, g) => {
		return {
			y: padding.top + innerH * g / gridLineCount,
			val: Math.round(maxVal - maxVal * g / gridLineCount)
		};
	});
	const colorFor = (s, si) => s.color || LEGACY_CHART_PALETTE[si % LEGACY_CHART_PALETTE.length];
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "my-4 rounded-lg border border-border bg-muted/20 p-3",
		children: [
			title && (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-sm font-medium text-foreground",
				children: title
			}),
			(0, import_jsx_runtime.jsxs)("svg", {
				viewBox: `0 0 ${width} ${height}`,
				className: "w-full text-muted-foreground",
				role: "img",
				"aria-label": title || "Chart",
				children: [
					gridLines.map(({ y, val }, i) => (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [(0, import_jsx_runtime.jsx)("line", {
						x1: padding.left,
						y1: y,
						x2: width - padding.right,
						y2: y,
						stroke: "currentColor",
						strokeOpacity: .1
					}), (0, import_jsx_runtime.jsx)("text", {
						x: padding.left - 8,
						y: y + 4,
						textAnchor: "end",
						fontSize: 10,
						fill: "currentColor",
						fillOpacity: .6,
						children: val
					})] }, i)),
					type === "bar" && labels.map((_, li) => {
						const groupPad = groupW * .15;
						const barW = (groupW - groupPad * 2) / series.length;
						return series.map((s, si) => {
							const value = s.data[li] ?? 0;
							const barH = Math.max(0, value) / maxVal * innerH;
							return (0, import_jsx_runtime.jsx)("rect", {
								x: padding.left + li * groupW + groupPad + si * barW,
								y: padding.top + (innerH - barH),
								width: Math.max(1, barW - 2),
								height: Math.max(0, barH),
								fill: colorFor(s, si),
								rx: 2
							}, `${li}-${si}`);
						});
					}),
					type !== "bar" && series.map((s, si) => {
						const coords = labels.map((_, li) => {
							const value = s.data[li] ?? 0;
							return {
								x: padding.left + groupW * li + groupW / 2,
								y: padding.top + innerH - Math.max(0, value) / maxVal * innerH
							};
						});
						if (coords.length === 1) return (0, import_jsx_runtime.jsx)("circle", {
							cx: coords[0].x,
							cy: coords[0].y,
							r: 4,
							fill: colorFor(s, si)
						}, si);
						const points = coords.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
						const baseY = padding.top + innerH;
						const firstX = padding.left + groupW / 2;
						const lastX = padding.left + groupW * (labels.length - 1) + groupW / 2;
						return (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [type === "area" && (0, import_jsx_runtime.jsx)("polygon", {
							points: `${firstX.toFixed(1)},${baseY.toFixed(1)} ${points} ${lastX.toFixed(1)},${baseY.toFixed(1)}`,
							fill: colorFor(s, si),
							fillOpacity: .15
						}), (0, import_jsx_runtime.jsx)("polyline", {
							points,
							fill: "none",
							stroke: colorFor(s, si),
							strokeWidth: 2
						})] }, si);
					}),
					labels.map((label, li) => {
						return (0, import_jsx_runtime.jsx)("text", {
							x: padding.left + groupW * li + groupW / 2,
							y: height - padding.bottom + 16,
							textAnchor: "middle",
							fontSize: 10,
							fill: "currentColor",
							fillOpacity: .7,
							children: label.length > 12 ? `${label.slice(0, 11)}...` : label
						}, li);
					})
				]
			}),
			series.length > 1 && (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground",
				children: series.map((s, si) => (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [(0, import_jsx_runtime.jsx)("span", {
						className: "inline-block h-2 w-2 rounded-full",
						style: { background: colorFor(s, si) }
					}), s.label]
				}, si))
			})
		]
	});
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/chat/markdown-renderer.js
var markdownModule = null;
var remarkGfmFn = null;
var markdownListeners = /* @__PURE__ */ new Set();
function loadMarkdown() {
	if (markdownModule !== null) return;
	Promise.all([
		import("./react-markdown-CYQDe90V.js"),
		import("./remark-gfm-BU6itDjT.js"),
		import("./server.node-CHCCbX-P.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1))
	]).then(([md, gfm, server]) => {
		markdownModule = md;
		remarkGfmFn = gfm.default;
		server.renderToStaticMarkup;
		markdownListeners.forEach((fn) => fn());
		markdownListeners.clear();
	});
}
function onMarkdownReady(fn) {
	if (markdownModule !== null) {
		fn();
		return () => {};
	}
	markdownListeners.add(fn);
	return () => markdownListeners.delete(fn);
}
loadMarkdown();
var highlighterLoader = null;
function loadHighlighter() {
	if (!highlighterLoader) highlighterLoader = (async () => {
		const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([import("./_agent-native-ssr-stub-wXszwpEU.js"), import("./_agent-native-ssr-stub-wXszwpEU.js")]);
		return createHighlighterCore({
			themes: [import("./_agent-native-ssr-stub-wXszwpEU.js"), import("./_agent-native-ssr-stub-wXszwpEU.js")],
			langs: [
				import("./_agent-native-ssr-stub-wXszwpEU.js"),
				import("./_agent-native-ssr-stub-wXszwpEU.js"),
				import("./_agent-native-ssr-stub-wXszwpEU.js"),
				import("./_agent-native-ssr-stub-wXszwpEU.js"),
				import("./_agent-native-ssr-stub-wXszwpEU.js"),
				import("./_agent-native-ssr-stub-wXszwpEU.js"),
				import("./_agent-native-ssr-stub-wXszwpEU.js"),
				import("./_agent-native-ssr-stub-wXszwpEU.js"),
				import("./_agent-native-ssr-stub-wXszwpEU.js"),
				import("./_agent-native-ssr-stub-wXszwpEU.js"),
				import("./_agent-native-ssr-stub-wXszwpEU.js"),
				import("./_agent-native-ssr-stub-wXszwpEU.js"),
				import("./_agent-native-ssr-stub-wXszwpEU.js")
			],
			engine: createJavaScriptRegexEngine({ forgiving: true })
		});
	})().catch((error) => {
		highlighterLoader = null;
		throw error;
	});
	return highlighterLoader;
}
var TextStreamingContext = import_react.createContext(false);
import_react.createContext(false);
import_react.createContext(void 0);
import_react.createContext(null);
function HighlightedCodeBlock({ code, lang }) {
	return (0, import_jsx_runtime.jsx)(HighlightedCodeBlock$1, {
		code,
		lang,
		containerClass: "agent-markdown-shiki",
		streaming: import_react.useContext(TextStreamingContext),
		loadHighlighter
	});
}
var CTA_BUTTON_CLASSES = "agent-markdown-cta mt-1 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background no-underline shadow-sm transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer";
function isBuilderErrorCtaHref(href) {
	if (!href) return false;
	try {
		const url = new URL(href);
		if (url.protocol !== "https:" || url.hostname !== "builder.io") return false;
		return url.origin === "https://builder.io" && url.pathname === "/account/space" || url.pathname === "/account/billing" || url.pathname === "/account/subscription" || /^\/app\/organizations\/[^/]+\/billing$/.test(url.pathname);
	} catch {
		return false;
	}
}
function markdownUrlTransform(value) {
	if (value === "agent-native:new-chat") return value;
	if (!markdownModule) return value;
	return markdownModule.defaultUrlTransform(value);
}
function extractCodeText(child) {
	if (typeof child === "string") return child;
	if (Array.isArray(child)) return child.map(extractCodeText).join("");
	if (import_react.isValidElement(child)) {
		const props = child.props;
		return extractCodeText(props.children);
	}
	return "";
}
var markdownComponents = {
	a(props) {
		const { href, children, className, rel: _rel, target: _target, ...rest } = props;
		if (href === "agent-native:new-chat") return (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				window.dispatchEvent(new CustomEvent("agent-chat:new-chat"));
			},
			className: cn$1(CTA_BUTTON_CLASSES, className),
			children: [(0, import_jsx_runtime.jsx)(IconPlus, {
				size: 13,
				strokeWidth: 2,
				"aria-hidden": "true"
			}), (0, import_jsx_runtime.jsx)("span", { children })]
		});
		if (!isBuilderErrorCtaHref(href)) return (0, import_jsx_runtime.jsx)("a", {
			href,
			className,
			...rest,
			children
		});
		return (0, import_jsx_runtime.jsxs)("a", {
			href,
			target: "_blank",
			rel: "noreferrer",
			className: cn$1(CTA_BUTTON_CLASSES, className),
			...rest,
			children: [(0, import_jsx_runtime.jsx)("span", { children }), (0, import_jsx_runtime.jsx)(IconExternalLink, {
				size: 13,
				strokeWidth: 2,
				"aria-hidden": "true"
			})]
		});
	},
	table(props) {
		const { children, ...rest } = props;
		return (0, import_jsx_runtime.jsx)("div", {
			className: "agent-markdown-table-wrap",
			children: (0, import_jsx_runtime.jsx)("table", {
				...rest,
				children
			})
		});
	},
	pre(props) {
		const { children, ...rest } = props;
		if (import_react.isValidElement(children)) {
			const childProps = children.props;
			const className = childProps.className || "";
			if (/\blanguage-embed\b/.test(className)) return (0, import_jsx_runtime.jsx)(IframeEmbed, { ...parseEmbedBody(extractCodeText(childProps.children)) });
			if (new RegExp(`\\blanguage-chart-shorthand\\b`).test(className)) {
				const body = extractCodeText(childProps.children).replace(/\n$/, "");
				const parsed = parseLegacyChartShorthand(body);
				return parsed ? (0, import_jsx_runtime.jsx)(LegacyChartShorthandChart, { parsed }) : (0, import_jsx_runtime.jsx)(LegacyChartShorthandFallback, { text: body });
			}
			const langMatch = className.match(/\blanguage-([\w+-]+)\b/);
			if (langMatch) return (0, import_jsx_runtime.jsx)(HighlightedCodeBlock, {
				code: extractCodeText(childProps.children).replace(/\n$/, ""),
				lang: langMatch[1]
			});
		}
		return (0, import_jsx_runtime.jsx)("pre", {
			...rest,
			children
		});
	}
};
function useMarkdownReady() {
	const [ready, setReady] = (0, import_react.useState)(() => markdownModule !== null);
	(0, import_react.useEffect)(() => {
		if (markdownModule !== null) return;
		return onMarkdownReady(() => setReady(true));
	}, []);
	return ready;
}
import_react.memo(function MemoizedMarkdownBlock({ blockText }) {
	const ReactMarkdown = markdownModule?.default;
	const gfm = remarkGfmFn;
	if (!ReactMarkdown || !gfm) return null;
	return (0, import_jsx_runtime.jsx)(ReactMarkdown, {
		remarkPlugins: [gfm],
		components: markdownComponents,
		urlTransform: markdownUrlTransform,
		children: wrapLegacyChartShorthandLines(blockText)
	});
});
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/changelog/Changelog.js
/**
* Changelog UI — renders an app's CHANGELOG.md as an in-app "What's new"
* surface. Core owns all of this; a template just passes its own
* `CHANGELOG.md?raw` content in (Vite inlines it at build time, so this works
* on every host with no runtime file access or server route).
*
* Surfaces:
*   - <ChangelogDialog>      a self-contained modal listing every release.
*   - <ChangelogSettingsCard> a settings-page card with the latest updates.
*   - useChangelogSeen()     tracks the last release a user has seen (so the
*                            command menu can show an "unseen" dot).
*
* The command menu's built-in `changelog` prop (see CommandMenu.tsx) wires the
* dialog automatically — most templates never touch these directly.
*/
function formatEntryHeading(entry, locale) {
	if (entry.date) {
		const [y, m, d] = entry.date.split("-").map(Number);
		if (y && m && d) {
			const formatted = new Date(y, m - 1, d).toLocaleDateString(locale, {
				year: "numeric",
				month: "long",
				day: "numeric"
			});
			return entry.version ? `${entry.version} · ${formatted}` : formatted;
		}
	}
	return entry.title;
}
var changelogMarkdownComponents = {
	h3: (props) => (0, import_jsx_runtime.jsx)("h3", {
		...props,
		className: "mb-1.5 mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground first:mt-0"
	}),
	ul: (props) => (0, import_jsx_runtime.jsx)("ul", {
		...props,
		className: "mb-2 ml-1 list-disc space-y-1 pl-4 text-sm text-foreground marker:text-muted-foreground"
	}),
	ol: (props) => (0, import_jsx_runtime.jsx)("ol", {
		...props,
		className: "mb-2 ml-1 list-decimal space-y-1 pl-4 text-sm text-foreground marker:text-muted-foreground"
	}),
	li: (props) => (0, import_jsx_runtime.jsx)("li", {
		...props,
		className: "leading-relaxed"
	}),
	p: (props) => (0, import_jsx_runtime.jsx)("p", {
		...props,
		className: "mb-2 text-sm leading-relaxed text-foreground"
	}),
	a: (props) => (0, import_jsx_runtime.jsx)("a", {
		...props,
		target: "_blank",
		rel: "noreferrer",
		className: "font-medium underline underline-offset-2"
	}),
	code: (props) => (0, import_jsx_runtime.jsx)("code", {
		...props,
		className: "rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]"
	})
};
function ChangelogBody({ markdown }) {
	const ready = useMarkdownReady();
	const ReactMarkdown = markdownModule?.default;
	const gfm = remarkGfmFn;
	if (!ready || !ReactMarkdown || !gfm) return (0, import_jsx_runtime.jsx)("div", {
		className: "whitespace-pre-wrap text-sm text-foreground",
		children: markdown
	});
	return (0, import_jsx_runtime.jsx)(ReactMarkdown, {
		remarkPlugins: [gfm],
		components: changelogMarkdownComponents,
		urlTransform: markdownUrlTransform,
		children: markdown
	});
}
function seenStorageKey(appKey) {
	return `an:changelog-seen:${appKey}`;
}
/**
* Tracks the latest release a user has already seen (per browser, via
* localStorage). Returns whether there's an unseen release and a `markSeen`
* callback to clear the indicator once the changelog is opened.
*/
function useChangelogSeen(appKey, latestId) {
	const [seenId, setSeenId] = (0, import_react.useState)(null);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			setSeenId(window.localStorage.getItem(seenStorageKey(appKey)));
		} catch {}
		setHydrated(true);
	}, [appKey]);
	const markSeen = import_react.useCallback(() => {
		if (!latestId) return;
		setSeenId(latestId);
		try {
			window.localStorage.setItem(seenStorageKey(appKey), latestId);
		} catch {}
	}, [appKey, latestId]);
	return {
		unseen: hydrated && !!latestId && seenId !== null && seenId !== latestId,
		markSeen
	};
}
function ChangelogEntries({ entries, emptyText }) {
	const locale = useOptionalLocale()?.locale ?? "en-US";
	if (entries.length === 0) return (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: emptyText
	});
	return (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: entries.map((entry) => (0, import_jsx_runtime.jsxs)("section", { children: [(0, import_jsx_runtime.jsx)("h4", {
			className: "mb-2 text-sm font-semibold text-foreground",
			children: formatEntryHeading(entry, locale)
		}), (0, import_jsx_runtime.jsx)(ChangelogBody, { markdown: entry.body })] }, entry.id))
	});
}
function ChangelogDialog({ open, onOpenChange, markdown, title = "What's new", closeLabel = "Close", emptyText = "No updates have been published yet." }) {
	const entries = (0, import_react.useMemo)(() => parseChangelog(markdown), [markdown]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				onOpenChange(false);
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onOpenChange]);
	if (!open) return null;
	return (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4",
		onMouseDown: (e) => {
			if (e.target === e.currentTarget) onOpenChange(false);
		},
		children: (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": title,
			className: "mt-[8vh] flex max-h-[80vh] w-full max-w-xl flex-col rounded-lg border border-border bg-popover text-popover-foreground shadow-lg",
			children: [(0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-5 py-3.5",
				children: [(0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [(0, import_jsx_runtime.jsx)(IconHistory, { className: "h-4 w-4 text-muted-foreground" }), (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: title
					})]
				}), (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onOpenChange(false),
					"aria-label": closeLabel,
					className: "rounded-sm p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
					children: (0, import_jsx_runtime.jsx)(IconX, { className: "h-4 w-4" })
				})]
			}), (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-y-auto px-5 py-4",
				children: (0, import_jsx_runtime.jsx)(ChangelogEntries, {
					entries,
					emptyText
				})
			})]
		})
	});
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/CommandMenu.js
/**
* CommandMenu — reusable command palette with agent chat fallback.
*
* Features:
* - Anchored to top of viewport (not centered)
* - Falls back to agent chat when no command matches
* - Opens agent sidebar automatically when sending prompts
* - Customizable commands via children
*
* Usage:
*   <CommandMenu open={open} onOpenChange={setOpen}>
*     <CommandMenu.Group heading="Actions">
*       <CommandMenu.Item onSelect={() => doThing()}>Do thing</CommandMenu.Item>
*     </CommandMenu.Group>
*   </CommandMenu>
*/
var CommandMenuContext = (0, import_react.createContext)(null);
function useCommandMenuContext() {
	const ctx = (0, import_react.useContext)(CommandMenuContext);
	if (!ctx) throw new Error("CommandMenu.* must be used inside <CommandMenu>");
	return ctx;
}
/**
* Opens the agent sidebar (dispatches event that AgentSidebar listens for)
*/
function openAgentSidebar() {
	window.dispatchEvent(new Event("agent-panel:open"));
}
function openAgentSettings(section) {
	if (typeof window === "undefined") return;
	const normalizedSection = typeof section === "string" ? section : section?.section;
	const secretHash = normalizedSection?.replace(/^#/, "");
	if (secretHash?.toLowerCase().startsWith("secrets:")) window.location.hash = `#${secretHash}`;
	openAgentSidebar();
	const dispatchSettings = () => {
		window.dispatchEvent(new CustomEvent("agent-panel:open-settings", { detail: normalizedSection ? { section: normalizedSection } : void 0 }));
	};
	if (typeof window.requestAnimationFrame === "function") window.requestAnimationFrame(dispatchSettings);
	else window.setTimeout(dispatchSettings, 0);
}
function focusAgentChat() {
	window.dispatchEvent(new CustomEvent("agent-panel:set-mode", { detail: { mode: "chat" } }));
	openAgentSidebar();
}
/**
* Sends a prompt to the agent and opens the sidebar
*/
function submitToAgent(message) {
	focusAgentChat();
	sendToAgentChat({
		message,
		submit: true
	});
}
function CommandGroup({ heading, children }) {
	return (0, import_jsx_runtime.jsx)(CommandGroup$1, {
		heading,
		children
	});
}
function CommandItem({ onSelect, children, keywords: _keywords, className, deferSelect = true }) {
	const { onOpenChange } = useCommandMenuContext();
	const handleSelect = () => {
		if (!deferSelect) {
			onSelect();
			onOpenChange(false);
			return;
		}
		onOpenChange(false);
		setTimeout(onSelect, 50);
	};
	return (0, import_jsx_runtime.jsx)(CommandItem$1, {
		className: cn$1("cursor-pointer gap-2", className),
		onSelect: handleSelect,
		children
	});
}
function CommandShortcut({ children, className }) {
	return (0, import_jsx_runtime.jsx)(CommandShortcut$1, {
		className,
		children
	});
}
function CommandSeparator({ className }) {
	return (0, import_jsx_runtime.jsx)(CommandSeparator$1, { className: cn$1("my-1", className) });
}
function commandDocSearchText(doc) {
	return [
		doc.title,
		doc.description,
		...doc.keywords ?? []
	].filter(Boolean).join(" ").toLowerCase();
}
function filterCommandDocs(docs, search) {
	const searchLower = search.trim().toLowerCase();
	if (!searchLower) return docs;
	return docs.filter((doc) => commandDocSearchText(doc).includes(searchLower));
}
function openDocsHref(href) {
	if (/^https?:\/\//i.test(href)) {
		window.open(href, "_blank", "noopener,noreferrer");
		return;
	}
	window.location.assign(href);
}
function CommandDocsGroup({ docs, heading = "Docs" }) {
	if (docs.length === 0) return null;
	return (0, import_jsx_runtime.jsx)(CommandGroup, {
		heading,
		children: docs.map((doc) => (0, import_jsx_runtime.jsxs)(CommandItem, {
			onSelect: () => openDocsHref(doc.href),
			keywords: [
				doc.title,
				doc.description ?? "",
				...doc.keywords ?? []
			],
			deferSelect: false,
			className: "items-start py-2",
			children: [
				(0, import_jsx_runtime.jsx)(IconBook2, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" }),
				(0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [(0, import_jsx_runtime.jsx)("span", {
						className: "block truncate font-medium",
						children: doc.title
					}), doc.description ? (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block line-clamp-2 text-xs leading-snug text-muted-foreground",
						children: doc.description
					}) : null]
				}),
				(0, import_jsx_runtime.jsx)(IconExternalLink, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" })
			]
		}, doc.href))
	});
}
function CommandMenu({ open, onOpenChange, children, renderResults, renderContent, placeholder = "Type a command or ask AI...", inputLabel = placeholder, emptyText: _emptyText = "No commands found.", showAgentFallback = true, clearSearchOnEscape = false, onCloseAutoFocus, className, changelog, changelogLabel = "What's new", changelogKey, showAbout: showAboutProp }) {
	const [search, setSearch] = (0, import_react.useState)("");
	const inputRef = (0, import_react.useRef)(null);
	const containerRef = (0, import_react.useRef)(null);
	const nestedDialogsRef = (0, import_react.useRef)([]);
	const t = useT();
	const registerNestedDialog = (0, import_react.useCallback)((dismiss) => {
		nestedDialogsRef.current.push(dismiss);
		return () => {
			nestedDialogsRef.current = nestedDialogsRef.current.filter((registered) => registered !== dismiss);
		};
	}, []);
	const [changelogOpen, setChangelogOpen] = (0, import_react.useState)(false);
	const [aboutOpen, setAboutOpen] = (0, import_react.useState)(false);
	const hasChangelog = typeof changelog === "string" && changelog.trim().length > 0;
	const showAbout = showAboutProp ?? hasChangelog;
	const latestChangelogId = (0, import_react.useMemo)(() => hasChangelog ? parseChangelog(changelog) : [], [hasChangelog, changelog])[0]?.id;
	const { unseen: changelogUnseen, markSeen: markChangelogSeen } = useChangelogSeen(changelogKey ?? "app", latestChangelogId);
	const openChangelog = (0, import_react.useCallback)(() => {
		onOpenChange(false);
		markChangelogSeen();
		setTimeout(() => setChangelogOpen(true), 50);
	}, [onOpenChange, markChangelogSeen]);
	const openAbout = (0, import_react.useCallback)(() => {
		onOpenChange(false);
		setTimeout(() => setAboutOpen(true), 50);
	}, [onOpenChange]);
	(0, import_react.useEffect)(() => {
		if (!open) {
			setSearch("");
			return;
		}
		if (open) {
			setSearch("");
			requestAnimationFrame(() => {
				inputRef.current?.focus();
			});
		}
	}, [open]);
	const handleSubmitToAgent = (0, import_react.useCallback)(() => {
		onOpenChange(false);
		if (!search.trim()) {
			focusAgentChat();
			return;
		}
		submitToAgent(search.trim());
	}, [search, onOpenChange]);
	const changelogRowMatches = !search || [
		changelogLabel,
		"changelog",
		"what's new",
		"whats new",
		"updates",
		"release notes",
		"changes"
	].join(" ").toLowerCase().includes(search.toLowerCase());
	const showChangelogRow = hasChangelog && changelogRowMatches;
	const aboutLabel = t("agentChat.aboutAgentNative.title", { defaultValue: "About Agent-Native" });
	const aboutVersionLabel = t("agentChat.aboutAgentNative.version", { defaultValue: "Version" });
	const aboutEnvironmentLabel = t("agentChat.aboutAgentNative.environment", { defaultValue: "Environment" });
	const aboutBuildLabel = t("agentChat.aboutAgentNative.build", { defaultValue: "Build" });
	const aboutDiagnosticsLabel = t("agentChat.aboutAgentNative.copyDiagnostics", { defaultValue: "Copy diagnostics" });
	const aboutRowMatches = !search || [
		aboutLabel,
		"agent-native",
		aboutVersionLabel,
		"versions",
		"package",
		aboutEnvironmentLabel,
		aboutBuildLabel,
		aboutDiagnosticsLabel
	].join(" ").toLowerCase().includes(search.toLowerCase());
	const showAboutRow = showAbout && aboutRowMatches;
	const signOutLabel = t("agentChat.auth.logOut");
	const showSignOutRow = !search || [signOutLabel, ...SIGN_OUT_SEARCH_TERMS].join(" ").toLowerCase().includes(search.toLowerCase());
	const handleSignOut = (0, import_react.useCallback)(() => {
		onOpenChange(false);
		signOut();
	}, [onOpenChange]);
	const filterChildren = (nodes) => {
		return import_react.Children.map(nodes, (child) => {
			if (!import_react.isValidElement(child)) return child;
			const props = child.props;
			if (child.type === import_react.Fragment) {
				const fragmentChildren = filterChildren(props.children);
				if (import_react.Children.count(fragmentChildren) === 0) return null;
				return import_react.cloneElement(child, {
					...props,
					children: fragmentChildren
				});
			}
			if (child.type === CommandGroup) {
				const groupChildren = filterChildren(props.children);
				if (!(import_react.Children.count(groupChildren) > 0)) return null;
				return import_react.cloneElement(child, {
					...props,
					children: groupChildren
				});
			}
			if (child.type === CommandDocsGroup) {
				const filteredDocs = filterCommandDocs(Array.isArray(props.docs) ? props.docs : [], search);
				if (filteredDocs.length === 0) return null;
				return import_react.cloneElement(child, {
					...props,
					docs: filteredDocs
				});
			}
			if (child.type === CommandItem) {
				if (!search) return child;
				const text = getTextContent(props.children).toLowerCase();
				const keywords = (props.keywords || []).join(" ").toLowerCase();
				const searchLower = search.toLowerCase();
				if (text.includes(searchLower) || keywords.includes(searchLower)) return child;
				return null;
			}
			if (child.type === CommandSeparator) return search ? null : child;
			return child;
		});
	};
	const filteredChildren = filterChildren(children);
	const hasResults = import_react.Children.toArray(filteredChildren).some((child) => import_react.isValidElement(child) && (child.type === CommandGroup || child.type === CommandDocsGroup));
	const dynamicResults = open ? renderResults?.(search) : null;
	const renderList = (results = dynamicResults) => (0, import_jsx_runtime.jsxs)(CommandList, { children: [
		results,
		hasResults && filteredChildren,
		showChangelogRow && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [hasResults && (0, import_jsx_runtime.jsx)(CommandSeparator, {}), (0, import_jsx_runtime.jsx)("div", {
			className: "p-1",
			children: (0, import_jsx_runtime.jsxs)(CommandItem$1, {
				className: "cursor-pointer gap-2 py-2",
				onSelect: openChangelog,
				children: [
					(0, import_jsx_runtime.jsx)(IconHistory, { className: "h-4 w-4 text-muted-foreground" }),
					(0, import_jsx_runtime.jsx)("span", { children: changelogLabel }),
					changelogUnseen && (0, import_jsx_runtime.jsx)("span", {
						className: "ms-auto h-2 w-2 rounded-full bg-primary",
						"aria-label": "New updates available"
					})
				]
			})
		})] }),
		showAboutRow && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(hasResults || showChangelogRow) && (0, import_jsx_runtime.jsx)(CommandSeparator, {}), (0, import_jsx_runtime.jsx)("div", {
			className: "p-1",
			children: (0, import_jsx_runtime.jsxs)(CommandItem$1, {
				className: "cursor-pointer gap-2 py-2",
				onSelect: openAbout,
				children: [(0, import_jsx_runtime.jsx)(IconInfoCircle, { className: "h-4 w-4 text-muted-foreground" }), (0, import_jsx_runtime.jsx)("span", { children: aboutLabel })]
			})
		})] }),
		showSignOutRow && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(hasResults || showChangelogRow || showAboutRow) && (0, import_jsx_runtime.jsx)(CommandSeparator, {}), (0, import_jsx_runtime.jsx)("div", {
			className: "p-1",
			children: (0, import_jsx_runtime.jsxs)(CommandItem$1, {
				className: "cursor-pointer gap-2 py-2",
				onSelect: handleSignOut,
				children: [(0, import_jsx_runtime.jsx)(IconLogout, { className: "h-4 w-4 text-muted-foreground rtl:-scale-x-100" }), (0, import_jsx_runtime.jsx)("span", { children: signOutLabel })]
			})
		})] }),
		showAgentFallback && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(hasResults || showChangelogRow || showAboutRow || showSignOutRow || Boolean(results)) && (0, import_jsx_runtime.jsx)(CommandSeparator, {}), (0, import_jsx_runtime.jsx)("div", {
			className: "p-1",
			children: (0, import_jsx_runtime.jsxs)(CommandItem$1, {
				className: "cursor-pointer gap-2 py-2",
				onSelect: handleSubmitToAgent,
				children: [
					(0, import_jsx_runtime.jsx)(IconMessage, { className: "h-4 w-4 text-muted-foreground" }),
					(0, import_jsx_runtime.jsx)("span", { children: search.trim() ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Ask AI:",
						" ",
						(0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								"\"",
								search,
								"\""
							]
						})
					] }) : (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Ask AI anything..."
					}) }),
					search.trim() && (0, import_jsx_runtime.jsx)("span", {
						className: "ms-auto text-xs text-muted-foreground",
						children: "↵"
					})
				]
			})
		})] })
	] });
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: (nextOpen) => {
				if (!nextOpen && nestedDialogsRef.current.length > 0) return;
				onOpenChange(nextOpen);
			},
			children: (0, import_jsx_runtime.jsxs)(DialogContent, {
				ref: containerRef,
				"aria-describedby": void 0,
				onEscapeKeyDown: (event) => {
					const dismissNested = nestedDialogsRef.current.at(-1);
					if (dismissNested) {
						event.preventDefault();
						queueMicrotask(dismissNested);
						return;
					}
					if (clearSearchOnEscape && search.length > 0) {
						event.preventDefault();
						setSearch("");
					}
				},
				hideClose: true,
				motion: "instant",
				overlayClassName: "fixed inset-0 backdrop-blur-none transition-none",
				overlayStyle: {
					backgroundColor: "rgb(0 0 0 / 0.5)",
					backdropFilter: "none",
					animation: "none",
					transition: "none"
				},
				className: cn$1("fixed left-1/2 top-[15vh] !max-h-none -translate-x-1/2 !translate-y-0 !gap-0 w-full max-w-lg", "rounded-lg border border-border bg-popover p-0 text-popover-foreground shadow-lg", className),
				onCloseAutoFocus,
				style: {
					animation: "none",
					transition: "none"
				},
				children: [(0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: placeholder
				}), (0, import_jsx_runtime.jsx)(Command, {
					loop: true,
					shouldFilter: false,
					className: "h-auto rounded-lg",
					children: (0, import_jsx_runtime.jsxs)(CommandMenuContext.Provider, {
						value: {
							search,
							onOpenChange,
							registerNestedDialog
						},
						children: [(0, import_jsx_runtime.jsx)(CommandInput, {
							ref: inputRef,
							value: search,
							onValueChange: setSearch,
							placeholder,
							"aria-label": inputLabel
						}), open && renderContent ? renderContent({
							search,
							renderList
						}) : open && renderList()]
					})
				})]
			})
		}),
		hasChangelog && (0, import_jsx_runtime.jsx)(ChangelogDialog, {
			open: changelogOpen,
			onOpenChange: setChangelogOpen,
			markdown: changelog,
			title: changelogLabel
		}),
		showAbout && (0, import_jsx_runtime.jsx)(AboutAgentNativeDialog, {
			open: aboutOpen,
			onOpenChange: setAboutOpen
		})
	] });
}
function getTextContent(children) {
	if (typeof children === "string") return children;
	if (typeof children === "number") return String(children);
	if (!children) return "";
	if (Array.isArray(children)) return children.map(getTextContent).join(" ");
	if (import_react.isValidElement(children) && children.props.children) return getTextContent(children.props.children);
	return "";
}
CommandMenu.Group = CommandGroup;
CommandMenu.Item = CommandItem;
CommandMenu.DocsGroup = CommandDocsGroup;
CommandMenu.Shortcut = CommandShortcut;
CommandMenu.Separator = CommandSeparator;
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/navigation/index.js
var STANDARD_APP_ROUTES = {
	home: "/",
	settings: "/settings",
	team: "/team"
};
var STANDARD_SETTINGS_TABS = {
	general: "general",
	agent: "agent",
	providers: "providers",
	connections: "connections",
	secrets: "secrets",
	mcp: "mcp",
	team: "organization",
	usage: "usage",
	language: "language",
	whatsNew: "whats-new"
};
function normalizeLeadingPath(path) {
	const trimmed = path.trim();
	if (!trimmed || trimmed === "/") return "/";
	return `/${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}
function normalizeTabId(tab) {
	const normalized = tab.trim().replace(/^#/, "").toLowerCase().replace(/['"]/g, "").replace(/[\s_]+/g, "-");
	if (normalized === "connections") return "integrations";
	if (normalized === "team" || normalized === "org") return "organization";
	if (normalized === "changelog" || normalized === "what-s-new" || normalized === "updates") return "whats-new";
	return normalized;
}
function pathSegment(value) {
	return encodeURIComponent(value.trim().replace(/^\/+|\/+$/g, ""));
}
function buildSettingsRoute(tab, basePath = STANDARD_APP_ROUTES.settings) {
	return `${normalizeLeadingPath(basePath)}/${((tab ? normalizeTabId(tab) : null) || STANDARD_SETTINGS_TABS.general).split(":").map((segment) => pathSegment(segment)).filter(Boolean).join("/")}`;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/integrations/IntegrationGrid.js
/**
* The shared integration list surface. Keep provider rows intentionally
* boring: identity, one-line context, and one clear next action.
*/
function IntegrationGrid({ items, emptyLabel = "No integrations found.", className, variant = "cards" }) {
	if (items.length === 0) return (0, import_jsx_runtime.jsx)("div", {
		className: cn$1("rounded-xl bg-muted/30 px-5 py-8 text-center text-xs text-muted-foreground", className),
		children: emptyLabel
	});
	if (variant === "rows") return (0, import_jsx_runtime.jsx)("div", {
		className: cn$1("grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2", className),
		children: items.map((item) => {
			const actionKind = item.actionKind ?? "connect";
			const ActionIcon = actionKind === "manage" ? IconDots : IconPlus;
			const actionWord = actionKind === "manage" ? "Manage" : "Connect";
			const hasAction = item.action !== void 0 || typeof item.onAction === "function";
			return (0, import_jsx_runtime.jsxs)("article", {
				className: cn$1("flex min-w-0 items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/40", item.fullWidth && "md:col-span-2"),
				children: [
					(0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 shrink-0 items-center justify-center rounded-md text-foreground",
						children: item.logo
					}),
					(0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [(0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-2",
							children: [
								(0, import_jsx_runtime.jsx)("h3", {
									className: "truncate text-sm font-medium text-foreground",
									children: item.name
								}),
								item.badge ? (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground",
									children: item.badge
								}) : null,
								item.status ? (0, import_jsx_runtime.jsx)("span", {
									className: cn$1("shrink-0 text-[11px] font-medium text-muted-foreground", item.statusClassName),
									children: item.status
								}) : null
							]
						}), item.description ? (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 line-clamp-1 text-xs text-muted-foreground",
							children: item.description
						}) : null]
					}),
					hasAction ? item.action ?? (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: item.onAction,
						disabled: item.disabled,
						title: item.actionLabel,
						"aria-label": item.actionAriaLabel ?? `${actionWord} ${item.name}`,
						className: "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
						children: (0, import_jsx_runtime.jsx)(ActionIcon, { className: "size-4" })
					}) : null
				]
			}, item.id);
		})
	});
	return (0, import_jsx_runtime.jsx)("div", {
		className: "agent-native-integration-grid min-w-0",
		children: (0, import_jsx_runtime.jsx)("div", {
			className: cn$1("agent-native-integration-grid__items grid grid-cols-1 gap-2 overflow-hidden rounded-xl bg-muted/20 p-2", className),
			children: items.map((item) => (0, import_jsx_runtime.jsxs)("article", {
				className: "flex min-w-0 items-center gap-3 rounded-lg bg-muted/35 px-3 py-3.5",
				children: [
					(0, import_jsx_runtime.jsx)("span", {
						className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-background/80 text-foreground",
						children: item.logo
					}),
					(0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [(0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-2",
							children: [(0, import_jsx_runtime.jsx)("h3", {
								className: "truncate text-sm font-medium text-foreground",
								children: item.name
							}), item.status ? (0, import_jsx_runtime.jsx)("span", {
								className: cn$1("shrink-0 text-[11px] font-medium text-muted-foreground", item.statusClassName),
								children: item.status
							}) : null]
						}), item.description ? (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground",
							children: item.description
						}) : null]
					}),
					(0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: item.onAction,
						disabled: item.disabled,
						"aria-label": item.actionAriaLabel ?? `${item.actionLabel} ${item.name}`,
						className: "inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
						children: item.actionLabel
					})
				]
			}, item.id))
		})
	});
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/integrations/IntegrationConnectionChoice.js
/** The one small decision before an integration's advanced setup surface. */
function IntegrationConnectionChoice({ name, logo, showPersonalOption = true, showWorkspaceOption, workspaceOptionDisabled = false, workspaceOptionDisabledReason, personalOnlyReason, workspaceOnlyReason, busy = false, compact = false, onPersonal, onWorkspace }) {
	const t = useT();
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col bg-background",
		children: [(0, import_jsx_runtime.jsx)("header", {
			className: cn$1("flex items-center border-b border-border", compact ? "min-h-14 px-6" : "min-h-16 px-6 sm:px-10"),
			children: (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-3",
				children: [logo ? (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/50 text-foreground",
					children: logo
				}) : null, (0, import_jsx_runtime.jsxs)("span", {
					className: "truncate text-sm font-medium text-foreground",
					children: [
						t("mcpIntegrations.connect"),
						" ",
						name
					]
				})]
			})
		}), (0, import_jsx_runtime.jsx)("main", {
			className: cn$1("flex flex-1 justify-center overflow-y-auto px-6", compact ? "py-6" : "py-12 sm:px-10 sm:py-[12vh]"),
			children: (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-[420px] self-start",
				children: [
					(0, import_jsx_runtime.jsx)("h1", {
						className: cn$1("font-semibold tracking-[-0.03em] text-foreground", compact ? "text-lg" : "text-2xl sm:text-[28px]"),
						children: t("mcpIntegrations.scopeChoiceTitle")
					}),
					(0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-6 text-muted-foreground",
						children: t("mcpIntegrations.scopeChoiceDescription")
					}),
					(0, import_jsx_runtime.jsxs)("div", {
						className: cn$1("grid gap-2.5", compact ? "mt-5" : "mt-8"),
						children: [showPersonalOption ? (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onPersonal,
							disabled: busy,
							"aria-busy": busy,
							className: "flex min-h-12 items-center gap-3 rounded-lg bg-primary px-4 py-3 text-left text-primary-foreground transition-[background-color,opacity] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-60",
							children: [
								(0, import_jsx_runtime.jsx)(IconUser, { className: "size-4 shrink-0 opacity-75" }),
								(0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 text-sm font-medium",
									children: t("mcpIntegrations.connectForMe")
								}),
								busy ? (0, import_jsx_runtime.jsx)(IconLoader2, { className: "size-4 shrink-0 animate-spin" }) : null
							]
						}) : null, showWorkspaceOption ? (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onWorkspace,
							disabled: busy || workspaceOptionDisabled,
							"aria-describedby": workspaceOptionDisabledReason ? "integration-workspace-scope-restriction" : void 0,
							className: "flex min-h-12 items-center gap-3 rounded-lg bg-muted/50 px-4 py-3 text-left text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
							children: [
								(0, import_jsx_runtime.jsx)(IconUsersGroup, { className: "size-4 shrink-0 text-muted-foreground" }),
								(0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 text-sm font-medium",
									children: t("mcpIntegrations.setUpForWorkspace")
								}),
								workspaceOptionDisabledReason ? (0, import_jsx_runtime.jsx)("span", {
									id: "integration-workspace-scope-restriction",
									className: "shrink-0 text-[11px] font-normal text-muted-foreground",
									children: workspaceOptionDisabledReason
								}) : null
							]
						}) : null]
					}),
					personalOnlyReason ?? workspaceOnlyReason ? (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[11px] leading-relaxed text-muted-foreground",
						children: personalOnlyReason ?? workspaceOnlyReason
					}) : null
				]
			})
		})]
	});
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/resources/McpIntegrationLogo.js
function McpIntegrationLogo({ name, logoUrl, integrationId, className, imageClassName, style, title }) {
	const [failedLogoUrl, setFailedLogoUrl] = (0, import_react.useState)(null);
	const showFallback = !logoUrl || failedLogoUrl === logoUrl;
	const invertOnDark = integrationId !== void 0 && mcpIntegrationLogoNeedsDarkModeFilter(integrationId);
	(0, import_react.useEffect)(() => {
		setFailedLogoUrl(null);
	}, [logoUrl]);
	return (0, import_jsx_runtime.jsx)("span", {
		className: cn$1("relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-background text-xs font-semibold text-muted-foreground", className),
		style,
		title,
		children: showFallback ? (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			children: name.slice(0, 1)
		}) : (0, import_jsx_runtime.jsx)("img", {
			src: logoUrl,
			alt: "",
			loading: "lazy",
			decoding: "async",
			className: cn$1("size-7 object-contain", invertOnDark && "dark:invert dark:hue-rotate-180", imageClassName),
			title,
			onError: () => setFailedLogoUrl(logoUrl)
		})
	});
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/resources/McpIntegrationDialog.js
function parseHeaderLines(text) {
	const out = {};
	for (const line of text.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const idx = trimmed.indexOf(":");
		if (idx <= 0) continue;
		const key = trimmed.slice(0, idx).trim();
		const value = trimmed.slice(idx + 1).trim();
		if (!key || !value) continue;
		out[key] = value;
	}
	return Object.keys(out).length > 0 ? out : void 0;
}
function requiresMcpIntegrationSetup(integration) {
	return Boolean(!integration.managedOAuth && (integration.connectionMode === "manual" || integration.availability === "provider-setup" || integration.availability === "client-restricted"));
}
function resolveIntegrationScope(integration, defaultScope, hasOrg, canCreateOrgMcp) {
	return resolveMcpIntegrationScope(integration && requiresMcpIntegrationOrganizationScope(integration) ? "org" : defaultScope, hasOrg, canCreateOrgMcp, !integration || integration.supportsOrganizationScope === true && integration.managedOAuth !== true);
}
function McpIntegrationDialog({ open, onOpenChange, initialIntegrationId = null, connectIntegrationId = null, quickConnectIntegrationId = null, presentation = "takeover", defaultScope, canCreateOrgMcp, hasOrg, onCreateMcpServer, onOAuthStart, oauthReady = true, oauthReturnPath, trackingFlow, trackingIntegrationId = null, onCreated, integrations }) {
	const t = useT();
	const [mode, setMode] = (0, import_react.useState)("catalog");
	const [query, setQuery] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const safeDefaultScope = resolveMcpIntegrationScope(defaultScope, hasOrg, canCreateOrgMcp);
	const [scope, setScope] = (0, import_react.useState)(safeDefaultScope);
	const [name, setName] = (0, import_react.useState)("");
	const [url, setUrl] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [headersText, setHeadersText] = (0, import_react.useState)("");
	const [customAuthMode, setCustomAuthMode] = (0, import_react.useState)("oauth");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [testResult, setTestResult] = (0, import_react.useState)(null);
	const inputRef = (0, import_react.useRef)(null);
	const quickConnectAttemptedRef = (0, import_react.useRef)(null);
	const quickConnectRef = (0, import_react.useRef)(null);
	const mcpApi = useMcpServersApi();
	const mcpServersQuery = useMcpServers({ defer: true });
	const defaultIntegrations = (0, import_react.useMemo)(() => integrations ?? getDefaultMcpIntegrations(), [integrations]);
	const customIntegrationEnabled = (0, import_react.useMemo)(() => isCustomMcpIntegrationEnabled(), []);
	const showCatalog = defaultIntegrations.length > 0;
	const connectedServers = (0, import_react.useMemo)(() => {
		return [...mcpServersQuery.data?.user ?? [], ...mcpServersQuery.data?.org ?? []].filter((server) => server.status.state === "connected");
	}, [mcpServersQuery.data]);
	const filteredIntegrations = (0, import_react.useMemo)(() => filterMcpIntegrations(query, defaultIntegrations), [defaultIntegrations, query]);
	const selectedRequiresSetup = Boolean(selected && requiresMcpIntegrationSetup(selected));
	(0, import_react.useEffect)(() => {
		if (!open) return;
		if (initialIntegrationId && !mcpServersQuery.isSuccess) return;
		const initialIntegration = initialIntegrationId ? defaultIntegrations.find((integration) => integration.id === initialIntegrationId) : null;
		const initialDefaults = createMcpIntegrationFormDefaults(initialIntegration);
		const initialNeedsScopeChoice = Boolean(initialIntegration && (requiresMcpIntegrationOrganizationScope(initialIntegration) || hasOrg && requiresMcpIntegrationSetup(initialIntegration) && supportsMcpIntegrationOrganizationScope(initialIntegration)));
		setMode(initialNeedsScopeChoice ? "choice" : initialIntegration || !showCatalog ? "form" : "catalog");
		setQuery("");
		setSelected(initialIntegration ?? null);
		setScope(resolveIntegrationScope(initialIntegration, defaultScope, hasOrg, canCreateOrgMcp));
		setName(initialDefaults.name);
		setUrl(initialDefaults.url);
		setDescription(initialDefaults.description);
		setHeadersText(initialDefaults.headersText);
		setCustomAuthMode(initialIntegration ? "headers" : "oauth");
		setBusy(false);
		setError(null);
		setTestResult(null);
	}, [
		defaultIntegrations,
		initialIntegrationId,
		canCreateOrgMcp,
		defaultScope,
		hasOrg,
		open,
		safeDefaultScope,
		showCatalog,
		mcpServersQuery.isSuccess
	]);
	(0, import_react.useEffect)(() => {
		if (open && mode === "form") {
			const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
			return () => window.clearTimeout(timer);
		}
	}, [mode, open]);
	const clearFeedback = () => {
		setError(null);
		setTestResult(null);
	};
	const openForm = (integration, options) => {
		const defaults = createMcpIntegrationFormDefaults(integration);
		setSelected(integration ?? null);
		setScope(options?.scope ?? resolveIntegrationScope(integration, defaultScope, hasOrg, canCreateOrgMcp));
		setName(defaults.name);
		setUrl(defaults.url);
		setDescription(defaults.description);
		setHeadersText(defaults.headersText);
		setCustomAuthMode(integration ? "headers" : "oauth");
		setError(null);
		setTestResult(null);
		setMode("form");
	};
	const beginOAuth = (args, options) => {
		if (!oauthReady) return;
		const validationError = getMcpUrlValidationError(args.url);
		if (validationError) {
			setError(validationError);
			setTestResult(null);
			return;
		}
		if (mcpUrlRequiresOrganizationScope(args.url) && !(hasOrg && canCreateOrgMcp)) {
			setError(t("mcpIntegrations.workspaceOnlyDescription"));
			setTestResult(null);
			return;
		}
		setBusy(true);
		const returnUrl = oauthReturnPath?.startsWith("/") ? oauthReturnPath : typeof window === "undefined" ? "/" : window.location.pathname + window.location.search + window.location.hash;
		const oauthUrl = agentNativePath(buildMcpOAuthStartUrl({
			name: args.name,
			url: args.url,
			description: args.description,
			scope: options?.scope ?? scope,
			returnUrl,
			trackingFlow: options?.trackingFlow,
			trackingIntegrationId: options?.trackingIntegrationId
		}));
		if (!onOAuthStart) {
			const opened = navigateToMcpOAuthStart(oauthUrl);
			setBusy(false);
			if (opened) onOpenChange(false);
			else setError(t("mcpIntegrations.connectionError"));
			return;
		}
		Promise.resolve().then(() => onOAuthStart(oauthUrl)).then(() => onOpenChange(false)).catch((cause) => {
			setBusy(false);
			setError(formatMcpServerError(cause));
		});
	};
	const connectWithOAuth = (integration, options) => beginOAuth({
		name: integration.name,
		url: integration.url,
		description: integration.description
	}, {
		...options,
		scope: options?.scope ?? (integration.supportsOrganizationScope === true && integration.managedOAuth !== true ? scope : "user"),
		trackingFlow,
		trackingIntegrationId: trackingIntegrationId ?? void 0
	});
	const connectCustomWithOAuth = () => {
		if (!name.trim()) {
			setError(t("mcpIntegrations.serverNameRequired"));
			return;
		}
		beginOAuth({
			name: name.trim(),
			url: url.trim(),
			description: description.trim()
		});
	};
	const connectSelectedWithOAuth = () => {
		if (!name.trim()) {
			setError(t("mcpIntegrations.serverNameRequired"));
			return;
		}
		beginOAuth({
			name: name.trim(),
			url: url.trim(),
			description: description.trim()
		});
	};
	const createServer = async (args) => {
		const validationError = getMcpUrlValidationError(args.url);
		if (validationError) {
			setError(validationError);
			setTestResult(null);
			return;
		}
		setBusy(true);
		setError(null);
		try {
			await onCreateMcpServer(args);
			onOpenChange(false);
			onCreated?.();
		} catch (err) {
			setError(formatMcpServerError(err));
		} finally {
			setBusy(false);
		}
	};
	const submitForm = () => {
		const trimmedName = name.trim();
		const trimmedUrl = url.trim();
		if (!trimmedName || !trimmedUrl || busy) return;
		createServer({
			scope,
			name: trimmedName,
			url: trimmedUrl,
			headers: parseHeaderLines(headersText),
			description: description.trim() || void 0
		});
	};
	const routeOrganizationOnlyIntegration = (integration) => {
		if (!requiresMcpIntegrationOrganizationScope(integration)) return false;
		if (hasOrg && canCreateOrgMcp) {
			connectWorkspace(integration);
			return true;
		}
		setSelected(integration);
		setMode("choice");
		return true;
	};
	const quickConnect = (integration) => {
		if (routeOrganizationOnlyIntegration(integration)) return;
		if (hasOrg && supportsMcpIntegrationOrganizationScope(integration)) {
			setSelected(integration);
			setMode("choice");
			return;
		}
		if (!integration.url.trim()) {
			openForm(integration);
			return;
		}
		if (requiresMcpIntegrationSetup(integration)) {
			openForm(integration);
			return;
		}
		if (integration.authMode === "oauth") {
			connectWithOAuth(integration, { scope: "user" });
			return;
		}
		if (integration.authMode === "headers") {
			openForm(integration);
			return;
		}
		createServer({
			scope: "user",
			name: integration.name,
			url: integration.url,
			description: integration.description
		});
	};
	const selectCatalogConnection = (integration) => {
		if (!mcpServersQuery.isSuccess) return;
		if (routeOrganizationOnlyIntegration(integration)) return;
		if (hasOrg && supportsMcpIntegrationOrganizationScope(integration)) {
			setSelected(integration);
			setMode("choice");
			return;
		}
		if (requiresMcpIntegrationSetup(integration)) {
			const apiFallback = getMcpIntegrationApiFallback(integration);
			if (apiFallback) openAgentSettings(`secrets:${apiFallback.secretKey}`);
			else openForm(integration);
			return;
		}
		quickConnect(integration);
	};
	quickConnectRef.current = quickConnect;
	(0, import_react.useEffect)(() => {
		if (!open) {
			quickConnectAttemptedRef.current = null;
			return;
		}
		if (!quickConnectIntegrationId || quickConnectAttemptedRef.current === quickConnectIntegrationId) return;
		if (mcpServersQuery.isError) return;
		if (!mcpServersQuery.isSuccess) return;
		const integration = defaultIntegrations.find((candidate) => candidate.id === quickConnectIntegrationId);
		if (!integration) return;
		if (integration.authMode === "oauth" && !oauthReady) return;
		quickConnectAttemptedRef.current = quickConnectIntegrationId;
		if (routeOrganizationOnlyIntegration(integration)) return;
		if (integration.authMode === "oauth" && !(hasOrg && supportsMcpIntegrationOrganizationScope(integration))) {
			openForm(integration, { scope: "user" });
			return;
		}
		quickConnectRef.current?.(integration);
	}, [
		defaultIntegrations,
		hasOrg,
		mcpServersQuery.isError,
		mcpServersQuery.isSuccess,
		open,
		oauthReady,
		quickConnectIntegrationId
	]);
	(0, import_react.useEffect)(() => {
		if (!open || !connectIntegrationId) return;
		if (mcpServersQuery.isError) return;
		if (!mcpServersQuery.isSuccess) return;
		const integration = defaultIntegrations.find((candidate) => candidate.id === connectIntegrationId);
		if (!integration) return;
		if (integration.authMode === "oauth" && !oauthReady) return;
		const attemptKey = `connect:${connectIntegrationId}`;
		if (quickConnectAttemptedRef.current === attemptKey) return;
		quickConnectAttemptedRef.current = attemptKey;
		if (routeOrganizationOnlyIntegration(integration)) return;
		if (hasOrg && supportsMcpIntegrationOrganizationScope(integration)) {
			setSelected(integration);
			setMode("choice");
			return;
		}
		if (requiresMcpIntegrationSetup(integration)) {
			openForm(integration);
			return;
		}
		if (integration.authMode === "oauth") {
			openForm(integration, { scope: "user" });
			return;
		}
		quickConnectRef.current?.(integration);
	}, [
		canCreateOrgMcp,
		connectIntegrationId,
		defaultIntegrations,
		hasOrg,
		mcpServersQuery.isError,
		mcpServersQuery.isSuccess,
		open,
		oauthReady
	]);
	const connectPersonal = (integration) => {
		if (requiresMcpIntegrationSetup(integration)) {
			const apiFallback = getMcpIntegrationApiFallback(integration);
			if (apiFallback) openAgentSettings(`secrets:${apiFallback.secretKey}`);
			else openForm(integration, { scope: "user" });
			return;
		}
		if (integration.authMode === "oauth") {
			connectWithOAuth(integration, { scope: "user" });
			return;
		}
		if (integration.authMode === "none" && integration.connectionMode === "direct") {
			createServer({
				scope: "user",
				name: integration.name,
				url: integration.url,
				description: integration.description
			});
			return;
		}
		openForm(integration, { scope: "user" });
	};
	const connectWorkspace = (integration) => {
		if (!canCreateOrgMcp) return;
		if (requiresMcpIntegrationSetup(integration)) {
			openForm(integration, { scope: "org" });
			return;
		}
		if (integration.authMode === "oauth") {
			connectWithOAuth(integration, { scope: "org" });
			return;
		}
		if (integration.authMode === "none" && integration.connectionMode === "direct") {
			createServer({
				scope: "org",
				name: integration.name,
				url: integration.url,
				description: integration.description
			});
			return;
		}
		openForm(integration, { scope: "org" });
	};
	const runTest = async () => {
		const trimmedUrl = url.trim();
		if (!trimmedUrl || busy) return;
		const validationError = getMcpUrlValidationError(trimmedUrl);
		if (validationError) {
			setTestResult({
				ok: false,
				message: validationError
			});
			setError(null);
			return;
		}
		setBusy(true);
		setError(null);
		setTestResult(null);
		try {
			const res = await mcpApi.test(trimmedUrl, parseHeaderLines(headersText));
			setTestResult(res.ok ? {
				ok: true,
				message: t("mcpIntegrations.toolsAvailable", { count: res.toolCount ?? 0 })
			} : {
				ok: false,
				message: res.error ?? t("mcpIntegrations.failed")
			});
		} catch (err) {
			setTestResult({
				ok: false,
				message: formatMcpServerError(err)
			});
		} finally {
			setBusy(false);
		}
	};
	const formRequiresOrganizationScope = selected ? selected.authMode === "oauth" && requiresMcpIntegrationOrganizationScope(selected) : customAuthMode === "oauth" && mcpUrlRequiresOrganizationScope(url);
	const renderScopeSelector = () => {
		if (selected?.managedOAuth) return null;
		if (formRequiresOrganizationScope) return (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] leading-relaxed text-muted-foreground",
			children: t("mcpIntegrations.workspaceOnlyDescription")
		});
		if (!(selected ? shouldOfferMcpIntegrationOrganizationScope(selected, hasOrg, canCreateOrgMcp) : shouldOfferMcpOrganizationScope(hasOrg, canCreateOrgMcp))) return null;
		return (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1.5",
			children: [
				(0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium text-foreground",
					children: t("mcpIntegrations.scopeQuestion")
				}),
				(0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1 rounded-md border border-border bg-background p-0.5",
					children: [(0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setScope("user"),
						"aria-pressed": scope === "user",
						className: cn$1("flex-1 rounded px-2 py-1.5 text-[11px] font-medium", scope === "user" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"),
						children: t("mcpIntegrations.personal")
					}), (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setScope("org"),
						"aria-pressed": scope === "org",
						className: cn$1("flex-1 rounded px-2 py-1.5 text-[11px] font-medium", scope === "org" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"),
						children: t("mcpIntegrations.sharedWithWorkspace")
					})]
				}),
				(0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] leading-relaxed text-muted-foreground",
					children: t(scope === "user" ? "mcpIntegrations.personalDescription" : "mcpIntegrations.organizationDescription")
				})
			]
		});
	};
	if (!showCatalog && !customIntegrationEnabled) return null;
	return (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: (0, import_jsx_runtime.jsxs)(DialogContent, {
			"aria-describedby": void 0,
			className: cn$1("flex flex-col gap-0 overflow-hidden p-0", presentation === "takeover" ? "inset-0 h-[100dvh] max-h-none w-full max-w-none translate-x-0 translate-y-0 rounded-none" : "max-h-[min(680px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] max-w-xl rounded-xl"),
			children: [mcpServersQuery.isError ? (0, import_jsx_runtime.jsxs)("div", {
				role: "alert",
				className: "mx-7 mt-4 shrink-0 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive sm:mx-10",
				children: [(0, import_jsx_runtime.jsx)("p", { children: formatMcpServersLoadError(mcpServersQuery.error) }), (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void mcpServersQuery.refetch(),
					disabled: mcpServersQuery.isFetching,
					className: "mt-2 font-medium underline underline-offset-2 hover:text-foreground disabled:cursor-wait disabled:opacity-60",
					children: mcpServersQuery.isFetching ? t("mcpIntegrations.retrying") : t("mcpIntegrations.retry")
				})]
			}) : null, mode === "choice" && selected ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(DialogHeader, {
				className: "sr-only",
				children: (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
					t("mcpIntegrations.connect"),
					" ",
					selected.name
				] })
			}), (0, import_jsx_runtime.jsx)(IntegrationConnectionChoice, {
				name: selected.name,
				logo: (0, import_jsx_runtime.jsx)(McpIntegrationLogo, {
					name: selected.name,
					logoUrl: selected.logoUrl,
					integrationId: selected.id,
					className: "size-7 rounded-md",
					imageClassName: "size-full p-1"
				}),
				showPersonalOption: allowsMcpIntegrationPersonalScope(selected),
				showWorkspaceOption: supportsMcpIntegrationOrganizationScope(selected),
				workspaceOptionDisabled: !canCreateOrgMcp,
				workspaceOptionDisabledReason: !canCreateOrgMcp ? t(hasOrg ? "mcpIntegrations.workspaceAdminRequired" : "mcpIntegrations.workspaceJoinRequired") : void 0,
				personalOnlyReason: !supportsMcpIntegrationOrganizationScope(selected) ? t("mcpIntegrations.personalOnlyDescription") : void 0,
				workspaceOnlyReason: requiresMcpIntegrationOrganizationScope(selected) ? t("mcpIntegrations.workspaceOnlyDescription") : void 0,
				busy,
				compact: presentation === "modal",
				onPersonal: () => connectPersonal(selected),
				onWorkspace: () => connectWorkspace(selected)
			})] }) : mode === "catalog" ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				(0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "shrink-0 px-7 pb-5 pe-14 pt-7 sm:px-10",
					children: [(0, import_jsx_runtime.jsx)(DialogTitle, { children: t("mcpIntegrations.title") }), (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("mcpIntegrations.description", { count: defaultIntegrations.length }) })]
				}),
				(0, import_jsx_runtime.jsx)("div", {
					className: "shrink-0 px-7 pb-5 sm:px-10",
					children: (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row",
						children: [(0, import_jsx_runtime.jsxs)("label", {
							className: "relative min-w-0 flex-1",
							children: [(0, import_jsx_runtime.jsx)(IconSearch, { className: "pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), (0, import_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (event) => setQuery(event.target.value),
								className: "h-9 w-full rounded-md border border-border bg-background pe-3 ps-8 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-ring",
								placeholder: t("mcpIntegrations.searchPlaceholder")
							})]
						}), (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => openForm(null),
							className: cn$1("inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 text-[12px] font-medium text-foreground hover:bg-accent", !customIntegrationEnabled && "hidden"),
							children: t("mcpIntegrations.addYourOwn")
						})]
					})
				}),
				(0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-y-auto px-7 pb-10 pt-7 sm:px-10",
					children: (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto w-full max-w-5xl",
						children: [
							error && (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-[12px] leading-relaxed text-destructive",
								children: error
							}),
							!mcpServersQuery.isSuccess && !mcpServersQuery.isError ? (0, import_jsx_runtime.jsx)("div", {
								role: "status",
								className: "mb-3 rounded-md border border-border bg-muted/30 px-3 py-2 text-[12px] leading-relaxed text-muted-foreground",
								children: t("mcpIntegrations.loadingScopeMetadata")
							}) : null,
							(0, import_jsx_runtime.jsx)(IntegrationGrid, {
								items: filteredIntegrations.map((integration) => {
									const connected = connectedServers.some((server) => isMcpIntegrationUrl(integration, server.url));
									const setupOnly = requiresMcpIntegrationSetup(integration);
									const apiFallback = getMcpIntegrationApiFallback(integration);
									return {
										id: integration.id,
										name: integration.name,
										description: t(integration.descriptionKey),
										logo: (0, import_jsx_runtime.jsx)(McpIntegrationLogo, {
											name: integration.name,
											logoUrl: integration.logoUrl,
											integrationId: integration.id,
											className: "size-7 rounded-md",
											imageClassName: "size-full p-1"
										}),
										status: connected ? t("mcpIntegrations.connected") : setupOnly ? t("mcpIntegrations.status.setupRequired") : void 0,
										statusClassName: connected ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
										actionLabel: connected ? "Manage" : setupOnly && apiFallback ? t("mcpIntegrations.useApiToken") : setupOnly ? t("mcpIntegrations.viewSetup") : t("mcpIntegrations.connect"),
										disabled: connected || busy || !mcpServersQuery.isSuccess,
										onAction: () => {
											if (connected) {
												openForm(integration);
												return;
											}
											selectCatalogConnection(integration);
										}
									};
								}),
								emptyLabel: t("mcpIntegrations.noMatches")
							})
						]
					})
				})
			] }) : (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				(0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: cn$1("shrink-0 border-b border-border pe-14", presentation === "takeover" ? "px-7 pb-5 pt-7 sm:px-10" : "px-6 pb-4 pt-6"),
					children: [
						showCatalog && presentation === "takeover" ? (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								clearFeedback();
								setMode("catalog");
							},
							className: "mb-1 inline-flex w-fit items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground",
							children: [(0, import_jsx_runtime.jsx)(IconArrowLeft, { className: "h-3 w-3 rtl:-scale-x-100" }), t("mcpIntegrations.backToIntegrations")]
						}) : null,
						(0, import_jsx_runtime.jsx)(DialogTitle, { children: selected ? selectedRequiresSetup ? t("mcpIntegrations.setupTitle", { name: selected.name }) : t("mcpIntegrations.configureTitle", { name: selected.name }) : t("mcpIntegrations.customTitle") }),
						(0, import_jsx_runtime.jsx)(DialogDescription, { children: selected ? selectedRequiresSetup ? t("mcpIntegrations.providerSetupFormDescription") : selected.authMode === "none" ? t("mcpIntegrations.presetNoAuthDescription") : t("mcpIntegrations.presetAuthDescription") : t("mcpIntegrations.customDescription") })
					]
				}),
				(0, import_jsx_runtime.jsx)("div", {
					className: cn$1("min-h-0 flex-1 overflow-y-auto", presentation === "takeover" ? "px-7 py-7 sm:px-10" : "px-6 py-5"),
					children: (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-2xl space-y-3",
						children: [
							renderScopeSelector(),
							selected?.setupNoteKey && !selectedRequiresSetup ? (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-md bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground",
								children: t(selected.setupNoteKey)
							}) : null,
							selectedRequiresSetup && selected && (0, import_jsx_runtime.jsxs)("div", {
								className: cn$1("mx-auto grid w-full max-w-xl gap-4", presentation === "takeover" ? "py-8" : "py-1"),
								children: [
									presentation === "takeover" ? (0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("p", {
										className: "text-base font-semibold tracking-[-0.02em] text-foreground",
										children: t("mcpIntegrations.providerSetupRequired")
									}), (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm leading-6 text-muted-foreground",
										children: t("mcpIntegrations.providerSetupDescription", { name: selected.name })
									})] }) : null,
									selected.setupNoteKey ? (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm leading-6 text-muted-foreground",
										children: t(selected.setupNoteKey)
									}) : null,
									(0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2",
										children: [(0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [(0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium text-foreground",
												children: t("mcpIntegrations.personalConnection")
											}), (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] leading-relaxed text-muted-foreground",
												children: t("mcpIntegrations.personalDescription")
											})]
										}), (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 text-[11px] text-muted-foreground",
											children: t("mcpIntegrations.personal")
										})]
									}),
									selected.docsUrl ? (0, import_jsx_runtime.jsxs)("a", {
										href: selected.docsUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex w-fit items-center gap-1 text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground",
										children: [t("mcpIntegrations.viewSetup"), (0, import_jsx_runtime.jsx)(IconExternalLink, { className: "size-3.5" })]
									}) : null
								]
							}),
							!selected && (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 rounded-md bg-muted/30 px-3 py-2 text-[11px]",
								children: [(0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: customAuthMode === "oauth" ? t("mcpIntegrations.customOAuthDefault", { defaultValue: "Sign in with OAuth" }) : t("mcpIntegrations.customHeadersMode", { defaultValue: "Use an API key" })
								}), (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setCustomAuthMode((current) => current === "oauth" ? "headers" : "oauth");
										clearFeedback();
									},
									className: "font-medium text-foreground underline underline-offset-2 hover:text-muted-foreground",
									children: customAuthMode === "oauth" ? t("mcpIntegrations.useApiKeyInstead", { defaultValue: "Use an API key instead" }) : t("mcpIntegrations.useOAuthInstead", { defaultValue: "Use OAuth instead" })
								})]
							}),
							!selectedRequiresSetup && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								selected?.authMode === "oauth" && (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-[11px] leading-relaxed text-primary",
									children: t("mcpIntegrations.oauthNotice")
								}),
								(0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [(0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-[10px] font-medium text-muted-foreground",
										children: t("mcpIntegrations.serverName")
									}), (0, import_jsx_runtime.jsx)("input", {
										ref: inputRef,
										value: name,
										onChange: (event) => {
											setName(event.target.value);
											clearFeedback();
										},
										className: "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-ring",
										placeholder: t("mcpIntegrations.serverNamePlaceholder")
									})]
								}),
								(0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [(0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-[10px] font-medium text-muted-foreground",
										children: t("mcpIntegrations.url")
									}), (0, import_jsx_runtime.jsx)("input", {
										value: url,
										onChange: (event) => {
											setUrl(event.target.value);
											clearFeedback();
										},
										className: "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-ring",
										placeholder: t("mcpIntegrations.urlPlaceholder")
									})]
								}),
								(0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [(0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-[10px] font-medium text-muted-foreground",
										children: t("mcpIntegrations.fieldDescription")
									}), (0, import_jsx_runtime.jsx)("input", {
										value: description,
										onChange: (event) => {
											setDescription(event.target.value);
											clearFeedback();
										},
										className: "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-ring",
										placeholder: t("mcpIntegrations.descriptionPlaceholder")
									})]
								}),
								(selected ? selected.authMode !== "oauth" : customAuthMode === "headers") && (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [(0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-[10px] font-medium text-muted-foreground",
										children: t("mcpIntegrations.headers")
									}), (0, import_jsx_runtime.jsx)("textarea", {
										value: headersText,
										onChange: (event) => {
											setHeadersText(event.target.value);
											clearFeedback();
										},
										rows: 3,
										className: "w-full resize-y rounded-md border border-border bg-background px-2.5 py-1.5 text-[12px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-ring",
										style: { fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Menlo, Consolas, monospace" },
										placeholder: selected?.headerPlaceholder ?? t("mcpIntegrations.headersPlaceholder")
									})]
								}),
								selected?.docsUrl && (0, import_jsx_runtime.jsxs)("a", {
									href: selected.docsUrl,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground underline hover:text-foreground",
									children: [t("mcpIntegrations.openSetupDocs"), (0, import_jsx_runtime.jsx)(IconExternalLink, { className: "h-3 w-3" })]
								})
							] }),
							testResult && (0, import_jsx_runtime.jsxs)("div", {
								className: cn$1("flex items-start gap-1 rounded-md px-3 py-2 text-[11px] leading-snug", testResult.ok ? "bg-green-500/5 text-green-600 dark:text-green-400" : "bg-red-500/5 text-red-600 dark:text-red-400"),
								children: [testResult.ok && (0, import_jsx_runtime.jsx)(IconCheck, { className: "mt-0.5 h-3 w-3 shrink-0" }), (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 break-words",
									children: testResult.message
								})]
							}),
							error && (0, import_jsx_runtime.jsx)("div", {
								className: "break-words rounded-md bg-red-500/5 px-3 py-2 text-[11px] leading-snug text-red-600 dark:text-red-400",
								children: error
							})
						]
					})
				}),
				(0, import_jsx_runtime.jsxs)("div", {
					className: cn$1("flex shrink-0 items-center justify-between gap-2 border-t border-border py-4", presentation === "takeover" ? "px-7" : "px-6"),
					children: [
						!selectedRequiresSetup && (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: runTest,
							disabled: !url.trim() || busy,
							className: "rounded-md border border-border bg-background px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-accent disabled:pointer-events-none disabled:opacity-40",
							children: t("mcpIntegrations.test")
						}),
						!selected && customAuthMode === "oauth" ? (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: connectCustomWithOAuth,
							disabled: !oauthReady || !name.trim() || !url.trim() || busy,
							"aria-busy": busy,
							className: "rounded-md border border-border bg-background px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-accent disabled:pointer-events-none disabled:opacity-40",
							children: [busy && (0, import_jsx_runtime.jsx)(IconLoader2, { className: "me-1.5 inline h-3.5 w-3.5 animate-spin" }), t("mcpIntegrations.connectWithOAuth")]
						}) : null,
						selectedRequiresSetup ? (0, import_jsx_runtime.jsx)("div", {
							className: "ms-auto flex items-center gap-2",
							children: selected?.authMode === "oauth" && (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => connectWithOAuth(selected),
								disabled: !oauthReady || busy,
								"aria-busy": busy,
								className: "inline-flex min-w-[132px] items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40",
								children: [busy && (0, import_jsx_runtime.jsx)(IconLoader2, { className: "h-3.5 w-3.5 animate-spin" }), t("mcpIntegrations.continueToConnect")]
							})
						}) : selected?.authMode === "oauth" ? (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: connectSelectedWithOAuth,
							disabled: !oauthReady || !name.trim() || !url.trim() || busy,
							"aria-busy": busy,
							className: "inline-flex min-w-[92px] items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40",
							children: [busy && (0, import_jsx_runtime.jsx)(IconLoader2, { className: "h-3.5 w-3.5 animate-spin" }), t("mcpIntegrations.connectWithOAuth")]
						}) : !selected && customAuthMode === "oauth" ? null : (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: submitForm,
							disabled: !name.trim() || !url.trim() || busy,
							className: "inline-flex min-w-[92px] items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40",
							children: [busy && (0, import_jsx_runtime.jsx)(IconLoader2, { className: "h-3.5 w-3.5 animate-spin" }), t("mcpIntegrations.connect")]
						})
					]
				})
			] })]
		})
	});
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/onboarding/first-run-registry.js
var extensions = [];
/** Return app-specific first-run screens in registration order. */
function listFirstRunOnboardingExtensions() {
	return extensions;
}
//#endregion
//#region node_modules/.pnpm/@agent-native+core@0.182.1_66e6248338d49745bc05dddd924afb37/node_modules/@agent-native/core/dist/client/onboarding/FirstRunOnboarding.js
var FIRST_RUN_SCREEN_ORDER = [
	"intro",
	"choice",
	"manual",
	"tools",
	"role",
	"connecting",
	"ready"
];
function firstRunStepProperties(screen, extensions, extensionIndex) {
	if (screen === "extension") return {
		flow: "first_run",
		step_id: `extension:${extensions[extensionIndex]?.id ?? "unknown"}`,
		step_index: FIRST_RUN_SCREEN_ORDER.length + extensionIndex,
		...extensions[extensionIndex] ? { extension_id: extensions[extensionIndex].id } : {}
	};
	return {
		flow: "first_run",
		step_id: screen,
		step_index: FIRST_RUN_SCREEN_ORDER.indexOf(screen)
	};
}
var FIRST_RUN_ROLE_OPTIONS = [
	{
		value: "product",
		labelKey: "agentChat.onboarding.roleProduct"
	},
	{
		value: "design",
		labelKey: "agentChat.onboarding.roleDesign"
	},
	{
		value: "developer",
		labelKey: "agentChat.onboarding.roleDeveloper"
	},
	{
		value: "marketing",
		labelKey: "agentChat.onboarding.roleMarketing"
	},
	{
		value: "sales",
		labelKey: "agentChat.onboarding.roleSales"
	},
	{
		value: "ops",
		labelKey: "agentChat.onboarding.roleOps"
	},
	{
		value: "individual",
		labelKey: "agentChat.onboarding.roleIndividual"
	},
	{
		value: "other",
		labelKey: "agentChat.onboarding.roleOther"
	}
];
var BUILDER_MORE_SERVICES = [
	"Voice input",
	"Background agents",
	"Image generation",
	"Video generation",
	"Connected agents",
	"Hosting and deployment",
	"Browser automation",
	"Embeddings"
];
function integrationTrackingProperties(integration, scope) {
	return {
		flow: "first_run",
		step_id: "tools",
		integration_id: integration.id,
		connection_mode: integration.connectionMode,
		auth_mode: integration.authMode,
		availability: integration.availability,
		...scope ? { scope } : {}
	};
}
function tryNavigateToMcpOAuthStart(url) {
	try {
		return navigateToMcpOAuthStart(url);
	} catch {
		return false;
	}
}
function FirstRunOnboarding({ skipIntegrations = shouldSkipFirstRunIntegrations(), initialFirstRun = false } = {}) {
	const t = useT();
	const builderMoreServicesTitleId = import_react.useId();
	const previewMode = useOnboardingPreviewMode();
	const previewStep = useOnboardingPreviewStep();
	const { firstRun, loading, error, profile, completeFirstRun, completeFirstRunError } = useOnboarding({
		preview: previewMode,
		initialFirstRun
	});
	const [screen, setScreen] = (0, import_react.useState)(() => previewStep === "references" ? "extension" : previewStep ?? "intro");
	const [extensionIndex, setExtensionIndex] = (0, import_react.useState)(0);
	const [selectedRole, setSelectedRole] = (0, import_react.useState)(null);
	const [savingRole, setSavingRole] = (0, import_react.useState)(false);
	const [roleSaveError, setRoleSaveError] = (0, import_react.useState)(null);
	const [integrationQuery, setIntegrationQuery] = (0, import_react.useState)("");
	const [integrationDialogId, setIntegrationDialogId] = (0, import_react.useState)(null);
	const [connectingIntegrationId, setConnectingIntegrationId] = (0, import_react.useState)(null);
	const [connectError, setConnectError] = (0, import_react.useState)(null);
	const [builderConnectionMode, setBuilderConnectionMode] = (0, import_react.useState)("existing");
	const extensions = (0, import_react.useMemo)(() => listFirstRunOnboardingExtensions(), []);
	(0, import_react.useEffect)(() => {
		if (!previewMode || !previewStep) return;
		setScreen(previewStep === "references" ? "extension" : previewStep);
	}, [previewMode, previewStep]);
	const mcpCatalog = (0, import_react.useMemo)(() => getDefaultMcpIntegrations(), []);
	const mcpServersQuery = useMcpServers();
	const createMcpServer = useCreateMcpServer();
	const mcpIntegrations = (0, import_react.useMemo)(() => filterMcpIntegrations(integrationQuery, mcpCatalog), [integrationQuery, mcpCatalog]);
	const trackFirstRunStepCompleted = (0, import_react.useCallback)((stepScreen, stepExtensionIndex = extensionIndex) => {
		if (previewMode) return;
		trackOnboardingEvent("onboarding_step_completed", firstRunStepProperties(stepScreen, extensions, stepExtensionIndex));
	}, [
		extensionIndex,
		extensions,
		previewMode
	]);
	const trackFirstRunStepSkipped = (0, import_react.useCallback)((stepScreen, reason = "user_action", stepExtensionIndex = extensionIndex) => {
		if (previewMode) return;
		trackOnboardingEvent("onboarding_step_skipped", {
			...firstRunStepProperties(stepScreen, extensions, stepExtensionIndex),
			reason
		});
	}, [
		extensionIndex,
		extensions,
		previewMode
	]);
	const completionAttemptRef = (0, import_react.useRef)(null);
	const finishOnboarding = (0, import_react.useCallback)(async (completedScreen, completedExtensionIndex = extensionIndex) => {
		completionAttemptRef.current = completedScreen ? {
			screen: completedScreen,
			extensionIndex: completedExtensionIndex
		} : {
			screen: null,
			extensionIndex: completedExtensionIndex
		};
		try {
			await completeFirstRun();
			if (completedScreen) trackFirstRunStepCompleted(completedScreen, completedExtensionIndex);
			completionAttemptRef.current = null;
			return true;
		} catch {
			return false;
		}
	}, [
		completeFirstRun,
		extensionIndex,
		trackFirstRunStepCompleted
	]);
	(0, import_react.useEffect)(() => {
		if (!previewMode && firstRun && !loading && profile) trackOnboardingEvent("onboarding_started", { flow: "first_run" });
	}, [
		firstRun,
		loading,
		previewMode,
		profile
	]);
	(0, import_react.useEffect)(() => {
		if (previewMode || !firstRun || loading || !profile) return;
		trackOnboardingEvent("onboarding_step_viewed", firstRunStepProperties(screen, extensions, extensionIndex));
	}, [
		extensionIndex,
		extensions,
		firstRun,
		loading,
		previewMode,
		profile,
		screen
	]);
	const connectedServers = (0, import_react.useMemo)(() => {
		if (previewMode) return [];
		return [...mcpServersQuery.data?.user ?? [], ...mcpServersQuery.data?.org ?? []].filter((server) => server.status.state === "connected");
	}, [mcpServersQuery.data, previewMode]);
	const hasOrg = Boolean(mcpServersQuery.data?.orgId);
	const canCreateOrgMcp = Boolean(hasOrg && (mcpServersQuery.data?.role === "owner" || mcpServersQuery.data?.role === "admin"));
	const showTools = (0, import_react.useCallback)(() => setScreen(skipIntegrations ? "role" : "tools"), [skipIntegrations]);
	const handleBuilderConnected = (0, import_react.useCallback)(() => {
		trackFirstRunStepCompleted("choice");
		trackFirstRunStepCompleted("connecting");
		showTools();
	}, [showTools, trackFirstRunStepCompleted]);
	const roleBackScreen = skipIntegrations ? "manual" : "tools";
	const connectFlow = useBuilderConnectFlow({
		enabled: firstRun && !previewMode,
		provisionAccount: true,
		trackingSource: "first_run_onboarding",
		trackingFlow: "connect_llm",
		onConnected: handleBuilderConnected
	});
	const canActivateBuilderFreeCredits = connectFlow.agentNativeProvisioningEnabled;
	const builderCtaRef = (0, import_react.useRef)(null);
	const dismissOnboarding = (0, import_react.useCallback)(() => {
		if (!previewMode) trackOnboardingEvent("onboarding_dismissed", {
			...firstRunStepProperties(screen, extensions, extensionIndex),
			reason: "user_action"
		});
		finishOnboarding(null);
	}, [
		extensionIndex,
		extensions,
		finishOnboarding,
		previewMode,
		screen
	]);
	const completionErrorProps = {
		completionError: completeFirstRunError,
		onRetry: (0, import_react.useCallback)(() => {
			const attempt = completionAttemptRef.current;
			finishOnboarding(attempt?.screen ?? null, attempt?.extensionIndex ?? extensionIndex);
		}, [extensionIndex, finishOnboarding])
	};
	if (!firstRun) return null;
	if (error) return (0, import_jsx_runtime.jsx)(OnboardingShell, {
		profile,
		screen: "choice",
		onDismiss: dismissOnboarding,
		...completionErrorProps,
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-md flex-col items-center gap-4 text-center",
			children: [
				(0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-[-0.03em]",
					children: "Setup is almost ready."
				}),
				(0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "We could not load the connection options yet."
				}),
				(0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: primaryButtonClass,
					onClick: () => window.location.reload(),
					children: "Try again"
				})
			]
		})
	});
	if (loading || !profile) return (0, import_jsx_runtime.jsx)(OnboardingSkeleton, {});
	const builderCapabilities = profile.capabilities.filter((capability) => capability.builderIncluded);
	const handleBuilder = (provisionAccount = canActivateBuilderFreeCredits) => {
		if (previewMode) {
			showTools();
			return;
		}
		if (connectFlow.hasFetchedStatus && connectFlow.configured) {
			trackFirstRunStepCompleted("choice");
			showTools();
			return;
		}
		setBuilderConnectionMode(provisionAccount && canActivateBuilderFreeCredits ? "provision" : "existing");
		setScreen("connecting");
		connectFlow.start({
			trackingSource: "first_run_onboarding",
			trackingFlow: "connect_llm",
			provisionAccount
		});
	};
	const handleOpenSettings = async () => {
		if (!await finishOnboarding("manual")) return;
		if (typeof window === "undefined") return;
		window.history.pushState(null, "", `${appPath(buildSettingsRoute("agent:llm"))}${window.location.search}`);
		window.dispatchEvent(new Event("popstate"));
	};
	const handleFinish = (completeStep = true) => {
		if (extensions.length === 0) {
			finishOnboarding(completeStep ? "role" : null);
			return;
		}
		if (completeStep) trackFirstRunStepCompleted("role");
		setExtensionIndex(0);
		setScreen("extension");
	};
	const handleRoleContinue = async () => {
		if (!selectedRole || savingRole) return;
		setSavingRole(true);
		setRoleSaveError(null);
		try {
			if (!previewMode) await saveFirstRunOnboardingRole(selectedRole);
			handleFinish();
		} catch (error) {
			setRoleSaveError(error instanceof Error ? error.message : t("agentChat.onboarding.saveRoleError"));
		} finally {
			setSavingRole(false);
		}
	};
	const returnUrl = typeof window === "undefined" ? "/" : window.location.pathname + window.location.search + window.location.hash;
	const connectIntegration = async (integration) => {
		if (previewMode) {
			setScreen("ready");
			return;
		}
		setConnectError(null);
		trackOnboardingEvent("integration_cta_clicked", integrationTrackingProperties(integration));
		if (connectedServers.some((server) => isMcpIntegrationUrl(integration, server.url)) || connectingIntegrationId === integration.id) return;
		if (!mcpServersQuery.isSuccess) return;
		if (hasOrg) {
			setIntegrationDialogId(integration.id);
			trackOnboardingEvent("integration_dialog_opened", integrationTrackingProperties(integration));
			return;
		}
		if (!integration.url.trim()) {
			setIntegrationDialogId(integration.id);
			trackOnboardingEvent("integration_dialog_opened", integrationTrackingProperties(integration));
			return;
		}
		if (integration.authMode === "none" && integration.connectionMode === "direct") {
			setConnectingIntegrationId(integration.id);
			trackOnboardingEvent("integration_connect_started", integrationTrackingProperties(integration, "user"));
			try {
				await createMcpServer.mutateAsync({
					scope: "user",
					name: integration.name,
					url: integration.url,
					description: integration.description
				});
				trackOnboardingEvent("integration_connect_completed", integrationTrackingProperties(integration, "user"));
			} catch (error) {
				trackOnboardingEvent("integration_connect_failed", {
					...integrationTrackingProperties(integration, "user"),
					error_type: error instanceof Error ? error.name : "unknown"
				});
				setConnectError(formatMcpServerError(error instanceof Error ? error.message : String(error)));
			} finally {
				setConnectingIntegrationId(null);
			}
			return;
		}
		if (integration.authMode === "oauth" && integration.connectionMode === "oauth" && integration.availability === "ready" && !requiresMcpIntegrationOrganizationScope(integration)) {
			trackOnboardingEvent("integration_connect_started", integrationTrackingProperties(integration, "user"));
			if (!tryNavigateToMcpOAuthStart(appPath(buildMcpOAuthStartUrl({
				name: integration.name,
				url: integration.url,
				description: integration.description,
				scope: "user",
				returnUrl,
				trackingFlow: "first_run",
				trackingIntegrationId: integration.id
			})))) {
				trackOnboardingEvent("integration_connect_failed", {
					...integrationTrackingProperties(integration, "user"),
					error_type: "popup_or_navigation_blocked"
				});
				setConnectError(t("mcpIntegrations.connectionError"));
			}
			return;
		}
		setIntegrationDialogId(integration.id);
		trackOnboardingEvent("integration_dialog_opened", integrationTrackingProperties(integration));
	};
	const handleCreateMcpServer = async (args) => {
		const integration = mcpCatalog.find((candidate) => candidate.id === integrationDialogId);
		if (!integration) return createMcpServer.mutateAsync(args);
		const properties = integrationTrackingProperties(integration, args.scope);
		trackOnboardingEvent("integration_connect_started", properties);
		try {
			const result = await createMcpServer.mutateAsync(args);
			trackOnboardingEvent("integration_connect_completed", properties);
			return result;
		} catch (error) {
			trackOnboardingEvent("integration_connect_failed", {
				...properties,
				error_type: error instanceof Error ? error.name : "unknown"
			});
			throw error;
		}
	};
	const handleMcpOAuthStart = (url) => {
		const integration = mcpCatalog.find((candidate) => candidate.id === integrationDialogId);
		const scope = URL.canParse(url, window.location.origin) ? new URL(url, window.location.origin).searchParams.get("scope") : null;
		if (integration) trackOnboardingEvent("integration_connect_started", integrationTrackingProperties(integration, scope ?? "user"));
		if (!tryNavigateToMcpOAuthStart(url)) {
			if (integration) trackOnboardingEvent("integration_connect_failed", {
				...integrationTrackingProperties(integration, scope ?? "user"),
				error_type: "popup_or_navigation_blocked"
			});
			throw new Error(t("mcpIntegrations.connectionError"));
		}
	};
	if (screen === "extension") {
		const extension = extensions[extensionIndex];
		if (!extension) {
			finishOnboarding(null);
			return null;
		}
		const Extension = extension.component;
		const advanceExtension = () => {
			if (extensionIndex < extensions.length - 1) {
				trackFirstRunStepCompleted("extension", extensionIndex);
				setExtensionIndex((current) => current + 1);
				return;
			}
			finishOnboarding("extension", extensionIndex);
		};
		return (0, import_jsx_runtime.jsx)(OnboardingShell, {
			profile,
			screen: "extension",
			onDismiss: dismissOnboarding,
			...completionErrorProps,
			children: (0, import_jsx_runtime.jsx)(Extension, {
				onComplete: advanceExtension,
				onSkip: () => {
					trackFirstRunStepSkipped("extension", "user_action", extensionIndex);
					finishOnboarding(null);
				}
			})
		});
	}
	if (screen === "intro") return (0, import_jsx_runtime.jsx)(OnboardingShell, {
		profile,
		screen: "intro",
		onDismiss: dismissOnboarding,
		...completionErrorProps,
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-lg flex-col items-center text-center",
			children: [
				(0, import_jsx_runtime.jsxs)("h1", {
					className: "text-3xl font-semibold tracking-[-0.05em] sm:text-4xl",
					children: [
						"Free forever.",
						(0, import_jsx_runtime.jsx)("br", {}),
						(0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "Open source for life."
						})
					]
				}),
				(0, import_jsx_runtime.jsxs)("div", {
					className: "mt-7 grid w-full gap-2 text-left sm:grid-cols-3",
					children: [
						(0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-muted/35 px-3 py-3",
							children: [(0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium",
								children: "Fully customizable"
							}), (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] leading-4 text-muted-foreground",
								children: "Change the UI, code, and behavior."
							})]
						}),
						(0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-muted/35 px-3 py-3",
							children: [(0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium",
								children: "Bring your own keys"
							}), (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] leading-4 text-muted-foreground",
								children: "Use your own providers and accounts."
							})]
						}),
						(0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-muted/35 px-3 py-3",
							children: [(0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium",
								children: "Build your own"
							}), (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] leading-4 text-muted-foreground",
								children: "Mix and match toolkit pieces in your own apps."
							})]
						})
					]
				}),
				(0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: cn$1(primaryButtonClass, "mt-6"),
					onClick: () => {
						trackFirstRunStepCompleted("intro");
						setScreen("choice");
					},
					children: ["Continue", (0, import_jsx_runtime.jsx)(IconArrowRight, { size: 15 })]
				}),
				(0, import_jsx_runtime.jsxs)("a", {
					href: "https://github.com/builderio/agent-native",
					target: "_blank",
					rel: "noreferrer",
					className: "mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					children: [
						(0, import_jsx_runtime.jsx)(IconBrandGithub, { size: 14 }),
						(0, import_jsx_runtime.jsx)("span", { children: "View source" }),
						(0, import_jsx_runtime.jsx)(IconExternalLink, { size: 13 })
					]
				})
			]
		})
	});
	if (screen === "choice") return (0, import_jsx_runtime.jsx)(OnboardingShell, {
		profile,
		screen: "choice",
		onDismiss: dismissOnboarding,
		...completionErrorProps,
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-3xl flex-col gap-4",
			children: [
				(0, import_jsx_runtime.jsx)("h1", {
					className: "text-center text-xl font-semibold tracking-[-0.04em] sm:text-2xl",
					children: "Choose your setup."
				}),
				(0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [(0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-primary/[0.06] p-4 shadow-sm",
						children: [
							(0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold",
								children: (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "first-run-builder-header-activate",
									className: "group flex w-full items-start justify-between gap-3 rounded-md text-left transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									onClick: () => builderCtaRef.current?.click(),
									children: [(0, import_jsx_runtime.jsx)("span", { children: canActivateBuilderFreeCredits ? t("agentChat.onboarding.builderActivateCredits") : t("agentChat.onboarding.builderConnectCredits") }), (0, import_jsx_runtime.jsx)(IconArrowRight, {
										"aria-hidden": "true",
										className: "mt-0.5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5",
										size: 17
									})]
								})
							}), (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-xs text-xs leading-5 text-muted-foreground",
								children: canActivateBuilderFreeCredits ? t("agentChat.onboarding.builderActivateDescription") : (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"One click connects",
									" ",
									(0, import_jsx_runtime.jsx)("a", {
										href: "https://www.builder.io/",
										target: "_blank",
										rel: "noreferrer",
										className: "text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
										children: "Builder.io free credits"
									}),
									" ",
									"with the services this app needs."
								] })
							})] }),
							(0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 pt-3",
								children: [(0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-medium text-muted-foreground",
									children: canActivateBuilderFreeCredits ? t("agentChat.onboarding.builderActiveCredits") : t("agentChat.onboarding.builderCredits")
								}), (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]",
									children: [
										builderCapabilities.map((capability, index) => {
											const copy = getCapabilityCopy(t, capability);
											return (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [index > 0 && (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												className: "text-muted-foreground",
												children: "·"
											}), (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-0.5",
												children: [(0, import_jsx_runtime.jsx)("span", { children: copy.label }), capability.id === "design-system-intelligence" && (0, import_jsx_runtime.jsx)(CapabilityInfoButton, {
													why: copy.why,
													ariaLabel: t("agentChat.onboarding.capability.about", {
														defaultValue: "About {{label}}",
														label: copy.label
													})
												})]
											})] }, capability.id);
										}),
										(0, import_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											className: "text-muted-foreground",
											children: "·"
										}),
										(0, import_jsx_runtime.jsxs)(Popover, { children: [(0, import_jsx_runtime.jsx)(PopoverTrigger, {
											asChild: true,
											children: (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
												"aria-label": `See ${BUILDER_MORE_SERVICES.length} more services included with Builder.io free credits`,
												children: [
													"+",
													BUILDER_MORE_SERVICES.length,
													" more"
												]
											})
										}), (0, import_jsx_runtime.jsxs)(PopoverContent, {
											side: "top",
											align: "start",
											sideOffset: 6,
											"aria-labelledby": builderMoreServicesTitleId,
											className: "w-[min(24rem,calc(100vw-2rem))] text-xs",
											children: [(0, import_jsx_runtime.jsx)("p", {
												id: builderMoreServicesTitleId,
												className: "font-medium",
												children: "Also included with Builder.io free credits"
											}), (0, import_jsx_runtime.jsx)("ul", {
												className: "mt-2 list-disc space-y-1 ps-4 leading-5",
												children: BUILDER_MORE_SERVICES.map((service) => (0, import_jsx_runtime.jsx)("li", { children: service }, service))
											})]
										})] })
									]
								})]
							}),
							(0, import_jsx_runtime.jsx)(BuilderConnectPopover, {
								flow: connectFlow,
								onConnect: (provisionAccount) => handleBuilder(provisionAccount),
								defaultProvisionAccount: true,
								contentTestId: "first-run-builder-consent",
								primaryTestId: "first-run-builder-create-and-activate",
								secondaryTestId: "first-run-builder-existing-account",
								children: (0, import_jsx_runtime.jsxs)("button", {
									ref: builderCtaRef,
									type: "button",
									"data-testid": "first-run-connect-builder",
									className: cn$1(primaryButtonClass, "mt-5 w-full"),
									children: [t(canActivateBuilderFreeCredits ? "agentChat.onboarding.builderActivateCredits" : "agentChat.onboarding.builderConnectCredits"), (0, import_jsx_runtime.jsx)(IconArrowRight, { size: 15 })]
								})
							}),
							connectFlow.error && !connectFlow.statusResolved && (0, import_jsx_runtime.jsx)("p", {
								role: "status",
								"data-testid": "first-run-builder-status-error",
								className: "mt-2 text-center text-xs text-destructive",
								children: connectFlow.error
							})
						]
					}), (0, import_jsx_runtime.jsxs)("div", {
						role: "button",
						tabIndex: 0,
						"aria-label": "Use my own keys",
						"data-testid": "first-run-use-own-keys",
						className: "rounded-xl bg-muted/35 p-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						onClick: () => {
							trackFirstRunStepCompleted("choice");
							setScreen("manual");
						},
						onKeyDown: (event) => {
							if (event.key !== "Enter" && event.key !== " ") return;
							event.preventDefault();
							trackFirstRunStepCompleted("choice");
							setScreen("manual");
						},
						children: [(0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [(0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold",
								children: "Use my own keys"
							}), (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "See what this app needs"
							})] }), (0, import_jsx_runtime.jsx)(IconKey, {
								className: "text-muted-foreground",
								size: 17
							})]
						}), (0, import_jsx_runtime.jsx)(CapabilityList, {
							capabilities: profile.capabilities,
							compact: true,
							className: "mt-5 pt-3"
						})]
					})]
				}),
				(0, import_jsx_runtime.jsxs)("p", {
					"data-testid": "first-run-local-provider-note",
					className: "mx-auto max-w-2xl text-center text-[11px] leading-5 text-muted-foreground",
					children: [
						"Or set",
						" ",
						(0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-muted px-1",
							children: "ANTHROPIC_API_KEY"
						}),
						" ",
						"or ",
						(0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-muted px-1",
							children: "OPENAI_API_KEY"
						}),
						" ",
						"in ",
						(0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-muted px-1",
							children: ".env"
						}),
						" to make that provider available to everyone using this app.",
						" ",
						(0, import_jsx_runtime.jsxs)("a", {
							href: docsUrl("environment-variables"),
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-1 text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: ["Read the setup guide", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 12 })]
						})
					]
				})
			]
		})
	});
	if (screen === "manual") return (0, import_jsx_runtime.jsx)(OnboardingShell, {
		profile,
		screen: "choice",
		onDismiss: dismissOnboarding,
		...completionErrorProps,
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-xl flex-col gap-4",
			children: [(0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mb-4 text-xs text-muted-foreground hover:text-foreground",
				onClick: () => setScreen("choice"),
				children: "Back"
			}), (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold tracking-[-0.04em] sm:text-2xl",
				children: "Your keys"
			})] }), (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-muted/35 p-4",
				children: [(0, import_jsx_runtime.jsx)(CapabilityList, { capabilities: profile.capabilities }), (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap items-center justify-between gap-3 pt-4",
					children: [(0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: secondaryButtonClass,
						onClick: () => setScreen("choice"),
						children: "Back"
					}), (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [(0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-testid": "first-run-skip-keys",
							className: "text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							onClick: () => {
								trackFirstRunStepSkipped("manual");
								showTools();
							},
							children: t("agentChat.onboarding.skipForNow")
						}), (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "first-run-open-key-settings",
							className: primaryButtonClass,
							onClick: () => void handleOpenSettings(),
							children: [t("agentChat.onboarding.openAiKeySettings", { defaultValue: "Open AI key settings" }), (0, import_jsx_runtime.jsx)(IconArrowRight, { size: 15 })]
						})]
					})]
				})]
			})]
		})
	});
	if (screen === "tools") return (0, import_jsx_runtime.jsxs)(OnboardingShell, {
		profile,
		screen: "tools",
		onDismiss: dismissOnboarding,
		...completionErrorProps,
		footer: (0, import_jsx_runtime.jsxs)("div", {
			"data-testid": "onboarding-tools-footer",
			className: "mx-auto flex w-full max-w-3xl flex-wrap items-center justify-end gap-2",
			children: [(0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: secondaryButtonClass,
				onClick: () => {
					trackFirstRunStepSkipped("tools");
					setScreen("role");
				},
				children: t("agentChat.onboarding.skipForNow")
			}), (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: primaryButtonClass,
				onClick: () => {
					trackFirstRunStepCompleted("tools");
					setScreen("role");
				},
				children: [t("agentChat.common.continue"), (0, import_jsx_runtime.jsx)(IconArrowRight, { size: 15 })]
			})]
		}),
		children: [(0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-4xl flex-col gap-5",
			children: [(0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-[-0.05em] sm:text-3xl",
				children: "This app is an agent."
			}), (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground",
				children: "Connect the tools your agent can use to gather context and take action. You can add more later in Settings."
			})] }), (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [(0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 pb-4",
					children: [
						(0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [(0, import_jsx_runtime.jsx)("div", { children: (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-foreground",
								children: "Agent integrations"
							}) }), (0, import_jsx_runtime.jsxs)("label", {
								className: "relative w-full max-w-xs",
								children: [(0, import_jsx_runtime.jsx)(IconSearch, { className: "pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), (0, import_jsx_runtime.jsx)("input", {
									value: integrationQuery,
									onChange: (event) => setIntegrationQuery(event.target.value),
									className: "h-9 w-full rounded-md border border-border bg-background pe-3 ps-8 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-ring",
									placeholder: "Search integrations",
									"aria-label": "Search integrations"
								})]
							})]
						}),
						connectError && (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-5 text-destructive",
							children: connectError
						}),
						mcpServersQuery.isError ? (0, import_jsx_runtime.jsxs)("div", {
							role: "alert",
							className: "rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive",
							children: [(0, import_jsx_runtime.jsx)("p", { children: formatMcpServersLoadError(mcpServersQuery.error) }), (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void mcpServersQuery.refetch(),
								disabled: mcpServersQuery.isFetching,
								className: "mt-2 font-medium underline underline-offset-2 hover:text-foreground disabled:cursor-wait disabled:opacity-60",
								children: mcpServersQuery.isFetching ? "Retrying…" : "Retry"
							})]
						}) : null
					]
				}), (0, import_jsx_runtime.jsx)(IntegrationGrid, {
					items: mcpIntegrations.map((integration) => {
						const connected = connectedServers.some((server) => isMcpIntegrationUrl(integration, server.url));
						return {
							id: integration.id,
							name: integration.name,
							description: integration.description,
							logo: (0, import_jsx_runtime.jsx)(McpIntegrationLogo, {
								name: integration.name,
								logoUrl: integration.logoUrl,
								integrationId: integration.id,
								className: "size-7 rounded-md",
								imageClassName: "size-full p-1"
							}),
							status: connected ? "Connected" : void 0,
							statusClassName: "text-emerald-600 dark:text-emerald-400",
							actionLabel: connected ? "Connected" : "Connect",
							disabled: connected || connectingIntegrationId === integration.id || !mcpServersQuery.isSuccess,
							onAction: () => void connectIntegration(integration)
						};
					}),
					emptyLabel: "No integrations match."
				})]
			})]
		}), integrationDialogId && (0, import_jsx_runtime.jsx)(McpIntegrationDialog, {
			open: true,
			onOpenChange: (open) => {
				if (!open) setIntegrationDialogId(null);
			},
			connectIntegrationId: integrationDialogId,
			defaultScope: "user",
			canCreateOrgMcp,
			hasOrg,
			onCreateMcpServer: handleCreateMcpServer,
			onOAuthStart: handleMcpOAuthStart,
			trackingFlow: "first_run",
			trackingIntegrationId: integrationDialogId
		})]
	});
	if (screen === "role") return (0, import_jsx_runtime.jsx)(OnboardingShell, {
		profile,
		screen: "role",
		onDismiss: dismissOnboarding,
		...completionErrorProps,
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-md flex-col",
			"data-testid": "first-run-role",
			children: [
				(0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mb-5 self-start text-xs text-muted-foreground hover:text-foreground",
					onClick: () => setScreen(roleBackScreen),
					children: t("agentChat.onboarding.back")
				}),
				(0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-[-0.05em] sm:text-3xl",
					children: t("agentChat.onboarding.customizeRole")
				}),
				(0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("agentChat.onboarding.roleQuestion")
				}),
				(0, import_jsx_runtime.jsxs)("fieldset", {
					className: "mt-7 grid gap-2",
					children: [(0, import_jsx_runtime.jsx)("legend", {
						className: "sr-only",
						children: t("agentChat.onboarding.chooseRole")
					}), FIRST_RUN_ROLE_OPTIONS.map(({ value, labelKey }) => (0, import_jsx_runtime.jsxs)("label", {
						"data-testid": `first-run-role-${value}`,
						className: cn$1("flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring", selectedRole === value ? "bg-primary/[0.06] ring-1 ring-primary/30" : "bg-muted/35 hover:bg-muted/50"),
						children: [(0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "first-run-role",
							value,
							checked: selectedRole === value,
							onChange: () => {
								setSelectedRole(value);
								trackOnboardingEvent("onboarding_role_option_selected", {
									flow: "first_run",
									step_id: "role",
									role: value
								});
							},
							className: "size-4 accent-primary"
						}), (0, import_jsx_runtime.jsx)("span", { children: t(labelKey) })]
					}, value))]
				}),
				roleSaveError && (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs leading-5 text-destructive",
					role: "alert",
					children: roleSaveError
				}),
				(0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-between gap-2",
					children: [(0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: secondaryButtonClass,
						onClick: () => {
							trackFirstRunStepSkipped("role");
							handleFinish(false);
						},
						disabled: savingRole,
						children: t("agentChat.onboarding.skipForNow")
					}), (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: primaryButtonClass,
						onClick: () => void handleRoleContinue(),
						disabled: !selectedRole || savingRole,
						children: [savingRole ? t("agentChat.common.saving") : t("agentChat.common.continue"), !savingRole && (0, import_jsx_runtime.jsx)(IconArrowRight, { size: 15 })]
					})]
				})
			]
		})
	});
	if (screen === "connecting") {
		const accountExists = connectFlow.accountExists;
		const provisioning = builderConnectionMode === "provision" && !accountExists;
		return (0, import_jsx_runtime.jsx)(OnboardingShell, {
			profile,
			screen: "choice",
			onDismiss: dismissOnboarding,
			...completionErrorProps,
			children: (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-md flex-col items-center text-center",
				role: "status",
				"aria-live": "polite",
				"aria-busy": connectFlow.connecting,
				children: [
					(0, import_jsx_runtime.jsx)("div", {
						className: "flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary",
						children: accountExists ? (0, import_jsx_runtime.jsx)(IconKey, { size: 19 }) : (0, import_jsx_runtime.jsx)(IconLoader2, {
							className: "animate-spin",
							size: 19
						})
					}),
					(0, import_jsx_runtime.jsx)("h1", {
						className: "mt-5 text-xl font-semibold tracking-[-0.04em]",
						children: accountExists ? t("agentChat.onboarding.builderAccountExistsTitle") : provisioning ? t("agentChat.onboarding.builderActivating") : t("agentChat.onboarding.builderConnecting")
					}),
					(0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: accountExists ? t("agentChat.onboarding.builderAccountExistsDescription") : provisioning ? t("agentChat.onboarding.builderProvisioningDescription") : t("agentChat.onboarding.builderConnectionDescription")
					}),
					accountExists ? (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn$1(primaryButtonClass, "mt-7 w-full"),
						onClick: () => handleBuilder(false),
						disabled: connectFlow.connecting,
						children: [t("agentChat.auth.logIn"), (0, import_jsx_runtime.jsx)(IconArrowRight, { size: 15 })]
					}) : (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 w-full rounded-xl bg-muted/35 p-4 text-left",
						children: [
							(0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [(0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-28" }), (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-16 rounded-full" })]
							}),
							(0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-8 w-full" }),
							(0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-3 gap-2",
								children: [
									(0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-full" }),
									(0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-full" }),
									(0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-full" })
								]
							})
						]
					}), connectFlow.error && (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col items-center gap-2",
						children: [(0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: connectFlow.error
						}), (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: secondaryButtonClass,
							onClick: () => setScreen("choice"),
							children: "Try again"
						})]
					})] })
				]
			})
		});
	}
	return (0, import_jsx_runtime.jsx)(OnboardingShell, {
		profile,
		screen: "ready",
		onDismiss: dismissOnboarding,
		...completionErrorProps,
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-2xl flex-col items-center text-center",
			children: [
				(0, import_jsx_runtime.jsx)("div", {
					className: "flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary",
					children: (0, import_jsx_runtime.jsx)(IconCheck, { size: 20 })
				}),
				(0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 text-xl font-semibold tracking-[-0.04em]",
					children: "Your agent is ready."
				}),
				(0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-md text-sm leading-6 text-muted-foreground",
					children: "Start with a chat, then connect more tools whenever you need them."
				}),
				(0, import_jsx_runtime.jsx)("div", {
					className: "mt-7 grid w-full gap-2 text-left sm:grid-cols-3",
					children: (skipIntegrations ? [
						["Workflow actions", "Use the app's buttons and sidebar to run the workflow."],
						["AI sidebar", "Ask the agent to review or refine a step in context."],
						["Flexible providers", "Use Builder.io free credits or your own keys."]
					] : [
						["Chat + actions", "Ask your agent to work across the app."],
						["Agent integrations", "Connect tools from Settings anytime."],
						["Flexible providers", "Use Builder.io free credits or your own keys."]
					]).map(([title, description]) => (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-muted/35 px-4 py-4",
						children: [
							(0, import_jsx_runtime.jsx)("span", {
								className: "flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary",
								children: (0, import_jsx_runtime.jsx)(IconCheck, { size: 14 })
							}),
							(0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-medium",
								children: title
							}),
							(0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-5 text-muted-foreground",
								children: description
							})
						]
					}, title))
				}),
				(0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "first-run-open-app",
					className: cn$1(primaryButtonClass, "mt-7"),
					onClick: () => void finishOnboarding("ready"),
					children: ["Open app", (0, import_jsx_runtime.jsx)(IconArrowRight, { size: 15 })]
				})
			]
		})
	});
}
function OnboardingShell({ profile, screen, footer, onDismiss, completionError, onRetry, children }) {
	const t = useT();
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100] flex h-full min-h-0 flex-col bg-background text-foreground",
		"data-onboarding-screen": screen,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `${profile?.appName ?? "Your app"} setup`,
		children: [
			onDismiss ? (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-testid": "first-run-dismiss",
				"aria-label": t("agentChat.common.dismiss"),
				onClick: onDismiss,
				className: "absolute end-4 top-4 z-10 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				children: (0, import_jsx_runtime.jsx)(IconX, { size: 17 })
			}) : null,
			(0, import_jsx_runtime.jsx)("div", {
				className: "h-0.5 shrink-0 bg-muted",
				"data-testid": "onboarding-progress",
				children: (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-primary transition-[width] duration-200",
					style: { width: screen === "intro" ? "33.33%" : screen === "tools" || screen === "role" || screen === "ready" || screen === "extension" ? "100%" : "66.66%" }
				})
			}),
			(0, import_jsx_runtime.jsx)("main", {
				className: cn$1("flex min-h-0 flex-1 overflow-y-auto px-5 sm:px-8", screen === "tools" ? "items-start py-8" : "items-center py-10"),
				children: (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full max-w-3xl",
					children
				})
			}),
			footer && (0, import_jsx_runtime.jsx)("footer", {
				className: "shrink-0 border-t border-border bg-background/95 px-5 py-3 backdrop-blur-sm sm:px-8",
				children: footer
			}),
			completionError && onRetry ? (0, import_jsx_runtime.jsx)(FirstRunCompletionError, {
				message: completionError,
				onRetry
			}) : null
		]
	});
}
function OnboardingSkeleton() {
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100] flex h-full min-h-0 flex-col bg-background",
		"data-onboarding-loading": "true",
		"aria-busy": "true",
		children: [(0, import_jsx_runtime.jsx)(Skeleton, { className: "h-0.5 w-full shrink-0" }), (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-5 sm:px-8",
			children: [
				(0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64" }),
				(0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-3 h-10 w-52" }),
				(0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-7 h-3 w-44" }),
				(0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-7 h-10 w-24 rounded-lg" })
			]
		})]
	});
}
function getCapabilityCopy(t, capability) {
	return {
		required: capability.required,
		suggested: capability.suggested,
		label: capability.labelKey ? t(capability.labelKey, { defaultValue: capability.label }) : capability.label,
		keySummary: capability.keySummaryKey ? t(capability.keySummaryKey, { defaultValue: capability.keySummary }) : capability.keySummary,
		why: capability.whyKey ? t(capability.whyKey, { defaultValue: capability.why }) : capability.why
	};
}
function CapabilityList({ capabilities, compact = false, className }) {
	const t = useT();
	const visibleCapabilities = (0, import_react.useMemo)(() => {
		const required = capabilities.filter((capability) => capability.required);
		const suggested = capabilities.filter((capability) => !capability.required && capability.suggested);
		const optional = capabilities.filter((capability) => !capability.required && !capability.suggested);
		const ordered = [
			...required,
			...suggested,
			...optional
		];
		return compact ? ordered.slice(0, 4) : ordered;
	}, [capabilities, compact]);
	return (0, import_jsx_runtime.jsxs)("div", {
		className: cn$1("grid", className),
		children: [!compact && (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-xs font-medium text-muted-foreground",
			children: "Keys and integrations"
		}), (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-1",
			children: visibleCapabilities.map((capability) => (0, import_jsx_runtime.jsx)(CapabilityRow, {
				copy: getCapabilityCopy(t, capability),
				compact
			}, capability.id))
		})]
	});
}
function CapabilityRow({ copy, compact }) {
	const t = useT();
	return (0, import_jsx_runtime.jsxs)("div", {
		className: cn$1("flex items-start justify-between gap-3", compact ? "py-2" : "py-3"),
		children: [(0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [(0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [(0, import_jsx_runtime.jsx)("span", {
					className: cn$1("font-medium", compact ? "text-[11px]" : "text-sm"),
					children: copy.label
				}), (0, import_jsx_runtime.jsx)(CapabilityInfoButton, {
					why: copy.why,
					ariaLabel: t("agentChat.onboarding.capability.why", {
						defaultValue: "Why {{label}} is needed",
						label: copy.label
					})
				})]
			}), (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground",
				children: copy.keySummary
			})]
		}), (0, import_jsx_runtime.jsx)("span", {
			className: cn$1("shrink-0 text-[10px] uppercase tracking-[0.08em]", copy.required || copy.suggested ? "text-primary" : "text-muted-foreground"),
			children: copy.required ? "Required" : copy.suggested ? "Suggested" : "Optional"
		})]
	});
}
function CapabilityInfoButton({ why, ariaLabel }) {
	return (0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": ariaLabel,
			className: "inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			onClick: (event) => event.stopPropagation(),
			onKeyDown: (event) => event.stopPropagation(),
			children: (0, import_jsx_runtime.jsx)(IconInfoCircle, { size: 13 })
		})
	}), (0, import_jsx_runtime.jsx)(TooltipContent, {
		side: "top",
		className: "max-w-xs text-xs",
		children: why
	})] });
}
var primaryButtonClass = "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-wait aria-disabled:opacity-60";
/** Inline failure signal for a failed completeFirstRun() call — keeps the
*  user on their current screen with a way forward, instead of swapping to
*  an unrelated full-screen error or leaving Skip/Continue looking like it
*  did nothing. */
function FirstRunCompletionError({ message, onRetry }) {
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-x-0 bottom-4 z-50 mx-auto flex w-fit max-w-[90vw] items-center gap-3 rounded-lg border border-destructive/30 bg-background px-4 py-2 text-xs shadow-lg",
		children: [(0, import_jsx_runtime.jsx)("span", {
			className: "text-destructive",
			children: message
		}), (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "font-medium underline underline-offset-2 hover:no-underline",
			onClick: onRetry,
			children: "Try again"
		})]
	});
}
var secondaryButtonClass = "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";
//#endregion
export { FirstRunOnboarding };
