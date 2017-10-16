from __future__ import absolute_import

from django.core.urlresolvers import reverse

from sentry.models import AuthIdentity, AuthProvider, OrganizationMember, Organization
from sentry.testutils import APITestCase, PermissionTestCase


class OrganizationAuthProviderPermissionTest(PermissionTestCase):
    def setUp(self):
        super(OrganizationAuthProviderPermissionTest, self).setUp()
        self.path = reverse(
            'sentry-api-0-organization-auth-provider',
            args=[self.organization.slug]
        )

    def test_member_can_get(self):
        with self.feature('organizations:sso'):
            self.assert_member_can_access(self.path)

    def test_member_cannot_delete(self):
        self.auth_provider = AuthProvider.objects.create(
            organization=self.organization,
            provider='dummy',
        )

        with self.feature('organizations:sso'):
            self.assert_member_cannot_access(
                self.path, method="DELETE", data={
                    'provider': 'dummy', 'init': True})

    def test_teamless_admin_cannot_delete(self):
        self.auth_provider = AuthProvider.objects.create(
            organization=self.organization,
            provider='dummy',
        )

        with self.feature('organizations:sso'):
            self.assert_teamless_admin_cannot_access(
                self.path, method="DELETE", data={
                    'provider': 'dummy', 'init': True})

    def test_team_admin_cannot_delete(self):
        self.auth_provider = AuthProvider.objects.create(
            organization=self.organization,
            provider='dummy',
        )

        with self.feature('organizations:sso'):
            self.assert_team_admin_cannot_access(
                self.path, method="DELETE", data={
                    'provider': 'dummy', 'init': True})

    def test_manager_cannot_delete(self):
        self.auth_provider = AuthProvider.objects.create(
            organization=self.organization,
            provider='dummy',
        )

        with self.feature('organizations:sso'):
            self.assert_role_cannot_access(
                self.path, 'manager', method="DELETE", data={
                    'provider': 'dummy', 'init': True})

    def test_owner_can_delete(self):
        self.auth_provider = AuthProvider.objects.create(
            organization=self.organization,
            provider='dummy',
        )

        with self.feature('organizations:sso'):
            self.assert_owner_can_access(
                self.path, method="DELETE", data={
                    'provider': 'dummy', 'init': True})


# `self.client.post` to web/frontend don't work when we extend APITestCase??
class OrganizationAuthProviderApiEndpoint(APITestCase):
    def test_validation_update_provider_settings(self):
        organization = self.create_organization(name='foo', owner=self.user)

        auth_provider = AuthProvider.objects.create(
            organization=organization,
            provider='dummy',
        )

        assert not getattr(auth_provider.flags, 'allow_unlinked')

        path = reverse('sentry-api-0-organization-auth-provider',
                       args=[organization.slug])

        self.login_as(self.user)

        with self.feature('organizations:sso'):
            resp = self.client.put(
                path, {'require_link': True}
            )

        assert resp.status_code == 200

        with self.feature('organizations:sso'):
            resp = self.client.put(
                path, {'default_role': 'invalid'})

        assert resp.status_code == 400

    def test_update_provider_settings(self):
        organization = self.create_organization(name='foo', owner=self.user)

        auth_provider = AuthProvider.objects.create(
            organization=organization,
            provider='dummy',
        )

        assert not getattr(auth_provider.flags, 'allow_unlinked')

        path = reverse('sentry-api-0-organization-auth-provider',
                       args=[organization.slug])

        self.login_as(self.user)

        with self.feature('organizations:sso'):
            resp = self.client.put(
                path, {'require_link': False, 'default_role': 'admin'})

        assert resp.status_code == 200

        auth_provider = AuthProvider.objects.get(id=auth_provider.id)
        organization = Organization.objects.get(id=organization.id)

        assert organization.default_role == 'admin'
        assert getattr(auth_provider.flags, 'allow_unlinked')

    def test_disable_provider(self):
        organization = self.create_organization(name='foo', owner=self.user)

        auth_provider = AuthProvider.objects.create(
            organization=organization,
            provider='dummy',
        )

        AuthIdentity.objects.create(
            user=self.user,
            ident='foo',
            auth_provider=auth_provider,
        )

        om = OrganizationMember.objects.get(
            user=self.user,
            organization=organization,
        )
        setattr(om.flags, 'sso:linked', True)
        om.save()

        path = reverse('sentry-api-0-organization-auth-provider',
                       args=[organization.slug])

        self.login_as(self.user, organization_id=organization.id)

        with self.feature('organizations:sso'):
            resp = self.client.delete(path)

        assert resp.status_code == 204

        assert not AuthProvider.objects.filter(
            organization=organization).exists()
        assert not AuthProvider.objects.filter(id=auth_provider.id).exists()

        om = OrganizationMember.objects.get(id=om.id)

        assert not getattr(om.flags, 'sso:linked')
