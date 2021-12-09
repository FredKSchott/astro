import fs from 'fs';
import execa from 'execa';
import { fileURLToPath } from 'url';

export default async function run() {
  const examplesUrl = new URL('../../examples/', import.meta.url);
  const examplesToTest = fs
    .readdirSync(examplesUrl)
    .map((filename) => new URL(filename, examplesUrl))
    .filter((fileUrl) => fs.statSync(fileUrl).isDirectory());
  const allProjectsToTest = [...examplesToTest, new URL('../../www', import.meta.url), new URL('../../docs', import.meta.url)];

  console.log('');
  for (const projectToTest of allProjectsToTest) {
    const filePath = fileURLToPath(projectToTest);
    console.log('  🤖 Testing', filePath, '\n');
    const result = await execa('yarn', ['build'], { cwd: fileURLToPath(projectToTest), stdout: 'inherit', stderr: 'inherit' });
    if (result instanceof Error) {
      throw result;
    }
    console.log('\n  🤖 Test complete.');
  }
}

run();
