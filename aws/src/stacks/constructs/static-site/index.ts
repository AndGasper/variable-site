#!/usr/bin/env node
import { CloudFrontWebDistribution, SSLMethod, SecurityPolicyProtocol } from '@aws-cdk/aws-cloudfront';
import { Bucket } from '@aws-cdk/aws-s3';
import { Construct, Output, SSMParameterProvider } from '@aws-cdk/cdk';
import { AliasRecordTargetProps } from '@aws-cdk/aws-route53';

export interface StaticSiteProps {
    domainName: string;
    siteSubDomain: string;
}

/**
 * Static site infrastructure, which uses an S3 bucket for the content.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 *
 * The ACM certificate is expected to be created and validated outside of the CDK,
 * with the certificate ARN stored in an SSM Parameter.
 */
export class StaticSite extends Construct {
    constructor(parent: Construct, name: string, props: StaticSiteProps) {
        super(parent, name);
        const { siteSubDomain, domainName } = props;
        const siteDomain = `${siteSubDomain}.${domainName}`;

        // create s3 bucket
        const s3Bucket = this.createSiteBucket(siteSubDomain, domainName);
        new Output(this, 'SiteBucketName', { 
            value: s3Bucket.bucketName
        });

        // Create cloudfront distribution
        const cloudFrontDistribution = this.createCloudFrontDistribution(siteDomain, s3Bucket);
        new Output(this, 'DistributionId', { value: cloudFrontDistribution });
    }
    protected createSiteBucket(siteSubDomain: string, domainName: string): Bucket {
        const siteDomain = siteSubDomain + '.' + domainName;

        // Content bucket
        const bucket = new Bucket(this, 'SiteBucket', {
            bucketName: siteDomain,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'error.html',
            publicReadAccess: true
        });
        return bucket;
    }
    protected createCloudFrontDistribution(siteDomain: string, siteBucket: Bucket): AliasRecordTargetProps {
        // CloudFront distribution that provides HTTPS
        const ssmParameterProviderConfig = {
            parameterName: `CertificateArn-${siteDomain}`
        };
        // Pre-existing ACM certificate, with the ARN stored in an SSM Parameter
        const certificateArn = new SSMParameterProvider(this, ssmParameterProviderConfig).parameterValue();
        const distribution = new CloudFrontWebDistribution(this, 'StaticSiteDistribution', {
            aliasConfiguration: {
                acmCertRef: certificateArn,
                names: [ siteDomain ],
                sslMethod: SSLMethod.SNI,
                securityPolicy: SecurityPolicyProtocol.TLSv1_1_2016
            },
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: siteBucket
                    },
                    behaviors : [ {isDefaultBehavior: true}],
                }
            ]
        }); 
        return distribution.asAliasRecordTarget();
    }

}


