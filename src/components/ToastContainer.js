'use client';

export default function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="toast-container" role="status" aria-live="polite" aria-label="Notifications">
            {toasts.map(t => (
                <div key={t.id} className={`toast ${t.type}`}>
                    <span className="toast-icon" aria-hidden="true">{t.type === 'alert' ? '⚡' : '→'}</span>
                    <div className="toast-body">
                        <div className="toast-title">{t.title}</div>
                        <div className="toast-message">{t.message}</div>
                    </div>
                    <button className="toast-close" onClick={() => removeToast(t.id)} aria-label="Dismiss notification">✕</button>
                </div>
            ))}
        </div>
    );
}
