import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'

export default async function handler(req, res) {
  try {
    let fields = []
    const siteIds = BLOG.NOTION_PAGE_ID.split(',')

    for (let index = 0; index < siteIds.length; index++) {
      const siteId = siteIds[index]
      const id = extractLangId(siteId)
      const locale = extractLangPrefix(siteId)
      // 第一个id站点默认语言
      const siteData = await getGlobalData({
        pageId: id,
        from: 'sitemap.xml'
      })
      const link = siteConfig(
        'LINK',
        siteData?.siteInfo?.link,
        siteData.NOTION_CONFIG
      )
      const localeFields = generateLocalesSitemap(link, siteData.allPages, locale)
      fields = fields.concat(localeFields)
    }

    fields = getUniqueFields(fields)

    // 生成XML内容
    const xml = generateSitemapXml(fields)

    // 设置正确的Content-Type和缓存头
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=59')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    
    // 返回XML内容
    res.status(200).send(xml)
  } catch (error) {
    console.error('Error generating sitemap:', error)
    res.status(500).json({ error: 'Failed to generate sitemap' })
  }
}

function generateLocalesSitemap(link, allPages, locale) {
  // 确保链接不以斜杠结尾
  if (link && link.endsWith('/')) {
    link = link.slice(0, -1)
  }

  if (locale && locale.length > 0 && locale.indexOf('/') !== 0) {
    locale = '/' + locale
  }
  const dateNow = new Date().toISOString().split('T')[0]
  const defaultFields = [
    {
      loc: `${link}${locale}`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${link}${locale}/archive`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${link}${locale}/category`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${link}${locale}/rss/feed.xml`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${link}${locale}/search`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${link}${locale}/tag`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.7'
    }
  ]
  const postFields =
    allPages
      ?.filter(p => p.status === BLOG.NOTION_PROPERTY_NAME.status_publish)
      ?.map(post => {
        const slugWithoutLeadingSlash = post?.slug.startsWith('/')
          ? post?.slug?.slice(1)
          : post.slug
        return {
          loc: `${link}${locale}/${slugWithoutLeadingSlash}`,
          lastmod: new Date(post?.publishDay).toISOString().split('T')[0],
          changefreq: 'daily',
          priority: '0.7'
        }
      }) ?? []

  return defaultFields.concat(postFields)
}

function getUniqueFields(fields) {
  const uniqueFieldsMap = new Map()

  fields.forEach(field => {
    const existingField = uniqueFieldsMap.get(field.loc)

    if (!existingField || new Date(field.lastmod) > new Date(existingField.lastmod)) {
      uniqueFieldsMap.set(field.loc, field)
    }
  })

  return Array.from(uniqueFieldsMap.values())
}

function generateSitemapXml(fields) {
  let urlsXml = ''
  fields.forEach(field => {
    urlsXml += `<url>
  <loc>${field.loc}</loc>
  <lastmod>${field.lastmod}</lastmod>
  <changefreq>${field.changefreq}</changefreq>
  <priority>${field.priority}</priority>
</url>
`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`
}
