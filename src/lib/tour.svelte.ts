export interface TourStep {
	id: string;
	title: string;
	description: string;
	/** CSS selector of the element to highlight. Omitted for a centred step. */
	target?: string;
	placement?: 'top' | 'bottom' | 'left' | 'right';
}

const PADDING = 8;
const RADIUS = 10;

/**
 * The cut-out the backdrop is clipped to: the whole viewport, minus a rounded
 * rectangle over the highlighted element. Two subpaths in the same direction
 * with the even-odd fill rule leave a hole where they overlap - simpler than
 * reversing the winding of the second one.
 */
export function spotlightPath(rect: DOMRect | null, w: number, h: number): string {
	const outer = `M0,0 H${w} V${h} H0 Z`;

	if (!rect) {
		return `path(evenodd, "${outer}")`;
	}

	const x = Math.max(0, rect.x - PADDING);
	const y = Math.max(0, rect.y - PADDING);
	const width = Math.min(w - x, rect.width + PADDING * 2);
	const height = Math.min(h - y, rect.height + PADDING * 2);
	const r = Math.min(RADIUS, width / 2, height / 2);

	const hole = [
		`M${x + r},${y}`,
		`H${x + width - r}`,
		`A${r},${r} 0 0 1 ${x + width},${y + r}`,
		`V${y + height - r}`,
		`A${r},${r} 0 0 1 ${x + width - r},${y + height}`,
		`H${x + r}`,
		`A${r},${r} 0 0 1 ${x},${y + height - r}`,
		`V${y + r}`,
		`A${r},${r} 0 0 1 ${x + r},${y}`,
		'Z'
	].join(' ');

	return `path(evenodd, "${outer} ${hole}")`;
}

export function createTour(steps: TourStep[], onEnter?: (id: string) => void) {
	// -1 means closed; any other index is the step being shown.
	let index = $state(-1);
	let rect = $state<DOMRect | null>(null);
	// Tracked rather than read at draw time, so a resize redraws the cut-out
	// even when the highlighted element has not moved.
	let viewport = $state({ w: 0, h: 0 });

	const step = $derived(index >= 0 ? steps[index] : null);

	function measureTarget() {
		const selector = step?.target;

		if (!selector) {
			rect = null;
			return;
		}

		const measured = document.querySelector(selector)?.getBoundingClientRect();

		// "No target" covers three cases, all of which would otherwise spotlight
		// nothing useful: the element is absent, it is hidden (zero size), or it
		// is off screen - a collapsed sidebar still measures 288px wide, it just
		// sits at a negative x. Any of them falls back to a centred panel.
		const visible =
			!!measured &&
			measured.width > 0 &&
			measured.height > 0 &&
			measured.right > 0 &&
			measured.bottom > 0 &&
			measured.left < viewport.w &&
			measured.top < viewport.h;

		rect = visible ? measured : null;
	}

	function syncViewport() {
		viewport = { w: window.innerWidth, h: window.innerHeight };
	}

	function enter() {
		syncViewport();
		onEnter?.(steps[index]?.id ?? '');

		// The host may have just opened a panel; measure once it has been laid
		// out, and again after the slide-in so the spotlight lands on its final
		// position rather than its starting one.
		measureTarget();
		requestAnimationFrame(measureTarget);
		setTimeout(measureTarget, 220);
	}

	return {
		get open() {
			return index >= 0;
		},
		get step() {
			return step;
		},
		get rect() {
			return rect;
		},
		get viewport() {
			return viewport;
		},
		get isFirst() {
			return index === 0;
		},
		get isLast() {
			return index === steps.length - 1;
		},
		get progress() {
			return index >= 0 ? `${index + 1} of ${steps.length}` : '';
		},
		start() {
			index = 0;
			enter();
		},
		next() {
			if (index < steps.length - 1) {
				index += 1;
				enter();
			} else {
				index = -1;
			}
		},
		prev() {
			if (index > 0) {
				index -= 1;
				enter();
			}
		},
		dismiss() {
			index = -1;
		},
		/** Re-reads the viewport and the target's position, for scroll and resize. */
		measure() {
			syncViewport();
			measureTarget();
		}
	};
}
