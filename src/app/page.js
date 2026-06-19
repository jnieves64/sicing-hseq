'use client'

import Header from '@/components/layout/Header'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import ModuleGrid from '@/components/dashboard/ModuleGrid'

export default function Home() {


  return (
    <main className='min-h-screen bg-gray-50'>

      <Header />
      <DashboardHeader />
      <ModuleGrid />

    </main>
  )
}