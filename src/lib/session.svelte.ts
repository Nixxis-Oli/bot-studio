import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { session as shared } from '@nixxis-oli/ui';
import { userFor } from './apps';

// The mock gate in front of the application. Who is signed in is NOT stored
// here: it lives in the shared package, in sessionStorage, so every application
// on the origin shows the same person. This module only decides where the
// browser goes next.
class Session {
	get user() {
		return shared.user;
	}

	/** Reads the store without applying a default, for the route guard. */
	restore() {
		return shared.restore();
	}

	signIn(email: string) {
		shared.signIn(userFor(email));
		goto(`${base}/chatbots`);
	}

	signOut() {
		shared.signOut();
		goto(`${base}/login`);
	}
}

export const session = new Session();
