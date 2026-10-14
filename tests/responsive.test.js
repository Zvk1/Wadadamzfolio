import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pipelineGeometry, pipelineBranches, scrollProgress } from '../src/pipeline-geometry.js';

test('routes stay inside phone, tablet, and desktop widths and reach the footer', () => {
  for (const width of [320, 375, 768, 1024, 1440, 2560]) {
    for (const height of [2800, 6500, 12000]) {
      const paths = pipelineGeometry(width, height, [80, 1000, 1700, 2400, height - 400]);
      paths.forEach(path => {
        assert.ok(path.endsWith(`V${height}`));
        for (const match of path.matchAll(/[ML]([\d.]+) ([\d.]+)/g)) {
          assert.ok(Number(match[1]) >= 0 && Number(match[1]) <= width);
          assert.ok(Number(match[2]) >= 0 && Number(match[2]) <= height);
        }
      });
    }
  }
});
test('scroll progress is bounded and completes at the bottom', () => {
  assert.equal(scrollProgress(4200, 800, 5000), 1);
  assert.equal(scrollProgress(6000, 800, 5000), 1);
  assert.ok(scrollProgress(2000, 800, 5000) > scrollProgress(1000, 800, 5000));
  assert.equal(scrollProgress(-1000, 800, 5000), 0);
});
test('only the five numbered sections remain and skills are inside About', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const ids = [...html.matchAll(/<section id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids, ['about', 'projects', 'ctfs', 'certifications', 'contact']);
  const about = html.match(/<section id="about"[\s\S]*?<\/section>/)[0];
  assert.ok(about.includes('id="skills"'));
  assert.ok(!html.includes('On the workbench'));
  assert.ok(!html.includes('aria-label="Z logo"'));
  assert.ok(!html.includes('class="monogram"'));
});

test('branches offer distinct routes without extending outside narrow screens', () => {
  for (const width of [320, 375, 768, 1440, 2560]) {
    const paths = pipelineBranches(width, 6000, [80, 1500, 2600, 3700, 4800]);
    assert.equal(paths.length, 8);
    assert.equal(new Set(paths).size, paths.length);
    paths.forEach(path => {
      for (const match of path.matchAll(/[ML]([\d.]+) ([\d.]+)/g)) {
        assert.ok(Number(match[1]) >= 0 && Number(match[1]) <= width);
        assert.ok(Number(match[2]) >= 0 && Number(match[2]) <= 6000);
      }
    });
  }
});
