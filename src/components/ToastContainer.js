'use client';

export default function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast ${t.type}`}>
                    <span className="toast-icon">{t.type === 'alert' ? '⚡' : '→'}</span>
                    <div className="toast-body">
                        <div className="toast-title">{t.title}</div>
                        <div className="toast-message">{t.message}</div>
                    </div>
                    <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
                </div>
            ))}
        </div>
    );
}
