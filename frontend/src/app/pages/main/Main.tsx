import * as React from 'react';
import { Divider, Stack, StackItem } from '@patternfly/react-core';
import { ApplicationsPage, TitleWithIcon, ProjectObjectType } from 'mod-arch-shared';

const Main: React.FC = () => (
  <ApplicationsPage
    title={<TitleWithIcon title="Main" objectType={ProjectObjectType.deployingModels} />}
    description={
      <Stack hasGutter>
        <StackItem>Main app</StackItem>
        <StackItem>
          <Divider />
        </StackItem>
      </Stack>
    }
    loaded
    loadError={undefined}
    provideChildrenPadding
    empty={false}
  />
);

export default Main;
