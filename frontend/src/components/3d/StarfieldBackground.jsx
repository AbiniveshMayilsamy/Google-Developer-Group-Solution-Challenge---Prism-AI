export default function StarfieldBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(0, 255, 204, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255, 204, 0, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(255, 0, 204, 0.06) 0%, transparent 50%), #030305',
        animation: 'bgPulse 8s ease-in-out infinite alternate',
      }}
    />
  );
}
