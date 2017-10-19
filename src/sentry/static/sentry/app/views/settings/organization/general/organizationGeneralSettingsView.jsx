import PropTypes from 'prop-types';
import React from 'react';

import {t} from '../../../../locale';
import ApiMixin from '../../../../mixins/apiMixin';
import LoadingIndicator from '../../../../components/loadingIndicator';
import OrganizationStore from '../../../../stores/organizationStore';

const OrganizationGeneralSettingsView = React.createClass({
  propTypes: {
    route: PropTypes.object,
  },

  mixins: [ApiMixin],

  getInitialState() {
    return {
      loading: true,
      error: false,
      data: null
    };
  },

  componentDidMount() {
    let fetchForm;
    if (this.props.route.new) {
      fetchForm = import('./newOrganizationSettingsForm');
    } else {
      fetchForm = import('./oldOrganizationSettingsForm');
    }
    Promise.all([this.fetchData(), fetchForm]).then(
      ([data, Form]) => {
        this.setState({data, loading: false, Form: Form.default});
      },
      () => {
        this.setState({error: true, loading: false});
      }
    );
  },

  fetchData() {
    return new Promise((resolve, reject) => {
      this.api.request(`/organizations/${this.props.params.orgId}/`, {
        method: 'GET',
        success: data => {
          resolve(data);
        },
        error: () => {
          reject();
        }
      });
    });
  },

  onSave(data) {
    // TODO(dcramer): this should propagate
    this.setState({data});
    OrganizationStore.add(data);
  },

  render() {
    let data = this.state.data;
    let orgId = this.props.params.orgId;
    let access = data && new Set(data.access);

    return (
      <div>
        {this.state.loading && <LoadingIndicator />}

        {!this.state.loading &&
          this.state.Form &&
          <div>
            <h3>{t('Organization Settings')}</h3>

            <this.state.Form
              initialData={data}
              orgId={orgId}
              access={access}
              onSave={this.onSave}
            />

            {access.has('org:admin') &&
              !data.isDefault &&
              <div className="box">
                <div className="box-header">
                  <h3>{t('Remove Organization')}</h3>
                </div>
                <div className="box-content with-padding">
                  <p>
                    {t(
                      'Removing this organization will delete all data including projects and their associated events.'
                    )}
                  </p>

                  <fieldset className="form-actions">
                    <a
                      href={`/organizations/${orgId}/remove/`}
                      className="btn btn-danger">
                      {t('Remove Organization')}
                    </a>
                  </fieldset>
                </div>
              </div>}
          </div>}
      </div>
    );
  }
});

export default OrganizationGeneralSettingsView;