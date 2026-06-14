import { requireAuth } from '@/lib/auth-utils';
import { getConnectedAccount } from '@/features/account/instagram/actions';
import { InstagramSection } from '@/features/account/instagram/components/instagram-section';
import { InstagramMedia } from '@/features/account/instagram/components/instagram-media';

const SettingsPage = async () => {
    const user = await requireAuth();

    const igAccount = await getConnectedAccount(user.id);

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account and integrations.</p>
            </div>

            <div className="border rounded-lg p-6">
                <InstagramSection
                    connected={!!igAccount}
                    igUsername={igAccount?.igUsername ?? null}
                    igUserId={igAccount?.igUserId ?? null}
                />
            </div>

            {igAccount && (
                <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-1">Instagram Media</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Your recent Instagram posts.
                    </p>
                    <InstagramMedia />
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
