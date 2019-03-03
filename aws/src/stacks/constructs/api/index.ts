import cdk = require('@aws-cdk/cdk');
import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import { HostedZoneProvider, CnameRecord } from '@aws-cdk/aws-route53';

export interface NamedApiProps {
    domainName: string;
    apiPrefix: string;

} 

export class NamedApi extends cdk.Construct {
    constructor(parent: cdk.Construct, name: string, props: NamedApiProps) {
        super(parent, name);

        // START LAM`BDA LOGIC
        // Create S3 bucket for the lambda code
        const bucket = new s3.Bucket(this, 'WidgetStore');
        // Why do I have the feeling I'm about to bump into that
        // got eeem of the max limit that you can inline for a lambda function
        const handlerConfig = {
            runtime: lambda.Runtime.NodeJS810,
            code: lambda.Code.directory('build/lib'),
            handler: 'widgets.main',
            environment: {
                BUCKET: bucket.bucketName
            }
        };
        // create lambda 
        const handler = new lambda.Function(this, 'WidgetHandler', handlerConfig);
        // attach roles
        bucket.grantReadWrite(handler.role);
        // END LAMBDA LOGIC 

        // START API GATEWAY LOGIC
        // declare api gateway properties 
        const apiGatewayConfig = {
            restApiName: 'Widget Service',
            description: 'This service serves widgets'
        };
        // create rest api
        const api = new apigateway.RestApi(this, 'widgets-api', apiGatewayConfig);
        // get the api arn of the 
        const apiArn = api.executeApiArn('GET', '/');

        // associate the api with the api.domainname.com
        const zone = new HostedZoneProvider(this, {
            domainName: props.domainName
        }).findAndImport(this, 'Zone');
        const cnameRecordConfig = {
            zone,
            recordName: `${props.apiPrefix}.${props.domainName}`,
            recordValue: apiArn,
        };
        // zone: IHostedZone;
        // recordName: string;
        // hostedZoneId: string;
        // dnsName: string
        // cheat and use the CnameRecord to name api gateway because 
        // the RestApi Interface for API Gateway doesn't quite have what you need to call AliasRecord
        new CnameRecord(this, 'SiteAliasRecord', cnameRecordConfig);


        // could likely pull this from an external source
        const apiGatewayLambdaIntegrationConfig = {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        };
        const getWidgetsIntegration = new apigateway.LambdaIntegration(handler, apiGatewayLambdaIntegrationConfig);

        api.root.addMethod('GET', getWidgetsIntegration); // GET /
        const widget = api.root.addResource('{id}');

        // Add a new widget to bucket with: POST /{id}
        const postWidgetIntegration = new apigateway.LambdaIntegration(handler);

        // Get a specific widget from bucket with: GET /{id}
        const getWidgetIntegration = new apigateway.LambdaIntegration(handler);

        // Remove a specific widget from the bucket with: DELETE /{id}
        const deleteWidgetIntegration = new apigateway.LambdaIntegration(handler);

        widget.addMethod('POST', postWidgetIntegration); // POST /{id}
        widget.addMethod('GET', getWidgetIntegration); // GET /{id}
        widget.addMethod('DELETE', deleteWidgetIntegration); // DELETE /{id}
    }
}