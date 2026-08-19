import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescriptConfig from 'eslint-config-next/typescript'

const eslintConfig = [
  ...coreWebVitals,
  ...typescriptConfig,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      '.screens/**',
      // reference export from Claude Design, kept for comparison — not our source
      'RTL Bakery Homepage Demo/**',
      // Payload-generated; do not hand-edit
      'src/migrations/**',
    ],
  },
]

export default eslintConfig
