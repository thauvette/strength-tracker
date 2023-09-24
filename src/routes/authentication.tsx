import { h } from 'preact';
import useAuthContext from '../context/supabase/auth';
import { useState } from 'preact/hooks';
import Icon from '../components/icon/Icon';
import { routes } from '../config/routes';
import { route } from 'preact-router';

const Authentication = () => {
  const { login } = useAuthContext();

  const [authState, setAuthState] = useState({
    loading: false,
    error: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  // TODO: what to do if authenticated?
  //  navigate back???

  const handleInput = (e) => {
    setAuthState({
      ...authState,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async () => {
    setAuthState({
      ...authState,
      loading: true,
      error: '',
    });
    try {
      await login(authState.email, authState.password);
      //   TODO: on success? go back?
      setAuthState({
        ...authState,
        loading: false,
        error: '',
        email: '',
        password: '',
      });
      route(routes.logs);
    } catch (err) {
      setAuthState({
        ...authState,
        loading: false,
        error: err?.message || 'Unable to authenticate',
      });
    }
  };

  return (
    <div class="px-4">
      <h1 class="mb-8">Login</h1>

      <input
        class="w-full mb-4"
        name="email"
        onInput={handleInput}
        placeholder="Email"
        value={authState.email}
      />
      <div class="relative mb-4">
        <input
          class="w-full"
          name="password"
          type={showPassword ? 'text' : 'password'}
          onInput={handleInput}
          placeholder="Password"
          value={authState.password}
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          class="absolute right-0 top-1/2 transform -translate-y-1/2"
        >
          <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} />
        </button>
      </div>
      <button
        disabled={
          !authState.email || authState.password.length < 5 || authState.loading
        }
        class={`btn primary w-full disabled:opacity-50 ${
          authState.loading ? 'animate-pulse' : ''
        }`}
        onClick={submit}
      >
        {authState.loading ? 'Logging in' : 'Submit'}
      </button>
      {authState.error && (
        <p class="text-center mt-2 font-bold"> {authState.error}</p>
      )}
    </div>
  );
};
export default Authentication;
