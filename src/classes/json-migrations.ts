import {
    JsonMigrationMeta,
    JsonMigrationParams,
    MigrationHandler,
} from "../types";

const params = Symbol("params");
const meta = Symbol("meta");
const dataInput = Symbol("dataInput");
const versions = Symbol("versions");

export class Migration {
    private params: JsonMigrationParams = {
        metaKey: "__meta",
        dataKey: "__data",
    };

    private [meta]: any;
    private [dataInput]: any;
    private [versions] = new Map<number, Engine>();

    constructor(params?: JsonMigrationParams) {
        this.params = {
            ...this.params,
            ...params,
        };
    }

    get() {
        return {
            [this.params.metaKey!]: this.meta,
            [this.params.dataKey!]: this.data,
        };
    }

    get meta(): JsonMigrationMeta {
        const versions = this.versions;
        return {
            version: versions[versions.length - 1],
            updated_at: new Date().toISOString(),
        };
    }

    get data() {
        return this.versions.reduce((state, version) => {
            const engine = this[versions].get(version);
            if (engine) return engine?.execUp(state);
            return state;
        }, this[dataInput]);
    }

    get versions(): number[] {
        return Array.from(this[versions].keys()).sort();
    }

    input(data: any): void {
        if (isObject(data)) {
            if (
                data.hasOwnProperty(this.params.dataKey!) &&
                data.hasOwnProperty(this.params.metaKey!)
            ) {
                this[meta] = data[this.params.metaKey!];
                this[dataInput] = data[this.params.dataKey!];
                return;
            }
        }
        this[dataInput] = data;
    }

    version<T>(verion: number) {
        const engine = new Engine();
        this[versions].set(verion, engine);
        return engine;
    }
}

class Engine {
    execUp: MigrationHandler = (data) => data;

    up(handler: MigrationHandler) {
        this.execUp = handler;
        return this;
    }
}

const isObject = (value: any) =>
    typeof value === "object" && !Array.isArray(value) && value !== null;
