#!/usr/bin/env node
import { CloudFrontWebDistribution, SSLMethod, SecurityPolicyProtocol } from '@aws-cdk/aws-cloudfront';
import { HostedZoneProvider, AliasRecord } from '@aws-cdk/aws-route53';
import { Bucket } from '@aws-cdk/aws-s3';
import { Construct, Output, SSMParameterProvider } from '@aws-cdk/cdk';

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
        const s3Output = new Output(this, 'SiteBucket', { 
            value: s3Bucket.bucketName
        });

        // Create cloudfront distribution
        const cloudFrontDistribution = this.createCloudFrontDistribution(siteDomain, s3Bucket);
        new Output(this, 'DistributionId', { value: cloudFrontDistribution });

        // Alias Record for cloudfront distribution
        this.createAliasRecord(domainName, siteDomain, cloudFrontDistribution);
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
    protected createCloudFrontDistribution(siteDomain: string, siteBucket: Bucket): CloudFrontWebDistribution {
        // CloudFront distribution that provides HTTPS
        const ssmParameterProviderConfig = {
            parameterName: `CertificateArn-${siteDomain}`
        };
        // Pre-existing ACM certificate, with the ARN stored in an SSM Parameter
        const certificateArn = new SSMParameterProvider(this, ssmParameterProviderConfig).parameterValue();
        const distribution = new CloudFrontWebDistribution(this, 'SiteDistribution', {
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
        return distribution;
    }
    protected createAliasRecord(domainName: string, siteDomain: string, distributionValue: CloudFrontWebDistribution ) {
        // Route53 alias record for the CloudFront distribution
        const zone = new HostedZoneProvider(this, { domainName: domainName }).findAndImport(this, 'Zone');
        const aliasRecord = new AliasRecord(this, 'SiteAliasRecord', {
            recordName: siteDomain,
            target: distributionValue,
            zone
        });
    }

}


