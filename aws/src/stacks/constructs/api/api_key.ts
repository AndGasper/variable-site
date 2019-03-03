
interface ApiKeyStageKey {
    restApiId?: string;
    stageName?: string;   
}
export interface ApiKeyProps {
    customerId?: string;
    description?: string;
    enabled?: boolean;
    generateDistinctId?: boolean;
    name?: string;
    stageKeys?: ApiKeyStageKey[];
    value?: string;
}
class ApiGateway { /* Stub */ }
export class ApiKey extends ApiGateway { /* How sway? */ }