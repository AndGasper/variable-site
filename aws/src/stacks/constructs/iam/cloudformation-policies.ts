#!/usr/bin/env node
import { Construct } from '@aws-cdk/cdk';
import { PolicyStatement, Policy, AwsManagedPolicy } from '@aws-cdk/aws-iam';
import { IBucket } from '@aws-cdk/aws-s3';

export interface CloudformationRoleProps {
    templateBucket: IBucket
}
export class CloudformationRole extends Construct {
    constructor(parent: Construct, name: string, props: CloudformationRoleProps) {
        super(parent, name);
        const policy = new AwsManagedPolicy('sts:assumeRole');
        
        const s3Policy = this.createS3BucketPolicy();

    }
    /**
     * @name - createS3PolicyStatement
     * @description - Do not want an open "new PolicyStatement", so hide it in a private method
     */
    protected createS3BucketPolicy(): PolicyStatement {
        const s3Policy = new PolicyStatement();
        const s3Actions = ["s3:PutObject", "s3:ListBucket", "s3:GetObject", "s3:CreateBucket"];
        s3Actions.map(s3Action => {
            s3Policy.addAction(s3Action);
        });

        console.log(`s3Policy: ${s3Policy}`);
        return s3Policy;
    }
}