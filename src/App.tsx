import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AdminPage } from '@/pages/AdminPage'
import { MarketDetailPage } from '@/pages/MarketDetailPage'
import { MarketListPage } from '@/pages/MarketListPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PortfolioPage } from '@/pages/PortfolioPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<MarketListPage />} />
          <Route path="markets/:marketId" element={<MarketDetailPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}