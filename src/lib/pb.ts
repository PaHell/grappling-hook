import { env } from "$env/dynamic/public";

type EventListener = (...args: any[]) => void;

interface EventEmitter {
    events: Record<string, EventListener[]>;
    on(event: string, listener: EventListener): void;
    removeListener(event: string, listener: EventListener): void;
    emit(event: string, ...args: any[]): void;
    once(event: string, listener: EventListener): void;
}

export const eventify = <T extends object>(self: T): T & EventEmitter => {
    const emitter: EventEmitter = {
        events: {},

        on(event, listener) {
            if (!Array.isArray(this.events[event])) {
                this.events[event] = [];
            }
            this.events[event].push(listener);
        },

        removeListener(event, listener) {
            const listeners = this.events[event];
            if (Array.isArray(listeners)) {
                const idx = listeners.indexOf(listener);
                if (idx > -1) {
                    listeners.splice(idx, 1);
                }
            }
        },

        emit(event, ...args) {
            const listeners = this.events[event]?.slice();
            if (Array.isArray(listeners)) {
                listeners.forEach((listener) => listener(...args));
            }
        },

        once(event, listener) {
            const wrappedListener = (...args: any[]) => {
                this.removeListener(event, wrappedListener);
                listener(...args);
            };
            this.on(event, wrappedListener);
        },
    };

    return Object.assign(self, emitter);
};

export const PB = eventify({
    backend: '',

    toAbsoluteUrl(convertUrl: string, baseUrl: string): string {
        if (!convertUrl || !convertUrl.startsWith('/cache')) {
            return convertUrl;
        }

        const httpBackendUrl = baseUrl
            ?.replace(/^ws:\/\//, 'http://')
            .replace(/^wss:\/\//, 'https://');

        if (!httpBackendUrl) return convertUrl;

        const components = httpBackendUrl.split('/');
        return `${components[0]}//${components[2]}${convertUrl}`;
    },

    start(url: string): void {
        this.backend = url;

        console.log(`[PB] Connecting to ws backend on ${this.backend}`);

        const connect = () => {
            const socket = new WebSocket(this.backend);
            this.emit('statusChange', 'CONNECTING');

            socket.onopen = () => {
                this.emit('statusChange', 'CONNECTED');
                console.log('[PB] Connection established!');
            };

            socket.onclose = () => {
                this.emit('statusChange', 'CLOSED');
                setTimeout(connect, 500);
                console.log('[PB] Attempt reconnect in 500ms');
            };

            socket.onerror = () => {
                this.emit('statusChange', 'ERROR');
            };

            socket.onmessage = (msg) => {
                try {
                    const data = JSON.parse(msg.data);
                    if (data.eventType) {
                        this.emit(data.eventType, data);
                    } else {
                        console.warn('[PB] Unexpected packet format:', data);
                    }
                } catch (err) {
                    console.error('[PB] Error parsing message:', err);
                }
            };

            this.socket = socket;
        };

        connect();
    },
});
