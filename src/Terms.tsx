import Header from './components/Header'

function Terms() {
  return (
    <>
      <Header />
      <main className="main">
        <div className="legal">
          <h1 className="legal-title">利用規約</h1>
          <p className="legal-date">最終更新日：2026年7月13日</p>

          <section className="legal-section">
            <h2>第1条（適用）</h2>
            <p>
              本規約は、MangaHub（以下「本サービス」）の利用条件を定めるものです。
              利用者は本規約に同意した上で本サービスを利用するものとします。
            </p>
          </section>

          <section className="legal-section">
            <h2>第2条（アカウント）</h2>
            <p>
              利用者は、登録情報を自己の責任で管理するものとします。
              アカウントの不正利用によって生じた損害について、運営者は責任を負いません。
            </p>
          </section>

          <section className="legal-section">
            <h2>第3条（投稿コンテンツ）</h2>
            <p>
              利用者が投稿した作品等の権利は、投稿した利用者に帰属します。
              利用者は、第三者の権利を侵害する内容を投稿してはなりません。
            </p>
          </section>

          <section className="legal-section">
            <h2>第4条（禁止事項）</h2>
            <p>
              利用者は、以下の行為をしてはなりません。
              法令または公序良俗に違反する行為、他者を誹謗中傷する行為、
              第三者の権利を侵害する行為、本サービスの運営を妨害する行為、
              その他運営者が不適切と判断する行為。
            </p>
          </section>

          <section className="legal-section">
            <h2>第5条（コンテンツの削除）</h2>
            <p>
              運営者は、投稿内容が本規約に違反すると判断した場合、
              事前の通知なく当該コンテンツを削除できるものとします。
            </p>
          </section>

          <section className="legal-section">
            <h2>第6条（免責事項）</h2>
            <p>
              本サービスは現状有姿で提供されます。運営者は、本サービスの
              完全性・正確性・有用性等について保証しません。本サービスの
              利用により生じた損害について、運営者は責任を負いません。
            </p>
          </section>

          <section className="legal-section">
            <h2>第7条（規約の変更）</h2>
            <p>
              運営者は、必要と判断した場合、利用者に通知することなく
              本規約を変更できるものとします。
            </p>
          </section>
        </div>
      </main>
    </>
  )
}

export default Terms