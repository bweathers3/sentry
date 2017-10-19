import {Box} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';

import {extractMultilineFields} from '../../../../utils';
import {t} from '../../../../locale';
import ApiMixin from '../../../../mixins/apiMixin';
import BooleanField from '../../../../components/forms/next/booleanField';
import Form from '../../../../components/forms/next/form';
import FormState from '../../../../components/forms/state';
import IndicatorStore from '../../../../stores/indicatorStore';
import LoadingIndicator from '../../../../components/loadingIndicator';
import OrganizationStore from '../../../../stores/organizationStore';
import PanelBody from '../../../../components/forms/next/styled/panelBody';
import PanelHeader from '../../../../components/forms/next/styled/panelHeader';
import Select2Field from '../../../../components/forms/next/select2Field';
import Panel from '../../../../components/forms/next/styled/panel';
import TextField from '../../../../components/forms/next/textField';
import TextareaField from '../../../../components/forms/next/textareaField';

const OrganizationSettingsForm = React.createClass({
  propTypes: {
    orgId: PropTypes.string.isRequired,
    access: PropTypes.object.isRequired,
    initialData: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired
  },

  mixins: [ApiMixin],

  getInitialState() {
    return {
      formData: this.buildFormData(this.props.initialData),
      errors: {},
      hasChanges: false
    };
  },

  buildFormData(data) {
    let result = {
      name: data.name,
      slug: data.slug,
      openMembership: data.openMembership,
      allowSharedIssues: data.allowSharedIssues,
      isEarlyAdopter: data.isEarlyAdopter,
      enhancedPrivacy: data.enhancedPrivacy,
      dataScrubber: data.dataScrubber,
      dataScrubberDefaults: data.dataScrubberDefaults,
      scrubIPAddresses: data.scrubIPAddresses,
      safeFields: data.safeFields.join('\n'),
      sensitiveFields: data.sensitiveFields.join('\n')
    };
    if (this.props.access.has('org:admin')) {
      result.defaultRole = data.defaultRole;
    }
    return result;
  },

  onSubmit(e) {
    e.preventDefault();

    if (this.state.state == FormState.SAVING) {
      return;
    }

    this.setState(
      {
        state: FormState.SAVING,
        hasChanges: false
      },
      () => {
        let loadingIndicator = IndicatorStore.add(t('Saving changes..'));
        let {orgId} = this.props;
        let formData = this.state.formData;
        this.api.request(`/organizations/${orgId}/`, {
          method: 'PUT',
          data: {
            ...formData,
            safeFields: extractMultilineFields(formData.safeFields),
            sensitiveFields: extractMultilineFields(formData.sensitiveFields)
          },
          success: data => {
            this.props.onSave(data);
            this.setState({
              state: FormState.READY,
              errors: {}
            });
            IndicatorStore.remove(loadingIndicator);
            IndicatorStore.add(t('Changes saved.'), 'success', {
              duration: 1500
            });
          },
          error: error => {
            this.setState({
              state: FormState.ERROR,
              errors: error.responseJSON
            });
            IndicatorStore.remove(loadingIndicator);
            IndicatorStore.add(t('Unable to save changes. Please try again.'), 'error', {
              duration: 3000
            });
          }
        });
      }
    );
  },

  render() {
    let {errors, formData} = this.state;
    let {access, initialData, orgId} = this.props;

    let sensitiveFieldsHelp = (
      <span>
        {t(
          'Additional field names to match against when scrubbing data for all projects. Separate multiple entries with a newline.'
        )}
        <br />
        <strong>
          {t('Note: These fields will be used in addition to project specific fields.')}
        </strong>
      </span>
    );

    let safeFieldsHelp = (
      <span>
        {t(
          'Field names which data scrubbers should ignore. Separate multiple entries with a newline.'
        )}
        <br />
        <strong>
          {t('Note: These fields will be used in addition to project specific fields.')}
        </strong>
      </span>
    );

    return (
      <Form
        apiMethod="PUT"
        apiEndpoint={`/organizations/${orgId}/`}
        saveOnBlur
        allowUndo
        initialData={initialData}
        onSubmit={this.onSubmit}>
        <Box>
          <Panel>
            <PanelHeader>
              {t('General')}
            </PanelHeader>

            <PanelBody>

              <TextField
                name="name"
                label={t('Name')}
                help={t('The name of your organization. i.e. My Company')}
                value={formData.name}
                required={true}
              />
              <TextField
                name="slug"
                label={t('Short name')}
                value={formData.slug}
                help={t('A unique ID used to identify this organization.')}
                required={true}
              />
              <BooleanField
                name="isEarlyAdopter"
                label={t('Early Adopter')}
                value={formData.isEarlyAdopter}
                help={t("Opt-in to new features before they're released to the public.")}
                required={false}
              />
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader>
              {t('Membership')}
            </PanelHeader>

            <PanelBody>

              {access.has('org:admin') &&
                <Select2Field
                  name="defaultRole"
                  label={t('Default Role')}
                  choices={initialData.availableRoles.map(r => [r.id, r.name])}
                  value={formData.defaultRole}
                  help={t('The default role new members will receive.')}
                  required={true}
                />}

              <BooleanField
                name="openMembership"
                label={t('Open Membership')}
                value={formData.openMembership}
                help={t('Allow organization members to freely join or leave any team.')}
                required={true}
              />
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader>
              {t('Security & Privacy')}
            </PanelHeader>

            <PanelBody>

              <BooleanField
                name="allowSharedIssues"
                label={t('Allow Shared Issues')}
                value={formData.allowSharedIssues}
                help={t(
                  'Enable sharing of limited details on issues to anonymous users.'
                )}
                required={false}
              />

              <BooleanField
                name="enhancedPrivacy"
                label={t('Enhanced Privacy')}
                value={formData.enhancedPrivacy}
                help={t(
                  'Enable enhanced privacy controls to limit personally identifiable information (PII) as well as source code in things like notifications.'
                )}
                required={false}
              />

              <BooleanField
                name="dataScrubber"
                label={t('Require Data Scrubber')}
                value={formData.dataScrubber}
                help={t(
                  'Require server-side data scrubbing be enabled for all projects.'
                )}
                required={false}
              />

              <BooleanField
                name="dataScrubberDefaults"
                label={t('Require Using Default Scrubbers')}
                value={formData.dataScrubberDefaults}
                help={t(
                  'Require the default scrubbers be applied to prevent things like passwords and credit cards from being stored for all projects.'
                )}
                required={true}
              />

              <TextareaField
                name="sensitiveFields"
                label={t('Global sensitive fields')}
                value={formData.sensitiveFields}
                help={sensitiveFieldsHelp}
                placeholder={t('e.g. email')}
                required={false}
              />

              <TextareaField
                name="safeFields"
                label={t('Global safe fields')}
                value={formData.safeFields}
                help={safeFieldsHelp}
                placeholder={t('e.g. email')}
                required={false}
              />

              <BooleanField
                name="scrubIPAddresses"
                label={t('Prevent Storing of IP Addresses')}
                value={formData.scrubIPAddresses}
                help={t(
                  'Preventing IP addresses from being stored for new events on all projects.'
                )}
                required={false}
              />
            </PanelBody>
          </Panel>
        </Box>
      </Form>
    );
  }
});

const NewOrganizationGeneralSettings = React.createClass({
  mixins: [ApiMixin],

  getInitialState() {
    return {
      loading: true,
      error: false,
      data: null
    };
  },

  componentWillMount() {
    this.fetchData();
  },

  fetchData() {
    this.api.request(`/organizations/${this.props.params.orgId}/`, {
      method: 'GET',
      success: data => {
        this.setState({
          data,
          loading: false
        });
      },
      error: () => {
        this.setState({
          loading: false,
          error: true
        });
      }
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
          <div>
            <h3>{t('Organization Settings')}</h3>
            <OrganizationSettingsForm
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

export default NewOrganizationGeneralSettings;
