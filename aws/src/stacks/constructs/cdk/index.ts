#!/usr/bin/env node
import { Construct, Output } from '@aws-cdk/cdk';
import { Bucket, BlockPublicAccess, BucketEncryption } from '@aws-cdk/aws-s3';


// export interface TaggedStackProps {
//     id: string;
//     StackProps: string[];
// };

// export class TaggedStack {
//     constructor(parent: Construct, name: string, props: TaggedStackProps) {
//         const { id } = TaggedStackProps;
//     }
// }


export interface CdkEnvironmentBucketProps {
    bucketName: string;
}


export class CdkEnvironmentBucket extends Construct {
    constructor(parent: Construct, name: string, props: CdkEnvironmentBucketProps) {
        super(parent, name);
        const { bucketName } =  props;
        const cdkBucketAccessControl = new BlockPublicAccess({
            blockPublicAcls: true,
            blockPublicPolicy: true,
            ignorePublicAcls: true,
            restrictPublicBuckets: true,
        });
        const cdkBucket = new Bucket(this, 'cdkBootstrappedEnvironment', {
            bucketName: bucketName,
            encryption: BucketEncryption.Kms,
            blockPublicAccess: cdkBucketAccessControl
        });
        
        new Output(this, 'CdkEnvironmentBucket', {
            value: cdkBucket.bucketArn
        });
        // export the resource to tag it
        cdkBucket.export();

    }
}