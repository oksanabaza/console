/* Copyright Contributors to the Open Cluster Management project */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom-v5-compat'
import { useTranslation } from '../../lib/acm-i18next'
import { AcmEmptyState, AcmTable } from '../../ui-components'
import { vmTableColumns, useVmFilters, VM_ACTIONS } from './VirtualizationTableHelper'
import { BulkActionModal, BulkActionModalProps } from '../../components/BulkActionModal'
import { SplitCard } from './VirtualizationHeaderCard'

const VirtualMachineTable = ({ vmis }: { vmis: any[] }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const filters = useVmFilters({ vmis, t })

  const [modalProps, setModalProps] = useState<BulkActionModalProps<any> | { open: false }>({ open: false })
  
  async function pauseVm(vm: { cluster: string; name: string; namespace: string }) {
    const res = await fetch('/virtualmachineinstances/pause', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        managedCluster: vm.cluster,
        vmName: vm.name,
        vmNamespace: vm.namespace,
      }),
    })
  
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Failed to pause VM: ${err}`)
    }
  
    return res.json()
  }
  
  return (
    <>
      <BulkActionModal {...modalProps} />
      <SplitCard vmis={vmis}/>
      <AcmTable
        items={vmis}
        columns={vmTableColumns({ t, navigate })}
        keyFn={(item) => item._uid}
        filters={filters}
        tableActions={[
          {
            id: 'start',
            title: t('Start'),
            click: (selectedVMs: any[]) => {
              setModalProps({
                open: true,
                title: t('Start virtual machine?'),
                action: t('Start'),
                processing: t('Starting'),
                items: selectedVMs,
                // description: t('Deleted virtual machines cannot be restored.'),
                keyFn: (vm) => vm._uid,
                actionFn: async (vm) => {
                  console.log('Start', vm.name)
                },
                close: () => setModalProps({ open: false }),
                isDanger: true,
              })
            },

            variant: 'bulk-action',
          },
          {
            id: 'restart',
            title: t('Restart'),
            click: (selectedVMs: any[]) => {
              setModalProps({
                open: true,
                title: t('Restart virtual machine?'),
                action: t('Delete'),
                processing: t('Deleting'),
                items: selectedVMs,
                description: t('Deleted virtual machines cannot be restored.'),
                keyFn: (vm) => vm._uid,
                actionFn: async (vm) => {
                  console.log('Delete VM', vm.name)
                },
                close: () => setModalProps({ open: false }),
                isDanger: true,
              })
            },

            variant: 'bulk-action',
          },
          {
            id: 'pause',
            title: t('Pause'),
            click: (selectedVMs: any[]) => {
              setModalProps({
                open: true,
                title: t('Pause virtual machine?'),
                action: t('Pause'),
                processing: t('Pausing'),
                items: selectedVMs,
                // description: t('Deleted virtual machines cannot be restored.'),
                keyFn: (vm) => vm._uid,
                actionFn: async (vm) => {
                  await fetch('/virtualmachineinstances/pause', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      managedCluster: vm.cluster,
                      vmName: vm.name,
                      vmNamespace: vm.namespace,
                    }),
                  })
                },
                
                
                close: () => setModalProps({ open: false }),
                isDanger: true,
              })
            },

            variant: 'bulk-action',
          },
          {
            id: 'migrate',
            title: t('Migrate'),
            click: (selectedVMs: any[]) => {
              setModalProps({
                open: true,
                title: t('Permanently delete virtual machines?'),
                action: t('Delete'),
                processing: t('Deleting'),
                items: selectedVMs,
                description: t('Deleted virtual machines cannot be restored.'),
                keyFn: (vm) => vm._uid,
                actionFn: async (vm) => {
                  console.log('Delete VM', vm.name)
                },
                close: () => setModalProps({ open: false }),
                // isDanger: true,
              })
            },

            variant: 'bulk-action',
          },
          {
            id: 'edit',
            title: t('Edit'),
            click: (selectedVMs: any[]) => {
              setModalProps({
                open: true,
                title: t('Permanently delete virtual machines?'),
                action: t('Delete'),
                processing: t('Deleting'),
                items: selectedVMs,
                description: t('Deleted virtual machines cannot be restored.'),
                keyFn: (vm) => vm._uid,
                actionFn: async (vm) => {
                  console.log('Delete VM', vm.name)
                },
                close: () => setModalProps({ open: false }),
                isDanger: true,
              })
            },

            variant: 'bulk-action',
          },
          {
            id: 'view',
            title: t('View related resources'),
            click: (selectedVMs: any[]) => {
              setModalProps({
                open: true,
                title: t('Permanently delete virtual machines?'),
                action: t('Delete'),
                processing: t('Deleting'),
                items: selectedVMs,
                description: t('Deleted virtual machines cannot be restored.'),
                keyFn: (vm) => vm._uid,
                actionFn: async (vm) => {
                  console.log('Delete VM', vm.name)
                },
                close: () => setModalProps({ open: false }),
                isDanger: true,
              })
            },

            variant: 'bulk-action',
          },
          {
            id: 'delete',
            title: t('Delete'),
            click: (selectedVMs: any[]) => {
              setModalProps({
                open: true,
                title: t('Permanently delete virtual machines?'),
                action: t('Delete'),
                processing: t('Deleting'),
                items: selectedVMs,
                description: t('Deleted virtual machines cannot be restored.'),
                keyFn: (vm) => vm._uid,
                actionFn: async (vm) => {
                  console.log('Delete VM', vm.name)
                },
                close: () => setModalProps({ open: false }),
                isDanger: true,
              })
            },

            variant: 'bulk-action',
          },
        ]}
        rowActions={[]}
        emptyState={<AcmEmptyState title={t('No VMs found')} message={t('There are no virtual machines to show.')} />}
      />
    </>
  )
}

export { VirtualMachineTable }
