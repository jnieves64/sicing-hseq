import AuthGuard from '@/components/auth/AuthGuard'
import IndicadoresPageView from './IndicadoresPageView'

export default function IndicadoresPage() {
    return (
        <AuthGuard ruta="/indicadores">
            <IndicadoresPageView />
        </AuthGuard>
    )
}