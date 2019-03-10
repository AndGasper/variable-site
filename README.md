


# Storage of Build Artifacts

Amazon S3 (Storage)
- Durable 
- Reliable 
- Scalable
- Available
- Node.js client 

DynamoDB (Metadata for build)
- NoSQL
- Node.js client
- DynamoDB Streams


LRU cache for the json parse 
Watch out for "RangeError: Invalid string length"
"It dates back all the way to 2010. Back then, 512 MB was the overall heap limit, and I guess it was a no-brainer to decide that no single string could/should be bigger than the heap. 
(512 MB = memory consumption of a UTF-16 string with length 2^28)


https://github.com/awslabs/aws-api-gateway-developer-portal


https://github.com/aws-samples/blog-multi-region-serverless-service/


```
const methods = [
    {
        'POST': postWidgetIntegration
    },
    {
        'GET': getWidgetIntegration
    },
    {
        'DELETE': deleteWidgetIntegration
    }
];
```

Could maybe make a map

- S3
    - Bucket Name: apiName
    - Versioning: Y

YAML file of the responses? 



https://github.com/awslabs/aws-cdk/blob/master/packages/%40aws-cdk/aws-apigateway/lib/restapi.ts


// Need some way to kind of hint at
// the fact such a stack would: 
// create the bucket for the lmabda code 
// grant read/write access to the stack -> allows "putting" of the code
// 
export interface lambdaCodeBucketProps {
    name: string;
    versioning?: boolean;
}
export class LambdaCodeBucket {
    constructor(props) {
        super(); 

    }
}



iam
- cloudformation
    - CDK Toolkit

- s3
    - Abort*
    - DeleteObject
    - GetBucket*
    - GetObject*
    - List*
    - PutObject*
- lambda
    - InvokeFunction

- iam
    - iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs

cloudwatch


```
class SslCertificateParameterName implements SSMParameterProviderProps {
            constructor(sslCertificateParameterName: string) {
                
            }
        }
```

[CSA Consensus Assessments Initiative Questionnaire](https://d1.awsstatic.com/whitepapers/compliance/CSA_Consensus_Assessments_Initiative_Questionnaire.pdf)

[Tagging Strategies](https://aws.amazon.com/answers/account-management/aws-tagging-strategies/)