/* Copyright Contributors to the Open Cluster Management project */
import { Card, CardBody, Flex, FlexItem, Divider, Title, TextContent,Text } from '@patternfly/react-core'
// type SplitCardProps = {
//     vmis: any[]
//   }
export function SplitCard() {
    const usage = ['0.10m','1.600 MiB','4.01 GiB']
    const vm = ['0','400','100','0']
  return (
    <Card style={{ borderRadius: '12px', width: '70%', marginBottom: '30px' }}>
      <CardBody style={{ padding: 0 }}>
        <Flex style={{ height: '100%' }}>
           <FlexItem style={{ flex: 1, padding: '30px' }}>
              <Title headingLevel="h4" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                Virtual machines (5)
              </Title>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                {['Error','Running', 'Stopped','Migrating'].map((label, index) => (
                  <FlexItem key={label}>
                    <TextContent>
                      <Text component="p">{vm[index]}</Text>
                      <Text component="small">{label}</Text>
                    </TextContent>
                  </FlexItem>
                ))}
              </Flex>
            </FlexItem>
          <Divider style={{height:"auto"}}
            orientation={{
              default: 'vertical',
            }}
          />
             <FlexItem style={{ flex: 1, padding: '30px' }}>
               <Title headingLevel="h4" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                Usage
               </Title>
               <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                 {['vCPU', 'Memory', 'Storage'].map((label, index) => (
                  <FlexItem key={label}>
                    <TextContent>
                      <Text component="small" style={{ fontWeight: 'bold' }}>{label}</Text>
                      <Text component="p">{usage[index]}</Text>
                    </TextContent>
                  </FlexItem>
                ))}
              </Flex>
            </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  )
}
