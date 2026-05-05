import Sidebar from '@/components/Sidebar'
import ReactQueryProvider from '@/providers/ReactQueryProvider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      <ReactQueryProvider>
      {children}
      </ReactQueryProvider>
    </Sidebar>
  )
}
