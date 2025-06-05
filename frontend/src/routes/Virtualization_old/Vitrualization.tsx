/* Copyright Contributors to the Open Cluster Management project */
import { Navigate, Route, Routes } from 'react-router-dom-v5-compat'
import { NavigationPath, createRoutePathFunction } from '../../NavigationPath'
import { VirtualizationPage } from './VirtualizationPage'

const accessControlManagementChildPath = createRoutePathFunction(NavigationPath.virtualizationManagement)

export default function AccessControlManagement() {
  return (
    <Routes>
      <Route
        path={accessControlManagementChildPath(NavigationPath.virtualizationManagement)}
        element={<VirtualizationPage />}
      />
      <Route path="*" element={<Navigate to={NavigationPath.virtualizationManagement} replace />} />
    </Routes>
  )
}
