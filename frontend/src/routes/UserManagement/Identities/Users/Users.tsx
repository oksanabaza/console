/* Copyright Contributors to the Open Cluster Management project */
import { PageSection } from '@patternfly/react-core'
import { useMemo, useCallback } from 'react'
import { generatePath, Link, useNavigate } from 'react-router-dom-v5-compat'
import { HighlightSearchText } from '../../../components/HighlightSearchText'
import { useTranslation } from '../../../lib/acm-i18next'
import { NavigationPath } from '../../../NavigationPath'
import { listUsers, User as RbacUser } from '../../../resources/rbac'
import { useQuery } from '../../../lib/useQuery'
import {
  AcmEmptyState,
  AcmTable,
  compareStrings,
  IAcmRowAction,
  IAcmTableColumn,
  AcmLoadingPage,
} from '../../../ui-components'
import AcmTimestamp from '../../../lib/AcmTimestamp'
import { getISOStringTimestamp } from '../../../resources/utils'

const UsersTable = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: rbacUsers, loading } = useQuery(listUsers)

  const users = useMemo(
    () => rbacUsers?.sort((a, b) => compareStrings(a.metadata.name ?? '', b.metadata.name ?? '')) ?? [],
    [rbacUsers]
  )

  const keyFn = useCallback((user: RbacUser) => user.metadata.name ?? '', [])

  const columns = useMemo<IAcmTableColumn<RbacUser>[]>(
    () => [
      {
        header: t('Name'),
        sort: 'metadata.name',
        search: 'metadata.name',
        cell: (user, search) => (
          <span style={{ whiteSpace: 'nowrap' }}>
            <Link to={generatePath(NavigationPath.identitiesUsersDetails, { id: user.metadata.uid ?? '' })}>
              <HighlightSearchText text={user.metadata.name ?? ''} searchText={search} isTruncate />
            </Link>
          </span>
        ),
        exportContent: (user) => user.metadata.name ?? '',
      },
      {
        header: t('Status'),
        cell: () => <span>{t('Active')}</span>,
        exportContent: () => 'Active',
      },
      {
        header: t('Created'),
        cell: (user) => {
          return user.metadata.creationTimestamp ? (
            <span style={{ whiteSpace: 'nowrap' }}>
              <AcmTimestamp timestamp={user.metadata.creationTimestamp} />
            </span>
          ) : (
            '-'
          )
        },
        sort: 'metadata.creationTimestamp',
        exportContent: (user) =>
          user.metadata.creationTimestamp ? getISOStringTimestamp(user.metadata.creationTimestamp) : '',
      },
    ],
    [t]
  )

  const rowActionResolver = useCallback(
    (user: RbacUser): IAcmRowAction<RbacUser>[] => {
      const actions: IAcmRowAction<RbacUser>[] = [
        {
          id: 'details',
          title: (
            <>
              {t('Impersonate user')} <strong>{user.metadata.name}</strong>
            </>
          ),
          click: () => {
            navigate(generatePath(NavigationPath.identitiesUsersDetails, { id: user.metadata.uid ?? '' }))
          },
        },
        {
          id: 'edit',
          title: t('Edit user'),
          click: () => {
            navigate(generatePath(NavigationPath.identitiesUsersDetails, { id: user.metadata.uid ?? '' }))
          },
        },
        {
          id: 'delete',
          title: t('Delete user'),
          click: () => {
            navigate(generatePath(NavigationPath.identitiesUsersDetails, { id: user.metadata.uid ?? '' }))
          },
        },
      ]

      return actions
    },
    [t, navigate]
  )

  return (
    <PageSection>
      {loading ? (
        <AcmLoadingPage />
      ) : (
        <AcmTable<RbacUser>
          key="users-table"
          columns={columns}
          keyFn={keyFn}
          items={users}
          emptyState={<AcmEmptyState key="usersEmptyState" title={t('No users')} />}
          rowActionResolver={rowActionResolver}
        />
      )}
    </PageSection>
  )
}

export { UsersTable }
