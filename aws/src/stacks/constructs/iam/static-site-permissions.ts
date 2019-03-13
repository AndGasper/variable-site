import { Policy } from '@aws-cdk/aws-iam';
import { Construct } from '@aws-cdk/cdk';


export class StaticSitePermissions extends Construct { 
    constructor(parent: Construct, name: string, props: StaticSitePermissionsProps) {
        super(parent, name);
        const { resourceId } = props;
    }
}



// s3
    // create bucket 
    // put sacl
    // 
    // put object
    // getobjectVersion

// route53
    // create alias record
// cloudfront
    // create distribution
    // update distribution 
    // 
