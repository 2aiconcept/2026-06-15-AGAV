import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/vitest.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // --- Contraintes par TYPE (sens de dépendance autorisé) ---
            // L'app (shell) compose tout : features + briques transverses.
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:data-access',
                'type:util',
              ],
            },
            // Une feature (smart, routée) orchestre ui + data-access + util,
            // mais ne dépend JAMAIS d'une autre feature.
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:ui', 'type:data-access', 'type:util'],
            },
            // L'ui (présentationnel) reste pur : pas d'accès aux services data-access.
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:util'],
            },
            // data-access (services/état/HTTP) ne consomme que d'autres data-access + util.
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:util'],
            },
            // util (helpers/types purs) est une feuille : il ne dépend que de util.
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },

            // --- Contraintes par SCOPE (isolation des domaines) ---
            // L'app peut traverser tous les domaines.
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: [
                'scope:companies',
                'scope:contacts',
                'scope:orders',
                'scope:connect',
                'scope:not-found',
                'scope:shared',
              ],
            },
            // Chaque domaine reste autonome : il ne dépend que de lui-même et de shared.
            {
              sourceTag: 'scope:companies',
              onlyDependOnLibsWithTags: ['scope:companies', 'scope:shared'],
            },
            {
              sourceTag: 'scope:contacts',
              onlyDependOnLibsWithTags: ['scope:contacts', 'scope:shared'],
            },
            {
              sourceTag: 'scope:orders',
              onlyDependOnLibsWithTags: ['scope:orders', 'scope:shared'],
            },
            {
              sourceTag: 'scope:connect',
              onlyDependOnLibsWithTags: ['scope:connect', 'scope:shared'],
            },
            {
              sourceTag: 'scope:not-found',
              onlyDependOnLibsWithTags: ['scope:not-found', 'scope:shared'],
            },
            // shared est transverse mais fermé : il ne dépend que de shared.
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
