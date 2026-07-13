import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import type { User } from '@supabase/supabase-js'

function Header() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // プロフィールがなければ作る関数
    const ensureProfile = async (currentUser: User | null) => {
      if (!currentUser) return

      // すでにプロフィールがあるか確認
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentUser.id)
        .maybeSingle()

      // なければ作る（ユーザー名は登録時に預けたもの）
      if (!existing) {
        const username = currentUser.user_metadata?.username ?? '名無し'
        await supabase
          .from('profiles')
          .insert({ id: currentUser.id, username })
      }
    }

    // 今のログイン状態を取得
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      ensureProfile(data.user)
    })

    // ログイン状態の変化を監視
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      ensureProfile(currentUser)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    alert('ログアウトしました')
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link className="logo" to="/">📖 MangaHub</Link>
        <nav className="nav">
          <Link className="btn-post" to="/post">投稿する</Link>
          {user ? (
            <>
              <Link className="btn-login" to="/dashboard">ワークスペース</Link>
              <span className="user-email">{user.email}</span>
              <button className="btn-login" onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <Link className="btn-login" to="/auth">ログイン</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header