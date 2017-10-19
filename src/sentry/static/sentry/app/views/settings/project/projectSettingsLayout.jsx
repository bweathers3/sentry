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
      <ProjectContext {...this.props.params} orgId={orgId} projectId={projectId}>
        <SettingsLayout
          {...this.props}
          renderNavigation={() => <ProjectSettingsNavigation {...this.props} />}>

          {React.cloneElement(this.props.children, {
            setProjectNavSection: () => {}
          })}

        </SettingsLayout>
      </ProjectContext>
    );
  }
}

export default ProjectSettingsLayout;
