import Header from './Header'

function Privacy() {
  return (
    <>
      <Header />
      <main className="main">
        <div className="legal">
          <h1 className="legal-title">プライバシーポリシー</h1>
          <p className="legal-date">最終更新日：2026年7月13日</p>

          <section className="legal-section">
            <h2>1. 取得する情報</h2>
            <p>
              本サービスは、アカウント登録時にメールアドレスおよびユーザー名を
              取得します。また、利用者が投稿した作品・コメント等の情報を保存します。
            </p>
          </section>

          <section className="legal-section">
            <h2>2. 情報の利用目的</h2>
            <p>
              取得した情報は、本サービスの提供・運営、利用者の認証、
              サービスの改善のために利用します。
            </p>
          </section>

          <section className="legal-section">
            <h2>3. 情報の管理</h2>
            <p>
              取得した情報は、認証基盤としてSupabaseを利用して保管します。
              運営者は、情報の漏洩・改ざん等を防ぐよう努めます。
            </p>
          </section>

          <section className="legal-section">
            <h2>4. 第三者提供</h2>
            <p>
              運営者は、法令に基づく場合を除き、利用者の同意なく個人情報を
              第三者に提供しません。
            </p>
          </section>

          <section className="legal-section">
            <h2>5. お問い合わせ</h2>
            <p>
              本ポリシーに関するお問い合わせは、運営者までご連絡ください。
            </p>
          </section>
        </div>
      </main>
    </>
  )
}

export default Privacy