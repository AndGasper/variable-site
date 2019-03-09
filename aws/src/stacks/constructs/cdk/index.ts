#!/usr/bin/env node
import { Construct, Output, TagManager, Tag } from '@aws-cdk/cdk';
import { Bucket, BlockPublicAccess, BucketEncryption } from '@aws-cdk/aws-s3';


export class TaggedStack extends Stack {
    constructor(parent: Construct, name: string, props: TaggedStackProps) {
        super(parent, name);

    }
}

export default function({ key, stack }) {
    return
}


class CdkEnvironmentBucket extends Construct {
    constructor(parent: Construct, name: string, props: CdkEnvironmentBucketProps) {
        super(parent, name);
        const cdkBucketAccessControl = new BlockPublicAccess({
            blockPublicAcls: true,
            blockPublicPolicy: true,
            ignorePublicAcls: true,
            restrictPublicBuckets: true,
        });
        const cdkBucket = new Bucket(this, 'cdkBootstrappedEnvironment', {
            encryption: BucketEncryption.Kms,
            blockPublicAccess: cdkBucketAccessControl
        });
        
        new Output(this, 'CdkEnvironmentBucket', {
            value: cdkBucket.bucketArn
        });
        // export the resource to tag it
        const cdkBucketExport = cdkBucket.export();

    }
}

// const withTagging = injectTagging({ key: })