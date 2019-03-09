#!/usr/bin/env node

// this should be an enum
// but I'm not quite sure how 
// to get enums to work correctly
type ApplicationRole = {
   apiLayer: "api-layer",
   dataLayer: {
       metaData: {
           buildArtifacts: "build-artifact",
           logging: "logging",
       },
       data: "primary"
   }
};
// stub
type ArnIdentifier = {
    id: string
};
enum EnvironmentSetting {
    production = "PROD",
    staging = "STAGING",
    development = "DEV",
};

type Version = {
    major: number,
    minor: number,
    patch: number
};

type ResourceIdentifier = {
    id: string
};

export interface TechnicalTag {
    name: string,
    applicationId: string,
    applicationRole: ApplicationRole,
    cluster: ResourceIdentifier,
    environment: EnvironmentSetting,
    version: Version
};

// time is relative...

export interface AutomationTag {
    resourceLifecycle: {
        start: string[],
        stop: string[],
        delete: string[],
        rotate: string[],
    },
    managedServices: string[],
    security: string[],
};


export interface BusinessTag {
    owner: ArnIdentifier,
    businessUnit: string[],
    customers: string[],
    project: string[]
};

type ConfidentialityLevel = {
    GDPRCompliant: boolean
};

type Field = {
    name: string
};
// regulations have:
    // names
    // scope of affected data
// PCI? GDPR?
type Regulation = {
    name: string,
    fields: Field[];
};
export interface SecurityTagProps {
    confidentiality: ConfidentialityLevel
    compliance: Regulation[],
};

export class SecurityTag {
    constructor(props: SecurityTagProps) {
        const { confidentiality, compliance } = props;
        const securityTag = new SecurityTag({
            confidentiality,
            compliance
        });
        console.log(`securityTag: ${securityTag}`);
    }
}

