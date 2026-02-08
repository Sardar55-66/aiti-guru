import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../shared/api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import Input from '../../shared/ui/Input/Input';
import Button from '../../shared/ui/Button/Button';
import Checkbox from '../../shared/ui/Checkbox/Checkbox';
import styles from './Login.module.scss';

export default function Login() {
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Заполните все поля');
      return;
    }

    try {
      setLoading(true);
      const res = await loginRequest({
        username: username.trim(),
        password: password.trim(),
      });

      const token = res.data?.accessToken;
      if (!token) throw new Error('Нет токена в ответе');
      login(token, remember);
      navigate('/products');
    } catch {
      setError('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img className={styles.logoImg} src="/src/assets/loginpage-logo.png" alt="logo" />
        <h1 className={styles.title}>Добро пожаловать!</h1>
        <p className={styles.subtitle}>Пожалуйста, авторизируйтесь</p>

        {/* Логин */}
        <Input
          label="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="test"
          iconLeft={<img src="/src/assets/user-icon.png" alt="user-icon" />}
          onClear={() => setUsername('')}
          error={error && !username.trim() ? 'Заполните логин' : undefined}
          wrapperClassName={styles.loginInputWrapper}
        />

        {/* Пароль */}
        <Input
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Введите пароль"
          iconLeft={<img src="/src/assets/lock-03.png" alt="lock-icon" />}
          iconRight={
            <img
              src={showPassword ? "/src/assets/eye-off.png" : "/src/assets/eye-on.png"}
              alt="toggle-password"
              onClick={() => setShowPassword(v => !v)}
              style={{ cursor: 'pointer', width: '24px', height: '24px' }}
            />
          }
          onClear={() => setPassword('')}
          error={error && !password.trim() ? 'Заполните пароль' : undefined}
          wrapperClassName={styles.loginInputWrapper}
        />

        {/* Общая ошибка */}
        {error && username.trim() && password.trim() && (
          <div className={styles.error}>{error}</div>
        )}

        {/* Remember me */}
        <label className={styles.remember}>
          <Checkbox
            checked={remember}
            onCheckedChange={setRemember}
          />
          Запомнить данные
        </label>

        {/* Кнопка */}
        <Button
          variant="primary"
          onClick={submit}
          loading={loading}
          className={styles.loginButton}
        >
          Войти
        </Button>

        <div className={styles.divider}>или</div>
        <p className={styles.footer}>
          Нет аккаунта? <a>Создать</a>
        </p>
      </div>
    </div>
  );
}
