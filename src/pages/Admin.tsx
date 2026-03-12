import AdminDashboard from "@/components/admin/AdminDashboard";
import { AdminInstallBanner } from "@/components/admin/AdminInstallBanner";

const Admin = () => {
    return (
        <main className="min-h-screen bg-background text-foreground font-sans section-gradient selection:bg-primary/30">
            <AdminDashboard />
            <AdminInstallBanner />
        </main>
    );
};

export default Admin;
