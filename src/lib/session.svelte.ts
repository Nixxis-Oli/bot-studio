import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { base } from '$app/paths';

// Static build: there is no server to hold a session, so the fake login lives
// entirely in the browser. It gates nothing real - it exists so the demo shows
// the same screens as the server-backed mockups did.
const KEY = 'mock_session';

function read(): string | null {
	if (!browser) {
		return null;
	}

	try {
		return localStorage.getItem(KEY);
	} catch {
		return null;
	}
}

class Session {
	user = $state<string | null>(read());

	signIn(email: string) {
		this.user = email;

		try {
			localStorage.setItem(KEY, email);
		} catch {
			// Blocked storage: the session simply does not survive a reload.
		}

		goto(`${base}/chatbots`);
	}

	signOut() {
		this.user = null;

		try {
			localStorage.removeItem(KEY);
		} catch {
			// Nothing to clean up.
		}

		goto(`${base}/login`);
	}
}

export const session = new Session();
