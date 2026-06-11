import { GoogleLogin } from '@react-oauth/google';

export default function GoogleAuthSection({ text = 'signin_with', onSuccess, onError }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        text={text}
        theme="filled_black"
        shape="pill"
        size="large"
        width="360"
        useOneTap={false}
      />
    </div>
  );
}
