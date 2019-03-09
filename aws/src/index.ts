#!/usr/bin/env node
import { Stack, App, StackProps } from '@aws-cdk/cdk';
import { StaticSite } from './stacks/constructs/static-site';
import { NamedApi } from './stacks/constructs/api';
import { CloudFormationRole } from './stacks/constructs/iam/cloudformation-policies';



// type DeploymentEnvironment = {
//     name: string;
//     region: string[];
// }

// type DeploymentEnvironments = DeploymentEnvironment[];

// function getEnvironments(): DeploymentEnvironments {
//     const devCdkEnvironment: DeploymentEnvironment = {
//         name: 'dev',
//         region: ['us-west-2', 'us-east-1']
//     };
//     const stagingCdkEnvironment: DeploymentEnvironment ={
//         name: 'staging',
//         region: ['us-west-2', 'us-east-1']
//     };
//     const prodCdkEnvironment: DeploymentEnvironment ={
//         name: 'prod',
//         region: ['us-west-2', 'us-east-1']
//     };
//     const deploymentEnvironments: DeploymentEnvironments = [devCdkEnvironment, stagingCdkEnvironment, prodCdkEnvironment];
//     return deploymentEnvironments
// }

// function createStack(deploymentEnvironments): Stack[] {
//     const stacks = deploymentEnvironments.map(deploymentEnvironment => 
//         new StackName(this, )
//     )
    // new NamedApi(this, 'NamedApi', {
    //     domainName: this.node.getContext('domain'),
    //     apiPrefix: this.node.getContext('subdomain').apiPrefix
    // });
// }

class Api extends Stack {
    constructor(parent: App, name: string, props: StackProps) {
        super(parent, name, props);
        new NamedApi(this, 'NamedApi', {
            domainName: this.node.getContext('domain'),
            apiPrefix: this.node.getContext('subdomain').apiPrefix
        });
    }
}



class Site extends Stack {
    constructor(parent: App, name: string, props: StackProps) {
        super(parent, name, props); 
        // Associate S3 with the domain name
        new StaticSite(this, 'StaticSite', {
            domainName: this.node.getContext('domain'),
            siteSubDomain: this.node.getContext('subdomain').websitePrefix,
        });
    }
}

const app = new App();

new Site(app, 'VariableSiteMk1', { env: { region: 'us-east-1' } });
new Api(app, 'VariableApiMk1', { env: { region: 'us-east-1' } });

app.run();
