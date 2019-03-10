import { App } from '@aws-cdk/cdk';
import { StaticSite } from 'constructs/static-site/index';
import test from 'jest';


test("StaticSite matches snapshot", () => {
    expect(StaticSite.toCloudFormation()).toMatchSnapshot());
    const stack = new StaticSite(new App(), "StaticSiteSnapshot", {});
});