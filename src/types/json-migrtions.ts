export interface JsonMigrationParams {
    metaKey?: string;
    dataKey?: string;
}

export interface JsonMigrationMeta {
    version: number;
    updated_at?: string;
}

export type MigrationHandler = (data: any) => any;
