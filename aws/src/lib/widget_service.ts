import cdk = require('@aws-cdk/cdk');
import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');

export class WidgetService extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const bucket = new s3.Bucket(this, 'WidgetStore');
        const handlerConfig = {
            runtime: lambda.Runtime.NodeJS610,
            code: lambda.Code.directory('resources'),
            handler: 'widgets.main',
            environment: {
                BUCKET: bucket.bucketName
            }
        }
        const handler = new lambda.Function(this, 'WidgetHandler', handlerConfig);
        bucket.grantReadWrite(handler.role);
        const apiGatewayConfig = {
            restApiName: 'Widget Service',
            description: 'This service serves widgets'
        };
        const api = new apigateway.RestApi(this, 'widgets-api', apiGatewayConfig);

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