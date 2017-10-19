// import {Box} from 'grid-emotion';
import React from 'react';
// import styled from 'react-emotion';

import ProjectContext from '../../projects/projectContext';
import ProjectSettingsNavigation from './projectSettingsNavigation';
// import SettingsHeading from '../components/settingsHeading';
import SettingsLayout from '../settingsLayout';
// import SettingsPanelItem from '../components/settingsPanelItem';

class ProjectSettingsLayout extends React.Component {
  render() {
    let {orgId, projectId} = this.props.params;

    return (
      <ProjectContext {...this.props.params}>
        <SettingsLayout
          {...this.props}
          renderNavigation={() => <ProjectSettingsNavigation {...this.props} />}>

          {React.cloneElement(this.props.children, {
            setProjectNavSection: () => {}
          })}

          {/*<Example />*/}
        </SettingsLayout>
      </ProjectContext>
    );
  }
}

// const Example = () => (
  // <Box>
    // <SettingsPanel>
      // <SettingsPanelHeader>
        // <SettingsPanelHeaderHeading>
          // Project Details
        // </SettingsPanelHeaderHeading>
      // </SettingsPanelHeader>
      // <SettingsPanelBody>
        // <SettingsPanelItem
          // label="Project name"
          // required={true}
          // type="text"
          // placeholder="Enter a project name..."
          // defaultValue="Freight"
          // help=""
        // />
        // <SettingsPanelItem
          // error={true}
          // label="Short name"
          // required={true}
          // type="text"
          // placeholder="Enter a short name..."
          // defaultValue="freight"
          // help="A unique ID used to identify this project."
        // />
        // <SettingsPanelItem
          // label="Team"
          // required={true}
          // type="dropdown"
          // placeholder="Choose a team..."
          // defaultValue="freight"
        // />
        // <SettingsPanelItem
          // label="Email subject prefix"
          // required={true}
          // type="text"
          // placeholder="Enter a subject prefix..."
          // defaultValue="[FRGHT]"
        // />
      // </SettingsPanelBody>
    // </SettingsPanel>

    // <SettingsPanel>
      // <SettingsPanelHeader>
        // <SettingsPanelHeaderHeading>Event Settings</SettingsPanelHeaderHeading>
      // </SettingsPanelHeader>
      // <SettingsPanelBody>
        // <SettingsPanelItem
          // label="Allow shared issues"
          // required={true}
          // type="switch"
          // help="Enable sharing of limited details on issues to anonymous users."
        // />
        // <SettingsPanelItem
          // label="Enhanced security"
          // required={true}
          // type="switch"
          // help="Limits personally identifiable information (PII) and removes source code from alerts."
        // />
        // <SettingsPanelItem
          // label="Global sensitive fields"
          // placeholder="Add a field..."
          // type="textarea"
          // help="What does this do?"
        // />
        // <SettingsPanelItem
          // label="Global safe fields"
          // placeholder="Add a field..."
          // type="textarea"
          // help="What does this do?"
        // />
      // </SettingsPanelBody>
    // </SettingsPanel>
  // </Box>
// );

// const SettingsPanel = styled.div`
  // background: #fff;
  // border-radius: ${p => p.theme.radius};
  // border: 1px solid ${p => p.theme.borderDark};
  // box-shadow: ${p => p.theme.dropShadowLight};
  // margin-bottom: 30px;
// `;

// const SettingsPanelHeader = styled.div`
  // border-bottom: 1px solid ${p => p.theme.borderDark};
  // border-radius: ${p => p.theme.radius} ${p => p.theme.radius} 0 0;
  // background: ${p => p.theme.offWhite}
  // padding: 15px 20px;
// `;

export default ProjectSettingsLayout;
