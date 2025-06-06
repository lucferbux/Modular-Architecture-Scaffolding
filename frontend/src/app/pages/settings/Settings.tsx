import * as React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Divider,
  Form,
  FormGroup,
  FormSection,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { ApplicationsPage, TitleWithIcon, ProjectObjectType } from 'mod-arch-shared';
import { useAppContext } from '~/app/AppContext';

const Settings: React.FC = () => {
  const { config, user } = useAppContext();

  return (
    <ApplicationsPage
      title={
        <TitleWithIcon title="Settings" objectType={ProjectObjectType.clusterSettings} />
      }
      description={
        <Stack hasGutter>
          <StackItem>
            Configure application settings and view system information for the Model Registry
            platform.
          </StackItem>
          <StackItem>
            <Divider />
          </StackItem>
        </Stack>
      }
      loaded={true}
      loadError={undefined}
      provideChildrenPadding
    >
      <Grid hasGutter>
        <GridItem span={12} lg={6}>
          <Card isFlat>
            <CardTitle>User Information</CardTitle>
            <CardBody>
              <Form>
                <FormGroup label="User ID" fieldId="user-id">
                  <TextContent>
                    <Text component={TextVariants.p}>{user?.userId || 'Not available'}</Text>
                  </TextContent>
                </FormGroup>
                <FormGroup label="Display Name" fieldId="display-name">
                  <TextContent>
                    <Text component={TextVariants.p}>
                      {user?.displayName || user?.userId || 'Not available'}
                    </Text>
                  </TextContent>
                </FormGroup>
                <FormGroup label="Is Admin" fieldId="is-admin">
                  <TextContent>
                    <Text component={TextVariants.p}>
                      {user?.isAdmin ? 'Yes' : 'No'}
                    </Text>
                  </TextContent>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={12} lg={6}>
          <Card isFlat>
            <CardTitle>Application Configuration</CardTitle>
            <CardBody>
              <Form>
                <FormSection title="Platform Settings">
                  <FormGroup label="Platform Mode" fieldId="platform-mode">
                    <TextContent>
                      <Text component={TextVariants.p}>
                        {config?.platformMode || 'Not configured'}
                      </Text>
                    </TextContent>
                  </FormGroup>
                  <FormGroup label="Deployment Mode" fieldId="deployment-mode">
                    <TextContent>
                      <Text component={TextVariants.p}>
                        {config?.deploymentMode || 'Not configured'}
                      </Text>
                    </TextContent>
                  </FormGroup>
                </FormSection>

                <FormSection title="API Configuration">
                  <FormGroup label="API Version" fieldId="api-version">
                    <TextContent>
                      <Text component={TextVariants.p}>
                        {config?.apiVersion || 'Not configured'}
                      </Text>
                    </TextContent>
                  </FormGroup>
                  <FormGroup label="Base URL" fieldId="base-url">
                    <TextContent>
                      <Text component={TextVariants.p}>
                        {config?.baseURL || 'Not configured'}
                      </Text>
                    </TextContent>
                  </FormGroup>
                </FormSection>
              </Form>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={12}>
          <Card isFlat>
            <CardTitle>System Information</CardTitle>
            <CardBody>
              <Grid hasGutter>
                <GridItem span={12} md={6}>
                  <Form>
                    <FormGroup label="Application Name" fieldId="app-name">
                      <TextContent>
                        <Text component={TextVariants.p}>Model Registry</Text>
                      </TextContent>
                    </FormGroup>
                    <FormGroup label="Environment" fieldId="environment">
                      <TextContent>
                        <Text component={TextVariants.p}>Development</Text>
                      </TextContent>
                    </FormGroup>
                  </Form>
                </GridItem>
                <GridItem span={12} md={6}>
                  <Form>
                    <FormGroup label="Build Version" fieldId="build-version">
                      <TextContent>
                        <Text component={TextVariants.p}>Development Build</Text>
                      </TextContent>
                    </FormGroup>
                    <FormGroup label="Last Updated" fieldId="last-updated">
                      <TextContent>
                        <Text component={TextVariants.p}>
                          {new Date().toLocaleDateString()}
                        </Text>
                      </TextContent>
                    </FormGroup>
                  </Form>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </ApplicationsPage>
  );
};

export default Settings;