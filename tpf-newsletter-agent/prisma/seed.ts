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
