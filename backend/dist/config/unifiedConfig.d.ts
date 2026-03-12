import 'dotenv/config';
export declare const config: {
    readonly port: number;
    readonly session: {
        readonly secret: string;
    };
    readonly frontend: {
        readonly url: string;
    };
    readonly google: {
        readonly clientId: string;
        readonly clientSecret: string;
        readonly callbackUrl: string;
    };
    readonly github: {
        readonly clientId: string;
        readonly clientSecret: string;
        readonly callbackUrl: string;
    };
    readonly sentry: {
        readonly dsn: string;
    };
};
//# sourceMappingURL=unifiedConfig.d.ts.map