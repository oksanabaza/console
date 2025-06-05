/* Copyright Contributors to the Open Cluster Management project */
import { fitContent } from '@patternfly/react-table'
import jsYaml from 'js-yaml'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { TFunction } from 'react-i18next'
import { generatePath, Link, NavigateFunction } from 'react-router-dom-v5-compat'
import { BulkActionModalProps } from '../../components/BulkActionModal'
import { RbacDropdown } from '../../components/Rbac'
import AcmTimestamp from '../../lib/AcmTimestamp'
import { rbacDelete, rbacGet, rbacPatch } from '../../lib/rbac-util'
import { NavigationPath } from '../../NavigationPath'
import { AccessControl } from '../../resources/access-control'
import { Cluster, createDownloadFile, deleteResource, getISOStringTimestamp } from '../../resources/utils'
import { AcmLabels, compareStrings } from '../../ui-components'
import { AccessControlStatus } from './AccessControlStatus'

const LABELS_LENGTH = 2
const EXPORT_FILE_PREFIX = 'access-control-management'

const VM_ACTIONS = {
  EDIT: ({ vm, navigate }: { vm: any; navigate: NavigateFunction }) => {
    console.log('Edit VM:', vm.name)
    // navigate(`/edit/${vm._uid}`)
  },
  DELETE: ({ vm }: { vm: any }) => {
    console.log('Delete VM:', vm.name)
    // navigate(`/delete/${vm._uid}`)
  },
}

const COLUMN_CELLS = {
  LABELS: (vm: any, t: TFunction) => {
    const rawLabel = vm.label ?? ''
    const labelPairs = rawLabel
      .split(';')
      .map((label: string) => label.trim())
      .filter(Boolean)

    // const uniqueLabels = Array.from(new Set(labelPairs))
    const uniqueLabels = Array.from(new Set(labelPairs)) as string[]
    console.log(uniqueLabels, 'uniqueLabels')
    return uniqueLabels.length > 0 ? (
      <AcmLabels
        labels={labelPairs}
        expandedText={t('Show less')}
        collapsedText={t('show.more', { count: uniqueLabels.length })}
        allCollapsedText={t('count.items', { count: uniqueLabels.length })}
        // isCompact={uniqueLabels.length > LABELS_LENGTH}
        isCompact={labelPairs.length > LABELS_LENGTH}
      />
    ) : (
      <span style={{ whiteSpace: 'nowrap' }}>-</span>
    )
  },
  // NAME: (accessControl: AccessControl) => (
  //   <span style={{ whiteSpace: 'nowrap' }}>
  //     <Link
  //       to={generatePath(NavigationPath.viewAccessControlManagement, {
  //         id: accessControl.metadata?.uid!,
  //       })}
  //     >
  //       {accessControl.metadata?.name}
  //     </Link>
  //   </span>
  // ),
  // CLUSTER: (accessControl: AccessControl) => (
  //   <span style={{ whiteSpace: 'nowrap' }}>
  //     {accessControl.metadata?.namespace ? (
  //       <Link
  //         to={generatePath(NavigationPath.clusterDetails, {
  //           name: accessControl.metadata?.namespace,
  //           namespace: accessControl.metadata?.namespace,
  //         })}
  //       >
  //         {accessControl.metadata?.namespace}
  //       </Link>
  //     ) : (
  //       '-'
  //     )}
  //   </span>
  // ),
  // USER_GROUP: (accessControl: AccessControl, t: TFunction) => {
  //   const roleBindingsSubjectNames =
  //     accessControl.spec.roleBindings?.flatMap((rb) =>
  //       rb.subject ? [`${rb.subject.kind}: ${rb.subject.name}`] : rb.subjects?.map((s) => `${s.kind}: ${s.name}`) ?? []
  //     ) ?? []

  //   const clusterRoleBindingSubjectNames =
  //     accessControl.spec.clusterRoleBinding?.subjects?.map((s) => `${s.kind}: ${s.name}`) ??
  //     (accessControl.spec.clusterRoleBinding?.subject
  //       ? [
  //           `${accessControl.spec.clusterRoleBinding.subject.kind}: ${accessControl.spec.clusterRoleBinding.subject.name}`,
  //         ]
  //       : [])

  //   const users_groups = [...roleBindingsSubjectNames, ...clusterRoleBindingSubjectNames]

  //   const uniqueUsersGroups = Array.from(new Set(users_groups))
  //   return users_groups ? (
  //     <AcmLabels
  //       labels={uniqueUsersGroups}
  //       expandedText={t('Show less')}
  //       collapsedText={t('show.more', { count: users_groups.length })}
  //       allCollapsedText={t('count.items', { count: users_groups.length })}
  //       isCompact={uniqueUsersGroups.length > LABELS_LENGTH}
  //     />
  //   ) : (
  //     <span style={{ whiteSpace: 'nowrap' }}>'-'</span>
  //   )
  // },
  // ROLES: (accessControl: AccessControl, t: TFunction) => {
  //   const roleBindingRoles = accessControl.spec.roleBindings?.map((e) => e.roleRef.name) ?? []
  //   const clusterRoleBindingRole = accessControl.spec.clusterRoleBinding?.roleRef?.name

  //   const allRoles = [...roleBindingRoles, clusterRoleBindingRole].filter((role): role is string => !!role)

  //   const uniqueRoles = Array.from(new Set(allRoles))

  //   return uniqueRoles.length > 0 ? (
  //     <AcmLabels
  //       labels={uniqueRoles}
  //       expandedText={t('Show less')}
  //       collapsedText={t('show.more', { count: uniqueRoles.length })}
  //       allCollapsedText={t('count.items', { count: uniqueRoles.length })}
  //       isCompact={uniqueRoles.length > LABELS_LENGTH}
  //     />
  //   ) : (
  //     <span style={{ whiteSpace: 'nowrap' }}>'-'</span>
  //   )
  // },
  // NAMESPACES: (accessControl: AccessControl, t: TFunction) => {
  //   const roleBindingNamespaces = accessControl.spec.roleBindings?.map((e) => e.namespace) ?? []
  //   const hasCRB = !!accessControl.spec.clusterRoleBinding?.roleRef
  //   const allNamespaces = [...roleBindingNamespaces, ...(hasCRB ? ['All Namespaces'] : [])]

  //   const uniqueNamespaces = Array.from(new Set(allNamespaces))

  //   return uniqueNamespaces.length > 0 ? (
  //     <AcmLabels
  //       labels={uniqueNamespaces}
  //       expandedText={t('Show less')}
  //       collapsedText={t('show.more', { count: uniqueNamespaces.length })}
  //       allCollapsedText={t('count.items', { count: uniqueNamespaces.length })}
  //       isCompact={uniqueNamespaces.length > LABELS_LENGTH}
  //     />
  //   ) : (
  //     <span style={{ whiteSpace: 'nowrap' }}>'-'</span>
  //   )
  // },
  // // STATUS: (accessControl: AccessControl) => <AccessControlStatus condition={accessControl.status?.conditions?.[0]} />,
  // CREATION_DATE: (accessControl: AccessControl) => (
  //   <span style={{ whiteSpace: 'nowrap' }}>
  //     <AcmTimestamp timestamp={accessControl.metadata?.creationTimestamp} />
  //   </span>
  // ),
  // ACTIONS: (
  //   accessControl: AccessControl,
  //   t: AccessControlManagementTableHelperProps['t'],
  //   setModalProps: AccessControlManagementTableHelperProps['setModalProps'],
  //   navigate: AccessControlManagementTableHelperProps['navigate']
  // ) => (
  //   <RbacDropdown<AccessControl>
  //     id={`${accessControl.metadata?.uid}-actions`}
  //     item={accessControl}
  //     isKebab={true}
  //     text={t('Actions')}
  //     actions={[
  //       {
  //         id: 'editAccessControl',
  //         text: t('Edit Access Control'),
  //         isAriaDisabled: true,
  //         click: (accessControl) => ACTIONS.EDIT({ accessControl, navigate }),
  //         rbac: [rbacPatch(accessControl)],
  //       },
  //       {
  //         id: 'deleteAccessControl',
  //         text: t('Delete Access Control'),
  //         isAriaDisabled: true,
  //         click: (accessControl) => ACTIONS.DELETE({ accessControls: [accessControl], setModalProps, t }),
  //         rbac: [rbacDelete(accessControl)],
  //       },
  //       {
  //         id: 'exportAccessControl',
  //         text: t('Export to YAML'),
  //         isAriaDisabled: true,
  //         click: (accessControl) => ACTIONS.EXPORT_YAML(accessControl, EXPORT_FILE_PREFIX),
  //         rbac: [rbacGet(accessControl)],
  //       },
  //     ]}
  //   />
  // ),
}

const vmTableColumns = ({ t, navigate }: { t: TFunction; navigate: NavigateFunction }) => [
  {
    header: t('Name'),
    cell: (item: any) => <span>{item.name}</span>,
    search: (item: any) => item.name,
  },
  {
    header: t('Status'),
    cell: (item: any) => <span>{item.status}</span>,
    search: (item: any) => item.status,
  },
  {
    header: t('CPU usage'),
    cell: (item: any) => <span>N/A</span>,
  },
  {
    header: t('Memory usage'),
    cell: (item: any) => <span>N/A</span>,
  },
  {
    header: t('Disk usage'),
    cell: (item: any) => <span>N/A</span>,
  },
  {
    header: t('IP address'),
    cell: (item: any) => <span>{item.ipaddress}</span>,
    search: (item: any) => item.ipaddress,
  },
  {
    header: t('Labels'),
    cell: (item: any) => COLUMN_CELLS.LABELS(item, t),
  },
  {
    header: '',
    cellTransforms: [fitContent],
    cell: (vm: any) => (
      <RbacDropdown
        id={`vm-${vm._uid}-actions`}
        item={vm}
        isKebab
        text="Actions"
        actions={[
          {
            id: 'edit',
            text: 'Edit',
            click: () => VM_ACTIONS.EDIT({ vm, navigate }),
          },
          {
            id: 'delete',
            text: 'Delete',
            click: () => VM_ACTIONS.DELETE({ vm }),
          },
        ]}
      />
    ),
  },
]

const useVmFilters = ({ vmis, t }: { vmis: any[]; t: TFunction }) => {
  const nodeOptions = [...new Set(vmis.map((vm) => vm.node))].map((node) => ({
    label: node,
    value: node,
  }))

  return [
    {
      id: 'node',
      label: t('Node'),
      options: nodeOptions,
      tableFilterFn: (selected: string[], item: any) => selected.includes(item.node),
    },
    {
      id: 'status',
      label: t('Status'),
      options: ['Running', 'Stopped', 'Pending'].map((s) => ({ label: s, value: s })),
      tableFilterFn: (selected: string[], item: any) => selected.includes(item.phase),
    },
  ]
}

export { vmTableColumns, VM_ACTIONS, useVmFilters, EXPORT_FILE_PREFIX }
