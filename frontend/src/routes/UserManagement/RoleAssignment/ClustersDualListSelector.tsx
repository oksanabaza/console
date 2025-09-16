/* Copyright Contributors to the Open Cluster Management project */
import { DualListSelector, DualListSelectorTreeItemData } from '@patternfly/react-core'
import React, { useCallback, useEffect } from 'react'
import { Cluster } from './hook/RoleAssignmentDataHook'

type ClustersDualListSelectorProps = {
  onChoseOptions: (values: { id: string; value: string }[]) => void
  clusters: Cluster[]
}

const ClustersDualListSelector = ({ onChoseOptions, clusters }: ClustersDualListSelectorProps) => {
  // Group clusters by clusterSet for the tree structure
  const clustersGroupedBySet = React.useMemo(() => {
    const grouped = clusters.reduce(
      (acc, cluster) => {
        const clusterSet = cluster.clusterSet || 'default'
        if (!acc[clusterSet]) {
          acc[clusterSet] = []
        }
        acc[clusterSet].push(cluster)
        return acc
      },
      {} as Record<string, Cluster[]>
    )
    return grouped
  }, [clusters])

  const [availableOptions, setAvailableOptions] = React.useState<DualListSelectorTreeItemData[]>([])

  // Update availableOptions when clusters change
  React.useEffect(() => {
    const newAvailableOptions = Object.keys(clustersGroupedBySet).map((clusterSetName) => ({
      id: clusterSetName,
      text: clusterSetName,
      isChecked: false,
      checkProps: { 'aria-label': clusterSetName },
      hasBadge: true,
      badgeProps: { isRead: true },
      children: clustersGroupedBySet[clusterSetName]?.map((cluster) => ({
        id: cluster.name,
        text: cluster.name,
        isChecked: false,
        hasBadge: true,
        checkProps: { 'aria-label': cluster.name },
      })),
    }))
    setAvailableOptions(newAvailableOptions)
  }, [clustersGroupedBySet])

  const [chosenOptions, setChosenOptions] = React.useState<DualListSelectorTreeItemData[]>([])

  const onListChange = useCallback(
    (
      _event: React.MouseEvent<HTMLElement>,
      newAvailableOptions: DualListSelectorTreeItemData[],
      newChosenOptions: DualListSelectorTreeItemData[]
    ) => {
      setAvailableOptions(newAvailableOptions.sort())
      setChosenOptions(newChosenOptions.sort())
      const selectedClusters: { id: string; value: string }[] = []

      newChosenOptions.forEach((chosenOption) => {
        if (!chosenOption.children || chosenOption.children.length === 0) {
          if (chosenOption.isChecked) {
            selectedClusters.push({ id: chosenOption.id, value: chosenOption.text })
          }
        } else if (chosenOption.children) {
          chosenOption.children.forEach((child) => {
            if (child.isChecked) {
              selectedClusters.push({ id: child.id, value: child.text })
            }
          })
        }
      })
      onChoseOptions(selectedClusters)
    },
    [onChoseOptions]
  )

  useEffect(() => {
    const selectedClusters: { id: string; value: string }[] = []

    chosenOptions.forEach((chosenOption) => {
      if (!chosenOption.children || chosenOption.children.length === 0) {
        if (chosenOption.isChecked) {
          selectedClusters.push({ id: chosenOption.id, value: chosenOption.text })
        }
      } else if (chosenOption.children) {
        chosenOption.children.forEach((child) => {
          if (child.isChecked) {
            selectedClusters.push({ id: child.id, value: child.text })
          }
        })
      }
    })

    onChoseOptions(selectedClusters)
  }, [chosenOptions, onChoseOptions])

  const handleOptionCheck = useCallback(
    (
      _event: React.MouseEvent<Element> | React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<Element>,
      checked: boolean,
      checkedId: string
    ) => {
      const updatedChosenOptions = chosenOptions.map((option) => {
        if (option.id === checkedId) {
          return { ...option, isChecked: checked }
        }

        if (option.children) {
          const updatedChildren = option.children.map((child) =>
            child.id === checkedId ? { ...child, isChecked: checked } : child
          )
          return { ...option, children: updatedChildren }
        }

        return option
      })
      setChosenOptions(updatedChosenOptions)
    },
    [chosenOptions]
  )

  return (
    <DualListSelector
      isSearchable
      isTree
      availableOptions={availableOptions}
      chosenOptions={chosenOptions}
      onListChange={onListChange as any}
      onOptionCheck={handleOptionCheck}
      id="clusters-dual-list-selector-tree"
    />
  )
}

export { ClustersDualListSelector }
