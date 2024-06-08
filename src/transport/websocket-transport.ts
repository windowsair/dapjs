import { Transport } from './';
import { WebSocket } from 'unws';

export class WebSocketTransport implements Transport {
    public readonly packetSize = 1024;

    private socket: WebSocket;
    private onDataCallback: ((data: DataView) => void) | null = null;
    private hasError:boolean;
    private isConnect:boolean;

    constructor(url: string) {
        this.hasError = false;
        this.isConnect = false;

        this.socket = new WebSocket(url);
        this.socket.binaryType = 'arraybuffer';

        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = (event: any) => this.onMessage(event);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
    }

    private onOpen(): void {
        this.isConnect = true;
    }

    private onMessage(event: MessageEvent) {
        if (this.onDataCallback) {
            const arrayBuffer = event.data as ArrayBuffer;
            const dataView = new DataView(arrayBuffer);
            this.onDataCallback(dataView);
        }
    }

    private onClose(): void {
        this.isConnect = false;
    }

    private onError(/* _event: ErrorEvent */): void {
        this.hasError = true;
    }

    public async open(): Promise<void> {
        while (!this.isConnect && !this.hasError) {
            await new Promise(resolve => setTimeout(resolve, 1));
        }

        return new Promise<void>((resolve, reject) => {
            if (!this.hasError) {
                resolve();
            } else {
                reject(new Error('WebSocket error'));
            }
        });
    }

    public async close(): Promise<void> {
        this.socket.close();

        while (this.isConnect) {
            await new Promise(resolve => setTimeout(resolve, 1));
        }
    }

    public async read(): Promise<DataView> {
        return new Promise<DataView>(resolve => {
            this.onDataCallback = (dataView: DataView) => {
                resolve(dataView);
            };
        });
    }

    public async write(data: BufferSource): Promise<void> {
        this.socket.send(data);
    }
}
