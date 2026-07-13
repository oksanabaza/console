/* Copyright Contributors to the Open Cluster Management project */

import { AcmAlertContext, AcmForm, AcmModal, AcmSubmit } from '../../../../../ui-components'
import { ActionGroup, Button, Content, TextArea } from '@patternfly/react-core'
import { ModalVariant } from '@patternfly/react-core/deprecated'
import { BoldIcon, CodeIcon, ItalicIcon, ListIcon } from '@patternfly/react-icons'
import { Markdown } from '@redhat-cloud-services/rule-components/Markdown'
import { useLayoutEffect, useState } from 'react'
import { useTranslation } from '../../../../../lib/acm-i18next'

export function EditDescription(props: {
  description?: string
  clusterName?: string
  close: () => void
  onSave: (description: string) => Promise<void>
}) {
  const { t } = useTranslation()
  const [description, setDescription] = useState<string>(props.description ?? '')
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const isOpen = props.clusterName !== undefined

  useLayoutEffect(() => {
    if (isOpen) {
      setDescription(props.description ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const insertMarkdown = (syntax: string) => {
    setDescription(description + syntax)
  }

  return (
    <AcmModal title={t('Edit cluster description')} isOpen={isOpen} variant={ModalVariant.medium} onClose={props.close}>
      <AcmAlertContext.Consumer>
        {(alertContext) => (
          <AcmForm style={{ gap: 0 }}>
            <div>
              {t(
                'Add links and notes your team uses for this cluster. Use Markdown to format text; formatting is applied when you save.'
              )}
            </div>
            &nbsp;
            {/* Toolbar */}
            <div style={{ marginBottom: '8px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Button variant="plain" aria-label={t('Bold')} onClick={() => insertMarkdown('**bold text**')}>
                <BoldIcon />
              </Button>
              <Button variant="plain" aria-label={t('Italic')} onClick={() => insertMarkdown('*italic text*')}>
                <ItalicIcon />
              </Button>
              <Button variant="plain" aria-label={t('Code')} onClick={() => insertMarkdown('`code`')}>
                <CodeIcon />
              </Button>
              <Button variant="plain" aria-label={t('List')} onClick={() => insertMarkdown('\n- List item')}>
                <ListIcon />
              </Button>
              <div style={{ marginLeft: 'auto' }}>
                <Button variant="link" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? t('Edit') : t('Preview')}
                </Button>
              </div>
            </div>
            {!showPreview ? (
              <TextArea
                id="description-input"
                value={description}
                onChange={(_event, value) => setDescription(value)}
                resizeOrientation="vertical"
                rows={15}
                placeholder={t(
                  'Example description:\n**Weekly managed cluster**\n\nDeployed fresh each week for dev/test workloads.\n\n- [Grafana dashboard](https://grafana.example.com/d/weekly-managed)\n- [Runbook](https://wiki.example.com/runbooks/weekly-managed)\n\nSupported formatting:\nBold (**text**), italic (*text*), links ([label](url)), inline code (`code`)'
                )}
              />
            ) : (
              <div
                style={{
                  border: '1px solid var(--pf-v6-global--BorderColor--100)',
                  borderRadius: '3px',
                  padding: '16px',
                  minHeight: '300px',
                  background: 'var(--pf-v6-global--BackgroundColor--100)',
                }}
              >
                <Content>
                  <Markdown template={description || t('No description provided')} />
                </Content>
              </div>
            )}
            <ActionGroup>
              <AcmSubmit
                id="save"
                variant="primary"
                onClick={async () => {
                  alertContext.clearAlerts()
                  try {
                    await props.onSave(description)
                    props.close()
                  } catch (err) {
                    if (err instanceof Error) {
                      alertContext.addAlert({
                        type: 'danger',
                        title: t('Request failed'),
                        message: err.message,
                      })
                    }
                  }
                }}
              >
                {t('Save')}
              </AcmSubmit>
              <Button variant="link" onClick={props.close}>
                {t('Cancel')}
              </Button>
            </ActionGroup>
          </AcmForm>
        )}
      </AcmAlertContext.Consumer>
    </AcmModal>
  )
}
