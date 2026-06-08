import { requireAuth } from '@/lib/auth-utils'

const Dashboard = async () => {
    const user = await requireAuth();

    return (
        <div className='min-h-screen flex items-center justify-center'>Welcome to the Dashboard, {user.name}</div>
    )
}

export default Dashboard