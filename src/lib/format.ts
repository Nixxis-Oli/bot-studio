const dateFormatter = new Intl.DateTimeFormat('en-GB', {
	day: '2-digit',
	month: 'short',
	year: 'numeric'
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
	day: '2-digit',
	month: 'short',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit'
});

export function formatDate(value: number | null): string {
	return value ? dateFormatter.format(new Date(value)) : '-';
}

export function formatDateTime(value: number | null): string {
	return value ? dateTimeFormatter.format(new Date(value)) : '-';
}

export function formatRelative(value: number | null): string {
	if (!value) {
		return '-';
	}

	const seconds = Math.round((value - Date.now()) / 1000);
	const units: [Intl.RelativeTimeFormatUnit, number][] = [
		['year', 31536000],
		['month', 2592000],
		['day', 86400],
		['hour', 3600],
		['minute', 60]
	];

	const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

	for (const [unit, secondsInUnit] of units) {
		if (Math.abs(seconds) >= secondsInUnit) {
			return formatter.format(Math.round(seconds / secondsInUnit), unit);
		}
	}

	return formatter.format(seconds, 'second');
}
