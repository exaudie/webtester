import { writable, derived } from 'svelte/store';

function createNotificationStore() {
	const _notifications = writable<any>([]);

	function send(message: string, type = 'default', timeout: number) {
		_notifications.update((state) => {
			return [...state, { id: id(), type, message, timeout }];
		});
	}

	const notifications = derived(_notifications, ($_notifications, set) => {
		set($_notifications);
		if ($_notifications.length > 0) {
			const timer = setTimeout(() => {
				_notifications.update((state) => {
					state.shift();
					return state;
				});
			}, $_notifications[0].timeout);
			return () => {
				clearTimeout(timer);
			};
		}
	});
	const { subscribe } = notifications;

	return {
		subscribe,
		send,
		default: (msg: string, timeout: number) => send(msg, 'default', timeout),
		danger: (msg: string, timeout: number) => send(msg, 'danger', timeout),
		warning: (msg: string, timeout: number) => send(msg, 'warning', timeout),
		info: (msg: string, timeout: number) => send(msg, 'info', timeout),
		success: (msg: string, timeout: number) => send(msg, 'success', timeout)
	};
}

function id() {
	return '_' + Math.random().toString(36).substring(2, 9);
}

export const notifications = createNotificationStore();
