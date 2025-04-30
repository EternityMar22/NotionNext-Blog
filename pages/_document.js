// eslint-disable-next-line @next/next/no-document-import-in-page
import BLOG from '@/blog.config'
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // 检查是否是sitemap.xml请求
    const isSitemap = ctx.pathname === '/sitemap.xml'

    // 如果是sitemap.xml请求，返回空的样式数组
    if (isSitemap) {
      return {
        html: '',
        head: [],
        styles: [],
      }
    }

    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang={BLOG.LANG}>
        <Head>

          {/* FontAwesome已移至FontAwesomeLazy组件中懒加载 */}
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
