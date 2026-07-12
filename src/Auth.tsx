import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import { supabase } from './supabaseClient'

function Auth() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleSubmit = async () => {
    if (email === '' || password === '') {
      alert('メールアドレスとパスワードを入力してください')
      return
    }

    if (isLogin) {
      // ログイン
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        alert('ログインに失敗しました：' + error.message)
        return
      }
      alert('ログインしました！')
      navigate('/')
    } else {
      // 新規登録
      if (username === '') {
        alert('ユーザー名を入力してください')
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) {
        alert('登録に失敗しました：' + error.message)
        return
      }

      // プロフィール（ユーザー名）を作成
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: data.user.id, username })

        if (profileError) {
          alert('プロフィールの作成に失敗しました：' + profileError.message)
          return
        }
      }

      alert('登録しました！')
      navigate('/')
    }
  }

  return (
    <>
      <Header />
      <main className="main">
        <div className="post-form">
          <h1 className="post-title">{isLogin ? 'ログイン' : '新規登録'}</h1>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">ユーザー名</label>
              <input
                className="form-input"
                type="text"
                placeholder="ペンネーム"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">メールアドレス</label>
            <input
              className="form-input"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">パスワード</label>
            <input
              className="form-input"
              type="password"
              placeholder="6文字以上"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-submit" onClick={handleSubmit}>
            {isLogin ? 'ログイン' : '登録する'}
          </button>

          <p className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
          </p>
        </div>
      </main>
    </>
  )
}

export default Auth