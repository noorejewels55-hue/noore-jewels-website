export const metadata = {
    title: 'Admin Dashboard — Noore Jewels',
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
    return (
        <div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
            {children}
        </div>
    );
}
