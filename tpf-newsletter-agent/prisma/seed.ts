import { prisma } from '../src/lib/db/prisma'

async function main() {
  const sources = [
    {
      name: 'OpenAI Blog',
      url: 'https://openai.com/blog',
      rssUrl: 'https://openai.com/blog/rss.xml',
    },
    {
      name: 'Hugging Face Blog',
      url: 'https://huggingface.co/blog',
      rssUrl: 'https://huggingface.co/blog/feed.xml',
    },
    {
      name: 'TechCrunch AI',
      url: 'https://techcrunch.com/category/artificial-intelligence/',
      rssUrl: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    },
    {
      name: 'The Verge AI',
      url: 'https://www.theverge.com/artificial-intelligence',
      rssUrl: 'https://www.theverge.com/rss/artificial-intelligence/index.xml',
    },
    {
      name: 'MIT Technology Review AI',
      url: 'https://www.technologyreview.com/topic/artificial-intelligence',
      rssUrl: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
    },
  ]

  for (const source of sources) {
    await prisma.source.upsert({
      where: { rssUrl: source.rssUrl },
      update: {},
      create: source,
    })
  }

  console.log('Seeded sources')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
