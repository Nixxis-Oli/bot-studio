import { browser } from '$app/environment';

const COLLAPSED_KEY = 'sidebar_collapsed';
const WIDTH_KEY = 'sidebar_width';

export const DEFAULT_WIDTH = 288;
export const MIN_WIDTH = 200;
export const MAX_WIDTH = 480;

/** Matches Tailwind's `md` breakpoint, where the sidebar becomes a column. */
const DESKTOP = '(min-width: 768px)';

export function clampWidth(value: number): number {
	if (!Number.isFinite(value)) {
		return DEFAULT_WIDTH;
	}

	return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(value)));
}

// Static build: no server reads cookies, so the state comes from localStorage.
// The inline script in app.html applies it to the document before first paint,
// which is what keeps the sidebar from flashing at its default width.
function readStored(): { collapsed: boolean; width: number } {
	if (!browser) {
		return { collapsed: false, width: DEFAULT_WIDTH };
	}

	try {
		return {
			collapsed: localStorage.getItem(COLLAPSED_KEY) === '1',
			width: clampWidth(Number(localStorage.getItem(WIDTH_KEY) ?? DEFAULT_WIDTH))
		};
	} catch {
		return { collapsed: false, width: DEFAULT_WIDTH };
	}
}

export function createSidebar() {
	const initial = readStored();

	let collapsed = $state(initial.collapsed);
	let width = $state(initial.width);
	let dragging = $state(false);

	// Below md the sidebar slides over the content, so it needs its own open
	// state: `collapsed` is a desktop layout concern and defaults to open, which
	// would leave the overlay covering the whole page on a phone.
	let desktop = $state(browser ? window.matchMedia(DESKTOP).matches : true);
	let mobileOpen = $state(false);

	if (browser) {
		window.matchMedia(DESKTOP).addEventListener('change', (event) => {
			desktop = event.matches;

			// Growing past the breakpoint must not leave the overlay latched open.
			if (event.matches) {
				mobileOpen = false;
			}
		});
	}

	function persist(key: string, value: string) {
		if (!browser) {
			return;
		}

		try {
			localStorage.setItem(key, value);
		} catch {
			// Blocked storage: the choice just does not survive a reload.
		}
	}

	function setWidth(next: number) {
		width = clampWidth(next);
	}

	return {
		get collapsed() {
			return collapsed;
		},
		get width() {
			return width;
		},
		get dragging() {
			return dragging;
		},
		get desktop() {
			return desktop;
		},
		get mobileOpen() {
			return mobileOpen;
		},
		toggle() {
			if (desktop) {
				collapsed = !collapsed;
				persist(COLLAPSED_KEY, collapsed ? '1' : '0');
			} else {
				mobileOpen = !mobileOpen;
			}
		},
		closeMobile() {
			mobileOpen = false;
		},
		// Ctrl/Cmd+B, the shortcut shadcn's own sidebar uses.
		handleShortcut(event: KeyboardEvent) {
			if (event.key.toLowerCase() === 'b' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				this.toggle();
			}
		},
		// Pointer capture keeps the drag alive when the cursor outruns the handle,
		// which it always does on a fast drag.
		startResize(event: PointerEvent) {
			if (collapsed || !desktop) {
				return;
			}

			event.preventDefault();
			dragging = true;

			const handle = event.currentTarget as HTMLElement;
			handle.setPointerCapture(event.pointerId);

			const onMove = (move: PointerEvent) => setWidth(move.clientX);

			const onUp = () => {
				dragging = false;
				handle.releasePointerCapture(event.pointerId);
				handle.removeEventListener('pointermove', onMove);
				handle.removeEventListener('pointerup', onUp);
				persist(WIDTH_KEY, String(width));
			};

			handle.addEventListener('pointermove', onMove);
			handle.addEventListener('pointerup', onUp);
		},
		// Double-clicking the handle restores the default width.
		resetWidth() {
			setWidth(DEFAULT_WIDTH);
			persist(WIDTH_KEY, String(width));
		},
		// The handle is focusable, so the keyboard can resize too.
		handleResizeKey(event: KeyboardEvent) {
			const step = event.shiftKey ? 32 : 8;

			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				setWidth(width - step);
			} else if (event.key === 'ArrowRight') {
				event.preventDefault();
				setWidth(width + step);
			} else if (event.key === 'Home') {
				event.preventDefault();
				setWidth(DEFAULT_WIDTH);
			} else {
				return;
			}

			persist(WIDTH_KEY, String(width));
		}
	};
}
