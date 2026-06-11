import { ingestSources } from './src/lib/services/ingestion.service';
import { processArticles } from './src/lib/services/ai.service';
import { generateWeeklyDigest } from './src/lib/services/digest.service';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('1. Starting ingestion...');
  const ingestResult = await ingestSources();
  console.log('Ingestion result:', ingestResult);

  console.log('\n2. Starting processing...');
  // process 3 batches to make sure we process some articles
  for (let i = 0; i < 3; i++) {
    console.log(`Processing batch ${i + 1}...`);
    const processResult = await processArticles();
    console.log('Processing result:', processResult);
    if (processResult.processedCount === 0 || processResult.hitDailyQuota) {
      break;
    }
  }

  console.log('\n3. Generating digest...');
  const digestMarkdown = await generateWeeklyDigest();
  
  const outputPath = path.join(__dirname, 'Sample_Weekly_Digest.md');
  fs.writeFileSync(outputPath, digestMarkdown, 'utf-8');
  console.log(`Digest written to ${outputPath}`);
}

main().catch(console.error).finally(() => process.exit(0));
