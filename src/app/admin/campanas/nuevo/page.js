'use client'

import Breadcrumbs from '@/components/shared/Breadcrumbs'
import CampanaForm from '../CampanaForm'
import { crearCampana } from '@/services/campanasAdminService'

export default function NuevaCampanaPage() {

    return (
        <div className="p-8 space-y-6 max-w-3xl">

            <Breadcrumbs
                items={[
                    { label: 'Gestión de campañas', href: '/admin/campanas' },
                    { label: 'Nueva publicación' }
                ]}
            />

            <div>
                <h1 className="text-2xl font-semibold text-black">Nueva publicación</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Publica contenido en el feed de Campañas.
                </p>
            </div>

            <CampanaForm onSubmit={crearCampana} />

        </div>
    )

}