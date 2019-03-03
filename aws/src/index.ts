#!/usr/bin/env node
import { Stack, App, StackProps } from '@aws-cdk/cdk';
import { StaticSite } from './stacks/constructs/static-site';
import { NamedApi } from './stacks/constructs/api';

class VariableSite extends Stack {
    constructor(parent: App, name: string, props: StackProps) {
        super(parent, name, props);

        // Associate S3 with the domain name
        new StaticSite(this, 'StaticSite', {
            domainName: this.node.getContext('domain'),
            siteSubDomain: this.node.getContext('subdomain').websitePrefix,
        });
        new NamedApi(this, 'NamedApi', {
            domainName: this.node.getContext('domain'),
            apiPrefix: this.node.getContext('subdomain').apiPrefix
        });
    }
}

const app = new App();

new VariableSite(app, 'VariableSiteMk1', { env: { region: 'us-east-1' } });

app.run();
