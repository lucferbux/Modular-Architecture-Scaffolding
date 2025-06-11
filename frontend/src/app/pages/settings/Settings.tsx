import * as React from 'react';
import { Divider, Stack, StackItem } from '@patternfly/react-core';
import { ApplicationsPage, TitleWithIcon, ProjectObjectType } from 'mod-arch-shared';

const Settings: React.FC = () => {
  return (
    <ApplicationsPage
      title={<TitleWithIcon title="Settings" objectType={ProjectObjectType.clusterSettings} />}
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
      empty={false}
    ></ApplicationsPage>
  );
};

export default Settings;
