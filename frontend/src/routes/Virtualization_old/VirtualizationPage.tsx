/* Copyright Contributors to the Open Cluster Management project */
import { PageSection } from '@patternfly/react-core'
import { useTranslation } from '../../lib/acm-i18next'
import { AcmPage, AcmPageContent, AcmPageHeader } from '../../ui-components'
import { VirtualMachineTable } from './VirtualizationTable'
import { useSearchResultItemsQuery } from '../Search/search-sdk/search-sdk'
import { searchClient } from '../Search/search-sdk/search-client'
import { NavigationPath } from '../../NavigationPath'

const VirtualizationPage = () => {
  const { t } = useTranslation()

  const {
    data: vmiQueryData,
    loading,
    error,
  } = useSearchResultItemsQuery({
    client: process.env.NODE_ENV === 'test' ? undefined : searchClient,
    variables: {
      input: [
        {
          keywords: [],
          filters: [
            { property: 'kind', values: ['VirtualMachineInstance'] },
            { property: 'cluster', values: ['local-cluster'] },
          ],
          limit: -1,
        },
      ],
    },
  })
  console.log(vmiQueryData, loading, error)
  const title = 'Virtual machines'
  const breadcrumbs = [{ text: t('Virtualization'), to: NavigationPath.virtualizationManagement }, { text: title }]
  return (
    <AcmPage
      header={
        <AcmPageHeader
          title={t('Virtual machines')}
          description={t(
            'Explore your virtual machines, organized by cluster, to quickly find and see their status and details.'
          )}
          breadcrumb={breadcrumbs}
        />
      }
    >
      <AcmPageContent id="access-control-management">
        <PageSection>
          <VirtualMachineTable vmis={vmiQueryData?.searchResult?.[0]?.items || []} />
        </PageSection>
      </AcmPageContent>
    </AcmPage>
  )
}

export { VirtualizationPage }
