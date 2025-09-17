/* Copyright Contributors to the Open Cluster Management project */
import { useCallback, useMemo, useEffect } from 'react'
import { AcmMultiSelect } from '../../../ui-components'
import { SelectOption } from '@patternfly/react-core'
import { SelectVariant } from '../../../components/AcmSelectBase'
import { Cluster } from './hook/RoleAssignmentDataHook'

type NamespaceSelectorProps = {
  selectedClusters: string[]
  clusters: Cluster[]
  onChangeNamespaces: (namespaces: string[]) => void
  selectedNamespaces?: string[]
}

const NamespaceSelector = ({
  selectedClusters,
  clusters,
  onChangeNamespaces,
  selectedNamespaces = [],
}: NamespaceSelectorProps) => {
  const namespaceOptions = useMemo(() => {
    if (selectedClusters.length === 0) {
      return []
    }

    const namespaces = new Set<string>()

    // Find namespaces for selected clusters
    clusters.forEach((cluster) => {
      const isMatch = selectedClusters.some((selectedCluster) => {
        const selectedStr = selectedCluster?.toString().trim()
        const clusterStr = cluster.name?.toString().trim()
        const match = selectedStr === clusterStr
        return match
      })

      if (isMatch) {
        if (cluster.namespaces) {
          cluster.namespaces?.forEach((namespace: string) => {
            namespaces.add(namespace)
          })
        }
      }
    })

    const finalNamespaces = Array.from(namespaces)

    const options = finalNamespaces.sort().map((ns) => ({ id: ns, value: ns }))

    return options
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClusters, clusters])

  const handleNamespaceChange = useCallback(
    (namespaces: string[] | undefined) => {
      onChangeNamespaces(namespaces || [])
    },
    [onChangeNamespaces]
  )

  // Clear namespaces when no clusters are selected
  useEffect(() => {
    if (selectedClusters.length === 0 && selectedNamespaces.length > 0) {
      onChangeNamespaces([])
    }
  }, [selectedClusters.length, selectedNamespaces.length, onChangeNamespaces])

  if (selectedClusters.length === 0) {
    return null
  }

  return (
    <AcmMultiSelect
      id="namespace-selector"
      variant={SelectVariant.typeaheadMulti}
      label="Select shared namespaces"
      placeholder="Select namespaces to target"
      value={selectedNamespaces}
      onChange={handleNamespaceChange}
      menuAppendTo="parent"
      maxHeight="18em"
    >
      {namespaceOptions.map((option) => (
        <SelectOption key={option.id} value={option.value}>
          {option.value}
        </SelectOption>
      ))}
    </AcmMultiSelect>
  )
}

export { NamespaceSelector }
